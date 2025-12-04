import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Zap, 
  CheckCircle,
  Target,
  Clock,
  DollarSign,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { AutomatedHandoffGenerator } from './AutomatedHandoffGenerator';
import { InteractiveProjectConfigurator } from './intelligence/InteractiveProjectConfigurator';

export const ProjectCreationTab = ({
  asset,
  intelligenceData,
  onCreateProject,
  onBack
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [optimizationData, setOptimizationData] = useState({});
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  const [isReadyToCreate, setIsReadyToCreate] = useState(false);
  
  // Track optimization state to prevent loops
  const lastOptimizedRef = useRef('');
  const optimizationInProgressRef = useRef(false);

  // Stabilize the optimization key to prevent infinite loops
  const optimizationKey = useMemo(() => {
    return `${asset?.id || 'no-asset'}-${intelligenceData?.overall || 0}`;
  }, [asset?.id, intelligenceData?.overall]);

  const performProjectOptimization = useCallback(async () => {
    // Prevent multiple simultaneous optimizations and re-optimization of same data
    if (optimizationInProgressRef.current || lastOptimizedRef.current === optimizationKey) {
      return;
    }

    optimizationInProgressRef.current = true;
    lastOptimizedRef.current = optimizationKey;
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
        qualityOptimization: {
          predictedQuality: intelligenceData?.overall || 91,
          riskMitigation: [
            'Early cultural review for selected markets',
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
        },
        marketPriority: {
          highPriority: ['United States', 'Germany'],
          mediumPriority: ['United Kingdom', 'Japan'],
          lowPriority: ['Canada', 'Australia']
        }
      };

      setOptimizationData(optimizationResults);
      setIsReadyToCreate(true);
    } catch (error) {
      console.error('Optimization error:', error);
    } finally {
      setIsOptimizing(false);
      optimizationInProgressRef.current = false;
    }
  }, [optimizationKey, intelligenceData?.overall]);

  useEffect(() => {
    performProjectOptimization();
  }, [performProjectOptimization]);

  const handleHandoffComplete = (handoffData) => {
    console.log('Handoff package ready:', handoffData);
  };

  const handleCreateProject = () => {
    if (isReadyToCreate) {
      onCreateProject();
    }
  };

  if (isOptimizing) {
    return (
      <div className="space-y-6">
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Zap className="h-5 w-5 text-primary animate-pulse" />
              <h3 className="text-lg font-semibold">Optimizing Project</h3>
            </div>
            
            <Progress value={optimizationProgress} className="w-full" />
            
            <div className="text-sm text-muted-foreground">
              {optimizationProgress < 25 && 'Analyzing timeline optimization...'}
              {optimizationProgress >= 25 && optimizationProgress < 75 && 'Calculating cost savings...'}
              {optimizationProgress >= 75 && 'Finalizing optimization...'}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Zap className="h-6 w-6 text-primary" />
              Project Creation
            </h2>
            <p className="text-muted-foreground">
              Optimized localization project for {asset?.name || 'Selected Asset'}
            </p>
          </div>
          <Badge variant="default" className="bg-green-500">
            <CheckCircle className="h-3 w-3 mr-1" />
            Optimized
          </Badge>
        </div>

        {/* Optimization Summary */}
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center p-4 bg-green-50 rounded border">
            <div className="text-2xl font-bold text-green-600">
              -{optimizationData.timelineOptimization?.savings || 0} days
            </div>
            <div className="text-sm text-muted-foreground">Time Saved</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded border">
            <div className="text-2xl font-bold text-blue-600">
              {optimizationData.qualityOptimization?.predictedQuality || 0}%
            </div>
            <div className="text-sm text-muted-foreground">Quality Score</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded border">
            <div className="text-2xl font-bold text-purple-600">
              ${optimizationData.costOptimization?.potentialSavings || 0}
            </div>
            <div className="text-sm text-muted-foreground">Cost Savings</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded border">
            <div className="text-2xl font-bold text-orange-600">
              {optimizationData.timelineOptimization?.optimizedTimeline || 0}
            </div>
            <div className="text-sm text-muted-foreground">Days to Complete</div>
          </div>
        </div>
      </Card>

      {/* Project Details */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Project Overview</TabsTrigger>
          <TabsTrigger value="handoff">Handoff Package</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Interactive Configuration */}
          <InteractiveProjectConfigurator
            onConfigurationChange={(config) => {
              console.log('Project configuration updated:', config);
              // Update optimization data based on configuration
              setOptimizationData(prev => ({
                ...prev,
                configuredMarkets: config.targetMarkets,
                customTimeline: config.timeline[0],
                customBudget: config.budget[0]
              }));
            }}
            initialConfig={{
              targetMarkets: ['us', 'de'],
              timeline: [optimizationData.timelineOptimization?.optimizedTimeline / 7 || 3],
              budget: [optimizationData.costOptimization?.estimatedCost || 15000]
            }}
          />

          <div className="grid grid-cols-2 gap-6">
            <Card className="p-4">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600" />
                Timeline Optimization
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Original Timeline:</span>
                  <span className="font-medium">{optimizationData.timelineOptimization?.originalTimeline} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Optimized Timeline:</span>
                  <span className="font-medium text-green-600">{optimizationData.timelineOptimization?.optimizedTimeline} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Time Savings:</span>
                  <span className="font-medium text-green-600">-{optimizationData.timelineOptimization?.savings} days</span>
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

          <Card className="p-4">
            <h4 className="font-medium mb-4 flex items-center gap-2">
              <Target className="h-4 w-4 text-purple-600" />
              Market Prioritization
            </h4>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-sm font-medium mb-2 text-green-600">High Priority</div>
                <div className="space-y-1">
                  {optimizationData.marketPriority?.highPriority?.map((market, index) => (
                    <Badge key={index} variant="default" className="bg-green-500 text-xs">
                      {market}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium mb-2 text-yellow-600">Medium Priority</div>
                <div className="space-y-1">
                  {optimizationData.marketPriority?.mediumPriority?.map((market, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {market}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium mb-2 text-blue-600">Future Phase</div>
                <div className="space-y-1">
                  {optimizationData.marketPriority?.lowPriority?.map((market, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {market}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h4 className="font-medium mb-4">Critical Path</h4>
            <div className="flex gap-2 flex-wrap">
              {optimizationData.timelineOptimization?.criticalPath?.map((task, index) => (
                <Badge key={index} variant="destructive">{task}</Badge>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <h4 className="font-medium mb-4">Quality Optimization</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Predicted Quality Score:</span>
                <span className="font-medium text-blue-600">{optimizationData.qualityOptimization?.predictedQuality}%</span>
              </div>
              <div>
                <div className="text-sm font-medium mb-2">Risk Mitigation:</div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {optimizationData.qualityOptimization?.riskMitigation?.map((item, index) => (
                    <li key={index}>• {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="handoff">
          <AutomatedHandoffGenerator
            assetId={asset?.id || 'demo-asset'}
            projectId={asset?.project_id || 'demo-project'}
            targetMarkets={intelligenceData?.targetMarkets || ['United States', 'Germany']}
            onHandoffComplete={handleHandoffComplete}
          />
        </TabsContent>
      </Tabs>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Intelligence
        </Button>
        <Button 
          onClick={handleCreateProject}
          disabled={!isReadyToCreate}
          className="bg-green-600 hover:bg-green-700"
        >
          Create Localization Project
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};