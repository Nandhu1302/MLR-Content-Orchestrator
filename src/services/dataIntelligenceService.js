import { supabase } from './integrations/supabase/client';
// Assuming DataFilters is an imported type/interface from the React component
// import { DataFilters } from '@/components/data/DataFilters';

/**
 * @typedef {Object} MarketingIntelligence
 * @property {Object} campaignPerformance
 * @property {number} campaignPerformance.avgOpenRate
 * @property {number} campaignPerformance.avgClickRate
 * @property {number} campaignPerformance.avgEngagementScore
 * @property {string} campaignPerformance.topPerformingSegment
 * @property {string} campaignPerformance.topPerformingChannel
 * @property {'improving' | 'stable' | 'declining'} campaignPerformance.trendDirection
 * @property {Object} marketPosition
 * @property {number} marketPosition.currentMarketShare
 * @property {number} marketPosition.rxGrowthRate
 * @property {string} marketPosition.marketTrend
 * @property {string} marketPosition.competitivePosition
 * @property {number} marketPosition.shareChange
 * @property {Object} audienceInsights
 * @property {number} audienceInsights.totalActiveHCPs
 * @property {number} audienceInsights.avgEngagement
 * @property {string} audienceInsights.preferredContentType
 * @property {string} audienceInsights.preferredChannel
 * @property {string[]} audienceInsights.highValueSegments
 * @property {Object} socialIntelligence
 * @property {number} socialIntelligence.sentimentScore
 * @property {number} socialIntelligence.shareOfVoice
 * @property {string[]} socialIntelligence.trendingTopics
 * @property {string} socialIntelligence.sentimentTrend
 */

/**
 * @typedef {Object} DataFilters
 * @property {string} [timeRange]
 * @property {string} [geographicRegion]
 * // ... other filter properties
 */


export class DataIntelligenceService {
  /**
   * Fetch comprehensive marketing intelligence for a brand
   * @param {string} brandId
   * @param {number} [days=90]
   * @param {DataFilters} [filters]
   * @returns {Promise<MarketingIntelligence>}
   */
  static async fetchMarketingIntelligence(brandId, days = 90, filters) {
    try {
      // Calculate date range
      let daysToUse = days;
      if (filters?.timeRange) {
        if (filters.timeRange === 'Last 3 Months') daysToUse = 90;
        else if (filters.timeRange === 'Last 6 Months') daysToUse = 180;
        else if (filters.timeRange === 'Last 12 Months') daysToUse = 365;
      }
      const startDate = new Date(Date.now() - daysToUse * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      // Campaign Performance
      let campaignQuery = supabase
        .from('campaign_performance_analytics')
        .select('*')
        .eq('brand_id', brandId)
        .gte('reporting_period', startDate)
        .order('reporting_period', { ascending: false });

      const { data: campaigns } = await campaignQuery;

      const campaignPerformance = {
        avgOpenRate: campaigns?.reduce((sum, c) => sum + (c.open_rate || 0), 0) / (campaigns?.length || 1) || 0,
        avgClickRate: campaigns?.reduce((sum, c) => sum + (c.click_rate || 0), 0) / (campaigns?.length || 1) || 0,
        avgEngagementScore: campaigns?.reduce((sum, c) => sum + (c.engagement_score || 0), 0) / (campaigns?.length || 1) || 0,
        topPerformingSegment: campaigns?.[0]?.top_performing_segment || 'Unknown',
        topPerformingChannel: 'email',
        trendDirection: this.calculateTrend(campaigns?.map(c => c.engagement_score || 0) || []),
      };

      // Market Position
      const { data: marketData } = await supabase
        .from('market_intelligence_analytics')
        .select('*')
        .eq('brand_id', brandId)
        .order('reporting_month', { ascending: false })
        .limit(1)
        .single();

      const marketPosition = {
        currentMarketShare: marketData?.market_share_percent || 0,
        rxGrowthRate: marketData?.rx_growth_rate || 0,
        marketTrend: marketData?.trend_direction || 'stable',
        competitivePosition: marketData?.market_rank === 1 ? 'Leader' : marketData?.market_rank <= 3 ? 'Challenger' : 'Follower',
        shareChange: marketData?.share_change || 0,
      };

      // Audience Insights
      const { data: hcpData } = await supabase
        .from('hcp_engagement_analytics')
        .select('*')
        .eq('brand_id', brandId)
        .gte('reporting_week', startDate);

      const uniqueHCPs = new Set(hcpData?.map(h => h.hcp_id) || []).size;
      const avgEngagement = hcpData?.reduce((sum, h) => sum + (h.content_depth_score || 0), 0) / (hcpData?.length || 1) || 0;

      // Get preferred content types
      /** @type {Object.<string, number>} */
      const contentTypeCount = {};
      hcpData?.forEach(h => {
        if (h.preferred_content_type) {
          contentTypeCount[h.preferred_content_type] = (contentTypeCount[h.preferred_content_type] || 0) + 1;
        }
      });
      const preferredContentType = Object.entries(contentTypeCount).sort((a, b) => b[1] - a[1])[0]?.[0] || 'clinical_data';

      const audienceInsights = {
        totalActiveHCPs: uniqueHCPs,
        avgEngagement,
        preferredContentType,
        preferredChannel: 'email',
        highValueSegments: ['Specialists', 'Academic Centers'],
      };

      // Social Intelligence
      const { data: socialData } = await supabase
        .from('social_intelligence_analytics')
        .select('*')
        .eq('brand_id', brandId)
        .order('reporting_date', { ascending: false })
        .limit(1)
        .single();

      const socialIntelligence = {
        sentimentScore: socialData?.overall_sentiment_score || 0,
        shareOfVoice: socialData?.share_of_voice_percent || 0,
        trendingTopics: (socialData?.top_topics)?.slice(0, 5).map((t) => t.topic) || [],
        sentimentTrend: socialData?.sentiment_trend || 'stable',
      };

      return {
        campaignPerformance,
        marketPosition,
        audienceInsights,
        socialIntelligence,
      };
    } catch (error) {
      console.error('Error fetching marketing intelligence:', error);
      throw error;
    }
  }

  /**
   * Get top performing content elements for theme generation
   * @param {string} brandId
   * @param {DataFilters} [filters]
   * @returns {Promise<Object.<string, Array<any>>>}
   */
  static async getTopPerformingElements(brandId, filters) {
    try {
      const elementTypes = ['tone', 'complexity', 'cta_type', 'subject_line'];
      /** @type {Object.<string, Array<any>>} */
      const topElements = {};

      for (const type of elementTypes) {
        let query = supabase
          .from('content_element_performance')
          .select('*')
          .eq('brand_id', brandId)
          .eq('element_type', type)
          .gte('usage_count', 3)
          .order('avg_performance_score', { ascending: false })
          .limit(5);

        // Note: content_element_performance table doesn't have filter columns
        // Filters are applied at higher aggregation level

        const { data } = await query;
        topElements[type] = data || [];
      }

      return topElements;
    } catch (error) {
      console.error('Error getting top performing elements:', error);
      return {};
    }
  }

  /**
   * Get content performance trends
   * @param {string} brandId
   * @param {number} [days=90]
   * @param {DataFilters} [filters]
   * @returns {Promise<Array<Object>>}
   */
  static async getContentTrends(brandId, days = 90, filters) {
    try {
      // Calculate date range
      let daysToUse = days;
      if (filters?.timeRange) {
        if (filters.timeRange === 'Last 3 Months') daysToUse = 90;
        else if (filters.timeRange === 'Last 6 Months') daysToUse = 180;
        else if (filters.timeRange === 'Last 12 Months') daysToUse = 365;
      }
      const startDate = new Date(Date.now() - daysToUse * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      let query = supabase
        .from('content_performance_attribution')
        .select('measurement_date, engagement_rate, conversion_rate')
        .eq('brand_id', brandId)
        .gte('measurement_date', startDate)
        .order('measurement_date', { ascending: true });

      // Note: content_performance_attribution table doesn't have all filter columns
      // Filters are applied at higher aggregation level

      const { data } = await query;

      if (!data) return [];

      // Manually group by measurement_date
      /** @type {Object.<string, { engagements: number[], conversions: number[] }>} */
      const dateGroups = {};
      data.forEach(item => {
        if (!dateGroups[item.measurement_date]) {
          dateGroups[item.measurement_date] = { engagements: [], conversions: [] };
        }
        if (item.engagement_rate !== null) dateGroups[item.measurement_date].engagements.push(item.engagement_rate);
        if (item.conversion_rate !== null) dateGroups[item.measurement_date].conversions.push(item.conversion_rate);
      });

      // Calculate averages
      const trends = Object.entries(dateGroups).map(([date, values]) => ({
        measurement_date: date,
        avg_engagement: values.engagements.length > 0
          ? values.engagements.reduce((sum, v) => sum + v, 0) / values.engagements.length
          : 0,
        avg_conversion: values.conversions.length > 0
          ? values.conversions.reduce((sum, v) => sum + v, 0) / values.conversions.length
          : 0,
      }));

      return trends.sort((a, b) => a.measurement_date.localeCompare(b.measurement_date));
    } catch (error) {
      console.error('Error getting content trends:', error);
      return [];
    }
  }

  /**
   * Calculate trend direction from time series data
   * @private
   * @param {number[]} values
   * @returns {'improving' | 'stable' | 'declining'}
   */
  static calculateTrend(values) {
    if (values.length < 3) return 'stable';

    const recentAvg = values.slice(0, Math.floor(values.length / 3)).reduce((a, b) => a + b, 0) / Math.floor(values.length / 3);
    const olderAvg = values.slice(-Math.floor(values.length / 3)).reduce((a, b) => a + b, 0) / Math.floor(values.length / 3);

    const change = ((recentAvg - olderAvg) / olderAvg) * 100;

    if (change > 5) return 'improving';
    if (change < -5) return 'declining';
    return 'stable';
  }

  /**
   * Get data quality score for a brand
   * @param {string} brandId
   * @returns {Promise<number>}
   */
  static async getDataQualityScore(brandId) {
    try {
      // Supabase count queries return an object, we destructure `count` from it.
      const { count: campaignCount } = await supabase
        .from('sfmc_campaign_raw')
        .select('*', { count: 'exact', head: true })
        .eq('brand_id', brandId);

      const { count: contentCount } = await supabase
        .from('content_registry')
        .select('*', { count: 'exact', head: true })
        .eq('brand_id', brandId);

      const { count: performanceCount } = await supabase
        .from('content_performance_attribution')
        .select('*', { count: 'exact', head: true })
        .eq('brand_id', brandId);

      // Simple scoring based on data availability
      let score = 0;
      if ((campaignCount || 0) > 10) score += 25;
      if ((contentCount || 0) > 5) score += 25;
      if ((performanceCount || 0) > 20) score += 25;
      if ((campaignCount || 0) > 0 && (contentCount || 0) > 0) score += 25;

      return score;
    } catch (error) {
      console.error('Error calculating data quality score:', error);
      return 0;
    }
  }
}