import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Globe, Clock, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { getAllMarkets, isMarketSupported } from '@/config/localizationConfig';

// Market and language mappings from configuration
const AVAILABLE_MARKETS = getAllMarkets();

const getComplexityColor = (complexity) => {
  switch (complexity) {
    case 'Low': return 'bg-green-100 text-green-800';
    case 'Medium': return 'bg-yellow-100 text-yellow-800';
    case 'High': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getMLRStatus = (marketCode) => {
  // Mock regulatory readiness for different markets
  const statuses = {
    'DE': 'enhanced_review',
    'FR': 'enhanced_review',
    'ES': 'standard_review', 
    'IT': 'enhanced_review',
    'JP': 'complex_review',
    'CN': 'complex_review',
    'BR': 'standard_review',
    'MX': 'standard_review',
    'CA': 'standard_review',
    'AU': 'standard_review'
  };
  return statuses[marketCode] || 'enhanced_review';
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'standard_review': return CheckCircle;
    case 'enhanced_review': return Clock;
    case 'complex_review': return AlertCircle;
    default: return Clock;
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'standard_review': return 'text-green-600';
    case 'enhanced_review': return 'text-yellow-600';
    case 'complex_review': return 'text-red-600';
    default: return 'text-gray-600';
  }
};

export const MarketSelectionModal = ({
  asset,
  isOpen,
  onClose,
  onConfirm,
  isAdapting = false
}) => {
  const [selectedMarkets, setSelectedMarkets] = useState([]);

  if (!asset) return null;

  const handleMarketToggle = (marketCode) => {
    // Only allow selection of supported markets
    if (!isMarketSupported(marketCode)) return;
    
    setSelectedMarkets(prev => 
      prev.includes(marketCode) 
        ? prev.filter(m => m !== marketCode)
        : [...prev, marketCode]
    );
  };

  const handleConfirm = () => {
    const selectedMarketData = AVAILABLE_MARKETS.filter(m => selectedMarkets.includes(m.code));
    const languages = selectedMarketData.map(m => m.language);
    const markets = selectedMarketData.map(m => m.name);
    
    onConfirm(asset, markets, languages);
    setSelectedMarkets([]);
  };

  const groupedMarkets = AVAILABLE_MARKETS.reduce((acc, market) => {
    if (!acc[market.region]) {
      acc[market.region] = [];
    }
    acc[market.region].push(market);
    return acc;
  }, {});

  const estimatedTimeframe = selectedMarkets.length * 2 + 1; // Simple calculation
  const totalComplexity = selectedMarkets.reduce((acc, code) => {
    const market = AVAILABLE_MARKETS.find(m => m.code === code);
    return acc + (market?.complexity === 'High' ? 3 : market?.complexity === 'Medium' ? 2 : 1);
  }, 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Adapt Asset for Markets
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Select target markets for <strong>{asset.name}</strong>
          </p>
        </DialogHeader>

        <TooltipProvider>
          <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-3">Available Markets</h3>
            <ScrollArea className="h-96">
              <div className="space-y-4">
                {Object.entries(groupedMarkets).map(([region, markets]) => (
                  <div key={region}>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">{region}</h4>
                    <div className="space-y-2">
                      {markets.map(market => {
                        const mlrStatus = getMLRStatus(market.code);
                        const StatusIcon = getStatusIcon(mlrStatus);
                        const isSupported = market.isSupported;
                        
                        return (
                          <div 
                            key={market.code}
                            className={`flex items-center space-x-3 p-2 rounded-lg border ${
                              isSupported 
                                ? 'hover:bg-muted/50 cursor-pointer' 
                                : 'opacity-60 cursor-not-allowed bg-muted/20'
                            }`}
                            onClick={() => isSupported && handleMarketToggle(market.code)}
                          >
                            <Checkbox 
                              checked={selectedMarkets.includes(market.code)}
                              onChange={() => isSupported && handleMarketToggle(market.code)}
                              disabled={!isSupported}
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className={`font-medium ${!isSupported ? 'text-muted-foreground' : ''}`}>
                                  {market.name}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {market.language}
                                </Badge>
                                {!isSupported && (
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Badge variant="secondary" className="text-xs gap-1">
                                        <Info className="h-3 w-3" />
                                        Coming Soon
                                      </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <div className="text-xs">
                                        Translation services for {market.name} are coming soon.<br/>
                                        Currently only Japanese and Chinese are supported.
                                      </div>
                                    </TooltipContent>
                                  </Tooltip>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge 
                                  className={`text-xs ${getComplexityColor(market.complexity)}`}
                                  variant="outline"
                                >
                                  {market.complexity}
                                </Badge>
                                {isSupported && (
                                  <div className="flex items-center gap-1">
                                    <StatusIcon className={`h-3 w-3 ${getStatusColor(mlrStatus)}`} />
                                    <Tooltip>
                                      <TooltipTrigger>
                                        <span className="text-xs text-muted-foreground capitalize cursor-help">
                                          {mlrStatus.replace('_', ' ')}
                                        </span>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <div className="text-xs">
                                          {mlrStatus === 'standard_review' && 'Minimal regulatory adjustments needed - typical 2-4 week timeline'}
                                          {mlrStatus === 'enhanced_review' && 'Moderate regulatory requirements - typical 4-8 week timeline'}
                                          {mlrStatus === 'complex_review' && 'Extensive regulatory review required - 8+ week timeline'}
                                        </div>
                                      </TooltipContent>
                                    </Tooltip>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-3">Project Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Selected Markets:</span>
                  <span className="font-medium">{selectedMarkets.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Languages:</span>
                  <span className="font-medium">
                    {new Set(
                      AVAILABLE_MARKETS
                        .filter(m => selectedMarkets.includes(m.code))
                        .map(m => m.language)
                    ).size}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Est. Timeframe:</span>
                  <span className="font-medium">{estimatedTimeframe} weeks</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Complexity:</span>
                  <Badge 
                    className={getComplexityColor(
                      totalComplexity > 8 ? 'High' : totalComplexity > 4 ? 'Medium' : 'Low'
                    )}
                    variant="outline"
                  >
                    {totalComplexity > 8 ? 'High' : totalComplexity > 4 ? 'Medium' : 'Low'}
                  </Badge>
                </div>
              </div>
            </div>

            {selectedMarkets.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Selected Markets:</h4>
                <div className="space-y-1">
                  {selectedMarkets.map(code => {
                    const market = AVAILABLE_MARKETS.find(m => m.code === code);
                    return market ? (
                      <div key={code} className="flex items-center justify-between text-sm">
                        <span>{market.name}</span>
                        <span className="text-muted-foreground">{market.language}</span>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            <Separator />

            <div className="space-y-2">
              <h4 className="font-medium text-sm">What happens next?</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Localization project will be created</li>
                <li>• Translation workflows will be initiated</li>
                <li>• MLR review process will begin for selected markets</li>
                <li>• You'll receive progress notifications</li>
              </ul>
              <div className="mt-3 p-2 bg-muted/50 rounded text-xs text-muted-foreground">
                <strong>Note:</strong> Currently supporting Japanese and Chinese translations. 
                Other markets coming soon!
              </div>
            </div>
          </div>
          </div>
        </TooltipProvider>

        <div className="flex gap-3 pt-4">
          <Button 
            onClick={handleConfirm}
            disabled={selectedMarkets.length === 0 || isAdapting}
            className="flex-1"
          >
            {isAdapting ? 'Creating Project...' : `Create Localization Project (${selectedMarkets.length} markets)`}
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};