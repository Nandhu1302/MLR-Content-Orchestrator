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
    // Type assertion removed.
    const { content, brandId, therapeuticArea, assetType, region, brandProfile } = await req.json();
    console.log('[analyze-regulatory] Starting analysis', { 
      contentLength: content?.length, 
      assetType, 
      region 
    });

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert pharmaceutical regulatory compliance analyst specializing in promotional material review.

Your task is to check content against regulatory requirements and identify compliance gaps.

BRAND CONTEXT:
- Brand: ${brandId}
- Therapeutic Area: ${therapeuticArea}
- Asset Type: ${assetType}
- Region: ${region}

BRAND PROFILE:
${brandProfile ? JSON.stringify(brandProfile, null, 2) : 'Not provided'}

REGULATORY FRAMEWORK TO CHECK:
1. FDA PROMOTIONAL MATERIAL GUIDELINES (for US):
   - Truthful and non-misleading
   - Fair balance of risks and benefits
   - Adequate disclosure of side effects
   - Appropriate use of data
   - No off-label promotion

2. REQUIRED ELEMENTS FOR ${assetType.toUpperCase()}:
   - Full prescribing information (PI) or link
   - Important Safety Information (ISI)
   - Indication statement (exact FDA-approved language)
   - Risk information prominence
   - Balance of benefit/risk presentation

3. MARKET-SPECIFIC RULES (${region}):
   - Regional regulatory requirements
   - Required disclaimers
   - Language and format standards

4. BRAND-SPECIFIC REQUIREMENTS:
   - Brand regulatory guidelines from profile
   - Product-specific warnings
   - Therapeutic area special requirements

For each compliance check, provide:
- requirement: The regulatory requirement being checked
- category: "fda_guidelines", "required_elements", "fair_balance", "indication", "isi", "disclaimers", "off_label"
- status: "passed", "warning", "failed"
- severity: "critical", "high", "medium", "low"
- finding: What was found (or not found)
- recommendation: Specific fix with exact regulatory text if applicable
- regulatoryReference: Citation to specific guideline/regulation

Respond ONLY with valid JSON in this format:
{
  "checks": [
    {
      "requirement": "FDA-approved indication statement",
      "category": "indication",
      "status": "failed",
      "severity": "critical",
      "finding": "Indication statement not found or does not match FDA label",
      "recommendation": "Include exact FDA-approved indication: '[exact text from label]'",
      "regulatoryReference": "FDA Guidance for Industry: Product Name Placement, Size, and Prominence"
    }
  ],
  "summary": {
    "totalChecks": 15,
    "passed": 10,
    "warnings": 3,
    "failed": 2,
    "criticalIssues": 1,
    "complianceScore": 67,
    "overallStatus": "needs_revision"
  },
  "missingElements": [
    {
      "element": "Important Safety Information",
      "severity": "critical",
      "requiredText": "[specific ISI text]"
    }
  ]
}`;

    const userPrompt = `Analyze this ${assetType} content for regulatory compliance:\n\n${content}`;

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
      console.error('[analyze-regulatory] AI gateway error:', aiResponse.status, errorText);
      throw new Error(`AI gateway error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.choices[0]?.message?.content;
    
    let analysisResult;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = aiContent.match(/```json\n?([\s\S]*?)\n?```/) || aiContent.match(/```\n?([\s\S]*?)\n?```/);
      let jsonStr = jsonMatch ? jsonMatch[1] : aiContent;
      
      // Clean up common AI JSON formatting issues
      jsonStr = jsonStr
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
        .replace(/"\s*:\s*'/g, '": "')  // Fix ': ' to ": "
        .replace(/'\s*,/g, '",')        // Fix ', to ",
        .replace(/'\s*}/g, '"}')        // Fix '} to "}
        .replace(/'\s*]/g, '"]')        // Fix '] to "]
        .trim();
      
      analysisResult = JSON.parse(jsonStr);
    } catch (e) {
      console.error('[analyze-regulatory] Failed to parse AI response:', aiContent);
      // Return a fallback response instead of throwing
      analysisResult = {
        checks: [{
          requirement: "Analysis Error",
          category: "fda_guidelines",
          status: "warning",
          severity: "medium",
          finding: "Unable to parse regulatory analysis response",
          recommendation: "Please retry the analysis",
          regulatoryReference: "N/A"
        }],
        summary: {
          totalChecks: 1,
          passed: 0,
          warnings: 1,
          failed: 0,
          criticalIssues: 0,
          complianceScore: 50,
          overallStatus: "needs_review"
        },
        missingElements: []
      };
    }

    console.log('[analyze-regulatory] Analysis complete', { 
      checksPerformed: analysisResult.checks?.length,
      complianceScore: analysisResult.summary?.complianceScore 
    });

    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[analyze-regulatory] Error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      checks: [],
      summary: { 
        totalChecks: 0, 
        passed: 0, 
        warnings: 0, 
        failed: 0,
        complianceScore: 0,
        overallStatus: 'error'
      },
      missingElements: []
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});