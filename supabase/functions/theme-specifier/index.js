// ============================================

// Theme Specifier Edge Function

// Enriches user-specified theme with AI intelligence

// ============================================
 
import { serve } from "https://deno.land/std@0.168.0/http/server.js";

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';
 
const corsHeaders = {

  'Access-Control-Allow-Origin': '*',

  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',

};
 
// Removed ThemeSpecificationRequest interface
 
serve(async (req) => {

  if (req.method === 'OPTIONS') {

    return new Response(null, { headers: corsHeaders });

  }
 
  try {

    const { themeName, targetAudience, channels, occasion, brandId: requestBrandId } = await req.json(); // Type annotation removed here
 
    if (!themeName) {

      throw new Error('Theme name is required');

    }
 
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {

      throw new Error('LOVABLE_API_KEY not configured');

    }
 
    const supabaseUrl = Deno.env.get('SUPABASE_URL');

    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    const supabase = createClient(supabaseUrl, supabaseKey);
 
    const brandId = requestBrandId || '225d6bbc-c663-462f-86a8-21886bc40047'; // Biktarvy default
 
    console.log('🎨 Enriching theme:', themeName, 'for audience:', targetAudience, 'channels:', channels);
 
    // Fetch relevant intelligence for theme enrichment

    const [claimsData, visualsData, successPatternsData, brandProfile] = await Promise.all([

      supabase

        .from('clinical_claims')

        .select('*')

        .eq('brand_id', brandId)

        .eq('review_status', 'approved')

        .limit(10),

      supabase

        .from('visual_assets')

        .select('*')

        .eq('brand_id', brandId)

        .eq('mlr_approved', true)

        .limit(8),

      supabase

        .from('content_success_patterns')

        .select('*')

        .order('confidence_score', { ascending: false })

        .limit(5),

      supabase

        .from('brand_profiles')

        .select('*')

        .eq('id', brandId)

        .single()

    ]);
 
    // Build AI enrichment prompt

    const enrichmentPrompt = `You are enriching a user-specified campaign theme with supporting intelligence.

**USER'S THEME**: "${themeName}"

${targetAudience ? `**TARGET AUDIENCE**: ${targetAudience}` : ''}

${channels?.length ? `**CHANNELS**: ${channels.join(', ')}` : ''}

${occasion ? `**OCCASION**: ${occasion}` : ''}

**BRAND**: ${brandProfile.data?.brand_name || 'Biktarvy'} (${brandProfile.data?.therapeutic_area || 'HIV'})

**AVAILABLE CLAIMS** (${claimsData.data?.length || 0} available):

${(claimsData.data || []).slice(0, 5).map((c) => `- ${c.claim_text} (${c.claim_type})`).join('\n')}

**AVAILABLE VISUALS** (${visualsData.data?.length || 0} available):

${(visualsData.data || []).slice(0, 5).map((v) => `- ${v.asset_name} (${v.asset_type})`).join('\n')}

**SUCCESS PATTERNS**:

${(successPatternsData.data || []).slice(0, 3).map((p) => `- ${p.campaign_type}: +${p.avg_performance_lift}% lift`).join('\n')}

YOUR TASK:

1. Generate a compelling key message aligned with the theme "${themeName}"

2. Recommend tone (professional, educational, empowering, urgent)

3. Suggest 2-3 CTAs that match the theme intent

4. Select 3-5 relevant clinical claims from the list above

5. Select 2-3 relevant visuals

6. Predict performance based on similar success patterns (engagement rate, confidence interval)

7. Provide rationale connecting theme to evidence and performance prediction

RESPOND IN THIS JSON FORMAT:

{

  "keyMessage": "compelling message here",

  "tone": "tone descriptor",

  "cta": ["CTA 1", "CTA 2"],

  "selectedClaimIds": ["uuid1", "uuid2", "uuid3"],

  "selectedVisualIds": ["uuid1", "uuid2"],

  "performancePrediction": {

    "engagementRate": 0.XX,

    "confidenceInterval": "±X%",

    "confidenceScore": 0.XX,

    "basis": "validation across N similar campaigns"

  },

  "rationale": "why this theme + evidence + performance prediction makes sense"

}`;
 
    // Call AI to enrich theme

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {

      method: 'POST',

      headers: {

        'Authorization': `Bearer ${LOVABLE_API_KEY}`,

        'Content-Type': 'application/json',

      },

      body: JSON.stringify({

        model: 'google/gemini-2.5-flash',

        messages: [

          { role: 'system', content: 'You are a pharmaceutical marketing strategist enriching campaign themes with evidence-backed intelligence.' },

          { role: 'user', content: enrichmentPrompt }

        ],

        temperature: 0.8,

        max_tokens: 800

      })

    });
 
    if (!aiResponse.ok) {

      const errorText = await aiResponse.text();

      console.error('AI enrichment error:', aiResponse.status, errorText);

      throw new Error('Failed to enrich theme with AI');

    }
 
    const aiData = await aiResponse.json();

    const aiContent = aiData.choices[0].message.content;

    // Parse AI response (extract JSON from markdown if needed)

    let enrichedData;

    try {

      const jsonMatch = aiContent.match(/```json\n([\s\S]+?)\n```/) || aiContent.match(/\{[\s\S]+\}/);

      enrichedData = JSON.parse(jsonMatch ? jsonMatch[1] || jsonMatch[0] : aiContent);

    } catch (e) {

      console.error('Failed to parse AI JSON:', aiContent);

      throw new Error('AI response was not valid JSON');

    }
 
    // Fetch full claim and visual data for selected items

    const selectedClaims = await supabase

      .from('clinical_claims')

      .select('*')

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

        error: error instanceof Error ? error.message : 'Unknown error'

      }),

      {

        status: 500,

        headers: { ...corsHeaders, 'Content-Type': 'application/json' }

      }

    );

  }

});
 