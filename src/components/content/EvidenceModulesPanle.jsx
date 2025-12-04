import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { 
  FileText, 
  BookOpen, 
  Layers, 
  Search, 
  Plus, 
  Check, 
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { useEvidenceLibrary } from '@/hooks/useEvidenceLibrary';
import { useContentModules } from '@/hooks/useContentModules';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export function EvidenceModulesPanel({
  brandId,
  assetId,
  assetType,
  targetAudience,
  citationData,
  onInsertClaim,
  onInsertModule,
  onSwapClaim,
  onCitationDataRefresh
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('used');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Debug logging for citationData
  console.log('📊 EvidenceModulesPanel received citationData:', {
    hasCitationData: !!citationData,
    claimsUsedCount: citationData?.claimsUsed?.length || 0,
    referencesUsedCount: citationData?.referencesUsed?.length || 0,
    modulesUsedCount: citationData?.modulesUsed?.length || 0,
    citationData
  });
  
  const { claims, references, segments, isLoading } = useEvidenceLibrary(brandId);
  const { data: contentModules, isLoading: modulesLoading } = useContentModules(brandId);

  // Filter claims that are used in content
  const usedClaimIds = useMemo(() => 
    new Set(citationData?.claimsUsed?.map(c => c.claimId) || []), 
    [citationData]
  );

  // Available claims (not yet used)
  const availableClaims = useMemo(() => {
    if (!claims) return [];
    return claims.filter(c => 
      !usedClaimIds.has(c.id) &&
      (searchQuery === '' || 
       c.claim_text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
       c.claim_id_display?.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [claims, usedClaimIds, searchQuery]);

  // Filter modules by asset type and search - show all modules, not just MLR approved
  const filteredModules = useMemo(() => {
    if (!contentModules) return [];
    return contentModules.filter(m => 
      (searchQuery === '' || 
       m.module_text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
       m.module_type?.toLowerCase().includes(searchQuery.toLowerCase()))
    ).sort((a, b) => {
      // MLR-approved first, then by usage score
      if (a.mlr_approved && !b.mlr_approved) return -1;
      if (!a.mlr_approved && b.mlr_approved) return 1;
      return b.usage_score - a.usage_score;
    });
  }, [contentModules, searchQuery]);

  const handleInsertClaim = (claim) => {
    onInsertClaim?.(claim);
    toast({
      title: "Claim Inserted",
      description: `Added [CLAIM:${claim.claim_id_display}] to content.`
    });
  };

  const handleInsertModule = (module) => {
    onInsertModule?.(module);
    toast({
      title: "Module Inserted",
      description: `Added MLR-approved module to content.`
    });
  };

  // Manual refresh citations handler
  const handleRefreshCitations = async () => {
    if (!assetId || !brandId) {
      toast({
        title: "Cannot Refresh",
        description: "Missing asset or brand information.",
        variant: "destructive"
      });
      return;
    }
    
    setIsRefreshing(true);
    try {
      // Fetch current asset content
      const { data: asset, error: fetchError } = await supabase
        .from('content_assets')
        .select('primary_content, brand_id')
        .eq('id', assetId)
        .single();
      
      if (fetchError || !asset) {
        throw new Error('Failed to fetch asset content');
      }
      
      const bodyContent = asset.primary_content?.body || '';
      
      if (!bodyContent) {
        toast({
          title: "No Content",
          description: "Asset has no body content to process.",
          variant: "destructive"
        });
        return;
      }
      
      // Check for markers
      const hasMarkers = /\[CLAIM:CML-[A-Za-z0-9]+\]/.test(bodyContent);
      
      if (!hasMarkers) {
        toast({
          title: "No Citation Markers",
          description: "Content doesn't contain [CLAIM:XXX] markers.",
          variant: "destructive"
        });
        return;
      }
      
      // Re-process citations
      const { CitationProcessor } = await import('@/services/citationProcessor');
      const processed = await CitationProcessor.processContent(bodyContent, brandId);
      
      console.log('📚 Manual refresh result:', {
        claimsUsed: processed.claimsUsed.length,
        referencesUsed: processed.referencesUsed.length
      });
      
      if (processed.claimsUsed.length > 0) {
        // Save to database
        const { error: updateError } = await supabase
          .from('content_assets')
          .update({
            claims_used: processed.claimsUsed,
            references_used: processed.referencesUsed
          })
          .eq('id', assetId);
        
        if (updateError) {
          console.error('Failed to save citations:', updateError);
        }
        
        // Update local state via callback
        onCitationDataRefresh?.({
          claimsUsed: processed.claimsUsed,
          referencesUsed: processed.referencesUsed
        });
        
        toast({
          title: "Citations Refreshed",
          description: `Found ${processed.claimsUsed.length} claims and ${processed.referencesUsed.length} references.`
        });
      } else {
        toast({
          title: "No Citations Found",
          description: "Claims couldn't be matched. Check if claim IDs exist in the database.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error refreshing citations:', error);
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh citations. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  if (isLoading || modulesLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Evidence & Modules
          </CardTitle>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-xs">
              {citationData?.claimsUsed?.length || 0} Claims Used
            </Badge>
            <Badge variant="outline" className="text-xs">
              {citationData?.referencesUsed?.length || 0} References
            </Badge>
            {availableClaims.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {availableClaims.length} Available Claims
              </Badge>
            )}
            {filteredModules.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {filteredModules.length} Modules
              </Badge>
            )}
            {assetId && (
              <Button 
                variant="ghost" 
                size="sm"
                className="h-6 w-6 p-0"
                onClick={handleRefreshCitations}
                disabled={isRefreshing}
                title="Refresh citations from content"
              >
                {isRefreshing ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <RefreshCw className="h-3 w-3" />
                )}
              </Button>
            )}
          </div>
        </div>
        
        {/* Search */}
        <div className="relative mt-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search claims, modules..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="used" className="text-xs">
              <Check className="h-3 w-3 mr-1" />
              Used
            </TabsTrigger>
            <TabsTrigger value="claims" className="text-xs">
              <FileText className="h-3 w-3 mr-1" />
              Claims
            </TabsTrigger>
            <TabsTrigger value="references" className="text-xs">
              <BookOpen className="h-3 w-3 mr-1" />
              Refs
            </TabsTrigger>
            <TabsTrigger value="modules" className="text-xs">
              <Layers className="h-3 w-3 mr-1" />
              Modules
            </TabsTrigger>
          </TabsList>

          {/* Used Evidence Tab */}
          <TabsContent value="used" className="mt-3">
            <ScrollArea className="h-[400px]">
              {(citationData?.claimsUsed?.length || citationData?.referencesUsed?.length || citationData?.modulesUsed?.length) ? (
                <div className="space-y-4">
                  {/* Claims Used Section */}
                  {citationData?.claimsUsed && citationData.claimsUsed.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Claims Used ({citationData.claimsUsed.length})
                      </h4>
                      {citationData.claimsUsed.map((claim) => (
                        <div key={claim.claimId} className="p-3 border rounded-lg bg-muted/30 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <Badge variant="secondary" className="shrink-0">
                              <sup>{claim.citationNumber}</sup> {claim.claimDisplayId}
                            </Badge>
                            <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => onSwapClaim?.(claim.claimId, null)}>
                              Swap
                            </Button>
                          </div>
                          <p className="text-sm line-clamp-2">{claim.claimText}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* References Used Section */}
                  {citationData?.referencesUsed && citationData.referencesUsed.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        References ({citationData.referencesUsed.length})
                      </h4>
                      {citationData.referencesUsed.map((ref) => (
                        <div key={ref.referenceId} className="p-2 border rounded-lg text-sm">
                          <Badge variant="outline" className="text-xs mb-1">{ref.referenceDisplayId}</Badge>
                          <p className="text-sm">{ref.formattedCitation}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Modules Used Section */}
                  {citationData?.modulesUsed && citationData.modulesUsed.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Layers className="h-4 w-4" />
                        Content Modules ({citationData.modulesUsed.length})
                      </h4>
                      {citationData.modulesUsed.map((module) => (
                        <div key={module.moduleId} className="p-2 border rounded-lg text-sm">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">{module.moduleType}</Badge>
                            {module.mlrApproved && <Badge variant="secondary" className="text-xs">MLR ✓</Badge>}
                          </div>
                          <p className="text-sm line-clamp-2">{module.moduleText}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No evidence used yet</p>
                  <p className="text-xs mt-1 mb-3">Generate content or insert claims manually</p>
                  {assetId && (
                    <Button variant="outline" size="sm" onClick={handleRefreshCitations} disabled={isRefreshing}>
                      {isRefreshing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                      Refresh Citations
                    </Button>
                  )}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          {/* Available Claims Tab */}
          <TabsContent value="claims" className="mt-3">
            <ScrollArea className="h-[400px]">
              <div className="space-y-2">
                {availableClaims.length > 0 ? (
                  availableClaims.slice(0, 20).map(claim => (
                    <div 
                      key={claim.id}
                      className="p-3 border rounded-lg hover:bg-muted/50 transition-colors group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs shrink-0">
                              {claim.claim_id_display}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {claim.claim_type}
                            </Badge>
                            {claim.expiration_date && new Date(claim.expiration_date) < new Date() && (
                              <Badge variant="destructive" className="text-xs">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Expired
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm line-clamp-2">{claim.claim_text}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleInsertClaim(claim)}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Insert
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p className="text-sm">No available claims</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          {/* References Tab */}
          <TabsContent value="references" className="mt-3">
            <ScrollArea className="h-[400px]">
              <div className="space-y-2">
                {references && references.length > 0 ? (
                  references.slice(0, 20).map(ref => (
                    <div key={ref.id} className="p-3 border rounded-lg">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <Badge variant="outline" className="text-xs mb-1">
                            {ref.reference_id_display}
                          </Badge>
                          <p className="text-sm">
                            {ref.formatted_citation || ref.reference_text}
                          </p>
                          {ref.study_name && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Study: {ref.study_name}
                            </p>
                          )}
                        </div>
                        {ref.doi && (
                          <Button variant="ghost" size="sm" className="h-6" asChild>
                            <a href={`https://doi.org/${ref.doi}`} target="_blank" rel="noopener">
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No references available</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Content Modules Tab */}
          <TabsContent value="modules" className="mt-3">
            <ScrollArea className="h-[400px]">
              <div className="space-y-2">
                {filteredModules.length > 0 ? (
                  filteredModules.map(module => (
                    <div 
                      key={module.id}
                      className="p-3 border rounded-lg hover:bg-muted/50 transition-colors group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">
                              {module.module_type}
                            </Badge>
                            {module.length_variant && (
                              <Badge variant="secondary" className="text-xs">
                                {module.length_variant}
                              </Badge>
                            )}
                            {module.mlr_approved ? (
                              <Badge className="text-xs bg-green-100 text-green-800">
                                <Check className="h-3 w-3 mr-1" />
                                MLR
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs text-amber-600 border-amber-300">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Pending MLR
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm line-clamp-3">{module.module_text}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleInsertModule(module)}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Use
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Layers className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No content modules available</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}