/**
 * @typedef {Object} AssetPhaseBreakdown
 * @property {number} intake
 * @property {number} contentStudio
 * @property {number} mlrReview
 * @property {number} designHandoff
 * @property {number} completion
 */

/**
 * @typedef {Object} AssetLifecycleMetrics
 * @property {number} timeToMarket Avg days
 * @property {AssetPhaseBreakdown} phaseBreakdown
 * @property {'good'|'warning'|'critical'} status
 * @property {string[]} bottlenecks
 */

/**
 * @typedef {Object} ReusabilityMetrics
 * @property {number} localizationRate Percentage
 * @property {number} totalAssets
 * @property {number} localizedAssets
 * @property {number} avgMarketsPerAsset
 * @property {number} activeProjects
 */

/**
 * @typedef {Object} ThroughputMetrics
 * @property {number} monthlyCompleted
 * @property {number} wipCount
 * @property {number} dailyRate
 * @property {number} avgCycleTime
 * @property {number} trend Percentage change
 */

/**
 * @typedef {Object} QualityMetrics
 * @property {number} mlrFirstPassRate Percentage
 * @property {number} guardrailsCompliance Percentage
 * @property {number} avgReworkCycles
 * @property {number} qualityScore
 * @property {number} activeIssues
 */

/**
 * @typedef {Object} LocalizationFactoryMetrics
 * @property {number} tmLeverageRate Percentage
 * @property {number} activeProjects
 * @property {number} languagesSupported
 * @property {number} avgLeadTime Days
 * @property {number} culturalScore
 */

/**
 * @typedef {Object} CostMetrics
 * @property {number} tmCostSavings Dollars
 * @property {number} costPerAsset
 * @property {number} costPerMarket
 * @property {number} roi Percentage
 * @property {number} efficiencyTrend Percentage change
 */

/**
 * @typedef {Object} OperationsMetrics
 * @property {AssetLifecycleMetrics} lifecycle
 * @property {ReusabilityMetrics} reusability
 * @property {ThroughputMetrics} throughput
 * @property {QualityMetrics} quality
 * @property {LocalizationFactoryMetrics} localization
 * @property {CostMetrics} cost
 */

/**
 * @typedef {Object} PhaseDetail
 * @property {string} name
 * @property {number} duration
 * @property {number} assetsInPhase
 * @property {'low'|'medium'|'high'} bottleneckRisk
 * @property {number} progress
 */

/*
  JSDoc typedefs provide editor hints in plain JavaScript (converted from TypeScript interfaces).
*/

export default {};