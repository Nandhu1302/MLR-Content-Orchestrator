import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useRealTimeCollaboration = ({
  contentId,
  contentType,
  onContentChange,
  onConflict
}) => {
  const [activeUsers, setActiveUsers] = useState([]);
  const [collaborationState, setCollaborationState] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [hasConflicts, setHasConflicts] = useState(false);
  const { user } = useAuth();
  const channelRef = useRef(null);
  const lastSyncRef = useRef(0);
  const userColors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B',
    '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
  ];
  const getUserColor = useCallback((userId) => {
    const index = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return userColors[index % userColors.length];
  }, []);
  useEffect(() => {
    if (!user || !contentId) return;
    const channelName = `collaboration:${contentType}:${contentId}`;
    const channel = supabase.channel(channelName);
    channel
      .on('presence', { event: 'sync' }, () => {
        const presenceState = channel.presenceState();
        const users = Object.entries(presenceState).map(([userId, presence]) => ({
          userId,
          displayName: presence[0]?.displayName || 'Anonymous',
          cursor: presence[0]?.cursor,
          selection: presence[0]?.selection,
          lastActivity: presence[0]?.lastActivity || new Date().toISOString(),
          color: getUserColor(userId)
        }));
        setActiveUsers(users.filter(u => u.userId !== user.id));
      })
      .on('presence', { event: 'join' }, ({ newPresences }) => {})
      .on('presence', { event: 'leave' }, ({ leftPresences }) => {});
    channel
      .on('broadcast', { event: 'content_update' }, (payload) => {
        const { content, version, modifiedBy, timestamp } = payload;
        if (collaborationState && version <= collaborationState.version) {
          setHasConflicts(true);
          onConflict && onConflict({
            localVersion: collaborationState.version,
            remoteVersion: version,
            content,
            modifiedBy
          });
          return;
        }
        setCollaborationState({
          content,
          version,
          lastModified: timestamp,
          modifiedBy
        });
        onContentChange && onContentChange(content);
      })
      .on('broadcast', { event: 'cursor_move' }, (payload) => {
        const { userId, cursor, selection } = payload;
        setActiveUsers(prev =>
          prev.map(u =>
            u.userId === userId
              ? { ...u, cursor, selection, lastActivity: new Date().toISOString() }
              : u
          )
        );
      });
    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        setIsConnected(true);
        await channel.track({
          userId: user.id,
          displayName: user.email || 'Anonymous',
          joinedAt: new Date().toISOString(),
          lastActivity: new Date().toISOString()
        });
      }
    });
    channelRef.current = channel;
    return () => {
      channel.unsubscribe();
      setIsConnected(false);
      setActiveUsers([]);
    };
  }, [user, contentId, contentType, getUserColor, onContentChange, onConflict, collaborationState]);
  const broadcastContentUpdate = useCallback(async (content) => {
    if (!channelRef.current || !user) return;
    const now = Date.now();
    if (now - lastSyncRef.current < 1000) return;
    lastSyncRef.current = now;
    const version = (collaborationState?.version || 0) + 1;
    const timestamp = new Date().toISOString();
    await channelRef.current.send({
      type: 'broadcast',
      event: 'content_update',
      payload: {
        content,
        version,
        modifiedBy: user.id,
        timestamp
      }
    });
    setCollaborationState({
      content,
      version,
      lastModified: timestamp,
      modifiedBy: user.id
    });
  }, [user, collaborationState]);
  const broadcastCursorUpdate = useCallback(async (cursor, selection) => {
    if (!channelRef.current || !user) return;
    await channelRef.current.send({
      type: 'broadcast',
      event: 'cursor_move',
      payload: {
        userId: user.id,
        cursor,
        selection
      }
    });
  }, [user]);
  const resolveConflict = useCallback((acceptRemote) => {
    if (acceptRemote && collaborationState) {
      onContentChange && onContentChange(collaborationState.content);
    }
    setHasConflicts(false);
  }, [collaborationState, onContentChange]);
  const autoSave = useCallback(async (content) => {
    if (!contentId || !user) return;
    try {
      await supabase
        .from(contentType === 'content_asset' ? 'content_assets' : 'content_projects')
        .update({
          primary_content: content,
          updated_at: new Date().toISOString(),
          updated_by: user.id
        })
        .eq('id', contentId);
    } catch (error) {}
  }, [contentId, contentType, user]);
  return {
    activeUsers,
    isConnected,
    hasConflicts,
    collaborationState,
    broadcastContentUpdate,
    broadcastCursorUpdate,
    resolveConflict,
    autoSave
  };
};
