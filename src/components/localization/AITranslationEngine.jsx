import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Zap,
  Brain,
  Target,
  Clock,
  RefreshCw,
  Check,
  AlertTriangle,
  ArrowRight,
  Copy,
  Download,
  Users,
  Sparkles,
  Globe,
  FileText,
  BarChart3
} from 'lucide-react';
import { AITranslationEngine } from '@/services/AITranslationEngine';
import { useToast } from '@/hooks/use-toast';

export const AITranslationEngineComponent = ({
  sourceText,
  sourceLanguage,
  targetLanguage,
  context,
  onTranslationComplete,
  onBatchComplete
}) => {
  const [translationResult, setTranslationResult] = useState(null);
  const [batchResults, setBatchResults] = useState(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [selectedEngine, setSelectedEngine] = useState('auto');
  const [translationMode, setTranslationMode] = useState('single');
  const [analytics, setAnalytics] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    if (context.brandId) {
      loadAnalytics();
    }
  }, [context.brandId]);

  const loadAnalytics = async () => {
    try {
      const analyticsData = await AITranslationEngine.getTranslationAnalytics(context.brandId, 30);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    }
  };

  const handleSingleTranslation = async () => {
    if (!sourceText.trim()) {
      toast({
        title: "No Content",
        description: "Please provide text to translate",
        variant: "destructive"
      });
      return;
    }

    setIsTranslating(true);
    try {
      const request = {
        sourceText,
        sourceLanguage,
        targetLanguage,
        contentType: 'general',
        brandId: context.brandId,
        therapeuticArea: context.therapeuticArea,
        projectId: 'temp-project',
        assetId: 'temp-asset',
        preferredEngine: selectedEngine,
        includeConfidenceScoring: true
      };

      const result = await AITranslationEngine.translateSegment(request);
      setTranslationResult(result);
      
      if (onTranslationComplete) {
        onTranslationComplete(result);
      }

      toast({
        title: "Translation Complete",
        description: `${result.engine} translation with ${result.overallQualityScore}% quality score`,
      });

    } catch (error) {
      console.error('Translation failed:', error);
      toast({
        title: "Translation Failed",
        description: "Please try again or select a different engine",
        variant: "destructive"
      });
    } finally {
      setIsTranslating(false);
    }
  };

  const handleBatchTranslation = async () => {
    if (!sourceText.trim()) {
      toast({
        title: "No Content",
        description: "Please provide text to translate",
        variant: "destructive"
      });
      return;
    }

    setIsTranslating(true);
    try {
      // Intelligent segmentation for batch processing
      const segments = intelligentSegmentation(sourceText);
      
      const batchRequest = {
        segments,
        sourceLanguage,
        targetLanguage,
        brandId: context.brandId,
        therapeuticArea: context.therapeuticArea,
        projectId: 'temp-project',
        assetId: 'temp-asset'
      };

      const results = await AITranslationEngine.translateBatch(batchRequest);
      setBatchResults(results);
      
      if (onBatchComplete) {
        onBatchComplete(results);
      }

      toast({
        title: "Batch Translation Complete",
        description: `${results.summary.successfulTranslations}/${results.summary.totalSegments} segments translated successfully`,
      });

    } catch (error) {
      console.error('Batch translation failed:', error);
      toast({
        title: "Batch Translation Failed",
        description: "Please try again with smaller content sections",
        variant: "destructive"
      });
    } finally {
      setIsTranslating(false);
    }
  };

  const intelligentSegmentation = (text) => {
    // Split content into meaningful segments
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
    return sentences.map((sentence, index) => ({
      id: `segment_${index + 1}`,
      text: sentence.trim(),
      type: index === 0 ? 'headline' : 'body'
    }));
  };

  const getQualityBadge = (score) => {
    if (score >= 90) return { variant: 'default', label: 'Excellent', color: 'text-green-600' };
    if (score >= 75) return { variant: 'secondary', label: 'Good', color: 'text-blue-600' };
    if (score >= 50) return { variant: 'outline', label: 'Needs Review', color: 'text-yellow-600' };
    return { variant: 'destructive', label: 'Poor', color: 'text-red-600' };
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Translation copied to clipboard",
    });
  };

  const exportTranslation = async (format = 'xliff') => {
    if (!translationResult) return;

    const exportData = {
      sourceText,
      translatedText: translationResult.translatedText,
      sourceLanguage,
      targetLanguage,
      engine: translationResult.engine,
      qualityScore: translationResult.overallQualityScore,
      timestamp: new Date().toISOString()
    };

    const filename = `translation_${Date.now()}.${format}`;
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export Complete",
      description: `Translation exported as ${filename}`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header with Engine Selection */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            AI Translation Engine
          </h3>
          <p className="text-sm text-muted-foreground">
            Enterprise-grade pharmaceutical translation with multi-engine AI
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <select 
            value={selectedEngine} 
            onChange={(e) => setSelectedEngine(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm"
            disabled={isTranslating}
          >
            <option value="auto">Auto-Select Engine</option>
            <option value="gemini-pro">Gemini Pro (Medical)</option>
            <option value="deepl">DeepL (European)</option>
            <option value="google">Google Translate</option>
          </select>
        </div>
      </div>

      {/* Mode Selection */}
      <div className="flex items-center gap-4 p-4 bg-muted/20 rounded-lg">
        <span className="text-sm font-medium">Translation Mode:</span>
        <div className="flex items-center gap-2">
          <Button
            variant={translationMode === 'single' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTranslationMode('single')}
            disabled={isTranslating}
          >
            <Target className="h-4 w-4 mr-1" />
            Single Translation
          </Button>
          <Button
            variant={translationMode === 'batch' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTranslationMode('batch')}
            disabled={isTranslating}
          >
            <Brain className="h-4 w-4 mr-1" />
            Intelligent Batch
          </Button>
        </div>
      </div>

      {/* Translation Action */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-medium">Ready to Translate</h4>
              <p className="text-sm text-muted-foreground">
                {translationMode === 'single' 
                  ? 'Translate entire content as single segment'
                  : 'Automatically segment and translate for optimal quality'
                }
              </p>
            </div>
            
            <Button
              onClick={translationMode === 'single' ? handleSingleTranslation : handleBatchTranslation}
              disabled={isTranslating || !sourceText.trim()}
              className="flex items-center gap-2"
            >
              {isTranslating ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Translating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Start Translation
                </>
              )}
            </Button>
          </div>

          {isTranslating && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Brain className="h-4 w-4" />
                Processing with {selectedEngine === 'auto' ? 'optimal' : selectedEngine} engine...
              </div>
              <Progress value={undefined} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Tabs */}
      {(translationResult || batchResults) && (
        <Tabs defaultValue="translation" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="translation">Translation Results</TabsTrigger>
            <TabsTrigger value="quality">Quality Analysis</TabsTrigger>
            <TabsTrigger value="agency">Agency Handoff</TabsTrigger>
          </TabsList>

          <TabsContent value="translation" className="space-y-4">
            {translationResult && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-primary" />
                      Translation Result
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge {...getQualityBadge(translationResult.overallQualityScore)}>
                        {translationResult.overallQualityScore}%
                      </Badge>
                      <Badge variant="outline">
                        {translationResult.engine}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-muted/20 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-2">Translated Text:</div>
                    <p className="text-sm leading-relaxed">{translationResult.translatedText}</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {translationResult.processingTimeMs}ms
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        {translationResult.glossaryMatches.length} glossary matches
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(translationResult.translatedText)}
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => exportTranslation('xliff')}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Export
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {batchResults && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    Batch Translation Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-muted/20 rounded-lg">
                      <div className="text-2xl font-bold text-primary">{batchResults.summary.totalSegments}</div>
                      <div className="text-xs text-muted-foreground">Total Segments</div>
                    </div>
                    <div className="text-center p-3 bg-muted/20 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{batchResults.summary.successfulTranslations}</div>
                      <div className="text-xs text-muted-foreground">Successful</div>
                    </div>
                    <div className="text-center p-3 bg-muted/20 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{batchResults.summary.averageQualityScore}%</div>
                      <div className="text-xs text-muted-foreground">Avg Quality</div>
                    </div>
                    <div className="text-center p-3 bg-muted/20 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">{Math.round(batchResults.summary.totalProcessingTime / 1000)}s</div>
                      <div className="text-xs text-muted-foreground">Total Time</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {batchResults.results.map((result, index) => {
                      const quality = getQualityBadge(result.translation.overallQualityScore);
                      return (
                        <div key={result.segmentId} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <div className="text-sm font-medium mb-1">Segment {index + 1}</div>
                            <div className="text-xs text-muted-foreground line-clamp-1">
                              {result.translation.translatedText}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={quality.variant} className="text-xs">
                              {result.translation.overallQualityScore}%
                            </Badge>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(result.translation.translatedText)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="quality" className="space-y-4">
            {translationResult && (
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Quality Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Medical Accuracy</span>
                      <div className="flex items-center gap-2">
                        <Progress value={translationResult.medicalAccuracyScore} className="w-20 h-2" />
                        <span className="text-sm font-medium">{translationResult.medicalAccuracyScore}%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Brand Consistency</span>
                      <div className="flex items-center gap-2">
                        <Progress value={translationResult.brandConsistencyScore} className="w-20 h-2" />
                        <span className="text-sm font-medium">{translationResult.brandConsistencyScore}%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Cultural Adaptation</span>
                      <div className="flex items-center gap-2">
                        <Progress value={translationResult.culturalAdaptationScore} className="w-20 h-2" />
                        <span className="text-sm font-medium">{translationResult.culturalAdaptationScore}%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Regulatory Compliance</span>
                      <div className="flex items-center gap-2">
                        <Progress value={translationResult.regulatoryComplianceScore} className="w-20 h-2" />
                        <span className="text-sm font-medium">{translationResult.regulatoryComplianceScore}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Glossary Matches</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {translationResult.glossaryMatches.length > 0 ? (
                      translationResult.glossaryMatches.map((match, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span>{match.sourceTerm}</span>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {match.category}
                            </Badge>
                            {match.status === 'applied' ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <AlertTriangle className="h-4 w-4 text-yellow-500" />
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No glossary matches found</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {translationResult?.suggestions && translationResult.suggestions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">AI Suggestions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {translationResult.suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <ArrowRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="agency" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Agency Collaboration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Export translation for agency review and collaboration
                </p>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => exportTranslation('xliff')}
                    disabled={!translationResult}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export XLIFF
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => exportTranslation('tmx')}
                    disabled={!translationResult}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export TMX
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => exportTranslation('json')}
                    disabled={!translationResult}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export JSON
                  </Button>
                </div>

                {translationResult && (
                  <div className="mt-4 p-3 bg-muted/20 rounded-lg">
                    <h5 className="text-sm font-medium mb-2">Translation Summary for Agency</h5>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>• Engine Used: {translationResult.engine}</div>
                      <div>• Overall Quality: {translationResult.overallQualityScore}%</div>
                      <div>• Status: {translationResult.status}</div>
                      <div>• Processing Time: {translationResult.processingTimeMs}ms</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {analytics && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Performance Analytics (30 days)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-muted/20 rounded-lg">
                      <div className="text-lg font-bold text-primary">{analytics.totalTranslations}</div>
                      <div className="text-xs text-muted-foreground">Total Translations</div>
                    </div>
                    <div className="text-center p-3 bg-muted/20 rounded-lg">
                      <div className="text-lg font-bold text-green-600">{analytics.averageQualityScore}%</div>
                      <div className="text-xs text-muted-foreground">Average Quality</div>
                    </div>
                    <div className="text-center p-3 bg-muted/20 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">{Math.round(analytics.timeToMarketSavings / 60)}h</div>
                      <div className="text-xs text-muted-foreground">Time Saved</div>
                    </div>
                    <div className="text-center p-3 bg-muted/20 rounded-lg">
                      <div className="text-lg font-bold text-orange-600">${analytics.costSavings}</div>
                      <div className="text-xs text-muted-foreground">Cost Savings</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};