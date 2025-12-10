import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, TrendingUp, Users, Database } from "lucide-react";

// interface ThemeDataEvidenceProps removed

export const ThemeDataEvidence = ({ theme, supportingData }) => {
  if (!supportingData) return null;

  const performanceLift = supportingData.expectedEngagement && supportingData.baselineEngagement
    ? ((supportingData.expectedEngagement - supportingData.baselineEngagement) / supportingData.baselineEngagement * 100).toFixed(1)
    : null;

  return (
    <Card className="p-4 mt-4 bg-muted/30">
      <div className="flex items-center gap-2 mb-3">
        <Database className="h-4 w-4 text-primary" />
        <span className="font-semibold text-sm">Data-Driven Evidence</span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        {supportingData.similarCampaigns && (
          <div className="flex items-center gap-2">
            <CheckCircle className="h-3 w-3 text-green-500" />
            <span className="text-muted-foreground">
              Based on <strong>{supportingData.similarCampaigns}</strong> campaigns
            </span>
          </div>
        )}

        {performanceLift && (
          <div className="flex items-center gap-2">
            <TrendingUp className="h-3 w-3 text-green-500" />
            <span className="text-muted-foreground">
              <strong>+{performanceLift}%</strong> vs baseline
            </span>
          </div>
        )}

        {supportingData.audienceSize && (
          <div className="flex items-center gap-2">
            <Users className="h-3 w-3" />
            <span className="text-muted-foreground">
              <strong>{(supportingData.audienceSize / 1000).toFixed(0)}K</strong> HCPs in segment
            </span>
          </div>
        )}

        {supportingData.confidenceScore && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {supportingData.confidenceScore}% Confidence
            </Badge>
          </div>
        )}
      </div>

      {supportingData.provenPattern && (
        <div className="mt-3 p-2 bg-primary/10 rounded text-xs">
          <strong>Proven Pattern:</strong> {supportingData.provenPattern}
        </div>
      )}
    </Card>
  );
};