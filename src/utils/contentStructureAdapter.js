
// Type-only import removed:
// import { ContentAsset } from '@/types/content';

/**
 * SimpleContentStructure (runtime shape, no TS types)
 * {
 *   subject, headline, body, keyMessage, cta, disclaimer, preheader, unsubscribe, ...[index signatures]
 * }
 */

/**
 * IntakeContext (runtime shape, no TS types)
 * {
 *   original_key_message?, original_cta?, intake_objective?, intake_audience?, indication?, brand_guidelines?
 * }
 */

export class ContentStructureAdapter {
  /**
   * Converts complex database content structure to simple editor format
   */
  static toSimpleStructure(asset) {
    try {
      console.log('ContentStructureAdapter: Converting asset to simple structure', asset);

      // Check for asset type mismatch and log it
      if (this.hasAssetTypeMismatch(asset)) {
        console.warn('ContentStructureAdapter: Asset type mismatch detected', {
          dbAssetType: asset.asset_type,
          intakeAssetTypes: this.extractIntakeAssetTypes(asset),
        });
      }

      const primaryContent = asset.primary_content;

      // CRITICAL FIX: If original structure exists, use it (most reliable)
      if (primaryContent?._original_structure && primaryContent?._structure_version === '2.0') {
        console.log('ContentStructureAdapter: Using preserved original structure');
        return primaryContent._original_structure;
      }

      // Handle empty or null content
      if (!primaryContent || typeof primaryContent !== 'object') {
        console.warn('ContentStructureAdapter: Primary content is invalid', primaryContent);
        return {
          subject: '',
          headline: '',
          body: '',
          keyMessage: '',
          cta: '',
          disclaimer: '',
          preheader: '',
          unsubscribe: '',
        };
      }

      // Safe string extraction with type checking
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

      // Extract intake context from metadata or assets
      const intakeContext = this.extractIntakeContext(asset);

      const result = {
        subject:
          safeString(primaryContent.subject) ||
          safeString(primaryContent.subject_line) ||
          safeString(primaryContent.page_title) ||
          '',
        headline:
          safeString(primaryContent.headline) ||
          safeString(primaryContent.title) ||
          safeString(primaryContent.header) ||
          safeString(primaryContent.subject) ||
          '',
        body:
          safeString(primaryContent.body) ||
          safeString(primaryContent.content) ||
          safeString(primaryContent.primary_content) ||
          safeString(primaryContent.description) ||
          this.extractBodyFromSections(primaryContent) ||
          // Fallback to intake key message if no body content
          intakeContext.original_key_message ||
          '',
        keyMessage:
          safeString(primaryContent.keyMessage) ||
          safeString(primaryContent.key_message) ||
          safeString(primaryContent.primaryMessage) ||
          safeString(primaryContent.theme) ||
          // Fallback to intake key message
          intakeContext.original_key_message ||
          '',
        cta:
          safeString(primaryContent.cta) ||
          safeString(primaryContent.callToAction) ||
          safeString(primaryContent.call_to_action) ||
          // Fallback to intake CTA
          intakeContext.original_cta ||
          '',
        disclaimer:
          safeString(primaryContent.disclaimer) ||
          safeString(primaryContent.legal_text) ||
          safeString(primaryContent.regulatory_text) ||
          '',
        preheader:
          safeString(primaryContent.preheader) ||
          safeString(primaryContent.pre_header) ||
          safeString(primaryContent.preview_text) ||
          '',
        unsubscribe:
          safeString(primaryContent.unsubscribe) ||
          safeString(primaryContent.unsubscribe_text) ||
          safeString(primaryContent.unsubscribe_link) ||
          '',
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
      };
    }
  }

  /**
   * Converts simple editor structure back to database format
   */
  static toDatabaseStructure(simpleContent, originalAsset) {
    // Preserve original structure but update with simple content
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

      // Also update alternative field names for compatibility
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

      // CRITICAL: Preserve original simple structure for reliable reload
      _original_structure: simpleContent,
      _structure_version: '2.0',
    };
  }

  /**
   * Extract body content from complex section-based structures
   */
  static extractBodyFromSections(content) {
    if (content.sections && Array.isArray(content.sections)) {
      return content.sections
        .map((section) => section.content || section.text || section.body)
        .filter(Boolean)
        .join('\n\n');
    }
    if (content.assets && Array.isArray(content.assets)) {
      return content.assets
        .map((asset) => asset.content || asset.description)
        .filter(Boolean)
        .join('\n\n');
    }
    return '';
  }

  /**
   * Check if content structure needs migration
   */
  static needsMigration(asset) {
    const content = asset.primary_content;
    if (!content) return false;

    // Check if it has the complex structure patterns
    return !!(
      content.sections ||
      content.assets ||
      content.primaryAudience ||
      content.theme ||
      (content.content && !content.body) ||
      (content.subject_line && !content.subject)
    );
  }

  /**
   * Extract intake context from asset metadata or legacy assets array
   */
  static extractIntakeContext(asset) {
    try {
      // First check metadata for intake_context
      if (asset.metadata && asset.metadata.intake_context) {
        return asset.metadata.intake_context;
      }

      // Check for campaign-level data in primary_content
      const primaryContent = asset.primary_content;
      if (primaryContent && primaryContent.intake_context) {
        return primaryContent.intake_context;
      }

      // Check for assets array (legacy flow from intake)
      if (primaryContent && primaryContent.assets && Array.isArray(primaryContent.assets) && primaryContent.assets.length > 0) {
        const firstAsset = primaryContent.assets[0];
        return {
          original_key_message: firstAsset.keyMessage || firstAsset.primaryMessage || firstAsset.theme,
          original_cta: firstAsset.cta || firstAsset.callToAction,
          intake_objective: firstAsset.objective || primaryContent.objective,
          intake_audience: firstAsset.audience || primaryContent.primaryAudience,
          indication: firstAsset.indication || primaryContent.indication,
        };
      }

      // Check primary content for direct fields
      if (primaryContent) {
        return {
          original_key_message: primaryContent.originalKeyMessage || primaryContent.originalMessage,
          original_cta: primaryContent.originalCTA || primaryContent.originalCallToAction,
          intake_objective: primaryContent.objective,
          intake_audience: primaryContent.primaryAudience,
          indication: primaryContent.indication,
        };
      }

      return {};
    } catch (error) {
      console.error('ContentStructureAdapter: Error extracting intake context', error);
      return {};
    }
  }

  /**
   * Get intake context for a given asset
   */
  static getIntakeContext(asset) {
    return this.extractIntakeContext(asset);
  }

  /**
   * Validate that content has minimum required fields
   */
  static validateContent(content) {
    const missingFields = [];
    if (!content.body || (typeof content.body === 'string' && !content.body.trim())) {
      missingFields.push('body');
    }
    if (
      ((!content.subject || (typeof content.subject === 'string' && !content.subject.trim())) &&
        (!content.headline || (typeof content.headline === 'string' && !content.headline.trim())))
    ) {
      missingFields.push('subject or headline');
    }
    return {
      isValid: missingFields.length === 0,
      missingFields,
    };
  }

  /**
   * Check if asset has type mismatch between database and intake data
   */
  static hasAssetTypeMismatch(asset) {
    const intakeTypes = this.extractIntakeAssetTypes(asset);
    return intakeTypes.length > 0 && !intakeTypes.includes(asset.asset_type);
  }

  /**
   * Extract asset types from intake data within the asset
   */
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

  /**
   * Get suggested asset type based on intake data
   */
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
      email: 'email',
      web: 'web',
      social: 'social',
      print: 'print',
      dsa: 'dsa',
      video: 'video',
      infographic: 'infographic',
    };

    return typeMapping[intakeTypes[0]] ?? null;
  }
}
