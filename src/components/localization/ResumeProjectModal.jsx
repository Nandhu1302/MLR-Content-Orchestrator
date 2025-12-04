import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, Clock, FileText, History } from 'lucide-react';
import { LocalizationHistoryPanel } from './LocalizationHistoryPanel';
import { useState } from 'react';

export const ResumeProjectModal = ({
  open,
  onOpenChange,
  projectData,
  onResume,
  onStartFresh,
  onViewOnly,
}) => {
  const [showHistory, setShowHistory] = useState(false);
  const isCompleted = projectData.status === 'completed';
  const isInProgress = projectData.status === 'in_progress';

  const getStatusIcon = () => {
    if (isCompleted) return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    if (isInProgress) return <Clock className="h-5 w-5 text-yellow-500" />;
    return <AlertCircle className="h-5 w-5 text-blue-500" />;
  };

  const getStatusBadge = () => {
    if (isCompleted) return <Badge variant="default" className="bg-green-500">Completed</Badge>;
    if (isInProgress) return <Badge variant="default" className="bg-yellow-500">In Progress</Badge>;
    return <Badge variant="secondary">Draft</Badge>;
  };

  if (showHistory && projectData.assetId) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[90vw] sm:max-w-[800px] lg:max-w-[900px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Localization History
            </DialogTitle>
            <DialogDescription>
              View all localization projects for this asset
            </DialogDescription>
          </DialogHeader>
          
          <LocalizationHistoryPanel 
            assetId={projectData.assetId}
            className="border-0"
          />
          
          <div className="flex justify-end pt-4">
            <Button onClick={() => setShowHistory(false)} variant="outline">
              Back
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getStatusIcon()}
            Existing Localization Found
          </DialogTitle>
          <DialogDescription>
            This asset has already been localized for the selected market.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Project Info */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Asset:</span>
              <span className="text-sm text-muted-foreground">{projectData.assetName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Target Market:</span>
              <span className="text-sm text-muted-foreground">{projectData.market}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Status:</span>
              {getStatusBadge()}
            </div>
          </div>

          {/* Progress Info */}
          {projectData.completedSegments !== undefined && projectData.totalSegments && (
            <div className="rounded-lg border p-3 space-y-2">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Translation Progress</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {projectData.completedSegments} of {projectData.totalSegments} segments
                </span>
                <span className="text-sm font-medium">
                  {Math.round((projectData.completedSegments / projectData.totalSegments) * 100)}%
                </span>
              </div>
              <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                <div
                  className="bg-primary h-full transition-all"
                  style={{
                    width: `${(projectData.completedSegments / projectData.totalSegments) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Last Updated */}
          <div className="text-xs text-muted-foreground">
            {isCompleted && projectData.completionDate
              ? `Completed on ${new Date(projectData.completionDate).toLocaleDateString()}`
              : `Last updated ${new Date(projectData.lastUpdated).toLocaleDateString()}`}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 pt-2">
            {projectData.assetId && (
              <Button 
                onClick={() => setShowHistory(true)} 
                variant="outline" 
                className="w-full"
              >
                <History className="mr-2 h-4 w-4" />
                View All Localization History
              </Button>
            )}
            
            {isCompleted ? (
              <>
                {onViewOnly && (
                  <Button onClick={onViewOnly} variant="default" className="w-full">
                    <FileText className="mr-2 h-4 w-4" />
                    View Translation
                  </Button>
                )}
                <Button onClick={onResume} variant="outline" className="w-full">
                  Edit Translation
                </Button>
                <Button onClick={onStartFresh} variant="outline" className="w-full">
                  Create New Version
                </Button>
              </>
            ) : (
              <>
                <Button onClick={onResume} variant="default" className="w-full">
                  <Clock className="mr-2 h-4 w-4" />
                  Resume Where You Left Off
                </Button>
                <Button onClick={onStartFresh} variant="outline" className="w-full">
                  Start Fresh
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};