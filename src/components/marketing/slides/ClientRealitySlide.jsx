
import { clientPainPoints } from '@/utils/marketingDeckData';

const ClientRealitySlide = () => {
  return (
    <div className="w-full h-full bg-background p-16">
      <div className="mb-8">
        <h2 className="text-5xl font-bold mb-4" style={{ color: 'hsl(var(--primary))' }}>
          Your Reality: Current State
        </h2>
        <p className="text-2xl text-muted-foreground">What We Hear from Pharma Content Teams</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {clientPainPoints.map((pain, index) => (
          <div
            key={index}
            className="bg-card border border-border rounded-xl p-6 transition-colors"
            style={{
              borderColor: index === 0 ? 'hsl(var(--primary) / 0.3)' : 'hsl(var(--border))',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'hsl(var(--primary))';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor =
                index === 0 ? 'hsl(var(--primary) / 0.3)' : 'hsl(var(--border))';
            }}
          >
            <div className="mb-4">
              <h3 className="text-2xl font-bold mb-2" style={{ color: 'hsl(var(--primary))' }}>
                {pain.area}
              </h3>
              <p className="text-lg font-semibold text-destructive">{pain.cost}</p>
            </div>

            <ul className="space-y-2">
              {pain.symptoms.map((symptom, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-destructive mt-1 flex-shrink-0">●</span>
                  <span className="text-base text-muted-foreground">{symptom}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div
        className="mt-8 border rounded-xl p-6"
        style={{
          backgroundColor: 'hsl(var(--primary) / 0.05)',
          borderColor: 'hsl(var(--primary) / 0.2)',
        }}
      >
        <p className="text-xl text-foreground text-center">
          <span className="font-bold">Sound familiar?</span> These problems compound over time,
          creating a vicious cycle of delays, rework, and missed opportunities.
        </p>
      </div>
    </div>
  );
};

export default ClientRealitySlide;
