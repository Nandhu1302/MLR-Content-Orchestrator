
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Brain,
  Globe,
  Shield,
  TrendingUp,
  Users,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Target,
  RefreshCw,
  Save
} from 'lucide-react';
import { IntelligentTerminologyDashboard } from '../intelligence/IntelligentTerminologyDashboard';
import { CulturalIntelligenceWidget } from '../intelligence/CulturalIntelligenceWidget';
import { RegulatoryIntelligenceDashboard } from '../intelligence/RegulatoryIntelligenceDashboard';
import { PredictiveQualityDashboard } from '../intelligence/PredictiveQualityDashboard';
import { AgencyIntelligencePortal } from '../intelligence/AgencyIntelligencePortal';
import { useIntelligenceAutoSave } from '@/hooks/useIntelligenceAutoSave';

export const UnifiedIntelligenceStep = ({
  assetId,
  brandId,
  projectId,
  targetMarkets = [],
  therapeuticArea = 'general',
  asset,
  stepData,
  onIntelligenceComplete,
  onStepComplete,
  onNext,
  onPrevious
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [intelligenceData, setIntelligenceData] = useState({});
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalysisCompleted, setHasAnalysisCompleted] = useState(false);
  const [isReadyToContinue, setIsReadyToContinue] = useState(false);

  // Auto-save hook for intelligence data
  const autoSaveStatus = useIntelligenceAutoSave({
    intelligenceData,
    projectId: projectId ?? null,
    assetId: assetId ?? '',
    brandId: brandId ?? '',
    market: targetMarkets[0] ?? 'global',
    enabled: !!projectId && Object.keys(intelligenceData).length > 0
  });

  // Stable reference for targetMarkets
  const stableTargetMarkets = useMemo(() => targetMarkets.slice().sort(), [targetMarkets]);

  // Unique key for analysis
  const analysisKey = useMemo(
    () => `${assetId}_${brandId}_${stableTargetMarkets.join(',')}_${therapeuticArea}`,
    [assetId, brandId, stableTargetMarkets, therapeuticArea]
  );

  // Trigger analysis once per unique combination
  useEffect(() => {
    if (!hasAnalysisCompleted && analysisKey && !isAnalyzing) {
      performIntelligenceAnalysis();
    }
  }, [analysisKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const performIntelligenceAnalysis = useCallback(async () => {
    if (hasAnalysisCompleted) return;
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setIsReadyToContinue(false);

    try {
      setAnalysisProgress(25);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAnalysisProgress(50);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAnalysisProgress(100);

      const completeIntelligence = {
        terminologyIntelligence: {
          complianceScore: 94,
          criticalTerms: 12,
          preApprovedTerms: 156,
          culturalAdaptations: 8
        },
        culturalIntelligence: {
          adaptationComplexity: 'medium',
          riskFactors: 3,
          marketReadiness: 85,
          requiredAdaptations: 6
        },
        regulatoryIntelligence: {
          complianceScore: 91,
          criticalRequirements: 4,
          approvalTimeline: '14-21 days',
          riskLevel: 'low'
        },
        qualityPrediction: {
          predictedScore: 88,
          confidenceLevel: 92,
          potentialIssues: 2,
          reviewTime: '5-7 days'
        },
        overallReadiness: 89
      };

      setIntelligenceData(completeIntelligence);
      setHasAnalysisCompleted(true);
      setIsReadyToContinue(true);
      onIntelligenceComplete?.(completeIntelligence);
    } catch (error) {
      console.error('Intelligence analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [hasAnalysisCompleted, onIntelligenceComplete]);

  const handleCompleteStep = useCallback(() => {
    if (intelligenceData && onStepComplete) {
      onStepComplete(intelligenceData);
      setIsReadyToContinue(false);
    }
  }, [intelligenceData, onStepComplete]);

  const handleReAnalyze = useCallback(() => {
    setHasAnalysisCompleted(false);
    setIntelligenceData({});
    setIsReadyToContinue(false);
    performIntelligenceAnalysis();
  }, [performIntelligenceAnalysis]);

  if (isAnalyzing) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Brain className="h-5 w-5 text-primary animate-pulse" />
            <h3 className="text-lg font-semibold">Performing Intelligence Analysis</h3>
          </div>
          <Progress value={analysisProgress} className="w-full" />
          <div className="text-sm text-muted-foreground">
            {analysisProgress < 25 && 'Analyzing terminology compliance...'}
            {analysisProgress >= 25 && analysisProgress < 50 && 'Evaluating cultural adaptations...'}
            {analysisProgress >= 50 && 'Generating quality predictions...'}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Unified Intelligence Dashboard</h3>
            </div>
            <div className="flex items-center gap-2">
              {autoSaveStatus.isSaving && (
                <Badge variant="outline" className="text-xs animate-pulse">
                  <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                  Auto-saving...
                </Badge>
              )}
              {!autoSaveStatus.isSaving && autoSaveStatus.lastSaved && (
                <Badge variant="outline" className="text-xs">
                  <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                  Saved {Math.floor((Date.now() - autoSaveStatus.lastSaved.getTime()) / 1000)}s ago
                </Badge>
              )}
              <Badge variant="default">
                <CheckCircle className="h-3 w-3 mr-1" />
                Analysis Complete
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReAnalyze}
                className="flex items-center gap-1"
              >
                <RefreshCw className="h-3 w-3" />
                Re-analyze
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded">
              <div className="text-2xl font-bold text-green-600">
                {intelligenceData.terminologyIntelligence?.complianceScore ?? 0}%
              </div>
              <div className="text-sm text-muted-foreground">Terminology</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded">
              <div className="text-2xl font-bold text-blue-600">
                {intelligenceData.culturalIntelligence?.marketReadiness ?? 0}%
              </div>
              <div className="text-sm text-muted-foreground">Cultural</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded">
              <div className="text-2xl font-bold text-purple-600">
                {intelligenceData.regulatoryIntelligence?.complianceScore ?? 0}%
              </div>
              <div className="text-sm text-muted-foreground">Regulatory</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded">
              <div className="text-2xl font-bold text-orange-600">
                {intelligenceData.qualityPrediction?.predictedScore ?? 0}%
              </div>
              <div className="text-sm text-muted-foreground">Quality</div>
            </div>
          </div>
        </div>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="terminology">Terminology</TabsTrigger>
          <TabsTrigger value="cultural">Cultural</TabsTrigger>
          <TabsTrigger value="regulatory">Regulatory</TabsTrigger>
          <TabsTrigger value="quality">Quality</TabsTrigger>
          <TabsTrigger value="agency">Agency Portal</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card className="p-4">
            <h4 className="font-medium mb-3">Intelligence Summary</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                <span className="text-sm">Terminology compliance ready</span>
                <Badge variant="outline">94% Complete</Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                <span className="text-sm">Cultural adaptations required</span>
                <Badge variant="outline">Medium Priority</Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                <span className="text-sm">Regulatory review needed</span>
                <Badge variant="outline">Standard Process</Badge>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="terminology">
          <IntelligentTerminologyDashboard
            assetId={assetId ?? asset?.id ?? 'demo-asset'}
            brandId={brandId ?? asset?.brand_id ?? 'demo-brand'}
            targetMarkets={targetMarkets}
            therapeuticArea={therapeuticArea}
            onTermSelect={(term) => console.log('Selected term:', term)}
          />
        </TabsContent>

        <TabsContent value="cultural">
          <CulturalIntelligenceWidget
            assetContent="Sample asset content"
            assetType="Email template"
            targetMarkets={targetMarkets}
            brandId={brandId}
            onAdaptationApply={(adaptation) => console.log('Selected adaptation:', adaptation)}
          />
        </TabsContent>

        <TabsContent value="regulatory">
          <RegulatoryIntelligenceDashboard
            assetId={assetId}
            brandId={brandId}
            targetMarkets={targetMarkets}
            therapeuticArea={therapeuticArea}
            onComplianceAction={(action) => console.log('Compliance action:', action)}
          />
        </TabsContent>

        <TabsContent value="quality">
          <PredictiveQualityDashboard
            assetId={assetId}
            localizationContext={{ brandId, therapeuticArea }}
            targetMarkets={targetMarkets}
            onReviewerAssign={(assignments) => console.log('Reviewer assigned:', assignments)}
            onQualityAction={(action) => console.log('Quality action:', action)}
          />
        </TabsContent>

        <TabsContent value="agency">
          <AgencyIntelligencePortal
            assetId={assetId}
            brandId={brandId}
            projectData={{ targetMarkets, therapeuticArea }}
            localizationContext={{ targetMarkets, therapeuticArea, brandId }}
            onExportIntelligence={(format) => console.log('Export requested:', format)}
            onUpdateProgress={(progress) => console.log('Progress update:', progress)}
          />
        </TabsContent>
      </Tabs>

      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onPrevious}>
          Previous: Market Selection
        </Button>
        <div className="flex items-center gap-3">
          {isReadyToContinue && (
            <Button
              onClick={handleCompleteStep}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Complete Intelligence Analysis
            </Button>
          )}
          <Button
            onClick={onNext}
            disabled={!hasAnalysisCompleted}
            variant={hasAnalysisCompleted ? 'default' : 'outline'}
          >
            Continue to Optimization
          </Button>
        </div>
      </div>
    </div>
  );
};
