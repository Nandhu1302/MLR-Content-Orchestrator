
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Building2, FileText, Globe, Clock, Download } from 'lucide-react';

import { IntelligentTerminologyDashboard } from './IntelligentTerminologyDashboard';
import { CulturalIntelligenceWidget } from './CulturalIntelligenceWidget'; // (present in original imports)
import { RegulatoryIntelligenceDashboard } from './RegulatoryIntelligenceDashboard';
import { PredictiveQualityDashboard } from './PredictiveQualityDashboard';
import { RealTimeCulturalAnalyzer } from './RealTimeCulturalAnalyzer';
import { SmartExportManager } from './SmartExportManager';

export const AgencyIntelligencePortal = ({
  assetId,
  brandId,
  projectData,
  localizationContext,
  onExportIntelligence,
  onUpdateProgress,
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [progressData, setProgressData] = useState(null);
  const [intelligenceData, setIntelligenceData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadIntelligenceData();
    loadProgressData();
    // If you want to inform parent about progress updates:
    // onUpdateProgress?.(progressData);
  }, [assetId, brandId, localizationContext]);

  const loadIntelligenceData = async () => {
    setLoading(true);
    try {
      // Simulate loading comprehensive intelligence data
      const data = {
        assetProvenance: {
          // In TS version: localizationContext.sourceModule ?? 'Design Studio'
          originalSource: localizationContext?.sourceModule || 'Design Studio',
          createdBy: 'Content Team',
          createdDate: new Date().toISOString(),
          brandGuidelines: {
            primaryColor: '#2563eb',
            tone: 'Professional, Approachable',
            keyMessages: ['Efficacy', 'Safety', 'Innovation'],
          },
          regulatoryStatus: 'Approved',
          performanceHistory: {
            engagement: 85,
            conversion: 72,
            brandRecall: 90,
          },
        },
        realTimeUpdates: {
          lastUpdate: new Date().toISOString(),
          activeCollaborators: 3,
          pendingActions: 5,
          completionRate: 65,
        },
        marketIntelligence: (projectData?.targetMarkets || []).map((market) => ({
          market,
          readinessScore: Math.floor(Math.random() * 30) + 70,
          culturalRisk: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
          regulatoryComplexity: ['standard', 'moderate', 'complex'][Math.floor(Math.random() * 3)],
          timelineImpact: Math.floor(Math.random() * 14) + 7,
        })),
      };

      setIntelligenceData(data);
    } catch (error) {
      console.error('Failed to load intelligence data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProgressData = async () => {
    try {
      const progress = {
        overallProgress: 65,
        phases: [
          { name: 'Intelligence Gathering', progress: 90, status: 'completed' },
          { name: 'Cultural Analysis', progress: 80, status: 'in-progress' },
          { name: 'Regulatory Review', progress: 70, status: 'in-progress' },
          { name: 'Quality Prediction', progress: 60, status: 'in-progress' },
          { name: 'Final Handoff', progress: 0, status: 'pending' },
        ],
        qualityGates: [
          { name: 'Brand Consistency', passed: true, score: 92 },
          { name: 'Cultural Appropriateness', passed: true, score: 88 },
          { name: 'Regulatory Compliance', passed: false, score: 65 },
          { name: 'Quality Prediction', passed: true, score: 85 },
        ],
      };

      setProgressData(progress);
    } catch (error) {
      console.error('Failed to load progress data:', error);
    }
  };

  const handleExportIntelligence = (format) => {
    onExportIntelligence?.(format);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'in-progress':
        return 'text-blue-600 bg-blue-50';
      case 'pending':
        return 'text-gray-600 bg-gray-50';
      default:
        return 'text-blue-600 bg-blue-50';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-muted rounded w-1/3"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Building2 className="h-7 w-7 text-primary" />
              Agency Intelligence Portal
            </h2>
            <p className="text-muted-foreground mt-1">
              Complete global asset context and localization intelligence
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="flex items-center gap-2">
              <Clock className="h-3 w-3" />
              Last updated: {new Date().toLocaleTimeString()}
            </Badge>
            <Button variant="outline" onClick={() => handleExportIntelligence('pdf')}>
              <Download className="h-4 w-4 mr-2" />
              Export Intelligence
            </Button>
          </div>
        </div>
      </Card>

      {/* Progress Overview */}
      {progressData && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Project Progress</h3>
            <div className="flex items-center gap-2">
              <Progress value={progressData.overallProgress} className="w-32" />
              <span className="text-sm font-medium">{progressData.overallProgress}%</span>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-4">
            {progressData.phases.map((phase, index) => (
              <Card key={index} className="p-3">
                <div className="text-center">
                  <div className={`text-xs px-2 py-1 rounded-full mb-2 ${getStatusColor(phase.status)}`}>
                    {phase.status.replace('-', ' ').toUpperCase()}
                  </div>
                  <div className="font-medium text-sm">{phase.name}</div>
                  <div className="text-2xl font-bold mt-2">{phase.progress}%</div>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-6">
            <h4 className="font-medium mb-3">Quality Gates Status</h4>
            <div className="grid grid-cols-4 gap-4">
              {progressData.qualityGates.map((gate, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${
                    gate.passed ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-sm font-medium">{gate.name}</div>
                    <Badge variant={gate.passed ? 'default' : 'destructive'} className="text-xs">
                      {gate.passed ? 'PASSED' : 'FAILED'}
                    </Badge>
                  </div>
                  <div className="text-lg font-bold">{gate.score}%</div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Intelligence Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <Card className="p-2">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="terminology">Terminology</TabsTrigger>
            <TabsTrigger value="cultural">Cultural</TabsTrigger>
            <TabsTrigger value="regulatory">Regulatory</TabsTrigger>
            <TabsTrigger value="quality">Quality</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
          </TabsList>
        </Card>

        <TabsContent value="overview" className="space-y-6">
          {intelligenceData && (
            <div className="grid grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Asset Provenance
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Original Source:</span>
                    <span className="text-sm font-medium">{intelligenceData.assetProvenance.originalSource}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Created By:</span>
                    <span className="text-sm font-medium">{intelligenceData.assetProvenance.createdBy}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Regulatory Status:</span>
                    <Badge variant="default">{intelligenceData.assetProvenance.regulatoryStatus}</Badge>
                  </div>

                  <div className="mt-4">
                    <div className="text-sm font-medium mb-2">Performance History</div>
                    <div className="space-y-2">
                      {Object.entries(intelligenceData.assetProvenance.performanceHistory).map(
                        ([metric, value]) => (
                          <div key={metric} className="flex items-center justify-between text-sm">
                            <span className="capitalize">{metric}</span>
                            <div className="flex items-center gap-2">
                              <Progress value={value} className="w-16 h-2" />
                              <span className="w-8">{value}%</span>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Market Intelligence
                </h3>

                <div className="space-y-4">
                  {intelligenceData.marketIntelligence?.map((market, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{market.market}</span>
                        <Badge
                          variant={
                            market.culturalRisk === 'high'
                              ? 'destructive'
                              : market.culturalRisk === 'medium'
                              ? 'secondary'
                              : 'default'
                          }
                        >
                          {market.culturalRisk} risk
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Readiness:</span>
                          <span className="ml-2 font-medium">{market.readinessScore}%</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Timeline:</span>
                          <span className="ml-2 font-medium">{market.timelineImpact} days</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="terminology">
          <IntelligentTerminologyDashboard
            assetId={assetId}
            brandId={brandId}
            targetMarkets={projectData?.targetMarkets || []}
            therapeuticArea={localizationContext?.therapeuticArea || 'General'}
            onTermSelect={(term) => console.log('Term selected:', term)}
          />
        </TabsContent>

        <TabsContent value="cultural">
          <RealTimeCulturalAnalyzer
            assetId={assetId}
            brandId={brandId}
            assetContent={localizationContext?.content}
            targetMarkets={projectData?.targetMarkets || []}
            onAnalysisComplete={(analysis) => console.log('Cultural analysis complete:', analysis)}
          />
        </TabsContent>

        <TabsContent value="regulatory">
          <RegulatoryIntelligenceDashboard
            assetId={assetId}
            brandId={brandId}
            targetMarkets={projectData?.targetMarkets || []}
            therapeuticArea={localizationContext?.therapeuticArea || 'General'}
            onComplianceAction={(action) => console.log('Compliance action:', action)}
          />
        </TabsContent>

        <TabsContent value="quality">
          <PredictiveQualityDashboard
            assetId={assetId}
            localizationContext={localizationContext}
            targetMarkets={projectData?.targetMarkets || []}
            onReviewerAssign={(assignments) => console.log('Reviewer assigned:', assignments)}
            onQualityAction={(action) => console.log('Quality action:', action)}
          />
        </TabsContent>

        <TabsContent value="export" className="space-y-6">
          <SmartExportManager
            assetId={assetId}
            localizationContext={localizationContext}
            intelligenceData={{
              terminology: intelligenceData?.terminologyData || [],
              cultural: intelligenceData?.marketIntelligence,
              regulatory: [],
              quality: progressData,
            }}
            onExportComplete={(exportData) => console.log('Export completed:', exportData)}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

AgencyIntelligencePortal.propTypes = {
  assetId: PropTypes.string.isRequired,
  brandId: PropTypes.string.isRequired,
  projectData: PropTypes.object,
  localizationContext: PropTypes.object,
  onExportIntelligence: PropTypes.func,
  onUpdateProgress: PropTypes.func,
};
