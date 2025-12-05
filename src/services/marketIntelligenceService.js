import { supabase } from '@/integrations/supabase/client';
// Assuming BrandConsistencyService is available and exports the necessary functions
// import { BrandConsistencyService } from './brandConsistencyService';
// Assuming SUPPORTED_MARKETS and isMarketSupported are defined in the config
// import { SUPPORTED_MARKETS, isMarketSupported } from '@/config/localizationConfig';

// Placeholder imports for services and config used in the original TS
const BrandConsistencyService = {
  validateBrandConsistency: async (assetId, brandId) => ({ overallScore: 90 }) // Mock implementation
};

const SUPPORTED_MARKETS = [
    { code: 'JP', name: 'Japan', complexity: 'High' },
    { code: 'CN', name: 'China', complexity: 'High' },
    { code: 'US', name: 'United States', complexity: 'Medium' }
];

const isMarketSupported = (marketCode) => SUPPORTED_MARKETS.some(m => m.code === marketCode);


/**
 * @typedef {Object} MarketRequirement
 * @property {'messaging' | 'tone' | 'visual' | 'regulatory' | 'cultural'} category
 * @property {string} requirement
 * @property {'must' | 'should' | 'could'} priority
 * @property {string} culturalContext
 * @property {'minor' | 'moderate' | 'major'} adaptationLevel
 */

/**
 * @typedef {Object} CompetitiveAnalysis
 * @property {string} marketPosition
 * @property {string[]} keyDifferentiators
 * @property {'Low' | 'Medium' | 'High'} competitiveThreat
 * @property {string[]} uniqueValueProps
 * @property {string[]} marketChallenges
 */

/**
 * @typedef {Object} MarketAnalysis
 * @property {string} marketCode
 * @property {string} marketName
 * @property {number} globalBrandBaseline
 * @property {MarketRequirement[]} marketSpecificRequirements
 * @property {number} culturalAdaptationScore
 * @property {CompetitiveAnalysis} competitivePositioning
 * @property {'Low' | 'Medium' | 'High' | 'Critical'} riskLevel
 * @property {'Low' | 'Medium' | 'High'} complexity
 */

/**
 * @typedef {Object} AdaptationItem
 * @property {string} element
 * @property {string} currentValue
 * @property {string} suggestedValue
 * @property {string} rationale
 * @property {'low' | 'medium' | 'high'} effort
 * @property {'low' | 'medium' | 'high'} risk
 */

/**
 * @typedef {Object} ContentAdaptationRoadmap
 * @property {string} marketCode
 * @property {AdaptationItem[]} criticalChanges
 * @property {AdaptationItem[]} recommendedChanges
 * @property {AdaptationItem[]} optionalChanges
 * @property {'no_delay' | 'minor_delay' | 'major_delay'} timelineImpact
 */

export class MarketIntelligenceService {
  /**
   * Analyzes a single asset against multiple target markets.
   * @param {string} assetId
   * @param {string} brandId
   * @param {string[]} [targetMarkets=['JP', 'CN']]
   * @param {Object} [context]
   * @returns {Promise<MarketAnalysis[]>}
   */
  static async analyzeAssetForMarkets(
    assetId, 
    brandId, 
    targetMarkets = ['JP', 'CN'],
    context = {}
  ) {
    /** @type {MarketAnalysis[]} */
    const analyses = [];

    for (const marketCode of targetMarkets) {
      if (!isMarketSupported(marketCode)) continue;

      const analysis = await this.analyzeAssetForMarket(assetId, brandId, marketCode);
      analyses.push(analysis);
    }

    return analyses;
  }

  /**
   * Analyzes a single asset for a specific market.
   * @private
   * @param {string} assetId
   * @param {string} brandId
   * @param {string} marketCode
   * @returns {Promise<MarketAnalysis>}
   */
  static async analyzeAssetForMarket(
    assetId,
    brandId,
    marketCode
  ) {
    // Get asset data
    const { data: asset } = await supabase
      .from('content_assets')
      .select('*')
      .eq('id', assetId)
      .single();

    // Get global brand baseline
    const brandConsistency = await BrandConsistencyService.validateBrandConsistency(assetId, brandId);
    const globalBrandBaseline = brandConsistency.overallScore;

    // Generate market-specific requirements
    const marketRequirements = this.generateMarketRequirements(asset, marketCode);
    
    // Calculate cultural adaptation score
    const culturalAdaptationScore = this.calculateCulturalAdaptationScore(asset, marketCode);
    
    // Generate competitive positioning analysis
    const competitivePositioning = this.generateCompetitiveAnalysis(asset, marketCode);
    
    // Assess risk level
    const riskLevel = this.assessRiskLevel(culturalAdaptationScore, marketRequirements);
    
    // Get market complexity
    const marketInfo = SUPPORTED_MARKETS.find(m => m.code === marketCode);
    const complexity = marketInfo?.complexity || 'Medium';

    return {
      marketCode,
      marketName: marketInfo?.name || marketCode,
      globalBrandBaseline,
      marketSpecificRequirements: marketRequirements,
      culturalAdaptationScore,
      competitivePositioning,
      riskLevel,
      complexity
    };
  }

  /**
   * Generates a set of specific adaptation requirements for a market (JP/CN mock).
   * @private
   * @param {any} asset
   * @param {string} marketCode
   * @returns {MarketRequirement[]}
   */
  static generateMarketRequirements(asset, marketCode) {
    /** @type {MarketRequirement[]} */
    const requirements = [];

    if (marketCode === 'JP') {
      requirements.push(
        {
          category: 'messaging',
          requirement: 'Adjust messaging to emphasize safety and reliability',
          priority: 'must',
          culturalContext: 'Japanese culture prioritizes trust and long-term relationships in healthcare',
          adaptationLevel: 'moderate'
        },
        {
          category: 'tone',
          requirement: 'Use more formal and respectful language patterns',
          priority: 'must',
          culturalContext: 'Japanese business culture requires formal communication, especially in healthcare',
          adaptationLevel: 'major'
        },
        {
          category: 'visual',
          requirement: 'Adapt visual hierarchy to support right-to-left scanning patterns',
          priority: 'should',
          culturalContext: 'Japanese reading patterns influence visual information processing',
          adaptationLevel: 'moderate'
        },
        {
          category: 'regulatory',
          requirement: 'Ensure compliance with PMDA pharmaceutical advertising guidelines',
          priority: 'must',
          culturalContext: 'Strict regulatory environment for pharmaceutical marketing in Japan',
          adaptationLevel: 'major'
        },
        {
          category: 'cultural',
          requirement: 'Incorporate concepts of wa (harmony) in messaging approach',
          priority: 'should',
          culturalContext: 'Harmony and consensus are fundamental values in Japanese culture',
          adaptationLevel: 'moderate'
        }
      );
    } else if (marketCode === 'CN') {
      requirements.push(
        {
          category: 'messaging',
          requirement: 'Emphasize innovation and scientific advancement',
          priority: 'must',
          culturalContext: 'Chinese market values cutting-edge technology and proven efficacy',
          adaptationLevel: 'moderate'
        },
        {
          category: 'tone',
          requirement: 'Use confident and authoritative language',
          priority: 'should',
          culturalContext: 'Chinese healthcare professionals expect confident, evidence-based communication',
          adaptationLevel: 'minor'
        },
        {
          category: 'visual',
          requirement: 'Adapt color usage to avoid unlucky color associations',
          priority: 'must',
          culturalContext: 'Color symbolism is significant in Chinese culture, especially in healthcare',
          adaptationLevel: 'minor'
        },
        {
          category: 'regulatory',
          requirement: 'Ensure compliance with NMPA advertising and labeling requirements',
          priority: 'must',
          culturalContext: 'Stringent regulatory oversight for pharmaceutical marketing in China',
          adaptationLevel: 'major'
        },
        {
          category: 'cultural',
          requirement: 'Incorporate traditional medicine compatibility messaging where appropriate',
          priority: 'could',
          culturalContext: 'Traditional Chinese Medicine remains important in healthcare decisions',
          adaptationLevel: 'moderate'
        }
      );
    }

    return requirements;
  }

  /**
   * Calculates a score indicating how well the existing asset aligns with the market's culture (100 being perfect).
   * @private
   * @param {any} asset
   * @param {string} marketCode
   * @returns {number}
   */
  static calculateCulturalAdaptationScore(asset, marketCode) {
    const content = asset.primary_content || {};
    let score = 70; // Base score

    // Analyze content complexity
    const text = `${content.headline || ''} ${content.body || ''}`.toLowerCase();
    
    // Market-specific scoring factors (Mock logic)
    if (marketCode === 'JP') {
      // Check for concepts that need adaptation
      if (text.includes('individual')) score -= 10; // Collectivist vs individualist culture
      if (text.includes('fast') || text.includes('quick')) score -= 5; // Patience-valued culture
      if (text.includes('aggressive')) score -= 15; // Harmony-valued culture
      if (content.brandElements?.colors?.includes('#ff0000')) score -= 10; // Red can be problematic
      
      // Positive factors
      if (text.includes('proven') || text.includes('established')) score += 10;
      if (text.includes('trust') || text.includes('reliable')) score += 15;
    } else if (marketCode === 'CN') {
      // Check for concepts that need adaptation
      if (text.includes('traditional') && !text.includes('modern')) score -= 10; // Balance needed
      if (content.brandElements?.colors?.includes('#ffffff')) score -= 5; // White can be problematic
      if (text.includes('old') || text.includes('elderly')) score -= 10; // Age sensitivity
      
      // Positive factors
      if (text.includes('innovation') || text.includes('advanced')) score += 15;
      if (text.includes('scientific') || text.includes('research')) score += 10;
      if (text.includes('modern') || text.includes('cutting-edge')) score += 10;
    }

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Generates mock competitive analysis for a market.
   * @private
   * @param {any} asset
   * @param {string} marketCode
   * @returns {CompetitiveAnalysis}
   */
  static generateCompetitiveAnalysis(asset, marketCode) {
    
    if (marketCode === 'JP') {
      return {
        marketPosition: 'Premium trusted partner',
        keyDifferentiators: [
          'Established safety profile with long-term data',
          'Strong physician advocacy and support programs',
          'Cultural sensitivity in patient communication'
        ],
        competitiveThreat: 'Medium',
        uniqueValueProps: [
          'Proven track record in Japanese market',
          'Localized patient support services',
          'Integration with existing treatment protocols'
        ],
        marketChallenges: [
          'Price-sensitive healthcare system',
          'Strong preference for established treatments',
          'Complex regulatory approval processes'
        ]
      };
    } else {
      return {
        marketPosition: 'Innovation leader',
        keyDifferentiators: [
          'Cutting-edge scientific approach',
          'Advanced clinical data and research',
          'Modern treatment methodology'
        ],
        competitiveThreat: 'High',
        uniqueValueProps: [
          'Latest generation therapeutic approach',
          'Strong clinical efficacy data',
          'Advanced patient monitoring capabilities'
        ],
        marketChallenges: [
          'Intense competition from local and international brands',
          'Price pressure from generic alternatives',
          'Rapidly evolving regulatory landscape'
        ]
      };
    }
  }

  /**
   * Assesses the overall risk level for localization based on scores and requirements.
   * @private
   * @param {number} culturalScore
   * @param {MarketRequirement[]} requirements
   * @returns {'Low' | 'Medium' | 'High' | 'Critical'}
   */
  static assessRiskLevel(culturalScore, requirements) {
    const mustRequirements = requirements.filter(r => r.priority === 'must');
    const majorAdaptations = requirements.filter(r => r.adaptationLevel === 'major');
    
    if (culturalScore < 50 || majorAdaptations.length >= 3) return 'Critical';
    if (culturalScore < 70 || mustRequirements.length >= 4) return 'High';
    if (culturalScore < 85 || mustRequirements.length >= 2) return 'Medium';
    return 'Low';
  }

  /**
   * Generates a roadmap of necessary content adaptations.
   * @param {string} assetId
   * @param {string} marketCode
   * @param {MarketAnalysis} analysis
   * @returns {Promise<ContentAdaptationRoadmap>}
   */
  static async generateContentAdaptationRoadmap(
    assetId,
    marketCode,
    analysis
  ) {
    const { data: asset } = await supabase
      .from('content_assets')
      .select('*')
      .eq('id', assetId)
      .single();

    const content = asset.primary_content || {};
    
    /** @type {AdaptationItem[]} */
    const criticalChanges = [];
    /** @type {AdaptationItem[]} */
    const recommendedChanges = [];
    /** @type {AdaptationItem[]} */
    const optionalChanges = [];

    // Generate adaptation items based on requirements
    analysis.marketSpecificRequirements.forEach(req => {
      const adaptationItem = this.createAdaptationItem(content, req, marketCode);
      
      if (req.priority === 'must') {
        criticalChanges.push(adaptationItem);
      } else if (req.priority === 'should') {
        recommendedChanges.push(adaptationItem);
      } else {
        optionalChanges.push(adaptationItem);
      }
    });

    // Assess timeline impact
    const timelineImpact = this.assessTimelineImpact(criticalChanges, recommendedChanges);

    return {
      marketCode,
      criticalChanges,
      recommendedChanges,
      optionalChanges,
      timelineImpact
    };
  }

  /**
   * Creates a detailed adaptation item based on a requirement.
   * @private
   * @param {any} content
   * @param {MarketRequirement} requirement
   * @param {string} marketCode
   * @returns {AdaptationItem}
   */
  static createAdaptationItem(content, requirement, marketCode) {
    const suggestions = this.getAdaptationSuggestions(requirement, marketCode);
    
    return {
      element: requirement.category,
      currentValue: this.getCurrentValue(content, requirement.category),
      suggestedValue: suggestions.suggestion,
      rationale: requirement.culturalContext,
      effort: this.mapAdaptationToEffort(requirement.adaptationLevel),
      risk: requirement.priority === 'must' ? 'high' : 'medium'
    };
  }

  /**
   * Mocks fetching the current value of an asset element.
   * @private
   * @param {any} content
   * @param {string} category
   * @returns {string}
   */
  static getCurrentValue(content, category) {
    switch (category) {
      case 'messaging':
        return content.headline || 'Current headline';
      case 'tone':
        return 'Current tone style';
      case 'visual':
        return 'Current visual elements';
      case 'regulatory':
        return content.disclaimer || 'Current regulatory text';
      case 'cultural':
        return 'Current cultural approach';
      default:
        return 'Current content';
    }
  }

  /**
   * Provides mock adaptation suggestions based on market and category.
   * @private
   * @param {MarketRequirement} requirement
   * @param {string} marketCode
   * @returns {{ suggestion: string }}
   */
  static getAdaptationSuggestions(requirement, marketCode) {
    const suggestions = {
      JP: {
        messaging: 'Emphasize safety, reliability, and long-term partnership with healthcare providers',
        tone: 'Use formal, respectful language with appropriate honorifics',
        visual: 'Clean, minimalist design with careful color selection',
        regulatory: 'Include PMDA-compliant disclaimers and safety information',
        cultural: 'Incorporate harmony-based messaging and consensus-building language'
      },
      CN: {
        messaging: 'Highlight innovation, scientific advancement, and proven efficacy',
        tone: 'Confident, authoritative language backed by clinical evidence',
        visual: 'Modern, sophisticated design avoiding unlucky color associations',
        regulatory: 'Ensure NMPA compliance with proper labeling and claims',
        cultural: 'Balance modern medicine with respect for traditional practices'
      }
    };

    return { suggestion: suggestions[marketCode]?.[requirement.category] || 'Adapt according to local requirements' };
  }

  /**
   * Maps the adaptation level to an effort estimate.
   * @private
   * @param {string} level
   * @returns {'low' | 'medium' | 'high'}
   */
  static mapAdaptationToEffort(level) {
    switch (level) {
      case 'minor': return 'low';
      case 'moderate': return 'medium';
      case 'major': return 'high';
      default: return 'medium';
    }
  }

  /**
   * Assesses the potential timeline impact of the required changes.
   * @private
   * @param {AdaptationItem[]} critical
   * @param {AdaptationItem[]} recommended
   * @returns {'no_delay' | 'minor_delay' | 'major_delay'}
   */
  static assessTimelineImpact(critical, recommended) {
    const highEffortCritical = critical.filter(item => item.effort === 'high').length;
    const totalCritical = critical.length;
    
    if (highEffortCritical >= 3 || totalCritical >= 5) return 'major_delay';
    if (highEffortCritical >= 1 || totalCritical >= 3) return 'minor_delay';
    return 'no_delay';
  }
}