import { Badge } from '@/components/ui/badge';
import { Brain, Zap, Shield, Users, Database, TrendingUp, Target } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// Removed interface CategoryBreakdown
// Removed interface IntelligenceSummaryBadgeProps

const CATEGORY_ICONS = {
  evidence: { icon: Shield, color: 'text-blue-600', label: 'Claims' },
  audience: { icon: Users, color: 'text-orange-600', label: 'Audience' },
  brand: { icon: Database, color: 'text-pink-600', label: 'Brand' },
  performance: { icon: TrendingUp, color: 'text-green-600', label: 'Performance' },
  competitive: { icon: Target, color: 'text-purple-600', label: 'Competitive' },
};

export const IntelligenceSummaryBadge = ({ 
  totalReferences, 
  activeLayersCount,
  qualityScore,
  categoryBreakdown
}) => { // Removed : IntelligenceSummaryBadgeProps
  if (totalReferences === 0) return null;

  // Build breakdown text for tooltip
  const breakdownItems = categoryBreakdown 
    ? Object.entries(categoryBreakdown)
        .filter(([_, count]) => count && count > 0)
        .map(([type, count]) => ({
          type,
          count,
          ...CATEGORY_ICONS[type]
        }))
    : [];

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="secondary" className="gap-1.5 cursor-help">
            <Brain className="w-3 h-3" />
            <span className="font-semibold">{totalReferences}</span>
            <span className="text-muted-foreground">data points</span>
            {qualityScore && (
              <>
                <span className="text-muted-foreground">•</span>
                <Zap className="w-3 h-3 text-yellow-500" />
                <span className="font-semibold">{qualityScore}%</span>
              </>
            )}
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          <div className="text-xs space-y-2">
            <p className="font-semibold">Intelligence-Backed Content</p>
            <p className="text-muted-foreground">
              Your content is backed by {totalReferences} verified data points
            </p>
            
            {breakdownItems.length > 0 && (
              <div className="pt-2 border-t border-border/50 space-y-1">
                {breakdownItems.map(item => {
                  // Renaming Icon component for correct JSX rendering (using PascalCase for components)
                  const Icon = item.icon;
                  return (
                    <div key={item.type} className="flex items-center gap-2">
                      <Icon className={`w-3 h-3 ${item.color}`} />
                      <span>{item.count} {item.label}</span>
                    </div>
                  );
                })}
              </div>
            )}
            
            {qualityScore && (
              <p className="pt-1">Quality Score: {qualityScore}%</p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};