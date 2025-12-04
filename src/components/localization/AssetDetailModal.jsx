import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { BrandConsistencyIndicator } from './BrandConsistencyIndicator';
import { RegulatoryReadinessIndicator } from './RegulatoryReadinessIndicator';
import { AssetReusabilityMatrix } from './AssetReusabilityMatrix';
import { 
  FileText, 
  Image, 
  Video, 
  Mail, 
  Smartphone, 
  Monitor,
  Globe,
  Clock,
  User,
  Calendar
} from 'lucide-react';

export const AssetDetailModal = ({
  asset,
  isOpen,
  onClose,
  onAdaptForMarket
}) => {
  if (!asset) return null;

  const getAssetIcon = (type) => {
    if (!type) return FileText;
    
    switch (type.toLowerCase()) {
      case 'mass-email':
      case 'email': return Mail;
      case 'social_media': return Smartphone;
      case 'landing-page':
      case 'landing_page': return Monitor;
      case 'digital-sales-aid':
      case 'sales_aid': return FileText;
      case 'patient-brochure': return FileText;
      case 'digital-tool': return Monitor;
      case 'presentation': return FileText;
      case 'video-script':
      case 'banner': case 'display_ad': return Image;
      case 'video': return Video;
      default: return FileText;
    }
  };

  const AssetIcon = getAssetIcon(asset.asset_type || asset.type);

  const getSourceBadgeColor = (source) => {
    switch (source) {
      case 'content_studio': return 'bg-blue-100 text-blue-800';
      case 'pre_mlr': return 'bg-green-100 text-green-800';
      case 'design_studio': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <AssetIcon className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl line-clamp-2">{asset.name}</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {asset.project_name}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge 
                  className={getSourceBadgeColor(asset.source_module)}
                  variant="outline"
                >
                  {asset.source_module.replace('_', ' ')}
                </Badge>
                <Badge variant="outline">
                  {asset.status}
                </Badge>
                <Badge variant="outline">
                  {asset.asset_type || asset.type}
                </Badge>
              </div>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="brand">Localization Intelligence</TabsTrigger>
            <TabsTrigger value="regulatory">Regulatory Readiness</TabsTrigger>
            <TabsTrigger value="reusability">Reusability</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Asset Information</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Asset ID:</span>
                    <span className="font-mono">{asset.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span>{asset.asset_type || asset.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="capitalize">{asset.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Source:</span>
                    <span className="capitalize">{asset.source_module.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Therapeutic Area:</span>
                    <span>{asset.therapeutic_area || 'Not specified'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Performance Metrics</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Reusability Score:</span>
                    <Badge variant="outline">{asset.reusabilityScore || 75}%</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Brand Consistency:</span>
                    <Badge variant="outline">{asset.brandConsistencyScore || 85}%</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Last Updated:</span>
                    <span className="text-sm text-muted-foreground">
                      {asset.updated_at ? new Date(asset.updated_at).toLocaleDateString() : 'Unknown'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Created:</span>
                    <span className="text-sm text-muted-foreground">
                      {asset.created_at ? new Date(asset.created_at).toLocaleDateString() : 'Unknown'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {asset.description && (
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-sm text-muted-foreground">{asset.description}</p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button onClick={() => onAdaptForMarket(asset)} className="flex-1">
                <Globe className="h-4 w-4 mr-2" />
                Adapt for Market
              </Button>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="brand" className="space-y-4">
            <BrandConsistencyIndicator asset={asset} />
          </TabsContent>

          <TabsContent value="regulatory" className="space-y-4">
            <RegulatoryReadinessIndicator asset={asset} />
          </TabsContent>

          <TabsContent value="reusability" className="space-y-4">
            <AssetReusabilityMatrix asset={asset} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};