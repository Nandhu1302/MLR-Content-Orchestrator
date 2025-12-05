import { supabase } from '@/integrations/supabase/client';

/**
 * @typedef {Object} ModuleMetric
 * @property {string} label
 * @property {string} value
 * @property {string} [trend]
 */

/**
 * @typedef {Object} ModuleMetrics
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} status
 * @property {ModuleMetric[]} metrics
 */

export class ModuleMetricsService {
  /**
   * Fetches metrics for the Content Development Hub workflow.
   * @param {string} brandId
   * @returns {Promise<ModuleMetrics>}
   */
  static async getContentWorkflowMetrics(brandId) {
    const { data: campaigns, count: campaignCount } = await supabase
      .from('cross_module_context')
      .select('*', { count: 'exact' })
      .eq('brand_id', brandId)
      .eq('context_type', 'initiative')
      .eq('is_active', true);

    const { data: assets } = await supabase
      .from('content_assets')
      .select('created_at, completed_at, status')
      .eq('brand_id', brandId)
      .not('completed_at', 'is', null)
      .limit(50);

    // Calculate average cycle time in days
    const avgCycleTime = assets?.length
      ? Math.round(
          assets.reduce((sum, asset) => {
            // Note: completed_at is asserted to be non-null in the query, but we use fallback if needed.
            const completedAt = asset.completed_at || asset.created_at;
            const diff = new Date(completedAt).getTime() - new Date(asset.created_at).getTime();
            return sum + diff / (1000 * 60 * 60 * 24);
          }, 0) / assets.length
        )
      : 18; // Default value

    const onSchedule = assets?.length 
      ? Math.round((assets.filter(a => a.status === 'completed').length / assets.length) * 100)
      : 92; // Default value

    return {
      id: 'content-workflow',
      title: 'Content Development Hub',
      description: 'End-to-end content creation workflow from intelligence to completion.',
      status: campaignCount ? `${campaignCount} Active Projects` : 'Ready to Start',
      metrics: [
        { label: 'Active Projects', value: String(campaignCount || 0) },
        { label: 'Avg Cycle Time', value: `${avgCycleTime}d`, trend: '-12%' },
        { label: 'MLR Success', value: '89%', trend: '+5%' },
        { label: 'On Schedule', value: `${onSchedule}%` }
      ]
    };
  }

  /**
   * Fetches metrics for the Intelligence Hub module.
   * @param {string} brandId
   * @returns {Promise<ModuleMetrics>}
   */
  static async getIntelligenceHubMetrics(brandId) {
    const { count: themeCount } = await supabase
      .from('theme_intelligence')
      .select('*', { count: 'exact' })
      .eq('brand_id', brandId);

    const { count: activeThemes } = await supabase
      .from('theme_library')
      .select('*', { count: 'exact' })
      .eq('brand_id', brandId)
      .eq('status', 'active');

    const successRate = themeCount && activeThemes 
      ? Math.round((activeThemes / themeCount) * 100)
      : 87; // Default value

    const { count: insightsCount } = await supabase
      .from('public_domain_insights')
      .select('*', { count: 'exact' })
      .eq('brand_id', brandId)
      .eq('status', 'reviewed');

    return {
      id: 'intelligence-hub',
      title: 'Intelligence Hub',
      description: 'AI-powered competitive intelligence, market insights, and theme generation with real-time data.',
      status: `${themeCount || 0} Themes Generated`,
      metrics: [
        { label: 'Themes Generated', value: String(themeCount || 0), trend: '+8' },
        { label: 'Theme Success', value: `${successRate}%` },
        { label: 'HCP Engagement', value: '4.2/5' },
        { label: 'Market Analysis', value: String(insightsCount || 0) }
      ]
    };
  }

  /**
   * Fetches metrics for the Content Studio module.
   * @param {string} brandId
   * @returns {Promise<ModuleMetrics>}
   */
  static async getContentStudioMetrics(brandId) {
    const { data: assets, count: totalCount } = await supabase
      .from('content_assets')
      .select('*', { count: 'exact' })
      .eq('brand_id', brandId);

    const completedCount = assets?.filter(a => a.status === 'completed').length || 0;
    const approvalRate = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;

    const { data: completedAssets } = await supabase
      .from('content_assets')
      .select('created_at, completed_at')
      .eq('brand_id', brandId)
      .not('completed_at', 'is', null)
      .limit(30);

    const avgCreationTime = completedAssets?.length
      ? Math.round(
          completedAssets.reduce((sum, asset) => {
            const completedAt = asset.completed_at || asset.created_at;
            const diff = new Date(completedAt).getTime() - new Date(asset.created_at).getTime();
            return sum + diff / (1000 * 60 * 60 * 24);
          }, 0) / completedAssets.length
        )
      : 0;

    const { count: guardrailsCount } = await supabase
      .from('asset_guardrails')
      .select('*', { count: 'exact' })
      .eq('brand_id', brandId);

    const brandScore = guardrailsCount ? 94 : 85;

    return {
      id: 'content-studio',
      title: 'Content Studio',
      description: 'Generate, customize, and refine multi-format content with AI-assisted creation and brand compliance.',
      status: `${totalCount || 0} Assets Created`,
      metrics: [
        { label: 'Assets Created', value: String(totalCount || 0), trend: '+12' },
        { label: 'Approval Rate', value: `${approvalRate}%`, trend: '+3%' },
        { label: 'Avg Creation', value: avgCreationTime ? `${avgCreationTime}d` : 'N/A' },
        { label: 'Brand Score', value: `${brandScore}%` }
      ]
    };
  }

  /**
   * Fetches metrics for the Design Studio module.
   * @param {string} brandId
   * @returns {Promise<ModuleMetrics>}
   */
  static async getDesignStudioMetrics(brandId) {
    const { count: designsReady } = await supabase
      .from('content_assets')
      .select('*', { count: 'exact' })
      .eq('brand_id', brandId)
      .in('status', ['completed', 'approved']);

    const { data: handoffs, count: handoffCount } = await supabase
      .from('design_handoffs')
      .select('*', { count: 'exact' })
      .eq('brand_id', brandId);

    const completedHandoffs = handoffs?.filter(h => h.handoff_status === 'completed').length || 0;
    const complianceRate = handoffCount ? Math.round((completedHandoffs / handoffCount) * 100) : 98; // Default value

    return {
      id: 'design-studio',
      title: 'Design Studio',
      description: 'Transform approved content into production-ready designs with automated brand compliance.',
      status: `${designsReady || 0} Designs Ready`,
      metrics: [
        { label: 'Designs Ready', value: String(designsReady || 0), trend: '+6' },
        { label: 'Brand Compliance', value: `${complianceRate}%` },
        { label: 'Multi-format', value: '8 types' },
        { label: 'Quality Score', value: '4.8/5' }
      ]
    };
  }

  /**
   * Fetches metrics for the Pre-MLR Companion module.
   * @param {string} brandId
   * @returns {Promise<ModuleMetrics>}
   */
  static async getPreMLRMetrics(brandId) {
    const { count: reviewsReady } = await supabase
      .from('content_assets')
      .select('*', { count: 'exact' })
      .eq('brand_id', brandId)
      .in('status', ['draft', 'in_review']);

    const { count: guardrailsCount } = await supabase
      .from('campaign_guardrails')
      .select('*', { count: 'exact' })
      .eq('brand_id', brandId);

    const successPrediction = guardrailsCount ? 91 : 85; // Default value

    const { count: validationIssues } = await supabase
      .from('rule_execution_log')
      .select('*', { count: 'exact' })
      .eq('execution_result', 'failed')
      .limit(100);

    return {
      id: 'pre-mlr',
      title: 'Pre-MLR Companion',
      description: 'AI-powered compliance checking and intelligent review preparation before MLR submission.',
      status: `${reviewsReady || 0} Reviews Ready`,
      metrics: [
        { label: 'Reviews Ready', value: String(reviewsReady || 0) },
        { label: 'Success Prediction', value: `${successPrediction}%`, trend: '+4%' },
        { label: 'Issues Found', value: String(validationIssues || 0) },
        { label: 'Review Time', value: '2.3d', trend: '-18%' }
      ]
    };
  }

  /**
   * Fetches metrics for the Glocalization Factory module.
   * @param {string} brandId
   * @returns {Promise<ModuleMetrics>}
   */
  static async getGlocalizationMetrics(brandId) {
    // Query glocal projects
    const glocalQuery = await supabase
      .from('glocal_adaptation_projects')
      .select('id', { count: 'exact', head: true })
      .eq('brand_id', brandId);
    
    const glocalProjects = glocalQuery.count || 0;

    // Query localization projects  
    const locQuery = await supabase
      .from('localization_projects')
      .select('id', { count: 'exact', head: true })
      .eq('brand_id', brandId);
    
    const localizationProjects = locQuery.count || 0;

    const totalProjects = glocalProjects + localizationProjects;

    const { data: languageData } = await supabase
      .from('glocal_adaptation_projects')
      .select('target_languages')
      .eq('brand_id', brandId);

    // Calculate unique languages
    const uniqueLanguages = new Set(
      languageData?.flatMap(p => p.target_languages || []) || []
    ).size;

    const { data: tmData } = await supabase
      .from('glocal_tm_intelligence')
      .select('leverage_percentage')
      .limit(100);

    // Calculate average Translation Memory (TM) Leverage
    const avgTMLeverage = tmData?.length
      ? Math.round(tmData.reduce((sum, tm) => sum + (tm.leverage_percentage || 0), 0) / tmData.length)
      : 78; // Default value

    const { data: culturalData } = await supabase
      .from('glocal_cultural_intelligence')
      .select('cultural_appropriateness_score')
      .limit(50);

    // Calculate cultural score, normalized to a 5-point scale (assuming raw score is out of 100)
    const culturalScore = culturalData?.length
      ? (culturalData.reduce((sum, c) => sum + (c.cultural_appropriateness_score || 0), 0) / culturalData.length / 20).toFixed(1)
      : '4.3';

    return {
      id: 'glocalization',
      title: 'Glocalization Factory',
      description: 'Scale content globally with AI translation, cultural adaptation, and regulatory compliance.',
      status: `${totalProjects} Active Projects`,
      metrics: [
        { label: 'Active Projects', value: String(totalProjects), trend: '+5' },
        { label: 'Languages', value: String(uniqueLanguages || 15) },
        { label: 'Cultural Score', value: `${culturalScore}/5` },
        { label: 'TM Leverage', value: `${avgTMLeverage}%`, trend: '+6%' }
      ]
    };
  }

  /**
   * Fetches metrics for all modules concurrently.
   * @param {string} brandId
   * @returns {Promise<ModuleMetrics[]>}
   */
  static async getAllModuleMetrics(brandId) {
    const [
      contentWorkflow,
      intelligenceHub,
      contentStudio,
      designStudio,
      preMLR,
      glocalization
    ] = await Promise.all([
      this.getContentWorkflowMetrics(brandId),
      this.getIntelligenceHubMetrics(brandId),
      this.getContentStudioMetrics(brandId),
      this.getDesignStudioMetrics(brandId),
      this.getPreMLRMetrics(brandId),
      this.getGlocalizationMetrics(brandId)
    ]);

    return [
      contentWorkflow,
      intelligenceHub,
      contentStudio,
      designStudio,
      preMLR,
      glocalization
    ];
  }
}