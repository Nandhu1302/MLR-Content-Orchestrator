
import { useMarketingDeck } from '@/contexts/MarketingDeckContext';

const TitleSlide = () => {
  const { slideData } = useMarketingDeck();

  return (
    <div className="w-full h-full bg-gradient-to-br from-primary/5 via-background to-primary/10 flex items-center justify-center p-12">
      <div className="text-center space-y-6 w-full px-16">
        {/* Heading */}
        <h1 className="text-7xl font-bold text-foreground mb-4">
          {slideData.title.heading}
        </h1>

        {/* Subheading */}
        <p className="text-3xl text-muted-foreground mb-8">
          {slideData.title.subheading}
        </p>

        {/* Workflow Steps */}
        <div className="flex items-center justify-center gap-4 text-xl text-muted-foreground mb-12 flex-wrap">
          <span className="px-6 py-2 bg-primary/10 rounded-lg">Strategy</span>
          <span className="text-primary">→</span>
          <span className="px-6 py-2 bg-primary/10 rounded-lg">Content</span>
          <span className="text-primary">→</span>
          <span className="px-6 py-2 bg-primary/10 rounded-lg">Compliance</span>
          <span className="text-primary">→</span>
          <span className="px-6 py-2 bg-primary/10 rounded-lg">Global</span>
        </div>

        {/* Value Section */}
        <div className="bg-primary/10 border-2 border-primary/30 rounded-xl p-8 max-w-4xl mx-auto">
          <p className="text-4xl font-bold text-primary mb-2">
            {slideData.title.valueAmount}
          </p>
          <p className="text-xl text-muted-foreground">
            Per Brand | Validated by 3 Pharma Clients
          </p>
        </div>

        {/* Tagline */}
        <p className="text-lg text-muted-foreground mt-12">
          {slideData.title.tagline}
        </p>

        {/* Confidential Note */}
        <p className="text-sm text-muted-foreground/60">
          {slideData.title.confidentialNote}
        </p>
      </div>
    </div>
  );
};

export default TitleSlide;
