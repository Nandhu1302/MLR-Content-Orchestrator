
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link, CheckCircle } from 'lucide-react';

export const IntegrationLineageHub = ({ selectedAsset, onPhaseComplete, onBack }) => {
  const handleComplete = () => {
    onPhaseComplete({ phase: 'integration_complete' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Link className="h-6 w-6 text-primary" />
            Phase 7: DAM Integration & Metadata Lineage
          </h2>
          <p className="text-muted-foreground">
            Complete DAM integration with metadata lineage for {selectedAsset?.name}
          </p>
        </div>
        <Button variant="outline" onClick={onBack}>
          Back to Phase 6
        </Button>
      </div>

      {/* Body / Implementation Placeholder */}
      <Card>
        <CardContent className="p-6 space-y-3">
          <h3 className="text-lg font-semibold">Phase 7 Implementation</h3>
          <p className="text-muted-foreground">
            DAM Integration & Metadata Lineage interface will be implemented here.
          </p>
          <div className="flex justify-end">
            <Button onClick={handleComplete}>
              Complete Workflow
              <CheckCircle className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
