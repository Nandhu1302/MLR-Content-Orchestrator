import { supabase } from '@/integrations/supabase/client';

/**
 * @typedef {object} IntelligenceRecommendation
 * @property {('evidence' | 'performance' | 'audience' | 'competitive')} source
 * @property {string} recommendation
 * @property {string} reasoning
 * @property {number} confidence
 * @property {string} [suggestedText]
 */

/**
 * @typedef {object} RecommendationContext
 * @property {string} [assetType]
 * @property {string} [targetAudience]
 * @property {string} [therapeuticArea]
 * @property {string} [indication]
 */

export class FieldIntelligenceService {
  /**
   * Get intelligence-based recommendations for a specific field
   * @param {string} brandId
   * @param {string} field
   * @param {string} currentValue
   * @param {RecommendationContext} context
   * @returns {Promise<IntelligenceRecommendation[]>}
   */
  static async getFieldRecommendations(
    brandId,
    field,
    currentValue,
    context
  ) {
    /** @type {IntelligenceRecommendation[]} */
    const recommendations = [];

    try {
      // Get evidence-based recommendations
      const evidenceRecs = await this.getEvidenceRecommendations(
        brandId,
        field,
        currentValue,
        context
      );
      recommendations.push(...evidenceRecs);

      // Get performance-based recommendations
      const performanceRecs = await this.getPerformanceRecommendations(
        brandId,
        field,
        context
      );
      recommendations.push(...performanceRecs);

      // Get audience-based recommendations
      const audienceRecs = await this.getAudienceRecommendations(
        brandId,
        field,
        context
      );
      recommendations.push(...audienceRecs);

      // Sort by confidence
      return recommendations.sort((a, b) => b.confidence - a.confidence);
    } catch (error) {
      console.error('Error getting field recommendations:', error);
      return [];
    }
  }

  /**
   * Get evidence-based recommendations from clinical claims
   * @param {string} brandId
   * @param {string} field
   * @param {string} currentValue
   * @param {RecommendationContext} context
   * @returns {Promise<IntelligenceRecommendation[]>}
   */
  static async getEvidenceRecommendations(
    brandId,
    field,
    currentValue,
    context
  ) {
    /** @type {IntelligenceRecommendation[]} */
    const recommendations = [];

    // Only provide evidence recommendations for body/content fields
    if (!['body', 'bodyText', 'content', 'headline'].includes(field)) {
      return recommendations;
    }

    try {
      // Get relevant clinical claims
      const { data: claims } = await supabase
        .from('clinical_claims')
        .select('*')
        .eq('brand_id', brandId)
        .eq('review_status', 'approved')
        .order('usage_count', { ascending: false })
        .limit(3);

      if (claims && claims.length > 0) {
        claims.forEach(claim => {
          recommendations.push({
            source: 'evidence',
            recommendation: `Consider incorporating approved claim: "${claim.claim_text.substring(0, 60)}..."`,
            reasoning: `This claim has been used ${claim.usage_count || 0} times and is MLR-approved. High-confidence clinical evidence.`,
            confidence: claim.confidence_score || 0.85,
            suggestedText: field === 'headline'
              ? claim.claim_text.substring(0, 80)
              : claim.claim_text
          });
        });
      }
    } catch (error) {
      console.error('Error getting evidence recommendations:', error);
    }

    return recommendations;
  }

  /**
   * Get performance-based recommendations
   * @param {string} brandId
   * @param {string} field
   * @param {RecommendationContext} context
   * @returns {Promise<IntelligenceRecommendation[]>}
   */
  static async getPerformanceRecommendations(
    brandId,
    field,
    context
  ) {
    /** @type {IntelligenceRecommendation[]} */
    const recommendations = [];

    try {
      // Get high-performing content elements
      const { data: elements } = await supabase
        .from('content_element_performance')
        .select('*')
        .eq('brand_id', brandId)
        .eq('element_type', field)
        .gte('avg_performance_score', 0.7)
        .order('avg_performance_score', { ascending: false })
        .limit(2);

      if (elements && elements.length > 0) {
        elements.forEach(element => {
          recommendations.push({
            source: 'performance',
            recommendation: `High-performing ${field}: "${element.element_value.substring(0, 50)}..."`,
            reasoning: `This ${field} achieved ${Math.round((element.avg_performance_score || 0) * 100)}% performance score across ${element.usage_count} uses. Average engagement: ${Math.round((element.avg_engagement_rate || 0) * 100)}%`,
            confidence: element.avg_performance_score || 0.75,
            suggestedText: element.element_value
          });
        });
      }
    } catch (error) {
      console.error('Error getting performance recommendations:', error);
    }

    return recommendations;
  }

  /**
   * Get audience-based recommendations
   * @param {string} brandId
   * @param {string} field
   * @param {RecommendationContext} context
   * @returns {Promise<IntelligenceRecommendation[]>}
   */
  static async getAudienceRecommendations(
    brandId,
    field,
    context
  ) {
    /** @type {IntelligenceRecommendation[]} */
    const recommendations = [];

    if (!context.targetAudience) return recommendations;

    try {
      // Get audience segment preferences
      const { data: segments } = await supabase
        .from('audience_segments')
        .select('*')
        .eq('brand_id', brandId)
        .eq('segment_type', context.targetAudience)
        .limit(1);

      if (segments && segments.length > 0) {
        const segment = segments[0];
        const preferences = segment.content_preferences;

        if (preferences && preferences[field]) {
          recommendations.push({
            source: 'audience',
            recommendation: `Audience prefers ${field} that emphasizes: ${preferences[field].emphasis || 'clinical data'}`,
            reasoning: `Based on ${segment.segment_name} segment analysis. This audience responds well to ${preferences[field].tone || 'professional'} tone.`,
            confidence: 0.80
          });
        }

        // Add messaging preferences for CTAs
        if (field === 'cta' && segment.messaging_preferences) {
          const msgPrefs = segment.messaging_preferences;
          if (msgPrefs.preferredActions) {
            recommendations.push({
              source: 'audience',
              recommendation: `This audience responds to action-oriented CTAs`,
              reasoning: `Top performing actions: ${msgPrefs.preferredActions?.join(', ')}`,
              confidence: 0.78,
              suggestedText: msgPrefs.preferredActions?.[0]
            });
          }
        }
      }
    } catch (error) {
      console.error('Error getting audience recommendations:', error);
    }

    return recommendations;
  }
}