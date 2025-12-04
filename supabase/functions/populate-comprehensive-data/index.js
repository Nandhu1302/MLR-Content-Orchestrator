import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Web analytics realistic data arrays
const webPages = [
  '/mechanism-of-action', '/clinical-studies', '/dosing-guide',
  '/switch-data', '/resistance-data', '/patient-resources',
  '/hcp-resources', '/safety-information', '/prescribing-info',
  '/patient-stories', '/drug-interactions', '/real-world-evidence'
];

const downloadableResources = [
  'Prescribing-Information.pdf', 'Patient-Guide.pdf', 'Dosing-Card.pdf',
  'Clinical-Summary.pdf', 'Sample-Request-Form.pdf', 'Switch-Guide.pdf',
  'Safety-Overview.pdf', 'Drug-Interactions.pdf', 'Adherence-Tips.pdf'
];

const videoContent = [
  'MOA-Video', 'Patient-Story-1', 'Patient-Story-2', 'Dosing-Tutorial',
  'HCP-Webinar', 'Safety-Overview', 'Real-World-Evidence-Video'
];

const searchTerms = [
  'dosing', 'efficacy data', 'side effects', 'drug interactions',
  'resistance data', 'switch to biktarvy', 'adherence tips',
  'clinical studies', 'patient support', 'prescribing information'
];

const ctaOptions = [
  'request-samples', 'download-pi', 'schedule-rep-visit',
  'enroll-patient', 'watch-video', 'download-guide', 'sign-up-newsletter'
];

const formTypes = [
  'sample-request', 'newsletter-signup', 'rep-visit-request',
  'patient-enrollment', 'webinar-registration', 'resource-download'
];

// NOTE: The TypeScript interface 'ProgressUpdate' has been removed.
// We will use plain JavaScript objects for updates.

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🚀 Starting comprehensive data population...');

    // Removed '!' non-null assertion operator
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { brandId, yearOffset = 0, clearExisting = false } = await req.json();

    if (!brandId) {
      return new Response(
        JSON.stringify({ error: 'brandId is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate month range for this year
    const startMonth = yearOffset * 12;
    const endMonth = startMonth + 12;
    const yearLabel = yearOffset === 0 ? 'current year' : `${yearOffset} year${yearOffset > 1 ? 's' : ''} ago`;

    console.log(`📊 Populating months ${startMonth}-${endMonth} (${yearLabel}) for brand: ${brandId}`);
    if (clearExisting && yearOffset === 0) {
      console.log('🗑️ Clearing existing data first (Year 0 only)...');
    }

    const updates = []; // Array of ProgressUpdate-like objects

    // Phase 0: Clear existing data if requested (only on first year)
    if (clearExisting && yearOffset === 0) {
      updates.push({
        phase: 'Phase 0',
        status: 'running',
        message: 'Clearing existing intelligence data...',
      });
      try {
        const tables = [
          'sfmc_campaign_raw',
          'iqvia_rx_raw',
          'iqvia_hcp_decile_raw',
          'sfmc_journey_raw',
          'social_listening_raw',
          'web_analytics_raw',
          'veeva_crm_activity_raw',
          'social_intelligence_analytics',
          'market_intelligence_analytics',
          'hcp_engagement_analytics',
        ];
        for (const table of tables) {
          const { error } = await supabase
            .from(table)
            .delete()
            .eq('brand_id', brandId);
          if (error) {
            console.error(`⚠️ Error clearing ${table}:`, error);
          } else {
            console.log(`✅ Cleared ${table}`);
          }
        }

        updates.push({
          phase: 'Phase 0',
          status: 'completed',
          message: 'Existing data cleared successfully',
        });
      } catch (error) {
        console.error('❌ Phase 0 error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        updates.push({
          phase: 'Phase 0',
          status: 'error',
          message: `Error: ${errorMessage}`,
        });
      }
    }

    // HIV-appropriate specialties
    const hivSpecialties = ['HIV Specialist', 'Infectious Disease', 'Primary Care', 'Internal Medicine'];
    // Diverse audience segments
    const hcpSegments = ['HCP-HIV Specialist', 'HCP-Infectious Disease', 'HCP-Primary Care', 'HCP-Pharmacist', 'HCP-Nurse-NP-PA'];
    const patientSegments = ['Patient-Newly Diagnosed', 'Patient-Established', 'Patient-Treatment-Experienced'];
    const caregiverSegments = ['Caregiver-Family', 'Caregiver-Professional'];
    const allAudienceSegments = [...hcpSegments, ...patientSegments, ...caregiverSegments];
    // Social platforms
    const socialPlatforms = ['Twitter/X', 'Facebook', 'Instagram', 'LinkedIn', 'Reddit', 'TikTok', 'Patient Forums'];
    // Regions
    const regions = ['US-Northeast', 'US-Southeast', 'US-Midwest', 'US-West', 'US-Southwest', 'US-Northwest'];
    
    // Phase 1: Generate Core Raw Data
    updates.push({
      phase: 'Phase 1',
      status: 'running',
      message: `Generating 12 months of core raw data for ${yearLabel} (SFMC, IQVIA, Veeva, Web, Social)...`,
    });
    try {

      // Generate SFMC Campaign Raw Data (12 months)
      console.log('📧 Generating SFMC campaign data...');
      const sfmcRecords = [];
      for (let i = startMonth; i < endMonth; i++) {
        const month = new Date();
        month.setMonth(month.getMonth() - i);
        
        const campaignsPerMonth = Math.floor(Math.random() * 11) + 10;
        for (let j = 0; j < campaignsPerMonth; j++) {
          const totalSent = Math.floor(Math.random() * 50000) + 10000;
          const totalDelivered = Math.floor(totalSent * (0.92 + Math.random() * 0.07));
          const totalOpens = Math.floor(totalDelivered * (0.15 + Math.random() * 0.25));
          const totalClicks = Math.floor(totalOpens * (0.10 + Math.random() * 0.30));
          sfmcRecords.push({
            brand_id: brandId,
            external_campaign_id: `SFMC-${month.getFullYear()}-${month.getMonth()}-${j}`,
            campaign_name: `Email Campaign ${month.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - Wave ${j + 1}`,
            send_date: new Date(month.getFullYear(), month.getMonth(), Math.floor(Math.random() * 28) + 1).toISOString(),
            total_sent: totalSent,
            total_delivered: totalDelivered,
            total_bounced: totalSent - totalDelivered,
            total_opens: totalOpens,
            unique_opens: Math.floor(totalOpens * 0.8),
            total_clicks: totalClicks,
            unique_clicks: Math.floor(totalClicks * 0.7),
            unsubscribes: Math.floor(totalSent * 0.001),
            audience_segment: allAudienceSegments[j % allAudienceSegments.length],
            device_category: ['mobile', 'desktop', 'tablet'][j % 3],
            geography: regions[j % regions.length],
          });
        }
      }
      const { error: sfmcError } = await supabase.from('sfmc_campaign_raw').insert(sfmcRecords);
      if (sfmcError) {
        console.error('❌ SFMC campaign insert error:', sfmcError);
      } else {
        console.log(`✅ Inserted ${sfmcRecords.length} SFMC campaign records`);
      }

      // Generate IQVIA Rx Raw Data (12 months)
      console.log('💊 Generating IQVIA Rx data...');
      const iqviaRxRecords = [];
      const rxBatchId = `RX-BATCH-${Date.now()}-${yearOffset}`;
      for (let i = startMonth; i < endMonth; i++) {
        const month = new Date();
        month.setMonth(month.getMonth() - i);
        
        iqviaRxRecords.push({
          file_batch_id: rxBatchId,
          brand_id: brandId,
          data_month: month.toISOString().slice(0, 10),
          total_rx: Math.floor(Math.random() * 50000) + 20000,
          new_rx: Math.floor(Math.random() * 15000) + 5000,
          refill_rx: Math.floor(Math.random() * 35000) + 15000,
          market_share_percent: Math.random() * 20 + 10,
          trx_trend: Math.random() * 20 - 5,
          nrx_trend: Math.random() * 20 - 5,
          region: 'National',
          competitor_data: {
            competitorA: Math.floor(Math.random() * 30000) + 20000,
            competitorB: Math.floor(Math.random() * 25000) + 15000,
            competitorC: Math.floor(Math.random() * 20000) + 10000,
          },
        });
      }
      const { error: iqviaRxError } = await supabase.from('iqvia_rx_raw').insert(iqviaRxRecords);
      if (iqviaRxError) {
        console.error('❌ IQVIA Rx insert error:', iqviaRxError);
      } else {
        console.log(`✅ Inserted ${iqviaRxRecords.length} IQVIA Rx records`);
      }

      // Generate IQVIA HCP Decile Raw Data (12 months per decile)
      console.log('👨‍⚕️ Generating IQVIA HCP decile data...');
      const hcpDecileRecords = [];
      const hcpBatchId = `HCP-BATCH-${Date.now()}-${yearOffset}`;
      for (let decile = 1; decile <= 10; decile++) {
        for (let i = startMonth; i < endMonth; i++) {
          const month = new Date();
          month.setMonth(month.getMonth() - i);
          
          hcpDecileRecords.push({
            file_batch_id: hcpBatchId,
            brand_id: brandId,
            data_month: month.toISOString().slice(0, 10),
            hcp_id: `HCP-${decile}-${i}`,
            decile: decile,
            total_rx_count: Math.floor(Math.random() * 10000) + 1000,
            brand_rx_count: Math.floor(Math.random() * 5000) + 500,
            competitor_rx_count: Math.floor(Math.random() * 5000) + 500,
            specialty: hivSpecialties[Math.floor(Math.random() * hivSpecialties.length)],
            region: regions[Math.floor(Math.random() * regions.length)],
          });
        }
      }
      const { error: hcpDecileError } = await supabase.from('iqvia_hcp_decile_raw').insert(hcpDecileRecords);
      if (hcpDecileError) {
        console.error('❌ IQVIA HCP Decile insert error:', hcpDecileError);
      } else {
        console.log(`✅ Inserted ${hcpDecileRecords.length} IQVIA HCP decile records`);
      }

      // Generate SFMC Journey Raw Data (12 months)
      console.log('🗺️ Generating SFMC journey data...');
      const journeyRecords = [];
      for (let i = startMonth; i < endMonth; i++) {
        const month = new Date();
        month.setMonth(month.getMonth() - i);
        
        const journeysPerMonth = Math.floor(Math.random() * 8) + 8;
        for (let j = 0; j < journeysPerMonth; j++) {
          const totalEntries = Math.floor(Math.random() * 5000) + 1000;
          const completionRate = 0.40 + Math.random() * 0.35;
          const totalCompletions = Math.floor(totalEntries * completionRate);
          const totalExits = totalEntries - totalCompletions;
          journeyRecords.push({
            brand_id: brandId,
            external_journey_id: `JRN-${month.getFullYear()}-${month.getMonth()}-${j}`,
            journey_name: `${['Patient Education', 'HCP Engagement', 'Treatment Support', 'Adherence'][j % 4]} Journey ${month.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`,
            measurement_date: new Date(month.getFullYear(), month.getMonth(), Math.floor(Math.random() * 28) + 1).toISOString().slice(0, 10),
            total_entries: totalEntries,
            total_completions: totalCompletions,
            total_exits: totalExits,
            avg_completion_time_hours: (Math.random() * 30 + 5) / 60,
          });
        }
      }
      const { error: journeyError } = await supabase.from('sfmc_journey_raw').insert(journeyRecords);
      if (journeyError) {
        console.error('❌ SFMC Journey insert error:', journeyError);
      } else {
        console.log(`✅ Inserted ${journeyRecords.length} SFMC journey records`);
      }

      // Generate Social Listening Raw Data (12 months)
      console.log('📱 Generating social listening data...');
      const socialRecords = [];
      for (let i = startMonth; i < endMonth; i++) {
        const month = new Date();
        month.setMonth(month.getMonth() - i);
        
        const postsPerMonth = Math.floor(Math.random() * 41) + 80;
        for (let j = 0; j < postsPerMonth; j++) {
          const sentimentCategory = ['positive', 'neutral', 'negative'][j % 3];
          const platform = socialPlatforms[j % socialPlatforms.length];
          
          const likes = Math.floor(Math.random() * 1000) + 50;
          const shares = Math.floor(Math.random() * 200) + 10;
          const comments = Math.floor(Math.random() * 100) + 5;
          socialRecords.push({
            brand_id: brandId,
            external_post_id: `POST-${month.getTime()}-${j}`,
            post_date: new Date(month.getFullYear(), month.getMonth(), Math.floor(Math.random() * 28) + 1).toISOString(),
            platform: platform,
            post_text: `${['Discussion about', 'Patient experiences with', 'Questions regarding', 'Reviews of'][j % 4]} ${['treatment options', 'side effects', 'efficacy', 'adherence support'][j % 4]}`,
            sentiment_category: sentimentCategory,
            sentiment_score: sentimentCategory === 'positive' ? Math.random() * 0.5 + 0.5 : sentimentCategory === 'negative' ? Math.random() * 0.5 : Math.random() * 0.5 + 0.25,
            likes: likes,
            shares: shares,
            comments: comments,
            engagement_rate: (likes + shares + comments) / 1000,
            author_type: allAudienceSegments[j % allAudienceSegments.length].split('-')[0],
            topics: ['efficacy', 'safety', 'convenience', 'cost', 'access'].slice(0, Math.floor(Math.random() * 3) + 1),
          });
        }
      }
      const { error: socialError } = await supabase.from('social_listening_raw').insert(socialRecords);
      if (socialError) {
        console.error('❌ Social Listening insert error:', socialError);
      } else {
        console.log(`✅ Inserted ${socialRecords.length} social listening records`);
      }

      // Generate Web Analytics Raw Data (12 months)
      console.log('🌐 Generating web analytics data...');
      const webRecords = [];
      for (let i = startMonth; i < endMonth; i++) {
        const month = new Date();
        month.setMonth(month.getMonth() - i);
        
        const daysInMonth = Math.floor(Math.random() * 7) + 12;
        for (let day = 1; day <= daysInMonth; day++) {
          const sessionsPerDay = Math.floor(Math.random() * 11) + 10;
          for (let session = 0; session < sessionsPerDay; session++) {
            const visitorType = allAudienceSegments[session % allAudienceSegments.length].split('-')[0];
            const timeOnPage = Math.floor(Math.random() * 300 + 30);
            
            // Generate random page journey (1-4 pages)
            const numPages = Math.floor(Math.random() * 4) + 1;
            const sessionPages = [];
            for (let p = 0; p < numPages; p++) {
              sessionPages.push(webPages[Math.floor(Math.random() * webPages.length)]);
            }

            // Generate resources downloaded (0-2 items, 30% chance)
            const downloadedResources = [];
            if (Math.random() > 0.7) {
              const numDownloads = Math.floor(Math.random() * 2) + 1;
              for (let d = 0; d < numDownloads; d++) {
                downloadedResources.push(downloadableResources[Math.floor(Math.random() * downloadableResources.length)]);
              }
            }

            // Generate videos watched (0-2, 25% chance)
            const watchedVideos = [];
            if (Math.random() > 0.75) {
              const numVideos = Math.floor(Math.random() * 2) + 1;
              for (let v = 0; v < numVideos; v++) {
                watchedVideos.push(videoContent[Math.floor(Math.random() * videoContent.length)]);
              }
            }

            // Generate search terms (0-2, 40% chance)
            const usedSearchTerms = [];
            if (Math.random() > 0.6) {
              const numTerms = Math.floor(Math.random() * 2) + 1;
              for (let t = 0; t < numTerms; t++) {
                usedSearchTerms.push(searchTerms[Math.floor(Math.random() * searchTerms.length)]);
              }
            }

            // Generate CTA clicks (0-3, 50% chance)
            const clickedCTAs = [];
            if (Math.random() > 0.5) {
              const numCTAs = Math.floor(Math.random() * 3) + 1;
              for (let c = 0; c < numCTAs; c++) {
                clickedCTAs.push(ctaOptions[Math.floor(Math.random() * ctaOptions.length)]);
              }
            }

            // Generate form submissions (0-1, 20% chance)
            const submittedForms = [];
            if (Math.random() > 0.8) {
              submittedForms.push(formTypes[Math.floor(Math.random() * formTypes.length)]);
            }
            
            webRecords.push({
              brand_id: brandId,
              session_id: `SESSION-${month.getTime()}-${day}-${session}`,
              visit_date: new Date(month.getFullYear(), month.getMonth(), day).toISOString().slice(0, 10),
              visit_timestamp: new Date(month.getFullYear(), month.getMonth(), day, Math.floor(Math.random() * 24), Math.floor(Math.random() * 60)).toISOString(),
              visitor_type: visitorType,
              page_views: sessionPages.length,
              session_duration_seconds: timeOnPage,
              time_on_page_seconds: timeOnPage,
              bounce: sessionPages.length === 1,
              device_type: ['mobile', 'desktop', 'tablet'][session % 3],
              referrer_source: ['organic', 'direct', 'referral', 'social', 'email'][session % 5],
              geography: regions[session % regions.length],
              scroll_depth: Math.floor(Math.random() * 60) + 40,
              // JSONB arrays - properly formatted
              pages_visited: sessionPages,
              resources_downloaded: downloadedResources,
              videos_watched: watchedVideos,
              search_terms_used: usedSearchTerms,
              cta_clicks: clickedCTAs,
              form_submissions: submittedForms,
              return_visitor: Math.random() > 0.6,
              visit_count: Math.floor(Math.random() * 10) + 1,
              video_completion_rate: watchedVideos.length > 0 ? Math.floor(Math.random() * 50) + 50 : null,
              patient_journey_stage: ['Awareness', 'Consideration', 'Decision', 'Post-Treatment'][session % 4],
              state: ['CA', 'TX', 'NY', 'FL', 'IL', 'PA', 'OH'][Math.floor(Math.random() * 7)],
              region: regions[session % regions.length],
            });
          }
        }
      }
      const { error: webError } = await supabase.from('web_analytics_raw').insert(webRecords);
      if (webError) {
        console.error('❌ Web Analytics insert error:', webError);
      } else {
        console.log(`✅ Inserted ${webRecords.length} web analytics records`);
      }

      // Generate Veeva CRM Activity Raw Data (12 months)
      console.log('👔 Generating Veeva CRM activity data...');
      const crmRecords = [];
      for (let i = startMonth; i < endMonth; i++) {
        const month = new Date();
        month.setMonth(month.getMonth() - i);
        
        const activitiesPerMonth = Math.floor(Math.random() * 41) + 60;
        for (let j = 0; j < activitiesPerMonth; j++) {
          const activityTypes = ['Detail', 'Sample Drop', 'Lunch & Learn', 'Conference', 'Phone Call', 'Virtual Meeting'];
          crmRecords.push({
            brand_id: brandId,
            external_activity_id: `ACT-${month.getTime()}-${j}`,
            activity_date: new Date(month.getFullYear(), month.getMonth(), Math.floor(Math.random() * 28) + 1).toISOString().slice(0, 10),
            activity_type: activityTypes[j % activityTypes.length],
            hcp_id: `HCP-${Math.floor(j / 10)}`,
            hcp_specialty: hivSpecialties[j % hivSpecialties.length],
            hcp_tier: Math.floor(Math.random() * 10) + 1,
            call_duration_minutes: Math.floor(Math.random() * 30 + 10),
            engagement_score: Math.floor(Math.random() * 10) + 1,
            next_best_action: ['Follow-up', 'Sample Request', 'Educational Material', 'Clinical Discussion'][j % 4],
            rep_territory: regions[j % regions.length].replace('US-', ''),
            rep_id: `REP-${Math.floor(j / 20)}`,
          });
        }
      }
      const { error: crmError } = await supabase.from('veeva_crm_activity_raw').insert(crmRecords);
      if (crmError) {
        console.error('❌ Veeva CRM Activity insert error:', crmError);
      } else {
        console.log(`✅ Inserted ${crmRecords.length} Veeva CRM activity records`);
      }

      updates.push({
        phase: 'Phase 1',
        status: 'completed',
        message: `Core raw data generation completed for ${yearLabel} (12 months)`,
        tablesPopulated: [
          'sfmc_campaign_raw',
          'iqvia_rx_raw',
          'iqvia_hcp_decile_raw',
          'sfmc_journey_raw',
          'social_listening_raw',
          'web_analytics_raw',
          'veeva_crm_activity_raw',
        ],
      });
    } catch (error) {
      console.error('❌ Phase 1 error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      updates.push({
        phase: 'Phase 1',
        status: 'error',
        message: `Error: ${errorMessage}`,
      });
    }

    // Phase 2: Aggregate Analytics (only for year 0)
    if (yearOffset === 0) {
      updates.push({
        phase: 'Phase 2',
        status: 'running',
        message: 'Aggregating analytics (Social, Market, HCP Engagement)...',
      });
      try {
        // Social Intelligence Analytics
        console.log('📊 Aggregating social intelligence...');
        const socialAnalytics = [];
        for (let i = 0; i < 12; i++) {
          const month = new Date();
          month.setMonth(month.getMonth() - i);
          
          socialAnalytics.push({
            brand_id: brandId,
            reporting_date: month.toISOString().slice(0, 10),
            total_mentions: Math.floor(Math.random() * 1000) + 500,
            positive_mentions: Math.floor(Math.random() * 400) + 200,
            neutral_mentions: Math.floor(Math.random() * 300) + 150,
            negative_mentions: Math.floor(Math.random() * 300) + 150,
            avg_sentiment_score: Math.random() * 0.6 + 0.2,
            engagement_rate: Math.random() * 0.1 + 0.05,
            reach_count: Math.floor(Math.random() * 50000) + 10000,
            top_topics: ['efficacy', 'safety', 'convenience'],
          });
        }

        const { error: socialError } = await supabase.from('social_intelligence_analytics').insert(socialAnalytics);
        if (socialError) {
          console.error('❌ Social analytics insert error:', socialError);
        }

        // Market Intelligence Analytics
        console.log('📈 Aggregating market intelligence...');
        const marketAnalytics = [];
        for (let i = 0; i < 12; i++) {
          const month = new Date();
          month.setMonth(month.getMonth() - i);
          
          marketAnalytics.push({
            brand_id: brandId,
            reporting_month: month.toISOString().slice(0, 7),
            total_rx: Math.floor(Math.random() * 50000) + 20000,
            market_share_percent: Math.random() * 20 + 10,
            rx_growth_rate: Math.random() * 20 - 5,
            region_growth_rate: {
              Northeast: Math.random() * 20 - 5,
              Southeast: Math.random() * 20 - 5,
              Midwest: Math.random() * 20 - 5,
              West: Math.random() * 20 - 5,
            },
            primary_competitor: 'Competitor A',
            total_hcp_prescribers: Math.floor(Math.random() * 5000) + 1000,
            top_decile_hcp_count: Math.floor(Math.random() * 500) + 100,
          });
        }

        const { error: marketError } = await supabase.from('market_intelligence_analytics').insert(marketAnalytics);
        if (marketError) {
          console.error('❌ Market analytics insert error:', marketError);
        }

        // HCP Engagement Analytics
        console.log('👨‍⚕️ Aggregating HCP engagement...');
        const hcpAnalytics = [];
        for (let i = 0; i < 12; i++) {
          const month = new Date();
          month.setMonth(month.getMonth() - i);
          
          for (const specialty of hivSpecialties) {
            for (let decile = 1; decile <= 3; decile++) {
              hcpAnalytics.push({
                brand_id: brandId,
                reporting_month: month.toISOString().slice(0, 7),
                hcp_id: `HCP-${specialty}-${decile}`,
                hcp_specialty: specialty,
                hcp_decile: decile,
                rep_calls: Math.floor(Math.random() * 5) + 1,
                email_opens: Math.floor(Math.random() * 10) + 2,
                website_visits: Math.floor(Math.random() * 20) + 5,
                prescriptions_written: Math.floor(Math.random() * 100) + 10,
                total_touchpoints: Math.floor(Math.random() * 30) + 10,
                engagement_level: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)],
              });
            }
          }
        }

        const { error: hcpError } = await supabase.from('hcp_engagement_analytics').insert(hcpAnalytics);
        if (hcpError) {
          console.error('❌ HCP analytics insert error:', hcpError);
        }

        updates.push({
          phase: 'Phase 2',
          status: 'completed',
          message: 'Analytics aggregation completed',
          tablesPopulated: [
            'social_intelligence_analytics',
            'market_intelligence_analytics',
            'hcp_engagement_analytics',
          ],
        });
      } catch (error) {
        console.error('❌ Phase 2 error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        updates.push({
          phase: 'Phase 2',
          status: 'error',
          message: `Error: ${errorMessage}`,
        });
      }
    }

    // Count final records
    const tableCounts = {};
    const tables = [
      'sfmc_campaign_raw',
      'iqvia_rx_raw',
      'iqvia_hcp_decile_raw',
      'sfmc_journey_raw',
      'social_listening_raw',
      'web_analytics_raw',
      'veeva_crm_activity_raw',
      'social_intelligence_analytics',
      'market_intelligence_analytics',
      'hcp_engagement_analytics',
    ];
    for (const table of tables) {
      const { count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true })
        .eq('brand_id', brandId);
      tableCounts[table] = count || 0;
    }

    console.log('📊 Final table counts:', tableCounts);
    console.log('✅ Comprehensive data population completed!');
    const hasErrors = updates.some(u => u.status === 'error');

    return new Response(
      JSON.stringify({
        success: !hasErrors,
        message: hasErrors 
          ? 'Data population completed with errors - check logs for details' 
          : `Comprehensive data population completed for ${yearLabel} (12 months)`,
        updates,
        tableCounts,
        monthsPopulated: 12,
        yearOffset,
      }),
      {
        status: hasErrors ? 207 : 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('❌ Error in populate-comprehensive-data:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});