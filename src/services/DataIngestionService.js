import { supabase } from './integrations/supabase/client';

/**
 * @typedef {Object} SFMCRecord
 * @property {string} brand_id
 * @property {string} campaign_id
 * @property {string} campaign_name
 * @property {number} sent_count
 * @property {number} open_rate
 * @property {number} click_rate
 * @property {number} conversion_rate
 * @property {string} subject_line
 * @property {string[]} message_themes
 * @property {string} audience_segment
 * @property {string} send_date
 */

/**
 * @typedef {Object} VeevaInsight
 * @property {string} brand_id
 * @property {string} hcp_feedback_theme
 * @property {'positive' | 'neutral' | 'negative'} sentiment
 * @property {number} frequency_score
 * @property {Record<string, any>} regional_data
 * @property {string[]} objections
 * @property {Array<{ competitor: string, context: string }>} competitive_mentions
 * @property {string} recorded_date
 */

/**
 * @typedef {Object} IQVIARecord
 * @property {string} brand_id
 * @property {string} metric_type
 * @property {number} value
 * @property {string} comparison_period
 * @property {string} therapeutic_area
 * @property {string} geographic_region
 * @property {string} data_date
 */

/**
 * @typedef {Object} SocialPost
 * @property {string} brand_id
 * @property {string} platform
 * @property {'positive' | 'neutral' | 'negative'} sentiment
 * @property {string} topic
 * @property {number} mention_volume
 * @property {string[]} key_phrases
 * @property {Array<{ handle: string, reach: number }>} influencer_mentions
 * @property {string} date_captured
 */

/**
 * @typedef {Object} CompetitiveIntel
 * @property {string} brand_id
 * @property {string} competitor_brand
 * @property {string} intelligence_type
 * @property {string} insight_summary
 * @property {string} data_source
 * @property {number} confidence_score
 * @property {string} date_captured
 */

export class DataIngestionService {
  /**
   * Normalize SFMC campaign data into consistent format
   * @param {Array<Object>} rawData
   * @returns {SFMCRecord[]}
   */
  static normalizeSFMCData(rawData) {
    return rawData.map(campaign => ({
      brand_id: campaign.brand_id || campaign.brandId,
      campaign_id: campaign.campaign_id || campaign.id,
      campaign_name: campaign.name || campaign.campaign_name,
      sent_count: parseInt(campaign.sent || campaign.sent_count || '0'),
      open_rate: parseFloat(campaign.open_rate || campaign.opens || '0'),
      click_rate: parseFloat(campaign.click_rate || campaign.clicks || '0'),
      conversion_rate: parseFloat(campaign.conversion_rate || campaign.conversions || '0'),
      subject_line: campaign.subject || campaign.subject_line || '',
      message_themes: this.extractCampaignThemes(campaign.content || campaign.body || ''),
      audience_segment: campaign.segment || campaign.audience_segment || 'general',
      send_date: campaign.send_date || campaign.sent_at || new Date().toISOString()
    }));
  }

  /**
   * Extract themes from campaign content using keyword analysis
   * @param {string} content
   * @returns {string[]}
   */
  static extractCampaignThemes(content) {
    const themes = [];
    const lowerContent = content.toLowerCase();

    // Therapeutic themes
    const therapeuticKeywords = {
      'efficacy': ['efficacy', 'effective', 'results', 'outcomes'],
      'safety': ['safety', 'adverse', 'side effects', 'tolerability'],
      'convenience': ['convenient', 'easy', 'simple', 'once-daily'],
      'innovation': ['innovative', 'breakthrough', 'advanced', 'new'],
      'patient_support': ['support', 'assistance', 'resources', 'help']
    };

    for (const [theme, keywords] of Object.entries(therapeuticKeywords)) {
      if (keywords.some(keyword => lowerContent.includes(keyword))) {
        themes.push(theme);
      }
    }

    return themes.length > 0 ? themes : ['general'];
  }

  /**
   * Normalize Veeva field insights
   * @param {Array<Object>} rawData
   * @returns {VeevaInsight[]}
   */
  static normalizeVeevaData(rawData) {
    return rawData.map(insight => ({
      brand_id: insight.brand_id || insight.brandId,
      hcp_feedback_theme: insight.theme || insight.feedback_theme || 'general',
      sentiment: this.normalizeSentiment(insight.sentiment),
      frequency_score: parseInt(insight.frequency || insight.count || '1'),
      regional_data: insight.regional_data || {},
      objections: Array.isArray(insight.objections) ? insight.objections : [],
      competitive_mentions: Array.isArray(insight.competitive_mentions)
        ? insight.competitive_mentions
        : [],
      recorded_date: insight.recorded_date || insight.date || new Date().toISOString()
    }));
  }

  /**
   * Normalize IQVIA market data
   * @param {Array<Object>} rawData
   * @returns {IQVIARecord[]}
   */
  static normalizeIQVIAData(rawData) {
    return rawData.map(record => ({
      brand_id: record.brand_id || record.brandId,
      metric_type: record.metric_type || record.metric || 'market_share',
      value: parseFloat(record.value || '0'),
      comparison_period: record.period || record.comparison_period || 'monthly',
      therapeutic_area: record.therapeutic_area || record.ta || '',
      geographic_region: record.region || record.geographic_region || 'national',
      data_date: record.data_date || record.date || new Date().toISOString()
    }));
  }

  /**
   * Normalize social listening data
   * @param {Array<Object>} rawData
   * @returns {SocialPost[]}
   */
  static normalizeSocialData(rawData) {
    return rawData.map(post => ({
      brand_id: post.brand_id || post.brandId,
      platform: post.platform || 'general',
      sentiment: this.normalizeSentiment(post.sentiment),
      topic: post.topic || post.theme || 'general',
      mention_volume: parseInt(post.volume || post.count || '1'),
      key_phrases: Array.isArray(post.key_phrases) ? post.key_phrases : [],
      influencer_mentions: Array.isArray(post.influencers) ? post.influencers : [],
      date_captured: post.date || post.captured_at || new Date().toISOString()
    }));
  }

  /**
   * Normalize sentiment to standard values
   * @param {*} sentiment
   * @returns {'positive' | 'neutral' | 'negative'}
   */
  static normalizeSentiment(sentiment) {
    const sentimentStr = String(sentiment).toLowerCase();
    if (sentimentStr.includes('pos')) return 'positive';
    if (sentimentStr.includes('neg')) return 'negative';
    return 'neutral';
  }

  /**
   * Aggregate field insights by theme
   * @param {VeevaInsight[]} insights
   * @returns {Record<string, Object>}
   */
  static aggregateFieldFeedback(insights) {
    const themeMap = {};

    insights.forEach(insight => {
      if (!themeMap[insight.hcp_feedback_theme]) {
        themeMap[insight.hcp_feedback_theme] = {
          count: 0,
          sentiment: { positive: 0, neutral: 0, negative: 0 },
          objections: [],
          competitors: new Set()
        };
      }

      const theme = themeMap[insight.hcp_feedback_theme];
      theme.count += insight.frequency_score;
      theme.sentiment[insight.sentiment] = (theme.sentiment[insight.sentiment] || 0) + 1;
      theme.objections.push(...insight.objections);

      insight.competitive_mentions.forEach(mention => {
        theme.competitors.add(mention.competitor);
      });
    });

    // Convert to serializable format
    const result = {};
    for (const [theme, data] of Object.entries(themeMap)) {
      result[theme] = {
        ...data,
        competitors: Array.from(data.competitors)
      };
    }

    return result;
  }

  /**
   * Calculate sentiment scores from social data
   * @param {SocialPost[]} socialPosts
   * @returns {{ overallScore: number, breakdown: Record<string, number>, trending: string[] }}
   */
  static analyzeSentiment(socialPosts) {
    const sentimentCounts = { positive: 0, neutral: 0, negative: 0 };
    const topicVolume = {};

    socialPosts.forEach(post => {
      sentimentCounts[post.sentiment] += post.mention_volume;
      topicVolume[post.topic] = (topicVolume[post.topic] || 0) + post.mention_volume;
    });

    const total = sentimentCounts.positive + sentimentCounts.neutral + sentimentCounts.negative;
    const overallScore = total > 0
      ? (sentimentCounts.positive - sentimentCounts.negative) / total
      : 0;

    const trending = Object.entries(topicVolume)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([topic]) => topic);

    return {
      overallScore,
      breakdown: {
        positive: total > 0 ? sentimentCounts.positive / total : 0,
        neutral: total > 0 ? sentimentCounts.neutral / total : 0,
        negative: total > 0 ? sentimentCounts.negative / total : 0
      },
      trending
    };
  }

  /**
   * Store normalized data in database
   * @param {SFMCRecord[]} records
   * @returns {Promise<void>}
   */
  static async storeSFMCData(records) {
    const { error } = await supabase
      .from('sfmc_campaign_data')
      .upsert(records, { onConflict: 'campaign_id' });

    if (error) throw error;
  }

  /**
   * @param {VeevaInsight[]} records
   * @returns {Promise<void>}
   */
  static async storeVeevaData(records) {
    const { error } = await supabase
      .from('veeva_field_insights')
      .insert(records);

    if (error) throw error;
  }

  /**
   * @param {IQVIARecord[]} records
   * @returns {Promise<void>}
   */
  static async storeIQVIAData(records) {
    const { error } = await supabase
      .from('iqvia_market_data')
      .insert(records);

    if (error) throw error;
  }

  /**
   * @param {SocialPost[]} records
   * @returns {Promise<void>}
   */
  static async storeSocialData(records) {
    const { error } = await supabase
      .from('social_listening_data')
      .insert(records);

    if (error) throw error;
  }

  /**
   * @param {CompetitiveIntel[]} records
   * @returns {Promise<void>}
   */
  static async storeCompetitiveData(records) {
    const { error } = await supabase
      .from('competitive_intelligence_data')
      .insert(records);

    if (error) throw error;
  }
}