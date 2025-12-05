// Note: The 'supabase' client must be globally available
// or imported in the consuming environment for the database operations to work.
// import { supabase } from '@/integrations/supabase/client';

/**
 * @typedef {object} AttributionData
 * @property {number} impressions
 * @property {number} engagements
 * @property {number} conversions
 * @property {number} engagement_rate
 * @property {number} conversion_rate
 * @property {number} performance_score
 * @property {string} measurement_date
 * @property {string} audience_segment
 * @property {string} channel
 */

/**
 * @typedef {object} ContentRegistryData
 * @property {string} id
 * @property {string} content_name
 * @property {string} content_type
 * @property {string} content_fingerprint
 * @property {AttributionData[]} content_performance_attribution
 */

/**
 * Service for aggregating detailed content performance metrics and writing
 * the summary metrics back to the 'content_performance_metrics' table.
 */
export class ContentPerformanceMetricsService {

    /**
     * Generate comprehensive performance metrics for all content belonging to a brand.
     * It aggregates data from the detailed attribution table and saves a summary
     * record for each content piece.
     *
     * @param {string} brandId - The ID of the brand.
     * @returns {Promise<void>}
     */
    static async generateMetrics(brandId) {
        console.log('📈 Generating content performance metrics...');

        // 1. Fetch all content with nested attribution data
        const { data: contentData, error: fetchError } = await supabase
            .from('content_registry')
            .select(`
                id,
                content_name,
                content_type,
                content_fingerprint,
                content_performance_attribution (
                    impressions,
                    engagements,
                    conversions,
                    engagement_rate,
                    conversion_rate,
                    performance_score,
                    measurement_date,
                    audience_segment,
                    channel
                )
            `)
            .eq('brand_id', brandId);

        if (fetchError) {
            console.error('Error fetching content data:', fetchError);
            return;
        }

        if (!contentData || contentData.length === 0) {
            console.log('No content data found for metrics');
            return;
        }

        // 2. Aggregate metrics for each content piece
        /** @type {any[]} */
        const metricsRecords = [];

        contentData.forEach(content => {
            // Cast the content object to the expected structure for access
            /** @type {ContentRegistryData} */
            const contentEntry = content;
            const attributions = contentEntry.content_performance_attribution || [];

            if (attributions.length === 0) return;

            // Calculate aggregates
            const totalImpressions = attributions.reduce((sum, a) => sum + (a.impressions || 0), 0);
            const totalEngagements = attributions.reduce((sum, a) => sum + (a.engagements || 0), 0);
            const totalConversions = attributions.reduce((sum, a) => sum + (a.conversions || 0), 0);
            const avgEngagementRate = attributions.reduce((sum, a) => sum + (a.engagement_rate || 0), 0) / attributions.length;
            const avgConversionRate = attributions.reduce((sum, a) => sum + (a.conversion_rate || 0), 0) / attributions.length;
            const avgPerformanceScore = attributions.reduce((sum, a) => sum + (a.performance_score || 0), 0) / attributions.length;

            // Sort attributions by date to correctly find start/end period
            attributions.sort((a, b) => new Date(b.measurement_date).getTime() - new Date(a.measurement_date).getTime());

            // Get audience breakdown (engagement based)
            /** @type {Record<string, number>} */
            const audienceBreakdown = {};
            attributions.forEach(a => {
                if (a.audience_segment) {
                    audienceBreakdown[a.audience_segment] = (audienceBreakdown[a.audience_segment] || 0) + (a.engagements || 0);
                }
            });

            // Get channel breakdown (engagement based)
            /** @type {Record<string, number>} */
            const channelBreakdown = {};
            attributions.forEach(a => {
                if (a.channel) {
                    channelBreakdown[a.channel] = (channelBreakdown[a.channel] || 0) + (a.engagements || 0);
                }
            });

            // The record is pushed with the latest date as the end date (index 0 after sort)
            // and the earliest date as the start date (index length-1 after sort).
            metricsRecords.push({
                brand_id: brandId,
                content_registry_id: contentEntry.id,
                content_type: contentEntry.content_type,
                measurement_period_start: attributions[attributions.length - 1]?.measurement_date,
                measurement_period_end: attributions[0]?.measurement_date,
                total_impressions: totalImpressions,
                total_engagements: totalEngagements,
                total_conversions: totalConversions,
                avg_engagement_rate: avgEngagementRate,
                avg_conversion_rate: avgConversionRate,
                performance_score: avgPerformanceScore,
                audience_breakdown: audienceBreakdown,
                channel_breakdown: channelBreakdown,
                trend_direction: avgPerformanceScore > 50 ? 'improving' : 'stable', // Simple logic for trend
                calculated_at: new Date().toISOString(),
            });
        });

        // 3. Batch insert the aggregated metrics records
        let insertedCount = 0;
        const BATCH_SIZE = 100;

        for (let i = 0; i < metricsRecords.length; i += BATCH_SIZE) {
            const batch = metricsRecords.slice(i, i + BATCH_SIZE);
            const { error: insertError } = await supabase.from('content_performance_metrics').insert(batch);

            if (insertError) {
                console.error(`Error inserting batch ${i / BATCH_SIZE + 1}:`, insertError);
            } else {
                insertedCount += batch.length;
            }
        }

        console.log(`✅ Generated and inserted ${insertedCount} content performance metric records`);
    }
}