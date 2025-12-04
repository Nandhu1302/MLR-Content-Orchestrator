import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Globe, 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getSupportedMarkets } from '@/config/localizationConfig';

// Market coverage for source assets - only show supported markets for localization
const getMarketCoverage = (assetId) => {
  // Get only the supported markets from configuration
  const supportedMarkets = getSupportedMarkets();
  const supportedMarketCodes = supportedMarkets.map(market => market.code);
  
  return {
    markets: supportedMarketCodes,
    localized: [], // No markets are localized yet for source assets
    inProgress: [], // No markets are in progress yet
    planned: supportedMarketCodes // All supported markets are potential targets
  };
};

const getReusabilityScore = (asset) => {
  // Calculate reusability score based on asset characteristics
  let score = 70; // Base score

  // Asset type influences reusability
  if (asset.type === 'email') score += 20;
  if (asset.type === 'social_media') score += 15;
  if (asset.type === 'landing_page') score += 10;
  if (asset.type === 'sales_aid') score -= 10;

  // Source module affects reusability
  if (asset.source_module === 'pre_mlr') score += 15; // MLR approved = higher reusability
  if (asset.source_module === 'design_studio') score -= 5; // Visual elements need more adaptation

  // Status affects reusability
  if (asset.status === 'approved') score += 10;
  if (asset.status === 'mlr_approved') score += 15;

  return Math.min(Math.max(score, 0), 100);
};

const getAdaptationComplexity = (asset) => {
  if (asset.type === 'video' || asset.type === 'banner') return 'High';
  if (asset.type === 'landing_page' || asset.type === 'sales_aid') return 'Medium';
  return 'Low';
};

export const AssetReusabilityMatrix = ({
  asset,
  className
}) => {
  const marketCoverage = getMarketCoverage(asset.id);
  const reusabilityScore = getReusabilityScore(asset);
  const adaptationComplexity = getAdaptationComplexity(asset);

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getComplexityColor = (complexity) => {
    switch (complexity) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <TooltipProvider>
      <div className={cn("space-y-3", className)}>
        {/* Reusability Score */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Reusability Score</span>
          <div className="flex items-center gap-2">
            <Progress value={reusabilityScore} className="w-16 h-2" />
            <span className={cn("text-sm font-medium", getScoreColor(reusabilityScore))}>
              {reusabilityScore}%
            </span>
          </div>
        </div>

        {/* Market Coverage */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Market Coverage</span>
            <Badge variant="outline" className="text-xs">
              {marketCoverage.markets.length} Markets Available
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-1">
            {marketCoverage.markets.map((market) => {
              // For source assets, all markets should show as "available for localization"
              const status = 'available';
              const icon = Globe;
              const colorClass = 'bg-blue-50 text-blue-600 border border-blue-200';
              
              const StatusIcon = icon;
              
              return (
                <Tooltip key={market}>
                  <TooltipTrigger>
                    <div className={cn(
                      "flex items-center justify-center p-1 rounded text-xs font-medium cursor-pointer hover:bg-blue-100",
                      colorClass
                    )}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {market}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-xs">
                      <p className="font-medium">Available for localization</p>
                      <p className="text-muted-foreground">Click "Adapt for Market" to start localization</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </div>

        {/* Adaptation Requirements */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Adaptation Complexity</span>
          <Badge 
            className={cn("text-xs", getComplexityColor(adaptationComplexity))}
            variant="outline"
          >
            {adaptationComplexity}
          </Badge>
        </div>

        {/* Quick Insights */}
        <div className="text-xs text-muted-foreground space-y-1">
          <div>
            {reusabilityScore >= 80 && "✅ Ready for immediate localization"}
            {reusabilityScore >= 60 && reusabilityScore < 80 && "⚠️ Minor adaptations needed"}
            {reusabilityScore < 60 && "🔄 Significant adaptation required"}
          </div>
          <div className="text-blue-600">
            💡 This is a source asset - no markets have been localized yet
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};