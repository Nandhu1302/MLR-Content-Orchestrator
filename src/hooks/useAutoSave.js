import { useEffect, useRef, useCallback } from 'react';

export const useAutoSave = ({ key, data, onSave, interval = 30000 }) => {
  const lastSavedRef = useRef('');
  const lastSaveTimeRef = useRef(null);

  const saveData = useCallback(() => {
    try {
      const dataString = JSON.stringify(data);

      // Only save if data has changed
      if (dataString !== lastSavedRef.current) {
        const savePayload = {
          data,
          timestamp: new Date().toISOString(),
          sessionId: generateSessionId(),
          version: '1.0'
        };

        localStorage.setItem(`draft_${key}`, JSON.stringify(savePayload));
        lastSavedRef.current = dataString;
        lastSaveTimeRef.current = new Date();

        if (typeof onSave === 'function') onSave(data);
      }
    } catch (e) {
      // swallow JSON/Storage errors to avoid breaking the app
      // eslint-disable-next-line no-console
      console.error('useAutoSave save error:', e);
    }
  }, [data, key, onSave]);

  // Auto-save at regular intervals
  useEffect(() => {
    const intervalId = setInterval(saveData, interval);
    return () => clearInterval(intervalId);
  }, [saveData, interval]);

  // Save on unmount
  useEffect(() => {
    return () => {
      saveData();
    };
  }, [saveData]);

  // Manual save function
  const forceSave = useCallback(() => {
    saveData();
  }, [saveData]);

  const getLastSaveTime = useCallback(() => {
    return lastSaveTimeRef.current;
  }, []);

  return {
    forceSave,
    getLastSaveTime,
    lastSaveTime: lastSaveTimeRef.current
  };
};

const generateSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export default useAutoSave;
