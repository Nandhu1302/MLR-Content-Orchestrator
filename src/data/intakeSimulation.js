// Realistic Intake Scenarios for Testing
export const intakeTemplates = [ // Removed : Partial<IntakeData>[]
  {
    projectName: "IPF Awareness Email Series Q1 2025",
    initiativeType: 'campaign',
    indication: 'IPF',
    primaryAudience: 'Physician-Specialist',
    selectedAssetTypes: ['mass-email', 'website-landing-page', 'digital-sales-aid'],
    primaryObjective: 'awareness',
    keyMessage: 'Ofev slows IPF progression with proven clinical evidence from INPULSIS studies',
    callToAction: 'Learn about Ofev for your IPF patients',
    targetMarkets: ['US', 'EU'],
    audienceSegment: ['Pulmonologists', 'Primary Care'],
    fairBalanceRequired: true
  },
  {
    projectName: "SSc-ILD Launch Social Campaign",
    initiativeType: 'campaign', 
    indication: 'SSc-ILD',
    primaryAudience: 'Physician-Specialist',
    selectedAssetTypes: ['social-media-post', 'rep-triggered-email'],
    primaryObjective: 'launch',
    keyMessage: 'Ofev now approved for SSc-ILD based on SENSCIS trial data',
    callToAction: 'Explore Ofev for SSc-ILD patients',
    targetMarkets: ['US'],
    audienceSegment: ['Rheumatologists', 'Pulmonologists'],
    fairBalanceRequired: true
  },
  {
    projectName: "HCP Education Webinar Follow-up",
    initiativeType: 'single-asset',
    indication: 'IPF',
    primaryAudience: 'Physician-Specialist',
    selectedAssetTypes: ['rep-triggered-email'],
    primaryObjective: 'education',
    keyMessage: 'Thank you for attending our Ofev mechanism of action webinar',
    callToAction: 'Access additional clinical resources',
    targetMarkets: ['US', 'Canada'],
    audienceSegment: ['Pulmonologists'],
    fairBalanceRequired: true
  },
  {
    projectName: "Patient Journey Landing Page",
    initiativeType: 'single-asset',
    indication: 'Progressive-Fibrosing-ILD',
    primaryAudience: 'Patient',
    selectedAssetTypes: ['website-landing-page'],
    primaryObjective: 'awareness',
    keyMessage: 'Understanding your Progressive Fibrosing ILD journey with Ofev',
    callToAction: 'Find resources and support',
    targetMarkets: ['US'],
    audienceSegment: [],
    fairBalanceRequired: true
  }
];

// Realistic Asset Data Examples
export const mockAssets = [ // Removed : AssetData[]
  {
    assetId: 'asset_001',
    projectId: 'proj_001',
    projectName: 'IPF Disease Education Email',
    assetType: 'mass-email',
    initiativeType: 'single-asset',
    brand: 'Ofev',
    indication: 'IPF',
    primaryAudience: 'Physician-Specialist',
    audienceSegment: ['Pulmonologists'],
    targetMarkets: ['US'],
    primaryObjective: 'education',
    keyMessage: 'Ofev slows IPF progression - latest clinical insights',
    callToAction: 'Learn more about Ofev MOA',
    regulatoryFlags: [],
    fairBalanceRequired: true,
    plannedLaunch: new Date('2025-02-15'),
    milestones: [],
    createdAt: new Date('2025-01-15'),
    updatedAt: new Date('2025-01-20'),
    createdBy: 'sheikh_imtiyaz',
    status: 'in-progress',
    content: {
      subject: 'New Clinical Insights: Ofev in IPF Management',
      body: `Dear Dr. [LAST_NAME],

I hope this message finds you well. As a pulmonologist treating IPF patients, I wanted to share some recent clinical insights about Ofev (nintedanib) that may be valuable for your practice.

CLINICAL EVIDENCE HIGHLIGHTS:
• INPULSIS trials demonstrated 68% reduction in annual rate of FVC decline vs placebo
• Consistent efficacy across patient subgroups
• Established safety profile with manageable adverse events

KEY PRESCRIBING CONSIDERATIONS:
• 150mg twice daily with food
• Liver function monitoring required
• Drug interaction screening important

Would you like to discuss how Ofev fits into your IPF treatment approach? I'm happy to provide additional clinical resources or arrange a brief consultation.

Best regards,
[REP_NAME]
[CONTACT_INFO]

IMPORTANT SAFETY INFORMATION: [Fair balance content would be included here]`,
    },
    assignedTo: 'sheikh_imtiyaz'
  },
  {
    assetId: 'asset_002', 
    projectId: 'proj_002',
    projectName: 'SSc-ILD Social Media Awareness',
    assetType: 'social-media-post',
    initiativeType: 'single-asset',
    brand: 'Ofev',
    indication: 'SSc-ILD',
    primaryAudience: 'Physician-Specialist',
    audienceSegment: ['Rheumatologists'],
    targetMarkets: ['US'],
    primaryObjective: 'awareness',
    keyMessage: 'Ofev approved for SSc-ILD based on SENSCIS data',
    callToAction: 'Learn about Ofev for SSc-ILD',
    regulatoryFlags: [],
    fairBalanceRequired: true,
    plannedLaunch: new Date('2025-02-01'),
    milestones: [],
    createdAt: new Date('2025-01-10'),
    updatedAt: new Date('2025-01-18'),
    createdBy: 'marketing_director',
    status: 'design-review',
    content: {
      subject: 'Expanding Hope in Systemic Sclerosis-Associated ILD',
      body: `🔬 BREAKTHROUGH: Ofev (nintedanib) shows significant benefit in SSc-ILD

The SENSCIS trial demonstrated:
✓ 44% reduction in annual rate of FVC decline
✓ Consistent safety profile
✓ New hope for SSc-ILD patients

For rheumatologists managing systemic sclerosis patients with ILD complications.

#SSc #ILD #Ofev #SystemicSclerosis #RareDisease

Important Safety Information: [Abbreviated safety info for social media compliance]`
    },
    assignedTo: 'marketing_director'
  }
];

// Realistic Campaign Data
export const mockCampaigns = [ // Removed : CampaignData[]
  {
    campaignId: 'camp_001',
    projectId: 'proj_003',
    projectName: 'Q1 2025 IPF Awareness Campaign',
    initiativeType: 'campaign',
    brand: 'Ofev',
    indication: 'IPF',
    primaryAudience: 'Physician-Specialist',
    audienceSegment: ['Pulmonologists', 'Primary Care'],
    targetMarkets: ['US', 'EU'],
    selectedAssetTypes: ['mass-email', 'website-landing-page', 'digital-sales-aid'],
    primaryObjective: 'awareness',
    keyMessage: 'Ofev: Slowing IPF progression that matters to patients',
    callToAction: 'Discover Ofev clinical evidence',
    regulatoryFlags: [],
    fairBalanceRequired: true,
    plannedLaunch: new Date('2025-03-01'),
    milestones: [
      {
        id: 'milestone_1',
        name: 'Content Creation Complete',
        date: new Date('2025-02-01'),
        status: 'in-progress'
      },
      {
        id: 'milestone_2', 
        name: 'MLR Approval',
        date: new Date('2025-02-15'),
        status: 'pending'
      },
      {
        id: 'milestone_3',
        name: 'Campaign Launch',
        date: new Date('2025-03-01'),
        status: 'pending'
      }
    ],
    createdAt: new Date('2025-01-05'),
    updatedAt: new Date('2025-01-25'),
    createdBy: 'sheikh_imtiyaz',
    status: 'in-progress',
    assets: [
      {
        ...mockAssets[0],
        parentCampaignId: 'camp_001',
        projectName: 'IPF Awareness Mass Email',
        status: 'content-review'
      },
      {
        assetId: 'asset_003',
        projectId: 'proj_003',
        projectName: 'IPF Landing Page',
        assetType: 'website-landing-page',
        parentCampaignId: 'camp_001',
        initiativeType: 'campaign',
        brand: 'Ofev',
        indication: 'IPF',
        primaryAudience: 'Physician-Specialist',
        audienceSegment: ['Pulmonologists', 'Primary Care'],
        targetMarkets: ['US', 'EU'],
        primaryObjective: 'awareness',
        keyMessage: 'Ofev: Slowing IPF progression that matters to patients',
        callToAction: 'Discover Ofev clinical evidence',
        regulatoryFlags: [],
        fairBalanceRequired: true,
        plannedLaunch: new Date('2025-03-01'),
        milestones: [],
        createdAt: new Date('2025-01-05'),
        updatedAt: new Date('2025-01-22'),
        createdBy: 'sheikh_imtiyaz',
        status: 'draft',
        content: {
          subject: 'Understanding IPF: Clinical Evidence for Ofev',
          body: 'Landing page content in development...'
        }
      },
      {
        assetId: 'asset_004',
        projectId: 'proj_003',
        projectName: 'IPF Digital Sales Aid',
        assetType: 'digital-sales-aid',
        parentCampaignId: 'camp_001',
        initiativeType: 'campaign',
        brand: 'Ofev',
        indication: 'IPF',
        primaryAudience: 'Physician-Specialist',
        audienceSegment: ['Pulmonologists'],
        targetMarkets: ['US'],
        primaryObjective: 'awareness',
        keyMessage: 'Ofev: Slowing IPF progression that matters to patients',
        callToAction: 'Discuss Ofev with your patients',
        regulatoryFlags: [],
        fairBalanceRequired: true,
        plannedLaunch: new Date('2025-03-01'),
        milestones: [],
        createdAt: new Date('2025-01-05'),
        updatedAt: new Date('2025-01-20'),
        createdBy: 'marketing_director',
        status: 'approved',
        content: {
          subject: 'Ofev in IPF: Clinical Evidence & Patient Management',
          body: 'Comprehensive sales aid with clinical data, patient cases, and discussion guides'
        },
        assignedTo: 'marketing_director',
        mlrSubmissionDate: new Date('2025-01-12'),
        approvalDate: new Date('2025-01-20')
      }
    ],
    teamMembers: ['sheikh_imtiyaz', 'marketing_director', 'content_specialist'],
    performanceMetrics: {
      totalReach: 0,
      engagementRate: 0,
      conversionRate: 0,
      mlrSuccessRate: 100
    }
  }
];

// Workflow State Simulation
export const workflowStates = {
  activeCampaigns: mockCampaigns.length,
  activeAssets: mockAssets.length,
  pendingMLRReview: mockAssets.filter(a => a.status === 'mlr-review').length,
  avgCreationTime: '2.3 hours',
  mlrSuccessRate: 94,
  totalAssetsCreated: 156
};

// User Journey Patterns
export const userJourneyPatterns = {
  sheikh_imtiyaz: {
    preferredAssetTypes: ['mass-email', 'rep-triggered-email'],
    avgSessionLength: '45 minutes',
    mostActiveHours: ['9-11 AM', '2-4 PM'],
    commonWorkflows: [
      'intake → content creation → save draft',
      'intake → content creation → submit for review'
    ]
  },
  marketing_director: {
    preferredAssetTypes: ['digital-sales-aid', 'website-landing-page'],
    avgSessionLength: '1.2 hours', 
    mostActiveHours: ['10 AM-12 PM', '3-5 PM'],
    commonWorkflows: [
      'campaign planning → multi-asset intake → team assignment',
      'review drafts → provide feedback → approve for MLR'
    ]
  }
};