import { supabase } from "../integrations/supabase/client.js";

/**
 * Intelligence Logging Service
 * Tracks which intelligence is used in content generation
 */

// JSDoc is used to document the structure of the data objects

/**
 * @typedef {Object} IntelligenceUsageLog
 * @property {string} [id]
 * @property {string} brand_id
 * @property {string} [content_asset_id]
 * @property {string} [project_id]
 * @property {'brand' | 'evidence' | 'performance' | 'competitive' | 'audience'} intelligence_type
 * @property {string} intelligence_source - e.g., 'clinical_claims', 'success_patterns'
 * @property {string} [intelligence_id] - ID of the specific intelligence item used
 * @property {any} [usage_context] - JSONB context
 * @property {string} [ai_model]
 * @property {number} [confidence_score]
 * @property {string} [created_at]
 */

/**
 * @typedef {Object} IntelligenceUsageStats
 * @property {number} totalUsage
 * @property {Record<string, number>} byType
 * @property {Record<string, number>} bySource
 * @property {Record<string, number>} byContext
 * @property {IntelligenceUsageLog[]} recentUsage
 */

export class IntelligenceLoggingService {
  /**
   * Log intelligence usage
   * @param {IntelligenceUsageLog} log
   * @returns {Promise<void>}
   */
  static async logUsage(log) {
    try {
      const { error } = await supabase.from('intelligence_usage_logs').insert({
        brand_id: log.brand_id,
        content_asset_id: log.content_asset_id,
        project_id: log.project_id,
        intelligence_type: log.intelligence_type,
        intelligence_source: log.intelligence_source,
        intelligence_id: log.intelligence_id,
        usage_context: log.usage_context || {},
        ai_model: log.ai_model,
        confidence_score: log.confidence_score,
        created_at: new Date().toISOString(),
      });

      if (error) {
        console.error('Failed to log intelligence usage:', error);
      }
    } catch (err) {
      console.error('Error logging intelligence usage:', err);
    }
  }

  /**
   * Log multiple intelligence usages in batch
   * @param {IntelligenceUsageLog[]} logs
   * @returns {Promise<void>}
   */
  static async logBatch(logs) {
    try {
      const records = logs.map(log => ({
        brand_id: log.brand_id,
        content_asset_id: log.content_asset_id,
        project_id: log.project_id,
        intelligence_type: log.intelligence_type,
        intelligence_source: log.intelligence_source,
        intelligence_id: log.intelligence_id,
        usage_context: log.usage_context || {},
        ai_model: log.ai_model,
        confidence_score: log.confidence_score,
        created_at: new Date().toISOString(),
      }));

      const { error } = await supabase.from('intelligence_usage_logs').insert(records);

      if (error) {
        console.error('Failed to log intelligence batch:', error);
      }
    } catch (err) {
      console.error('Error logging intelligence batch:', err);
    }
  }

  /**
   * Get intelligence usage statistics
   * @param {string} brandId
   * @param {Object} [options]
   * @param {string} [options.assetId]
   * @param {string} [options.projectId]
   * @param {string} [options.startDate]
   * @param {string} [options.endDate]
   * @returns {Promise<IntelligenceUsageStats>}
   */
  static async getUsageStats(brandId, options) {
    let query = supabase
      .from('intelligence_usage_logs')
      .select('*')
      .eq('brand_id', brandId);

    if (options?.assetId) {
      query = query.eq('asset_id', options.assetId);
    }

    if (options?.projectId) {
      query = query.eq('project_id', options.projectId);
    }

    if (options?.startDate) {
      query = query.gte('created_at', options.startDate);
    }

    if (options?.endDate) {
      query = query.lte('created_at', options.endDate);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch intelligence usage stats:', error);
      return {
        totalUsage: 0,
        byType: {},
        bySource: {},
        byContext: {},
        recentUsage: [],
      };
    }

    const logs = data || [];

    // Calculate statistics
    const byType = {};
    const bySource = {};
    const byContext = {};

    logs.forEach(log => {
      byType[log.intelligence_type] = (byType[log.intelligence_type] || 0) + 1;
      bySource[log.intelligence_source] = (bySource[log.intelligence_source] || 0) + 1;
      // Note: JSONB comparison as a key in JS might be complex, but for simple values it works.
      // For JSON objects, log.usage_context will be [object Object] as a key, which might not be what's intended.
      // The original TS had `log.usage_context` as `any` and then used it as a key.
      // A more robust JS/TS solution for JSONB in stats would be to count by a specific key *inside* the JSONB.
      byContext[log.usage_context] = (byContext[log.usage_context] || 0) + 1;
    });

    return {
      totalUsage: logs.length,
      byType,
      bySource,
      byContext,
      recentUsage: logs.slice(0, 20),
    };
  }

  /**
   * Track claim usage in content generation
   * @param {string} brandId
   * @param {string} claimId
   * @param {Object} context
   * @param {string} [context.assetId]
   * @param {string} [context.projectId]
   * @param {string} context.usageContext
   * @param {number} [context.confidence]
   * @returns {Promise<void>}
   */
  static async trackClaimUsage(brandId, claimId, context) {
    await this.logUsage({
      brand_id: brandId,
      content_asset_id: context.assetId,
      project_id: context.projectId,
      intelligence_type: 'evidence',
      intelligence_source: 'clinical_claims',
      intelligence_id: claimId,
      usage_context: { usage_context: context.usageContext },
      confidence_score: context.confidence,
    });

    // Also increment usage count on the claim itself
    const { data: claim } = await supabase
      .from('clinical_claims')
      .select('usage_count')
      .eq('id', claimId)
      .single();
    
    await supabase
      .from('clinical_claims')
      .update({
        usage_count: (claim?.usage_count || 0) + 1,
        last_used_at: new Date().toISOString(),
      })
      .eq('id', claimId);
  }

  /**
   * Track pattern usage in content generation
   * @param {string} brandId
   * @param {string} patternId
   * @param {Object} context
   * @param {string} [context.assetId]
   * @param {string} [context.projectId]
   * @param {string} context.usageContext
   * @param {number} [context.confidence]
   * @returns {Promise<void>}
   */
  static async trackPatternUsage(brandId, patternId, context) {
    await this.logUsage({
      brand_id: brandId,
      content_asset_id: context.assetId,
      project_id: context.projectId,
      intelligence_type: 'performance',
      intelligence_source: 'content_success_patterns',
      intelligence_id: patternId,
      usage_context: { usage_context: context.usageContext },
      confidence_score: context.confidence,
    });
  }

  /**
   * Get intelligence utilization rate
   * @param {string} brandId
   * @param {string} startDate
   * @param {string} endDate
   * @returns {Promise<Object>}
   */
  static async getUtilizationRate(brandId, startDate, endDate) {
    const stats = await this.getUsageStats(brandId, { startDate, endDate });

    const evidence = stats.byType['evidence'] || 0;
    const performance = stats.byType['performance'] || 0;
    const competitive = stats.byType['competitive'] || 0;
    const audience = stats.byType['audience'] || 0;
    const total = stats.totalUsage;

    if (total === 0) {
      return {
        evidenceUtilization: 0,
        performanceUtilization: 0,
        competitiveUtilization: 0,
        audienceUtilization: 0,
        overall: 0,
      };
    }

    return {
      evidenceUtilization: Math.round((evidence / total) * 100),
      performanceUtilization: Math.round((performance / total) * 100),
      competitiveUtilization: Math.round((competitive / total) * 100),
      audienceUtilization: Math.round((audience / total) * 100),
      overall: 100, // If any intelligence was used, utilization is 100%
    };
  }
}