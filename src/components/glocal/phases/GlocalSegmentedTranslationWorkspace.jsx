// Pure GLOCAL Phase 2: Smart TM Intelligence Workspace
// Zero dependencies on localization module

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, 
  Sparkles, 
  CheckCircle, 
  TrendingUp,
  Search,
  CheckCircle2,
  Loader2,
  Lock,
  Unlock,
  Edit3,
  Circle,
  AlertCircle,
  AlertTriangle,
  BarChart3,
  Languages,
  ListOrdered,
  List,
  ArrowRight
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useGlocalAI } from '@/hooks/useGlocalAI';
import { useGlocalTMIntelligence } from '@/hooks/useGlocalTMIntelligence';
import { useGlocalSmartTM } from '@/hooks/useGlocalSmartTM';
import { GlocalTMAnalytics } from './GlocalTMAnalytics';
import { BasePhaseLayout } from '../layout/BasePhaseLayout';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

export const GlocalSegmentedTranslationWorkspace = ({
  onPhaseComplete,
  onDataChange,
  onNext,
  onPrevious,
  projectData,
  phaseData,
  allPhaseData
}) => {
  const { toast } = useToast();
  const { translateWithAI, isProcessing: aiProcessing } = useGlocalAI();
  const { 
    findMatches, 
    saveTM, 
    isLoading: tmLoading 
  } = useGlocalTMIntelligence(
    projectData?.id || '',
    'en',
    projectData?.target_markets?.[0] || 'es',
    projectData?.therapeutic_area
  );
  
  const {
    translateWithSmartTM,
    translateAllSegments,
    loadAnalysisForSegment,
    approveFuzzyMatches,
    addToTM,
    useTMLeverage,
    setUseTMLeverage,
    isProcessing: smartTMProcessing
  } = useGlocalSmartTM(
    projectData?.id || '',
    'en',
    projectData?.target_markets?.[0] || 'es',
    projectData?.therapeutic_area
  );
  
  const [segments, setSegments] = useState([]);
  const [activeSegmentId, setActiveSegmentId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEditingTranslation, setIsEditingTranslation] = useState(null);
  const [tmDrawerOpen, setTmDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('translation');
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisCache, setAnalysisCache] = useState(new Map());
  const hasInitializedSegments = useRef(false);
  const [draftTranslation, setDraftTranslation] = useState('');
  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);
  const [draftMetadata, setDraftMetadata] = useState(null);
  const [isBulkTranslating, setIsBulkTranslating] = useState(false);
  const [bulkProgress, setBulkProgress] = useState({ completed: 0, total: 0 });

  // Load segments - prioritize saved Phase 2 data over parsing fresh from Phase 1
  useEffect(() => {
    // Only initialize segments once on mount
    if (hasInitializedSegments.current) return;
    
    // First, check if we have saved translation data from Phase 2
    if (allPhaseData?.phase2?.segments && Array.isArray(allPhaseData.phase2.segments) && allPhaseData.phase2.segments.length > 0) {
      // Recover saved translations
      console.log('Recovering saved translations:', allPhaseData.phase2.segments.length, 'segments');
      setSegments(allPhaseData.phase2.segments);
      if (allPhaseData.phase2.segments.length > 0) {
        // Set active segment to first incomplete, or first segment
        const firstIncomplete = allPhaseData.phase2.segments.find(s => s.translationStatus !== 'completed');
        setActiveSegmentId(firstIncomplete?.id || allPhaseData.phase2.segments[0].id);
      }
      hasInitializedSegments.current = true;
      toast({
        title: 'Translation Progress Recovered',
        description: `Loaded ${allPhaseData.phase2.segments.length} segments with your previous translations`
      });
    } else if (allPhaseData?.phase1?.sourceContent) {
      // No saved data, parse fresh from Phase 1 source content
      console.log('No saved translations found, parsing fresh from Phase 1');
      const sourceContent = allPhaseData.phase1.sourceContent;
      const parsedSegments = parseContentIntoSegments(sourceContent);
      setSegments(parsedSegments);
      if (parsedSegments.length > 0) {
        setActiveSegmentId(parsedSegments[0].id);
      }
      hasInitializedSegments.current = true;
    }

    // Recover draft translation if available
    if (allPhaseData?.phase2?.draftTranslation) {
      setDraftTranslation(allPhaseData.phase2.draftTranslation);
      setDraftMetadata(allPhaseData.phase2.draftMetadata || null);
      console.log('✅ Draft translation recovered');
      toast({
        title: 'Draft Recovered',
        description: 'Your previous draft translation has been restored'
      });
    }
  }, []); // Empty dependency array - only run on mount

  // Sync segments from parent updates WITHOUT resetting activeSegmentId
  useEffect(() => {
    if (hasInitializedSegments.current && allPhaseData?.phase2?.segments) {
      setSegments(allPhaseData.phase2.segments);
      // Don't touch activeSegmentId here!
    }
  }, [allPhaseData?.phase2?.segments]);

  // Update active segment reference when segments change
  useEffect(() => {
    if (activeSegmentId && segments.length > 0) {
      const updated = segments.find(s => s.id === activeSegmentId);
      if (updated) {
        console.log('Active segment updated:', { 
          id: updated.id, 
          hasTranslation: !!updated.translatedText,
          translationLength: updated.translatedText?.length 
        });
      }
    }
  }, [segments, activeSegmentId]);

  const activeSegment = useMemo(
    () => segments.find(s => s.id === activeSegmentId),
    [segments, activeSegmentId]
  );

  const totalWords = useMemo(
    () => segments.reduce((sum, s) => sum + s.wordCount, 0),
    [segments]
  );

  const translatedWords = useMemo(
    () => segments
      .filter(s => s.translationStatus === 'completed')
      .reduce((sum, s) => sum + s.wordCount, 0),
    [segments]
  );

  const progress = totalWords > 0 ? (translatedWords / totalWords) * 100 : 0;

  // Calculate TM analytics
  const tmAnalytics = useMemo(() => {
    const exactMatches = segments.filter(s => s.tmMatchScore && s.tmMatchScore >= 95).length;
    const fuzzyMatches = segments.filter(s => s.tmMatchScore && s.tmMatchScore >= 75 && s.tmMatchScore < 95).length;
    const noMatches = segments.filter(s => !s.tmMatchScore || s.tmMatchScore < 75).length;
    const avgMatchScore = segments.reduce((sum, s) => sum + (s.tmMatchScore || 0), 0) / (segments.length || 1);
    
    // Calculate cost savings
    const totalCostSavings = segments.reduce((sum, s) => {
      if (!s.tmMatchScore) return sum;
      const matchRate = s.tmMatchScore / 100;
      const savings = s.wordCount * 0.15 * matchRate;
      return sum + savings;
    }, 0);
    
    return {
      totalSegments: segments.length,
      exactMatches,
      fuzzyMatches,
      noMatches,
      avgMatchScore,
      totalCostSavings,
      leverageRate: segments.length > 0 
        ? ((exactMatches + fuzzyMatches * 0.7) / segments.length) * 100 
        : 0,
      culturalAdaptations: segments.filter(s => s.culturalScore && s.culturalScore >= 0.8).length,
      therapeuticAreaMatches: segments.filter(s => s.tmMatchScore && s.tmMatchScore >= 85).length
    };
  }, [segments]);

  // Track last saved data to prevent unnecessary saves
  const lastSavedDataRef = useRef('');

  // Auto-save segments whenever they change (with debounce)
  useEffect(() => {
    if (segments.length > 0 && onDataChange) {
      const debounceTimer = setTimeout(() => {
        // Serialize current data for comparison
        const currentData = JSON.stringify({ segments, tmAnalytics, draftTranslation, draftMetadata });
        
        // Only save if data has actually changed
        if (currentData !== lastSavedDataRef.current) {
          lastSavedDataRef.current = currentData;
          onDataChange({ 
            segments, 
            tmAnalytics,
            draftTranslation,
            draftMetadata,
            lastUpdated: new Date().toISOString()
          });
        }
      }, 2000); // Increased from 500ms to 2s to reduce frequency
      
      return () => clearTimeout(debounceTimer);
    }
  }, [segments, tmAnalytics, draftTranslation, draftMetadata, onDataChange]);

  const handleTMSearch = async (segmentId) => {
    const segment = segments.find(s => s.id === segmentId);
    if (!segment) return;

    setIsProcessing(true);
    try {
      const matches = await findMatches(segment.content, segment.type);
      
      if (matches.length > 0) {
        const bestMatch = matches[0];
        setSegments(prev => prev.map(s => 
          s.id === segmentId 
            ? { ...s, tmMatchScore: bestMatch.matchScore, tmSuggestion: bestMatch.targetText }
            : s
        ));
        toast({ title: 'TM Search Complete', description: `Found ${matches.length} matches` });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAITranslate = async (segmentId) => {
    const segment = segments.find(s => s.id === segmentId);
    if (!segment) return;

    setIsProcessing(true);
    try {
      console.log('Starting AI translation for segment:', segmentId);
      
      // Use TM-powered translation with complete analysis
      const result = await translateWithSmartTM(
        segment.content,
        segment.id,
        segment.type
      );

      console.log('Translation result:', result);

      // Update segment with complete translation data
      setSegments(prev => prev.map(s => 
        s.id === segmentId 
          ? { 
              ...s, 
              translatedText: result.translatedText,
              fullAnalysis: result.fullAnalysis,
              wordLevelBreakdown: result.wordLevelBreakdown,
              aiScores: result.aiScores,
              aiConfidence: 0.85,
              translationStatus: 'completed',
              needsReview: result.reviewFlags && result.reviewFlags.length > 0,
              reviewFlags: result.reviewFlags,
              tmLeverageData: {
                exactMatchWords: result.tmStats.exactWords,
                fuzzyMatchWords: result.tmStats.fuzzyWords,
                newWords: result.tmStats.newWords,
                leveragePercentage: result.tmStats.leveragePercentage
              }
            }
          : s
      ));
      
      toast({ 
        title: 'Translation Complete',
        description: result.tmStats.leveragePercentage > 0 
          ? `${Math.round(result.tmStats.leveragePercentage)}% TM leverage achieved`
          : 'View TM Analysis for quality insights'
      });
    } catch (error) {
      console.error('Translation failed:', error);
      toast({
        title: 'Translation Failed',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLoadAnalysis = async (segmentId) => {
    // Check cache first
    if (analysisCache.has(segmentId)) {
      console.log('Using cached analysis for', segmentId);
      return;
    }

    const segment = segments.find(s => s.id === segmentId);
    if (!segment?.translatedText) return;

    setAnalysisLoading(true);
    try {
      const analysis = await loadAnalysisForSegment(
        segment.content,
        segment.translatedText,
        segmentId
      );

      if (analysis) {
        // Update segment with analysis
        setSegments(prev => prev.map(s => 
          s.id === segmentId 
            ? { 
                ...s, 
                fullAnalysis: JSON.stringify(analysis),
                wordLevelBreakdown: analysis.wordBreakdown || [],
                aiScores: {
                  medical: analysis.accuracyScore || 0,
                  brand: analysis.qualityScore || 0,
                  cultural: analysis.culturalScore || 0
                },
                tmLeverageData: analysis.tmLeverage ? {
                  exactMatchWords: analysis.tmLeverage.exactMatches || 0,
                  fuzzyMatchWords: analysis.tmLeverage.fuzzyMatches || 0,
                  newWords: analysis.tmLeverage.newWords || 0,
                  leveragePercentage: analysis.tmLeverage.leveragePercentage || 0
                } : s.tmLeverageData,
                reviewFlags: analysis.accuracyIssues || []
              }
            : s
        ));

        // Cache the analysis
        setAnalysisCache(prev => new Map(prev).set(segmentId, analysis));
      }
    } catch (err) {
      console.error('Failed to load analysis:', err);
    } finally {
      setAnalysisLoading(false);
    }
  };

  const handleUseTM = (segmentId) => {
    const segment = segments.find(s => s.id === segmentId);
    if (!segment?.tmSuggestion) return;

    setSegments(prev => prev.map(s => 
      s.id === segmentId 
        ? { ...s, translatedText: s.tmSuggestion, translationStatus: 'completed' }
        : s
    ));
  };

  const handleManualEdit = (segmentId, text) => {
    setSegments(prev => prev.map(s => 
      s.id === segmentId ? { ...s, translatedText: text } : s
    ));
  };

  const handleMarkComplete = async (segmentId) => {
    const segment = segments.find(s => s.id === segmentId);
    if (!segment || !segment.translatedText) {
      toast({
        title: 'Cannot Complete',
        description: 'Please add a translation first',
        variant: 'destructive'
      });
      return;
    }

    try {
      // Always update TM to mark as approved and increment usage
      await addToTM(segmentId);
      
      const wordInfo = segment.tmLeverageData 
        ? `${segment.tmLeverageData.newWords} new words` 
        : 'Translation';
      
      toast({
        title: 'Segment Completed',
        description: `${wordInfo} saved to TM`
      });

      setSegments(prev => prev.map(s => 
        s.id === segmentId 
          ? { ...s, translationStatus: 'completed', needsReview: false }
          : s
      ));

    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save to TM',
        variant: 'destructive'
      });
    }
  };

  const handleApproveReview = async (segmentId) => {
    await approveFuzzyMatches(segmentId);
    setSegments(prev => prev.map(s => 
      s.id === segmentId 
        ? { ...s, needsReview: false, reviewFlags: [] }
        : s
    ));
  };

  const handleRejectReview = (segmentId) => {
    setIsEditingTranslation(segmentId);
    toast({
      title: 'Edit Mode Enabled',
      description: 'Please review and correct the translation'
    });
  };

  const handleSaveEdit = (segmentId) => {
    setIsEditingTranslation(null);
    toast({ 
      title: 'Translation Updated', 
      description: 'Changes saved successfully' 
    });
  };

  const getSegmentIcon = (type) => {
    const icons = { subject: '📧', greeting: '👋', body: '📄', cta: '🎯', regulatory: '⚖️', closing: '✍️' };
    return icons[type] || '📝';
  };

  const getStatusColor = (status) => {
    const colors = {
      'completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
      'in_progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
      'pending': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
    };
    return colors[status] || '';
  };

  const allSegmentsComplete = segments.every(s => s.translationStatus === 'completed');
  const isPhaseCompleted = allPhaseData?.phase2?.completed === true;

  const generateDraftTranslation = () => {
    setIsGeneratingDraft(true);
    
    // Verify all segments are completed
    const allComplete = segments.every(seg => seg.translationStatus === 'completed' && seg.translatedText);
    
    if (!allComplete) {
      toast({
        title: 'Translation Incomplete',
        description: 'Please complete all segments before generating draft',
        variant: 'destructive'
      });
      setIsGeneratingDraft(false);
      return;
    }

    // Assemble segments in structured format
    const draftContent = segments.map(seg => {
      const header = seg.title.toUpperCase();
      const divider = '='.repeat(60);
      return `${divider}\n${header}\n${divider}\n\n${seg.translatedText}\n\n`;
    }).join('\n');

    // Calculate metadata
    const totalWords = segments.reduce((sum, seg) => sum + seg.wordCount, 0);
    const avgTMLeverage = segments.reduce((sum, seg) => 
      sum + (seg.tmLeverageData?.leveragePercentage || 0), 0) / segments.length;

    const metadata = {
      totalWords,
      segmentCount: segments.length,
      averageTMLeverage: Math.round(avgTMLeverage),
      generatedAt: new Date().toISOString()
    };

    setDraftTranslation(draftContent);
    setDraftMetadata(metadata);
    setIsGeneratingDraft(false);
    setActiveTab('draft');
    
    toast({
      title: 'Draft Generated',
      description: 'Ready for Cultural Intelligence review'
    });
  };

  const handleCompletePhase = () => {
    if (!allSegmentsComplete) {
      toast({
        title: 'Cannot Complete Phase',
        description: 'Please complete all segment translations first',
        variant: 'destructive'
      });
      return;
    }

    onPhaseComplete({ 
      segments, 
      tmAnalytics, 
      draftTranslation, 
      draftMetadata,
      completed: true,
      analyzedAt: new Date().toISOString()
    });
    toast({
      title: 'Phase Completed',
      description: 'Translation phase marked as complete'
    });
  };

  const handleReopenPhase = () => {
    onPhaseComplete({ segments, tmAnalytics, completed: false });
    toast({
      title: 'Phase Reopened',
      description: 'You can now edit translations again'
    });
  };

  const handleBulkTranslate = async () => {
    const pendingSegments = segments.filter(
      seg => seg.translationStatus !== 'completed'
    );
    
    if (pendingSegments.length === 0) {
      toast({
        title: 'No Pending Segments',
        description: 'All segments are already translated',
      });
      return;
    }
    
    setIsBulkTranslating(true);
    setBulkProgress({ completed: 0, total: pendingSegments.length });
    
    try {
      const results = await translateAllSegments(
        pendingSegments.map(seg => ({
          id: seg.id,
          content: seg.content,
          type: seg.type
        })),
        (completed, total) => {
          setBulkProgress({ completed, total });
        }
      );
      
      // Update all segments with results
      setSegments(prev => prev.map(seg => {
        const result = results.get(seg.id);
        if (!result) return seg;
        
        return {
          ...seg,
          translatedText: result.translatedText,
          fullAnalysis: result.fullAnalysis,
          wordLevelBreakdown: result.wordLevelBreakdown,
          aiScores: result.aiScores,
          translationStatus: 'completed',
          needsReview: result.reviewFlags.length > 0,
          reviewFlags: result.reviewFlags,
          tmLeverageData: {
            exactMatchWords: result.tmStats.exactWords,
            fuzzyMatchWords: result.tmStats.fuzzyWords,
            newWords: result.tmStats.newWords,
            leveragePercentage: result.tmStats.leveragePercentage
          }
        };
      }));
      
      toast({
        title: 'Bulk Translation Complete',
        description: `Successfully translated ${results.size} segments`,
      });
    } catch (error) {
      toast({
        title: 'Bulk Translation Error',
        description: 'Some segments may not have been translated',
        variant: 'destructive'
      });
    } finally {
      setIsBulkTranslating(false);
      setBulkProgress({ completed: 0, total: 0 });
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Bulk Translation Progress Dialog */}
      <Dialog open={isBulkTranslating}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Bulk Translation in Progress</DialogTitle>
            <DialogDescription>
              Translating all pending segments with Smart TM...
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Progress value={(bulkProgress.completed / bulkProgress.total) * 100} />
            <p className="text-sm text-muted-foreground text-center">
              {bulkProgress.completed} of {bulkProgress.total} segments completed
            </p>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                This may take several minutes. Please don't close the window.
              </AlertDescription>
            </Alert>
          </div>
        </DialogContent>
      </Dialog>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-3 shrink-0">
            <TabsTrigger value="translation">
              <FileText className="h-4 w-4 mr-2" />
              Translation Workspace
            </TabsTrigger>
            <TabsTrigger value="draft" disabled={!draftTranslation}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Draft Translation
              {draftTranslation && <Badge className="ml-2 bg-green-100 text-green-800 border-green-200">Ready</Badge>}
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <TrendingUp className="h-4 w-4 mr-2" />
              TM Leverage Overview
            </TabsTrigger>
          </TabsList>

        <TabsContent value="translation" className="flex-1 flex flex-col overflow-hidden mt-0 data-[state=inactive]:hidden">
          {/* Phase Header - Below Tabs */}
          <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
            <div>
              <h3 className="text-lg font-semibold">Smart TM Translation Hub</h3>
              <p className="text-sm text-muted-foreground">
                AI-powered translation with Translation Memory leverage
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm text-muted-foreground">
                Progress: {translatedWords} / {totalWords} words
              </div>
              <Progress value={progress} className="w-32" />
              <Button 
                onClick={handleBulkTranslate} 
                disabled={isProcessing || allSegmentsComplete || isBulkTranslating}
                variant="secondary"
                size="sm"
              >
                {isBulkTranslating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {bulkProgress.completed}/{bulkProgress.total}
                  </>
                ) : (
                  <>
                    <Languages className="h-4 w-4 mr-2" />
                    Translate All
                  </>
                )}
              </Button>
              {isPhaseCompleted ? (
                <Button onClick={handleReopenPhase} variant="outline" size="sm">
                  <Unlock className="h-4 w-4 mr-2" />
                  Reopen Phase
                </Button>
              ) : (
                <Button onClick={handleCompletePhase} disabled={!allSegmentsComplete} size="sm">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Complete Phase
                </Button>
              )}
            </div>
          </div>

          {/* Draft Generation Banner - appears when all segments complete */}
          {allSegmentsComplete && !draftTranslation && (
            <Alert className="m-4 border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
              <AlertTitle className="text-emerald-900 dark:text-emerald-100">
                All Segments Completed! 🎉
              </AlertTitle>
              <AlertDescription className="flex items-center justify-between gap-4">
                <span className="text-emerald-800 dark:text-emerald-200">
                  Ready to generate the complete draft translation for Cultural Intelligence review
                </span>
                <Button 
                  onClick={generateDraftTranslation} 
                  disabled={isGeneratingDraft}
                  className="bg-emerald-600 hover:bg-emerald-700 shrink-0"
                >
                  {isGeneratingDraft ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Draft Translation
                    </>
                  )}
                </Button>
              </AlertDescription>
            </Alert>
          )}
          <ResizablePanelGroup direction="horizontal" className="flex-1">
            {/* Segments List Panel */}
            <ResizablePanel defaultSize={22} minSize={18} maxSize={45}>
              <div className="h-full flex flex-col bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 border-r border-slate-200 dark:border-slate-800">
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <ListOrdered className="h-4 w-4" />
                    Segments
                  </h3>
                  <Progress value={progress} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-2">{translatedWords} / {totalWords} words</p>
                </div>
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-2">
                    {segments.map((seg, index) => (
                      <button
                        key={seg.id}
                        onClick={() => setActiveSegmentId(seg.id)}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                          activeSegmentId === seg.id 
                            ? "bg-primary text-primary-foreground" 
                            : "hover:bg-accent"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <span className="font-medium text-sm">Segment {index + 1}</span>
                          <Badge 
                            variant={
                              seg.translationStatus === 'completed' ? 'default' :
                              seg.translationStatus === 'in_progress' ? 'secondary' : 'outline'
                            } 
                            className="text-xs shrink-0"
                          >
                            {seg.translationStatus === 'completed' ? 'Complete' :
                             seg.translationStatus === 'in_progress' ? 'In Progress' : 'Pending'}
                          </Badge>
                        </div>
                        <p className={`text-xs line-clamp-2 mb-2 ${
                          activeSegmentId === seg.id ? "opacity-90" : "text-muted-foreground"
                        }`}>
                          {seg.content.substring(0, 100)}...
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {seg.wordCount} words
                          </Badge>
                          {seg.tmLeverageData && seg.tmLeverageData.leveragePercentage > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              {seg.tmLeverageData.leveragePercentage}% TM
                            </Badge>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </ResizablePanel>

            <ResizableHandle className="w-1 bg-border hover:bg-primary/20 transition-colors" />

            {/* Translation Editor Panel */}
            <ResizablePanel defaultSize={78} minSize={55}>
              <div className="h-full flex flex-col overflow-hidden">
                {activeSegment ? (
                  <>
                     <div className="p-6 border-b">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold">{activeSegment.title}</h3>
                        <div className="flex items-center gap-3">
                          {activeSegment.tmLeverageData && (
                            <Badge variant="secondary" className="text-xs">
                              TM: {activeSegment.tmLeverageData.leveragePercentage.toFixed(0)}%
                            </Badge>
                          )}
                          <Badge variant="outline">{activeSegment.type}</Badge>
                        </div>
                      </div>
                      
                      {/* TM Leverage Toggle */}
                      {activeSegment.translationStatus !== 'completed' && (
                        <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label htmlFor="tm-leverage" className="text-sm font-medium">
                                TM Leverage
                              </Label>
                              <p className="text-xs text-muted-foreground">
                                {useTMLeverage 
                                  ? 'AI will use Translation Memory for consistency and cost savings'
                                  : 'Pure AI translation without TM matching'}
                              </p>
                            </div>
                            <Switch 
                              id="tm-leverage"
                              checked={useTMLeverage} 
                              onCheckedChange={setUseTMLeverage}
                            />
                          </div>
                        </div>
                      )}
                      
                      <div className="flex gap-2">
                        {/* Completed segment - Edit mode */}
                        {activeSegment.translationStatus === 'completed' && isEditingTranslation !== activeSegment.id && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setIsEditingTranslation(activeSegment.id)}
                          >
                            <Edit3 className="h-4 w-4 mr-2" />
                            Edit Translation
                          </Button>
                        )}

                        {/* Completed segment - Save changes */}
                        {isEditingTranslation === activeSegment.id && (
                          <Button 
                            size="sm" 
                            onClick={() => handleSaveEdit(activeSegment.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Save Changes
                          </Button>
                        )}

                        {/* Pending/In-progress segment */}
                        {activeSegment.translationStatus !== 'completed' && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleAITranslate(activeSegment.id)} 
                              disabled={isProcessing}
                            >
                              {aiProcessing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
                              AI Translate
                            </Button>
                            <Button 
                              size="sm" 
                              onClick={() => handleMarkComplete(activeSegment.id)} 
                              disabled={!activeSegment.translatedText}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Complete
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                    <ScrollArea className="flex-1 p-6 overflow-y-auto">
                      {/* Vertical Layout: Source on top, Translation below */}
                      <div className="space-y-6 max-w-5xl mx-auto">
                        {/* Source Text Section */}
                        <Card className="bg-gradient-to-br from-blue-50/50 to-slate-50/50 dark:from-blue-950/20 dark:to-slate-950/20 border-blue-200/30 dark:border-blue-800/30 shadow-sm hover:shadow-md transition-shadow">
                          <CardContent className="pt-4">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-xs font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                Source Text
                              </span>
                              <Badge variant="outline" className="text-xs">EN</Badge>
                            </div>
                            <p className="text-sm line-clamp-3 text-muted-foreground leading-relaxed">{activeSegment.content}</p>
                          </CardContent>
                        </Card>

                        {/* Translation Section */}
                        <div className="bg-gradient-to-br from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-xl p-6 border border-emerald-200/30 dark:border-emerald-800/30 shadow-sm">
                          <div className="flex items-center justify-between mb-4">
                            <label className="text-sm font-semibold text-emerald-900 dark:text-emerald-100 flex items-center gap-2">
                              <Languages className="h-4 w-4" />
                              Translated Text
                            </label>
                            <div className="flex items-center gap-2">
                              {activeSegment.translationStatus === 'completed' && isEditingTranslation !== activeSegment.id && (
                                <Badge variant="secondary" className="text-xs">
                                  <Lock className="h-3 w-3 mr-1" />
                                  Locked
                                </Badge>
                              )}
                              {isEditingTranslation === activeSegment.id && (
                                <Badge variant="outline" className="text-xs">
                                  <Unlock className="h-3 w-3 mr-1" />
                                  Editing
                                </Badge>
                              )}
                              {/* TM Breakdown Button - Always show if translation exists */}
                              {(activeSegment.wordLevelBreakdown?.length > 0 || activeSegment.translatedText) && (
                                <Sheet 
                                  open={tmDrawerOpen} 
                                  onOpenChange={(open) => {
                                    console.log('🔍 TM Drawer Toggle:', { 
                                      open, 
                                      hasBreakdown: activeSegment.wordLevelBreakdown?.length > 0,
                                      hasTranslation: !!activeSegment.translatedText,
                                      segmentId: activeSegment.id 
                                    });
                                    setTmDrawerOpen(open);
                                    if (open && activeSegment.translatedText && !analysisCache.has(activeSegment.id)) {
                                      handleLoadAnalysis(activeSegment.id);
                                    }
                                  }}
                                >
                                  <SheetTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <BarChart3 className="h-4 w-4 mr-2" />
                                      View TM Analysis
                                    </Button>
                                  </SheetTrigger>
                                  <SheetContent side="left" className="w-[32%] overflow-y-auto bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 border-r-2 border-primary/20">
                                    <SheetHeader className="border-b border-slate-200 dark:border-slate-800 pb-4">
                                      <SheetTitle className="flex items-center gap-2 text-lg">
                                        <BarChart3 className="h-5 w-5 text-primary" />
                                        Translation Memory Analysis
                                      </SheetTitle>
                                      <SheetDescription>
                                        {analysisLoading 
                                          ? 'Loading detailed TM analysis...' 
                                          : 'Word-level TM leverage breakdown for this segment'
                                        }
                                      </SheetDescription>
                                    </SheetHeader>
                                    
                                    <div className="space-y-6 mt-6">
                                      {/* Loading State */}
                                      {analysisLoading && (
                                        <div className="flex flex-col items-center justify-center py-12 gap-4">
                                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                          <p className="text-sm text-muted-foreground">Analyzing translation quality and TM leverage...</p>
                                        </div>
                                      )}

                                      {/* 1. SUMMARY STATS - MOVED TO TOP */}
                                      {!analysisLoading && activeSegment.tmLeverageData && (
                                        <Card className="border-primary/30 bg-gradient-to-br from-primary/5 via-primary/10 to-blue-500/5 shadow-lg">
                                          <CardContent className="p-6">
                                            <div className="flex items-center gap-3 mb-5">
                                              <div className="p-2 rounded-lg bg-primary/10">
                                                <BarChart3 className="h-6 w-6 text-primary" />
                                              </div>
                                              <div>
                                                <p className="text-lg font-bold">Translation Summary</p>
                                                <p className="text-xs text-muted-foreground">
                                                  Segment {parseInt(activeSegment.id.replace('seg-', '')) + 1} • 
                                                  {activeSegment.wordCount} source words • 
                                                  {activeSegment.translatedText?.split(/\s+/).filter(w => w.length > 0).length || 0} translated words
                                                </p>
                                              </div>
                                            </div>
                                            
                                            {/* Large Metrics Grid */}
                                            <div className="grid grid-cols-2 gap-4">
                                              <div className="bg-white/50 dark:bg-slate-900/50 rounded-lg p-4 text-center border border-primary/20">
                                                <p className="text-3xl font-bold text-primary">{activeSegment.tmLeverageData.leveragePercentage.toFixed(0)}%</p>
                                                <p className="text-xs text-muted-foreground mt-1">TM Leverage</p>
                                              </div>
                                              {activeSegment.aiConfidence && (
                                                <div className="bg-white/50 dark:bg-slate-900/50 rounded-lg p-4 text-center border border-emerald-500/20">
                                                  <p className="text-3xl font-bold text-emerald-600">{Math.round(activeSegment.aiConfidence * 100)}%</p>
                                                  <p className="text-xs text-muted-foreground mt-1">AI Confidence</p>
                                                </div>
                                              )}
                                              <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-3 border border-green-200/50 dark:border-green-800/50">
                                                <p className="text-sm text-muted-foreground">Exact Matches</p>
                                                <p className="text-xl font-bold text-green-600">{activeSegment.tmLeverageData.exactMatchWords} words</p>
                                              </div>
                                              <div className="bg-amber-50 dark:bg-amber-950/30 rounded-lg p-3 border border-amber-200/50 dark:border-amber-800/50">
                                                <p className="text-sm text-muted-foreground">Fuzzy Matches</p>
                                                <p className="text-xl font-bold text-amber-600">{activeSegment.tmLeverageData.fuzzyMatchWords} words</p>
                                              </div>
                                              <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-3 border border-blue-200/50 dark:border-blue-800/50 col-span-2">
                                                <p className="text-sm text-muted-foreground">New Words (AI Generated)</p>
                                                <p className="text-xl font-bold text-blue-600">{activeSegment.tmLeverageData.newWords} words</p>
                                              </div>
                                            </div>
                                          </CardContent>
                                        </Card>
                                      )}

                                      {/* 2. AI QUALITY SCORES (if available) */}
                                      {!analysisLoading && activeSegment.aiScores && (
                                        <Card className="border-blue-500/30 bg-blue-500/5">
                                          <CardHeader className="pb-3">
                                            <CardTitle className="text-base flex items-center gap-2">
                                              <Sparkles className="h-5 w-5 text-blue-500" />
                                              AI Quality Assessment
                                            </CardTitle>
                                            <p className="text-xs text-muted-foreground mt-2">
                                              Quick summary scores - expand Full AI Analysis below for detailed breakdown
                                            </p>
                                          </CardHeader>
                                          <CardContent className="space-y-3">
                                            {activeSegment.aiScores.medical > 0 && (
                                              <div>
                                                <div className="flex justify-between text-xs mb-1">
                                                  <span>Medical Accuracy</span>
                                                  <span className="font-semibold">{Math.round(activeSegment.aiScores.medical * 100)}%</span>
                                                </div>
                                                <Progress value={activeSegment.aiScores.medical * 100} className="h-2" />
                                              </div>
                                            )}
                                            {activeSegment.aiScores.brand > 0 && (
                                              <div>
                                                <div className="flex justify-between text-xs mb-1">
                                                  <span>Brand Consistency</span>
                                                  <span className="font-semibold">{Math.round(activeSegment.aiScores.brand * 100)}%</span>
                                                </div>
                                                <Progress value={activeSegment.aiScores.brand * 100} className="h-2" />
                                              </div>
                                            )}
                                            {activeSegment.aiScores.cultural > 0 && (
                                              <div>
                                                <div className="flex justify-between text-xs mb-1">
                                                  <span>Cultural Adaptation</span>
                                                  <span className="font-semibold">{Math.round(activeSegment.aiScores.cultural * 100)}%</span>
                                                </div>
                                                <Progress value={activeSegment.aiScores.cultural * 100} className="h-2" />
                                              </div>
                                            )}
                                          </CardContent>
                                        </Card>
                                      )}

                                      {/* Visual Separator */}
                                      {!analysisLoading && activeSegment.fullAnalysis && (
                                        <>
                                          <Separator className="my-4" />
                                          <p className="text-xs text-center text-muted-foreground mb-2">
                                            Expand below for comprehensive analysis with detailed explanations
                                          </p>
                                        </>
                                      )}

                                      {/* 3. TM MATCH SUGGESTION */}
                                      {!analysisLoading && activeSegment.tmSuggestion && (
                                        <Card className="border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5 shadow-md animate-fade-in">
                                          <CardContent className="p-4">
                                            <div className="flex justify-between items-center mb-3">
                                              <div className="flex items-center gap-2">
                                                <Badge variant="secondary" className="text-xs font-semibold">
                                                  {activeSegment.tmMatchScore}% Match
                                                </Badge>
                                                <span className="text-xs text-muted-foreground">Translation Memory</span>
                                              </div>
                                              <Button 
                                                size="sm" 
                                                className="shadow-sm hover:shadow-md transition-shadow"
                                                onClick={() => {
                                                  handleUseTM(activeSegment.id);
                                                  setTmDrawerOpen(false);
                                                }}
                                              >
                                                <CheckCircle className="h-4 w-4 mr-2" />
                                                Use This Translation
                                              </Button>
                                            </div>
                                            <p className="text-sm text-muted-foreground leading-relaxed p-3 bg-white/50 dark:bg-slate-900/50 rounded-lg">{activeSegment.tmSuggestion}</p>
                                          </CardContent>
                                        </Card>
                                      )}

                                      {/* 4. FUZZY MATCH REVIEW ALERT */}
                                      {!analysisLoading && activeSegment.needsReview && activeSegment.reviewFlags && activeSegment.reviewFlags.length > 0 && (
                                        <Alert variant="default" className="border-blue-500/50 bg-blue-500/5">
                                          <AlertCircle className="h-4 w-4 text-blue-500" />
                                          <AlertTitle className="text-blue-700 dark:text-blue-400">
                                            Fuzzy Matches Require Review
                                          </AlertTitle>
                                          <AlertDescription className="text-blue-600 dark:text-blue-300">
                                            {activeSegment.tmLeverageData?.fuzzyMatchWords || 0} words have fuzzy TM matches. 
                                            Please review for accuracy.
                                          </AlertDescription>
                                          <div className="mt-3 flex gap-2">
                                            <Button 
                                              size="sm" 
                                              onClick={() => {
                                                handleApproveReview(activeSegment.id);
                                                setTmDrawerOpen(false);
                                              }}
                                            >
                                              <CheckCircle className="h-4 w-4 mr-2" />
                                              Approve Translation
                                            </Button>
                                            <Button 
                                              size="sm" 
                                              variant="outline" 
                                              onClick={() => handleRejectReview(activeSegment.id)}
                                            >
                                              <Edit3 className="h-4 w-4 mr-2" />
                                              Edit & Resubmit
                                            </Button>
                                          </div>
                                        </Alert>
                                      )}

                                      {/* 5. LEGEND */}
                                      {!analysisLoading && activeSegment.wordLevelBreakdown && activeSegment.wordLevelBreakdown.length > 0 && (
                                        <>
                                          <Separator />
                                          <div className="flex gap-6 text-sm">
                                            <div className="flex items-center gap-2">
                                              <div className="h-3 w-3 rounded-full bg-green-500" />
                                              <span>Exact Match</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                              <div className="h-3 w-3 rounded-full bg-amber-500" />
                                              <span>Fuzzy Match</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                              <div className="h-3 w-3 rounded-full bg-blue-500" />
                                              <span>AI Generated</span>
                                            </div>
                                          </div>

                                          {/* 6. WORD-BY-WORD BREAKDOWN - Grouped by Type */}
                                          <div>
                                            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                              <FileText className="h-4 w-4" />
                                              Word-Level Breakdown ({activeSegment.wordLevelBreakdown.length} words)
                                            </h3>
                                            
                                            {/* Group exact matches together */}
                                            {activeSegment.wordLevelBreakdown.filter(w => w.type === 'exact').length > 0 && (
                                              <Accordion type="single" collapsible className="mb-3">
                                                <AccordionItem value="exact">
                                                  <AccordionTrigger className="text-sm hover:no-underline">
                                                    <div className="flex items-center gap-2">
                                                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                      <span>Exact Matches ({activeSegment.wordLevelBreakdown.filter(w => w.type === 'exact').length})</span>
                                                    </div>
                                                  </AccordionTrigger>
                                                  <AccordionContent>
                                                    <div className="space-y-2 pt-2">
                                                      {activeSegment.wordLevelBreakdown
                                                        .filter(w => w.type === 'exact')
                                                        .map((wordData, idx) => (
                                                          <div key={idx} className="border-l-4 border-green-500 bg-green-50 dark:bg-green-950/20 p-3 rounded-r-lg">
                                                            <p className="font-semibold text-sm">{wordData.word}</p>
                                                            {wordData.tmSourceText && (
                                                              <p className="text-xs text-muted-foreground mt-1">
                                                                TM: {wordData.tmSourceText}
                                                              </p>
                                                            )}
                                                          </div>
                                                        ))}
                                                    </div>
                                                  </AccordionContent>
                                                </AccordionItem>
                                              </Accordion>
                                            )}

                                            {/* Group fuzzy matches together */}
                                            {activeSegment.wordLevelBreakdown.filter(w => w.type === 'fuzzy').length > 0 && (
                                              <Accordion type="single" collapsible className="mb-3">
                                                <AccordionItem value="fuzzy">
                                                  <AccordionTrigger className="text-sm hover:no-underline">
                                                    <div className="flex items-center gap-2">
                                                      <AlertCircle className="h-4 w-4 text-amber-500" />
                                                      <span>Fuzzy Matches ({activeSegment.wordLevelBreakdown.filter(w => w.type === 'fuzzy').length})</span>
                                                    </div>
                                                  </AccordionTrigger>
                                                  <AccordionContent>
                                                    <div className="space-y-2 pt-2">
                                                      {activeSegment.wordLevelBreakdown
                                                        .filter(w => w.type === 'fuzzy')
                                                        .map((wordData, idx) => (
                                                          <div key={idx} className="border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-950/20 p-3 rounded-r-lg">
                                                            <div className="flex items-center justify-between mb-1">
                                                              <p className="font-semibold text-sm">{wordData.word}</p>
                                                              <Badge variant="secondary" className="text-xs">{wordData.matchScore}%</Badge>
                                                            </div>
                                                            {wordData.tmSourceText && (
                                                              <p className="text-xs text-muted-foreground">
                                                                TM: {wordData.tmSourceText}
                                                              </p>
                                                            )}
                                                            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                                                              Review recommended for accuracy
                                                            </p>
                                                          </div>
                                                        ))}
                                                    </div>
                                                  </AccordionContent>
                                                </AccordionItem>
                                              </Accordion>
                                            )}

                                            {/* Group new AI translations together */}
                                            {activeSegment.wordLevelBreakdown.filter(w => w.type === 'new').length > 0 && (
                                              <Accordion type="single" collapsible>
                                                <AccordionItem value="new">
                                                  <AccordionTrigger className="text-sm hover:no-underline">
                                                    <div className="flex items-center gap-2">
                                                      <Sparkles className="h-4 w-4 text-blue-500" />
                                                      <span>AI Generated ({activeSegment.wordLevelBreakdown.filter(w => w.type === 'new').length})</span>
                                                    </div>
                                                  </AccordionTrigger>
                                                  <AccordionContent>
                                                    <div className="space-y-2 pt-2">
                                                      {activeSegment.wordLevelBreakdown
                                                        .filter(w => w.type === 'new')
                                                        .map((wordData, idx) => (
                                                          <div key={idx} className="border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950/20 p-3 rounded-r-lg">
                                                            <p className="font-semibold text-sm">{wordData.word}</p>
                                                            <p className="text-xs text-muted-foreground mt-1">
                                                              New translation generated by AI - will be added to TM after approval
                                                            </p>
                                                          </div>
                                                        ))}
                                                    </div>
                                                  </AccordionContent>
                                                </AccordionItem>
                                              </Accordion>
                                            )}
                                          </div>
                                        </>
                                      )}

                                      {/* 7. FULL AI ANALYSIS - Accordion at bottom */}
                                      {!analysisLoading && activeSegment.fullAnalysis && (
                                        <Accordion type="single" collapsible className="border-2 border-primary/20 rounded-lg">
                                          <AccordionItem value="analysis" className="border-none">
                                            <AccordionTrigger className="text-sm font-semibold hover:no-underline px-4 hover:bg-primary/5 transition-colors">
                                              <div className="flex items-center gap-3 flex-1">
                                                <FileText className="h-5 w-5 text-primary" />
                                                <span className="text-base">View Full AI Analysis</span>
                                                <Badge variant="outline" className="ml-2 text-xs">Detailed Breakdown</Badge>
                                              </div>
                                            </AccordionTrigger>
                                            <AccordionContent>
                                              <div className="space-y-6 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-lg border max-w-full">
                                                {activeSegment.fullAnalysis.split(/\n(?=\*\*\d+\.)/).filter(Boolean).map((section, idx) => {
                                                  // Extract section number and title
                                                  const titleMatch = section.match(/\*\*(\d+)\.\s*([^:]+):/);
                                                  if (!titleMatch) return null;
                                                  
                                                  const sectionNum = parseInt(titleMatch[1]);
                                                  const title = titleMatch[2].trim();
                                                  
                                                  // Get content after title (everything after the first line)
                                                  const contentStart = section.indexOf('\n');
                                                  const content = contentStart > -1 ? section.substring(contentStart + 1).trim() : '';
                                                  
                                                  if (!content && sectionNum !== 1) return null; // Skip empty sections except translation
                                                  
                                                  return (
                                                    <div key={idx} className="space-y-3 border-l-4 border-primary/30 pl-4">
                                                      <div className="flex items-center gap-2 mb-3">
                                                        {sectionNum === 1 && <FileText className="h-5 w-5 text-primary" />}
                                                        {sectionNum === 2 && <List className="h-5 w-5 text-primary" />}
                                                        {sectionNum === 3 && <CheckCircle className="h-5 w-5 text-primary" />}
                                                        {sectionNum === 4 && <AlertTriangle className="h-5 w-5 text-primary" />}
                                                        <h4 className="text-base font-semibold text-primary">
                                                          {sectionNum}. {title}
                                                        </h4>
                                                      </div>
                                                      
                                                      <div className="space-y-2 text-sm leading-relaxed">
                                                        {content.split('\n').map((line, lineIdx) => {
                                                          const trimmed = line.trim();
                                                          
                                                          // Skip empty lines and horizontal rules
                                                          if (!trimmed || trimmed === '---' || trimmed.startsWith('---')) {
                                                            return <div key={lineIdx} className="h-3" />;
                                                          }
                                                          
                                                          // Handle bullet points
                                                          if (trimmed.match(/^[*-]\s+/)) {
                                                            const bulletText = trimmed.replace(/^[*-]\s+/, '');
                                                            // Check if the bullet has bold parts
                                                            if (bulletText.includes('**')) {
                                                              const parts = bulletText.split('**');
                                                              return (
                                                                <div key={lineIdx} className="flex gap-2 ml-2">
                                                                  <span className="text-primary font-bold mt-0.5">•</span>
                                                                  <span className="text-muted-foreground flex-1">
                                                                    {parts.map((part, partIdx) => 
                                                                      partIdx % 2 === 1 ? 
                                                                        <strong key={partIdx} className="text-foreground font-semibold">{part}</strong> : 
                                                                        <span key={partIdx}>{part}</span>
                                                                    )}
                                                                  </span>
                                                                </div>
                                                              );
                                                            }
                                                            return (
                                                              <div key={lineIdx} className="flex gap-2 ml-2">
                                                                <span className="text-primary font-bold mt-0.5">•</span>
                                                                <span className="text-muted-foreground flex-1">{bulletText}</span>
                                                              </div>
                                                            );
                                                          }
                                                          
                                                          // Handle bold text (including entire lines wrapped in **)
                                                          if (trimmed.includes('**')) {
                                                            // Remove wrapping ** if entire line is wrapped
                                                            let processedLine = trimmed;
                                                            if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
                                                              processedLine = trimmed.slice(2, -2);
                                                              return (
                                                                <p key={lineIdx} className="font-bold text-foreground text-base my-2">
                                                                  {processedLine}
                                                                </p>
                                                              );
                                                            }
                                                            
                                                            // Handle inline bold
                                                            const parts = processedLine.split('**');
                                                            return (
                                                              <p key={lineIdx} className="text-muted-foreground my-1.5">
                                                                {parts.map((part, partIdx) => 
                                                                  partIdx % 2 === 1 ? 
                                                                    <strong key={partIdx} className="text-foreground font-semibold">{part}</strong> : 
                                                                    <span key={partIdx}>{part}</span>
                                                                )}
                                                              </p>
                                                            );
                                                          }
                                                          
                                                          // Regular text
                                                          return (
                                                            <p key={lineIdx} className="text-muted-foreground my-1.5">
                                                              {trimmed}
                                                            </p>
                                                          );
                                                        })}
                                                      </div>
                                                    </div>
                                                  );
                                                })}
                                              </div>
                                            </AccordionContent>
                                          </AccordionItem>
                                        </Accordion>
                                      )}

                                      {/* 8. ACTION BUTTONS */}
                                      {!analysisLoading && activeSegment.needsReview && (
                                        <div className="space-y-2 pt-2">
                                          <Button 
                                            className="w-full" 
                                            onClick={() => {
                                              handleApproveReview(activeSegment.id);
                                              setTmDrawerOpen(false);
                                            }}
                                          >
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            Approve All Fuzzy Matches
                                          </Button>
                                          <Button 
                                            variant="outline" 
                                            className="w-full"
                                            onClick={() => setTmDrawerOpen(false)}
                                          >
                                            Continue Editing
                                          </Button>
                                        </div>
                                      )}
                                    </div>
                                  </SheetContent>
                                </Sheet>
                              )}
                            </div>
                          </div>
                          
                          {/* Editable Translation Textarea */}
                          <Textarea
                            value={activeSegment.translatedText || ''}
                            onChange={(e) => handleManualEdit(activeSegment.id, e.target.value)}
                            placeholder="Enter translation or use TM/AI suggestions..."
                            className={`min-h-[300px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-emerald-200/50 dark:border-emerald-800/50 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-lg transition-all ${
                              activeSegment.translationStatus === 'completed' && isEditingTranslation !== activeSegment.id
                                ? 'cursor-not-allowed opacity-60'
                                : ''
                            }`}
                            readOnly={activeSegment.translationStatus === 'completed' && isEditingTranslation !== activeSegment.id}
                            disabled={activeSegment.translationStatus === 'completed' && isEditingTranslation !== activeSegment.id}
                          />
                        </div>
                      </div>
                    </ScrollArea>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-2 opacity-20" />
                      <p>Select a segment to begin translation</p>
                    </div>
                  </div>
                )}
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </TabsContent>

        {/* Draft Translation Tab */}
        <TabsContent value="draft" className="flex-1 flex flex-col overflow-hidden mt-0 data-[state=inactive]:hidden">
          {/* Phase Header - Below Tabs */}
          <div className="flex items-center justify-between px-6 py-4 border-b shrink-0 bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-950/20 dark:to-blue-950/20">
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5 text-emerald-600" />
                Complete Draft Translation
              </h3>
              {draftMetadata && (
                <p className="text-sm text-muted-foreground mt-1">
                  {draftMetadata.segmentCount} segments • {draftMetadata.totalWords} words • 
                  {draftMetadata.averageTMLeverage}% TM leverage
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              {!draftTranslation ? (
                <Button 
                  onClick={generateDraftTranslation} 
                  disabled={!allSegmentsComplete || isGeneratingDraft}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {isGeneratingDraft ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Draft Translation
                    </>
                  )}
                </Button>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      navigator.clipboard.writeText(draftTranslation);
                      toast({ title: 'Copied to clipboard' });
                    }}
                  >
                    Copy to Clipboard
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      const blob = new Blob([draftTranslation], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `draft-translation-${new Date().toISOString().split('T')[0]}.txt`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                  >
                    Download as Text
                  </Button>
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={onNext}
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Send to Cultural Intelligence
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
              {!draftTranslation ? (
                <div className="h-full flex items-center justify-center">
                  <Card className="max-w-md">
                    <CardContent className="p-6 text-center space-y-4">
                      <div className="mx-auto w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center">
                        <FileText className="h-6 w-6 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Generate Draft Translation</h3>
                        <p className="text-sm text-muted-foreground">
                          Complete all segment translations to generate a complete draft for Cultural Intelligence review
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-sm justify-center">
                        <Badge variant={allSegmentsComplete ? "default" : "secondary"}>
                          {segments.filter(s => s.translationStatus === 'completed').length} / {segments.length} Complete
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <ResizablePanelGroup direction="horizontal" className="h-full">
                  {/* Main draft content */}
                  <ResizablePanel defaultSize={70} minSize={55}>
                    <ScrollArea className="h-full p-6">
                      <Accordion type="multiple" className="space-y-4">
                        {segments.map((seg, idx) => (
                          <AccordionItem key={seg.id} value={seg.id} className="border rounded-lg">
                            <AccordionTrigger className="px-4 hover:no-underline hover:bg-slate-50 dark:hover:bg-slate-900">
                              <div className="flex items-center justify-between w-full pr-4">
                                <div className="flex items-center gap-3">
                                  <Badge variant="outline" className="font-mono">
                                    {idx + 1}
                                  </Badge>
                                  <span className="font-semibold">{seg.title}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                  <Badge variant="secondary">{seg.wordCount} words</Badge>
                                  {seg.tmLeverageData && (
                                    <Badge variant="outline">
                                      {seg.tmLeverageData.leveragePercentage}% TM
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-4 pb-4">
                              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 mt-2">
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                  {seg.translatedText}
                                </p>
                              </div>
                              {seg.aiConfidence && (
                                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                                  <Sparkles className="h-3 w-3" />
                                  AI Confidence: {seg.aiConfidence}%
                                </div>
                              )}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </ScrollArea>
                  </ResizablePanel>

                  <ResizableHandle withHandle />

                  {/* Metadata sidebar */}
                  <ResizablePanel defaultSize={30} minSize={25} maxSize={40}>
                    <div className="h-full bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 border-l p-4">
                      <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <BarChart3 className="h-4 w-4" />
                        Translation Metadata
                      </h3>
                      
                      {draftMetadata && (
                        <div className="space-y-4">
                          <Card>
                            <CardContent className="p-4">
                              <div className="text-center">
                                <p className="text-3xl font-bold text-emerald-600">
                                  {draftMetadata.averageTMLeverage}%
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Average TM Leverage
                                </p>
                              </div>
                            </CardContent>
                          </Card>

                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Total Segments</span>
                              <span className="font-semibold">{draftMetadata.segmentCount}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Total Words</span>
                              <span className="font-semibold">{draftMetadata.totalWords}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Generated</span>
                              <span className="font-semibold">
                                {new Date(draftMetadata.generatedAt).toLocaleTimeString()}
                              </span>
                            </div>
                          </div>

                          <Alert>
                            <CheckCircle className="h-4 w-4" />
                            <AlertDescription>
                              Ready for Cultural Intelligence Analysis
                            </AlertDescription>
                          </Alert>
                        </div>
                      )}
                    </div>
                  </ResizablePanel>
                </ResizablePanelGroup>
              )}
            </div>
        </TabsContent>

        <TabsContent value="analytics" className="flex-1 flex flex-col overflow-hidden mt-0 data-[state=inactive]:hidden">
          {/* Phase Header - Below Tabs */}
          <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
            <div>
              <h3 className="text-lg font-semibold">TM Leverage Overview</h3>
              <p className="text-sm text-muted-foreground">
                Translation Memory analytics and optimization insights
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm text-muted-foreground">
                Leverage: {tmAnalytics.leverageRate.toFixed(1)}%
              </div>
              <Progress value={tmAnalytics.leverageRate} className="w-32" />
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-6">
              <GlocalTMAnalytics 
                data={tmAnalytics}
                targetMarket={projectData?.target_markets?.[0] || 'Global'}
                therapeuticArea={projectData?.therapeutic_area}
                allSegmentsComplete={allSegmentsComplete}
              />
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

function parseContentIntoSegments(content) {
  const segments = [];
  
  if (typeof content === 'string') {
    const lines = content.split('\n').filter(l => l.trim());
    lines.forEach((line, idx) => {
      if (line.length > 20) {
        segments.push({
          id: `seg-${idx}`,
          title: `Section ${idx + 1}`,
          content: line.trim(),
          wordCount: line.trim().split(/\s+/).length,
          type: 'body',
          translationStatus: 'pending'
        });
      }
    });
  }

  return segments.length > 0 ? segments : [{
    id: 'seg-0',
    title: 'Full Content',
    content: content,
    wordCount: content.split(/\s+/).length,
    type: 'body',
    translationStatus: 'pending'
  }];
}