import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  TrendingUp, 
  Target, 
  Users,
  Database,
  HelpCircle,
  CheckCircle2,
  Circle
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { IntelligenceDonutChart } from './IntelligenceDonutChart';

// TypeScript interfaces removed

const CATEGORY_CONFIG = {
  evidence: {
    icon: Shield,
    color: 'text-blue-600',
    chartColor: '#2563eb',
    description: 'Clinical claims & references from approved sources'
  },
  audience: {
    icon: Users,
    color: 'text-orange-600',
    chartColor: '#ea580c',
    description: 'Audience insights and preferences'
  },
  brand: {
    icon: Database,
    color: 'text-pink-600',
    chartColor: '#db2777',
    description: 'Brand guidelines and messaging framework'
  },
  performance: {
    icon: TrendingUp,
    color: 'text-green-600',
    chartColor: '#16a34a',
    description: 'Historical success patterns'
  },
  competitive: {
    icon: Target,
    color: 'text-purple-600',
    chartColor: '#9333ea',
    description: 'Market positioning data'
  }
};

const IntelligenceSummaryCard = ({ 
  categories, 
  qualityScore,
  showDonutChart = true,
  compact = false
}) => {
  const totalCount = categories.reduce((sum, cat) => sum + cat.count, 0);
  
  // Prepare chart data
  const chartData = categories
    .filter(cat => cat.count > 0)
    .map(cat => ({
      name: cat.label,
      value: cat.count,
      color: CATEGORY_CONFIG[cat.type]?.chartColor || '#9ca3af'
    }));

  // Separate categories with data from those without
  const categoriesWithData = categories.filter(cat => cat.count > 0);
  const categoriesWithoutData = categories.filter(cat => cat.count === 0);

  if (totalCount === 0) {
    return (
      <Card className="bg-muted/30">
        <CardContent className="py-6 text-center">
          <p className="text-sm text-muted-foreground">No intelligence data used</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            Intelligence Backing
          </CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-muted-foreground hover:text-foreground transition-colors">
                  <HelpCircle className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="left" className="max-w-xs">
                <div className="space-y-2 text-xs">
                  <p className="font-semibold">What does this mean?</p>
                  <p>Your content is backed by {totalCount} verified data points from your intelligence library. This ensures accuracy and compliance.</p>
                  <div className="pt-1 border-t border-border/50 mt-2">
                    {categoriesWithData.map(cat => (
                      <div key={cat.type} className="flex items-center gap-1.5 mt-1">
                        <div 
                          className="w-2 h-2 rounded-full" 
                          style={{ backgroundColor: CATEGORY_CONFIG[cat.type]?.chartColor }}
                        />
                        <span>{cat.label}: {cat.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      
      <CardContent className="pt-2">
        <div className={`flex ${compact ? 'flex-col gap-4' : 'gap-6'} items-center`}>
          {/* Donut Chart */}
          {showDonutChart && (
            <div className="shrink-0">
              <IntelligenceDonutChart 
                data={chartData}
                totalCount={totalCount}
                qualityScore={qualityScore}
                size={compact ? 'sm' : 'md'}
              />
            </div>
          )}
          
          {/* Category List */}
          <div className="flex-1 space-y-2 w-full">
            {/* Categories with data */}
            {categoriesWithData.map(cat => {
              const config = CATEGORY_CONFIG[cat.type];
              const Icon = config?.icon || Shield;
              
              return (
                <div key={cat.type} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                  <Icon className={`w-4 h-4 ${config?.color} shrink-0`} />
                  <span className="text-sm font-medium">{cat.count}</span>
                  <span className="text-sm text-muted-foreground">{cat.label}</span>
                </div>
              );
            })}
            
            {/* Categories without data - show as muted */}
            {categoriesWithoutData.map(cat => {
              const config = CATEGORY_CONFIG[cat.type];
              const Icon = config?.icon || Shield;
              
              return (
                <div key={cat.type} className="flex items-center gap-2 opacity-50">
                  <Circle className="w-4 h-4 text-muted-foreground shrink-0" />
                  <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="text-sm text-muted-foreground">No {cat.label.toLowerCase()}</span>
                </div>
              );
            })}
            
            {/* Quality Score */}
            {qualityScore !== undefined && (
              <div className="pt-2 mt-2 border-t border-border/50">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Quality Score</span>
                  <Badge 
                    variant={qualityScore >= 80 ? "default" : qualityScore >= 60 ? "secondary" : "outline"}
                    className="text-xs"
                  >
                    {qualityScore}%
                  </Badge>
                </div>
                <div className="mt-1.5 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${qualityScore}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// FIX: Named export
export { IntelligenceSummaryCard };