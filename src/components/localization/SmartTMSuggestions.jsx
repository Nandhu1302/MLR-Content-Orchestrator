
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
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
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function SmartTMSuggestions({ segment, searchResults, isLoading, onApplySuggestion }) {
  const [selectedMatch, setSelectedMatch] = useState(null);

  const getMatchQuality = (percentage) => {
    if (percentage >= 100) return { label: 'Exact', color: 'text-green-600', variant: 'default' };
    if (percentage >= 95) return { label: 'Near Perfect', color: 'text-green-500', variant: 'default' };
    if (percentage >= 85) return { label: 'High', color: 'text-blue-600', variant: 'secondary' };
    if (percentage >= 75) return { label: 'Good', color: 'text-yellow-600', variant: 'outline' };
    if (percentage >= 50) return { label: 'Fair', color: 'text-orange-600', variant: 'outline' };
    return { label: 'Low', color: 'text-red-600', variant: 'destructive' };
  };

  const getMatchTypeIcon = (percentage) => {
    if (percentage >= 100) return <Star className="h-4 w-4 text-yellow-500" />;
    if (percentage >= 85) return <Target className="h-4 w-4 text-blue-500" />;
    if (percentage >= 75) return <TrendingUp className="h-4 w-4 text-green-500" />;
    return <Zap className="h-4 w-4 text-orange-500" />;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handleApplySuggestion = (match) => {
    onApplySuggestion(match);
    setSelectedMatch(null);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Translation Memory
          </h3>
          {isLoading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <RefreshCw className="h-4 w-4 animate-spin" />
              Searching...
            </div>
          )}
        </div>

        {searchResults?.statistics && (
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-sm font-medium">{searchResults.statistics.exactMatches}</div>
              <div className="text-xs text-muted-foreground">Exact</div>
            </div>
            <div>
              <div className="text-sm font-medium">{searchResults.statistics.fuzzyMatches}</div>
              <div className="text-xs text-muted-foreground">Fuzzy</div>
            </div>
            <div>
              <div className="text-sm font-medium">{searchResults.statistics.semanticMatches}</div>
              <div className="text-xs text-muted-foreground">Semantic</div>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 space-y-4">
            {[1, 2, 3].map((i) => (
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
        ) : searchResults?.matches && searchResults.matches.length > 0 ? (
          <div className="p-4 space-y-3">
            {/* Best Match Highlight */}
            {searchResults.recommendations?.bestMatch && (
              <>
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    Best Match
                  </h4>
                  <div className="border-2 border-yellow-200 bg-yellow-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <Badge
                        variant={getMatchQuality(searchResults.recommendations.bestMatch.matchPercentage).variant}
                        className="text-xs"
                      >
                        {searchResults.recommendations.bestMatch.matchPercentage}% Match
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(searchResults.recommendations.bestMatch.targetText)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleApplySuggestion(searchResults.recommendations.bestMatch)}
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Apply
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm mb-1 font-medium">
                      {searchResults.recommendations.bestMatch.targetText}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Source: {searchResults.recommendations.bestMatch.sourceText}
                    </p>
                    {searchResults.recommendations.bestMatch.domainCategory && (
                      <div className="flex items-center gap-1 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {searchResults.recommendations.bestMatch.domainCategory}
                        </Badge>
                        {searchResults.recommendations.bestMatch.usageCount && (
                          <span className="text-xs text-muted-foreground">
                            Used {searchResults.recommendations.bestMatch.usageCount} times
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <Separator />
              </>
            )}

            {/* All Matches */}
            <h4 className="text-sm font-medium mb-2">All Matches</h4>
            {searchResults.matches.map((match, index) => {
              const quality = getMatchQuality(match.matchPercentage);
              const isSelected = selectedMatch?.sourceText === match.sourceText;

              return (
                <div
                  key={index}
                  className={cn(
                    "border rounded-lg p-3 cursor-pointer transition-colors hover:bg-accent/50",
                    isSelected && "border-primary bg-accent"
                  )}
                  onClick={() => setSelectedMatch(isSelected ? null : match)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getMatchTypeIcon(match.matchPercentage)}
                      <Badge variant={quality.variant} className="text-xs">
                        {match.matchPercentage}% • {quality.label}
                      </Badge>
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
                    <p className="text-sm font-medium">{match.targetText}</p>
                    <p className="text-xs text-muted-foreground">Source: {match.sourceText}</p>
                  </div>

                  {(match.domainCategory || match.usageCount || match.lastUsed) && (
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      {match.domainCategory && (
                        <Badge variant="outline" className="text-xs">
                          {match.domainCategory}
                        </Badge>
                      )}
                      {match.usageCount && (
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          {match.usageCount} uses
                        </div>
                      )}
                      {match.lastUsed && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(match.lastUsed).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  )}

                  {match.matchPercentage < 100 && (
                    <div className="mt-2">
                      <Progress value={match.matchPercentage} className="h-1" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Improvement Suggestions */}
            {searchResults.recommendations?.improvementSuggestions &&
              searchResults.recommendations.improvementSuggestions.length > 0 && (
                <>
                  <Separator />
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Info className="h-4 w-4 text-blue-500" />
                      Suggestions
                    </h4>
                    <div className="space-y-2">
                      {searchResults.recommendations.improvementSuggestions.map((suggestion, index) => (
                        <div key={index} className="text-xs text-muted-foreground bg-muted/50 rounded p-2">
                          💡 {suggestion}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
          </div>
        ) : !isLoading && (
          <div className="p-4 text-center py-8 text-muted-foreground">
            <Globe className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No translation memory matches found</p>
            <p className="text-xs">Try adjusting the source text or check the TM database</p>
          </div>
        )}
      </div>

      {/* Actions */}
      {selectedMatch && (
        <div className="border-t p-4 bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <span className="font-medium">Selected:</span> {selectedMatch.matchPercentage}% match
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
}
