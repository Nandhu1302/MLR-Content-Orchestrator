import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
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
} from '@/components/ui/alert-dialog';
import { Trash2, Database } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const ProjectDeleteButton = ({
  projectId,
  projectName,
  onDeleted,
  variant = 'destructive',
  size = 'sm'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      // Step 1: Delete associated workflows first (foreign key constraint)
      const { error: workflowError } = await supabase
        .from('localization_workflows')
        .delete()
        .eq('localization_project_id', projectId);

      if (workflowError) {
        console.warn('Error deleting workflows:', workflowError);
        // Continue with deletion
      }

      // Step 2: Delete the project
      // Note: Translation memory is always preserved in the database for future use
      const { error: projectError } = await supabase
        .from('localization_projects')
        .delete()
        .eq('id', projectId);

      if (projectError) throw projectError;

      toast({
        title: "Project Deleted",
        description: `${projectName} has been deleted. Translation memory has been preserved for future projects.`,
      });

      onDeleted();
      setIsOpen(false);
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: "Error",
        description: "Failed to delete project. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant={variant} size={size}>
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Project?</AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            <p>
              Are you sure you want to delete <strong>{projectName}</strong>? 
              This action cannot be undone.
            </p>
            
            <div className="bg-muted p-4 rounded-lg space-y-3">
              <div className="flex items-start gap-3">
                <Database className="h-4 w-4 text-primary mt-1" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Translation Memory Preserved</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    All translations from this project will be kept in the translation memory database 
                    for future reuse. This helps build a stronger translation memory over time.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-xs text-primary">
              ✓ Translation memory will be retained and available for future projects
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? 'Deleting...' : 'Delete Project'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};