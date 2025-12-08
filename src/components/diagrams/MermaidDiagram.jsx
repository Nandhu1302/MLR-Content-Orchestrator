import { useEffect, useState, useRef } from 'react';
import { renderDiagram } from '@/config/mermaidConfig';
import { Loader2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DiagramExportService } from '@/utils/diagramExportService';
// TypeScript type imports removed
// import { DiagramDefinition, ExportFormat } from '@/types/diagram';
import { useToast } from '@/hooks/use-toast';

// Interface and type annotations removed
export const MermaidDiagram = ({ id, definition, name, enableExport = false }) => {
  const [svgContent, setSvgContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();
  
  // Generate a unique ID that persists for this component instance
  const uniqueId = useRef(`${id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    const render = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const svg = await renderDiagram(definition.trim(), uniqueId.current);
        setSvgContent(svg);
      } catch (err) {
        console.error('Failed to render diagram:', err);
        setError('Failed to render diagram. Please check the diagram syntax.');
      } finally {
        setIsLoading(false);
      }
    };

    render();
  }, [definition]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
        <p className="text-sm text-destructive">{error}</p>
      </div>
    );
  }

  // Type annotations for 'format' removed
  const handleExport = async (format) => {
    if (!svgContent || !name) return;
    
    try {
      setIsExporting(true);
      // Type assertion removed
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
        title: "Export successful",
        description: `Diagram exported as ${format.toUpperCase()}`,
      });
    } catch (err) {
      console.error('Export failed:', err);
      toast({
        title: "Export failed",
        description: "Failed to export diagram. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-2">
      {enableExport && name && (
        <div className="flex gap-2 justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport('svg')}
            disabled={isExporting}
          >
            <Download className="w-4 h-4 mr-2" />
            SVG
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport('png')}
            disabled={isExporting}
          >
            <Download className="w-4 h-4 mr-2" />
            PNG
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport('pdf')}
            disabled={isExporting}
          >
            <Download className="w-4 h-4 mr-2" />
            PDF
          </Button>
        </div>
      )}
      <div 
        className="mermaid-diagram"
        dangerouslySetInnerHTML={{ __html: svgContent }} 
      />
    </div>
  );
};