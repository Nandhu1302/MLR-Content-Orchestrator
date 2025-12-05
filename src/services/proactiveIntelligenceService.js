// ============================================
// Proactive Intelligence Service
// Identifies current opportunities for Exploration & Reactive modes
// ============================================

import { supabase } from '@/integrations/supabase/client';
// Note: Type imports like `ProactiveOpportunity` are removed,
// as they are not valid in standard JavaScript without JSDoc.

/**
 * @typedef {'high' | 'medium' | 'low'} Urgency
 * @typedef {'seasonal' | 'performance-gap' | 'competitive' | 'audience-need'} Category
 *
 * @typedef {Object} ProactiveOpportunity
 * @property {string} id
 * @property {string} title
 * @property {Category} category
 * @property {Urgency} urgency
 * @property {string} description
 * @property {string} dataSource
 * @property {string[]} recommendedChannels
 * @property {number} estimatedImpact - 0.0 to 1.0
 * @property {string} [deadline]
 */

export class ProactiveIntelligenceService {
    /**
     * Get current opportunities across all categories
     * @param {string} brandId
     * @returns {Promise<ProactiveOpportunity[]>}
     */
    static async getCurrentOpportunities(brandId) {
        const opportunities = [];

        try {
            // Parallel fetch of all opportunity types
            const [seasonal, performanceGaps, competitive, audienceNeeds] = await Promise.all([
                this.getSeasonalOpportunities(brandId),
                this.getPerformanceGapOpportunities(brandId),
                this.getCompetitiveOpportunities(brandId),
                this.getAudienceNeedOpportunities(brandId)
            ]);

            opportunities.push(...seasonal, ...performanceGaps, ...competitive, ...audienceNeeds);

            // Sort by urgency and estimated impact
            return opportunities.sort((a, b) => {
                const urgencyWeight = { high: 3, medium: 2, low: 1 };
                const aScore = urgencyWeight[a.urgency] * a.estimatedImpact;
                const bScore = urgencyWeight[b.urgency] * b.estimatedImpact;
                return bScore - aScore;
            });
        } catch (error) {
            console.error('Error fetching proactive opportunities:', error);
            return [];
        }
    }

    /**
     * Seasonal opportunities based on calendar events, disease awareness months, etc.
     * @private
     * @param {string} brandId
     * @returns {Promise<ProactiveOpportunity[]>}
     */
    static async getSeasonalOpportunities(brandId) {
        const now = new Date();
        const currentMonth = now.getMonth();
        const opportunities = [];

        // Example: Winter Immunity campaign (Nov-Feb) - Months 10, 11, 0, 1
        if (currentMonth >= 10 || currentMonth <= 1) {
            opportunities.push({
                id: 'seasonal-winter-immunity',
                title: 'Winter Immunity & HIV Awareness',
                category: 'seasonal',
                urgency: 'high',
                description: 'Winter season + flu awareness provides natural entry point for immune health messaging tied to HIV treatment adherence.',
                dataSource: 'Calendar timing + historical campaign performance',
                recommendedChannels: ['email', 'social', 'website'],
                estimatedImpact: 0.78,
                deadline: 'End of February'
            });
        }

        // Example: World AIDS Day (December 1) - Month 11
        if (currentMonth === 11) {
            opportunities.push({
                id: 'seasonal-world-aids-day',
                title: 'World AIDS Day Campaign',
                category: 'seasonal',
                urgency: 'high',
                description: 'December 1 World AIDS Day offers high-visibility opportunity for awareness and education campaigns.',
                dataSource: 'Global awareness calendar',
                recommendedChannels: ['social', 'email', 'rep-enabled'],
                estimatedImpact: 0.85,
                deadline: 'December 1'
            });
        }

        return opportunities;
    }

    /**
     * Performance gap opportunities from analytics
     * @private
     * @param {string} brandId
     * @returns {Promise<ProactiveOpportunity[]>}
     */
    static async getPerformanceGapOpportunities(brandId) {
        const opportunities = [];

        // Query underperforming audience segments
        const { data: audienceData } = await supabase
            .from('audience_segments')
            .select('segment_name, segment_type')
            .eq('brand_id', brandId);

        // Query campaign performance to identify gaps
        const { data: campaignData } = await supabase
            .from('campaign_performance_analytics')
            .select('campaign_type, engagement_score, open_rate')
            .eq('brand_id', brandId)
            .order('calculated_at', { ascending: false })
            .limit(10);

        // Identify underperforming segments/channels
        if (campaignData && campaignData.length > 0) {
            const avgEngagement = campaignData.reduce((sum, c) => sum + (c.engagement_score || 0), 0) / campaignData.length;

            const underperforming = campaignData.filter(c => (c.engagement_score || 0) < avgEngagement * 0.7);

            if (underperforming.length > 0) {
                opportunities.push({
                    id: 'gap-underperforming-campaigns',
                    title: 'Re-engage Underperforming Audience Segments',
                    category: 'performance-gap',
                    urgency: 'medium',
                    description: `${underperforming.length} recent campaigns showed 30%+ below-average engagement. Opportunity to test new messaging approaches.`,
                    dataSource: 'Campaign performance analytics',
                    recommendedChannels: ['email', 'website', 'rep-enabled'],
                    estimatedImpact: 0.65
                });
            }
        }

        return opportunities;
    }

    /**
     * Competitive opportunities from intelligence monitoring
     * @private
     * @param {string} brandId
     * @returns {Promise<ProactiveOpportunity[]>}
     */
    static async getCompetitiveOpportunities(brandId) {
        const opportunities = [];

        const { data: competitiveData } = await supabase
            .from('competitive_intelligence_enriched')
            .select('*')
            .eq('brand_id', brandId)
            .eq('status', 'active')
            .gte('discovered_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()) // Last 30 days
            .order('discovered_at', { ascending: false })
            .limit(5);

        if (competitiveData && competitiveData.length > 0) {
            const highThreat = competitiveData.filter(c => c.threat_level === 'high');

            if (highThreat.length > 0) {
                const latestThreat = highThreat[0];
                opportunities.push({
                    id: `competitive-${latestThreat.id}`,
                    title: `Counter ${latestThreat.competitor_name} ${latestThreat.intelligence_type}`,
                    category: 'competitive',
                    urgency: 'high',
                    description: latestThreat.content,
                    dataSource: 'Competitive intelligence monitoring',
                    recommendedChannels: ['email', 'rep-enabled', 'social'],
                    estimatedImpact: 0.72
                });
            }
        }

        return opportunities;
    }

    /**
     * Audience need opportunities from decision factors and barriers
     * @private
     * @param {string} brandId
     * @returns {Promise<ProactiveOpportunity[]>}
     */
    static async getAudienceNeedOpportunities(brandId) {
        const opportunities = [];

        const { data: audienceData } = await supabase
            .from('audience_segments')
            .select('segment_name, segment_type, barriers_to_engagement, decision_factors')
            .eq('brand_id', brandId);

        if (audienceData && audienceData.length > 0) {
            // Identify segments with high barriers that can be addressed
            const highBarrierSegments = audienceData.filter(a =>
                a.barriers_to_engagement && (a.barriers_to_engagement || []).length > 2
            );

            if (highBarrierSegments.length > 0) {
                const segment = highBarrierSegments[0];
                opportunities.push({
                    id: `audience-need-${segment.segment_name}`,
                    title: `Address ${segment.segment_name} Barriers`,
                    category: 'audience-need',
                    urgency: 'medium',
                    description: `${segment.segment_name} faces ${((segment.barriers_to_engagement) || []).length} key barriers. Targeted education campaign could improve engagement.`,
                    dataSource: 'Audience segment analysis',
                    recommendedChannels: ['email', 'website', 'rep-enabled'],
                    estimatedImpact: 0.68
                });
            }
        }

        return opportunities;
    }
}