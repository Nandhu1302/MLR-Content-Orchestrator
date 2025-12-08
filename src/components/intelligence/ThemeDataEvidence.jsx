import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, TrendingUp, Users, Database } from "lucide-react";

export const ThemeDataEvidence = ({ theme, supportingData }) => {
  if (!supportingData) return null;

  const performanceLift = supportingData.expectedEngagement && supportingData.baselineEngagement
    ? ((supportingData.expectedEngagement - supportingData.baselineEngagement) / supportingData.baselineEngagement * 100).toFixed(1)
    : null;

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center space-x-2">
        <Database className="h-5 w-5 text-primary" />
        <h3 className="text-sm font-semibold">
          Data-Driven Evidence
        </h3>
      </div>

      <div className="flex flex-wrap gap-2">
        {supportingData.similarCampaigns && (
          <Badge variant="outline" className="flex items-center gap-1 text-xs">
            <CheckCircle className="h-3 w-3" />
            Based on {supportingData.similarCampaigns} campaigns
          </Badge>
        )}

        {performanceLift && (
          <Badge variant="secondary" className="flex items-center gap-1 text-xs">
            <TrendingUp className="h-3 w-3" />
            +{performanceLift}% vs baseline
          </Badge>
        )}

        {supportingData.audienceSize && (
          <Badge variant="outline" className="flex items-center gap-1 text-xs">
            <Users className="h-3 w-3" />
            {(supportingData.audienceSize / 1000).toFixed(0)}K HCPs in segment
          </Badge>
        )}

        {supportingData.confidenceScore && (
          <Badge variant="outline" className="text-xs">
            {supportingData.confidenceScore}% Confidence
          </Badge>
        )}
      </div>

      {supportingData.provenPattern && (
        <div className="text-xs text-muted-foreground p-3 border rounded-md">
          <span className="font-semibold text-foreground">Proven Pattern:</span> {supportingData.provenPattern}
        </div>
      )}
    </Card>
  );
};

export default ThemeDataEvidence;