import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, ArrowRight, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export const SendToLocalizationButton = ({
  contentAsset,
  contentProject,
  className,
  size = "sm"
}) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const isEligible = (contentAsset?.status === 'approved' || contentAsset?.status === 'completed') ||
                    (contentProject?.status === 'approved' || contentProject?.status === 'completed');

  const handleSendToLocalization = () => {
    const contentName = contentAsset?.asset_name || contentProject?.project_name;
    
    toast({
      title: "Sent to Localization",
      description: `${contentName} has been queued for localization. You'll be redirected to create the localization project.`,
    });

    setOpen(false);
    
    // Navigate to localization hub with context
    navigate('/localization', { 
      state: { 
        sourceContent: contentAsset || contentProject,
        autoCreateProject: true
      }
    });
  };

  if (!isEligible) {
    return (
      <Button variant="outline" size={size} disabled className={className}>
        <Globe className="h-4 w-4 mr-2" />
        Localize (Complete First)
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size={size} className={className}>
          <Globe className="h-4 w-4 mr-2" />
          Send to Localization
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            Send to Localization Hub
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Ready for Localization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Content:</span>
                  <span className="text-sm font-medium">
                    {contentAsset?.asset_name || contentProject?.project_name}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Type:</span>
                  <Badge variant="secondary" className="text-xs">
                    {contentAsset?.asset_type || 'Project'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <Badge variant="default" className="text-xs">
                    {contentAsset?.status || contentProject?.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <ArrowRight className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-100">Next Steps</h4>
                <p className="text-sm text-blue-700 dark:text-blue-200 mt-1">
                  This will create a new localization project in the Localization Hub where you can:
                </p>
                <ul className="text-sm text-blue-700 dark:text-blue-200 mt-2 space-y-1">
                  <li>• Select target markets and languages</li>
                  <li>• Choose localization agencies</li>
                  <li>• Track translation progress</li>
                  <li>• Manage regulatory compliance</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSendToLocalization} className="flex-1">
              <Globe className="h-4 w-4 mr-2" />
              Send to Localization
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};