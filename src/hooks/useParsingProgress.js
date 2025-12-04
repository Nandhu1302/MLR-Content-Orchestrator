import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useParsingProgress = (documentId, isActive) => {
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    if (!documentId || !isActive) {
      setProgress(null);
      return;
    }
    const channel = supabase.channel(`parsing:${documentId}`)
      .on(
        'broadcast',
        { event: 'parsing_progress' },
        (payload) => {
          setProgress(payload.payload);
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
      setProgress(null);
    };
  }, [documentId, isActive]);

  return progress;
};
