/**
 * Glocal Module JSDoc typedefs (converted from TypeScript)
 * These typedefs provide editor/IDE hints in plain JavaScript.
 */

/**
 * @typedef {'draft'|'in_progress'|'review'|'completed'|'archived'} GlocalProjectStatus
 */

/**
 * @typedef {Object} GlocalAdaptationProject
 * @property {string} id
 * @property {string} brand_id
 * @property {string} project_name
 * @property {string} [project_description]
 * @property {string} source_content_type
 * @property {GlocalEmailContent} source_content
 * @property {string[]} target_markets
 * @property {string[]} target_languages
 * @property {string} [therapeutic_area]
 * @property {string} [indication]
 * @property {GlocalProjectStatus} project_status
 *
 * @property {number} cultural_intelligence_score
 * @property {number} regulatory_compliance_score
 * @property {number} tm_leverage_score
 * @property {number} overall_quality_score
 * @property {number} market_readiness_score
 *
 * @property {Object.<string, any>} project_metadata
 * @property {GlocalWorkflowState} workflow_state
 *
 * @property {string} [created_by]
 * @property {string} created_at
 * @property {string} updated_at
 * @property {string} [completed_at]
 */

/**
 * @typedef {Object} GlocalEmailContent
 * @property {string} emailType
 * @property {string} brandName
 * @property {string} therapeuticArea
 * @property {string} indication
 * @property {GlocalContentSegment[]} contentSegments
 * @property {{totalSegments:number,highComplexityCount:number,mediumComplexityCount:number,lowComplexityCount:number}} metadata
 */

/**
 * @typedef {'high'|'medium'|'low'} GlocalComplexityLevel
 */

/**
 * @typedef {Object} GlocalContentSegment
 * @property {string} id
 * @property {string} project_id
 * @property {number} segment_index
 * @property {string} segment_type
 * @property {string} segment_name
 *
 * @property {string} source_text
 * @property {string} [adapted_text]
 *
 * @property {GlocalComplexityLevel} complexity_level
 * @property {GlocalComplexityLevel} cultural_sensitivity_level
 * @property {GlocalComplexityLevel} regulatory_risk_level
 *
 * @property {'pending'|'processing'|'completed'|'failed'} tm_match_status
 * @property {'pending'|'processing'|'completed'|'failed'} cultural_review_status
 * @property {'pending'|'processing'|'completed'|'failed'} regulatory_review_status
 *
 * @property {number} tm_confidence_score
 * @property {number} cultural_appropriateness_score
 * @property {number} regulatory_compliance_score
 *
 * @property {Object.<string, any>} segment_metadata
 *
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {'exact'|'fuzzy'|'context'|'terminology'} GlocalTMMatchType
 */

/**
 * @typedef {Object} GlocalTMIntelligence
 * @property {string} id
 * @property {string} segment_id
 * @property {string} project_id
 *
 * @property {string} tm_source_text
 * @property {string} tm_target_text
 * @property {number} match_score
 * @property {GlocalTMMatchType} match_type
 *
 * @property {string} source_language
 * @property {string} target_language
 * @property {string} [therapeutic_area]
 * @property {string} [domain_context]
 *
 * @property {number} quality_score
 * @property {number} confidence_level
 * @property {number} [human_approval_rating]
 *
 * @property {Object.<string, any>} tm_metadata
 * @property {number} usage_count
 * @property {string} [last_used_at]
 *
 * @property {string} created_at
 */

/**
 * @typedef {Object} GlocalCulturalIntelligence
 * @property {string} id
 * @property {string} segment_id
 * @property {string} project_id
 *
 * @property {string} target_market
 * @property {string} target_language
 *
 * @property {{formality_level:string,emotional_tone:string,directness_style:string}} cultural_tone_analysis
 * @property {{addressForms:string[],respectfulLanguage:string[]}} formality_recommendations
 * @property {{colorPreferences:string[],symbolism:string[],imageGuidelines:string[]}} visual_cultural_guidance
 * @property {{preferredStyle:string,keyConsiderations:string[]}} communication_style_insights
 *
 * @property {number} cultural_appropriateness_score
 * @property {number} adaptation_quality_score
 * @property {number} market_relevance_score
 *
 * @property {any[]} adaptation_suggestions
 * @property {any[]} risk_factors
 *
 * @property {Object.<string, any>} analysis_metadata
 *
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} GlocalRegulatoryCompliance
 * @property {string} id
 * @property {string} segment_id
 * @property {string} project_id
 *
 * @property {string} target_market
 * @property {string} regulatory_body
 *
 * @property {any[]} compliance_requirements
 * @property {Object.<string, any>} fair_balance_assessment
 * @property {any[]} claims_validation
 * @property {any[]} required_disclaimers
 *
 * @property {number} compliance_score
 * @property {'high'|'medium'|'low'} risk_level
 *
 * @property {any[]} compliance_issues
 * @property {any[]} recommendations
 *
 * @property {Object.<string, any>} compliance_metadata
 *
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} GlocalWorkflow
 * @property {string} id
 * @property {string} project_id
 *
 * @property {string} workflow_name
 * @property {string} workflow_type
 *
 * @property {Object.<string, any>} phase_1_global_context
 * @property {Object.<string, any>} phase_2_tm_intelligence
 * @property {Object.<string, any>} phase_3_cultural_intelligence
 * @property {Object.<string, any>} phase_4_regulatory_compliance
 * @property {Object.<string, any>} phase_5_quality_assurance
 * @property {Object.<string, any>} phase_6_dam_handoff
 * @property {Object.<string, any>} phase_7_integration
 *
 * @property {string} current_phase
 * @property {'in_progress'|'completed'|'paused'|'failed'} workflow_status
 *
 * @property {Object.<string, any>} workflow_metadata
 * @property {string} last_auto_save
 *
 * @property {string} created_at
 * @property {string} updated_at
 * @property {string} [completed_at]
 */

/**
 * @typedef {Object} GlocalWorkflowState
 * @property {number} currentPhase
 * @property {number[]} phasesCompleted
 * @property {number} totalPhases
 * @property {Object.<string, any>} phaseData
 */

/**
 * @typedef {Object} GlocalAnalytics
 * @property {string} id
 * @property {string} project_id
 *
 * @property {string} metric_type
 * @property {number} metric_value
 * @property {Object.<string, any>} metric_context
 *
 * @property {string} measurement_date
 *
 * @property {string} created_at
 */

/**
 * @typedef {Object} GlocalMasterEmailTemplateSegment
 * @property {number} segmentIndex
 * @property {string} segmentType
 * @property {string} segmentName
 * @property {string} sourceText
 * @property {'high'|'medium'|'low'} complexityLevel
 * @property {'high'|'medium'|'low'} culturalSensitivityLevel
 * @property {'high'|'medium'|'low'} regulatoryRiskLevel
 */

/**
 * @typedef {Object} GlocalMasterEmailTemplate
 * @property {string} templateId
 * @property {string} brandName
 * @property {string} brandId
 * @property {string} therapeuticArea
 * @property {string} indication
 * @property {string} emailType
 *
 * @property {GlocalMasterEmailTemplateSegment[]} contentSegments
 *
 * @property {{category:string,testPoints:string[]}[]} culturalIntelligenceTestPoints
 * @property {{category:string,entries:string[]}[]} smartTMMemoryBanks
 * @property {{requirement:string,markets:string[]}[]} regulatoryAdaptationPoints
 */

/*
  JSDoc typedefs replace TypeScript interfaces so editors still get type hints in plain JavaScript.
*/

export default {};