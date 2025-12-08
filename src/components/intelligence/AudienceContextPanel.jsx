
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { EnhancedThemeIntelligenceService } from "@/services/EnhancedThemeIntelligenceService";

function AudienceContextPanel({ brandId, filters }) {
  const { data: context, isLoading, error } = useQuery({
    queryKey: ['audience-context', brandId, filters],
    queryFn: () => EnhancedThemeIntelligenceService.getAudienceContext(brandId, filters),
    enabled: Boolean(brandId),
    staleTime: 0,
    refetchOnMount: 'always',
  });

  if (isLoading) {
    return (
      <Card className="p-6 animate-pulse">
        <div className="h-6 bg-muted rounded mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-muted rounded"></div>
          <div className="h-4 bg-muted rounded"></div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6 border-destructive">
        <div className="text-destructive">
          Error loading audience context: {error instanceof Error ? error.message : 'Unknown error'}
        </div>
      </Card>
    );
  }

  if (!context) {
    return (
      <Card className="p-6">
        <div className="text-muted-foreground">
          No audience data found for this combination of filters
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Users className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">Who You're Writing For</h3>
        <Badge variant="secondary" className="ml-auto">
          {context.dataQuality}% data quality
        </Badge>
      </div>

      <div className="space-y-4">
        <div>
          <div className="text-sm text-muted-foreground mb-1">Audience Size</div>
          <div className="text-2xl font-bold">{context.audienceSize.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground">{context.audienceSizeContext}</div>
        </div>

        <div>
          <div className="text-sm font-medium mb-2 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            Top 3 Concerns They Have Right Now
          </div>
          <div className="space-y-2">
            {context.topConcerns.map((concern, idx) => (
              <div key={idx} className="p-3 bg-muted/50 rounded-lg">
                <div className="font-medium text-sm">{concern.concern}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Mentioned {concern.mentions} times • {concern.sentiment} sentiment
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

// ✅ Explicit export statement
export {AudienceContextPanel};
