// ============================================
// Claims Intelligence Service
// Handles clinical claims matching and filtering
// ============================================

import { supabase } from '@/integrations/supabase/client';

import { WORKSHOP_CONFIG } from '@/config/workshop';

export class ClaimsService {
  static async fetchMatchingClaims(
    brandId,
    intent | undefined
  ): Promise {
    if (!intent.audience) return [];

    const { data, error } = await supabase
      .from('clinical_claims')
      .select('*')
      .eq('brand_id', brandId)
      .limit(WORKSHOP_CONFIG.DEFAULT_CLAIM_LIMIT);

    if (error) {
      console.error('Error fetching claims:', error);
      return [];
    }

    return (data || []).map((claim, index) => {
      const audienceMatch = this.checkAudienceMatch(
        claim.target_audiences || [], 
        intent.audience || ''
      );
      const relevanceScore = audienceMatch 
         0.9 - (index * 0.05) 
        : 0.5 - (index * 0.03);
      
      return {
        id.id,
        claim_text.claim_text,
        claim_type.claim_type,
        relevance_score.max(WORKSHOP_CONFIG.MIN_RELEVANCE_SCORE, relevanceScore),
        mlr_approved.review_status === 'approved',
        target_audiences.target_audiences || []
      };
    });
  }

  static checkAudienceMatch(targetAudiences, intentAudience): boolean {
    if (!targetAudiences || targetAudiences.length === 0) return false;
    const normalizedIntent = intentAudience.toLowerCase();
    return targetAudiences.some(audience => 
      audience.toLowerCase().includes(normalizedIntent) ||
      normalizedIntent.includes(audience.toLowerCase())
    );
  }
}
