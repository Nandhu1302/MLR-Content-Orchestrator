import { supabase } from '@/integrations/supabase/client';

/**
 * Service for tracking and analyzing performance of individual content elements
 * (subject lines, CTAs, tones, message themes, etc.)
 */
export class ContentElementPerformanceService {
  
  /**
   * Extract and track performance of content elements from campaigns
   */
  static async trackContentElements(brandId) {
  console.log('📊 Tracking content element performance...');
  
  // Get all campaigns with content fingerprints
  const { data: campaigns } = await supabase
    .from('content_registry')
    .select(`
    id,
    content_name,
    content_fingerprint,
    campaign_performance_analytics (
      open_rate,
      click_rate,
      conversion_rate,
      engagement_score,
      total_audience_size,
      total_engaged,
      total_converted
    )
    `)
    .eq('brand_id', brandId)
    .eq('content_type', 'email');
  
  if (!campaigns || campaigns.length === 0) return;
  
  // Track subject line performance
  const subjectLinePerf = new Map();
  const ctaPerf = new Map();
  const tonePerf = new Map();
  const themePerf = new Map();
  
  for (const campaign of campaigns) {
    const fp = campaign.content_fingerprint;
    const perf = campaign.campaign_performance_analytics?.[0];
    
    if (!fp || !perf) continue;
    
    // Track subject line
    if (fp.subject_line) {
    const key = fp.subject_line;
    if (!subjectLinePerf.has(key)) {
      subjectLinePerf.set(key, {
      element_type: 'subject_line',
      element_value: key,
      total_impressions: 0,
      total_engagements: 0,
      total_conversions: 0,
      sample_size: 0,
      });
    }
    const sl = subjectLinePerf.get(key);
    sl.total_impressions += perf.total_audience_size || 0;
    sl.total_engagements += perf.total_engaged || 0;
    sl.total_conversions += perf.total_converted || 0;
    sl.sample_size += 1;
    }
    
    // Track CTA performance
    if (fp.primary_cta) {
    const key = fp.primary_cta;
    if (!ctaPerf.has(key)) {
      ctaPerf.set(key, {
      element_type: 'cta',
      element_value: key,
      element_context: { position: fp.cta_position },
      total_impressions: 0,
      total_engagements: 0,
      total_conversions: 0,
      sample_size: 0,
      });
    }
    const cta = ctaPerf.get(key);
    cta.total_impressions += perf.total_audience_size || 0;
    cta.total_engagements += perf.total_engaged || 0;
    cta.total_conversions += perf.total_converted || 0;
    cta.sample_size += 1;
    }
    
    // Track tone performance
    if (fp.tone) {
    const key = fp.tone;
    if (!tonePerf.has(key)) {
      tonePerf.set(key, {
      element_type: 'tone',
      element_value: key,
      element_context: { sophistication: fp.sophistication_level },
      total_impressions: 0,
      total_engagements: 0,
      total_conversions: 0,
      sample_size: 0,
      });
    }
    const tone = tonePerf.get(key);
    tone.total_impressions += perf.total_audience_size || 0;
    tone.total_engagements += perf.total_engaged || 0;
    tone.total_conversions += perf.total_converted || 0;
    tone.sample_size += 1;
    }
    
    // Track message theme performance
    if (fp.message_theme) {
    const key = fp.message_theme;
    if (!themePerf.has(key)) {
      themePerf.set(key, {
      element_type: 'message_theme',
      element_value: key,
      element_context: fp.clinical_focus,
      total_impressions: 0,
      total_engagements: 0,
      total_conversions: 0,
      sample_size: 0,
      });
    }
    const theme = themePerf.get(key);
    theme.total_impressions += perf.total_audience_size || 0;
    theme.total_engagements += perf.total_engaged || 0;
    theme.total_conversions += perf.total_converted || 0;
    theme.sample_size += 1;
    }
  }
  
  // Insert all tracked elements
  const allElements = [
    ...Array.from(subjectLinePerf.values()),
    ...Array.from(ctaPerf.values()),
    ...Array.from(tonePerf.values()),
    ...Array.from(themePerf.values()),
  ];
  
  for (const elem of allElements) {
    const avgEngagementRate = elem.total_impressions > 0 
    ? (elem.total_engagements / elem.total_impressions) * 100 
    : 0;
    const avgConversionRate = elem.total_engagements > 0 
    ? (elem.total_conversions / elem.total_engagements) * 100 
    : 0;
    const avgPerformanceScore = (avgEngagementRate + avgConversionRate) / 2;
    
    await supabase.from('content_element_performance').insert({
    brand_id: brandId,
    element_type: elem.element_type,
    element_value: elem.element_value,
    element_context: elem.element_context,
    total_impressions: elem.total_impressions,
    total_engagements: elem.total_engagements,
    total_conversions: elem.total_conversions,
    usage_count: elem.sample_size,
    sample_size: elem.sample_size,
    avg_engagement_rate: avgEngagementRate,
    avg_conversion_rate: avgConversionRate,
    avg_performance_score: avgPerformanceScore,
    confidence_level: elem.sample_size >= 10 ? 'high' : elem.sample_size >= 5 ? 'medium' : 'low',
    first_seen: new Date().toISOString(),
    last_seen: new Date().toISOString(),
    last_calculated: new Date().toISOString(),
    });
  }
  
  console.log(`✅ Tracked ${allElements.length} content elements`);
  }
}

