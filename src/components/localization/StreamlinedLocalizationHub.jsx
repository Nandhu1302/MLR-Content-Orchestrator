import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Languages, 
  FileText,
  Plus,
  Timer,
  DollarSign,
  RefreshCw,
  Upload,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocalizationManagement } from '@/hooks/useLocalizationManagement';
import { TranslationHubWorkspace } from './TranslationHubWorkspace';
import { CreateProjectModal } from './CreateProjectModal';

export const StreamlinedLocalizationHub = ({ 
  className 
}) => {
  const [selectedProject, setSelectedProject] = useState(null);

  const {
    localizationProjects,
    dashboardData,
    loading,
    refreshData,
  } = useLocalizationManagement({
    autoLoad: true
  });

  const handleProjectCreated = (projectId) => {
    refreshData();
  };

  const handleStartTranslation = (project) => {
    setSelectedProject(project);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading localization hub...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Streamlined Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Translation Hub</h1>
          <p className="text-muted-foreground">
            AI-powered translation workspace with automated handoff
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button onClick={refreshData} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <CreateProjectModal onProjectCreated={handleProjectCreated}>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </CreateProjectModal>
        </div>
      </div>

      {/* Key Metrics Strip */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Projects</p>
              <p className="text-2xl font-bold">{dashboardData?.active_projects || 0}</p>
            </div>
            <FileText className="h-8 w-8 text-primary" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">TM Leverage</p>
              <p className="text-2xl font-bold">{dashboardData?.avg_translation_memory_leverage || 0}%</p>
            </div>
            <Languages className="h-8 w-8 text-primary" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Cost Savings</p>
              <p className="text-2xl font-bold">${(dashboardData?.total_cost_savings || 0).toLocaleString()}</p>
            </div>
            <DollarSign className="h-8 w-8 text-primary" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Time Saved</p>
              <p className="text-2xl font-bold">{dashboardData?.avg_time_reduction || 0}%</p>
            </div>
            <Timer className="h-8 w-8 text-primary" />
          </div>
        </Card>
      </div>

      {/* Main Translation Workspace */}
      <div className="space-y-6">
          {selectedProject ? (
            <TranslationHubWorkspace 
              project={selectedProject}
              onBack={() => setSelectedProject(null)}
            />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Languages className="h-5 w-5" />
                  Select Project to Start Translation
                </CardTitle>
              </CardHeader>
              <CardContent>
                {localizationProjects && localizationProjects.length > 0 ? (
                  <div className="space-y-4">
                    {localizationProjects
                      .filter(p => p.status !== 'completed')
                      .map((project) => (
                        <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <h3 className="font-medium">{project.project_name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {project.target_languages?.length || 0} languages • {project.project_type || 'Localization'}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              {project.status}
                            </Badge>
                            <Button 
                              size="sm" 
                              onClick={() => handleStartTranslation(project)}
                            >
                              Start Translation
                              <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No projects available</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Create a localization project to start translating
                    </p>
                    <CreateProjectModal onProjectCreated={handleProjectCreated}>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Create First Project
                      </Button>
                    </CreateProjectModal>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
      </div>
    </div>
  );
};