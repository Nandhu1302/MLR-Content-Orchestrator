import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, CheckCircle, Rocket, ArrowRight } from "lucide-react";

export const ThemePipelineView = ({ themes, themeUsage }) => {
  const generatedCount = themes.filter(t => t.enrichment_status === 'generated').length;
  const readyCount = themes.filter(t => t.enrichment_status === 'ready-for-use').length;
  const usedCount = themes.filter(t => (themeUsage[t.id] || 0) > 0).length;

  const stages = [
    {
      label: 'Needs Enrichment',
      count: generatedCount,
      icon: Sparkles,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      description: 'New themes awaiting enrichment'
    },
    {
      label: 'Ready to Use',
      count: readyCount,
      icon: CheckCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      description: 'Themes enhanced with intelligence'
    },
    {
      label: 'In Use',
      count: usedCount,
      icon: Rocket,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      description: 'Themes actively used in content'
    }
  ];

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between gap-4">
          {stages.map((stage, index) => (
            <div key={stage.label} className="flex items-center gap-4 flex-1">
              <div className="flex-1">
                <div className={`${stage.bgColor} rounded-lg p-6 text-center`}>
                  <stage.icon className={`h-8 w-8 mx-auto mb-2 ${stage.color}`} />
                  <div className="text-3xl font-bold mb-1">{stage.count}</div>
                  <div className="font-semibold mb-1">{stage.label}</div>
                  <div className="text-xs text-muted-foreground">{stage.description}</div>
                </div>
              </div>
              {index < stages.length - 1 && (
                <ArrowRight className="h-6 w-6 text-muted-foreground flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};