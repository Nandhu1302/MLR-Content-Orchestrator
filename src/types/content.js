/**
 * @typedef {Object} ContentProject
 * @property {string} id
 * @property {string} brand_id
 * @property {string} project_name
 * @property {'campaign'|'single-asset'|'initiative'} project_type
 * @property {string} [description]
 * @property {'draft'|'in_progress'|'completed'|'archived'} status
 * @property {string} [campaign_id]
 * @property {string} [theme_id]
 * @property {Object.<string, any>} target_audience
 * @property {string} [therapeutic_area]
 * @property {string} [indication]
 * @property {string[]} market
 * @property {string[]} channels
 * @property {'standard'|'high'|'regulatory'} compliance_level
 * @property {Object.<string, any>} project_metadata
 * @property {string} [created_by]
 * @property {string} [updated_by]
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} ContentAsset
 * @property {string} id
 * @property {string} project_id
 * @property {string} brand_id
 * @property {string} asset_name
 * @property {'email'|'web'|'social'|'print'|'dsa'|'video'|'infographic'|'mass-email'|'rep-triggered-email'|'patient-email'|'caregiver-email'|'social-media-post'|'website-landing-page'|'digital-sales-aid'} asset_type
 * @property {'awareness'|'education'|'promotional'|'support'} [content_category]
 * @property {'draft'|'in_review'|'approved'|'design_ready'|'completed'} status
 * @property {Object.<string, any>} primary_content
 * @property {Object.<string, any>} metadata
 * @property {string} [target_audience]
 * @property {Object.<string, any>} channel_specifications
 * @property {string} [compliance_notes]
 * @property {Object.<string, any>} performance_prediction
 * @property {Object.<string, any>} ai_analysis
 * @property {string} [theme_id]
 * @property {Object.<string, any>} [intake_context]
 * @property {string} [created_by]
 * @property {string} [updated_by]
 * @property {string} created_at
 * @property {string} updated_at
 * @property {string} [completed_at]
 */

/**
 * @typedef {Object} ContentVariation
 * @property {string} id
 * @property {string} asset_id
 * @property {string} variation_name
 * @property {'channel'|'audience'|'regional'|'ab_test'} variation_type
 * @property {Object.<string, any>} target_context
 * @property {Object.<string, any>} content_data
 * @property {Object.<string, any>} personalization_factors
 * @property {Object.<string, any>} performance_metrics
 * @property {boolean} is_primary
 * @property {boolean} is_active
 * @property {string} [created_by]
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} ContentVersion
 * @property {string} id
 * @property {string} asset_id
 * @property {number} version_number
 * @property {string} [version_name]
 * @property {Object.<string, any>} content_snapshot
 * @property {string} [change_description]
 * @property {'content'|'metadata'|'compliance'|'ai_improvement'} [change_type]
 * @property {Object.<string, any>} [diff_data]
 * @property {boolean} is_current
 * @property {string} [created_by]
 * @property {string} created_at
 */

/**
 * @typedef {Object} DesignHandoff
 * @property {string} id
 * @property {string} asset_id
 * @property {string} project_id
 * @property {string} brand_id
 * @property {'pending'|'in_design'|'design_complete'|'approved'} handoff_status
 * @property {Object.<string, any>} content_context
 * @property {Object.<string, any>} design_requirements
 * @property {Object.<string, any>} brand_context
 * @property {Object.<string, any>} compliance_requirements
 * @property {Object.<string, any>} design_assets
 * @property {Object.<string, any>} feedback
 * @property {Object.<string, any>} timeline
 * @property {string} [handed_off_by]
 * @property {string} [assigned_to]
 * @property {string} created_at
 * @property {string} updated_at
 * @property {string} [completed_at]
 */

/**
 * @typedef {Object} ContentSession
 * @property {string} id
 * @property {string} user_id
 * @property {string} [project_id]
 * @property {string} [asset_id]
 * @property {'project'|'asset'|'variation'} session_type
 * @property {Object.<string, any>} session_state
 * @property {Object.<string, any>} auto_save_data
 * @property {string} last_activity
 * @property {boolean} is_active
 * @property {string} created_at
 */

/**
 * @typedef {Object} PersonalizationFactors
 * @property {'hcp'|'patient'|'caregiver'|'payer'} audience_type
 * @property {'entry'|'mid_career'|'expert'} [hcp_experience_level]
 * @property {'hospital'|'clinic'|'academic'|'community'} [hcp_practice_setting]
 * @property {'newly_diagnosed'|'active_management'|'long_term'} [patient_disease_stage]
 * @property {'18-35'|'36-55'|'56-75'|'75+'} [patient_age_group]
 * @property {'low'|'medium'|'high'} [patient_health_literacy]
 * @property {'subject_line'|'opening_hook'|'cta_wording'|'content_length'|'headline_style'|'layout_priority'|'cta_placement'|'fair_balance_placement'|'slide_flow'} [content_optimization_type]
 * @property {'clinical_evidence'|'emotional_tone'|'urgency'|'benefit_framing'} [messaging_emphasis]
 * @property {'fair_balance_presentation'|'isi_placement'|'claim_strength'} [regulatory_variant_type]
 * @property {'sub_segmentation'|'ab_test'|'optimization'} [variation_purpose]
 * @property {string} [test_hypothesis]
 */

/**
 * @typedef {Object} VariationSelectionState
 * @property {string[]} selectedVariationIds
 * @property {string|null} primaryVariationId
 * @property {'campaign_targeting'|'ab_test'|'multi_market'} selectionPurpose
 * @property {string} [selectionNotes]
 */

/**
 * @typedef {Object} ContentAnalysisResult
 * @property {number} sentiment_score
 * @property {Object} tone_analysis
 * @property {number} tone_analysis.professional
 * @property {number} tone_analysis.empathetic
 * @property {number} tone_analysis.authoritative
 * @property {number} tone_analysis.accessible
 * @property {number} compliance_score
 * @property {number} readability_score
 * @property {number} engagement_prediction
 * @property {string[]} key_issues
 * @property {string[]} improvement_suggestions
 * @property {Object} medical_terminology_check
 * @property {boolean} medical_terminology_check.appropriate_level
 * @property {string[]} medical_terminology_check.complex_terms
 * @property {string[]} medical_terminology_check.suggestions
 */

/**
 * @typedef {Object} ChannelSpecification
 * @property {string} channel
 * @property {Object.<string, any>} format_requirements
 * @property {Object.<string, number>} character_limits
 * @property {Object.<string, any>} tone_adjustments
 * @property {string[]} compliance_requirements
 * @property {Object.<string, number>} performance_benchmarks
 */

/**
 * @typedef {Object} ContentTemplate
 * @property {string} id
 * @property {string} name
 * @property {string} asset_type
 * @property {Object.<string, any>} template_structure
 * @property {PersonalizationFactors[]} personalization_options
 * @property {ChannelSpecification[]} channel_adaptations
 * @property {string[]} compliance_requirements
 */

/*
  JSDoc typedefs replace TypeScript interfaces so editors still get type hints in plain JS.
*/

export default {};