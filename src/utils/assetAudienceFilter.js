
import {
  getAllowedAssetTypes,
  isAssetTypeAllowedForAudience,
  getAssetAudienceDescription,
  getAssetAudienceReasoning,
  AUDIENCE_ASSET_RULES
} from '@/services/audienceAssetMappingService';

/**
 * Filter asset types based on selected primary audience
 */
export const filterAssetsByAudience = (
  availableAssets,
  primaryAudience
) => {
  if (!primaryAudience) {
    // No audience selected - return all assets with generic descriptions
    return {
      allowedAssets: availableAssets,
      filteredAssets: [],
      assetDescriptions: {},
      audienceGuidance: 'Select a primary audience to see tailored asset options and compliance guidance.'
    };
  }

  const allowedAssets = availableAssets.filter(asset =>
    isAssetTypeAllowedForAudience(asset, primaryAudience)
  );

  const filteredAssets = availableAssets.filter(asset =>
    !isAssetTypeAllowedForAudience(asset, primaryAudience)
  );

  // Generate audience-specific descriptions for allowed assets
  const assetDescriptions = {};

  allowedAssets.forEach(assetType => {
    const audienceDesc = getAssetAudienceDescription(assetType, primaryAudience);
    const reasoning = getAssetAudienceReasoning(assetType, primaryAudience);

    if (audienceDesc) {
      assetDescriptions[assetType] = {
        name: audienceDesc.name,
        description: audienceDesc.description,
        examples: audienceDesc.examples,
        complianceNotes: audienceDesc.complianceNotes,
        reasoning: reasoning
      };
    }
  });

  // Generate audience-specific guidance
  const audienceGuidance = generateAudienceGuidance(primaryAudience, allowedAssets.length, filteredAssets.length);

  return {
    allowedAssets,
    filteredAssets,
    assetDescriptions,
    audienceGuidance
  };
};

/**
 * Generate guidance message for the selected audience
 */
const generateAudienceGuidance = (
  audience,
  allowedCount,
  filteredCount
) => {
  const audienceMessages = {
    'HCP': `Showing ${allowedCount} asset types appropriate for Healthcare Professionals. These assets require MLR approval and compliance with promotional regulations.`,
    'Patient': `Showing ${allowedCount} asset types suitable for Patient audiences. These focus on education and support with balanced, non-promotional content.`,
    'Caregiver': `Showing ${allowedCount} asset types designed for Caregivers. These provide support resources and practical guidance for those caring for patients.`,
    'Other': `Showing ${allowedCount} asset types for your selected audience. Review compliance requirements carefully for your specific use case.`
  };

  let guidance = audienceMessages[audience] || audienceMessages['Other'];

  if (filteredCount > 0) {
    guidance += ` ${filteredCount} asset type(s) have been filtered out due to audience restrictions.`;
  }

  return guidance;
};

/**
 * Get explanation for why certain assets are not available
 */
export const getFilteredAssetsExplanation = (
  filteredAssets,
  audience
) => {
  const explanations = {};

  filteredAssets.forEach(assetType => {
    explanations[assetType] = getAssetAudienceReasoning(assetType, audience);
  });

  return explanations;
};

/**
 * Get compliance level for audience-asset combination
 */
export const getComplianceLevel = (assetType, audience) => {
  const rule = AUDIENCE_ASSET_RULES.find(r => r.assetType === assetType);

  if (!rule || !rule.allowedAudiences.includes(audience)) {
    return null;
  }

  return rule.complianceLevel;
};

/**
 * Get recommended channels for audience-asset combination
 */
export const getRecommendedChannels = (assetType, audience) => {
  const description = getAssetAudienceDescription(assetType, audience);
  return description?.channelRecommendations || [];
};