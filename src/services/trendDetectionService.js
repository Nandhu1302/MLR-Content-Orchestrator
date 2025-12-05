import { supabase } from '@/integrations/supabase/client';
import { subDays, format } from 'date-fns';

export class TrendDetectionService {

  static async analyzeSentimentShifts(brandId, daysBack = 30) {
    const startDate = format(subDays(new Date(), daysBack), 'yyyy-MM-dd');
    const midDate = format(subDays(new Date(), Math.floor(daysBack / 2)), 'yyyy-MM-dd');

    const { data: recentData } = await supabase
      .from('social_listening_data')
      .select('topic, sentiment, mention_volume')
      .eq('brand_id', brandId)
      .gte('date_captured', midDate);

    const { data: olderData } = await supabase
      .from('social_listening_data')
      .select('topic, sentiment, mention_volume')
      .eq('brand_id', brandId)
      .gte('date_captured', startDate)
      .lt('date_captured', midDate);

    if (!recentData || !olderData) return [];

    const shifts = [];
    const topicMap = new Map();

    recentData.forEach(d => {
      if (!d.topic) return;
      const sentimentScore = d.sentiment === 'positive' ? 0.8 : d.sentiment === 'negative' ? 0.2 : 0.5;
      if (!topicMap.has(d.topic)) {
        topicMap.set(d.topic, { recent: [], old: [], volume: d.mention_volume || 0 });
      }
      topicMap.get(d.topic).recent.push(sentimentScore);
    });

    olderData.forEach(d => {
      if (!d.topic) return;
      const sentimentScore = d.sentiment === 'positive' ? 0.8 : d.sentiment === 'negative' ? 0.2 : 0.5;
      if (topicMap.has(d.topic)) {
        topicMap.get(d.topic).old.push(sentimentScore);
      }
    });

    topicMap.forEach((data, topic) => {
      if (data.recent.length > 0 && data.old.length > 0) {
        const recentAvg = data.recent.reduce((a, b) => a + b, 0) / data.recent.length;
        const oldAvg = data.old.reduce((a, b) => a + b, 0) / data.old.length;
        const change = recentAvg - oldAvg;

        if (Math.abs(change) > 0.15) {
          shifts.push({
            topic,
            previousSentiment: oldAvg,
            currentSentiment: recentAvg,
            change,
            volume: data.volume,
            trendDirection: change > 0 ? 'improving' : 'declining'
          });
        }
      }
    });

    return shifts.sort((a, b) => Math.abs(b.change) - Math.abs(a.change));
  }

  static async detectMarketMovements(brandId, weeksBack = 4) {
    const { data } = await supabase
      .from('market_intelligence_analytics')
      .select('*')
      .eq('brand_id', brandId)
      .order('reporting_month', { ascending: false })
      .limit(weeksBack * 4);

    if (!data || data.length < 2) return [];

    // Get brand name for context
    const { data: brandData } = await supabase
      .from('brand_profiles')
      .select('brand_name')
      .eq('id', brandId)
      .single();

    const brandName = brandData?.brand_name || 'Brand';

    const movements = [];
    const recent = data.slice(0, Math.floor(data.length / 2));
    const previous = data.slice(Math.floor(data.length / 2));

    // Prioritized metrics - only show one key metric to avoid confusion
    // Market share is most actionable, then total_rx for absolute performance
    const metricPriority = [
      { field: 'market_share_percent', display: 'Market Share' },
      { field: 'total_rx', display: 'Total Prescriptions' }
    ];

    // Find the most significant metric change to report
    let bestMovement = null;
    let bestSignificance = 0;

    for (const { field, display } of metricPriority) {
      const recentAvg = recent.reduce((sum, d) => sum + (d[field] || 0), 0) / recent.length;
      const previousAvg = previous.reduce((sum, d) => sum + (d[field] || 0), 0) / previous.length;

      if (previousAvg === 0) continue;

      const changePercent = ((recentAvg - previousAvg) / previousAvg) * 100;
      const absChange = Math.abs(changePercent);

      if (absChange > 5) {
        const movement = {
          metric: `${brandName} ${display}`,
          previousValue: previousAvg,
          currentValue: recentAvg,
          changePercent,
          significance: absChange > 15 ? 'high' : absChange > 10 ? 'medium' : 'low'
        };

        // Prioritize market share, then largest absolute change
        const significanceScore = field === 'market_share_percent' ? absChange * 2 : absChange;

        if (significanceScore > bestSignificance) {
          bestSignificance = significanceScore;
          bestMovement = movement;
        }
      }
    }

    // Only return the single most important market movement
    if (bestMovement) {
      movements.push(bestMovement);
    }

    return movements;
  }

  static async identifyCompetitiveTriggers(brandId, daysBack = 14) {
    const { data } = await supabase
      .from('competitive_intelligence_enriched')
      .select('*')
      .eq('brand_id', brandId)
      .in('threat_level', ['high', 'critical'])
      .gte('discovered_at', new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000).toISOString())
      .order('discovered_at', { ascending: false });

    if (!data) return [];

    // Filter out items with stale/past dates in content
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    const filteredData = data.filter(item => {
      // Check for past quarter references (e.g., "Q1 2025" when we're in Q4 2025)
      const pastQuarterPattern = /Q[1-4]\s+20\d{2}/gi;
      const matches = item.content?.match(pastQuarterPattern) || [];

      for (const match of matches) {
        const [quarter, year] = match.replace('Q', '').split(/\s+/);
        const quarterNum = parseInt(quarter);
        const yearNum = parseInt(year);

        // Calculate if this quarter is in the past
        const quarterEndMonth = quarterNum * 3;
        if (yearNum < currentYear || (yearNum === currentYear && quarterEndMonth < currentMonth)) {
          console.warn(`Filtering stale intelligence: "${item.title}" references past date ${match}`);
          return false;
        }
      }

      return true;
    });

    return filteredData.map(item => ({
      competitor: item.competitor_name,
      title: item.title,
      content: item.content,
      activity: item.intelligence_type,
      threatLevel: item.threat_level || 'medium',
      insight: item.impact_assessment || item.title,
      recommendedActions: Array.isArray(item.recommended_actions) ? item.recommended_actions : [],
      date: item.discovered_at
    }));
  }

  static async spotEmergingTopics(brandId, daysBack = 7) {
    const recentDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000).toISOString();
    const olderDate = new Date(Date.now() - daysBack * 2 * 24 * 60 * 60 * 1000).toISOString();

    const { data: recentData } = await supabase
      .from('social_listening_data')
      .select('topic, mention_volume')
      .eq('brand_id', brandId)
      .gte('date_captured', recentDate);

    const { data: olderData } = await supabase
      .from('social_listening_data')
      .select('topic, mention_volume')
      .eq('brand_id', brandId)
      .gte('date_captured', olderDate)
      .lt('date_captured', recentDate);

    if (!recentData || !olderData) return [];

    const topicGrowth = new Map();

    recentData.forEach(d => {
      if (d.topic) {
        topicGrowth.set(d.topic, {
          recent: (topicGrowth.get(d.topic)?.recent || 0) + (d.mention_volume || 0),
          old: topicGrowth.get(d.topic)?.old || 0
        });
      }
    });

    olderData.forEach(d => {
      if (d.topic && topicGrowth.has(d.topic)) {
        const current = topicGrowth.get(d.topic);
        topicGrowth.set(d.topic, {
          recent: current.recent,
          old: current.old + (d.mention_volume || 0)
        });
      }
    });

    const emergingTopics = [];

    topicGrowth.forEach((data, topic) => {
      if (data.old > 0 && data.recent > 100) {
        const growthRate = ((data.recent - data.old) / data.old) * 100;

        if (growthRate > 50) {
          emergingTopics.push({
            topic,
            volume: data.recent,
            growthRate,
            relevanceScore: Math.min(100, (growthRate / 100) * 50 + (data.recent / 500) * 50),
            keywords: [topic]
          });
        }
      }
    });

    return emergingTopics.sort((a, b) => b.growthRate - a.growthRate);
  }

  static async identifySentimentConcerns(brandId, daysBack = 30) {
    const { data } = await supabase
      .from('social_listening_data')
      .select('*')
      .eq('brand_id', brandId)
      .eq('sentiment', 'negative')
      .gte('date_captured', subDays(new Date(), daysBack).toISOString())
      .order('mention_volume', { ascending: false });

    if (!data) return [];

    // Group by topic and platform
    const concernMap = new Map();

    data.forEach(item => {
      if (!item.topic) return;

      if (!concernMap.has(item.topic)) {
        concernMap.set(item.topic, { platforms: new Map(), totalVolume: 0, issues: new Set() });
      }

      const concern = concernMap.get(item.topic);
      concern.totalVolume += item.mention_volume || 0;

      if (item.platform) {
        concern.platforms.set(item.platform, (concern.platforms.get(item.platform) || 0) + (item.mention_volume || 0));
      }

      // Extract issues from key_phrases if available
      if (item.key_phrases && typeof item.key_phrases === 'object') {
        const phrases = Array.isArray(item.key_phrases) ? item.key_phrases : Object.values(item.key_phrases);
        phrases.forEach(phrase => {
          if (typeof phrase === 'string') concern.issues.add(phrase);
        });
      }
    });

    const concerns = [];
    concernMap.forEach((data, topic) => {
      if (data.totalVolume > 20) {
        const topPlatform = Array.from(data.platforms.entries()).sort((a, b) => b[1] - a[1])[0];
        concerns.push({
          topic,
          platform: topPlatform?.[0] || 'Social',
          negativeVolume: data.totalVolume,
          sentiment: 0.2,
          urgency: data.totalVolume > 200 ? 'high' : data.totalVolume > 100 ? 'medium' : 'low',
          keyIssues: Array.from(data.issues).slice(0, 3)
        });
      }
    });

    return concerns.sort((a, b) => b.negativeVolume - a.negativeVolume);
  }

  static async identifyQuickWins(brandId, daysBack = 30) {
    const { data } = await supabase
      .from('social_listening_data')
      .select('*')
      .eq('brand_id', brandId)
      .eq('sentiment', 'positive')
      .gte('date_captured', subDays(new Date(), daysBack).toISOString())
      .order('mention_volume', { ascending: false });

    if (!data) return [];

    // Group by topic
    const winMap = new Map();

    data.forEach(item => {
      if (!item.topic) return;

      if (!winMap.has(item.topic)) {
        winMap.set(item.topic, { volume: 0, platforms: new Set() });
      }

      const win = winMap.get(item.topic);
      win.volume += item.mention_volume || 0;
      if (item.platform) win.platforms.add(item.platform);
    });

    const wins = [];
    winMap.forEach((data, topic) => {
      if (data.volume > 50) {
        wins.push({
          topic,
          positiveVolume: data.volume,
          platforms: Array.from(data.platforms),
          sentiment: 0.8,
          amplificationPotential: Math.min(100, data.volume / 10)
        });
      }
    });

    return wins.sort((a, b) => b.positiveVolume - a.positiveVolume);
  }

  static async forecastTrends(brandId) {
    // Placeholder for trend forecasting
    return [];
  }

  static async clusterOpportunities(opportunities) {
    // Placeholder for opportunity clustering
    const clusters = new Map();
    return clusters;
  }

  static async findRegulatoryOpportunities(brandId) {
    // Placeholder - return empty array for now to avoid type inference issues
    return [];
  }
}