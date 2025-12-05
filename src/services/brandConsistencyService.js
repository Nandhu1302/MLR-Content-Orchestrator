// Placeholder for external dependencies (assuming it is initialized elsewhere)
// const supabase = {
//   from: () => ({ select: () => ({ eq: () => ({ single: () => ({ data: {} }) }), insert: () => ({}) }) })
// };
import { supabase } from '@/integrations/supabase/client';

/**
 * @typedef {'messaging' | 'tone' | 'visual' | 'regulatory'} BrandCategory
 * @typedef {'low' | 'medium' | 'high' | 'critical'} BrandSeverity
 * @typedef {'compliant' | 'needs_review' | 'non_compliant'} ComplianceStatus
 */

/**
 * @typedef {object} BrandIssue
 * @property {BrandCategory} category
 * @property {BrandSeverity} severity
 * @property {string} description
 * @property {string} suggestion
 * @property {string} location
 */

/**
 * @typedef {object} BrandConsistencyResult
 * @property {number} overallScore
 * @property {number} messagingScore
 * @property {number} toneScore
 * @property {number} visualScore
 * @property {number} regulatoryScore
 * @property {BrandIssue[]} issues
 * @property {string[]} strengths
 * @property {string[]} recommendations
 * @property {ComplianceStatus} status
 */

/**
 * @typedef {object} BrandDifference
 * @property {string} field
 * @property {any} globalValue
 * @property {any} localValue
 * @property {'low' | 'medium' | 'high'} impact
 * @property {string} recommendation
 */

/**
 * @typedef {object} BrandComparison
 * @property {any} globalVersion
 * @property {any} localVersion
 * @property {BrandDifference[]} differences
 * @property {number} similarityScore
 */

export class BrandConsistencyService {
  /**
   * Comprehensive brand consistency validation across all content elements
   * @param {string} assetId
   * @param {string} brandId
   * @param {string[]} [targetMarkets]
   * @param {object} [context]
   * @param {any} [context.campaignContext]
   * @param {any} [context.themeContext]
   * @param {any} [context.assetContext]
   * @returns {Promise<BrandConsistencyResult>}
   */
  static async validateBrandConsistency(
    assetId,
    brandId,
    targetMarkets,
    context
  ) {
    try {
      // Get asset data
      const { data: asset, error: assetError } = await supabase
        .from('content_assets')
        .select('*')
        .eq('id', assetId)
        .single();

      if (assetError) throw assetError;

      // Get brand guidelines
      const { data: guidelines, error: guidelinesError } = await supabase
        .from('brand_guidelines')
        .select('*')
        .eq('brand_id', brandId)
        .single();

      if (guidelinesError) throw guidelinesError;

      // Get brand vision
      const { data: vision, error: visionError } = await supabase
        .from('brand_vision')
        .select('*')
        .eq('brand_id', brandId)
        .single();

      if (visionError) throw visionError;

      // Perform validation with market context
      const messagingScore = this.validateMessaging(asset, guidelines, vision, targetMarkets, context);
      const toneScore = this.validateTone(asset, guidelines, targetMarkets, context);
      const visualScore = this.validateVisualElements(asset, guidelines, targetMarkets, context);
      const regulatoryScore = this.validateRegulatoryCompliance(asset, brandId, targetMarkets, context);

      const overallScore = Math.round(
        (messagingScore.score + toneScore.score + visualScore.score + regulatoryScore.score) / 4
      );

      /** @type {BrandIssue[]} */
      const issues = [
        ...messagingScore.issues,
        ...toneScore.issues,
        ...visualScore.issues,
        ...regulatoryScore.issues
      ];

      /** @type {string[]} */
      const strengths = [
        ...messagingScore.strengths,
        ...toneScore.strengths,
        ...visualScore.strengths,
        ...regulatoryScore.strengths
      ];

      const recommendations = this.generateRecommendations(issues, overallScore);
      const status = this.determineComplianceStatus(overallScore, issues);

      return {
        overallScore,
        messagingScore: messagingScore.score,
        toneScore: toneScore.score,
        visualScore: visualScore.score,
        regulatoryScore: regulatoryScore.score,
        issues,
        strengths,
        recommendations,
        status
      };
    } catch (error) {
      console.error('Error validating brand consistency:', error);
      throw error;
    }
  }

  /**
   * Compares a global asset version against a local asset version.
   * @param {string} globalAssetId
   * @param {string} localAssetId
   * @returns {Promise<BrandComparison>}
   */
  static async compareVersions(
    globalAssetId,
    localAssetId
  ) {
    try {
      const { data: globalAsset } = await supabase
        .from('content_assets')
        .select('*')
        .eq('id', globalAssetId)
        .single();

      const { data: localAsset } = await supabase
        .from('content_assets')
        .select('*')
        .eq('id', localAssetId)
        .single();

      const differences = this.identifyDifferences(globalAsset, localAsset);
      const similarityScore = this.calculateSimilarityScore(differences);

      return {
        globalVersion: globalAsset,
        localVersion: localAsset,
        differences,
        similarityScore
      };
    } catch (error) {
      console.error('Error comparing versions:', error);
      throw error;
    }
  }

  /**
   * Creates an audit alert for critical brand violations.
   * @param {string} assetId
   * @param {string} brandId
   * @param {BrandIssue[]} issues
   * @returns {Promise<void>}
   */
  static async createBrandGuardianAlert(
    assetId,
    brandId,
    issues
  ) {
    const criticalIssues = issues.filter(issue => issue.severity === 'critical');
    
    if (criticalIssues.length > 0) {
      await supabase.from('audit_logs').insert({
        table_name: 'content_assets',
        record_id: assetId,
        action_type: 'brand_violation',
        brand_id: brandId,
        new_data: {
          critical_issues_count: criticalIssues.length,
          severity: 'critical',
          brand_violation_type: 'consistency_check'
        }
      });
    }
  }

  /**
   * @private
   * @param {any} asset
   * @param {any} guidelines
   * @param {any} vision
   * @param {string[]} [targetMarkets]
   * @param {any} [context]
   * @returns {{ score: number, issues: BrandIssue[], strengths: string[] }}
   */
  static validateMessaging(asset, guidelines, vision, targetMarkets, context) {
    /** @type {BrandIssue[]} */
    const issues = [];
    /** @type {string[]} */
    const strengths = [];
    let score = 80;

    const content = asset.primary_content || {};
    const messaging = guidelines.messaging_framework || {};
    const keyMessages = messaging.key_messages || [];

    // Check key message alignment
    const headline = content.headline || '';
    const body = content.body || '';
    const combinedText = `${headline} ${body}`.toLowerCase();

    const alignedMessages = keyMessages.filter(
      /** @param {string} msg */
      (msg) => combinedText.includes(msg.toLowerCase())
    );

    if (alignedMessages.length === 0) {
      issues.push({
        category: 'messaging',
        severity: 'high',
        description: 'Content does not include any key brand messages',
        suggestion: `Consider incorporating these key messages: ${keyMessages.slice(0, 3).join(', ')}`,
        location: 'headline/body'
      });
      score -= 20;
    } else {
      strengths.push(`Incorporates ${alignedMessages.length} key brand messages`);
      score += 10;
    }

    // Check value proposition alignment
    const valueProposition = vision?.unique_value_proposition;
    if (valueProposition && !combinedText.includes(valueProposition.toLowerCase())) {
      issues.push({
        category: 'messaging',
        severity: 'medium',
        description: 'Content does not reflect unique value proposition',
        suggestion: `Consider highlighting: ${valueProposition}`,
        location: 'content strategy'
      });
      score -= 10;
    }

    return { score: Math.max(score, 0), issues, strengths };
  }

  /**
   * @private
   * @param {any} asset
   * @param {any} guidelines
   * @param {string[]} [targetMarkets]
   * @param {any} [context]
   * @returns {{ score: number, issues: BrandIssue[], strengths: string[] }}
   */
  static validateTone(asset, guidelines, targetMarkets, context) {
    /** @type {BrandIssue[]} */
    const issues = [];
    /** @type {string[]} */
    const strengths = [];
    let score = 75;

    const toneGuidelines = guidelines.tone_of_voice || {};
    const expectedTone = toneGuidelines.primary_tone || 'professional';
    const content = asset.primary_content || {};

    // Analyze tone in content
    const text = `${content.headline || ''} ${content.body || ''}`;
    const detectedTone = this.analyzeTone(text);

    if (detectedTone !== expectedTone) {
      issues.push({
        category: 'tone',
        severity: 'medium',
        description: `Tone mismatch: detected "${detectedTone}", expected "${expectedTone}"`,
        suggestion: `Adjust language to be more ${expectedTone}`,
        location: 'overall content'
      });
      score -= 15;
    } else {
      strengths.push(`Maintains consistent ${expectedTone} tone`);
      score += 10;
    }

    return { score: Math.max(score, 0), issues, strengths };
  }

  /**
   * @private
   * @param {any} asset
   * @param {any} guidelines
   * @param {string[]} [targetMarkets]
   * @param {any} [context]
   * @returns {{ score: number, issues: BrandIssue[], strengths: string[] }}
   */
  static validateVisualElements(asset, guidelines, targetMarkets, context) {
    /** @type {BrandIssue[]} */
    const issues = [];
    /** @type {string[]} */
    const strengths = [];
    let score = 70;

    const visualGuidelines = guidelines.visual_guidelines || {};
    const content = asset.primary_content || {};

    // Check color usage
    if (content.brandElements?.colors) {
      const approvedColors = visualGuidelines.approved_colors || [];
      const usedColors = content.brandElements.colors;
      
      const unapprovedColors = usedColors.filter(
        /** @param {string} color */
        (color) => !approvedColors.includes(color)
      );

      if (unapprovedColors.length > 0) {
        issues.push({
          category: 'visual',
          severity: 'high',
          description: `Unapproved colors used: ${unapprovedColors.join(', ')}`,
          suggestion: `Use approved brand colors: ${approvedColors.slice(0, 3).join(', ')}`,
          location: 'visual elements'
        });
        score -= 20;
      } else {
        strengths.push('Uses approved brand colors');
        score += 15;
      }
    }

    // Check logo usage
    if (content.brandElements?.logo) {
      strengths.push('Includes brand logo');
      score += 10;
    } else {
      issues.push({
        category: 'visual',
        severity: 'medium',
        description: 'Brand logo not present',
        suggestion: 'Add brand logo according to usage guidelines',
        location: 'visual identity'
      });
      score -= 10;
    }

    return { score: Math.max(score, 0), issues, strengths };
  }

  /**
   * @private
   * @param {any} asset
   * @param {string} brandId
   * @param {string[]} [targetMarkets]
   * @param {any} [context]
   * @returns {{ score: number, issues: BrandIssue[], strengths: string[] }}
   */
  static validateRegulatoryCompliance(asset, brandId, targetMarkets, context) {
    /** @type {BrandIssue[]} */
    const issues = [];
    /** @type {string[]} */
    const strengths = [];
    let score = 85;

    // Check for required disclaimers
    const content = asset.primary_content || {};
    const text = `${content.headline || ''} ${content.body || ''} ${content.disclaimer || ''}`;

    if (!text.toLowerCase().includes('important safety information')) {
      issues.push({
        category: 'regulatory',
        severity: 'critical',
        description: 'Missing required safety information disclaimer',
        suggestion: 'Add "Important Safety Information" section',
        location: 'legal disclaimer'
      });
      score -= 30;
    } else {
      strengths.push('Includes required safety information');
    }

    // Check for claims substantiation
    const claimWords = ['proven', 'guaranteed', 'best', 'most effective'];
    const hasUnsubstantiatedClaims = claimWords.some(word => 
      text.toLowerCase().includes(word)
    );

    if (hasUnsubstantiatedClaims) {
      issues.push({
        category: 'regulatory',
        severity: 'high',
        description: 'Potential unsubstantiated claims detected',
        suggestion: 'Ensure all claims are supported by clinical data',
        location: 'content claims'
      });
      score -= 20;
    }

    return { score: Math.max(score, 0), issues, strengths };
  }

  /**
   * @private
   * @param {any} globalAsset
   * @param {any} localAsset
   * @returns {BrandDifference[]}
   */
  static identifyDifferences(globalAsset, localAsset) {
    /** @type {BrandDifference[]} */
    const differences = [];
    
    const globalContent = globalAsset.primary_content || {};
    const localContent = localAsset.primary_content || {};

    // Compare key fields
    const fieldsToCompare = ['headline', 'body', 'cta_text', 'disclaimer'];
    
    for (const field of fieldsToCompare) {
      if (globalContent[field] !== localContent[field]) {
        differences.push({
          field,
          globalValue: globalContent[field],
          localValue: localContent[field],
          impact: this.assessImpact(field, globalContent[field], localContent[field]),
          recommendation: this.getRecommendation(field, globalContent[field], localContent[field])
        });
      }
    }

    return differences;
  }

  /**
   * @private
   * @param {BrandDifference[]} differences
   * @returns {number}
   */
  static calculateSimilarityScore(differences) {
    if (differences.length === 0) return 100;
    
    const impactWeights = { low: 5, medium: 15, high: 30 };
    const totalImpact = differences.reduce((sum, diff) => sum + impactWeights[diff.impact], 0);
    
    return Math.max(0, 100 - totalImpact);
  }

  /**
   * @private
   * @param {string} text
   * @returns {string}
   */
  static analyzeTone(text) {
    // Simple tone analysis based on keywords
    const formalWords = ['therefore', 'furthermore', 'consequently', 'accordingly'];
    const casualWords = ['hey', 'wow', 'awesome', 'cool'];
    const professionalWords = ['proven', 'evidence', 'clinical', 'research'];

    const lowerText = text.toLowerCase();
    const formalCount = formalWords.filter(word => lowerText.includes(word)).length;
    const casualCount = casualWords.filter(word => lowerText.includes(word)).length;
    const professionalCount = professionalWords.filter(word => lowerText.includes(word)).length;

    if (professionalCount > 0) return 'professional';
    if (formalCount > casualCount) return 'formal';
    if (casualCount > 0) return 'casual';
    return 'professional';
  }

  /**
   * @private
   * @param {BrandIssue[]} issues
   * @param {number} overallScore
   * @returns {string[]}
   */
  static generateRecommendations(issues, overallScore) {
    /** @type {string[]} */
    const recommendations = [];

    if (overallScore < 60) {
      recommendations.push('Consider major content revision to align with brand guidelines');
    }

    const criticalIssues = issues.filter(issue => issue.severity === 'critical');
    if (criticalIssues.length > 0) {
      recommendations.push('Address critical compliance issues before proceeding');
    }

    const messagingIssues = issues.filter(issue => issue.category === 'messaging');
    if (messagingIssues.length > 0) {
      recommendations.push('Review and incorporate key brand messages');
    }

    return recommendations;
  }

  /**
   * @private
   * @param {number} score
   * @param {BrandIssue[]} issues
   * @returns {ComplianceStatus}
   */
  static determineComplianceStatus(score, issues) {
    const criticalIssues = issues.filter(issue => issue.severity === 'critical');
    
    if (criticalIssues.length > 0) return 'non_compliant';
    if (score < 70) return 'needs_review';
    return 'compliant';
  }

  /**
   * @private
   * @param {string} field
   * @param {any} globalValue
   * @param {any} localValue
   * @returns {'low' | 'medium' | 'high'}
   */
  static assessImpact(field, globalValue, localValue) {
    if (field === 'headline') return 'high';
    if (field === 'body') return 'medium';
    if (field === 'disclaimer') return 'high';
    return 'low';
  }

  /**
   * @private
   * @param {string} field
   * @param {any} globalValue
   * @param {any} localValue
   * @returns {string}
   */
  static getRecommendation(field, globalValue, localValue) {
    return `Consider aligning local ${field} with global version while maintaining cultural relevance`;
  }
}