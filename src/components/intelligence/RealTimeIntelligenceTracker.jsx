import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Brain, 
  Database, 
  TrendingUp, 
  Target, 
  Users,
  Shield,
  CheckCircle2,
  Loader2
} from 'lucide-react';

// TypeScript interfaces removed

const INTELLIGENCE_ICONS = {
  evidence: Shield,
  performance: TrendingUp,
  competitive: Target,
  audience: Users,
  brand: Database
};

const INTELLIGENCE_COLORS = {
  evidence: 'text-blue-600',
  performance: 'text-green-600',
  competitive: 'text-purple-600',
  audience: 'text-orange-600',
  brand: 'text-pink-600'
};

const INTELLIGENCE_BG_COLORS = {
  evidence: 'bg-blue-50',
  performance: 'bg-green-50',
  competitive: 'bg-purple-50',
  audience: 'bg-orange-50',
  brand: 'bg-pink-50'
};

const INTELLIGENCE_LABELS = {
  evidence: 'Evidence',
  performance: 'Performance',
  competitive: 'Competitive',
  audience: 'Audience',
  brand: 'Brand'
};

const RealTimeIntelligenceTracker = ({ 
  intelligenceUsed, 
  isGenerating,
  totalLayers = 5 
}) => {
  
  // Group intelligence by type
  const groupedIntelligence = intelligenceUsed.reduce((acc, item) => {
    if (!acc[item.type]) {
      acc[item.type] = [];
    }
    acc[item.type].push(item);
    return acc;
  }, {}); // Initial value type annotation removed

  // Further break down evidence by source type for clearer display
  const getEvidenceBreakdown = (items) => { // Type annotation removed
    const claims = items.filter(i => i.source?.toLowerCase().includes('claim'));
    const references = items.filter(i => i.source?.toLowerCase().includes('reference'));
    const visuals = items.filter(i => i.source?.toLowerCase().includes('visual'));
    const other = items.filter(i => 
      !i.source?.toLowerCase().includes('claim') && 
      !i.source?.toLowerCase().includes('reference') && 
      !i.source?.toLowerCase().includes('visual')
    );
    return { claims, references, visuals, other };
  };

  const activeLayers = Object.keys(groupedIntelligence).length;
  const layerProgress = (activeLayers / totalLayers) * 100;

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Brain className="w-5 h-5 text-primary" />
            Intelligence Usage
            {isGenerating && (
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            )}
          </CardTitle>
          <Badge variant={isGenerating ? "default" : "secondary"}>
            {activeLayers} / {totalLayers} Layers Active
          </Badge>
        </div>
        
        {/* Overall Progress */}
        <div className="space-y-2 pt-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Intelligence Coverage</span>
            <span>{Math.round(layerProgress)}%</span>
          </div>
          <Progress value={layerProgress} className="h-2" />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Intelligence Layers */}
        {Object.entries(groupedIntelligence).map(([type, items]) => {
          const Icon = INTELLIGENCE_ICONS[type];
          const color = INTELLIGENCE_COLORS[type];
          const bgColor = INTELLIGENCE_BG_COLORS[type];
          const label = INTELLIGENCE_LABELS[type];
          
          // For evidence type, show breakdown
          const isEvidence = type === 'evidence';
          const breakdown = isEvidence ? getEvidenceBreakdown(items) : null;
          
          return (
            <div key={type} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${color}`} />
                  <span className="font-medium text-sm">{label}</span>
                  {isEvidence && breakdown ? (
                    <div className="flex items-center gap-1">
                      {breakdown.claims.length > 0 && (
                        <Badge variant="outline" className="text-xs">
                          {breakdown.claims.length} claims
                        </Badge>
                      )}
                      {breakdown.references.length > 0 && (
                        <Badge variant="outline" className="text-xs">
                          {breakdown.references.length} refs
                        </Badge>
                      )}
                      {breakdown.visuals.length > 0 && (
                        <Badge variant="outline" className="text-xs">
                          {breakdown.visuals.length} visuals
                        </Badge>
                      )}
                      {breakdown.other.length > 0 && (
                        <Badge variant="outline" className="text-xs">
                          {breakdown.other.length} other
                        </Badge>
                      )}
                    </div>
                  ) : (
                    <Badge variant="outline" className="text-xs">
                      {items.length} {items.length === 1 ? 'item' : 'items'}
                    </Badge>
                  )}
                </div>
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              </div>
              
              {/* Items used from this layer - show max 5 to reduce clutter */}
              <div className="space-y-2 ml-6">
                {items.slice(0, 5).map((item, idx) => (
                  <div 
                    key={`${item.id}-${idx}`} 
                    className={`${bgColor} p-2 rounded-md border border-border/50`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">
                          {item.source}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                          {item.content}
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-xs shrink-0">
                        {Math.round(item.confidence * 100)}%
                      </Badge>
                    </div>
                  </div>
                ))}
                {items.length > 5 && (
                  <p className="text-xs text-muted-foreground ml-2">
                    +{items.length - 5} more items
                  </p>
                )}
              </div>
            </div>
          );
        })}

        {/* Empty state when generating */}
        {intelligenceUsed.length === 0 && isGenerating && (
          <div className="text-center py-8 text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
            <p className="text-sm">Analyzing available intelligence...</p>
          </div>
        )}

        {/* Empty state when not generating */}
        {intelligenceUsed.length === 0 && !isGenerating && (
          <div className="text-center py-8 text-muted-foreground">
            <Brain className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No intelligence used yet</p>
            <p className="text-xs mt-1">Generate content to see intelligence usage</p>
          </div>
        )}

        {/* Summary */}
        {intelligenceUsed.length > 0 && (
          <>
            <Separator />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Total Intelligence References</span>
              <span className="font-semibold text-foreground">{intelligenceUsed.length}</span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

// FIX: Named export
export { RealTimeIntelligenceTracker };