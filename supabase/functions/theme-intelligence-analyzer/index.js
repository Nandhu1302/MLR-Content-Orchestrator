// ============================================
// Activity-Asset Mappings Configuration
// ============================================

const ACTIVITY_ASSET_MAPPINGS = [
  {
    activity: 'booth',
    displayName: 'Booth Presence',
    primaryAssetTypes: ['digital-sales-aid', 'leave-behind'],
    secondaryAssetTypes: ['brochure', 'one-pager'],
    description: 'Booth materials optimized for quick engagement and takeaway value',
    estimatedEngagementLift: 32,
  },
  {
    activity: 'podium',
    displayName: 'Podium Presentation',
    primaryAssetTypes: ['presentation'],
    secondaryAssetTypes: ['speaker-notes', 'handout'],
    description: 'Evidence-dense presentation materials for formal speaking slots',
    estimatedEngagementLift: 45,
  },
  {
    activity: 'workshop',
    displayName: 'Workshop Session',
    primaryAssetTypes: ['interactive-presentation', 'workbook'],
    secondaryAssetTypes: ['handout', 'case-study'],
    description: 'Interactive materials for hands-on learning sessions',
    estimatedEngagementLift: 38,
  },
  {
    activity: 'advisory_board',
    displayName: 'Advisory Board',
    primaryAssetTypes: ['clinical-briefing', 'discussion-guide'],
    secondaryAssetTypes: ['pre-read', 'summary-report'],
    description: 'Clinical discussion materials for expert advisory meetings',
    estimatedEngagementLift: 58,
  },
  {
    activity: 'lunch_symposium',
    displayName: 'Lunch Symposium',
    primaryAssetTypes: ['presentation', 'clinical-summary'],
    secondaryAssetTypes: ['leave-behind', 'follow-up-email'],
    description: 'Concise clinical presentations for meal-based educational sessions',
    estimatedEngagementLift: 41,
  },
  {
    activity: 'poster',
    displayName: 'Poster Presentation',
    primaryAssetTypes: ['scientific-poster', 'poster-summary'],
    secondaryAssetTypes: ['one-pager', 'digital-version'],
    description: 'Scientific poster materials with supporting documentation',
    estimatedEngagementLift: 28,
  },
  {
    activity: 'pre_event_email',
    displayName: 'Pre-Event Email',
    primaryAssetTypes: ['email-invitation', 'event-preview'],
    secondaryAssetTypes: ['calendar-invite', 'teaser-content'],
    description: 'Pre-event communications to drive attendance and engagement',
    estimatedEngagementLift: 34,
  },
  {
    activity: 'post_event_email',
    displayName: 'Post-Event Follow-Up',
    primaryAssetTypes: ['follow-up-email', 'event-recap'],
    secondaryAssetTypes: ['resource-links', 'survey'],
    description: 'Post-event materials to maintain momentum and drive action',
    estimatedEngagementLift: 48,
  },
  {
    activity: 'rep_visit',
    displayName: 'Rep Visit',
    primaryAssetTypes: ['digital-sales-aid', 'rep-triggered-email'],
    secondaryAssetTypes: ['leave-behind', 'sample-request'],
    description: 'Rep-enabled materials for one-on-one HCP interactions',
    estimatedEngagementLift: 52,
  },
  {
    activity: 'webinar',
    displayName: 'Virtual Event/Webinar',
    primaryAssetTypes: ['webinar-presentation', 'interactive-q-and-a'],
    secondaryAssetTypes: ['downloadable-resources', 'follow-up-survey'],
    description: 'Virtual event materials with interactive components',
    estimatedEngagementLift: 39,
  },
];

// ============================================
// Utility Functions
// ============================================

const getRecommendedAssetTypesForActivities = (activities) => {
  const primary = new Set();
  const secondary = new Set();
  let totalLift = 0;

  activities.forEach(activity => {
    const mapping = ACTIVITY_ASSET_MAPPINGS.find(m => m.activity === activity);
    if (mapping) {
      mapping.primaryAssetTypes.forEach(type => primary.add(type));
      mapping.secondaryAssetTypes.forEach(type => secondary.add(type));
      totalLift += mapping.estimatedEngagementLift;
    }
  });

  return {
    primary: Array.from(primary),
    secondary: Array.from(secondary),
    estimatedLift: activities.length > 0 ? Math.round(totalLift / activities.length) : 0,
  };
};

// ============================================
// Main Application Component
// ============================================

const App = () => {
  const [selectedActivities, setSelectedActivities] = useState([]);

  const handleActivityToggle = (activityKey) => {
    setSelectedActivities(prevSelected => {
      if (prevSelected.includes(activityKey)) {
        return prevSelected.filter(key => key !== activityKey);
      } else {
        return [...prevSelected, activityKey];
      }
    });
  };

  const results = useMemo(() => {
    return getRecommendedAssetTypesForActivities(selectedActivities);
  }, [selectedActivities]);

  const ActivityCard = ({ activity, displayName, description, estimatedEngagementLift }) => {
    const isSelected = selectedActivities.includes(activity);
    const toggleClass = isSelected
      ? 'bg-blue-600 text-white shadow-xl ring-2 ring-blue-500'
      : 'bg-white text-gray-800 hover:bg-gray-50 shadow-md border border-gray-200';

    return (
      <div
        className={`p-4 rounded-xl cursor-pointer transition duration-200 ease-in-out transform hover:scale-[1.02] ${toggleClass}`}
        onClick={() => handleActivityToggle(activity)}
      >
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold mb-1">{displayName}</h3>
          <span className={`px-3 py-1 text-xs font-bold rounded-full ${isSelected ? 'bg-white text-blue-600' : 'bg-blue-100 text-blue-600'}`}>
            Lift: +{estimatedEngagementLift}%
          </span>
        </div>
        <p className={`text-sm ${isSelected ? 'text-blue-200' : 'text-gray-500'}`}>{description}</p>
      </div>
    );
  };

  const AssetList = ({ title, assets, type }) => {
    const color = type === 'primary' ? 'bg-emerald-500' : 'bg-orange-500';
    const textColor = type === 'primary' ? 'text-emerald-800' : 'text-orange-800';

    if (assets.length === 0) {
      return null;
    }

    return (
      <div className="p-4 bg-white rounded-xl shadow-lg border border-gray-100 mb-6">
        <h3 className="text-xl font-bold mb-3 text-gray-700">{title} ({assets.length})</h3>
        <div className="flex flex-wrap gap-2">
          {assets.map(asset => (
            <span key={asset} className={`px-4 py-1 rounded-full text-sm font-medium ${color} text-white`}>
              {asset.replace(/-/g, ' ')}
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        <header className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            Activity Asset Recommender
          </h1>
          <p className="text-lg text-gray-600">Select activities to determine the optimal marketing assets and projected engagement lift.</p>
        </header>

        {/* Results Panel */}
        <div className="mb-10 p-6 bg-white rounded-2xl shadow-2xl border-t-4 border-blue-500">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Campaign Asset Recommendation
          </h2>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b pb-4">
            <p className="text-xl font-semibold text-gray-700">
              Selected Activities:
            </p>
            <span className={`text-2xl font-extrabold px-4 py-1 rounded-lg ${selectedActivities.length > 0 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
              {selectedActivities.length}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-green-50 rounded-xl shadow-inner flex flex-col justify-center items-center">
              <p className="text-sm font-medium text-green-700 mb-1">Total Assets Recommended</p>
              <p className="text-4xl font-extrabold text-green-600">
                {results.primary.length + results.secondary.length}
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-xl shadow-inner flex flex-col justify-center items-center">
              <p className="text-sm font-medium text-purple-700 mb-1">Average Estimated Lift</p>
              <p className="text-4xl font-extrabold text-purple-600">
                {results.estimatedLift}%
              </p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-xl shadow-inner flex flex-col justify-center items-center">
              <p className="text-sm font-medium text-yellow-700 mb-1">Unique Primary Assets</p>
              <p className="text-4xl font-extrabold text-yellow-600">
                {results.primary.length}
              </p>
            </div>
          </div>
        </div>

        {/* Asset Breakdown */}
        {selectedActivities.length > 0 && (
          <div className="mb-10">
            <AssetList title="Primary (Must-Have) Assets" assets={results.primary} type="primary" />
            <AssetList title="Secondary (Optional) Assets" assets={results.secondary} type="secondary" />
          </div>
        )}

        {/* Activity Selection Grid */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Available Activities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ACTIVITY_ASSET_MAPPINGS.map(mapping => (
            <ActivityCard key={mapping.activity} {...mapping} />
          ))}
        </div>

      </div>
    </div>
  );
};
  
// Removed irrelevant URLs here
  
// ============================================
// Theme Intelligence Edge Function
// ============================================
  
import { serve } from "https://deno.land/std@0.168.0/http/server.js";
  
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
  
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