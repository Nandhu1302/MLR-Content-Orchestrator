
// Centralized mapping logic for opportunity-to-intake flow

export const mapOpportunityTypeToObjective = (
  opportunityType,
  audience
) => {
  // Determine if HCP or Patient/Caregiver audience
  const isHCP = !audience ||
    audience.includes('Physician') ||
    audience.includes('Pharmacist') ||
    audience.includes('Nurse') ||
    audience.includes('HCP');
  
  const isCaregiver = audience?.includes('Caregiver');
  
  // HCP-specific objective mappings (match actual form values)
  const hcpMapping = {
    'market_movement': 'product-awareness',
    'competitive_trigger': 'competitive-differentiation',
    'sentiment_concern': 'clinical-education',
    'emerging_topic': 'evidence-communication',
    'amplification_opportunity': 'product-awareness',
    'quick_win': 'practice-support'
  };
  
  // Patient-specific objective mappings
  const patientMapping = {
    'market_movement': 'disease-awareness',
    'competitive_trigger': 'treatment-education',
    'sentiment_concern': 'adherence-support',
    'emerging_topic': 'disease-awareness',
    'amplification_opportunity': 'community-building',
    'quick_win': 'treatment-education'
  };
  
  // Caregiver-specific objective mappings
  const caregiverMapping = {
    'market_movement': 'caregiver-education',
    'competitive_trigger': 'caregiver-education',
    'sentiment_concern': 'self-care-support',
    'emerging_topic': 'support-resources',
    'amplification_opportunity': 'community-building',
    'quick_win': 'support-resources'
  };
  
  if (isCaregiver) {
    return caregiverMapping[opportunityType] || 'caregiver-education';
  }
  
  return isHCP 
    ? (hcpMapping[opportunityType] || 'product-awareness')
    : (patientMapping[opportunityType] || 'disease-awareness');
};

export const generateIntelligentCTA = (opportunity) => {
  if (!opportunity) return 'Learn more';
  
  const brandName = opportunity?.title?.match(/^([A-Za-z]+)/)?.[1] || 'this treatment';
  
  switch (opportunity?.opportunity_type) {
    case 'competitive_trigger':
      return `Learn how ${brandName} compares`;
    case 'market_movement':
      return `See the latest prescribing data for ${brandName}`;
    case 'sentiment_concern':
      return `Get patient support resources`;
    case 'emerging_topic':
      return `Discover new insights about ${brandName}`;
    case 'amplification_opportunity':
      return `Join the conversation about ${brandName}`;
    case 'quick_win':
      return `Start your ${brandName} journey today`;
    default:
      return `Learn more about ${brandName}`;
  }
};

export const getOpportunityTypeLabel = (opportunityType) => {
  const labels = {
    'market_movement': 'Market Movement',
    'competitive_trigger': 'Competitive Response',
    'sentiment_concern': 'Sentiment Response',
    'emerging_topic': 'Emerging Topic',
    'amplification_opportunity': 'Amplification',
    'quick_win': 'Quick Win'
  };
  return labels[opportunityType] || opportunityType?.replace(/_/g, ' ');
};

export const getObjectiveLabel = (objective) => {
  const labels = {
    // HCP objectives
    'clinical-education': 'Clinical Education',
    'evidence-communication': 'Evidence Communication',
    'practice-support': 'Practice Support',
    'product-awareness': 'Product Awareness',
    'competitive-differentiation': 'Competitive Differentiation',
    // Patient objectives
    'disease-awareness': 'Disease Awareness',
    'treatment-education': 'Treatment Education',
    'adherence-support': 'Adherence Support',
    'community-building': 'Community Building',
    // Caregiver objectives
    'caregiver-education': 'Caregiver Education',
    'support-resources': 'Support Resources',
    'self-care-support': 'Self-Care Support',
    // Legacy mappings for backwards compatibility
    'awareness': 'Build Awareness',
    'competitive-positioning': 'Competitive Positioning',
    'patient-education': 'Patient Education',
    'thought-leadership': 'Thought Leadership',
    'engagement': 'Drive Engagement',
    'conversion': 'Drive Conversion'
  };
  return labels[objective] || objective;
};