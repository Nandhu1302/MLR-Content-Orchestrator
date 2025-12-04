import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Brain, Shield, Globe2 } from "lucide-react";

const comparisonData = [
  {
    pillar: "Strategic Content Intelligence Hub",
    icon: Brain,
    color: "text-blue-600 dark:text-blue-400",
    inputs: "Market data, competitive intel, social sentiment, brand guidelines",
    processes: "AI analysis, theme generation, guardrail creation",
    outputs: "Strategic themes, messaging frameworks, brand consistency scores",
    value: "60% planning reduction, 85% consistency"
  },
  {
    pillar: "PreMLR Compliance Companion",
    icon: Shield,
    color: "text-green-600 dark:text-green-400",
    inputs: "Draft content, historical MLR data, regulatory frameworks",
    processes: "Compliance prediction, language validation, risk scoring",
    outputs: "Pre-approved alternatives, approval probability, remediation guidance",
    value: "90% first-pass approval, 75% cycle reduction"
  },
  {
    pillar: "Global-Local Orchestration Engine",
    icon: Globe2,
    color: "text-purple-600 dark:text-purple-400",
    inputs: "Approved content, target markets, TM database",
    processes: "Medical translation, cultural adaptation, regulatory mapping",
    outputs: "Localized assets, cultural recommendations, market-compliant content",
    value: "50+ markets, 30% cost reduction, 40% efficiency"
  }
];

export const PillarComparisonTable = () => {
  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="text-2xl">Pillar Comparison Matrix</CardTitle>
        <CardDescription>
          Side-by-side analysis of inputs, processes, outputs, and value metrics for each pillar
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2">
                <th className="text-left p-3 font-semibold text-foreground">Pillar</th>
                <th className="text-left p-3 font-semibold text-foreground">Inputs</th>
                <th className="text-left p-3 font-semibold text-foreground">Key Processes</th>
                <th className="text-left p-3 font-semibold text-foreground">Outputs</th>
                <th className="text-left p-3 font-semibold text-foreground">Value Metrics</th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((row, idx) => {
                const Icon = row.icon;
                return (
                  <tr key={idx} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Icon className={`h-5 w-5 ${row.color} shrink-0`} />
                        <span className="font-medium text-sm text-foreground">{row.pillar}</span>
                      </div>
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">{row.inputs}</td>
                    <td className="p-3 text-sm text-muted-foreground">{row.processes}</td>
                    <td className="p-3 text-sm text-muted-foreground">{row.outputs}</td>
                    <td className="p-3 text-sm font-medium text-foreground">{row.value}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};