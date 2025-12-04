import { useState } from 'react';
import { ChevronLeft, ChevronRight, Brain, FileText, TrendingUp, Users, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import type { MatchedIntelligence } from '@/types/workshop';

interface IntelligenceSidebarProps {
  intelligence: MatchedIntelligence | null;
  collapsed?: boolean;
  onToggle: () => void;
  hcpTargeting?: any;
  marketContext?: any;
  audienceInsights?: any;
  performancePrediction?: any;
}

export const IntelligenceSidebar = ({
  intelligence,
  collapsed = false,
  onToggle,
  hcpTargeting,
  marketContext,
  audienceInsights,
  performancePrediction,
}: IntelligenceSidebarProps) => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['evidence']);

  const totalCount = (
    (intelligence?.claims.length || 0) +
    (intelligence?.visuals.length || 0) +
    (intelligence?.modules.length || 0)
  );

  if (collapsed) {
    return (
      <div className="h-full flex flex-col items-center border-l bg-muted/30 p-2 gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="shrink-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex-1 flex flex-col items-center gap-2">
          <div className="rotate-180 writing-mode-vertical text-xs font-medium text-muted-foreground">
            Intelligence
          </div>
          <Badge variant="secondary" className="rounded-full w-8 h-8 flex items-center justify-center">
            {totalCount}
          </Badge>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col border-l bg-muted/30">
      {/* Header */}
      <div className="p-4 border-b bg-background/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <div>
            <h3 className="font-semibold text-sm">Intelligence</h3>
            <p className="text-xs text-muted-foreground">{totalCount} items</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="shrink-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <Accordion type="multiple" value={expandedSections} onValueChange={setExpandedSections}>
          {/* Evidence Section */}
          <AccordionItem value="evidence" className="border rounded-lg mb-2 overflow-hidden">
            <AccordionTrigger className="px-3 py-2 hover:no-underline hover:bg-muted/50">
              <div className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4 text-blue-500" />
                <span className="font-medium">Evidence</span>
                <Badge variant="secondary" className="ml-auto">
                  {(intelligence?.claims.length || 0) + (intelligence?.visuals.length || 0) + (intelligence?.modules.length || 0)}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-3 pb-3 pt-1 space-y-2 text-xs">
              <div className="flex items-center justify-between py-1.5 px-2 bg-background/50 rounded">
                <span className="text-muted-foreground">Claims</span>
                <Badge variant="outline" className="text-xs">{intelligence?.claims.length || 0}</Badge>
              </div>
              <div className="flex items-center justify-between py-1.5 px-2 bg-background/50 rounded">
                <span className="text-muted-foreground">Visuals</span>
                <Badge variant="outline" className="text-xs">{intelligence?.visuals.length || 0}</Badge>
              </div>
              <div className="flex items-center justify-between py-1.5 px-2 bg-background/50 rounded">
                <span className="text-muted-foreground">Modules</span>
                <Badge variant="outline" className="text-xs">{intelligence?.modules.length || 0}</Badge>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Performance Section */}
          <AccordionItem value="performance" className="border rounded-lg mb-2 overflow-hidden">
            <AccordionTrigger className="px-3 py-2 hover:no-underline hover:bg-muted/50">
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="font-medium">Performance</span>
                <Badge variant="secondary" className="ml-auto">
                  {performancePrediction ? '1' : '0'}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-3 pb-3 pt-1 space-y-2 text-xs">
              {performancePrediction ? (
                <>
                  <div className="py-1.5 px-2 bg-background/50 rounded">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-muted-foreground">Engagement</span>
                      <span className="font-medium">{performancePrediction.predictedEngagement}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Confidence</span>
                      <span className="font-medium">{performancePrediction.confidence}%</span>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-muted-foreground py-2 px-2">No predictions available</p>
              )}
            </AccordionContent>
          </AccordionItem>

          {/* Audience Section */}
          <AccordionItem value="audience" className="border rounded-lg mb-2 overflow-hidden">
            <AccordionTrigger className="px-3 py-2 hover:no-underline hover:bg-muted/50">
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-orange-500" />
                <span className="font-medium">Audience</span>
                <Badge variant="secondary" className="ml-auto">
                  {audienceInsights || hcpTargeting ? '1' : '0'}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-3 pb-3 pt-1 space-y-2 text-xs">
              {audienceInsights ? (
                <>
                  <div className="py-1.5 px-2 bg-background/50 rounded">
                    <div className="font-medium mb-1">{audienceInsights.primaryAudience}</div>
                    <div className="text-muted-foreground">
                      {audienceInsights.keyDecisionFactors?.slice(0, 2).join(', ')}
                    </div>
                  </div>
                </>
              ) : hcpTargeting ? (
                <div className="py-1.5 px-2 bg-background/50 rounded">
                  <div className="text-muted-foreground">HCP targeting data available</div>
                </div>
              ) : (
                <p className="text-muted-foreground py-2 px-2">No audience data</p>
              )}
            </AccordionContent>
          </AccordionItem>

          {/* Market Section */}
          <AccordionItem value="market" className="border rounded-lg mb-2 overflow-hidden">
            <AccordionTrigger className="px-3 py-2 hover:no-underline hover:bg-muted/50">
              <div className="flex items-center gap-2 text-sm">
                <BarChart3 className="h-4 w-4 text-purple-500" />
                <span className="font-medium">Market</span>
                <Badge variant="secondary" className="ml-auto">
                  {marketContext ? '1' : '0'}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-3 pb-3 pt-1 space-y-2 text-xs">
              {marketContext ? (
                <>
                  {marketContext.rxTrends && (
                    <div className="py-1.5 px-2 bg-background/50 rounded">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Rx Growth</span>
                        <span className={cn(
                          "font-medium",
                          marketContext.rxTrends.growthRate > 0 ? "text-green-600" : "text-red-600"
                        )}>
                          {marketContext.rxTrends.growthRate > 0 ? '+' : ''}{marketContext.rxTrends.growthRate}%
                        </span>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-muted-foreground py-2 px-2">No market data</p>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};
