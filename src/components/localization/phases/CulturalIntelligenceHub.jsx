
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle, Clock, Eye, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CulturalAnalysisModal } from '../modals/CulturalAnalysisModal';
import { TranslationEditorModal } from '../modals/TranslationEditorModal';
import { supabase } from '@/integrations/supabase/client';

export const CulturalIntelligenceHub = ({
  selectedAsset,
  draftTranslations,
  targetMarket,
  onPhaseComplete,
  onBack,
}) => {
  const { toast } = useToast();

  // Data adapter to transform Phase 2 segments to Phase 3 format
  const adaptSegmentData = (rawSegments = []) => {
    return rawSegments.map((seg) => ({
      id: seg.id,
      type: seg.title ?? seg.type ?? 'Unknown',
      content: seg.content,
      translation: seg.translatedText ?? seg.translation ?? '',
      context: seg.context,
    }));
  };

  const [segments, setSegments] = useState(() => {
    // Handle if draftTranslations is an object with "segments" property
    const segmentsArray = Array.isArray(draftTranslations)
      ? draftTranslations
      : (draftTranslations && draftTranslations.segments) || [];

    const adaptedSegments = adaptSegmentData(segmentsArray);
    console.log('Phase 3 - Received draftTranslations:', draftTranslations);
    console.log('Phase 3 - Adapted segments:', adaptedSegments);
    console.log('Phase 3 - Target market:', targetMarket);
    return adaptedSegments;
  });

  const [selectedSegmentIndex, setSelectedSegmentIndex] = useState(0);
  const [reviewedSegments, setReviewedSegments] = useState(new Set());
  const [analyzedSegments, setAnalyzedSegments] = useState(new Map());
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [showEditorModal, setShowEditorModal] = useState(false);

  const selectedSegment = segments[selectedSegmentIndex];

  const handleAnalyze = async () => {
    if (!selectedSegment) {
      toast({ title: 'No segment selected', variant: 'destructive' });
      return;
    }

    // Safety check for translation data
    if (!selectedSegment.translation || selectedSegment.translation.trim() === '') {
      toast({
        title: 'No Translation Data',
        description:
          "This segment doesn't have a translation from Phase 2. Please go back and complete Phase 2 first.",
        variant: 'destructive',
      });
      return;
    }

    console.log('Analyzing segment:', {
      content: selectedSegment.content,
      translation: selectedSegment.translation,
      targetMarket: targetMarket,
      assetType: selectedAsset?.type,
      context: selectedSegment.type,
    });

    setIsAnalyzing(true);
    setShowAnalysisModal(true);

    try {
      const { data, error } = await supabase.functions.invoke('cultural-intelligence-analyzer', {
        body: {
          originalText: selectedSegment.content,
          translationText: selectedSegment.translation,
          targetMarket,
          assetType: selectedAsset?.type ?? 'Unknown',
          segmentContext: selectedSegment.type,
        },
      });

      if (error) {
        console.error('Edge function error:', error);
        throw error;
      }

      console.log('Analysis result:', data);
      setCurrentAnalysis(data);

      // Store in analyzed segments map
      setAnalyzedSegments((prev) => new Map(prev).set(selectedSegmentIndex, data));

      toast({
        title: 'Analysis complete',
        description: `Overall score: ${data.overallScore}/100`,
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: 'Analysis failed',
        description: error?.message ?? 'Failed to analyze translation',
        variant: 'destructive',
      });
      setShowAnalysisModal(false);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApplySuggestion = (recommendation) => {
    const updatedSegments = [...segments];
    updatedSegments[selectedSegmentIndex] = {
      ...selectedSegment,
      translation: selectedSegment.translation.replace(
        recommendation.originalText,
        recommendation.suggestedText
      ),
    };
    setSegments(updatedSegments);

    toast({
      title: 'Suggestion applied',
      description: `Changed "${recommendation.originalText}" to "${recommendation.suggestedText}"`,
    });
  };

  const handleSaveTranslation = (newTranslation) => {
    const updatedSegments = [...segments];
    updatedSegments[selectedSegmentIndex] = {
      ...selectedSegment,
      translation: newTranslation,
    };
    setSegments(updatedSegments);
  };

  const handleMarkAsReviewed = () => {
    const newReviewedSegments = new Set(reviewedSegments);
    newReviewedSegments.add(selectedSegmentIndex);
    setReviewedSegments(newReviewedSegments);

    toast({
      title: 'Segment reviewed',
      description: `${newReviewedSegments.size}/${segments.length} segments completed`,
    });

    setShowAnalysisModal(false);

    // Move to next segment if available
    if (selectedSegmentIndex < segments.length - 1) {
      setSelectedSegmentIndex(selectedSegmentIndex + 1);
      setCurrentAnalysis(null);
    }
  };

  const handleComplete = () => {
    if (reviewedSegments.size !== segments.length) {
      toast({
        title: 'Review incomplete',
        description: `Please review all ${segments.length} segments before continuing`,
        variant: 'destructive',
      });
      return;
    }

    onPhaseComplete({
      culturallyAdaptedTranslations: segments,
      completedAt: new Date().toISOString(),
      reviewedSegments: Array.from(reviewedSegments),
    });
  };

  const getSegmentStatus = (index) => {
    if (reviewedSegments.has(index)) return 'reviewed';
    if (index === selectedSegmentIndex) return 'in-progress';
    return 'pending';
  };

  const getSegmentIcon = (status) => {
    switch (status) {
      case 'reviewed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in-progress':
        return <Eye className="h-4 w-4 text-blue-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-gray-400" />;
      default:
        return null;
    }
  };

  const getAISummary = () => {
    if (!currentAnalysis) return undefined;

    const highPriority = [
      ...(currentAnalysis.analysis?.culturalTone?.issues || []).filter((i) => i.priority === 'high'),
      ...(currentAnalysis.analysis?.terminology?.issues || []).filter((i) => i.priority === 'high'),
    ].length;

    const mediumPriority = [
      ...(currentAnalysis.analysis?.culturalTone?.issues || []).filter((i) => i.priority === 'medium'),
      ...(currentAnalysis.analysis?.terminology?.issues || []).filter((i) => i.priority === 'medium'),
    ].length;

    return {
      highPriority,
      mediumPriority,
      terminologyStatus:
        (currentAnalysis.analysis?.terminology?.score ?? 0) >= 85 ? 'OK' : 'Needs Review',
    };
  };

  // Early guard if no usable translations present
  if (
    !draftTranslations ||
    segments.length === 0 ||
    segments.every((s) => !s.translation)
  ) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card>
          <CardContent className="p-8 text-center space-y-4">
            <p className="text-lg font-semibold">No Translation Data Available</p>
            <p className="text-muted-foreground">
              Please complete Phase 2 (Draft Translation Hub) first to generate translations.
            </p>
            <Button onClick={onBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back to Phase 2
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            🧠 Cultural Intelligence Analysis
          </h2>
          <p className="text-muted-foreground mt-1">
            Analyzing for: <Badge variant="secondary">{targetMarket}</Badge>
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Progress: {reviewedSegments.size}/{segments.length} segments reviewed
          </p>
        </div>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Phase 2
        </Button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-12 gap-6">
        {/* Segments List - Left Panel */}
        <Card className="col-span-4">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-4">Segments</h3>
            <ScrollArea className="h-[600px]">
              <div className="space-y-2">
                {segments.map((segment, idx) => {
                  const status = getSegmentStatus(idx);
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedSegmentIndex(idx);
                        // Load existing analysis if available
                        const existingAnalysis = analyzedSegments.get(idx);
                        setCurrentAnalysis(existingAnalysis ?? null);
                      }}
                      className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
                        idx === selectedSegmentIndex
                          ? 'border-primary bg-primary/5'
                          : 'border-transparent hover:border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{segment.type}</span>
                        <div className="flex items-center gap-2">
                          {analyzedSegments.has(idx) && (
                            <Badge variant="secondary" className="text-xs">
                              AI Analyzed
                            </Badge>
                          )}
                          {getSegmentIcon(status)}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {segment.content}
                      </p>
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Selected Segment - Right Panel */}
        <Card className="col-span-8">
          <CardContent className="p-6">
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">{selectedSegment.type}</h3>
                  <Badge variant={reviewedSegments.has(selectedSegmentIndex) ? 'default' : 'secondary'}>
                    {reviewedSegments.has(selectedSegmentIndex) ? 'Reviewed' : 'Pending Review'}
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Original (EN):</label>
                    <Card className="mt-2">
                      <CardContent className="p-4">
                        <p className="text-sm">{selectedSegment.content}</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Phase 2 Draft ({targetMarket}):
                    </label>
                    <Card className="mt-2">
                      <CardContent className="p-4">
                        <p className="font-medium">{selectedSegment.translation}</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                {analyzedSegments.has(selectedSegmentIndex) ? (
                  // Segment already analyzed - show view/re-analyze options
                  <>
                    <Button
                      onClick={() => setShowAnalysisModal(true)}
                      variant="default"
                      className="flex-1"
                    >
                      View AI Analysis
                    </Button>
                    <Button
                      onClick={handleAnalyze}
                      disabled={isAnalyzing}
                      variant="outline"
                      className="flex-1"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Re-analyzing...
                        </>
                      ) : (
                        'Re-analyze'
                      )}
                    </Button>
                  </>
                ) : (
                  // Not yet analyzed - show analyze/edit options
                  <>
                    <Button onClick={handleAnalyze} disabled={isAnalyzing} className="flex-1">
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        'Analyze with AI'
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowEditorModal(true)}
                      className="flex-1"
                    >
                      Edit Translation
                    </Button>
                  </>
                )}
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setSelectedSegmentIndex(Math.max(0, selectedSegmentIndex - 1))}
                  disabled={selectedSegmentIndex === 0}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>

                {reviewedSegments.size === segments.length ? (
                  <Button onClick={handleComplete}>
                    Complete Phase 3
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() =>
                      setSelectedSegmentIndex(
                        Math.min(segments.length - 1, selectedSegmentIndex + 1)
                      )
                    }
                    disabled={selectedSegmentIndex === segments.length - 1}
                  >
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <CulturalAnalysisModal
        isOpen={showAnalysisModal}
        onClose={() => setShowAnalysisModal(false)}
        segmentName={selectedSegment?.type ?? ''}
        analysisData={currentAnalysis}
        onApplySuggestion={handleApplySuggestion}
        onEditTranslation={() => {
          setShowAnalysisModal(false);
          setShowEditorModal(true);
        }}
        onMarkAsReviewed={handleMarkAsReviewed}
        onReAnalyze={handleAnalyze}
        isAnalyzing={isAnalyzing}
        isReviewed={reviewedSegments.has(selectedSegmentIndex)}
      />

      <TranslationEditorModal
        isOpen={showEditorModal}
        onClose={() => setShowEditorModal(false)}
        segmentName={selectedSegment?.type ?? ''}
        originalText={selectedSegment?.content ?? ''}
        translationText={selectedSegment?.translation ?? ''}
        onSave={handleSaveTranslation}
        aiSummary={getAISummary()}
      />
    </div>
  );
};
