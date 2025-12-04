import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ============================================
// Helper Functions
// ============================================

/**
 * Generates the system prompt for the AI model based on the intelligence type.
 * @param {string} intelligenceType - The type of intelligence to analyze against (e.g., 'brand', 'market').
 * @returns {string} The system prompt.
 */
function getSystemPrompt(intelligenceType) {
  return `You are an expert intelligence analyst. Your task is to analyze the provided marketing theme and brand context against external ${intelligenceType} intelligence.
Your analysis must be thorough, identifying key implications and actionable recommendations.
Return your analysis STRICTLY as a single JSON object conforming to the required schema. DO NOT include any explanatory text, markdown outside the JSON, or commentary.`;
}

/**
 * Builds the user prompt containing the theme and brand context for the AI model.
 * @param {object} theme - The marketing theme object.
 * @param {object} brandContext - The brand context object.
 * @param {string} intelligenceType - The type of intelligence being analyzed.
 * @returns {string} The user prompt.
 */
function buildAnalysisPrompt(theme, brandContext, intelligenceType) {
  const schemaInstruction = JSON.stringify(getSchema(intelligenceType), null, 2);
  
  return `
BRAND CONTEXT:
- Brand: ${brandContext.brandName || 'N/A'}
- Therapeutic Area: ${brandContext.therapeuticArea || 'N/A'}
- Key Messaging Pillars: ${brandContext.messagingPillars?.join(', ') || 'None'}
- Top Clinical Claim: ${brandContext.topClaim?.claimText || 'None'}

THEME TO ANALYZE:
- Name: ${theme.name}
- Key Message: ${theme.keyMessage}
- Target Audience: ${theme.targetAudience || 'N/A'}

TASK: Analyze the theme's strength and weaknesses against current ${intelligenceType} data.
Ensure the output STRICTLY follows this JSON Schema:
${schemaInstruction}
`;
}

/**
 * Generates the required JSON schema for the AI response based on the intelligence type.
 * Note: This replaces the original TypeScript interface definitions.
 * @param {string} type - The type of intelligence ('brand' or 'market'/'competitive' etc.).
 * @returns {object} The JSON schema object.
 */
function getSchema(type) {
  const schemas = {
    'brand': {
      type: "object",
      properties: {
        brandFitScore: { type: "number", description: "Score from 0-100 on how well the theme fits the brand guidelines." },
        keyStrengths: { type: "array", items: { type: "string" }, description: "Strengths of the theme based on brand guidelines." },
        gaps: { type: "array", items: { type: "string" }, description: "Areas where the theme deviates or falls short of brand guidelines." },
        actionableRecommendations: { type: "array", items: { type: "string" }, description: "Specific steps to improve brand fit." }
      },
      required: ["brandFitScore", "keyStrengths", "gaps"]
    },
    // The following schema structure is based on the 'market' schema snippet
    'market': {
      type: "object",
      properties: {
        relevantTrends: {
          type: "array",
          items: {
            type: "object",
            properties: {
              trend: { type: "string" },
              relevance: { type: "string" },
              howToLeverage: { type: "string" }
            }
          }
        },
        recentDevelopments: {
          type: "array",
          items: {
            type: "object",
            properties: {
              development: { type: "string" },
              impact: { type: "string" },
              implication: { type: "string" }
            }
          }
        },
        patientSentiment: {
          type: "object",
          properties: {
            overallTone: { type: "string" },
            keyThemes: { type: "array", items: { type: "string" } },
            messagingOpportunities: { type: "array", items: { type: "string" } }
          }
        },
        competitorActivity: {
          type: "array",
          items: {
            type: "object",
            properties: {
              activity: { type: "string" },
              implication: { type: "string" },
              response: { type: "string" }
            }
          }
        }
      },
      required: ["relevantTrends", "recentDevelopments", "patientSentiment"]
    }
  };
  
  return schemas[type] || schemas.brand;
}

// ============================================
// Main Server Logic
// ============================================

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { theme, brandContext, intelligenceType } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = getSystemPrompt(intelligenceType);
    const userPrompt = buildAnalysisPrompt(theme, brandContext, intelligenceType);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        // Note: The AI is instructed via the prompt to return only JSON that matches the schema
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`AI API error (${response.status}):`, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error('AI response content was empty.');
    }

    // Attempt to parse the content which should be a JSON object
    try {
      const intelligenceData = JSON.parse(content);

      console.log(`Successfully analyzed theme against ${intelligenceType} intelligence.`);
      
      return new Response(
        JSON.stringify({ 
          success: true,
          analysis: intelligenceData,
          intelligenceType
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );

    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      throw new Error(`Failed to parse AI response: ${parseError.message}`);
    }

  } catch (error) {
    console.error('Error in theme-intelligence-analysis:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
        analysis: null
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});