import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SimplifiedTranslationHub } from '@/components/localization/phases/SimplifiedTranslationHub';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';

export default function TranslationWorkspace() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [projectData, setProjectData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProjectData = async () => {
      if (!projectId) {
        setError('No project ID provided');
        setLoading(false);
        return;
      }

      try {
        console.log('🔄 Loading translation workspace for project:', projectId);
        
        // Load complete project with workflow and segments
        const { data: project, error: projectError } = await supabase
          .from('localization_projects')
          .select('*')
          .eq('id', projectId)
          .single();

        if (projectError) throw projectError;
        if (!project) throw new Error('Project not found');

        // Load workflow with segments
        const { data: workflow, error: workflowError } = await supabase
          .from('localization_workflows')
          .select('*')
          .eq('localization_project_id', projectId)
          .maybeSingle();

        if (workflowError) {
          console.error('⚠️ Error loading workflow:', workflowError);
        }

        // Extract segments with proper type handling
        const segments = Array.isArray(workflow?.segment_translations) 
          ? workflow.segment_translations 
          : [];

        console.log('✅ Project loaded with workflow:', {
          project: project.project_name,
          segments: segments.length,
          metadata: project.metadata
        });

        // Combine project and workflow data
        setProjectData({
          ...project,
          workflow,
          segments
        });
        setLoading(false);
      } catch (err) {
        console.error('❌ Error loading project:', err);
        setError(err?.message || 'Failed to load project');
        setLoading(false);
        toast({
          title: 'Error',
          description: 'Failed to load project data',
          variant: 'destructive'
        });
      }
    };

    loadProjectData();
  }, [projectId, toast]);

  const handleBack = () => {
    navigate('/localization');
  };

  const handlePhaseComplete = async (data) => {
    console.log('✅ Translation phase completed:', data);
    toast({
      title: 'Progress Saved',
      description: 'Your translation work has been saved successfully'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-[2560px]">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading translation workspace...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !projectData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-[2560px]">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-destructive">Error Loading Project</h2>
            <p className="text-muted-foreground">{error || 'Project not found'}</p>
            <Button onClick={handleBack} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-[2560px]">
        {/* Back Button */}
        <div className="mb-6">
          <Button onClick={handleBack} variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
        </div>

        {/* Translation Hub */}
        <SimplifiedTranslationHub
          selectedAsset={projectData.metadata?.selectedAsset || null}
          globalMetadata={projectData.metadata?.globalMetadata || {}}
          preloadedSegments={projectData.segments || []}
          onPhaseComplete={handlePhaseComplete}
          onBack={handleBack}
          projectId={projectId}
        />
      </div>
    </div>
  );
}