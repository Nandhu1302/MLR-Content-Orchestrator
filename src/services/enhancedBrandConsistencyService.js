import React from 'react';
import { supabase } from "../integrations/supabase/client.js";
import { unifiedDataService } from './unifiedDataService';

export class EnhancedBrandConsistencyService {
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

      // Get brand guidelines and strategic context
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

  static async analyzeContentSections(
    sections,
    guidelines,
    vision,
    targetMarkets
  ) {
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

  static async analyzeMessagingInSection(
    section,
    guidelines,
    vision
  ) {
    const issues = [];
    const keyMessages = (guidelines && guidelines.messaging_framework && guidelines.messaging_framework.key_messages) || [];
    const prohibitedTerms = (guidelines && guidelines.messaging_framework && guidelines.messaging_framework.prohibited_terms) || [];

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
      const hasKeyMessage = keyMessages.some((msg) => 
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

  static async analyzeRegulatoryInSection(
    section,
    targetMarkets
  ) {
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

  static async analyzeToneInSection(
    section,
    guidelines
  ) {
    const issues = [];
    const expectedTone = (guidelines && guidelines.tone_of_voice && guidelines.tone_of_voice.primary_tone) || 'professional';
    
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

  static async analyzeClaimsInSection(section) {
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

  static async analyzeThemeAlignment(sections, themeContext) {
    if (!themeContext) {
      return {
        themeName: 'No theme context',
        alignmentScore: 50,
        misalignedElements: []
      };
    }

    const combinedContent = sections.map(s => s.content).join(' ').toLowerCase();
    const themeKeywords = (themeContext.keyMessage && themeContext.keyMessage.toLowerCase().split(' ')) || [];
    
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

  static identifyStrengths(contentIssues, themeAlignment) {
    const strengths = [];
    
    if (contentIssues.filter(i => i.category === 'regulatory' && i.severity === 'critical').length === 0) {
      strengths.push('No critical regulatory issues detected');
    }
    
    if (themeAlignment && themeAlignment.alignmentScore > 70) {
      strengths.push('Strong alignment with strategic theme');
    }
    
    return strengths;
  }

  static generateBasicRecommendations(contentIssues) {
    const recommendations = [];
    
    if (contentIssues.filter(i => i.severity === 'critical').length > 0) {
      recommendations.push('Address critical issues before proceeding');
    }
    
    return recommendations;
  }

  static determineStatus(overallScore, criticalIssuesCount) {
    if (criticalIssuesCount > 0) return 'non_compliant';
    if (overallScore < 70) return 'needs_review';
    return 'compliant';
  }

  // Helper methods
  static async getBrandGuidelines(brandId) {
    const { data, error } = await supabase
      .from('brand_guidelines')
      .select('*')
      .eq('brand_id', brandId)
      .single();

    if (error) throw error;
    return data;
  }

  static async getBrandVision(brandId) {
    const { data, error } = await supabase
      .from('brand_vision')
      .select('*')
      .eq('brand_id', brandId)
      .single();

    if (error) throw error;
    return data;
  }

  static async getStrategicContext(brandId, context) {
    // Get campaign objectives and audience insights from context
    return {
      campaignObjectives: context && context.campaignContext && context.campaignContext.objectives || [],
      audienceInsights: context && context.campaignContext && context.campaignContext.audienceInsights || {},
      previousContent: []
    };
  }

  static getSuggestedReplacement(term, keyMessages) {
    // Simple replacement logic - would be enhanced with terminology database
    const replacements = {
      'cure': 'treatment option',
      'guarantee': 'designed to help',
      'best': 'effective',
      'proven': 'studied'
    };
    
    return replacements[term.toLowerCase()] || (keyMessages && keyMessages[0]) || 'approved alternative';
  }

  static getSofterClaimAlternative(claim) {
    const alternatives = {
      'proven': 'studied in clinical trials',
      'guaranteed': 'designed to help',
      'best': 'an effective option',
      'most effective': 'a proven treatment option'
    };
    
    return alternatives[claim.toLowerCase()] || 'clinically studied';
  }

  static getProfessionalAlternative(word) {
    const alternatives = {
      'hey': 'hello',
      'wow': 'notably',
      'awesome': 'excellent',
      'cool': 'beneficial',
      'gonna': 'going to',
      'wanna': 'want to'
    };
    
    return alternatives[word.toLowerCase()] || word;
  }
}
