import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, CheckCircle, FileText, TrendingUp } from "lucide-react";

export const RegulatoryComplianceCard = ({
  marketsSupported,
  complianceReady,
  activeDisclaimers,
  approvalRate,
  onOpenDrawer,
}) => {
  return (
    <Card
      className="cursor-pointer hover:shadow-sm transition-shadow"
      onClick={onOpenDrawer}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Globe className="h-4 w-4" />
          Regulatory Coverage
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            Markets Supported
          </span>
          <Badge variant="secondary" className="text-sm font-semibold">
            {marketsSupported}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Compliance Ready
          </span>
          <span className="text-xs font-medium">
            {complianceReady} / {marketsSupported}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <FileText className="h-3 w-3" />
            Active Disclaimers
          </span>
          <span className="text-xs font-medium">{activeDisclaimers}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            Approval Rate
          </span>
          <span className="text-xs font-medium">
            {approvalRate.toFixed(0)}%
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
