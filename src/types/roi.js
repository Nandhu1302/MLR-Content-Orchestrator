/**
 * @typedef {Object} ROIAssumptions
 * @property {number} annualAssets
 * @property {number} emailCount
 * @property {number} dsaCount
 * @property {number} websiteCount
 * @property {number} localizationRate Overall average for display
 * @property {number} emailLocalizationRate 0.40 = 40%
 * @property {number} dsaLocalizationRate 0.50 = 50%
 * @property {number} websiteLocalizationRate 0.50 = 50%
 * @property {number} avgMarketsPerAsset
 * @property {number} tmLeverageRate 0.30 = 30%
 * @property {number} mlrCyclesBaseline
 * @property {number} mlrCyclesTarget
 * @property {number} reworkRateBaseline
 * @property {number} avgHoursPerEmailAsset
 * @property {number} avgHoursPerDSAAsset
 * @property {number} avgHoursPerWebsiteAsset
 * @property {number} avgCostPerEmailAsset
 * @property {number} avgCostPerDSAAsset
 * @property {number} avgCostPerWebsiteAsset
 * @property {number} translationCostPerEmailPerMarket
 * @property {number} translationCostPerDSAPerMarket
 * @property {number} translationCostPerWebsitePerMarket
 * @property {number} opportunityCostPerWeek
 * @property {number} blendedLaborRate
 * @property {number} regulatoryReviewRate
 */

/**
 * @typedef {Object} DomesticValueComponent
 * @property {number} baselineSavings
 * @property {number} reworkElimination
 * @property {number} mlrCycleReduction
 * @property {number} laborEfficiency
 * @property {number} administrative
 */

/**
 * @typedef {Object} GlobalValueComponent
 * @property {number} translationSavings
 * @property {number} regulatoryEfficiency
 * @property {number} qualityImprovements
 */

/**
 * @typedef {Object} DomesticValue
 * @property {number} total
 * @property {DomesticValueComponent} components
 */

/**
 * @typedef {Object} GlobalValue
 * @property {number} total
 * @property {GlobalValueComponent} components
 */

/**
 * @typedef {Object} AssetTypeValue
 * @property {number} domestic
 * @property {number} global
 * @property {number} total
 */

/**
 * @typedef {Object} AssetTypeBreakdown
 * @property {AssetTypeValue} email
 * @property {AssetTypeValue} dsa
 * @property {AssetTypeValue} website
 */

/**
 * @typedef {Object} TimelineReduction
 * @property {string} assetType
 * @property {number} baseline Weeks
 * @property {number} platform Weeks
 * @property {number} reduction Percentage
 */

/**
 * @typedef {Object} ROIResult
 * @property {number} totalValue
 * @property {DomesticValue} domestic
 * @property {GlobalValue} global
 * @property {AssetTypeBreakdown} byAssetType
 * @property {TimelineReduction[]} timelineReductions
 * @property {ROIAssumptions} assumptions
 * @property {Date} calculatedAt
 */

/**
 * @typedef {'conservative'|'moderate'|'aggressive'} ROIScenario
 */

/*
  JSDoc typedefs replace the original TypeScript interfaces so editors still
  provide type hints while this file remains plain JavaScript.
*/

export default {};