import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  TrendingUp, 
  Clock, 
  DollarSign, 
  AlertTriangle,
  Target,
  Users,
  Globe
} from 'lucide-react';

export const ProjectAnalytics = ({
  project,
  workflows
}) => {
  // Analytics calculations
  const getWorkflowStatusData = () => {
    const statusCounts = workflows.reduce((acc, workflow) => {
      acc[workflow.workflow_status] = (acc[workflow.workflow_status] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status.replace('_', ' '),
      value: count,
      percentage: Math.round((count / workflows.length) * 100)
    }));
  };

  const getLanguageProgressData = () => {
    return project.target_languages?.map((lang) => {
      // Ensure lang has the required properties
      const languageCode = lang.code || lang;
      const languageName = lang.name || lang;
      
      const langWorkflows = workflows.filter(w => w.language === languageCode);
      const completedCount = langWorkflows.filter(w => w.workflow_status === 'completed').length;
      const progress = langWorkflows.length > 0 ? Math.round((completedCount / langWorkflows.length) * 100) : 0;
      
      return {
        language: languageName,
        code: languageCode,
        progress,
        total: langWorkflows.length,
        completed: completedCount
      };
    })?.filter(lang => lang.code) || []; // Filter out any entries without a valid code
  };

  const getCostAnalysis = () => {
    const estimatedTotal = workflows.reduce((sum, w) => sum + (w.estimated_cost || 0), 0);
    const actualTotal = workflows.reduce((sum, w) => sum + (w.actual_cost || 0), 0);
    const completedWorkflows = workflows.filter(w => w.workflow_status === 'completed');
    const avgCostPerWorkflow = completedWorkflows.length > 0 ? actualTotal / completedWorkflows.length : 0;

    return {
      estimated: estimatedTotal,
      actual: actualTotal,
      variance: estimatedTotal > 0 ? ((actualTotal - estimatedTotal) / estimatedTotal) * 100 : 0,
      avgPerWorkflow: avgCostPerWorkflow
    };
  };

  const getTimelineAnalysis = () => {
    const totalEstimatedHours = workflows.reduce((sum, w) => sum + (w.estimated_hours || 0), 0);
    const totalActualHours = workflows.reduce((sum, w) => sum + (w.actual_hours || 0), 0);
    const completedWorkflows = workflows.filter(w => w.workflow_status === 'completed');
    
    return {
      estimatedHours: totalEstimatedHours,
      actualHours: totalActualHours,
      efficiency: totalEstimatedHours > 0 ? (totalEstimatedHours / (totalActualHours || totalEstimatedHours)) * 100 : 100,
      onTimeDelivery: completedWorkflows.length > 0 ? 85 : 0 // Mock calculation
    };
  };

  const getRiskAssessment = () => {
    const highPriorityWorkflows = workflows.filter(w => w.priority >= 8).length;
    const pendingWorkflows = workflows.filter(w => w.workflow_status === 'pending').length;
    const overBudgetRisk = getCostAnalysis().variance > 10;
    
    return {
      high: highPriorityWorkflows,
      medium: pendingWorkflows,
      budgetRisk: overBudgetRisk
    };
  };

  const statusData = getWorkflowStatusData();
  const languageData = getLanguageProgressData();
  const costAnalysis = getCostAnalysis();
  const timelineAnalysis = getTimelineAnalysis();
  const riskAssessment = getRiskAssessment();

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'];

  return (
    <div className="space-y-6">
      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Target className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Overall Progress</p>
                <p className="text-lg font-bold">
                  {Math.round((workflows.filter(w => w.workflow_status === 'completed').length / workflows.length) * 100) || 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Clock className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Time Efficiency</p>
                <p className="text-lg font-bold">{Math.round(timelineAnalysis.efficiency)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Budget Status</p>
                <p className="text-lg font-bold">
                  {costAnalysis.variance > 0 ? '+' : ''}{Math.round(costAnalysis.variance)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">High Priority</p>
                <p className="text-lg font-bold">{riskAssessment.high}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Workflow Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Workflow Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value} workflows`, name]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {statusData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-1">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {entry.name} ({entry.percentage}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Language Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Progress by Language</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {languageData.map((lang) => (
                <div key={lang.code || Math.random()} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {(lang.code || 'N/A').toUpperCase()}
                      </Badge>
                      <span className="text-sm font-medium">{lang.language || 'Unknown Language'}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {lang.completed}/{lang.total} workflows
                    </span>
                  </div>
                  <Progress value={lang.progress} className="h-2" />
                  <div className="text-xs text-muted-foreground text-right">
                    {lang.progress}% complete
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cost Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Cost Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                ${costAnalysis.estimated?.toLocaleString() || 0}
              </div>
              <div className="text-sm text-muted-foreground">Estimated Budget</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">
                ${costAnalysis.actual?.toLocaleString() || 0}
              </div>
              <div className="text-sm text-muted-foreground">Actual Spent</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${costAnalysis.variance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {costAnalysis.variance > 0 ? '+' : ''}{Math.round(costAnalysis.variance)}%
              </div>
              <div className="text-sm text-muted-foreground">Budget Variance</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Risk Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <span className="font-medium">High Priority Workflows</span>
              </div>
              <Badge variant="destructive">{riskAssessment.high}</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-yellow-500" />
                <span className="font-medium">Pending Workflows</span>
              </div>
              <Badge variant="secondary">{riskAssessment.medium}</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <DollarSign className="h-4 w-4 text-blue-500" />
                <span className="font-medium">Budget Risk</span>
              </div>
              <Badge variant={riskAssessment.budgetRisk ? 'destructive' : 'default'}>
                {riskAssessment.budgetRisk ? 'High' : 'Low'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};