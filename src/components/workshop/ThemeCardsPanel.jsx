
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, TrendingUp, Target, MessageSquare, CheckCircle2 } from 'lucide-react';
// import type { ThemeOption } from '@/types/workshop'; // (Type-only import removed)

/*
interface ThemeCardsPanelProps {
  themes: ThemeOption[];
  selectedTheme: ThemeOption | null;
  onThemeSelect: (theme: ThemeOption) => void;
}
*/

export const ThemeCardsPanel = ({ themes, selectedTheme, onThemeSelect }) => {
  const getToneColor = (tone /*: string*/) => {
    const toneMap /*: Record<string, string>*/ = {
      clinical: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
      professional: 'bg-purple-500/10 text-purple-700 border-purple-500/20',
      empowering: 'bg-green-500/10 text-green-700 border-green-500/20',
      educational: 'bg-orange-500/10 text-orange-700 border-orange-500/20',
      empathetic: 'bg-pink-500/10 text-pink-700 border-pink-500/20',
    };
    return toneMap[tone.toLowerCase()] || 'bg-muted';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Recommended Strategic Themes</h3>
      </div>
      <p className="text-sm text-muted-foreground">
        Select the theme that best matches your objectives
      </p>

      <div className="grid gap-4">
        {themes.map((theme) => {
          const isSelected = selectedTheme?.id === theme.id;
          
          return (
            <Card
              key={theme.id}
              className={`p-5 cursor-pointer transition-all hover:border-primary/50 ${
                isSelected ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : ''
              }`}
              onClick={() => onThemeSelect(theme)}
            >
              {/* Header with Performance */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-lg font-semibold">{theme.name}</h4>
                    {isSelected && <CheckCircle2 className="h-5 w-5 text-primary" />}
                  </div>
                  <Badge variant="outline" className={getToneColor(theme.tone)}>
                    {theme.tone}
                  </Badge>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-1 text-xl font-bold text-primary">
                    <TrendingUp className="h-4 w-4" />
                    {Math.round(theme.performancePrediction.engagementRate)}%
                  </div>
                  <p className="text-xs text-muted-foreground">engagement</p>
                  <Badge variant="secondary" className="mt-1 text-xs">
                    {Math.round(theme.performancePrediction.confidence)}% confidence
                  </Badge>
                </div>
              </div>

              {/* Key Message */}
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-1">
                  <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">Key Message</span>
                </div>
                <p className="text-sm pl-5">{theme.keyMessage}</p>
              </div>

              {/* CTA */}
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">Call to Action</span>
                </div>
                <p className="text-sm pl-5 font-medium">{theme.cta}</p>
              </div>

              {/* Best For */}
              <div className="mb-3 pb-3 border-b">
                <div className="flex flex-wrap gap-2">
                  {theme.bestForAssets.slice(0, 3).map((asset, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {asset.replace(/-/g, ' ')}
                    </Badge>
                  ))}
                  {theme.recommendedVisuals && theme.recommendedVisuals.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {theme.supportingClaims.length} claims • {theme.recommendedVisuals.length} visuals
                    </Badge>
                  )}
                </div>
              </div>

              {/* Rationale */}
              <p className="text-xs text-muted-foreground italic mb-3">
                {theme.rationale}
              </p>

              {/* Data Basis */}
              <div className="text-xs text-muted-foreground mb-3">
                <span className="font-medium">Based on:</span> {theme.performancePrediction.basis}
              </div>

              {/* Select Button */}
              {!isSelected && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    onThemeSelect(theme);
                  }}
                >
                  Select This Theme
                </Button>
              )}
              {isSelected && (
                <div className="flex items-center justify-center gap-2 py-2 text-sm font-medium text-primary">
                  <CheckCircle2 className="h-4 w-4" />
                  Selected
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};
