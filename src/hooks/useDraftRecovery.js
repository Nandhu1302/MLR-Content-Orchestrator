import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DraftStorageManager } from '@/utils/draftStorage';
// DraftSummary type removed

export const useDraftRecovery = () => {
  const [recentDraft, setRecentDraft] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (DraftStorageManager.hasRecentDrafts()) {
      const mostRecent = DraftStorageManager.getMostRecentDraft();
      setRecentDraft(mostRecent);
    }
  }, []);

  const handleResumeDraft = (draftId) => {
    const id = draftId || (recentDraft ? recentDraft.id : null);
    if (id) {
      // Navigates to the root path with a query parameter to load the draft
      navigate(`/?resume=${id}`);
      setRecentDraft(null); // Clear the recent draft state after navigation attempt
    }
  };

  const dismissDraft = () => {
    setRecentDraft(null);
  };

  return {
    recentDraft,
    handleResumeDraft,
    dismissDraft
  };
};