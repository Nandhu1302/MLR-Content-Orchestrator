/**
 * @typedef {Object} TabooContentRule
 * @property {string} market
 * @property {'color'|'symbol'|'number'|'concept'|'imagery'|'gesture'|'text'} category
 * @property {string} element
 * @property {'warning'|'critical'|'forbidden'} severity
 * @property {string} reason
 * @property {string[]} alternatives
 * @property {'healthcare'|'marketing'|'general'} [context]
 */

/**
 * @typedef {Object} CulturalTransformationRule
 * @property {string} market
 * @property {string} assetType
 * @property {'text'|'visual'|'structure'|'tone'} transformationType
 * @property {string} rule
 * @property {Object} example
 * @property {string} example.before
 * @property {string} example.after
 * @property {string} example.rationale
 * @property {'low'|'medium'|'high'|'critical'} priority
 * @property {string} estimatedEffort
 */

/**
 * @typedef {Object} CulturalValidationResult
 * @property {number} overallScore
 * @property {'low'|'medium'|'high'|'critical'} riskLevel
 * @property {Array<{type: 'taboo_content'|'cultural_mismatch'|'tone_inappropriate'|'visual_concern', severity: 'warning'|'critical'|'forbidden', element: string, market: string, description: string, recommendation: string}>} issues
 * @property {CulturalTransformationRule[]} transformationRules
 * @property {Record<string, number>} marketReadiness
 * @property {string[]} recommendations
 */

/**
 * @typedef {Object} VisualCulturalGuidelines
 * @property {string} market
 * @property {Object} colorPalette
 * @property {Array<{ color: string; meaning: string; usage: string }>} colorPalette.preferred
 * @property {Array<{ color: string; reason: string; context?: string }>} colorPalette.avoid
 * @property {string[]} colorPalette.neutral
 * @property {Object} imagery
 * @property {string[]} imagery.preferred
 * @property {string[]} imagery.avoid
 * @property {string[]} imagery.considerations
 * @property {Object} layout
 * @property {'left-to-right'|'right-to-left'|'top-to-bottom'} layout.readingPattern
 * @property {string} layout.visualHierarchy
 * @property {string} layout.whitespacePreferences
 * @property {Object} typography
 * @property {string[]} typography.preferences
 * @property {string[]} typography.considerations
 */

// NOTE: External dependencies (supabase, CulturalAdaptationService) are assumed to be available globally or imported separately.
// The original TypeScript imports were removed to convert to standard JS.

export class CulturalIntelligenceValidationService {

  /**
   * Comprehensive cultural validation of asset content and design
   * @param {any} assetContent
   * @param {string} assetType
   * @param {string[]} targetMarkets
   * @param {string} brandId
   * @returns {Promise<CulturalValidationResult>}
   */
  static async validateCulturalAppropriateness(
    assetContent,
    assetType,
    targetMarkets,
    brandId
  ) {
    try {
      const issues = [];
      const transformationRules = [];
      const marketReadiness = {};

      for (const market of targetMarkets) {
        // Get market-specific cultural rules
        const tabooRules = await this._getTabooContentRules(market);
        const transformRules = await this._getTransformationRules(market, assetType);

        // Validate content against taboo rules
        const tabooValidation = await this._validateAgainstTabooContent(
          assetContent,
          tabooRules,
          market
        );

        issues.push(...tabooValidation.issues);

        // Get transformation requirements
        const requiredTransformations = await this._getRequiredTransformations(
          assetContent,
          transformRules,
          market
        );

        transformationRules.push(...requiredTransformations);

        // Calculate market readiness score
        const readinessScore = this._calculateMarketReadiness(
          tabooValidation.issues,
          requiredTransformations
        );

        marketReadiness[market] = readinessScore;
      }

      // Calculate overall score
      const overallScore = this._calculateOverallScore(marketReadiness, issues);

      // Determine risk level
      const riskLevel = this._determineRiskLevel(issues, overallScore);

      // Generate recommendations
      const recommendations = this._generateCulturalRecommendations(
        issues,
        transformationRules,
        marketReadiness
      );

      return {
        overallScore,
        riskLevel,
        issues,
        transformationRules,
        marketReadiness,
        recommendations
      };
    } catch (error) {
      console.error('Error validating cultural appropriateness:', error);
      throw error;
    }
  }

  /**
   * Get market-specific visual adaptation guidelines
   * @param {string} market
   * @returns {Promise<VisualCulturalGuidelines>}
   */
  static async getVisualAdaptationGuidelines(market) {
    const guidelines = this._generateVisualGuidelines(market);
    return guidelines;
  }

  /**
   * Real-time cultural sensitivity scoring as content is edited
   * @param {string} text
   * @param {string[]} targetMarkets
   * @param {'patient'|'hcp'|'marketing'} context
   * @returns {Promise<{score: number; warnings: Array<{ market: string; issue: string; severity: string }>; suggestions: string[]}>}
   */
  static async getRealTimeCulturalScore(
    text,
    targetMarkets,
    context
  ) {
    const warnings = [];
    const suggestions = [];

    let totalScore = 100;

    for (const market of targetMarkets) {
      const tabooRules = await this._getTabooContentRules(market);

      // Check for taboo content in text
      for (const rule of tabooRules) {
        if (rule.category === 'text' && text.toLowerCase().includes(rule.element.toLowerCase())) {
          warnings.push({
            market,
            issue: `Contains potentially inappropriate content: "${rule.element}"`,
            severity: rule.severity
          });

          totalScore -= rule.severity === 'critical' ? 30 : rule.severity === 'forbidden' ? 50 : 10;

          if (rule.alternatives.length > 0) {
            suggestions.push(`Consider using: ${rule.alternatives.join(' or ')}`);
          }
        }
      }

      // Check communication style
      const styleScore = await this._assessCommunicationStyle(text, market, context);
      if (styleScore < 70) {
        warnings.push({
          market,
          issue: 'Communication style may not resonate with cultural preferences',
          severity: 'warning'
        });
        totalScore -= 15;
      }
    }

    return {
      score: Math.max(0, totalScore),
      warnings,
      suggestions
    };
  }

  /**
   * Generate specific transformation instructions for each market
   * @param {any} assetContent
   * @param {string} assetType
   * @param {string} sourceMarket
   * @param {string} targetMarket
   * @returns {Promise<{textTransformations: Array<{ element: string; instruction: string; example?: string }>; visualTransformations: Array<{ element: string; instruction: string; rationale: string }>; structuralChanges: Array<{ element: string; instruction: string; effort: string }>; culturalNotes: string[]}>}
   */
  static async generateTransformationPlaybook(
    assetContent,
    assetType,
    sourceMarket,
    targetMarket
  ) {
    const transformationRules = await this._getTransformationRules(targetMarket, assetType);
    const visualGuidelines = await this.getVisualAdaptationGuidelines(targetMarket);

    const playbook = {
      textTransformations: this._generateTextTransformations(assetContent, transformationRules),
      visualTransformations: this._generateVisualTransformations(assetContent, visualGuidelines),
      structuralChanges: this._generateStructuralChanges(assetContent, transformationRules),
      culturalNotes: this._generateCulturalNotes(targetMarket, assetType)
    };

    return playbook;
  }

  // Private helper methods (renamed with _ prefix)

  /**
   * @private
   * @param {string} market
   * @returns {Promise<TabooContentRule[]>}
   */
  static async _getTabooContentRules(market) {
    // In production, this would come from a comprehensive cultural database
    const tabooRules = {
      'China': [
        {
          market: 'China',
          category: 'color',
          element: 'white',
          severity: 'warning',
          reason: 'Associated with mourning and death',
          alternatives: ['red', 'gold', 'yellow'],
          context: 'healthcare'
        },
        {
          market: 'China',
          category: 'number',
          element: '4',
          severity: 'critical',
          reason: 'Sounds like "death" in Chinese',
          alternatives: ['8', '6', '9']
        },
        {
          market: 'China',
          category: 'symbol',
          element: 'clock',
          severity: 'forbidden',
          reason: 'Symbol of death, never give as gift',
          alternatives: ['calendar', 'hourglass']
        }
      ],
      'Japan': [
        {
          market: 'Japan',
          category: 'number',
          element: '4',
          severity: 'critical',
          reason: 'Unlucky number associated with death',
          alternatives: ['3', '5', '7']
        },
        {
          market: 'Japan',
          category: 'concept',
          element: 'direct confrontation',
          severity: 'warning',
          reason: 'Conflicts with harmony-focused culture',
          alternatives: ['subtle suggestion', 'indirect approach']
        },
        {
          market: 'Japan',
          category: 'imagery',
          element: 'pointing finger',
          severity: 'warning',
          reason: 'Considered rude and aggressive',
          alternatives: ['open palm gesture', 'group imagery']
        }
      ],
      'Germany': [
        {
          market: 'Germany',
          category: 'concept',
          element: 'exaggerated claims',
          severity: 'warning',
          reason: 'German culture values precision and modesty',
          alternatives: ['factual statements', 'evidence-based claims']
        }
      ]
    };

    return tabooRules[market] || [];
  }

  /**
   * @private
   * @param {string} market
   * @param {string} assetType
   * @returns {Promise<CulturalTransformationRule[]>}
   */
  static async _getTransformationRules(market, assetType) {
    // Market-specific transformation rules
    const rules = {
      'Japan': [
        {
          market: 'Japan',
          assetType: 'email',
          transformationType: 'text',
          rule: 'Replace direct CTAs with softer suggestions',
          example: {
            before: 'You should ask your doctor about this treatment',
            after: 'Please consider discussing this treatment option with your healthcare provider',
            rationale: 'Japanese culture prefers indirect, respectful communication'
          },
          priority: 'high',
          estimatedEffort: '2-4 hours'
        },
        {
          market: 'Japan',
          assetType: 'social_post',
          transformationType: 'tone',
          rule: 'Use group-focused language instead of individual focus',
          example: {
            before: 'Take control of your health',
            after: 'Together, we can support better health outcomes',
            rationale: 'Collectivist culture values group harmony over individual achievement'
          },
          priority: 'medium',
          estimatedEffort: '1-2 hours'
        }
      ],
      'Germany': [
        {
          market: 'Germany',
          assetType: 'presentation',
          transformationType: 'structure',
          rule: 'Include detailed technical data and evidence',
          example: {
            before: 'Our treatment is highly effective',
            after: 'Clinical trials demonstrate 94.2% efficacy (n=1,247, p<0.001)',
            rationale: 'German audience expects precise, evidence-based information'
          },
          priority: 'critical',
          estimatedEffort: '4-8 hours'
        }
      ],
      'China': [
        {
          market: 'China',
          assetType: 'brochure',
          transformationType: 'text',
          rule: 'Include family decision-making context',
          example: {
            before: 'Discuss with your doctor',
            after: 'Discuss with your doctor and family members',
            rationale: 'Family involvement in health decisions is crucial in Chinese culture'
          },
          priority: 'high',
          estimatedEffort: '2-3 hours'
        }
      ]
    };

    return rules[market]?.filter(rule => rule.assetType === assetType) || [];
  }

  /**
   * @private
   * @param {any} content
   * @param {TabooContentRule[]} tabooRules
   * @param {string} market
   * @returns {Promise<{ issues: any[] }>}
   */
  static async _validateAgainstTabooContent(
    content,
    tabooRules,
    market
  ) {
    const issues = [];

    // Check text content
    const textContent = `${content.headline || ''} ${content.body || ''} ${content.cta || ''}`.toLowerCase();

    for (const rule of tabooRules) {
      if (rule.category === 'text' || rule.category === 'concept') {
        if (textContent.includes(rule.element.toLowerCase())) {
          issues.push({
            type: 'taboo_content',
            severity: rule.severity,
            element: rule.element,
            market,
            description: rule.reason,
            recommendation: `Consider alternatives: ${rule.alternatives.join(', ')}`
          });
        }
      }
    }

    // Check visual elements
    if (content.brandElements?.colors) {
      const colors = content.brandElements.colors;
      for (const rule of tabooRules) {
        if (rule.category === 'color' && colors.some(color => color.toLowerCase().includes(rule.element.toLowerCase()))) {
          issues.push({
            type: 'visual_concern',
            severity: rule.severity,
            element: rule.element,
            market,
            description: rule.reason,
            recommendation: `Consider using: ${rule.alternatives.join(', ')}`
          });
        }
      }
    }

    return { issues };
  }

  /**
   * @private
   * @param {any} content
   * @param {CulturalTransformationRule[]} transformRules
   * @param {string} market
   * @returns {Promise<CulturalTransformationRule[]>}
   */
  static async _getRequiredTransformations(
    content,
    transformRules,
    market
  ) {
    // Filter rules that apply to this specific content
    return transformRules.filter(rule => {
      // Add logic to determine if rule applies to specific content
      return true; // Simplified for now
    });
  }

  /**
   * @private
   * @param {any[]} issues
   * @param {CulturalTransformationRule[]} transformations
   * @returns {number}
   */
  static _calculateMarketReadiness(issues, transformations) {
    let score = 100;

    // Deduct for issues
    issues.forEach(issue => {
      switch (issue.severity) {
        case 'forbidden':
          score -= 50;
          break;
        case 'critical':
          score -= 30;
          break;
        case 'warning':
          score -= 10;
          break;
      }
    });

    // Deduct for required transformations
    transformations.forEach(transformation => {
      switch (transformation.priority) {
        case 'critical':
          score -= 20;
          break;
        case 'high':
          score -= 15;
          break;
        case 'medium':
          score -= 10;
          break;
        case 'low':
          score -= 5;
          break;
      }
    });

    return Math.max(0, score);
  }

  /**
   * @private
   * @param {Record<string, number>} marketReadiness
   * @param {any[]} issues
   * @returns {number}
   */
  static _calculateOverallScore(marketReadiness, issues) {
    const marketScores = Object.values(marketReadiness);
    if (marketScores.length === 0) return 100;

    const averageScore = marketScores.reduce((sum, score) => sum + score, 0) / marketScores.length;

    // Adjust for critical issues
    const criticalIssues = issues.filter(issue => issue.severity === 'forbidden' || issue.severity === 'critical');
    if (criticalIssues.length > 0) {
      return Math.min(averageScore, 60);
    }

    return Math.round(averageScore);
  }

  /**
   * @private
   * @param {any[]} issues
   * @param {number} overallScore
   * @returns {'low' | 'medium' | 'high' | 'critical'}
   */
  static _determineRiskLevel(issues, overallScore) {
    const forbiddenIssues = issues.filter(issue => issue.severity === 'forbidden');
    const criticalIssues = issues.filter(issue => issue.severity === 'critical');

    if (forbiddenIssues.length > 0) return 'critical';
    if (criticalIssues.length > 0 || overallScore < 50) return 'high';
    if (overallScore < 70) return 'medium';
    return 'low';
  }

  /**
   * @private
   * @param {any[]} issues
   * @param {CulturalTransformationRule[]} transformations
   * @param {Record<string, number>} marketReadiness
   * @returns {string[]}
   */
  static _generateCulturalRecommendations(
    issues,
    transformations,
    marketReadiness
  ) {
    const recommendations = [];

    // Issue-based recommendations
    const forbiddenIssues = issues.filter(issue => issue.severity === 'forbidden');
    if (forbiddenIssues.length > 0) {
      recommendations.push('CRITICAL: Address forbidden cultural elements before proceeding');
    }

    const criticalIssues = issues.filter(issue => issue.severity === 'critical');
    if (criticalIssues.length > 0) {
      recommendations.push('Review critical cultural issues to avoid potential offense');
    }

    // Market-specific recommendations
    const lowReadinessMarkets = Object.entries(marketReadiness)
      .filter(([market, score]) => score < 70)
      .map(([market, score]) => market);

    if (lowReadinessMarkets.length > 0) {
      recommendations.push(`Focus cultural adaptation efforts on: ${lowReadinessMarkets.join(', ')}`);
    }

    // Transformation recommendations
    const highPriorityTransformations = transformations.filter(t => t.priority === 'critical' || t.priority === 'high');
    if (highPriorityTransformations.length > 0) {
      recommendations.push(`Implement ${highPriorityTransformations.length} high-priority cultural adaptations`);
    }

    return recommendations;
  }

  /**
   * @private
   * @param {string} market
   * @returns {VisualCulturalGuidelines}
   */
  static _generateVisualGuidelines(market) {
    const guidelines = {
      'China': {
        market: 'China',
        colorPalette: {
          preferred: [
            { color: 'red', meaning: 'luck and prosperity', usage: 'accent colors, CTAs' },
            { color: 'gold', meaning: 'wealth and success', usage: 'premium elements' },
            { color: 'yellow', meaning: 'imperial power', usage: 'backgrounds' }
          ],
          avoid: [
            { color: 'white', reason: 'associated with mourning', context: 'healthcare' },
            { color: 'black', reason: 'negative associations' }
          ],
          neutral: ['blue', 'green', 'purple']
        },
        imagery: {
          preferred: ['family groups', 'traditional with modern blend', 'prosperity symbols'],
          avoid: ['clocks', 'white flowers', 'individual focus'],
          considerations: ['Show multigenerational families', 'Include prosperity symbols']
        },
        layout: {
          readingPattern: 'left-to-right',
          visualHierarchy: 'respect for hierarchy important',
          whitespacePreferences: 'balanced, not too sparse'
        },
        typography: {
          preferences: ['clear, readable fonts', 'respect for formal presentation'],
          considerations: ['Ensure Chinese character compatibility']
        }
      }
    };

    return guidelines[market] || this._getDefaultGuidelines();
  }

  /**
   * @private
   * @returns {VisualCulturalGuidelines}
   */
  static _getDefaultGuidelines() {
    return {
      market: 'default',
      colorPalette: {
        preferred: [],
        avoid: [],
        neutral: ['blue', 'white', 'gray']
      },
      imagery: {
        preferred: ['diverse representation', 'professional settings'],
        avoid: ['stereotypes', 'offensive gestures'],
        considerations: ['Cultural sensitivity', 'Local relevance']
      },
      layout: {
        readingPattern: 'left-to-right',
        visualHierarchy: 'clear and logical',
        whitespacePreferences: 'balanced'
      },
      typography: {
        preferences: ['readable', 'professional'],
        considerations: ['Local language support']
      }
    };
  }

  /**
   * @private
   * @param {string} text
   * @param {string} market
   * @param {string} context
   * @returns {Promise<number>}
   */
  static async _assessCommunicationStyle(text, market, context) {
    // Simplified communication style assessment
    // NOTE: This requires the external CulturalAdaptationService to be defined.
    // const marketPrefs = await CulturalAdaptationService.getMarketPreferences(market);

    // Mocking CulturalAdaptationService.getMarketPreferences for conversion context
    const marketPrefs = {
        communicationStyle: market === 'Japan' ? 'indirect' : market === 'Germany' ? 'direct' : 'default'
    };

    // Use the existing cultural adaptation service method
    const styleMatch = this._assessCommunicationStyleMatch(text, marketPrefs.communicationStyle);
    return styleMatch ? 85 : 60;
  }

  /**
   * @private
   * @param {string} text
   * @param {string} preferredStyle
   * @returns {boolean}
   */
  static _assessCommunicationStyleMatch(text, preferredStyle) {
    const directWords = ['best', 'guaranteed', 'proven', 'must', 'should'];
    const indirectWords = ['may', 'could', 'consider', 'perhaps', 'might'];

    const lowerText = text.toLowerCase();
    const directCount = directWords.filter(word => lowerText.includes(word)).length;
    const indirectCount = indirectWords.filter(word => lowerText.includes(word)).length;

    switch (preferredStyle) {
      case 'direct':
        return directCount >= indirectCount;
      case 'indirect':
        return indirectCount > directCount;
      default:
        return true;
    }
  }

  /**
   * @private
   * @param {any} content
   * @param {CulturalTransformationRule[]} rules
   * @returns {Array<{ element: string; instruction: string; example?: string }>}
   */
  static _generateTextTransformations(content, rules) {
    return rules
      .filter(rule => rule.transformationType === 'text')
      .map(rule => ({
        element: rule.rule,
        instruction: rule.rule,
        example: `${rule.example.before} → ${rule.example.after}`
      }));
  }

  /**
   * @private
   * @param {any} content
   * @param {VisualCulturalGuidelines} guidelines
   * @returns {Array<{ element: string; instruction: string; rationale: string }>}
   */
  static _generateVisualTransformations(content, guidelines) {
    const transformations = [];

    // Color transformations
    if (guidelines.colorPalette.avoid.length > 0) {
      transformations.push({
        element: 'Color palette',
        instruction: `Avoid colors: ${guidelines.colorPalette.avoid.map(c => c.color).join(', ')}`,
        rationale: 'Cultural color associations'
      });
    }

    // Layout transformations
    transformations.push({
      element: 'Layout',
      instruction: guidelines.layout.visualHierarchy,
      rationale: 'Cultural design preferences'
    });

    return transformations;
  }

  /**
   * @private
   * @param {any} content
   * @param {CulturalTransformationRule[]} rules
   * @returns {Array<{ element: string; instruction: string; effort: string }>}
   */
  static _generateStructuralChanges(content, rules) {
    return rules
      .filter(rule => rule.transformationType === 'structure')
      .map(rule => ({
        element: rule.rule,
        instruction: rule.rule,
        effort: rule.estimatedEffort
      }));
  }

  /**
   * @private
   * @param {string} market
   * @param {string} assetType
   * @returns {string[]}
   */
  static _generateCulturalNotes(market, assetType) {
    const notes = {
      'China': [
        'Family involvement in healthcare decisions is crucial',
        'Emphasize harmony and collective benefit',
        'Consider traditional medicine integration',
        'Government approval messaging may be important'
      ],
      'Japan': [
        'Avoid putting individuals in spotlight',
        'Use respectful, indirect language',
        'Group consensus is valued over individual choice',
        'Privacy and discretion are highly valued'
      ],
      'Germany': [
        'Provide detailed technical evidence',
        'Emphasize quality and precision',
        'Direct communication is acceptable and preferred',
        'Strict privacy compliance is essential'
      ]
    };

    return notes[market] || ['Consult local cultural experts for specific guidance'];
  }
}