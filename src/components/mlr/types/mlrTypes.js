
// Shared MLR Type Definitions (JavaScript)

// Enum-like constants for allowed values
const MLRSeverity = ['critical', 'high', 'medium', 'low'];
const MLRStatus = ['pending', 'applied', 'dismissed'];
const ReviewerType = ['medical', 'legal', 'regulatory'];
const FeedbackCategory = ['claim', 'safety', 'indication', 'reference', 'general'];

// Example structure for ValidationSummary
const ValidationSummary = {
  claims: { valid: 0, warnings: 0, failures: 0 },
  references: { valid: 0, missing: 0 },
  safety: { present: 0, missing: 0 },
  patterns: { critical: 0, warnings: 0 },
  regulatory: { compliant: 0, issues: 0 },
  memory: { suggestions: 0, acknowledged: 0 }
};

// BaseValidationItem example
const BaseValidationItem = {
  id: '',
  severity: 'medium', // one of MLRSeverity
  status: 'pending',  // one of MLRStatus
  isOverridden: false,
  overrideReason: ''
};

// MLRFeedback example
const MLRFeedback = {
  ...BaseValidationItem,
  reviewerId: '',
  reviewerName: '',
  reviewerType: 'medical', // one of ReviewerType
  feedback: '',
  category: 'claim', // one of FeedbackCategory
  date: '',
  assetType: '',
  similarityScore: 0,
  suggestedText: '',
  historicalContext: ''
};

// Reference example
const Reference = {
  id: '',
  citation: '',
  pmid: '',
  doi: '',
  title: '',
  authors: '',
  journal: '',
  year: '',
  isComplete: false,
  isVerified: false
};

// DetectedClaim example
const DetectedClaim = {
  ...BaseValidationItem,
  text: '',
  type: 'clinical', // allowed claim types
  confidence: 0,
  reason: '',
  requiredEvidence: [],
  suggestion: '',
  matchesPreApproved: false,
  preApprovedMatch: null,
  brandCompliance: 'compliant', // or 'warning' | 'violation'
  context: '',
  start: 0,
  end: 0
};

// MLRPattern example
const MLRPattern = {
  id: '',
  pattern_name: '',
  pattern_type: '',
  pattern_description: null,
  detection_keywords: [],
  typical_decision: '',
  approval_rate: 0,
  rejection_count: 0,
  approval_count: 0,
  common_feedback: null,
  suggested_alternative: null,
  severity: ''
};

// ContentMatch example
const ContentMatch = {
  pattern: MLRPattern,
  matchedKeywords: [],
  locations: []
};
