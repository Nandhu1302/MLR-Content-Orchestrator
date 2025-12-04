import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Plus, 
  RefreshCw, 
  Clock, 
  CheckCircle,
  FileText,
  AlertCircle,
  ArrowRight,
  Copy,
  Eye,
  Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocalizationManagement } from '@/hooks/useLocalizationManagement';
import { useAuth } from '@/contexts/AuthContext';
import { useBrand } from '@/contexts/BrandContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import { ProjectNameEditor } from './ProjectNameEditor';

const ProjectCard = ({ 
  project, 
  onResume, 
  onView, 
  onCopy,
  onDelete,
  onNameUpdate,
  isCompleted 
}) => {
  const [localName, setLocalName] = React.useState(project.project_name);
  // Calculate progress based on workflow_state phases
  const ws = project.workflow_state;
  
  const completedPhases = isCompleted ? 7 : [
    ws?.phase1Complete,
    ws?.phase2Complete,
    ws?.phase3Complete,
    ws?.phase4Complete,
    ws?.phase5Complete,
    ws?.phase6Complete,
    ws?.phase7Complete
  ].filter(Boolean).length;
  
  const totalPhases = 7;
  const progress = (completedPhases / totalPhases) * 100;
  
  // Determine current phase
  let currentPhase = 'Phase 1: Global Context';
  if (ws?.phase1Complete) currentPhase = 'Phase 2: Smart TM';
  if (ws?.phase2Complete) currentPhase = 'Phase 3: Cultural Intelligence';
  if (ws?.phase3Complete) currentPhase = 'Phase 4: Quality Intelligence';
  if (ws?.phase4Complete) currentPhase = 'Phase 5: Regulatory Compliance';
  if (ws?.phase5Complete) currentPhase = 'Phase 6: Integration Lineage';
  if (ws?.phase6Complete) currentPhase = 'Phase 7: Agency Handoff';
  
  console.log(`[ProjectCard] ${project.project_name}:`, {
    completedPhases,
    progress,
    currentPhase,
    workflowState: ws
  });

  return (
    <Card className="hover:shadow-lg transition-shadow group">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg font-semibold line-clamp-1">
                {localName}
              </CardTitle>
              <ProjectNameEditor
                projectId={project.id}
                currentName={localName}
                onNameUpdated={(newName) => {
                  setLocalName(newName);
                  onNameUpdate(project.id, newName);
                }}
              />
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {project.description || 'No description'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={isCompleted ? "default" : "secondary"}>
              {isCompleted ? 'Completed' : 'In Progress'}
            </Badge>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(project);
              }}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Progress Bar (only for in-progress) */}
        {!isCompleted && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Current: {currentPhase}</span>
              <span className="font-medium">{completedPhases} / {totalPhases} phases</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{Math.round(progress)}% complete</span>
            </div>
          </div>
        )}

        {/* Market & Language Info */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {typeof project.target_markets?.[0] === 'string' 
                ? project.target_markets[0] 
                : project.target_markets?.[0]?.market || 'Global'}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground">
              {(() => {
                // First try project-level language data
                const projectLanguages = project.target_languages?.length || 0;
                if (projectLanguages > 0) {
                  return `${projectLanguages} ${projectLanguages === 1 ? 'language' : 'languages'}`;
                }
                
                // Fallback: extract from workflow_state if available
                const ws = project.workflow_state;
                if (ws?.selectedLanguages && ws.selectedLanguages.length > 0) {
                  return `${ws.selectedLanguages.length} ${ws.selectedLanguages.length === 1 ? 'language' : 'languages'}`;
                }
                
                // Check metadata for language info
                const metadata = project.metadata;
                if (metadata?.targetLanguage) {
                  return '1 language';
                }
                
                return 'No languages set';
              })()}
            </span>
          </div>
        </div>

        {/* Last Modified / Completion Date */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {isCompleted ? 'Completed' : 'Last modified'}: {
              new Date(
                isCompleted && project.completed_at ? project.completed_at : project.updated_at
              ).toLocaleDateString()
            }
          </span>
          {isCompleted && project.usage_count !== undefined && (
            <Badge variant="outline" className="text-xs">
              Used {project.usage_count} {project.usage_count === 1 ? 'time' : 'times'}
            </Badge>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {isCompleted ? (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => onView(project)}
              >
                <Eye className="h-3.5 w-3.5 mr-1.5" />
                View
              </Button>
              <Button 
                variant="default" 
                size="sm" 
                className="flex-1"
                onClick={() => onCopy(project)}
              >
                <Copy className="h-3.5 w-3.5 mr-1.5" />
                Create Copy
              </Button>
            </>
          ) : (
            <Button 
              variant="default" 
              size="sm" 
              className="flex-1"
              onClick={() => onResume(project)}
            >
              Resume Work
              <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export const SimplifiedLocalizationDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { selectedBrand } = useBrand();
  const { toast } = useToast();

  const {
    localizationProjects,
    loading,
    error,
    refreshData
  } = useLocalizationManagement({ autoLoad: true });

  // Migrate projects with empty language data on mount
  useEffect(() => {
    const migrateProjectLanguages = async () => {
      if (!selectedBrand?.id) return;
      
      try {
        // Find projects with empty target_languages
        const { data: emptyProjects } = await supabase
          .from('localization_projects')
          .select('id, target_languages')
          .eq('brand_id', selectedBrand.id)
          .eq('status', 'in_progress');
        
        if (emptyProjects && emptyProjects.length > 0) {
          for (const project of emptyProjects) {
            const targetLanguages = project.target_languages;
            if (!targetLanguages || targetLanguages.length === 0) {
              // Get language from workflows
              const { data: workflows } = await supabase
                .from('localization_workflows')
                .select('language, market')
                .eq('localization_project_id', project.id)
                .limit(1);
              
              if (workflows && workflows.length > 0) {
                const lang = workflows[0].language;
                const market = workflows[0].market;
                console.log(`売 Migrating project ${project.id} with language: ${lang}, market: ${market}`);
                
                await supabase
                  .from('localization_projects')
                  .update({
                    target_languages: [lang],
                    target_markets: [market]
                  })
                  .eq('id', project.id);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error migrating project languages:', error);
      }
    };
    
    migrateProjectLanguages().then(() => refreshData());
  }, [refreshData, selectedBrand?.id]);

  const inProgressProjects = localizationProjects?.filter(
    p => p.status !== 'completed'
  ) || [];
  
  const completedProjects = localizationProjects?.filter(
    p => p.status === 'completed'
  ) || [];

  const handleCreateNew = () => {
    navigate('/localization/workflow/new');
  };

  const handleResume = (project) => {
    console.log('桃 Resuming work on project:', project.id, project.project_name);
    navigate(`/localization/workspace/${project.id}`);
  };

  const handleView = (project) => {
    // Navigate to read-only view
    navigate(`/localization/workflow/${project.id}?readonly=true`);
  };

  const handleCopy = async (project) => {
    if (!user || !selectedBrand) return;

    try {
      const projectAny = project;
      
      // Create a copy of the project
      const { data: newProject, error: copyError } = await supabase
        .from('localization_projects')
        .insert([{
          brand_id: selectedBrand.id,
          project_name: `${project.project_name} (Copy ${(projectAny.usage_count || 0) + 1})`,
          description: project.description,
          project_type: project.project_type,
          source_content_type: project.source_content_type,
          source_content_id: project.source_content_id,
          target_markets: project.target_markets,
          target_languages: project.target_languages,
          priority_level: project.priority_level,
          regulatory_complexity: project.regulatory_complexity,
          cultural_sensitivity_level: project.cultural_sensitivity_level,
          mlr_inheritance: project.mlr_inheritance,
          metadata: project.metadata,
          original_project_id: project.id,
          copy_number: (projectAny.copy_number || 1) + 1,
          usage_count: 0,
          status: 'draft',
          created_by: user.id
        }])
        .select()
        .single();

      if (copyError) throw copyError;

      // Increment usage count on original
      await supabase
        .from('localization_projects')
        .update({ 
          usage_count: (projectAny.usage_count || 0) + 1 
        })
        .eq('id', project.id);

      toast({
        title: "Project Copied",
        description: `Created a copy of "${project.project_name}"`,
      });

      // Navigate to the new copy
      navigate(`/localization/workflow/${newProject.id}`);
    } catch (error) {
      console.error('Error copying project:', error);
      toast({
        title: "Error",
        description: "Failed to copy project. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (project) => {
    if (!window.confirm(`Are you sure you want to delete "${project.project_name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('localization_projects')
        .delete()
        .eq('id', project.id);

      if (error) throw error;

      toast({
        title: "Project Deleted",
        description: `"${project.project_name}" has been deleted successfully`,
      });

      refreshData();
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: "Error",
        description: "Failed to delete project. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleNameUpdate = (projectId, newName) => {
    console.log('統 Project name updated:', projectId, newName);
    refreshData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground">Loading projects...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-center">
            <div className="text-center space-y-4">
              <AlertCircle className="h-8 w-8 text-destructive mx-auto" />
              <p className="text-destructive">{error}</p>
              <Button onClick={refreshData} variant="outline">
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Localization Hub</h1>
              <p className="text-muted-foreground mt-1">
                Manage global content localization projects with AI-powered intelligence
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                onClick={() => {
                  console.log('売 Manual refresh triggered');
                  refreshData();
                }} 
                variant="outline" 
                size="sm" 
                disabled={loading}
              >
                <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
                Refresh
              </Button>
              <Button onClick={handleCreateNew} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Create New Project
              </Button>
            </div>
          </div>

          {/* In Progress Projects */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-xl font-semibold">In Progress Projects</h2>
              <Badge variant="secondary">{inProgressProjects.length}</Badge>
            </div>

            {inProgressProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {inProgressProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onResume={handleResume}
                    onView={handleView}
                    onCopy={handleCopy}
                    onDelete={handleDelete}
                    onNameUpdate={handleNameUpdate}
                    isCompleted={false}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No projects in progress</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Start a new localization project to get going
                  </p>
                  <Button onClick={handleCreateNew}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Project
                  </Button>
                </CardContent>
              </Card>
            )}
          </section>

          {/* Completed Projects */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-xl font-semibold">Completed Projects</h2>
              <Badge variant="secondary">{completedProjects.length}</Badge>
            </div>

            {completedProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {completedProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onResume={handleResume}
                    onView={handleView}
                    onCopy={handleCopy}
                    onDelete={handleDelete}
                    onNameUpdate={handleNameUpdate}
                    isCompleted={true}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <CheckCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No completed projects yet</h3>
                  <p className="text-sm text-muted-foreground">
                    Completed projects will appear here for viewing and reuse
                  </p>
                </CardContent>
              </Card>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};