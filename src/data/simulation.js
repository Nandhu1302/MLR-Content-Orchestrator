// Simulated data for the Ofev Content Operations Platform

export const userProfiles = {
  user1: {
    id: "sheikh_imtiyaz",
    name: "Sheikh Imtiyaz Ahmad", 
    email: "sheikh.imtiyaz@cognizant.com",
    role: "Senior Content Strategist",
    company: "Cognizant",
    client: "Boehringer Ingelheim",
    brand_access: ["Ofev"],
    markets: ["US", "EU", "UK", "Canada"],
    permissions: ["all_modules"],
    avatar: "SI"
  },
  user2: {
    id: "marketing_director",
    name: "Sarah Chen",
    email: "sarah.chen@cognizant.com",
    role: "Marketing Director", 
    company: "Cognizant",
    client: "Boehringer Ingelheim",
    brand_access: ["Ofev"],
    markets: ["US", "EU", "UK"],
    permissions: ["all_modules", "approve_content"],
    avatar: "SC"
  }
};

export const historicalCampaigns = [
  {
    id: "ofev_awareness_2024",
    name: "Ofev Disease Awareness Campaign 2024",
    theme: "Understanding IPF: The Progressive Journey",
    status: "Active",
    performance_data: {
      email_open_rate: 24.3,
      click_through_rate: 8.7,
      engagement_score: 78,
      hcp_reach: 12500,
      patient_inquiries: 890
    },
    channels: ["Email", "Website", "Medical Affairs"],
    assets_created: 23,
    mlr_approval_time: "14 days"
  },
  {
    id: "ssc_ild_launch_2023",
    name: "Ofev SSc-ILD Launch Campaign",
    theme: "Expanding Hope: Ofev for SSc-ILD", 
    status: "Completed",
    performance_data: {
      email_open_rate: 31.2,
      click_through_rate: 12.4,
      engagement_score: 85,
      hcp_reach: 8900,
      patient_inquiries: 1250
    },
    channels: ["Email", "Sales Aid", "Congress Materials", "Website"],
    assets_created: 35,
    mlr_approval_time: "18 days"
  }
];

export const clinicalEvidence = [
  {
    study: "INPULSIS-1",
    citation: "Richeldi L, et al. N Engl J Med. 2014;370(22):2071-2082.",
    key_findings: "68% reduction in annual rate of decline in FVC vs placebo",
    patient_population: "IPF patients",
    primary_endpoint: "Change in FVC from baseline at 52 weeks",
    evidence_level: "Phase 3 RCT"
  },
  {
    study: "SENSCIS", 
    citation: "Distler O, et al. N Engl J Med. 2019;380(26):2518-2528.",
    key_findings: "44% reduction in annual rate of decline in FVC vs placebo",
    patient_population: "SSc-ILD patients",
    primary_endpoint: "Change in FVC from baseline at 52 weeks",
    evidence_level: "Phase 3 RCT"
  }
];

export const moduleData = [
  {
    id: "initiative-hub",
    title: "Initiative Hub",
    description: "Campaign lifecycle management with visual swimlane interface showing campaigns from draft through deployment with real-time status tracking.",
    status: "12 Active Campaigns",
    metrics: [
      { label: "Active Campaigns", value: "12" },
      { label: "Avg. Cycle Time", value: "21 days", trend: "-3 days" },
      { label: "MLR Success Rate", value: "94%" },
      { label: "On Schedule", value: "87%" }
    ]
  },
  {
    id: "strategy-insights",
    title: "Strategy & Insights Hub", 
    description: "AI-powered theme generation with data integration from Veeva CRM, IQVIA market data, and historical campaign performance analytics.",
    status: "8 Insights Generated",
    metrics: [
      { label: "Theme Success", value: "78%" },
      { label: "HCP Engagement", value: "+15%", trend: "+15%" },
      { label: "Market Share", value: "42%" },
      { label: "Competitive Intel", value: "Fresh" }
    ]
  },
  {
    id: "content-studio",
    title: "Content Studio",
    description: "AI-powered content creation with brand voice engine trained on Ofev's approved messaging, clinical integration, and compliance validation.",
    status: "156 Assets Created", 
    metrics: [
      { label: "Content Created", value: "156" },
      { label: "Approval Rate", value: "91%" },
      { label: "Avg. Creation", value: "2.3 hrs", trend: "-45 min" },
      { label: "Brand Score", value: "96%" }
    ]
  },
  {
    id: "design-studio",
    title: "Design Studio",
    description: "Brand-compliant design system with Ofev design kit, AI-enhanced layout optimization, and multi-format export capabilities.",
    status: "89 Designs Complete",
    metrics: [
      { label: "Designs Ready", value: "89" },
      { label: "Brand Compliance", value: "98%" },
      { label: "Multi-format", value: "100%" },
      { label: "Quality Score", value: "4.8/5" }
    ]
  },
  {
    id: "pre-mlr",
    title: "Pre-MLR Companion",
    description: "Automated content analysis with claim validation, reference checking, and MLR success prediction based on historical patterns.",
    status: "23 Reviews Pending",
    metrics: [
      { label: "Reviews Ready", value: "23" },
      { label: "Success Predict", value: "87%" },
      { label: "Issues Found", value: "34", trend: "-12" },
      { label: "Review Time", value: "6.2 days" }
    ]
  },
  {
    id: "glocalization",
    title: "GLOCAL Adaptation",
    description: "Advanced multi-market localization with cultural intelligence, regulatory compliance analysis, and automated translation memory optimization.",
    status: "8 Projects Active",
    metrics: [
      { label: "Active Projects", value: "8" },
      { label: "Languages", value: "12" },
      { label: "Cultural Score", value: "96%" },
      { label: "Compliance", value: "100%" }
    ]
  }
];