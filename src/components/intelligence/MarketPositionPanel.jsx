import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, Activity } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { EnhancedThemeIntelligenceService } from '@/services/EnhancedThemeIntelligenceService';
import { Skeleton } from '@/components/ui/skeleton';
// DataFilters component and type are implicitly handled by removing the type import/interface

const MarketPositionPanel = ({ brandId, filters }) => { // Props type annotation removed
  const { data: marketPosition, isLoading } = useQuery({
    queryKey: ['market-position', brandId, filters],
    queryFn: () => EnhancedThemeIntelligenceService.getMarketPosition(brandId, filters),
    enabled: !!brandId,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-full mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!marketPosition) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Market Position</CardTitle>
          <CardDescription>No market data available</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const getTrendIcon = (trend) => { // Type annotation removed
    if (trend === 'growing') return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (trend === 'declining') return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Market Position Intelligence
        </CardTitle>
        <CardDescription>
          IQVIA Rx, Market Share & Social Listening • {marketPosition.dataSources.length} sources
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Market Share */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Market Share</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{marketPosition.currentMarketShare}%</span>
              {getTrendIcon(marketPosition.marketShareTrend)}
            </div>
          </div>
          <div className="flex gap-2">
            {marketPosition.dataSources.map((source) => (
              <Badge key={source} variant="secondary" className="text-xs">
                {source}
              </Badge>
            ))}
          </div>
        </div>

        {/* Rx Growth */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Prescription Growth</span>
            <div className="flex items-center gap-2">
              <span className="text-xl font-semibold">{marketPosition.rxGrowth}%</span>
              {getTrendIcon(marketPosition.rxTrend)}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="p-3 bg-secondary/30 rounded-lg">
              <div className="text-xs text-muted-foreground">Total Rx</div>
              <div className="text-lg font-semibold">{marketPosition.totalRx.toLocaleString()}</div>
            </div>
            <div className="p-3 bg-secondary/30 rounded-lg">
              <div className="text-xs text-muted-foreground">New Rx</div>
              <div className="text-lg font-semibold">{marketPosition.newRx.toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* Regional Breakdown */}
        {marketPosition.regionalBreakdown.length > 0 && (
          <div className="space-y-2">
            <span className="text-sm font-medium">Regional Performance</span>
            <div className="space-y-2">
              {marketPosition.regionalBreakdown.map((region) => (
                <div key={region.region} className="flex items-center justify-between p-2 bg-secondary/20 rounded">
                  <span className="text-sm">{region.region}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-muted-foreground">
                      Total: {region.totalRx.toLocaleString()}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      New: {region.newRx.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Share of Voice */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Share of Voice (Social)</span>
            <span className="text-xl font-semibold">{marketPosition.shareOfVoice}%</span>
          </div>
        </div>

        {/* Data Quality */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Data Quality Score</span>
            <Badge variant={marketPosition.dataQuality > 70 ? 'default' : 'secondary'}>
              {marketPosition.dataQuality}%
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// FIX: Named export
export { MarketPositionPanel };