import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// Note: The original file imported createClient, but it was not used. It's kept for completeness if needed later.
// import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Type assertion removed. The destructured variables are inferred from req.json().
    const { content, brandId, therapeuticArea, assetType, region, preApprovedContent } = await req.json(); 
    console.log('[analyze-claims] Starting analysis', { contentLength: content?.length, brandId, therapeuticArea });

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build context-aware system prompt
    const systemPrompt = `You are an expert pharmaceutical regulatory compliance analyst specializing in MLR (Medical, Legal, Regulatory) review.

Your task is to analyze promotional content for claims that require regulatory scrutiny.

BRAND CONTEXT:
- Brand: ${brandId}
- Therapeutic Area: ${therapeuticArea}
- Asset Type: ${assetType}
- Region: ${region}

PRE-APPROVED CONTENT LIBRARY:
${preApprovedContent ? JSON.stringify(preApprovedContent, null, 2) : 'Not provided'}

CLAIM CATEGORIES TO IDENTIFY:
1. EFFICACY CLAIMS - statements about treatment effectiveness, outcomes, benefits
2. SAFETY CLAIMS - statements about side effects, tolerability, safety profile
3. COMPARATIVE CLAIMS - comparisons to other treatments or placebo
4. STATISTICAL CLAIMS - numerical data, percentages, study results
5. INDICATION CLAIMS - statements about what the drug treats
6. MECHANISM CLAIMS - statements about how the drug works
7. QUALITY OF LIFE CLAIMS - statements about patient experience improvements

For each claim found, provide:
- text: The exact claim text from the content
- type: The claim category (efficacy, safety, comparative, statistical, indication, mechanism, quality_of_life)
- severity: "critical" (requires immediate attention), "high" (must be addressed), "medium" (should be reviewed), "low" (minor concern)
- confidence: 0-100 score of how confident you are this is a claim
- reason: Detailed explanation of WHY this is a claim and regulatory concern
- requiredEvidence: Specific type of evidence/references needed (e.g., "Pivotal trial data", "FDA label", "CHMP opinion")
- suggestion: Specific actionable fix or improvement
- matchesPreApproved: true/false - does this match pre-approved language?
- preApprovedMatch: If matched, provide the MLR number and exact pre-approved text

Respond ONLY with valid JSON in this format:
{
  "claims": [
    {
      "text": "claim text here",
      "type": "efficacy",
      "severity": "high",
      "confidence": 95,
      "reason": "explanation here",
      "requiredEvidence": "specific evidence needed",
      "suggestion": "specific fix here",
      "matchesPreApproved": false,
      "preApprovedMatch": null
    }
  ],
  "summary": {
    "totalClaims": 5,
    "criticalCount": 1,
    "highCount": 2,
    "mediumCount": 1,
    "lowCount": 1,
    "overallRisk": "high"
  }
}`;

    const userPrompt = `Analyze the following ${assetType} content for regulatory claims:\n\n${content}`;

    // Call Lovable AI
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('[analyze-claims] AI gateway error:', aiResponse.status, errorText);
      throw new Error(`AI gateway error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    console.log('[analyze-claims] AI response received');
    
    // Optional chaining added in case of unexpected empty response
    const aiContent = aiData.choices[0]?.message?.content;
    if (!aiContent) {
      throw new Error("No content in AI response");
    }

    // Parse JSON response
    let analysisResult;
    try {
      // Try to extract JSON if wrapped in markdown
      const jsonMatch = aiContent.match(/```json\n([\s\S]*?)\n```/) || aiContent.match(/```\n([\s\S]*?)\n```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : aiContent;
      // analysisResult is implicitly 'any' type in JS
      analysisResult = JSON.parse(jsonStr); 
    } catch (e) {
      console.error('[analyze-claims] Failed to parse AI response:', aiContent);
      throw new Error("Failed to parse AI response as JSON");
    }

    console.log('[analyze-claims] Analysis complete', { 
      claimsFound: analysisResult.claims?.length,
      overallRisk: analysisResult.summary?.overallRisk 
    });

    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[analyze-claims] Error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      claims: [],
      summary: { totalClaims: 0, criticalCount: 0, highCount: 0, mediumCount: 0, lowCount: 0, overallRisk: 'unknown' }
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});