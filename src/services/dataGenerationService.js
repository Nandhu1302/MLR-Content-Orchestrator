import { supabase } from '@/integrations/supabase/client';
import { ContentFingerprintingService } from './contentFingerprintingService';
import { ContentAttributionService } from './contentAttributionService';

export class DataGenerationService {
  /**
   * Generate comprehensive realistic pseudo data for a brand across all systems
   */
  static async generateSampleData(brandId, monthsBack = 12) {
    try {
      console.log('🚀 Generating comprehensive sample data...');

      // Step 1: Generate SFMC Campaigns
      console.log('📧 Generating SFMC email campaigns...');
      await this.generateSFMCData(brandId, monthsBack);

      // Step 2: Generate IQVIA Market Data
      console.log('📊 Generating IQVIA market data...');
      await this.generateIQVIAData(brandId, monthsBack);

      // Step 3: Generate Veeva CRM Data
      console.log('👥 Generating Veeva CRM data...');
      await this.generateVeevaData(brandId, monthsBack);

      // Step 4: Generate Web Analytics
      console.log('🌐 Generating web analytics data...');
      await this.generateWebAnalytics(brandId, monthsBack);

      // Step 5: Generate Social Listening Data
      console.log('💬 Generating social listening data...');
      await this.generateSocialData(brandId, monthsBack);
      
      // Step 6: Generate IQVIA Rx Raw Data
      console.log('💊 Generating IQVIA Rx raw data...');
      await this.generateIQVIARxRaw(brandId, monthsBack);
      
      // Step 7: Generate IQVIA HCP Decile Data
      console.log('👨‍⚕️ Generating IQVIA HCP decile data...');
      await this.generateIQVIAHCPDecileRaw(brandId, monthsBack);
      
      // Step 8: Generate SFMC Journey Data
      console.log('🗺️ Generating SFMC journey data...');
      await this.generateSFMCJourneyRaw(brandId, monthsBack);
      
      // Step 9: Generate Veeva Vault Content
      console.log('📚 Generating Veeva Vault content...');
      await this.generateVeevaVaultContent(brandId, monthsBack);

      // Step 10: Generate Campaign Analytics
      console.log('📈 Generating campaign analytics...');
      await ContentAttributionService.generateCampaignAnalytics(
        brandId,
        new Date(Date.now() - monthsBack * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        new Date().toISOString().split('T')[0]
      );

      // Step 11: Discover Success Patterns
      console.log('🔍 Detecting success patterns...');
      const { SuccessPatternDetector } = await import('./successPatternDetector');
      await SuccessPatternDetector.runPatternDetection(brandId);

      console.log('✅ Sample data generation complete!');
      return { success: true };
    } catch (error) {
      console.error('❌ Error generating sample data:', error);
      throw error;
    }
  }

  static async generateSFMCData(brandId, monthsBack) {
    console.log('  📧 Generating SFMC campaign data with enriched content...');
    
    const messageThemes = [
      'Efficacy & Clinical Results',
      'Safety & Tolerability',
      'Convenience & Adherence',
      'Patient Support Programs',
      'Latest Clinical Data',
      'Real-World Evidence',
      'Dosing & Administration',
      'Drug Interactions & Safety'
    ];
    
    const subjectLineTemplates = [
      'New Data: {theme} - Study Results Available',
      '{theme}: What Your Patients Need to Know',
      'Clinical Update: {theme} in Treatment-Experienced Patients',
      'Expert Perspective: {theme}',
      'Q&A: Common Questions About {theme}',
      '{theme} - Latest Guidelines',
      'Case Study: {theme} in Clinical Practice',
      'Continuing Education: {theme}'
    ];
    
    const ctaTemplates = [
      'View Full Data',
      'Download Study Summary',
      'Register for Webinar',
      'Access Clinical Resources',
      'Read Case Study',
      'Request Rep Visit',
      'Join Expert Discussion',
      'Get Patient Materials'
    ];
    
    for (let i = 0; i < monthsBack * 4; i++) {
      const date = new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000);
      const theme = messageThemes[i % messageThemes.length];
      const subjectTemplate = subjectLineTemplates[i % subjectLineTemplates.length];
      const subjectLine = subjectTemplate.replace('{theme}', theme);
      const cta = ctaTemplates[i % ctaTemplates.length];
      
      const sent = 5000 + Math.floor(Math.random() * 3000);
      const delivered = Math.floor(sent * 0.97);
      const opened = Math.floor(delivered * (0.28 + Math.random() * 0.15));
      const clicked = Math.floor(opened * (0.18 + Math.random() * 0.12));
      const converted = Math.floor(clicked * (0.08 + Math.random() * 0.07));
      
      const openRate = (opened / delivered) * 100;
      const clickRate = (clicked / opened) * 100;
      const conversionRate = (converted / clicked) * 100;
      
      // Insert raw campaign data
      await supabase.from('sfmc_campaign_raw').insert({
        brand_id: brandId,
        external_campaign_id: `SFMC-${date.getTime()}-${i}`,
        campaign_name: `${theme} - Week ${Math.floor(i / 4) + 1}`,
        send_date: date.toISOString(),
        total_sent: sent,
        total_delivered: delivered,
        total_opens: opened,
        total_clicks: clicked,
        unique_opens: Math.floor(opened * 0.85),
        unique_clicks: Math.floor(clicked * 0.92),
      });
      
      // Create detailed content fingerprint
      const contentFingerprint = {
        subject_line: subjectLine,
        preheader: `Learn about ${theme.toLowerCase()} from leading experts`,
        message_theme: theme,
        tone: i % 3 === 0 ? 'educational' : i % 3 === 1 ? 'professional' : 'expert',
        sophistication_level: i % 2 === 0 ? 'expert' : 'intermediate',
        primary_cta: cta,
        cta_position: i % 2 === 0 ? 'above-fold' : 'mid-content',
        content_structure: {
          sections: ['headline', 'key_message', 'clinical_data', 'cta', 'isi'],
          word_count: 250 + Math.floor(Math.random() * 200),
          includes_visual: Math.random() > 0.3,
        },
        audience_targeting: {
          specialty: i % 3 === 0 ? 'Infectious Disease' : 'Internal Medicine',
          experience_level: i % 2 === 0 ? 'treatment-experienced' : 'all',
        },
        clinical_focus: {
          efficacy_emphasis: Math.random() > 0.5,
          safety_emphasis: Math.random() > 0.4,
          convenience_emphasis: Math.random() > 0.6,
        }
      };
      
      // Register in content registry with full fingerprint
      const { data: contentRegistry } = await supabase
        .from('content_registry')
        .insert([{
          brand_id: brandId,
          content_name: `${theme} - Week ${Math.floor(i / 4) + 1}`,
          content_type: 'email',
          content_fingerprint: contentFingerprint,
          source_system: 'sfmc',
        }])
        .select()
        .single();
      
      if (contentRegistry) {
        // Store campaign performance analytics
        await supabase.from('campaign_performance_analytics').insert({
          brand_id: brandId,
          campaign_id: `SFMC-${date.getTime()}-${i}`,
          campaign_name: `${theme} - Week ${Math.floor(i / 4) + 1}`,
          reporting_period: date.toISOString().split('T')[0],
          content_registry_id: contentRegistry.id,
          total_audience_size: sent,
          total_delivered: delivered,
          total_engaged: opened,
          total_converted: converted,
          open_rate: openRate,
          click_rate: clickRate,
          conversion_rate: conversionRate,
          delivery_rate: 97 + Math.random() * 2,
          engagement_score: Math.floor((openRate + clickRate) / 2),
        });
      }
    }
  }

  static async generateIQVIAData(brandId, monthsBack) {
    for (let i = 0; i < monthsBack; i++) {
      const date = new Date(Date.now() - i * 30 * 24 * 60 * 60 * 1000);
      const baseRx = 125000 + Math.floor(Math.random() * 25000);
      
      await supabase.from('iqvia_rx_raw').insert({
        data_month: date.toISOString().split('T')[0],
        file_source: 'IQVIA TRx',
        file_batch_id: `BATCH-${Date.now()}-${i}`,
        total_rx: baseRx,
        new_rx: Math.floor(baseRx * 0.23),
        refill_rx: Math.floor(baseRx * 0.77),
        market_share_percent: 18.5 + Math.random() * 3,
        therapeutic_class: 'HIV Treatment',
      });
    }
  }

  static async generateVeevaData(brandId, monthsBack) {
    const activityTypes = ['Detail', 'Sample Drop', 'Speaker Program', 'Lunch & Learn'];
    const hcpIds = Array.from({ length: 50 }, (_, i) => `HCP-${1000 + i}`);

    for (let i = 0; i < monthsBack * 20; i++) {
      const date = new Date(Date.now() - i * 1.5 * 24 * 60 * 60 * 1000);
      
      await supabase.from('veeva_crm_activity_raw').insert({
        external_activity_id: `ACT-${Date.now()}-${i}`,
        brand_id: brandId,
        activity_date: date.toISOString().split('T')[0],
        activity_type: activityTypes[Math.floor(Math.random() * activityTypes.length)],
        hcp_id: hcpIds[Math.floor(Math.random() * hcpIds.length)],
        hcp_specialty: ['Cardiology', 'Infectious Disease', 'Primary Care'][Math.floor(Math.random() * 3)],
        rep_id: `REP-${Math.floor(Math.random() * 20) + 1}`,
        call_duration_minutes: 15 + Math.floor(Math.random() * 30),
        rep_territory: ['Northeast', 'West', 'South'][Math.floor(Math.random() * 3)],
        engagement_score: 60 + Math.floor(Math.random() * 40),
      });
    }
  }

  static async generateWebAnalytics(brandId, monthsBack) {
    const pages = ['/efficacy', '/safety', '/dosing', '/patient-resources', '/hcp-portal'];
    const sources = ['organic', 'email', 'social', 'direct'];

    for (let i = 0; i < monthsBack * 100; i++) {
      const date = new Date(Date.now() - i * 0.3 * 24 * 60 * 60 * 1000);
      const pageViews = Math.floor(Math.random() * 5) + 1;
      
      await supabase.from('web_analytics_raw').insert({
        session_id: `SESSION-${Date.now()}-${i}`,
        brand_id: brandId,
        visit_date: date.toISOString().split('T')[0],
        visit_timestamp: date.toISOString(),
        visitor_type: 'HCP',
        hcp_specialty: ['Cardiology', 'Infectious Disease', 'Primary Care'][Math.floor(Math.random() * 3)],
        page_views: pageViews,
        session_duration_seconds: pageViews * (30 + Math.floor(Math.random() * 90)),
        referrer_source: sources[Math.floor(Math.random() * sources.length)],
        device_type: ['desktop', 'mobile', 'tablet'][Math.floor(Math.random() * 3)],
        bounce: Math.random() < 0.15,
        pages_visited: [pages[Math.floor(Math.random() * pages.length)]],
      });
    }
  }

  static async generateSocialData(brandId, monthsBack) {
    const platforms = ['Twitter', 'LinkedIn', 'Facebook'];
    const sentiments = ['positive', 'neutral', 'negative'];
    const topics = ['efficacy', 'safety', 'access', 'cost', 'clinical trials'];
    const socialRecords = [];
    const socialRawRecords = [];

    for (let i = 0; i < monthsBack * 30; i++) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const sentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
      const engagement = Math.floor(Math.random() * 1000);
      const reach = Math.floor(Math.random() * 10000);
      
      socialRecords.push({
        brand_id: brandId,
        platform: platforms[Math.floor(Math.random() * platforms.length)],
        post_date: date.toISOString(),
        sentiment,
        engagement_count: engagement,
        reach,
        post_content: `Discussion about ${topics[Math.floor(Math.random() * topics.length)]}`,
        author_followers: Math.floor(Math.random() * 5000),
      });
      
      socialRawRecords.push({
        external_post_id: `POST-${Date.now()}-${i}`,
        platform: platforms[Math.floor(Math.random() * platforms.length)],
        post_date: date.toISOString(),
        post_text: `Discussion about ${topics[Math.floor(Math.random() * topics.length)]}`,
        sentiment_category: sentiment,
        brand_id: brandId,
        likes: Math.floor(engagement * 0.6),
        shares: Math.floor(engagement * 0.2),
        comments: Math.floor(engagement * 0.2),
      });
    }
    
    // Batch insert social_listening_data
    for (let i = 0; i < socialRecords.length; i += 500) {
      const batch = socialRecords.slice(i, i + 500);
      await supabase.from('social_listening_data').insert(batch);
    }
    
    // Batch insert social_listening_raw
    for (let i = 0; i < socialRawRecords.length; i += 500) {
      const batch = socialRawRecords.slice(i, i + 500);
      await supabase.from('social_listening_raw').insert(batch);
    }
    
    console.log(`  ✓ Generated ${socialRecords.length} social listening records`);
  }
  
  static async generateIQVIARxRaw(brandId, monthsBack) {
    const rxRecords = [];
    const regions = ['Northeast', 'West', 'South', 'Midwest', 'National'];
    const competitors = [
      { name: 'Truvada', baseShare: 22 },
      { name: 'Descovy', baseShare: 28 },
      { name: 'Genvoya', baseShare: 15 }
    ];
    
    // Generate data for each region and month (12 months × 5 regions = 60 records)
    for (let i = 0; i < monthsBack; i++) {
      const date = new Date(Date.now() - i * 30 * 24 * 60 * 60 * 1000);
      
      for (const region of regions) {
        // Regional base varies
        const regionalMultiplier = region === 'National' ? 1.5 : 
                                   region === 'Northeast' ? 1.2 : 
                                   region === 'West' ? 1.1 : 
                                   region === 'South' ? 0.9 : 0.8;
        
        const baseRx = Math.floor((50000 + Math.random() * 20000) * regionalMultiplier);
        const seasonalFactor = 1 + Math.sin((i / 12) * Math.PI * 2) * 0.15; // Seasonal variation
        const totalRx = Math.floor(baseRx * seasonalFactor);
        const newRxRate = 0.23 + (Math.random() * 0.05); // 23-28% new Rx
        
        // Calculate competitor data
        const competitorData = {};
        let remainingShare = 100;
        const brandShare = 18.5 + Math.random() * 3;
        remainingShare -= brandShare;
        
        competitors.forEach(comp => {
          const variation = (Math.random() - 0.5) * 4; // ±2%
          competitorData[comp.name] = {
            market_share_percent: Math.max(0, comp.baseShare + variation),
            total_rx: Math.floor(totalRx * (comp.baseShare + variation) / brandShare)
          };
        });
        
        rxRecords.push({
          brand_id: brandId,
          data_month: date.toISOString().split('T')[0],
          file_batch_id: `BATCH-${Date.now()}-${i}-${region}`,
          file_source: 'IQVIA TRx',
          total_rx: totalRx,
          new_rx: Math.floor(totalRx * newRxRate),
          refill_rx: Math.floor(totalRx * (1 - newRxRate)),
          market_share_percent: brandShare,
          region,
          reporting_period: date.toISOString().substring(0, 7),
          competitor_data: competitorData,
          trx_trend: i === 0 ? 0 : ((totalRx - baseRx) / baseRx) * 100,
          state_breakdown: this.generateStateBreakdown(region, totalRx),
        });
      }
    }
    
    // Batch insert with error handling
    let successCount = 0;
    for (let i = 0; i < rxRecords.length; i += 100) {
      const batch = rxRecords.slice(i, i + 100);
      const { data, error } = await supabase.from('iqvia_rx_raw').insert(batch);
      
      if (error) {
        console.error('❌ Error inserting IQVIA Rx batch:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
          batchSize: batch.length
        });
        throw error;
      } else {
        successCount += batch.length;
      }
    }
    
    console.log(`  ✓ Generated ${successCount} IQVIA Rx raw records (${regions.length} regions × ${monthsBack} months)`);
  }
  
  static generateStateBreakdown(region, totalRx) {
    const stateMap = {
      'Northeast': ['NY', 'MA', 'PA', 'NJ', 'CT'],
      'West': ['CA', 'WA', 'OR', 'NV', 'AZ'],
      'South': ['TX', 'FL', 'GA', 'NC', 'VA'],
      'Midwest': ['IL', 'OH', 'MI', 'IN', 'WI'],
      'National': ['NY', 'CA', 'TX', 'FL', 'IL']
    };
    
    const states = stateMap[region] || ['US'];
    const breakdown = {};
    let remaining = totalRx;
    
    states.forEach((state, index) => {
      if (index === states.length - 1) {
        breakdown[state] = remaining;
      } else {
        const portion = Math.floor(remaining * (0.15 + Math.random() * 0.15));
        breakdown[state] = portion;
        remaining -= portion;
      }
    });
    
    return breakdown;
  }
  
  static async generateIQVIAHCPDecileRaw(brandId, monthsBack) {
    const decileRecords = [];
    const specialties = ['Cardiology', 'Endocrinology', 'Primary Care', 'Internal Medicine'];
    
    for (let hcp = 1; hcp <= 50; hcp++) {
      for (let i = 0; i < monthsBack; i++) {
        const date = new Date(Date.now() - i * 30 * 24 * 60 * 60 * 1000);
        const decile = Math.floor(Math.random() * 10) + 1;
        
        decileRecords.push({
          brand_id: brandId,
          hcp_id: `HCP-${String(hcp).padStart(4, '0')}`,
          data_month: date.toISOString().split('T')[0],
          file_batch_id: `BATCH-HCP-${Date.now()}-${hcp}-${i}`,
          decile,
          specialty: specialties[Math.floor(Math.random() * specialties.length)],
          total_rx_count: Math.floor(Math.random() * 1000) + decile * 100,
          brand_rx_count: Math.floor(Math.random() * 500) + decile * 50,
          region: 'US',
        });
      }
    }
    
    // Batch insert
    for (let i = 0; i < decileRecords.length; i += 500) {
      const batch = decileRecords.slice(i, i + 500);
      await supabase.from('iqvia_hcp_decile_raw').insert(batch);
    }
    
    console.log(`  ✓ Generated ${decileRecords.length} IQVIA HCP decile records`);
  }
  
  static async generateSFMCJourneyRaw(brandId, monthsBack) {
    const journeyRecords = [];
    const journeyNames = [
      'Welcome Series',
      'Education Journey',
      'Engagement Campaign',
      'Re-activation Flow',
      'Post-Event Nurture'
    ];
    
    for (let i = 0; i < monthsBack * 2; i++) {
      const date = new Date(Date.now() - i * 14 * 24 * 60 * 60 * 1000);
      const entered = 3000 + Math.floor(Math.random() * 2000);
      const completed = Math.floor(entered * (0.6 + Math.random() * 0.2));
      
      journeyRecords.push({
        brand_id: brandId,
        external_journey_id: `JRN-${String(i).padStart(4, '0')}`,
        journey_name: journeyNames[i % journeyNames.length],
        measurement_date: date.toISOString().split('T')[0],
        total_entries: entered,
        total_completions: completed,
        avg_completion_time_hours: Math.floor(Math.random() * 48) + 24,
      });
    }
    
    // Batch insert
    for (let i = 0; i < journeyRecords.length; i += 100) {
      const batch = journeyRecords.slice(i, i + 100);
      await supabase.from('sfmc_journey_raw').insert(batch);
    }
    
    console.log(`  ✓ Generated ${journeyRecords.length} SFMC journey records`);
  }
  
  static async generateVeevaVaultContent(brandId, monthsBack) {
    const vaultRecords = [];
    const contentTypes = ['Slide Deck', 'Leave Behind', 'Product Monograph', 'Clinical Study', 'FAQ Document'];
    const statuses = ['approved', 'approved', 'approved', 'under_review'];
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000);
      const viewCount = Math.floor(Math.random() * 500) + 100;
      
      vaultRecords.push({
        brand_id: brandId,
        external_document_id: `VLT-${String(i).padStart(5, '0')}`,
        document_name: `${contentTypes[i % contentTypes.length]} ${i + 1}`,
        document_type: contentTypes[i % contentTypes.length],
        measurement_week: date.toISOString().split('T')[0],
        view_count: viewCount,
        share_count: Math.floor(viewCount * 0.15),
      });
    }
    
    // Batch insert
    for (let i = 0; i < vaultRecords.length; i += 100) {
      const batch = vaultRecords.slice(i, i + 100);
      await supabase.from('veeva_vault_content_raw').insert(batch);
    }
    
    console.log(`  ✓ Generated ${vaultRecords.length} Veeva Vault content records`);
  }
}
