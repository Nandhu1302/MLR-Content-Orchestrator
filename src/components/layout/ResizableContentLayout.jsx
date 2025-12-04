import React, { useState } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export const ResizableContentLayout = ({
  leftPanel,
  mainContent,
  rightPanel,
  leftPanelMinSize = 20,
  leftPanelDefaultSize = 25,
  rightPanelMinSize = 20,
  rightPanelDefaultSize = 30,
  className
}) => {
  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false);
  const [isRightCollapsed, setIsRightCollapsed] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);

  const handleFocusMode = () => {
    setIsFocusMode(!isFocusMode);
    if (!isFocusMode) {
      setIsLeftCollapsed(true);
      setIsRightCollapsed(true);
    } else {
      setIsLeftCollapsed(false);
      setIsRightCollapsed(false);
    }
  };

  if (isFocusMode) {
    return (
      <div className={cn("flex flex-col h-full", className)}>
        <div className="flex items-center justify-between p-2 border-b bg-muted/30">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFocusMode}
              className="h-8 w-8 p-0"
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">Focus Mode</span>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          {mainContent}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="flex items-center justify-between p-2 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          {leftPanel && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsLeftCollapsed(!isLeftCollapsed)}
              className="h-8 w-8 p-0"
            >
              {isLeftCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleFocusMode}
            className="h-8 w-8 p-0"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
        
        {rightPanel && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsRightCollapsed(!isRightCollapsed)}
            className="h-8 w-8 p-0"
          >
            {isRightCollapsed ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {leftPanel && !isLeftCollapsed && (
            <>
              <ResizablePanel
                defaultSize={leftPanelDefaultSize}
                minSize={leftPanelMinSize}
                maxSize={60}
                className="bg-background"
              >
                <div className="h-full overflow-auto border-r">
                  {leftPanel}
                </div>
              </ResizablePanel>
              <ResizableHandle className="w-1 bg-border hover:bg-primary/20 transition-colors" />
            </>
          )}

          <ResizablePanel className="bg-background">
            <div className="h-full overflow-auto">
              {mainContent}
            </div>
          </ResizablePanel>

          {rightPanel && !isRightCollapsed && (
            <>
              <ResizableHandle className="w-1 bg-border hover:bg-primary/20 transition-colors" />
              <ResizablePanel
                defaultSize={rightPanelDefaultSize}
                minSize={rightPanelMinSize}
                maxSize={50}
                className="bg-background"
              >
                <div className="h-full overflow-auto border-l">
                  {rightPanel}
                </div>
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  );
};