
import { competitiveFeatures } from '@/utils/marketingDeckData';

const CompetitiveDetailSlide = () => {
  return (
    <div className="w-full h-full bg-background p-16">
      <div className="mb-8">
        <h2 className="text-5xl font-bold text-foreground mb-4">Competitive Comparison</h2>
        <p className="text-2xl text-muted-foreground">
          Why Content Orchestrator vs. Fragmented Approach
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden mb-6">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left p-4 font-semibold text-foreground">Feature</th>
              <th className="text-center p-4 font-semibold text-primary bg-primary/5">
                Content Orchestrator
              </th>
              <th className="text-center p-4 font-semibold text-muted-foreground">Veeva Vault</th>
              <th className="text-center p-4 font-semibold text-muted-foreground">
                Translation Platforms
              </th>
              <th className="text-center p-4 font-semibold text-muted-foreground">DAM Systems</th>
            </tr>
          </thead>
          <tbody>
            {competitiveFeatures.slice(0, 8).map((feature, index) => (
              <tr
                key={index}
                className="border-b border-border hover:bg-muted/30 transition-colors"
              >
                <td className="p-4 text-sm text-foreground">{feature.feature}</td>
                <td className="p-4 text-center font-semibold text-primary bg-primary/5">
                  {feature.us}
                </td>
                <td className="p-4 text-center text-sm text-muted-foreground">{feature.veeva}</td>
                <td className="p-4 text-center text-sm text-muted-foreground">
                  {feature.translation}
                </td>
                <td className="p-4 text-center text-sm text-muted-foreground">{feature.dam}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-primary/5 border-2 border-primary/30 rounded-lg p-4">
          <p className="text-xl font-bold text-primary mb-2">End-to-End</p>
          <p className="text-sm text-muted-foreground">All workflow stages in one platform</p>
        </div>
        <div className="bg-primary/5 border-2 border-primary/30 rounded-lg p-4">
          <p className="text-xl font-bold text-primary mb-2">Purpose-Built</p>
          <p className="text-sm text-muted-foreground">Designed for pharma content operations</p>
        </div>
        <div className="bg-primary/5 border-2 border-primary/30 rounded-lg p-4">
          <p className="text-xl font-bold text-primary mb-2">16 Weeks</p>
          <p className="text-sm text-muted-foreground">vs 6-9 months for stitched solutions</p>
        </div>
      </div>
    </div>
  );
};

export default CompetitiveDetailSlide;
