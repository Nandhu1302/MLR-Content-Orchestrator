
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, Mail, MousePointer, MessageSquare } from "lucide-react";

function ContentIntelligenceOverview({ brandId }) {
  const { data: elementPerformance, isLoading: elementsLoading } = useQuery({
    queryKey: ['content-element-performance', brandId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_element_performance')
        .select('*')
        .eq('brand_id', brandId)
        .order('avg_performance_score', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!brandId,
  });

  const { data: successPatterns, isLoading: patternsLoading } = useQuery({
    queryKey: ['content-success-patterns', brandId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_success_patterns')
        .select('*')
        .eq('brand_id', brandId)
        .order('confidence_score', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!brandId,
  });

  const isLoading = elementsLoading || patternsLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const topSubjectLines = elementPerformance?.filter(e => e.element_type === 'subject_line').slice(0, 5) || [];
  const topCTAs = elementPerformance?.filter(e => e.element_type === 'cta').slice(0, 5) || [];
  const topThemes = elementPerformance?.filter(e => e.element_type === 'theme').slice(0, 5) || [];

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Content Elements</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{elementPerformance?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Tracked elements</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance Records</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {elementPerformance?.reduce((sum, e) => sum + (e.usage_count || 0), 0) || 0}
            </div>
            <p className="text-xs text-muted-foreground">Total usage tracked</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Patterns</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{successPatterns?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Identified patterns</p>
          </CardContent>
        </Card>
      </div>

      {/* Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Subject Lines */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Top Subject Lines
            </CardTitle>
            <CardDescription>Best performing email subjects</CardDescription>
          </CardHeader>
          <CardContent>
            {topSubjectLines.length > 0 ? (
              <div className="space-y-4">
                {topSubjectLines.map((element, idx) => (
                  <div key={element.id} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">#{idx + 1}</span>
                      <span className="text-sm text-muted-foreground">
                        {(element.avg_performance_score || 0).toFixed(1)}% score
                      </span>
                    </div>
                    <p className="text-sm line-clamp-2">{element.element_value}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No subject line data available</p>
            )}
          </CardContent>
        </Card>

        {/* Top CTAs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MousePointer className="h-5 w-5" />
              Top CTAs
            </CardTitle>
            <CardDescription>Most effective calls-to-action</CardDescription>
          </CardHeader>
          <CardContent>
            {topCTAs.length > 0 ? (
              <div className="space-y-4">
                {topCTAs.map((element, idx) => (
                  <div key={element.id} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">#{idx + 1}</span>
                      <span className="text-sm text-muted-foreground">
                        {(element.avg_conversion_rate || 0).toFixed(1)}% CVR
                      </span>
                    </div>
                    <p className="text-sm line-clamp-2">{element.element_value}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No CTA data available</p>
            )}
          </CardContent>
        </Card>

        {/* Top Themes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Top Themes
            </CardTitle>
            <CardDescription>Winning content themes</CardDescription>
          </CardHeader>
          <CardContent>
            {topThemes.length > 0 ? (
              <div className="space-y-4">
                {topThemes.map((element, idx) => (
                  <div key={element.id} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">#{idx + 1}</span>
                      <span className="text-sm text-muted-foreground">
                        {(element.avg_engagement_rate || 0).toFixed(1)}% engagement
                      </span>
                    </div>
                    <p className="text-sm line-clamp-2">{element.element_value}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No theme data available</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ✅ Explicit export
export {ContentIntelligenceOverview};
