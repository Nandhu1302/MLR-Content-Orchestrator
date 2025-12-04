// Smart TM Hook - Hybrid AI + TM Translation Intelligence
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

export const useGlocalSmartTM = (
  projectId,
  sourceLanguage,
  targetLanguage,
  therapeuticArea
) => {
  const { toast } = useToast();
  const [useTMLeverage, setUseTMLeverage] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  // Fast Translation - Pure AI translation without analysis
  const translateWithSmartTM = useCallback(async (
    sourceText,
    segmentId,
    segmentType
  ) => {
    setIsProcessing(true);
    setError(null);
    try {
      // Ensure segment exists in database before translation
      await supabase
        .from('glocal_content_segments')
        .upsert({
          id: segmentId,
          project_id: projectId,
          source_text: sourceText,
          segment_type: segmentType || 'body',
          segment_name: `Segment ${segmentId.slice(0, 8)}`,
          segment_index: 0,
          created_at: new Date().toISOString()
        }, {
          onConflict: 'id',
          ignoreDuplicates: true
        });
      // Call TM-powered translation edge function
      const { data, error: functionError } = await supabase.functions.invoke('glocal-ai-tm-translate', {
        body: {
          sourceText,
          sourceLanguage,
          targetLanguage,
          therapeuticArea,
          useTMLeverage,
          projectId,
          segmentId
        }
      });
      if (functionError) {
        setError(functionError.message);
        throw new Error(functionError.message || 'Translation service unavailable');
      }
      if (!data || !data.translatedText) {
        const errorMsg = 'Translation service returned empty response';
        setError(errorMsg);
        throw new Error(errorMsg);
      }
      const result = {
        translatedText: data.translatedText,
        fullAnalysis: data.fullAnalysis,
        wordLevelBreakdown: data.wordLevelBreakdown || [],
        aiScores: data.aiScores || { medical: 0, brand: 0, cultural: 0, reasoning: [] },
        reviewFlags: data.reviewFlags || [],
        tmStats: data.tmStats || {
          exactWords: 0,
          fuzzyWords: 0,
          newWords: sourceText.split(/\s+/).length,
          totalWords: sourceText.split(/\s+/).length,
          leveragePercentage: 0
        }
      };
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Translation failed';
      setError(errorMessage);
      toast({
        title: 'Translation Error',
        description: errorMessage,
        variant: 'destructive'
      });
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, [projectId, sourceLanguage, targetLanguage, therapeuticArea, useTMLeverage, toast]);

  // Load detailed analysis on-demand
  const loadAnalysisForSegment = useCallback(async (
    sourceText,
    translatedText,
    segmentId
  ) => {
    setIsProcessing(true);
    setError(null);
    try {
      const { data, error: functionError } = await supabase.functions.invoke('glocal-ai-analyze', {
        body: {
          text: `Source: ${sourceText}\n\nTranslation: ${translatedText}`,
          analysisType: 'tm_breakdown',
          targetMarket: targetLanguage,
          context: {
            therapeuticArea,
            projectId,
            segmentId
          }
        }
      });
      if (functionError) {
        throw functionError;
      }
      return data.analysis;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Analysis failed';
      setError(errorMessage);
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [projectId, sourceLanguage, targetLanguage, therapeuticArea, toast]);

  // Approve fuzzy match review
  const approveFuzzyMatches = useCallback(async (segmentId, userId) => {
    try {
      await supabase
        .from('glocal_tm_intelligence')
        .update({
          human_approval_status: 'approved',
          reviewed_by: userId,
          reviewed_at: new Date().toISOString()
        })
        .eq('segment_id', segmentId)
        .eq('project_id', projectId);
      toast({
        title: 'Review Approved',
        description: 'Fuzzy matches approved and saved to TM'
      });
    } catch (err) {
      toast({
        title: 'Approval Failed',
        description: 'Failed to save approval status',
        variant: 'destructive'
      });
    }
  }, [projectId, toast]);

  // Add new translations to TM after completion - UPSERT logic
  const addToTM = useCallback(async (segmentId, userId) => {
    try {
      const { data: existing, error: selectError } = await supabase
        .from('glocal_tm_intelligence')
        .select('id, usage_count')
        .eq('segment_id', segmentId)
        .eq('project_id', projectId)
        .maybeSingle();
      if (selectError && selectError.code !== 'PGRST116') {
        throw selectError;
      }
      if (existing) {
        await supabase
          .from('glocal_tm_intelligence')
          .update({
            human_approval_status: 'approved',
            reviewed_by: userId,
            reviewed_at: new Date().toISOString(),
            last_used_at: new Date().toISOString(),
            usage_count: (existing.usage_count || 0) + 1
          })
          .eq('id', existing.id);
      }
    } catch (err) {
      // Background operation, no toast
    }
  }, [projectId]);

  // Bulk translate all segments sequentially with progress tracking
  const translateAllSegments = useCallback(async (
    segments,
    onProgress
  ) => {
    const results = new Map();
    for (let i = 0; i < segments.length; i++) {
      try {
        const result = await translateWithSmartTM(
          segments[i].content,
          segments[i].id,
          segments[i].type
        );
        results.set(segments[i].id, result);
        onProgress && onProgress(i + 1, segments.length);
        if (i < segments.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      } catch (err) {
        // Continue with next segment on error
      }
    }
    return results;
  }, [translateWithSmartTM]);

  return {
    translateWithSmartTM,
    translateAllSegments,
    loadAnalysisForSegment,
    approveFuzzyMatches,
    addToTM,
    useTMLeverage,
    setUseTMLeverage,
    isProcessing,
    error
  };
};
