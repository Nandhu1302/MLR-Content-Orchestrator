
// ============================================
// Intelligence Query Tools for Story Consultant
// Enables AI to query live data during conversation
// ============================================
export async function queryBrandStatus(supabase, brandId) {
  console.log('Querying brand status for:', brandId);
  const [market, campaigns, assets, competitive] = await Promise.all([
    supabase.from('market_intelligence_analytics').select('*')
      .eq('brand_id', brandId)
      .order('reporting_date', { ascending: false })
      .limit(1),
    supabase.from('campaign_performance_analytics').select('*')
      .eq('brand_id', brandId)
      .order('calculated_at', { ascending: false })
      .limit(3),
    supabase.from('content_assets').select('id,asset_name,status,created_at')
      .eq('brand_id', brandId)
      .order('created_at', { ascending: false })
      .limit(5),
    supabase.from('competitive_intelligence_enriched').select('*')
      .eq('brand_id', brandId)
      .order('discovered_at', { ascending: false })
      .limit(3)
  ]);
  const marketData = market.data?.[0];
  return {
    marketShare: marketData?.market_share_percent ?? 0,
    rxGrowth: marketData?.rx_growth_rate ?? 0,
    topRegion: marketData?.top_performing_region ?? 'Unknown',
    topCompetitor: marketData?.primary_competitor ?? 'None',
    recentCampaigns: (campaigns.data ?? []).map((c) => ({
      name: c.campaign_name,
      openRate: c.open_rate,
      clickRate: c.click_rate,
      engagementScore: c.engagement_score,
    })),
    activeAssets: (assets.data ?? []).map((a) => ({
      name: a.asset_name,
      status: a.status,
    })),
    competitiveThreats: (competitive.data ?? []).map((c) => ({
      competitor: c.competitor_name,
      threat: c.threat_level,
      content: c.content?.substring(0, 100),
    })),
  };
}

export async function queryCampaignHistory(supabase, brandId, campaignName) {
  console.log('Querying campaign history:', { brandId, campaignName });
  let query = supabase.from('campaign_performance_analytics').select('*')
    .eq('brand_id', brandId)
    .order('calculated_at', { ascending: false });
  if (campaignName) {
    query = query.ilike('campaign_name', `%${campaignName}%`);
  }
  const { data, error } = await query.limit(5);
  if (error) {
    console.error('Error querying campaign history:', error);
    return [];
  }
  return (data ?? []).map((c) => ({
    name: c.campaign_name,
    type: c.campaign_type,
    openRate: c.open_rate,
    clickRate: c.click_rate,
    conversionRate: c.conversion_rate,
    engagementScore: c.engagement_score,
    audienceSize: c.total_audience_size,
    benchmarkComparison: c.performance_vs_benchmark,
    period: c.reporting_period,
  }));
}

export async function queryAudienceInsights(supabase, brandId, audienceType) {
  console.log('Querying audience insights:', { brandId, audienceType });
  const { data, error } = await supabase
    .from('audience_segments')
    .select('*')
    .eq('brand_id', brandId)
    .ilike('segment_name', `%${audienceType}%`)
    .limit(1);
  if (error || !data || data.length === 0) {
    console.error('Error or no data for audience insights:', error);
    return null;
  }
  const segment = data[0];
  return {
    segmentName: segment.segment_name,
    demographics: segment.demographics ?? {},
    psychographics: segment.psychographics ?? {},
    decisionFactors: segment.decision_factors ?? [],
    barriers: segment.barriers_to_engagement ?? [],
    motivations: segment.motivations ?? [],
    channelPreferences: segment.channel_preferences ?? [],
    messagingPreferences: segment.messaging_preferences ?? {},
    contentPreferences: segment.content_preferences ?? {},
    trustFactors: segment.trust_factors ?? [],
    engagementPatterns: segment.engagement_patterns ?? {},
  };
}

export async function suggestMultiChannelApproach(
  supabase,
  brandId,
  context
) {
  console.log('Suggesting multi-channel approach:', context);
  // Map activities to channel names matching database values
  // Database channels: 'email', 'web', 'event', 'rep_presentation'
  const activityToChannelMap = {
    'booth': ['event', 'rep_presentation'],
    'booth materials': ['event', 'rep_presentation'],
    'booth engagement': ['event', 'rep_presentation'],
    'podium': ['event', 'rep_presentation'],
    'podium presentation': ['event', 'rep_presentation'],
    'presentation': ['event', 'rep_presentation'],
    'workshop': ['event', 'rep_presentation'],
    'networking': ['event'],
    'email': ['email'],
    'email campaign': ['email'],
    'follow-up': ['email'],
    'webinar': ['email', 'web'],
    'web': ['web'],
    'website': ['web'],
    'social': ['web'],
    'conference': ['event', 'rep_presentation', 'email'],
    'medical conference': ['event', 'rep_presentation', 'email'],
  };

  // Fuzzy activity matching - normalize and check for partial matches
  const normalizeActivity = (activity) => {
    const lower = activity.toLowerCase().trim();
    // Direct match first
    if (activityToChannelMap[lower]) {
      return activityToChannelMap[lower];
    }
    // Fuzzy matching for partial strings
    if (lower.includes('booth')) return activityToChannelMap['booth'];
    if (lower.includes('podium')) return activityToChannelMap['podium'];
    if (lower.includes('presentation')) return activityToChannelMap['presentation'];
    if (lower.includes('conference')) return activityToChannelMap['conference'];
    if (lower.includes('email')) return activityToChannelMap['email'];
    if (lower.includes('web')) return activityToChannelMap['web'];
    if (lower.includes('workshop')) return activityToChannelMap['workshop'];
    return [];
  };

  // Convert activities to channel names using fuzzy matching
  const channelsFromActivities = (context.activities ?? [])
    .flatMap((activity) => normalizeActivity(activity))
    .filter((v, i, a) => a.indexOf(v) === i); // Deduplicate
  console.log('Mapped activities to channels:', { activities: context.activities, channels: channelsFromActivities });

  // Query success patterns with proper channel filtering
  const { data: patterns, error: patternError } = await supabase
    .from('content_success_patterns')
    .select('*')
    .eq('brand_id', brandId)
    .order('avg_performance_lift', { ascending: false })
    .limit(10);
  if (patternError) {
    console.error('Error querying success patterns:', patternError);
  }

  // Filter patterns by channels if we have activities
  let relevantPatterns = patterns ?? [];
  if (channelsFromActivities.length > 0) {
    relevantPatterns = relevantPatterns.filter((p) => {
      const patternChannels = p.applicable_channels ?? [];
      return channelsFromActivities.some((ch) => patternChannels.includes(ch));
    });
  }
  console.log('Found relevant patterns:', relevantPatterns.length);

  // Build recommendations from success patterns
  const patternRecs = relevantPatterns.slice(0, 5).map((p) => ({
    patternName: p.pattern_name,
    channels: p.applicable_channels ?? [],
    performanceLift: p.avg_performance_lift ?? 0,
    confidence: p.confidence_score ?? 0,
    sampleSize: p.sample_size ?? 0,
  }));

  // Synthesize best multi-channel combo from patterns
  const channelPerformance = {};
  relevantPatterns.forEach((p) => {
    (p.applicable_channels ?? []).forEach((ch) => {
      if (!channelPerformance[ch]) {
        channelPerformance[ch] = { count: 0, totalLift: 0 };
      }
      channelPerformance[ch].count++;
      channelPerformance[ch].totalLift += p.avg_performance_lift ?? 0;
    });
  });

  const topChannels = Object.entries(channelPerformance)
    .map(([channel, stats]) => ({
      channel,
      avgLift: stats.totalLift / stats.count,
      frequency: stats.count,
    }))
    .sort((a, b) => b.avgLift - a.avgLift)
    .slice(0, 3);

  const suggestedCombo = topChannels.length > 0 ? {
    channels: topChannels.map((c) => c.channel),
    conversionLift: topChannels[0].avgLift,
    rationale: `Based on ${relevantPatterns.length} success patterns`,
  } : {
    channels: ['email', 'rep-visit', 'digital-sales-aid'],
    conversionLift: 2.8,
    rationale: 'Default recommendation (no pattern data available)',
  };

  return {
    patterns: patternRecs,
    suggestedCombo,
    dataSource: relevantPatterns.length > 0 ? 'success_patterns' : 'fallback',
  };
}

export async function preSelectEvidence(
  supabase,
  brandId,
  context
) {
  console.log('Pre-selecting evidence:', context);
  // Map audience to database format
  const audienceFilter = (context.audience?.includes('specialist') || context.audience?.includes('hcp'))
    ? 'Physician-Specialist'
    : (context.audience?.includes('patient')
      ? 'Patient'
      : (context.audience?.includes('caregiver')
        ? 'Caregiver'
        : 'Physician-Specialist'));

  const [claims, visuals, modules] = await Promise.all([
    // Query clinical claims
    supabase.from('clinical_claims').select('*')
      .eq('brand_id', brandId)
      .eq('review_status', 'approved')
      .contains('target_audiences', [audienceFilter])
      .limit(5),
    // Query visual assets
    supabase.from('visual_assets').select('*')
      .eq('brand_id', brandId)
      .eq('mlr_approved', true)
      .limit(3),
    // Query content modules
    supabase.from('content_modules').select('*')
      .eq('brand_id', brandId)
      .eq('mlr_approved', true)
      .limit(3),
  ]);

  return {
    selectedClaims: (claims.data ?? []).map((c, idx) => ({
      id: c.id,
      claimText: c.claim_text,
      claimType: c.claim_type,
      relevanceScore: 0.9 - (idx * 0.1),
    })),
    selectedVisuals: (visuals.data ?? []).map((v, idx) => ({
      id: v.id,
      assetName: v.title ?? 'Visual Asset',
      assetType: v.visual_type,
      relevanceScore: 0.85 - (idx * 0.1),
    })),
    selectedModules: (modules.data ?? []).map((m, idx) => ({
      id: m.id,
      moduleText: (m.module_text?.substring(0, 100) ?? '') + '...',
      moduleType: m.module_type,
      relevanceScore: 0.8 - (idx * 0.1),
    })),
  };
}

// Tool definitions for AI tool calling
export const intelligenceQueryTools = [
  {
    type: 'function',
    function: {
      name: 'query_brand_status',
      description: 'Get current brand health metrics: market share, Rx growth, competitive position, recent campaign performance',
      parameters: { type: 'object', properties: {}, required: [] },
    }
  },
  {
    type: 'function',
    function: {
      name: 'query_campaign_history',
      description: 'Get performance metrics for recent campaigns or search for specific campaign by name',
      parameters: {
        type: 'object',
        properties: {
          campaign_name: {
            type: 'string',
            description: 'Optional: specific campaign name to search for',
          }
        }
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'query_audience_insights',
      description: 'Get deep insights about a specific audience segment including decision factors, barriers, channel preferences',
      parameters: {
        type: 'object',
        properties: {
          audience_type: {
            type: 'string',
            description: 'Audience type (e.g., "HCP Specialist", "Patient", "Caregiver")'
          }
        },
        required: ['audience_type']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'suggest_multi_channel_approach',
      description: 'Recommend coordinated multi-channel strategy with performance predictions based on cross-channel journey data',
      parameters: {
        type: 'object',
        properties: {
          audience: { type: 'string' },
          occasion: { type: 'string' },
          region: { type: 'string' },
          activities: {
            type: 'array',
            items: { type: 'string' }
          }
        }
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'pre_select_evidence',
      description: 'Pre-select relevant clinical claims, visual assets, and content modules for confirmed audience and asset types',
      parameters: {
        type: 'object',
        properties: {
          audience: { type: 'string' },
          occasion: { type: 'string' },
          asset_types: {
            type: 'array',
            items: { type: 'string' }
          }
        }
      }
    }
  }
];
