
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronLeft, ChevronRight, Check, AlertCircle, Clock } from 'lucide-react';

/**
 * Props (JS):
 * - segments: Array<{ id, title, translation, status: 'pending'|'in-progress'|'complete', score?, issues? }>
 * - selectedSegmentIndex: number
 * - onSegmentSelect(index)
 * - renderTopPanel(segment, index)
 * - renderMiddlePanel(segment, index)
 * - renderBottomPanel(segment, index)
 * - renderRightSidebar?(): ReactNode
 * - onPrevious()
 * - onNext()
 * - canContinue: boolean
 * - onContinue()
 * - continueLabel: string
 * - phaseTitle: string
 * - phaseDescription: string
 */
export const SegmentedIntelligenceWorkspace = ({
  segments,
  selectedSegmentIndex,
  onSegmentSelect,
  renderTopPanel,
  renderMiddlePanel,
  renderBottomPanel,
  renderRightSidebar,
  onPrevious,
  onNext,
  canContinue,
  onContinue,
  continueLabel,
  phaseTitle,
  phaseDescription,
}) => {
  const selectedSegment = segments[selectedSegmentIndex];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'complete':
        return <Check className="h-4 w-4 text-green-600" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'complete':
        return 'bg-green-100 border-green-300';
      case 'in-progress':
        return 'bg-yellow-100 border-yellow-300';
      default:
        return 'bg-muted border-border';
    }
  };

  const completedCount = segments.filter((s) => s.status === 'complete').length;
  const overallProgress = segments.length > 0 ? (completedCount / segments.length) * 100 : 0;

  return (
    <div className="grid grid-cols-12 gap-6 h-full">
      {/* Left: Segment Navigation */}
      <div className="col-span-3">
        <Card className="h-full">
          <CardContent className="p-4">
            {/* Header / Phase */}
            <div className="space-y-1 mb-4">
              <h2 className="text-xl font-semibold">{phaseTitle}</h2>
              <p className="text-sm text-muted-foreground">{phaseDescription}</p>
            </div>

            {/* Progress */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Overall Progress</span>
                <Badge variant="outline" className="text-xs">
                  {completedCount}/{segments.length}
                </Badge>
              </div>
              <Progress value={overallProgress} />
            </div>

            {/* Segment list */}
            <ScrollArea className="h-[calc(100%-140px)]">
              <div className="space-y-2">
                {segments.map((segment, index) => (
                  <button
                    key={segment.id ?? index}
                    onClick={() => onSegmentSelect(index)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      index === selectedSegmentIndex
                        ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                        : getStatusColor(segment.status)
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-medium flex items-center gap-2">
                        <span>Segment {index + 1}</span>
                        {getStatusIcon(segment.status)}
                      </div>
                      <div className="flex items-center gap-2">
                        {segment.score !== undefined && (
                          <Badge variant="outline" className="text-[10px]">
                            {segment.score}%
                          </Badge>
                        )}
                        {segment.issues !== undefined && segment.issues > 0 && (
                          <Badge variant="destructive" className="text-[10px]">
                            {segment.issues} issues
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-xs truncate mt-1">{segment.title}</div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Middle: Main Panels */}
      <div className="col-span-6 space-y-4">
        {/* Top Panel */}
        {selectedSegment && renderTopPanel(selectedSegment, selectedSegmentIndex)}

        {/* Middle Panel */}
        {selectedSegment && renderMiddlePanel(selectedSegment, selectedSegmentIndex)}

        {/* Bottom Panel */}
        {selectedSegment && renderBottomPanel(selectedSegment, selectedSegmentIndex)}

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-2 border-t">
          <Button
            variant="ghost"
            onClick={onPrevious}
            disabled={selectedSegmentIndex === 0}
            className="flex items-center"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous Segment
          </Button>

          <span className="text-sm text-muted-foreground">
            Segment {selectedSegmentIndex + 1} of {segments.length}
          </span>

          {selectedSegmentIndex < segments.length - 1 ? (
            <Button variant="ghost" onClick={onNext} className="flex items-center">
              Next Segment
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={onContinue} disabled={!canContinue}>
              {continueLabel}
            </Button>
          )}
        </div>
      </div>

      {/* Right: Sidebar (optional) */}
      <div className="col-span-3">
        {renderRightSidebar && <>{renderRightSidebar()}</>}
      </div>
    </div>
  );
};
