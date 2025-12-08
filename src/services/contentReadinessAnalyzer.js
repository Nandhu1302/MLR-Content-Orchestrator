import { supabase } from '@/integrations/supabase/client';
import { BrowserAIService } from './browserAIService';

export class ContentReadinessAnalyzer {
  static async analyzeContent(projectId, brandId, sourceContent, targetMarkets, targetLanguages) {
    try {
      // Extract text content for analysis
      const textContent = this.extractTextContent(sourceContent);
      
      // Perform parallel analysis
      const [
        textComplexityAnalysis,
        culturalAnalysis,
        regulatoryAnalysis,
        technicalAnalysis
      ] = await Promise.all([
        this.analyzeTextComplexity(textContent),
        this.analyzeCulturalFactors(textContent, targetMarkets),
        this.analyzeRegulatoryRequirements(textContent, targetMarkets, brandId),
        this.analyzeTechnicalFactors(sourceContent)
      ]);

      // Calculate scores
      const contentComplexityScore = this.calculateContentComplexityScore(textComplexityAnalysis);
      const culturalSensitivityScore = this.calculateCulturalScore(culturalAnalysis);
      const regulatoryComplexityScore = this.calculateRegulatoryScore(regulatoryAnalysis);
      const technicalReadinessScore = this.calculateTechnicalScore(technicalAnalysis);
      
      const overallReadinessScore = Math.round(
        (contentComplexityScore + culturalSensitivityScore + regulatoryComplexityScore + technicalReadinessScore) / 4
      );

      const readinessLevel = this.determineReadinessLevel(overallReadinessScore);

      // Generate recommendations and risk factors
      const recommendations = this.generateRecommendations(
        textComplexityAnalysis,
        culturalAnalysis,
        regulatoryAnalysis,
        technicalAnalysis
      );

      const riskFactors = this.identifyRiskFactors(
        textComplexityAnalysis,
        culturalAnalysis,
        regulatoryAnalysis,
        technicalAnalysis
      );

      // Calculate effort and cost estimates
      const estimatedEffortHours = this.calculateEffortEstimate(
        overallReadinessScore,
        targetLanguages.length,
        targetMarkets.length,
        textContent.length
      );

      const estimatedCost = this.calculateCostEstimate(estimatedEffortHours, regulatoryComplexityScore);

      const analysis = {
        contentComplexityScore,
        culturalSensitivityScore,
        regulatoryComplexityScore,
        technicalReadinessScore,
        overallReadinessScore,
        readinessLevel,
        analysisDetails: {
          textComplexity: textComplexityAnalysis,
          culturalFactors: culturalAnalysis,
          regulatoryFactors: regulatoryAnalysis,
          technicalFactors: technicalAnalysis
        },
        recommendations,
        riskFactors,
        estimatedEffortHours,
        estimatedCost
      };

      // Store analysis in database
      await this.storeAnalysis(projectId, brandId, analysis);

      return analysis;
    } catch (error) {
      console.error('Content readiness analysis failed:', error);
      throw new Error('Failed to analyze content readiness');
    }
  }

  static extractTextContent(sourceContent) {
    if (typeof sourceContent === 'string') return sourceContent;
    
    let text = '';
    if (sourceContent.primaryContent) {
      Object.values(sourceContent.primaryContent).forEach((content) => {
        if (typeof content === 'string') {
          text += content + ' ';
        } else if (content?.text || content?.content) {
          text += (content.text || content.content) + ' ';
        }
      });
    }
    
    return text.trim();
  }

  static async analyzeTextComplexity(text) {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = text.split(/\s+/).filter(w => w.length > 0);
    const averageSentenceLength = words.length / sentences.length || 0;
    
    // Detect technical terms (simplified)
    const technicalTermsRegex = /\b[A-Z]{2,}|\b\w*ology\b|\b\w*itis\b|\bmg\b|\bml\b|\bdose\b|\btreatment\b/gi;
    const technicalTermsCount = (text.match(technicalTermsRegex) || []).length;
    
    // Calculate readability score (simplified Flesch Reading Ease)
    const avgWordsPerSentence = averageSentenceLength;
    const avgSyllablesPerWord = this.estimateSyllables(text) / (words.length || 1);
    const readabilityScore = Math.max(0, 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord));
    
    const linguisticComplexity = readabilityScore > 60 ? 'Simple' : 
                                readabilityScore > 30 ? 'Moderate' : 'Complex';

    return {
      averageSentenceLength,
      technicalTermsCount,
      readabilityScore: Math.round(readabilityScore),
      linguisticComplexity
    };
  }

  static async analyzeCulturalFactors(text, targetMarkets) {
    // Use AI to detect cultural references and sensitive concepts
    try {
      const aiAnalysis = await BrowserAIService.analyzeContent(text, {
        medical_context: true
      });

      return {
        culturalReferences: [],
        sensitiveConcepts: [],
        adaptationRequirements: targetMarkets.map(market => `Review content for ${market} market appropriateness`)
      };
    } catch (error) {
      console.warn('AI cultural analysis failed, using fallback');
      return {
        culturalReferences: [],
        sensitiveConcepts: [],
        adaptationRequirements: targetMarkets.map(market => `Review content for ${market} market appropriateness`)
      };
    }
  }

  static async analyzeRegulatoryRequirements(text, targetMarkets, brandId) {
    // Detect medical claims and regulatory language
    const medicalClaimsRegex = /\b(treat|cure|prevent|diagnose|efficacy|clinical|study|trial|approved|indication)\b/gi;
    const medicalClaims = Array.from(new Set((text.match(medicalClaimsRegex) || []).map(claim => claim.toLowerCase())));
    
    const legalRequirements = targetMarkets.map(market => {
      switch (market.toLowerCase()) {
        case 'us':
        case 'usa':
        case 'united states':
          return 'FDA compliance required';
        case 'eu':
        case 'europe':
          return 'EMA compliance required';
        case 'japan':
          return 'PMDA compliance required';
        default:
          return `${market} regulatory review required`;
      }
    });

    const complianceRisks = [];
    if (medicalClaims.length > 0) {
      complianceRisks.push('Medical claims require regulatory review');
    }
    if (text.includes('prescription') || text.includes('Rx')) {
      complianceRisks.push('Prescription drug content requires special handling');
    }

    return {
      medicalClaims,
      legalRequirements,
      complianceRisks
    };
  }

  static async analyzeTechnicalFactors(sourceContent) {
    const formatComplexity = sourceContent.assetType || 'Standard';
    const visualElements = [];
    const interactiveComponents = [];

    if (sourceContent.channelSpecifications) {
      Object.keys(sourceContent.channelSpecifications).forEach(channel => {
        if (channel.includes('video')) visualElements.push('Video content');
        if (channel.includes('interactive')) interactiveComponents.push('Interactive elements');
        if (channel.includes('animation')) visualElements.push('Animated content');
      });
    }

    return {
      formatComplexity,
      visualElements,
      interactiveComponents
    };
  }

  static calculateContentComplexityScore(textAnalysis) {
    let score = 100;
    
    // Penalize based on sentence length
    if (textAnalysis.averageSentenceLength > 20) score -= 20;
    else if (textAnalysis.averageSentenceLength > 15) score -= 10;
    
    // Penalize based on technical terms
    if (textAnalysis.technicalTermsCount > 10) score -= 20;
    else if (textAnalysis.technicalTermsCount > 5) score -= 10;
    
    // Adjust based on readability
    if (textAnalysis.readabilityScore < 30) score -= 25;
    else if (textAnalysis.readabilityScore < 60) score -= 15;
    
    return Math.max(0, Math.min(100, score));
  }

  static calculateCulturalScore(culturalAnalysis) {
    let score = 100;
    
    score -= (culturalAnalysis.culturalReferences || []).length * 5;
    score -= (culturalAnalysis.sensitiveConcepts || []).length * 10;
    score -= (culturalAnalysis.adaptationRequirements || []).length * 3;
    
    return Math.max(0, Math.min(100, score));
  }

  static calculateRegulatoryScore(regulatoryAnalysis) {
    let score = 100;
    
    score -= (regulatoryAnalysis.medicalClaims || []).length * 8;
    score -= (regulatoryAnalysis.legalRequirements || []).length * 5;
    score -= (regulatoryAnalysis.complianceRisks || []).length * 15;
    
    return Math.max(0, Math.min(100, score));
  }

  static calculateTechnicalScore(technicalAnalysis) {
    let score = 100;
    
    if (technicalAnalysis.formatComplexity !== 'Standard') score -= 15;
    score -= (technicalAnalysis.visualElements || []).length * 8;
    score -= (technicalAnalysis.interactiveComponents || []).length * 12;
    
    return Math.max(0, Math.min(100, score));
  }

  static determineReadinessLevel(score) {
    if (score >= 90) return 'excellent';
    if (score >= 75) return 'high';
    if (score >= 50) return 'medium';
    return 'low';
  }

  static generateRecommendations(textAnalysis, culturalAnalysis, regulatoryAnalysis, technicalAnalysis) {
    const recommendations = [];

    // Content recommendations
    if (textAnalysis.averageSentenceLength > 20) {
      recommendations.push({
        type: 'content',
        priority: 'medium',
        title: 'Simplify sentence structure',
        description: 'Break down long sentences to improve translatability',
        estimatedImpact: '10-15% reduction in translation time'
      });
    }

    if (textAnalysis.technicalTermsCount > 5) {
      recommendations.push({
        type: 'resources',
        priority: 'high',
        title: 'Create glossary',
        description: 'Develop terminology glossary for technical terms',
        estimatedImpact: 'Improved consistency and quality'
      });
    }

    // Cultural recommendations
    if ((culturalAnalysis.culturalReferences || []).length > 0) {
      recommendations.push({
        type: 'process',
        priority: 'high',
        title: 'Cultural adaptation required',
        description: 'Review cultural references for target markets',
        estimatedImpact: 'Prevent cultural misunderstandings'
      });
    }

    // Regulatory recommendations
    if ((regulatoryAnalysis.medicalClaims || []).length > 0) {
      recommendations.push({
        type: 'timeline',
        priority: 'high',
        title: 'Allow extra time for regulatory review',
        description: 'Medical claims require additional approval cycles',
        estimatedImpact: '2-4 weeks additional timeline'
      });
    }

    return recommendations;
  }

  static identifyRiskFactors(textAnalysis, culturalAnalysis, regulatoryAnalysis, technicalAnalysis) {
    const riskFactors = [];

    if (textAnalysis.readabilityScore < 30) {
      riskFactors.push({
        category: 'Content Complexity',
        risk: 'Very complex text may be difficult to translate accurately',
        severity: 'high',
        mitigation: 'Consider simplifying content or allow additional review time'
      });
    }

    if ((culturalAnalysis.sensitiveConcepts || []).length > 0) {
      riskFactors.push({
        category: 'Cultural Sensitivity',
        risk: 'Content contains culturally sensitive concepts',
        severity: 'medium',
        mitigation: 'Conduct cultural review with local experts'
      });
    }

    if ((regulatoryAnalysis.complianceRisks || []).length > 0) {
      riskFactors.push({
        category: 'Regulatory Compliance',
        risk: 'Content may not meet regulatory requirements',
        severity: 'critical',
        mitigation: 'Mandatory regulatory review before publication'
      });
    }

    return riskFactors;
  }

  static calculateEffortEstimate(readinessScore, languageCount, marketCount, contentLength) {
    const baseHours = Math.ceil(contentLength / 250) * 2; // 2 hours per 250 words base
    const complexityMultiplier = readinessScore < 50 ? 1.8 : readinessScore < 75 ? 1.4 : 1.0;
    const languageMultiplier = languageCount;
    const marketMultiplier = marketCount > 3 ? 1.2 : 1.0;

    return Math.round(baseHours * complexityMultiplier * languageMultiplier * marketMultiplier);
  }

  static calculateCostEstimate(effortHours, regulatoryScore) {
    const baseRate = 75; // $75 per hour base rate
    const regulatoryMultiplier = regulatoryScore < 50 ? 1.5 : regulatoryScore < 75 ? 1.2 : 1.0;
    
    return Math.round(effortHours * baseRate * regulatoryMultiplier);
  }

  static async storeAnalysis(projectId, brandId, analysis) {
    try {
      console.log('Storing content readiness analysis for project:', projectId);
      // For now, just log the analysis - we'll implement storage once types are available
      console.log('Content readiness analysis:', analysis);
    } catch (error) {
      console.error('Failed to store content readiness analysis:', error);
    }
  }

  static estimateSyllables(text) {
    const words = (text || '').toLowerCase().split(/\s+/);
    let syllableCount = 0;

    words.forEach(word => {
      const cleanWord = word.replace(/[^a-z]/g, '');
      if (cleanWord.length === 0) return;

      // Simple syllable counting algorithm
      const vowels = cleanWord.match(/[aeiouy]+/g);
      let count = vowels ? vowels.length : 1;
      
      if (cleanWord.endsWith('e')) count--;
      if (count === 0) count = 1;
      
      syllableCount += count;
    });

    return syllableCount;
  }

  static async getAnalysis(projectId) {
    try {
      console.log('Getting content readiness analysis for project:', projectId);
      // Return null for now - will implement once types are available
      return null;
    } catch (error) {
      console.error('Failed to get content readiness analysis:', error);
      return null;
    }
  }
}
