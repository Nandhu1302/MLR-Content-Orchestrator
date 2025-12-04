
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Target, CheckCircle2, Calendar } from 'lucide-react';
// import type { CompetitiveIntelligence } from '@/services/intelligence'; // Removed type-only import
import { formatDistanceToNow } from 'date-fns';

/*
interface CompetitiveIntelSectionProps {
  intelligence: CompetitiveIntelligence[];
}
*/

const getThreatColor = (level) => {
  switch (level) {
    case 'high': return 'text-red-600 bg-red-50 border-red-200';
    case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'low': return 'text-green-600 bg-green-50 border-green-200';
    default: return 'text-muted-foreground bg-muted border-border';
  }
};

export const CompetitiveIntelSection = ({ intelligence }) => {
  return (
    <div className="space-y-3 pt-4">
      {intelligence.map((item, index) => (
        <div key={index} className="p-4 border rounded-lg bg-background">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Target className="h-4 w-4 text-primary" />
                <h4 className="font-semibold">{item.competitor_name}</h4>
              </div>
              <Badge variant="outline" className="text-xs">
                {item.intelligence_type}
              </Badge>
            </div>
            {item.threat_level && (
              <Badge className={getThreatColor(item.threat_level)}>
                <AlertTriangle className="h-3 w-3 mr-1" />
                {item.threat_level} threat
              </Badge>
            )}
          </div>

          {/* Content */}
          <p className="text-sm text-foreground mb-3 leading-relaxed">
            {item.content}
          </p>

          {/* Counter Messaging */}
          {item.counter_messaging.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Counter-Messaging Recommendations:
              </p>
              <div className="space-y-1">
                {item.counter_messaging.map((message, idx) => (
                  <div key={idx} className="text-sm pl-4 border-l-2 border-primary/30 py-1">
                    {message}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timestamp */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-3">
            <Calendar className="h-3 w-3" />
            Discovered {formatDistanceToNow(new Date(item.discovered_at), { addSuffix: true })}
          </div>
        </div>
      ))}

      {intelligence.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>No competitive intelligence available</p>
        </div>
      )}
    </div>
  );
};
