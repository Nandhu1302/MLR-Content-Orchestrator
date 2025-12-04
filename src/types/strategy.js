/**
 * @typedef {'draft'|'active'|'archived'|'deprecated'} ThemeStatus
 * @typedef {'clinical-evidence'|'patient-journey'|'market-access'|'competitive-positioning'|'safety-focused'} ThemeCategory
 * @typedef {'selected'|'active'|'completed'|'paused'} CampaignThemeStatus
 * @typedef {'planned'|'in-production'|'review'|'approved'|'published'|'archived'} AssetThemeStatus
 * @typedef {'campaign'|'single-asset'|'test'|'comparison'} UsageType
 * @typedef {'campaign'|'asset'|'test'} ImplementationType
 */

/**
 * @typedef {Object} ThemePerformancePrediction
 * @property {number} success_probability
 * @property {number} engagement_rate
 * @property {number} mlr_approval_rate
 * @property {number} expected_reach
 * @property {number} competitive_advantage
 * @property {number} roi_estimate
 * @property {number} time_to_market
 * @property {number} risk_score
 * @property {Object} confidence_intervals
 * @property {[number, number]} confidence_intervals.success_probability
 * @property {[number, number]} confidence_intervals.engagement_rate
 * @property {[number, number]} confidence_intervals.roi_estimate
 */

/**
 * @typedef {Object} ThemeRationale
 * @property {string} primary_insight
 * @property {string[]} supporting_data
 * @property {string[]} historical_evidence
 * @property {string[]} risk_factors
 * @property {string[]} recommendations
 * @property {string} ai_reasoning
 * @property {number} data_quality_score
 * @property {'low'|'medium'|'high'} evidence_strength
 */

/**
 * @typedef {Object} ContentSuggestions
 * @property {string[]} headlines
 * @property {string[]} key_points
 * @property {string[]} visual_elements
 * @property {string} narrative_structure
 * @property {string[]} emotional_hooks
 * @property {string[]} proof_points
 */

/**
 * @typedef {Object} MessagingFramework
 * @property {string} primary_message
 * @property {string[]} supporting_messages
 * @property {string[]} message_hierarchy
 * @property {string} tone_guidance
 * @property {string[]} do_not_use
 * @property {string[]} competitive_differentiators
 */

/**
 * @typedef {Object} RegulatoryConsideration
 * @property {'disclaimer'|'warning'|'restriction'|'requirement'} type
 * @property {string} description
 * @property {string[]} markets
 * @property {'low'|'medium'|'high'|'critical'} severity
 * @property {string} compliance_note
 */

/**
 * @typedef {Object} ThemeLibraryEntry
 * @property {string} id
 * @property {string} brand_id
 * @property {string} name
 * @property {string} description
 * @property {ThemeCategory} category
 * @property {string} key_message
 * @property {string} [call_to_action]
 * @property {ThemeRationale} rationale
 * @property {ThemePerformancePrediction} performance_prediction
 * @property {string[]} data_sources
 * @property {number} confidence_score
 * @property {string} [target_audience]
 * @property {string[]} audience_segments
 * @property {string[]} target_markets
 * @property {string} [indication]
 * @property {ContentSuggestions} content_suggestions
 * @property {MessagingFramework} messaging_framework
 * @property {RegulatoryConsideration[]} regulatory_considerations
 * @property {ThemeStatus} status
 * @property {number} version
 * @property {string} [parent_theme_id]
 * @property {'generated'|'ready-for-use'} [enrichment_status]
 * @property {any} [intelligence_layers]
 * @property {number} [intelligence_progress]
 * @property {any[]} [workshop_notes]
 * @property {Date} [approved_at]
 * @property {string} [approved_by]
 * @property {number} usage_count
 * @property {number} success_rate
 * @property {number} avg_engagement_rate
 * @property {Date} [last_used_at]
 * @property {string} [source_intake_id]
 * @property {string} [source_campaign_id]
 * @property {string} [original_project_name]
 * @property {Date} created_at
 * @property {Date} updated_at
 * @property {string} [created_by]
 * @property {string} [updated_by]
 */

/**
 * @typedef {Object} CampaignTheme
 * @property {string} id
 * @property {string} campaign_id
 * @property {string} theme_id
 * @property {string} brand_id
 * @property {string} [selection_reason]
 * @property {Object.<string, any>} customizations
 * @property {Object.<string, any>} performance_target
 * @property {CampaignThemeStatus} status
 * @property {Date} selected_at
 * @property {Date} [activated_at]
 * @property {Date} [completed_at]
 * @property {Object.<string, any>} actual_performance
 * @property {Object.<string, any>} roi_data
 * @property {Date} created_at
 * @property {Date} updated_at
 * @property {string} [created_by]
 * @property {ThemeLibraryEntry} [theme]
 */

/**
 * @typedef {Object} AssetTheme
 * @property {string} id
 * @property {string} asset_id
 * @property {string} theme_id
 * @property {string} [campaign_theme_id]
 * @property {string} brand_id
 * @property {string} asset_type
 * @property {Object.<string, any>} theme_adaptations
 * @property {Object.<string, any>} content_variations
 * @property {Object.<string, any>} performance_metrics
 * @property {Object.<string, any>} engagement_data
 * @property {Object.<string, any>} conversion_data
 * @property {AssetThemeStatus} status
 * @property {Date} created_at
 * @property {Date} updated_at
 * @property {string} [created_by]
 * @property {ThemeLibraryEntry} [theme]
 */

/**
 * @typedef {Object} ThemeAnalytics
 * @property {string} id
 * @property {string} theme_id
 * @property {string} brand_id
 * @property {ImplementationType} implementation_type
 * @property {string} implementation_id
 * @property {string} [asset_type]
 * @property {string} [audience_segment]
 * @property {string} [market]
 * @property {Object.<string, any>} predicted_performance
 * @property {Object.<string, any>} actual_performance
 * @property {Object.<string, any>} engagement_metrics
 * @property {Object.<string, any>} conversion_metrics
 * @property {Object.<string, any>} mlr_performance
 * @property {Object.<string, any>} benchmark_performance
 * @property {Object.<string, any>} competitor_comparison
 * @property {Object.<string, any>} variant_testing_results
 * @property {Object.<string, any>} performance_by_period
 * @property {Object.<string, any>} seasonal_trends
 * @property {Object.<string, any>} user_feedback
 * @property {Object.<string, any>} ai_learning_points
 * @property {string[]} improvement_suggestions
 * @property {Date} [measurement_period_start]
 * @property {Date} [measurement_period_end]
 * @property {Date} created_at
 * @property {Date} updated_at
 * @property {string} [measured_by]
 */

/**
 * @typedef {Object} SideBySideAnalysis
 * @property {Object.<string, {theme_a: any, theme_b: any, advantage: 'theme_a'|'theme_b'|'neutral'}>} performance_comparison
 * @property {Object.<string, {theme_a: string, theme_b: string, preference: 'theme_a'|'theme_b'|'neutral'}>} content_analysis
 * @property {Object.<string, {theme_a: number, theme_b: number, winner: 'theme_a'|'theme_b'|'tie'}>} strategic_fit
 */

/**
 * @typedef {Object} PerformanceDelta
 * @property {number} success_probability_diff
 * @property {number} engagement_diff
 * @property {number} roi_diff
 * @property {number} risk_diff
 * @property {number} confidence_diff
 * @property {number} overall_score_diff
 */

/**
 * @typedef {Object} ProsConsAnalysisItem
 * @property {string[]} pros
 * @property {string[]} cons
 * @property {string[]} unique_advantages
 * @property {string[]} potential_issues
 */

/**
 * @typedef {Object} ProsConsAnalysis
 * @property {ProsConsAnalysisItem} theme_a
 * @property {ProsConsAnalysisItem} theme_b
 */

/**
 * @typedef {Object} RiskFactor
 * @property {'regulatory'|'market'|'competitive'|'execution'|'performance'} type
 * @property {string} description
 * @property {'low'|'medium'|'high'|'critical'} severity
 * @property {number} likelihood
 * @property {number} impact
 * @property {string} mitigation
 */

/**
 * @typedef {Object} RiskAssessment
 * @property {RiskFactor[]} theme_a_risks
 * @property {RiskFactor[]} theme_b_risks
 * @property {string} comparative_risk_analysis
 * @property {Object.<string, string[]>} mitigation_strategies
 */

/**
 * @typedef {Object} ThemeComparison
 * @property {string} id
 * @property {string} brand_id
 * @property {string} [comparison_name]
 * @property {string} [project_context]
 * @property {string[]} comparison_criteria
 * @property {string} theme_a_id
 * @property {string} theme_b_id
 * @property {SideBySideAnalysis} side_by_side_analysis
 * @property {PerformanceDelta} performance_delta
 * @property {ProsConsAnalysis} pros_cons_analysis
 * @property {RiskAssessment} risk_assessment
 * @property {string} [selected_theme_id]
 * @property {string} [selection_rationale]
 * @property {string[]} decision_factors
 * @property {number} [confidence_level]
 * @property {string} [post_decision_notes]
 * @property {Object.<string, any>} outcome_validation
 * @property {string[]} lessons_learned
 * @property {Date} created_at
 * @property {Date} updated_at
 * @property {string} [created_by]
 * @property {Date} [decided_at]
 * @property {ThemeLibraryEntry} [theme_a]
 * @property {ThemeLibraryEntry} [theme_b]
 * @property {ThemeLibraryEntry} [selected_theme]
 */

/**
 * @typedef {Object} ThemeUsageHistory
 * @property {string} id
 * @property {string} theme_id
 * @property {string} brand_id
 * @property {UsageType} usage_type
 * @property {string} project_id
 * @property {string} project_name
 * @property {string} [project_type]
 * @property {Object.<string, any>} customizations_made
 * @property {string} [adaptation_reason]
 * @property {Object.<string, any>} success_metrics
 * @property {string[]} failure_points
 * @property {boolean} [overall_success]
 * @property {number} [success_score]
 * @property {string[]} key_learnings
 * @property {Date} used_at
 * @property {Date} [completed_at]
 * @property {string} [created_by]
 */

/**
 * @typedef {Object} ThemeSearchFilters
 * @property {string} [brand_id]
 * @property {ThemeCategory[]} [category]
 * @property {ThemeStatus[]} [status]
 * @property {string[]} [audience]
 * @property {string[]} [markets]
 * @property {string[]} [indication]
 * @property {number} [min_confidence]
 * @property {number} [min_success_rate]
 * @property {{start: Date, end: Date}} [date_range]
 * @property {{min: number, max: number}} [usage_count_range]
 * @property {string} [search_text]
 */

/**
 * @typedef {Object} ThemeSearchResult
 * @property {ThemeLibraryEntry[]} themes
 * @property {number} total_count
 * @property {Object} facets
 * @property {{category: ThemeCategory, count: number}[]} facets.categories
 * @property {{audience: string, count: number}[]} facets.audiences
 * @property {{market: string, count: number}[]} facets.markets
 * @property {{indication: string, count: number}[]} facets.indications
 * @property {string[]} suggestions
 */

/**
 * @typedef {Object} ThemeRecommendationRequest
 * @property {string} brand_id
 * @property {Object} project_context
 * @property {string} project_context.name
 * @property {'campaign'|'single-asset'} project_context.type
 * @property {string} project_context.audience
 * @property {string[]} project_context.markets
 * @property {string} [project_context.indication]
 * @property {string[]} project_context.objectives
 * @property {string[]} [exclude_theme_ids]
 * @property {number} [max_results]
 * @property {boolean} [include_archived]
 */

/**
 * @typedef {Object} ThemeRecommendation
 * @property {ThemeLibraryEntry} theme
 * @property {number} relevance_score
 * @property {string} recommendation_reason
 * @property {string[]} similarity_factors
 * @property {string[]} adaptation_suggestions
 * @property {string[]} risk_considerations
 */

/**
 * @typedef {Object} StrategyInsightsDashboard
 * @property {Object} summary_stats
 * @property {number} summary_stats.total_themes
 * @property {number} summary_stats.active_themes
 * @property {number} summary_stats.total_usage
 * @property {number} summary_stats.avg_success_rate
 * @property {number} summary_stats.themes_this_month
 * @property {number} summary_stats.usage_this_month
 * @property {Array.<Object>} performance_trends
 * @property {Array.<Object>} category_distribution
 * @property {ThemeLibraryEntry[]} top_performing_themes
 * @property {ThemeComparison[]} recent_comparisons
 * @property {Array.<Object>} usage_by_type
 */

export default {};