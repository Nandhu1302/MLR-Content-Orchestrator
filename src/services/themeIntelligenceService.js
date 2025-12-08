// Theme Intelligence Service - Intelligence aggregation and enrichment

import { supabase } from "../integrations/supabase/client.js";

/**
 * @typedef {'brand' | 'competitive' | 'market' | 'regulatory' | 'public'} IntelligenceType
 *
 * @typedef {Object} ThemeIntelligence
 * @property {string} id
 * @property {string} theme_id
 * @property {string} brand_id
 * @property {IntelligenceType} intelligence_type
 * @property {any} intelligence_data - The actual data payload for the intelligence type.
 * @property {string} [user_notes]
 * @property {boolean} incorporated
 * @property {string} [incorporated_by]
 * @property {Date} [incorporated_at]
 * @property {Date} last_refreshed
 * @property {Date} created_at
 * @property {Date} updated_at
 *
 * @typedef {Object} EnrichmentProgress
 * @property {number} overall - Overall progress percentage (0-100).
 * @property {Record<IntelligenceType, boolean>} byType - Status of incorporation for each type.
 */

export class ThemeIntelligenceService {
  /**
   * Fetch all intelligence layers for a theme
   * @param {string} themeId
   * @param {string} brandId
   * @returns {Promise<ThemeIntelligence[]>}
   */
  static async getThemeIntelligence(themeId, brandId) {
    const { data, error } = await supabase
      .from('theme_intelligence')
      .select('*')
      .eq('theme_id', themeId)
      .eq('brand_id', brandId)
      .order('intelligence_type');

    if (error) throw error;
    
    // Map data and convert date strings to Date objects
    return (data || []).map(item => ({
      ...item,
      intelligence_type: item.intelligence_type,
      last_refreshed: new Date(item.last_refreshed),
      incorporated_at: item.incorporated_at ? new Date(item.incorporated_at) : undefined,
      created_at: new Date(item.created_at),
      updated_at: new Date(item.updated_at)
    }));
  }

  /**
   * Initialize intelligence layers for a new theme
   * @param {string} themeId
   * @param {string} brandId
   * @returns {Promise<void>}
   */
  static async initializeIntelligence(themeId, brandId) {
    /** @type {IntelligenceType[]} */
    const intelligenceTypes = ['brand', 'competitive', 'market', 'regulatory', 'public'];
    
    const insertData = intelligenceTypes.map(type => ({
      theme_id: themeId,
      brand_id: brandId,
      intelligence_type: type,
      intelligence_data: {},
      incorporated: false
    }));

    const { error } = await supabase
      .from('theme_intelligence')
      .insert(insertData);

    if (error) throw error;
  }

  /**
   * Fetch brand intelligence from brand_guidelines table
   * @param {string} brandId
   * @returns {Promise<any>}
   */
  static async fetchBrandIntelligence(brandId) {
    const { data, error } = await supabase
      .from('brand_guidelines')
      .select('*')
      .eq('brand_id', brandId)
      .maybeSingle();

    if (error) throw error;
    
    // Structure the raw data into a specific intelligence payload
    return data ? {
      brandVoice: data.tone_of_voice || {},
      tone: data.tone_of_voice || {},
      messagingFramework: data.messaging_framework || {},
      visualGuidelines: data.visual_guidelines || {},
      approvedTerminology: data.approved_terminology || [],
      prohibitedTerms: data.prohibited_terms || []
    } : {};
  }

  /**
   * Fetch competitive intelligence from competitive_landscape table
   * @param {string} brandId
   * @returns {Promise<any>}
   */
  static async fetchCompetitiveIntelligence(brandId) {
    const { data, error } = await supabase
      .from('competitive_landscape')
      .select('competitor_name, competitive_advantages, messaging_opportunities')
      .eq('brand_id', brandId);

    if (error) throw error;
    
    // Consolidate data from multiple competitor entries
    return {
      competitors: data || [],
      advantages: data?.flatMap(c => c.competitive_advantages?.advantages || []) || [],
      weaknesses: data?.flatMap(c => c.competitive_advantages?.weaknesses || []) || [],
      opportunities: data?.flatMap(c => c.messaging_opportunities || []) || []
    };
  }

  /**
   * Fetch market intelligence from market_positioning table
   * @param {string} brandId
   * @returns {Promise<any>}
   */
  static async fetchMarketIntelligence(brandId) {
    const { data, error } = await supabase
      .from('market_positioning')
      .select('*')
      .eq('brand_id', brandId);

    if (error) throw error;
    
    // Expecting one entry, use the first one if available
    const consolidated = data?.[0] || {};
    return {
      positioningStatement: consolidated.positioning_statement || '',
      leadershipClaims: consolidated.leadership_claims || [],
      differentiationPoints: consolidated.differentiation_points || [],
      competitiveAdvantages: consolidated.competitive_advantages || [],
      marketShare: consolidated.market_share_data || {},
      proofPoints: consolidated.proof_points || []
    };
  }

  /**
   * Fetch regulatory intelligence from regulatory_framework table
   * @param {string} brandId
   * @returns {Promise<any>}
   */
  static async fetchRegulatoryIntelligence(brandId) {
    const { data, error } = await supabase
      .from('regulatory_framework')
      .select('*')
      .eq('brand_id', brandId);

    if (error) throw error;
    
    // Expecting one entry, use the first one if available
    const consolidated = data?.[0] || {};
    return {
      requiredDisclaimers: consolidated.required_disclaimers || [],
      promotionalRestrictions: consolidated.promotional_restrictions || [],
      fairBalanceRequirements: consolidated.fair_balance_requirements || {},
      claimSubstantiation: consolidated.claim_substantiation || {},
      mlrRequirements: consolidated.mlr_requirements || {}
    };
  }

  /**
   * Fetch public domain intelligence from public_domain_insights table
   * @param {string} brandId
   * @returns {Promise<any>}
   */
  static async fetchPublicIntelligence(brandId) {
    const { data, error } = await supabase
      .from('public_domain_insights')
      .select('source_type, content, relevance_score')
      .eq('brand_id', brandId)
      .eq('status', 'reviewed') // Only fetch reviewed insights
      .order('relevance_score', { ascending: false })
      .limit(10);

    if (error) throw error;
    
    return {
      insights: data || [],
      // Categorize insights by source type for easier consumption
      recentTrends: data?.filter(i => i.source_type === 'trend') || [],
      competitorNews: data?.filter(i => i.source_type === 'competitor_news') || [],
      fdaUpdates: data?.filter(i => i.source_type === 'fda') || []
    };
  }

  /**
   * Refresh specific intelligence layer using an AI function.
   * @param {string} intelligenceId
   * @param {string} themeId
   * @param {string} brandId
   * @param {IntelligenceType} type
   * @returns {Promise<ThemeIntelligence>}
   */
  static async refreshIntelligence(intelligenceId, themeId, brandId, type) {
    // 1. Fetch theme and brand context required for the AI prompt
    const [{ data: theme, error: themeError }, { data: brand, error: brandError }] = await Promise.all([
      supabase.from('theme_library').select('*').eq('id', themeId).single(),
      supabase.from('brand_profiles').select('*').eq('id', brandId).single()
    ]);

    if (themeError) throw themeError;
    if (brandError) throw brandError;

    // 2. Call AI function to generate the new intelligence data
    const { data: aiResponse, error: aiError } = await supabase.functions.invoke(
      'theme-intelligence-analyzer',
      {
        body: {
          theme: {
            name: theme.name,
            description: theme.description,
            key_message: theme.key_message,
            call_to_action: theme.call_to_action,
            target_audience: theme.target_audience,
            category: theme.category,
            indication: theme.indication,
          },
          brandContext: {
            brand_name: brand.brand_name,
            therapeutic_area: brand.therapeutic_area,
            market: 'US' // Assuming US market for context generation
          },
          intelligenceType: type
        }
      }
    );

    if (aiError) throw aiError;

    const intelligenceData = aiResponse.intelligence;

    // 3. Update database with AI-generated intelligence
    const { data, error } = await supabase
      .from('theme_intelligence')
      .update({
        intelligence_data: intelligenceData,
        last_refreshed: new Date().toISOString()
      })
      .eq('id', intelligenceId)
      .select()
      .single();

    if (error) throw error;
    
    // Re-map the returned data to include proper Date objects
    return {
      ...data,
      intelligence_type: data.intelligence_type,
      last_refreshed: new Date(data.last_refreshed),
      incorporated_at: data.incorporated_at ? new Date(data.incorporated_at) : undefined,
      created_at: new Date(data.created_at),
      updated_at: new Date(data.updated_at)
    };
  }

  /**
   * Mark intelligence as incorporated and update overall theme progress.
   * @param {string} intelligenceId
   * @param {string} userId
   * @returns {Promise<void>}
   */
  static async markAsIncorporated(intelligenceId, userId) {
    // 1. Get the theme_id associated with this intelligence record
    const { data: intelligenceData, error: fetchError } = await supabase
      .from('theme_intelligence')
      .select('theme_id')
      .eq('id', intelligenceId)
      .single();

    if (fetchError) throw fetchError;
    
    const themeId = intelligenceData.theme_id;

    // 2. Update the intelligence record status
    const { error } = await supabase
      .from('theme_intelligence')
      .update({
        incorporated: true,
        incorporated_by: userId,
        incorporated_at: new Date().toISOString()
      })
      .eq('id', intelligenceId);

    if (error) throw error;

    // 3. Recalculate and update the overall progress in the theme_library
    const progress = await this.calculateEnrichmentProgress(themeId);
    const { error: updateError } = await supabase
      .from('theme_library')
      .update({ intelligence_progress: progress.overall })
      .eq('id', themeId);

    if (updateError) throw updateError;
  }

  /**
   * Add user note to intelligence
   * @param {string} intelligenceId
   * @param {string} note
   * @returns {Promise<void>}
   */
  static async addUserNote(intelligenceId, note) {
    const { error } = await supabase
      .from('theme_intelligence')
      .update({ user_notes: note })
      .eq('id', intelligenceId);

    if (error) throw error;
  }

  /**
   * Update core theme messaging fields based on incorporated intelligence.
   * @param {string} themeId
   * @param {Partial<ThemeLibraryEntry>} updates - Partial object of theme fields to update.
   * @returns {Promise<void>}
   */
  static async updateThemeMessaging(themeId, updates) {
    const dbUpdates = {};
    
    // Only apply updates for existing keys in the updates object
    if (updates.key_message) dbUpdates.key_message = updates.key_message;
    if (updates.call_to_action) dbUpdates.call_to_action = updates.call_to_action;
    if (updates.messaging_framework) dbUpdates.messaging_framework = updates.messaging_framework;
    if (updates.content_suggestions) dbUpdates.content_suggestions = updates.content_suggestions;

    const { error } = await supabase
      .from('theme_library')
      .update(dbUpdates)
      .eq('id', themeId);

    if (error) throw error;
  }

  /**
   * Calculate enrichment progress based on the five intelligence types.
   * @param {string} themeId
   * @returns {Promise<EnrichmentProgress>}
   */
  static async calculateEnrichmentProgress(themeId) {
    const { data, error } = await supabase
      .from('theme_intelligence')
      .select('intelligence_type, incorporated')
      .eq('theme_id', themeId);

    if (error) throw error;

    /** @type {Record<IntelligenceType, boolean>} */
    const byType = {
      brand: false,
      competitive: false,
      market: false,
      regulatory: false,
      public: false
    };

    let incorporatedCount = 0;
    
    (data || []).forEach(item => {
      byType[item.intelligence_type] = item.incorporated;
      if (item.incorporated) incorporatedCount++;
    });

    // 5 is the fixed number of intelligence types
    const overall = Math.round((incorporatedCount / 5) * 100);

    return { overall, byType };
  }

  /**
   * Approve theme for use, setting status and final progress.
   * @param {string} themeId
   * @param {string} userId
   * @returns {Promise<void>}
   */
  static async approveTheme(themeId, userId) {
    // Ensure progress is current before approval
    const progress = await this.calculateEnrichmentProgress(themeId);

    const { error } = await supabase
      .from('theme_library')
      .update({
        enrichment_status: 'ready-for-use',
        approved_at: new Date().toISOString(),
        approved_by: userId,
        intelligence_progress: progress.overall
      })
      .eq('id', themeId);

    if (error) throw error;
  }

  /**
   * Update theme enrichment status
   * @param {string} themeId
   * @param {'generated' | 'ready-for-use'} status
   * @returns {Promise<void>}
   */
  static async updateEnrichmentStatus(themeId, status) {
    const { error } = await supabase
      .from('theme_library')
      .update({ enrichment_status: status })
      .eq('id', themeId);

    if (error) throw error;
  }
}