
import { useCallback } from 'react';
// Removed TypeScript-only type import
// import { IntakeData } from '@/types/intake';
import { useBaseAutoSave } from './useBaseAutoSave';
import { generateSessionId } from '@/utils/sessionUtils';

// JS version of useAutoSave (types removed, same context/logic)
export const useAutoSave = ({ key, data, onSave, interval = 30000 }) => {
  const handleSave = useCallback((currentData) => {
    const savePayload = {
      data: currentData,
      timestamp: new Date().toISOString(),
      sessionId: generateSessionId(),
      version: '1.0'
    };

    try {
      localStorage.setItem(`draft_${key}`, JSON.stringify(savePayload));
    } catch (err) {
      // Swallow storage errors to avoid breaking autosave in non-browser/SSR
      console.error('useAutoSave: localStorage error', err);
    }

    if (typeof onSave === 'function') {
      onSave(currentData);
    }
  }, [key, onSave]);

  return useBaseAutoSave({
    data,
    onSave: handleSave,
    interval
  });
};
