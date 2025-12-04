
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { useBrand } from '@/contexts/BrandContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import UniversalIntakeCard from './UniversalIntakeCard';
import CampaignDashboard from '../workspace/CampaignDashboard';
import ThemeGenerationHub from './ThemeGenerationHub';
import GuardrailsIntegration from './GuardrailsIntegration';
import { mockAssets, mockCampaigns } from '@/data/intakeSimulation';
import { userProfiles } from '@/data/simulation';
import { useAutoSave } from '@/hooks/useAutoSave';
import { DraftStorageManager } from '@/utils/draftStorage';
import { useGlobalContext } from '@/contexts/GlobalContext';
import { ContentService } from '@/services/contentService';
import { ThemeService } from '@/services/themeService';
import { ThemeContentInitializer } from '@/services/themeContentInitializer';
import { toast } from '@/hooks/use-toast';

const IntakeFlow = ({ onClose, initialState }) => {
  const [searchParams] = useSearchParams();
  const resumeDraftId = searchParams.get('resume');
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedBrand } = useBrand();
  const { user } = useAuth();
  const { state: globalState, actions: globalActions } = useGlobalContext();

  const preselectedTheme = location.state?.preselectedTheme;
  const preselectedThemeId = location.state?.themeId;
  const fromWorkshop = location.state?.fromWorkshop;

  const [flowState, setFlowState] = useState(initialState || { type: 'intake' });
  const [sessionId, setSessionId] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const currentUser = userProfiles.user1;

  useEffect(() => {
    if (!sessionId) {
      setSessionId(crypto.randomUUID());
    }
  }, [sessionId]);

  useEffect(() => {
    if (resumeDraftId && sessionId) {
      const draft = DraftStorageManager.loadDraft(resumeDraftId);
      if (draft) {
        const flowType = draft.flowState || 'intake';
        switch (flowType) {
          case 'intake':
            setFlowState({ type: 'intake', data: draft.data });
            setCurrentStep(draft.currentStep || 0);
            break;
          case 'theme-generation':
            if (draft.data.projectName) {
              setFlowState({ type: 'theme-generation', intakeData: draft.data });
            } else {
              setFlowState({ type: 'intake', data: draft.data });
            }
            break;
          case 'single-asset':
            if (draft.assetData) {
              setFlowState({ type: 'single-asset', assetData: draft.assetData, selectedTheme: draft.selectedTheme });
            } else {
              setFlowState({ type: 'intake', data: draft.data });
            }
            break;
          case 'campaign':
            if (draft.campaignData) {
              setFlowState({ type: 'campaign', campaignData: draft.campaignData, selectedTheme: draft.selectedTheme });
            } else {
              setFlowState({ type: 'intake', data: draft.data });
            }
            break;
          default:
            setFlowState({ type: 'intake', data: draft.data });
        }
        toast({
          title: 'Draft restored',
          description: `Resumed working on "${draft.data.projectName || 'Untitled Project'}" from ${flowType} stage`
        });
      }
    }
  }, [resumeDraftId, sessionId]);

  useEffect(() => {
    if (preselectedTheme && preselectedThemeId && fromWorkshop && flowState.type === 'intake' && selectedBrand && user) {
      const intakeData = {
        projectName: `Content for ${preselectedTheme.name}`,
        indication: preselectedTheme.indication || '',
        primaryAudience: preselectedTheme.audience_segments?.[0] || '',
        audienceSegment: preselectedTheme.audience_segments || [],
        brand: selectedBrand.brand_name,
        targetMarkets: preselectedTheme.target_markets || [],
        selectedAssetTypes: preselectedTheme.recommended_assets || ['Email'],
        initiativeType: 'campaign',
        keyMessage: preselectedTheme.key_message || '',
        callToAction: preselectedTheme.call_to_action || '',
        primaryObjective: 'awareness'
      };
      handleThemeSelect(preselectedTheme);
    }
  }, [preselectedTheme, preselectedThemeId, fromWorkshop, flowState.type, selectedBrand, user]);

  const getCurrentFormData = () => {
    if (flowState.type === 'intake') {
      return flowState.data || {};
    }
    return {};
  };

  const { forceSave } = useAutoSave({
    key: sessionId,
    data: getCurrentFormData(),
    onSave: (data) => {
      if (Object.keys(data).length > 0) {
        handleSaveDraft(data, currentStep);
      }
    },
    interval: 30000
  });

  const handleSaveDraft = (data, step) => {
    if (!sessionId) return;
    const progress = calculateIntakeProgress(data, step);
    const draftData = {
      data,
      timestamp: new Date().toISOString(),
      sessionId,
      version: '1.0',
      currentStep: step,
      flowState: 'intake',
      contentProgress: progress
    };
    DraftStorageManager.saveDraft(sessionId, draftData);
  };

  const calculateIntakeProgress = (data, step) => {
    const fields = ['projectName', 'indication', 'primaryAudience', 'targetMarkets', 'selectedAssetTypes', 'primaryObjective', 'keyMessage'];
    const filledFields = fields.filter((field) => {
      const value = data[field];
      return value !== undefined && value !== null && value !== '';
    }).length;
    const formProgress = (filledFields / fields.length) * 80;
    const stepProgress = (step / 4) * 20;
    return Math.min(Math.round(formProgress + stepProgress), 100);
  };

  const handleStepChange = (step) => {
    setCurrentStep(step);
    if (flowState.type === 'intake' && flowState.data) {
      handleSaveDraft(flowState.data, step);
    }
  };

  const handleIntakeComplete = (intakeData) => {
    handleSaveDraft(intakeData, 4);
    globalActions.updateModuleData('intake', {
      data: intakeData,
      timestamp: new Date().toISOString(),
      completedAt: new Date().toISOString()
    });
    globalActions.updateUserSelections({
      projectName: intakeData.projectName,
      indication: intakeData.indication,
      audience: intakeData.primaryAudience,
      markets: intakeData.targetMarkets,
      assetTypes: intakeData.selectedAssetTypes,
      objectives: intakeData.primaryObjective,
      keyMessage: intakeData.keyMessage
    });
    setFlowState({ type: 'theme-generation', intakeData });
  };

  const handleThemeSelect = async (theme) => {
    const intakeData = flowState.intakeData;
    if (!selectedBrand || !user) {
      toast({
        title: 'Authentication Error',
        description: "Please ensure you're logged in and have selected a brand",
        variant: 'destructive'
      });
      return;
    }

    try {
      const { data: authUser, error: authError } = await supabase.auth.getUser();
      if (authError || !authUser.user) {
        toast({
          title: 'Session Expired',
          description: 'Please refresh the page and log in again',
          variant: 'destructive'
        });
        return;
      }
    } catch (error) {
      toast({
        title: 'Connection Error',
        description: 'Unable to verify authentication. Please try again.',
        variant: 'destructive'
      });
      return;
    }

    try {
      const persistedTheme = await ThemeService.createThemeFromGenerated(theme, selectedBrand.id, null, intakeData);
      const { ThemeIntelligenceService } = await import('@/services/themeIntelligenceService');
      await ThemeIntelligenceService.initializeIntelligence(persistedTheme.id, selectedBrand.id);

      const draftData = {
        data: intakeData,
        timestamp: new Date().toISOString(),
        sessionId,
        version: '1.0',
        flowState: intakeData.initiativeType === 'single-asset' ? 'single-asset' : 'campaign',
        selectedTheme: theme,
        selectedThemeId: persistedTheme.id
      };
      DraftStorageManager.saveDraft(sessionId, draftData);

      globalActions.updateModuleData('theme', {
        selectedTheme: theme,
        themeId: persistedTheme.id,
        persistedTheme,
        timestamp: new Date().toISOString(),
        selectionReason: theme.rationale.primaryInsight
      });

      if (intakeData.initiativeType === 'single-asset') {
        // Navigate to content editor for single asset
        onClose();
        navigate(`/content-editor/${persistedTheme.id}`);
      } else {
        // Navigate to campaign dashboard
        onClose();
        navigate(`/campaign-dashboard/${persistedTheme.id}`);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create project. Please try again.',
        variant: 'destructive'
      });
    }
  };

  switch (flowState.type) {
    case 'intake':
      return (
        <UniversalIntakeCard
          initialData={flowState.data}
          onComplete={handleIntakeComplete}
          onCancel={onClose}
          onSaveDraft={handleSaveDraft}
          onStepChange={handleStepChange}
          sessionId={sessionId}
        />
      );
    case 'theme-generation':
      return (
        <ThemeGenerationHub
          intakeData={flowState.intakeData}
          onThemeSelect={handleThemeSelect}
          onBack={() => setFlowState({ type: 'intake', data: flowState.intakeData })}
        />
      );
    case 'campaign':
      return (
        <CampaignDashboard
          campaignData={flowState.campaignData}
          onBack={onClose}
          onEditAsset={() => {}}
          onAddAsset={() => {}}
          onEditCampaign={onClose}
        />
      );
    default:
      return null;
  }
};

export default IntakeFlow;
