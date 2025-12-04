import { useQuery } from '@tanstack/react-query';

/**
 * Custom hook wrapper for React Query with optimized defaults for performance
 * - Automatic caching with 5-minute stale time
 * - Prevents auto-refresh on window focus
 * - Implements stale-while-revalidate pattern
 */
export const useSmartQuery = (
  key,
  fetcher,
  options = {}
) => {
  return useQuery({
    queryKey: Array.isArray(key) ? key : [key],
    queryFn: fetcher,
    staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh
    gcTime: 10 * 60 * 1000, // 10 minutes - cache time (formerly cacheTime)
    refetchOnWindowFocus: false, // Prevent auto-refresh on tab switch
    refetchOnReconnect: false, // Prevent auto-refresh on reconnect
    retry: 1, // Only retry once on failure
    ...options,
  });
};
