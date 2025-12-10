
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, Users, Target, BarChart3 } from "lucide-react";
import { useDataIntelligence } from "@/hooks/useDataIntelligence";

function DataAnalysisPreview({ brandId, filters }) {
  const { intelligence, contentTrends, isLoading } = useDataIntelligence(brandId, 90, filters);

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-muted rounded w-1/3"></div>
          <div className="h-20 bg-muted rounded"></div>
        </div>
      </Card>
    );
  }

  const getTrendIcon = (trend) => {
    if (trend === 'improving') return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (trend === 'declining') return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-yellow-500" />;
  };

  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <BarChart3 className="h-5 w-5" />
        Data Intelligence Summary (Last 90 Days)
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Campaign Performance</span>
            {getTrendIcon(intelligence?.campaignPerformance?.trendDirection || 'stable')}
          </div>
          <div className="text-2xl font-bold">
            {intelligence?.campaignPerformance?.avgEngagementScore?.toFixed(1) || '0'}
          </div>
          <div className="text-xs text-muted-foreground">Avg Engagement Score</div>
        </div>

        <div className="p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Market Position</span>
            <Target className="h-4 w-4" />
          </div>
          <div className="text-2xl font-bold">
            {intelligence?.marketPosition?.currentMarketShare?.toFixed(1) || '0'}%
          </div>
          <div className="text-xs text-muted-foreground">Market Share</div>
        </div>

        <div className="p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Audience Reach</span>
            <Users className="h-4 w-4" />
          </div>
          <div className="text-2xl font-bold">
            {((intelligence?.audienceInsights?.totalActiveHCPs || 0) / 1000).toFixed(0)}K
          </div>
          <div className="text-xs text-muted-foreground">Total HCPs Reached</div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-sm font-medium">Key Insights:</div>
        {intelligence?.campaignPerformance?.topPerformingSegment && (
          <Badge variant="outline" className="mr-2">
            Best Segment: {intelligence.campaignPerformance.topPerformingSegment}
          </Badge>
        )}
        {intelligence?.socialIntelligence?.sentimentScore && (
          <Badge variant="outline" className="mr-2">
            Sentiment: {(intelligence.socialIntelligence.sentimentScore * 100).toFixed(0)}% Positive
          </Badge>
        )}
      </div>
    </Card>
  );
}

// ✅ Explicit export
export { DataAnalysisPreview };
