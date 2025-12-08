// ============================================
// Success Patterns Service
// Handles content success patterns and A/B test results
// ============================================

import { supabase } from '@/integrations/supabase/client';


export class PatternsService {
  static async fetchSuccessPatterns(
    intent
  ) {
    const { data, error } = await supabase
      .from('content_success_patterns')
      .select('*')
      .order('confidence_score', { ascending: false })
      .limit(3);

    if (error) {
      console.error('Error fetching success patterns:', error);
      return [];
    }

    return (data || []).map(pattern => {
      const abTestResults = pattern.a_b_test_results;
      let abTestWinner;
      let abTestLift;
      
      if (abTestResults && typeof abTestResults === 'object') {
        abTestWinner = abTestResults.winner;
        abTestLift = abTestResults.lift;
      }

      return {
        id: pattern.id,
        campaign_type: pattern.pattern_type || 'General',
        success_rate: pattern.confidence_score || 0,
        avg_engagement_rate: pattern.avg_performance_lift || 0,
        sample_size: pattern.sample_size,
        key_success_factors: pattern.key_success_factors || [],
        anti_patterns: pattern.anti_patterns || [],
        ab_test_winner: abTestWinner,
        ab_test_lift: abTestLift
      };
    });
  }
}