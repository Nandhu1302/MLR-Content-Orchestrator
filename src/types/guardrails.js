/**
 * @typedef {Object} BrandGuardrails
 * @property {string} id
 * @property {string} brand_id
 *
 * // Core Brand Guidelines
 * @property {string[]} key_messages
 * @property {{primary:string,secondary:string,descriptors:string[]}} tone_guidelines
 * @property {string[]} content_dos
 * @property {string[]} content_donts
 *
 * // Regulatory Requirements
 * @property {{disclaimers:string[],warnings:string[],required_language:string[]}} regulatory_musts
 *
 * // Visual Standards
 * @property {{logo_usage:string,color_guidelines:string,imagery_style:string}} visual_standards
 *
 * // Competitive Intelligence
 * @property {string[]} competitive_advantages
 * @property {string[]} competitor_messaging_gaps
 * @property {string[]} competitive_threats
 * @property {string} market_positioning
 * @property {string[]} competitive_constraints
 *
 * // Staleness Tracking
 * @property {string} last_reviewed
 * @property {string} last_updated
 * @property {string} created_at
 * @property {string} [updated_by]
 */

/**
 * @typedef {Object} CompetitorInsight
 * @property {string} competitor_name
 * @property {'low'|'medium'|'high'} threat_level
 * @property {string[]} key_differentiators
 * @property {string[]} messaging_gaps
 * @property {string[]} competitive_advantages_vs_them
 * @property {string} [market_share_context]
 */

/**
 * @typedef {Object} GuardrailsStatus
 * @property {boolean} is_stale
 * @property {number} days_since_review
 * @property {boolean} needs_attention
 * @property {'fresh'|'warning'|'critical'} staleness_level
 */

/**
 * @typedef {Object} ContentComplianceCheck
 * @property {number} guideline_adherence // 0-100 score
 * @property {boolean} tone_match
 * @property {boolean} key_message_alignment
 * @property {boolean} competitive_positioning
 * @property {boolean} regulatory_compliance
 * @property {string[]} suggestions
 * @property {string[]} warnings
 */

/*
  JSDoc typedefs replace TypeScript interfaces so editors still get type hints in plain JavaScript.
*/

export default {};