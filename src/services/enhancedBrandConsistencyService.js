/**
 * NOTE: The following dependencies are assumed to be available in the execution environment.
 * import { supabase } from '@/integrations/supabase/client';
 * import { unifiedDataService } from './unifiedDataService';
 * import { BrandConsistencyResult, BrandIssue } from './brandConsistencyService';
 */

// Placeholder for external imports - replace with actual imports if running
const supabase = {
  from: () => ({
    select: () => ({
      eq: () => ({
        single: async () => ({ data: { /* mock data */ }, error: null })
      })
    })
  })
};

const unifiedDataService = {
  getContentWithContext: async (assetId, type) => ({ content: {
    primary_content: {
      headline: "New Drug for Chronic Pain",
      body: "This is a clinically proven, innovative treatment option that can help reduce symptoms by 40%. Contact your doctor for more information.",
      cta_text: "Learn More Now",
      disclaimer: "Must see full prescribing information. Side effects may include nausea and dizziness.",
    }
  }, context: {} }),
};

// --- JSDoc Type Definitions ---

/**
 * @typedef {Object} ContentSection
 * @property {string} id
 * @property {'headline' | 'body' | 'cta' | 'disclaimer' | 'tagline'} type
 * @property {string} content
 * @property {number} startIndex
 * @property {number} endIndex
 */

/**
 * @typedef {Object} BrandIssue
 * @property {string} category
 * @property {'critical' | 'high' | 'medium' | 'low'} severity
 * @property {string} description
 * @property {string} suggestion
 * @property {string} location
 */

/**
 * @typedef {BrandIssue & Object} ContentAnalysisIssue
 * @property {ContentSection} contentSection
 * @property {string} specificText
 * @property {string} suggestedReplacement
 * @property {number} confidenceScore
 * @property {'none' | 'low' | 'medium' | 'high' | 'critical'} regulatoryRisk
 */

/**
 * @typedef {Object} BrandConsistencyResult
 * @property {number} overallScore
 * @property {number} messagingScore
 * @property {number} toneScore
 * @property {number} visualScore
 * @property {number} regulatoryScore
 * @property {BrandIssue[]} issues
 * @property {string[]} strengths
 * @property {string[]} recommendations
 * @property {'compliant' | 'needs_review' | 'non_compliant'} status
 */

/**
 * @typedef {BrandConsistencyResult & Object} EnhancedBrandConsistencyResult
 * @property {ContentSection[]} contentSections
 * @property {ContentAnalysisIssue[]} contentIssues
 * @property {Object} strategicContext
 * @property {string[]} [strategicContext.campaignObjectives]
 * @property {Object} [strategicContext.themeAlignment]
 * @property {string} strategicContext.themeAlignment.themeName
 * @property {number} strategicContext.themeAlignment.alignmentScore
 * @property {string[]} strategicContext.themeAlignment.misalignedElements
 * @property {any} [strategicContext.audienceInsights]
 * @property {any[]} [strategicContext.previousContent]
 * @property {Object[]} marketSpecificFlags
 * @property {string} marketSpecificFlags.market
 * @property {string[]} marketSpecificFlags.culturalRisks
 * @property {string[]} marketSpecificFlags.regulatoryFlags
 * @property {string[]} marketSpecificFlags.terminologyIssues
 * @property {Object[]} actionableRecommendations
 * @property {'critical' | 'high' | 'medium' | 'low'} actionableRecommendations.priority
 * @property {string} actionableRecommendations.category
 * @property {string} actionableRecommendations.description
 * @property {string} actionableRecommendations.action
 * @property {'low' | 'medium' | 'high'} actionableRecommendations.effort
 * @property {'low' | 'medium' | 'high'} actionableRecommendations.impact
 * @property {string} actionableRecommendations.beforeExample
 * @property {string} actionableRecommendations.afterExample
 */

export class EnhancedBrandConsistencyService {
  /**
   * Validates content against brand guidelines, strategic context, and market regulations.
   * @static
   * @param {string} assetId
   * @param {string} brandId
   * @param {string[]} [targetMarkets=[]]
   * @param {Object} [strategicContext]
   * @param {any} [strategicContext.campaignContext]
   * @param {any} [strategicContext.themeContext]
   * @param {any} [strategicContext.assetContext]
   * @param {any} [strategicContext.globalContext]
   * @returns {Promise<EnhancedBrandConsistencyResult>}
   */
  static async validateBrandConsistencyWithContext(
    assetId,
    brandId,
    targetMarkets = [],
    strategicContext
  ) {
    try {
      // Get asset data with full context
      const assetWithContext = await unifiedDataService.getContentWithContext(assetId, 'asset');
      const asset = assetWithContext.content;

      if (!asset) throw new Error('Asset not found');

      // Get brand guidelines and strategic context (Mocked Supabase calls)
      const [guidelines, vision, strategicData] = await Promise.all([
        this.getBrandGuidelines(brandId),
        this.getBrandVision(brandId),
        this.getStrategicContext(brandId, strategicContext)
      ]);

      // Parse content into sections
      const contentSections = this.parseContentSections(asset);

      // Perform enhanced analysis
      const [
        contentIssues,
        marketFlags,
        themeAlignment,
        recommendations
      ] = await Promise.all([
        this.analyzeContentSections(contentSections, guidelines, vision, targetMarkets),
        this.analyzeMarketSpecificFlags(contentSections, targetMarkets),
        this.analyzeThemeAlignment(contentSections, strategicContext?.themeContext),
        this.generateActionableRecommendations(contentSections, guidelines, targetMarkets)
      ]);

      // Calculate enhanced scores
      const scores = this.calculateEnhancedScores(contentIssues, marketFlags, themeAlignment);

      return {
        ...scores,
        contentSections,
        contentIssues,
        strategicContext: {
          ...strategicData,
          themeAlignment
        },
        marketSpecificFlags: marketFlags,
        actionableRecommendations: recommendations
      };
    } catch (error) {
      console.error('Enhanced brand consistency validation failed:', error);
      throw error;
    }
  }

  /**
   * @private
   * @static
   * @param {any} asset
   * @returns {ContentSection[]}
   */
  static parseContentSections(asset) {
    const sections = [];
    const content = asset.primary_content || {};
    let currentIndex = 0;

    // Parse headline
    if (content.headline) {
      sections.push({
        id: 'headline',
        type: 'headline',
        content: content.headline,
        startIndex: currentIndex,
        endIndex: currentIndex + content.headline.length
      });
      currentIndex += content.headline.length;
    }

    // Parse body
    if (content.body) {
      sections.push({
        id: 'body',
        type: 'body',
        content: content.body,
        startIndex: currentIndex,
        endIndex: currentIndex + content.body.length
      });
      currentIndex += content.body.length;
    }

    // Parse CTA
    if (content.cta_text) {
      sections.push({
        id: 'cta',
        type: 'cta',
        content: content.cta_text,
        startIndex: currentIndex,
        endIndex: currentIndex + content.cta_text.length
      });
      currentIndex += content.cta_text.length;
    }

    // Parse disclaimer
    if (content.disclaimer) {
      sections.push({
        id: 'disclaimer',
        type: 'disclaimer',
        content: content.disclaimer,
        startIndex: currentIndex,
        endIndex: currentIndex + content.disclaimer.length
      });
    }

    return sections;
  }

  /**
   * @private
   * @static
   * @param {ContentSection[]} sections
   * @param {any} guidelines
   * @param {any} vision
   * @param {string[]} targetMarkets
   * @returns {Promise<ContentAnalysisIssue[]>}
   */
  static async analyzeContentSections(
    sections,
    guidelines,
    vision,
    targetMarkets
  ) {
    /** @type {ContentAnalysisIssue[]} */
    const issues = [];

    for (const section of sections) {
      // Analyze messaging alignment
      const messagingIssues = await this.analyzeMessagingInSection(section, guidelines, vision);
      issues.push(...messagingIssues);

      // Analyze regulatory compliance
      const regulatoryIssues = await this.analyzeRegulatoryInSection(section, targetMarkets);
      issues.push(...regulatoryIssues);

      // Analyze tone consistency
      const toneIssues = await this.analyzeToneInSection(section, guidelines);
      issues.push(...toneIssues);

      // Analyze claims substantiation
      const claimIssues = await this.analyzeClaimsInSection(section);
      issues.push(...claimIssues);
    }

    return issues;
  }

  /**
   * @private
   * @static
   * @param {ContentSection} section
   * @param {any} guidelines
   * @param {any} vision
   * @returns {Promise<ContentAnalysisIssue[]>}
   */
  static async analyzeMessagingInSection(
    section,
    guidelines,
    vision
  ) {
    /** @type {ContentAnalysisIssue[]} */
    const issues = [];
    // Mock guidelines structure
    const keyMessages = guidelines?.messaging_framework?.key_messages || ['innovative treatment', 'designed to help manage'];
    const prohibitedTerms = guidelines?.messaging_framework?.prohibited_terms || ['cure', 'miracle', 'guarantee'];

    // Check for prohibited terms
    for (const term of prohibitedTerms) {
      const regex = new RegExp(`\\b${term}\\b`, 'gi');
      const matches = section.content.matchAll(regex);

      for (const match of matches) {
        if (match.index !== undefined) {
          issues.push({
            category: 'messaging',
            severity: 'high',
            description: `Prohibited term "${term}" found`,
            suggestion: `Remove or replace "${term}" with approved terminology`,
            location: `${section.type} at position ${match.index}`,
            contentSection: section,
            specificText: match[0],
            suggestedReplacement: this.getSuggestedReplacement(term, keyMessages),
            confidenceScore: 0.95,
            regulatoryRisk: 'medium'
          });
        }
      }
    }

    // Check for missing key messages in critical sections
    if (section.type === 'headline' || section.type === 'body') {
      const hasKeyMessage = keyMessages.some((/** @type {string} */ msg) =>
        section.content.toLowerCase().includes(msg.toLowerCase())
      );

      if (!hasKeyMessage && keyMessages.length > 0) {
        issues.push({
          category: 'messaging',
          severity: 'medium',
          description: `No key brand messages found in ${section.type}`,
          suggestion: `Consider incorporating: ${keyMessages[0]}`,
          location: section.type,
          contentSection: section,
          specificText: section.content.substring(0, 50) + '...',
          suggestedReplacement: `${section.content} ${keyMessages[0]}`,
          confidenceScore: 0.8,
          regulatoryRisk: 'none'
        });
      }
    }

    return issues;
  }

  /**
   * @private
   * @static
   * @param {ContentSection} section
   * @param {string[]} targetMarkets
   * @returns {Promise<ContentAnalysisIssue[]>}
   */
  static async analyzeRegulatoryInSection(
    section,
    targetMarkets
  ) {
    /** @type {ContentAnalysisIssue[]} */
    const issues = [];
    const content = section.content.toLowerCase();

    // Check for unsubstantiated claims
    const claimWords = ['proven', 'guaranteed', 'best', 'most effective', 'clinically proven', '#1'];

    for (const claim of claimWords) {
      if (content.includes(claim.toLowerCase())) {
        issues.push({
          category: 'regulatory',
          severity: 'critical',
          description: `Unsubstantiated claim "${claim}" requires evidence`,
          suggestion: `Add supporting data or modify claim to be more factual`,
          location: `${section.type}`,
          contentSection: section,
          specificText: claim,
          suggestedReplacement: this.getSofterClaimAlternative(claim),
          confidenceScore: 0.9,
          regulatoryRisk: 'critical'
        });
      }
    }

    // Check for missing safety information in critical sections
    if (section.type === 'disclaimer' || section.type === 'body') {
      const hasSafetyInfo = content.includes('important safety information') ||
        content.includes('contraindications') ||
        content.includes('side effects');

      if (!hasSafetyInfo && (section.type === 'disclaimer' || section.content.length > 200)) {
        issues.push({
          category: 'regulatory',
          severity: 'critical',
          description: 'Missing required safety information',
          suggestion: 'Add "Please see Important Safety Information" reference',
          location: section.type,
          contentSection: section,
          specificText: 'Missing safety disclaimer',
          suggestedReplacement: section.content + '\n\nPlease see Important Safety Information.',
          confidenceScore: 0.95,
          regulatoryRisk: 'critical'
        });
      }
    }

    return issues;
  }

  /**
   * @private
   * @static
   * @param {ContentSection} section
   * @param {any} guidelines
   * @returns {Promise<ContentAnalysisIssue[]>}
   */
  static async analyzeToneInSection(
    section,
    guidelines
  ) {
    /** @type {ContentAnalysisIssue[]} */
    const issues = [];
    const expectedTone = guidelines?.tone_of_voice?.primary_tone || 'professional';

    // Simple tone analysis
    const content = section.content.toLowerCase();
    const casualWords = ['hey', 'wow', 'awesome', 'cool', 'amazing'];
    const informalWords = ['gonna', 'wanna', 'kinda', 'sorta'];

    if (expectedTone === 'professional') {
      for (const word of [...casualWords, ...informalWords]) {
        if (content.includes(word)) {
          issues.push({
            category: 'tone',
            severity: 'medium',
            description: `Informal language "${word}" inconsistent with professional tone`,
            suggestion: `Use more professional language`,
            location: section.type,
            contentSection: section,
            specificText: word,
            suggestedReplacement: this.getProfessionalAlternative(word),
            confidenceScore: 0.7,
            regulatoryRisk: 'none'
          });
        }
      }
    }

    return issues;
  }

  /**
   * @private
   * @static
   * @param {ContentSection} section
   * @returns {Promise<ContentAnalysisIssue[]>}
   */
  static async analyzeClaimsInSection(section) {
    /** @type {ContentAnalysisIssue[]} */
    const issues = [];

    // Check for specific medical claims that need substantiation
    const medicalClaimPatterns = [
      /reduces? (\w+) by (\d+)%/gi,
      /improves? (\w+) in (\d+) weeks?/gi,
      /proven to/gi,
      /clinically (demonstrated|shown|proven)/gi
    ];

    for (const pattern of medicalClaimPatterns) {
      const matches = section.content.matchAll(pattern);

      for (const match of matches) {
        if (match.index !== undefined) {
          issues.push({
            category: 'regulatory',
            severity: 'critical',
            description: `Medical claim requires substantiation: "${match[0]}"`,
            suggestion: 'Add clinical reference or modify to be less specific',
            location: `${section.type} at position ${match.index}`,
            contentSection: section,
            specificText: match[0],
            suggestedReplacement: `May help with ${match[1] || 'condition'} (see clinical data)`,
            confidenceScore: 0.9,
            regulatoryRisk: 'critical'
          });
        }
      }
    }

    return issues;
  }

  /**
   * @private
   * @static
   * @param {ContentSection[]} sections
   * @param {string[]} targetMarkets
   * @returns {Promise<any[]>}
   */
  static async analyzeMarketSpecificFlags(
    sections,
    targetMarkets
  ) {
    const marketFlags = [];

    for (const market of targetMarkets) {
      const culturalRisks = this.identifyCulturalRisks(sections, market);
      const regulatoryFlags = this.identifyRegulatoryFlags(sections, market);
      const terminologyIssues = this.identifyTerminologyIssues(sections, market);

      marketFlags.push({
        market,
        culturalRisks,
        regulatoryFlags,
        terminologyIssues
      });
    }

    return marketFlags;
  }

  /**
   * @private
   * @static
   * @param {ContentSection[]} sections
   * @param {string} market
   * @returns {string[]}
   */
  static identifyCulturalRisks(sections, market) {
    const risks = [];
    const combinedContent = sections.map(s => s.content).join(' ').toLowerCase();

    // Market-specific cultural considerations
    const culturalFlags = {
      'US': ['guarantee', 'promise', 'cure'],
      'EU': ['natural', 'organic', 'chemical-free'],
      'JP': ['individual', 'personal', 'unique'],
      'CN': ['comparison', 'superior', 'better than']
    };

    const flagsForMarket = culturalFlags[market] || [];

    for (const flag of flagsForMarket) {
      if (combinedContent.includes(flag)) {
        risks.push(`"${flag}" may require cultural adaptation for ${market}`);
      }
    }

    return risks;
  }

  /**
   * @private
   * @static
   * @param {ContentSection[]} sections
   * @param {string} market
   * @returns {string[]}
   */
  static identifyRegulatoryFlags(sections, market) {
    const flags = [];
    const combinedContent = sections.map(s => s.content).join(' ').toLowerCase();

    // Market-specific regulatory considerations
    if (market === 'EU' && combinedContent.includes('fda approved')) {
      flags.push('FDA approval reference not valid in EU - use EMA or CE marking');
    }

    if (market === 'JP' && !combinedContent.includes('pmda')) {
      flags.push('Consider mentioning PMDA approval status for Japanese market');
    }

    return flags;
  }

  /**
   * @private
   * @static
   * @param {ContentSection[]} sections
   * @param {string} market
   * @returns {string[]}
   */
  static identifyTerminologyIssues(sections, market) {
    const issues = [];
    // This would be expanded with actual terminology databases
    const terminologyMap = {
      'US': { 'medicine': 'medication', 'tablets': 'pills' },
      'UK': { 'medication': 'medicine', 'pills': 'tablets' }
    };

    // Simple implementation - would be enhanced with real terminology databases
    return issues;
  }

  /**
   * @private
   * @static
   * @param {ContentSection[]} sections
   * @param {any} themeContext
   * @returns {Promise<Object>}
   */
  static async analyzeThemeAlignment(sections, themeContext) {
    if (!themeContext) {
      return {
        themeName: 'No theme context',
        alignmentScore: 50,
        misalignedElements: []
      };
    }

    const combinedContent = sections.map(s => s.content).join(' ').toLowerCase();
    const themeKeywords = themeContext.keyMessage?.toLowerCase().split(' ') || [];

    let alignmentScore = 0;
    const misalignedElements = [];

    // Check keyword alignment
    for (const keyword of themeKeywords) {
      if (combinedContent.includes(keyword)) {
        alignmentScore += 20;
      } else {
        misalignedElements.push(`Missing theme keyword: ${keyword}`);
      }
    }

    return {
      themeName: themeContext.name || 'Unknown theme',
      alignmentScore: Math.min(alignmentScore, 100),
      misalignedElements
    };
  }

  /**
   * @private
   * @static
   * @param {ContentSection[]} sections
   * @param {any} guidelines
   * @param {string[]} targetMarkets
   * @returns {Promise<any[]>}
   */
  static async generateActionableRecommendations(
    sections,
    guidelines,
    targetMarkets
  ) {
    const recommendations = [];

    // Example recommendation structure
    recommendations.push({
      priority: 'critical',
      category: 'Regulatory Compliance',
      description: 'Add required safety information disclaimer',
      action: 'Insert standard safety disclaimer at end of content',
      effort: 'low',
      impact: 'high',
      beforeExample: 'Contact your doctor for more information.',
      afterExample: 'Contact your doctor for more information. Please see Important Safety Information and Full Prescribing Information.'
    });

    return recommendations;
  }

  /**
   * @private
   * @static
   * @param {ContentAnalysisIssue[]} contentIssues
   * @param {any[]} marketFlags
   * @param {any} themeAlignment
   * @returns {BrandConsistencyResult}
   */
  static calculateEnhancedScores(
    contentIssues,
    marketFlags,
    themeAlignment
  ) {
    const criticalIssues = contentIssues.filter(i => i.severity === 'critical');
    const highIssues = contentIssues.filter(i => i.severity === 'high');

    let overallScore = 100;
    overallScore -= criticalIssues.length * 20;
    overallScore -= highIssues.length * 10;

    const messagingScore = Math.max(0, 100 - contentIssues.filter(i => i.category === 'messaging').length * 15);
    const regulatoryScore = Math.max(0, 100 - contentIssues.filter(i => i.category === 'regulatory').length * 25);
    const toneScore = Math.max(0, 100 - contentIssues.filter(i => i.category === 'tone').length * 10);
    const visualScore = 75; // Placeholder

    return {
      overallScore: Math.max(0, overallScore),
      messagingScore,
      toneScore,
      visualScore,
      regulatoryScore,
      issues: contentIssues,
      strengths: this.identifyStrengths(contentIssues, themeAlignment),
      recommendations: this.generateBasicRecommendations(contentIssues),
      status: this.determineStatus(overallScore, criticalIssues.length)
    };
  }

  /**
   * @private
   * @static
   * @param {ContentAnalysisIssue[]} contentIssues
   * @param {any} themeAlignment
   * @returns {string[]}
   */
  static identifyStrengths(contentIssues, themeAlignment) {
    const strengths = [];

    if (contentIssues.filter(i => i.category === 'regulatory' && i.severity === 'critical').length === 0) {
      strengths.push('No critical regulatory issues detected');
    }

    if (themeAlignment.alignmentScore > 70) {
      strengths.push('Strong alignment with strategic theme');
    }

    return strengths;
  }

  /**
   * @private
   * @static
   * @param {ContentAnalysisIssue[]} contentIssues
   * @returns {string[]}
   */
  static generateBasicRecommendations(contentIssues) {
    const recommendations = [];

    if (contentIssues.filter(i => i.severity === 'critical').length > 0) {
      recommendations.push('Address critical issues before proceeding');
    }

    return recommendations;
  }

  /**
   * @private
   * @static
   * @param {number} overallScore
   * @param {number} criticalIssuesCount
   * @returns {'compliant' | 'needs_review' | 'non_compliant'}
   */
  static determineStatus(overallScore, criticalIssuesCount) {
    if (criticalIssuesCount > 0) return 'non_compliant';
    if (overallScore < 70) return 'needs_review';
    return 'compliant';
  }

  // --- Helper methods for data fetching and suggestions (Mocked Supabase calls) ---

  /**
   * @private
   * @static
   * @param {string} brandId
   * @returns {Promise<any>}
   */
  static async getBrandGuidelines(brandId) {
    // Mocked data for structure
    return {
      brand_id: brandId,
      messaging_framework: {
        key_messages: ['innovative treatment', 'designed to help manage'],
        prohibited_terms: ['cure', 'miracle', 'guarantee']
      },
      tone_of_voice: {
        primary_tone: 'professional'
      }
    };
  }

  /**
   * @private
   * @static
   * @param {string} brandId
   * @returns {Promise<any>}
   */
  static async getBrandVision(brandId) {
    // Mocked data for structure
    return {
      brand_id: brandId,
      vision: 'To be the leading innovator in personalized medicine.'
    };
  }

  /**
   * @private
   * @static
   * @param {string} brandId
   * @param {any} context
   * @returns {Promise<Object>}
   */
  static async getStrategicContext(brandId, context) {
    // Get campaign objectives and audience insights from context
    return {
      campaignObjectives: context?.campaignContext?.objectives || ['increase HCP awareness', 'drive patient sign-ups'],
      audienceInsights: context?.campaignContext?.audienceInsights || { primary: 'HCPs', secondary: 'Patients' },
      previousContent: []
    };
  }

  /**
   * @private
   * @static
   * @param {string} term
   * @param {string[]} keyMessages
   * @returns {string}
   */
  static getSuggestedReplacement(term, keyMessages) {
    // Simple replacement logic - would be enhanced with terminology database
    const replacements = {
      'cure': 'treatment option',
      'guarantee': 'designed to help',
      'best': 'effective',
      'proven': 'studied'
    };

    return replacements[term.toLowerCase()] || keyMessages[0] || 'approved alternative';
  }

  /**
   * @private
   * @static
   * @param {string} claim
   * @returns {string}
   */
  static getSofterClaimAlternative(claim) {
    const alternatives = {
      'proven': 'studied in clinical trials',
      'guaranteed': 'designed to help',
      'best': 'an effective option',
      'most effective': 'a proven treatment option',
      'clinically proven': 'backed by clinical data'
    };

    return alternatives[claim.toLowerCase()] || 'clinically studied';
  }

  /**
   * @private
   * @static
   * @param {string} word
   * @returns {string}
   */
  static getProfessionalAlternative(word) {
    const alternatives = {
      'hey': 'hello',
      'wow': 'notably',
      'awesome': 'excellent',
      'cool': 'beneficial',
      'gonna': 'going to',
      'wanna': 'want to',
      'kinda': 'somewhat',
      'sorta': 'rather'
    };

    return alternatives[word.toLowerCase()] || word;
  }
}