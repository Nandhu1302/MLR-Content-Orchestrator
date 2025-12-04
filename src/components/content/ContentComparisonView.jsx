import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Sparkles, FileText, ArrowLeftRight, RefreshCw, CheckCircle2, XCircle } from 'lucide-react';
import { Loader2 } from 'lucide-react';

export const ContentComparisonView = ({
  assetId,
  brandId,
  themeId,
  themeData,
  intakeContext,
  selectedLayers
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [enrichedContent, setEnrichedContent] = useState(null);
  const [basicContent, setBasicContent] = useState(null);
  const [activeView, setActiveView] = useState('side-by-side');

  const generateComparison = async () => {
    setIsGenerating(true);
    try {
      toast({
        title: 'Generating comparison',
        description: 'Creating content versions...'
      });

      // Generate basic content (no intelligence layers)
      const { data: basicResult, error: basicError } = await supabase.functions.invoke(
        'generate-initial-content',
        {
          body: {
            brandId,
            themeData,
            intakeContext,
            assetType: 'email',
            intelligenceLayers: []
          }
        }
      );

      if (basicError) throw basicError;

      // Fetch intelligence layers
      const { data: intelligenceLayers, error: intelligenceError } = await supabase
        .from('theme_intelligence')
        .select('*')
        .eq('theme_id', themeId)
        .eq('incorporated', true);

      if (intelligenceError) throw intelligenceError;

      // Generate enriched content (with intelligence layers)
      const { data: enrichedResult, error: enrichedError } = await supabase.functions.invoke(
        'generate-initial-content',
        {
          body: {
            brandId,
            themeData,
            intakeContext,
            assetType: 'email',
            intelligenceLayers: intelligenceLayers || []
          }
        }
      );

      if (enrichedError) throw enrichedError;

      setBasicContent(basicResult.content);
      setEnrichedContent(enrichedResult.content);
      
      toast({
        title: 'Success',
        description: 'Comparison generated successfully!'
      });
    } catch (error) {
      console.error('Comparison generation error:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate comparison',
        variant: 'destructive'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const renderContentSection = (label, basicText = '', enrichedText = '') => {
    if (!basicText && !enrichedText) return null;
    
    return (
      <div className="space-y-2">
        <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
          {label}
        </h4>
        {activeView === 'side-by-side' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-lg border bg-card">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">Without Intelligence</span>
              </div>
              <p className="text-sm">{basicText}</p>
            </div>
            <div className="p-3 rounded-lg border bg-primary/5 border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium text-primary">With Intelligence</span>
              </div>
              <p className="text-sm">{enrichedText}</p>
            </div>
          </div>
        )}
        {activeView === 'basic' && (
          <div className="p-3 rounded-lg border bg-card">
            <p className="text-sm">{basicText}</p>
          </div>
        )}
        {activeView === 'enriched' && (
          <div className="p-3 rounded-lg border bg-primary/5 border-primary/20">
            <p className="text-sm">{enrichedText}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ArrowLeftRight className="h-5 w-5 text-primary" />
              Content Comparison
            </CardTitle>
            <CardDescription>
              Compare content generated with and without intelligence layers
            </CardDescription>
          </div>
          <Button 
            onClick={generateComparison} 
            disabled={isGenerating}
            className="gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Generate Comparison
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {!enrichedContent && !basicContent ? (
          <div className="text-center py-12 space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">See the Intelligence Difference</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Generate two versions of this content to see how intelligence layers enhance messaging,
                positioning, and compliance.
              </p>
            </div>
            <Button onClick={generateComparison} disabled={isGenerating} size="lg" className="gap-2">
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Comparison
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Tabs value={activeView} onValueChange={(v) => setActiveView(v)} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="side-by-side">Side by Side</TabsTrigger>
                  <TabsTrigger value="basic">Basic Only</TabsTrigger>
                  <TabsTrigger value="enriched">Enriched Only</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 flex-1">
                <XCircle className="h-4 w-4 text-muted-foreground" />
                <div className="text-sm">
                  <span className="font-medium">Basic Content:</span>
                  <span className="text-muted-foreground ml-1">Theme data only</span>
                </div>
              </div>
              <Separator orientation="vertical" className="h-8" />
              <div className="flex items-center gap-2 flex-1">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <div className="text-sm">
                  <span className="font-medium">Enriched Content:</span>
                  <span className="text-muted-foreground ml-1">
                    {selectedLayers.length} intelligence layers
                  </span>
                </div>
              </div>
            </div>

            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-6">
                {renderContentSection('Subject Line', basicContent?.subject, enrichedContent?.subject)}
                {renderContentSection('Headline', basicContent?.headline, enrichedContent?.headline)}
                {renderContentSection('Body Content', basicContent?.body, enrichedContent?.body)}
                {renderContentSection('Key Message', basicContent?.keyMessage, enrichedContent?.keyMessage)}
                {renderContentSection('Call to Action', basicContent?.cta, enrichedContent?.cta)}
              </div>
            </ScrollArea>

            <div className="flex justify-between items-center pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Intelligence layers demonstrate value through improved targeting, compliance, and resonance.
              </p>
              <Button onClick={generateComparison} variant="outline" size="sm" className="gap-2">
                <RefreshCw className="h-3 w-3" />
                Regenerate
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};