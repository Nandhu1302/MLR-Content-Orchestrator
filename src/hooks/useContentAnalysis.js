import { useState, useEffect, useCallback } from 'react';
import { useGlobalContext } from '@/contexts/GlobalContext';
import { useBrand } from '@/contexts/BrandContext';
import { BrowserAIService } from '@/services/browserAIService';
import { metadataGenerationService } from '@/services/metadataGenerationService';
import { taxonomyService } from '@/services/taxonomyService';

export const useContentAnalysis = (
  content,
  contentId,
  options = {}
) => {
  const { debounceMs = 500, enableRealtime = true, contentType = 'content_asset' } = options;
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastAnalyzed, setLastAnalyzed] = useState(null);
  
  const { state } = useGlobalContext();
  const { selectedBrand } = useBrand();

  const analyzeContent = useCallback(async (textContent) => {
    if (!textContent.trim() || !selectedBrand) return;

    setIsAnalyzing(true);
    try {
      // Run AI analysis and metadata generation in parallel
      const [aiResult, taxonomyResult] = await Promise.all([
        BrowserAIService.analyzeContent(textContent, {
          brand_voice: [selectedBrand.brand_name],
          target_tone: state.userSelections?.tone || 'professional'
        }),
        taxonomyService.generateTaxonomySuggestions(
          { content: textContent },
          'content_asset',
          selectedBrand.id
        )
      ]);

      // Calculate theme alignment based on current theme selections
      const selectedThemes = state.crossModuleData?.themes || [];
      const themeAlignment = calculateThemeAlignment(textContent, selectedThemes);
      
      // Calculate taxonomy compliance
      const taxonomyCompliance = calculateTaxonomyCompliance(taxonomyResult);

      // Generate suggestions based on analysis
      const suggestions = generateSuggestions(aiResult, taxonomyResult, themeAlignment);
      
      const analysisResult = {
        overallScore: aiResult.overall_ai_score,
        themeAlignment,
        taxonomyCompliance,
        aiAnalysis: aiResult,
        suggestions,
        taxonomyTags: taxonomyResult.map(s => s.taxonomyId) || [],
        complianceIssues: [],
        confidence: aiResult.sentiment?.confidence || 0.8,
        reasoning: generateReasoning(aiResult, themeAlignment, taxonomyCompliance)
      };

      setAnalysis(analysisResult);
      setLastAnalyzed(new Date());

      // Store metadata if contentId is provided
      if (contentId) {
        await metadataGenerationService.generateMetadata(
          { content: textContent },
          contentType,
          contentId,
          { includeAIAnalysis: true, includeTaxonomyMapping: true }
        );
      }

    } catch (error) {
      console.error('Content analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [selectedBrand, state.crossModuleData, state.userSelections, contentType, contentId]);

  // Debounced analysis effect
  useEffect(() => {
    if (!enableRealtime || !content.trim()) return;

    const timer = setTimeout(() => {
      analyzeContent(content);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [content, analyzeContent, debounceMs, enableRealtime]);

  // Manual analysis trigger
  const triggerAnalysis = useCallback(() => {
    if (content.trim()) {
      analyzeContent(content);
    }
  }, [content, analyzeContent]);

  return {
    analysis,
    isAnalyzing,
    lastAnalyzed,
    triggerAnalysis,
    hasContent: content.trim().length > 0
  };
};

// Helper functions
function calculateThemeAlignment(content, themes) {
  if (!themes.length) return 0;
  
  const contentLower = content.toLowerCase();
  let alignmentScore = 0;
  let totalChecks = 0;

  themes.forEach(theme => {
    if (theme.core_messages) {
      theme.core_messages.forEach(message => {
        totalChecks++;
        const keywords = message.toLowerCase().split(' ');
        const matches = keywords.filter(keyword => 
          keyword.length > 3 && contentLower.includes(keyword)
        ).length;
        alignmentScore += (matches / keywords.length) * 100;
      });
    }
  });

  return totalChecks > 0 ? Math.min(100, alignmentScore / totalChecks) : 0;
}

function calculateTaxonomyCompliance(taxonomyResult) {
  const { complianceValidation = [] } = taxonomyResult;
  if (complianceValidation.length === 0) return 100;
  
  const compliantCount = complianceValidation.filter(v => v.isCompliant).length;
  return (compliantCount / complianceValidation.length) * 100;
}

function generateSuggestions(
  aiResult, 
  taxonomyResult, 
  themeAlignment
) {
  const suggestions = [];

  if (aiResult.tone.alignment < 0.7) {
    suggestions.push(`Adjust tone to better match ${aiResult.tone.targetTone} voice`);
  }

  if (aiResult.brandVoice.consistency < 0.7) {
    suggestions.push('Strengthen brand voice consistency with key messaging');
  }

  if (themeAlignment < 50) {
    suggestions.push('Consider incorporating more theme-specific messaging');
  }

  if (taxonomyResult.length > 0) {
    suggestions.push(`Apply suggested taxonomy: ${taxonomyResult[0].taxonomyId}`);
  }

  taxonomyResult.complianceValidation?.forEach(validation => {
    if (!validation.isCompliant) {
      suggestions.push(`Address compliance issue: ${validation.issue}`);
    }
  });

  return suggestions.slice(0, 5);
}

function generateReasoning(
  aiResult, 
  themeAlignment, 
  taxonomyCompliance
) {
  const scores = [
    { name: 'AI Quality', value: aiResult.overall_ai_score },
    { name: 'Theme Alignment', value: themeAlignment },
    { name: 'Taxonomy Compliance', value: taxonomyCompliance }
  ];

  const strongAreas = scores.filter(s => s.value >= 70).map(s => s.name);
  const weakAreas = scores.filter(s => s.value < 50).map(s => s.name);

  let reasoning = '';
  if (strongAreas.length > 0) {
    reasoning += `Strong performance in: ${strongAreas.join(', ')}. `;
  }
  if (weakAreas.length > 0) {
    reasoning += `Areas for improvement: ${weakAreas.join(', ')}.`;
  }

  return reasoning || 'Content meets baseline quality standards.';
}

export default useContentAnalysis;
