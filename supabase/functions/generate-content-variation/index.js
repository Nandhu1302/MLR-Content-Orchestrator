
// personalize.js (ESM)
import express from 'express';
import fetch from 'node-fetch'; // If your runtime has global fetch, you can remove this import.

const app = express();
app.use(express.json());

// ----- Specialist & Audience Profiles (JS objects; same content/structure) -----
const SPECIALIST_PROFILES = {
  oncologist: {
    leadWith: ['Clinical trial data and efficacy outcomes', 'Survival benefits and response rates'],
    emphasize: ['Evidence from pivotal trials', 'MOA in cancer treatment', 'Safety profile in oncology patients'],
    avoid: ['Overgeneralized benefits', 'Non-specific quality of life claims'],
    structure: ['Start with trial data', 'Present efficacy clearly', 'Address safety transparently'],
  },
  cardiologist: {
    leadWith: ['Cardiovascular outcomes data', 'Risk reduction statistics'],
    emphasize: ['MACE reduction', 'Long-term safety in CV populations', 'Real-world evidence'],
    avoid: ['Vague heart health claims', 'Non-cardiac benefits as primary message'],
    structure: ['Lead with CV outcomes', 'Show risk stratification data', 'Include guideline alignment'],
  },
  pulmonologist: {
    leadWith: ['Lung function improvements', 'Respiratory outcomes data'],
    emphasize: ['FVC/FEV1 improvements', 'Exacerbation reduction', 'Disease progression data'],
    avoid: ['Generic respiratory benefits', 'Oversimplified lung health claims'],
    structure: ['Present pulmonary function data', 'Show disease progression curves', 'Address long-term management'],
  },
  endocrinologist: {
    leadWith: ['HbA1c reduction', 'Glycemic control data'],
    emphasize: ['Metabolic outcomes', 'Weight management data', 'CV safety profile'],
    avoid: ['Generic diabetes management claims', 'Oversimplified metabolic benefits'],
    structure: ['Lead with glycemic efficacy', 'Show metabolic benefits', 'Address CV safety'],
  },
  dermatologist: {
    leadWith: ['Skin clearance data', 'EASI/IGA scores'],
    emphasize: ['Visible improvements timeline', 'Itch reduction', 'QoL improvements'],
    avoid: ['Vague skin health claims', 'Non-specific cosmetic benefits'],
    structure: ['Show clearance data with timelines', 'Present validated dermatology scales', 'Include patient-reported outcomes'],
  },
  neurologist: {
    leadWith: ['Neurological outcomes', 'Stroke prevention data'],
    emphasize: ['Risk reduction statistics', 'Cognitive/functional outcomes', 'Safety in neurological populations'],
    avoid: ['Generic brain health claims', 'Oversimplified neurological benefits'],
    structure: ['Present neurological endpoints', 'Show risk stratification', 'Address neuroprotection data'],
  },
  'ent-specialist': {
    leadWith: ['Symptom scores', 'Polyp reduction data'],
    emphasize: ['Objective nasal measures', 'Symptom improvement timelines', 'Reduced need for surgery'],
    avoid: ['Vague sinus health claims', 'Non-specific ENT benefits'],
    structure: ['Show validated ENT outcome measures', 'Present visual evidence if available', 'Include patient symptom improvements'],
  },
};

const BASE_AUDIENCE_PROFILES = {
  'physician-specialist': {
    leadWith: ['Clinical evidence', 'Mechanism of action', 'Differentiation vs competitors'],
    emphasize: ['Efficacy data', 'Safety profile', 'Patient selection criteria'],
    avoid: ['Overly promotional language', 'Unsubstantiated claims', 'Emotional appeals'],
    structure: ['Problem → Solution → Evidence → Clinical application'],
    tone: 'Professional, evidence-based, peer-to-peer',
    depth: 'High clinical depth with specific data points',
    terminology: 'Medical terminology appropriate for specialists',
  },
  'physician-primary-care': {
    leadWith: ['Practical clinical utility', 'Clear patient selection', 'Simple dosing'],
    emphasize: ['Real-world applicability', 'Safety and tolerability', 'Guideline alignment'],
    avoid: ['Overly complex mechanisms', 'Subspecialty-only information', 'Impractical protocols'],
    structure: ['Clinical scenario → Treatment approach → Key points → Action'],
    tone: 'Professional but accessible',
    depth: 'Moderate depth with practical focus',
    terminology: 'Clear medical terms with context',
  },
  pharmacist: {
    leadWith: ['Dosing and administration', 'Drug interactions', 'Storage and handling'],
    emphasize: ['Patient counseling points', 'Adherence strategies', 'Safety monitoring'],
    avoid: ['Complex pharmacokinetics without context', 'Prescribing decisions', 'Overly clinical focus'],
    structure: ['Drug facts → Clinical use → Patient support → Monitoring'],
    tone: 'Professional, detail-oriented, patient-focused',
    depth: 'High pharmaceutical detail',
    terminology: 'Pharmaceutical and medical terminology',
  },
  'nurse-rn': {
    leadWith: ['Patient care protocols', 'Administration guidelines', 'Monitoring parameters'],
    emphasize: ['Patient education', 'Side effect management', 'Care coordination'],
    avoid: ['Prescribing information', 'Overly technical pharmacology', 'Diagnostic criteria'],
    structure: ['Patient care → Administration → Monitoring → Education'],
    tone: 'Professional, practical, patient-centered',
    depth: 'Practical clinical detail',
    terminology: 'Nursing and medical terminology',
  },
  'nurse-np-pa': {
    leadWith: ['Clinical decision support', 'Evidence-based protocols', 'Patient management'],
    emphasize: ['Diagnostic considerations', 'Treatment algorithms', 'Follow-up protocols'],
    avoid: ['Overly specialized content', 'Non-actionable information', 'Impractical workflows'],
    structure: ['Assessment → Treatment → Monitoring → Follow-up'],
    tone: 'Professional, practical, evidence-based',
    depth: 'High clinical depth with practical focus',
    terminology: 'Advanced practice medical terminology',
  },
  patient: {
    leadWith: ['Patient benefits', 'How treatment works', 'What to expect'],
    emphasize: ['Quality of life improvements', 'Safety and side effects', 'Support resources'],
    avoid: ['Medical jargon', 'Complex mechanisms', 'Scary statistics without context'],
    structure: ['What it is → How it helps → What to expect → How to take it'],
    tone: 'Empathetic, supportive, educational',
    depth: 'Simple explanations with analogies',
    terminology: 'Plain language with key terms explained',
  },
  'caregiver-professional': {
    leadWith: ['Care protocols', 'Patient support strategies', 'Safety monitoring'],
    emphasize: ['Practical care tips', 'Communication with healthcare team', 'Resource management'],
    avoid: ['Medical jargon', 'Prescribing information', 'Overly clinical focus'],
    structure: ['Care approach → Daily management → Support resources → Communication'],
    tone: 'Supportive, practical, respectful',
    depth: 'Moderate depth with practical focus',
    terminology: 'Clear language with care-focused terms',
  },
  'caregiver-family': {
    leadWith: ['How to support patient', 'What to watch for', 'When to seek help'],
    emphasize: ['Practical support tips', 'Emotional support', 'Resource availability'],
    avoid: ['Medical jargon', 'Clinical protocols', 'Overwhelming detail'],
    structure: ['Understanding condition → Supporting care → Resources → Self-care'],
    tone: 'Empathetic, supportive, reassuring',
    depth: 'Simple practical guidance',
    terminology: 'Plain language with empathy',
  },
};

function getAudienceProfile(audienceType, specialistType) {
  const baseProfile = BASE_AUDIENCE_PROFILES[audienceType] || BASE_AUDIENCE_PROFILES['physician-specialist'];
  if (specialistType && SPECIALIST_PROFILES[specialistType]) {
    return { ...baseProfile, ...SPECIALIST_PROFILES[specialistType] };
  }
  return baseProfile;
}

// ----- CORS -----
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Preflight (OPTIONS)
app.options('/personalize', (req, res) => {
  res.set(corsHeaders).status(204).end();
});

// ----- Main route (POST) -----
app.post('/personalize', async (req, res) => {
  try {
    const { baseContent, assetType, brandId, personalizationFactors, targetAudience, context } = req.body;

    const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Specialist-aware audience profile
    const audienceProfile = getAudienceProfile(
      personalizationFactors?.audience_type || targetAudience || 'physician-specialist',
      context?.specialistType
    );

    // System & user prompts (kept identical in spirit)
    const systemPrompt = buildSystemPrompt(assetType, personalizationFactors, targetAudience, context, audienceProfile);
    const userPrompt = buildUserPrompt(baseContent, personalizationFactors);

    // Lovable AI call (same payload/schema)
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'generate_variation',
              description: 'Generate a personalized content variation',
              parameters: {
                type: 'object',
                properties: {
                  subject: { type: 'string' },
                  headline: { type: 'string' },
                  body: { type: 'string' },
                  keyMessage: { type: 'string' },
                  cta: { type: 'string' },
                  disclaimer: { type: 'string' },
                },
                required: ['headline', 'body', 'cta'],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: 'function', function: { name: 'generate_variation' } },
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);

      if (aiResponse.status === 429) {
        return res
          .set({ ...corsHeaders, 'Content-Type': 'application/json' })
          .status(429)
          .json({ error: 'Rate limits exceeded, please try again later.' });
      }
      if (aiResponse.status === 402) {
        return res
          .set({ ...corsHeaders, 'Content-Type': 'application/json' })
          .status(402)
          .json({ error: 'Payment required, please add funds to your Lovable AI workspace.' });
      }
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const generatedContent = JSON.parse(
      aiData.choices[0]?.message?.tool_calls?.[0]?.function?.arguments || '{}'
    );

    // Performance prediction (same approach)
    const performancePrediction = {
      engagement_score: 75 + Math.random() * 15,
      compliance_score: 85 + Math.random() * 10,
      conversion_likelihood: 60 + Math.random() * 20,
      confidence_level: 80,
    };

    return res
      .set({ ...corsHeaders, 'Content-Type': 'application/json' })
      .status(200)
      .json({ generatedContent, performancePrediction });
  } catch (error) {
    console.error('Error:', error);
    return res
      .set({ ...corsHeaders, 'Content-Type': 'application/json' })
      .status(500)
      .json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// ----- Helper functions (same content logic) -----
function buildSystemPrompt(assetType, factors, targetAudience, context, profile) {
  let prompt = `You are an expert pharmaceutical content strategist creating personalized ${assetType} content for ${targetAudience}.\n\n`;

  // Specialist context
  if (context?.specialistType) {
    prompt += `SPECIALIST CONTEXT: You are writing for ${context.specialistDisplayName ?? context.specialistType} in ${context.therapeuticArea ?? 'medicine'}.\n`;
  }
  if (context?.indication) {
    prompt += `INDICATION: ${context.indication}\n`;
  }

  // Audience guidance
  prompt += `\nCONTENT APPROACH:\n`;
  prompt += `- LEAD WITH: ${profile.leadWith.join(', ')}\n`;
  prompt += `- EMPHASIZE: ${profile.emphasize.join(', ')}\n`;
  prompt += `- AVOID: ${profile.avoid.join(', ')}\n`;
  prompt += `- STRUCTURE: ${profile.structure.join(' → ')}\n`;
  prompt += `- TONE: ${profile.tone}\n`;
  prompt += `- CLINICAL DEPTH: ${profile.depth}\n`;
  prompt += `- TERMINOLOGY: ${profile.terminology}\n\n`;

  // HCP sub-segmentation
  if (factors?.hcp_experience_level) {
    const experienceContext = {
      entry: 'Focus on educational content, guidelines, and foundational evidence. Use clear explanations.',
      mid_career: 'Focus on practical applications, efficiency, and real-world outcomes. Be concise.',
      expert: 'Focus on innovation, strategic insights, and advanced clinical applications. Assume high baseline knowledge.',
    };
    prompt += `Experience Level: ${experienceContext[factors.hcp_experience_level]}\n`;
  }
  if (factors?.hcp_practice_setting) {
    const settingContext = {
      hospital: 'Emphasize acute care protocols, multidisciplinary approaches, and resource availability.',
      clinic: 'Focus on outpatient management, follow-up protocols, and patient convenience.',
      academic: 'Highlight research opportunities, teaching applications, and evidence generation.',
      community: 'Emphasize real-world applicability, cost considerations, and patient accessibility.',
    };
    prompt += `Practice Setting: ${settingContext[factors.hcp_practice_setting]}\n`;
  }

  // Patient sub-segmentation
  if (factors?.patient_disease_stage) {
    const stageContext = {
      newly_diagnosed: 'Use empathetic tone, provide foundational education, and emphasize support resources.',
      active_management: 'Focus on treatment adherence, lifestyle management, and ongoing support.',
      long_term: 'Emphasize quality of life, long-term outcomes, and proactive health management.',
    };
    prompt += `Disease Stage: ${stageContext[factors.patient_disease_stage]}\n`;
  }
  if (factors?.patient_health_literacy) {
    const literacyContext = {
      low: 'Use simple language, avoid medical jargon, include visual aids references.',
      medium: 'Balance plain language with some medical terminology where necessary.',
      high: 'Use appropriate medical terminology, assume understanding of disease processes.',
    };
    prompt += `Health Literacy: ${literacyContext[factors.patient_health_literacy]}\n`;
  }

  // Content optimization
  if (factors?.content_optimization_type) {
    const optimizationContext = {
      subject_line: 'Optimize the subject line for maximum open rates.',
      opening_hook: 'Create a compelling opening that immediately engages the reader.',
      cta_wording: 'Optimize the call-to-action for maximum conversions.',
      content_length: 'Adjust content length based on channel best practices.',
      headline_style: 'Create an engaging headline that captures attention.',
      layout_priority: 'Organize content for optimal flow and engagement.',
      cta_placement: 'Place calls-to-action strategically for maximum impact.',
      fair_balance_placement: 'Optimize placement of fair balance information.',
      slide_flow: 'Ensure logical progression of slides for maximum engagement.',
    };
    prompt += `Optimization Focus: ${optimizationContext[factors.content_optimization_type] ?? factors.content_optimization_type}\n`;
  }

  // Messaging emphasis
  if (factors?.messaging_emphasis) {
    const emphasisContext = {
      clinical_evidence: 'Lead with clinical data, trial results, and evidence-based outcomes.',
      emotional_tone: 'Use empathetic, supportive language that connects emotionally.',
      urgency: 'Create a sense of urgency without being alarmist.',
      benefit_framing: 'Frame content around patient/HCP benefits and positive outcomes.',
    };
    prompt += `Messaging Emphasis: ${emphasisContext[factors.messaging_emphasis]}\n`;
  }

  prompt += '\nGenerate content that is compliant, on-brand, and optimized for the specified personalization factors.';
  return prompt;
}

function buildUserPrompt(baseContent, factors) {
  let prompt = 'Base Content:\n';
  prompt += JSON.stringify(baseContent, null, 2);
  prompt += '\n\nCreate a personalized variation of this content based on the system instructions.';
  if (factors?.test_hypothesis) {
    prompt += `\n\nA/B Test Hypothesis: ${factors.test_hypothesis}`;
  }
  return prompt;
}

// ----- Run server (or export app) -----
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Personalization server listening on :${PORT}`));

export default app;
