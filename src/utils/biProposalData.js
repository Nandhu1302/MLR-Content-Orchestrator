/**
 * @typedef {Object} PhaseCompletion
 * @property {number} phase
 * @property {string} name
 * @property {number} completion
 * @property {'complete' | 'in-progress' | 'needs-config'} status
 * @property {string[]} builtFeatures
 * @property {string[]} neededFeatures
 * @property {string} [demoEvidence]
 */

/**
 * @typedef {Object} TimelinePhase
 * @property {string} name
 * @property {string} duration
 * @property {number} [startWeek]
 * @property {string[]} deliverables
 */

/**
 * @typedef {Object} RiskAssessment
 * @property {string} category
 * @property {'high' | 'medium' | 'low'} traditional
 * @property {'high' | 'medium' | 'low'} prototype
 * @property {string} mitigation
 */

/**
 * @typedef {Object} ROIMetrics
 * @property {Object} traditional
 * @property {string} traditional.timeline
 * @property {string} traditional.cost
 * @property {string} traditional.team
 * @property {string} traditional.risk
 * @property {string} traditional.firstValue
 * @property {string} traditional.year1Total
 * @property {Object} prototype
 * @property {string} prototype.timeline
 * @property {string} prototype.cost
 * @property {string} prototype.team
 * @property {string} prototype.risk
 * @property {string} prototype.firstValue
 * @property {string} prototype.year1Total
 * @property {Object} savings
 * @property {string} savings.year1
 * @property {string} savings.year2Plus
 * @property {string} savings.payback
 */

export const phaseCompletions = [
  {
    phase: 1,
    name: 'Global Asset Context Capture',
    completion: 70,
    status: 'complete',
    builtFeatures: [
      'Multi-source content import (Content Studio, external upload)',
      'Automatic metadata extraction (brand, therapeutic area, channel)',
      'Market selection with 15+ pre-configured markets',
      'MLR status preservation',
      'Asset relationship tracking',
      'Source content validation'
    ],
    neededFeatures: [
      'Integration with BI content systems',
      'Respiratory/ILD specific tagging',
      'BI brand guideline linking',
      'Custom metadata fields for BI'
    ],
    demoEvidence: 'IPF patient brochure uploaded and automatically tagged for 5 markets'
  },
  {
    phase: 2,
    name: 'Smart TM Intelligence & AI Translation',
    completion: 65,
    status: 'complete',
    builtFeatures: [
      'Google Gemini Pro AI translation engine',
      '15+ language support',
      'TM matching (exact, fuzzy, contextual)',
      'Real-time leverage calculation',
      'Segment-level translation UI',
      'Quality confidence scoring',
      'Side-by-side comparison view'
    ],
    neededFeatures: [
      'Integration of BI existing TM databases',
      'Respiratory terminology model training',
      'Custom glossary integration',
      'BI-specific translation workflows'
    ],
    demoEvidence: '92% TM leverage achieved on IPF brochure demo'
  },
  {
    phase: 3,
    name: 'Cultural Intelligence Analysis',
    completion: 55,
    status: 'in-progress',
    builtFeatures: [
      'Cultural appropriateness scoring algorithm',
      'Market-specific analysis framework',
      'Segment-level recommendations',
      'Risk identification for cultural taboos',
      'Tone and messaging analysis'
    ],
    neededFeatures: [
      'BI-specific market profiles (US, EU, Japan, China)',
      'Therapeutic area cultural considerations',
      'Historical learnings integration',
      'Custom cultural criteria for BI markets'
    ],
    demoEvidence: 'Cultural appropriateness score: 87/100 for German market'
  },
  {
    phase: 4,
    name: 'Regulatory Compliance Validation',
    completion: 50,
    status: 'in-progress',
    builtFeatures: [
      'Regulatory rule engine framework',
      'Compliance checking logic',
      'Fair balance validation',
      'Prohibited claim detection',
      'Audit trail generation',
      'Real-time compliance scoring'
    ],
    neededFeatures: [
      'FDA, EMA, PMDA, NMPA rule configurations',
      'Respiratory/ILD regulatory requirements',
      'BI MLR workflow integration',
      'Custom compliance criteria'
    ],
    demoEvidence: '3 FDA warnings flagged proactively during demo'
  },
  {
    phase: 5,
    name: 'Quality Intelligence & Review',
    completion: 60,
    status: 'in-progress',
    builtFeatures: [
      'Multi-dimensional quality scoring',
      'Review orchestration framework',
      'Feedback threading',
      'Approval workflow engine',
      'Overall readiness scoring',
      'Reviewer assignment system'
    ],
    neededFeatures: [
      'BI-specific quality criteria',
      'Role-based reviewer assignments',
      'Custom approval chains',
      'Integration with BI approval systems'
    ],
    demoEvidence: 'Final quality score: 91/100 in demo'
  },
  {
    phase: 6,
    name: 'DAM Handoff Generator',
    completion: 45,
    status: 'needs-config',
    builtFeatures: [
      'Export package generator (PDF, HTML, DOCX)',
      'Metadata preservation',
      'Asset naming conventions',
      'Folder structure generation',
      'Multi-format export support'
    ],
    neededFeatures: [
      'Veeva Vault API integration',
      'BI DAM taxonomy mapping',
      'SharePoint connector',
      'BI-specific export templates',
      'Custom metadata mapping'
    ],
    demoEvidence: 'Export ready for Veeva handoff demonstrated'
  },
  {
    phase: 7,
    name: 'Integration & Lineage Tracking',
    completion: 50,
    status: 'needs-config',
    builtFeatures: [
      'API integration framework',
      'Webhook support',
      'Complete audit trail',
      'Analytics dashboard',
      'Version history tracking',
      'Data lineage visualization'
    ],
    neededFeatures: [
      'Veeva Vault API integration',
      'BI system authentication',
      'Custom webhook configurations',
      'BI-specific reporting templates',
      'SSO integration'
    ]
  }
];

export const timelineComparison = {
  traditional: [
    { name: 'Requirements Gathering', duration: '2 months', deliverables: ['BRD', 'Technical specs', 'User stories'] },
    { name: 'Architecture & Design', duration: '2 months', deliverables: ['System architecture', 'Database design', 'UI/UX mockups'] },
    { name: 'Development', duration: '6-10 months', deliverables: ['Backend services', 'Frontend UI', 'AI model training'] },
    { name: 'Testing & QA', duration: '2 months', deliverables: ['Test cases', 'Bug fixes', 'Performance optimization'] },
    { name: 'Deployment', duration: '2 months', deliverables: ['Production deployment', 'User training', 'Documentation'] }
  ],
  prototype: [
    { name: 'Foundation & Configuration', duration: '4 weeks', startWeek: 1, deliverables: ['Configured platform instance', 'TM database migration', 'User provisioning'] },
    { name: 'BI-Specific Features', duration: '4 weeks', startWeek: 5, deliverables: ['Veeva integration', 'Terminology training', 'Custom workflows'] },
    { name: 'Integration & Testing', duration: '4 weeks', startWeek: 9, deliverables: ['System integration', 'UAT completion', 'Performance optimization'] },
    { name: 'Training & Go-Live', duration: '4 weeks', startWeek: 13, deliverables: ['User training', 'Production deployment', 'Support handover'] }
  ]
};

export const riskAssessments = [
  {
    category: 'Technical Risk',
    traditional: 'high',
    prototype: 'low',
    mitigation: 'Already proven in production environment with live demo'
  },
  {
    category: 'Timeline Risk',
    traditional: 'high',
    prototype: 'low',
    mitigation: '60% complete = predictable remaining work with clear scope'
  },
  {
    category: 'Cost Overrun',
    traditional: 'medium',
    prototype: 'low',
    mitigation: 'Fixed-scope implementation with known architecture'
  },
  {
    category: 'Adoption Risk',
    traditional: 'medium',
    prototype: 'low',
    mitigation: 'BI already saw it work (demo buy-in from stakeholders)'
  },
  {
    category: 'Integration Risk',
    traditional: 'high',
    prototype: 'low',
    mitigation: 'API-first architecture with flexible integration patterns'
  }
];

export const roiMetrics = {
  traditional: {
    timeline: '12-18 months',
    cost: '$1.2M - $1.8M',
    team: '12-15 FTE',
    risk: 'High (unproven)',
    firstValue: 'Month 6-8',
    year1Total: '$1.5M - $2.2M'
  },
  prototype: {
    timeline: '16-20 weeks',
    cost: '$425K - $575K',
    team: '6-8 FTE',
    risk: 'Low (proven)',
    firstValue: 'Week 8',
    year1Total: '$1.04M'
  },
  savings: {
    year1: '$460K - $1.2M',
    year2Plus: '$900K/year',
    payback: '8-10 months'
  }
};

export const prototypeStats = {
  functionalityComplete: 60,
  databaseTables: 7,
  phasesOperational: 7,
  languagesSupported: 15,
  marketsConfigured: 15,
  aiIntegrated: 'Google Gemini Pro',
  demoCompleted: true,
  productionReady: 'Production-grade architecture'
};

export const demoProofPoints = [
  {
    phase: 'Phase 1',
    achievement: 'IPF patient brochure uploaded and segmented',
    status: 'success'
  },
  {
    phase: 'Phase 2',
    achievement: 'German translation with 92% TM leverage',
    status: 'success'
  },
  {
    phase: 'Phase 3',
    achievement: 'Cultural appropriateness score: 87/100 for German market',
    status: 'success'
  },
  {
    phase: 'Phase 4',
    achievement: 'Regulatory compliance: 3 FDA warnings flagged proactively',
    status: 'success'
  },
  {
    phase: 'Phase 5',
    achievement: 'Final quality score: 91/100',
    status: 'success'
  },
  {
    phase: 'Phase 6',
    achievement: 'Export ready for Veeva handoff',
    status: 'success'
  }
];

export const implementationRoadmap = [
  {
    name: 'Foundation & Configuration',
    duration: 'Weeks 1-4',
    deliverables: [
      'BI system integration setup',
      'TM database migration',
      'Market and regulatory rule configuration',
      'User provisioning',
      'Configured platform instance'
    ]
  },
  {
    name: 'BI-Specific Feature Build',
    duration: 'Weeks 5-8',
    deliverables: [
      'Veeva Vault integration',
      'Respiratory terminology model training',
      'Custom workflow implementations',
      '2 pilot projects completed'
    ]
  },
  {
    name: 'Integration & Testing',
    duration: 'Weeks 9-12',
    deliverables: [
      'Full system integration testing',
      'UAT with BI teams',
      'Performance optimization',
      'Production-ready platform'
    ]
  },
  {
    name: 'Training & Go-Live',
    duration: 'Weeks 13-16',
    deliverables: [
      'User training (50 users)',
      'Production deployment',
      'Support handover',
      'Live platform + documentation'
    ]
  }
];

export const clientDependencies = [
  {
    category: 'Stakeholder Availability',
    items: [
      'Regulatory SMEs (2-3 people): 20-30% time in Weeks 1-8',
      'Translation Team Lead: 50% time in Weeks 1-4, 20% ongoing',
      'IT Integration Team: API access and technical support',
      'Executive Sponsor: Phase gate approvals'
    ]
  },
  {
    category: 'Data & Assets',
    items: [
      'Translation Memory export (TMX, XLIFF, or CSV)',
      'Glossaries and terminology databases',
      '5-10 sample assets per content type',
      'Regulatory documentation by market'
    ]
  },
  {
    category: 'System Access',
    items: [
      'Veeva Vault API credentials',
      'DAM system access',
      'SharePoint credentials',
      'SSO configuration details'
    ]
  }
];