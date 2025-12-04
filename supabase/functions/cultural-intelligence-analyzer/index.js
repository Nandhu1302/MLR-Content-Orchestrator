import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { originalText, translationText, targetMarket, assetType, segmentContext } = await req.json();

    if (!translationText || !targetMarket) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: translationText and targetMarket are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const prompt = `You are a pharmaceutical localization expert analyzing translated content for ${targetMarket}.

CONTEXT:
${originalText ? `- Source (English): "${originalText}"` : ''}
- Translation for Analysis: "${translationText}"
- Asset Type: ${assetType || 'Marketing Material'}
- Segment: ${segmentContext || 'Content segment'}

ANALYSIS REQUIRED:

1. Cultural Tone & Messaging (40% weight):
   - Is the tone appropriate for ${targetMarket} medical marketing?
   - Direct vs indirect communication style check
   - Formality level assessment
   - Identify any culturally inappropriate phrases or metaphors
   - Check for culturally sensitive topics or imagery references

2. Terminology Validation (40% weight):
   - Medical terms accuracy and appropriateness
   - Brand terminology consistency
   - Identify any prohibited or restricted pharmaceutical terms
   - Flag terms that may need approval or certification
   - Check for proper transliteration of medical terms

3. Visual & Color Guidance (20% weight):
   - Color appropriateness and cultural meaning in ${targetMarket}
   - Design and imagery cultural considerations
   - Layout and spacing recommendations
   - Typography suggestions for ${targetMarket}

PROVIDE:
- Specific issues found (with exact text excerpts)
- Concrete suggestions with alternative translations
- Priority level (high/medium/low) for each issue
- Brief rationale explaining cultural or regulatory reasoning
- Overall score (0-100) and individual category scores

FORMAT: Return ONLY valid JSON with this exact structure:
{
  "overallScore": 0-100,
  "analysis": {
    "culturalTone": {
      "score": 0-100,
      "issues": [
        {
          "text": "<exact excerpt from translation>",
          "problem": "<specific issue description>",
          "suggestion": "<concrete alternative>",
          "priority": "<high|medium|low>"
        }
      ],
      "strengths": ["<positive aspect 1>", "<positive aspect 2>"]
    },
    "terminology": {
      "score": 0-100,
      "issues": [
        {
          "term": "<exact term from translation>",
          "problem": "<specific issue>",
          "approvedAlternatives": ["<alternative 1>", "<alternative 2>"],
          "priority": "<high|medium|low>"
        }
      ],
      "approvedTerms": ["<correct term 1>", "<correct term 2>"]
    },
    "visualGuidance": {
      "score": 0-100,
      "colorIssues": [
        {
          "color": "<color mentioned or implied>",
          "issue": "<cultural concern>",
          "suggestion": "<alternative recommendation>"
        }
      ],
      "imageGuidance": ["<guidance 1>", "<guidance 2>"],
      "designNotes": ["<note 1>", "<note 2>"]
    }
  },
  "actionableRecommendations": [
    {
      "id": "<unique-id>",
      "category": "<tone|terminology|visual>",
      "originalText": "<text to replace>",
      "suggestedText": "<replacement text>",
      "rationale": "<why this change>",
      "priority": "<high|medium|low>"
    }
  ]
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are a pharmaceutical localization expert. Return only valid JSON, no markdown formatting." },
          { role: "user", content: prompt }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to your Lovable AI workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI analysis failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    let analysisResult = data.choices[0].message.content;

    // Clean up markdown formatting if present
    analysisResult = analysisResult.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    try {
      const parsed = JSON.parse(analysisResult);
      return new Response(
        JSON.stringify(parsed),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } catch (parseError) {
      console.error("Failed to parse AI response:", analysisResult);
      return new Response(
        JSON.stringify({ error: "Invalid AI response format" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

  } catch (error) {
    console.error("Cultural intelligence analyzer error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});