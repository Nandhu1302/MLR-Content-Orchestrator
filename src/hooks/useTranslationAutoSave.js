
import { useCallback } from 'react';
import { TranslationPersistenceService } from '@/services/translationPersistenceService';
import { useAutoSaveWithRetry } from './useAutoSaveWithRetry';

// JS version of useTranslationAutoSave (types removed, same context/logic)
export const useTranslationAutoSave = ({
  segments,
  projectId,
  assetId,
  brandId,
  market,
  language,
  enabled = true,
  debounceMs = 3000,
}) => {
  const handleSave = useCallback(async (currentSegments) => {
    if (!projectId) return false;

    console.log('💾 Auto-saving translations...', {
      projectId,
      market,
      segmentCount: Array.isArray(currentSegments) ? currentSegments.length : 0,
      translatedCount: (Array.isArray(currentSegments) ? currentSegments : []).filter((s) => s?.translatedText).length,
    });

    // Save segment translations
    const success = await TranslationPersistenceService.saveWorkflowState({
      projectId,
      assetId,
      brandId,
      market,
      language,
      workflowStatus: 'in_progress',
      segmentTranslations: Array.isArray(currentSegments) ? currentSegments : [],
      workflowProgress: {
        translation: {
          completed: false,
          lastUpdated: new Date().toISOString(),
        },
      },
    });

    if (!success) return false;

    // Save completed TM segments to translation_memory table
    const completedSegments = (Array.isArray(currentSegments) ? currentSegments : []).filter(
      (s) => s?.translatedText && s?.translationStatus === 'complete' && s?.translationMethod === 'tm'
    );

    if (completedSegments.length > 0) {
      console.log(`💾 Saving ${completedSegments.length} TM segments to translation_memory`);
      await TranslationPersistenceService.batchSaveSegments(
        completedSegments.map((seg) => ({
          sourceText: seg.content,
          targetText: seg.translatedText || '',
          sourceLanguage: 'en',
          targetLanguage: language,
          brandId,
          assetId,
          projectId,
          market,
          qualityScore: seg.confidence || 0,
          confidenceScore: seg.tmMatchPercentage || 0,
          matchType: 'exact',
        }))
      );
    }

    // Save AI translation results
    const aiSegments = (Array.isArray(currentSegments) ? currentSegments : []).filter(
      (s) => s?.translatedText && s?.translationMethod === 'ai'
    );

    if (aiSegments.length > 0) {
      console.log(`💾 Saving ${aiSegments.length} AI translation results`);
      for (const seg of aiSegments) {
        await TranslationPersistenceService.saveAITranslation(
          seg.content,
          seg.translatedText || '',
          {
            sourceLanguage: 'en',
            targetLanguage: language,
            confidence: seg.confidence || 0,
            engine: 'gemini',
          },
          brandId,
          assetId,
          projectId
        );
      }
    }

    console.log('✅ Auto-save successful at', new Date().toLocaleTimeString());
    return true;
  }, [projectId, assetId, brandId, market, language]);

  return useAutoSaveWithRetry({
    data: segments,
    onSave: handleSave,
    enabled: enabled && !!projectId,
    debounceMs,
  });
};
