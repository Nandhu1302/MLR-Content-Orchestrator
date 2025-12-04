import { useBrand } from '@/contexts/BrandContext';
import { OperationsMetricsService } from '@/services/operationsMetricsService';
import { useSmartQuery } from './useSmartQuery';

export const useOperationsMetrics = (dateRange = 30) => {
  const { selectedBrand } = useBrand();

  const { data: metrics, isLoading, error: queryError } = useSmartQuery(
    ['operations-metrics', selectedBrand?.id, dateRange.toString()],
    async () => {
      if (!selectedBrand) return null;
      return await OperationsMetricsService.getAllMetrics(selectedBrand.id, dateRange);
    },
    { enabled: !!selectedBrand }
  );

  const error = queryError ? (queryError instanceof Error ? queryError.message : 'Failed to fetch metrics') : null;

  return {
    metrics: metrics ?? null,
    isLoading,
    error,
    lifecycle: metrics?.lifecycle,
    reusability: metrics?.reusability,
    throughput: metrics?.throughput,
    quality: metrics?.quality,
    localization: metrics?.localization,
    cost: metrics?.cost,
  };
};
