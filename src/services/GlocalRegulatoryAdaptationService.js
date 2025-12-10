// GLOCAL Regulatory Adaptation Service
// Ensures content complies with market-specific regulatory requirements

// NOTE: The path '@/integrations/supabase/client' is a TypeScript alias.
// Assuming it's in a relative path for a standard JS environment.
import { supabase } from './integrations/supabase/client';

// The interfaces (RegulatoryRequirement, ComplianceCheck, ComplianceIssue)
// are removed, and the structures are implied by the data used.

export class GlocalRegulatoryAdaptationService {
  // Market-specific regulatory requirements
  static requirements = {
    'United States': [
      {
        id: 'us-fda-1',
        type: 'fair_balance',
        description: 'Fair balance between benefits and risks required',
        market: 'United States',
        regulatoryBody: 'FDA/OPDP',
        mandatory: true,
        penaltyForNonCompliance: 'Warning letter or enforcement action'
      },
      {
        id: 'us-fda-2',
        type: 'claim_substantiation',
        description: 'All claims must be substantiated by clinical data',
        market: 'United States',
        regulatoryBody: 'FDA',
        mandatory: true,
        penaltyForNonCompliance: 'Product recall or legal action'
      },
      {
        id: 'us-fda-3',
        type: 'disclaimer',
        description: 'Required ISI (Important Safety Information)',
        market: 'United States',
        regulatoryBody: 'FDA',
        mandatory: true,
        penaltyForNonCompliance: 'Mandatory correction'
      }
    ],
    'European Union': [
      {
        id: 'eu-ema-1',
        type: 'fair_balance',
        description: 'Balanced presentation of benefits and risks',
        market: 'European Union',
        regulatoryBody: 'EMA',
        mandatory: true,
        penaltyForNonCompliance: 'Material withdrawal'
      },
      {
        id: 'eu-ema-2',
        type: 'labeling',
        description: 'Multilingual labeling requirements',
        market: 'European Union',
        regulatoryBody: 'EMA',
        mandatory: true,
        penaltyForNonCompliance: 'Distribution ban'
      }
    ],
    'Japan': [
      {
        id: 'jp-pmda-1',
        type: 'approval',
        description: 'PMDA pre-approval required for promotional materials',
        market: 'Japan',
        regulatoryBody: 'PMDA',
        mandatory: true,
        penaltyForNonCompliance: 'Material ban and fines'
      },
      {
        id: 'jp-pmda-2',
        type: 'claim_substantiation',
        description: 'Claims must align exactly with approved indications',
        market: 'Japan',
        regulatoryBody: 'PMDA',
        mandatory: true,
        penaltyForNonCompliance: 'Enforcement action'
      }
    ]
  };

  /**
   * Check regulatory compliance for content segment
   * @param {object} segment - The content segment object.
   * @param {string} targetMarket - The target market name.
   * @returns {Promise<object>} The compliance check report.
   */
  static async checkCompliance(
    segment,
    targetMarket
  ) {
    const requirements = this.requirements[targetMarket] || [];
    const issues = [];
    const recommendations = [];
    const requiredActions = [];

    // Check each requirement
    for (const req of requirements) {
      const issue = this.checkRequirement(segment, req);
      if (issue) {
        issues.push(issue);
        if (issue.severity === 'critical' || issue.severity === 'high') {
          requiredActions.push(issue.suggestedFix);
        }
      }
    }

    // Generate recommendations
    recommendations.push(...this.generateRecommendations(segment, targetMarket, issues));

    // Calculate compliance score
    const complianceScore = this.calculateComplianceScore(issues, requirements.length);
    const riskLevel = this.determineRiskLevel(issues);

    const check = {
      segmentId: segment.id,
      market: targetMarket,
      complianceScore,
      riskLevel,
      issues,
      recommendations,
      requiredActions
    };

    // Store compliance check
    await this.storeComplianceCheck(segment, targetMarket, check);

    return check;
  }

  /**
   * Generate compliance report for project
   * @param {string} projectId - The project ID.
   * @param {string[]} targetMarkets - Array of target market names.
   * @returns {Promise<Record<string, object[]>>} The complete compliance report.
   */
  static async generateComplianceReport(
    projectId,
    targetMarkets
  ) {
    const report = {};

    // Get all segments
    const { data: segments } = await supabase
      .from('glocal_content_segments')
      .select('*')
      .eq('project_id', projectId);

    if (!segments) return report;

    // Check each market
    for (const market of targetMarkets) {
      const marketChecks = [];

      for (const segment of segments) {
        // Removed `as any` casting
        const check = await this.checkCompliance(segment, market);
        marketChecks.push(check);
      }

      report[market] = marketChecks;
    }

    return report;
  }

  /**
   * Get required disclaimers for market
   * @param {string} market - The target market name.
   * @param {string} therapeuticArea - The therapeutic area (e.g., 'Oncology').
   * @returns {Array<object>} List of required disclaimers.
   */
  static getRequiredDisclaimers(
    market,
    therapeuticArea
  ) {
    const disclaimers = [
      {
        title: 'Prescription Only',
        text: 'This medication is available by prescription only. Please consult your healthcare provider.',
        placement: 'footer'
      }
    ];

    if (market === 'United States') {
      disclaimers.push({
        title: 'Important Safety Information',
        text: 'Please see full Prescribing Information including Boxed Warning.',
        placement: 'prominent'
      });
    }

    if (therapeuticArea === 'Oncology') {
      disclaimers.push({
        title: 'Serious Risks Warning',
        text: 'This medication may cause serious side effects including risk of infection and death.',
        placement: 'prominent'
      });
    }

    return disclaimers;
  }

  /**
   * Validate claims against regulatory requirements
   * @param {string[]} claims - List of claims to validate.
   * @param {string} market - The target market name.
   * @returns {object} Object with valid and flagged claims.
   */
  static validateClaims(
    claims,
    market
  ) {
    const validClaims = [];
    const flaggedClaims = [];

    const prohibitedWords = {
      'United States': ['cure', 'guarantee', 'miracle', 'safe', 'best'],
      'European Union': ['cure', 'guaranteed', 'completely safe'],
      'Japan': ['cure', 'absolutely', 'guaranteed']
    };

    const marketProhibited = prohibitedWords[market] || [];

    claims.forEach(claim => {
      const lowerClaim = claim.toLowerCase();
      const hasProhibited = marketProhibited.some(word => lowerClaim.includes(word));

      if (hasProhibited) {
        flaggedClaims.push({
          claim,
          reason: `Contains prohibited terminology for ${market} market`
        });
      } else {
        validClaims.push(claim);
      }
    });

    return { validClaims, flaggedClaims };
  }

  // Private helper methods

  /**
   * @private
   */
  static checkRequirement(
    segment,
    requirement
  ) {
    // const text = segment.source_text.toLowerCase(); // not used in switch
    switch (requirement.type) {
      case 'fair_balance':
        return this.checkFairBalance(segment, requirement);

      case 'claim_substantiation':
        return this.checkClaimSubstantiation(segment, requirement);

      case 'disclaimer':
        return this.checkDisclaimer(segment, requirement);

      default:
        return null;
    }
  }

  /**
   * @private
   */
  static checkFairBalance(
    segment,
    requirement
  ) {
    const text = segment.source_text.toLowerCase();
    const hasBenefits = ['effective', 'improved', 'better', 'benefit'].some(word => text.includes(word));
    const hasRisks = ['risk', 'side effect', 'adverse', 'warning'].some(word => text.includes(word));

    if (hasBenefits && !hasRisks && segment.segment_type !== 'disclaimer') {
      return {
        type: 'fair_balance',
        severity: 'critical',
        description: 'Benefits mentioned without corresponding risk information',
        requirement: requirement.description,
        suggestedFix: 'Add balanced risk information or include reference to full safety information'
      };
    }

    return null;
  }

  /**
   * @private
   */
  static checkClaimSubstantiation(
    segment,
    requirement
  ) {
    const text = segment.source_text.toLowerCase();
    const hasClaim = ['proven', 'demonstrated', 'shown to', 'reduces', 'improves'].some(word => text.includes(word));
    const hasReference = text.includes('study') || text.includes('trial') || text.includes('data');

    if (hasClaim && !hasReference) {
      return {
        type: 'claim_substantiation',
        severity: 'high',
        description: 'Claim made without substantiation reference',
        requirement: requirement.description,
        suggestedFix: 'Add reference to supporting clinical data or modify claim language'
      };
    }

    return null;
  }

  /**
   * @private
   */
  static checkDisclaimer(
    segment,
    requirement
  ) {
    if (segment.segment_type === 'hero' || segment.segment_type === 'headline') {
      // This is a simplified check assuming disclaimers are globally required on promotional headers.
      // In a real system, you'd check if a disclaimer text is *present* nearby.
      return {
        type: 'disclaimer',
        severity: 'high',
        description: 'Promotional content missing required disclaimer (check surrounding text)',
        requirement: requirement.description,
        suggestedFix: 'Ensure required safety information or disclaimer is prominent and accessible near the promotional segment'
      };
    }

    return null;
  }

  /**
   * @private
   */
  static generateRecommendations(
    segment,
    market,
    issues
  ) {
    const recommendations = [];

    if (issues.length === 0) {
      recommendations.push('Content appears compliant - proceed to final review');
    } else {
      const criticalCount = issues.filter(i => i.severity === 'critical').length;
      const highCount = issues.filter(i => i.severity === 'high').length;

      if (criticalCount > 0) {
        recommendations.push(`Address ${criticalCount} critical compliance issue(s) before proceeding`);
      }

      if (highCount > 0) {
        recommendations.push(`Resolve ${highCount} high-priority issue(s) for market approval`);
      }

      recommendations.push(`Consult with local regulatory team for ${market} market`);
      recommendations.push('Consider MLR (Medical/Legal/Regulatory) review before finalization');
    }

    return recommendations;
  }

  /**
   * @private
   */
  static calculateComplianceScore(issues, totalRequirements) {
    if (totalRequirements === 0) return 100;

    let deductions = 0;
    issues.forEach(issue => {
      switch (issue.severity) {
        case 'critical': deductions += 30; break;
        case 'high': deductions += 20; break;
        case 'medium': deductions += 10; break;
        case 'low': deductions += 5; break;
      }
    });

    return Math.max(0, 100 - deductions);
  }

  /**
   * @private
   */
  static determineRiskLevel(issues) {
    const hasCritical = issues.some(i => i.severity === 'critical');
    const hasHigh = issues.some(i => i.severity === 'high');

    if (hasCritical) return 'high';
    if (hasHigh) return 'high';
    if (issues.length > 0) return 'medium';
    return 'low';
  }

  /**
   * @private
   */
  static async storeComplianceCheck(
    segment,
    targetMarket,
    check
  ) {
    try {
      // Check if entry exists (Note: this check should ideally be per segment, not per market,
      // but following the original TypeScript logic structure for simplicity.)
      const { data: existing } = await supabase
        .from('glocal_regulatory_compliance')
        .select('id')
        .eq('project_id', segment.project_id)
        .eq('target_market', targetMarket)
        .single();

      const complianceData = {
        project_id: segment.project_id,
        target_market: targetMarket,
        regulatory_body: this.getRegulatoryBody(targetMarket),
        // Casting removed, but these fields should match the schema expectations in Supabase
        compliance_requirements: check.issues.map(i => ({ requirement: i.requirement })),
        fair_balance_assessment: {
          passed: !check.issues.some(i => i.type === 'fair_balance'),
          details: 'Balance assessment completed'
        },
        claims_validation: check.issues.filter(i => i.type === 'claim_substantiation'),
        required_disclaimers: this.getRequiredDisclaimers(targetMarket, 'General').map(d => ({
          title: d.title,
          text: d.text
        })),
        compliance_score: check.complianceScore,
        risk_level: check.riskLevel,
        compliance_issues: check.issues,
        recommendations: check.recommendations.map(r => ({ recommendation: r })),
        compliance_metadata: {}
      };

      if (existing) {
        await supabase
          .from('glocal_regulatory_compliance')
          .update(complianceData)
          .eq('id', existing.id);
      } else {
        // Insert needs segment_id which exists in the table
        await supabase.from('glocal_regulatory_compliance').insert({
          ...complianceData,
          segment_id: segment.id
        });
      }
    } catch (error) {
      console.error('Error storing compliance check:', error);
    }
  }

  /**
   * @private
   */
  static getRegulatoryBody(market) {
    const bodies = {
      'United States': 'FDA',
      'European Union': 'EMA',
      'Japan': 'PMDA',
      'China': 'NMPA',
      'Canada': 'Health Canada'
    };

    return bodies[market] || 'Local Regulatory Authority';
  }
}