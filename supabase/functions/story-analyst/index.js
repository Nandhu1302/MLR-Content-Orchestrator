// ===========================================
// Story Analyst Agent
// Deep intent extraction using AI tool calling
// ===========================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// NOTE: TypeScript interfaces for StoryAnalysis, Occasion, Audience, Activities, Region, Goals, and Timeline 
// have been removed to comply with the JavaScript conversion request.

/**
 * Analyzes a text story to extract structured marketing intent (Occasion, Audience, Activities, Region, Goals, Timeline).
 * NOTE: This is a heuristic-based extraction for demonstration; a real implementation would use a powerful LLM.
 * @param {string} story - The text input representing the marketing request or story.
 * @param {string} brandName - The name of the brand context.
 * @returns {object} - A structured object containing the extracted intent.
 */
const analyzeStory = (story, brandName) => {
  const lowerStory = story.toLowerCase();
  
  // 1. Occasion/Event Detection
  let occasionType = 'general_campaign';
  let occasionName = '';
  
  if (lowerStory.includes('congress') || lowerStory.includes('asco') || lowerStory.includes('eha') || lowerStory.includes('aacr')) {
    occasionType = 'conference';
    occasionName = lowerStory.includes('asco') ? 'ASCO 2026' : lowerStory.includes('eha') ? 'EHA 2026' : 'Medical Congress';
  } else if (lowerStory.includes('launch') || lowerStory.includes('new indication')) {
    occasionType = 'launch';
    occasionName = 'Product/Indication Launch';
  } else if (lowerStory.includes('advisory board') || lowerStory.includes('adboard')) {
    occasionType = 'advisory_board';
    occasionName = 'Advisory Board Meeting';
  } else if (lowerStory.includes('webinar') || lowerStory.includes('virtual event')) {
    occasionType = 'webinar';
    occasionName = 'Virtual Educational Webinar';
  } else if (lowerStory.includes('holiday') || lowerStory.includes('season')) {
    occasionType = 'seasonal_campaign';
    occasionName = 'Seasonal Campaign';
  }

  // 2. Audience Detection
  let audienceType = 'HCP';
  let segments = [];
  let audienceSeniority = 'specialist'; // Default seniority

  if (lowerStory.includes('patient') || lowerStory.includes('person with')) {
    audienceType = 'Patient';
    if (lowerStory.includes('newly diagnosed')) segments.push('Patient-Newly Diagnosed');
    if (lowerStory.includes('experienced')) segments.push('Patient-Treatment-Experienced');
    if (segments.length === 0) segments.push('Patient-General');
  } else if (lowerStory.includes('caregiver') || lowerStory.includes('family')) {
    audienceType = 'Caregiver';
    segments.push('Caregiver-Family');
  } else if (lowerStory.includes('payer') || lowerStory.includes('formulary') || lowerStory.includes('health plan')) {
    audienceType = 'Payer';
    segments.push('Payer-Formulary Committee');
  } else {
    // Default to HCP
    if (lowerStory.includes('kol') || lowerStory.includes('key opinion leader')) audienceSeniority = 'kol';
    if (lowerStory.includes('generalist') || lowerStory.includes('pcp') || lowerStory.includes('primary care')) audienceSeniority = 'generalist';
    
    if (lowerStory.includes('pharmacist')) segments.push('HCP-Pharmacist');
    if (lowerStory.includes('nurse') || lowerStory.includes('np') || lowerStory.includes('pa')) segments.push('HCP-Nurse-NP-PA');
    if (lowerStory.includes('id') || lowerStory.includes('infectious disease')) segments.push('HCP-Infectious Disease');
    if (segments.length === 0) segments.push(`HCP-${audienceSeniority === 'kol' ? 'KOL' : 'Specialist'}`);
  }
  
  // 3. Goal Detection
  let primaryGoal = 'Increase Awareness';
  let secondaryGoals = [];

  if (lowerStory.includes('increase rx') || lowerStory.includes('drive new rx') || lowerStory.includes('grow market share')) {
    primaryGoal = 'Drive New Prescriptions (NRx)';
    secondaryGoals.push('Increase Market Share');
  } else if (lowerStory.includes('adherence') || lowerStory.includes('persistency')) {
    primaryGoal = 'Improve Adherence/Persistency';
    secondaryGoals.push('Increase Refills (TRx)');
  } else if (lowerStory.includes('safety profile') || lowerStory.includes('side effect data')) {
    primaryGoal = 'Communicate Safety Profile';
    secondaryGoals.push('Build Trust');
  } else if (lowerStory.includes('educate') || lowerStory.includes('inform')) {
    primaryGoal = 'Provide Education';
  }

  // 4. Activity/Tactic Detection
  let activities = [];
  
  if (lowerStory.includes('booth') || lowerStory.includes('exhibit')) {
    activities.push('conference_booth');
  }
  if (lowerStory.includes('podium') || lowerStory.includes('oral presentation')) {
    activities.push('podium_presentation');
  }
  if (lowerStory.includes('rep visit') || lowerStory.includes('sales call') || lowerStory.includes('detail')) {
    activities.push('rep_visit');
  }
  if (lowerStory.includes('email') || lowerStory.includes('edm')) {
    activities.push('email_campaign');
    if (lowerStory.includes('review') || lowerStory.includes('after')) {
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
  let urgency = 'planned'; // Default value
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
      seniority: audienceSeniority, 
      confidence: 0.6 
    },
    activities: { identified: activities, confidence: 0.75 },
    region: {
      identified: region,
      confidence: 0.7
    },
    goals: {
      primary: primaryGoal,
      secondary: secondaryGoals,
      confidence: 0.8
    },
    timeline: {
      urgency: urgency,
      dateContext: lowerStory.match(/\d{4}-\d{2}-\d{2}/)?.[0] || 'TBD', // Simple date extraction
      confidence: 0.7
    }
  };
};

// ===========================================
// Deno Handler
// ===========================================

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { storyText, brandName } = await req.json();

    if (!storyText || !brandName) {
      return new Response(
        JSON.stringify({ error: 'storyText and brandName are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Analyzing story for ${brandName}: "${storyText.substring(0, 50)}..."`);

    // Call the core analysis function
    const analysis = analyzeStory(storyText, brandName);

    return new Response(
      JSON.stringify({
        success: true,
        analysis,
        message: 'Story intent successfully extracted'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Story Analyst error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});