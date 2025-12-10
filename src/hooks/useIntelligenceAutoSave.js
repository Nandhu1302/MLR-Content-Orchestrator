
import { useCallback } from 'react';
import { TranslationPersistenceService } from '@/services/translationPersistenceService';
import { useAutoSaveWithRetry } from './useAutoSaveWithRetry';

// JS version of useIntelligenceAutoSave (types removed, same context/logic)
export const useIntelligenceAutoSave = ({
  intelligenceData,
  projectId,
  assetId,
  brandId,
  market,
  enabled = true,
  debounceMs = 3000,
}) => {
  const handleSave = useCallback(async (currentData) => {
    if (!projectId) return false;

    return await TranslationPersistenceService.saveIntelligenceData({
      projectId,
      assetId,
      brandId,
      market,
      intelligenceData: currentData,
      workflowProgress: {
        intelligence: {
          completed: Object.keys(currentData || {}).length > 0,
          lastUpdated: new Date().toISOString(),
        },
      },
    });
  }, [projectId, assetId, brandId, market]);

  return useAutoSaveWithRetry({
    data: intelligenceData,
    onSave: handleSave,
    enabled: enabled && !!projectId,
    debounceMs,
  });
};
