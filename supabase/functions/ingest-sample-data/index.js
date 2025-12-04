
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const BIKTARVY_CONFIG = {
  brandName: "Biktarvy",
  therapeuticArea: "HIV",
  indications: ["Treatment-Naive", "Treatment-Experienced", "Virologically Suppressed"],
  regions: [
    { code: "US", name: "United States", weight: 0.4 },
    { code: "EU", name: "Europe", weight: 0.3 },
    { code: "APAC", name: "Asia Pacific", weight: 0.2 },
    { code: "LATAM", name: "Latin America", weight: 0.1 },
  ],
  audienceTypes: [
    { type: "HCP-Infectious Disease", sophistication: "expert", weight: 0.3 },
    { type: "HCP-Primary Care", sophistication: "intermediate", weight: 0.25 },
    { type: "Patient-Newly Diagnosed", sophistication: "basic", weight: 0.2 },
    { type: "Patient-Experienced", sophistication: "intermediate", weight: 0.15 },
    { type: "Caregiver", sophistication: "basic", weight: 0.1 },
  ],
  assetTypes: ["Email", "Web", "Detail Aid", "Leave Behind", "Video", "Social Post", "Banner Ad"],
  messageThemes: [
    "Efficacy",
    "Safety",
    "Tolerability",
    "Dosing Convenience",
    "Quality of Life",
    "Long-term Outcomes",
    "Patient Support",
    "Treatment Adherence",
    "Co-morbidities",
  ],
  competitors: [
    { name: "Gilead", brand: "Descovy", positioning: "STR efficacy" },
    { name: "ViiV Healthcare", brand: "Dovato", positioning: "2-drug regimen" },
    { name: "Janssen", brand: "Symtuza", positioning: "Boosted regimen" },
    { name: "Merck", brand: "Delstrigo", positioning: "NNRTI-based" },
  ],
  seasonalPatterns: [
    { month: 3, multiplier: 1.3 },
    { month: 6, multiplier: 1.2 },
    { month: 9, multiplier: 1.4 },
    { month: 12, multiplier: 0.8 },
  ],
  hcpSpecialties: ["Infectious Disease", "Primary Care", "Internal Medicine", "HIV Specialist", "Public Health"],
  platformTypes: ["Twitter/X", "Facebook", "Reddit", "Patient Forums", "LinkedIn", "Instagram"],
};

function selectWeighted(items) {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  let random = Math.random() * totalWeight;
  for (const item of items) {
    random -= item.weight;
    if (random <= 0) return item;
  }
  return items[0];
}

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateDateWithSeasonality(monthsBack) {
  const date = new Date();
  date.setMonth(date.getMonth() - Math.floor(Math.random() * monthsBack));
  return date;
}

function generatePerformanceMetrics(sophistication, theme, region, assetType) {
  const sophisticationMult = { expert: 1.2, intermediate: 1.0, basic: 0.85 }[sophistication] || 1.0;
  const themeMult = { Efficacy: 1.3, "Dosing Convenience": 1.2, "Quality of Life": 1.15, Safety: 1.1 }[theme] || 1.0;
  const regionalMult = { US: 1.15, EU: 1.0, APAC: 0.9, LATAM: 0.85 }[region] || 1.0;
  const assetMult = { Email: 1.0, Video: 1.25, "Detail Aid": 1.15, Web: 0.95, "Social Post": 0.85 }[assetType] || 1.0;
  const totalMult = sophisticationMult * themeMult * regionalMult * assetMult;
  const variance = 0.15;

  return {
    open_rate: Math.max(
      0.05,
      Math.min(0.95, 0.28 * totalMult * (1 + (Math.random() - 0.5) * variance)),
    ),
    click_rate: Math.max(
      0.02,
      Math.min(0.45, 0.12 * totalMult * (1 + (Math.random() - 0.5) * variance)),
    ),
    conversion_rate: Math.max(
      0.01,
      Math.min(0.25, 0.05 * totalMult * (1 + (Math.random() - 0.5) * variance)),
    ),
    engagement_score: Math.max(
      20,
      Math.min(95, Math.floor(65 * totalMult * (1 + (Math.random() - 0.5) * variance))),
    ),
  };
}

function generateBrandSFMCData(brandId, config) {
  const campaigns = [];
  console.log("📧 Generating 150 SFMC campaigns...");
  for (let i = 0; i < 150; i++) {
    const indication = randomItem(config.indications);
    const region = selectWeighted(config.regions);
    const audience = selectWeighted(config.audienceTypes);
    const assetType = randomItem(config.assetTypes);
    const primaryTheme = randomItem(config.messageThemes);
    const secondaryTheme = randomItem(config.messageThemes.filter((t) => t !== primaryTheme));
    const sendDate = generateDateWithSeasonality(24);
    const metrics = generatePerformanceMetrics(audience.sophistication, primaryTheme, region.code, assetType);

    const campaignName = `${config.brandName}-${indication.split(" ")[0]}-${region.code}-${assetType}-${sendDate.getFullYear()}${String(
      sendDate.getMonth() + 1,
    ).padStart(2, "0")}`;

    campaigns.push({
      brand_id: brandId,
      campaign_id: `SFMC-${campaignName}-${i}`,
      campaign_name: campaignName,
      indication,
      region: region.code,
      audience_type: audience.type,
      sophistication_level: audience.sophistication,
      asset_type: assetType,
      subject_line: `${primaryTheme}: ${indication} Treatment with ${config.brandName}`,
      message_themes: [primaryTheme, secondaryTheme],
      audience_segment: audience.type,
      sent_count: Math.floor(5000 + Math.random() * 45000),
      open_rate: metrics.open_rate,
      click_rate: metrics.click_rate,
      conversion_rate: metrics.conversion_rate,
      send_date: sendDate.toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }
  return campaigns;
}

function generateBrandVeevaData(brandId, config) {
  const insights = [];
  console.log("👥 Generating 280 Veeva insights...");
  const feedbackThemes = [
    "Product efficacy questions",
    "Safety profile concerns",
    "Dosing regimen preferences",
    "Patient adherence challenges",
    "Comparative effectiveness",
  ];

  for (let i = 0; i < 280; i++) {
    const indication = randomItem(config.indications);
    const region = selectWeighted(config.regions);
    const audience = selectWeighted(config.audienceTypes.filter((a) => a.type.startsWith("HCP")));
    const specialty = randomItem(config.hcpSpecialties);
    const competitor = randomItem(config.competitors);
    const theme = randomItem(feedbackThemes);
    const sentiment = Math.random() > 0.3 ? "positive" : Math.random() > 0.5 ? "neutral" : "negative";
    const recordedDate = generateDateWithSeasonality(18);

    insights.push({
      brand_id: brandId,
      indication,
      region: region.code,
      audience_type: audience.type,
      hcp_specialty: specialty,
      competitive_mention: competitor.brand,
      hcp_feedback_theme: theme,
      sentiment,
      frequency_score: Math.floor(Math.random() * 10) + 1,
      regional_data: { region: region.name, market_share: Math.random() * 0.4 + 0.1 },
      objections: ["Insurance coverage concerns", "Prior authorization requirements"],
      competitive_mentions: { competitor: competitor.name, brand: competitor.brand, positioning: competitor.positioning },
      recorded_date: recordedDate.toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }
  return insights;
}

function generateBrandIQVIAData(brandId, config) {
  const marketData = [];
  console.log("📊 Generating 180 IQVIA data points...");
  const metricTypes = ["Total Prescriptions", "Market Share", "Patient Persistence"];

  for (const indication of config.indications) {
    for (const region of config.regions) {
      for (const metricType of metricTypes) {
        for (let month = 0; month < 4; month++) {
          const dataDate = new Date();
          dataDate.setMonth(dataDate.getMonth() - month);
          const baseValue = metricType.includes("Share") ? Math.random() * 0.3 : Math.random() * 10000;

          marketData.push({
            brand_id: brandId,
            indication,
            region: region.code,
            market_segment: indication,
            metric_type: metricType,
            value: baseValue,
            comparison_period: "YoY",
            therapeutic_area: config.therapeuticArea,
            geographic_region: region.name,
            data_date: dataDate.toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        }
      }
    }
  }
  return marketData.slice(0, 180);
}

function generateBrandSocialData(brandId, config) {
  const socialPosts = [];
  console.log("🌐 Generating 450 social posts...");
  const topics = [`${config.brandName} efficacy`, `${config.brandName} side effects`, `Starting ${config.brandName}`];

  for (let day = 0; day < 450; day++) {
    const indication = randomItem(config.indications);
    const region = selectWeighted(config.regions);
    const audience = selectWeighted(config.audienceTypes.filter((a) => a.type.startsWith("Patient")));
    const platform = randomItem(config.platformTypes);
    const topic = randomItem(topics);
    const sentiment = Math.random() > 0.5 ? "positive" : Math.random() > 0.7 ? "negative" : "neutral";
    const dateCaptured = new Date();
    dateCaptured.setDate(dateCaptured.getDate() - day);

    socialPosts.push({
      brand_id: brandId,
      indication,
      region: region.code,
      audience_type: audience.type,
      platform_type: platform,
      platform,
      sentiment,
      topic,
      mention_volume: Math.floor(Math.random() * 500) + 10,
      engagement_score: Math.floor(Math.random() * 75) + 20,
      key_phrases: [`${config.brandName} improved my life`, `Questions about ${config.brandName}`],
      influencer_mentions: [],
      date_captured: dateCaptured.toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }
  return socialPosts;
}

function generateBrandCompetitiveData(brandId, config) {
  const competitiveIntel = [];
  console.log("⚡ Generating 120 competitive intel items...");
  const intelligenceTypes = ["Product Launch", "Clinical Data Release", "Marketing Campaign", "Pricing Change"];

  for (let week = 0; week < 120; week++) {
    const competitor = randomItem(config.competitors);
    const indication = randomItem(config.indications);
    const region = selectWeighted(config.regions);
    const intelligenceType = randomItem(intelligenceTypes);
    const threatLevel = Math.random() > 0.7 ? "high" : Math.random() > 0.5 ? "medium" : "low";
    const dateCaptured = new Date();
    dateCaptured.setDate(dateCaptured.getDate() - week * 7);

    competitiveIntel.push({
      brand_id: brandId,
      indication,
      region: region.code,
      threat_level: threatLevel,
      competitor_brand: competitor.brand,
      intelligence_type: intelligenceType,
      insight_summary: `${competitor.brand} ${intelligenceType.toLowerCase()} in ${region.name}`,
      data_source: "Market Research",
      confidence_score: Math.random() * 0.3 + 0.7,
      date_captured: dateCaptured.toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }
  return competitiveIntel;
}

function generateCampaignPerformanceAnalytics(brandId, sfmcData) {
  console.log("📈 Generating campaign performance analytics...");
  const analytics = [];
  const campaignGroups = new Map();

  sfmcData.forEach((campaign) => {
    const key = `${campaign.campaign_name}-${campaign.indication}-${campaign.region}`;
    if (!campaignGroups.has(key)) campaignGroups.set(key, []);
    campaignGroups.get(key).push(campaign);
  });

  campaignGroups.forEach((campaigns) => {
    const representative = campaigns[0];
    const totalSent = campaigns.reduce((sum, c) => sum + c.sent_count, 0);
    const avgOpenRate = campaigns.reduce((sum, c) => sum + c.open_rate, 0) / campaigns.length;
    const avgClickRate = campaigns.reduce((sum, c) => sum + c.click_rate, 0) / campaigns.length;
    const avgConversionRate = campaigns.reduce((sum, c) => sum + c.conversion_rate, 0) / campaigns.length;
    const engagementScore = Math.floor((avgOpenRate * 40 + avgClickRate * 60) * 100);

    analytics.push({
      brand_id: brandId,
      campaign_id: representative.campaign_id,
      campaign_name: representative.campaign_name,
      reporting_period: new Date(representative.send_date).toISOString().split("T")[0],
      campaign_type: representative.asset_type,
      source_system: "SFMC",
      total_audience_size: totalSent,
      total_delivered: Math.floor(totalSent * 0.97),
      total_engaged: Math.floor(totalSent * avgOpenRate),
      total_converted: Math.floor(totalSent * avgConversionRate),
      open_rate: avgOpenRate,
      click_rate: avgClickRate,
      conversion_rate: avgConversionRate,
      delivery_rate: 0.97,
      engagement_score: engagementScore,
      top_performing_segment: representative.audience_type,
      top_performing_geography: representative.region,
      top_performing_device: randomItem(["Desktop", "Mobile", "Tablet"]),
      industry_benchmark_open_rate: 0.25,
      industry_benchmark_click_rate: 0.10,
      performance_vs_benchmark:
        avgOpenRate > 0.25 ? ((avgOpenRate - 0.25) / 0.25) * 100 : -((0.25 - avgOpenRate) / 0.25) * 100,
      data_quality_score: 95,
      calculated_at: new Date().toISOString(),
    });
  });

  return analytics;
}

function generateContentElementPerformance(brandId, sfmcData) {
  console.log("🎨 Generating content element performance...");
  const elements = [];
  const elementGroups = new Map();

  sfmcData.forEach((campaign) => {
    ["tone", "complexity", "cta_type", "subject_line"].forEach((elementType) => {
      let value = "";
      if (elementType === "tone") value = randomItem(["Professional", "Empathetic", "Educational", "Urgent"]);
      else if (elementType === "complexity") value = campaign.sophistication_level;
      else if (elementType === "cta_type") value = randomItem(["Learn More", "Download", "Register", "Contact Us"]);
      else if (elementType === "subject_line") value = campaign.subject_line.split(":")[0];

      const key = `${elementType}-${value}`;
      if (!elementGroups.has(key)) elementGroups.set(key, { values: [], metrics: [] });
      const group = elementGroups.get(key);
      group.values.push(campaign);
      group.metrics.push(campaign.open_rate * 0.4 + campaign.click_rate * 0.6);
    });
  });

  elementGroups.forEach(({ values, metrics }, key) => {
    const [elementType, elementValue] = key.split("-");
    const avgEngagement = metrics.reduce((sum, m) => sum + m, 0) / metrics.length;
    const totalImpressions = values.reduce((sum, v) => sum + v.sent_count, 0);
    const totalEngagements = values.reduce((sum, v) => sum + Math.floor(v.sent_count * v.open_rate), 0);
    const totalConversions = values.reduce((sum, v) => sum + Math.floor(v.sent_count * v.conversion_rate), 0);

    elements.push({
      brand_id: brandId,
      element_type: elementType,
      element_value: elementValue,
      usage_count: values.length,
      total_impressions: totalImpressions,
      total_engagements: totalEngagements,
      total_conversions: totalConversions,
      avg_engagement_rate: totalEngagements / totalImpressions,
      avg_conversion_rate: totalConversions / totalImpressions,
      avg_performance_score: Math.round(avgEngagement * 100),
      top_performing_channel: "Email",
      top_performing_audience: values[0].audience_type,
      confidence_level: values.length > 20 ? "high" : values.length > 10 ? "medium" : "low",
      first_seen: new Date(values[0].send_date).toISOString(),
      last_seen: new Date(values[values.length - 1].send_date).toISOString(),
      last_calculated: new Date().toISOString(),
    });
  });

  return elements;
}

function generateMarketIntelligenceAnalytics(brandId, iqviaData) {
  console.log("📊 Generating market intelligence analytics...");
  const analytics = [];
  const marketGroups = new Map();

  iqviaData.forEach((data) => {
    const monthKey = new Date(data.data_date).toISOString().substring(0, 7);
    const key = `${monthKey}-${data.indication}-${data.region}`;
    if (!marketGroups.has(key)) marketGroups.set(key, []);
    marketGroups.get(key).push(data);
  });

  marketGroups.forEach((dataPoints, key) => {
    const [reportMonth, indication, region] = key.split("-");
    const shareData = dataPoints.filter((d) => d.metric_type.includes("Share"));
    const rxData = dataPoints.filter((d) => d.metric_type.includes("Prescription"));

    const avgMarketShare = shareData.length > 0
      ? shareData.reduce((sum, d) => sum + d.value, 0) / shareData.length
      : 0.25;

    const totalRx = rxData.length > 0
      ? rxData.reduce(
          (sum, d) => sum + (d.metric_type.includes("Total") ? d.value : 0),
          0,
        ) /
        Math.max(1, rxData.filter((d) => d.metric_type.includes("Total")).length)
      : 10000;

    const newRx = rxData.length > 0
      ? rxData.reduce(
          (sum, d) => sum + (d.metric_type.includes("New") ? d.value : 0),
          0,
        ) /
        Math.max(1, rxData.filter((d) => d.metric_type.includes("New")).length)
      : 3000;

    const rxValues = rxData.map((d) => d.value).sort((a, b) => a - b);
    const rxGrowth = rxValues.length > 1 ? ((rxValues[rxValues.length - 1] - rxValues[0]) / rxValues[0]) * 100 : 5.0;

    const competitors = dataPoints[0]?.competitor_comparison ?? [];
    const topCompetitor =
      competitors.length > 0
        ? competitors.reduce((max, c) => (c.value > max.value ? c : max), competitors[0])
        : null;

    analytics.push({
      brand_id: brandId,
      reporting_month: reportMonth,
      total_rx: Math.floor(totalRx),
      new_rx: Math.floor(newRx),
      refill_rx: Math.floor(totalRx - newRx),
      rx_growth_rate: rxGrowth,
      market_share_percent: avgMarketShare * 100,
      market_rank: Math.floor(Math.random() * 3) + 1,
      share_change: (Math.random() - 0.5) * 5,
      primary_competitor: topCompetitor ? topCompetitor.competitor : "Unknown",
      competitor_share_percent: topCompetitor ? topCompetitor.value * 100 : 20,
      share_gap: topCompetitor ? (topCompetitor.value - avgMarketShare) * 100 : 0,
      total_hcp_prescribers: Math.floor(Math.random() * 500) + 100,
      new_hcp_prescribers: Math.floor(Math.random() * 50) + 10,
      top_decile_hcp_count: Math.floor(Math.random() * 50) + 20,
      hcp_retention_rate: Math.random() * 0.2 + 0.75,
      top_performing_region: region,
      region_growth_rate: rxGrowth,
      trend_direction: rxGrowth > 0 ? "growing" : "declining",
      seasonality_factor: Math.random() * 0.3 + 0.85,
      calculated_at: new Date().toISOString(),
      data_sources: ["IQVIA", "Symphony Health"],
    });
  });

  return analytics;
}

function generateHCPEngagementAnalytics(brandId, veevaData) {
  console.log("🧑‍⚕️ Generating HCP engagement analytics...");
  const analytics = [];
  const hcpGroups = new Map();

  veevaData.forEach((insight) => {
    const key = `${insight.hcp_specialty}-${insight.region}-${insight.indication}`;
    if (!hcpGroups.has(key)) hcpGroups.set(key, []);
    hcpGroups.get(key).push(insight);
  });

  hcpGroups.forEach((insights, key) => {
    const [specialty, region, indication] = key.split("-");
    const representative = insights[0];
    const positiveFeedback = insights.filter((i) => i.sentiment === "positive").length;
    const totalInteractions = insights.length;
    const avgFrequency = insights.reduce((sum, i) => sum + i.frequency_score, 0) / insights.length;
    const contentDepth = Math.floor((positiveFeedback / totalInteractions) * 50 + avgFrequency * 5);

    const reportingWeek = new Date(representative.recorded_date).toISOString().split("T")[0];

    analytics.push({
      brand_id: brandId,
      reporting_week: reportingWeek,
      hcp_id: `HCP-${specialty.replace(/\s/g, "-")}`,
      hcp_specialty: specialty,
      hcp_tier: randomItem(["A", "B", "C"]),
      hcp_decile: Math.floor(Math.random() * 10) + 1,
      total_touchpoints: totalInteractions,
      email_opens: Math.floor(totalInteractions * 0.4),
      website_visits: Math.floor(totalInteractions * 0.3),
      rep_calls: Math.floor(totalInteractions * 0.2),
      content_views: Math.floor(totalInteractions * 0.7),
      avg_session_duration_minutes: Math.floor(Math.random() * 10) + 2,
      content_depth_score: contentDepth,
      response_rate: positiveFeedback / totalInteractions,
      prescriptions_written: Math.floor(Math.random() * 50) + 1,
      prescription_trend: Math.random() > 0.5 ? "increasing" : "stable",
      preferred_content_type: randomItem(["Clinical Data", "Case Studies", "Patient Education"]),
      preferred_channel: randomItem(["Email", "Rep", "Website"]),
      optimal_engagement_time: randomItem(["Morning", "Afternoon", "Evening"]),
      churn_risk_score: Math.floor(Math.random() * 50) + 20,
      growth_opportunity_score: Math.floor((positiveFeedback / totalInteractions) * 100),
      calculated_at: new Date().toISOString(),
    });
  });

  return analytics;
}

function generateSocialIntelligenceAnalytics(brandId, socialData) {
  console.log("🌐 Generating social intelligence analytics...");
  const analytics = [];
  const socialGroups = new Map();

  socialData.forEach((post) => {
    const dateKey = new Date(post.date_captured).toISOString().split("T")[0]; // YYYY-MM-DD
    const key = `${dateKey}-${post.platform}-${post.region}`;
    if (!socialGroups.has(key)) socialGroups.set(key, []);
    socialGroups.get(key).push(post);
  });

  socialGroups.forEach((posts, key) => {
    const [date, platform, region] = key.split("-");
    const totalMentions = posts.reduce((sum, p) => sum + p.mention_volume, 0);
    const avgEngagement = posts.reduce((sum, p) => sum + p.engagement_score, 0) / posts.length;
    const positiveSentiment = posts.filter((p) => p.sentiment === "positive").length;
    const sentimentScore = positiveSentiment / posts.length;
    const allTopics = posts.flatMap((p) => p.key_phrases);

    // Estimate reach since raw posts don't carry 'reach'
    const reachCount = posts.reduce(
      (sum, p) => sum + Math.floor(p.mention_volume * (Math.random() * 15 + 5)),
      0,
    );

    analytics.push({
      brand_id: brandId,
      reporting_date: date,
      total_mentions: totalMentions,
      unique_authors: posts.length,
      reach_count: reachCount,
      overall_sentiment_score: sentimentScore,
      positive_mention_percent: (posts.filter((p) => p.sentiment === "positive").length / posts.length) * 100,
      neutral_mention_percent: (posts.filter((p) => p.sentiment === "neutral").length / posts.length) * 100,
      negative_mention_percent: (posts.filter((p) => p.sentiment === "negative").length / posts.length) * 100,
      sentiment_trend: "stable",
      brand_mentions: totalMentions,
      category_mentions: Math.floor(totalMentions * 1.5),
      share_of_voice_percent: 35,
      competitor_mentions: {},
      competitive_sentiment: {},
      top_topics: { topics: allTopics.slice(0, 5) },
      emerging_concerns: [],
      positive_themes: [],
      top_influencers: {},
      crisis_alerts: 0,
      negative_spike_detected: false,
      calculated_at: new Date().toISOString(),
      platforms_analyzed: [platform],
      region,
    });
  });

  return analytics;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { brandId, dataType } = await req.json();
    if (!brandId) throw new Error("Brand ID is required");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL"),
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),
    );

    console.log("📥 Ingesting multi-dimensional data for brand:", brandId);
    const config = BIKTARVY_CONFIG;

    // STEP 1: Delete existing data (make idempotent)
    console.log(`🗑️ Clearing existing data for brand ${brandId}...`);
    await supabase.from("sfmc_campaign_data").delete().eq("brand_id", brandId);
    await supabase.from("veeva_field_insights").delete().eq("brand_id", brandId);
    await supabase.from("iqvia_market_data").delete().eq("brand_id", brandId);
    await supabase.from("social_listening_data").delete().eq("brand_id", brandId);
    await supabase.from("competitive_intelligence_data").delete().eq("brand_id", brandId);
    await supabase.from("campaign_performance_analytics").delete().eq("brand_id", brandId);
    await supabase.from("content_element_performance").delete().eq("brand_id", brandId);
    await supabase.from("market_intelligence_analytics").delete().eq("brand_id", brandId);
    await supabase.from("hcp_engagement_analytics").delete().eq("brand_id", brandId);
    await supabase.from("social_intelligence_analytics").delete().eq("brand_id", brandId);

    const ingestedData = {};

    // Generate ALL raw data first
    const sfmcData = generateBrandSFMCData(brandId, config);
    const veevaData = generateBrandVeevaData(brandId, config);
    const iqviaData = generateBrandIQVIAData(brandId, config);
    const socialData = generateBrandSocialData(brandId, config);
    const competitiveData = generateBrandCompetitiveData(brandId, config);

    // Insert raw data (optionally by type)
    if (!dataType || dataType === "sfmc") {
      const { error } = await supabase.from("sfmc_campaign_data").insert(sfmcData);
      if (error) throw error;
      ingestedData.sfmc = { count: sfmcData.length, status: "success" };
    }

    if (!dataType || dataType === "veeva") {
      const { error } = await supabase.from("veeva_field_insights").insert(veevaData);
      if (error) throw error;
      ingestedData.veeva = { count: veevaData.length, status: "success" };
    }

    if (!dataType || dataType === "iqvia") {
      const { error } = await supabase.from("iqvia_market_data").insert(iqviaData);
      if (error) throw error;
      ingestedData.iqvia = { count: iqviaData.length, status: "success" };
    }

    if (!dataType || dataType === "social") {
      const { error } = await supabase.from("social_listening_data").insert(socialData);
      if (error) throw error;
      ingestedData.social = { count: socialData.length, status: "success" };
    }

    if (!dataType || dataType === "competitive") {
      const { error } = await supabase.from("competitive_intelligence_data").insert(competitiveData);
      if (error) throw error;
      ingestedData.competitive = { count: competitiveData.length, status: "success" };
    }

    // Generate analytics from raw data
    console.log("📊 Generating analytics from raw data...");

    const campaignAnalytics = generateCampaignPerformanceAnalytics(brandId, sfmcData);
    const { error: campaignAnalyticsError } = await supabase
      .from("campaign_performance_analytics")
      .insert(campaignAnalytics);
    if (campaignAnalyticsError) console.error("Campaign analytics error:", campaignAnalyticsError);
    else ingestedData.campaignAnalytics = { count: campaignAnalytics.length, status: "success" };

    const contentElements = generateContentElementPerformance(brandId, sfmcData);
    const { error: contentElementsError } = await supabase
      .from("content_element_performance")
      .insert(contentElements);
    if (contentElementsError) console.error("Content elements error:", contentElementsError);
    else ingestedData.contentElements = { count: contentElements.length, status: "success" };

    const marketAnalytics = generateMarketIntelligenceAnalytics(brandId, iqviaData);
    const { error: marketAnalyticsError } = await supabase
      .from("market_intelligence_analytics")
      .insert(marketAnalytics);
    if (marketAnalyticsError) console.error("Market analytics error:", marketAnalyticsError);
    else ingestedData.marketAnalytics = { count: marketAnalytics.length, status: "success" };

    const hcpAnalytics = generateHCPEngagementAnalytics(brandId, veevaData);
    const { error: hcpAnalyticsError } = await supabase
      .from("hcp_engagement_analytics")
      .insert(hcpAnalytics);
    if (hcpAnalyticsError) console.error("HCP analytics error:", hcpAnalyticsError);
    else ingestedData.hcpAnalytics = { count: hcpAnalytics.length, status: "success" };

    const socialAnalytics = generateSocialIntelligenceAnalytics(brandId, socialData);
    const { error: socialAnalyticsError } = await supabase
      .from("social_intelligence_analytics")
      .insert(socialAnalytics);
    if (socialAnalyticsError) console.error("Social analytics error:", socialAnalyticsError);
    else ingestedData.socialAnalytics = { count: socialAnalytics.length, status: "success" };

    console.log("✅ Analytics generation complete");

    return new Response(
      JSON.stringify({
        success: true,
        message: "Multi-dimensional data and analytics ingested successfully",
        data: ingestedData,
        totalRecords: Object.values(ingestedData).reduce((sum, item) => sum + (item.count || 0), 0),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
