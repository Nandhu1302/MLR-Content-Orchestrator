
import { demoProofPoints } from '@/utils/marketingDeckData';
import { CheckCircle2, QrCode } from 'lucide-react';

const DemoProofSlide = () => {
  return (
    <div className="w-full h-full bg-background p-16">
      <div className="mb-8 text-center">
        <h2 className="text-5xl font-bold text-foreground mb-4">Demo Proof Points</h2>
        <p className="text-2xl text-muted-foreground">
          What's Working Today - Live Platform Metrics
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        {demoProofPoints.map((point, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/30 rounded-xl p-8"
          >
            <div className="flex items-start gap-4">
              <CheckCircle2 className="w-10 h-10 text-primary flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xl font-bold text-foreground mb-2">{point.title}</p>
                <p className="text-5xl font-bold text-primary mb-3">{point.value}</p>
                <p className="text-base text-muted-foreground">{point.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-xl font-bold text-foreground mb-4">Content Types Tested</h3>
          <div className="space-y-2">
            {['HCP Emails', 'Patient Brochures', 'Sales Aids', 'Social Posts', 'Regulatory Submissions'].map((type, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span className="text-base text-foreground">{type}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-xl font-bold text-foreground mb-4">Languages Supported</h3>
          <p className="text-base text-muted-foreground mb-4">15 languages including:</p>
          <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
            <span>🇩🇪 German</span>
            <span>🇫🇷 French</span>
            <span>🇪🇸 Spanish</span>
            <span>🇮🇹 Italian</span>
            <span>🇯🇵 Japanese</span>
            <span>🇨🇳 Chinese</span>
          </div>
          <div className="mt-6 pt-6 border-t border-border flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground mb-1">See It Yourself</p>
              <p className="text-xs text-muted-foreground">Book a demo →</p>
            </div>
            <QrCode className="w-16 h-16 text-muted-foreground/30" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoProofSlide;
