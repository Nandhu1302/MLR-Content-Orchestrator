import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const GanttChartModal = ({ open, onOpenChange }) => {
  const phases = [
    { name: 'Discovery & Requirements', duration: 4, start: 0, color: 'bg-blue-500' },
    { name: 'Architecture & Design', duration: 6, start: 4, color: 'bg-green-500' },
    { name: 'Infrastructure Setup', duration: 3, start: 10, color: 'bg-yellow-500' },
    { name: 'Core Development', duration: 16, start: 13, color: 'bg-purple-500' },
    { name: 'Security & Compliance', duration: 4, start: 29, color: 'bg-orange-500' },
    { name: 'Testing & QA', duration: 4, start: 33, color: 'bg-red-500' },
    { name: 'Deployment & Training', duration: 3, start: 37, color: 'bg-indigo-500' },
  ];

  const totalWeeks = 40;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Project Timeline - Gantt Chart</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="space-y-6 p-4">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Total Duration: {totalWeeks} weeks</span>
            <span>Timeline View</span>
          </div>

          {/* Timeline Header */}
          <div className="flex gap-2 ml-64">
            {Array.from({ length: totalWeeks / 4 }).map((_, i) => (
              <div key={i} className="flex-1 text-center text-xs text-muted-foreground">
                Month {i + 1}
              </div>
            ))}
          </div>

          {/* Gantt Bars */}
          <div className="space-y-3">
            {phases.map((phase, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-60 text-sm font-medium text-foreground truncate">
                  {phase.name}
                </div>
                <div className="flex-1 relative h-10 bg-muted/30 rounded">
                  <div
                    className={`absolute h-full ${phase.color} rounded flex items-center justify-center text-white text-xs font-medium`}
                    style={{
                      left: `${(phase.start / totalWeeks) * 100}%`,
                      width: `${(phase.duration / totalWeeks) * 100}%`,
                    }}
                  >
                    {phase.duration}w
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="pt-4 border-t border-border">
            <h4 className="text-sm font-semibold mb-3 text-foreground">Phase Legend</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {phases.map((phase, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className={`w-4 h-4 ${phase.color} rounded`} />
                  <span className="text-xs text-muted-foreground">{phase.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};