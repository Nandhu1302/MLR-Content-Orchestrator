// ============================================
// Theme Specifier Edge Function
// Enriches user-specified theme with AI intelligence
// ============================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Removed interface ThemeSpecificationRequest as it is a TypeScript construct.

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Removed explicit type casting from the destructuring assignment
    const { themeName, targetAudience, channels, occasion, brandId: requestBrandId } = await req.json();

    if (!themeName) {
      throw new Error('Theme name is required');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // ===============================================
    // 1. Fetch Brand Intelligence
    // ===============================================
    
    // Fetch all claims for the brand (limited to 100 for context size)
    const { data: claimsData, error: claimsError } = await supabase
      .from('clinical_claims')
      .select('id, claim_text, therapeutic_area, relevance_score')
      .eq('brand_id', requestBrandId)
      .limit(100);

    if (claimsError) {
      throw claimsError;
    }

    // Fetch all visual assets for the brand (limited to 20 for context size)
    const { data: visualsData, error: visualsError } = await supabase
      .from('visual_assets')
      .select('id, asset_name, description, relevance_score')
      .eq('brand_id', requestBrandId)
      .limit(20);
    
    if (visualsError) {
      throw visualsError;
    }

    // ===============================================
    // 2. Build AI Prompt and Context
    // ===============================================

    const claimsContext = (claimsData || []).map(c => 
      `ID: ${c.id} | Relevance: ${c.relevance_score || 'N/A'} | Text: ${c.claim_text.substring(0, 100)}...`
    ).join('\n');

    const visualsContext = (visualsData || []).map(v => 
      `ID: ${v.id} | Relevance: ${v.relevance_score || 'N/A'} | Description: ${v.description.substring(0, 80)}...`
    ).join('\n');

    const systemPrompt = `You are a Theme Specification AI. Your role is to take a high-level marketing theme idea and specify it by selecting the best supporting clinical claims and visual assets, and generating high-quality copy fields (Key Message, Tone, CTA).
    
    CONTEXT:
    - Target Audience: ${targetAudience || 'HCPs'}
    - Occasion/Context: ${occasion || 'General Campaign'}
    - Theme Idea: **${themeName}**
    
    AVAILABLE CLAIMS (Use these IDs for 'selectedClaimIds'):
    ${claimsContext}
    
    AVAILABLE VISUAL ASSETS (Use these IDs for 'selectedVisualIds'):
    ${visualsContext}
    
    INSTRUCTIONS:
    1.  Synthesize the best key message and rationale for the theme based on the clinical claims.
    2.  Select 3-5 relevant 'selectedClaimIds' and 1-2 'selectedVisualIds' from the lists above.
    3.  Generate a performance prediction object (score 0-100).
    4.  Return ONLY a single JSON object conforming to the output schema. DO NOT include any text outside the JSON.

    OUTPUT SCHEMA (Strict JSON):
    {
      "keyMessage": "string",
      "tone": "string", // e.g., 'clinical', 'empowering', 'professional'
      "cta": "string", // e.g., 'Review Data', 'Download Guide'
      "performancePrediction": {
        "score": "number", // 0-100
        "basis": "string"
      },
      "rationale": "string", // Justification for the chosen message and claims
      "selectedClaimIds": ["string"], // Array of 3-5 IDs from AVAILABLE CLAIMS
      "selectedVisualIds": ["string"] // Array of 1-2 IDs from AVAILABLE VISUAL ASSETS
    }`;

    // ===============================================
    // 3. Call AI Gateway
    // ===============================================

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-pro',
        messages: [
          { role: 'system', content: systemPrompt },
        ]
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      throw new Error(`AI gateway error: ${aiResponse.status} - ${errorText}`);
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error('AI response content was empty.');
    }

    let enrichedData;
    try {
      // The AI is instructed to return only JSON, attempt to parse the content directly.
      enrichedData = JSON.parse(content);
    } catch (e) {
      console.error('Failed to parse AI response as JSON:', e);
      // Fallback: search for JSON block if AI wrapped it in markdown/text
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        enrichedData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('AI failed to return valid JSON structure.');
      }
    }

    // ===============================================
    // 4. Validate IDs and Finalize Theme
    // ===============================================

    // Fetch full data for selected items
    const selectedClaims = await supabase
      .from('clinical_claims')
      .select('*')
      // Ensure the IDs from the AI are used for the database query
      .in('id', enrichedData.selectedClaimIds || []);

    const selectedVisuals = await supabase
      .from('visual_assets')
      .select('*')
      .in('id', enrichedData.selectedVisualIds || []);

    // Build enriched ThemeOption
    const enrichedTheme = {
      id: `theme-${Date.now()}`,
      themeName,
      keyMessage: enrichedData.keyMessage,
      tone: enrichedData.tone,
      cta: enrichedData.cta,
      performancePrediction: enrichedData.performancePrediction,
      rationale: enrichedData.rationale,
      claims: selectedClaims.data || [],
      visuals: selectedVisuals.data || [],
      recommendedChannels: channels || ['email', 'website'],
      targetAudience: targetAudience || 'HCP',
      isSpecified: true
    };

    console.log('✅ Theme enriched successfully');

    return new Response(
      JSON.stringify({ 
        theme: enrichedTheme,
        message: 'Theme enriched successfully' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('❌ Error in theme-specifier:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred during theme specification',
        theme: null
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});