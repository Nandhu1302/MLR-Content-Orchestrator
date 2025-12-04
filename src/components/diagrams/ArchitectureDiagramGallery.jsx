
import { useState } from 'react';
import { ChevronDown, ChevronUp, Download, Users, Target, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { MermaidDiagram } from './MermaidDiagram';
import { DiagramLegend } from '@/components/DiagramLegend';
import { ArchitectureDiagramService } from '@/services/architectureDiagramService';
import { DiagramExportService } from '@/utils/diagramExportService';
import { toast } from 'sonner';

export const ArchitectureDiagramGallery = () => {
  const [highLevelOpen, setHighLevelOpen] = useState(true);
  const [deepDiveOpen, setDeepDiveOpen] = useState(false);
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);

  const highLevelDiagrams = ArchitectureDiagramService.getHighLevelDiagrams();
  const deepDiveDiagrams = ArchitectureDiagramService.getDeepDiveDiagrams();

  const handleDownloadAll = async () => {
    try {
      setIsDownloadingAll(true);
      const allDiagrams = ArchitectureDiagramService.getAllDiagrams();
      const blob = await DiagramExportService.exportMultipleDiagrams(allDiagrams, 'png', 'high');
      DiagramExportService.downloadBlob(blob, 'architecture-diagrams.zip');
      toast.success('All diagrams downloaded successfully!', {
        description: 'Check your downloads folder for the ZIP file.'
      });
    } catch (error) {
      console.error('Failed to download all diagrams:', error);
      toast.error('Failed to download diagrams', {
        description: 'Please try again or download individually.'
      });
    } finally {
      setIsDownloadingAll(false);
    }
  };

  const renderDiagram = (diagram, index) => (
    <Card key={index} className="p-4 mb-4">
      {/* Diagram Header */}
      <h5 className="text-lg font-semibold mb-2">{diagram.name}</h5>
      <p className="text-sm text-muted-foreground mb-2">{diagram.description}</p>

      {/* Metadata */}
      {(diagram.audience || diagram.purpose) && (
        <div className="text-xs text-muted-foreground mb-2">
          {diagram.audience && <div><strong>Audience:</strong> {diagram.audience}</div>}
          {diagram.purpose && <div><strong>Purpose:</strong> {diagram.purpose}</div>}
        </div>
      )}

      {/* Diagram */}
      <MermaidDiagram code={diagram.code} />

      {/* Legend */}
      <DiagramLegend items={diagram.legend} />

      {/* Key Insight */}
      {diagram.keyInsight && (
        <div className="mt-2 text-sm">
          <strong>Key Insight:</strong> {diagram.keyInsight}
        </div>
      )}
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Download All Button */}
      <Button onClick={handleDownloadAll} disabled={isDownloadingAll} className="mb-4">
        {isDownloadingAll ? 'Downloading...' : 'Download All Diagrams (ZIP)'}
      </Button>

      {/* High-Level Architecture Section */}
      <Collapsible open={highLevelOpen} onOpenChange={setHighLevelOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full">
          <h4 className="text-xl font-semibold">Platform-Wide Architecture</h4>
          {highLevelOpen ? <ChevronUp /> : <ChevronDown />}
        </CollapsibleTrigger>
        <p className="text-sm text-muted-foreground mb-4">
          {highLevelDiagrams.length} diagrams - Complete system overview, containers, and deployment
        </p>
        <CollapsibleContent>
          {highLevelDiagrams.map((diagram, index) => renderDiagram(diagram, index))}
        </CollapsibleContent>
      </Collapsible>

      {/* Deep Dive Technical Section */}
      <Collapsible open={deepDiveOpen} onOpenChange={setDeepDiveOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full">
          <h4 className="text-xl font-semibold">Module-Specific Deep Dives</h4>
          {deepDiveOpen ? <ChevronUp /> : <ChevronDown />}
        </CollapsibleTrigger>
        <p className="text-sm text-muted-foreground mb-4">
          {deepDiveDiagrams.length} diagrams - Glocalization module components, sequences, and data flow
        </p>
        <CollapsibleContent>
          {deepDiveDiagrams.map((diagram, index) => renderDiagram(diagram, index))}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
