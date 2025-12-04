import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';
import { 
  queryBrandStatus, 
  queryCampaignHistory, 
  queryAudienceInsights,
  suggestMultiChannelApproach,
  preSelectEvidence,
  intelligenceQueryTools
} from './intelligence-tools.ts'; // Preserving original module path
import { detectInteractionMode, extractThemeSpecification } from './mode-detection.ts'; // Preserving original module path
import { getModeSpecificPrompt } from './get-mode-prompt.ts'; // Preserving original module path

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Converted TypeScript enum ResponseIntent to a JavaScript constant object
const ResponseIntent = {
  OPEN_QUERY: 'open_query',         // "What's going on with my brand?"
  STORY_ANALYSIS: 'story_analysis', // User shared a story
  CLARIFICATION: 'clarification',   // AI needs more info
  SUGGESTION: 'suggestion',         // AI ready to suggest
  CONFIRMATION: 'confirmation'      // Ready for generation
};

// NOTE: TypeScript interfaces Message and ConversationContext have been removed.

/**
 * Generates the system prompt for the AI model based on the current conversation context.
 * @param {object} context - The current conversation context object.
 * @returns {string} - The complete system prompt string.
 */
function SYSTEM_PROMPT(context) {
  const brandName = context.brand.brand_name || 'the brand';
  const tools = intelligenceQueryTools.map(t => t.name).join(', ');

  return `You are a sophisticated pharmaceutical marketing and intelligence agent named "Lovable AI". Your goal is to provide actionable, data-driven recommendations to the user based on the brand context and the available tools.

BRAND CONTEXT:
- Brand Name: ${brandName}
- Therapeutic Area: ${context.brand.therapeutic_area || 'Oncology'}
- Current MLR Status: ${context.brand.mlr_status || 'Green'}
- Document Count: ${context.brand.document_count || 0}
- Active Claims: ${context.brand.active_claims || 0}
- Recent Campaigns: ${context.brand.recent_campaigns || 0}

AVAILABLE TOOLS:
You have access to the following data querying tools: ${tools}.

CONVERSATION HISTORY:
${context.history.map(msg => `${msg.role.toUpperCase()}: ${msg.content}`).join('\n')}

INSTRUCTIONS:
1.  **Analyze User Intent**: Determine the user's current goal (e.g., open query, story sharing, confirmation).
2.  **Tool Selection**: Based on the user's message and history, select the MOST RELEVANT tool(s).
    - If the user asks for a general update ("What's going on?"), call **query_brand_status**.
    - If the user asks for audience behavior/needs, call **query_audience_insights**.
    - If the user asks for content suggestions/campaign ideas, call **suggest_multi_channel_approach**.
    - If the user provides a comprehensive request or "story," classify the intent as **story_analysis** and use the **story_analyst** tool (assumed to be available if context needs it).
3.  **Synthesize Results**: After calling tools, synthesize the data into a concise, conversational, and actionable response. Do not just output the raw data.
4.  **Tone**: Professional, confident, and data-backed. Always provide a clear next step or suggestion.

EXAMPLE RESPONSES (do not use markdown for tool calls):
- "What's going on with Biktarvy?" → Call query_brand_status
- "How do I get more NRx in the Midwest?" → Call query_audience_insights + pre_select_evidence + suggest_multi_channel_approach
- "I need a campaign for the ASCO congress in the Southeast region" → Call story_analyst
- "Suggest a new campaign for my brand [brandName]?" → Call suggest_multi_channel_approach
- "I need data on resistance in [audience/region]?" → Call suggest_multi_channel_approach + pre_select_evidence
- "Tell me about [audience]?" → Call query_audience_insights, share decision factors and barriers

IMPORTANT: 
- Always use tools to get real data - never make up metrics
- Synthesize tool results into conversational, actionable recommendations
- Reference specific numbers from tool results
- When suggesting multi-channel, explain the lift prediction basis
`;
}

/**
 * Generates context-aware quick replies (suggested next buttons) for the user.
 * @param {string} userMessage - The last message from the user.
 * @param {object} context - The current conversation context.
 * @param {object} toolResults - The results from any executed tools.
 * @returns {Array<{label: string, value: string}>} - A list of quick replies.
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
    { label: '💡 Suggest content', value: 'suggest for ' + (context.brand.therapeutic_area || 'my brand') },
    { label: '📝 New Story', value: 'start new story' }
  ];
}


// ===========================================
// Deno Handler
// ===========================================

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();
  
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    
    if (!supabaseUrl || !supabaseKey || !lovableApiKey) {
      throw new Error('Required environment variables are missing');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Request payload structure: { userId, brandId, message, context }
    const { userId, brandId, message, context } = await req.json();

    if (!userId || !brandId || !message || !context) {
      throw new Error('Missing required parameters: userId, brandId, message, or context');
    }

    console.log(`Processing message for user ${userId}, brand ${brandId}: ${message}`);

    // --- 1. Detect Interaction Mode & Intent ---
    const interactionMode = detectInteractionMode(message, context.history);
    const themeSpec = extractThemeSpecification(message); // For future content generation phase

    // --- 2. Build System Prompt ---
    // The system prompt drives the tool usage and response generation by the LLM
    const systemPrompt = SYSTEM_PROMPT(context);
    
    // --- 3. Prepare AI Request Body ---
    const aiMessages = [
      { role: 'system', content: systemPrompt },
      ...context.history.map(msg => ({ role: msg.role, content: msg.content })),
      { role: 'user', content: message }
    ];

    const tools = intelligenceQueryTools.map(t => ({
      type: 'function',
      function: {
        name: t.name,
        description: t.description,
        parameters: t.parameters,
      }
    }));
    
    // --- 4. Call AI Gateway ---
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: aiMessages,
        tools: tools.length > 0 ? tools : undefined,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI Gateway Error:', errorText);
      throw new Error(`AI Gateway failed: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    let responseContent = aiData.choices?.[0]?.message?.content || 'I encountered an issue processing your request.';
    let toolCalls = aiData.choices?.[0]?.message?.tool_calls || [];
    let toolResults = {};

    // --- 5. Tool Call Execution (First Pass) ---
    if (toolCalls.length > 0) {
      console.log(`AI requested ${toolCalls.length} tool call(s).`);
      
      for (const call of toolCalls) {
        const funcName = call.function.name;
        const args = JSON.parse(call.function.arguments);
        
        console.log(`Executing tool: ${funcName}`);
        
        // Find and execute the corresponding function
        const toolDef = intelligenceQueryTools.find(t => t.name === funcName);
        
        if (toolDef) {
          const func = toolDef.executor;
          const result = await func(args, brandId, supabase); // Pass necessary context
          toolResults[funcName] = result;
          
          // Add tool result to the messages array for the second AI call
          aiMessages.push({
            role: 'tool',
            content: JSON.stringify(result),
            tool_call_id: call.id,
          });
        }
      }

      // --- 6. Second AI Call (Tool Synthesis) ---
      console.log('Rerunning AI to synthesize tool results...');
      const synthesisResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${lovableApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-pro",
          messages: aiMessages, // Now includes tool results
          tools: tools.length > 0 ? tools : undefined,
        }),
      });

      if (!synthesisResponse.ok) {
        throw new Error(`AI Synthesis failed: ${synthesisResponse.status}`);
      }

      const synthesisData = await synthesisResponse.json();
      responseContent = synthesisData.choices?.[0]?.message?.content || 'Failed to synthesize tool results.';
    }

    // --- 7. Final Response Generation ---
    const quickReplies = generateSmartQuickReplies(message, context, toolResults);
    
    const processingTime = Date.now() - startTime;
    console.log(`Total processing time: ${Math.floor(processingTime / 1000)}s`);

    return new Response(
      JSON.stringify({
        success: true,
        response: responseContent,
        quickReplies: quickReplies,
        interactionMode: interactionMode,
        themeSpecification: themeSpec,
        // Optional: Include debug info
        debug: {
          toolsUsed: Object.keys(toolResults),
          processingTimeMs: processingTime
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('CRITICAL INDEX ERROR:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
        quickReplies: [
          { label: 'Try Again', value: 'restart' },
          { label: 'Contact Support', value: 'support' }
        ]
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});