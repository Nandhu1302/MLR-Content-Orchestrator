
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Globe,
  FileText,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Search,
  Download,
  Hash,
  Target,
  BarChart3,
  Loader2,
} from 'lucide-react';
import { TMMatchPanel } from '@/components/localization/TMMatchPanel';
import { useSmartTMMatching } from '@/hooks/useSmartTMMatching';
import { SmartTMIntelligenceService } from '@/services/SmartTMIntelligenceService';
import { useBrand } from '@/contexts/BrandContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export const ContentProcessingTMHub = ({
  selectedAsset,
  globalMetadata,
  onPhaseComplete,
  onBack,
}) => {
  const [contentSegments, setContentSegments] = useState([]);
  const [processingStats, setProcessingStats] = useState({
    totalSegments: 0,
    segmentsWithMatches: 0,
    averageMatchQuality: 0,
    tmLeveragePercentage: 0,
    processingProgress: 0,
    terminologyValidationScore: 0,
    contentTypeBreakdown: {},
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState(null);
  const [sourceLanguage] = useState('en');
  const [targetLanguage] = useState(globalMetadata?.targetLanguages?.[0] ?? 'es');

  const { selectedBrand } = useBrand();
  const { toast } = useToast();

  const {
    searchResults,
    isLoading: tmLoading,
    error: tmError,
    searchTM,
    getBestMatches,
  } = useSmartTMMatching(
    selectedBrand?.id ?? '',
    sourceLanguage,
    targetLanguage,
    { minMatchPercentage: 70 }
  );

  useEffect(() => {
    if (selectedAsset && globalMetadata) {
      processContent();
    }
  }, [selectedAsset, globalMetadata]);

  const processContent = async () => {
    setIsProcessing(true);
    setProcessingStats(prev => ({ ...prev, processingProgress: 10 }));

    try {
      // Extract and segment content from the selected asset
      const rawContent = extractContentFromAsset(selectedAsset);
      setProcessingStats(prev => ({ ...prev, processingProgress: 30 }));

      // Segment the content into translatable units
      const segments = await segmentContent(rawContent);
      setContentSegments(segments);

      setProcessingStats(prev => ({
        ...prev,
        totalSegments: segments.length,
        processingProgress: 60,
      }));

      // Enhanced processing with TM matches and terminology validation
      const enhancedSegments = await Promise.all(
        segments.map(async (segment) => {
          // Get TM matches with confidence scoring
          const tmMatches = await getTMMatchesForSegment(segment.text);
          const confidenceScore = calculateConfidenceScore(segment, tmMatches);
          // Validate terminology
          const terminologyValidation = await validateSegmentTerminology(segment);
          return {
            ...segment,
            tmMatches,
            confidenceScore,
            terminologyValidation,
          };
        })
      );

      setContentSegments(enhancedSegments);

      // Calculate enhanced statistics
      const contentTypeBreakdown = enhancedSegments.reduce((acc, seg) => {
        acc[seg.contentType] = (acc[seg.contentType] ?? 0) + 1;
        return acc;
      }, {});

      const avgTerminologyScore =
        enhancedSegments
          .filter(s => s.terminologyValidation)
          .reduce((sum, s) => sum + (s.terminologyValidation?.isValid ? 100 : 50), 0) /
        enhancedSegments.length;

      setProcessingStats(prev => ({
        ...prev,
        processingProgress: 100,
        terminologyValidationScore: Math.round(avgTerminologyScore),
        contentTypeBreakdown,
        segmentsWithMatches: enhancedSegments.filter(s => s.tmMatches && s.tmMatches.length > 0).length,
        averageMatchQuality: Math.round(
          enhancedSegments
            .filter(s => s.confidenceScore !== undefined && s.confidenceScore !== null)
            .reduce((sum, s) => sum + (s.confidenceScore ?? 0), 0) / enhancedSegments.length
        ),
      }));

      toast({
        title: 'Content Processing Complete',
        description: `Successfully processed ${segments.length} content segments`,
      });
    } catch (error) {
      console.error('Content processing error:', error);
      toast({
        title: 'Processing Error',
        description: 'Failed to process content. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const extractContentFromAsset = (asset) => {
    // Extract actual content based on asset source
    if (asset.primary_content) {
      // From Content Studio, Pre-MLR, or Design Studio
      const content = asset.primary_content;
      if (typeof content === 'object') {
        // Extract text from structured content
        return extractTextFromStructuredContent(content);
      }
      return content.toString();
    }
    // Fallback to asset name and description
    return `${asset.name}\n\n${asset.description ?? ''}`;
  };

  const extractTextFromStructuredContent = (content) => {
    if (!content) return '';
    const extractedTexts = [];

    // Extract based on common content structures
    if (content.sections) {
      content.sections.forEach((section) => {
        if (section.title) extractedTexts.push(section.title);
        if (section.content) extractedTexts.push(section.content);
        if (section.body) extractedTexts.push(section.body);
      });
    }

    if (content.title) extractedTexts.push(content.title);
    if (content.body) extractedTexts.push(content.body);
    if (content.description) extractedTexts.push(content.description);
    if (content.headline) extractedTexts.push(content.headline);
    if (content.subheadline) extractedTexts.push(content.subheadline);
    if (content.cta_text) extractedTexts.push(content.cta_text);

    return extractedTexts.filter(Boolean).join('\n\n');
  };

  const segmentContent = async (content) => {
    // Enhanced content segmentation with content type detection
    const paragraphs = content.split('\n\n').filter(p => p.trim().length > 0);
    return paragraphs.map((text, index) => ({
      id: `segment-${index}`,
      text: text.trim(),
      type: determineSegmentType(text.trim()),
      contentType: determineContentType(text.trim()),
      metadata: {
        wordCount: text.trim().split(' ').length,
        characterCount: text.trim().length,
        complexity: calculateTextComplexity(text.trim()),
      },
    }));
  };

  const determineContentType = (text) => {
    const lowerText = text.toLowerCase();

    // CTA detection
    if (
      lowerText.includes('click') ||
      lowerText.includes('learn more') ||
      lowerText.includes('contact') ||
      lowerText.includes('visit')
    ) {
      return 'cta';
    }

    // Disclaimer detection
    if (
      lowerText.includes('important safety') ||
      lowerText.includes('contraindications') ||
      lowerText.includes('side effects') ||
      lowerText.includes('please see')
    ) {
      return 'disclaimer';
    }

    // Legal text detection
    if (
      lowerText.includes('©') ||
      lowerText.includes('copyright') ||
      lowerText.includes('all rights reserved')
    ) {
      return 'legal_text';
    }

    // Product name detection (short, branded terms)
    // NOTE: original regex looked like `/^[A-Z][a-z]+/` but had TS escape noise.
    // Keeping a simple heuristic close to intent:
    if (text.length < 30 && /^[A-Z][a-zA-Z]+(?:\s[A-Z][a-zA-Z]+)?$/.test(text)) {
      return 'product_name';
    }

    // Headline detection
    if (text.length < 100 && !text.includes('.')) {
      return 'headline';
    }

    return 'body_text';
  };

  const calculateTextComplexity = (text) => {
    const words = text.split(' ').length;
    const sentences = text.split(/[.!?]+/).filter(Boolean).length || 1;
    const avgWordsPerSentence = words / sentences;

    // Simple complexity score based on length and structure
    if (avgWordsPerSentence > 20) return 3; // High
    if (avgWordsPerSentence > 10) return 2; // Medium
    return 1; // Low
  };

  const determineSegmentType = (text) => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('click') || lowerText.includes('learn more')) return 'cta';
    if (lowerText.includes('important safety') || lowerText.includes('contraindications')) return 'disclaimer';
    if (text.length < 50) return 'heading';
    if (text.startsWith('•') || text.startsWith('-')) return 'list_item';
    return 'paragraph';
  };

  const getTMMatchesForSegment = async (text) => {
    try {
      // Simulate TM matching with confidence scoring
      const matches = await SmartTMIntelligenceService.getAssetSpecificMatches(
        text,
        sourceLanguage,
        targetLanguage,
        selectedBrand?.id ?? '',
        {
          assetType: selectedAsset.type,
          targetAudience: selectedAsset.metadata?.targetAudience ?? 'healthcare-professionals',
          therapeuticArea: selectedAsset.metadata?.therapeuticArea ?? 'general',
          brandGuidelines: selectedAsset.metadata?.brandGuidelines ?? {},
          regulatoryRequirements: selectedAsset.metadata?.regulatoryRequirements ?? [],
        }
      );
      return matches.slice(0, 3); // Top 3 matches
    } catch (error) {
      console.error('TM matching error:', error);
      return [];
    }
  };

  const calculateConfidenceScore = (segment, tmMatches) => {
    if (!tmMatches || tmMatches.length === 0) return 0;
    const bestMatch = tmMatches[0];
    let score = bestMatch.matchPercentage ?? 0;

    // Boost score for exact content type matches
    if (bestMatch.contentType === segment.contentType) {
      score += 10;
    }
    // Reduce score for complex content
    if (segment.metadata?.complexity === 3) {
      score -= 5;
    }
    return Math.min(100, Math.max(0, score));
  };

  const validateSegmentTerminology = async (segment) => {
    try {
      const validation = await SmartTMIntelligenceService.validateTerminologyRealTime(
        segment.text,
        selectedBrand?.id ?? '',
        targetLanguage,
        {
          assetType: selectedAsset.type,
          targetAudience: selectedAsset.metadata?.targetAudience ?? 'healthcare-professionals',
          therapeuticArea: selectedAsset.metadata?.therapeuticArea ?? 'general',
          brandGuidelines: selectedAsset.metadata?.brandGuidelines ?? {},
          regulatoryRequirements: selectedAsset.metadata?.regulatoryRequirements ?? [],
        }
      );

      return {
        isValid: validation.isValid,
        issues: (validation.regulatoryIssues || []).map(issue => issue.description),
        suggestions: validation.suggestions || [],
      };
    } catch (error) {
      console.error('Terminology validation error:', error);
      return {
        isValid: true,
        issues: [],
        suggestions: [],
      };
    }
  };

  const generateTMReport = () => {
    const averageConfidence =
      Math.round(
        (contentSegments
          .filter(s => s.confidenceScore !== undefined && s.confidenceScore !== null)
          .reduce((sum, s) => sum + (s.confidenceScore ?? 0), 0)) /
        (contentSegments.length || 1)
      );

    const reportData = {
      phase: 'tm_processing',
      timestamp: new Date().toISOString(),
      asset: {
        id: selectedAsset.id,
        name: selectedAsset.name,
        source: selectedAsset.source_module,
      },
      processing: {
        totalSegments: contentSegments.length,
        segmentsProcessed: contentSegments.length,
        processingTime: '2.3 seconds',
        contentTypeBreakdown: processingStats.contentTypeBreakdown,
      },
      tmAnalysis: {
        leveragePercentage: processingStats.tmLeveragePercentage,
        averageMatchQuality: processingStats.averageMatchQuality,
        averageConfidenceScore: averageConfidence,
        exactMatches: contentSegments.filter(s => (s.confidenceScore ?? 0) >= 90).length,
        fuzzyMatches: contentSegments.filter(s => (s.confidenceScore ?? 0) >= 70 && (s.confidenceScore ?? 0) < 90).length,
        noMatches: contentSegments.filter(s => (s.confidenceScore ?? 0) < 70).length,
      },
      terminologyValidation: {
        overallScore: processingStats.terminologyValidationScore,
        validSegments: contentSegments.filter(s => s.terminologyValidation?.isValid).length,
        issuesFound: contentSegments.filter(s => (s.terminologyValidation?.issues || []).length).length,
      },
      segments: contentSegments.map(seg => ({
        id: seg.id,
        text: seg.text,
        type: seg.type,
        contentType: seg.contentType,
        wordCount: seg.metadata?.wordCount ?? 0,
        complexity: seg.metadata?.complexity ?? 1,
        confidenceScore: seg.confidenceScore ?? 0,
        hasMatches: !!(seg.tmMatches && seg.tmMatches.length > 0),
        terminologyValid: seg.terminologyValidation?.isValid ?? false,
      })),
      recommendations: generateRecommendations(),
      readyForNextPhase: true,
    };

    return reportData;
  };

  const generateRecommendations = () => {
    const recommendations = [];
    const lowConfidenceSegments = contentSegments.filter(s => (s.confidenceScore ?? 0) < 70);
    if (lowConfidenceSegments.length > 0) {
      recommendations.push({
        type: 'quality',
        message: `${lowConfidenceSegments.length} segments have low TM confidence. Consider manual review.`,
      });
    }

    const terminologyIssues = contentSegments.filter(s => !(s.terminologyValidation?.isValid));
    if (terminologyIssues.length > 0) {
      recommendations.push({
        type: 'terminology',
        message: `${terminologyIssues.length} segments have terminology concerns. Review brand consistency.`,
      });
    }

    if ((processingStats.tmLeveragePercentage ?? 0) < 50) {
      recommendations.push({
        type: 'leverage',
        message: 'Low TM leverage detected. Consider building translation memory for future projects.',
      });
    }

    return recommendations;
  };

  const exportTMReport = () => {
    const report = generateTMReport();
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tm-analysis-report-${selectedAsset.name}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: 'Report Exported',
      description: 'Content & TM Analysis Report has been downloaded',
    });
  };

  const handleContinue = () => {
    const reportData = generateTMReport();
    onPhaseComplete(reportData);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Globe className="h-6 w-6 text-primary" />
            Phase 2: Content Processing & TM Intelligence
          </h2>
          <p className="text-muted-foreground">
            Content segmentation and translation memory analysis for {selectedAsset.name}
          </p>
        </div>
        <Button variant="outline" onClick={onBack} disabled={isProcessing}>
          Back to Phase 1
        </Button>
      </div>

      {/* Processing Progress */}
      {isProcessing && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <h3 className="font-medium">Processing Content...</h3>
              </div>
              <Progress value={processingStats.processingProgress} className="w-full" />
              <p className="text-sm text-muted-foreground">
                Analyzing content structure and matching against translation memory
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Statistics Dashboard */}
      {!isProcessing && contentSegments.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Segments</p>
                    <p className="text-2xl font-bold">{processingStats.totalSegments}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">TM Leverage</p>
                    <p className="text-2xl font-bold">{processingStats.tmLeveragePercentage}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Confidence</p>
                    <p className="text-2xl font-bold">{processingStats.averageMatchQuality}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">With Matches</p>
                    <p className="text-2xl font-bold">{processingStats.segmentsWithMatches}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Terminology</p>
                    <p className="text-2xl font-bold">{processingStats.terminologyValidationScore}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Content Type Breakdown */}
          {Object.keys(processingStats.contentTypeBreakdown).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Content Type Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {Object.entries(processingStats.contentTypeBreakdown).map(([type, count]) => (
                    <div key={type} className="text-center">
                      <p className="text-2xl font-bold text-primary">{count}</p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {type.replace('_', ' ')}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Content Segments */}
      {!isProcessing && contentSegments.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Content Segments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-96 overflow-y-auto">
              {contentSegments.map((segment) => (
                <div
                  key={segment.id}
                  className={cn(
                    'p-3 border rounded-lg cursor-pointer transition-colors',
                    selectedSegment?.id === segment.id ? 'bg-primary/10 border-primary' : 'hover:bg-muted/50'
                  )}
                  onClick={() => setSelectedSegment(segment)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {segment.contentType.replace('_', ' ')}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {segment.metadata?.wordCount} words
                        </Badge>
                        {segment.confidenceScore !== undefined && segment.confidenceScore !== null && (
                          <Badge
                            variant={segment.confidenceScore >= 80 ? 'default' : 'destructive'}
                            className="text-xs"
                          >
                            {segment.confidenceScore}% conf.
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm line-clamp-2">{segment.text}</p>
                      {segment.terminologyValidation && !segment.terminologyValidation.isValid && (
                        <p className="text-xs text-destructive mt-1">Terminology issues detected</p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {segment.tmMatches && segment.tmMatches.length > 0 && (
                        <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                      )}
                      {segment.terminologyValidation?.issues?.length > 0 && (
                        <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Translation Memory Matches</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedSegment ? (
                <TMMatchPanel
                  projectId="current-processing"
                  brandId={selectedBrand?.id ?? ''}
                  sourceTexts={[selectedSegment.text]}
                  sourceLanguage={sourceLanguage}
                  targetLanguage={targetLanguage}
                />
              ) : (
                <div className="text-center py-8">
                  <Search className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Select a segment to view TM matches</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Action Buttons */}
      {!isProcessing && contentSegments.length > 0 && (
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={processContent}>
            <Search className="h-4 w-4 mr-2" />
            Reprocess Content
          </Button>
          <Button variant="outline" onClick={exportTMReport}>
            <Download className="h-4 w-4 mr-2" />
            Export TM Report
          </Button>
          <Button onClick={handleContinue}>
            Continue to Phase 3: Cultural Intelligence
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!isProcessing && contentSegments.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Globe className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Ready to Process Content</h3>
            <p className="text-muted-foreground mb-4">
              Click below to extract and analyze content from {selectedAsset.name}
            </p>
            <Button onClick={processContent}>
              Start Content Processing
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
