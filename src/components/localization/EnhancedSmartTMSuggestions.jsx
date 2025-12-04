import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Globe, 
  Check, 
  Copy, 
  Star, 
  Clock,
  TrendingUp,
  RefreshCw,
  Zap,
  Target,
  ArrowRight,
  Info,
  AlertTriangle,
  Shield,
  Eye,
  FileText,
  Users,
  Brain,
  Search
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { EnhancedSmartTMEngine } from '@/services/EnhancedSmartTMEngine';
import { useToast } from '@/hooks/use-toast';

export const EnhancedSmartTMSuggestions = ({
  sourceText,
  sourceLanguage,
  targetLanguage,
  context,
  onApplySuggestion,
  onSegmentApply
}) => {
  const [searchResults, setSearchResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [activeSegment, setActiveSegment] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    if (sourceText && sourceText.trim().length > 0) {
      performEnhancedSearch();
    }
  }, [sourceText, sourceLanguage, targetLanguage, context]);

  const performEnhancedSearch = async () => {
    setIsLoading(true);
    try {
      const results = await EnhancedSmartTMEngine.enhancedTMSearch(
        sourceText,
        sourceLanguage,
        targetLanguage,
        context
      );
      setSearchResults(results);
    } catch (error) {
      console.error('Enhanced TM search failed:', error);
      toast({
        title: "Search Failed",
        description: "Failed to search translation memory",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getMatchQuality = (match) => {
    if (match.matchPercentage >= 100) return { label: 'Exact', color: 'text-green-600', variant: 'default' };
    if (match.matchPercentage >= 95) return { label: 'Near Perfect', color: 'text-green-500', variant: 'default' };
    if (match.matchPercentage >= 85) return { label: 'High', color: 'text-blue-600', variant: 'secondary' };
    if (match.matchPercentage >= 75) return { label: 'Good', color: 'text-yellow-600', variant: 'outline' };
    if (match.matchPercentage >= 50) return { label: 'Fair', color: 'text-orange-600', variant: 'outline' };
    return { label: 'Low', color: 'text-red-600', variant: 'destructive' };
  };

  const getContentTypeIcon = (contentType) => {
    switch (contentType) {
      case 'headline': return <FileText className="h-4 w-4 text-blue-500" />;
      case 'body': return <Users className="h-4 w-4 text-green-500" />;
      case 'cta': return <Target className="h-4 w-4 text-orange-500" />;
      case 'disclaimer': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'safety': return <Shield className="h-4 w-4 text-red-600" />;
      default: return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getValidationIcon = (flags) => {
    if (flags.brandTerminology && flags.regulatoryCompliance && flags.culturalSensitivity) {
      return <Check className="h-4 w-4 text-green-500" />;
    }
    if (!flags.regulatoryCompliance) {
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
    return <Eye className="h-4 w-4 text-yellow-500" />;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Text copied to clipboard",
      variant: "default"
    });
  };

  const handleApplySuggestion = (match) => {
    if (activeSegment && onSegmentApply) {
      onSegmentApply(activeSegment, match);
    } else {
      onApplySuggestion(match);
    }
    setSelectedMatch(null);
  };

  const renderSegmentAnalysis = () => {
    if (!searchResults?.segmentAnalysis.detectedSegments) return null;

    return (
      <div className="space-y-4">
        <h4 className="font-medium flex items-center gap-2">
          <Brain className="h-4 w-4" />
          Intelligent Content Segmentation
        </h4>
        
        <div className="grid gap-3">
          {searchResults.segmentAnalysis.detectedSegments.map((segment) => {
            const segmentMatches = searchResults.segmentAnalysis.segmentMatches.get(segment.id) || [];
            const bestMatch = segmentMatches[0];
            
            return (
              <Card 
                key={segment.id} 
                className={cn(
                  "cursor-pointer transition-colors",
                  activeSegment === segment.id && "border-primary bg-accent/50"
                )}
                onClick={() => setActiveSegment(activeSegment === segment.id ? null : segment.id)}
              >
                <CardContent className="p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getContentTypeIcon(segment.type)}
                      <span className="text-sm font-medium">{segment.type}</span>
                      <Badge variant={segment.importance === 'high' ? 'default' : 'outline'} className="text-xs">
                        {segment.importance}
                      </Badge>
                      {segment.editability === 'locked' && (
                        <Badge variant="destructive" className="text-xs">
                          <Shield className="h-3 w-3 mr-1" />
                          Locked
                        </Badge>
                      )}
                    </div>
                    
                    {bestMatch && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <span>{segmentMatches.length} matches</span>
                        <Badge variant="outline" className="text-xs">
                          {bestMatch.matchPercentage}%
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {segment.text}
                  </p>
                  
                  {bestMatch && (
                    <div className="text-xs bg-muted/50 rounded p-2">
                      <span className="font-medium">Best Match: </span>
                      <span>{bestMatch.targetText}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  const renderIntelligenceOverview = () => {
    if (!searchResults) return null;

    const { brandIntelligence, regulatoryIntelligence, culturalIntelligence } = searchResults;

    return (
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Brand Consistency</span>
              <Badge variant={brandIntelligence.consistencyScore >= 80 ? 'default' : 'outline'}>
                {brandIntelligence.consistencyScore}%
              </Badge>
            </div>
            <Progress value={brandIntelligence.consistencyScore} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {brandIntelligence.terminologyValidation.isValid ? 'Terminology validated' : 'Needs review'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Regulatory</span>
              <Badge variant={regulatoryIntelligence.complianceStatus === 'compliant' ? 'default' : 'destructive'}>
                {regulatoryIntelligence.complianceStatus}
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground">
              {regulatoryIntelligence.flaggedTerms.length > 0 && (
                <p>{regulatoryIntelligence.flaggedTerms.length} flagged terms</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Cultural Fit</span>
              <Badge variant={culturalIntelligence.appropriateness >= 70 ? 'default' : 'outline'}>
                {culturalIntelligence.appropriateness}%
              </Badge>
            </div>
            <Progress value={culturalIntelligence.appropriateness} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {culturalIntelligence.culturalRisks.length === 0 ? 'No risks detected' : `${culturalIntelligence.culturalRisks.length} risks`}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderMatchesList = (matches, title) => {
    return (
      <div className="space-y-3">
        <h4 className="font-medium">{title}</h4>
        {matches.map((match, index) => {
          const quality = getMatchQuality(match);
          const isSelected = selectedMatch?.id === match.id;
          
          return (
            <Card 
              key={match.id} 
              className={cn(
                "cursor-pointer transition-colors hover:bg-accent/50",
                isSelected && "border-primary bg-accent"
              )}
              onClick={() => setSelectedMatch(isSelected ? null : match)}
            >
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getContentTypeIcon(match.contentType)}
                    <Badge variant={quality.variant} className="text-xs">
                      {match.matchPercentage}% • {quality.label}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {match.brandConsistencyScore}% brand
                    </Badge>
                    {getValidationIcon(match.validationFlags)}
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(match.targetText);
                      }}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApplySuggestion(match);
                      }}
                    >
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    {match.targetText}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Source: {match.sourceText}
                  </p>
                </div>
                
                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {match.usageCount} uses
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(match.lastUsed).toLocaleDateString()}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {match.regulatoryStatus}
                  </Badge>
                </div>
                
                <div className="mt-2">
                  <Progress value={match.confidence} className="h-1" />
                  <span className="text-xs text-muted-foreground">Confidence: {match.confidence}%</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Enhanced Translation Memory Intelligence
          </h3>
          {isLoading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <RefreshCw className="h-4 w-4 animate-spin" />
              Analyzing...
            </div>
          )}
        </div>
        
        {searchResults && renderIntelligenceOverview()}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="h-4 bg-muted rounded w-24" />
                  <div className="h-6 bg-muted rounded w-16" />
                </div>
                <div className="h-3 bg-muted rounded w-full mb-2" />
                <div className="h-3 bg-muted rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : searchResults ? (
          <Tabs defaultValue="segments" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-4 mx-4 mt-4">
              <TabsTrigger value="segments">Segments</TabsTrigger>
              <TabsTrigger value="matches">All Matches</TabsTrigger>
              <TabsTrigger value="best">Best Matches</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
            </TabsList>
            
            <div className="flex-1 overflow-y-auto">
              <TabsContent value="segments" className="p-4 m-0">
                {renderSegmentAnalysis()}
                
                {activeSegment && (
                  <div className="mt-4">
                    <Separator className="mb-4" />
                    {(() => {
                      const segmentMatches = searchResults.segmentAnalysis.segmentMatches.get(activeSegment) || [];
                      console.log(`Rendering segment matches for ${activeSegment}: ${segmentMatches.length} matches`);
                      
                      if (segmentMatches.length > 0) {
                        return renderMatchesList(segmentMatches, "Segment Matches");
                      } else {
                        return (
                          <Card>
                            <CardContent className="p-4 text-center text-muted-foreground">
                              <div className="flex flex-col items-center gap-2">
                                <Search className="h-8 w-8" />
                                <p>No translation matches found for this segment</p>
                                <p className="text-sm">Try viewing "All Matches" for general translations</p>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      }
                    })()}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="matches" className="p-4 m-0">
                {renderMatchesList(searchResults.matches, "All Translation Matches")}
              </TabsContent>
              
              <TabsContent value="best" className="p-4 m-0">
                {renderMatchesList(searchResults.recommendations.bestMatches, "Recommended Matches")}
              </TabsContent>
              
              <TabsContent value="insights" className="p-4 m-0 space-y-4">
                {/* Regulatory Intelligence */}
                {searchResults.regulatoryIntelligence.flaggedTerms.length > 0 && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        Regulatory Compliance Issues
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {searchResults.regulatoryIntelligence.flaggedTerms.map((term, i) => (
                        <Badge key={i} variant="destructive" className="text-xs mr-2">
                          {term}
                        </Badge>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Cultural Intelligence */}
                {searchResults.culturalIntelligence.adaptationSuggestions.length > 0 && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Globe className="h-4 w-4 text-blue-500" />
                        Cultural Adaptation Suggestions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {searchResults.culturalIntelligence.adaptationSuggestions.map((suggestion, i) => (
                        <div key={i} className="text-xs bg-muted/50 rounded p-2">
                          <span className="font-medium">Consider: </span>
                          <span>{suggestion.suggestion}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Export Readiness */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Export Readiness Assessment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      {searchResults.recommendations.exportReadiness ? (
                        <Badge variant="default" className="text-xs">
                          <Check className="h-3 w-3 mr-1" />
                          Ready for Export
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Needs Review
                        </Badge>
                      )}
                    </div>
                    
                    {searchResults.recommendations.improvementActions.length > 0 && (
                      <div className="mt-2 space-y-1">
                        <span className="text-xs font-medium">Required Actions:</span>
                        {searchResults.recommendations.improvementActions.map((action, i) => (
                          <div key={i} className="text-xs text-muted-foreground">
                            • {action}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        ) : (
          <div className="p-4 text-center py-8 text-muted-foreground">
            <Brain className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No content to analyze</p>
            <p className="text-xs">Enter source text to see intelligent TM suggestions</p>
          </div>
        )}
      </div>

      {/* Actions */}
      {selectedMatch && (
        <div className="border-t p-4 bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <span className="font-medium">Selected:</span> {selectedMatch.matchPercentage}% match
              <div className="text-xs text-muted-foreground">
                Brand: {selectedMatch.brandConsistencyScore}% • Confidence: {selectedMatch.confidence}%
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedMatch(null)}>
                Cancel
              </Button>
              <Button size="sm" onClick={() => handleApplySuggestion(selectedMatch)}>
                <Check className="h-4 w-4 mr-1" />
                Apply Translation
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};