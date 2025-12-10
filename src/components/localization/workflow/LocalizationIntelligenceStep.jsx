
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
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
  Eye
} from 'lucide-react';
import { toast } from 'sonner';
import { MarketIntelligenceService } from '@/services/marketIntelligenceService';
import { DocumentGenerationService } from '@/services/documentGenerationService';
import { RegulatoryComplianceEngine } from '@/services/regulatoryComplianceEngine';
import { BrandConsistencyService } from '@/services/brandConsistencyService';
import { ProfessionalDocumentService } from '@/services/ProfessionalDocumentService';
import { UniversalDocumentPreviewModal } from '@/components/common/UniversalDocumentPreviewModal';

export const LocalizationIntelligenceStep = ({
  asset,
  onStepComplete,
  onNext,
  stepData,
  selectedMarkets = [],
  campaignContext,
  themeContext
}) => {
  const [analysis, setAnalysis] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [customNotes, setCustomNotes] = useState(stepData?.customNotes ?? '');
  const [marketAnalyses, setMarketAnalyses] = useState([]);
  const [adaptationRoadmaps, setAdaptationRoadmaps] = useState([]);
  const [regulatoryAnalyses, setRegulatoryAnalyses] = useState([]);
  const [localizationBrief, setLocalizationBrief] = useState(null);

  const [isGeneratingDocuments, setIsGeneratingDocuments] = useState(false);
  const [documentPreview, setDocumentPreview] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [pendingDownload, setPendingDownload] = useState(null);

  // Enhanced 4-phase localization intelligence analysis
  const generateLocalizationIntelligence = async () => {
    setIsGenerating(true);
    try {
      // Check if markets are selected
      if (selectedMarkets.length === 0) {
        toast.error('Please select target markets first in the Market Readiness step');
        setIsGenerating(false);
        return;
      }

      // Phase 1: Multi-Layered Brand Analysis with Market Context
      console.log('Phase 1: Analyzing brand baseline and market requirements...');
      const brandConsistency = await BrandConsistencyService.validateBrandConsistency(
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
          }
        }
      );

      // Generate market-specific analysis for selected markets
      const marketAnalysisResults = await MarketIntelligenceService.analyzeAssetForMarkets(
        asset.id,
        asset.brand_id,
        selectedMarkets,
        {
          campaignContext,
          themeContext
        }
      );
      setMarketAnalyses(marketAnalysisResults);

      // Phase 2: Regulatory Pre-Check for selected markets
      console.log('Phase 2: Performing regulatory compliance analysis...');
      const regulatoryResults = await RegulatoryComplianceEngine.analyzeAssetCompliance(
        asset.id,
        asset.brand_id,
        selectedMarkets
      );
      setRegulatoryAnalyses(regulatoryResults);

      // Phase 3: Content Adaptation Roadmaps
      console.log('Phase 3: Generating adaptation roadmaps...');
      const roadmaps = [];
      for (const marketAnalysis of marketAnalysisResults) {
        const roadmap = await MarketIntelligenceService.generateContentAdaptationRoadmap(
          asset.id,
          marketAnalysis.marketCode,
          marketAnalysis
        );
        roadmaps.push(roadmap);
      }
      setAdaptationRoadmaps(roadmaps);

      // Phase 4: Generate Comprehensive Localization Brief
      console.log('Phase 4: Generating comprehensive localization brief...');
      const comprehensiveBrief = await DocumentGenerationService.generateLocalizationBrief(
        asset.name,
        marketAnalysisResults,
        roadmaps,
        brandConsistency
      );
      setLocalizationBrief(comprehensiveBrief);

      // Create unified analysis object
      const intelligence = {
        // Phase 1: Multi-Layered Brand Analysis
        brandCompliance: {
          score: brandConsistency.overallScore,
          globalBaseline: brandConsistency.overallScore,
          messagingScore: brandConsistency.messagingScore,
          toneScore: brandConsistency.toneScore,
          visualScore: brandConsistency.visualScore,
          regulatoryScore: brandConsistency.regulatoryScore,
          issues: brandConsistency.issues,
          strengths: brandConsistency.strengths,
          status: brandConsistency.status
        },
        // Market-Specific Intelligence
        marketAnalysis: marketAnalysisResults,
        // Phase 2: Regulatory Analysis
        regulatoryAnalysis: regulatoryResults,
        // Phase 3: Adaptation Intelligence
        adaptationRoadmaps: roadmaps,
        // Phase 4: Actionable Outputs
        localizationBrief: comprehensiveBrief,
        // Legacy format for compatibility
        culturalRequirements: marketAnalysisResults.reduce((acc, market) => {
          acc[market.marketCode] = {
            complexity: market.complexity,
            requirements: market.marketSpecificRequirements.map(req => req.requirement),
            riskLevel: market.riskLevel,
            culturalScore: market.culturalAdaptationScore,
            competitivePosition: market.competitivePositioning.marketPosition
          };
          return acc;
        }, {}),
        messageComplexity: {
          score: Math.round(
            marketAnalysisResults.reduce((sum, m) => sum + m.culturalAdaptationScore, 0) / marketAnalysisResults.length
          ),
          factors: [
            `Brand consistency: ${brandConsistency.overallScore}%`,
            `Cultural adaptation complexity: ${marketAnalysisResults.map(m => m.complexity).join(', ')}`,
            `Regulatory compliance: ${regulatoryResults.map(r => r.complianceStatus).join(', ')}`,
            `Market risks: ${marketAnalysisResults.map(m => m.riskLevel).join(', ')}`
          ]
        }
      };

      setAnalysis(intelligence);
      toast.success('Comprehensive localization intelligence analysis complete');
    } catch (error) {
      console.error('Error generating localization intelligence:', error);
      toast.error('Failed to generate intelligence analysis');
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (!analysis && !stepData?.analysis) {
      generateLocalizationIntelligence();
    } else if (stepData?.analysis) {
      setAnalysis(stepData.analysis);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Professional PDF Generation with Preview
  const generateDocumentPreview = (type, data, marketCode) => {
    const metadata = {
      title:
        type === 'brand-compliance'
          ? 'Brand Compliance Report'
          : type === 'localization-brief'
          ? 'Comprehensive Localization Brief'
          : type === 'cultural-checklist'
          ? `Cultural Adaptation Checklist - ${marketCode}`
          : type === 'translation-instructions'
          ? `Translation Instructions - ${marketCode}`
          : 'Regulatory Compliance Matrix',
      author: 'Localization Intelligence System',
      timestamp: new Date().toISOString(),
      assetName: asset.name,
      markets: marketCode ? [marketCode] : selectedMarkets
    };

    const preview = ProfessionalDocumentService.generateDocumentPreview(data, type, metadata);
    setDocumentPreview(preview);
    setPendingDownload({ type, data, metadata });
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
      toast.success('Professional PDF report downloaded successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF report');
    }
  };

  // Updated download handlers
  const handleDownloadBrief = () => {
    if (!localizationBrief) return;
    generateDocumentPreview('localization-brief', localizationBrief);
  };

  const generateAndDownloadChecklist = async (marketCode) => {
    if (isGeneratingDocuments) return;
    setIsGeneratingDocuments(true);
    try {
      const marketAnalysis = marketAnalyses.find(m => m.marketCode === marketCode);
      if (!marketAnalysis) return;
      const checklist = DocumentGenerationService.generateCulturalAdaptationChecklist(
        marketCode,
        asset.asset_type ?? 'general',
        marketAnalysis
      );
      generateDocumentPreview('cultural-checklist', checklist, marketCode);
    } catch (error) {
      toast.error('Failed to generate checklist');
    } finally {
      setIsGeneratingDocuments(false);
    }
  };

  const generateTranslationInstructions = async (marketCode) => {
    if (isGeneratingDocuments) return;
    setIsGeneratingDocuments(true);
    try {
      const marketAnalysis = marketAnalyses.find(m => m.marketCode === marketCode);
      if (!marketAnalysis) return;
      const instructions = DocumentGenerationService.generateTranslationInstructions(marketCode, marketAnalysis);
      generateDocumentPreview('translation-instructions', instructions, marketCode);
    } catch (error) {
      toast.error('Failed to generate translation instructions');
    } finally {
      setIsGeneratingDocuments(false);
    }
  };

  const generateRegulatoryMatrix = (marketCode) => {
    const regulatoryAnalysis = regulatoryAnalyses.find(r => r.market === marketCode);
    if (!regulatoryAnalysis) return;
    const matrix = RegulatoryComplianceEngine.generateRegulatoryMatrix(marketCode, regulatoryAnalysis);
    generateDocumentPreview('regulatory-matrix', matrix, marketCode);
  };

  const generateBrandComplianceReport = () => {
    if (!analysis?.brandCompliance) return;
    const report = {
      assetName: asset.name,
      timestamp: new Date().toISOString(),
      brandCompliance: analysis.brandCompliance,
      marketAnalyses: marketAnalyses,
      regulatoryFindings: regulatoryAnalyses,
      recommendations:
        analysis.brandCompliance.issues?.map(issue => ({
          category: issue.category,
          severity: issue.severity,
          description: issue.description,
          suggestion: issue.suggestion
        })) ?? []
    };
    generateDocumentPreview('brand-compliance', report);
  };

  const handleCompleteStep = () => {
    const nextStepData = {
      analysis,
      customNotes,
      localizationBrief: analysis?.localizationBrief,
      brandAnalysis: analysis?.brandCompliance,
      culturalRequirements: analysis?.culturalRequirements
    };
    onStepComplete(nextStepData);
    toast.success('Intelligence analysis completed');
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
              Performing comprehensive 4-phase analysis: Brand baseline, market intelligence, regulatory compliance, and
              actionable roadmaps
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  <span>Phase 1: Multi-layered brand analysis</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  <span>Phase 2: Regulatory compliance pre-check</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  <span>Phase 3: Cultural adaptation roadmaps</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  <span>Phase 4: Actionable intelligence generation</span>
                </div>
              </div>
              <Progress value={75} className="w-full" />
              <p className="text-sm text-muted-foreground text-center">
                Analyzing brand guidelines, cultural factors, regulatory requirements, and generating actionable deliverables...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <div className="space-y-6">
      {/* Phase 1: Enhanced Brand Compliance Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Phase 1: Multi-Layered Brand Analysis
          </CardTitle>
          <CardDescription>
            Global baseline assessment, market-specific requirements, and competitive positioning
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Global Baseline</p>
              <div className="flex items-center gap-2">
                <Progress value={analysis.brandCompliance.score} className="flex-1" />
                <span className="text-lg font-semibold text-primary">{analysis.brandCompliance.score}%</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Messaging</p>
              <div className="flex items-center gap-2">
                <Progress value={analysis.brandCompliance.messagingScore} className="flex-1" />
                <span className="text-sm font-medium">{analysis.brandCompliance.messagingScore}%</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Tone</p>
              <div className="flex items-center gap-2">
                <Progress value={analysis.brandCompliance.toneScore} className="flex-1" />
                <span className="text-sm font-medium">{analysis.brandCompliance.toneScore}%</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Regulatory</p>
              <div className="flex items-center gap-2">
                <Progress value={analysis.brandCompliance.regulatoryScore} className="flex-1" />
                <span className="text-sm font-medium">{analysis.brandCompliance.regulatoryScore}%</span>
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <p className="text-sm font-medium flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                Brand Issues ({analysis.brandCompliance.issues?.length ?? 0})
              </p>

              {analysis.brandCompliance.issues?.slice(0, 3).map((issue, index) => (
                <div key={index} className="flex items-start gap-2 p-2 bg-yellow-50 rounded-lg">
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      issue.severity === 'critical'
                        ? 'border-red-500 text-red-700'
                        : issue.severity === 'high'
                        ? 'border-orange-500 text-orange-700'
                        : 'border-yellow-500 text-yellow-700'
                    }`}
                  >
                    {issue.severity}
                  </Badge>
                  <div className="flex-1">
                    <p className="text-sm text-yellow-800">{issue.description}</p>
                    <p className="text-xs text-yellow-600 mt-1">{issue.suggestion}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Brand Strengths ({analysis.brandCompliance.strengths?.length ?? 0})
              </p>

              {analysis.brandCompliance.strengths?.slice(0, 3).map((strength, index) => (
                <div key={index} className="flex items-start gap-2 p-2 bg-green-50 rounded-lg">
                  <CheckCircle className="h-3 w-3 text-green-600 mt-0.5" />
                  <span className="text-sm text-green-800">{strength}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actionable Brand Intelligence */}
          <div className="flex flex-wrap gap-2 pt-2">
            <Button onClick={generateBrandComplianceReport} variant="outline" size="sm">
              <FileDown className="h-4 w-4 mr-2" />
              Generate Brand Report
            </Button>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Status: {analysis.brandCompliance.status.replace('_', ' ')}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Phase 2: Market-Specific Intelligence */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            Phase 2: Market Intelligence & Cultural Analysis
          </CardTitle>
          <CardDescription>
            Cultural adaptation scoring, competitive positioning, and market-specific requirements
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {marketAnalyses.map(marketAnalysis => (
            <div key={marketAnalysis.marketCode} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h4 className="font-medium">
                    {marketAnalysis.marketName} ({marketAnalysis.marketCode})
                  </h4>
                  <Badge
                    variant={
                      marketAnalysis.riskLevel === 'Critical' ? 'destructive' : marketAnalysis.riskLevel === 'High' ? 'secondary' : 'outline'
                    }
                  >
                    {marketAnalysis.riskLevel} Risk
                  </Badge>
                  <Badge variant="outline">{marketAnalysis.complexity} Complexity</Badge>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Cultural Adaptation</p>
                  <p className="text-lg font-semibold text-primary">{marketAnalysis.culturalAdaptationScore}%</p>
                </div>
              </div>

              {/* Competitive Positioning */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    Competitive Position
                  </p>
                  <div className="bg-blue-50 p-3 rounded-lg space-y-2">
                    <p className="text-sm font-medium text-blue-900">
                      {marketAnalysis.competitivePositioning.marketPosition}
                    </p>
                    <div className="space-y-1">
                      {marketAnalysis.competitivePositioning.keyDifferentiators.slice(0, 2).map((diff, idx) => (
                        <p key={idx} className="text-xs text-blue-700 flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          {diff}
                        </p>
                      ))}
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        marketAnalysis.competitivePositioning.competitiveThreat === 'High'
                          ? 'border-red-500 text-red-700'
                          : marketAnalysis.competitivePositioning.competitiveThreat === 'Medium'
                          ? 'border-orange-500 text-orange-700'
                          : 'border-green-500 text-green-700'
                      }`}
                    >
                      {marketAnalysis.competitivePositioning.competitiveThreat} Competitive Threat
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium flex items-center gap-2">
                    <Users className="h-4 w-4 text-purple-600" />
                    Market Requirements ({marketAnalysis.marketSpecificRequirements.length})
                  </p>
                  <div className="space-y-1 max-h-24 overflow-y-auto">
                    {marketAnalysis.marketSpecificRequirements.map((req, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <Badge
                          variant="outline"
                          className={
                            req.priority === 'must'
                              ? 'border-red-500 text-red-700'
                              : req.priority === 'should'
                              ? 'border-orange-500 text-orange-700'
                              : 'border-gray-500 text-gray-700'
                          }
                        >
                          {req.priority}
                        </Badge>
                        <span className="text-xs">{req.requirement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actionable Market Intelligence */}
              <div className="flex flex-wrap gap-2 pt-2 border-t">
                <Button
                  onClick={() => generateAndDownloadChecklist(marketAnalysis.marketCode)}
                  variant="outline"
                  size="sm"
                  disabled={isGeneratingDocuments}
                >
                  <CheckSquare className="h-4 w-4 mr-2" />
                  Cultural Checklist
                </Button>
                <Button
                  onClick={() => generateTranslationInstructions(marketAnalysis.marketCode)}
                  variant="outline"
                  size="sm"
                  disabled={isGeneratingDocuments}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Translation Brief
                </Button>
                <Button
                  onClick={() => generateRegulatoryMatrix(marketAnalysis.marketCode)}
                  variant="outline"
                  size="sm"
                  disabled={isGeneratingDocuments}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Regulatory Matrix
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Phase 3: Regulatory Compliance Engine */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Phase 3: Regulatory Compliance Pre-Check
          </CardTitle>
          <CardDescription>Market-specific regulatory analysis and compliance gaps identification</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {regulatoryAnalyses.map(regAnalysis => (
            <div key={regAnalysis.market} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{regAnalysis.market} Regulatory Analysis</h4>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      regAnalysis.complianceStatus === 'compliant'
                        ? 'default'
                        : regAnalysis.complianceStatus === 'needs_review'
                        ? 'secondary'
                        : 'destructive'
                    }
                  >
                    {regAnalysis.complianceStatus.replace('_', ' ')}
                  </Badge>
                  <span className="text-lg font-semibold text-primary">{regAnalysis.overallCompliance}%</span>
                </div>
              </div>

              {regAnalysis.criticalIssues.length > 0 && (
                <div className="bg-red-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-red-900 mb-2">
                    Critical Issues ({regAnalysis.criticalIssues.length})
                  </p>
                  <div className="space-y-1">
                    {regAnalysis.criticalIssues.slice(0, 2).map((issue, idx) => (
                      <p key={idx} className="text-xs text-red-700 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        {issue.requirement.requirement}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-blue-900 mb-2">Next Steps</p>
                <div className="space-y-1">
                  {regAnalysis.nextSteps.slice(0, 2).map((step, idx) => (
                    <p key={idx} className="text-xs text-blue-700 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {step}
                    </p>
                  ))}
                </div>
              </div>

              {regAnalysis.reviewRequired && (
                <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm text-yellow-800">
                    Regulatory review required before proceeding
                  </span>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Phase 4: Actionable Intelligence & Productivity Accelerators */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Phase 4: Productivity Accelerators & Deliverables
          </CardTitle>
          <CardDescription>Auto-generated briefs, compliance checklists, and localization-ready outputs</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {localizationBrief && (
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-medium">Comprehensive Localization Brief</h4>
                <div className="bg-green-50 p-3 rounded-lg space-y-2">
                  <p className="text-sm text-green-900">
                    <span className="font-medium">Executive Summary:</span> {localizationBrief.executiveSummary.overallComplexity} complexity project
                  </p>
                  <p className="text-sm text-green-900">
                    <span className="font-medium">Timeline:</span> {localizationBrief.executiveSummary.estimatedDuration}
                  </p>
                  <p className="text-sm text-green-900">
                    <span className="font-medium">Target Markets:</span> {localizationBrief.targetMarkets.join(', ')}
                  </p>
                  <div className="space-y-1">
                    <p className="text-xs text-green-700 font-medium">Key Success Factors:</p>
                    {localizationBrief.executiveSummary.successFactors.slice(0, 2).map((factor, idx) => (
                      <p key={idx} className="text-xs text-green-700 flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        {factor}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Adaptation Roadmaps</h4>
                <div className="space-y-2">
                  {adaptationRoadmaps.map(roadmap => (
                    <div key={roadmap.marketCode} className="bg-blue-50 p-3 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-blue-900">{roadmap.marketCode}</span>
                        <Badge
                          variant="outline"
                          className={
                            roadmap.timelineImpact === 'major_delay'
                              ? 'border-red-500 text-red-700'
                              : roadmap.timelineImpact === 'minor_delay'
                              ? 'border-yellow-500 text-yellow-700'
                              : 'border-green-500 text-green-700'
                          }
                        >
                          {roadmap.timelineImpact.replace('_', ' ')}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <p className="font-medium text-blue-800">Critical: {roadmap.criticalChanges.length}</p>
                        </div>
                        <div>
                          <p className="font-medium text-blue-800">Recommended: {roadmap.recommendedChanges.length}</p>
                        </div>
                        <div>
                          <p className="font-medium text-blue-800">Optional: {roadmap.optionalChanges.length}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Master Action Center */}
          <Separator />
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-yellow-600" />
              Master Action Center
            </h4>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
              <Button onClick={handleDownloadBrief} variant="default" size="sm" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download Master Brief
              </Button>
              <Button variant="outline" size="sm" className="w-full" disabled>
                <ExternalLink className="h-4 w-4 mr-2" />
                Send to TMS
              </Button>
              <Button variant="outline" size="sm" className="w-full" disabled>
                <Users className="h-4 w-4 mr-2" />
                Alert Brand Guardian
              </Button>
              <Button variant="outline" size="sm" className="w-full" disabled>
                <Clock className="h-4 w-4 mr-2" />
                Schedule Review
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {isGeneratingDocuments
                ? 'Generating documents...'
                : `Generated ${marketAnalyses.length} market analyses, ${regulatoryAnalyses.length} compliance reports, and comprehensive localization brief`}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Custom Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Additional Strategic Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Add strategic considerations, stakeholder requirements, or special instructions for this localization intelligence analysis..."
            value={customNotes}
            onChange={(e) => setCustomNotes(e.target.value)}
            rows={3}
          />
        </CardContent>
      </Card>

      {/* Step Actions */}
      <div className="flex justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <span>Enhanced intelligence analysis complete - {marketAnalyses.length} markets analyzed</span>
        </div>
        <Button onClick={handleCompleteStep}>Continue to Project Optimization</Button>
      </div>

      {/* Universal Document Preview Modal */}
      {documentPreview && pendingDownload && (
        <UniversalDocumentPreviewModal
          isOpen={isPreviewOpen}
          onClose={() => {
            setIsPreviewOpen(false);
            setPendingDownload(null);
            setDocumentPreview(null);
          }}
          preview={documentPreview}
          documentType={pendingDownload.type}
          originalData={pendingDownload.data}
          isGenerating={isGeneratingDocuments}
          onDownload={handleProfessionalDownload}
        />
      )}
    </div>
  );
};
