import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, ArrowRight } from 'lucide-react';

// Removed interface DAMHandoffGeneratorProps

export const DAMHandoffGenerator = ({ // Removed : React.FC<DAMHandoffGeneratorProps>
  selectedAsset,
  onPhaseComplete,
  onBack
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Package className="h-6 w-6 text-primary" />
            Phase 6: DAM Ready Handoff Generation
          </h2>
          <p className="text-muted-foreground">
            Complete metadata DAM handoff generation for {selectedAsset.name}
          </p>
        </div>
        <Button variant="outline" onClick={onBack}>
          Back to Phase 5
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="text-center py-12">
            <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Phase 6 Implementation</h3>
            <p className="text-muted-foreground mb-4">
              DAM Ready Handoff Generation interface will be implemented here
            </p>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={onBack}>
                Back to Phase 5
              </Button>
              <Button onClick={() => onPhaseComplete({ phase: 'dam_handoff' })}>
                Continue to Phase 7
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; // FIX: Added closing curly brace