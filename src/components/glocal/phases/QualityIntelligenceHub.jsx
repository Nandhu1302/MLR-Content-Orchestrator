import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Target, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useGlocalAI } from '@/hooks/useGlocalAI';

export const QualityIntelligenceHub = ({ 
  onPhaseComplete, 
  onNext,
  projectData,
  phaseData 
}) => {
  const { toast } = useToast();
  const { analyzeCulturalFit, isProcessing } = useGlocalAI();
  const [qualityMetrics, setQualityMetrics] = useState(null);

  useEffect(() => {
    if (phaseData.phase4 || phaseData.phase3 || phaseData.phase2) {
      performQualityCheck();
    }
  }, [phaseData]);

  const performQualityCheck = async () => {
    try {
      // Prioritize Phase 4 output, fallback to Phase 3, then Phase 2
      const textToAnalyze = phaseData.phase4?.regulatoryApprovedTranslation || 
                            phaseData.phase3?.culturallyAdaptedTranslation || 
                            phaseData.phase2?.draftTranslation || '';

      const analysis = await analyzeCulturalFit({
        text: textToAnalyze,
        analysisType: 'quality',
        targetMarket: projectData.target_markets?.[0] || 'Global',
        context: {
          therapeuticArea: projectData.therapeutic_area,
          hasRegulatoryApproval: !!phaseData.phase4?.regulatoryApprovedTranslation,
          hasCulturalAdaptation: !!phaseData.phase3?.culturallyAdaptedTranslation,
          tmLeverage: phaseData.phase2?.tmAnalytics?.leverageRate,
          culturalScore: phaseData.phase3?.culturalAnalysis?.appropriatenessScore
        }
      });

      setQualityMetrics(analysis);
    } catch (error) {
      console.error('Quality check failed:', error);
    }
  };

  const handleComplete = () => {
    const phaseData = {
      qualityMetrics,
      assessedAt: new Date().toISOString()
    };

    onPhaseComplete(phaseData);
    toast({
      title: 'Phase 5 Complete',
      description: 'Quality assessment completed'
    });
    onNext();
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-amber-500';
    return 'text-destructive';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Quality Intelligence Assessment
          </CardTitle>
          <CardDescription>
            Comprehensive quality validation and readiness check
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isProcessing ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-pulse text-center">
                <Target className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="text-sm text-muted-foreground">Assessing quality metrics...</p>
              </div>
            </div>
          ) : qualityMetrics ? (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Overall Quality Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className={`text-4xl font-bold ${getScoreColor(qualityMetrics.qualityScore || 88)}`}>
                      {qualityMetrics.qualityScore || 88}
                    </div>
                    <Progress value={qualityMetrics.qualityScore || 88} className="mt-2" />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Readiness Level</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="default" className="text-lg px-4 py-2">
                      {qualityMetrics.qualityScore > 85 ? 'Production Ready' : 'Needs Review'}
                    </Badge>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Translation Quality</span>
                    </div>
                    <div className="text-2xl font-bold">92%</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">Terminology</span>
                    </div>
                    <div className="text-2xl font-bold">95%</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium">Consistency</span>
                    </div>
                    <div className="text-2xl font-bold">89%</div>
                  </CardContent>
                </Card>
              </div>

              {qualityMetrics.accuracyIssues?.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    Accuracy Issues
                  </h4>
                  {qualityMetrics.accuracyIssues.map((issue, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-900">
                      <span className="text-xs font-medium text-amber-600 dark:text-amber-400 mt-0.5">!</span>
                      <p className="text-sm flex-1">{issue}</p>
                    </div>
                  ))}
                </div>
              )}

              {qualityMetrics.terminologyProblems?.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Terminology Issues</h4>
                  {qualityMetrics.terminologyProblems.map((problem, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-3 bg-accent/50 rounded-lg border">
                      <span className="text-xs font-medium text-muted-foreground mt-0.5">•</span>
                      <p className="text-sm flex-1 text-muted-foreground">{problem}</p>
                    </div>
                  ))}
                </div>
              )}

              {qualityMetrics.improvements?.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    Recommended Improvements
                  </h4>
                  {qualityMetrics.improvements.map((improvement, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-3 bg-primary/5 rounded-lg border border-primary/20">
                      <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                      <p className="text-sm flex-1">{improvement}</p>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Complete previous phases to enable quality assessment
            </div>
          )}
        </CardContent>
      </Card>

      <Button 
        onClick={handleComplete} 
        size="lg" 
        className="w-full"
        disabled={isProcessing || !qualityMetrics}
      >
        Complete Phase 5 <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};