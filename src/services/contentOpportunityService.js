// Note: The 'supabase' client and 'TrendDetectionService' must be globally available
// or imported in the consuming environment for the database operations to work.
// import { supabase } from '@/integrations/supabase/client';
// import { TrendDetectionService } from './trendDetectionService';

/**
 * @typedef {('sentiment_shift' | 'market_movement' | 'competitive_trigger' | 'emerging_topic' | 'regulatory_update' | 'performance_gap' | 'quick_win' | 'sentiment_concern' | 'amplification_opportunity')} OpportunityType
 * @typedef {('low' | 'medium' | 'high' | 'critical')} Priority
 */

/**
 * @typedef {object} ContentOpportunity
 * @property {string} [id]
 * @property {string} brand_id
 * @property {OpportunityType} opportunity_type
 * @property {string} title
 * @property {string} description
 * @property {Priority} priority
 * @property {number} urgency_score
 * @property {number} impact_score
 * @property {number} confidence_score
 * @property {any} trend_data
 * @property {any} intelligence_sources
 * @property {any[]} recommended_actions
 * @property {any[]} [matched_success_patterns]
 * @property {string[]} [target_audiences]
 * @property {string[]} [suggested_channels]
 * @property {number} [estimated_reach]
 * @property {string} [expires_at]
 */

/**
 * Service for identifying, prioritizing, and managing content opportunities
 * based on real-time intelligence signals.
 */
export class ContentOpportunityService {

  /**
   * Generates a list of potential content opportunities by calling various trend detection methods.
   *
   * @param {string} brandId - The ID of the brand.
   * @returns {Promise<ContentOpportunity[]>}
   */
  static async generateOpportunities(brandId) {
      /** @type {ContentOpportunity[]} */
      const opportunities = [];

      // --- Detect sentiment shifts ---
      try {
          const sentimentShifts = await TrendDetectionService.analyzeSentimentShifts(brandId);
          sentimentShifts.slice(0, 3).forEach(shift => {
              const isPositive = shift.trendDirection === 'improving';
              const absChange = Math.abs(shift.change);

              /** @type {ContentOpportunity} */
              const opportunity = {
                  brand_id: brandId,
                  opportunity_type: 'sentiment_shift',
                  title: `${isPositive ? '📈' : '📉'} ${shift.topic} Sentiment ${isPositive ? 'Rising' : 'Declining'}`,
                  description: `Social sentiment around "${shift.topic}" has ${isPositive ? 'improved' : 'declined'} by ${Math.abs(shift.change * 100).toFixed(1)}% (from ${(shift.previousSentiment * 100).toFixed(1)}% to ${(shift.currentSentiment * 100).toFixed(1)}%). ${isPositive ? 'Capitalize on this positive momentum with targeted content.' : 'Address concerns with educational content and empathy.'}`,
                  priority: absChange > 0.3 ? 'high' : 'medium',
                  urgency_score: Math.min(100, absChange * 200),
                  impact_score: Math.min(100, shift.volume / 10),
                  confidence_score: Math.min(0.95, 0.6 + (shift.volume / 1000) * 0.2 + (absChange > 0.2 ? 0.15 : 0)),
                  trend_data: shift,
                  intelligence_sources: ['social_listening_data', 'social_intelligence_analytics'],
                  recommended_actions: [
                      { action: 'Create responsive content', details: `Develop ${isPositive ? 'celebration' : 'educational'} content addressing ${shift.topic}` },
                      { action: 'Monitor progression', details: 'Track sentiment evolution over next 2 weeks' },
                      { action: 'Engage audience', details: `Launch ${isPositive ? 'amplification' : 'response'} campaign` }
                  ],
                  target_audiences: ['HCP', 'Patients'],
                  suggested_channels: ['Social', 'Email'],
                  expires_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
              };
              opportunities.push(opportunity);
          });
      } catch (err) {
          console.error('Error detecting sentiment shifts:', err);
      }

      // --- Detect market movements ---
      try {
          const marketMovements = await TrendDetectionService.detectMarketMovements(brandId);
          marketMovements.slice(0, 2).forEach(movement => {
              const isGrowth = movement.changePercent > 0;

              // Format values based on metric type
              let valueDisplay = '';
              if (movement.metric.includes('Prescriptions')) {
                  valueDisplay = `${(movement.previousValue / 1000).toFixed(0)}K → ${(movement.currentValue / 1000).toFixed(0)}K Rx`;
              } else if (movement.metric.includes('Share')) {
                  valueDisplay = `${movement.previousValue.toFixed(1)}% → ${movement.currentValue.toFixed(1)}%`;
              } else {
                  valueDisplay = `${movement.previousValue.toFixed(1)} → ${movement.currentValue.toFixed(1)}`;
              }

              /** @type {ContentOpportunity} */
              const opportunity = {
                  brand_id: brandId,
                  opportunity_type: 'market_movement',
                  title: `${isGrowth ? '📈' : '⚠️'} ${movement.metric} ${isGrowth ? 'Up' : 'Down'} ${Math.abs(movement.changePercent).toFixed(1)}%`,
                  description: `${movement.metric} ${isGrowth ? 'increased' : 'decreased'} by ${Math.abs(movement.changePercent).toFixed(1)}% (${valueDisplay}). ${isGrowth ? 'Capitalize on this momentum with market leadership messaging and success stories.' : 'Address market challenges with differentiation and value proposition content.'}`,
                  priority: movement.significance === 'high' ? 'high' : 'medium',
                  urgency_score: movement.significance === 'high' ? 85 : 60,
                  impact_score: Math.min(100, Math.abs(movement.changePercent) * 5),
                  confidence_score: Math.min(0.95, 0.7 + (marketMovements.length * 0.03)),
                  trend_data: { ...movement, valueDisplay },
                  intelligence_sources: { primary: 'market_intelligence_analytics', dataPoints: `${marketMovements.length} months analyzed` },
                  recommended_actions: [
                      { action: isGrowth ? 'Amplify market momentum' : 'Address competitive pressure', details: `Create content highlighting ${isGrowth ? 'market leadership and growth trajectory' : 'competitive advantages and value proposition'}` },
                      { action: 'Stakeholder briefing', details: 'Update key stakeholders on market dynamics and recommended response' }
                  ],
                  target_audiences: ['HCP'],
                  suggested_channels: ['Email', 'Webinar']
              };
              opportunities.push(opportunity);
          });
      } catch (err) {
          console.error('Error detecting market movements:', err);
      }


      // --- Identify competitive triggers ---
      try {
          const competitiveTriggers = await TrendDetectionService.identifyCompetitiveTriggers(brandId);
          competitiveTriggers.slice(0, 2).forEach(trigger => {
              /** @type {ContentOpportunity} */
              const opportunity = {
                  brand_id: brandId,
                  opportunity_type: 'competitive_trigger',
                  title: `🎯 ${trigger.title}`,
                  description: `${trigger.content.substring(0, 200)}${trigger.content.length > 200 ? '...' : ''} ${trigger.insight ? `Impact: ${trigger.insight}` : ''}`,
                  priority: trigger.threatLevel === 'critical' ? 'critical' : 'high',
                  urgency_score: trigger.threatLevel === 'critical' ? 95 : 75,
                  impact_score: trigger.threatLevel === 'critical' ? 95 : (trigger.insight ? 85 : 70),
                  confidence_score: trigger.content?.length > 200 ? 0.9 : 0.75,
                  trend_data: trigger,
                  intelligence_sources: { primary: 'competitive_intelligence_enriched', competitor: trigger.competitor, type: trigger.activity },
                  recommended_actions: trigger.recommendedActions?.length > 0
                      ? trigger.recommendedActions
                      : [
                          { action: 'Competitive positioning', details: 'Develop differentiation messaging highlighting unique advantages' },
                          { action: 'Response strategy', details: 'Create head-to-head comparison content for field teams' },
                          { action: 'Market monitoring', details: 'Track competitive impact on market share and HCP sentiment' }
                      ],
                  target_audiences: ['HCP', 'Payers'],
                  suggested_channels: ['Email', 'Rep-enabled'],
                  expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
              };
              opportunities.push(opportunity);
          });
      } catch (err) {
          console.error('Error identifying competitive triggers:', err);
      }

      // --- Spot emerging topics ---
      try {
          const emergingTopics = await TrendDetectionService.spotEmergingTopics(brandId);
          emergingTopics.slice(0, 2).forEach(topic => {
              /** @type {ContentOpportunity} */
              const opportunity = {
                  brand_id: brandId,
                  opportunity_type: 'emerging_topic',
                  title: `🔥 Trending Topic: ${topic.topic}`,
                  description: `"${topic.topic}" is trending with ${topic.volume} mentions and ${topic.growthRate.toFixed(0)}% growth. Keywords: ${topic.keywords.join(', ')}. Early content creation could establish thought leadership.`,
                  priority: topic.growthRate > 100 ? 'high' : 'medium',
                  urgency_score: Math.min(100, topic.growthRate / 2),
                  impact_score: Math.min(100, topic.volume / 20),
                  confidence_score: Math.min(0.85, 0.5 + (topic.volume / 1000) * 0.2 + (topic.growthRate > 50 ? 0.15 : 0)),
                  trend_data: topic,
                  intelligence_sources: ['social_listening_data'],
                  recommended_actions: [
                      { action: 'Thought leadership', details: `Create authoritative content on ${topic.topic}` },
                      { action: 'Social engagement', details: 'Join the conversation with expert perspectives' },
                      { action: 'SEO optimization', details: `Optimize content for trending keywords: ${topic.keywords.join(', ')}` }
                  ],
                  target_audiences: ['HCP', 'Patients'],
                  suggested_channels: ['Social', 'Blog', 'Email'],
                  estimated_reach: Math.round(topic.volume * 3),
                  expires_at: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString()
              };
              opportunities.push(opportunity);
          });
      } catch (err) {
          console.error('Error detecting emerging topics:', err);
      }

      // --- Sentiment concerns - negative topics to address ---
      try {
          const sentimentConcerns = await TrendDetectionService.identifySentimentConcerns(brandId);
          sentimentConcerns.slice(0, 2).forEach(concern => {
              /** @type {ContentOpportunity} */
              const opportunity = {
                  brand_id: brandId,
                  opportunity_type: 'sentiment_concern',
                  title: `⚠️ Address ${concern.topic} Concerns`,
                  description: `${concern.negativeVolume} negative mentions about "${concern.topic}" on ${concern.platform}${concern.keyIssues?.length > 0 ? `. Key concerns: ${concern.keyIssues.join(', ')}` : ''}. Develop responsive content to address these concerns with education and empathy.`,
                  priority: concern.urgency === 'high' ? 'high' : 'medium',
                  urgency_score: concern.urgency === 'high' ? 85 : 65,
                  impact_score: Math.min(100, concern.negativeVolume / 5),
                  confidence_score: Math.min(0.9, 0.55 + (concern.negativeVolume / 1000) * 0.2 + (concern.keyIssues?.length > 0 ? 0.15 : 0)),
                  trend_data: concern,
                  intelligence_sources: { primary: 'social_listening_data', platform: concern.platform, volume: concern.negativeVolume },
                  recommended_actions: [
                      { action: 'Educational content', details: `Create evidence-based content addressing concerns about ${concern.topic}` },
                      { action: 'Platform engagement', details: `Increase responsive presence on ${concern.platform}` },
                      { action: 'Sentiment monitoring', details: 'Track sentiment changes after content deployment' }
                  ],
                  target_audiences: ['HCP', 'Patients'],
                  suggested_channels: ['Social', 'Blog', 'Email'],
                  expires_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
              };
              opportunities.push(opportunity);
          });
      } catch (err) {
          console.error('Error detecting sentiment concerns:', err);
      }

      // --- Quick wins - positive sentiment to amplify ---
      try {
          const quickWins = await TrendDetectionService.identifyQuickWins(brandId);
          quickWins.slice(0, 2).forEach(win => {
              /** @type {ContentOpportunity} */
              const opportunity = {
                  brand_id: brandId,
                  opportunity_type: 'amplification_opportunity',
                  title: `🔥 Amplify ${win.topic} Success`,
                  description: `${win.positiveVolume} positive mentions about "${win.topic}" across ${win.platforms.join(', ')}. High amplification potential (${win.amplificationPotential.toFixed(0)}%). Leverage this momentum with celebration and success stories.`,
                  priority: 'high',
                  urgency_score: Math.min(100, win.amplificationPotential),
                  impact_score: Math.min(100, win.positiveVolume / 5),
                  confidence_score: Math.min(0.95, 0.6 + (win.positiveVolume / 1000) * 0.2 + (win.amplificationPotential > 50 ? 0.15 : 0)),
                  trend_data: win,
                  intelligence_sources: { primary: 'social_listening_data', platforms: win.platforms, volume: win.positiveVolume },
                  recommended_actions: [
                      { action: 'Success amplification', details: `Create thought leadership content celebrating ${win.topic}` },
                      { action: 'Multi-platform deployment', details: `Deploy across ${win.platforms.join(', ')} for maximum reach` },
                      { action: 'Engagement tracking', details: 'Monitor amplification impact and engagement metrics' }
                  ],
                  target_audiences: ['HCP', 'Patients'],
                  suggested_channels: win.platforms.map(p => p.charAt(0).toUpperCase() + p.slice(1)),
                  estimated_reach: Math.round(win.positiveVolume * 3),
                  expires_at: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString()
              };
              opportunities.push(opportunity);
          });
      } catch (err) {
          console.error('Error detecting quick wins:', err);
      }

      return opportunities;
  }

  /**
   * Prioritizes a list of opportunities based on a calculated score combining
   * urgency, impact, and confidence.
   *
   * @param {ContentOpportunity[]} opportunities - The list of opportunities to prioritize.
   * @returns {ContentOpportunity[]} - The sorted list.
   */
  static prioritizeByImpact(opportunities) {
      return opportunities.sort((a, b) => {
          const scoreA = (a.urgency_score + a.impact_score) * a.confidence_score;
          const scoreB = (b.urgency_score + b.impact_score) * b.confidence_score;
          return scoreB - scoreA;
      });
  }

  /**
   * Finds relevant content success patterns for a given opportunity.
   *
   * @param {ContentOpportunity} opportunity - The opportunity to match against patterns.
   * @returns {Promise<any[]>} - A list of matched success patterns.
   */
  static async matchWithSuccessPatterns(opportunity) {
      try {
          const { data } = await supabase
              .from('content_success_patterns')
              .select('*')
              .eq('brand_id', opportunity.brand_id)
              .in('validation_status', ['validated', 'discovered'])
              .order('avg_performance_lift', { ascending: false })
              .limit(3);

          return data || [];
      } catch (error) {
          console.error('Error matching patterns:', error);
          return [];
      }
  }

  /**
   * Saves a content opportunity to the database, including matching it
   * against existing success patterns.
   *
   * @param {ContentOpportunity} opportunity - The opportunity data to save.
   * @returns {Promise<string | null>} - The ID of the inserted opportunity or null on failure.
   */
  static async saveOpportunity(opportunity) {
      try {
          // Find relevant success patterns
          const patterns = await this.matchWithSuccessPatterns(opportunity);

          const { data, error } = await supabase
              .from('content_opportunities')
              .insert({
                  ...opportunity,
                  matched_success_patterns: patterns,
                  // Assume 'status' is an active field, setting it for new inserts
                  status: 'active'
              })
              .select('id')
              .single();

          if (error) {
              console.error('Error saving opportunity:', error);
              return null;
          }

          return data?.id || null;
      } catch (err) {
          console.error('Failed during saveOpportunity:', err);
          return null;
      }
  }

  /**
   * Refreshes (clears and regenerates) all content opportunities for a brand.
   * Active opportunities are marked as 'dismissed' before new ones are generated and saved.
   *
   * @param {string} brandId - The ID of the brand.
   * @returns {Promise<number>} - The count of successfully saved new opportunities.
   */
  static async refreshOpportunities(brandId) {
      console.log(`🔄 Refreshing opportunities for brand: ${brandId}`);
      try {
          // 1. Clear ALL active opportunities (mark as 'dismissed')
          const { error: updateError } = await supabase
              .from('content_opportunities')
              .update({ status: 'dismissed' })
              .eq('brand_id', brandId)
              .eq('status', 'active');

          if (updateError) {
              console.error('Error dismissing old opportunities:', updateError);
          }

          // 2. Generate new opportunities
          const newOpportunities = await this.generateOpportunities(brandId);
          const prioritized = this.prioritizeByImpact(newOpportunities);

          // 3. Deduplicate within the generated batch by title
          const seenTitles = new Set();
          const uniqueOpportunities = prioritized.filter(opp => {
              if (seenTitles.has(opp.title)) return false;
              seenTitles.add(opp.title);
              return true;
          });

          // 4. Save top unique opportunities (limit to 10 for practical display/focus)
          const saved = await Promise.all(
              uniqueOpportunities.slice(0, 10).map(opp => this.saveOpportunity(opp))
          );

          const savedCount = saved.filter(id => id !== null).length;
          console.log(`✅ Successfully saved ${savedCount} new opportunities.`);
          return savedCount;
      } catch (err) {
          console.error('Failed during refreshOpportunities:', err);
          return 0;
      }
  }

  /**
   * Tracks an action taken by a user on a specific opportunity (e.g., viewed, approved, dismissed).
   *
   * @param {string} opportunityId - The ID of the opportunity being acted upon.
   * @param {string} actionType - The type of action (e.g., 'approve', 'dismiss', 'view').
   * @param {any} [metadata] - Optional metadata related to the action.
   */
  static async trackAction(opportunityId, actionType, metadata) {
      try {
          // Fetch current user ID
          const { data: userData, error: authError } = await supabase.auth.getUser();

          if (authError) {
              console.error('Error fetching user for action tracking:', authError);
              throw authError;
          }

          const userId = userData.user?.id;

          const { error } = await supabase
              .from('opportunity_tracking')
              .insert({
                  opportunity_id: opportunityId,
                  user_id: userId,
                  action_type: actionType,
                  action_metadata: metadata || {}
              });

          if (error) {
              console.error('Failed to track opportunity action:', error);
              throw error;
          }
      } catch (err) {
          console.error('Error tracking action:', err);
      }
  }
}