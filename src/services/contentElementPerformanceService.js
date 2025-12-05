// Note: The original TypeScript file imported the 'supabase' client.
// In a standalone JS environment, you must ensure the 'supabase' client
// is accessible if you uncomment the database interaction logic.
// import { supabase } from '@/integrations/supabase/client';

/**
 * Service for tracking and analyzing performance of individual content elements
 * (subject lines, CTAs, tones, message themes, etc.) by aggregating data
 * from multiple campaigns associated with a content registry entry.
 */
export class ContentElementPerformanceService {

    /**
     * Extracts and aggregates performance of content elements from all relevant campaigns
     * for a given brand, and updates the 'content_element_performance' table.
     *
     * @param {string} brandId - The ID of the brand whose content elements are being tracked.
     * @returns {Promise<void>}
     */
    static async trackContentElements(brandId) {
        console.log('📊 Tracking content element performance...');

        try {
            // Get all campaigns with content fingerprints (only fetching email content for this logic)
            const { data: campaigns } = await supabase
                .from('content_registry')
                .select(`
                    id,
                    content_name,
                    content_fingerprint,
                    campaign_performance_analytics (
                        open_rate,
                        click_rate,
                        conversion_rate,
                        engagement_score,
                        total_audience_size,
                        total_engaged,
                        total_converted
                    )
                `)
                .eq('brand_id', brandId)
                .eq('content_type', 'email');

            if (!campaigns || campaigns.length === 0) {
                console.log('No email content found with associated campaign analytics.');
                return;
            }

            // Maps to store aggregated performance metrics for each unique element value
            const subjectLinePerf = new Map();
            const ctaPerf = new Map();
            const tonePerf = new Map();
            const themePerf = new Map();

            for (const campaign of campaigns) {
                const fp = campaign.content_fingerprint;
                // Safely access the first (or only) performance analytics record
                const perf = campaign.campaign_performance_analytics?.[0];

                if (!fp || !perf) continue;

                /**
                 * Helper function to update the performance map
                 * @param {Map<string, any>} perfMap
                 * @param {string} elementType
                 * @param {string} elementValue
                 * @param {object} [context]
                 */
                const updatePerfMap = (perfMap, elementType, elementValue, context = {}) => {
                    if (!perfMap.has(elementValue)) {
                        perfMap.set(elementValue, {
                            element_type: elementType,
                            element_value: elementValue,
                            element_context: context,
                            total_impressions: 0,
                            total_engagements: 0,
                            total_conversions: 0,
                            sample_size: 0,
                        });
                    }
                    const elem = perfMap.get(elementValue);
                    elem.total_impressions += perf.total_audience_size || 0;
                    elem.total_engagements += perf.total_engaged || 0;
                    elem.total_conversions += perf.total_converted || 0;
                    elem.sample_size += 1;
                };

                // 1. Track Subject Line
                if (fp.subject_line) {
                    updatePerfMap(subjectLinePerf, 'subject_line', fp.subject_line);
                }

                // 2. Track CTA performance
                if (fp.primary_cta) {
                    updatePerfMap(ctaPerf, 'cta', fp.primary_cta, { position: fp.cta_position });
                }

                // 3. Track tone performance
                if (fp.tone) {
                    updatePerfMap(tonePerf, 'tone', fp.tone, { sophistication: fp.sophistication_level });
                }

                // 4. Track message theme performance
                if (fp.message_theme) {
                    // Assuming clinical_focus might be an object or value stored in element_context
                    updatePerfMap(themePerf, 'message_theme', fp.message_theme, fp.clinical_focus);
                }
            }

            // Combine all tracked elements
            const allElements = [
                ...Array.from(subjectLinePerf.values()),
                ...Array.from(ctaPerf.values()),
                ...Array.from(tonePerf.values()),
                ...Array.from(themePerf.values()),
            ];

            // Calculate final rates and perform the database insertion/update
            for (const elem of allElements) {
                // Engagement Rate: Engagements / Impressions
                const avgEngagementRate = elem.total_impressions > 0
                    ? (elem.total_engagements / elem.total_impressions) * 100
                    : 0;

                // Conversion Rate: Conversions / Engagements (Click-Through Conversion)
                // NOTE: The original logic used total_engagements as the denominator for conversion rate.
                // Depending on the business rule, this might also be total_impressions or total_delivered.
                const avgConversionRate = elem.total_engagements > 0
                    ? (elem.total_conversions / elem.total_engagements) * 100
                    : 0;

                const avgPerformanceScore = (avgEngagementRate + avgConversionRate) / 2;

                // Determine confidence based on sample size (number of campaigns tracked)
                const confidenceLevel = elem.sample_size >= 10 ? 'high' : elem.sample_size >= 5 ? 'medium' : 'low';

                // Use upsert here to handle existing element performance records (recommended for this type of aggregation)
                await supabase.from('content_element_performance').upsert({
                    brand_id: brandId,
                    element_type: elem.element_type,
                    element_value: elem.element_value,
                    element_context: elem.element_context,
                    total_impressions: elem.total_impressions,
                    total_engagements: elem.total_engagements,
                    total_conversions: elem.total_conversions,
                    usage_count: elem.sample_size, // usage_count is effectively the sample_size here
                    sample_size: elem.sample_size,
                    avg_engagement_rate: avgEngagementRate,
                    avg_conversion_rate: avgConversionRate,
                    avg_performance_score: avgPerformanceScore,
                    confidence_level: confidenceLevel,
                    // Assuming first_seen is only set on initial insert, but upsert handles this complexly.
                    // For simplicity, we update last_seen/calculated always.
                    // If upsert logic is 'onConflict: brand_id, element_type, element_value' then the existing
                    // first_seen value would be preserved.
                    last_seen: new Date().toISOString(),
                    last_calculated: new Date().toISOString(),
                }, {
                    // NOTE: It is critical to define the conflict columns if this is intended as a true upsert
                    // to accumulate data, but the original TS code used .insert() which suggests repeated inserts.
                    // Since this is aggregation, upsert is usually better for production:
                    onConflict: 'brand_id,element_type,element_value',
                    ignoreDuplicates: false,
                });
            }

            console.log(`✅ Tracked ${allElements.length} unique content elements for brand ${brandId}`);
        } catch (error) {
            console.error('Error tracking content elements:', error);
            // Optionally rethrow the error for upstream handling
            // throw error;
        }
    }
}