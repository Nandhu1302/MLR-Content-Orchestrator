import { useEffect, useRef, useCallback, useState } from 'react';
import { TranslationPersistenceService } from '@/services/translationPersistenceService';
import { useToast } from '@/hooks/use-toast';

export const useIntelligenceAutoSave = ({
  intelligenceData,
  projectId,
  assetId,
  brandId,
  market,
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
    if (!enabled || !projectId) return { success: false, reason: 'disabled' };
    const currentData = JSON.stringify(intelligenceData);
    if (!force && currentData === lastSavedDataRef.current) {
      return { success: true, reason: 'no-changes' };
    }
    setStatus(prev => ({ ...prev, isSaving: true, error: null }));
    let retryCount = 0;
    const maxRetries = 3;
    while (retryCount < maxRetries) {
      try {
        const success = await TranslationPersistenceService.saveIntelligenceData({
          projectId,
          assetId,
          brandId,
          market,
          intelligenceData,
          workflowProgress: {
            intelligence: {
              completed: Object.keys(intelligenceData).length > 0,
              lastUpdated: new Date().toISOString()
            }
          }
        });
        if (success && isMountedRef.current) {
          lastSavedDataRef.current = currentData;
          setStatus({
            isSaving: false,
            lastSaved: new Date(),
            error: null
          });
          return { success: true, reason: 'saved' };
        } else if (isMountedRef.current) {
          throw new Error('Save operation returned false');
        }
      } catch (error) {
        retryCount++;
        if (retryCount < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
        } else {
          if (isMountedRef.current) {
            setStatus(prev => ({
              ...prev,
              isSaving: false,
              error: 'Auto-save failed after retries'
            }));
            toast({
              title: 'Auto-save Failed',
              description: 'Intelligence analysis could not be saved after multiple attempts.',
              variant: 'destructive'
            });
          }
          return { success: false, reason: 'error' };
        }
      }
    }
    return { success: false, reason: 'max-retries' };
  }, [intelligenceData, projectId, assetId, brandId, market, enabled, toast]);

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
  }, [intelligenceData, projectId, enabled, debounceMs, saveToDatabase]);

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
