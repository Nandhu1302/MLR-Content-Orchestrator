import { supabase } from '@/integrations/supabase/client';

export class VariationGenerationService {
  /**
   * Generate multiple variations based on selected factors
   */
  static async generateVariations(
    baseAsset, // ContentAsset type from TS removed
    factorCombinations, // PersonalizationFactors[] type from TS removed
    context // context type from TS removed
  ) {
    const variations = [];

    for (const factors of factorCombinations) {
      // Call AI edge function to generate variation
      const { data, error } = await supabase.functions.invoke('generate-content-variation', {
        body: {
          baseContent: baseAsset.primary_content,
          assetType: baseAsset.asset_type,
          brandId: baseAsset.brand_id,
          personalizationFactors: factors,
          targetAudience: baseAsset.target_audience,
          context: {
            specialistType: context?.specialistType,
            specialistDisplayName: context?.specialistDisplayName,
            therapeuticArea: context?.therapeuticArea || baseAsset.intake_context?.therapeuticArea,
            indication: context?.indication || baseAsset.intake_context?.indication
          }
        }
      });

      if (error) {
        console.error('Variation generation failed:', error);
        continue;
      }

      variations.push({
        variation_name: this.generateVariationName(factors),
        content_data: data.generatedContent,
        personalization_factors: factors,
        predicted_performance: data.performancePrediction
      });
    }

    return variations;
  }

  /**
   * Generate human-readable variation name
   */
  static generateVariationName(factors) { // factors type from TS removed
    const parts = [];

    // Sub-segmentation naming
    if (factors.hcp_experience_level) {
      parts.push(`HCP_${factors.hcp_experience_level}`);
    }
    if (factors.hcp_practice_setting) {
      parts.push(factors.hcp_practice_setting);
    }
    if (factors.patient_disease_stage) {
      parts.push(`Patient_${factors.patient_disease_stage}`);
    }
    if (factors.patient_age_group) {
      parts.push(`Age_${factors.patient_age_group}`);
    }
    if (factors.patient_health_literacy) {
      parts.push(`Literacy_${factors.patient_health_literacy}`);
    }

    // Content optimization naming
    if (factors.content_optimization_type) {
      parts.push(`Test_${factors.content_optimization_type}`);
    }

    // Messaging emphasis
    if (factors.messaging_emphasis) {
      parts.push(`Msg_${factors.messaging_emphasis}`);
    }

    return parts.join('_') || 'Base_Variation';
  }

  /**
   * Predict variation performance
   */
  static async predictPerformance(
    content, // Record<string, any> type from TS removed
    factors, // PersonalizationFactors type from TS removed
    brandId // string type from TS removed
  ) {
    // Call AI edge function for performance prediction
    const { data } = await supabase.functions.invoke('predict-variation-performance', {
      body: {
        content,
        factors,
        brandId
      }
    });

    return data || {
      engagement_score: 70,
      compliance_score: 85,
      conversion_likelihood: 60,
      confidence_level: 75
    };
  }
}