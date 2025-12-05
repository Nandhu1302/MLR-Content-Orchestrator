import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, AlertCircle, Target, Sparkles, RefreshCw, X } from 'lucide-react';
import { OpportunityDetailModal } from './OpportunityDetailModal';
import { ContentOpportunityService } from '@/services/contentOpportunityService';
import { useToast } from '@/hooks/use-toast';

export const ContentOpportunityWidget = ({ brandId }) => {
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: opportunities, isLoading } = useQuery({
    queryKey: ['content-opportunities', brandId],
    queryFn: async () => {
      const { data } = await supabase
        .from('content_opportunities')
        .select('*')
        .eq('brand_id', brandId)
        .eq('status', 'active')
        .order('urgency_score', { ascending: false })
        .limit(5);
      return data || [];
    },
    enabled: Boolean(brandId)
  });

  const refreshMutation = useMutation({
    mutationFn: async () => {
      return await ContentOpportunityService.refreshOpportunities(brandId);
    },
    onSuccess: (count) => {
      queryClient.invalidateQueries({ queryKey: ['content-opportunities'] });
      toast({
        title: 'Opportunities Refreshed',
        description: `Found ${count} new content opportunities`
      });
    }
  });

  const dismissMutation = useMutation({
    mutationFn: async (opportunityId) => {
      await ContentOpportunityService.trackAction(opportunityId, 'dismissed');
      const { error } = await supabase
        .from('content_opportunities')
        .update({ status: 'dismissed' })
        .eq('id', opportunityId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content-opportunities'] });
      toast({ title: 'Opportunity dismissed' });
    }
  });

  const getIcon = (type) => {
    switch (type) {
      case 'sentiment_shift': return <TrendingUp className="h-4 w-4" />;
      case 'competitive_trigger': return <Target className="h-4 w-4" />;
      case 'emerging_topic': return <Sparkles className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
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

  if (!brandId) return null;

  return (
    <>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Content Opportunities</h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refreshMutation.mutate()}
            disabled={refreshMutation.isPending}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshMutation.isPending ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            Analyzing intelligence data...
          </div>
        ) : opportunities && opportunities.length > 0 ? (
          <div className="space-y-3">
            {opportunities.map((opp) => (
              <div
                key={opp.id}
                className="p-4 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                onClick={() => {
                  setSelectedOpportunity(opp);
                  ContentOpportunityService.trackAction(opp.id, 'viewed');
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-1">{getIcon(opp.opportunity_type)}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm">{opp.title}</h4>
                        <Badge variant={getPriorityColor(opp.priority)} className="text-xs">
                          {opp.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {opp.description}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>Impact: {opp.impact_score}%</span>
                        <span>Urgency: {opp.urgency_score}%</span>
                        <span>Confidence: {(opp.confidence_score * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      dismissMutation.mutate(opp.id);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No opportunities detected</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() => refreshMutation.mutate()}
            >
              Scan for Opportunities
            </Button>
          </div>
        )}
      </Card>

      <OpportunityDetailModal
        opportunity={selectedOpportunity}
        open={!!selectedOpportunity}
        onClose={() => setSelectedOpportunity(null)}
        brandId={brandId}
      />
    </>
  );
};