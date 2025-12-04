
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { brandId, assetContext, dataTypes } = await req.json();

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");

    if (!lovableApiKey) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch the brand's PI document (1:1 relationship)
    const { data: piDocs, error: piError } = await supabase
      .from("prescribing_information")
      .select("*")
      .eq("brand_id", brandId)
      .eq("parsing_status", "completed")
      .single();

    if (piError || !piDocs) {
      return new Response(
        JSON.stringify({
          error: "No completed PI document found for this brand",
          recommendations: [],
        }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const parsedData = piDocs.parsed_data;

    // Build context prompt for AI
    const contextPrompt = `
You are analyzing Prescribing Information (PI) data to recommend the most relevant clinical data for a pharmaceutical marketing asset.
ASSET CONTEXT:
- Theme: ${JSON.stringify(assetContext.theme)}
- Key Message: ${assetContext.keyMessage}
- Target Audience: ${assetContext.audienceSegment}
- Asset Type: ${assetContext.assetType}
- Current Content: ${JSON.stringify(assetContext.currentContent)}
AVAILABLE PI DATA:
${dataTypes.includes("trials") ? `Clinical Trials: ${JSON.stringify(parsedData?.clinical_trials || [])}` : ""}
${dataTypes.includes("efficacy") ? `Efficacy Data: ${JSON.stringify(parsedData?.efficacy || [])}` : ""}
${dataTypes.includes("safety") ? `Safety Data: ${JSON.stringify(parsedData?.safety || [])}` : ""}
TASK:
For each data point, analyze:
1. Relevance Score (0-100): How well does this support the key message and theme?
2. Narrative Fit: How does this data strengthen the marketing narrative?
3. Suggested Usage: How should this be positioned in the content?
4. Audience Alignment: Why is this compelling for the target audience?
Return ONLY a JSON object with this structure (no markdown, no explanation):
{
  "relevantTrials": [
    {
      "studyName": "string",
      "endpoint": "string",
      "treatment": "string",
      "control": "string",
      "pValue": "string",
      "significance": "string",
      "relevanceScore": number (0-100),
      "narrativeFit": "string explaining why this matters",
      "suggestedUsage": "string with positioning advice",
      "audienceAlignment": "string explaining why target audience cares"
    }
  ],
  "relevantEfficacy": [
    {
      "metric": "string",
      "value": "string",
      "timePoint": "string",
      "comparison": "string",
      "relevanceScore": number (0-100),
      "narrativeFit": "string",
      "suggestedUsage": "string",
      "audienceAlignment": "string"
    }
  ],
  "relevantSafety": [
    {
      "adverseEvent": "string",
      "incidence": "string",
      "severity": "string",
      "comparison": "string",
      "relevanceScore": number (0-100),
      "narrativeFit": "string",
      "suggestedUsage": "string",
      "audienceAlignment": "string"
    }
  ],
  "strategicRecommendations": ["string array of top-level content strategy tips"]
}
Focus on data points with high relevance scores (>70). Prioritize data that directly supports the key message.
`;

    // Call Lovable AI
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content:
              "You are a pharmaceutical content strategist specializing in clinical data selection.",
          },
          { role: "user", content: contextPrompt },
        ],
        temperature: 0.7,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI Gateway Error:", aiResponse.status, errorText);
      throw new Error(`AI analysis failed: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.choices[0].message.content;

    // Parse AI response (handle potential markdown wrapping)
    let recommendations;
    try {
      const jsonMatch = aiContent.match(/\{\[\s\S\]*\}/);
      recommendations = JSON.parse(jsonMatch ? jsonMatch[0] : aiContent);
    } catch (parseError) {
      console.error("Failed to parse AI response:", aiContent);
      throw new Error("AI returned invalid JSON format");
    }

    return new Response(
      JSON.stringify({
        success: true,
        recommendations,
        piDocument: {
          id: piDocs.id,
          drugName: piDocs.drug_name,
          version: piDocs.version,
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Error in intelligent-pi-import:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
        recommendations: [],
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
