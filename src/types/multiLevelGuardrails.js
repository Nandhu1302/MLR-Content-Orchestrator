/**
 * Multi-Level Guardrails JSDoc typedefs (converted from TypeScript)
 */

/** @typedef {'brand'|'campaign'|'asset'} GuardrailLevel */
/** @typedef {'campaign'|'asset'|'campaign_override'|'brand_override'|'full_override'} OverrideLevel */
/** @typedef {'messaging'|'tone'|'competitive'|'regulatory'|'visual'|'format'|'review'} RuleCategory */

/**
 * @typedef {Object} CampaignGuardrails
 * @property {string} id
 * @property {string} campaign_id
 * @property {string} brand_id
 * @property {string[]=} custom_key_messages
 * @property {Object.<string,number>=} message_priority_overrides
 * @property {{primary?:string,secondary?:string,descriptors?:string[]=}=} tone_overrides
 * @property {Object.<string,{primary:string,secondary:string,descriptors:string[]}>=} audience_specific_tone
 * @property {string[]=} competitive_focus
 * @property {string[]=} competitive_messaging_emphasis
 * @property {Object.<string,{compliance_requirements:string[],regulatory_additions:string[],local_guidelines?:string}>=} market_specific_rules
 * @property {{disclaimers?:string[],warnings?:string[],required_language?:string[]=}=} regulatory_additions
 * @property {{standard_timeline_days:number,expedited_timeline_days:number,critical_path_requirements:string[]}=} mlr_deadline_requirements
 * @property {{additional_reviewers?:string[],skip_standard_reviews?:string[],custom_workflow_steps?:string[]}=} approval_process_overrides
 * @property {boolean} inherits_from_brand
 * @property {OverrideLevel} override_level
 * @property {string=} customization_rationale
 * @property {string} created_at
 * @property {string} updated_at
 * @property {string=} created_by
 * @property {string=} updated_by
 */

/**
 * @typedef {Object} AssetGuardrails
 * @property {string} id
 * @property {string} asset_id
 * @property {string=} campaign_id
 * @property {string} brand_id
 * @property {string} asset_type
 * @property {string[]=} message_customizations
 * @property {{primary?:string,secondary?:string,descriptors?:string[],context_specific?:Object.<string,string>=}=} tone_adjustments
 * @property {Object.<string,{character_limits?:Object.<string,number>,format_requirements?:string[],visual_constraints?:string[]}>=} channel_requirements
 * @property {{max_length?:number,min_length?:number,required_sections?:string[],prohibited_elements?:string[]=}=} format_constraints
 * @property {{subject?:number,headline?:number,body?:number,cta?:number}=} character_limits
 * @property {{image_specs?:string[],logo_placement?:string,color_usage?:string[],typography_rules?:string[]}=} visual_requirements
 * @property {{disclaimer_placement?:('header'|'footer'|'sidebar'|'inline'),fair_balance_requirements?:string[],safety_info_prominence?:('high'|'medium'|'standard')}=} regulatory_placement_rules
 * @property {{required_disclaimers?:string[],placement_rules?:string[],font_size_requirements?:string}=} disclaimer_requirements
 * @property {{additional_review_steps?:string[],expedited_review_triggers?:string[],approval_requirements?:string[]=}=} review_workflow_overrides
 * @property {{required_approvers?:string[],approval_sequence?:string[],escalation_rules?:string[]=}=} approval_requirements
 * @property {{test_variations?:string[],success_metrics?:string[],statistical_requirements?:string}=} ab_testing_guidelines
 * @property {{open_rate?:number,click_rate?:number,conversion_rate?:number}=} engagement_targets
 * @property {boolean} inherits_from_campaign
 * @property {boolean} inherits_from_brand
 * @property {OverrideLevel} override_level
 * @property {string=} customization_rationale
 * @property {string} created_at
 * @property {string} updated_at
 * @property {string=} created_by
 * @property {string=} updated_by
 */

/**
 * @typedef {Object} GuardrailInheritance
 * @property {string} id
 * @property {'brand'|'campaign'|'asset'} context_type
 * @property {string} context_id
 * @property {'brand'|'campaign'} source_type
 * @property {string} source_id
 * @property {RuleCategory} rule_category
 * @property {string} rule_key
 * @property {boolean} is_inherited
 * @property {boolean} is_overridden
 * @property {string=} override_reason
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} ComplianceHistory
 * @property {string} id
 * @property {string} content_id
 * @property {'campaign'|'asset'} content_type
 * @property {number=} brand_compliance_score
 * @property {number=} campaign_compliance_score
 * @property {number=} asset_compliance_score
 * @property {number=} overall_compliance_score
 * @property {Object=} compliance_details
 * @property {string[]=} suggestions
 * @property {string[]=} warnings
 * @property {string[]=} critical_issues
 * @property {boolean} has_overrides
 * @property {Object.<string,{original_value:any,override_value:any,reason:string,approved_by?:string}>=} override_details
 * @property {string=} approved_by
 * @property {string=} approval_timestamp
 * @property {string} checked_at
 * @property {string=} checked_by
 * @property {string=} guardrails_version
 */

/**
 * @typedef {Object} MergedGuardrails
 * @property {any} brand
 * @property {CampaignGuardrails=} campaign
 * @property {AssetGuardrails=} asset
 * @property {Object} effective_rules
 * @property {string[]=} effective_rules.key_messages
 * @property {{primary:string,secondary:string,descriptors:string[]=}=} effective_rules.tone_guidelines
 * @property {string[]=} effective_rules.content_dos
 * @property {string[]=} effective_rules.content_donts
 * @property {{disclaimers:string[],warnings:string[],required_language:string[]=}=} effective_rules.regulatory_musts
 * @property {{logo_usage:string,color_guidelines:string,imagery_style:string}=} effective_rules.visual_standards
 * @property {string[]=} effective_rules.competitive_advantages
 * @property {string=} effective_rules.market_positioning
 * @property {Object.<string,any>=} effective_rules.format_constraints
 * @property {Object.<string,any>=} effective_rules.channel_requirements
 * @property {Object.<string,{source_level:GuardrailLevel,source_id:string,is_override:boolean,override_reason?:string}>} rule_sources
 * @property {Array.<{level:GuardrailLevel,id:string,name?:string,has_customizations:boolean}>} inheritance_chain
 */

/**
 * @typedef {Object} EnhancedContentComplianceCheck
 * @property {number} overall_score
 * @property {Object} brand_compliance
 * @property {number} brand_compliance.score
 * @property {boolean} brand_compliance.tone_match
 * @property {boolean} brand_compliance.key_message_alignment
 * @property {boolean} brand_compliance.regulatory_compliance
 * @property {string[]=} brand_compliance.suggestions
 * @property {string[]=} brand_compliance.warnings
 * @property {Object=} campaign_compliance
 * @property {number=} campaign_compliance.score
 * @property {boolean=} campaign_compliance.message_priority_adherence
 * @property {boolean=} campaign_compliance.audience_tone_match
 * @property {boolean=} campaign_compliance.competitive_positioning
 * @property {string[]=} campaign_compliance.suggestions
 * @property {string[]=} campaign_compliance.warnings
 * @property {Object=} asset_compliance
 * @property {number=} asset_compliance.score
 * @property {boolean=} asset_compliance.format_adherence
 * @property {boolean=} asset_compliance.character_limit_compliance
 * @property {boolean=} asset_compliance.channel_requirements_met
 * @property {boolean=} asset_compliance.regulatory_placement_correct
 * @property {string[]=} asset_compliance.suggestions
 * @property {string[]=} asset_compliance.warnings
 * @property {Array.<{level:GuardrailLevel,category:RuleCategory,message:string,severity:('low'|'medium'|'high'|'critical')}>} critical_issues
 * @property {Array.<{priority:number,action:string,category:RuleCategory,level:GuardrailLevel}>} recommended_actions
 * @property {Object=} performance_prediction
 * @property {number=} performance_prediction.mlr_approval_likelihood
 * @property {number=} performance_prediction.estimated_review_cycles
 * @property {string[]=} performance_prediction.risk_factors
 */

/*
  JSDoc typedefs replace TypeScript interfaces so editors still get type hints in plain JavaScript.
*/

export default {};