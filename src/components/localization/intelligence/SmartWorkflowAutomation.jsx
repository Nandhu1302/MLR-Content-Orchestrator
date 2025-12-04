
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';

import {
  Zap,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Clock,
  Bot,
  Settings,
  Play,
  Pause,
} from 'lucide-react';

export const SmartWorkflowAutomation = ({
  terminologyData,
  culturalData,
  regulatoryData,
  qualityData,
  onAutomationTrigger,
  onWorkflowUpdate,
}) => {
  const [automationRules, setAutomationRules] = useState([
    {
      id: 'terminology-sync',
      name: 'Auto-sync Approved Terminology',
      description: 'Automatically populate approved terms across markets',
      enabled: true,
      trigger: 'terminology_approval',
      actions: ['populate_terms', 'validate_consistency'],
      progress: 0,
      status: 'ready',
    },
    {
      id: 'cultural-adaptation',
      name: 'Intelligent Cultural Auto-Adaptation',
      description: 'Apply cultural transformations based on AI analysis',
      enabled: false,
      trigger: 'cultural_analysis_complete',
      actions: ['apply_color_changes', 'adapt_messaging', 'adjust_layout'],
      progress: 0,
      status: 'ready',
    },
    {
      id: 'regulatory-compliance',
      name: 'Auto-Compliance Checking',
      description: 'Automatically validate content against regulatory rules',
      enabled: true,
      trigger: 'content_change',
      actions: ['run_compliance_check', 'flag_violations', 'suggest_fixes'],
      progress: 0,
      status: 'running',
    },
    {
      id: 'quality-prediction',
      name: 'Predictive Quality Gates',
      description: 'Automatically assess and route based on quality predictions',
      enabled: true,
      trigger: 'quality_analysis_complete',
      actions: ['assign_reviewers', 'set_priority', 'schedule_reviews'],
      progress: 0,
      status: 'ready',
    },
  ]); // [1](https://cognizantonline-my.sharepoint.com/personal/2397807_cognizant_com/Documents/Microsoft%20Copilot%20Chat%20Files/In%2014.txt)

  const [dataFlow, setDataFlow] = useState({
    terminology: { status: 'completed', score: 92, lastUpdate: Date.now() },
    cultural: { status: 'in-progress', score: 78, lastUpdate: Date.now() },
    regulatory: { status: 'completed', score: 85, lastUpdate: Date.now() },
    quality: { status: 'pending', score: 0, lastUpdate: Date.now() },
  }); // [1](https://cognizantonline-my.sharepoint.com/personal/2397807_cognizant_com/Documents/Microsoft%20Copilot%20Chat%20Files/In%2014.txt)

  const [crossCardSuggestions, setCrossCardSuggestions] = useState([
    {
      id: 'terminology-to-cultural',
      source: 'terminology',
      target: 'cultural',
      suggestion: 'Apply approved medical terms to cultural adaptation guidelines',
      confidence: 95,
      impact: 'high',
    },
    {
      id: 'cultural-to-regulatory',
      source: 'cultural',
      target: 'regulatory',
      suggestion: 'Cultural color preferences conflict with regulatory requirements',
      confidence: 87,
      impact: 'medium',
    },
    {
      id: 'regulatory-to-quality',
      source: 'regulatory',
      target: 'quality',
      suggestion: 'High compliance score indicates lower review complexity needed',
      confidence: 92,
      impact: 'high',
    },
  ]); // [1](https://cognizantonline-my.sharepoint.com/personal/2397807_cognizant_com/Documents/Microsoft%20Copilot%20Chat%20Files/In%2014.txt)

  useEffect(() => {
    // Simulate cross-card data flow updates
    const interval = setInterval(() => {
      setDataFlow((prev) => ({
        ...prev,
        cultural: {
          ...prev.cultural,
          score: Math.min(prev.cultural.score + 2, 100),
          status: prev.cultural.score >= 90 ? 'completed' : 'in-progress',
        },
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []); // [1](https://cognizantonline-my.sharepoint.com/personal/2397807_cognizant_com/Documents/Microsoft%20Copilot%20Chat%20Files/In%2014.txt)

  const handleAutomationToggle = (ruleId) => {
    setAutomationRules((prev) =>
      prev.map((rule) =>
        rule.id === ruleId
          ? { ...rule, enabled: !rule.enabled, status: !rule.enabled ? 'ready' : 'paused' }
          : rule
      )
    );
  }; // [1](https://cognizantonline-my.sharepoint.com/personal/2397807_cognizant_com/Documents/Microsoft%20Copilot%20Chat%20Files/In%2014.txt)

  const handleRunAutomation = (rule) => {
    setAutomationRules((prev) =>
      prev.map((r) => (r.id === rule.id ? { ...r, status: 'running', progress: 0 } : r))
    );

    // Simulate automation progress
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += 20;
      setAutomationRules((prev) =>
        prev.map((r) =>
          r.id === rule.id
            ? {
                ...r,
                progress,
                status: progress >= 100 ? 'completed' : 'running',
              }
            : r
        )
      );
      if (progress >= 100) {
        clearInterval(progressInterval);
        onAutomationTrigger?.(rule);
      }
    }, 500);
  }; // [1](https://cognizantonline-my.sharepoint.com/personal/2397807_cognizant_com/Documents/Microsoft%20Copilot%20Chat%20Files/In%2014.txt)

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'running':
      case 'in-progress':
        return 'text-blue-600 bg-blue-50';
      case 'ready':
        return 'text-gray-600 bg-gray-50';
      case 'paused':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  }; // [1](https://cognizantonline-my.sharepoint.com/personal/2397807_cognizant_com/Documents/Microsoft%20Copilot%20Chat%20Files/In%2014.txt)

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'running':
      case 'in-progress':
        return <Clock className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'ready':
        return <Zap className="h-4 w-4 text-gray-600" />;
      case 'paused':
        return <Pause className="h-4 w-4 text-yellow-600" />;
      default:
        return <Settings className="h-4 w-4 text-gray-600" />;
    }
  }; // [1](https://cognizantonline-my.sharepoint.com/personal/2397807_cognizant_com/Documents/Microsoft%20Copilot%20Chat%20Files/In%2014.txt)

  return (
    <div className="space-y-6">
      {/* Cross-Card Data Flow */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <ArrowRight className="h-5 w-5" />
          Cross-Card Data Flow
        </h3>

        <div className="grid grid-cols-4 gap-4 mb-6">
          {Object.entries(dataFlow).map(([key, data]) => (
            <div key={key} className="text-center">
              <div className={`p-3 rounded-lg mb-2 ${getStatusColor(data.status)}`}>
                {getStatusIcon(data.status)}
                <div className="mt-2">
                  <div className="font-medium capitalize">{key}</div>
                  <div className="text-sm">{data.score}%</div>
                </div>
              </div>
              <Progress value={data.score} className="h-2" />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center mb-4">
          <div className="flex items-center space-x-2">
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Real-time synchronization active</span>
          </div>
        </div>
      </Card>

      {/* Smart Automation Rules */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Bot className="h-5 w-5" />
          Smart Automation Rules
        </h3>

        <div className="space-y-4">
          {automationRules.map((rule) => (
            <Card key={rule.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Switch checked={rule.enabled} onCheckedChange={() => handleAutomationToggle(rule.id)} />
                    <div>
                      <h4 className="font-medium">{rule.name}</h4>
                      <p className="text-sm text-muted-foreground">{rule.description}</p>
                    </div>
                    <Badge className={getStatusColor(rule.status)}>{rule.status}</Badge>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                    <span>Trigger: {rule.trigger}</span>
                    <span>Actions: {rule.actions.length}</span>
                  </div>

                  {rule.status === 'running' && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Progress</span>
                        <span className="text-sm">{rule.progress}%</span>
                      </div>
                      <Progress value={rule.progress} className="h-2" />
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1">
                    {rule.actions.map((action, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {action.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  {rule.enabled && rule.status === 'ready' && (
                    <Button variant="outline" size="sm" onClick={() => handleRunAutomation(rule)}>
                      <Play className="h-3 w-3 mr-1" />
                      Run Now
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    <Settings className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* Cross-Card Suggestions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Intelligent Cross-Card Suggestions</h3>

        <div className="space-y-3">
          {crossCardSuggestions.map((suggestion) => (
            <Alert key={suggestion.id} className="border-blue-200 bg-blue-50">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs capitalize">
                        {suggestion.source}
                      </Badge>
                      <ArrowRight className="h-3 w-3" />
                      <Badge variant="outline" className="text-xs capitalize">
                        {suggestion.target}
                      </Badge>
                      <Badge
                        variant={suggestion.impact === 'high' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {suggestion.impact} impact
                      </Badge>
                    </div>
                    <p className="text-sm">{suggestion.suggestion}</p>
                    <div className="text-xs text-muted-foreground mt-1">
                      AI Confidence: {suggestion.confidence}%
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onWorkflowUpdate?.(suggestion.target, suggestion)}
                    >
                      Apply
                    </Button>
                    <Button variant="ghost" size="sm">Dismiss</Button>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          ))}
        </div>
      </Card>

      {/* Automation Analytics */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Automation Performance</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">87%</div>
            <div className="text-sm text-muted-foreground">Time Saved</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">23</div>
            <div className="text-sm text-muted-foreground">Auto-Fixes Applied</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">94%</div>
            <div className="text-sm text-muted-foreground">Accuracy Rate</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

SmartWorkflowAutomation.propTypes = {
  terminologyData: PropTypes.any,
  culturalData: PropTypes.any,
  regulatoryData: PropTypes.any,
  qualityData: PropTypes.any,
  onAutomationTrigger: PropTypes.func,
  onWorkflowUpdate: PropTypes.func,
};