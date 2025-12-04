import { useMemo } from 'react';
import { getAllowedAssetTypes, getAssetAudienceDescription, getAssetAudienceReasoning } from '@/services/audienceAssetMappingService';
import { PublicDomainIntelligenceService } from '@/services/publicDomainIntelligenceService';
import { generateAudienceSpecificContent } from '@/services/audienceSpecificContentGenerator';
import { filterAssetsByAudience, getFilteredAssetsExplanation } from '@/utils/assetAudienceFilter';

export const useIntelligentAssetFiltering = (
  primaryAudience,
  intakeData,
  availableAssets = ['mass-email', 'rep-triggered-email', 'patient-email', 'caregiver-email', 'social-media-post', 'website-landing-page', 'digital-sales-aid']
) => {
  const intelligentFilter = useMemo(() => {
    if (!primaryAudience) {
      return {
        allowedAssets: [],
        filteredAssets: availableAssets,
        assetDescriptions: {},
        smartRecommendations: {
          recommended: [],
          alternatives: [],
          warnings: ['Please select a primary audience to see asset recommendations']
        },
        audienceGuidance: 'Select an audience type to view compatible assets and recommendations.'
      };
    }
    const filterResult = filterAssetsByAudience(availableAssets, primaryAudience);
    const allowedAssets = filterResult.allowedAssets;
    const filteredAssets = filterResult.filteredAssets;
    const assetDescriptions = {};
    [...allowedAssets, ...filteredAssets].forEach(assetType => {
      const description = getAssetAudienceDescription(assetType, primaryAudience);
      const reasoning = getAssetAudienceReasoning(assetType, primaryAudience);
      if (description) {
        assetDescriptions[assetType] = {
          name: description.name,
          description: description.description,
          examples: description.examples,
          complianceNotes: description.complianceNotes,
          reasoning
        };
      } else {
        assetDescriptions[assetType] = {
          name: assetType.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
          description: `${assetType} content for ${primaryAudience} audience`,
          examples: [`Example ${assetType} for ${primaryAudience}`],
          complianceNotes: ['Standard compliance review required'],
          reasoning
        };
      }
    });
    const smartRecommendations = generateSmartRecommendations(
      allowedAssets,
      filteredAssets,
      primaryAudience,
      intakeData
    );
    return {
      allowedAssets,
      filteredAssets,
      assetDescriptions,
      smartRecommendations,
      audienceGuidance: filterResult.audienceGuidance
    };
  }, [primaryAudience, intakeData, availableAssets]);
  return intelligentFilter;
};

function generateSmartRecommendations(
  allowedAssets,
  filteredAssets,
  audience,
  intakeData
) {
  const recommendations = {
    recommended: [],
    alternatives: [],
    warnings: []
  };
  switch (audience) {
    case 'HCP':
      const hcpPriority = ['digital-sales-aid', 'rep-triggered-email', 'mass-email'];
      recommendations.recommended = allowedAssets.filter(asset => hcpPriority.includes(asset));
      if (filteredAssets.includes('patient-email')) {
        recommendations.alternatives.push('patient-email');
        recommendations.warnings.push('Consider patient education materials as supplementary resources');
      }
      break;
    case 'Patient':
      const patientPriority = ['patient-email', 'website-landing-page', 'social-media-post'];
      recommendations.recommended = allowedAssets.filter(asset => patientPriority.includes(asset));
      if (filteredAssets.includes('mass-email')) {
        recommendations.alternatives.push('mass-email');
        recommendations.warnings.push('HCP-focused emails may not be suitable for patient audiences');
      }
      break;
    case 'Caregiver':
      const caregiverPriority = ['caregiver-email', 'website-landing-page', 'social-media-post'];
      recommendations.recommended = allowedAssets.filter(asset => caregiverPriority.includes(asset));
      if (allowedAssets.includes('patient-email')) {
        recommendations.alternatives.push('patient-email');
        recommendations.warnings.push('Patient resources may also be relevant for caregivers');
      }
      break;
    case 'Other':
      recommendations.recommended = allowedAssets.slice(0, 3);
      break;
  }
  if (intakeData) {
    if (intakeData.indication) {
      addIndicationSpecificRecommendations(recommendations, intakeData.indication, allowedAssets);
    }
    if (intakeData.targetMarkets?.length) {
      addMarketSpecificRecommendations(recommendations, intakeData.targetMarkets, allowedAssets);
    }
    if (intakeData.primaryObjective) {
      addObjectiveBasedRecommendations(recommendations, intakeData.primaryObjective, allowedAssets);
    }
  }
  return recommendations;
}
function addIndicationSpecificRecommendations(
  recommendations,
  indication,
  allowedAssets
) {
  const rareDisease = ['IPF', 'SSc-ILD', 'Progressive-Fibrosing-ILD'].includes(indication);
  if (rareDisease && allowedAssets.includes('website-landing-page')) {
    if (!recommendations.recommended.includes('website-landing-page')) {
      recommendations.alternatives.push('website-landing-page');
      recommendations.warnings.push('Rare disease indications benefit from comprehensive web resources');
    }
  }
}
function addMarketSpecificRecommendations(
  recommendations,
  markets,
  allowedAssets
) {
  if (markets.includes('EU') && allowedAssets.includes('social-media-post')) {
    recommendations.warnings.push('Consider EU-specific social media regulations and preferences');
  }
  if (markets.includes('US') && allowedAssets.includes('digital-sales-aid')) {
    if (!recommendations.recommended.includes('digital-sales-aid')) {
      recommendations.alternatives.push('digital-sales-aid');
      recommendations.warnings.push('US market has strong adoption of digital sales tools');
    }
  }
}
function addObjectiveBasedRecommendations(
  recommendations,
  objective,
  allowedAssets
) {
  const lowerObjective = objective.toLowerCase();
  if (lowerObjective.includes('educat') && allowedAssets.includes('website-landing-page')) {
    if (!recommendations.recommended.includes('website-landing-page')) {
      recommendations.alternatives.push('website-landing-page');
    }
  }
  if (lowerObjective.includes('awareness') && allowedAssets.includes('social-media-post')) {
    if (!recommendations.recommended.includes('social-media-post')) {
      recommendations.alternatives.push('social-media-post');
      recommendations.warnings.push('Social media is highly effective for awareness campaigns');
    }
  }
  if (lowerObjective.includes('engagement') && allowedAssets.includes('patient-email')) {
    recommendations.warnings.push('Email channels provide direct engagement opportunities');
  }
}
