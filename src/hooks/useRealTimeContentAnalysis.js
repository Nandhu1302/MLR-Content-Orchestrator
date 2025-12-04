import { useState, useEffect, useCallback } from 'react';
import { BrowserAIService } from '@/services/browserAIService';
import { PerformancePredictionService } from '@/services/performancePredictionService';
import { useBrand } from '@/contexts/BrandContext';

export const useRealTimeContentAnalysis = (
  content,
  options = {}
) => {
  const { debounceMs = 2000, enableRealtime = true, minContentLength = 50 } = options;
  const { selectedBrand } = useBrand();
  const [analysis, setAnalysis] = useState({
    aiScore: 0,
    sentimentScore: 0,
    toneAlignment: 0,
    medicalLanguageScore: 0,
    brandVoiceScore: 0,
    readabilityScore: 0,
    mlrApprovalPrediction: 0,
    engagementPrediction: 0,
    riskScore: 0,
    suggestions: [],
    isAnalyzing: false,
    confidence: 0
  });
  const [lastAnalyzed, setLastAnalyzed] = useState('');
  const analyzeContent = useCallback(async (contentData) => {
    if (!contentData || !selectedBrand?.id) return;
    const contentText = [
      contentData.subject,
      contentData.headline,
      contentData.body,
      contentData.cta
    ].filter(Boolean).join('\n\n');
    if (contentText.length < minContentLength) return;
    setAnalysis(prev => ({ ...prev, isAnalyzing: true }));
    try {
      const [aiAnalysis, performancePrediction] = await Promise.all([
        BrowserAIService.analyzeContent(contentText, {
          brand_voice: ['professional', 'scientific', 'trustworthy'],
          target_tone: 'professional',
          medical_context: true
        }),
        PerformancePredictionService.predictPerformance(
          contentText,
          selectedBrand.id,
          {
            content_type: 'asset',
            content_id: 'realtime-analysis',
            asset_type: 'email'
          }
        )
      ]);
      const suggestions = generateRealTimeSuggestions(aiAnalysis, performancePrediction, contentData);
      setAnalysis({
        aiScore: aiAnalysis.overall_ai_score,
        sentimentScore: Math.round(aiAnalysis.sentiment.confidence * 100),
        toneAlignment: aiAnalysis.tone.brand_alignment,
        medicalLanguageScore: aiAnalysis.medical_terminology.clinical_language_score,
        brandVoiceScore: aiAnalysis.brand_voice.voice_consistency,
        readabilityScore: aiAnalysis.semantics.readability_score,
        mlrApprovalPrediction: performancePrediction.mlr_approval.predicted_score,
        engagementPrediction: performancePrediction.engagement_forecast.predicted_score,
        riskScore: performancePrediction.risk_assessment.predicted_score,
        suggestions: suggestions.slice(0, 5),
        isAnalyzing: false,
        confidence: performancePrediction.overall_confidence
      });
      setLastAnalyzed(contentText);
    } catch (error) {
      setAnalysis(prev => ({ ...prev, isAnalyzing: false }));
    }
  }, [selectedBrand, minContentLength]);
  useEffect(() => {
    if (!enableRealtime) return;
    const contentText = [
      content?.subject,
      content?.headline,
      content?.body,
      content?.cta
    ].filter(Boolean).join('\n\n');
    if (contentText === lastAnalyzed) return;
    const timer = setTimeout(() => {
      analyzeContent(content);
    }, debounceMs);
    return () => clearTimeout(timer);
  }, [content, analyzeContent, debounceMs, enableRealtime, lastAnalyzed]);
  const triggerAnalysis = useCallback(() => {
    analyzeContent(content);
  }, [analyzeContent, content]);
  return {
    analysis,
    triggerAnalysis,
    lastAnalyzed: lastAnalyzed.length > 0
  };
};
function generateRealTimeSuggestions(
  aiAnalysis,
  performancePrediction,
  contentData
) {
  const suggestions = [];
  if (aiAnalysis.overall_ai_score < 70) {
    suggestions.push('Overall content quality could be improved. Consider enhancing language and structure.');
  }
  if (aiAnalysis.tone.brand_alignment < 70) {
    suggestions.push('Tone alignment with brand voice needs improvement. Add more professional medical language.');
  }
  if (aiAnalysis.medical_terminology.clinical_language_score < 60) {
    suggestions.push('Strengthen clinical terminology. Consider adding evidence-based language.');
  }
  if (contentData.body && contentData.body.length < 200) {
    suggestions.push('Body content is quite brief. Consider expanding with clinical details or patient benefits.');
  }
  if (performancePrediction.mlr_approval.predicted_score < 70) {
    suggestions.push('MLR approval likelihood is lower. Review regulatory language and claims.');
  }
  if (performancePrediction.engagement_forecast.predicted_score < 60) {
    suggestions.push('Engagement potential could be higher. Consider strengthening the call-to-action.');
  }
  if (performancePrediction.risk_assessment.predicted_score > 60) {
    suggestions.push('Content risk level is elevated. Review for potential regulatory concerns.');
  }
  if (aiAnalysis.medical_terminology.regulatory_flags.length > 0) {
    suggestions.push(`Review flagged terms: ${aiAnalysis.medical_terminology.regulatory_flags.join(', ')}`);
  }
  if (aiAnalysis.brand_voice.missing_attributes.length > 0) {
    suggestions.push(`Strengthen brand voice by adding ${aiAnalysis.brand_voice.missing_attributes[0]} language`);
  }
  return suggestions;
}
