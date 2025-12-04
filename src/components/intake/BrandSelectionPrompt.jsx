
import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Building2, AlertCircle } from 'lucide-react';
import BrandSelector from '@/components/brand/BrandSelector';

const BrandSelectionPrompt = ({ open, onOpenChange, onProceedWithoutBrand }) => {
  const [showBrandSelector, setShowBrandSelector] = useState(false);

  const handleSelectBrand = () => {
    setShowBrandSelector(true);
  };

  const handleBrandSelected = () => {
    setShowBrandSelector(false);
    onOpenChange(false);
  };

  return (
    <>
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-warning" />
              Brand Configuration Required
            </AlertDialogTitle>
            <AlertDialogDescription>
              You haven't selected a brand configuration yet. Brand guidelines help ensure content consistency and compliance.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-col gap-2">
            <Button onClick={handleSelectBrand} className="w-full">
              <Building2 className="h-4 w-4 mr-2" />
              Select Brand Configuration
            </Button>
            <Button
              variant="outline"
              onClick={onProceedWithoutBrand}
              className="w-full"
            >
              Continue Without Brand Setup
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <BrandSelector
        open={showBrandSelector}
        onOpenChange={(open) => {
          setShowBrandSelector(open);
          if (!open) handleBrandSelected();
        }}
      />
    </>
  );
};

export default BrandSelectionPrompt;
