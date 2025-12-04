import { 
  Lightbulb, 
  Brain, 
  FileText, 
  Palette, 
  Shield, 
  Globe,
  Database,
  Lock,
  GitBranch,
  Cloud,
  Zap,
  Workflow,
  FolderKanban,
  BarChart3,
  Mail,
  Languages
} from 'lucide-react';

export const ecosystemSystems = [
  // Strategic Inputs
  {
    name: 'Veeva Vault',
    category: 'Clinical Intelligence',
    relationship: 'input',
    connectionType: 'integrates',
    description: 'Approved claims, PI/ISI documents',
    icon: Database,
    badge: 'API'
  },
  {
    name: 'Brand Portals',
    category: 'Brand Strategy',
    relationship: 'input',
    connectionType: 'integrates',
    description: 'Voice of brand, positioning',
    icon: Lightbulb,
    badge: 'Native'
  },
  {
    name: 'Market Research',
    category: 'Market Intelligence',
    relationship: 'input',
    connectionType: 'integrates',
    description: 'HCP insights, patient data',
    icon: BarChart3,
    badge: 'API'
  },
  {
    name: 'Competitor Data',
    category: 'Competitive Intelligence',
    relationship: 'input',
    connectionType: 'integrates',
    description: 'Claims monitoring, positioning',
    icon: GitBranch,
    badge: 'Webhook'
  },
  
  // Operational Outputs
  {
    name: 'Veeva PromoMats',
    category: 'MLR/Regulatory',
    relationship: 'output',
    connectionType: 'integrates',
    description: 'Approval workflows, submission',
    icon: Shield,
    badge: 'API'
  },
  {
    name: 'DAM Systems',
    category: 'Asset Management',
    relationship: 'output',
    connectionType: 'integrates',
    description: 'MediaValet, Widen, Bynder',
    icon: FolderKanban,
    badge: 'Native'
  },
  {
    name: 'Marketing Automation',
    category: 'Distribution',
    relationship: 'output',
    connectionType: 'integrates',
    description: 'Veeva CRM Email, Adobe AEM',
    icon: Mail,
    badge: 'API'
  },
  {
    name: 'Translation Platforms',
    category: 'Localization',
    relationship: 'output',
    connectionType: 'integrates',
    description: 'Lionbridge, RWS, TMS',
    icon: Languages,
    badge: 'Pre-built'
  },
  
  // Technical Infrastructure
  {
    name: 'Lovable AI',
    category: 'AI/ML Engine',
    relationship: 'infrastructure',
    connectionType: 'enhances',
    description: 'Gemini/GPT models, multimodal',
    icon: Brain,
  },
  {
    name: 'Cloud Platform',
    category: 'Data & Compute',
    relationship: 'infrastructure',
    connectionType: 'enhances',
    description: 'Auto-scaling, 99.9% uptime',
    icon: Cloud,
  },
  {
    name: 'Security & Compliance',
    category: 'Governance',
    relationship: 'infrastructure',
    connectionType: 'enhances',
    description: 'SOC 2, HIPAA, 21 CFR Part 11',
    icon: Lock,
  },
  {
    name: 'Integration Layer',
    category: 'Connectivity',
    relationship: 'infrastructure',
    connectionType: 'enhances',
    description: 'API-first, pre-built connectors',
    icon: Zap,
  },
  
  // Complementary Platforms
  {
    name: 'Veeva Vault / Adobe AEM',
    category: 'Content Storage',
    relationship: 'complementary',
    connectionType: 'integrates',
    description: 'We enhance, not replace',
    icon: Database,
  },
  {
    name: 'Veeva CLM / eWizard',
    category: 'eDetail Platforms',
    relationship: 'complementary',
    connectionType: 'integrates',
    description: 'Rep-facing content delivery',
    icon: Workflow,
  },
  {
    name: 'Tableau / Power BI',
    category: 'Analytics',
    relationship: 'complementary',
    connectionType: 'integrates',
    description: 'Performance insights',
    icon: BarChart3,
  },
  {
    name: 'SFMC / Marketo',
    category: 'Marketing Automation',
    relationship: 'complementary',
    connectionType: 'integrates',
    description: 'Email/journey orchestration',
    icon: Mail,
  },
];

export const orchestrationModules = [
  { 
    id: 1, 
    name: 'Initiative Hub', 
    icon: Lightbulb, 
    position: 'top-left',
    themeColorIndex: 1
  },
  { 
    id: 2, 
    name: 'Strategy & Insights', 
    icon: Brain, 
    position: 'top-center',
    themeColorIndex: 2
  },
  { 
    id: 3, 
    name: 'Content Studio', 
    icon: FileText, 
    position: 'top-right',
    themeColorIndex: 3
  },
  { 
    id: 4, 
    name: 'Design Studio', 
    icon: Palette, 
    position: 'bottom-left',
    themeColorIndex: 4
  },
  { 
    id: 5, 
    name: 'Pre-MLR Companion', 
    icon: Shield, 
    position: 'bottom-center',
    themeColorIndex: 5
  },
  { 
    id: 6, 
    name: 'Glocalization', 
    icon: Globe, 
    position: 'bottom-right',
    themeColorIndex: 6
  }
];

export const positioningNarrative = {
  whereWeFit: [
    "Content Orchestrator sits at the heart of Pharma MarTech",
    "Not competing with Veeva Vault or Adobe AEM—we enhance them",
    "The missing intelligence layer connecting strategy to execution"
  ],
  whatWeReplace: [
    "Manual briefing processes & email chaos",
    "Disconnected spreadsheets & point solutions",
    "Fragmented workflows across 10+ tools"
  ],
  whatWeIntegrateWith: [
    "Clinical data sources (Veeva Vault)",
    "MLR workflows (Veeva PromoMats)",
    "DAM systems (MediaValet, Widen)",
    "Translation platforms (Lionbridge, RWS)"
  ],
  whatWeEnable: [
    "Single source of truth for content operations",
    "Intelligence-driven content creation",
    "Automated compliance validation",
    "Global content adaptation at scale"
  ]
};