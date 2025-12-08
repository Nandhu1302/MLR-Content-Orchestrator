
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, TrendingUp } from "lucide-react";
import { useDataIntelligence } from "@/hooks/useDataIntelligence";

function ElementPerformanceHeatmap({ brandId }) {
  const { topElements, isLoading } = useDataIntelligence(brandId);

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-muted rounded w-1/3"></div>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  const elementCategories = [
    { key: 'tone', label: 'Tone', icon: '🎭' },
    { key: 'cta_type', label: 'Call to Action', icon: '🎯' },
    { key: 'subject_line_pattern', label: 'Subject Line', icon: '📧' },
    { key: 'complexity_level', label: 'Complexity', icon: '📊' },
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="h-5 w-5 text-yellow-500" />
        <h3 className="font-semibold">Top Performing Elements</h3>
      </div>

      <div className="space-y-4">
        {elementCategories.map((category) => {
          const elements = topElements?.[category.key] || [];

          return (
            <div key={category.key} className="space-y-2">
              <div className="text-sm font-medium flex items-center gap-2">
                <span>{category.icon}</span>
                <span>{category.label}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {elements.slice(0, 3).map((element, idx) => (
                  <Badge
                    key={idx}
                    variant={idx === 0 ? "default" : "secondary"}
                    className="flex items-center gap-1"
                  >
                    <span>{element.element_value}</span>
                    <TrendingUp className="h-3 w-3" />
                    <span className="text-xs">
                      {element.avg_engagement_rate?.toFixed(1)}%
                    </span>
                  </Badge>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// ✅ Explicit export
export {ElementPerformanceHeatmap};
