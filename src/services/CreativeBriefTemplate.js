/**
 * @typedef {Object} LocalizationProject
 * @property {string} project_name - The name of the localization project.
 * @property {string} project_type - The type of content (e.g., "Marketing Material", "Clinical Document").
 * @property {string} brand_id - The ID of the brand.
 * @property {string[]} target_languages - An array of target language codes (e.g., ['es', 'fr']).
 */

/**
 * @typedef {Object} HandoffPackage
 * @property {Object} creativeBrief - Details about the project's creative direction.
 * @property {Object} brandGuidelines - Core brand and terminology rules.
 * @property {Object} culturalGuide - Insights for local market adaptation.
 * @property {Object} compliance - Regulatory and risk mitigation guidelines.
 * @property {Object} qaChecklist - Comprehensive quality assurance items.
 */

/**
 * Creative Brief Template Service
 * Generates comprehensive handoff packages using project context, brand guidelines, and market intelligence
 */
export class CreativeBriefTemplate {

  /**
   * Generate complete handoff package for localization agencies
   * @param {LocalizationProject} project
   * @param {string} targetLanguage
   * @returns {Promise<HandoffPackage>}
   */
  static async generateHandoffPackage(
    project,
    targetLanguage
  ) {

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    const marketData = CreativeBriefTemplate.getMarketData(targetLanguage);
    const brandContext = CreativeBriefTemplate.extractBrandContext(project);
    const complianceRequirements = CreativeBriefTemplate.getComplianceRequirements(targetLanguage, project.project_type);

    return {
      creativeBrief: CreativeBriefTemplate.generateCreativeBrief(project, marketData, brandContext),
      brandGuidelines: CreativeBriefTemplate.generateBrandGuidelines(brandContext),
      culturalGuide: CreativeBriefTemplate.generateCulturalGuide(targetLanguage, marketData),
      compliance: CreativeBriefTemplate.generateComplianceGuidelines(complianceRequirements, targetLanguage),
      qaChecklist: CreativeBriefTemplate.generateQAChecklist(project, targetLanguage)
    };
  }

  /**
   * Generate creative brief section
   * @private
   * @param {LocalizationProject} project
   * @param {Object} marketData
   * @param {Object} brandContext
   * @returns {Object}
   */
  static generateCreativeBrief(
    project,
    marketData,
    brandContext
  ) {
    const projectOverview = `
      Project: ${project.project_name}
      Content Type: ${project.project_type}
      Source Language: EN
      Target Markets: ${project.target_languages?.map(l => l.toUpperCase()).join(', ')}

      This ${project.project_type} project aims to expand market reach through culturally adapted localization
      that maintains brand consistency while resonating with local audiences.
    `.trim();

    const targetAudience = marketData.targetAudience || `
      Primary: Healthcare professionals and medical decision-makers
      Secondary: Patients seeking treatment information
      Demographics: Ages 25-65, educated professionals with healthcare decision-making authority
      Psychographics: Value evidence-based medicine, prioritize patient safety and treatment efficacy
    `.trim();

    const keyMessages = [
      'Emphasize clinical efficacy and safety profile',
      'Highlight unique therapeutic benefits',
      'Maintain professional, trustworthy tone',
      'Ensure regulatory compliance in all communications',
      'Adapt cultural references while preserving medical accuracy'
    ];

    const toneAndVoice = `
      Professional yet accessible, authoritative but not intimidating.
      Clinical precision balanced with human empathy.
      Culturally respectful and locally relevant while maintaining global brand consistency.
    `.trim();

    const fullText = `
      CREATIVE BRIEF

      ${projectOverview}

      TARGET AUDIENCE
      ${targetAudience}

      KEY MESSAGES
      ${keyMessages.map(msg => `• ${msg}`).join('\n')}

      TONE & VOICE
      ${toneAndVoice}
    `;

    return {
      projectOverview,
      targetAudience,
      keyMessages,
      toneAndVoice,
      fullText
    };
  }

  /**
   * Generate brand guidelines section
   * @private
   * @param {Object} brandContext
   * @returns {Object}
   */
  static generateBrandGuidelines(brandContext) {
    return {
      voiceAttributes: [
        { name: 'Professional', level: 'High' },
        { name: 'Trustworthy', level: 'High' },
        { name: 'Empathetic', level: 'Medium' },
        { name: 'Innovative', level: 'Medium' },
        { name: 'Accessible', level: 'Medium' }
      ],
      terminology: [
        { term: 'Patient', guideline: 'Always use "patient" not "subject" in patient-facing materials' },
        { term: 'Healthcare Provider', guideline: 'Preferred over "doctor" for inclusive language' },
        { term: 'Treatment', guideline: 'Use instead of "therapy" for consistency' },
        { term: 'Clinical Trial', guideline: 'Never abbreviate as "trial" alone' },
        { term: 'Side Effect', guideline: 'Use "side effect" not "adverse event" in patient materials' }
      ],
      dos: [
        'Use active voice when possible',
        'Maintain consistent terminology throughout',
        'Include appropriate disclaimers and safety information',
        'Adapt cultural references appropriately',
        'Ensure accessibility compliance'
      ],
      donts: [
        'Never alter dosage or safety information',
        'Avoid colloquialisms that may not translate',
        'Don\'t make comparative claims without substantiation',
        'Never omit required regulatory statements',
        'Avoid cultural stereotypes or assumptions'
      ]
    };
  }

  /**
   * Generate cultural adaptation guide
   * @private
   * @param {string} targetLanguage
   * @param {Object} marketData
   * @returns {Object}
   */
  static generateCulturalGuide(targetLanguage, marketData) {
    const culturalData = CreativeBriefTemplate.getCulturalData(targetLanguage);

    return {
      marketInsights: [
        {
          category: 'Healthcare System',
          description: culturalData.healthcareSystem || 'Mixed public-private healthcare system with emphasis on preventive care'
        },
        {
          category: 'Communication Style',
          description: culturalData.communicationStyle || 'Direct but respectful communication preferred in professional settings'
        },
        {
          category: 'Decision Making',
          description: culturalData.decisionMaking || 'Collaborative approach with family involvement in healthcare decisions'
        }
      ],
      communicationPreferences: culturalData.preferences || [
        'Prefer detailed information over brief summaries',
        'Value peer recommendations and expert opinions',
        'Appreciate visual aids and clear data presentations',
        'Expect professional but warm communication tone'
      ],
      sensitivities: culturalData.sensitivities || [
        {
          category: 'Religious Considerations',
          guidance: 'Be aware of religious holidays and dietary restrictions that may affect treatment timing'
        },
        {
          category: 'Age and Authority',
          guidance: 'Show appropriate respect for age and professional hierarchy in communications'
        },
        {
          category: 'Privacy Concerns',
          guidance: 'Emphasize confidentiality and data protection more explicitly than in other markets'
        }
      ]
    };
  }

  /**
   * Generate compliance guidelines
   * @private
   * @param {Object} requirements
   * @param {string} targetLanguage
   * @returns {Object}
   */
  static generateComplianceGuidelines(requirements, targetLanguage) {
    return {
      requirements: requirements.regulations || [
        {
          regulation: 'Local Medical Device Regulation',
          requirement: 'All claims must be substantiated with local regulatory approval documentation'
        },
        {
          regulation: 'Advertising Standards',
          requirement: 'Healthcare advertising must include specific disclaimers and limitations'
        },
        {
          regulation: 'Data Privacy Laws',
          requirement: 'Patient data handling must comply with local privacy regulations'
        }
      ],
      checklist: [
        'Verify all medical claims against local regulations',
        'Ensure proper disclaimer placement and visibility',
        'Confirm dosage information matches approved labeling',
        'Validate safety information completeness',
        'Check cultural appropriateness of imagery and examples',
        'Review accessibility compliance for all formats'
      ],
      riskMitigation: [
        {
          level: 'High',
          category: 'Medical Claims',
          mitigation: 'All efficacy statements must be pre-approved by local medical affairs team'
        },
        {
          level: 'Medium',
          category: 'Cultural Adaptation',
          mitigation: 'Use local cultural consultants to review final translations'
        },
        {
          level: 'Medium',
          category: 'Regulatory Changes',
          mitigation: 'Monitor regulatory updates and adjust content accordingly'
        }
      ]
    };
  }

  /**
   * Generate QA checklist
   * @private
   * @param {LocalizationProject} project
   * @param {string} targetLanguage
   * @returns {Object}
   */
  static generateQAChecklist(project, targetLanguage) {
    return {
      categories: [
        {
          name: 'Linguistic Quality',
          icon: '🔤',
          items: [
            'Grammar and syntax accuracy',
            'Terminology consistency',
            'Cultural appropriateness',
            'Readability and flow',
            'Spelling and punctuation'
          ]
        },
        {
          name: 'Medical Accuracy',
          icon: '⚕️',
          items: [
            'Clinical terminology validation',
            'Dosage information accuracy',
            'Safety statement completeness',
            'Contraindication clarity',
            'Medical disclaimer inclusion'
          ]
        },
        {
          name: 'Brand Consistency',
          icon: '🎯',
          items: [
            'Brand voice alignment',
            'Visual identity compliance',
            'Messaging consistency',
            'Tone appropriateness',
            'Brand guideline adherence'
          ]
        },
        {
          name: 'Regulatory Compliance',
          icon: '📋',
          items: [
            'Required disclaimer inclusion',
            'Regulatory statement accuracy',
            'Approval reference validation',
            'Local law compliance',
            'Industry standard adherence'
          ]
        },
        {
          name: 'Technical Quality',
          icon: '⚙️',
          items: [
            'Format consistency',
            'Layout preservation',
            'Link functionality',
            'Image quality',
            'Accessibility compliance'
          ]
        }
      ]
    };
  }

  /**
   * Get market-specific data
   * @private
   * @param {string} language
   * @returns {Object}
   */
  static getMarketData(language) {
    const marketData = {
      'es': {
        targetAudience: 'Médicos especialistas y profesionales sanitarios con autoridad en decisiones terapéuticas',
        healthcareSystem: 'Sistema sanitario mixto con fuerte componente público y creciente sector privado',
        communicationStyle: 'Comunicación directa pero respetuosa, valorando la jerarquía profesional'
      },
      'fr': {
        targetAudience: 'Professionnels de santé et décideurs médicaux dans le système de santé français',
        healthcareSystem: 'Système de santé public universel avec remboursement de la sécurité sociale',
        communicationStyle: 'Communication formelle et structurée, respectant les protocoles professionnels'
      }
    };

    return marketData[language] || marketData['es'];
  }

  /**
   * Get cultural data for specific markets
   * @private
   * @param {string} language
   * @returns {Object}
   */
  static getCulturalData(language) {
    const culturalData = {
      'es': {
        healthcareSystem: 'Sistema sanitario universal con acceso equitativo y enfoque en atención primaria',
        communicationStyle: 'Comunicación cálida pero profesional, valorando las relaciones personales',
        decisionMaking: 'Enfoque colaborativo con participación familiar en decisiones importantes de salud',
        preferences: [
          'Prefieren información detallada y explicaciones completas',
          'Valoran las recomendaciones de colegas y expertos reconocidos',
          'Aprecian el contacto personal y la construcción de relaciones',
          'Esperan comunicación respetuosa y considerada culturalmente'
        ],
        sensitivities: [
          {
            category: 'Consideraciones Familiares',
            guidance: 'La familia puede estar muy involucrada en las decisiones de tratamiento'
          },
          {
            category: 'Aspectos Religiosos',
            guidance: 'Considerar festividades religiosas y creencias que puedan afectar el tratamiento'
          }
        ]
      }
    };

    return culturalData[language] || culturalData['es'];
  }

  /**
   * Extract brand context from project
   * @private
   * @param {LocalizationProject} project
   * @returns {Object}
   */
  static extractBrandContext(project) {
    return {
      brandName: project.brand_id || 'Brand',
      contentType: project.project_type,
      therapeutic_area: 'Pharmaceutical',
      tone: 'Professional, trustworthy, empathetic'
    };
  }

  /**
   * Get compliance requirements by market and content type
   * @private
   * @param {string} language
   * @param {string} contentType
   * @returns {Object}
   */
  static getComplianceRequirements(language, contentType) {
    const requirements = {
      'es': {
        regulations: [
          {
            regulation: 'Ley de Medicamentos y Productos Sanitarios',
            requirement: 'Toda comunicación debe incluir información de seguridad y contraindicaciones'
          },
          {
            regulation: 'Código de Publicidad Sanitaria',
            requirement: 'Las afirmaciones médicas requieren evidencia científica documentada'
          }
        ]
      },
      'fr': {
        regulations: [
          {
            regulation: 'Code de la Santé Publique',
            requirement: 'La publicité médicale doit respecter les autorisations AMM'
          },
          {
            regulation: 'ANSM Guidelines',
            requirement: 'Toute communication doit inclure les mentions légales obligatoires'
          }
        ]
      }
    };

    return requirements[language] || requirements['es'];
  }
}