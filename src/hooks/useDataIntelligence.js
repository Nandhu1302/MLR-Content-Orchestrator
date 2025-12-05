import { useSmartQuery } from './useSmartQuery';
import { DataIntelligenceService } from '@/services/dataIntelligenceService';
import { SuccessPatternDetector } from '@/services/successPatternDetector';
import { supabase } from '@/integrations/supabase/client';
// DataFilters type import removed

export const useDataIntelligence = (brandId, days = 90, filters) => {
  // Only run queries if brandId is valid (not empty)
  const enabled = Boolean(brandId);

  // Fetch marketing intelligence
  const { data: intelligence, isLoading: loadingIntelligence } = useSmartQuery(
    ['marketing-intelligence', brandId, String(days), JSON.stringify(filters)],
    () => DataIntelligenceService.fetchMarketingIntelligence(brandId, days, filters),
    { enabled }
  );

  // Fetch success patterns
  const { data: successPatterns, isLoading: loadingPatterns } = useSmartQuery(
    ['success-patterns', brandId],
    () => SuccessPatternDetector.getValidatedPatterns(brandId),
    { enabled }
  );

  // Fetch data sources health
  const { data: dataSources, isLoading: loadingSources } = useSmartQuery(
    ['data-sources', brandId],
    async () => {
      const { data } = await supabase
        .from('data_source_registry')
        .select('*')
        .eq('is_active', true);
      return data || [];
    },
    { enabled: true } // Always fetch data sources regardless of brand
  );

  // Fetch top performing elements
  const { data: topElements, isLoading: loadingElements } = useSmartQuery(
    ['top-elements', brandId, JSON.stringify(filters)],
    () => DataIntelligenceService.getTopPerformingElements(brandId, filters),
    { enabled }
  );

  // Fetch content trends
  const { data: contentTrends, isLoading: loadingTrends } = useSmartQuery(
    ['content-trends', brandId, String(days), JSON.stringify(filters)],
    () => DataIntelligenceService.getContentTrends(brandId, days, filters),
    { enabled }
  );

  // Calculate data quality score
  const { data: dataQualityScore, isLoading: loadingQuality } = useSmartQuery(
    ['data-quality', brandId],
    () => DataIntelligenceService.getDataQualityScore(brandId),
    { enabled }
  );

  return {
    intelligence,
    successPatterns,
    dataSources,
    topElements,
    contentTrends,
    dataQualityScore,
    isLoading: loadingIntelligence || loadingPatterns || loadingSources || 
                loadingElements || loadingTrends || loadingQuality,
  };
};