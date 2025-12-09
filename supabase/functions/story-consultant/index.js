import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';
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

/**
 * @readonly
 * @enum {string}
 */
const ConversationStage = {
  GREETING: 'greeting',
  CLARIFICATION: 'clarification',
  OCCASION_DISCOVERY: 'occasion',
  AUDIENCE_CLARIFY: 'audience',
  GOALS_REFINEMENT: 'goals',
  ASSETS_SELECTION: 'assets',
  BRIEF_CONFIRMATION: 'brief'
};

/**
 * @typedef {Object} Message
 * @property {string} id
 * @property {'user' | 'assistant'} role
 * @property {string} content
 * @property {{ label: string; value: string }[]} [quickReplies]
 */

/**
 * @typedef {Object} DetectedIntent
 * @property {string} [occasion] - Core intent
 * @property {string} [audience]
 * @property {string} [audienceSeniority]
 * @property {string[]} [audienceSpecialties]
 * @property {string} [eventName] - Event details (flattened)
 * @property {string} [eventType]
 * @property {string} [region]
 * @property {string} [duration]
 * @property {string[]} [activities]
 * @property {string[]} [goals] - Goals and assets
 * @property {string[]} [assetTypes]
 * @property {string[]} [suggestedAssets]
 * @property {string} [therapeuticArea] - Context
 * @property {string} [brandMention]
 * @property {string} [timeline]
 * @property {'urgent' | 'normal' | 'flexible'} [urgency]
 * @property {number} [confidence]
 */

/**
 * @typedef {Object} ConversationContext
 * @property {string} userStory
 * @property {string} [brandId]
 * @property {DetectedIntent} [detectedIntent]
 * @property {string} [matchedTemplateId]
 * @property {string[]} [selectedAssets]
 */

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    /** @type {{ userMessage: string, conversationHistory: Message[], context: ConversationContext, isInitialAnalysis?: boolean }} */
    const { userMessage, conversationHistory, context, isInitialAnalysis } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch brand-specific intelligence at conversation start
    const brandContext = await fetchBrandContext(supabase, context.brandId || '225d6bbc-c663-462f-86a8-21886bc40047');

    // INITIAL STORY ANALYSIS MODE
    if (isInitialAnalysis) {
      console.log('Initial story analysis mode');
      
      // Detect if user is asking an open-ended question
      const isOpenQuestion = context.userStory.toLowerCase().includes('what do you suggest') || 
                             context.userStory.toLowerCase().includes('what should') ||
                             context.userStory.toLowerCase().includes('recommend');
      
      const analysisPrompt = buildInitialAnalysisPrompt(context.userStory, brandContext);
      const analysisTools = buildExpandedIntentExtractionTools();

      const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            { role: 'system', content: analysisPrompt },
            { role: 'user', content: context.userStory }
          ],
          tools: analysisTools,
          temperature: 0.7,
          max_tokens: 600
        })
      });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error in initial analysis:', aiResponse.status, errorText);
      
      // Handle specific error cases
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ 
            error: "Rate limit exceeded. Please try again in a moment.",
            retryable: true 
          }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ 
            error: "AI service requires payment. Please check your Lovable workspace credits.",
            retryable: false 
          }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (aiResponse.status === 503 || aiResponse.status >= 500) {
        return new Response(
          JSON.stringify({ 
            error: "AI service temporarily unavailable. Please try again in a moment.",
            retryable: true 
          }),
          { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI API request failed: ${aiResponse.status} - ${errorText}`);
    }

      const aiData = await aiResponse.json();
      const choice = aiData.choices[0];

      // Extract comprehensive intent from tool calls
      let extractedIntent = {};
      if (choice.message.tool_calls && choice.message.tool_calls.length > 0) {
        const toolCall = choice.message.tool_calls[0];
        if (toolCall.function.name === 'analyze_story') {
          extractedIntent = JSON.parse(toolCall.function.arguments);
          console.log('Extracted comprehensive intent:', extractedIntent);
        }
      }

      // If open question, auto-trigger intelligence tools for proactive recommendations
      let intelligenceData = null;
      if (isOpenQuestion) {
        console.log('Open question detected - fetching intelligence proactively');
        
        // Get multi-channel suggestions with actual data
        const multiChannelData = await suggestMultiChannelApproach(
          supabase, 
          context.brandId || '225d6bbc-c663-462f-86a8-21886bc40047',
          {
            occasion: extractedIntent.occasion || 'education',
            audience: extractedIntent.audience?.primaryType || 'HCP',
            region: extractedIntent.region || 'US'
          }
        );
        
        intelligenceData = multiChannelData;
        console.log('Proactive intelligence fetched:', intelligenceData);
      }

      // Check if input is valid pharmaceutical content request
      const isLowConfidence = !extractedIntent.confidence || extractedIntent.confidence < 0.3;
      const hasNoMeaningfulData = 
        !extractedIntent.occasion && 
        !extractedIntent.audience?.primaryType && 
        (!extractedIntent.goals || extractedIntent.goals.length === 0);

      // If input doesn't make sense, ask for clarification instead of blindly proceeding
      if (isLowConfidence && hasNoMeaningfulData) {
        console.log('Low confidence input detected - asking for clarification');
        return new Response(
          JSON.stringify({
            message: `I'm not quite sure what you're looking for. To help you create effective content, could you tell me more about:

**What's the occasion?** (e.g., upcoming conference, competitive response, patient education campaign)

**Who's your audience?** (e.g., HIV specialists, patients, caregivers)

**What do you want to achieve?** (e.g., drive awareness, support prescribing, educate)

Feel free to describe your situation in your own words!`,
            quickReplies: [
              { label: '🎪 Plan for an Event', value: 'I have an upcoming event' },
              { label: '📧 Create Campaign', value: 'I want to create a marketing campaign' },
              { label: '📚 Patient Education', value: 'I need patient education materials' },
              { label: '⚔️ Competitive Response', value: 'I need to respond to competitor activity' }
            ],
            extractedIntent: { confidence: 0, needsClarification: true },
            stage: ConversationStage.CLARIFICATION
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Generate smart greeting that references story details and intelligence
      const smartGreeting = generateSmartGreeting(context.userStory, extractedIntent, brandContext);
      
      // Generate quick replies that match what the greeting is asking
      const quickReplies = generateContextAwareQuickReplies(extractedIntent, isOpenQuestion);

      return new Response(
        JSON.stringify({
          message: smartGreeting,
          quickReplies,
          extractedIntent,
          intelligenceData,
          stage: ConversationStage.GREETING
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // NORMAL CONVERSATION MODE - Calculate conversation turns
    const userTurns = conversationHistory.filter((m) => m.role === 'user').length;
    
    const stage = determineStage(conversationHistory, context);
    console.log('Current stage:', stage, 'Turns:', userTurns);

    // Add conversation turns to context for prompt building
    const enrichedContext = {
      ...context,
      conversationTurns: userTurns
    };

    const systemPrompt = buildSystemPrompt(stage, enrichedContext, brandContext);
    
    // Combine stage-based tools with intelligence query tools
    const stageTools = buildIntentExtractionTools(stage);
    const allTools = [...stageTools, ...intelligenceQueryTools];

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
        tools: allTools.length > 0 ? allTools : undefined,
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      
      // Handle specific error cases
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ 
            error: "Rate limit exceeded. Please try again in a moment.",
            retryable: true 
          }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ 
            error: "AI service requires payment. Please check your Lovable workspace credits.",
            retryable: false 
          }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (aiResponse.status === 503 || aiResponse.status >= 500) {
        return new Response(
          JSON.stringify({ 
            error: "AI service temporarily unavailable. Please try again in a moment.",
            retryable: true 
          }),
          { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI API request failed: ${aiResponse.status} - ${errorText}`);
    }

    const aiData = await aiResponse.json();
    const choice = aiData.choices[0];
    let aiMessage = choice.message.content;

    // Handle intelligence query tool calls
    let toolResults = {};
    let extractedIntent = {};
    
    if (choice.message.tool_calls && choice.message.tool_calls.length > 0) {
      for (const toolCall of choice.message.tool_calls) {
        const toolName = toolCall.function.name;
        const toolArgs = JSON.parse(toolCall.function.arguments || '{}');
        
        console.log('AI called tool:', toolName, toolArgs);
        
        // Handle intelligence query tools
        switch (toolName) {
          case 'query_brand_status':
            toolResults.brandStatus = await queryBrandStatus(supabase, context.brandId || '225d6bbc-c663-462f-86a8-21886bc40047');
            break;
          case 'query_campaign_history':
            toolResults.campaignHistory = await queryCampaignHistory(supabase, context.brandId || '225d6bbc-c663-462f-86a8-21886bc40047', toolArgs.campaign_name);
            break;
          case 'query_audience_insights':
            toolResults.audienceInsights = await queryAudienceInsights(supabase, context.brandId || '225d6bbc-c663-462f-86a8-21886bc40047', toolArgs.audience_type);
            break;
          case 'suggest_multi_channel_approach':
            toolResults.multiChannelSuggestion = await suggestMultiChannelApproach(supabase, context.brandId || '225d6bbc-c663-462f-86a8-21886bc40047', toolArgs);
            break;
          case 'pre_select_evidence':
            toolResults.preSelectedEvidence = await preSelectEvidence(supabase, context.brandId || '225d6bbc-c663-462f-86a8-21886bc40047', toolArgs);
            break;
          case 'extract_intent':
            extractedIntent = toolArgs;
            console.log('Extracted intent via tool calling:', extractedIntent);
            break;
        }
      }
      
      // If intelligence tools were called, make second AI call to synthesize results
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
              { role: 'assistant', content: `I've gathered the following data:\n${JSON.stringify(toolResults, null, 2)}\n\nNow I'll synthesize this into a clear, actionable response for the user.` }
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

    // Generate question-aware quick replies using accumulated context
    // Merge context updates with existing detected intent for accurate quick reply generation
    const contextUpdates = extractContextUpdates(stage, userMessage, aiMessage, extractedIntent);
    const accumulatedIntent = {
      ...context.detectedIntent,
      ...contextUpdates.detectedIntent
    };
    
    console.log(`[Story Consultant] AI Response preview: "${aiMessage.substring(0, 150)}..."`);
    console.log(`[Story Consultant] Accumulated intent:`, accumulatedIntent);
    const quickReplies = generateQuestionAwareQuickReplies(aiMessage, userTurns, accumulatedIntent);
    console.log(`[Story Consultant] Generated ${quickReplies.length} quick replies: ${quickReplies.map(r => r.label).join(', ')}`);

    return new Response(
      JSON.stringify({
        message: aiMessage,
        quickReplies,
        contextUpdates,
        toolResults,
        stage
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in story-consultant:', error);
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
 * @param {Message[]} history
 * @param {ConversationContext} context
 * @returns {ConversationStage}
 */
function determineStage(history, context) {
  const intent = context.detectedIntent;
  
  // Check what's already known from story analysis
  const hasOccasion = !!intent?.occasion;
  const hasAudience = !!intent?.audience || !!intent?.audienceSeniority;
  const hasActivities = intent?.activities && intent.activities.length > 0;
  const hasGoals = intent?.goals && intent.goals.length > 0;
  const hasAssets = (context.selectedAssets && context.selectedAssets.length > 0) || 
                    (intent?.assetTypes && intent.assetTypes.length > 0) ||
                    (intent?.suggestedAssets && intent.suggestedAssets.length > 0);
  
  console.log('Intent-aware stage determination:', {
    hasOccasion,
    hasAudience,
    hasActivities,
    hasGoals,
    hasAssets
  });
  
  // If we have everything, go to confirmation
  if (hasOccasion && hasAudience && hasGoals && hasAssets) {
    return ConversationStage.BRIEF_CONFIRMATION;
  }
  
  // If we have occasion, audience, and goals → suggest assets
  if (hasOccasion && hasAudience && hasGoals) {
    return ConversationStage.ASSETS_SELECTION;
  }
  
  // If we have occasion and audience → clarify goals
  if (hasOccasion && hasAudience) {
    return ConversationStage.GOALS_REFINEMENT;
  }
  
  // If we have occasion OR activities → clarify audience
  if (hasOccasion || hasActivities) {
    return ConversationStage.AUDIENCE_CLARIFY;
  }
  
  // Fallback to message count for edge cases
  const assistantMessages = history.filter(m => m.role === 'assistant');
  const length = assistantMessages.length;
  
  if (length === 0) return ConversationStage.GREETING;
  
  return ConversationStage.OCCASION_DISCOVERY;
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
 * @param {ConversationStage} stage
 * @param {ConversationContext} context
 * @param {any} brandContext
 * @returns {string}
 */
function buildSystemPrompt(stage, context, brandContext) {
  const brand = brandContext.brand || {};
  const segments = brandContext.segments || [];
  const claims = brandContext.claims || [];
  const patterns = brandContext.patterns || [];
  const intent = context.detectedIntent || {};

  // Calculate conversation turns from context
  const conversationTurns = context.conversationTurns || 0;

  // Build context summary of what we already know
  const knownContext = [];
  if (intent.occasion) knownContext.push(`Occasion: ${intent.occasion}`);
  if (intent.eventName) knownContext.push(`Event: ${intent.eventName}`);
  if (intent.region) knownContext.push(`Region: ${intent.region}`);
  if (intent.audience || intent.audienceSeniority) {
    knownContext.push(`Audience: ${intent.audienceSeniority === 'kol' ? 'KOLs/Specialists' : intent.audience}`);
  }
  if (intent.activities && intent.activities.length > 0) {
    knownContext.push(`Activities: ${intent.activities.join(', ')}`);
  }
  if (intent.goals && intent.goals.length > 0) {
    knownContext.push(`Goals: ${intent.goals.join(', ')}`);
  }
  
  const knownSummary = knownContext.length > 0 
    ? `\n\n✅ **ALREADY KNOWN FROM USER'S STORY:**\n${knownContext.map(c => `• ${c}`).join('\n')}\n\n⚠️ **DO NOT ASK ABOUT THESE AGAIN - ACKNOWLEDGE AND MOVE FORWARD!**`
    : '';

  const brandAwareIntro = brand.brand_name ?
    `You are a pharmaceutical brand strategist having a MEANINGFUL conversation.

YOUR ROLE:
- DO NOT just acknowledge what the user said
- DO ask clarifying questions to truly understand their needs  
- DO explore the WHY behind their request
- DO offer strategic recommendations with rationale backed by data

CONVERSATION FLOW (${conversationTurns} turns completed):
1. FIRST 2 EXCHANGES: Understand WHAT they want and WHO the audience is
2. NEXT 2 EXCHANGES: Explore WHY this approach, WHEN they need it, HOW they want to measure success
3. FINAL EXCHANGE: Summarize your recommended strategy starting with "Here's my recommended strategy:" and ask for confirmation

CRITICAL RULES:
- Ask ONE focused question at a time
- Reference specific ${brand.brand_name} data when making recommendations (${claims.length} claims available, ${patterns.length} success patterns)
- Don't suggest "Generate Themes" until you've had at least 3 meaningful exchanges AND summarized the strategy
- When ready to summarize, start with "Here's my recommended strategy:" so the system knows

CURRENT CONVERSATION STATE:
- Turns completed: ${conversationTurns}
- Audience known: ${intent?.audience ? 'Yes' : 'No'}
- Goals known: ${(intent?.goals?.length || 0) > 0 ? 'Yes' : 'No'}
- Occasion known: ${intent?.occasion ? 'Yes' : 'No'}

${knownSummary}` 
  : `You are an expert pharmaceutical content strategy consultant having a meaningful conversation. Focus on understanding the user's true needs through strategic questions.`;

  return brandAwareIntro;
}

/**
 * @returns {any[]}
 */
function buildExpandedIntentExtractionTools() {
  return [{
    type: "function",
    function: {
      name: "analyze_story",
      description: "Comprehensively analyze user's content creation story with all details",
      parameters: {
        type: "object",
        properties: {
          occasion: { 
            type: "string", 
            enum: ["event", "launch", "competitive", "education", "seasonal", "update"],
            description: "The trigger or occasion for the content"
          },
          eventDetails: {
            type: "object",
            properties: {
              eventName: { type: "string", description: "Name of the event (e.g., IDWeek, CROI)" },
              eventType: { type: "string", enum: ["conference", "congress", "meeting", "workshop", "webinar"] },
              region: { type: "string", description: "Geographic region (e.g., Midwest, Northeast)" },
              duration: { type: "string", description: "Event duration or timeline" },
              activities: { 
                type: "array", 
                items: { type: "string" },
                description: "Specific activities (booth, podium, workshop, poster)"
              }
            }
          },
          audience: {
            type: "object",
            properties: {
              primaryType: { type: "string", description: "Primary audience type (HCP, Patient, Caregiver)" },
              specialties: { 
                type: "array", 
                items: { type: "string" },
                description: "HCP specialties (Infectious Disease, HIV Specialist, etc.)"
              },
              seniority: { 
                type: "string", 
                enum: ["kol", "specialist", "generalist", "trainee"],
                description: "Audience seniority level"
              }
            }
          },
          therapeuticArea: { type: "string", description: "Therapeutic area (HIV, Oncology, etc.)" },
          brandMention: { type: "string", description: "Mentioned brand or product (Gilead, Biktarvy)" },
          suggestedAssets: { 
            type: "array", 
            items: { type: "string" },
            description: "Asset types suggested by story context"
          },
          timeline: { type: "string", description: "When content is needed" },
          urgency: { 
            type: "string", 
            enum: ["urgent", "normal", "flexible"],
            description: "Timeline urgency"
          },
          goals: {
            type: "array",
            items: { type: "string" },
            description: "Inferred content goals"
          },
          confidence: { type: "number", description: "Confidence in the analysis (0-1)" }
        },
        required: ["occasion", "audience", "confidence"]
      }
    }
  }];
}

/**
 * @param {ConversationStage} stage
 * @returns {any[]}
 */
function buildIntentExtractionTools(stage) {
  // Only use tool calling for stages where we need structured extraction
  if (stage === ConversationStage.OCCASION_DISCOVERY || 
      stage === ConversationStage.AUDIENCE_CLARIFY || 
      stage === ConversationStage.GOALS_REFINEMENT) {
    return [{
      type: "function",
      function: {
        name: "extract_intent",
        description: "Extract structured intent from user's content creation story",
        parameters: {
          type: "object",
          properties: {
            occasion: { 
              type: "string", 
              enum: ["event", "launch", "competitive", "education", "seasonal", "update"],
              description: "The trigger or occasion for the content"
            },
            audience: { 
              type: "string",
              description: "Target audience (e.g., 'hcp-specialist', 'patient', 'caregiver')"
            },
            goals: { 
              type: "array", 
              items: { type: "string" },
              description: "Primary goals (awareness, education, prescribing, behavior-change)"
            },
            assetTypes: {
              type: "array",
              items: { type: "string" },
              description: "Mentioned asset types (email, social, landing-page, sales-aid)"
            },
            urgency: { 
              type: "string", 
              enum: ["urgent", "normal", "flexible"],
              description: "Timeline urgency"
            },
            eventName: { 
              type: "string",
              description: "Specific event or conference name if mentioned"
            },
            timeline: {
              type: "string",
              description: "Specific timeline or date mentioned"
            }
          }
        }
      }
    }];
  }
  
  return [];
}

/**
 * @param {ConversationStage} stage
 * @param {string} userMessage
 * @param {string} aiMessage
 * @param {any} [toolExtractedIntent]
 * @returns {Partial<ConversationContext>}
 */
function extractContextUpdates(
  stage, 
  userMessage, 
  aiMessage, 
  toolExtractedIntent = {}
) {
  /** @type {Partial<ConversationContext>} */
  const updates = {};
  const lowerMessage = userMessage.toLowerCase();

  // Merge tool-extracted intent with keyword-based extraction
  /** @type {any} */
  const detectedIntent = { ...toolExtractedIntent };

  // AUDIENCE EXTRACTION - Detect from user's response
  // KOL detection FIRST (most specific)
  if (lowerMessage.includes('kol') || lowerMessage.includes('key opinion leader') || 
      lowerMessage.includes('thought leader')) {
    detectedIntent.audience = 'HCP';
    detectedIntent.audienceSeniority = 'kol';
    detectedIntent.audienceSpecialties = ['KOL/Thought Leader'];
  }
  // Then general HCP patterns
  else if (lowerMessage.includes('hcp') || lowerMessage.includes('specialist') || 
      lowerMessage.includes('physician') || lowerMessage.includes('doctor')) {
    detectedIntent.audience = 'HCP';
    if (lowerMessage.includes('specialist') || lowerMessage.includes('hiv')) {
      detectedIntent.audienceSpecialties = ['HIV Specialist'];
    }
    if (lowerMessage.includes('primary care') || lowerMessage.includes('pcp')) {
      detectedIntent.audienceSpecialties = ['Primary Care'];
    }
  }
  if (lowerMessage.includes('patient')) {
    detectedIntent.audience = detectedIntent.audience ? 'HCP+Patient' : 'Patient';
  }
  if (lowerMessage.includes('caregiver')) {
    detectedIntent.audience = detectedIntent.audience ? (detectedIntent.audience + '+Caregiver') : 'Caregiver';
  }
  if (lowerMessage.includes('multiple audience') || lowerMessage.includes('both')) {
    detectedIntent.audience = 'Multiple';
  }
  
  // GOALS EXTRACTION - Detect from user's response
  const goals = [];
  if (lowerMessage.includes('educate') || lowerMessage.includes('education')) {
    goals.push('education');
  }
  if (lowerMessage.includes('awareness') || lowerMessage.includes('drive awareness')) {
    goals.push('awareness');
  }
  if (lowerMessage.includes('prescrib') || lowerMessage.includes('support prescribing')) {
    goals.push('prescribing');
  }
  if (lowerMessage.includes('behavior change') || lowerMessage.includes('adherence')) {
    goals.push('behavior-change');
  }
  if (goals.length > 0) {
    detectedIntent.goals = goals;
  }
  
  // OCCASION EXTRACTION
  if (stage === ConversationStage.OCCASION_DISCOVERY || !detectedIntent.occasion) {
    if (lowerMessage.includes('event') || lowerMessage.includes('congress') || lowerMessage.includes('conference')) {
      detectedIntent.occasion = 'event';
      
      // Extract event name
      const eventMatch = userMessage.match(/(CROI|ASCO|ASH|IDWeek|[A-Z]{3,})\s*\d{4}?/i);
      if (eventMatch) {
        detectedIntent.eventName = eventMatch[0];
      }
    } else if (lowerMessage.includes('launch')) {
      detectedIntent.occasion = 'launch';
    } else if (lowerMessage.includes('competitive') || lowerMessage.includes('competitor')) {
      detectedIntent.occasion = 'competitive';
    } else if (lowerMessage.includes('education') || lowerMessage.includes('training')) {
      detectedIntent.occasion = 'education';
    } else if (lowerMessage.includes('seasonal') || lowerMessage.includes('awareness month')) {
      detectedIntent.occasion = 'seasonal';
    } else if (lowerMessage.includes('update') || lowerMessage.includes('new data')) {
      detectedIntent.occasion = 'update';
    } else if (lowerMessage.includes('campaign')) {
      detectedIntent.occasion = 'campaign';
    }
  }
  
  // ASSET TYPES EXTRACTION
  const assetTypes = detectedIntent.assetTypes || [];
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
    const timelineMatch = userMessage.match(/(?:in|next|by)\s+(\w+\s+\d{1,2}|\d{1,2}\s+\w+|\w+)/i);
    if (timelineMatch) {
      detectedIntent.timeline = timelineMatch[0];
    }
  }

  updates.detectedIntent = detectedIntent;

  // Also update selectedAssets if asset types were detected
  if (detectedIntent.assetTypes && detectedIntent.assetTypes.length > 0) {
    updates.selectedAssets = detectedIntent.assetTypes;
  }

  return updates;
}