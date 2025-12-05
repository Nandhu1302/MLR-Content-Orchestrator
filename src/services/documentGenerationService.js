// Importing external types for JSDoc reference.
// Assuming these are defined elsewhere or passed in as objects.
// import { MarketAnalysis, ContentAdaptationRoadmap } from './marketIntelligenceService';
// import { BrandConsistencyResult } from './brandConsistencyService';


/**
 * @typedef {Object} MarketAnalysis
 * // Placeholder for MarketAnalysis structure
 * @property {string} marketCode
 * @property {string} marketName
 * @property {'Low' | 'Medium' | 'High' | 'Critical'} riskLevel
 * @property {'Low' | 'Medium' | 'High' | 'Critical'} complexity
 * @property {number} culturalAdaptationScore
 * @property {Object} competitivePositioning
 * @property {string} competitivePositioning.competitiveThreat
 * @property {string} competitivePositioning.marketPosition
 * @property {Array<Object>} marketSpecificRequirements
 * @property {string} marketSpecificRequirements.category
 * @property {string} marketSpecificRequirements.requirement
 * @property {string} marketSpecificRequirements.culturalContext
 * @property {'must' | 'should' | 'could'} marketSpecificRequirements.priority
 * @property {string} marketSpecificRequirements.adaptationLevel
 */

/**
 * @typedef {Object} ContentAdaptationRoadmap
 * // Placeholder for ContentAdaptationRoadmap structure
 * @property {string} marketCode
 * @property {'no_delay' | 'minor_delay' | 'major_delay'} timelineImpact
 * @property {Array<Object>} criticalChanges
 * @property {string} criticalChanges.element
 * @property {'low' | 'medium' | 'high'} criticalChanges.effort
 * @property {Array<Object>} recommendedChanges
 * @property {string} recommendedChanges.element
 * @property {Array<Object>} optionalChanges
 * @property {string} optionalChanges.element
 */

/**
 * @typedef {Object} BrandConsistencyResult
 * // Placeholder for BrandConsistencyResult structure
 * @property {number} messagingScore
 * @property {number} visualScore
 */

/**
 * @typedef {Object} ExecutiveSummary
 * @property {'Low' | 'Medium' | 'High' | 'Critical'} overallComplexity
 * @property {string} estimatedDuration
 * @property {string[]} keyRisks
 * @property {string[]} primaryChallenges
 * @property {string[]} successFactors
 */

/**
 * @typedef {Object} BrandGuideline
 * @property {string} category
 * @property {string} requirement
 * @property {string} rationale
 * @property {'must' | 'should' | 'could'} complianceLevel
 */

/**
 * @typedef {Object} MarketAnalysisSection
 * @property {string} market
 * @property {string} complexity
 * @property {string[]} keyFindings
 * @property {number} adaptationScore
 * @property {string} competitivePosition
 */

/**
 * @typedef {Object} CulturalConsideration
 * @property {string} market
 * @property {string} aspect
 * @property {string} consideration
 * @property {'High' | 'Medium' | 'Low'} impact
 * @property {string} recommendation
 */

/**
 * @typedef {Object} RegulatoryRequirement
 * @property {string} market
 * @property {string} category
 * @property {string} requirement
 * @property {'required' | 'recommended' | 'optional'} compliance
 * @property {string} deadline
 */

/**
 * @typedef {Object} AdaptationSection
 * @property {string} market
 * @property {string[]} critical
 * @property {string[]} recommended
 * @property {string[]} optional
 * @property {'Low' | 'Medium' | 'High'} effort
 */

/**
 * @typedef {Object} QualityGate
 * @property {string} stage
 * @property {string[]} criteria
 * @property {string[]} stakeholders
 * @property {string} timeline
 */

/**
 * @typedef {Object} TimelineEstimate
 * @property {string} total
 * @property {Array<Object>} phases
 * @property {string} phases.phase
 * @property {string} phases.duration
 * @property {string[]} phases.deliverables
 */

/**
 * @typedef {Object} RiskAssessment
 * @property {'Low' | 'Medium' | 'High' | 'Critical'} overallRisk
 * @property {Array<Object>} risks
 * @property {string} risks.category
 * @property {string} risks.risk
 * @property {'Low' | 'Medium' | 'High'} risks.probability
 * @property {'Low' | 'Medium' | 'High'} risks.impact
 * @property {string} risks.mitigation
 */

/**
 * @typedef {Object} Appendix
 * @property {string} title
 * @property {string} content
 * @property {'glossary' | 'references' | 'templates' | 'checklists'} type
 */

/**
 * @typedef {Object} LocalizationBrief
 * @property {string} title
 * @property {string} assetName
 * @property {string[]} targetMarkets
 * @property {ExecutiveSummary} executiveSummary
 * @property {BrandGuideline[]} brandGuidelines
 * @property {MarketAnalysisSection[]} marketAnalysis
 * @property {CulturalConsideration[]} culturalConsiderations
 * @property {RegulatoryRequirement[]} regulatoryRequirements
 * @property {AdaptationSection[]} adaptationRoadmap
 * @property {QualityGate[]} qualityGates
 * @property {TimelineEstimate} timeline
 * @property {RiskAssessment} riskAssessment
 * @property {Appendix[]} appendices
 */

/**
 * @typedef {Object} ChecklistItem
 * @property {'messaging' | 'tone' | 'visual' | 'cultural' | 'regulatory'} category
 * @property {string} item
 * @property {string} description
 * @property {boolean} required
 * @property {boolean} completed
 * @property {string} [notes]
 */

/**
 * @typedef {Object} CulturalAdaptationChecklist
 * @property {string} market
 * @property {string} assetType
 * @property {ChecklistItem[]} checklistItems
 */

/**
 * @typedef {Object} TerminologyGuidance
 * @property {string} term
 * @property {string} preferredTranslation
 * @property {string} context
 * @property {string[]} alternatives
 * @property {string} [notes]
 */

/**
 * @typedef {Object} TranslationInstructions
 * @property {string} market
 * @property {string} languagePair
 * @property {string[]} generalInstructions
 * @property {TerminologyGuidance[]} terminology
 * @property {string[]} culturalNotes
 * @property {string[]} doNotTranslate
 * @property {string[]} qualityRequirements
 */


export class DocumentGenerationService {
  /**
   * Generates a comprehensive localization brief document.
   * @param {string} assetName
   * @param {MarketAnalysis[]} marketAnalyses
   * @param {ContentAdaptationRoadmap[]} adaptationRoadmaps
   * @param {BrandConsistencyResult} brandConsistency
   * @returns {Promise<LocalizationBrief>}
   */
  static async generateLocalizationBrief(
    assetName,
    marketAnalyses,
    adaptationRoadmaps,
    brandConsistency
  ) {
    const targetMarkets = marketAnalyses.map(analysis => analysis.marketCode);

    const executiveSummary = this.generateExecutiveSummary(marketAnalyses, adaptationRoadmaps);
    const brandGuidelines = this.generateBrandGuidelines(brandConsistency);
    const marketAnalysis = this.generateMarketAnalysisSection(marketAnalyses);
    const culturalConsiderations = this.generateCulturalConsiderations(marketAnalyses);
    const regulatoryRequirements = this.generateRegulatoryRequirements(marketAnalyses);
    const adaptationRoadmap = this.generateAdaptationSections(adaptationRoadmaps);
    const qualityGates = this.generateQualityGates();
    const timeline = this.generateTimeline(adaptationRoadmaps);
    const riskAssessment = this.generateRiskAssessment(marketAnalyses, adaptationRoadmaps);
    const appendices = this.generateAppendices(targetMarkets);

    return {
      title: `Localization Brief: ${assetName}`,
      assetName,
      targetMarkets,
      executiveSummary,
      brandGuidelines,
      marketAnalysis,
      culturalConsiderations,
      regulatoryRequirements,
      adaptationRoadmap,
      qualityGates,
      timeline,
      riskAssessment,
      appendices
    };
  }

  /**
   * Generates a market-specific cultural adaptation checklist.
   * @param {string} market
   * @param {string} assetType
   * @param {MarketAnalysis} marketAnalysis
   * @returns {CulturalAdaptationChecklist}
   */
  static generateCulturalAdaptationChecklist(
    market,
    assetType,
    marketAnalysis
  ) {
    /** @type {ChecklistItem[]} */
    const checklistItems = [];

    // Generate items based on market requirements
    marketAnalysis.marketSpecificRequirements.forEach(requirement => {
      checklistItems.push({
        category: requirement.category,
        item: requirement.requirement,
        description: requirement.culturalContext,
        required: requirement.priority === 'must',
        completed: false
      });
    });

    // Add market-specific standard checks
    if (market === 'JP') {
      checklistItems.push(
        {
          category: 'cultural',
          item: 'Verify respectful language usage throughout content',
          description: 'Ensure all content uses appropriate levels of formality and respect',
          required: true,
          completed: false
        },
        {
          category: 'visual',
          item: 'Check color symbolism and cultural appropriateness',
          description: 'Verify colors do not carry negative cultural connotations',
          required: true,
          completed: false
        },
        {
          category: 'messaging',
          item: 'Confirm harmony-focused messaging approach',
          description: 'Ensure messaging supports cultural values of wa (harmony)',
          required: false,
          completed: false
        }
      );
    } else if (market === 'CN') {
      checklistItems.push(
        {
          category: 'cultural',
          item: 'Verify innovation and advancement emphasis',
          description: 'Ensure content highlights scientific progress and modern approach',
          required: true,
          completed: false
        },
        {
          category: 'visual',
          item: 'Check for unlucky number and color associations',
          description: 'Avoid the number 4 and inappropriate color usage',
          required: true,
          completed: false
        },
        {
          category: 'messaging',
          item: 'Confirm traditional medicine compatibility',
          description: 'Ensure messaging respects traditional Chinese medicine practices',
          required: false,
          completed: false
        }
      );
    }

    return {
      market,
      assetType,
      checklistItems
    };
  }

  /**
   * Generates market-specific translation instructions.
   * @param {string} market
   * @param {MarketAnalysis} marketAnalysis
   * @returns {TranslationInstructions}
   */
  static generateTranslationInstructions(
    market,
    marketAnalysis
  ) {
    /** @type {Record<string, string>} */
    const marketNames = {
      'JP': 'Japanese',
      'CN': 'Chinese (Simplified)'
    };

    const generalInstructions = [
      'maintain brand consistency while adapting for local cultural context',
      'preserve the original intent and emotional tone of the message',
      'ensure regulatory compliance with local pharmaceutical advertising guidelines',
      'use culturally appropriate medical terminology and concepts'
    ];

    /** @type {TerminologyGuidance[]} */
    const terminology = [];
    /** @type {string[]} */
    const culturalNotes = [];
    const doNotTranslate = ['Brand name', 'Product name', 'Trademarked terms', 'Regulatory reference numbers'];
    const qualityRequirements = [
      'Native speaker review required',
      'Medical terminology validation',
      'Cultural appropriateness check',
      'Regulatory compliance review'
    ];

    if (market === 'JP') {
      terminology.push(
        {
          term: 'patient',
          preferredTranslation: '患者様',
          context: 'Use honorific form to show respect',
          alternatives: ['患者さん']
        },
        {
          term: 'treatment',
          preferredTranslation: '治療',
          context: 'Standard medical terminology',
          alternatives: ['療法', '処置']
        }
      );

      culturalNotes.push(
        'Use appropriate levels of formality and honorific language',
        'Emphasize safety and long-term benefits over quick results',
        'Consider the cultural preference for consensus and careful decision-making'
      );
    } else if (market === 'CN') {
      terminology.push(
        {
          term: 'patient',
          preferredTranslation: '患者',
          context: 'Standard medical terminology',
          alternatives: ['病人']
        },
        {
          term: 'treatment',
          preferredTranslation: '治疗',
          context: 'Simplified Chinese standard',
          alternatives: ['疗法']
        }
      );

      culturalNotes.push(
        'Emphasize scientific advancement and innovation',
        'Use confident, authoritative language supported by clinical evidence',
        'Consider the integration with traditional Chinese medicine concepts where appropriate'
      );
    }

    return {
      market,
      languagePair: `English → ${marketNames[market]}`,
      generalInstructions,
      terminology,
      culturalNotes,
      doNotTranslate,
      qualityRequirements
    };
  }

  /**
   * Exports a localization document to a PDF Blob (simulated for browser environment).
   * @param {LocalizationBrief | CulturalAdaptationChecklist | TranslationInstructions} document
   * @returns {Blob}
   */
  static exportToPDF(document) {
    // Generate PDF content based on document type
    let content = '';

    if ('executiveSummary' in document) {
      // Localization Brief
      content = this.formatLocalizationBriefForPDF(document);
    } else if ('checklistItems' in document) {
      // Cultural Adaptation Checklist
      content = this.formatChecklistForPDF(document);
    } else {
      // Translation Instructions
      content = this.formatTranslationInstructionsForPDF(document);
    }

    // Returns a Blob object simulating a PDF (using text content for simplicity)
    return new Blob([content], { type: 'application/pdf' });
  }

  /**
   * @private
   * @param {MarketAnalysis[]} marketAnalyses
   * @param {ContentAdaptationRoadmap[]} adaptationRoadmaps
   * @returns {ExecutiveSummary}
   */
  static generateExecutiveSummary(
    marketAnalyses,
    adaptationRoadmaps
  ) {
    const complexities = marketAnalyses.map(analysis => analysis.riskLevel);
    const overallComplexity = complexities.includes('Critical') ? 'Critical' :
      complexities.includes('High') ? 'High' :
        complexities.includes('Medium') ? 'Medium' : 'Low';

    const hasDelays = adaptationRoadmaps.some(roadmap => roadmap.timelineImpact !== 'no_delay');
    const estimatedDuration = hasDelays ? '4-6 weeks' : '2-3 weeks';

    const keyRisks = marketAnalyses
      .filter(analysis => analysis.riskLevel === 'High' || analysis.riskLevel === 'Critical')
      .map(analysis => `${analysis.marketName}: Cultural adaptation complexity`);

    const primaryChallenges = [
      'Regulatory compliance across multiple markets',
      'Cultural sensitivity in medical messaging',
      'Brand consistency while allowing local adaptation'
    ];

    const successFactors = [
      'Strong brand foundation and guidelines',
      'Experienced localization team',
      'Clear cultural adaptation strategy'
    ];

    return {
      overallComplexity,
      estimatedDuration,
      keyRisks,
      primaryChallenges,
      successFactors
    };
  }

  /**
   * @private
   * @param {BrandConsistencyResult} brandConsistency
   * @returns {BrandGuideline[]}
   */
  static generateBrandGuidelines(brandConsistency) {
    /** @type {BrandGuideline[]} */
    const guidelines = [
      {
        category: 'Messaging',
        requirement: 'Maintain core brand messages across all markets',
        rationale: 'Ensures global brand consistency and recognition',
        complianceLevel: 'must'
      },
      {
        category: 'Tone',
        requirement: 'Adapt tone appropriately for cultural context while maintaining brand personality',
        rationale: 'Balances brand authenticity with local cultural expectations',
        complianceLevel: 'must'
      },
      {
        category: 'Visual',
        requirement: 'Use approved brand colors and visual elements',
        rationale: 'Maintains visual brand recognition and consistency',
        complianceLevel: 'must'
      },
      {
        category: 'Regulatory',
        requirement: 'Include all required disclaimers and safety information',
        rationale: 'Ensures legal compliance and patient safety',
        complianceLevel: 'must'
      }
    ];

    // Add specific recommendations based on brand consistency results
    if (brandConsistency.messagingScore < 80) {
      guidelines.push({
        category: 'Messaging',
        requirement: 'Review and strengthen key message alignment',
        rationale: 'Current messaging score indicates need for improvement',
        complianceLevel: 'should'
      });
    }

    return guidelines;
  }

  /**
   * @private
   * @param {MarketAnalysis[]} marketAnalyses
   * @returns {MarketAnalysisSection[]}
   */
  static generateMarketAnalysisSection(marketAnalyses) {
    return marketAnalyses.map(analysis => ({
      market: analysis.marketName,
      complexity: analysis.complexity,
      keyFindings: [
        `Cultural adaptation score: ${analysis.culturalAdaptationScore}%`,
        `Risk level: ${analysis.riskLevel}`,
        `Competitive threat: ${analysis.competitivePositioning.competitiveThreat}`,
        `Market requirements: ${analysis.marketSpecificRequirements.length} identified`
      ],
      adaptationScore: analysis.culturalAdaptationScore,
      competitivePosition: analysis.competitivePositioning.marketPosition
    }));
  }

  /**
   * @private
   * @param {MarketAnalysis[]} marketAnalyses
   * @returns {CulturalConsideration[]}
   */
  static generateCulturalConsiderations(marketAnalyses) {
    /** @type {CulturalConsideration[]} */
    const considerations = [];

    marketAnalyses.forEach(analysis => {
      analysis.marketSpecificRequirements
        .filter(req => req.category === 'cultural')
        .forEach(req => {
          considerations.push({
            market: analysis.marketName,
            aspect: req.requirement,
            consideration: req.culturalContext,
            impact: req.priority === 'must' ? 'High' : req.priority === 'should' ? 'Medium' : 'Low',
            recommendation: `Implement ${req.adaptationLevel} adaptation to address this requirement`
          });
        });
    });

    return considerations;
  }

  /**
   * @private
   * @param {MarketAnalysis[]} marketAnalyses
   * @returns {RegulatoryRequirement[]}
   */
  static generateRegulatoryRequirements(marketAnalyses) {
    /** @type {RegulatoryRequirement[]} */
    const requirements = [];

    marketAnalyses.forEach(analysis => {
      analysis.marketSpecificRequirements
        .filter(req => req.category === 'regulatory')
        .forEach(req => {
          requirements.push({
            market: analysis.marketName,
            category: 'Pharmaceutical Compliance',
            requirement: req.requirement,
            compliance: req.priority === 'must' ? 'required' : 'recommended',
            deadline: 'Before market launch'
          });
        });
    });

    return requirements;
  }

  /**
   * @private
   * @param {ContentAdaptationRoadmap[]} adaptationRoadmaps
   * @returns {AdaptationSection[]}
   */
  static generateAdaptationSections(adaptationRoadmaps) {
    return adaptationRoadmaps.map(roadmap => ({
      market: roadmap.marketCode,
      critical: roadmap.criticalChanges.map(change => change.element),
      recommended: roadmap.recommendedChanges.map(change => change.element),
      optional: roadmap.optionalChanges.map(change => change.element),
      effort: roadmap.criticalChanges.some(c => c.effort === 'high') ? 'High' :
        roadmap.criticalChanges.some(c => c.effort === 'medium') ? 'Medium' : 'Low'
    }));
  }

  /**
   * @private
   * @returns {QualityGate[]}
   */
  static generateQualityGates() {
    /** @type {QualityGate[]} */
    return [
      {
        stage: 'Cultural Review',
        criteria: ['Cultural appropriateness validated', 'Local market feedback incorporated'],
        stakeholders: ['Cultural consultant', 'Local market team'],
        timeline: 'Week 1'
      },
      {
        stage: 'Regulatory Review',
        criteria: ['Regulatory compliance confirmed', 'Legal disclaimers approved'],
        stakeholders: ['Regulatory affairs', 'Legal team'],
        timeline: 'Week 2'
      },
      {
        stage: 'Brand Guardian Review',
        criteria: ['Brand consistency maintained', 'Key messages preserved'],
        stakeholders: ['Brand manager', 'Global marketing'],
        timeline: 'Week 3'
      }
    ];
  }

  /**
   * @private
   * @param {ContentAdaptationRoadmap[]} adaptationRoadmaps
   * @returns {TimelineEstimate}
   */
  static generateTimeline(adaptationRoadmaps) {
    const hasDelays = adaptationRoadmaps.some(roadmap => roadmap.timelineImpact !== 'no_delay');

    /** @type {TimelineEstimate} */
    return {
      total: hasDelays ? '4-6 weeks' : '2-3 weeks',
      phases: [
        {
          phase: 'Analysis & Planning',
          duration: '3-5 days',
          deliverables: ['Market analysis', 'Adaptation roadmap', 'Translation instructions']
        },
        {
          phase: 'Content Adaptation',
          duration: hasDelays ? '2-3 weeks' : '1-2 weeks',
          deliverables: ['Culturally adapted content', 'Regulatory compliance review']
        },
        {
          phase: 'Quality Assurance',
          duration: '1 week',
          deliverables: ['Cultural validation', 'Brand review', 'Final approval']
        }
      ]
    };
  }

  /**
   * @private
   * @param {MarketAnalysis[]} marketAnalyses
   * @param {ContentAdaptationRoadmap[]} adaptationRoadmaps
   * @returns {RiskAssessment}
   */
  static generateRiskAssessment(
    marketAnalyses,
    adaptationRoadmaps
  ) {
    const risks = [];
    const highRiskMarkets = marketAnalyses.filter(analysis =>
      analysis.riskLevel === 'High' || analysis.riskLevel === 'Critical'
    );

    if (highRiskMarkets.length > 0) {
      risks.push({
        category: 'Cultural Adaptation',
        risk: 'Complex cultural requirements may delay timeline',
        probability: /** @type {'Medium'} */ ('Medium'),
        impact: /** @type {'High'} */ ('High'),
        mitigation: 'Engage cultural consultants early and allow extra time for reviews'
      });
    }

    if (adaptationRoadmaps.some(roadmap => roadmap.timelineImpact === 'major_delay')) {
      risks.push({
        category: 'Timeline',
        risk: 'Major adaptations required may cause significant delays',
        probability: /** @type {'High'} */ ('High'),
        impact: /** @type {'High'} */ ('High'),
        mitigation: 'Prioritize critical changes and phase optional improvements'
      });
    }

    risks.push({
      category: 'Regulatory',
      risk: 'Regulatory requirements may change during localization process',
      probability: /** @type {'Low'} */ ('Low'),
      impact: /** @type {'High'} */ ('High'),
      mitigation: 'Maintain regular contact with regulatory teams and build in review checkpoints'
    });

    const overallRisk = risks.some(r => r.probability === 'High' && r.impact === 'High') ? 'High' : 'Medium';

    return {
      overallRisk,
      risks
    };
  }

  /**
   * @private
   * @param {string[]} targetMarkets
   * @returns {Appendix[]}
   */
  static generateAppendices(targetMarkets) {
    /** @type {Appendix[]} */
    return [
      {
        title: 'Cultural Terminology Glossary',
        content: 'Key cultural terms and concepts for target markets',
        type: 'glossary'
      },
      {
        title: 'Regulatory References',
        content: 'Links to relevant regulatory guidelines for each market',
        type: 'references'
      },
      {
        title: 'Translation Templates',
        content: 'Standardized templates for common content types',
        type: 'templates'
      },
      {
        title: 'Quality Assurance Checklists',
        content: 'Comprehensive QA checklists for each market',
        type: 'checklists'
      }
    ];
  }

  /**
   * @private
   * @param {LocalizationBrief} brief
   * @returns {string}
   */
  static formatLocalizationBriefForPDF(brief) {
    return `
LOCALIZATION BRIEF: ${brief.assetName.toUpperCase()}

EXECUTIVE SUMMARY
- Overall Complexity: ${brief.executiveSummary.overallComplexity}
- Estimated Duration: ${brief.executiveSummary.estimatedDuration}
- Target Markets: ${brief.targetMarkets.join(', ')}

KEY RISKS:
${brief.executiveSummary.keyRisks.map(risk => `• ${risk}`).join('\n')}

MARKET ANALYSIS:
${brief.marketAnalysis.map(market => `
${market.market}:
- Complexity: ${market.complexity}
- Adaptation Score: ${market.adaptationScore}%
- Position: ${market.competitivePosition}
`).join('\n')}

CULTURAL CONSIDERATIONS:
${brief.culturalConsiderations.map(consideration => `
${consideration.market} - ${consideration.aspect}:
${consideration.consideration}
Impact: ${consideration.impact}
Recommendation: ${consideration.recommendation}
`).join('\n')}

TIMELINE:
${brief.timeline.total} total
${brief.timeline.phases.map(phase => `
${phase.phase}: ${phase.duration}
- ${phase.deliverables.join('\n- ')}
`).join('\n')}
`;
  }

  /**
   * @private
   * @param {CulturalAdaptationChecklist} checklist
   * @returns {string}
   */
  static formatChecklistForPDF(checklist) {
    return `
CULTURAL ADAPTATION CHECKLIST
Market: ${checklist.market}
Asset Type: ${checklist.assetType}

REQUIRED ITEMS:
${checklist.checklistItems.filter(item => item.required).map(item => `
□ ${item.item}
  ${item.description}
`).join('\n')}

RECOMMENDED ITEMS:
${checklist.checklistItems.filter(item => !item.required).map(item => `
□ ${item.item}
  ${item.description}
`).join('\n')}
`;
  }

  /**
   * @private
   * @param {TranslationInstructions} instructions
   * @returns {string}
   */
  static formatTranslationInstructionsForPDF(instructions) {
    return `
TRANSLATION INSTRUCTIONS
Market: ${instructions.market}
Language Pair: ${instructions.languagePair}

GENERAL INSTRUCTIONS:
${instructions.generalInstructions.map(instruction => `• ${instruction}`).join('\n')}

TERMINOLOGY:
${instructions.terminology.map(term => `
${term.term} → ${term.preferredTranslation}
Context: ${term.context}
${term.alternatives?.length ? `Alternatives: ${term.alternatives.join(', ')}` : ''}
`).join('\n')}

CULTURAL NOTES:
${instructions.culturalNotes.map(note => `• ${note}`).join('\n')}

DO NOT TRANSLATE:
${instructions.doNotTranslate.map(item => `• ${item}`).join('\n')}

QUALITY REQUIREMENTS:
${instructions.qualityRequirements.map(req => `• ${req}`).join('\n')}
`;
  }
}