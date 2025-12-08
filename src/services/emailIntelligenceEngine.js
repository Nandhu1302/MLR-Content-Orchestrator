import { supabase } from "../integrations/supabase/client.js";

/**
 * @typedef {Object} IntelligenceFactors
 * @property {string} contentType
 * @property {boolean} hasStructuredData
 * @property {'simple' | 'moderate' | 'complex'} dataComplexity
 * @property {'HCP' | 'Patient' | 'Caregiver'} audienceType
 * @property {'expert' | 'intermediate' | 'general'} audienceExpertiseLevel
 * @property {'FDA' | 'EMA' | 'PMDA' | 'NMPA' | 'Other'} marketRegulation
 * @property {'promotional' | 'educational' | 'medical-information'} contentCategory
 * @property {Record<string, any>} [brandVisualPreferences]
 * @property {string[]} [approvedVisualStyles]
 */

/**
 * @typedef {Object} ComponentDecision
 * @property {string} decision
 * @property {string} rationale
 * @property {number} confidence
 */

/**
 * @typedef {Object} ComponentDecisions
 * @property {boolean} includeVisualizations
 * @property {boolean} includeTables
 * @property {boolean} includeImages
 * @property {number} confidence
 * @property {ComponentDecision[]} decisions
 * @property {string} optimalLayout
 */

export class EmailIntelligenceEngine {
  /**
   * Analyze email context and decide which components to include by invoking an external function.
   * @param {string} contentIntent - The primary goal of the content (e.g., 'clinical-update').
   * @param {'HCP' | 'Patient' | 'Caregiver'} targetAudience - The intended audience.
   * @param {string} therapeuticArea - The medical area of focus.
   * @param {any} structuredData - The clinical or non-clinical data to be included.
   * @param {string} regulatoryLevel - The perceived regulatory level (e.g., 'high', 'low').
   * @returns {Promise<ComponentDecisions>}
   */
  static async decideEmailComponents(
    contentIntent,
    targetAudience,
    therapeuticArea,
    structuredData,
    regulatoryLevel
  ) {
    try {
      const { data, error } = await supabase.functions.invoke('compose-multimodal-email', {
        body: {
          // This would be a specialized intelligence-only call
          mode: 'intelligence-only',
          contentIntent,
          targetAudience,
          therapeuticArea,
          hasData: !!structuredData,
          regulatoryLevel
        }
      });

      if (error) throw error;

      // The external function is expected to return data structured as ComponentDecisions
      /** @type {ComponentDecisions} */
      return data;
    } catch (error) {
      console.error('Intelligence engine error:', error);

      // Fallback to rule-based decisions if the function call fails
      return this.getRuleBasedDecisions(
        contentIntent,
        targetAudience,
        !!structuredData,
        regulatoryLevel
      );
    }
  }

  /**
   * Rule-based fallback for component decisions.
   * @private
   * @param {string} contentIntent
   * @param {string} targetAudience
   * @param {boolean} hasData
   * @param {string} regulatoryLevel
   * @returns {ComponentDecisions}
   */
  static getRuleBasedDecisions(
    contentIntent,
    targetAudience,
    hasData,
    regulatoryLevel
  ) {
    /** @type {ComponentDecision[]} */
    const decisions = [];

    // HCP Clinical Update
    if (targetAudience === 'HCP' && contentIntent === 'clinical-update') {
      decisions.push({
        decision: 'Include data visualizations',
        rationale: 'HCP audience expects visual representation of clinical data',
        confidence: 90
      });
      decisions.push({
        decision: 'Include detailed tables',
        rationale: 'Clinical professionals prefer detailed statistical tables',
        confidence: 95
      });

      return {
        includeVisualizations: hasData,
        includeTables: hasData,
        includeImages: false,
        confidence: 92,
        decisions,
        optimalLayout: 'professional-data-heavy'
      };
    }

    // Patient Education
    if (targetAudience === 'Patient') {
      decisions.push({
        decision: 'Include simple visualizations',
        rationale: 'Patients benefit from simplified visual representations',
        confidence: 85
      });
      decisions.push({
        decision: 'Exclude complex tables',
        rationale: 'Complex statistical tables may confuse patient audience',
        confidence: 90
      });
      decisions.push({
        decision: 'Include educational images',
        rationale: 'Visual aids improve patient understanding',
        confidence: 88
      });

      return {
        includeVisualizations: hasData,
        includeTables: false,
        includeImages: true,
        confidence: 87,
        decisions,
        optimalLayout: 'patient-friendly-visual'
      };
    }

    // Regulatory Announcement
    if (regulatoryLevel === 'high' || contentIntent === 'regulatory-announcement') {
      decisions.push({
        decision: 'Focus on text content',
        rationale: 'Regulatory content prioritizes clear textual information',
        confidence: 95
      });
      decisions.push({
        decision: 'Include compliance tables if data present',
        rationale: 'Regulatory data should be presented in structured format',
        confidence: 85
      });

      return {
        includeVisualizations: false,
        includeTables: hasData,
        includeImages: false,
        confidence: 90,
        decisions,
        optimalLayout: 'compliance-focused'
      };
    }

    // Default: Balanced approach
    decisions.push({
      decision: 'Balanced content approach',
      rationale: 'Use moderate visualizations with supporting text',
      confidence: 75
    });

    return {
      includeVisualizations: hasData,
      includeTables: hasData,
      includeImages: false,
      confidence: 75,
      decisions,
      optimalLayout: 'balanced'
    };
  }

  /**
   * Analyze data complexity.
   * @param {any} structuredData - The data object to analyze.
   * @returns {'simple' | 'moderate' | 'complex'}
   */
  static analyzeDataComplexity(structuredData) {
    if (!structuredData) return 'simple';

    const dataKeys = Object.keys(structuredData);
    const totalDataPoints = dataKeys.reduce((sum, key) => {
      const value = structuredData[key];
      if (Array.isArray(value)) return sum + value.length;
      if (typeof value === 'object' && value !== null) return sum + Object.keys(value).length;
      return sum + 1;
    }, 0);

    if (totalDataPoints < 10) return 'simple';
    if (totalDataPoints < 50) return 'moderate';
    return 'complex';
  }

  /**
   * Determine optimal template style.
   * @param {string} targetAudience - The intended audience.
   * @param {string} contentIntent - The primary content intent.
   * @param {string} dataComplexity - The complexity level of the data ('simple', 'moderate', 'complex').
   * @returns {'professional' | 'clinical' | 'patient-friendly'}
   */
  static determineTemplateStyle(
    targetAudience,
    contentIntent,
    dataComplexity
  ) {
    if (targetAudience === 'Patient') return 'patient-friendly';
    if (contentIntent === 'clinical-update' || dataComplexity === 'complex') return 'clinical';
    return 'professional';
  }
}