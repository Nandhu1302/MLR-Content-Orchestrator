import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';
import { 
  queryBrandStatus, 
  queryCampaignHistory, 
  queryAudienceInsights,
  suggestMultiChannelApproach,
  preSelectEvidence,
  intelligenceQueryTools
} from './intelligence-tools.js';
import { detectInteractionMode, extractThemeSpecification } from './mode-detection.js';
import { getModeSpecificPrompt } from './get-mode-prompt.js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Intent-based response types

/**
 * @readonly
 * @enum {string}
 */
const ResponseIntent = {
  OPEN_QUERY: 'open_query',         // "What's going on with my brand?"
  STORY_ANALYSIS: 'story_analysis', // User shared a story
  CLARIFICATION: 'clarification',   // AI needs more info
  SUGGESTION: 'suggestion',         // AI ready to suggest
  CONFIRMATION: 'confirmation'      // Ready for generation
};

/**
 * @typedef {Object} Message
 * @property {string} id
 * @property {'user' | 'assistant'} role
 * @property {string} content
 * @property {{ label: string; value: string }[]} [quickReplies]
 */

/**
 * @typedef {Object} ConversationContext
 * @property {string} userStory
 * @property {string} [brandId]
 * @property {any} [detectedIntent]
 * @property {string} [matchedTemplateId]
 * @property {string[]} [selectedAssets]
 * @property {string} [interactionMode]
 * @property {any} [themeSpecification]
 */

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    /** @type {{ userMessage: string, conversationHistory: Message[], context: ConversationContext, isInitialAnalysis?: boolean, specifiedMode?: string }} */
    const { userMessage, conversationHistory, context, isInitialAnalysis, specifiedMode } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const supabase = createClient(supabaseUrl, supabaseKey);

    const brandId = context.brandId || '225d6bbc-c663-462f-86a8-21886bc40047';
    
    // Detect interaction mode (or use specified mode)
    const modeDetection = specifiedMode 
      ? { mode: specifiedMode, confidence: 1.0, indicators: ['User-specified mode'], suggestedApproach: '' }
      : detectInteractionMode(userMessage, { conversationHistory, context });
    
    console.log('🎯 Detected Mode:', modeDetection);
    
    // Extract theme specification if in Specification mode
    let themeSpec = null;
    if (modeDetection.mode === 'specification') {
      themeSpec = extractThemeSpecification(userMessage);
      console.log('🎨 Theme Specification:', themeSpec);
    }
    
    // Fetch brand context
    const brandContext = await fetchBrandContext(supabase, brandId);

    // Build enhanced system prompt with mode-awareness
    const systemPrompt = buildAgencyPartnerPrompt(context, brandContext, modeDetection.mode);

    // Combine all available tools
    const allTools = [...intelligenceQueryTools];

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          ...conversationHistory.map(m => ({ role: m.role, content: m.content })),
          { role: 'user', content: userMessage }
        ],
        tools: allTools,
        temperature: 0.7,
        max_tokens: 600
      })
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      throw new Error('AI API request failed');
    }

    const aiData = await aiResponse.json();
    const choice = aiData.choices[0];
    let aiMessage = choice.message.content;

    // Handle tool calls
    const toolResults = {};
    if (choice.message.tool_calls && choice.message.tool_calls.length > 0) {
      for (const toolCall of choice.message.tool_calls) {
        const toolName = toolCall.function.name;
        const toolArgs = JSON.parse(toolCall.function.arguments || '{}');
        
        console.log('AI called tool:', toolName, toolArgs);
        
        switch (toolName) {
          case 'query_brand_status':
            toolResults.brandStatus = await queryBrandStatus(supabase, brandId);
            break;
          case 'query_campaign_history':
            toolResults.campaignHistory = await queryCampaignHistory(supabase, brandId, toolArgs.campaign_name);
            break;
          case 'query_audience_insights':
            toolResults.audienceInsights = await queryAudienceInsights(supabase, brandId, toolArgs.audience_type);
            break;
          case 'suggest_multi_channel_approach':
            toolResults.multiChannelSuggestion = await suggestMultiChannelApproach(supabase, brandId, toolArgs);
            break;
          case 'pre_select_evidence':
            toolResults.preSelectedEvidence = await preSelectEvidence(supabase, brandId, toolArgs);
            break;
        }
      }
      
      // If tools were called, make second AI call to synthesize results into response
      if (Object.keys(toolResults).length > 0) {
        const synthesisResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${LOVABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [
              { role: 'system', content: systemPrompt },
              ...conversationHistory.map(m => ({ role: m.role, content: m.content })),
              { role: 'user', content: userMessage },
              { role: 'assistant', content: `I've gathered the following data:\n${JSON.stringify(toolResults, null, 2)}\n\nNow I'll synthesize this into a clear, actionable response.` }
            ],
            temperature: 0.7,
            max_tokens: 500
          })
        });
        
        if (synthesisResponse.ok) {
          const synthesisData = await synthesisResponse.json();
          aiMessage = synthesisData.choices[0].message.content;
        }
      }
    }

    const quickReplies = generateSmartQuickReplies(userMessage, context, toolResults);

    return new Response(
      JSON.stringify({
        message: aiMessage,
        quickReplies,
        toolResults,
        responseIntent: determineResponseIntent(userMessage, context),
        detectedMode: modeDetection.mode,
        modeConfidence: modeDetection.confidence,
        themeSpecification: themeSpec,
        contextUpdates: themeSpec ? { themeSpecification: themeSpec, interactionMode: modeDetection.mode } : { interactionMode: modeDetection.mode }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in enhanced story-consultant:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

/**
 * @param {string} userMessage
 * @param {ConversationContext} context
 * @returns {ResponseIntent}
 */
function determineResponseIntent(userMessage, context) {
  const lower = userMessage.toLowerCase();
  
  // Open query patterns
  if (lower.includes("what's going on") || lower.includes("how is my brand") || 
      lower.includes("how was my") || lower.includes("tell me about")) {
    return ResponseIntent.OPEN_QUERY;
  }
  
  // Story analysis
  if (context.userStory && !context.detectedIntent?.audience) {
    return ResponseIntent.STORY_ANALYSIS;
  }
  
  // Ready for suggestions
  if (context.detectedIntent?.audience && context.detectedIntent?.occasion) {
    return ResponseIntent.SUGGESTION;
  }
  
  // Needs clarification
  return ResponseIntent.CLARIFICATION;
}

/**
 * @param {any} supabase
 * @param {string} brandId
 * @returns {Promise<any>}
 */
async function fetchBrandContext(supabase, brandId) {
  const [brandProfile, audienceSegments, topClaims, successPatterns] = await Promise.all([
    supabase.from('brand_profiles').select('*').eq('id', brandId).single(),
    supabase.from('audience_segments').select('*').eq('brand_id', brandId).limit(5),
    supabase.from('clinical_claims').select('*').eq('brand_id', brandId).eq('review_status', 'approved').limit(5),
    supabase.from('content_success_patterns').select('*').order('confidence_score', { ascending: false }).limit(3)
  ]);

  return {
    brand: brandProfile.data,
    segments: audienceSegments.data || [],
    claims: topClaims.data || [],
    patterns: successPatterns.data || []
  };
}

/**
 * @param {ConversationContext} context
 * @param {any} brandContext
 * @param {string} [mode]
 * @returns {string}
 */
function buildAgencyPartnerPrompt(context, brandContext, mode) {
  const brand = brandContext.brand || {};
  const segments = brandContext.segments || {};
  
  // Mode-specific prompt additions
  const modeAddition = getModeSpecificPrompt(mode);
  
  return `You are an expert pharmaceutical marketing consultant with LIVE ACCESS to ${brand.brand_name || 'brand'} intelligence data.

${modeAddition}

YOUR CAPABILITIES:
1. **Brand Status Queries** - Answer "what's going on with my brand?" with live market data
2. **Campaign History** - Answer "how was my last campaign?" with actual performance metrics
3. **Proactive Suggestions** - When asked "what should I propose?", synthesize data into recommendations
4. **Multi-Channel Strategy** - Suggest coordinated campaigns with cross-channel lift predictions
5. **Evidence Pre-Selection** - Pre-select relevant claims, visuals, modules for target audience

BRAND GUARDRAILS (always respect):
- **Tone**: Professional, data-driven, consultative
- **Therapeutic Area**: ${brand.therapeutic_area || 'HIV'}
- **Brand**: ${brand.brand_name || 'Biktarvy'}

RESPONSE STYLE:
- ONE question at a time (when asking)
- Reference ACTUAL DATA from tool calls (not generic statements)
- Be an agency partner, not a form processor
- Proactively suggest with data backing, don't wait to be asked
- Keep responses concise (2-4 sentences typical)
- When you call tools, ALWAYS synthesize the results into actionable insights

AVAILABLE AUDIENCE SEGMENTS:
${segments.map((s) => `• ${s.segment_name}: ${(s.decision_factors || []).slice(0, 2).join(', ')}`).join('\n')}

WHEN USER ASKS OPEN QUESTIONS:
- "What's going on?" → Call query_brand_status tool, synthesize findings with specific metrics
- "How was my campaign?" → Call query_campaign_history tool, show performance vs benchmark
- "What should I propose for [audience/region]?" → Call suggest_multi_channel_approach + pre_select_evidence
- "Tell me about [audience]?" → Call query_audience_insights, share decision factors and barriers

IMPORTANT: 
- Always use tools to get real data - never make up metrics
- Synthesize tool results into conversational, actionable recommendations
- Reference specific numbers from tool results
- When suggesting multi-channel, explain the lift prediction basis
`;
}

/**
 * @param {string} userMessage
 * @param {ConversationContext} context
 * @param {any} toolResults
 * @returns {{ label: string; value: string }[]}
 */
function generateSmartQuickReplies(userMessage, context, toolResults) {
  // If we have tool results, generate context-aware replies
  if (toolResults.brandStatus) {
    return [
      { label: '📊 Campaign Performance', value: 'show campaign performance' },
      { label: '🎯 Audience Insights', value: 'show audience insights' },
      { label: '💡 Content Suggestions', value: 'suggest content' }
    ];
  }
  
  if (toolResults.audienceInsights) {
    return [
      { label: '✨ Suggest Assets', value: 'suggest matching assets' },
      { label: '📧 Multi-Channel Plan', value: 'suggest multi-channel campaign' },
      { label: '🚀 Generate Content', value: 'proceed to generation' }
    ];
  }
  
  // Default quick replies
  return [
    { label: "📊 What's going on?", value: 'show brand status' },
    { label: '💡 Suggest content', value: 'suggest for my audience' },
    { label: '🎯 Tell me about audience', value: 'show audience insights' }
  ];
}