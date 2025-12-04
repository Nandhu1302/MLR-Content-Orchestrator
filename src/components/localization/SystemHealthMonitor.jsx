import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Server, 
  Database, 
  Wifi, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw,
  Activity,
  Clock
} from 'lucide-react';

export const SystemHealthMonitor = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [systems, setSystems] = useState([
    {
      id: 'veeva-vault',
      name: 'Veeva Vault',
      status: 'healthy',
      uptime: 99.9,
      responseTime: 145,
      lastCheck: '2 minutes ago'
    },
    {
      id: 'translation-memory',
      name: 'Translation Memory Database',
      status: 'healthy',
      uptime: 99.5,
      responseTime: 89,
      lastCheck: '1 minute ago'
    },
    {
      id: 'mlr-system',
      name: 'MLR Review System',
      status: 'warning',
      uptime: 98.2,
      responseTime: 320,
      lastCheck: '5 minutes ago',
      details: 'High response times detected'
    },
    {
      id: 'dam-integration',
      name: 'Digital Asset Management',
      status: 'healthy',
      uptime: 99.8,
      responseTime: 67,
      lastCheck: '30 seconds ago'
    },
    {
      id: 'notification-service',
      name: 'Notification Service',
      status: 'healthy',
      uptime: 100,
      responseTime: 23,
      lastCheck: '1 minute ago'
    },
    {
      id: 'workflow-engine',
      name: 'Workflow Automation Engine',
      status: 'maintenance',
      uptime: 95.1,
      responseTime: 0,
      lastCheck: '10 minutes ago',
      details: 'Scheduled maintenance window'
    }
  ]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefreshing(false);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-warning" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-destructive" />;
      case 'maintenance':
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      healthy: 'default',
      warning: 'secondary',
      error: 'destructive',
      maintenance: 'outline'
    };

    return (
      <Badge variant={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const overallHealth = () => {
    const healthyCount = systems.filter(s => s.status === 'healthy').length;
    const percentage = (healthyCount / systems.length) * 100;
    return Math.round(percentage);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">System Health Monitor</h3>
          <p className="text-sm text-muted-foreground">
            Real-time status of all integrated systems
          </p>
        </div>
        <Button onClick={handleRefresh} disabled={isRefreshing}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Overall Health Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="w-5 h-5" />
            <span>Overall System Health</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Progress value={overallHealth()} className="h-3" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{overallHealth()}%</p>
              <p className="text-sm text-muted-foreground">Systems Healthy</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {systems.map((system) => (
          <Card key={system.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center space-x-2">
                  {system.name === 'Veeva Vault' && <Server className="w-4 h-4" />}
                  {system.name.includes('Database') && <Database className="w-4 h-4" />}
                  {system.name.includes('Service') && <Wifi className="w-4 h-4" />}
                  {!system.name.includes('Database') && !system.name.includes('Service') && system.name !== 'Veeva Vault' && <Server className="w-4 h-4" />}
                  <span>{system.name}</span>
                </CardTitle>
                {getStatusIcon(system.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Status</span>
                {getStatusBadge(system.status)}
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Uptime</p>
                  <p className="font-medium">{system.uptime}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Response Time</p>
                  <p className="font-medium">
                    {system.status === 'maintenance' ? 'N/A' : `${system.responseTime}ms`}
                  </p>
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground">
                Last checked: {system.lastCheck}
              </div>
              
              {system.details && (
                <div className="text-xs text-warning bg-warning/10 p-2 rounded">
                  {system.details}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Incidents */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Incidents</CardTitle>
          <CardDescription>
            System incidents and maintenance activities from the last 7 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">Scheduled Maintenance</p>
                <p className="text-xs text-muted-foreground">
                  Workflow Automation Engine - Dec 15, 2:00 AM - 4:00 AM UTC
                </p>
              </div>
              <Badge variant="outline">Planned</Badge>
            </div>
            
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <AlertTriangle className="w-4 h-4 text-warning" />
              <div className="flex-1">
                <p className="text-sm font-medium">Performance Degradation</p>
                <p className="text-xs text-muted-foreground">
                  MLR Review System - Dec 13, high response times resolved
                </p>
              </div>
              <Badge variant="secondary">Resolved</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};