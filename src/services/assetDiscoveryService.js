import { supabase } from '@/integrations/supabase/client';

import { isMarketSupported, SUPPORTED_MARKET_CODES, SUPPORTED_LANGUAGES } from '@/config/localizationConfig';

export 
export 
export 
export class AssetDiscoveryService {
  static async discoverAssets(brandId, filters?) {
    try {
      // Get all content assets for the brand with proper joins
      let query = supabase
        .from('content_assets')
        .select(`
          *,
          content_projects!inner(brand_id, therapeutic_area, market, project_name)
        `)
        .eq('content_projects.brand_id', brandId)
        .in('status', ['approved', 'completed']);

      // Apply filters
      if (filters?.therapeuticArea) {
        query = query.eq('content_projects.therapeutic_area', filters.therapeuticArea);
      }
      
      if (filters?.assetType) {
        query = query.eq('asset_type', filters.assetType);
      }

      if (filters?.searchQuery) {
        query = query.or(`asset_name.ilike.%${filters.searchQuery}%,primary_content->>'headline'.ilike.%${filters.searchQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Enhance assets with metrics
      const enhancedAssets = await Promise.all(
        (assets || []).map(async (asset) => {
          const reusabilityScore = this.calculateReusabilityScore(asset);
          const marketCoverage = await this.getMarketCoverage(asset.id);
          const brandConsistencyScore = await this.getBrandConsistencyScore(asset);
          const mlrComplianceStatus = await this.getMLRComplianceStatus(asset);
          const culturalAdaptationNeeds = this.assessCulturalAdaptationNeeds(asset);

          return {
            ...asset,
            name.asset_name,
            source_module.determineSourceModule(asset),
            project_name.isArray(asset.content_projects) ? asset.content_projects[0]?.project_name : 'Demo Project',
            metadata.metadata as Record || {},
            reusabilityScore,
            marketCoverage,
            brandConsistencyScore,
            mlrComplianceStatus,
            culturalAdaptationNeeds
          };
        })
      );

      // Apply reusability filter
      if (filters?.reusabilityScore) {
        return enhancedAssets.filter(asset => asset.reusabilityScore >= filters.reusabilityScore) as any;
      }

      return enhancedAssets as any;
    } catch (error) {
      console.error('Error discovering assets:', error);
      return [];
    }
  }

  static async adaptAssetForMarket(
    assetId, 
    targetMarkets, 
    targetLanguages
  ) {
    try {
      // Validate that all target markets are supported
      const unsupportedMarkets = targetMarkets.filter(market => {
        // Convert market name to market code for validation
        const marketCode = this.getMarketCodeFromName(market);
        return !isMarketSupported(marketCode);
      });

      if (unsupportedMarkets.length > 0) {
        throw new Error(`Unsupported markets selected: ${unsupportedMarkets.join(', ')}. Currently only Japanese and Chinese translations are supported.`);
      }

      // Validate that all target languages are supported
      const unsupportedLanguages = targetLanguages.filter(lang => !SUPPORTED_LANGUAGES.includes(lang));
      if (unsupportedLanguages.length > 0) {
        throw new Error(`Unsupported languages selected: ${unsupportedLanguages.join(', ')}. Currently only Japanese and Chinese translations are supported.`);
      }
      // Get original asset
      const { data, error } = await supabase
        .from('content_assets')
        .select('*')
        .eq('id', assetId)
        .single();

      if (assetError) throw assetError;

      // Create localization project
      const { data, error } = await supabase
        .from('localization_projects')
        .insert({
          project_name: `${originalAsset.asset_name} - Market Adaptation`,
          description: `Localization of ${originalAsset.asset_name} for ${targetMarkets.join(', ')}`,
          source_content_id,
          source_content_type.asset_type,
          brand_id.brand_id,
          target_markets,
          target_languages,
          status: 'draft',
          priority_level: 'medium',
          estimated_timeline,
          content_readiness_score
        })
        .select()
        .single();

      if (projectError) throw projectError;

      // Create workflows for each market/language combination
      const workflows = [];
      for (const market of targetMarkets) {
        for (const language of targetLanguages) {
          workflows.push({
            localization_project_id.id,
            workflow_name: `${market} - ${language} Adaptation`,
            market,
            language,
            workflow_type: 'adaptation',
            workflow_status: 'pending',
            estimated_hours,
            estimated_cost,
            priority
          });
        }
      }

      await supabase.from('localization_workflows').insert(workflows);

      return project.id;
    } catch (error) {
      console.error('Error adapting asset for market:', error);
      throw error;
    }
  }

  private static calculateReusabilityScore(asset) {
    let score = 50; // Base score

    // Asset type scoring
    const assetTypeScores = {
      'email',
      'social_post',
      'banner_ad',
      'brochure',
      'presentation',
      'video',
      'interactive'
    };
    score += (assetTypeScores[asset.asset_type] - 50) || 0;

    // Status scoring
    if (asset.status === 'approved') score += 20;
    else if (asset.status === 'review') score += 10;

    // Content complexity scoring
    const content = asset.primary_content || {};
    if (content.headline && content.headline.length  70) score += 15;

    return Math.min(Math.max(score, 0), 100);
  }

  private static async getMarketCoverage(assetId) {
    // Try to find localization projects that reference this asset
    const { data } = await supabase
      .from('localization_projects')
      .select('target_markets, target_languages, status')
      .eq('source_content_id', assetId);

    const coverage = [];
    const commonMarkets = ['US', 'UK', 'Germany', 'France', 'Spain', 'Japan', 'China'];

    for (const market of commonMarkets) {
      const project = projects?.find(p => Array.isArray(p.target_markets) && p.target_markets.includes(market));
      coverage.push({
        market,
        language.getMarketLanguage(market),
        status ? (project.status === 'completed' ? 'localized' : 'in_progress') : 'not_started',
        lastUpdated ? new Date().toISOString() 
      });
    }

    return coverage;
  }

  private static async getBrandConsistencyScore(asset) {
    // Simulate brand consistency analysis
    let score = 75; // Base score

    // Check brand elements
    const content = asset.primary_content || {};
    if (content.brandElements?.logo) score += 10;
    if (content.brandElements?.colors) score += 10;
    if (content.tone === 'professional') score += 5;

    return Math.min(score, 100);
  }

  private static async getMLRComplianceStatus(asset), string>> {
    // Mock regulatory readiness status for different markets
    const status, string> = {};
    const markets = ['US', 'EU', 'UK', 'Germany', 'France', 'Japan'];
    
    for (const market of markets) {
      const rand = Math.random();
      if (rand > 0.6) status[market] = 'standard_review';
      else if (rand > 0.3) status[market] = 'enhanced_review';
      else status[market] = 'complex_review';
    }

    return status;
  }

  private static assessCulturalAdaptationNeeds(asset) {
    const needs = [];
    const assetType = asset.asset_type;

    if (assetType === 'video') {
      needs.push('Voice-over localization', 'Cultural context review');
    }
    if (assetType === 'banner_ad') {
      needs.push('Color scheme validation', 'Text length optimization');
    }
    if (asset.primary_content?.imagery) {
      needs.push('Cultural imagery review');
    }

    return needs;
  }

  private static determineSourceModule(asset) {
    if (asset.status === 'draft') return 'Content Studio';
    if (asset.compliance_notes) return 'Pre-MLR Companion';
    return 'Design Studio';
  }

  private static getMarketLanguage(market) {
    const marketLanguages = {
      'US': 'English (US)',
      'UK': 'English (UK)',
      'Germany': 'German',
      'France': 'French',
      'Spain': 'Spanish',
      'Japan': 'Japanese',
      'China': 'Chinese (Simplified)'
    };
    return marketLanguages[market] || 'English';
  }

  private static getMarketCodeFromName(marketName) {
    const nameToCode = {
      'Japan': 'JP',
      'China': 'CN',
      'Germany': 'DE',
      'France': 'FR',
      'Spain': 'ES',
      'Italy': 'IT',
      'Brazil': 'BR',
      'Mexico': 'MX',
      'Canada': 'CA',
      'Australia': 'AU'
    };
    return nameToCode[marketName as keyof typeof nameToCode] || marketName;
  }
}
export default AssetDiscoveryService;