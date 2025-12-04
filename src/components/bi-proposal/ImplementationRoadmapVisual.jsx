import { implementationRoadmap } from "@/utils/biProposalData";
import { CheckCircle2 } from "lucide-react";

export const ImplementationRoadmapVisual = () => {
  return (
    <div className="space-y-6">
      {implementationRoadmap.map((phase, index) => (
        <div key={index} className="relative">
          {/* Timeline Line */}
          {index < implementationRoadmap.length - 1 && (
            <div className="absolute left-6 top-20 bottom-0 w-1 bg-primary/30" />
          )}

          <div className="bg-card border-2 border-primary/30 rounded-xl p-8 hover:border-primary transition-colors relative">
            <div className="flex items-start gap-6">
              {/* Phase Number */}
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-foreground">
                  {index + 1}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-2xl font-bold text-foreground">
                    {phase.name}
                  </h4>
                  <span className="text-xl font-bold text-primary">
                    {phase.duration}
                  </span>
                </div>

                <div className="space-y-2">
                  <p className="text-lg font-semibold text-muted-foreground mb-3">
                    Deliverables:
                  </p>
                  <ul className="space-y-2">
                    {phase.deliverables.map((deliverable, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" />
                        <span className="text-base text-foreground">
                          {deliverable}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Milestone Markers */}
          {index === 1 && (
            <div className="absolute -right-8 top-1/2 -translate-y-1/2">
              <div className="bg-emerald-500 text-white px-6 py-3 rounded-lg shadow-lg">
                <p className="text-sm font-bold whitespace-nowrap">
                  🎯 First Value
                </p>
              </div>
            </div>
          )}
          {index === 3 && (
            <div className="absolute -right-8 top-1/2 -translate-y-1/2">
              <div className="bg-primary text-primary-foreground px-6 py-3 rounded-lg shadow-lg">
                <p className="text-sm font-bold whitespace-nowrap">
                  🚀 Full Production
                </p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
