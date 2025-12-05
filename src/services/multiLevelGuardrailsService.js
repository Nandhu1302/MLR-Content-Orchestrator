import { supabase } from '@/integrations/supabase/client';

/**
 * @typedef {Object} BrandGuardrails
 * @property {string} id
 * @property {Array<any>} key_messages
 * @property {Object} tone_guidelines
 * @property {Array<any>} content_dos
 * @property {Array<any>} content_donts
 * @property {Object} regulatory_musts
 * @property {Array<any>} visual_standards
 * @property {Array<any>} competitive_advantages
 * @property {Object} market_positioning
 */

/**
 * @typedef {Object} CampaignGuardrails
 * @property {string} id
 * @property {string} campaign_id
 * @property {string} brand_id
 * @property {Array<any>} [custom_key_messages]
 * @property {Object.<string, number>} [message_priority_overrides]
 * @property {Object} [tone_overrides]
 * @property {Object} [audience_specific_tone]
 * @property {Array<any>} [competitive_focus]
 * @property {string} [competitive_messaging_emphasis]
 * @property {Object} [market_specific_rules]
 * @property {Object} [regulatory_additions]
 * @property {Object} [mlr_deadline_requirements]
 * @property {Object} [approval_process_overrides]
 * @property {boolean} [inherits_from_brand]
 * @property {string} [override_level]
 * @property {string} [customization_rationale]
 * @property {string} [created_at]
 * @property {string} [updated_at]
 * @property {string} [created_by]
 * @property {string} [updated_by]
 */

/**
 * @typedef {Object} AssetGuardrails
 * @property {string} id
 * @property {string} asset_id
 * @property {string} [campaign_id]
 * @property {string} brand_id
 * @property {string} asset_type
 * @property {Array<any>} [message_customizations]
 * @property {Object} [tone_adjustments]
 * @property {Object} [channel_requirements]
 * @property {Object} [format_constraints]
 * @property {Object} [character_limits]
 * @property {Object} [visual_requirements]
 * @property {Object} [regulatory_placement_rules]
 * @property {Object} [disclaimer_requirements]
 * @property {Object} [review_workflow_overrides]
 * @property {Object} [approval_requirements]
 * @property {Object} [ab_testing_guidelines]
 * @property {Object} [engagement_targets]
 * @property {boolean} [inherits_from_campaign]
 * @property {boolean} [inherits_from_brand]
 * @property {string} [override_level]
 * @property {string} [customization_rationale]
 * @property {string} [created_at]
 * @property {string} [updated_at]
 * @property {string} [created_by]
 * @property {string} [updated_by]
 */

/**
 * @typedef {'brand' | 'campaign' | 'asset'} GuardrailLevel
 * @typedef {'messaging' | 'regulatory' | 'tone' | 'format'} RuleCategory
 */

/**
 * @typedef {Object} GuardrailInheritance
 * @property {GuardrailLevel} level
 * @property {string} id
 * @property {string} name
 * @property {boolean} has_customizations
 */

/**
 * @typedef {Object} MergedRules
 * @property {Array<any>} key_messages
 * @property {Object} tone_guidelines
 * @property {Array<any>} content_dos
 * @property {Array<any>} content_donts
 * @property {Object} regulatory_musts
 * @property {Array<any>} visual_standards
 * @property {Array<any>} competitive_advantages
 * @property {Object} market_positioning
 * @property {Object} [format_constraints]
 * @property {Object} [channel_requirements]
 */

/**
 * @typedef {Object} RuleSource
 * @property {GuardrailLevel} source_level
 * @property {string} source_id
 * @property {boolean} is_override
 */

/**
 * @typedef {Object} MergedGuardrails
 * @property {BrandGuardrails} brand
 * @property {CampaignGuardrails | null | undefined} campaign
 * @property {AssetGuardrails | null | undefined} asset
 * @property {MergedRules} effective_rules
 * @property {Object.<string, RuleSource>} rule_sources
 * @property {GuardrailInheritance[]} inheritance_chain
 */

/**
 * @typedef {Object} ComplianceRecommendation
 * @property {number} priority
 * @property {string} action
 * @property {RuleCategory} category
 * @property {GuardrailLevel} level
 */

/**
 * @typedef {Object} ComplianceIssue
 * @property {GuardrailLevel} level
 * @property {RuleCategory} category
 * @property {string} message
 * @property {string} severity
 */

/**
 * @typedef {Object} PerformancePrediction
 * @property {number} mlr_approval_likelihood
 * @property {number} estimated_review_cycles
 * @property {string[]} risk_factors
 */

/**
 * @typedef {Object} BrandComplianceResult
 * @property {number} score
 * @property {number} tone_match
 * @property {number} key_message_alignment
 * @property {number} regulatory_compliance
 * @property {string[]} suggestions
 * @property {string[]} warnings
 */

/**
 * @typedef {Object} CampaignComplianceResult
 * @property {number} score
 * @property {boolean} message_priority_adherence
 * @property {boolean} audience_tone_match
 * @property {boolean} competitive_positioning
 * @property {string[]} suggestions
 * @property {string[]} warnings
 */

/**
 * @typedef {Object} AssetComplianceResult
 * @property {number} score
 * @property {boolean} format_adherence
 * @property {boolean} character_limit_compliance
 * @property {boolean} channel_requirements_met
 * @property {boolean} regulatory_placement_correct
 * @property {string[]} suggestions
 * @property {string[]} warnings
 */

/**
 * @typedef {Object} EnhancedContentComplianceCheck
 * @property {number} overall_score
 * @property {BrandComplianceResult} brand_compliance
 * @property {CampaignComplianceResult | undefined} campaign_compliance
 * @property {AssetComplianceResult | undefined} asset_compliance
 * @property {ComplianceIssue[]} critical_issues
 * @property {ComplianceRecommendation[]} recommended_actions
 * @property {PerformancePrediction} performance_prediction
 */

/**
 * @typedef {Object} ComplianceHistory
 * @property {string} id
 * @property {string} content_id
 * @property {'campaign' | 'asset'} content_type
 * @property {number} brand_compliance_score
 * @property {number | null} campaign_compliance_score
 * @property {number | null} asset_compliance_score
 * @property {number} overall_compliance_score
 * @property {Object} compliance_details
 * @property {string[]} suggestions
 * @property {string[]} warnings
 * @property {ComplianceIssue[]} critical_issues
 * @property {boolean} has_overrides
 * @property {Object} [override_details]
 * @property {string} [approved_by]
 * @property {string} [approval_timestamp]
 * @property {string} [checked_at]
 * @property {string} [checked_by]
 * @property {string} [guardrails_version]
 */


export class MultiLevelGuardrailsService {
  
  // Campaign Guardrails Management
  /**
   * Fetches campaign guardrails by campaign ID.
   * @param {string} campaignId
   * @returns {Promise<CampaignGuardrails | null>}
   */
  static async getCampaignGuardrails(campaignId) {
    try {
      const { data, error } = await supabase
        .from('campaign_guardrails')
        .select('*')
        .eq('campaign_id', campaignId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // No matching row
        throw error;
      }

      return this.transformCampaignGuardrails(data);
    } catch (error) {
      console.error('Error fetching campaign guardrails:', error);
      return null;
    }
  }

  /**
   * Creates new campaign guardrails.
   * @param {string} campaignId
   * @param {string} brandId
   * @param {Partial<CampaignGuardrails>} guardrails
   * @returns {Promise<CampaignGuardrails>}
   */
  static async createCampaignGuardrails(
    campaignId, 
    brandId, 
    guardrails
  ) {
    const { data, error } = await supabase
      .from('campaign_guardrails')
      .insert({
        campaign_id: campaignId,
        brand_id: brandId,
        ...this.prepareCampaignGuardrailsForDB(guardrails)
      })
      .select()
      .single();

    if (error) throw error;
    return this.transformCampaignGuardrails(data);
  }

  /**
   * Updates existing campaign guardrails.
   * @param {string} id
   * @param {Partial<CampaignGuardrails>} updates
   * @returns {Promise<CampaignGuardrails>}
   */
  static async updateCampaignGuardrails(
    id, 
    updates
  ) {
    const { data, error } = await supabase
      .from('campaign_guardrails')
      .update(this.prepareCampaignGuardrailsForDB(updates))
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return this.transformCampaignGuardrails(data);
  }

  // Asset Guardrails Management
  /**
   * Fetches asset guardrails by asset ID.
   * @param {string} assetId
   * @returns {Promise<AssetGuardrails | null>}
   */
  static async getAssetGuardrails(assetId) {
    try {
      const { data, error } = await supabase
        .from('asset_guardrails')
        .select('*')
        .eq('asset_id', assetId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
      }

      return this.transformAssetGuardrails(data);
    } catch (error) {
      console.error('Error fetching asset guardrails:', error);
      return null;
    }
  }

  /**
   * Creates new asset guardrails.
   * @param {string} assetId
   * @param {string} brandId
   * @param {string} assetType
   * @param {string} [campaignId]
   * @param {Partial<AssetGuardrails>} [guardrails]
   * @returns {Promise<AssetGuardrails>}
   */
  static async createAssetGuardrails(
    assetId,
    brandId,
    assetType,
    campaignId,
    guardrails
  ) {
    const { data, error } = await supabase
      .from('asset_guardrails')
      .insert({
        asset_id: assetId,
        brand_id: brandId,
        asset_type: assetType,
        campaign_id: campaignId,
        ...this.prepareAssetGuardrailsForDB(guardrails || {})
      })
      .select()
      .single();

    if (error) throw error;
    return this.transformAssetGuardrails(data);
  }

  /**
   * Updates existing asset guardrails.
   * @param {string} id
   * @param {Partial<AssetGuardrails>} updates
   * @returns {Promise<AssetGuardrails>}
   */
  static async updateAssetGuardrails(
    id, 
    updates
  ) {
    const { data, error } = await supabase
      .from('asset_guardrails')
      .update(this.prepareAssetGuardrailsForDB(updates))
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return this.transformAssetGuardrails(data);
  }

  // Data transformation methods
  /**
   * @private
   * @param {any} data
   * @returns {CampaignGuardrails}
   */
  static transformCampaignGuardrails(data) {
    return {
      id: data.id,
      campaign_id: data.campaign_id,
      brand_id: data.brand_id,
      custom_key_messages: data.custom_key_messages,
      message_priority_overrides: data.message_priority_overrides,
      tone_overrides: data.tone_overrides,
      audience_specific_tone: data.audience_specific_tone,
      competitive_focus: data.competitive_focus,
      competitive_messaging_emphasis: data.competitive_messaging_emphasis,
      market_specific_rules: data.market_specific_rules,
      regulatory_additions: data.regulatory_additions,
      mlr_deadline_requirements: data.mlr_deadline_requirements,
      approval_process_overrides: data.approval_process_overrides,
      inherits_from_brand: data.inherits_from_brand,
      override_level: data.override_level,
      customization_rationale: data.customization_rationale,
      created_at: data.created_at,
      updated_at: data.updated_at,
      created_by: data.created_by,
      updated_by: data.updated_by
    };
  }

  /**
   * @private
   * @param {any} data
   * @returns {AssetGuardrails}
   */
  static transformAssetGuardrails(data) {
    return {
      id: data.id,
      asset_id: data.asset_id,
      campaign_id: data.campaign_id,
      brand_id: data.brand_id,
      asset_type: data.asset_type,
      message_customizations: data.message_customizations,
      tone_adjustments: data.tone_adjustments,
      channel_requirements: data.channel_requirements,
      format_constraints: data.format_constraints,
      character_limits: data.character_limits,
      visual_requirements: data.visual_requirements,
      regulatory_placement_rules: data.regulatory_placement_rules,
      disclaimer_requirements: data.disclaimer_requirements,
      review_workflow_overrides: data.review_workflow_overrides,
      approval_requirements: data.approval_requirements,
      ab_testing_guidelines: data.ab_testing_guidelines,
      engagement_targets: data.engagement_targets,
      inherits_from_campaign: data.inherits_from_campaign,
      inherits_from_brand: data.inherits_from_brand,
      override_level: data.override_level,
      customization_rationale: data.customization_rationale,
      created_at: data.created_at,
      updated_at: data.updated_at,
      created_by: data.created_by,
      updated_by: data.updated_by
    };
  }

  /**
   * @private
   * @param {Partial<CampaignGuardrails>} guardrails
   * @returns {any}
   */
  static prepareCampaignGuardrailsForDB(guardrails) {
    const prepared = { ...guardrails };
    // Remove fields that shouldn't be sent to DB
    delete prepared.id;
    delete prepared.created_at;
    delete prepared.updated_at;
    return prepared;
  }

  /**
   * @private
   * @param {Partial<AssetGuardrails>} guardrails
   * @returns {any}
   */
  static prepareAssetGuardrailsForDB(guardrails) {
    const prepared = { ...guardrails };
    // Remove fields that shouldn't be sent to DB
    delete prepared.id;
    delete prepared.created_at;
    delete prepared.updated_at;
    return prepared;
  }

  // Guardrails Merging and Inheritance
  /**
   * Fetches and merges guardrails from Brand, Campaign, and Asset levels.
   * @param {string} brandId
   * @param {string} [campaignId]
   * @param {string} [assetId]
   * @param {string} [assetType]
   * @returns {Promise<MergedGuardrails>}
   */
  static async getMergedGuardrails(
    brandId,
    campaignId,
    assetId,
    assetType
  ) {
    // Fetch all relevant guardrails
    const [brandGuardrails, campaignGuardrails, assetGuardrails] = await Promise.all([
      this.getBrandGuardrails(brandId),
      campaignId ? this.getCampaignGuardrails(campaignId) : Promise.resolve(null),
      assetId ? this.getAssetGuardrails(assetId) : Promise.resolve(null)
    ]);

    if (!brandGuardrails) {
      throw new Error('Brand guardrails not found');
    }

    return this.mergeGuardrails(brandGuardrails, campaignGuardrails, assetGuardrails, assetType);
  }

  /**
   * @private
   * @param {string} brandId
   * @returns {Promise<BrandGuardrails | null>}
   */
  static async getBrandGuardrails(brandId) {
    // This uses a dynamic import to prevent circular dependencies with the GuardrailsService
    const { GuardrailsService } = await import('./guardrailsService');
    return GuardrailsService.getGuardrails(brandId);
  }

  /**
   * @private
   * @param {BrandGuardrails} brand
   * @param {CampaignGuardrails | null | undefined} [campaign]
   * @param {AssetGuardrails | null | undefined} [asset]
   * @param {string} [assetType]
   * @returns {MergedGuardrails}
   */
  static mergeGuardrails(
    brand,
    campaign,
    asset,
    assetType
  ) {
    /** @type {MergedGuardrails['inheritance_chain']} */
    const inheritance_chain = [
      {
        level: /** @type {GuardrailLevel} */ ('brand'),
        id: brand.id,
        name: 'Brand Guidelines',
        has_customizations: false
      }
    ];

    if (campaign) {
      inheritance_chain.push({
        level: /** @type {GuardrailLevel} */ ('campaign'),
        id: campaign.id,
        name: 'Campaign Guidelines',
        has_customizations: true
      });
    }

    if (asset) {
      inheritance_chain.push({
        level: /** @type {GuardrailLevel} */ ('asset'),
        id: asset.id,
        name: 'Asset Guidelines',
        has_customizations: true
      });
    }

    // --- MERGE LOGIC ---

    // 1. Merge key messages (Asset overrides Campaign, Campaign overrides Brand)
    let key_messages = [...brand.key_messages];
    if (campaign?.custom_key_messages) {
      key_messages = [...campaign.custom_key_messages, ...key_messages];
    }
    if (asset?.message_customizations) {
      key_messages = [...asset.message_customizations, ...key_messages];
    }
    // Remove duplicates if any (simple implementation)
    key_messages = key_messages.filter((msg, index, self) => 
        index === self.findIndex((t) => (
            t.id === msg.id && t.text === msg.text
        ))
    );

    // 2. Merge tone guidelines
    let tone_guidelines = { ...brand.tone_guidelines };
    if (campaign?.tone_overrides) {
      tone_guidelines = {
        primary: campaign.tone_overrides.primary || tone_guidelines.primary,
        secondary: campaign.tone_overrides.secondary || tone_guidelines.secondary,
        descriptors: campaign.tone_overrides.descriptors || tone_guidelines.descriptors
      };
    }
    if (asset?.tone_adjustments) {
      tone_guidelines = {
        primary: asset.tone_adjustments.primary || tone_guidelines.primary,
        secondary: asset.tone_adjustments.secondary || tone_guidelines.secondary,
        descriptors: asset.tone_adjustments.descriptors || tone_guidelines.descriptors
      };
    }

    // 3. Merge regulatory requirements
    let regulatory_musts = { ...brand.regulatory_musts };
    if (campaign?.regulatory_additions) {
      // Safely merge arrays, ensuring the base arrays are present
      regulatory_musts = {
        disclaimers: [
          ...(regulatory_musts.disclaimers || []),
          ...(campaign.regulatory_additions.disclaimers || [])
        ],
        warnings: [
          ...(regulatory_musts.warnings || []),
          ...(campaign.regulatory_additions.warnings || [])
        ],
        required_language: [
          ...(regulatory_musts.required_language || []),
          ...(campaign.regulatory_additions.required_language || [])
        ]
      };
    }

    // 4. Asset-specific format constraints
    const format_constraints = asset?.format_constraints ? {
      character_limits: asset.character_limits || {},
      required_sections: asset.format_constraints.required_sections || [],
      prohibited_elements: asset.format_constraints.prohibited_elements || []
    } : undefined;

    // 5. Channel requirements
    const channel_requirements = asset?.channel_requirements || undefined;

    // 6. Competitive advantages with campaign focus
    let competitive_advantages = [...brand.competitive_advantages];
    if (campaign?.competitive_focus) {
      competitive_advantages = [...campaign.competitive_focus, ...competitive_advantages];
    }

    /** @type {MergedRules} */
    const effective_rules = {
      key_messages,
      tone_guidelines,
      content_dos: brand.content_dos,
      content_donts: brand.content_donts,
      regulatory_musts,
      visual_standards: brand.visual_standards,
      competitive_advantages,
      market_positioning: brand.market_positioning,
      format_constraints,
      channel_requirements
    };

    // 7. Track rule sources
    /** @type {Object.<string, RuleSource>} */
    const rule_sources = {};
    
    // Example rule source tracking for key messages
    rule_sources['key_messages'] = {
      source_level: /** @type {GuardrailLevel} */ (asset?.message_customizations ? 'asset' : campaign?.custom_key_messages ? 'campaign' : 'brand'),
      source_id: asset?.message_customizations ? asset.id : campaign?.custom_key_messages ? campaign.id : brand.id,
      is_override: !!(asset?.message_customizations || campaign?.custom_key_messages)
    };

    return {
      brand,
      campaign,
      asset,
      effective_rules,
      rule_sources,
      inheritance_chain
    };
  }

  // Enhanced Content Compliance Checking
  /**
   * Runs an enhanced compliance check against the merged guardrails.
   * NOTE: The actual compliance logic within checkBrand/Campaign/AssetCompliance is simplified/mocked in this file.
   * @param {string} content
   * @param {string} brandId
   * @param {string} [campaignId]
   * @param {string} [assetId]
   * @param {string} [assetType]
   * @returns {Promise<EnhancedContentComplianceCheck>}
   */
  static async checkEnhancedContentCompliance(
    content,
    brandId,
    campaignId,
    assetId,
    assetType
  ) {
    const mergedGuardrails = await this.getMergedGuardrails(brandId, campaignId, assetId, assetType);
    
    // Brand-level compliance (reuse existing logic from other service)
    const brandCompliance = await this.checkBrandCompliance(content, mergedGuardrails.brand);
    
    // Campaign-level compliance
    const campaignCompliance = mergedGuardrails.campaign 
      ? await this.checkCampaignCompliance(content, mergedGuardrails.campaign)
      : undefined;
    
    // Asset-level compliance
    const assetCompliance = mergedGuardrails.asset 
      ? await this.checkAssetCompliance(content, mergedGuardrails.asset, assetType)
      : undefined;

    // Calculate overall score
    const scores = [brandCompliance.score];
    if (campaignCompliance) scores.push(campaignCompliance.score);
    if (assetCompliance) scores.push(assetCompliance.score);
    
    const overall_score = Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);

    // Collect critical issues (Mock data structure)
    /** @type {ComplianceIssue[]} */
    const critical_issues = [];
    if (brandCompliance.regulatory_compliance < 50) {
        critical_issues.push({
            level: 'brand',
            category: 'regulatory',
            message: 'Critical regulatory language missing or misused.',
            severity: 'high'
        });
    }

    // Performance prediction based on compliance scores
    /** @type {PerformancePrediction} */
    const performance_prediction = {
      mlr_approval_likelihood: Math.min(95, overall_score + 10), // Cap at 95%
      estimated_review_cycles: overall_score > 80 ? 1 : overall_score > 60 ? 2 : 3,
      risk_factors: [
        ...(overall_score < 70 ? ['Low overall compliance score'] : []),
        ...(brandCompliance.warnings.length > 0 ? ['Brand guideline warnings'] : []),
        ...(assetCompliance && !assetCompliance.format_adherence ? ['Format compliance issues'] : [])
      ]
    };

    /** @type {ComplianceRecommendation[]} */
    const recommended_actions = [];
    if (brandCompliance.score < 80) {
      recommended_actions.push({
        priority: 1,
        action: 'Improve brand guideline compliance',
        category: /** @type {RuleCategory} */ ('messaging'),
        level: /** @type {GuardrailLevel} */ ('brand')
      });
    }
    if (assetCompliance && !assetCompliance.format_adherence) {
        recommended_actions.push({
            priority: 2,
            action: 'Adjust content to meet asset format constraints',
            category: /** @type {RuleCategory} */ ('format'),
            level: /** @type {GuardrailLevel} */ ('asset')
        });
    }

    return {
      overall_score,
      brand_compliance: brandCompliance,
      campaign_compliance: campaignCompliance,
      asset_compliance: assetCompliance,
      critical_issues,
      recommended_actions,
      performance_prediction
    };
  }

  /**
   * @private
   * @param {string} content
   * @param {BrandGuardrails} brand
   * @returns {Promise<BrandComplianceResult>}
   */
  static async checkBrandCompliance(content, brand) {
    // Reuse existing GuardrailsService logic
    const { GuardrailsService } = await import('./guardrailsService');
    const result = GuardrailsService.checkContentCompliance(content, brand);
    
    return {
      score: result.guideline_adherence,
      tone_match: result.tone_match,
      key_message_alignment: result.key_message_alignment,
      regulatory_compliance: result.regulatory_compliance,
      suggestions: result.suggestions,
      warnings: result.warnings
    };
  }

  /**
   * @private
   * @param {string} content
   * @param {CampaignGuardrails} campaign
   * @returns {Promise<CampaignComplianceResult>}
   */
  static async checkCampaignCompliance(content, campaign) {
    // Campaign-specific compliance checks (Simplified/Mocked)
    let score = 95;
    const suggestions = [];
    const warnings = [];

    // Placeholder logic for message priority adherence
    const message_priority_adherence = true; 
    
    // Placeholder logic for audience-specific tone
    const audience_tone_match = true; 
    
    // Placeholder logic for competitive positioning
    const competitive_positioning = true; 

    return {
      score,
      message_priority_adherence,
      audience_tone_match,
      competitive_positioning,
      suggestions,
      warnings
    };
  }

  /**
   * @private
   * @param {string} content
   * @param {AssetGuardrails} asset
   * @param {string} [assetType]
   * @returns {Promise<AssetComplianceResult>}
   */
  static async checkAssetCompliance(content, asset, assetType) {
    // Asset-specific compliance checks (Simplified/Mocked)
    let score = 90;
    const suggestions = [];
    const warnings = [];

    // Check format adherence
    const format_adherence = this.checkFormatCompliance(content, asset);
    
    // Check character limits
    const character_limit_compliance = this.checkCharacterLimits(content, asset);
    
    // Placeholder logic for channel requirements
    const channel_requirements_met = true; 
    
    // Placeholder logic for regulatory placement
    const regulatory_placement_correct = true; 

    if (!format_adherence) score -= 20;
    if (!character_limit_compliance) score -= 15;
    if (score < 0) score = 0; // Ensure non-negative score

    return {
      score: score,
      format_adherence,
      character_limit_compliance,
      channel_requirements_met,
      regulatory_placement_correct,
      suggestions,
      warnings
    };
  }

  /**
   * @private
   * @param {string} content
   * @param {AssetGuardrails} asset
   * @returns {boolean}
   */
  static checkFormatCompliance(content, asset) {
    if (!asset.format_constraints) return true;
    
    // Check required sections
    if (asset.format_constraints.required_sections) {
      for (const section of asset.format_constraints.required_sections) {
        if (!content.toLowerCase().includes(section.toLowerCase())) {
          return false;
        }
      }
    }
    
    // Check prohibited elements
    if (asset.format_constraints.prohibited_elements) {
      for (const element of asset.format_constraints.prohibited_elements) {
        if (content.toLowerCase().includes(element.toLowerCase())) {
          return false;
        }
      }
    }
    
    return true;
  }

  /**
   * @private
   * @param {string} content
   * @param {AssetGuardrails} asset
   * @returns {boolean}
   */
  static checkCharacterLimits(content, asset) {
    if (!asset.character_limits) return true;
    
    // For now, check overall content length against the 'body' limit
    if (asset.character_limits.body && content.length > asset.character_limits.body) {
      return false;
    }
    
    return true;
  }

  // Compliance History Management
  /**
   * Saves the result of a compliance check to the history table.
   * @param {string} contentId
   * @param {'campaign' | 'asset'} contentType
   * @param {EnhancedContentComplianceCheck} complianceResult
   * @param {string} [checkedBy]
   * @returns {Promise<ComplianceHistory>}
   */
  static async saveComplianceCheck(
    contentId,
    contentType,
    complianceResult,
    checkedBy
  ) {
    const { data, error } = await supabase
      .from('compliance_history')
      .insert({
        content_id: contentId,
        content_type: contentType,
        brand_compliance_score: complianceResult.brand_compliance.score,
        campaign_compliance_score: complianceResult.campaign_compliance?.score || null,
        asset_compliance_score: complianceResult.asset_compliance?.score || null,
        overall_compliance_score: complianceResult.overall_score,
        compliance_details: {
          brand_level: complianceResult.brand_compliance,
          campaign_level: complianceResult.campaign_compliance,
          asset_level: complianceResult.asset_compliance
        },
        suggestions: complianceResult.recommended_actions.map(a => a.action),
        warnings: [
          ...complianceResult.brand_compliance.warnings,
          ...(complianceResult.campaign_compliance?.warnings || []),
          ...(complianceResult.asset_compliance?.warnings || [])
        ],
        critical_issues: complianceResult.critical_issues.map(issue => ({
          level: issue.level,
          category: issue.category,
          message: issue.message,
          severity: issue.severity
        })),
        has_overrides: !!(complianceResult.campaign_compliance || complianceResult.asset_compliance),
        checked_by: checkedBy,
        guardrails_version: '1.0.0' // Version tracking for audit
      })
      .select()
      .single();

    if (error) throw error;
    return this.transformComplianceHistory(data);
  }

  /**
   * Retrieves the compliance history for a specific content item.
   * @param {string} contentId
   * @param {'campaign' | 'asset'} contentType
   * @returns {Promise<ComplianceHistory[]>}
   */
  static async getComplianceHistory(
    contentId,
    contentType
  ) {
    const { data, error } = await supabase
      .from('compliance_history')
      .select('*')
      .eq('content_id', contentId)
      .eq('content_type', contentType)
      .order('checked_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(item => this.transformComplianceHistory(item));
  }

  /**
   * @private
   * @param {any} data
   * @returns {ComplianceHistory}
   */
  static transformComplianceHistory(data) {
    return {
      id: data.id,
      content_id: data.content_id,
      content_type: data.content_type,
      brand_compliance_score: data.brand_compliance_score,
      campaign_compliance_score: data.campaign_compliance_score,
      asset_compliance_score: data.asset_compliance_score,
      overall_compliance_score: data.overall_compliance_score,
      compliance_details: data.compliance_details,
      suggestions: data.suggestions,
      warnings: data.warnings,
      critical_issues: data.critical_issues,
      has_overrides: data.has_overrides,
      override_details: data.override_details,
      approved_by: data.approved_by,
      approval_timestamp: data.approval_timestamp,
      checked_at: data.checked_at,
      checked_by: data.checked_by,
      guardrails_version: data.guardrails_version
    };
  }
}