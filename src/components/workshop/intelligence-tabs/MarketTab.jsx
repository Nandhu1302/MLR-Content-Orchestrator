import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, MapPin, AlertCircle } from 'lucide-react';

export const MarketTab = ({
  marketContext,
  intelligence,
}) => {
  const competitive = intelligence?.competitiveIntelligence || [];

  return (
    <div className="space-y-6">
      {/* Market Context */}
      {marketContext && (
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Market Intelligence
          </h3>
          <Card className="p-4">
            <div className="space-y-4">
              {marketContext.rxTrends && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Rx Trends</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Growth Rate</p>
                      <p className="text-lg font-semibold text-primary">
                        {marketContext.rxTrends.growthRate || '+15.3%'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Market Share</p>
                      <p className="text-lg font-semibold">
                        {marketContext.rxTrends.marketShare || '34.2%'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {marketContext.regionalInsights && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    Regional Performance
                  </p>
                  <div className="space-y-2">
                    {Object.entries(marketContext.regionalInsights).map(([region, data]) => (
                      <div key={region} className="flex items-center justify-between text-sm p-2 bg-accent/50 rounded">
                        <span>{region}</span>
                        <Badge variant={data.trend === 'up' ? 'default' : 'secondary'}>
                          {data.growth || '+12%'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Competitive Intelligence */}
      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-primary" />
          Competitive Intelligence
        </h3>
        <div className="space-y-3">
          {competitive.length === 0 ? (
            <p className="text-sm text-muted-foreground">No competitive intelligence available</p>
          ) : (
            competitive.map((comp, idx) => (
              <Card key={idx} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold">{comp.competitor_name}</p>
                    <p className="text-xs text-muted-foreground">{comp.competitor_brand}</p>
                  </div>
                  {comp.threat_level && (
                    <Badge variant={
                      comp.threat_level === 'high' ? 'destructive' : 
                      comp.threat_level === 'medium' ? 'default' : 'secondary'
                    }>
                      {comp.threat_level}
                    </Badge>
                  )}
                </div>
                {comp.key_differentiators && (
                  <div className="mt-3">
                    <p className="text-xs text-muted-foreground mb-2">Key Differentiators</p>
                    <div className="flex flex-wrap gap-2">
                      {comp.key_differentiators.slice(0, 3).map((diff, i) => (
                        <Badge key={i} variant="outline" className="text-xs">{diff}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};