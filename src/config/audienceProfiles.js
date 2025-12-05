/**
 * Audience Profiles Configuration (JavaScript)
 *
 * Defines audience profiles and specialist overrides to guide content generation.
 * This file dictates tone, depth, and content priorities for various healthcare professionals (HCPs)
 * and patient/caregiver groups.
 */

// Specialist-specific profile overrides by indication focus
export const SPECIALIST_PROFILES = {
  'oncologist': {
    contentCharacteristics: {
      leadWith: 'Most compelling efficacy data from pivotal oncology trials (OS, PFS, ORR)',
      emphasize: [
        'Overall survival and progression-free survival data',
        'Objective response rates and duration of response',
        'Biomarker and molecular profiling data',
        'Safety profile including grade 3-4 adverse events',
        'Patient selection criteria and treatment sequencing',
        'Mechanism of action and resistance pathways'
      ],
      avoid: [
        'Oversimplifying complex oncology data',
        'Glossing over toxicity profiles',
        'Non-specific tumor types or lines of therapy'
      ],
      structure: 'Lead with survival benefit, follow with response data, detail safety, conclude with patient selection'
    }
  },
  'cardiologist': {
    contentCharacteristics: {
      leadWith: 'Primary cardiovascular outcome data (MACE, stroke reduction, mortality)',
      emphasize: [
        'Cardiovascular outcomes and event reduction',
        'Bleeding risk profiles and benefit-risk balance',
        'Subgroup analyses by cardiovascular risk factors',
        'Mechanism of action on cardiovascular pathways',
        'Drug interactions with common cardiac medications',
        'Real-world cardiovascular outcomes data'
      ],
      avoid: [
        'Minimizing bleeding risks',
        'Over-promising cardiovascular benefits',
        'Ignoring patient-specific risk factors'
      ],
      structure: 'Lead with cardiovascular outcomes, balance with safety, discuss patient selection and monitoring'
    }
  },
  'pulmonologist': {
    contentCharacteristics: {
      leadWith: 'Key respiratory function outcomes (FVC, lung function decline)',
      emphasize: [
        'Pulmonary function test improvements',
        'Disease progression markers',
        'Quality of life and functional capacity',
        'Adverse event profile relevant to respiratory patients',
        'Long-term disease management considerations',
        'Patient phenotyping and treatment response predictors'
      ],
      avoid: [
        'Overstating benefits in heterogeneous lung diseases',
        'Ignoring comorbidity complexities',
        'Minimizing respiratory adverse events'
      ],
      structure: 'Lead with lung function data, discuss disease progression, detail safety and patient monitoring'
    }
  },
  'endocrinologist': {
    contentCharacteristics: {
      leadWith: 'Glycemic control outcomes (HbA1c reduction, glucose control)',
      emphasize: [
        'HbA1c reduction and glucose control metrics',
        'Cardiovascular outcomes in diabetes',
        'Weight management and metabolic effects',
        'Hypoglycemia risk profiles',
        'Renal and cardiovascular protection data',
        'Treatment adherence and patient convenience'
      ],
      avoid: [
        'Overpromising weight loss benefits',
        'Minimizing hypoglycemia risks',
        'Ignoring cardiovascular disease context'
      ],
      structure: 'Lead with glycemic outcomes, cardiovascular benefits, safety profile, patient suitability'
    }
  },
  'dermatologist': {
    contentCharacteristics: {
      leadWith: 'Disease severity reduction metrics (EASI, IGA scores)',
      emphasize: [
        'Disease severity improvement scores',
        'Itch reduction and quality of life improvements',
        'Speed of response and durability',
        'Safety profile for long-term dermatologic use',
        'Patient-reported outcomes',
        'Treatment satisfaction and adherence'
      ],
      avoid: [
        'Overpromising cosmetic outcomes',
        'Minimizing systemic medication risks',
        'Ignoring patient quality of life impact'
      ],
      structure: 'Lead with efficacy scores, discuss patient-reported outcomes, detail safety for chronic use'
    }
  },
  'neurologist': {
    contentCharacteristics: {
      leadWith: 'Stroke prevention or neurological outcome data',
      emphasize: [
        'Stroke risk reduction and prevention data',
        'Bleeding risk in neurological patients',
        'Mechanism of action on neurological pathways',
        'Drug interactions with neurological medications',
        'Cognitive and functional outcomes',
        'Long-term neuroprotection data'
      ],
      avoid: [
        'Minimizing neurological bleeding risks',
        'Overstating neuroprotective effects',
        'Ignoring patient-specific stroke risk factors'
      ],
      structure: 'Lead with stroke prevention data, balance bleeding risk, discuss patient selection and monitoring'
    }
  },
  'ent-specialist': {
    contentCharacteristics: {
      leadWith: 'Symptom improvement and disease control metrics',
      emphasize: [
        'Symptom severity reduction (nasal congestion, polyp scores)',
        'Quality of life improvements',
        'Surgical outcome improvements or alternatives',
        'Safety profile for chronic ENT conditions',
        'Treatment durability and maintenance',
        'Patient-reported symptom control'
      ],
      avoid: [
        'Overpromising surgical avoidance',
        'Minimizing systemic medication effects',
        'Ignoring comorbid respiratory conditions'
      ],
      structure: 'Lead with symptom control, discuss quality of life, detail safety for chronic management'
    }
  }
};

export const BASE_AUDIENCE_PROFILES = {
  'physician-specialist': {
    audienceType: 'physician-specialist',
    displayName: 'Physician - Specialist',
    description: 'Specialists who expect deep clinical rigor and evidence-based medicine',
    defaultTone: 'scientific',
    defaultDepth: 'detailed',
    defaultTerminology: 'technical',
    contentCharacteristics: {
      leadWith: 'Most compelling clinical evidence from pivotal trials',
      emphasize: [
        'Trial methodology and design',
        'Primary/secondary endpoints with statistical significance',
        'Subgroup analyses',
        'Mechanism of action',
        'Safety profile with incidence rates'
      ],
      avoid: [
        'Oversimplified explanations',
        'Marketing language',
        'Emotional appeals',
        'Lay terminology'
      ],
      structure: 'Evidence-led, data-integrated body, peer-level discourse'
    },
    typicalObjectives: [
      'Present new clinical evidence',
      'Update on indication expansion',
      'Share treatment protocol insights'
    ],
    callToActionStyle: 'Professional invitation (e.g., "Review full prescribing information", "Discuss with your representative")'
  },
  
  'physician-primary-care': {
    audienceType: 'physician-primary-care',
    displayName: 'Physician - Primary Care',
    description: 'Primary care physicians who need practical guidance and real-world applicability',
    defaultTone: 'professional',
    defaultDepth: 'moderate',
    defaultTerminology: 'professional',
    contentCharacteristics: {
      leadWith: 'Practical patient management benefits',
      emphasize: [
        'Patient selection criteria',
        'Key efficacy/safety highlights',
        'Real-world applicability',
        'Integration into practice',
        'Actionable clinical insights'
      ],
      avoid: [
        'Excessive trial methodology detail',
        'Overly complex statistical analyses',
        'Specialty-specific jargon'
      ],
      structure: 'Problem-solution format, practical takeaways emphasized'
    },
    typicalObjectives: [
      'Support appropriate patient identification',
      'Simplify treatment decisions',
      'Provide quick reference information'
    ],
    callToActionStyle: 'Action-oriented (e.g., "Access patient starter kit", "Download treatment guide")'
  },

  'pharmacist': {
    audienceType: 'pharmacist',
    displayName: 'Pharmacist',
    description: 'Pharmacists focused on medication management, safety, and patient counseling',
    defaultTone: 'professional',
    defaultDepth: 'detailed',
    defaultTerminology: 'technical',
    contentCharacteristics: {
      leadWith: 'Medication-specific benefits or safety profile',
      emphasize: [
        'Dosing protocols and administration',
        'Drug interactions and contraindications',
        'Adverse event monitoring',
        'Storage and handling requirements',
        'Patient counseling points',
        'Insurance/access considerations'
      ],
      avoid: [
        'Clinical decision-making guidance (physician territory)',
        'Diagnostic criteria',
        'Treatment selection rationale'
      ],
      structure: 'Medication-focused, safety-first, practical application'
    },
    typicalObjectives: [
      'Ensure safe dispensing and administration',
      'Support patient adherence',
      'Provide counseling resources'
    ],
    callToActionStyle: 'Resource-focused (e.g., "Download patient counseling guide", "Access dosing calculator")'
  },

  'nurse-rn': {
    audienceType: 'nurse-rn',
    displayName: 'Registered Nurse',
    description: 'RNs focused on patient care coordination, administration, and monitoring',
    defaultTone: 'professional',
    defaultDepth: 'moderate',
    defaultTerminology: 'professional',
    contentCharacteristics: {
      leadWith: 'Patient care benefits and nursing implications',
      emphasize: [
        'Administration protocols',
        'Patient monitoring requirements',
        'Side effect recognition and management',
        'Patient education needs',
        'Care coordination considerations',
        'Documentation requirements'
      ],
      avoid: [
        'Prescribing information (outside RN scope)',
        'Excessive pharmacology detail',
        'Marketing language'
      ],
      structure: 'Care-focused, practical steps, patient safety emphasis'
    },
    typicalObjectives: [
      'Support safe medication administration',
      'Enhance patient monitoring',
      'Facilitate patient education'
    ],
    callToActionStyle: 'Care-enabling (e.g., "Access patient education materials", "Download administration checklist")'
  },

  'nurse-np-pa': {
    audienceType: 'nurse-np-pa',
    displayName: 'Nurse Practitioner / Physician Assistant',
    description: 'NPs/PAs with prescribing authority who need clinical guidance and practical application',
    defaultTone: 'professional',
    defaultDepth: 'moderate',
    defaultTerminology: 'professional',
    contentCharacteristics: {
      leadWith: 'Clinical benefits and patient management insights',
      emphasize: [
        'Patient selection criteria',
        'Key efficacy and safety data',
        'Prescribing considerations',
        'Monitoring protocols',
        'Patient counseling points',
        'Practice integration'
      ],
      avoid: [
        'Overly complex trial design details',
        'Specialty-specific depth beyond scope',
        'Condescending tone'
      ],
      structure: 'Balanced clinical detail with practical application'
    },
    typicalObjectives: [
      'Support prescribing decisions',
      'Provide patient management guidance',
      'Offer practical resources'
    ],
    callToActionStyle: 'Clinical-practical (e.g., "Review prescribing guide", "Access patient selection tool")'
  },

  'patient': {
    audienceType: 'patient',
    displayName: 'Patient',
    description: 'Patients who need clear, accessible information about their condition and treatment',
    defaultTone: 'empathetic',
    defaultDepth: 'high-level',
    defaultTerminology: 'plain-language',
    contentCharacteristics: {
      leadWith: 'Patient benefit or outcome improvement',
      emphasize: [
        'How treatment helps/works in simple terms',
        'What to expect',
        'Practical guidance for daily life',
        'Support resources available',
        'Empowerment and hope'
      ],
      avoid: [
        'Medical jargon without explanation',
        'Complex statistics',
        'Fear-inducing language',
        'Overwhelming detail'
      ],
      structure: 'Supportive, clear progression, actionable takeaways'
    },
    typicalObjectives: [
      'Educate about condition',
      'Build treatment confidence',
      'Provide support resources'
    ],
    callToActionStyle: 'Supportive-empowering (e.g., "Talk to your doctor", "Get support", "Learn more")'
  },

  'caregiver-family': {
    audienceType: 'caregiver-family',
    displayName: 'Family Caregiver',
    description: 'Family members caring for loved ones who need practical support and guidance',
    defaultTone: 'empathetic',
    defaultDepth: 'moderate',
    defaultTerminology: 'accessible',
    contentCharacteristics: {
      leadWith: 'How this helps the person you care for',
      emphasize: [
        'Practical caregiving guidance',
        'What to watch for/monitor',
        'How to support treatment adherence',
        'Managing side effects at home',
        'Emotional support resources',
        'Self-care for caregivers'
      ],
      avoid: [
        'Medical jargon',
        'Clinical decision guidance',
        'Minimizing caregiver burden',
        'Overly technical detail'
      ],
      structure: 'Empathetic, practical steps, caregiver-focused'
    },
    typicalObjectives: [
      'Support caregiving success',
      'Reduce caregiver burden',
      'Provide practical resources'
    ],
    callToActionStyle: 'Supportive (e.g., "Get caregiver resources", "Join support community", "Download care guide")'
  },

  'caregiver-professional': {
    audienceType: 'caregiver-professional',
    displayName: 'Professional Caregiver',
    description: 'Professional caregivers (CNAs, home health aides) who need clinical guidance for patient support',
    defaultTone: 'professional',
    defaultDepth: 'moderate',
    defaultTerminology: 'professional',
    contentCharacteristics: {
      leadWith: 'Patient care implications and caregiver responsibilities',
      emphasize: [
        'Administration/monitoring protocols',
        'Side effect recognition',
        'Documentation requirements',
        'Communication with healthcare team',
        'Patient safety considerations',
        'Scope of practice considerations'
      ],
      avoid: [
        'Clinical decision-making guidance',
        'Prescribing information',
        'Overly emotional appeals'
      ],
      structure: 'Professional, practical, safety-focused'
    },
    typicalObjectives: [
      'Ensure safe patient care',
      'Support treatment adherence',
      'Facilitate communication'
    ],
    callToActionStyle: 'Professional (e.g., "Access care protocols", "Download monitoring checklist")'
  }
};

/**
 * Get specialist profile with indication-specific overrides
 */
export const getSpecialistProfile = (specialistType, indication) => {
  const baseProfile = BASE_AUDIENCE_PROFILES['physician-specialist'];
  const specialistOverrides = SPECIALIST_PROFILES[specialistType] || {};
  
  // Note: The original TypeScript logic allowed for merging partial overrides.
  // We replicate this merging in JavaScript to ensure base characteristics are maintained.
  
  return {
    ...baseProfile,
    ...specialistOverrides,
    displayName: specialistOverrides.displayName || baseProfile.displayName,
    contentCharacteristics: {
      ...baseProfile.contentCharacteristics,
      ...specialistOverrides.contentCharacteristics
    }
  };
};

/**
 * Get audience profile by type
 */
export const getAudienceProfile = (audienceType) => {
  return BASE_AUDIENCE_PROFILES[audienceType] || null;
};

/**
 * Get all audience types for selection
 */
export const getAllAudienceTypes = () => {
  return Object.values(BASE_AUDIENCE_PROFILES).map(profile => ({
    value: profile.audienceType,
    label: profile.displayName,
    description: profile.description
  }));
};