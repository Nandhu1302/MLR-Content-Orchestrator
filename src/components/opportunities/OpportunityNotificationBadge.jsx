import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';

export const OpportunityNotificationBadge = ({ brandId }) => {
  const { data: count } = useQuery({
    queryKey: ['opportunity-count', brandId],
    queryFn: async () => {
      const { count } = await supabase
        .from('content_opportunities')
        .select('*', { count: 'exact', head: true })
        .eq('brand_id', brandId)
        .eq('status', 'active')
        .gte('urgency_score', 70);
      return count || 0;
    },
    enabled: Boolean(brandId),
    refetchInterval: 60000 // Refresh every minute
  });

  if (!count || count === 0) return null;

  return (
    <Badge variant="destructive" className="ml-2 gap-1">
      <Sparkles className="h-3 w-3" />
      {count}
    </Badge>
  );
};