import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RefreshCw, Download, Calendar, TrendingUp, Shield, Sparkles, ExternalLink, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { useGuardrails } from '@/hooks/useGuardrails';
import { useToast } from '@/hooks/use-toast';
import { PublicDomainIntelligenceService } from '@/services/publicDomainIntelligenceService';
import { useBrand } from '@/contexts/BrandContext';
import { supabase } from '@/integrations/supabase/client';

export const GuardrailsAdminDrawer = ({ open, onOpenChange }) => {
  const { selectedBrand } = useBrand();
  const { 
    status, 
    intelligenceMetadata, 
    isRefreshing, 
    refreshIntelligence,
    daysSinceReview,
    freshInsightsCount
  } = useGuardrails();
  const { toast } = useToast();
  const [insights, setInsights] = useState([]);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [refreshLogs, setRefreshLogs] = useState([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);

  const handleRefreshIntelligence = async () => {
    if (!selectedBrand) return;
    
    try {
      await refreshIntelligence();
      toast({
        title: "Intelligence Refreshed",
        description: "Guardrails have been enriched with latest market intelligence",
      });
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Unable to refresh intelligence. Please try again.",
        variant: "destructive",
      });
    }
  };

  const loadInsights = async () => {
    if (!selectedBrand) return;
    
    setIsLoadingInsights(true);
    try {
      const result = await PublicDomainIntelligenceService.getBrandInsights(
        selectedBrand.id,
        'all',
        10
      );
      setInsights(result);
    } catch (error) {
      console.error('Error loading insights:', error);
    } finally {
      setIsLoadingInsights(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const loadRefreshLogs = async () => {
    if (!selectedBrand) return;
    
    setIsLoadingLogs(true);
    try {
      const { data, error } = await supabase
        .from('intelligence_refresh_log')
        .select('*')
        .eq('brand_id', selectedBrand.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setRefreshLogs(data || []);
    } catch (error) {
      console.error('Error loading refresh logs:', error);
    } finally {
      setIsLoadingLogs(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[80%] overflow-y-auto px-8">
        <SheetHeader className="sticky top-0 bg-background z-10 pb-6 pt-2">
          <SheetTitle className="flex items-center gap-3 text-3xl">
            <Shield className="h-7 w-7" />
            Brand Guardrails Administration
          </SheetTitle>
        </SheetHeader>

        <Tabs defaultValue="overview" className="w-full" onValueChange={(v) => {
          if (v === 'intelligence') loadInsights();
          if (v === 'refresh-history') loadRefreshLogs();
        }}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="intelligence">
              <Sparkles className="h-4 w-4 mr-1" />
              Intelligence
            </TabsTrigger>
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="refresh-history">Refresh History</TabsTrigger>
            <TabsTrigger value="audit">Audit</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Review Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Shield className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <p className="text-2xl font-bold">
                        {status?.staleness_level === 'fresh' ? 'Fresh' : 
                         status?.staleness_level === 'warning' ? 'Warning' : 'Critical'}
                      </p>
                      <p className="text-xs text-muted-foreground">Current Status</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Last Review</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <p className="text-2xl font-bold">{daysSinceReview}d</p>
                      <p className="text-xs text-muted-foreground">Days Ago</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Intelligence</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <p className="text-2xl font-bold">{intelligenceMetadata?.total_insights || 0}</p>
                      <p className="text-xs text-muted-foreground">
                        {freshInsightsCount > 0 ? `+${freshInsightsCount} fresh` : 'Total Insights'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1" 
                onClick={handleRefreshIntelligence}
                disabled={isRefreshing}
              >
                {isRefreshing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Refreshing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh Intelligence
                  </>
                )}
              </Button>
              <Button variant="outline" className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Intelligence Status</CardTitle>
                <CardDescription>Real-time public domain intelligence enrichment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Status</span>
                    <Badge variant={
                      intelligenceMetadata?.intelligence_status === 'fresh' ? 'default' : 
                      intelligenceMetadata?.intelligence_status === 'stale' ? 'secondary' : 'outline'
                    }>
                      {intelligenceMetadata?.intelligence_status || 'none'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Last Refresh</span>
                    <span className="text-sm text-muted-foreground">
                      {intelligenceMetadata?.last_refresh 
                        ? formatDate(intelligenceMetadata.last_refresh)
                        : 'Never'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Fresh Insights</span>
                    <span className="text-sm font-medium text-green-600">
                      {freshInsightsCount}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Intelligence Feed Tab */}
          <TabsContent value="intelligence" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Public Domain Intelligence
                </CardTitle>
                <CardDescription>
                  Real-time insights from competitive analysis, regulatory updates, and market research
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingInsights ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-muted rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : insights.length > 0 ? (
                  <ScrollArea className="h-[500px] pr-4">
                    <div className="space-y-4">
                      {insights.map((insight, index) => (
                        <Card key={index} className="border-l-4 border-l-primary">
                          <CardHeader className="pb-2">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <CardTitle className="text-sm font-semibold">
                                  {insight.title}
                                </CardTitle>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="outline" className="text-xs">
                                    {insight.source_type}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {formatDate(insight.discovered_at)}
                                  </span>
                                </div>
                              </div>
                              <Badge variant="secondary">
                                {Math.round(insight.relevance_score || 0)}%
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground mb-2">
                              {insight.summary}
                            </p>
                            {insight.key_findings && insight.key_findings.length > 0 && (
                              <div className="space-y-1 mt-2">
                                <p className="text-xs font-semibold">Key Findings:</p>
                                <ul className="list-disc list-inside space-y-1">
                                  {insight.key_findings.slice(0, 3).map((finding, i) => (
                                    <li key={i} className="text-xs text-muted-foreground">
                                      {finding}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {insight.source_url && (
                              <Button 
                                variant="link" 
                                size="sm" 
                                className="mt-2 p-0 h-auto"
                                onClick={() => window.open(insight.source_url, '_blank')}
                              >
                                <ExternalLink className="h-3 w-3 mr-1" />
                                View Source
                              </Button>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="text-center py-8">
                    <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">
                      No intelligence insights available yet
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-4"
                      onClick={handleRefreshIntelligence}
                      disabled={isRefreshing}
                    >
                      <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                      Collect Intelligence
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Editor Tab */}
          <TabsContent value="editor" className="space-y-6 mt-6">
            <div className="text-center py-16 text-muted-foreground">
              <Shield className="h-16 w-16 mx-auto mb-6 opacity-50" />
              <p className="text-lg mb-2">Guardrails management interface</p>
              <p className="text-base mt-3">Add, edit, and organize brand compliance rules</p>
            </div>
          </TabsContent>

          {/* Refresh History Tab */}
          <TabsContent value="refresh-history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Intelligence Refresh History
                </CardTitle>
                <CardDescription>
                  Track all automated and manual intelligence refresh operations
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingLogs ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-muted rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : refreshLogs.length > 0 ? (
                  <ScrollArea className="h-[500px] pr-4">
                    <div className="space-y-3">
                      {refreshLogs.map((log) => (
                        <Card key={log.id} className={`border-l-4 ${
                          log.status === 'completed' ? 'border-l-green-500' :
                          log.status === 'failed' ? 'border-l-red-500' :
                          'border-l-yellow-500'
                        }`}>
                          <CardContent className="pt-4">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                {log.status === 'completed' ? (
                                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                                ) : log.status === 'failed' ? (
                                  <XCircle className="h-5 w-5 text-red-500" />
                                ) : (
                                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                                )}
                                <div>
                                  <p className="font-semibold text-sm">
                                    {log.refresh_type === 'scheduled' ? 'Automated Refresh' : 'Manual Refresh'}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {formatDateTime(log.started_at)}
                                  </p>
                                </div>
                              </div>
                              <Badge variant={
                                log.status === 'completed' ? 'default' :
                                log.status === 'failed' ? 'destructive' :
                                'secondary'
                              }>
                                {log.status}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
                              <div>
                                <p className="text-xs text-muted-foreground">Sources Checked</p>
                                <p className="font-semibold">{log.sources_checked}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Insights Found</p>
                                <p className="font-semibold">{log.insights_found}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Duration</p>
                                <p className="font-semibold">{log.duration_seconds || 0}s</p>
                              </div>
                            </div>

                            {log.error_message && (
                              <div className="mt-3 p-2 bg-destructive/10 rounded text-xs text-destructive">
                                Error: {log.error_message}
                              </div>
                            )}

                            {log.status === 'completed' && (
                              <div className="mt-2 text-xs text-muted-foreground">
                                ✓ Guardrails enriched with {log.insights_found} new insights
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">
                      No refresh history available yet
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Intelligence refreshes run automatically every Sunday at 2 AM UTC
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-4"
                      onClick={handleRefreshIntelligence}
                      disabled={isRefreshing}
                    >
                      <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                      Run Manual Refresh
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audit Tab */}
          <TabsContent value="audit" className="space-y-6 mt-6">
            <div className="text-center py-16 text-muted-foreground">
              <TrendingUp className="h-16 w-16 mx-auto mb-6 opacity-50" />
              <p className="text-lg mb-2">Audit trail</p>
              <p className="text-base mt-3">View all changes and modifications to guardrails</p>
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};