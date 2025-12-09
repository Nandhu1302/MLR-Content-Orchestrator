import React from 'react'; // Added explicit React import for older setups
import { integrationSystems } from '@/utils/marketingDeckData';
import { Database, Share2 } from 'lucide-react';

const IntegrationSlide = () => {
  return (
    <div className="w-full h-full bg-background p-16">
      <div className="mb-8">
        <h2 className="text-5xl font-bold text-foreground mb-4">Integration with Your Systems</h2>
        <p className="text-2xl text-muted-foreground">Works With Your Existing Technology Stack</p>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-8">
        {/* Upstream Systems */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-8 h-8" style={{ color: 'hsl(var(--theme-color-1))' }} />
            <h3 className="text-2xl font-bold text-foreground">Upstream Systems (Data In)</h3>
          </div>
          <div className="space-y-3">
            {/* The integrationSystems object is expected to be imported from '@/utils/marketingDeckData' */}
            {integrationSystems.upstream.map((system, index) => (
              <div key={index} className="bg-card border border-border rounded-lg p-4 hover:border-primary transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-lg font-semibold text-foreground">{system.system}</p>
                  <span className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full">{system.status}</span>
                </div>
                <p className="text-sm text-muted-foreground">{system.purpose}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Downstream Systems */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Share2 className="w-8 h-8" style={{ color: 'hsl(var(--theme-color-2))' }} />
            <h3 className="text-2xl font-bold text-foreground">Downstream Systems (Output)</h3>
          </div>
          <div className="space-y-3">
            {integrationSystems.downstream.map((system, index) => (
              <div key={index} className="bg-card border border-border rounded-lg p-4 hover:border-primary transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-lg font-semibold text-foreground">{system.system}</p>
                  <span className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full">{system.status}</span>
                </div>
                <p className="text-sm text-muted-foreground">{system.purpose}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Integration Capabilities */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-primary mb-1">API-First</p>
          <p className="text-sm text-muted-foreground">RESTful & webhook support</p>
        </div>
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-primary mb-1">Pre-Built</p>
          <p className="text-sm text-muted-foreground">Connectors for Veeva & major DAMs</p>
        </div>
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-primary mb-1">SSO Ready</p>
          <p className="text-sm text-muted-foreground">SAML 2.0 integration</p>
        </div>
      </div>
    </div>
  );
};

export default IntegrationSlide;