import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { FileText, Calendar, Target, MessageSquare, Zap } from 'lucide-react';
import { StrategicContextExtractor } from '@/services/StrategicContextExtractor';

const AssetPreviewModal = ({ asset, open, onOpenChange, onSelect }) => {
  if (!asset) return null;
  
  const strategicContext = StrategicContextExtractor.extractFromAsset(asset);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {asset.name}
          </DialogTitle>
          <DialogDescription>
            Review asset details and strategic context before importing
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[calc(90vh-200px)]">
          <div className="space-y-6 pr-4">
            {/* Asset Metadata */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Asset Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Asset Type</p>
                    <Badge variant="secondary">{strategicContext.channelType || asset.type}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge variant="outline">{asset.status}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Source Module</p>
                    <Badge variant="outline">{asset.source_module}</Badge>
                  </div>
                </div>
                
                {strategicContext.projectName && (
                  <div>
                    <p className="text-sm text-muted-foreground">Original Project</p>
                    <p className="text-sm font-medium">{strategicContext.projectName}</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Strategic Context */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Strategic Context
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {strategicContext.indication && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Indication</p>
                    <p className="text-sm">{strategicContext.indication}</p>
                  </div>
                )}
                
                {strategicContext.keyMessage && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Key Message</p>
                    <p className="text-sm">{strategicContext.keyMessage}</p>
                  </div>
                )}
                
                {strategicContext.callToAction && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Call to Action</p>
                    <p className="text-sm">{strategicContext.callToAction}</p>
                  </div>
                )}
                
                {strategicContext.targetAudience && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Target Audience</p>
                    <p className="text-sm">{strategicContext.targetAudience}</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Theme Context */}
            {strategicContext.themeName && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Theme Context
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Theme Name</p>
                    <p className="text-sm font-semibold">{strategicContext.themeName}</p>
                  </div>
                  
                  {strategicContext.themeDescription && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Description</p>
                      <p className="text-sm">{strategicContext.themeDescription}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
            
            {/* Content Preview */}
            {(asset.content || asset.metadata?.content) && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Content Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm whitespace-pre-wrap line-clamp-6">
                      {typeof asset.content === 'string' ? asset.content : (asset.content?.content || asset.metadata?.content)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>
        
        <Separator />
        
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSelect}>
            Select Asset & Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export {AssetPreviewModal};