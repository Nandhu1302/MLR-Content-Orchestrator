import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  TrendingUp, 
  Target, 
  Users,
  Database,
  FileText,
  CheckCircle2,
  XCircle
} from 'lucide-react';

// TypeScript interfaces are removed
// The component is rewritten to accept 'layers' directly

const LAYER_CONFIG = {
  evidence: {
    icon: Shield,
    color: 'text-blue-600',
    description: 'Clinical claims and references from PI documents'
  },
  performance: {
    icon: TrendingUp,
    color: 'text-green-600',
    description: 'Historical performance data and success patterns'
  },
  competitive: {
    icon: Target,
    color: 'text-purple-600',
    description: 'Competitive intelligence and market positioning'
  },
  audience: {
    icon: Users,
    color: 'text-orange-600',
    description: 'Audience insights and preferences'
  },
  brand: {
    icon: Database,
    color: 'text-pink-600',
    description: 'Brand guidelines and messaging framework'
  }
};

const IntelligenceLayerBreakdown = ({ layers }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <FileText className="w-5 h-5" />
          Intelligence Layer Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {layers.map((layer) => {
          const config = LAYER_CONFIG[layer.type];
          const Icon = config.icon;
          const utilizationRate = layer.totalAvailable > 0 
            ? (layer.itemsUsed / layer.totalAvailable) * 100 
            : 0;
          const isUsed = layer.itemsUsed > 0;

          return (
            <div key={layer.type} className="space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${config.color}`} />
                  <div>
                    <p className="font-medium text-sm">{layer.label}</p>
                    <p className="text-xs text-muted-foreground">{config.description}</p>
                  </div>
                </div>
                {isUsed ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-muted-foreground shrink-0" />
                )}
              </div>

              <div className="ml-6 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    {layer.itemsUsed} of {layer.totalAvailable} used
                  </span>
                  {utilizationRate > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {Math.round(utilizationRate)}% utilized
                    </Badge>
                  )}
                </div>

                {/* Show specific claims used */}
                {layer.specificClaims && layer.specificClaims.length > 0 && (
                  <div className="space-y-1">
                    {layer.specificClaims.map((claim, idx) => (
                      <div 
                        key={idx}
                        className="text-xs p-2 bg-muted rounded-md border border-border/50"
                      >
                        <span className="font-medium">Claim {idx + 1}:</span>{' '}
                        <span className="text-muted-foreground">{claim}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

// FIX: Change to named export
export { IntelligenceLayerBreakdown };