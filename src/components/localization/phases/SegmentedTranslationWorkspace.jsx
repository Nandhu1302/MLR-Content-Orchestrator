
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Check, Edit, RefreshCw, Target, Clock, Globe } from 'lucide-react';

export const SegmentedTranslationWorkspace = ({
  sourceContent,
  targetLanguage,
  onSegmentTranslated,
  onAITranslation,
  onTMSearch,
  brandId,
  assetId,
  projectId,
  market,
}) => {
  const [segments, setSegments] = useState([]);
  const [activeSegment, setActiveSegment] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Initialize segments from source content
  const initializedSegments = useMemo(() => {
    if (!sourceContent) return [];
    return sourceContent.map((section, index) => ({
      id: `segment-${index}`,
      title: section.title ?? `Section ${index + 1}`,
      content: section.content ?? '',
      wordCount: (section.content ?? '')
        .split(/\s+/)
        .filter((word) => word.length > 0).length,
      translationStatus: 'pending',
      tmMatches: [],
      translatedText: '',
      confidence: 0,
    }));
  }, [sourceContent]);

  React.useEffect(() => {
    setSegments(initializedSegments);
  }, [initializedSegments]);

  const totalWords = segments.reduce((sum, seg) => sum + seg.wordCount, 0);
  const translatedWords = segments
    .filter((seg) => seg.translationStatus === 'complete')
    .reduce((sum, seg) => sum + seg.wordCount, 0);
  const progress = totalWords > 0 ? (translatedWords / totalWords) * 100 : 0;

  const handleTMSearch = async (segment) => {
    setIsProcessing(true);
    try {
      const matches = await onTMSearch(segment.content);
      setSegments((prev) =>
        prev.map((s) =>
          s.id === segment.id
            ? { ...s, tmMatches: matches, translationStatus: matches.length > 0 ? 'memory' : 'pending' }
            : s
        )
      );
    } catch (error) {
      console.error('TM search failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAITranslate = async (segment) => {
    setIsProcessing(true);
    try {
      const translation = await onAITranslation(segment.content);
      setSegments((prev) =>
        prev.map((s) =>
          s.id === segment.id
            ? {
                ...s,
                translatedText: translation,
                translationStatus: 'ai',
                confidence: 85,
              }
            : s
        )
      );
      onSegmentTranslated(segment.id, translation, 'ai');
    } catch (error) {
      console.error('AI translation failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManualEdit = (segment, translation) => {
    setSegments((prev) =>
      prev.map((s) =>
        s.id === segment.id
          ? {
              ...s,
              translatedText: translation,
              translationStatus: 'manual',
              confidence: 100,
            }
          : s
      )
    );
    onSegmentTranslated(segment.id, translation, 'manual');
  };

  const markComplete = async (segment) => {
    if (!segment.translatedText) {
      console.warn('Cannot mark incomplete segment as complete');
      return;
    }

    // Update UI state
    setSegments((prev) =>
      prev.map((s) => (s.id === segment.id ? { ...s, translationStatus: 'complete' } : s))
    );

    // Save to Smart TM automatically if we have the required metadata
    if (brandId && assetId) {
      try {
        const { TranslationPersistenceService } = await import('@/services/translationPersistenceService');
        const tmData = {
          sourceText: segment.content,
          targetText: segment.translatedText,
          sourceLanguage: 'en',
          targetLanguage: targetLanguage,
          brandId: brandId,
          assetId: assetId,
          projectId: projectId,
          market: market,
          domainCategory: segment.title ?? 'general',
          matchType: 'exact',
          qualityScore: segment.confidence ?? 85,
          confidenceScore: segment.confidence ?? 85,
          contextMetadata: {
            segmentId: segment.id,
            segmentType: segment.title,
            wordCount: segment.wordCount,
          },
        };
        const saved = await TranslationPersistenceService.saveTMSegment(tmData);
        if (saved) {
          console.log('✅ Saved translation to Smart TM:', segment.id);
        } else {
          console.warn('⚠️ Failed to save to Smart TM, but translation completed');
        }
      } catch (error) {
        console.error('Error saving to Smart TM:', error);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'complete':
        return 'bg-success text-success-foreground';
      case 'ai':
        return 'bg-primary text-primary-foreground';
      case 'memory':
        return 'bg-accent text-accent-foreground';
      case 'manual':
        return 'bg-secondary text-secondary-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Translation Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between text-sm">
            <span>{translatedWords} / {totalWords} words translated</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="w-full" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="font-semibold">{segments.length}</div>
              <div className="text-muted-foreground">Total Segments</div>
            </div>
            <div className="text-center">
              <div className="font-semibold">
                {segments.filter((s) => s.translationStatus === 'memory').length}
              </div>
              <div className="text-muted-foreground">TM Matches</div>
            </div>
            <div className="text-center">
              <div className="font-semibold">
                {segments.filter((s) => s.translationStatus === 'ai').length}
              </div>
              <div className="text-muted-foreground">AI Translated</div>
            </div>
            <div className="text-center">
              <div className="font-semibold">
                {segments.filter((s) => s.translationStatus === 'complete').length}
              </div>
              <div className="text-muted-foreground">Completed</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Segment List */}
      <div className="grid gap-4">
        {segments.map((segment) => (
          <Card key={segment.id} className="transition-colors hover:bg-muted/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{segment.title}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">{segment.wordCount} words</Badge>
                  <Badge className={getStatusColor(segment.translationStatus)}>
                    {segment.translationStatus}
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Source Content */}
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Source Content:</div>
                <div className="p-3 bg-muted rounded-md text-sm">
                  {segment.content}
                </div>
              </div>

              {/* Translation Memory Matches */}
              {segment.tmMatches && segment.tmMatches.length > 0 && (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">
                    Translation Memory ({segment.tmMatches.length} matches):
                  </div>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {segment.tmMatches.slice(0, 3).map((match, idx) => (
                      <div key={idx} className="p-2 bg-accent/20 rounded text-xs">
                        <div className="flex justify-between items-center mb-1">
                          <Badge variant="outline" className="text-xs">
                            {match.matchPercentage ?? 0}% match
                          </Badge>
                        </div>
                        <div>{match.targetText}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Translated Content */}
              {segment.translatedText && (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">
                    Translation ({targetLanguage.toUpperCase()}):
                  </div>
                  <Textarea
                    value={segment.translatedText}
                    onChange={(e) => handleManualEdit(segment, e.target.value)}
                    className="min-h-20"
                    placeholder={`Translation in ${targetLanguage}...`}
                  />
                  {segment.confidence && (
                    <div className="text-xs text-muted-foreground">
                      Confidence: {segment.confidence}%
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTMSearch(segment)}
                  disabled={isProcessing}
                  className="flex items-center gap-1"
                >
                  <RefreshCw className="h-3 w-3" />
                  Search TM
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAITranslate(segment)}
                  disabled={isProcessing}
                  className="flex items-center gap-1"
                >
                  <Globe className="h-3 w-3" />
                  AI Translate
                </Button>
                {segment.translatedText && segment.translationStatus !== 'complete' && (
                  <Button
                    size="sm"
                    onClick={() => markComplete(segment)}
                    className="flex items-center gap-1"
                  >
                    <Check className="h-3 w-3" />
                    Mark Complete
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
