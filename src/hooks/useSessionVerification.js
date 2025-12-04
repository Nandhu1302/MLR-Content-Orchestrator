import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useSessionVerification = () => {
  const { user, session } = useAuth();
  const [isVerifying, setIsVerifying] = useState(false);

  const verifySession = useCallback(async (maxRetries = 3) => {
    setIsVerifying(true);
    try {
      if (!user || !session) {
        console.warn('No user or session found');
        return false;
      }
      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          const { data, error } = await supabase.auth.getUser();
          if (error) {
            console.warn(`Session verification attempt ${attempt + 1} failed:`, error);
            if (attempt < maxRetries - 1) {
              await supabase.auth.refreshSession();
              await new Promise(resolve => setTimeout(resolve, 1000));
              continue;
            }
            return false;
          }
          if (data.user && data.user.id === user.id) {
            console.log('Session verified successfully');
            return true;
          }
        } catch (err) {
          console.warn(`Session verification attempt ${attempt + 1} error:`, err);
          if (attempt < maxRetries - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      }
      return false;
    } finally {
      setIsVerifying(false);
    }
  }, [user, session]);

  return {
    verifySession,
    isVerifying,
    hasValidSession: !!user && !!session
  };
};
