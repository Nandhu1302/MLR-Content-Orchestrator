import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';
// NOTE: Assuming these imports now point to the converted JavaScript files
import { buildInitialAnalysisPrompt, generateSmartGreeting, generateContextAwareQuickReplies, generateStageAwareQuickReplies, generateQuestionAwareQuickReplies } from './analysis-utils.js';
import { 
  queryBrandStatus, 
  queryCampaignHistory, 
  queryAudienceInsights,
  suggestMultiChannelApproach,
  preSelectEvidence,
  intelligenceQueryTools
} from './intelligence-tools.js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Converted TypeScript enum ConversationStage to a JavaScript constant object
const ConversationStage = {
  GREETING: 'greeting',
  CLARIFICATION: 'clarification',
  OCCASION_DISCOVERY: 'occasion',
  AUDIENCE_CLARIFY: 'audience',
  GOALS_REFINEMENT: 'goals',
  ASSETS_SELECTION: 'assets',
  BRIEF_CONFIRMATION: 'brief'
};

// NOTE: TypeScript interfaces (Message, ConversationContext, DetectedIntent) have been removed.

/**
 * Heuristically determines the next stage based on conversation history and user message.
 */
function detectIntent(userMessage, context) {
  let detectedIntent = context.detectedIntent || {};
  const lowerMessage = userMessage.toLowerCase();

  // --- STAGE DETERMINATION ---
  const nextStage = (() => {
    // 1. Check for explicit confirmation/brief completion
    if (lowerMessage.includes('confirm') || lowerMessage.includes('done') || lowerMessage.includes('generate')) {
      return ConversationStage.BRIEF_CONFIRMATION;
    }
    
    // 2. Check current stage and see if it's satisfied
    switch (context.currentStage) {
      case ConversationStage.GREETING:
      case ConversationStage.CLARIFICATION:
      case ConversationStage.OCCASION_DISCOVERY:
        // Try to find occasion/event details
        if (lowerMessage.includes('congress') || lowerMessage.includes('event') || lowerMessage.includes('launch')) {
          return ConversationStage.AUDIENCE_CLARIFY;
        }
        break;
      case ConversationStage.AUDIENCE_CLARIFY:
        // Try to find audience details
        if (lowerMessage.includes('hcp') || lowerMessage.includes('patient') || lowerMessage.includes('payer')) {
          return ConversationStage.GOALS_REFINEMENT;
        }
        break;
      case ConversationStage.GOALS_REFINEMENT:
        // Try to find goals/claims
        if (lowerMessage.includes('drive') || lowerMessage.includes('increase') || lowerMessage.includes('educate')) {
          return ConversationStage.ASSETS_SELECTION;
        }
        break;
      case ConversationStage.ASSETS_SELECTION:
        return ConversationStage.BRIEF_CONFIRMATION;
      default:
        // Fallback or maintain current stage if no progress is detected
        return context.currentStage;
    }

    // If no clear progression, return the next logical stage based on the current one
    switch (context.currentStage) {
      case ConversationStage.GREETING:
        return ConversationStage.OCCASION_DISCOVERY;
      case ConversationStage.OCCASION_DISCOVERY:
        return ConversationStage.AUDIENCE_CLARIFY;
      case ConversationStage.AUDIENCE_CLARIFY:
        return ConversationStage.GOALS_REFINEMENT;
      case ConversationStage.GOALS_REFINEMENT:
        return ConversationStage.ASSETS_SELECTION;
      case ConversationStage.ASSETS_SELECTION:
        return ConversationStage.BRIEF_CONFIRMATION;
      default:
        return ConversationStage.CLARIFICATION;
    }
  })();
  
  // --- CONTENT EXTRACTION (Heuristic/Placeholder) ---
  
  // OCCASION EXTRACTION
  if (!detectedIntent.occasionName) {
    if (lowerMessage.includes('asco')) detectedIntent.occasionName = 'ASCO 2026';
    else if (lowerMessage.includes('launch')) detectedIntent.occasionName = 'New Indication Launch';
  }
  
  // AUDIENCE EXTRACTION
  if (!detectedIntent.audience) {
    if (lowerMessage.includes('kol') || lowerMessage.includes('key opinion leader')) detectedIntent.audience = 'KOLs';
    else if (lowerMessage.includes('patient')) detectedIntent.audience = 'Patients';
  }

  // GOALS EXTRACTION
  if (!detectedIntent.goal) {
    if (lowerMessage.includes('increase rx')) detectedIntent.goal = 'Drive NRx';
    else if (lowerMessage.includes('educate')) detectedIntent.goal = 'Educate on Safety Profile';
  }

  // ASSET TYPE EXTRACTION
  const assetTypes = [];
  if (lowerMessage.includes('email')) assetTypes.push('email');
  if (lowerMessage.includes('social')) assetTypes.push('social-media-post');
  if (lowerMessage.includes('landing page') || lowerMessage.includes('website')) assetTypes.push('website-landing-page');
  if (lowerMessage.includes('sales aid') || lowerMessage.includes('detail aid')) assetTypes.push('digital-sales-aid');
  if (lowerMessage.includes('rep')) assetTypes.push('rep-triggered-email');
  
  if (assetTypes.length > 0) {
    detectedIntent.assetTypes = [...new Set(assetTypes)];
  }

  // URGENCY EXTRACTION
  if (!detectedIntent.urgency) {
    if (lowerMessage.includes('urgent') || lowerMessage.includes('asap') || lowerMessage.includes('immediately')) {
      detectedIntent.urgency = 'urgent';
    } else if (lowerMessage.includes('flexible') || lowerMessage.includes('whenever')) {
      detectedIntent.urgency = 'flexible';
    } else {
      detectedIntent.urgency = 'normal';
    }
  }

  // TIMELINE EXTRACTION
  if (!detectedIntent.timeline) {
    // Simple regex to find common timeline phrases
    const timelineMatch = userMessage.match(/(?:in|next|by)\s+(\w+\s+\d{1,2}|d{1,2}\s+\w+|\w+)/i);
    if (timelineMatch) {
      detectedIntent.timeline = timelineMatch[0];
    }
  }

  return { nextStage, detectedIntent };
}


/**
 * Builds the system prompt for the AI based on the current stage and detected intent.
 */
function buildSystemPrompt(context, nextStage, detectedIntent) {
  const brandName = context.brand.brand_name || 'the brand';
  const tools = intelligenceQueryTools.map(t => t.name).join(', ');

  const prompt = `You are an expert pharmaceutical content strategist named "Lovable AI". Your role is to guide the user in creating a complete marketing brief for ${brandName}.

BRAND CONTEXT:
- Therapeutic Area: ${context.brand.therapeutic_area || 'Oncology'}
- Document Count: ${context.brand.document_count || 0}
- Active Claims: ${context.brand.active_claims || 0}

YOUR CURRENT STAGE: **${nextStage}**
YOUR GOAL: To progress the user to the **BRIEF_CONFIRMATION** stage by collecting specific details.

DETECTED INTENT SO FAR:
- Occasion/Event: ${detectedIntent.occasionName || 'None'}
- Audience: ${detectedIntent.audience || 'None'}
- Goal: ${detectedIntent.goal || 'None'}
- Assets: ${(detectedIntent.assetTypes || []).join(', ') || 'None'}
- Urgency: ${detectedIntent.urgency || 'Normal'}

INSTRUCTIONS:
1.  **Stage Management**: Based on the **YOUR CURRENT STAGE**, formulate a response that moves the conversation forward.
2.  **Question Focus**: Ask a single, precise, and polite question to elicit the missing information required for the next stage.
3.  **Tool Use**: You have access to the intelligence tools: ${tools}. Use these tools ONLY IF the user asks for data or context, or if the current stage is **CLARIFICATION** and requires external data.
4.  **Tone**: Professional, encouraging, and collaborative.

${getStageGreeting(nextStage, detectedIntent.audience || 'your audience')}

If the stage is **BRIEF_CONFIRMATION**, summarize all detected intent and ask for final confirmation before proceeding to generation.`;

  return prompt;
}

/**
 * Provides a context-sensitive greeting/instruction for the current stage.
 */
function getStageGreeting(stage, contextDetail) {
  switch (stage) {
    case ConversationStage.GREETING:
      return 'Welcome! Let\'s start building your content brief. What is the **occasion** or **purpose** for your new content? (e.g., ASCO Congress, New Indication Launch, Annual Review)';
    case ConversationStage.OCCASION_DISCOVERY:
      return `Great! We've noted the occasion. Now, who is the **primary audience** for this content? (e.g., ${contextDetail}, Primary Care Physicians, Patients)`;
    case ConversationStage.AUDIENCE_CLARIFY:
      return `Understood. Now that we know your audience, what is the **primary goal** of this content? (e.g., Increase NRx, Educate on safety, Drive adherence)`;
    case ConversationStage.GOALS_REFINEMENT:
      return `Excellent goal. What **asset types** do you need to achieve this goal? (e.g., Email, Digital Sales Aid, Social Media Post, Website Landing Page)`;
    case ConversationStage.ASSETS_SELECTION:
      return 'One last detail! What is the **timeline** or **urgency** for this project? (e.g., Urgent, Next month, Flexible)';
    case ConversationStage.BRIEF_CONFIRMATION:
      return 'The brief is complete! Please review the summary below and confirm you are ready to generate content.';
    case ConversationStage.CLARIFICATION:
    default:
      return 'I need a little more detail to progress. Could you please clarify your request?';
  }
}

/**
 * Generates the final response object, including quick replies.
 */
function generateFinalResponse(aiResponseContent, context, nextStage, detectedIntent, toolResults) {
  const isBriefConfirmation = nextStage === ConversationStage.BRIEF_CONFIRMATION;

  let quickReplies;
  if (isBriefConfirmation) {
    quickReplies = [
      { label: '✅ Generate Content', value: 'generate-content' },
      { label: '📝 Refine Brief', value: 'refine-brief' },
    ];
  } else {
    // Generate context-aware quick replies based on the stage
    quickReplies = generateStageAwareQuickReplies(nextStage, detectedIntent);
  }

  return {
    success: true,
    response: aiResponseContent,
    currentStage: nextStage,
    detectedIntent: detectedIntent,
    quickReplies: quickReplies,
    debug: {
      toolsUsed: Object.keys(toolResults),
    }
  };
}


// ===========================================
// Deno Handler
// ===========================================

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();
  let documentId;
  
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    
    if (!supabaseUrl || !supabaseKey || !lovableApiKey) {
      throw new Error('Required environment variables are missing');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Request payload structure: { userId, brandId, message, context }
    const body = await req.json();
    const { userId, brandId, message, context } = body;

    if (!userId || !brandId || !message || !context) {
      throw new Error('Missing required parameters: userId, brandId, message, or context');
    }

    // --- 1. Detect Intent and Next Stage (Heuristic) ---
    const { nextStage, detectedIntent } = detectIntent(message, context);
    
    // --- 2. Build System Prompt ---
    const systemPrompt = buildSystemPrompt(context, nextStage, detectedIntent);
    
    // --- 3. Prepare AI Request Body ---
    const aiMessages = [
      { role: 'system', content: systemPrompt },
      ...(context.history || []).map(msg => ({ role: msg.role, content: msg.content })),
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
    
    // --- 4. Call AI Gateway (First Pass) ---
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

    // --- 5. Tool Call Execution (Two-Pass System) ---
    if (toolCalls.length > 0) {
      console.log(`AI requested ${toolCalls.length} tool call(s).`);
      
      for (const call of toolCalls) {
        const funcName = call.function.name;
        // Arguments from the AI are always a JSON string
        const args = JSON.parse(call.function.arguments);
        
        console.log(`Executing tool: ${funcName}`);
        
        const toolDef = intelligenceQueryTools.find(t => t.name === funcName);
        
        if (toolDef) {
          const func = toolDef.executor;
          const result = await func(args, brandId, supabase);
          toolResults[funcName] = result;
          
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
          messages: aiMessages,
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
    const finalResponse = generateFinalResponse(responseContent, context, nextStage, detectedIntent, toolResults);
    
    const processingTime = Date.now() - startTime;
    console.log(`Total processing time: ${Math.floor(processingTime / 1000)}s`);

    return new Response(
      JSON.stringify(finalResponse),
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