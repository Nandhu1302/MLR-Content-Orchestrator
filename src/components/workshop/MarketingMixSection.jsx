
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp } from 'lucide-react';

/*
// interface MarketingMixRecommendation {
//   channel: string;
//   percentage: number;
//   avgPerformance: number;
//   rationale: string;
// }
//
// interface MarketingMixSectionProps {
//   recommendations: MarketingMixRecommendation[];
// }
*/

export const MarketingMixSection = ({ recommendations }) => {
  if (recommendations.length === 0) {
    return (
      <div className="text-sm text-muted-foreground text-center py-4">
        No marketing mix data available
      </div>
    );
  }

  const getChannelColor = (channel) => {
    const colors = {
      'Email': 'bg-purple-500',
      'Website': 'bg-blue-500',
      'Rep-Enabled': 'bg-orange-500',
      'Social': 'bg-green-500'
    };
    return colors[channel] || 'bg-gray-500';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
        <BarChart3 className="h-4 w-4" />
        <span>Based on audience preferences + actual performance data</span>
      </div>

      {/* Visual Chart */}
      <div className="space-y-2">
        {recommendations.map((rec) => (
          <div key={rec.channel} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium">{rec.channel}</span>
                <Badge variant="outline" className="text-xs">
                  {rec.percentage}%
                </Badge>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3" />
                <span>{rec.avgPerformance}% performance</span>
              </div>
            </div>
            <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
              <div
                className={`h-full ${getChannelColor(rec.channel)} transition-all duration-500`}
                style={{ width: `${rec.percentage}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground pl-1">{rec.rationale}</p>
          </div>
        ))}
      </div>

      {/* Summary Card */}
      <Card className="p-3 bg-primary/5 border-primary/20">
        <div className="text-sm">
          <p className="font-medium mb-1">Recommendation</p>
          <p className="text-xs text-muted-foreground">
            Focus on <strong>{recommendations[0].channel}</strong> ({recommendations[0].percentage}%) as your primary channel, 
            with <strong>{recommendations[1].channel}</strong> ({recommendations[1].percentage}%) as secondary support.
          </p>
        </div>
      </Card>
    </div>
  );
};
