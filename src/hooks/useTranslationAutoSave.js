import { useEffect, useRef, useCallback, useState } from 'react';
import { TranslationPersistenceService } from '@/services/translationPersistenceService';
import { useToast } from '@/hooks/use-toast';

export const useTranslationAutoSave = ({
  segments,
  projectId,
  assetId,
  brandId,
  market,
  language,
  enabled = true,
  debounceMs = 3000
}) => {
  const { toast } = useToast();
  const [status, setStatus] = useState({
    isSaving: false,
    lastSaved: null,
    error: null
  });
  const timeoutRef = useRef(null);
  const lastSavedDataRef = useRef('');
  const isMountedRef = useRef(true);

  const saveToDatabase = useCallback(async (force = false) => {
    if (!enabled || !projectId) {
      console.log('⏸️ Auto-save skipped:', { enabled, hasProjectId: !!projectId });
      return { success: false, reason: 'disabled' };
    }
    const currentData = JSON.stringify(segments);
    if (!force && currentData === lastSavedDataRef.current) {
      console.log('⏸️ Auto-save skipped: No changes detected');
      return { success: true, reason: 'no-changes' };
    }
    console.log('💾 Auto-saving translations...', {
      projectId,
      market,
      segmentCount: segments.length,
      translatedCount: segments.filter(s => s.translatedText).length,
      forced: force
    });
    setStatus(prev => ({ ...prev, isSaving: true, error: null }));
    let retryCount = 0;
    const maxRetries = 3;
    while (retryCount < maxRetries) {
      try {
        const success = await TranslationPersistenceService.saveWorkflowState({
          projectId,
          assetId,
          brandId,
          market,
          language,
          workflowStatus: 'in_progress',
          segmentTranslations: segments,
          workflowProgress: {
            translation: {
              completed: false,
              lastUpdated: new Date().toISOString()
            }
          }
        });
        if (success && isMountedRef.current) {
          const completedSegments = segments.filter(s =>
            s.translatedText &&
            s.translationStatus === 'complete' &&
            s.translationMethod === 'tm'
          );
          if (completedSegments.length > 0) {
            console.log(`💾 Saving ${completedSegments.length} TM segments to translation_memory`);
            await TranslationPersistenceService.batchSaveSegments(
              completedSegments.map(seg => ({
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
                matchType: 'exact'
              }))
            );
          }
          const aiSegments = segments.filter(s =>
            s.translatedText &&
            s.translationMethod === 'ai'
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
                  engine: 'gemini'
                },
                brandId,
                assetId,
                projectId
              );
            }
          }
          lastSavedDataRef.current = currentData;
          setStatus({
            isSaving: false,
            lastSaved: new Date(),
            error: null
          });
          console.log('✅ Auto-save successful at', new Date().toLocaleTimeString());
          return { success: true, reason: 'saved' };
        } else if (isMountedRef.current) {
          throw new Error('Save operation returned false');
        }
      } catch (error) {
        retryCount++;
        console.error(`❌ Auto-save attempt ${retryCount} failed:`, error);
        if (retryCount < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
          console.log(`🔄 Retrying save (attempt ${retryCount + 1}/${maxRetries})...`);
        } else {
          if (isMountedRef.current) {
            setStatus(prev => ({
              ...prev,
              isSaving: false,
              error: 'Auto-save failed after retries'
            }));
            toast({
              title: 'Auto-save Failed',
              description: 'Your translations could not be saved after multiple attempts. Please use manual save.',
              variant: 'destructive'
            });
          }
          return { success: false, reason: 'error' };
        }
      }
    }
    return { success: false, reason: 'max-retries' };
  }, [segments, projectId, assetId, brandId, market, language, enabled, toast]);

  useEffect(() => {
    if (!enabled || !projectId) return;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      saveToDatabase();
    }, debounceMs);
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [segments, projectId, enabled, debounceMs, saveToDatabase]);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const forceSave = useCallback(async () => {
    await saveToDatabase(true);
  }, [saveToDatabase]);

  return {
    isSaving: status.isSaving,
    lastSaved: status.lastSaved,
    error: status.error,
    forceSave
  };
};
