import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe2, Languages, TrendingUp, Zap } from "lucide-react";

export const GlocalizationIntelligenceCard = ({
  activeProjects,
  languagesSupported,
  culturalScore,
  tmLeverageRate,
  onOpenDrawer,
}) => {

  const getCulturalScoreBadge = () => {
    if (culturalScore >= 80) return { color: 'bg-success text-success-foreground', label: 'Excellent' };
    if (culturalScore >= 60) return { color: 'bg-warning text-warning-foreground', label: 'Good' };
    return { color: 'bg-secondary text-secondary-foreground', label: 'Developing' };
  };

  const culturalBadge = getCulturalScoreBadge();

  return (
    <Card 
      className="cursor-pointer hover:shadow-sm transition-shadow"
      onClick={onOpenDrawer}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Globe2 className="h-4 w-4" />
          Glocalization Intelligence
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Active Projects</span>
          <Badge variant="secondary" className="text-sm font-semibold">
            {activeProjects}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Languages className="h-3 w-3" />
            Languages
          </span>
          <span className="text-xs font-medium">
            {languagesSupported}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            Cultural Score
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium">
              {culturalScore.toFixed(0)}%
            </span>
            <Badge className={culturalBadge.color} variant="secondary" style={{ fontSize: '0.65rem', padding: '0 0.375rem' }}>
              {culturalBadge.label}
            </Badge>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Zap className="h-3 w-3" />
            TM Leverage
          </span>
          <span className="text-xs font-medium">
            {tmLeverageRate.toFixed(0)}%
          </span>
        </div>
      </CardContent>
    </Card>
  );
};