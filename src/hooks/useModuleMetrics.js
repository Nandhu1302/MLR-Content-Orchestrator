import { useSmartQuery } from './useSmartQuery';
import { ModuleMetricsService } from '@/services/moduleMetricsService';

export const useModuleMetrics = (brandId) => {
  const { data: moduleMetrics, isLoading, error } = useSmartQuery(
    ['module-metrics', brandId],
    async () => {
      if (!brandId) return [];
      return await ModuleMetricsService.getAllModuleMetrics(brandId);
    },
    {
      enabled: !!brandId,
      staleTime: 30000,
    }
  );

  return {
    moduleMetrics: moduleMetrics ?? [],
    isLoading,
    error: error ? (error instanceof Error ? error.message : 'Failed to fetch module metrics') : null
  };
};
