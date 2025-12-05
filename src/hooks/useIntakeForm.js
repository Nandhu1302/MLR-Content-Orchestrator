import { useState, useCallback } from 'react';
import { SpecialistMapper } from '@/utils/specialistMapping';
import { getSuggestedObjective } from '@/services/audienceAssetMappingService';
// Interface definitions for IntakeData, AssetType, Indication, and UseIntakeFormOptions removed

/**
 * Custom hook for managing the state and logic of a complex intake form.
 * It includes logic for auto-populating specialist context and suggesting primary objectives.
 *
 * @param {object} [options] - Configuration options for the hook.
 * @param {object} [options.initialData] - Initial form data state.
 * @param {function} [options.onUpdate] - Callback function triggered on every data update.
 */
export const useIntakeForm = ({ initialData, onUpdate } = {}) => {
  const [formData, setFormData] = useState(initialData || {});

  /**
   * Updates the form data state and calls the optional onUpdate callback.
   */
  const updateFormData = useCallback((updates) => {
    setFormData(prev => {
      const newData = { ...prev, ...updates };
      if (onUpdate) {
        onUpdate(newData);
      }
      return newData;
    });
  }, [onUpdate]);

  /**
   * Updates form data, specifically checking for Specialist Audience/Indication changes
   * to automatically populate related specialist context fields if necessary.
   *
   * @param {object} updates - The data updates to apply.
   * @param {string} [indication] - An optional indication override.
   */
  const updateWithSpecialistContext = useCallback((
    updates,
    indication // Renamed from Indication to reflect JS lack of explicit typing
  ) => {
    const currentIndication = indication || updates.indication || formData.indication;
    // Default to 'Physician-Specialist' if not yet set
    const primaryAudience = updates.primaryAudience || formData.primaryAudience || 'Physician-Specialist';

    // Auto-populate specialist context if it's a Specialist audience and an indication is present
    if (primaryAudience === 'Physician-Specialist' && currentIndication) {
      const specialistContext = SpecialistMapper.populateFromIndication(currentIndication);
      updateFormData({ ...updates, ...specialistContext });
      SpecialistMapper.logContext(specialistContext, '✨ Auto-populated');
      return;
    }

    updateFormData(updates);
  }, [formData, updateFormData]);

  /**
   * Fail-safe function to ensure specialist context fields are completed
   * if the primary audience is 'Physician-Specialist' and an indication exists.
   */
  const ensureSpecialistContext = useCallback(() => {
    const primaryAudience = formData.primaryAudience || 'Physician-Specialist';
    const indication = formData.indication;
    
    const completeContext = SpecialistMapper.ensureComplete(
      primaryAudience,
      indication,
      {
        specialistType: formData.specialistType,
        specialistDisplayName: formData.specialistDisplayName,
        therapeuticArea: formData.therapeuticArea
      }
    );

    // Apply the missing context only if a value was determined and the form state lacks it
    if (completeContext.specialistType && !formData.specialistType) {
      updateFormData(completeContext);
      SpecialistMapper.logContext(completeContext, '🔧 FAILSAFE');
    }

    return completeContext;
  }, [formData, updateFormData]);

  /**
   * Suggests and updates the primary objective based on the current audience, 
   * selected asset types, and indication, provided the objective is currently unset.
   */
  const autoSuggestObjective = useCallback(() => {
    const audience = formData.primaryAudience;
    const assetTypes = formData.selectedAssetTypes || [];
    const indication = formData.indication;

    if (audience && assetTypes.length > 0 && !formData.primaryObjective) {
      const suggested = getSuggestedObjective(audience, assetTypes, indication);
      if (suggested) {
        updateFormData({ primaryObjective: suggested.value });
      }
    }
  }, [formData, updateFormData]);

  return {
    formData,
    updateFormData,
    updateWithSpecialistContext,
    ensureSpecialistContext,
    autoSuggestObjective
  };
};