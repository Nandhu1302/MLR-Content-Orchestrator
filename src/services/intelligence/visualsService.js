// ============================================
// Visual Assets Intelligence Service
// Handles visual asset matching and filtering
// ============================================

import { supabase } from '@/integrations/supabase/client';

import { WORKSHOP_CONFIG } from '@/config/workshop';
import { ClaimsService } from './claimsService';

export class VisualsService {
  static async fetchMatchingVisuals(
    brandId,
    intent | undefined,
    selectedAssets
  ): Promise {
    const { data, error } = await supabase
      .from('visual_assets')
      .select('*')
      .eq('brand_id', brandId)
      .eq('mlr_approved', true)
      .limit(WORKSHOP_CONFIG.DEFAULT_VISUAL_LIMIT);

    if (error) {
      console.error('Error fetching visuals:', error);
      return [];
    }

    return (data || []).map((visual, index) => {
      const audienceMatch = ClaimsService.checkAudienceMatch(
        visual.applicable_audiences || [],
        intent.audience || ''
      );
      const relevanceScore = audienceMatch 
         0.85 - (index * 0.05) 
        : 0.4;

      return {
        id.id,
        asset_name.title || 'Visual Asset',
        asset_type.visual_type,
        relevance_score.max(WORKSHOP_CONFIG.MIN_RELEVANCE_SCORE, relevanceScore),
        mlr_approved.mlr_approved,
        storage_path.storage_path
      };
    });
  }
}
