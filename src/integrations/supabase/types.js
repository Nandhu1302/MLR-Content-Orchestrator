/**
 * @typedef {string | number | boolean | null | { [key: string]: Json | undefined } | Json[]} Json
 */

/**
 * @typedef {Object} TablesAgencyCollaborationWorkflowsRow
 * @property {string | null} [agency_completion_date] - Time of completion by agency.
 * @property {string | null} [agency_name] - Name of the localization agency.
 * @property {Json | null} [agency_review_data] - Data from the agency review process.
 * @property {string | null} [ai_completion_date] - Time of completion by AI.
 * @property {Json} ai_pre_translation_data - Data generated during AI pre-translation.
 * @property {string | null} [ai_translation_batch_id] - Batch ID for AI translation.
 * @property {string | null} [assigned_reviewer] - User ID of the assigned reviewer.
 * @property {number | null} [cost_savings_percentage] - Percentage of cost saved by AI workflow.
 * @property {string} created_at - Timestamp of creation.
 * @property {string | null} [created_by] - User ID who created the workflow.
 * @property {string} handoff_format - Format used for content handoff.
 * @property {string} id - Unique workflow ID.
 * @property {string} localization_project_id - ID of the linked localization project.
 * @property {Json | null} [quality_metrics] - Quality metrics data.
 * @property {number | null} [time_savings_hours] - Estimated hours saved by AI workflow.
 * @property {string} updated_at - Timestamp of last update.
 * @property {string} workflow_status - Current status of the workflow.
 */

/**
 * @typedef {TablesAgencyCollaborationWorkflowsRow} TablesAgencyCollaborationWorkflowsInsert
 */

/**
 * @typedef {TablesAgencyCollaborationWorkflowsRow} TablesAgencyCollaborationWorkflowsUpdate
 */

/**
 * @typedef {Object} TablesAiTranslationResultsRow
 * @property {string} asset_id
 * @property {number} brand_consistency_score
 * @property {string} brand_id
 * @property {number} confidence_score
 * @property {string} created_at
 * @property {number} cultural_adaptation_score
 * @property {Json | null} human_corrections
 * @property {boolean} human_reviewed
 * @property {string} id
 * @property {number} medical_accuracy_score
 * @property {number} overall_quality_score
 * @property {number | null} processing_time_ms
 * @property {string} project_id
 * @property {number} regulatory_compliance_score
 * @property {string} segment_type
 * @property {string} source_language
 * @property {string} source_text
 * @property {string} target_language
 * @property {string} translated_text
 * @property {string} translation_engine
 * @property {string} updated_at
 */

/**
 * @typedef {TablesAiTranslationResultsRow} TablesAiTranslationResultsInsert
 */

/**
 * @typedef {TablesAiTranslationResultsRow} TablesAiTranslationResultsUpdate
 */

/**
 * @typedef {Object} TablesAssetGuardrailsRow
 * @property {Json | null} ab_testing_guidelines
 * @property {Json | null} approval_requirements
 * @property {string} asset_id
 * @property {string} asset_type
 * @property {string} brand_id
 * @property {string | null} campaign_id
 * @property {Json | null} channel_requirements
 * @property {Json | null} character_limits
 * @property {string} created_at
 * @property {string | null} created_by
 * @property {string | null} customization_rationale
 * @property {Json | null} disclaimer_requirements
 * @property {Json | null} engagement_targets
 * @property {Json | null} format_constraints
 * @property {string} id
 * @property {boolean | null} inherits_from_brand
 * @property {boolean | null} inherits_from_campaign
 * @property {string[] | null} message_customizations
 * @property {string | null} override_level
 * @property {Json | null} regulatory_placement_rules
 * @property {Json | null} review_workflow_overrides
 * @property {Json | null} tone_adjustments
 * @property {string} updated_at
 * @property {string | null} updated_by
 * @property {Json | null} visual_requirements
 */

/**
 * @typedef {TablesAssetGuardrailsRow} TablesAssetGuardrailsInsert
 */

/**
 * @typedef {TablesAssetGuardrailsRow} TablesAssetGuardrailsUpdate
 */

/**
 * @typedef {Object} TablesAssetThemesRow
 * @property {string} asset_id
 * @property {string} asset_type
 * @property {string} brand_id
 * @property {string | null} campaign_theme_id
 * @property {Json | null} content_variations
 * @property {Json | null} conversion_data
 * @property {string} created_at
 * @property {string | null} created_by
 * @property {Json | null} engagement_data
 * @property {string} id
 * @property {Json | null} performance_metrics
 * @property {string} status
 * @property {Json | null} theme_adaptations
 * @property {string} theme_id
 * @property {string} updated_at
 */

/**
 * @typedef {TablesAssetThemesRow} TablesAssetThemesInsert
 */

/**
 * @typedef {TablesAssetThemesRow} TablesAssetThemesUpdate
 */

/**
 * @typedef {Object} TablesAssetTypeConfigurationsRow
 * @property {string[] | null} allowed_claim_types
 * @property {string} asset_type
 * @property {Json | null} character_limits
 * @property {string | null} compliance_level
 * @property {string | null} created_at
 * @property {string} display_name
 * @property {string} id
 * @property {string | null} isi_placement
 * @property {number | null} max_claims_allowed
 * @property {string[] | null} required_disclaimers
 * @property {string[] | null} required_sections
 * @property {boolean | null} requires_fair_balance
 * @property {boolean | null} requires_references_inline
 * @property {string | null} typical_audience
 * @property {string | null} updated_at
 */

/**
 * @typedef {TablesAssetTypeConfigurationsRow} TablesAssetTypeConfigurationsInsert
 */

/**
 * @typedef {TablesAssetTypeConfigurationsRow} TablesAssetTypeConfigurationsUpdate
 */

/**
 * @typedef {Object} TablesAudienceSegmentsRow
 * @property {Json} barriers_to_engagement
 * @property {string} brand_id
 * @property {Json} channel_preferences
 * @property {Json} communication_preferences
 * @property {Json} content_preferences
 * @property {string} created_at
 * @property {Json} decision_factors
 * @property {Json} demographics
 * @property {Json | null} disease_characteristics
 * @property {Json} engagement_patterns
 * @property {string} id
 * @property {Json} information_sources
 * @property {Json} messaging_preferences
 * @property {Json} motivations
 * @property {Json | null} professional_characteristics
 * @property {Json} psychographics
 * @property {string} segment_name
 * @property {string | null} segment_type
 * @property {string} therapeutic_area
 * @property {Json} trust_factors
 * @property {string} updated_at
 * @property {string | null} updated_by
 */

/**
 * @typedef {TablesAudienceSegmentsRow} TablesAudienceSegmentsInsert
 */

/**
 * @typedef {TablesAudienceSegmentsRow} TablesAudienceSegmentsUpdate
 */

/**
 * @typedef {Object} TablesAuditLogsRow
 * @property {string} action_type
 * @property {string | null} brand_id
 * @property {string} created_at
 * @property {string} id
 * @property {any} ip_address - Note: The type is 'unknown' in TS, here represented as 'any'.
 * @property {Json | null} new_data
 * @property {Json | null} old_data
 * @property {string | null} record_id
 * @property {string | null} table_name
 * @property {string | null} user_agent
 * @property {string | null} user_id
 */

/**
 * @typedef {TablesAuditLogsRow} TablesAuditLogsInsert
 */

/**
 * @typedef {TablesAuditLogsRow} TablesAuditLogsUpdate
 */

/**
 * @typedef {Object} TablesBrandDocumentsRow
 * @property {string} brand_id
 * @property {string} created_at
 * @property {string | null} document_category
 * @property {string[] | null} document_tags
 * @property {string | null} document_title
 * @property {string | null} document_type
 * @property {string | null} document_url
 * @property {string | null} drug_name
 * @property {string | null} error_message
 * @property {Json | null} extraction_metadata
 * @property {string | null} file_path
 * @property {number | null} file_size_bytes
 * @property {string} id
 * @property {number | null} page_count
 * @property {Json | null} parsed_data
 * @property {number | null} parsing_progress
 * @property {string} parsing_status
 * @property {string} updated_at
 * @property {string | null} uploaded_by
 * @property {string | null} version
 */

/**
 * @typedef {TablesBrandDocumentsRow} TablesBrandDocumentsInsert
 */

/**
 * @typedef {TablesBrandDocumentsRow} TablesBrandDocumentsUpdate
 */

/**
 * @typedef {Object} TablesBrandGuidelinesRow
 * @property {string} brand_id
 * @property {string} created_at
 * @property {string} id
 * @property {string | null} imagery_style
 * @property {string | null} last_reviewed
 * @property {string} last_updated
 * @property {string | null} logo_usage_rules
 * @property {Json | null} messaging_framework
 * @property {Json | null} tone_of_voice
 * @property {Json | null} typography
 * @property {string | null} updated_by
 * @property {Json | null} visual_guidelines
 */

/**
 * @typedef {TablesBrandGuidelinesRow} TablesBrandGuidelinesInsert
 */

/**
 * @typedef {TablesBrandGuidelinesRow} TablesBrandGuidelinesUpdate
 */

/**
 * @typedef {Object} TablesBrandMarketConfigurationsRow
 * @property {string} brand_id
 * @property {Json | null} complexity_factors
 * @property {string | null} created_at
 * @property {string | null} estimated_timeline_weeks
 * @property {string} id
 * @property {boolean | null} is_active
 * @property {boolean | null} is_primary_market
 * @property {string} language_code
 * @property {string} language_name
 * @property {string} market_code
 * @property {string} market_name
 * @property {string | null} regulatory_complexity
 * @property {number | null} therapeutic_area_relevance
 * @property {string | null} updated_at
 */

/**
 * @typedef {TablesBrandMarketConfigurationsRow} TablesBrandMarketConfigurationsInsert
 */

/**
 * @typedef {TablesBrandMarketConfigurationsRow} TablesBrandMarketConfigurationsUpdate
 */

/**
 * @typedef {Object} TablesBrandProfilesRow
 * @property {string} accent_color
 * @property {string} brand_name
 * @property {string} company
 * @property {string} created_at
 * @property {string | null} font_family
 * @property {string} id
 * @property {string | null} logo_url
 * @property {string} primary_color
 * @property {string} secondary_color
 * @property {string} therapeutic_area
 * @property {string} updated_at
 */

/**
 * @typedef {TablesBrandProfilesRow} TablesBrandProfilesInsert
 */

/**
 * @typedef {TablesBrandProfilesRow} TablesBrandProfilesUpdate
 */

/**
 * @typedef {Object} TablesBrandVisionRow
 * @property {Json | null} brand_architecture
 * @property {string} brand_id
 * @property {Json | null} brand_personality
 * @property {string | null} brand_promise
 * @property {string | null} brand_purpose
 * @property {string | null} brand_story
 * @property {Json | null} core_values
 * @property {string} created_at
 * @property {Json | null} differentiation_matrix
 * @property {Json | null} emotional_connection
 * @property {string} id
 * @property {string | null} mission_statement
 * @property {string | null} positioning_statement
 * @property {string | null} target_perception
 * @property {string | null} unique_value_proposition
 * @property {string} updated_at
 * @property {string | null} updated_by
 */

/**
 * @typedef {TablesBrandVisionRow} TablesBrandVisionInsert
 */

/**
 * @typedef {TablesBrandVisionRow} TablesBrandVisionUpdate
 */

/**
 * @typedef {Object} TablesCampaignGuardrailsRow
 * @property {Json | null} approval_process_overrides
 * @property {Json | null} audience_specific_tone
 * @property {string} brand_id
 * @property {string} campaign_id
 * @property {string[] | null} competitive_focus
 * @property {string[] | null} competitive_messaging_emphasis
 * @property {string} created_at
 * @property {string | null} created_by
 * @property {string[] | null} custom_key_messages
 * @property {string | null} customization_rationale
 * @property {string} id
 * @property {boolean | null} inherits_from_brand
 * @property {Json | null} market_specific_rules
 * @property {Json | null} message_priority_overrides
 * @property {Json | null} mlr_deadline_requirements
 * @property {string | null} override_level
 * @property {Json | null} regulatory_additions
 * @property {Json | null} tone_overrides
 * @property {string} updated_at
 * @property {string | null} updated_by
 */

/**
 * @typedef {TablesCampaignGuardrailsRow} TablesCampaignGuardrailsInsert
 */

/**
 * @typedef {TablesCampaignGuardrailsRow} TablesCampaignGuardrailsUpdate
 */

/**
 * @typedef {Object} TablesCampaignPerformanceAnalyticsRow
 * @property {string | null} brand_id
 * @property {string | null} calculated_at
 * @property {string} campaign_id
 * @property {string} campaign_name
 * @property {string | null} campaign_type
 * @property {number | null} click_rate
 * @property {string | null} content_registry_id
 * @property {number | null} conversion_rate
 * @property {number | null} data_quality_score
 * @property {number | null} delivery_rate
 * @property {number | null} engagement_score
 * @property {string} id
 * @property {number | null} industry_benchmark_click_rate
 * @property {number | null} industry_benchmark_open_rate
 * @property {number | null} open_rate
 * @property {number | null} performance_vs_benchmark
 * @property {string | null} period_type
 * @property {string} reporting_period
 * @property {string | null} source_system
 * @property {string | null} top_performing_device
 * @property {string | null} top_performing_geography
 * @property {string | null} top_performing_segment
 * @property {number | null} total_audience_size
 * @property {number | null} total_converted
 * @property {number | null} total_delivered
 * @property {number | null} total_engaged
 */

/**
 * @typedef {TablesCampaignPerformanceAnalyticsRow} TablesCampaignPerformanceAnalyticsInsert
 */

/**
 * @typedef {TablesCampaignPerformanceAnalyticsRow} TablesCampaignPerformanceAnalyticsUpdate
 */

/**
 * @typedef {Object} TablesCampaignThemesRow
 * @property {string | null} activated_at
 * @property {Json | null} actual_performance
 * @property {string} brand_id
 * @property {string} campaign_id
 * @property {string | null} completed_at
 * @property {string} created_at
 * @property {string | null} created_by
 * @property {Json | null} customizations
 * @property {string} id
 * @property {Json | null} performance_target
 * @property {Json | null} roi_data
 * @property {string} selected_at
 * @property {string | null} selection_reason
 * @property {string} status
 * @property {string} theme_id
 * @property {string} updated_at
 */

/**
 * @typedef {TablesCampaignThemesRow} TablesCampaignThemesInsert
 */

/**
 * @typedef {TablesCampaignThemesRow} TablesCampaignThemesUpdate
 */

/**
 * @typedef {Object} TablesClaimVariantsRow
 * @property {string | null} brand_id
 * @property {number | null} conversion_rate
 * @property {string | null} created_at
 * @property {string | null} footnote_text
 * @property {string} id
 * @property {string | null} last_used_at
 * @property {number | null} max_character_length
 * @property {boolean | null} mlr_approved
 * @property {string | null} mlr_approved_at
 * @property {string | null} mlr_approved_by
 * @property {string} parent_claim_id
 * @property {boolean | null} requires_footnote
 * @property {string[] | null} suitable_for_channels
 * @property {string | null} updated_at
 * @property {number | null} usage_count
 * @property {string} variant_text
 * @property {string} variant_type
 */

/**
 * @typedef {TablesClaimVariantsRow} TablesClaimVariantsInsert
 */

/**
 * @typedef {TablesClaimVariantsRow} TablesClaimVariantsUpdate
 */

/**
 * @typedef {Object} TablesClinicalClaimsRow
 * @property {string[] | null} approval_scope
 * @property {string} brand_id
 * @property {string | null} claim_id_display
 * @property {string} claim_text
 * @property {string} claim_type
 * @property {string | null} complexity_level
 * @property {number | null} confidence_score
 * @property {string | null} created_at
 * @property {string | null} effective_date
 * @property {string | null} expiration_date
 * @property {string} id
 * @property {string | null} indication_product
 * @property {string | null} last_used_at
 * @property {string | null} regulatory_status
 * @property {boolean | null} requires_fair_balance
 * @property {boolean | null} requires_isi
 * @property {string | null} review_status
 * @property {string | null} reviewed_at
 * @property {string | null} reviewed_by
 * @property {string} source_document_id
 * @property {number | null} source_page
 * @property {string} source_section
 * @property {Json | null} statistical_data
 * @property {string[] | null} target_audience
 * @property {string[] | null} target_audiences
 * @property {string | null} therapeutic_context
 * @property {string | null} updated_at
 * @property {number | null} usage_count
 */

/**
 * @typedef {TablesClinicalClaimsRow} TablesClinicalClaimsInsert
 */

/**
 * @typedef {TablesClinicalClaimsRow} TablesClinicalClaimsUpdate
 */

/**
 * @typedef {Object} TablesClinicalReferencesRow
 * @property {string | null} authors
 * @property {string} brand_id
 * @property {string | null} citation_format
 * @property {string | null} claim_id
 * @property {string | null} created_at
 * @property {string | null} data_on_file_id
 * @property {string | null} doi
 * @property {string | null} formatted_citation
 * @property {string} id
 * @property {string | null} journal
 * @property {number | null} publication_year
 * @property {string | null} pubmed_id
 * @property {string | null} reference_id_display
 * @property {string} reference_text
 * @property {string | null} reference_type
 * @property {string | null} relevant_location
 * @property {string} source_document_id
 * @property {number | null} source_page
 * @property {string | null} source_section
 * @property {string | null} study_name
 * @property {string | null} updated_at
 */

/**
 * @typedef {TablesClinicalReferencesRow} TablesClinicalReferencesInsert
 */

/**
 * @typedef {TablesClinicalReferencesRow} TablesClinicalReferencesUpdate
 */

/**
 * @typedef {Object} TablesCompetitiveIntelligenceRow
 * @property {string} brand_id
 * @property {Json} competitive_advantages
 * @property {Json} competitive_weaknesses
 * @property {string | null} competitor_brand
 * @property {string} competitor_name
 * @property {string} created_at
 * @property {string} id
 * @property {Json | null} intelligence_sources
 * @property {Json} key_differentiators
 * @property {string} last_updated
 * @property {string | null} market_positioning
 * @property {number | null} market_share_percent
 * @property {Json | null} messaging_strategy
 * @property {Json | null} monitoring_alerts
 * @property {Json | null} pricing_strategy
 * @property {Json | null} recent_developments
 * @property {Json | null} response_strategy
 * @property {string} therapeutic_area
 * @property {Json | null} threat_assessment
 * @property {string | null} threat_level
 * @property {string | null} updated_by
 */

/**
 * @typedef {TablesCompetitiveIntelligenceRow} TablesCompetitiveIntelligenceInsert
 */

/**
 * @typedef {TablesCompetitiveIntelligenceRow} TablesCompetitiveIntelligenceUpdate
 */

/**
 * @typedef {Object} TablesCompetitiveIntelligenceDataRow
 * @property {string | null} brand_id
 * @property {string} competitor_brand
 * @property {number | null} confidence_score
 * @property {string | null} created_at
 * @property {string | null} data_source
 * @property {string | null} date_captured
 * @property {string} id
 * @property {string | null} indication
 * @property {string | null} insight_summary
 * @property {string} intelligence_type
 * @property {string | null} region
 * @property {string | null} threat_level
 * @property {string | null} updated_at
 */

/**
 * @typedef {TablesCompetitiveIntelligenceDataRow} TablesCompetitiveIntelligenceDataInsert
 */

/**
 * @typedef {TablesCompetitiveIntelligenceDataRow} TablesCompetitiveIntelligenceDataUpdate
 */

/**
 * @typedef {Object} TablesCompetitiveIntelligenceEnrichedRow
 * @property {string} brand_id
 * @property {string} competitor_name
 * @property {string} content
 * @property {string} created_at
 * @property {string} discovered_at
 * @property {string} id
 * @property {string | null} impact_assessment
 * @property {string} intelligence_type
 * @property {Json | null} recommended_actions
 * @property {string | null} source_date
 * @property {string | null} source_url
 * @property {string} status
 * @property {string | null} threat_level
 * @property {string} title
 * @property {string} updated_at
 */

/**
 * @typedef {TablesCompetitiveIntelligenceEnrichedRow} TablesCompetitiveIntelligenceEnrichedInsert
 */

/**
 * @typedef {TablesCompetitiveIntelligenceEnrichedRow} TablesCompetitiveIntelligenceEnrichedUpdate
 */

/**
 * @typedef {Object} TablesCompetitiveLandscapeRow
 * @property {string} brand_id
 * @property {Json | null} competitive_advantages
 * @property {string} competitor_name
 * @property {string} created_at
 * @property {string} id
 * @property {string[] | null} key_differentiators
 * @property {Json | null} market_share_data
 * @property {string[] | null} messaging_opportunities
 * @property {string | null} threat_level
 * @property {string} updated_at
 */

/**
 * @typedef {TablesCompetitiveLandscapeRow} TablesCompetitiveLandscapeInsert
 */

/**
 * @typedef {TablesCompetitiveLandscapeRow} TablesCompetitiveLandscapeUpdate
 */

/**
 * @typedef {Object} TablesComplianceHistoryRow
 * @property {string | null} approval_timestamp
 * @property {string | null} approved_by
 * @property {number | null} asset_compliance_score
 * @property {number | null} brand_compliance_score
 * @property {number | null} campaign_compliance_score
 * @property {string} checked_at
 * @property {string | null} checked_by
 * @property {Json | null} compliance_details
 * @property {string} content_id
 * @property {string} content_type
 * @property {Json | null} critical_issues
 * @property {string | null} guardrails_version
 * @property {boolean | null} has_overrides
 * @property {string} id
 * @property {number | null} overall_compliance_score
 * @property {Json | null} override_details
 * @property {Json | null} suggestions
 * @property {Json | null} warnings
 */

/**
 * @typedef {TablesComplianceHistoryRow} TablesComplianceHistoryInsert
 */

/**
 * @typedef {TablesComplianceHistoryRow} TablesComplianceHistoryUpdate
 */

/**
 * @typedef {Object} TablesComposedEmailsRow
 * @property {string | null} approval_status
 * @property {string | null} asset_id
 * @property {string | null} brand_id
 * @property {Json} components_used
 * @property {string | null} composed_at
 * @property {string | null} composed_by
 * @property {number | null} composition_version
 * @property {string | null} created_at
 * @property {string} email_html
 * @property {Json} email_structure
 * @property {string} id
 * @property {Json | null} intelligence_decisions
 * @property {Json | null} quality_scores
 * @property {string | null} review_notes
 * @property {string | null} updated_at
 */

/**
 * @typedef {TablesComposedEmailsRow} TablesComposedEmailsInsert
 */

/**
 * @typedef {TablesComposedEmailsRow} TablesComposedEmailsUpdate
 */

/**
 * @typedef {Object} TablesContentAnalyticsRow
 * @property {Json | null} benchmark_comparison
 * @property {string} brand_id
 * @property {string} content_id
 * @property {string} content_type
 * @property {string} created_at
 * @property {string} id
 * @property {Json} metrics
 * @property {number | null} performance_score
 * @property {string} updated_at
 */

/**
 * @typedef {TablesContentAnalyticsRow} TablesContentAnalyticsInsert
 */

/**
 * @typedef {TablesContentAnalyticsRow} TablesContentAnalyticsUpdate
 */

/**
 * @typedef {Object} TablesContentAssetsRow
 * @property {Json | null} ai_analysis
 * @property {string} asset_name
 * @property {string} asset_type
 * @property {string} brand_id
 * @property {Json | null} channel_specifications
 * @property {Json | null} citation_validation
 * @property {Json | null} claims_used
 * @property {string | null} completed_at
 * @property {string | null} compliance_notes
 * @property {string | null} content_category
 * @property {string} created_at
 * @property {string | null} created_by
 * @property {string} id
 * @property {Json | null} intake_context
 * @property {Json | null} linked_pi_ids
 * @property {Json | null} metadata
 * @property {Json | null} performance_prediction
 * @property {Json} primary_content
 * @property {string} project_id
 * @property {Json | null} references_used
 * @property {string} status
 * @property {string | null} target_audience
 * @property {string | null} theme_id
 * @property {string} updated_at
 * @property {string | null} updated_by
 */

/**
 * @typedef {TablesContentAssetsRow} TablesContentAssetsInsert
 */

/**
 * @typedef {TablesContentAssetsRow} TablesContentAssetsUpdate
 */

/**
 * @typedef {Object} TablesContentElementPerformanceRow
 * @property {number | null} avg_conversion_rate
 * @property {number | null} avg_engagement_rate
 * @property {number | null} avg_performance_score
 * @property {string | null} brand_id
 * @property {string | null} confidence_level
 * @property {Json | null} element_context
 * @property {string} element_type
 * @property {string} element_value
 * @property {string | null} first_seen
 * @property {string} id
 * @property {string | null} last_calculated
 * @property {string | null} last_seen
 * @property {number | null} sample_size
 * @property {string | null} top_performing_audience
 * @property {string | null} top_performing_channel
 * @property {number | null} total_conversions
 * @property {number | null} total_engagements
 * @property {number | null} total_impressions
 * @property {number | null} usage_count
 */

/**
 * @typedef {TablesContentElementPerformanceRow} TablesContentElementPerformanceInsert
 */

/**
 * @typedef {TablesContentElementPerformanceRow} TablesContentElementPerformanceUpdate
 */

/**
 * @typedef {Object} TablesContentModulesRow
 * @property {string[] | null} applicable_audiences
 * @property {string | null} approval_date
 * @property {string[] | null} approved_combinations
 * @property {string} brand_id
 * @property {Json | null} channel_adaptations
 * @property {number | null} character_limit_max
 * @property {string[] | null} contraindicated_modules
 * @property {string | null} created_at
 * @property {string | null} expiration_date
 * @property {string} id
 * @property {string | null} length_variant
 * @property {string[] | null} linked_claims
 * @property {string[] | null} linked_references
 * @property {boolean | null} mlr_approved
 * @property {string | null} mlr_approved_at
 * @property {string | null} mlr_approved_by
 * @property {string} module_text
 * @property {string} module_type
 * @property {string | null} parent_module_id
 * @property {string | null} pi_document_id
 * @property {string[] | null} required_safety_statements
 * @property {string | null} tone_variant
 * @property {string | null} updated_at
 * @property {number | null} usage_score
 */

/**
 * @typedef {TablesContentModulesRow} TablesContentModulesInsert
 */

/**
 * @typedef {TablesContentModulesRow} TablesContentModulesUpdate
 */

/**
 * @typedef {Object} TablesContentOpportunitiesRow
 * @property {string} brand_id
 * @property {string | null} cluster_id
 * @property {number} confidence_score
 * @property {string} created_at
 * @property {string} description
 * @property {string} detected_at
 * @property {number | null} estimated_reach
 * @property {string | null} expires_at
 * @property {string} id
 * @property {number} impact_score
 * @property {Json} intelligence_sources
 * @property {Json | null} matched_success_patterns
 * @property {string} opportunity_type
 * @property {string} priority
 * @property {Json} recommended_actions
 * @property {string} status
 * @property {string[] | null} suggested_channels
 * @property {string[] | null} target_audiences
 * @property {string} title
 * @property {Json} trend_data
 * @property {string} updated_at
 * @property {number} urgency_score
 */

/**
 * @typedef {TablesContentOpportunitiesRow} TablesContentOpportunitiesInsert
 */

/**
 * @typedef {TablesContentOpportunitiesRow} TablesContentOpportunitiesUpdate
 */

/**
 * @typedef {Object} TablesContentPerformanceAttributionRow
 * @property {string | null} audience_segment
 * @property {number | null} benchmark_engagement_rate
 * @property {string | null} brand_id
 * @property {string | null} channel
 * @property {string | null} content_registry_id
 * @property {number | null} conversion_rate
 * @property {number | null} conversions
 * @property {string | null} created_at
 * @property {string | null} device_type
 * @property {number | null} engagement_rate
 * @property {number | null} engagements
 * @property {string | null} geography
 * @property {string} id
 * @property {number | null} impressions
 * @property {string} measurement_date
 * @property {string | null} measurement_period
 * @property {number | null} performance_score
 * @property {number | null} performance_vs_benchmark
 * @property {string} source_system
 */

/**
 * @typedef {TablesContentPerformanceAttributionRow} TablesContentPerformanceAttributionInsert
 */

/**
 * @typedef {TablesContentPerformanceAttributionRow} TablesContentPerformanceAttributionUpdate
 */

/**
 * @typedef {Object} TablesContentPerformanceMetricsRow
 * @property {string | null} asset_id
 * @property {Json | null} audience_breakdown
 * @property {string | null} audience_segment
 * @property {number | null} avg_conversion_rate
 * @property {number | null} avg_engagement_rate
 * @property {string | null} brand_id
 * @property {string | null} calculated_at
 * @property {Json | null} campaign_metrics
 * @property {Json | null} channel_breakdown
 * @property {string | null} collected_at
 * @property {string | null} content_registry_id
 * @property {string | null} created_at
 * @property {string} id
 * @property {Json | null} intelligence_layers_used
 * @property {string | null} market
 * @property {string | null} measurement_period_end
 * @property {string | null} measurement_period_start
 * @property {number | null} performance_score
 * @property {string | null} theme_id
 * @property {number | null} total_conversions
 * @property {number | null} total_engagements
 * @property {number | null} total_impressions
 * @property {string | null} trend_direction
 */

/**
 * @typedef {TablesContentPerformanceMetricsRow} TablesContentPerformanceMetricsInsert
 */

/**
 * @typedef {TablesContentPerformanceMetricsRow} TablesContentPerformanceMetricsUpdate
 */

/**
 * @typedef {Object} TablesContentProjectsRow
 * @property {string} brand_id
 * @property {string | null} campaign_id
 * @property {Json | null} channels
 * @property {string | null} compliance_level
 * @property {string} created_at
 * @property {string | null} created_by
 * @property {string | null} description
 * @property {string} id
 * @property {string | null} indication
 * @property {Json | null} market
 * @property {Json | null} project_metadata
 * @property {string} project_name
 * @property {string} project_type
 * @property {string} status
 * @property {Json | null} target_audience
 * @property {string | null} theme_id
 * @property {string | null} therapeutic_area
 * @property {string} updated_at
 * @property {string | null} updated_by
 */

/**
 * @typedef {TablesContentProjectsRow} TablesContentProjectsInsert
 */

/**
 * @typedef {TablesContentProjectsRow} TablesContentProjectsUpdate
 */

/**
 * @typedef {Object} TablesContentRegistryRow
 * @property {string | null} archived_at
 * @property {string | null} asset_id
 * @property {string | null} brand_id
 * @property {Json} content_fingerprint
 * @property {string} content_name
 * @property {string} content_type
 * @property {string | null} content_version
 * @property {string | null} created_at
 * @property {string | null} external_content_id
 * @property {string} id
 * @property {string} source_system
 * @property {string | null} status
 * @property {string | null} theme_id
 * @property {string | null} updated_at
 */

/**
 * @typedef {TablesContentRegistryRow} TablesContentRegistryInsert
 */

/**
 * @typedef {TablesContentRegistryRow} TablesContentRegistryUpdate
 */

/**
 * @typedef {Object} TablesContentRelationshipsRow
 * @property {string | null} brand_id
 * @property {number | null} confidence_score
 * @property {string | null} content_id_1
 * @property {string | null} content_id_2
 * @property {string | null} created_at
 * @property {boolean | null} created_from_usage_pattern
 * @property {string | null} discovered_at
 * @property {string} id
 * @property {number | null} performance_correlation
 * @property {string} relationship_type
 * @property {string[] | null} shared_elements
 * @property {string} source_module_id
 * @property {string} target_module_id
 * @property {string | null} updated_at
 * @property {number | null} usage_frequency
 */

/**
 * @typedef {TablesContentRelationshipsRow} TablesContentRelationshipsInsert
 */

/**
 * @typedef {TablesContentRelationshipsRow} TablesContentRelationshipsUpdate
 */

/**
 * @typedef {Object} TablesContentSegmentsRow
 * @property {string[] | null} applicable_asset_types
 * @property {string[] | null} audience_appropriateness
 * @property {string} brand_id
 * @property {string | null} created_at
 * @property {string} id
 * @property {string | null} last_used_at
 * @property {string[] | null} linked_claims
 * @property {string[] | null} linked_references
 * @property {boolean | null} mlr_approved
 * @property {string | null} mlr_approved_at
 * @property {string | null} mlr_approved_by
 * @property {string | null} reading_level
 * @property {string} segment_text
 * @property {string} segment_type
 * @property {string} source_document_id
 * @property {string | null} tone
 * @property {string | null} updated_at
 * @property {number | null} usage_count
 * @property {number | null} word_count
 */

/**
 * @typedef {TablesContentSegmentsRow} TablesContentSegmentsInsert
 */

/**
 * @typedef {TablesContentSegmentsRow} TablesContentSegmentsUpdate
 */

/**
 * @typedef {Object} TablesContentSessionsRow
 * @property {string | null} asset_id
 * @property {Json | null} auto_save_data
 * @property {string} created_at
 * @property {string} id
 * @property {boolean | null} is_active
 * @property {string} last_activity
 * @property {string | null} project_id
 * @property {Json} session_state
 * @property {string} session_type
 * @property {string} user_id
 */

/**
 * @typedef {TablesContentSessionsRow} TablesContentSessionsInsert
 */

/**
 * @typedef {TablesContentSessionsRow} TablesContentSessionsUpdate
 */

/**
 * @typedef {Object} TablesContentSuccessPatternsRow
 * @property {Json | null} a_b_test_results
 * @property {string[] | null} applicable_audiences
 * @property {string[] | null} applicable_channels
 * @property {number | null} avg_performance_lift
 * @property {string | null} brand_id
 * @property {number | null} confidence_score
 * @property {string | null} created_at
 * @property {string | null} created_by
 * @property {string | null} discovered_at
 * @property {string} id
 * @property {string | null} last_validated
 * @property {string | null} pattern_description
 * @property {string} pattern_name
 * @property {Json} pattern_rules
 * @property {string} pattern_type
 * @property {string | null} retired_at
 * @property {string | null} retirement_reason
 * @property {number} sample_size
 * @property {string | null} therapeutic_context
 * @property {string | null} updated_at
 * @property {string | null} validation_date
 * @property {string | null} validation_status
 */

/**
 * @typedef {TablesContentSuccessPatternsRow} TablesContentSuccessPatternsInsert
 */

/**
 * @typedef {TablesContentSuccessPatternsRow} TablesContentSuccessPatternsUpdate
 */

/**
 * @typedef {Object} TablesContentValidationResultsRow
 * @property {string} asset_id
 * @property {number | null} compliance_score
 * @property {string} created_at
 * @property {string} id
 * @property {number | null} issues_count
 * @property {string | null} overall_status
 * @property {string | null} validated_at
 * @property {Json} validation_data
 * @property {string} validation_type
 */

/**
 * @typedef {TablesContentValidationResultsRow} TablesContentValidationResultsInsert
 */

/**
 * @typedef {TablesContentValidationResultsRow} TablesContentValidationResultsUpdate
 */

/**
 * @typedef {Object} TablesContentVariationsRow
 * @property {string} asset_id
 * @property {Json} content_data
 * @property {string} created_at
 * @property {string | null} created_by
 * @property {string} id
 * @property {boolean | null} is_active
 * @property {boolean | null} is_primary
 * @property {Json | null} performance_metrics
 * @property {Json | null} personalization_factors
 * @property {Json} target_context
 * @property {string} updated_at
 * @property {string} variation_name
 * @property {string} variation_type
 */

/**
 * @typedef {TablesContentVariationsRow} TablesContentVariationsInsert
 */

/**
 * @typedef {TablesContentVariationsRow} TablesContentVariationsUpdate
 */

/**
 * @typedef {Object} TablesContentVersionsRow
 * @property {string} asset_id
 * @property {string | null} change_description
 * @property {string | null} change_type
 * @property {Json} content_snapshot
 * @property {string} created_at
 * @property {string | null} created_by
 * @property {Json | null} diff_data
 * @property {string} id
 * @property {boolean | null} is_current
 * @property {string | null} version_name
 * @property {number} version_number
 */

/**
 * @typedef {TablesContentVersionsRow} TablesContentVersionsInsert
 */

/**
 * @typedef {TablesContentVersionsRow} TablesContentVersionsUpdate
 */

/**
 * @typedef {Object} TablesCrossModuleContextRow
 * @property {string} brand_id
 * @property {Json} context_data
 * @property {string} context_type
 * @property {string} created_at
 * @property {string} id
 * @property {boolean} is_active
 * @property {Json} metadata
 * @property {Json} selections
 * @property {string} session_id
 * @property {string | null} therapeutic_area
 * @property {string} updated_at
 * @property {string} user_id
 */

/**
 * @typedef {TablesCrossModuleContextRow} TablesCrossModuleContextInsert
 */

/**
 * @typedef {TablesCrossModuleContextRow} TablesCrossModuleContextUpdate
 */

/**
 * @typedef {Object} TablesDataIngestionLogRow
 * @property {string} batch_id
 * @property {string | null} brand_id
 * @property {string | null} created_at
 * @property {number | null} data_quality_score
 * @property {string | null} error_message
 * @property {number | null} file_size_bytes
 * @property {string} id
 * @property {string | null} ingestion_end
 * @property {string} ingestion_start
 * @property {number | null} processing_duration_seconds
 * @property {number | null} records_failed
 * @property {number | null} records_processed
 * @property {number | null} records_received
 * @property {string} source_system
 * @property {string} status
 * @property {Json | null} validation_errors
 */

/**
 * @typedef {TablesDataIngestionLogRow} TablesDataIngestionLogInsert
 */

/**
 * @typedef {TablesDataIngestionLogRow} TablesDataIngestionLogUpdate
 */

/**
 * @typedef {Object} TablesDataSourceRegistryRow
 * @property {string | null} api_endpoint
 * @property {string | null} authentication_type
 * @property {number | null} consecutive_failures
 * @property {string | null} created_at
 * @property {Json | null} expected_schema
 * @property {string} id
 * @property {boolean | null} is_active
 * @property {string | null} last_failed_sync
 * @property {string | null} last_successful_sync
 * @property {string} source_system
 * @property {string} source_type
 * @property {string | null} sync_frequency
 * @property {Json | null} sync_schedule
 * @property {string | null} updated_at
 * @property {Json | null} validation_rules
 */

/**
 * @typedef {TablesDataSourceRegistryRow} TablesDataSourceRegistryInsert
 */

/**
 * @typedef {TablesDataSourceRegistryRow} TablesDataSourceRegistryUpdate
 */

/**
 * @typedef {Object} TablesDesignHandoffsRow
 * @property {string} asset_id
 * @property {string | null} assigned_to
 * @property {Json | null} brand_context
 * @property {string} brand_id
 * @property {string | null} completed_at
 * @property {Json | null} compliance_requirements
 * @property {Json} content_context
 * @property {string} created_at
 * @property {Json | null} design_assets
 * @property {Json | null} design_requirements
 * @property {Json | null} feedback
 * @property {string | null} handed_off_by
 * @property {string} handoff_status
 * @property {string} id
 * @property {string} project_id
 * @property {Json | null} timeline
 * @property {string} updated_at
 */

/**
 * @typedef {TablesDesignHandoffsRow} TablesDesignHandoffsInsert
 */

/**
 * @typedef {TablesDesignHandoffsRow} TablesDesignHandoffsUpdate
 */

/**
 * @typedef {Object} TablesDocumentCategoriesRow
 * @property {string | null} color
 * @property {string | null} created_at
 * @property {string | null} description
 * @property {string | null} extraction_template
 * @property {string | null} icon
 * @property {string} id
 * @property {string} name
 */

/**
 * @typedef {TablesDocumentCategoriesRow} TablesDocumentCategoriesInsert
 */

/**
 * @typedef {TablesDocumentCategoriesRow} TablesDocumentCategoriesUpdate
 */

/**
 * @typedef {Object} TablesGlobalTaxonomyRow
 * @property {string} category
 * @property {string} created_at
 * @property {string | null} description
 * @property {string} id
 * @property {boolean} is_active
 * @property {Json | null} metadata
 * @property {string | null} parent_id
 * @property {number} taxonomy_level
 * @property {string} taxonomy_name
 * @property {string} taxonomy_path
 * @property {string} updated_at
 */

/**
 * @typedef {TablesGlobalTaxonomyRow} TablesGlobalTaxonomyInsert
 */

/**
 * @typedef {TablesGlobalTaxonomyRow} TablesGlobalTaxonomyUpdate
 */

/**
 * @typedef {Object} TablesGlocalAdaptationProjectsRow
 * @property {string} brand_id
 * @property {string | null} completed_at
 * @property {string} created_at
 * @property {string | null} created_by
 * @property {number | null} cultural_intelligence_score
 * @property {string} id
 * @property {string | null} indication
 * @property {number | null} market_readiness_score
 * @property {number | null} overall_quality_score
 * @property {string | null} project_description
 * @property {Json | null} project_metadata
 * @property {string} project_name
 * @property {string} project_status
 * @property {number | null} regulatory_compliance_score
 * @property {Json} source_content
 * @property {string} source_content_type
 * @property {Json} target_languages
 * @property {Json} target_markets
 * @property {string | null} therapeutic_area
 * @property {number | null} tm_leverage_score
 * @property {string} updated_at
 * @property {Json | null} workflow_state
 */

/**
 * @typedef {TablesGlocalAdaptationProjectsRow} TablesGlocalAdaptationProjectsInsert
 */

/**
 * @typedef {TablesGlocalAdaptationProjectsRow} TablesGlocalAdaptationProjectsUpdate
 */

/**
 * @typedef {Object} TablesGlocalAnalyticsRow
 * @property {string} created_at
 * @property {string} id
 * @property {string} measurement_date
 * @property {Json | null} metric_context
 * @property {string} metric_type
 * @property {number} metric_value
 * @property {string} project_id
 */

/**
 * @typedef {TablesGlocalAnalyticsRow} TablesGlocalAnalyticsInsert
 */

/**
 * @typedef {TablesGlocalAnalyticsRow} TablesGlocalAnalyticsUpdate
 */

/**
 * @typedef {Object} TablesGlocalContentSegmentsRow
 * @property {string | null} adapted_text
 * @property {string | null} complexity_level
 * @property {string} created_at
 * @property {number | null} cultural_appropriateness_score
 * @property {string | null} cultural_review_status
 * @property {string | null} cultural_sensitivity_level
 * @property {string} id
 * @property {string} project_id
 * @property {number | null} regulatory_compliance_score
 * @property {string | null} regulatory_review_status
 * @property {string | null} regulatory_risk_level
 * @property {number} segment_index
 * @property {Json | null} segment_metadata
 * @property {string} segment_name
 * @property {string} segment_type
 * @property {string} source_text
 * @property {number | null} tm_confidence_score
 * @property {string | null} tm_match_status
 * @property {string} updated_at
 */

/**
 * @typedef {TablesGlocalContentSegmentsRow} TablesGlocalContentSegmentsInsert
 */

/**
 * @typedef {TablesGlocalContentSegmentsRow} TablesGlocalContentSegmentsUpdate
 */

/**
 * @typedef {Object} TablesGlocalCulturalIntelligenceRow
 * @property {number | null} adaptation_quality_score
 * @property {Json | null} adaptation_suggestions
 * @property {Json | null} analysis_metadata
 * @property {Json | null} communication_style_insights
 * @property {string} created_at
 * @property {number | null} cultural_appropriateness_score
 * @property {Json | null} cultural_tone_analysis
 * @property {Json | null} formality_recommendations
 * @property {string} id
 * @property {number | null} market_relevance_score
 * @property {string} project_id
 * @property {Json | null} risk_factors
 * @property {string} segment_id
 * @property {string} target_language
 * @property {string} target_market
 * @property {string} updated_at
 * @property {Json | null} visual_cultural_guidance
 */

/**
 * @typedef {TablesGlocalCulturalIntelligenceRow} TablesGlocalCulturalIntelligenceInsert
 */

/**
 * @typedef {TablesGlocalCulturalIntelligenceRow} TablesGlocalCulturalIntelligenceUpdate
 */

/**
 * @typedef {Object} TablesGlocalRegulatoryComplianceRow
 * @property {Json | null} claims_validation
 * @property {Json | null} compliance_issues
 * @property {Json | null} compliance_metadata
 * @property {Json | null} compliance_requirements
 * @property {number | null} compliance_score
 * @property {string} created_at
 * @property {Json | null} fair_balance_assessment
 * @property {string} id
 * @property {string} project_id
 * @property {Json | null} recommendations
 * @property {string} regulatory_body
 * @property {Json | null} required_disclaimers
 * @property {string | null} risk_level
 * @property {string} segment_id
 * @property {string} target_market
 * @property {string} updated_at
 */

/**
 * @typedef {TablesGlocalRegulatoryComplianceRow} TablesGlocalRegulatoryComplianceInsert
 */

/**
 * @typedef {TablesGlocalRegulatoryComplianceRow} TablesGlocalRegulatoryComplianceUpdate
 */

/**
 * @typedef {Object} TablesGlocalTmIntelligenceRow
 * @property {number | null} ai_brand_consistency_score
 * @property {number | null} ai_cultural_fit_score
 * @property {number | null} ai_medical_accuracy_score
 * @property {Json | null} ai_reasoning
 * @property {string | null} ai_regulatory_risk
 * @property {number | null} confidence_level
 * @property {string} created_at
 * @property {string | null} domain_context
 * @property {number | null} exact_match_words
 * @property {number | null} fuzzy_match_words
 * @property {number | null} human_approval_rating
 * @property {string | null} human_approval_status
 * @property {string | null} human_feedback
 * @property {string} id
 * @property {string | null} last_used_at
 * @property {number | null} leverage_percentage
 * @property {number} match_score
 * @property {string} match_type
 * @property {number | null} new_words
 * @property {string} project_id
 * @property {number | null} quality_score
 * @property {string | null} reviewed_at
 * @property {string | null} reviewed_by
 * @property {string} segment_id
 * @property {string} source_language
 * @property {string} target_language
 * @property {string | null} therapeutic_area
 * @property {Json | null} tm_metadata
 * @property {string} tm_source_text
 * @property {string} tm_target_text
 * @property {number | null} usage_count
 */

/**
 * @typedef {TablesGlocalTmIntelligenceRow} TablesGlocalTmIntelligenceInsert
 */

/**
 * @typedef {TablesGlocalTmIntelligenceRow} TablesGlocalTmIntelligenceUpdate
 */

/**
 * @typedef {Object} TablesGlocalWorkflowsRow
 * @property {string | null} completed_at
 * @property {string} created_at
 * @property {string | null} current_phase
 * @property {string} id
 * @property {string | null} last_auto_save
 * @property {Json | null} phase_1_global_context
 * @property {Json | null} phase_2_tm_intelligence
 * @property {Json | null} phase_3_cultural_intelligence
 * @property {Json | null} phase_4_regulatory_compliance
 * @property {Json | null} phase_5_quality_assurance
 * @property {Json | null} phase_6_dam_handoff
 * @property {Json | null} phase_7_integration
 * @property {string} project_id
 * @property {string} updated_at
 * @property {Json | null} workflow_metadata
 * @property {string} workflow_name
 * @property {string} workflow_status
 * @property {string} workflow_type
 */

/**
 * @typedef {TablesGlocalWorkflowsRow} TablesGlocalWorkflowsInsert
 */

/**
 * @typedef {TablesGlocalWorkflowsRow} TablesGlocalWorkflowsUpdate
 */

/**
 * @typedef {Object} TablesGuardrailInheritanceRow
 * @property {string} context_id
 * @property {string} context_type
 * @property {string} created_at
 * @property {string} id
 * @property {boolean | null} is_inherited
 * @property {boolean | null} is_overridden
 * @property {string | null} override_reason
 * @property {string} rule_category
 * @property {string} rule_key
 * @property {string} source_id
 * @property {string} source_type
 * @property {string} updated_at
 */

/**
 * @typedef {TablesGuardrailInheritanceRow} TablesGuardrailInheritanceInsert
 */

/**
 * @typedef {TablesGuardrailInheritanceRow} TablesGuardrailInheritanceUpdate
 */

/**
 * @typedef {Object} TablesHcpEngagementAnalyticsRow
 * @property {number | null} avg_session_duration_minutes
 * @property {string | null} brand_id
 * @property {string | null} calculated_at
 * @property {number | null} churn_risk_score
 * @property {number | null} content_depth_score
 * @property {number | null} content_views
 * @property {number | null} email_opens
 * @property {number | null} growth_opportunity_score
 * @property {number | null} hcp_decile
 * @property {string} hcp_id
 * @property {string | null} hcp_specialty
 * @property {string | null} hcp_tier
 * @property {string} id
 * @property {string | null} optimal_engagement_time
 * @property {string | null} preferred_channel
 * @property {string | null} preferred_content_type
 * @property {string | null} prescription_trend
 * @property {number | null} prescriptions_written
 * @property {number | null} rep_calls
 * @property {string} reporting_week
 * @property {number | null} response_rate
 * @property {number | null} total_touchpoints
 * @property {number | null} website_visits
 */

/**
 * @typedef {TablesHcpEngagementAnalyticsRow} TablesHcpEngagementAnalyticsInsert
 */

/**
 * @typedef {TablesHcpEngagementAnalyticsRow} TablesHcpEngagementAnalyticsUpdate
 */

/**
 * @typedef {Object} TablesIntelligenceRefreshLogRow
 * @property {string | null} brand_id
 * @property {string | null} completed_at
 * @property {string} created_at
 * @property {number | null} duration_seconds
 * @property {string | null} error_message
 * @property {number} guardrails_updated
 * @property {string} id
 * @property {number} insights_found
 * @property {string} refresh_scope
 * @property {string} refresh_type
 * @property {number} sources_checked
 * @property {string} started_at
 * @property {string} status
 */

/**
 * @typedef {TablesIntelligenceRefreshLogRow} TablesIntelligenceRefreshLogInsert
 */

/**
 * @typedef {TablesIntelligenceRefreshLogRow} TablesIntelligenceRefreshLogUpdate
 */

/**
 * @typedef {Object} TablesIntelligenceUsageLogsRow
 * @property {string | null} ai_model
 * @property {string | null} asset_id
 * @property {string} brand_id
 * @property {number | null} confidence_score
 * @property {string} created_at
 * @property {string} id
 * @property {string | null} intelligence_id
 * @property {string} intelligence_source
 * @property {string} intelligence_type
 * @property {string | null} project_id
 * @property {string} usage_context
 */

/**
 * @typedef {TablesIntelligenceUsageLogsRow} TablesIntelligenceUsageLogsInsert
 */

/**
 * @typedef {TablesIntelligenceUsageLogsRow} TablesIntelligenceUsageLogsUpdate
 */

/**
 * @typedef {Object} TablesIqviaHcpDecileRawRow
 * @property {string | null} brand_id
 * @property {number | null} brand_rx_count
 * @property {number | null} competitor_rx_count
 * @property {string} data_month
 * @property {number} decile
 * @property {string} file_batch_id
 * @property {string} hcp_id
 * @property {string} id
 * @property {string | null} ingestion_timestamp
 * @property {boolean | null} new_to_brand
 * @property {string | null} practice_setting
 * @property {Json | null} raw_payload
 * @property {string | null} region
 * @property {string | null} rx_trend
 * @property {string} specialty
 * @property {number | null} total_rx_count
 */

/**
 * @typedef {TablesIqviaHcpDecileRawRow} TablesIqviaHcpDecileRawInsert
 */

/**
 * @typedef {TablesIqviaHcpDecileRawRow} TablesIqviaHcpDecileRawUpdate
 */

/**
 * @typedef {Object} TablesIqviaMarketDataRow
 * @property {string | null} brand_id
 * @property {string | null} comparison_period
 * @property {string | null} created_at
 * @property {string | null} data_date
 * @property {string | null} geographic_region
 * @property {string} id
 * @property {string | null} indication
 * @property {string | null} market_segment
 * @property {string} metric_type
 * @property {string | null} region
 * @property {string | null} therapeutic_area
 * @property {string | null} updated_at
 * @property {number | null} value
 */

/**
 * @typedef {TablesIqviaMarketDataRow} TablesIqviaMarketDataInsert
 */

/**
 * @typedef {TablesIqviaMarketDataRow} TablesIqviaMarketDataUpdate
 */

/**
 * @typedef {Object} TablesIqviaRxRawRow
 * @property {string | null} brand_id
 * @property {Json | null} competitor_data
 * @property {string} data_month
 * @property {string} file_batch_id
 * @property {string | null} file_source
 * @property {string} id
 * @property {string | null} ingestion_timestamp
 * @property {number | null} market_share_percent
 * @property {number | null} new_rx
 * @property {number | null} nrx_trend
 * @property {number | null} rank_in_category
 * @property {Json | null} raw_payload
 * @property {number | null} refill_rx
 * @property {string | null} region
 * @property {string | null} reporting_period
 * @property {Json | null} state_breakdown
 * @property {string | null} state_code
 * @property {number | null} total_rx
 * @property {number | null} trx_trend
 */

/**
 * @typedef {TablesIqviaRxRawRow} TablesIqviaRxRawInsert
 */

/**
 * @typedef {TablesIqviaRxRawRow} TablesIqviaRxRawUpdate
 */

/**
 * @typedef {Object} TablesLearningInsightsRow
 * @property {boolean | null} applied_to_model
 * @property {string} brand_id
 * @property {number | null} confidence_score
 * @property {string | null} created_at
 * @property {string | null} discovered_at
 * @property {string} id
 * @property {string | null} insight_description
 * @property {string} insight_title
 * @property {string} insight_type
 * @property {Json | null} recommended_actions
 * @property {number | null} sample_size
 * @property {number | null} statistical_significance
 * @property {string | null} status
 * @property {Json | null} supporting_data
 * @property {string | null} updated_at
 */

/**
 * @typedef {TablesLearningInsightsRow} TablesLearningInsightsInsert
 */

/**
 * @typedef {TablesLearningInsightsRow} TablesLearningInsightsUpdate
 */

/**
 * @typedef {Object} TablesLearningSignalsRow
 * @property {string} action_taken
 * @property {Json | null} content_performance
 * @property {string} created_at
 * @property {string} id
 * @property {string} opportunity_id
 * @property {string | null} user_feedback
 * @property {string} user_id
 */

/**
 * @typedef {TablesLearningSignalsRow} TablesLearningSignalsInsert
 */

/**
 * @typedef {TablesLearningSignalsRow} TablesLearningSignalsUpdate
 */

/**
 * @typedef {Object} TablesLocalizationAgenciesRow
 * @property {string} agency_name
 * @property {string} agency_type
 * @property {string} brand_id
 * @property {number | null} capacity_rating
 * @property {Json | null} contact_information
 * @property {Json | null} contract_terms
 * @property {number | null} cost_efficiency_rating
 * @property {string} created_at
 * @property {string | null} created_by
 * @property {Json | null} cultural_expertise
 * @property {string} id
 * @property {boolean | null} is_active
 * @property {Json} language_pairs
 * @property {number | null} on_time_delivery_rate
 * @property {number | null} performance_score
 * @property {number | null} quality_rating
 * @property {Json | null} regulatory_expertise
 * @property {Json} specializations
 * @property {string | null} tier_level
 * @property {string} updated_at
 * @property {string | null} updated_by
 */

/**
 * @typedef {TablesLocalizationAgenciesRow} TablesLocalizationAgenciesInsert
 */

/**
 * @typedef {TablesLocalizationAgenciesRow} TablesLocalizationAgenciesUpdate
 */

/**
 * @typedef {Object} TablesLocalizationAnalyticsRow
 * @property {number | null} baseline_value
 * @property {Json | null} context_data
 * @property {string} created_at
 * @property {string} id
 * @property {string | null} language
 * @property {string} localization_project_id
 * @property {string} market
 * @property {string} measurement_date
 * @property {string} metric_type
 * @property {number} metric_value
 * @property {number | null} prediction_accuracy
 */

/**
 * @typedef {TablesLocalizationAnalyticsRow} TablesLocalizationAnalyticsInsert
 */

/**
 * @typedef {TablesLocalizationAnalyticsRow} TablesLocalizationAnalyticsUpdate
 */

/**
 * @typedef {Object} TablesLocalizationProjectsRow
 * @property {number | null} actual_timeline
 * @property {string} brand_id
 * @property {number | null} business_impact_score
 * @property {string | null} completed_at
 * @property {number | null} content_readiness_score
 * @property {number | null} copy_number
 * @property {string} created_at
 * @property {string | null} created_by
 * @property {string | null} cultural_sensitivity_level
 * @property {string | null} description
 * @property {number | null} estimated_timeline
 * @property {string} id
 * @property {boolean | null} is_template
 * @property {string | null} last_auto_save
 * @property {Json | null} metadata
 * @property {Json | null} mlr_inheritance
 * @property {string | null} original_project_id
 * @property {string | null} priority_level
 * @property {string} project_name
 * @property {string} project_type
 * @property {string | null} regulatory_complexity
 * @property {string | null} source_content_id
 * @property {string} source_content_type
 * @property {string} status
 * @property {Json} target_languages
 * @property {Json} target_markets
 * @property {number | null} total_budget
 * @property {string} updated_at
 * @property {string | null} updated_by
 * @property {number | null} usage_count
 * @property {Json | null} workflow_state
 */

/**
 * @typedef {TablesLocalizationProjectsRow} TablesLocalizationProjectsInsert
 */

/**
 * @typedef {TablesLocalizationProjectsRow} TablesLocalizationProjectsUpdate
 */

/**
 * @typedef {Object} TablesLocalizationWorkflowsRow
 * @property {number | null} actual_cost
 * @property {number | null} actual_hours
 * @property {string | null} assigned_agency_id
 * @property {string | null} assigned_to
 * @property {string | null} completed_at
 * @property {Json | null} compliance_checkpoints
 * @property {string} created_at
 * @property {string | null} created_by
 * @property {Json | null} cultural_adaptations
 * @property {Json | null} deliverables
 * @property {Json | null} dependencies
 * @property {number | null} estimated_cost
 * @property {number | null} estimated_hours
 * @property {Json | null} feedback
 * @property {string} id
 * @property {Json | null} intelligence_data
 * @property {string} language
 * @property {string | null} last_auto_save
 * @property {string} localization_project_id
 * @property {string} market
 * @property {number | null} priority
 * @property {Json | null} quality_gates
 * @property {Json | null} risk_assessment
 * @property {Json | null} segment_translations
 * @property {string | null} started_at
 * @property {number | null} translation_memory_leverage
 * @property {string} updated_at
 * @property {string | null} updated_by
 * @property {string} workflow_name
 * @property {Json | null} workflow_progress
 * @property {string} workflow_status
 * @property {string} workflow_type
 */

/**
 * @typedef {TablesLocalizationWorkflowsRow} TablesLocalizationWorkflowsInsert
 */

/**
 * @typedef {TablesLocalizationWorkflowsRow} TablesLocalizationWorkflowsUpdate
 */

/**
 * @typedef {Object} TablesMarketIntelligenceAnalyticsRow
 * @property {string | null} brand_id
 * @property {string | null} calculated_at
 * @property {number | null} competitor_share_percent
 * @property {string[] | null} data_sources
 * @property {number | null} hcp_retention_rate
 * @property {string} id
 * @property {number | null} market_rank
 * @property {number | null} market_share_percent
 * @property {number | null} new_hcp_prescribers
 * @property {number | null} new_rx
 * @property {string | null} primary_competitor
 * @property {number | null} refill_rx
 * @property {Json | null} region_growth_rate
 * @property {string} reporting_month
 * @property {number | null} rx_growth_rate
 * @property {number | null} seasonality_factor
 * @property {number | null} share_change
 * @property {number | null} share_gap
 * @property {number | null} top_decile_hcp_count
 * @property {string | null} top_performing_region
 * @property {number | null} total_hcp_prescribers
 * @property {number | null} total_rx
 * @property {string | null} trend_direction
 */

/**
 * @typedef {TablesMarketIntelligenceAnalyticsRow} TablesMarketIntelligenceAnalyticsInsert
 */

/**
 * @typedef {TablesMarketIntelligenceAnalyticsRow} TablesMarketIntelligenceAnalyticsUpdate
 */

/**
 * @typedef {Object} TablesMarketPositioningRow
 * @property {Json} access_strategy
 * @property {string} brand_id
 * @property {Json} clinical_evidence
 * @property {Json} competitive_advantages
 * @property {string} created_at
 * @property {Json} differentiation_points
 * @property {Json} economic_value
 * @property {Json} growth_trajectory
 * @property {string} id
 * @property {Json} leadership_claims
 * @property {string} market
 * @property {Json} market_dynamics
 * @property {Json} market_share_data
 * @property {Json} messaging_hierarchy
 * @property {Json} opportunity_areas
 * @property {Json} positioning_matrix
 * @property {string} positioning_statement
 * @property {Json} proof_points
 * @property {Json} real_world_evidence
 * @property {string} therapeutic_area
 * @property {Json} unmet_needs
 * @property {string} updated_at
 * @property {string | null} updated_by
 */

/**
 * @typedef {TablesMarketPositioningRow} TablesMarketPositioningInsert
 */

/**
 * @typedef {TablesMarketPositioningRow} TablesMarketPositioningUpdate
 */

/**
 * @typedef {Object} TablesMlrAnalysisResultsRow
 * @property {string} analysis_type
 * @property {string | null} content_asset_id
 * @property {string} content_hash
 * @property {string} created_at
 * @property {number | null} critical_issues_count
 * @property {string} id
 * @property {number | null} mlr_readiness_score
 * @property {Json} results
 * @property {string} updated_at
 * @property {number | null} warnings_count
 */

/**
 * @typedef {TablesMlrAnalysisResultsRow} TablesMlrAnalysisResultsInsert
 */

/**
 * @typedef {TablesMlrAnalysisResultsRow} TablesMlrAnalysisResultsUpdate
 */

/**
 * @typedef {Object} TablesMlrDecisionPatternsRow
 * @property {string[] | null} applicable_asset_types
 * @property {number | null} approval_count
 * @property {number | null} approval_rate
 * @property {string | null} brand_id
 * @property {string | null} common_feedback
 * @property {string} created_at
 * @property {string[] | null} detection_keywords
 * @property {string | null} detection_regex
 * @property {string[] | null} example_approvals
 * @property {string[] | null} example_violations
 * @property {string} id
 * @property {string | null} pattern_description
 * @property {string} pattern_name
 * @property {string} pattern_type
 * @property {number | null} rejection_count
 * @property {string | null} severity
 * @property {string | null} suggested_alternative
 * @property {string} typical_decision
 * @property {string} updated_at
 */

/**
 * @typedef {TablesMlrDecisionPatternsRow} TablesMlrDecisionPatternsInsert
 */

/**
 * @typedef {TablesMlrDecisionPatternsRow} TablesMlrDecisionPatternsUpdate
 */

/**
 * @typedef {Object} TablesMlrLearningFeedbackRow
 * @property {string | null} brand_id
 * @property {string} content_type
 * @property {string} created_at
 * @property {string | null} feedback_text
 * @property {string} id
 * @property {string} issue_category
 * @property {string} last_seen_at
 * @property {number | null} occurrence_count
 * @property {string} pattern_description
 * @property {string | null} reviewer_name
 * @property {string} updated_at
 */

/**
 * @typedef {TablesMlrLearningFeedbackRow} TablesMlrLearningFeedbackInsert
 */

/**
 * @typedef {TablesMlrLearningFeedbackRow} TablesMlrLearningFeedbackUpdate
 */

/**
 * @typedef {Object} TablesMlrReviewDecisionsRow
 * @property {string | null} asset_id
 * @property {string | null} asset_name
 * @property {string | null} asset_type
 * @property {string} brand_id
 * @property {string | null} claim_id
 * @property {string} created_at
 * @property {string} decision
 * @property {string | null} decision_category
 * @property {string} id
 * @property {string | null} original_text
 * @property {string[] | null} pattern_tags
 * @property {string | null} rationale
 * @property {string | null} reference_id
 * @property {string | null} resolution_action
 * @property {string | null} resolved_at
 * @property {string} review_date
 * @property {string | null} reviewer_name
 * @property {string} reviewer_type
 * @property {string | null} severity
 * @property {string | null} suggested_text
 */

/**
 * @typedef {TablesMlrReviewDecisionsRow} TablesMlrReviewDecisionsInsert
 */

/**
 * @typedef {TablesMlrReviewDecisionsRow} TablesMlrReviewDecisionsUpdate
 */

/**
 * @typedef {Object} TablesOpportunityClustersRow
 * @property {string} brand_id
 * @property {string} cluster_theme
 * @property {number} combined_impact_score
 * @property {string} combined_priority
 * @property {number} combined_urgency_score
 * @property {string} created_at
 * @property {string} id
 * @property {string[]} opportunity_ids
 * @property {string} updated_at
 */

/**
 * @typedef {TablesOpportunityClustersRow} TablesOpportunityClustersInsert
 */

/**
 * @typedef {TablesOpportunityClustersRow} TablesOpportunityClustersUpdate
 */

/**
 * @typedef {Object} TablesOpportunityTrackingRow
 * @property {Json | null} action_metadata
 * @property {string} action_type
 * @property {string | null} content_asset_id
 * @property {string} created_at
 * @property {string} id
 * @property {string} opportunity_id
 * @property {string | null} user_id
 */

/**
 * @typedef {TablesOpportunityTrackingRow} TablesOpportunityTrackingInsert
 */

/**
 * @typedef {TablesOpportunityTrackingRow} TablesOpportunityTrackingUpdate
 */

/**
 * @typedef {Object} TablesPerformancePredictionsRow
 * @property {number | null} actual_outcome
 * @property {string | null} brand_id
 * @property {number | null} confidence_level
 * @property {number | null} confidence_score
 * @property {string} content_id
 * @property {string} content_type
 * @property {Json | null} context
 * @property {string} created_at
 * @property {Json | null} factors_considered
 * @property {string} id
 * @property {string | null} model_version
 * @property {string | null} predicted_at
 * @property {string | null} predicted_metric
 * @property {number | null} predicted_score
 * @property {number | null} predicted_value
 * @property {Json | null} prediction_factors
 * @property {string} prediction_type
 * @property {string} updated_at
 * @property {string | null} valid_until
 */

/**
 * @typedef {TablesPerformancePredictionsRow} TablesPerformancePredictionsInsert
 */

/**
 * @typedef {TablesPerformancePredictionsRow} TablesPerformancePredictionsUpdate
 */

/**
 * @typedef {Object} TablesPharmaceuticalGlossaryRow
 * @property {string} brand_id
 * @property {number} confidence_score
 * @property {string} created_at
 * @property {string | null} created_by
 * @property {string} id
 * @property {string} medical_category
 * @property {string} regulatory_status
 * @property {string} source_language
 * @property {string} target_language
 * @property {string} term_source
 * @property {string} term_target
 * @property {string} therapeutic_area
 * @property {string} updated_at
 * @property {number} usage_frequency
 * @property {string} validation_status
 */

/**
 * @typedef {TablesPharmaceuticalGlossaryRow} TablesPharmaceuticalGlossaryInsert
 */

/**
 * @typedef {TablesPharmaceuticalGlossaryRow} TablesPharmaceuticalGlossaryUpdate
 */

/**
 * @typedef {Object} TablesPreApprovedContentLibraryRow
 * @property {string} approval_date
 * @property {string[] | null} approval_scope
 * @property {string | null} approved_by
 * @property {string} brand_id
 * @property {string} content_text
 * @property {string} content_type
 * @property {string} created_at
 * @property {string | null} expiration_date
 * @property {string} id
 * @property {string | null} last_used_at
 * @property {string[] | null} linked_claim_ids
 * @property {string[] | null} linked_reference_ids
 * @property {string[] | null} linked_safety_ids
 * @property {string} mlr_code
 * @property {string | null} module_type
 * @property {string | null} notes
 * @property {string[] | null} target_audiences
 * @property {string} updated_at
 * @property {number | null} usage_count
 */

/**
 * @typedef {TablesPreApprovedContentLibraryRow} TablesPreApprovedContentLibraryInsert
 */

/**
 * @typedef {TablesPreApprovedContentLibraryRow} TablesPreApprovedContentLibraryUpdate
 */

/**
 * @typedef {Object} TablesProfilesRow
 * @property {string} created_at
 * @property {string | null} display_name
 * @property {string | null} email
 * @property {string} id
 * @property {boolean} is_demo_user
 * @property {string} updated_at
 * @property {string} user_id
 */

/**
 * @typedef {TablesProfilesRow} TablesProfilesInsert
 */

/**
 * @typedef {TablesProfilesRow} TablesProfilesUpdate
 */

/**
 * @typedef {Object} TablesPublicDomainInsightsRow
 * @property {string} brand_id
 * @property {string} created_at
 * @property {string} discovered_at
 * @property {string | null} full_content
 * @property {string} id
 * @property {Json | null} key_findings
 * @property {string | null} market
 * @property {string | null} publish_date
 * @property {number | null} relevance_score
 * @property {string | null} reviewed_at
 * @property {string | null} reviewed_by
 * @property {string} source_name
 * @property {string} source_type
 * @property {string | null} source_url
 * @property {string} status
 * @property {string} summary
 * @property {Json | null} tags
 * @property {string | null} therapeutic_area
 * @property {string} title
 * @property {string} updated_at
 */

/**
 * @typedef {TablesPublicDomainInsightsRow} TablesPublicDomainInsightsInsert
 */

/**
 * @typedef {TablesPublicDomainInsightsRow} TablesPublicDomainInsightsUpdate
 */

/**
 * @typedef {Object} TablesRegionalSettingsRow
 * @property {string} brand_id
 * @property {Json | null} compliance_requirements
 * @property {string} created_at
 * @property {string} id
 * @property {string[] | null} language_preferences
 * @property {string | null} local_guidelines
 * @property {string} market
 * @property {string | null} regulatory_contact
 * @property {Json | null} review_processes
 * @property {string} updated_at
 */

/**
 * @typedef {TablesRegionalSettingsRow} TablesRegionalSettingsInsert
 */

/**
 * @typedef {TablesRegionalSettingsRow} TablesRegionalSettingsUpdate
 */

/**
 * @typedef {Object} TablesRegulatoryComplianceMatrixRow
 * @property {Json | null} audit_trail
 * @property {Json | null} automated_check_logic
 * @property {string} brand_id
 * @property {string | null} compliance_pattern
 * @property {string} created_at
 * @property {string | null} created_by
 * @property {string | null} enforcement_authority
 * @property {Json | null} exemption_criteria
 * @property {string} id
 * @property {string | null} implementation_notes
 * @property {boolean | null} is_active
 * @property {string | null} last_updated_regulation
 * @property {string} market
 * @property {string | null} penalty_severity
 * @property {string} regulation_category
 * @property {string} regulation_rule
 * @property {Json | null} related_regulations
 * @property {string} risk_level
 * @property {string | null} rule_description
 * @property {string} therapeutic_area
 * @property {string} updated_at
 * @property {string | null} updated_by
 * @property {string | null} validation_method
 */

/**
 * @typedef {TablesRegulatoryComplianceMatrixRow} TablesRegulatoryComplianceMatrixInsert
 */

/**
 * @typedef {TablesRegulatoryComplianceMatrixRow} TablesRegulatoryComplianceMatrixUpdate
 */

/**
 * @typedef {Object} TablesRegulatoryFrameworkRow
 * @property {string | null} approval_date
 * @property {string | null} approval_status
 * @property {Json} approval_workflows
 * @property {string} brand_id
 * @property {Json} claim_substantiation
 * @property {Json} compliance_templates
 * @property {string} created_at
 * @property {Json} fair_balance_requirements
 * @property {string} id
 * @property {string | null} indication
 * @property {Json} labeling_requirements
 * @property {string} market
 * @property {Json} mlr_requirements
 * @property {Json} promotional_restrictions
 * @property {string} regulatory_body
 * @property {Json} regulatory_contacts
 * @property {Json} regulatory_requirements
 * @property {Json | null} rems_requirements
 * @property {Json} required_disclaimers
 * @property {Json} submission_deadlines
 * @property {string} therapeutic_area
 * @property {string} updated_at
 * @property {string | null} updated_by
 */

/**
 * @typedef {TablesRegulatoryFrameworkRow} TablesRegulatoryFrameworkInsert
 */

/**
 * @typedef {TablesRegulatoryFrameworkRow} TablesRegulatoryFrameworkUpdate
 */

/**
 * @typedef {Object} TablesRegulatoryProfilesRow
 * @property {Json | null} approval_processes
 * @property {string | null} boxed_warnings
 * @property {string} brand_id
 * @property {string | null} contraindications
 * @property {string} created_at
 * @property {string | null} fair_balance_text
 * @property {string} id
 * @property {string} indication
 * @property {string} market
 * @property {Json | null} regulatory_flags
 * @property {string} updated_at
 */

/**
 * @typedef {TablesRegulatoryProfilesRow} TablesRegulatoryProfilesInsert
 */

/**
 * @typedef {TablesRegulatoryProfilesRow} TablesRegulatoryProfilesUpdate
 */

/**
 * @typedef {Object} TablesRuleConflictsRow
 * @property {string} conflict_type
 * @property {string[]} conflicting_rules
 * @property {string} content_id
 * @property {string} content_type
 * @property {string} created_at
 * @property {string} id
 * @property {Json | null} resolution_details
 * @property {string | null} resolution_strategy
 * @property {string | null} resolved_at
 * @property {string | null} resolved_by
 */

/**
 * @typedef {TablesRuleConflictsRow} TablesRuleConflictsInsert
 */

/**
 * @typedef {TablesRuleConflictsRow} TablesRuleConflictsUpdate
 */

/**
 * @typedef {Object} TablesRuleExecutionLogRow
 * @property {string} content_id
 * @property {string} content_type
 * @property {string} created_at
 * @property {Json | null} execution_details
 * @property {string} execution_result
 * @property {number | null} execution_time_ms
 * @property {string} id
 * @property {string} rule_id
 * @property {string} rule_name
 */

/**
 * @typedef {TablesRuleExecutionLogRow} TablesRuleExecutionLogInsert
 */

/**
 * @typedef {TablesRuleExecutionLogRow} TablesRuleExecutionLogUpdate
 */

/**
 * @typedef {Object} TablesSafetyStatementsRow
 * @property {string[] | null} applicable_channels
 * @property {string} brand_id
 * @property {string | null} created_at
 * @property {boolean | null} fda_required
 * @property {string} id
 * @property {string | null} last_used_at
 * @property {string[] | null} linked_claims
 * @property {string | null} placement_rule
 * @property {string | null} severity
 * @property {string} source_document_id
 * @property {string} statement_text
 * @property {string} statement_type
 * @property {string | null} updated_at
 * @property {number | null} usage_count
 */

/**
 * @typedef {TablesSafetyStatementsRow} TablesSafetyStatementsInsert
 */

/**
 * @typedef {TablesSafetyStatementsRow} TablesSafetyStatementsUpdate
 */

/**
 * @typedef {Object} TablesSfmcCampaignDataRow
 * @property {string | null} asset_type
 * @property {string | null} audience_segment
 * @property {string | null} audience_type
 * @property {string | null} brand_id
 * @property {string} campaign_id
 * @property {string} campaign_name
 * @property {number | null} click_rate
 * @property {number | null} conversion_rate
 * @property {string | null} created_at
 * @property {string} id
 * @property {string | null} indication
 * @property {Json | null} message_themes
 * @property {number | null} open_rate
 * @property {string | null} region
 * @property {string | null} send_date
 * @property {number | null} sent_count
 * @property {string | null} sophistication_level
 * @property {string | null} subject_line
 * @property {string | null} updated_at
 */

/**
 * @typedef {TablesSfmcCampaignDataRow} TablesSfmcCampaignDataInsert
 */

/**
 * @typedef {TablesSfmcCampaignDataRow} TablesSfmcCampaignDataUpdate
 */

/**
 * @typedef {Object} TablesSfmcCampaignRawRow
 * @property {string | null} audience_segment
 * @property {string | null} brand_id
 * @property {string} campaign_name
 * @property {string | null} content_registry_id
 * @property {string | null} data_source
 * @property {string | null} device_category
 * @property {string} external_campaign_id
 * @property {string | null} geography
 * @property {string} id
 * @property {string | null} ingestion_timestamp
 * @property {string | null} last_updated
 * @property {Json | null} raw_payload
 * @property {string} send_date
 * @property {number | null} total_bounced
 * @property {number | null} total_clicks
 * @property {number | null} total_delivered
 * @property {number | null} total_opens
 * @property {number | null} total_sent
 * @property {number | null} unique_clicks
 * @property {number | null} unique_opens
 * @property {number | null} unsubscribes
 */

/**
 * @typedef {TablesSfmcCampaignRawRow} TablesSfmcCampaignRawInsert
 */

/**
 * @typedef {TablesSfmcCampaignRawRow} TablesSfmcCampaignRawUpdate
 */

/**
 * @typedef {Object} TablesSfmcJourneyRawRow
 * @property {number | null} avg_completion_time_hours
 * @property {string | null} brand_id
 * @property {string | null} content_registry_id
 * @property {Json | null} conversion_funnel
 * @property {string} external_journey_id
 * @property {string} id
 * @property {string | null} ingestion_timestamp
 * @property {string} journey_name
 * @property {string} measurement_date
 * @property {Json | null} raw_payload
 * @property {Json | null} step_data
 * @property {number | null} total_completions
 * @property {number | null} total_entries
 * @property {number | null} total_exits
 */

/**
 * @typedef {TablesSfmcJourneyRawRow} TablesSfmcJourneyRawInsert
 */

/**
 * @typedef {TablesSfmcJourneyRawRow} TablesSfmcJourneyRawUpdate
 */

/**
 * @typedef {Object} TablesSmartRulesRow
 * @property {Json} actions
 * @property {string[] | null} applies_to
 * @property {string} brand_id
 * @property {Json} conditions
 * @property {Json | null} context_filters
 * @property {string} created_at
 * @property {string | null} created_by
 * @property {string} id
 * @property {boolean | null} is_active
 * @property {number | null} priority
 * @property {string} rule_category
 * @property {string} rule_name
 * @property {string} rule_type
 * @property {string} updated_at
 * @property {string | null} updated_by
 */

/**
 * @typedef {TablesSmartRulesRow} TablesSmartRulesInsert
 */

/**
 * @typedef {TablesSmartRulesRow} TablesSmartRulesUpdate
 */

/**
 * @typedef {Object} TablesSocialIntelligenceAnalyticsRow
 * @property {string | null} brand_id
 * @property {number | null} brand_mentions
 * @property {string | null} calculated_at
 * @property {number | null} category_mentions
 * @property {Json | null} competitive_sentiment
 * @property {Json | null} competitor_mentions
 * @property {number | null} crisis_alerts
 * @property {string[] | null} emerging_concerns
 * @property {string} id
 * @property {number | null} negative_mention_percent
 * @property {boolean | null} negative_spike_detected
 * @property {number | null} neutral_mention_percent
 * @property {number | null} overall_sentiment_score
 * @property {string[] | null} platforms_analyzed
 * @property {number | null} positive_mention_percent
 * @property {string[] | null} positive_themes
 * @property {number | null} reach_count
 * @property {string} reporting_date
 * @property {string | null} sentiment_trend
 * @property {number | null} share_of_voice_percent
 * @property {Json | null} top_influencers
 * @property {Json | null} top_topics
 * @property {number | null} total_mentions
 * @property {number | null} unique_authors
 */

/**
 * @typedef {TablesSocialIntelligenceAnalyticsRow} TablesSocialIntelligenceAnalyticsInsert
 */

/**
 * @typedef {TablesSocialIntelligenceAnalyticsRow} TablesSocialIntelligenceAnalyticsUpdate
 */

/**
 * @typedef {Object} TablesSocialListeningDataRow
 * @property {string | null} audience_type
 * @property {string | null} brand_id
 * @property {string | null} created_at
 * @property {string | null} date_captured
 * @property {number | null} engagement_score
 * @property {string} id
 * @property {string | null} indication
 * @property {Json | null} influencer_mentions
 * @property {Json | null} key_phrases
 * @property {number | null} mention_volume
 * @property {string} platform
 * @property {string | null} platform_type
 * @property {string | null} region
 * @property {string | null} sentiment
 * @property {string | null} topic
 * @property {string | null} updated_at
 */

/**
 * @typedef {TablesSocialListeningDataRow} TablesSocialListeningDataInsert
 */

/**
 * @typedef {TablesSocialListeningDataRow} TablesSocialListeningDataUpdate
 */

/**
 * @typedef {Object} TablesSocialListeningRawRow
 * @property {number | null} author_followers
 * @property {string | null} author_id
 * @property {string | null} author_specialty
 * @property {string | null} author_type
 * @property {string | null} brand_id
 * @property {number | null} comments
 * @property {string | null} content_registry_id
 * @property {string[] | null} emotion_tags
 * @property {number | null} engagement_rate
 * @property {string} external_post_id
 * @property {string} id
 * @property {string | null} ingestion_timestamp
 * @property {boolean | null} is_potential_crisis
 * @property {Json | null} key_themes
 * @property {number | null} likes
 * @property {string[] | null} mentioned_brands
 * @property {string} platform
 * @property {string} post_date
 * @property {string | null} post_text
 * @property {string | null} post_url
 * @property {Json | null} raw_payload
 * @property {string | null} sentiment_category
 * @property {number | null} sentiment_score
 * @property {number | null} shares
 * @property {string[] | null} topics
 * @property {string | null} urgency_level
 */

/**
 * @typedef {TablesSocialListeningRawRow} TablesSocialListeningRawInsert
 */

/**
 * @typedef {TablesSocialListeningRawRow} TablesSocialListeningRawUpdate
 */

/**
 * @typedef {Object} TablesThemeAnalyticsRow
 * @property {Json | null} actual_performance
 * @property {Json | null} ai_learning_points
 * @property {string | null} asset_type
 * @property {string | null} audience_segment
 * @property {Json | null} benchmark_performance
 * @property {string} brand_id
 * @property {Json | null} competitor_comparison
 * @property {Json | null} conversion_metrics
 * @property {string} created_at
 * @property {Json | null} engagement_metrics
 * @property {string} id
 * @property {string} implementation_id
 * @property {string} implementation_type
 * @property {Json | null} improvement_suggestions
 * @property {string | null} market
 * @property {string | null} measured_by
 * @property {string | null} measurement_period_end
 * @property {string | null} measurement_period_start
 * @property {Json | null} mlr_performance
 * @property {Json | null} performance_by_period
 * @property {Json} predicted_performance
 * @property {Json | null} seasonal_trends
 * @property {string} theme_id
 * @property {string} updated_at
 * @property {Json | null} user_feedback
 * @property {Json | null} variant_testing_results
 */

/**
 * @typedef {TablesThemeAnalyticsRow} TablesThemeAnalyticsInsert
 */

/**
 * @typedef {TablesThemeAnalyticsRow} TablesThemeAnalyticsUpdate
 */

/**
 * @typedef {Object} TablesThemeComparisonsRow
 * @property {string} brand_id
 * @property {Json | null} comparison_criteria
 * @property {string | null} comparison_name
 * @property {number | null} confidence_level
 * @property {string} created_at
 * @property {string | null} created_by
 * @property {string | null} decided_at
 * @property {Json | null} decision_factors
 * @property {string} id
 * @property {Json | null} lessons_learned
 * @property {Json | null} outcome_validation
 * @property {Json | null} performance_delta
 * @property {string | null} post_decision_notes
 * @property {string | null} project_context
 * @property {Json | null} pros_cons_analysis
 * @property {Json | null} risk_assessment
 * @property {string | null} selected_theme_id
 * @property {string | null} selection_rationale
 * @property {Json | null} side_by_side_analysis
 * @property {string} theme_a_id
 * @property {string} theme_b_id
 * @property {string} updated_at
 */

/**
 * @typedef {TablesThemeComparisonsRow} TablesThemeComparisonsInsert
 */

/**
 * @typedef {TablesThemeComparisonsRow} TablesThemeComparisonsUpdate
 */

/**
 * @typedef {Object} TablesThemeIntelligenceRow
 * @property {string} brand_id
 * @property {number | null} confidence_score
 * @property {string | null} created_at
 * @property {Json | null} data_sources
 * @property {string} id
 * @property {boolean | null} incorporated
 * @property {string | null} incorporated_at
 * @property {string | null} incorporated_by
 * @property {Json} intelligence_data
 * @property {string} intelligence_type
 * @property {string | null} last_data_refresh
 * @property {string | null} last_refreshed
 * @property {string} theme_id
 * @property {string | null} updated_at
 * @property {string | null} user_notes
 */

/**
 * @typedef {TablesThemeIntelligenceRow} TablesThemeIntelligenceInsert
 */

/**
 * @typedef {TablesThemeIntelligenceRow} TablesThemeIntelligenceUpdate
 */

/**
 * @typedef {Object} TablesThemeLibraryRow
 * @property {string | null} approved_at
 * @property {string | null} approved_by
 * @property {Json | null} audience_segments
 * @property {number | null} avg_engagement_rate
 * @property {string} brand_id
 * @property {string | null} call_to_action
 * @property {string} category
 * @property {number} confidence_score
 * @property {Json | null} content_suggestions
 * @property {string} created_at
 * @property {string | null} created_by
 * @property {Json} data_sources
 * @property {string} description
 * @property {string | null} enrichment_status
 * @property {string} id
 * @property {string | null} indication
 * @property {Json | null} intelligence_layers
 * @property {number | null} intelligence_progress
 * @property {string} key_message
 * @property {string | null} last_used_at
 * @property {Json | null} messaging_framework
 * @property {string} name
 * @property {string | null} original_project_name
 * @property {string | null} parent_theme_id
 * @property {Json} performance_prediction
 * @property {Json} rationale
 * @property {Json | null} regulatory_considerations
 * @property {string | null} source_campaign_id
 * @property {string | null} source_intake_id
 * @property {string} status
 * @property {number | null} success_rate
 * @property {string | null} target_audience
 * @property {Json | null} target_markets
 * @property {string} updated_at
 * @property {string | null} updated_by
 * @property {number} usage_count
 * @property {number} version
 * @property {Json | null} workshop_notes
 */

/**
 * @typedef {TablesThemeLibraryRow} TablesThemeLibraryInsert
 */

/**
 * @typedef {TablesThemeLibraryRow} TablesThemeLibraryUpdate
 */

/**
 * @typedef {Object} TablesThemeUsageHistoryRow
 * @property {string | null} adaptation_reason
 * @property {string} brand_id
 * @property {string | null} completed_at
 * @property {string | null} created_by
 * @property {Json | null} customizations_made
 * @property {Json | null} failure_points
 * @property {string} id
 * @property {Json | null} key_learnings
 * @property {boolean | null} overall_success
 * @property {string} project_id
 * @property {string} project_name
 * @property {string | null} project_type
 * @property {Json | null} success_metrics
 * @property {number | null} success_score
 * @property {string} theme_id
 * @property {string} usage_type
 * @property {string} used_at
 */

/**
 * @typedef {TablesThemeUsageHistoryRow} TablesThemeUsageHistoryInsert
 */

/**
 * @typedef {TablesThemeUsageHistoryRow} TablesThemeUsageHistoryUpdate
 */

/**
 * @typedef {Object} TablesTranslationEnginePerformanceRow
 * @property {number} average_accuracy
 * @property {number} average_confidence
 * @property {number | null} avg_processing_time_ms
 * @property {string} content_type
 * @property {number | null} cost_per_word
 * @property {string} created_at
 * @property {string} engine_name
 * @property {number} human_approval_rate
 * @property {string} id
 * @property {string} last_updated
 * @property {string} source_language
 * @property {number} successful_translations
 * @property {string} target_language
 * @property {string} therapeutic_area
 * @property {number} total_translations
 */

/**
 * @typedef {TablesTranslationEnginePerformanceRow} TablesTranslationEnginePerformanceInsert
 */

/**
 * @typedef {TablesTranslationEnginePerformanceRow} TablesTranslationEnginePerformanceUpdate
 */

/**
 * @typedef {Object} TablesTranslationMemoryRow
 * @property {string | null} asset_id
 * @property {string} brand_id
 * @property {number | null} confidence_level
 * @property {string} created_at
 * @property {string | null} created_by
 * @property {Json | null} cultural_adaptations
 * @property {string | null} domain_context
 * @property {string} id
 * @property {string | null} last_used
 * @property {string | null} market
 * @property {string} match_type
 * @property {string | null} project_id
 * @property {number} quality_score
 * @property {string | null} regulatory_notes
 * @property {string} source_language
 * @property {string} source_text
 * @property {string} target_language
 * @property {string} target_text
 * @property {string} updated_at
 * @property {number | null} usage_count
 */

/**
 * @typedef {TablesTranslationMemoryRow} TablesTranslationMemoryInsert
 */

/**
 * @typedef {TablesTranslationMemoryRow} TablesTranslationMemoryUpdate
 */

/**
 * @typedef {Object} TablesTrendForecastsRow
 * @property {string} brand_id
 * @property {number} confidence_level
 * @property {string} created_at
 * @property {number | null} current_velocity
 * @property {Json} forecast_data
 * @property {string} forecast_topic
 * @property {string} id
 * @property {string} predicted_peak_date
 * @property {Json} recommended_prep_actions
 * @property {string} status
 * @property {string} trend_type
 * @property {string} updated_at
 */

/**
 * @typedef {TablesTrendForecastsRow} TablesTrendForecastsInsert
 */

/**
 * @typedef {TablesTrendForecastsRow} TablesTrendForecastsUpdate
 */

/**
 * @typedef {Object} TablesUserBrandAccessRow
 * @property {string} brand_id
 * @property {string} granted_at
 * @property {string | null} granted_by
 * @property {string} id
 * @property {string} user_id
 */

/**
 * @typedef {TablesUserBrandAccessRow} TablesUserBrandAccessInsert
 */

/**
 * @typedef {TablesUserBrandAccessRow} TablesUserBrandAccessUpdate
 */

/**
 * @typedef {Object} TablesVeevaCrmActivityRawRow
 * @property {string} activity_date
 * @property {string} activity_type
 * @property {string | null} brand_id
 * @property {number | null} call_duration_minutes
 * @property {Json | null} content_presented
 * @property {string | null} content_registry_id
 * @property {number | null} engagement_score
 * @property {string} external_activity_id
 * @property {string} hcp_id
 * @property {string | null} hcp_specialty
 * @property {string | null} hcp_tier
 * @property {string} id
 * @property {string | null} ingestion_timestamp
 * @property {string | null} next_best_action
 * @property {Json | null} raw_payload
 * @property {string | null} rep_id
 * @property {string | null} rep_territory
 */

/**
 * @typedef {TablesVeevaCrmActivityRawRow} TablesVeevaCrmActivityRawInsert
 */

/**
 * @typedef {TablesVeevaCrmActivityRawRow} TablesVeevaCrmActivityRawUpdate
 */

/**
 * @typedef {Object} TablesVeevaFieldInsightsRow
 * @property {string | null} audience_type
 * @property {string | null} brand_id
 * @property {string | null} competitive_mention
 * @property {Json | null} competitive_mentions
 * @property {string | null} created_at
 * @property {number | null} frequency_score
 * @property {string} hcp_feedback_theme
 * @property {string | null} hcp_specialty
 * @property {string} id
 * @property {string | null} indication
 * @property {Json | null} objections
 * @property {string | null} recorded_date
 * @property {string | null} region
 * @property {Json | null} regional_data
 * @property {string | null} sentiment
 * @property {string | null} updated_at
 */

/**
 * @typedef {TablesVeevaFieldInsightsRow} TablesVeevaFieldInsightsInsert
 */

/**
 * @typedef {TablesVeevaFieldInsightsRow} TablesVeevaFieldInsightsUpdate
 */

/**
 * @typedef {Object} TablesVeevaVaultContentRawRow
 * @property {number | null} average_view_duration_seconds
 * @property {string | null} brand_id
 * @property {string | null} content_category
 * @property {string | null} content_registry_id
 * @property {string} document_name
 * @property {string} document_type
 * @property {string} external_document_id
 * @property {string} id
 * @property {string | null} ingestion_timestamp
 * @property {string} measurement_week
 * @property {Json | null} raw_payload
 * @property {Json | null} region_breakdown
 * @property {number | null} share_count
 * @property {Json | null} specialty_breakdown
 * @property {number | null} view_count
 */

/**
 * @typedef {TablesVeevaVaultContentRawRow} TablesVeevaVaultContentRawInsert
 */

/**
 * @typedef {TablesVeevaVaultContentRawRow} TablesVeevaVaultContentRawUpdate
 */

/**
 * @typedef {Object} TablesVisualAssetsRow
 * @property {string[] | null} applicable_asset_types
 * @property {string[] | null} applicable_audiences
 * @property {Json | null} applicable_contexts
 * @property {string | null} approval_notes
 * @property {string} brand_id
 * @property {string | null} caption
 * @property {string | null} created_at
 * @property {string} id
 * @property {string | null} last_used_at
 * @property {string[] | null} linked_claims
 * @property {string[] | null} linked_references
 * @property {boolean | null} mlr_approved
 * @property {string | null} mlr_approved_at
 * @property {string | null} mlr_approved_by
 * @property {string} source_document_id
 * @property {number | null} source_page
 * @property {string | null} source_section
 * @property {string | null} storage_path
 * @property {string | null} title
 * @property {string | null} updated_at
 * @property {number | null} usage_count
 * @property {Json} visual_data
 * @property {Json | null} visual_metadata
 * @property {string} visual_type
 */

/**
 * @typedef {TablesVisualAssetsRow} TablesVisualAssetsInsert
 */

/**
 * @typedef {TablesVisualAssetsRow} TablesVisualAssetsUpdate
 */

/**
 * @typedef {Object} TablesVisualContentReviewsRow
 * @property {string | null} composed_email_id
 * @property {string | null} created_at
 * @property {Json | null} cultural_review_results
 * @property {string} id
 * @property {Json | null} issues
 * @property {Json | null} mlr_review_results
 * @property {number | null} overall_compliance_score
 * @property {string[] | null} required_changes
 * @property {string | null} review_status
 * @property {string | null} reviewed_at
 * @property {string | null} reviewed_by
 * @property {string} visual_identifier
 * @property {string} visual_type
 */

/**
 * @typedef {TablesVisualContentReviewsRow} TablesVisualContentReviewsInsert
 */

/**
 * @typedef {TablesVisualContentReviewsRow} TablesVisualContentReviewsUpdate
 */

/**
 * @typedef {Object} TablesWebAnalyticsRawRow
 * @property {boolean | null} bounce
 * @property {string | null} brand_id
 * @property {string | null} browser
 * @property {string | null} campaign_medium
 * @property {string | null} campaign_name
 * @property {string | null} campaign_source
 * @property {string | null} content_registry_id
 * @property {Json | null} cta_clicks
 * @property {number | null} days_since_last_visit
 * @property {string | null} device_type
 * @property {Json | null} form_submissions
 * @property {string | null} geography
 * @property {string | null} hcp_id
 * @property {string | null} hcp_specialty
 * @property {string} id
 * @property {string | null} ingestion_timestamp
 * @property {number | null} page_views
 * @property {Json | null} pages_visited
 * @property {string | null} patient_journey_stage
 * @property {Json | null} raw_payload
 * @property {string | null} referrer_source
 * @property {string | null} region
 * @property {Json | null} resources_downloaded
 * @property {boolean | null} return_visitor
 * @property {number | null} scroll_depth
 * @property {Json | null} search_terms_used
 * @property {number | null} session_duration_seconds
 * @property {string} session_id
 * @property {string | null} state
 * @property {number | null} time_on_page_seconds
 * @property {string | null} urban_rural
 * @property {number | null} video_completion_rate
 * @property {Json | null} videos_watched
 * @property {number | null} visit_count
 * @property {string} visit_date
 * @property {string} visit_timestamp
 * @property {string | null} visitor_type
 */

/**
 * @typedef {TablesWebAnalyticsRawRow} TablesWebAnalyticsRawInsert
 */

/**
 * @typedef {TablesWebAnalyticsRawRow} TablesWebAnalyticsRawUpdate
 */


/**
 * @typedef {Object} Database
 * @property {Object} __InternalSupabase - Internal types for Supabase client.
 * @property {Object} __InternalSupabase.PostgrestVersion - Internal version.
 * @property {Object} public
 * @property {Object} public.Tables
 * @property {Object} public.Tables.agency_collaboration_workflows
 * @property {TablesAgencyCollaborationWorkflowsRow} public.Tables.agency_collaboration_workflows.Row
 * @property {TablesAgencyCollaborationWorkflowsInsert} public.Tables.agency_collaboration_workflows.Insert
 * @property {TablesAgencyCollaborationWorkflowsUpdate} public.Tables.agency_collaboration_workflows.Update
 * @property {Object} public.Tables.ai_translation_results
 * @property {TablesAiTranslationResultsRow} public.Tables.ai_translation_results.Row
 * @property {TablesAiTranslationResultsRow} public.Tables.ai_translation_results.Insert
 * @property {TablesAiTranslationResultsRow} public.Tables.ai_translation_results.Update
 * @property {Object} public.Tables.asset_guardrails
 * @property {TablesAssetGuardrailsRow} public.Tables.asset_guardrails.Row
 * @property {TablesAssetGuardrailsInsert} public.Tables.asset_guardrails.Insert
 * @property {TablesAssetGuardrailsUpdate} public.Tables.asset_guardrails.Update
 * @property {Object} public.Tables.asset_themes
 * @property {TablesAssetThemesRow} public.Tables.asset_themes.Row
 * @property {TablesAssetThemesInsert} public.Tables.asset_themes.Insert
 * @property {TablesAssetThemesUpdate} public.Tables.asset_themes.Update
 * @property {Object} public.Tables.asset_type_configurations
 * @property {TablesAssetTypeConfigurationsRow} public.Tables.asset_type_configurations.Row
 * @property {TablesAssetTypeConfigurationsInsert} public.Tables.asset_type_configurations.Insert
 * @property {TablesAssetTypeConfigurationsUpdate} public.Tables.asset_type_configurations.Update
 * @property {Object} public.Tables.audience_segments
 * @property {TablesAudienceSegmentsRow} public.Tables.audience_segments.Row
 * @property {TablesAudienceSegmentsInsert} public.Tables.audience_segments.Insert
 * @property {TablesAudienceSegmentsUpdate} public.Tables.audience_segments.Update
 * @property {Object} public.Tables.audit_logs
 * @property {TablesAuditLogsRow} public.Tables.audit_logs.Row
 * @property {TablesAuditLogsInsert} public.Tables.audit_logs.Insert
 * @property {TablesAuditLogsUpdate} public.Tables.audit_logs.Update
 * @property {Object} public.Tables.brand_documents
 * @property {TablesBrandDocumentsRow} public.Tables.brand_documents.Row
 * @property {TablesBrandDocumentsInsert} public.Tables.brand_documents.Insert
 * @property {TablesBrandDocumentsUpdate} public.Tables.brand_documents.Update
 * @property {Object} public.Tables.brand_guidelines
 * @property {TablesBrandGuidelinesRow} public.Tables.brand_guidelines.Row
 * @property {TablesBrandGuidelinesInsert} public.Tables.brand_guidelines.Insert
 * @property {TablesBrandGuidelinesUpdate} public.Tables.brand_guidelines.Update
 * @property {Object} public.Tables.brand_market_configurations
 * @property {TablesBrandMarketConfigurationsRow} public.Tables.brand_market_configurations.Row
 * @property {TablesBrandMarketConfigurationsInsert} public.Tables.brand_market_configurations.Insert
 * @property {TablesBrandMarketConfigurationsUpdate} public.Tables.brand_market_configurations.Update
 * @property {Object} public.Tables.brand_profiles
 * @property {TablesBrandProfilesRow} public.Tables.brand_profiles.Row
 * @property {TablesBrandProfilesInsert} public.Tables.brand_profiles.Insert
 * @property {TablesBrandProfilesUpdate} public.Tables.brand_profiles.Update
 * @property {Object} public.Tables.brand_vision
 * @property {TablesBrandVisionRow} public.Tables.brand_vision.Row
 * @property {TablesBrandVisionInsert} public.Tables.brand_vision.Insert
 * @property {TablesBrandVisionUpdate} public.Tables.brand_vision.Update
 * @property {Object} public.Tables.campaign_guardrails
 * @property {TablesCampaignGuardrailsRow} public.Tables.campaign_guardrails.Row
 * @property {TablesCampaignGuardrailsInsert} public.Tables.campaign_guardrails.Insert
 * @property {TablesCampaignGuardrailsUpdate} public.Tables.campaign_guardrails.Update
 * @property {Object} public.Tables.campaign_performance_analytics
 * @property {TablesCampaignPerformanceAnalyticsRow} public.Tables.campaign_performance_analytics.Row
 * @property {TablesCampaignPerformanceAnalyticsInsert} public.Tables.campaign_performance_analytics.Insert
 * @property {TablesCampaignPerformanceAnalyticsUpdate} public.Tables.campaign_performance_analytics.Update
 * @property {Object} public.Tables.campaign_themes
 * @property {TablesCampaignThemesRow} public.Tables.campaign_themes.Row
 * @property {TablesCampaignThemesInsert} public.Tables.campaign_themes.Insert
 * @property {TablesCampaignThemesUpdate} public.Tables.campaign_themes.Update
 * @property {Object} public.Tables.claim_variants
 * @property {TablesClaimVariantsRow} public.Tables.claim_variants.Row
 * @property {TablesClaimVariantsInsert} public.Tables.claim_variants.Insert
 * @property {TablesClaimVariantsUpdate} public.Tables.claim_variants.Update
 * @property {Object} public.Tables.clinical_claims
 * @property {TablesClinicalClaimsRow} public.Tables.clinical_claims.Row
 * @property {TablesClinicalClaimsInsert} public.Tables.clinical_claims.Insert
 * @property {TablesClinicalClaimsUpdate} public.Tables.clinical_claims.Update
 * @property {Object} public.Tables.clinical_references
 * @property {TablesClinicalReferencesRow} public.Tables.clinical_references.Row
 * @property {TablesClinicalReferencesInsert} public.Tables.clinical_references.Insert
 * @property {TablesClinicalReferencesUpdate} public.Tables.clinical_references.Update
 * @property {Object} public.Tables.competitive_intelligence
 * @property {TablesCompetitiveIntelligenceRow} public.Tables.competitive_intelligence.Row
 * @property {TablesCompetitiveIntelligenceInsert} public.Tables.competitive_intelligence.Insert
 * @property {TablesCompetitiveIntelligenceUpdate} public.Tables.competitive_intelligence.Update
 * @property {Object} public.Tables.competitive_intelligence_data
 * @property {TablesCompetitiveIntelligenceDataRow} public.Tables.competitive_intelligence_data.Row
 * @property {TablesCompetitiveIntelligenceDataInsert} public.Tables.competitive_intelligence_data.Insert
 * @property {TablesCompetitiveIntelligenceDataUpdate} public.Tables.competitive_intelligence_data.Update
 * @property {Object} public.Tables.competitive_intelligence_enriched
 * @property {TablesCompetitiveIntelligenceEnrichedRow} public.Tables.competitive_intelligence_enriched.Row
 * @property {TablesCompetitiveIntelligenceEnrichedInsert} public.Tables.competitive_intelligence_enriched.Insert
 * @property {TablesCompetitiveIntelligenceEnrichedUpdate} public.Tables.competitive_intelligence_enriched.Update
 * @property {Object} public.Tables.competitive_landscape
 * @property {TablesCompetitiveLandscapeRow} public.Tables.competitive_landscape.Row
 * @property {TablesCompetitiveLandscapeInsert} public.Tables.competitive_landscape.Insert
 * @property {TablesCompetitiveLandscapeUpdate} public.Tables.competitive_landscape.Update
 * @property {Object} public.Tables.compliance_history
 * @property {TablesComplianceHistoryRow} public.Tables.compliance_history.Row
 * @property {TablesComplianceHistoryInsert} public.Tables.compliance_history.Insert
 * @property {TablesComplianceHistoryUpdate} public.Tables.compliance_history.Update
 * @property {Object} public.Tables.composed_emails
 * @property {TablesComposedEmailsRow} public.Tables.composed_emails.Row
 * @property {TablesComposedEmailsInsert} public.Tables.composed_emails.Insert
 * @property {TablesComposedEmailsUpdate} public.Tables.composed_emails.Update
 * @property {Object} public.Tables.content_analytics
 * @property {TablesContentAnalyticsRow} public.Tables.content_analytics.Row
 * @property {TablesContentAnalyticsInsert} public.Tables.content_analytics.Insert
 * @property {TablesContentAnalyticsUpdate} public.Tables.content_analytics.Update
 * @property {Object} public.Tables.content_assets
 * @property {TablesContentAssetsRow} public.Tables.content_assets.Row
 * @property {TablesContentAssetsInsert} public.Tables.content_assets.Insert
 * @property {TablesContentAssetsUpdate} public.Tables.content_assets.Update
 * @property {Object} public.Tables.content_element_performance
 * @property {TablesContentElementPerformanceRow} public.Tables.content_element_performance.Row
 * @property {TablesContentElementPerformanceInsert} public.Tables.content_element_performance.Insert
 * @property {TablesContentElementPerformanceUpdate} public.Tables.content_element_performance.Update
 * @property {Object} public.Tables.content_modules
 * @property {TablesContentModulesRow} public.Tables.content_modules.Row
 * @property {TablesContentModulesInsert} public.Tables.content_modules.Insert
 * @property {TablesContentModulesUpdate} public.Tables.content_modules.Update
 * @property {Object} public.Tables.content_opportunities
 * @property {TablesContentOpportunitiesRow} public.Tables.content_opportunities.Row
 * @property {TablesContentOpportunitiesInsert} public.Tables.content_opportunities.Insert
 * @property {TablesContentOpportunitiesUpdate} public.Tables.content_opportunities.Update
 * @property {Object} public.Tables.content_performance_attribution
 * @property {TablesContentPerformanceAttributionRow} public.Tables.content_performance_attribution.Row
 * @property {TablesContentPerformanceAttributionInsert} public.Tables.content_performance_attribution.Insert
 * @property {TablesContentPerformanceAttributionUpdate} public.Tables.content_performance_attribution.Update
 * @property {Object} public.Tables.content_performance_metrics
 * @property {TablesContentPerformanceMetricsRow} public.Tables.content_performance_metrics.Row
 * @property {TablesContentPerformanceMetricsInsert} public.Tables.content_performance_metrics.Insert
 * @property {TablesContentPerformanceMetricsUpdate} public.Tables.content_performance_metrics.Update
 * @property {Object} public.Tables.content_projects
 * @property {TablesContentProjectsRow} public.Tables.content_projects.Row
 * @property {TablesContentProjectsInsert} public.Tables.content_projects.Insert
 * @property {TablesContentProjectsUpdate} public.Tables.content_projects.Update
 * @property {Object} public.Tables.content_registry
 * @property {TablesContentRegistryRow} public.Tables.content_registry.Row
 * @property {TablesContentRegistryInsert} public.Tables.content_registry.Insert
 * @property {TablesContentRegistryUpdate} public.Tables.content_registry.Update
 * @property {Object} public.Tables.content_relationships
 * @property {TablesContentRelationshipsRow} public.Tables.content_relationships.Row
 * @property {TablesContentRelationshipsInsert} public.Tables.content_relationships.Insert
 * @property {TablesContentRelationshipsUpdate} public.Tables.content_relationships.Update
 * @property {Object} public.Tables.content_segments
 * @property {TablesContentSegmentsRow} public.Tables.content_segments.Row
 * @property {TablesContentSegmentsInsert} public.Tables.content_segments.Insert
 * @property {TablesContentSegmentsUpdate} public.Tables.content_segments.Update
 * @property {Object} public.Tables.content_sessions
 * @property {TablesContentSessionsRow} public.Tables.content_sessions.Row
 * @property {TablesContentSessionsInsert} public.Tables.content_sessions.Insert
 * @property {TablesContentSessionsUpdate} public.Tables.content_sessions.Update
 * @property {Object} public.Tables.content_success_patterns
 * @property {TablesContentSuccessPatternsRow} public.Tables.content_success_patterns.Row
 * @property {TablesContentSuccessPatternsInsert} public.Tables.content_success_patterns.Insert
 * @property {TablesContentSuccessPatternsUpdate} public.Tables.content_success_patterns.Update
 * @property {Object} public.Tables.content_validation_results
 * @property {TablesContentValidationResultsRow} public.Tables.content_validation_results.Row
 * @property {TablesContentValidationResultsInsert} public.Tables.content_validation_results.Insert
 * @property {TablesContentValidationResultsUpdate} public.Tables.content_validation_results.Update
 * @property {Object} public.Tables.content_variations
 * @property {TablesContentVariationsRow} public.Tables.content_variations.Row
 * @property {TablesContentVariationsInsert} public.Tables.content_variations.Insert
 * @property {TablesContentVariationsUpdate} public.Tables.content_variations.Update
 * @property {Object} public.Tables.content_versions
 * @property {TablesContentVersionsRow} public.Tables.content_versions.Row
 * @property {TablesContentVersionsInsert} public.Tables.content_versions.Insert
 * @property {TablesContentVersionsUpdate} public.Tables.content_versions.Update
 * @property {Object} public.Tables.cross_module_context
 * @property {TablesCrossModuleContextRow} public.Tables.cross_module_context.Row
 * @property {TablesCrossModuleContextInsert} public.Tables.cross_module_context.Insert
 * @property {TablesCrossModuleContextUpdate} public.Tables.cross_module_context.Update
 * @property {Object} public.Tables.data_ingestion_log
 * @property {TablesDataIngestionLogRow} public.Tables.data_ingestion_log.Row
 * @property {TablesDataIngestionLogInsert} public.Tables.data_ingestion_log.Insert
 * @property {TablesDataIngestionLogUpdate} public.Tables.data_ingestion_log.Update
 * @property {Object} public.Tables.data_source_registry
 * @property {TablesDataSourceRegistryRow} public.Tables.data_source_registry.Row
 * @property {TablesDataSourceRegistryInsert} public.Tables.data_source_registry.Insert
 * @property {TablesDataSourceRegistryUpdate} public.Tables.data_source_registry.Update
 * @property {Object} public.Tables.design_handoffs
 * @property {TablesDesignHandoffsRow} public.Tables.design_handoffs.Row
 * @property {TablesDesignHandoffsInsert} public.Tables.design_handoffs.Insert
 * @property {TablesDesignHandoffsUpdate} public.Tables.design_handoffs.Update
 * @property {Object} public.Tables.document_categories
 * @property {TablesDocumentCategoriesRow} public.Tables.document_categories.Row
 * @property {TablesDocumentCategoriesInsert} public.Tables.document_categories.Insert
 * @property {TablesDocumentCategoriesUpdate} public.Tables.document_categories.Update
 * @property {Object} public.Tables.global_taxonomy
 * @property {TablesGlobalTaxonomyRow} public.Tables.global_taxonomy.Row
 * @property {TablesGlobalTaxonomyInsert} public.Tables.global_taxonomy.Insert
 * @property {TablesGlobalTaxonomyUpdate} public.Tables.global_taxonomy.Update
 * @property {Object} public.Tables.glocal_adaptation_projects
 * @property {TablesGlocalAdaptationProjectsRow} public.Tables.glocal_adaptation_projects.Row
 * @property {TablesGlocalAdaptationProjectsInsert} public.Tables.glocal_adaptation_projects.Insert
 * @property {TablesGlocalAdaptationProjectsUpdate} public.Tables.glocal_adaptation_projects.Update
 * @property {Object} public.Tables.glocal_analytics
 * @property {TablesGlocalAnalyticsRow} public.Tables.glocal_analytics.Row
 * @property {TablesGlocalAnalyticsInsert} public.Tables.glocal_analytics.Insert
 * @property {TablesGlocalAnalyticsUpdate} public.Tables.glocal_analytics.Update
 * @property {Object} public.Tables.glocal_content_segments
 * @property {TablesGlocalContentSegmentsRow} public.Tables.glocal_content_segments.Row
 * @property {TablesGlocalContentSegmentsInsert} public.Tables.glocal_content_segments.Insert
 * @property {TablesGlocalContentSegmentsUpdate} public.Tables.glocal_content_segments.Update
 * @property {Object} public.Tables.glocal_cultural_intelligence
 * @property {TablesGlocalCulturalIntelligenceRow} public.Tables.glocal_cultural_intelligence.Row
 * @property {TablesGlocalCulturalIntelligenceInsert} public.Tables.glocal_cultural_intelligence.Insert
 * @property {TablesGlocalCulturalIntelligenceUpdate} public.Tables.glocal_cultural_intelligence.Update
 * @property {Object} public.Tables.glocal_regulatory_compliance
 * @property {TablesGlocalRegulatoryComplianceRow} public.Tables.glocal_regulatory_compliance.Row
 * @property {TablesGlocalRegulatoryComplianceInsert} public.Tables.glocal_regulatory_compliance.Insert
 * @property {TablesGlocalRegulatoryComplianceUpdate} public.Tables.glocal_regulatory_compliance.Update
 * @property {Object} public.Tables.glocal_tm_intelligence
 * @property {TablesGlocalTmIntelligenceRow} public.Tables.glocal_tm_intelligence.Row
 * @property {TablesGlocalTmIntelligenceInsert} public.Tables.glocal_tm_intelligence.Insert
 * @property {TablesGlocalTmIntelligenceUpdate} public.Tables.glocal_tm_intelligence.Update
 * @property {Object} public.Tables.glocal_workflows
 * @property {TablesGlocalWorkflowsRow} public.Tables.glocal_workflows.Row
 * @property {TablesGlocalWorkflowsInsert} public.Tables.glocal_workflows.Insert
 * @property {TablesGlocalWorkflowsUpdate} public.Tables.glocal_workflows.Update
 * @property {Object} public.Tables.guardrail_inheritance
 * @property {TablesGuardrailInheritanceRow} public.Tables.guardrail_inheritance.Row
 * @property {TablesGuardrailInheritanceInsert} public.Tables.guardrail_inheritance.Insert
 * @property {TablesGuardrailInheritanceUpdate} public.Tables.guardrail_inheritance.Update
 * @property {Object} public.Tables.hcp_engagement_analytics
 * @property {TablesHcpEngagementAnalyticsRow} public.Tables.hcp_engagement_analytics.Row
 * @property {TablesHcpEngagementAnalyticsInsert} public.Tables.hcp_engagement_analytics.Insert
 * @property {TablesHcpEngagementAnalyticsUpdate} public.Tables.hcp_engagement_analytics.Update
 * @property {Object} public.Tables.intelligence_refresh_log
 * @property {TablesIntelligenceRefreshLogRow} public.Tables.intelligence_refresh_log.Row
 * @property {TablesIntelligenceRefreshLogInsert} public.Tables.intelligence_refresh_log.Insert
 * @property {TablesIntelligenceRefreshLogUpdate} public.Tables.intelligence_refresh_log.Update
 * @property {Object} public.Tables.intelligence_usage_logs
 * @property {TablesIntelligenceUsageLogsRow} public.Tables.intelligence_usage_logs.Row
 * @property {TablesIntelligenceUsageLogsInsert} public.Tables.intelligence_usage_logs.Insert
 * @property {TablesIntelligenceUsageLogsUpdate} public.Tables.intelligence_usage_logs.Update
 * @property {Object} public.Tables.iqvia_hcp_decile_raw
 * @property {TablesIqviaHcpDecileRawRow} public.Tables.iqvia_hcp_decile_raw.Row
 * @property {TablesIqviaHcpDecileRawInsert} public.Tables.iqvia_hcp_decile_raw.Insert
 * @property {TablesIqviaHcpDecileRawUpdate} public.Tables.iqvia_hcp_decile_raw.Update
 * @property {Object} public.Tables.iqvia_market_data
 * @property {TablesIqviaMarketDataRow} public.Tables.iqvia_market_data.Row
 * @property {TablesIqviaMarketDataInsert} public.Tables.iqvia_market_data.Insert
 * @property {TablesIqviaMarketDataUpdate} public.Tables.iqvia_market_data.Update
 * @property {Object} public.Tables.iqvia_rx_raw
 * @property {TablesIqviaRxRawRow} public.Tables.iqvia_rx_raw.Row
 * @property {TablesIqviaRxRawInsert} public.Tables.iqvia_rx_raw.Insert
 * @property {TablesIqviaRxRawUpdate} public.Tables.iqvia_rx_raw.Update
 * @property {Object} public.Tables.learning_insights
 * @property {TablesLearningInsightsRow} public.Tables.learning_insights.Row
 * @property {TablesLearningInsightsInsert} public.Tables.learning_insights.Insert
 * @property {TablesLearningInsightsUpdate} public.Tables.learning_insights.Update
 * @property {Object} public.Tables.learning_signals
 * @property {TablesLearningSignalsRow} public.Tables.learning_signals.Row
 * @property {TablesLearningSignalsInsert} public.Tables.learning_signals.Insert
 * @property {TablesLearningSignalsUpdate} public.Tables.learning_signals.Update
 * @property {Object} public.Tables.localization_agencies
 * @property {TablesLocalizationAgenciesRow} public.Tables.localization_agencies.Row
 * @property {TablesLocalizationAgenciesInsert} public.Tables.localization_agencies.Insert
 * @property {TablesLocalizationAgenciesUpdate} public.Tables.localization_agencies.Update
 * @property {Object} public.Tables.localization_analytics
 * @property {TablesLocalizationAnalyticsRow} public.Tables.localization_analytics.Row
 * @property {TablesLocalizationAnalyticsInsert} public.Tables.localization_analytics.Insert
 * @property {TablesLocalizationAnalyticsUpdate} public.Tables.localization_analytics.Update
 * @property {Object} public.Tables.localization_projects
 * @property {TablesLocalizationProjectsRow} public.Tables.localization_projects.Row
 * @property {TablesLocalizationProjectsInsert} public.Tables.localization_projects.Insert
 * @property {TablesLocalizationProjectsUpdate} public.Tables.localization_projects.Update
 * @property {Object} public.Tables.localization_workflows
 * @property {TablesLocalizationWorkflowsRow} public.Tables.localization_workflows.Row
 * @property {TablesLocalizationWorkflowsInsert} public.Tables.localization_workflows.Insert
 * @property {TablesLocalizationWorkflowsUpdate} public.Tables.localization_workflows.Update
 * @property {Object} public.Tables.market_intelligence_analytics
 * @property {TablesMarketIntelligenceAnalyticsRow} public.Tables.market_intelligence_analytics.Row
 * @property {TablesMarketIntelligenceAnalyticsInsert} public.Tables.market_intelligence_analytics.Insert
 * @property {TablesMarketIntelligenceAnalyticsUpdate} public.Tables.market_intelligence_analytics.Update
 * @property {Object} public.Tables.market_positioning
 * @property {TablesMarketPositioningRow} public.Tables.market_positioning.Row
 * @property {TablesMarketPositioningInsert} public.Tables.market_positioning.Insert
 * @property {TablesMarketPositioningUpdate} public.Tables.market_positioning.Update
 * @property {Object} public.Tables.mlr_analysis_results
 * @property {TablesMlrAnalysisResultsRow} public.Tables.mlr_analysis_results.Row
 * @property {TablesMlrAnalysisResultsInsert} public.Tables.mlr_analysis_results.Insert
 * @property {TablesMlrAnalysisResultsUpdate} public.Tables.mlr_analysis_results.Update
 * @property {Object} public.Tables.mlr_decision_patterns
 * @property {TablesMlrDecisionPatternsRow} public.Tables.mlr_decision_patterns.Row
 * @property {TablesMlrDecisionPatternsInsert} public.Tables.mlr_decision_patterns.Insert
 * @property {TablesMlrDecisionPatternsUpdate} public.Tables.mlr_decision_patterns.Update
 * @property {Object} public.Tables.mlr_learning_feedback
 * @property {TablesMlrLearningFeedbackRow} public.Tables.mlr_learning_feedback.Row
 * @property {TablesMlrLearningFeedbackInsert} public.Tables.mlr_learning_feedback.Insert
 * @property {TablesMlrLearningFeedbackUpdate} public.Tables.mlr_learning_feedback.Update
 * @property {Object} public.Tables.mlr_review_decisions
 * @property {TablesMlrReviewDecisionsRow} public.Tables.mlr_review_decisions.Row
 * @property {TablesMlrReviewDecisionsInsert} public.Tables.mlr_review_decisions.Insert
 * @property {TablesMlrReviewDecisionsUpdate} public.Tables.mlr_review_decisions.Update
 * @property {Object} public.Tables.opportunity_clusters
 * @property {TablesOpportunityClustersRow} public.Tables.opportunity_clusters.Row
 * @property {TablesOpportunityClustersInsert} public.Tables.opportunity_clusters.Insert
 * @property {TablesOpportunityClustersUpdate} public.Tables.opportunity_clusters.Update
 * @property {Object} public.Tables.opportunity_tracking
 * @property {TablesOpportunityTrackingRow} public.Tables.opportunity_tracking.Row
 * @property {TablesOpportunityTrackingInsert} public.Tables.opportunity_tracking.Insert
 * @property {TablesOpportunityTrackingUpdate} public.Tables.opportunity_tracking.Update
 * @property {Object} public.Tables.performance_predictions
 * @property {TablesPerformancePredictionsRow} public.Tables.performance_predictions.Row
 * @property {TablesPerformancePredictionsInsert} public.Tables.performance_predictions.Insert
 * @property {TablesPerformancePredictionsUpdate} public.Tables.performance_predictions.Update
 * @property {Object} public.Tables.pharmaceutical_glossary
 * @property {TablesPharmaceuticalGlossaryRow} public.Tables.pharmaceutical_glossary.Row
 * @property {TablesPharmaceuticalGlossaryInsert} public.Tables.pharmaceutical_glossary.Insert
 * @property {TablesPharmaceuticalGlossaryUpdate} public.Tables.pharmaceutical_glossary.Update
 * @property {Object} public.Tables.pre_approved_content_library
 * @property {TablesPreApprovedContentLibraryRow} public.Tables.pre_approved_content_library.Row
 * @property {TablesPreApprovedContentLibraryInsert} public.Tables.pre_approved_content_library.Insert
 * @property {TablesPreApprovedContentLibraryUpdate} public.Tables.pre_approved_content_library.Update
 * @property {Object} public.Tables.profiles
 * @property {TablesProfilesRow} public.Tables.profiles.Row
 * @property {TablesProfilesInsert} public.Tables.profiles.Insert
 * @property {TablesProfilesUpdate} public.Tables.profiles.Update
 * @property {Object} public.Tables.public_domain_insights
 * @property {TablesPublicDomainInsightsRow} public.Tables.public_domain_insights.Row
 * @property {TablesPublicDomainInsightsInsert} public.Tables.public_domain_insights.Insert
 * @property {TablesPublicDomainInsightsUpdate} public.Tables.public_domain_insights.Update
 * @property {Object} public.Tables.regional_settings
 * @property {TablesRegionalSettingsRow} public.Tables.regional_settings.Row
 * @property {TablesRegionalSettingsInsert} public.Tables.regional_settings.Insert
 * @property {TablesRegionalSettingsUpdate} public.Tables.regional_settings.Update
 * @property {Object} public.Tables.regulatory_compliance_matrix
 * @property {TablesRegulatoryComplianceMatrixRow} public.Tables.regulatory_compliance_matrix.Row
 * @property {TablesRegulatoryComplianceMatrixInsert} public.Tables.regulatory_compliance_matrix.Insert
 * @property {TablesRegulatoryComplianceMatrixUpdate} public.Tables.regulatory_compliance_matrix.Update
 * @property {Object} public.Tables.regulatory_framework
 * @property {TablesRegulatoryFrameworkRow} public.Tables.regulatory_framework.Row
 * @property {TablesRegulatoryFrameworkInsert} public.Tables.regulatory_framework.Insert
 * @property {TablesRegulatoryFrameworkUpdate} public.Tables.regulatory_framework.Update
 * @property {Object} public.Tables.regulatory_profiles
 * @property {TablesRegulatoryProfilesRow} public.Tables.regulatory_profiles.Row
 * @property {TablesRegulatoryProfilesInsert} public.Tables.regulatory_profiles.Insert
 * @property {TablesRegulatoryProfilesUpdate} public.Tables.regulatory_profiles.Update
 * @property {Object} public.Tables.rule_conflicts
 * @property {TablesRuleConflictsRow} public.Tables.rule_conflicts.Row
 * @property {TablesRuleConflictsInsert} public.Tables.rule_conflicts.Insert
 * @property {TablesRuleConflictsUpdate} public.Tables.rule_conflicts.Update
 * @property {Object} public.Tables.rule_execution_log
 * @property {TablesRuleExecutionLogRow} public.Tables.rule_execution_log.Row
 * @property {TablesRuleExecutionLogInsert} public.Tables.rule_execution_log.Insert
 * @property {TablesRuleExecutionLogUpdate} public.Tables.rule_execution_log.Update
 * @property {Object} public.Tables.safety_statements
 * @property {TablesSafetyStatementsRow} public.Tables.safety_statements.Row
 * @property {TablesSafetyStatementsInsert} public.Tables.safety_statements.Insert
 * @property {TablesSafetyStatementsUpdate} public.Tables.safety_statements.Update
 * @property {Object} public.Tables.sfmc_campaign_data
 * @property {TablesSfmcCampaignDataRow} public.Tables.sfmc_campaign_data.Row
 * @property {TablesSfmcCampaignDataInsert} public.Tables.sfmc_campaign_data.Insert
 * @property {TablesSfmcCampaignDataUpdate} public.Tables.sfmc_campaign_data.Update
 * @property {Object} public.Tables.sfmc_campaign_raw
 * @property {TablesSfmcCampaignRawRow} public.Tables.sfmc_campaign_raw.Row
 * @property {TablesSfmcCampaignRawInsert} public.Tables.sfmc_campaign_raw.Insert
 * @property {TablesSfmcCampaignRawUpdate} public.Tables.sfmc_campaign_raw.Update
 * @property {Object} public.Tables.sfmc_journey_raw
 * @property {TablesSfmcJourneyRawRow} public.Tables.sfmc_journey_raw.Row
 * @property {TablesSfmcJourneyRawInsert} public.Tables.sfmc_journey_raw.Insert
 * @property {TablesSfmcJourneyRawUpdate} public.Tables.sfmc_journey_raw.Update
 * @property {Object} public.Tables.smart_rules
 * @property {TablesSmartRulesRow} public.Tables.smart_rules.Row
 * @property {TablesSmartRulesInsert} public.Tables.smart_rules.Insert
 * @property {TablesSmartRulesUpdate} public.Tables.smart_rules.Update
 * @property {Object} public.Tables.social_intelligence_analytics
 * @property {TablesSocialIntelligenceAnalyticsRow} public.Tables.social_intelligence_analytics.Row
 * @property {TablesSocialIntelligenceAnalyticsInsert} public.Tables.social_intelligence_analytics.Insert
 * @property {TablesSocialIntelligenceAnalyticsUpdate} public.Tables.social_intelligence_analytics.Update
 * @property {Object} public.Tables.social_listening_data
 * @property {TablesSocialListeningDataRow} public.Tables.social_listening_data.Row
 * @property {TablesSocialListeningDataInsert} public.Tables.social_listening_data.Insert
 * @property {TablesSocialListeningDataUpdate} public.Tables.social_listening_data.Update
 * @property {Object} public.Tables.social_listening_raw
 * @property {TablesSocialListeningRawRow} public.Tables.social_listening_raw.Row
 * @property {TablesSocialListeningRawInsert} public.Tables.social_listening_raw.Insert
 * @property {TablesSocialListeningRawUpdate} public.Tables.social_listening_raw.Update
 * @property {Object} public.Tables.theme_analytics
 * @property {TablesThemeAnalyticsRow} public.Tables.theme_analytics.Row
 * @property {TablesThemeAnalyticsInsert} public.Tables.theme_analytics.Insert
 * @property {TablesThemeAnalyticsUpdate} public.Tables.theme_analytics.Update
 * @property {Object} public.Tables.theme_comparisons
 * @property {TablesThemeComparisonsRow} public.Tables.theme_comparisons.Row
 * @property {TablesThemeComparisonsInsert} public.Tables.theme_comparisons.Insert
 * @property {TablesThemeComparisonsUpdate} public.Tables.theme_comparisons.Update
 * @property {Object} public.Tables.theme_intelligence
 * @property {TablesThemeIntelligenceRow} public.Tables.theme_intelligence.Row
 * @property {TablesThemeIntelligenceInsert} public.Tables.theme_intelligence.Insert
 * @property {TablesThemeIntelligenceUpdate} public.Tables.theme_intelligence.Update
 * @property {Object} public.Tables.theme_library
 * @property {TablesThemeLibraryRow} public.Tables.theme_library.Row
 * @property {TablesThemeLibraryInsert} public.Tables.theme_library.Insert
 * @property {TablesThemeLibraryUpdate} public.Tables.theme_library.Update
 * @property {Object} public.Tables.theme_usage_history
 * @property {TablesThemeUsageHistoryRow} public.Tables.theme_usage_history.Row
 * @property {TablesThemeUsageHistoryInsert} public.Tables.theme_usage_history.Insert
 * @property {TablesThemeUsageHistoryUpdate} public.Tables.theme_usage_history.Update
 * @property {Object} public.Tables.translation_engine_performance
 * @property {TablesTranslationEnginePerformanceRow} public.Tables.translation_engine_performance.Row
 * @property {TablesTranslationEnginePerformanceInsert} public.Tables.translation_engine_performance.Insert
 * @property {TablesTranslationEnginePerformanceUpdate} public.Tables.translation_engine_performance.Update
 * @property {Object} public.Tables.translation_memory
 * @property {TablesTranslationMemoryRow} public.Tables.translation_memory.Row
 * @property {TablesTranslationMemoryInsert} public.Tables.translation_memory.Insert
 * @property {TablesTranslationMemoryUpdate} public.Tables.translation_memory.Update
 * @property {Object} public.Tables.trend_forecasts
 * @property {TablesTrendForecastsRow} public.Tables.trend_forecasts.Row
 * @property {TablesTrendForecastsInsert} public.Tables.trend_forecasts.Insert
 * @property {TablesTrendForecastsUpdate} public.Tables.trend_forecasts.Update
 * @property {Object} public.Tables.user_brand_access
 * @property {TablesUserBrandAccessRow} public.Tables.user_brand_access.Row
 * @property {TablesUserBrandAccessInsert} public.Tables.user_brand_access.Insert
 * @property {TablesUserBrandAccessUpdate} public.Tables.user_brand_access.Update
 * @property {Object} public.Tables.veeva_crm_activity_raw
 * @property {TablesVeevaCrmActivityRawRow} public.Tables.veeva_crm_activity_raw.Row
 * @property {TablesVeevaCrmActivityRawInsert} public.Tables.veeva_crm_activity_raw.Insert
 * @property {TablesVeevaCrmActivityRawUpdate} public.Tables.veeva_crm_activity_raw.Update
 * @property {Object} public.Tables.veeva_field_insights
 * @property {TablesVeevaFieldInsightsRow} public.Tables.veeva_field_insights.Row
 * @property {TablesVeevaFieldInsightsInsert} public.Tables.veeva_field_insights.Insert
 * @property {TablesVeevaFieldInsightsUpdate} public.Tables.veeva_field_insights.Update
 * @property {Object} public.Tables.veeva_vault_content_raw
 * @property {TablesVeevaVaultContentRawRow} public.Tables.veeva_vault_content_raw.Row
 * @property {TablesVeevaVaultContentRawInsert} public.Tables.veeva_vault_content_raw.Insert
 * @property {TablesVeevaVaultContentRawUpdate} public.Tables.veeva_vault_content_raw.Update
 * @property {Object} public.Tables.visual_assets
 * @property {TablesVisualAssetsRow} public.Tables.visual_assets.Row
 * @property {TablesVisualAssetsInsert} public.Tables.visual_assets.Insert
 * @property {TablesVisualAssetsUpdate} public.Tables.visual_assets.Update
 * @property {Object} public.Tables.visual_content_reviews
 * @property {TablesVisualContentReviewsRow} public.Tables.visual_content_reviews.Row
 * @property {TablesVisualContentReviewsInsert} public.Tables.visual_content_reviews.Insert
 * @property {TablesVisualContentReviewsUpdate} public.Tables.visual_content_reviews.Update
 * @property {Object} public.Tables.web_analytics_raw
 * @property {TablesWebAnalyticsRawRow} public.Tables.web_analytics_raw.Row
 * @property {TablesWebAnalyticsRawInsert} public.Tables.web_analytics_raw.Insert
 * @property {TablesWebAnalyticsRawUpdate} public.Tables.web_analytics_raw.Update
 * @property {Object} public.Views - Views are empty for this schema.
 * @property {Object} public.Functions
 * @property {Function} public.Functions.detect_stuck_parsing_jobs - Args: never; Returns: undefined
 * @property {Function} public.Functions.generate_document_url - Args: { bucket_name: string; file_path: string }; Returns: string
 * @property {Function} public.Functions.get_brand_appropriate_themes - Args: { p_brand_id: string; p_therapeutic_area?: string }; Returns: Array<{ theme_id: string; theme_name: string; therapeutic_match_score: number }>
 * @property {Function} public.Functions.increment_module_usage - Args: { module_id: string }; Returns: undefined
 * @property {Function} public.Functions.user_has_brand_access - Args: { brand_id_param: string; user_id_param: string }; Returns: boolean
 * @property {Object} public.Enums - Enums are empty for this schema.
 * @property {Object} public.CompositeTypes - CompositeTypes are empty for this schema.
 */

// Due to JavaScript's lack of static typing, all the complex generic type exports
// (Tables, TablesInsert, TablesUpdate, Enums, CompositeTypes) cannot be directly converted.
// The JSDoc above provides the necessary structural information.

export const Constants = {
  public: {
    Enums: {},
  },
};