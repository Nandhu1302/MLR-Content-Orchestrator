import { supabase } from '@/integrations/supabase/client';
// Assuming SmartTMEngine is imported correctly in the original JS environment
// import { SmartTMEngine } from './smartTMEngine'; 

/**
 * @typedef {('approved' | 'pending' | 'restricted' | 'forbidden')} RegulatoryStatus
 */

/**
 * @typedef {object} TerminologyEntry
 * @property {string} id
 * @property {string} brandId
 * @property {string} therapeuticArea
 * @property {string[]} sourceTerms
 * @property {string} preferredTerm
 * @property {string} definition
 * @property {RegulatoryStatus} regulatoryStatus
 * @property {string} usageGuidelines
 * @property {object} contextualUsage
 * @property {boolean} contextualUsage.patientFacing
 * @property {boolean} contextualUsage.hcpFacing
 * @property {boolean} contextualUsage.marketingMaterials
 * @property {boolean} contextualUsage.regulatoryDocuments
 * @property {Record<string, string>} culturalConsiderations
 * @property {string[]} relatedTerms
 * @property {string} lastUpdated
 */

/**
 * @typedef {object} TermValidationResult
 * @property {string} term
 * @property {boolean} isValid
 * @property {number} validationScore
 * @property {string[]} issues
 * @property {string[]} suggestions
 * @property {string} [preferredAlternative]
 * @property {string} [regulatoryNotes]
 * @property {string[]} [culturalWarnings]
 */

/**
 * @typedef {object} TerminologyIntelligenceResult
 * @property {string} sourceText
 * @property {TermValidationResult[]} analyzedTerms
 * @property {number} overallComplianceScore
 * @property {string[]} criticalIssues
 * @property {string[]} recommendations
 * @property {Record<string, string>} approvedAlternatives
 */

export class GlobalTerminologyIntelligenceService {

  /**
   * Analyze text for terminology compliance and provide intelligence
   * @param {string} text
   * @param {string} brandId
   * @param {string} therapeuticArea
   * @param {('patient' | 'hcp' | 'marketing' | 'regulatory')} [context='marketing']
   * @param {string[]} [targetMarkets]
   * @returns {Promise<TerminologyIntelligenceResult>}
   */
  static async analyzeTerminology(
    text,
    brandId,
    therapeuticArea,
    context = 'marketing',
    targetMarkets
  ) {
    try {
      // Extract terms from text
      const extractedTerms = this.extractMedicalTerms(text);

      // Get brand terminology database
      const terminologyDatabase = await this.getBrandTerminologyDatabase(brandId, therapeuticArea);

      // Validate each term
      /** @type {TermValidationResult[]} */
      const analyzedTerms = [];
      for (const term of extractedTerms) {
        const validation = await this.validateTerm(
          term,
          terminologyDatabase,
          context,
          targetMarkets
        );
        analyzedTerms.push(validation);
      }

      // Calculate overall compliance score
      const complianceScore = this.calculateComplianceScore(analyzedTerms);

      // Identify critical issues
      const criticalIssues = analyzedTerms
        .filter(t => !t.isValid && t.validationScore < 50)
        .map(t => `"${t.term}": ${t.issues.join(', ')}`);

      // Generate recommendations
      const recommendations = this.generateTerminologyRecommendations(analyzedTerms, context);

      // Build approved alternatives map
      /** @type {Record<string, string>} */
      const approvedAlternatives = {};
      analyzedTerms.forEach(term => {
        if (term.preferredAlternative) {
          approvedAlternatives[term.term] = term.preferredAlternative;
        }
      });

      /** @type {TerminologyIntelligenceResult} */
      return {
        sourceText: text,
        analyzedTerms,
        overallComplianceScore: complianceScore,
        criticalIssues,
        recommendations,
        approvedAlternatives
      };
    } catch (error) {
      console.error('Error analyzing terminology:', error);
      throw error;
    }
  }

  /**
   * Get pre-approved terminology database for brand and therapeutic area
   * @param {string} brandId
   * @param {string} therapeuticArea
   * @returns {Promise<TerminologyEntry[]>}
   */
  static async getBrandTerminologyDatabase(
    brandId,
    therapeuticArea
  ) {
    try {
      // In production, this would query a comprehensive terminology database
      // For now, return mock data based on therapeutic area
      const mockTerminology = this.generateTherapeuticAreaTerminology(therapeuticArea);
      return mockTerminology;
    } catch (error) {
      console.error('Error getting terminology database:', error);
      return [];
    }
  }

  /**
   * Real-time terminology validation during content creation
   * @param {string} term
   * @param {string} brandId
   * @param {string} context
   * @param {string} [targetMarket]
   * @returns {Promise<TermValidationResult>}
   */
  static async validateTermInRealTime(
    term,
    brandId,
    context,
    targetMarket
  ) {
    try {
      const terminologyDatabase = await this.getBrandTerminologyDatabase(brandId, context);
      return await this.validateTerm(term, terminologyDatabase, context, targetMarket ? [targetMarket] : undefined);
    } catch (error) {
      console.error('Error validating term in real-time:', error);
      /** @type {TermValidationResult} */
      return {
        term,
        isValid: false,
        validationScore: 0,
        issues: ['Validation service unavailable'],
        suggestions: []
      };
    }
  }

  /**
   * Get contextual term suggestions based on content type and audience
   * @param {string} partialTerm
   * @param {string} brandId
   * @param {string} therapeuticArea
   * @param {('patient' | 'hcp' | 'marketing' | 'regulatory')} context
   * @param {string} [targetMarket]
   * @returns {Promise<Array<{ term: string; definition: string; confidence: number }>>}
   */
  static async getContextualSuggestions(
    partialTerm,
    brandId,
    therapeuticArea,
    context,
    targetMarket
  ) {
    try {
      const terminologyDatabase = await this.getBrandTerminologyDatabase(brandId, therapeuticArea);

      // Filter terms based on partial match and context
      const suggestions = terminologyDatabase
        .filter(entry => {
          // Check if any source terms or preferred term matches
          const termMatches = [...entry.sourceTerms, entry.preferredTerm]
            .some(t => t.toLowerCase().includes(partialTerm.toLowerCase()));

          // Check context appropriateness
          const contextMatch = this.isContextAppropriate(entry, context);

          return termMatches && contextMatch && entry.regulatoryStatus === 'approved';
        })
        .map(entry => ({
          term: entry.preferredTerm,
          definition: entry.definition,
          confidence: this.calculateTermConfidence(entry, partialTerm, context)
        }))
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 5);

      return suggestions;
    } catch (error) {
      console.error('Error getting contextual suggestions:', error);
      return [];
    }
  }

  /**
   * Generate comprehensive terminology intelligence for localization dashboard
   * @param {string} assetId
   * @param {string} brandId
   * @param {string[]} targetMarkets
   * @param {string} therapeuticArea
   * @returns {Promise<object>}
   */
  static async generateTerminologyIntelligence(
    assetId,
    brandId,
    targetMarkets,
    therapeuticArea
  ) {
    try {
      const terminologyDb = await this.getBrandTerminologyDatabase(brandId, therapeuticArea);

      const recommendedTerms = terminologyDb.map(entry => ({
        term: entry.preferredTerm,
        category: 'medical',
        definition: entry.definition,
        regulatoryStatus: entry.regulatoryStatus,
        culturalRisk: entry.culturalConsiderations && Object.keys(entry.culturalConsiderations).length > 0 ? 'medium' : 'low',
        marketSpecificTerms: targetMarkets.map(market => ({
          market,
          localizedTerm: entry.culturalConsiderations[market] ?
            `${entry.preferredTerm} (adapted)` : entry.preferredTerm,
          confidenceScore: entry.regulatoryStatus === 'approved' ? 95 : 75
        }))
      }));

      const preApprovedLibrary = {
        general: ['efficacy', 'safety', 'treatment', 'therapy'],
        medical: ['indication', 'contraindication', 'adverse event', 'clinical trial'],
        regulatory: ['prescribing information', 'label', 'package insert']
      };

      const medicalTerminology = terminologyDb.map(entry => ({
        term: entry.preferredTerm,
        definition: entry.definition,
        requiresValidation: entry.regulatoryStatus !== 'approved',
        regulatoryNotes: entry.regulatoryStatus !== 'approved' ? entry.usageGuidelines : undefined
      }));

      const brandedTerminology = [
        {
          brandedTerm: 'Brand-specific terminology',
          brandContext: 'therapeutic',
          usageGuidelines: 'Use only in approved contexts',
          restrictions: 'Not for patient-facing materials'
        }
      ];

      const searchAndFilterCapabilities = {
        availableFilters: ['regulatory_status', 'cultural_risk', 'category', 'market'],
        searchSuggestions: terminologyDb.map(entry => entry.preferredTerm).slice(0, 10),
        bulkOperations: ['approve', 'submit_review', 'export', 'auto_translate']
      };

      const approvalWorkflow = {
        pendingApprovals: [
          {
            term: 'efficacy endpoint',
            submittedBy: 'Content Team',
            submittedDate: new Date().toISOString(),
            status: 'pending'
          }
        ],
        approvedTermsHistory: terminologyDb
          .filter(entry => entry.regulatoryStatus === 'approved')
          .slice(0, 5)
          .map(entry => ({
            term: entry.preferredTerm,
            approvedBy: 'Regulatory Team',
            approvedDate: entry.lastUpdated,
            version: '1.0'
          }))
      };

      return {
        recommendedTerms,
        preApprovedLibrary,
        medicalTerminology,
        brandedTerminology,
        searchAndFilterCapabilities,
        approvalWorkflow
      };
    } catch (error) {
      console.error('Error generating terminology intelligence:', error);
      throw error;
    }
  }

  /**
   * Cross-reference with translation memory for terminology consistency
   * @param {string[]} sourceTerms
   * @param {string} sourceLanguage
   * @param {string} targetLanguage
   * @param {string} brandId
   * @returns {Promise<object>}
   */
  static async checkTranslationConsistency(
    sourceTerms,
    sourceLanguage,
    targetLanguage,
    brandId
  ) {
    try {
      /** @type {Array<{ source: string; target: string; confidence: number }>} */
      const consistentTerms = [];
      /** @type {Array<{ source: string; translations: string[]; issue: string }>} */
      const inconsistentTerms = [];

      for (const term of sourceTerms) {
        // Check translation memory for this term
        const tmResult = await SmartTMEngine.searchTranslationMemory(
          term,
          sourceLanguage,
          targetLanguage,
          brandId,
          { minMatchPercentage: 85 }
        );

        if (tmResult.matches.length === 0) {
          inconsistentTerms.push({
            source: term,
            translations: [],
            issue: 'No translation memory available'
          });
        } else if (tmResult.matches.length === 1) {
          consistentTerms.push({
            source: term,
            target: tmResult.matches[0].targetText,
            confidence: tmResult.matches[0].matchPercentage
          });
        } else {
          // Multiple translations found - potential inconsistency
          const uniqueTranslations = [...new Set(tmResult.matches.map(m => m.targetText))];
          if (uniqueTranslations.length > 1) {
            inconsistentTerms.push({
              source: term,
              translations: uniqueTranslations,
              issue: 'Multiple translations found - consistency check needed'
            });
          } else {
            consistentTerms.push({
              source: term,
              target: uniqueTranslations[0],
              confidence: Math.max(...tmResult.matches.map(m => m.matchPercentage))
            });
          }
        }
      }

      return { consistentTerms, inconsistentTerms };
    } catch (error) {
      console.error('Error checking translation consistency:', error);
      return { consistentTerms: [], inconsistentTerms: [] };
    }
  }

  // Private helper methods
  /**
   * @param {string} text
   * @returns {string[]}
   */
  static extractMedicalTerms(text) {
    // Enhanced medical term extraction
    const medicalPatterns = [
      /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*(?:\s+\([A-Z]+\))?\b/g, // Capitalized terms with abbreviations
      /\b\d+\s*mg\b|\b\d+\s*mcg\b|\b\d+\s*ml\b/g, // Dosages
      /\b[a-z]+(?:ine|oid|ase|ide|ate)\b/g, // Common drug suffixes
      /\b(?:efficacy|safety|bioavailability|pharmacokinetics|contraindications)\b/gi // Medical concepts
    ];

    /** @type {Set<string>} */
    const extractedTerms = new Set();

    medicalPatterns.forEach(pattern => {
      const matches = text.match(pattern) || [];
      matches.forEach(match => extractedTerms.add(match.trim()));
    });

    // Filter out common words and very short terms
    return Array.from(extractedTerms)
      .filter(term => term.length > 2)
      .filter(term => !this.isCommonWord(term));
  }

  /**
   * @param {string} term
   * @param {TerminologyEntry[]} terminologyDatabase
   * @param {('patient' | 'hcp' | 'marketing' | 'regulatory')} context
   * @param {string[]} [targetMarkets]
   * @returns {Promise<TermValidationResult>}
   */
  static async validateTerm(
    term,
    terminologyDatabase,
    context,
    targetMarkets
  ) {
    // Find matching terminology entry
    const entry = terminologyDatabase.find(entry =>
      [...entry.sourceTerms, entry.preferredTerm]
        .some(t => t.toLowerCase() === term.toLowerCase())
    );

    if (!entry) {
      /** @type {TermValidationResult} */
      return {
        term,
        isValid: false,
        validationScore: 30,
        issues: ['Term not found in approved terminology database'],
        suggestions: ['Verify spelling', 'Check for approved alternatives']
      };
    }

    /** @type {string[]} */
    const issues = [];
    /** @type {string[]} */
    const suggestions = [];
    /** @type {string[]} */
    const culturalWarnings = [];
    let score = 100;

    // Check regulatory status
    if (entry.regulatoryStatus === 'forbidden') {
      issues.push('Term is forbidden by regulatory guidelines');
      score -= 50;
    } else if (entry.regulatoryStatus === 'restricted') {
      issues.push('Term has regulatory restrictions');
      suggestions.push('Review usage guidelines before using');
      score -= 20;
    } else if (entry.regulatoryStatus === 'pending') {
      issues.push('Term approval is pending');
      score -= 30;
    }

    // Check context appropriateness
    const contextAppropriate = this.isContextAppropriate(entry, context);
    if (!contextAppropriate) {
      issues.push(`Term may not be appropriate for ${context} context`);
      score -= 25;
    }

    // Check cultural considerations for target markets
    if (targetMarkets) {
      targetMarkets.forEach(market => {
        if (entry.culturalConsiderations[market]) {
          culturalWarnings.push(`${market}: ${entry.culturalConsiderations[market]}`);
          score -= 10;
        }
      });
    }

    // Check if preferred term should be used instead
    /** @type {string | undefined} */
    let preferredAlternative;
    if (!entry.sourceTerms.includes(term) && term !== entry.preferredTerm) {
      preferredAlternative = entry.preferredTerm;
      suggestions.push(`Consider using preferred term: "${entry.preferredTerm}"`);
      score -= 15;
    }

    /** @type {TermValidationResult} */
    return {
      term,
      isValid: score >= 70,
      validationScore: Math.max(0, score),
      issues,
      suggestions,
      preferredAlternative,
      regulatoryNotes: entry.usageGuidelines,
      culturalWarnings: culturalWarnings.length > 0 ? culturalWarnings : undefined
    };
  }

  /**
   * @param {TerminologyEntry} entry
   * @param {('patient' | 'hcp' | 'marketing' | 'regulatory')} context
   * @returns {boolean}
   */
  static isContextAppropriate(entry, context) {
    switch (context) {
      case 'patient':
        return entry.contextualUsage.patientFacing;
      case 'hcp':
        return entry.contextualUsage.hcpFacing;
      case 'marketing':
        return entry.contextualUsage.marketingMaterials;
      case 'regulatory':
        return entry.contextualUsage.regulatoryDocuments;
      default:
        return true;
    }
  }

  /**
   * @param {TermValidationResult[]} results
   * @returns {number}
   */
  static calculateComplianceScore(results) {
    if (results.length === 0) return 100;

    const totalScore = results.reduce((sum, result) => sum + result.validationScore, 0);
    return Math.round(totalScore / results.length);
  }

  /**
   * @param {TermValidationResult[]} results
   * @param {string} context
   * @returns {string[]}
   */
  static generateTerminologyRecommendations(
    results,
    context
  ) {
    /** @type {string[]} */
    const recommendations = [];

    const invalidTerms = results.filter(r => !r.isValid);
    const lowScoreTerms = results.filter(r => r.validationScore < 80);

    if (invalidTerms.length > 0) {
      recommendations.push(`Review ${invalidTerms.length} invalid terms before proceeding`);
    }

    if (lowScoreTerms.length > 0) {
      recommendations.push(`Consider terminology alternatives for ${lowScoreTerms.length} terms with compliance concerns`);
    }

    const culturalWarnings = results.filter(r => r.culturalWarnings && r.culturalWarnings.length > 0);
    if (culturalWarnings.length > 0) {
      recommendations.push('Review cultural considerations for target markets');
    }

    if (results.some(r => r.regulatoryNotes)) {
      recommendations.push('Consult regulatory guidelines for restricted terms');
    }

    return recommendations;
  }

  /**
   * @param {TerminologyEntry} entry
   * @param {string} searchTerm
   * @param {string} context
   * @returns {number}
   */
  static calculateTermConfidence(
    entry,
    searchTerm,
    context
  ) {
    let confidence = 50;

    // Exact match bonus
    if (entry.preferredTerm.toLowerCase() === searchTerm.toLowerCase()) {
      confidence += 40;
    } else if (entry.sourceTerms.some(t => t.toLowerCase() === searchTerm.toLowerCase())) {
      confidence += 30;
    }

    // Context match bonus
    if (this.isContextAppropriate(entry, context)) {
      confidence += 20;
    }

    // Regulatory status bonus
    if (entry.regulatoryStatus === 'approved') {
      confidence += 10;
    }

    return Math.min(100, confidence);
  }

  /**
   * @param {string} word
   * @returns {boolean}
   */
  static isCommonWord(word) {
    const commonWords = new Set([
      'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
      'this', 'that', 'these', 'those', 'is', 'are', 'was', 'were', 'be', 'been',
      'have', 'has', 'had', 'will', 'would', 'could', 'should', 'may', 'might'
    ]);
    return commonWords.has(word.toLowerCase());
  }

  /**
   * @param {string} therapeuticArea
   * @returns {TerminologyEntry[]}
   */
  static generateTherapeuticAreaTerminology(therapeuticArea) {
    // Mock terminology data - in production, this would come from a comprehensive database
    /** @type {TerminologyEntry[]} */
    const baseTerms = [
      {
        id: '1',
        brandId: 'any',
        therapeuticArea: 'oncology',
        sourceTerms: ['cancer', 'tumor', 'malignancy'],
        preferredTerm: 'cancer',
        definition: 'A disease in which abnormal cells divide uncontrollably',
        regulatoryStatus: 'approved',
        usageGuidelines: 'Use in all contexts with appropriate sensitivity',
        contextualUsage: {
          patientFacing: true,
          hcpFacing: true,
          marketingMaterials: true,
          regulatoryDocuments: true
        },
        culturalConsiderations: {
          'China': 'Consider using more hopeful terminology',
          'Japan': 'Use respectful, indirect language'
        },
        relatedTerms: ['oncology', 'chemotherapy', 'radiation'],
        lastUpdated: new Date().toISOString()
      },
      {
        id: '2',
        brandId: 'any',
        therapeuticArea: 'cardiovascular',
        sourceTerms: ['heart attack', 'myocardial infarction', 'MI'],
        preferredTerm: 'myocardial infarction',
        definition: 'Death of heart muscle due to insufficient blood supply',
        regulatoryStatus: 'approved',
        usageGuidelines: 'Use technical term in HCP materials, simplified in patient materials',
        contextualUsage: {
          patientFacing: false,
          hcpFacing: true,
          marketingMaterials: false,
          regulatoryDocuments: true
        },
        culturalConsiderations: {
          'Germany': 'Prefer technical precision',
          'US': 'Can use simplified terms in patient materials'
        },
        relatedTerms: ['cardiac event', 'coronary artery disease'],
        lastUpdated: new Date().toISOString()
      }
    ];

    return baseTerms.filter(term =>
      term.therapeuticArea === therapeuticArea.toLowerCase() ||
      term.therapeuticArea === 'general'
    );
  }
}