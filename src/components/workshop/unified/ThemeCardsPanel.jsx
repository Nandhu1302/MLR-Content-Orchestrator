import { ThemeCard } from './ThemeCard';
import { Sparkles, Layers } from 'lucide-react';
import { Card } from '@/components/ui/card';

export const ThemeCardsPanel = ({
  themes,
  selectedTheme,
  isGenerating,
  onThemeSelect,
  onThemeTitleEdit,
}) => {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b bg-background/95 backdrop-blur">
        <div className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">Strategic Themes</h2>
          {themes.length > 0 && (
            <span className="text-xs text-muted-foreground">
              ({themes.length} options)
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Select the theme that best matches your vision
        </p>
      </div>

      {/* Theme Cards */}
      <div className="flex-1 overflow-y-auto p-4">
        {isGenerating ? (
          <Card className="p-8 flex flex-col items-center justify-center text-center min-h-[300px]">
            <Sparkles className="h-12 w-12 text-primary animate-pulse mb-3" />
            <h3 className="font-semibold mb-1">Generating Themes...</h3>
            <p className="text-sm text-muted-foreground">
              Analyzing intelligence to create strategic options
            </p>
          </Card>
        ) : themes.length === 0 ? (
          <Card className="p-8 flex flex-col items-center justify-center text-center min-h-[300px]">
            <Sparkles className="h-12 w-12 text-muted-foreground/30 mb-3" />
            <h3 className="font-semibold mb-1">No Themes Yet</h3>
            <p className="text-sm text-muted-foreground">
              Complete the conversation to generate theme recommendations
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {themes.map((theme, index) => (
              <ThemeCard
                key={theme.id || index}
                theme={theme}
                isSelected={selectedTheme?.id === theme.id}
                isRecommended={index === 0}
                onSelect={() => onThemeSelect(theme)}
                onTitleEdit={(newTitle) => onThemeTitleEdit(theme.id, newTitle)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};