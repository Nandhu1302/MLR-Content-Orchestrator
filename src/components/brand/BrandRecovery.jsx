import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useBrand } from '@/contexts/BrandContext';
import { DebugUtils } from '@/utils/debugUtils';

export const BrandRecovery = ({ onRecovery }) => {
  const { selectedBrand, refreshBrand, clearBrand, isLoading } = useBrand();

  const handleClearLocalStorage = () => {
    DebugUtils.clearBrandData();
    DebugUtils.clearAllDrafts();
    clearBrand();
    onRecovery?.();
    window.location.reload();
  };

  const handleRefreshBrand = async () => {
    try {
      await refreshBrand();
      onRecovery?.();
    } catch (error) {
      console.error('Brand refresh failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-4">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Brand system recovery mode. The application detected an issue with brand loading.
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          {selectedBrand && (
            <p className="text-sm text-muted-foreground">
              Current brand: {selectedBrand.brand_name}
            </p>
          )}
          
          <div className="flex flex-col gap-2">
            <Button 
              onClick={handleRefreshBrand}
              disabled={isLoading}
              className="w-full"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh Brand Data
            </Button>
            
            <Button 
              onClick={handleClearLocalStorage}
              variant="outline"
              className="w-full"
            >
              Clear Cache & Restart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};