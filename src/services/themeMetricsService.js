import { supabase } from "./integrations/supabase/client.js";

/**
 * @typedef {Object} DataSource
 * @property {string} name
 * @property {string} table
 * @property {number} recordCount
 * @property {string | null} lastUpdated
 *
 * @typedef {Object} DataAttribution
 * @property {DataSource[]} sources
 * @property {number} totalRecords
 * @property {string} dataRecency
 * @property {'high' | 'medium' | 'low' | 'insufficient'} confidenceLevel
 *
 * @typedef {Object} ThemeMetrics
 * @property {number | null} dataConfidence - Calculated score (0-100) based on data coverage.
 * @property {number | null} evidenceStrength - Calculated score (0-100) based on claim approval and references.
 * @property {number | null} successProbability - Calculated score (0-100) based on historical performance.
 * @property {number | null} competitiveEdge - Calculated score (0-100) based on competitive intelligence.
 * @property {number | null} engagementRate - Average historical engagement rate.
 * @property {number | null} mlrApprovalRate - Average MLR approval compliance score.
 * @property {number | null} expectedReach - Estimated reach based on historical engagement.
 * @property {DataAttribution} attribution - Metadata about the data sources.
 *
 * @typedef {Object} RawMetricsData
 * @property {Object} campaignPerformance
 * @property {number | null} campaignPerformance.avgEngagement
 * @property {number | null} campaignPerformance.avgOpenRate
 * @property {number | null} campaignPerformance.avgClickRate
 * @property {number | null} campaignPerformance.avgConversion
 * @property {number} campaignPerformance.totalCampaigns
 * @property {string | null} campaignPerformance.lastUpdated
 * @property {Object} clinicalEvidence
 * @property {number} clinicalEvidence.claimCount
 * @property {number} clinicalEvidence.approvedClaimCount
 * @property {number} clinicalEvidence.referenceCount
 * @property {string | null} clinicalEvidence.lastUpdated
 * @property {Object} competitiveIntel
 * @property {number} competitiveIntel.competitorCount
 * @property {number | null} competitiveIntel.avgThreatLevel
 * @property {boolean} competitiveIntel.marketShareData
 * @property {string | null} competitiveIntel.lastUpdated
 * @property {Object} contentPerformance
 * @property {number} contentPerformance.topPerformingElements
 * @property {number | null} contentPerformance.avgPerformanceScore
 * @property {string | null} contentPerformance.lastUpdated
 * @property {Object} mlrHistory
 * @property {number} mlrHistory.totalSubmissions
 * @property {number | null} mlrHistory.approvalRate
 * @property {string | null} mlrHistory.lastUpdated
 */

export class ThemeMetricsService {
  /**
   * Fetch all metrics data from real database tables and calculate final scores.
   * @param {string} brandId
   * @returns {Promise<ThemeMetrics>}
   */
  static async getMetricsForBrand(brandId) {
    const rawData = await this.fetchRawMetrics(brandId);
    return this.calculateMetrics(rawData);
  }

  /**
   * Fetch raw data from all relevant tables in parallel.
   * @param {string} brandId
   * @returns {Promise<RawMetricsData>}
   */
  static async fetchRawMetrics(brandId) {
    // Fetch all data in parallel
    const [
      campaignData,
      claimsData,
      referencesData,
      competitiveData,
      contentPerformanceData,
      complianceData
    ] = await Promise.all([
      // Campaign performance
      supabase
        .from('campaign_performance_analytics')
        .select('engagement_score, open_rate, click_rate, conversion_rate, calculated_at')
        .eq('brand_id', brandId)
        .order('calculated_at', { ascending: false })
        .limit(50),
      
      // Clinical claims
      supabase
        .from('clinical_claims')
        .select('id, review_status, updated_at')
        .eq('brand_id', brandId),
      
      // Clinical references
      supabase
        .from('clinical_references')
        .select('id, updated_at')
        .eq('brand_id', brandId),
      
      // Competitive intelligence
      supabase
        .from('competitive_intelligence')
        .select('id, threat_level, market_share_percent, last_updated')
        .eq('brand_id', brandId),
      
      // Content element performance (only top performers, score >= 70)
      supabase
        .from('content_element_performance')
        .select('id, avg_performance_score, last_calculated')
        .eq('brand_id', brandId)
        .gte('avg_performance_score', 70),
      
      // Compliance history for MLR approval rate
      supabase
        .from('compliance_history')
        .select('id, overall_compliance_score, checked_at')
        .order('checked_at', { ascending: false })
        .limit(100)
    ]);

    // Error handling is omitted here, assuming the caller handles promise rejections,
    // and we default to empty arrays if data is null/undefined.

    // Process campaign data
    const campaigns = campaignData.data || [];
    const avgEngagement = campaigns.length > 0 
      ? campaigns.reduce((sum, c) => sum + (c.engagement_score || 0), 0) / campaigns.length 
      : null;
    const avgOpenRate = campaigns.length > 0 
      ? campaigns.reduce((sum, c) => sum + (c.open_rate || 0), 0) / campaigns.length 
      : null;
    const avgClickRate = campaigns.length > 0 
      ? campaigns.reduce((sum, c) => sum + (c.click_rate || 0), 0) / campaigns.length 
      : null;
    const avgConversion = campaigns.length > 0 
      ? campaigns.reduce((sum, c) => sum + (c.conversion_rate || 0), 0) / campaigns.length 
      : null;

    // Process claims data
    const claims = claimsData.data || [];
    const approvedClaims = claims.filter(c => c.review_status === 'approved');

    // Process competitive data
    const competitors = competitiveData.data || [];
    /** @type {Record<string, number>} */
    const threatLevelMap = { 'high': 3, 'medium': 2, 'low': 1 };
    const avgThreat = competitors.length > 0
      ? competitors.reduce((sum, c) => sum + (threatLevelMap[c.threat_level || 'low'] || 1), 0) / competitors.length
      : null;
    const hasMarketShare = competitors.some(c => c.market_share_percent !== null);

    // Process content performance
    const topElements = contentPerformanceData.data || [];
    const avgPerfScore = topElements.length > 0
      ? topElements.reduce((sum, e) => sum + (e.avg_performance_score || 0), 0) / topElements.length
      : null;

    // Process compliance/MLR data
    const compliance = complianceData.data || [];
    const mlrApproval = compliance.length > 0
      ? compliance.reduce((sum, c) => sum + (c.overall_compliance_score || 0), 0) / compliance.length
      : null;

    /** @type {RawMetricsData} */
    return {
      campaignPerformance: {
        avgEngagement,
        avgOpenRate,
        avgClickRate,
        avgConversion,
        totalCampaigns: campaigns.length,
        lastUpdated: campaigns[0]?.calculated_at || null
      },
      clinicalEvidence: {
        claimCount: claims.length,
        approvedClaimCount: approvedClaims.length,
        referenceCount: (referencesData.data || []).length,
        lastUpdated: claims[0]?.updated_at || null
      },
      competitiveIntel: {
        competitorCount: competitors.length,
        avgThreatLevel: avgThreat,
        marketShareData: hasMarketShare,
        lastUpdated: competitors[0]?.last_updated || null
      },
      contentPerformance: {
        topPerformingElements: topElements.length,
        avgPerformanceScore: avgPerfScore,
        lastUpdated: topElements[0]?.last_calculated || null
      },
      mlrHistory: {
        totalSubmissions: compliance.length,
        approvalRate: mlrApproval,
        lastUpdated: compliance[0]?.checked_at || null
      }
    };
  }

  /**
   * Calculate final metrics from raw data and generate attribution metadata.
   * @param {RawMetricsData} raw
   * @returns {ThemeMetrics}
   */
  static calculateMetrics(raw) {
    /** @type {DataSource[]} */
    const sources = [];
    let totalRecords = 0;
    let latestUpdate = null;

    // --- Build Attribution Data ---

    // Campaign performance
    if (raw.campaignPerformance.totalCampaigns > 0) {
      sources.push({
        name: 'Campaign Analytics',
        table: 'campaign_performance_analytics',
        recordCount: raw.campaignPerformance.totalCampaigns,
        lastUpdated: raw.campaignPerformance.lastUpdated
      });
      totalRecords += raw.campaignPerformance.totalCampaigns;
      if (raw.campaignPerformance.lastUpdated) {
        const date = new Date(raw.campaignPerformance.lastUpdated);
        if (!latestUpdate || date > latestUpdate) latestUpdate = date;
      }
    }

    // Clinical evidence
    if (raw.clinicalEvidence.claimCount > 0) {
      sources.push({
        name: 'Clinical Claims',
        table: 'clinical_claims',
        recordCount: raw.clinicalEvidence.claimCount,
        lastUpdated: raw.clinicalEvidence.lastUpdated
      });
      totalRecords += raw.clinicalEvidence.claimCount;
    }

    if (raw.clinicalEvidence.referenceCount > 0) {
      sources.push({
        name: 'Clinical References',
        table: 'clinical_references',
        recordCount: raw.clinicalEvidence.referenceCount,
        lastUpdated: null // Last updated date not fetched for this table
      });
      totalRecords += raw.clinicalEvidence.referenceCount;
    }

    // Competitive intel
    if (raw.competitiveIntel.competitorCount > 0) {
      sources.push({
        name: 'Competitive Intelligence',
        table: 'competitive_intelligence',
        recordCount: raw.competitiveIntel.competitorCount,
        lastUpdated: raw.competitiveIntel.lastUpdated
      });
      totalRecords += raw.competitiveIntel.competitorCount;
    }

    // Content performance
    if (raw.contentPerformance.topPerformingElements > 0) {
      sources.push({
        name: 'Content Performance',
        table: 'content_element_performance',
        recordCount: raw.contentPerformance.topPerformingElements,
        lastUpdated: raw.contentPerformance.lastUpdated
      });
      totalRecords += raw.contentPerformance.topPerformingElements;
    }
    
    // Determine confidence level
    const confidenceLevel = this.determineConfidenceLevel(raw);

    // Calculate data recency
    const dataRecency = latestUpdate 
      ? this.formatRecency(latestUpdate)
      : 'No recent data';

    // --- Calculate Final Metrics ---
    const dataConfidence = this.calculateDataConfidence(raw);
    const evidenceStrength = this.calculateEvidenceStrength(raw);
    const successProbability = this.calculateSuccessProbability(raw);
    const competitiveEdge = this.calculateCompetitiveEdge(raw);
    const engagementRate = raw.campaignPerformance.avgEngagement;
    const mlrApprovalRate = raw.mlrHistory.approvalRate;
    const expectedReach = this.calculateExpectedReach(raw);

    /** @type {ThemeMetrics} */
    return {
      dataConfidence,
      evidenceStrength,
      successProbability,
      competitiveEdge,
      engagementRate,
      mlrApprovalRate,
      expectedReach,
      attribution: {
        sources,
        totalRecords,
        dataRecency,
        confidenceLevel
      }
    };
  }

  /**
   * @param {RawMetricsData} raw
   * @returns {'high' | 'medium' | 'low' | 'insufficient'}
   */
  static determineConfidenceLevel(raw) {
    const hasPerformanceData = raw.campaignPerformance.totalCampaigns >= 10;
    const hasEvidenceData = raw.clinicalEvidence.claimCount >= 5;
    const hasCompetitiveData = raw.competitiveIntel.competitorCount >= 1;

    if (hasPerformanceData && hasEvidenceData && hasCompetitiveData) return 'high';
    if (hasPerformanceData || hasEvidenceData) return 'medium';
    if (raw.campaignPerformance.totalCampaigns > 0 || raw.clinicalEvidence.claimCount > 0) return 'low';
    return 'insufficient';
  }

  /**
   * @param {RawMetricsData} raw
   * @returns {number | null}
   */
  static calculateDataConfidence(raw) {
    // Weights based on data contribution importance (40 + 30 + 20 + 10 = 100 max)
    const performanceWeight = Math.min(raw.campaignPerformance.totalCampaigns / 20, 1) * 40;
    const evidenceWeight = Math.min(raw.clinicalEvidence.claimCount / 10, 1) * 30;
    const competitiveWeight = Math.min(raw.competitiveIntel.competitorCount / 3, 1) * 20;
    const contentWeight = Math.min(raw.contentPerformance.topPerformingElements / 10, 1) * 10;

    const total = performanceWeight + evidenceWeight + competitiveWeight + contentWeight;
    if (total === 0) return null;
    
    return Math.round(total);
  }

  /**
   * @param {RawMetricsData} raw
   * @returns {number | null}
   */
  static calculateEvidenceStrength(raw) {
    const totalEvidence = raw.clinicalEvidence.claimCount + raw.clinicalEvidence.referenceCount;
    if (totalEvidence === 0) return null;

    const approvalRate = raw.clinicalEvidence.claimCount > 0
      ? (raw.clinicalEvidence.approvedClaimCount / raw.clinicalEvidence.claimCount) * 100
      : 0;

    // Weight: 60% from quantity (capped at 20 items), 40% from approval rate
    const quantityScore = Math.min(totalEvidence / 20, 1) * 60;
    const qualityScore = approvalRate * 0.4;

    return Math.round(quantityScore + qualityScore);
  }

  /**
   * @param {RawMetricsData} raw
   * @returns {number | null}
   */
  static calculateSuccessProbability(raw) {
    if (raw.campaignPerformance.totalCampaigns === 0) return null;

    // Normalize engagement (e.g., scale 0-100)
    const engagementFactor = raw.campaignPerformance.avgEngagement || 50;
    // Conversion rate is typically low, multiply by 10 to give it weight
    const conversionFactor = (raw.campaignPerformance.avgConversion || 0) * 10;
    // Add bonus for high-performing content
    const performanceBonus = raw.contentPerformance.avgPerformanceScore 
      ? (raw.contentPerformance.avgPerformanceScore - 70) * 0.5 
      : 0;
    
    // Base probability + weighted factors
    return Math.min(95, Math.max(20, Math.round(engagementFactor * 0.6 + conversionFactor + performanceBonus + 30)));
  }

  /**
   * @param {RawMetricsData} raw
   * @returns {number | null}
   */
  static calculateCompetitiveEdge(raw) {
    if (raw.competitiveIntel.competitorCount === 0) return null;

    let score = 50;

    // Market share data availability adds confidence
    if (raw.competitiveIntel.marketShareData) score += 15;

    // More competitors tracked = better visibility
    score += Math.min(raw.competitiveIntel.competitorCount * 5, 20);

    // Lower threat level = higher edge (Threat: 3=High, 2=Medium, 1=Low). Subtracting from 3 reverses the logic.
    if (raw.competitiveIntel.avgThreatLevel !== null) {
      score += (3 - raw.competitiveIntel.avgThreatLevel) * 5;
    }

    return Math.min(95, Math.max(20, Math.round(score)));
  }

  /**
   * @param {RawMetricsData} raw
   * @returns {number | null}
   */
  static calculateExpectedReach(raw) {
    if (raw.campaignPerformance.totalCampaigns === 0 || raw.campaignPerformance.avgEngagement === null) return null;

    // Simple heuristic: Base reach times an engagement multiplier (50 is considered baseline/average engagement)
    const baseReach = 5000;
    const engagementMultiplier = raw.campaignPerformance.avgEngagement / 50;

    return Math.round(baseReach * engagementMultiplier);
  }

  /**
   * @param {Date} date
   * @returns {string}
   */
  static formatRecency(date) {
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 90) return `${Math.floor(diffDays / 30)} months ago`;
    return 'Over 3 months ago';
  }
}