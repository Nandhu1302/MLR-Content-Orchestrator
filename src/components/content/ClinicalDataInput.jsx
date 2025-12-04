import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { FileText, BarChart3, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PIImportDialog } from '@/components/pi/PIImportDialog';
import { useBrand } from '@/contexts/BrandContext';
import { Badge } from '@/components/ui/badge';

export const ClinicalDataInput = ({ assetId, initialData, onSave }) => {
  const { toast } = useToast();
  const { selectedBrand } = useBrand();
  const [piImportOpen, setPiImportOpen] = useState(false);
  
  // Clinical Trial Results (read-only from PI import)
  const [trialResults, setTrialResults] = useState(
    initialData?.clinical_trial_results || []
  );
  
  // Efficacy Data (read-only from PI import)
  const [efficacyData, setEfficacyData] = useState(
    initialData?.efficacy_data || []
  );
  
  // Safety Data (read-only from PI import)
  const [safetyData, setSafetyData] = useState(
    initialData?.safety_data || []
  );

  const hasData = 
    trialResults.length > 0 || 
    efficacyData.length > 0 || 
    safetyData.length > 0;

  const prepareAssetContext = () => {
    return {
      theme: initialData?.theme || {},
      keyMessage: initialData?.headline || initialData?.subject || '',
      audienceSegment: initialData?.audience_segment || 'HCP',
      assetType: initialData?.asset_type || 'email',
      currentContent: {
        subject: initialData?.subject,
        headline: initialData?.headline,
        body: initialData?.body_copy
      }
    };
  };

  const handlePIImport = async (data, section) => {
    switch (section) {
      case 'trials':
        setTrialResults(data);
        break;
      case 'efficacy':
        setEfficacyData(data);
        break;
      case 'safety':
        setSafetyData(data);
        break;
    }
    
    // Auto-save imported data
    const clinicalData = {
      clinical_trial_results: section === 'trials' ? data : trialResults,
      efficacy_data: section === 'efficacy' ? data : efficacyData,
      safety_data: section === 'safety' ? data : safetyData,
    };

    try {
      await onSave(clinicalData);
      toast({
        title: "Data Imported & Saved",
        description: "Clinical data imported successfully and will be used for automatic table/chart generation.",
      });
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: "Import Failed",
        description: "Could not save imported data. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getRelevanceColor = (score) => {
    if (!score) return 'secondary';
    if (score >= 90) return 'default';
    if (score >= 70) return 'secondary';
    return 'outline';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Clinical Data & Evidence
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Data extracted from PI will automatically be used to generate professional tables, charts, and graphs in your emails
            </p>
          </div>
          <Button variant="outline" onClick={() => setPiImportOpen(true)}>
            <FileText className="w-4 h-4 mr-2" />
            Import from PI
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {!hasData ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No clinical data found. Click "Import from PI" to extract relevant clinical data from your Prescribing Information document. This data will be automatically visualized when you compose your email.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="border-green-200 bg-green-50 dark:bg-green-950/20">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-900 dark:text-green-100">
              Clinical data available. When you compose your email, this data will automatically be used to generate tables, charts, and visualizations.
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="trials" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="trials">
              Clinical Trials
              {trialResults.length > 0 && (
                <Badge variant="secondary" className="ml-2 px-1.5 py-0 text-xs">
                  {trialResults.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="efficacy">
              Efficacy Data
              {efficacyData.length > 0 && (
                <Badge variant="secondary" className="ml-2 px-1.5 py-0 text-xs">
                  {efficacyData.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="safety">
              Safety Data
              {safetyData.length > 0 && (
                <Badge variant="secondary" className="ml-2 px-1.5 py-0 text-xs">
                  {safetyData.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Clinical Trial Results Tab */}
          <TabsContent value="trials" className="space-y-4">
            {trialResults.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No clinical trial data imported yet</p>
                <p className="text-sm">Click "Import from PI" to extract trial results</p>
              </div>
            ) : (
              trialResults.map((trial, index) => (
                <Card key={index} className="border-l-4 border-l-primary">
                  <CardContent className="pt-6 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h4 className="font-semibold text-lg">📊 {trial.studyName}</h4>
                        {trial.relevanceScore && (
                          <Badge variant={getRelevanceColor(trial.relevanceScore)}>
                            Relevance: {trial.relevanceScore}/100
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-muted-foreground">Endpoint:</span>
                        <p className="font-medium">{trial.endpoint}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Statistical Significance:</span>
                        <p className="font-medium">{trial.pValue} ({trial.significance})</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Treatment Result:</span>
                        <p className="font-medium">{trial.treatment}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Control Result:</span>
                        <p className="font-medium">{trial.control}</p>
                      </div>
                    </div>

                    {trial.narrativeFit && (
                      <div className="bg-muted p-3 rounded-md">
                        <p className="text-sm font-medium mb-1">💡 Why This Matters:</p>
                        <p className="text-sm text-muted-foreground">{trial.narrativeFit}</p>
                      </div>
                    )}

                    {trial.suggestedUsage && (
                      <div className="text-xs text-muted-foreground italic">
                        Suggested: {trial.suggestedUsage}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Efficacy Data Tab */}
          <TabsContent value="efficacy" className="space-y-4">
            {efficacyData.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No efficacy data imported yet</p>
                <p className="text-sm">Click "Import from PI" to extract efficacy metrics</p>
              </div>
            ) : (
              efficacyData.map((data, index) => (
                <Card key={index} className="border-l-4 border-l-green-500">
                  <CardContent className="pt-6 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h4 className="font-semibold text-lg">✅ {data.metric}</h4>
                        {data.relevanceScore && (
                          <Badge variant={getRelevanceColor(data.relevanceScore)}>
                            Relevance: {data.relevanceScore}/100
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-muted-foreground">Value/Result:</span>
                        <p className="font-medium">{data.value}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Timepoint:</span>
                        <p className="font-medium">{data.timepoint}</p>
                      </div>
                      {data.confidence && (
                        <div className="col-span-2">
                          <span className="text-muted-foreground">Confidence Interval:</span>
                          <p className="font-medium">{data.confidence}</p>
                        </div>
                      )}
                    </div>

                    {data.narrativeFit && (
                      <div className="bg-muted p-3 rounded-md">
                        <p className="text-sm font-medium mb-1">💡 Why This Matters:</p>
                        <p className="text-sm text-muted-foreground">{data.narrativeFit}</p>
                      </div>
                    )}

                    {data.suggestedUsage && (
                      <div className="text-xs text-muted-foreground italic">
                        Suggested: {data.suggestedUsage}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Safety Data Tab */}
          <TabsContent value="safety" className="space-y-4">
            {safetyData.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No safety data imported yet</p>
                <p className="text-sm">Click "Import from PI" to extract safety profile</p>
              </div>
            ) : (
              safetyData.map((data, index) => (
                <Card key={index} className="border-l-4 border-l-amber-500">
                  <CardContent className="pt-6 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h4 className="font-semibold text-lg">🛡️ {data.event}</h4>
                        {data.relevanceScore && (
                          <Badge variant={getRelevanceColor(data.relevanceScore)}>
                            Relevance: {data.relevanceScore}/100
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-muted-foreground">Treatment Rate:</span>
                        <p className="font-medium">{data.treatmentRate}</p>
                      </div>
                      {data.placeboRate && (
                        <div>
                          <span className="text-muted-foreground">Placebo Rate:</span>
                          <p className="font-medium">{data.placeboRate}</p>
                        </div>
                      )}
                      <div>
                        <span className="text-muted-foreground">Severity:</span>
                        <p className="font-medium">{data.severity}</p>
                      </div>
                    </div>

                    {data.narrativeFit && (
                      <div className="bg-muted p-3 rounded-md">
                        <p className="text-sm font-medium mb-1">💡 Why This Matters:</p>
                        <p className="text-sm text-muted-foreground">{data.narrativeFit}</p>
                      </div>
                    )}

                    {data.suggestedUsage && (
                      <div className="text-xs text-muted-foreground italic">
                        Suggested: {data.suggestedUsage}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </CardContent>

      <PIImportDialog
        open={piImportOpen}
        onOpenChange={setPiImportOpen}
        brandId={selectedBrand?.id || ''}
        onImport={handlePIImport}
        assetContext={prepareAssetContext()}
      />
    </Card>
  );
};