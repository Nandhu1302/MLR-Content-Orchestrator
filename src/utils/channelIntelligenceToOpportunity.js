
/**
 * Centralized transformer for converting channel intelligence context to opportunity format
 * This ensures consistent pre-filling of intake forms from any channel-specific button
 */
export const mapAudienceToIntakeType = (audienceType, audienceSegment) => {
  if (!audienceType) return 'Physician-Specialist';
  const lower = audienceType.toLowerCase().trim();
  if (audienceSegment) {
    const segmentLower = audienceSegment.toLowerCase();
    if (segmentLower.includes('infectious') || segmentLower.includes('hiv')) return 'Physician-Specialist';
    if (segmentLower.includes('primary care')) return 'Physician-PCP';
    if (segmentLower.includes('pharmacist')) return 'Pharmacist';
    if (segmentLower.includes('nurse')) return 'Nurse-RN';
    if (segmentLower.includes('newly diagnosed') || segmentLower.includes('living with')) return 'Patient';
    if (segmentLower.includes('caregiver')) return 'Caregiver-Family';
  }
  if (lower === 'hcp' || lower.includes('physician') || lower.includes('specialist')) return 'Physician-Specialist';
  if (lower === 'patient' || lower === 'patients') return 'Patient';
  if (lower.includes('caregiver')) return 'Caregiver-Family';
  if (lower.includes('nurse')) return 'Nurse-RN';
  if (lower.includes('pharmacist')) return 'Pharmacist';
  return 'Physician-Specialist';
};

export const mapChannelToAssetTypes = (channel) => {
  const channelLower = channel.toLowerCase().trim();
  switch (channelLower) {
    case 'website':
      return ['website-landing-page'];
    case 'email':
      return ['mass-email'];
    case 'social':
      return ['social-media-post'];
    case 'rep-enabled':
      return ['digital-sales-aid', 'rep-triggered-email'];
    default:
      return ['website-landing-page'];
  }
};

export const generateObjective = (channel, audienceType) => {
  const isHCP = !audienceType || audienceType.toLowerCase().includes('hcp') || audienceType.toLowerCase().includes('physician');
  const channelLower = channel.toLowerCase();
  if (channelLower === 'website') {
    return isHCP ? 'clinical-education' : 'disease-awareness';
  }
  if (channelLower === 'email') {
    return isHCP ? 'product-awareness' : 'treatment-education';
  }
  if (channelLower === 'social') {
    return isHCP ? 'thought-leadership' : 'disease-awareness';
  }
  if (channelLower === 'rep-enabled') {
    return 'practice-support';
  }
  return isHCP ? 'product-awareness' : 'disease-awareness';
};

export const generateCTA = (insightType, channel) => {
  const ctaMap = {
    'website': {
      'top-pages': 'Learn More',
      'search-terms': 'Get Information',
      'downloads': 'Download Now',
      'default': 'Learn More'
    },
    'email': {
      'subject-lines': 'Open Email',
      'campaigns': 'Read More',
      'segments': 'Learn More',
      'default': 'Read More'
    },
    'social': {
      'trending-topics': 'Join the Conversation',
      'platforms': 'Follow Us',
      'mentions': 'Share',
      'default': 'Learn More'
    },
    'rep-enabled': {
      'content-effectiveness': 'Request Information',
      'nbas': 'Schedule Meeting',
      'heatmap': 'Contact Rep',
      'default': 'Request Sample'
    }
  };
  const channelCTAs = ctaMap[channel.toLowerCase()] || ctaMap['website'];
  return channelCTAs[insightType] || channelCTAs['default'] || 'Learn More';
};

const insightMetadataMap = {
  'website': {
    'top-pages': {
      title: 'Website Content - Optimize High-Traffic Pages',
      opportunityType: 'content_optimization',
      keyMessageTemplate: 'Access evidence-based clinical resources to support informed treatment decisions.'
    },
    'search-terms': {
      title: 'Website Content - Address Search Intent',
      opportunityType: 'content_gap',
      keyMessageTemplate: 'Get the answers you need about treatment options and patient outcomes.'
    }
  },
  'email': {
    'subject-lines': {
      title: 'Email Campaign - Optimized Subject Lines',
      opportunityType: 'email_optimization',
      keyMessageTemplate: 'Stay informed with the latest clinical insights and practice-changing data.'
    }
  },
  'social': {
    'trending-topics': {
      title: 'Social Content - Trending Topic Amplification',
      opportunityType: 'trending_amplification',
      keyMessageTemplate: 'Join the conversation on emerging treatment approaches and clinical outcomes.'
    }
  },
  'rep-enabled': {
    'content-effectiveness': {
      title: 'Sales Aid - Based on Top Performers',
      opportunityType: 'field_content_creation',
      keyMessageTemplate: 'Get personalized support and resources to enhance patient care.'
    }
  }
};

export const transformChannelIntelligenceToOpportunity = (context, filters, aiEnhanced) => {
  const channel = context.channel;
  const insight = context.insight;
  const channelLower = channel.toLowerCase();
  const metadata = insightMetadataMap[channelLower]?.[insight] || {
    title: `${channel} Content Generation`,
    opportunityType: 'content_creation',
    keyMessageTemplate: 'Create optimized {channel} content based on intelligence insights'
  };
  const mappedAudience = mapAudienceToIntakeType(filters.audienceType || context.audienceType, filters.audienceSegment || context.audienceSegment);
  let keyMessage = aiEnhanced?.enhancedKeyMessage || metadata.keyMessageTemplate;
  if (!aiEnhanced?.enhancedKeyMessage) {
    if (context.pages?.length) {
      const topPage = context.pages[0];
      keyMessage = keyMessage.replace('{avgScrollDepth}', String(topPage.avgScrollDepth || 0)).replace('{visits}', String(topPage.visits || 0));
    }
    if (context.terms?.length) {
      keyMessage = keyMessage.replace('{topTerm}', context.terms[0].term || '');
    }
    if (context.topSubjects?.length) {
      keyMessage = keyMessage.replace('{openRate}', String(context.topSubjects[0].openRate || 0));
    }
    if (context.topics?.length) {
      keyMessage = keyMessage.replace('{topic}', context.topics[0].topic || '').replace('{volume}', String(context.topics[0].volume || 0));
    }
    if (context.topContent?.length) {
      keyMessage = keyMessage.replace('{engagement}', String(context.topContent[0].avgEngagement || 0));
    }
    keyMessage = keyMessage.replace('{channel}', channel);
  }
  const recommendedActions = [];
  if (context.pages?.length) {
    context.pages.slice(0, 3).forEach(page => {
      recommendedActions.push({ action: `Optimize "${page.page}" - ${page.visits} visits, ${page.avgScrollDepth}% scroll depth` });
    });
  }
  if (context.terms?.length) {
    context.terms.slice(0, 3).forEach(term => {
      recommendedActions.push({ action: `Create content for search term "${term.term}" (${term.count} searches)` });
    });
  }
  if (context.topSubjects?.length) {
    context.topSubjects.slice(0, 3).forEach(subj => {
      recommendedActions.push({ action: `Use subject line pattern: "${subj.subject}" (${subj.openRate}% open rate)` });
    });
  }
  if (context.topics?.length) {
    context.topics.slice(0, 3).forEach(topic => {
      recommendedActions.push({ action: `Address "${topic.topic}" - ${topic.volume} mentions, ${topic.growth > 0 ? '+' : ''}${topic.growth}% growth` });
    });
  }
  if (context.topContent?.length) {
    context.topContent.slice(0, 3).forEach(content => {
      recommendedActions.push({ action: `Model content after "${content.content}" - ${content.avgEngagement} engagement score` });
    });
  }
  if (recommendedActions.length === 0) {
    recommendedActions.push({ action: `Create optimized ${channel} content` });
  }
  return {
    title: metadata.title,
    opportunity_type: metadata.opportunityType,
    target_audiences: [filters.audienceType || context.audienceType || 'HCP'],
    suggested_channels: [channel],
    recommended_actions: recommendedActions,
    prefilledObjective: generateObjective(channel, filters.audienceType),
    prefilledKeyMessage: keyMessage,
    prefilledCTA: aiEnhanced?.cta || generateCTA(insight, channel),
    prefilledAudience: mappedAudience,
    prefilledAssetTypes: mapChannelToAssetTypes(channel),
    prefilledSubjectLine: aiEnhanced?.subjectLine,
    prefilledPreheader: aiEnhanced?.preheader,
    prefilledHashtags: aiEnhanced?.hashtags,
    prefilledTalkingPoints: aiEnhanced?.talkingPoints,
    prefilledSeoHeadline: aiEnhanced?.seoHeadline,
    contentTips: aiEnhanced?.contentTips || [],
    aiEnhancementRationale: aiEnhanced?.rationale,
    _aiEnhanced: aiEnhanced?.aiEnhanced || false,
    insight,
    channel
  };
};