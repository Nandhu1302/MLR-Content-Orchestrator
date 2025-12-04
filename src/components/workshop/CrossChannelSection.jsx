
import { Badge } from '@/components/ui/badge';
import { ArrowRight, TrendingUp, GitCompare } from 'lucide-react';
// import type { CrossChannelJourney } from '@/services/intelligence'; // Removed type-only import

/*
interface CrossChannelSectionProps {
  journeys: CrossChannelJourney[];
}
*/

export const CrossChannelSection = ({ journeys }) => {
  return (
    <div className="space-y-3 pt-4">
      {journeys.map((journey, index) => (
        <div key={index} className="p-4 border rounded-lg bg-gradient-to-r from-indigo-500/5 to-purple-500/5">
          {/* Journey Path */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            {journey.journey_path.map((channel, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Badge variant="secondary" className="text-sm">
                  {channel}
                </Badge>
                {idx < journey.journey_path.length - 1 && (
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Conversion Rate</div>
              <div className="text-lg font-bold text-primary">
                {(journey.conversion_rate * 100).toFixed(1)}%
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Lift vs Single</div>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-lg font-bold text-green-600">
                  {journey.lift_vs_single_channel.toFixed(1)}x
                </span>
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Sample Size</div>
              <div className="text-lg font-bold">
                {journey.sample_size.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
            {journey.description}
          </p>
        </div>
      ))}

      {journeys.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <GitCompare className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>No cross-channel journeys identified yet</p>
        </div>
      )}
    </div>
  );
};
