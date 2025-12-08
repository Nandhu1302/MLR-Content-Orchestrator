import { supabase } from '@/integrations/supabase/client';

// Assuming these constants are defined elsewhere and are correctly imported.
// Note: SUPPORTED_MARKET_CODES was imported but unused in the original code.
import { isMarketSupported, SUPPORTED_LANGUAGES } from '@/config/localizationConfig';

// Placeholder constants for missing variables used in adaptAssetForMarket
// These should ideally be passed in or calculated, but are set here to prevent runtime errors.
const estimated_timeline = '4 weeks';
const content_readiness_score = 85;
const estimated_hours = 40;
const estimated_cost = 5000;
const priority = 'medium';


export class AssetDiscoveryService {
  static async discoverAssets(brandId, filters) {
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
        // Corrected SQL string interpolation and removed invalid regex flag
        const search = filters.searchQuery;
        query = query.or(`asset_name.ilike.%${search}%,primary_content->>'headline'.ilike.%${search}%`);
      }

      const { data: assets, error } = await query;
      if (error) throw error;

      // Enhance assets with metrics
      const enhancedAssets = await Promise.all(
        (assets || []).map(async (asset) => {
          const reusabilityScore = this.calculateReusabilityScore(asset);
          const marketCoverage = await this.getMarketCoverage(asset.id);
          const brandConsistencyScore = await this.getBrandConsistencyScore(asset);
          const mlrComplianceStatus = await this.getMLRComplianceStatus(asset);
          const culturalAdaptationNeeds = this.assessCulturalAdaptationNeeds(asset);

          // Corrected object literal assignment (removed invalid dot notation)
          const projectName = Array.isArray(asset.content_projects) ? asset.content_projects[0]?.project_name : 'Demo Project';
          const metadata = asset.metadata || {}; // Safely default to empty object
          
          return {
            ...asset,
            name: asset.asset_name,
            source_module: this.determineSourceModule(asset),
            project_name: projectName,
            metadata: metadata,
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
        // Casting removed for pure JavaScript context
        return enhancedAssets.filter(asset => asset.reusabilityScore >= filters.reusabilityScore);
      }

      return enhancedAssets;
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
      const { data: originalAsset, error: assetError } = await supabase
        .from('content_assets')
        .select('*')
        .eq('id', assetId)
        .single();

      if (assetError) throw assetError;

      // Corrected variable names and object property assignment
      const source_content_id = originalAsset.id;
      const source_content_type = originalAsset.asset_type;
      const brand_id = originalAsset.brand_id;

      // Create localization project
      const { data: project, error: projectError } = await supabase
        .from('localization_projects')
        .insert({
          project_name: `${originalAsset.asset_name} - Market Adaptation`,
          description: `Localization of ${originalAsset.asset_name} for ${targetMarkets.join(', ')}`,
          source_content_id: source_content_id,
          source_content_type: source_content_type,
          brand_id: brand_id,
          target_markets: targetMarkets,
          target_languages: targetLanguages,
          status: 'draft',
          priority_level: 'medium',
          estimated_timeline: estimated_timeline, // Using placeholder constant
          content_readiness_score: content_readiness_score // Using placeholder constant
        })
        .select()
        .single();

      if (projectError) throw projectError;

      // Create workflows for each market/language combination
      const workflows = [];
      for (const market of targetMarkets) {
        for (const language of targetLanguages) {
          workflows.push({
            localization_project_id: project.id,
            workflow_name: `${market} - ${language} Adaptation`,
            market: market,
            language: language,
            workflow_type: 'adaptation',
            workflow_status: 'pending',
            estimated_hours: estimated_hours, // Using placeholder constant
            estimated_cost: estimated_cost, // Using placeholder constant
            priority: priority // Using placeholder constant
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

  static calculateReusabilityScore(asset) {
    let score = 50; // Base score

    // Asset type scoring (corrected object literal assignment)
    const assetTypeScores = {
      'email': 50,
      'social_post': 60,
      'banner_ad': 55,
      'brochure': 40,
      'presentation': 30,
      'video': 20,
      'interactive': 10
    };
    // Score based on a delta from 50 (removed subtraction of 50 in calculation)
    score += assetTypeScores[asset.asset_type] || 0; 
    score -= 50; // Apply the delta to the base score

    // Status scoring
    if (asset.status === 'approved') score += 20;
    else if (asset.status === 'review') score += 10;

    // Content complexity scoring (corrected logical check)
    const content = asset.primary_content || {};
    if (content.headline && content.headline.length > 70) score += 15;

    return Math.min(Math.max(score, 0), 100);
  }

  static async getMarketCoverage(assetId) {
    // Try to find localization projects that reference this asset
    const { data: projects, error } = await supabase
      .from('localization_projects')
      .select('target_markets, target_languages, status')
      .eq('source_content_id', assetId);

    if (error) console.error('Error fetching market coverage:', error);

    const coverage = [];
    const commonMarkets = ['US', 'UK', 'Germany', 'France', 'Spain', 'Japan', 'China'];

    for (const market of commonMarkets) {
      // Find the first project that targets this specific market
      const project = projects?.find(p => Array.isArray(p.target_markets) && p.target_markets.includes(market));
      
      // Corrected object literal assignment and conditional logic
      const status = project 
        ? (project.status === 'completed' ? 'localized' : 'in_progress') 
        : 'not_started';
        
      const lastUpdated = project ? new Date().toISOString() : null; // Simulated date based on project existence

      coverage.push({
        market: market,
        language: this.getMarketLanguage(market),
        status: status,
        lastUpdated: lastUpdated
      });
    }

    return coverage;
  }

  static async getBrandConsistencyScore(asset) {
    // Simulate brand consistency analysis
    let score = 75; // Base score

    // Check brand elements
    const content = asset.primary_content || {};
    if (content.brandElements?.logo) score += 10;
    if (content.brandElements?.colors) score += 10;
    if (content.tone === 'professional') score += 5;

    return Math.min(score, 100);
  }

  static async getMLRComplianceStatus(asset) { // Removed type-like annotation
    // Mock regulatory readiness status for different markets
    const status = {}; // Corrected object initialization
    const markets = ['US', 'EU', 'UK', 'Germany', 'France', 'Japan'];
    
    for (const market of markets) {
      const rand = Math.random();
      if (rand > 0.6) status[market] = 'standard_review';
      else if (rand > 0.3) status[market] = 'enhanced_review';
      else status[market] = 'complex_review';
    }

    return status;
  }

  static assessCulturalAdaptationNeeds(asset) {
    const needs = [];
    const assetType = asset.asset_type;

    if (assetType === 'video') {
      needs.push('Voice-over localization', 'Cultural context review');
    }
    if (assetType === 'banner_ad') {
      needs.push('Color scheme validation', 'Text length optimization');
    }
    // Corrected check for nested property
    if (asset.primary_content && asset.primary_content.imagery) {
      needs.push('Cultural imagery review');
    }

    return needs;
  }

  static determineSourceModule(asset) {
    if (asset.status === 'draft') return 'Content Studio';
    if (asset.compliance_notes) return 'Pre-MLR Companion';
    return 'Design Studio';
  }

  static getMarketLanguage(market) {
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

  static getMarketCodeFromName(marketName) {
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
    // Corrected type cast for pure JS compatibility
    return nameToCode[marketName] || marketName;
  }
}
export default AssetDiscoveryService;