
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, MapPin, Users, Target, Calendar, Activity } from 'lucide-react';
// import type { StoryAnalysis } from '@/types/workshop'; // Removed type-only import

/*
interface StoryAnalysisSummaryProps {
  analysis: StoryAnalysis;
}
*/

export const StoryAnalysisSummary = ({ analysis }) => {
  const getConfidenceBadge = (confidence) => {
    if (confidence >= 0.8) return <Badge variant="default" className="bg-green-500/10 text-green-700 border-green-500/20">High Confidence</Badge>;
    if (confidence >= 0.6) return <Badge variant="secondary">Medium Confidence</Badge>;
    return <Badge variant="outline">Low Confidence</Badge>;
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle2 className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Story Analysis Complete</h3>
      </div>

      <div className="grid gap-4">
        {/* Occasion */}
        <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
          <Activity className="h-5 w-5 text-primary mt-0.5" />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-sm">Occasion</span>
              {getConfidenceBadge(analysis.occasion.confidence)}
            </div>
            <p className="text-sm text-muted-foreground">
              {analysis.occasion.type}
              {analysis.occasion.name && ` - ${analysis.occasion.name}`}
            </p>
          </div>
        </div>

        {/* Audience */}
        <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
          <Users className="h-5 w-5 text-primary mt-0.5" />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-sm">Audience</span>
              {getConfidenceBadge(analysis.audience.confidence)}
            </div>
            <p className="text-sm text-muted-foreground">
              {analysis.audience.primaryType}
              {analysis.audience.segments.length > 0 && 
                ` (${analysis.audience.segments.join(', ')})`
              }
            </p>
          </div>
        </div>

        {/* Activities */}
        <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
          <Target className="h-5 w-5 text-primary mt-0.5" />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-sm">Activities</span>
              {getConfidenceBadge(analysis.activities.confidence)}
            </div>
            <div className="flex flex-wrap gap-1 mt-1">
              {analysis.activities.identified.map((activity, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {activity}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Region & Timeline */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-start gap-2 p-3 bg-muted/30 rounded-lg">
            <MapPin className="h-4 w-4 text-primary mt-0.5" />
            <div className="flex-1 min-w-0">
              <span className="font-medium text-xs block mb-1">Region</span>
              <p className="text-xs text-muted-foreground truncate">
                {analysis.region.identified}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2 p-3 bg-muted/30 rounded-lg">
            <Calendar className="h-4 w-4 text-primary mt-0.5" />
            <div className="flex-1 min-w-0">
              <span className="font-medium text-xs block mb-1">Timeline</span>
              <p className="text-xs text-muted-foreground capitalize">
                {analysis.timeline.urgency}
                {analysis.timeline.dateContext && ` - ${analysis.timeline.dateContext}`}
              </p>
            </div>
          </div>
        </div>

        {/* Goals */}
        <div className="p-3 bg-muted/30 rounded-lg">
          <span className="font-medium text-sm block mb-2">Primary Goal</span>
          <p className="text-sm text-muted-foreground mb-2">{analysis.goals.primary}</p>
          {analysis.goals.secondary.length > 0 && (
            <>
              <span className="font-medium text-xs block mb-1 text-muted-foreground">Secondary Goals</span>
              <ul className="text-xs text-muted-foreground space-y-0.5">
                {analysis.goals.secondary.map((goal, idx) => (
                  <li key={idx}>• {goal}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>

      <div className="pt-4 border-t text-center">
        <p className="text-sm text-muted-foreground">
          Generating strategic theme recommendations based on this analysis...
        </p>
      </div>
    </Card>
  );
};
