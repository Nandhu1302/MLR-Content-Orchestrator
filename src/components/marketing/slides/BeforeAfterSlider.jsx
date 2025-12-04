import { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';

export const BeforeAfterSlider = () => {
  const [sliderValue, setSliderValue] = useState([50]);
  const clipPercentage = sliderValue[0];

  return (
    <section className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-8">
      <div className="w-full max-w-7xl space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold text-foreground">
            The Transformation
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Drag the slider to see how orchestration unifies fragmented systems
          </p>
        </div>

        <div className="relative">
          {/* Container for both states */}
          <div className="relative h-[600px] bg-card rounded-xl shadow-lg border border-border overflow-hidden">
            
            {/* BEFORE State (Bottom Layer - Full Width) */}
            <div className="absolute inset-0 p-8">
              <div className="h-full flex flex-col">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-destructive">
                    BEFORE: Fragmented Systems
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Disconnected tools, manual workflows, data silos
                  </p>
                </div>
                
                <div className="flex-1 grid grid-cols-3 gap-6">
                  {/* Disconnected systems */}
                  <Card className="border p-4 flex flex-col items-center justify-center space-y-2" style={{ backgroundColor: 'hsl(var(--destructive) / 0.1)', borderColor: 'hsl(var(--destructive) / 0.3)' }}>
                    <div className="text-3xl">📊</div>
                    <div className="text-sm font-semibold text-center">Strategy Tools</div>
                    <div className="text-xs" style={{ color: 'hsl(var(--destructive))' }}>Isolated</div>
                  </Card>
                  
                  <Card className="border p-4 flex flex-col items-center justify-center space-y-2" style={{ backgroundColor: 'hsl(var(--destructive) / 0.1)', borderColor: 'hsl(var(--destructive) / 0.3)' }}>
                    <div className="text-3xl">✍️</div>
                    <div className="text-sm font-semibold text-center">Content Creation</div>
                    <div className="text-xs" style={{ color: 'hsl(var(--destructive))' }}>Disconnected</div>
                  </Card>
                  
                  <Card className="border p-4 flex flex-col items-center justify-center space-y-2" style={{ backgroundColor: 'hsl(var(--destructive) / 0.1)', borderColor: 'hsl(var(--destructive) / 0.3)' }}>
                    <div className="text-3xl">🎨</div>
                    <div className="text-sm font-semibold text-center">Design Tools</div>
                    <div className="text-xs" style={{ color: 'hsl(var(--destructive))' }}>Siloed</div>
                  </Card>
                  
                  <Card className="border p-4 flex flex-col items-center justify-center space-y-2" style={{ backgroundColor: 'hsl(var(--destructive) / 0.1)', borderColor: 'hsl(var(--destructive) / 0.3)' }}>
                    <div className="text-3xl">✅</div>
                    <div className="text-sm font-semibold text-center">Compliance</div>
                    <div className="text-xs" style={{ color: 'hsl(var(--destructive))' }}>Manual Review</div>
                  </Card>
                  
                  <Card className="border p-4 flex flex-col items-center justify-center space-y-2" style={{ backgroundColor: 'hsl(var(--destructive) / 0.1)', borderColor: 'hsl(var(--destructive) / 0.3)' }}>
                    <div className="text-3xl">🌍</div>
                    <div className="text-sm font-semibold text-center">Localization</div>
                    <div className="text-xs" style={{ color: 'hsl(var(--destructive))' }}>Slow Handoffs</div>
                  </Card>
                  
                  <Card className="border p-4 flex flex-col items-center justify-center space-y-2" style={{ backgroundColor: 'hsl(var(--destructive) / 0.1)', borderColor: 'hsl(var(--destructive) / 0.3)' }}>
                    <div className="text-3xl">📈</div>
                    <div className="text-sm font-semibold text-center">Analytics</div>
                    <div className="text-xs" style={{ color: 'hsl(var(--destructive))' }}>Delayed Feedback</div>
                  </Card>
                </div>

                <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                  <div className="rounded-lg p-3" style={{ backgroundColor: 'hsl(var(--destructive) / 0.15)' }}>
                    <div className="text-2xl font-bold" style={{ color: 'hsl(var(--destructive))' }}>320hrs</div>
                    <div className="text-xs text-muted-foreground">Per Campaign</div>
                  </div>
                  <div className="rounded-lg p-3" style={{ backgroundColor: 'hsl(var(--destructive) / 0.15)' }}>
                    <div className="text-2xl font-bold" style={{ color: 'hsl(var(--destructive))' }}>$2.4M</div>
                    <div className="text-xs text-muted-foreground">Annual Waste</div>
                  </div>
                  <div className="rounded-lg p-3" style={{ backgroundColor: 'hsl(var(--destructive) / 0.15)' }}>
                    <div className="text-2xl font-bold" style={{ color: 'hsl(var(--destructive))' }}>85%</div>
                    <div className="text-xs text-muted-foreground">Manual Work</div>
                  </div>
                </div>
              </div>
            </div>

            {/* AFTER State (Top Layer - Clipped) */}
            <div 
              className="absolute inset-0 p-8"
              style={{
                clipPath: `inset(0 ${100 - clipPercentage}% 0 0)`
              }}
            >
              <div className="h-full flex flex-col">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold" style={{ color: 'hsl(var(--primary))' }}>
                    AFTER: Unified Orchestration
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Connected workflows, automated processes, unified data
                  </p>
                </div>
                
                <div className="flex-1 relative">
                  {/* Central orchestration hub */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Card className="border p-8 rounded-full w-48 h-48 flex flex-col items-center justify-center shadow-lg" style={{ backgroundColor: 'hsl(var(--theme-color-1) / 0.2)', borderColor: 'hsl(var(--theme-color-1))' }}>
                      <div className="text-4xl mb-2">🤖</div>
                      <div className="text-sm font-bold text-center">AI Orchestration</div>
                      <div className="text-xs text-center" style={{ color: 'hsl(var(--theme-color-1))' }}>Central Hub</div>
                    </Card>
                  </div>

                  {/* Connected systems in a circle */}
                  <div className="absolute inset-0">
                    {/* Top */}
                    <Card className="absolute top-0 left-1/2 -translate-x-1/2 border p-3 flex flex-col items-center space-y-1" style={{ backgroundColor: 'hsl(var(--primary) / 0.1)', borderColor: 'hsl(var(--primary) / 0.3)' }}>
                      <div className="text-2xl">📊</div>
                      <div className="text-xs font-semibold">Strategy</div>
                      <div className="text-[10px]" style={{ color: 'hsl(var(--primary))' }}>✓ Connected</div>
                    </Card>

                    {/* Top Right */}
                    <Card className="absolute top-16 right-8 border p-3 flex flex-col items-center space-y-1" style={{ backgroundColor: 'hsl(var(--primary) / 0.1)', borderColor: 'hsl(var(--primary) / 0.3)' }}>
                      <div className="text-2xl">✍️</div>
                      <div className="text-xs font-semibold">Content</div>
                      <div className="text-[10px]" style={{ color: 'hsl(var(--primary))' }}>✓ Connected</div>
                    </Card>

                    {/* Right */}
                    <Card className="absolute top-1/2 right-0 -translate-y-1/2 border p-3 flex flex-col items-center space-y-1" style={{ backgroundColor: 'hsl(var(--primary) / 0.1)', borderColor: 'hsl(var(--primary) / 0.3)' }}>
                      <div className="text-2xl">🎨</div>
                      <div className="text-xs font-semibold">Design</div>
                      <div className="text-[10px]" style={{ color: 'hsl(var(--primary))' }}>✓ Connected</div>
                    </Card>

                    {/* Bottom Right */}
                    <Card className="absolute bottom-16 right-8 border p-3 flex flex-col items-center space-y-1" style={{ backgroundColor: 'hsl(var(--primary) / 0.1)', borderColor: 'hsl(var(--primary) / 0.3)' }}>
                      <div className="text-2xl">✅</div>
                      <div className="text-xs font-semibold">Compliance</div>
                      <div className="text-[10px]" style={{ color: 'hsl(var(--primary))' }}>✓ Automated</div>
                    </Card>

                    {/* Bottom */}
                    <Card className="absolute bottom-0 left-1/2 -translate-x-1/2 border p-3 flex flex-col items-center space-y-1" style={{ backgroundColor: 'hsl(var(--primary) / 0.1)', borderColor: 'hsl(var(--primary) / 0.3)' }}>
                      <div className="text-2xl">🌍</div>
                      <div className="text-xs font-semibold">Localization</div>
                      <div className="text-[10px]" style={{ color: 'hsl(var(--primary))' }}>✓ Automated</div>
                    </Card>

                    {/* Bottom Left */}
                    <Card className="absolute bottom-16 left-8 border p-3 flex flex-col items-center space-y-1" style={{ backgroundColor: 'hsl(var(--primary) / 0.1)', borderColor: 'hsl(var(--primary) / 0.3)' }}>
                      <div className="text-2xl">📈</div>
                      <div className="text-xs font-semibold">Analytics</div>
                      <div className="text-[10px]" style={{ color: 'hsl(var(--primary))' }}>✓ Real-time</div>
                    </Card>

                    {/* Connection lines */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: -1 }}>
                      <line x1="50%" y1="50%" x2="50%" y2="15%" strokeWidth="2" strokeDasharray="4 4" style={{ stroke: 'hsl(var(--primary) / 0.3)' }} />
                      <line x1="50%" y1="50%" x2="85%" y2="25%" strokeWidth="2" strokeDasharray="4 4" style={{ stroke: 'hsl(var(--primary) / 0.3)' }} />
                      <line x1="50%" y1="50%" x2="92%" y2="50%" strokeWidth="2" strokeDasharray="4 4" style={{ stroke: 'hsl(var(--primary) / 0.3)' }} />
                      <line x1="50%" y1="50%" x2="85%" y2="75%" strokeWidth="2" strokeDasharray="4 4" style={{ stroke: 'hsl(var(--primary) / 0.3)' }} />
                      <line x1="50%" y1="50%" x2="50%" y2="85%" strokeWidth="2" strokeDasharray="4 4" style={{ stroke: 'hsl(var(--primary) / 0.3)' }} />
                      <line x1="50%" y1="50%" x2="15%" y2="75%" strokeWidth="2" strokeDasharray="4 4" style={{ stroke: 'hsl(var(--primary) / 0.3)' }} />
                    </svg>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                  <div className="rounded-lg p-3" style={{ backgroundColor: 'hsl(var(--primary) / 0.15)' }}>
                    <div className="text-2xl font-bold" style={{ color: 'hsl(var(--primary))' }}>48hrs</div>
                    <div className="text-xs text-muted-foreground">Per Campaign</div>
                  </div>
                  <div className="rounded-lg p-3" style={{ backgroundColor: 'hsl(var(--primary) / 0.15)' }}>
                    <div className="text-2xl font-bold" style={{ color: 'hsl(var(--primary))' }}>$360K</div>
                    <div className="text-xs text-muted-foreground">Annual Cost</div>
                  </div>
                  <div className="rounded-lg p-3" style={{ backgroundColor: 'hsl(var(--primary) / 0.15)' }}>
                    <div className="text-2xl font-bold" style={{ color: 'hsl(var(--primary))' }}>15%</div>
                    <div className="text-xs text-muted-foreground">Manual Work</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Slider handle indicator line */}
            <div 
              className="absolute top-0 bottom-0 w-1 bg-primary shadow-lg pointer-events-none z-10"
              style={{ left: `${clipPercentage}%` }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap shadow-lg">
                Drag to Compare
              </div>
            </div>
          </div>

          {/* Slider Control */}
          <div className="mt-8 max-w-2xl mx-auto">
            <Slider
              value={sliderValue}
              onValueChange={setSliderValue}
              max={100}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              <span>Current Fragmented State</span>
              <span>With Orchestration Platform</span>
            </div>
          </div>
        </div>

        {/* Key Improvements */}
        <div className="grid grid-cols-3 gap-6 mt-12">
          <Card className="p-6 text-center border" style={{ background: `linear-gradient(to bottom right, hsl(var(--theme-color-1) / 0.15), hsl(var(--theme-color-1) / 0.05))`, borderColor: 'hsl(var(--theme-color-1) / 0.3)' }}>
            <div className="text-3xl mb-3">⚡</div>
            <div className="text-2xl font-bold mb-2" style={{ color: 'hsl(var(--theme-color-1))' }}>85% Faster</div>
            <div className="text-sm text-muted-foreground">Campaign deployment time reduced from weeks to days</div>
          </Card>

          <Card className="p-6 text-center border" style={{ background: `linear-gradient(to bottom right, hsl(var(--theme-color-2) / 0.15), hsl(var(--theme-color-2) / 0.05))`, borderColor: 'hsl(var(--theme-color-2) / 0.3)' }}>
            <div className="text-3xl mb-3">💰</div>
            <div className="text-2xl font-bold mb-2" style={{ color: 'hsl(var(--theme-color-2))' }}>$2M+ Saved</div>
            <div className="text-sm text-muted-foreground">Annual operational cost reduction per organization</div>
          </Card>

          <Card className="p-6 text-center border" style={{ background: `linear-gradient(to bottom right, hsl(var(--theme-color-3) / 0.15), hsl(var(--theme-color-3) / 0.05))`, borderColor: 'hsl(var(--theme-color-3) / 0.3)' }}>
            <div className="text-3xl mb-3">🎯</div>
            <div className="text-2xl font-bold mb-2" style={{ color: 'hsl(var(--theme-color-3))' }}>70% Less Manual</div>
            <div className="text-sm text-muted-foreground">Automated workflows eliminate repetitive tasks</div>
          </Card>
        </div>
      </div>
    </section>
  );
};
