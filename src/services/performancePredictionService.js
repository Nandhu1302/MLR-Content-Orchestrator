import { supabase } from "@/integrations/supabase/client";

/**
 * @typedef {Object} PerformancePrediction
 * @property {'mlr_approval' | 'engagement' | 'risk_score' | 'ab_recommendation'} prediction_type
 * @property {number} predicted_score - 0-100
 * @property {number} confidence_level - 0-100
 * @property {Object} prediction_factors
 * @property {string[]} prediction_factors.key_factors
 * @property {string[]} prediction_factors.positive_indicators
 * @property {string[]} prediction_factors.risk_indicators
 * @property {string[]} prediction_factors.historical_patterns
 * @property {string[]} recommendations
 * @property {Object} [benchmark_comparison]
 * @property {number} benchmark_comparison.vs_brand_average
 * @property {number} benchmark_comparison.vs_market_average
 * @property {number} benchmark_comparison.percentile_rank
 */

/**
 * @typedef {Object} ContentAnalytics
 * @property {string} content_id
 * @property {'campaign' | 'asset'} content_type
 * @property {string} brand_id
 * @property {Object} metrics
 * @property {number} [metrics.engagement_rate]
 * @property {number} [metrics.conversion_rate]
 * @property {number} [metrics.mlr_approval_time] - days
 * @property {number} [metrics.approval_success_rate]
 * @property {number} [metrics.audience_reach]
 * @property {number} [metrics.click_through_rate]
 * @property {number} [metrics.sentiment_score]
 * @property {number} performance_score
 * @property {string} created_at
 */

/**
 * @typedef {Object} PredictionResult
 * @property {PerformancePrediction} mlr_approval
 * @property {PerformancePrediction} engagement_forecast
 * @property {PerformancePrediction} risk_assessment
 * @property {PerformancePrediction} ab_recommendations
 * @property {number} overall_confidence
 * @property {number} processing_time
 */

export class PerformancePredictionService {
    /**
     * @private
     * @readonly
     * @type {RegExp}
     */
    static UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    /**
     * Generate performance predictions for content elements
     * @param {string} brandId
     * @returns {Promise<void>}
     */
    static async generatePredictions(brandId) {
        console.log('🔮 Generating performance predictions...');

        // Get historical element performance
        const { data: elements } = await supabase
            .from('content_element_performance')
            .select('*')
            .eq('brand_id', brandId)
            .gte('sample_size', 3);

        if (!elements || elements.length === 0) {
            console.log('Not enough historical data for predictions');
            return;
        }

        // Generate predictions for each element type
        const predictions = [];

        elements.forEach(element => {
            const avgEngagement = element.avg_engagement_rate || 0;
            const avgConversion = element.avg_conversion_rate || 0;
            const confidence = Math.min(95, 40 + (element.sample_size * 5));

            predictions.push({
                brand_id: brandId,
                prediction_type: 'content_element',
                predicted_metric: 'engagement_rate',
                predicted_value: avgEngagement * (1 + (Math.random() * 0.2 - 0.1)),
                confidence_score: confidence,
                context: {
                    element_type: element.element_type,
                    element_value: element.element_value,
                    historical_avg: avgEngagement,
                    sample_size: element.sample_size,
                },
                factors_considered: {
                    historical_performance: avgEngagement,
                    audience_affinity: element.top_performing_audience,
                    channel_fit: element.top_performing_channel,
                },
                predicted_at: new Date().toISOString(),
                valid_until: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
            });

            // Add conversion prediction
            predictions.push({
                brand_id: brandId,
                prediction_type: 'content_element',
                predicted_metric: 'conversion_rate',
                predicted_value: avgConversion * (1 + (Math.random() * 0.2 - 0.1)),
                confidence_score: confidence,
                context: {
                    element_type: element.element_type,
                    element_value: element.element_value,
                    historical_avg: avgConversion,
                    sample_size: element.sample_size,
                },
                factors_considered: {
                    historical_performance: avgConversion,
                    audience_affinity: element.top_performing_audience,
                    channel_fit: element.top_performing_channel,
                },
                predicted_at: new Date().toISOString(),
                valid_until: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
            });
        });

        // Batch insert
        for (let i = 0; i < predictions.length; i += 500) {
            const batch = predictions.slice(i, i + 500);
            await supabase.from('performance_predictions').insert(batch);
        }

        console.log(`✅ Generated ${predictions.length} performance predictions`);
    }

    /**
     * Validate if a string is a valid UUID
     * @private
     * @param {string} value
     * @returns {boolean}
     */
    static isValidUUID(value) {
        return this.UUID_REGEX.test(value);
    }

    /**
     * Generate comprehensive performance predictions
     * @param {string} content
     * @param {string} brandId
     * @param {Object} context
     * @param {'campaign' | 'asset'} context.content_type
     * @param {string} context.content_id
     * @param {string} [context.audience]
     * @param {string} [context.market]
     * @param {string} [context.channel]
     * @param {string} [context.asset_type]
     * @param {boolean} [context.ephemeral] - True = do not persist to database
     * @param {number} [complianceScore]
     * @returns {Promise<PredictionResult>}
     */
    static async predictPerformance(
        content,
        brandId,
        context,
        complianceScore
    ) {
        const startTime = Date.now();

        // STRICT VALIDATION: If NOT ephemeral, content_id MUST be valid UUID
        if (!context.ephemeral) {
            if (!this.isValidUUID(context.content_id)) {
                throw new Error(
                    `Invalid content_id: "${context.content_id}". ` +
                    `When ephemeral=false, content_id must be a valid UUID. ` +
                    `For real-time analysis, set ephemeral=true.`
                );
            }
        }

        try {
            // Get historical data for context
            const historicalData = await this.getHistoricalData(brandId, context);

            // Generate predictions in parallel
            const [
                mlrApproval,
                engagementForecast,
                riskAssessment,
                abRecommendations
            ] = await Promise.all([
                this.predictMLRApproval(content, historicalData, complianceScore),
                this.predictEngagement(content, historicalData, context),
                this.assessRisk(content, historicalData, context),
                this.generateABRecommendations(content, historicalData, context)
            ]);

            // Calculate overall confidence
            const overallConfidence = Math.round([
                mlrApproval.confidence_level,
                engagementForecast.confidence_level,
                riskAssessment.confidence_level,
                abRecommendations.confidence_level
            ].reduce((sum, conf) => sum + conf, 0) / 4);

            const result = {
                mlr_approval: mlrApproval,
                engagement_forecast: engagementForecast,
                risk_assessment: riskAssessment,
                ab_recommendations: abRecommendations,
                overall_confidence: overallConfidence,
                processing_time: Date.now() - startTime
            };

            // Only save predictions to database when NOT ephemeral
            if (!context.ephemeral) {
                await this.savePredictions(context.content_id, context.content_type, result);
            }

            return result;
        } catch (error) {
            console.error('Performance prediction failed:', error);
            throw new Error(`Performance prediction failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /**
     * Predict MLR approval likelihood and timeline
     * @private
     * @param {string} content
     * @param {ContentAnalytics[]} historicalData
     * @param {number} [complianceScore=80]
     * @returns {Promise<PerformancePrediction>}
     */
    static async predictMLRApproval(
        content,
        historicalData,
        complianceScore = 80
    ) {
        // Analyze content characteristics
        const contentFactors = this.analyzeContentFactors(content);

        // Historical MLR approval patterns
        const approvalHistory = historicalData.filter(d => d.metrics.approval_success_rate !== undefined);
        const avgApprovalRate = approvalHistory.length > 0 ?
            approvalHistory.reduce((sum, d) => sum + (d.metrics.approval_success_rate || 0), 0) / approvalHistory.length : 70;

        // Base prediction on compliance score and historical data
        let predictedScore = complianceScore * 0.7 + avgApprovalRate * 0.3;

        // Adjust based on content factors
        if (contentFactors.hasRegulatoryLanguage) predictedScore += 10;
        if (contentFactors.hasClinicalEvidence) predictedScore += 5;
        if (contentFactors.hasMarketingClaims) predictedScore -= 15;
        if (contentFactors.isComplexContent) predictedScore -= 5;

        predictedScore = Math.max(0, Math.min(100, predictedScore));

        const confidence = this.calculateConfidence(approvalHistory.length, complianceScore);

        return {
            prediction_type: 'mlr_approval',
            predicted_score: Math.round(predictedScore),
            confidence_level: confidence,
            prediction_factors: {
                key_factors: [
                    'Compliance score',
                    'Historical approval rate',
                    'Regulatory language presence',
                    'Clinical evidence citation'
                ],
                positive_indicators: [
                    contentFactors.hasRegulatoryLanguage ? 'Contains appropriate regulatory language' : '',
                    contentFactors.hasClinicalEvidence ? 'References clinical evidence' : '',
                    contentFactors.hasApprovedClaims ? 'Uses pre-approved claims' : ''
                ].filter(Boolean),
                risk_indicators: [
                    contentFactors.hasMarketingClaims ? 'Contains potentially problematic marketing claims' : '',
                    contentFactors.hasSuperlatives ? 'Uses superlative language' : '',
                    contentFactors.isComplexContent ? 'Complex content may require additional review' : ''
                ].filter(Boolean),
                historical_patterns: [
                    `Brand average approval rate: ${Math.round(avgApprovalRate)}%`,
                    `Historical approval timeline: ${this.getAvgApprovalTime(approvalHistory)} days`
                ]
            },
            recommendations: this.generateMLRRecommendations(contentFactors, predictedScore)
        };
    }

    /**
     * Predict engagement performance
     * @private
     * @param {string} content
     * @param {ContentAnalytics[]} historicalData
     * @param {any} context
     * @returns {Promise<PerformancePrediction>}
     */
    static async predictEngagement(
        content,
        historicalData,
        context
    ) {
        const contentFactors = this.analyzeContentFactors(content);

        // Historical engagement patterns
        const engagementHistory = historicalData.filter(d => d.metrics.engagement_rate !== undefined);
        const avgEngagement = engagementHistory.length > 0 ?
            engagementHistory.reduce((sum, d) => sum + (d.metrics.engagement_rate || 0), 0) / engagementHistory.length : 50;

        // Base prediction on historical performance
        let predictedScore = avgEngagement;

        // Adjust based on content characteristics
        if (contentFactors.hasCallToAction) predictedScore += 15;
        if (contentFactors.hasEmotionalLanguage) predictedScore += 10;
        if (contentFactors.isPersonalized) predictedScore += 12;
        if (contentFactors.hasVisualElements) predictedScore += 8;
        if (contentFactors.isOptimalLength) predictedScore += 5;
        if (contentFactors.isTooLong) predictedScore -= 10;
        if (contentFactors.isTooShort) predictedScore -= 8;

        // Channel-specific adjustments
        if (context.channel === 'email') predictedScore += 5;
        if (context.channel === 'social') predictedScore += 8;
        if (context.channel === 'print') predictedScore -= 5;

        predictedScore = Math.max(0, Math.min(100, predictedScore));

        const confidence = this.calculateConfidence(engagementHistory.length, avgEngagement);

        return {
            prediction_type: 'engagement',
            predicted_score: Math.round(predictedScore),
            confidence_level: confidence,
            prediction_factors: {
                key_factors: [
                    'Historical engagement rate',
                    'Content structure and format',
                    'Call-to-action presence',
                    'Channel optimization'
                ],
                positive_indicators: [
                    contentFactors.hasCallToAction ? 'Contains clear call-to-action' : '',
                    contentFactors.hasEmotionalLanguage ? 'Uses engaging emotional language' : '',
                    contentFactors.isPersonalized ? 'Personalized content approach' : '',
                    contentFactors.isOptimalLength ? 'Optimal content length' : ''
                ].filter(Boolean),
                risk_indicators: [
                    contentFactors.isTooLong ? 'Content may be too long for audience' : '',
                    contentFactors.isTooShort ? 'Content may lack sufficient detail' : '',
                    !contentFactors.hasCallToAction ? 'Missing clear call-to-action' : ''
                ].filter(Boolean),
                historical_patterns: [
                    `Brand average engagement: ${Math.round(avgEngagement)}%`,
                    `Best performing content type: ${this.getBestPerformingType(engagementHistory)}`
                ]
            },
            recommendations: this.generateEngagementRecommendations(contentFactors, predictedScore)
        };
    }

    /**
     * Assess content risks
     * @private
     * @param {string} content
     * @param {ContentAnalytics[]} historicalData
     * @param {any} context
     * @returns {Promise<PerformancePrediction>}
     */
    static async assessRisk(
        content,
        historicalData,
        context
    ) {
        const contentFactors = this.analyzeContentFactors(content);

        // Start with base risk score
        let riskScore = 20; // Low baseline risk

        // Increase risk based on content factors
        if (contentFactors.hasMarketingClaims) riskScore += 25;
        if (contentFactors.hasSuperlatives) riskScore += 15;
        if (contentFactors.hasUnapprovedClaims) riskScore += 30;
        if (contentFactors.hasCompetitiveClaims) riskScore += 20;
        if (contentFactors.isComplexContent) riskScore += 10;
        if (!contentFactors.hasRegulatoryLanguage && context.content_type === 'asset') riskScore += 15;

        // Historical risk patterns
        const riskHistory = historicalData.filter(d => d.performance_score < 60);
        if (riskHistory.length > historicalData.length * 0.3) riskScore += 10; // High historical risk

        riskScore = Math.max(0, Math.min(100, riskScore));

        const confidence = this.calculateConfidence(historicalData.length, 80);

        return {
            prediction_type: 'risk_score',
            predicted_score: Math.round(riskScore),
            confidence_level: confidence,
            prediction_factors: {
                key_factors: [
                    'Marketing claim analysis',
                    'Regulatory compliance indicators',
                    'Content complexity assessment',
                    'Historical risk patterns'
                ],
                positive_indicators: [
                    contentFactors.hasRegulatoryLanguage ? 'Contains regulatory disclaimers' : '',
                    contentFactors.hasApprovedClaims ? 'Uses pre-approved claims' : '',
                    !contentFactors.hasSuperlatives ? 'Avoids superlative language' : ''
                ].filter(Boolean),
                risk_indicators: [
                    contentFactors.hasMarketingClaims ? 'Contains marketing claims requiring review' : '',
                    contentFactors.hasSuperlatives ? 'Uses superlative or absolute language' : '',
                    contentFactors.hasUnapprovedClaims ? 'May contain unapproved claims' : '',
                    contentFactors.hasCompetitiveClaims ? 'Contains competitive comparisons' : ''
                ].filter(Boolean),
                historical_patterns: [
                    `${Math.round((riskHistory.length / Math.max(historicalData.length, 1)) * 100)}% of similar content had issues`,
                    'Risk patterns based on brand history'
                ]
            },
            recommendations: this.generateRiskRecommendations(contentFactors, riskScore)
        };
    }

    /**
     * Generate A/B testing recommendations
     * @private
     * @param {string} content
     * @param {ContentAnalytics[]} historicalData
     * @param {any} context
     * @returns {Promise<PerformancePrediction>}
     */
    static async generateABRecommendations(
        content,
        historicalData,
        context
    ) {
        const contentFactors = this.analyzeContentFactors(content);

        // Analyze what elements could be tested
        const testableElements = [];
        if (contentFactors.hasCallToAction) testableElements.push('call-to-action');
        if (contentFactors.hasHeadlines) testableElements.push('headlines');
        if (contentFactors.hasEmotionalLanguage) testableElements.push('tone');
        if (contentFactors.hasVisualElements) testableElements.push('visuals');

        // Calculate recommendation score based on testing potential
        const recommendationScore = Math.min(100, testableElements.length * 20 + 20);

        const confidence = testableElements.length > 2 ? 85 : 60;

        return {
            prediction_type: 'ab_recommendation',
            predicted_score: recommendationScore,
            confidence_level: confidence,
            prediction_factors: {
                key_factors: [
                    'Testable element identification',
                    'Historical A/B test performance',
                    'Content variation potential',
                    'Audience segmentation opportunities'
                ],
                positive_indicators: [
                    `${testableElements.length} testable elements identified`,
                    contentFactors.hasCallToAction ? 'Multiple CTA options possible' : '',
                    contentFactors.hasEmotionalLanguage ? 'Tone variations testable' : ''
                ].filter(Boolean),
                risk_indicators: [
                    testableElements.length < 2 ? 'Limited testing opportunities' : '',
                    !contentFactors.hasCallToAction ? 'No clear action to optimize' : ''
                ].filter(Boolean),
                historical_patterns: [
                    'A/B testing recommendations based on content analysis',
                    `Testable elements: ${testableElements.join(', ')}`
                ]
            },
            recommendations: this.generateABTestRecommendations(testableElements, contentFactors)
        };
    }

    /**
     * Analyze content characteristics for prediction factors
     * @private
     * @param {string} content
     * @returns {Object}
     */
    static analyzeContentFactors(content) {
        const lowerContent = content.toLowerCase();
        const wordCount = content.split(/\s+/).length;

        return {
            hasCallToAction: /\b(click|call|visit|contact|learn more|get started|sign up|download)\b/i.test(content),
            hasEmotionalLanguage: /\b(amazing|incredible|breakthrough|revolutionary|transform|improve|better)\b/i.test(content),
            hasRegulatoryLanguage: /\b(indication|contraindication|side effects|warnings|precautions|see full prescribing information)\b/i.test(content),
            hasClinicalEvidence: /\b(study|trial|clinical|research|data|evidence|proven)\b/i.test(content),
            hasMarketingClaims: /\b(best|leading|number one|superior|most effective|fastest)\b/i.test(content),
            hasSuperlatives: /\b(most|best|greatest|fastest|strongest|only|never|always|all|every)\b/i.test(content),
            hasApprovedClaims: /\b(fda approved|clinically proven|indicated for)\b/i.test(content),
            hasUnapprovedClaims: /\b(cure|miracle|guarantee|promise|eliminate)\b/i.test(content),
            hasCompetitiveClaims: /\b(versus|compared to|better than|superior to)\b/i.test(content),
            hasVisualElements: /\b(image|chart|graph|infographic|video)\b/i.test(content),
            hasHeadlines: content.includes('\n') || content.includes('##') || content.includes('#'),
            isPersonalized: /\b(you|your|yours)\b/i.test(content),
            isOptimalLength: wordCount >= 50 && wordCount <= 300,
            isTooLong: wordCount > 500,
            isTooShort: wordCount < 20,
            isComplexContent: wordCount > 300 && /\b(mechanism|pharmacokinetics|bioavailability|metabolism)\b/i.test(content)
        };
    }

    /**
     * Get historical data for brand and context
     * @private
     * @param {string} brandId
     * @param {any} context
     * @returns {Promise<ContentAnalytics[]>}
     */
    static async getHistoricalData(
        brandId,
        context
    ) {
        const { data, error } = await supabase
            .from('content_analytics')
            .select('*')
            .eq('brand_id', brandId)
            .eq('content_type', context.content_type)
            .order('created_at', { ascending: false })
            .limit(50);

        if (error) {
            console.error('Failed to fetch historical data:', error);
            return [];
        }

        return (data || []);
    }

    /**
     * Calculate confidence based on data availability and quality
     * @private
     * @param {number} dataPoints
     * @param {number} baseScore
     * @returns {number}
     */
    static calculateConfidence(dataPoints, baseScore) {
        let confidence = 50; // Base confidence

        // More data points increase confidence
        if (dataPoints >= 20) confidence += 30;
        else if (dataPoints >= 10) confidence += 20;
        else if (dataPoints >= 5) confidence += 10;

        // Higher base scores indicate more reliable patterns
        if (baseScore >= 80) confidence += 10;
        else if (baseScore <= 40) confidence -= 10;

        return Math.max(30, Math.min(95, confidence));
    }

    /**
     * Get average approval time from historical data
     * @private
     * @param {ContentAnalytics[]} approvalHistory
     * @returns {number}
     */
    static getAvgApprovalTime(approvalHistory) {
        const times = approvalHistory
            .map(d => d.metrics.mlr_approval_time)
            .filter(t => t !== undefined);

        return times.length > 0 ? Math.round(times.reduce((sum, t) => sum + t, 0) / times.length) : 14;
    }

    /**
     * Get best performing content type from historical data
     * @private
     * @param {ContentAnalytics[]} engagementHistory
     * @returns {string}
     */
    static getBestPerformingType(engagementHistory) {
        // This would analyze content types, for now return placeholder
        return 'Educational content';
    }

    /**
     * Generate MLR-specific recommendations
     * @private
     * @param {any} contentFactors
     * @param {number} predictedScore
     * @returns {string[]}
     */
    static generateMLRRecommendations(contentFactors, predictedScore) {
        const recommendations = [];

        if (predictedScore < 70) {
            recommendations.push('Consider adding regulatory disclaimers to improve approval likelihood');
        }
        if (!contentFactors.hasRegulatoryLanguage) {
            recommendations.push('Include appropriate regulatory language and warnings');
        }
        if (contentFactors.hasMarketingClaims) {
            recommendations.push('Review marketing claims against approved indication');
        }
        if (contentFactors.hasSuperlatives) {
            recommendations.push('Replace superlative language with evidence-based claims');
        }
        if (!contentFactors.hasClinicalEvidence) {
            recommendations.push('Reference clinical studies to support claims');
        }

        return recommendations;
    }

    /**
     * Generate engagement-specific recommendations
     * @private
     * @param {any} contentFactors
     * @param {number} predictedScore
     * @returns {string[]}
     */
    static generateEngagementRecommendations(contentFactors, predictedScore) {
        const recommendations = [];

        if (!contentFactors.hasCallToAction) {
            recommendations.push('Add a clear, compelling call-to-action');
        }
        if (contentFactors.isTooLong) {
            recommendations.push('Consider shortening content for better engagement');
        }
        if (contentFactors.isTooShort) {
            recommendations.push('Expand content to provide more value to audience');
        }
        if (!contentFactors.hasEmotionalLanguage) {
            recommendations.push('Include more engaging, emotional language while maintaining compliance');
        }
        if (!contentFactors.isPersonalized) {
            recommendations.push('Use more personalized language to connect with audience');
        }

        return recommendations;
    }

    /**
     * Generate risk mitigation recommendations
     * @private
     * @param {any} contentFactors
     * @param {number} riskScore
     * @returns {string[]}
     */
    static generateRiskRecommendations(contentFactors, riskScore) {
        const recommendations = [];

        if (riskScore > 60) {
            recommendations.push('High risk content - recommend thorough legal review');
        }
        if (contentFactors.hasUnapprovedClaims) {
            recommendations.push('Remove or modify potentially unapproved claims');
        }
        if (contentFactors.hasSuperlatives) {
            recommendations.push('Replace absolute statements with qualified claims');
        }
        if (!contentFactors.hasRegulatoryLanguage) {
            recommendations.push('Add required regulatory disclaimers and warnings');
        }
        if (contentFactors.hasCompetitiveClaims) {
            recommendations.push('Ensure competitive claims are substantiated and approved');
        }

        return recommendations;
    }

    /**
     * Generate A/B testing recommendations
     * @private
     * @param {string[]} testableElements
     * @param {any} contentFactors
     * @returns {string[]}
     */
    static generateABTestRecommendations(testableElements, contentFactors) {
        const recommendations = [];

        if (testableElements.includes('call-to-action')) {
            recommendations.push('Test different call-to-action phrases and button colors');
        }
        if (testableElements.includes('headlines')) {
            recommendations.push('Test benefit-focused vs. feature-focused headlines');
        }
        if (testableElements.includes('tone')) {
            recommendations.push('Test professional vs. conversational tone variations');
        }
        if (testableElements.includes('visuals')) {
            recommendations.push('Test different visual elements and layouts');
        }
        if (contentFactors.hasEmotionalLanguage) {
            recommendations.push('Test emotional vs. rational messaging approaches');
        }

        return recommendations.length > 0 ? recommendations : [
            'Limited A/B testing opportunities - consider adding more variable elements'
        ];
    }

    /**
     * Save predictions to database
     * @private
     * @param {string} contentId
     * @param {'campaign' | 'asset'} contentType
     * @param {PredictionResult} predictions
     * @returns {Promise<void>}
     */
    static async savePredictions(
        contentId,
        contentType,
        predictions
    ) {
        const predictionData = [
            {
                content_id: contentId,
                content_type: contentType,
                prediction_type: 'mlr_approval',
                predicted_score: predictions.mlr_approval.predicted_score,
                confidence_level: predictions.mlr_approval.confidence_level,
                prediction_factors: predictions.mlr_approval.prediction_factors
            },
            {
                content_id: contentId,
                content_type: contentType,
                prediction_type: 'engagement',
                predicted_score: predictions.engagement_forecast.predicted_score,
                confidence_level: predictions.engagement_forecast.confidence_level,
                prediction_factors: predictions.engagement_forecast.prediction_factors
            },
            {
                content_id: contentId,
                content_type: contentType,
                prediction_type: 'risk_score',
                predicted_score: predictions.risk_assessment.predicted_score,
                confidence_level: predictions.risk_assessment.confidence_level,
                prediction_factors: predictions.risk_assessment.prediction_factors
            },
            {
                content_id: contentId,
                content_type: contentType,
                prediction_type: 'ab_recommendation',
                predicted_score: predictions.ab_recommendations.predicted_score,
                confidence_level: predictions.ab_recommendations.confidence_level,
                prediction_factors: predictions.ab_recommendations.prediction_factors
            }
        ];

        const { error } = await supabase
            .from('performance_predictions')
            .insert(predictionData);

        if (error) {
            console.error('Failed to save predictions:', error);
        }
    }
}