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
    // Expected inputs: { theme: any, brandContext: any, intelligenceType: string }
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
        tools: [getIntelligenceSchema(intelligenceType)],
        tool_choice: { type: "function", function: { name: "provide_intelligence" } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    
    if (!toolCall) {
      throw new Error("No tool call in AI response");
    }

    const intelligence = JSON.parse(toolCall.function.arguments);

    return new Response(
      JSON.stringify({ intelligence }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in theme-intelligence-analyzer:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

/**
 * Generates the system prompt based on the requested intelligence type.
 * @param {string} type - The intelligence type (e.g., 'brand', 'competitive').
 * @returns {string} The system prompt.
 */
function getSystemPrompt(type) {
  const prompts = {
    brand: "You are a brand strategist analyzing how a specific theme aligns with brand guidelines and voice. Provide actionable insights for optimizing this theme to strengthen brand consistency.",
    
    competitive: "You are a competitive intelligence analyst. Analyze this theme against the competitive landscape and identify unique differentiation opportunities, competitive advantages to emphasize, and messaging gaps competitors have left open.",
    
    market: "You are a market positioning expert. Analyze this theme's positioning potential, target audience resonance, market opportunities, and strategic recommendations for maximum impact.",
    
    regulatory: "You are a regulatory compliance expert in pharmaceutical marketing. Analyze this theme for compliance considerations, required disclaimers, fair balance requirements, and promotional restrictions specific to this message.",
    
    public: "You are a market intelligence analyst tracking public domain insights. Analyze current trends, recent developments, patient sentiment, and competitive activities relevant to this specific theme."
  };
  
  return prompts[type] || "You are an intelligence analyst providing strategic insights.";
}

/**
 * Builds the user prompt containing theme details and brand context for the AI analysis.
 * @param {any} theme - The theme object containing name, description, and key message.
 * @param {any} brandContext - The brand context containing brand name, therapeutic area, etc.
 * @param {string} type - The intelligence type being requested.
 * @returns {string} The formatted user prompt.
 */
function buildAnalysisPrompt(theme, brandContext, type) {
  return `
Analyze this pharmaceutical marketing theme and provide ${type} intelligence:

THEME DETAILS:
- Name: ${theme.name}
- Description: ${theme.description}
- Key Message: ${theme.key_message}
- Call to Action: ${theme.call_to_action || 'Not specified'}
- Target Audience: ${theme.target_audience || 'Not specified'}
- Category: ${theme.category}

BRAND CONTEXT:
- Brand: ${brandContext.brand_name}
- Therapeutic Area: ${brandContext.therapeutic_area}
- Indication: ${brandContext.indication || 'Not specified'}
- Market: ${brandContext.market || 'US'}

Provide specific, actionable intelligence for THIS theme - not generic brand information. Focus on:
1. How this specific theme can be optimized
2. Opportunities unique to this message
3. Risks or considerations specific to this theme
4. Concrete recommendations for implementation
`;
}

/**
 * Gets the structured JSON schema for the AI's function call based on the intelligence type.
 * This is the original TypeScript code's data structure definition, converted to JS object literal.
 * @param {string} type - The intelligence type.
 * @returns {any} The function call schema object.
 */
function getIntelligenceSchema(type) {
  const schemas = {
    brand: {
      type: "function",
      function: {
        name: "provide_intelligence",
        description: "Provide brand intelligence for the theme",
        parameters: {
          type: "object",
          properties: {
            voiceAlignment: {
              type: "object",
              properties: {
                score: { type: "number", description: "Alignment score 0-100" },
                analysis: { type: "string", description: "How well theme aligns with brand voice" },
                recommendations: { type: "array", items: { type: "string" } }
              }
            },
            messagingOptimization: {
              type: "object",
              properties: {
                strengths: { type: "array", items: { type: "string" } },
                improvements: { type: "array", items: { type: "string" } },
                alternativeApproaches: { type: "array", items: { type: "string" } }
              }
            },
            brandConsistency: {
              type: "object",
              properties: {
                consistencyScore: { type: "number" },
                gaps: { type: "array", items: { type: "string" } },
                enhancements: { type: "array", items: { type: "string" } }
              }
            }
          },
          required: ["voiceAlignment", "messagingOptimization", "brandConsistency"]
        }
      }
    },
    
    competitive: {
      type: "function",
      function: {
        name: "provide_intelligence",
        description: "Provide competitive intelligence for the theme",
        parameters: {
          type: "object",
          properties: {
            differentiationOpportunities: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  opportunity: { type: "string" },
                  impact: { type: "string", enum: ["high", "medium", "low"] },
                  rationale: { type: "string" }
                }
              }
            },
            competitiveAdvantages: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  advantage: { type: "string" },
                  howToEmphasize: { type: "string" }
                }
              }
            },
            marketGaps: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  gap: { type: "string" },
                  howToCapture: { type: "string" }
                }
              }
            },
            competitorWeaknesses: {
              type: "array",
              items: { type: "string" }
            }
          },
          required: ["differentiationOpportunities", "competitiveAdvantages", "marketGaps"]
        }
      }
    },
    
    market: {
      type: "function",
      function: {
        name: "provide_intelligence",
        description: "Provide market intelligence for the theme",
        parameters: {
          type: "object",
          properties: {
            audienceResonance: {
              type: "object",
              properties: {
                score: { type: "number" },
                primaryDrivers: { type: "array", items: { type: "string" } },
                potentialBarriers: { type: "array", items: { type: "string" } }
              }
            },
            marketOpportunities: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  opportunity: { type: "string" },
                  timing: { type: "string" },
                  actionSteps: { type: "array", items: { type: "string" } }
                }
              }
            },
            positioningRecommendations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  recommendation: { type: "string" },
                  expectedImpact: { type: "string" }
                }
              }
            },
            channelStrategy: {
              type: "object",
              properties: {
                optimal: { type: "array", items: { type: "string" } },
                rationale: { type: "string" }
              }
            }
          },
          required: ["audienceResonance", "marketOpportunities", "positioningRecommendations"]
        }
      }
    },
    
    regulatory: {
      type: "function",
      function: {
        name: "provide_intelligence",
        description: "Provide regulatory intelligence for the theme",
        parameters: {
          type: "object",
          properties: {
            complianceAssessment: {
              type: "object",
              properties: {
                riskLevel: { type: "string", enum: ["low", "medium", "high"] },
                analysis: { type: "string" },
                flaggedElements: { type: "array", items: { type: "string" } }
              }
            },
            requiredDisclaimers: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  disclaimer: { type: "string" },
                  placement: { type: "string" },
                  rationale: { type: "string" }
                }
              }
            },
            fairBalanceConsiderations: {
              type: "object",
              properties: {
                analysis: { type: "string" },
                recommendations: { type: "array", items: { type: "string" } }
              }
            },
            claimSubstantiation: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  claim: { type: "string" },
                  supportRequired: { type: "string" },
                  evidenceType: { type: "string" }
                }
              }
            }
          },
          required: ["complianceAssessment", "requiredDisclaimers", "fairBalanceConsiderations"]
        }
      }
    },
    
    public: {
      type: "function",
      function: {
        name: "provide_intelligence",
        description: "Provide public domain intelligence for the theme",
        parameters: {
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
      }
    }
  };
  
  return schemas[type] || schemas.brand;
}