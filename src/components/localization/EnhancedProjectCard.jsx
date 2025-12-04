import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Globe, 
  Users, 
  Clock, 
  DollarSign, 
  ArrowRight,
  Calendar,
  Target,
  Brain,
  Shield,
  MessageSquare,
  Play
} from 'lucide-react';
import { ProjectNameEditor } from './ProjectNameEditor';
import { ProjectDeleteButton } from './ProjectDeleteButton';

export const EnhancedProjectCard = ({
  project,
  onClick,
  onWorkspaceClick,
  onRefresh,
  showMetrics = true
}) => {
  const [localProjectName, setLocalProjectName] = useState(project.project_name);
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'default';
      case 'in_progress': return 'secondary';
      case 'active': return 'secondary';
      default: return 'outline';
    }
  };

  const getProgressColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const isWorkspaceReady = project.target_languages && project.target_languages.length > 0 && 
    (project.status === 'in_progress' || project.status === 'draft');

  const handleWorkspaceClick = (e) => {
    e.stopPropagation();
    if (onWorkspaceClick) {
      onWorkspaceClick(project);
    } else {
      onClick(project);
    }
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-all duration-200 group border-l-4 border-l-primary/20 hover:border-l-primary"
      onClick={() => onClick(project)}
    >
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                {localProjectName}
              </h3>
              <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {project.description}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={getPriorityColor(project.priority_level || 'medium')}>
              {project.priority_level} priority
            </Badge>
            <Badge variant={getStatusColor(project.status)}>
              {project.status}
            </Badge>
          </div>
        </div>

        {/* Progress Indicators */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Content Readiness</span>
              <span className={`font-medium ${getProgressColor(project.content_readiness_score || 0)}`}>
                {project.content_readiness_score || 0}%
              </span>
            </div>
            <Progress value={project.content_readiness_score || 0} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Business Impact</span>
              <span className={`font-medium ${getProgressColor(project.business_impact_score || 0)}`}>
                {project.business_impact_score || 0}%
              </span>
            </div>
            <Progress value={project.business_impact_score || 0} className="h-2" />
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
              <Globe className="h-3 w-3" />
              <span>Markets</span>
            </div>
            <div className="font-semibold text-sm">{project.target_markets?.length || 0}</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
              <Users className="h-3 w-3" />
              <span>Languages</span>
            </div>
            <div className="font-semibold text-sm">{project.target_languages?.length || 0}</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
              <Clock className="h-3 w-3" />
              <span>Timeline</span>
            </div>
            <div className="font-semibold text-sm">{project.estimated_timeline || 0}d</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
              <DollarSign className="h-3 w-3" />
              <span>Budget</span>
            </div>
            <div className="font-semibold text-sm">
              ${project.total_budget ? (project.total_budget / 1000).toFixed(0) + 'K' : '0'}
            </div>
          </div>
        </div>

        {/* Languages Preview */}
        {project.target_languages && project.target_languages.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {project.target_languages.slice(0, 6).map((lang, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {lang.code?.toUpperCase() || lang}
              </Badge>
            ))}
            {project.target_languages.length > 6 && (
              <Badge variant="outline" className="text-xs">
                +{project.target_languages.length - 6} more
              </Badge>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-3 border-t">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>Created {new Date(project.created_at).toLocaleDateString()}</span>
          </div>
          
          <div className="flex items-center gap-2">
            {isWorkspaceReady && (
              <Button 
                size="sm" 
                variant="outline" 
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handleWorkspaceClick}
              >
                <MessageSquare className="h-3 w-3 mr-1" />
                Workspace
              </Button>
            )}
            <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
              View Details
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </div>

        {/* Project Management Actions */}
        <div className="flex items-center gap-2 pt-3 border-t mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <ProjectNameEditor
            projectId={project.id}
            currentName={localProjectName}
            onNameUpdated={(newName) => {
              setLocalProjectName(newName);
              if (onRefresh) onRefresh();
            }}
          />
          <ProjectDeleteButton
            projectId={project.id}
            projectName={localProjectName}
            onDeleted={() => {
              if (onRefresh) onRefresh();
            }}
            variant="ghost"
            size="sm"
          />
        </div>

        {/* Smart Analysis Indicators */}
        {showMetrics && (
          <div className="mt-4 pt-3 border-t space-y-3">
            {/* Translation Workspace Status */}
            {isWorkspaceReady && (
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-3 w-3 text-primary" />
                  <span className="text-muted-foreground">Translation Workspace:</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  <Play className="h-2 w-2 mr-1" />
                  Ready for Translation
                </Badge>
              </div>
            )}

            {/* Content Analysis Status */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Brain className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">Content Analysis:</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                Ready to Analyze
              </Badge>
            </div>

            {/* Complexity Preview */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Target className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">Estimated Complexity:</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full" 
                    style={{ 
                      width: `${Math.min(90, Math.max(30, 60 + (project.target_languages?.length || 0) * 5))}%` 
                    }}
                  />
                </div>
                <span className="text-xs font-medium">
                  {Math.min(90, Math.max(30, 60 + (project.target_languages?.length || 0) * 5))}
                </span>
              </div>
            </div>

            {/* Risk Assessment */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Shield className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">Risk Level:</span>
              </div>
              <Badge 
                variant={
                  project.regulatory_complexity === 'high' ? 'destructive' : 
                  project.regulatory_complexity === 'standard' ? 'secondary' : 'outline'
                } 
                className="text-xs"
              >
                {project.regulatory_complexity === 'high' ? 'High' : 'Low'}
              </Badge>
            </div>

            {/* Traditional Complexity Indicators */}
            <div className="pt-2 border-t space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Cultural Sensitivity:</span>
                <Badge variant="outline" className="text-xs capitalize">
                  {project.cultural_sensitivity_level || 'medium'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Regulatory Complexity:</span>
                <Badge variant="outline" className="text-xs capitalize">
                  {project.regulatory_complexity || 'standard'}
                </Badge>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};