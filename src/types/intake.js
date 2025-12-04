/**
 * Asset and Campaign Intake Type Definitions (JSDoc)
 */

/**
 * @typedef {'mass-email'|'rep-triggered-email'|'patient-email'|'caregiver-email'|'social-media-post'|'website-landing-page'|'digital-sales-aid'} AssetType
 */

/**
 * @typedef {'single-asset'|'campaign'} InitiativeType
 */

/**
 * @typedef {'IPF'|'SSc-ILD'|'Progressive-Fibrosing-ILD'|'A-Fib'|'VTE-Prevention'|'Stroke-Prevention'|'Type-2-Diabetes'|'Cardiovascular-Death-Reduction'|'Heart-Failure'|'NSCLC'|'EGFR-Mutated-NSCLC'|'Colorectal-Cancer'|'Head-Neck-Cancer'|'Atopic-Dermatitis'|'Asthma'|'Chronic-Rhinosinusitis'} Indication
 */

/**
 * @typedef {'HCP'|'Patient'|'Caregiver'|'Other'} AudienceType
 */

/**
 * @typedef {'US'|'EU'|'UK'|'Canada'} Market
 */

/**
 * @typedef {'draft'|'in-progress'|'content-review'|'design-review'|'mlr-review'|'approved'|'published'} AssetStatus
 */

/**
 * @typedef {'draft'|'planning'|'in-progress'|'review'|'approved'|'active'|'completed'} CampaignStatus
 */

/**
 * @typedef {Object} RegulatoryFlag
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {boolean} required
 * @property {Market[]} markets
 */

/**
 * @typedef {Object} Milestone
 * @property {string} id
 * @property {string} name
 * @property {string} date ISO-8601 date string
 * @property {'pending'|'in-progress'|'completed'|'overdue'} status
 * @property {string[]} [dependencies]
 */

/**
 * @typedef {Object} AssetConfiguration
 * @property {AssetType} type
 * @property {string} name
 * @property {string} description
 * @property {string} template
 * @property {string[]} requiredFields
 * @property {RegulatoryFlag[]} regulatoryRequirements
 * @property {number} estimatedHours
 * @property {string[]} channels
 */

/**
 * @typedef {Object} IntakeData
 * @property {string} projectId
 * @property {string} projectName
 * @property {InitiativeType} initiativeType
 *
 * // Brand Context (Auto-filled from Brand Configuration)
 * @property {string} brand
 * @property {Indication} indication
 * @property {string} [company]
 *
 * // Targeting
 * @property {AudienceType} primaryAudience
 * @property {string[]} audienceSegment
 * @property {Market[]} targetMarkets
 *
 * // Asset Configuration
 * @property {AssetType[]} selectedAssetTypes
 *
 * // Content Strategy
 * @property {string} primaryObjective
 * @property {string} keyMessage
 * @property {string} callToAction
 *
 * // Regulatory
 * @property {RegulatoryFlag[]} regulatoryFlags
 * @property {boolean} fairBalanceRequired
 *
 * // Timeline
 * @property {string} plannedLaunch ISO-8601 date string
 * @property {Milestone[]} milestones
 *
 * // System fields
 * @property {string} createdAt ISO-8601 date string
 * @property {string} updatedAt ISO-8601 date string
 * @property {string} createdBy
 * @property {CampaignStatus|AssetStatus} status
 */

/**
 * @typedef {Object} AssetData
 * @property {string} projectId
 * @property {string} projectName
 * @property {InitiativeType} initiativeType
 * @property {string} brand
 * @property {Indication} indication
 * @property {string} [company]
 * @property {AudienceType} primaryAudience
 * @property {string[]} audienceSegment
 * @property {Market[]} targetMarkets
 * @property {AssetType} assetType
 * @property {string} assetId
 * @property {string} [parentCampaignId]
 * @property {Object} [content]
 * @property {string} [content.subject]
 * @property {string} [content.body]
 * @property {string[]} [content.images]
 * @property {string[]} [content.links]
 * @property {AssetStatus} status
 * @property {string} [assignedTo]
 * @property {string[]} [reviewers]
 * @property {string} [mlrSubmissionDate] ISO-8601 date string
 * @property {string} [approvalDate] ISO-8601 date string
 */

/**
 * @typedef {Object} CampaignData
 * @property {string} projectId
 * @property {string} projectName
 * @property {InitiativeType} initiativeType
 * @property {string} brand
 * @property {Indication} indication
 * @property {string} [company]
 * @property {AudienceType} primaryAudience
 * @property {string[]} audienceSegment
 * @property {Market[]} targetMarkets
 * @property {AssetType[]} selectedAssetTypes
 * @property {string} primaryObjective
 * @property {string} keyMessage
 * @property {string} callToAction
 * @property {RegulatoryFlag[]} regulatoryFlags
 * @property {boolean} fairBalanceRequired
 * @property {string} plannedLaunch ISO-8601 date string
 * @property {Milestone[]} milestones
 * @property {string} createdAt ISO-8601 date string
 * @property {string} updatedAt ISO-8601 date string
 * @property {string} createdBy
 * @property {CampaignStatus} status
 * @property {string} campaignId
 * @property {AssetData[]} assets
 * @property {string[]} teamMembers
 * @property {number} [budget]
 * @property {Object} [performanceMetrics]
 * @property {number} [performanceMetrics.totalReach]
 * @property {number} [performanceMetrics.engagementRate]
 * @property {number} [performanceMetrics.conversionRate]
 * @property {number} [performanceMetrics.mlrSuccessRate]
 */

/**
 * @typedef {Object} IntakeTemplate
 * @property {string} id
 * @property {string} name
 * @property {'campaign'|'single-asset'} category
 * @property {string} description
 * @property {string} estimatedTime
 * @property {number} successRate
 * @property {Object.<string, any>} preFilledData
 * @property {'minimal'|'moderate'|'advanced'} customizationLevel
 * @property {string} thumbnail
 * @property {string[]} tags
 * @property {Object[]} [assetBreakdown] - array of {assetType, name, estimatedHours}
 * @property {number} timelineWeeks
 */

/**
 * Theme Generation Types
 */

/**
 * @typedef {'veeva-crm'|'salesforce-crm'|'sfmc'|'iqvia'|'zs-associates'|'internal-campaigns'|'competitive-intel'} DataSource
 */

/**
 * @typedef {Object} DataSourceConnection
 * @property {DataSource} source
 * @property {string} name
 * @property {'connected'|'analyzing'|'complete'|'error'} status
 * @property {number} [recordsAnalyzed]
 * @property {string} [analysisTime]
 * @property {string[]} [insights]
 */

/**
 * @typedef {Object} ThemePerformancePrediction
 * @property {number} successProbability
 * @property {number} engagementRate
 * @property {number} mlrApprovalRate
 * @property {number} expectedReach
 * @property {number} competitiveAdvantage
 */

/**
 * @typedef {Object} ThemeRationale
 * @property {string} primaryInsight
 * @property {string[]} supportingData
 * @property {string[]} historicalEvidence
 * @property {string[]} riskFactors
 * @property {string[]} recommendations
 */

/**
 * @typedef {Object} GeneratedTheme
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {'clinical-evidence'|'patient-journey'|'market-access'|'competitive-positioning'|'safety-focused'} category
 * @property {string} keyMessage
 * @property {string} callToAction
 * @property {Object} targetingRefinements
 * @property {AudienceType} targetingRefinements.primaryAudience
 * @property {string[]} targetingRefinements.audienceSegments
 * @property {Market[]} targetingRefinements.markets
 * @property {Object} contentSuggestions
 * @property {string[]} contentSuggestions.headlines
 * @property {string[]} contentSuggestions.keyPoints
 * @property {string[]} contentSuggestions.visualElements
 * @property {ThemePerformancePrediction} performancePrediction
 * @property {ThemeRationale} rationale
 * @property {DataSource[]} dataSources
 * @property {number} confidence
 * @property {string} createdAt ISO-8601 date string
 */

/**
 * @typedef {Object} ThemeGenerationRequest
 * @property {IntakeData} intakeData
 * @property {IntakeTemplate} [template]
 * @property {'quick'|'standard'|'comprehensive'} analysisDepth
 * @property {string[]} focusAreas
 */

/*
  JSDoc typedefs replace TypeScript types so editors still get type hints in plain JavaScript.
*/

export default {};