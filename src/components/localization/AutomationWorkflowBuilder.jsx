import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Workflow, 
  Plus, 
  Play, 
  Pause, 
  Settings, 
  Trash2,
  Clock,
  Users,
  Mail,
  FileText,
  CheckCircle,
  AlertTriangle,
  Zap
} from 'lucide-react';

export const AutomationWorkflowBuilder = ({ projectId }) => {
  const [activeTab, setActiveTab] = useState('rules');
  const [isCreatingRule, setIsCreatingRule] = useState(false);
  
  const [automationRules] = useState([
    {
      id: '1',
      name: 'Project Status Update Notification',
      trigger: 'Project status changes',
      conditions: ['Status = "In Review"', 'Priority = "High"'],
      actions: ['Send email to stakeholders', 'Create calendar reminder'],
      status: 'active',
      lastRun: '2 hours ago',
      executions: 45,
      successRate: 98.9
    },
    {
      id: '2',
      name: 'Auto-assign Translation Tasks',
      trigger: 'New translation request',
      conditions: ['Language = "Spanish"', 'Complexity = "Standard"'],
      actions: ['Assign to Spanish team', 'Set due date (+5 days)'],
      status: 'active',
      lastRun: '30 minutes ago',
      executions: 123,
      successRate: 95.1
    },
    {
      id: '3',
      name: 'MLR Deadline Alert',
      trigger: 'Due date approaching',
      conditions: ['Days until due = 2', 'Status != "Submitted"'],
      actions: ['Send reminder email', 'Escalate to manager'],
      status: 'active',
      lastRun: '1 hour ago',
      executions: 67,
      successRate: 100
    },
    {
      id: '4',
      name: 'Quality Gate Automation',
      trigger: 'Content upload completed',
      conditions: ['File type = "Document"', 'Size < 10MB'],
      actions: ['Run compliance check', 'Generate review tasks'],
      status: 'draft',
      executions: 0,
      successRate: 0
    }
  ]);

  const triggerTypes = [
    { id: 'project_status', label: 'Project Status Change' },
    { id: 'content_upload', label: 'Content Upload' },
    { id: 'deadline_approaching', label: 'Deadline Approaching' },
    { id: 'workflow_completion', label: 'Workflow Completion' },
    { id: 'user_action', label: 'User Action' },
    { id: 'schedule', label: 'Scheduled Time' }
  ];

  const actionTypes = [
    { id: 'email', label: 'Send Email Notification', icon: Mail },
    { id: 'assign_task', label: 'Assign Task', icon: Users },
    { id: 'update_status', label: 'Update Status', icon: CheckCircle },
    { id: 'create_reminder', label: 'Create Reminder', icon: Clock },
    { id: 'generate_report', label: 'Generate Report', icon: FileText },
    { id: 'escalate', label: 'Escalate to Manager', icon: AlertTriangle }
  ];

  const getStatusBadge = (status) => {
    const variants = {
      active: 'default',
      inactive: 'secondary',
      draft: 'outline'
    };

    return (
      <Badge variant={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const handleToggleRule = (ruleId) => {
    // Toggle rule activation logic
    console.log('Toggle rule:', ruleId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center space-x-2">
            <Workflow className="w-5 h-5" />
            <span>Automation Workflow Builder</span>
          </h3>
          <p className="text-sm text-muted-foreground">
            Create and manage automated workflows for your localization projects
          </p>
        </div>
        <Button onClick={() => setIsCreatingRule(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Automation
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="rules">Automation Rules</TabsTrigger>
          <TabsTrigger value="builder">Rule Builder</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="logs">Execution Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {automationRules.map((rule) => (
              <Card key={rule.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{rule.name}</CardTitle>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(rule.status)}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleRule(rule.id)}
                      >
                        {rule.status === 'active' ? (
                          <Pause className="w-3 h-3" />
                        ) : (
                          <Play className="w-3 h-3" />
                        )}
                      </Button>
                      <Button size="sm" variant="outline">
                        <Settings className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-muted-foreground mb-1">Trigger</p>
                      <p className="flex items-center space-x-2">
                        <Zap className="w-3 h-3 text-primary" />
                        <span>{rule.trigger}</span>
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground mb-1">Conditions</p>
                      <ul className="space-y-1">
                        {rule.conditions.map((condition, index) => (
                          <li key={index} className="text-xs">• {condition}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground mb-1">Actions</p>
                      <ul className="space-y-1">
                        {rule.actions.map((action, index) => (
                          <li key={index} className="text-xs">• {action}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  {rule.status === 'active' && (
                    <div className="grid grid-cols-3 gap-4 pt-2 border-t text-sm">
                      <div>
                        <p className="text-muted-foreground">Last Run</p>
                        <p className="font-medium">{rule.lastRun}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Executions</p>
                        <p className="font-medium">{rule.executions}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Success Rate</p>
                        <p className="font-medium">{rule.successRate}%</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="builder" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create New Automation Rule</CardTitle>
              <CardDescription>
                Build custom automation workflows using triggers, conditions, and actions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="rule-name">Rule Name</Label>
                  <Input 
                    id="rule-name" 
                    placeholder="Enter automation rule name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rule-description">Description</Label>
                  <Textarea 
                    id="rule-description" 
                    placeholder="Describe what this automation does"
                    rows={3}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-semibold">Trigger Configuration</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="trigger-type">Trigger Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select trigger type" />
                      </SelectTrigger>
                      <SelectContent>
                        {triggerTypes.map((trigger) => (
                          <SelectItem key={trigger.id} value={trigger.id}>
                            {trigger.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="trigger-condition">Additional Conditions</Label>
                    <Input 
                      id="trigger-condition" 
                      placeholder="e.g., Priority = High"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-semibold">Actions to Execute</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {actionTypes.map((action) => (
                    <Card key={action.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <action.icon className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium">{action.label}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline">Cancel</Button>
                <Button>Create Automation</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardHeader>
                <CardTitle className="text-base">Project Lifecycle Automation</CardTitle>
                <CardDescription>
                  Automate common project status transitions and notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">5 Rules</Badge>
                  <Button size="sm">Use Template</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardHeader>
                <CardTitle className="text-base">Translation Workflow</CardTitle>
                <CardDescription>
                  Auto-assign translators and manage translation timelines
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">3 Rules</Badge>
                  <Button size="sm">Use Template</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardHeader>
                <CardTitle className="text-base">Quality Assurance</CardTitle>
                <CardDescription>
                  Automated quality checks and review assignments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">4 Rules</Badge>
                  <Button size="sm">Use Template</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardHeader>
                <CardTitle className="text-base">Deadline Management</CardTitle>
                <CardDescription>
                  Smart deadline tracking and escalation workflows
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">2 Rules</Badge>
                  <Button size="sm">Use Template</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Automation Executions</CardTitle>
              <CardDescription>
                Monitor automation rule executions and their results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <div>
                      <p className="text-sm font-medium">Project Status Update Notification</p>
                      <p className="text-xs text-muted-foreground">
                        Executed 2 minutes ago • Project Alpha moved to "In Review"
                      </p>
                    </div>
                  </div>
                  <Badge variant="default">Success</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <div>
                      <p className="text-sm font-medium">Auto-assign Translation Tasks</p>
                      <p className="text-xs text-muted-foreground">
                        Executed 15 minutes ago • Spanish translation assigned to Maria Garcia
                      </p>
                    </div>
                  </div>
                  <Badge variant="default">Success</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="w-4 h-4 text-warning" />
                    <div>
                      <p className="text-sm font-medium">MLR Deadline Alert</p>
                      <p className="text-xs text-muted-foreground">
                        Executed 1 hour ago • Warning: Email delivery failed for john@company.com
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">Warning</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};