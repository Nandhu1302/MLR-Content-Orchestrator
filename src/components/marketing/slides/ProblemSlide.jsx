
import { AlertTriangle } from "lucide-react";

const ProblemSlide = () => {
  return (
    <div className="w-full h-full bg-background p-16">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <AlertTriangle className="w-12 h-12 text-destructive" />
        <h2 className="text-5xl font-bold text-foreground">The $2B Problem</h2>
      </div>

      <p className="text-2xl text-muted-foreground mb-12">
        Pharmaceutical companies waste over $2 billion annually on:
      </p>

      {/* Problem Items */}
      <div className="space-y-8">
        {/* Fragmented Content Operations */}
        <div className="flex items-start gap-6">
          <div className="w-32 h-32 bg-destructive/10 rounded-lg flex items-center justify-center">
            <span className="text-4xl font-bold text-destructive">60%</span>
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-semibold text-foreground mb-2">
              Fragmented Content Operations
            </h3>
            <p className="text-xl text-muted-foreground">
              60% rework rate due to disconnected systems and workflows
            </p>
          </div>
        </div>

        {/* Compliance Failures */}
        <div className="flex items-start gap-6">
          <div className="w-32 h-32 bg-destructive/10 rounded-lg flex items-center justify-center">
            <span className="text-3xl font-bold text-destructive">$10M+</span>
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-semibold text-foreground mb-2">
              Compliance Failures
            </h3>
            <p className="text-xl text-muted-foreground">
              $10M+ per violation with increasing regulatory scrutiny
            </p>
          </div>
        </div>

        {/* Manual Localization */}
        <div className="flex items-start gap-6">
          <div className="w-32 h-32 bg-destructive/10 rounded-lg flex items-center justify-center">
            <span className="text-4xl font-bold text-destructive">80%</span>
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-semibold text-foreground mb-2">
              Manual Localization
            </h3>
            <p className="text-xl text-muted-foreground">
              80% of time spent on repetitive, manual translation tasks
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemSlide;
