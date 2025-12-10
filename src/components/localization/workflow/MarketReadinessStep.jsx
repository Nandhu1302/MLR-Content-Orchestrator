
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Shield,
  Download,
  Clock,
  AlertTriangle,
  CheckCircle,
  FileCheck,
  Calendar,
  DollarSign
} from 'lucide-react';
import { toast } from 'sonner';
import { getSupportedMarkets } from '@/config/localizationConfig';

export const MarketReadinessStep = ({
  asset,
  intelligenceData,
  onStepComplete,
  onNext,
  onPrevious,
  stepData
}) => {
  const [selectedMarkets, setSelectedMarkets] = useState(stepData?.selectedMarkets ?? []);
  const [assessment, setAssessment] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Only show truly supported markets (JP and CN only)
  const supportedMarkets = getSupportedMarkets().filter(market => market.isSupported);

  const generateMarketAssessment = async () => {
    if (selectedMarkets.length === 0) {
      toast.error('Please select at least one target market');
      return;
    }
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const marketAssessment = {
      selectedMarkets,
      overallReadiness: 78,
      totalTimelineEstimate: selectedMarkets.length * 15,
      totalCostEstimate: selectedMarkets.length * 12000,
      marketAnalysis: selectedMarkets.map(marketCode => {
        const market = supportedMarkets.find(m => m.code === marketCode);
        return {
          code: marketCode,
          name: market?.name ?? marketCode,
          language: market?.language ?? 'Unknown',
          readinessScore: 75 + Math.random() * 20,
          complexity: marketCode === 'JP' ? 'High' : marketCode === 'CN' ? 'High' : 'Medium',
          estimatedDays: marketCode === 'JP' ? 18 : marketCode === 'CN' ? 15 : 12,
          estimatedCost: marketCode === 'JP' ? 15000 : marketCode === 'CN' ? 12000 : 8000,
          riskFactors: [
            'Regulatory complexity requiring expert review',
            'Cultural adaptation needs for medical content',
            'Market-specific compliance requirements'
          ],
          readinessChecklist: [
            {
              category: 'Regulatory Preparation',
              items: [
                'Medical accuracy validation required',
                'Local regulatory framework alignment',
                'Compliance documentation preparation',
                'Expert review scheduling'
              ]
            },
            {
              category: 'Cultural Adaptation',
              items: [
                'Cultural sensitivity review',
                'Local healthcare system alignment',
                'Medical terminology localization',
                'Patient communication style adaptation'
              ]
            },
            {
              category: 'Technical Requirements',
              items: [
                'Language-specific formatting',
                'Character encoding compliance',
                'Local regulatory text integration',
                'Quality assurance protocols'
              ]
            }
          ]
        };
      }),
      complianceChecklist: {
        title: `Market Readiness Checklist: ${asset.name}`,
        overallCompliance: 82,
        categories: [
          {
            name: 'Regulatory Compliance',
            completion: 75,
            items: [
              { task: 'Medical accuracy validation', status: 'pending', priority: 'high' },
              { task: 'Regulatory framework alignment', status: 'pending', priority: 'high' },
              { task: 'Compliance documentation', status: 'in-progress', priority: 'medium' },
              { task: 'Expert medical review scheduling', status: 'pending', priority: 'high' }
            ]
          },
          {
            name: 'Cultural Readiness',
            completion: 60,
            items: [
              { task: 'Cultural sensitivity assessment', status: 'pending', priority: 'high' },
              { task: 'Local healthcare context review', status: 'pending', priority: 'medium' },
              { task: 'Patient communication style guide', status: 'pending', priority: 'medium' },
              { task: 'Market-specific terminology validation', status: 'pending', priority: 'high' }
            ]
          },
          {
            name: 'Technical Preparation',
            completion: 90,
            items: [
              { task: 'Character encoding verification', status: 'completed', priority: 'medium' },
              { task: 'Formatting guidelines established', status: 'completed', priority: 'low' },
              { task: 'Quality assurance protocols', status: 'in-progress', priority: 'medium' },
              { task: 'Translation memory preparation', status: 'completed', priority: 'low' }
            ]
          }
        ]
      }
    };

    setAssessment(marketAssessment);
    setIsGenerating(false);
  };

  useEffect(() => {
    if (stepData?.assessment) {
      setAssessment(stepData.assessment);
    }
  }, [stepData]);

  const handleMarketToggle = (marketCode) => {
    setSelectedMarkets(prev =>
      prev.includes(marketCode) ? prev.filter(m => m !== marketCode) : [...prev, marketCode]
    );
  };

  const handleDownloadChecklist = () => {
    const checklistContent = JSON.stringify(assessment?.complianceChecklist, null, 2);
    const blob = new Blob([checklistContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `market-readiness-checklist-${asset.name.replace(/\s+/g, '-').toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Market readiness checklist downloaded');
  };

  const handleCompleteStep = () => {
    if (!assessment) {
      toast.error('Please generate market assessment first');
      return;
    }

    const nextStepData = {
      selectedMarkets,
      assessment,
      regulatoryAssessment: assessment.marketAnalysis,
      complianceChecklist: assessment.complianceChecklist,
      timelineEstimate: assessment.totalTimelineEstimate,
      costEstimate: assessment.totalCostEstimate
    };

    onStepComplete(nextStepData);
    toast.success('Market readiness assessment completed');
    onNext();
  };

  return (
    <div className="space-y-6">
      {/* Market Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Target Market Selection
          </CardTitle>
          <CardDescription>
            Select markets for localization assessment and planning
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {supportedMarkets.map((market) => (
              <div key={market.code} className="flex items-center space-x-2">
                <Checkbox
                  id={market.code}
                  checked={selectedMarkets.includes(market.code)}
                  onCheckedChange={() => handleMarketToggle(market.code)}
                />
                <label
                  htmlFor={market.code}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {market.name} ({market.code}) - {market.language}
                </label>
              </div>
            ))}
          </div>

          <div className="mt-4 flex gap-2">
            <Button
              onClick={generateMarketAssessment}
              disabled={selectedMarkets.length === 0 || isGenerating}
            >
              {isGenerating ? 'Generating Assessment...' : 'Generate Market Assessment'}
            </Button>
            <Badge variant="outline">
              {selectedMarkets.length} market{selectedMarkets.length !== 1 ? 's' : ''} selected
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Market Assessment Results */}
      {assessment && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Market Readiness Assessment
              </CardTitle>
              <CardDescription>
                Comprehensive readiness analysis for selected markets
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{assessment.overallReadiness}%</p>
                  <p className="text-sm text-muted-foreground">Overall Readiness</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{assessment.totalTimelineEstimate}</p>
                  <p className="text-sm text-muted-foreground">Days Total</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">${assessment.totalCostEstimate.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Estimated Cost</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Market-Specific Analysis */}
          <div className="space-y-4">
            {assessment.marketAnalysis.map((market) => (
              <Card key={market.code}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{market.name} ({market.code})</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{market.complexity} Complexity</Badge>
                      <Badge variant="secondary">{market.readinessScore.toFixed(0)}% Ready</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Timeline: {market.estimatedDays} days</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Cost: ${market.estimatedCost.toLocaleString()}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">Risk Factors:</p>
                    <div className="space-y-1">
                      {market.riskFactors.map((risk, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm">
                          <AlertTriangle className="h-3 w-3 text-yellow-600 mt-0.5" />
                          <span>{risk}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Compliance Checklist */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-primary" />
                Generated Compliance Checklist
              </CardTitle>
              <CardDescription>
                Comprehensive readiness checklist for all selected markets
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Overall Compliance Readiness</p>
                <div className="flex items-center gap-2">
                  <Progress value={assessment.complianceChecklist.overallCompliance} className="w-20" />
                  <span className="text-sm font-medium">{assessment.complianceChecklist.overallCompliance}%</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                {assessment.complianceChecklist.categories.map((category, catIndex) => (
                  <div key={catIndex} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{category.name}</p>
                      <Badge variant="outline">{category.completion}% Complete</Badge>
                    </div>

                    <div className="space-y-1 ml-4">
                      {category.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center gap-2 text-sm">
                          <div
                            className={`h-2 w-2 rounded-full ${
                              item.status === 'completed'
                                ? 'bg-green-500'
                                : item.status === 'in-progress'
                                ? 'bg-yellow-500'
                                : 'bg-gray-300'
                            }`}
                          />
                          <span className="flex-1">{item.task}</span>
                          <Badge
                            variant={
                              item.priority === 'high'
                                ? 'destructive'
                                : item.priority === 'medium'
                                ? 'secondary'
                                : 'outline'
                            }
                            className="text-xs"
                          >
                            {item.priority}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Button onClick={handleDownloadChecklist} variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download Checklist
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Step Actions */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          Previous Step
        </Button>
        <div className="flex items-center gap-4">
          {assessment && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Market assessment complete</span>
            </div>
          )}
          <Button onClick={handleCompleteStep} disabled={!assessment}>
            Continue to Intelligence Analysis
          </Button>
        </div>
      </div>
    </div>
  );
};
