/**
 * @typedef {import('./content').PersonalizationFactors} PersonalizationFactors
 */

/**
 * @typedef {Object} LayoutZone
 * @property {string} id
 * @property {string} name
 * @property {'headline'|'subheadline'|'body'|'image'|'cta'|'isi'|'logo'} type
 * @property {{x:number,y:number,width:number,height:number}} position
 * @property {{maxCharacters?:number, required:boolean, editable:boolean}} constraints
 */

/**
 * @typedef {Object} LayoutConfiguration
 * @property {LayoutZone[]} zones
 * @property {{width:number,height:number}} dimensions
 * @property {'single-column'|'two-column'|'grid'} structure
 * @property {'portrait'|'landscape'|'square'} orientation
 */

/**
 * @typedef {Object} AudienceVariationConfig
 * @property {'hcp'|'patient'} audience_type
 * @property {string} sub_segment
 * @property {{imagery:'clinical'|'lifestyle'|'abstract'|'educational', complexity:'simple'|'moderate'|'detailed', tone:'warm'|'professional'|'scientific'}} visual_style
 * @property {'image-first'|'text-first'|'balanced'} layout_preference
 */

/**
 * @typedef {Object} LayoutVariationConfig
 * @property {string} variation_id
 * @property {string} name
 * @property {'hero-top'|'hero-side'|'grid'|'minimal'} layout_type
 * @property {'primary'|'secondary'|'neutral'} color_emphasis
 * @property {'top'|'middle'|'bottom'|'floating'} cta_placement
 * @property {'sidebar'|'footer'|'accordion'} fair_balance_layout
 */

/**
 * @typedef {Object} ChannelVariationConfig
 * @property {string} channel
 * @property {string} format
 * @property {{width:number,height:number}} dimensions
 * @property {boolean} responsive
 */

/**
 * @typedef {Object} VariationCapabilities
 * @property {AudienceVariationConfig[]} audienceAdaptations
 * @property {LayoutVariationConfig[]} layoutOptimizations
 * @property {ChannelVariationConfig[]} channelAdaptations
 */

/**
 * @typedef {Object} RegulatoryZone
 * @property {'isi'|'fair_balance'|'boxed_warning'|'disclaimer'} type
 * @property {'fixed'|'flexible'} placement
 * @property {{width:number,height:number}} minSize
 * @property {boolean} required
 */

/**
 * @typedef {Object} BrandRequirements
 * @property {string[]} colorPalette
 * @property {{headingFont:string, bodyFont:string, weights:string[]}} typography
 * @property {{min:number, preferred:number}} spacing
 * @property {RegulatoryZone[]} regulatoryZones
 */

/**
 * @typedef {Object} PerformanceHistory
 * @property {number} avgEngagement
 * @property {string[]} topPerformingVariations
 * @property {Object.<string, number>} audienceResonance
 */

/**
 * @typedef {Object} VisualAdaptations
 * @property {'primary'|'secondary'|'neutral'} colorScheme
 * @property {'image-first'|'text-first'|'balanced'} layoutPriority
 * @property {'button'|'text-link'|'banner'} ctaStyle
 * @property {'sidebar'|'footer'|'accordion'} fairBalancePlacement
 */

/**
 * @typedef {Object} DesignTemplate
 * @property {string} id
 * @property {string} brand_id
 * @property {string} template_name
 * @property {'email'|'web'|'social'|'dsa'} template_category
 * @property {string} asset_type
 * @property {LayoutConfiguration} base_layout
 * @property {VariationCapabilities} variation_capabilities
 * @property {BrandRequirements} brand_requirements
 * @property {PerformanceHistory} performance_history
 * @property {string} [thumbnail_url]
 * @property {string} [description]
 * @property {string[]} [tags]
 * @property {boolean} is_active
 * @property {string} created_at
 * @property {string} updated_at
 * @property {string} [created_by]
 */

/**
 * @typedef {Object} TemplateVariation
 * @property {string} id
 * @property {string} template_id
 * @property {string} variation_name
 * @property {'audience'|'layout'|'channel'|'ab_test'} variation_type
 * @property {PersonalizationFactors} [personalization_factors]
 * @property {LayoutConfiguration} layout_config
 * @property {VisualAdaptations} visual_adaptations
 * @property {number} performance_score
 * @property {number} usage_count
 * @property {string} [last_used_at]
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} ComplianceValidation
 * @property {boolean} colorCompliance
 * @property {boolean} typographyCompliance
 * @property {boolean} spacingCompliance
 * @property {boolean} regulatoryCompliance
 * @property {string[]} issues
 */

/**
 * @typedef {Object} DesignProject
 * @property {string} id
 * @property {string} content_asset_id
 * @property {string} [content_variation_id]
 * @property {string} project_id
 * @property {string} brand_id
 * @property {string} [selected_template_id]
 * @property {string} [selected_variation_id]
 * @property {any} canvas_state
 * @property {Object.<string,string>} content_mapping
 * @property {ComplianceValidation} compliance_validation
 * @property {'draft'|'in_progress'|'ready_for_handoff'|'sent_to_agency'} status
 * @property {string} [agency_handoff_id]
 * @property {string} created_at
 * @property {string} updated_at
 * @property {string} [created_by]
 */

/**
 * @typedef {Object} TemplateRecommendation
 * @property {DesignTemplate} template
 * @property {number} score
 * @property {string[]} reasoning
 * @property {PersonalizationFactors} [matchedFactors]
 */

/*
  JSDoc typedefs replace TypeScript interfaces so editors still get type hints in plain JavaScript.
*/

export default {};