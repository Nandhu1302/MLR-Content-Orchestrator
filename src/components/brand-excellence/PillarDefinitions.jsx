import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Brain, Shield, Globe2 } from "lucide-react";

const pillars = [
  {
    id: 1,
    title: "Strategic Content Intelligence Hub",
    icon: Brain,
    definition: "An AI-powered intelligence engine that transforms disparate data sources (competitive intelligence, market dynamics, social sentiment, brand guidelines) into actionable strategic themes and real-time brand compliance guardrails.",
    coreConcept: "Proactive intelligence-driven content creation vs. reactive production",
    impact: [
      "60% reduction in strategic planning cycles",
      "85% brand consistency scores",
      "Real-time competitive intelligence integration"
    ],
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950/30"
  },
  {
    id: 2,
    title: "PreMLR Compliance Companion",
    icon: Shield,
    definition: "A predictive compliance system that analyzes historical MLR decisions, regulatory frameworks across 50+ markets, and medical accuracy standards to provide real-time compliance scoring and pre-approved language alternatives before content enters formal review.",
    coreConcept: "Converting compliance bottleneck into content accelerator",
    impact: [
      "90% first-pass MLR approval rate (up from 40%)",
      "75% reduction in review cycles",
      "50+ market regulatory framework coverage"
    ],
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-950/30"
  },
  {
    id: 3,
    title: "Global-Local Orchestration Engine",
    icon: Globe2,
    definition: "A culturally-intelligent translation and localization system that leverages Translation Memory, medical terminology databases, cultural intelligence frameworks, and market regulatory requirements to deliver medically accurate, culturally resonant content at scale.",
    coreConcept: "Global brand consistency + local cultural relevance = \"Glocalization\"",
    impact: [
      "50+ market readiness",
      "30% translation cost reduction",
      "40% labor efficiency gains"
    ],
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-950/30"
  }
];

export const PillarDefinitions = () => {
  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="text-2xl">Platform Foundation: Pillar Definitions</CardTitle>
        <CardDescription>
          Three integrated pillars that transform content operations from fragmented workflows into an intelligent, compliant, and scalable ecosystem
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {pillars.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <div key={pillar.id} className="border rounded-lg p-6 space-y-4">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${pillar.bgColor} shrink-0`}>
                  <Icon className={`h-6 w-6 ${pillar.color}`} />
                </div>
                <div className="flex-1 space-y-3">
                  <h3 className="text-xl font-bold text-foreground">
                    Pillar {pillar.id}: {pillar.title}
                  </h3>
                  
                  <div className="space-y-2">
                    <div>
                      <span className="font-semibold text-sm text-foreground">Definition: </span>
                      <span className="text-sm text-muted-foreground">{pillar.definition}</span>
                    </div>
                    
                    <div>
                      <span className="font-semibold text-sm text-foreground">Core Concept: </span>
                      <span className="text-sm text-muted-foreground italic">{pillar.coreConcept}</span>
                    </div>
                    
                    <div>
                      <span className="font-semibold text-sm text-foreground mb-2 block">Measurable Impact:</span>
                      <ul className="space-y-1 ml-4">
                        {pillar.impact.map((item, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground flex items-start">
                            <span className="text-primary mr-2">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};