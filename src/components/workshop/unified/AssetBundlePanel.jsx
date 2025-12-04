import { useState, useEffect } from 'react';
import { AssetTypeCard } from './AssetTypeCard';
import { Button } from '@/components/ui/button';
import { Package, Sparkles, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { getRecommendedAssetTypesForActivities } from '@/config/activityAssetMappings';

// Asset type metadata
const assetMetadata = {
  'sales-aid': { effort: 'High', impact: 95, eta: '2-3 days' },
  'email': { effort: 'Low', impact: 75, eta: '2-4 hours' },
  'presentation-slides': { effort: 'High', impact: 90, eta: '1-2 days' },
  'leave-behind': { effort: 'Medium', impact: 70, eta: '1 day' },
  'social-post': { effort: 'Low', impact: 60, eta: '1-2 hours' },
  'landing-page': { effort: 'Medium', impact: 80, eta: '1 day' },
  'abstract': { effort: 'Medium', impact: 85, eta: '4-6 hours' },
  'poll-questions': { effort: 'Low', impact: 65, eta: '1 hour' },
};

export const AssetBundlePanel = ({
  selectedTheme,
  intelligence,
  context,
  onAssetTypesSelect,
  onGenerateAssets,
}) => {
  const [selectedAssetTypes, setSelectedAssetTypes] = useState([]);

  // Derive recommended asset types from activities
  const activities = context.detectedIntent?.activities || [];
  const assetRecommendations = getRecommendedAssetTypesForActivities(activities);
  const recommendedTypes = assetRecommendations.primary;
  const optionalTypes = assetRecommendations.secondary;

  // Auto-select recommended types when theme is selected
  useEffect(() => {
    if (selectedTheme && recommendedTypes.length > 0) {
      setSelectedAssetTypes(recommendedTypes);
      onAssetTypesSelect(recommendedTypes);
    }
  }, [selectedTheme, recommendedTypes.join(',')]);

  const handleToggle = (assetType) => {
    const newSelection = selectedAssetTypes.includes(assetType)
      ? selectedAssetTypes.filter(t => t !== assetType)
      : [...selectedAssetTypes, assetType];
    
    setSelectedAssetTypes(newSelection);
    onAssetTypesSelect(newSelection);
  };

  // Calculate total estimated time
  const totalHours = selectedAssetTypes.reduce((acc, type) => {
    const meta = assetMetadata[type];
    if (!meta) return acc;
    
    const hours = meta.eta.includes('hour') 
      ? parseInt(meta.eta) 
      : parseInt(meta.eta) * 8; // Convert days to hours
    return acc + hours;
  }, 0);

  const claimsCount = intelligence?.claims.length || 0;
  const visualsCount = intelligence?.visuals.length || 0;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b bg-background/95 backdrop-blur">
        <div className="flex items-center gap-2 mb-1">
          <Package className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">Asset Bundle</h2>
        </div>
        <p className="text-xs text-muted-foreground">
          Select assets to generate
        </p>
      </div>

      {/* Asset Type Cards */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {!selectedTheme ? (
          <Card className="p-6 text-center">
            <Package className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              Select a theme to see recommended assets
            </p>
          </Card>
        ) : (
          <>
            {/* Recommended Assets */}
            {recommendedTypes.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-primary">
                    Recommended
                  </h3>
                </div>
                <div className="space-y-2">
                  {recommendedTypes.map(type => (
                    <AssetTypeCard
                      key={type}
                      assetType={type}
                      isSelected={selectedAssetTypes.includes(type)}
                      isRecommended={true}
                      metadata={assetMetadata[type]}
                      claimsCount={claimsCount}
                      visualsCount={visualsCount}
                      onToggle={() => handleToggle(type)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Optional Assets */}
            {optionalTypes.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                  Optional
                </h3>
                <div className="space-y-2">
                  {optionalTypes.map(type => (
                    <AssetTypeCard
                      key={type}
                      assetType={type}
                      isSelected={selectedAssetTypes.includes(type)}
                      isRecommended={false}
                      metadata={assetMetadata[type]}
                      claimsCount={claimsCount}
                      visualsCount={visualsCount}
                      onToggle={() => handleToggle(type)}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer with Total & Generate */}
      {selectedTheme && selectedAssetTypes.length > 0 && (
        <div className="p-4 border-t bg-muted/30">
          <div className="flex items-center justify-between text-xs mb-3">
            <span className="text-muted-foreground">Estimated Time:</span>
            <div className="flex items-center gap-1 font-medium">
              <Clock className="h-3 w-3" />
              {totalHours < 8 ? `${totalHours}h` : `${Math.ceil(totalHours / 8)}d`}
            </div>
          </div>
          <Button 
            className="w-full" 
            size="sm"
            onClick={onGenerateAssets}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Generate All Selected
          </Button>
        </div>
      )}
    </div>
  );
};