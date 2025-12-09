//workshop
 
// ============================================
// Workshop Types Module (JavaScript Version)
// ============================================
 
// Conversation Context
export const ConversationContext = {
  userStory: '',
  brandInfo: {
    name: '',
    therapeuticArea: ''
  },
  detectedIntent: null,
  selectedAssets: [],
  matchedTemplateId: '',
  initialGreeting: '',
  initialQuickReplies: [],
  userConfirmedStrategy: false,
  conversationStage: 'exploring' // exploring | clarifying | summarizing | confirmed
};
 
// Detected Intent
export const DetectedIntent = {
  needsClarification: false,
  confidence: 0,
  occasion: '',
  eventName: '',
  eventType: '',
  region: '',
  duration: '',
  activities: [],
  audience: '',
  audienceSpecialties: [],
  audienceSeniority: '',
  goals: [],
  channels: [],
  assetTypes: [],
  therapeuticArea: '',
  brandMention: '',
  timeline: '',
  urgency: 'normal' // urgent | normal | flexible
};
 
// Message
export const Message = {
  id: '',
  role: 'user', // user | assistant
  content: '',
  quickReplies: [] // [{ label: '', action: '', data: {} }]
};
 
// Matched Claim
export const MatchedClaim = {
  id: '',
  claim_text: '',
  claim_type: '',
  relevance_score: 0,
  mlr_approved: false,
  target_audiences: []
};
 
// Matched Visual
export const MatchedVisual = {
  id: '',
  asset_name: '',
  asset_type: '',
  relevance_score: 0,
  mlr_approved: false,
  storage_path: null
};
 
// Matched Module
export const MatchedModule = {
  id: '',
  module_text: '',
  module_type: '',
  relevance_score: 0,
  mlr_approved: false
};
 
// Success Pattern
export const SuccessPattern = {
  id: '',
  campaign_type: '',
  success_rate: 0,
  avg_engagement_rate: 0,
  sample_size: 0,
  key_success_factors: [],
  anti_patterns: [],
  ab_test_winner: '',
  ab_test_lift: 0
};
 
// Audience Insight
export const AudienceInsight = {
  type: '',
  metric: '',
  value: 0,
  source: '',
  description: ''
};
 
// Channel Intelligence
export const ChannelIntelligence = {
  channel: '',
  performance_score: 0,
  recommended_for_audience: false,
  engagement_metrics: {
    impressions: 0,
    clicks: 0,
    conversions: 0
  }
};
 
// Competitive Intelligence
export const CompetitiveIntelligence = {
  competitor_name: '',
  intelligence_type: '',
  threat_level: null, // high | medium | low
  content: '',
  counter_messaging: [],
  discovered_at: ''
};
 
// Cross Channel Journey
export const CrossChannelJourney = {
  journey_path: [],
  conversion_rate: 0,
  lift_vs_single_channel: 0,
  sample_size: 0,
  description: ''
};
 
// Performance Prediction
export const PerformancePrediction = {
  predicted_engagement: 0,
  predicted_conversion: 0,
  confidence_score: 0,
  based_on_campaigns: 0
};
 
// Market Intelligence
export const MarketIntelligence = {
  rx_growth_rate: null,
  market_share_trend: '',
  primary_competitor: null,
  top_decile_hcp_count: 0,
  regional_insights: []
};
 
// Matched Intelligence
export const MatchedIntelligence = {
  claims: [],
  visuals: [],
  modules: [],
  successPatterns: [],
  audienceInsights: [],
  channelIntelligence: [],
  competitiveIntelligence: [],
  crossChannelJourneys: [],
  performancePrediction: null,
  marketIntelligence: null,
  overallConfidence: 0,
  dataSourcesUsed: []
};
 
// AI Enhanced Brief
export const AIEnhancedBrief = {
  title: '',
  objective: '',
  keyMessage: '',
  targetAudience: '',
  channels: [],
  cta: '',
  performancePrediction: null,
  antiPatterns: []
};
 
// Story Analysis
export const StoryAnalysis = {
  occasion: { type: '', name: '', confidence: 0 },
  audience: { primaryType: '', segments: [], seniority: '', confidence: 0 },
  activities: { identified: [], confidence: 0 },
  region: { identified: '', confidence: 0 },
  goals: { primary: '', secondary: [], confidence: 0 },
  timeline: { urgency: 'planned', dateContext: '', confidence: 0 },
  extractedContext: { keyPhrases: [], impliedNeeds: [] },
  isValidRequest: false
};
 
// Theme Option
export const ThemeOption = {
  id: '',
  name: '',
  keyMessage: '',
  tone: '',
  cta: '',
  performancePrediction: { engagementRate: 0, confidence: 0, basis: '' },
  bestForAssets: [],
  supportingClaims: [],
  recommendedVisuals: [],
  rationale: ''
};
 
// Asset Package
export const AssetPackage = {
  assetType: '',
  assetName: '',
  structure: {},
  attachedClaims: [],
  attachedVisuals: [],
  attachedModules: [],
  estimatedCompletionTime: ''
};
 
// Curated Intelligence
export const CuratedIntelligence = {
  claims: [],
  visuals: [],
  modules: [],
  patterns: [],
  competitive: [],
  hcpTargeting: {
    targetHcpCount: 0,
    decileRange: [0, 0],
    regionFocus: '',
    highGrowthOpportunityCount: 0,
    preferredChannels: []
  },
  marketContext: {
    rxGrowthRate: 0,
    regionalGrowthRates: {},
    topPerformingRegion: '',
    marketSharePercent: 0,
    primaryCompetitor: '',
    timingRecommendation: ''
  },
  audienceInsights: {
    segmentName: '',
    decisionFactors: [],
    barriers: [],
    prescribingPatterns: '',
    claimsEmphasis: [],
    channelPreferences: []
  },
  campaignCoordination: {
    initiativeType: 'campaign',
    channelSequence: [],
    messagingArc: '',
    sharedEvidenceChain: []
  }
};
 