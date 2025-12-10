
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Brain,
  Download,
  Globe,
  CheckCircle,
  AlertTriangle,
  FileText,
  Lightbulb,
  Target,
  TrendingUp,
  Shield,
  Users,
  Clock,
  ExternalLink,
  CheckSquare,
  FileDown,
  Zap,
  Eye,
  MessageSquare,
  Highlighter,
  MapPin,
  BookOpen,
  AlertCircle,
  XCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { useGlobalContext } from '@/contexts/GlobalContext';
import { EnhancedBrandConsistencyService } from '@/services/enhancedBrandConsistencyService';
import { MarketIntelligenceService } from '@/services/marketIntelligenceService';
import { RegulatoryComplianceEngine } from '@/services/regulatoryComplianceEngine';
import { ProfessionalDocumentService } from '@/services/ProfessionalDocumentService';
import { UniversalDocumentPreviewModal } from '@/components/common/UniversalDocumentPreviewModal';

export const EnhancedLocalizationIntelligenceStep = ({
  asset,
  onStepComplete,
  onNext,
  stepData,
  selectedMarkets = [],
  campaignContext,
  themeContext
}) => {
  const { state: globalState } = useGlobalContext();

  const [analysis, setAnalysis] = useState(null);
  const [marketAnalyses, setMarketAnalyses] = useState([]);
  const [regulatoryAnalyses, setRegulatoryAnalyses] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [customNotes, setCustomNotes] = useState(stepData?.customNotes ?? '');
  const [activeTab, setActiveTab] = useState('strategic-context');

  const [documentPreview, setDocumentPreview] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [pendingDownload, setPendingDownload] = useState(null);

  const generateEnhancedIntelligence = async () => {
    setIsGenerating(true);
    try {
      if (selectedMarkets.length === 0) {
        toast.error('Please select target markets first in the Market Readiness step');
        setIsGenerating(false);
        return;
      }

      // Phase 1: Enhanced Brand Analysis with Strategic Context
      console.log('Phase 1: Enhanced brand analysis with strategic context...');
      const enhancedBrandAnalysis = await EnhancedBrandConsistencyService.validateBrandConsistencyWithContext(
        asset.id,
        asset.brand_id,
        selectedMarkets,
        {
          campaignContext,
          themeContext,
          assetContext: {
            source: asset.source,
            status: asset.status,
            type: asset.asset_type,
            reusability: asset.reusability_score
          },
          globalContext: globalState.crossModuleData
        }
      );
      setAnalysis(enhancedBrandAnalysis);

      // Phase 2: Market Intelligence Analysis
      console.log('Phase 2: Market intelligence analysis...');
      const marketIntelligence = await MarketIntelligenceService.analyzeAssetForMarkets(
        asset.id,
        asset.brand_id,
        selectedMarkets,
        { campaignContext, themeContext }
      );
      setMarketAnalyses(marketIntelligence);

      // Phase 3: Regulatory Compliance Analysis
      console.log('Phase 3: Regulatory compliance analysis...');
      const regulatoryResults = await RegulatoryComplianceEngine.analyzeAssetCompliance(
        asset.id,
        asset.brand_id,
        selectedMarkets
      );
      setRegulatoryAnalyses(regulatoryResults);

      toast.success('Enhanced localization intelligence analysis complete');
      setActiveTab('content-analysis');
    } catch (error) {
      console.error('Error generating enhanced intelligence:', error);
      toast.error('Failed to generate enhanced intelligence analysis');
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (!analysis && !stepData?.analysis) {
      generateEnhancedIntelligence();
    } else if (stepData?.analysis) {
      setAnalysis(stepData.analysis);
      setMarketAnalyses(stepData.marketAnalyses ?? []);
      setRegulatoryAnalyses(stepData.regulatoryAnalyses ?? []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderStrategicContextTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Strategic Context Integration
          </CardTitle>
          <CardDescription>
            Campaign objectives, theme alignment, and cross-module insights
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Campaign Context */}
          {campaignContext && (
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Campaign Objectives
              </h4>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm">{campaignContext.objective ?? 'No specific objectives defined'}</p>
                {campaignContext.audienceInsights && (
                  <div className="mt-2">
                    <span className="text-xs font-medium">Target Audience: </span>
                    <span className="text-xs text-muted-foreground">
                      {campaignContext.audienceInsights.primarySegment ?? 'Not specified'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Theme Alignment */}
          {analysis?.strategicContext?.themeAlignment && (
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Theme Alignment Analysis
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Alignment Score</span>
                    <Badge
                      variant={analysis.strategicContext.themeAlignment.alignmentScore > 70 ? 'default' : 'secondary'}
                    >
                      {analysis.strategicContext.themeAlignment.alignmentScore}%
                    </Badge>
                  </div>
                  <Progress value={analysis.strategicContext.themeAlignment.alignmentScore} className="h-2" />
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <span className="text-sm font-medium">Theme: </span>
                  <span className="text-sm text-muted-foreground">
                    {analysis.strategicContext.themeAlignment.themeName}
                  </span>
                </div>
              </div>

              {analysis.strategicContext.themeAlignment.misalignedElements?.length > 0 && (
                <div className="space-y-2">
                  <span className="text-sm font-medium">Misaligned Elements:</span>
                  <div className="space-y-1">
                    {analysis.strategicContext.themeAlignment.misalignedElements.map((element, index) => (
                      <Alert key={index} variant="destructive" className="py-2">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription className="text-xs">{element}</AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Cross-Module Data */}
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Cross-Module Insights
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Content Studio</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {globalState.crossModuleData.contentStudio ? 'Connected' : 'No data available'}
                </p>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm font-medium">Theme Generation</span>
                </div>
                <p className="text-xs text-muted-foreground">{themeContext ? 'Theme context loaded' : 'No theme context'}</p>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Pre-MLR</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {globalState.crossModuleData.preMlr ? 'MLR context available' : 'No MLR data'}
                </p>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContentAnalysisTab = () => (
    <div className="space-y-6">
      {/* Content Issues Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Highlighter className="h-5 w-5 text-primary" />
            Content-Specific Issue Detection
          </CardTitle>
          <CardDescription>Line-by-line analysis with exact problematic content highlighted</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {analysis?.contentIssues && analysis.contentIssues.length > 0 ? (
            <div className="space-y-4">
              {/* Issue Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-red-50 dark:bg-red-950/20 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {analysis.contentIssues.filter(i => i.severity === 'critical').length}
                  </div>
                  <div className="text-sm text-red-600">Critical Issues</div>
                </div>
                <div className="bg-orange-50 dark:bg-orange-950/20 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {analysis.contentIssues.filter(i => i.severity === 'high').length}
                  </div>
                  <div className="text-sm text-orange-600">High Priority</div>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-950/20 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {analysis.contentIssues.filter(i => i.severity === 'medium').length}
                  </div>
                  <div className="text-sm text-yellow-600">Medium Issues</div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {analysis.contentIssues.filter(i => i.regulatoryRisk !== 'none').length}
                  </div>
                  <div className="text-sm text-blue-600">Regulatory Flags</div>
                </div>
              </div>

              {/* Detailed Issues */}
              <div className="space-y-4">
                {analysis.contentIssues.map((issue, index) => (
                  <Card
                    key={index}
                    className={`border-l-4 ${
                      issue.severity === 'critical'
                        ? 'border-l-red-500'
                        : issue.severity === 'high'
                        ? 'border-l-orange-500'
                        : issue.severity === 'medium'
                        ? 'border-l-yellow-500'
                        : 'border-l-blue-500'
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant={issue.severity === 'critical' ? 'destructive' : 'secondary'}>
                            {issue.severity}
                          </Badge>
                          <Badge variant="outline">{issue.category}</Badge>
                          <Badge variant="outline">{issue.contentSection.type}</Badge>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Target className="h-3 w-3" />
                          {Math.round(issue.confidenceScore * 100)}% confidence
                        </div>
                      </div>

                      <h4 className="font-medium mb-2">{issue.description}</h4>

                      <div className="space-y-3">
                        <div className="bg-red-50 dark:bg-red-950/20 p-3 rounded border">
                          <div className="text-xs font-medium text-red-600 mb-1">Problematic Text:</div>
                          <code className="text-sm bg-red-100 dark:bg-red-950 px-2 py-1 rounded">
                            "{issue.specificText}"
                          </code>
                        </div>

                        <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded border">
                          <div className="text-xs font-medium text-green-600 mb-1">Suggested Replacement:</div>
                          <code className="text-sm bg-green-100 dark:bg-green-950 px-2 py-1 rounded">
                            "{issue.suggestedReplacement}"
                          </code>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded border">
                          <div className="text-xs font-medium text-blue-600 mb-1">Action Required:</div>
                          <p className="text-sm">{issue.suggestion}</p>
                        </div>

                        {issue.regulatoryRisk !== 'none' && (
                          <Alert variant={issue.regulatoryRisk === 'critical' ? 'destructive' : 'default'}>
                            <Shield className="h-4 w-4" />
                            <AlertDescription>
                              <strong>Regulatory Risk: {issue.regulatoryRisk}</strong>
                              {issue.regulatoryRisk === 'critical' && ' - Requires immediate attention before publication'}
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <p>No critical content issues detected</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Content Sections Overview */}
      {analysis?.contentSections && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Content Structure Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {analysis.contentSections.map((section, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="capitalize">
                      {section.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{section.content.length} characters</span>
                  </div>
                  <div className="bg-muted/50 p-3 rounded text-sm font-mono">
                    {section.content.substring(0, 200)}
                    {section.content.length > 200 && '...'}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderMarketIntelligenceTab = () => (
    <div className="space-y-6">
      {/* Market-Specific Flags */}
      {analysis?.marketSpecificFlags && analysis.marketSpecificFlags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Market-Specific Intelligence
            </CardTitle>
            <CardDescription>
              Cultural adaptation points, regulatory requirements, and terminology guidance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {analysis.marketSpecificFlags.map((marketFlag, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h4 className="font-medium mb-4 flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    {marketFlag.market} Market Analysis
                  </h4>

                  <div className="grid md:grid-cols-3 gap-4">
                    {/* Cultural Risks */}
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium text-orange-600">Cultural Considerations</h5>
                      {marketFlag.culturalRisks.length > 0 ? (
                        <div className="space-y-1">
                          {marketFlag.culturalRisks.map((risk, riskIndex) => (
                            <div
                              key={riskIndex}
                              className="text-xs bg-orange-50 dark:bg-orange-950/20 p-2 rounded border-l-2 border-orange-400"
                            >
                              {risk}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-xs text-green-600 bg-green-50 dark:bg-green-950/20 p-2 rounded">
                          No cultural risks identified
                        </div>
                      )}
                    </div>

                    {/* Regulatory Flags */}
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium text-red-600">Regulatory Requirements</h5>
                      {marketFlag.regulatoryFlags.length > 0 ? (
                        <div className="space-y-1">
                          {marketFlag.regulatoryFlags.map((flag, flagIndex) => (
                            <div
                              key={flagIndex}
                              className="text-xs bg-red-50 dark:bg-red-950/20 p-2 rounded border-l-2 border-red-400"
                            >
                              {flag}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-xs text-green-600 bg-green-50 dark:bg-green-950/20 p-2 rounded">
                          No regulatory flags
                        </div>
                      )}
                    </div>

                    {/* Terminology Issues */}
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium text-blue-600">Terminology Guidance</h5>
                      {marketFlag.terminologyIssues.length > 0 ? (
                        <div className="space-y-1">
                          {marketFlag.terminologyIssues.map((issue, issueIndex) => (
                            <div
                              key={issueIndex}
                              className="text-xs bg-blue-50 dark:bg-blue-950/20 p-2 rounded border-l-2 border-blue-400"
                            >
                              {issue}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-xs text-green-600 bg-green-50 dark:bg-green-950/20 p-2 rounded">
                          Terminology approved
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Market Analysis Results */}
      {marketAnalyses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Detailed Market Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {marketAnalyses.map((market, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">{market.marketCode}</h4>
                    <Badge
                      variant={
                        market.riskLevel === 'Low' ? 'default' : market.riskLevel === 'Medium' ? 'secondary' : 'destructive'
                      }
                    >
                      {market.riskLevel} Risk
                    </Badge>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="text-sm font-medium mb-2">Cultural Adaptation Score</h5>
                      <div className="flex items-center gap-2">
                        <Progress value={market.culturalAdaptationScore} className="flex-1" />
                        <span className="text-sm font-medium">{market.culturalAdaptationScore}%</span>
                      </div>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium mb-2">Complexity Level</h5>
                      <Badge variant="outline">{market.complexity}</Badge>
                    </div>
                  </div>

                  {market.marketSpecificRequirements.length > 0 && (
                    <div className="mt-4">
                      <h5 className="text-sm font-medium mb-2">Market Requirements</h5>
                      <div className="space-y-1">
                        {market.marketSpecificRequirements.slice(0, 3).map((req, reqIndex) => (
                          <div key={reqIndex} className="text-xs bg-muted/50 p-2 rounded">
                            • {req.requirement}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderActionableReportsTab = () => (
    <div className="space-y-6">
      {/* Actionable Recommendations */}
      {analysis?.actionableRecommendations && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-primary" />
              Actionable Recommendations
            </CardTitle>
            <CardDescription>
              Prioritized actions with before/after examples for translation partners
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analysis.actionableRecommendations.map((rec, index) => (
                <Card
                  key={index}
                  className={`border-l-4 ${
                    rec.priority === 'critical'
                      ? 'border-l-red-500'
                      : rec.priority === 'high'
                      ? 'border-l-orange-500'
                      : rec.priority === 'medium'
                      ? 'border-l-yellow-500'
                      : 'border-l-blue-500'
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant={rec.priority === 'critical' ? 'destructive' : 'secondary'}>
                            {rec.priority}
                          </Badge>
                          <Badge variant="outline">{rec.category}</Badge>
                        </div>
                        <h4 className="font-medium">{rec.description}</h4>
                        <p className="text-sm text-muted-foreground">{rec.action}</p>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span
                          className={`px-2 py-1 rounded ${
                            rec.effort === 'low'
                              ? 'bg-green-100 text-green-700'
                              : rec.effort === 'medium'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {rec.effort} effort
                        </span>
                        <span
                          className={`px-2 py-1 rounded ${
                            rec.impact === 'high'
                              ? 'bg-green-100 text-green-700'
                              : rec.impact === 'medium'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {rec.impact} impact
                        </span>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="text-xs font-medium text-red-600">Before:</div>
                        <div className="bg-red-50 dark:bg-red-950/20 p-3 rounded border">
                          <code className="text-xs">{rec.beforeExample}</code>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-xs font-medium text-green-600">After:</div>
                        <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded border">
                          <code className="text-xs">{rec.afterExample}</code>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Professional PDF Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileDown className="h-5 w-5 text-primary" />
            Professional Actionable Reports
          </CardTitle>
          <CardDescription>Generate detailed PDF reports for translation partners with visual annotations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" onClick={() => generateEnhancedReport('brand-analysis')} className="h-20 flex-col">
              <FileText className="h-6 w-6 mb-2 text-blue-600" />
              <span className="font-medium">Enhanced Brand Analysis</span>
              <span className="text-xs text-muted-foreground">With content annotations</span>
            </Button>

            <Button variant="outline" onClick={() => generateEnhancedReport('translation-brief')} className="h-20 flex-col">
              <Globe className="h-6 w-6 mb-2 text-green-600" />
              <span className="font-medium">Translation Partner Brief</span>
              <span className="text-xs text-muted-foreground">Actionable guidance</span>
            </Button>

            <Button variant="outline" onClick={() => generateEnhancedReport('market-intelligence')} className="h-20 flex-col">
              <TrendingUp className="h-6 w-6 mb-2 text-purple-600" />
              <span className="font-medium">Market Intelligence Report</span>
              <span className="text-xs text-muted-foreground">Cultural & regulatory</span>
            </Button>

            <Button variant="outline" onClick={() => generateEnhancedReport('regulatory-matrix')} className="h-20 flex-col">
              <Shield className="h-6 w-6 mb-2 text-red-600" />
              <span className="font-medium">Regulatory Compliance Matrix</span>
              <span className="text-xs text-muted-foreground">Market-specific requirements</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const generateEnhancedReport = (reportType) => {
    if (!analysis) return;

    const titleized = reportType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());

    const metadata = {
      title: `Enhanced ${titleized} Report`,
      author: 'Enhanced Localization Intelligence System',
      timestamp: new Date().toISOString(),
      assetName: asset.name,
      markets: selectedMarkets
    };

    const reportData = {
      analysis,
      marketAnalyses,
      regulatoryAnalyses,
      strategicContext: { campaignContext, themeContext },
      globalContext: globalState.crossModuleData
    };

    const preview = ProfessionalDocumentService.generateDocumentPreview(reportData, 'brand-compliance', metadata);
    setDocumentPreview(preview);
    setPendingDownload({ type: 'brand-compliance', data: reportData, metadata });
    setIsPreviewOpen(true);
  };

  const handleProfessionalDownload = () => {
    if (!pendingDownload) return;

    try {
      const pdfBlob = ProfessionalDocumentService.generateProfessionalPDF(
        pendingDownload.data,
        pendingDownload.type,
        pendingDownload.metadata
      );

      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${pendingDownload.metadata.title.toLowerCase().replace(/\s+/g, '-')}-${asset.name
        .replace(/\s+/g, '-')
        .toLowerCase()}.pdf`;
      a.click();
      URL.revokeObjectURL(url);

      setIsPreviewOpen(false);
      setPendingDownload(null);
      setDocumentPreview(null);
      toast.success('Enhanced PDF report downloaded successfully');
    } catch (error) {
      console.error('Error generating enhanced PDF:', error);
      toast.error('Failed to generate PDF report');
    }
  };

  const handleCompleteStep = () => {
    const nextStepData = {
      analysis,
      marketAnalyses,
      regulatoryAnalyses,
      customNotes,
      strategicContext: {
        campaignContext,
        themeContext,
        globalContext: globalState.crossModuleData
      }
    };
    onStepComplete(nextStepData);
    toast.success('Enhanced intelligence analysis completed');
    onNext();
  };

  if (isGenerating) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 animate-pulse text-primary" />
              Generating Enhanced Localization Intelligence...
            </CardTitle>
            <CardDescription>
              Performing comprehensive analysis with strategic context integration and actionable insights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  <span>Phase 1: Strategic context integration and content parsing</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  <span>Phase 2: Content-specific issue detection and analysis</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  <span>Phase 3: Market intelligence and cultural adaptation analysis</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  <span>Phase 4: Actionable recommendations and report generation</span>
                </div>
              </div>
              <Progress value={75} className="w-full" />
              <p className="text-sm text-muted-foreground text-center">
                Analyzing content sections, strategic alignment, and generating actionable intelligence for translation partners...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Enhanced Localization Intelligence
          </CardTitle>
          <CardDescription>
            Comprehensive analysis with strategic context, content-specific insights, and actionable guidance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="strategic-context">Strategic Context</TabsTrigger>
              <TabsTrigger value="content-analysis">Content Analysis</TabsTrigger>
              <TabsTrigger value="market-intelligence">Market Intelligence</TabsTrigger>
              <TabsTrigger value="actionable-reports">Actionable Reports</TabsTrigger>
            </TabsList>

            <TabsContent value="strategic-context" className="mt-6">
              {renderStrategicContextTab()}
            </TabsContent>

            <TabsContent value="content-analysis" className="mt-6">
              {renderContentAnalysisTab()}
            </TabsContent>

            <TabsContent value="market-intelligence" className="mt-6">
              {renderMarketIntelligenceTab()}
            </TabsContent>

            <TabsContent value="actionable-reports" className="mt-6">
              {renderActionableReportsTab()}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Strategic Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Strategic Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Add strategic notes about the localization approach, special considerations, or translation guidance..."
            value={customNotes}
            onChange={(e) => setCustomNotes(e.target.value)}
            className="min-h-[100px]"
          />
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button onClick={handleCompleteStep} className="flex-1">
          Complete Intelligence Analysis
        </Button>
      </div>

      {/* Universal Document Preview Modal */}
      {documentPreview && pendingDownload && (
        <UniversalDocumentPreviewModal
          isOpen={isPreviewOpen}
          onClose={() => {
            setIsPreviewOpen(false);
            setDocumentPreview(null);
            setPendingDownload(null);
          }}
          preview={documentPreview}
          documentType={pendingDownload.type}
          originalData={pendingDownload.data}
          isGenerating={false}
          onDownload={handleProfessionalDownload}
        />
      )}
    </div>
  );
