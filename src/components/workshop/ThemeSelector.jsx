
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, TrendingUp, Target, MessageSquare } from 'lucide-react';
// import type { ThemeOption } from '@/types/workshop'; // (Type-only import removed)

/*
interface ThemeSelectorProps {
  themes: ThemeOption[];
  onThemeSelect: (theme: ThemeOption) => void;
}
*/

export const ThemeSelector = ({ themes, onThemeSelect }) => {
  const getToneColor = (tone) => {
    const toneMap = {
      clinical: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
      professional: 'bg-purple-500/10 text-purple-700 border-purple-500/20',
      empowering: 'bg-green-500/10 text-green-700 border-green-500/20',
      educational: 'bg-orange-500/10 text-orange-700 border-orange-500/20',
    };
    return toneMap[tone.toLowerCase()] || 'bg-muted';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Select Your Strategic Theme</h3>
      </div>

      <div className="grid gap-4">
        {themes.map((theme) => (
          <Card 
            key={theme.id} 
            className="p-6 hover:border-primary/50 transition-all cursor-pointer group"
            onClick={() => onThemeSelect(theme)}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h4 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                  {theme.name}
                </h4>
                <Badge variant="outline" className={getToneColor(theme.tone)}>
                  {theme.tone}
                </Badge>
              </div>
              
              {/* Performance Prediction */}
              <div className="text-right">
                <div className="flex items-center gap-1 text-2xl font-bold text-primary">
                  <TrendingUp className="h-5 w-5" />
                  {Math.round(theme.performancePrediction.engagementRate)}%
                </div>
                <p className="text-xs text-muted-foreground">predicted engagement</p>
                <Badge variant="secondary" className="mt-1 text-xs">
                  {Math.round(theme.performancePrediction.confidence)}% confidence
                </Badge>
              </div>
            </div>

            {/* Key Message */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Key Message</span>
              </div>
              <p className="text-sm text-muted-foreground pl-6">
                {theme.keyMessage}
              </p>
            </div>

            {/* CTA */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Call to Action</span>
              </div>
              <p className="text-sm text-muted-foreground pl-6 font-medium">
                {theme.cta}
              </p>
            </div>

            {/* Best For Assets */}
            <div className="mb-4">
              <span className="text-xs font-medium text-muted-foreground block mb-2">
                Best for:
              </span>
              <div className="flex flex-wrap gap-2">
                {theme.bestForAssets.map((asset, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {asset === 'presentation' && '🎤'}
                    {asset === 'digital-sales-aid' && '📊'}
                    {asset === 'email' && '📧'}
                    {asset === 'leave-behind' && '📄'}
                    {' '}{asset.replace(/-/g, ' ')}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Rationale */}
            <div className="mb-4 pt-3 border-t">
              <p className="text-xs text-muted-foreground italic">
                {theme.rationale}
              </p>
            </div>

            {/* Basis */}
            <div className="text-xs text-muted-foreground mb-4">
              <span className="font-medium">Data Basis:</span> {theme.performancePrediction.basis}
            </div>

            {/* Select Button */}
            <Button 
              className="w-full group-hover:bg-primary group-hover:text-primary-foreground"
              onClick={() => onThemeSelect(theme)}
            >
              Select This Theme
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};
