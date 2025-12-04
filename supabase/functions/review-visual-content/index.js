import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// NOTE: The original file contained TypeScript interface 'VisualReviewRequest'
// This interface has been removed in the JavaScript conversion.

/**
 * Calls the AI gateway to perform a specific compliance or cultural review on a visual asset.
 * @param {'cultural' | 'local-mlr' | 'global-mlr'} reviewType - The type of review to perform.
 * @param {object} request - The original request object containing visual data and context.
 * @param {string} lovableApiKey - The API key for the AI gateway.
 * @returns {Promise<object>} - A promise that resolves to the review result object.
 */
async function runAiReview(reviewType, request, lovableApiKey) {
  let visualInput = '';

  // Determine the primary visual content for the AI prompt
  if (request.visualData.imageUrl) {
    visualInput = `Analyze the image located at this URL: ${request.visualData.imageUrl}`;
  } else if (request.visualData.tableHTML) {
    visualInput = `Analyze the following table's structure and content (provided as HTML):\n${request.visualData.tableHTML}`;
  } else if (request.visualData.chartConfig) {
    visualInput = `Analyze the data/design from this chart configuration:\n${JSON.stringify(request.visualData.chartConfig, null, 2)}`;
  } else {
    throw new Error('No valid visual data provided (imageUrl, tableHTML, or chartConfig)');
  }

  const context = request.context;

  let reviewPrompt = '';

  // Build the prompt based on the review type
  switch (reviewType) {
    case 'cultural':
      reviewPrompt = `You are an expert in pharmaceutical visual communications and cultural sensitivity for the ${context.targetMarket} market.
Perform a CULTURAL SENSITIVITY REVIEW on the visual asset provided.

Focus on:
1.  **Imagery & Color**: Are there any colors, symbols, or gestures that could be misinterpreted or offensive in the ${context.targetMarket}?
2.  **Context**: Does the representation align with local cultural norms, especially regarding health and medicine?
3.  **Inclusivity**: Does it meet modern inclusivity standards?

Provide a detailed analysis in JSON format.`;
      break;

    case 'local-mlr':
      reviewPrompt = `You are a compliance officer specializing in Medical, Legal, and Regulatory (MLR) review for the ${context.regulatoryBody} in the ${context.targetMarket}.
Perform a LOCAL MLR COMPLIANCE REVIEW on the visual asset, assuming it is for a ${context.contentType} material in the ${context.therapeuticArea}.

Focus on:
1.  **Data Accuracy**: Are the numbers/claims supported and clearly attributed?
2.  **Disclaimer/Footnotes**: Are required local disclaimers (e.g., ISI, boxed warnings) present and prominent?
3.  **Claim Substantiation**: Is the claim (if any) misleading, or does it violate ${context.regulatoryBody} guidelines (e.g., FDA/EMA)?

Provide a detailed analysis in JSON format.`;
      break;

    case 'global-mlr':
      reviewPrompt = `You are a global regulatory expert.
Perform a GLOBAL MLR STANDARDS REVIEW on the visual asset. This review ensures the asset adheres to general, international best practices for pharmaceutical communications.

Focus on:
1.  **Clarity and Transparency**: Is the message unambiguous and transparent?
2.  **Unsubstantiated Claims**: Does the visual imply any unproven or off-label use?
3.  **Risk Communication**: Are risks adequately balanced with benefits, in accordance with global standards?

Provide a detailed analysis in JSON format.`;
      break;

    default:
      throw new Error(`Invalid review type: ${reviewType}`);
  }

  // Combine prompt and visual input
  const prompt = `${reviewPrompt}\n\nVisual Asset to Review:\n\n${visualInput}`;

  const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${lovableApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-pro",
      messages: [
        { role: "system", content: "You are a professional MLR visual review system. Return only valid JSON." },
        { role: "user", content: prompt }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`AI gateway error: ${response.status}`);
  }

  const aiResponse = await response.json();
  const content = aiResponse.choices?.[0]?.message?.content || "{}";
  
  // The expected JSON structure for the AI response is:
  // { score: number, issues: [{ description: string, severity: 'critical'|'major'|'minor' }], requiredAdditions: string[] }
  try {
    const result = JSON.parse(content);
    return { type: reviewType, ...result };
  } catch {
    // Return a safe, default result if JSON parsing fails
    return {
      type: reviewType,
      score: 75,
      issues: [{ description: "Failed to parse AI review response.", severity: "major" }],
      requiredAdditions: []
    };
  }
}

/**
 * Generates high-level recommendations based on the combined review issues.
 * @param {Array<object>} issues - An array of all issues found across all reviews.
 * @param {object} request - The original request object.
 * @returns {Array<string>} - A list of consolidated recommendations.
 */
function generateRecommendations(issues, request) {
  const recommendations = [];
  
  // Consolidation logic based on severity
  const criticalIssues = issues.filter((i) => i.severity === 'critical');
  if (criticalIssues.length > 0) {
    recommendations.push("Address all critical issues before proceeding to MLR review");
  }
  
  const majorIssues = issues.filter((i) => i.severity === 'major');
  if (majorIssues.length > 0) {
    recommendations.push("Resolve major compliance and cultural issues to meet regulatory standards");
  }
  
  // Context-specific recommendations
  if (request.visualType === 'table') {
    recommendations.push("Ensure all abbreviations are defined in footnotes");
    recommendations.push("Verify p-values and confidence intervals against source document");
  } else if (request.visualType === 'chart') {
    recommendations.push("Confirm chart titles accurately reflect the displayed data");
    recommendations.push("Use clear, accessible color schemes for all data points");
  }

  // Audience/Context-specific
  if (request.context.contentType === 'promotional') {
    recommendations.push(`Ensure the most serious risk information (Boxed Warning/ISI) is prominently featured, as required by ${request.context.regulatoryBody}`);
  } else {
    recommendations.push("Review content for educational balance, avoiding promotional language");
  }

  if (recommendations.length === 0) {
    recommendations.push("Visual asset appears compliant, proceed to final internal review");
  }

  // Remove duplicates and return
  return [...new Set(recommendations)];
}


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

    // Run reviews in parallel for efficiency
    const reviewPromises = request.reviewLayers.map(reviewType => 
      runAiReview(reviewType, request, lovableApiKey)
    );

    const reviewResults = await Promise.all(reviewPromises);

    // Consolidate results
    const allIssues = reviewResults.flatMap(r => r.issues || []);
    const consolidatedRecommendations = generateRecommendations(allIssues, request);
    const averageScore = reviewResults.reduce((sum, r) => sum + (r.score || 0), 0) / reviewResults.length;

    const finalResult = {
      success: true,
      overallScore: Math.round(averageScore),
      resultsByLayer: reviewResults,
      allIssues: allIssues,
      recommendations: consolidatedRecommendations,
      metadata: {
        timestamp: new Date().toISOString(),
        reviewedLayers: request.reviewLayers,
        targetMarket: request.context.targetMarket,
        regulatoryBody: request.context.regulatoryBody,
      }
    };

    return new Response(
      JSON.stringify(finalResult),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error("Visual review error:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});