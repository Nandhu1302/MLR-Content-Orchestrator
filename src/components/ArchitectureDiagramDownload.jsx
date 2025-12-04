import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Eye, Package } from 'lucide-react';
import { toast } from 'sonner';
import { ArchitectureDiagramService } from '@/services/architectureDiagramService';
import { DiagramExportService } from '@/utils/diagramExportService';
import { DiagramPreviewModal } from './DiagramPreviewModal';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const ArchitectureDiagramDownload = () => {
  const [selectedDiagram, setSelectedDiagram] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [generatingDiagrams, setGeneratingDiagrams] = useState(new Set());
  const [isGeneratingPackage, setIsGeneratingPackage] = useState(false);
  const [format, setFormat] = useState('png');
  const [resolution, setResolution] = useState('standard');

  const highLevelDiagrams = ArchitectureDiagramService.getHighLevelDiagrams();
  const deepDiveDiagrams = ArchitectureDiagramService.getDeepDiveDiagrams();

  const handlePreview = (diagram) => {
    setSelectedDiagram(diagram);
    setIsPreviewOpen(true);
  };

  const handleDownloadSingle = async (diagram) => {
    setGeneratingDiagrams(prev => new Set(prev).add(diagram.id));
    console.log('Starting download for:', diagram.name, 'Format:', format);
    try {
      const blob = await DiagramExportService.exportDiagram(diagram, {
        format,
        resolution,
      });
      console.log('Blob created successfully, size:', blob.size);

      const fileName = `${diagram.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')}.${format}`;

      DiagramExportService.downloadBlob(blob, fileName);
      console.log('Download initiated for:', fileName);

      toast.success('Diagram downloaded successfully!', {
        description: `${diagram.name} - ${format.toUpperCase()} (Insert into PPT/Word)`,
      });
    } catch (error) {
      console.error('Download error details:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error('Failed to download diagram', {
        description: format === 'png' 
          ? 'Try using SVG or PDF format instead.' 
          : errorMessage,
      });
    } finally {
      console.log('Download complete, resetting state');
      setGeneratingDiagrams(prev => {
        const next = new Set(prev);
        next.delete(diagram.id);
        return next;
      });
    }
  };

  const handleDownloadPackage = async () => {
    setIsGeneratingPackage(true);
    try {
      const allDiagrams = ArchitectureDiagramService.getAllDiagrams();
      const blob = await DiagramExportService.exportMultipleDiagrams(
        allDiagrams,
        format,
        resolution
      );

      const fileName =
        format === 'pdf'
          ? 'architecture-diagrams.pdf'
          : 'architecture-diagrams.zip';

      DiagramExportService.downloadBlob(blob, fileName);

      toast.success('Architecture package downloaded!', {
        description: `All ${allDiagrams.length} diagrams - ${format.toUpperCase()}`,
      });
    } catch (error) {
      console.error('Package download error:', error);
      toast.error('Failed to download architecture package');
    } finally {
      setIsGeneratingPackage(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          📊 High-Resolution Architecture Diagrams
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Professional architectural diagrams with legends in multiple formats. Select PNG (Print 300 DPI) for best quality when inserting into PowerPoint or Word documents.
        </p>

        <div className="flex items-center gap-3 mb-6">
          <Select value={format} onValueChange={setFormat}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="svg">SVG (Vector)</SelectItem>
              <SelectItem value="png">PNG (Raster)</SelectItem>
              <SelectItem value="pdf">PDF (Document)</SelectItem>
            </SelectContent>
          </Select>

          {format === 'png' && (
            <Select value={resolution} onValueChange={setResolution}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard (2x)</SelectItem>
                <SelectItem value="high">High (4x)</SelectItem>
                <SelectItem value="print">Print (300 DPI)</SelectItem>
              </SelectContent>
            </Select>
          )}

          <Button
            onClick={handleDownloadPackage}
            disabled={isGeneratingPackage}
            className="ml-auto"
          >
            <Package className="h-4 w-4 mr-2" />
            {isGeneratingPackage ? 'Generating...' : 'Download All Diagrams'}
          </Button>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-foreground mb-3">
          High-Level Architecture (Executive View)
        </h4>
        <div className="grid gap-2">
          {highLevelDiagrams.map((diagram) => (
            <div
              key={diagram.id}
              className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1">
                <p className="font-medium text-sm text-foreground">{diagram.name}</p>
                <p className="text-xs text-muted-foreground">{diagram.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePreview(diagram)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Preview
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => handleDownloadSingle(diagram)}
                  disabled={generatingDiagrams.has(diagram.id)}
                >
                  <Download className="h-4 w-4 mr-1" />
                  {generatingDiagrams.has(diagram.id) ? 'Generating...' : 'Download'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-foreground mb-3">
          Deep Dive Technical (Developer View)
        </h4>
        <div className="grid gap-2">
          {deepDiveDiagrams.map((diagram) => (
            <div
              key={diagram.id}
              className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1">
                <p className="font-medium text-sm text-foreground">{diagram.name}</p>
                <p className="text-xs text-muted-foreground">{diagram.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePreview(diagram)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Preview
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => handleDownloadSingle(diagram)}
                  disabled={generatingDiagrams.has(diagram.id)}
                >
                  <Download className="h-4 w-4 mr-1" />
                  {generatingDiagrams.has(diagram.id) ? 'Generating...' : 'Download'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <DiagramPreviewModal
        diagram={selectedDiagram}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </div>
  );
};