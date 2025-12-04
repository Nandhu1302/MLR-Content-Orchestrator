import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { FileText, Mail, Presentation, FileImage, Hash, Globe, TrendingUp, Clock, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const assetIcons = {
  'sales-aid': FileText,
  'email': Mail,
  'presentation-slides': Presentation,
  'leave-behind': FileImage,
  'social-post': Hash,
  'landing-page': Globe,
  'abstract': FileText,
  'poll-questions': TrendingUp,
};

const assetLabels = {
  'sales-aid': 'Sales Aid',
  'email': 'Email',
  'presentation-slides': 'Presentation',
  'leave-behind': 'Leave-Behind',
  'social-post': 'Social Post',
  'landing-page': 'Landing Page',
  'abstract': 'Abstract',
  'poll-questions': 'Poll Questions',
};

const effortColors = {
  Low: 'text-green-600 bg-green-50 dark:bg-green-950/30',
  Medium: 'text-amber-600 bg-amber-50 dark:bg-amber-950/30',
  High: 'text-red-600 bg-red-50 dark:bg-red-950/30',
};

export const AssetTypeCard = ({
  assetType,
  isSelected,
  isRecommended,
  metadata,
  claimsCount,
  visualsCount,
  onToggle,
}) => {
  const Icon = assetIcons[assetType] || FileText;
  const label = assetLabels[assetType] || assetType;

  return (
    <Card 
      className={cn(
        "p-3 cursor-pointer transition-all hover:shadow-sm",
        isSelected && "ring-1 ring-primary bg-primary/5",
        isRecommended && "border-primary/30"
      )}
      onClick={onToggle}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <Checkbox 
          checked={isSelected} 
          onCheckedChange={onToggle}
          className="mt-0.5"
        />

        {/* Icon */}
        <div className={cn(
          "p-1.5 rounded-md",
          isSelected ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
        )}>
          <Icon className="h-4 w-4" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium mb-1">{label}</h4>
          
          {/* Badges */}
          <div className="flex flex-wrap gap-1 mb-2">
            {metadata && (
              <>
                <Badge 
                  variant="outline" 
                  className={cn("text-[10px] h-4 px-1.5", effortColors[metadata.effort])}
                >
                  <Zap className="h-2.5 w-2.5 mr-0.5" />
                  {metadata.effort}
                </Badge>
                <Badge variant="outline" className="text-[10px] h-4 px-1.5">
                  <TrendingUp className="h-2.5 w-2.5 mr-0.5" />
                  {metadata.impact}%
                </Badge>
                <Badge variant="outline" className="text-[10px] h-4 px-1.5">
                  <Clock className="h-2.5 w-2.5 mr-0.5" />
                  {metadata.eta}
                </Badge>
              </>
            )}
          </div>

          {/* Claims/Visuals Preview */}
          <div className="text-[10px] text-muted-foreground">
            {claimsCount} claims · {visualsCount} visuals
          </div>
        </div>
      </div>
    </Card>
  );
};