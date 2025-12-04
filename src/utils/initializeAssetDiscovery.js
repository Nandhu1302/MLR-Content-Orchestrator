
import { AssetDiscoverySimulation } from './assetDiscoverySimulation';
import { LocalizationSampleDataService } from './localizationSampleData';
import { supabase } from '@/integrations/supabase/client';

export const initializeAssetDiscoveryDemo = async (brandId = 'all', userId = 'demo-user') => {
  try {
    console.log('🚀 Initializing comprehensive multi-brand Asset Discovery demo data...');
    
    // Generate valid UUID for demo user
    const validUserId = userId === 'demo-user' ? crypto.randomUUID() : userId;
    
    // 1. Create rich asset discovery data for ALL brands (ignoring brandId parameter)
    await AssetDiscoverySimulation.populateDiscoveryAssets('all-brands', validUserId);
    
    // 2. Create supporting localization data for all brands
    const { data: brands } = await supabase.from('brand_profiles').select('id');
    if (brands && brands.length > 0) {
      for (const brand of brands) {
        await LocalizationSampleDataService.initializeSampleData(brand.id, validUserId);
        await LocalizationSampleDataService.createSampleProject(brand.id, validUserId);
      }
    }
    
    console.log('✅ Comprehensive multi-brand Asset Discovery demo data initialized successfully');
    
    return {
      success: true,
      message: `Demo data created successfully for ${brands?.length || 0} brands`
    };
  } catch (error) {
    console.error('❌ Failed to initialize Asset Discovery demo data:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

export const getAssetDiscoveryStats = () => {
  return {
    totalAssets: 120, // ~15-20 assets per brand × 7 brands
    approvedAssets: 120, // All assets are approved
    therapeuticAreas: ['Oncology', 'Respiratory', 'Cardiovascular'],
    assetTypes: ['mass-email', 'digital-sales-aid', 'patient-brochure', 'digital-tool', 'landing-page', 'presentation', 'video-script'],
    markets: ['US', 'EU', 'Japan', 'China', 'Germany', 'France', 'Canada', 'Australia', 'South Korea', 'Brazil'],
    averageReusabilityScore: 87,
    crossMarketProjects: 28, // ~4 localization projects per brand × 7 brands
    brands: ['AstraZeneca - Tagrisso', 'Bayer - Xarelto', 'Boehringer Ingelheim - Jardiance', 'Boehringer Ingelheim - Pradaxa', 'Boehringer Ingelheim - Ofev', 'Merck KGaA - Erbitux', 'Novartis - Entresto']
  };
};