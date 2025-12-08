
// Analysis utilities for initial story parsing
export function buildInitialAnalysisPrompt(userStory, brandContext) {
  const brand = brandContext.brand ?? {};
  const claims = brandContext.claims ?? [];
  const patterns = brandContext.patterns ?? [];
  return `You are an expert pharmaceutical marketing consultant analyzing a user's content creation story.
USER'S STORY:
${userStory}
BRAND CONTEXT:
• Brand: ${brand.brand_name ?? 'Biktarvy'}
• Therapeutic Area: ${brand.therapeutic_area ?? 'HIV'}
• Available Claims: ${claims.length} MLR-approved clinical claims
• Success Patterns: ${patterns.length} proven campaign patterns
YOUR TASK:
1. Carefully analyze the story to extract ALL details mentioned
2. Identify: occasion type, event details (name, type, region, activities), audience (type, specialties, seniority level), therapeutic area, brand mentions, timeline/urgency
3. Use the analyze_story tool to return structured data
4. Be thorough - capture region names, specific activities (booth, podium), audience characteristics (KOL, specialist), event names
FOCUS ON:
- Event details: Name, type (conference/congress), region (Midwest/Northeast), duration, specific activities
- Audience: Are they KOLs? Specialists? What's their role?
- Brand mentions: Did they mention Gilead, Biktarvy, or competitors?
- Timeline: When is the event? How urgent is the need?
- Therapeutic area: Is HIV explicitly or implicitly mentioned?
Return comprehensive analysis via tool calling.`;
}

export function generateSmartGreeting(story, intent, brandContext) {
  // If no meaningful intent was extracted, return empty string (clarification handled at higher level)
  if (!intent || intent.needsClarification || !intent.confidence || intent.confidence < 0.3) {
    return '';
  }
  const brand = brandContext.brand ?? {};
  const claims = brandContext.claims ?? [];
  const segments = brandContext.segments ?? [];
  const patterns = brandContext.patterns ?? [];
  const parts = [];

  // Always acknowledge specific story details first
  const region = intent.region ?? intent.eventDetails?.region;
  const audience = intent.audience?.primaryType ?? intent.audienceSeniority ?? 'HCP';
  const occasion = intent.occasion;

  // Detect if this is an open-ended question
  const isOpenQuestion = story.toLowerCase().includes('what do you suggest')
    || story.toLowerCase().includes('what should')
    || story.toLowerCase().includes('recommend');

  // Find the most relevant audience segment
  const matchingSegment = segments.find((s) =>
    s.segment_name?.toLowerCase().includes('specialist')
    || s.segment_name?.toLowerCase().includes('infectious')
  ) || segments[0];

  // Select most relevant claim
  const keyClaim = claims.find((c) =>
    c.claim_text?.toLowerCase().includes('resistance')
    || c.claim_text?.toLowerCase().includes('long-term')
    || c.claim_text?.toLowerCase().includes('durability')
  ) || claims[0];

  // ALWAYS start by acknowledging user's story specifics
  if (isOpenQuestion) {
    parts.push(`🎯 **Great question!** Let me build you a strategy`);
    if (region) parts.push(` for ${region}`);
    if (audience) parts.push(` targeting ${audience === 'kol' ? 'KOLs/Specialists' : audience}s`);
    parts.push(`.`);
  } else if (occasion === 'event') {
    parts.push(`🎯 **Perfect!** I see you're planning`);
    if (intent.eventDetails?.eventType) parts.push(` a ${intent.eventDetails.eventType}`);
    if (region) parts.push(` in ${region}`);
    if (audience) parts.push(` for ${audience === 'kol' ? 'KOLs/Specialists' : audience}s`);
    parts.push(`.`);
  } else if (occasion === 'education') {
    parts.push(`📚 **Excellent focus on education**`);
    if (region) parts.push(` for ${region}`);
    if (audience) parts.push(` targeting ${audience}s`);
    parts.push(`.`);
  } else if (occasion === 'competitive') {
    parts.push(`⚔️ **Strategic competitive response**`);
    if (region) parts.push(` for ${region}`);
    parts.push(` - smart timing.`);
  } else {
    // Generic acknowledgment
    parts.push(`✨ **Let's create something impactful**`);
    if (audience) parts.push(` for ${audience}s`);
    if (region) parts.push(` in ${region}`);
    parts.push(`.`);
  }

  parts.push(`\n\n`);

  // Add brand intelligence context
  if (brand.brand_name) {
    parts.push(`📊 **${brand.brand_name} Intelligence:**\n`);
    parts.push(`• Market Position: Strong momentum in ${brand.therapeutic_area ?? 'HIV'}\n`);
    if (claims.length > 0) {
      parts.push(`• ${claims.length} MLR-approved claims available\n`);
    }
    if (patterns.length > 0) {
      const topPattern = patterns[0];
      if (topPattern.avg_performance_lift) {
        const lift = Math.round(topPattern.avg_performance_lift * 100);
        parts.push(`• Best Channel Combo: Email + Rep Visit (+${lift}% lift)\n`);
      }
    }
    parts.push(`\n`);
  }

  // For open-ended questions, provide proactive recommendation
  if (isOpenQuestion) {
    parts.push(`**My recommended approach:**\n\n`);

    // Recommendation 1: Email campaign
    parts.push(`📧 **Email Campaign**\n`);
    if (matchingSegment?.decision_factors) {
      const factors = matchingSegment.decision_factors;
      const primaryFactor = factors.primary ?? 'clinical evidence';
      parts.push(`Focus on ${primaryFactor.toLowerCase()}`);
    }
    if (keyClaim) {
      parts.push(` - ${claims.length}+ approved claims emphasizing resistance data`);
    }
    parts.push(`\n\n`);

    // Recommendation 2: Audience-specific materials
    if (audience.toLowerCase().includes('patient')) {
      parts.push(`📋 **Patient Education**\nAdherence-focused materials for newly diagnosed patients\n\n`);
    } else {
      parts.push(`🤝 **Rep-Enabled Follow-up**\nSales aids with clinical depth for high-value ${audience}s\n\n`);
    }

    // Add ONE clarifying question
    if (!intent.audience || !intent.audienceSeniority) {
      parts.push(`To customize this strategy, help me understand:\n`);
      parts.push(`**For ${audience}s:** Are you targeting specialists specifically, or a broader audience?`);
    } else if (!intent.goals || intent.goals.length === 0) {
      parts.push(`What's your primary goal: Drive awareness, support prescribing, or educate on specific data?`);
    } else {
      parts.push(`**Ready to generate these materials?**`);
    }
  }
  // For events with details, give tactical recommendations
  else if (occasion === 'event' && intent.eventDetails?.activities) {
    const activities = intent.eventDetails.activities;
    const hasPodium = activities.some((a) => a.toLowerCase().includes('podium'));
    const hasBooth = activities.some((a) => a.toLowerCase().includes('booth'));
    parts.push(`**Tactical recommendations:**\n\n`);
    if (hasPodium) {
      parts.push(`📊 **Podium Presentation**\nEvidence-dense slides focusing on resistance data`);
      if (matchingSegment?.messaging_preferences?.claims_emphasis) {
        parts.push(` - ${matchingSegment.messaging_preferences.claims_emphasis}`);
      }
      parts.push(`\n\n`);
    }
    if (hasBooth) {
      parts.push(`🎪 **Booth Materials**\nLeave-behind sales aids with key efficacy summary\n\n`);
    }
    parts.push(`📧 **Post-Event Email**\nFollow-up with clinical takeaways and resources\n\n`);
    parts.push(`**Shall I prepare these ${activities.length} asset types?**`);
  }
  // For other occasions, ask ONE clarifying question
  else {
    if (!intent.audience || !intent.audienceSeniority) {
      parts.push(`To build the right strategy, help me understand:\n`);
      parts.push(`**Who's your primary audience?** HIV specialists, broader HCPs, or patients?`);
    } else if (!intent.goals || intent.goals.length === 0) {
      parts.push(`**What's your primary goal?** Drive awareness, support prescribing decisions, or educate on specific data?`);
    } else {
      parts.push(`**I can help you create impactful content.** What would you like to focus on?`);
    }
  }

  return parts.join('');
}

// Generate stage-aware quick replies for meaningful conversation flow
export function generateStageAwareQuickReplies(
  conversationTurns,
  intent,
  hasGoals,
  hasAudience
) {
  // Stage 1: EXPLORING (0-1 turns) - Ask about WHAT
  if (conversationTurns < 2) {
    if (!hasAudience) {
      return [
        { label: '👨‍⚕️ HIV Specialists', value: 'I want to target HIV specialists' },
        { label: '🏥 Primary Care Physicians', value: 'I want to reach PCPs' },
        { label: '🤝 Patients & Caregivers', value: 'I want patient-focused content' },
        { label: '📋 Multiple Audiences', value: 'I need content for multiple audiences' }
      ];
    }
    // Ask about goals if audience is known
    return [
      { label: '📢 Drive Awareness', value: 'I want to drive awareness of treatment options' },
      { label: '💊 Support Prescribing', value: 'I want to encourage prescribing behavior' },
      { label: '🎓 Educate on Data', value: 'I want to educate on clinical evidence' },
      { label: '🔄 Something Else', value: 'I have a different goal in mind' }
    ];
  }

  // Stage 2: CLARIFYING (2-3 turns) - Ask about WHY/HOW
  if (conversationTurns < 4) {
    return [
      { label: '📧 Email Campaign', value: 'I prefer email as the primary channel' },
      { label: '🌐 Multi-Channel', value: 'I want a coordinated multi-channel approach' },
      { label: '🎪 Event Support', value: 'This is for a specific event' },
      { label: '✏️ Let me explain more', value: 'I want to provide more context' }
    ];
  }

  // Stage 3: SUMMARIZING (4+ turns) - Offer strategy confirmation
  return [
    { label: '✅ Yes, generate themes based on this', value: 'confirm-strategy' },
    { label: '🔄 I want to adjust something', value: 'I want to adjust the approach' },
    { label: '❓ I have more questions', value: 'I have additional questions' }
  ];
}

// Minimal quick replies - only show key action buttons
function generateStageBasedReplies(
  conversationTurns,
  intent
) {
  const hasAudience = !!(
    intent?.audience ||
    intent?.audienceSeniority ||
    (intent?.audienceSpecialties?.length > 0)
  );
  const hasOccasion = !!(intent?.occasion || intent?.eventType);
  const hasGoals = ((intent?.goals?.length ?? 0) > 0);

  // All required info gathered - show generate button
  if (hasAudience && hasOccasion && hasGoals) {
    return [
      { label: '✅ Generate Themes', value: 'confirm-strategy' }
    ];
  }

  // Otherwise, no quick replies - let conversation flow naturally
  return [];
}

// Smart fallback quick replies based on missing context
function generateSmartFallbackReplies(
  conversationTurns,
  intent
) {
  // More comprehensive audience detection
  const hasAudience = !!(
    intent?.audience ||
    intent?.audienceSeniority ||
    (intent?.audienceSpecialties?.length > 0)
  );
  const hasOccasion = !!(intent?.occasion || intent?.eventType);
  const hasGoals = ((intent?.goals?.length ?? 0) > 0);
  const hasChannel = ((intent?.channels?.length ?? 0) > 0) || ((intent?.assetTypes?.length ?? 0) > 0);

  console.log('[Fallback] Context check:', { hasAudience, hasOccasion, hasGoals, hasChannel, conversationTurns });

  // If we're late in conversation but missing basics, offer confirmation
  if (conversationTurns >= 4) {
    return [
      { label: '✅ Ready to generate themes', value: 'confirm-strategy' },
      { label: '🔄 Let me clarify something', value: 'I want to clarify something' },
      { label: '❓ Have questions', value: 'I have additional questions' }
    ];
  }

  // Priority 1: If no occasion, ask about that
  if (!hasOccasion && conversationTurns < 4) {
    console.log('[Fallback] Selected: occasion options (hasOccasion=false, turns<4)');
    return [
      { label: '🎪 Event/Conference', value: 'This is for an event or conference' },
      { label: '📧 Marketing Campaign', value: "I'm launching a marketing campaign" },
      { label: '⚔️ Competitive Response', value: "This is a competitive response" },
      { label: '📚 Education Initiative', value: 'This is an education initiative' }
    ];
  }

  // Priority 2: If no audience
  if (!hasAudience) {
    return [
      { label: '👨‍⚕️ HIV Specialists', value: 'I want to target HIV specialists' },
      { label: '🏥 Primary Care', value: 'I want to reach primary care physicians' },
      { label: '🤝 Patients & Caregivers', value: 'I want patient-focused content' },
      { label: '📋 Multiple Audiences', value: 'I need content for multiple audiences' }
    ];
  }

  // Priority 3: If no goals
  if (!hasGoals) {
    return [
      { label: '📢 Drive Awareness', value: 'My primary goal is to drive awareness' },
      { label: '💊 Support Prescribing', value: 'I want to support prescribing decisions' },
      { label: '🎓 Educate on Data', value: 'I want to educate on clinical evidence' },
      { label: '🎯 Multiple Goals', value: 'I have multiple objectives' }
    ];
  }

  // Priority 4: If no channel preference
  if (!hasChannel) {
    return [
      { label: '📧 Email Campaign', value: 'I prefer email as the primary channel' },
      { label: '🌐 Multi-Channel', value: 'I want a coordinated multi-channel approach' },
      { label: '🤝 Rep-Enabled', value: 'This should be rep-enabled' },
      { label: '🎪 Event Materials', value: 'I need event materials' }
    ];
  }

  // All filled - offer confirmation
  return [
    { label: '✅ Summarize strategy', value: 'Please summarize your recommended strategy' },
    { label: '🔄 Adjust something', value: 'I want to adjust something' },
    { label: '❓ Have questions', value: 'I have additional questions' }
  ];
}

// Generate quick replies based on conversation stage and missing context
export function generateQuestionAwareQuickReplies(
  aiResponse,
  conversationTurns,
  intent
) {
  console.log(`[Quick Replies] Using stage-based logic (no AI text parsing)`);
  // Use simplified stage-based logic only
  return generateStageBasedReplies(conversationTurns, intent);
}

// Generate context-aware quick replies that match the greeting's question
export function generateContextAwareQuickReplies(intent, isOpenQuestion) {
  // For open-ended questions (user asked "what do you suggest?")
  if (isOpenQuestion) {
    // If audience not specified or needs clarification
    if (!intent.audienceSeniority && !intent.audience?.primaryType) {
      return [
        { label: '👨‍⚕️ HIV Specialists', value: 'hiv-specialists' },
        { label: '🏥 Broader HCPs', value: 'broader-hcp' },
        { label: '🤝 Include Patients', value: 'include-patients' },
        { label: '📊 Show me the data first', value: 'show-data' }
      ];
    }
    // If audience confirmed but channels not confirmed
    if (!intent.channels || intent.channels.length === 0) {
      return [
        { label: '📧 Email Campaign', value: 'email-campaign' },
        { label: '📱 Multi-Channel', value: 'multi-channel' },
        { label: '✅ Proceed with recommendations', value: 'proceed' }
      ];
    }
    // Audience and channels confirmed
    return [
      { label: '✅ Generate Themes', value: 'generate' },
      { label: '📝 Refine Strategy', value: 'refine' },
      { label: '📊 Show Intelligence', value: 'show-intelligence' }
    ];
  }

  // For events with activities - confirm asset preparation
  if (intent.eventDetails?.activities?.length > 0) {
    return [
      { label: '✅ Prepare these materials', value: 'confirm-assets' },
      { label: '➕ Add more asset types', value: 'add-assets' },
      { label: '✏️ Adjust recommendations', value: 'adjust' }
    ];
  }

  // For education/competitive occasions
  if (intent.occasion === 'education' || intent.occasion === 'competitive') {
    if (!intent.audience?.primaryType && !intent.audienceSeniority) {
      return [
        { label: '👨‍⚕️ HIV Specialists', value: 'hiv-specialists' },
        { label: '🏥 Primary Care', value: 'primary-care' },
        { label: '🤝 Patients', value: 'patients' },
        { label: '📊 Multiple Audiences', value: 'multi-audience' }
      ];
    }
  }

  // Default: engagement-focused options
  return [
    { label: '✅ Looks good', value: 'confirm' },
    { label: '📝 Tell me more', value: 'more-info' },
    { label: '🔄 Adjust strategy', value: 'adjust' }
  ];
}


















