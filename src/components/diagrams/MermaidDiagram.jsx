
import { useEffect, useState } from 'react';
import { renderDiagram } from '@/config/mermaidConfig';
import { Loader2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DiagramExportService } from '@/utils/diagramExportService';
import { useToast } from '@/hooks/use-toast';

export const MermaidDiagram = ({ id, definition, name, enableExport = false }) => {
  const [svgContent, setSvgContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const render = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const svg = await renderDiagram(definition.trim(), id);
        setSvgContent(svg);
      } catch (err) {
        console.error('Failed to render diagram:', err);
        setError('Failed to render diagram. Please check the diagram syntax.');
      } finally {
        setIsLoading(false);
      }
    };
    render();
  }, [definition, id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600 text-sm">{error}</div>;
  }

  const handleExport = async (format) => {
    if (!svgContent || !name) return;
    try {
      setIsExporting(true);
      const diagramDef = {
        id: 'c4-context',
        name: name,
        description: '',
        category: 'high-level',
        mermaidSyntax: definition
      };
      const blob = await DiagramExportService.exportDiagram(diagramDef, { format });
      const fileName = name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      DiagramExportService.downloadBlob(blob, `${fileName}.${format}`);
      toast({
        title: 'Export successful',
        description: `Diagram exported as ${format.toUpperCase()}`
      });
    } catch (err) {
      console.error('Export failed:', err);
      toast({
        title: 'Export failed',
        description: 'Failed to export diagram. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div dangerouslySetInnerHTML={{ __html: svgContent }} />
      {enableExport && name && (
        <div className="flex gap-2 mt-4">
          <Button onClick={() => handleExport('svg')} disabled={isExporting}>
            SVG
          </Button>
          <Button onClick={() => handleExport('png')} disabled={isExporting}>
            PNG
          </Button>
          <Button onClick={() => handleExport('pdf')} disabled={isExporting}>
            PDF
          </Button>
        </div>
      )}
    </div>
  );
};
