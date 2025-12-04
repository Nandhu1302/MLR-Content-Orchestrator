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
    // Type assertion removed
    const { content, brandId, therapeuticArea, detectedClaims, brandReferences } = await req.json();
    console.log('[analyze-references] Starting analysis', { 
      contentLength: content?.length, 
      claimsCount: detectedClaims?.length,
      brandReferencesCount: brandReferences?.length 
    });

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert pharmaceutical scientific evidence analyst specializing in clinical reference validation.

Your task is to identify which statements require scientific citations and match them to appropriate references.

BRAND CONTEXT:
- Brand: ${brandId}
- Therapeutic Area: ${therapeuticArea}

DETECTED CLAIMS REQUIRING EVIDENCE:
${detectedClaims ? JSON.stringify(detectedClaims, null, 2) : 'None provided'}

AVAILABLE BRAND REFERENCES:
${brandReferences ? JSON.stringify(brandReferences, null, 2) : 'None provided'}

TASKS:
1. Identify ALL statements that require scientific/clinical citations
2. Detect existing citation markers in the content (e.g., [1], ^1, (Ref 1))
3. Match claims to appropriate references from the brand library
4. Identify missing citations for claims
5. Assess quality and appropriateness of existing citations

For each statement requiring a citation, provide:
- statementText: The exact text requiring citation
- claimType: Type of claim (efficacy, safety, statistical, etc.)
- currentCitation: Existing citation marker if present, or null
- requiredEvidenceType: Type of evidence needed (RCT, meta-analysis, FDA label, etc.)
- suggestedReferences: Array of reference IDs from brand library that match
- citationStatus: "missing", "incomplete", "adequate", "optimal"
- severity: "critical", "high", "medium", "low"
- recommendation: Specific action to take

Respond ONLY with valid JSON in this format:
{
  "statements": [
    {
      "statementText": "text here",
      "claimType": "efficacy",
      "currentCitation": null,
      "requiredEvidenceType": "Pivotal trial data",
      "suggestedReferences": ["ref_id_1", "ref_id_2"],
      "citationStatus": "missing",
      "severity": "critical",
      "recommendation": "Add citation to Study XYZ (MLR-2024-001) showing X% efficacy"
    }
  ],
  "existingCitations": [
    {
      "citationMarker": "[1]",
      "referencedText": "reference details",
      "isComplete": true,
      "isVerified": false,
      "issues": []
    }
  ],
  "summary": {
    "totalStatementsNeedingCitations": 10,
    "missingCitations": 5,
    "incompleteCitations": 2,
    "adequateCitations": 3,
    "citationCoveragePercent": 50,
    "criticalGaps": 2
  }
}`;

    const userPrompt = `Analyze this content for reference and citation requirements:\n\n${content}`;

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
      console.error('[analyze-references] AI gateway error:', aiResponse.status, errorText);
      throw new Error(`AI gateway error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    // Use optional chaining instead of non-null assertion
    const aiContent = aiData.choices[0]?.message?.content;
    
    let analysisResult;
    try {
      // Type casting/assertion logic removed
      const jsonMatch = aiContent.match(/```json\n([\s\S]*?)\n```/) || aiContent.match(/```\n([\s\S]*?)\n```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : aiContent;
      // analysisResult is implicitly 'any' in JS
      analysisResult = JSON.parse(jsonStr); 
    } catch (e) {
      console.error('[analyze-references] Failed to parse AI response:', aiContent);
      throw new Error("Failed to parse AI response as JSON");
    }

    console.log('[analyze-references] Analysis complete', { 
      statementsFound: analysisResult.statements?.length,
      citationCoverage: analysisResult.summary?.citationCoveragePercent 
    });

    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[analyze-references] Error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      statements: [],
      existingCitations: [],
      summary: { 
        totalStatementsNeedingCitations: 0, 
        missingCitations: 0, 
        citationCoveragePercent: 0,
        criticalGaps: 0 
      }
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});