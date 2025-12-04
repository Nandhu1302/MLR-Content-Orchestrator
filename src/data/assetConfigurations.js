// Regulatory Flags Database
export const regulatoryFlags = [
  {
    id: 'fair-balance',
    name: 'Fair Balance Required',
    description: 'Content must include balanced risk-benefit information',
    required: true,
    markets: ['US', 'EU', 'UK', 'Canada']
  },
  {
    id: 'boxed-warning',
    name: 'Boxed Warning',
    description: 'FDA boxed warning must be prominently displayed',
    required: true,
    markets: ['US']
  },
  {
    id: 'liver-monitoring',
    name: 'Liver Function Monitoring',
    description: 'Must include liver function monitoring requirements',
    required: true,
    markets: ['US', 'EU', 'UK', 'Canada']
  },
  {
    id: 'pregnancy-warning',
    name: 'Pregnancy/Contraception Warning',
    description: 'Must include pregnancy counseling and contraception requirements',
    required: true,
    markets: ['US', 'EU', 'UK', 'Canada']
  },
  {
    id: 'drug-interactions',
    name: 'Drug Interaction Warnings',
    description: 'Must include significant drug interaction information',
    required: true,
    markets: ['US', 'EU', 'UK', 'Canada']
  },
  {
    id: 'rare-disease',
    name: 'Rare Disease Indication',
    description: 'Special considerations for rare disease communications',
    required: false,
    markets: ['US', 'EU', 'UK', 'Canada']
  }
];

// Asset Type Configurations
export const assetConfigurations = [
  {
    type: 'mass-email',
    name: 'Mass Email',
    description: 'Promotional email sent to large HCP segments with tracking and personalization',
    template: 'email-promotional',
    requiredFields: ['subject', 'preheader', 'body', 'cta', 'unsubscribe', 'legal-footer'],
    regulatoryRequirements: [
      regulatoryFlags[0], // fair-balance
      regulatoryFlags[2], // liver-monitoring
      regulatoryFlags[3]  // pregnancy-warning
    ],
    estimatedHours: 8,
    channels: ['Email Marketing Platform', 'Veeva CRM']
  },
  {
    type: 'rep-triggered-email',
    name: 'Rep Triggered Email',
    description: 'Personalized follow-up email sent by sales reps to individual HCPs',
    template: 'email-personal',
    requiredFields: ['subject', 'personal-greeting', 'body', 'rep-signature', 'contact-info'],
    regulatoryRequirements: [
      regulatoryFlags[0], // fair-balance
      regulatoryFlags[2]  // liver-monitoring
    ],
    estimatedHours: 6,
    channels: ['Veeva CRM', 'Sales Enablement']
  },
  {
    type: 'patient-email',
    name: 'Patient Education Email',
    description: 'Educational email communication designed to inform and support patients',
    template: 'email-patient-education',
    requiredFields: ['subject', 'greeting', 'educational-content', 'resources', 'support-info', 'privacy-footer'],
    regulatoryRequirements: [
      regulatoryFlags[5] // rare-disease (when applicable)
    ],
    estimatedHours: 4,
    channels: ['Patient Portal', 'Email Marketing Platform', 'Healthcare CRM']
  },
  {
    type: 'caregiver-email',
    name: 'Caregiver Support Email',
    description: 'Supportive email communication addressing caregiver-specific needs and challenges',
    template: 'email-caregiver-support',
    requiredFields: ['subject', 'empathetic-greeting', 'support-content', 'resources', 'community-links', 'privacy-footer'],
    regulatoryRequirements: [
      regulatoryFlags[5] // rare-disease (when applicable)
    ],
    estimatedHours: 4,
    channels: ['Caregiver Support Platform', 'Family Communication Tools', 'Support Group Networks']
  },
  {
    type: 'social-media-post',
    name: 'Social Media Post',
    description: 'Disease awareness or educational content for social media platforms',
    template: 'social-educational',
    requiredFields: ['headline', 'body-text', 'image', 'hashtags', 'disclaimer'],
    regulatoryRequirements: [
      regulatoryFlags[0], // fair-balance
      regulatoryFlags[5]  // rare-disease
    ],
    estimatedHours: 4,
    channels: ['LinkedIn', 'Twitter', 'Facebook']
  },
  {
    type: 'website-landing-page',
    name: 'Website Landing Page',
    description: 'Dedicated webpage for specific campaigns or indications with SEO optimization',
    template: 'web-landing',
    requiredFields: ['page-title', 'meta-description', 'hero-section', 'content-blocks', 'cta-sections', 'footer'],
    regulatoryRequirements: [
      regulatoryFlags[0], // fair-balance
      regulatoryFlags[1], // boxed-warning (US only)
      regulatoryFlags[2], // liver-monitoring
      regulatoryFlags[3], // pregnancy-warning
      regulatoryFlags[4]  // drug-interactions
    ],
    estimatedHours: 16,
    channels: ['Corporate Website', 'Campaign Microsites']
  },
  {
    type: 'digital-sales-aid',
    name: 'Digital Sales Aid',
    description: 'Interactive presentation for HCP face-to-face or virtual meetings',
    template: 'sales-aid-interactive',
    requiredFields: ['title-slide', 'agenda', 'clinical-data', 'efficacy-slides', 'safety-profile', 'discussion-guides'],
    regulatoryRequirements: [
      regulatoryFlags[0], // fair-balance
      regulatoryFlags[1], // boxed-warning
      regulatoryFlags[2], // liver-monitoring
      regulatoryFlags[3], // pregnancy-warning
      regulatoryFlags[4]  // drug-interactions
    ],
    estimatedHours: 20,
    channels: ['Veeva CLM', 'iPad App', 'Sales Portal']
  }
];

// Asset Templates with Ofev-specific content
export const assetTemplates = {
  'email-promotional': {
    subject: 'Understanding [INDICATION]: Latest Clinical Evidence for Ofev',
    preheader: 'Slowing the progression that matters in [INDICATION]',
    sections: [
      'hero-banner',
      'clinical-evidence', 
      'patient-journey',
      'safety-profile',
      'resources-cta',
      'legal-footer'
    ]
  },
  'email-personal': {
    subject: 'Following up on our Ofev discussion - [HCP_NAME]',
    sections: [
      'personal-greeting',
      'meeting-recap',
      'additional-resources',
      'next-steps',
      'rep-contact'
    ]
  },
  'email-patient-education': {
    subject: 'Understanding [INDICATION]: Resources to Support Your Journey',
    sections: [
      'warm-greeting',
      'educational-content',
      'lifestyle-tips',
      'support-resources',
      'community-connection',
      'privacy-footer'
    ],
    tone: 'supportive and educational',
    maxLength: 800
  },
  'email-caregiver-support': {
    subject: 'Supporting Your Loved One with [INDICATION]: Resources for Caregivers',
    sections: [
      'empathetic-greeting',
      'caregiver-tips',
      'burden-support',
      'resource-library',
      'community-support',
      'self-care-reminder',
      'privacy-footer'
    ],
    tone: 'empathetic and resourceful',
    maxLength: 900
  },
  'social-educational': {
    formats: ['carousel', 'single-image', 'video'],
    maxCharacters: {
      'LinkedIn': 3000,
      'Twitter': 280,
      'Facebook': 2200
    },
    requiredHashtags: ['#IPF', '#OfevInfo', '#LungHealth']
  },
  'web-landing': {
    sections: [
      'hero-section',
      'disease-overview', 
      'treatment-approach',
      'clinical-evidence',
      'safety-information',
      'patient-resources',
      'hcp-resources',
      'contact-cta'
    ],
    seoRequirements: true
  },
  'sales-aid-interactive': {
    slideTypes: [
      'title-slide',
      'agenda', 
      'disease-burden',
      'unmet-needs',
      'moa-animation',
      'clinical-data',
      'patient-cases',
      'safety-overview',
      'discussion-starter'
    ],
    interactiveElements: ['tap-to-reveal', 'swipe-gallery', 'video-embed']
  }
};

// Compliance Requirements by Market
export const marketCompliance = {
  US: {
    requiredElements: ['FDA-approved-indication', 'boxed-warning', 'contraindications', 'warnings-precautions'],
    reviewProcess: 'FDA-MLR',
    timelineStandard: '14-21 days'
  },
  EU: {
    requiredElements: ['EMA-approved-indication', 'contraindications', 'special-warnings'],
    reviewProcess: 'EMA-MLR', 
    timelineStandard: '10-14 days'
  },
  UK: {
    requiredElements: ['MHRA-approved-indication', 'contraindications', 'warnings'],
    reviewProcess: 'MHRA-MLR',
    timelineStandard: '7-10 days'
  },
  Canada: {
    requiredElements: ['Health-Canada-indication', 'contraindications', 'warnings'],
    reviewProcess: 'HC-MLR',
    timelineStandard: '14-18 days'
  }
};