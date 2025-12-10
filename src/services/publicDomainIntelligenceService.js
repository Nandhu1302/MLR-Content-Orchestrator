// ============================================
// Public Domain Intelligence Service
// Service for integrating public domain intelligence into content creation
// ============================================

// Note: Type imports are removed in standard JS
// import type { AssetType, AudienceType, IntakeData } from '@/types/intake';
// import { isHCPAudience } from '@/utils/audienceTypeHelpers';

/**
 * @typedef {string} AssetType - Examples: 'mass-email', 'rep-triggered-email', 'social-media-post'
 * @typedef {string} AudienceType - Examples: 'HCP', 'Patient', 'Caregiver'
 *
 * @typedef {Object} IntelligenceInsight
 * @property {string} source
 * @property {string} title
 * @property {string} summary
 * @property {number} relevanceScore
 * @property {string[]} recommendedActions
 * @property {Date} lastUpdated
 */

/**
 * @typedef {Object} PerformancePrediction
 * @property {number} engagementRate
 * @property {number} conversionProbability
 * @property {'low' | 'medium' | 'high'} complianceRisk
 * @property {number} bestPracticeAlignment
 * @property {string[]} recommendedOptimizations
 */

export class PublicDomainIntelligenceService {

  /**
   * Helper to check if audience is HCP (simulated)
   * @param {AudienceType} audience
   * @returns {boolean}
   */
  static isHCPAudience(audience) {
      return audience.toUpperCase() === 'HCP';
  }

  /**
   * Trigger intelligence refresh for a brand
   * @param {string} brandId
   * @param {'all' | 'regulatory' | 'competitive' | 'clinical' | 'market'} [searchScope]
   * @returns {Promise<{success: boolean, insightsFound: number, sourcesChecked: number, error?: string}>}
   */
  static async refreshBrandIntelligence(
      brandId,
      searchScope = 'all'
  ) {
      try {
          // dynamic import is retained since it relies on external file structure
          const { supabase } = await import('@/integrations/supabase/client');

          const { data, error } = await supabase.functions.invoke('public-domain-intelligence-refresh', {
              body: {
                  brandId,
                  searchScope,
                  refreshType: 'manual'
              }
          });

          if (error) {
              console.error('Intelligence refresh error:', error);
              return {
                  success: false,
                  insightsFound: 0,
                  sourcesChecked: 0,
                  error: error.message
              };
          }

          return data || { success: false, insightsFound: 0, sourcesChecked: 0 };
      } catch (error) {
          console.error('Error triggering intelligence refresh:', error);
          return {
              success: false,
              insightsFound: 0,
              sourcesChecked: 0,
              error: error instanceof Error ? error.message : 'Unknown error'
          };
      }
  }

  /**
   * Get public domain insights for a brand
   * @param {string} brandId
   * @param {string} [sourceType]
   * @param {number} [limit]
   * @returns {Promise<any[]>}
   */
  static async getBrandInsights(
      brandId,
      sourceType,
      limit = 10
  ) {
      try {
          const { supabase } = await import('@/integrations/supabase/client');

          let query = supabase
              .from('public_domain_insights')
              .select('*')
              .eq('brand_id', brandId)
              .order('discovered_at', { ascending: false })
              .limit(limit);

          if (sourceType) {
              query = query.eq('source_type', sourceType);
          }

          const { data, error } = await query;

          if (error) {
              console.error('Error fetching brand insights:', error);
              return [];
          }

          return data || [];
      } catch (error) {
          console.error('Error in getBrandInsights:', error);
          return [];
      }
  }

  /**
   * Get real-time industry insights for asset-audience combinations
   * @param {AssetType} assetType
   * @param {AudienceType} audience
   * @param {string} [indication]
   * @returns {Promise<IntelligenceInsight[]>}
   */
  static async getIndustryInsights(
      assetType,
      audience,
      indication
  ) {
      try {
          // For now, return empty array - will be populated by brand-specific insights
          // In the future, this could aggregate insights across brands for the asset type
          console.log('Industry insights requested for:', { assetType, audience, indication });
          return [];

      } catch (error) {
          console.error('Error fetching industry insights:', error);
          return [];
      }
  }

  /**
   * Predict performance based on current industry standards
   * @param {AssetType} assetType
   * @param {AudienceType} audience
   * @param {Object} intakeData - Placeholder for Partial<IntakeData>
   * @returns {Promise<PerformancePrediction>}
   */
  static async predictPerformance(
      assetType,
      audience,
      intakeData
  ) {
      const insights = await this.getIndustryInsights(assetType, audience, intakeData.indication);

      // Calculate performance predictions based on insights and historical data
      const baselineEngagement = this.getBaselineEngagement(assetType, audience);
      const complianceRisk = this.assessComplianceRisk(assetType, audience, intakeData);
      const bestPracticeScore = this.calculateBestPracticeAlignment(insights, assetType);

      return {
          engagementRate: Math.min(baselineEngagement * (1 + bestPracticeScore * 0.2), 0.95),
          conversionProbability: this.calculateConversionProbability(assetType, audience, bestPracticeScore),
          complianceRisk,
          bestPracticeAlignment: bestPracticeScore,
          recommendedOptimizations: this.generateOptimizations(insights, assetType, audience)
      };
  }

  /**
   * Get real-time compliance validation
   * @param {AssetType} assetType
   * @param {AudienceType} audience
   * @param {string} content
   * @param {string[]} [markets]
   * @returns {Promise<{isCompliant: boolean, warnings: string[], recommendations: string[], confidence: number}>}
   */
  static async validateCompliance(
      assetType,
      audience,
      content,
      markets = ['US']
  ) {
      // Analyze content against compliance requirements
      const warnings = this.analyzeContentCompliance(content, assetType, audience, []);
      const recommendations = this.generateComplianceRecommendations(warnings, []);

      return {
          isCompliant: warnings.length === 0,
          warnings,
          recommendations,
          confidence: 0.75
      };
  }

  /**
   * Generate smart content recommendations
   * @param {AssetType} assetType
   * @param {AudienceType} audience
   * @param {Object} intakeData - Placeholder for Partial<IntakeData>
   * @returns {Promise<{keyMessages: string[], callsToAction: string[], toneGuidance: string[], channelOptimizations: string[]}>}
   */
  static async getContentRecommendations(
      assetType,
      audience,
      intakeData
  ) {
      const insights = await this.getIndustryInsights(assetType, audience, intakeData.indication);

      return {
          keyMessages: this.extractKeyMessages(insights, intakeData),
          callsToAction: this.generateSmartCTAs(insights, assetType, audience),
          toneGuidance: this.deriveToneGuidance(insights, audience),
          channelOptimizations: this.getChannelOptimizations(insights, assetType)
      };
  }

  // Private helper methods

  /**
   * @private
   * @param {AssetType} assetType
   * @param {AudienceType} audience
   * @param {string} [indication]
   * @returns {string[]}
   */
  static buildSearchQueries(assetType, audience, indication) {
      const baseQueries = [
          `${assetType} ${audience} pharmaceutical marketing best practices 2024`,
          `${assetType} ${audience} engagement rates pharmaceutical industry`,
          `${assetType} compliance requirements ${audience} pharmaceutical 2024`
      ];

      if (indication) {
          baseQueries.push(
              `${assetType} ${indication} ${audience} marketing effectiveness`,
              `${indication} ${audience} communication strategies pharmaceutical`
          );
      }

      return baseQueries;
  }


  /**
   * @private
   * @param {any[]} results
   * @param {AssetType} assetType
   * @param {AudienceType} audience
   * @returns {IntelligenceInsight[]}
   */
  static processSearchResults(results, assetType, audience) {
      return results.map(result => ({
          source: result.url || 'Unknown Source',
          title: result.title || 'Untitled',
          summary: result.snippet || 'No summary available',
          relevanceScore: this.calculateRelevanceScore(result, assetType, audience),
          recommendedActions: this.extractRecommendations(result.snippet || ''),
          lastUpdated: result.lastModified || new Date()
      }));
  }

  /**
   * @private
   * @param {any} result
   * @param {AssetType} assetType
   * @param {AudienceType} audience
   * @returns {number}
   */
  static calculateRelevanceScore(result, assetType, audience) {
      let score = 0.5; // Base score

      const text = (result.title + ' ' + result.snippet).toLowerCase();

      // Boost score based on keyword matches
      if (text.includes(assetType.replace('-', ' '))) score += 0.3;
      if (text.includes(audience.toLowerCase())) score += 0.2;
      if (text.includes('pharmaceutical') || text.includes('pharma')) score += 0.15;
      if (text.includes('2024') || text.includes('2025')) score += 0.1;
      if (text.includes('best practice') || text.includes('compliance')) score += 0.1;

      return Math.min(score, 1.0);
  }

  /**
   * @private
   * @param {string} text
   * @returns {string[]}
   */
  static extractRecommendations(text) {
      // Simple keyword-based recommendation extraction
      const recommendations = [];

      if (text.toLowerCase().includes('personalization')) {
          recommendations.push('Consider implementing personalization strategies');
      }
      if (text.toLowerCase().includes('mobile')) {
          recommendations.push('Optimize for mobile viewing');
      }
      if (text.toLowerCase().includes('compliance')) {
          recommendations.push('Review latest compliance requirements');
      }

      return recommendations;
  }

  /**
   * @private
   * @param {AssetType} assetType
   * @param {AudienceType} audience
   * @returns {number}
   */
  static getBaselineEngagement(assetType, audience) {
      const baselines = {
          'HCP': {
              'mass-email': 0.25,
              'rep-triggered-email': 0.45,
              'social-media-post': 0.08,
              'website-landing-page': 0.35,
              'digital-sales-aid': 0.65
          },
          'Patient': {
              'patient-email': 0.32,
              'social-media-post': 0.12,
              'website-landing-page': 0.28
          },
          'Caregiver': {
              'caregiver-email': 0.38,
              'social-media-post': 0.15,
              'website-landing-page': 0.31
          }
      };

      // Note: The original TS code used baselines[audience]?.[assetType], which implies
      // that 'patient-email' is an AssetType, and 'Patient' is the AudienceType.
      // The type for assetType is simplified here to string.
      return baselines[audience] ? (baselines[audience][assetType] || 0.2) : 0.2;
  }

  /**
   * @private
   * @param {AssetType} assetType
   * @param {AudienceType} audience
   * @param {Object} intakeData - Placeholder for Partial<IntakeData>
   * @returns {'low' | 'medium' | 'high'}
   */
  static assessComplianceRisk(
      assetType,
      audience,
      intakeData
  ) {
      // HCP content generally has higher compliance requirements
      if (this.isHCPAudience(audience)) {
          return ['mass-email', 'rep-triggered-email', 'digital-sales-aid'].includes(assetType) ? 'high' : 'medium';
      }

      // Patient and Caregiver content typically lower risk but still regulated
      return assetType.includes('email') ? 'low' : 'medium';
  }

  /**
   * @private
   * @param {IntelligenceInsight[]} insights
   * @param {AssetType} assetType
   * @returns {number}
   */
  static calculateBestPracticeAlignment(insights, assetType) {
      if (insights.length === 0) return 0.5;

      const averageRelevance = insights.reduce((sum, insight) => sum + insight.relevanceScore, 0) / insights.length;
      return averageRelevance;
  }

  /**
   * @private
   * @param {AssetType} assetType
   * @param {AudienceType} audience
   * @param {number} bestPracticeScore
   * @returns {number}
   */
  static calculateConversionProbability(
      assetType,
      audience,
      bestPracticeScore
  ) {
      const baseConversion = {
          'HCP': 0.15,
          'Patient': 0.08,
          'Caregiver': 0.12
      };

      return Math.min((baseConversion[audience] || 0.05) * (1 + bestPracticeScore), 0.5);
  }

  /**
   * @private
   * @param {IntelligenceInsight[]} insights
   * @param {AssetType} assetType
   * @param {AudienceType} audience
   * @returns {string[]}
   */
  static generateOptimizations(
      insights,
      assetType,
      audience
  ) {
      const optimizations = [];

      // Extract optimizations from insights
      insights.forEach(insight => {
          optimizations.push(...insight.recommendedActions);
      });

      // Add asset-specific optimizations
      if (assetType.includes('email')) {
          optimizations.push('Implement A/B testing for subject lines');
          optimizations.push('Optimize send time based on audience timezone');
      }

      return [...new Set(optimizations)]; // Remove duplicates
  }

  /**
   * @private
   * @param {string} content
   * @param {AssetType} assetType
   * @param {AudienceType} audience
   * @param {IntelligenceInsight[]} insights
   * @returns {string[]}
   */
  static analyzeContentCompliance(
      content,
      assetType,
      audience,
      insights
  ) {
      const warnings = [];

      if (this.isHCPAudience(audience) && !content.toLowerCase().includes('prescribing information')) {
          warnings.push('HCP content should reference prescribing information');
      }

      if (assetType.includes('email') && !content.toLowerCase().includes('unsubscribe')) {
          warnings.push('Email content should include unsubscribe mechanism');
      }

      return warnings;
  }

  /**
   * @private
   * @param {string[]} warnings
   * @param {IntelligenceInsight[]} insights
   * @returns {string[]}
   */
  static generateComplianceRecommendations(
      warnings,
      insights
  ) {
      const recommendations = [];

      warnings.forEach(warning => {
          if (warning.includes('prescribing information')) {
              recommendations.push('Add link to full prescribing information');
          }
          if (warning.includes('unsubscribe')) {
              recommendations.push('Include clear unsubscribe link in footer');
          }
      });

      return recommendations;
  }

  /**
   * @private
   * @param {IntelligenceInsight[]} insights
   * @param {Object} intakeData - Placeholder for Partial<IntakeData>
   * @returns {string[]}
   */
  static extractKeyMessages(insights, intakeData) {
      // Extract trending key messages from industry insights
      return [
          'Focus on patient-centric outcomes',
          'Highlight real-world evidence',
          'Emphasize safety and efficacy balance'
      ];
  }

  /**
   * @private
   * @param {IntelligenceInsight[]} insights
   * @param {AssetType} assetType
   * @param {AudienceType} audience
   * @returns {string[]}
   */
  static generateSmartCTAs(insights, assetType, audience) {
      // Generate CTAs based on current industry trends
      const ctas = {
          'HCP': ['Learn More', 'Request Clinical Data', 'Schedule Discussion'],
          'Patient': ['Talk to Your Doctor', 'Get Support', 'Find Resources'],
          'Caregiver': ['Access Support', 'Connect with Community', 'Get Tools']
      };

      // Fallback to Patient if audience is not directly mapped
      return ctas[audience] || ctas['Patient'];
  }

  /**
   * @private
   * @param {IntelligenceInsight[]} insights
   * @param {AudienceType} audience
   * @returns {string[]}
   */
  static deriveToneGuidance(insights, audience) {
      const guidance = {
          'HCP': ['Professional and evidence-based', 'Clinical and authoritative', 'Peer-to-peer respectful'],
          'Patient': ['Empathetic and supportive', 'Clear and accessible', 'Encouraging and hopeful'],
          'Caregiver': ['Understanding and compassionate', 'Practical and resourceful', 'Acknowledging burden']
      };

      // Fallback to Patient if audience is not directly mapped
      return guidance[audience] || guidance['Patient'];
  }

  /**
   * @private
   * @param {IntelligenceInsight[]} insights
   * @param {AssetType} assetType
   * @returns {string[]}
   */
  static getChannelOptimizations(insights, assetType) {
      return [
          'Optimize for mobile-first experience',
          'Ensure cross-platform compatibility',
          'Implement tracking and analytics'
      ];
  }
}