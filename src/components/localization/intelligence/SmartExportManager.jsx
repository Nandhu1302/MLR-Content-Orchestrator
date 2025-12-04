
import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

import { DAMMetadataPreparationService } from '@/services/DAMMetadataPreparationService';
import { Download, FileText, Globe, TrendingUp, Package, Check } from 'lucide-react';

export const SmartExportManager = ({
  assetId,
  localizationContext,
  intelligenceData,
  onExportComplete,
}) => {
  const [exportProgress, setExportProgress] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState(null); // 'pdf' | 'excel' | 'json' | null
  const [exportResults, setExportResults] = useState(null);

  const exportFormats = [
    {
      id: 'pdf',
      name: 'Comprehensive PDF Package',
      description:
        'Complete intelligence briefing with all analysis, cultural playbooks, and regulatory matrices',
      icon: FileText,
      color: 'text-red-600',
      features: ['Cultural Playbooks', 'Regulatory Matrix', 'TM Analysis', 'Brand Guidelines'],
    },
    {
      id: 'excel',
      name: 'Excel Workflow Template',
      description:
        'Structured data for project management with timeline and task tracking',
      icon: TrendingUp,
      color: 'text-green-600',
      features: ['Project Timeline', 'Task Breakdown', 'Resource Allocation', 'Quality Gates'],
    },
    {
      id: 'json',
      name: 'API Data Package',
      description:
        'JSON format for system integration with TMS, DAM, and other tools',
      icon: Globe,
      color: 'text-blue-600',
      features: ['Metadata Lineage', 'TM Matches', 'Compliance Data', 'Performance Metrics'],
    },
  ];

  const handleExport = async (format) => {
    if (!['pdf', 'excel', 'json'].includes(format)) return;

    setIsExporting(true);
    setExportProgress(0);
    setSelectedFormat(format);

    try {
      // Step 1: Prepare DAM metadata package
      setExportProgress(20);
      const damPackage = await DAMMetadataPreparationService.prepareDAMMetadataPackage(
        assetId,
        localizationContext,
        intelligenceData
      );

      // Step 2: Generate export package
      setExportProgress(60);
      const exportPackage = await DAMMetadataPreparationService.exportDAMPackage(
        damPackage,
        format
      );

      setExportProgress(100);

      const results = {
        format,
        downloadUrl: exportPackage.downloadUrl,
        packageId: exportPackage.packageId,
        metadata: {
          assetId,
          exportedAt: new Date().toISOString(),
          package: damPackage,
        },
      };

      setExportResults(results);
      onExportComplete?.(results);

      // Create and trigger actual file download
      const blob = await generateFileBlob(format, damPackage, intelligenceData);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `intelligence-package-${assetId}-${Date.now()}.${format === 'json' ? 'json' : format === 'excel' ? 'csv' : 'txt'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      console.log(`Export completed:`, results);
      alert(`${format.toUpperCase()} export completed and downloaded!`);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
      setTimeout(() => {
        setExportProgress(0);
        setSelectedFormat(null);
      }, 2000);
    }
  };

  const generateFileBlob = async (format, damPackage, intelligenceDataArg) => {
    if (format === 'json') {
      const jsonData = {
        assetId,
        exportedAt: new Date().toISOString(),
        intelligenceData: intelligenceDataArg,
        damPackage,
        metadata: {
          version: '1.0',
          format: 'json',
        },
      };
      return new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
    } else if (format === 'excel') {
      // Simulated CSV (Excel-friendly). If you need real .xlsx, wire an actual exporter in your app.
      const csvContent = `Asset ID,Export Date,Terminology Score,Cultural Score,Regulatory Score,Quality Score
${assetId},${new Date().toISOString()},${intelligenceDataArg?.terminology?.overallScore ?? 0},${intelligenceDataArg?.cultural?.overallScore ?? 0},${intelligenceDataArg?.regulatory?.overallScore ?? 0},${intelligenceDataArg?.quality?.overallScore ?? 0}`;
      return new Blob([csvContent], { type: 'text/csv' });
    } else {
      // Text "PDF" (placeholder). Replace with real PDF generation if needed.
      const pdfContent = `Intelligence Analysis Report
Asset ID: ${assetId}
Export Date: ${new Date().toISOString()}
Terminology Intelligence: ${intelligenceDataArg?.terminology?.overallScore ?? 0}%
Cultural Intelligence: ${intelligenceDataArg?.cultural?.overallScore ?? 0}%
Regulatory Intelligence: ${intelligenceDataArg?.regulatory?.overallScore ?? 0}%
Quality Assessment: ${intelligenceDataArg?.quality?.overallScore ?? 0}%
Detailed Analysis:
${JSON.stringify(intelligenceDataArg, null, 2)}`;
      return new Blob([pdfContent], { type: 'text/plain' });
    }
  };

  const generateShareableLink = () => {
    const shareableData = {
      assetId,
      intelligenceData: {
        terminology: intelligenceData?.terminology ?? [],
        cultural: intelligenceData?.cultural ?? {},
        regulatory: intelligenceData?.regulatory ?? [],
        quality: intelligenceData?.quality ?? {},
      },
      accessToken: `share_${assetId}_${Date.now()}`,
      // 7 days
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };

    const shareUrl = `${window.location.origin}/shared-intelligence/${shareableData.accessToken}`;

    // Copy to clipboard
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        alert('Shareable link copied to clipboard!');
      })
      .catch(() => {
        alert(`Shareable link: ${shareUrl}`);
      });

    console.log('Shareable intelligence data:', shareableData);
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Package className="h-5 w-5" />
            Smart Export Manager
          </h3>
          {exportResults && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Check className="h-3 w-3" />
              Last export: {exportResults.format.toUpperCase()}
            </Badge>
          )}
        </div>

        {/* Exporting state */}
        {isExporting && (
          <Card className="p-4 bg-primary/5">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">
                  Exporting {selectedFormat?.toUpperCase()} Package...
                </span>
                <span className="text-sm">{exportProgress}%</span>
              </div>
              <Progress value={exportProgress} />
              <div className="text-sm text-muted-foreground">
                {exportProgress < 30 && 'Preparing DAM metadata...'}
                {exportProgress >= 30 && exportProgress < 70 && 'Generating export package...'}
                {exportProgress >= 70 && exportProgress < 100 && 'Finalizing download...'}
                {exportProgress === 100 && 'Export complete!'}
              </div>
            </div>
          </Card>
        )}

        {/* Export format cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {exportFormats.map((format) => {
            const Icon = format.icon;
            return (
              <Card
                key={format.id}
                className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => !isExporting && handleExport(format.id)}
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Icon className={`h-6 w-6 ${format.color}`} />
                    <div>
                      <h4 className="font-medium">{format.name}</h4>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground">{format.description}</p>

                  <div className="space-y-2">
                    <div className="text-xs font-medium text-muted-foreground">Includes:</div>
                    <div className="flex flex-wrap gap-1">
                      {format.features.map((feature, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button size="sm" variant="outline" className="w-full" disabled={isExporting}>
                    <Download className="h-4 w-4 mr-2" />
                    Export {format.id.toUpperCase()}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Shareable link section */}
        <Card className="p-4 bg-muted/50">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium mb-1">Collaborative Intelligence Sharing</h4>
              <p className="text-sm text-muted-foreground">
                Generate a secure link to share intelligence data with external teams
              </p>
            </div>
            <Button variant="outline" onClick={generateShareableLink}>
              Generate Share Link
            </Button>
          </div>
        </Card>

        {/* Export history */}
        {exportResults && (
          <Card className="p-4">
            <h4 className="font-medium mb-3">Recent Export</h4>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">
                  {exportResults.format.toUpperCase()} Package
                </div>
                <div className="text-xs text-muted-foreground">
                  Exported: {new Date(exportResults.metadata.exportedAt).toLocaleString()}
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-3 w-3 mr-1" />
                Re-download
              </Button>
            </div>
          </Card>
        )}
      </div>
    </Card>
  );
};

SmartExportManager.propTypes = {
  assetId: PropTypes.string.isRequired,
  localizationContext: PropTypes.object,
  intelligenceData: PropTypes.object,
  onExportComplete: PropTypes.func,
};
