
import { ArrowRight, Lightbulb, FileText, Palette, Shield, Globe } from "lucide-react";

const modules = [
  { icon: Lightbulb, name: "Initiative Hub" },
  { icon: FileText, name: "Strategy & Insights" },
  { icon: FileText, name: "Content Studio" },
  { icon: Palette, name: "Design Studio" },
  { icon: Shield, name: "Pre-MLR Companion" },
  { icon: Globe, name: "Glocalization" },
];

const SolutionSlide = () => {
  return (
    <div className="w-full h-full bg-background p-16">
      {/* Header */}
      <h2 className="text-5xl font-bold text-foreground mb-4">Our Solution</h2>
      <p className="text-2xl text-muted-foreground mb-12">
        Single Platform, End-to-End Workflow
      </p>

      {/* Modules Flow */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        {modules.map((module, index) => (
          <div key={module.name} className="flex items-center gap-4">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-card border-2 border-border rounded-lg flex items-center justify-center mb-3">
                <module.icon
                  className="w-12 h-12"
                  style={{
                    color: `hsl(var(--theme-color-${index + 1}))`,
                  }}
                />
              </div>
              <p className="text-sm font-medium text-center text-foreground">
                {module.name}
              </p>
            </div>
            {index < modules.length - 1 && (
              <ArrowRight className="w-6 h-6 text-muted-foreground flex-shrink-0" />
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-16 bg-primary/10 border border-primary/20 rounded-lg p-6">
        <p className="text-xl text-foreground text-center">
          <span className="font-bold">6 integrated modules</span> working together to transform pharmaceutical marketing from{" "}
          <span className="text-primary font-semibold">strategy to execution</span>
        </p>
      </div>
    </div>
  );
};

export default SolutionSlide;
