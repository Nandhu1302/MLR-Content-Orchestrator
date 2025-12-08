import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, Brain, CheckCircle, Clock, Lightbulb, Target, TrendingUp } from "lucide-react";
// Type import removed
import { BrowserAIService } from "@/services/browserAIService";
import { useBrand } from "@/contexts/BrandContext";

// Interface and type annotations removed
export const AIAnalysisPanel = ({
  content,
  onAnalysisComplete,
  showDetailed = false
}) => {
  const { selectedBrand } = useBrand();
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (content && content.trim().length > 10) {
      analyzeContent();
    }
  }, [content]);

  const analyzeContent = async () => {
    if (!content || content.trim().length < 10) {
      setError('Content too short for analysis');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      // Create brand context for analysis
      const brandContext = {
        brand_voice: ['professional', 'trustworthy'], // Default values since BrandProfile doesn't have these
        target_tone: 'professional',
        medical_context: selectedBrand?.therapeutic_area ? true : false
      };

      const result = await BrowserAIService.analyzeContent(content, brandContext);
      setAnalysis(result);
      // Optional chaining kept as it's valid JS/JSX
      onAnalysisComplete?.(result); 
    } catch (err) {
      console.error('AI analysis failed:', err);
      setError('AI analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Type annotation removed
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Type annotation removed
  const getScoreBadgeVariant = (score) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  // Type annotation removed
  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive': return '😊';
      case 'negative': return '😞';
      default: return '😐';
    }
  };

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isAnalyzing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 animate-pulse" />
            AI Content Analysis
          </CardTitle>
          <CardDescription>
            Analyzing content with browser-based AI models...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 animate-spin" />
            <span>Processing content...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analysis) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <Brain className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Enter content to see AI analysis</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Overall Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              AI Content Analysis
            </div>
            <Badge variant={getScoreBadgeVariant(analysis.overall_ai_score)}>
              {analysis.overall_ai_score}/100
            </Badge>
          </CardTitle>
          <CardDescription>
            Comprehensive AI-powered content analysis
            {analysis.processing_time && (
              <span className="ml-2 text-xs">
                • Processed in {analysis.processing_time}ms
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Overall AI Score</span>
                <span className={getScoreColor(analysis.overall_ai_score)}>
                  {analysis.overall_ai_score}%
                </span>
              </div>
              <Progress value={analysis.overall_ai_score} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Quick Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{getSentimentIcon(analysis.sentiment.sentiment)}</span>
                <div>
                  <p className="font-medium capitalize">{analysis.sentiment.sentiment}</p>
                  <p className="text-xs text-muted-foreground">
                    {Math.round(analysis.sentiment.confidence * 100)}% confidence
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <div>
                  <p className="font-medium capitalize">{analysis.tone.tone} Tone</p>
                  <p className="text-xs text-muted-foreground">
                    {analysis.tone.brand_alignment}% brand alignment
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {showDetailed && (
        <>
          {/* Detailed Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Sentiment Analysis */}
              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  Sentiment Analysis
                  <Badge variant="outline" className="ml-auto">
                    {Math.round(analysis.sentiment.confidence * 100)}% confidence
                  </Badge>
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Positive</div>
                    <div className="text-lg font-semibold text-green-600">
                      {Math.round(analysis.sentiment.scores.positive * 100)}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Neutral</div>
                    <div className="text-lg font-semibold text-gray-600">
                      {Math.round(analysis.sentiment.scores.neutral * 100)}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Negative</div>
                    <div className="text-lg font-semibold text-red-600">
                      {Math.round(analysis.sentiment.scores.negative * 100)}%
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Tone Analysis */}
              <div className="space-y-3">
                <h4 className="font-medium">Tone & Brand Voice</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Brand Alignment</span>
                    <span className={getScoreColor(analysis.tone.brand_alignment)}>
                      {analysis.tone.brand_alignment}%
                    </span>
                  </div>
                  <Progress value={analysis.tone.brand_alignment} className="h-2" />
                </div>
                {analysis.tone.characteristics.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Detected characteristics:</p>
                    <div className="flex flex-wrap gap-1">
                      {analysis.tone.characteristics.map((char) => (
                        <Badge key={char} variant="secondary" className="text-xs">
                          {char}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Medical Terminology */}
              <div className="space-y-3">
                <h4 className="font-medium">Medical & Regulatory Analysis</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Clinical Language Score</span>
                    <span className={getScoreColor(analysis.medical_terminology.clinical_language_score)}>
                      {analysis.medical_terminology.clinical_language_score}%
                    </span>
                  </div>
                  <Progress value={analysis.medical_terminology.clinical_language_score} className="h-2" />
                </div>
                
                {analysis.medical_terminology.medical_terms.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Medical terms detected:</p>
                    <div className="flex flex-wrap gap-1">
                      {analysis.medical_terminology.medical_terms.slice(0, 8).map((term) => (
                        <Badge key={term} variant="outline" className="text-xs">
                          {term}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {analysis.medical_terminology.regulatory_flags.length > 0 && (
                  <div>
                    <p className="text-sm text-destructive mb-2 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Regulatory flags:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {analysis.medical_terminology.regulatory_flags.map((flag) => (
                        <Badge key={flag} variant="destructive" className="text-xs">
                          {flag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Brand Voice Check */}
              <div className="space-y-3">
                <h4 className="font-medium">Brand Voice Consistency</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Voice Consistency</span>
                    <span className={getScoreColor(analysis.brand_voice.voice_consistency)}>
                      {analysis.brand_voice.voice_consistency}%
                    </span>
                  </div>
                  <Progress value={analysis.brand_voice.voice_consistency} className="h-2" />
                </div>

                {analysis.brand_voice.detected_attributes.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-green-600" />
                      Present attributes:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {analysis.brand_voice.detected_attributes.map((attr) => (
                        <Badge key={attr} variant="default" className="text-xs">
                          {attr}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {analysis.brand_voice.missing_attributes.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Missing attributes:</p>
                    <div className="flex flex-wrap gap-1">
                      {analysis.brand_voice.missing_attributes.map((attr) => (
                        <Badge key={attr} variant="outline" className="text-xs">
                          {attr}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Content Semantics */}
              <div className="space-y-3">
                <h4 className="font-medium">Content Structure</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Readability Score</p>
                    <p className="text-2xl font-semibold">
                      {analysis.semantics.readability_score}/100
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Content Categories</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {analysis.semantics.content_categories.map((category) => (
                        <Badge key={category} variant="secondary" className="text-xs">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                {analysis.semantics.key_concepts.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Key concepts:</p>
                    <div className="flex flex-wrap gap-1">
                      {analysis.semantics.key_concepts.slice(0, 10).map((concept) => (
                        <Badge key={concept} variant="outline" className="text-xs">
                          {concept}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          {(analysis.brand_voice.recommendations.length > 0 || 
            Object.keys(analysis.medical_terminology.suggested_alternatives).length > 0) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  AI Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {analysis.brand_voice.recommendations.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Brand Voice Improvements</h4>
                    <ul className="space-y-1">
                      {analysis.brand_voice.recommendations.map((rec, index) => (
                        <li key={index} className="text-sm flex items-start gap-2">
                          <span className="text-blue-500 mt-1">•</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {Object.keys(analysis.medical_terminology.suggested_alternatives).length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Suggested Alternatives</h4>
                    <div className="space-y-2">
                      {Object.entries(analysis.medical_terminology.suggested_alternatives).map(([term, alt]) => (
                        <div key={term} className="text-sm">
                          <span className="font-medium text-destructive">"{term}"</span>
                          <span className="mx-2">→</span>
                          <span className="text-green-600">"{alt}"</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};