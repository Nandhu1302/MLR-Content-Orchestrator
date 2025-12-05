import { useEffect, useRef, useCallback, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

// The TypeScript interfaces are removed in the JavaScript version.

/**
 * Auto-save hook with retry logic, circuit breaker, and error handling
 * Extends useBaseAutoSave with database persistence features
 */
export const useAutoSaveWithRetry = ({
  data,
  onSave,
  enabled = true,
  debounceMs = 3000,
  maxRetries = 3,
  showToasts = true
}) => {
  const { toast } = useToast();
  const [status, setStatus] = useState({
    isSaving: false,
    lastSaved: null, // Initial type inference handles this as Date | null
    error: null // Initial type inference handles this as string | null
  });

  const timeoutRef = useRef(null);
  const lastSavedDataRef = useRef('');
  const isMountedRef = useRef(true);
  const failureCountRef = useRef(0);
  const circuitBreakerOpenRef = useRef(false);
  const lastFailureTimeRef = useRef(0);

  // Function to save data with retry logic and circuit breaker
  const saveWithRetry = useCallback(async (force = false) => {
    if (!enabled || status.isSaving) return;

    // Circuit breaker check
    if (circuitBreakerOpenRef.current) {
      const timeSinceLastFailure = Date.now() - lastFailureTimeRef.current;
      // Reset after 5 minutes (300,000 milliseconds)
      if (timeSinceLastFailure > 300000) { 
        circuitBreakerOpenRef.current = false;
        failureCountRef.current = 0;
      } else {
        // Circuit is open and reset time hasn't passed, so stop the save attempt
        return;
      }
    }

    const currentData = JSON.stringify(data);
    
    // Skip if data hasn't changed (unless forced)
    if (!force && currentData === lastSavedDataRef.current) {
      return;
    }

    setStatus(prev => ({ ...prev, isSaving: true, error: null }));

    let retryCount = 0;
    
    while (retryCount < maxRetries) {
      try {
        const success = await onSave(data);

        if (success && isMountedRef.current) {
          lastSavedDataRef.current = currentData;
          failureCountRef.current = 0; // Reset failure count
          setStatus({
            isSaving: false,
            lastSaved: new Date(),
            error: null
          });
          return; // Success, exit the loop
        } else if (isMountedRef.current) {
          throw new Error('Save operation returned false');
        }
      } catch (error) {
        retryCount++;
        console.error(`Auto-save attempt ${retryCount} failed:`, error);
        
        if (retryCount < maxRetries) {
          // Exponential backoff: 2^retryCount * 1000 milliseconds
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
        } else {
          // Max retries reached
          if (isMountedRef.current) {
            failureCountRef.current++;
            lastFailureTimeRef.current = Date.now();

            // Open circuit breaker after 3 consecutive failures
            if (failureCountRef.current >= 3) {
              circuitBreakerOpenRef.current = true;
              if (showToasts) {
                toast({
                  title: 'Auto-save suspended',
                  description: 'Multiple save failures detected. Auto-save will retry in 5 minutes.',
                  variant: 'destructive'
                });
              }
            } else if (failureCountRef.current === 1 && showToasts) {
              toast({
                title: 'Auto-save failed',
                description: 'Your changes could not be saved automatically. Will retry.',
                variant: 'destructive'
              });
            }

            setStatus(prev => ({
              ...prev,
              isSaving: false,
              error: 'Auto-save failed after retries'
            }));
          }
          return; // Failed after all retries, exit the loop
        }
      }
    }
  }, [data, enabled, maxRetries, onSave, showToasts, status.isSaving, toast]);

  // Debounced auto-save effect
  useEffect(() => {
    if (!enabled) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      saveWithRetry();
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, enabled, debounceMs, saveWithRetry]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Public method to bypass debounce and force a save
  const forceSave = useCallback(async () => {
    await saveWithRetry(true);
  }, [saveWithRetry]);

  // Return values
  return {
    isSaving: status.isSaving,
    lastSaved: status.lastSaved,
    error: status.error,
    forceSave
  };
};