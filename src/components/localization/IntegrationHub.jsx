import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Settings, 
  Zap, 
  BarChart3, 
  Monitor, 
  Workflow,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp
} from 'lucide-react';
import { SystemHealthMonitor } from './SystemHealthMonitor';
import { VeevaVaultConnector } from './VeevaVaultConnector';
import { AutomationWorkflowBuilder } from './AutomationWorkflowBuilder';
import { IntegrationAnalytics } from './IntegrationAnalytics';

export const IntegrationHub = ({ projectId }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const integrationStats = {
    totalIntegrations: 8,
    activeIntegrations: 6,
    automationRules: 12,
    successRate: 98.5
  };

  const recentActivity = [
    {
      id: 1,
      type: 'automation',
      message: 'Auto-handoff triggered for Project Alpha',
      timestamp: '2 minutes ago',
      status: 'success'
    },
    {
      id: 2,
      type: 'integration',
      message: 'Veeva Vault sync completed',
      timestamp: '15 minutes ago',
      status: 'success'
    },
    {
      id: 3,
      type: 'workflow',
      message: 'MLR approval workflow initiated',
      timestamp: '1 hour ago',
      status: 'pending'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Integration & Automation Hub</h2>
          <p className="text-muted-foreground">
            Manage system integrations and automate workflows
          </p>
        </div>
        <Button>
          <Settings className="w-4 h-4 mr-2" />
          Configuration
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Monitor className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Active Integrations</p>
                <p className="text-2xl font-bold">{integrationStats.activeIntegrations}/{integrationStats.totalIntegrations}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-accent" />
              <div>
                <p className="text-sm text-muted-foreground">Automation Rules</p>
                <p className="text-2xl font-bold">{integrationStats.automationRules}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-success" />
              <div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold">{integrationStats.successRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-secondary" />
              <div>
                <p className="text-sm text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold">24</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="health">System Health</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {activity.status === 'success' && (
                        <CheckCircle className="w-4 h-4 text-success" />
                      )}
                      {activity.status === 'pending' && (
                        <Clock className="w-4 h-4 text-warning" />
                      )}
                      {activity.status === 'error' && (
                        <AlertTriangle className="w-4 h-4 text-destructive" />
                      )}
                      <div>
                        <p className="text-sm font-medium">{activity.message}</p>
                        <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                      </div>
                    </div>
                    <Badge variant={activity.status === 'success' ? 'default' : 'secondary'}>
                      {activity.type}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Veeva Vault</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <span className="text-sm text-success">Connected</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Translation Memory</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <span className="text-sm text-success">Syncing</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">MLR System</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-warning rounded-full"></div>
                      <span className="text-sm text-warning">Limited</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">DAM Integration</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <span className="text-sm text-success">Active</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="health">
          <SystemHealthMonitor />
        </TabsContent>

        <TabsContent value="integrations">
          <VeevaVaultConnector />
        </TabsContent>

        <TabsContent value="automation">
          <AutomationWorkflowBuilder projectId={projectId} />
        </TabsContent>

        <TabsContent value="analytics">
          <IntegrationAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};