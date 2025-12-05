
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Lightbulb, 
  TrendingUp, 
  Users,
  Shield,
  ArrowRight,
  CheckCircle2 
} from 'lucide-react';
import { useState } from 'react';

const SOURCE_ICONS = {
  evidence: Shield,
  performance: TrendingUp,
  audience: Users,
  competitive: Lightbulb
};

const SOURCE_COLORS = {
  evidence: 'text-blue-600',
  performance: 'text-green-600',
  audience: 'text-orange-600',
  competitive: 'text-purple-600'
};

const SOURCE_LABELS = {
  evidence: 'Evidence-Based',
  performance: 'Performance Data',
  audience: 'Audience Insights',
  competitive: 'Competitive Intel'
};

export const FieldIntelligenceRecommendations = ({ 
  field, 
  currentValue, 
  recommendations,
  onApplyRecommendation 
}) => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  if (recommendations.length === 0) return null;

  return (
    <Card className="border-blue-200 bg-blue-50/50">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-semibold text-blue-900">
            Intelligence Recommendations for {field}
          </span>
          <Badge variant="secondary" className="text-xs">
            {recommendations.length}
          </Badge>
        </div>

        <div className="space-y-2">
          {recommendations.map((rec, idx) => {
            const Icon = SOURCE_ICONS[rec.source];
            const color = SOURCE_COLORS[rec.source];
            const label = SOURCE_LABELS[rec.source];
            const isExpanded = expandedIndex === idx;

            return (
              <div 
                key={idx}
                className="bg-white border border-border rounded-md p-3 space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-3.5 h-3.5 ${color}`} />
                      <span className="text-xs font-medium text-muted-foreground">
                        {label}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {Math.round(rec.confidence * 100)}% confident
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-foreground">
                      {rec.recommendation}
                    </p>
                    
                    {isExpanded && (
                      <>
                        <p className="text-xs text-muted-foreground mt-2">
                          <span className="font-medium">Why:</span> {rec.reasoning}
                        </p>
                        
                        {rec.suggestedText && (
                          <div className="mt-3 p-3 bg-muted rounded-md space-y-2">
                            <p className="text-xs font-medium text-foreground">
                              Suggested Content:
                            </p>
                            <p className="text-sm text-foreground italic">
                              "{rec.suggestedText}"
                            </p>
                            
                            {onApplyRecommendation && (
                              <Button
                                size="sm"
                                variant="default"
                                className="w-full mt-2"
                                onClick={() => onApplyRecommendation(rec.suggestedText)}
                              >
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Apply This Suggestion
                              </Button>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2"
                    onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                  >
                    <ArrowRight className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default FieldIntelligenceRecommendations;
