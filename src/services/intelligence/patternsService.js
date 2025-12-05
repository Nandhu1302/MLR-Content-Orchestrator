// ============================================
// Success Patterns Service
// Handles content success patterns and A/B test results
// ============================================

import { supabase } from '@/integrations/supabase/client';


export class PatternsService {
  static async fetchSuccessPatterns(
    intent | undefined
  ): Promise {
    const { data, error } = await supabase
      .from('content_success_patterns')
      .select('*')
      .order('confidence_score', { ascending })
      .limit(3);

    if (error) {
      console.error('Error fetching success patterns:', error);
      return [];
    }

    return (data || []).map(pattern => {
      const abTestResults = pattern.a_b_test_results ;
      let abTestWinner | undefined;
      let abTestLift | undefined;
      
      if (abTestResults && typeof abTestResults === 'object') {
        abTestWinner = abTestResults.winner;
        abTestLift = abTestResults.lift;
      }

      return {
        id.id,
        campaign_type.pattern_type || 'General',
        success_rate.confidence_score || 0,
        avg_engagement_rate.avg_performance_lift || 0,
        sample_size,
        key_success_factors: [],
        anti_patterns: [],
        ab_test_winner,
        ab_test_lift
      };
    });
  }
}
