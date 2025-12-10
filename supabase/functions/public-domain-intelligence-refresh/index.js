
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();

  try {
    const { brandId, searchScope = 'all', refreshType = 'manual' } = await req.json();
    if (!brandId) {
      throw new Error('brandId is required');
    }
    console.log(`Starting intelligence refresh for brand: ${brandId}, scope: ${searchScope}`);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get brand information
    const { data: brand, error: brandError } = await supabase
      .from('brand_profiles')
      .select('brand_name, therapeutic_area, company')
      .eq('id', brandId)
      .single();
    if (brandError || !brand) {
      throw new Error(`Brand not found: ${brandError?.message}`);
    }
    console.log(`Found brand: ${brand.brand_name} (${brand.therapeutic_area})`);

    // Create refresh log entry
    const { data: logEntry, error: logError } = await supabase
      .from('intelligence_refresh_log')
      .insert({
        brand_id: brandId,
        refresh_type: refreshType,
        refresh_scope: searchScope,
        status: 'running',
        started_at: new Date().toISOString(),
      })
      .select()
      .single();
    if (logError) {
      console.error('Failed to create log entry:', logError);
    }

    // Generate search queries based on scope
    const searchQueries = generateSearchQueries(brand, searchScope);
    console.log(`Generated ${searchQueries.length} search queries`);

    let totalInsights = 0;
    let sourcesChecked = 0;

    // Process each search query
    for (const query of searchQueries) {
      try {
        sourcesChecked++;
        console.log(`Processing query [${query.sourceType}]: ${query.query}`);
        const insights = await performIntelligentSearch(query, brand);
        if (insights.length > 0) {
          console.log(`Found ${insights.length} insights from ${query.sourceName}`);
          // Store insights in database
          for (const insight of insights) {
            try {
              await supabase.from('public_domain_insights').insert({
                brand_id: brandId,
                source_type: query.sourceType,
                source_name: query.sourceName,
                source_url: insight.sourceUrl,
                title: insight.title,
                summary: insight.summary,
                full_content: insight.fullContent,
                key_findings: insight.keyFindings,
                relevance_score: insight.relevanceScore,
                publish_date: insight.publishDate ? new Date(insight.publishDate).toISOString() : null,
                therapeutic_area: brand.therapeutic_area,
                status: 'new',
              });
              totalInsights++;
            } catch (insertError) {
              console.error('Failed to insert insight:', insertError);
            }
          }
        }
      } catch (queryError) {
        console.error(`Error processing query: ${query.query}`, queryError);
      }
    }

    // Update refresh log
    const duration = Math.floor((Date.now() - startTime) / 1000);
    if (logEntry) {
      await supabase
        .from('intelligence_refresh_log')
        .update({
          status: 'completed',
          sources_checked: sourcesChecked,
          insights_found: totalInsights,
          completed_at: new Date().toISOString(),
          duration_seconds: duration,
        })
        .eq('id', logEntry.id);
    }

    console.log(`Intelligence refresh completed: ${totalInsights} insights from ${sourcesChecked} sources in ${duration}s`);

    return new Response(
      JSON.stringify({
        success: true,
        brandId,
        insightsFound: totalInsights,
        sourcesChecked,
        durationSeconds: duration,
        summary: `Discovered ${totalInsights} new insights from ${sourcesChecked} authoritative sources`,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Intelligence refresh error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function generateSearchQueries(brand, scope) {
  const queries = [];
  const brandName = brand.brand_name;
  const therapeuticArea = brand.therapeutic_area;
  const year = new Date().getFullYear();

  if (scope === 'all' || scope === 'regulatory') {
    queries.push(
      {
        query: `FDA guidance ${therapeuticArea} promotional materials ${year}`,
        sourceType: 'regulatory',
        sourceName: 'FDA.gov',
        priority: 10,
      },
      {
        query: `${brandName} FDA label updates ${year}`,
        sourceType: 'regulatory',
        sourceName: 'FDA.gov',
        priority: 9,
      },
      {
        query: `${therapeuticArea} regulatory requirements pharmaceutical marketing`,
        sourceType: 'regulatory',
        sourceName: 'Regulatory Bodies',
        priority: 8,
      }
    );
  }

  if (scope === 'all' || scope === 'competitive') {
    queries.push(
      {
        query: `${therapeuticArea} clinical trials phase 3 ${year}`,
        sourceType: 'competitive',
        sourceName: 'ClinicalTrials.gov',
        priority: 9,
      },
      {
        query: `${brandName} competitor market analysis ${year}`,
        sourceType: 'competitive',
        sourceName: 'Industry Reports',
        priority: 8,
      }
    );
  }

  if (scope === 'all' || scope === 'clinical') {
    queries.push(
      {
        query: `${therapeuticArea} clinical trial results ${year}`,
        sourceType: 'clinical',
        sourceName: 'PubMed',
        priority: 7,
      },
      {
        query: `${brandName} efficacy safety real world evidence`,
        sourceType: 'clinical',
        sourceName: 'Medical Journals',
        priority: 8,
      }
    );
  }

  if (scope === 'all' || scope === 'market') {
    queries.push(
      {
        query: `${therapeuticArea} market trends patient communication best practices`,
        sourceType: 'market',
        sourceName: 'Healthcare Publications',
        priority: 6,
      },
      {
        query: `${brandName} patient outcomes quality of life studies`,
        sourceType: 'market',
        sourceName: 'Patient Advocacy Groups',
        priority: 7,
      }
    );
  }

  // Sort by priority (higher first)
  return queries.sort((a, b) => b.priority - a.priority);
}

async function performIntelligentSearch(
  query,
  brand
) {
  const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
  if (!LOVABLE_API_KEY) {
    console.error('LOVABLE_API_KEY not configured');
    return [];
  }

  try {
    // Use Lovable AI to perform intelligent web search and analysis
    const systemPrompt = `You are a pharmaceutical industry intelligence analyst.
Search for and analyze public domain information about ${brand.brand_name} (${brand.therapeutic_area}).
Focus on authoritative sources like FDA.gov, ClinicalTrials.gov, PubMed, and reputable medical journals.
For each relevant finding, extract:
1. Title (clear and descriptive)
2. Summary (2-3 sentences capturing key points)
3. Full content (relevant details)
4. Key findings (3-5 bullet points of actionable insights)
5. Source URL
6. Relevance score (0.0-1.0)
7. Publication date if available
Return results as a JSON array of insights.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Search query: "${query.query}"\n\nFind the most relevant and recent public domain information from authoritative sources.` }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`AI API error (${response.status}):`, errorText);
      return [];
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      console.log('No content in AI response');
      return [];
    }

    // Try to parse JSON from the response
    try {
      // Look for JSON array in the response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const insights = JSON.parse(jsonMatch[0]);
        return Array.isArray(insights) ? insights.slice(0, 5) : []; // Limit to 5 insights per query
      }
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
    }

    // Fallback: Create a single insight from the response
    return [{
      title: `${query.sourceName}: ${query.sourceType} intelligence`,
      summary: content.substring(0, 250) + '...',
      fullContent: content,
      keyFindings: [
        'AI-generated insight from public domain sources',
        'Requires manual review and validation',
        'Based on recent authoritative publications',
      ],
      sourceUrl: `Search: ${query.query}`,
      relevanceScore: 0.7,
      publishDate: new Date().toISOString(),
    }];
  } catch (error) {
    console.error('Error in performIntelligentSearch:', error);
    return [];
  }
}
