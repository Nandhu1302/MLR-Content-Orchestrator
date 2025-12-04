import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DollarSign, TrendingDown, TrendingUp, Zap } from "lucide-react";

const costSavings = [
  { item: "Translation costs", amount: "$320K", detail: "30% reduction via TM leverage" },
  { item: "MLR rework costs", amount: "$480K", detail: "Reduced rejection: 60% → 10%" },
  { item: "Agency costs", amount: "$240K", detail: "40% efficiency = less outsourcing" }
];

const revenueProtection = [
  { item: "Time-to-market acceleration", amount: "$1.8M", detail: "3 months earlier @ $600K/month" },
  { item: "Opportunity cost reduction", amount: "$380K", detail: "Freed capacity for new campaigns" }
];

const efficiencyGains = [
  { item: "Labor efficiency", amount: "$480K", detail: "40% improvement = 6 FTE capacity" },
  { item: "Process acceleration", amount: "75%", detail: "12 weeks → 3 weeks cycle time" }
];

export const ROIBusinessCase = () => {
  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="text-2xl">ROI and Business Case</CardTitle>
        <CardDescription>
          Comprehensive financial justification with detailed cost savings and value creation analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Total Value */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/30 dark:to-blue-950/30 rounded-lg p-6 border-2 border-green-200 dark:border-green-800">
          <div className="flex items-center gap-3 mb-3">
            <DollarSign className="h-8 w-8 text-green-600 dark:text-green-400" />
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Annual Value Per Brand</h3>
              <div className="text-4xl font-bold text-foreground">$3.2M+</div>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            12-18 month payback period | Platform subscription: ~$180K/year
          </div>
        </div>

        {/* Cost Savings */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-lg font-semibold text-foreground">Cost Savings</h3>
          </div>
          <div className="space-y-2">
            {costSavings.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium text-foreground">{item.item}</div>
                  <div className="text-sm text-muted-foreground">{item.detail}</div>
                </div>
                <div className="text-xl font-bold text-foreground">{item.amount}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Protection */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
            <h3 className="text-lg font-semibold text-foreground">Revenue Protection</h3>
          </div>
          <div className="space-y-2">
            {revenueProtection.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium text-foreground">{item.item}</div>
                  <div className="text-sm text-muted-foreground">{item.detail}</div>
                </div>
                <div className="text-xl font-bold text-foreground">{item.amount}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Efficiency Gains */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Zap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <h3 className="text-lg font-semibold text-foreground">Efficiency Gains</h3>
          </div>
          <div className="space-y-2">
            {efficiencyGains.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium text-foreground">{item.item}</div>
                  <div className="text-sm text-muted-foreground">{item.detail}</div>
                </div>
                <div className="text-xl font-bold text-foreground">{item.amount}</div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};