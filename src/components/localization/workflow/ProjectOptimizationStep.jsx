
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Zap,
  Calendar,
  Users,
  Package,
  CheckCircle,
  Target,
  Clock,
  DollarSign
} from 'lucide-react';
import { AutomatedHandoffGenerator } from '../AutomatedHandoffGenerator';

export const ProjectOptimizationStep = ({
  assetId,
  projectId,
  targetMarkets = [],
  asset,
  stepData,
  intelligenceData,
  marketData,
  onOptimizationComplete,
  onStepComplete,
  onCreateProject,
  onNext,
  onPrevious
}) => {
  const [activeTab, setActiveTab] = useState('optimization');
  const [optimizationData, setOptimizationData] = useState({});
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState(0);

  useEffect(() => {
    performProjectOptimization();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assetId, targetMarkets, intelligenceData]);

  const performProjectOptimization = async () => {
    setIsOptimizing(true);
    setOptimizationProgress(0);
    try {
      setOptimizationProgress(25);
      await new Promise(resolve => setTimeout(resolve, 800));
      setOptimizationProgress(75);
      await new Promise(resolve => setTimeout(resolve, 800));
      setOptimizationProgress(100);

      const optimizationResults = {
        timelineOptimization: {
          originalTimeline: 28,
          optimizedTimeline: 19,
          savings: 9,
          parallelTasks: 6,
          criticalPath: ['Cultural Adaptation', 'Regulatory Review', 'Quality Assurance']
        },
        resourceOptimization: {
          requiredReviewers: 4,
          suggestedReviewers: [
            { name: 'Dr. Sarah Chen', expertise: 'Regulatory - China/Japan', availability: '85%' },
            { name: 'Marcus Weber', expertise: 'Translation - German/EU', availability: '92%' }
          ],
          workloadDistribution: 'Optimal'
        },
        qualityOptimization: {
          predictedQuality: 91,
          riskMitigation: [
            'Early cultural review for China market',
            'Parallel regulatory submission preparation'
          ],
          qualityGates: 4
        },
        costOptimization: {
          estimatedCost: 15420,
          potentialSavings: 3280,
          savingsBreakdown: {
            'TM Leverage': 1200,
            'Parallel Processing': 1580,
            'Risk Reduction': 500
          }
        }
      };

      setOptimizationData(optimizationResults);
      onOptimizationComplete?.(optimizationResults);
      onStepComplete?.(optimizationResults);
    } catch (error) {
      console.error('Optimization error:', error);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleHandoffComplete = (handoffData) => {
    console.log('Handoff package ready:', handoffData);
  };

  if (isOptimizing) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Zap className="h-5 w-5 text-primary animate-pulse" />
            <h3 className="text-lg font-semibold">Optimizing Project</h3>
          </div>
          <Progress value={optimizationProgress} className="w-full" />
          <div className="text-sm text-muted-foreground">
            {optimizationProgress < 25 && 'Analyzing timeline optimization...'}
            {optimizationProgress >= 25 && optimizationProgress < 75 && 'Optimizing resources...'}
            {optimizationProgress >= 75 && 'Finalizing optimization...'}
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
              <Zap className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Project Optimization Results</h3>
            </div>
            <Badge variant="default" className="bg-green-500">
              <CheckCircle className="h-3 w-3 mr-1" />
              Optimized
            </Badge>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded border">
              <div className="text-2xl font-bold text-green-600">
                -{optimizationData.timelineOptimization?.savings ?? 0} days
              </div>
              <div className="text-sm text-muted-foreground">Time Saved</div>
            </div>

            <div className="text-center p-4 bg-blue-50 rounded border">
              <div className="text-2xl font-bold text-blue-600">
                {optimizationData.qualityOptimization?.predictedQuality ?? 0}%
              </div>
              <div className="text-sm text-muted-foreground">Quality Score</div>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded border">
              <div className="text-2xl font-bold text-purple-600">
                ${optimizationData.costOptimization?.potentialSavings ?? 0}
              </div>
              <div className="text-sm text-muted-foreground">Cost Savings</div>
            </div>

            <div className="text-center p-4 bg-orange-50 rounded border">
              <div className="text-2xl font-bold text-orange-600">
                {optimizationData.resourceOptimization?.requiredReviewers ?? 0}
              </div>
              <div className="text-sm text-muted-foreground">Reviewers</div>
            </div>
          </div>
        </div>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="optimization">Overview</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="handoff">Handoff</TabsTrigger>
        </TabsList>

        <TabsContent value="optimization" className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <Card className="p-4">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600" />
                Timeline Optimization
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Original Timeline:</span>
                  <span className="font-medium">
                    {optimizationData.timelineOptimization?.originalTimeline} days
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Optimized Timeline:</span>
                  <span className="font-medium text-green-600">
                    {optimizationData.timelineOptimization?.optimizedTimeline} days
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                Cost Optimization
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Estimated Cost:</span>
                  <span className="font-medium">${optimizationData.costOptimization?.estimatedCost}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span className="text-sm font-medium">Savings:</span>
                  <span className="font-bold">${optimizationData.costOptimization?.potentialSavings}</span>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <Card className="p-4">
            <h4 className="font-medium mb-4">Critical Path</h4>
            <div className="flex gap-2 flex-wrap">
              {optimizationData.timelineOptimization?.criticalPath?.map((task, index) => (
                <Badge key={index} variant="destructive">
                  {task}
                </Badge>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <Card className="p-4">
            <h4 className="font-medium mb-4">Suggested Reviewers</h4>
            <div className="space-y-4">
              {optimizationData.resourceOptimization?.suggestedReviewers?.map((reviewer, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded">
                  <div>
                    <div className="font-medium">{reviewer.name}</div>
                    <div className="text-sm text-muted-foreground">{reviewer.expertise}</div>
                  </div>
                  <div className="font-medium">{reviewer.availability}</div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="handoff">
          <AutomatedHandoffGenerator
            assetId={assetId ?? asset?.id ?? 'demo-asset'}
            projectId={projectId ?? asset?.project_id ?? 'demo-project'}
            targetMarkets={targetMarkets}
            onHandoffComplete={handleHandoffComplete}
          />
        </TabsContent>
      </Tabs>

      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onPrevious}>
          Previous: Intelligence Analysis
        </Button>
        <Button onClick={onNext} className="bg-green-600 hover:bg-green-700">
          Launch Localization Project
        </Button>
      </div>
    </div>
  );
};
