import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/hooks/use-toast';
import { 
  Trash2, Star, TrendingUp, 
  CheckCircle2, XCircle 
} from 'lucide-react';
import { ContentService } from '@/services/contentService';

export const SavedVariationsPanel = ({
  assetId,
  variations,
  onVariationsUpdate
}) => {
  const [updatingId, setUpdatingId] = useState(null);

  const handleToggleActive = async (variationId, currentlyActive) => {
    setUpdatingId(variationId);
    try {
      await ContentService.updateVariation(variationId, {
        is_active: !currentlyActive
      });
      
      toast({
        title: currentlyActive ? 'Variation deactivated' : 'Variation activated',
        description: 'Variation status updated successfully'
      });
      
      onVariationsUpdate();
    } catch (error) {
      toast({
        title: 'Update failed',
        description: 'Failed to update variation status',
        variant: 'destructive'
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSetPrimary = async (variationId) => {
    setUpdatingId(variationId);
    try {
      // First, unset all primary flags
      for (const variation of variations) {
        if (variation.is_primary) {
          await ContentService.updateVariation(variation.id, { is_primary: false });
        }
      }
      
      // Then set new primary
      await ContentService.updateVariation(variationId, { is_primary: true });
      
      toast({
        title: 'Primary variation updated',
        description: 'This variation is now set as primary'
      });
      
      onVariationsUpdate();
    } catch (error) {
      toast({
        title: 'Update failed',
        description: 'Failed to set primary variation',
        variant: 'destructive'
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteVariation = async (variationId) => {
    if (!confirm('Are you sure you want to delete this variation?')) return;
    
    setUpdatingId(variationId);
    try {
      await ContentService.deleteVariation(variationId);
      
      toast({
        title: 'Variation deleted',
        description: 'Variation deleted successfully'
      });
      
      onVariationsUpdate();
    } catch (error) {
      toast({
        title: 'Delete failed',
        description: 'Failed to delete variation',
        variant: 'destructive'
      });
    } finally {
      setUpdatingId(null);
    }
  };

  if (variations.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No saved variations yet.</p>
        <p className="text-sm mt-2">Generate variations to get started.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[600px] pr-4">
      <div className="space-y-3">
        {variations.map(variation => (
          <Card key={variation.id} className="p-4">
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {variation.variation_name}
                  </Badge>
                  {variation.is_primary && (
                    <Badge variant="default" className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-current" />
                      Primary
                    </Badge>
                  )}
                  {variation.is_active ? (
                    <Badge variant="default" className="flex items-center gap-1 bg-green-500">
                      <CheckCircle2 className="h-3 w-3" />
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <XCircle className="h-3 w-3" />
                      Inactive
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={variation.is_active}
                    onCheckedChange={() => handleToggleActive(variation.id, variation.is_active)}
                    disabled={updatingId === variation.id}
                  />
                </div>
              </div>

              {/* Content Preview */}
              <div className="text-sm space-y-1 text-muted-foreground">
                {variation.content_data.headline && (
                  <div>
                    <span className="font-medium text-foreground">Headline:</span>{' '}
                    {variation.content_data.headline}
                  </div>
                )}
                {variation.content_data.body && (
                  <div>
                    <span className="font-medium text-foreground">Body:</span>{' '}
                    {variation.content_data.body.substring(0, 100)}...
                  </div>
                )}
                {variation.content_data.cta && (
                  <div>
                    <span className="font-medium text-foreground">CTA:</span>{' '}
                    {variation.content_data.cta}
                  </div>
                )}
              </div>

              {/* Performance Metrics */}
              {variation.performance_metrics && (
                <div className="flex gap-2">
                  <Badge variant="secondary" className="text-xs">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Engagement: {Math.round(variation.performance_metrics.engagement_score || 0)}%
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    Compliance: {Math.round(variation.performance_metrics.compliance_score || 0)}%
                  </Badge>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t">
                {!variation.is_primary && variation.is_active && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleSetPrimary(variation.id)}
                    disabled={updatingId === variation.id}
                  >
                    <Star className="h-3 w-3 mr-1" />
                    Set as Primary
                  </Button>
                )}
                
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDeleteVariation(variation.id)}
                  disabled={updatingId === variation.id}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};