
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Activity, BarChart3 } from 'lucide-react';
import { DataFilters } from '@/components/data/DataFilters';
import { useQuery } from '@tanstack/react-query';
import { EnhancedThemeIntelligenceService } from '@/services/EnhancedThemeIntelligenceService';
import { Skeleton } from '@/components/ui/skeleton';

export const HCPEngagementPanel = ({ brandId, filters }) => {
  const { data: hcpEngagement, isLoading } = useQuery({
    queryKey: ['hcp-engagement', brandId, filters],
    queryFn: () => EnhancedThemeIntelligenceService.getHCPEngagement(brandId, filters),
    enabled: !!brandId,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-full mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!hcpEngagement) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>HCP Engagement</CardTitle>
          <CardDescription>No HCP engagement data available</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          HCP Engagement Intelligence
        </CardTitle>
        <CardDescription>
          IQVIA HCP Decile, Veeva CRM & Engagement Analytics • {hcpEngagement.dataSources.length} sources
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Total HCPs & Top Decile Share */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-secondary/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Total HCPs</span>
            </div>
            <div className="text-2xl font-bold">{hcpEngagement.totalHCPs}</div>
          </div>
          <div className="p-4 bg-secondary/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Top Decile Share</span>
            </div>
            <div className="text-2xl font-bold">{hcpEngagement.topDecileShare}%</div>
          </div>
        </div>

        {/* Decile Breakdown */}
        {hcpEngagement.decileBreakdown.length > 0 && (
          <div className="space-y-2">
            <span className="text-sm font-medium">Prescriber Decile Breakdown</span>
            <div className="space-y-2">
              {hcpEngagement.decileBreakdown.map((decile) => (
                <div
                  key={decile.decile}
                  className={`flex items-center justify-between p-3 rounded ${
                    decile.decile >= 8 ? 'bg-primary/10' : 'bg-secondary/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Badge variant={decile.decile >= 8 ? 'default' : 'secondary'}>
                      Decile {decile.decile}
                    </Badge>
                    <span className="text-sm">{decile.count} HCPs</span>
                  </div>
                  <span className="text-sm font-semibold">
                    {decile.totalRx.toLocaleString()} Rx
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CRM Engagement */}
        <div className="space-y-2">
          <span className="text-sm font-medium">Field Engagement Activity</span>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-secondary/20 rounded-lg">
              <div className="text-xs text-muted-foreground">Total Touchpoints</div>
              <div className="text-xl font-semibold">{hcpEngagement.totalTouchpoints}</div>
            </div>
            <div className="p-3 bg-secondary/20 rounded-lg">
              <div className="text-xs text-muted-foreground">Avg per HCP</div>
              <div className="text-xl font-semibold">{hcpEngagement.avgTouchpointsPerHCP}</div>
            </div>
          </div>
        </div>

        {/* Top Activities */}
        {hcpEngagement.topActivities.length > 0 && (
          <div className="space-y-2">
            <span className="text-sm font-medium">Top Activity Types</span>
            <div className="space-y-2">
              {hcpEngagement.topActivities.map((activity) => (
                <div key={activity.type} className="flex items-center justify-between p-2 bg-secondary/20 rounded">
                  <span className="text-sm">{activity.type}</span>
                  <Badge variant="outline">{activity.count} activities</Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Engagement Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Average Engagement Score</span>
            <div className="flex items-center gap-2">
              <span className="text-xl font-semibold">{hcpEngagement.avgEngagementScore}</span>
              <span className="text-xs text-muted-foreground">/ 100</span>
            </div>
          </div>
        </div>

        {/* Data Sources */}
        <div className="pt-4 border-t">
          <div className="flex flex-wrap gap-2 mb-3">
            {hcpEngagement.dataSources.map((source) => (
              <Badge key={source} variant="secondary" className="text-xs">
                {source}
              </Badge>
            ))}
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Data Quality Score</span>
            <Badge variant={hcpEngagement.dataQuality > 70 ? 'default' : 'secondary'}>
              {hcpEngagement.dataQuality}%
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HCPEngagementPanel;
