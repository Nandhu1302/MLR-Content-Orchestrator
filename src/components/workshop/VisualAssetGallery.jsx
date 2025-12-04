
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Image, ShieldCheck } from 'lucide-react';
// import type { MatchedVisual } from '@/services/intelligence'; // Removed type-only import

/*
interface VisualAssetGalleryProps {
  visuals: MatchedVisual[];
  selectedVisuals: string[];
  onVisualToggle: (visualId: string) => void;
}
*/

export const VisualAssetGallery = ({
  visuals,
  selectedVisuals,
  onVisualToggle
}) => {
  return (
    <div className="grid grid-cols-2 gap-3 pt-4">
      {visuals.map(visual => (
        <div
          key={visual.id}
          className="relative p-3 border rounded-lg hover:bg-accent/50 transition-colors"
        >
          <div className="flex items-start gap-3">
            <Checkbox
              checked={selectedVisuals.includes(visual.id)}
              onCheckedChange={() => onVisualToggle(visual.id)}
              className="mt-1"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-12 w-12 rounded bg-accent flex items-center justify-center shrink-0">
                  <Image className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{visual.asset_name}</p>
                  <Badge variant="outline" className="text-xs mt-1">
                    {visual.asset_type}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {visual.mlr_approved && (
                  <Badge variant="secondary" className="text-xs">
                    <ShieldCheck className="h-3 w-3 mr-1" />
                    MLR
                  </Badge>
                )}
                <Badge 
                  variant="outline" 
                  className="text-xs"
                  style={{
                    backgroundColor: `hsl(var(--primary) / ${visual.relevance_score * 0.2})`,
                  }}
                >
                  {Math.round(visual.relevance_score * 100)}% match
                </Badge>
              </div>
            </div>
          </div>
        </div>
      ))}

      {visuals.length === 0 && (
        <div className="col-span-2 text-center py-8 text-muted-foreground">
          <Image className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>No visual assets matched yet</p>
        </div>
      )}
    </div>
  );
};
