
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Users, Target, MapPin } from 'lucide-react';
// import type { MarketIntelligence } from '@/services/intelligence'; // (Type-only import removed)

/*
interface MarketIntelSectionProps {
  intelligence: MarketIntelligence;
}
*/

export const MarketIntelSection = ({ intelligence }) => {
  const hasGrowth = intelligence.rx_growth_rate !== null && intelligence.rx_growth_rate > 0;
  
  return (
    <div className="space-y-4 pt-4">
      {/* Rx Growth */}
      {intelligence.rx_growth_rate !== null && (
        <div className="p-4 border rounded-lg bg-gradient-to-r from-teal-500/5 to-blue-500/5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {hasGrowth ? (
                <TrendingUp className="h-5 w-5 text-green-600" />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-600" />
              )}
              <span className="font-semibold">Rx Growth Rate</span>
            </div>
            <div className={`text-2xl font-bold ${hasGrowth ? 'text-green-600' : 'text-red-600'}`}>
              {intelligence.rx_growth_rate > 0 ? '+' : ''}
              {intelligence.rx_growth_rate.toFixed(1)}%
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            {intelligence.market_share_trend}
          </p>
        </div>
      )}

      {/* Primary Competitor */}
      {intelligence.primary_competitor && (
        <div className="p-4 border rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-primary" />
            <span className="font-semibold">Primary Competitor</span>
          </div>
          <Badge variant="outline" className="text-sm">
            {intelligence.primary_competitor}
          </Badge>
        </div>
      )}

      {/* HCP Decile */}
      <div className="p-4 border rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Users className="h-4 w-4 text-primary" />
          <span className="font-semibold">Top Decile HCP Count</span>
        </div>
        <div className="text-2xl font-bold text-primary">
          {intelligence.top_decile_hcp_count.toLocaleString()}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          High-prescribing physicians in your target markets
        </p>
      </div>

      {/* Regional Insights */}
      {intelligence.regional_insights.length > 0 && (
        <div className="p-4 border rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="font-semibold">Regional Insights</span>
          </div>
          <div className="space-y-2">
            {intelligence.regional_insights.map((insight, index) => (
              <div key={index} className="text-sm border-l-2 border-primary/30 pl-3 py-1">
                {insight}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
