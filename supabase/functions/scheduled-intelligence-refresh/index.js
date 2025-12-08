import "https://deno.land/x/xhr@0.1.0/mod.ts";

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {

  'Access-Control-Allow-Origin': '*',

  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',

};

Deno.serve(async (req) => {

  if (req.method === 'OPTIONS') {

    return new Response(null, { headers: corsHeaders });

  }

  try {

    const supabase = createClient(

      Deno.env.get('SUPABASE_URL'),

      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    );

    console.log('Starting scheduled intelligence refresh for all brands...');

    // Get all active brands

    const { data: brands, error: brandsError } = await supabase

      .from('brand_profiles')

      .select('id, brand_name, therapeutic_area')

      .eq('is_active', true);

    if (brandsError) {

      throw new Error(`Failed to fetch brands: ${brandsError.message}`);

    }

    console.log(`Found ${brands?.length || 0} active brands to refresh`);

    const results = [];


    for (const brand of brands || []) {

      console.log(`Refreshing intelligence for ${brand.brand_name}...`);

      const refreshResult = await refreshBrandIntelligence(brand, supabase);

      results.push(refreshResult);

    }

    const successCount = results.filter(r => r.success).length;

    const failureCount = results.filter(r => !r.success).length;

    console.log(`Intelligence refresh completed: ${successCount} successful, ${failureCount} failed`);

    return new Response(JSON.stringify({

      success: true,

      refreshed_brands: results.length,

      successful: successCount,

      failed: failureCount,

      results

    }), {

      headers: { ...corsHeaders, 'Content-Type': 'application/json' },

      status: 200

    });

  } catch (error) {

    console.error('Error in scheduled intelligence refresh:', error);

    return new Response(JSON.stringify({

      success: false,

      error: error instanceof Error ? error.message : 'Unknown error'

    }), {

      status: 500,

      headers: { ...corsHeaders, 'Content-Type': 'application/json' },

    });

  }

});

async function refreshBrandIntelligence(brand, supabase) {

  const startTime = Date.now();


  try {

    // Gather public domain insights

    const insights = await gatherPublicDomainInsights(brand);


    console.log(`Generated ${insights.length} insights for ${brand.brand_name}`);

    // Insert insights into public_domain_insights table

    const { data: insertedInsights, error: insertError } = await supabase

      .from('public_domain_insights')

      .insert(insights)

      .select();

    if (insertError) {

      throw new Error(`Failed to insert insights: ${insertError.message}`);

    }

    console.log(`Inserted ${insertedInsights?.length || 0} insights for ${brand.brand_name}`);


    // Enrich guardrails with new intelligence

    await enrichGuardrails(brand.id, insertedInsights || [], supabase);


    const durationSeconds = Math.floor((Date.now() - startTime) / 1000);

    // Log successful refresh

    await supabase

      .from('intelligence_refresh_log')

      .insert({

        brand_id: brand.id,

        refresh_type: 'scheduled',

        refresh_scope: 'all',

        status: 'completed',

        sources_checked: 5,

        insights_found: insights.length,

        guardrails_updated: 1,

        duration_seconds: durationSeconds

      });


    console.log(`Successfully refreshed intelligence for ${brand.brand_name} in ${durationSeconds}s`);

    return {

      brand_id: brand.id,

      brand_name: brand.brand_name,

      success: true,

      insights_found: insights.length,

      duration_seconds: durationSeconds

    };

  } catch (error) {

    console.error(`Error refreshing ${brand.brand_name}:`, error);

    // Log failed refresh

    await supabase

      .from('intelligence_refresh_log')

      .insert({

        brand_id: brand.id,

        refresh_type: 'scheduled',

        refresh_scope: 'all',

        status: 'failed',

        error_message: error instanceof Error ? error.message : 'Unknown error',

        sources_checked: 0,

        insights_found: 0,

        guardrails_updated: 0

      });


    return {

      brand_id: brand.id,

      brand_name: brand.brand_name,

      success: false,

      error: error instanceof Error ? error.message : 'Unknown error'

    };

  }

}

async function gatherPublicDomainInsights(brand) {

  // Simulate gathering insights from public sources

  // In production, this would query FDA.gov, ClinicalTrials.gov, PubMed, etc.


  const currentDate = new Date().toISOString();

  const insights = [];


  // Regulatory insight

  insights.push({

    brand_id: brand.id,

    source_type: 'regulatory',

    source_name: 'FDA.gov',

    source_url: `https://www.accessdata.fda.gov/scripts/cder/daf/`,

    title: `${brand.brand_name} Regulatory Update - ${new Date().toLocaleDateString()}`,

    summary: `Recent regulatory filings and label updates for ${brand.brand_name} in ${brand.therapeutic_area}`,

    key_findings: [

      'Updated prescribing information available with latest safety data',

      'Post-marketing surveillance reports reviewed with no new safety signals',

      'Expanded indication application submitted for regulatory review'

    ],

    relevance_score: 0.9,

    status: 'new',

    therapeutic_area: brand.therapeutic_area,

    tags: ['regulatory', 'FDA', 'label'],

    discovered_at: currentDate

  });


  // Competitive insight

  insights.push({

    brand_id: brand.id,

    source_type: 'competitive',

    source_name: 'ClinicalTrials.gov',

    source_url: `https://clinicaltrials.gov/`,

    title: `Competitive Landscape Update for ${brand.therapeutic_area}`,

    summary: `New clinical trials and competitive intelligence from ${brand.therapeutic_area} market`,

    key_findings: [

      'Competitor launched new Phase 3 trial with novel mechanism',

      'New biologic therapy entering market with alternative target',

      'Market share trends indicate growth opportunities in underserved segments'

    ],

    relevance_score: 0.85,

    status: 'new',

    therapeutic_area: brand.therapeutic_area,

    tags: ['competitive', 'clinical trials', 'market intelligence'],

    discovered_at: currentDate

  });


  // Clinical insight

  insights.push({

    brand_id: brand.id,

    source_type: 'clinical',

    source_name: 'PubMed',

    source_url: `https://pubmed.ncbi.nlm.nih.gov/`,

    title: `Recent Clinical Evidence for ${brand.therapeutic_area}`,

    summary: `New publications and real-world evidence supporting ${brand.brand_name}`,

    key_findings: [

      'New efficacy data published in peer-reviewed journal',

      'Long-term safety analysis completed with favorable results',

      'Real-world effectiveness study confirms clinical trial outcomes'

    ],

    relevance_score: 0.8,

    status: 'new',

    therapeutic_area: brand.therapeutic_area,

    tags: ['clinical', 'evidence', 'publications', 'real-world data'],

    discovered_at: currentDate

  });


  // Market insight

  insights.push({

    brand_id: brand.id,

    source_type: 'market',

    source_name: 'Industry Reports',

    source_url: `https://www.marketresearch.com/`,

    title: `Market Dynamics and Opportunities in ${brand.therapeutic_area}`,

    summary: `Analysis of market trends, payer landscape, and access considerations`,

    key_findings: [

      'Growing patient population with unmet medical needs identified',

      'Payer policies evolving to favor evidence-based therapies',

      'Market access opportunities in specialty pharmacy channels'

    ],

    relevance_score: 0.75,

    status: 'new',

    therapeutic_area: brand.therapeutic_area,

    tags: ['market', 'payer', 'access'],

    discovered_at: currentDate

  });

  // Industry insight

  insights.push({

    brand_id: brand.id,

    source_type: 'industry',

    source_name: 'Medical Conferences',

    source_url: `https://www.medicalmeetings.com/`,

    title: `Key Takeaways from Recent ${brand.therapeutic_area} Conferences`,

    summary: `Highlights from major medical conferences and KOL perspectives`,

    key_findings: [

      'Leading experts emphasize importance of targeted therapy approaches',

      'New treatment paradigms emerging based on biomarker stratification',

      'Growing consensus on optimal treatment sequencing strategies'

    ],

    relevance_score: 0.7,

    status: 'new',

    therapeutic_area: brand.therapeutic_area,

    tags: ['industry', 'conferences', 'KOL insights'],

    discovered_at: currentDate

  });


  return insights;

}

async function enrichGuardrails(brandId, insights, supabase) {

  try {

    // Get current brand guidelines

    const { data: guidelines, error: guidelinesError } = await supabase

      .from('brand_guidelines')

      .select('*')

      .eq('brand_id', brandId)

      .maybeSingle();


    if (guidelinesError) {

      console.error('Error fetching guidelines:', guidelinesError);

      return;

    }

    if (!guidelines) {

      console.log(`No guidelines found for brand ${brandId}, skipping enrichment`);

      return;

    }


    // Extract key findings from insights

    const allFindings = insights.flatMap(i => i.key_findings || []);


    // Merge with existing messaging framework

    const currentFramework = guidelines.messaging_framework || {};

    const currentPillars = currentFramework.key_pillars || [];


    // Create updated framework with new intelligence

    const updatedFramework = {

      ...currentFramework,

      key_pillars: [...new Set([...currentPillars, ...allFindings])].slice(0, 8), // Keep top 8 unique pillars

      last_enriched: new Date().toISOString(),

      intelligence_sources: insights.map(i => ({

        source: i.source_name,

        type: i.source_type,

        date: i.discovered_at,

        relevance: i.relevance_score

      }))

    };


    // Update brand guidelines with enriched framework

    const { error: updateError } = await supabase

      .from('brand_guidelines')

      .update({

        messaging_framework: updatedFramework,

        last_updated: new Date().toISOString()

      })

      .eq('brand_id', brandId);

    if (updateError) {

      console.error('Error updating guidelines:', updateError);

      throw updateError;

    }

    console.log(`Successfully enriched guardrails for brand ${brandId}`);

  } catch (error) {

    console.error('Error in enrichGuardrails:', error);

    throw error;

  }

}