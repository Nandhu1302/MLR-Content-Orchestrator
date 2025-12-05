import { supabase } from '@/integrations/supabase/client';

/**
 * @typedef {Object} IntelligenceImpactAnalysis
 * @property {Array<{ layerType: string, averagePerformance: number, sampleSize: number }>} mostImpactfulLayers
 * @property {Array<{ combination: string[], performance: number, count: number }>} layerCombinations
 * @property {string[]} recommendations
 */

export class PerformanceAnalysisService {
    /**
     * Analyze which intelligence layers led to better performance
     * @param {string} brandId
     * @returns {Promise<IntelligenceImpactAnalysis>}
     */
    static async analyzeIntelligenceImpact(brandId) {
        console.log('📊 Analyzing intelligence impact for brand:', brandId);

        // 1. Query all content with performance data
        const contentPerformance = await this.queryContentMetrics(brandId);

        if (!contentPerformance || contentPerformance.length === 0) {
            console.log('⚠️ No performance data available yet');
            return {
                mostImpactfulLayers: [],
                layerCombinations: [],
                recommendations: ['Collect performance data to enable intelligence impact analysis']
            };
        }

        // 2. Group by intelligence layers used
        const layerGroups = this.groupByIntelligenceLayers(contentPerformance);

        // 3. Calculate average performance by layer combination
        const layerImpact = this.calculateLayerImpact(layerGroups);

        // 4. Identify winning patterns
        const winningPatterns = this.identifyWinningPatterns(layerImpact);

        return {
            mostImpactfulLayers: winningPatterns.individual,
            layerCombinations: winningPatterns.combinations,
            recommendations: this.generateRecommendations(winningPatterns)
        };
    }

    /**
     * Feed performance back into intelligence generation
     * @param {string} intelligenceType
     * @param {string} brandId
     * @returns {Promise<void>}
     */
    static async enrichIntelligenceWithPerformance(
        intelligenceType,
        brandId
    ) {
        console.log('🔄 Enriching intelligence with performance data:', { intelligenceType, brandId });

        // 1. Get performance data for this intelligence type
        const performanceData = await this.getPerformanceByIntelligence(intelligenceType, brandId);

        // 2. Identify what worked
        const successPatterns = this.extractSuccessPatterns(performanceData);

        // 3. Update intelligence recommendations
        await this.updateIntelligenceRecommendations(intelligenceType, brandId, successPatterns);
    }

    /**
     * Track content performance metrics
     * @param {string} assetId
     * @param {string} themeId
     * @param {any[]} intelligenceLayers
     * @param {{ open_rate?: number, click_rate?: number, conversion_rate?: number, engagement_score?: number }} campaignMetrics
     * @param {string} audienceSegment
     * @param {string} market
     * @returns {Promise<void>}
     */
    static async trackPerformance(
        assetId,
        themeId,
        intelligenceLayers,
        campaignMetrics,
        audienceSegment,
        market
    ) {
        const performanceScore = this.calculatePerformanceScore(campaignMetrics);

        const { error } = await supabase
            .from('content_performance_metrics')
            .insert({
                asset_id: assetId,
                theme_id: themeId,
                intelligence_layers_used: intelligenceLayers.map(l => ({
                    type: l.intelligence_type,
                    incorporated: l.incorporated
                })),
                campaign_metrics: campaignMetrics,
                audience_segment: audienceSegment,
                market: market,
                performance_score: performanceScore
            });

        if (error) {
            console.error('Failed to track performance:', error);
        } else {
            console.log('✅ Performance tracked:', { assetId, performanceScore });
        }
    }

    /**
     * Get performance trends over time
     * @param {string} brandId
     * @param {number} [days=30]
     * @returns {Promise<any>}
     */
    static async getPerformanceTrends(brandId, days = 30) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const { data: themes } = await supabase
            .from('theme_library')
            .select('id')
            .eq('brand_id', brandId);

        if (!themes || themes.length === 0) return null;

        const themeIds = themes.map(t => t.id);

        const { data: metrics } = await supabase
            .from('content_performance_metrics')
            .select('*')
            .in('theme_id', themeIds)
            .gte('collected_at', startDate.toISOString())
            .order('collected_at', { ascending: true });

        if (!metrics) return null;

        return this.analyzeTrends(metrics);
    }

    // Private helper methods

    /**
     * @private
     * @param {string} brandId
     * @returns {Promise<any[]>}
     */
    static async queryContentMetrics(brandId) {
        const { data: themes } = await supabase
            .from('theme_library')
            .select('id')
            .eq('brand_id', brandId);

        if (!themes || themes.length === 0) return [];

        const themeIds = themes.map(t => t.id);

        const { data: metrics } = await supabase
            .from('content_performance_metrics')
            .select('*')
            .in('theme_id', themeIds)
            .order('collected_at', { ascending: false })
            .limit(200);

        return metrics || [];
    }

    /**
     * @private
     * @param {any[]} contentPerformance
     * @returns {Map<string, any[]>}
     */
    static groupByIntelligenceLayers(contentPerformance) {
        const groups = new Map();

        contentPerformance.forEach(item => {
            const layers = item.intelligence_layers_used || [];
            const key = this.getLayerKey(layers);

            if (!groups.has(key)) {
                groups.set(key, []);
            }
            groups.get(key).push(item);
        });

        return groups;
    }

    /**
     * @private
     * @param {any[]} layers
     * @returns {string}
     */
    static getLayerKey(layers) {
        const incorporated = layers
            .filter(l => l.incorporated)
            .map(l => l.type)
            .sort();
        return incorporated.join(',') || 'none';
    }

    /**
     * @private
     * @param {Map<string, any[]>} layerGroups
     * @returns {any[]}
     */
    static calculateLayerImpact(layerGroups) {
        const results = [];

        layerGroups.forEach((items, key) => {
            const avgPerformance = items.reduce((sum, item) =>
                sum + (item.performance_score || 0), 0
            ) / items.length;

            results.push({
                layers: key.split(',').filter(l => l),
                averagePerformance: avgPerformance,
                sampleSize: items.length
            });
        });

        return results.sort((a, b) => b.averagePerformance - a.averagePerformance);
    }

    /**
     * @private
     * @param {any[]} layerImpact
     * @returns {any}
     */
    static identifyWinningPatterns(layerImpact) {
        const individual = new Map();

        layerImpact.forEach(impact => {
            impact.layers.forEach((layer) => {
                if (!individual.has(layer)) {
                    individual.set(layer, { total: 0, count: 0 });
                }
                const stats = individual.get(layer);
                stats.total += impact.averagePerformance * impact.sampleSize;
                stats.count += impact.sampleSize;
            });
        });

        const individualResults = Array.from(individual.entries()).map(([layerType, stats]) => ({
            layerType,
            averagePerformance: stats.total / stats.count,
            sampleSize: stats.count
        })).sort((a, b) => b.averagePerformance - a.averagePerformance);

        const combinations = layerImpact
            .filter(impact => impact.sampleSize >= 3)
            .slice(0, 10)
            .map(impact => ({
                combination: impact.layers,
                performance: impact.averagePerformance,
                count: impact.sampleSize
            }));

        return { individual: individualResults, combinations };
    }

    /**
     * @private
     * @param {any} winningPatterns
     * @returns {string[]}
     */
    static generateRecommendations(winningPatterns) {
        const recommendations = [];

        if (winningPatterns.individual.length > 0) {
            const best = winningPatterns.individual[0];
            recommendations.push(
                `Prioritize ${best.layerType} intelligence - shows ${best.averagePerformance.toFixed(1)}% better performance`
            );
        }

        if (winningPatterns.combinations.length > 0) {
            const bestCombo = winningPatterns.combinations[0];
            recommendations.push(
                `Optimal intelligence combination: ${bestCombo.combination.join(' + ')}`
            );
        }

        recommendations.push('Continue tracking performance to refine intelligence impact');

        return recommendations;
    }

    /**
     * @private
     * @param {string} intelligenceType
     * @param {string} brandId
     * @returns {Promise<any[]>}
     */
    static async getPerformanceByIntelligence(
        intelligenceType,
        brandId
    ) {
        const metrics = await this.queryContentMetrics(brandId);

        return metrics.filter(item => {
            const layers = item.intelligence_layers_used || [];
            return layers.some((l) => l.type === intelligenceType && l.incorporated);
        });
    }

    /**
     * @private
     * @param {any[]} performanceData
     * @returns {any}
     */
    static extractSuccessPatterns(performanceData) {
        const successful = performanceData
            .filter(item => (item.performance_score || 0) > 0.7)
            .sort((a, b) => (b.performance_score || 0) - (a.performance_score || 0));

        return {
            topPerformers: successful.slice(0, 10),
            averageScore: successful.length > 0
                ? successful.reduce((sum, item) => sum + (item.performance_score || 0), 0) / successful.length
                : 0,
            commonPatterns: this.extractCommonPatterns(successful)
        };
    }

    /**
     * @private
     * @param {any[]} items
     * @returns {string[]}
     */
    static extractCommonPatterns(items) {
        const patterns = new Set();

        items.forEach(item => {
            const layers = item.intelligence_layers_used || [];
            layers.forEach((l) => {
                if (l.incorporated) patterns.add(l.type);
            });
        });

        return Array.from(patterns);
    }

    /**
     * @private
     * @param {string} intelligenceType
     * @param {string} brandId
     * @param {any} successPatterns
     * @returns {Promise<void>}
     */
    static async updateIntelligenceRecommendations(
        intelligenceType,
        brandId,
        successPatterns
    ) {
        console.log('📝 Updating intelligence recommendations:', {
            intelligenceType,
            brandId,
            patterns: successPatterns.commonPatterns
        });

        const { data: intelligence } = await supabase
            .from('theme_intelligence')
            .select('*')
            .eq('intelligence_type', intelligenceType)
            .order('created_at', { ascending: false })
            .limit(10);

        if (intelligence && intelligence.length > 0) {
            for (const item of intelligence) {
                const existingData = typeof item.intelligence_data === 'object' ? item.intelligence_data : {};
                const updatedData = {
                    ...existingData,
                    performanceFeedback: {
                        averageScore: successPatterns.averageScore,
                        successfulPatterns: successPatterns.commonPatterns,
                        lastUpdated: new Date().toISOString()
                    }
                };

                await supabase
                    .from('theme_intelligence')
                    .update({ intelligence_data: updatedData })
                    .eq('id', item.id);
            }
        }
    }

    /**
     * @private
     * @param {any} metrics
     * @returns {number}
     */
    static calculatePerformanceScore(metrics) {
        const weights = {
            open_rate: 0.2,
            click_rate: 0.3,
            conversion_rate: 0.4,
            engagement_score: 0.1
        };

        let score = 0;
        let totalWeight = 0;

        Object.entries(weights).forEach(([key, weight]) => {
            if (metrics[key] !== undefined && metrics[key] !== null) {
                // Assuming metrics are percentages (e.g., 50 for 50%) and normalizing to 0-1 range for calculation
                score += (metrics[key] / 100) * weight;
                totalWeight += weight;
            }
        });

        // Normalize the score and convert back to a 0-100 scale for consistency with the TS code
        return totalWeight > 0 ? (score / totalWeight) * 100 : 0;
    }

    /**
     * @private
     * @param {any[]} metrics
     * @returns {any}
     */
    static analyzeTrends(metrics) {
        if (metrics.length === 0) return null;

        const dailyScores = new Map();

        metrics.forEach(metric => {
            const date = new Date(metric.collected_at).toISOString().split('T')[0];
            if (!dailyScores.has(date)) {
                dailyScores.set(date, []);
            }
            dailyScores.get(date).push(metric.performance_score || 0);
        });

        const trendData = Array.from(dailyScores.entries()).map(([date, scores]) => ({
            date,
            averageScore: scores.reduce((sum, s) => sum + s, 0) / scores.length,
            count: scores.length
        }));

        return {
            daily: trendData,
            overallAverage: metrics.reduce((sum, m) => sum + (m.performance_score || 0), 0) / metrics.length,
            trend: this.calculateTrendDirection(trendData)
        };
    }

    /**
     * @private
     * @param {any[]} trendData
     * @returns {'up' | 'down' | 'stable'}
     */
    static calculateTrendDirection(trendData) {
        if (trendData.length < 2) return 'stable';

        const recent = trendData.slice(-7);
        const older = trendData.slice(0, Math.min(7, trendData.length - 7));

        if (older.length === 0) return 'stable';

        const recentAvg = recent.reduce((sum, d) => sum + d.averageScore, 0) / recent.length;
        const olderAvg = older.reduce((sum, d) => sum + d.averageScore, 0) / older.length;

        const diff = recentAvg - olderAvg;

        if (diff > 5) return 'up'; // Change threshold as needed
        if (diff < -5) return 'down'; // Change threshold as needed
        return 'stable';
    }
}