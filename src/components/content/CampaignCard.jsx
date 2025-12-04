import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  ChevronDown, 
  ChevronUp, 
  Edit3, 
  Send, 
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  Trash2
} from "lucide-react";
import { ContentProgressCalculator } from "./ContentProgressCalculator";
import { formatDistance } from "date-fns";

export const CampaignCard = ({ 
  projectId, 
  assets, 
  projects, 
  onEditAsset, 
  onPublishToDesign,
  onDeleteProject,
  onDeleteAsset,
  deleting = false
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const project = projects.find(p => p.id === projectId);
  const projectName = project?.project_name || `Campaign ${projectId.slice(0, 8)}`;
  
  // Deduplicate assets by ID to prevent rendering duplicates
  const uniqueAssets = Array.from(
    new Map(assets.map(asset => [asset.id, asset])).values()
  );

  // Debug: Log if duplicates were found
  if (assets.length !== uniqueAssets.length) {
    console.warn(`[CampaignCard] Removed ${assets.length - uniqueAssets.length} duplicate assets for project ${projectId}`);
  }
  
  // Calculate overall campaign progress
  const overallProgress = uniqueAssets.length > 0 
    ? Math.round(uniqueAssets.reduce((acc, asset) => {
        const progress = ContentProgressCalculator.calculateProgress(asset);
        return acc + progress.overall;
      }, 0) / uniqueAssets.length)
    : 0;

  const getStatusIcon = (asset) => {
    const progress = ContentProgressCalculator.calculateProgress(asset);
    if (asset.status === 'completed' || asset.status === 'design_ready') {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    if (asset.status === 'in_review') {
      return <Send className="h-4 w-4 text-blue-500" />;
    }
    if (progress.overall > 0) {
      return <Edit3 className="h-4 w-4 text-yellow-500" />;
    }
    return <AlertTriangle className="h-4 w-4 text-red-500" />;
  };

  const getStatusText = (asset) => {
    switch (asset.status) {
      case 'completed':
      case 'design_ready':
        return 'Ready for Design';
      case 'in_review':
        return 'In Review';
      case 'draft':
      default:
        return 'In Progress';
    }
  };

  const getPrimaryAction = (asset) => {
    if (asset.status === 'completed' || asset.status === 'design_ready') {
      return {
        label: 'View in Design Studio',
        action: () => onPublishToDesign(asset),
        variant: 'default'
      };
    }
    return {
      label: 'Edit Content',
      action: () => onEditAsset(asset.id),
      variant: 'outline'
    };
  };

  return (
    <Card className="w-full">
      <CardHeader 
        className="cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg font-semibold">{projectName}</CardTitle>
                {project?.project_type && (
                  <Badge 
                    variant={project.project_type === 'campaign' ? 'default' : 'secondary'} 
                    className="text-xs"
                  >
                    {project.project_type === 'single-asset' ? 'Single Asset' : 'Campaign'}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-4 mt-2">
                <Badge variant="secondary" className="text-xs">
                  {uniqueAssets.length} asset{uniqueAssets.length !== 1 ? 's' : ''}
                </Badge>
                {project?.therapeutic_area && (
                  <Badge variant="outline" className="text-xs">
                    {project.therapeutic_area}
                  </Badge>
                )}
                {project?.created_at && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDistance(new Date(project.created_at), new Date(), { addSuffix: true })}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm font-medium">
                {overallProgress}% Complete
              </div>
              <Progress value={overallProgress} className="w-24 mt-1" />
            </div>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-destructive hover:text-destructive"
                  disabled={deleting}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Campaign</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{projectName}"? This action will permanently delete the campaign and all its assets. This cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDeleteProject(projectId)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete Campaign
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="pt-0">
          <div className="space-y-3">
            {uniqueAssets.map((asset) => {
              const progress = ContentProgressCalculator.calculateProgress(asset);
              const primaryAction = getPrimaryAction(asset);
              
              return (
                <div 
                  key={asset.id}
                  className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    {getStatusIcon(asset)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-sm">{asset.asset_name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {asset.asset_type}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-xs text-muted-foreground">
                          {getStatusText(asset)}
                        </span>
                        <div className="flex items-center gap-1">
                          <Progress value={progress.overall} className="w-16 h-1" />
                          <span className="text-xs text-muted-foreground">
                            {progress.overall}%
                          </span>
                        </div>
                        {asset.updated_at && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDistance(new Date(asset.updated_at), new Date(), { addSuffix: true })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      size="sm"
                      variant={primaryAction.variant}
                      onClick={primaryAction.action}
                      className="gap-1"
                    >
                      <Edit3 className="h-3 w-3" />
                      {primaryAction.label}
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-destructive hover:text-destructive"
                          disabled={deleting}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Asset</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{asset.asset_name}"? This action will permanently delete the asset and all its content. This cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onDeleteAsset(asset.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete Asset
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              );
            })}
          </div>
          
          {project?.description && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                {project.description}
              </p>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};

export default CampaignCard;