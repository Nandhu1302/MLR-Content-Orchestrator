import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, Download, Upload, AlertTriangle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { TranslationPersistenceService } from '@/services/translationPersistenceService';

export const DataRecoveryPanel = ({
  projectId,
  brandId,
  assetId,
  market,
  onDataRestored,
  currentSegments
}) => {
  const [loading, setLoading] = useState(false);
  const [recoveryStatus, setRecoveryStatus] = useState('idle');
  const { toast } = useToast();

  const handleRestorePreviousSession = async () => {
    if (!projectId) {
      toast({
        title: "No Project ID",
        description: "Cannot restore data without a project ID",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setRecoveryStatus('idle');

    try {
      console.log('🔄 Attempting data restoration for project:', projectId);
      
      const existing = await TranslationPersistenceService.loadProjectById(projectId);

      if (existing && existing.segments.length > 0) {
        console.log('✅ Data restored:', {
          segmentCount: existing.segments.length,
          translatedCount: existing.segments.filter((s) => s.translatedText).length
        });

        onDataRestored?.(existing.segments);
        setRecoveryStatus('success');
        
        toast({
          title: "Data Restored",
          description: `Successfully loaded ${existing.segments.length} segments`,
        });
      } else {
        setRecoveryStatus('error');
        toast({
          title: "No Data Found",
          description: "No saved data found for this project",
          variant: "default"
        });
      }
    } catch (error) {
      console.error('❌ Data restoration failed:', error);
      setRecoveryStatus('error');
      toast({
        title: "Restoration Failed",
        description: "Could not restore previous session data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = () => {
    try {
      const exportData = {
        projectId,
        brandId,
        assetId,
        market,
        segments: currentSegments,
        exportedAt: new Date().toISOString()
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `localization-backup-${market}-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Data Exported",
        description: "Your translation data has been downloaded",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Could not export translation data",
        variant: "destructive"
      });
    }
  };

  const translatedCount = currentSegments.filter(s => s.translatedText).length;
  const totalCount = currentSegments.length;
  const hasData = totalCount > 0;

  return (
    <Card className="border-muted">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5" />
          Data Recovery & Backup
        </CardTitle>
        <CardDescription>
          Manage your translation data and recovery options
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {recoveryStatus === 'success' && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Data successfully restored from previous session
            </AlertDescription>
          </Alert>
        )}
        
        {recoveryStatus === 'error' && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Could not restore data. Please contact support if this persists.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">
            Current Progress: {translatedCount} / {totalCount} segments translated
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={handleRestorePreviousSession}
              disabled={loading || !projectId}
              variant="outline"
              className="flex-1"
            >
              <Upload className="h-4 w-4 mr-2" />
              {loading ? 'Restoring...' : 'Restore Session'}
            </Button>
            
            <Button
              onClick={handleExportData}
              disabled={!hasData}
              variant="outline"
              className="flex-1"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Backup
            </Button>
          </div>
        </div>

        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-xs">
            Auto-save runs every 3 seconds. Use "Restore Session" if you don't see your recent work, or "Export Backup" to download a local copy.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};