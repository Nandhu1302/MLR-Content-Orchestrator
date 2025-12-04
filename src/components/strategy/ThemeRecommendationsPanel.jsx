import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lightbulb, Eye, TrendingUp } from 'lucide-react';
import { ThemeService } from '@/services/themeService';
import { formatDistance } from 'date-fns';

export const ThemeRecommendationsPanel = ({ 
  themeId, 
  assetType,
  onViewAsset 
}) => {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecommendations();
  }, [themeId, assetType]);

  const loadRecommendations = async () => {
    setLoading(true);
    try {
      const data = await ThemeService.getThemeAssetRecommendations(themeId, assetType);
      setRecommendations(data);
    } catch (error) {
      console.error('Failed to load recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!recommendations?.similarAssets?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            Similar Assets Using This Theme
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No approved assets found using this theme yet. You're creating pioneering content!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            Similar Assets Using This Theme
          </CardTitle>
          <Badge variant="secondary" className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            {recommendations.avgSuccessRate}% Success Rate
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground mb-4">
          These {recommendations.similarAssets.length} assets were successfully created using the "{recommendations.theme?.name}" theme:
        </p>
        
        {recommendations.similarAssets.map((asset) => (
          <div 
            key={asset.id} 
            className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm truncate">{asset.asset_name}</div>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {asset.asset_type}
                </Badge>
                <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                  {asset.status}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {formatDistance(new Date(asset.created_at), new Date(), { addSuffix: true })}
                </span>
              </div>
            </div>
            {onViewAsset && (
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => onViewAsset(asset.id)}
                className="ml-2"
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}

        <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/20">
          <p className="text-sm font-medium mb-1">💡 Recommendation</p>
          <p className="text-sm text-muted-foreground">
            Review these successful implementations for inspiration on messaging, structure, and tone that resonates with your audience.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};