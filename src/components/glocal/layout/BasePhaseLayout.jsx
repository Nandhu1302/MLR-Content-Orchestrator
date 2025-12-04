import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export const BasePhaseLayout = ({
  phaseNumber,
  phaseTitle,
  phaseDescription,
  children,
  headerActions,
  onPrevious,
  onNext,
  className
}) => {
  return (
    <div className={cn("flex flex-col h-full bg-background", className)}>
      {/* Phase Header */}
      <div className="border-b bg-muted/30 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-lg font-semibold px-4 py-1">
              Phase {phaseNumber}
            </Badge>
            <div>
              <h2 className="text-2xl font-bold">{phaseTitle}</h2>
              {phaseDescription && (
                <p className="text-sm text-muted-foreground mt-1">{phaseDescription}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {headerActions}
            {onPrevious && (
              <Button variant="outline" size="sm" onClick={onPrevious}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
            )}
            {onNext && (
              <Button size="sm" onClick={onNext}>
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Phase Content */}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
};