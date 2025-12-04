
import { SuccessPatternDetector } from '@/services/successPatternDetector';
import { supabase } from '@/integrations/supabase/client';

/**
 * Utility to run success pattern detection for a brand
 * This analyzes campaign performance data and extracts winning patterns
 */
export async function runSuccessPatternDetection(brandId) {
  console.log('🔍 Starting success pattern detection for brand:', brandId);
  
  try {
    // Run full pattern detection
    const patterns = await SuccessPatternDetector.runPatternDetection(brandId);
    
    console.log(`✅ Pattern detection complete. Generated ${patterns.length} patterns`);
    
    return {
      success: true,
      patternsGenerated: patterns.length,
      patterns
    };
  } catch (error) {
    console.error('❌ Error running pattern detection:', error);
    return {
      success: false,
      patternsGenerated: 0,
      patterns: [],
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Get current success patterns for a brand
 */
export async function getSuccessPatterns(brandId) {
  return SuccessPatternDetector.getValidatedPatterns(brandId);
}

/**
 * Check if pattern detection should be re-run
 * Returns true if patterns are stale or missing
 */
export async function shouldRunPatternDetection(brandId) {
  const { data: patterns, error } = await supabase
    .from('content_success_patterns')
    .select('id, updated_at')
    .eq('brand_id', brandId)
    .order('updated_at', { ascending: false })
    .limit(1);
  
  if (error || !patterns || patterns.length === 0) {
    // No patterns exist - should run
    return true;
  }
  
  // Check if patterns are older than 7 days
  const lastUpdate = new Date(patterns[0].updated_at);
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  
  return lastUpdate < sevenDaysAgo;
}