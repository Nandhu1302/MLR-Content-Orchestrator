// ============================================
// ROI Calculator Service
// Service for calculating Return on Investment (ROI) based on various efficiency assumptions.
// ============================================

/**
 * @typedef {Object} ROIAssumptions
 * @property {number} annualAssets - Total number of marketing assets created annually.
 * @property {number} emailCount - Number of annual email assets.
 * @property {number} dsaCount - Number of annual DSA (Digital Sales Aid) assets.
 * @property {number} websiteCount - Number of annual website assets/pages.
 * @property {number} localizationRate - Overall localization rate (average of asset-specific rates).
 * @property {number} emailLocalizationRate - Percentage of email assets localized.
 * @property {number} dsaLocalizationRate - Percentage of DSA assets localized.
 * @property {number} websiteLocalizationRate - Percentage of website assets localized.
 * @property {number} avgMarketsPerAsset - Average number of markets an asset is localized into.
 * @property {number} tmLeverageRate - Translation Memory (TM) leverage rate for cost savings (e.g., 0.30 for 30%).
 * @property {number} mlrCyclesBaseline - Baseline number of MLR (Medical, Legal, Regulatory) review cycles.
 * @property {number} mlrCyclesTarget - Target number of MLR review cycles after implementation.
 * @property {number} reworkRateBaseline - Baseline rework rate (e.g., 0.60 for 60%).
 * @property {number} avgHoursPerEmailAsset - Average labor hours spent on an email asset.
 * @property {number} avgHoursPerDSAAsset - Average labor hours spent on a DSA asset.
 * @property {number} avgHoursPerWebsiteAsset - Average labor hours spent on a website asset.
 * @property {number} avgCostPerEmailAsset - Average internal cost to create an email asset (excluding labor hours).
 * @property {number} avgCostPerDSAAsset - Average internal cost to create a DSA asset.
 * @property {number} avgCostPerWebsiteAsset - Average internal cost to create a website asset.
 * @property {number} translationCostPerEmailPerMarket - Average external translation cost for an email asset per market.
 * @property {number} translationCostPerDSAPerMarket - Average external translation cost for a DSA asset per market.
 * @property {number} translationCostPerWebsitePerMarket - Average external translation cost for a website asset per market.
 * @property {number} opportunityCostPerWeek - Estimated opportunity cost per week of delay (e.g., lost sales/market entry delay).
 * @property {number} blendedLaborRate - Average blended labor rate (cost per hour) for internal teams.
 * @property {number} regulatoryReviewRate - Blended labor rate specifically for regulatory review hours.
 */

/**
 * @typedef {Object} DomesticValueComponents
 * @property {number} baselineSavings
 * @property {number} reworkElimination
 * @property {number} mlrCycleReduction
 * @property {number} laborEfficiency
 * @property {number} administrative
 */

/**
 * @typedef {Object} DomesticValue
 * @property {number} total
 * @property {DomesticValueComponents} components
 */

/**
 * @typedef {Object} GlobalValueComponents
 * @property {number} translationSavings
 * @property {number} regulatoryEfficiency
 * @property {number} qualityImprovements
 */

/**
 * @typedef {Object} GlobalValue
 * @property {number} total
 * @property {GlobalValueComponents} components
 */

/**
 * @typedef {Object} AssetValue
 * @property {number} domestic
 * @property {number} global
 * @property {number} total
 */

/**
 * @typedef {Object} AssetTypeBreakdown
 * @property {AssetValue} email
 * @property {AssetValue} dsa
 * @property {AssetValue} website
 */

/**
 * @typedef {Object} TimelineReduction
 * @property {string} assetType
 * @property {number} baseline // e.g., weeks
 * @property {number} platform // e.g., target weeks
 * @property {number} reduction // e.g., percentage
 */

/**
 * @typedef {'conservative' | 'default' | 'aggressive'} ROIScenario
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

export class ROICalculatorService {
  /**
   * @private
   * @returns {ROIAssumptions}
   */
  static getDefaultAssumptions() {
      /** @type {ROIAssumptions} */
      return {
          annualAssets: 80,
          emailCount: 60,
          dsaCount: 10,
          websiteCount: 10,
          localizationRate: 0.425,
          emailLocalizationRate: 0.40,
          dsaLocalizationRate: 0.50,
          websiteLocalizationRate: 0.50,
          avgMarketsPerAsset: 3.0,
          tmLeverageRate: 0.30,
          mlrCyclesBaseline: 3.2,
          mlrCyclesTarget: 1.5,
          reworkRateBaseline: 0.60,
          avgHoursPerEmailAsset: 30,
          avgHoursPerDSAAsset: 200,
          avgHoursPerWebsiteAsset: 200,
          avgCostPerEmailAsset: 500,
          avgCostPerDSAAsset: 10000,
          avgCostPerWebsiteAsset: 10000,
          translationCostPerEmailPerMarket: 2000,
          translationCostPerDSAPerMarket: 20000,
          translationCostPerWebsitePerMarket: 20000,
          opportunityCostPerWeek: 5000,
          blendedLaborRate: 150,
          regulatoryReviewRate: 150,
      };
  }

  /**
   * @param {ROIScenario} scenario
   * @returns {ROIAssumptions}
   */
  static getScenarioAssumptions(scenario) {
      const base = this.getDefaultAssumptions();

      switch (scenario) {
          case 'conservative':
              return {
                  ...base,
                  emailLocalizationRate: 0.30,
                  dsaLocalizationRate: 0.40,
                  websiteLocalizationRate: 0.40,
                  localizationRate: 0.325,
                  avgMarketsPerAsset: 3.0,
                  tmLeverageRate: 0.20,
                  mlrCyclesTarget: 2.0,
              };
          case 'aggressive':
              return {
                  ...base,
                  emailLocalizationRate: 0.50,
                  dsaLocalizationRate: 0.60,
                  websiteLocalizationRate: 0.60,
                  localizationRate: 0.525,
                  avgMarketsPerAsset: 3.0,
                  tmLeverageRate: 0.40,
                  mlrCyclesTarget: 1.2,
              };
          default:
              return base;
      }
  }

  /**
   * @param {Partial<ROIAssumptions>} [assumptions]
   * @returns {ROIResult}
   */
  static calculateROI(assumptions) {
      const fullAssumptions = { ...this.getDefaultAssumptions(), ...assumptions };

      const domestic = this.calculateDomesticValue(fullAssumptions);
      const global = this.calculateGlobalValue(fullAssumptions);
      const byAssetType = this.calculateByAssetType(fullAssumptions);
      const timelineReductions = this.calculateTimelineReductions(fullAssumptions);

      /** @type {ROIResult} */
      return {
          totalValue: domestic.total + global.total,
          domestic,
          global,
          byAssetType,
          timelineReductions,
          assumptions: fullAssumptions,
          calculatedAt: new Date(),
      };
  }

  /**
   * @private
   * @param {ROIAssumptions} assumptions
   * @returns {DomesticValue}
   */
  static calculateDomesticValue(assumptions) {
      // Baseline Cost Savings (10% efficiency on asset creation)
      const emailBaseline = assumptions.emailCount * assumptions.avgCostPerEmailAsset * 0.10;
      const dsaBaseline = assumptions.dsaCount * assumptions.avgCostPerDSAAsset * 0.10;
      const websiteBaseline = assumptions.websiteCount * assumptions.avgCostPerWebsiteAsset * 0.10;
      const baselineSavings = emailBaseline + dsaBaseline + websiteBaseline;

      // Rework & MLR Revision Elimination (reduce 60% rework to 10% -> 50% reduction on the base cost)
      const reworkReduction = assumptions.reworkRateBaseline - 0.10; // 0.60 - 0.10 = 0.50
      const reworkFactor = 0.30; // Assuming 30% of asset creation cost is rework labor/cost
      const emailRework = assumptions.emailCount * assumptions.avgCostPerEmailAsset * reworkReduction * reworkFactor;
      const dsaRework = assumptions.dsaCount * assumptions.avgCostPerDSAAsset * reworkReduction * reworkFactor;
      const websiteRework = assumptions.websiteCount * assumptions.avgCostPerWebsiteAsset * reworkReduction * reworkFactor;
      const reworkElimination = emailRework + dsaRework + websiteRework;

      // MLR Cycle Reduction Value (3.2 → 1.5 cycles)
      const cycleReduction = assumptions.mlrCyclesBaseline - assumptions.mlrCyclesTarget;
      const weeksPerCycle = 1; // Assuming one week per review cycle delay
      const totalWeeksSaved = assumptions.annualAssets * cycleReduction * weeksPerCycle;
      const mlrCycleReduction = totalWeeksSaved * assumptions.opportunityCostPerWeek;

      // Labor Efficiency Gains (40% time reduction)
      const emailLaborSavings = assumptions.emailCount * assumptions.avgHoursPerEmailAsset * 0.40 * assumptions.blendedLaborRate;
      const dsaLaborSavings = assumptions.dsaCount * assumptions.avgHoursPerDSAAsset * 0.40 * assumptions.blendedLaborRate;
      const websiteLaborSavings = assumptions.websiteCount * assumptions.avgHoursPerWebsiteAsset * 0.40 * assumptions.blendedLaborRate;
      const laborEfficiency = emailLaborSavings + dsaLaborSavings + websiteLaborSavings;

      // Administrative Coordination Reduction (Assumed 25% of baseline cost * 2.5) - Interpretation is complex, using the original calculation structure
      const administrative = (emailBaseline + dsaBaseline + websiteBaseline) * 2.5;

      /** @type {DomesticValueComponents} */
      const components = {
          baselineSavings,
          reworkElimination,
          mlrCycleReduction,
          laborEfficiency,
          administrative,
      };
      
      return {
          total: components.baselineSavings + components.reworkElimination + components.mlrCycleReduction + components.laborEfficiency + components.administrative,
          components: components,
      };
  }

  /**
   * @private
   * @param {ROIAssumptions} assumptions
   * @returns {GlobalValue}
   */
  static calculateGlobalValue(assumptions) {
      // Asset-specific localizations
      const emailLocalizations = Math.round(assumptions.emailCount * assumptions.emailLocalizationRate);
      const dsaLocalizations = Math.round(assumptions.dsaCount * assumptions.dsaLocalizationRate);
      const websiteLocalizations = Math.round(assumptions.websiteCount * assumptions.websiteLocalizationRate);
      const totalLocalizedAssets = emailLocalizations + dsaLocalizations + websiteLocalizations;

      // Translation Cost Savings via TM Leverage (30%)
      const emailTranslationSavings = emailLocalizations * assumptions.avgMarketsPerAsset *
          assumptions.translationCostPerEmailPerMarket * assumptions.tmLeverageRate;
      const dsaTranslationSavings = dsaLocalizations * assumptions.avgMarketsPerAsset *
          assumptions.translationCostPerDSAPerMarket * assumptions.tmLeverageRate;
      const websiteTranslationSavings = websiteLocalizations * assumptions.avgMarketsPerAsset *
          assumptions.translationCostPerWebsitePerMarket * assumptions.tmLeverageRate;
      const translationSavings = emailTranslationSavings + dsaTranslationSavings + websiteTranslationSavings;

      // Regulatory Review Efficiency (40% time reduction on market adaptations)
      const avgReviewHoursPerMarket = 4;
      const totalMarketAdaptations = totalLocalizedAssets * assumptions.avgMarketsPerAsset;
      const regulatoryEfficiency = totalMarketAdaptations * avgReviewHoursPerMarket * 0.40 * assumptions.regulatoryReviewRate;

      // Quality & Consistency Improvements ($1,500 per market adaptation)
      const qualityImprovements = totalMarketAdaptations * 1500;

      /** @type {GlobalValueComponents} */
      const components = {
          translationSavings,
          regulatoryEfficiency,
          qualityImprovements,
      };

      return {
          total: components.translationSavings + components.regulatoryEfficiency + components.qualityImprovements,
          components: components,
      };
  }

  /**
   * @private
   * @param {ROIAssumptions} assumptions
   * @returns {AssetTypeBreakdown}
   */
  static calculateByAssetType(assumptions) {
      // --- Domestic Value per Asset ---
      
      // Domestic Value per Asset (Simplified):
      // 10% Baseline Cost Reduction + 15% Rework Elimination (ReworkReduction * ReworkFactor = 0.50 * 0.30 = 0.15) 
      // + Labor Efficiency (AvgHours * 0.40 * BlendedRate)

      // Email calculations
      const emailDomestic =
          (assumptions.avgCostPerEmailAsset * 0.10) +
          (assumptions.avgCostPerEmailAsset * 0.15) +
          (assumptions.avgHoursPerEmailAsset * 0.40 * assumptions.blendedLaborRate);

      const emailLocalizations = Math.round(assumptions.emailCount * assumptions.emailLocalizationRate);
      const emailGlobal = assumptions.emailCount > 0 && emailLocalizations > 0
          ? (emailLocalizations * assumptions.avgMarketsPerAsset *
              assumptions.translationCostPerEmailPerMarket * assumptions.tmLeverageRate) / assumptions.emailCount
          : 0;

      // DSA calculations
      const dsaDomestic =
          (assumptions.avgCostPerDSAAsset * 0.10) +
          (assumptions.avgCostPerDSAAsset * 0.15) +
          (assumptions.avgHoursPerDSAAsset * 0.40 * assumptions.blendedLaborRate);

      const dsaLocalizations = Math.round(assumptions.dsaCount * assumptions.dsaLocalizationRate);
      const dsaGlobal = assumptions.dsaCount > 0 && dsaLocalizations > 0
          ? (dsaLocalizations * assumptions.avgMarketsPerAsset *
              assumptions.translationCostPerDSAPerMarket * assumptions.tmLeverageRate) / assumptions.dsaCount
          : 0;

      // Website calculations
      const websiteDomestic =
          (assumptions.avgCostPerWebsiteAsset * 0.10) +
          (assumptions.avgCostPerWebsiteAsset * 0.15) +
          (assumptions.avgHoursPerWebsiteAsset * 0.40 * assumptions.blendedLaborRate);

      const websiteLocalizations = Math.round(assumptions.websiteCount * assumptions.websiteLocalizationRate);
      const websiteGlobal = assumptions.websiteCount > 0 && websiteLocalizations > 0
          ? (websiteLocalizations * assumptions.avgMarketsPerAsset *
              assumptions.translationCostPerWebsitePerMarket * assumptions.tmLeverageRate) / assumptions.websiteCount
          : 0;

      /** @type {AssetTypeBreakdown} */
      return {
          email: {
              domestic: emailDomestic,
              global: emailGlobal,
              total: emailDomestic + emailGlobal,
          },
          dsa: {
              domestic: dsaDomestic,
              global: dsaGlobal,
              total: dsaDomestic + dsaGlobal,
          },
          website: {
              domestic: websiteDomestic,
              global: websiteGlobal,
              total: websiteDomestic + websiteGlobal,
          },
      };
  }

  /**
   * @private
   * @param {ROIAssumptions} assumptions
   * @returns {TimelineReduction[]}
   */
  static calculateTimelineReductions(assumptions) {
      /** @type {TimelineReduction[]} */
      return [
          {
              assetType: 'Email',
              baseline: 4,
              platform: 1,
              reduction: 75,
          },
          {
              assetType: 'DSA',
              baseline: 12,
              platform: 3,
              reduction: 75,
          },
          {
              assetType: 'Website',
              baseline: 12,
              platform: 3,
              reduction: 75,
          },
      ];
  }

  /**
   * @param {number} value
   * @returns {string}
   */
  static formatCurrency(value) {
      if (value >= 1000000) {
          return `$${(value / 1000000).toFixed(1)}M`;
      }
      if (value >= 1000) {
          return `$${(value / 1000).toFixed(0)}K`;
      }
      return `$${Math.round(value).toLocaleString()}`;
  }

  /**
   * @param {number} value
   * @returns {string}
   */
  static formatPercentage(value) {
      return `${Math.round(value)}%`;
  }
}