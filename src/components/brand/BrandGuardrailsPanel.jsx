import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, Eye, Target, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useBrand } from '@/contexts/BrandContext';
import { GuardrailsService } from '@/services/guardrailsService';
import { toast } from 'sonner';

const BrandGuardrailsPanel = ({ onClose }) => {
  const { selectedBrand } = useBrand();
  const [guardrails, setGuardrails] = useState(null);
  const [competitorInsights, setCompetitorInsights] = useState([]);
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (selectedBrand) {
      loadGuardrails();
    }
  }, [selectedBrand]);

  const loadGuardrails = async () => {
    if (!selectedBrand) return;
    
    setIsLoading(true);
    try {
      const [guardrailsData, competitorData] = await Promise.all([
        GuardrailsService.getGuardrails(selectedBrand.id),
        GuardrailsService.getCompetitorInsights(selectedBrand.id)
      ]);
      
      setGuardrails(guardrailsData);
      setCompetitorInsights(competitorData);
      setStatus(GuardrailsService.getGuardrailsStatus(guardrailsData));
    } catch (error) {
      console.error('Error loading guardrails:', error);
      toast.error('Failed to load brand guardrails');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsReviewed = async () => {
    if (!selectedBrand) return;
    
    try {
      await GuardrailsService.markAsReviewed(selectedBrand.id);
      await loadGuardrails();
      toast.success('Guardrails marked as reviewed');
    } catch (error) {
      console.error('Error marking as reviewed:', error);
      toast.error('Failed to update review status');
    }
  };

  const getStalenessColor = (level) => {
    switch (level) {
      case 'critical': return 'destructive';
      case 'warning': return 'secondary';
      default: return 'default';
    }
  };

  const getThreatLevelColor = (level) => {
    switch (level) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      default: return 'default';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-primary" />
            <div>
              <CardTitle className="text-xl">Brand Guardrails</CardTitle>
              <p className="text-sm text-muted-foreground">
                {selectedBrand?.brand_name} • Content Generation Guidelines
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {status && (
              <Badge variant={getStalenessColor(status.staleness_level)}>
                {status.staleness_level === 'critical' && <AlertTriangle className="h-3 w-3 mr-1" />}
                {status.staleness_level === 'warning' && <Eye className="h-3 w-3 mr-1" />}
                {status.staleness_level === 'fresh' && <CheckCircle className="h-3 w-3 mr-1" />}
                {status.days_since_review} days ago
              </Badge>
            )}
            <Button variant="outline" size="sm" onClick={handleMarkAsReviewed}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark Reviewed
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>×</Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <Tabs defaultValue="guidelines" className="w-full">
          <TabsList className="grid w-full grid-cols-3 px-6">
            <TabsTrigger value="guidelines">Brand Guidelines</TabsTrigger>
            <TabsTrigger value="competitive">Competitive Intel</TabsTrigger>
            <TabsTrigger value="regulatory">Regulatory</TabsTrigger>
          </TabsList>

          <div className="px-6 pb-6">
            <TabsContent value="guidelines" className="space-y-4 mt-4">
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {/* Key Messages */}
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Key Brand Messages
                    </h4>
                    <div className="space-y-1">
                      {guardrails?.key_messages.map((message, index) => (
                        <div key={index} className="text-sm bg-muted/50 rounded p-2">
                          {message}
                        </div>
                      )) || <p className="text-sm text-muted-foreground">No key messages defined</p>}
                    </div>
                  </div>

                  <Separator />

                  {/* Tone Guidelines */}
                  <div>
                    <h4 className="font-medium mb-2">Tone Guidelines</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Primary Tone</p>
                        <p className="text-sm">{guardrails?.tone_guidelines.primary || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Secondary Tone</p>
                        <p className="text-sm">{guardrails?.tone_guidelines.secondary || 'Not specified'}</p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm font-medium text-muted-foreground mb-1">Tone Descriptors</p>
                      <div className="flex flex-wrap gap-1">
                        {guardrails?.tone_guidelines.descriptors.map((descriptor, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {descriptor}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Visual Standards */}
                  <div>
                    <h4 className="font-medium mb-2">Visual Standards</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Logo Usage: </span>
                        {guardrails?.visual_standards.logo_usage || 'No guidelines specified'}
                      </div>
                      <div>
                        <span className="font-medium">Color Guidelines: </span>
                        {guardrails?.visual_standards.color_guidelines || 'No guidelines specified'}
                      </div>
                      <div>
                        <span className="font-medium">Imagery Style: </span>
                        {guardrails?.visual_standards.imagery_style || 'No guidelines specified'}
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="competitive" className="mt-4">
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {/* Market Positioning */}
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Market Positioning
                    </h4>
                    <div className="text-sm bg-muted/50 rounded p-3">
                      {guardrails?.market_positioning || 'No positioning statement defined'}
                    </div>
                  </div>

                  <Separator />

                  {/* Competitive Advantages */}
                  <div>
                    <h4 className="font-medium mb-2">Our Competitive Advantages</h4>
                    <div className="space-y-1">
                      {guardrails?.competitive_advantages.map((advantage, index) => (
                        <div key={index} className="text-sm bg-primary/5 border border-primary/20 rounded p-2">
                          ✓ {advantage}
                        </div>
                      )) || <p className="text-sm text-muted-foreground">No competitive advantages defined</p>}
                    </div>
                  </div>

                  <Separator />

                  {/* Competitor Insights */}
                  <div>
                    <h4 className="font-medium mb-2">Competitor Intelligence</h4>
                    <div className="space-y-3">
                      {competitorInsights.map((competitor, index) => (
                        <div key={index} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium">{competitor.competitor_name}</h5>
                            <Badge variant={getThreatLevelColor(competitor.threat_level)}>
                              {competitor.threat_level} threat
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <div>
                              <p className="font-medium text-muted-foreground mb-1">Our Advantages</p>
                              <ul className="space-y-1">
                                {competitor.competitive_advantages_vs_them.map((advantage, i) => (
                                  <li key={i} className="text-xs">• {advantage}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <p className="font-medium text-muted-foreground mb-1">Messaging Gaps</p>
                              <ul className="space-y-1">
                                {competitor.messaging_gaps.map((gap, i) => (
                                  <li key={i} className="text-xs">• {gap}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      ))}
                      {competitorInsights.length === 0 && (
                        <p className="text-sm text-muted-foreground">No competitor insights available</p>
                      )}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="regulatory" className="mt-4">
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Regulatory Requirements</h4>
                    <div className="text-sm text-muted-foreground">
                      Regulatory requirements will be populated from brand regulatory profiles.
                      This ensures all content meets compliance standards for target markets.
                    </div>
                  </div>
                  
                  <div className="text-center py-8">
                    <p className="text-sm text-muted-foreground">
                      Regulatory compliance features coming soon
                    </p>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default BrandGuardrailsPanel;