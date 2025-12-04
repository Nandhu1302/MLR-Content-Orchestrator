import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Removed TypeScript interfaces: SearchQuery and InsightResult

/**
 * Searches the public domain using an AI model to extract competitive/regulatory/market insights.
 * @param {object} query - The search query object.
 * @param {string} query.query - The search string.
 * @param {'regulatory' | 'competitive' | 'clinical' | 'market' | 'industry'} query.sourceType - The type of intelligence being sought.
 * @param {string} query.sourceName - The source name (e.g., 'FDA', 'Gilead Q3', 'ASCO 2024').
 * @param {number} query.priority - The priority level (1-10).
 * @param {string} lovableApiKey - The API key for the AI gateway.
 * @returns {Promise<Array<object>>} - A promise that resolves to an array of insight objects.
 */
const searchPublicDomain = async (query, lovableApiKey) => {
  console.log(`Searching public domain for: ${query.query} (Source: ${query.sourceName})`);

  const prompt = `You are an expert pharmaceutical intelligence analyst. Your task is to perform a web search based on the query below, specifically targeting ${query.sourceType} information.

Based on the search results from authoritative public domain sources (regulatory websites, medical journals, reputable news, competitor press releases, financial reports), extract 3-5 distinct, high-value insights.

Each insight must be structured as a JSON object with the following keys:
1.  **title**: A concise, descriptive title of the finding.
2.  **summary**: A 2-3 sentence summary of the finding.
3.  **fullContent**: Detailed extraction of the finding, including key data, dates, and names.
4.  **keyFindings**: A JSON array of 3-5 bullet points summarizing the most critical takeaways.
5.  **sourceUrl**: A URL to the primary source (e.g., FDA site, journal link) or a descriptive search term if a direct link isn't available.
6.  **relevanceScore**: A score from 0.0 to 1.0 indicating relevance to ${query.sourceName}.
7.  **publishDate**: The date the information was published (YYYY-MM-DD format).

Return only a JSON array of InsightResult objects. Do not include any external text, markdown formatting (like \`\`\`), or commentary.

Query: "${query.query}"
Target Intelligence Type: ${query.sourceType}`;

  const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${lovableApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 4096,
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
    // Look for JSON array in the response (robust parsing)
    let cleanedContent = content.trim();
    if (cleanedContent.startsWith('```')) {
      const startIndex = cleanedContent.indexOf('\n') + 1;
      const endIndex = cleanedContent.lastIndexOf('```');
      if (startIndex > 0 && endIndex > startIndex) {
        cleanedContent = cleanedContent.slice(startIndex, endIndex);
      }
    }
    
    // Attempt to parse directly
    const insights = JSON.parse(cleanedContent);

    // Ensure it's an array and limit results
    if (Array.isArray(insights)) {
      return insights.slice(0, 5); // Limit to 5 insights per query
    }

    // Fallback if AI returned a single object instead of an array
    if (typeof insights === 'object' && insights !== null) {
      return [insights];
    }

  } catch (parseError) {
    console.error('Failed to parse AI response as JSON:', parseError);
    // Fallback to text summary
    return [{
      title: `${query.sourceName}: AI-Generated Summary`,
      summary: content.substring(0, 250) + '...',
      fullContent: content,
      keyFindings: [
        'AI-generated insight from public domain search',
        'Requires manual review and validation',
        'Based on recent authoritative publications'
      ],
      sourceUrl: `Search: ${query.query}`,
      relevanceScore: 0.9,
      publishDate: new Date().toISOString().slice(0, 10),
    }];
  }

  return [];
};


serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');

    if (!supabaseUrl || !supabaseServiceKey || !lovableApiKey) {
      throw new Error('Supabase or Lovable API keys not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Destructuring with default values
    const { brandId, searchScope = 'all', refreshType = 'manual' } = await req.json();

    if (!brandId) {
      throw new Error('brandId is required');
    }

    console.log(`Starting intelligence refresh for brand: ${brandId}, scope: ${searchScope}`);

    // Fetch existing brand document to build a specific search query
    const { data: brandDoc, error: brandError } = await supabase
      .from('brands')
      .select('brand_name, therapeutic_area')
      .eq('id', brandId)
      .single();

    if (brandError || !brandDoc) {
      throw new Error('Brand document not found');
    }

    const brandName = brandDoc.brand_name;
    const therapeuticArea = brandDoc.therapeutic_area;

    // Define a set of comprehensive search queries
    const searchQueries = [
      // Competitive Intelligence
      { query: `${brandName} competitor recent clinical trial data`, sourceType: 'competitive', sourceName: `${brandName} Competitors`, priority: 9 },
      { query: `${brandName} market share Q3 2025`, sourceType: 'market', sourceName: 'Market Trends', priority: 8 },
      { query: `${therapeuticArea} pipeline updates ASCO 2025`, sourceType: 'clinical', sourceName: 'ASCO 2025 Conference', priority: 7 },
      // Regulatory Intelligence
      { query: `${brandName} FDA label updates OR EMA regulatory status`, sourceType: 'regulatory', sourceName: 'Global Regulatory Bodies', priority: 10 },
      { query: `${therapeuticArea} new treatment guidelines 2025`, sourceType: 'industry', sourceName: 'Industry Guidelines', priority: 6 },
      // Clinical Intelligence
      { query: `${brandName} Phase 3 long-term safety data`, sourceType: 'clinical', sourceName: `${brandName} Clinicals`, priority: 8 },
      { query: `${therapeuticArea} resistance mechanisms recent findings`, sourceType: 'clinical', sourceName: 'Mechanism of Action', priority: 5 },
    ];

    let allInsights = [];

    // Clear existing public domain insights before refresh
    if (refreshType === 'manual' || refreshType === 'scheduled') {
      console.log(`🗑️ Clearing existing public domain insights for brand ${brandId}...`);
      const { error: deleteError } = await supabase
        .from('public_domain_insights')
        .delete()
        .eq('brand_id', brandId);
      if (deleteError) {
        console.error('❌ Error clearing old insights:', deleteError);
      } else {
        console.log('✅ Existing insights cleared.');
      }
    }

    // Process all defined queries
    for (const query of searchQueries) {
      // Only process relevant scopes
      if (searchScope !== 'all' && searchScope !== query.sourceType) {
        continue;
      }
      
      const insights = await searchPublicDomain(query, lovableApiKey);

      if (insights.length > 0) {
        // Map and prepare for database insertion
        const preparedInsights = insights.map((insight) => ({
          brand_id: brandId,
          title: insight.title,
          summary: insight.summary,
          full_content: insight.fullContent,
          key_findings: insight.keyFindings, // JSONB
          source_url: insight.sourceUrl,
          relevance_score: insight.relevanceScore,
          publish_date: insight.publishDate,
          source_type: query.sourceType,
          source_name: query.sourceName,
          refresh_type: refreshType,
          priority_score: query.priority,
        }));
        allInsights.push(...preparedInsights);
      }
    }

    let insertedCount = 0;
    if (allInsights.length > 0) {
      console.log(`💾 Inserting ${allInsights.length} new public domain insights...`);
      const { data: insertedData, error: insertError } = await supabase
        .from('public_domain_insights')
        .insert(allInsights)
        .select();

      if (insertError) {
        console.error('❌ Error inserting insights:', insertError);
        throw new Error(`Database insert failed: ${insertError.message}`);
      }
      insertedCount = insertedData?.length || 0;
      console.log(`✅ Successfully inserted ${insertedCount} insights.`);
    } else {
      console.log('⚠️ No new high-quality insights found by the AI.');
    }

    const processingTime = Date.now() - startTime;
    console.log(`⏱️ Total processing time: ${Math.floor(processingTime / 1000)}s`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Public domain intelligence refresh completed. Inserted ${insertedCount} insights.`,
        data: {
          brandId,
          insightsInserted: insertedCount,
          processingTimeSeconds: Math.floor(processingTime / 1000),
          searchScope,
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('❌ Error in public-domain intelligence service:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});