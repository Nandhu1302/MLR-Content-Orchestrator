import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  GitBranch, 
  Target, 
  FileText, 
  Eye, 
  TrendingUp,
  Calendar,
  Activity
} from 'lucide-react';
import { ThemeService } from '@/services/themeService';
import { formatDistance } from 'date-fns';

export const ThemeLineageMap = ({ 
  themeId, 
  onViewCampaign,
  onViewAsset 
}) => {
  const [lineage, setLineage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLineage();
  }, [themeId]);

  const loadLineage = async () => {
    setLoading(true);
    try {
      const data = await ThemeService.getThemeLineage(themeId);
      setLineage(data);
    } catch (error) {
      console.error('Failed to load theme lineage:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!lineage) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <GitBranch className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Lineage Data</h3>
          <p className="text-muted-foreground">
            This theme hasn't been used in any campaigns or assets yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
      case 'approved':
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'in_review':
      case 'draft':
        return 'bg-yellow-100 text-yellow-700';
      case 'archived':
      case 'rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-primary" />
            Theme Usage Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg border bg-card">
              <Target className="h-5 w-5 mx-auto text-muted-foreground mb-2" />
              <div className="text-2xl font-bold">{lineage.campaigns.length}</div>
              <div className="text-sm text-muted-foreground">Campaigns</div>
            </div>
            <div className="text-center p-4 rounded-lg border bg-card">
              <FileText className="h-5 w-5 mx-auto text-muted-foreground mb-2" />
              <div className="text-2xl font-bold">{lineage.assets.length}</div>
              <div className="text-sm text-muted-foreground">Assets</div>
            </div>
            <div className="text-center p-4 rounded-lg border bg-card">
              <Activity className="h-5 w-5 mx-auto text-muted-foreground mb-2" />
              <div className="text-2xl font-bold">{lineage.activeUsage}</div>
              <div className="text-sm text-muted-foreground">Active</div>
            </div>
            <div className="text-center p-4 rounded-lg border bg-card">
              <TrendingUp className="h-5 w-5 mx-auto text-muted-foreground mb-2" />
              <div className="text-2xl font-bold">{lineage.totalUsage}</div>
              <div className="text-sm text-muted-foreground">Total Usage</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Lineage */}
      <Card>
        <CardHeader>
          <CardTitle>Theme Implementation Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="campaigns">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="campaigns">
                Campaigns ({lineage.campaigns.length})
              </TabsTrigger>
              <TabsTrigger value="assets">
                Assets ({lineage.assets.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="campaigns" className="space-y-3 mt-4">
              {lineage.campaigns.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No campaigns using this theme yet
                </div>
              ) : (
                <ScrollArea className="h-[400px]">
                  {lineage.campaigns.map((campaign) => (
                    <div 
                      key={campaign.id}
                      className="flex items-center justify-between p-4 rounded-lg border bg-card mb-3 hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="font-medium">{campaign.project_name}</div>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className={getStatusColor(campaign.status)}>
                            {campaign.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDistance(new Date(campaign.created_at), new Date(), { addSuffix: true })}
                          </span>
                        </div>
                        {campaign.description && (
                          <p className="text-sm text-muted-foreground mt-2">{campaign.description}</p>
                        )}
                      </div>
                      {onViewCampaign && (
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => onViewCampaign(campaign.id)}
                          className="ml-4"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </ScrollArea>
              )}
            </TabsContent>

            <TabsContent value="assets" className="space-y-3 mt-4">
              {lineage.assets.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No assets using this theme yet
                </div>
              ) : (
                <ScrollArea className="h-[400px]">
                  {lineage.assets.map((asset) => (
                    <div 
                      key={asset.id}
                      className="flex items-center justify-between p-4 rounded-lg border bg-card mb-3 hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="font-medium">{asset.asset_name}</div>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {asset.asset_type}
                          </Badge>
                          <Badge className={getStatusColor(asset.status)}>
                            {asset.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDistance(new Date(asset.created_at), new Date(), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                      {onViewAsset && (
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => onViewAsset(asset.id)}
                          className="ml-4"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </ScrollArea>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      {lineage.theme && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-5 w-5 text-primary" />
              Theme Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Success Rate</div>
                <div className="text-2xl font-bold text-primary">
                  {lineage.theme.success_rate || 0}%
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Usage Count</div>
                <div className="text-2xl font-bold text-primary">
                  {lineage.theme.usage_count || 0}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Confidence Score</div>
                <div className="text-2xl font-bold text-primary">
                  {lineage.theme.confidence_score || 0}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};