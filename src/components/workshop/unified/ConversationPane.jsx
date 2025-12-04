import { useState } from 'react';
import { ContextChipsBar } from './ContextChipsBar';
import { AIStoryConsultant } from '../AIStoryConsultant';
import { ChevronDown, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const ConversationPane = ({ 
  context, 
  onContextUpdate, 
  showThemeCards 
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b bg-background/95 backdrop-blur">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Conversation</h2>
          </div>
          {showThemeCards && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="h-7 px-2"
            >
              <ChevronDown className={cn(
                "h-4 w-4 transition-transform",
                isCollapsed && "rotate-180"
              )} />
            </Button>
          )}
        </div>

        {/* Context Chips Bar */}
        <ContextChipsBar 
          context={context}
          onContextUpdate={onContextUpdate}
        />
      </div>

      {/* Chat Area */}
      <div className={cn(
        "flex-1 overflow-hidden transition-all",
        isCollapsed && "h-0"
      )}>
        <AIStoryConsultant
          context={context}
          onContextUpdate={onContextUpdate}
          onConfirmReady={() => {}}
          onReset={() => {}}
        />
      </div>

      {isCollapsed && (
        <div className="p-4 text-center text-sm text-muted-foreground">
          Conversation collapsed · Click to expand
        </div>
      )}
    </div>
  );
};