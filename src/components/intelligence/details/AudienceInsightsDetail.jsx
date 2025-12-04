
import { UnifiedIntelligence } from '@/services/intelligenceAggregationService';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Star, Target } from 'lucide-react';

export const AudienceInsightsDetail = ({
  intelligence,
  currentAudience,
  onApplyIntelligence
}) => {
  const { audience } = intelligence;

  const isMatchingSegment = (segmentName) => {
    return currentAudience?.toLowerCase().includes(segmentName.toLowerCase());
  };

  return (
    <div className="space-y-6">
      {!audience.segments || audience.segments.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-sm">No audience segments defined</p>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>{audience.segments.length} audience segments available</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {audience.segments.map((segment) => {
              const isMatch = isMatchingSegment(segment.segment_name);

              return (
                <Card
                  key={segment.id}
                  className={`p-6 ${isMatch ? 'border-primary shadow-md' : ''}`}
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-base">{segment.segment_name}</h3>
                      {isMatch && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="text-xs text-muted-foreground">Match</span>
                        </div>
                      )}
                    </div>

                    <Badge variant="outline" className="text-xs">
                      {segment.segment_type || 'General'}
                    </Badge>

                    {/* Demographics */}
                    {segment.demographics && typeof segment.demographics === 'object' && (
                      <div>
                        <p className="text-sm font-semibold mb-2">Demographics:</p>
                        <div className="text-sm text-muted-foreground space-y-1">
                          {Object.entries(segment.demographics).slice(0, 3).map(([key, value]) => (
                            <div key={key} className="flex items-start gap-1">
                              <span>•</span>
                              <span>{key}: {String(value)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Channel Preferences */}
                    {segment.channel_preferences && typeof segment.channel_preferences === 'object' && (
                      <div>
                        <p className="text-sm font-semibold mb-2">Channel Preferences:</p>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(segment.channel_preferences).slice(0, 3).map(([key, value]) => (
                            <Badge key={key} variant="secondary">
                              {key}: {String(value)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Content Preferences */}
                    {segment.content_preferences && typeof segment.content_preferences === 'object' && (
                      <div>
                        <p className="text-sm font-semibold mb-2">Content Preferences:</p>
                        <div className="text-sm text-muted-foreground space-y-1">
                          {Object.entries(segment.content_preferences).slice(0, 2).map(([key, value]) => (
                            <div key={key} className="flex items-start gap-1">
                              <span>•</span>
                              <span>{String(value)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Messaging Preferences */}
                    {segment.messaging_preferences && typeof segment.messaging_preferences === 'object' && (
                      <div>
                        <p className="text-sm font-semibold mb-2">Messaging:</p>
                        <div className="text-sm text-muted-foreground space-y-1">
                          {Object.entries(segment.messaging_preferences).slice(0, 2).map(([key, value]) => (
                            <div key={key}>
                              <span className="font-medium">{key}:</span> {String(value)}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Button */}
                    <Button
                      size="sm"
                      variant={isMatch ? "default" : "outline"}
                      className="w-full gap-2"
                      onClick={() => onApplyIntelligence?.('targetAudience', segment.segment_name)}
                    >
                      <Target className="w-4 h-4" />
                      {isMatch ? 'Current Target' : 'Set as Target'}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
