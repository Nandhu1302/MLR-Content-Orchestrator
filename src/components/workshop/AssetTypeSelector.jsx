
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Mail, FileText, MessageSquare, Presentation, Globe, Users, TrendingUp } from 'lucide-react';
// import type { AssetPackage } from '@/types/workshop'; // (Type-only import removed)

/*
interface AssetTypeOption {
  id: string;
  label: string;
  icon: any;
  channel: string;
  performanceLift?: string;
  effort: 'low' | 'medium' | 'high';
  recommended?: boolean;
}

interface AssetTypeSelectorProps {
  initiativeType: 'single' | 'campaign';
  selectedTypes: string[];
  channelPreferences?: string[];
  onToggle: (typeId: string) => void;
}
*/

const ASSET_TYPE_OPTIONS = [
  { id: 'mass-email', label: 'Email', icon: Mail, channel: 'Email', effort: 'low', performanceLift: '+18%' },
  { id: 'website-landing-page', label: 'Landing Page', icon: Globe, channel: 'Website', effort: 'medium', performanceLift: '+25%' },
  { id: 'social-media-post', label: 'Social Post', icon: MessageSquare, channel: 'Social', effort: 'low', performanceLift: '+12%' },
  { id: 'digital-sales-aid', label: 'Digital Sales Aid', icon: Presentation, channel: 'Rep-Enabled', effort: 'high', performanceLift: '+32%' },
  { id: 'blog', label: 'Blog Post', icon: FileText, channel: 'Website', effort: 'medium' },
  { id: 'rep-triggered-email', label: 'Rep-Triggered Email', icon: Users, channel: 'Rep-Enabled', effort: 'medium' },
];

export const AssetTypeSelector = ({
  initiativeType,
  selectedTypes,
  channelPreferences = [],
  onToggle,
}) => {
  // Mark asset types as recommended based on channel preferences
  const optionsWithRecommendations = ASSET_TYPE_OPTIONS.map(opt => ({
    ...opt,
    recommended: channelPreferences.some(pref => 
      pref.toLowerCase().includes(opt.channel.toLowerCase())
    ),
  }));

  const getEffortBadge = (effort) => {
    const colors = {
      low: 'bg-green-500/10 text-green-700 border-green-500/20',
      medium: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20',
      high: 'bg-red-500/10 text-red-700 border-red-500/20',
    };
    return colors[effort];
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">
          {initiativeType === 'single' ? 'Select Asset Type' : 'Select Asset Types'}
        </h3>
        <p className="text-sm text-muted-foreground">
          {channelPreferences.length > 0 
            ? `Recommended based on audience preferences: ${channelPreferences.join(', ')}`
            : 'Choose the types of content you want to create'
          }
        </p>
      </div>

      <div className="grid gap-3">
        {optionsWithRecommendations.map((option) => {
          const Icon = option.icon;
          const isSelected = selectedTypes.includes(option.id);
          
          return (
            <Card
              key={option.id}
              className={`p-4 cursor-pointer transition-all hover:border-primary/50 ${
                isSelected ? 'border-primary bg-primary/5' : ''
              } ${option.recommended ? 'border-green-500/30' : ''}`}
              onClick={() => {
                if (initiativeType === 'single') {
                  onToggle(option.id);
                } else {
                  onToggle(option.id);
                }
              }}
            >
              <div className="flex items-center gap-4">
                {initiativeType === 'campaign' && (
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => onToggle(option.id)}
                  />
                )}
                
                <div className={`p-2 rounded-lg ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  <Icon className="h-5 w-5" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{option.label}</span>
                    {option.recommended && (
                      <Badge variant="outline" className="text-xs bg-green-500/10 text-green-700 border-green-500/20">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Recommended
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{option.channel}</span>
                    <span>•</span>
                    <Badge variant="outline" className={getEffortBadge(option.effort)}>
                      {option.effort} effort
                    </Badge>
                    {option.performanceLift && (
                      <>
                        <span>•</span>
                        <span className="text-green-600 font-medium">{option.performanceLift} lift</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {initiativeType === 'campaign' && selectedTypes.length > 0 && (
        <Card className="p-4 bg-muted/50">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Selected:</span>
            <span className="font-semibold">{selectedTypes.length} asset types</span>
          </div>
        </Card>
      )}
    </div>
  );
};
