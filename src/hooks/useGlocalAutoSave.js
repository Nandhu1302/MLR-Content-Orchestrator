// Auto-save hook for GLOCAL workflow
import { useEffect, useRef, useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

export const useGlocalAutoSave = ({
  projectId,
  workflowData,
  enabled = true,
  interval = 30000,
  onSaveSuccess,
  onSaveError
}) => {
  const { toast } = useToast();
  const lastSavedDataRef = useRef('');
  const saveTimeoutRef = useRef();
  const [isSaving, setIsSaving] = useState(false);
  const failureCountRef = useRef(0);
  const circuitBreakerOpenRef = useRef(false);
  const lastFailureTimeRef = useRef(0);

  const saveWorkflow = useCallback(async () => {
    if (isSaving || !enabled) return;

    // Circuit breaker: stop trying after 3 consecutive failures
    if (circuitBreakerOpenRef.current) {
      const timeSinceLastFailure = Date.now() - lastFailureTimeRef.current;
      // Reset circuit breaker after 5 minutes
      if (timeSinceLastFailure > 300000) {
        circuitBreakerOpenRef.current = false;
        failureCountRef.current = 0;
      } else {
        return;
      }
    }

    // Serialize data consistently for comparison
    const currentData = JSON.stringify(workflowData, Object.keys(workflowData).sort());
    // Skip if no meaningful changes (deep equality check)
    if (currentData === lastSavedDataRef.current) {
      return;
    }

    setIsSaving(true);

    try {
      // Update workflow record
      const { error: workflowError } = await supabase
        .from('glocal_workflows')
        .upsert({
          project_id: projectId,
          workflow_name: workflowData.workflowName || 'Adaptation Workflow',
          workflow_type: 'adaptation',
          workflow_status: workflowData.status || 'in_progress',
          phase_1_global_context: workflowData.phase1 || {},
          phase_2_tm_intelligence: workflowData.phase2 || {},
          phase_3_cultural_intelligence: workflowData.phase3 || {},
          phase_4_regulatory_compliance: workflowData.phase4 || {},
          phase_5_quality_assurance: workflowData.phase5 || {},
          phase_6_dam_handoff: workflowData.phase6 || {},
          phase_7_integration: workflowData.phase7 || {},
          current_phase: workflowData.currentPhase || 'phase_1',
          workflow_metadata: {
            lastAutoSave: new Date().toISOString(),
            version: workflowData.version || 1
          },
          last_auto_save: new Date().toISOString()
        }, {
          onConflict: 'project_id'
        });

      if (workflowError) throw workflowError;

      // Update project scores
      const { error: projectError } = await supabase
        .from('glocal_adaptation_projects')
        .update({
          cultural_intelligence_score: workflowData.scores?.cultural || 0,
          regulatory_compliance_score: workflowData.scores?.regulatory || 0,
          tm_leverage_score: workflowData.scores?.tmLeverage || 0,
          overall_quality_score: workflowData.scores?.overall || 0,
          market_readiness_score: workflowData.scores?.marketReadiness || 0,
          workflow_state: {
            currentPhase: workflowData.currentPhase || 'phase_1',
            phasesCompleted: workflowData.completedPhases || [],
            totalPhases: 7,
            phaseData: workflowData
          }
        })
        .eq('id', projectId);

      if (projectError) throw projectError;

      lastSavedDataRef.current = currentData;
      failureCountRef.current = 0;
      onSaveSuccess && onSaveSuccess();

      console.log('✓ Auto-saved GLOCAL workflow:', new Date().toISOString());
    } catch (error) {
      console.error('Auto-save error:', error);
      failureCountRef.current++;
      lastFailureTimeRef.current = Date.now();
      if (failureCountRef.current >= 3) {
        circuitBreakerOpenRef.current = true;
        toast({
          title: 'Auto-save suspended',
          description: 'Multiple save failures detected. Auto-save will retry in 5 minutes.',
          variant: 'destructive'
        });
      } else {
        if (failureCountRef.current === 1) {
          toast({
            title: 'Auto-save failed',
            description: 'Your changes could not be saved automatically. Will retry.',
            variant: 'destructive'
          });
        }
      }
      onSaveError && onSaveError(error);
    } finally {
      setIsSaving(false);
    }
  }, [projectId, workflowData, enabled, onSaveSuccess, onSaveError, toast]);

  // Set up auto-save interval
  useEffect(() => {
    if (!enabled) return;
    const intervalId = setInterval(() => {
      saveWorkflow();
    }, interval);
    return () => {
      clearInterval(intervalId);
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [saveWorkflow, interval, enabled]);

  // Save on unmount
  useEffect(() => {
    return () => {
      if (enabled && workflowData) {
        saveWorkflow();
      }
    };
  }, [saveWorkflow, enabled, workflowData]);

  // Manual save function
  const forceSave = useCallback(() => {
    return saveWorkflow();
  }, [saveWorkflow]);

  return {
    forceSave,
    isSaving
  };
};
