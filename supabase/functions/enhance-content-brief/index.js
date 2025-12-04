import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { context, brandId } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Non-null assertion operator (!) removed from Supabase env variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch performance data for predictions
    const { data: performanceData } = await supabase
      .from('campaign_performance_analytics')
      .select('engagement_score, conversion_rate, campaign_type')
      .eq('brand_id', brandId)
      .order('calculated_at', { ascending: false })
      .limit(20);

    const campaigns = performanceData || [];
    // No type annotation needed for reduce function, already valid JS
    const avgEngagement = campaigns.length > 0
      ? campaigns.reduce((sum, c) => sum + (c.engagement_score || 0), 0) / campaigns.length
      : 0.65;
    const avgConversion = campaigns.length > 0
      ? campaigns.reduce((sum, c) => sum + (c.conversion_rate || 0), 0) / campaigns.length
      : 0.12;

    // Build AI prompt
    const systemPrompt = `You are an expert pharmaceutical content strategist. Based on the user's content brief, generate AI-enhanced recommendations.

Context:
- Audience: ${context.detectedIntent?.audience || 'Not specified'}
- Occasion: ${context.detectedIntent?.occasion || 'Not specified'}
- Goals: ${context.detectedIntent?.goals?.join(', ') || 'Not specified'}
- Asset Types: ${context.selectedAssets?.join(', ') || 'Not specified'}

Historical Performance:
- Average engagement: ${(avgEngagement * 100).toFixed(1)}%
- Average conversion: ${(avgConversion * 100).toFixed(1)}%
- Sample size: ${campaigns.length} campaigns

Generate:
1. A compelling, audience-specific key message (1-2 sentences)
2. 3-4 specific, actionable CTA suggestions optimized for the occasion and asset types
3. Performance predictions based on the historical data`;

    // Call Lovable AI
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: 'Generate the enhanced brief recommendations' }
        ],
        tools: [{
          type: "function",
          function: {
            name: "generate_brief_recommendations",
            description: "Generate AI-enhanced content brief recommendations",
            parameters: {
              type: "object",
              properties: {
                keyMessage: {
                  type: "string",
                  description: "Compelling, audience-specific key message"
                },
                ctaSuggestions: {
                  type: "array",
                  items: { type: "string" },
                  description: "3-4 specific, actionable CTA suggestions"
                }
              },
              required: ["keyMessage", "ctaSuggestions"]
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "generate_brief_recommendations" } }
      })
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      throw new Error('AI API request failed');
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices[0].message.tool_calls?.[0];
    
    if (!toolCall) {
      throw new Error('No tool call response from AI');
    }

    const recommendations = JSON.parse(toolCall.function.arguments);

    return new Response(
      JSON.stringify({
        keyMessage: recommendations.keyMessage,
        ctaSuggestions: recommendations.ctaSuggestions || [],
        engagementPrediction: avgEngagement,
        conversionPrediction: avgConversion,
        confidenceScore: Math.min(85, 50 + (campaigns.length * 2)),
        basedOnCampaigns: campaigns.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in enhance-content-brief:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});