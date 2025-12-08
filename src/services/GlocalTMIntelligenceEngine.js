// GLOCAL Translation Memory Intelligence Engine
// Provides smart TM matching, quality scoring, and context-aware suggestions

// NOTE: Assuming '@/integrations/supabase/client' resolves correctly in the JS environment.
import { supabase } from "../integrations/supabase/client.js";

export class GlocalTMIntelligenceEngine {
  /**
   * Find TM matches for a content segment
   * @param {object} segment - The content segment object.
   * @param {string} targetLanguage - The desired target language.
   * @param {string} [therapeuticArea] - Optional therapeutic area for context.
   * @returns {Promise<Array<object>>} Array of Translation Memory matches.
   */
  static async findMatches(
    segment,
    targetLanguage,
    therapeuticArea
  ) {
    try {
      const { data: tmEntries, error } = await supabase
        .from('glocal_tm_intelligence')
        .select('*')
        .eq('target_language', targetLanguage)
        .gte('match_score', 70) // Only high-quality matches
        .order('match_score', { ascending: false })
        .limit(10);

      if (error) throw error;

      // Score and rank matches
      const matches = (tmEntries || []).map(tm => {
        const matchScore = this.calculateMatchScore(segment.source_text, tm.tm_source_text);
        // Note: Casting removed, assuming tm structure is compatible
        const contextScore = this.calculateContextScore(segment, tm, therapeuticArea);

        return {
          tmId: tm.id,
          sourceText: tm.tm_source_text,
          targetText: tm.tm_target_text,
          matchScore: matchScore,
          matchType: this.determineMatchType(matchScore),
          qualityScore: tm.quality_score,
          confidenceLevel: (matchScore + contextScore + tm.confidence_level) / 3,
          metadata: tm.tm_metadata || {}
        };
      });

      return matches.sort((a, b) => b.confidenceLevel - a.confidenceLevel);
    } catch (error) {
      console.error('Error finding TM matches:', error);
      return [];
    }
  }

  /**
   * Generate TM suggestions for entire project
   * @param {string} projectId - The project ID.
   * @param {string} targetLanguage - The desired target language.
   * @returns {Promise<Array<object>>} Array of TMSuggestion objects.
   */
  static async generateProjectSuggestions(
    projectId,
    targetLanguage
  ) {
    try {
      // Get all segments for project
      const { data: segments, error } = await supabase
        .from('glocal_content_segments')
        .select('*')
        .eq('project_id', projectId);

      if (error) throw error;

      const suggestions = [];

      for (const segment of segments || []) {
        // Casting removed
        const matches = await this.findMatches(segment, targetLanguage);

        if (matches.length > 0) {
          const bestMatch = matches[0];
          suggestions.push({
            segmentId: segment.id,
            matches: matches.slice(0, 3), // Top 3 matches
            recommendation: bestMatch.targetText,
            confidenceScore: bestMatch.confidenceLevel,
            // Casting removed
            reasoning: this.generateReasoning(bestMatch, segment)
          });
        }
      }

      return suggestions;
    } catch (error) {
      console.error('Error generating project suggestions:', error);
      return [];
    }
  }

  /**
   * Calculate TM leverage score for project
   * @param {string} projectId - The project ID.
   * @returns {Promise<number>} The calculated TM leverage score (0-100).
   */
  static async calculateLeverageScore(projectId) {
    try {
      const { data: segments } = await supabase
        .from('glocal_content_segments')
        .select('*')
        .eq('project_id', projectId);

      const { data: tmMatches } = await supabase
        .from('glocal_tm_intelligence')
        .select('*')
        .eq('project_id', projectId)
        .gte('match_score', 80);

      if (!segments || !tmMatches) return 0;

      const leverageRatio = (tmMatches.length / segments.length) * 100;
      return Math.round(leverageRatio);
    } catch (error) {
      console.error('Error calculating leverage score:', error);
      return 0;
    }
  }

  /**
   * Add new TM entry
   * @param {string} segmentId - The ID of the content segment.
   * @param {string} projectId - The project ID.
   * @param {string} sourceText - The source text.
   * @param {string} targetText - The target text.
   * @param {string} sourceLanguage - The source language code.
   * @param {string} targetLanguage - The target language code.
   * @param {object} [metadata] - Optional metadata.
   * @returns {Promise<void>}
   */
  static async addTMEntry(
    segmentId,
    projectId,
    sourceText,
    targetText,
    sourceLanguage,
    targetLanguage,
    metadata
  ) {
    try {
      await supabase.from('glocal_tm_intelligence').insert({
        segment_id: segmentId,
        project_id: projectId,
        tm_source_text: sourceText,
        tm_target_text: targetText,
        source_language: sourceLanguage,
        target_language: targetLanguage,
        match_score: 100, // New translations are perfect matches
        match_type: 'exact',
        quality_score: 85,
        confidence_level: 90,
        tm_metadata: metadata || {},
        usage_count: 1
      });
    } catch (error) {
      console.error('Error adding TM entry:', error);
    }
  }

  // Private helper methods

  /**
   * @private
   */
  static calculateMatchScore(text1, text2) {
    // Simple Levenshtein distance-based scoring
    const longer = text1.length > text2.length ? text1 : text2;
    const shorter = text1.length > text2.length ? text2 : text1;

    if (longer.length === 0) return 100;
    if (text1 === text2) return 100;

    const distance = this.levenshteinDistance(text1.toLowerCase(), text2.toLowerCase());
    const score = ((longer.length - distance) / longer.length) * 100;

    return Math.round(score);
  }

  /**
   * @private
   */
  static levenshteinDistance(str1, str2) {
    const matrix = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1,     // insertion
            matrix[i - 1][j] + 1      // deletion
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  }

  /**
   * @private
   */
  static calculateContextScore(
    segment,
    tm,
    therapeuticArea
  ) {
    let score = 50;

    // Therapeutic area match
    if (therapeuticArea && tm.therapeutic_area === therapeuticArea) {
      score += 25;
    }

    // Segment type match
    if (tm.tm_metadata?.segmentType === segment.segment_type) {
      score += 15;
    }

    // Complexity level match
    if (tm.tm_metadata?.complexity === segment.complexity_level) {
      score += 10;
    }

    return Math.min(100, score);
  }

  /**
   * @private
   */
  static determineMatchType(score) {
    if (score >= 95) return 'exact';
    if (score >= 80) return 'fuzzy';
    if (score >= 70) return 'context';
    return 'terminology';
  }

  /**
   * @private
   */
  static generateReasoning(match, segment) {
    const reasons = [];

    if (match.matchScore >= 95) {
      reasons.push('Exact match found in translation memory');
    } else if (match.matchScore >= 80) {
      reasons.push('High similarity match with proven quality');
    }

    if (match.qualityScore >= 90) {
      reasons.push('Excellent historical quality score');
    }

    if (segment.complexity_level === 'high') {
      reasons.push('Complex segment - review carefully');
    }

    return reasons;
  }
}