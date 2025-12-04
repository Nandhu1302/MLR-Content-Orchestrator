
export class ContentStructureAdapter {
  /**
   * Converts complex database content structure to simple editor format
   */
  static toSimpleStructure(asset) {
    try {
      console.log('ContentStructureAdapter: Converting asset to simple structure', asset);
      if (this.hasAssetTypeMismatch(asset)) {
        console.warn('ContentStructureAdapter: Asset type mismatch detected', {
          dbAssetType: asset.asset_type,
          intakeAssetTypes: this.extractIntakeAssetTypes(asset)
        });
      }
      const primaryContent = asset.primary_content;
      if (primaryContent?._original_structure && primaryContent?._structure_version === '2.0') {
        console.log('ContentStructureAdapter: Using preserved original structure');
        return primaryContent._original_structure;
      }
      if (!primaryContent || typeof primaryContent !== 'object' || Object.keys(primaryContent).length === 0) {
        console.warn('ContentStructureAdapter: Primary content is invalid or empty - theme initialization required');
        throw new Error('Asset has no primary content - theme initialization required');
      }
      const safeString = (value) => {
        if (typeof value === 'string') return value;
        if (value && typeof value === 'object' && typeof value.toString === 'function') {
          try {
            return String(value);
          } catch {
            return '';
          }
        }
        return '';
      };
      const intakeContext = this.extractIntakeContext(asset);
      const result = {
        subject: safeString(primaryContent.subject) || safeString(primaryContent.subject_line) || safeString(primaryContent.page_title) || '',
        headline: safeString(primaryContent.headline) || safeString(primaryContent.title) || safeString(primaryContent.header) || safeString(primaryContent.subject) || '',
        body: safeString(primaryContent.body) || safeString(primaryContent.content) || safeString(primaryContent.primary_content) || safeString(primaryContent.description) || this.extractBodyFromSections(primaryContent) || intakeContext.original_key_message || '',
        keyMessage: safeString(primaryContent.keyMessage) || safeString(primaryContent.key_message) || safeString(primaryContent.primaryMessage) || safeString(primaryContent.theme) || intakeContext.original_key_message || '',
        cta: safeString(primaryContent.cta) || safeString(primaryContent.callToAction) || safeString(primaryContent.call_to_action) || intakeContext.original_cta || '',
        disclaimer: safeString(primaryContent.disclaimer) || safeString(primaryContent.legal_text) || safeString(primaryContent.regulatory_text) || '',
        preheader: safeString(primaryContent.preheader) || safeString(primaryContent.pre_header) || safeString(primaryContent.preview_text) || '',
        unsubscribe: safeString(primaryContent.unsubscribe) || safeString(primaryContent.unsubscribe_text) || safeString(primaryContent.unsubscribe_link) || '',
        heroHeadline: safeString(primaryContent.heroHeadline) || '',
        heroSubheadline: safeString(primaryContent.heroSubheadline) || '',
        heroCta: safeString(primaryContent.heroCta) || safeString(primaryContent.cta) || '',
        diseaseOverview: safeString(primaryContent.diseaseOverview) || '',
        treatmentApproach: safeString(primaryContent.treatmentApproach) || '',
        clinicalEvidence: safeString(primaryContent.clinicalEvidence) || '',
        safetyInformation: safeString(primaryContent.safetyInformation) || '',
        pageTitle: safeString(primaryContent.pageTitle) || safeString(primaryContent.page_title) || '',
        metaDescription: safeString(primaryContent.metaDescription) || safeString(primaryContent.meta_description) || '',
        bodyText: safeString(primaryContent.bodyText) || safeString(primaryContent.body) || '',
        hashtags: safeString(primaryContent.hashtags) || '',
        platform: safeString(primaryContent.platform) || '',
        characterCount: typeof primaryContent.characterCount === 'number' ? primaryContent.characterCount : 0,
        imageRecommendation: safeString(primaryContent.imageRecommendation) || ''
      };
      console.log('ContentStructureAdapter: Converted result', result);
      return result;
    } catch (error) {
      console.error('ContentStructureAdapter: Error in toSimpleStructure', error, asset);
      return {
        subject: '',
        headline: '',
        body: '',
        keyMessage: '',
        cta: '',
        disclaimer: '',
        preheader: '',
        unsubscribe: '',
        heroHeadline: '',
        heroSubheadline: '',
        heroCta: '',
        diseaseOverview: '',
        treatmentApproach: '',
        clinicalEvidence: '',
        safetyInformation: '',
        pageTitle: '',
        metaDescription: '',
        bodyText: '',
        hashtags: '',
        platform: '',
        characterCount: 0,
        imageRecommendation: ''
      };
    }
  }

  /**
   * Converts simple editor structure back to database format
   */
  static toDatabaseStructure(simpleContent, originalAsset) {
    const originalContent = (originalAsset?.primary_content) || {};
    return {
      ...originalContent,
      subject: simpleContent.subject,
      headline: simpleContent.headline,
      body: simpleContent.body,
      keyMessage: simpleContent.keyMessage,
      cta: simpleContent.cta,
      disclaimer: simpleContent.disclaimer,
      preheader: simpleContent.preheader,
      unsubscribe: simpleContent.unsubscribe,
      subject_line: simpleContent.subject,
      title: simpleContent.headline,
      content: simpleContent.body,
      key_message: simpleContent.keyMessage,
      primaryMessage: simpleContent.keyMessage,
      callToAction: simpleContent.cta,
      legal_text: simpleContent.disclaimer,
      pre_header: simpleContent.preheader,
      preview_text: simpleContent.preheader,
      unsubscribe_text: simpleContent.unsubscribe,
      unsubscribe_link: simpleContent.unsubscribe,
      heroHeadline: simpleContent.heroHeadline,
      heroSubheadline: simpleContent.heroSubheadline,
      heroCta: simpleContent.heroCta,
      diseaseOverview: simpleContent.diseaseOverview,
      treatmentApproach: simpleContent.treatmentApproach,
      clinicalEvidence: simpleContent.clinicalEvidence,
      safetyInformation: simpleContent.safetyInformation,
      pageTitle: simpleContent.pageTitle,
      page_title: simpleContent.pageTitle,
      metaDescription: simpleContent.metaDescription,
      meta_description: simpleContent.metaDescription,
      bodyText: simpleContent.bodyText,
      hashtags: simpleContent.hashtags,
      platform: simpleContent.platform,
      characterCount: simpleContent.characterCount,
      imageRecommendation: simpleContent.imageRecommendation,
      _original_structure: simpleContent,
      _structure_version: '2.0'
    };
  }

  static extractBodyFromSections(content) {
    if (content.sections && Array.isArray(content.sections)) {
      return content.sections
        .map(section => section.content || section.text || section.body)
        .filter(Boolean)
        .join('\n\n');
    }
    if (content.assets && Array.isArray(content.assets)) {
      return content.assets
        .map(asset => asset.content || asset.description)
        .filter(Boolean)
        .join('\n\n');
    }
    return '';
  }

  static needsMigration(asset) {
    const content = asset.primary_content;
    if (!content) return false;
    return !!(
      content.sections ||
      content.assets ||
      content.primaryAudience ||
      content.theme ||
      (content.content && !content.body) ||
      (content.subject_line && !content.subject)
    );
  }

  static extractIntakeContext(asset) {
    try {
      if (asset.metadata && asset.metadata.intake_context) {
        return asset.metadata.intake_context;
      }
      const primaryContent = asset.primary_content;
      if (primaryContent && primaryContent.intake_context) {
        return primaryContent.intake_context;
      }
      if (primaryContent && primaryContent.assets && Array.isArray(primaryContent.assets) && primaryContent.assets.length > 0) {
        const firstAsset = primaryContent.assets[0];
        return {
          original_key_message: firstAsset.keyMessage || firstAsset.primaryMessage || firstAsset.theme,
          original_cta: firstAsset.cta || firstAsset.callToAction,
          intake_objective: firstAsset.objective || primaryContent.objective,
          intake_audience: firstAsset.audience || primaryContent.primaryAudience,
          indication: firstAsset.indication || primaryContent.indication
        };
      }
      if (primaryContent) {
        return {
          original_key_message: primaryContent.originalKeyMessage || primaryContent.originalMessage,
          original_cta: primaryContent.originalCTA || primaryContent.originalCallToAction,
          intake_objective: primaryContent.objective,
          intake_audience: primaryContent.primaryAudience,
          indication: primaryContent.indication
        };
      }
      return {};
    } catch (error) {
      console.error('ContentStructureAdapter: Error extracting intake context', error);
      return {};
    }
  }

  static getIntakeContext(asset) {
    return this.extractIntakeContext(asset);
  }

  static validateContent(content) {
    const missingFields = [];
    if (!content.body || (typeof content.body === 'string' && !content.body.trim())) missingFields.push('body');
    if ((!content.subject || (typeof content.subject === 'string' && !content.subject.trim())) &&
      (!content.headline || (typeof content.headline === 'string' && !content.headline.trim()))) {
      missingFields.push('subject or headline');
    }
    return {
      isValid: missingFields.length === 0,
      missingFields
    };
  }

  static hasAssetTypeMismatch(asset) {
    const intakeTypes = this.extractIntakeAssetTypes(asset);
    return intakeTypes.length > 0 && !intakeTypes.includes(asset.asset_type);
  }

  static extractIntakeAssetTypes(asset) {
    const primaryContent = asset.primary_content;
    if (!primaryContent) return [];
    const types = [];
    if (primaryContent.selectedAssetTypes && Array.isArray(primaryContent.selectedAssetTypes)) {
      types.push(...primaryContent.selectedAssetTypes);
    }
    if (primaryContent.assetType && typeof primaryContent.assetType === 'string') {
      types.push(primaryContent.assetType);
    }
    return types;
  }

  static getSuggestedAssetType(asset) {
    const intakeTypes = this.extractIntakeAssetTypes(asset);
    if (intakeTypes.length === 0) return null;
    const typeMapping = {
      'mass-email': 'mass-email',
      'rep-triggered-email': 'rep-triggered-email',
      'patient-email': 'patient-email',
      'caregiver-email': 'caregiver-email',
      'social-media-post': 'social-media-post',
      'website-landing-page': 'website-landing-page',
      'digital-sales-aid': 'digital-sales-aid',
      'email': 'email',
      'web': 'web',
      'social': 'social',
      'print': 'print',
      'dsa': 'dsa',
      'video': 'video',
      'infographic': 'infographic'
    };
    return typeMapping[intakeTypes[0]] || null;
  }
}