import { supabase } from "../integrations/supabase/client.js";

/**
 * @typedef {Object} EvidenceClaim
 * @property {string} id
 * @property {string} claimText
 * @property {string} claimType
 * @property {string} approvalStatus
 * @property {number} confidenceScore
 *
 * @typedef {Object} PerformanceBenchmark
 * @property {number | null} avgOpenRate
 * @property {number | null} avgClickRate
 * @property {string | null} topCampaignName
 * @property {number} campaignCount
 * @property {number} industryBenchmarkOpen
 * @property {number} industryBenchmarkClick
 *
 * @typedef {Object} CompetitiveEdgeData
 * @property {string} competitorName
 * @property {string[]} keyDifferentiators
 * @property {string | null} marketPosition
 * @property {string | null} threatLevel
 *
 * @typedef {Object} ThemeContextInsights
 * @property {Object} evidenceBacking
 * @property {EvidenceClaim[]} evidenceBacking.claims
 * @property {number} evidenceBacking.totalApproved
 * @property {number} evidenceBacking.totalClaims
 * @property {PerformanceBenchmark} performanceBenchmark
 * @property {CompetitiveEdgeData[]} competitiveEdge
 * @property {boolean} isLoading
 * @property {boolean} hasData
 */

export class ThemeContextInsightsService {
  /**
   * Fetches comprehensive insights for a given brand ID.
   * @param {string} brandId
   * @returns {Promise<ThemeContextInsights>}
   */
  async getInsightsForBrand(brandId) {
    const [evidenceResult, performanceResult, competitiveResult] = await Promise.all([
      this.fetchEvidenceBacking(brandId),
      this.fetchPerformanceBenchmark(brandId),
      this.fetchCompetitiveEdge(brandId)
    ]);

    const hasData =
      evidenceResult.claims.length > 0 ||
      performanceResult.campaignCount > 0 ||
      competitiveResult.length > 0;

    return {
      evidenceBacking: evidenceResult,
      performanceBenchmark: performanceResult,
      competitiveEdge: competitiveResult,
      isLoading: false,
      hasData
    };
  }

  /**
   * Fetches evidence and clinical claim backing data.
   * @param {string} brandId
   * @returns {Promise<ThemeContextInsights['evidenceBacking']>}
   */
  async fetchEvidenceBacking(brandId) {
    const { data: claims, error } = await supabase
      .from('clinical_claims')
      .select('id, claim_text, claim_type, regulatory_status, confidence_score')
      .eq('brand_id', brandId)
      .eq('regulatory_status', 'approved')
      .order('confidence_score', { ascending: false })
      .limit(3);

    if (error || !claims) {
      return { claims: [], totalApproved: 0, totalClaims: 0 };
    }

    // Get total counts (note: these run in parallel below the error check)
    const [{ count: totalApproved }, { count: totalClaims }] = await Promise.all([
        supabase
        .from('clinical_claims')
        .select('*', { count: 'exact', head: true })
        .eq('brand_id', brandId)
        .eq('regulatory_status', 'approved'),
        supabase
        .from('clinical_claims')
        .select('*', { count: 'exact', head: true })
        .eq('brand_id', brandId)
    ]);

    return {
      claims: claims.map(c => ({
        id: c.id,
        claimText: c.claim_text,
        claimType: c.claim_type,
        approvalStatus: c.regulatory_status || 'pending',
        confidenceScore: Number(c.confidence_score) || 0
      })),
      totalApproved: totalApproved || 0,
      totalClaims: totalClaims || 0
    };
  }

  /**
   * Fetches performance metrics and industry benchmarks.
   * @param {string} brandId
   * @returns {Promise<PerformanceBenchmark>}
   */
  async fetchPerformanceBenchmark(brandId) {
    const { data: campaigns, error } = await supabase
      .from('campaign_performance_analytics')
      .select('open_rate, click_rate, campaign_name, industry_benchmark_open_rate, industry_benchmark_click_rate')
      .eq('brand_id', brandId)
      .not('open_rate', 'is', null)
      .order('reporting_period', { ascending: false })
      .limit(50);

    if (error || !campaigns || campaigns.length === 0) {
      return {
        avgOpenRate: null,
        avgClickRate: null,
        topCampaignName: null,
        campaignCount: 0,
        industryBenchmarkOpen: 21.5,
        industryBenchmarkClick: 2.5
      };
    }

    // Calculate averages
    const validOpenRates = campaigns.filter(c => c.open_rate !== null).map(c => Number(c.open_rate));
    const validClickRates = campaigns.filter(c => c.click_rate !== null).map(c => Number(c.click_rate));

    const avgOpenRate = validOpenRates.length > 0
      ? validOpenRates.reduce((a, b) => a + b, 0) / validOpenRates.length
      : null;
    const avgClickRate = validClickRates.length > 0
      ? validClickRates.reduce((a, b) => a + b, 0) / validClickRates.length
      : null;

    // Find top performing campaign
    const topCampaign = campaigns.reduce((best, current) => {
      const currentScore = (Number(current.open_rate) || 0) + (Number(current.click_rate) || 0) * 5;
      const bestScore = (Number(best?.open_rate) || 0) + (Number(best?.click_rate) || 0) * 5;
      return currentScore > bestScore ? current : best;
    }, campaigns[0]);

    // Get industry benchmarks from data or use defaults
    const industryBenchmarkOpen = campaigns[0]?.industry_benchmark_open_rate
      ? Number(campaigns[0].industry_benchmark_open_rate)
      : 21.5;
    const industryBenchmarkClick = campaigns[0]?.industry_benchmark_click_rate
      ? Number(campaigns[0].industry_benchmark_click_rate)
      : 2.5;

    return {
      avgOpenRate,
      avgClickRate,
      topCampaignName: topCampaign?.campaign_name || null,
      campaignCount: campaigns.length,
      industryBenchmarkOpen,
      industryBenchmarkClick
    };
  }

  /**
   * Fetches competitive intelligence data.
   * @param {string} brandId
   * @returns {Promise<CompetitiveEdgeData[]>}
   */
  async fetchCompetitiveEdge(brandId) {
    const { data: competitors, error } = await supabase
      .from('competitive_intelligence')
      .select('competitor_name, key_differentiators, market_positioning, threat_level')
      .eq('brand_id', brandId)
      .limit(3);

    if (error || !competitors) {
      return [];
    }

    return competitors.map(c => ({
      competitorName: c.competitor_name,
      keyDifferentiators: Array.isArray(c.key_differentiators)
        ? c.key_differentiators.slice(0, 3)
        : [],
      marketPosition: c.market_positioning,
      threatLevel: c.threat_level
    }));
  }
}

export const themeContextInsightsService = new ThemeContextInsightsService();