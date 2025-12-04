import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Clock, Play, Trash2, FolderOpen } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';

export const InProgressWorkflows = ({ 
  projects: propProjects, 
  onResumeWorkflow,
  onProjectDeleted 
}) => {
  const [workflows, setWorkflows] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Use projects from props (brand-filtered by parent)
    if (propProjects) {
      console.log('[InProgressWorkflows] Processing projects:', propProjects.length);
      
      const dbWorkflows = propProjects
        .filter(p => p.status !== 'completed')
        .map(project => {
          const ws = project.workflow_state;
          
          // Handle empty or undefined workflow_state gracefully
          const completedPhases = [
            ws?.phase1Complete,
            ws?.phase2Complete,
            ws?.phase3Complete,
            ws?.phase4Complete,
            ws?.phase5Complete,
            ws?.phase6Complete,
            ws?.phase7Complete
          ].filter(Boolean).length;
          
          // Calculate progress based on completed phases
          const totalPhases = 7;
          const overallProgress = (completedPhases / totalPhases) * 100;
          
          // Determine current step based on what's completed
          let currentStep = 'Phase 1: Global Context';
          if (ws?.phase1Complete) currentStep = 'Phase 2: Smart TM';
          if (ws?.phase2Complete) currentStep = 'Phase 3: Cultural Intelligence';
          if (ws?.phase3Complete) currentStep = 'Phase 4: Quality Intelligence';
          if (ws?.phase4Complete) currentStep = 'Phase 5: Regulatory Compliance';
          if (ws?.phase5Complete) currentStep = 'Phase 6: Integration Lineage';
          if (ws?.phase6Complete) currentStep = 'Phase 7: Agency Handoff';
          
          console.log(`[InProgressWorkflows] Project ${project.project_name}:`, {
            completedPhases,
            overallProgress,
            currentStep,
            workflowState: ws
          });
          
          return {
            assetId: project.id,
            assetName: project.project_name,
            assetProject: project.project_name,
            lastModified: new Date(project.last_auto_save || project.updated_at),
            progress: overallProgress,
            currentStep,
            completedSteps: completedPhases,
            totalSteps: totalPhases
          };
        });
      
      setWorkflows(dbWorkflows);
    }
  }, [propProjects]);

  const handleResumeWorkflow = (workflow) => {
    // Navigate directly to workflow page
    navigate(`/localization/workflow/${workflow.assetId}`);
  };

  const handleDeleteWorkflow = async (assetId) => {
    try {
      // Delete from database
      const { error } = await supabase
        .from('localization_projects')
        .delete()
        .eq('id', assetId);
      
      if (error) throw error;
      
      setWorkflows(prev => prev.filter(w => w.assetId !== assetId));
      
      // Notify parent to refresh data
      onProjectDeleted?.();
    } catch (error) {
      console.error('Failed to delete workflow:', error);
    }
  };

  if (workflows.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FolderOpen className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No workflows in progress</h3>
          <p className="text-muted-foreground text-center">
            Start a localization workflow from the Asset Discovery tab to see your progress here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold mb-2">In Progress Workflows</h2>
        <p className="text-muted-foreground">
          Resume your localization workflows or start fresh with new assets.
        </p>
      </div>

      <div className="grid gap-4">
        {workflows.map((workflow) => (
          <Card key={workflow.assetId} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{workflow.assetName}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    {workflow.assetProject && (
                      <Badge variant="outline">{workflow.assetProject}</Badge>
                    )}
                    <span className="flex items-center gap-1 text-sm">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(workflow.lastModified, { addSuffix: true })}
                    </span>
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleResumeWorkflow(workflow)}
                    className="flex items-center gap-2"
                  >
                    <Play className="h-3 w-3" />
                    Resume
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Workflow</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this workflow? All progress will be lost and cannot be recovered.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteWorkflow(workflow.assetId)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>Current Step: {workflow.currentStep}</span>
                  <span>{workflow.completedSteps} of {workflow.totalSteps} steps completed</span>
                </div>
                <Progress value={workflow.progress} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{Math.round(workflow.progress)}% complete</span>
                  <span>{workflow.totalSteps - workflow.completedSteps} steps remaining</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};