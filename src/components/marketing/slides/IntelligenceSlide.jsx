
import { Brain, Target, TrendingUp, Scale, Radio } from "lucide-react";

const intelligenceLayers = [
  { icon: Brain, name: "Brand Intelligence", description: "Positioning, messaging, tone of voice" },
  { icon: Target, name: "Competitive Intelligence", description: "Market moves, competitor claims" },
  { icon: TrendingUp, name: "Market Intelligence", description: "HCP/patient insights, trends" },
  { icon: Scale, name: "Regulatory Intelligence", description: "Compliance updates, requirements" },
  { icon: Radio, name: "Public Sentiment", description: "Social listening, perception" },
];

const IntelligenceSlide = () => {
  return (
    <div className="w-full h-full bg-gradient-to-br from-background to-muted p-16">
      {/* Header */}
      <h2 className="text-5xl font-bold text-foreground mb-4">The Differentiator</h2>
      <p className="text-2xl text-primary font-semibold mb-12">5-Layer Intelligence Engine</p>

      {/* Intelligence Layers */}
      <div className="grid grid-cols-5 gap-6 mb-12">
        {intelligenceLayers.map((layer, index) => (
          <div key={layer.name} className="flex flex-col items-center text-center">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center mb-4 shadow-lg"
              style={{
                backgroundColor: `hsl(var(--theme-color-${index + 1}))`,
              }}
            >
              <layer.icon className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">{layer.name}</h3>
            <p className="text-sm text-muted-foreground">{layer.description}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="bg-card border-2 border-primary rounded-lg p-8 text-center">
        <p className="text-2xl text-foreground font-semibold">
          Every piece of content is <span className="text-primary">strategically informed</span> in real-time
        </p>
        <p className="text-lg text-muted-foreground mt-3">
          What traditional DAM, CMS, and translation platforms can't deliver
        </p>
      </div>
    </div>
  );
};

export default IntelligenceSlide;
