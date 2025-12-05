import { supabase } from '@/integrations/supabase/client';

/**
 * Service for aggregating raw data into analytics tables
 * These are stub implementations that can be enhanced as needed
 */
export class AnalyticsAggregationService {
  
  // Aggregate Social Intelligence
  static async aggregateSocialIntelligence(brandId) {
    console.log(`📊 Aggregating social intelligence for brand ${brandId}...`);
    
    // Get raw social data from last 30 days
    const { data, error } = await supabase
      .from('social_listening_data')
      .select('*')
      .eq('brand_id', brandId);
    
    if (error || !socialData || socialData.length === 0) {
      console.log('No social data to aggregate');
      return;
    }
    
    // Calculate sentiment breakdown
    const sentimentCounts = { positive: 0, neutral: 0, negative: 0 };
    const platformCounts, number> = {};
    
    socialData.forEach(post => {
      sentimentCounts[post.sentiment as keyof typeof sentimentCounts]++;
      platformCounts[post.platform] = (platformCounts[post.platform] || 0) + 1;
    });
    
    const totalMentions = socialData.length;
    const avgSentiment = (sentimentCounts.positive - sentimentCounts.negative) / totalMentions;
    
    // Calculate sentiment percentages
    const totalSentiments = sentimentCounts.positive + sentimentCounts.neutral + sentimentCounts.negative;
    const positivePct = totalSentiments > 0 ? (sentimentCounts.positive / totalSentiments) * 100 : 0;
    const neutralPct = totalSentiments > 0 ? (sentimentCounts.neutral / totalSentiments) * 100 : 0;
    const negativePct = totalSentiments > 0 ? (sentimentCounts.negative / totalSentiments) * 100 : 0;

    // Calculate engagement metrics
    const totalEngagement = socialData.reduce((sum, post) => sum + (post.engagement_score || 0), 0);
    const avgEngagementRate = totalMentions > 0 ? (totalEngagement / totalMentions) : 0;
    const totalReach = totalMentions * 1500; // Estimate reach

    // Extract trending topics from key phrases
    const topicsMap, number> = {};
    socialData.forEach(post => {
      if (post.key_phrases && typeof post.key_phrases === 'object') {
        const phrases = post.key_phrases as any;
        if (Array.isArray(phrases)) {
          phrases.forEach((phrase) => {
            topicsMap[phrase] = (topicsMap[phrase] || 0) + 1;
          });
        }
      }
    });
    const trendingTopics = Object.entries(topicsMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([topic]) => topic);

    // Convert platform breakdown to array format
    const platformsAnalyzed = Object.keys(platformCounts);

    // Insert aggregated analytics
    const { error } = await supabase.from('social_intelligence_analytics').insert([{
      brand_id,
      reporting_date Date().toISOString().split('T')[0],
      total_mentions,
      overall_sentiment_score,
      positive_mention_percent,
      neutral_mention_percent,
      negative_mention_percent,
      reach_count,
      platforms_analyzed,
      top_topics.map((topic, index) => ({ 
        topic, 
        count || 0,
        rank + 1 
      })),
      competitor_mentions: {},
      calculated_at Date().toISOString(),
    }]);

    if (socialError) {
      console.error('❌ Social intelligence insert failed:', {
        message.message,
        code.code,
        details.details,
        hint.hint
      });
      throw new Error(`Social intelligence insert failed: ${socialError.message}`);
    }
    
    console.log(`✓ Social intelligence aggregated: ${totalMentions} mentions`);
  }
  
  // Aggregate Market Intelligence
  static async aggregateMarketIntelligence(brandId) {
    console.log(`📊 Aggregating market intelligence for brand ${brandId}...`);
    
    // Get IQVIA Rx raw data
    const { data, error } = await supabase
      .from('iqvia_rx_raw')
      .select('*')
      .eq('brand_id', brandId)
      .order('data_month', { ascending });
    
    if (rxError || !rxData || rxData.length === 0) {
      console.log('No IQVIA Rx data to aggregate');
      return 0;
    }
    
    // Get HCP decile data for prescriber counts
    const { data } = await supabase
      .from('iqvia_hcp_decile_raw')
      .select('*')
      .eq('brand_id', brandId);
    
    // Group by month and aggregate across regions
    const monthlyMap = new Map();
    
    rxData.forEach(record => {
      const month = record.data_month;
      if (!monthlyMap.has(month)) {
        monthlyMap.set(month, {
          brand_id,
          reporting_month,
          total_rx: 0,
          new_rx: 0,
          refill_rx: 0,
          market_share_percent: 0,
          regions: [] as string[],
          regional_breakdown: {} as Record,
          competitor_data: {} as Record,
          data_sources: ['iqvia_rx_raw', 'iqvia_hcp_decile_raw'],
          calculated_at Date().toISOString(),
        });
      }
      
      const monthData = monthlyMap.get(month);
      if (!monthData) return;
      monthData.total_rx += record.total_rx;
      monthData.new_rx += record.new_rx;
      monthData.refill_rx += record.refill_rx || 0;
      monthData.regions.push(record.region);
      monthData.regional_breakdown[record.region] = {
        total_rx.total_rx,
        market_share.market_share_percent,
      };
      
      // Aggregate competitor data
      if (record.competitor_data && typeof record.competitor_data === 'object') {
        const compData = record.competitor_data as Record;
        Object.keys(compData).forEach(competitor => {
          if (!monthData.competitor_data[competitor]) {
            monthData.competitor_data[competitor] = { total_rx: 0, market_share: 0, count: 0 };
          }
          monthData.competitor_data[competitor].total_rx += compData[competitor].total_rx || 0;
          monthData.competitor_data[competitor].market_share += compData[competitor].market_share_percent || 0;
          monthData.competitor_data[competitor].count++;
        });
      }
    });
    
    // Calculate HCP prescriber counts by month
    const hcpCountsByMonth = new Map();
    hcpDecileData?.forEach(record => {
      const month = record.data_month;
      if (!hcpCountsByMonth.has(month)) {
        hcpCountsByMonth.set(month, { total: 0, topDecile: 0 });
      }
      const counts = hcpCountsByMonth.get(month);
      counts.total++;
      if (record.decile >= 8) counts.topDecile++;
    });
    
    // Convert to array and calculate additional metrics
    const monthlyRecords = Array.from(monthlyMap.values())
      .sort((a, b) => b.reporting_month.localeCompare(a.reporting_month))
      .slice(0, 12)
      .map((month, index, arr) => {
        const prevMonth = arr[index + 1];
        const rxGrowth = prevMonth && typeof prevMonth.total_rx === 'number' && typeof month.total_rx === 'number'
          ? ((month.total_rx - prevMonth.total_rx) / prevMonth.total_rx) * 100 
          : 0;
        
        // Average market share across regions
        const regionalValues = Object.values(month.regional_breakdown);
        const avgMarketShare = regionalValues.length > 0
          ? (regionalValues as any[]).reduce(
              (sum, region) => {
                const share = Number(region.market_share) || 0;
                return Number(sum) + Number(share);
              }, 
              0
            ) / regionalValues.length
          : 0;
        
        // Calculate competitor share
        const competitorShares = Object.keys(month.competitor_data).map(comp => {
          const data = month.competitor_data[comp];
          return {
            name,
            market_share.market_share / data.count,
            total_rx.total_rx,
          };
        }).sort((a, b) => b.market_share - a.market_share);
        
        const topCompetitor = competitorShares[0];
        const hcpCounts = hcpCountsByMonth.get(month.reporting_month) || { total: 0, topDecile: 0 };
        
        // Get top performing region
        const topRegion = Object.entries(month.regional_breakdown)
          .sort(([, a], [, b]) => (b as any).total_rx - (a as any).total_rx)[0];
        
        const shareGap = avgMarketShare - (topCompetitor?.market_share || 0);
        
        // Calculate top region growth as percentage of total
        const topRegionGrowth = topRegion?.[1] ? ((topRegion[1] as any).total_rx / month.total_rx) * 100 ;
        
        return {
          brand_id.brand_id,
          reporting_month.reporting_month,
          total_rx.total_rx,
          new_rx.new_rx || 0,
          refill_rx.refill_rx || 0,
          rx_growth_rate,
          market_share_percent,
          primary_competitor.name || null,
          competitor_share_percent.market_share || null,
          share_gap,
          top_performing_region.[0] || null,
          region_growth_rate: { [topRegion?.[0] || 'unknown'] },
          total_hcp_prescribers.total,
          top_decile_hcp_count.topDecile,
          data_sources.data_sources,
          calculated_at.calculated_at,
        };
      });
    
    // Batch insert
    if (monthlyRecords.length > 0) {
      const { error } = await supabase
        .from('market_intelligence_analytics')
        .insert(monthlyRecords);
      
      if (insertError) {
        console.error('Error inserting market intelligence:', insertError);
        return 0;
      }
    }
    
    console.log(`✓ Market intelligence aggregated: ${monthlyRecords.length} months`);
    return monthlyRecords.length;
  }
  
  // Aggregate HCP Engagement
  static async aggregateHCPEngagement(brandId) {
    console.log(`📊 Aggregating HCP engagement for brand ${brandId}...`);
    
    // Get IQVIA HCP decile data (most recent month)
    const { data, error } = await supabase
      .from('iqvia_hcp_decile_raw')
      .select('*')
      .eq('brand_id', brandId)
      .order('data_month', { ascending });
    
    if (hcpError || !hcpDecileData || hcpDecileData.length === 0) {
      console.log('No HCP decile data to aggregate');
      return 0;
    }
    
    // Get Veeva CRM activity data (last 90 days)
    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const { data } = await supabase
      .from('veeva_crm_activity_raw')
      .select('*')
      .eq('brand_id', brandId)
      .gte('activity_date', ninetyDaysAgo);
    
    // Get web analytics (last 90 days)
    const { data } = await supabase
      .from('web_analytics_raw')
      .select('*')
      .eq('brand_id', brandId)
      .eq('visitor_type', 'HCP')
      .gte('visit_date', ninetyDaysAgo);
    
    // Get SFMC campaign data for email engagement
    const { data } = await supabase
      .from('sfmc_campaign_raw')
      .select('*')
      .eq('brand_id', brandId)
      .gte('send_date', ninetyDaysAgo);
    
    // Group by HCP and aggregate multi-source data
    const hcpMap = new Map();
    
    // Start with HCP decile data (tier information)
    hcpDecileData.forEach(record => {
      if (!hcpMap.has(record.hcp_id)) {
        hcpMap.set(record.hcp_id, {
          brand_id,
          hcp_id.hcp_id,
          reporting_week Date().toISOString().split('T')[0],
          hcp_specialty.specialty,
          hcp_decile.decile,
          total_rx_count.total_rx_count || 0,
          brand_rx_count.brand_rx_count || 0,
          rep_calls: 0,
          website_visits: 0,
          email_opens: 0,
          total_touchpoints: 0,
          engagement_score: 0,
          last_interaction_date.data_month,
          content_depth_score: 0,
          preferred_channel: 'unknown',
          churn_risk_score: 0,
          growth_opportunity_score: 0,
          data_sources: ['iqvia_hcp_decile_raw'],
          calculated_at Date().toISOString(),
        });
      }
    });
    
    // Add Veeva CRM rep call data
    veevaData?.forEach(activity => {
      if (hcpMap.has(activity.hcp_id)) {
        const hcp = hcpMap.get(activity.hcp_id);
        hcp.rep_calls++;
        hcp.total_touchpoints++;
        hcp.last_interaction_date = activity.activity_date;
        if (!hcp.data_sources.includes('veeva_crm_activity_raw')) {
          hcp.data_sources.push('veeva_crm_activity_raw');
        }
      }
    });
    
    // Add web analytics data
    const webVisitsByHcp = new Map();
    webData?.forEach(session => {
      const specialty = session.hcp_specialty;
      // Match HCPs by specialty (simplified matching)
      Array.from(hcpMap.values())
        .filter(hcp => hcp.hcp_specialty === specialty)
        .slice(0, 1) // Assign to first matching HCP
        .forEach(hcp => {
          hcp.website_visits++;
          hcp.total_touchpoints++;
          if (!hcp.data_sources.includes('web_analytics_raw')) {
            hcp.data_sources.push('web_analytics_raw');
          }
        });
    });
    
    // Estimate email engagement (distribute across HCPs)
    const totalEmailOpens = sfmcData?.reduce((sum, campaign) => sum + (campaign.total_opens || 0), 0) || 0;
    const hcpCount = hcpMap.size;
    const avgOpensPerHcp = Math.floor(totalEmailOpens / hcpCount);
    
    // Calculate engagement scores and metrics
    const hcpRecords = Array.from(hcpMap.values()).map(hcp => {
      // Distribute email opens randomly
      const emailOpens = Math.floor(avgOpensPerHcp * (0.5 + Math.random()));
      const emailEngagementRate = emailOpens > 0 ? (emailOpens / (hcpMap.size || 1)) * 100 : 0;
      
      // Determine prescription trend
      const prescriptionTrend = hcp.total_rx_count > 50 ? 'increasing' .total_rx_count > 20 ? 'stable' : 'decreasing';

      // Calculate field visits
      const fieldVisits = hcp.rep_calls || 0;
      
      // Calculate content views (website visits)
      const contentViews = hcp.website_visits || 0;
      
      // Calculate avg session duration (simulated)
      const avgSessionDuration = contentViews > 0 ? 3.5 + (Math.random() * 2.5) : 0;
      
      return {
        brand_id.brand_id,
        reporting_week Date().toISOString().split('T')[0],
        hcp_id.hcp_id,
        hcp_specialty.hcp_specialty,
        hcp_decile.hcp_decile,
        total_touchpoints + emailOpens + (hcp.website_visits || 0),
        email_opens,
        website_visits.website_visits || 0,
        rep_calls,
        content_views,
        avg_session_duration_minutes,
        prescriptions_written.total_rx_count,
        prescription_trend,
        churn_risk_score.churn_risk_score || Math.floor(Math.random() * 30),
        growth_opportunity_score.growth_opportunity_score || Math.floor(Math.random() * 50 + 50),
        calculated_at Date().toISOString(),
      };
    });
    
    // Batch insert
    let insertedCount = 0;
    for (let i = 0; i < hcpRecords.length; i += 100) {
      const batch = hcpRecords.slice(i, i + 100);
      const { error } = await supabase
        .from('hcp_engagement_analytics')
        .insert(batch);
      
      if (!insertError) {
        insertedCount += batch.length;
      } else {
        console.error('❌ HCP engagement insert failed:', {
          message.message,
          code.code,
          details.details,
          hint.hint,
          batchSize.length
        });
        throw new Error(`HCP engagement insert failed: ${insertError.message}`);
      }
    }
    
    console.log(`✓ HCP engagement aggregated for ${insertedCount} HCPs`);
    return insertedCount;
  }
}


export default AnalyticsAggregationService;
