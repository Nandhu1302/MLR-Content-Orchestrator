import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Building2, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { useBrand } from '@/contexts/BrandContext';
import BrandSelector from './BrandSelector';

const BrandIndicator = () => {
  const [showSelector, setShowSelector] = useState(false);
  const { selectedBrand, needsUpdate, lastUpdated, refreshBrand, isLoading } = useBrand();

  const getStatusInfo = () => {
    if (!selectedBrand) {
      return {
        icon: Building2,
        text: 'No Brand',
        variant: 'secondary',
        tooltip: 'Select a brand to load guidelines and configurations'
      };
    }

    if (needsUpdate) {
      return {
        icon: AlertTriangle,
        text: `${selectedBrand.brand_name} (Update Needed)`,
        variant: 'destructive',
        tooltip: 'Brand guidelines haven\'t been reviewed in over 3 months'
      };
    }

    return {
      icon: CheckCircle,
      text: selectedBrand.brand_name,
      variant: 'default',
      tooltip: `Brand guidelines last updated: ${lastUpdated?.toLocaleDateString()}`
    };
  };

  const status = getStatusInfo();
  const StatusIcon = status.icon;

  return (
    <>
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSelector(true)}
              className="flex items-center gap-2 h-8"
            >
              <StatusIcon className="h-4 w-4" />
              <Badge variant={status.variant} className="text-xs">
                {status.text}
              </Badge>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{selectedBrand ? 'Click to switch brands' : status.tooltip}</p>
          </TooltipContent>
        </Tooltip>

        {selectedBrand && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={refreshBrand}
                disabled={isLoading}
                className="h-8 w-8 p-0"
              >
                <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Refresh brand configuration</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>

      <BrandSelector 
        open={showSelector} 
        onOpenChange={setShowSelector} 
      />
    </>
  );
};

export default BrandIndicator;