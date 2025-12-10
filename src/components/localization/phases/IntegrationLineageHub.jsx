import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link, CheckCircle } from 'lucide-react';

/**
 * @typedef {Object} IntegrationLineageHubProps
 * @property {any} selectedAsset
 * @property {(data: any) => void} onPhaseComplete
 * @property {() => void} onBack
 */

/**
 * IntegrationLineageHub (JSX)
 * Converted from TSX to JSX without changing context or logic.
 * @param {IntegrationLineageHubProps} props
 */
export const IntegrationLineageHub = ({
  selectedAsset,
  onPhaseComplete,
  onBack,
}) => {
  return (
    <div className="space-y-6">
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

      <Card>
        <CardContent className="p-6">
          <div className="text-center py-12">
            <Link className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Phase 7 Implementation</h3>
            <p className="text-muted-foreground mb-4">
              DAM Integration & Metadata Lineage interface will be implemented here
            </p>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={onBack}>
                Back to Phase 6
              </Button>
              <Button onClick={() => onPhaseComplete({ phase: 'integration_complete' })}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Complete Workflow
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
