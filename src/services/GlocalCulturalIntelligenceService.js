// GLOCAL Cultural Intelligence Service
// Analyzes cultural appropriateness and provides adaptation guidance

// NOTE: The path '@/integrations/supabase/client' is a TypeScript alias.
// In a standard JS environment, this needs adjustment. Assuming it's in a relative path.
import { supabase } from "../integrations/supabase/client.js";

// The following objects represent the structure previously defined by interfaces
// CulturalAnalysis, MarketProfile, GlocalContentSegment, etc. are now implicit.

export class GlocalCulturalIntelligenceService {
  // Market-specific cultural profiles
  static marketProfiles = {
    'Japan': {
      market: 'Japan',
      language: 'Japanese',
      culturalNorms: {
        communicationStyle: 'High context, indirect',
        formalityPreference: 'Very formal',
        colorSymbolism: {
          'white': 'purity, mourning',
          'red': 'celebration, energy',
          'blue': 'peace, calmness'
        },
        visualPreferences: ['Minimalist', 'Nature-inspired', 'Harmonious']
      },
      regulatoryContext: ['PMDA requirements', 'Japanese labeling standards']
    },
    'Germany': {
      market: 'Germany',
      language: 'German',
      culturalNorms: {
        communicationStyle: 'Low context, direct',
        formalityPreference: 'Formal',
        colorSymbolism: {
          'black': 'sophistication, seriousness',
          'green': 'health, environment'
        },
        visualPreferences: ['Data-driven', 'Precise', 'Professional']
      },
      regulatoryContext: ['EMA compliance', 'German advertising law']
    },
    'United States': {
      market: 'United States',
      language: 'English',
      culturalNorms: {
        communicationStyle: 'Low context, direct',
        formalityPreference: 'Casual',
        colorSymbolism: {
          'blue': 'trust, professionalism',
          'red': 'urgency, importance'
        },
        visualPreferences: ['Action-oriented', 'Confident', 'Inclusive']
      },
      regulatoryContext: ['FDA guidelines', 'OPDP requirements']
    },
    'China': {
      market: 'China',
      language: 'Mandarin',
      culturalNorms: {
        communicationStyle: 'High context, indirect',
        formalityPreference: 'Formal',
        colorSymbolism: {
          'red': 'luck, prosperity',
          'gold': 'wealth, prestige',
          'white': 'mourning'
        },
        visualPreferences: ['Auspicious symbols', 'Hierarchical', 'Detailed']
      },
      regulatoryContext: ['NMPA requirements', 'Chinese advertising law']
    }
  };

  /**
   * Analyze cultural appropriateness of content segment
   * @param {object} segment - The content segment object.
   * @param {string} targetMarket - The target market name (e.g., 'Japan').
   * @param {string} targetLanguage - The target language (e.g., 'Japanese').
   * @returns {Promise<object>} The cultural analysis report.
   */
  static async analyzeCulturalFit(
    segment,
    targetMarket,
    targetLanguage
  ) {
    const marketProfile = this.marketProfiles[targetMarket] || this.getDefaultProfile(targetMarket);

    // Analyze tone and style
    const toneAnalysis = this.analyzeTone(segment.source_text, marketProfile);

    // Generate adaptation suggestions
    const suggestions = this.generateAdaptationSuggestions(
      segment,
      marketProfile,
      toneAnalysis
    );

    // Identify risk factors
    const risks = this.identifyRiskFactors(segment, marketProfile);

    // Calculate appropriateness score
    const score = this.calculateAppropriatenessScore(segment, marketProfile, risks);

    const analysis = {
      segmentId: segment.id,
      targetMarket,
      appropriatenessScore: score,
      toneAnalysis,
      adaptationSuggestions: suggestions,
      riskFactors: risks,
      culturalConsiderations: this.getCulturalConsiderations(marketProfile)
    };

    // Store analysis in database
    await this.storeAnalysis(segment.id, segment.project_id, targetMarket, targetLanguage, analysis);

    return analysis;
  }

  /**
   * Generate cultural intelligence report for entire project
   * @param {string} projectId - The project ID.
   * @param {string[]} targetMarkets - Array of target market names.
   * @returns {Promise<Record<string, object[]>>} The complete cultural intelligence report.
   */
  static async generateProjectReport(
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

    // Analyze each market
    for (const market of targetMarkets) {
      const marketAnalyses = [];

      for (const segment of segments) {
        // Removed `as any` casting
        const analysis = await this.analyzeCulturalFit(
          segment,
          market,
          this.getMarketLanguage(market)
        );
        marketAnalyses.push(analysis);
      }

      report[market] = marketAnalyses;
    }

    return report;
  }

  /**
   * Get cultural adaptation recommendations
   * @param {string} market - The target market name.
   */
  static getCulturalGuidance(market) {
    const profile = this.marketProfiles[market];

    if (!profile) {
      return {
        dos: ['Research local cultural norms', 'Consult native speakers'],
        donts: ['Make assumptions', 'Direct translation without adaptation'],
        considerations: ['Local regulations', 'Cultural sensitivities']
      };
    }

    return {
      dos: [
        `Use ${profile.culturalNorms.communicationStyle} communication style`,
        `Maintain ${profile.culturalNorms.formalityPreference} tone`,
        'Consider local color symbolism',
        'Adapt visual elements to local preferences'
      ],
      donts: [
        'Use culturally inappropriate imagery',
        'Ignore local communication preferences',
        'Make direct comparisons (if high context culture)',
        'Use overly casual language (if formal culture)'
      ],
      considerations: profile.regulatoryContext
    };
  }

  // Private helper methods

  /**
   * @private
   */
  static analyzeTone(
    text,
    profile
  ) {
    // Simple heuristic-based tone analysis
    const formalityIndicators = ['please', 'kindly', 'would', 'could', 'may'];
    const informalityIndicators = ['hey', 'gonna', 'wanna', 'cool', 'awesome'];

    const lowerText = text.toLowerCase();
    const formalCount = formalityIndicators.filter(word => lowerText.includes(word)).length;
    const informalCount = informalityIndicators.filter(word => lowerText.includes(word)).length;

    let formality; // Type `| 'formal' | 'neutral' | 'informal'` removed
    if (formalCount > informalCount + 2) formality = 'formal';
    else if (informalCount > formalCount + 2) formality = 'informal';
    else formality = 'neutral';

    return {
      formality,
      emotionalTone: this.detectEmotionalTone(text),
      directness: profile.culturalNorms.communicationStyle.includes('direct') ? 'direct' : 'indirect'
    };
  }

  /**
   * @private
   */
  static detectEmotionalTone(text) {
    const positiveWords = ['effective', 'improved', 'better', 'beneficial', 'advantage'];
    const neutralWords = ['may', 'can', 'might', 'possible', 'available'];

    const lowerText = text.toLowerCase();
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;

    if (positiveCount >= 2) return 'Optimistic';
    if (neutralWords.some(word => lowerText.includes(word))) return 'Neutral';
    return 'Professional';
  }

  /**
   * @private
   */
  static generateAdaptationSuggestions(
    segment,
    profile,
    tone
  ) {
    const suggestions = [];

    // Formality mismatch
    if (tone.formality === 'informal' && profile.culturalNorms.formalityPreference === 'Very formal') {
      suggestions.push('Increase formality level to match cultural expectations');
    }

    // Communication style
    if (tone.directness === 'direct' && profile.culturalNorms.communicationStyle.includes('indirect')) {
      suggestions.push('Soften direct statements to align with high-context communication style');
    }

    // Segment-specific
    if (segment.segment_type === 'headline' || segment.segment_type === 'hero') {
      suggestions.push(`Adapt visual elements to ${profile.market} preferences: ${profile.culturalNorms.visualPreferences.join(', ')}`);
    }

    // Regulatory
    if (segment.regulatory_risk_level === 'high') {
      suggestions.push(`Review against ${profile.regulatoryContext.join(' and ')}`);
    }

    return suggestions;
  }

  /**
   * @private
   */
  static identifyRiskFactors(
    segment,
    profile
  ) {
    const risks = [];

    // Color risks
    const colors = ['white', 'red', 'black', 'green', 'blue', 'gold'];
    const mentionedColors = colors.filter(color =>
      segment.source_text.toLowerCase().includes(color)
    );

    mentionedColors.forEach(color => {
      const symbolism = profile.culturalNorms.colorSymbolism[color];
      if (symbolism) {
        risks.push(`Color "${color}" has specific meaning: ${symbolism}`);
      }
    });

    // Complexity risk
    if (segment.complexity_level === 'high') {
      risks.push('Complex medical content requires extra cultural validation');
    }

    // Cultural sensitivity
    if (segment.cultural_sensitivity_level === 'high') {
      risks.push('High cultural sensitivity - thorough review required');
    }

    return risks;
  }

  /**
   * @private
   */
  static calculateAppropriatenessScore(
    segment,
    profile,
    risks
  ) {
    let score = 100;

    // Deduct for risks
    score -= risks.length * 10;

    // Deduct for mismatches
    if (segment.complexity_level === 'high') score -= 5;
    if (segment.cultural_sensitivity_level === 'high') score -= 5;

    return Math.max(0, Math.min(100, score));
  }

  /**
   * @private
   */
  static getCulturalConsiderations(profile) {
    return [
      `Communication style: ${profile.culturalNorms.communicationStyle}`,
      `Formality preference: ${profile.culturalNorms.formalityPreference}`,
      `Visual preferences: ${profile.culturalNorms.visualPreferences.join(', ')}`,
      ...profile.regulatoryContext
    ];
  }

  /**
   * @private
   */
  static async storeAnalysis(
    segmentId,
    projectId,
    targetMarket,
    targetLanguage,
    analysis
  ) {
    try {
      await supabase.from('glocal_cultural_intelligence').insert({
        segment_id: segmentId,
        project_id: projectId,
        target_market: targetMarket,
        target_language: targetLanguage,
        cultural_tone_analysis: analysis.toneAnalysis,
        formality_recommendations: {
          addressForms: ['Use appropriate honorifics'],
          respecfulLanguage: ['Maintain professional terminology']
        },
        visual_cultural_guidance: {
          colorPreferences: Object.keys(this.marketProfiles[targetMarket]?.culturalNorms.colorSymbolism || {}),
          symbolism: [],
          imageGuidelines: []
        },
        communication_style_insights: {
          preferredStyle: this.marketProfiles[targetMarket]?.culturalNorms.communicationStyle || 'Direct',
          keyConsiderations: analysis.culturalConsiderations
        },
        cultural_appropriateness_score: analysis.appropriatenessScore,
        adaptation_quality_score: analysis.appropriatenessScore,
        market_relevance_score: analysis.appropriatenessScore,
        adaptation_suggestions: analysis.adaptationSuggestions.map(s => ({ suggestion: s })),
        risk_factors: analysis.riskFactors.map(r => ({ risk: r })),
        analysis_metadata: {}
      });
    } catch (error) {
      console.error('Error storing cultural analysis:', error);
    }
  }

  /**
   * @private
   */
  static getMarketLanguage(market) {
    return this.marketProfiles[market]?.language || 'English';
  }

  /**
   * @private
   */
  static getDefaultProfile(market) {
    return {
      market,
      language: 'English',
      culturalNorms: {
        communicationStyle: 'Direct',
        formalityPreference: 'Neutral',
        colorSymbolism: {},
        visualPreferences: ['Professional', 'Clear']
      },
      regulatoryContext: ['Local regulations']
    };
  }
}