import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Target, Zap } from 'lucide-react';

export const PerformanceTab = ({
  intelligence,
  crossChannelInsights,
  performancePrediction,
}) => {
  const successPatterns = intelligence?.successPatterns || [];

  return (
    <div className="space-y-6">
      {/* Performance Prediction */}
      {performancePrediction && (
        <Card className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <div className="flex items-start gap-3 mb-3">
            <Target className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-semibold text-lg mb-1">Performance Prediction</h3>
              <p className="text-sm text-muted-foreground">Based on similar campaigns</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Expected Engagement</p>
              <p className="text-2xl font-bold text-primary">
                {performancePrediction.predictedEngagementRate || '23%'}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Confidence</p>
              <p className="text-2xl font-bold">
                {performancePrediction.confidence || '87%'}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Cross-Channel Insights */}
      {crossChannelInsights && (
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Cross-Channel Insights
          </h3>
          <Card className="p-4">
            <p className="text-sm mb-3">{crossChannelInsights.summary}</p>
            {crossChannelInsights.recommendations && (
              <div className="space-y-2">
                {crossChannelInsights.recommendations.map((rec, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm">
                    <Badge variant="secondary" className="mt-0.5">{idx + 1}</Badge>
                    <p>{rec}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Success Patterns */}
      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Success Patterns
        </h3>
        <div className="space-y-3">
          {successPatterns.length === 0 ? (
            <p className="text-sm text-muted-foreground">No success patterns available</p>
          ) : (
            successPatterns.map((pattern, idx) => (
              <Card key={idx} className="p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <p className="text-sm font-medium">{pattern.campaign_type}</p>
                  <Badge variant="secondary" className="gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {Math.round(pattern.success_rate * 100)}% success
                  </Badge>
                </div>
                <div className="space-y-2 mb-2">
                  <p className="text-xs text-muted-foreground">Key Success Factors:</p>
                  <div className="flex flex-wrap gap-1">
                    {pattern.key_success_factors.map((factor, i) => (
                      <Badge key={i} variant="outline" className="text-xs">{factor}</Badge>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 text-xs text-muted-foreground">
                  <span>Sample: {pattern.sample_size}</span>
                  <span>•</span>
                  <span>Avg Engagement: {Math.round(pattern.avg_engagement_rate * 100)}%</span>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};