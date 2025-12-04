/**
 * Types for Public Domain Intelligence System (JSDoc typedefs)
 */

/**
 * @typedef {'regulatory'|'competitive'|'clinical'|'market'|'industry'} SourceType
 * @typedef {'new'|'reviewed'|'applied'|'archived'} InsightStatus
 * @typedef {'manual'|'scheduled'|'on_demand'} RefreshType
 * @typedef {'all'|'regulatory'|'competitive'|'clinical'|'market'} RefreshScope
 * @typedef {'running'|'completed'|'failed'} RefreshStatus
 */

/**
 * @typedef {Object} PublicDomainInsight
 * @property {string} id
 * @property {string} brand_id
 *
 * // Source information
 * @property {SourceType} source_type
 * @property {string} [source_url]
 * @property {string} source_name
 *
 * // Content
 * @property {string} title
 * @property {string} summary
 * @property {string} [full_content]
 * @property {string[]} key_findings
 *
 * // Metadata
 * @property {number} [relevance_score]
 * @property {string} [publish_date]
 * @property {string} discovered_at
 *
 * // Status tracking
 * @property {InsightStatus} status
 * @property {string} [reviewed_by]
 * @property {string} [reviewed_at]
 *
 * // Categorization
 * @property {string} [therapeutic_area]
 * @property {string} [market]
 * @property {string[]} tags
 *
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} CompetitiveIntelligenceEnriched
 * @property {string} id
 * @property {string} brand_id
 *
 * // Competitor information
 * @property {string} competitor_name
 * @property {'clinical_trial'|'press_release'|'positioning'|'warning_letter'|'patent'|'regulatory_filing'|'market_data'} intelligence_type
 *
 * // Content
 * @property {string} title
 * @property {string} content
 * @property {string} [source_url]
 * @property {string} [source_date]
 *
 * // Analysis
 * @property {string} [impact_assessment]
 * @property {string[]} recommended_actions
 * @property {'low'|'medium'|'high'|'critical'} [threat_level]
 *
 * // Metadata
 * @property {string} discovered_at
 * @property {'active'|'addressed'|'archived'} status
 *
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} IntelligenceRefreshLog
 * @property {string} id
 * @property {string} [brand_id]
 *
 * // Refresh details
 * @property {RefreshType} refresh_type
 * @property {RefreshScope} refresh_scope
 *
 * // Results
 * @property {number} sources_checked
 * @property {number} insights_found
 * @property {number} guardrails_updated
 *
 * // Status
 * @property {RefreshStatus} status
 * @property {string} [error_message]
 *
 * // Timing
 * @property {string} started_at
 * @property {string} [completed_at]
 * @property {number} [duration_seconds]
 *
 * @property {string} created_at
 */

/**
 * @typedef {Object} IntelligenceRefreshResult
 * @property {boolean} success
 * @property {string} [brandId]
 * @property {number} insightsFound
 * @property {number} sourcesChecked
 * @property {number} [durationSeconds]
 * @property {string} [summary]
 * @property {string} [error]
 */

/*
  JSDoc typedefs provide the same editor hints as the original TypeScript interfaces
  while keeping the file as plain JavaScript.
*/

export default {};