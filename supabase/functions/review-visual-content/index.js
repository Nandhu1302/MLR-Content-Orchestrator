
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
    const request = await req.json();
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!lovableApiKey) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    // Run reviews in parallel
    const reviewPromises = request.reviewLayers.map((layer) => {
      switch (layer) {
        case 'cultural':
          return performCulturalReview(request, lovableApiKey);
        case 'local-mlr':
        case 'global-mlr':
          return performMLRReview(request, lovableApiKey, layer);
        default:
          return Promise.resolve({ type: layer, score: 0, issues: [] });
      }
    });
    const reviews = await Promise.all(reviewPromises);

    // Calculate overall compliance score
    const overallScore = reviews.reduce((sum, r) => sum + (r.score ?? 0), 0) / reviews.length;

    // Aggregate all issues
    const allIssues = reviews.flatMap((r) => r.issues ?? []);

    return new Response(
      JSON.stringify({
        success: true,
        overallComplianceScore: Math.round(overallScore),
        reviews,
        criticalIssues: allIssues.filter((i) => i.severity === 'critical'),
        recommendations: generateRecommendations(allIssues, request),
        reviewSummary: {
          totalIssues: allIssues.length,
          criticalCount: allIssues.filter((i) => i.severity === 'critical').length,
          majorCount: allIssues.filter((i) => i.severity === 'major').length,
          minorCount: allIssues.filter((i) => i.severity === 'minor').length,
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error reviewing visual content:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

async function performCulturalReview(request, apiKey) {
  const prompt = `Analyze this ${request.visualType} for cultural appropriateness in ${request.context.targetMarket}.
Visual Type: ${request.visualType}
Target Market: ${request.context.targetMarket}
Therapeutic Area: ${request.context.therapeuticArea}
${request.visualData.tableHTML ? `Table HTML: ${request.visualData.tableHTML.substring(0, 500)}...` : ''}
Evaluate:
1. Color usage - Are colors culturally appropriate?
2. Data presentation - Is the style familiar to the market?
3. Visual hierarchy - Does it align with cultural reading patterns?
4. Terminology - Are medical terms appropriate for the market?
Return ONLY valid JSON:
{
  "score": 85,
  "issues": [
    {"issue": "Color red may have different connotations", "severity": "minor", "recommendation": "Consider using blue instead"}
  ],
  "adaptationSuggestions": ["Use local color preferences", "Adapt number formatting"]
}`;

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: "You are a cultural content review system. Return only valid JSON." },
        { role: "user", content: prompt },
      ],
    }),
  });
  if (!response.ok) {
    throw new Error(`AI gateway error: ${response.status}`);
  }
  const aiResponse = await response.json();
  const content = aiResponse.choices?.[0]?.message?.content ?? "{}";
  try {
    const result = JSON.parse(content);
    return { type: 'cultural', ...result };
  } catch {
    return {
      type: 'cultural',
      score: 70,
      issues: [],
      adaptationSuggestions: [],
    };
  }
}

async function performMLRReview(request, apiKey, reviewType) {
  const prompt = `Review this pharmaceutical ${request.visualType} for MLR compliance.
Visual Type: ${request.visualType}
Regulatory Context: ${request.context.regulatoryBody}
Content Type: ${request.context.contentType}
${request.visualData.tableHTML ? `Table HTML: ${request.visualData.tableHTML.substring(0, 500)}...` : ''}
Check for:
1. **Claims Accuracy**: Do visual representations accurately reflect data?
2. **Statistical Integrity**: Are statistics correctly displayed?
3. **Fair Balance**: Is there balanced information?
4. **Required Disclaimers**: Are necessary disclaimers present?
5. **Data Source Citations**: Are studies properly referenced?
Return ONLY valid JSON:
{
  "score": 90,
  "issues": [
    {"type": "missing-disclaimer", "severity": "major", "description": "Missing safety disclaimer", "correction": "Add ISI footer"}
  ],
  "requiredAdditions": ["Add study citation", "Include confidence intervals"]
}`;

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: "You are a pharmaceutical MLR review system. Return only valid JSON." },
        { role: "user", content: prompt },
      ],
    }),
  });
  if (!response.ok) {
    throw new Error(`AI gateway error: ${response.status}`);
  }
  const aiResponse = await response.json();
  const content = aiResponse.choices?.[0]?.message?.content ?? "{}";
  try {
    const result = JSON.parse(content);
    return { type: reviewType, ...result };
  } catch {
    return {
      type: reviewType,
      score: 75,
      issues: [],
      requiredAdditions: [],
    };
  }
}

function generateRecommendations(issues, request) {
  const recommendations = [];
  const criticalIssues = issues.filter((i) => i.severity === 'critical');
  if (criticalIssues.length > 0) {
    recommendations.push("Address all critical issues before proceeding to MLR review");
  }
  const majorIssues = issues.filter((i) => i.severity === 'major');
  if (majorIssues.length > 0) {
    recommendations.push("Resolve major compliance issues to meet regulatory standards");
  }
  if (request.visualType === 'table') {
    recommendations.push("Ensure all abbreviations are defined in footnotes");
    recommendations.push("Verify statistical significance indicators are correct");
  }
  if (request.context.contentType === 'promotional') {
    recommendations.push("Ensure fair balance between efficacy and safety information");
  }
  return recommendations;
}
