
import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { formatDistanceToNow } from 'date-fns';

export const UserPresenceIndicators = ({ activeUsers, className = '', showCursors = true }) => {
  if (activeUsers.length === 0) return null;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <TooltipProvider>
        {activeUsers.slice(0, 3).map((user) => (
          <Tooltip key={user.userId}>
            <TooltipTrigger>
              <Avatar className="h-8 w-8 border-2" style={{ borderColor: user.color }}>
                <AvatarFallback>{user.displayName.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              <div className="flex flex-col">
                <span className="font-medium">{user.displayName}</span>
                <span className="text-xs text-muted-foreground">
                  Active {formatDistanceToNow(new Date(user.lastActivity), { addSuffix: true })}
                </span>
              </div>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>

      {activeUsers.length > 3 && (
        <Badge variant="secondary" className="text-xs">
          +{activeUsers.length - 3} more
        </Badge>
      )}

      <span className="text-xs text-muted-foreground">
        {activeUsers.length} collaborator{activeUsers.length !== 1 ? 's' : ''} online
      </span>

      {/* Render cursors */}
      {showCursors &&
        activeUsers.map((user) =>
          user.cursor ? (
            <div
              key={`cursor-${user.userId}`}
              className="absolute pointer-events-none"
              style={{
                left: user.cursor.x,
                top: user.cursor.y,
                color: user.color
              }}
            >
              <span className="text-xs font-semibold">{user.displayName}</span>
            </div>
          ) : null
        )}
    </div>
  );
};
