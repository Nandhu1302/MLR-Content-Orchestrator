import { supabase } from '@/integrations/supabase/client';

// TypeScript interfaces are removed, but the object structure is preserved.
/*
export interface RegulatoryRequirement { ... }
export interface ComplianceCheck { ... }
export interface RegulatoryAnalysis { ... }
export interface RegulatoryMatrix { ... }
export interface RegulatoryConstraint { ... }
*/

export class RegulatoryComplianceEngine {
  static MARKET_AUTHORITIES = {
    JP: 'PMDA (Pharmaceuticals and Medical Devices Agency)',
    CN: 'NMPA (National Medical Products Administration)',
    DE: 'BfArM (Federal Institute for Drugs and Medical Devices)',
    FR: 'ANSM (Agence Nationale de Sécurité du Médicament)',
    ES: 'AEMPS (Agencia Española de Medicamentos y Productos Sanitarios)',
    IT: 'AIFA (Agenzia Italiana del Farmaco)',
    BR: 'ANVISA (Agência Nacional de Vigilância Sanitária)',
    MX: 'COFEPRIS (Comisión Federal para la Protección contra Riesgos Sanitarios)'
  };

  static async analyzeAssetCompliance(
    assetId, // string type from TS removed
    brandId, // string type from TS removed
    targetMarkets // string[] type from TS removed
  ) {
    const analyses = [];

    for (const market of targetMarkets) {
      const analysis = await this.analyzeMarketCompliance(assetId, brandId, market);
      analyses.push(analysis);
    }

    return analyses;
  }

  static async analyzeMarketCompliance(
    assetId, // string type from TS removed
    brandId, // string type from TS removed
    market // string type from TS removed
  ) {
    // Get asset data
    const { data: asset } = await supabase
      .from('content_assets')
      .select('*')
      .eq('id', assetId)
      .single();

    // Get brand data for therapeutic area context
    const { data: brand } = await supabase
      .from('brand_profiles')
      .select('*')
      .eq('id', brandId)
      .single();

    // Generate market-specific requirements
    const requirements = this.getMarketRequirements(market, brand?.therapeutic_area);
    
    // Perform compliance checks
    const checks = [];
    let totalScore = 0;
    let maxScore = 0;

    for (const requirement of requirements) {
      const check = this.performComplianceCheck(asset, requirement);
      checks.push(check);
      
      if (check.status === 'compliant') totalScore += 100;
      else if (check.status === 'needs_review') totalScore += 50;
      maxScore += 100;
    }

    const overallCompliance = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 100;
    const complianceStatus = this.determineComplianceStatus(overallCompliance, checks);
    const criticalIssues = checks.filter(check => check.riskLevel === 'critical' || check.riskLevel === 'high');
    const nextSteps = this.generateNextSteps(checks, overallCompliance);
    const reviewRequired = criticalIssues.length > 0 || overallCompliance < 80;

    return {
      market,
      overallCompliance,
      complianceStatus,
      checks,
      criticalIssues,
      nextSteps,
      reviewRequired
    };
  }

  static generateRegulatoryMatrix(
    market, // string type from TS removed
    analysis, // RegulatoryAnalysis type from TS removed
    therapeuticArea // string type from TS removed
  ) {
    const mustChange = [];
    const cannotChange = [];
    const shouldChange = [];
    const flexibleElements = [];

    // Generate constraints based on compliance analysis
    analysis.checks.forEach(check => {
      if (check.status === 'non_compliant' && check.requirement.severity === 'mandatory') {
        mustChange.push({
          element: check.requirement.category,
          constraint: check.requirement.requirement,
          rationale: check.requirement.description,
          penalty: 'Regulatory rejection or legal action'
        });
      }
    });

    // Add market-specific constraints
    if (market === 'JP') {
      cannotChange.push(
        {
          element: 'Safety Information',
          constraint: 'Cannot modify or abbreviate required safety information',
          rationale: 'PMDA mandates exact safety language for pharmaceutical products',
          penalty: 'Product recall or market withdrawal'
        },
        {
          element: 'Clinical Data Claims',
          constraint: 'Cannot make claims not supported by Japan-specific clinical data',
          rationale: 'PMDA requires local clinical validation for efficacy claims',
          penalty: 'Marketing authorization suspension'
        }
      );

      mustChange.push(
        {
          element: 'Language Formality',
          constraint: 'Must use appropriate honorific language in patient-facing materials',
          rationale: 'Cultural and regulatory expectation for respectful communication',
          penalty: 'Professional conduct violation'
        }
      );

      shouldChange.push(
        {
          element: 'Visual Design',
          constraint: 'Should adapt visual hierarchy for Japanese reading patterns',
          rationale: 'Improves comprehension and regulatory review outcomes',
          penalty: 'Potential communication effectiveness issues'
        }
      );

      flexibleElements.push(
        'Color schemes (within brand guidelines)',
        'Layout adaptation for text expansion',
        'Cultural imagery and symbols',
        'Contact information formatting'
      );
    } else if (market === 'CN') {
      cannotChange.push(
        {
          element: 'Regulatory Text',
          constraint: 'Cannot modify NMPA-approved regulatory language',
          rationale: 'Exact compliance with NMPA labeling requirements mandatory',
          penalty: 'Market access denial or product ban'
        },
        {
          element: 'Brand Claims',
          constraint: 'Cannot make comparative claims without head-to-head studies',
          rationale: 'NMPA strictly regulates comparative advertising claims',
          penalty: 'Advertising ban and financial penalties'
        }
      );

      mustChange.push(
        {
          element: 'Character Set',
          constraint: 'Must use Simplified Chinese characters throughout',
          rationale: 'Regulatory requirement for mainland China marketing materials',
          penalty: 'Material rejection and resubmission required'
        }
      );

      shouldChange.push(
        {
          element: 'Cultural References',
          constraint: 'Should incorporate appropriate cultural context for medical communication',
          rationale: 'Improves patient understanding and regulatory acceptance',
          penalty: 'Reduced effectiveness and potential cultural sensitivity issues'
        }
      );

      flexibleElements.push(
        'Typography choices (within regulatory legibility requirements)',
        'Image selection (culturally appropriate)',
        'Layout formatting (maintaining hierarchy)',
        'Color adaptation (avoiding unlucky associations)'
      );
    }

    return {
      market,
      mustChange,
      cannotChange,
      shouldChange,
      flexibleElements
    };
  }

  static getMarketRequirements(market, therapeuticArea) { // market and therapeuticArea types from TS removed
    const requirements = [];
    const authority = this.MARKET_AUTHORITIES[market] || 'Local Health Authority';

    if (market === 'JP') {
      requirements.push(
        {
          id: 'jp-001',
          market: 'JP',
          category: 'safety',
          requirement: 'Include complete safety information in Japanese',
          severity: 'mandatory',
          description: 'All safety information must be translated and culturally adapted',
          guidance: 'Use formal Japanese medical terminology with appropriate honorifics',
          authority
        },
        {
          id: 'jp-002',
          market: 'JP',
          category: 'claims',
          requirement: 'Substantiate efficacy claims with Japan-specific data',
          severity: 'mandatory',
          description: 'Efficacy claims must be supported by clinical data from Japanese population',
          guidance: 'Reference J-specific clinical trials or bridging studies',
          authority
        },
        {
          id: 'jp-003',
          market: 'JP',
          category: 'labeling',
          requirement: 'Follow PMDA labeling format requirements',
          severity: 'mandatory',
          description: 'Specific format and content requirements for pharmaceutical labeling',
          guidance: 'Consult PMDA labeling guidance for therapeutic area',
          authority
        },
        {
          id: 'jp-004',
          market: 'JP',
          category: 'advertising',
          requirement: 'Comply with pharmaceutical advertising code',
          severity: 'recommended',
          description: 'Follow industry self-regulation guidelines for pharmaceutical advertising',
          guidance: 'Review JPMA advertising code compliance',
          authority: 'JPMA (Japan Pharmaceutical Manufacturers Association)'
        }
      );
    } else if (market === 'CN') {
      requirements.push(
        {
          id: 'cn-001',
          market: 'CN',
          category: 'labeling',
          requirement: 'Use NMPA-approved labeling format',
          severity: 'mandatory',
          description: 'Strict format requirements for pharmaceutical product labeling',
          guidance: 'Follow NMPA technical guidelines for labeling',
          authority
        },
        {
          id: 'cn-002',
          market: 'CN',
          category: 'claims',
          requirement: 'Avoid superlative claims without comparative data',
          severity: 'mandatory',
          description: 'Cannot use terms like "best," "most effective" without head-to-head studies',
          guidance: 'Use factual, evidence-based language only',
          authority
        },
        {
          id: 'cn-003',
          market: 'CN',
          category: 'advertising',
          requirement: 'Include required disclaimers and warnings',
          severity: 'mandatory',
          description: 'Specific disclaimer requirements for pharmaceutical advertising',
          guidance: 'Consult NMPA advertising regulations for required text',
          authority
        },
        {
          id: 'cn-004',
          market: 'CN',
          category: 'clinical',
          requirement: 'Reference China-approved indications only',
          severity: 'mandatory',
          description: 'Can only reference indications approved by NMPA in China',
          guidance: 'Verify current approved indications in NMPA database',
          authority
        }
      );
    }

    return requirements;
  }

  static performComplianceCheck(asset, requirement) { // asset and requirement types from TS removed
    const content = asset.primary_content || {};
    const text = `${content.headline || ''} ${content.body || ''} ${content.disclaimer || ''}`.toLowerCase();
    
    const findings = [];
    const recommendations = [];
    let status = 'compliant'; // ComplianceCheck['status'] type from TS removed
    let riskLevel = 'low'; // ComplianceCheck['riskLevel'] type from TS removed

    // Perform specific checks based on requirement category
    switch (requirement.category) {
      case 'safety':
        if (!text.includes('safety information') && !text.includes('important safety')) {
          findings.push('Missing required safety information section');
          recommendations.push('Add comprehensive safety information section');
          status = 'non_compliant';
          riskLevel = 'critical';
        }
        break;

      case 'claims':
        const superlatives = ['best', 'most effective', 'superior', 'guaranteed'];
        const hasSuperlatives = superlatives.some(word => text.includes(word));
        if (hasSuperlatives) {
          findings.push('Contains superlative claims that may require substantiation');
          recommendations.push('Review claims for regulatory compliance and substantiation');
          status = 'needs_review';
          riskLevel = 'high';
        }
        break;

      case 'labeling':
        if (!content.disclaimer || content.disclaimer.length < 50) {
          findings.push('Insufficient or missing regulatory disclaimer');
          recommendations.push('Add complete regulatory disclaimer per local requirements');
          status = 'non_compliant';
          riskLevel = 'high';
        }
        break;

      case 'advertising':
        if (text.includes('cure') || text.includes('guarantee')) {
          findings.push('Contains prohibited advertising language');
          recommendations.push('Remove prohibited terms and use approved medical terminology');
          status = 'non_compliant';
          riskLevel = 'critical';
        }
        break;

      case 'clinical':
        if (text.includes('indication') || text.includes('approved for')) {
          findings.push('References to indications require verification');
          recommendations.push('Verify all indication references against approved labeling');
          status = 'needs_review';
          riskLevel = 'medium';
        }
        break;
    }

    // If no issues found, provide positive findings
    if (status === 'compliant') {
      findings.push(`Compliant with ${requirement.requirement}`);
    }

    return {
      requirement,
      status,
      findings,
      recommendations,
      riskLevel
    };
  }

  static determineComplianceStatus(
    overallScore, // number type from TS removed
    checks // ComplianceCheck[] type from TS removed
  ) {
    const criticalIssues = checks.filter(check => 
      check.status === 'non_compliant' && check.riskLevel === 'critical'
    );
    
    if (criticalIssues.length > 0) return 'non_compliant';
    if (overallScore < 70) return 'needs_review';
    return 'compliant';
  }

  static generateNextSteps(checks, overallScore) { // checks and overallScore types from TS removed
    const steps = [];
    
    const criticalIssues = checks.filter(check => check.riskLevel === 'critical');
    const highRiskIssues = checks.filter(check => check.riskLevel === 'high');
    const reviewNeeded = checks.filter(check => check.status === 'needs_review');

    if (criticalIssues.length > 0) {
      steps.push('URGENT: Address critical compliance issues before proceeding');
      steps.push('Engage regulatory affairs team for immediate review');
    }

    if (highRiskIssues.length > 0) {
      steps.push('Review and resolve high-risk compliance items');
    }

    if (reviewNeeded.length > 0) {
      steps.push('Schedule regulatory review for flagged content areas');
    }

    if (overallScore < 80) {
      steps.push('Comprehensive regulatory review recommended before finalization');
    }

    if (steps.length === 0) {
      steps.push('No critical issues identified - proceed with standard review process');
    }

    steps.push('Maintain documentation of all regulatory decisions and changes');

    return steps;
  }

  static async monitorRegulatoryChanges(
    markets, // string[] type from TS removed
    therapeuticArea // string type from TS removed
  ) {
    // This would integrate with regulatory intelligence services in a real implementation
    // For now, return simulated alerts based on current regulatory landscape
    
    const alerts = markets.map(market => ({
      market,
      alerts: this.getRecentRegulatoryAlerts(market, therapeuticArea)
    }));

    return alerts;
  }

  static getRecentRegulatoryAlerts(market, therapeuticArea) { // market and therapeuticArea types from TS removed
    const alerts = [];
    
    if (market === 'JP') {
      alerts.push('PMDA updated safety reporting requirements for oncology products (effective Q2 2024)');
      alerts.push('New guidelines for patient-facing materials in digital format released');
    } else if (market === 'CN') {
      alerts.push('NMPA introduced new comparative advertising restrictions (effective Q1 2024)');
      alerts.push('Updated requirements for clinical data disclosure in promotional materials');
    }

    // Add therapeutic area specific alerts if provided
    if (therapeuticArea === 'oncology') {
      alerts.push('Global trend toward enhanced safety communication requirements for cancer treatments');
    } else if (therapeuticArea === 'cardiovascular') {
      alerts.push('Increased focus on real-world evidence in cardiovascular drug communications');
    }

    return alerts;
  }
}