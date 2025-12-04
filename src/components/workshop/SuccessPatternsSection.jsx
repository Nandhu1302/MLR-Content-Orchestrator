
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Target, CheckCircle, AlertTriangle, Beaker } from 'lucide-react';
// import type { SuccessPattern } from '@/services/intelligence'; // Removed type-only import

/*
interface SuccessPatternsSectionProps {
  patterns: SuccessPattern[];
}
*/

export const SuccessPatternsSection = ({ patterns }) => {
  return (
    <div className="space-y-3 pt-4">
      {patterns.map(pattern => (
        <div key={pattern.id} className="p-4 border rounded-lg bg-gradient-to-r from-green-500/5 to-emerald-500/5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <h4 className="font-semibold">{pattern.campaign_type}</h4>
            </div>
            <Badge variant="default" className="bg-green-600">
              {Math.round(pattern.success_rate * 100)}% success rate
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-3">
            <div className="flex items-center gap-2 text-sm">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Engagement:</span>
              <span className="font-medium">
                {Math.round(pattern.avg_engagement_rate * 100)}%
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Sample Size:</span>
              <span className="font-medium">{pattern.sample_size} campaigns</span>
            </div>
          </div>

          {pattern.key_success_factors.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-semibold text-muted-foreground mb-2">
                Key Success Factors:
              </p>
              <div className="flex flex-wrap gap-1">
                {pattern.key_success_factors.map((factor, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {factor}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Anti-Patterns */}
          {pattern.anti_patterns && pattern.anti_patterns.length > 0 && (
            <div className="mb-3 p-3 border border-yellow-200 rounded bg-yellow-50/50">
              <p className="text-xs font-semibold text-yellow-800 mb-2 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                What to Avoid:
              </p>
              <div className="space-y-1">
                {pattern.anti_patterns.map((antiPattern, index) => (
                  <div key={index} className="text-sm text-yellow-900 flex items-start gap-2">
                    <span className="text-yellow-600">•</span>
                    <span>{antiPattern}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* A/B Test Results */}
          {pattern.ab_test_winner && pattern.ab_test_lift && (
            <div className="p-3 border border-blue-200 rounded bg-blue-50/50">
              <p className="text-xs font-semibold text-blue-800 mb-2 flex items-center gap-1">
                <Beaker className="h-3 w-3" />
                A/B Test Insights:
              </p>
              <div className="text-sm text-blue-900">
                <span className="font-medium">{pattern.ab_test_winner}</span> variant showed{' '}
                <span className="font-bold text-blue-700">+{pattern.ab_test_lift}%</span> lift
              </div>
            </div>
          )}
        </div>
      ))}

      {patterns.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <TrendingUp className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>No success patterns matched yet</p>
        </div>
      )}
    </div>
  );
};
