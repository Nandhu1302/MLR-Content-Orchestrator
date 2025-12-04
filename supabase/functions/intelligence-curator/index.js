
// ============================================
// Intelligence Curator Agent
// Comprehensive multi-source intelligence matching
// ============================================

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { analysis, brandId } = await req.json();
    console.log("Curating intelligence for analysis:", analysis);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL"),
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),
    );

    // Extract filters from analysis
    const audienceSegments = analysis?.audience?.segments || [];
    const audienceType = analysis?.audience?.primaryType || "HCP";
    const region = analysis?.region?.identified || "National";
    const activities = analysis?.activities?.identified || [];

    // === CORE EVIDENCE QUERIES ===

    // 1. Clinical claims
    let claimsQuery = supabase
      .from("clinical_claims")
      .select("id, claim_text, claim_type, claim_id_display, target_audiences")
      .eq("brand_id", brandId)
      .limit(15);

    if (audienceSegments.length > 0) {
      claimsQuery = claimsQuery.overlaps("target_audiences", audienceSegments);
    }
    const { data: claims } = await claimsQuery;

    // 2. Visual assets (FIXED: correct column names)
    const { data: visuals } = await supabase
      .from("visual_assets")
      .select("id, title, visual_type, applicable_audiences, mlr_approved")
      .eq("brand_id", brandId)
      .eq("mlr_approved", true)
      .limit(10);

    // 3. Content modules (FIXED: correct column names)
    const { data: modules } = await supabase
      .from("content_modules")
      .select("id, module_text, module_type, applicable_audiences")
      .eq("brand_id", brandId)
      .limit(8);

    // 4. Success patterns (ENHANCED: get pattern rules and sample size)
    let patternsQuery = supabase
      .from("content_success_patterns")
      .select(
        "id, pattern_name, pattern_description, avg_performance_lift, sample_size, pattern_rules, pattern_type",
      )
      .eq("brand_id", brandId)
      .order("avg_performance_lift", { ascending: false })
      .limit(10);

    if (activities.length > 0) {
      patternsQuery = patternsQuery.in("pattern_type", [
        "event_combination",
        "event_sequence",
        "event_element_combination",
        "event_content_format",
        "event_preparation",
        "event_launch",
        "event_channel_mix",
        "event_audience_match",
        "event_rep_coordination",
        "event_virtual",
      ]);
    }
    const { data: patterns } = await patternsQuery;

    // 5. Competitive intelligence
    const { data: competitive } = await supabase
      .from("competitive_intelligence_enriched")
      .select("competitor_name, content, threat_level")
      .eq("brand_id", brandId)
      .eq("status", "active")
      .limit(5);

    // === NEW: HCP TARGETING INTELLIGENCE ===
    const { data: hcpDecileData } = await supabase
      .from("iqvia_hcp_decile_raw")
      .select("*")
      .eq("brand_id", brandId)
      .gte("decile", 5)
      .lte("decile", 7)
      .limit(100);

    const { data: hcpEngagementData } = await supabase
      .from("hcp_engagement_analytics")
      .select("*")
      .eq("brand_id", brandId)
      .gte("growth_opportunity_score", 70)
      .order("growth_opportunity_score", { ascending: false })
      .limit(50);

    // === NEW: MARKET INTELLIGENCE ===
    const { data: marketIntelData } = await supabase
      .from("market_intelligence_analytics")
      .select("*")
      .eq("brand_id", brandId)
      .limit(1)
      .single();

    // === NEW: AUDIENCE SEGMENT INSIGHTS ===
    const { data: audienceSegmentData } = await supabase
      .from("audience_segments")
      .select("*")
      .eq("brand_id", brandId)
      .eq("segment_type", audienceType.toLowerCase())
      .limit(5);

    // === NEW: ENHANCED CROSS-CHANNEL DATA ===

    // Web analytics
    const { data: webAnalyticsData } = await supabase
      .from("web_analytics_raw")
      .select(
        "page_url, visitor_type, cta_clicks, resources_downloaded, search_terms_used, time_on_page_seconds, region",
      )
      .eq("brand_id", brandId)
      .eq("visitor_type", audienceType)
      .order("time_on_page_seconds", { ascending: false })
      .limit(50);

    // SFMC email campaigns
    const { data: sfmcData } = await supabase
      .from("sfmc_campaign_raw")
      .select("campaign_type, audience_segment, open_rate, click_rate, conversion_rate")
      .eq("brand_id", brandId)
      .order("conversion_rate", { ascending: false })
      .limit(20);

    // Social listening with sentiment
    const { data: socialData } = await supabase
      .from("social_listening_data")
      .select("platform, sentiment_score, engagement_count, topic, reach_count")
      .eq("brand_id", brandId)
      .order("engagement_count", { ascending: false })
      .limit(20);

    // Veeva CRM rep activity
    const { data: veevaData } = await supabase
      .from("veeva_crm_activity_raw")
      .select(
        "hcp_specialty, activity_type, content_presented, next_best_action, call_objective, region",
      )
      .eq("brand_id", brandId)
      .order("activity_date", { ascending: false })
      .limit(50);

    // === INTELLIGENCE ASSEMBLY ===
    const curatedIntelligence = {
      claims: (claims || [])
        .map((claim) => ({
          id: claim.id,
          claim_text: claim.claim_text,
          claim_type: claim.claim_type,
          relevance_score: calculateClaimRelevance(claim, analysis),
          reason: generateClaimReason(claim, analysis),
        }))
        .sort((a, b) => b.relevance_score - a.relevance_score)
        .slice(0, 8),

      visuals: (visuals || [])
        .map((visual) => ({
          id: visual.id,
          title: visual.title,
          visual_type: visual.visual_type,
          relevance_score: calculateVisualRelevance(visual, analysis),
          reason: generateVisualReason(visual, analysis),
        }))
        .sort((a, b) => b.relevance_score - a.relevance_score)
        .slice(0, 5),

      modules: (modules || [])
        .map((module) => ({
          id: module.id,
          module_text: module.module_text,
          module_type: module.module_type,
          relevance_score: calculateModuleRelevance(module, analysis),
          reason: generateModuleReason(module, analysis),
        }))
        .sort((a, b) => b.relevance_score - a.relevance_score)
        .slice(0, 5),

      patterns: (patterns || [])
        .map((pattern) => {
          const patternRules = pattern.pattern_rules || {};
          return {
            id: pattern.id,
            pattern_name: pattern.pattern_name,
            pattern_description: pattern.pattern_description,
            avg_performance_lift: pattern.avg_performance_lift,
            sample_size: pattern.sample_size || 0,
            relevance_score: calculatePatternRelevance(pattern, analysis),
            reason: generatePatternReason(pattern, analysis),
            success_factors: patternRules.success_factors || [],
            anti_patterns: patternRules.anti_patterns || [],
          };
        })
        .sort((a, b) => b.relevance_score - a.relevance_score)
        .slice(0, 5),

      competitiveContext: (competitive || [])
        .map((comp) => ({
          competitor_name: comp.competitor_name,
          insight: comp.content.substring(0, 200),
          threat_level: comp.threat_level || "medium",
        }))
        .slice(0, 3),

      // NEW: Cross-Channel Insights
      crossChannelInsights: buildCrossChannelInsights(
        webAnalyticsData,
        sfmcData,
        socialData,
        veevaData,
      ),

      // ENHANCED: HCP Targeting Intelligence with specialty/regional breakdown
      hcpTargeting: buildEnhancedHcpTargeting(
        hcpDecileData,
        hcpEngagementData,
        region,
      ),

      // NEW: Market Intelligence
      marketContext: buildMarketContext(marketIntelData),

      // NEW: Audience Insights
      audienceInsights: buildAudienceInsights(audienceSegmentData, audienceType),

      // NEW: Performance Prediction
      performancePrediction: buildPerformancePrediction(
        patterns,
        sfmcData,
        webAnalyticsData,
        socialData,
        activities,
      ),

      // NEW: Campaign Coordination
      campaignCoordination: buildCampaignCoordination(analysis, activities),
    };

    console.log("Curated intelligence:", {
      claims: curatedIntelligence.claims.length,
      visuals: curatedIntelligence.visuals.length,
      modules: curatedIntelligence.modules.length,
      patterns: curatedIntelligence.patterns.length,
      crossChannelAvailable: !!curatedIntelligence.crossChannelInsights,
      hcpTargetingAvailable: !!curatedIntelligence.hcpTargeting,
      marketContextAvailable: !!curatedIntelligence.marketContext,
      audienceInsightsAvailable: !!curatedIntelligence.audienceInsights,
      performancePredictionAvailable: !!curatedIntelligence.performancePrediction,
    });

    return new Response(JSON.stringify({ intelligence: curatedIntelligence }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Intelligence curation error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});

// === CORE SCORING FUNCTIONS ===

function calculateClaimRelevance(claim, analysis) {
  let score = 0.5;
  const audienceSegments = analysis?.audience?.segments || [];
  const claimAudiences = claim.target_audiences || [];
  const audienceMatch = audienceSegments.some((seg) => claimAudiences.includes(seg));
  if (audienceMatch) score += 0.3;
  if (claim.claim_type === "efficacy" || claim.claim_type === "safety") {
    score += 0.2;
  }
  return Math.min(score, 1.0);
}

function calculateVisualRelevance(visual, analysis) {
  let score = 0.5;
  const audienceType = analysis?.audience?.primaryType || "HCP";
  const applicableAudiences = visual.applicable_audiences || [];
  const mappedAudience =
    audienceType === "HCP" ? "hcp" : audienceType === "Patient" ? "patient" : "caregiver";
  if (applicableAudiences.includes(mappedAudience)) {
    score += 0.4;
  }
  return Math.min(score, 1.0);
}

function calculateModuleRelevance(module, analysis) {
  let score = 0.6;
  const audienceSegments = analysis?.audience?.segments || [];
  const applicableAudiences = module.applicable_audiences || [];
  const audienceMatch = audienceSegments.some((seg) => applicableAudiences.includes(seg));
  if (audienceMatch) score += 0.3;
  return Math.min(score, 1.0);
}

function calculatePatternRelevance(pattern, analysis) {
  let score = 0.4;
  const activities = analysis?.activities?.identified || [];
  const patternRules = pattern.pattern_rules || {};
  if (patternRules.activities) {
    const matchingActivities = activities.filter((act) =>
      patternRules.activities.includes(act),
    );
    if (matchingActivities.length > 0) {
      score += 0.4;
    }
  }
  if (pattern.avg_performance_lift > 50) {
    score += 0.2;
  }
  return Math.min(score, 1.0);
}

function generateClaimReason(claim, analysis) {
  const audienceType = analysis?.audience?.primaryType || "HCP";
  return `${claim.claim_type} claim relevant for ${audienceType} audience`;
}

function generateVisualReason(visual, analysis) {
  return `Visual asset type ${visual.visual_type} suitable for audience`;
}

function generateModuleReason(module, analysis) {
  return `Pre-approved ${module.module_type} module ready for use`;
}

function generatePatternReason(pattern, analysis) {
  const lift = pattern.avg_performance_lift;
  return `Pattern shows +${Number(lift).toFixed(0)}% performance lift`;
}

// === NEW: INTELLIGENCE BUILDERS ===

function buildCrossChannelInsights(webData, emailData, socialData, repData) {
  if (
    !(webData?.length) &&
    !(emailData?.length) &&
    !(socialData?.length) &&
    !(repData?.length)
  ) {
    return null;
  }

  // Web engagement analysis
  const pageVisits = {};
  const ctaClicks = {};
  const searchTerms = [];

  webData?.forEach((visit) => {
    if (visit.page_url) {
      pageVisits[visit.page_url] = (pageVisits[visit.page_url] || 0) + 1;
    }
    if (visit.cta_clicks && visit.cta_clicks > 0) {
      const cta = visit.page_url?.split("/").pop() || "unknown";
      ctaClicks[cta] = (ctaClicks[cta] || 0) + visit.cta_clicks;
    }
    if (visit.search_terms_used) {
      searchTerms.push(visit.search_terms_used);
    }
  });

  const topPages = Object.entries(pageVisits)
    .map(([page, visits]) => ({
      page,
      visits,
      engagement_rate: Math.random() * 0.5 + 0.3, // placeholder calc
    }))
    .sort((a, b) => b.visits - a.visits)
    .slice(0, 5);

  const topCTAs = Object.entries(ctaClicks)
    .map(([cta, clicks]) => ({ cta, clicks }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 5);

  // Email performance analysis
  let avgOpenRate = 0;
  let avgClickRate = 0;
  let topSegment = "Unknown";
  let maxConversion = 0;

  emailData?.forEach((campaign) => {
    avgOpenRate += campaign.open_rate || 0;
    avgClickRate += campaign.click_rate || 0;
    if ((campaign.conversion_rate || 0) > maxConversion) {
      maxConversion = campaign.conversion_rate;
      topSegment = campaign.audience_segment || "Unknown";
    }
  });

  if (emailData?.length) {
    avgOpenRate /= emailData.length;
    avgClickRate /= emailData.length;
  }

  // Social sentiment analysis
  let totalSentiment = 0;
  const topicCounts = {};
  const platformEngagement = {};

  socialData?.forEach((post) => {
    totalSentiment += post.sentiment_score || 0;
    if (post.topic) {
      topicCounts[post.topic] = (topicCounts[post.topic] || 0) + 1;
    }
    if (post.platform) {
      platformEngagement[post.platform] =
        (platformEngagement[post.platform] || 0) + (post.engagement_count || 0);
    }
  });

  const avgSentiment = socialData?.length ? totalSentiment / socialData.length : 0;

  const topTopics = Object.entries(topicCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([topic]) => topic);

  const topPlatform =
    (Object.entries(platformEngagement).sort((a, b) => b[1] - a[1])[0] || [])[0] ||
    "Unknown";

  // Rep engagement analysis
  const contentPresented = {};
  const nextBestActions = {};
  let totalCalls = 0;

  repData?.forEach((activity) => {
    totalCalls++;
    if (activity.content_presented) {
      contentPresented[activity.content_presented] =
        (contentPresented[activity.content_presented] || 0) + 1;
    }
    if (activity.next_best_action) {
      nextBestActions[activity.next_best_action] =
        (nextBestActions[activity.next_best_action] || 0) + 1;
    }
  });

  const uniqueHCPs = new Set(repData?.map((r) => r.hcp_id)).size || 1;
  const avgCallsPerHCP = totalCalls / uniqueHCPs;

  const topContent = Object.entries(contentPresented)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([content]) => content);

  const topActions = Object.entries(nextBestActions)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([action]) => action);

  return {
    webEngagement: {
      topPages,
      topCTAs,
      topSearchTerms: searchTerms.slice(0, 5),
    },
    emailPerformance: {
      avgOpenRate: Math.round(avgOpenRate * 100) / 100,
      avgClickRate: Math.round(avgClickRate * 100) / 100,
      topPerformingSegment: topSegment,
    },
    socialSentiment: {
      overallSentiment: Math.round(avgSentiment * 100) / 100,
      topTopics,
      topPlatform,
    },
    repEngagement: {
      avgCallsPerHCP: Math.round(avgCallsPerHCP * 10) / 10,
      contentPresented: topContent,
      nextBestActions: topActions,
    },
  };
}

function buildEnhancedHcpTargeting(hcpDecileData, hcpEngagementData, region) {
  if (!(hcpDecileData?.length) && !(hcpEngagementData?.length)) return null;

  const targetHcpCount = hcpDecileData?.length || 0;
  const highGrowthCount =
    hcpEngagementData?.filter((h) => h.growth_opportunity_score >= 80).length || 0;

  // Specialty breakdown
  const specialtyCounts = {};
  hcpDecileData?.forEach((hcp) => {
    if (hcp.hcp_specialty) {
      specialtyCounts[hcp.hcp_specialty] =
        (specialtyCounts[hcp.hcp_specialty] || 0) + 1;
    }
  });

  const specialtyBreakdown = Object.entries(specialtyCounts)
    .map(([specialty, count]) => ({
      specialty,
      count,
      percentage: Math.round((count / targetHcpCount) * 100),
    }))
    .sort((a, b) => b.count - a.count);

  // Regional breakdown
  const regionalData = {};
  hcpDecileData?.forEach((hcp) => {
    const hcpRegion = hcp.region || "Unknown";
    if (!regionalData[hcpRegion]) {
      regionalData[hcpRegion] = { count: 0, totalDecile: 0 };
    }
    regionalData[hcpRegion].count++;
    regionalData[hcpRegion].totalDecile += hcp.decile || 0;
  });

  const regionalBreakdown = Object.entries(regionalData)
    .map(([reg, data]) => ({
      region: reg,
      count: data.count,
      avgDecile: Math.round((data.totalDecile / data.count) * 10) / 10,
    }))
    .sort((a, b) => b.count - a.count);

  // Calculate preferred channels from engagement data
  const channelPreferences = {};
  hcpEngagementData?.forEach((hcp) => {
    if (hcp.email_opens > 0) channelPreferences["email"] = (channelPreferences["email"] || 0) + 1;
    if (hcp.rep_calls > 0) channelPreferences["rep-visit"] = (channelPreferences["rep-visit"] || 0) + 1;
    if (hcp.website_visits > 0) channelPreferences["website"] = (channelPreferences["website"] || 0) + 1;
  });

  const totalHcps = hcpEngagementData?.length || 1;
  const preferredChannels = Object.entries(channelPreferences)
    .map(([channel, count]) => ({
      channel,
      percentage: Math.round((count / totalHcps) * 100),
    }))
    .sort((a, b) => b.percentage - a.percentage);

  return {
    targetHcpCount,
    decileRange: [5, 7],
    regionFocus: region,
    highGrowthOpportunityCount: highGrowthCount,
    specialtyBreakdown,
    regionalBreakdown,
    preferredChannels: preferredChannels.slice(0, 3),
  };
}

function buildMarketContext(marketIntelData) {
  if (!marketIntelData) return null;

  const regionalGrowthRates = {};
  if (marketIntelData.region_growth_rate && typeof marketIntelData.region_growth_rate === "object") {
    Object.assign(regionalGrowthRates, marketIntelData.region_growth_rate);
  }

  let topPerformingRegion = "National";
  let maxGrowth = marketIntelData.rx_growth_rate || 0;

  Object.entries(regionalGrowthRates).forEach(([reg, growth]) => {
    if (growth > maxGrowth) {
      maxGrowth = growth;
      topPerformingRegion = reg;
    }
  });

  const timingRecommendation =
    marketIntelData.rx_growth_rate > 10
      ? "Act immediately - strong growth momentum"
      : "Plan carefully - moderate growth environment";

  return {
    rxGrowthRate: marketIntelData.rx_growth_rate || 0,
    regionalGrowthRates,
    topPerformingRegion,
    marketSharePercent: marketIntelData.market_share_percent || 0,
    primaryCompetitor: marketIntelData.primary_competitor || "Unknown",
    timingRecommendation,
  };
}

function buildAudienceInsights(audienceSegmentData, audienceType) {
  if (!(audienceSegmentData?.length)) return null;

  const primarySegment = audienceSegmentData[0];
  return {
    segmentName: primarySegment.segment_name,
    decisionFactors: primarySegment?.decision_factors?.factors || [],
    barriers: primarySegment?.barriers_to_engagement?.barriers || [],
    prescribingPatterns: primarySegment?.demographics?.prescribing_patterns || "Standard",
    claimsEmphasis: primarySegment?.messaging_preferences?.claims_emphasis || [],
    channelPreferences: primarySegment?.channel_preferences?.digital || [],
  };
}

function buildPerformancePrediction(patterns, emailData, webData, socialData, activities) {
  if (
    !(patterns?.length) &&
    !(emailData?.length) &&
    !(webData?.length) &&
    !(socialData?.length)
  ) {
    return null;
  }

  // Calculate channel-specific predictions based on historical patterns
  const channelPredictions = [];

  // Email prediction
  if (emailData?.length) {
    const avgEngagement =
      emailData.reduce((sum, c) => sum + (c.open_rate || 0), 0) / emailData.length;

    const emailPatterns =
      patterns?.filter((p) => p.pattern_rules?.channels?.includes("email")) || [];

    const avgLift =
      emailPatterns.reduce((sum, p) => sum + p.avg_performance_lift, 0) /
      (emailPatterns.length || 1);

    channelPredictions.push({
      channel: "email",
      predictedEngagement: Math.round(avgEngagement * (1 + avgLift / 100) * 100) / 100,
      confidence: emailPatterns.length >= 3 ? 0.85 : 0.65,
      rationale: `Based on ${emailData.length} historical campaigns and ${emailPatterns.length} success patterns`,
    });
  }

  // Web prediction
  if (webData?.length) {
    const webPatterns =
      patterns?.filter(
        (p) =>
          p.pattern_rules?.channels?.includes("web") ||
          p.pattern_rules?.channels?.includes("website"),
      ) || [];

    const avgLift =
      webPatterns.reduce((sum, p) => sum + p.avg_performance_lift, 0) /
      (webPatterns.length || 1);

    channelPredictions.push({
      channel: "web",
      predictedEngagement: Math.round((0.42 + avgLift / 200) * 100) / 100,
      confidence: webPatterns.length >= 2 ? 0.75 : 0.55,
      rationale: `Based on ${webData.length} page views and ${webPatterns.length} success patterns`,
    });
  }

  // Event prediction (if activities include event-related)
  const hasEventActivity = activities.some((a) =>
    ["booth", "podium", "workshop", "conference"].includes(a.toLowerCase()),
  );

  if (hasEventActivity) {
    const eventPatterns =
      patterns?.filter((p) => p.pattern_type?.includes("event")) || [];

    const avgLift =
      eventPatterns.reduce((sum, p) => sum + p.avg_performance_lift, 0) /
      (eventPatterns.length || 1);

    channelPredictions.push({
      channel: "event",
      predictedEngagement: Math.round((0.55 + avgLift / 200) * 100) / 100,
      confidence: eventPatterns.length >= 3 ? 0.8 : 0.6,
      rationale: `Based on ${eventPatterns.length} event success patterns with avg +${Number(avgLift).toFixed(0)}% lift`,
    });
  }

  // Calculate recommended channel mix
  const totalPredicted = channelPredictions.reduce(
    (sum, c) => sum + c.predictedEngagement,
    0,
  );
  const recommendedChannelMix = channelPredictions.map((c) => ({
    channel: c.channel,
    allocation: Math.round((c.predictedEngagement / totalPredicted) * 100),
  }));

  // Overall estimated lift from best patterns
  const topPatterns = patterns?.slice(0, 3) || [];
  const avgTopLift =
    topPatterns.reduce((sum, p) => sum + p.avg_performance_lift, 0) /
    (topPatterns.length || 1);

  // Confidence level based on data availability
  const totalSampleSize =
    patterns?.reduce((sum, p) => sum + (p.sample_size || 0), 0) || 0;

  let confidenceLevel = "low";
  if (totalSampleSize > 50 && channelPredictions.length >= 2) confidenceLevel = "high";
  else if (totalSampleSize > 20 && channelPredictions.length >= 2) confidenceLevel = "medium";

  return {
    channels: channelPredictions,
    recommendedChannelMix,
    estimatedLift: Math.round(avgTopLift),
    confidenceLevel,
  };
}

function buildCampaignCoordination(analysis, activities) {
  const isCampaign = activities.length > 2;
  if (!isCampaign) return null;

  const channelSequence = activities.map((activity) => {
    if (activity === "booth") return "event-booth";
    if (activity === "podium") return "event-podium";
    if (activity === "pre_event_email") return "email";
    if (activity === "post_event_email") return "email";
    if (activity === "rep_visit") return "rep-enabled";
    return activity;
  });

  return {
    initiativeType: "campaign",
    channelSequence,
    messagingArc: `${activities[0]} → ${activities.slice(1).join(" → ")} coordinated narrative`,
    sharedEvidenceChain: [],
  };
}
