/**
 * @typedef {Object} BrandProfile
 * @property {string} id
 * @property {string} brand_name
 * @property {string} company
 * @property {string} therapeutic_area
 * @property {string} [logo_url]
 * @property {string} primary_color
 * @property {string} secondary_color
 * @property {string} accent_color
 * @property {string} font_family
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} BrandGuidelines
 * @property {string} id
 * @property {string} brand_id
 * @property {{primary:string,secondary:string,characteristics:string[]}} tone_of_voice
 * @property {{core_message:string,key_pillars:string[],differentiators:string[]}} messaging_framework
 * @property {{color_usage:string,spacing:string,imagery:string}} visual_guidelines
 * @property {string} logo_usage_rules
 * @property {{primary:string,weights:string[],fallbacks:string[]}} typography
 * @property {string} imagery_style
 * @property {string} last_updated
 * @property {string} [updated_by]
 * @property {string} created_at
 */

/**
 * @typedef {Object} RegulatoryProfile
 * @property {string} id
 * @property {string} brand_id
 * @property {string} indication
 * @property {string} market
 * @property {any[]} regulatory_flags
 * @property {string} [fair_balance_text]
 * @property {string} [boxed_warnings]
 * @property {string} [contraindications]
 * @property {any[]} approval_processes
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} CompetitiveLandscape
 * @property {string} id
 * @property {string} brand_id
 * @property {string} competitor_name
 * @property {any[]} competitive_advantages
 * @property {string[]} key_differentiators
 * @property {string[]} messaging_opportunities
 * @property {any} market_share_data
 * @property {'low'|'medium'|'high'} threat_level
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} RegionalSettings
 * @property {string} id
 * @property {string} brand_id
 * @property {string} market
 * @property {any[]} compliance_requirements
 * @property {any[]} review_processes
 * @property {string} [local_guidelines]
 * @property {string[]} language_preferences
 * @property {string} [regulatory_contact]
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} BrandConfiguration
 * @property {BrandProfile} profile
 * @property {BrandGuidelines} [guidelines]
 * @property {RegulatoryProfile[]} regulatory
 * @property {CompetitiveLandscape[]} competitive
 * @property {RegionalSettings[]} regional
 */

/**
 * @callback SelectBrandFn
 * @param {string} brandId
 * @returns {Promise<void>}
 */

/**
 * @callback RefreshBrandFn
 * @returns {Promise<void>}
 */

/**
 * @callback ApplyCoBrandingFn
 * @param {string} primaryId
 * @param {string|null} secondaryId
 * @param {number} intensity
 * @returns {Promise<void>}
 */

/**
 * @typedef {Object} BrandContextType
 * @property {BrandProfile|null} selectedBrand
 * @property {BrandConfiguration|null} brandConfiguration
 * @property {boolean} isLoading
 * @property {Date|null} lastUpdated
 * @property {boolean} needsUpdate
 * @property {SelectBrandFn} selectBrand
 * @property {RefreshBrandFn} refreshBrand
 * @property {() => void} clearBrand
 * @property {{primaryBrand:string|null,secondaryBrand:string|null,blendIntensity:number}|undefined} [coBranding]
 * @property {ApplyCoBrandingFn|undefined} [applyCoBranding]
 */

/**
 * @typedef {Object} BrandTheme
 * @property {string} primary
 * @property {string} secondary
 * @property {string} accent
 * @property {string} fontFamily
 */

/*
  This file replaces the previous TypeScript-only declarations with JSDoc typedefs
  so editors/IDEs can still provide type hints in plain JavaScript.
*/

export default {};