// ============================================
// Story Analyst Agent
// Deep intent extraction using AI tool calling
// ============================================

import { serve } from "https://deno.land/std@0.168.0/http/server.js"; // Changed .ts to .js

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Removed TypeScript interface for StoryAnalysis

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { story, brandId } = await req.json();

    if (!story) {
      return new Response(
        JSON.stringify({ error: 'Story text is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Analyzing story with AI:', story);

    // Call Lovable AI for deep analysis using tool calling
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('LOVABLE_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-pro',
        messages: [
          {
            role: 'system',
            content: `You are a pharma content strategist expert at analyzing user stories to extract deep intent.

**CRITICAL: First determine if input is a valid pharmaceutical marketing request**

If the input is:
- Unrelated to pharma/healthcare/marketing (e.g., technical UI questions, random text)
- Nonsensical or gibberish
- About features/functionality rather than content creation

Then return confidence: 0.0 and leave all fields empty.

Extract structured information ONLY if input relates to pharmaceutical content creation:
1. Occasion type (conference, launch, advisory_board, webinar, seasonal_campaign, routine_campaign)
2. Audience type and segments (HCP types, Patient types, Caregiver types)
3. Activities (booth, podium, workshop, rep_visit, pre_event_email, post_event_email, webinar, etc.)
4. Region (Midwest, Southeast, Southwest, Northeast, West, National, International)
5. Goals (awareness, education, lead_generation, conversion, engagement)
6. Timeline urgency (immediate, soon, planned)

Return ONLY a JSON object matching this structure:
{
  "isValidRequest": true,
  "occasion": {"type": "conference", "name": "ID Week", "confidence": 0.95},
  "audience": {"primaryType": "HCP", "segments": ["Physician-Specialist"], "confidence": 0.9},
  "activities": {"identified": ["booth", "podium"], "confidence": 0.85},
  "region": {"identified": "Midwest", "confidence": 0.8},
  "goals": {"primary": "education", "secondary": ["lead_generation"], "confidence": 0.9},
  "timeline": {"urgency": "soon", "dateContext": "next month", "confidence": 0.85},
  "extractedContext": {"keyPhrases": ["KOL audience", "evidence-focused"], "impliedNeeds": ["clinical data", "peer credibility"]}
}

For invalid input, return:
{
  "isValidRequest": false,
  "occasion": {"type": null, "confidence": 0.0},
  "audience": {"primaryType": null, "segments": [], "confidence": 0.0},
  "activities": {"identified": [], "confidence": 0.0},
  "region": {"identified": null, "confidence": 0.0},
  "goals": {"primary": null, "secondary": [], "confidence": 0.0},
  "timeline": {"urgency": null, "confidence": 0.0},
  "extractedContext": {"keyPhrases": [], "impliedNeeds": ["clarification_needed"]}
}`
          },
          {
            role: 'user',
            content: story
          }
        ],
        temperature: 0.3,
      }),
    });
if (!aiResponse.ok) {
      throw new Error(`AI API error: ${aiResponse.statusText}`);
    }

    const aiData = await aiResponse.json();
    console.log('AI analysis response:', aiData);

    let analysis; 

    try {
      // Extract JSON from AI response
      const content = aiData.choices[0].message.content;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in AI response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      
      // Fallback: basic keyword extraction
      analysis = extractBasicIntent(story);
    }

    console.log('Final analysis:', analysis);

    return new Response(
      JSON.stringify({ analysis }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Story analysis error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Fallback basic extraction if AI fails
function extractBasicIntent(story) { 
  const lowerStory = story.toLowerCase();

  // Occasion detection
  let occasionType = 'routine_campaign';
  let occasionName = undefined;
  if (lowerStory.includes('conference') || lowerStory.includes('congress')) {
    occasionType = 'conference';
  } else if (lowerStory.includes('launch')) {
    occasionType = 'launch';
  } else if (lowerStory.includes('advisory') || lowerStory.includes('board')) {
    occasionType = 'advisory_board';
  } else if (lowerStory.includes('webinar') || lowerStory.includes('virtual')) {
    occasionType = 'webinar';
  }

  // Audience detection with explicit seniority
  let audienceType = 'HCP';
  let audienceSeniority = undefined; 
  const segments = []; 

  if (lowerStory.includes('patient')) {
    audienceType = 'Patient';
    segments.push('Patient-Newly Diagnosed');
  } else if (lowerStory.includes('caregiver')) {
    audienceType = 'Caregiver';
    segments.push('Caregiver-Family');
  } else if (lowerStory.includes('kol') || lowerStory.includes('key opinion leader') ||
              lowerStory.includes('thought leader')) {
    audienceSeniority = 'kol';
    segments.push('Physician-Specialist');
  } else if (lowerStory.includes('specialist') || lowerStory.includes('id ')) {
    segments.push('Physician-Specialist');
  }

  // Activity detection
  const activities = []; 
  if (lowerStory.includes('booth')) activities.push('booth');
  if (lowerStory.includes('podium') || lowerStory.includes('presentation')) activities.push('podium');
  if (lowerStory.includes('workshop')) activities.push('workshop');
  if (lowerStory.includes('rep') || lowerStory.includes('visit')) activities.push('rep_visit');
  if (lowerStory.includes('email')) {
    if (lowerStory.includes('follow') || lowerStory.includes('after')) {
      activities.push('post_event_email');
    } else {
      activities.push('pre_event_email');
    }
  }

  // Region detection
  let region = 'National';
  if (lowerStory.includes('midwest')) region = 'Midwest';
  else if (lowerStory.includes('southeast') || lowerStory.includes('south')) region = 'Southeast';
  else if (lowerStory.includes('southwest')) region = 'Southwest';
  else if (lowerStory.includes('northeast')) region = 'Northeast';
  else if (lowerStory.includes('west')) region = 'West';

  // Timeline detection
  let urgency = 'planned'; 
  if (lowerStory.includes('urgent') || lowerStory.includes('asap') || lowerStory.includes('now')) {
    urgency = 'immediate';
  } else if (lowerStory.includes('upcoming') || lowerStory.includes('next week') || lowerStory.includes('soon')) {
    urgency = 'soon';
  }

  return {
    occasion: { type: occasionType, name: occasionName, confidence: 0.6 },
    audience: {
      primaryType: audienceType,
      segments,
      seniority: audienceSeniority,  // Include explicit seniority
      confidence: 0.6
    },
    activities: { identified: activities, confidence: 0.7 },
    region: { identified: region, confidence: 0.5 },
    goals: { primary: 'education', secondary: ['awareness'], confidence: 0.5 },
    timeline: { urgency, confidence: 0.6 },
    extractedContext: { keyPhrases: [], impliedNeeds: [] },
  };
}