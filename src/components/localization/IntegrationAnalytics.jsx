import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Zap,
  Database,
  Users,
  AlertCircle,
  CheckCircle,
  Download,
  Calendar
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const IntegrationAnalytics = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');

  // Sample analytics data
  const performanceData = [
    { name: 'Mon', integrations: 245, automations: 89, errors: 3 },
    { name: 'Tue', integrations: 312, automations: 156, errors: 1 },
    { name: 'Wed', integrations: 289, automations: 203, errors: 5 },
    { name: 'Thu', integrations: 398, automations: 178, errors: 2 },
    { name: 'Fri', integrations: 445, automations: 234, errors: 0 },
    { name: 'Sat', integrations: 123, automations: 45, errors: 1 },
    { name: 'Sun', integrations: 167, automations: 67, errors: 0 }
  ];

  const systemUsageData = [
    { name: 'Veeva Vault', value: 35, color: '#8884d8' },
    { name: 'Translation Memory', value: 28, color: '#82ca9d' },
    { name: 'MLR System', value: 18, color: '#ffc658' },
    { name: 'DAM Integration', value: 12, color: '#ff7300' },
    { name: 'Other', value: 7, color: '#8dd1e1' }
  ];

  const automationMetrics = {
    totalExecutions: 2457,
    successRate: 98.3,
    avgExecutionTime: 2.4,
    timeSaved: 156
  };

  const topIntegrations = [
    {
      name: 'Veeva Vault Sync',
      executions: 892,
      successRate: 99.2,
      avgTime: 1.8,
      trend: 'up'
    },
    {
      name: 'Translation Memory Update',
      executions: 634,
      successRate: 97.8,
      avgTime: 3.2,
      trend: 'up'
    },
    {
      name: 'MLR Document Submission',
      executions: 421,
      successRate: 95.5,
      avgTime: 4.1,
      trend: 'down'
    },
    {
      name: 'Asset Synchronization',
      executions: 298,
      successRate: 98.9,
      avgTime: 2.7,
      trend: 'up'
    }
  ];

  const systemHealthMetrics = [
    { system: 'Veeva Vault', uptime: 99.9, responseTime: 145, status: 'healthy' },
    { system: 'Translation DB', uptime: 99.5, responseTime: 89, status: 'healthy' },
    { system: 'MLR System', uptime: 98.2, responseTime: 320, status: 'warning' },
    { system: 'DAM Service', uptime: 99.8, responseTime: 67, status: 'healthy' }
  ];

  const timeframeOptions = [
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 3 Months' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center space-x-2">
            <BarChart3 className="w-5 h-5" />
            <span>Integration Analytics</span>
          </h3>
          <p className="text-sm text-muted-foreground">
            Monitor integration performance and automation effectiveness
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <select 
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="px-3 py-2 text-sm border rounded-md"
          >
            {timeframeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Executions</p>
                <p className="text-2xl font-bold">{automationMetrics.totalExecutions.toLocaleString()}</p>
                <div className="flex items-center space-x-1 text-xs text-success">
                  <TrendingUp className="w-3 h-3" />
                  <span>+12%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-success" />
              <div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold">{automationMetrics.successRate}%</p>
                <div className="flex items-center space-x-1 text-xs text-success">
                  <TrendingUp className="w-3 h-3" />
                  <span>+0.3%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-accent" />
              <div>
                <p className="text-sm text-muted-foreground">Avg Execution Time</p>
                <p className="text-2xl font-bold">{automationMetrics.avgExecutionTime}s</p>
                <div className="flex items-center space-x-1 text-xs text-success">
                  <TrendingDown className="w-3 h-3" />
                  <span>-8%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-secondary" />
              <div>
                <p className="text-sm text-muted-foreground">Time Saved</p>
                <p className="text-2xl font-bold">{automationMetrics.timeSaved}h</p>
                <div className="flex items-center space-x-1 text-xs text-success">
                  <TrendingUp className="w-3 h-3" />
                  <span>+23%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="usage">System Usage</TabsTrigger>
          <TabsTrigger value="automations">Automations</TabsTrigger>
          <TabsTrigger value="health">System Health</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Integration Performance Overview</CardTitle>
              <CardDescription>
                Daily integration executions and automation runs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="integrations" 
                    stackId="1" 
                    stroke="hsl(var(--primary))" 
                    fill="hsl(var(--primary))" 
                    fillOpacity={0.6}
                    name="Integration Calls"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="automations" 
                    stackId="1" 
                    stroke="hsl(var(--secondary))" 
                    fill="hsl(var(--secondary))" 
                    fillOpacity={0.6}
                    name="Automation Runs"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Top Integrations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topIntegrations.map((integration, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm">{integration.name}</h4>
                          {integration.trend === 'up' ? (
                            <TrendingUp className="w-4 h-4 text-success" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-destructive" />
                          )}
                        </div>
                        <div className="grid grid-cols-3 gap-2 mt-2 text-xs text-muted-foreground">
                          <span>{integration.executions} runs</span>
                          <span>{integration.successRate}% success</span>
                          <span>{integration.avgTime}s avg</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Error Rate Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="errors" 
                      stroke="hsl(var(--destructive))" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--destructive))' }}
                      name="Errors"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="usage" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>System Usage Distribution</CardTitle>
                <CardDescription>
                  Integration calls by system over the selected period
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={systemUsageData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {systemUsageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Integration Volume</CardTitle>
                <CardDescription>
                  Daily integration call volume by system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar 
                      dataKey="integrations" 
                      fill="hsl(var(--primary))" 
                      name="Integration Calls"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="automations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Automation Effectiveness</CardTitle>
              <CardDescription>
                Track automation rule performance and time savings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar 
                    dataKey="automations" 
                    fill="hsl(var(--accent))" 
                    name="Automation Runs"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <Zap className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold">847</p>
                <p className="text-sm text-muted-foreground">Active Rules</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="w-8 h-8 text-accent mx-auto mb-2" />
                <p className="text-2xl font-bold">2.1s</p>
                <p className="text-sm text-muted-foreground">Avg Response Time</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 text-secondary mx-auto mb-2" />
                <p className="text-2xl font-bold">156h</p>
                <p className="text-sm text-muted-foreground">Time Saved This Week</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="health" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {systemHealthMetrics.map((system, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-base flex items-center justify-between">
                    <span className="flex items-center space-x-2">
                      <Database className="w-4 h-4" />
                      <span>{system.system}</span>
                    </span>
                    <Badge variant={system.status === 'healthy' ? 'default' : 'secondary'}>
                      {system.status === 'healthy' ? (
                        <CheckCircle className="w-3 h-3 mr-1" />
                      ) : (
                        <AlertCircle className="w-3 h-3 mr-1" />
                      )}
                      {system.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Uptime</span>
                      <span>{system.uptime}%</span>
                    </div>
                    <Progress value={system.uptime} className="h-2" />
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Response Time</p>
                      <p className="font-medium">{system.responseTime}ms</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Status</p>
                      <p className="font-medium capitalize">{system.status}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};