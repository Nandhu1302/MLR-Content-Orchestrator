/**
 * Converted from TypeScript to JavaScript
 * Functions intended as 'private static' are converted to use the modern JavaScript 
 * private method syntax (prefixed with #) and the 'static' keyword.
 * * Note: Logic errors and syntax issues found in the previous file upload 
 * have also been fixed here for a fully working class structure.
 */
import { supabase } from '@/integrations/supabase/client';
import { BrandConsistencyService } from './brandConsistencyService';
import { SUPPORTED_MARKETS, isMarketSupported } from '@/config/localizationConfig';


export class marketIntelligenceService {
  
  static async analyzeAssetForMarkets(
    assetId,
    brandId,
    targetMarkets = ['JP', 'CN'],
    context
  ) {
    const analyses = [];

    for (const marketCode of targetMarkets) {
      if (!isMarketSupported(marketCode)) continue;

      const analysis = await this.#analyzeAssetForMarket(assetId, brandId, marketCode);
      analyses.push(analysis);
    }

    return analyses;
  }

  // Changed to static private method (#)
  static async #analyzeAssetForMarket(
    assetId,
    brandId,
    marketCode
  ) {
    // Get asset data
    const { data: assetData } = await supabase
      .from('content_assets')
      .select('*')
      .eq('id', assetId)
      .single();

    // Get global brand baseline
    const brandConsistency = await BrandConsistencyService.validateBrandConsistency(assetId, brandId);
    const globalBrandBaseline = brandConsistency.overallScore;

    // Generate market-specific requirements
    const marketRequirements = this.#generateMarketRequirements(assetData, marketCode);
    
    // Calculate cultural adaptation score
    const culturalAdaptationScore = this.#calculateCulturalAdaptationScore(assetData, marketCode);
    
    // Generate competitive positioning analysis
    const competitivePositioning = this.#generateCompetitiveAnalysis(assetData, marketCode);
    
    // Assess risk level
    const riskLevel = this.#assessRiskLevel(culturalAdaptationScore, marketRequirements);
    
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

  // Changed to static private method (#)
  static #generateMarketRequirements(asset, marketCode) {
    const content = asset.primary_content || {};
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

  // Changed to static private method (#)
  static #calculateCulturalAdaptationScore(asset, marketCode) {
    const content = asset.primary_content || {};
    let score = 70; // Base score

    // Analyze content complexity
    const text = `${content.headline || ''} ${content.body || ''}`.toLowerCase();
    
    // Market-specific scoring factors
    if (marketCode === 'JP') {
      // Check for concepts that need adaptation
      if (text.includes('individual')) score -= 10;
      if (text.includes('fast') || text.includes('quick')) score -= 5;
      if (text.includes('aggressive')) score -= 15;
      if (content.brandElements?.colors?.includes('#ff0000')) score -= 10;
      
      // Positive factors
      if (text.includes('proven') || text.includes('established')) score += 10;
      if (text.includes('trust') || text.includes('reliable')) score += 15;
    } else if (marketCode === 'CN') {
      // Check for concepts that need adaptation
      if (text.includes('traditional') && !text.includes('modern')) score -= 10;
      if (content.brandElements?.colors?.includes('#ffffff')) score -= 5;
      if (text.includes('old') || text.includes('elderly')) score -= 10;
      
      // Positive factors
      if (text.includes('innovation') || text.includes('advanced')) score += 15;
      if (text.includes('scientific') || text.includes('research')) score += 10;
      if (text.includes('modern') || text.includes('cutting-edge')) score += 10;
    }

    return Math.max(0, Math.min(100, score));
  }

  // Changed to static private method (#)
  static #generateCompetitiveAnalysis(asset, marketCode) {
    const content = asset.primary_content || {};
    
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

  // Changed to static private method (#)
  static #assessRiskLevel(culturalScore, requirements) {
    // Note: Reversing logic to make sense for a score out of 100 
    // (lower cultural score = higher risk).
    if (culturalScore <= 30) return 'Critical';
    if (culturalScore <= 50) return 'High';
    if (culturalScore <= 70) return 'Medium';
    return 'Low';
  }

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
    
    const criticalChanges = [];
    const recommendedChanges = [];
    const optionalChanges = [];

    // Generate adaptation items based on requirements
    analysis.marketSpecificRequirements.forEach(req => {
      const adaptationItem = this.#createAdaptationItem(content, req, marketCode);
      
      if (req.priority === 'must') {
        criticalChanges.push(adaptationItem);
      } else if (req.priority === 'should') {
        recommendedChanges.push(adaptationItem);
      } else {
        optionalChanges.push(adaptationItem);
      }
    });

    // Assess timeline impact
    const timelineImpact = this.#assessTimelineImpact(criticalChanges, recommendedChanges);

    return {
      marketCode,
      criticalChanges,
      recommendedChanges,
      optionalChanges,
      timelineImpact
    };
  }

  // Changed to static private method (#)
  static #createAdaptationItem(content, requirement, marketCode) {
    const suggestions = this.#getAdaptationSuggestions(requirement, marketCode);
    
    return {
      element: requirement.category,
      currentValue: this.#getCurrentValue(content, requirement.category),
      suggestedValue: suggestions.suggestion,
      rationale: requirement.culturalContext,
      effort: this.#mapAdaptationToEffort(requirement.adaptationLevel),
      risk: requirement.priority === 'must' ? 'high' : 'medium'
    };
  }

  // Changed to static private method (#)
  static #getCurrentValue(content, category) {
    switch (category) {
      case 'messaging': return content.headline || 'Current headline';
      case 'tone': return 'Current tone style';
      case 'visual': return 'Current visual elements';
      case 'regulatory': return content.disclaimer || 'Current regulatory text';
      case 'cultural': return 'Current cultural approach';
      default: return 'Current content';
    }
  }

  // Changed to static private method (#)
  static #getAdaptationSuggestions(requirement, marketCode) {
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

  // Changed to static private method (#)
  static #mapAdaptationToEffort(level) {
    switch (level) {
      case 'minor': return 'low';
      case 'moderate': return 'medium';
      case 'major': return 'high';
      default: return 'medium';
    }
  }

  // Changed to static private method (#)
  static #assessTimelineImpact(critical, recommended) {
    const highEffortCritical = critical.filter(item => item.effort === 'high').length;
    const totalCritical = critical.length;
    
    if (highEffortCritical >= 3 || totalCritical >= 5) return 'major_delay';
    if (highEffortCritical >= 1 || totalCritical >= 3) return 'minor_delay';
    return 'no_delay';
  }
}