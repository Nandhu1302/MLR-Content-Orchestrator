import React, { useState } from 'react';
import { ArrowLeft, Clock, DollarSign, Globe, Users, Calendar, AlertCircle, CheckCircle, Play, Pause } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProjectAnalytics } from './ProjectAnalytics';
import { ContentReadinessPanel } from './ContentReadinessPanel';
import { ComplexityIndicator } from './ComplexityIndicator';
import { TMMatchPanel } from './TMMatchPanel';
import { RegulatoryRiskPanel } from './RegulatoryRiskPanel';
import { TranslationWorkspace } from './TranslationWorkspace';

export const LocalizationProjectDetail = ({
  project,
  workflows,
  onBack,
  onUpdateProject,
  onUpdateWorkflow,
  initialTab = 'overview'
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'default';
      case 'in_progress': return 'secondary';
      case 'active': return 'secondary';
      default: return 'outline';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const calculateOverallProgress = () => {
    if (!workflows.length) return 0;
    const completedWorkflows = workflows.filter(w => w.workflow_status === 'completed').length;
    return Math.round((completedWorkflows / workflows.length) * 100);
  };

  const getTotalCosts = () => {
    const estimated = workflows.reduce((sum, w) => sum + (w.estimated_cost || 0), 0);
    const actual = workflows.reduce((sum, w) => sum + (w.actual_cost || 0), 0);
    return { estimated, actual };
  };

  const getWorkflowStats = () => {
    const total = workflows.length;
    const completed = workflows.filter(w => w.workflow_status === 'completed').length;
    const inProgress = workflows.filter(w => w.workflow_status === 'in_progress').length;
    const pending = workflows.filter(w => w.workflow_status === 'pending').length;
    return { total, completed, inProgress, pending };
  };

  const { estimated: totalEstimatedCost, actual: totalActualCost } = getTotalCosts();
  const { total, completed, inProgress, pending } = getWorkflowStats();
  const overallProgress = calculateOverallProgress();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{project.project_name}</h1>
            <p className="text-muted-foreground">{project.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={getStatusColor(project.status)}>
            {project.status}
          </Badge>
          <Badge variant={getPriorityColor(project.priority_level || 'medium')}>
            {project.priority_level} priority
          </Badge>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Globe className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Markets</p>
                <p className="font-semibold">{project.target_markets?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-secondary/10 rounded-lg">
                <Users className="h-4 w-4 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Languages</p>
                <p className="font-semibold">{project.target_languages?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Clock className="h-4 w-4 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Timeline</p>
                <p className="font-semibold">{project.estimated_timeline || 0} days</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <DollarSign className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Budget</p>
                <p className="font-semibold">${totalEstimatedCost?.toLocaleString() || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Project Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-muted-foreground">{overallProgress}%</span>
            </div>
            <Progress value={overallProgress} className="h-3" />
            
            <div className="grid grid-cols-4 gap-4 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-muted-foreground">{total}</div>
                <div className="text-xs text-muted-foreground">Total Workflows</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{inProgress}</div>
                <div className="text-xs text-muted-foreground">In Progress</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">{pending}</div>
                <div className="text-xs text-muted-foreground">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{completed}</div>
                <div className="text-xs text-muted-foreground">Completed</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for detailed views */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analysis">Content Analysis</TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="workspace">Translation Workspace</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Project Details */}
            <Card>
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Content Readiness</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Progress value={project.content_readiness_score || 0} className="flex-1 h-2" />
                    <span className="text-sm">{project.content_readiness_score || 0}%</span>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Business Impact</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Progress value={project.business_impact_score || 0} className="flex-1 h-2" />
                    <span className="text-sm">{project.business_impact_score || 0}%</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Cultural Sensitivity</label>
                    <p className="text-sm mt-1 capitalize">{project.cultural_sensitivity_level}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Regulatory Complexity</label>
                    <p className="text-sm mt-1 capitalize">{project.regulatory_complexity}</p>
                  </div>
                </div>

                {/* Compact Complexity Indicator */}
                <div className="pt-3 border-t">
                  <ComplexityIndicator
                    projectId={project.id}
                    contentData={{ 
                      text: project.description || '',
                      type: project.source_content_type 
                    }}
                    targetLanguages={project.target_languages?.map((l) => l.code || l) || []}
                    targetMarkets={project.target_markets?.map((m) => m.market || m.name || m) || []}
                    compact={true}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Target Markets */}
            <Card>
              <CardHeader>
                <CardTitle>Target Markets & Languages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {project.target_languages?.map((lang, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <span className="font-medium">{lang.name}</span>
                        <span className="text-sm text-muted-foreground ml-2">({lang.code})</span>
                      </div>
                      <Badge variant="outline">{lang.market}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Content Readiness Analysis */}
            <ContentReadinessPanel
              projectId={project.id}
              brandId={project.brand_id}
              sourceContent={{
                text: project.description || '',
                type: project.source_content_type,
                metadata: project.metadata
              }}
              targetMarkets={project.target_markets?.map((m) => m.market || m.name || m) || []}
              targetLanguages={project.target_languages?.map((l) => l.code || l) || []}
            />

            {/* Regulatory Risk Assessment */}
            <RegulatoryRiskPanel
              projectId={project.id}
              contentData={{
                text: project.description || '',
                type: project.source_content_type,
                metadata: project.metadata
              }}
              targetMarkets={project.target_markets?.map((m) => m.market || m.name || m) || []}
              contentType={project.source_content_type}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Complexity Analysis */}
            <ComplexityIndicator
              projectId={project.id}
              contentData={{
                text: project.description || '',
                type: project.source_content_type,
                metadata: project.metadata
              }}
              targetLanguages={project.target_languages?.map((l) => l.code || l) || []}
              targetMarkets={project.target_markets?.map((m) => m.market || m.name || m) || []}
            />

            {/* Translation Memory Matching */}
            <TMMatchPanel
              projectId={project.id}
              brandId={project.brand_id}
              sourceTexts={[project.description || '', project.project_name]}
              sourceLanguage="en"
              targetLanguage={project.target_languages?.[0]?.code || project.target_languages?.[0] || 'en'}
            />
          </div>
        </TabsContent>

        <TabsContent value="workflows">
          <Card>
            <CardHeader>
              <CardTitle>Workflows</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workflows.map((workflow) => (
                  <Card key={workflow.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{workflow.workflow_name}</h3>
                          <p className="text-sm text-muted-foreground">{workflow.market} - {workflow.language}</p>
                        </div>
                        <Badge variant={getStatusColor(workflow.workflow_status)}>
                          {workflow.workflow_status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workspace">
          <TranslationWorkspace 
            project={project}
            targetLanguage={project.target_languages?.[0]?.code || project.target_languages?.[0] || 'en'}
            sourceLanguage="en"
            onBack={onBack}
          />
        </TabsContent>

        <TabsContent value="analytics">
          <ProjectAnalytics 
            project={project}
            workflows={workflows}
          />
        </TabsContent>

        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle>Project Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Timeline view coming soon...</p>
                <p className="text-sm">Track milestones and dependencies</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};