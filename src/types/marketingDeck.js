/**
 * @typedef {import('@/utils/marketingDeckData').ProblemStat} ProblemStat
 * @typedef {import('@/utils/marketingDeckData').CaseStudyResult} CaseStudyResult
 * @typedef {import('@/utils/marketingDeckData').CompetitorFeature} CompetitorFeature
 * @typedef {import('@/utils/marketingDeckData').RiskItem} RiskItem
 * @typedef {import('@/utils/marketingDeckData').ImplementationPhase} ImplementationPhase
 */

/**
 * @typedef {Object} MarketingDeckData
 * @property {{heading:string,subheading:string,valueProposition:string,valueAmount:string,tagline:string,confidentialNote:string}} title
 * @property {ProblemStat[]} industryProblems
 * @property {any} clientPainPoints
 * @property {any} hiddenCosts
 * @property {CaseStudyResult[]} earlyAdopterResults
 * @property {any} demoProofPoints
 * @property {CompetitorFeature[]} competitiveFeatures
 * @property {RiskItem[]} riskMatrix
 * @property {ImplementationPhase[]} implementationPhases
 * @property {any} successMetrics
 * @property {any} securityCompliance
 * @property {any} integrationSystems
 */

/**
 * @typedef {Object} MarketingDeckContextType
 * @property {MarketingDeckData} slideData
 * @property {boolean} isDirty
 * @property {string} language
 * @property {function(string, any): void} updateSlideData
 * @property {function(): void} resetToDefaults
 * @property {function(string): void} setLanguage
 */

/**
 * @typedef {Object} CoBrandingConfig
 * @property {string|null} primaryBrand
 * @property {string|null} secondaryBrand
 * @property {number} blendIntensity // 0-100
 */

/**
 * @typedef {Object} BlendedTheme
 * @property {string} primary
 * @property {string} secondary
 * @property {string} accent
 * @property {string} gradientFrom
 * @property {string} gradientTo
 * @property {string} fontFamily
 */

export default {};