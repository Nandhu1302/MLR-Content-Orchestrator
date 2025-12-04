import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { CheckCircle2, FileText, BookOpen, FlaskConical } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const EvidenceInsertionDialog = ({
  open,
  onOpenChange,
  brandId,
  availableClaims,
  availableSegments,
  availableReferences,
  onInsert
}) => {
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [selectedSection, setSelectedSection] = useState('body');
  const [activeTab, setActiveTab] = useState('claims');
  const { toast } = useToast();

  const handleInsert = () => {
    if (!selectedEvidence) {
      toast({
        title: "No Evidence Selected",
        description: "Please select an evidence item to insert.",
        variant: "destructive"
      });
      return;
    }

    onInsert(selectedEvidence, selectedSection);
    
    toast({
      title: "Evidence Inserted",
      description: `Added to ${selectedSection} section.`,
    });

    // Reset selection
    setSelectedEvidence(null);
  };

  const renderClaimCard = (claim) => (
    <Card 
      key={claim.id}
      className={`cursor-pointer transition-all ${
        selectedEvidence?.id === claim.id 
          ? 'border-primary border-2 bg-primary/5' 
          : 'hover:border-primary/50'
      }`}
      onClick={() => setSelectedEvidence({ ...claim, type: 'claim' })}
    >
      <CardContent className="pt-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm">{claim.claim_text}</p>
          {selectedEvidence?.id === claim.id && (
            <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
          )}
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {claim.claim_type}
          </Badge>
          {claim.confidence_score && (
            <Badge variant="outline" className="text-xs">
              {claim.confidence_score}% confidence
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderSegmentCard = (segment) => (
    <Card 
      key={segment.id}
      className={`cursor-pointer transition-all ${
        selectedEvidence?.id === segment.id 
          ? 'border-primary border-2 bg-primary/5' 
          : 'hover:border-primary/50'
      }`}
      onClick={() => setSelectedEvidence({ ...segment, type: 'segment' })}
    >
      <CardContent className="pt-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm">{segment.segment_text}</p>
          {selectedEvidence?.id === segment.id && (
            <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
          )}
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {segment.segment_type}
          </Badge>
          {segment.applicable_asset_types && segment.applicable_asset_types.length > 0 && (
            <Badge variant="outline" className="text-xs">
              For: {segment.applicable_asset_types.join(', ')}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderReferenceCard = (reference) => (
    <Card 
      key={reference.id}
      className={`cursor-pointer transition-all ${
        selectedEvidence?.id === reference.id 
          ? 'border-primary border-2 bg-primary/5' 
          : 'hover:border-primary/50'
      }`}
      onClick={() => setSelectedEvidence({ ...reference, type: 'reference' })}
    >
      <CardContent className="pt-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-semibold text-sm">{reference.study_name}</p>
            <p className="text-xs text-muted-foreground font-mono mt-1">{reference.reference_text || reference.formatted_citation}</p>
          </div>
          {selectedEvidence?.id === reference.id && (
            <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
          )}
        </div>
        {reference.publication_year && (
          <Badge variant="outline" className="text-xs">
            {reference.publication_year}
          </Badge>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FlaskConical className="h-5 w-5 text-primary" />
            Insert Clinical Evidence
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Section Selector */}
          <div className="space-y-2">
            <Label>Insert Into Section</Label>
            <Select value={selectedSection} onValueChange={(value) => setSelectedSection(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="subject">Subject Line</SelectItem>
                <SelectItem value="preheader">Preheader</SelectItem>
                <SelectItem value="headline">Headline</SelectItem>
                <SelectItem value="body">Body Content</SelectItem>
                <SelectItem value="cta">Call to Action</SelectItem>
                <SelectItem value="disclaimer">Disclaimer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Evidence Browser */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v)} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="claims" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Claims ({availableClaims.length})
              </TabsTrigger>
              <TabsTrigger value="segments" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Segments ({availableSegments.length})
              </TabsTrigger>
              <TabsTrigger value="references" className="flex items-center gap-2">
                <FlaskConical className="w-4 h-4" />
                References ({availableReferences.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="claims" className="space-y-3 mt-4 max-h-[400px] overflow-y-auto">
              {availableClaims.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No available claims</p>
                  <p className="text-sm">All claims have been used</p>
                </div>
              ) : (
                availableClaims.map(renderClaimCard)
              )}
            </TabsContent>

            <TabsContent value="segments" className="space-y-3 mt-4 max-h-[400px] overflow-y-auto">
              {availableSegments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No available segments</p>
                  <p className="text-sm">All segments have been used</p>
                </div>
              ) : (
                availableSegments.map(renderSegmentCard)
              )}
            </TabsContent>

            <TabsContent value="references" className="space-y-3 mt-4 max-h-[400px] overflow-y-auto">
              {availableReferences.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FlaskConical className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No available references</p>
                  <p className="text-sm">All references have been cited</p>
                </div>
              ) : (
                availableReferences.map(renderReferenceCard)
              )}
            </TabsContent>
          </Tabs>

          {/* Preview Selected */}
          {selectedEvidence && (
            <Card className="bg-muted/50 border-primary">
              <CardContent className="pt-4">
                <p className="text-xs font-semibold text-muted-foreground mb-2">SELECTED FOR INSERTION:</p>
                <p className="text-sm">
                  {selectedEvidence.claim_text || selectedEvidence.segment_text || selectedEvidence.study_name}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button 
              onClick={handleInsert}
              disabled={!selectedEvidence}
              className="flex-1"
              size="lg"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Insert into {selectedSection}
            </Button>
            <Button 
              onClick={() => onOpenChange(false)}
              variant="outline"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};