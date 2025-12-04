import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Globe, 
  Users, 
  TrendingUp, 
  Clock, 
  FileText, 
  Settings, 
  RefreshCw,
  Plus,
  AlertCircle,
  Building2,
  Target,
  BarChart3,
  Languages,
  ArrowRight,
  CheckCircle,
  Timer,
  DollarSign,
  Award,
  Upload,
  Palette
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocalizationManagement } from '@/hooks/useLocalizationManagement';
import { CreateProjectModal } from './CreateProjectModal';
import { LocalizationSampleDataService } from '@/utils/localizationSampleData';
import { useAuth } from '@/contexts/AuthContext';
import { useBrand } from '@/contexts/BrandContext';
import { useToast } from '@/hooks/use-toast';
import { EnhancedProjectCard } from './EnhancedProjectCard';
import { LocalizationProjectDetail } from './LocalizationProjectDetail';
import { IntegrationHub } from './IntegrationHub';

// Enhanced Projects List Component
const EnhancedLocalizationProjectsList = ({ 
  projects, 
  onProjectSelect, 
  onWorkspaceSelect 
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Localization Projects</h2>
          <p className="text-muted-foreground">
            Manage and track your global content localization projects
          </p>
        </div>
        <CreateProjectModal onProjectCreated={() => {}}>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </CreateProjectModal>
      </div>

      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map((project) => (
            <EnhancedProjectCard 
              key={project.id}
              project={project}
              onClick={() => onProjectSelect(project)}
              onWorkspaceClick={onWorkspaceSelect}
              onRefresh={() => window.location.reload()} 
              showMetrics={true}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No projects yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create your first localization project to get started
            </p>
            <CreateProjectModal onProjectCreated={() => {}}>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Project
              </Button>
            </CreateProjectModal>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export const LocalizationHubDashboard = ({ 
  className 
}) => {
  const [activeView, setActiveView] = useState('overview');
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [initializingSampleData, setInitializingSampleData] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showProjectDetail, setShowProjectDetail] = useState(false);
  const [projectDetailTab, setProjectDetailTab] = useState('overview');

  const { user } = useAuth();
  const { selectedBrand } = useBrand();
  const { toast } = useToast();

  const {
    localizationProjects,
    dashboardData,
    agencies,
    workflows,
    loading,
    error,
    refreshData
  } = useLocalizationManagement({
    autoLoad: true
  });

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const handleProjectCreated = (projectId) => {
    refreshData();
  };

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    setProjectDetailTab('overview');
    setShowProjectDetail(true);
  };

  const handleWorkspaceOpen = (project) => {
    setSelectedProject(project);
    setProjectDetailTab('workspace');
    setShowProjectDetail(true);
  };

  const handleBackToList = () => {
    setSelectedProject(null);
    setShowProjectDetail(false);
  };

  const handleWorkflowUpdate = (workflow) => {
    // This will be handled by the LocalizationProjectDetail component
    refreshData();
  };

  const initializeSampleData = async () => {
    if (!selectedBrand || !user) return;

    setInitializingSampleData(true);
    try {
      await LocalizationSampleDataService.initializeSampleData(selectedBrand.id, user.id);
      const sampleProjectId = await LocalizationSampleDataService.createSampleProject(selectedBrand.id, user.id);
      
      toast({
        title: "Sample Data Created",
        description: "Sample agencies, translation memory, and a demo project have been created to get you started.",
      });

      refreshData();
    } catch (error) {
      console.error('Error initializing sample data:', error);
      toast({
        title: "Error",
        description: "Failed to initialize sample data. Please try again.",
        variant: "destructive"
      });
    }
    setInitializingSampleData(false);
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

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-4">
          <AlertCircle className="h-8 w-8 text-destructive mx-auto" />
          <p className="text-destructive">{error}</p>
          <Button onClick={refreshData} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Localization Hub</h1>
          <p className="text-muted-foreground">
            Manage global content localization projects and translation workflows
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button onClick={refreshData} variant="outline" size="sm" disabled={loading}>
            <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
            Refresh
          </Button>
          {(!agencies || agencies.length === 0) && (
            <Button 
              onClick={initializeSampleData} 
              variant="outline" 
              size="sm" 
              disabled={initializingSampleData}
            >
              <Plus className="h-4 w-4 mr-2" />
              {initializingSampleData ? 'Creating Sample Data...' : 'Get Started'}
            </Button>
          )}
          <CreateProjectModal onProjectCreated={handleProjectCreated}>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </CreateProjectModal>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeView} onValueChange={(value) => setActiveView(value)} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="agencies">Agencies</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="integration">Integration & Automation</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData?.active_projects || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {dashboardData?.projects_this_month ? `+${dashboardData.projects_this_month} this month` : 'No new projects'}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Translation Memory Leverage</CardTitle>
                <Languages className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData?.avg_translation_memory_leverage || 0}%</div>
                <p className="text-xs text-muted-foreground">
                  Average across projects
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cost Savings</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${dashboardData?.total_cost_savings?.toLocaleString() || '0'}</div>
                <p className="text-xs text-muted-foreground">
                  Through TM leverage
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Time Reduction</CardTitle>
                <Timer className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData?.avg_time_reduction || 0}%</div>
                <p className="text-xs text-muted-foreground">
                  Faster delivery
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Active Workflows and Recent Completions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Active Workflows
                </CardTitle>
              </CardHeader>
              <CardContent>
                {workflows && workflows.length > 0 ? (
                  <div className="space-y-4">
                    {workflows.slice(0, 5).map((workflow) => (
                      <div key={workflow.id} className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {workflow.workflow_name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {workflow.language?.toUpperCase()} • {workflow.market}
                          </p>
                        </div>
                        <div className="text-right space-y-1">
                          <Badge variant={
                            workflow.workflow_status === 'completed' ? 'default' :
                            workflow.workflow_status === 'in_progress' ? 'secondary' :
                            'outline'
                          }>
                            {workflow.workflow_status}
                          </Badge>
                          <p className="text-xs text-muted-foreground">
                            Priority {workflow.priority || 5}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Clock className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">No active workflows</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Recent Completions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {localizationProjects && localizationProjects.filter(p => p.status === 'completed').length > 0 ? (
                  <div className="space-y-4">
                    {localizationProjects
                      .filter(p => p.status === 'completed')
                      .slice(0, 5)
                      .map((project) => (
                        <div key={project.id} className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">
                              {project.project_name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {project.target_languages?.length || 0} languages
                            </p>
                          </div>
                          <div className="text-right space-y-1">
                            <Badge variant="default">Completed</Badge>
                            <p className="text-xs text-muted-foreground">
                              {project.completed_at ? new Date(project.completed_at).toLocaleDateString() : 'Recently'}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">No completed projects yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <CreateProjectModal onProjectCreated={handleProjectCreated}>
                  <Button variant="outline" className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    Create from Content Studio
                  </Button>
                </CreateProjectModal>
                <CreateProjectModal onProjectCreated={handleProjectCreated}>
                  <Button variant="outline" className="w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Content
                  </Button>
                </CreateProjectModal>
                <Button variant="outline" className="w-full" onClick={() => setActiveView('agencies')}>
                  <Users className="h-4 w-4 mr-2" />
                  Manage Agencies
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Projects Tab */}
        <TabsContent value="projects" className="space-y-6">
          {showProjectDetail && selectedProject ? (
            <LocalizationProjectDetail 
              project={selectedProject}
              workflows={workflows?.filter(w => w.localization_project_id === selectedProject.id) || []}
              onBack={handleBackToList}
              onUpdateWorkflow={handleWorkflowUpdate}
              initialTab={projectDetailTab}
            />
          ) : (
            <EnhancedLocalizationProjectsList 
              projects={localizationProjects || []} 
              onProjectSelect={handleProjectSelect}
              onWorkspaceSelect={handleWorkspaceOpen}
            />
          )}
        </TabsContent>

        {/* Agencies Tab */}
        <TabsContent value="agencies" className="space-y-6">
          <LocalizationAgenciesList agencies={agencies || []} />
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <LocalizationAnalytics dashboardData={dashboardData} />
        </TabsContent>

        {/* Integration & Automation Tab */}
        <TabsContent value="integration" className="space-y-6">
          <IntegrationHub />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Projects List Component
const LocalizationProjectsList = ({ projects, onProjectSelect }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Localization Projects</CardTitle>
      </CardHeader>
      <CardContent>
        {projects.length > 0 ? (
          <div className="space-y-4">
            {projects.map((project) => (
              <Card 
                key={project.id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => onProjectSelect(project)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{project.project_name}</h3>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {project.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <Badge variant={project.priority_level === 'high' ? 'destructive' : 'secondary'}>
                          {project.priority_level}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          <span>{project.target_markets?.length || 0} markets</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>{project.target_languages?.length || 0} languages</span>
                        </div>
                        {project.estimated_timeline && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{project.estimated_timeline} days</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <Badge variant={
                        project.status === 'completed' ? 'default' :
                        project.status === 'in_progress' ? 'secondary' :
                        'outline'
                      }>
                        {project.status}
                      </Badge>
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">
                          {project.content_readiness_score}% ready
                        </div>
                        <Progress value={project.content_readiness_score || 0} className="w-20 h-2" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Globe className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No localization projects yet</p>
            <p className="text-xs text-muted-foreground mt-1">Create your first project to get started</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Agencies List Component
const LocalizationAgenciesList = ({ agencies }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Agency Network</CardTitle>
      </CardHeader>
      <CardContent>
        {agencies.length > 0 ? (
          <div className="space-y-4">
            {agencies.map((agency) => (
              <div key={agency.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-2">
                  <h3 className="font-medium">{agency.agency_name}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <Badge variant="secondary">{agency.agency_type}</Badge>
                    <Badge variant={agency.tier_level === 'preferred' ? 'default' : 'outline'}>
                      {agency.tier_level}
                    </Badge>
                    <span>{Array.isArray(agency.language_pairs) ? agency.language_pairs.length : 0} language pairs</span>
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium">{agency.performance_score}/100</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {agency.quality_rating}/5 ⭐
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Building2 className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No agencies configured</p>
            <p className="text-xs text-muted-foreground mt-1">Add agencies to start localization projects</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Analytics Component
const LocalizationAnalytics = ({ dashboardData }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Performance Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Quality Score</span>
                <span className="text-sm font-medium">{dashboardData?.avg_quality_score || 0}%</span>
              </div>
              <Progress value={dashboardData?.avg_quality_score || 0} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">On-Time Delivery</span>
                <span className="text-sm font-medium">{dashboardData?.on_time_delivery_rate || 0}%</span>
              </div>
              <Progress value={dashboardData?.on_time_delivery_rate || 0} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Cost Efficiency</span>
                <span className="text-sm font-medium">{dashboardData?.cost_efficiency_score || 0}%</span>
              </div>
              <Progress value={dashboardData?.cost_efficiency_score || 0} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Market Performance</CardTitle>
        </CardHeader>
        <CardContent>
          {dashboardData?.market_performance && Object.keys(dashboardData.market_performance).length > 0 ? (
            <div className="space-y-4">
              {Object.entries(dashboardData.market_performance).map(([market, performance]) => (
                <div key={market} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{market}</span>
                  <div className="flex items-center gap-2">
                    <Progress value={performance?.success_rate || 0} className="w-20 h-2" />
                    <span className="text-sm text-muted-foreground">{performance?.success_rate || 0}%</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Target className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No market performance data available</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};