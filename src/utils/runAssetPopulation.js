
import { AssetDiscoverySimulation } from './assetDiscoverySimulation';

// Simple runner to populate asset discovery data
export const runAssetPopulation = async () => {
  console.log('🚀 Running Asset Discovery data population...');
  
  try {
    await AssetDiscoverySimulation.populateDiscoveryAssets('all', 'demo-user');
    console.log('✅ Asset population completed successfully!');
    
    // Verify results
    const { supabase } = await import('@/integrations/supabase/client');
    const { data: assets } = await supabase
      .from('content_assets')
      .select(`
        brand_id,
        status,
        brand_profiles!inner(brand_name, company)
      `);
    
    // Group by brand
    const brandAssets = assets?.reduce((acc, asset) => {
      const brandData = asset.brand_profiles;
      if (brandData && 'brand_name' in brandData && 'company' in brandData) {
        const brandKey = `${brandData.company} - ${brandData.brand_name}`;
        acc[brandKey] = (acc[brandKey] || 0) + 1;
      }
      return acc;
    }, {});
    
    console.log('📊 Asset count by brand:', brandAssets);
    
  } catch (error) {
    console.error('❌ Asset population failed:', error);
  }
};

// Auto-run in development
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  runAssetPopulation();
}
