// Mock External System Data and Connections
// Generate audience-specific data sources
export const generateAudienceAwareDataSources = (audience) => {
  const audienceInsights = {
    'HCP': {
      'veeva-crm': [
        'HCP engagement highest with clinical evidence content',
        '73% prefer email over other channels for medical information',
        'Specialists respond 2.4x better to MOA-focused messaging'
      ],
      'salesforce-crm': [
        'Top-performing HCPs show 45% higher engagement with case studies',
        'Academic medical centers prefer detailed clinical data',
        'Regional preferences: Northeast favors safety data, West Coast clinical outcomes'
      ],
      'iqvia': [
        'Diagnosis rates increasing 8% annually in target markets',
        'Competitor messaging focuses 60% on tolerability vs efficacy',
        'Market share opportunity expanding rapidly'
      ]
    },
    'Patient': {
      'veeva-crm': [
        'Patient engagement highest with educational content',
        'Support program enrollment increases with clear resource guidance',
        'Patients prefer mobile-friendly content formats'
      ],
      'salesforce-crm': [
        'Patient portal usage correlates with treatment adherence',
        'Educational content shared 3x more than promotional materials',
        'Patient testimonials increase engagement by 67%'
      ],
      'iqvia': [
        'Patient journey complexity varies by indication and geography',
        'Real-world outcomes data resonates with newly diagnosed patients',
        'Adherence rates improve with personalized support programs'
      ]
    },
    'Caregiver': {
      'veeva-crm': [
        'Caregiver engagement peaks during patient transition periods',
        'Educational resources reduce caregiver burden significantly',
        'Support group referrals most effective during early diagnosis'
      ],
      'salesforce-crm': [
        'Caregivers prefer comprehensive resource libraries',
        'Peer support programs show highest satisfaction ratings',
        'Digital tools adoption accelerating among caregiver community'
      ],
      'iqvia': [
        'Caregiver burden studies show need for targeted support',
        'Quality of life improvements correlate with caregiver education',
        'Respite care programs most valued by long-term caregivers'
      ]
    }
  };

  const insights = audienceInsights[audience] || audienceInsights['Patient'];

  return {
    'veeva-crm': {
      source: 'veeva-crm',
      name: 'CRM Platform',
      status: 'connected',
      recordsAnalyzed: 12847,
      analysisTime: '2.3 seconds',
      insights: insights['veeva-crm']
    },
    'salesforce-crm': {
      source: 'salesforce-crm',
      name: 'Salesforce CRM',
      status: 'connected',
      recordsAnalyzed: 8934,
      analysisTime: '1.8 seconds',
      insights: insights['salesforce-crm']
    },
    'sfmc': {
      source: 'sfmc',
      name: 'Marketing Cloud',
      status: 'connected',
      recordsAnalyzed: 156782,
      analysisTime: '4.1 seconds',
      insights: [
        `${audience} engagement rates highest with personalized content`,
        'Mobile-optimized content increases engagement by 34%',
        'Multi-channel campaigns show 45% better performance'
      ]
    },
    'iqvia': {
      source: 'iqvia',
      name: 'Market Intelligence',
      status: 'connected',
      recordsAnalyzed: 45623,
      analysisTime: '3.2 seconds',
      insights: insights['iqvia']
    },
    'zs-associates': {
      source: 'zs-associates',
      name: 'Analytics Platform',
      status: 'connected',
      recordsAnalyzed: 23456,
      analysisTime: '2.7 seconds',
      insights: [
        `${audience} touchpoint optimization data analyzed`,
        'Multi-channel engagement patterns identified',
        'Audience preference insights integrated'
      ]
    },
    'internal-campaigns': {
      source: 'internal-campaigns',
      name: 'Historical Campaign Data',
      status: 'connected',
      recordsAnalyzed: 89,
      analysisTime: '1.2 seconds',
      insights: [
        `${audience} journey themes show higher engagement`,
        'Evidence-based campaigns achieve high approval rates',
        'Multi-channel campaigns outperform single-channel significantly'
      ]
    },
    'competitive-intel': {
      source: 'competitive-intel',
      name: 'Competitive Intelligence',
      status: 'connected',
      recordsAnalyzed: 1247,
      analysisTime: '1.9 seconds',
      insights: [
        `Competitors under-indexing on ${audience.toLowerCase()} messaging`,
        'Differentiation opportunities identified in target segments',
        'Educational content gaps present market opportunities'
      ]
    }
  };
};

// Backwards compatibility - default to HCP data sources
export const mockDataSources = generateAudienceAwareDataSources('HCP');

// Historical Campaign Performance Data
export const historicalPerformance = {
  'clinical-evidence': {
    avgSuccessRate: 87,
    avgEngagementRate: 24,
    avgMLRApproval: 94,
    avgReach: 8450,
    competitiveAdvantage: 76
  },
  'patient-journey': {
    avgSuccessRate: 91,
    avgEngagementRate: 31,
    avgMLRApproval: 89,
    avgReach: 7200,
    competitiveAdvantage: 82
  },
  'market-access': {
    avgSuccessRate: 78,
    avgEngagementRate: 19,
    avgMLRApproval: 85,
    avgReach: 5600,
    competitiveAdvantage: 71
  },
  'competitive-positioning': {
    avgSuccessRate: 83,
    avgEngagementRate: 27,
    avgMLRApproval: 91,
    avgReach: 6800,
    competitiveAdvantage: 88
  },
  'safety-focused': {
    avgSuccessRate: 85,
    avgEngagementRate: 22,
    avgMLRApproval: 96,
    avgReach: 7100,
    competitiveAdvantage: 74
  }
};

// AI-Generated Theme Examples
export const generateMockThemes = (projectName, indication, audience, brandName) => {
  const brand = brandName || 'Ofev';
  
  // Brand-specific messaging templates
  const brandMessages = {
    'Ofev': {
      therapeutic: 'anti-fibrotic',
      conditions: ['IPF', 'SSc-ILD', 'Progressive Fibrosing ILD'],
      mechanism: 'Triple tyrosine kinase inhibitor',
      clinicalData: 'INPULSIS',
      efficacy: '68% reduction in annual rate of FVC decline vs placebo'
    },
    'Pradaxa': {
      therapeutic: 'anticoagulant',
      conditions: ['Atrial Fibrillation', 'VTE Prevention', 'Stroke Prevention'],
      mechanism: 'Direct thrombin inhibitor',
      clinicalData: 'RE-LY',
      efficacy: 'Superior stroke prevention vs warfarin'
    }
  };
  
  const currentBrand = brandMessages[brand] || brandMessages['Ofev'];
  const baseThemes = [
    {
      name: 'Clinical Evidence Leadership',
      description: `Position ${brand} as the gold standard through robust clinical trial data and real-world evidence`,
      category: 'clinical-evidence',
      keyMessage: `${brand} demonstrates consistent efficacy in ${indication} with extensive clinical evidence from pivotal trials`,
      callToAction: 'Explore the clinical evidence that matters to your patients',
      targetingRefinements: {
        primaryAudience: audience,
        audienceSegments: ['Academic Medical Centers', 'High-Volume Prescribers'],
        markets: ['US', 'EU']
      },
      contentSuggestions: {
        headlines: brand === 'Pradaxa' ? [
          `${currentBrand.clinicalData} Data: Superior Stroke Prevention`,
          'Real-World Evidence Confirms Trial Results',
          'Predictable Anticoagulation Profile'
        ] : [
          `${currentBrand.clinicalData} Data: Proven FVC Preservation`,
          'Real-World Evidence Confirms Trial Results',
          'Long-term Safety Profile Established'
        ],
        keyPoints: brand === 'Pradaxa' ? [
          `${currentBrand.efficacy} in ${indication}`,
          'No routine monitoring required',
          'Predictable pharmacokinetics'
        ] : [
          `${currentBrand.efficacy}`,
          'Consistent benefit across patient subgroups',
          'Established safety profile with manageable AEs'
        ],
        visualElements: [
          'Clinical trial timeline infographic',
          'FVC decline comparison charts',
          'Patient subgroup analysis data'
        ]
      },
      performancePrediction: {
        successProbability: 87,
        engagementRate: 24,
        mlrApprovalRate: 94,
        expectedReach: 8450,
        competitiveAdvantage: 76
      },
      rationale: {
        primaryInsight: 'HCPs in your target segments respond 2.4x better to clinical evidence-focused messaging',
        supportingData: [
          'Historical campaign data shows 94% MLR approval for clinical themes',
          'Academic centers prefer detailed clinical data (SFMC analysis)',
          'Clinical evidence content achieves highest HCP engagement (Veeva CRM)'
        ],
        historicalEvidence: [
          `Previous ${brand} clinical campaigns achieved 87% success rate`,
          `${currentBrand.clinicalData} messaging drove 24% engagement rates`,
          'Clinical-focused emails show 18% higher open rates'
        ],
        riskFactors: [
          'May be perceived as too technical for some audience segments',
          'Requires careful fair balance presentation'
        ],
        recommendations: [
          'Emphasize practical clinical implications',
          'Include patient impact stories alongside data',
          'Ensure mobile-optimized data visualizations'
        ]
      },
      dataSources: ['veeva-crm', 'sfmc', 'internal-campaigns', 'iqvia'],
      confidence: 92
    },
    {
      name: 'Patient-Centered Care Journey',
      description: 'Focus on improving patient outcomes and quality of life throughout their treatment journey',
      category: 'patient-journey',
      keyMessage: `Supporting ${indication} patients through every step of their treatment journey with ${brand}`,
      callToAction: `Discover how ${brand} fits into comprehensive patient care`,
      targetingRefinements: {
        primaryAudience: audience,
        audienceSegments: ['Primary Care', 'Community Specialists'],
        markets: ['US', 'Canada']
      },
      contentSuggestions: {
        headlines: [
          'Beyond Progression: Quality of Life Matters',
          'Supporting Patients Through Every Stage',
          'Real Patients, Real Outcomes'
        ],
        keyPoints: [
          'Slowing disease progression preserves patient function',
          'Manageable side effect profile with proper monitoring',
          'Patient support programs available'
        ],
        visualElements: [
          'Patient journey timeline',
          'Quality of life improvement charts',
          'Real patient testimonial videos'
        ]
      },
      performancePrediction: {
        successProbability: 91,
        engagementRate: 31,
        mlrApprovalRate: 89,
        expectedReach: 7200,
        competitiveAdvantage: 82
      },
      rationale: {
        primaryInsight: 'Patient journey themes show 67% higher engagement rates than clinical-only messaging',
        supportingData: [
          'Community physicians prefer patient-outcome focused content',
          'Quality of life messaging resonates with primary care',
          'Patient stories increase message memorability by 45%'
        ],
        historicalEvidence: [
          'Patient journey campaigns achieved 91% success rate',
          'Highest engagement rates (31%) across all theme categories',
          'Strong MLR approval with appropriate patient focus'
        ],
        riskFactors: [
          'Requires careful patient privacy considerations',
          'May need additional regulatory review for patient content'
        ],
        recommendations: [
          'Use de-identified patient cases',
          'Balance emotional appeal with clinical facts',
          'Include caregiver perspectives where appropriate'
        ]
      },
      dataSources: ['internal-campaigns', 'salesforce-crm', 'competitive-intel'],
      confidence: 89
    },
    {
      name: 'Competitive Differentiation',
      description: `Highlight ${brand}'s unique advantages in the competitive landscape`,
      category: 'competitive-positioning',
      keyMessage: `${brand} offers unique benefits in ${indication} treatment with proven differentiation`,
      callToAction: brand === 'Pradaxa' ? `See why ${brand} stands apart in anticoagulation` : `See why ${brand} stands apart in ILD treatment`,
      targetingRefinements: {
        primaryAudience: audience,
        audienceSegments: ['Thought Leaders', 'High-Volume Prescribers'],
        markets: ['US']
      },
      contentSuggestions: {
        headlines: brand === 'Pradaxa' ? [
          'The First Direct Thrombin Inhibitor',
          'Leading Innovation in Anticoagulation',
          'Unique Mechanism, Proven Results'
        ] : [
          'The Only Anti-Fibrotic with Proven Efficacy',
          'Leading the Standard of Care',
          'Unique Mechanism, Proven Results'
        ],
        keyPoints: [
          `${currentBrand.mechanism} mechanism`,
          brand === 'Pradaxa' ? 'Consistent efficacy across stroke prevention' : 'Consistent efficacy across ILD types',
          'Extensive clinical trial program'
        ],
        visualElements: [
          'Mechanism of action comparison',
          'Competitive landscape overview',
          'Clinical trial comparison charts'
        ]
      },
      performancePrediction: {
        successProbability: 83,
        engagementRate: 27,
        mlrApprovalRate: 91,
        expectedReach: 6800,
        competitiveAdvantage: 88
      },
      rationale: {
        primaryInsight: 'Competitive differentiation messaging shows highest competitive advantage scores (88%)',
        supportingData: [
          'Competitors under-indexing on MOA differentiation',
          'HCP surveys show confusion about anti-fibrotic differences',
          'Opportunity for clear positioning in expanding ILD market'
        ],
        historicalEvidence: [
          'Competitive positioning campaigns achieve strong engagement',
          'MOA-focused content preferred by specialists',
          'Differentiation messaging increases brand preference'
        ],
        riskFactors: [
          'Requires careful competitive claim substantiation',
          'May invite competitive response'
        ],
        recommendations: [
          'Focus on factual, evidence-based differentiation',
          'Avoid direct competitive comparisons',
          'Emphasize unique clinical benefits'
        ]
      },
      dataSources: ['competitive-intel', 'iqvia', 'veeva-crm'],
      confidence: 85
    }
  ];

  return baseThemes.map((theme, index) => ({
    ...theme,
    id: `theme_${Date.now()}_${index}`,
    createdAt: new Date()
  }));
};

// Generate audience-aware analysis steps
export const generateAudienceAwareAnalysisSteps = (audience, assetTypes = []) => {
  const audienceSpecificSteps = {
    'HCP': [
      {
        step: 1,
        title: 'Connecting to Medical Systems',
        description: 'Establishing secure connections to Veeva CRM, SFMC, IQVIA, and medical databases',
        duration: 2000
      },
      {
        step: 2,
        title: 'Analyzing HCP Engagement Data',
        description: 'Processing historical HCP interactions and prescription patterns',
        duration: 3000
      },
      {
        step: 3,
        title: 'Processing Clinical Evidence',
        description: 'Analyzing clinical trial data and medical literature for evidence-based messaging',
        duration: 2500
      },
      {
        step: 4,
        title: 'Competitive Intelligence Analysis',
        description: 'Evaluating competitive landscape and clinical positioning opportunities',
        duration: 2200
      },
      {
        step: 5,
        title: 'Medical Affairs Integration',
        description: 'Incorporating medical affairs guidelines and compliance requirements',
        duration: 1800
      }
    ],
    'Patient': [
      {
        step: 1,
        title: 'Connecting to Patient Data Sources',
        description: 'Accessing patient journey data, support programs, and adherence platforms',
        duration: 2000
      },
      {
        step: 2,
        title: 'Analyzing Patient Experience Data',
        description: 'Processing patient feedback, journey touchpoints, and outcome data',
        duration: 3000
      },
      {
        step: 3,
        title: 'Processing Patient Support Intelligence',
        description: 'Analyzing patient assistance programs and educational resource engagement',
        duration: 2500
      },
      {
        step: 4,
        title: 'Real-World Evidence Analysis',
        description: 'Evaluating patient-reported outcomes and real-world effectiveness data',
        duration: 2200
      },
      {
        step: 5,
        title: 'Patient Communication Optimization',
        description: 'Incorporating health literacy guidelines and patient preference insights',
        duration: 1800
      }
    ],
    'Caregiver': [
      {
        step: 1,
        title: 'Connecting to Caregiver Support Systems',
        description: 'Accessing caregiver support platforms, burden studies, and resource databases',
        duration: 2000
      },
      {
        step: 2,
        title: 'Analyzing Caregiver Journey Data',
        description: 'Processing caregiver experience data and support program utilization',
        duration: 3000
      },
      {
        step: 3,
        title: 'Processing Caregiver Burden Insights',
        description: 'Analyzing caregiver burden studies and quality of life impact data',
        duration: 2500
      },
      {
        step: 4,
        title: 'Support Resource Analysis',
        description: 'Evaluating caregiver resource needs and educational content preferences',
        duration: 2200
      },
      {
        step: 5,
        title: 'Caregiver Communication Strategy',
        description: 'Incorporating caregiver communication preferences and support touchpoints',
        duration: 1800
      }
    ]
  };

  const baseSteps = audienceSpecificSteps[audience] || 
    audienceSpecificSteps['Patient']; // Default to patient if audience not found

  return [
    ...baseSteps,
    {
      step: 6,
      title: 'Generating AI-Powered Themes',
      description: `Creating personalized content themes for ${audience} audience based on comprehensive analysis`,
      duration: 2500
    }
  ];
};

// Maintain backwards compatibility
export const analysisSteps = generateAudienceAwareAnalysisSteps('HCP');