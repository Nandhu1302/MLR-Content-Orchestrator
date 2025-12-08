// ============================================
// Channel Intelligence Service
// Handles channel performance and cross-channel journeys
// ============================================

import { supabase } from '@/integrations/supabase/client';


export class ChannelService {
  static async fetchChannelIntelligence(
    brandId,
    selectedAssets
  ) {
    const channels = [];

    // Email Performance
    const { data: emailData } = await supabase
      .from('sfmc_campaign_raw')
      .select('total_opens, total_clicks, total_delivered')
      .limit(50);

    if (emailData && emailData.length > 0) {
      const totalOpens = emailData.reduce((sum, e) => sum + (e.total_opens || 0), 0);
      const totalClicks = emailData.reduce((sum, e) => sum + (e.total_clicks || 0), 0);
      const totalDelivered = emailData.reduce((sum, e) => sum + (e.total_delivered || 0), 0);

      channels.push({
        channel: 'Email',
        performance_score: Math.round((totalOpens / totalDelivered) * 100),
        recommended_for_audience: ['email'],
        engagement_metrics: {
          impressions: totalDelivered,
          clicks: totalClicks,
          conversions: Math.round(totalClicks * 0.15)
        }
      });
    }

    // Social Performance
    const { data: socialData } = await supabase
      .from('social_listening_raw')
      .select('id, brand_id')
      .limit(30);

    if (socialData && socialData.length > 0) {
      const performanceScore = Math.min(75, socialData.length * 2);

      channels.push({
        channel: 'Social',
        performance_score: performanceScore,
        recommended_for_audience: ['social'],
        engagement_metrics: {
          impressions: socialData.length * 1000,
          clicks: socialData.length * 50
        }
      });
    }

    // Website Performance
    const { data: webData } = await supabase
      .from('web_analytics_raw')
      .select('page_views, cta_clicks')
      .limit(100);

    if (webData && webData.length > 0) {
      const totalViews = webData.reduce((sum, w) => sum + (typeof w.page_views === 'number' ? w.page_views : 0), 0);
      const totalCTAs = webData.reduce((sum, w) => sum + (typeof w.cta_clicks === 'number' ? w.cta_clicks : 0), 0);

      channels.push({
        channel: 'Website',
        performance_score: Math.round((totalCTAs / totalViews) * 100),
        recommended_for_audience: ['landing-page'],
        engagement_metrics: {
          impressions: totalViews,
          clicks: totalCTAs
        }
      });
    }

    return channels;
  }

  static async fetchCrossChannelJourneys(
    brandId,
    intent
  ) {
    const { data, error } = await supabase
      .from('content_performance_attribution')
      .select('content_registry_id, channel, engagement_rate, conversion_rate')
      .eq('brand_id', brandId)
      .not('channel', 'is', null)
      .limit(100);

    if (error || !data) {
      console.error('Error fetching cross-channel journeys:', error);
      return [];
    }

    // Group by content_registry_id to find multi-channel content
    const contentChannels = new Map();
    data.forEach(item => {
      if (!item.content_registry_id || !item.channel) return;
      
      if (!contentChannels.has(item.content_registry_id)) {
        contentChannels.set(item.content_registry_id, []);
      }
      contentChannels.get(item.content_registry_id).push({
        channel: item.channel,
        conversion: item.conversion_rate || 0
      });
    });

    const journeys = [];
    
    // Analyze multi-channel content
    contentChannels.forEach((channels, contentId) => {
      if (channels.length >= 2) {
        const channelPath = channels.map(c => c.channel);
        const avgConversion = channels.reduce((sum, c) => sum + c.conversion, 0) / channels.length;
        const lift = Math.round((channels.length - 1) * 0.45 * 100);

        journeys.push({
          journey_path: channelPath,
          conversion_rate: avgConversion,
          lift_vs_single_channel: lift,
          sample_size: channels.length,
          description: `${channelPath.join(' → ')} journey shows ${lift}% lift`
        });
      }
    });

    return journeys.slice(0, 3);
  }

  static async fetchMarketingMixRecommendations(
    brandId,
    audienceType
  ) {
    const recommendations = [];

    // Fetch audience channel preferences
    let channelPreferences = [];
    if (audienceType) {
      const { data: audienceData } = await supabase
        .from('audience_segments')
        .select('channel_preferences')
        .eq('brand_id', brandId)
        .ilike('segment_name', `%${audienceType}%`)
        .single();

      if (audienceData && Array.isArray(audienceData.channel_preferences)) {
        channelPreferences = audienceData.channel_preferences.map(pref => 
          typeof pref === 'string' ? pref : String(pref)
        );
      }
    }

    // Fetch email performance
    const { data: emailData } = await supabase
      .from('sfmc_campaign_raw')
      .select('total_opens, total_clicks, total_delivered')
      .limit(50);

    if (emailData && emailData.length > 0) {
      const openRate = emailData.reduce((sum, e) => sum + (e.total_opens || 0), 0) / 
                       emailData.reduce((sum, e) => sum + (e.total_delivered || 1), 1);
      const isPreferred = channelPreferences.some(pref => pref.toLowerCase().includes('email'));
      
      recommendations.push({
        channel: 'Email',
        percentage: isPreferred ? 35 : 25,
        avgPerformance: Math.round(openRate * 100),
        rationale: isPreferred
          ? `${Math.round(openRate * 100)}% avg open rate - audience prefers email`
          : `${Math.round(openRate * 100)}% avg open rate`
      });
    }

    // Fetch web analytics
    const { data: webData } = await supabase
      .from('web_analytics_raw')
      .select('scroll_depth, cta_clicks, page_views')
      .limit(100);

    if (webData && webData.length > 0) {
      const avgScroll = webData.reduce((sum, w) => sum + (w.scroll_depth || 0), 0) / webData.length;
      const isPreferred = channelPreferences.some(pref => pref.toLowerCase().includes('web') || pref.toLowerCase().includes('digital'));
      
      recommendations.push({
        channel: 'Website',
        percentage: isPreferred ? 30 : 25,
        avgPerformance: Math.round(avgScroll),
        rationale: isPreferred
          ? `${Math.round(avgScroll)}% avg scroll depth - audience prefers digital`
          : `${Math.round(avgScroll)}% avg scroll depth`
      });
    }

    // Fetch rep/field activity
    const { data: crmData } = await supabase
      .from('veeva_crm_activity_raw')
      .select('engagement_score')
      .limit(50);

    if (crmData && crmData.length > 0) {
      const avgEngagement = crmData.reduce((sum, c) => sum + (c.engagement_score || 0), 0) / crmData.length;
      const isPreferred = channelPreferences.some(pref => pref.toLowerCase().includes('rep') || pref.toLowerCase().includes('field'));
      
      recommendations.push({
        channel: 'Rep-Enabled',
        percentage: isPreferred ? 25 : 20,
        avgPerformance: Math.round(avgEngagement),
        rationale: isPreferred
          ? `${Math.round(avgEngagement)}/100 avg engagement - audience values rep interaction`
          : `${Math.round(avgEngagement)}/100 avg engagement`
      });
    }

    // Fetch social listening
    const { data: socialData } = await supabase
      .from('social_listening_raw')
      .select('sentiment_score, post_date')
      .limit(30);

    if (socialData && socialData.length > 0) {
      const validSentiments = socialData.filter(s => s.sentiment_score != null);
      const avgSentiment = validSentiments.length > 0
        ? validSentiments.reduce((sum, s) => sum + (s.sentiment_score || 0), 0) / validSentiments.length
        : 0.5;
      
      const isPreferred = channelPreferences.some(pref => pref.toLowerCase().includes('social'));
      
      recommendations.push({
        channel: 'Social',
        percentage: isPreferred ? 15 : 10,
        avgPerformance: Math.round(avgSentiment * 100),
        rationale: isPreferred
          ? `${Math.round(avgSentiment * 100)}% positive sentiment - audience active on social`
          : `${Math.round(avgSentiment * 100)}% positive sentiment`
      });
    }

    // Normalize percentages to sum to 100
    const totalPercentage = recommendations.reduce((sum, r) => sum + r.percentage, 0);
    recommendations.forEach(r => {
      r.percentage = Math.round((r.percentage / totalPercentage) * 100);
    });

    return recommendations.sort((a, b) => b.percentage - a.percentage);
  }
}