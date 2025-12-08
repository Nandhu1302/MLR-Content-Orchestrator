import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertCircle, CheckCircle, Info, TrendingUp } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useIntelligentAssetFiltering } from '@/hooks/useIntelligentAssetFiltering';
// Type imports removed
// import type { AssetType, AudienceType, IntakeData } from '@/types/intake';

// Interface and type annotations removed
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

  // Type annotations removed
  const handleAssetToggle = (assetType, isChecked) => {
    if (isChecked) {
      onAssetSelectionChange([...selectedAssetTypes, assetType]);
    } else {
      onAssetSelectionChange(selectedAssetTypes.filter(type => type !== assetType));
    }
  };

  const handleRecommendedSelection = () => {
    const newSelection = [...new Set([...selectedAssetTypes, ...smartRecommendations.recommended])];
    onAssetSelectionChange(newSelection);
  };

  if (!primaryAudience) {
    return (
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>{audienceGuidance}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Audience Guidance */}
      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>{audienceGuidance}</AlertDescription>
      </Alert>

      {/* Smart Recommendations */}
      {smartRecommendations.recommended.length > 0 && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Smart Recommendations
            </CardTitle>
            <CardDescription>
              Based on your audience and campaign objectives, we recommend these asset types
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {smartRecommendations.recommended.map(assetType => (
                <Badge key={assetType} variant="secondary" className="text-primary">
                  {assetDescriptions[assetType]?.name || assetType}
                </Badge>
              ))}
            </div>
            
            {smartRecommendations.recommended.some(asset => !selectedAssetTypes.includes(asset)) && (
              <Button 
                onClick={handleRecommendedSelection}
                variant="outline"
                className="w-full"
              >
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
            <ul className="list-disc list-inside space-y-1">
              {smartRecommendations.warnings.map((warning, index) => (
                <li key={index}>{warning}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Available Assets */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Available Asset Types</h3>
        
        <div className="grid gap-4 md:grid-cols-2">
          {allowedAssets.map(assetType => {
            const description = assetDescriptions[assetType];
            if (!description) return null;

            const isSelected = selectedAssetTypes.includes(assetType);
            const isRecommended = smartRecommendations.recommended.includes(assetType);

            return (
              <TooltipProvider key={assetType}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Card 
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        isSelected ? 'ring-2 ring-primary' : ''
                      } ${isRecommended ? 'border-primary/40' : ''}`}
                      onClick={() => handleAssetToggle(assetType, !isSelected)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={(checked) => handleAssetToggle(assetType, !!checked)}
                            />
                            <CardTitle className="text-base">{description.name}</CardTitle>
                          </div>
                          {isRecommended && (
                            <Badge variant="default" className="text-xs">
                              Recommended
                            </Badge>
                          )}
                        </div>
                        <CardDescription className="text-sm">
                          {description.description}
                        </CardDescription>
                      </CardHeader>
                      
                      {description.examples.length > 0 && (
                        <CardContent className="pt-0">
                          <div className="text-xs text-muted-foreground">
                            <strong>Examples:</strong> {description.examples.slice(0, 2).join(', ')}
                            {description.examples.length > 2 && '...'}
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  </TooltipTrigger>
                  
                  <TooltipContent className="max-w-sm">
                    <div className="space-y-2">
                      <p><strong>Reasoning:</strong> {description.reasoning}</p>
                      {description.complianceNotes.length > 0 && (
                        <div>
                          <strong>Compliance Notes:</strong>
                          <ul className="list-disc list-inside text-xs mt-1">
                            {description.complianceNotes.map((note, index) => (
                              <li key={index}>{note}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>
      </div>

      {/* Alternative Options */}
      {(filteredAssets.length > 0 || smartRecommendations.alternatives.length > 0) && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-muted-foreground">
            Alternative Options
            <span className="text-sm font-normal ml-2">(May require additional consideration)</span>
          </h3>
          
          <div className="grid gap-3 md:grid-cols-2">
            {[...filteredAssets, ...smartRecommendations.alternatives]
              .filter((item, index, arr) => arr.indexOf(item) === index) // Remove duplicates
              .map(assetType => {
                const description = assetDescriptions[assetType];
                if (!description) return null;

                return (
                  <Card key={assetType} className="opacity-60 border-dashed">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                        {description.name}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {description.reasoning}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};