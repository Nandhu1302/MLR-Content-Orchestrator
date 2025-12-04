
import { Sparkles, Zap, CheckCircle } from "lucide-react";

const HowItWorksSlide = () => {
  return (
    <div className="w-full h-full bg-background p-16">
      <h2 className="text-5xl font-bold text-foreground mb-4">How It Works</h2>
      <p className="text-2xl text-muted-foreground mb-16">
        Intelligence to Content in 3 Steps
      </p>

      <div className="space-y-12">
        {/* Step 1 */}
        <div className="flex items-start gap-8">
          <div
            className="flex-shrink-0 w-32 h-32 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: "hsl(var(--theme-color-1))" }}
          >
            <Sparkles className="w-16 h-16 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span
                className="text-5xl font-bold"
                style={{ color: "hsl(var(--theme-color-1))" }}
              >
                1
              </span>
              <h3 className="text-3xl font-semibold text-foreground">Enrich</h3>
            </div>
            <p className="text-xl text-muted-foreground">
              Strategic analysts incorporate all 5 intelligence layers in the
              Theme Workshop, creating enriched strategic themes that inform all
              downstream content
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex items-start gap-8">
          <div
            className="flex-shrink-0 w-32 h-32 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: "hsl(var(--theme-color-2))" }}
          >
            <Zap className="w-16 h-16 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span
                className="text-5xl font-bold"
                style={{ color: "hsl(var(--theme-color-2))" }}
              >
                2
              </span>
              <h3 className="text-3xl font-semibold text-foreground">
                Generate
              </h3>
            </div>
            <p className="text-xl text-muted-foreground">
              AI synthesizes compliant content automatically, pulling from
              enriched themes and all intelligence layers for context-aware,
              brand-aligned messaging
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex items-start gap-8">
          <div
            className="flex-shrink-0 w-32 h-32 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: "hsl(var(--theme-color-3))" }}
          >
            <CheckCircle className="w-16 h-16 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span
                className="text-5xl font-bold"
                style={{ color: "hsl(var(--theme-color-3))" }}
              >
                3
              </span>
              <h3 className="text-3xl font-semibold text-foreground">
                Validate
              </h3>
            </div>
            <p className="text-xl text-muted-foreground">
              Pre-MLR Companion checks content against 200+ rules and regulatory
              requirements before review, ensuring 90% compliance accuracy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksSlide;
