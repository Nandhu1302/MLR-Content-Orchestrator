import { supabase } from '@/integrations/supabase/client';

/**
 * Service for aggregating raw data into analytics tables
 * These are stub implementations that can be enhanced as needed
 */
export class AnalyticsAggregationService {
  
  // Aggregate Social Intelligence
  static async aggregateSocialIntelligence(brandId) {
    console.log(`📊 Aggregating social intelligence for brand ${brandId}...`);
    
    // Get raw social data from last 30 days (Note: No date filter currently, assuming intent for all data)
    const { data: socialData, error: socialError } = await supabase
      .from('social_listening_data')
      .select('*')
      .eq('brand_id', brandId);
    
    if (socialError || !socialData || socialData.length === 0) {
      console.log('No social data to aggregate');
      if (socialError) {
        console.error('Supabase fetch error:', socialError.message);
      }
      return;
    }
    
    // Calculate sentiment breakdown
    const sentimentCounts = { positive: 0, neutral: 0, negative: 0 };
    const platformCounts = {};
    
    socialData.forEach(post => {
      // Assuming 'sentiment' property matches one of the keys
      if (sentimentCounts.hasOwnProperty(post.sentiment)) {
        sentimentCounts[post.sentiment]++;
      }
      platformCounts[post.platform] = (platformCounts[post.platform] || 0) + 1;
    });
    
    const totalMentions = socialData.length;
    // overall_sentiment_score calculation was missing
    const overallSentimentScore = (sentimentCounts.positive - sentimentCounts.negative) / totalMentions;
    
    // Calculate sentiment percentages
    const totalSentiments = sentimentCounts.positive + sentimentCounts.neutral + sentimentCounts.negative;
    const positiveMentionPercent = totalSentiments > 0 ? (sentimentCounts.positive / totalSentiments) * 100 : 0;
    const neutralMentionPercent = totalSentiments > 0 ? (sentimentCounts.neutral / totalSentiments) * 100 : 0;
    const negativeMentionPercent = totalSentiments > 0 ? (sentimentCounts.negative / totalSentiments) * 100 : 0;

    // Calculate engagement metrics
    const totalEngagement = socialData.reduce((sum, post) => sum + (post.engagement_score || 0), 0);
    // avgEngagementRate was unused in insert, but kept for completeness
    const avgEngagementRate = totalMentions > 0 ? (totalEngagement / totalMentions) : 0;
    const reachCount = totalMentions * 1500; // Estimate reach

    // Extract trending topics from key phrases
    const topicsMap = {};
    socialData.forEach(post => {
      // Assuming 'key_phrases' is an array of strings
      if (post.key_phrases && Array.isArray(post.key_phrases)) {
          post.key_phrases.forEach((phrase) => {
            topicsMap[phrase] = (topicsMap[phrase] || 0) + 1;
          });
      }
    });
    const trendingTopics = Object.entries(topicsMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10);
      
    // Convert platform breakdown to array format
    const platformsAnalyzed = Object.keys(platformCounts);
    
    // Transform trending topics for insert
    const topTopics = trendingTopics.map(([topic, count], index) => ({ 
      topic: topic, 
      count: count || 0,
      rank: index + 1 // rank based on position
    }));

    // Insert aggregated analytics
    const { error: insertError } = await supabase.from('social_intelligence_analytics').insert([{
      brand_id: brandId,
      reporting_date: new Date().toISOString().split('T')[0],
      total_mentions: totalMentions,
      overall_sentiment_score: overallSentimentScore,
      positive_mention_percent: positiveMentionPercent,
      neutral_mention_percent: neutralMentionPercent,
      negative_mention_percent: negativeMentionPercent,
      reach_count: reachCount,
      platforms_analyzed: platformsAnalyzed,
      top_topics: topTopics,
      competitor_mentions: {}, // Assuming this is an empty object if not calculated
      calculated_at: new Date().toISOString(),
    }]);

    if (insertError) {
      console.error('❌ Social intelligence insert failed:', {
        message: insertError.message,
        code: insertError.code,
        details: insertError.details,
        hint: insertError.hint
      });
      throw new Error(`Social intelligence insert failed: ${insertError.message}`);
    }
    
    console.log(`✓ Social intelligence aggregated: ${totalMentions} mentions`);
  }
  
  // Aggregate Market Intelligence
  static async aggregateMarketIntelligence(brandId) {
    console.log(`📊 Aggregating market intelligence for brand ${brandId}...`);
    
    // Get IQVIA Rx raw data
    const { data: rxData, error: rxError } = await supabase
      .from('iqvia_rx_raw')
      .select('*')
      .eq('brand_id', brandId)
      .order('data_month', { ascending: true }); // Corrected ascending shorthand
    
    if (rxError || !rxData || rxData.length === 0) {
      console.log('No IQVIA Rx data to aggregate');
      if (rxError) {
        console.error('Supabase fetch error:', rxError.message);
      }
      return 0;
    }
    
    // Get HCP decile data for prescriber counts
    const { data: hcpDecileData, error: hcpDecileError } = await supabase
      .from('iqvia_hcp_decile_raw')
      .select('*')
      .eq('brand_id', brandId);
    
    if (hcpDecileError) {
      console.error('Supabase fetch error for HCP decile data:', hcpDecileError.message);
    }
      
    // Group by month and aggregate across regions
    const monthlyMap = new Map();
    
    rxData.forEach(record => {
      const month = record.data_month;
      if (!monthlyMap.has(month)) {
        monthlyMap.set(month, {
          brand_id: brandId,
          reporting_month: month, // Assuming data_month is the reporting month
          total_rx: 0,
          new_rx: 0,
          refill_rx: 0,
          market_share_percent: 0, // This will be calculated later as average
          regions: [],
          regional_breakdown: {},
          competitor_data: {},
          data_sources: ['iqvia_rx_raw', 'iqvia_hcp_decile_raw'],
          calculated_at: new Date().toISOString(),
        });
      }
      
      const monthData = monthlyMap.get(month);
      if (!monthData) return;
      monthData.total_rx += record.total_rx;
      monthData.new_rx += record.new_rx;
      monthData.refill_rx += record.refill_rx || 0;
      monthData.regions.push(record.region);
      monthData.regional_breakdown[record.region] = {
        total_rx: record.total_rx,
        market_share: record.market_share_percent,
      };
      
      // Aggregate competitor data
      if (record.competitor_data && typeof record.competitor_data === 'object') {
        const compData = record.competitor_data;
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
      if (counts) {
        counts.total++;
        if (record.decile >= 8) counts.topDecile++;
      }
    });
    
    // Convert to array and calculate additional metrics
    const monthlyRecords = Array.from(monthlyMap.values())
      .sort((a, b) => b.reporting_month.localeCompare(a.reporting_month))
      .slice(0, 12)
      .map((month, index, arr) => {
        // Find previous month (index + 1 in a descending-sorted array)
        const prevMonth = arr[index + 1]; 
        const rxGrowthRate = prevMonth && typeof prevMonth.total_rx === 'number' && typeof month.total_rx === 'number'
          ? ((month.total_rx - prevMonth.total_rx) / prevMonth.total_rx) * 100 
          : 0;
        
        // Average market share across regions
        const regionalValues = Object.values(month.regional_breakdown);
        const avgMarketShare = regionalValues.length > 0
          ? (regionalValues).reduce(
              (sum, region) => {
                const share = Number(region.market_share) || 0;
                return sum + share;
              }, 
              0
            ) / regionalValues.length
          : 0;
        
        // Calculate competitor share
        const competitorShares = Object.keys(month.competitor_data).map(comp => {
          const data = month.competitor_data[comp];
          return {
            name: comp,
            market_share: data.market_share / data.count, // Average market share
            total_rx: data.total_rx,
          };
        }).sort((a, b) => b.market_share - a.market_share);
        
        const topCompetitor = competitorShares[0];
        const hcpCounts = hcpCountsByMonth.get(month.reporting_month) || { total: 0, topDecile: 0 };
        
        // Get top performing region
        const topRegionEntry = Object.entries(month.regional_breakdown)
          .sort(([, a], [, b]) => b.total_rx - a.total_rx)[0];
        
        const shareGap = avgMarketShare - (topCompetitor?.market_share || 0);
        
        // Calculate top region growth as percentage of total
        const topRegionGrowthRate = topRegionEntry?.[1] 
          ? (topRegionEntry[1].total_rx / month.total_rx) * 100
          : 0;
          
        const totalHcpPrescribers = hcpCounts.total;
        const topDecileHcpCount = hcpCounts.topDecile;
        
        return {
          brand_id: month.brand_id,
          reporting_month: month.reporting_month,
          total_rx: month.total_rx,
          new_rx: month.new_rx || 0,
          refill_rx: month.refill_rx || 0,
          rx_growth_rate: rxGrowthRate,
          market_share_percent: avgMarketShare,
          primary_competitor: topCompetitor?.name || null,
          competitor_share_percent: topCompetitor?.market_share || null,
          share_gap: shareGap,
          top_performing_region: topRegionEntry?.[0] || null,
          region_growth_rate: { [topRegionEntry?.[0] || 'unknown']: topRegionGrowthRate }, // Corrected property assignment
          total_hcp_prescribers: totalHcpPrescribers,
          top_decile_hcp_count: topDecileHcpCount,
          data_sources: month.data_sources,
          calculated_at: month.calculated_at,
        };
      });
    
    // Batch insert
    if (monthlyRecords.length > 0) {
      const { error: insertError } = await supabase
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
    const { data: hcpDecileData, error: hcpDecileError } = await supabase
      .from('iqvia_hcp_decile_raw')
      .select('*')
      .eq('brand_id', brandId)
      .order('data_month', { ascending: false }) // Assuming most recent is needed
      .limit(5000); // Limit results for safety
      
    if (hcpDecileError || !hcpDecileData || hcpDecileData.length === 0) {
      console.log('No HCP decile data to aggregate');
      if (hcpDecileError) {
        console.error('Supabase fetch error:', hcpDecileError.message);
      }
      return 0;
    }
    
    // Get Veeva CRM activity data (last 90 days)
    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const { data: veevaData, error: veevaError } = await supabase
      .from('veeva_crm_activity_raw')
      .select('*')
      .eq('brand_id', brandId)
      .gte('activity_date', ninetyDaysAgo);
      
    if (veevaError) console.error('Supabase fetch error for Veeva data:', veevaError.message);
    
    // Get web analytics (last 90 days)
    const { data: webData, error: webError } = await supabase
      .from('web_analytics_raw')
      .select('*')
      .eq('brand_id', brandId)
      .eq('visitor_type', 'HCP')
      .gte('visit_date', ninetyDaysAgo);

    if (webError) console.error('Supabase fetch error for Web data:', webError.message);
    
    // Get SFMC campaign data for email engagement
    const { data: sfmcData, error: sfmcError } = await supabase
      .from('sfmc_campaign_raw')
      .select('*')
      .eq('brand_id', brandId)
      .gte('send_date', ninetyDaysAgo);

    if (sfmcError) console.error('Supabase fetch error for SFMC data:', sfmcError.message);
    
    // Group by HCP and aggregate multi-source data
    const hcpMap = new Map();
    const reportingWeek = new Date().toISOString().split('T')[0];
    
    // Start with HCP decile data (tier information)
    hcpDecileData.forEach(record => {
      if (!hcpMap.has(record.hcp_id)) {
        hcpMap.set(record.hcp_id, {
          brand_id: brandId,
          hcp_id: record.hcp_id,
          reporting_week: reportingWeek,
          hcp_specialty: record.specialty,
          hcp_decile: record.decile,
          total_rx_count: record.total_rx_count || 0,
          brand_rx_count: record.brand_rx_count || 0,
          rep_calls: 0,
          website_visits: 0,
          email_opens: 0,
          total_touchpoints: 0,
          engagement_score: 0, // Calculated later
          last_interaction_date: record.data_month,
          content_depth_score: 0,
          preferred_channel: 'unknown',
          churn_risk_score: 0,
          growth_opportunity_score: 0,
          data_sources: ['iqvia_hcp_decile_raw'],
          calculated_at: new Date().toISOString(),
        });
      }
    });
    
    // Add Veeva CRM rep call data
    veevaData?.forEach(activity => {
      const hcp = hcpMap.get(activity.hcp_id);
      if (hcp) {
        hcp.rep_calls++;
        hcp.total_touchpoints++;
        // Update last interaction date if more recent
        if (activity.activity_date > hcp.last_interaction_date) {
             hcp.last_interaction_date = activity.activity_date;
        }
        if (!hcp.data_sources.includes('veeva_crm_activity_raw')) {
          hcp.data_sources.push('veeva_crm_activity_raw');
        }
      }
    });
    
    // Add web analytics data
    webData?.forEach(session => {
      // Find matching HCP based on available data, using hcp_id if available, otherwise specialty (as in original)
      const matchingHCP = Array.from(hcpMap.values()).find(hcp => {
          return hcp.hcp_specialty === session.hcp_specialty;
      });
      
      if (matchingHCP) {
          matchingHCP.website_visits++;
          matchingHCP.total_touchpoints++;
          if (!matchingHCP.data_sources.includes('web_analytics_raw')) {
              matchingHCP.data_sources.push('web_analytics_raw');
          }
      }
    });
    
    // Estimate email engagement (distribute across HCPs)
    const totalEmailOpens = sfmcData?.reduce((sum, campaign) => sum + (campaign.total_opens || 0), 0) || 0;
    const hcpCount = hcpMap.size;
    const avgOpensPerHcp = hcpCount > 0 ? Math.floor(totalEmailOpens / hcpCount) : 0;
    
    // Calculate engagement scores and metrics
    const hcpRecords = Array.from(hcpMap.values()).map(hcp => {
      // Distribute email opens with a randomized factor for simulation
      const emailOpens = Math.floor(avgOpensPerHcp * (0.5 + Math.random()));
      
      // Determine prescription trend (based on original logic, but cleaned up)
      let prescriptionTrend = 'decreasing';
      if (hcp.total_rx_count > 50) {
        prescriptionTrend = 'increasing';
      } else if (hcp.total_rx_count > 20) {
        prescriptionTrend = 'stable';
      }

      const contentViews = hcp.website_visits || 0;
      
      // Calculate avg session duration (simulated)
      const avgSessionDurationMinutes = contentViews > 0 ? 3.5 + (Math.random() * 2.5) : 0;
      
      // Final total touchpoints calculation
      const finalTotalTouchpoints = hcp.rep_calls + emailOpens + contentViews;
      
      // Calculate simulated scores if they were missing from the raw data
      const churnRiskScore = hcp.churn_risk_score || Math.floor(Math.random() * 30);
      const growthOpportunityScore = hcp.growth_opportunity_score || Math.floor(Math.random() * 50 + 50);

      // Re-calculate the engagement score
      hcp.engagement_score = (finalTotalTouchpoints * 0.5) + (hcp.brand_rx_count * 0.2) + ((100 - churnRiskScore) * 0.3);

      return {
        brand_id: hcp.brand_id,
        reporting_week: reportingWeek,
        hcp_id: hcp.hcp_id,
        hcp_specialty: hcp.hcp_specialty,
        hcp_decile: hcp.hcp_decile,
        total_touchpoints: finalTotalTouchpoints,
        email_opens: emailOpens,
        website_visits: hcp.website_visits || 0,
        rep_calls: hcp.rep_calls,
        content_views: contentViews,
        avg_session_duration_minutes: avgSessionDurationMinutes,
        prescriptions_written: hcp.total_rx_count,
        prescription_trend: prescriptionTrend,
        churn_risk_score: churnRiskScore,
        growth_opportunity_score: growthOpportunityScore,
        calculated_at: hcp.calculated_at,
      };
    });
    
    // Batch insert
    let insertedCount = 0;
    const BATCH_SIZE = 100;
    for (let i = 0; i < hcpRecords.length; i += BATCH_SIZE) {
      const batch = hcpRecords.slice(i, i + BATCH_SIZE);
      const { error: insertError } = await supabase
        .from('hcp_engagement_analytics')
        .insert(batch);
      
      if (!insertError) {
        insertedCount += batch.length;
      } else {
        console.error('❌ HCP engagement insert failed:', {
          message: insertError.message,
          code: insertError.code,
          details: insertError.details,
          hint: insertError.hint,
          batchSize: batch.length // Corrected property name
        });
        throw new Error(`HCP engagement insert failed: ${insertError.message}`);
      }
    }
    
    console.log(`✓ HCP engagement aggregated for ${insertedCount} HCPs`);
    return insertedCount;
  }
}


export default AnalyticsAggregationService;