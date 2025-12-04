import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar } from "lucide-react";

const phases = [
  {
    phase: "Phase 1: Foundation",
    timeline: "Weeks 1-4",
    color: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800",
    activities: [
      "Platform setup and configuration",
      "Brand guideline ingestion",
      "Translation memory integration",
      "User onboarding and training"
    ]
  },
  {
    phase: "Phase 2: Pillar 1 Activation",
    timeline: "Weeks 5-8",
    color: "bg-cyan-50 dark:bg-cyan-950/30 border-cyan-200 dark:border-cyan-800",
    activities: [
      "Strategic Content Intelligence Hub deployment",
      "Historical content analysis",
      "Competitive intelligence setup",
      "Market data integrations (IQVIA, social listening)"
    ]
  },
  {
    phase: "Phase 3: Pillar 2 Activation",
    timeline: "Weeks 9-12",
    color: "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800",
    activities: [
      "PreMLR Compliance Companion deployment",
      "Historical MLR decision analysis",
      "Regulatory framework mapping",
      "Medical terminology database integration"
    ]
  },
  {
    phase: "Phase 4: Pillar 3 Activation",
    timeline: "Weeks 13-16",
    color: "bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800",
    activities: [
      "Global-Local Orchestration Engine deployment",
      "Translation memory optimization",
      "Cultural intelligence framework setup",
      "Market regulatory database integration"
    ]
  },
  {
    phase: "Phase 5: Scale and Optimization",
    timeline: "Weeks 17-20",
    color: "bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800",
    activities: [
      "Multi-brand expansion",
      "Workflow refinement based on usage data",
      "Advanced AI model fine-tuning",
      "Full-scale production launch"
    ]
  }
];

export const ImplementationRoadmap = () => {
  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="text-2xl">Implementation Roadmap</CardTitle>
        <CardDescription>
          Phased deployment approach ensuring smooth transition and rapid time-to-value
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {phases.map((phase, idx) => (
          <div key={idx} className={`${phase.color} rounded-lg p-4 border-2`}>
            <div className="flex items-center gap-3 mb-3">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <h3 className="font-semibold text-foreground">{phase.phase}</h3>
                <p className="text-sm text-muted-foreground font-medium">{phase.timeline}</p>
              </div>
            </div>
            <ul className="space-y-1.5 ml-8">
              {phase.activities.map((activity, actIdx) => (
                <li key={actIdx} className="text-sm text-muted-foreground flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>{activity}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};