import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TrendingUp, Clock, Target, Globe } from "lucide-react";

const metrics = [
  {
    label: "Time-to-Market Reduction",
    value: "75%",
    detail: "12 weeks → 3 weeks",
    icon: Clock,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950/30"
  },
  {
    label: "First-Pass MLR Approval",
    value: "90%",
    detail: "vs. 40% baseline",
    icon: Target,
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-950/30"
  },
  {
    label: "Annual Value Per Brand",
    value: "$3.2M+",
    detail: "12-18 mo. payback",
    icon: TrendingUp,
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-950/30"
  },
  {
    label: "Global Market Coverage",
    value: "50+",
    detail: "Markets ready",
    icon: Globe,
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-50 dark:bg-orange-950/30"
  }
];

export const ExecutiveDashboard = () => {
  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="text-2xl">Executive Summary Dashboard</CardTitle>
        <CardDescription>
          Key performance metrics demonstrating platform value and business impact
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, idx) => {
            const Icon = metric.icon;
            return (
              <div key={idx} className={`${metric.bgColor} rounded-lg p-4 border`}>
                <div className="flex items-center gap-3 mb-2">
                  <Icon className={`h-5 w-5 ${metric.color}`} />
                  <span className="text-xs font-medium text-muted-foreground">{metric.label}</span>
                </div>
                <div className="text-3xl font-bold text-foreground mb-1">{metric.value}</div>
                <div className="text-xs text-muted-foreground">{metric.detail}</div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};