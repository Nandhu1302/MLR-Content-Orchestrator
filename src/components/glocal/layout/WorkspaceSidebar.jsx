import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Languages, 
  Globe, 
  CheckCircle2, 
  MessageSquare, 
  Shield, 
  Package,
  Lock,
  Circle
} from 'lucide-react';
import { cn } from '@/lib/utils';

const phases = [
  {
    id: 'phase1',
    number: 1,
    title: 'Global Context Capture',
    description: 'Source content analysis',
    icon: <FileText className="h-5 w-5" />,
    color: 'text-blue-500'
  },
  {
    id: 'phase2',
    number: 2,
    title: 'Smart TM Translation',
    description: 'AI-powered translation',
    icon: <Languages className="h-5 w-5" />,
    color: 'text-purple-500'
  },
  {
    id: 'phase3',
    number: 3,
    title: 'Cultural Intelligence',
    description: 'Cultural adaptation',
    icon: <Globe className="h-5 w-5" />,
    color: 'text-green-500'
  },
  {
    id: 'phase4',
    number: 4,
    title: 'Regulatory Compliance',
    description: 'Compliance validation',
    icon: <Shield className="h-5 w-5" />,
    color: 'text-orange-500'
  },
  {
    id: 'phase5',
    number: 5,
    title: 'Quality Intelligence',
    description: 'Quality assurance',
    icon: <CheckCircle2 className="h-5 w-5" />,
    color: 'text-cyan-500'
  },
  {
    id: 'phase6',
    number: 6,
    title: 'DAM Integration',
    description: 'Asset packaging',
    icon: <Package className="h-5 w-5" />,
    color: 'text-pink-500'
  },
  {
    id: 'phase7',
    number: 7,
    title: 'Integration Lineage',
    description: 'System integration',
    icon: <MessageSquare className="h-5 w-5" />,
    color: 'text-indigo-500'
  }
];

export const WorkspaceSidebar = ({
  currentPhaseId,
  completedPhases,
  onPhaseChange,
  overallProgress,
  isCollapsed = false
}) => {
  const getPhaseStatus = (phaseId) => {
    if (completedPhases.includes(phaseId)) return 'completed';
    if (phaseId === currentPhaseId) return 'current';
    
    const currentPhaseIndex = phases.findIndex(p => p.id === currentPhaseId);
    const phaseIndex = phases.findIndex(p => p.id === phaseId);
    
    if (phaseIndex < currentPhaseIndex || completedPhases.length > 0) return 'accessible';
    return 'locked';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'current':
        return <Circle className="h-5 w-5 text-primary fill-primary" />;
      default:
        return <Lock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  if (isCollapsed) {
    return (
      <div className="w-12 lg:w-14 border-r bg-background h-full flex flex-col">
        <div className="p-2 border-b">
          <div className="h-10 flex items-center justify-center">
            <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center p-0">
              {Math.round(overallProgress)}
            </Badge>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          {phases.map((phase) => {
            const status = getPhaseStatus(phase.id);
            const isDisabled = status === 'locked';
            
            return (
              <Button
                key={phase.id}
                variant={phase.id === currentPhaseId ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => !isDisabled && onPhaseChange(phase.id)}
                disabled={isDisabled}
                className={cn(
                  "w-full h-12 flex items-center justify-center mb-1 relative",
                  isDisabled && "opacity-50 cursor-not-allowed"
                )}
                title={phase.title}
              >
                {phase.icon}
                {status === 'completed' && (
                  <div className="absolute top-1 right-1">
                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                  </div>
                )}
              </Button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="w-64 lg:w-72 xl:w-80 border-r bg-background h-full flex flex-col">
      {/* Progress Overview */}
      <div className="p-4 border-b">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm text-muted-foreground">{Math.round(overallProgress)}%</span>
          </div>
          <Progress value={overallProgress} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {completedPhases.length} of {phases.length} phases completed
          </p>
        </div>
      </div>

      {/* Phase List */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {phases.map((phase) => {
            const status = getPhaseStatus(phase.id);
            const isDisabled = status === 'locked';
            const isCurrent = phase.id === currentPhaseId;
            
            return (
              <Button
                key={phase.id}
                variant={isCurrent ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => !isDisabled && onPhaseChange(phase.id)}
                disabled={isDisabled}
                className={cn(
                  "w-full justify-start h-auto py-3 px-3",
                  isDisabled && "opacity-50 cursor-not-allowed"
                )}
              >
                <div className="flex items-start gap-3 w-full">
                  <div className={cn("flex-shrink-0", phase.color)}>
                    {phase.icon}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{phase.title}</span>
                      {getStatusIcon(status)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                      {phase.description}
                    </p>
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};