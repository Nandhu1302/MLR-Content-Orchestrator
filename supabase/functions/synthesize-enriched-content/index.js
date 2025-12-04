import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// NOTE: The original file used Deno.serve to handle the request.
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Destructure request body. Removed TypeScript type annotations.
    const { field, theme, intelligence, context } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // ===============================================
    // 1. Build Intelligence Summary Sections
    // ===============================================
    
    // Note: The logic for building these strings is complex and is preserved here.
    
    const brandSection = intelligence?.brand ? `
BRAND INTELLIGENCE:
- Voice Alignment Score: ${intelligence.brand.voiceAlignment?.score || 'N/A'}/100
- Brand Strengths: ${intelligence.brand.messagingOptimization?.strengths?.join(', ') || 'N/A'}
- Areas for Improvement: ${intelligence.brand.messagingOptimization?.improvements?.join(', ') || 'N/A'}
- Tone Guidelines: ${intelligence.brand.voiceAlignment?.recommendations?.join(', ') || 'N/A'}
` : '';

    const clinicalSection = intelligence?.clinical ? `
CLINICAL & REGULATORY INTELLIGENCE:
- Key Trial Summary: ${intelligence.clinical.trials?.[0]?.summary || 'N/A'}
- Core Claim: ${intelligence.clinical.coreClaims?.[0]?.text || 'N/A'}
- Safety Focus: ${intelligence.clinical.safetyFocus || 'N/A'}
- Regulatory Context: ${intelligence.clinical.regulatoryContext || 'N/A'}
- Supporting Claims (Top 3 Relevant): ${intelligence.clinical.trials?.filter(t => (t.relevanceScore || t.relevance_score || 0) >= 70).map(t => t.dataPoint).slice(0, 3).join(', ') || 'None'}
` : '';

    const marketSection = intelligence?.market ? `
MARKET INTELLIGENCE:
- Primary Audience Segment: ${context.targetAudience || 'General HCP'}
- Audience Drivers: ${intelligence.market.audienceResonance?.primaryDrivers?.join(', ') || 'N/A'}
- Audience Barriers: ${intelligence.market.audienceResonance?.keyBarriers?.join(', ') || 'N/A'}
- Preferred Channels: ${intelligence.market.audienceResonance?.preferredChannels?.join(', ') || 'N/A'}
- Channel Performance Insights (Top): ${intelligence.market.channelPerformance?.topChannel || 'N/A'} with ${intelligence.market.channelPerformance?.topChannelLift || 'N/A'}% lift
` : '';

    const competitiveSection = intelligence?.competitive ? `
COMPETITIVE INTELLIGENCE:
- Primary Competitor: ${intelligence.competitive.primaryCompetitor || 'N/A'}
- Differentiation Opportunity: ${intelligence.competitive.differentiationOpportunities?.[0]?.opportunity || 'N/A'}
- Counter-Messaging Theme: ${intelligence.competitive.counterMessaging || 'N/A'}
- Latest Signal: ${intelligence.competitive.latestSignal?.summary || 'N/A'}
` : '';

    // Combine all sections into a single intelligence context string
    const intelligenceContext = [brandSection, clinicalSection, marketSection, competitiveSection]
      .filter(s => s.length > 0)
      .join('\n---\n');

    // ===============================================
    // 2. Build AI System Prompt
    // ===============================================
    
    const systemPrompt = `You are a specialized content generation engine. Your task is to synthesize a high-quality, data-driven marketing asset based on the provided THEME and comprehensive INTELLIGENCE CONTEXT.

THEME SPECIFICATION:
- Theme Name: ${theme.name}
- Audience: ${context.targetAudience || 'Not Specified'}
- Target Channel: ${context.channels?.join(', ') || 'Not Specified'}

FIELD TO GENERATE: **${field}**

INSTRUCTIONS:
1.  **Analyze**: Carefully read the entire INTELLIGENCE CONTEXT provided below.
2.  **Synthesize**: Generate only the content for the requested FIELD (${field}).
3.  **Integrate Data**: Weave specific, compelling data points and claims (especially those with high relevance scores or from the clinical section) directly into the generated content.
4.  **Align**: Ensure the tone and messaging align with the BRAND and COMPETITIVE intelligence (e.g., emphasize strengths, address barriers, use the right tone).
5.  **Output**: Return ONLY the raw text content for the field. Do not include any introductory text, markdown formatting (except for bolding), or commentary.

INTELLIGENCE CONTEXT:
${intelligenceContext}

FIELD GENERATION REQUIREMENT:
Generate the content for the field: **${field}**`;

    // ===============================================
    // 3. Call AI Gateway
    // ===============================================
    
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-pro',
        messages: [
          { role: 'system', content: systemPrompt },
        ]
      }),
    });

    if (!response.ok) {
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    console.log('Successfully synthesized enriched content:', {
      field,
      contentLength: content.length,
      themeName: theme.name
    });

    // ===============================================
    // 4. Extract Intelligence Items Used for Logging
    // ===============================================
    
    const intelligenceItemsUsed = {
      theme: theme.id || null,
      // Filter claims/trials with high relevance (>= 80) and take the top 5 IDs
      claims: intelligence?.clinical?.trials?.filter(t => (t.relevanceScore || t.relevance_score || 0) >= 80).map(t => t.id).slice(0, 5) || [],
      segments: context.targetAudience ? [context.targetAudience] : [],
      // Take top 3 differentiation opportunities
      competitiveInsights: intelligence?.competitive?.differentiationOpportunities?.slice(0, 3).map(o => o.id) || [],
      // Use market drivers as a proxy for market insights used
      marketInsights: intelligence?.market?.audienceResonance?.primaryDrivers || []
    };

    // ===============================================
    // 5. Return Final Response
    // ===============================================
    
    return new Response(JSON.stringify({ 
      content,
      intelligenceUsed: intelligenceItemsUsed,
      // List the high-level intelligence layers that were present in the input
      layersUsed: Object.keys(intelligence || {}).filter(k => intelligence[k])
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in synthesize-enriched-content:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred during synthesis';

    return new Response(JSON.stringify({ 
      error: errorMessage,
      content: `Failed to generate content: ${errorMessage}` 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});