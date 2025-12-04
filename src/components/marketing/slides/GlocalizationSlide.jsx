
import { Globe, Languages, Scale, Clock } from "lucide-react";

const GlocalizationSlide = () => {
  return (
    <div className="w-full h-full bg-gradient-to-br from-background to-muted p-16">
      <div className="flex items-center gap-4 mb-12">
        <Globe className="w-14 h-14 text-primary" />
        <div>
          <h2 className="text-5xl font-bold text-foreground">Glocalization</h2>
          <p className="text-xl text-muted-foreground">
            Multi-Market Adaptation in Minutes, Not Weeks
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-12">
        <div className="space-y-8">
          {/* AI Translation Engine */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Languages
                className="w-10 h-10"
                style={{ color: "hsl(var(--theme-color-1))" }}
              />
              <h3 className="text-2xl font-semibold text-foreground">
                AI Translation Engine
              </h3>
            </div>
            <p className="text-lg text-muted-foreground mb-4">
              Pharmaceutical-grade translation with specialized medical
              terminology and context preservation
            </p>
            <div className="flex items-center gap-2 text-primary">
              <Clock className="w-5 h-5" />
              <span className="font-semibold">50+ markets supported</span>
            </div>
          </div>

          {/* Cultural & Regulatory Adaptation */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Scale
                className="w-10 h-10"
                style={{ color: "hsl(var(--theme-color-2))" }}
              />
              <h3 className="text-2xl font-semibold text-foreground">
                Cultural & Regulatory Adaptation
              </h3>
            </div>
            <p className="text-lg text-muted-foreground mb-4">
              Automatic recommendations for cultural sensitivities and
              market-specific regulatory requirements
            </p>
            <div className="flex items-center gap-2 text-primary">
              <CheckIcon />
              <span className="font-semibold">90% compliance accuracy</span>
            </div>
          </div>
        </div>

        {/* Global Reach Section */}
        <div className="bg-card border-2 border-primary rounded-lg p-8 flex flex-col justify-center">
          <h3 className="text-3xl font-bold text-foreground mb-6 text-center">
            Global Reach
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-lg text-muted-foreground">
                Traditional Localization
              </span>
              <span className="text-2xl font-bold text-destructive">8 weeks</span>
            </div>
            <div className="w-full h-1 bg-muted rounded-full">
              <div className="w-full h-full bg-destructive rounded-full"></div>
            </div>
            <div className="flex items-center justify-between mt-8">
              <span className="text-lg text-muted-foreground">
                Content Orchestrator
              </span>
              <span className="text-2xl font-bold text-success">3 days</span>
            </div>
            <div className="w-full h-1 bg-muted rounded-full">
              <div className="w-1/6 h-full bg-success rounded-full"></div>
            </div>
          </div>
          <p className="text-center mt-8 text-xl font-semibold text-primary">
            95% time reduction
          </p>
        </div>
      </div>
    </div>
  );
};

const CheckIcon = () => (
  <svg className="w-5 h-5 text-success" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
      clipRule="evenodd"
    />
  </svg>
);

export default GlocalizationSlide;
