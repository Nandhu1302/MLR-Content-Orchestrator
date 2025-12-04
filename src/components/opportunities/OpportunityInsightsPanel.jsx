import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Zap, Calendar, Award } from 'lucide-react';
import { OpportunityLearningService } from '@/services/OpportunityLearningService';

export const OpportunityInsightsPanel = ({ brandId }) => {
  const { data: insights } = useQuery({
    queryKey: ['opportunity-insights', brandId],
    queryFn: () => OpportunityLearningService.getPerformanceInsights(brandId),
    enabled: Boolean(brandId)
  });

  const { data: forecasts } = useQuery({
    queryKey: ['trend-forecasts', brandId],
    queryFn: async () => {
      const { data } = await supabase
        .from('trend_forecasts')
        .select('*')
        .eq('brand_id', brandId)
        .eq('status', 'active')
        .order('predicted_peak_date', { ascending: true })
        .limit(5);
      return data || [];
    },
    enabled: Boolean(brandId)
  });

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Learning Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Your Performance
          </CardTitle>
          <CardDescription>
            Insights from your opportunity actions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {insights && insights.totalActedOn > 0 ? (
            <>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Opportunities Acted On</span>
                  <Badge variant="secondary">{insights.totalActedOn}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Avg. Performance</span>
                  <Badge variant="default">{insights.avgPerformance}%</Badge>
                </div>
                {insights.topPerformingType && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Best Type</span>
                    <Badge variant="outline">{insights.topPerformingType}</Badge>
                  </div>
                )}
              </div>

              {insights.insights && insights.insights.length > 0 && (
                <div className="pt-4 border-t space-y-2">
                  {insights.insights.map((insight, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Zap className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-sm">{insight}</p>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-6 text-sm text-muted-foreground">
              Act on opportunities to see your performance insights
            </div>
          )}
        </CardContent>
      </Card>

      {/* Trend Forecasts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Trend Forecasts
          </CardTitle>
          <CardDescription>
            Predicted upcoming opportunities
          </CardDescription>
        </CardHeader>
        <CardContent>
          {forecasts && forecasts.length > 0 ? (
            <div className="space-y-3">
              {forecasts.map((forecast) => (
                <div key={forecast.id} className="border rounded-lg p-3 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{forecast.forecast_topic}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          Peak: {new Date(forecast.predicted_peak_date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {Math.round(forecast.confidence_level * 100)}%
                    </Badge>
                  </div>
                  {forecast.recommended_prep_actions && 
                   Array.isArray(forecast.recommended_prep_actions) && 
                   forecast.recommended_prep_actions.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      {String(forecast.recommended_prep_actions[0])}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-sm text-muted-foreground">
              No trend forecasts available yet
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};