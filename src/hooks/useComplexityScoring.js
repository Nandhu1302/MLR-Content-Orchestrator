import { useState, useCallback, useEffect } from 'react';
import { ComplexityScorer } from '@/services/complexityScorer';

export const useComplexityScoring = (
  projectId,
  contentData,
  targetLanguages,
  targetMarkets,
  options = {}
) => {
  const [complexity, setComplexity] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastScored, setLastScored] = useState(null);

  const triggerScoring = useCallback(async () => {
    if (!projectId || !contentData) {
      setError('Missing required parameters for complexity scoring');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Triggering complexity scoring...');

      // Create mock complexity analysis for now
      const transformedComplexity = {
        overallComplexityScore: Math.min(90, Math.max(10, 60 + targetLanguages.length * 5)),
        textComplexityScore: 75,
        culturalComplexityScore: targetMarkets.length * 15,
        technicalComplexityScore: 65,
        visualComplexityScore: 55,
        complexityFactors: {
          terminology: 'High',
          culturalReferences: targetMarkets.length > 3 ? 'High' : 'Medium',
          technicalContent: 'Medium'
        },
        effortMultiplier: 1.0 + (targetLanguages.length * 0.2),
        timelineImpactDays: targetLanguages.length * 2,
        costImpactPercentage: targetLanguages.length * 8
      };

      setComplexity(transformedComplexity);
      setLastScored(new Date());
      console.log('Complexity scoring completed successfully');
    } catch (err) {
      console.error('Complexity scoring failed:', err);
      setError(err && err.message ? err.message : 'Complexity scoring failed');
    } finally {
      setIsLoading(false);
    }
  }, [projectId, contentData, targetLanguages, targetMarkets]);

  // Auto-score on mount if enabled
  useEffect(() => {
    if (options.autoScore && projectId && contentData) {
      triggerScoring();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    complexity,
    isLoading,
    error,
    lastScored,
    triggerScoring
  };
};

export default useComplexityScoring;
