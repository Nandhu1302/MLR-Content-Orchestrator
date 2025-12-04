
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const colorClasses = {
  blue: "border-l-blue-500 bg-blue-50/50",
  green: "border-l-green-500 bg-green-50/50",
  purple: "border-l-purple-500 bg-purple-50/50",
  orange: "border-l-orange-500 bg-orange-50/50",
  red: "border-l-red-500 bg-red-50/50",
  cyan: "border-l-cyan-500 bg-cyan-50/50"
};

const iconColorClasses = {
  blue: "text-blue-600",
  green: "text-green-600",
  purple: "text-purple-600",
  orange: "text-orange-600",
  red: "text-red-600",
  cyan: "text-cyan-600"
};

const ModuleCard = ({ title, description, icon: Icon, status, metrics, color, onClick }) => {
  return (
    <Card className={`border-l-4 ${colorClasses[color]} p-4`}>
      <CardHeader className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className={`h-6 w-6 ${iconColorClasses[color]}`} />
          <CardTitle>{title}</CardTitle>
        </div>
        <Badge>{status}</Badge>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {metrics.map((metric, index) => (
            <div key={index} className="flex flex-col">
              <span className="text-xs text-muted-foreground">{metric.label}</span>
              <span className="text-lg font-semibold">{metric.value}</span>
              {metric.trend && <span className="text-xs text-primary">{metric.trend}</span>}
            </div>
          ))}
        </div>
        {onClick && (
          <Button onClick={onClick} className="mt-4 flex items-center gap-2">
            View Details <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ModuleCard;
