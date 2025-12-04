
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertCircle, CheckCircle, Info, TrendingUp } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useIntelligentAssetFiltering } from '@/hooks/useIntelligentAssetFiltering';

export const EnhancedAssetSelection = ({
  primaryAudience,
  selectedAssetTypes,
  onAssetSelectionChange,
  intakeData
}) => {
  const {
    allowedAssets,
    filteredAssets,
    assetDescriptions,
    smartRecommendations,
    audienceGuidance
  } = useIntelligentAssetFiltering(primaryAudience, intakeData);

  const handleAssetToggle = (assetType, isChecked) => {
    if (isChecked) {
      onAssetSelectionChange([...selectedAssetTypes, assetType]);
    } else {
      onAssetSelectionChange(selectedAssetTypes.filter((type) => type !== assetType));
    }
  };

  const handleRecommendedSelection = () => {
    const newSelection = [...new Set([...selectedAssetTypes, ...smartRecommendations.recommended])];
    onAssetSelectionChange(newSelection);
  };

  if (!primaryAudience) {
    return <div>{audienceGuidance}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Audience Guidance */}
      <div>{audienceGuidance}</div>

      {/* Smart Recommendations */}
      {smartRecommendations.recommended.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Smart Recommendations</CardTitle>
            <CardDescription>
              Based on your audience and campaign objectives, we recommend these asset types:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {smartRecommendations.recommended.map((assetType) => (
                <div key={assetType} className="flex items-center justify-between">
                  <span>{assetDescriptions[assetType]?.name || assetType}</span>
                  <Badge variant="secondary">Recommended</Badge>
                </div>
              ))}
            </div>
            {smartRecommendations.recommended.some((asset) => !selectedAssetTypes.includes(asset)) && (
              <Button onClick={handleRecommendedSelection} className="mt-4">
                Select All Recommended Assets
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Smart Warnings */}
      {smartRecommendations.warnings.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <ul className="list-disc pl-4">
              {smartRecommendations.warnings.map((warning, index) => (
                <li key={index}>{warning}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Available Assets */}
      <Card>
        <CardHeader>
          <CardTitle>Available Asset Types</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {allowedAssets.map((assetType) => {
            const description = assetDescriptions[assetType];
            if (!description) return null;
            const isSelected = selectedAssetTypes.includes(assetType);
            const isRecommended = smartRecommendations.recommended.includes(assetType);

            return (
              <div key={assetType} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) => handleAssetToggle(assetType, !!checked)}
                  />
                  <span className="font-medium">{description.name}</span>
                  {isRecommended && <Badge variant="secondary">Recommended</Badge>}
                </div>
                <p className="text-sm text-muted-foreground">{description.description}</p>
                {description.examples.length > 0 && (
                  <p className="text-xs">
                    <strong>Examples:</strong> {description.examples.slice(0, 2).join(', ')}
                    {description.examples.length > 2 && '...'}
                  </p>
                )}
                <p className="text-xs">
                  <strong>Reasoning:</strong> {description.reasoning}
                </p>
                {description.complianceNotes.length > 0 && (
                  <div className="text-xs">
                    <strong>Compliance Notes:</strong>
                    <ul className="list-disc pl-4">
                      {description.complianceNotes.map((note, index) => (
                        <li key={index}>{note}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Alternative Options */}
      {(filteredAssets.length > 0 || smartRecommendations.alternatives.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle>Alternative Options (May require additional consideration)</CardTitle>
          </CardHeader>
          <CardContent>
            {[...filteredAssets, ...smartRecommendations.alternatives]
              .filter((item, index, arr) => arr.indexOf(item) === index)
              .map((assetType) => {
                const description = assetDescriptions[assetType];
                if (!description) return null;
                return (
                  <div key={assetType} className="space-y-1">
                    <span className="font-medium">{description.name}</span>
                    <p className="text-xs text-muted-foreground">{description.reasoning}</p>
                  </div>
                );
              })}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
