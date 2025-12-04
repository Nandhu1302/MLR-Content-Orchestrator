import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, ZoomIn, ZoomOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { renderDiagram } from '@/config/mermaidConfig';
import { DiagramExportService } from '@/utils/diagramExportService';
import { toast } from 'sonner';
import { DiagramLegend } from './DiagramLegend';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const DiagramPreviewModal = ({
  diagram,
  isOpen,
  onClose,
}) => {
  const [svg, setSvg] = useState('');
  const [zoom, setZoom] = useState(100);
  const [isLoading, setIsLoading] = useState(false);
  const [format, setFormat] = useState('png');
  const [resolution, setResolution] = useState('standard');

  useEffect(() => {
    if (diagram && isOpen) {
      renderDiagram(diagram.mermaidSyntax, `preview-${diagram.id}`)
        .then((renderedSvg) => setSvg(renderedSvg))
        .catch((error) => {
          console.error('Failed to render diagram:', error);
          toast.error('Failed to render diagram');
        });
    }
  }, [diagram, isOpen]);

  const handleDownload = async () => {
    if (!diagram) return;

    setIsLoading(true);
    try {
      const blob = await DiagramExportService.exportDiagram(diagram, {
        format,
        resolution,
      });

      const fileName = `${diagram.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')}.${format}`;

      DiagramExportService.downloadBlob(blob, fileName);

      toast.success(`Diagram downloaded as ${format.toUpperCase()}`, {
        description: `Resolution: ${resolution}`,
      });
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download diagram');
    } finally {
      setIsLoading(false);
    }
  };

  if (!diagram) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{diagram.name}</span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setZoom(Math.max(50, zoom - 25))}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground min-w-[4rem] text-center">
                {zoom}%
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setZoom(Math.min(200, zoom + 25))}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-auto border border-border rounded-lg bg-background p-4 my-4 max-h-[60vh]">
          {svg ? (
            <div
              style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}
              dangerouslySetInnerHTML={{ __html: svg }}
            />
          ) : (
            <div className="flex items-center justify-center h-64">
              <p className="text-muted-foreground">Loading diagram...</p>
            </div>
          )}
        </div>

        <DiagramLegend type={diagram.id} />

        <div className="flex items-center gap-3 mt-4">
          <Select value={format} onValueChange={setFormat}>
            <SelectTrigger className="w-[120px]">
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
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard (2x)</SelectItem>
                <SelectItem value="high">High (4x)</SelectItem>
                <SelectItem value="print">Print (300 DPI)</SelectItem>
              </SelectContent>
            </Select>
          )}

          <Button onClick={handleDownload} disabled={isLoading} className="ml-auto">
            <Download className="h-4 w-4 mr-2" />
            {isLoading ? 'Generating...' : 'Download'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};