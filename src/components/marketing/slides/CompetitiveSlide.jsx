
import { X, Check } from "lucide-react";

const CompetitiveSlide = () => {
  return (
    <div className="w-full h-full bg-gradient-to-br from-background to-muted p-16">
      <h2 className="text-5xl font-bold text-foreground mb-4">Competitive Positioning</h2>
      <p className="text-2xl text-muted-foreground mb-12">Why Traditional Solutions Fall Short</p>

      <div className="grid grid-cols-4 gap-6">
        {/* Traditional DAM */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-xl font-semibold text-foreground mb-6 text-center">Traditional DAM</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-success flex-shrink-0 mt-1" />
              <span className="text-sm text-muted-foreground">Asset storage</span>
            </div>
            <div className="flex items-start gap-3">
              <X className="w-5 h-5 text-destructive flex-shrink-0 mt-1" />
              <span className="text-sm text-muted-foreground">No intelligence layers</span>
            </div>
            <div className="flex items-start gap-3">
              <X className="w-5 h-5 text-destructive flex-shrink-0 mt-1" />
              <span className="text-sm text-muted-foreground">No content generation</span>
            </div>
            <div className="flex items-start gap-3">
              <X className="w-5 h-5 text-destructive flex-shrink-0 mt-1" />
              <span className="text-sm text-muted-foreground">Limited compliance</span>
            </div>
          </div>
        </div>

        {/* Content Platforms */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-xl font-semibold text-foreground mb-6 text-center">Content Platforms</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-success flex-shrink-0 mt-1" />
              <span className="text-sm text-muted-foreground">Content creation</span>
            </div>
            <div className="flex items-start gap-3">
              <X className="w-5 h-5 text-destructive flex-shrink-0 mt-1" />
              <span className="text-sm text-muted-foreground">Consumer-focused</span>
            </div>
            <div className="flex items-start gap-3">
              <X className="w-5 h-5 text-destructive flex-shrink-0 mt-1" />
              <span className="text-sm text-muted-foreground">Not pharma-compliant</span>
            </div>
            <div className="flex items-start gap-3">
              <X className="w-5 h-5 text-destructive flex-shrink-0 mt-1" />
              <span className="text-sm text-muted-foreground">No regulatory intelligence</span>
            </div>
          </div>
        </div>

        {/* Translation Services */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-xl font-semibold text-foreground mb-6 text-center">Translation Services</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-success flex-shrink-0 mt-1" />
              <span className="text-sm text-muted-foreground">Localization</span>
            </div>
            <div className="flex items-start gap-3">
              <X className="w-5 h-5 text-destructive flex-shrink-0 mt-1" />
              <span className="text-sm text-muted-foreground">Manual processes</span>
            </div>
            <div className="flex items-start gap-3">
              <X className="w-5 h-5 text-destructive flex-shrink-0 mt-1" />
              <span className="text-sm text-muted-foreground">Not integrated</span>
            </div>
            <div className="flex items-start gap-3">
              <X className="w-5 h-5 text-destructive flex-shrink-0 mt-1" />
              <span className="text-sm text-muted-foreground">Slow turnaround</span>
            </div>
          </div>
        </div>

        {/* Content Orchestrator */}
        <div className="bg-gradient-to-br from-primary/20 to-primary/10 border-2 border-primary rounded-lg p-6">
          <h3 className="text-xl font-semibold text-foreground mb-6 text-center">Content Orchestrator</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-success flex-shrink-0 mt-1" />
              <span className="text-sm font-semibold text-foreground">5-layer intelligence</span>
            </div>
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-success flex-shrink-0 mt-1" />
              <span className="text-sm font-semibold text-foreground">AI-powered generation</span>
            </div>
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-success flex-shrink-0 mt-1" />
              <span className="text-sm font-semibold text-foreground">Pharma-native compliance</span>
            </div>
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-success flex-shrink-0 mt-1" />
              <span className="text-sm font-semibold text-foreground">End-to-end workflow</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 bg-primary/10 border border-primary/20 rounded-lg p-6 text-center">
        <p className="text-2xl font-semibold text-foreground">
          The only platform built specifically for{" "}
          <span className="text-primary">pharmaceutical marketing excellence</span>
        </p>
      </div>
    </div>
  );
};

export default CompetitiveSlide;
