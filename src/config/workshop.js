
// ============================================
// Workshop Configuration
// Centralized constants and config for Content Workshop
// ============================================

export const WORKSHOP_CONFIG = {
  // Brand Configuration
  BIKTARVY_BRAND_ID: '225d6bbc-c663-462f-86a8-21886bc40047',
  
  // Intelligence Limits
  DEFAULT_CLAIM_LIMIT: 10,
  DEFAULT_VISUAL_LIMIT: 8,
  DEFAULT_MODULE_LIMIT: 6,
  
  // Auto-Selection Thresholds
  AUTO_SELECT_TOP_CLAIMS: 3,
  AUTO_SELECT_TOP_VISUALS: 2,
  AUTO_SELECT_TOP_MODULES: 2,
  
  // Relevance Thresholds
  MIN_RELEVANCE_SCORE: 0.3,
  HIGH_RELEVANCE_THRESHOLD: 0.7,
};

export const CONVERSATION_STAGES = {
  GREETING: 'greeting',
  OCCASION: 'occasion',
  AUDIENCE: 'audience',
  GOALS: 'goals',
  ASSETS: 'assets',
  BRIEF: 'brief',
};

export const STAGE_PROGRESS = {
  [CONVERSATION_STAGES.GREETING]: 0,
  [CONVERSATION_STAGES.OCCASION]: 20,
  [CONVERSATION_STAGES.AUDIENCE]: 40,
  [CONVERSATION_STAGES.GOALS]: 60,
  [CONVERSATION_STAGES.ASSETS]: 80,
  [CONVERSATION_STAGES.BRIEF]: 100,
};

export const STAGE_LABELS = {
  [CONVERSATION_STAGES.GREETING]: 'Welcome',
  [CONVERSATION_STAGES.OCCASION]: 'Occasion',
  [CONVERSATION_STAGES.AUDIENCE]: 'Audience',
  [CONVERSATION_STAGES.GOALS]: 'Goals',
  [CONVERSATION_STAGES.ASSETS]: 'Assets',
  [CONVERSATION_STAGES.BRIEF]: 'Brief Ready',
};
