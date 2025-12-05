import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { IntelligenceLoggingService } from '@/services/intelligenceLoggingService';
import { ContentIntelligenceService } from '@/services/contentIntelligenceService';

// The TypeScript interfaces are removed in the JavaScript version.

export function useContentPerformanceTracking() {
  const [isTracking, setIsTracking] = useState(false);

  /**
   * Track performance metrics for content and attribute to intelligence sources
   */
  const trackPerformance = async (
    contentId,
    brandId,
    metrics,
    intelligenceAttribution
  ) => {
    setIsTracking(true);
    try {
      // Insert performance attribution
      const { error: perfError } = await supabase
        .from('content_performance_attribution')
        .insert([{
          content_registry_id: contentId,
          brand_id: brandId,
          engagement_rate: metrics.engagement_rate,
          conversion_rate: metrics.conversion_rate,
          channel: metrics.channel,
          audience_segment: metrics.audience_segment,
          source_system: 'content_tracking'
        }]); // Removed 'as any' type cast

      if (perfError) throw perfError;

      // Update usage counts for intelligence items
      if (intelligenceAttribution.claim_ids?.length) {
        for (const claimId of intelligenceAttribution.claim_ids) {
          await IntelligenceLoggingService.trackClaimUsage(brandId, claimId, {
            assetId: contentId,
            usageContext: 'performance_tracking'
          });
        }
      }

      if (intelligenceAttribution.pattern_ids?.length) {
        for (const patternId of intelligenceAttribution.pattern_ids) {
          await IntelligenceLoggingService.trackPatternUsage(brandId, patternId, {
            assetId: contentId,
            usageContext: 'performance_tracking'
          });
        }
      }

      // Trigger success pattern analysis if enough data
      // This is wrapped in setTimeout to allow the main function to complete quickly
      setTimeout(async () => {
        try {
          await ContentIntelligenceService.buildSuccessPatterns(brandId);
          await ContentIntelligenceService.buildContentRelationships(brandId);
        } catch (error) {
          console.error('Background pattern analysis failed:', error);
        }
      }, 1000);

      console.log('✅ Performance tracking complete:', {
        contentId,
        metrics,
        intelligenceAttribution
      });
    } catch (error) {
      console.error('❌ Performance tracking failed:', error);
      throw error;
    } finally {
      setIsTracking(false);
    }
  };

  /**
   * Get performance prediction for content based on intelligence used
   */
  const predictPerformance = async (
    brandId,
    intelligenceAttribution
  ) => {
    try {
      const { data, error } = await supabase
        .from('performance_predictions')
        .select('*')
        .eq('brand_id', brandId)
        // Note: The .contains() filter relies on the database column being a JSONB type
        // and expecting a JSON string that matches the structure.
        .contains('intelligence_combination', JSON.stringify(intelligenceAttribution))
        .order('confidence_score', { ascending: false })
        .limit(1)
        .single();

      // PGRST116 is the PostgREST error code for "No rows found" from .single()
      if (error && error.code !== 'PGRST116') throw error;

      return data || {
        predicted_engagement_rate: null,
        predicted_conversion_rate: null,
        confidence_score: 0,
        factors: []
      };
    } catch (error) {
      console.error('Performance prediction failed:', error);
      return null;
    }
  };

  return {
    trackPerformance,
    predictPerformance,
    isTracking
  };
}