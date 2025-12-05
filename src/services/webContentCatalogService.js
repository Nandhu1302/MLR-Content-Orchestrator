import { supabase } from '@/integrations/supabase/client';

/**
 * Service for cataloging web content and linking sessions to content pieces
 */
export class WebContentCatalogService {
  
  /**
   * Catalog unique web pages from analytics as content items
   */
  static async catalogWebPages(brandId) { // brandId type from TS removed
    console.log('🌐 Cataloging web content...');
    
    // Get unique pages from web analytics
    const { data: sessions } = await supabase
      .from('web_analytics_raw')
      .select('pages_visited')
      .eq('brand_id', brandId);
    
    if (!sessions || sessions.length === 0) return;
    
    // Extract unique pages
    const uniquePages = new Set();
    sessions.forEach(session => {
      const pages = session.pages_visited; // Type assertion removed
      if (pages && Array.isArray(pages)) {
        pages.forEach(page => uniquePages.add(page));
      }
    });
    
    console.log(`Found ${uniquePages.size} unique web pages`);
    
    // Catalog each unique page
    for (const pageUrl of uniquePages) {
      const contentFingerprint = {
        page_url: pageUrl,
        page_category: this.categorizePage(pageUrl),
        content_type: 'web_page',
        key_topics: this.extractTopicsFromUrl(pageUrl),
      };
      
      // Check if already cataloged
      const { data: existing } = await supabase
        .from('content_registry')
        .select('id')
        .eq('brand_id', brandId)
        .eq('content_type', 'web')
        .eq('external_content_id', pageUrl)
        .single();
      
      if (existing) continue;
      
      // Create content registry entry
      await supabase
        .from('content_registry')
        .insert({
          brand_id: brandId,
          content_name: `Web Page: ${pageUrl}`,
          content_type: 'web',
          content_fingerprint: contentFingerprint,
          source_system: 'web_analytics',
          external_content_id: pageUrl,
        });
    }
    
    console.log(`✅ Cataloged ${uniquePages.size} web pages`);
  }
  
  /**
   * Link web sessions to cataloged content
   */
  static async linkSessionsToContent(brandId) { // brandId type from TS removed
    console.log('🔗 Linking web sessions to content...');
    
    // Get content registry entries for web pages
    const { data: webContent } = await supabase
      .from('content_registry')
      .select('id, external_content_id')
      .eq('brand_id', brandId)
      .eq('content_type', 'web');
    
    if (!webContent || webContent.length === 0) return;
    
    // Create lookup map
    const contentMap = new Map();
    webContent.forEach(content => {
      if (content.external_content_id) {
        contentMap.set(content.external_content_id, content.id);
      }
    });
    
    // Get sessions without content links
    const { data: sessions } = await supabase
      .from('web_analytics_raw')
      .select('*')
      .eq('brand_id', brandId)
      .is('content_registry_id', null);
    
    if (!sessions || sessions.length === 0) return;
    
    let linked = 0;
    for (const session of sessions) {
      const pages = session.pages_visited; // Type assertion removed
      if (!pages || !Array.isArray(pages) || pages.length === 0) continue;
      
      // Link to first page visited
      const firstPage = pages[0];
      const contentId = contentMap.get(firstPage);
      
      if (contentId) {
        await supabase
          .from('web_analytics_raw')
          .update({ content_registry_id: contentId })
          .eq('session_id', session.session_id);
        linked++;
      }
    }
    
    console.log(`✅ Linked ${linked} sessions to content`);
  }
  
  /**
   * Create performance attribution for web content
   */
  static async createWebAttribution(brandId) { // brandId type from TS removed
    console.log('📊 Creating web content attribution...');
    
    const { data: webContent } = await supabase
      .from('content_registry')
      .select('id')
      .eq('brand_id', brandId)
      .eq('content_type', 'web');
    
    if (!webContent || webContent.length === 0) return;
    
    for (const content of webContent) {
      // Get sessions for this content
      const { data: sessions } = await supabase
        .from('web_analytics_raw')
        .select('*')
        .eq('content_registry_id', content.id);
      
      if (!sessions || sessions.length === 0) continue;
      
      // Calculate aggregate metrics
      const totalSessions = sessions.length;
      const totalPageViews = sessions.reduce((sum, s) => sum + (s.page_views || 0), 0);
      const nonBounced = sessions.filter(s => !s.bounce).length;
      const engagementRate = (nonBounced / totalSessions) * 100;
      
      // Get latest session date
      const latestDate = sessions.reduce((latest, s) => {
        const date = new Date(s.visit_date);
        return date > latest ? date : latest;
      }, new Date(0));
      
      // Insert attribution record
      await supabase
        .from('content_performance_attribution')
        .insert({
          content_registry_id: content.id,
          brand_id: brandId,
          measurement_date: latestDate.toISOString().split('T')[0],
          measurement_period: 'weekly',
          impressions: totalSessions,
          page_views: totalPageViews,
          engagements: nonBounced,
          engagement_rate: engagementRate,
          performance_score: Math.round(engagementRate * 0.8),
          source_system: 'web_analytics',
          channel: 'website',
        });
    }
    
    console.log(`✅ Created attribution for ${webContent.length} web pages`);
  }
  
  static categorizePage(url) { // url type from TS removed
    const lower = url.toLowerCase();
    if (lower.includes('efficacy')) return 'efficacy';
    if (lower.includes('safety')) return 'safety';
    if (lower.includes('dosing')) return 'dosing';
    if (lower.includes('patient')) return 'patient_resources';
    if (lower.includes('hcp')) return 'hcp_portal';
    return 'general';
  }
  
  static extractTopicsFromUrl(url) { // url type from TS removed
    const topics = [];
    const lower = url.toLowerCase();
    
    if (lower.includes('efficacy')) topics.push('efficacy');
    if (lower.includes('safety')) topics.push('safety');
    if (lower.includes('dosing')) topics.push('dosing');
    if (lower.includes('patient')) topics.push('patient_care');
    if (lower.includes('clinical')) topics.push('clinical_data');
    
    return topics.length > 0 ? topics : ['general'];
  }
}