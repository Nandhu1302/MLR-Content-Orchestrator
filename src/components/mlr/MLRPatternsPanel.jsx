import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { 
  TrendingDown, 
  CheckCircle,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { getSeverityIconWithRate, getSeverityColor } from "./utils/mlrHelpers";
// Removed type import: import type { MLRPattern, ContentMatch } from "./types/mlrTypes";

// Removed interface MLRPatternsPanelProps

export const MLRPatternsPanel = ({ 
  content,
  onPatternDetected
}) => { // Removed : MLRPatternsPanelProps
  // Removed <MLRPattern[]> type annotation
  const [patterns, setPatterns] = useState([]);
  // Removed <ContentMatch[]> type annotation
  const [contentMatches, setContentMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // Removed <string | null> type annotation
  const [expandedPattern, setExpandedPattern] = useState(null);

  useEffect(() => {
    loadPatterns();
  }, []);

  useEffect(() => {
    if (patterns.length > 0 && content) {
      detectPatterns();
    }
  }, [content, patterns]);

  const loadPatterns = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('mlr_decision_patterns')
        .select('*')
        .order('approval_rate', { ascending: true });

      if (error) throw error;
      setPatterns(data || []);

    } catch (error) {
      console.error('Error loading MLR patterns:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const detectPatterns = () => {
    const contentLower = content.toLowerCase();
    // Removed : ContentMatch[] type annotation
    const matches = [];

    patterns.forEach(pattern => {
      // Removed : string[] type annotation
      const matchedKeywords = [];
      // Removed : number[] type annotation
      const locations = [];

      pattern.detection_keywords?.forEach(keyword => {
        const keywordLower = keyword.toLowerCase();
        let index = contentLower.indexOf(keywordLower);
        while (index !== -1) {
          matchedKeywords.push(keyword);
          locations.push(index);
          index = contentLower.indexOf(keywordLower, index + 1);
        }
      });

      if (matchedKeywords.length > 0) {
        matches.push({
          pattern,
          // FIX: Corrected spread syntax for array literal
          matchedKeywords: [...new Set(matchedKeywords)],
          locations
        });
      }
    });

    // Sort by severity and approval rate
    matches.sort((a, b) => {
      // Removed : keyof typeof severityOrder type assertion
      const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      const sevA = severityOrder[a.pattern.severity] ?? 4;
      const sevB = severityOrder[b.pattern.severity] ?? 4;
      if (sevA !== sevB) return sevA - sevB;
      return a.pattern.approval_rate - b.pattern.approval_rate;
    });

    setContentMatches(matches);
    onPatternDetected?.(matches);
  };

  // Using shared utilities from mlrHelpers

  const criticalMatches = contentMatches.filter(m => m.pattern.approval_rate < 10);
  const warningMatches = contentMatches.filter(m => m.pattern.approval_rate >= 10 && m.pattern.approval_rate < 50);

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <TrendingDown className="h-4 w-4" />
            MLR Pattern Detection
          </h3>
          {isLoading && <Badge variant="outline" className="text-xs">Loading...</Badge>}
        </div>
        
        {contentMatches.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {criticalMatches.length > 0 && (
              <Badge variant="destructive" className="text-xs">
                {criticalMatches.length} High Risk
              </Badge>
            )}
            {warningMatches.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {warningMatches.length} Warnings
              </Badge>
            )}
            {contentMatches.length === 0 && (
              <Badge variant="default" className="text-xs">
                No patterns detected
              </Badge>
            )}
          </div>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {isLoading ? (
            <div className="text-center py-8">
              <TrendingDown className="h-8 w-8 text-muted-foreground mx-auto mb-2 animate-pulse" />
              <p className="text-sm text-muted-foreground">Analyzing patterns...</p>
            </div>
          ) : contentMatches.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No risky patterns detected</p>
              <p className="text-xs text-muted-foreground mt-1">
                Content appears to follow MLR guidelines
              </p>
            </div>
          ) : (
            contentMatches.map((match) => (
              <Card 
                key={match.pattern.id}
                className={`cursor-pointer transition-all ${
                  match.pattern.approval_rate < 10 ? 'border-destructive/50 bg-destructive/5' : ''
                }`}
                onClick={() => setExpandedPattern(
                  expandedPattern === match.pattern.id ? null : match.pattern.id
                )}
              >
                <CardHeader className="pb-2 pt-3 px-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {getSeverityIconWithRate(match.pattern.severity, match.pattern.approval_rate)}
                      <div>
                        <p className="text-sm font-medium">{match.pattern.pattern_name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={getSeverityColor(match.pattern.severity)} className="text-xs">
                            {match.pattern.pattern_type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {match.pattern.approval_rate}% approval rate
                          </span>
                        </div>
                      </div>
                    </div>
                    {expandedPattern === match.pattern.id ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0 px-3 pb-3">
                  <div className="space-y-2">
                    {/* Approval rate visualization */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Historical Approval</span>
                        <span className={match.pattern.approval_rate < 30 ? 'text-destructive' : ''}>
                          {match.pattern.approval_rate}%
                        </span>
                      </div>
                      <Progress 
                        value={match.pattern.approval_rate} 
                        className={`h-1.5 ${match.pattern.approval_rate < 30 ? '[&>div]:bg-destructive' : ''}`}
                      />
                    </div>

                    {/* Matched keywords */}
                    <div className="flex flex-wrap gap-1">
                      {match.matchedKeywords.slice(0, 4).map((kw, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          "{kw}"
                        </Badge>
                      ))}
                      {match.matchedKeywords.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{match.matchedKeywords.length - 4} more
                        </Badge>
                      )}
                    </div>

                    {/* Expanded details */}
                    {expandedPattern === match.pattern.id && (
                      <div className="pt-2 border-t space-y-2">
                        {match.pattern.common_feedback && (
                          <div>
                            <p className="text-xs font-medium text-muted-foreground">Common Feedback:</p>
                            <p className="text-xs">{match.pattern.common_feedback}</p>
                          </div>
                        )}
                        
                        {match.pattern.suggested_alternative && (
                          <div>
                            <p className="text-xs font-medium text-muted-foreground">Suggested Fix:</p>
                            <p className="text-xs bg-green-50 dark:bg-green-950 p-2 rounded border border-green-200 dark:border-green-800">
                              {match.pattern.suggested_alternative}
                            </p>
                          </div>
                        )}

                        <div className="flex gap-4 text-xs text-muted-foreground pt-1">
                          <span>✓ {match.pattern.approval_count} approved</span>
                          <span>✗ {match.pattern.rejection_count} rejected</span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};