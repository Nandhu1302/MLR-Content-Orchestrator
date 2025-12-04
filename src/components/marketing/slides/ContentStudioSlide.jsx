
import { FileText, Sparkles, Shield, TrendingUp } from "lucide-react";

const ContentStudioSlide = () => {
  return (
    <div className="w-full h-full bg-background p-16">
      <div className="flex items-center gap-4 mb-12">
        <FileText className="w-14 h-14 text-primary" />
        <div>
          <h2 className="text-5xl font-bold text-foreground">Content Studio</h2>
          <p className="text-xl text-muted-foreground">
            AI-Powered Generation with Strategic Context
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-8 h-8" style={{ color: "hsl(var(--theme-color-1))" }} />
              <h3 className="text-2xl font-semibold text-foreground">Intelligent Auto-Population</h3>
            </div>
            <p className="text-lg text-muted-foreground">
              Automatically populates content from enriched strategic themes with all 5 intelligence layers embedded
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-8 h-8" style={{ color: "hsl(var(--theme-color-2))" }} />
              <h3 className="text-2xl font-semibold text-foreground">Performance Predictions</h3>
            </div>
            <p className="text-lg text-muted-foreground">
              AI analyzes multiple variations and predicts performance based on historical data and market intelligence
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-8 h-8" style={{ color: "hsl(var(--theme-color-3))" }} />
              <h3 className="text-2xl font-semibold text-foreground">Built-in Guardrails</h3>
            </div>
            <p className="text-lg text-muted-foreground">
              Real-time compliance checking against brand guidelines and regulatory requirements as you create
            </p>
          </div>
        </div>

        <div className="bg-muted rounded-lg p-8 flex flex-col justify-center">
          <div className="space-y-4">
            <div className="bg-card border border-primary/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "hsl(var(--theme-color-1))" }}></div>
                <span className="text-sm font-medium text-foreground">Brand Intelligence</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "hsl(var(--theme-color-2))" }}></div>
                <span className="text-sm font-medium text-foreground">Competitive Intelligence</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "hsl(var(--theme-color-3))" }}></div>
                <span className="text-sm font-medium text-foreground">Market Intelligence</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "hsl(var(--theme-color-4))" }}></div>
                <span className="text-sm font-medium text-foreground">Regulatory Intelligence</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "hsl(var(--theme-color-5))" }}></div>
                <span className="text-sm font-medium text-foreground">Public Sentiment</span>
              </div>
            </div>
            <p className="text-center text-lg font-semibold text-primary">
              All intelligence layers active in every piece of content
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentStudioSlide;
