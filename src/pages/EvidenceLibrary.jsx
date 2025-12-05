import { useBrand } from '@/contexts/BrandContext';
import { useEvidenceLibrary } from '@/hooks/useEvidenceLibrary';
import { useContentModules } from '@/hooks/useContentModules';
import { useClaimVariants } from '@/hooks/useClaimVariants';
import Header from '@/components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ClinicalClaimsTab } from '@/components/evidence/ClinicalClaimsTab';
import { ClinicalReferencesTab } from '@/components/evidence/ClinicalReferencesTab';
import { ContentSegmentsTab } from '@/components/evidence/ContentSegmentsTab';
import { ContentModulesTab } from '@/components/evidence/ContentModulesTab';
import { SafetyStatementsTab } from '@/components/evidence/SafetyStatementsTab';
import { Database, FileText, BookOpen, FileType, AlertTriangle, Boxes, Variable, Image } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { VisualAssetsTab } from '@/components/evidence/VisualAssetsTab';

const EvidenceLibrary = () => {
  const { selectedBrand } = useBrand();
  const navigate = useNavigate();
  const { claims, references, segments, safetyStatements, visualAssets, isLoading } = useEvidenceLibrary(selectedBrand?.id);
  const { data: modules = [], isLoading: modulesLoading } = useContentModules(selectedBrand?.id);
  const { data: claimVariants = [], isLoading: variantsLoading } = useClaimVariants(selectedBrand?.id);

  if (!selectedBrand) {
    return (
      <div className="h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center p-8">
          <Card>
            <CardHeader>
              <CardTitle>No Brand Selected</CardTitle>
              <CardDescription>Please select a brand to view its evidence library</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex flex-col">
      <Header />
      <div className="flex-1 overflow-y-auto">
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Database className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold">Evidence Library</h1>
            </div>
            <p className="text-muted-foreground">
              Extracted clinical evidence from documents for {selectedBrand.brand_name}
            </p>
          </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Clinical Claims
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{claims.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                References
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{references.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <FileType className="h-4 w-4" />
                Content Segments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{segments.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Safety Statements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{safetyStatements.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Boxes className="h-4 w-4" />
                Content Modules
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{modules.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Variable className="h-4 w-4" />
                Claim Variants
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{claimVariants.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Image className="h-4 w-4" />
                Visual Assets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{visualAssets.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabbed Evidence Views */}
        <Card>
          <CardHeader>
            <CardTitle>Evidence Details</CardTitle>
            <CardDescription>
              Browse and filter extracted evidence by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading || modulesLoading || variantsLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading evidence...</p>
              </div>
            ) : (
              <Tabs defaultValue="claims" className="w-full">
                <TabsList className="grid w-full grid-cols-7">
                  <TabsTrigger value="claims">
                    Claims ({claims.length})
                  </TabsTrigger>
                  <TabsTrigger value="references">
                    References ({references.length})
                  </TabsTrigger>
                  <TabsTrigger value="segments">
                    Segments ({segments.length})
                  </TabsTrigger>
                  <TabsTrigger value="modules">
                    Modules ({modules.length})
                  </TabsTrigger>
                  <TabsTrigger value="variants">
                    Variants ({claimVariants.length})
                  </TabsTrigger>
                  <TabsTrigger value="safety">
                    Safety ({safetyStatements.length})
                  </TabsTrigger>
                  <TabsTrigger value="visuals">
                    Visuals ({visualAssets.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="claims" className="mt-6">
                  <ClinicalClaimsTab claims={claims} />
                </TabsContent>

                <TabsContent value="references" className="mt-6">
                  <ClinicalReferencesTab references={references} brandId={selectedBrand?.id} />
                </TabsContent>

                <TabsContent value="segments" className="mt-6">
                  <ContentSegmentsTab segments={segments} />
                </TabsContent>

                <TabsContent value="modules" className="mt-6">
                  <ContentModulesTab modules={modules} />
                </TabsContent>

                <TabsContent value="variants" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Claim Variants</CardTitle>
                      <CardDescription>
                        Multiple phrasings of each claim for different channels and audiences
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {claimVariants.length} variants available across all claims
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="safety" className="mt-6">
                  <SafetyStatementsTab safetyStatements={safetyStatements} />
                </TabsContent>

                <TabsContent value="visuals" className="mt-6">
                  <VisualAssetsTab visualAssets={visualAssets} />
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  </div>
);
};

export default EvidenceLibrary;