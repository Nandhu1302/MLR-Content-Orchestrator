
export class AssetTypeMapper {
  /**
   * Maps intake asset types to database asset types
   */
  static mapIntakeToDbType(intakeAssetType) {
    const typeMapping = {
      // Email types
      'mass-email': 'mass-email',
      'hcp-email': 'hcp-email',
      'rep-triggered-email': 'rep-triggered-email',
      'patient-email': 'patient-email',
      'caregiver-email': 'caregiver-email',

      // Social types
      'social-media-post': 'social-media-post',
      'paid-social-ad': 'paid-social-ad',

      // Web types
      'website-landing-page': 'website-landing-page',
      'web-content': 'web-content',
      'blog': 'blog',

      // Sales types
      'digital-sales-aid': 'digital-sales-aid',

      // Legacy mappings for backwards compatibility
      'email': 'email',
      'web': 'web',
      'social': 'social',
      'print': 'print',
      'dsa': 'dsa',
      'video': 'video',
      'infographic': 'infographic',

      // Additional fallback mappings
      'Email': 'email',
      'Web': 'web',
      'Social': 'social',
      'Print': 'print',
      'DSA': 'dsa',
      'Video': 'video',
      'Infographic': 'infographic'
    };

    return typeMapping[intakeAssetType] || 'web';
  }

  /**
   * Extracts the correct asset type from asset content
   */
  static extractAssetTypeFromContent(assetContent) {
    if (!assetContent || typeof assetContent !== 'object') return null;

    // Check selectedAssetTypes array (most common)
    if (assetContent.selectedAssetTypes && Array.isArray(assetContent.selectedAssetTypes)) {
      if (assetContent.selectedAssetTypes.length > 0) {
        return this.mapIntakeToDbType(assetContent.selectedAssetTypes[0]);
      }
    }

    // Check assetType field
    if (assetContent.assetType && typeof assetContent.assetType === 'string') {
      return this.mapIntakeToDbType(assetContent.assetType);
    }

    // Check assets array for legacy flow
    if (assetContent.assets && Array.isArray(assetContent.assets) && assetContent.assets.length > 0) {
      const firstAsset = assetContent.assets[0];
      if (firstAsset.assetType) {
        return this.mapIntakeToDbType(firstAsset.assetType);
      }
    }

    return null;
  }

  /**
   * Validates if an asset type mismatch exists
   */
  static hasAssetTypeMismatch(asset) {
    const suggestedType = this.extractAssetTypeFromContent(asset.primary_content);
    return suggestedType !== null && suggestedType !== asset.asset_type;
  }

  /**
   * Gets all valid asset types
   */
  static getValidAssetTypes() {
    return [
      'email', 'web', 'social', 'print', 'dsa', 'video', 'infographic',
      'mass-email', 'rep-triggered-email', 'patient-email', 'caregiver-email',
      'social-media-post', 'website-landing-page', 'digital-sales-aid'
    ];
  }

  /**
   * Gets asset type display name
   */
  static getAssetTypeDisplayName(assetType) {
    const displayNames = {
      'email': 'Email',
      'web': 'Web',
      'social': 'Social Media',
      'print': 'Print',
      'dsa': 'Digital Sales Aid',
      'video': 'Video',
      'infographic': 'Infographic',
      'mass-email': 'Mass Email',
      'rep-triggered-email': 'Rep Triggered Email',
      'patient-email': 'Patient Education Email',
      'caregiver-email': 'Caregiver Support Email',
      'social-media-post': 'Social Media Post',
      'website-landing-page': 'Website Landing Page',
      'digital-sales-aid': 'Digital Sales Aid'
    };

    return displayNames[assetType] || assetType;
  }
}