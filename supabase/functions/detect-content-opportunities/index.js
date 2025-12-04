import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// TypeScript interface 'Database' removed.

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Non-null assertion operator (!) removed.
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    // Added check for stability
    if (!supabaseUrl || !supabaseServiceKey) {
        throw new Error("Supabase environment variables not configured.");
    }
    
    // Generic type <Database> removed.
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('🔍 Starting content opportunity detection...');

    // Get all active brands
    const { data: brands, error: brandsError } = await supabase
      .from('brand_profiles')
      .select('id, brand_name');

    if (brandsError) throw brandsError;

    const results = [];

    for (const brand of brands || []) {
      console.log(`📊 Analyzing opportunities for ${brand.brand_name}...`);
      
      try {
        // This would call the ContentOpportunityService logic
        // For now, we'll do a simplified version directly
        
        // Detect sentiment shifts
        const { data: sentimentData } = await supabase
          .from('social_listening_data')
          .select('topic, sentiment_score, volume, date_captured')
          .eq('brand_id', brand.id)
          .gte('date_captured', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
          .order('date_captured', { ascending: false });

        if (sentimentData && sentimentData.length > 0) {
          // Simplified sentiment analysis
          const topics = new Map();
          sentimentData.forEach(d => {
            if (!topics.has(d.topic)) {
              // Non-null assertion operator (!) removed
              topics.set(d.topic, []);
            }
            // Non-null assertion operator (!) removed
            topics.get(d.topic).push(d.sentiment_score || 0);
          });

          for (const [topic, scores] of topics.entries()) {
            if (scores.length >= 5) {
              const recent = scores.slice(0, Math.floor(scores.length / 2));
              const older = scores.slice(Math.floor(scores.length / 2));
              // Type annotation removed from reduce function
              const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
              // Type annotation removed from reduce function
              const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;
              const change = recentAvg - olderAvg;

              if (Math.abs(change) > 0.15) {
                const isPositive = change > 0;
                await supabase.from('content_opportunities').insert({
                  brand_id: brand.id,
                  opportunity_type: 'sentiment_shift',
                  title: `${isPositive ? '📈' : '📉'} ${topic} Sentiment ${isPositive ? 'Rising' : 'Declining'}`,
                  description: `Social sentiment around "${topic}" has ${isPositive ? 'improved' : 'declined'} by ${Math.abs(change * 100).toFixed(1)}%.`,
                  priority: Math.abs(change) > 0.3 ? 'high' : 'medium',
                  urgency_score: Math.min(100, Math.abs(change) * 200),
                  impact_score: 70,
                  confidence_score: 0.85,
                  trend_data: { topic, change, recentAvg, olderAvg },
                  intelligence_sources: ['social_listening_data'],
                  recommended_actions: [
                    { action: 'Create responsive content', details: `Develop ${isPositive ? 'celebration' : 'educational'} content` }
                  ],
                  expires_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
                });
              }
            }
          }
        }

        // Check market movements
        const { data: marketData } = await supabase
          .from('market_intelligence_analytics')
          .select('*')
          .eq('brand_id', brand.id)
          .order('reporting_month', { ascending: false })
          .limit(8);

        if (marketData && marketData.length >= 4) {
          const recent = marketData.slice(0, 4);
          const older = marketData.slice(4);
          
          // Type annotation removed from reduce function
          const recentShare = recent.reduce((sum, d) => sum + (d.market_share_percent || 0), 0) / recent.length;
          // Type annotation removed from reduce function
          const olderShare = older.reduce((sum, d) => sum + (d.market_share_percent || 0), 0) / older.length;
          const shareChange = ((recentShare - olderShare) / olderShare) * 100;

          if (Math.abs(shareChange) > 5) {
            const isGrowth = shareChange > 0;
            await supabase.from('content_opportunities').insert({
              brand_id: brand.id,
              opportunity_type: 'market_movement',
              title: `${isGrowth ? '🚀' : '⚠️'} Market Share ${isGrowth ? 'Growing' : 'Declining'}`,
              description: `Market share has ${isGrowth ? 'increased' : 'decreased'} by ${Math.abs(shareChange).toFixed(1)}%.`,
              priority: Math.abs(shareChange) > 10 ? 'high' : 'medium',
              urgency_score: Math.abs(shareChange) > 10 ? 85 : 60,
              impact_score: Math.min(100, Math.abs(shareChange) * 5),
              confidence_score: 0.9,
              trend_data: { shareChange, recentShare, olderShare },
              intelligence_sources: ['market_intelligence_analytics'],
              recommended_actions: [
                { action: isGrowth ? 'Amplify success' : 'Address gaps', details: 'Create relevant content' }
              ]
            });
          }
        }

        // Check competitive triggers
        const { data: compData } = await supabase
          .from('competitive_intelligence_enriched')
          .select('*')
          .eq('brand_id', brand.id)
          .gte('discovered_at', new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString())
          .in('threat_level', ['high', 'critical']);

        if (compData && compData.length > 0) {
          for (const comp of compData.slice(0, 2)) {
            await supabase.from('content_opportunities').insert({
              brand_id: brand.id,
              opportunity_type: 'competitive_trigger',
              title: `🎯 Competitor Activity: ${comp.competitor_name}`,
              description: comp.impact_assessment || comp.content.substring(0, 200),
              priority: comp.threat_level === 'critical' ? 'critical' : 'high',
              urgency_score: comp.threat_level === 'critical' ? 95 : 75,
              impact_score: 80,
              confidence_score: 0.8,
              trend_data: { competitor: comp.competitor_name, type: comp.intelligence_type },
              intelligence_sources: ['competitive_intelligence_enriched'],
              recommended_actions: [
                { action: 'Differentiation campaign', details: 'Highlight unique value propositions' }
              ],
              expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
            });
          }
        }

        results.push({
          brand_id: brand.id,
          brand_name: brand.brand_name,
          status: 'success'
        });

      } catch (error) {
        console.error(`Error processing brand ${brand.brand_name}:`, error);
        results.push({
          brand_id: brand.id,
          brand_name: brand.brand_name,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    console.log('✅ Opportunity detection complete');

    return new Response(
      JSON.stringify({
        success: true,
        processed: brands?.length || 0,
        results
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('❌ Error in detect-content-opportunities:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});