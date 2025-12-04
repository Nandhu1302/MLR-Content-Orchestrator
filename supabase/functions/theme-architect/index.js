// ============================================
// Theme Architect Agent
// Generates theme options using AI
// ============================================

// Note: The .ts extension is kept in the import string as it is a Deno-specific convention.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Removed interface ThemeOption as it is a TypeScript construct.

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Removed type annotations for request body destructuring
    const { analysis, intelligence } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    console.log('Generating themes for:', { occasion: analysis.occasion?.type, audience: analysis.audience?.primaryType });

    // ===============================================
    // 1. Build AI Prompt Context
    // ===============================================
    
    // Build AI prompt with intelligence context
    // Removed type annotations from map callbacks
    const claimsContext = (intelligence?.claims || []).slice(0, 5).map(c => 
      `- ${c.claim_type}: ${c.claim_text?.substring(0, 150) || 'No text'}`
    ).join('\n');

    const patternsContext = (intelligence?.patterns || []).slice(0, 3).map(p =>
      `- ${p.pattern_name}: ${p.pattern_description} (+${p.avg_performance_lift}% lift)`
    ).join('\n');
    
    // The system prompt guides the AI to generate a strict JSON array of themes.
    const systemPrompt = `You are a pharma content strategist creating content themes for Biktarvy (HIV treatment).
Generate 3-4 distinct theme options based on:

STORY CONTEXT:
- Occasion: ${analysis.occasion?.type} ${analysis.occasion?.name || ''}
- Audience: ${analysis.audience?.primaryType} - ${analysis.audience?.segments?.join(', ')}
- Activities: ${analysis.activities?.identified?.join(', ')}
- Region: ${analysis.region?.identified}
- Goals: ${analysis.goals?.primary}

TOP CLINICAL CLAIMS:
${claimsContext}

SUCCESS PATTERNS:
${patternsContext}

For each theme, provide:
1. Theme name (2-4 words, compelling)
2. Key message (1 sentence, data-backed)
3. Recommended tone (professional/conversational/clinical/empowering)
4. CTA suggestion
5. Performance prediction (engagement % and confidence %)
6. Best-for assets (which asset types this theme suits)
7. Supporting claim IDs (reference from provided claims)
8. Rationale (why this theme works for this context)

Return ONLY valid JSON array of theme objects:
[
  {
    "name": "Resistance Champion",
    "keyMessage": "Zero treatment-emergent resistance at 5 years proves Biktarvy's durability",
    "tone": "clinical",
    "cta": "Review the data",
    "performancePrediction": {"engagementRate": 32, "confidence": 87, "basis": "Evidence-dense content for specialists"},
    "bestForAssets": ["podium", "detail_aid"],
    "supportingClaims": ["claim_id_1", "claim_id_2"],
    "rationale": "Specialists prioritize long-term efficacy data"
  }
]`;

    // ===============================================
    // 2. Call AI Gateway
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
          {
            role: 'system',
            content: systemPrompt
          }
        ]
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      throw new Error(`AI gateway error: ${aiResponse.status} - ${errorText}`);
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content;
    let themes = [];

    // ===============================================
    // 3. Parse and Enrich Themes
    // ===============================================

    if (!content) {
      throw new Error('AI response content was empty.');
    }
    
    try {
      // Look for the JSON array in the response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const rawThemes = JSON.parse(jsonMatch[0]);
        
        // Enrich themes with IDs and intelligence references
        themes = rawThemes.map((theme, idx) => ({ 
          id: `theme-${Date.now()}-${idx}`,
          name: theme.name,
          keyMessage: theme.keyMessage,
          tone: theme.tone || 'professional',
          cta: theme.cta || 'Learn more',
          performancePrediction: theme.performancePrediction || { engagementRate: 25, confidence: 75, basis: 'Based on similar campaigns' },
          bestForAssets: theme.bestForAssets || [],
          supportingClaims: theme.supportingClaims || [],
          // Note: The original code used intelligence?.visuals to add visuals
          recommendedVisuals: (intelligence?.visuals || []).slice(0, 2).map(v => v.id),
          rationale: theme.rationale || 'Theme aligns with audience preferences'
        }));
      } else {
        throw new Error('No JSON array found in AI response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      throw new Error(`Failed to parse AI response: ${parseError.message}`);
    }
    
    console.log(`Successfully generated ${themes.length} themes.`);

    // ===============================================
    // 4. Return Final Response
    // ===============================================
    
    return new Response(
      JSON.stringify({ 
        success: true,
        themes,
        systemPrompt // Included for debugging/context
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in theme-architect:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred during theme generation';

    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
        themes: []
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});