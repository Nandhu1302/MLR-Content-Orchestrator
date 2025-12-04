import { useState, useCallback } from 'react';
import { SmartTMEngine } from '@/services/smartTMEngine';

export const useSmartTMMatching = (
  brandId,
  sourceLanguage,
  targetLanguage,
  options = {}
) => {
  const [matches, setMatches] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchTM = useCallback(async (sourceText) => {
    if (!sourceText.trim() || !brandId) {
      setError('Missing required parameters for TM search');
      return;
    }
    setIsLoading(true);
    setError(null);
    setSearchResults(null);
    try {
      console.log('Searching translation memory...');
      const result = await SmartTMEngine.searchTranslationMemory(
        sourceText,
        sourceLanguage,
        targetLanguage,
        brandId,
        {
          minMatchPercentage: options.minMatchPercentage || 70,
          includeFuzzyMatches: true,
          includeSemanticMatches: true
        }
      );
      setSearchResults(result);
      console.log('TM search completed successfully');
    } catch (err) {
      console.error('TM search failed:', err);
      setError(err instanceof Error ? err.message : 'TM search failed');
    } finally {
      setIsLoading(false);
    }
  }, [brandId, sourceLanguage, targetLanguage, options.minMatchPercentage]);

  const getBestMatches = useCallback(async (sourceTexts) => {
    if (!sourceTexts.length || !brandId) {
      setError('Missing required parameters for batch TM matching');
      return;
    }
    setIsLoading(true);
    setError(null);
    setMatches(null);
    try {
      console.log('Getting best matches for content...');
      const result = await SmartTMEngine.getBestMatches(
        sourceTexts,
        sourceLanguage,
        targetLanguage,
        brandId
      );
      setMatches(result);
      console.log('Batch TM matching completed successfully');
    } catch (err) {
      console.error('Batch TM matching failed:', err);
      setError(err instanceof Error ? err.message : 'Batch TM matching failed');
    } finally {
      setIsLoading(false);
    }
  }, [brandId, sourceLanguage, targetLanguage]);

  const addToTM = useCallback(async (
    sourceText,
    targetText,
    contextMetadata,
    domainCategory
  ) => {
    if (!sourceText.trim() || !targetText.trim() || !brandId) {
      setError('Missing required parameters for adding to TM');
      return null;
    }
    setIsLoading(true);
    setError(null);
    try {
      console.log('Adding entry to translation memory...');
      const tmId = await SmartTMEngine.addToTranslationMemory(
        sourceText,
        targetText,
        sourceLanguage,
        targetLanguage,
        brandId,
        contextMetadata,
        domainCategory
      );
      console.log('Entry added to TM successfully');
      return tmId;
    } catch (err) {
      console.error('Adding to TM failed:', err);
      setError(err instanceof Error ? err.message : 'Adding to TM failed');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [brandId, sourceLanguage, targetLanguage]);

  const updateTMUsage = useCallback(async (tmId) => {
    if (!tmId) {
      return;
    }
    try {
      await SmartTMEngine.updateTMUsage(tmId);
      console.log('TM usage updated');
    } catch (err) {
      console.error('Updating TM usage failed:', err);
    }
  }, []);

  return {
    matches,
    searchResults,
    isLoading,
    error,
    searchTM,
    getBestMatches,
    addToTM,
    updateTMUsage
  };
};
