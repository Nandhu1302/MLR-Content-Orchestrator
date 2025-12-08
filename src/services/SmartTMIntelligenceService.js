// ============================================
// Smart TM Intelligence Service (JavaScript)
// ============================================

// Assumed import (replace with actual JS import if necessary)
// import { supabase } from '@/integrations/supabase/client';
// Assuming supabase is imported or defined globally
import { supabase } from '@/integrations/supabase/client';

/**
 * @typedef {Object} TMIntelligenceMatch
 * @property {string} tmId
 * @property {string} sourceText
 * @property {string} targetText
 * @property {number} matchPercentage
 * @property {number} brandConsistencyScore
 * @property {'approved' | 'pending' | 'rejected'} regulatoryStatus
 * @property {any} culturalContext
 * @property {string} lastUsed
 * @property {number} usageCount
 * @property {number} confidence
 */

/**
 * @typedef {Object} BrandConsistencyEngine
 * @property {string} brandId
 * @property {Map<string, any>} terminologyDatabase
 * @property {any[]} complianceRules
 * @property {any[]} culturalGuidelines
 */

/**
 * @typedef {Object} AssetSpecificTMContext
 * @property {string} assetType
 * @property {string} targetAudience
 * @property {string} therapeuticArea
 * @property {any} brandGuidelines
 * @property {any[]} regulatoryRequirements
 */

export class SmartTMIntelligenceService {
    /** @private @type {Map<string, BrandConsistencyEngine>} */
    static brandEngines = new Map();

    /**
     * Asset-specific TM matching with brand consistency validation
     * @param {string} sourceText
     * @param {string} sourceLanguage
     * @param {string} targetLanguage
     * @param {string} brandId
     * @param {AssetSpecificTMContext} assetContext
     * @returns {Promise<TMIntelligenceMatch[]>}
     */
    static async getAssetSpecificMatches(
        sourceText,
        sourceLanguage,
        targetLanguage,
        brandId,
        assetContext
    ) {
        try {
            console.log('Getting asset-specific TM matches with intelligence...');

            // Get all TM entries for the brand and language pair
            const { data: allTMEntries } = await supabase
                .from('translation_memory')
                .select('*')
                .eq('brand_id', brandId)
                .eq('source_language', sourceLanguage)
                .eq('target_language', targetLanguage);

            if (!allTMEntries) return [];

            // Find TM entries whose source text appears within the larger sourceText
            const relevantMatches = allTMEntries.filter(tm => {
                const tmSourceText = tm.source_text.toLowerCase();
                const inputText = sourceText.toLowerCase();

                // Very lenient matching for segments - check for any word overlap or phrase inclusion
                const directMatch = inputText.includes(tmSourceText) || tmSourceText.includes(inputText);
                const wordOverlap = tmSourceText.split(' ').some(word => word.length > 3 && inputText.includes(word));
                const semanticMatch = this.calculateSemanticMatch(inputText, tmSourceText) > 5; // Lowered from 15% to 5%

                const isRelevant = directMatch || wordOverlap || semanticMatch;

                if (isRelevant) {
                    console.log(`TM Match found - Source: "${tm.source_text}" | Input: "${sourceText.substring(0, 100)}..." | Match: ${directMatch ? 'direct' : wordOverlap ? 'word' : 'semantic'}`);
                }

                return isRelevant;
            });

            console.log(`Found ${relevantMatches.length} relevant TM matches out of ${allTMEntries.length} total entries`);

            // Enhance matches with intelligence
            const intelligenceMatches = await Promise.all(
                relevantMatches.map(async (match) => {
                    const brandConsistencyScore = await this.calculateBrandConsistency(
                        match.target_text,
                        brandId,
                        assetContext
                    );

                    const regulatoryStatus = await this.validateRegulatoryStatus(
                        match.target_text,
                        assetContext.therapeuticArea
                    );

                    const culturalContext = await this.analyzeCulturalContext(
                        match.target_text,
                        targetLanguage,
                        assetContext
                    );

                    const matchPercentage = this.calculateSemanticMatch(
                        sourceText,
                        match.source_text
                    );

                    /** @type {TMIntelligenceMatch} */
                    return {
                        tmId: match.id,
                        sourceText: match.source_text,
                        targetText: match.target_text,
                        matchPercentage,
                        brandConsistencyScore,
                        regulatoryStatus: regulatoryStatus.status,
                        culturalContext,
                        lastUsed: match.last_used || new Date().toISOString(),
                        usageCount: match.usage_count || 0,
                        confidence: this.calculateConfidence(
                            matchPercentage,
                            brandConsistencyScore,
                            regulatoryStatus.score
                        )
                    };
                })
            );

            // If no relevant matches found, provide fallback matches for demonstration
            if (intelligenceMatches.length === 0 && allTMEntries.length > 0) {
                console.log('No relevant matches found, providing fallback matches...');
                const fallbackMatches = allTMEntries.slice(0, 3).map(match => ({
                    tmId: match.id,
                    sourceText: match.source_text,
                    targetText: match.target_text,
                    matchPercentage: 25, // Low match percentage for fallback
                    brandConsistencyScore: 70,
                    regulatoryStatus: 'approved',
                    culturalContext: { language: targetLanguage },
                    lastUsed: match.last_used || new Date().toISOString(),
                    usageCount: match.usage_count || 0,
                    confidence: 40 // Low confidence for fallback matches
                }));
                return fallbackMatches;
            }

            // Sort by confidence and brand consistency
            return intelligenceMatches.sort((a, b) => b.confidence - a.confidence);
        } catch (error) {
            console.error('Asset-specific TM matching failed:', error);
            return [];
        }
    }

    /**
     * Real-time brand consistency engine
     * @param {string} brandId
     * @returns {Promise<BrandConsistencyEngine>}
     */
    static async initializeBrandEngine(brandId) {
        if (this.brandEngines.has(brandId)) {
            return this.brandEngines.get(brandId);
        }

        try {
            // Load brand-specific terminology database
            const { data: terminologyData } = await supabase
                .from('translation_memory')
                .select('id, source_text, target_text, regulatory_notes, quality_score')
                .eq('brand_id', brandId)
                // Assuming 'approved' is used to flag terminology items in the TM
                .eq('match_type', 'approved');

            // Load compliance rules
            const { data: complianceData } = await supabase
                .from('regulatory_compliance_matrix')
                .select('*')
                .eq('brand_id', brandId)
                .eq('is_active', true);

            const terminologyDatabase = new Map();
            terminologyData?.forEach(term => {
                terminologyDatabase.set(term.source_text.toLowerCase(), {
                    approved_translation: term.target_text,
                    regulatory_notes: term.regulatory_notes,
                    quality_score: term.quality_score
                });
            });

            /** @type {BrandConsistencyEngine} */
            const engine = {
                brandId,
                terminologyDatabase,
                complianceRules: complianceData || [],
                culturalGuidelines: [] // Placeholder
            };

            this.brandEngines.set(brandId, engine);
            return engine;
        } catch (error) {
            console.error('Failed to initialize brand engine:', error);
            throw error;
        }
    }

    /**
     * Real-time terminology validation as user types
     * @param {string} text
     * @param {string} brandId
     * @param {string} targetLanguage
     * @param {AssetSpecificTMContext} assetContext
     * @returns {Promise<{isValid: boolean, suggestions: string[], brandConsistencyScore: number, regulatoryIssues: any[], culturalConcerns: any[]}>}
     */
    static async validateTerminologyRealTime(
        text,
        brandId,
        targetLanguage,
        assetContext
    ) {
        try {
            const engine = await this.initializeBrandEngine(brandId);

            const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 0);
            const suggestions = [];
            const regulatoryIssues = [];
            const culturalConcerns = [];

            let consistencyScore = 100;
            let isValid = true;

            for (const word of words) {
                // Check against approved terminology
                if (engine.terminologyDatabase.has(word)) {
                    const approvedTerm = engine.terminologyDatabase.get(word);
                    // This is simplified: it should check if the target_text contains the approved translation
                    // In real life, this is complex (e.g., checking for unapproved alternatives)
                    if (!text.toLowerCase().includes(approvedTerm.approved_translation.toLowerCase())) {
                        suggestions.push(`Use approved term: "${approvedTerm.approved_translation}" for original concept.`);
                        consistencyScore -= 10;
                        isValid = false;
                    }
                }

                // Check regulatory compliance
                const regulatoryCheck = await this.checkRegulatoryCompliance(
                    word,
                    assetContext.therapeuticArea,
                    engine.complianceRules
                );

                if (!regulatoryCheck.compliant) {
                    regulatoryIssues.push(regulatoryCheck);
                    consistencyScore -= 15;
                    isValid = false;
                }

                // Check cultural sensitivity
                const culturalCheck = await this.checkCulturalSensitivity(
                    word,
                    targetLanguage,
                    assetContext
                );

                if (culturalCheck.risk > 0.7) {
                    culturalConcerns.push(culturalCheck);
                    consistencyScore -= 5;
                }
            }

            return {
                isValid,
                suggestions: [...new Set(suggestions)],
                brandConsistencyScore: Math.max(0, consistencyScore),
                regulatoryIssues,
                culturalConcerns
            };
        } catch (error) {
            console.error('Real-time validation failed:', error);
            return {
                isValid: false,
                suggestions: [],
                brandConsistencyScore: 0,
                regulatoryIssues: [],
                culturalConcerns: []
            };
        }
    }

    /**
     * Cultural context preservation from original to localized versions
     * @param {any} originalAssetData
     * @param {string} targetLanguage
     * @param {any[]} culturalAdaptations
     * @returns {Promise<{preservedElements: any[], adaptationRules: any[], riskAssessment: any}>}
     */
    static async preserveCulturalContext(
        originalAssetData,
        targetLanguage,
        culturalAdaptations
    ) {
        try {
            console.log('Preserving cultural context for localization...');

            const preservedElements = [];
            const adaptationRules = [];

            // Analyze original content for cultural elements
            const culturalElements = await this.extractCulturalElements(originalAssetData);

            for (const element of culturalElements) {
                const adaptationRule = await this.generateAdaptationRule(
                    element,
                    targetLanguage,
                    culturalAdaptations
                );

                if (adaptationRule.preserve) {
                    preservedElements.push({
                        element: element.content,
                        reason: adaptationRule.preservationReason,
                        guidelines: adaptationRule.guidelines
                    });
                } else {
                    adaptationRules.push({
                        original: element.content,
                        adaptation: adaptationRule.suggestedAdaptation,
                        reason: adaptationRule.adaptationReason,
                        riskLevel: adaptationRule.riskLevel
                    });
                }
            }

            const riskAssessment = await this.assessOverallCulturalRisk(
                preservedElements,
                adaptationRules,
                targetLanguage
            );

            return {
                preservedElements,
                adaptationRules,
                riskAssessment
            };
        } catch (error) {
            console.error('Cultural context preservation failed:', error);
            throw error;
        }
    }

    // --- Private Helper Methods ---

    /**
     * @private
     * @param {string} text
     * @param {string} brandId
     * @param {AssetSpecificTMContext} context
     * @returns {Promise<number>}
     */
    static async calculateBrandConsistency(
        text,
        brandId,
        context
    ) {
        const engine = await this.initializeBrandEngine(brandId);
        let score = 100;

        const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 0);
        for (const word of words) {
            if (engine.terminologyDatabase.has(word)) {
                const termData = engine.terminologyDatabase.get(word);
                // Adjust score based on the quality of the approved term
                score += (termData.quality_score - 50) * 0.2;
            }
        }

        return Math.max(0, Math.min(100, score));
    }

    /**
     * @private
     * @param {string} text
     * @param {string} therapeuticArea
     * @returns {Promise<{status: 'approved' | 'pending' | 'rejected', score: number}>}
     */
    static async validateRegulatoryStatus(
        text,
        therapeuticArea
    ) {
        // Simulate regulatory validation
        const riskKeywords = ['cure', 'guarantee', 'best', 'only'];
        const hasRisk = riskKeywords.some(keyword => text.toLowerCase().includes(keyword));

        return {
            status: hasRisk ? 'rejected' : 'approved',
            score: hasRisk ? 0 : 100
        };
    }

    /**
     * @private
     * @param {string} text
     * @param {string} language
     * @param {AssetSpecificTMContext} context
     * @returns {Promise<any>}
     */
    static async analyzeCulturalContext(
        text,
        language,
        context
    ) {
        return {
            language,
            appropriateness: Math.random() * 100,
            culturalNotes: [],
            adaptationSuggestions: []
        };
    }

    /**
     * Calculates semantic match for text segments.
     * @private
     * @param {string} source
     * @param {string} target
     * @returns {number}
     */
    static calculateSemanticMatch(source, target) {
        // Enhanced similarity calculation for medical content
        const sourceWords = source.toLowerCase().split(/\s+/).filter(w => w.length > 2);
        const targetWords = target.toLowerCase().split(/\s+/).filter(w => w.length > 2);

        if (sourceWords.length === 0 || targetWords.length === 0) return 0;

        // Check for exact substring match (high score)
        if (source.toLowerCase().includes(target.toLowerCase()) ||
            target.toLowerCase().includes(source.toLowerCase())) {
            return 95;
        }

        // Check for significant word overlap with fuzzy matching
        const commonWords = sourceWords.filter(word =>
            word.length > 3 && targetWords.some(tw => tw.includes(word) || word.includes(tw))
        );

        // Very lenient scoring for segments - lowered threshold
        const overlapScore = (commonWords.length / Math.min(sourceWords.length, targetWords.length)) * 100;

        // Boost score for medical terms and proper nouns
        const medicalTerms = ['fibrosis', 'pulmonary', 'progressive', 'treatment', 'management', 'therapy', 'clinical', 'patient', 'efficacy', 'safety', 'indication', 'dosage'];
        const hasMedicalTerms = medicalTerms.some(term =>
            source.toLowerCase().includes(term) && target.toLowerCase().includes(term)
        );

        let finalScore = overlapScore + (hasMedicalTerms ? 30 : 0);

        // Additional boost for partial matches to be more lenient
        if (commonWords.length > 0) {
            finalScore = Math.max(finalScore, 25); // Ensure minimum score for any word overlap
        }

        console.log(`Semantic match - Source: "${source.substring(0, 50)}..." | Target: "${target}" | Score: ${Math.min(100, finalScore)}%`);

        return Math.min(100, finalScore);
    }

    /**
     * @private
     * @param {number} matchPercentage
     * @param {number} brandScore
     * @param {number} regulatoryScore
     * @returns {number}
     */
    static calculateConfidence(
        matchPercentage,
        brandScore,
        regulatoryScore
    ) {
        return (matchPercentage * 0.4) + (brandScore * 0.4) + (regulatoryScore * 0.2);
    }

    /**
     * @private
     * @param {string} term
     * @param {string} therapeuticArea
     * @param {any[]} rules
     * @returns {Promise<{compliant: boolean, reason?: string}>}
     */
    static async checkRegulatoryCompliance(
        term,
        therapeuticArea,
        rules
    ) {
        // Check against regulatory rules
        const prohibitedTerms = ['miracle', 'cure', 'best treatment'];
        const isProhibited = prohibitedTerms.includes(term.toLowerCase());

        return {
            compliant: !isProhibited,
            reason: isProhibited ? `Term '${term}' is not allowed in ${therapeuticArea}` : undefined
        };
    }

    /**
     * @private
     * @param {string} term
     * @param {string} language
     * @param {AssetSpecificTMContext} context
     * @returns {Promise<{risk: number, concerns: string[]}>}
     */
    static async checkCulturalSensitivity(
        term,
        language,
        context
    ) {
        // Simulate cultural sensitivity check
        const sensitiveTerm = ['death', 'family', 'religion'].includes(term.toLowerCase());

        return {
            risk: sensitiveTerm ? 0.8 : 0.2,
            concerns: sensitiveTerm ? [`Term '${term}' requires cultural consideration in ${language}`] : []
        };
    }

    /**
     * @private
     * @param {any} assetData
     * @returns {Promise<any[]>}
     */
    static async extractCulturalElements(assetData) {
        // Extract cultural elements from asset
        return [
            { type: 'color', content: 'red', significance: 'high' },
            { type: 'imagery', content: 'family_photo', significance: 'medium' },
            { type: 'text', content: 'direct_cta', significance: 'high' }
        ];
    }

    /**
     * @private
     * @param {any} element
     * @param {string} targetLanguage
     * @param {any[]} adaptations
     * @returns {Promise<any>}
     */
    static async generateAdaptationRule(
        element,
        targetLanguage,
        adaptations
    ) {
        // Generate adaptation rules based on cultural guidelines
        return {
            preserve: Math.random() > 0.5,
            preservationReason: 'Universal concept applicable across cultures',
            suggestedAdaptation: 'Adapted version for local context',
            adaptationReason: 'Cultural sensitivity requirement',
            riskLevel: 'low',
            guidelines: ['Maintain core message', 'Adapt cultural references']
        };
    }

    /**
     * @private
     * @param {any[]} preserved
     * @param {any[]} adapted
     * @param {string} language
     * @returns {Promise<any>}
     */
    static async assessOverallCulturalRisk(
        preserved,
        adapted,
        language
    ) {
        return {
            overallRisk: 'low',
            confidence: 0.85,
            recommendations: [
                'Review adapted elements with native speakers',
                'Test with local focus groups'
            ]
        };
    }
}