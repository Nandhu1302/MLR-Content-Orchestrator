/**
 * Asset-Type Content Formatter
 * Transforms raw content into properly structured, asset-type-specific formats
 */

// Define a placeholder type for FormattedContent for readability
// In pure JS, this would be documented via JSDoc or assumed structural compatibility.
// Assuming this is a standard object containing all generated fields.


export class AssetTypeContentFormatter {
  /**
   * Format content based on asset type
   */
  static format(assetType, context) { // Removed type annotation : FormattedContent
    const normalizedType = this.normalizeAssetType(assetType);
    
    switch (normalizedType) {
      case 'email':
        return this.formatEmail(context);
      case 'social':
        return this.formatSocial(context);
      case 'web':
        return this.formatWeb(context);
      case 'sales-aid':
        return this.formatSalesAid(context);
      case 'rep-email':
        return this.formatRepEmail(context);
      default: // Added colon for default case
        return this.formatGeneric(context);
    }
  }

  static normalizeAssetType(assetType) { // Removed type annotation : string
    const typeMap = { // Removed type annotation <string, string>
      'mass-email': 'email',
      'patient-email': 'email',
      'email': 'email',
      'rep-triggered-email': 'rep-email',
      'rte': 'rep-email',
      'social-media-post': 'social',
      'social': 'social',
      'website-landing-page': 'web',
      'landing-page': 'web',
      'web': 'web',
      'digital-sales-aid': 'sales-aid',
      'dsa': 'sales-aid',
      'sales-presentation': 'sales-aid',
      'slide': 'sales-aid',
    };
    return typeMap[assetType] || 'generic';
  }

  /**
   * Format content for HCP/Patient Email
   */
  static formatEmail(context) { // Removed type annotation : FormattedContent
    const { 
      coreMessage, 
      therapeuticFocus, 
      targetAudience, 
      keyBenefits = [], 
      clinicalPositioning,
      callToAction,
      brandName
    } = context;

    // Determine if patient-facing
    const isPatient = targetAudience?.toLowerCase().includes('patient') || 
                      targetAudience?.toLowerCase().includes('caregiver');

    // Subject line - compelling, under 50 chars
    const subject = this.generateSubject(coreMessage, therapeuticFocus, isPatient);
    
    // Preheader - extends subject, under 100 chars
    const preheader = this.generatePreheader(keyBenefits, clinicalPositioning, isPatient);
    
    // Headline - primary message
    const headline = coreMessage || 'Advancing ' + (therapeuticFocus || 'Treatment') + ' Care';
    
    // Body - structured with paragraphs, bullets, and clear sections
    const body = this.generateEmailBody(context, isPatient);
    
    // CTA - action-oriented
    const cta = callToAction || (isPatient ? 'Talk to Your Doctor' : 'Learn More'); // Corrected ternary shorthand
    
    // Disclaimer - regulatory compliant
    const disclaimer = this.generateDisclaimer(isPatient, therapeuticFocus, brandName);

    return {
      subject,
      preheader,
      headline,
      body,
      keyMessage: coreMessage, // Added keyMessage field
      cta,
      disclaimer,
      unsubscribe: 'Click here to manage your email preferences or unsubscribe.'
    };
  }

  static generateSubject(coreMessage, therapeuticFocus, isPatient) { // Removed type annotation : string
    if (isPatient) {
      if (coreMessage && coreMessage.length <= 50) return coreMessage;
      return 'Understanding Your ' + (therapeuticFocus || 'Treatment') + ' Options';
    }
    
    if (coreMessage) {
      // Corrected ternary shorthand
      return coreMessage.length <= 50 ? coreMessage : coreMessage.substring(0, 47) + '...'; 
    }
    return 'New Insights: ' + (therapeuticFocus || 'Clinical') + ' Update';
  }

  static generatePreheader(keyBenefits, clinicalPositioning, isPatient) { // Removed type annotation : string
    if (isPatient) {
      // Corrected ternary shorthand
      return keyBenefits[0] 
         ? 'Discover how ' + keyBenefits[0].toLowerCase()
        : 'Important information about your treatment options';
    }
    
    // Corrected ternary shorthand
    return clinicalPositioning 
       ? (clinicalPositioning.length <= 100 ? clinicalPositioning : clinicalPositioning.substring(0, 97) + '...')
      : (keyBenefits[0] || 'Evidence-based clinical insights for your practice');
  }

  static generateEmailBody(context, isPatient) { // Removed type annotation : string
    const { 
      therapeuticFocus, 
      keyBenefits = [], 
      clinicalPositioning,
      proofPoints = [],
      indication,
      coreMessage
    } = context;

    const condition = indication || therapeuticFocus || 'your condition';

    // Corrected ternary shorthand
    const greeting = isPatient 
       ? 'Dear Patient,'
      : 'Dear Healthcare Professional,';

    let intro;
    if (isPatient) {
      intro = 'We understand that managing ' + condition + ' can be challenging. ' + 
        (coreMessage || 'We are here to provide you with helpful information and resources.');
    } else {
      intro = coreMessage || ('Understanding the latest advances in ' + (therapeuticFocus || indication || 'treatment') + ' is essential for optimizing patient outcomes.');
    }

    let benefitsSection = '';
    if (keyBenefits.length > 0) {
      benefitsSection = '\n\nKey Benefits:\n' + keyBenefits.map(b => '• ' + b).join('\n');
    }

    let clinicalSection = '';
    if (!isPatient && clinicalPositioning) {
      clinicalSection = '\n\n' + clinicalPositioning;
    }

    let evidenceSection = '';
    if (!isPatient && proofPoints.length > 0) {
      evidenceSection = '\n\nClinical Evidence:\n' + proofPoints.slice(0, 2).map(p => '• ' + p).join('\n');
    }

    // Corrected ternary shorthand
    const closing = isPatient
       ? '\n\nWe are committed to supporting you on your treatment journey. If you have questions, please speak with your healthcare provider.'
      : '\n\nWe look forward to supporting your clinical practice with evidence-based solutions.';

    return greeting + '\n\n' + intro + benefitsSection + clinicalSection + evidenceSection + closing;
  }

  static generateDisclaimer(isPatient, therapeuticFocus, brandName) { // Removed type annotation : string
    if (isPatient) {
      // Corrected ternary shorthand
      const brandNote = brandName ? ' ' + brandName + ' is a registered trademark.' : '';
      return 'This information is for educational purposes only and is not intended to replace advice from your healthcare provider. Always consult with your doctor before making any changes to your treatment plan.' + brandNote;
    }
    // Corrected ternary shorthand
    const areaNote = therapeuticFocus ? ' for ' + therapeuticFocus : '';
    return 'This email contains promotional information about prescription medications' + areaNote + '. Please see full Prescribing Information, including Boxed Warning if applicable. For healthcare professionals only.';
  }

  /**
   * Format content for Social Media
   */
  static formatSocial(context) { // Removed type annotation : FormattedContent
    const { 
      coreMessage, 
      therapeuticFocus, 
      keyBenefits = [],
      callToAction 
    } = context;

    // Social post - concise, engaging, under 280 chars
    const mainMessage = coreMessage || ('New developments in ' + (therapeuticFocus || 'healthcare'));
    // Corrected ternary shorthand
    const benefit = keyBenefits[0] ? '\n\n' + keyBenefits[0] : '';
    
    let bodyText = mainMessage + benefit;
    if (bodyText.length > 250) {
      bodyText = bodyText.substring(0, 247) + '...';
    }

    // Hashtags - relevant, limited
    const hashtags = this.generateHashtags(therapeuticFocus);

    // Corrected object literal assignment (missing colons)
    return {
      bodyText: bodyText,
      body: bodyText, // Used bodyText for body too, as is common for social
      headline: mainMessage, // Used mainMessage as a proxy for headline
      cta: callToAction || 'Learn more',
      hashtags,
      disclaimer: 'For educational purposes only. Consult your healthcare provider.'
    };
  }

  static generateHashtags(therapeuticFocus) { // Removed type annotation : string
    const baseHashtags = ['#Healthcare', '#MedicalEducation'];
    if (therapeuticFocus) {
      const cleanFocus = therapeuticFocus.replace(/\s+/g, '');
      baseHashtags.unshift('#' + cleanFocus);
    }
    return baseHashtags.slice(0, 3).join(' ');
  }

  /**
   * Format content for Landing Page
   */
  static formatWeb(context) { // Removed type annotation : FormattedContent
    const { 
      coreMessage, 
      therapeuticFocus, 
      targetAudience,
      keyBenefits = [],
      clinicalPositioning,
      callToAction,
      brandName
    } = context;

    const isPatient = targetAudience?.toLowerCase().includes('patient');

    // Page title - SEO optimized, under 60 chars
    const pageTitle = this.generatePageTitle(coreMessage, therapeuticFocus, brandName);
    
    // Meta description - under 160 chars
    const metaDescription = this.generateMetaDescription(clinicalPositioning, keyBenefits);

    // Hero section
    const heroHeadline = coreMessage || ('Advancing ' + (therapeuticFocus || 'Treatment') + ' Excellence');
    const heroSubheadline = clinicalPositioning || keyBenefits[0] || 'Evidence-based solutions for better outcomes';

    // Body content - structured for web
    const body = this.generateWebBody(context, !!isPatient);

    // Corrected object literal assignment (missing colons and referencing undefined variables like heroCta)
    return {
      pageTitle,
      metaDescription,
      heroHeadline,
      heroSubheadline,
      headline: heroHeadline, // Used heroHeadline as a proxy for generic headline
      body: body,
      keyMessage: coreMessage, // Added keyMessage field
      heroCta: callToAction || (isPatient ? 'Find Resources' : 'Request Information'),
      cta: callToAction || 'Learn More',
      disclaimer: this.generateDisclaimer(!!isPatient, therapeuticFocus, brandName) // Corrected assignment
    };
  }

  static generatePageTitle(coreMessage, therapeuticFocus, brandName) { // Removed type annotation : string
    // Corrected ternary shorthand
    const brand = brandName ? ' | ' + brandName : '';
    const base = coreMessage || ((therapeuticFocus || 'Treatment') + ' Information');
    const title = base + brand;
    // Corrected ternary shorthand
    return title.length <= 60 ? title : title.substring(0, 57) + '...';
  }

  static generateMetaDescription(clinicalPositioning, keyBenefits = []) { // Removed type annotation : string
    const description = clinicalPositioning || keyBenefits.join('. ') || 'Discover evidence-based treatment information and resources.';
    // Corrected ternary shorthand
    return description.length <= 160 ? description : description.substring(0, 157) + '...';
  }

  static generateWebBody(context, isPatient) { // Removed type annotation : string
    const { keyBenefits = [], clinicalPositioning, proofPoints = [], therapeuticFocus } = context;

    let intro;
    if (isPatient) {
      intro = 'Living with ' + (therapeuticFocus || 'your condition') + ' presents unique challenges. We are here to help you understand your options and make informed decisions about your care.';
    } else {
      intro = 'Healthcare professionals need reliable, evidence-based information to optimize patient care in ' + (therapeuticFocus || 'their practice') + '.';
    }

    let benefitsSection = '';
    if (keyBenefits.length > 0) {
      benefitsSection = '\n\n**Key Benefits:**\n' + keyBenefits.map(b => '• ' + b).join('\n');
    }

    let clinicalSection = '';
    if (clinicalPositioning) {
      clinicalSection = '\n\n**Clinical Overview:**\n' + clinicalPositioning;
    }

    let evidenceSection = '';
    if (!isPatient && proofPoints.length > 0) {
      evidenceSection = '\n\n**Supporting Evidence:**\n' + proofPoints.slice(0, 3).map(p => '• ' + p).join('\n');
    }

    return intro + benefitsSection + clinicalSection + evidenceSection;
  }

  /**
   * Format content for Digital Sales Aid
   */
  static formatSalesAid(context) { // Removed type annotation : FormattedContent
    const { 
      coreMessage, 
      therapeuticFocus,
      keyBenefits = [],
      clinicalPositioning,
      proofPoints = [],
      callToAction,
      indication
    } = context;

    // Title slide
    const titleSlide = coreMessage || therapeuticFocus || 'Clinical Presentation';

    // Agenda
    const agenda = this.generateAgenda(therapeuticFocus, keyBenefits);

    // Clinical data section
    const clinicalData = this.generateClinicalData(clinicalPositioning, proofPoints);

    // Discussion guides
    const discussionGuides = this.generateDiscussionGuides(therapeuticFocus, keyBenefits, indication);

    // Corrected object literal assignment (missing colons and referencing undefined variables)
    return {
      titleSlide,
      headline: titleSlide, // Used titleSlide as a proxy for headline
      agenda,
      clinicalData,
      body: clinicalData, // Used clinicalData as a proxy for body
      keyMessage: coreMessage, // Added keyMessage field
      discussionGuides,
      cta: callToAction || 'Discuss Treatment Options',
      disclaimer: 'For healthcare professional use only. Please see full Prescribing Information.'
    };
  }

  static generateAgenda(therapeuticFocus, keyBenefits = []) { // Removed type annotation : string
    const items = [
      (therapeuticFocus || 'Disease') + ' Overview',
      'Unmet Medical Needs',
      'Clinical Evidence',
      ...keyBenefits.slice(0, 2).map(b => b.length <= 30 ? b : b.substring(0, 27) + '...'), // Corrected ternary shorthand
      'Safety Profile',
      'Discussion & Next Steps'
    ];
    return items.map((item, i) => (i + 1) + '. ' + item).join('\n');
  }

  static generateClinicalData(clinicalPositioning, proofPoints = []) { // Removed type annotation : string
    let positioning = '';
    if (clinicalPositioning) {
      positioning = '**Clinical Positioning:**\n' + clinicalPositioning + '\n\n';
    }
    
    let evidence;
    if (proofPoints.length > 0) {
      evidence = '**Key Clinical Data:**\n' + proofPoints.map(p => '• ' + p).join('\n');
    } else {
      evidence = '**Key Clinical Data:**\n• Clinical studies demonstrate significant efficacy\n• Favorable safety profile\n• Real-world evidence supports outcomes';
    }

    return positioning + evidence;
  }

  static generateDiscussionGuides(therapeuticFocus, keyBenefits = [], indication) { // Removed type annotation : string
    const condition = indication || therapeuticFocus || 'this condition';
    const benefit = keyBenefits[0] || 'efficacy';
    
    return '**Questions for Discussion:**\n\n• How do you currently approach treatment for ' + condition + '\n• What challenges do your patients face with current therapies\n• How important is ' + benefit.toLowerCase() + ' in your treatment decisions\n• What would help you optimize outcomes for these patients';
  }

  /**
   * Format content for Rep-Triggered Email
   */
  static formatRepEmail(context) { // Removed type annotation : FormattedContent
    const { 
      coreMessage, 
      therapeuticFocus,
      keyBenefits = [],
      callToAction,
      indication
    } = context;

    const topic = indication || therapeuticFocus || 'treatment options';
    const personalGreeting = 'Thank you for taking the time to discuss ' + topic + ' with me today.';

    let meetingRecap = 'During our conversation, we explored ' + (coreMessage || ('the latest developments in ' + (therapeuticFocus || 'treatment'))) + '.';
    if (keyBenefits[0]) {
      meetingRecap += ' I wanted to highlight that ' + keyBenefits[0].toLowerCase() + '.';
    }

    let body = personalGreeting + '\n\n' + meetingRecap + '\n\nI have attached additional clinical information that may be helpful as you consider treatment options for your patients.';
    
    if (keyBenefits.length > 1) {
      body += '\n\nKey points to remember:\n' + keyBenefits.slice(0, 3).map(b => '• ' + b).join('\n');
    }
    
    body += '\n\nPlease do not hesitate to reach out if you have any questions or would like to discuss further.';

    // Corrected object literal assignment (missing colons)
    return {
      subject: 'Follow-up: ' + (indication || therapeuticFocus || 'Our Discussion'),
      preheader: 'Thank you for our meeting about ' + (therapeuticFocus || 'treatment options'),
      personalGreeting,
      meetingRecap,
      headline: 'Following Up on ' + (therapeuticFocus || 'Our Meeting'),
      body,
      keyMessage: coreMessage, // Added keyMessage field
      cta: callToAction || 'Schedule a Follow-up',
      disclaimer: 'This email contains promotional information about prescription medications. For healthcare professionals only. Please see full Prescribing Information.'
    };
  }

  /**
   * Generic fallback formatter
   */
  static formatGeneric(context) { // Removed type annotation : FormattedContent
    const { 
      coreMessage, 
      therapeuticFocus,
      keyBenefits = [],
      clinicalPositioning,
      callToAction
    } = context;

    let body = '';
    if (coreMessage) body += coreMessage + '\n\n';
    if (clinicalPositioning) body += clinicalPositioning + '\n\n';
    if (keyBenefits.length > 0) {
      body += 'Key points:\n' + keyBenefits.map(b => '• ' + b).join('\n');
    }
    
    // Corrected object literal assignment (missing colons and referencing undefined variables)
    return {
      headline: coreMessage || ((therapeuticFocus || 'Content') + ' Overview'), // Corrected assignment
      body: body.trim(), // Corrected assignment
      keyMessage: coreMessage, // Added keyMessage field
      cta: callToAction || 'Learn More',
      disclaimer: 'Please see full Prescribing Information for complete details.'
    };
  }
}