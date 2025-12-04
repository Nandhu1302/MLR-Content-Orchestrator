
import { initializeAssetDiscoveryDemo } from './initializeAssetDiscovery';

// Utility to populate comprehensive Asset Discovery data
export const populateAssetDiscoveryData = async () => {
  console.log('🚀 Starting comprehensive Asset Discovery data population...');
  
  try {
    // Run the comprehensive initialization for all brands
    const result = await initializeAssetDiscoveryDemo('all', 'demo-user');
    
    if (result.success) {
      console.log('✅ Asset Discovery data population completed successfully');
      console.log(`📊 Result: ${result.message}`);
      return { success: true, message: result.message };
    } else {
      console.error('❌ Asset Discovery data population failed:', result.error);
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error('❌ Unexpected error during Asset Discovery population:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};

// Run immediately when imported (for testing/debugging)
if (typeof window !== 'undefined') {
  // Only run in browser environment
  populateAssetDiscoveryData().then(result => {
    console.log('Asset Discovery Population Result:', result);
  });
}