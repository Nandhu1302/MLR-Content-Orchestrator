
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lightbulb, TrendingUp, Target } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { EnhancedThemeIntelligenceService } from "@/services/EnhancedThemeIntelligenceService";

function ContentInspirationPanel({ brandId, filters }) {
  const { data: recommendations, isLoading, error } = useQuery({
    queryKey: ['content-recommendations', brandId, filters],
    queryFn: () => EnhancedThemeIntelligenceService.getContentRecommendations(brandId, filters),
    enabled: Boolean(brandId),
    staleTime: 0,
    refetchOnMount: 'always',
  });

  if (isLoading) {
    return (
      <Card className="p-6 animate-pulse">
        <div className="h-6 bg-muted rounded mb-4"></div>
        <div className="space-y-3">
          <div className="h-20 bg-muted rounded"></div>
          <div className="h-20 bg-muted rounded"></div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6 border-destructive">
        <div className="text-destructive">
          Error loading content recommendations: {error instanceof Error ? error.message : 'Unknown error'}
        </div>
      </Card>
    );
  }

  if (!recommendations?.themes || recommendations.themes.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-muted-foreground">
          No content recommendations found for this combination of filters
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="h-5 w-5 text-yellow-500" />
        <h3 className="font-semibold">What to Write About</h3>
        <Badge variant="secondary" className="ml-auto">
          AI-Generated
        </Badge>
      </div>

      <div className="space-y-3">
        {recommendations.themes.map((theme, idx) => (
          <div key={idx} className="p-4 border rounded-lg hover:border-primary/50 transition-colors">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="font-medium mb-1">{theme.themeTitle}</div>
                <div className="text-sm text-muted-foreground">{theme.rationale}</div>
              </div>
              {idx === 0 && (
                <Badge variant="default" className="ml-2">
                  <Target className="h-3 w-3 mr-1" />
                  Top Pick
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center gap-1 text-sm">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="font-medium text-green-600">+{theme.expectedLift}%</span>
                <span className="text-muted-foreground">expected lift</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {theme.confidence}% confidence
              </Badge>
            </div>

            <div className="mt-3 text-xs text-muted-foreground">
              Based on: {theme.dataSources.join(', ')}
            </div>
          </div>
        ))}
      </div>

      {recommendations.themes.length > 0 && (
        <Button className="w-full mt-4" variant="outline">
          Generate Content Brief with Top Theme
        </Button>
      )}
    </Card>
  );
}

// ✅ Explicit export
export default ContentInspirationPanel;
