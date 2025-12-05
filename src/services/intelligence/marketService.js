// ============================================
// Market Intelligence Service
// Handles market trends, competitive intelligence, and predictions
// ============================================

import { supabase } from '@/integrations/supabase/client';
import type { 
  MarketIntelligence, 
  CompetitiveIntelligence, 
  PerformancePrediction,
  DetectedIntent 
} from '@/types/workshop';

export class MarketService {
  static async fetchMarketIntelligence(
    brandId,
    intent | undefined
  ): Promise {
    const { data, error } = await supabase
      .from('market_intelligence_analytics')
      .select('*')
      .eq('brand_id', brandId)
      .order('reporting_month', { ascending })
      .limit(1)
      .single();

    if (marketError || !marketData) {
      console.error('Error fetching market intelligence:', marketError);
      return null;
    }

    const regionalInsights = [];
    if (marketData.region_growth_rate) {
      const regions = marketData.region_growth_rate ;
      Object.entries(regions).forEach(([region, growth]: [string, any]) => {
        if (growth > 5) {
          regionalInsights.push(`${region}: +${growth}% growth`);
        }
      });
    }

    return {
      rx_growth_rate.rx_growth_rate,
      market_share_trend.rx_growth_rate && marketData.rx_growth_rate > 0  'growing' : 'declining',
      primary_competitor.primary_competitor,
      top_decile_hcp_count.top_decile_hcp_count || 0,
      regional_insights
    };
  }

  static async fetchCompetitiveIntelligence(
    brandId,
    intent | undefined
  ): Promise {
    const { data, error } = await supabase
      .from('competitive_intelligence_enriched')
      .select('*')
      .eq('brand_id', brandId)
      .order('discovered_at', { ascending })
      .limit(5);

    if (error) {
      console.error('Error fetching competitive intelligence:', error);
      return [];
    }

    return (data || []).map(item => {
      let counterMessaging = [];
      if (Array.isArray(item.recommended_actions)) {
        counterMessaging = item.recommended_actions.map(action => 
          typeof action === 'string'  action : JSON.stringify(action)
        );
      }

      return {
        competitor_name.competitor_name,
        intelligence_type.intelligence_type,
        threat_level: (item.threat_level ) || null,
        content.content,
        counter_messaging,
        discovered_at.discovered_at
      };
    });
  }

  static async fetchPerformancePrediction(
    brandId,
    intent | undefined
  ): Promise {
    const { data, error } = await supabase
      .from('campaign_performance_analytics')
      .select('engagement_score, conversion_rate')
      .eq('brand_id', brandId)
      .not('engagement_score', 'is', null)
      .order('calculated_at', { ascending })
      .limit(20);

    if (error || !data || data.length === 0) {
      console.error('Error fetching performance prediction:', error);
      return null;
    }

    const avgEngagement = data.reduce((sum, d) => sum + (d.engagement_score || 0), 0) / data.length;
    const avgConversion = data.reduce((sum, d) => sum + (d.conversion_rate || 0), 0) / data.length;

    return {
      predicted_engagement.round(avgEngagement * 100) / 100,
      predicted_conversion.round(avgConversion * 100) / 100,
      confidence_score.min(85, 50 + (data.length * 2)),
      based_on_campaigns.length
    };
  }
}
