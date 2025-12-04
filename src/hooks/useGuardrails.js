import { useState, useCallback, useMemo } from 'react';
import { useBrand } from '@/contexts/BrandContext';
import { GuardrailsService } from '@/services/guardrailsService';
import { PublicDomainIntelligenceService } from '@/services/publicDomainIntelligenceService';
import { useSmartQuery } from './useSmartQuery';

export const useGuardrails = () => {
  const { selectedBrand } = useBrand();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Use React Query for guardrails data
  const { data: guardrailsData, isLoading: guardrailsLoading, refetch: refetchGuardrails } = useSmartQuery(
    ['guardrails', selectedBrand?.id],
    async () => {
      if (!selectedBrand) return null;
      return await GuardrailsService.getGuardrails(selectedBrand.id);
    },
    { enabled: !!selectedBrand }
  );

  // Use React Query for competitor insights
  const { data: competitorInsights, isLoading: competitorLoading, refetch: refetchCompetitors } = useSmartQuery(
    ['competitor-insights', selectedBrand?.id],
    async () => {
      if (!selectedBrand) return [];
      return await GuardrailsService.getCompetitorInsights(selectedBrand.id);
    },
    { enabled: !!selectedBrand }
  );

  // Use React Query for intelligence metadata
  const { data: intelligenceMetadata, isLoading: intelligenceLoading, refetch: refetchIntelligence } = useSmartQuery(
    ['intelligence-metadata', selectedBrand?.id],
    async () => {
      if (!selectedBrand) return null;
      return await GuardrailsService.getIntelligenceMetadata(selectedBrand.id);
    },
    { enabled: !!selectedBrand }
  );

  // Memoize status calculation
  const status = useMemo(() => {
    if (!guardrailsData) return null;
    return GuardrailsService.getGuardrailsStatus(guardrailsData);
  }, [guardrailsData]);

  // Memoize loadGuardrails with useCallback
  const loadGuardrails = useCallback(async () => {
    await Promise.all([
      refetchGuardrails(),
      refetchCompetitors(),
      refetchIntelligence()
    ]);
  }, [refetchGuardrails, refetchCompetitors, refetchIntelligence]);

  const refreshIntelligence = async () => {
    if (!selectedBrand || isRefreshing) return;
    setIsRefreshing(true);
    try {
      await PublicDomainIntelligenceService.refreshBrandIntelligence(
        selectedBrand.id,
        'all'
      );
      await GuardrailsService.enrichGuardrailsWithIntelligence(selectedBrand.id);
      await loadGuardrails();
    } catch (error) {
      setIsRefreshing(false);
    } finally {
      setIsRefreshing(false);
    }
  };

  const checkContentCompliance = (content) => {
    if (!guardrailsData) return null;
    return GuardrailsService.checkContentCompliance(content, guardrailsData);
  };

  const markAsReviewed = async () => {
    if (!selectedBrand) return;
    try {
      await GuardrailsService.markAsReviewed(selectedBrand.id);
      await loadGuardrails();
    } catch (error) {}
  };

  // Memoize getCompetitiveGuidance with useCallback
  const getCompetitiveGuidance = useCallback((contentType) => {
    if (!guardrailsData || !competitorInsights?.length) return null;
    return {
      advantages: guardrailsData.competitive_advantages.slice(0, 3),
      messagingOpportunities: guardrailsData.competitor_messaging_gaps.slice(0, 3),
      topCompetitors: competitorInsights
        .filter(c => c.threat_level === 'high')
        .slice(0, 2)
        .map(c => ({
          name: c.competitor_name,
          advantages: c.competitive_advantages_vs_them.slice(0, 2)
        })),
      topThreats: competitorInsights
        .filter(c => c.threat_level === 'high' || c.threat_level === 'medium')
        .slice(0, 3)
    };
  }, [guardrailsData, competitorInsights]);

  const isLoading = guardrailsLoading || competitorLoading || intelligenceLoading;

  return {
    guardrails: guardrailsData ?? null,
    competitorInsights: competitorInsights ?? [],
    status,
    isLoading,
    loadGuardrails,
    checkContentCompliance,
    markAsReviewed,
    getCompetitiveGuidance,
    refreshIntelligence,
    intelligenceMetadata: intelligenceMetadata ?? null,
    isRefreshing,
    isStale: status?.is_stale || false,
    needsAttention: status?.needs_attention || false,
    daysSinceReview: status?.days_since_review || 0,
    stalenessLevel: status?.staleness_level || 'fresh',
    hasIntelligence: (intelligenceMetadata?.total_insights || 0) > 0,
    intelligenceStatus: intelligenceMetadata?.intelligence_status || 'none',
    freshInsightsCount: intelligenceMetadata?.fresh_insights || 0
  };
};
