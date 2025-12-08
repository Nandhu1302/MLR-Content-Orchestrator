// ...existing code...
import { isHCPAudience, isCaregiverAudience } from '@/utils/audienceTypeHelpers';

export const AUDIENCE_ASSET_RULES = [
  // Mass Email Rules
  {
    assetType: 'mass-email',
    allowedAudiences: ['Physician-Specialist', 'Physician-PrimaryCare', 'Pharmacist', 'Nurse-RN', 'Nurse-NP-PA'],
    primaryAudience: 'Physician-Specialist',
    complianceLevel: 'high',
    regulatoryRestrictions: ['MLR approval required', 'Fair balance mandatory', 'ISI placement rules'],
    recommendedMarkets: ['US', 'EU', 'UK', 'Canada'],
    reasoning: 'Mass emails to HCPs are regulated promotional communications requiring strict compliance oversight'
  },
  // Rep-Triggered Email Rules
  {
    assetType: 'rep-triggered-email',
    allowedAudiences: ['Physician-Specialist', 'Physician-PrimaryCare', 'Pharmacist', 'Nurse-RN', 'Nurse-NP-PA'],
    primaryAudience: 'Physician-Specialist',
    complianceLevel: 'high',
    regulatoryRestrictions: ['MLR approval required', 'Fair balance mandatory', 'Rep training required'],
    recommendedMarkets: ['US', 'EU', 'UK', 'Canada'],
    reasoning: 'Rep-triggered emails are direct HCP communications requiring MLR approval and rep compliance training'
  },
  // Patient Email Rules
  {
    assetType: 'patient-email',
    allowedAudiences: ['Patient'],
    primaryAudience: 'Patient',
    complianceLevel: 'medium',
    regulatoryRestrictions: ['Patient privacy compliance', 'Clear opt-out mechanisms', 'Educational focus required'],
    recommendedMarkets: ['US', 'EU', 'UK', 'Canada'],
    reasoning: 'Patient emails focus on education and support rather than promotional content, requiring privacy compliance'
  },
  // Caregiver Email Rules
  {
    assetType: 'caregiver-email',
    allowedAudiences: ['Caregiver-Professional', 'Caregiver-Family'],
    primaryAudience: 'Caregiver-Professional',
    complianceLevel: 'medium',
    regulatoryRestrictions: ['Privacy compliance', 'Supportive content focus', 'Clear disclaimers'],
    recommendedMarkets: ['US', 'EU', 'UK', 'Canada'],
    reasoning: 'Caregiver emails provide support resources and education, emphasizing emotional support over promotional content'
  },
  // Social Media Post Rules
  {
    assetType: 'social-media-post',
    allowedAudiences: ['Physician-Specialist', 'Physician-PrimaryCare', 'Pharmacist', 'Nurse-RN', 'Nurse-NP-PA', 'Patient', 'Caregiver-Professional', 'Caregiver-Family'],
    primaryAudience: 'Patient',
    complianceLevel: 'medium',
    regulatoryRestrictions: ['Character limits apply', 'Platform-specific rules', 'Monitoring required'],
    recommendedMarkets: ['US', 'EU', 'UK', 'Canada'],
    reasoning: 'Social media can target multiple audiences but requires careful content adaptation per audience type'
  },
  // Website Landing Page Rules
  {
    assetType: 'website-landing-page',
    allowedAudiences: ['Physician-Specialist', 'Physician-PrimaryCare', 'Pharmacist', 'Nurse-RN', 'Nurse-NP-PA', 'Patient', 'Caregiver-Professional', 'Caregiver-Family'],
    primaryAudience: 'Patient',
    complianceLevel: 'medium',
    regulatoryRestrictions: ['Age-gating for HCP content', 'ISI placement', 'Accessibility compliance'],
    recommendedMarkets: ['US', 'EU', 'UK', 'Canada'],
    reasoning: 'Websites can serve multiple audiences with proper content segmentation and compliance measures'
  },
  // Digital Sales Aid Rules
  {
    assetType: 'digital-sales-aid',
    allowedAudiences: ['Physician-Specialist', 'Physician-PrimaryCare', 'Pharmacist', 'Nurse-RN', 'Nurse-NP-PA'],
    primaryAudience: 'Physician-Specialist',
    complianceLevel: 'high',
    regulatoryRestrictions: ['MLR approval required', 'Fair balance mandatory', 'Rep training required', 'Veeva Vault compliance'],
    recommendedMarkets: ['US', 'EU', 'UK', 'Canada'],
    reasoning: 'Digital sales aids are HCP-only promotional tools requiring comprehensive MLR approval and rep training'
  }
];

export const ASSET_AUDIENCE_DESCRIPTIONS = [
  // HCP - Mass Email
  {
    assetType: 'mass-email',
    audience: 'Physician-Specialist',
    name: 'HCP Mass Email Campaign',
    description: 'Large-scale promotional email communications sent to healthcare professional segments',
    examples: ['Product launch announcements', 'Clinical data updates', 'Conference invitations', 'Educational webinar invites'],
    complianceNotes: ['Requires MLR approval', 'Fair balance mandatory', 'ISI placement critical', 'CAN-SPAM compliance'],
    channelRecommendations: ['Medical affairs email lists', 'Specialty-specific databases', 'Opt-in professional networks']
  },
  // HCP - Rep-Triggered Email
  {
    assetType: 'rep-triggered-email',
    audience: 'Physician-Specialist',
    name: 'HCP Rep-Triggered Email',
    description: 'Personalized follow-up emails sent by sales representatives to individual healthcare providers',
    examples: ['Post-visit follow-ups', 'Clinical study information', 'Patient case discussions', 'Sample requests'],
    complianceNotes: ['Rep training required', 'MLR approval mandatory', 'Tracking required', 'Fair balance inclusion'],
    channelRecommendations: ['CRM integration', 'Veeva Vault deployment', 'Rep mobile apps']
  },
  // HCP - Social Media
  {
    assetType: 'social-media-post',
    audience: 'Physician-Specialist',
    name: 'HCP Social Media Content',
    description: 'Professional social media content targeted at healthcare providers on medical platforms',
    examples: ['LinkedIn thought leadership', 'Medical Twitter discussions', 'Doximity posts', 'ResearchGate content'],
    complianceNotes: ['Platform-specific compliance', 'Character limit considerations', 'Professional tone required'],
    channelRecommendations: ['LinkedIn', 'Doximity', 'Medical Twitter', 'Specialized HCP platforms']
  },
  // HCP - Website Landing Page
  {
    assetType: 'website-landing-page',
    audience: 'Physician-Specialist',
    name: 'HCP Website Landing Page',
    description: 'Professional web pages with gated access providing detailed product information for healthcare providers',
    examples: ['Product information sites', 'Clinical data portals', 'Dosing calculators', 'Patient selection tools'],
    complianceNotes: ['Age-gating required', 'Professional verification', 'ISI prominent placement', 'Accessibility standards'],
    channelRecommendations: ['Brand websites', 'Medical portals', 'Conference microsites', 'Educational platforms']
  },
  // HCP - Digital Sales Aid
  {
    assetType: 'digital-sales-aid',
    audience: 'Physician-Specialist',
    name: 'Digital Sales Aid',
    description: 'Interactive digital presentations and tools used by sales representatives during HCP interactions',
    examples: ['iPad detailing aids', 'Clinical data presentations', 'Patient journey tools', 'Efficacy calculators'],
    complianceNotes: ['Veeva Vault compliance', 'CLM integration', 'Rep training mandatory', 'Usage tracking required'],
    channelRecommendations: ['Veeva CLM', 'Rep tablets', 'Conference kiosks', 'Medical meetings']
  },
  // Patient - Social Media
  {
    assetType: 'social-media-post',
    audience: 'Patient',
    name: 'Patient Social Media Content',
    description: 'Educational and supportive social media content designed for patients and their communities',
    examples: ['Disease awareness posts', 'Lifestyle tips', 'Patient stories', 'Support group content'],
    complianceNotes: ['Non-promotional focus', 'Balanced information', 'Community guidelines', 'Adverse event reporting'],
    channelRecommendations: ['Facebook patient groups', 'Instagram health content', 'YouTube education', 'Pinterest wellness']
  },
  // Patient - Website Landing Page
  {
    assetType: 'website-landing-page',
    audience: 'Patient',
    name: 'Patient Education Website',
    description: 'Consumer-friendly web pages providing disease education and treatment information for patients',
    examples: ['Disease information sites', 'Treatment option guides', 'Symptom checkers', 'Doctor discussion tools'],
    complianceNotes: ['Consumer-friendly language', 'Balanced presentation', 'Clear disclaimers', 'Privacy compliance'],
    channelRecommendations: ['Brand patient sites', 'Health information portals', 'Mobile-optimized pages', 'Voice search optimization']
  },
  // Caregiver - Social Media
  {
    assetType: 'social-media-post',
    audience: 'Caregiver-Professional',
    name: 'Caregiver Support Content',
    description: 'Supportive social media content addressing the unique needs and challenges of caregivers',
    examples: ['Caregiver tips', 'Burden-of-care content', 'Support resources', 'Self-care reminders'],
    complianceNotes: ['Emotional sensitivity', 'Resource accuracy', 'Support community focus', 'Non-promotional tone'],
    channelRecommendations: ['Facebook caregiver groups', 'Instagram support content', 'Pinterest resources', 'YouTube guides']
  },
  // Patient - Email
  {
    assetType: 'patient-email',
    audience: 'Patient',
    name: 'Patient Education Email',
    description: 'Educational email communications designed to inform and support patients in their health journey',
    examples: ['Disease awareness newsletters', 'Treatment adherence reminders', 'Lifestyle tip emails', 'Support resource updates'],
    complianceNotes: ['Patient-friendly language', 'Educational focus only', 'Clear privacy notices', 'Easy unsubscribe'],
    channelRecommendations: ['Patient portal integration', 'Segmented patient lists', 'Mobile-optimized design', 'Automated care sequences']
  },
  // Caregiver - Email
  {
    assetType: 'caregiver-email',
    audience: 'Caregiver-Professional',
    name: 'Caregiver Support Email',
    description: 'Supportive email communications addressing the unique challenges and needs of patient caregivers',
    examples: ['Caregiver wellness tips', 'Burden-of-care support', 'Resource updates', 'Community event notifications'],
    complianceNotes: ['Empathetic tone required', 'Caregiver-specific focus', 'Support resource emphasis', 'Privacy compliance'],
    channelRecommendations: ['Caregiver support lists', 'Family communication tools', 'Support group integration', 'Multi-generational accessibility']
  },
  // Caregiver - Website Landing Page
  {
    assetType: 'website-landing-page',
    audience: 'Caregiver-Professional',
    name: 'Caregiver Resource Portal',
    description: 'Comprehensive web resources designed to support and educate caregivers of patients',
    examples: ['Caregiver guides', 'Support tools', 'Resource libraries', 'Community forums'],
    complianceNotes: ['Caregiver-specific language', 'Practical focus', 'Resource verification', 'Privacy protection'],
    channelRecommendations: ['Dedicated caregiver sites', 'Support organization partnerships', 'Mobile accessibility', 'Multi-language support']
  }
];

export const getAllowedAssetTypes = (audience) => {
  return AUDIENCE_ASSET_RULES
    .filter(rule => rule.allowedAudiences.includes(audience))
    .map(rule => rule.assetType);
};

export const isAssetTypeAllowedForAudience = (assetType, audience) => {
  const rule = AUDIENCE_ASSET_RULES.find(r => r.assetType === assetType);
  return rule ? rule.allowedAudiences.includes(audience) : false;
};

export const getAssetAudienceDescription = (assetType, audience) => {
  return ASSET_AUDIENCE_DESCRIPTIONS.find(
    desc => desc.assetType === assetType && desc.audience === audience
  ) || null;
};

export const getComplianceRequirements = (assetType, audience) => {
  const rule = AUDIENCE_ASSET_RULES.find(r => r.assetType === assetType);
  const description = getAssetAudienceDescription(assetType, audience);
  
  return [
    ...(rule?.regulatoryRestrictions || []),
    ...(description?.complianceNotes || [])
  ];
};

export const getAssetAudienceReasoning = (assetType, audience) => {
  const rule = AUDIENCE_ASSET_RULES.find(r => r.assetType === assetType);
  
  if (!rule) return 'Asset type not found in compliance matrix';
  
  if (rule.allowedAudiences.includes(audience)) {
    return rule.reasoning;
  } else {
    return `This asset type is not compliant for ${audience} audiences. ${rule.reasoning}`;
  }
};

export const AUDIENCE_OBJECTIVES = {
  'Physician-Specialist': [
    {
      value: 'clinical-education',
      label: 'Clinical Education',
      description: 'Provide evidence-based clinical information and best practices',
      applicableAssets: ['mass-email', 'rep-triggered-email', 'digital-sales-aid', 'website-landing-page', 'social-media-post']
    },
    {
      value: 'evidence-communication',
      label: 'Evidence Communication',
      description: 'Share clinical trial results and real-world evidence',
      applicableAssets: ['mass-email', 'rep-triggered-email', 'digital-sales-aid', 'social-media-post']
    },
    {
      value: 'practice-support',
      label: 'Practice Support',
      description: 'Provide tools and resources to support clinical practice',
      applicableAssets: ['digital-sales-aid', 'website-landing-page', 'rep-triggered-email', 'social-media-post']
    },
    {
      value: 'product-awareness',
      label: 'Product Awareness',
      description: 'Increase awareness of treatment options and indications',
      applicableAssets: ['mass-email', 'social-media-post', 'website-landing-page']
    },
    {
      value: 'competitive-differentiation',
      label: 'Competitive Differentiation',
      description: 'Highlight unique benefits and clinical advantages',
      applicableAssets: ['digital-sales-aid', 'rep-triggered-email', 'mass-email', 'social-media-post']
    }
  ],
  'Physician-PrimaryCare': [
    {
      value: 'clinical-education',
      label: 'Clinical Education',
      description: 'Provide evidence-based clinical information and best practices',
      applicableAssets: ['mass-email', 'rep-triggered-email', 'digital-sales-aid', 'website-landing-page', 'social-media-post']
    },
    {
      value: 'practice-support',
      label: 'Practice Support',
      description: 'Provide tools and resources to support clinical practice',
      applicableAssets: ['digital-sales-aid', 'website-landing-page', 'rep-triggered-email', 'social-media-post']
    },
    {
      value: 'product-awareness',
      label: 'Product Awareness',
      description: 'Increase awareness of treatment options and indications',
      applicableAssets: ['mass-email', 'social-media-post', 'website-landing-page']
    }
  ],
  'Pharmacist': [
    {
      value: 'clinical-education',
      label: 'Clinical Education',
      description: 'Provide evidence-based clinical information and best practices',
      applicableAssets: ['mass-email', 'rep-triggered-email', 'digital-sales-aid', 'website-landing-page', 'social-media-post']
    },
    {
      value: 'product-awareness',
      label: 'Product Awareness',
      description: 'Increase awareness of treatment options and indications',
      applicableAssets: ['mass-email', 'social-media-post', 'website-landing-page']
    }
  ],
  'Nurse-RN': [
    {
      value: 'clinical-education',
      label: 'Clinical Education',
      description: 'Provide evidence-based clinical information and best practices',
      applicableAssets: ['mass-email', 'rep-triggered-email', 'digital-sales-aid', 'website-landing-page', 'social-media-post']
    },
    {
      value: 'practice-support',
      label: 'Practice Support',
      description: 'Provide tools and resources to support clinical practice',
      applicableAssets: ['digital-sales-aid', 'website-landing-page', 'rep-triggered-email', 'social-media-post']
    }
  ],
  'Nurse-NP-PA': [
    {
      value: 'clinical-education',
      label: 'Clinical Education',
      description: 'Provide evidence-based clinical information and best practices',
      applicableAssets: ['mass-email', 'rep-triggered-email', 'digital-sales-aid', 'website-landing-page', 'social-media-post']
    },
    {
      value: 'practice-support',
      label: 'Practice Support',
      description: 'Provide tools and resources to support clinical practice',
      applicableAssets: ['digital-sales-aid', 'website-landing-page', 'rep-triggered-email', 'social-media-post']
    }
  ],
  'Patient': [
    {
      value: 'disease-awareness',
      label: 'Disease Awareness',
      description: 'Educate patients about their condition and symptoms',
      applicableAssets: ['patient-email', 'social-media-post', 'website-landing-page']
    },
    {
      value: 'treatment-education',
      label: 'Treatment Education',
      description: 'Help patients understand treatment options and benefits',
      applicableAssets: ['patient-email', 'website-landing-page', 'social-media-post']
    },
    {
      value: 'adherence-support',
      label: 'Adherence Support',
      description: 'Encourage medication compliance and healthy behaviors',
      applicableAssets: ['patient-email', 'website-landing-page', 'social-media-post']
    },
    {
      value: 'lifestyle-guidance',
      label: 'Lifestyle Guidance',
      description: 'Provide lifestyle tips and wellness support',
      applicableAssets: ['patient-email', 'social-media-post', 'website-landing-page']
    },
    {
      value: 'community-building',
      label: 'Community Building',
      description: 'Connect patients with support networks and resources',
      applicableAssets: ['social-media-post', 'website-landing-page', 'patient-email']
    }
  ],
  'Caregiver-Professional': [
    {
      value: 'caregiver-education',
      label: 'Caregiver Education',
      description: 'Educate caregivers about patient care and condition management',
      applicableAssets: ['caregiver-email', 'website-landing-page', 'social-media-post']
    },
    {
      value: 'support-resources',
      label: 'Support Resources',
      description: 'Provide practical tools and emotional support for caregivers',
      applicableAssets: ['caregiver-email', 'website-landing-page', 'social-media-post']
    },
    {
      value: 'burden-management',
      label: 'Burden Management',
      description: 'Help caregivers manage stress and caregiver burden',
      applicableAssets: ['caregiver-email', 'social-media-post', 'website-landing-page']
    }
  ],
  'Caregiver-Family': [
    {
      value: 'caregiver-education',
      label: 'Caregiver Education',
      description: 'Educate caregivers about patient care and condition management',
      applicableAssets: ['caregiver-email', 'website-landing-page', 'social-media-post']
    },
    {
      value: 'support-resources',
      label: 'Support Resources',
      description: 'Provide practical tools and emotional support for caregivers',
      applicableAssets: ['caregiver-email', 'website-landing-page', 'social-media-post']
    },
    {
      value: 'advocacy-empowerment',
      label: 'Advocacy Empowerment',
      description: 'Empower caregivers to advocate for patients effectively',
      applicableAssets: ['website-landing-page', 'caregiver-email', 'social-media-post']
    },
    {
      value: 'family-coordination',
      label: 'Family Coordination',
      description: 'Support coordination of care among family members',
      applicableAssets: ['caregiver-email', 'website-landing-page', 'social-media-post']
    }
  ],
  'Other': [
    {
      value: 'general-awareness',
      label: 'General Awareness',
      description: 'Build broad awareness of health topics and treatment options',
      applicableAssets: ['social-media-post', 'website-landing-page']
    },
    {
      value: 'stakeholder-engagement',
      label: 'Stakeholder Engagement',
      description: 'Engage with various stakeholders in the healthcare ecosystem',
      applicableAssets: ['social-media-post', 'website-landing-page']
    },
    {
      value: 'thought-leadership',
      label: 'Thought Leadership',
      description: 'Establish authority and expertise in therapeutic areas',
      applicableAssets: ['social-media-post', 'website-landing-page']
    }
  ]
};

export const getAudienceObjectives = (audience, assetTypes) => {
  const objectives = AUDIENCE_OBJECTIVES[audience] || [];
  
  if (!assetTypes || assetTypes.length === 0) {
    return objectives;
  }
  
  return objectives.filter(objective =>
    assetTypes.some(assetType => objective.applicableAssets.includes(assetType))
  );
};

export const getSuggestedObjective = (audience, assetTypes, indication) => {
  const availableObjectives = getAudienceObjectives(audience, assetTypes);
  
  if (availableObjectives.length === 0) return null;
  
  if (isHCPAudience(audience)) {
    if (assetTypes.includes('digital-sales-aid') || assetTypes.includes('rep-triggered-email')) {
      return availableObjectives.find(obj => obj.value === 'clinical-education') || availableObjectives[0];
    }
    if (assetTypes.includes('mass-email')) {
      return availableObjectives.find(obj => obj.value === 'evidence-communication') || availableObjectives[0];
    }
  }
  
  if (audience === 'Patient') {
    if (assetTypes.includes('patient-email')) {
      return availableObjectives.find(obj => obj.value === 'treatment-education') || availableObjectives[0];
    }
    if (assetTypes.includes('social-media-post')) {
      return availableObjectives.find(obj => obj.value === 'disease-awareness') || availableObjectives[0];
    }
  }
  
  if (isCaregiverAudience(audience)) {
    return availableObjectives.find(obj => obj.value === 'caregiver-education') || availableObjectives[0];
  }
  
  if (audience === 'Other') {
    return availableObjectives.find(obj => obj.value === 'general-awareness') || availableObjectives[0];
  }
  
  return availableObjectives[0];
};