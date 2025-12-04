import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Factory } from "lucide-react";

export const FactoryOperationsCard = ({ onClick }) => {
  return (
    <Card 
      className="border-l-4 border-l-orange-500 bg-orange-500/5 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Factory className="h-4 w-4 text-orange-600" />
          Factory Operations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-center py-2 bg-card rounded-lg border border-orange-500/20">
          <div className="text-xs text-muted-foreground uppercase tracking-wide">Operations Metrics</div>
          <div className="text-3xl font-bold text-orange-600">6</div>
          <div className="text-xs text-muted-foreground mt-1">Analytics modules</div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="bg-card border border-border rounded p-2 text-center">
            <div className="text-muted-foreground">Lifecycle</div>
            <div className="font-semibold">42d</div>
          </div>
          
          <div className="bg-card border border-border rounded p-2 text-center">
            <div className="text-muted-foreground">Throughput</div>
            <div className="font-semibold">23</div>
          </div>
          
          <div className="bg-card border border-border rounded p-2 text-center">
            <div className="text-muted-foreground">Quality</div>
            <div className="font-semibold">78%</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};