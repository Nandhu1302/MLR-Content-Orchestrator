// Guardrails Service
import { supabase } from '../integrations/supabase/client';

export class GuardrailsService {

  /**
   * Auto-enrich guardrails with latest public domain intelligence
   * @param {string} brandId - The ID of the brand.
   * @returns {Promise<object>} Status object detailing insights applied and last enrichment time.
   */
  static async enrichGuardrailsWithIntelligence(brandId) {
    try {
      // Get fresh intelligence from the last 7 days
      const { data: insights, error } = await supabase
        .from('public_domain_insights')
        .select('*')
        .eq('brand_id', brandId)
        .gte('discovered_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('relevance_score', { ascending: false })
        .limit(20);

      if (error) throw error;

      if (!insights || insights.length === 0) {
        return { insights_applied: 0, last_enrichment: new Date().toISOString() };
      }

      // Get current guardrails
      const guardrails = await this.getGuardrails(brandId);
      if (!guardrails) {
        console.warn('No guardrails found to enrich');
        return { insights_applied: 0, last_enrichment: new Date().toISOString() };
      }

      // Merge intelligence into guardrails
      const enrichedData = this.mergeIntelligenceIntoGuardrails(guardrails, insights);

      // Update guardrails with enriched data
      const { error: updateError } = await supabase
        .from('brand_guidelines')
        .update({
          messaging_framework: enrichedData.messaging_framework,
          tone_of_voice: enrichedData.tone_of_voice,
          last_updated: new Date().toISOString(),
          // Access user ID from the response of auth.getUser()
          updated_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('brand_id', brandId);

      if (updateError) throw updateError;

      return {
        insights_applied: insights.length,
        last_enrichment: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error enriching guardrails:', error);
      return { insights_applied: 0, last_enrichment: new Date().toISOString() };
    }
  }

  /**
   * Get intelligence metadata for guardrails
   * @param {string} brandId - The ID of the brand.
   * @returns {Promise<object>} Metadata object.
   */
  static async getIntelligenceMetadata(brandId) {
    try {
      // Get total insights
      const { count: totalCount } = await supabase
        .from('public_domain_insights')
        .select('*', { count: 'exact', head: true })
        .eq('brand_id', brandId);

      // Get fresh insights (last 7 days)
      const { count: freshCount } = await supabase
        .from('public_domain_insights')
        .select('*', { count: 'exact', head: true })
        .eq('brand_id', brandId)
        .gte('discovered_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      // Get last refresh
      const { data: lastRefresh } = await supabase
        .from('intelligence_refresh_log')
        .select('completed_at')
        .eq('brand_id', brandId)
        .eq('status', 'completed')
        .order('completed_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      const lastRefreshDate = lastRefresh?.completed_at;
      const daysSinceRefresh = lastRefreshDate
        ? Math.floor((Date.now() - new Date(lastRefreshDate).getTime()) / (1000 * 60 * 60 * 24))
        : 999;

      const intelligenceStatus =
        !totalCount ? 'none' :
          daysSinceRefresh <= 7 ? 'fresh' :
            'stale';

      return {
        total_insights: totalCount || 0,
        fresh_insights: freshCount || 0,
        last_refresh: lastRefreshDate || null,
        intelligence_status: intelligenceStatus
      };
    } catch (error) {
      console.error('Error getting intelligence metadata:', error);
      return {
        total_insights: 0,
        fresh_insights: 0,
        last_refresh: null,
        intelligence_status: 'none'
      };
    }
  }

  /**
   * Merge public domain intelligence into guardrails data
   * @private
   * @param {object} guardrails - The existing guardrails data.
   * @param {Array<object>} insights - The new public domain insights.
   * @returns {object} The merged data structure.
   */
  static mergeIntelligenceIntoGuardrails(
    guardrails,
    insights
  ) {
    // These filtering variables were unused in the original TS code, 
    // but the filtering logic is kept here for completeness if needed later.
    // const competitiveInsights = insights.filter(i => i.source_type === 'competitive_intelligence');
    // const regulatoryInsights = insights.filter(i => i.source_type === 'regulatory');
    // const marketInsights = insights.filter(i => i.source_type === 'market_research');

    // Extract key findings from insights
    const newKeyMessages = insights
      .flatMap(i => i.key_findings || [])
      .filter((msg) => msg && msg.length > 10)
      .slice(0, 5);

    const existingMessages = guardrails.key_messages || [];
    const mergedMessages = [...new Set([...existingMessages, ...newKeyMessages])].slice(0, 8);

    return {
      messaging_framework: {
        key_pillars: mergedMessages,
        core_message: guardrails.market_positioning,
        intelligence_sources: insights.map(i => ({
          source: i.source_name,
          date: i.discovered_at,
          relevance: i.relevance_score
        }))
      },
      tone_of_voice: {
        primary: guardrails.tone_guidelines.primary,
        secondary: guardrails.tone_guidelines.secondary,
        characteristics: guardrails.tone_guidelines.descriptors,
        enriched_at: new Date().toISOString()
      }
    };
  }

  /**
   * Fetch complete guardrails data for a brand.
   * @param {string} brandId - The ID of the brand.
   * @returns {Promise<object | null>} BrandGuardrails object or null.
   */
  static async getGuardrails(brandId) {
    const { data, error } = await supabase
      .from('brand_guidelines')
      .select('*')
      .eq('brand_id', brandId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching guardrails:', error);
      return null;
    }

    if (!data) {
      console.warn(`No guardrails found for brand ${brandId}`);
      return null;
    }

    // Fetch competitive data separately
    const competitiveData = await this.getCompetitiveData(brandId);

    // Transform database data to guardrails format
    return this.transformToGuardrails(data, brandId, competitiveData);
  }

  /**
   * Fetch competitive landscape data.
   * @param {string} brandId - The ID of the brand.
   * @returns {Promise<Array<any>>} Array of competitive data entries.
   */
  static async getCompetitiveData(brandId) {
    const { data, error } = await supabase
      .from('competitive_landscape')
      .select('*')
      .eq('brand_id', brandId);

    if (error) {
      console.error('Error fetching competitive data:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Fetch and format competitor insights.
   * @param {string} brandId - The ID of the brand.
   * @returns {Promise<Array<object>>} Array of CompetitorInsight objects.
   */
  static async getCompetitorInsights(brandId) {
    const { data, error } = await supabase
      .from('competitive_landscape')
      .select('*')
      .eq('brand_id', brandId)
      .order('threat_level', { ascending: false });

    if (error) {
      console.error('Error fetching competitor insights:', error);
      return [];
    }

    return (data || []).map(item => ({
      competitor_name: item.competitor_name,
      threat_level: item.threat_level, // Assuming threat_level is 'low' | 'medium' | 'high'
      key_differentiators: item.key_differentiators || [],
      messaging_gaps: item.messaging_opportunities || [],
      competitive_advantages_vs_them: Array.isArray(item.competitive_advantages)
        ? item.competitive_advantages
        : [],
      market_share_context: typeof item.market_share_data === 'object' && item.market_share_data && 'summary' in item.market_share_data
        ? item.market_share_data.summary
        : undefined
    }));
  }

  /**
   * Determine the current status of the guardrails.
   * @param {object | null} guardrails - The BrandGuardrails object or null.
   * @returns {object} GuardrailsStatus object.
   */
  static getGuardrailsStatus(guardrails) {
    if (!guardrails) {
      return {
        is_stale: true,
        days_since_review: 999,
        needs_attention: true,
        staleness_level: 'critical'
      };
    }

    const lastReview = new Date(guardrails.last_reviewed);
    const now = new Date();
    const daysSinceReview = Math.floor((now.getTime() - lastReview.getTime()) / (1000 * 60 * 60 * 24));

    const threeMonthsInDays = 90;
    const warningThreshold = 75; // 2.5 months

    let staleness_level = 'fresh';
    if (daysSinceReview >= threeMonthsInDays) {
      staleness_level = 'critical';
    } else if (daysSinceReview >= warningThreshold) {
      staleness_level = 'warning';
    }

    return {
      is_stale: daysSinceReview >= threeMonthsInDays,
      days_since_review: daysSinceReview,
      needs_attention: daysSinceReview >= warningThreshold,
      staleness_level
    };
  }

  /**
   * Mark the guardrails as reviewed with the current date.
   * @param {string} brandId - The ID of the brand.
   * @returns {Promise<void>}
   */
  static async markAsReviewed(brandId) {
    const { error } = await supabase
      .from('brand_guidelines')
      .update({
        last_updated: new Date().toISOString(),
        last_reviewed: new Date().toISOString()
      })
      .eq('brand_id', brandId);

    if (error) {
      console.error('Error marking guardrails as reviewed:', error);
    }
  }

  /**
   * Checks content compliance against the brand guardrails.
   * @param {string} content - The content string to check.
   * @param {object} guardrails - The BrandGuardrails object.
   * @returns {object} ContentComplianceCheck object.
   */
  static checkContentCompliance(content, guardrails) {
    const suggestions = [];
    const warnings = [];
    let score = 100;

    // Check tone alignment
    const contentLower = content.toLowerCase();
    const toneMatch = guardrails.tone_guidelines.descriptors.some(descriptor =>
      contentLower.includes(descriptor.toLowerCase())
    );

    if (!toneMatch) {
      score -= 20;
      suggestions.push(`Consider incorporating tone elements: ${guardrails.tone_guidelines.descriptors.join(', ')}`);
    }

    // Check key message alignment
    const keyMessageAlignment = guardrails.key_messages.some(message =>
      // Checks if the content contains the first word of any key message for a quick alignment test
      contentLower.includes(message.toLowerCase().split(' ')[0])
    );

    if (!keyMessageAlignment) {
      score -= 15;
      suggestions.push('Consider including key brand messages in your content');
    }

    // Check don'ts
    const violatesDonts = guardrails.content_donts.some(dont =>
      contentLower.includes(dont.toLowerCase())
    );

    if (violatesDonts) {
      score -= 30;
      warnings.push('Content may violate brand guidelines (content don\'ts)');
    }

    // Check competitive advantages
    const usesCompetitiveAdvantages = guardrails.competitive_advantages.some(advantage =>
      // Checks if the content contains the first word of any competitive advantage
      contentLower.includes(advantage.toLowerCase().split(' ')[0])
    );

    if (!usesCompetitiveAdvantages) {
      score -= 10;
      suggestions.push('Consider highlighting competitive advantages');
    }

    return {
      guideline_adherence: Math.max(0, score),
      tone_match: toneMatch,
      key_message_alignment: keyMessageAlignment,
      competitive_positioning: usesCompetitiveAdvantages,
      regulatory_compliance: !violatesDonts, // Simplified check
      suggestions,
      warnings
    };
  }

  /**
   * Transforms raw database data and competitive data into the final BrandGuardrails format.
   * @private
   * @param {any} data - Raw data from brand_guidelines table.
   * @param {string} brandId - The ID of the brand.
   * @param {Array<any>} competitiveData - Data from competitive_landscape table.
   * @returns {object} BrandGuardrails object.
   */
  static transformToGuardrails(data, brandId, competitiveData = []) {
    // Extract competitive advantages and messaging gaps from competitive data
    const competitive_advantages = competitiveData.flatMap(comp =>
      Array.isArray(comp.competitive_advantages)
        ? comp.competitive_advantages
        : []
    );

    const competitor_messaging_gaps = competitiveData.flatMap(comp =>
      comp.messaging_opportunities || []
    );

    const competitive_threats = competitiveData
      .filter(comp => comp.threat_level === 'high')
      .map(comp => `${comp.competitor_name} - ${comp.threat_level} threat`);

    // Add basic content guidelines based on therapeutic area (simplified/placeholder)
    const content_dos = [
      'Use evidence-based language',
      'Include appropriate disclaimers',
      'Focus on patient benefits',
      'Maintain professional tone'
    ];

    const content_donts = [
      'Avoid unsupported claims',
      'Do not minimize side effects',
      'Avoid comparative claims without data',
      'Do not use emotional manipulation'
    ];

    // Add basic regulatory requirements (simplified/placeholder)
    const regulatory_musts = {
      disclaimers: ['Please see full prescribing information'],
      warnings: ['This medication requires medical supervision'],
      required_language: ['Consult your healthcare provider']
    };

    return {
      id: data.id || '',
      brand_id: brandId,
      key_messages: data.messaging_framework?.key_pillars || [],
      tone_guidelines: {
        primary: data.tone_of_voice?.primary || 'Professional and trustworthy',
        secondary: data.tone_of_voice?.secondary || 'Caring and supportive',
        descriptors: data.tone_of_voice?.characteristics || ['Professional', 'Trustworthy', 'Clear']
      },
      content_dos,
      content_donts,
      regulatory_musts,
      visual_standards: {
        logo_usage: data.logo_usage_rules || 'Maintain brand guidelines for logo usage',
        color_guidelines: data.visual_guidelines?.color_usage || 'Follow established color palette',
        imagery_style: data.imagery_style || 'Professional and appropriate imagery'
      },
      competitive_advantages: competitive_advantages.slice(0, 5), // Limit to top 5
      competitor_messaging_gaps,
      competitive_threats,
      market_positioning: data.messaging_framework?.core_message || 'Leading therapy in therapeutic area',
      competitive_constraints: [],
      last_reviewed: data.last_reviewed || data.last_updated || data.created_at,
      last_updated: data.last_updated || data.created_at,
      created_at: data.created_at || new Date().toISOString(),
      updated_by: data.updated_by
    };
  }
}