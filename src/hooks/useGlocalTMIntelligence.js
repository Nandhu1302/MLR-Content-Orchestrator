// Pure GLOCAL Translation Memory Intelligence Hook
// Zero dependencies on localization module

import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

export const useGlocalTMIntelligence = (
  projectId,
  sourceLanguage,
  targetLanguage,
  therapeuticArea
) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Find TM matches for a specific segment
  const findMatches = useCallback(async (
    sourceText,
    segmentType
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      let query = supabase
        .from('glocal_tm_intelligence')
        .select('*')
        .eq('source_language', sourceLanguage)
        .eq('target_language', targetLanguage)
        .gte('match_score', 70)
        .order('match_score', { ascending: false })
        .limit(10);
      if (therapeuticArea) {
        query = query.eq('therapeutic_area', therapeuticArea);
      }
      const { data: tmEntries, error: tmError } = await query;
      if (tmError) throw tmError;
      const matches = (tmEntries || []).map(tm => {
        const matchScore = calculateSimilarity(sourceText, tm.tm_source_text);
        const metadata = tm.tm_metadata || {};
        const contextBoost = segmentType && metadata.segmentType === segmentType ? 10 : 0;
        return {
          id: tm.id,
          sourceText: tm.tm_source_text,
          targetText: tm.tm_target_text,
          matchScore: Math.min(100, matchScore + contextBoost),
          matchType: determineMatchType(matchScore),
          qualityScore: tm.quality_score || 0,
          confidenceLevel: tm.confidence_level || 0,
          therapeuticArea: tm.therapeutic_area,
          usageCount: tm.usage_count || 0,
          metadata: tm.tm_metadata || {}
        };
      });
      return matches.sort((a, b) => {
        const scoreA = a.matchScore * 0.6 + a.qualityScore * 0.4;
        const scoreB = b.matchScore * 0.6 + b.qualityScore * 0.4;
        return scoreB - scoreA;
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to find TM matches';
      setError(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [sourceLanguage, targetLanguage, therapeuticArea]);

  // Get TM suggestions for multiple segments
  const getSuggestions = useCallback(async (
    segments
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const suggestions = [];
      for (const segment of segments) {
        const matches = await findMatches(segment.text, segment.type);
        const bestMatch = matches.length > 0 ? matches[0] : null;
        const leverageScore = bestMatch ? bestMatch.matchScore : 0;
        const costSavings = calculateCostSavings(leverageScore, segment.text.split(' ').length);
        const reasoning = generateReasoning(bestMatch, matches, segment.text);
        suggestions.push({
          segmentId: segment.id,
          matches: matches.slice(0, 5),
          bestMatch,
          leverageScore,
          costSavings,
          reasoning
        });
      }
      return suggestions;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate suggestions';
      setError(errorMessage);
      toast({
        title: 'TM Suggestions Failed',
        description: errorMessage,
        variant: 'destructive'
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [findMatches, toast]);

  // Save new translation to TM
  const saveTM = useCallback(async (
    segmentId,
    sourceText,
    targetText,
    metadata
  ) => {
    try {
      await supabase.from('glocal_tm_intelligence').insert({
        project_id: projectId,
        segment_id: segmentId,
        tm_source_text: sourceText,
        tm_target_text: targetText,
        source_language: sourceLanguage,
        target_language: targetLanguage,
        match_type: 'exact',
        match_score: 100,
        quality_score: 85,
        confidence_level: 90,
        therapeutic_area: therapeuticArea,
        tm_metadata: metadata || {},
        usage_count: 1
      });
    } catch (err) {
      // Silent fail
    }
  }, [projectId, sourceLanguage, targetLanguage, therapeuticArea]);

  // Get project-level TM analytics
  const getAnalytics = useCallback(async () => {
    try {
      const { data } = await supabase
        .from('glocal_tm_intelligence')
        .select('*')
        .eq('project_id', projectId);
      const totalEntries = data?.length || 0;
      const exactMatches = data?.filter(tm => tm.match_type === 'exact').length || 0;
      const fuzzyMatches = data?.filter(tm => tm.match_type === 'fuzzy').length || 0;
      const avgQuality = data?.reduce((sum, tm) => sum + (tm.quality_score || 0), 0) / totalEntries || 0;
      const avgConfidence = data?.reduce((sum, tm) => sum + (tm.confidence_level || 0), 0) / totalEntries || 0;
      return {
        totalEntries,
        exactMatches,
        fuzzyMatches,
        avgQuality,
        avgConfidence,
        leverageRate: totalEntries > 0 ? ((exactMatches + fuzzyMatches * 0.7) / totalEntries) * 100 : 0
      };
    } catch (err) {
      return null;
    }
  }, [projectId]);

  return {
    findMatches,
    getSuggestions,
    saveTM,
    getAnalytics,
    isLoading,
    error
  };
};

// Helper functions
function calculateSimilarity(str1, str2) {
  if (str1 === str2) return 100;
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  if (longer.length === 0) return 100;
  const distance = levenshteinDistance(str1.toLowerCase(), str2.toLowerCase());
  const score = ((longer.length - distance) / longer.length) * 100;
  return Math.round(score);
}
function levenshteinDistance(str1, str2) {
  const matrix = [];
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[str2.length][str1.length];
}
function determineMatchType(score) {
  if (score >= 95) return 'exact';
  if (score >= 80) return 'fuzzy';
  if (score >= 70) return 'context';
  return 'terminology';
}
function calculateCostSavings(matchScore, wordCount) {
  const costPerWord = 0.15;
  let savingsRate = 0;
  if (matchScore >= 95) savingsRate = 1.0;
  else if (matchScore >= 85) savingsRate = 0.75;
  else if (matchScore >= 75) savingsRate = 0.50;
  else savingsRate = 0.25;
  return wordCount * costPerWord * savingsRate;
}
function generateReasoning(
  bestMatch,
  allMatches,
  sourceText
) {
  const reasons = [];
  if (!bestMatch) {
    reasons.push('No TM matches found - will require new translation');
    return reasons;
  }
  if (bestMatch.matchScore >= 95) {
    reasons.push('Exact or near-exact match found');
  } else if (bestMatch.matchScore >= 85) {
    reasons.push('High-quality fuzzy match available');
  } else if (bestMatch.matchScore >= 75) {
    reasons.push('Moderate match found - will need review');
  }
  if (bestMatch.qualityScore >= 90) {
    reasons.push('Excellent historical quality rating');
  }
  if (bestMatch.usageCount > 5) {
    reasons.push(`Frequently used translation (${bestMatch.usageCount} times)`);
  }
  if (bestMatch.therapeuticArea) {
    reasons.push(`Therapeutic area match: ${bestMatch.therapeuticArea}`);
  }
  const wordCount = sourceText.split(' ').length;
  if (wordCount > 50) {
    reasons.push('Complex segment - careful review recommended');
  }
  return reasons;
}
