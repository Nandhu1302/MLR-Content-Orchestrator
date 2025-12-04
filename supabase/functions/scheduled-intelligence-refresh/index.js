import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// NOTE: The function 'triggerPublicDomainSearch' is not defined in this file.
// It is assumed to be an external function (e.g., another Supabase Edge Function) 
// called via a fetch request. The context is preserved by keeping the function call logic.
async function triggerPublicDomainSearch(brandId, supabaseServiceKey, supabaseUrl) {
  console.log(`📡 Triggering public domain search for brand ${brandId}...`);
  
  const response = await fetch(
    `${supabaseUrl}/functions/v1/public-domain-intelligence`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        brandId,
        searchScope: 'all',
        refreshType: 'scheduled'
      }),
    }
  );
  
  const responseText = await response.text();
  
  if (!response.ok) {
    console.error(`❌ Public domain search failed for brand ${brandId}. Status: ${response.status}. Response: ${responseText}`);
    throw new Error(`Public domain search function failed with status ${response.status}`);
  }

  // The external function should return JSON, we parse it here.
  try {
    return JSON.parse(responseText);
  } catch (e) {
    console.error('Failed to parse public domain search response as JSON:', e);
    return { success: false, message: 'Invalid JSON response from intelligence service' };
  }
}


/**
 * Enriches the brand's guardrails (messaging framework) with newly discovered intelligence.
 * @param {string} brandId - The ID of the brand.
 * @param {Array<object>} insights - The new intelligence insights found.
 * @param {object} supabase - The Supabase client instance.
 */
async function enrichBrandGuardrails(brandId, insights, supabase) {
  console.log(`🧠 Enriching brand guidelines with ${insights.length} insights for brand ${brandId}...`);
  
  // 1. Fetch current brand guidelines
  const { data: guidelines, error: guidelinesError } = await supabase
    .from('brand_guidelines')
    .select('messaging_framework')
    .eq('brand_id', brandId)
    .single();

  if (guidelinesError) {
    console.error('Error fetching guidelines:', guidelinesError);
    throw guidelinesError;
  }

  if (!guidelines) {
    console.log(`No guidelines found for brand ${brandId}, skipping enrichment`);
    return;
  }
  
  // 2. Extract key findings from insights
  const allFindings = insights.flatMap(i => i.key_findings || []);
  
  // 3. Merge with existing messaging framework
  const currentFramework = guidelines.messaging_framework || {};
  // Current key_pillars might be null/undefined, default to an empty array
  const currentPillars = currentFramework.key_pillars || [];
  
  // Create updated framework with new intelligence
  const updatedFramework = {
    ...currentFramework,
    // Combine existing and new pillars, ensure uniqueness, and limit the size
    key_pillars: [...new Set([...currentPillars, ...allFindings])].slice(0, 8), // Keep top 8 unique pillars
    last_enriched: new Date().toISOString(),
    // Map new insights to a simpler source list for the framework
    intelligence_sources: insights.map(i => ({
      source: i.source_name,
      type: i.source_type,
      // Use standard JS date handling
      date: new Date(i.publish_date || Date.now()).toISOString(),
      relevance: i.relevance_score
    }))
  };
  
  // 4. Update brand guidelines with enriched framework
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

  console.log(`✅ Successfully enriched guardrails for brand ${brandId}`);
}


Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    
    if (!supabaseUrl || !supabaseServiceKey) {
        throw new Error('Supabase URL or Key not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Starting scheduled intelligence refresh for all brands...');

    // 1. Get all active brands
    const { data: brands, error: brandsError } = await supabase
      .from('brand_profiles')
      .select('id, brand_name, therapeutic_area')
      .eq('is_active', true);

    if (brandsError) {
      throw new Error(`Failed to fetch brands: ${brandsError.message}`);
    }

    console.log(`Found ${brands?.length || 0} active brands to refresh`);

    const results = [];
    
    // 2. Process each brand
    for (const brand of brands || []) {
      const brandId = brand.id;
      console.log(`--- Refreshing intelligence for ${brand.brand_name} (${brandId}) ---`);
      
      try {
        // Step A: Trigger public domain search (assumed to be a fetch call to another function)
        const searchResult = await triggerPublicDomainSearch(brandId, supabaseServiceKey, supabaseUrl);

        if (!searchResult.success) {
            throw new Error(searchResult.message || 'Public domain search failed');
        }

        // Step B: Fetch the newly generated insights
        const { data: newInsights, error: insightsError } = await supabase
          .from('public_domain_insights')
          .select('*')
          .eq('brand_id', brandId)
          .eq('refresh_type', 'scheduled')
          .order('discovered_at', { ascending: false })
          .limit(10); // Only consider the top 10 most recent scheduled insights

        if (insightsError) {
          throw insightsError;
        }

        console.log(`Fetched ${newInsights?.length || 0} new insights for enrichment.`);

        // Step C: Enrich guardrails if new insights were found
        if (newInsights && newInsights.length > 0) {
          await enrichBrandGuardrails(brandId, newInsights, supabase);
        }

        results.push({
          brandId,
          brandName: brand.brand_name,
          success: true,
          insightsFound: newInsights?.length || 0,
        });

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown processing error';
        console.error(`❌ Failed to process brand ${brand.brand_name}:`, errorMessage);
        results.push({
          brandId,
          brandName: brand.brand_name,
          success: false,
          error: errorMessage,
          insightsFound: 0,
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const totalInsights = results.reduce((sum, r) => sum + (r.insightsFound || 0), 0);

    console.log(`\n🎉 Scheduled intelligence refresh finished. ${successCount}/${(brands || []).length} brands successfully processed. Total new insights: ${totalInsights}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Scheduled intelligence refresh completed. ${successCount} brands processed successfully.`,
        totalBrands: (brands || []).length,
        totalInsightsFound: totalInsights,
        results,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('CRITICAL ERROR in scheduled-intelligence service:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown critical error';

    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});