
import { AssetDiscoverySimulation } from './assetDiscoverySimulation';
import { supabase } from '@/integrations/supabase/client';

// Immediate execution to populate missing assets
(async () => {
  console.log('🚀 Triggering Asset Discovery population for missing brands...');
  
  try {
    // Run the population
    await AssetDiscoverySimulation.populateDiscoveryAssets('all', 'demo-user');
    
    // Check results
    const { data: assetCounts } = await supabase
      .from('content_assets')
      .select(`
        brand_id,
        status,
        brand_profiles!inner(brand_name, company)
      `);
    
    console.log('📊 Asset population completed. Current status:');
    
    // Group and count by brand
    const brandCounts = assetCounts?.reduce((acc, asset) => {
      const profile = asset.brand_profiles;
      const brandName = `${profile.company} - ${profile.brand_name}`;
      
      if (!acc[brandName]) {
        acc[brandName] = { total: 0, approved: 0, draft: 0 };
      }
      
      acc[brandName].total++;
      if (asset.status === 'approved' || asset.status === 'completed') {
        acc[brandName].approved++;
      } else if (asset.status === 'draft') {
        acc[brandName].draft++;
      }
      
      return acc;
    }, {});
    
    Object.entries(brandCounts || {}).forEach(([brand, counts]) => {
      console.log(`  ${brand}: ${counts.approved} approved, ${counts.draft} draft (${counts.total} total)`);
    });
    
  } catch (error) {
    console.error('❌ Asset population failed:', error);
  }
})();