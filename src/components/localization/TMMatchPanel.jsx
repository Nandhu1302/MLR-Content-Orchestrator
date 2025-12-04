import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Database, 
  Search, 
  Copy,
  Star,
  Clock,
  RefreshCw,
  Plus,
  Lightbulb,
  TrendingUp
} from 'lucide-react';
import { useSmartTMMatching } from '@/hooks/useSmartTMMatching';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export const TMMatchPanel = ({
  projectId,
  brandId,
  sourceTexts,
  sourceLanguage,
  targetLanguage
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const { 
    matches, 
    searchResults,
    isLoading, 
    searchTM,
    getBestMatches
  } = useSmartTMMatching(brandId, sourceLanguage, targetLanguage);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      searchTM(searchQuery.trim());
    }
  };

  const handleGetMatches = () => {
    if (sourceTexts.length > 0) {
      getBestMatches(sourceTexts);
    }
  };

  const getMatchQuality = (percentage) => {
    if (percentage >= 100) return { label: 'Exact', color: 'default', variant: 'default' };
    if (percentage >= 95) return { label: 'Near Exact', color: 'text-green-600', variant: 'secondary' };
    if (percentage >= 85) return { label: 'High', color: 'text-blue-600', variant: 'secondary' };
    if (percentage >= 75) return { label: 'Good', color: 'text-yellow-600', variant: 'outline' };
    return { label: 'Low', color: 'text-red-600', variant: 'outline' };
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Database className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Translation Memory</h2>
            <p className="text-sm text-muted-foreground">
              Smart matching from {(sourceLanguage || 'EN').toUpperCase()} to {(targetLanguage || 'EN').toUpperCase()}
            </p>
          </div>
        </div>
        <Button 
          onClick={handleGetMatches}
          disabled={isLoading || sourceTexts.length === 0}
          size="sm"
        >
          {isLoading ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Search className="h-4 w-4 mr-2" />
          )}
          Find Matches
        </Button>
      </div>

      {/* Search Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search Translation Memory
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Enter text to search for translations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={!searchQuery.trim() || isLoading}>
              {isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-y-4 flex-col">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                Searching translation memory...
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Results */}
      {searchResults && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Search Results</span>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Database className="h-4 w-4" />
                <span>{searchResults.matches.length} matches found</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {searchResults.matches.length > 0 ? (
              <div className="space-y-4">
                {/* Statistics */}
                <div className="grid grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-primary">{searchResults.statistics?.exactMatches || 0}</div>
                    <div className="text-xs text-muted-foreground">Exact Matches</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-secondary">{searchResults.statistics?.fuzzyMatches || 0}</div>
                    <div className="text-xs text-muted-foreground">Fuzzy Matches</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-accent">{searchResults.statistics?.semanticMatches || 0}</div>
                    <div className="text-xs text-muted-foreground">Semantic Matches</div>
                  </div>
                </div>

                {/* Match Results */}
                <div className="space-y-3">
                  {searchResults.matches.map((match, index) => {
                    const quality = getMatchQuality(match.matchPercentage);
                    return (
                      <div key={index} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-2">
                            <div className="text-sm">
                              <span className="text-muted-foreground">Source:</span>
                              <p className="mt-1 font-medium">{match.sourceText}</p>
                            </div>
                            <div className="text-sm">
                              <span className="text-muted-foreground">Target:</span>
                              <p className="mt-1">{match.targetText}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => copyToClipboard(match.targetText)}
                                  >
                                    <Copy className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Copy translation</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Badge variant={quality.variant}>
                              {match.matchPercentage}% {quality.label}
                            </Badge>
                            {match.quality && (
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 text-yellow-500" />
                                <span className="text-xs text-muted-foreground">
                                  Quality: {match.quality}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            {match.lastUsed && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>Used {new Date(match.lastUsed).toLocaleDateString()}</span>
                              </div>
                            )}
                            {match.usageCount && (
                              <div className="flex items-center gap-1">
                                <TrendingUp className="h-3 w-3" />
                                <span>{match.usageCount} uses</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {match.contextMetadata && (
                          <div className="text-xs text-muted-foreground">
                            <strong>Context:</strong> {JSON.stringify(match.contextMetadata)}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Recommendations */}
                {searchResults.recommendations && searchResults.recommendations.improvementSuggestions && (
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-2">
                        <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-blue-900">Recommendations</p>
                          {searchResults.recommendations.improvementSuggestions.map((rec, index) => (
                            <p key={index} className="text-sm text-blue-800">{rec}</p>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium text-muted-foreground">No matches found</h3>
                <p className="text-sm text-muted-foreground">
                  Try different search terms or add this content to the translation memory
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Best Matches for Project Content */}
      {matches && Object.keys(matches).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Best Matches for Project Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(matches).map(([sourceText, matchList], index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="space-y-3">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Source:</span>
                      <p className="mt-1 font-medium">{sourceText}</p>
                    </div>
                    
                    {matchList.length > 0 ? (
                      <div className="space-y-2">
                        <span className="text-sm text-muted-foreground">Top Matches:</span>
                        {matchList.slice(0, 3).map((match, matchIndex) => {
                          const quality = getMatchQuality(match.matchPercentage);
                          return (
                            <div key={matchIndex} className="bg-muted/30 rounded p-3">
                              <div className="flex justify-between items-start mb-2">
                                <p className="text-sm">{match.targetText}</p>
                                <Badge variant={quality.variant} className="text-xs">
                                  {match.matchPercentage}%
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                {match.quality && (
                                  <div className="flex items-center gap-1">
                                    <Star className="h-3 w-3 text-yellow-500" />
                                    <span>Quality: {match.quality}</span>
                                  </div>
                                )}
                                {match.domainCategory && (
                                  <Badge variant="outline" className="text-xs">
                                    {match.domainCategory}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          );
                        })}
                        {matchList.length > 3 && (
                          <p className="text-xs text-muted-foreground text-center">
                            +{matchList.length - 3} more matches available
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-sm text-muted-foreground">No matches found</p>
                        <Button size="sm" variant="outline" className="mt-2">
                          <Plus className="h-3 w-3 mr-1" />
                          Add to TM
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!matches && !searchResults && !isLoading && (
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <Database className="h-12 w-12 text-muted-foreground mx-auto" />
              <div>
                <h3 className="font-medium">Translation Memory</h3>
                <p className="text-sm text-muted-foreground">
                  Search for existing translations or find matches for your content
                </p>
              </div>
              <div className="flex justify-center gap-2">
                <Button variant="outline" onClick={() => setSearchQuery('Sample text')}>
                  <Search className="h-4 w-4 mr-2" />
                  Try Search
                </Button>
                {sourceTexts.length > 0 && (
                  <Button onClick={handleGetMatches}>
                    <Database className="h-4 w-4 mr-2" />
                    Find Matches
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};