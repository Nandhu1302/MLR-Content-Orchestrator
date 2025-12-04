import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ShieldCheck, AlertCircle, Calendar, TrendingUp, Sparkles, Info } from "lucide-react";

export const GuardrailsHealthCard = ({
  status,
  daysSinceReview,
  complianceScore,
  needsAttention,
  onOpenDrawer,
  intelligenceStatus = 'none',
  freshInsightsCount = 0,
  lastIntelligenceRefresh,
}) => {
  const getIntelligenceConfig = () => {
    switch (intelligenceStatus) {
      case 'fresh':
        return {
          color: 'bg-green-500/10 text-green-700 border-green-500/20',
          label: 'Intelligence: Fresh',
          icon: Sparkles,
        };
      case 'stale':
        return {
          color: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20',
          label: 'Intelligence: Stale',
          icon: AlertCircle,
        };
      default:
        return {
          color: 'bg-muted text-muted-foreground',
          label: 'No Intelligence',
          icon: Info,
        };
    }
  };

  const intelligenceConfig = getIntelligenceConfig();
  const IntelligenceIcon = intelligenceConfig.icon;

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };
  const getStatusConfig = () => {
    switch (status) {
      case 'fresh':
        return {
          color: 'bg-success text-success-foreground',
          label: 'Fresh',
          icon: ShieldCheck,
        };
      case 'warning':
        return {
          color: 'bg-warning text-warning-foreground',
          label: 'Needs Review',
          icon: AlertCircle,
        };
      case 'critical':
        return {
          color: 'bg-destructive text-destructive-foreground',
          label: 'Critical',
          icon: AlertCircle,
        };
    }
  };

  const config = getStatusConfig();
  const StatusIcon = config.icon;

  return (
    <Card 
      className="cursor-pointer hover:shadow-sm transition-shadow"
      onClick={onOpenDrawer}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <StatusIcon className="h-4 w-4" />
          Brand Guardrails Health
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Status</span>
          <Badge className={config.color}>
            {config.label}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Last Review
          </span>
          <span className="text-xs font-medium">
            {daysSinceReview} days ago
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            Compliance Score
          </span>
          <span className="text-xs font-medium">
            {complianceScore}%
          </span>
        </div>

        {needsAttention && (
          <Badge variant="destructive" className="w-full justify-center">
            Action Required
          </Badge>
        )}

        {/* Intelligence Status with Auto-Refresh Info */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="pt-2 border-t space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className={intelligenceConfig.color}>
                    <IntelligenceIcon className="h-3 w-3 mr-1" />
                    {intelligenceConfig.label}
                  </Badge>
                  {freshInsightsCount > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      +{freshInsightsCount} new
                    </Badge>
                  )}
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Auto-refresh: Weekly (Sundays)
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-xs space-y-1">
                <p className="font-semibold">Intelligence Status</p>
                <p>Last enrichment: {formatDate(lastIntelligenceRefresh)}</p>
                {freshInsightsCount > 0 && (
                  <p className="text-green-600">{freshInsightsCount} fresh insights available</p>
                )}
                <p className="text-muted-foreground pt-1 border-t">Automated refresh every Sunday at 2 AM UTC</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
};