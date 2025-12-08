
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Centralized channel and audience label constants
const CHANNEL_LABELS = {
  'website': 'Website',
  'email': 'Email',
  'social': 'Social',
  'rep-enabled': 'Rep-Enabled'
};
const AUDIENCE_LABELS = {
  'hcp': 'HCP',
  'patient': 'Patient',
  'caregiver': 'Caregiver'
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  try {
    const request = await req.json();
    console.log('Enhance channel content request:', {
      channel: request.channel,
      audience: request.audienceType,
      segment: request.audienceSegment
    });

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Build channel-specific data summary
    const dataSummary = buildDataSummary(request.channel, request.channelData);

    // Build AI prompt based on channel
    const systemPrompt = `You are a pharmaceutical marketing content strategist specializing in ${request.brandContext.therapeuticArea}.
Transform raw analytics data into compelling, audience-appropriate content suggestions that drive engagement.
CRITICAL: Return ONLY valid JSON with no markdown, no code fences, no additional text. The response must be parseable JSON.`;

    const userPrompt = `Channel: ${CHANNEL_LABELS[request.channel]}
Audience: ${AUDIENCE_LABELS[request.audienceType.toLowerCase()] ?? request.audienceType}${request.audienceSegment ? ' - ' + request.audienceSegment : ''}
Brand: ${request.brandContext.name} for ${request.brandContext.therapeuticArea}
Intelligence Data:
${dataSummary}
Generate content suggestions:
${getChannelSpecificInstructions(request.channel)}
Return JSON with this exact structure:
{
  "enhancedKeyMessage": "Compelling message that synthesizes the intelligence (not just restating metrics)",
  ${request.channel === 'email' ? '"subjectLine": "Attention-grabbing subject under 60 chars",' : ''}
  ${request.channel === 'email' ? '"preheader": "Complementary preheader text",' : ''}
  "cta": "Action-oriented, specific to channel and audience",
  "contentTips": ["Tip 1", "Tip 2", "Tip 3"],
  ${request.channel === 'rep-enabled' ? '"talkingPoints": ["Point 1", "Point 2", "Point 3"],' : ''}
  ${request.channel === 'social' ? '"hashtags": ["#Hashtag1", "#Hashtag2", "#Hashtag3"],' : ''}
  ${request.channel === 'website' ? '"seoHeadline": "SEO-optimized headline with keywords",' : ''}
  "rationale": "Brief explanation of why these suggestions work"
}`;

    console.log('Calling AI with prompt length:', userPrompt.length);
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
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('No content in AI response');
    }
    console.log('Raw AI response:', content);

    // Parse JSON response (handle potential markdown code fences)
    let enhancedContent;
    try {
      // Remove markdown code fences if present
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      enhancedContent = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      throw new Error('Invalid JSON from AI');
    }

    // Add aiEnhanced flag
    enhancedContent.aiEnhanced = true;
    console.log('Successfully enhanced content for', request.channel);

    return new Response(JSON.stringify(enhancedContent), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in enhance-channel-content:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
        aiEnhanced: false
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

function buildDataSummary(channel, data) {
  switch (channel) {
    case 'website':
      return `Top Pages: ${JSON.stringify(data.topPages?.slice(0, 3) ?? [])}
Search Terms: ${JSON.stringify(data.searchTerms?.slice(0, 5) ?? [])}
Downloads: ${JSON.stringify(data.downloads?.slice(0, 3) ?? [])}`;
    case 'email':
      return `Top Campaigns: ${JSON.stringify(data.campaigns?.slice(0, 3) ?? [])}
Top Subject Lines: ${JSON.stringify(data.topSubjects?.slice(0, 5) ?? [])}
Optimal Send Times: ${JSON.stringify(data.sendTimes?.slice(0, 3) ?? [])}`;
    case 'social':
      return `Trending Topics: ${JSON.stringify(data.trendingTopics?.slice(0, 5) ?? [])}
Platform Sentiment: ${JSON.stringify(data.platformSentiment ?? [])}
Top Mentions: ${JSON.stringify(data.topMentions?.slice(0, 3) ?? [])}`;
    case 'rep-enabled':
      return `Top Content: ${JSON.stringify(data.topContent?.slice(0, 3) ?? [])}
Top NBAs: ${JSON.stringify(data.topNBAs?.slice(0, 3) ?? [])}
Activity Heatmap: ${JSON.stringify(data.activityHeatmap?.slice(0, 5) ?? [])}`;
    default:
      return JSON.stringify(data);
  }
}

function getChannelSpecificInstructions(channel) {
  switch (channel) {
    case 'website':
      return `1. Key Message: Focus on content gaps revealed by search terms and page engagement
2. SEO Headline: Optimize for search terms with high volume
3. CTA: Direct users to high-value content or resources
4. Content Tips: Prioritize based on scroll depth and time-on-page data`;
    case 'email':
      return `1. Key Message: Emphasize patterns from top-performing campaigns
2. Subject Line: Under 60 chars, use proven patterns
3. Preheader: Complement subject, add urgency or benefit
4. CTA: Clear action tied to campaign goal
5. Content Tips: Reference send timing and segment performance`;
    case 'social':
      return `1. Key Message: Address trending conversations with brand positioning
2. Hashtags: Mix trending and branded hashtags (3-5 max)
3. CTA: Platform-appropriate (e.g., "Join the conversation")
4. Content Tips: Platform-specific recommendations (Twitter brevity, Instagram visuals, LinkedIn professional tone)`;
    case 'rep-enabled':
      return `1. Key Message: Highlight content proven effective in field
2. Talking Points: 3 key points reps can use with HCPs
3. CTA: Request meeting/sample/more info
4. Content Tips: Reference engagement scores and NBA conversion data`;
    default:
      return 'Generate general content recommendations based on available data.';
  }
}
