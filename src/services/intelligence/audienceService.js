// ============================================
// Audience Intelligence Service
// Handles audience insights and segment details
// ============================================

import { supabase } from '@/integrations/supabase/client';

export class AudienceService {
  static async fetchAudienceInsights(brandId, intent) {
    const insights = [];

    // HCP Decile Data
    const { data: hcpData } = await supabase
      .from('iqvia_hcp_decile_raw')
      .select('specialty, region')
      .limit(100);

    if (hcpData && hcpData.length > 0) {
      const uniqueSpecialties = new Set(hcpData.map(h => h.specialty)).size;
      const percentage = Math.min(95, uniqueSpecialties * 15);

      insights.push({
        type: 'prescribing_tier',
        metric: 'HCP Coverage',
        value: percentage,
        source: 'IQVIA HCP Decile',
        description: `${percentage}% specialty coverage in target regions`
      });
    }

    // Web Analytics
    const { data: webData } = await supabase
      .from('web_analytics_raw')
      .select('pages_visited, resources_downloaded')
      .limit(100);

    if (webData && webData.length > 0) {
      const avgPages = Math.round(
        webData.reduce((sum, w) => sum + (typeof w.pages_visited === 'number' ? w.pages_visited : 0), 0) / webData.length
      );

      insights.push({
        type: 'engagement',
        metric: 'Avg Pages Per Visit',
        value: avgPages,
        source: 'Web Analytics',
        description: `${avgPages} pages viewed per session on average`
      });
    }

    // Veeva CRM Activity
    const { data: crmData } = await supabase
      .from('veeva_crm_activity_raw')
      .select('engagement_score')
      .limit(50);

    if (crmData && crmData.length > 0) {
      const avgEngagement = Math.round(
        crmData.reduce((sum, c) => sum + (c.engagement_score || 0), 0) / crmData.length
      );

      insights.push({
        type: 'field_engagement',
        metric: 'Rep Engagement Score',
        value: avgEngagement,
        source: 'Veeva CRM',
        description: `Average field engagement score: ${avgEngagement}/100`
      });
    }

    return insights;
  }

  static async fetchAudienceSegmentDetails(brandId, segmentName) {
    const { data, error } = await supabase
      .from('audience_segments')
      .select('*')
      .eq('brand_id', brandId)
      .ilike('segment_name', `%${segmentName}%`)
      .single();

    if (error) {
      console.error('Error fetching audience segment:', error);
      return null;
    }

    return data;
  }
}