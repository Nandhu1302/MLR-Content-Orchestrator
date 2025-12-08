import { supabase } from "../integrations/supabase/client.js";

/**
 * Service for seeding intelligence and configuration tables
 * Simplified to match actual database schemas
 */
export class IntelligenceSeedService {
  /**
   * Seed Public Domain Insights
   * @param {string} brandId
   * @returns {Promise<void>}
   */
  static async seedPublicDomainInsights(brandId) {
    console.log(`🔍 Seeding public domain insights for brand ${brandId}...`);

    const insights = [
      {
        brand_id: brandId,
        source_type: 'regulatory',
        source_name: 'FDA Press Release',
        title: 'Competitor X Receives FDA Approval for New Indication',
        summary: 'FDA approved Competitor X for treatment-naive patients, expanding their market opportunity.',
        full_content: 'FDA approved Competitor X for treatment-naive patients, expanding their market opportunity and creating new competitive pressure in the market.',
        source_url: 'https://www.fda.gov/news-events/press-announcements',
        publish_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        relevance_score: 85,
        key_findings: JSON.stringify(['New indication approved', 'Treatment-naive population']),
        discovered_at: new Date().toISOString(),
      },
      {
        brand_id: brandId,
        source_type: 'clinical',
        source_name: 'ClinicalTrials.gov',
        title: 'Phase 3 Trial Shows Strong Efficacy for Competitor Y',
        summary: 'Competitor Y announced 96% viral suppression at week 48 in treatment-naive patients.',
        full_content: 'Competitor Y announced 96% viral suppression at week 48 in treatment-naive patients, demonstrating strong clinical efficacy.',
        source_url: 'https://clinicaltrials.gov',
        publish_date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        relevance_score: 92,
        key_findings: JSON.stringify(['96% viral suppression', 'Week 48 results', 'Treatment-naive']),
        discovered_at: new Date().toISOString(),
      },
    ];

    const { error } = await supabase.from('public_domain_insights').insert(insights);

    if (error) {
        console.error('Error seeding public domain insights:', error);
    } else {
        console.log(`✓ Seeded ${insights.length} public domain insights`);
    }
  }

  /**
   * Seed Market Positioning - using simplified data that matches schema
   * @param {string} brandId
   * @returns {Promise<void>}
   */
  static async seedMarketPositioning(brandId) {
    console.log(`🎯 Seeding market positioning for brand ${brandId}...`);

    const positioning = [
      {
        brand_id: brandId,
        market: 'US',
        therapeutic_area: 'HIV',
        positioning_statement: 'Leading single-tablet regimen with superior efficacy and safety profile',
        clinical_evidence: {
          efficacy: '95% viral suppression at week 48',
          safety: 'Favorable safety profile',
          durability: 'Sustained efficacy through 96 weeks',
        },
        competitive_advantages: [
          'High genetic barrier to resistance',
          'Once-daily dosing for convenience',
          'Minimal drug interactions',
          'Superior renal safety',
        ],
        // Note: Array fields like this should align with the database schema for JSON/JSONB
        differentiation_points: [
          'Higher genetic barrier with clinical trial evidence',
          'Superior renal safety from post-marketing surveillance',
        ],
        messaging_hierarchy: {
          primary: 'Superior efficacy with excellent safety',
          secondary: 'Convenient dosing improves adherence',
          tertiary: 'High barrier to resistance protects effectiveness',
        },
        market_share_data: {
          current: 15.2,
          trend: 'growing',
        },
        updated_at: new Date().toISOString(),
      },
    ];

    const { error } = await supabase.from('market_positioning').insert(positioning);

    if (error) {
        console.error('Error seeding market positioning:', error);
    } else {
        console.log(`✓ Seeded ${positioning.length} market positioning records`);
    }
  }

  /**
   * Seed Competitive Intelligence Enriched
   * @param {string} brandId
   * @returns {Promise<void>}
   */
  static async seedCompetitiveIntelligenceEnriched(brandId) {
    console.log(`🏁 Seeding competitive intelligence for brand ${brandId}...`);

    const enriched = [
      {
        brand_id: brandId,
        competitor_name: 'Competitor X (Manufacturer A)',
        intelligence_type: 'market_data',
        title: 'New Fixed-Dose Combination Launch Imminent',
        content: 'Competitor X is launching a new FDC combining their NRTI with a novel integrase inhibitor. Expected launch Q4 2025.',
        threat_level: 'high',
        impact_assessment: 'Could capture 5-7% market share from existing STRs, particularly in treatment-naive segment.',
        recommended_actions: JSON.stringify([
          'Emphasize superior resistance barrier in promotional materials',
          'Launch HCP education campaign on long-term durability',
          'Consider patient assistance program enhancement',
        ]),
        source_url: 'https://investor-relations.competitor-x.com',
        source_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'active',
        discovered_at: new Date().toISOString(),
      },
      {
        brand_id: brandId,
        competitor_name: 'Competitor Y (Manufacturer B)',
        intelligence_type: 'market_data',
        title: 'Significant Rebate Increase to Gain Market Access',
        content: 'Competitor Y increased rebates by 12% to secure preferred tier placement with major PBMs.',
        threat_level: 'medium',
        impact_assessment: 'May improve competitor access, but could pressure industry pricing.',
        recommended_actions: JSON.stringify([
          'Monitor formulary positioning changes',
          'Emphasize value story beyond price',
          'Strengthen relationships with key payers',
        ]),
        source_date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'active',
        discovered_at: new Date().toISOString(),
      },
    ];

    const { error } = await supabase.from('competitive_intelligence_enriched').insert(enriched);

    if (error) {
        console.error('Error seeding competitive intelligence:', error);
    } else {
        console.log(`✓ Seeded ${enriched.length} competitive intelligence records`);
    }
  }

  /**
   * Seed Campaign Guardrails (Default Templates)
   * @param {string} brandId
   * @returns {Promise<void>}
   */
  static async seedCampaignGuardrails(brandId) {
    console.log(`🛡️ Seeding campaign guardrails for brand ${brandId}...`);

    // Get a sample campaign
    const { data: campaigns, error: campaignsError } = await supabase
      .from('content_registry')
      .select('id')
      .eq('brand_id', brandId)
      .eq('content_type', 'campaign')
      .limit(1);

    if (campaignsError) {
        console.error('Error fetching campaigns for guardrails:', campaignsError);
        return;
    }
    
    if (!campaigns || campaigns.length === 0) {
      console.log('No campaigns found to seed guardrails');
      return;
    }

    const guardrails = {
      brand_id: brandId,
      campaign_id: campaigns[0].id,
      inherits_from_brand: true,
      override_level: 'campaign',
      tone_overrides: JSON.stringify({
        primary_tone: 'professional',
        secondary_tones: ['empathetic', 'educational'],
        avoid_tones: ['promotional', 'alarmist'],
      }),
      message_priority_overrides: JSON.stringify([
        'Efficacy',
        'Safety',
        'Convenience',
      ]),
      regulatory_additions: JSON.stringify({
        required_disclaimers: ['Important Safety Information', 'Indication'],
        fair_balance: true,
        references_inline: true,
      }),
      created_at: new Date().toISOString(),
    };

    const { error: guardrailsError } = await supabase.from('campaign_guardrails').insert(guardrails);

    if (guardrailsError) {
        console.error('Error seeding campaign guardrails:', guardrailsError);
    } else {
        console.log(`✓ Seeded campaign guardrails`);
    }
  }
}