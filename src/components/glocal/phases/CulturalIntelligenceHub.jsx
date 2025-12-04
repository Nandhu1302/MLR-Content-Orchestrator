import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Brain, CheckCircle2, Copy, FileText, AlertCircle, Loader2, Sparkles, ChevronLeft, ChevronRight, Flag, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CulturalIntelligenceHandoffButton } from "./CulturalIntelligenceHandoffButton";
import { CulturalAnalysisModal } from "../modals/CulturalAnalysisModal";
import { CulturalIntelligenceErrorBoundary } from "../CulturalIntelligenceErrorBoundary";
import { useGlocalAutoSave } from "@/hooks/useGlocalAutoSave";

export const CulturalIntelligenceHub = ({
  onPhaseComplete,
  onNext,
  projectData,
  phaseData,
  allPhaseData
}) => {
  const [segmentAdaptations, setSegmentAdaptations] = useState([]);
  const [selectedSegmentId, setSelectedSegmentId] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [draftText, setDraftText] = useState("");
  const [overallCulturalScore, setOverallCulturalScore] = useState(0);
  const [activeTab, setActiveTab] = useState("adaptation");
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [initError, setInitError] = useState(null);

  // Auto-save integration
  const workflowData = useMemo(() => ({
    ...allPhaseData,
    phase3: {
      segmentAdaptations,
      draftText,
      overallCulturalScore,
      lastUpdated: new Date().toISOString()
    }
  }), [allPhaseData, segmentAdaptations, draftText, overallCulturalScore]);

  const { forceSave, isSaving } = useGlocalAutoSave({
    projectId: projectData?.id,
    workflowData,
    enabled: !!projectData?.id && segmentAdaptations.length > 0,
    interval: 10000 // Auto-save every 10 seconds
  });

  // Initialize segments - restore from phase 3 if exists, otherwise from phase 2
  useEffect(() => {
    setIsInitializing(true);
    setInitError(null);
    
    console.log("[Cultural Intelligence] Initializing with data:", { 
      allPhaseData, 
      phase2: allPhaseData?.phase2,
      phase3: allPhaseData?.phase3,
      phaseData 
    });
    
    try {
      // PRIORITY 1: Check for existing Phase 3 data (saved progress)
      const phase3Data = allPhaseData?.phase3;
      if (phase3Data?.segmentAdaptations && Array.isArray(phase3Data.segmentAdaptations) && phase3Data.segmentAdaptations.length > 0) {
        console.log("[Cultural Intelligence] Restoring from Phase 3 saved data:", phase3Data.segmentAdaptations.length, "segments");
        
        setSegmentAdaptations(phase3Data.segmentAdaptations);
        setDraftText(phase3Data.draftText || "");
        setOverallCulturalScore(phase3Data.overallCulturalScore || 0);
        
        // Auto-select first segment or first unreviewed
        const firstUnreviewed = phase3Data.segmentAdaptations.find((s) => !s.isReviewed);
        if (firstUnreviewed) {
          setSelectedSegmentId(firstUnreviewed.segmentId);
        } else if (phase3Data.segmentAdaptations.length > 0) {
          setSelectedSegmentId(phase3Data.segmentAdaptations[0].segmentId);
        }
        
        setIsInitializing(false);
        toast.success("Progress Restored", {
          description: `Loaded ${phase3Data.segmentAdaptations.length} segments from your saved work`
        });
        return;
      }

      // PRIORITY 2: Initialize from Phase 2 data if no Phase 3 exists
      const phase2Data = allPhaseData?.phase2;
      
      if (!phase2Data) {
        console.warn("[Cultural Intelligence] No Phase 2 data found - initializing with empty state");
        setSegmentAdaptations([]);
        setIsInitializing(false);
        return;
      }
      
      if (!phase2Data.segments || !Array.isArray(phase2Data.segments)) {
        console.warn("[Cultural Intelligence] Phase 2 segments not found or not an array:", phase2Data);
        setSegmentAdaptations([]);
        setIsInitializing(false);
        return;
      }
      
      if (phase2Data.segments.length === 0) {
        console.warn("[Cultural Intelligence] Phase 2 segments array is empty");
        setSegmentAdaptations([]);
        setIsInitializing(false);
        return;
      }
      
      const initialAdaptations = phase2Data.segments.map((seg) => ({
        segmentId: seg.id || `segment-${Date.now()}-${Math.random()}`,
        sourceText: seg.sourceText || seg.content || seg.originalText || '',
        originalTranslation: seg.translatedText || '',
        adaptedText: seg.translatedText || '',
        culturalScore: 0,
        isReviewed: false,
        changes: [],
        aiAnalysis: null,
        actedRecommendations: []
      }));
      
      console.log("[Cultural Intelligence] Initialized from Phase 2 with segments:", initialAdaptations.length);
      setSegmentAdaptations(initialAdaptations);

      // Auto-select first segment
      if (initialAdaptations.length > 0) {
        setSelectedSegmentId(initialAdaptations[0].segmentId);
      }
      setIsInitializing(false);
    } catch (error) {
      console.error("[Cultural Intelligence] Error initializing:", error);
      setSegmentAdaptations([]);
      setIsInitializing(false);
    }
  }, [allPhaseData?.phase2, allPhaseData?.phase3]);

  // Save on unmount
  useEffect(() => {
    return () => {
      if (segmentAdaptations.length > 0) {
        forceSave();
      }
    };
  }, [forceSave, segmentAdaptations.length]);
  
  const selectedSegment = useMemo(() => {
    return segmentAdaptations.find(s => s.segmentId === selectedSegmentId) || null;
  }, [segmentAdaptations, selectedSegmentId]);
  
  const performSegmentAnalysis = async (segmentId) => {
    const segment = segmentAdaptations.find(s => s.segmentId === segmentId);
    if (!segment) return;
    setIsAnalyzing(true);
    try {
      const assetType = allPhaseData?.phase1?.assetType || phaseData?.assetType || 'Marketing Material';
      const targetMarket = allPhaseData?.phase1?.targetMarket || phaseData?.targetMarket || allPhaseData?.targetMarket || 'Unknown Market';
      const {
        data,
        error
      } = await supabase.functions.invoke('cultural-intelligence-analyzer', {
        body: {
          translationText: segment.adaptedText,
          targetMarket,
          assetType,
          segmentContext: `Segment ${segmentAdaptations.indexOf(segment) + 1} of ${segmentAdaptations.length}`
        }
      });
      if (error) {
        if (error.message?.includes('429') || error.message?.includes('rate limit')) {
          throw new Error('Rate limit exceeded. Please wait a moment and try again.');
        }
        if (error.message?.includes('402') || error.message?.includes('payment')) {
          throw new Error('AI credits exhausted. Please add credits to continue.');
        }
        throw error;
      }
      if (!data || !data.analysis || typeof data.overallScore !== 'number') {
        throw new Error("Invalid analysis response format");
      }
      const culturalToneScore = data.analysis?.culturalTone?.score || 0;
      const terminologyScore = data.analysis?.terminology?.score || 0;
      const visualScore = data.analysis?.visualGuidance?.score || 0;
      const weightedScore = Math.round(culturalToneScore * 0.4 + terminologyScore * 0.4 + visualScore * 0.2);
      setSegmentAdaptations(prev => prev.map(s => s.segmentId === segmentId ? {
        ...s,
        aiAnalysis: data,
        culturalScore: weightedScore
      } : s));
      toast.success("AI Analysis Complete", {
        description: `Cultural score: ${weightedScore}/100`
      });
      setCurrentAnalysis(data);
      setShowAnalysisModal(true);
      
      // Save immediately after analysis
      forceSave();
    } catch (error) {
      console.error('Cultural intelligence analysis error:', error);
      toast.error("Analysis Failed", {
        description: error.message || "Failed to analyze segment. Please try again.",
        duration: 5000
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const handleApplySuggestion = (recommendation) => {
    if (!selectedSegmentId || !recommendation) return;
    
    // Find current segment to get current text
    const currentSegment = segmentAdaptations.find(s => s.segmentId === selectedSegmentId);
    if (!currentSegment) return;

    // Perform text replacement - use split/join to handle multiple occurrences
    const updatedText = currentSegment.adaptedText.split(recommendation.originalText).join(recommendation.suggestedText);

    const change = {
      id: `change-${Date.now()}-${Math.random()}`,
      original: recommendation.originalText,
      suggested: recommendation.suggestedText,
      status: 'accepted',
      reasoning: recommendation.rationale,
      timestamp: new Date().toISOString(),
      category: recommendation.category
    };

    // Track the acted recommendation
    const actedRec = {
      recommendationId: recommendation.id,
      originalText: recommendation.originalText,
      action: 'accepted',
      timestamp: new Date().toISOString()
    };

    // Update state with new adapted text and log the change
    setSegmentAdaptations(prev => prev.map(s => s.segmentId === selectedSegmentId ? {
      ...s,
      adaptedText: updatedText,
      changes: [...s.changes, change],
      actedRecommendations: [...(s.actedRecommendations || []), actedRec]
    } : s));

    // Close and reopen modal to show updated changes
    setShowAnalysisModal(false);
    setTimeout(() => setShowAnalysisModal(true), 100);

    toast.success("Suggestion Applied", {
      description: "Check the adapted text and change log"
    });
    
    // Save immediately after applying suggestion
    forceSave();
  };
  
  const handleFlagSuggestion = (recommendation) => {
    if (!selectedSegmentId || !recommendation) return;
    const change = {
      id: `change-${Date.now()}-${Math.random()}`,
      original: recommendation.originalText,
      suggested: recommendation.suggestedText,
      status: 'flagged',
      reasoning: recommendation.rationale,
      timestamp: new Date().toISOString(),
      category: recommendation.category
    };

    // Track the acted recommendation
    const actedRec = {
      recommendationId: recommendation.id,
      originalText: recommendation.originalText,
      action: 'flagged',
      timestamp: new Date().toISOString()
    };

    setSegmentAdaptations(prev => prev.map(s => s.segmentId === selectedSegmentId ? {
      ...s,
      changes: [...s.changes, change],
      actedRecommendations: [...(s.actedRecommendations || []), actedRec]
    } : s));

    // Close and reopen modal to show updated changes
    setShowAnalysisModal(false);
    setTimeout(() => setShowAnalysisModal(true), 100);

    toast.info("Suggestion Flagged", {
      description: "Check the change log below"
    });
    
    // Save immediately after flagging
    forceSave();
  };
  
  const handleRejectSuggestion = (recommendation) => {
    if (!selectedSegmentId || !recommendation) return;
    const change = {
      id: `change-${Date.now()}-${Math.random()}`,
      original: recommendation.originalText,
      suggested: recommendation.suggestedText,
      status: 'rejected',
      reasoning: recommendation.rationale,
      timestamp: new Date().toISOString(),
      category: recommendation.category
    };

    // Track the acted recommendation
    const actedRec = {
      recommendationId: recommendation.id,
      originalText: recommendation.originalText,
      action: 'rejected',
      timestamp: new Date().toISOString()
    };

    setSegmentAdaptations(prev => prev.map(s => s.segmentId === selectedSegmentId ? {
      ...s,
      changes: [...s.changes, change],
      actedRecommendations: [...(s.actedRecommendations || []), actedRec]
    } : s));

    // Close and reopen modal to show updated changes
    setShowAnalysisModal(false);
    setTimeout(() => setShowAnalysisModal(true), 100);

    toast.success("Suggestion Dismissed", {
      description: "Check the change log below"
    });
    
    // Save immediately after rejecting
    forceSave();
  };
  
  const handleEditAdaptedText = (newText) => {
    if (!selectedSegmentId) return;
    setSegmentAdaptations(prev => prev.map(s => s.segmentId === selectedSegmentId ? {
      ...s,
      adaptedText: newText
    } : s));
  };
  
  const handleMarkReviewed = () => {
    if (!selectedSegmentId) return;
    setSegmentAdaptations(prev => prev.map(s => s.segmentId === selectedSegmentId ? {
      ...s,
      isReviewed: true
    } : s));

    // Move to next unreviewed segment
    const currentIndex = segmentAdaptations.findIndex(s => s.segmentId === selectedSegmentId);
    const nextUnreviewed = segmentAdaptations.slice(currentIndex + 1).find(s => !s.isReviewed);
    if (nextUnreviewed) {
      setSelectedSegmentId(nextUnreviewed.segmentId);
    } else {
      toast.success("All segments reviewed!", {
        description: "You can now generate the final draft"
      });
    }
    
    // Save immediately after marking as reviewed
    forceSave();
  };
  
  const handlePrevious = () => {
    const currentIndex = segmentAdaptations.findIndex(s => s.segmentId === selectedSegmentId);
    if (currentIndex > 0) {
      setSelectedSegmentId(segmentAdaptations[currentIndex - 1].segmentId);
    }
  };
  
  const handleNext = () => {
    const currentIndex = segmentAdaptations.findIndex(s => s.segmentId === selectedSegmentId);
    if (currentIndex < segmentAdaptations.length - 1) {
      setSelectedSegmentId(segmentAdaptations[currentIndex + 1].segmentId);
    }
  };
  
  const handleGenerateDraft = () => {
    const fullDraftText = segmentAdaptations.map((s, idx) => `[Segment ${idx + 1}]\n${s.adaptedText}`).join('\n\n');
    const avgScore = Math.round(segmentAdaptations.reduce((sum, s) => sum + s.culturalScore, 0) / segmentAdaptations.length);
    setDraftText(fullDraftText);
    setOverallCulturalScore(avgScore);
    setActiveTab("draft");
    toast.success("Cultural Draft Generated", {
      description: `Overall cultural score: ${avgScore}/100`
    });
    
    // Save immediately after generating draft
    forceSave();
  };
  
  const handleCopyDraft = () => {
    navigator.clipboard.writeText(draftText);
    toast.success("Copied to Clipboard");
  };
  
  const handleComplete = () => {
    if (!draftText) {
      handleGenerateDraft();
    }
    const outputData = {
      culturallyAdaptedTranslation: draftText,
      segmentAdaptations: segmentAdaptations.map(s => ({
        segmentId: s.segmentId,
        sourceText: s.sourceText,
        originalTranslation: s.originalTranslation,
        adaptedText: s.adaptedText,
        culturalScore: s.culturalScore,
        changes: s.changes,
        aiAnalysis: s.aiAnalysis
      })),
      overallCulturalScore,
      completedAt: new Date().toISOString()
    };
    onPhaseComplete(outputData);
    toast.success("Phase 3 Complete - Cultural Intelligence");
    onNext();
  };
  
  const getStatusBadge = (segment) => {
    if (segment.isReviewed) {
      return <Badge className="bg-green-100 text-green-800 border-green-200">✓ Reviewed</Badge>;
    }
    if (segment.changes.some(c => c.status === 'flagged')) {
      return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">🚩 Flagged</Badge>;
    }
    return <Badge variant="outline" className="text-muted-foreground">⏳ Pending</Badge>;
  };
  
  const getScoreBadge = (score) => {
    if (score === 0) return null;
    if (score >= 85) return <Badge className="bg-green-100 text-green-800">{score}</Badge>;
    if (score >= 70) return <Badge className="bg-yellow-100 text-yellow-800">{score}</Badge>;
    return <Badge className="bg-red-100 text-red-800">{score}</Badge>;
  };
  
  const renderAdaptedTextWithHighlights = () => {
    if (!selectedSegment) return null;
    let displayText = selectedSegment.adaptedText;
    const acceptedChanges = selectedSegment.changes.filter(c => c.status === 'accepted');
    const flaggedChanges = selectedSegment.changes.filter(c => c.status === 'flagged');
    return <div className="space-y-3">
        <Textarea value={displayText} onChange={e => handleEditAdaptedText(e.target.value)} className="min-h-[200px] font-mono text-sm" placeholder="Culturally adapted text will appear here after analysis..." />
        
        {(acceptedChanges.length > 0 || flaggedChanges.length > 0) && <div className="space-y-2">
            <p className="text-sm font-medium">Change Log:</p>
            {acceptedChanges.map(change => <div key={change.id} className="text-xs bg-green-50 border border-green-200 rounded p-2">
                <span className="font-medium text-green-800">✓ Accepted: </span>
                <span className="line-through text-muted-foreground">{change.original}</span>
                {' → '}
                <span className="text-green-700">{change.suggested}</span>
              </div>)}
            {flaggedChanges.map(change => <div key={change.id} className="text-xs bg-yellow-50 border border-yellow-200 rounded p-2">
                <span className="font-medium text-yellow-800">🚩 Flagged: </span>
                <span>{change.original}</span>
                {' → '}
                <span className="text-yellow-700">{change.suggested}</span>
              </div>)}
          </div>}
      </div>;
  };

  // Loading state
  if (isInitializing) {
    return <div className="h-full flex flex-col gap-4 p-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="flex-1 grid grid-cols-12 gap-4">
          <div className="col-span-4 space-y-3">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
          <div className="col-span-8">
            <Skeleton className="h-full w-full" />
          </div>
        </div>
      </div>;
  }
  const currentIndex = segmentAdaptations.findIndex(s => s.segmentId === selectedSegmentId);
  const reviewedCount = segmentAdaptations.filter(s => s.isReviewed).length;
  const progressPercent = reviewedCount / segmentAdaptations.length * 100;
  
  return <CulturalIntelligenceErrorBoundary>
      <div className="h-full flex flex-col">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-3 shrink-0">
            <TabsTrigger value="adaptation">Cultural Adaptation</TabsTrigger>
            <TabsTrigger value="draft">
              Culturally-Adapted Draft
              {draftText && <Badge className="ml-2 bg-green-100 text-green-800 border-green-200">Ready</Badge>}
            </TabsTrigger>
            <TabsTrigger value="report">Intelligence Report</TabsTrigger>
          </TabsList>
          
          {/* Save Status Indicator */}
          <div className="px-4 py-2 border-b flex items-center justify-between bg-muted/30">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {isSaving ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-3 w-3 text-green-600" />
                  <span className="text-green-600">All changes saved</span>
                </>
              )}
            </div>
          </div>

          {/* MAIN ADAPTATION TAB */}
          <TabsContent value="adaptation" className="flex-1 flex flex-col overflow-hidden mt-0 data-[state=inactive]:hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
              <div>
                <h3 className="text-lg font-semibold">Cultural Adaptation Workspace</h3>
                <p className="text-sm text-muted-foreground">
                  Review translations and adapt content for cultural relevance
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="text-sm text-muted-foreground">
                    Progress: {reviewedCount} / {segmentAdaptations.length} reviewed
                  </div>
                  <Progress value={progressPercent} className="w-32" />
                  {reviewedCount === segmentAdaptations.length && !draftText && (
                    <Button onClick={handleGenerateDraft} variant="default" size="sm" className="ml-2">
                      <FileText className="h-4 w-4 mr-2" />
                      Generate Final Draft
                    </Button>
                  )}
                </div>
                <div className="flex gap-2 border-l pl-4">
                  <CulturalIntelligenceHandoffButton 
                    projectData={projectData} 
                    segmentAdaptations={segmentAdaptations} 
                    overallCulturalScore={overallCulturalScore} 
                    disabled={reviewedCount < segmentAdaptations.length} 
                  />
                  <Button 
                    onClick={handleComplete} 
                    disabled={reviewedCount < segmentAdaptations.length} 
                    size="default"
                  >
                    Complete Phase 3
                  </Button>
                </div>
              </div>
            </div>

            <ResizablePanelGroup direction="horizontal" className="flex-1">
              {/* LEFT PANEL: Clean Segment List (Source Text Only) */}
              <ResizablePanel defaultSize={30} minSize={25}>
                <div className="h-full flex flex-col">
                  <div className="p-4 border-b bg-muted/30 shrink-0">
                    <h4 className="font-semibold text-sm">Content Segments</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {segmentAdaptations.length} segments to review
                    </p>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {segmentAdaptations.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center p-6">
                        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-sm font-medium mb-2">No Segments Available</p>
                        <p className="text-xs text-muted-foreground">
                          Please complete Phase 2 (Smart TM Translation) first to generate segments for cultural adaptation.
                        </p>
                      </div>
                    ) : (
                      segmentAdaptations.map((segment, index) => <Card key={segment.segmentId} className={`cursor-pointer transition-all hover:shadow-md ${selectedSegmentId === segment.segmentId ? 'ring-2 ring-primary' : ''}`} onClick={() => setSelectedSegmentId(segment.segmentId)}>
                          <CardContent className="pt-4 pb-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-semibold text-muted-foreground">
                                [{index + 1}]
                              </span>
                              <div className="flex items-center gap-2">
                                {getStatusBadge(segment)}
                                {getScoreBadge(segment.culturalScore)}
                              </div>
                            </div>
                            <p className="text-sm line-clamp-3">
                              {segment.sourceText.length > 100 ? segment.sourceText.substring(0, 100) + '...' : segment.sourceText}
                            </p>
                          </CardContent>
                        </Card>)
                    )}
                  </div>
                </div>
              </ResizablePanel>

              <ResizableHandle withHandle />

              {/* RIGHT PANEL: Four-Section Analysis View */}
              <ResizablePanel defaultSize={70} minSize={50}>
                <div className="h-full flex flex-col overflow-y-auto">
                  {selectedSegment ? <div className="p-6 space-y-6">
                      {/* Section 1: Source Text Reference */}
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-muted-foreground">
                          Source Content (English)
                        </label>
                        <div className="bg-muted/50 rounded-lg p-4 max-h-[150px] overflow-y-auto">
                          <p className="text-sm whitespace-pre-wrap">{selectedSegment.sourceText}</p>
                        </div>
                      </div>

                      {/* Section 2: Original Translation */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-3">
                          <label className="text-sm font-semibold">Original Translation</label>
                          <div className="flex items-center gap-2">
                            {selectedSegment.aiAnalysis && (
                              <Button 
                                onClick={() => {
                                  setCurrentAnalysis(selectedSegment.aiAnalysis);
                                  setShowAnalysisModal(true);
                                }} 
                                variant="outline" 
                                size="sm"
                              >
                                <Sparkles className="h-4 w-4 mr-2" />
                                View Last Analysis
                              </Button>
                            )}
                            <Button 
                              onClick={() => performSegmentAnalysis(selectedSegment.segmentId)} 
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
                                  <Brain className="h-4 w-4 mr-2" />
                                  Analyze with AI
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                        <Textarea value={selectedSegment.originalTranslation} readOnly className="min-h-[100px] bg-background" />
                      </div>

                      {/* Section 3: Culturally Adapted Text */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-3">
                          <label className="text-sm font-semibold">Culturally Adapted Text</label>
                          <Button 
                            onClick={handleMarkReviewed} 
                            disabled={selectedSegment.isReviewed} 
                            variant={selectedSegment.isReviewed ? "outline" : "default"}
                            size="sm"
                          >
                            {selectedSegment.isReviewed ? (
                              <>
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                Reviewed
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                Mark as Reviewed
                              </>
                            )}
                          </Button>
                        </div>
                        {renderAdaptedTextWithHighlights()}
                      </div>
                    </div> : <div className="flex items-center justify-center h-full text-muted-foreground">
                      Select a segment to begin cultural adaptation
                    </div>}
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </TabsContent>

          {/* DRAFT TAB */}
          <TabsContent value="draft" className="flex-1 overflow-auto mt-0 p-6 data-[state=inactive]:hidden">
            <div className="space-y-6 max-w-4xl mx-auto">
              <div>
                <h3 className="text-lg font-semibold">Culturally-Adapted Draft Translation</h3>
                <p className="text-sm text-muted-foreground">
                  Consolidated culturally-adapted content ready for final review
                </p>
              </div>

              {!draftText ? (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center space-y-4 py-12">
                      <FileText className="h-16 w-16 mx-auto text-muted-foreground opacity-50" />
                      <div>
                        <p className="text-lg font-medium mb-2">Draft Not Generated Yet</p>
                        <p className="text-sm text-muted-foreground mb-4">
                          Complete all segment reviews to generate the final culturally-adapted draft
                        </p>
                        <div className="flex items-center justify-center gap-2 text-sm">
                          <span className="font-medium">{reviewedCount}</span>
                          <span className="text-muted-foreground">of</span>
                          <span className="font-medium">{segmentAdaptations.length}</span>
                          <span className="text-muted-foreground">segments reviewed</span>
                        </div>
                        <Progress value={progressPercent} className="w-64 mx-auto mt-4" />
                      </div>
                      {reviewedCount === segmentAdaptations.length && (
                        <Button onClick={handleGenerateDraft} size="lg" className="mt-4">
                          <Sparkles className="h-5 w-5 mr-2" />
                          Generate Culturally-Adapted Draft
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {/* Statistics Card */}
                  <div className="grid grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="pt-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-primary">{segmentAdaptations.length}</p>
                          <p className="text-xs text-muted-foreground">Segments</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-600">
                            {segmentAdaptations.reduce((sum, s) => sum + s.changes.filter(c => c.status === 'accepted').length, 0)}
                          </p>
                          <p className="text-xs text-muted-foreground">Changes Applied</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-yellow-600">
                            {segmentAdaptations.reduce((sum, s) => sum + s.changes.filter(c => c.status === 'flagged').length, 0)}
                          </p>
                          <p className="text-xs text-muted-foreground">Flagged for Review</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold">{overallCulturalScore}</p>
                          <p className="text-xs text-muted-foreground">Cultural Score</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Draft Content */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">Final Culturally-Adapted Translation</CardTitle>
                        <div className="flex gap-2">
                          <Button onClick={handleGenerateDraft} variant="outline" size="sm">
                            <Sparkles className="h-4 w-4 mr-2" />
                            Regenerate
                          </Button>
                          <Button onClick={handleCopyDraft} variant="outline" size="sm">
                            <Copy className="h-4 w-4 mr-2" />
                            Copy to Clipboard
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        value={draftText}
                        readOnly
                        className="min-h-[400px] font-mono text-sm"
                        placeholder="Generated draft will appear here..."
                      />
                    </CardContent>
                  </Card>

                  {/* Summary of Changes */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Cultural Adaptation Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {segmentAdaptations.filter(s => s.changes.length > 0).map((segment, index) => (
                          <div key={segment.segmentId} className="border-l-2 border-primary pl-4">
                            <p className="text-sm font-medium mb-2">Segment {segmentAdaptations.indexOf(segment) + 1}</p>
                            <div className="space-y-1">
                              {segment.changes.map(change => (
                                <div 
                                  key={change.id} 
                                  className={`text-xs p-2 rounded ${
                                    change.status === 'accepted' 
                                      ? 'bg-green-50 border border-green-200 text-green-800' 
                                      : change.status === 'flagged' 
                                      ? 'bg-yellow-50 border border-yellow-200 text-yellow-800' 
                                      : 'bg-gray-50 border border-gray-200 text-gray-600'
                                  }`}
                                >
                                  <span className="font-medium">
                                    {change.status === 'accepted' ? '✓ Accepted' : change.status === 'flagged' ? '🚩 Flagged' : '✗ Rejected'}:
                                  </span>
                                  {' '}
                                  <span className="line-through opacity-70">{change.original}</span>
                                  {' → '}
                                  <span className="font-medium">{change.suggested}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </TabsContent>


          {/* REPORT TAB */}
          <TabsContent value="report" className="flex-1 overflow-auto mt-0 p-6 data-[state=inactive]:hidden">
            <div className="space-y-6 max-w-4xl">
              <div>
                <h3 className="text-lg font-semibold">Cultural Intelligence Report</h3>
                <p className="text-sm text-muted-foreground">
                  Comprehensive analysis of cultural adaptations
                </p>
              </div>

              {segmentAdaptations.map((segment, index) => segment.aiAnalysis && <Card key={segment.segmentId}>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center justify-between">
                        <span>Segment {index + 1}</span>
                        {getScoreBadge(segment.culturalScore)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-sm font-medium mb-1">Source:</p>
                        <p className="text-xs text-muted-foreground">{segment.sourceText}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">Adapted Translation:</p>
                        <p className="text-xs">{segment.adaptedText}</p>
                      </div>
                      {segment.changes.length > 0 && <div>
                          <p className="text-sm font-medium mb-2">Changes Applied:</p>
                          <div className="space-y-1">
                            {segment.changes.map(change => <div key={change.id} className={`text-xs p-2 rounded ${change.status === 'accepted' ? 'bg-green-50 border border-green-200' : change.status === 'flagged' ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50 border border-gray-200'}`}>
                                <span className="font-medium">
                                  {change.status === 'accepted' ? '✓' : change.status === 'flagged' ? '🚩' : '✗'}
                                </span>
                                {' '}{change.original} → {change.suggested}
                              </div>)}
                          </div>
                        </div>}
                    </CardContent>
                  </Card>)}
            </div>
          </TabsContent>
        </Tabs>

        {/* Analysis Modal */}
        <CulturalAnalysisModal isOpen={showAnalysisModal} onClose={() => setShowAnalysisModal(false)} segmentName={`Segment ${currentIndex + 1}`} analysisData={currentAnalysis} onApplySuggestion={handleApplySuggestion} onFlagSuggestion={handleFlagSuggestion} onRejectSuggestion={handleRejectSuggestion} onMarkAsReviewed={handleMarkReviewed} onReAnalyze={() => selectedSegment && performSegmentAnalysis(selectedSegment.segmentId)} isAnalyzing={isAnalyzing} isReviewed={selectedSegment?.isReviewed || false} actedRecommendations={selectedSegment?.actedRecommendations || []} />
      </div>
    </CulturalIntelligenceErrorBoundary>;
};