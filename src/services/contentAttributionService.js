// Note: The original TypeScript file imported the 'supabase' client.
// In a standalone JS environment, you must ensure the 'supabase' client
// is accessible if you uncomment the database interaction logic.
// import { supabase } from '@/integrations/supabase/client';

/**
 * @typedef {object} AttributionResult
 * @property {string} contentRegistryId
 * @property {object} performanceMetrics
 * @property {number} performanceMetrics.impressions
 * @property {number} performanceMetrics.engagements
 * @property {number} performanceMetrics.conversions
 * @property {number} performanceMetrics.engagementRate
 * @property {number} performanceMetrics.conversionRate
 * @property {object} context
 * @property {string} context.sourceSystem
 * @property {string} [context.audienceSegment]
 * @property {string} [context.channel]
 * @property {string} [context.deviceType]
 * @property {string} [context.geography]
 */

export class ContentAttributionService {
    /**
     * Link SFMC campaign performance data to a content registry ID.
     * It updates the campaign record, calculates performance metrics, inserts an
     * attribution record, and updates element performance.
     * @param {string} campaignRawId - The raw ID of the SFMC campaign record.
     * @param {string} contentRegistryId - The ID of the content in the registry.
     * @returns {Promise<void>}
     */
    static async attributeSFMCPerformance(
        campaignRawId,
        contentRegistryId
    ) {
        try {
            // Update campaign with content link
            await supabase
                .from('sfmc_campaign_raw')
                .update({ content_registry_id: contentRegistryId })
                .eq('id', campaignRawId);

            // Get campaign data
            const { data: campaign } = await supabase
                .from('sfmc_campaign_raw')
                .select('*')
                .eq('id', campaignRawId)
                .single();

            if (!campaign) return;

            // Calculate performance metrics
            const engagements = campaign.unique_opens + campaign.unique_clicks;
            const engagementRate = campaign.total_delivered > 0
                ? ((engagements / campaign.total_delivered) * 100)
                : 0;
            const conversionRate = campaign.total_delivered > 0
                ? ((campaign.unique_clicks / campaign.total_delivered) * 100)
                : 0;

            // Insert performance attribution
            await supabase
                .from('content_performance_attribution')
                .insert({
                    content_registry_id: contentRegistryId,
                    brand_id: campaign.brand_id,
                    measurement_date: new Date(campaign.send_date).toISOString().split('T')[0],
                    measurement_period: 'daily',
                    impressions: campaign.total_delivered,
                    engagements: engagements,
                    conversions: campaign.unique_clicks,
                    engagement_rate: engagementRate,
                    conversion_rate: conversionRate,
                    performance_score: Math.round((engagementRate + conversionRate) / 2),
                    source_system: 'sfmc',
                    audience_segment: campaign.audience_segment,
                    channel: 'email',
                    device_type: campaign.device_category,
                    geography: campaign.geography,
                });

            // Update element performance
            await this.updateElementPerformance(contentRegistryId, campaign.brand_id);

        } catch (error) {
            console.error('Error attributing SFMC performance:', error);
            throw error;
        }
    }

    /**
     * Link Veeva content performance data to a content registry ID.
     * @param {string} vaultRawId - The raw ID of the Veeva Vault content record.
     * @param {string} contentRegistryId - The ID of the content in the registry.
     * @returns {Promise<void>}
     */
    static async attributeVeevaPerformance(
        vaultRawId,
        contentRegistryId
    ) {
        try {
            await supabase
                .from('veeva_vault_content_raw')
                .update({ content_registry_id: contentRegistryId })
                .eq('id', vaultRawId);

            const { data: vault } = await supabase
                .from('veeva_vault_content_raw')
                .select('*')
                .eq('id', vaultRawId)
                .single();

            if (!vault) return;

            const engagementRate = vault.view_count > 0 ?
                ((vault.share_count / vault.view_count) * 100) : 0;

            await supabase
                .from('content_performance_attribution')
                .insert({
                    content_registry_id: contentRegistryId,
                    brand_id: vault.brand_id,
                    measurement_date: new Date(vault.measurement_week).toISOString().split('T')[0],
                    measurement_period: 'weekly',
                    impressions: vault.view_count,
                    engagements: vault.share_count,
                    conversions: vault.share_count,
                    engagement_rate: engagementRate,
                    conversion_rate: engagementRate,
                    performance_score: Math.round(engagementRate * 10),
                    source_system: 'veeva_vault',
                    channel: 'rep_presentation',
                });

            await this.updateElementPerformance(contentRegistryId, vault.brand_id);
        } catch (error) {
            console.error('Error attributing Veeva performance:', error);
            throw error;
        }
    }

    /**
     * Link web analytics session data to a content registry ID.
     * @param {string} webSessionId - The raw ID of the web analytics session record.
     * @param {string} contentRegistryId - The ID of the content in the registry.
     * @returns {Promise<void>}
     */
    static async attributeWebPerformance(
        webSessionId,
        contentRegistryId
    ) {
        try {
            await supabase
                .from('web_analytics_raw')
                .update({ content_registry_id: contentRegistryId })
                .eq('id', webSessionId);

            const { data: session } = await supabase
                .from('web_analytics_raw')
                .select('*')
                .eq('id', webSessionId)
                .single();

            if (!session) return;

            // Simplified hypothetical engagement logic for demonstration
            const engagementRate = session.bounce ? 0 :
                (session.page_views > 1 ? 70 : 30);

            await supabase
                .from('content_performance_attribution')
                .insert({
                    content_registry_id: contentRegistryId,
                    brand_id: session.brand_id,
                    measurement_date: new Date(session.visit_date).toISOString().split('T')[0],
                    measurement_period: 'daily',
                    impressions: 1,
                    engagements: session.bounce ? 0 : session.page_views,
                    conversions: session.page_views > 2 ? 1 : 0,
                    engagement_rate: engagementRate,
                    conversion_rate: session.page_views > 2 ? 100 : 0,
                    performance_score: Math.round(engagementRate),
                    source_system: 'web_analytics',
                    channel: 'website',
                    device_type: session.device_type,
                    geography: session.geography,
                });

            await this.updateElementPerformance(contentRegistryId, session.brand_id);
        } catch (error) {
            console.error('Error attributing web performance:', error);
            throw error;
        }
    }

    /**
     * Update element-level performance based on content fingerprint and calculated performance.
     * This private helper method aggregates metrics for individual content elements (tone, CTA, etc.)
     * @private
     * @param {string} contentRegistryId
     * @param {string} brandId
     * @returns {Promise<void>}
     */
    static async updateElementPerformance(
        contentRegistryId,
        brandId
    ) {
        try {
            // Get content fingerprint
            const { data: content } = await supabase
                .from('content_registry')
                .select('content_fingerprint')
                .eq('id', contentRegistryId)
                .single();

            if (!content?.content_fingerprint) return;

            // Get performance metrics associated with this content
            const { data: performance } = await supabase
                .from('content_performance_attribution')
                .select('*')
                .eq('content_registry_id', contentRegistryId);

            if (!performance || performance.length === 0) return;

            // Assuming content_fingerprint is an object with element properties
            const fingerprint = content.content_fingerprint;

            // Define the elements to track
            const elements = [
                { type: 'tone', value: fingerprint.tone },
                { type: 'complexity', value: fingerprint.complexity_level },
                { type: 'cta_type', value: fingerprint.cta_type },
                { type: 'subject_line', value: fingerprint.subject_line },
                { type: 'headline', value: fingerprint.headline },
            ];

            // Calculate aggregated metrics across all attribution records
            const avgEngagement = performance.reduce((sum, p) => sum + (p.engagement_rate || 0), 0) / performance.length;
            const avgConversion = performance.reduce((sum, p) => sum + (p.conversion_rate || 0), 0) / performance.length;
            const totalImpressions = performance.reduce((sum, p) => sum + (p.impressions || 0), 0);
            const totalEngagements = performance.reduce((sum, p) => sum + (p.engagements || 0), 0);
            const avgPerformanceScore = Math.round((avgEngagement + avgConversion) / 2);


            for (const element of elements) {
                if (!element.value) continue;

                await supabase
                    .from('content_element_performance')
                    .upsert({
                        brand_id: brandId,
                        element_type: element.type,
                        element_value: element.value,
                        usage_count: 1, // This is an insert, logic needs to be enhanced for true usage count update
                        total_impressions: totalImpressions,
                        total_engagements: totalEngagements,
                        avg_engagement_rate: avgEngagement,
                        avg_conversion_rate: avgConversion,
                        avg_performance_score: avgPerformanceScore,
                        last_seen: new Date().toISOString(),
                    }, {
                        onConflict: 'brand_id,element_type,element_value',
                        ignoreDuplicates: false,
                    });
            }
        } catch (error) {
            console.error('Error updating element performance:', error);
        }
    }

    /**
     * Get aggregated performance data for a specific content registry ID.
     * @param {string} contentRegistryId
     * @returns {Promise<any[]>}
     */
    static async getContentPerformance(contentRegistryId) {
        try {
            const { data, error } = await supabase
                .from('content_performance_attribution')
                .select('*')
                .eq('content_registry_id', contentRegistryId)
                .order('measurement_date', { ascending: false });

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error getting content performance:', error);
            return [];
        }
    }

    /**
     * Get top performing content elements for a brand, optionally filtered by element type.
     * @param {string} brandId
     * @param {string} [elementType]
     * @returns {Promise<any[]>}
     */
    static async getTopElements(brandId, elementType) {
        try {
            let query = supabase
                .from('content_element_performance')
                .select('*')
                .eq('brand_id', brandId)
                .order('avg_performance_score', { ascending: false });

            if (elementType) {
                query = query.eq('element_type', elementType);
            }

            const { data, error } = await query.limit(20);
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error getting top elements:', error);
            return [];
        }
    }

    /**
     * Create comprehensive attribution records from existing campaign analytics (e.g., as part of a batch process).
     * @param {string} brandId
     * @returns {Promise<void>}
     */
    static async createAttributionRecords(brandId) {
        console.log('🔗 Creating content attribution records...');

        const { data: campaigns } = await supabase
            .from('campaign_performance_analytics')
            .select('*')
            .eq('brand_id', brandId);

        if (!campaigns || campaigns.length === 0) return;

        for (const campaign of campaigns) {
            if (!campaign.content_registry_id) continue;

            await supabase
                .from('content_performance_attribution')
                .insert({
                    content_registry_id: campaign.content_registry_id,
                    brand_id: campaign.brand_id,
                    measurement_date: campaign.reporting_period,
                    measurement_period: 'daily',
                    impressions: campaign.total_audience_size || 0,
                    engagements: campaign.total_engaged || 0,
                    conversions: campaign.total_converted || 0,
                    engagement_rate: campaign.open_rate || 0,
                    conversion_rate: campaign.conversion_rate || 0,
                    performance_score: campaign.engagement_score || 0,
                    source_system: 'sfmc',
                    audience_segment: campaign.top_performing_segment,
                    channel: 'email',
                    device_type: campaign.top_performing_device,
                    geography: campaign.top_performing_geography,
                });
        }

        console.log(`✅ Created attribution for ${campaigns.length} campaigns`);
    }

    /**
     * Get top performing content elements for a brand, optionally filtered by element type.
     * @param {string} brandId
     * @param {string} elementType
     * @param {number} [limit=10]
     * @returns {Promise<any[]>}
     */
    static async getTopPerformingElements(
        brandId,
        elementType,
        limit = 10
    ) {
        try {
            const { data, error } = await supabase
                .from('content_element_performance')
                .select('*')
                .eq('brand_id', brandId)
                .eq('element_type', elementType)
                .order('avg_performance_score', { ascending: false })
                .limit(limit);

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error getting top performing elements:', error);
            return [];
        }
    }

    /**
     * Generate campaign performance analytics (e.g., from raw SFMC data) and store them.
     * @param {string} brandId
     * @param {string} startDate
     * @param {string} endDate
     * @returns {Promise<void>}
     */
    static async generateCampaignAnalytics(
        brandId,
        startDate,
        endDate
    ) {
        try {
            // Get SFMC campaigns
            const { data: campaigns } = await supabase
                .from('sfmc_campaign_raw')
                .select('*')
                .eq('brand_id', brandId)
                .gte('send_date', startDate)
                .lte('send_date', endDate);

            if (!campaigns) return;

            for (const campaign of campaigns) {
                const engagements = campaign.unique_opens + campaign.unique_clicks;
                const deliveryRate = campaign.total_sent > 0 ?
                    ((campaign.total_delivered / campaign.total_sent) * 100) : 0;
                const openRate = campaign.total_delivered > 0 ?
                    ((campaign.unique_opens / campaign.total_delivered) * 100) : 0;
                const clickRate = campaign.total_delivered > 0 ?
                    ((campaign.unique_clicks / campaign.total_delivered) * 100) : 0;
                const conversionRate = campaign.unique_clicks > 0 ?
                    ((campaign.unique_clicks / campaign.total_sent) * 100) : 0;

                await supabase
                    .from('campaign_performance_analytics')
                    .upsert({
                        brand_id: brandId,
                        campaign_id: campaign.external_campaign_id,
                        campaign_name: campaign.campaign_name,
                        campaign_type: 'email',
                        source_system: 'sfmc',
                        reporting_period: new Date(campaign.send_date).toISOString().split('T')[0],
                        period_type: 'daily',
                        total_audience_size: campaign.total_sent,
                        total_delivered: campaign.total_delivered,
                        total_engaged: engagements,
                        total_converted: campaign.unique_clicks,
                        delivery_rate: deliveryRate,
                        open_rate: openRate,
                        click_rate: clickRate,
                        conversion_rate: conversionRate,
                        engagement_score: Math.round((openRate + clickRate) / 2),
                        industry_benchmark_open_rate: 18.5,
                        industry_benchmark_click_rate: 7.2,
                        performance_vs_benchmark: openRate - 18.5,
                        top_performing_segment: campaign.audience_segment,
                        top_performing_device: campaign.device_category,
                        top_performing_geography: campaign.geography,
                        content_registry_id: campaign.content_registry_id,
                    }, {
                        onConflict: 'campaign_id,reporting_period',
                    });
            }
        } catch (error) {
            console.error('Error generating campaign analytics:', error);
        }
    }
}