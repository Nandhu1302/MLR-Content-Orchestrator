import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useBrand } from '@/contexts/BrandContext';
import { useToast } from '@/hooks/use-toast';
import { useGlocalAutoSave } from '@/hooks/useGlocalAutoSave';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { WorkspaceSidebar } from '@/components/glocal/layout/WorkspaceSidebar';
import {
  ArrowLeft,
  Save,
  Clock,
  CheckCircle2,
  Maximize2,
  Minimize2
} from 'lucide-react';

// Phase components
import { GlobalAssetContextCapture } from '@/components/glocal/phases/GlobalAssetContextCapture';
import { GlocalSegmentedTranslationWorkspace } from '@/components/glocal/phases/GlocalSegmentedTranslationWorkspace';
import { CulturalIntelligenceHub } from '@/components/glocal/phases/CulturalIntelligenceHub';
import { RegulatoryComplianceHub } from '@/components/glocal/phases/RegulatoryComplianceHub';
import { QualityIntelligenceHub } from '@/components/glocal/phases/QualityIntelligenceHub';
import { DAMHandoffGenerator } from '@/components/glocal/phases/DAMHandoffGenerator';
import { IntegrationLineageHub } from '@/components/glocal/phases/IntegrationLineageHub';

const phases = [
  {
    id: 'phase_1',
    number: 1,
    title: 'Global Asset Context Capture',
    description: 'Upload and analyze source content',
    component: GlobalAssetContextCapture
  },
  {
    id: 'phase_2',
    number: 2,
    title: 'Smart TM Intelligence',
    description: 'AI translation with TM leverage and cultural context',
    component: GlocalSegmentedTranslationWorkspace
  },
  {
    id: 'phase_3',
    number: 3,
    title: 'Cultural Intelligence',
    description: 'Cultural adaptation analysis',
    component: CulturalIntelligenceHub
  },
  {
    id: 'phase_4',
    number: 4,
    title: 'Regulatory Compliance',
    description: 'Market-specific compliance',
    component: RegulatoryComplianceHub
  },
  {
    id: 'phase_5',
    number: 5,
    title: 'Quality Intelligence',
    description: 'Quality assurance review',
    component: QualityIntelligenceHub
  },
  {
    id: 'phase_6',
    number: 6,
    title: 'DAM Handoff',
    description: 'Prepare assets for DAM',
    component: DAMHandoffGenerator
  },
  {
    id: 'phase_7',
    number: 7,
    title: 'Integration & Lineage',
    description: 'Finalize and integrate',
    component: IntegrationLineageHub
  }
];

export default function GlocalAdaptationWorkspace() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { selectedBrand } = useBrand();
  const { toast } = useToast();

  // Debug: Workspace initialized
  console.log('🚀 Glocal Workspace Loaded - v2.0');

  const [project, setProject] = useState(null);
  const [currentPhaseId, setCurrentPhaseId] = useState('phase_1');
  const [completedPhases, setCompletedPhases] = useState([]);
  const [workflowData, setWorkflowData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);

  // Memoize workflow data to prevent infinite loop
  const memoizedWorkflowData = useMemo(() => ({
    ...workflowData,
    currentPhase: currentPhaseId,
    completedPhases
  }), [workflowData, currentPhaseId, completedPhases]);

  // Auto-save workflow
  const { forceSave, isSaving } = useGlocalAutoSave({
    projectId: projectId,
    workflowData: memoizedWorkflowData,
    enabled: !!projectId
  });

  useEffect(() => {
    if (projectId) {
      loadProject();
    }
  }, [projectId]);

  const loadProject = async () => {
    try {
      setLoading(true);

      // Load project
      const { data: projectData, error: projectError } = await supabase
        .from('glocal_adaptation_projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (projectError) throw projectError;

      setProject(projectData);

      // Load workflow state
      const { data: workflowState } = await supabase
        .from('glocal_workflows')
        .select('*')
        .eq('project_id', projectId)
        .single();

      if (workflowState) {
        console.log('📊 Loading workflow state:', workflowState);
        
        setCurrentPhaseId(workflowState.current_phase || 'phase_1');
        
        const loadedWorkflowData = {
          phase1: workflowState.phase_1_global_context,
          phase2: workflowState.phase_2_tm_intelligence,
          phase3: workflowState.phase_3_cultural_intelligence,
          phase4: workflowState.phase_4_regulatory_compliance,
          phase5: workflowState.phase_5_quality_assurance,
          phase6: workflowState.phase_6_dam_handoff,
          phase7: workflowState.phase_7_integration
        };
        
        setWorkflowData(loadedWorkflowData);

        // Detect completed phases based on stored data
        const completed = [];
        
        if (workflowState.phase_1_global_context && 
            typeof workflowState.phase_1_global_context === 'object' && 
            workflowState.phase_1_global_context.capturedAt) {
          completed.push('phase_1');
        }
        
        if (workflowState.phase_2_tm_intelligence && 
            typeof workflowState.phase_2_tm_intelligence === 'object' && 
            (workflowState.phase_2_tm_intelligence.analyzedAt ||
             workflowState.phase_2_tm_intelligence.completed === true)) {
          completed.push('phase_2');
        }
        
        if (workflowState.phase_3_cultural_intelligence && 
            typeof workflowState.phase_3_cultural_intelligence === 'object' && 
            workflowState.phase_3_cultural_intelligence.completedAt) {
          completed.push('phase_3');
        }
        
        if (workflowState.phase_4_regulatory_compliance && 
            typeof workflowState.phase_4_regulatory_compliance === 'object' && 
            workflowState.phase_4_regulatory_compliance.reviewedAt) {
          completed.push('phase_4');
        }
        
        if (workflowState.phase_5_quality_assurance && 
            typeof workflowState.phase_5_quality_assurance === 'object' && 
            workflowState.phase_5_quality_assurance.completedAt) {
          completed.push('phase_5');
        }
        
        if (workflowState.phase_6_dam_handoff && 
            typeof workflowState.phase_6_dam_handoff === 'object' && 
            workflowState.phase_6_dam_handoff.generatedAt) {
          completed.push('phase_6');
        }
        
        if (workflowState.phase_7_integration && 
            typeof workflowState.phase_7_integration === 'object' && 
            workflowState.phase_7_integration.finalizedAt) {
          completed.push('phase_7');
        }
        
        setCompletedPhases(completed);
      }
    } catch (error) {
      console.error('Error loading project:', error);
      toast({
        title: 'Error',
        description: 'Failed to load project',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle data changes without advancing phases (for auto-save)
  const handleDataChange = useCallback((phaseId, data) => {
    setWorkflowData(prev => ({
      ...prev,
      [`phase${phases.find(p => p.id === phaseId)?.number}`]: data
    }));
  }, []); // Using functional update, no dependencies needed

  // Handle explicit phase completion (advances to next phase)
  const handlePhaseComplete = (phaseId, data) => {
    setCompletedPhases(prev => [...new Set([...prev, phaseId])]);
    setWorkflowData(prev => ({
      ...prev,
      [`phase${phases.find(p => p.id === phaseId)?.number}`]: data
    }));

    const currentIndex = phases.findIndex(p => p.id === phaseId);
    if (currentIndex < phases.length - 1) {
      setCurrentPhaseId(phases[currentIndex + 1].id);
    }

    toast({
      title: 'Phase Complete',
      description: `${phases.find(p => p.id === phaseId)?.title} completed successfully`
    });
  };

  const handlePhaseChange = (phaseId) => {
    setCurrentPhaseId(phaseId);
  };

  const getCurrentPhase = () => phases.find(p => p.id === currentPhaseId);
  const CurrentPhaseComponent = getCurrentPhase().component;

  const calculateProgress = () => {
    return (completedPhases.length / phases.length) * 100;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading workspace...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto p-6">
        <Card className="p-12 text-center">
          <p className="text-lg text-muted-foreground">Project not found</p>
          <Button onClick={() => navigate('/glocalization')} className="mt-4">
            Back to Projects
          </Button>
        </Card>
      </div>
    );
  }

  const overallProgress = calculateProgress();

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Workspace Sidebar */}
      {!isFocusMode && (
        <WorkspaceSidebar
          currentPhaseId={currentPhaseId.replace('_', '')}
          completedPhases={completedPhases.map(p => p.replace('_', ''))}
          onPhaseChange={(phaseId) => handlePhaseChange(('phase_' + phaseId.slice(-1)))}
          overallProgress={overallProgress}
          isCollapsed={isSidebarCollapsed}
        />
      )}

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b bg-muted/30 px-6 py-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Main Hub
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigate('/glocalization')}>
                Glocalization Hub
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div>
                <h1 className="text-lg font-bold">{project.project_name}</h1>
                <p className="text-xs text-muted-foreground">
                  {project.therapeutic_area} · {project.target_markets?.join(', ')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-xs text-muted-foreground flex items-center gap-2">
                {isSaving ? (
                  <>
                    <Clock className="h-3 w-3 animate-pulse" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-3 w-3 text-green-600" />
                    Saved
                  </>
                )}
              </div>
              <Button onClick={forceSave} variant="outline" size="sm">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsFocusMode(!isFocusMode)}
              >
                {isFocusMode ? (
                  <>
                    <Minimize2 className="h-4 w-4 mr-2" />
                    Exit
                  </>
                ) : (
                  <>
                    <Maximize2 className="h-4 w-4 mr-2" />
                    Focus
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Phase Content */}
        <div className="flex-1 overflow-hidden bg-background">
          <CurrentPhaseComponent
            project={project}
            projectId={projectId}
            projectData={project}
            allPhaseData={workflowData}
            phaseData={workflowData[`phase${getCurrentPhase().number}`]}
            isPhaseCompleted={completedPhases.includes(currentPhaseId)}
            onPhaseComplete={(data) => handlePhaseComplete(currentPhaseId, data)}
            onDataChange={(data) => handleDataChange(currentPhaseId, data)}
            onNext={() => {
              const currentIndex = phases.findIndex(p => p.id === currentPhaseId);
              if (currentIndex < phases.length - 1) {
                setCurrentPhaseId(phases[currentIndex + 1].id);
              }
            }}
            onPrevious={() => {
              const currentIndex = phases.findIndex(p => p.id === currentPhaseId);
              if (currentIndex > 0) {
                setCurrentPhaseId(phases[currentIndex - 1].id);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}