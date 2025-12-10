
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAutoSaveWithRetry } from './useAutoSaveWithRetry';

// JS version of useGlocalAutoSave (types removed, same context/logic)
export const useGlocalAutoSave = ({
  projectId,
  workflowData,
  enabled = true,
  interval = 30000,
  onSaveSuccess,
  onSaveError,
}) => {
  const handleSave = useCallback(async (currentData) => {
    try {
      // Update workflow record
      const { error: workflowError } = await supabase
        .from('glocal_workflows')
        .upsert(
          {
            project_id: projectId,
            workflow_name: currentData?.workflowName || 'Adaptation Workflow',
            workflow_type: 'adaptation',
            workflow_status: currentData?.status || 'in_progress',
            phase_1_global_context: currentData?.phase1 || {},
            phase_2_tm_intelligence: currentData?.phase2 || {},
            phase_3_cultural_intelligence: currentData?.phase3 || {},
            phase_4_regulatory_compliance: currentData?.phase4 || {},
            phase_5_quality_assurance: currentData?.phase5 || {},
            phase_6_dam_handoff: currentData?.phase6 || {},
            phase_7_integration: currentData?.phase7 || {},
            current_phase: currentData?.currentPhase || 'phase_1',
            workflow_metadata: {
              lastAutoSave: new Date().toISOString(),
              version: currentData?.version || 1,
            },
            last_auto_save: new Date().toISOString(),
          },
          { onConflict: 'project_id' }
        );

      if (workflowError) throw workflowError;

      // Update project scores
      const { error: projectError } = await supabase
        .from('glocal_adaptation_projects')
        .update({
          cultural_intelligence_score: currentData?.scores?.cultural || 0,
          regulatory_compliance_score: currentData?.scores?.regulatory || 0,
          tm_leverage_score: currentData?.scores?.tmLeverage || 0,
          overall_quality_score: currentData?.scores?.overall || 0,
          market_readiness_score: currentData?.scores?.marketReadiness || 0,
          workflow_state: {
            currentPhase: currentData?.currentPhase || 'phase_1',
            phasesCompleted: currentData?.completedPhases || [],
            totalPhases: 7,
            phaseData: currentData || {},
          },
        })
        .eq('id', projectId);

      if (projectError) throw projectError;

      if (typeof onSaveSuccess === 'function') onSaveSuccess();
      console.log('✓ Auto-saved GLOCAL workflow:', new Date().toISOString());
      return true;
    } catch (error) {
      console.error('Auto-save error:', error);
      if (typeof onSaveError === 'function') onSaveError(error instanceof Error ? error : new Error(String(error)));
      return false;
    }
  }, [projectId, onSaveSuccess, onSaveError]);

  const result = useAutoSaveWithRetry({
    data: workflowData,
    onSave: handleSave,
    enabled,
    debounceMs: interval,
  });

  return {
    forceSave: result.forceSave,
    isSaving: result.isSaving,
  };
};
