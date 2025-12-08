import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Target } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { EnhancedThemeIntelligenceService } from "@/services/EnhancedThemeIntelligenceService";
// Removed: import { DataFilters } from "@/services/EnhancedThemeIntelligenceService";

// Removed interface PerformanceBenchmarksPanelProps

export const PerformanceBenchmarksPanel = ({ brandId, filters, themeId }) => { // Removed : PerformanceBenchmarksPanelProps
  const { data: benchmarks, isLoading, error } = useQuery({
    // FIX APPLIED HERE: Added 'queryKey:' and brackets []
    queryKey: ['performance-benchmarks', brandId, filters, themeId],
    queryFn: () => EnhancedThemeIntelligenceService.getPerformanceBenchmarks(brandId, filters, themeId),
    enabled: Boolean(brandId),
    staleTime: 0,
    refetchOnMount: 'always',
  });

  if (isLoading) {
    return (
      <Card className="p-6 animate-pulse">
        <div className="h-6 bg-muted rounded mb-4"></div>
        <div className="grid grid-cols-3 gap-4">
          <div className="h-20 bg-muted rounded"></div>
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
          Error loading benchmarks: {error instanceof Error ? error.message : 'Unknown error'}
        </div>
      </Card>
    );
  }

  if (!benchmarks) {
    return (
      <Card className="p-6">
        <div className="text-muted-foreground">
          No performance data found for this combination of filters
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="h-5 w-5 text-purple-500" />
        <h3 className="font-semibold">What Success Looks Like</h3>
        <Badge variant="secondary" className="ml-auto">
          Based on {benchmarks.sampleSize} campaigns
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border rounded-lg">
          <div className="text-sm text-muted-foreground mb-1">Open Rate</div>
          <div className="text-2xl font-bold">{benchmarks.baseline.openRate.toFixed(1)}%</div>
          <div className="text-xs text-muted-foreground">Historical baseline</div>
          {benchmarks.expected && (
            <div className="mt-2 flex items-center gap-1 text-sm text-green-600">
              <TrendingUp className="h-4 w-4" />
              <span className="font-medium">{benchmarks.expected.openRate.toFixed(1)}%</span>
              <span className="text-xs text-muted-foreground">with recommended theme</span>
            </div>
          )}
        </div>

        <div className="p-4 border rounded-lg">
          <div className="text-sm text-muted-foreground mb-1">Click Rate</div>
          <div className="text-2xl font-bold">{benchmarks.baseline.clickRate.toFixed(1)}%</div>
          <div className="text-xs text-muted-foreground">Historical baseline</div>
          {benchmarks.expected && (
            <div className="mt-2 flex items-center gap-1 text-sm text-green-600">
              <TrendingUp className="h-4 w-4" />
              <span className="font-medium">{benchmarks.expected.clickRate.toFixed(1)}%</span>
              <span className="text-xs text-muted-foreground">with recommended theme</span>
            </div>
          )}
        </div>

        <div className="p-4 border rounded-lg">
          <div className="text-sm text-muted-foreground mb-1">Conversion Rate</div>
          <div className="text-2xl font-bold">{benchmarks.baseline.conversionRate.toFixed(1)}%</div>
          <div className="text-xs text-muted-foreground">Historical baseline</div>
          {benchmarks.expected && (
            <div className="mt-2 flex items-center gap-1 text-sm text-green-600">
              <TrendingUp className="h-4 w-4" />
              <span className="font-medium">{benchmarks.expected.conversionRate.toFixed(1)}%</span>
              <span className="text-xs text-muted-foreground">with recommended theme</span>
            </div>
          )}
        </div>
      </div>

      {benchmarks.successCriteria && (
        <div className="mt-4 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-primary" />
            <div className="text-sm font-medium">Success Criteria for This Campaign</div>
          </div>
          <div className="text-sm text-muted-foreground">
            {benchmarks.successCriteria}
          </div>
        </div>
      )}
    </Card>
  );
};