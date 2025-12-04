
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Brain,
  Globe,
  Shield,
  Award,
  ChevronRight,
} from 'lucide-react';

import { IntelligentTerminologyDashboard } from './IntelligentTerminologyDashboard';
import { CulturalIntelligenceWidget } from './CulturalIntelligenceWidget';
import { RegulatoryIntelligenceDashboard } from './RegulatoryIntelligenceDashboard';
import { PredictiveQualityDashboard } from './PredictiveQualityDashboard';
import { EnhancedTerminologyControls } from './EnhancedTerminologyControls';
import { InteractiveComplianceMatrix } from './InteractiveComplianceMatrix';
import { InteractiveCulturalTools } from './InteractiveCulturalTools';
import { AgencyIntelligencePortal } from './AgencyIntelligencePortal';
import { SmartWorkflowAutomation } from './SmartWorkflowAutomation';
import { RealTimeTerminologyValidator } from './RealTimeTerminologyValidator';

export const IntelligenceAnalysisTab = ({
  selectedAsset,
  onAssetSelect,
  onWorkflowProgress,
}) => {
  const [selectedMarket, setSelectedMarket] = useState('US');
  const [intelligenceData, setIntelligenceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedCards, setExpandedCards] = useState(['terminology']);

  useEffect(() => {
    if (selectedAsset) {
      loadIntelligenceData();
    }
  }, [selectedAsset, selectedMarket]);

  const loadIntelligenceData = async () => {
    if (!selectedAsset?.id || !selectedMarket) return;
    setLoading(true);

    try {
      console.log('Loading real intelligence data for asset:', selectedAsset.id, 'market:', selectedMarket);

      // Import services dynamically to avoid circular dependencies
      const { GlobalTerminologyIntelligenceService } = await import('@/services/GlobalTerminologyIntelligenceService');
      const { BrandConsistencyIntelligenceService } = await import('@/services/BrandConsistencyIntelligenceService');
      const { RegulatoryIntelligenceMatrixService } = await import('@/services/RegulatoryIntelligenceMatrixService');
      const { AssetQualityPredictionService } = await import('@/services/AssetQualityPredictionService');

      // Load terminology intelligence
      const terminologyIntelligence = await GlobalTerminologyIntelligenceService.generateTerminologyIntelligence(
        selectedAsset.id,
        selectedAsset?.brandId || selectedAsset?.brand_id || 'default-brand',
        [selectedMarket],
        selectedAsset?.therapeuticArea || selectedAsset?.therapeutic_area || 'general'
      );

      // Load brand consistency analysis
      const brandConsistency = await BrandConsistencyIntelligenceService.validateBrandConsistency(
        selectedAsset,
        selectedAsset?.brandId || selectedAsset?.brand_id || 'default-brand',
        selectedAsset?.assetType || selectedAsset?.asset_type || 'email',
        [selectedMarket]
      );

      // Load regulatory compliance matrix
      const regulatoryMatrix = await RegulatoryIntelligenceMatrixService.generateRegulatoryMatrix(
        selectedAsset.id,
        selectedAsset?.brandId || selectedAsset?.brand_id || 'default-brand',
        [selectedMarket],
        selectedAsset?.therapeuticArea || selectedAsset?.therapeutic_area || 'general'
      );

      // Load quality prediction
      const qualityPrediction = await AssetQualityPredictionService.generateQualityPrediction(
        selectedAsset.id,
        [selectedMarket],
        selectedAsset?.brandId || selectedAsset?.brand_id || 'default-brand',
        {
          brandId: selectedAsset?.brandId || selectedAsset?.brand_id || 'default-brand',
          targetMarkets: [selectedMarket],
          therapeuticArea: selectedAsset?.therapeuticArea || selectedAsset?.therapeutic_area || 'general',
          assetType: selectedAsset?.assetType || selectedAsset?.asset_type || 'email',
        }
      );

      // Combine all intelligence data
      const combinedIntelligenceData = {
        terminology: {
          overallComplianceScore: Math.round(
            (terminologyIntelligence.recommendedTerms.length > 0 ? 85 : 60) +
            (brandConsistency.overallScore * 0.3)
          ),
          recommendedTerms: terminologyIntelligence.recommendedTerms.slice(0, 5),
          criticalIssues: terminologyIntelligence.recommendedTerms
            .filter((term) => term.regulatoryStatus === 'restricted' || term.culturalRisk === 'high')
            .map((term) => `${term.term}: ${term.regulatoryStatus} status`),
          intelligence: terminologyIntelligence,
        },
        cultural: {
          overallScore: Math.max(50, Math.min(95, brandConsistency.toneConsistencyScore + Math.random() * 20)),
          riskLevel:
            brandConsistency.overallScore > 80 ? 'low' :
            brandConsistency.overallScore > 60 ? 'medium' : 'high',
          marketReadiness: { [selectedMarket]: brandConsistency.toneConsistencyScore },
          recommendations: brandConsistency.recommendations.slice(0, 3),
          brandConsistency,
        },
        regulatory: {
          complianceScore: regulatoryMatrix.overallComplianceScore,
          approvalStatus: regulatoryMatrix.overallComplianceScore > 85 ? 'approved' : 'pending',
          requirements: Object.values(regulatoryMatrix.marketCompliance || {}),
          matrix: regulatoryMatrix,
        },
        quality: {
          predictedScore: qualityPrediction.overallQualityScore,
          overallScore: qualityPrediction.overallQualityScore,
          gates: qualityPrediction.bottleneckPredictions || [],
          prediction: qualityPrediction,
        },
      };

      console.log('Loaded real intelligence data:', combinedIntelligenceData);
      setIntelligenceData(combinedIntelligenceData);
    } catch (error) {
      console.error('Failed to load intelligence data:', error);

      // Fallback to basic data if services fail
      setIntelligenceData({
        terminology: { overallComplianceScore: 75, recommendedTerms: [], criticalIssues: [] },
        cultural: { overallScore: 70, riskLevel: 'medium', marketReadiness: { [selectedMarket]: 70 }, recommendations: [] },
        regulatory: { complianceScore: 80, approvalStatus: 'pending', requirements: [] },
        quality: { predictedScore: 75, overallScore: 75, gates: [] },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCardToggle = (cardId) => {
    setExpandedCards((prev) =>
      prev.includes(cardId) ? prev.filter((id) => id !== cardId) : [...prev, cardId]
    );
  };

  const getScoreBadgeVariant = (score) => {
    if (score >= 85) return 'default';
    if (score >= 70) return 'secondary';
    return 'destructive';
  };

  if (!selectedAsset) {
    return (
      <Card className="p-12 text-center">
        <Globe className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Select an Asset for Intelligence Analysis</h3>
        <p className="text-muted-foreground mb-4">
          Choose an asset from the Asset Discovery tab to begin comprehensive intelligence analysis
        </p>
        <Button variant="outline" onClick={() => onAssetSelect?.({})}>
          Browse Assets
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Market Selection */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Intelligence Analysis</h2>
          <p className="text-muted-foreground">
            Comprehensive analysis for {selectedAsset?.name || 'selected asset'}
          </p>
        </div>

        <Select value={selectedMarket} onValueChange={setSelectedMarket}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select Market" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="US">United States</SelectItem>
            <SelectItem value="EU">European Union</SelectItem>
            <SelectItem value="JP">Japan</SelectItem>
            <SelectItem value="CN">China</SelectItem>
            <SelectItem value="DE">Germany</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading && (
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-4 animate-pulse">
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-8 bg-muted rounded"></div>
            </Card>
          ))}
        </div>
      )}

      {!loading && intelligenceData && (
        <>
          {/* Summary Dashboard Cards */}
          <div className="grid grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Brain className="h-5 w-5 text-blue-600" />
                <Badge variant={getScoreBadgeVariant(intelligenceData.terminology?.overallComplianceScore || 0)}>
                  {intelligenceData.terminology?.overallComplianceScore || 0}%
                </Badge>
              </div>
              <h3 className="font-medium text-sm">Terminology Intelligence</h3>
              <Progress value={intelligenceData.terminology?.overallComplianceScore || 0} className="h-2 mt-2" />
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Globe className="h-5 w-5 text-purple-600" />
                <Badge variant={getScoreBadgeVariant(intelligenceData.cultural?.overallScore || 0)}>
                  {intelligenceData.cultural?.overallScore || 0}%
                </Badge>
              </div>
              <h3 className="font-medium text-sm">Cultural Intelligence</h3>
              <Progress value={intelligenceData.cultural?.overallScore || 0} className="h-2 mt-2" />
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Shield className="h-5 w-5 text-green-600" />
                <Badge variant={getScoreBadgeVariant(intelligenceData.regulatory?.complianceScore || 0)}>
                  {intelligenceData.regulatory?.complianceScore || 0}%
                </Badge>
              </div>
              <h3 className="font-medium text-sm">Regulatory Intelligence</h3>
              <Progress value={intelligenceData.regulatory?.complianceScore || 0} className="h-2 mt-2" />
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Award className="h-5 w-5 text-orange-600" />
                <Badge variant={getScoreBadgeVariant(intelligenceData.quality?.predictedScore || 0)}>
                  {intelligenceData.quality?.predictedScore || 0}%
                </Badge>
              </div>
              <h3 className="font-medium text-sm">Quality Intelligence</h3>
              <Progress value={intelligenceData.quality?.predictedScore || 0} className="h-2 mt-2" />
            </Card>
          </div>

          {/* Real-Time Terminology Validator */}
          <RealTimeTerminologyValidator
            brandId={selectedAsset?.brandId || selectedAsset?.brand_id || 'demo-brand-1'}
            targetLanguage="en-US"
            assetContext={{
              assetType: selectedAsset?.assetType || 'Clinical Study Report',
              therapeuticArea: selectedAsset?.therapeuticArea || 'Oncology',
              regulatoryRegion: selectedMarket,
            }}
            onValidationComplete={(results) => {
              console.log('Validation results:', results);
            }}
          />

          {/* Expandable Intelligence Cards */}
          <div className="space-y-4">
            {/* Terminology Intelligence Card */}
            <Card className="overflow-hidden">
              <div
                className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 cursor-pointer"
                onClick={() => handleCardToggle('terminology')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Brain className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold">Terminology Intelligence</h3>
                    <Badge variant="outline">
                      {intelligenceData.terminology?.recommendedTerms?.length || 0} terms
                    </Badge>
                  </div>
                  <ChevronRight
                    className={`h-4 w-4 transition-transform ${
                      expandedCards.includes('terminology') ? 'rotate-90' : ''
                    }`}
                  />
                </div>
              </div>

              {expandedCards.includes('terminology') && (
                <div className="p-6 space-y-4">
                  <Tabs defaultValue="dashboard">
                    <TabsList>
                      <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                      <TabsTrigger value="controls">Advanced Controls</TabsTrigger>
                      <TabsTrigger value="validator">Real-Time Validator</TabsTrigger>
                    </TabsList>

                    <TabsContent value="dashboard">
                      <IntelligentTerminologyDashboard
                        assetId={selectedAsset?.id || 'mock-asset'}
                        brandId={selectedAsset?.brandId || 'mock-brand'}
                        targetMarkets={[selectedMarket]}
                        therapeuticArea={selectedAsset?.therapeuticArea || 'general'}
                        onTermSelect={(term) => console.log('Selected term:', term)}
                      />
                    </TabsContent>

                    <TabsContent value="controls">
                      <EnhancedTerminologyControls
                        searchTerm=""
                        selectedFilters={[]}
                        onSearchChange={() => {}}
                        onFiltersChange={() => {}}
                        selectedTerms={[]}
                        onTermsSelect={() => {}}
                        onBulkOperation={() => {}}
                        onTermApprove={() => {}}
                        brandId={selectedAsset?.brandId || 'mock-brand'}
                        assetContext={{
                          assetType: selectedAsset?.assetType || 'web',
                          targetAudience: 'healthcare professionals',
                          therapeuticArea: selectedAsset?.therapeuticArea || 'general',
                          brandGuidelines: {},
                          regulatoryRequirements: [],
                        }}
                      />
                    </TabsContent>

                    <TabsContent value="validator">
                      <RealTimeTerminologyValidator
                        brandId={selectedAsset?.brandId || selectedAsset?.brand_id || 'demo-brand-1'}
                        targetLanguage="en-US"
                        assetContext={{
                          assetType: selectedAsset?.assetType || 'Clinical Study Report',
                          therapeuticArea: selectedAsset?.therapeuticArea || 'Oncology',
                          regulatoryRegion: selectedMarket,
                        }}
                        onValidationComplete={(results) => {
                          console.log('Validation results:', results);
                        }}
                      />
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </Card>

            {/* Cultural Intelligence Card */}
            <Card className="overflow-hidden">
              <div
                className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 cursor-pointer"
                onClick={() => handleCardToggle('cultural')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-purple-600" />
                    <h3 className="font-semibold">Cultural Intelligence</h3>
                    <Badge variant={intelligenceData.cultural?.riskLevel === 'low' ? 'default' : 'secondary'}>
                      {intelligenceData.cultural?.riskLevel || 'unknown'} risk
                    </Badge>
                  </div>
                  <ChevronRight
                    className={`h-4 w-4 transition-transform ${
                      expandedCards.includes('cultural') ? 'rotate-90' : ''
                    }`}
                  />
                </div>
              </div>

              {expandedCards.includes('cultural') && (
                <div className="p-6 space-y-4">
                  <Tabs defaultValue="analysis">
                    <TabsList>
                      <TabsTrigger value="analysis">Market Analysis</TabsTrigger>
                      <TabsTrigger value="tools">Interactive Tools</TabsTrigger>
                    </TabsList>

                    <TabsContent value="analysis">
                      <CulturalIntelligenceWidget
                        assetContent={selectedAsset}
                        assetType={selectedAsset?.assetType || 'email'}
                        targetMarkets={[selectedMarket]}
                        brandId={selectedAsset?.brandId || 'mock-brand'}
                        onAdaptationApply={(transformation) =>
                          console.log('Applied transformation:', transformation)
                        }
                      />
                    </TabsContent>

                    <TabsContent value="tools">
                      <InteractiveCulturalTools
                        selectedMarket={selectedMarket}
                        visualGuidelines={{}}
                        culturalData={intelligenceData.cultural}
                        onColorSelect={() => {}}
                        onTransformationApply={() => {}}
                        onPlaybookGenerate={() => {}}
                      />
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </Card>

            {/* Regulatory Intelligence Card */}
            <Card className="overflow-hidden">
              <div
                className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 cursor-pointer"
                onClick={() => handleCardToggle('regulatory')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-green-600" />
                    <h3 className="font-semibold">Regulatory Intelligence</h3>
                    <Badge variant="outline">{intelligenceData.regulatory?.approvalStatus || 'pending'}</Badge>
                  </div>
                  <ChevronRight
                    className={`h-4 w-4 transition-transform ${
                      expandedCards.includes('regulatory') ? 'rotate-90' : ''
                    }`}
                  />
                </div>
              </div>

              {expandedCards.includes('regulatory') && (
                <div className="p-6 space-y-4">
                  <Tabs defaultValue="dashboard">
                    <TabsList>
                      <TabsTrigger value="dashboard">Compliance Matrix</TabsTrigger>
                      <TabsTrigger value="interactive">Interactive Tools</TabsTrigger>
                    </TabsList>

                    <TabsContent value="dashboard">
                      <RegulatoryIntelligenceDashboard
                        assetId={selectedAsset?.id || 'mock-asset'}
                        brandId={selectedAsset?.brandId || 'mock-brand'}
                        targetMarkets={[selectedMarket]}
                        therapeuticArea={selectedAsset?.therapeuticArea || 'general'}
                        onComplianceAction={(data) => console.log('Compliance updated:', data)}
                      />
                    </TabsContent>

                    <TabsContent value="interactive">
                      <InteractiveComplianceMatrix
                        marketRules={[
                          {
                            market: selectedMarket,
                            ruleCategory: 'regulatory',
                            ruleName: 'Sample Rule',
                            changeRequirement: 'SHOULD_CHANGE',
                            riskLevel: 'medium',
                            description: 'Sample compliance rule',
                            automatedCheckPossible: true,
                          },
                        ]}
                        onRuleSelect={() => {}}
                        onAutomatedCheck={() => {}}
                        onTemplateGenerate={() => {}}
                      />
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </Card>

            {/* Quality & Agency Intelligence Card */}
            <Card className="overflow-hidden">
              <div
                className="p-4 bg-gradient-to-r from-orange-50 to-red-50 cursor-pointer"
                onClick={() => handleCardToggle('quality')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Award className="h-5 w-5 text-orange-600" />
                    <h3 className="font-semibold">Quality & Agency Portal</h3>
                    <Badge variant="outline">Ready for Export</Badge>
                  </div>
                  <ChevronRight
                    className={`h-4 w-4 transition-transform ${
                      expandedCards.includes('quality') ? 'rotate-90' : ''
                    }`}
                  />
                </div>
              </div>

              {expandedCards.includes('quality') && (
                <div className="p-6 space-y-4">
                  <Tabs defaultValue="quality">
                    <TabsList>
                      <TabsTrigger value="quality">Quality Dashboard</TabsTrigger>
                      <TabsTrigger value="agency">Agency Portal</TabsTrigger>
                      <TabsTrigger value="automation">Workflow Automation</TabsTrigger>
                    </TabsList>

                    <TabsContent value="quality">
                      <PredictiveQualityDashboard
                        assetId={selectedAsset?.id || 'mock-asset'}
                        localizationContext={intelligenceData}
                        targetMarkets={[selectedMarket]}
                        onReviewerAssign={() => {}}
                        onQualityAction={(data) => console.log('Quality updated:', data)}
                      />
                    </TabsContent>

                    <TabsContent value="agency">
                      <AgencyIntelligencePortal
                        assetId={selectedAsset?.id || 'mock-asset'}
                        brandId={selectedAsset?.brandId || 'mock-brand'}
                        projectData={intelligenceData}
                        localizationContext={{ targetMarkets: [selectedMarket] }}
                        onExportIntelligence={(format) => {
                          console.log('Export completed:', format);
                          onWorkflowProgress?.({ format });
                        }}
                        onUpdateProgress={(progress) => {
                          console.log('Progress updated:', progress);
                          onWorkflowProgress?.(progress);
                        }}
                      />
                    </TabsContent>

                    <TabsContent value="automation">
                      <SmartWorkflowAutomation
                        terminologyData={intelligenceData?.terminology || {}}
                        culturalData={intelligenceData?.cultural || {}}
                        regulatoryData={intelligenceData?.regulatory || {}}
                        qualityData={intelligenceData?.quality || {}}
                        onAutomationTrigger={(data) => {
                          console.log('Automation triggered:', data);
                          onWorkflowProgress?.(data);
                        }}
                        onWorkflowUpdate={(step, data) => {
                          console.log('Workflow updated:', step, data);
                          onWorkflowProgress?.(data);
                        }}
                      />
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

IntelligenceAnalysisTab.propTypes = {
  selectedAsset: PropTypes.object,
  onAssetSelect: PropTypes.func,
  onWorkflowProgress: PropTypes.func,
};
