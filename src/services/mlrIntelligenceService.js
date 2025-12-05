import { supabase } from '@/integrations/supabase/client';

/**
 * @typedef {Object} MLRRequirement
 * @property {string} id
 * @property {string} market
 * @property {'safety' | 'efficacy' | 'manufacturing' | 'labeling' | 'advertising'} category
 * @property {string} requirement
 * @property {boolean} mandatory
 * @property {string} regulatoryBody
 * @property {string} lastUpdated
 * @property {'new' | 'updated' | 'removed'} [changeType]
 * @property {'low' | 'medium' | 'high' | 'critical'} impactLevel
 */

/**
 * @typedef {Object} MLRRequirementCheck
 * @property {MLRRequirement} requirement
 * @property {'met' | 'partial' | 'not_met' | 'not_applicable'} status
 * @property {string} evidence
 * @property {string} comments
 * @property {boolean} actionRequired
 */

/**
 * @typedef {Object} MLRComplianceCheck
 * @property {string} assetId
 * @property {string} market
 * @property {number} overallScore
 * @property {'compliant' | 'partial' | 'non_compliant' | 'review_required'} complianceStatus
 * @property {MLRRequirementCheck[]} requirements
 * @property {string[]} recommendations
 * @property {string} nextReviewDate
 * @property {string} [localMLRContact]
 */

/**
 * @typedef {Object} RegulatoryAlert
 * @property {string} id
 * @property {string} market
 * @property {string} title
 * @property {string} description
 * @property {string} effectiveDate
 * @property {string[]} impactedAssets
 * @property {'info' | 'warning' | 'critical'} severity
 * @property {string} [actionDeadline]
 * @property {'new' | 'acknowledged' | 'addressed'} status
 */

export class MLRIntelligenceService {
  /**
   * Fetches the MLR requirements for a given market.
   * @param {string} market
   * @param {string} [therapeuticArea]
   * @returns {Promise<MLRRequirement[]>}
   */
  static async getMarketRequirements(market, therapeuticArea) {
    try {
      // In a real implementation, this would fetch from a regulatory database
      // For now, we'll simulate market-specific requirements
      const requirements = this.generateMarketRequirements(market, therapeuticArea);
      return requirements;
    } catch (error) {
      console.error('Error fetching market requirements:', error);
      return [];
    }
  }

  /**
   * Checks a specific content asset against all relevant MLR requirements for a market.
   * @param {string} assetId
   * @param {string} market
   * @returns {Promise<MLRComplianceCheck>}
   */
  static async checkAssetCompliance(assetId, market) {
    try {
      // Get asset data (simulate joining with content_projects to get therapeutic_area)
      const { data: asset, error: assetError } = await supabase
        .from('content_assets')
        .select(`
          *,
          content_projects!inner(therapeutic_area)
        `)
        .eq('id', assetId)
        .single();

      if (assetError) throw assetError;

      // Get market requirements
      const requirements = await this.getMarketRequirements(market, asset.content_projects.therapeutic_area);

      // Check compliance for each requirement
      const requirementChecks = requirements.map(requirement => 
        this.checkRequirementCompliance(asset, requirement)
      );

      // Calculate overall score
      const totalRequirements = requirementChecks.length;
      const metRequirements = requirementChecks.filter(check => check.status === 'met').length;
      const partialRequirements = requirementChecks.filter(check => check.status === 'partial').length;
      
      const overallScore = totalRequirements > 0 ? Math.round(
        ((metRequirements * 100) + (partialRequirements * 50)) / totalRequirements
      ) : 100;

      const complianceStatus = this.determineComplianceStatus(overallScore, requirementChecks);
      const recommendations = this.generateRecommendations(requirementChecks);
      const nextReviewDate = this.calculateNextReviewDate(market);

      return {
        assetId,
        market,
        overallScore,
        complianceStatus,
        requirements: requirementChecks,
        recommendations,
        nextReviewDate,
        localMLRContact: this.getLocalMLRContact(market)
      };
    } catch (error) {
      console.error('Error checking asset compliance:', error);
      throw error;
    }
  }

  /**
   * Creates an audit log entry for the MLR handoff.
   * @param {string} assetId
   * @param {string} market
   * @param {MLRComplianceCheck} complianceCheck
   * @returns {Promise<string>} - The ID of the created audit log entry.
   */
  static async createMLRHandoff(
    assetId,
    market,
    complianceCheck
  ) {
    try {
      // Create audit log for MLR handoff
      const { data: handoff, error } = await supabase
        .from('audit_logs')
        .insert({
          table_name: 'content_assets',
          record_id: assetId,
          action_type: 'mlr_handoff',
          new_data: {
            market,
            compliance_score: complianceCheck.overallScore || 85,
            compliance_status: complianceCheck.complianceStatus || 'needs_review',
            issues_count: complianceCheck.requirements?.filter(r => r.actionRequired).length || 0,
            handoff_type: 'local_mlr_review',
            priority: complianceCheck.complianceStatus === 'non_compliant' ? 'high' : 'medium',
            created_at: new Date().toISOString()
          }
        })
        .select()
        .single();

      if (error) throw error;

      return handoff.id;
    } catch (error) {
      console.error('Error creating MLR handoff:', error);
      throw error;
    }
  }

  /**
   * Fetches regulatory alerts based on market and severity (mock).
   * @param {string} [market]
   * @param {string} [severity]
   * @returns {Promise<RegulatoryAlert[]>}
   */
  static async getRegulatoryAlerts(market, severity) {
    try {
      // Simulate regulatory alerts
      /** @type {RegulatoryAlert[]} */
      const alerts = [
        {
          id: '1',
          market: 'EU',
          title: 'New GDPR Data Processing Requirements',
          description: 'Updated requirements for patient data processing in digital materials',
          effectiveDate: '2024-03-01',
          impactedAssets: ['email', 'digital_ad'],
          severity: 'warning',
          actionDeadline: '2024-02-15',
          status: 'new'
        },
        {
          id: '2',
          market: 'US',
          title: 'FDA Updated Guidance on Social Media',
          description: 'New requirements for risk information in social media posts',
          effectiveDate: '2024-04-15',
          impactedAssets: ['social_post', 'banner_ad'],
          severity: 'critical',
          actionDeadline: '2024-04-01',
          status: 'new'
        }
      ];

      let filteredAlerts = alerts;
      
      if (market) {
        filteredAlerts = filteredAlerts.filter(alert => alert.market === market);
      }
      
      if (severity) {
        filteredAlerts = filteredAlerts.filter(alert => alert.severity === severity);
      }

      return filteredAlerts;
    } catch (error) {
      console.error('Error fetching regulatory alerts:', error);
      return [];
    }
  }

  /**
   * Monitors for regulatory changes and logs notifications for impacted assets.
   * @param {string} brandId
   * @returns {Promise<void>}
   */
  static async monitorRegulatoryChanges(brandId) {
    try {
      // Get all assets for the brand
      const { data: assets } = await supabase
        .from('content_assets')
        .select('id, asset_type')
        .eq('brand_id', brandId);

      // Get current alerts
      const alerts = await this.getRegulatoryAlerts();

      // Check impact on existing assets
      for (const alert of alerts) {
        const impactedAssets = assets?.filter(asset => 
          alert.impactedAssets.includes(asset.asset_type)
        ) || [];

        if (impactedAssets.length > 0) {
          // Create notifications/audit logs for impacted assets
          await supabase.from('audit_logs').insert({
            table_name: 'content_assets',
            action_type: 'regulatory_alert',
            brand_id: brandId,
            new_data: {
              alert_type: 'regulatory_change',
              market: alert.market,
              change_type: 'regulatory_update',
              effective_date: alert.effectiveDate,
              impact_level: alert.severity,
              impacted_assets_count: impactedAssets.length,
              requires_review: alert.severity === 'critical'
            }
          });
        }
      }
    } catch (error) {
      console.error('Error monitoring regulatory changes:', error);
      throw error;
    }
  }

  /**
   * Generates a list of mock MLR requirements based on market and therapeutic area.
   * @private
   * @param {string} market
   * @param {string} [therapeuticArea]
   * @returns {MLRRequirement[]}
   */
  static generateMarketRequirements(market, therapeuticArea) {
    const baseRequirements = [
      {
        category: 'safety',
        requirement: 'Must include Important Safety Information',
        mandatory: true,
        impactLevel: 'critical'
      },
      {
        category: 'efficacy',
        requirement: 'All efficacy claims must be substantiated',
        mandatory: true,
        impactLevel: 'high'
      },
      {
        category: 'manufacturing',
        requirement: 'Manufacturing information must be current',
        mandatory: false,
        impactLevel: 'medium'
      }
    ];

    // Market-specific requirements
    const marketSpecific = this.getMarketSpecificRequirements(market);
    const therapeuticSpecific = this.getTherapeuticSpecificRequirements(therapeuticArea);

    const allRequirements = [...baseRequirements, ...marketSpecific, ...therapeuticSpecific];

    return allRequirements.map((req, index) => ({
      id: `req_${index + 1}`,
      market,
      category: req.category || 'safety',
      requirement: req.requirement || '',
      mandatory: req.mandatory || false,
      regulatoryBody: this.getRegulatoryBody(market),
      lastUpdated: new Date().toISOString(),
      impactLevel: req.impactLevel || 'medium'
    }));
  }

  /**
   * Gets mock market-specific MLR requirements.
   * @private
   * @param {string} market
   * @returns {Partial<MLRRequirement>[]}
   */
  static getMarketSpecificRequirements(market) {
    const requirements = {
      'US': [
        {
          category: 'advertising',
          requirement: 'FDA advertising guidelines compliance required',
          mandatory: true,
          impactLevel: 'critical'
        },
        {
          category: 'labeling',
          requirement: 'Must include FDA-approved prescribing information',
          mandatory: true,
          impactLevel: 'high'
        }
      ],
      'EU': [
        {
          category: 'advertising',
          requirement: 'EMA advertising directive compliance',
          mandatory: true,
          impactLevel: 'critical'
        },
        {
          category: 'safety',
          requirement: 'GDPR patient data protection compliance',
          mandatory: true,
          impactLevel: 'high'
        }
      ],
      'UK': [
        {
          category: 'advertising',
          requirement: 'MHRA advertising standards compliance',
          mandatory: true,
          impactLevel: 'critical'
        }
      ]
    };

    return requirements[market] || [];
  }

  /**
   * Gets mock therapeutic-specific MLR requirements.
   * @private
   * @param {string} [therapeuticArea]
   * @returns {Partial<MLRRequirement>[]}
   */
  static getTherapeuticSpecificRequirements(therapeuticArea) {
    if (!therapeuticArea) return [];

    const requirements = {
      'oncology': [
        {
          category: 'safety',
          requirement: 'Black box warning must be prominently displayed',
          mandatory: true,
          impactLevel: 'critical'
        }
      ],
      'cardiovascular': [
        {
          category: 'safety',
          requirement: 'Cardiovascular risk information required',
          mandatory: true,
          impactLevel: 'high'
        }
      ]
    };

    return requirements[therapeuticArea.toLowerCase()] || [];
  }

  /**
   * Performs a mock check of content against a single requirement.
   * @private
   * @param {any} asset
   * @param {MLRRequirement} requirement
   * @returns {MLRRequirementCheck}
   */
  static checkRequirementCompliance(asset, requirement) {
    const content = asset.primary_content || {};
    const text = `${content.headline || ''} ${content.body || ''} ${content.disclaimer || ''}`.toLowerCase();

    let status = 'not_met';
    let evidence = '';
    let comments = '';
    let actionRequired = true;

    // Check specific requirements (simplified mock checks)
    switch (requirement.category) {
      case 'safety':
        if (text.includes('important safety information') || text.includes('side effects')) {
          status = 'met';
          evidence = 'Safety information found in content';
          actionRequired = false;
        } else if (text.includes('safety') || text.includes('risk')) {
          status = 'partial';
          evidence = 'Some safety information present';
          comments = 'Needs more comprehensive safety information';
        }
        break;

      case 'efficacy':
        if (text.includes('clinical trial') || text.includes('proven')) {
          status = 'met';
          evidence = 'Efficacy claims appear substantiated';
          actionRequired = false;
        }
        break;

      case 'advertising':
        if (content.disclaimer && content.disclaimer.length > 50) {
          status = 'met';
          evidence = 'Comprehensive disclaimer present';
          actionRequired = false;
        }
        break;

      default:
        status = 'not_applicable';
        actionRequired = false;
    }

    return {
      requirement,
      status,
      evidence,
      comments,
      actionRequired
    };
  }

  /**
   * Determines the overall compliance status based on score and critical failures.
   * @private
   * @param {number} score
   * @param {MLRRequirementCheck[]} checks
   * @returns {'compliant' | 'partial' | 'non_compliant' | 'review_required'}
   */
  static determineComplianceStatus(
    score, 
    checks
  ) {
    const criticalFailures = checks.filter(check => 
      check.requirement.impactLevel === 'critical' && check.status === 'not_met'
    );

    if (criticalFailures.length > 0) return 'non_compliant';
    if (score >= 90) return 'compliant';
    if (score >= 70) return 'partial';
    return 'review_required';
  }

  /**
   * Generates recommendations based on failed/partial compliance checks.
   * @private
   * @param {MLRRequirementCheck[]} checks
   * @returns {string[]}
   */
  static generateRecommendations(checks) {
    const recommendations = [];
    
    const actionRequired = checks.filter(check => check.actionRequired);
    
    if (actionRequired.length > 0) {
      recommendations.push(`Address ${actionRequired.length} compliance requirements`);
    }

    const criticalIssues = checks.filter(check => 
      check.requirement.impactLevel === 'critical' && check.status !== 'met'
    );
    
    if (criticalIssues.length > 0) {
      recommendations.push('Resolve critical compliance issues before launch');
    }

    const partialCompliance = checks.filter(check => check.status === 'partial');
    if (partialCompliance.length > 0) {
      recommendations.push('Enhance partially compliant requirements');
    }

    return recommendations;
  }

  /**
   * Calculates the next review date based on market's regulatory cycle.
   * @private
   * @param {string} market
   * @returns {string} - Date string (YYYY-MM-DD)
   */
  static calculateNextReviewDate(market) {
    // Different markets have different review cycles
    const reviewCycles = {
      'US': 180,  // 6 months
      'EU': 365,  // 12 months
      'UK': 365,  // 12 months
      'Japan': 180 // 6 months
    };

    const days = reviewCycles[market] || 365;
    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + days);
    
    return nextReview.toISOString().split('T')[0];
  }

  /**
   * Gets the primary regulatory body for a market.
   * @private
   * @param {string} market
   * @returns {string}
   */
  static getRegulatoryBody(market) {
    const bodies = {
      'US': 'FDA',
      'EU': 'EMA',
      'UK': 'MHRA',
      'Germany': 'BfArM',
      'France': 'ANSM',
      'Japan': 'PMDA',
      'China': 'NMPA'
    };

    return bodies[market] || 'Local Regulatory Authority';
  }

  /**
   * Gets the local MLR contact email.
   * @private
   * @param {string} market
   * @returns {string}
   */
  static getLocalMLRContact(market) {
    const contacts = {
      'US': 'mlr.us@company.com',
      'EU': 'mlr.eu@company.com',
      'UK': 'mlr.uk@company.com',
      'Germany': 'mlr.de@company.com',
      'France': 'mlr.fr@company.com',
      'Japan': 'mlr.jp@company.com'
    };

    return contacts[market] || 'mlr.global@company.com';
  }
}