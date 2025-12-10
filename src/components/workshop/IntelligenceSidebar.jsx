import { useState } from 'react';
import { ChevronLeft, ChevronRight, Brain, FileText, TrendingUp, Users, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';

export const IntelligenceSidebar = ({
  intelligence,
  collapsed = false,
  onToggle,
  hcpTargeting,
  marketContext,
  audienceInsights,
  performancePrediction,
}) => {
  const [expandedSections, setExpandedSections] = useState(['evidence']);

  const totalCount = (
    (intelligence?.claims?.length || 0) +
    (intelligence?.visuals?.length || 0) +
    (intelligence?.modules?.length || 0)
  );

  if (collapsed) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onToggle}>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Badge variant="secondary">Intelligence {totalCount}</Badge>
      </div>
    );
  }

  return (
    <div className="w-80 border-l bg-muted/30 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4" />
          <h4 className="text-sm font-semibold">Intelligence</h4>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{totalCount} items</Badge>
          <Button variant="ghost" size="icon" onClick={onToggle}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="overflow-y-auto p-3 space-y-3">
        {/* Evidence Section */}
        <Accordion type="multiple" defaultValue={expandedSections}>
          <AccordionItem value="evidence">
            <AccordionTrigger>Evidence {(intelligence?.claims?.length || 0) + (intelligence?.visuals?.length || 0) + (intelligence?.modules?.length || 0)}</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  <span>Claims</span>
                  <Badge variant="secondary">{intelligence?.claims?.length || 0}</Badge>
                </div>
                <div className="flex items-center gap-1">
                  <BarChart3 className="h-3 w-3" />
                  <span>Visuals</span>
                  <Badge variant="secondary">{intelligence?.visuals?.length || 0}</Badge>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  <span>Modules</span>
                  <Badge variant="secondary">{intelligence?.modules?.length || 0}</Badge>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Performance Section */}
          <AccordionItem value="performance">
            <AccordionTrigger>Performance {performancePrediction ? '1' : '0'}</AccordionTrigger>
            <AccordionContent>
              {performancePrediction ? (
                <div className="text-xs space-y-1">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-3 w-3" />
                    <span>Engagement</span>
                    <Badge variant="outline">{performancePrediction.predictedEngagement}%</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-3 w-3" />
                    <span>Confidence</span>
                    <Badge variant="outline">{performancePrediction.confidence}%</Badge>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-muted-foreground">No predictions available</div>
              )}
            </AccordionContent>
          </AccordionItem>

          {/* Audience Section */}
          <AccordionItem value="audience">
            <AccordionTrigger>Audience {(audienceInsights || hcpTargeting) ? '1' : '0'}</AccordionTrigger>
            <AccordionContent>
              {audienceInsights ? (
                <div className="text-xs space-y-1">
                  <div className="flex items-center gap-2">
                    <Users className="h-3 w-3" />
                    <Badge variant="secondary">{audienceInsights.primaryAudience}</Badge>
                  </div>
                  {audienceInsights.keyDecisionFactors?.length ? (
                    <div className="text-muted-foreground">
                      {audienceInsights.keyDecisionFactors.slice(0, 2).join(', ')}
                    </div>
                  ) : null}
                </div>
              ) : hcpTargeting ? (
                <div className="text-xs">HCP targeting data available</div>
              ) : (
                <div className="text-xs text-muted-foreground">No audience data</div>
              )}
            </AccordionContent>
          </AccordionItem>

          {/* Market Section */}
          <AccordionItem value="market">
            <AccordionTrigger>Market {marketContext ? '1' : '0'}</AccordionTrigger>
            <AccordionContent>
              {marketContext ? (
                <div className="text-xs space-y-2">
                  {marketContext.rxTrends && (
                    <div className="flex items-center gap-2">
                      <TrendingUp className={cn('h-3 w-3', marketContext.rxTrends.growthRate > 0 ? 'text-green-600' : 'text-red-600')} />
                      <span>
                        {marketContext.rxTrends.growthRate > 0 ? '+' : ''}{marketContext.rxTrends.growthRate}%
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-xs text-muted-foreground">No market data</div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};
