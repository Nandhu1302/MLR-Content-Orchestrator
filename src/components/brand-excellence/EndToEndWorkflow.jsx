import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

const steps = [
  {
    number: 1,
    title: "Strategic Intelligence (Pillar 1)",
    input: "Campaign objectives, target audience, indication, competitive landscape",
    process: "AI analyzes market data (IQVIA), social sentiment (Brandwatch/Talkwalker), brand guidelines, competitive positioning",
    output: "Strategic theme library with confidence scores, white space opportunities, messaging frameworks",
    pillar: "blue"
  },
  {
    number: 2,
    title: "Content Creation with Live Guardrails (Pillar 1 + 2)",
    input: "Strategic theme + content brief",
    process: "AI-assisted content creation with real-time brand consistency checking and compliance pre-validation",
    output: "Brand-aligned content with compliance score (0-100) and issue flagging",
    pillar: "blue-green"
  },
  {
    number: 3,
    title: "PreMLR Compliance Optimization (Pillar 2)",
    input: "Draft content",
    process: "Regulatory framework validation (FDA, EMA, PMDA, etc.), MLR memory prediction, medical accuracy checks",
    output: "Optimized content with pre-approved language alternatives, approval probability score, remediation guidance",
    pillar: "green"
  },
  {
    number: 4,
    title: "MLR Submission (Pillar 2)",
    input: "Pre-validated content",
    process: "Content submitted to MLR with compliance insights and risk assessment",
    output: "Accelerated approval cycle (avg. 90% first-pass approval)",
    pillar: "green"
  },
  {
    number: 5,
    title: "Global-Local Orchestration (Pillar 3)",
    input: "Approved master content + target markets",
    process: "TM-leveraged medical translation, cultural intelligence analysis, market regulatory mapping",
    output: "Culturally-adapted, medically accurate, market-compliant local assets",
    pillar: "purple"
  },
  {
    number: 6,
    title: "Multi-Market Deployment",
    input: "Localized assets",
    process: "Final review, publishing workflow",
    output: "Campaign-ready assets across 50+ markets",
    pillar: "purple"
  }
];

const getPillarColor = (pillar) => {
  switch (pillar) {
    case "blue":
      return "border-l-blue-500";
    case "green":
      return "border-l-green-500";
    case "purple":
      return "border-l-purple-500";
    case "blue-green":
      return "border-l-gradient-to-b from-blue-500 to-green-500";
    default:
      return "border-l-gray-500";
  }
};

export const EndToEndWorkflow = () => {
  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="text-2xl">How It Works: End-to-End Workflow</CardTitle>
        <CardDescription>
          Integrated workflow across all three pillars from strategic planning to global deployment
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {steps.map((step, idx) => (
          <div key={idx}>
            <div className={`border-l-4 ${getPillarColor(step.pillar)} bg-muted/30 rounded-r-lg p-4 space-y-3`}>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                  {step.number}
                </div>
                <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-semibold text-foreground block mb-1">Input:</span>
                  <p className="text-muted-foreground">{step.input}</p>
                </div>
                <div>
                  <span className="font-semibold text-foreground block mb-1">Process:</span>
                  <p className="text-muted-foreground">{step.process}</p>
                </div>
                <div>
                  <span className="font-semibold text-foreground block mb-1">Output:</span>
                  <p className="text-muted-foreground">{step.output}</p>
                </div>
              </div>
            </div>
            
            {idx < steps.length - 1 && (
              <div className="flex justify-center py-2">
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};