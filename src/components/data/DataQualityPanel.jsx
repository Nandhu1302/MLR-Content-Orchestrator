import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Clock, TrendingUp } from 'lucide-react';

export const DataQualityPanel = ({ quality, isLoading }) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Data Quality Assessment</CardTitle>
          <CardDescription>Calculating quality metrics...</CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={50} className="animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  if (!quality) return null;

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score) => {
    if (score >= 80) return <Badge variant="default" className="bg-green-600">Excellent</Badge>;
    if (score >= 50) return <Badge variant="secondary">Good</Badge>;
    return <Badge variant="destructive">Needs Improvement</Badge>;
  };

  const formatScore = (score) => `${Math.round(score)}%`;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Data Quality Assessment</CardTitle>
            <CardDescription>Multi-dimensional data health metrics</CardDescription>
          </div>
          {getScoreBadge(quality.overallScore)}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Score */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Overall Quality Score</span>
            <span className={`text-2xl font-bold ${getScoreColor(quality.overallScore)}`}>
              {formatScore(quality.overallScore)}
            </span>
          </div>
          <Progress value={quality.overallScore} className="h-3" />
        </div>

        {/* Individual Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Volume */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Data Volume</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {quality.volume.count.toLocaleString()} records
              </span>
              <span className={`text-sm font-semibold ${getScoreColor(quality.volume.score)}`}>
                {formatScore(quality.volume.score)}
              </span>
            </div>
            <Progress value={quality.volume.score} className="h-2" />
          </div>

          {/* Recency */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Data Recency</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Latest: {new Date(quality.recency.latestDate).toLocaleDateString()}
              </span>
              <span className={`text-sm font-semibold ${getScoreColor(quality.recency.score)}`}>
                {formatScore(quality.recency.score)}
              </span>
            </div>
            <Progress value={quality.recency.score} className="h-2" />
          </div>

          {/* Coverage */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Dimensional Coverage</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {quality.coverage.dimensions.length} dimensions tracked
              </span>
              <span className={`text-sm font-semibold ${getScoreColor(quality.coverage.score)}`}>
                {formatScore(quality.coverage.score)}
              </span>
            </div>
            <Progress value={quality.coverage.score} className="h-2" />
          </div>

          {/* Diversity */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Data Diversity</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {quality.diversity.uniqueValues} unique variations
              </span>
              <span className={`text-sm font-semibold ${getScoreColor(quality.diversity.score)}`}>
                {formatScore(quality.diversity.score)}
              </span>
            </div>
            <Progress value={quality.diversity.score} className="h-2" />
          </div>
        </div>

        {/* Recommendations */}
        {quality.overallScore < 0.8 && (
          <div className="pt-4 border-t">
            <h4 className="text-sm font-semibold mb-2">Improvement Recommendations</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              {quality.volume.score < 0.8 && (
                <li>• Ingest more data to improve statistical significance</li>
              )}
              {quality.recency.score < 0.8 && (
                <li>• Refresh data sources to get more recent insights</li>
              )}
              {quality.coverage.score < 0.8 && (
                <li>• Add data for underrepresented dimensions (regions, indications)</li>
              )}
              {quality.diversity.score < 0.8 && (
                <li>• Expand data collection to capture more variation</li>
              )}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};