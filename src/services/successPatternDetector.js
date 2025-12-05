// ============================================
// Success Pattern Detector (JavaScript)
// ============================================

// Assumed import (The original code imports supabase client)
import { supabase } from '@/integrations/supabase/client';

/**
 * @typedef {Object} SuccessPattern
 * @property {string} [id]
 * @property {string} brandId
 * @property {string} patternName
 * @property {'element_combination' | 'sequence' | 'audience_match' | 'temporal' | 'channel_mix'} patternType
 * @property {string} patternDescription
 * @property {any} patternRules
 * @property {number} sampleSize
 * @property {number} avgPerformanceLift
 * @property {number} confidenceScore
 * @property {string[]} applicableAudiences
 * @property {string[]} applicableChannels
 * @property {string} [therapeuticContext]
 */

// Detection configuration - relaxed thresholds for current data volumes
const DETECTION_CONFIG = {
    elements: {
        minScore: 20,       // Lowered from 60
        minUsage: 1,        // Lowered from 5
        minLift: 5,         // Lowered from 15
    },
    audience: {
        minSamples: 5,      // Lowered from 10
        minLift: 5,         // Lowered from 10
    },
    temporal: {
        minSamples: 10,     // Lowered from 30
        minDaySamples: 3,   // Lowered from 5
        minLift: 5,         // Lowered from 15
    },
};

export class SuccessPatternDetector {
    /**
     * Detect patterns from element performance data
     * @param {string} brandId
     * @returns {Promise<SuccessPattern[]>}
     */
    static async detectElementCombinationPatterns(brandId) {
        try {
            /** @type {SuccessPattern[]} */
            const patterns = [];

            // Get top performing elements - using relaxed thresholds
            const { data: topTones } = await supabase
                .from('content_element_performance')
                .select('*')
                .eq('brand_id', brandId)
                .eq('element_type', 'tone')
                .gte('avg_performance_score', DETECTION_CONFIG.elements.minScore)
                .gte('usage_count', DETECTION_CONFIG.elements.minUsage);

            const { data: topCTAs } = await supabase
                .from('content_element_performance')
                .select('*')
                .eq('brand_id', brandId)
                .eq('element_type', 'cta_type')
                .gte('avg_performance_score', DETECTION_CONFIG.elements.minScore)
                .gte('usage_count', DETECTION_CONFIG.elements.minUsage);

            const { data: topComplexity } = await supabase
                .from('content_element_performance')
                .select('*')
                .eq('brand_id', brandId)
                .eq('element_type', 'complexity')
                .gte('avg_performance_score', DETECTION_CONFIG.elements.minScore)
                .gte('usage_count', DETECTION_CONFIG.elements.minUsage);

            // Create combination patterns: Tone + CTA
            if (topTones && topCTAs) {
                for (const tone of topTones) {
                    for (const cta of topCTAs) {
                        const avgLift = ((tone.avg_performance_score + cta.avg_performance_score) / 2) - 50;
                        if (avgLift > DETECTION_CONFIG.elements.minLift) {
                            /** @type {SuccessPattern} */
                            const pattern = {
                                brandId,
                                patternName: `${tone.element_value} Tone + ${cta.element_value} CTA`,
                                patternType: 'element_combination',
                                patternDescription: `Combining ${tone.element_value} tone with ${cta.element_value} CTA drives ${avgLift.toFixed(1)}% performance lift`,
                                patternRules: {
                                    elements: [
                                        { type: 'tone', value: tone.element_value },
                                        { type: 'cta_type', value: cta.element_value },
                                    ],
                                    minLift: avgLift,
                                },
                                sampleSize: Math.min(tone.usage_count, cta.usage_count),
                                avgPerformanceLift: avgLift,
                                confidenceScore: this.calculateConfidence(Math.min(tone.usage_count, cta.usage_count), avgLift),
                                applicableAudiences: [],
                                applicableChannels: ['email', 'web'],
                            };
                            patterns.push(pattern);
                        }
                    }
                }
            }

            // Complexity + Tone patterns
            if (topComplexity && topTones) {
                for (const complexity of topComplexity) {
                    for (const tone of topTones) {
                        const avgLift = ((complexity.avg_performance_score + tone.avg_performance_score) / 2) - 50;
                        if (avgLift > DETECTION_CONFIG.elements.minLift) {
                            /** @type {SuccessPattern} */
                            const pattern = {
                                brandId,
                                patternName: `${complexity.element_value} Complexity + ${tone.element_value} Tone`,
                                patternType: 'element_combination',
                                patternDescription: `${complexity.element_value} complexity content with ${tone.element_value} tone performs ${avgLift.toFixed(1)}% above baseline`,
                                patternRules: {
                                    elements: [
                                        { type: 'complexity', value: complexity.element_value },
                                        { type: 'tone', value: tone.element_value },
                                    ],
                                    minLift: avgLift,
                                },
                                sampleSize: Math.min(complexity.usage_count, tone.usage_count),
                                avgPerformanceLift: avgLift,
                                confidenceScore: this.calculateConfidence(Math.min(complexity.usage_count, tone.usage_count), avgLift),
                                applicableAudiences: [],
                                applicableChannels: ['email', 'web', 'rep_presentation'],
                            };
                            patterns.push(pattern);
                        }
                    }
                }
            }

            return patterns;
        } catch (error) {
            console.error('Error detecting element combination patterns:', error);
            return [];
        }
    }

    /**
     * Detect audience-specific patterns
     * @param {string} brandId
     * @returns {Promise<SuccessPattern[]>}
     */
    static async detectAudienceMatchPatterns(brandId) {
        try {
            /** @type {SuccessPattern[]} */
            const patterns = [];

            // Get performance by audience segment
            const { data: allAudienceData } = await supabase
                .from('content_performance_attribution')
                .select('audience_segment, engagement_rate')
                .eq('brand_id', brandId)
                .not('audience_segment', 'is', null);

            if (!allAudienceData) return patterns;

            // Manually group by audience segment
            /** @type {{ [key: string]: number[] }} */
            const audienceGroups = {};
            allAudienceData.forEach(item => {
                if (item.audience_segment && item.engagement_rate !== null) {
                    if (!audienceGroups[item.audience_segment]) {
                        audienceGroups[item.audience_segment] = [];
                    }
                    audienceGroups[item.audience_segment].push(item.engagement_rate);
                }
            });

            // Calculate averages
            const audiencePerf = Object.entries(audienceGroups)
                .filter(([_, values]) => values.length >= DETECTION_CONFIG.audience.minSamples)
                .map(([segment, values]) => ({
                    audience_segment: segment,
                    avg_engagement: values.reduce((sum, v) => sum + v, 0) / values.length,
                    sample_size: values.length,
                }));

            // Find above-average performing audiences
            const overallAvg = audiencePerf.reduce((sum, a) => sum + parseFloat(a.avg_engagement || 0), 0) / audiencePerf.length;

            for (const audience of audiencePerf) {
                const lift = ((parseFloat(audience.avg_engagement) - overallAvg) / overallAvg) * 100;
                if (lift > DETECTION_CONFIG.audience.minLift) {
                    /** @type {SuccessPattern} */
                    const pattern = {
                        brandId,
                        patternName: `High Engagement: ${audience.audience_segment}`,
                        patternType: 'audience_match',
                        patternDescription: `${audience.audience_segment} audience shows ${lift.toFixed(1)}% higher engagement than average`,
                        patternRules: {
                            targetAudience: audience.audience_segment,
                            minEngagementLift: lift,
                        },
                        sampleSize: parseInt(audience.sample_size),
                        avgPerformanceLift: lift,
                        confidenceScore: this.calculateConfidence(parseInt(audience.sample_size), lift),
                        applicableAudiences: [audience.audience_segment],
                        applicableChannels: ['email', 'web', 'rep_presentation'],
                    };
                    patterns.push(pattern);
                }
            }

            return patterns;
        } catch (error) {
            console.error('Error detecting audience match patterns:', error);
            return [];
        }
    }

    /**
     * Detect temporal patterns (time-based)
     * @param {string} brandId
     * @returns {Promise<SuccessPattern[]>}
     */
    static async detectTemporalPatterns(brandId) {
        try {
            /** @type {SuccessPattern[]} */
            const patterns = [];

            // Get performance over the last 90 days (simplified)
            const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            const { data: datePerf } = await supabase
                .from('content_performance_attribution')
                .select('measurement_date, engagement_rate, source_system')
                .eq('brand_id', brandId)
                .gte('measurement_date', ninetyDaysAgo)
                .order('measurement_date', { ascending: false });

            if (!datePerf || datePerf.length < DETECTION_CONFIG.temporal.minSamples) return patterns;

            // Analyze by day of week
            /** @type {{ [key: number]: { total: number; count: number } }} */
            const dayPerformance = {};

            datePerf.forEach(perf => {
                const date = new Date(perf.measurement_date);
                const dayOfWeek = date.getDay(); // 0 = Sunday

                if (!dayPerformance[dayOfWeek]) {
                    dayPerformance[dayOfWeek] = { total: 0, count: 0 };
                }

                dayPerformance[dayOfWeek].total += perf.engagement_rate || 0;
                dayPerformance[dayOfWeek].count += 1;
            });

            // Calculate averages
            const dayAverages = Object.entries(dayPerformance).map(([day, perf]) => ({
                day: parseInt(day),
                avg: perf.total / perf.count,
                count: perf.count,
            }));

            const overallAvg = dayAverages.reduce((sum, d) => sum + d.avg, 0) / dayAverages.length;
            const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

            for (const dayData of dayAverages) {
                const lift = ((dayData.avg - overallAvg) / overallAvg) * 100;
                if (Math.abs(lift) > DETECTION_CONFIG.temporal.minLift && dayData.count >= DETECTION_CONFIG.temporal.minDaySamples) {
                    /** @type {SuccessPattern} */
                    const pattern = {
                        brandId,
                        patternName: `${dayNames[dayData.day]} ${lift > 0 ? 'Peak' : 'Low'} Performance`,
                        patternType: 'temporal',
                        patternDescription: `Content sent on ${dayNames[dayData.day]} shows ${Math.abs(lift).toFixed(1)}% ${lift > 0 ? 'higher' : 'lower'} engagement`,
                        patternRules: {
                            dayOfWeek: dayData.day,
                            expectedLift: lift,
                        },
                        sampleSize: dayData.count,
                        avgPerformanceLift: lift,
                        confidenceScore: this.calculateConfidence(dayData.count, Math.abs(lift)),
                        applicableAudiences: [],
                        applicableChannels: ['email'],
                    };
                    patterns.push(pattern);
                }
            }

            return patterns;
        } catch (error) {
            console.error('Error detecting temporal patterns:', error);
            return [];
        }
    }

    /**
     * Save discovered patterns to database
     * @param {SuccessPattern[]} patterns
     * @returns {Promise<void>}
     */
    static async savePatterns(patterns) {
        try {
            for (const pattern of patterns) {
                await supabase
                    .from('content_success_patterns')
                    .upsert({
                        brand_id: pattern.brandId,
                        pattern_name: pattern.patternName,
                        pattern_type: pattern.patternType,
                        pattern_description: pattern.patternDescription,
                        pattern_rules: pattern.patternRules,
                        sample_size: pattern.sampleSize,
                        avg_performance_lift: pattern.avgPerformanceLift,
                        confidence_score: pattern.confidenceScore,
                        applicable_audiences: pattern.applicableAudiences,
                        applicable_channels: pattern.applicableChannels,
                        therapeutic_context: pattern.therapeuticContext,
                        validation_status: pattern.confidenceScore >= 75 ? 'validated' : 'discovered',
                    }, {
                        onConflict: 'brand_id,pattern_name',
                    });
            }

            console.log(`Saved ${patterns.length} success patterns`);
        } catch (error) {
            console.error('Error saving patterns:', error);
            throw error;
        }
    }

    /**
     * Run full pattern detection
     * @param {string} brandId
     * @returns {Promise<SuccessPattern[]>}
     */
    static async runPatternDetection(brandId) {
        try {
            /** @type {SuccessPattern[]} */
            const allPatterns = [];

            // Run all detection methods
            const elementPatterns = await this.detectElementCombinationPatterns(brandId);
            const audiencePatterns = await this.detectAudienceMatchPatterns(brandId);
            const temporalPatterns = await this.detectTemporalPatterns(brandId);

            allPatterns.push(...elementPatterns, ...audiencePatterns, ...temporalPatterns);

            // Save to database
            await this.savePatterns(allPatterns);

            return allPatterns;
        } catch (error) {
            console.error('Error running pattern detection:', error);
            throw error;
        }
    }

    /**
     * Get validated patterns for theme generation
     * @param {string} brandId
     * @param {number} [limit=20]
     * @returns {Promise<SuccessPattern[] | []>}
     */
    static async getValidatedPatterns(brandId, limit = 20) {
        try {
            const { data, error } = await supabase
                .from('content_success_patterns')
                .select('*')
                .eq('brand_id', brandId)
                .in('validation_status', ['validated', 'discovered'])
                .is('retired_at', null)
                .gte('confidence_score', 60)
                .order('avg_performance_lift', { ascending: false })
                .limit(limit);

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error getting validated patterns:', error);
            return [];
        }
    }

    /**
     * Calculate confidence score based on sample size and lift
     * @private
     * @param {number} sampleSize
     * @param {number} lift
     * @returns {number}
     */
    static calculateConfidence(sampleSize, lift) {
        // Simple confidence calculation
        // Higher sample size and higher lift = higher confidence
        // sizeScore max 50 points
        const sizeScore = Math.min(sampleSize / 50, 1) * 50; 
        // liftScore max 50 points
        const liftScore = Math.min(Math.abs(lift) / 30, 1) * 50; 

        return Math.round(sizeScore + liftScore);
    }
}