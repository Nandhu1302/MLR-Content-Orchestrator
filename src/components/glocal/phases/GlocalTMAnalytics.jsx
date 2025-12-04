// Pure GLOCAL TM Analytics Component
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Database, 
  TrendingUp, 
  DollarSign, 
  Target,
  CheckCircle,
  AlertCircle,
  Globe,
  Zap
} from 'lucide-react';

export const GlocalTMAnalytics = ({
  data,
  targetMarket,
  therapeuticArea,
  allSegmentsComplete = false
}) => {
  // Gate: Only show analytics after all segments are complete
  if (!allSegmentsComplete) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="max-w-md">
          <CardContent className="text-center py-12 px-6">
            <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <CardTitle className="text-lg mb-2">TM Leverage Overview Locked</CardTitle>
            <CardDescription>
              Complete all segment translations to view comprehensive TM analytics and leverage metrics.
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    );
  }
  const getLeverageColor = (rate) => {
    if (rate >= 80) return 'text-green-500';
    if (rate >= 60) return 'text-blue-500';
    if (rate >= 40) return 'text-yellow-500';
    return 'text-orange-500';
  };

  const getMatchTypeColor = (type) => {
    switch (type) {
      case 'exact': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'fuzzy': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'none': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Stats */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Database className="h-5 w-5" />
            TM Leverage Overview
          </CardTitle>
          <CardDescription className="text-xs">
            Translation Memory intelligence for {targetMarket || 'target market'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Leverage Rate */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Leverage Rate</span>
              <span className={`text-2xl font-bold ${getLeverageColor(data.leverageRate)}`}>
                {data.leverageRate.toFixed(0)}%
              </span>
            </div>
            <Progress value={data.leverageRate} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {data.exactMatches + data.fuzzyMatches} of {data.totalSegments} segments have TM matches
            </p>
          </div>

          {/* Match Breakdown */}
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-3 bg-green-500/5 rounded-lg border border-green-500/20">
              <CheckCircle className="h-4 w-4 text-green-500 mx-auto mb-1" />
              <p className="text-lg font-bold text-green-500">{data.exactMatches}</p>
              <p className="text-xs text-muted-foreground">Exact</p>
            </div>
            <div className="text-center p-3 bg-blue-500/5 rounded-lg border border-blue-500/20">
              <Target className="h-4 w-4 text-blue-500 mx-auto mb-1" />
              <p className="text-lg font-bold text-blue-500">{data.fuzzyMatches}</p>
              <p className="text-xs text-muted-foreground">Fuzzy</p>
            </div>
            <div className="text-center p-3 bg-orange-500/5 rounded-lg border border-orange-500/20">
              <AlertCircle className="h-4 w-4 text-orange-500 mx-auto mb-1" />
              <p className="text-lg font-bold text-orange-500">{data.noMatches}</p>
              <p className="text-xs text-muted-foreground">New</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cost Savings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Estimated Cost Savings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-500">
              ${data.totalCostSavings.toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Saved through TM leverage vs. new translation
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quality Metrics */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Quality Metrics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Avg Match Score</span>
              <span className="text-sm font-semibold">{data.avgMatchScore.toFixed(0)}%</span>
            </div>
            <Progress value={data.avgMatchScore} className="h-1.5" />
          </div>

          {therapeuticArea && (
            <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium">Therapeutic Area Matches</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {data.therapeuticAreaMatches}
              </Badge>
            </div>
          )}

          <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium">Cultural Adaptations</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {data.culturalAdaptations}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-xs">
            {data.leverageRate >= 80 && (
              <div className="flex gap-2 text-green-600">
                <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <p>Excellent TM leverage - significant cost savings achieved</p>
              </div>
            )}
            {data.leverageRate < 60 && (
              <div className="flex gap-2 text-orange-600">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <p>Lower TM leverage - consider human review for consistency</p>
              </div>
            )}
            {data.noMatches > data.totalSegments * 0.4 && (
              <div className="flex gap-2 text-blue-600">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <p>Many new segments - good opportunity to build TM for future projects</p>
              </div>
            )}
            {therapeuticArea && data.therapeuticAreaMatches > data.totalSegments * 0.7 && (
              <div className="flex gap-2 text-green-600">
                <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <p>Strong therapeutic area alignment with existing TM</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};