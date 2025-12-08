import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Shield, 
  TrendingUp, 
  Target, 
  Users,
  Database,
  CheckCircle2,
  Circle,
  Loader2
} from 'lucide-react';
import { IntelligenceDonutChart } from './IntelligenceDonutChart';

// Removed interface IntelligenceItem
// Removed interface UnifiedIntelligenceCardProps

const CATEGORY_CONFIG = { // Removed : Record<string, {...
  evidence: {
    icon: Shield,
    color: 'text-blue-600',
    chartColor: '#2563eb',
    label: 'Evidence'
  },
  audience: {
    icon: Users,
    color: 'text-orange-600',
    chartColor: '#ea580c',
    label: 'Audience'
  },
  brand: {
    icon: Database,
    color: 'text-pink-600',
    chartColor: '#db2777',
    label: 'Brand'
  },
  performance: {
    icon: TrendingUp,
    color: 'text-green-600',
    chartColor: '#16a34a',
    label: 'Performance'
  },
  competitive: {
    icon: Target,
    color: 'text-purple-600',
    chartColor: '#9333ea',
    label: 'Competitive'
  }
};

export const UnifiedIntelligenceCard = ({ 
  intelligenceUsed, 
  qualityScore,
  isGenerating = false
}) => { // Removed : UnifiedIntelligenceCardProps
  // Group by type and count
  // Removed : Record<string, number> type assertion
  const categoryCounts = intelligenceUsed.reduce((acc, item) => {
    acc[item.type] = (acc[item.type] || 0) + 1;
    return acc;
  }, {});

  // Get evidence breakdown (claims vs refs vs visuals)
  const evidenceItems = intelligenceUsed.filter(i => i.type === 'evidence');
  const claimsCount = evidenceItems.filter(i => i.source?.toLowerCase().includes('claim')).length;
  const refsCount = evidenceItems.filter(i => i.source?.toLowerCase().includes('reference')).length;
  const visualsCount = evidenceItems.filter(i => i.source?.toLowerCase().includes('visual')).length;

  const totalCount = intelligenceUsed.length;
  const activeCategories = Object.keys(categoryCounts).length;

  // Prepare chart data
  const chartData = Object.entries(categoryCounts)
    .filter(([_, count]) => count > 0)
    .map(([type, count]) => ({
      name: CATEGORY_CONFIG[type]?.label || type,
      color: CATEGORY_CONFIG[type]?.chartColor || '#9ca3af', // Fixed property name
      value: count,
    }));

  // Categories to display (all 5, with counts)
  const allCategories = ['evidence', 'audience', 'brand', 'performance', 'competitive'];

  if (totalCount === 0 && !isGenerating) {
    return (
      <Card className="bg-muted/30">
        <CardContent className="py-8 text-center">
          <Brain className="w-8 h-8 mx-auto mb-2 opacity-50 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No intelligence used yet</p>
          <p className="text-xs text-muted-foreground mt-1">Generate content to see intelligence usage</p>
        </CardContent>
      </Card>
    );
  }

  if (isGenerating && totalCount === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
          <p className="text-sm text-muted-foreground">Analyzing intelligence...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Brain className="w-4 h-4 text-primary" />
            Intelligence Used
            {isGenerating && <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />}
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            {activeCategories}/5 layers
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-2">
        <div className="flex gap-4 items-start">
          {/* Donut Chart */}
          <div className="shrink-0">
            <IntelligenceDonutChart 
              data={chartData}
              totalCount={totalCount}
              qualityScore={qualityScore}
              size="sm"
            />
          </div>
          
          {/* Compact Category Summary */}
          <div className="flex-1 space-y-1.5">
            {allCategories.map(type => {
              const config = CATEGORY_CONFIG[type];
              const Icon = config.icon;
              const count = categoryCounts[type] || 0;
              const hasData = count > 0;
              
              // Special handling for evidence to show breakdown
              const isEvidence = type === 'evidence';
              
              return (
                <div 
                  key={type} 
                  className={`flex items-center gap-2 ${!hasData ? 'opacity-40' : ''}`}
                >
                  {hasData ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 shrink-0" />
                  ) : (
                    <Circle className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  )}
                  <Icon className={`w-3.5 h-3.5 ${hasData ? config.color : 'text-muted-foreground'} shrink-0`} />
                  
                  {hasData ? (
                    <span className="text-xs">
                      {isEvidence ? (
                        <span className="text-muted-foreground">
                          <span className="font-medium text-foreground">{claimsCount}</span> claims
                          {refsCount > 0 && <> • <span className="font-medium text-foreground">{refsCount}</span> refs</>}
                          {visualsCount > 0 && <> • <span className="font-medium text-foreground">{visualsCount}</span> visuals</>}
                        </span>
                      ) : (
                        <>
                          <span className="font-medium">{count}</span>
                          <span className="text-muted-foreground"> {config.label.toLowerCase()}</span>
                        </>
                      )}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">No {config.label.toLowerCase()}</span>
                  )}
                </div>
              );
            })}
            
            {/* Quality Score Bar */}
            {qualityScore !== undefined && (
              <div className="pt-2 mt-1 border-t border-border/50">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Quality</span>
                  <span className="font-medium">{qualityScore}%</span>
                </div>
                <div className="mt-1 h-1 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all"
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