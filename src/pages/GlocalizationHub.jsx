import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Globe,
  Plus,
  RefreshCw,
  FileText,
  BarChart3,
  TrendingUp,
  CheckCircle,
  Clock,
  Target,
  Brain,
  Shield,
  Zap,
  Eye,
  Download,
  Upload,
  ArrowLeft
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useBrand } from '@/contexts/BrandContext';
import { useToast } from '@/hooks/use-toast';
import { GlocalProjectDeleteButton } from '@/components/glocal/GlocalProjectDeleteButton';

export default function GlocalizationHub() {
  const navigate = useNavigate();
  const { selectedBrand } = useBrand();
  const { toast } = useToast();
  const currentBrand = selectedBrand;
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    activeProjects: 0,
    languagesSupported: 0,
    culturalIntelligence: 0,
    adaptationSuccess: 0
  });

  useEffect(() => {
    loadProjects();
    calculateMetrics();
  }, [currentBrand]);

  const loadProjects = async () => {
    if (!currentBrand) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('glocal_adaptation_projects')
        .select('*')
        .eq('brand_id', currentBrand.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error loading projects:', error);
      toast({
        title: 'Error',
        description: 'Failed to load projects',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateMetrics = async () => {
    if (!currentBrand) return;

    try {
      const { data: projectData } = await supabase
        .from('glocal_adaptation_projects')
        .select('*')
        .eq('brand_id', currentBrand.id);

      const activeProjects = projectData?.filter(p => 
        p.project_status === 'in_progress' || p.project_status === 'review'
      ).length || 0;

      const allLanguages = new Set(
        projectData?.flatMap(p => p.target_languages || []) || []
      );

      const avgCulturalScore = projectData?.reduce((acc, p) => 
        acc + (p.cultural_intelligence_score || 0), 0
      ) / (projectData?.length || 1);

      const completedSuccess = projectData?.filter(p => 
        p.project_status === 'completed' && p.overall_quality_score >= 80
      ).length || 0;

      setMetrics({
        activeProjects,
        languagesSupported: allLanguages.size,
        culturalIntelligence: Math.round(avgCulturalScore),
        adaptationSuccess: projectData?.length > 0 
          ? Math.round((completedSuccess / projectData.length) * 100) 
          : 0
      });
    } catch (error) {
      console.error('Error calculating metrics:', error);
    }
  };

  const handleCreateProject = () => {
    navigate('/glocalization/create');
  };
  
  const handleImportContent = () => {
    navigate('/import-content');
  };

  const handleResumeDraftProject = async (projectId) => {
    try {
      const { error } = await supabase
        .from('glocal_adaptation_projects')
        .update({ project_status: 'in_progress' })
        .eq('id', projectId);

      if (error) throw error;

      toast({
        title: 'Project Activated',
        description: 'Project moved to In Progress',
      });

      await loadProjects();
      await calculateMetrics();
      navigate(`/glocalization/workspace/${projectId}`);
    } catch (error) {
      console.error('Error resuming draft project:', error);
      toast({
        title: 'Error',
        description: 'Failed to resume project',
        variant: 'destructive'
      });
    }
  };

  const handleResumeProject = (projectId) => {
    navigate(`/glocalization/workspace/${projectId}`);
  };

  const handleViewResults = (projectId) => {
    navigate(`/glocalization/results/${projectId}`);
  };

  const getStatusColor = (status) => {
    const colors = {
      draft: 'secondary',
      in_progress: 'default',
      review: 'secondary',
      completed: 'default',
      archived: 'outline'
    };
    return colors[status] || 'default';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'in_progress':
        return <Clock className="h-4 w-4" />;
      case 'review':
        return <Eye className="h-4 w-4" />;
      case 'draft':
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Action Bar */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/')}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold">Glocalization Hub</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {metrics.activeProjects} active projects · {metrics.languagesSupported} languages supported
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => loadProjects()} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleCreateProject}>
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Projects</p>
              <p className="text-3xl font-bold mt-2">{metrics.activeProjects}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <FileText className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Languages Supported</p>
              <p className="text-3xl font-bold mt-2">{metrics.languagesSupported}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Globe className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Cultural Intelligence</p>
              <p className="text-3xl font-bold mt-2">{metrics.culturalIntelligence}%</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Brain className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Adaptation Success</p>
              <p className="text-3xl font-bold mt-2">{metrics.adaptationSuccess}%</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Button
            onClick={handleCreateProject}
            variant="outline"
            className="h-auto py-6 flex-col gap-2"
          >
            <Plus className="h-8 w-8" />
            <span>New Project</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto py-6 flex-col gap-2"
            onClick={handleImportContent}
          >
            <Upload className="h-8 w-8" />
            <span>Import Content</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto py-6 flex-col gap-2"
          >
            <Brain className="h-8 w-8" />
            <span>Cultural Analysis</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto py-6 flex-col gap-2"
          >
            <BarChart3 className="h-8 w-8" />
            <span>View Reports</span>
          </Button>
        </div>
      </Card>

      {/* Draft Projects */}
      {projects.filter(p => p.project_status === 'draft').length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Draft Projects</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {projects
              .filter(p => p.project_status === 'draft')
              .map((project) => {
                // Parse channel type from source_content
                const sourceContent = project.source_content || {};
                const channelType = sourceContent.assetType || sourceContent.type || 'Content';
                
                return (
                  <Card key={project.id} className="p-6 hover:shadow-lg transition-shadow border-dashed">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{project.project_name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {channelType}
                            </Badge>
                            <span className="text-xs text-muted-foreground">·</span>
                            <p className="text-sm text-muted-foreground">
                              {project.therapeutic_area} · {project.indication}
                            </p>
                          </div>
                        </div>
                        <Badge variant={getStatusColor(project.project_status)}>
                          {getStatusIcon(project.project_status)}
                          <span className="ml-2 capitalize">Draft</span>
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Target Markets</span>
                          <span className="font-medium">
                            {Array.isArray(project.target_markets) ? project.target_markets.join(', ') : '—'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Languages</span>
                          <span className="font-medium">
                            {Array.isArray(project.target_languages) ? project.target_languages.length : 0}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          onClick={() => handleResumeDraftProject(project.id)}
                          className="flex-1"
                        >
                          <Clock className="h-4 w-4 mr-2" />
                          Resume & Start Project
                        </Button>
                        <GlocalProjectDeleteButton
                          projectId={project.id}
                          projectName={project.project_name}
                          onDeleted={() => {
                            loadProjects();
                            calculateMetrics();
                          }}
                          variant="outline"
                          size="default"
                        />
                      </div>
                    </div>
                  </Card>
                );
              })}
          </div>
        </div>
      )}

      {/* In Progress Adaptations */}
      {projects.filter(p => p.project_status === 'in_progress' || p.project_status === 'review').length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">In Progress Adaptations</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {projects
              .filter(p => p.project_status === 'in_progress' || p.project_status === 'review')
              .map((project) => {
                // Extract phase data from workflow_state
                const workflowState = project.workflow_state || {};
                const phaseData = workflowState.phaseData || {};
                const completedPhases = phaseData.completedPhases || [];
                const currentPhase = phaseData.currentPhase || '';
                
                // Parse channel type from source_content
                const sourceContent = project.source_content || {};
                const channelType = sourceContent.assetType || sourceContent.type || 'Content';
                
                // Phase names mapping
                const phaseNames = {
                  'phase_1': 'Source Context',
                  'phase_2': 'Translation & TM',
                  'phase_3': 'Cultural Intelligence',
                  'phase_4': 'Regulatory Compliance',
                  'phase_5': 'Quality Intelligence'
                };
                
                const allPhases = ['phase_1', 'phase_2', 'phase_3', 'phase_4', 'phase_5'];
                const completedPhasesCount = completedPhases.length;
                
                return (
                  <Card key={project.id} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{project.project_name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {channelType}
                            </Badge>
                            <span className="text-xs text-muted-foreground">·</span>
                            <p className="text-sm text-muted-foreground">
                              {project.therapeutic_area}{project.indication ? ` · ${project.indication}` : ''}
                            </p>
                          </div>
                        </div>
                        <Badge variant={getStatusColor(project.project_status)}>
                          {getStatusIcon(project.project_status)}
                          <span className="ml-2 capitalize">{project.project_status.replace('_', ' ')}</span>
                        </Badge>
                      </div>

                      {/* Phase Progress Visualization */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Phase Progress</span>
                          <span className="font-medium">{completedPhasesCount} of 5 Phases Complete</span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            {allPhases.map((phase, index) => {
                              const isCompleted = completedPhases.includes(phase);
                              const isCurrent = currentPhase === phase;
                              const isLocked = !isCompleted && !isCurrent;
                              
                              return (
                                <div key={phase} className="flex-1">
                                  <div
                                    className={`h-3 rounded-full transition-all ${
                                      isCompleted
                                        ? 'bg-green-600'
                                        : isCurrent
                                        ? 'bg-primary animate-pulse'
                                        : 'bg-muted'
                                    }`}
                                    title={phaseNames[phase]}
                                  />
                                </div>
                              );
                            })}
                          </div>
                          <div className="flex items-center gap-2">
                            {allPhases.map((phase, index) => (
                              <div key={`label-${phase}`} className="flex-1 text-center">
                                <span className="text-xs text-muted-foreground">P{index + 1}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Target Markets</span>
                          <span className="font-medium">
                            {Array.isArray(project.target_markets) ? project.target_markets.join(', ') : '—'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Languages</span>
                          <span className="font-medium">
                            {Array.isArray(project.target_languages) ? project.target_languages.length : 0}
                          </span>
                        </div>
                      </div>

                      <Separator />

                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="flex items-center justify-center mb-1">
                            <Brain className="h-4 w-4 text-primary" />
                          </div>
                          <p className="text-xs text-muted-foreground">Cultural</p>
                          <p className="text-sm font-semibold">{project.cultural_intelligence_score || 0}%</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center mb-1">
                            <Shield className="h-4 w-4 text-primary" />
                          </div>
                          <p className="text-xs text-muted-foreground">Regulatory</p>
                          <p className="text-sm font-semibold">{project.regulatory_compliance_score || 0}%</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center mb-1">
                            <Zap className="h-4 w-4 text-primary" />
                          </div>
                          <p className="text-xs text-muted-foreground">TM Leverage</p>
                          <p className="text-sm font-semibold">{project.tm_leverage_score || 0}%</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          onClick={() => handleResumeProject(project.id)}
                          className="flex-1"
                        >
                          Resume Work
                        </Button>
                        <GlocalProjectDeleteButton
                          projectId={project.id}
                          projectName={project.project_name}
                          onDeleted={() => {
                            loadProjects();
                            calculateMetrics();
                          }}
                          variant="outline"
                          size="default"
                        />
                      </div>
                    </div>
                  </Card>
                );
              })}
          </div>
        </div>
      )}

      {/* Completed Adaptations */}
      {projects.filter(p => p.project_status === 'completed').length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Completed Adaptations</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {projects
              .filter(p => p.project_status === 'completed')
              .map((project) => {
                // Parse channel type from source_content
                const sourceContent = project.source_content || {};
                const channelType = sourceContent.assetType || sourceContent.type || 'Content';
                
                return (
                  <Card key={project.id} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <h3 className="font-semibold">{project.project_name}</h3>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {channelType}
                        </Badge>
                        <span className="text-xs text-muted-foreground">·</span>
                        <p className="text-xs text-muted-foreground">
                          {project.therapeutic_area} · {project.indication}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Quality Score</span>
                        <Badge variant="default" className="bg-green-600">
                          <Target className="h-3 w-3 mr-1" />
                          {project.overall_quality_score || 0}%
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleViewResults(project.id)}
                            variant="outline"
                            className="flex-1"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Results
                          </Button>
                          <Button
                            onClick={() => handleCreateProject()}
                            variant="outline"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Export
                          </Button>
                        </div>
                        <GlocalProjectDeleteButton
                          projectId={project.id}
                          projectName={project.project_name}
                          onDeleted={() => {
                            loadProjects();
                            calculateMetrics();
                          }}
                          variant="outline"
                          size="sm"
                        />
                      </div>
                    </div>
                  </Card>
                );
              })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {projects.length === 0 && (
        <Card className="p-12">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                <Globe className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h3 className="text-2xl font-semibold">Welcome to GLOCAL</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Start your first global-to-local content adaptation project with advanced cultural intelligence and regulatory compliance.
            </p>
            <Button
              onClick={handleCreateProject}
              size="lg"
              className="bg-gradient-to-r from-primary to-primary/80"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Your First Project
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}