import { supabase } from '@/integrations/supabase/client';
import { SmartTMIntelligenceService } from './SmartTMIntelligenceService';

/**
 * @typedef {Object} EnhancedTMMatch
 * @property {string} id
 * @property {string} sourceText
 * @property {string} targetText
 * @property {string} sourceLanguage
 * @property {string} targetLanguage
 * @property {number} matchPercentage
 * @property {number} brandConsistencyScore
 * @property {'approved' | 'pending' | 'rejected'} regulatoryStatus
 * @property {any} culturalContext
 * @property {'headline' | 'body' | 'cta' | 'disclaimer' | 'safety' | 'general'} contentType
 * @property {number} confidence
 * @property {number} usageCount
 * @property {string} lastUsed
 * @property {string[]} segmentationTags
 * @property {Object} validationFlags
 * @property {boolean} validationFlags.brandTerminology
 * @property {boolean} validationFlags.regulatoryCompliance
 * @property {boolean} validationFlags.culturalSensitivity
 */

/**
 * @typedef {Object} ContentSegment
 * @property {string} id
 * @property {string} text
 * @property {'headline' | 'body' | 'cta' | 'disclaimer' | 'safety' | 'general'} type
 * @property {'high' | 'medium' | 'low'} importance
 * @property {'editable' | 'restricted' | 'locked'} editability
 * @property {'none' | 'standard' | 'critical'} regulatoryLevel
 */

/**
 * @typedef {Object} EnhancedTMSearchResult
 * @property {EnhancedTMMatch[]} matches
 * @property {Object} segmentAnalysis
 * @property {ContentSegment[]} segmentAnalysis.detectedSegments
 * @property {Map<string, EnhancedTMMatch[]>} segmentAnalysis.segmentMatches
 * @property {any[]} segmentAnalysis.preservationRules
 * @property {Object} brandIntelligence
 * @property {number} brandIntelligence.consistencyScore
 * @property {any} brandIntelligence.terminologyValidation
 * @property {number} brandIntelligence.brandVoiceAlignment
 * @property {Object} regulatoryIntelligence
 * @property {'compliant' | 'needs_review' | 'non_compliant'} regulatoryIntelligence.complianceStatus
 * @property {string[]} regulatoryIntelligence.flaggedTerms
 * @property {any[]} regulatoryIntelligence.regulatoryAdaptations
 * @property {Object} culturalIntelligence
 * @property {number} culturalIntelligence.appropriateness
 * @property {any[]} culturalIntelligence.culturalRisks
 * @property {any[]} culturalIntelligence.adaptationSuggestions
 * @property {Object} recommendations
 * @property {EnhancedTMMatch[]} recommendations.bestMatches
 * @property {Map<string, EnhancedTMMatch[]>} recommendations.segmentSpecificSuggestions
 * @property {string[]} recommendations.improvementActions
 * @property {boolean} recommendations.exportReadiness
 */

/**
 * @typedef {Object} LocalizationContext
 * @property {string} targetMarket
 * @property {string} indication
 * @property {string} channel
 * @property {string} therapeuticArea
 * @property {string} brandId
 * @property {string} assetType
 * @property {string} targetAudience
 * @property {any[]} regulatoryRequirements
 */

export class EnhancedSmartTMEngine {

    /**
     * Enhanced TM search with intelligent content segmentation
     * @param {string} sourceText
     * @param {string} sourceLanguage
     * @param {string} targetLanguage
     * @param {LocalizationContext} context
     * @returns {Promise<EnhancedTMSearchResult>}
     */
    static async enhancedTMSearch(
        sourceText,
        sourceLanguage,
        targetLanguage,
        context
    ) {
        try {
            console.log('Starting enhanced TM search with context intelligence...');

            // Step 1: Intelligent Content Segmentation
            const segmentAnalysis = await this.intelligentContentSegmentation(sourceText, context);

            // Step 2: Segment-Specific TM Matching
            const segmentMatches = new Map();

            for (const segment of segmentAnalysis.detectedSegments) {
                const matches = await this.getSegmentSpecificMatches(
                    segment,
                    sourceLanguage,
                    targetLanguage,
                    context
                );
                segmentMatches.set(segment.id, matches);
            }

            // Step 3: Brand Intelligence Analysis
            const brandIntelligence = await this.analyzeBrandIntelligence(
                sourceText,
                context.brandId,
                context
            );

            // Step 4: Regulatory Intelligence Validation
            const regulatoryIntelligence = await this.validateRegulatoryIntelligence(
                sourceText,
                context
            );

            // Step 5: Cultural Intelligence Assessment
            const culturalIntelligence = await this.assessCulturalIntelligence(
                sourceText,
                targetLanguage,
                context
            );

            // Step 6: Combine all matches and generate recommendations
            const allMatches = [];
            segmentMatches.forEach(matches => allMatches.push(...matches));

            const recommendations = await this.generateEnhancedRecommendations(
                allMatches,
                segmentMatches,
                brandIntelligence,
                regulatoryIntelligence,
                culturalIntelligence
            );

            return {
                matches: allMatches,
                segmentAnalysis: {
                    detectedSegments: segmentAnalysis.detectedSegments,
                    segmentMatches,
                    preservationRules: segmentAnalysis.preservationRules
                },
                brandIntelligence,
                regulatoryIntelligence,
                culturalIntelligence,
                recommendations
            };

        } catch (error) {
            console.error('Enhanced TM search failed:', error);
            throw new Error('Failed to perform enhanced TM search');
        }
    }

    /**
     * Intelligent content segmentation with regulatory awareness
     * @param {string} sourceText
     * @param {LocalizationContext} context
     * @returns {Promise<Object>}
     */
    static async intelligentContentSegmentation(
        sourceText,
        context
    ) {
        const segments = [];
        const preservationRules = [];

        // Enhanced segmentation patterns for better content analysis
        const patterns = {
            headline: /^(.{10,150}?)(?:\n|\.|\!|\?|$)/i,
            disclaimer: /(important safety information|contraindications|warnings|side effects|adverse reactions|please see|full prescribing information)/i,
            safety: /(do not|avoid|consult your doctor|tell your doctor|side effects may include|may cause|warning|caution)/i,
            cta: /(learn more|find out more|talk to your doctor|ask your doctor|visit|call|contact|click here|get started|discover)/i,
            body: /([^.!?\n]{15,}[.!?])/g,
            keyPhrases: /\b([A-Z][a-z]+ [A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/g
        };

        let segmentId = 1;

        // Detect headlines
        const headlineMatch = sourceText.match(patterns.headline);
        if (headlineMatch) {
            segments.push({
                id: `segment_${segmentId++}`,
                text: headlineMatch[1].trim(),
                type: 'headline',
                importance: 'high',
                editability: 'editable',
                regulatoryLevel: 'standard'
            });
        }

        // Detect safety/regulatory content
        const safetyMatches = [...sourceText.matchAll(new RegExp(patterns.safety.source, 'gi'))];
        safetyMatches.forEach(match => {
            segments.push({
                id: `segment_${segmentId++}`,
                text: match[0],
                type: 'safety',
                importance: 'high',
                editability: 'locked',
                regulatoryLevel: 'critical'
            });

            // Add preservation rule for safety content
            preservationRules.push({
                segmentId: `segment_${segmentId - 1}`,
                rule: 'preserve_exact',
                reason: 'Regulatory safety information must remain unchanged',
                validation: 'regulatory_approval_required'
            });
        });

        // Detect disclaimers
        const disclaimerMatches = [...sourceText.matchAll(new RegExp(patterns.disclaimer.source, 'gi'))];
        disclaimerMatches.forEach(match => {
            segments.push({
                id: `segment_${segmentId++}`,
                text: match[0],
                type: 'disclaimer',
                importance: 'high',
                editability: 'restricted',
                regulatoryLevel: 'critical'
            });
        });

        // Detect CTAs
        const ctaMatches = [...sourceText.matchAll(new RegExp(patterns.cta.source, 'gi'))];
        ctaMatches.forEach(match => {
            segments.push({
                id: `segment_${segmentId++}`,
                text: match[0],
                type: 'cta',
                importance: 'medium',
                editability: 'editable',
                regulatoryLevel: 'standard'
            });
        });

        // Extract key phrases for better matching
        const keyPhraseMatches = [...sourceText.matchAll(patterns.keyPhrases)];
        keyPhraseMatches.forEach(match => {
            if (match[1].trim().length > 10 && !segments.some(s => s.text.includes(match[1]))) {
                segments.push({
                    id: `segment_${segmentId++}`,
                    text: match[1].trim(),
                    type: 'general',
                    importance: 'high',
                    editability: 'editable',
                    regulatoryLevel: 'standard'
                });
            }
        });

        // Add medical terminology segments
        const medicalTermPattern = /\b(?:progressive|pulmonary|fibrosis|management|treatment|therapy|patients?|clinical|efficacy|safety)\s+(?:[A-Z][a-z]+\s*){0,3}[A-Za-z]+/gi;
        const medicalMatches = [...sourceText.matchAll(medicalTermPattern)];
        medicalMatches.forEach(match => {
            if (match[0].trim().length > 8 && !segments.some(s => s.text.includes(match[0]))) {
                segments.push({
                    id: `segment_${segmentId++}`,
                    text: match[0].trim(),
                    type: 'body',
                    importance: 'high',
                    editability: 'editable',
                    regulatoryLevel: 'critical'
                });
            }
        });

        // Process remaining text as body segments
        let remainingText = sourceText;
        segments.forEach(segment => {
            remainingText = remainingText.replace(segment.text, '');
        });

        const bodyMatches = [...remainingText.matchAll(patterns.body)];
        bodyMatches.forEach(match => {
            if (match[1].trim().length > 15) {
                segments.push({
                    id: `segment_${segmentId++}`,
                    text: match[1].trim(),
                    type: 'body',
                    importance: 'medium',
                    editability: 'editable',
                    regulatoryLevel: 'standard'
                });
            }
        });

        // If no segments found, create general segments from sentences
        if (segments.length === 0) {
            const sentences = sourceText.split(/[.!?]+/).filter(s => s.trim().length > 15);
            sentences.slice(0, 8).forEach((sentence, index) => {
                segments.push({
                    id: `segment_${segmentId++}`,
                    text: sentence.trim(),
                    type: index === 0 ? 'headline' : 'general',
                    importance: index < 2 ? 'high' : 'medium',
                    editability: 'editable',
                    regulatoryLevel: 'standard'
                });
            });
        }

        console.log(`Created ${segments.length} content segments for TM matching`);

        return {
            detectedSegments: segments,
            preservationRules
        };
    }

    /**
     * Get segment-specific TM matches with enhanced intelligence
     * @param {ContentSegment} segment
     * @param {string} sourceLanguage
     * @param {string} targetLanguage
     * @param {LocalizationContext} context
     * @returns {Promise<EnhancedTMMatch[]>}
     */
    static async getSegmentSpecificMatches(
        segment,
        sourceLanguage,
        targetLanguage,
        context
    ) {
        try {
            // Get base matches from Smart TM Intelligence Service
            const assetContext = {
                assetType: context.assetType,
                targetAudience: context.targetAudience,
                therapeuticArea: context.therapeuticArea,
                brandGuidelines: {},
                regulatoryRequirements: context.regulatoryRequirements
            };

            console.log(`Getting segment matches for: "${segment.text}" (Type: ${segment.type})`);

            const intelligenceMatches = await SmartTMIntelligenceService.getAssetSpecificMatches(
                segment.text,
                sourceLanguage,
                targetLanguage,
                context.brandId,
                assetContext
            );

            console.log(`Found ${intelligenceMatches.length} intelligence matches for segment: ${segment.type}`);

            // Enhance matches with segment-specific intelligence
            const enhancedMatches = intelligenceMatches.map(match => ({
                id: match.tmId,
                sourceText: match.sourceText,
                targetText: match.targetText,
                sourceLanguage,
                targetLanguage,
                matchPercentage: match.matchPercentage,
                brandConsistencyScore: match.brandConsistencyScore,
                regulatoryStatus: match.regulatoryStatus,
                culturalContext: match.culturalContext,
                contentType: segment.type,
                confidence: match.confidence,
                usageCount: match.usageCount,
                lastUsed: match.lastUsed,
                segmentationTags: this.generateSegmentationTags(segment, context),
                validationFlags: {
                    brandTerminology: match.brandConsistencyScore >= 80,
                    regulatoryCompliance: match.regulatoryStatus === 'approved',
                    culturalSensitivity: match.culturalContext?.appropriateness >= 70
                }
            }));

            // Apply segment-specific filtering and ranking
            return this.applySegmentSpecificRanking(enhancedMatches, segment);

        } catch (error) {
            console.error('Failed to get segment-specific matches:', error);
            return [];
        }
    }

    /**
     * Analyze brand intelligence with real-time validation
     * @param {string} sourceText
     * @param {string} brandId
     * @param {LocalizationContext} context
     * @returns {Promise<any>}
     */
    static async analyzeBrandIntelligence(
        sourceText,
        brandId,
        context
    ) {
        try {
            // Initialize brand engine
            const brandEngine = await SmartTMIntelligenceService.initializeBrandEngine(brandId);

            // Perform real-time terminology validation
            const validation = await SmartTMIntelligenceService.validateTerminologyRealTime(
                sourceText,
                brandId,
                context.targetMarket,
                {
                    assetType: context.assetType,
                    targetAudience: context.targetAudience,
                    therapeuticArea: context.therapeuticArea,
                    brandGuidelines: {},
                    regulatoryRequirements: context.regulatoryRequirements
                }
            );

            return {
                consistencyScore: validation.brandConsistencyScore,
                terminologyValidation: {
                    isValid: validation.isValid,
                    suggestions: validation.suggestions,
                    issues: validation.regulatoryIssues
                },
                brandVoiceAlignment: this.calculateBrandVoiceAlignment(sourceText, brandEngine)
            };

        } catch (error) {
            console.error('Brand intelligence analysis failed:', error);
            return {
                consistencyScore: 0,
                terminologyValidation: { isValid: false, suggestions: [], issues: [] },
                brandVoiceAlignment: 0
            };
        }
    }

    /**
     * Validate regulatory intelligence with market-specific rules
     * @param {string} sourceText
     * @param {LocalizationContext} context
     * @returns {Promise<any>}
     */
    static async validateRegulatoryIntelligence(
        sourceText,
        context
    ) {
        try {
            // Get market-specific regulatory rules
            const { data: regulatoryRules } = await supabase
                .from('regulatory_compliance_matrix')
                .select('*')
                .eq('brand_id', context.brandId)
                .eq('market', context.targetMarket)
                .eq('therapeutic_area', context.therapeuticArea)
                .eq('is_active', true);

            const flaggedTerms = [];
            const requiredAdaptations = [];
            let complianceStatus = 'compliant';

            if (regulatoryRules) {
                for (const rule of regulatoryRules) {
                    const rulePattern = new RegExp(rule.compliance_pattern || rule.regulation_rule, 'gi');
                    const matches = sourceText.match(rulePattern);

                    if (matches && rule.risk_level === 'high') {
                        flaggedTerms.push(...matches);
                        complianceStatus = 'non_compliant';

                        requiredAdaptations.push({
                            rule: rule.regulation_rule,
                            flaggedText: matches,
                            requirement: rule.rule_description,
                            action: 'remove_or_modify'
                        });
                    } else if (matches && rule.risk_level === 'medium') {
                        flaggedTerms.push(...matches);
                        if (complianceStatus === 'compliant') {
                            complianceStatus = 'needs_review';
                        }
                    }
                }
            }

            return {
                complianceStatus,
                flaggedTerms: [...new Set(flaggedTerms)],
                requiredAdaptations
            };

        } catch (error) {
            console.error('Regulatory intelligence validation failed:', error);
            return {
                complianceStatus: 'needs_review',
                flaggedTerms: [],
                requiredAdaptations: []
            };
        }
    }

    /**
     * Assess cultural intelligence for target market
     * @param {string} sourceText
     * @param {string} targetLanguage
     * @param {LocalizationContext} context
     * @returns {Promise<any>}
     */
    static async assessCulturalIntelligence(
        sourceText,
        targetLanguage,
        context
    ) {
        try {
            // Analyze cultural elements and risks
            const culturalRisks = [];
            const adaptationSuggestions = [];

            // Check for cultural sensitivity issues
            const culturalPatterns = {
                'direct_commands': /\b(you must|you should|you need to)\b/gi,
                'family_references': /\b(family|spouse|partner|children)\b/gi,
                'religious_terms': /\b(blessing|prayer|faith|spiritual)\b/gi,
                'color_symbolism': /\b(white|red|black|green)\s+(color|dress|wear)\b/gi
            };

            for (const [pattern, regex] of Object.entries(culturalPatterns)) {
                const matches = sourceText.match(regex);
                if (matches) {
                    culturalRisks.push({
                        type: pattern,
                        instances: matches,
                        riskLevel: this.getCulturalRiskLevel(pattern, context.targetMarket)
                    });

                    if (this.getCulturalRiskLevel(pattern, context.targetMarket) > 0.5) {
                        adaptationSuggestions.push({
                            original: matches,
                            suggestion: this.getCulturalAdaptation(pattern, context.targetMarket),
                            reason: `Cultural sensitivity for ${context.targetMarket} market`
                        });
                    }
                }
            }

            const appropriateness = culturalRisks.length === 0 ? 90 :
                Math.max(50, 90 - (culturalRisks.length * 15));

            return {
                appropriateness,
                culturalRisks,
                adaptationSuggestions
            };

        } catch (error) {
            console.error('Cultural intelligence assessment failed:', error);
            return {
                appropriateness: 70,
                culturalRisks: [],
                adaptationSuggestions: []
            };
        }
    }

    /**
     * Generate enhanced recommendations with export readiness assessment
     * @param {EnhancedTMMatch[]} allMatches
     * @param {Map<string, EnhancedTMMatch[]>} segmentMatches
     * @param {any} brandIntelligence
     * @param {any} regulatoryIntelligence
     * @param {any} culturalIntelligence
     * @returns {Promise<any>}
     */
    static async generateEnhancedRecommendations(
        allMatches,
        segmentMatches,
        brandIntelligence,
        regulatoryIntelligence,
        culturalIntelligence
    ) {
        const bestMatches = allMatches
            .filter(m => m.confidence >= 80)
            .sort((a, b) => b.confidence - a.confidence)
            .slice(0, 5);

        const segmentSpecificSuggestions = new Map();
        segmentMatches.forEach((matches, segmentId) => {
            const topMatches = matches
                .sort((a, b) => b.confidence - a.confidence)
                .slice(0, 3);
            segmentSpecificSuggestions.set(segmentId, topMatches);
        });

        const improvementActions = [];

        if (brandIntelligence.consistencyScore < 80) {
            improvementActions.push('Review brand terminology consistency');
        }

        if (regulatoryIntelligence.complianceStatus !== 'compliant') {
            improvementActions.push('Address regulatory compliance issues');
        }

        if (culturalIntelligence.appropriateness < 70) {
            improvementActions.push('Consider cultural adaptations for target market');
        }

        const exportReadiness =
            brandIntelligence.consistencyScore >= 80 &&
            regulatoryIntelligence.complianceStatus === 'compliant' &&
            culturalIntelligence.appropriateness >= 70 &&
            bestMatches.length > 0;

        return {
            bestMatches,
            segmentSpecificSuggestions,
            improvementActions,
            exportReadiness
        };
    }

    /**
     * Helper methods
     * @param {ContentSegment} segment
     * @param {LocalizationContext} context
     * @returns {string[]}
     */
    static generateSegmentationTags(segment, context) {
        const tags = [segment.type, segment.importance, context.channel, context.indication];

        if (segment.regulatoryLevel === 'critical') {
            tags.push('regulatory_critical');
        }

        if (segment.editability === 'locked') {
            tags.push('locked_content');
        }

        return tags;
    }

    /**
     * @param {EnhancedTMMatch[]} matches
     * @param {ContentSegment} segment
     * @returns {EnhancedTMMatch[]}
     */
    static applySegmentSpecificRanking(matches, segment) {
        return matches.sort((a, b) => {
            // Prioritize based on segment type
            if (segment.type === 'safety' || segment.type === 'disclaimer') {
                // For regulatory content, prioritize exact matches and regulatory compliance
                if (a.validationFlags.regulatoryCompliance !== b.validationFlags.regulatoryCompliance) {
                    return a.validationFlags.regulatoryCompliance ? -1 : 1;
                }
                return b.matchPercentage - a.matchPercentage;
            } else {
                // For other content, balance match quality with brand consistency
                const scoreA = (a.matchPercentage * 0.6) + (a.brandConsistencyScore * 0.4);
                const scoreB = (b.matchPercentage * 0.6) + (b.brandConsistencyScore * 0.4);
                return scoreB - scoreA;
            }
        });
    }

    /**
     * @param {string} text
     * @param {any} brandEngine
     * @returns {number}
     */
    static calculateBrandVoiceAlignment(text, brandEngine) {
        // Simplified brand voice calculation
        let alignment = 80; // Base score

        const brandTerms = brandEngine.terminologyDatabase?.size || 0;
        if (brandTerms > 0) {
            const textWords = text.toLowerCase().split(/\s+/);
            const brandMatches = textWords.filter(word =>
                brandEngine.terminologyDatabase?.has(word)
            ).length;

            alignment += (brandMatches / textWords.length) * 20;
        }

        return Math.min(100, alignment);
    }

    /**
     * @param {string} pattern
     * @param {string} market
     * @returns {number}
     */
    static getCulturalRiskLevel(pattern, market) {
        const riskMatrix = {
            'direct_commands': { 'JP': 0.8, 'EU': 0.3, 'US': 0.1 },
            'family_references': { 'JP': 0.6, 'EU': 0.2, 'US': 0.1 },
            'religious_terms': { 'EU': 0.7, 'JP': 0.9, 'US': 0.3 },
            'color_symbolism': { 'JP': 0.8, 'EU': 0.4, 'US': 0.2 }
        };

        return riskMatrix[pattern]?.[market] || 0.3;
    }

    /**
     * @param {string} pattern
     * @param {string} market
     * @returns {string}
     */
    static getCulturalAdaptation(pattern, market) {
        const adaptations = {
            'direct_commands': {
                'JP': 'Consider softer language like "it may be helpful to..."',
                'EU': 'Use more consultative tone'
            },
            'family_references': {
                'JP': 'Focus on individual rather than family context',
                'EU': 'Consider privacy implications'
            }
        };

        return adaptations[pattern]?.[market] || 'Review for cultural appropriateness';
    }
}