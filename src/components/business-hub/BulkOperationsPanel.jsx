import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Package, Printer } from 'lucide-react';
import { BulkDownloadService } from '@/utils/bulkDownloadService';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';

export const BulkOperationsPanel = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleDownloadAll = async () => {
    setIsDownloading(true);
    setProgress(0);
    
    try {
      toast.info('Preparing complete package...', {
        description: 'This may take a moment. Please wait.',
      });
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);

      const blob = await BulkDownloadService.generateCompletePackage();
      
      clearInterval(progressInterval);
      setProgress(100);
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Glocalization-Business-Package-${new Date().toISOString().split('T')[0]}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Complete package downloaded!', {
        description: 'All materials have been packaged and downloaded successfully.',
      });
    } catch (error) {
      toast.error('Download failed', {
        description: 'Failed to generate package. Please try again.',
      });
    } finally {
      setTimeout(() => {
        setIsDownloading(false);
        setProgress(0);
      }, 1000);
    }
  };

  const handlePrint = () => {
    window.print();
    toast.success('Print dialog opened', {
      description: 'Select your printer to print the full report.',
    });
  };

  return (
    <div className="sticky bottom-0 bg-card border-t border-border shadow-lg">
      <div className="max-w-7xl mx-auto px-8 py-4">
        {isDownloading && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Generating package...</span>
              <span className="text-foreground font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Quick Actions</h3>
            <p className="text-xs text-muted-foreground">Download and share all materials</p>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="default"
              onClick={handleDownloadAll}
              disabled={isDownloading}
            >
              <Package className="h-4 w-4 mr-2" />
              Download All Materials
            </Button>
            
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};