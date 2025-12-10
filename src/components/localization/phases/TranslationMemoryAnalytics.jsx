
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Database, TrendingUp, Clock, Target } from 'lucide-react';

export const TranslationMemoryAnalytics = ({
  sourceWordCount,
  segmentUsage,
  targetLanguage
}) => {
  // Calculate statistics based on actual segment TM usage
  // Only count words from segments that actually used TM (matchPercentage >= 70)
  const matchedWords = segmentUsage
    .filter(seg => seg.matchPercentage >= 70)
    .reduce((sum, seg) => sum + seg.wordCount, 0);
  const newWords = segmentUsage
    .filter(seg => seg.matchPercentage < 70)
    .reduce((sum, seg) => sum + seg.wordCount, 0);
  const leveragePercentage = sourceWordCount > 0 ? (matchedWords / sourceWordCount) * 100 : 0;

  // Group segments by match quality
  const exactMatches = segmentUsage.filter(m => m.matchPercentage >= 95);
  const fuzzyMatches = segmentUsage.filter(m => m.matchPercentage >= 75 && m.matchPercentage < 95);
  const contextMatches = segmentUsage.filter(m => m.matchPercentage >= 50 && m.matchPercentage < 75);
  const noMatches = segmentUsage.filter(m => m.matchPercentage < 50);

  const exactWords = exactMatches.reduce((sum, seg) => sum + seg.wordCount, 0);
  const fuzzyWords = fuzzyMatches.reduce((sum, seg) => sum + seg.wordCount, 0);
  const contextWords = contextMatches.reduce((sum, seg) => sum + seg.wordCount, 0);
  const newContentWords = noMatches.reduce((sum, seg) => sum + seg.wordCount, 0);

  // Calculate estimated savings
  const estimatedSavings = {
    time: Math.round((leveragePercentage / 100) * 8), // Assume 8 hours base translation time
    cost: Math.round((leveragePercentage / 100) * 500) // Assume $500 base cost
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Translation Memory Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center space-y-1">
            <div className="text-2xl font-bold text-primary">{sourceWordCount}</div>
            <div className="text-sm text-muted-foreground">Source Words</div>
          </div>
          <div className="text-center space-y-1">
            <div className="text-2xl font-bold text-success">{matchedWords}</div>
            <div className="text-sm text-muted-foreground">TM Matched</div>
          </div>
          <div className="text-center space-y-1">
            <div className="text-2xl font-bold text-warning">{newWords}</div>
            <div className="text-sm text-muted-foreground">New Words</div>
          </div>
          <div className="text-center space-y-1">
            <div className="text-2xl font-bold text-accent">{Math.round(leveragePercentage)}%</div>
            <div className="text-sm text-muted-foreground">TM Leverage</div>
          </div>
        </div>

        {/* Leverage Progress */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Translation Memory Leverage</span>
            <span className="text-sm text-muted-foreground">{Math.round(leveragePercentage)}%</span>
          </div>
          <Progress value={leveragePercentage} className="h-2" />
          <div className="text-xs text-muted-foreground">
            Higher leverage means lower translation costs and faster delivery
          </div>
        </div>

        {/* Match Quality Breakdown */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Match Quality Distribution</h4>
          <div className="space-y-3">
            {/* Exact Matches */}
            <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
              <div className="flex items-center gap-3">
                <Badge className="bg-success text-success-foreground">95-100%</Badge>
                <div>
                  <div className="font-medium text-sm">Exact Matches</div>
                  <div className="text-xs text-muted-foreground">Ready to use</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold">{exactWords}</div>
                <div className="text-xs text-muted-foreground">words</div>
              </div>
            </div>

            {/* Fuzzy Matches */}
            <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
              <div className="flex items-center gap-3">
                <Badge className="bg-primary text-primary-foreground">75-94%</Badge>
                <div>
                  <div className="font-medium text-sm">Fuzzy Matches</div>
                  <div className="text-xs text-muted-foreground">Minor editing needed</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold">{fuzzyWords}</div>
                <div className="text-xs text-muted-foreground">words</div>
              </div>
            </div>

            {/* Context Matches */}
            <div className="flex items-center justify-between p-3 bg-warning/10 rounded-lg">
              <div className="flex items-center gap-3">
                <Badge className="bg-warning text-warning-foreground">50-74%</Badge>
                <div>
                  <div className="font-medium text-sm">Context Matches</div>
                  <div className="text-xs text-muted-foreground">Reference material</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold">{contextWords}</div>
                <div className="text-xs text-muted-foreground">words</div>
              </div>
            </div>

            {/* New Content */}
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <Badge variant="outline">0-49%</Badge>
                <div>
                  <div className="font-medium text-sm">New Content</div>
                  <div className="text-xs text-muted-foreground">Fresh translation required</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold">{newContentWords}</div>
                <div className="text-xs text-muted-foreground">words</div>
              </div>
            </div>
          </div>
        </div>

        {/* Estimated Savings */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Estimated Project Savings</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-accent/10 rounded-lg">
              <Clock className="h-8 w-8 text-accent" />
              <div>
                <div className="font-bold text-lg">{estimatedSavings.time}h</div>
                <div className="text-xs text-muted-foreground">Time Saved</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg">
              <TrendingUp className="h-8 w-8 text-primary" />
              <div>
                <div className="font-bold text-lg">${estimatedSavings.cost}</div>
                <div className="text-xs text-muted-foreground">Cost Savings</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quality Insights */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium text-sm mb-2">Quality Insights</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            {leveragePercentage > 70 && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                Excellent TM leverage - significant cost and time savings expected
              </div>
            )}
            {leveragePercentage > 40 && leveragePercentage <= 70 && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                Good TM coverage - moderate savings with quality improvements
              </div>
            )}
            {leveragePercentage <= 40 && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-warning rounded-full"></div>
                Lower TM leverage - opportunity to build memory for future projects
              </div>
            )}
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              Target Language: {targetLanguage.toUpperCase()} - ensure cultural adaptation
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
