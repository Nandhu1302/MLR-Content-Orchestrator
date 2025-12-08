
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertCircle, Database } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

function DataSourceHealthDashboard({ brandId }) {
  const { data: sources } = useQuery({
    queryKey: ['data-sources', brandId],
    queryFn: async () => {
      const { data } = await supabase
        .from('data_source_registry')
        .select('*')
        .eq('is_active', true);
      return data || [];
    },
  });

  const getStatusColor = (failures) => {
    if (failures === 0) return "text-green-500";
    if (failures < 3) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Database className="h-5 w-5" />
        <h3 className="font-semibold">Data Source Health</h3>
      </div>
      <div className="space-y-3">
        {sources?.map((source) => (
          <div key={source.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              {source.consecutive_failures === 0 ? (
                <CheckCircle className={getStatusColor(source.consecutive_failures)} />
              ) : source.consecutive_failures < 3 ? (
                <AlertCircle className={getStatusColor(source.consecutive_failures)} />
              ) : (
                <XCircle className={getStatusColor(source.consecutive_failures)} />
              )}
              <div>
                <p className="font-medium">{source.source_system}</p>
                <p className="text-sm text-muted-foreground">{source.sync_frequency}</p>
              </div>
            </div>
            <Badge variant={source.consecutive_failures === 0 ? "default" : "destructive"}>
              {source.consecutive_failures === 0 ? "Healthy" : `${source.consecutive_failures} failures`}
            </Badge>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ✅ Explicit export
export {DataSourceHealthDashboard};
