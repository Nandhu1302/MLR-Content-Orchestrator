// AI integration hook for GLOCAL using Lovable AI
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

export const useGlocalAI = () => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  // AI-powered translation with cultural adaptation
  const translateWithAI = useCallback(async (request) => {
    setIsProcessing(true);
    setError(null);
    try {
      const { data, error } = await supabase.functions.invoke('glocal-ai-translate', {
        body: {
          sourceText: request.sourceText,
          sourceLanguage: request.sourceLanguage,
          targetLanguage: request.targetLanguage,
          context: request.context
        }
      });
      if (error) throw error;
      return data.translation;
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
  }, [toast]);

  // AI-powered cultural analysis
  const analyzeCulturalFit = useCallback(async (request) => {
    setIsProcessing(true);
    setError(null);
    try {
      const { data, error } = await supabase.functions.invoke('glocal-ai-analyze', {
        body: {
          text: request.text,
          analysisType: request.analysisType,
          targetMarket: request.targetMarket,
          context: request.context
        }
      });
      if (error) throw error;
      return data.analysis;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Analysis failed';
      setError(errorMessage);
      toast({
        title: 'Analysis Error',
        description: errorMessage,
        variant: 'destructive'
      });
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, [toast]);

  // AI-powered content optimization suggestions
  const generateOptimizations = useCallback(async (
    text,
    targetMarket,
    goals
  ) => {
    setIsProcessing(true);
    setError(null);
    try {
      const { data, error } = await supabase.functions.invoke('glocal-ai-optimize', {
        body: {
          text,
          targetMarket,
          goals
        }
      });
      if (error) throw error;
      return data.suggestions;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Optimization failed';
      setError(errorMessage);
      toast({
        title: 'Optimization Error',
        description: errorMessage,
        variant: 'destructive'
      });
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, [toast]);

  // Batch translation with AI
  const batchTranslate = useCallback(async (
    segments,
    sourceLanguage,
    targetLanguage
  ) => {
    setIsProcessing(true);
    setError(null);
    try {
      const { data, error } = await supabase.functions.invoke('glocal-ai-batch-translate', {
        body: {
          segments,
          sourceLanguage,
          targetLanguage
        }
      });
      if (error) throw error;
      return data.translations;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Batch translation failed';
      setError(errorMessage);
      toast({
        title: 'Batch Translation Error',
        description: errorMessage,
        variant: 'destructive'
      });
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, [toast]);

  return {
    translateWithAI,
    analyzeCulturalFit,
    generateOptimizations,
    batchTranslate,
    isProcessing,
    error
  };
};
