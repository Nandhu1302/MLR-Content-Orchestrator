import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useEvidenceLibrary } from '@/hooks/useEvidenceLibrary';
import { CheckCircle2, Circle, Sparkles, FileText, BookOpen, FlaskConical } from 'lucide-react';
import { EvidenceInsertionDialog } from './EvidenceInsertionDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const EvidenceUsagePanel = ({ 
  assetId, 
  brandId, 
  metadata,
  onInsertEvidence 
}) => {
  const [insertDialogOpen, setInsertDialogOpen] = useState(false);
  const { claims, references, segments, isLoading } = useEvidenceLibrary(brandId);

  // Extract evidence usage from metadata
  const evidenceUsage = metadata?.evidenceUsage || {};
  const evidenceAvailable = metadata?.evidenceAvailable || {};

  const usedClaims = evidenceUsage.claims || [];
  const usedSegments = evidenceUsage.segments || [];
  const usedReferences = evidenceUsage.references || [];
  const usedVisuals = evidenceUsage.visuals || [];
  const usedPerformance = evidenceUsage.performance || [];
  const usedCompetitive = evidenceUsage.competitive || [];

  // Get available (unused) evidence
  const usedClaimIds = new Set(usedClaims.map(c => c.claim_id));
  const usedSegmentIds = new Set(usedSegments.map(s => s.segment_id));
  const usedReferenceIds = new Set(usedReferences.map(r => r.reference_id));

  const availableClaims = claims?.filter(c => !usedClaimIds.has(c.id)) || [];
  const availableSegments = segments?.filter(s => !usedSegmentIds.has(s.id)) || [];
  const availableReferences = references?.filter(r => !usedReferenceIds.has(r.id)) || [];

  const totalUsed = usedClaims.length + usedSegments.length + usedReferences.length + usedVisuals.length + usedPerformance.length + usedCompetitive.length;
  const totalAvailable = availableClaims.length + availableSegments.length + availableReferences.length;
  const totalExtracted = (claims?.length || 0) + (segments?.length || 0) + (references?.length || 0);
  
  // Check if this is patient/caregiver content with no claims (by design)
  const isPatientContent = usedClaims.length === 0 && (usedSegments.length > 0 || usedVisuals.length > 0 || usedPerformance.length > 0);

  const getSectionBadge = (section) => {
    const sectionMap = {
      subject: 'Subject',
      preheader: 'Preheader',
      headline: 'Headline',
      body: 'Body',
      cta: 'CTA',
      disclaimer: 'Disclaimer'
    };
    return (
      <Badge variant="outline" className="ml-2 text-xs">
        {sectionMap[section] || section}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5" />
            Evidence Library
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Loading evidence library...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (totalExtracted === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5" />
            Evidence Library
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <FileText className="h-4 w-4" />
            <AlertDescription>
              No clinical evidence extracted yet. Add a document for this brand in Document Library to extract claims, references, and content segments.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FlaskConical className="w-5 h-5" />
                Evidence Library
                <Badge variant="secondary" className="ml-2">
                  Connected ✓
                </Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {totalUsed} items used • {totalAvailable} available to add
              </p>
            </div>
            {totalAvailable > 0 && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setInsertDialogOpen(true)}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Add More Evidence
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Summary Stats */}
          {isPatientContent && (
            <Alert className="mb-4">
              <FileText className="h-4 w-4" />
              <AlertDescription>
                <strong>Patient-Appropriate Content:</strong> Clinical claims excluded for patient/caregiver audiences. Content backed by patient-friendly segments, visual assets, and performance intelligence.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
            <div>
              <div className="text-2xl font-bold">{usedClaims.length + usedSegments.length}</div>
              <div className="text-xs text-muted-foreground">Evidence Items</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{usedVisuals.length}</div>
              <div className="text-xs text-muted-foreground">Visual Assets</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{usedPerformance.length + usedCompetitive.length}</div>
              <div className="text-xs text-muted-foreground">Intelligence</div>
            </div>
          </div>

          <Tabs defaultValue="used" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="used">
                Used in Content ({totalUsed})
              </TabsTrigger>
              <TabsTrigger value="available">
                Available to Add ({totalAvailable})
              </TabsTrigger>
            </TabsList>

            {/* Used Evidence Tab */}
            <TabsContent value="used" className="space-y-3 mt-4">
              {totalUsed === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Circle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No evidence used in generated content yet</p>
                  <p className="text-sm">Evidence will appear here when AI generates content</p>
                </div>
              ) : (
                <>
                  {/* Used Claims */}
                  {usedClaims.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        Clinical Claims ({usedClaims.length})
                      </h4>
                      {usedClaims.map((claim, idx) => (
                        <Card key={idx} className="border-l-4 border-l-green-500">
                          <CardContent className="pt-4 pb-3 px-4">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-sm">{claim.claim_text}</p>
                              {getSectionBadge(claim.used_in_section)}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}

                  {/* Used Segments */}
                  {usedSegments.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-600" />
                        Content Segments ({usedSegments.length})
                      </h4>
                      {usedSegments.map((segment, idx) => (
                        <Card key={idx} className="border-l-4 border-l-blue-500">
                          <CardContent className="pt-4 pb-3 px-4">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-sm">{segment.segment_text}</p>
                              {getSectionBadge(segment.used_in_section)}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}

                  {/* Used References */}
                  {usedReferences.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-purple-600" />
                        References Cited ({usedReferences.length})
                      </h4>
                      {usedReferences.map((reference, idx) => (
                        <Card key={idx} className="border-l-4 border-l-purple-500">
                          <CardContent className="pt-4 pb-3 px-4">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-sm font-mono text-xs">{reference.citation}</p>
                              {getSectionBadge(reference.used_in_section)}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                  
                  {/* Used Visual Assets */}
                  {usedVisuals.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-orange-600" />
                        Visual Assets ({usedVisuals.length})
                      </h4>
                      {usedVisuals.map((visual, idx) => (
                        <Card key={idx} className="border-l-4 border-l-orange-500">
                          <CardContent className="pt-4 pb-3 px-4">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="text-sm font-medium">{visual.visual_title}</p>
                                <Badge variant="secondary" className="text-xs mt-1">{visual.visual_type}</Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                  
                  {/* Performance Intelligence */}
                  {usedPerformance.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        Performance Intelligence ({usedPerformance.length})
                      </h4>
                      {usedPerformance.map((pattern, idx) => (
                        <Card key={idx} className="border-l-4 border-l-green-500">
                          <CardContent className="pt-4 pb-3 px-4">
                            <p className="text-sm font-medium">{pattern.pattern_name}</p>
                            <p className="text-xs text-muted-foreground mt-1">{pattern.description}</p>
                            <Badge variant="secondary" className="text-xs mt-1">+{pattern.performance_lift}% lift</Badge>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                  
                  {/* Competitive Intelligence */}
                  {usedCompetitive.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-red-600" />
                        Competitive Intelligence ({usedCompetitive.length})
                      </h4>
                      {usedCompetitive.map((comp, idx) => (
                        <Card key={idx} className="border-l-4 border-l-red-500">
                          <CardContent className="pt-4 pb-3 px-4">
                            <p className="text-sm">{comp.insight}</p>
                            <Badge variant="outline" className="text-xs mt-1">vs {comp.competitor}</Badge>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </>
              )}
            </TabsContent>

            {/* Available Evidence Tab */}
            <TabsContent value="available" className="space-y-3 mt-4">
              {totalAvailable === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-green-600 opacity-50" />
                  <p>All extracted evidence has been used!</p>
                  <p className="text-sm">You've incorporated all available clinical data</p>
                </div>
              ) : (
                <>
                  {/* Available Claims */}
                  {availableClaims.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm flex items-center gap-2">
                        <Circle className="w-4 h-4" />
                        Available Claims ({availableClaims.length})
                      </h4>
                      {availableClaims.slice(0, 3).map((claim, idx) => (
                        <Card key={idx} className="border-dashed">
                          <CardContent className="pt-4 pb-3 px-4">
                            <p className="text-sm text-muted-foreground">{claim.claim_text}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="secondary" className="text-xs">
                                {claim.claim_type}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      {availableClaims.length > 3 && (
                        <p className="text-xs text-muted-foreground text-center">
                          +{availableClaims.length - 3} more claims available
                        </p>
                      )}
                    </div>
                  )}

                  {/* Available Segments */}
                  {availableSegments.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm flex items-center gap-2">
                        <Circle className="w-4 h-4" />
                        Available Segments ({availableSegments.length})
                      </h4>
                      {availableSegments.slice(0, 2).map((segment, idx) => (
                        <Card key={idx} className="border-dashed">
                          <CardContent className="pt-4 pb-3 px-4">
                            <p className="text-sm text-muted-foreground">{segment.segment_text}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="secondary" className="text-xs">
                                {segment.segment_type}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      {availableSegments.length > 2 && (
                        <p className="text-xs text-muted-foreground text-center">
                          +{availableSegments.length - 2} more segments available
                        </p>
                      )}
                    </div>
                  )}

                  <Button 
                    variant="default" 
                    className="w-full"
                    onClick={() => setInsertDialogOpen(true)}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Browse & Insert Evidence
                  </Button>
                </>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <EvidenceInsertionDialog
        open={insertDialogOpen}
        onOpenChange={setInsertDialogOpen}
        brandId={brandId}
        availableClaims={availableClaims}
        availableSegments={availableSegments}
        availableReferences={availableReferences}
        onInsert={(evidence, section) => {
          onInsertEvidence?.(evidence, section);
          setInsertDialogOpen(false);
        }}
      />
    </>
  );
};