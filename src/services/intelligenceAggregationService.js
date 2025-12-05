// Intelligence Aggregation Service
// Unified service that pulls all intelligence sources together for AI generation

import { supabase } from './integrations/supabase/client';

export class IntelligenceAggregationService {
  /**
   * Aggregates all intelligence sources for a given brand
   * @param {string} brandId
   * @returns {Promise<object>} UnifiedIntelligence object.
   */
  static async aggregateIntelligence(brandId) {
    // The original TypeScript code used Promise.all to fetch data concurrently.
    const [brand, evidence, performance, competitive, audience] = await Promise.all([
      this.getBrandIntelligence(brandId),
      this.getEvidenceIntelligence(brandId),
      this.getPerformanceIntelligence(brandId),
      this.getCompetitiveIntelligence(brandId),
      this.getAudienceIntelligence(brandId),
    ]);

    const dataReadiness = this.calculateDataReadiness({
      brand,
      evidence,
      performance,
      competitive,
      audience,
    });

    return {
      brand,
      evidence,
      performance,
      competitive,
      audience,
      aggregatedAt: new Date().toISOString(),
      dataReadiness,
    };
  }

  /**
   * Get brand intelligence (profile, guidelines, vision, markets)
   * @private
   * @param {string} brandId
   * @returns {Promise<object>} BrandIntelligence object.
   */
  static async getBrandIntelligence(brandId) {
    const [profileData, guidelinesData, visionData, marketsData] = await Promise.all([
      supabase.from('brand_profiles').select('*').eq('id', brandId).single(),
      supabase.from('brand_guidelines').select('*').eq('brand_id', brandId).single(),
      supabase.from('brand_vision').select('*').eq('brand_id', brandId).single(),
      supabase.from('brand_market_configurations').select('*').eq('brand_id', brandId),
    ]);

    return {
      profile: profileData.data,
      guidelines: guidelinesData.data,
      vision: visionData.data,
      markets: marketsData.data || [],
    };
  }

  /**
   * Get evidence intelligence (claims, references, content segments)
   * @private
   * @param {string} brandId
   * @returns {Promise<object>} EvidenceIntelligence object.
   */
  static async getEvidenceIntelligence(brandId) {
    const claimsPromise = supabase
      .from('clinical_claims')
      .select('*')
      .eq('brand_id', brandId)
      .eq('review_status', 'approved')
      .order('usage_count', { ascending: false })
      .limit(50);

    const referencesPromise = supabase
      .from('clinical_references')
      .select('*')
      .eq('brand_id', brandId)
      .order('created_at', { ascending: false })
      .limit(50);

    const [claimsData, referencesData] = await Promise.all([
      claimsPromise,
      referencesPromise,
    ]);

    return {
      claims: claimsData.data || [],
      references: referencesData.data || [],
      contentSegments: [], // Placeholders
      safetyStatements: [], // Placeholders
    };
  }

  /**
   * Get performance intelligence (success patterns, analytics, trends)
   * @private
   * @param {string} brandId
   * @returns {Promise<object>} PerformanceIntelligence object.
   */
  static async getPerformanceIntelligence(brandId) {
    const patternsPromise = supabase
      .from('content_success_patterns')
      .select('*')
      .eq('brand_id', brandId)
      .gte('confidence_score', 0.7)
      .order('confidence_score', { ascending: false })
      .limit(20);

    const analyticsPromise = supabase
      .from('campaign_performance_analytics')
      .select('*')
      .eq('brand_id', brandId)
      .order('reporting_period', { ascending: false })
      .limit(10);

    const [patternsData, analyticsData] = await Promise.all([
      patternsPromise,
      analyticsPromise,
    ]);

    return {
      successPatterns: patternsData.data || [],
      campaignAnalytics: analyticsData.data || [],
      contentTrends: [], // Placeholders
      topElements: [], // Placeholders
    };
  }

  /**
   * Get competitive intelligence
   * @private
   * @param {string} brandId
   * @returns {Promise<object>} CompetitiveIntelligence object.
   */
  static async getCompetitiveIntelligence(brandId) {
    const [competitorsData, landscapeData, enrichedData] = await Promise.all([
      supabase
        .from('competitive_intelligence')
        .select('*')
        .eq('brand_id', brandId)
        .order('last_updated', { ascending: false })
        .limit(10),
      supabase
        .from('competitive_landscape')
        .select('*')
        .eq('brand_id', brandId)
        .limit(10),
      supabase
        .from('competitive_intelligence_enriched')
        .select('*')
        .eq('brand_id', brandId)
        .eq('status', 'active')
        .order('discovered_at', { ascending: false })
        .limit(10),
    ]);

    return {
      competitors: competitorsData.data || [],
      landscape: landscapeData.data || [],
      enrichedIntel: enrichedData.data || [],
    };
  }

  /**
   * Get audience intelligence
   * @private
   * @param {string} brandId
   * @returns {Promise<object>} AudienceIntelligence object.
   */
  static async getAudienceIntelligence(brandId) {
    const { data: segments } = await supabase
      .from('audience_segments')
      .select('*')
      .eq('brand_id', brandId)
      .limit(10);

    const typedSegments = segments || [];

    // Aggregate preferences and engagement patterns
    const preferences = typedSegments.reduce((acc, segment) => {
      const channelPrefs = Array.isArray(segment.channel_preferences) ? segment.channel_preferences : [];
      const contentPrefs = typeof segment.content_preferences === 'object' && segment.content_preferences !== null ? [segment.content_preferences] : [];
      const messagingPrefs = typeof segment.messaging_preferences === 'object' && segment.messaging_preferences !== null ? [segment.messaging_preferences] : [];

      return {
        channels: [...(acc.channels || []), ...channelPrefs],
        content: [...(acc.content || []), ...contentPrefs],
        messaging: [...(acc.messaging || []), ...messagingPrefs],
      };
    }, { channels: [], content: [], messaging: [] });

    const engagement = typedSegments.reduce((acc, segment) => {
      const engagementPatterns = typeof segment.engagement_patterns === 'object' && segment.engagement_patterns !== null ? [segment.engagement_patterns] : [];
      const barriers = Array.isArray(segment.barriers_to_engagement) ? segment.barriers_to_engagement : [];
      const motivations = Array.isArray(segment.motivations) ? segment.motivations : [];

      return {
        patterns: [...(acc.patterns || []), ...engagementPatterns],
        barriers: [...(acc.barriers || []), ...barriers],
        motivations: [...(acc.motivations || []), ...motivations],
      };
    }, { patterns: [], barriers: [], motivations: [] });

    return {
      segments: typedSegments,
      preferences,
      engagement,
    };
  }

  /**
   * Calculate data readiness scores
   * @private
   * @param {object} intelligence
   * @returns {object} DataReadiness object.
   */
  static calculateDataReadiness(intelligence) {
    const brandScore = this.calculateBrandReadiness(intelligence.brand);
    const evidenceScore = this.calculateEvidenceReadiness(intelligence.evidence);
    const performanceScore = this.calculatePerformanceReadiness(intelligence.performance);
    const competitiveScore = this.calculateCompetitiveReadiness(intelligence.competitive);
    const audienceScore = this.calculateAudienceReadiness(intelligence.audience);

    const overall = Math.round(
      (brandScore + evidenceScore + performanceScore + competitiveScore + audienceScore) / 5
    );

    return {
      brand: brandScore,
      evidence: evidenceScore,
      performance: performanceScore,
      competitive: competitiveScore,
      audience: audienceScore,
      overall,
    };
  }

  /**
   * @private
   */
  static calculateBrandReadiness(brand) {
    if (!brand) return 0;
    let score = 0;
    if (brand.profile) score += 40;
    if (brand.guidelines) score += 30;
    if (brand.vision) score += 20;
    if (brand.markets && brand.markets.length > 0) score += 10;
    return score;
  }

  /**
   * @private
   */
  static calculateEvidenceReadiness(evidence) {
    if (!evidence) return 0;
    let score = 0;
    if (evidence.claims && evidence.claims.length >= 10) score += 40;
    else if (evidence.claims && evidence.claims.length > 0) score += 20;
    if (evidence.references && evidence.references.length >= 5) score += 30;
    else if (evidence.references && evidence.references.length > 0) score += 15;
    if (evidence.contentSegments && evidence.contentSegments.length > 0) score += 20;
    if (evidence.safetyStatements && evidence.safetyStatements.length > 0) score += 10;
    return Math.min(score, 100);
  }

  /**
   * @private
   */
  static calculatePerformanceReadiness(performance) {
    if (!performance) return 0;
    let score = 0;
    if (performance.successPatterns && performance.successPatterns.length >= 5) score += 40;
    else if (performance.successPatterns && performance.successPatterns.length > 0) score += 20;
    if (performance.campaignAnalytics && performance.campaignAnalytics.length > 0) score += 30;
    if (performance.contentTrends && performance.contentTrends.length > 0) score += 20;
    if (performance.topElements && performance.topElements.length > 0) score += 10;
    return Math.min(score, 100);
  }

  /**
   * @private
   */
  static calculateCompetitiveReadiness(competitive) {
    if (!competitive) return 0;
    let score = 0;
    if (competitive.competitors && competitive.competitors.length >= 3) score += 50;
    else if (competitive.competitors && competitive.competitors.length > 0) score += 25;
    if (competitive.landscape && competitive.landscape.length > 0) score += 30;
    if (competitive.enrichedIntel && competitive.enrichedIntel.length > 0) score += 20;
    return Math.min(score, 100);
  }

  /**
   * @private
   */
  static calculateAudienceReadiness(audience) {
    if (!audience) return 0;
    let score = 0;
    if (audience.segments && audience.segments.length >= 3) score += 60;
    else if (audience.segments && audience.segments.length > 0) score += 30;
    if (audience.preferences) score += 20;
    if (audience.engagement) score += 20;
    return Math.min(score, 100);
  }

  /**
   * Get intelligence summary for AI context
   * @param {string} brandId
   * @returns {Promise<string>} A summarized string of all intelligence.
   */
  static async getIntelligenceSummary(brandId) {
    const intelligence = await this.aggregateIntelligence(brandId);

    const summary = `
BRAND INTELLIGENCE:
- Brand: ${intelligence.brand.profile?.brand_name || 'Unknown'}
- Therapeutic Area: ${intelligence.brand.profile?.therapeutic_area || 'Unknown'}
- Markets: ${intelligence.brand.markets?.length || 0} configured
- Guidelines: ${intelligence.brand.guidelines ? 'Available' : 'Not configured'}
- Vision: ${intelligence.brand.vision ? 'Defined' : 'Not defined'}

EVIDENCE INTELLIGENCE:
- Clinical Claims: ${intelligence.evidence.claims?.length || 0} approved claims
- References: ${intelligence.evidence.references?.length || 0} citations
- Content Segments: ${intelligence.evidence.contentSegments?.length || 0} modules
- Safety Statements: ${intelligence.evidence.safetyStatements?.length || 0} active

PERFORMANCE INTELLIGENCE:
- Success Patterns: ${intelligence.performance.successPatterns?.length || 0} identified
- Campaign Analytics: ${intelligence.performance.campaignAnalytics?.length || 0} campaigns tracked
- Content Trends: ${intelligence.performance.contentTrends?.length || 0} trends
- Top Elements: ${intelligence.performance.topElements?.length || 0} high-performing elements

COMPETITIVE INTELLIGENCE:
- Competitors Tracked: ${intelligence.competitive.competitors?.length || 0}
- Landscape Insights: ${intelligence.competitive.landscape?.length || 0}
- Recent Intel: ${intelligence.competitive.enrichedIntel?.length || 0}

AUDIENCE INTELLIGENCE:
- Segments: ${intelligence.audience.segments?.length || 0} defined
- Preferences: ${intelligence.audience.preferences ? 'Available' : 'Not available'}
- Engagement Patterns: ${intelligence.audience.engagement ? 'Available' : 'Not available'}

DATA READINESS:
- Overall: ${intelligence.dataReadiness.overall}%
- Brand: ${intelligence.dataReadiness.brand}%
- Evidence: ${intelligence.dataReadiness.evidence}%
- Performance: ${intelligence.dataReadiness.performance}%
- Competitive: ${intelligence.dataReadiness.competitive}%
- Audience: ${intelligence.dataReadiness.audience}%
    `.trim();

    return summary;
  }
}