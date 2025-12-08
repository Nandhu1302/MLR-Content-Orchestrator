
// ============================================
// Theme Architect Agent
// Generates theme options using AI
// ============================================
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  try {
    const { analysis, intelligence } = await req.json();
    console.log('Generating themes for:', { occasion: analysis.occasion?.type, audience: analysis.audience?.primaryType });

    // Build AI prompt with intelligence context
    const claimsContext = (intelligence?.claims ?? [])
      .slice(0, 5)
      .map((c) =>
        `- ${c.claim_type}: ${c.claim_text?.substring(0, 150) ?? 'No text'}`
      )
      .join('\n');

    const patternsContext = (intelligence?.patterns ?? [])
      .slice(0, 3)
      .map((p) =>
        `- ${p.pattern_name}: ${p.pattern_description} (+${p.avg_performance_lift}% lift)`
      )
      .join('\n');

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('LOVABLE_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-pro',
        messages: [
          {
            role: 'system',
            content: `You are a pharma content strategist creating content themes for Biktarvy (HIV treatment).
Generate 3-4 distinct theme options based on:
STORY CONTEXT:
- Occasion: ${analysis.occasion?.type} ${analysis.occasion?.name ?? ''}
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
]`
          },
          {
            role: 'user',
            content: 'Generate themes for this story context'
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!aiResponse.ok) {
      throw new Error(`AI API error: ${aiResponse.statusText}`);
    }

    const aiData = await aiResponse.json();
    console.log('AI theme response:', aiData);

    let themes;

    try {
      const content = aiData.choices[0].message.content;
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const rawThemes = JSON.parse(jsonMatch[0]);

        // Enrich themes with IDs and full intelligence references
        themes = rawThemes.map((theme, idx) => ({
          id: `theme-${Date.now()}-${idx}`,
          name: theme.name,
          keyMessage: theme.keyMessage,
          tone: theme.tone ?? 'professional',
          cta: theme.cta ?? 'Learn more',
          performancePrediction: theme.performancePrediction ?? {
            engagementRate: 25,
            confidence: 75,
            basis: 'Based on similar campaigns',
          },
          bestForAssets: theme.bestForAssets ?? [],
          supportingClaims: theme.supportingClaims ?? [],
          recommendedVisuals: (intelligence?.visuals ?? []).slice(0, 2).map((v) => v.id),
          rationale: theme.rationale ?? 'Theme aligns with audience preferences',
        }));
      } else {
        throw new Error('No JSON array found in AI response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI themes:', parseError);
      // Fallback: generate basic themes
      themes = generateFallbackThemes(analysis, intelligence);
    }

    console.log('Generated themes:', themes.length);

    return new Response(
      JSON.stringify({ themes }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Theme generation error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Fallback theme generation
function generateFallbackThemes(analysis, intelligence) {
  const audienceType = analysis.audience?.primaryType ?? 'HCP';
  const occasionType = analysis.occasion?.type ?? 'conference';

  const themes = [];

  // Theme 1: Evidence-focused
  themes.push({
    id: `theme-${Date.now()}-0`,
    name: 'Clinical Evidence Leader',
    keyMessage: 'Biktarvy delivers proven efficacy backed by robust clinical data',
    tone: 'clinical',
    cta: 'Review the evidence',
    performancePrediction: {
      engagementRate: 28,
      confidence: 82,
      basis: 'Evidence-focused content for HCP audiences',
    },
    bestForAssets: ['podium', 'detail_aid', 'clinical_briefing'],
    supportingClaims: (intelligence?.claims ?? []).slice(0, 3).map((c) => c.id),
    recommendedVisuals: (intelligence?.visuals ?? []).slice(0, 2).map((v) => v.id),
    rationale: `${audienceType} audiences respond well to data-driven messaging at ${occasionType} events`,
  });

  // Theme 2: Patient-benefit focused
  themes.push({
    id: `theme-${Date.now()}-1`,
    name: 'Simplified Care Solution',
    keyMessage: 'One pill, once daily with high barrier to resistance',
    tone: 'professional',
    cta: 'Discover simplicity',
    performancePrediction: {
      engagementRate: 32,
      confidence: 78,
      basis: 'Simplicity messaging shows consistent engagement',
    },
    bestForAssets: ['email', 'leave_behind', 'brochure'],
    supportingClaims: (intelligence?.claims ?? []).slice(1, 4).map((c) => c.id),
    recommendedVisuals: (intelligence?.visuals ?? []).slice(1, 3).map((v) => v.id),
    rationale: 'Convenience and simplicity resonate across audience types',
  });

  // Theme 3: Durability focused
  if ((intelligence?.patterns ?? []).length > 0) {
    themes.push({
      id: `theme-${Date.now()}-2`,
      name: 'Long-Term Durability',
      keyMessage: 'Five years of proven durability and sustained viral suppression',
      tone: 'clinical',
      cta: 'See long-term data',
      performancePrediction: {
        engagementRate: 26,
        confidence: 85,
        basis: `Pattern: ${intelligence.patterns[0].pattern_name}`,
      },
      bestForAssets: ['presentation', 'detail_aid', 'scientific_poster'],
      supportingClaims: (intelligence?.claims ?? []).slice(2, 5).map((c) => c.id),
      recommendedVisuals: (intelligence?.visuals ?? []).slice(0, 2).map((v) => v.id),
      rationale: 'Long-term data builds confidence in treatment durability',
    });
  }

  return themes;
}