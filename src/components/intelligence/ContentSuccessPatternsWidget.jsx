
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Mail, MousePointer, FileText } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { parseDateCutoff } from "@/lib/dateUtils";

function ContentSuccessPatternsWidget({ brandId, filters }) {
  const { data: elements, isLoading } = useQuery({
    queryKey: ['top-performing-elements', brandId, filters],
    queryFn: async () => {
      const dateCutoff = parseDateCutoff(filters?.timeRange);

      let query = supabase
        .from('content_element_performance')
        .select('*')
        .eq('brand_id', brandId)
        .order('avg_performance_score', { ascending: false });

      if (filters?.audienceType && filters.audienceType !== 'All') {
        query = query.eq('top_performing_audience', filters.audienceType);
      }
      if (filters?.audienceSegment) {
        query = query.ilike('element_context', `%${filters.audienceSegment}%`);
      }
      if (filters?.channel) {
        query = query.eq('top_performing_channel', filters.channel);
      }
      if (dateCutoff) {
        query = query.gte('last_seen', dateCutoff);
      }
      if (filters?.region) {
        query = query.ilike('element_context', `%${filters.region}%`);
      }

      const { data } = await query.limit(15);

      const grouped = {
        subject_line: [],
        cta_type: [],
        format: [],
      };

      data?.forEach((element) => {
        if (grouped[element.element_type]) {
          grouped[element.element_type].push(element);
        }
      });

      return {
        subjectLines: grouped.subject_line.slice(0, 3),
        ctas: grouped.cta_type.slice(0, 3),
        formats: grouped.format.slice(0, 3),
      };
    },
    enabled: Boolean(brandId),
  });

  if (isLoading) {
    return (
      <Card className="p-6 animate-pulse">
        <div className="h-6 bg-muted rounded mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-32 bg-muted rounded"></div>
          <div className="h-32 bg-muted rounded"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="h-5 w-5 text-yellow-500" />
        <h3 className="font-semibold">What's Working in Your Content</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Top Subject Lines */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Mail className="h-4 w-4 text-primary" />
            <div className="text-sm font-medium">Top Subject Lines</div>
          </div>
          <div className="space-y-2">
            {elements?.subjectLines.map((element, idx) => (
              <div key={idx} className="p-2 bg-muted/50 rounded text-xs">
                <div className="font-medium mb-1">{element.element_value}</div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span>{element.avg_engagement_rate?.toFixed(1)}% engagement</span>
                  <Badge variant="outline" className="text-xs">{element.usage_count} uses</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top CTAs */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <MousePointer className="h-4 w-4 text-primary" />
            <div className="text-sm font-medium">Top CTAs</div>
          </div>
          <div className="space-y-2">
            {elements?.ctas.map((element, idx) => (
              <div key={idx} className="p-2 bg-muted/50 rounded text-xs">
                <div className="font-medium mb-1">{element.element_value}</div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span>{element.avg_conversion_rate?.toFixed(1)}% conversion</span>
                  <Badge variant="outline" className="text-xs">{element.usage_count} uses</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Formats */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <FileText className="h-4 w-4 text-primary" />
            <div className="text-sm font-medium">Top Formats</div>
          </div>
          <div className="space-y-2">
            {elements?.formats.map((element, idx) => (
              <div key={idx} className="p-2 bg-muted/50 rounded text-xs">
                <div className="font-medium mb-1">{element.element_value}</div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span>{element.avg_performance_score?.toFixed(0)} score</span>
                  <Badge variant="outline" className="text-xs">{element.usage_count} uses</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

// ✅ Explicit export
export default ContentSuccessPatternsWidget;
