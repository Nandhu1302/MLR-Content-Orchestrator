import { useState, useEffect, useCallback } from 'react';
import { useBrand } from '@/contexts/BrandContext';
import {
  EnhancedGuardrailsService
} from '@/services/enhancedGuardrailsService';

export const useEnhancedGuardrails = ({
  market = 'US',
  audienceType
} = {}) => {
  const { selectedBrand } = useBrand();

  // State management
  const [brandVision, setBrandVision] = useState(null);
  const [competitiveIntelligence, setCompetitiveIntelligence] = useState([]);
  const [regulatoryFramework, setRegulatoryFramework] = useState(null);
  const [audienceSegments, setAudienceSegments] = useState([]);
  const [marketPositioning, setMarketPositioning] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load all comprehensive guardrails data
  const loadEnhancedGuardrails = useCallback(async () => {
    if (!selectedBrand?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      const [vision, competitive, regulatory, audience, positioning] = await Promise.all([
        EnhancedGuardrailsService.getBrandVision(selectedBrand.id),
        EnhancedGuardrailsService.getCompetitiveIntelligence(selectedBrand.id),
        EnhancedGuardrailsService.getRegulatoryFramework(selectedBrand.id, market),
        EnhancedGuardrailsService.getAudienceSegments(selectedBrand.id, audienceType),
        EnhancedGuardrailsService.getMarketPositioning(selectedBrand.id, market)
      ]);

      setBrandVision(vision);
      setCompetitiveIntelligence(competitive);
      setRegulatoryFramework(regulatory);
      setAudienceSegments(audience);
      setMarketPositioning(positioning);
    } catch (err) {
      console.error('Error loading enhanced guardrails:', err);
      setError('Failed to load comprehensive guardrails data');
    } finally {
      setIsLoading(false);
    }
  }, [selectedBrand?.id, market, audienceType]);

  // Enhanced content compliance check
  const checkEnhancedCompliance = useCallback(async (
    content,
    context = {}
  ) => {
    if (!selectedBrand?.id) return null;

    try {
      const compliance = await EnhancedGuardrailsService.checkEnhancedContentCompliance(
        content,
        selectedBrand.id,
        {
          market: market,
          therapeutic_area: selectedBrand.therapeutic_area,
          ...context
        }
      );

      // Log the compliance check for audit trail
      await EnhancedGuardrailsService.logAuditAction(
        'content_compliance_check',
        'content_analysis',
        `${selectedBrand.id}-${Date.now()}`,
        { content: content.substring(0, 100) + '...' },
        { compliance_score: compliance.guideline_adherence },
        selectedBrand.id
      );

      return compliance;
    } catch (err) {
      console.error('Error checking enhanced compliance:', err);
      return null;
    }
  }, [selectedBrand?.id, market]);

  // Get competitive guidance
  const getCompetitiveGuidance = useCallback(async () => {
    if (!selectedBrand?.id) return null;

    try {
      return await EnhancedGuardrailsService.getCompetitiveGuidance(selectedBrand.id);
    } catch (err) {
      console.error('Error getting competitive guidance:', err);
      return null;
    }
  }, [selectedBrand?.id]);

  // Get regulatory requirements for content type
  const getRegulatoryRequirements = useCallback((contentType) => {
    if (!regulatoryFramework) return null;

    const requirements = {
      disclaimers: regulatoryFramework.required_disclaimers,
      restrictions: regulatoryFramework.promotional_restrictions,
      fairBalance: regulatoryFramework.fair_balance_requirements,
      mlrRequirements: regulatoryFramework.mlr_requirements
    };

    // Add content-type specific requirements
    if (contentType === 'advertisement' && regulatoryFramework.promotional_restrictions) {
      requirements.restrictions = [
        ...requirements.restrictions,
        'All advertisements must include fair balance',
        'DTC advertising restrictions may apply'
      ];
    }

    if (contentType === 'email' && regulatoryFramework.mlr_requirements) {
      requirements.mlrRequirements = {
        ...requirements.mlrRequirements,
        review_required: true,
        approval_timeline: '48 hours for email communications'
      };
    }

    return requirements;
  }, [regulatoryFramework]);

  // Get audience-specific messaging guidance
  const getAudienceGuidance = useCallback((targetAudience) => {
    const relevantSegment = audienceSegments.find(
      segment => segment.segment_type === targetAudience
    );

    if (!relevantSegment) return null;

    return {
      communicationPreferences: relevantSegment.communication_preferences,
      messagingPreferences: relevantSegment.messaging_preferences,
      trustFactors: relevantSegment.trust_factors,
      motivations: relevantSegment.motivations,
      barriers: relevantSegment.barriers_to_engagement,
      channelPreferences: relevantSegment.channel_preferences
    };
  }, [audienceSegments]);

  // Get brand voice guidelines
  const getBrandVoiceGuidelines = useCallback(() => {
    if (!brandVision) return null;

    return {
      coreValues: brandVision.core_values,
      personality: brandVision.brand_personality,
      brandPromise: brandVision.brand_promise,
      emotionalConnection: brandVision.emotional_connection,
      positioningStatement: brandVision.positioning_statement,
      targetPerception: brandVision.target_perception
    };
  }, [brandVision]);

  // Get competitive differentiation points
  const getCompetitiveDifferentiation = useCallback(() => {
    if (!competitiveIntelligence.length) return null;

    const allAdvantages = competitiveIntelligence.flatMap(c => c.competitive_advantages);
    const topThreats = competitiveIntelligence
      .filter(c => c.threat_level === 'high' || c.threat_level === 'critical')
      .slice(0, 3);
    const avoidMentions = topThreats.map(t => t.competitor_name);

    return {
      competitiveAdvantages: [...new Set(allAdvantages)],
      topThreats: topThreats,
      avoidMentioning: avoidMentions,
      responseStrategies: competitiveIntelligence
        .map(c => c.response_strategy)
        .filter(Boolean)
    };
  }, [competitiveIntelligence]);

  // Load data when dependencies change
  useEffect(() => {
    loadEnhancedGuardrails();
  }, [loadEnhancedGuardrails]);

  // Derived state for quick access
  const hasComprehensiveData = !!(
    brandVision ||
    competitiveIntelligence.length ||
    regulatoryFramework ||
    audienceSegments.length ||
    marketPositioning
  );

  const criticalThreats = competitiveIntelligence.filter(
    c => c.threat_level === 'critical'
  ).length;

  const regulatoryComplexity = regulatoryFramework?.required_disclaimers?.length || 0;

  const audienceSegmentCount = audienceSegments.length;

  return {
    // Data state
    brandVision,
    competitiveIntelligence,
    regulatoryFramework,
    audienceSegments,
    marketPositioning,
    isLoading,
    error,
    hasComprehensiveData,

    // Actions
    loadEnhancedGuardrails,
    checkEnhancedCompliance,
    getCompetitiveGuidance,

    // Helper functions
    getRegulatoryRequirements,
    getAudienceGuidance,
    getBrandVoiceGuidelines,
    getCompetitiveDifferentiation,

    // Quick access properties
    criticalThreats,
    regulatoryComplexity,
    audienceSegmentCount,
    
    // Convenience flags
    hasBrandVision: !!brandVision,
    hasCompetitiveData: competitiveIntelligence.length > 0,
    hasRegulatoryFramework: !!regulatoryFramework,
    hasAudienceSegments: audienceSegments.length > 0,
    hasMarketPositioning: !!marketPositioning
  };
};
