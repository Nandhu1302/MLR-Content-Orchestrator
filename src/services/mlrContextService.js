import { moduleBridge } from './moduleBridge';
import { VeevaVaultService } from './veevaVaultService';

/**
 * @typedef {Object} CampaignContext
 * @property {string} campaignName
 * @property {string[]} objectives
 * @property {string[]} targetAudience
 * @property {string[]} channels
 * @property {Object} timeline
 * @property {string} timeline.start
 * @property {string} timeline.end
 * @property {string} timeline.mlrDeadline
 * @property {'high' | 'medium' | 'low'} budgetTier
 * @property {'urgent' | 'normal' | 'low'} priority
 */

/**
 * @typedef {Object} StrategicContext
 * @property {string[]} keyMessages
 * @property {string[]} competitorLandscape
 * @property {string} therapeuticArea
 * @property {string} diseaseState
 * @property {string} treatmentPosition
 * @property {string[]} clinicalEvidence
 * @property {string[]} brandPersonality
 */

/**
 * @typedef {Object} ContentContext
 * @property {string} assetType
 * @property {any} contentStructure
 * @property {any} brandGuidelines
 * @property {any[]} previousVersions
 * @property {any[]} relatedAssets
 * @property {string} templateSource
 * @property {any[]} customizations
 */

/**
 * @typedef {Object} ReviewIssue
 * @property {string} id
 * @property {'claims' | 'references' | 'regulatory' | 'legal' | 'medical'} category
 * @property {'critical' | 'major' | 'minor'} severity
 * @property {string} description
 * @property {string} suggestion
 * @property {boolean} isResolved
 * @property {string} [resolutionNotes]
 */

/**
 * @typedef {Object} MLRReview
 * @property {string} id
 * @property {string} assetId
 * @property {string} reviewDate
 * @property {Object} reviewer
 * @property {string} reviewer.name
 * @property {'medical' | 'legal' | 'regulatory'} reviewer.role
 * @property {string} reviewer.department
 * @property {'approved' | 'approved_with_changes' | 'rejected' | 'needs_revision'} outcome
 * @property {ReviewIssue[]} issues
 * @property {number} turnaroundTime // hours
 * @property {number} satisfactionScore // 1-5
 */

/**
 * @typedef {Object} IssuePattern
 * @property {string} type
 * @property {number} frequency
 * @property {string} description
 * @property {string} preventionGuidance
 * @property {string[]} exampleText
 */

/**
 * @typedef {Object} ReviewerPreference
 * @property {string} reviewerId
 * @property {'medical' | 'legal' | 'regulatory'} reviewerRole
 * @property {Object} preferences
 * @property {string} preferences.citationStyle
 * @property {'strict' | 'moderate' | 'flexible'} preferences.claimSubstantiation
 * @property {'detailed' | 'concise'} preferences.communicationStyle
 * @property {string[]} preferences.focusAreas
 * @property {Object} responsePatterns
 * @property {number} responsePatterns.typicalTurnaround
 * @property {number} responsePatterns.approvalRate
 * @property {string[]} responsePatterns.commonFeedback
 */

/**
 * @typedef {Object} BrandPattern
 * @property {string} brandId
 * @property {string[]} commonIssues
 * @property {string[]} approvedLanguage
 * @property {string[]} forbiddenTerms
 * @property {string[]} preferredEvidence
 * @property {string[]} regulatoryConsiderations
 */

/**
 * @typedef {Object} SuccessPattern
 * @property {string} assetType
 * @property {string[]} characteristics
 * @property {number} approvalProbability
 * @property {string[]} keySuccessFactors
 * @property {string[]} exampleLanguage
 */

/**
 * @typedef {Object} HistoricalMLRContext
 * @property {MLRReview[]} previousReviews
 * @property {IssuePattern[]} commonIssues
 * @property {ReviewerPreference[]} reviewerPreferences
 * @property {BrandPattern[]} brandSpecificPatterns
 * @property {SuccessPattern[]} successPatterns
 */

/**
 * @typedef {Object} RiskFactor
 * @property {string} category
 * @property {string} description
 * @property {'low' | 'medium' | 'high' | 'critical'} impact
 * @property {'low' | 'medium' | 'high'} likelihood
 * @property {string} mitigation
 */

/**
 * @typedef {Object} RiskProfile
 * @property {'low' | 'medium' | 'high' | 'critical'} overallRisk
 * @property {RiskFactor[]} riskFactors
 * @property {string[]} mitigationStrategies
 * @property {number} estimatedApprovalProbability
 * @property {number} expectedTurnaroundTime // hours
 */

/**
 * @typedef {Object} ComplianceRequirements
 * @property {Object} regulatory
 * @property {string} regulatory.region
 * @property {string[]} regulatory.applicableGuidelines
 * @property {string[]} regulatory.mandatoryDisclosures
 * @property {string[]} regulatory.forbiddenClaims
 * @property {Object} brand
 * @property {any} brand.globalGuidelines
 * @property {any} brand.localAdaptations
 * @property {any} brand.messagingFramework
 * @property {Object} legal
 * @property {string[]} legal.copyrightRequirements
 * @property {string[]} legal.trademarkGuidelines
 * @property {string[]} legal.disclaimerRequirements
 */

/**
 * @typedef {Object} MLRContext
 * @property {string} assetId
 * @property {string} brandId
 * @property {CampaignContext} campaignContext
 * @property {StrategicContext} strategicContext
 * @property {ContentContext} contentContext
 * @property {HistoricalMLRContext} historicalContext
 * @property {RiskProfile} riskProfile
 * @property {ComplianceRequirements} complianceRequirements
 */

class MLRContextService {
  constructor() {
    this.veevaService = VeevaVaultService;
  }

  /**
   * Builds a comprehensive context object for an MLR review by aggregating data
   * from various sources.
   * @param {string} assetId
   * @param {string} brandId
   * @returns {Promise<MLRContext>}
   */
  async buildComprehensiveContext(assetId, brandId) {
    try {
      // Gather context from all modules
      const [
        campaignContext,
        strategicContext, 
        contentContext,
        historicalContext,
        riskProfile,
        complianceRequirements
      ] = await Promise.all([
        this.buildCampaignContext(assetId),
        this.buildStrategicContext(brandId),
        this.buildContentContext(assetId),
        this.buildHistoricalContext(brandId, assetId),
        this.assessRiskProfile(assetId, brandId),
        this.getComplianceRequirements(brandId)
      ]);

      return {
        assetId,
        brandId,
        campaignContext,
        strategicContext,
        contentContext,
        historicalContext,
        riskProfile,
        complianceRequirements
      };
    } catch (error) {
      console.error('Error building MLR context:', error);
      return this.buildFallbackContext(assetId, brandId);
    }
  }

  /**
   * Builds context related to the marketing campaign.
   * @private
   * @param {string} assetId
   * @returns {Promise<CampaignContext>}
   */
  async buildCampaignContext(assetId) {
    // Simulating data retrieval from an external module/bridge
    const initiativeContext = moduleBridge.getModuleContext('initiative-hub');
    
    return {
      campaignName: initiativeContext?.campaignName || 'Unknown Campaign',
      objectives: initiativeContext?.objectives || ['Increase awareness', 'Drive engagement'],
      targetAudience: initiativeContext?.targetAudience || ['Healthcare Professionals'],
      channels: initiativeContext?.channels || ['Email', 'Digital'],
      timeline: {
        start: initiativeContext?.timeline?.start || new Date().toISOString(),
        end: initiativeContext?.timeline?.end || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        mlrDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      budgetTier: initiativeContext?.budgetTier || 'medium',
      priority: initiativeContext?.priority || 'normal'
    };
  }

  /**
   * Builds strategic and therapeutic context.
   * @private
   * @param {string} brandId
   * @returns {Promise<StrategicContext>}
   */
  async buildStrategicContext(brandId) {
    // Simulating data retrieval from an external module/bridge
    const strategyContext = moduleBridge.getModuleContext('strategy-insights');
    
    return {
      keyMessages: strategyContext?.keyMessages || await this.getDefaultKeyMessages(brandId),
      competitorLandscape: strategyContext?.competitors || [],
      therapeuticArea: this.mapBrandToTherapeuticArea(brandId),
      diseaseState: this.mapBrandToDiseaseState(brandId),
      treatmentPosition: strategyContext?.position || 'First-line therapy',
      clinicalEvidence: strategyContext?.evidence || [],
      brandPersonality: strategyContext?.brandPersonality || ['Scientific', 'Trustworthy', 'Innovative']
    };
  }

  /**
   * Builds context related to the specific content asset.
   * @private
   * @param {string} assetId
   * @returns {Promise<ContentContext>}
   */
  async buildContentContext(assetId) {
    // Simulating data retrieval from an external module/bridge
    const contentContext = moduleBridge.getModuleContext('content-studio');
    
    return {
      assetType: contentContext?.selectedAsset?.type || 'Email',
      contentStructure: contentContext?.contentStructure || {},
      brandGuidelines: contentContext?.brandGuidelines || {},
      previousVersions: contentContext?.versions || [],
      relatedAssets: contentContext?.relatedAssets || [],
      templateSource: contentContext?.templateSource || 'Custom',
      customizations: contentContext?.customizations || []
    };
  }

  /**
   * Builds context based on historical MLR reviews.
   * @private
   * @param {string} brandId
   * @param {string} assetId
   * @returns {Promise<HistoricalMLRContext>}
   */
  async buildHistoricalContext(brandId, assetId) {
    // Simulate fetching historical MLR data
    const historicalData = await this.fetchHistoricalMLRData(brandId);
    
    return {
      previousReviews: historicalData.reviews || this.generateMockReviews(brandId),
      commonIssues: historicalData.commonIssues || this.getCommonIssues(brandId),
      reviewerPreferences: historicalData.reviewerPrefs || this.getReviewerPreferences(),
      brandSpecificPatterns: historicalData.brandPatterns || this.getBrandPatterns(brandId),
      successPatterns: historicalData.successPatterns || this.getSuccessPatterns()
    };
  }

  /**
   * Assesses the risk profile of the asset.
   * @private
   * @param {string} assetId
   * @param {string} brandId
   * @returns {Promise<RiskProfile>}
   */
  async assessRiskProfile(assetId, brandId) {
    /** @type {RiskFactor[]} */
    const riskFactors = [
      {
        category: 'Content Risk',
        description: 'Presence of comparative or superlative claims',
        impact: 'high',
        likelihood: 'medium',
        mitigation: 'Provide robust clinical evidence or modify language'
      },
      {
        category: 'Regulatory Risk', 
        description: 'Off-label indication suggestions',
        impact: 'critical',
        likelihood: 'low',
        mitigation: 'Ensure all claims align with FDA-approved labeling'
      },
      {
        category: 'Timeline Risk',
        description: 'Tight MLR deadline with complex content',
        impact: 'medium',
        likelihood: 'high',
        mitigation: 'Pre-validate high-risk content sections'
      }
    ];

    const overallRisk = this.calculateOverallRisk(riskFactors);
    const approvalProbability = this.estimateApprovalProbability(riskFactors, brandId);
    const turnaroundTime = this.estimateTurnaroundTime(riskFactors, brandId);

    return {
      overallRisk,
      riskFactors,
      mitigationStrategies: riskFactors.map(rf => rf.mitigation),
      estimatedApprovalProbability: approvalProbability,
      expectedTurnaroundTime: turnaroundTime
    };
  }

  /**
   * Fetches the official compliance requirements.
   * @private
   * @param {string} brandId
   * @returns {Promise<ComplianceRequirements>}
   */
  async getComplianceRequirements(brandId) {
    // Simulating fetching guidelines from Veeva Vault or a similar service
    const brandGuidelines = await this.veevaService.fetchBrandGuidelines(brandId);
    
    return {
      regulatory: {
        region: 'US',
        applicableGuidelines: ['FDA Guidance on DTC', 'PhRMA Code', '21 CFR Part 202'],
        mandatoryDisclosures: ['Important Safety Information', 'Prescribing Information'],
        forbiddenClaims: ['Cure', 'Safe', 'No side effects']
      },
      brand: {
        globalGuidelines: brandGuidelines?.global || {},
        localAdaptations: brandGuidelines?.local || {},
        messagingFramework: brandGuidelines?.messaging || {}
      },
      legal: {
        copyrightRequirements: ['© 2024 Company Name', 'All rights reserved'],
        trademarkGuidelines: ['Proper trademark notation', 'Approved usage only'],
        disclaimerRequirements: ['Privacy policy', 'Terms of use']
      }
    };
  }

  // --- Helper Methods ---

  /**
   * Maps a brand ID to its therapeutic area (mock).
   * @private
   * @param {string} brandId
   * @returns {string}
   */
  mapBrandToTherapeuticArea(brandId) {
    const mapping = {
      'ofev': 'Respiratory',
      'pradaxa': 'Cardiology', 
      'jardiance': 'Diabetes'
    };
    return mapping[brandId] || 'Unknown';
  }

  /**
   * Maps a brand ID to its disease state (mock).
   * @private
   * @param {string} brandId
   * @returns {string}
   */
  mapBrandToDiseaseState(brandId) {
    const mapping = {
      'ofev': 'Idiopathic Pulmonary Fibrosis',
      'pradaxa': 'Atrial Fibrillation',
      'jardiance': 'Type 2 Diabetes'
    };
    return mapping[brandId] || 'Unknown';
  }

  /**
   * Gets default key messages for a brand (mock).
   * @private
   * @param {string} brandId
   * @returns {Promise<string[]>}
   */
  async getDefaultKeyMessages(brandId) {
    const messages = {
      'ofev': [
        'OFEV significantly slows IPF progression',
        'Proven efficacy in clinical trials',
        'Well-established safety profile'
      ]
    };
    return messages[brandId] || [];
  }

  /**
   * Calculates the overall risk level based on risk factors.
   * @private
   * @param {RiskFactor[]} riskFactors
   * @returns {'low' | 'medium' | 'high' | 'critical'}
   */
  calculateOverallRisk(riskFactors) {
    const riskScore = riskFactors.reduce((score, factor) => {
      const impactScore = { low: 1, medium: 2, high: 3, critical: 4 };
      const likelihoodScore = { low: 1, medium: 2, high: 3 };
      return score + (impactScore[factor.impact] * likelihoodScore[factor.likelihood]);
    }, 0);

    if (riskFactors.some(rf => rf.impact === 'critical')) return 'critical';
    if (riskScore > 15) return 'high';
    if (riskScore > 8) return 'medium';
    return 'low';
  }

  /**
   * Estimates the probability of approval based on risk.
   * @private
   * @param {RiskFactor[]} riskFactors
   * @param {string} brandId
   * @returns {number}
   */
  estimateApprovalProbability(riskFactors, brandId) {
    const baseApprovalRate = 0.75; // 75% base approval rate
    const riskPenalty = riskFactors.reduce((penalty, factor) => {
      const impactPenalty = { low: 0.02, medium: 0.05, high: 0.10, critical: 0.20 };
      return penalty + impactPenalty[factor.impact];
    }, 0);

    return Math.max(0.1, Math.min(0.95, baseApprovalRate - riskPenalty));
  }

  /**
   * Estimates the expected turnaround time in hours.
   * @private
   * @param {RiskFactor[]} riskFactors
   * @param {string} brandId
   * @returns {number}
   */
  estimateTurnaroundTime(riskFactors, brandId) {
    const baseTurnaround = 48; // 48 hours base
    const complexityMultiplier = riskFactors.length * 0.2;
    const riskMultiplier = riskFactors.some(rf => rf.impact === 'critical') ? 1.5 : 1.0;
    
    return Math.round(baseTurnaround * (1 + complexityMultiplier) * riskMultiplier);
  }

  // --- Mock Data Generators ---

  /**
   * Generates mock MLR review records.
   * @private
   * @param {string} brandId
   * @returns {MLRReview[]}
   */
  generateMockReviews(brandId) {
    return [
      {
        id: 'review_001',
        assetId: 'asset_001', 
        reviewDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        reviewer: {
          name: 'Dr. Sarah Johnson',
          role: 'medical',
          department: 'Medical Affairs'
        },
        outcome: 'approved_with_changes',
        issues: [
          {
            id: 'issue_001',
            category: 'claims',
            severity: 'major',
            description: 'Comparative claim requires additional substantiation',
            suggestion: 'Provide head-to-head clinical data or modify language',
            isResolved: true,
            resolutionNotes: 'Modified language to remove direct comparison'
          }
        ],
        turnaroundTime: 24,
        satisfactionScore: 4
      }
    ];
  }

  /**
   * Gets common MLR issue patterns (mock).
   * @private
   * @param {string} brandId
   * @returns {IssuePattern[]}
   */
  getCommonIssues(brandId) {
    return [
      {
        type: 'Unsubstantiated Claims', 
        frequency: 0.35,
        description: 'Claims without adequate clinical evidence',
        preventionGuidance: 'Always provide peer-reviewed citations for efficacy claims',
        exampleText: ['clinically proven', 'superior efficacy']
      },
      {
        type: 'Missing Fair Balance',
        frequency: 0.28,
        description: 'Safety information not balanced with efficacy claims',
        preventionGuidance: 'Include appropriate risk information when making benefit claims',
        exampleText: ['well-tolerated without context']
      }
    ];
  }

  /**
   * Gets typical reviewer preferences (mock).
   * @private
   * @returns {ReviewerPreference[]}
   */
  getReviewerPreferences() {
    return [
      {
        reviewerId: 'reviewer_001',
        reviewerRole: 'medical',
        preferences: {
          citationStyle: 'AMA',
          claimSubstantiation: 'strict',
          communicationStyle: 'detailed',
          focusAreas: ['Clinical evidence', 'Statistical claims']
        },
        responsePatterns: {
          typicalTurnaround: 36,
          approvalRate: 0.68,
          commonFeedback: ['Provide stronger clinical evidence', 'Clarify statistical significance']
        }
      }
    ];
  }

  /**
   * Gets brand-specific MLR patterns (mock).
   * @private
   * @param {string} brandId
   * @returns {BrandPattern[]}
   */
  getBrandPatterns(brandId) {
    return [
      {
        brandId,
        commonIssues: ['Comparative claims', 'Safety language'],
        approvedLanguage: ['In clinical studies', 'As demonstrated in trials'],
        forbiddenTerms: ['cure', 'safe', 'no side effects'],
        preferredEvidence: ['Phase 3 RCTs', 'Meta-analyses'],
        regulatoryConsiderations: ['FDA labeling alignment', 'Fair balance requirements']
      }
    ];
  }

  /**
   * Gets success patterns for various asset types (mock).
   * @private
   * @returns {SuccessPattern[]}
   */
  getSuccessPatterns() {
    return [
      {
        assetType: 'Email',
        characteristics: ['Balanced messaging', 'Strong evidence base', 'Clear disclaimers'],
        approvalProbability: 0.82,
        keySuccessFactors: ['Proper citations', 'Fair balance', 'Regulatory compliance'],
        exampleLanguage: ['In clinical studies of X patients', 'Please see Important Safety Information']
      }
    ];
  }

  /**
   * Simulates fetching historical data from Veeva Vault.
   * @private
   * @param {string} brandId
   * @returns {Promise<any>}
   */
  async fetchHistoricalMLRData(brandId) {
    try {
      // Assuming VeevaVaultService.fetchMLRHistory returns historical data or throws an error
      return await this.veevaService.fetchMLRHistory(brandId);
    } catch (error) {
      // Return empty object on failure to allow mock data generation
      return {};
    }
  }

  /**
   * Builds a complete context object with default/fallback values in case of primary data failure.
   * @private
   * @param {string} assetId
   * @param {string} brandId
   * @returns {MLRContext}
   */
  buildFallbackContext(assetId, brandId) {
    return {
      assetId,
      brandId,
      campaignContext: {
        campaignName: 'Default Campaign',
        objectives: [],
        targetAudience: [],
        channels: [],
        timeline: {
          start: new Date().toISOString(),
          end: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
          mlrDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        budgetTier: 'medium',
        priority: 'normal'
      },
      strategicContext: {
        keyMessages: [],
        competitorLandscape: [],
        therapeuticArea: 'Unknown',
        diseaseState: 'Unknown',
        treatmentPosition: 'Unknown',
        clinicalEvidence: [],
        brandPersonality: []
      },
      contentContext: {
        assetType: 'Unknown',
        contentStructure: {},
        brandGuidelines: {},
        previousVersions: [],
        relatedAssets: [],
        templateSource: 'Unknown',
        customizations: []
      },
      historicalContext: {
        previousReviews: [],
        commonIssues: [],
        reviewerPreferences: [],
        brandSpecificPatterns: [],
        successPatterns: []
      },
      riskProfile: {
        overallRisk: 'medium',
        riskFactors: [],
        mitigationStrategies: [],
        estimatedApprovalProbability: 0.7,
        expectedTurnaroundTime: 48
      },
      complianceRequirements: {
        regulatory: {
          region: 'Unknown',
          applicableGuidelines: [],
          mandatoryDisclosures: [],
          forbiddenClaims: []
        },
        brand: {
          globalGuidelines: {},
          localAdaptations: {},
          messagingFramework: {}
        },
        legal: {
          copyrightRequirements: [],
          trademarkGuidelines: [],
          disclaimerRequirements: []
        }
      }
    };
  }
}

export const mlrContextService = new MLRContextService();