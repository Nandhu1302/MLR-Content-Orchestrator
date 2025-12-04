import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Shield,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  FileCheck,
  Flag,
  Circle,
  Eye
} from "lucide-react";
import { toast } from "sonner";
import { useGlocalAI } from "@/hooks/useGlocalAI";
import { RegulatoryAnalysisModal } from "../modals/RegulatoryAnalysisModal";
import { RegulatoryIntelligenceDashboard } from "@/components/localization/intelligence/RegulatoryIntelligenceDashboard";
import { RegulatoryIntelligenceMatrixService } from "@/services/RegulatoryIntelligenceMatrixService";

export const RegulatoryComplianceHub = ({
  onPhaseComplete,
  onNext,
  projectData,
  phaseData,
  allPhaseData
}) => {
  const [segmentCompliance, setSegmentCompliance] = useState([]);
  const [selectedSegmentId, setSelectedSegmentId] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [realTimeValidation, setRealTimeValidation] = useState(null);
  const { analyzeCulturalFit } = useGlocalAI();

  // Initialize segments from phase 3 cultural intelligence data
  useEffect(() => {
    setIsInitializing(true);
    
    console.log("[Regulatory Compliance] Initializing with data:", { 
      allPhaseData, 
      phase3: allPhaseData?.phase3,
      phaseData 
    });
    
    try {
      const phase3Data = allPhaseData?.phase3;
      
      console.log("[Regulatory Compliance] Phase 3 data structure:", {
        hasPhase3Data: !!phase3Data,
        phase3Keys: phase3Data ? Object.keys(phase3Data) : [],
        segmentAdaptationsCount: phase3Data?.segmentAdaptations?.length || 0,
        firstSegmentSample: phase3Data?.segmentAdaptations?.[0] 
          ? {
              hasAdaptedText: !!phase3Data.segmentAdaptations[0].adaptedText,
              hasCulturalScore: !!phase3Data.segmentAdaptations[0].culturalScore,
              hasSourceText: !!phase3Data.segmentAdaptations[0].sourceText
            }
          : null
      });
      
      if (!phase3Data) {
        console.warn("[Regulatory Compliance] No Phase 3 data found - initializing with empty state");
        setSegmentCompliance([]);
        setIsInitializing(false);
        return;
      }
      
      // Get cultural draft data from phase 3 - correctly read segmentAdaptations
      const culturalDraft = phase3Data.segmentAdaptations;
      
      if (!culturalDraft || !Array.isArray(culturalDraft)) {
        console.warn("[Regulatory Compliance] No cultural draft found in Phase 3");
        setSegmentCompliance([]);
        setIsInitializing(false);
        return;
      }
      
      const initialCompliance = culturalDraft.map((seg) => ({
        segmentId: seg.segmentId || `segment-${Date.now()}-${Math.random()}`,
        sourceText: seg.sourceText || '',
        culturallyAdaptedText: seg.adaptedText || '', // Phase 3 saves as 'adaptedText'
        culturalScore: seg.culturalScore || 0,
        approvedText: seg.adaptedText || '', // Start regulatory review with culturally adapted content
        regulatoryIssues: [],
        mustChangeRules: [],
        cannotChangeRules: [],
        shouldChangeRules: [],
        automatedValidations: [],
        riskLevel: 'low',
        complianceScore: 0,
        changes: [],
        ruleActions: [],
        approvedAt: undefined
      }));
      
      console.log("[Regulatory Compliance] Initialized with segments:", initialCompliance.length);
      setSegmentCompliance(initialCompliance);

      // Auto-select first segment
      if (initialCompliance.length > 0) {
        setSelectedSegmentId(initialCompliance[0].segmentId);
      }
      setIsInitializing(false);
    } catch (error) {
      console.error("[Regulatory Compliance] Error initializing:", error);
      setSegmentCompliance([]);
      setIsInitializing(false);
    }
  }, [allPhaseData?.phase3]);

  const selectedSegment = useMemo(() => {
    return segmentCompliance.find(s => s.segmentId === selectedSegmentId) || null;
  }, [segmentCompliance, selectedSegmentId]);

  const selectedSegmentIndex = useMemo(() => {
    return segmentCompliance.findIndex(s => s.segmentId === selectedSegmentId);
  }, [segmentCompliance, selectedSegmentId]);

  // Perform AI Compliance Check (opens modal)
  const performSegmentComplianceCheck = async (segmentId) => {
    const segment = segmentCompliance.find(s => s.segmentId === segmentId);
    if (!segment) return;

    setIsAnalyzing(true);
    
    try {
      console.log('[Regulatory Compliance] Starting AI analysis for segment:', segmentId);
      
      // AI analysis via edge function
      const aiAnalysis = await analyzeCulturalFit({
        text: segment.approvedText,
        analysisType: 'regulatory',
        targetMarket: projectData.target_markets?.[0] || 'US',
        context: {
          therapeuticArea: projectData.therapeutic_area,
          assetType: allPhaseData?.phase1?.assetType || phaseData?.assetType,
          brandId: projectData.brand_id
        }
      });

      // Parse AI analysis response
      let parsedAIAnalysis = null;
      let aiMustChangeRules = [];
      let aiShouldChangeRules = [];
      
      if (aiAnalysis) {
        try {
          console.log('[Regulatory] Raw AI analysis:', aiAnalysis);
          
          // The edge function returns stringified JSON in the 'analysis' field
          const analysisData = typeof aiAnalysis === 'string' 
            ? JSON.parse(aiAnalysis.replace(/```json\n|\n```/g, '')) 
            : aiAnalysis;
          
          parsedAIAnalysis = {
            complianceScore: analysisData.complianceScore || 0,
            issues: analysisData.issues || [],
            recommendations: analysisData.recommendations || [],
            requiredChanges: analysisData.requiredChanges || []
          };

          console.log('[Regulatory] Parsed AI analysis:', parsedAIAnalysis);

          // Transform AI issues into rule format
          aiMustChangeRules = parsedAIAnalysis.issues
            .filter((issue) => issue.severity === 'high')
            .map((issue) => ({
              ruleName: issue.issue,
              description: issue.issue,
              rationale: parsedAIAnalysis.recommendations.find((r) => r.includes(issue.issue)) || '',
              changeRequirement: 'MUST_CHANGE'
            }));

          aiShouldChangeRules = parsedAIAnalysis.issues
            .filter((issue) => issue.severity === 'medium' || issue.severity === 'low')
            .map((issue) => ({
              ruleName: issue.issue,
              description: issue.issue,
              rationale: parsedAIAnalysis.recommendations.find((r) => r.includes(issue.issue)) || ''
            }));

          // Deduplicate rules by similarity
          const deduplicateRules = (rules) => {
            const deduplicated = [];
            
            for (const rule of rules) {
              const isDuplicate = deduplicated.some(existing => {
                // Calculate simple text similarity
                const similarity = calculateSimilarity(existing.description, rule.description);
                return similarity > 0.7; // 70% similarity threshold
              });
              
              if (!isDuplicate) {
                deduplicated.push(rule);
              } else {
                // Merge rationales if duplicate found
                const existing = deduplicated.find(e => 
                  calculateSimilarity(e.description, rule.description) > 0.7
                );
                if (existing && rule.rationale && existing.rationale !== rule.rationale) {
                  existing.rationale = `${existing.rationale}; ${rule.rationale}`;
                }
              }
            }
            
            return deduplicated;
          };
          
          const calculateSimilarity = (str1, str2) => {
            const longer = str1.length > str2.length ? str1 : str2;
            const shorter = str1.length > str2.length ? str2 : str1;
            
            if (longer.length === 0) return 1.0;
            
            const editDistance = levenshteinDistance(longer.toLowerCase(), shorter.toLowerCase());
            return (longer.length - editDistance) / longer.length;
          };
          
          const levenshteinDistance = (str1, str2) => {
            const matrix = [];
            
            for (let i = 0; i <= str2.length; i++) {
              matrix[i] = [i];
            }
            
            for (let j = 0; j <= str1.length; j++) {
              matrix[0][j] = j;
            }
            
            for (let i = 1; i <= str2.length; i++) {
              for (let j = 1; j <= str1.length; j++) {
                if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                  matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                  matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                  );
                }
              }
            }
            
            return matrix[str2.length][str1.length];
          };

          aiMustChangeRules = deduplicateRules(aiMustChangeRules);
          aiShouldChangeRules = deduplicateRules(aiShouldChangeRules);

          console.log('[Regulatory] AI must change rules (after dedup):', aiMustChangeRules.length);
          console.log('[Regulatory] AI should change rules (after dedup):', aiShouldChangeRules.length);
        } catch (err) {
          console.warn('[Regulatory] Could not parse AI analysis:', err);
        }
      }

      // Load regulatory matrix rules (fallback)
      const matrixReport = await RegulatoryIntelligenceMatrixService.generateRegulatoryMatrix(
        projectData.asset_id || projectData.id,
        projectData.brand_id,
        projectData.target_markets || ['US'],
        projectData.therapeutic_area || 'General'
      );

      // Load pre-approved content
      const preApprovedLibrary = await RegulatoryIntelligenceMatrixService.getPreApprovedContentLibrary(
        projectData.target_markets || ['US'],
        projectData.therapeutic_area || 'General',
        projectData.brand_id
      );

      // Get regulatory templates
      const regulatoryTemplates = matrixReport.mustChangeRules
        .filter(rule => rule.templateContent)
        .map(rule => ({
          templateName: rule.ruleName,
          description: rule.description,
          templateContent: rule.templateContent || '',
          usageGuidelines: rule.rationale
        }));

      // Determine risk level based on AI score
      const aiRiskLevel = parsedAIAnalysis?.complianceScore 
        ? (parsedAIAnalysis.complianceScore < 60 ? 'high' : 
           parsedAIAnalysis.complianceScore < 80 ? 'medium' : 'low')
        : 'medium';

      // CRITICAL: Always use AI results when available, even if arrays are empty
      // Empty arrays mean the content is compliant, not that we should show fake data!
      const useAIResults = parsedAIAnalysis !== null;
      
      console.log('[Regulatory] Using AI results:', useAIResults, 'AI must change:', aiMustChangeRules.length, 'AI should change:', aiShouldChangeRules.length);

      // Set analysis data for modal - ALWAYS prioritize AI results over matrix mock data
      setCurrentAnalysis({
        segmentId,
        overallScore: parsedAIAnalysis?.complianceScore || matrixReport.overallComplianceScore,
        riskLevel: aiRiskLevel,
        mustChangeRules: useAIResults ? aiMustChangeRules : matrixReport.mustChangeRules,
        cannotChangeRules: useAIResults ? [] : matrixReport.cannotChangeRules, // AI doesn't return these
        shouldChangeRules: useAIResults ? aiShouldChangeRules : matrixReport.shouldChangeRules,
        automatedValidations: useAIResults ? [] : matrixReport.automatedValidations, // AI handles validation
        preApprovedContent: preApprovedLibrary,
        regulatoryTemplates
      });

      // Update segment with compliance data
      setSegmentCompliance(prev => prev.map(s =>
        s.segmentId === segmentId
          ? {
              ...s,
              mustChangeRules: matrixReport.mustChangeRules,
              cannotChangeRules: matrixReport.cannotChangeRules,
              shouldChangeRules: matrixReport.shouldChangeRules,
              automatedValidations: matrixReport.automatedValidations,
              complianceScore: matrixReport.overallComplianceScore,
              riskLevel: matrixReport.mustChangeRules.length > 0 ? 'high' : 'medium'
            }
          : s
      ));

      // Open modal
      setShowAnalysisModal(true);
      console.log('[Regulatory Compliance] AI analysis completed successfully');
    } catch (error) {
      console.error('[Regulatory Compliance] AI analysis failed:', error);
      toast.error('Compliance check failed', {
        description: error.message || 'Failed to perform compliance check. Please try again.'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handle Regulatory Actions (from modal)
  const handleRegulatoryAction = (action) => {
    if (!selectedSegmentId) return;

    const ruleAction = {
      ruleId: action.rule.ruleName,
      action: action.type === 'accept' ? 'accepted' 
        : action.type === 'mlr_exception' ? 'mlr_exception'
        : action.type === 'blocking' ? 'blocking'
        : action.type === 'defer_to_mlr' ? 'deferred'
        : action.type === 'accept_risk' ? 'risk_accepted'
        : 'acknowledged',
      reasoning: action.reasoning,
      timestamp: new Date().toISOString()
    };

    setSegmentCompliance(prev => prev.map(s =>
      s.segmentId === selectedSegmentId
        ? {
            ...s,
            approvedText: action.type === 'accept' && (action.rule.preApprovedContent?.[0] || action.rule.templateContent)
              ? s.approvedText + '\n\n' + (action.rule.preApprovedContent?.[0] || action.rule.templateContent)
              : s.approvedText,
            ruleActions: [...s.ruleActions.filter(ra => ra.ruleId !== action.rule.ruleName), ruleAction],
            complianceScore: action.type === 'accept' ? Math.min(s.complianceScore + 5, 100) 
              : action.type === 'blocking' ? Math.max(s.complianceScore - 10, 0)
              : s.complianceScore
          }
        : s
    ));
  };

  // Real-Time Validation (as user types)
  useEffect(() => {
    const debounceTimer = setTimeout(async () => {
      if (selectedSegment?.approvedText) {
        try {
          const results = await RegulatoryIntelligenceMatrixService.validateContentInRealTime(
            selectedSegment.approvedText,
            projectData.brand_id,
            projectData.therapeutic_area || 'General',
            projectData.target_markets?.[0] || 'US'
          );
          
          setRealTimeValidation(results);
          
          // Update compliance score if available
          if (results && typeof results === 'object' && 'complianceScore' in results && typeof results.complianceScore === 'number') {
            const score = results.complianceScore; // Explicitly type as number
            setSegmentCompliance(prev => prev.map(s =>
              s.segmentId === selectedSegmentId
                ? { ...s, complianceScore: score }
                : s
            ));
          }
        } catch (error) {
          console.error('Real-time validation failed:', error);
        }
      }
    }, 1000);
    
    return () => clearTimeout(debounceTimer);
  }, [selectedSegment?.approvedText, selectedSegmentId, projectData]);

  // Approve Segment
  const handleApproveSegment = () => {
    if (!selectedSegmentId || !selectedSegment) return;
    
    // Validate no critical issues
    if (selectedSegment.riskLevel === 'critical') {
      toast.error('Cannot approve: Critical compliance issues must be resolved');
      return;
    }
    
    // Validate all MUST_CHANGE rules addressed
    if (selectedSegment.mustChangeRules.length > 0) {
      toast.error('Cannot approve: All MUST_CHANGE rules must be addressed');
      return;
    }
    
    setSegmentCompliance(prev => prev.map(s =>
      s.segmentId === selectedSegmentId
        ? { ...s, approvedAt: new Date().toISOString() }
        : s
    ));

    // Move to next unapproved segment
    const currentIndex = segmentCompliance.findIndex(s => s.segmentId === selectedSegmentId);
    const nextUnapproved = segmentCompliance.slice(currentIndex + 1).find(s => !s.approvedAt);
    if (nextUnapproved) {
      setSelectedSegmentId(nextUnapproved.segmentId);
    }
    
    toast.success('Segment approved for regulatory compliance');
  };

  // Navigation
  const navigateToPreviousSegment = () => {
    if (selectedSegmentIndex > 0) {
      setSelectedSegmentId(segmentCompliance[selectedSegmentIndex - 1].segmentId);
    }
  };

  const navigateToNextSegment = () => {
    if (selectedSegmentIndex < segmentCompliance.length - 1) {
      setSelectedSegmentId(segmentCompliance[selectedSegmentIndex + 1].segmentId);
    }
  };

  // Complete Phase
  const handleCompletePhase = () => {
    const approvedCount = segmentCompliance.filter(s => s.approvedAt).length;
    const criticalIssues = segmentCompliance.filter(s => s.riskLevel === 'critical').length;

    if (approvedCount !== segmentCompliance.length) {
      toast.error('All segments must be approved before completing phase');
      return;
    }

    if (criticalIssues > 0) {
      toast.error('Critical compliance issues must be resolved');
      return;
    }

    const phaseOutput = {
      compliantTranslation: segmentCompliance.map(s => ({
        segmentId: s.segmentId,
        sourceText: s.sourceText,
        culturallyAdaptedText: s.culturallyAdaptedText,
        approvedText: s.approvedText,
        complianceScore: s.complianceScore,
        changes: s.changes,
        approvedAt: s.approvedAt
      })),
      overallComplianceScore: segmentCompliance.reduce((sum, s) => sum + s.complianceScore, 0) / segmentCompliance.length,
      totalChanges: segmentCompliance.reduce((sum, s) => sum + s.changes.filter(c => c.status === 'accepted').length, 0),
      completedAt: new Date().toISOString()
    };

    onPhaseComplete(phaseOutput);
    toast.success('Phase 4 completed successfully!');
    onNext();
  };

  // Computed values
  const approvedCount = segmentCompliance.filter(s => s.approvedAt).length;
  const criticalIssuesCount = segmentCompliance.filter(s => s.riskLevel === 'critical').length;
  const allApproved = approvedCount === segmentCompliance.length;

  const getRiskIcon = (riskLevel) => {
    switch (riskLevel) {
      case 'critical':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'medium':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'low':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Circle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  if (isInitializing) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading regulatory compliance data...</p>
        </div>
      </div>
    );
  }

  if (segmentCompliance.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <Alert className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>No Cultural Draft Data</AlertTitle>
          <AlertDescription>
            Please complete Phase 3 (Cultural Intelligence) first to generate a culturally adapted draft before proceeding to regulatory compliance review.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Main Tabs */}
      <Tabs defaultValue="review" className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="grid w-full grid-cols-3 shrink-0">
          <TabsTrigger value="review">Compliance Review</TabsTrigger>
          <TabsTrigger value="report">Compliance Report</TabsTrigger>
          <TabsTrigger value="intelligence">Regulatory Intelligence</TabsTrigger>
        </TabsList>

        {/* TAB 1: Compliance Review (main workflow) */}
        <TabsContent value="review" className="flex-1 flex flex-col overflow-hidden mt-0 data-[state=inactive]:hidden">
          {/* Phase Name Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Regulatory Compliance Workspace
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Review culturally adapted content for regulatory compliance and market requirements
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm text-muted-foreground">
                Progress: {approvedCount} / {segmentCompliance.length} approved
              </div>
              <Progress value={(approvedCount / segmentCompliance.length) * 100} className="w-32" />
              {criticalIssuesCount > 0 && (
                <Badge variant="destructive">
                  {criticalIssuesCount} Critical
                </Badge>
              )}
            </div>
          </div>

          <ResizablePanelGroup direction="horizontal" className="flex-1">
            {/* Left: Segment List (30%) */}
            <ResizablePanel defaultSize={30} minSize={20}>
              <div className="h-full flex flex-col">
                {/* Content Segments Subheader */}
                <div className="p-4 border-b bg-muted/30 shrink-0">
                  <h4 className="font-semibold text-sm">Content Segments</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {segmentCompliance.length} segments to review
                  </p>
                </div>

                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-2">
                    {segmentCompliance.map((seg, idx) => (
                      <button
                        key={seg.segmentId}
                        onClick={() => setSelectedSegmentId(seg.segmentId)}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                          selectedSegmentId === seg.segmentId 
                            ? "bg-primary text-primary-foreground" 
                            : "hover:bg-accent"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">Segment {idx + 1}</span>
                          {seg.approvedAt ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            getRiskIcon(seg.riskLevel)
                          )}
                        </div>
                        <p className="text-sm line-clamp-2 mt-1 opacity-80">
                          {seg.sourceText.length > 80 ? seg.sourceText.substring(0, 80) + '...' : seg.sourceText}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant={
                            seg.riskLevel === 'critical' ? 'destructive' :
                            seg.riskLevel === 'high' ? 'destructive' :
                            seg.riskLevel === 'medium' ? 'secondary' : 'default'
                          } className="text-xs">
                            {seg.riskLevel}
                          </Badge>
                          {seg.complianceScore > 0 && (
                            <Badge variant="outline" className="text-xs">{seg.complianceScore}%</Badge>
                          )}
                        </div>
                        {seg.changes.length > 0 && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {seg.changes.filter(c => c.status === 'accepted').length} changes applied
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </ResizablePanel>

            <ResizableHandle />

            {/* Right: Segment Detail Panel (70%) */}
            <ResizablePanel defaultSize={70}>
              <ScrollArea className="h-full px-4">
                {selectedSegment ? (
                  <div className="space-y-4">
                    {/* 1. Source Text (read-only) */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Source Text</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="p-3 bg-muted rounded text-sm">
                          {selectedSegment.sourceText}
                        </div>
                      </CardContent>
                    </Card>

                    {/* 2. Culturally Adapted Text from Phase 3 (read-only) */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm flex items-center justify-between">
                          <span>Culturally Adapted Text (Phase 3)</span>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">Score: {selectedSegment.culturalScore}/100</Badge>
                            <Button 
                              onClick={() => performSegmentComplianceCheck(selectedSegment.segmentId)}
                              disabled={isAnalyzing}
                              size="sm"
                            >
                              {isAnalyzing ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Analyzing...
                                </>
                              ) : (
                                <>
                                  <Shield className="h-4 w-4 mr-2" />
                                  Run Compliance Check
                                </>
                              )}
                            </Button>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm">
                          {selectedSegment.culturallyAdaptedText}
                        </div>
                      </CardContent>
                    </Card>

                    {/* 4. Regulatory Compliant Text (editable) */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm flex items-center justify-between">
                          <span>Regulatory Compliant Text</span>
                          <div className="flex items-center gap-2">
                            {selectedSegment.complianceScore > 0 && (
                              <Badge className={
                                selectedSegment.complianceScore >= 85 ? 'bg-green-600' :
                                selectedSegment.complianceScore >= 70 ? 'bg-yellow-600' : 'bg-red-600'
                              }>
                                {selectedSegment.complianceScore}%
                              </Badge>
                            )}
                            <Button
                              onClick={() => {
                                const change = {
                                  id: `change-${Date.now()}`,
                                  original: '',
                                  suggested: '',
                                  status: 'flagged',
                                  reasoning: 'Flagged for expert review',
                                  timestamp: new Date().toISOString(),
                                  category: 'must_change'
                                };
                                setSegmentCompliance(prev => prev.map(s =>
                                  s.segmentId === selectedSegmentId
                                    ? { ...s, changes: [...s.changes, change] }
                                    : s
                                ));
                                toast.info('Segment flagged for expert review');
                              }}
                              variant="outline"
                              size="sm"
                            >
                              <Flag className="h-4 w-4 mr-2" />
                              Flag for Review
                            </Button>
                            <Button
                              onClick={handleApproveSegment}
                              disabled={selectedSegment.riskLevel === 'critical' || selectedSegment.mustChangeRules.length > 0}
                              className="bg-green-600 hover:bg-green-700"
                              size="sm"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve
                            </Button>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Textarea
                          value={selectedSegment.approvedText}
                          onChange={(e) => {
                            setSegmentCompliance(prev => prev.map(s =>
                              s.segmentId === selectedSegmentId
                                ? { ...s, approvedText: e.target.value }
                                : s
                            ));
                          }}
                          rows={8}
                          className="font-mono text-sm"
                          placeholder="Edit the text to ensure regulatory compliance..."
                        />

                        {/* Real-time validation results */}
                        {realTimeValidation && realTimeValidation.issues && realTimeValidation.issues.length > 0 && (
                          <div className="space-y-2">
                            {realTimeValidation.issues.map((issue, idx) => (
                              <Alert key={idx} variant="destructive" className="text-xs">
                                <AlertTriangle className="h-3 w-3" />
                                <AlertTitle className="text-xs">{issue.rule}</AlertTitle>
                                <AlertDescription className="text-xs">{issue.message}</AlertDescription>
                              </Alert>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* 5. Changes Log */}
                    {selectedSegment.changes.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Changes Applied</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          {selectedSegment.changes.map(change => (
                            <div key={change.id} className={`p-2 rounded text-xs ${
                              change.status === 'accepted' ? 'bg-green-50 border border-green-200' :
                              change.status === 'flagged' ? 'bg-yellow-50 border border-yellow-200' :
                              'bg-red-50 border border-red-200'
                            }`}>
                              <div className="flex items-center justify-between mb-1">
                                <Badge className="text-xs">{change.category}</Badge>
                                <span className="text-muted-foreground">
                                  {new Date(change.timestamp).toLocaleString()}
                                </span>
                              </div>
                              {change.suggested && (
                                <div className="text-green-700">{change.suggested.substring(0, 100)}...</div>
                              )}
                              <div className="text-muted-foreground mt-1">{change.reasoning}</div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">Select a segment to review</p>
                  </div>
                )}
              </ScrollArea>
            </ResizablePanel>
          </ResizablePanelGroup>
        </TabsContent>

        {/* TAB 2: Compliance Report */}
        <TabsContent value="report" className="flex-1 flex flex-col overflow-hidden mt-0 data-[state=inactive]:hidden">
          <ScrollArea className="h-full">
            <div className="space-y-6">
              {/* Statistics Grid */}
              <div className="grid grid-cols-4 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Segments Approved</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{approvedCount}/{segmentCompliance.length}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Critical Issues</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-red-600">{criticalIssuesCount}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Avg Compliance Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {Math.round(segmentCompliance.reduce((sum, s) => sum + s.complianceScore, 0) / segmentCompliance.length)}%
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Total Changes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {segmentCompliance.reduce((sum, s) => sum + s.changes.filter(c => c.status === 'accepted').length, 0)}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Final Compliant Translation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Final Regulatory-Compliant Translation</span>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      Export Report
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg space-y-4">
                    {segmentCompliance.map((seg, idx) => (
                      <div key={seg.segmentId}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-muted-foreground">Segment {idx + 1}</span>
                          {seg.approvedAt && (
                            <Badge variant="outline" className="text-xs">
                              Approved {new Date(seg.approvedAt).toLocaleString()}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm">{seg.approvedText}</p>
                        {idx < segmentCompliance.length - 1 && <Separator className="my-3" />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Complete Phase Button */}
              <Button
                onClick={handleCompletePhase}
                disabled={!allApproved || criticalIssuesCount > 0}
                className="w-full"
                size="lg"
              >
                <FileCheck className="h-5 w-5 mr-2" />
                Complete Phase 4 - Regulatory Compliance
              </Button>
            </div>
          </ScrollArea>
        </TabsContent>

        {/* TAB 3: Regulatory Intelligence */}
        <TabsContent value="intelligence" className="flex-1 flex flex-col overflow-hidden mt-0 data-[state=inactive]:hidden">
          <ScrollArea className="h-full">
            <RegulatoryIntelligenceDashboard
              assetId={projectData.asset_id || projectData.id}
              brandId={projectData.brand_id}
              targetMarkets={projectData.target_markets || ['US']}
              therapeuticArea={projectData.therapeutic_area || 'General'}
              onComplianceAction={(action) => {
                console.log('Compliance action:', action);
              }}
            />
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {/* Regulatory Analysis Modal */}
      <RegulatoryAnalysisModal
        isOpen={showAnalysisModal}
        onClose={() => setShowAnalysisModal(false)}
        segmentName={`Segment ${selectedSegmentIndex + 1}`}
        analysisData={currentAnalysis}
        onRegulatoryAction={handleRegulatoryAction}
        onMarkAsCompliant={handleApproveSegment}
        onReAnalyze={() => selectedSegmentId && performSegmentComplianceCheck(selectedSegmentId)}
        isAnalyzing={isAnalyzing}
        isApproved={selectedSegment?.approvedAt !== undefined}
        targetMarkets={projectData.target_markets || ['US']}
        ruleActions={selectedSegment?.ruleActions || []}
      />
    </div>
  );
};