// ============================================
// Intelligence Query Tools for Story Consultant
// Enables AI to query live data during conversation
// ============================================

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

/**
 * Queries key brand performance and competitive metrics.
 * @param {object} args - Arguments (unused, but kept for tool conformity).
 * @param {string} brandId - The ID of the brand.
 * @param {object} supabase - The Supabase client instance.
 */
export async function queryBrandStatus(args, brandId, supabase) {
  console.log('Querying brand status for:', brandId);
  
  // Note: In a real environment, the supabase client might be passed in, 
  // or created here using environment variables.
  
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
  const activeAssets = assets.data?.filter(a => a.status === 'approved').length || 0;
  
  // Format results for the AI
  return {
    marketShare: marketData?.market_share_percent || 0,
    rxGrowth: marketData?.rx_growth_rate || 0,
    topRegion: marketData?.top_performing_region || 'National',
    activeAssetsCount: activeAssets,
    campaigns: campaigns.data?.map(c => ({
      name: c.campaign_name,
      npi: c.npi_lift_percent, // NPI Lift
      roi: c.roi_index
    })) || [],
    competitiveSignals: competitive.data?.map(c => ({
      competitor: c.competitor_name,
      signal: c.signal_type,
      relevance: c.relevance_score
    })) || []
  };
}

/**
 * Queries historical campaign performance for specific channels or regions.
 * @param {object} args - Arguments including channel, region, and timeframe.
 * @param {string} brandId - The ID of the brand.
 * @param {object} supabase - The Supabase client instance.
 */
export async function queryCampaignHistory(args, brandId, supabase) {
  console.log('Querying campaign history with arguments:', args);
  
  let query = supabase.from('campaign_performance_analytics').select('*')
    .eq('brand_id', brandId)
    .order('calculated_at', { ascending: false })
    .limit(10);
    
  if (args.channel) {
    query = query.eq('channel', args.channel);
  }
  if (args.region) {
    query = query.eq('region', args.region);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Campaign History Error:', error);
    return { error: 'Failed to retrieve campaign history data.' };
  }
  
  // Summarize and format the data
  const summary = {
    totalCampaigns: data.length,
    averageNpiLift: data.reduce((sum, c) => sum + (c.npi_lift_percent || 0), 0) / data.length || 0,
    averageRoi: data.reduce((sum, c) => sum + (c.roi_index || 0), 0) / data.length || 0,
    topPerformer: data.sort((a, b) => (b.npi_lift_percent || 0) - (a.npi_lift_percent || 0))[0]?.campaign_name || 'N/A'
  };

  return summary;
}

/**
 * Queries in-depth insights about a specific audience segment.
 * @param {object} args - Arguments including audience_type.
 * @param {string} brandId - The ID of the brand.
 * @param {object} supabase - The Supabase client instance.
 */
export async function queryAudienceInsights(args, brandId, supabase) {
  console.log('Querying audience insights for:', args.audience_type);
  
  const { data, error } = await supabase.from('audience_insights').select('*')
    .eq('brand_id', brandId)
    .eq('audience_segment', args.audience_type)
    .single();

  if (error || !data) {
    console.error('Audience Insights Error:', error);
    return {
      audience: args.audience_type,
      error: 'No specific data found, relying on general segment knowledge.',
      keyBarriers: ['Lack of awareness', 'Cost concerns'],
      preferredChannels: ['Peer-reviewed journals', 'Conferences'],
      decisionFactors: ['Clinical efficacy', 'Safety profile']
    };
  }
  
  return {
    audience: data.audience_segment,
    keyBarriers: data.primary_barriers || [],
    preferredChannels: data.preferred_channels || [],
    decisionFactors: data.top_decision_factors || [],
    recentInteractionRate: data.interaction_rate_last_90d || 0.15
  };
}

/**
 * Recommends a multi-channel strategy with performance predictions.
 * @param {object} args - Arguments including audience, occasion, region, and activities.
 * @param {string} brandId - The ID of the brand (unused but kept for tool conformity).
 * @param {object} supabase - The Supabase client instance (unused but kept for tool conformity).
 */
export async function suggestMultiChannelApproach(args, brandId, supabase) {
  console.log('Suggesting multi-channel approach with arguments:', args);

  // NOTE: This is a complex simulation, typically performed by a machine learning model.
  // The logic here is purely illustrative and heuristic.
  
  const baseLift = 0.05; // 5% baseline NRx lift prediction
  const channels = [];

  // Heuristic for channel selection
  if (args.occasion.toLowerCase().includes('congress')) {
    channels.push({ name: 'Conference Booth Follow-up Email', estimatedLift: baseLift + 0.02, roiIndex: 4.5 });
    channels.push({ name: 'Post-Event Social Media Retargeting', estimatedLift: baseLift + 0.015, roiIndex: 3.2 });
  } else if (args.activities?.includes('rep_visit')) {
    channels.push({ name: 'Digital Sales Aid (Rep)', estimatedLift: baseLift + 0.03, roiIndex: 5.8 });
    channels.push({ name: 'Rep-Triggered Email', estimatedLift: baseLift + 0.025, roiIndex: 4.9 });
  } else {
    channels.push({ name: 'Educational Webinar Series', estimatedLift: baseLift + 0.04, roiIndex: 6.5 });
    channels.push({ name: 'Search Engine Marketing (SEO/SEM)', estimatedLift: baseLift + 0.01, roiIndex: 2.1 });
  }
  
  const totalPredictedLift = channels.reduce((sum, c) => sum + c.estimatedLift, 0);

  return {
    strategySummary: `A coordinated multi-channel approach focusing on ${args.audience} for the ${args.occasion}.`,
    predictedNpiLift: parseFloat(totalPredictedLift.toFixed(3)),
    recommendedChannels: channels
  };
}

/**
 * Pre-selects relevant clinical claims, visual assets, and content modules.
 * @param {object} args - Arguments including audience, occasion, and asset_types.
 * @param {string} brandId - The ID of the brand.
 * @param {object} supabase - The Supabase client instance.
 */
export async function preSelectEvidence(args, brandId, supabase) {
  console.log('Pre-selecting evidence with arguments:', args);
  
  // NOTE: This simulation fetches data directly from the DB based on heuristics.
  
  const { data: claimsData } = await supabase.from('mlr_approved_claims')
    .select('claim_text, data_point, source')
    .eq('brand_id', brandId)
    .or(`audience.cs.{"${args.audience}"},asset_type.cs.{"${args.asset_types?.[0] || 'Email'}"}`)
    .limit(3);

  const { data: visualData } = await supabase.from('visual_assets')
    .select('title, type, link')
    .eq('brand_id', brandId)
    .limit(2);

  return {
    audience: args.audience,
    claims: claimsData?.map(c => ({ 
      claim: c.claim_text.substring(0, 100) + '...', 
      data: c.data_point 
    })) || [],
    visualAssets: visualData?.map(v => ({ 
      title: v.title, 
      type: v.type,
      link: v.link 
    })) || [],
    contentModules: ['Safety Overview Module', 'Efficacy Trial Summary Module', 'Mechanism of Action Animation']
  };
}


// ============================================
// AI Tool Schema Definitions
// ============================================

/**
 * Tool definitions array used to register functions with the LLM.
 * NOTE: The structure matches the required format for the AI Gateway/LLM tooling.
 */
export const intelligenceQueryTools = [
  {
    name: 'query_brand_status',
    executor: queryBrandStatus,
    description: 'Get an up-to-date snapshot of brand performance (market share, Rx growth), top campaigns, and recent competitive signals.',
    parameters: {
      type: 'object',
      properties: {
        // No specific arguments needed for a general status query
      },
      required: []
    }
  },
  {
    name: 'query_campaign_history',
    executor: queryCampaignHistory,
    description: 'Retrieve historical performance (NRx lift, ROI) for past campaigns, optionally filtered by channel, region, or time.',
    parameters: {
      type: 'object',
      properties: {
        channel: { 
          type: 'string', 
          description: 'Filter by channel (e.g., Email, Social, Display, Rep)' 
        },
        region: { 
          type: 'string', 
          description: 'Filter by region (e.g., Midwest, Northeast)' 
        },
        timeframe: { 
          type: 'string', 
          description: 'Timeframe for analysis (e.g., Last 6 months, Q1 2024)' 
        }
      },
      required: []
    }
  },
  {
    name: 'query_audience_insights',
    executor: queryAudienceInsights,
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
  },
  {
    name: 'suggest_multi_channel_approach',
    executor: suggestMultiChannelApproach,
    description: 'Recommend coordinated multi-channel strategy with performance predictions based on cross-channel journey data',
    parameters: {
      type: 'object',
      properties: {
        audience: { type: 'string' },
        occasion: { type: 'string' },
        region: { type: 'string' },
        activities: { 
          type: 'array',
          items: { type: 'string' },
          description: 'List of specific activities (e.g., "booth_visit", "podium_presentation")'
        }
      }
    }
  },
  {
    name: 'pre_select_evidence',
    executor: preSelectEvidence,
    description: 'Pre-select relevant clinical claims, visual assets, and content modules for confirmed audience and asset types',
    parameters: {
      type: 'object',
      properties: {
        audience: { type: 'string' },
        occasion: { type: 'string' },
        asset_types: { 
          type: 'array', 
          items: { type: 'string' },
          description: 'List of content types to be created (e.g., "email", "digital_sales_aid")'
        }
      },
      required: ['audience']
    }
  }
];