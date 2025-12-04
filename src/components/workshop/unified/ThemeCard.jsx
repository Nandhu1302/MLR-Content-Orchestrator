import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit2, Check, ChevronDown, ChevronUp, Trophy, Target, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export const ThemeCard = ({ 
  theme, 
  isSelected, 
  isRecommended, 
  onSelect,
  onTitleEdit 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(theme.name);
  const [showRationale, setShowRationale] = useState(false);

  const handleSave = () => {
    if (editedTitle.trim() && editedTitle !== theme.name) {
      onTitleEdit(editedTitle.trim());
    }
    setIsEditing(false);
  };

  // Extract tags from tone and best asset types
  const tags = [
    theme.tone && `🎨 ${theme.tone}`,
    theme.bestForAssets?.[0] && `📦 ${theme.bestForAssets[0]}`,
  ].filter(Boolean);

  return (
    <Card 
      className={cn(
        "p-4 cursor-pointer transition-all hover:shadow-md",
        isSelected && "ring-2 ring-primary shadow-lg bg-primary/5",
        isRecommended && "border-primary/50"
      )}
      onClick={() => !isEditing && onSelect()}
    >
      {/* Header with Title */}
      <div className="flex items-start gap-2 mb-2">
        {isRecommended && (
          <Trophy className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
        )}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              <Input
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="h-8 text-sm font-semibold"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSave();
                  if (e.key === 'Escape') setIsEditing(false);
                }}
              />
              <Button size="sm" variant="ghost" onClick={handleSave} className="h-8 w-8 p-0">
                <Check className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm leading-tight flex-1">{theme.name}</h3>
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
              >
                <Edit2 className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Key Message */}
      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
        {theme.keyMessage}
      </p>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {tags.map((tag, i) => (
            <Badge key={i} variant="outline" className="text-[10px] h-5 px-2">
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {/* Metrics */}
      <div className="flex items-center gap-3 mb-3 text-xs">
        <div className="flex items-center gap-1">
          <Target className="h-3 w-3 text-primary" />
          <span className="font-medium">{theme.performancePrediction?.engagementRate || 68}%</span>
          <span className="text-muted-foreground">engagement</span>
        </div>
        <div className="flex items-center gap-1">
          <TrendingUp className="h-3 w-3 text-green-600" />
          <span className="font-medium">{theme.performancePrediction?.confidence || 85}%</span>
          <span className="text-muted-foreground">confidence</span>
        </div>
      </div>

      {/* Expandable Rationale */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowRationale(!showRationale);
        }}
        className="w-full flex items-center justify-between text-xs text-primary hover:underline"
      >
        <span>Why this theme?</span>
        {showRationale ? (
          <ChevronUp className="h-3 w-3" />
        ) : (
          <ChevronDown className="h-3 w-3" />
        )}
      </button>

      {showRationale && (
        <div className="mt-2 pt-2 border-t">
          <p className="text-xs text-muted-foreground">
            {theme.rationale || 'This theme aligns with your audience, goals, and proven success patterns from similar campaigns.'}
          </p>
        </div>
      )}
    </Card>
  );
};