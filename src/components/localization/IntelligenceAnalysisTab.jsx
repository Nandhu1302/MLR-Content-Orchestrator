import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, ArrowLeft, ArrowRight, Globe, ChevronDown, ChevronUp } from 'lucide-react';
import { IntelligentTerminologyDashboard } from './intelligence/IntelligentTerminologyDashboard';
import { CulturalIntelligenceWidget } from './intelligence/CulturalIntelligenceWidget';
import { RegulatoryIntelligenceDashboard } from './intelligence/RegulatoryIntelligenceDashboard';
import { PredictiveQualityDashboard } from './intelligence/PredictiveQualityDashboard';
import { AgencyIntelligencePortal } from './intelligence/AgencyIntelligencePortal';

const IntelligenceCard = ({ title, score, description, children }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="overflow-hidden">
      <div className="p-4 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold">{title}</h3>
              <div className={`text-xl font-bold ${getScoreColor(score)}`}>
                {score}%
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={score >= 85 ? 'default' : score >= 70 ? 'secondary' : 'destructive'}>
              {score >= 85 ? 'Excellent' : score >= 70 ? 'Good' : 'Needs Attention'}
            </Badge>
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>
        </div>
      </div>
      
      {isExpanded && (
        <div className="border-t">
          <div className="p-4">
            {children}
          </div>
        </div>
      )}
    </Card>
  );
};

export const IntelligenceAnalysisTab = ({
  asset,
  onComplete,
  onBack
}) => {
  const [selectedMarkets, setSelectedMarkets] = useState([]);
  const [intelligenceData, setIntelligenceData] = useState({});
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalysisCompleted, setHasAnalysisCompleted] = useState(false);
  const [isReadyToContinue, setIsReadyToContinue] = useState(false);

  const availableMarkets = useMemo(() => [
    'United States', 'Canada', 'United Kingdom', 'Germany', 'France', 
    'Japan', 'China', 'Australia', 'Brazil', 'Mexico'
  ], []);

  const targetMarkets = useMemo(() => selectedMarkets, [selectedMarkets]);

  const analysisKey = useMemo(() => 
    `${asset?.id}_${targetMarkets.join(',')}_${asset?.therapeuticArea}`,
    [asset?.id, targetMarkets, asset?.therapeuticArea]
  );

  const performIntelligenceAnalysis = useCallback(async () => {
    if (targetMarkets.length === 0) return;

    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setHasAnalysisCompleted(false);
    setIsReadyToContinue(false);

    try {
      // Simulate analysis progress
      setAnalysisProgress(20);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAnalysisProgress(40);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setAnalysisProgress(60);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setAnalysisProgress(80);
      await new Promise(resolve => setTimeout(resolve, 600));
      
      setAnalysisProgress(100);

      // Generate intelligence results
      const results = {
        terminology: {
          score: Math.floor(Math.random() * 20) + 75,
          insights: `Analyzed ${Math.floor(Math.random() * 50) + 150} terms across ${targetMarkets.length} markets`
        },
        cultural: {
          score: Math.floor(Math.random() * 15) + 80,
          insights: `Identified ${Math.floor(Math.random() * 10) + 5} cultural adaptations required`
        },
        regulatory: {
          score: Math.floor(Math.random() * 25) + 70,
          insights: `${Math.floor(Math.random() * 15) + 8} compliance rules validated`
        },
        quality: {
          score: Math.floor(Math.random() * 20) + 75,
          insights: `Predicted quality score with ${Math.floor(Math.random() * 5) + 90}% confidence`
        },
        overall: Math.floor(Math.random() * 15) + 80
      };

      setIntelligenceData(results);
      setHasAnalysisCompleted(true);
      setIsReadyToContinue(true);
      
      onComplete(results);
    } catch (error) {
      console.error('Intelligence analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [targetMarkets, asset, onComplete, analysisKey]);

  useEffect(() => {
    if (targetMarkets.length > 0 && !hasAnalysisCompleted) {
      performIntelligenceAnalysis();
    }
  }, [targetMarkets, performIntelligenceAnalysis, hasAnalysisCompleted]);

  const handleCompleteStep = useCallback(() => {
    if (isReadyToContinue && intelligenceData) {
      onComplete(intelligenceData);
    }
  }, [isReadyToContinue, intelligenceData, onComplete]);

  const handleReAnalyze = useCallback(() => {
    setHasAnalysisCompleted(false);
    setIsReadyToContinue(false);
    performIntelligenceAnalysis();
  }, [performIntelligenceAnalysis]);

  // Loading state during analysis
  if (isAnalyzing) {
    return (
      <div className="space-y-6">
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Brain className="h-5 w-5 text-primary animate-pulse" />
              <h3 className="text-lg font-semibold">Analyzing Intelligence</h3>
            </div>
            
            <Progress value={analysisProgress} className="w-full" />
            
            <div className="text-sm text-muted-foreground">
              {analysisProgress < 25 && 'Initializing analysis engines...'}
              {analysisProgress >= 25 && analysisProgress < 50 && 'Analyzing terminology and cultural factors...'}
              {analysisProgress >= 50 && analysisProgress < 75 && 'Validating regulatory compliance...'}
              {analysisProgress >= 75 && 'Generating quality predictions...'}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Asset Info */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Brain className="h-6 w-6 text-primary" />
              Intelligence Analysis
            </h2>
            <p className="text-muted-foreground">
              AI-powered insights for {asset?.name || 'Selected Asset'}
            </p>
          </div>
          <Badge variant="outline" className="flex items-center gap-2">
            <Globe className="h-3 w-3" />
            {asset?.type} Asset
          </Badge>
        </div>

        {/* Market Selection */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Target Markets</label>
            <Select
              value={selectedMarkets.join(',')}
              onValueChange={(value) => {
                if (value && value !== 'none') {
                  const markets = value.split(',').filter(Boolean);
                  setSelectedMarkets(markets);
                } else {
                  setSelectedMarkets([]);
                }
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select target markets for localization">
                  {selectedMarkets.length > 0 
                    ? `${selectedMarkets.length} markets selected: ${selectedMarkets.slice(0, 2).join(', ')}${selectedMarkets.length > 2 ? '...' : ''}`
                    : 'Select target markets'
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {availableMarkets.map((market) => {
                  const isSelected = selectedMarkets.includes(market);
                  const newValue = isSelected 
                    ? selectedMarkets.filter(m => m !== market).join(',') || 'none'
                    : [...selectedMarkets, market].join(',');
                  
                  return (
                    <SelectItem 
                      key={market} 
                      value={newValue}
                    >
                      <div className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          checked={isSelected}
                          readOnly
                          className="w-4 h-4"
                        />
                        {market}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Intelligence Dashboard */}
      {hasAnalysisCompleted && intelligenceData && (
        <>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Intelligence Summary</h3>
              <div className="flex items-center gap-2">
                <Badge variant="default" className="bg-green-500">
                  Analysis Complete
                </Badge>
                <Button variant="outline" size="sm" onClick={handleReAnalyze}>
                  Re-analyze
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded border">
                <div className="text-2xl font-bold text-blue-600">
                  {intelligenceData.overall}%
                </div>
                <div className="text-sm text-muted-foreground">Overall Readiness</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded border">
                <div className="text-2xl font-bold text-green-600">
                  {intelligenceData.terminology?.score}%
                </div>
                <div className="text-sm text-muted-foreground">Terminology</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded border">
                <div className="text-2xl font-bold text-purple-600">
                  {intelligenceData.cultural?.score}%
                </div>
                <div className="text-sm text-muted-foreground">Cultural</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded border">
                <div className="text-2xl font-bold text-orange-600">
                  {intelligenceData.regulatory?.score}%
                </div>
                <div className="text-sm text-muted-foreground">Regulatory</div>
              </div>
            </div>
          </Card>

          {/* Expandable Intelligence Cards */}
          <div className="space-y-4">
            <IntelligenceCard
              title="Terminology Intelligence"
              score={intelligenceData.terminology?.score || 85}
              description={intelligenceData.terminology?.insights || "Comprehensive terminology analysis completed"}
            >
              <IntelligentTerminologyDashboard
                assetId={asset?.id || 'demo-asset'}
                brandId={asset?.brand_id || 'demo-brand'}
                targetMarkets={targetMarkets}
                therapeuticArea={asset?.therapeuticArea || 'General'}
                onTermSelect={(term) => console.log('Term selected:', term)}
              />
            </IntelligenceCard>

            <IntelligenceCard
              title="Cultural Intelligence"
              score={intelligenceData.cultural?.score || 82}
              description={intelligenceData.cultural?.insights || "Cultural adaptation requirements identified"}
            >
              <CulturalIntelligenceWidget
                assetContent={asset?.content || {}}
                assetType={asset?.type || 'web'}
                targetMarkets={targetMarkets}
                brandId={asset?.brand_id || 'demo-brand'}
                onAdaptationApply={(adaptation) => console.log('Adaptation applied:', adaptation)}
              />
            </IntelligenceCard>

            <IntelligenceCard
              title="Regulatory Intelligence"
              score={intelligenceData.regulatory?.score || 78}
              description={intelligenceData.regulatory?.insights || "Regulatory compliance validated"}
            >
              <RegulatoryIntelligenceDashboard
                assetId={asset?.id || 'demo-asset'}
                brandId={asset?.brand_id || 'demo-brand'}
                targetMarkets={targetMarkets}
                therapeuticArea={asset?.therapeuticArea || 'General'}
                onComplianceAction={(action) => console.log('Compliance action:', action)}
              />
            </IntelligenceCard>

            <IntelligenceCard
              title="Quality Intelligence"
              score={intelligenceData.quality?.score || 88}
              description={intelligenceData.quality?.insights || "Quality prediction analysis completed"}
            >
              <PredictiveQualityDashboard
                assetId={asset?.id || 'demo-asset'}
                localizationContext={{
                  targetMarkets,
                  therapeuticArea: asset?.therapeuticArea || 'General',
                  brandId: asset?.brand_id || 'demo-brand'
                }}
                targetMarkets={targetMarkets}
                onReviewerAssign={(assignments) => console.log('Reviewer assignments:', assignments)}
                onQualityAction={(action) => console.log('Quality action:', action)}
              />
            </IntelligenceCard>

            <IntelligenceCard
              title="Agency Portal"
              score={95}
              description="Export packages and communication tools ready"
            >
              <AgencyIntelligencePortal
                assetId={asset?.id || 'demo-asset'}
                brandId={asset?.brand_id || 'demo-brand'}
                projectData={{
                  name: asset?.name || 'Localization Project',
                  type: asset?.type || 'web',
                  status: 'active'
                }}
                localizationContext={{
                  targetMarkets,
                  therapeuticArea: asset?.therapeuticArea || 'General',
                  brandId: asset?.brand_id || 'demo-brand'
                }}
                onExportIntelligence={(format) => console.log('Exporting intelligence:', format)}
                onUpdateProgress={(progress) => console.log('Progress update:', progress)}
              />
            </IntelligenceCard>
          </div>
        </>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Discovery
        </Button>
        <Button 
          onClick={handleCompleteStep}
          disabled={!isReadyToContinue}
          className="bg-green-600 hover:bg-green-700"
        >
          Continue to Project Creation
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};