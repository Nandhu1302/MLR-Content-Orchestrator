// ============================================
// Smart TM Engine Service (JavaScript)
// ============================================

// Assumed import (replace with actual JS import if necessary)
// import { supabase } from "@/integrations/supabase/client";
// Assuming supabase is imported or defined globally
const { supabase } = require("@/integrations/supabase/client");

/**
 * @typedef {Object} TMMatch
 * @property {string} id
 * @property {string} sourceText
 * @property {string} targetText
 * @property {string} sourceLanguage
 * @property {string} targetLanguage
 * @property {number} matchPercentage
 * @property {number} leveragePercentage
 * @property {number} confidenceScore
 * @property {number} qualityScore
 * @property {number} contextSimilarity
 * @property {string[]} semanticTags
 * @property {string} domainCategory
 * @property {any} contextMetadata
 * @property {number} usageCount
 * @property {'exact' | 'fuzzy' | 'semantic' | 'contextual'} matchType
 * @property {number} editDistance
 * @property {string} lastUsed
 */

/**
 * @typedef {Object} TMSearchOptions
 * @property {number} [minMatchPercentage]
 * @property {number} [maxResults]
 * @property {boolean} [includeFuzzyMatches]
 * @property {boolean} [includeSemanticMatches]
 * @property {string} [domainFilter]
 * @property {any} [contextFilter]
 * @property {number} [qualityThreshold]
 */

/**
 * @typedef {Object} TMSearchStats
 * @property {number} totalMatches
 * @property {number} exactMatches
 * @property {number} fuzzyMatches
 * @property {number} semanticMatches
 * @property {number} averageConfidence
 * @property {number} suggestedLeverage
 */

/**
 * @typedef {Object} TMSearchRecommendations
 * @property {TMMatch | null} bestMatch
 * @property {TMMatch[]} qualityMatches
 * @property {TMMatch[]} contextualMatches
 * @property {string[]} improvementSuggestions
 */

/**
 * @typedef {Object} TMSearchResult
 * @property {TMMatch[]} matches
 * @property {TMSearchStats} searchStats
 * @property {TMSearchRecommendations} recommendations
 */

export class SmartTMEngine {
    /**
     * Search the Translation Memory for matches.
     * @param {string} sourceText
     * @param {string} sourceLanguage
     * @param {string} targetLanguage
     * @param {string} brandId
     * @param {TMSearchOptions} [options={}]
     * @returns {Promise<TMSearchResult>}
     */
    static async searchTranslationMemory(
        sourceText,
        sourceLanguage,
        targetLanguage,
        brandId,
        options = {}
    ) {
        try {
            const {
                minMatchPercentage = 70,
                maxResults = 10,
                includeFuzzyMatches = true,
                includeSemanticMatches = true,
                domainFilter,
                contextFilter,
                qualityThreshold = 0.6
            } = options;

            // First, search existing translation memory
            const exactMatches = await this.findExactMatches(sourceText, sourceLanguage, targetLanguage, brandId);
            const fuzzyMatches = includeFuzzyMatches ?
                await this.findFuzzyMatches(sourceText, sourceLanguage, targetLanguage, brandId, minMatchPercentage) : [];
            const semanticMatches = includeSemanticMatches ?
                await this.findSemanticMatches(sourceText, sourceLanguage, targetLanguage, brandId, contextFilter) : [];

            // Combine and rank all matches
            const allMatches = [...exactMatches, ...fuzzyMatches, ...semanticMatches];
            const rankedMatches = this.rankMatches(allMatches, sourceText);
            const filteredMatches = this.filterMatches(rankedMatches, qualityThreshold, domainFilter);
            const finalMatches = filteredMatches.slice(0, maxResults);

            // Calculate search statistics
            const searchStats = this.calculateSearchStats(finalMatches);

            // Generate recommendations
            const recommendations = this.generateRecommendations(finalMatches, sourceText);

            /** @type {TMSearchResult} */
            return {
                matches: finalMatches,
                searchStats,
                recommendations
            };
        } catch (error) {
            console.error('Smart TM search failed:', error);
            throw new Error('Failed to search translation memory');
        }
    }

    /**
     * Add a new translation unit to the Translation Memory.
     * @param {string} sourceText
     * @param {string} targetText
     * @param {string} sourceLanguage
     * @param {string} targetLanguage
     * @param {string} brandId
     * @param {any} [contextMetadata={}]
     * @param {string} [domainCategory='general']
     * @returns {Promise<string>} The ID of the new TM entry.
     */
    static async addToTranslationMemory(
        sourceText,
        targetText,
        sourceLanguage,
        targetLanguage,
        brandId,
        contextMetadata = {},
        domainCategory = 'general'
    ) {
        try {
            const qualityScore = await this.calculateQualityScore(sourceText, targetText);

            const { data, error } = await supabase
                .from('translation_memory')
                .insert({
                    brand_id: brandId,
                    source_text: sourceText,
                    target_text: targetText,
                    source_language: sourceLanguage,
                    target_language: targetLanguage,
                    cultural_adaptations: contextMetadata,
                    domain_context: domainCategory,
                    match_type: 'exact',
                    quality_score: qualityScore,
                    confidence_level: 0.85,
                    usage_count: 0
                })
                .select('id')
                .single();

            if (error) throw error;
            return data.id;
        } catch (error) {
            console.error('Failed to add to translation memory:', error);
            throw error;
        }
    }

    /**
     * Increment the usage count and update the lastUsed timestamp for a TM entry.
     * @param {string} tmId
     * @returns {Promise<void>}
     */
    static async updateTMUsage(tmId) {
        try {
            // Directly update usage count (increment_tm_usage RPC may not be in types yet)
            const { data: current } = await supabase
                .from('translation_memory')
                .select('usage_count')
                .eq('id', tmId)
                .single();

            if (current) {
                await supabase
                    .from('translation_memory')
                    .update({
                        usage_count: (current.usage_count || 0) + 1,
                        last_used: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', tmId);
            }
        } catch (error) {
            console.error('Failed to update TM usage:', error);
        }
    }

    /**
     * Get the best matches for a batch of source texts.
     * @param {string[]} sourceTexts
     * @param {string} sourceLanguage
     * @param {string} targetLanguage
     * @param {string} brandId
     * @returns {Promise<Map<string, TMMatch[]>>}
     */
    static async getBestMatches(
        sourceTexts,
        sourceLanguage,
        targetLanguage,
        brandId
    ) {
        /** @type {Map<string, TMMatch[]>} */
        const results = new Map();

        for (const text of sourceTexts) {
            try {
                const searchResult = await this.searchTranslationMemory(
                    text, sourceLanguage, targetLanguage, brandId,
                    { maxResults: 3, minMatchPercentage: 80 }
                );
                results.set(text, searchResult.matches);
            } catch (error) {
                console.warn(`Failed to find matches for: ${text.substring(0, 50)}...`);
                results.set(text, []);
            }
        }

        return results;
    }

    // --- Private Helper Methods ---

    /**
     * Find exact matches in the database.
     * @private
     * @param {string} sourceText
     * @param {string} sourceLanguage
     * @param {string} targetLanguage
     * @param {string} brandId
     * @returns {Promise<TMMatch[]>}
     */
    static async findExactMatches(
        sourceText,
        sourceLanguage,
        targetLanguage,
        brandId
    ) {
        try {
            const { data, error } = await supabase
                .from('translation_memory')
                .select('*')
                .eq('brand_id', brandId)
                .eq('source_language', sourceLanguage)
                .eq('target_language', targetLanguage)
                .eq('source_text', sourceText)
                .limit(5);

            if (error) throw error;
            if (!data || data.length === 0) return [];

            return data.map(item => this.mapToTMMatch(item, 100, 'exact', 0));
        } catch (error) {
            console.error('Failed to find exact matches:', error);
            return [];
        }
    }

    /**
     * Find fuzzy matches (Levenshtein distance).
     * @private
     * @param {string} sourceText
     * @param {string} sourceLanguage
     * @param {string} targetLanguage
     * @param {string} brandId
     * @param {number} minMatchPercentage
     * @returns {Promise<TMMatch[]>}
     */
    static async findFuzzyMatches(
        sourceText,
        sourceLanguage,
        targetLanguage,
        brandId,
        minMatchPercentage
    ) {
        try {
            // NOTE: In a real system, fuzzy matching would use database functions (e.g., pg_trgm) or an external service.
            // This implementation simulates by fetching many records and calculating distance locally (inefficient for large DBs).
            const { data, error } = await supabase
                .from('translation_memory')
                .select('*')
                .eq('brand_id', brandId)
                .eq('source_language', sourceLanguage)
                .eq('target_language', targetLanguage)
                .limit(100);

            if (error) throw error;
            if (!data || data.length === 0) return [];

            /** @type {TMMatch[]} */
            const fuzzyMatches = [];

            for (const item of data) {
                if (item.source_text === sourceText) continue; // Skip exact matches

                const editDistance = this.calculateEditDistance(sourceText, item.source_text);
                const maxLength = Math.max(sourceText.length, item.source_text.length);
                const matchPercentage = Math.round((1 - editDistance / maxLength) * 100);

                if (matchPercentage >= minMatchPercentage) {
                    fuzzyMatches.push(this.mapToTMMatch(item, matchPercentage, 'fuzzy', editDistance));
                }
            }

            return fuzzyMatches.sort((a, b) => b.matchPercentage - a.matchPercentage).slice(0, 10);
        } catch (error) {
            console.error('Failed to find fuzzy matches:', error);
            return [];
        }
    }

    /**
     * Find semantic matches based on keyword overlap (Simplified).
     * @private
     * @param {string} sourceText
     * @param {string} sourceLanguage
     * @param {string} targetLanguage
     * @param {string} brandId
     * @param {any} [contextFilter]
     * @returns {Promise<TMMatch[]>}
     */
    static async findSemanticMatches(
        sourceText,
        sourceLanguage,
        targetLanguage,
        brandId,
        contextFilter
    ) {
        try {
            const keywords = this.extractKeywords(sourceText);

            const { data, error } = await supabase
                .from('translation_memory')
                .select('*')
                .eq('brand_id', brandId)
                .eq('source_language', sourceLanguage)
                .eq('target_language', targetLanguage)
                .limit(100);

            if (error) throw error;
            if (!data || data.length === 0) return [];

            /** @type {TMMatch[]} */
            const semanticMatches = [];

            for (const item of data) {
                if (item.source_text === sourceText) continue;

                // Placeholder for true semantic scoring using embeddings
                const semanticScore = this.calculateSemanticSimilarity(
                    keywords,
                    item.source_text,
                    item.semanticTags || []
                );

                if (semanticScore >= 0.5) {
                    const matchPercentage = Math.round(semanticScore * 100);
                    const editDistance = this.calculateEditDistance(sourceText, item.source_text);
                    semanticMatches.push(this.mapToTMMatch(item, matchPercentage, 'semantic', editDistance));
                }
            }

            return semanticMatches.sort((a, b) => b.matchPercentage - a.matchPercentage).slice(0, 5);
        } catch (error) {
            console.error('Failed to find semantic matches:', error);
            return [];
        }
    }

    /**
     * Rank matches based on a hierarchy of criteria.
     * @private
     * @param {TMMatch[]} matches
     * @param {string} sourceText
     * @returns {TMMatch[]}
     */
    static rankMatches(matches, sourceText) {
        return matches.sort((a, b) => {
            // Primary sort by match percentage
            if (a.matchPercentage !== b.matchPercentage) {
                return b.matchPercentage - a.matchPercentage;
            }

            // Secondary sort by quality score
            if (a.qualityScore !== b.qualityScore) {
                return b.qualityScore - a.qualityScore;
            }

            // Tertiary sort by usage count (more used = better)
            if (a.usageCount !== b.usageCount) {
                return b.usageCount - a.usageCount;
            }

            // Final sort by confidence score
            return b.confidenceScore - a.confidenceScore;
        });
    }

    /**
     * Filter matches based on quality and domain.
     * @private
     * @param {TMMatch[]} matches
     * @param {number} qualityThreshold
     * @param {string} [domainFilter]
     * @returns {TMMatch[]}
     */
    static filterMatches(matches, qualityThreshold, domainFilter) {
        return matches.filter(match => {
            if (match.qualityScore < qualityThreshold) return false;
            if (domainFilter && match.domainCategory !== domainFilter) return false;
            return true;
        });
    }

    /**
     * Calculate search statistics.
     * @private
     * @param {TMMatch[]} matches
     * @returns {TMSearchStats}
     */
    static calculateSearchStats(matches) {
        const totalMatches = matches.length;
        const exactMatches = matches.filter(m => m.matchType === 'exact').length;
        const fuzzyMatches = matches.filter(m => m.matchType === 'fuzzy').length;
        const semanticMatches = matches.filter(m => m.matchType === 'semantic').length;

        const averageConfidence = matches.length > 0 ?
            matches.reduce((sum, m) => sum + m.confidenceScore, 0) / matches.length : 0;

        const suggestedLeverage = matches.length > 0 ?
            Math.max(...matches.map(m => m.leveragePercentage)) : 0;

        /** @type {TMSearchStats} */
        return {
            totalMatches,
            exactMatches,
            fuzzyMatches,
            semanticMatches,
            averageConfidence: Math.round(averageConfidence * 100) / 100,
            suggestedLeverage: Math.round(suggestedLeverage)
        };
    }

    /**
     * Generate recommendations based on search results.
     * @private
     * @param {TMMatch[]} matches
     * @param {string} sourceText
     * @returns {TMSearchRecommendations}
     */
    static generateRecommendations(matches, sourceText) {
        const bestMatch = matches.length > 0 ? matches[0] : null;
        const qualityMatches = matches.filter(m => m.qualityScore >= 0.8);
        const contextualMatches = matches.filter(m => m.contextSimilarity >= 0.7);

        /** @type {string[]} */
        const improvementSuggestions = [];

        if (matches.length === 0) {
            improvementSuggestions.push('No matches found. Consider adding this as a new TM entry after translation.');
        } else if (bestMatch && bestMatch.matchPercentage < 90) {
            improvementSuggestions.push('Best match is below 90%. Review translation carefully for accuracy.');
        }

        if (qualityMatches.length < matches.length / 2) {
            improvementSuggestions.push('Many matches have low quality scores. Consider TM cleanup.');
        }

        if (contextualMatches.length === 0 && matches.length > 0) {
            improvementSuggestions.push('No contextual matches found. Verify domain relevance.');
        }

        /** @type {TMSearchRecommendations} */
        return {
            bestMatch,
            qualityMatches,
            contextualMatches,
            improvementSuggestions
        };
    }

    /**
     * Maps a database record to the TMMatch interface.
     * @private
     * @param {any} item
     * @param {number} matchPercentage
     * @param {TMMatch['matchType']} matchType
     * @param {number} editDistance
     * @returns {TMMatch}
     */
    static mapToTMMatch(item, matchPercentage, matchType, editDistance) {
        /** @type {TMMatch} */
        return {
            id: item.id,
            sourceText: item.source_text,
            targetText: item.target_text,
            sourceLanguage: item.source_language,
            targetLanguage: item.target_language,
            matchPercentage,
            leveragePercentage: item.confidence_level * 100 || matchPercentage, // Scale confidence
            confidenceScore: item.confidence_level || 0,
            qualityScore: item.quality_score || 0,
            contextSimilarity: this.calculateContextSimilarity(item.cultural_adaptations),
            semanticTags: item.semantic_tags || [],
            domainCategory: item.domain_context || 'general',
            contextMetadata: item.cultural_adaptations || {},
            usageCount: item.usage_count || 0,
            matchType,
            editDistance,
            lastUsed: item.updated_at
        };
    }

    /**
     * Calculates the Jaccard Similarity between two texts.
     * @private
     * @param {string} text1
     * @param {string} text2
     * @returns {number}
     */
    static calculateTextSimilarity(text1, text2) {
        const words1 = new Set(text1.toLowerCase().split(/\s+/).filter(w => w.length > 0));
        const words2 = new Set(text2.toLowerCase().split(/\s+/).filter(w => w.length > 0));

        const intersection = new Set([...words1].filter(x => words2.has(x)));
        const union = new Set([...words1, ...words2]);

        return union.size === 0 ? 0 : intersection.size / union.size;
    }

    /**
     * Calculates the Levenshtein Edit Distance between two strings.
     * @private
     * @param {string} str1
     * @param {string} str2
     * @returns {number}
     */
    static calculateEditDistance(str1, str2) {
        const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));

        for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
        for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

        for (let j = 1; j <= str2.length; j++) {
            for (let i = 1; i <= str1.length; i++) {
                const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
                matrix[j][i] = Math.min(
                    matrix[j][i - 1] + 1, // Deletion
                    matrix[j - 1][i] + 1, // Insertion
                    matrix[j - 1][i - 1] + indicator // Substitution/Match
                );
            }
        }

        return matrix[str2.length][str1.length];
    }

    /**
     * Extracts simple keywords from text (removes stop words and short words).
     * @private
     * @param {string} text
     * @returns {string[]}
     */
    static extractKeywords(text) {
        const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should']);

        return text.toLowerCase()
            .split(/\s+/)
            .filter(word => word.length > 2 && !stopWords.has(word))
            .slice(0, 10); // Top 10 keywords
    }

    /**
     * Calculates simplified semantic similarity based on keyword overlap.
     * @private
     * @param {string[]} keywords
     * @param {string} targetText
     * @param {string[]} semanticTags
     * @returns {number}
     */
    static calculateSemanticSimilarity(keywords, targetText, semanticTags) {
        const targetWords = new Set(targetText.toLowerCase().split(/\s+/));
        const tagWords = new Set(semanticTags.map(tag => tag.toLowerCase()));

        let matches = 0;
        keywords.forEach(keyword => {
            if (targetWords.has(keyword) || tagWords.has(keyword)) {
                matches++;
            }
        });

        return keywords.length > 0 ? matches / keywords.length : 0;
    }

    /**
     * Calculates simplified context similarity score.
     * @private
     * @param {any} contextMetadata
     * @returns {number}
     */
    static calculateContextSimilarity(contextMetadata) {
        // Simplified context similarity - in a real system, this would compare context-specific fields
        return contextMetadata && Object.keys(contextMetadata).length > 0 ? 0.8 : 0.5;
    }

    /**
     * Calculates a simple quality score for a translation unit.
     * @private
     * @param {string} sourceText
     * @param {string} targetText
     * @returns {Promise<number>}
     */
    static async calculateQualityScore(sourceText, targetText) {
        // Simple quality scoring based on length ratio and completeness
        const sourceLengthRatio = targetText.length / sourceText.length;
        let score = 0.8; // Base score

        // Penalize if target is much shorter or longer than source
        if (sourceLengthRatio < 0.7 || sourceLengthRatio > 1.5) {
            score -= 0.2;
        }

        // Check if target seems complete (has punctuation)
        if (targetText.match(/[.!?]$/)) {
            score += 0.1;
        }

        return Math.max(0, Math.min(1, score));
    }
}