
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { FileText, Clock, CheckCircle2, Sparkles } from 'lucide-react';
// import type { AssetPackage } from '@/types/workshop'; // (Type import removed)

// interface AssetPreviewProps {
//   packages: AssetPackage[];
//   onGenerate: (selectedPackages: AssetPackage[]) => void;
//   isGenerating?: boolean;
// } // (Interface removed)

export const AssetPreview = ({ packages, onGenerate, isGenerating }) => {
  const [selectedAssetTypes, setSelectedAssetTypes] = useState(
    packages.map(p => p.assetType) // All selected by default
  );

  const toggleAssetSelection = (assetType) => {
    setSelectedAssetTypes(prev =>
      prev.includes(assetType)
        ? prev.filter(t => t !== assetType)
        : [...prev, assetType]
    );
  };

  const selectedPackages = packages.filter(p => selectedAssetTypes.includes(p.assetType));
  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Ready to Generate</h3>
      </div>

      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Based on your selected theme, we'll generate the following assets:
        </p>

        {packages.map((pkg, idx) => (
          <div key={idx} className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg border-2 transition-colors"
            style={{
              borderColor: selectedAssetTypes.includes(pkg.assetType) ? 'hsl(var(--primary))' : 'transparent'
            }}>
            <Checkbox
              checked={selectedAssetTypes.includes(pkg.assetType)}
              onCheckedChange={() => toggleAssetSelection(pkg.assetType)}
              className="mt-1"
            />
            <FileText className="h-5 w-5 text-primary mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-sm">{pkg.assetName}</h4>
                <Badge variant="outline" className="text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  {pkg.estimatedCompletionTime}
                </Badge>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-2">
                <Badge variant="secondary" className="text-xs">
                  {pkg.attachedClaims.length} Claims
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {pkg.attachedVisuals.length} Visuals
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {pkg.attachedModules.length} Modules
                </Badge>
              </div>

              <p className="text-xs text-muted-foreground">
                Type: {pkg.assetType.replace(/-/g, ' ')}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t space-y-2">
        {selectedPackages.length < packages.length && (
          <p className="text-xs text-muted-foreground text-center">
            {selectedPackages.length} of {packages.length} assets selected
          </p>
        )}
        <Button 
          className="w-full" 
          size="lg"
          onClick={() => onGenerate(selectedPackages)}
          disabled={isGenerating || selectedPackages.length === 0}
        >
          {isGenerating ? (
            <>
              <Clock className="h-4 w-4 mr-2 animate-spin" />
              Generating Content...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Selected ({selectedPackages.length})
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};
