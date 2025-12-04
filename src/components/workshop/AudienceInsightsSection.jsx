
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, Activity } from 'lucide-react';
// import type { AudienceInsight } from '@/services/intelligence'; // Removed type-only import

/*
interface AudienceInsightsSectionProps {
  insights: AudienceInsight[];
}
*/

export const AudienceInsightsSection = ({ insights }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'prescribing_tier':
        return <Users className="h-5 w-5 text-blue-600" />;
      case 'engagement':
        return <Activity className="h-5 w-5 text-purple-600" />;
      case 'field_engagement':
        return <TrendingUp className="h-5 w-5 text-green-600" />;
      default:
        return <Users className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-3 pt-4">
      {insights.map((insight, index) => (
        <div key={index} className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
          <div className="flex items-start gap-3">
            <div className="shrink-0 mt-1">
              {getIcon(insight.type)}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-semibold">{insight.metric}</h4>
                <Badge variant="secondary" className="text-lg font-bold">
                  {insight.value}{insight.type === 'prescribing_tier' || insight.type === 'engagement' ? '%' : ''}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                {insight.description}
              </p>
              <Badge variant="outline" className="text-xs">
                {insight.source}
              </Badge>
            </div>
          </div>
        </div>
      ))}

      {insights.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>No audience insights available yet</p>
        </div>
      )}
    </div>
  );
};
