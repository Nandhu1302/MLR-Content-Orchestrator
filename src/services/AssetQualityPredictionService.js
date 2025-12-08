import { supabase } from '@/integrations/supabase/client';

// Placeholder for missing import, assuming it has a static searchTranslationMemory method
const SmartTMEngine = {
  searchTranslationMemory: async (content, sourceLang, targetLang, brandId, options) => {
    // Mock implementation for TM search
    if (targetLang === 'ja' && content.length > 50) {
      return { matches: [{ matchPercentage: 85 }] };
    }
    return { matches: [] };
  }
};


export class AssetQualityPredictionService {

  /**
   * Generate comprehensive quality prediction for asset localization
   */
  static async generateQualityPrediction(
    assetId,
    targetMarkets,
    brandId,
    localizationContext
  ) { // Removed return type Promise
    try {
      // Get asset data
      const { data: asset, error } = await supabase // Corrected variable name to 'asset'
        .from('content_assets')
        .select('*, content_projects(*)')
        .eq('id', assetId)
        .single();

      if (error) throw error;

      // Analyze prediction factors
      const predictionFactors = await this.analyzePredictionFactors(
        asset,
        targetMarkets,
        brandId,
        localizationContext
      );

      // Calculate overall quality score
      const overallQualityScore = this.calculateOverallQualityScore(predictionFactors);

      // Generate risk assessment
      const riskAssessment = await this.generateRiskAssessment(
        asset,
        predictionFactors,
        targetMarkets
      );

      // Generate review recommendations
      const reviewRecommendations = this.generateReviewRecommendations(
        predictionFactors,
        riskAssessment,
        asset.asset_type
      );

      // Predict bottlenecks
      const bottleneckPredictions = await this.predictBottlenecks(
        asset,
        targetMarkets,
        predictionFactors
      );

      // Generate market-specific predictions
      const marketSpecificPredictions = await this.generateMarketSpecificPredictions(
        asset,
        targetMarkets,
        predictionFactors
      );

      // Calculate confidence level
      const confidenceLevel = this.calculateConfidenceLevel(
        predictionFactors,
        asset,
        targetMarkets.length
      );

      return {
        assetId,
        overallQualityScore,
        confidenceLevel,
        predictionFactors,
        riskAssessment,
        reviewRecommendations,
        bottleneckPredictions,
        marketSpecificPredictions
      };
    } catch (error) {
      console.error('Error generating quality prediction:', error);
      throw error;
    }
  }

  /**
   * Analyze brand consistency and generate improvement recommendations
   */
  static async analyzeBrandConsistency(
    assetId,
    brandId,
    comparisonAssets // Removed type annotation
  ) { // Removed return type Promise
    try {
      // Get asset data
      const { data: asset, error } = await supabase // Corrected variable name to 'asset'
        .from('content_assets')
        .select('*')
        .eq('id', assetId)
        .single();

      if (error) throw error;

      // Get brand guidelines
      const { data: brand, error: brandError } = await supabase // Corrected variable name to 'brand'
        .from('brand_profiles')
        .select('*')
        .eq('id', brandId)
        .single();

      if (brandError) throw brandError;

      // Analyze brand alignment
      const brandAlignment = await this.analyzeBrandAlignment(asset, brand);

      // Find deviations
      const deviations = this.identifyBrandDeviations(asset, brand, brandAlignment);

      // Calculate overall and compliance scores
      const overallScore = this.calculateBrandConsistencyScore(brandAlignment);
      const complianceScore = this.calculateBrandComplianceScore(deviations);

      return {
        overallScore,
        brandAlignment,
        deviations,
        complianceScore
      };
    } catch (error) {
      console.error('Error analyzing brand consistency:', error);
      throw error;
    }
  }

  /**
   * Predict potential quality issues before localization begins
   */
  static async predictQualityIssues(
    assetContent,
    assetType,
    targetMarkets,
    therapeuticArea
  ) { // Removed return type Promise
    try {
      const predictedIssues = [];

      // Cultural issues prediction
      const culturalIssues = await this.predictCulturalIssues(
        assetContent,
        targetMarkets
      );
      predictedIssues.push(...culturalIssues);

      // Regulatory issues prediction
      const regulatoryIssues = await this.predictRegulatoryIssues(
        assetContent,
        targetMarkets,
        therapeuticArea
      );
      predictedIssues.push(...regulatoryIssues);

      // Linguistic complexity prediction
      const linguisticIssues = await this.predictLinguisticIssues(
        assetContent,
        assetType,
        targetMarkets
      );
      predictedIssues.push(...linguisticIssues);

      // Technical issues prediction
      const technicalIssues = this.predictTechnicalIssues(assetContent, assetType);
      predictedIssues.push(...technicalIssues);

      // Calculate overall risk score
      const overallRiskScore = this.calculateOverallRiskScore(predictedIssues);

      // Generate recommended actions
      const recommendedActions = this.generateQualityRecommendations(
        predictedIssues,
        overallRiskScore
      );

      return {
        predictedIssues,
        overallRiskScore,
        recommendedActions
      };
    } catch (error) {
      console.error('Error predicting quality issues:', error);
      throw error;
    }
  }

  /**
   * Generate risk-based reviewer assignment recommendations
   */
  static async generateReviewerAssignments(
    qualityPrediction,
    availableReviewers // Removed type annotation
  ) { // Removed return type Promise
    // Mock reviewer assignment logic - in production, this would match reviewers based on:
    // - Expertise in therapeutic area
    // - Language pairs
    // - Regulatory knowledge
    // - Availability and workload
    // - Previous performance on similar assets
    
    // Safety check for availableReviewers and assume reviewers have 'expertiseLevel' property
    const reviewers = availableReviewers || [];
    const expertReviewers = reviewers.filter(r => r.expertiseLevel === 'expert');

    const assignments = {
      primaryReviewer: reviewers[0] || null,
      secondaryReviewers: reviewers.slice(1, 3),
      expertReviewers: expertReviewers,
      reviewSequence: [
        {
          stage: 'initial_review',
          reviewer: reviewers[0],
          estimatedTime: qualityPrediction.reviewRecommendations?.estimatedReviewTime, // Corrected property access
          priority: qualityPrediction.reviewRecommendations?.reviewPriority // Corrected property access
        }
      ]
    };

    return assignments;
  }

  // Private helper methods
  static async analyzePredictionFactors(
    asset,
    targetMarkets,
    brandId,
    localizationContext
  ) { // Removed return type Promise
    // Analyze content complexity
    const contentComplexity = this.analyzeContentComplexity(asset);
    
    // Analyze cultural sensitivity requirements
    const culturalSensitivity = await this.analyzeCulturalSensitivity(
      asset,
      targetMarkets
    );
    
    // Analyze regulatory complexity
    const regulatoryComplexity = await this.analyzeRegulatoryComplexity(
      asset,
      targetMarkets,
      asset.content_projects?.therapeutic_area // Use optional chaining for safety
    );
    
    // Analyze translation complexity
    const translationComplexity = await this.analyzeTranslationComplexity(
      asset,
      targetMarkets
    );
    
    // Analyze brand consistency requirements
    const brandConsistency = await this.analyzeBrandConsistencyRequirements(
      asset,
      brandId
    );
    
    // Analyze market readiness
    const marketReadiness = {}; // Removed type annotation
    for (const market of targetMarkets) {
      marketReadiness[market] = await this.analyzeMarketReadiness(asset, market);
    }

    return {
      contentComplexity,
      culturalSensitivity,
      regulatoryComplexity,
      translationComplexity,
      brandConsistency,
      marketReadiness
    };
  }

  static analyzeContentComplexity(asset) { // Removed return type number
    const content = asset.primary_content || {};
    let complexity = 50; // Base complexity

    // Text length complexity
    const textLength = (content.headline || '').length + (content.body || '').length;
    if (textLength > 1000) complexity += 20;
    else if (textLength > 500) complexity += 10;

    // Technical terms complexity
    const text = `${content.headline || ''} ${content.body || ''}`;
    const technicalTerms = this.countTechnicalTerms(text);
    complexity += Math.min(technicalTerms * 3, 30);

    // Asset type complexity
    const assetTypeComplexity = {
      'email': 60,
      'brochure': 80,
      'presentation': 85,
      'legal_document': 95,
      'social_post': 40
    };
    complexity = (complexity + (assetTypeComplexity[asset.asset_type] || 60)) / 2;

    return Math.min(100, complexity);
  }

  static async analyzeCulturalSensitivity(
    asset,
    targetMarkets
  ) { // Removed return type Promise
    let sensitivity = 30; // Base sensitivity

    // Market-specific sensitivity increases
    const highSensitivityMarkets = ['China', 'Japan', 'Middle East'];
    const mediumSensitivityMarkets = ['Germany', 'France', 'Brazil'];
    
    for (const market of targetMarkets) {
      if (highSensitivityMarkets.includes(market)) sensitivity += 25;
      else if (mediumSensitivityMarkets.includes(market)) sensitivity += 15;
      else sensitivity += 10;
    }

    // Healthcare content sensitivity
    if (asset.content_projects?.therapeutic_area) { // Use optional chaining for safety
      sensitivity += 20;
    }

    return Math.min(100, sensitivity);
  }

  static async analyzeRegulatoryComplexity(
    asset,
    targetMarkets,
    therapeuticArea // Removed type annotation
  ) { // Removed return type Promise
    let complexity = 40; // Base complexity

    // Therapeutic area complexity
    const therapeuticComplexity = {
      'oncology': 90,
      'cardiovascular': 85,
      'neurology': 80,
      'dermatology': 60,
      'general': 50
    };
    
    if (therapeuticArea) {
      complexity += (therapeuticComplexity[therapeuticArea] || 60) * 0.4;
    }

    // Market regulatory complexity
    const marketComplexity = {
      'US': 85,
      'EU': 80,
      'Japan': 75,
      'China': 70,
      'Canada': 70
    };

    const avgMarketComplexity = targetMarkets.reduce((sum, market) => 
      sum + (marketComplexity[market] || 60), 0) / targetMarkets.length;
    
    complexity = (complexity + avgMarketComplexity) / 2;

    return Math.min(100, complexity);
  }

  static async analyzeTranslationComplexity(
    asset,
    targetMarkets
  ) { // Removed return type Promise
    let complexity = 50; // Base complexity

    // Language complexity factors
    const languageComplexity = {
      'zh': 90, // Chinese
      'ja': 85, // Japanese
      'ar': 80, // Arabic
      'ko': 75, // Korean
      'de': 65, // German
      'fr': 60, // French
      'es': 55, // Spanish
      'it': 55  // Italian
    };

    // Calculate average language complexity
    const avgLangComplexity = targetMarkets.reduce((sum, market) => {
      const langCode = this.getLanguageCodeForMarket(market);
      return sum + (languageComplexity[langCode] || 60);
    }, 0) / targetMarkets.length;

    complexity = (complexity + avgLangComplexity) / 2;

    // Check translation memory leverage
    for (const market of targetMarkets) {
      const langCode = this.getLanguageCodeForMarket(market);
      try {
        const tmResult = await SmartTMEngine.searchTranslationMemory(
          asset.primary_content?.body || '', // Use optional chaining for safety
          'en',
          langCode,
          asset.brand_id,
          { minMatchPercentage: 80 } // Added a placeholder value for minMatchPercentage
        );
        
        if (tmResult.matches.length > 0) {
          const avgMatch = tmResult.matches.reduce((sum, match) => 
            sum + match.matchPercentage, 0) / tmResult.matches.length;
          complexity -= (avgMatch / 100) * 20; // Reduce complexity based on TM leverage
        }
      } catch (error) {
        console.error('TM lookup error:', error);
      }
    }

    return Math.max(20, Math.min(100, complexity));
  }

  static async analyzeBrandConsistencyRequirements(
    asset,
    brandId
  ) { // Removed return type Promise
    // Analyze how well the asset aligns with brand guidelines
    // This would check against brand voice, messaging framework, visual identity, etc.
    
    let consistency = 70; // Base consistency score

    // Mock brand alignment analysis
    const content = asset.primary_content || {};
    
    // Check for brand-specific terminology
    if (content.headline && content.headline.includes(brandId)) { // Used brandId as a proxy for brand terminology
      consistency += 10;
    }

    // Check therapeutic area alignment
    if (asset.content_projects?.therapeutic_area) { // Use optional chaining for safety
      consistency += 15;
    }

    return Math.min(100, consistency);
  }

  static async analyzeMarketReadiness(asset, market) { // Removed return type Promise
    let readiness = 60; // Base readiness

    // Market-specific readiness factors
    const marketFactors = {
      'US': 85,
      'EU': 80,
      'Japan': 70,
      'China': 65,
      'Germany': 85,
      'France': 75
    };

    readiness = marketFactors[market] || 60;

    // Adjust for asset type and market combination
    if (asset.asset_type === 'legal_document' && ['China', 'Japan'].includes(market)) {
      readiness -= 20;
    }

    return Math.max(20, Math.min(100, readiness));
  }

  static calculateOverallQualityScore(factors) { // Removed return type number
    // Weighted average of all factors
    const weights = {
      contentComplexity: 0.2, // Corrected assignment
      culturalSensitivity: 0.25, // Corrected assignment
      regulatoryComplexity: 0.25, // Corrected assignment
      translationComplexity: 0.15, // Corrected assignment
      brandConsistency: 0.15 // Corrected assignment
    };

    // Calculate base score (inverse of complexity factors)
    let score = 100;
    score -= factors.contentComplexity * weights.contentComplexity;
    score -= factors.culturalSensitivity * weights.culturalSensitivity;
    score -= factors.regulatoryComplexity * weights.regulatoryComplexity;
    score -= factors.translationComplexity * weights.translationComplexity;
    
    // Brand consistency is positive (higher is better)
    score += factors.brandConsistency * weights.brandConsistency - 50;

    // Adjust for market readiness
    const marketReadinessScores = Object.values(factors.marketReadiness);
    if (marketReadinessScores.length > 0) {
      const avgMarketReadiness = marketReadinessScores.reduce((sum, score) => sum + score, 0) / marketReadinessScores.length;
      score = (score + avgMarketReadiness) / 2;
    }

    return Math.max(20, Math.min(100, Math.round(score)));
  }

  static async generateRiskAssessment(
    asset,
    factors,
    targetMarkets
  ) { // Removed return type Promise
    const riskFactors = [];
    const mitigationStrategies = [];

    // High complexity risks
    if (factors.contentComplexity > 80) {
      riskFactors.push('Complex content may require extended review time');
      mitigationStrategies.push('Allocate additional review resources');
    }

    if (factors.regulatoryComplexity > 85) {
      riskFactors.push('High regulatory complexity may cause delays');
      mitigationStrategies.push('Engage regulatory experts early in process');
    }

    if (factors.culturalSensitivity > 80) {
      riskFactors.push('Cultural sensitivity requirements may need extensive adaptation');
      mitigationStrategies.push('Conduct cultural consultation before localization');
    }

    // Market-specific risks
    const lowReadinessMarkets = Object.entries(factors.marketReadiness)
      .filter(([, score]) => score < 60) // Corrected access to score
      .map(([market]) => market);

    if (lowReadinessMarkets.length > 0) {
      riskFactors.push(`Markets not ready for localization: ${lowReadinessMarkets.join(', ')}`);
      mitigationStrategies.push('Address market readiness issues before proceeding');
    }

    // Determine overall risk level
    const avgComplexity = (factors.contentComplexity + factors.culturalSensitivity + factors.regulatoryComplexity) / 3;
    let riskLevel; // Removed type annotation
    
    if (avgComplexity > 85) riskLevel = 'critical';
    else if (avgComplexity > 70) riskLevel = 'high';
    else if (avgComplexity > 55) riskLevel = 'medium';
    else riskLevel = 'low';

    return {
      riskLevel,
      riskFactors,
      mitigationStrategies
    };
  }

  static generateReviewRecommendations(
    factors,
    riskAssessment,
    assetType
  ) { // Removed return type any
    let reviewType = 'standard'; // Removed type annotation
    let estimatedReviewTime = 8; // Base 8 hours
    let reviewPriority = 'medium'; // Removed type annotation
    const requiredExpertise = [];

    // Determine review type based on complexity
    const avgComplexity = (factors.contentComplexity + factors.regulatoryComplexity) / 2;
    
    if (avgComplexity > 85) {
      reviewType = 'regulatory';
      estimatedReviewTime += 12;
      reviewPriority = 'urgent';
      requiredExpertise.push('regulatory_specialist', 'therapeutic_expert');
    } else if (avgComplexity > 70) {
      reviewType = 'expert';
      estimatedReviewTime += 8;
      reviewPriority = 'high';
      requiredExpertise.push('senior_reviewer', 'cultural_specialist');
    } else if (avgComplexity > 55) {
      reviewType = 'enhanced';
      estimatedReviewTime += 4;
      requiredExpertise.push('experienced_reviewer');
    }

    // Adjust for cultural sensitivity
    if (factors.culturalSensitivity > 80) {
      requiredExpertise.push('cultural_adaptation_specialist');
      estimatedReviewTime += 4;
    }

    // Adjust for asset type
    const assetTypeAdjustments = {
      'legal_document': { time: 8, expertise: ['legal_reviewer'] }, // Added placeholder 'time' value
      'presentation': { time: 2, expertise: ['design_reviewer'] }, // Added placeholder 'time' value
      'brochure': { time: 4, expertise: ['marketing_reviewer'] } // Added placeholder 'time' value
    };

    if (assetTypeAdjustments[assetType]) {
      estimatedReviewTime += assetTypeAdjustments[assetType].time;
      requiredExpertise.push(...assetTypeAdjustments[assetType].expertise);
    }

    return {
      reviewType,
      estimatedReviewTime,
      reviewPriority,
      requiredExpertise: [...new Set(requiredExpertise)] // Remove duplicates
    };
  }

  static async predictBottlenecks(
    asset,
    targetMarkets,
    factors
  ) { // Removed return type Promise
    const bottlenecks = [];

    // Translation bottleneck
    if (factors.translationComplexity > 75) {
      bottlenecks.push({
        stage: 'translation',
        probability: 0.7, // Corrected assignment
        impact: 'high',
        preventionStrategy: 'Pre-allocate specialized translators'
      });
    }

    // Regulatory review bottleneck
    if (factors.regulatoryComplexity > 80) {
      bottlenecks.push({
        stage: 'regulatory_review',
        probability: 0.8, // Corrected assignment
        impact: 'high',
        preventionStrategy: 'Engage regulatory experts in parallel with translation'
      });
    }

    // Cultural adaptation bottleneck
    if (factors.culturalSensitivity > 75) {
      bottlenecks.push({
        stage: 'cultural_adaptation',
        probability: 0.6, // Corrected assignment
        impact: 'medium',
        preventionStrategy: 'Conduct cultural pre-analysis'
      });
    }

    return bottlenecks;
  }

  static async generateMarketSpecificPredictions(
    asset,
    targetMarkets,
    factors
  ) { // Removed return type Promise
    const predictions = {}; // Removed type annotation

    for (const market of targetMarkets) {
      const marketReadiness = factors.marketReadiness[market] || 60;
      
      predictions[market] = {
        qualityScore: Math.round((factors.brandConsistency + marketReadiness) / 2), // Corrected assignment and rounding
        timeEstimate: this.estimateMarketTime(market, factors),
        riskFactors: this.getMarketRiskFactors(market, factors),
        recommendations: this.getMarketRecommendations(market, factors)
      };
    }

    return predictions;
  }

  static calculateConfidenceLevel(
    factors,
    asset,
    marketCount // Removed return type number
  ) {
    let confidence = 70; // Base confidence

    // More data points increase confidence
    if (asset.primary_content?.body && asset.primary_content.body.length > 100) { // Used optional chaining
      confidence += 10;
    }

    // Fewer markets = higher confidence
    if (marketCount <= 2) confidence += 15;
    else if (marketCount <= 4) confidence += 10;
    else confidence -= 10;

    // Brand consistency affects confidence
    if (factors.brandConsistency > 80) confidence += 10;
    else if (factors.brandConsistency < 50) confidence -= 15;

    return Math.max(40, Math.min(95, confidence));
  }

  // Additional helper methods
  static countTechnicalTerms(text) { // Removed return type number
    const technicalPatterns = [
      /\b[A-Z][a-z]+(:ine|oid|ase|ide|ate)\b/g, // Drug suffixes
      /\b\d+\s*(mg|mcg|ml|%)\b/g, // Dosages - corrected regex to remove colon
      /\b(efficacy|bioavailability|pharmacokinetics|contraindications)\b/gi // Corrected regex to remove colon
    ];

    let count = 0;
    technicalPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) count += matches.length;
    });

    return count;
  }

  static getLanguageCodeForMarket(market) { // Removed return type string
    const marketToLanguage = {
      'China': 'zh',
      'Japan': 'ja',
      'Germany': 'de',
      'France': 'fr',
      'Spain': 'es',
      'Italy': 'it',
      'Korea': 'ko'
    };
    return marketToLanguage[market] || 'en';
  }

  static estimateMarketTime(market, factors) { // Removed return type number
    const baseTime = 15; // Base days
    const marketMultipliers = {
      'China': 1.8,
      'Japan': 1.6,
      'Germany': 1.2,
      'US': 1.0,
      'France': 1.3
    };

    const multiplier = marketMultipliers[market] || 1.2;
    const complexityAdjustment = (factors.regulatoryComplexity + factors.culturalSensitivity) / 200;
    
    return Math.round(baseTime * multiplier * (1 + complexityAdjustment));
  }

  static getMarketRiskFactors(market, factors) { // Removed return type string[]
    const riskFactors = [];

    if (factors.culturalSensitivity > 70) {
      riskFactors.push('High cultural sensitivity requirements');
    }

    if (factors.regulatoryComplexity > 75) {
      riskFactors.push('Complex regulatory environment');
    }

    const marketSpecificRisks = {
      'China': ['Government approval requirements', 'Traditional medicine considerations'],
      'Japan': ['Indirect communication preferences', 'Group consensus requirements'],
      'Germany': ['Technical precision requirements', 'Privacy regulations']
    };

    if (marketSpecificRisks[market]) {
      riskFactors.push(...marketSpecificRisks[market]);
    }

    return riskFactors;
  }

  static getMarketRecommendations(market, factors) { // Removed return type string[]
    const recommendations = [];

    if (factors.culturalSensitivity > 75) {
      recommendations.push('Engage local cultural consultants');
    }

    if (factors.regulatoryComplexity > 80) {
      recommendations.push('Schedule early regulatory review');
    }

    const marketSpecificRecommendations = {
      'China': ['Consider family-focused messaging', 'Include prosperity symbols'],
      'Japan': ['Use respectful, indirect language', 'Focus on group benefits'],
      'Germany': ['Provide detailed technical data', 'Use direct communication']
    };

    if (marketSpecificRecommendations[market]) {
      recommendations.push(...marketSpecificRecommendations[market]);
    }

    return recommendations;
  }

  static async analyzeBrandAlignment(asset, brand) { // Removed return type Promise
    // Mock brand alignment analysis
    return {
      messagingConsistency: 85, // Added mock values
      visualConsistency: 70, // Added mock values
      toneConsistency: 90, // Added mock values
      therapeuticAlignment: 95 // Added mock values
    };
  }

  static identifyBrandDeviations(asset, brand, alignment) { // Removed return type any[]
    const deviations = [];

    if (alignment.visualConsistency < 70) {
      deviations.push({
        element: 'Visual Identity',
        severity: 'moderate',
        description: 'Color scheme deviates from brand guidelines',
        recommendation: 'Update colors to match brand primary palette'
      });
    }

    return deviations;
  }

  static calculateBrandConsistencyScore(alignment) { // Removed return type number
    const scores = Object.values(alignment);
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  }

  static calculateBrandComplianceScore(deviations) { // Removed return type number
    let score = 100;
    deviations.forEach(deviation => {
      switch (deviation.severity) {
        case 'major': score -= 20; break;
        case 'moderate': score -= 10; break;
        case 'minor': score -= 5; break;
      }
    });
    return Math.max(0, score);
  }

  static async predictCulturalIssues(content, markets) { // Removed return type Promise
    // Mock cultural issues prediction
    return [];
  }

  static async predictRegulatoryIssues(content, markets, therapeuticArea) { // Removed return type Promise
    // Mock regulatory issues prediction
    return [];
  }

  static async predictLinguisticIssues(content, assetType, markets) { // Removed return type Promise
    // Mock linguistic issues prediction
    return [];
  }

  static predictTechnicalIssues(content, assetType) { // Removed return type any[]
    // Mock technical issues prediction
    return [];
  }

  static calculateOverallRiskScore(issues) { // Removed return type number
    if (issues.length === 0) return 10;
    
    const riskSum = issues.reduce((sum, issue) => {
      // Corrected ternary operator syntax
      const impactScore = issue.impact === 'high' ? 30 : (issue.impact === 'medium' ? 20 : 10);
      return sum + (issue.probability * impactScore);
    }, 0);
    
    return Math.min(100, Math.round(riskSum));
  }

  static generateQualityRecommendations(issues, riskScore) { // Removed return type string[]
    const recommendations = [];
    
    if (riskScore > 70) {
      recommendations.push('Schedule comprehensive pre-localization review');
    }
    
    if (issues.length > 5) {
      recommendations.push('Consider phased localization approach');
    }
    
    return recommendations;
  }
}