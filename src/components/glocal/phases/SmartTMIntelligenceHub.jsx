import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowRight, Database, TrendingUp, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const SmartTMIntelligenceHub = ({ 
  onPhaseComplete, 
  onNext,
  projectData,
  phaseData 
}) => {
  const { toast } = useToast();
  const [analyzing, setAnalyzing] = useState(false);
  const [tmMatches, setTmMatches] = useState([]);
  const [leverageScore, setLeverageScore] = useState(0);

  useEffect(() => {
    // Simulate TM analysis
    if (phaseData && phaseData.phase1) {
      analyzeTMMatches();
    }
  }, [phaseData]);

  const analyzeTMMatches = async () => {
    setAnalyzing(true);
    
    // Simulate analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate mock TM matches
    const sourceSegments = phaseData?.phase1?.sourceContent?.split('\n').filter((s) => s.trim()) || [];
    const matches = sourceSegments.slice(0, 5).map((segment, idx) => ({
      id: `tm-${idx}`,
      sourceText: segment,
      matchScore: 75 + Math.random() * 25,
      matchType: ['exact', 'fuzzy', 'context'][Math.floor(Math.random() * 3)],
      savedWords: Math.floor(segment.split(' ').length * (0.5 + Math.random() * 0.5)),
      costSavings: (segment.split(' ').length * 0.15 * (0.5 + Math.random() * 0.5)).toFixed(2)
    }));
    
    setTmMatches(matches);
    setLeverageScore(68 + Math.random() * 20);
    setAnalyzing(false);
  };

  const handleComplete = () => {
    const phaseData = {
      tmMatches,
      leverageScore,
      analyzedAt: new Date().toISOString()
    };

    onPhaseComplete(phaseData);
    toast({
      title: 'Phase 2 Complete',
      description: `TM leverage: ${leverageScore.toFixed(1)}%`
    });
    onNext();
  };

  return (
    <Tabs defaultValue="analysis" className="flex-1 flex flex-col overflow-hidden">
      <TabsList className="grid w-full grid-cols-2 shrink-0">
        <TabsTrigger value="analysis">TM Analysis</TabsTrigger>
        <TabsTrigger value="report">Optimization Report</TabsTrigger>
      </TabsList>

      <TabsContent value="analysis" className="flex-1 flex flex-col overflow-hidden mt-0 data-[state=inactive]:hidden">
        {/* Phase Name Header - Below tabs */}
        <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
          <div>
            <h3 className="text-lg font-semibold">Translation Memory Intelligence</h3>
            <p className="text-sm text-muted-foreground">
              Analyzing reusable translations for cost optimization
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-muted-foreground">
              TM Leverage: {leverageScore.toFixed(1)}%
            </div>
            <Progress value={leverageScore} className="w-32" />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Translation Memory Matches
                </CardTitle>
                <CardDescription>
                  Identified reusable translations from your translation memory
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {analyzing ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-pulse text-center">
                      <Database className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <p className="text-sm text-muted-foreground">Analyzing translation memory...</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {tmMatches.map((match) => (
                      <Card key={match.id} className="border-l-4 border-l-primary">
                        <CardContent className="pt-4">
                          <div className="space-y-2">
                            <div className="flex items-start justify-between gap-4">
                              <p className="text-sm flex-1">{match.sourceText}</p>
                              <Badge variant={match.matchType === 'exact' ? 'default' : 'secondary'}>
                                {match.matchScore.toFixed(0)}% {match.matchType}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <TrendingUp className="h-3 w-3" />
                                {match.savedWords} words saved
                              </span>
                              <span>${match.costSavings} cost savings</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Button onClick={handleComplete} size="lg" className="w-full" disabled={analyzing}>
              Complete Phase 2 <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </ScrollArea>
      </TabsContent>

      <TabsContent value="report" className="flex-1 flex flex-col overflow-hidden mt-0 data-[state=inactive]:hidden">
        {/* Phase Name Header - Below tabs */}
        <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
          <div>
            <h3 className="text-lg font-semibold">Optimization Report</h3>
            <p className="text-sm text-muted-foreground">
              Recommendations for improving translation efficiency
            </p>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-6">
            <Card>
              <CardHeader>
                <CardTitle>Optimization Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">High TM match rate detected</p>
                      <p className="text-xs text-muted-foreground">
                        Leverage existing translations for consistency and cost savings
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Segment structure optimized</p>
                      <p className="text-xs text-muted-foreground">
                        Content is well-structured for translation workflow
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Terminology standardization needed</p>
                      <p className="text-xs text-muted-foreground">
                        Some segments could benefit from glossary alignment
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );
};