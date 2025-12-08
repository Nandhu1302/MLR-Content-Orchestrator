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
        description: 'Check your downloads folder for the ZIP file.',
      });
    } catch (error) {
      console.error('Failed to download all diagrams:', error);
      toast.error('Failed to download diagrams', {
        description: 'Please try again or download individually.',
      });
    } finally {
      setIsDownloadingAll(false);
    }
  };

  // Type annotations removed
  const renderDiagram = (diagram, index) => (
    <Card key={diagram.id} className="p-8 space-y-6 shadow-sm hover:shadow-md transition-shadow">
      {/* Diagram Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-2xl font-semibold text-foreground mb-3">{diagram.name}</h3>
            <p className="text-base text-muted-foreground leading-relaxed">{diagram.description}</p>
          </div>
        </div>

        {/* Metadata */}
        {(diagram.audience || diagram.purpose) && (
          <div className="grid grid-cols-1 gap-4 pt-3">
            {diagram.audience && (
              <div className="flex gap-3">
                <Users className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Audience</p>
                  <p className="text-base text-foreground">{diagram.audience}</p>
                </div>
              </div>
            )}
            {diagram.purpose && (
              <div className="flex gap-3">
                <Target className="h-5 w-5 text-purple-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Purpose</p>
                  <p className="text-base text-foreground">{diagram.purpose}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Diagram */}
      <div className="bg-muted/20 rounded-lg p-8 border border-border/50">
        <MermaidDiagram
          id={`gallery-${diagram.id}-${index}`}
          definition={diagram.mermaidSyntax}
          name={diagram.name}
          enableExport={true}
        />
      </div>

      {/* Legend */}
      <div className="bg-muted/30 rounded-lg p-6 border border-border/50">
        <DiagramLegend type={diagram.id} />
      </div>

      {/* Key Insight */}
      {diagram.keyInsight && (
        <div className="flex gap-3 p-5 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg mt-2">
          <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">Key Insight</p>
            <p className="text-base text-blue-800 dark:text-blue-200 leading-relaxed">{diagram.keyInsight}</p>
          </div>
        </div>
      )}
    </Card>
  );

  return (
    <div className="space-y-10">
      {/* Download All Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleDownloadAll}
          disabled={isDownloadingAll}
          size="lg"
          className="shadow-md"
        >
          <Download className="h-5 w-5 mr-2" />
          {isDownloadingAll ? 'Downloading...' : 'Download All Diagrams (ZIP)'}
        </Button>
      </div>

      {/* High-Level Architecture Section */}
      <Collapsible open={highLevelOpen} onOpenChange={setHighLevelOpen}>
        <Card className="border-blue-200 dark:border-blue-800 shadow-md">
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full flex items-center justify-between p-8 hover:bg-transparent"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-1.5 bg-blue-500 rounded-full shadow-sm" />
                <div className="text-left">
                  <h2 className="text-3xl font-bold text-foreground">
                    Platform-Wide Architecture
                  </h2>
                  <p className="text-base text-muted-foreground mt-2">
                    {highLevelDiagrams.length} diagrams - Complete system overview, containers, and deployment
                  </p>
                </div>
              </div>
              {highLevelOpen ? (
                <ChevronUp className="h-6 w-6 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-6 w-6 text-muted-foreground" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="px-8 pb-8 space-y-8">
              {highLevelDiagrams.map((diagram, index) => renderDiagram(diagram, index))}
            </div>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Deep Dive Technical Section */}
      <Collapsible open={deepDiveOpen} onOpenChange={setDeepDiveOpen}>
        <Card className="border-purple-200 dark:border-purple-800 shadow-md">
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full flex items-center justify-between p-8 hover:bg-transparent"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-1.5 bg-purple-500 rounded-full shadow-sm" />
                <div className="text-left">
                  <h2 className="text-3xl font-bold text-foreground">
                    Module-Specific Deep Dives
                  </h2>
                  <p className="text-base text-muted-foreground mt-2">
                    {deepDiveDiagrams.length} diagrams - Glocalization module components, sequences, and data flow
                  </p>
                </div>
              </div>
              {deepDiveOpen ? (
                <ChevronUp className="h-6 w-6 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-6 w-6 text-muted-foreground" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="px-8 pb-8 space-y-8">
              {deepDiveDiagrams.map((diagram, index) => renderDiagram(diagram, index))}
            </div>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  );
};