// Placeholder imports for external dependencies
// Assuming these types and helper functions are imported from other JS files
// import { isHCPAudience, isCaregiverAudience } from './utils/audienceTypeHelpers';

/**
 * @typedef {object} BrandProfile
 * @property {string} brand_name
 * // ... other brand fields
 */

/**
 * @typedef {object} BrandGuidelines
 * @property {object} [messaging_framework]
 * @property {string} [messaging_framework.core_message]
 * @property {string[]} [messaging_framework.key_messages]
 * @property {string[]} [messaging_framework.differentiators]
 * // ... other guidelines fields
 */

/**
 * @typedef {'A-Fib' | 'VTE-Prevention' | 'Stroke-Prevention' | 'Heart-Failure' | 'Cardiovascular-Death-Reduction' | 'IPF' | 'SSc-ILD' | 'Progressive-Fibrosing-ILD' | 'Type-2-Diabetes' | 'NSCLC' | 'EGFR-Mutated-NSCLC' | 'Colorectal-Cancer' | 'Head-Neck-Cancer' | 'Atopic-Dermatitis' | 'Asthma' | 'Chronic-Rhinosinusitis' | 'HIV-Treatment' | 'HIV-Prevention' | 'HIV-PrEP'} Indication
 */

/**
 * @typedef {'Patient' | 'HCP-General' | 'HCP-Specialist' | 'Caregiver-General' | 'Caregiver-Pediatric' | 'General-Public'} AudienceType
 */

/**
 * @typedef {object} MessageSuggestion
 * @property {string} id
 * @property {string} text
 * @property {string} rationale
 * @property {number} confidence
 */

/**
 * @typedef {object} CTASuggestion
 * @property {string} id
 * @property {string} text
 * @property {string} rationale
 * @property {number} confidence
 */

/**
 * @typedef {object} SuggestionContext
 * @property {BrandProfile} brand
 * @property {BrandGuidelines} guidelines
 * @property {Indication} indication
 * @property {AudienceType} audience
 * @property {string} [objective]
 */

// Helper functions (assuming these are defined in a separate file, mocked here for completeness)
const isHCPAudience = (audience) => audience.includes('HCP');
const isCaregiverAudience = (audience) => audience.includes('Caregiver');

export class BrandMessageService {
  /**
   * Generate key message suggestions based on brand profile and context
   * @param {SuggestionContext} context
   * @returns {Promise<MessageSuggestion[]>}
   */
  static async generateKeyMessageSuggestions(context) {
    const { brand, guidelines, indication, audience, objective } = context;
    
    console.log('🎯 Generating key message suggestions:', {
      brand: brand.brand_name,
      indication,
      audience,
      objective,
      isCaregiverAudience: isCaregiverAudience(audience),
      coreMessage: guidelines?.messaging_framework?.core_message
    });
    
    /** @type {MessageSuggestion[]} */
    const suggestions = [];

    // Suggestion 1: Adapt core message to context
    const coreMessage = guidelines?.messaging_framework?.core_message;
    if (coreMessage) {
      const adapted = this.adaptCoreMessage(coreMessage, indication, audience);
      suggestions.push({
        id: 'core-adapted',
        text: adapted,
        rationale: `Adapted from core brand message: "${coreMessage}"`,
        confidence: 0.9
      });
    }

    // Suggestion 2: Indication-specific message
    const indicationMessage = this.generateIndicationMessage(brand.brand_name, indication, audience);
    suggestions.push({
      id: 'indication-specific',
      text: indicationMessage,
      rationale: `Tailored message for ${indication} patients addressing ${audience} audience`,
      confidence: 0.85
    });

    // Suggestion 3: Objective-driven message
    if (objective) {
      const objectiveMessage = this.generateObjectiveMessage(brand.brand_name, indication, audience, objective);
      suggestions.push({
        id: 'objective-driven',
        text: objectiveMessage,
        rationale: `Aligned with campaign objective: ${objective}`,
        confidence: 0.8
      });
    }

    // Suggestion 4: Differentiator-based message
    const differentiators = guidelines?.messaging_framework?.differentiators;
    if (differentiators && differentiators.length > 0) {
      const differentiator = differentiators[0];
      const diffMessage = this.generateDifferentiatorMessage(brand.brand_name, indication, audience, differentiator);
      suggestions.push({
        id: 'differentiator-based',
        text: diffMessage,
        rationale: `Highlights key differentiator: ${differentiator}`,
        confidence: 0.82
      });
    }

    return suggestions.slice(0, 4);
  }

  /**
   * Generate CTA suggestions based on context
   * @param {SuggestionContext} context
   * @returns {Promise<CTASuggestion[]>}
   */
  static async generateCTASuggestions(context) {
    const { brand, indication, audience, objective } = context;
    
    /** @type {CTASuggestion[]} */
    const suggestions = [];

    // Objective-driven CTAs
    if (objective) {
      const objectiveMap = {
        'awareness': [
          `Learn more about ${brand.brand_name}`,
          `Discover ${brand.brand_name} benefits`,
          `Explore ${brand.brand_name} information`
        ],
        'education': [
          `Access educational resources`,
          `Download patient guide`,
          `View clinical information`
        ],
        'engagement': [
          `Contact your ${brand.brand_name} representative`,
          `Request more information`,
          `Schedule a consultation`
        ],
        'conversion': [
          `Talk to your doctor about ${brand.brand_name}`,
          `Request a prescription`,
          `Get started with ${brand.brand_name}`
        ]
      };

      const matchedObjective = Object.keys(objectiveMap).find(key => 
        objective.toLowerCase().includes(key)
      );

      if (matchedObjective) {
        const ctas = objectiveMap[matchedObjective];
        ctas.forEach((cta, index) => {
          if (suggestions.length < 4) {
            suggestions.push({
              id: `objective-${index}`,
              text: cta,
              rationale: `Aligned with ${objective} objective`,
              confidence: 0.88
            });
          }
        });
      }
    }

    // Audience-specific CTAs - using helper functions instead of direct mapping
    /**
     * @param {AudienceType} audienceType
     * @returns {string[]}
     */
    const getAudienceCTAs = (audienceType) => {
      if (isHCPAudience(audienceType)) {
        return [
          `Access clinical evidence and resources`,
          `Request prescriber information`,
          `Schedule medical affairs consultation`
        ];
      } else if (audienceType === 'Patient') {
        return [
          `Talk to your doctor about ${brand.brand_name}`,
          `Find patient support resources`,
          `Download patient guide`
        ];
      } else if (isCaregiverAudience(audienceType)) {
        return [
          `Learn how to support your loved one`,
          `Access caregiver resources`,
          `Connect with support networks`
        ];
      } else {
        return [
          `Learn more about ${brand.brand_name}`,
          `Get more information`,
          `Contact us`
        ];
      }
    };

    const audienceCTAs = getAudienceCTAs(audience);
    audienceCTAs.forEach((cta, index) => {
      if (suggestions.length < 4) {
        suggestions.push({
          id: `audience-${index}`,
          text: cta,
          rationale: `Tailored for ${audience} audience`,
          confidence: 0.85
        });
      }
    });

    return suggestions.slice(0, 4);
  }

  /**
   * @private
   * @param {string} coreMessage
   * @param {Indication} indication
   * @param {AudienceType} audience
   * @returns {string}
   */
  static adaptCoreMessage(coreMessage, indication, audience) {
    // Simple adaptation logic - in production this could be more sophisticated
    let adapted = coreMessage;
    
    // Add indication context
    if (!adapted.toLowerCase().includes(indication.toLowerCase())) {
      adapted = adapted.replace(/patients?/i, `${indication} patients`);
    }

    // Adjust for audience using helper functions
    if (isHCPAudience(audience)) {
      adapted = adapted.replace(/you/gi, 'your patients');
    } else if (audience === 'Patient') {
      adapted = adapted.replace(/patients?/gi, 'you');
    } else if (isCaregiverAudience(audience)) {
      // Transform patient-focused language to caregiver-focused with robust regex
      adapted = adapted
        .replace(/(helps? |help |helping )(people|patients)( with [a-zA-Z\-]+)?/gi, 
          (match, helpWord, peopleWord, withCondition) => {
            return `help you support those living${withCondition || ''}`;
          })
        .replace(/(people|patients)( with [a-zA-Z\-]+)/gi, 'your loved one$2')
        .replace(/\bget to undetectable\b/gi, 'achieve an undetectable viral load')
        .replace(/\bstay undetectable\b/gi, 'maintain health')
        .replace(/\btreatment\b/gi, 'treatment journey');
      
      // Clean up grammar issues from replacements
      adapted = adapted
        .replace(/that help you support/gi, 'to help you support')
        .replace(/treatment journey that/gi, 'treatment journey to');
      
      // If message still doesn't address caregivers properly, add framing
      if (!adapted.toLowerCase().includes('your loved one') && 
          !adapted.toLowerCase().includes('support')) {
        adapted = `Supporting your loved one: ${adapted}`;
      }
    }

    return adapted;
  }

  /**
   * @private
   * @param {string} brandName
   * @param {Indication} indication
   * @param {AudienceType} audience
   * @returns {string}
   */
  static generateIndicationMessage(brandName, indication, audience) {
    /**
     * @param {Indication} ind
     * @returns {{ hcp: string; patient: string; caregiver: string; other: string }}
     */
    const getMessageForIndication = (ind) => {
      const templates = {
        'A-Fib': {
          hcp: `Help your A-Fib patients reduce stroke risk with proven ${brandName} therapy`,
          patient: `Take control of your A-Fib journey with trusted ${brandName} protection`,
          caregiver: `Support your loved one's A-Fib management with ${brandName}`,
          other: `${brandName} - Proven protection for A-Fib patients`
        },
        'VTE-Prevention': {
          hcp: `Reduce VTE risk in your patients with reliable ${brandName} therapy`,
          patient: `Protect yourself from blood clots with ${brandName}`,
          caregiver: `Help prevent dangerous blood clots with ${brandName} therapy`,
          other: `${brandName} - Effective VTE prevention therapy`
        },
        'Stroke-Prevention': {
          hcp: `Protect your patients from stroke with ${brandName}`,
          patient: `Reduce your stroke risk with ${brandName}`,
          caregiver: `Help protect your loved one from stroke with ${brandName}`,
          other: `${brandName} - Proven stroke prevention`
        },
        'Heart-Failure': {
          hcp: `Improve heart failure outcomes with ${brandName}`,
          patient: `Manage your heart failure with ${brandName}`,
          caregiver: `Support heart failure care with ${brandName}`,
          other: `${brandName} - Heart failure management`
        },
        'Cardiovascular-Death-Reduction': {
          hcp: `Reduce cardiovascular risk with ${brandName}`,
          patient: `Protect your heart with ${brandName}`,
          caregiver: `Support heart health with ${brandName}`,
          other: `${brandName} - Cardiovascular protection`
        },
        'IPF': {
          hcp: `Slow IPF progression with proven ${brandName} therapy`,
          patient: `Take control of your IPF journey with ${brandName}`,
          caregiver: `Support your loved one's IPF management with ${brandName}`,
          other: `${brandName} - Proven therapy for IPF patients`
        },
        'SSc-ILD': {
          hcp: `Manage SSc-ILD progression with ${brandName}`,
          patient: `Take control of your SSc-ILD with ${brandName}`,
          caregiver: `Support your loved one's SSc-ILD journey with ${brandName}`,
          other: `${brandName} - Advanced SSc-ILD therapy`
        },
        'Progressive-Fibrosing-ILD': {
          hcp: `Slow fibrosing ILD progression with ${brandName}`,
          patient: `Manage your fibrosing ILD with ${brandName}`,
          caregiver: `Support fibrosing ILD management with ${brandName}`,
          other: `${brandName} - Fibrosing ILD therapy`
        },
        'Type-2-Diabetes': {
          hcp: `Optimize your patients' diabetes management with ${brandName}`,
          patient: `Take control of your diabetes with ${brandName}`,
          caregiver: `Support diabetes management with ${brandName}`,
          other: `${brandName} - Advanced diabetes care`
        },
        'NSCLC': {
          hcp: `Target EGFR mutations in your NSCLC patients with precision ${brandName} therapy`,
          patient: `Fight your lung cancer with targeted ${brandName} treatment`,
          caregiver: `Support your loved one's lung cancer journey with ${brandName}`,
          other: `${brandName} - Precision therapy for NSCLC patients`
        },
        'EGFR-Mutated-NSCLC': {
          hcp: `Deliver targeted precision for your EGFR+ NSCLC patients with ${brandName}`,
          patient: `Target your specific lung cancer mutation with ${brandName}`,
          caregiver: `Support personalized lung cancer treatment with ${brandName}`,
          other: `${brandName} - Targeted therapy for EGFR+ NSCLC`
        },
        'Colorectal-Cancer': {
          hcp: `Target EGFR-positive colorectal tumors in RAS wild-type patients with ${brandName}`,
          patient: `Fight your colorectal cancer with targeted ${brandName} therapy`,
          caregiver: `Support your loved one's colorectal cancer treatment with ${brandName}`,
          other: `${brandName} - Targeted therapy for colorectal cancer`
        },
        'Head-Neck-Cancer': {
          hcp: `Treat head and neck cancer patients with targeted ${brandName} therapy`,
          patient: `Fight your head and neck cancer with ${brandName}`,
          caregiver: `Support your loved one's head and neck cancer journey with ${brandName}`,
          other: `${brandName} - Targeted therapy for head and neck cancer`
        },
        'Atopic-Dermatitis': {
          hcp: `Help your patients achieve clear skin with targeted ${brandName} therapy for moderate-to-severe atopic dermatitis`,
          patient: `Take control of your eczema with ${brandName} - proven relief for moderate-to-severe atopic dermatitis`,
          caregiver: `Support your loved one's journey to clearer skin with ${brandName}`,
          other: `${brandName} - Proven treatment for moderate-to-severe atopic dermatitis`
        },
        'Asthma': {
          hcp: `Achieve better asthma control in your moderate-to-severe patients with ${brandName}`,
          patient: `Breathe easier with ${brandName} - targeted treatment for moderate-to-severe asthma`,
          caregiver: `Support your loved one's asthma management with ${brandName}`,
          other: `${brandName} - Advanced therapy for moderate-to-severe asthma`
        },
        'Chronic-Rhinosinusitis': {
          hcp: `Treat chronic rhinosinusitis with nasal polyps effectively with ${brandName}`,
          patient: `Find relief from chronic sinus problems with ${brandName}`,
          caregiver: `Support your loved one's sinus health with ${brandName}`,
          other: `${brandName} - Targeted treatment for chronic rhinosinusitis with nasal polyps`
        },
        'HIV-Treatment': {
          hcp: `Help your patients with HIV achieve and maintain undetectable viral loads with proven ${brandName} therapy`,
          patient: `Take control of your HIV treatment journey with trusted ${brandName} - proven 1-pill, once-daily therapy`,
          caregiver: `Support your loved one's HIV treatment journey with proven ${brandName} - helping them stay healthy and undetectable`,
          other: `${brandName} - Complete HIV treatment`
        },
        'HIV-Prevention': {
          hcp: `Protect your at-risk patients with proven ${brandName} PrEP therapy`,
          patient: `Stay protected with ${brandName} PrEP - proven HIV prevention`,
          caregiver: `Help protect your loved one with proven ${brandName} PrEP therapy`,
          other: `${brandName} - HIV prevention therapy`
        },
        'HIV-PrEP': {
          hcp: `Offer your at-risk patients effective HIV prevention with ${brandName} PrEP`,
          patient: `Protect yourself from HIV with ${brandName} PrEP - proven prevention`,
          caregiver: `Support your loved one's HIV prevention with proven ${brandName} PrEP therapy`,
          other: `${brandName} - PrEP for HIV prevention`
        }
      };

      return templates[ind] || {
        hcp: `${brandName} - Supporting ${ind} patients`,
        patient: `${brandName} - Your partner in ${ind} management`,
        caregiver: `${brandName} - Supporting care for ${ind}`,
        other: `${brandName} - ${ind} therapy`
      };
    };

    const messages = getMessageForIndication(indication);
    
    if (isHCPAudience(audience)) {
      return messages.hcp;
    } else if (audience === 'Patient') {
      return messages.patient;
    } else if (isCaregiverAudience(audience)) {
      return messages.caregiver;
    } else {
      return messages.other;
    }
  }

  /**
   * @private
   * @param {string} brandName
   * @param {Indication} indication
   * @param {AudienceType} audience
   * @param {string} objective
   * @returns {string}
   */
  static generateObjectiveMessage(brandName, indication, audience, objective) {
    if (objective.includes('awareness')) {
      if (isHCPAudience(audience)) {
        return `Discover how ${brandName} can benefit your ${indication} patients`;
      } else if (isCaregiverAudience(audience)) {
        return `Learn how ${brandName} can support your loved one's ${indication} journey`;
      } else {
        return `Learn how ${brandName} could help with your ${indication} management`;
      }
    }
    
    if (objective.includes('education')) {
      if (isHCPAudience(audience)) {
        return `Enhance your ${indication} treatment approach with ${brandName} insights`;
      } else if (isCaregiverAudience(audience)) {
        return `Understand how ${brandName} can help you support your loved one with ${indication}`;
      } else {
        return `Better understand your ${indication} treatment options with ${brandName}`;
      }
    }
    
    return `${brandName} - Your partner in ${indication} care`;
  }

  /**
   * @private
   * @param {string} brandName
   * @param {Indication} indication
   * @param {AudienceType} audience
   * @param {string} differentiator
   * @returns {string}
   */
  static generateDifferentiatorMessage(brandName, indication, audience, differentiator) {
    const audiencePrefix = isHCPAudience(audience) ? 'Offer your patients' : 'Experience';
    return `${audiencePrefix} ${differentiator.toLowerCase()} with ${brandName} for ${indication}`;
  }
}