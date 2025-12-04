import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles, TrendingUp, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const PIImportDialog = ({ open, onOpenChange, brandId, assetContext, onImport }) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  const [trials, setTrials] = useState([]);
  const [efficacy, setEfficacy] = useState([]);
  const [safety, setSafety] = useState([]);
  const { toast } = useToast();

  const analyzePI = async () => {
    setAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('intelligent-pi-import', {
        body: {
          brandId,
          assetContext,
          dataTypes: ['trials', 'efficacy', 'safety']
        }
      });

      if (error) throw error;

      if (data.recommendations) {
        setRecommendations(data.recommendations);
        
        // Initialize with all items selected by default
        setTrials((data.recommendations.relevantTrials || []).map((t) => ({ ...t, selected: true })));
        setEfficacy((data.recommendations.relevantEfficacy || []).map((e) => ({ ...e, selected: true })));
        setSafety((data.recommendations.relevantSafety || []).map((s) => ({ ...s, selected: true })));

        toast({
          title: "Analysis Complete",
          description: `Found ${data.recommendations.relevantTrials?.length || 0} trials, ${data.recommendations.relevantEfficacy?.length || 0} efficacy metrics, ${data.recommendations.relevantSafety?.length || 0} safety points`,
        });
      }
    } catch (error) {
      console.error('Error analyzing PI:', error);
      toast({
        title: "Analysis Failed",
        description: "Could not analyze PI document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleImportSelected = () => {
    // Convert recommendations back to the format expected by ClinicalDataInput
    const selectedTrials = trials
      .filter(t => t.selected)
      .map(({ selected, relevanceScore, narrativeFit, suggestedUsage, audienceAlignment, ...rest }) => rest);
    
    const selectedEfficacy = efficacy
      .filter(e => e.selected)
      .map(({ selected, relevanceScore, narrativeFit, suggestedUsage, audienceAlignment, timePoint, ...rest }) => ({
        ...rest,
        timepoint: timePoint // map timePoint back to timepoint for consistency
      }));
    
    const selectedSafety = safety
      .filter(s => s.selected)
      .map(({ selected, relevanceScore, narrativeFit, suggestedUsage, audienceAlignment, adverseEvent, ...rest }) => ({
        ...rest,
        event: adverseEvent // map adverseEvent back to event for consistency
      }));

    // Import each section separately
    if (selectedTrials.length > 0) {
      onImport(selectedTrials, 'trials');
    }
    if (selectedEfficacy.length > 0) {
      onImport(selectedEfficacy, 'efficacy');
    }
    if (selectedSafety.length > 0) {
      onImport(selectedSafety, 'safety');
    }

    onOpenChange(false);
    
    const totalSelected = selectedTrials.length + selectedEfficacy.length + selectedSafety.length;
    
    toast({
      title: "Clinical Data Imported",
      description: `${totalSelected} data points added to your content.`,
    });
  };

  const toggleTrialSelection = (index) => {
    setTrials(prev => prev.map((t, i) => i === index ? { ...t, selected: !t.selected } : t));
  };

  const toggleEfficacySelection = (index) => {
    setEfficacy(prev => prev.map((e, i) => i === index ? { ...e, selected: !e.selected } : e));
  };

  const toggleSafetySelection = (index) => {
    setSafety(prev => prev.map((s, i) => i === index ? { ...s, selected: !s.selected } : s));
  };

  const getRelevanceColor = (score) => {
    if (score >= 80) return "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-950";
    if (score >= 60) return "text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-950";
    return "text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-950";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI-Powered PI Data Import
          </DialogTitle>
        </DialogHeader>

        {/* Context Display */}
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-semibold">Theme:</span> {assetContext.theme?.name || 'Not set'}
              </div>
              <div>
                <span className="font-semibold">Asset Type:</span> {assetContext.assetType}
              </div>
              <div className="col-span-2">
                <span className="font-semibold">Key Message:</span> {assetContext.keyMessage || 'Not set'}
              </div>
              <div>
                <span className="font-semibold">Audience:</span> {assetContext.audienceSegment}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Analysis Section */}
        {!recommendations && (
          <div className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                AI will analyze your brand's PI document and recommend the most relevant clinical data based on your content context and key message.
              </AlertDescription>
            </Alert>
            
            <Button 
              onClick={analyzePI} 
              disabled={analyzing}
              className="w-full"
              size="lg"
            >
              {analyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing PI Document...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Analyze PI for Relevant Data
                </>
              )}
            </Button>
          </div>
        )}

        {/* Recommendations Display */}
        {recommendations && (
          <div className="space-y-6">
            {/* Strategic Recommendations */}
            {recommendations.strategicRecommendations && recommendations.strategicRecommendations.length > 0 && (
              <Alert className="bg-primary/5 border-primary/20">
                <TrendingUp className="h-4 w-4" />
                <AlertDescription>
                  <div className="font-semibold mb-2">Strategic Recommendations:</div>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {recommendations.strategicRecommendations.map((rec, idx) => (
                      <li key={idx}>{rec}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Clinical Trials */}
            {trials.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Clinical Trials ({trials.filter(t => t.selected).length}/{trials.length} selected)</h3>
                {trials.map((trial, idx) => (
                  <Card key={idx} className={trial.selected ? "border-primary" : ""}>
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-3">
                        <Checkbox 
                          checked={trial.selected}
                          onCheckedChange={() => toggleTrialSelection(idx)}
                          className="mt-1"
                        />
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="font-semibold">{trial.studyName}</div>
                              <div className="text-sm text-muted-foreground">{trial.endpoint}</div>
                            </div>
                            <Badge className={getRelevanceColor(trial.relevanceScore)}>
                              {trial.relevanceScore}% Relevant
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div><span className="font-medium">Treatment:</span> {trial.treatment}</div>
                            <div><span className="font-medium">Control:</span> {trial.control}</div>
                          </div>
                          <div className="bg-muted/50 p-3 rounded text-sm space-y-2">
                            <div><span className="font-semibold">Why this matters:</span> {trial.narrativeFit}</div>
                            <div><span className="font-semibold">Suggested usage:</span> {trial.suggestedUsage}</div>
                            <div><span className="font-semibold">Audience fit:</span> {trial.audienceAlignment}</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Efficacy Data */}
            {efficacy.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Efficacy Data ({efficacy.filter(e => e.selected).length}/{efficacy.length} selected)</h3>
                {efficacy.map((eff, idx) => (
                  <Card key={idx} className={eff.selected ? "border-primary" : ""}>
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-3">
                        <Checkbox 
                          checked={eff.selected}
                          onCheckedChange={() => toggleEfficacySelection(idx)}
                          className="mt-1"
                        />
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="font-semibold">{eff.metric}</div>
                              <div className="text-sm text-muted-foreground">{eff.timePoint}</div>
                            </div>
                            <Badge className={getRelevanceColor(eff.relevanceScore)}>
                              {eff.relevanceScore}% Relevant
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div><span className="font-medium">Value:</span> {eff.value}</div>
                            <div><span className="font-medium">Comparison:</span> {eff.comparison}</div>
                          </div>
                          <div className="bg-muted/50 p-3 rounded text-sm space-y-2">
                            <div><span className="font-semibold">Why this matters:</span> {eff.narrativeFit}</div>
                            <div><span className="font-semibold">Suggested usage:</span> {eff.suggestedUsage}</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Safety Data */}
            {safety.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Safety Data ({safety.filter(s => s.selected).length}/{safety.length} selected)</h3>
                {safety.map((saf, idx) => (
                  <Card key={idx} className={saf.selected ? "border-primary" : ""}>
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-3">
                        <Checkbox 
                          checked={saf.selected}
                          onCheckedChange={() => toggleSafetySelection(idx)}
                          className="mt-1"
                        />
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="font-semibold">{saf.adverseEvent}</div>
                              <div className="text-sm text-muted-foreground">Severity: {saf.severity}</div>
                            </div>
                            <Badge className={getRelevanceColor(saf.relevanceScore)}>
                              {saf.relevanceScore}% Relevant
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div><span className="font-medium">Incidence:</span> {saf.incidence}</div>
                            <div><span className="font-medium">Comparison:</span> {saf.comparison}</div>
                          </div>
                          <div className="bg-muted/50 p-3 rounded text-sm space-y-2">
                            <div><span className="font-semibold">Why this matters:</span> {saf.narrativeFit}</div>
                            <div><span className="font-semibold">Suggested usage:</span> {saf.suggestedUsage}</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Import Actions */}
            <div className="flex gap-3 pt-4 border-t">
              <Button onClick={handleImportSelected} className="flex-1" size="lg">
                Import Selected Data ({trials.filter(t => t.selected).length + efficacy.filter(e => e.selected).length + safety.filter(s => s.selected).length})
              </Button>
              <Button onClick={() => analyzePI()} variant="outline">
                Re-analyze
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};