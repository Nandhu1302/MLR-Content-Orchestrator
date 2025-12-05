// Placeholder for external dependencies (assuming they are initialized elsewhere)
// const supabase = {
//   from: () => ({ select: () => ({ eq: () => ({ single: () => ({ data: {} }) }) }) })
// };
import { supabase } from '@/integrations/supabase/client';

/**
 * @typedef {'messaging' | 'visual' | 'tone' | 'terminology' | 'compliance'} IssueType
 * @typedef {'low' | 'medium' | 'high' | 'critical'} IssueSeverity
 */

/**
 * @typedef {object} BrandConsistencyIssue
 * @property {IssueType} type
 * @property {IssueSeverity} severity
 * @property {string} element
 * @property {string} description
 * @property {string} expectedValue
 * @property {string} actualValue
 * @property {string} recommendation
 */

/**
 * @typedef {object} CrossLanguageInconsistentElement
 * @property {string} element
 * @property {Record<string, string>} variations
 * @property {string} recommendedStandardization
 */

/**
 * @typedef {object} CrossLanguageConsistencyResult
 * @property {string[]} consistentElements
 * @property {CrossLanguageInconsistentElement[]} inconsistentElements
 * @property {Record<string, number>} brandVoicePreservation - Preservation score per language
 */

/**
 * @typedef {object} BrandConsistencyValidation
 * @property {number} overallScore
 * @property {number} brandAlignmentScore
 * @property {number} messagingConsistencyScore
 * @property {number} visualConsistencyScore
 * @property {number} toneConsistencyScore
 * @property {BrandConsistencyIssue[]} issues
 * @property {string[]} recommendations
 * @property {CrossLanguageConsistencyResult} [crossLanguageConsistency]
 */

/**
 * @typedef {object} BrandVoiceProfile
 * @property {string} brandId
 * @property {string} therapeuticArea
 * @property {object} voiceCharacteristics
 * @property {string[]} voiceCharacteristics.tone
 * @property {string[]} voiceCharacteristics.personality
 * @property {string} voiceCharacteristics.communicationStyle
 * @property {string[]} voiceCharacteristics.vocabularyPreferences
 * @property {string[]} voiceCharacteristics.avoidedTerms
 * @property {string[]} messagingPillars
 * @property {object} visualIdentity
 * @property {string[]} visualIdentity.colorPalette
 * @property {string[]} visualIdentity.typography
 * @property {string} visualIdentity.imageryStyle
 * @property {object} complianceRequirements
 * @property {string} complianceRequirements.regulatoryTone
 * @property {string[]} complianceRequirements.disclaimerRequirements
 * @property {string[]} complianceRequirements.approvedClaims
 */

export class BrandConsistencyIntelligenceService {

  /**
   * Comprehensive brand consistency validation across all content elements
   * @param {any} assetContent
   * @param {string} brandId
   * @param {string} assetType
   * @param {string[]} [targetMarkets]
   * @returns {Promise<BrandConsistencyValidation>}
   */
  static async validateBrandConsistency(
    assetContent,
    brandId,
    assetType,
    targetMarkets
  ) {
    try {
      // Get brand voice profile
      const brandProfile = await this.getBrandVoiceProfile(brandId);
      
      // Validate different consistency aspects
      const messagingScore = await this.validateMessagingConsistency(assetContent, brandProfile);
      const visualScore = await this.validateVisualConsistency(assetContent, brandProfile);
      const toneScore = await this.validateToneConsistency(assetContent, brandProfile);
      const brandAlignmentScore = await this.validateBrandAlignment(assetContent, brandProfile);
      
      // Collect all issues
      /** @type {BrandConsistencyIssue[]} */
      const issues = [];
      issues.push(...messagingScore.issues);
      issues.push(...visualScore.issues);
      issues.push(...toneScore.issues);
      issues.push(...brandAlignmentScore.issues);
      
      // Calculate overall score
      const overallScore = Math.round(
        (messagingScore.score + visualScore.score + toneScore.score + brandAlignmentScore.score) / 4
      );
      
      // Generate recommendations
      const recommendations = this.generateBrandConsistencyRecommendations(issues, brandProfile);
      
      // Cross-language consistency check if multiple markets
      /** @type {CrossLanguageConsistencyResult | undefined} */
      let crossLanguageConsistency;
      if (targetMarkets && targetMarkets.length > 1) {
        crossLanguageConsistency = await this.validateCrossLanguageConsistency(
          assetContent, 
          brandProfile, 
          targetMarkets
        );
      }

      return {
        overallScore,
        brandAlignmentScore: brandAlignmentScore.score,
        messagingConsistencyScore: messagingScore.score,
        visualConsistencyScore: visualScore.score,
        toneConsistencyScore: toneScore.score,
        issues,
        recommendations,
        crossLanguageConsistency
      };
    } catch (error) {
      console.error('Error validating brand consistency:', error);
      throw error;
    }
  }

  /**
   * Real-time brand voice preservation algorithm for content editing
   * @param {string} originalText
   * @param {string} modifiedText
   * @param {string} brandId
   * @param {string} [targetLanguage]
   * @returns {Promise<{ voicePreservationScore: number; changedElements: string[]; voiceRiskAreas: Array<{ element: string; risk: string; suggestion: string }>; brandAlignmentMaintained: boolean; }>}
   */
  static async preserveBrandVoice(
    originalText,
    modifiedText,
    brandId,
    targetLanguage
  ) {
    try {
      const brandProfile = await this.getBrandVoiceProfile(brandId);
      
      // Analyze voice characteristics preservation
      const voiceAnalysis = this.analyzeBrandVoicePreservation(
        originalText, 
        modifiedText, 
        brandProfile
      );
      
      // Calculate preservation score
      const preservationScore = this.calculateVoicePreservationScore(voiceAnalysis);
      
      // Identify risk areas
      const riskAreas = this.identifyVoiceRiskAreas(voiceAnalysis, brandProfile);
      
      return {
        voicePreservationScore: preservationScore,
        changedElements: voiceAnalysis.changedElements,
        voiceRiskAreas: riskAreas,
        brandAlignmentMaintained: preservationScore >= 75
      };
    } catch (error) {
      console.error('Error preserving brand voice:', error);
      return {
        voicePreservationScore: 0,
        changedElements: [],
        voiceRiskAreas: [],
        brandAlignmentMaintained: false
      };
    }
  }

  /**
   * Cross-language brand consistency validation
   * @param {any} assetContent
   * @param {BrandVoiceProfile} brandProfile
   * @param {string[]} targetLanguages
   * @returns {Promise<CrossLanguageConsistencyResult>}
   */
  static async validateCrossLanguageConsistency(
    assetContent,
    brandProfile,
    targetLanguages
  ) {
    try {
      /** @type {string[]} */
      const consistentElements = [];
      /** @type {CrossLanguageInconsistentElement[]} */
      const inconsistentElements = [];
      /** @type {Record<string, number>} */
      const brandVoicePreservation = {};
      
      // Check consistency across languages for key brand elements
      const keyElements = ['headline', 'cta', 'brandMessage', 'tone'];
      
      for (const element of keyElements) {
        /** @type {Record<string, string>} */
        const variations = {};
        let hasVariations = false;
        
        for (const language of targetLanguages) {
          const localizedValue = assetContent[`${element}_${language}`] || assetContent[element];
          if (localizedValue) {
            variations[language] = localizedValue;
            
            // Check if this variation differs significantly from others
            const otherVariations = Object.values(variations).filter(v => v !== localizedValue);
            if (otherVariations.length > 0) {
              hasVariations = true;
            }
          }
        }
        
        if (hasVariations) {
          inconsistentElements.push({
            element,
            variations,
            recommendedStandardization: this.recommendStandardization(variations, element, brandProfile)
          });
        } else {
          consistentElements.push(element);
        }
        
        // Calculate brand voice preservation for each language
        for (const language of targetLanguages) {
          if (!brandVoicePreservation[language]) {
            brandVoicePreservation[language] = this.calculateLanguageVoicePreservation(
              assetContent, 
              brandProfile, 
              language
            );
          }
        }
      }
      
      return {
        consistentElements,
        inconsistentElements,
        brandVoicePreservation
      };
    } catch (error) {
      console.error('Error validating cross-language consistency:', error);
      return {
        consistentElements: [],
        inconsistentElements: [],
        brandVoicePreservation: {}
      };
    }
  }

  /**
   * Generate automated brand consistency corrections
   * @param {any} assetContent
   * @param {string} brandId
   * @param {BrandConsistencyIssue[]} issues
   * @returns {Promise<{ correctedContent: any; appliedCorrections: Array<{ issue: BrandConsistencyIssue; correction: string; confidence: number }>; manualReviewRequired: BrandConsistencyIssue[]; }>}
   */
  static async generateBrandConsistencyCorrections(
    assetContent,
    brandId,
    issues
  ) {
    try {
      const brandProfile = await this.getBrandVoiceProfile(brandId);
      const correctedContent = { ...assetContent };
      /** @type {any[]} */
      const appliedCorrections = [];
      /** @type {BrandConsistencyIssue[]} */
      const manualReviewRequired = [];
      
      for (const issue of issues) {
        if (issue.severity === 'critical' || issue.type === 'compliance') {
          manualReviewRequired.push(issue);
          continue;
        }
        
        const correction = this.generateAutomaticCorrection(issue, brandProfile);
        if (correction.confidence >= 80) {
          // Apply automatic correction
          this.applyCorrection(correctedContent, issue, correction.correctedValue);
          appliedCorrections.push({
            issue,
            correction: correction.correctedValue,
            confidence: correction.confidence
          });
        } else {
          manualReviewRequired.push(issue);
        }
      }
      
      return {
        correctedContent,
        appliedCorrections,
        manualReviewRequired
      };
    } catch (error) {
      console.error('Error generating brand consistency corrections:', error);
      return {
        correctedContent: assetContent,
        appliedCorrections: [],
        manualReviewRequired: issues
      };
    }
  }

  // Private helper methods (converted to static methods)
  
  /**
   * @param {string} brandId
   * @returns {Promise<BrandVoiceProfile>}
   */
  static async getBrandVoiceProfile(brandId) {
    try {
      const { data: brandData } = await supabase
        .from('brand_profiles')
        .select('*')
        .eq('id', brandId)
        .single();
      
      // In production, this would come from a comprehensive brand database
      /** @type {BrandVoiceProfile} */
      const profile = {
        brandId,
        therapeuticArea: brandData?.therapeutic_area || 'general',
        voiceCharacteristics: {
          tone: ['professional', 'empathetic', 'trustworthy'],
          personality: ['caring', 'innovative', 'reliable'],
          communicationStyle: 'clear and direct',
          vocabularyPreferences: ['evidence-based', 'patient-centered', 'innovative'],
          avoidedTerms: ['cure', 'miracle', 'guaranteed']
        },
        messagingPillars: ['efficacy', 'safety', 'innovation', 'patient-centricity'],
        visualIdentity: {
          colorPalette: [brandData?.primary_color, brandData?.secondary_color, brandData?.accent_color].filter(Boolean),
          typography: [brandData?.font_family || 'Inter'],
          imageryStyle: 'professional healthcare imagery'
        },
        complianceRequirements: {
          regulatoryTone: 'factual and balanced',
          disclaimerRequirements: ['safety information', 'prescribing information'],
          approvedClaims: []
        }
      };
      return profile;
    } catch (error) {
      console.error('Error getting brand voice profile:', error);
      throw error;
    }
  }

  /**
   * @param {any} content
   * @param {BrandVoiceProfile} profile
   * @returns {Promise<{ score: number; issues: BrandConsistencyIssue[] }>}
   */
  static async validateMessagingConsistency(content, profile) {
    /** @type {BrandConsistencyIssue[]} */
    const issues = [];
    let score = 100;
    
    // Check messaging pillars alignment
    const contentText = `${content.headline || ''} ${content.body || ''}`.toLowerCase();
    const pillarsPresent = profile.messagingPillars.filter(pillar => 
      contentText.includes(pillar.toLowerCase())
    );
    
    if (pillarsPresent.length === 0) {
      issues.push({
        type: 'messaging',
        severity: 'high',
        element: 'messaging_pillars',
        description: 'Content does not align with brand messaging pillars',
        expectedValue: profile.messagingPillars.join(', '),
        actualValue: 'No alignment detected',
        recommendation: `Incorporate messaging around: ${profile.messagingPillars.slice(0, 2).join(', ')}`
      });
      score -= 30;
    }
    
    // Check avoided terms
    for (const avoidedTerm of profile.voiceCharacteristics.avoidedTerms) {
      if (contentText.includes(avoidedTerm.toLowerCase())) {
        issues.push({
          type: 'messaging',
          severity: 'critical',
          element: 'avoided_terms',
          description: `Content contains avoided term: "${avoidedTerm}"`,
          expectedValue: 'Term should not be present',
          actualValue: avoidedTerm,
          recommendation: `Remove or replace "${avoidedTerm}" with appropriate alternative`
        });
        score -= 40;
      }
    }
    
    return { score: Math.max(0, score), issues };
  }

  /**
   * @param {any} content
   * @param {BrandVoiceProfile} profile
   * @returns {Promise<{ score: number; issues: BrandConsistencyIssue[] }>}
   */
  static async validateVisualConsistency(content, profile) {
    /** @type {BrandConsistencyIssue[]} */
    const issues = [];
    let score = 100;
    
    // Check color consistency
    if (content.brandElements?.colors) {
      const contentColors = content.brandElements.colors;
      const brandColors = profile.visualIdentity.colorPalette;
      
      const inconsistentColors = contentColors.filter(color => !brandColors.includes(color));
      if (inconsistentColors.length > 0) {
        issues.push({
          type: 'visual',
          severity: 'medium',
          element: 'color_palette',
          description: 'Content uses colors outside brand palette',
          expectedValue: brandColors.join(', '),
          actualValue: contentColors.join(', '),
          recommendation: `Use brand colors: ${brandColors.slice(0, 3).join(', ')}`
        });
        score -= 20;
      }
    }
    
    return { score: Math.max(0, score), issues };
  }

  /**
   * @param {any} content
   * @param {BrandVoiceProfile} profile
   * @returns {Promise<{ score: number; issues: BrandConsistencyIssue[] }>}
   */
  static async validateToneConsistency(content, profile) {
    /** @type {BrandConsistencyIssue[]} */
    const issues = [];
    let score = 100;
    
    // Analyze tone characteristics
    const contentText = `${content.headline || ''} ${content.body || ''}`;
    const expectedTone = profile.voiceCharacteristics.tone;
    
    // Simple tone analysis (in production, this would use NLP)
    const detectedTone = this.analyzeToneCharacteristics(contentText);
    
    const toneAlignment = expectedTone.filter(tone => detectedTone.includes(tone));
    if (toneAlignment.length === 0) {
      issues.push({
        type: 'tone',
        severity: 'medium',
        element: 'brand_tone',
        description: 'Content tone does not match brand voice',
        expectedValue: expectedTone.join(', '),
        actualValue: detectedTone.join(', '),
        recommendation: `Adjust tone to be more: ${expectedTone.slice(0, 2).join(' and ')}`
      });
      score -= 25;
    }
    
    return { score: Math.max(0, score), issues };
  }

  /**
   * @param {any} content
   * @param {BrandVoiceProfile} profile
   * @returns {Promise<{ score: number; issues: BrandConsistencyIssue[] }>}
   */
  static async validateBrandAlignment(content, profile) {
    /** @type {BrandConsistencyIssue[]} */
    const issues = [];
    let score = 100;
    
    // Check therapeutic area alignment
    const contentText = `${content.headline || ''} ${content.body || ''}`.toLowerCase();
    if (!contentText.includes(profile.therapeuticArea.toLowerCase())) {
      issues.push({
        type: 'messaging',
        severity: 'low',
        element: 'therapeutic_focus',
        description: 'Content may not clearly indicate therapeutic area focus',
        expectedValue: profile.therapeuticArea,
        actualValue: 'Not clearly indicated',
        recommendation: `Consider mentioning ${profile.therapeuticArea} context`
      });
      score -= 10;
    }
    
    return { score: Math.max(0, score), issues };
  }

  /**
   * @param {BrandConsistencyIssue[]} issues
   * @param {BrandVoiceProfile} profile
   * @returns {string[]}
   */
  static generateBrandConsistencyRecommendations(
    issues, 
    profile
  ) {
    /** @type {string[]} */
    const recommendations = [];
    
    const criticalIssues = issues.filter(issue => issue.severity === 'critical');
    if (criticalIssues.length > 0) {
      recommendations.push('Address critical brand violations immediately');
    }
    
    const messagingIssues = issues.filter(issue => issue.type === 'messaging');
    if (messagingIssues.length > 0) {
      recommendations.push(`Align messaging with brand pillars: ${profile.messagingPillars.slice(0, 3).join(', ')}`);
    }
    
    const toneIssues = issues.filter(issue => issue.type === 'tone');
    if (toneIssues.length > 0) {
      recommendations.push(`Adjust tone to be: ${profile.voiceCharacteristics.tone.join(', ')}`);
    }
    
    return recommendations;
  }

  /**
   * @param {string} originalText
   * @param {string} modifiedText
   * @param {BrandVoiceProfile} profile
   * @returns {any}
   */
  static analyzeBrandVoicePreservation(originalText, modifiedText, profile) {
    // Simplified voice analysis - in production would use advanced NLP
    return {
      changedElements: ['tone', 'terminology'],
      toneShift: 0.2,
      terminologyChanges: 1,
      messagingAlignment: 0.8
    };
  }

  /**
   * @param {any} analysis
   * @returns {number}
   */
  static calculateVoicePreservationScore(analysis) {
    // Simplified scoring algorithm
    let score = 100;
    score -= analysis.toneShift * 50;
    score -= analysis.terminologyChanges * 10;
    score += analysis.messagingAlignment * 20;
    return Math.max(0, Math.min(100, score));
  }

  /**
   * @param {any} analysis
   * @param {BrandVoiceProfile} profile
   * @returns {Array<{ element: string; risk: string; suggestion: string }>}
   */
  static identifyVoiceRiskAreas(analysis, profile) {
    return [
      {
        element: 'tone',
        risk: 'Tone may have shifted from brand voice',
        suggestion: `Maintain ${profile.voiceCharacteristics.tone.join(', ')} tone`
      }
    ];
  }

  /**
   * @param {Record<string, string>} variations
   * @param {string} element
   * @param {BrandVoiceProfile} profile
   * @returns {string}
   */
  static recommendStandardization(variations, element, profile) {
    // In production, this would use sophisticated analysis
    const values = Object.values(variations);
    return values[0]; // Simplified - return first variation
  }

  /**
   * @param {any} content
   * @param {BrandVoiceProfile} profile
   * @param {string} language
   * @returns {number}
   */
  static calculateLanguageVoicePreservation(content, profile, language) {
    // Simplified calculation - in production would analyze language-specific voice preservation
    return 85;
  }

  /**
   * @param {BrandConsistencyIssue} issue
   * @param {BrandVoiceProfile} profile
   * @returns {{ correctedValue: string; confidence: number }}
   */
  static generateAutomaticCorrection(issue, profile) {
    // Simplified correction generation
    return {
      correctedValue: issue.expectedValue,
      confidence: issue.severity === 'low' ? 90 : 60
    };
  }

  /**
   * @param {any} content
   * @param {BrandConsistencyIssue} issue
   * @param {string} correctedValue
   * @returns {void}
   */
  static applyCorrection(content, issue, correctedValue) {
    // Apply the correction to content object
    if (issue.element in content) {
      content[issue.element] = correctedValue;
    }
  }

  /**
   * @param {string} text
   * @returns {string[]}
   */
  static analyzeToneCharacteristics(text) {
    /** @type {string[]} */
    const tones = [];
    
    if (text.includes('proven') || text.includes('evidence')) tones.push('professional');
    if (text.includes('help') || text.includes('support')) tones.push('empathetic');
    if (text.includes('trusted') || text.includes('reliable')) tones.push('trustworthy');
    
    return tones.length > 0 ? tones : ['neutral'];
  }
}