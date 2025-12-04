
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, TrendingUp, Target } from 'lucide-react';

export const CompetitiveIntelligenceDetail = ({
  intelligence,
  onApplyIntelligence
}) => {
  const { competitive } = intelligence;

  const getThreatColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getThreatIcon = (level) => {
    switch (level?.toLowerCase()) {
      case 'high':
        return '🔴';
      case 'medium':
        return '🟡';
      case 'low':
        return '🟢';
      default:
        return '⚪';
    }
  };

  return (
    <Tabs defaultValue="competitors" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="competitors">
          Competitors ({competitive.competitors?.length || 0})
        </TabsTrigger>
        <TabsTrigger value="landscape">
          Landscape Insights
        </TabsTrigger>
      </TabsList>

      <TabsContent value="competitors" className="space-y-4">
        {!competitive.competitors || competitive.competitors.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No competitive intelligence available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {competitive.competitors.map((competitor) => (
              <Card key={competitor.id} className="p-4">
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-sm">{competitor.competitor_name}</h3>
                      {competitor.competitor_brand && (
                        <p className="text-xs text-muted-foreground">{competitor.competitor_brand}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getThreatIcon(competitor.threat_level || '')}</span>
                      <Badge variant={getThreatColor(competitor.threat_level || '')}>
                        {competitor.threat_level || 'Unknown'}
                      </Badge>
                    </div>
                  </div>

                  {/* Market Share */}
                  {competitor.market_share_percent && (
                    <div className="flex items-center gap-2 text-xs">
                      <TrendingUp className="w-3 h-3 text-muted-foreground" />
                      <span className="text-muted-foreground">Market Share:</span>
                      <span className="font-semibold">{competitor.market_share_percent}%</span>
                    </div>
                  )}

                  {/* Key Differentiators */}
                  {competitor.key_differentiators && Array.isArray(competitor.key_differentiators) && (
                    <div>
                      <p className="text-xs font-medium mb-2">Key Differentiators:</p>
                      <div className="space-y-1">
                        {competitor.key_differentiators.slice(0, 3).map((diff, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                            <span>•</span>
                            <span>{String(diff)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Competitive Advantages */}
                  {competitor.competitive_advantages && Array.isArray(competitor.competitive_advantages) && (
                    <div>
                      <p className="text-xs font-medium mb-2">Their Advantages:</p>
                      <div className="space-y-1">
                        {competitor.competitive_advantages.slice(0, 2).map((adv, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                            <span>+</span>
                            <span>{String(adv)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full text-xs gap-1"
                    onClick={() => onApplyIntelligence?.('competitiveFocus', competitor.competitor_name)}
                  >
                    <Target className="w-3 h-3" />
                    Add to Competitive Focus
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="landscape" className="space-y-4">
        {!competitive.landscape || competitive.landscape.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No landscape insights available</p>
          </div>
        ) : (
          <div className="space-y-4">
            {competitive.landscape.map((insight) => (
              <Card key={insight.id} className="p-4">
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-sm">{insight.competitor_name}</h3>
                    {insight.threat_level && (
                      <Badge variant={getThreatColor(insight.threat_level)}>
                        {insight.threat_level}
                      </Badge>
                    )}
                  </div>
                  
                  {insight.key_differentiators && Array.isArray(insight.key_differentiators) && (
                    <div>
                      <p className="text-xs font-medium mb-1">Differentiators:</p>
                      <div className="flex flex-wrap gap-1">
                        {insight.key_differentiators.map((diff, idx) => (
                          <Badge key={idx} variant="outline" className="text-[10px]">
                            {String(diff)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {insight.messaging_opportunities && Array.isArray(insight.messaging_opportunities) && (
                    <div>
                      <p className="text-xs font-medium mb-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Messaging Opportunities:
                      </p>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {insight.messaging_opportunities.map((opp, idx) => (
                          <li key={idx}>• {String(opp)}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};