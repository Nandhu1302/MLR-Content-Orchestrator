import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TrendingUp, Zap, Target, AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';
import { OpportunityDetailModal } from './OpportunityDetailModal';

export const OpportunityDrawer = ({ open, onOpenChange, brandId }) => {
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);

  const { data: opportunities, isLoading } = useQuery({
    queryKey: ['opportunities-drawer', brandId],
    queryFn: async () => {
      const { data } = await supabase
        .from('content_opportunities')
        .select('*')
        .eq('brand_id', brandId)
        .eq('status', 'active')
        .order('urgency_score', { ascending: false })
        .limit(10);
      return data || [];
    },
    enabled: open && Boolean(brandId)
  });

  const getIcon = (type) => {
    switch (type) {
      case 'sentiment_shift': return TrendingUp;
      case 'market_movement': return Target;
      case 'competitive_trigger': return AlertTriangle;
      case 'emerging_topic': return Sparkles;
      case 'quick_win': return Zap;
      default: return TrendingUp;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Content Opportunities
            </DialogTitle>
          </DialogHeader>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-sm text-muted-foreground">Loading opportunities...</div>
            </div>
          ) : opportunities && opportunities.length > 0 ? (
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-3">
                {opportunities.map((opp) => {
                  const Icon = getIcon(opp.opportunity_type);
                  return (
                    <div
                      key={opp.id}
                      onClick={() => setSelectedOpportunity(opp)}
                      className="border rounded-lg p-4 hover:bg-accent cursor-pointer transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h4 className="font-medium leading-tight">{opp.title}</h4>
                            <Badge variant={getPriorityColor(opp.priority)}>
                              {opp.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {opp.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Urgency: {opp.urgency_score}%</span>
                            <span>Impact: {opp.impact_score}%</span>
                            <span>Confidence: {Math.round(opp.confidence_score * 100)}%</span>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Sparkles className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-sm text-muted-foreground">
                No active opportunities at the moment
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                We'll notify you when new content opportunities are detected
              </p>
            </div>
          )}

          <div className="flex justify-between items-center pt-4 border-t">
            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.href = '/data-intelligence'}
            >
              View All Opportunities
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {selectedOpportunity && (
        <OpportunityDetailModal
          opportunity={selectedOpportunity}
          open={!!selectedOpportunity}
          onClose={() => setSelectedOpportunity(null)}
          brandId={brandId}
        />
      )}
    </>
  );
};