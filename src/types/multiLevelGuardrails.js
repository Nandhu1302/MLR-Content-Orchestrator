/**
 * @fileoverview Multi-Level Guardrails Type Definitions in JSDoc format.
 * This file translates TypeScript types/interfaces into JSDoc type definitions
 * for documentation and runtime structure clarity in a pure JavaScript environment.
 */

// --- Multi-Level Guardrails Types (JS Constants and JSDoc Types) ---

/**
 * @typedef {'brand' | 'campaign' | 'asset'} GuardrailLevel
 */

/**
 * @typedef {'campaign' | 'asset' | 'campaign_override' | 'brand_override' | 'full_override'} OverrideLevel
 */

/**
 * @typedef {'messaging' | 'tone' | 'competitive' | 'regulatory' | 'visual' | 'format' | 'review'} RuleCategory
 */

// Export constants for literal type values (optional, but helpful for documentation/lookup)
export const GuardrailLevels = ['brand', 'campaign', 'asset'];
export const OverrideLevels = ['campaign', 'asset', 'campaign_override', 'brand_override', 'full_override'];
export const RuleCategories = ['messaging', 'tone', 'competitive', 'regulatory', 'visual', 'format', 'review'];


// --- Campaign-Level Guardrails ---

/**
 * @typedef {object} MessagePriorityOverrides
 * @property {number} [messageId] - Priority ranking 1-10. Key is the message ID.
 */

/**
 * @typedef {object} ToneOverrides
 * @property {string} [primary]
 * @property {string} [secondary]
 * @property {string[]} [descriptors]
 */

/**
 * @typedef {object} AudienceSpecificToneDetail
 * @property {string} primary
 * @property {string} secondary
 * @property {string[]} descriptors
 */

/**
 * @typedef {object} MarketSpecificRules
 * @property {object} [market] - Key is the market name.
 * @property {string[]} [market.compliance_requirements]
 * @property {string[]} [market.regulatory_additions]
 * @property {string} [market.local_guidelines]
 */

/**
 * @typedef {object} RegulatoryAdditions
 * @property {string[]} [disclaimers]
 * @property {string[]} [warnings]
 * @property {string[]} [required_language]
 */

/**
 * @typedef {object} MLRDeadlineRequirements
 * @property {number} standard_timeline_days
 * @property {number} expedited_timeline_days
 * @property {string[]} critical_path_requirements
 */

/**
 * @typedef {object} ApprovalProcessOverrides
 * @property {string[]} [additional_reviewers]
 * @property {string[]} [skip_standard_reviews]
 * @property {string[]} [custom_workflow_steps]
 */

/**
 * @typedef {object} CampaignGuardrails
 * @property {string} id
 * @property {string} campaign_id
 * @property {string} brand_id
 * @property {string[]} [custom_key_messages] - Messaging customizations
 * @property {MessagePriorityOverrides} [message_priority_overrides]
 * @property {ToneOverrides} [tone_overrides] - Tone adjustments
 * @property {Object.<string, AudienceSpecificToneDetail>} [audience_specific_tone]
 * @property {string[]} [competitive_focus] - Competitive focus
 * @property {string[]} [competitive_messaging_emphasis]
 * @property {MarketSpecificRules} [market_specific_rules] - Market and regulatory
 * @property {RegulatoryAdditions} [regulatory_additions]
 * @property {MLRDeadlineRequirements} [mlr_deadline_requirements] - Timeline constraints
 * @property {ApprovalProcessOverrides} [approval_process_overrides]
 * @property {boolean} inherits_from_brand - Inheritance
 * @property {OverrideLevel} override_level
 * @property {string} [customization_rationale]
 * @property {string} created_at - Audit
 * @property {string} updated_at
 * @property {string} [created_by]
 * @property {string} [updated_by]
 */


// --- Asset-Level Guardrails ---

/**
 * @typedef {object} ToneAdjustments
 * @property {string} [primary]
 * @property {string} [secondary]
 * @property {string[]} [descriptors]
 * @property {Object.<string, string>} [context_specific] - e.g., "subject_line": "urgent"
 */

/**
 * @typedef {object} ChannelRequirementDetail
 * @property {Object.<string, number>} [character_limits] - Key is the field name (e.g., 'title', 'body')
 * @property {string[]} [format_requirements]
 * @property {string[]} [visual_constraints]
 */

/**
 * @typedef {object} FormatConstraints
 * @property {number} [max_length]
 * @property {number} [min_length]
 * @property {string[]} [required_sections]
 * @property {string[]} [prohibited_elements]
 */

/**
 * @typedef {object} CharacterLimits
 * @property {number} [subject]
 * @property {number} [headline]
 * @property {number} [body]
 * @property {number} [cta]
 */

/**
 * @typedef {object} VisualRequirements
 * @property {string[]} [image_specs]
 * @property {string} [logo_placement]
 * @property {string[]} [color_usage]
 * @property {string[]} [typography_rules]
 */

/**
 * @typedef {object} RegulatoryPlacementRules
 * @property {'header' | 'footer' | 'sidebar' | 'inline'} [disclaimer_placement]
 * @property {string[]} [fair_balance_requirements]
 * @property {'high' | 'medium' | 'standard'} [safety_info_prominence]
 */

/**
 * @typedef {object} DisclaimerRequirements
 * @property {string[]} [required_disclaimers]
 * @property {string[]} [placement_rules]
 * @property {string} [font_size_requirements]
 */

/**
 * @typedef {object} ReviewWorkflowOverrides
 * @property {string[]} [additional_review_steps]
 * @property {string[]} [expedited_review_triggers]
 * @property {string[]} [approval_requirements]
 */

/**
 * @typedef {object} ApprovalRequirements
 * @property {string[]} [required_approvers]
 * @property {string[]} [approval_sequence]
 * @property {string[]} [escalation_rules]
 */

/**
 * @typedef {object} ABTestingGuidelines
 * @property {string[]} [test_variations]
 * @property {string[]} [success_metrics]
 * @property {string[]} [statistical_requirements]
 */

/**
 * @typedef {object} EngagementTargets
 * @property {number} [open_rate]
 * @property {number} [click_rate]
 * @property {number} [conversion_rate]
 */

/**
 * @typedef {object} AssetGuardrails
 * @property {string} id
 * @property {string} asset_id
 * @property {string} [campaign_id]
 * @property {string} brand_id
 * @property {string} asset_type
 * @property {string[]} [message_customizations] - Message refinements
 * @property {ToneAdjustments} [tone_adjustments]
 * @property {Object.<string, ChannelRequirementDetail>} [channel_requirements] - Channel and format rules
 * @property {FormatConstraints} [format_constraints]
 * @property {CharacterLimits} [character_limits]
 * @property {VisualRequirements} [visual_requirements]
 * @property {RegulatoryPlacementRules} [regulatory_placement_rules] - Regulatory placement
 * @property {DisclaimerRequirements} [disclaimer_requirements]
 * @property {ReviewWorkflowOverrides} [review_workflow_overrides] - Review process
 * @property {ApprovalRequirements} [approval_requirements]
 * @property {ABTestingGuidelines} [ab_testing_guidelines] - Performance optimization
 * @property {EngagementTargets} [engagement_targets]
 * @property {boolean} inherits_from_campaign - Inheritance
 * @property {boolean} inherits_from_brand
 * @property {OverrideLevel} override_level
 * @property {string} [customization_rationale]
 * @property {string} created_at - Audit
 * @property {string} updated_at
 * @property {string} [created_by]
 * @property {string} [updated_by]
 */


// --- Inheritance tracking ---

/**
 * @typedef {object} GuardrailInheritance
 * @property {string} id
 * @property {'brand' | 'campaign' | 'asset'} context_type
 * @property {string} context_id
 * @property {'brand' | 'campaign'} source_type
 * @property {string} source_id
 * @property {RuleCategory} rule_category
 * @property {string} rule_key
 * @property {boolean} is_inherited
 * @property {boolean} is_overridden
 * @property {string} [override_reason]
 * @property {string} created_at
 * @property {string} updated_at
 */


// --- Compliance history ---

/**
 * @typedef {object} ComplianceDetails
 * @property {Object.<string, any>} [brand_level]
 * @property {Object.<string, any>} [campaign_level]
 * @property {Object.<string, any>} [asset_level]
 */

/**
 * @typedef {object} OverrideDetail
 * @property {any} original_value
 * @property {any} override_value
 * @property {string} reason
 * @property {string} [approved_by]
 */

/**
 * @typedef {object} ComplianceHistory
 * @property {string} id
 * @property {string} content_id
 * @property {'campaign' | 'asset'} content_type
 * @property {number} [brand_compliance_score] - Compliance scores
 * @property {number} [campaign_compliance_score]
 * @property {number} [asset_compliance_score]
 * @property {number} [overall_compliance_score]
 * @property {ComplianceDetails} [compliance_details] - Detailed results
 * @property {string[]} [suggestions]
 * @property {string[]} [warnings]
 * @property {string[]} [critical_issues]
 * @property {boolean} has_overrides - Override information
 * @property {Object.<string, OverrideDetail>} [override_details] - Key is ruleId
 * @property {string} [approved_by]
 * @property {string} [approval_timestamp]
 * @property {string} checked_at - Context
 * @property {string} [checked_by]
 * @property {string} [guardrails_version]
 */


// --- Merged guardrails result ---

/**
 * @typedef {object} EffectiveToneGuidelines
 * @property {string} primary
 * @property {string} secondary
 * @property {string[]} descriptors
 */

/**
 * @typedef {object} RegulatoryMusts
 * @property {string[]} disclaimers
 * @property {string[]} warnings
 * @property {string[]} required_language
 */

/**
 * @typedef {object} VisualStandards
 * @property {string} logo_usage
 * @property {string} color_guidelines
 * @property {string} imagery_style
 */

/**
 * @typedef {object} EffectiveFormatConstraints
 * @property {Object.<string, number>} character_limits
 * @property {string[]} required_sections
 * @property {string[]} prohibited_elements
 */

/**
 * @typedef {object} EffectiveRules
 * @property {string[]} key_messages
 * @property {EffectiveToneGuidelines} tone_guidelines
 * @property {string[]} content_dos
 * @property {string[]} content_donts
 * @property {RegulatoryMusts} regulatory_musts
 * @property {VisualStandards} visual_standards
 * @property {string[]} competitive_advantages
 * @property {string} market_positioning
 * @property {EffectiveFormatConstraints} [format_constraints] - Asset-specific effective rules
 * @property {Object.<string, any>} [channel_requirements] - Key is channel name
 */

/**
 * @typedef {object} RuleSourceDetail
 * @property {GuardrailLevel} source_level
 * @property {string} source_id
 * @property {boolean} is_override
 * @property {string} [override_reason]
 */

/**
 * @typedef {object} InheritanceChainItem
 * @property {GuardrailLevel} level
 * @property {string} id
 * @property {string} name
 * @property {boolean} has_customizations
 */

/**
 * @typedef {object} MergedGuardrails
 * @property {any} brand - Original BrandGuardrails
 * @property {CampaignGuardrails} [campaign]
 * @property {AssetGuardrails} [asset]
 * @property {EffectiveRules} effective_rules - Effective rules (merged result)
 * @property {Object.<string, RuleSourceDetail>} rule_sources - Key is ruleKey
 * @property {InheritanceChainItem[]} inheritance_chain
 */


// --- Enhanced compliance check result ---

/**
 * @typedef {object} LevelComplianceDetails
 * @property {number} score
 * @property {string[]} suggestions
 * @property {string[]} warnings
 */

/**
 * @typedef {object} BrandComplianceDetails
 * @augments LevelComplianceDetails
 * @property {boolean} tone_match
 * @property {boolean} key_message_alignment
 * @property {boolean} regulatory_compliance
 */

/**
 * @typedef {object} CampaignComplianceDetails
 * @augments LevelComplianceDetails
 * @property {boolean} message_priority_adherence
 * @property {boolean} audience_tone_match
 * @property {boolean} competitive_positioning
 */

/**
 * @typedef {object} AssetComplianceDetails
 * @augments LevelComplianceDetails
 * @property {boolean} format_adherence
 * @property {boolean} character_limit_compliance
 * @property {boolean} channel_requirements_met
 * @property {boolean} regulatory_placement_correct
 */

/**
 * @typedef {object} CriticalIssue
 * @property {GuardrailLevel} level
 * @property {RuleCategory} category
 * @property {string} message
 * @property {'low' | 'medium' | 'high' | 'critical'} severity
 */

/**
 * @typedef {object} RecommendedAction
 * @property {number} priority - 1-5, 1 being highest
 * @property {string} action
 * @property {RuleCategory} category
 * @property {GuardrailLevel} level
 */

/**
 * @typedef {object} PerformancePrediction
 * @property {number} mlr_approval_likelihood - 0-100
 * @property {number} estimated_review_cycles
 * @property {string[]} risk_factors
 */

/**
 * @typedef {object} EnhancedContentComplianceCheck
 * @property {number} overall_score - 0-100
 * @property {BrandComplianceDetails} brand_compliance - Level-specific scores
 * @property {CampaignComplianceDetails} [campaign_compliance]
 * @property {AssetComplianceDetails} [asset_compliance]
 * @property {CriticalIssue[]} critical_issues - Critical issues that must be addressed
 * @property {RecommendedAction[]} recommended_actions - Recommended actions
 * @property {PerformancePrediction} [performance_prediction] - Performance prediction
 */