import { useMemo } from 'react';
import { useBrand } from '@/contexts/BrandContext';
import { supabase } from '@/integrations/supabase/client';
import { useGuardrails } from './useGuardrails';
import { useSmartQuery } from './useSmartQuery';

export const useDashboardMetrics = () => {
  const { selectedBrand } = useBrand();
  const { 
    guardrails, 
    status, 
    competitorInsights, 
    intelligenceMetadata, 
    freshInsightsCount,
    isLoading: guardrailsLoading 
  } = useGuardrails();

  // Fetch regulatory data with React Query
  const { data: regulatory, isLoading: regulatoryLoading } = useSmartQuery(
    ['regulatory-metrics', selectedBrand?.id],
    async () => {
      if (!selectedBrand) return null;

      const { data: regulatoryData } = await supabase
        .from('regulatory_framework')
        .select('*')
        .eq('brand_id', selectedBrand.id);

      if (!regulatoryData) return null;

      const marketsSupported = regulatoryData.length;
      const complianceReady = regulatoryData.filter(
        r => r.approval_status === 'approved'
      ).length;
      const totalDisclaimers = regulatoryData.reduce(
        (acc, r) => acc + (Array.isArray(r.required_disclaimers) ? r.required_disclaimers.length : 0), 0
      );

      return {
        marketsSupported,
        complianceReady,
        activeDisclaimers: totalDisclaimers,
        approvalRate: marketsSupported > 0 ? (complianceReady / marketsSupported) * 100 : 0,
      };
    },
    { enabled: !!selectedBrand }
  );

  // Fetch glocalization data with React Query
  const { data: glocalization, isLoading: glocalizationLoading } = useSmartQuery(
    ['glocalization-metrics', selectedBrand?.id],
    async () => {
      if (!selectedBrand) return null;

      const { data: glocalData } = await supabase
        .from('glocal_adaptation_projects')
        .select('*')
        .eq('brand_id', selectedBrand.id);

      if (!glocalData) return null;

      const activeProjects = glocalData.filter(
        p => p.project_status !== 'completed' && p.project_status !== 'cancelled'
      ).length;
      
      const uniqueLanguages = new Set(
        glocalData.flatMap(p => 
          Array.isArray(p.target_languages) ? p.target_languages : []
        )
      );

      const culturalScores = glocalData
        .map(p => p.cultural_intelligence_score || 0)
        .filter(s => s > 0);
      const avgCulturalScore = culturalScores.length > 0
        ? culturalScores.reduce((a, b) => a + b, 0) / culturalScores.length
        : 0;

      const { data: tmData } = await supabase
        .from('glocal_tm_intelligence')
        .select('leverage_percentage')
        .in('project_id', glocalData.map(p => p.id));

      const tmLeverageRates = tmData?.map(t => t.leverage_percentage || 0).filter(r => r > 0) || [];
      const avgTmLeverage = tmLeverageRates.length > 0
        ? tmLeverageRates.reduce((a, b) => a + b, 0) / tmLeverageRates.length
        : 0;

      return {
        activeProjects,
        languagesSupported: uniqueLanguages.size,
        culturalScore: avgCulturalScore,
        tmLeverageRate: avgTmLeverage,
      };
    },
    { enabled: !!selectedBrand }
  );

  // Memoize guardrails metrics to prevent recalculations
  const guardrailsMetrics = useMemo(() => {
    if (!guardrails || !status) return null;
    return {
      status: status.staleness_level,
      daysSinceReview: status.days_since_review,
      complianceScore: 85,
      needsAttention: status.needs_attention,
      intelligenceStatus: intelligenceMetadata?.intelligence_status,
      freshInsightsCount: freshInsightsCount,
      lastIntelligenceRefresh: intelligenceMetadata?.last_refresh,
    };
  }, [guardrails, status, intelligenceMetadata, freshInsightsCount]);

  // Memoize competitive metrics
  const competitiveMetrics = useMemo(() => {
    if (!competitorInsights) return null;
    return {
      totalCompetitors: competitorInsights.length,
      highThreatCount: competitorInsights.filter(c => c.threat_level === 'high').length,
      messagingGaps: Array.isArray(guardrails?.competitor_messaging_gaps) ? guardrails.competitor_messaging_gaps.length : 0,
      advantages: Array.isArray(guardrails?.competitive_advantages) ? guardrails.competitive_advantages.length : 0,
    };
  }, [competitorInsights, guardrails]);

  return {
    guardrails: guardrailsMetrics,
    competitive: competitiveMetrics,
    regulatory: regulatory ?? null,
    glocalization: glocalization ?? null,
    isLoading: guardrailsLoading || regulatoryLoading || glocalizationLoading,
  };
};

export default useDashboardMetrics;
