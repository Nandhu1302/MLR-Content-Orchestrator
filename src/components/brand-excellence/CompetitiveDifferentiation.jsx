import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

const differentiators = [
  {
    title: "Integrated vs. Fragmented",
    description: "Single platform replacing 6-8 disconnected tools (content creation, DAM, translation, compliance checking, project management)",
    highlight: "One unified workflow"
  },
  {
    title: "Predictive vs. Reactive",
    description: "MLR Memory Predictor learns from historical decisions to prevent issues before they occur (vs. generic compliance checklists)",
    highlight: "AI-powered foresight"
  },
  {
    title: "Intelligence-Driven vs. Template-Based",
    description: "AI analyzes real-time market data, competitive landscape, social sentiment (vs. static brand guidelines)",
    highlight: "Dynamic strategic insights"
  },
  {
    title: "Cultural Intelligence vs. Direct Translation",
    description: "Adapts messaging, imagery, cultural context beyond word-for-word translation (Hofstede framework analysis)",
    highlight: "True localization"
  },
  {
    title: "Pharmaceutical-Specific AI Training",
    description: "Models trained on pharma marketing corpus, medical terminology (MedDRA, SNOMED), regulatory frameworks (vs. generic AI tools)",
    highlight: "Industry-specialized AI"
  },
  {
    title: "Multi-Tier AI Architecture",
    description: "Right AI engine for right task (Standard for high-volume, Advanced for complex reasoning, Premium for critical accuracy)",
    highlight: "Optimized cost & performance"
  }
];

export const CompetitiveDifferentiation = () => {
  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="text-2xl">Competitive Differentiation</CardTitle>
        <CardDescription>
          What sets Brand Excellence Platform apart from generic content management and translation tools
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {differentiators.map((item, idx) => (
            <div key={idx} className="border rounded-lg p-4 space-y-2 bg-muted/30">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                <div className="space-y-1.5 flex-1">
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                  <div className="inline-block">
                    <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded font-medium">
                      {item.highlight}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};