import React, { useState, useEffect } from 'react';
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
import { Trash2, Database, Brain, Shield, Languages } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const GlocalProjectDeleteButton = ({
  projectId,
  projectName,
  onDeleted,
  variant = 'destructive',
  size = 'sm'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [preservationStats, setPreservationStats] = useState({
    tmIntelligenceCount: 0,
    culturalInsightsCount: 0,
    regulatoryDataCount: 0,
    aiTranslationsCount: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      loadPreservationStats();
    }
  }, [isOpen]);

  const loadPreservationStats = async () => {
    setIsLoadingStats(true);
    try {
      const [tmData, culturalData, regulatoryData, aiTranslationData] = await Promise.all([
        supabase
          .from('glocal_tm_intelligence')
          .select('id', { count: 'exact', head: true })
          .eq('project_id', projectId),
        supabase
          .from('glocal_cultural_intelligence')
          .select('id', { count: 'exact', head: true })
          .eq('project_id', projectId),
        supabase
          .from('glocal_regulatory_compliance')
          .select('id', { count: 'exact', head: true })
          .eq('project_id', projectId),
        supabase
          .from('ai_translation_results')
          .select('id', { count: 'exact', head: true })
          .eq('project_id', projectId)
      ]);

      setPreservationStats({
        tmIntelligenceCount: tmData.count || 0,
        culturalInsightsCount: culturalData.count || 0,
        regulatoryDataCount: regulatoryData.count || 0,
        aiTranslationsCount: aiTranslationData.count || 0
      });
    } catch (error) {
      console.error('Error loading preservation stats:', error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const { error: projectError } = await supabase
        .from('glocal_adaptation_projects')
        .delete()
        .eq('id', projectId);

      if (projectError) throw projectError;

      const totalDataPreserved = 
        preservationStats.tmIntelligenceCount +
        preservationStats.culturalInsightsCount +
        preservationStats.regulatoryDataCount +
        preservationStats.aiTranslationsCount;

      toast({
        title: "Project Deleted Successfully",
        description: `${projectName} has been deleted. ${totalDataPreserved} intelligence data points preserved for future projects.`,
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

  const totalDataValue = 
    preservationStats.tmIntelligenceCount +
    preservationStats.culturalInsightsCount +
    preservationStats.regulatoryDataCount +
    preservationStats.aiTranslationsCount;

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant={variant} size={size}>
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Glocal Adaptation Project?</AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            <p>
              Are you sure you want to delete <strong>{projectName}</strong>? 
              This action cannot be undone.
            </p>
            
            {isLoadingStats ? (
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Analyzing data for preservation...</p>
              </div>
            ) : totalDataValue > 0 ? (
              <div className="bg-muted p-4 rounded-lg space-y-4">
                <div className="flex items-start gap-3">
                  <Database className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      Intelligence Data Will Be Preserved
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      All valuable data from this project will be kept for future reuse, 
                      helping build better translation memory and cultural intelligence over time.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-3">
                  {preservationStats.tmIntelligenceCount > 0 && (
                    <div className="flex items-center gap-2 text-xs">
                      <Languages className="h-4 w-4 text-primary" />
                      <span>
                        <strong>{preservationStats.tmIntelligenceCount}</strong> TM Intelligence entries
                      </span>
                    </div>
                  )}
                  
                  {preservationStats.culturalInsightsCount > 0 && (
                    <div className="flex items-center gap-2 text-xs">
                      <Brain className="h-4 w-4 text-primary" />
                      <span>
                        <strong>{preservationStats.culturalInsightsCount}</strong> Cultural insights
                      </span>
                    </div>
                  )}
                  
                  {preservationStats.regulatoryDataCount > 0 && (
                    <div className="flex items-center gap-2 text-xs">
                      <Shield className="h-4 w-4 text-primary" />
                      <span>
                        <strong>{preservationStats.regulatoryDataCount}</strong> Regulatory validations
                      </span>
                    </div>
                  )}
                  
                  {preservationStats.aiTranslationsCount > 0 && (
                    <div className="flex items-center gap-2 text-xs">
                      <Database className="h-4 w-4 text-primary" />
                      <span>
                        <strong>{preservationStats.aiTranslationsCount}</strong> AI translations
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  No intelligence data to preserve from this project.
                </p>
              </div>
            )}

            {totalDataValue > 0 && (
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-primary">
                  ✓ Translation memory intelligence preserved for future projects
                </div>
                <div className="flex items-center gap-2 text-primary">
                  ✓ Cultural adaptation patterns retained for market optimization
                </div>
                <div className="flex items-center gap-2 text-primary">
                  ✓ Regulatory compliance insights kept for similar therapeutic areas
                </div>
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting || isLoadingStats}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? 'Deleting...' : 'Delete Project'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default GlocalProjectDeleteButton;