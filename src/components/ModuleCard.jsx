import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import PropTypes from "prop-types";

const colorClasses = {
  blue: "border-l-blue-500 bg-blue-50/50",
  green: "border-l-green-500 bg-green-50/50",
  purple: "border-l-purple-500 bg-purple-50/50",
  orange: "border-l-orange-500 bg-orange-50/50",
  red: "border-l-red-500 bg-red-50/50",
  cyan: "border-l-cyan-500 bg-cyan-50/50",
};

const iconColorClasses = {
  blue: "text-blue-600",
  green: "text-green-600",
  purple: "text-purple-600",
  orange: "text-orange-600",
  red: "text-red-600",
  cyan: "text-cyan-600",
};

const ModuleCard = ({ title, description, icon: Icon, status, metrics, color, onClick }) => {
  return (
    <Card
      className={`relative border-l-4 ${colorClasses[color]} hover:shadow-lg transition-all duration-200 cursor-pointer group`}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-white/80 ${iconColorClasses[color]}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">{title}</CardTitle>
              <Badge variant="secondary" className="mt-1 text-xs">
                {status}
              </Badge>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>

        <div className="grid grid-cols-2 gap-4">
          {metrics.map((metric, index) => (
            <div key={index} className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {metric.label}
              </p>
              <div className="flex items-center gap-2">
                <p className="text-lg font-semibold">{metric.value}</p>
                {metric.trend && (
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-full ${
                      metric.trend.startsWith('+')
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {metric.trend}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

ModuleCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  status: PropTypes.string.isRequired,
  metrics: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      trend: PropTypes.string,
    })
  ).isRequired,
  color: PropTypes.oneOf(["blue", "green", "purple", "orange", "red", "cyan"]).isRequired,
  onClick: PropTypes.func,
};

export default ModuleCard;
