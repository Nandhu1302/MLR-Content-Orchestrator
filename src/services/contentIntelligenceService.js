// Note: The 'supabase' client must be globally available or imported in the
// consuming environment for the database operations to work.
// import { supabase } from '@/integrations/supabase/client';

/**
 * Service for building content intelligence patterns and relationships by analyzing
 * historical performance and content attributes.
 */
export class ContentIntelligenceService {

    /**
     * Analyze content performance and create success patterns based on high-performing content.
     * Patterns are created by aggregating performance data across audience segments and channels.
     *
     * @param {string} brandId - The ID of the brand.
     * @returns {Promise<void>}
     */
    static async buildSuccessPatterns(brandId) {
        console.log('🧠 Building success patterns for brand:', brandId);

        try {
            // Get content performance data to identify patterns (performance score >= 70)
            const { data: performanceData, error: perfError } = await supabase
                .from('content_performance_attribution')
                .select('*')
                .eq('brand_id', brandId)
                .gte('performance_score', 70)
                .order('performance_score', { ascending: false })
                .limit(100);

            if (perfError) {
                console.error('Error fetching performance data:', perfError);
                return;
            }

            if (!performanceData || performanceData.length === 0) {
                console.log('No high-performing content found for pattern detection');
                return;
            }

            // Analyze patterns by audience segment
            /** @type {Record<string, { count: number, totalScore: number, channels: Set<string>, conversions: number, engagementSum: number }>} */
            const audiencePatterns = performanceData.reduce((acc, content) => {
                const segment = content.audience_segment || 'General';
                if (!acc[segment]) {
                    acc[segment] = { count: 0, totalScore: 0, channels: new Set(), conversions: 0, engagementSum: 0 };
                }
                acc[segment].count++;
                acc[segment].totalScore += content.performance_score || 0;
                acc[segment].engagementSum += content.engagement_rate || 0;
                if (content.channel) acc[segment].channels.add(content.channel);
                acc[segment].conversions += content.conversions || 0;
                return acc;
            }, {});

            // Analyze patterns by channel
            /** @type {Record<string, { count: number, totalScore: number, audiences: Set<string>, engagementRate: number }>} */
            const channelPatterns = performanceData.reduce((acc, content) => {
                const channel = content.channel || 'Unknown';
                if (!acc[channel]) {
                    acc[channel] = { count: 0, totalScore: 0, audiences: new Set(), engagementRate: 0 };
                }
                acc[channel].count++;
                acc[channel].totalScore += content.performance_score || 0;
                if (content.audience_segment) acc[channel].audiences.add(content.audience_segment);
                acc[channel].engagementRate += content.engagement_rate || 0;
                return acc;
            }, {});

            const patterns = [];

            // Create audience-based success patterns
            Object.entries(audiencePatterns).forEach(([segment, data]) => {
                if (data.count >= 3) {
                    const avgScore = data.totalScore / data.count;
                    const avgEngagement = data.engagementSum / data.count;
                    patterns.push({
                        brand_id: brandId,
                        pattern_name: `${segment} High Engagement Pattern`,
                        pattern_type: 'audience_match',
                        pattern_description: `Content targeting ${segment} shows ${avgScore.toFixed(1)}% average performance with ${data.conversions} total conversions and ${avgEngagement.toFixed(2)}% engagement rate`,
                        pattern_rules: {
                            target_audience: segment,
                            recommended_channels: Array.from(data.channels),
                            min_performance_threshold: 70
                        },
                        sample_size: data.count,
                        // Lift vs baseline of 50%
                        avg_performance_lift: avgScore - 50,
                        // Confidence score capping at 100
                        confidence_score: Math.min(data.count * 15, 100),
                        applicable_audiences: [segment],
                        applicable_channels: Array.from(data.channels),
                        validation_status: data.count >= 5 ? 'validated' : 'discovered'
                    });
                }
            });

            // Create channel-based success patterns
            Object.entries(channelPatterns).forEach(([channel, data]) => {
                if (data.count >= 3) {
                    const avgScore = data.totalScore / data.count;
                    const avgEngagement = data.engagementRate / data.count;
                    patterns.push({
                        brand_id: brandId,
                        pattern_name: `${channel} Channel Success Pattern`,
                        pattern_type: 'channel_performance',
                        pattern_description: `${channel} channel achieves ${avgScore.toFixed(1)}% performance with ${avgEngagement.toFixed(2)}% engagement rate`,
                        pattern_rules: {
                            channel: channel,
                            target_audiences: Array.from(data.audiences),
                            avg_engagement_rate: avgEngagement
                        },
                        sample_size: data.count,
                        avg_performance_lift: avgScore - 50,
                        confidence_score: Math.min(data.count * 15, 100),
                        applicable_audiences: Array.from(data.audiences),
                        applicable_channels: [channel],
                        validation_status: data.count >= 5 ? 'validated' : 'discovered'
                    });
                }
            });

            if (patterns.length > 0) {
                const { error: insertError } = await supabase
                    .from('content_success_patterns')
                    .upsert(patterns, {
                        onConflict: 'brand_id,pattern_name'
                    });

                if (insertError) {
                    console.error('Error inserting patterns:', insertError);
                } else {
                    console.log(`✅ Successfully created ${patterns.length} success patterns`);
                }
            } else {
                console.log('No significant success patterns created.');
            }
        } catch (error) {
            console.error('Failed during buildSuccessPatterns:', error);
        }
    }

    /**
     * Build content relationships based on similarity of content attributes
     * stored in the content_fingerprint column.
     *
     * @param {string} brandId - The ID of the brand.
     * @returns {Promise<void>}
     */
    static async buildContentRelationships(brandId) {
        console.log('🔗 Building content relationships for brand:', brandId);

        try {
            // Get content with performance data
            const { data: content, error } = await supabase
                .from('content_registry')
                .select(`
                    id,
                    content_type,
                    theme_id,
                    content_fingerprint,
                    content_performance_attribution(
                        performance_score,
                        engagement_rate,
                        conversion_rate
                    )
                `)
                .eq('brand_id', brandId)
                .limit(100);

            if (error) {
                console.error('Error fetching content:', error);
                return;
            }

            if (!content || content.length < 2) {
                console.log('Not enough content to build relationships');
                return;
            }

            const relationships = [];

            // Compare each content pair for similarity
            for (let i = 0; i < content.length; i++) {
                for (let j = i + 1; j < content.length; j++) {
                    const content1 = content[i];
                    const content2 = content[j];

                    let similarityScore = 0;
                    const sharedAttributes = [];

                    // Check content type similarity
                    if (content1.content_type === content2.content_type) {
                        similarityScore += 20;
                        sharedAttributes.push('content_type');
                    }

                    // Check tone similarity (from content_fingerprint)
                    const fp1 = content1.content_fingerprint;
                    const fp2 = content2.content_fingerprint;

                    if (fp1?.tone && fp2?.tone && fp1.tone === fp2.tone) {
                        similarityScore += 25;
                        sharedAttributes.push('tone');
                    }

                    // Check theme similarity
                    if (content1.theme_id && content2.theme_id && content1.theme_id === content2.theme_id) {
                        similarityScore += 35;
                        sharedAttributes.push('theme');
                    }

                    // Check audience similarity (from content_fingerprint)
                    // Note: The original TS used 'target_audiences' which might be an array,
                    // but the previous class used 'target_audience' (singular string).
                    // We assume an array of target audiences for robust matching here.
                    const audiences1 = fp1?.target_audiences || (fp1?.target_audience ? [fp1.target_audience] : []);
                    const audiences2 = fp2?.target_audiences || (fp2?.target_audience ? [fp2.target_audience] : []);

                    if (Array.isArray(audiences1) && Array.isArray(audiences2)) {
                        const sharedAudiences = audiences1.filter(a => audiences2.includes(a));
                        if (sharedAudiences.length > 0) {
                            similarityScore += 20;
                            sharedAttributes.push('audience');
                        }
                    }

                    // Create relationship if similarity threshold met (>= 50% and at least 2 shared attributes)
                    if (similarityScore >= 50 && sharedAttributes.length >= 2) {
                        relationships.push({
                            brand_id: brandId,
                            content_id_1: content1.id,
                            content_id_2: content2.id,
                            relationship_type: 'similar_characteristics',
                            similarity_score: similarityScore,
                            shared_attributes: sharedAttributes,
                            relationship_metadata: {
                                content1_type: content1.content_type,
                                content2_type: content2.content_type,
                                shared_theme: content1.theme_id === content2.theme_id ? content1.theme_id : null
                            }
                        });
                    }
                }
            }

            if (relationships.length > 0) {
                // Bulk insert/update relationships
                const { error: insertError } = await supabase
                    .from('content_relationships')
                    .insert(relationships);

                if (insertError) {
                    console.error('Error inserting relationships:', insertError);
                } else {
                    console.log(`✅ Successfully created ${relationships.length} content relationships`);
                }
            } else {
                console.log('No content relationships created above threshold.');
            }
        } catch (error) {
            console.error('Failed during buildContentRelationships:', error);
        }
    }

    /**
     * Generate performance predictions for content based on validated success patterns
     * and supplemental market/HCP engagement data.
     *
     * @param {string} brandId - The ID of the brand.
     * @returns {Promise<void>}
     */
    static async generatePerformancePredictions(brandId) {
        console.log('🔮 Generating performance predictions for brand:', brandId);

        try {
            // 1. Get validated success patterns (confidence >= 70)
            const { data: patterns, error: patternError } = await supabase
                .from('content_success_patterns')
                .select('*')
                .eq('brand_id', brandId)
                .eq('validation_status', 'validated')
                .gte('confidence_score', 70);

            if (patternError) {
                console.error('Error fetching patterns:', patternError);
                return;
            }

            if (!patterns || patterns.length === 0) {
                console.log('No validated patterns found for predictions');
                return;
            }

            // 2. Get supplemental intelligence data (for context in factors)
            // Latest Market Data
            const { data: marketData } = await supabase
                .from('market_intelligence_analytics')
                .select('market_share_percent')
                .eq('brand_id', brandId)
                .order('reporting_period', { ascending: false })
                .limit(1)
                .maybeSingle();

            // Recent HCP Engagement Data
            const { data: hcpData } = await supabase
                .from('hcp_engagement_analytics')
                .select('id') // just need the count
                .eq('brand_id', brandId)
                .order('calculated_at', { ascending: false })
                .limit(10);

            const predictions = [];
            const hcpEngagementLevel = hcpData?.length || 0;
            const marketShare = marketData?.market_share_percent;

            // 3. Generate predictions for each validated pattern/audience/channel combination
            patterns.forEach(pattern => {
                const audiences = pattern.applicable_audiences || [];
                const channels = pattern.applicable_channels || [];

                audiences.forEach(audience => {
                    channels.forEach(channel => {
                        // Calculate predicted metrics based on pattern performance
                        // Performance is based on the 'lift' over a baseline (e.g., 50)
                        const basePerformance = pattern.avg_performance_lift || 0;
                        const confidenceMultiplier = (pattern.confidence_score || 70) / 100;

                        // Apply the lift and confidence to approximate metrics
                        const performanceScore = basePerformance * confidenceMultiplier;
                        const engagementRate = performanceScore * 0.6; // Heuristic distribution
                        const conversionRate = performanceScore * 0.3; // Heuristic distribution

                        predictions.push({
                            brand_id: brandId,
                            prediction_type: 'content_performance',
                            prediction_name: `${audience} on ${channel} - Pattern-based`,
                            predicted_metrics: {
                                engagement_rate: engagementRate.toFixed(2),
                                conversion_rate: conversionRate.toFixed(2),
                                performance_score: (performanceScore + 50).toFixed(1) // Add back baseline
                            },
                            confidence_score: pattern.confidence_score,
                            prediction_factors: {
                                pattern_id: pattern.id,
                                pattern_name: pattern.pattern_name,
                                sample_size: pattern.sample_size,
                                target_audience: audience,
                                channel: channel,
                                market_share: marketShare,
                                hcp_engagement_level: hcpEngagementLevel
                            },
                            applicable_content_types: [pattern.pattern_type],
                            target_audiences: [audience],
                            recommended_channels: [channel],
                            validation_status: 'predicted'
                        });
                    });
                });
            });

            // 4. Upsert predictions into the database
            if (predictions.length > 0) {
                const { error: insertError } = await supabase
                    .from('performance_predictions')
                    .upsert(predictions, {
                        onConflict: 'brand_id,prediction_name'
                    });

                if (insertError) {
                    console.error('Error inserting predictions:', insertError);
                } else {
                    console.log(`✅ Successfully generated ${predictions.length} performance predictions`);
                }
            } else {
                console.log('No predictions generated from validated patterns.');
            }
        } catch (error) {
            console.error('Failed during generatePerformancePredictions:', error);
        }
    }
}