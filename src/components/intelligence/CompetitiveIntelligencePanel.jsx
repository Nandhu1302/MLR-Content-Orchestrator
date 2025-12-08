
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, AlertTriangle, CheckCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { EnhancedThemeIntelligenceService } from "@/services/EnhancedThemeIntelligenceService";

function CompetitiveIntelligencePanel({ brandId, filters }) {
  const { data: guidance, isLoading, error } = useQuery({
    queryKey: ['competitive-guidance', brandId, filters],
    queryFn: () => EnhancedThemeIntelligenceService.getCompetitiveGuidance(brandId, filters),
    enabled: Boolean(brandId),
    staleTime: 0,
    refetchOnMount: 'always',
  });

  if (isLoading) {
    return (
      <Card className="p-6 animate-pulse">
        <div className="h-6 bg-muted rounded mb-4"></div>
        <div className="space-y-3">
          <div className="h-16 bg-muted rounded"></div>
          <div className="h-16 bg-muted rounded"></div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6 border-destructive">
        <div className="text-destructive">
          Error loading competitive guidance: {error instanceof Error ? error.message : 'Unknown error'}
        </div>
      </Card>
    );
  }

  if (!guidance) {
    return (
      <Card className="p-6">
        <div className="text-muted-foreground">
          No competitive data found for this combination of filters
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="h-5 w-5 text-blue-500" />
        <h3 className="font-semibold">Competitive Context</h3>
      </div>

      <div className="space-y-4">
        {guidance.threats.length > 0 && (
          <div>
            <div className="text-sm font-medium mb-2 flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-4 w-4" />
              Active Competitor Threats
            </div>
            <div className="space-y-2">
              {guidance.threats.map((threat, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg"
                >
                  <div className="font-medium text-sm">{threat.competitor}</div>
                  <div className="text-xs text-muted-foreground mt-1">{threat.claim}</div>
                  <Badge variant="outline" className="mt-2 text-xs border-red-300">
                    {threat.threatLevel} threat
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {guidance.differentiationOpportunities.length > 0 && (
          <div>
            <div className="text-sm font-medium mb-2 flex items-center gap-2 text-green-600">
              <CheckCircle className="h-4 w-4" />
              Your Differentiation Opportunities
            </div>
            <div className="space-y-2">
              {guidance.differentiationOpportunities.map((opp, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg"
                >
                  <div className="font-medium text-sm">{opp.opportunity}</div>
                  <div className="text-xs text-muted-foreground mt-1">{opp.rationale}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {guidance.avoidMentions.length > 0 && (
          <div>
            <div className="text-sm font-medium mb-2 text-muted-foreground">
              Topics to Avoid Mentioning
            </div>
            <div className="flex flex-wrap gap-2">
              {guidance.avoidMentions.map((mention, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {mention}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

// ✅ Explicit export
export {CompetitiveIntelligencePanel};
