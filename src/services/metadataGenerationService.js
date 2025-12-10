import { BrowserAIService } from './browserAIService';
import { taxonomyService } from './taxonomyService';
import { supabase } from '@/integrations/supabase/client';

/**
 * @typedef {Object} MetadataGenerationOptions
 * @property {boolean} [includeAIAnalysis] - Whether to include AI-powered analysis.
 * @property {boolean} [includeTaxonomyMapping] - Whether to include taxonomy mapping and compliance checks.
 * @property {boolean} [includePerformancePrediction] - Whether to include performance prediction scores.
 * @property {boolean} [includeComplianceCheck] - Whether to include compliance check (implicitly handled by taxonomy).
 * @property {string} [brandId] - Brand ID required for taxonomy mapping.
 * @property {string} [userId] - User ID for recording taxonomy application.
 */

/**
 * @typedef {Object} GeneratedMetadata
 * @property {Object} [aiAnalysis]
 * @property {string} aiAnalysis.summary - Concise content summary.
 * @property {string[]} aiAnalysis.keyThemes - List of key themes.
 * @property {number} aiAnalysis.sentimentScore - Sentiment score (0-1).
 * @property {number} aiAnalysis.complexityScore - Content complexity score (0-1).
 * @property {number} aiAnalysis.readabilityScore - Content readability score (0-1).
 * @property {string[]} aiAnalysis.recommendations - Content improvement recommendations.
 * @property {Object} [taxonomyMapping]
 * @property {Array<{ taxonomyId: string; confidence: number; reason: string }>} taxonomyMapping.suggested - Suggested taxonomy IDs with confidence.
 * @property {string[]} taxonomyMapping.applied - Taxonomy IDs automatically applied.
 * @property {any} taxonomyMapping.compliance - Compliance validation results.
 * @property {Object} [performancePrediction]
 * @property {number} performancePrediction.engagementScore - Predicted engagement score (0-1).
 * @property {number} performancePrediction.complianceRisk - Predicted compliance risk (0-1).
 * @property {number} performancePrediction.audienceResonance - Predicted audience resonance (0-1).
 * @property {string[]} performancePrediction.factors - Key factors influencing the prediction.
 * @property {Object} [contentMetrics]
 * @property {number} contentMetrics.wordCount - Total word count.
 * @property {number} contentMetrics.readingTime - Estimated reading time in minutes.
 * @property {Record<string, number>} contentMetrics.keywordDensity - Top 10 keywords and their density.
 * @property {string[]} contentMetrics.entityMentions - Extracted entity mentions.
 * @property {string} generatedAt - Timestamp of generation.
 * @property {string} version - Service version.
 */

class MetadataGenerationService {
  constructor() {
    this.VERSION = '1.0.0';
  }

  /**
   * Generate comprehensive metadata for content
   * @param {any} content - The content object (asset or project data).
   * @param {string} contentType - 'asset' or 'project'.
   * @param {string} contentId - ID of the content/project.
   * @param {MetadataGenerationOptions} [options={}] - Options to customize generation.
   * @returns {Promise<GeneratedMetadata>}
   */
  async generateMetadata(
    content,
    contentType,
    contentId,
    options = {}
  ) {
    /** @type {GeneratedMetadata} */
    const metadata = {
      generatedAt: new Date().toISOString(),
      version: this.VERSION
    };

    try {
      // Extract text content for analysis
      const textContent = this.extractTextContent(content, contentType);

      // Generate basic content metrics
      metadata.contentMetrics = this.generateContentMetrics(textContent);

      // AI Analysis
      if (options.includeAIAnalysis !== false) {
        metadata.aiAnalysis = await this.generateAIAnalysis(textContent, contentType);
      }

      // Taxonomy Mapping
      if (options.includeTaxonomyMapping !== false && options.brandId) {
        metadata.taxonomyMapping = await this.generateTaxonomyMapping(
          content,
          contentType,
          contentId,
          options.brandId,
          options.userId
        );
      }

      // Performance Prediction
      if (options.includePerformancePrediction !== false) {
        metadata.performancePrediction = await this.generatePerformancePrediction(
          textContent,
          metadata.aiAnalysis,
          metadata.taxonomyMapping
        );
      }

      // Store metadata in database
      await this.storeMetadata(contentId, contentType, metadata);

      return metadata;
    } catch (error) {
      console.error('Error generating metadata:', error);
      throw error;
    }
  }

  /**
   * Generate AI-powered content analysis
   * @private
   * @param {string} textContent
   * @param {string} contentType
   * @returns {Promise<GeneratedMetadata['aiAnalysis']>}
   */
  async generateAIAnalysis(
    textContent,
    contentType
  ) {
    try {
      // NOTE: The original TS had a commented prompt and then used a mock `BrowserAIService.analyzeContent`.
      // We will follow the structure using the imported service.
      
      // Simulate calling an external AI analysis service (BrowserAIService)
      const analysis = await BrowserAIService.analyzeContent(textContent);
      
      const result = JSON.stringify({
        summary: this.generateSummaryFromAnalysis(textContent),
        keyThemes: analysis.semantics.key_concepts.slice(0, 5),
        sentimentScore: analysis.sentiment.confidence,
        // Using internal mock calculation for complexity as a fallback
        complexityScore: this.calculateComplexityScore(textContent), 
        readabilityScore: analysis.semantics.readability_score / 100, // Assuming score is 0-100
        recommendations: analysis.brand_voice.recommendations
      });
      
      try {
        // Parsing the result from the simulated service call
        return JSON.parse(result);
      } catch (e) {
        // Fallback if AI doesn't return valid JSON or if properties are unexpected
        console.warn("AI analysis result parsing failed. Using fallback scores.");
        return {
          summary: this.generateSummaryFromAnalysis(textContent),
          keyThemes: this.extractKeywords(textContent).slice(0, 5),
          sentimentScore: 0.5,
          complexityScore: this.calculateComplexityScore(textContent),
          readabilityScore: this.calculateReadabilityScore(textContent),
          recommendations: ['Consider reviewing content structure and clarity']
        };
      }
    } catch (error) {
      console.error('Error generating AI analysis:', error);
      return {
        summary: 'Analysis unavailable',
        keyThemes: [],
        sentimentScore: 0.5,
        complexityScore: 0.5,
        readabilityScore: 0.5,
        recommendations: []
      };
    }
  }

  /**
   * Generate taxonomy mapping suggestions
   * @private
   * @param {any} content
   * @param {string} contentType
   * @param {string} contentId
   * @param {string} brandId
   * @param {string} [userId]
   * @returns {Promise<GeneratedMetadata['taxonomyMapping']>}
   */
  async generateTaxonomyMapping(
    content,
    contentType,
    contentId,
    brandId,
    userId
  ) {
    try {
      // Generate suggestions
      const suggested = await taxonomyService.generateTaxonomySuggestions(
        content,
        contentType,
        brandId
      );

      // Apply high-confidence suggestions automatically
      const autoApplyThreshold = 0.8;
      const toApply = suggested
        .filter(s => s.confidence >= autoApplyThreshold)
        .map(s => s.taxonomyId);

      let applied = [];
      if (toApply.length > 0) {
        const appliedMappings = await taxonomyService.applyTaxonomyToContent(
          contentId,
          contentType,
          toApply,
          true,
          userId
        );
        applied = appliedMappings.map(m => m.taxonomy_id);
      }

      // Check compliance
      const compliance = await taxonomyService.validateTaxonomyCompliance(
        contentId,
        contentType,
        brandId
      );

      return {
        suggested,
        applied,
        compliance
      };
    } catch (error) {
      console.error('Error generating taxonomy mapping:', error);
      return {
        suggested: [],
        applied: [],
        compliance: null
      };
    }
  }

  /**
   * Generate performance prediction
   * @private
   * @param {string} textContent
   * @param {GeneratedMetadata['aiAnalysis']} [aiAnalysis]
   * @param {GeneratedMetadata['taxonomyMapping']} [taxonomyMapping]
   * @returns {Promise<GeneratedMetadata['performancePrediction']>}
   */
  async generatePerformancePrediction(
    textContent,
    aiAnalysis,
    taxonomyMapping
  ) {
    try {
      let engagementScore = 0.5;
      let complianceRisk = 0.5;
      let audienceResonance = 0.5;
      const factors = [];

      // Use AI analysis scores if available
      if (aiAnalysis) {
        engagementScore = (aiAnalysis.readabilityScore + aiAnalysis.sentimentScore) / 2;
        factors.push(`Readability: ${(aiAnalysis.readabilityScore * 100).toFixed(0)}%`);
        factors.push(`Sentiment: ${(aiAnalysis.sentimentScore * 100).toFixed(0)}%`);
      }

      // Consider taxonomy compliance
      if (taxonomyMapping?.compliance) {
        if (taxonomyMapping.compliance.isCompliant) {
          complianceRisk = 0.2;
          factors.push('Taxonomy compliant');
        } else {
          complianceRisk = 0.8;
          factors.push(`${taxonomyMapping.compliance.missingRequired.length} missing required tags`);
        }
      }

      // Content length factor
      const wordCount = textContent.split(/\s+/).length;
      if (wordCount > 100 && wordCount < 500) {
        audienceResonance += 0.2;
        factors.push('Optimal content length');
      }

      // Keyword diversity
      const uniqueWords = new Set(textContent.toLowerCase().split(/\s+/)).size;
      const diversity = uniqueWords / wordCount;
      if (diversity > 0.7) {
        audienceResonance += 0.1;
        factors.push('Good vocabulary diversity');
      }

      return {
        engagementScore: Math.min(Math.max(engagementScore, 0), 1),
        complianceRisk: Math.min(Math.max(complianceRisk, 0), 1),
        audienceResonance: Math.min(Math.max(audienceResonance, 0), 1),
        factors
      };
    } catch (error) {
      console.error('Error generating performance prediction:', error);
      return {
        engagementScore: 0.5,
        complianceRisk: 0.5,
        audienceResonance: 0.5,
        factors: []
      };
    }
  }

  /**
   * Generate basic content metrics
   * @private
   * @param {string} textContent
   * @returns {GeneratedMetadata['contentMetrics']}
   */
  generateContentMetrics(textContent) {
    const words = textContent.split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;
    const readingTime = Math.ceil(wordCount / 200); // Average reading speed

    // Calculate keyword density
    const wordFreq = {};
    words.forEach(word => {
      const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');
      if (cleanWord.length > 3) { // Ignore short words
        wordFreq[cleanWord] = (wordFreq[cleanWord] || 0) + 1;
      }
    });

    // Get top keywords
    const keywordDensity = {};
    Object.entries(wordFreq)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .forEach(([word, count]) => {
        keywordDensity[word] = count / wordCount;
      });

    // Extract potential entity mentions (capitalized words)
    const entityMentions = Array.from(new Set(
      textContent.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g) || []
    )).slice(0, 10);

    return {
      wordCount,
      readingTime,
      keywordDensity,
      entityMentions
    };
  }

  /**
   * Store generated metadata in database
   * @private
   * @param {string} contentId
   * @param {string} contentType
   * @param {GeneratedMetadata} metadata
   * @returns {Promise<void>}
   */
  async storeMetadata(
    contentId,
    contentType,
    metadata
  ) {
    try {
      const tableName = contentType === 'project' ? 'content_projects' : 'content_assets';
      
      const { error } = await supabase
        .from(tableName)
        .update({ 
          global_metadata: metadata,
          updated_at: new Date().toISOString()
        })
        .eq('id', contentId);

      if (error) throw error;
    } catch (error) {
      console.error('Error storing metadata:', error);
      // Don't throw - metadata storage failure shouldn't break the main flow
    }
  }

  /**
   * Extracts text from content object based on type.
   * @private
   * @param {any} content
   * @param {string} contentType
   * @returns {string}
   */
  extractTextContent(content, contentType) {
    let text = '';

    switch (contentType) {
      case 'project':
        text = [
          content.project_name || '',
          content.description || '',
          content.therapeutic_area || '',
          content.indication || ''
        ].filter(Boolean).join('. ');
        break;

      case 'asset':
        text = [
          content.asset_name || '',
          // Assuming content.primary_content is an object that needs stringification
          JSON.stringify(content.primary_content || {}),
          content.target_audience || '',
          content.compliance_notes || ''
        ].filter(Boolean).join('. ');
        break;

      default:
        text = JSON.stringify(content);
    }

    return text;
  }

  /**
   * Extracts keywords based on frequency (simple mock).
   * @private
   * @param {string} text
   * @returns {string[]}
   */
  extractKeywords(text) {
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3);

    const frequency = {};
    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });

    return Object.entries(frequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word);
  }

  /**
   * Calculates a simplified complexity score (mock).
   * @private
   * @param {string} text
   * @returns {number}
   */
  calculateComplexityScore(text) {
    const words = text.split(/\s+/);
    const sentences = text.split(/[.!?]+/).filter(s => {
      return typeof s === 'string' && s.trim().length > 0;
    });
    
    if (words.length === 0 || sentences.length === 0) return 0.5;

    const avgWordsPerSentence = words.length / sentences.length;
    const avgCharsPerWord = words.reduce((sum, word) => sum + word.length, 0) / words.length;
    
    // Normalize to 0-1 scale
    const complexity = (avgWordsPerSentence / 20) + (avgCharsPerWord / 10);
    return Math.min(Math.max(complexity, 0), 1);
  }

  /**
   * Calculates a simplified readability score (mock).
   * @private
   * @param {string} text
   * @returns {number}
   */
  calculateReadabilityScore(text) {
    // Simple readability score based on sentence and word length
    const words = text.split(/\s+/);
    const sentences = text.split(/[.!?]+/).filter(s => {
      return typeof s === 'string' && s.trim().length > 0;
    });

    if (words.length === 0 || sentences.length === 0) return 0.5;
    
    const avgWordsPerSentence = words.length / sentences.length;
    const complexWords = words.filter(word => word.length > 6).length;
    const complexWordRatio = complexWords / words.length;
    
    // Higher score = more readable
    const readability = 1 - (avgWordsPerSentence / 30) - (complexWordRatio * 0.5);
    return Math.min(Math.max(readability, 0), 1);
  }

  /**
   * Generates a simple summary using the first two sentences.
   * @private
   * @param {string} textContent
   * @returns {string}
   */
  generateSummaryFromAnalysis(textContent) {
    const sentences = textContent.split(/[.!?]+/).filter(s => {
      return typeof s === 'string' && s.trim().length > 0;
    });
    const firstTwoSentences = sentences.slice(0, 2).join('. ').trim();
    
    if (firstTwoSentences) {
      return firstTwoSentences + (firstTwoSentences.endsWith('.') ? '' : '.');
    }
    
    return textContent.substring(0, 200) + '...';
  }
}

export const metadataGenerationService = new MetadataGenerationService();