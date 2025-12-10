
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Globe,
  AlertCircle,
  CheckCircle,
  Target,
  TrendingUp,
  Users
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useBrand } from '@/contexts/BrandContext';

// Smart recommendations based on asset type and strategic context
const getSmartRecommendations = (asset) => {
  const recommendations = [
    {
      markets: ['JP', 'CN'],
      reason: 'High pharmaceutical market opportunities',
      confidence: 92,
      icon: TrendingUp
    },
    {
      markets: ['JP'],
      reason: 'Regulatory pathway already established',
      confidence: 87,
      icon: CheckCircle
    },
    {
      markets: ['CN'],
      reason: 'Strategic market expansion priority',
      confidence: 79,
      icon: Target
    }
  ];
  return recommendations;
};

// Real-time complexity indicators from brand-market config
const getMarketComplexity = (marketCode, brandMarkets) => {
  const config = brandMarkets.find(m => m.market_code === marketCode);
  if (config) {
    const complexityLevel = config.regulatory_complexity;
    const colorMap = {
      high: 'destructive',
      medium: 'secondary',
      low: 'default'
    };
    return {
      level: complexityLevel.charAt(0).toUpperCase() + complexityLevel.slice(1),
      factors: config.complexity_factors ?? [],
      color: colorMap[complexityLevel] ?? 'secondary',
      estimatedWeeks: config.estimated_timeline_weeks ?? '4-6 weeks'
    };
  }
  return {
    level: 'Medium',
    factors: ['Standard localization process'],
    color: 'secondary',
    estimatedWeeks: '4-6 weeks'
  };
};

export const MarketSelectionStep = ({
  asset,
  onStepComplete,
  onNext,
  stepData
}) => {
  const { selectedBrand } = useBrand();
  const [selectedMarkets, setSelectedMarkets] = useState(stepData?.selectedMarkets ?? []);
  const [brandMarkets, setBrandMarkets] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log('🔵 MarketSelectionStep mounted. Brand:', selectedBrand?.brand_name, 'ID:', selectedBrand?.id); // [1](https://cognizantonline-my.sharepoint.com/personal/2397807_cognizant_com/Documents/Microsoft%20Copilot%20Chat%20Files/markertselectionstep04.txt)

  // Load brand-specific market configurations
  useEffect(() => {
    const loadBrandMarkets = async () => {
      if (!selectedBrand?.id) {
        console.log('⚠️ No brand selected, cannot load markets'); // [1](https://cognizantonline-my.sharepoint.com/personal/2397807_cognizant_com/Documents/Microsoft%20Copilot%20Chat%20Files/markertselectionstep04.txt)
        setLoading(false);
        return;
      }

      console.log('🔍 Loading markets for brand:', selectedBrand.brand_name, 'ID:', selectedBrand.id); // [1](https://cognizantonline-my.sharepoint.com/personal/2397807_cognizant_com/Documents/Microsoft%20Copilot%20Chat%20Files/markertselectionstep04.txt)
      try {
        const { data, error } = await supabase
          .from('brand_market_configurations')
          .select('*')
          .eq('brand_id', selectedBrand.id)
          .eq('is_active', true)
          .order('therapeutic_area_relevance', { ascending: false });

        if (error) {
          console.error('❌ Error loading brand markets:', error); // [1](https://cognizantonline-my.sharepoint.com/personal/2397807_cognizant_com/Documents/Microsoft%20Copilot%20Chat%20Files/markertselectionstep04.txt)
          setBrandMarkets([]);
          return;
        }

        console.log(`✅ Loaded ${data?.length ?? 0} markets for brand ${selectedBrand.brand_name}:`, data); // [1](https://cognizantonline-my.sharepoint.com/personal/2397807_cognizant_com/Documents/Microsoft%20Copilot%20Chat%20Files/markertselectionstep04.txt)
        setBrandMarkets(data ?? []);
      } catch (error) {
        console.error('❌ Exception loading brand markets:', error); // [1](https://cognizantonline-my.sharepoint.com/personal/2397807_cognizant_com/Documents/Microsoft%20Copilot%20Chat%20Files/markertselectionstep04.txt)
        setBrandMarkets([]);
      } finally {
        setLoading(false);
      }
    };

    loadBrandMarkets();
  }, [selectedBrand?.id]); // [1](https://cognizantonline-my.sharepoint.com/personal/2397807_cognizant_com/Documents/Microsoft%20Copilot%20Chat%20Files/markertselectionstep04.txt)

  const smartRecommendations = getSmartRecommendations(asset); // [1](https://cognizantonline-my.sharepoint.com/personal/2397807_cognizant_com/Documents/Microsoft%20Copilot%20Chat%20Files/markertselectionstep04.txt)

  const handleMarketToggle = (marketCode) => {
    setSelectedMarkets(prev =>
      prev.includes(marketCode) ? prev.filter(m => m !== marketCode) : [...prev, marketCode]
    );
  };

  const handleApplyRecommendation = (markets) => {
    setSelectedMarkets(markets);
    toast.success('Smart recommendation applied');
  };

  const handleContinue = () => {
    if (selectedMarkets.length === 0) {
      toast.error('Please select at least one target market');
      return;
    }

    const nextStepData = {
      selectedMarkets,
      marketComplexity: selectedMarkets.map(code => ({
        code,
        ...getMarketComplexity(code, brandMarkets)
      }))
    };

    onStepComplete(nextStepData);
    onNext();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="text-sm text-muted-foreground">Loading available markets for {selectedBrand?.brand_name}...</p>
      </div>
    );
  }

  if (!selectedBrand) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">⚠️ No brand selected. Please go back and select a brand.</p>
        </CardContent>
      </Card>
    );
  }

  if (brandMarkets.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 space-y-4">
          <p className="text-destructive font-medium">❌ No markets configured for {selectedBrand.brand_name}</p>
          <p className="text-sm text-muted-foreground">Brand ID: {selectedBrand.id}</p>
          <p className="text-sm text-muted-foreground">Expected JP and CN markets but found none in database.</p>
          <Button onClick={() => window.location.reload()}>Reload Page</Button>
        </CardContent>
      </Card>
    );
  }

  console.log('🎯 Rendering market selection with', brandMarkets.length, 'markets:', brandMarkets.map(m => m.market_code)); // [1](https://cognizantonline-my.sharepoint.com/personal/2397807_cognizant_com/Documents/Microsoft%20Copilot%20Chat%20Files/markertselectionstep04.txt)

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold">Select Target Markets</h2>
        <p className="text-muted-foreground">
          Choose markets for "{asset.name}" localization. We'll analyze readiness and generate intelligence for each selected market.
        </p>
      </div>

      {/* Smart Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Smart Recommendations
          </CardTitle>
          <CardDescription>
            AI-powered market suggestions based on your asset type and strategic context
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {smartRecommendations.map((rec, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <rec.icon className="h-4 w-4 text-primary" />
                <div>
                  <div className="flex items-center gap-2">
                    {rec.markets.map(code => {
                      const market = brandMarkets.find(m => m.market_code === code);
                      return (
                        <Badge key={code} variant="outline">
                          {market?.market_name} ({code})
                        </Badge>
                      );
                    })}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{rec.reason}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{rec.confidence}% confidence</Badge>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleApplyRecommendation(rec.markets)}
                >
                  Apply
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Market Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            Available Markets
          </CardTitle>
          <CardDescription>
            Select target markets with real-time complexity indicators
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {brandMarkets.map((market) => {
              const complexity = getMarketComplexity(market.market_code, brandMarkets);
              const isSelected = selectedMarkets.includes(market.market_code);

              return (
                <div
                  key={market.market_code}
                  className={`p-4 border rounded-lg transition-colors ${
                    isSelected ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id={market.market_code}
                        checked={isSelected}
                        onCheckedChange={() => handleMarketToggle(market.market_code)}
                      />
                      <div>
                        <label htmlFor={market.market_code} className="font-medium cursor-pointer">
                          {market.market_name} ({market.market_code})
                        </label>
                        <p className="text-sm text-muted-foreground">{market.language_name}</p>
                        {market.is_primary_market && (
                          <Badge variant="secondary" className="mt-1">
                            Primary Market ({market.therapeutic_area_relevance}% relevance)
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={complexity.color}>{complexity.level}</Badge>
                      <Badge variant="outline">{complexity.estimatedWeeks}</Badge>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="mt-3 ml-8 space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Complexity Factors:</p>
                      {complexity.factors.map((factor, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <AlertCircle className="h-3 w-3 text-yellow-600" />
                          <span>{factor}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {selectedMarkets.length > 0 && (
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <span className="font-medium">Selection Summary:</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {selectedMarkets.length} market{selectedMarkets.length !== 1 ? 's' : ''} selected.
                Next step will generate comprehensive intelligence analysis for each market.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Step Actions */}
      <div className="flex justify-between">
        <div></div> {/* No previous step in simplified workflow */}
        <Button onClick={handleContinue} disabled={selectedMarkets.length === 0}>
          Continue to Intelligence Analysis
        </Button>
      </div>
    </div>
  );
};
