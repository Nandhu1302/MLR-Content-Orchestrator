
// intelligence.js (Node.js / ESM)
// Run: node intelligence.js
// Env needed: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, LOVABLE_API_KEY
import express from 'express';
import fetch from 'node-fetch';
import { createClient } from '@supabase/supabase-js';

const app = express();
app.use(express.json());

// ---- CORS (same headers as original) ----
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Preflight (OPTIONS)
app.options('/', (req, res) => {
  res.set(corsHeaders).status(204).end();
});

// ---- Main handler (same logic & context) ----
app.post('/', async (req, res) => {
  if (req.method === 'OPTIONS') {
    return res.set(corsHeaders).status(204).end();
  }

  try {
    const { themeId, brandId, intelligenceType } = req.body || {};
    if (!themeId || !brandId || !intelligenceType) {
      throw new Error('Theme ID, Brand ID, and Intelligence Type are required');
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const lovableApiKey = process.env.LOVABLE_API_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase environment variables not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log(`🧠 Generating ${intelligenceType} intelligence for theme:`, themeId);

    let intelligenceData;
    switch (intelligenceType) {
      case 'brand':
        intelligenceData = await generateBrandIntelligence(supabase, themeId, brandId, lovableApiKey);
        break;
      case 'competitive':
        intelligenceData = await generateCompetitiveIntelligence(supabase, themeId, brandId, lovableApiKey);
        break;
      case 'market':
        intelligenceData = await generateMarketIntelligence(supabase, themeId, brandId, lovableApiKey);
        break;
      default:
        throw new Error(`Unknown intelligence type: ${intelligenceType}`);
    }

    // Store the generated intelligence (same fields)
    const { data: savedIntelligence, error: saveError } = await supabase
      .from('theme_intelligence')
      .insert({
        theme_id: themeId,
        intelligence_type: intelligenceType,
        data: intelligenceData,
        data_sources: intelligenceData?.dataSources ?? [],
        confidence_score: intelligenceData?.confidenceScore ?? 0.5,
        last_data_refresh: new Date().toISOString(),
        incorporated: false,
      })
      .select()
      .single();

    if (saveError) throw saveError;

    return res
      .set({ ...corsHeaders, 'Content-Type': 'application/json' })
      .status(200)
      .json({ success: true, intelligence: savedIntelligence });
  } catch (error) {
    console.error('Error generating intelligence:', error);
    return res
      .set({ ...corsHeaders, 'Content-Type': 'application/json' })
      .status(500)
      .json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// ---- Helper functions (same behavior as original) ----

async function generateBrandIntelligence(supabase, themeId, brandId, lovableApiKey) {
  // Query SFMC campaign data
  const { data: campaignData } = await supabase
    .from('sfmc_campaign_data')
    .select('*')
    .eq('brand_id', brandId)
    .order('send_date', { ascending: false })
    .limit(20);

  if (!campaignData || campaignData.length === 0) {
    return getDefaultBrandIntelligence();
  }

  // Get theme data for context
  const { data: theme } = await supabase
    .from('theme_library')
    .select('*')
    .eq('id', themeId)
    .single();

  // Calculate metrics
  const avgOpenRate =
    campaignData.reduce((sum, c) => sum + (c.open_rate ?? 0), 0) / campaignData.length;
  const avgClickRate =
    campaignData.reduce((sum, c) => sum + (c.click_rate ?? 0), 0) / campaignData.length;
  const avgConvRate =
    campaignData.reduce((sum, c) => sum + (c.conversion_rate ?? 0), 0) / campaignData.length;

  // Top performing campaigns
  const bestPerformers = [...campaignData]
    .sort((a, b) => (b.conversion_rate ?? 0) - (a.conversion_rate ?? 0))
    .slice(0, 3);

  // Common themes
  const themeCounts = new Map();
  campaignData.forEach((campaign) => {
    (campaign.message_themes ?? []).forEach((t) => {
      themeCounts.set(t, (themeCounts.get(t) ?? 0) + 1);
    });
  });
  const messagingPatterns = Array.from(themeCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([theme]) => theme);

  // AI synthesis (if available)
  if (lovableApiKey) {
    try {
      const synthesized = await synthesizeWithAI(lovableApiKey, {
        type: 'brand',
        campaignData: bestPerformers,
        metrics: { avgOpenRate, avgClickRate, avgConvRate },
        themes: messagingPatterns,
        themeContext: theme,
      });
      if (synthesized) {
        return {
          ...synthesized,
          dataSources: ['SFMC Campaign Analytics'],
          confidenceScore: Math.min(campaignData.length / 20, 1),
        };
      }
    } catch (error) {
      console.error('AI synthesis failed, falling back to data-only analysis:', error);
    }
  }

  // Fallback: data-only intelligence
  return {
    historicalPerformance: {
      bestPerforming: bestPerformers.map((c) => ({
        campaign: c.campaign_name,
        metrics: {
          open_rate: c.open_rate ?? 0,
          click_rate: c.click_rate ?? 0,
          conversion_rate: c.conversion_rate ?? 0,
        },
        themes: c.message_themes ?? [],
      })),
      averageMetrics: { open_rate: avgOpenRate, click_rate: avgClickRate, conversion_rate: avgConvRate },
    },
    messagingPatterns,
    brandVoice: 'Professional, evidence-based, patient-centric',
    recommendations: [
      `Focus on ${messagingPatterns[0] ?? 'key themes'} - appears in top-performing campaigns`,
      `Target ${avgOpenRate.toFixed(1)}%+ open rate based on historical averages`,
      'Maintain consistent brand voice across touchpoints',
    ],
    dataSources: ['SFMC Campaign Analytics'],
    confidenceScore: Math.min(campaignData.length / 20, 1),
  };
}

async function generateCompetitiveIntelligence(supabase, themeId, brandId, lovableApiKey) {
  const { data: competitorData } = await supabase
    .from('competitive_intelligence_data')
    .select('*')
    .eq('brand_id', brandId)
    .order('date_captured', { ascending: false })
    .limit(20);

  const { data: fieldData } = await supabase
    .from('veeva_field_insights')
    .select('*')
    .eq('brand_id', brandId)
    .not('competitive_mentions', 'eq', '[]')
    .order('recorded_date', { ascending: false })
    .limit(20);

  if ((!competitorData || competitorData.length === 0) && (!fieldData || fieldData.length === 0)) {
    return getDefaultCompetitiveIntelligence();
  }

  // Extract competitor names
  const competitors = new Set();
  (competitorData ?? []).forEach((item) => competitors.add(item.competitor_brand));
  (fieldData ?? []).forEach((item) => {
    (item.competitive_mentions ?? []).forEach((mention) => {
      competitors.add(mention.competitor ?? mention);
    });
  });

  // Extract objections
  const objections = new Set();
  (fieldData ?? []).forEach((item) => {
    (item.objections ?? []).forEach((obj) => objections.add(obj));
  });

  const competitorsList = Array.from(competitors).map((name) => ({ name, positioning: 'Market competitor' }));
  const objectionsList = Array.from(objections);

  if (lovableApiKey) {
    try {
      const synthesized = await synthesizeWithAI(lovableApiKey, {
        type: 'competitive',
        competitors: competitorsList,
        objections: objectionsList,
        competitorData,
        fieldData,
      });
      if (synthesized) {
        const compLen = (competitorData?.length ?? 0);
        const fieldLen = (fieldData?.length ?? 0);
        return {
          ...synthesized,
          dataSources: ['Competitive Intelligence Database', 'Veeva Field Insights'],
          confidenceScore: Math.min((compLen + fieldLen) / 30, 1),
        };
      }
    } catch (error) {
      console.error('AI synthesis failed, falling back to data-only analysis:', error);
    }
  }

  const compLen = (competitorData?.length ?? 0);
  const fieldLen = (fieldData?.length ?? 0);

  return {
    competitors: competitorsList.slice(0, 5),
    differentiators: ['Unique clinical profile', 'Strong safety data', 'Patient support programs'],
    threats: competitorsList.map((c) => `${c.name} market presence`),
    hcpObjections: objectionsList.slice(0, 5),
    counterMessaging: objectionsList.slice(0, 3).map((obj) => `Address "${obj}" with clinical evidence`),
    dataSources: ['Competitive Intelligence Database', 'Veeva Field Insights'],
    confidenceScore: Math.min((compLen + fieldLen) / 30, 1),
  };
}

async function generateMarketIntelligence(supabase, themeId, brandId, lovableApiKey) {
  const { data: marketData } = await supabase
    .from('iqvia_market_data')
    .select('*')
    .eq('brand_id', brandId)
    .order('data_date', { ascending: false })
    .limit(20);

  const { data: socialData } = await supabase
    .from('social_listening_data')
    .select('*')
    .eq('brand_id', brandId)
    .order('date_captured', { ascending: false })
    .limit(50);

  if ((!marketData || marketData.length === 0) && (!socialData || socialData.length === 0)) {
    return getDefaultMarketIntelligence();
  }

  // Sentiment analysis
  const sentimentCounts = { positive: 0, neutral: 0, negative: 0 };
  (socialData ?? []).forEach((post) => {
    const key = post.sentiment;
    const vol = post.mention_volume ?? 1;
    if (key in sentimentCounts) sentimentCounts[key] += vol;
  });

  const total = sentimentCounts.positive + sentimentCounts.neutral + sentimentCounts.negative;
  const sentimentScore = total > 0 ? (sentimentCounts.positive - sentimentCounts.negative) / total : 0;

  // Trending topics
  const topicVolume = new Map();
  (socialData ?? []).forEach((post) => {
    const prev = topicVolume.get(post.topic) ?? 0;
    topicVolume.set(post.topic, prev + (post.mention_volume ?? 1));
  });
  const audienceConcerns = Array.from(topicVolume.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([topic]) => topic);

  if (lovableApiKey) {
    try {
      const synthesized = await synthesizeWithAI(lovableApiKey, {
        type: 'market',
        marketData,
        socialData,
        sentiment: { score: sentimentScore, breakdown: sentimentCounts },
        concerns: audienceConcerns,
      });
      if (synthesized) {
        const mLen = (marketData?.length ?? 0);
        const sLen = (socialData?.length ?? 0);
        return {
          ...synthesized,
          dataSources: ['IQVIA Market Analytics', 'Social Listening'],
          confidenceScore: Math.min((mLen + sLen) / 50, 1),
        };
      }
    } catch (error) {
      console.error('AI synthesis failed, falling back to data-only analysis:', error);
    }
  }

  const mLen = (marketData?.length ?? 0);
  const sLen = (socialData?.length ?? 0);

  return {
    marketTrends: marketData?.[0]
      ? `${marketData[0].metric_type}: ${marketData[0].value}`
      : 'Market data available',
    patientSentiment: {
      score: sentimentScore,
      breakdown: {
        positive: total > 0 ? sentimentCounts.positive / total : 0,
        neutral: total > 0 ? sentimentCounts.neutral / total : 0,
        negative: total > 0 ? sentimentCounts.negative / total : 0,
      },
    },
    audienceConcerns,
    prescriptionData: mLen ? `${mLen} data points analyzed` : 'Data pending',
    positioning:
      sentimentScore > 0.3
        ? 'Leverage positive sentiment with confidence messaging'
        : 'Address concerns with evidence-based reassurance',
    dataSources: ['IQVIA Market Analytics', 'Social Listening'],
    confidenceScore: Math.min((mLen + sLen) / 50, 1),
  };
}

async function synthesizeWithAI(apiKey, context) {
  const systemPrompt = `You are a pharmaceutical marketing intelligence analyst synthesizing REAL DATA into strategic insights.
CRITICAL: You must ONLY use the data provided. Do NOT make up information.
Your role is to find patterns, correlations, and opportunities in the REAL data.`;

  const userPrompt = `Analyze this REAL DATA and provide strategic synthesis:
${JSON.stringify(context, null, 2)}
Return structured intelligence based ONLY on the data provided above.`;

  const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'google/gemini-2.5-flash',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    console.error('AI synthesis failed:', response.status, response.statusText);
    return null;
  }

  const result = await response.json();
  const content = result.choices?.[0]?.message?.content;
  if (content) {
    try {
      return JSON.parse(content);
    } catch {
      return { synthesisText: content };
    }
  }
  return null;
}

// ---- Defaults (unchanged logic) ----
function getDefaultBrandIntelligence() {
  return {
    historicalPerformance: {
      bestPerforming: [],
      averageMetrics: { open_rate: 0, click_rate: 0, conversion_rate: 0 },
    },
    messagingPatterns: ['efficacy', 'safety', 'patient-support'],
    brandVoice: 'Professional, evidence-based, patient-centric',
    recommendations: ['Ingest campaign data to enable data-driven intelligence'],
    dataSources: ['Default Template - No Data'],
    confidenceScore: 0.1,
  };
}

function getDefaultCompetitiveIntelligence() {
  return {
    competitors: [],
    differentiators: ['Unique therapeutic profile'],
    threats: ['Competitive data pending'],
    hcpObjections: ['Awaiting field feedback'],
    counterMessaging: ['Emphasize clinical evidence'],
    dataSources: ['Default Template - No Data'],
    confidenceScore: 0.1,
  };
}

function getDefaultMarketIntelligence() {
  return {
    marketTrends: 'Market data pending',
    patientSentiment: { score: 0, breakdown: { positive: 0, neutral: 0, negative: 0 } },
    audienceConcerns: ['Awaiting social listening data'],
    prescriptionData: 'IQVIA data pending',
    positioning: 'Evidence-based positioning',
    dataSources: ['Default Template - No Data'],
    confidenceScore: 0.1,
  };
}

