
// ============================================
// Activity-Asset Mappings Configuration
// Maps event activities to recommended asset types
// ============================================

// (Removed) export interface ActivityAssetMapping { ... }

export const ACTIVITY_ASSET_MAPPINGS = [
  {
    activity: 'booth',
    displayName: 'Booth Presence',
    primaryAssetTypes: ['digital-sales-aid', 'leave-behind'],
    secondaryAssetTypes: ['brochure', 'one-pager'],
    description: 'Booth materials optimized for quick engagement and takeaway value',
    estimatedEngagementLift: 32,
  },
  {
    activity: 'podium',
    displayName: 'Podium Presentation',
    primaryAssetTypes: ['presentation'],
    secondaryAssetTypes: ['speaker-notes', 'handout'],
    description: 'Evidence-dense presentation materials for formal speaking slots',
    estimatedEngagementLift: 45,
  },
  {
    activity: 'workshop',
    displayName: 'Workshop Session',
    primaryAssetTypes: ['interactive-presentation', 'workbook'],
    secondaryAssetTypes: ['handout', 'case-study'],
    description: 'Interactive materials for hands-on learning sessions',
    estimatedEngagementLift: 38,
  },
  {
    activity: 'advisory_board',
    displayName: 'Advisory Board',
    primaryAssetTypes: ['clinical-briefing', 'discussion-guide'],
    secondaryAssetTypes: ['pre-read', 'summary-report'],
    description: 'Clinical discussion materials for expert advisory meetings',
    estimatedEngagementLift: 58,
  },
  {
    activity: 'lunch_symposium',
    displayName: 'Lunch Symposium',
    primaryAssetTypes: ['presentation', 'clinical-summary'],
    secondaryAssetTypes: ['leave-behind', 'follow-up-email'],
    description: 'Concise clinical presentations for meal-based educational sessions',
    estimatedEngagementLift: 41,
  },
  {
    activity: 'poster',
    displayName: 'Poster Presentation',
    primaryAssetTypes: ['scientific-poster', 'poster-summary'],
    secondaryAssetTypes: ['one-pager', 'digital-version'],
    description: 'Scientific poster materials with supporting documentation',
    estimatedEngagementLift: 28,
  },
  {
    activity: 'pre_event_email',
    displayName: 'Pre-Event Email',
    primaryAssetTypes: ['email-invitation', 'event-preview'],
    secondaryAssetTypes: ['calendar-invite', 'teaser-content'],
    description: 'Pre-event communications to drive attendance and engagement',
    estimatedEngagementLift: 34,
  },
  {
    activity: 'post_event_email',
    displayName: 'Post-Event Follow-Up',
    primaryAssetTypes: ['follow-up-email', 'event-recap'],
    secondaryAssetTypes: ['resource-links', 'survey'],
    description: 'Post-event materials to maintain momentum and drive action',
    estimatedEngagementLift: 48,
  },
  {
    activity: 'rep_visit',
    displayName: 'Rep Visit',
    primaryAssetTypes: ['digital-sales-aid', 'rep-triggered-email'],
    secondaryAssetTypes: ['leave-behind', 'sample-request'],
    description: 'Rep-enabled materials for one-on-one HCP interactions',
    estimatedEngagementLift: 52,
  },
  {
    activity: 'webinar',
    displayName: 'Virtual Event/Webinar',
    primaryAssetTypes: ['webinar-presentation', 'interactive-q-and-a'],
    secondaryAssetTypes: ['downloadable-resources', 'follow-up-survey'],
    description: 'Virtual event materials with interactive components',
    estimatedEngagementLift: 39,
  },
];

export const getAssetTypesForActivities = (activities) => {
  const assetTypes = new Set();

  activities.forEach(activity => {
    const mapping = ACTIVITY_ASSET_MAPPINGS.find(m => m.activity === activity);
    if (mapping) {
      mapping.primaryAssetTypes.forEach(type => assetTypes.add(type));
      mapping.secondaryAssetTypes.forEach(type => assetTypes.add(type));
    }
  });

  return Array.from(assetTypes);
};

export const getRecommendedAssetTypesForActivities = (activities) => {
  const primary = new Set();
  const secondary = new Set();
  let totalLift = 0;

  activities.forEach(activity => {
    const mapping = ACTIVITY_ASSET_MAPPINGS.find(m => m.activity === activity);
    if (mapping) {
      mapping.primaryAssetTypes.forEach(type => primary.add(type));
      mapping.secondaryAssetTypes.forEach(type => secondary.add(type));
      totalLift += mapping.estimatedEngagementLift;
    }
  });

  return {
    primary: Array.from(primary),
    secondary: Array.from(secondary),
    estimatedLift: activities.length > 0 ? Math.round(totalLift / activities.length) : 0,
  };
};
