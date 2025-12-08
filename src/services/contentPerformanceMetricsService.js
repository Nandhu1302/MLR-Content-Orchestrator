import { supabase } from '@/integrations/supabase/client';

/**
 * Service for aggregating detailed content performance metrics
 */
export class ContentPerformanceMetricsService {
  
  /**
   * Generate comprehensive performance metrics for all content
   */
  static async generateMetrics(brandId) {
  console.log('📈 Generating content performance metrics...');
  
  // Get all content with attribution data
  const { data: contentData } = await supabase
    .from('content_registry')
    .select(`
    id,
    content_name,
    content_type,
    content_fingerprint,
    content_performance_attribution (
      impressions,
      engagements,
      conversions,
      engagement_rate,
      conversion_rate,
      performance_score,
      measurement_date,
      audience_segment,
      channel
    )
    `)
    .eq('brand_id', brandId);
  
  if (!contentData || contentData.length === 0) {
    console.log('No content data found for metrics');
    return;
  }
  
  // Aggregate metrics for each content piece
  const metricsRecords = [];
  
  contentData.forEach(content => {
    const attributions = content.content_performance_attribution || [];
    
    if (attributions.length === 0) return;
    
    // Calculate aggregates
    const totalImpressions = attributions.reduce((sum, a) => sum + (a.impressions || 0), 0);
    const totalEngagements = attributions.reduce((sum, a) => sum + (a.engagements || 0), 0);
    const totalConversions = attributions.reduce((sum, a) => sum + (a.conversions || 0), 0);
    const avgEngagementRate = attributions.reduce((sum, a) => sum + (a.engagement_rate || 0), 0) / attributions.length;
    const avgConversionRate = attributions.reduce((sum, a) => sum + (a.conversion_rate || 0), 0) / attributions.length;
    const avgPerformanceScore = attributions.reduce((sum, a) => sum + (a.performance_score || 0), 0) / attributions.length;
    
    // Get audience breakdown
    const audienceBreakdown = {};
    attributions.forEach(a => {
    if (a.audience_segment) {
      audienceBreakdown[a.audience_segment] = (audienceBreakdown[a.audience_segment] || 0) + (a.engagements || 0);
    }
    });
    
    // Get channel breakdown
    const channelBreakdown = {};
    attributions.forEach(a => {
    if (a.channel) {
      channelBreakdown[a.channel] = (channelBreakdown[a.channel] || 0) + (a.engagements || 0);
    }
    });
    
    metricsRecords.push({
    brand_id: brandId,
    content_registry_id: content.id,
    content_type: content.content_type,
    measurement_period_start: attributions[attributions.length - 1]?.measurement_date,
    measurement_period_end: attributions[0]?.measurement_date,
    total_impressions: totalImpressions,
    total_engagements: totalEngagements,
    total_conversions: totalConversions,
    avg_engagement_rate: avgEngagementRate,
    avg_conversion_rate: avgConversionRate,
    performance_score: avgPerformanceScore,
    audience_breakdown: audienceBreakdown,
    channel_breakdown: channelBreakdown,
    trend_direction: avgPerformanceScore > 50 ? 'improving' : 'stable',
    calculated_at: new Date().toISOString(),
    });
  });
  
  // Batch insert
  for (let i = 0; i < metricsRecords.length; i += 100) {
    const batch = metricsRecords.slice(i, i + 100);
    await supabase.from('content_performance_metrics').insert(batch);
  }
  
  console.log(`✅ Generated ${metricsRecords.length} content performance metric records`);
  }
}

