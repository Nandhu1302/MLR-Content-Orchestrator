import { useBrand } from '@/contexts/BrandContext';
import { useEvidenceLibrary } from '@/hooks/useEvidenceLibrary';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ClinicalClaimsTab } from '@/components/evidence/ClinicalClaimsTab';
import { ClinicalReferencesTab } from '@/components/evidence/ClinicalReferencesTab';
import { ContentSegmentsTab } from '@/components/evidence/ContentSegmentsTab';
import { SafetyStatementsTab } from '@/components/evidence/SafetyStatementsTab';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Database, FileText, BookOpen, FileType, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EvidenceLibrary = () => {
  const { selectedBrand } = useBrand();
  const navigate = useNavigate();
  const { claims, references, segments, safetyStatements, isLoading } = useEvidenceLibrary(selectedBrand?.id);

  if (!selectedBrand) {
    return (
      <div className="min-h-screen bg-background p-8">
        <Card>
          <CardHeader>
            <CardTitle>No Brand Selected</CardTitle>
            <CardDescription>Please select a brand to view its evidence library</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center gap-3 mb-2">
            <Database className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Evidence Library</h1>
          </div>
          <p className="text-muted-foreground">
            Extracted clinical evidence from PI documents for {selectedBrand.brand_name}
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
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
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading evidence...</p>
              </div>
            ) : (
              <Tabs defaultValue="claims" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="claims">
                    Claims ({claims.length})
                  </TabsTrigger>
                  <TabsTrigger value="references">
                    References ({references.length})
                  </TabsTrigger>
                  <TabsTrigger value="segments">
                    Segments ({segments.length})
                  </TabsTrigger>
                  <TabsTrigger value="safety">
                    Safety ({safetyStatements.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="claims" className="mt-6">
                  <ClinicalClaimsTab claims={claims} />
                </TabsContent>

                <TabsContent value="references" className="mt-6">
                  <ClinicalReferencesTab references={references} />
                </TabsContent>

                <TabsContent value="segments" className="mt-6">
                  <ContentSegmentsTab segments={segments} />
                </TabsContent>

                <TabsContent value="safety" className="mt-6">
                  <SafetyStatementsTab safetyStatements={safetyStatements} />
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EvidenceLibrary;