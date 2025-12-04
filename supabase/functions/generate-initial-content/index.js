
// intelligence-generator.js (Node.js / ESM)
// Converted from your Deno/TypeScript edge function to plain JavaScript,
// preserving the same logic and context.
// Env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, LOVABLE_API_KEY
import express from 'express';
import fetch from 'node-fetch';
import { createClient } from '@supabase/supabase-js';

const app = express();
app.use(express.json());

// ========================================
// PHASE 2: AUDIENCE SOPHISTICATION SYSTEM
// ========================================
const AUDIENCE_SOPHISTICATION_MAP = {
  // HCP Expert Level - Senior specialists
  'Physician-Specialist': 'expert',
  // HCP Standard Level - Primary care, NP/PA
  'Physician-PrimaryCare': 'standard',
  'Nurse-NP-PA': 'standard',
  // HCP Support Level - RNs, Pharmacists
  'Nurse-RN': 'simplified',
  'Pharmacist': 'simplified',
  // Non-HCP
  'Patient': 'patient-friendly',
  'Caregiver-Professional': 'simplified',
  'Caregiver-Family': 'patient-friendly',
};

function getAudienceSophisticationLevel(audience) {
  return AUDIENCE_SOPHISTICATION_MAP[audience] ?? 'standard';
}

// Evidence complexity filtering
const ALLOWED_COMPLEXITIES = {
  expert: ['expert', 'standard'],
  standard: ['standard', 'simplified'],
  simplified: ['simplified', 'patient-friendly'],
  'patient-friendly': [], // NO clinical claims for patients!
};

// Segment type priorities by sophistication
const AUDIENCE_SEGMENT_PRIORITIES = {
  expert: ['efficacy_summary', 'moa', 'trial_methodology', 'biomarker_data', 'pharmacokinetics'],
  standard: ['efficacy_summary', 'safety_profile', 'dosing_instructions', 'indication_statement'],
  simplified: ['dosing_instructions', 'patient_counseling', 'administration_guide', 'monitoring'],
  'patient-friendly': ['patient_benefits', 'lifestyle_guidance', 'support_resources', 'patient_education'],
};

// ========================================
// PHASE 4: AUDIENCE-SPECIFIC AI PROMPTS
// ========================================
function buildAudienceSystemPrompt(sophisticationLevel, targetAudience) {
  const audienceInstructions = {
    expert: `
🎯 TARGET AUDIENCE: Senior specialists with deep clinical expertise
📊 EVIDENCE USAGE RULES:
✅ MUST INCLUDE:
 - Detailed trial methodology and study design
 - P-values, confidence intervals, hazard ratios
 - Subgroup analyses and biomarker data
 - Statistical significance and clinical relevance
 - Comparative efficacy data
✅ CLINICAL DEPTH: Maximum depth with rigorous statistical analysis
✅ TONE: Peer-to-peer, evidence-dense, assumes advanced knowledge
✅ TERMINOLOGY: Full medical terminology, no simplification
❌ FORBIDDEN:
 - Oversimplification of complex data
 - Patient-facing language
 - Vague benefit statements without data
 - Avoiding statistical details
📝 EXAMPLE CONTENT STYLE:
"Phase III multicenter trial (N=1,200) demonstrated statistically significant improvement in PFS
(HR=0.68, 95% CI: 0.52-0.89, p=0.004). Subgroup analysis revealed enhanced efficacy in EGFR+
patients (HR=0.55, p<0.001), with consistent benefit across demographic strata."
`,
    standard: `
🎯 TARGET AUDIENCE: Primary care physicians, NP/PAs with general clinical knowledge
📊 EVIDENCE USAGE RULES:
✅ MUST INCLUDE:
 - Key efficacy outcomes and primary endpoints
 - Clear clinical significance (not just statistical)
 - Practical safety and tolerability data
 - Straightforward patient selection criteria
 - Guideline alignment where relevant
✅ CLINICAL DEPTH: Moderate depth focusing on actionable clinical data
✅ TONE: Professional but accessible, practical application focus
✅ TERMINOLOGY: Standard medical terms with clarity
❌ FORBIDDEN:
 - Overly complex trial methodology
 - Subspecialty-only statistical analysis
 - Information without practical application
 - Patient-facing oversimplification
📝 EXAMPLE CONTENT STYLE:
"Clinical studies demonstrate significant improvement in progression-free survival with a
well-characterized safety profile. Appropriate for EGFR+ NSCLC patients with straightforward
once-daily dosing that supports adherence."
`,
    simplified: `
🎯 TARGET AUDIENCE: Support HCPs (RNs, Pharmacists) focused on implementation
📊 EVIDENCE USAGE RULES:
✅ MUST INCLUDE:
 - Clear dosing and administration protocols
 - Practical patient counseling points
 - Monitoring requirements and schedules
 - Common side effects and management
 - Patient selection basics
✅ CLINICAL DEPTH: Implementation-focused, minimal statistical detail
✅ TONE: Instructional, practical, supportive
✅ TERMINOLOGY: Clear medical terms with practical context
❌ FORBIDDEN:
 - Complex trial methodology
 - Detailed statistical analysis
 - Subspecialty clinical nuance
 - Research-focused content
📝 EXAMPLE CONTENT STYLE:
"Administer once daily with or without food. Monitor patients for common side effects in the
first month. Counsel patients on the importance of adherence and provide written instructions
for administration."
`,
    'patient-friendly': `
🎯 TARGET AUDIENCE: Patients and family caregivers with NO medical background
📊 EVIDENCE USAGE RULES:
✅ MUST INCLUDE ONLY:
 - Benefits and how treatment may help
 - Lifestyle improvements and quality of life
 - Support resources and guidance
 - Clear, empowering language
 - Practical daily living information
✅ CLINICAL DEPTH: Empowering, accessible, benefit-oriented ONLY
✅ TONE: Compassionate, clear, supportive, empowering
✅ TERMINOLOGY: Plain language, avoid ALL medical jargon
⚠️ CRITICAL - ABSOLUTELY FORBIDDEN:
 ❌ NO clinical trial statistics or data
 ❌ NO p-values, confidence intervals, hazard ratios
 ❌ NO mechanism of action details
 ❌ NO prescribing information or medical protocols
 ❌ NO medical terminology or jargon
 ❌ NO "efficacy", "endpoint", "trial" language
📝 EXAMPLE CONTENT STYLE:
"This treatment may help slow disease progression and improve your quality of life. Your care
team will work with you to manage any side effects and support you throughout your journey.
Many patients find that staying connected with support groups can be helpful."
`,
  };

  return `You are a pharmaceutical content generation expert creating content for ${targetAudience} audience.
${audienceInstructions[sophisticationLevel]}
🎯 YOUR MISSION: Generate content that is DISTINCTLY APPROPRIATE for this audience level.
Content for different audiences MUST be significantly different in depth, terminology, and focus.
`;
}

// ========================================
// FALLBACK CONTENT GENERATOR (for when AI parsing fails)
// ========================================
function createFallbackContent(assetType, themeData, intakeContext, sophisticationLevel) {
  const coreMessage =
    themeData?.core_message ??
    intakeContext?.original_key_message ??
    'Important treatment information';
  const therapeuticFocus =
    intakeContext?.indication ??
    themeData?.therapeutic_focus ??
    'your condition';
  const keyBenefits = themeData?.key_benefits ?? [];
  const callToAction =
    themeData?.cta_frameworks?.[0] ??
    intakeContext?.original_cta ??
    'Learn More';
  const isPatient = sophisticationLevel === 'patient-friendly';

  const greeting = isPatient ? 'Dear Patient,' : 'Dear Healthcare Professional,';

  let intro;
  if (isPatient) {
    intro = `We understand that managing ${therapeuticFocus} can be challenging. We are here to provide you with helpful information and resources.`;
  } else {
    intro = `Understanding the latest advances in ${therapeuticFocus} is essential for optimizing patient outcomes.`;
  }

  let benefitsSection = '';
  if (keyBenefits.length > 0) {
    benefitsSection =
      '\n\nKey Benefits:\n' + keyBenefits.slice(0, 3).map((b) => '• ' + b).join('\n');
  }

  const closing = isPatient
    ? '\n\nWe are committed to supporting you on your treatment journey. If you have questions, please speak with your healthcare provider.'
    : '\n\nWe look forward to supporting your clinical practice with evidence-based solutions.';

  const body = greeting + '\n\n' + intro + benefitsSection + closing;

  const disclaimer = isPatient
    ? 'This information is for educational purposes only and is not intended to replace advice from your healthcare provider.'
    : 'This email contains promotional information about prescription medications. Please see full Prescribing Information.';

  return {
    subject: coreMessage.length <= 50 ? coreMessage : coreMessage.substring(0, 47) + '...',
    preheader: keyBenefits[0] ?? 'Important treatment information',
    headline: coreMessage,
    body,
    keyMessage: coreMessage,
    cta: callToAction,
    disclaimer,
  };
}

// ========================================
// ENSURE CONTENT STRUCTURE (fills in any missing fields)
// ========================================
function ensureContentStructure(content, assetType, themeData, intakeContext, sophisticationLevel) {
  const coreMessage =
    themeData?.core_message ??
    intakeContext?.original_key_message ??
    '';
  const therapeuticFocus =
    intakeContext?.indication ??
    themeData?.therapeutic_focus ??
    '';
  const keyBenefits = themeData?.key_benefits ?? [];
  const callToAction =
    themeData?.cta_frameworks?.[0] ??
    intakeContext?.original_cta ??
    'Learn More';
  const isPatient = sophisticationLevel === 'patient-friendly';

  // Subject
  if (!content.subject || content.subject.trim() === '') {
    content.subject =
      coreMessage ??
      ('Important ' + (therapeuticFocus ?? 'Treatment') + ' Information');
  }
  if (content.subject && content.subject.length > 50) {
    content.subject = content.subject.substring(0, 47) + '...';
  }

  // Headline
  if (!content.headline || content.headline.trim() === '') {
    content.headline =
      coreMessage ?? ('Advancing ' + (therapeuticFocus ?? 'Treatment') + ' Care');
  }

  // Body
  if (!content.body || content.body.trim() === '' || content.body.length < 50) {
    const fallback = createFallbackContent(assetType, themeData, intakeContext, sophisticationLevel);
    content.body = fallback.body;
  }

  // KeyMessage
  if (!content.keyMessage || content.keyMessage.trim() === '') {
    content.keyMessage = coreMessage ?? content.headline;
  }

  // CTA
  if (!content.cta || content.cta.trim() === '') {
    content.cta = callToAction;
  }

  // Disclaimer
  if (!content.disclaimer || content.disclaimer.trim() === '') {
    content.disclaimer = isPatient
      ? 'This information is for educational purposes only and is not intended to replace advice from your healthcare provider.'
      : 'This email contains promotional information about prescription medications. Please see full Prescribing Information.';
  }

  // Preheader
  if (!content.preheader || content.preheader.trim() === '') {
    content.preheader = keyBenefits[0] ?? 'Evidence-based clinical insights';
  }
  if (content.preheader && content.preheader.length > 100) {
    content.preheader = content.preheader.substring(0, 97) + '...';
  }

  return content;
}

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ========================================
// INTELLIGENCE CONTEXT BUILDER
// ========================================
function buildIntelligenceContext(intelligenceLayers) {
  if (!intelligenceLayers || intelligenceLayers.length === 0) {
    return '';
  }

  let context = '\n🧠 === STRATEGIC INTELLIGENCE (DATA-DRIVEN) === 🧠\n\n';
  intelligenceLayers.forEach((layer) => {
    if (!layer.incorporated) return;
    const data = typeof layer.intelligence_data === 'object' ? layer.intelligence_data : {};

    switch (layer.intelligence_type) {
      case 'brand':
        context += `
📊 BRAND INTELLIGENCE (Confidence: ${(layer.confidence_score * 100).toFixed(0)}%):
Data Sources: ${layer.data_sources?.join(', ') ?? 'Historical campaigns'}
Historical Performance:
${data.historicalPerformance?.bestPerforming?.map((c) =>
  `- Campaign "${c.campaign}" achieved ${c.metrics.conversion_rate}% conversion with themes: ${c.themes?.join(', ')}`
).join('\n') ?? '- Performance data available'}
Messaging Patterns That Work:
${data.messagingPatterns?.map((p) => `- ${p}`).join('\n') ?? '- Standard messaging'}
Strategic Recommendations:
${data.recommendations?.map((r) => `- ${r}`).join('\n') ?? '- Focus on evidence-based messaging'}
Brand Voice: ${data.brandVoice ?? 'Professional, patient-centric'}
`;
        break;

      case 'competitive':
        context += `
⚔️ COMPETITIVE INTELLIGENCE (Confidence: ${(layer.confidence_score * 100).toFixed(0)}%):
Data Sources: ${layer.data_sources?.join(', ') ?? 'Competitive monitoring'}
Key Competitors:
${data.competitors?.map((c) => `- ${c.name}: ${c.positioning}`).join('\n') ?? '- Competitive landscape available'}
Our Differentiators:
${data.differentiators?.map((d) => `- ${d}`).join('\n') ?? '- Unique clinical profile'}
HCP-Reported Objections:
${data.hcpObjections?.map((o) => `- ${o}`).join('\n') ?? '- Field feedback available'}
Recommended Counter-Messaging:
${data.counterMessaging?.map((m) => `- ${m}`).join('\n') ?? '- Emphasize clinical differentiation'}
`;
        break;

      case 'market':
        context += `
📈 MARKET INTELLIGENCE (Confidence: ${(layer.confidence_score * 100).toFixed(0)}%):
Data Sources: ${layer.data_sources?.join(', ') ?? 'Market analytics'}
Market Trends: ${data.marketTrends ?? 'Market dynamics available'}
Patient Sentiment Analysis:
- Overall Score: ${(data.patientSentiment?.score * 100)?.toFixed(0) ?? 0}%
- Positive: ${(data.patientSentiment?.breakdown?.positive * 100)?.toFixed(0) ?? 0}%
- Neutral: ${(data.patientSentiment?.breakdown?.neutral * 100)?.toFixed(0) ?? 0}%
- Negative: ${(data.patientSentiment?.breakdown?.negative * 100)?.toFixed(0) ?? 0}%
Top Audience Concerns:
${data.audienceConcerns?.map((c) => `- ${c}`).join('\n') ?? '- Patient feedback available'}
Prescription Data: ${data.prescriptionData ?? 'IQVIA data available'}
Recommended Positioning: ${data.positioning ?? 'Evidence-based positioning'}
`;
        break;

      case 'regulatory':
        context += `
⚖️ REGULATORY INTELLIGENCE:
${data.disclaimers ? `Required Disclaimers:\n${data.disclaimers.map((d) => `- ${d}`).join('\n')}` : ''}
${data.fairBalance ? `\nFair Balance: ${data.fairBalance}` : ''}
${data.restrictions ? `\nRestrictions:\n${data.restrictions.map((r) => `- ${r}`).join('\n')}` : ''}
`;
        break;

      case 'public':
        context += `
🌐 PUBLIC DOMAIN INTELLIGENCE:
Trending Patient Topics: ${data.trendingTopics?.join(', ') ?? 'Social listening data available'}
Social Sentiment: ${data.sentiment ?? 'Mixed'}
Common Questions:
${data.commonQuestions?.map((q) => `- ${q}`).join('\n') ?? '- Patient inquiries tracked'}
`;
        break;
    }
  });

  return context;
}

// ----------------------------------------
// Preflight (OPTIONS)
// ----------------------------------------
app.options('/', (req, res) => {
  res.set(corsHeaders).status(204).end();
});

// ----------------------------------------
// Main route (POST)
// ----------------------------------------
app.post('/', async (req, res) => {
  try {
    const {
      brandId,
      themeData,
      intakeContext,
      assetType,
      strategicContext,
      intelligenceLayers,
      preselectedEvidence,
    } = req.body || {};

    console.log('🚀 === GENERATE INITIAL CONTENT WITH FULL EVIDENCE LIBRARY ===');
    console.log('📥 Request:', {
      brandId,
      assetType,
      audience: intakeContext?.intake_audience ?? strategicContext?.targetAudience,
      objective: intakeContext?.intake_objective ?? strategicContext?.campaignObjective,
      hasPIFiltering: !!intakeContext?.piFilteringResult,
      intelligenceLayersCount: intelligenceLayers?.length ?? 0,
      hasPreselectedEvidence: !!preselectedEvidence,
    });

    const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials not configured');
    }
    const supabase = createClient(supabaseUrl, supabaseKey);

    // ========================================
    // PHASE 3: MULTI-DIMENSIONAL EVIDENCE FILTERING
    // ========================================
    const objective =
      strategicContext?.campaignObjective ??
      intakeContext?.intake_objective ??
      'clinical-education';
    const targetAudience =
      strategicContext?.targetAudience ??
      intakeContext?.intake_audience ??
      'Physician-Specialist';
    const sophisticationLevel = getAudienceSophisticationLevel(targetAudience);

    console.log('🎯 Audience Analysis:', { targetAudience, sophisticationLevel, objective });

    // Map objective to claim types (existing logic)
    const claimTypeMap = {
      'clinical-education': ['efficacy', 'mechanism', 'dosing'],
      'evidence-building': ['efficacy', 'comparative'],
      'practice-support': ['dosing', 'safety'],
      awareness: ['indication', 'mechanism'],
      'patient-education': ['indication', 'safety', 'dosing'],
    };
    const relevantClaimTypes = claimTypeMap[objective] ?? ['efficacy', 'mechanism'];

    // Allowed complexity
    const allowedComplexities = ALLOWED_COMPLEXITIES[sophisticationLevel];

    // ----------------------------------------
    // Claims (audience-filtered OR preselected)
    // ----------------------------------------
    let claims = [];
    if (preselectedEvidence?.claimIds && preselectedEvidence.claimIds.length > 0) {
      console.log('📌 Using pre-selected claims:', preselectedEvidence.claimIds);
      const { data: preselectedClaims, error: preselectedError } = await supabase
        .from('clinical_claims')
        .select('*')
        .in('id', preselectedEvidence.claimIds);
      if (preselectedError) {
        console.error('Error fetching preselected claims:', preselectedError);
      } else {
        claims = preselectedClaims ?? [];
      }
    } else {
      let claimsQuery = supabase
        .from('clinical_claims')
        .select('*')
        .eq('brand_id', brandId)
        .in('claim_type', relevantClaimTypes)
        .contains('target_audiences', [targetAudience]);

      // Complexity filter (skip for patient-friendly)
      if (sophisticationLevel !== 'patient-friendly' && allowedComplexities.length > 0) {
        claimsQuery = claimsQuery.in('complexity_level', allowedComplexities);
      }

      const claimLimit =
        sophisticationLevel === 'expert' ? 25 :
        sophisticationLevel === 'patient-friendly' ? 0 : 20;

      const { data: fetchedClaims, error: claimsError } = await claimsQuery
        .order('confidence_score', { ascending: false })
        .limit(claimLimit);

      if (claimsError) {
        console.error('Error fetching claims:', claimsError);
      }
      claims = fetchedClaims ?? [];

      // Fallback to brand-level claims
      if (claims.length === 0 && sophisticationLevel !== 'patient-friendly') {
        console.warn('⚠️ No claims matched audience filter, falling back to brand-level claims');
        const { data: fallbackClaims, error: fallbackError } = await supabase
          .from('clinical_claims')
          .select('*')
          .eq('brand_id', brandId)
          .in('claim_type', relevantClaimTypes)
          .order('confidence_score', { ascending: false })
          .limit(15);
        if (fallbackError) {
          console.error('Error fetching fallback claims:', fallbackError);
        } else {
          claims = fallbackClaims ?? [];
          console.log('📌 Using fallback brand-level claims:', claims.length);
        }
      }
    }

    console.log('✅ Claims fetched (audience-filtered):', {
      count: claims?.length ?? 0,
      targetAudience,
      complexities: [...new Set((claims ?? []).map((c) => c.complexity_level))] ?? [],
      claimTypes: [...new Set((claims ?? []).map((c) => c.claim_type))] ?? [],
    });

    // ----------------------------------------
    // Segments (audience-appropriate)
    // ----------------------------------------
    const preferredSegmentTypes = AUDIENCE_SEGMENT_PRIORITIES[sophisticationLevel];
    const { data: segments, error: segmentsError } = await supabase
      .from('content_segments')
      .select('*')
      .eq('brand_id', brandId)
      .in('segment_type', preferredSegmentTypes)
      .contains('audience_appropriateness', [targetAudience])
      .order('usage_count', { ascending: false })
      .limit(5);
    if (segmentsError) {
      console.error('Error fetching segments:', segmentsError);
    }
    console.log('✅ Segments fetched:', {
      count: segments?.length ?? 0,
      types: [...new Set((segments ?? []).map((s) => s.segment_type))] ?? [],
      readingLevels: [...new Set((segments ?? []).map((s) => s.reading_level))] ?? [],
    });

    // ----------------------------------------
    // References (by brand_id)
    // ----------------------------------------
    let references = [];
    if (sophisticationLevel !== 'patient-friendly') {
      const { data: refs, error: refsError } = await supabase
        .from('clinical_references')
        .select('*')
        .eq('brand_id', brandId)
        .order('publication_year', { ascending: false })
        .limit(25);
      if (refsError) {
        console.error('Error fetching references:', refsError);
      }
      references = refs ?? [];
      console.log('✅ References fetched (by brand_id):', {
        count: references.length,
        sampleIds: references.slice(0, 3).map((r) => r.reference_id_display),
      });
    }

    // ----------------------------------------
    // Content Modules (audience-filtered OR preselected)
    // ----------------------------------------
    let contentModules = [];
    if (preselectedEvidence?.moduleIds && preselectedEvidence.moduleIds.length > 0) {
      console.log('📌 Using pre-selected modules:', preselectedEvidence.moduleIds);
      const { data: preselectedModules, error: preselectedError } = await supabase
        .from('content_modules')
        .select('*')
        .in('id', preselectedEvidence.moduleIds);
      if (preselectedError) {
        console.error('Error fetching preselected modules:', preselectedError);
      } else {
        contentModules = preselectedModules ?? [];
      }
    } else if (sophisticationLevel !== 'patient-friendly') {
      const { data: modules, error: modulesError } = await supabase
        .from('content_modules')
        .select('*')
        .eq('brand_id', brandId)
        .eq('mlr_approved', true)
        .contains('applicable_audiences', [targetAudience])
        .order('usage_score', { ascending: false })
        .limit(20);
      if (modulesError) {
        console.error('Error fetching content modules:', modulesError);
      }
      contentModules = modules ?? [];
      console.log('✅ Content Modules fetched (audience-filtered):', {
        count: contentModules.length,
        targetAudience,
        types: [...new Set(contentModules.map((m) => m.module_type))],
      });
    }

    // ----------------------------------------
    // Visual Assets (audience-filtered OR preselected)
    // ----------------------------------------
    let visualAssets = [];
    if (preselectedEvidence?.visualAssetIds && preselectedEvidence.visualAssetIds.length > 0) {
      console.log('📌 Using pre-selected visual assets:', preselectedEvidence.visualAssetIds);
      const { data: preselectedVisuals, error: preselectedError } = await supabase
        .from('visual_assets')
        .select('id, visual_type, title, caption, applicable_asset_types, applicable_audiences, mlr_approved, usage_count')
        .in('id', preselectedEvidence.visualAssetIds);
      if (preselectedError) {
        console.error('Error fetching preselected visual assets:', preselectedError);
      } else {
        visualAssets = preselectedVisuals ?? [];
      }
    } else {
      const { data: audienceVisuals, error: audienceVisualsError } = await supabase
        .from('visual_assets')
        .select('id, visual_type, title, caption, applicable_asset_types, applicable_audiences, mlr_approved, usage_count')
        .eq('brand_id', brandId)
        .contains('applicable_audiences', [targetAudience])
        .order('usage_count', { ascending: false })
        .limit(20);
      if (audienceVisualsError) {
        console.error('Error fetching audience-filtered visual assets:', audienceVisualsError);
      }
      if (!audienceVisuals || audienceVisuals.length === 0) {
        const { data: allVisuals, error: allVisualsError } = await supabase
          .from('visual_assets')
          .select('id, visual_type, title, caption, applicable_asset_types, applicable_audiences, mlr_approved, usage_count')
          .eq('brand_id', brandId)
          .order('usage_count', { ascending: false })
          .limit(20);
        if (allVisualsError) {
          console.error('Error fetching all visual assets:', allVisualsError);
        }
        visualAssets = allVisuals ?? [];
        console.log('⚠️ Using fallback: all visual assets (no audience-specific found)');
      } else {
        visualAssets = audienceVisuals;
      }
    }

    console.log('✅ Visual Assets fetched:', {
      count: visualAssets.length,
      targetAudience,
      types: [...new Set(visualAssets.map((v) => v.visual_type))],
    });

    // ----------------------------------------
    // Performance Intelligence
    // ----------------------------------------
    let performanceData = [];
    const { data: perfData, error: perfError } = await supabase
      .from('campaign_performance_analytics')
      .select('*')
      .eq('brand_id', brandId)
      .order('engagement_score', { ascending: false, nullsFirst: false })
      .limit(10);
    if (perfError) {
      console.error('Error fetching performance data:', perfError);
    }
    performanceData = perfData ?? [];
    console.log('✅ Performance Intelligence fetched:', {
      count: performanceData.length,
      topEngagement: performanceData[0]?.engagement_score,
    });

    // ----------------------------------------
    // Competitive Intelligence
    // ----------------------------------------
    let competitiveData = [];
    const { data: compData, error: compError } = await supabase
      .from('competitive_intelligence_enriched')
      .select('*')
      .eq('brand_id', brandId)
      .eq('status', 'active')
      .order('discovered_at', { ascending: false })
      .limit(5);
    if (compError) {
      console.error('Error fetching competitive intelligence:', compError);
    }
    competitiveData = compData ?? [];
    console.log('✅ Competitive Intelligence fetched:', {
      count: competitiveData.length,
      competitors: [...new Set(competitiveData.map((c) => c.competitor_name))],
    });

    // ----------------------------------------
    // Build audience-specific evidence context
    // ----------------------------------------
    let evidenceContext = '';
    if (sophisticationLevel === 'patient-friendly') {
      evidenceContext = `
AVAILABLE PATIENT SUPPORT CONTENT:
${segments?.map((s) => `- ${s.segment_text}`).join('\n') ?? 'Focus on benefits, support, and empowerment'}
⚠️ CRITICAL INSTRUCTION: Do NOT include ANY clinical trial data, statistics, or medical terminology.
Focus ONLY on benefits, lifestyle improvements, and support resources.
`;
    } else {
      evidenceContext = `
CLINICAL EVIDENCE AVAILABLE (${sophisticationLevel} level):
📊 CLINICAL CLAIMS FOR CITATION (${claims?.length ?? 0}):
${claims?.filter((c) => c.claim_id_display).slice(0, 8).map((c) =>
  `- [CLAIM:${c.claim_id_display}]: "${(c.claim_text ?? '').substring(0, 150)}..." (${c.claim_type}, confidence: ${c.confidence_score})`
).join('\n') ?? 'No claims with display IDs available'}
📚 CLINICAL REFERENCES (${references.length}):
${references.slice(0, 8).map((r) =>
  `- [REF:${r.reference_id_display ?? r.id?.substring(0, 8)}]: ${r.formatted_citation ?? (r.reference_text ?? '').substring(0, 150)}${r.publication_year ? ` (${r.publication_year})` : ''}`
).join('\n') ?? 'No references available'}
📦 MLR-APPROVED CONTENT MODULES (${contentModules.length}):
${contentModules.slice(0, 6).map((m) =>
  `- [MODULE:${m.id.substring(0, 8)}] [${m.module_type}]: "${(m.module_text ?? '').substring(0, 120)}..."`
).join('\n') ?? 'No MLR-approved modules available'}
📊 VISUAL ASSETS AVAILABLE (${visualAssets.length}):
${visualAssets.slice(0, 6).map((v) =>
  `- [VISUAL:${v.id.substring(0, 8)}] ${v.title ?? 'Untitled'} (${v.visual_type})${v.mlr_approved ? ' ✓MLR' : ''}`
).join('\n') ?? 'No visual assets available'}
🧩 CONTENT SEGMENTS (${segments?.length ?? 0}):
${segments?.map((s) => `- [${s.segment_type}] ${(s.segment_text ?? '').substring(0, 150)}...`).join('\n') ?? 'No segments available'}
EVIDENCE USAGE INSTRUCTION:
- Use evidence appropriate for ${sophisticationLevel} audience level
- Embed citations using [CLAIM:CML-XXXX] format IMMEDIATELY after supporting statements
- Reference visual assets by title when describing data (e.g., "as shown in the Efficacy Chart")
- You may incorporate MLR-approved module text verbatim for key sections
${sophisticationLevel === 'expert' ? '- Include detailed methodology and statistics.' : ''}
${sophisticationLevel === 'standard' ? '- Focus on key outcomes with practical application.' : ''}
${sophisticationLevel === 'simplified' ? '- Focus on implementation and practical guidance.' : ''}
`;
    }

    // ----------------------------------------
    // Build intelligence context from real data
    // ----------------------------------------
    const intelligenceContext = buildIntelligenceContext(intelligenceLayers ?? []);

    // ----------------------------------------
    // Generate content with audience-specific prompt + intelligence
    // ----------------------------------------
    const systemPrompt = buildAudienceSystemPrompt(sophisticationLevel, targetAudience);
    const userPrompt = `
Generate pharmaceutical marketing content for a ${assetType} asset.
STRATEGIC CONTEXT:
- Objective: ${objective}
- Target Audience: ${targetAudience} (${sophisticationLevel} level)
- Indication: ${intakeContext?.indication ?? themeData?.therapeutic_focus ?? 'Not specified'}
- Brand: ${themeData?.brand_name ?? 'Not specified'}
${intelligenceContext}
THEME GUIDANCE:
- Core Message: ${themeData?.core_message ?? intakeContext?.original_key_message ?? 'Not specified'}
- Key Benefits: ${themeData?.key_benefits?.join(', ') ?? 'Not specified'}
- Call to Action: ${themeData?.cta_frameworks?.[0] ?? intakeContext?.original_cta ?? 'Learn more'}
${evidenceContext}
🎯 INTELLIGENCE-DRIVEN REQUIREMENTS:
${intelligenceLayers && intelligenceLayers.length > 0 ? `
1. Content MUST reflect insights from the ${intelligenceLayers.length} intelligence layer(s) provided above
2. Address competitive threats and market positioning identified in intelligence
3. Leverage historical performance patterns to optimize messaging
4. Ensure regulatory compliance based on intelligence guidance
5. Respond to patient/HCP concerns surfaced in market intelligence
` : 'No intelligence layers provided - generate using standard best practices.'}
📌 CITATION EMBEDDING INSTRUCTIONS (CRITICAL - FOLLOW EXACTLY):
1. FORMAT: Use EXACTLY this format: [CLAIM:CML-XXXX]
2. PLACEMENT: Place marker IMMEDIATELY after the statement it supports (no space before bracket)
3. ONE PER MARKER: Each [CLAIM:XXX] marker contains only ONE claim ID - NEVER comma-separated
4. UNIQUE USAGE: Each claim ID should only be used once in the content
✅ CORRECT EXAMPLES:
- "demonstrated significant efficacy[CLAIM:CML-0207] with favorable tolerability[CLAIM:CML-0108]"
- "reduction in viral load[CLAIM:CML-0164]"
❌ WRONG - NEVER DO THIS:
- "[CLAIM:CML-0207, CLAIM:CML-0108]" (NO comma-separated claims!)
- "citationsUsed: [CML-0207]" (DON'T append to body text!)
- "[CLAIM: CML-0207]" (NO space after colon!)
Available claims for citation (use these EXACT IDs - select most relevant):
${claims?.filter((c) => c.claim_id_display).map((c) => `- ${c.claim_id_display}: ${(c.claim_text ?? '').substring(0, 80)}...`).join('\n') ?? 'No claims available'}
REQUIRED OUTPUT FORMAT - Return a valid JSON object based on asset type:
${assetType === 'website-landing-page' ? `
FOR WEBSITE LANDING PAGE:
{
 "heroHeadline": "Concise, powerful headline focused on primary benefit (max 80 chars)",
 "heroSubheadline": "Supporting value proposition explaining the benefit (max 150 chars, MUST be different from heroHeadline)",
 "heroCta": "Primary call to action button text (e.g., 'Learn More', 'Get Started')",
 "diseaseOverview": "Educational content about the condition/disease state with clinical context${(targetAudience === 'Patient' || targetAudience === 'Caregiver-Family') ? ' (patient-friendly language)' : ' (professional medical language)'}",
 "treatmentApproach": "Information about treatment approach and mechanism${targetAudience === 'Physician-Specialist' ? ' WITH [CLAIM:CML-XXXX] markers for efficacy data' : ''}",
 "clinicalEvidence": "Key clinical trial data and efficacy evidence${targetAudience === 'Physician-Specialist' ? ' WITH [CLAIM:CML-XXXX] markers' : ' (simplified for patients)'}",
 "safetyInformation": "Important safety information, warnings, and contraindications",
 "pageTitle": "SEO-optimized page title (brand + value prop, max 60 chars)",
 "metaDescription": "SEO-optimized meta description for search snippets (max 160 chars)",
 "body": "Optional additional content or supporting paragraphs",
 "cta": "Secondary CTA text",
 "disclaimer": "Legal disclaimer and fair balance statement",
 "citationsUsed": ["CML-0207", "CML-0108"],
 "modulesReferenced": ["module_id_1"],
 "visualsReferenced": ["visual_id_1", "visual_id_2"]
}
WEBSITE CONTENT GUIDELINES:
- heroHeadline MUST be different from heroSubheadline (headline is concise hook, subheadline explains benefit)
- diseaseOverview should educate about condition (2-3 paragraphs)
- treatmentApproach should explain how treatment works (mechanism, dosing)
- clinicalEvidence should cite trial data with [CLAIM:CML-XXXX] markers for HCPs
- pageTitle format: "[Brand] [Benefit] | [Indication]"
- metaDescription should be compelling search snippet with key benefit
- Reference specific visual assets by ID in visualsReferenced array
` : assetType === 'social-media-post' ? `
FOR SOCIAL MEDIA POST:
{
 "headline": "Post headline/hook (max 100 chars)",
 "bodyText": "Main post content optimized for social (max 280 chars for Twitter, 3000 for LinkedIn)",
 "hashtags": "#relevant #hashtags #here",
 "platform": "linkedin",
 "cta": "Call to action text",
 "imageSpecs": "Recommended image: [type, dimensions, style]",
 "disclaimer": "Educational content disclaimer",
 "citationsUsed": [],
 "modulesReferenced": [],
 "visualsReferenced": ["visual_id_1"]
}
` : `
FOR EMAIL/DEFAULT:
{
 "subject": "Email subject line (max 50 chars)",
 "preheader": "Email preheader (max 100 chars)",
 "headline": "Main headline",
 "body": "Full body content WITH [CLAIM:CML-XXXX] markers embedded",
 "cta": "Call to action text",
 "keyMessage": "Core message summary",
 "disclaimer": "Required disclaimer text",
 "citationsUsed": ["CML-0207", "CML-0108"],
 "modulesReferenced": ["module_id_1"],
 "visualsReferenced": ["visual_id_1", "visual_id_2"]
}
`}
CRITICAL: ${assetType === 'website-landing-page'
      ? 'Website pages must have distinct heroHeadline and heroSubheadline. Include citation markers in clinical sections for HCP audiences. SEO fields must be optimized for search.'
      : assetType === 'social-media-post'
      ? 'Social posts should be concise, engaging, and include hashtags. Focus on educational content without clinical claims.'
      : 'The "body" field MUST contain the citation markers embedded in the text. The "citationsUsed" array should list which claim IDs you used.'}
`;

    console.log('🤖 Calling AI with full evidence library context...');
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!aiResponse.ok) {
      throw new Error(`AI generation failed: ${aiResponse.statusText}`);
    }

    const aiResult = await aiResponse.json();
    const generatedText = aiResult.choices?.[0]?.message?.content ?? '';
    console.log('📝 Raw AI response length:', generatedText.length);

    // Parse JSON response
    let generatedContent = {};
    let parsedCitationsUsed = [];
    let parsedModulesReferenced = [];
    let parsedVisualsReferenced = [];
    try {
      // Try parsing full text first; if it fails, try extracting a JSON block
      let parsed = null;
      try {
        parsed = JSON.parse(generatedText);
      } catch {
        const jsonMatch = generatedText.match(/{[\s\S]*}/);
        if (jsonMatch) {
          parsed = JSON.parse(jsonMatch[0]);
        }
      }

      if (parsed) {
        generatedContent = parsed;
        parsedCitationsUsed = parsed.citationsUsed ?? [];
        parsedModulesReferenced = parsed.modulesReferenced ?? [];
        parsedVisualsReferenced = parsed.visualsReferenced ?? [];
      } else {
        throw new Error('No JSON payload in AI response');
      }
    } catch (e) {
      console.error('Failed to parse AI response as JSON:', e);
      generatedContent = createFallbackContent(assetType, themeData, intakeContext, sophisticationLevel);
    }

    // Ensure required fields
    generatedContent = ensureContentStructure(
      generatedContent,
      assetType,
      themeData,
      intakeContext,
      sophisticationLevel
    );

    // Social mapping
    if (assetType === 'social-media-post') {
      if (!generatedContent.bodyText && generatedContent.body) {
        generatedContent.bodyText = generatedContent.body;
      }
      if (!generatedContent.hashtags) {
        generatedContent.hashtags = `#${(intakeContext?.indication ?? 'Health').replace(/\s+/g, '')} #HealthcareInnovation`;
      }
      if (!generatedContent.platform) {
        generatedContent.platform = 'LinkedIn';
      }
      if (!generatedContent.imageSpecs) {
        generatedContent.imageSpecs = 'Recommended: 1200x627px professional healthcare image';
      }
      // Patient content should not carry claims
      if (sophisticationLevel === 'patient-friendly') {
        parsedCitationsUsed = [];
      }
    }

    // Validation for patient-friendly
    if (sophisticationLevel === 'patient-friendly') {
      const forbiddenTerms = ['p-value', 'CI:', 'hazard ratio', 'trial', 'efficacy', 'endpoint'];
      const contentText = JSON.stringify(generatedContent).toLowerCase();
      const foundForbidden = forbiddenTerms.filter((term) => contentText.includes(term.toLowerCase()));
      if (foundForbidden.length > 0) {
        console.warn('⚠️ VALIDATION WARNING: Patient content contains clinical terms:', foundForbidden);
      }
    }

    // Build usedEvidence
    const usedClaimsData = (claims ?? []).filter(
      (c) => c.claim_id_display && parsedCitationsUsed.includes(c.claim_id_display)
    ) ?? [];

    const patientSegmentsData =
      sophisticationLevel === 'patient-friendly' && segments
        ? segments
            .filter((s) =>
              ['patient_benefits', 'lifestyle_guidance', 'support_resources', 'patient_education'].includes(s.segment_type)
            )
            .slice(0, 5)
        : [];

    const recommendedVisualsData =
      visualAssets && visualAssets.length > 0
        ? visualAssets
            .filter(
              (v) =>
                parsedVisualsReferenced.includes(v.id) ||
                (v.applicable_audiences && v.applicable_audiences.includes(targetAudience))
            )
            .slice(0, 3)
        : [];

    // Performance patterns
    const { data: performancePatterns } = await supabase
      .from('content_success_patterns')
      .select('pattern_name, description, avg_performance_lift')
      .eq('brand_id', brandId)
      .order('avg_performance_lift', { ascending: false })
      .limit(3);

    // Competitive insights
    const { data: competitiveInsights } = await supabase
      .from('competitive_intelligence_enriched')
      .select('title, content, competitor_name')
      .eq('brand_id', brandId)
      .order('created_at', { ascending: false })
      .limit(2);

    // If AI didn't report citations but body has markers, try to extract
    if ((usedClaimsData ?? []).length === 0 && generatedContent.body) {
      const bodyMarkers = generatedContent.body.match(/\[CLAIM:(CML-[A-Za-z0-9]+)\]/g) ?? [];
      const extractedIds = bodyMarkers
        .map((m) => m.match(/CML-[A-Za-z0-9]+/)?.[0])
        .filter(Boolean);
      if (extractedIds.length > 0) {
        const matchedClaims = (claims ?? []).filter(
          (c) => c.claim_id_display && extractedIds.includes(c.claim_id_display)
        ) ?? [];
        usedClaimsData.push(...matchedClaims);
      }
    }

    // Modules referenced
    const usedModulesData = (contentModules ?? []).filter((m) =>
      parsedModulesReferenced.some((id) => m.id.startsWith(id))
    );

    // Visuals referenced
    const usedVisualsData =
      visualAssets && visualAssets.length > 0
        ? visualAssets.filter((v) => parsedVisualsReferenced.includes(v.id))
        : [];
    const finalVisualsData = usedVisualsData.length > 0 ? usedVisualsData : recommendedVisualsData;

    // References linked to used claims
    const usedReferencesData = (references ?? []).filter((r) =>
      (usedClaimsData ?? []).some((c) => c.id === r.claim_id)
    ) ?? [];

    // Metadata
    const metadata = {
      sophisticationLevel,
      targetAudience,
      objective,
      piFilteringUsed: !!intakeContext?.piFilteringResult,
      piRelevanceScore: intakeContext?.piFilteringResult?.relevanceScore,
      evidenceUsed: {
        claimsCount: usedClaimsData.length,
        claimComplexities: [...new Set((usedClaimsData ?? []).map((c) => c.complexity_level))] ?? [],
        segmentsCount: patientSegmentsData.length,
        segmentTypes: [...new Set(patientSegmentsData.map((s) => s.segment_type))] ?? [],
        referencesCount: references.length,
        modulesCount: usedModulesData.length,
        visualsCount: finalVisualsData.length,
        performanceCount: performancePatterns?.length ?? 0,
        competitiveCount: competitiveInsights?.length ?? 0,
      },
      generatedAt: new Date().toISOString(),
    };

    console.log('✅ Content generated with full evidence attribution:', {
      claimsUsed: usedClaimsData.length,
      segmentsUsed: patientSegmentsData.length,
      referencesAvailable: references.length,
      modulesUsed: usedModulesData.length,
      visualsUsed: finalVisualsData.length,
      performancePatterns: performancePatterns?.length ?? 0,
      competitiveInsights: competitiveInsights?.length ?? 0,
    });

    // Intelligence Attribution
    const relevantPerformance = (performanceData ?? [])
      .filter(
        (p) =>
          (!p.campaign_type ||
            p.campaign_type.toLowerCase().includes(objective.toLowerCase())) ||
          p.campaign_name?.toLowerCase().includes(targetAudience.toLowerCase())
      )
      .slice(0, 3);

    const relevantCompetitive = (competitiveData ?? [])
      .filter((c) => c.threat_level && ['high', 'medium'].includes(c.threat_level.toLowerCase()))
      .slice(0, 2);

    console.log('📈 Intelligence Attribution:', {
      performanceUsed: relevantPerformance.length,
      competitiveUsed: relevantCompetitive.length,
    });

    // Build comprehensive usedEvidence summary
    const usedEvidence = {
      claims: (usedClaimsData ?? []).map((c) => ({
        claimId: c.id,
        claimDisplayId: c.claim_id_display,
        claimText: c.claim_text,
        linkedReferences: (references ?? [])
          .filter((r) => r.claim_id === c.id)
          .map((r) => ({
            referenceId: r.id,
            referenceDisplayId: r.reference_id_display,
            formattedCitation: r.formatted_citation,
          })),
      })),
      segments: patientSegmentsData.map((s) => ({
        segmentId: s.id,
        segmentType: s.segment_type,
        segmentText: (s.segment_text ?? '').substring(0, 200),
      })),
      references: usedReferencesData,
      modules: usedModulesData,
      visuals: finalVisualsData.map((v) => ({
        visualId: v.id,
        visualTitle: v.title ?? 'Untitled Visual',
        visualType: v.visual_type ?? 'table',
      })),
      performance: (performancePatterns ?? []).map((p) => ({
        patternName: p.pattern_name,
        description: p.description ?? '',
        performanceLift: p.avg_performance_lift ?? 0,
      })),
      competitive: (competitiveInsights ?? []).map((c) => ({
        insight: c.title ?? '',
        competitor: c.competitor_name ?? 'Competitor',
        content: c.content?.substring(0, 150) ?? '',
      })),
    };

    // Final response (same shape as original)
    return res
      .set({ ...corsHeaders, 'Content-Type': 'application/json' })
      .status(200)
      .json({
        success: true,
        content: generatedContent,
        metadata,
        usedEvidence: {
          claims: (usedClaimsData ?? []).map((c) => ({
            id: c.id,
            display_id: c.claim_id_display,
            text: c.claim_text,
            type: c.claim_type,
            confidence: c.confidence_score,
          })),
          references: (references ?? []).map((r, idx) => ({
            id: r.id,
            display_id: r.reference_id_display ?? `REF-${String(idx + 1).padStart(4, '0')}`,
            text: r.reference_text,
            formatted_citation: r.formatted_citation,
            publication_year: r.publication_year,
            journal: r.journal,
            authors: r.authors,
          })),
          modules: usedModulesData.map((m) => ({
            id: m.id,
            type: m.module_type,
            text: m.module_text,
            mlr_approved: m.mlr_approved,
            usage_score: m.usage_score,
          })),
          visuals: usedVisualsData.map((v) => ({
            id: v.id,
            type: v.visual_type,
            title: v.title,
            caption: v.caption,
            mlr_approved: v.mlr_approved,
          })),
          segments: (segments ?? []).map((s) => ({
            id: s.id,
            type: s.segment_type,
            text: (s.segment_text ?? '').substring(0, 100),
          })) ?? [],
          performance: relevantPerformance.map((p) => ({
            id: p.id,
            campaign_name: p.campaign_name,
            engagement_score: p.engagement_score,
            open_rate: p.open_rate,
            click_rate: p.click_rate,
            conversion_rate: p.conversion_rate,
            campaign_type: p.campaign_type,
          })),
          competitive: relevantCompetitive.map((c) => ({
            id: c.id,
            competitor_name: c.competitor_name,
            intelligence_type: c.intelligence_type,
            threat_level: c.threat_level,
            title: c.title,
            content: c.content?.substring(0, 200),
          })),
        },
      });
  } catch (error) {
    console.error('❌ Error in generate-initial-content:', error);
    return res
      .set({ ...corsHeaders, 'Content-Type': 'application/json' })
      .status(500)
      .json({ error: error?.message ?? 'Unknown error' });
  }
});

