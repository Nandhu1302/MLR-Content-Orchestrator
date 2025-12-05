// Theme Service - Database operations for Strategy & Insights Hub
import { supabase } from './client'; // Assuming client is correctly exported from './client'
import { sanitizeString, sanitizeObject } from './utils'; // Assuming utils is correctly exported from './utils'

// Type transformation helpers (Simplified for JS)
const transformDatabaseTheme = (dbTheme, enrichedIntelligence) => ({
    id: dbTheme.id,
    name: dbTheme.name,
    description: dbTheme.description,
    category: dbTheme.category,
    status: dbTheme.status,
    brand_id: dbTheme.brand_id,
    key_message: dbTheme.key_message,
    call_to_action: dbTheme.call_to_action,
    enrichment_status: dbTheme.enrichment_status || 'generated',
    intelligence_layers: enrichedIntelligence !== undefined ? enrichedIntelligence : (dbTheme.intelligence_layers || {}),
    intelligence_progress: dbTheme.intelligence_progress || 0,
    messaging_framework: dbTheme.messaging_framework || {},
    rationale: dbTheme.rationale || {},
    content_suggestions: dbTheme.content_suggestions || {},
    performance_prediction: dbTheme.performance_prediction || {},
    regulatory_considerations: Array.isArray(dbTheme.regulatory_considerations) ? dbTheme.regulatory_considerations : [],
    audience_segments: Array.isArray(dbTheme.audience_segments) ? dbTheme.audience_segments : [],
    target_markets: Array.isArray(dbTheme.target_markets) ? dbTheme.target_markets : [],
    usage_count: dbTheme.usage_count || 0,
    confidence_score: dbTheme.confidence_score || 0,
    version: dbTheme.version || 1,
    success_rate: dbTheme.success_rate || 0,
    avg_engagement_rate: dbTheme.avg_engagement_rate || 0,
    data_sources: Array.isArray(dbTheme.data_sources) ? dbTheme.data_sources : [],
    created_at: new Date(dbTheme.created_at),
    updated_at: new Date(dbTheme.updated_at),
    last_used_at: dbTheme.last_used_at ? new Date(dbTheme.last_used_at) : undefined,
    approved_at: dbTheme.approved_at ? new Date(dbTheme.approved_at) : undefined,
    approved_by: dbTheme.approved_by,
    source_intake_id: dbTheme.source_intake_id,
    created_by: dbTheme.created_by,
    indication: dbTheme.indication
});

const transformDatabaseComparison = (dbComparison) => ({
    ...dbComparison,
    comparison_criteria: Array.isArray(dbComparison.comparison_criteria) ? dbComparison.comparison_criteria : [],
    decision_factors: Array.isArray(dbComparison.decision_factors) ? dbComparison.decision_factors : [],
    side_by_side_analysis: dbComparison.side_by_side_analysis || {},
    performance_delta: dbComparison.performance_delta || {},
    pros_cons_analysis: dbComparison.pros_cons_analysis || {},
    risk_assessment: dbComparison.risk_assessment || {},
    outcome_validation: dbComparison.outcome_validation || {},
    lessons_learned: Array.isArray(dbComparison.lessons_learned) ? dbComparison.lessons_learned : [],
    created_at: new Date(dbComparison.created_at),
    updated_at: new Date(dbComparison.updated_at),
    completed_at: dbComparison.completed_at ? new Date(dbComparison.completed_at) : undefined
});

const transformDatabaseAnalytics = (dbAnalytics) => ({
    ...dbAnalytics,
    predicted_performance: dbAnalytics.predicted_performance || {},
    actual_performance: dbAnalytics.actual_performance || {},
    engagement_metrics: dbAnalytics.engagement_metrics || {},
    conversion_metrics: dbAnalytics.conversion_metrics || {},
    implementation_type: dbAnalytics.implementation_type,
    recorded_at: new Date(dbAnalytics.recorded_at)
});

const transformDatabaseUsageHistory = (dbUsage) => ({
    ...dbUsage,
    usage_type: dbUsage.usage_type,
    theme_adaptations: dbUsage.theme_adaptations || {},
    performance_impact: dbUsage.performance_impact || {},
    customizations_made: dbUsage.customizations_made || {},
    success_metrics: dbUsage.success_metrics || {},
    failure_points: Array.isArray(dbUsage.failure_points) ? dbUsage.failure_points : [],
    key_learnings: Array.isArray(dbUsage.key_learnings) ? dbUsage.key_learnings : [],
    used_at: new Date(dbUsage.used_at),
    completed_at: dbUsage.completed_at ? new Date(dbUsage.completed_at) : undefined
});

export class ThemeService {
    // Theme Library Operations
    static async getThemeLibrary(brandId, filters) {
        let query = supabase
            .from('theme_library')
            .select('*')
            .eq('brand_id', brandId);

        // Apply filters with proper null checks
        if (filters?.category?.length) {
            query = query.in('category', filters.category);
        }
        if (filters?.status?.length) {
            query = query.in('status', filters.status);
        }
        if (filters?.search_text && typeof filters.search_text === 'string') {
            const searchText = String(filters.search_text).trim();
            if (searchText) {
                query = query.or(`name.ilike.%${searchText}%,description.ilike.%${searchText}%,key_message.ilike.%${searchText}%`);
            }
        }
        if (filters?.date_range) {
            query = query.gte('created_at', filters.date_range.start.toISOString())
                .lte('created_at', filters.date_range.end.toISOString());
        }

        // Order by created date (most recent first)
        query = query.order('created_at', { ascending: false });

        const { data, error } = await query;
        if (error) throw error;

        const themes = (data || []).map(theme => transformDatabaseTheme(theme));

        // Build facets for filtering with proper structure
        const facets = this.buildFacets(data || []);

        return {
            themes,
            facets,
            total_count: themes.length,
            suggestions: []
        };
    }

    static async getThemeById(themeId) {
        // Fetch theme data
        const { data: themeData, error: themeError } = await supabase
            .from('theme_library')
            .select('*')
            .eq('id', themeId)
            .maybeSingle();

        if (themeError) throw themeError;
        if (!themeData) return null;

        // Fetch associated intelligence layers
        const { data: intelligenceData, error: intelligenceError } = await supabase
            .from('theme_intelligence')
            .select('intelligence_type, incorporated, intelligence_data, user_notes, last_refreshed')
            .eq('theme_id', themeId);

        // Build intelligence_layers object from fetched data
        const intelligenceLayers = {};
        if (intelligenceData && !intelligenceError) {
            intelligenceData.forEach((intel) => {
                intelligenceLayers[intel.intelligence_type] = {
                    incorporated: intel.incorporated,
                    intelligence_data: intel.intelligence_data,
                    user_notes: intel.user_notes,
                    last_refreshed: intel.last_refreshed
                };
            });
        }

        // Pass enriched intelligence directly to transformer
        return transformDatabaseTheme(themeData, intelligenceLayers);
    }

    static async createThemeFromGenerated(generatedTheme, brandId, sourceIntakeId, intakeData) {
        console.log('Creating theme from generated data:', {
            name: generatedTheme.name,
            brandId,
            intakeData,
            sourceIntakeId
        });

        try {
            // Helper to ensure valid JSON object for Supabase JSONB columns
            // Uses shared sanitizeObject from utils to clean invalid Unicode
            const ensureValidJson = (obj, defaultValue) => {
                if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
                    return defaultValue;
                }
                // Filter out undefined values and sanitize strings
                const cleaned = {};
                for (const [key, value] of Object.entries(obj)) {
                    if (value !== undefined) {
                        cleaned[key] = sanitizeObject(value);
                    }
                }
                return Object.keys(cleaned).length > 0 ? cleaned : defaultValue;
            };

            // Ensure JSONB fields have valid values (Supabase rejects undefined/null for JSONB)
            const safeRationale = ensureValidJson(generatedTheme.rationale, {
                primaryInsight: generatedTheme.description || 'Generated theme',
                supportingData: [],
                riskFactors: [],
                marketOpportunity: ''
            });

            const safeContentSuggestions = ensureValidJson(generatedTheme.contentSuggestions, {
                keyPoints: [],
                headlines: [],
                callToAction: generatedTheme.callToAction || '',
                emotionalTriggers: [],
                proofPoints: []
            });

            const safePerformancePrediction = ensureValidJson(generatedTheme.performancePrediction, {
                engagementRate: 0,
                expectedReach: 0,
                mlrApprovalRate: 75,
                successProbability: 70,
                competitiveAdvantage: 50
            });

            const safeMessagingFramework = ensureValidJson(null, {
                primary_message: generatedTheme.keyMessage || '',
                supporting_messages: generatedTheme.contentSuggestions?.keyPoints || [],
                tone_guidance: intakeData?.brandVoice || 'professional',
                do_not_use: [],
                competitive_differentiators: []
            });

            // Map GeneratedTheme properties to database schema with all required fields
            // All strings are sanitized to remove invalid Unicode characters
            const themeData = {
                brand_id: brandId,
                name: sanitizeString(generatedTheme.name || 'Untitled Theme'),
                description: sanitizeString(generatedTheme.description || ''),
                category: generatedTheme.category || 'general',
                key_message: sanitizeString(generatedTheme.keyMessage || ''),
                ...(generatedTheme.callToAction && { call_to_action: sanitizeString(generatedTheme.callToAction) }),
                ...(intakeData?.indication && { indication: sanitizeString(intakeData.indication) }),
                messaging_framework: safeMessagingFramework,
                rationale: safeRationale,
                content_suggestions: safeContentSuggestions,
                performance_prediction: safePerformancePrediction,
                audience_segments: (generatedTheme.targetAudience ? [sanitizeString(generatedTheme.targetAudience)] : []),
                target_markets: (generatedTheme.targetMarkets || []).map(sanitizeString),
                data_sources: (generatedTheme.dataSources || []).map(sanitizeString),
                source_intake_id: sourceIntakeId || null,
                enrichment_status: 'generated',
                status: 'active',
                confidence_score: generatedTheme.confidence || 75,
                version: 1
            };

            console.log('Theme data prepared for insert:', {
                ...themeData,
                rationale: '[OBJECT]',
                content_suggestions: '[OBJECT]',
                performance_prediction: '[OBJECT]'
            });

            const { data, error } = await supabase
                .from('theme_library')
                .insert(themeData)
                .select()
                .single();

            if (error) {
                console.error('Theme creation failed:', error);
                throw new Error(`Failed to save theme: ${error.message}`);
            }

            console.log('Theme created successfully:', data.id);
            return transformDatabaseTheme(data);
        } catch (error) {
            console.error('Theme creation error:', error);
            throw error;
        }
    }

    static async updateTheme(themeId, updates) {
        // Convert TypeScript types to database-compatible types
        const dbUpdates = {};

        if (updates.name !== undefined) dbUpdates.name = updates.name;
        if (updates.description !== undefined) dbUpdates.description = updates.description;
        if (updates.category !== undefined) dbUpdates.category = updates.category;
        if (updates.key_message !== undefined) dbUpdates.key_message = updates.key_message;
        if (updates.messaging_framework !== undefined) dbUpdates.messaging_framework = updates.messaging_framework;
        if (updates.rationale !== undefined) dbUpdates.rationale = updates.rationale;
        if (updates.content_suggestions !== undefined) dbUpdates.content_suggestions = updates.content_suggestions;
        if (updates.performance_prediction !== undefined) dbUpdates.performance_prediction = updates.performance_prediction;
        if (updates.data_sources !== undefined) dbUpdates.data_sources = updates.data_sources;
        if (updates.status !== undefined) dbUpdates.status = updates.status;

        const { data, error } = await supabase
            .from('theme_library')
            .update(dbUpdates)
            .eq('id', themeId)
            .select()
            .single();

        if (error) throw error;
        return transformDatabaseTheme(data);
    }

    static async duplicateTheme(themeId, newName) {
        const original = await this.getThemeById(themeId);
        if (!original) throw new Error('Theme not found');

        // Increment version if duplicating from same theme
        const newVersion = original.version + 1;

        const duplicateData = {
            brand_id: original.brand_id,
            name: newName || `${original.name} (Copy)`,
            description: original.description,
            category: original.category,
            key_message: original.key_message,
            messaging_framework: original.messaging_framework,
            rationale: original.rationale,
            content_suggestions: original.content_suggestions,
            performance_prediction: original.performance_prediction,
            data_sources: original.data_sources,
            status: 'active', // Use standard string since types are removed
            confidence_score: original.confidence_score,
            version: newVersion,
            parent_theme_id: themeId, // Track lineage
            enrichment_status: 'generated' // Reset enrichment for new version
        };

        const { data, error } = await supabase
            .from('theme_library')
            .insert(duplicateData)
            .select()
            .single();

        if (error) throw error;
        return transformDatabaseTheme(data);
    }

    static async getThemeVersions(themeId) {
        // Get all themes that share the same parent or are children of this theme
        const { data, error } = await supabase
            .from('theme_library')
            .select('*')
            .or(`id.eq.${themeId},parent_theme_id.eq.${themeId}`)
            .order('version', { ascending: true });

        if (error) throw error;
        return (data || []).map(theme => transformDatabaseTheme(theme));
    }

    static async archiveTheme(themeId) {
        const { error } = await supabase
            .from('theme_library')
            .update({ status: 'archived' })
            .eq('id', themeId);

        if (error) throw error;
    }

    // Theme Comparison Operations (placeholder - table doesn't exist yet)
    static async createComparison(
        brandId,
        themeIds,
        comparisonCriteria,
        comparisonName
    ) {
        throw new Error('Theme comparisons not implemented yet');
    }

    static async getComparison(comparisonId) {
        return null;
    }

    static async updateComparison(
        comparisonId,
        updates
    ) {
        throw new Error('Theme comparisons not implemented yet');
    }

    static async selectThemeFromComparison(
        comparisonId,
        selectedThemeId,
        selectionReason
    ) {
        throw new Error('Theme comparisons not implemented yet');
    }

    // Theme Usage and Analytics
    static async recordThemeUsage(
        themeId,
        implementationType,
        implementationId,
        additionalData
    ) {
        try {
            // First, get current usage count and enrichment status
            const { data: currentTheme, error: fetchError } = await supabase
                .from('theme_library')
                .select('usage_count, enrichment_status')
                .eq('id', themeId)
                .single();

            if (fetchError) throw fetchError;

            const currentUsageCount = currentTheme?.usage_count || 0;
            const isFirstUse = currentUsageCount === 0;
            const needsAutoPromotion = isFirstUse && currentTheme?.enrichment_status === 'generated';

            // Prepare update object
            const updateData = {
                last_used_at: new Date().toISOString(),
                usage_count: currentUsageCount + 1
            };

            // Auto-promote to ready-for-use on first use if still in generated state
            if (needsAutoPromotion) {
                updateData.enrichment_status = 'ready-for-use';
                updateData.intelligence_progress = 100;
                console.log(`Auto-promoting theme ${themeId} to 'ready-for-use' on first use`);
            }

            // Update last used timestamp and increment usage count
            const { error: updateError } = await supabase
                .from('theme_library')
                .update(updateData)
                .eq('id', themeId);

            if (updateError) throw updateError;

            console.log(`Theme usage recorded: ${themeId} (usage count: ${currentUsageCount + 1})`);

            // Record in theme_analytics if table exists
            try {
                await supabase
                    .from('theme_analytics')
                    .insert([{
                        theme_id: themeId,
                        brand_id: additionalData?.brand_id || '',
                        implementation_type: implementationType,
                        implementation_id: implementationId,
                        recorded_at: new Date().toISOString(),
                        engagement_metrics: {},
                        conversion_metrics: {},
                        predicted_performance: {},
                        actual_performance: {}
                    }]);

                console.log(`Theme analytics recorded for theme: ${themeId}`);
            } catch (analyticsError) {
                console.warn('Theme analytics recording failed:', analyticsError);
            }
        } catch (error) {
            console.error('Failed to record theme usage:', error);
            throw error;
        }
    }

    static async getThemeAnalytics(themeId) {
        try {
            const { data, error } = await supabase
                .from('theme_analytics')
                .select('*')
                .eq('theme_id', themeId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return (data || []).map(transformDatabaseAnalytics);
        } catch (err) {
            return [];
        }
    }

    static async getThemeUsageHistory(themeId) {
        return [];
    }

    // Phase 3: Record theme performance from Content Studio
    static async recordThemePerformance(
        themeId,
        performanceData
    ) {
        try {
            // Get brand_id from the theme
            const { data: theme } = await supabase
                .from('theme_library')
                .select('brand_id')
                .eq('id', themeId)
                .single();

            if (!theme) return;

            // Update theme_analytics with actual performance
            await supabase.from('theme_analytics').insert({
                theme_id: themeId,
                brand_id: theme.brand_id,
                implementation_type: performanceData.implementation_type,
                implementation_id: performanceData.asset_id || performanceData.campaign_id || '',
                recorded_at: performanceData.timestamp.toISOString(),
                actual_performance: {
                    status: performanceData.status_change,
                    approval_status: performanceData.approval_status,
                    timestamp: performanceData.timestamp.toISOString()
                },
                engagement_metrics: performanceData.engagement_rate ? {
                    engagement_rate: performanceData.engagement_rate
                } : {},
                conversion_metrics: performanceData.conversion_rate ? {
                    conversion_rate: performanceData.conversion_rate
                } : {}
            });

            // Recalculate theme success rate based on linked assets
            const { data: assetThemes } = await supabase
                .from('asset_themes')
                .select(`
                    id,
                    content_assets!inner(status)
                `)
                .eq('theme_id', themeId);

            if (assetThemes && assetThemes.length > 0) {
                const approvedCount = assetThemes.filter((at) =>
                    ['approved', 'completed'].includes(at.content_assets.status)
                ).length;

                const successRate = (approvedCount / assetThemes.length) * 100;

                // Update theme success_rate in theme_library
                await supabase
                    .from('theme_library')
                    .update({ success_rate: Math.round(successRate) })
                    .eq('id', themeId);

                console.log(`Theme success rate updated: ${themeId} -> ${Math.round(successRate)}%`);
            }

        } catch (error) {
            console.error('Failed to record theme performance:', error);
        }
    }

    // Phase 4: Get theme-based asset recommendations
    static async getThemeAssetRecommendations(
        themeId,
        assetType
    ) {
        try {
            // Get theme details
            const theme = await this.getThemeById(themeId);
            if (!theme) {
                return {
                    theme: null,
                    similarAssets: [],
                    avgSuccessRate: 0
                };
            }

            // Query assets using this theme
            let query = supabase
                .from('asset_themes')
                .select(`
                    id,
                    content_assets!inner(*)
                `)
                .eq('theme_id', themeId)
                .in('content_assets.status', ['approved', 'completed']);

            if (assetType) {
                query = query.eq('content_assets.asset_type', assetType);
            }

            const { data: assetThemes, error } = await query
                .order('content_assets.created_at', { ascending: false })
                .limit(5);

            if (error) throw error;

            const similarAssets = assetThemes?.map((at) => at.content_assets) || [];
            const avgSuccessRate = theme.success_rate || 0;

            return {
                theme,
                similarAssets,
                avgSuccessRate
            };

        } catch (error) {
            console.error('Failed to get theme recommendations:', error);
            return {
                theme: null,
                similarAssets: [],
                avgSuccessRate: 0
            };
        }
    }

    // Phase 5: Get theme lineage
    static async getThemeLineage(themeId) {
        try {
            const theme = await this.getThemeById(themeId);
            if (!theme) throw new Error('Theme not found');

            // Get campaigns using this theme
            const { data: campaignThemes } = await supabase
                .from('campaign_themes')
                .select(`
                    id,
                    content_projects!inner(*)
                `)
                .eq('theme_id', themeId);

            // Get assets using this theme
            const { data: assetThemes } = await supabase
                .from('asset_themes')
                .select(`
                    id,
                    content_assets!inner(*)
                `)
                .eq('theme_id', themeId);

            const campaigns = campaignThemes?.map((ct) => ct.content_projects) || [];
            const assets = assetThemes?.map((at) => at.content_assets) || [];

            const totalUsage = campaigns.length + assets.length;
            const activeUsage = campaigns.filter((c) => c.status === 'active').length +
                assets.filter((a) => ['draft', 'in_review'].includes(a.status)).length;

            return {
                theme,
                campaigns,
                assets,
                totalUsage,
                activeUsage
            };

        } catch (error) {
            console.error('Failed to get theme lineage:', error);
            throw error;
        }
    }

    // Phase 5: Get cross-theme insights
    static async getCrossThemeInsights(brandId) {
        try {
            const { data: themes } = await supabase
                .from('theme_library')
                .select('*')
                .eq('brand_id', brandId)
                .eq('status', 'active');

            if (!themes || themes.length === 0) {
                return {
                    mostUsedTheme: null,
                    bestPerformingTheme: null,
                    themeUsageByCategory: {}
                };
            }

            // Most used theme
            const mostUsed = themes.sort((a, b) => b.usage_count - a.usage_count)[0];

            // Best performing theme
            const bestPerforming = themes.sort((a, b) =>
                (b.success_rate || 0) - (a.success_rate || 0)
            )[0];

            // Usage by category
            const themeUsageByCategory = themes.reduce((acc, theme) => {
                acc[theme.category] = (acc[theme.category] || 0) + theme.usage_count;
                return acc;
            }, {});

            return {
                mostUsedTheme: transformDatabaseTheme(mostUsed),
                bestPerformingTheme: transformDatabaseTheme(bestPerforming),
                themeUsageByCategory
            };

        } catch (error) {
            console.error('Failed to get cross-theme insights:', error);
            throw error;
        }
    }

    // Dashboard and Insights
    static async getDashboardData(brandId) {
        try {
            const { data: themes, error: themesError } = await supabase
                .from('theme_library')
                .select('*')
                .eq('brand_id', brandId);

            if (themesError) throw themesError;

            const { data: campaignThemes, error: campaignError } = await supabase
                .from('campaign_themes')
                .select('*, content_projects(project_name)')
                .eq('brand_id', brandId);

            if (campaignError) throw campaignError;

            // Calculate dashboard statistics
            const totalThemes = themes?.length || 0;
            const activeThemes = themes?.filter(t => t.status === 'active').length || 0;
            const totalUsage = campaignThemes?.length || 0;

            // Calculate average success rate from themes
            const avgSuccessRate = themes?.length ?
                themes.reduce((sum, theme) => {
                    const rate = Number(theme.success_rate) || Number(theme.confidence_score) || 0;
                    return sum + rate;
                }, 0) / themes.length : 0;

            // Process category distribution with proper structure
            const categoryMap = new Map();
            themes?.forEach(theme => {
                const category = theme.category || 'Uncategorized';
                categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
            });

            const categoryDistribution = Array.from(categoryMap.entries()).map(([category, count]) => ({
                category: category,
                count,
                avg_success_rate: 75, // Mock value
                usage_count: count
            }));

            // Get top performing themes
            const topPerformingThemes = themes
                ?.sort((a, b) => {
                    const scoreA = Number(a.confidence_score) || Number(a.usage_count) || 0;
                    const scoreB = Number(b.confidence_score) || Number(b.usage_count) || 0;
                    return scoreB - scoreA;
                })
                .slice(0, 5)
                .map(theme => transformDatabaseTheme(theme)) || [];

            return {
                summary_stats: {
                    total_themes: totalThemes,
                    active_themes: activeThemes,
                    total_usage: totalUsage,
                    avg_success_rate: Math.round(avgSuccessRate),
                    themes_this_month: totalThemes,
                    usage_this_month: totalUsage
                },
                performance_trends: [],
                category_distribution: categoryDistribution,
                top_performing_themes: topPerformingThemes,
                recent_comparisons: [],
                usage_by_type: []
            };

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            return {
                summary_stats: {
                    total_themes: 0,
                    active_themes: 0,
                    total_usage: 0,
                    avg_success_rate: 0,
                    themes_this_month: 0,
                    usage_this_month: 0
                },
                performance_trends: [],
                category_distribution: [],
                top_performing_themes: [],
                recent_comparisons: [],
                usage_by_type: []
            };
        }
    }

    // Theme Recommendations
    static async getThemeRecommendations(request) {
        const { data: themes, error } = await supabase
            .from('theme_library')
            .select('*')
            .eq('brand_id', request.brand_id)
            .eq('status', 'active');

        if (error) throw error;

        // Convert to proper ThemeRecommendation format
        const recommendations = (themes || [])
            .map(theme => {
                const themeEntry = transformDatabaseTheme(theme);
                return {
                    theme: themeEntry,
                    relevance_score: this.calculateRelevanceScore(theme, request),
                    recommendation_reason: `Theme "${theme.name}" shows strong alignment with your project context.`,
                    similarity_factors: [
                        'Category match',
                        'Performance prediction',
                        'Recent usage'
                    ],
                    adaptation_suggestions: [
                        'Customize messaging for target audience',
                        'Adapt to specific channels',
                        'Align with campaign objectives'
                    ],
                    risk_considerations: [
                        'Monitor performance against benchmarks',
                        'Consider regulatory requirements',
                        'Test with target audience'
                    ]
                };
            })
            .filter(rec => rec.relevance_score > 60)
            .sort((a, b) => b.relevance_score - a.relevance_score)
            .slice(0, 5);

        return recommendations;
    }

    // Private helper methods
    static buildFacets(data) {
        const categories = [...new Set(data.map(item => String(item.category || '')).filter(Boolean))];
        const statuses = [...new Set(data.map(item => String(item.status || '')).filter(Boolean))];

        return {
            categories: categories.map(cat => ({
                category: cat,
                count: data.filter(item => item.category === cat).length
            })),
            audiences: [],
            markets: [],
            indications: []
        };
    }

    static calculateRelevanceScore(theme, request) {
        let score = 50; // Base score

        // Category relevance
        const projectType = request.project_context?.type || '';
        if (theme.category && projectType) {
            score += 20;
        }

        // Performance prediction
        const confidenceScore = Number(theme.confidence_score) || 0;
        score += Math.min(confidenceScore * 0.3, 30);

        return Math.min(score, 100);
    }
}