/**
 * @typedef {'mass-email' | 'rep-triggered-email' | 'patient-email' | 'caregiver-email' | 'social-media-post' | 'website-landing-page' | 'digital-sales-aid'} AssetType
 * @typedef {'HCP' | 'Patient' | 'Caregiver' | 'Other'} AudienceType
 * * @typedef {object} IntakeData
 * @property {string} [brand]
 * @property {string} [indication]
 * // Add other potential fields from IntakeData here if needed
 * * @typedef {object} SmartContentSuggestion
 * @property {string} keyMessage
 * @property {string} callToAction
 * @property {string[]} messagingTips
 * @property {string[]} complianceGuidance
 * @property {string[]} channelOptimization
 */

// Placeholder for external dependencies - these functions are assumed to be defined elsewhere
// const getAssetAudienceDescription = (assetType, audience) => ({ channelRecommendations: [] });
// const getComplianceRequirements = (assetType, audience) => ([]);
import { getAssetAudienceDescription, getComplianceRequirements } from './audienceAssetMappingService';

/**
 * Generate audience-specific content suggestions
 * @param {AssetType} assetType
 * @param {AudienceType} audience
 * @param {Partial<IntakeData>} intakeData
 * @returns {SmartContentSuggestion}
 */
export const generateAudienceSpecificContent = (
  assetType,
  audience,
  intakeData
) => {
  const description = getAssetAudienceDescription(assetType, audience);
  const compliance = getComplianceRequirements(assetType, audience);
  
  // Generate key message suggestions based on audience
  const keyMessage = generateKeyMessageSuggestion(assetType, audience, intakeData);
  
  // Generate call-to-action suggestions
  const callToAction = generateCTASuggestion(assetType, audience, intakeData);
  
  // Generate messaging tips
  const messagingTips = generateMessagingTips(assetType, audience);
  
  // Generate compliance guidance
  const complianceGuidance = generateComplianceGuidance(assetType, audience, compliance);
  
  // Generate channel optimization tips
  const channelOptimization = generateChannelOptimization(
    assetType,
    audience,
    description?.channelRecommendations || []
  );

  return {
    keyMessage,
    callToAction,
    messagingTips,
    complianceGuidance,
    channelOptimization
  };
};

/**
 * Generate audience-appropriate key message suggestions
 * @param {AssetType} assetType
 * @param {AudienceType} audience
 * @param {Partial<IntakeData>} intakeData
 * @returns {string}
 */
const generateKeyMessageSuggestion = (
  assetType,
  audience,
  intakeData
) => {
  const brand = intakeData.brand || '[Brand Name]';
  const indication = intakeData.indication || '[Indication]';
  
  const suggestions = {
    'HCP': {
      'mass-email': `${brand} delivers proven efficacy in ${indication} with a well-established safety profile`,
      'rep-triggered-email': `Clinical data supports ${brand} as a trusted treatment option for your ${indication} patients`,
      'social-media-post': `Latest clinical insights on ${brand} for ${indication} management`,
      'website-landing-page': `Comprehensive ${brand} prescribing information and clinical data for ${indication}`,
      'digital-sales-aid': `${brand}: Transforming ${indication} patient outcomes with proven clinical results`
    },
    'Patient': {
      'patient-email': `Understanding ${indication}: Your guide to living well with your condition`,
      'social-media-post': `Living with ${indication}? Learn about treatment options and support resources`,
      'website-landing-page': `Understanding ${indication}: Your guide to treatment options and living well`
    },
    'Caregiver': {
      'caregiver-email': `Supporting someone with ${indication}? Resources and tools to help you on your caregiving journey`,
      'social-media-post': `Supporting someone with ${indication}? Find resources and tips for caregivers`,
      'website-landing-page': `Caregiver resources for ${indication}: Tools and support for your journey`
    },
    'Other': {
      'mass-email': `Important information about ${brand} for ${indication}`,
      'rep-triggered-email': `${brand} clinical updates for ${indication}`,
      'patient-email': `${indication} education and support resources`,
      'caregiver-email': `Caregiver support for ${indication}`,
      'social-media-post': `${indication} awareness and education`,
      'website-landing-page': `${brand} information and resources`,
      'digital-sales-aid': `${brand} for ${indication}: Key information`
    }
  };

  return suggestions[audience]?.[assetType] || suggestions['Other'][assetType] || `Key message for ${brand} in ${indication}`;
};

/**
 * Generate audience-appropriate CTA suggestions
 * @param {AssetType} assetType
 * @param {AudienceType} audience
 * @param {Partial<IntakeData>} intakeData
 * @returns {string}
 */
const generateCTASuggestion = (
  assetType,
  audience,
  intakeData
) => {
  const suggestions = {
    'HCP': {
      'mass-email': 'Learn More About Prescribing Information',
      'rep-triggered-email': 'Request Clinical Data Package',
      'social-media-post': 'Read Full Clinical Study',
      'website-landing-page': 'Access Prescribing Information',
      'digital-sales-aid': 'Discuss with Your Representative'
    },
    'Patient': {
      'patient-email': 'Access Patient Resources',
      'social-media-post': 'Talk to Your Doctor',
      'website-landing-page': 'Find a Healthcare Provider'
    },
    'Caregiver': {
      'caregiver-email': 'Get Caregiver Support',
      'social-media-post': 'Get Support Resources',
      'website-landing-page': 'Access Caregiver Tools'
    },
    'Other': {
      'mass-email': 'Learn More',
      'rep-triggered-email': 'Request Information',
      'patient-email': 'Get Support',
      'caregiver-email': 'Find Resources',
      'social-media-post': 'Read More',
      'website-landing-page': 'Get Started',
      'digital-sales-aid': 'Contact Us'
    }
  };

  return suggestions[audience]?.[assetType] || suggestions['Other'][assetType] || 'Take Action';
};

/**
 * Generate messaging tips specific to audience and asset type
 * @param {AssetType} assetType
 * @param {AudienceType} audience
 * @returns {string[]}
 */
const generateMessagingTips = (assetType, audience) => {
  const tips = {
    'HCP': [
      'Use clinical, evidence-based language',
      'Include data points and statistics',
      'Reference peer-reviewed studies',
      'Maintain professional tone throughout',
      'Address specific clinical considerations'
    ],
    'Patient': [
      'Use clear, jargon-free language',
      'Focus on benefits and outcomes',
      'Include emotional support elements',
      'Provide practical, actionable advice',
      'Address common patient concerns'
    ],
    'Caregiver': [
      'Acknowledge caregiver burden and challenges',
      'Provide practical support resources',
      'Use empathetic, understanding tone',
      'Include caregiver-specific benefits',
      'Offer community connection opportunities'
    ],
    'Other': [
      'Tailor language to your specific audience',
      'Ensure clear, compelling messaging',
      'Include relevant call-to-action',
      'Maintain appropriate tone',
      'Focus on audience-specific benefits'
    ]
  };

  return tips[audience] || tips['Other'];
};

/**
 * Generate compliance guidance
 * @param {AssetType} assetType
 * @param {AudienceType} audience
 * @param {string[]} complianceRequirements
 * @returns {string[]}
 */
const generateComplianceGuidance = (
  assetType,
  audience,
  complianceRequirements
) => {
  const baseGuidance = [
    'Review all content for accuracy and compliance',
    'Ensure appropriate disclaimers are included',
    'Verify regulatory requirements for target markets'
  ];

  const audienceSpecificGuidance = {
    'HCP': [
      'Include fair balance and important safety information',
      'Ensure MLR approval before deployment',
      'Maintain professional medical standards'
    ],
    'Patient': [
      'Use patient-friendly language for disclaimers',
      'Include appropriate health information warnings',
      'Ensure balanced presentation of information'
    ],
    'Caregiver': [
      'Include caregiver-relevant safety considerations',
      'Provide appropriate medical disclaimer language',
      'Ensure sensitivity to caregiver concerns'
    ]
  };

  return [
    ...baseGuidance,
    ...(audienceSpecificGuidance[audience] || []),
    ...complianceRequirements
  ];
};

/**
 * Generate channel optimization recommendations
 * @param {AssetType} assetType
 * @param {AudienceType} audience
 * @param {string[]} recommendedChannels
 * @returns {string[]}
 */
const generateChannelOptimization = (
  assetType,
  audience,
  recommendedChannels
) => {
  const baseOptimization = [
    'Optimize content for mobile viewing',
    'Ensure accessibility compliance',
    'Test across different devices and platforms'
  ];

  const assetSpecificOptimization = {
    'mass-email': [
      'Use responsive email templates',
      'Optimize subject lines for deliverability',
      'Include clear unsubscribe options'
    ],
    'rep-triggered-email': [
      'Personalize content for individual recipients',
      'Ensure CRM integration compatibility',
      'Include tracking and analytics'
    ],
    'patient-email': [
      'Use patient-friendly language and tone',
      'Include educational value in every message',
      'Ensure mobile-first design approach',
      'Provide clear privacy and unsubscribe options'
    ],
    'caregiver-email': [
      'Address caregiver-specific concerns and needs',
      'Include emotional support elements',
      'Provide actionable resources and tools',
      'Use empathetic and understanding tone'
    ],
    'social-media-post': [
      'Adapt content for platform-specific formats',
      'Use appropriate hashtags and mentions',
      'Optimize for engagement and sharing'
    ],
    'website-landing-page': [
      'Implement SEO best practices',
      'Ensure fast loading times',
      'Include clear navigation and CTAs'
    ],
    'digital-sales-aid': [
      'Optimize for tablet viewing',
      'Include interactive elements',
      'Ensure offline accessibility'
    ]
  };

  return [
    ...baseOptimization,
    ...(assetSpecificOptimization[assetType] || []),
    ...recommendedChannels.map(channel => `Optimize for ${channel} platform requirements`)
  ];
};