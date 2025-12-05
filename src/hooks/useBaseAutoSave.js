import { useEffect, useRef, useCallback } from 'react';

// The TypeScript interfaces (BaseAutoSaveOptions, BaseAutoSaveReturn) are removed.

/**
 * Generic base auto-save hook with debouncing and change detection
 * Handles: debouncing, change detection, interval saves, cleanup
 */
export const useBaseAutoSave = ({
  data,
  onSave,
  enabled = true,
  debounceMs,
  interval
}) => {
  const lastSavedRef = useRef('');
  const lastSaveTimeRef = useRef(null);
  const debounceTimeoutRef = useRef(null);

  // Core logic to check for changes and call onSave
  const saveData = useCallback(() => {
    if (!enabled) return;

    // Use JSON.stringify for deep comparison
    const dataString = JSON.stringify(data);
    
    // Only save if data has changed
    if (dataString !== lastSavedRef.current) {
      onSave(data);
      lastSavedRef.current = dataString;
      lastSaveTimeRef.current = new Date();
    }
  }, [data, enabled, onSave]);

  // Debounced save (if debounceMs is provided)
  useEffect(() => {
    // Only run if enabled and debounceMs is set
    if (!enabled || debounceMs === undefined) return;

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Set a new timeout to call saveData after debounceMs
    debounceTimeoutRef.current = setTimeout(saveData, debounceMs);

    // Cleanup function clears the timeout if dependencies change
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [data, enabled, debounceMs, saveData]);

  // Interval-based save (if interval is provided)
  useEffect(() => {
    // Only run if enabled and interval is set
    if (!enabled || interval === undefined) return;

    const intervalId = setInterval(saveData, interval);
    
    // Cleanup function clears the interval
    return () => clearInterval(intervalId);
  }, [saveData, interval, enabled]);

  // Save on component unmount
  useEffect(() => {
    return () => {
      // Ensure the latest state is saved when the component is removed
      if (enabled) saveData();
    };
  }, [saveData, enabled]);

  // Public method to immediately trigger a save
  const forceSave = useCallback(() => {
    saveData();
  }, [saveData]);

  // Public method to get the last save time from the ref
  const getLastSaveTime = useCallback(() => {
    return lastSaveTimeRef.current;
  }, []);

  return {
    forceSave,
    getLastSaveTime,
    // Note: Returning the ref's current value makes it immediately available
    lastSaveTime: lastSaveTimeRef.current
  };
};