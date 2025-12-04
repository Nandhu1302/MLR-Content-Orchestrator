
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, ArrowRight } from 'lucide-react';

export const DAMHandoffGenerator = ({ selectedAsset, onPhaseComplete, onBack }) => {
  const handleContinue = () => {
    onPhaseComplete({ phase: 'dam_handoff' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Package className="h-6 w-6 text-primary" />
            Phase 6: DAM Ready Handoff Generation
          </h2>
          <p className="text-muted-foreground">
            Complete metadata DAM handoff generation for {selectedAsset?.name}
          </p>
        </div>
        <Button variant="outline" onClick={onBack}>
          Back to Phase 5
        </Button>
      </div>

      {/* Body / Implementation Placeholder */}
      <Card>
        <CardContent className="p-6 space-y-3">
          <h3 className="text-lg font-semibold">Phase 6 Implementation</h3>
          <p className="text-muted-foreground">
            DAM Ready Handoff Generation interface will be implemented here.
          </p>
          <div className="flex justify-end">
            <Button onClick={handleContinue}>
              Continue to Phase 7
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
