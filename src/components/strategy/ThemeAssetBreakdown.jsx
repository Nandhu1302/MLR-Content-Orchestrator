import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Eye, 
  Edit3, 
  Calendar,
  Users,
  Target,
  TrendingUp,
  FileText,
  ExternalLink
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatDistance } from "date-fns";
import { ThemeRecommendationsPanel } from "@/components/strategy/ThemeRecommendationsPanel";

export const ThemeAssetBreakdown = ({
  theme,
  campaigns,
  assets,
  onViewInContentStudio
}) => {
  const navigate = useNavigate();

  const getAssetStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <Badge variant="secondary" className="text-green-700 bg-green-100">Completed</Badge>;
      case 'in_review':
        return <Badge variant="secondary" className="text-blue-700 bg-blue-100">In Review</Badge>;
      case 'draft':
        return <Badge variant="outline">Draft</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getProgressValue = (asset) => {
    if (asset.status === 'completed') return 100;
    if (asset.status === 'in_review') return 80;
    if (asset.status === 'draft') return 40;
    return 20;
  };

  const totalAssets = assets.length;
  const completedAssets = assets.filter(a => a.status === 'completed').length;
  const overallProgress = totalAssets > 0 ? (completedAssets / totalAssets) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Theme Usage Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Theme Usage Overview
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onViewInContentStudio()}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View All in Content Studio
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{campaigns.length}</div>
              <div className="text-sm text-muted-foreground">Active Campaigns</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{totalAssets}</div>
              <div className="text-sm text-muted-foreground">Total Assets</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{completedAssets}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{overallProgress.toFixed(0)}%</div>
              <div className="text-sm text-muted-foreground">Overall Progress</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Campaign Breakdown */}
      {campaigns.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Campaigns Using This Theme
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {campaigns.map(campaign => {
                const campaignAssets = assets.filter(asset => asset.project_id === campaign.id);
                const campaignProgress = campaignAssets.length > 0 
                  ? (campaignAssets.filter(a => a.status === 'completed').length / campaignAssets.length) * 100 
                  : 0;

                return (
                  <div key={campaign.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold">{campaign.project_name}</h4>
                        <p className="text-sm text-muted-foreground">{campaign.description || 'No description'}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">
                          {campaignAssets.length} assets
                        </Badge>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => onViewInContentStudio(campaign.id)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Campaign Progress</span>
                        <span className="font-medium">{campaignProgress.toFixed(0)}%</span>
                      </div>
                      <Progress value={campaignProgress} className="h-2" />
                    </div>

                    <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDistance(new Date(campaign.created_at), new Date(), { addSuffix: true })}
                      </div>
                      {campaign.target_audience && (
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {typeof campaign.target_audience === 'object' ? 
                            campaign.target_audience?.name || 'Multiple audiences' : 
                            campaign.target_audience
                          }
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Asset Details */}
      {assets.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Edit3 className="h-5 w-5" />
              Individual Assets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {assets.map(asset => {
                const campaign = campaigns.find(c => c.id === asset.project_id);
                
                return (
                  <div key={asset.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="font-medium">{asset.asset_name}</h5>
                        {getAssetStatusIcon(asset.status)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{asset.asset_type}</span>
                        {campaign && <span>• {campaign.project_name}</span>}
                        <span>• {formatDistance(new Date(asset.updated_at), new Date(), { addSuffix: true })}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="w-24">
                        <Progress value={getProgressValue(asset)} className="h-2" />
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => navigate(`/content-editor/${asset.id}`)}
                      >
                        <Edit3 className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Theme Performance Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h6 className="font-medium">Usage Statistics</h6>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>Total implementations: {totalAssets}</div>
                <div>Success rate: {totalAssets > 0 ? (completedAssets / totalAssets * 100).toFixed(1) : 0}%</div>
                <div>Last used: {theme.last_used_at ? formatDistance(new Date(theme.last_used_at), new Date(), { addSuffix: true }) : 'Never'}</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h6 className="font-medium">Asset Type Distribution</h6>
              <div className="text-sm text-muted-foreground">
                {Array.from(new Set(assets.map(a => a.asset_type))).map(type => (
                  <div key={type} className="flex justify-between">
                    <span>{type}:</span>
                    <span>{assets.filter(a => a.asset_type === type).length}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Theme-Based Recommendations (Phase 4) */}
      {totalAssets > 0 && (
        <ThemeRecommendationsPanel
          themeId={theme.id}
          onViewAsset={(assetId) => navigate(`/content-editor/${assetId}`)}
        />
      )}
    </div>
  );
};

export default ThemeAssetBreakdown;