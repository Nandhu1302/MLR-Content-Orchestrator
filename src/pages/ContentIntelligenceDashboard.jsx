
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBrand } from '@/contexts/BrandContext';
import { ArrowLeft, TrendingUp, Target, Layers, Sparkles } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const ContentIntelligenceDashboard = () => {
  const navigate = useNavigate();
  const { selectedBrand } = useBrand();
  const [activeTab, setActiveTab] = useState('elements');

  // Fetch content element performance
  const { data: contentElements, isLoading: elementsLoading } = useQuery({
    queryKey: ['content-elements', selectedBrand?.id],
    queryFn: async () => {
      if (!selectedBrand?.id) return [];
      const { data, error } = await supabase
        .from('content_element_performance')
        .select('*')
        .eq('brand_id', selectedBrand.id)
        .order('avg_performance_score', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!selectedBrand?.id,
  });

  // Fetch attribution data
  const { data: attributionData, isLoading: attributionLoading } = useQuery({
    queryKey: ['content-attribution', selectedBrand?.id],
    queryFn: async () => {
      if (!selectedBrand?.id) return [];
      const { data, error } = await supabase
        .from('content_performance_attribution')
        .select('*')
        .eq('brand_id', selectedBrand.id)
        .order('measurement_date', { ascending: false })
        .limit(100);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!selectedBrand?.id,
  });

  // Fetch success patterns (simplified - using content_element_performance)
  const { data: successPatterns, isLoading: patternsLoading } = useQuery({
    queryKey: ['success-patterns', selectedBrand?.id],
    queryFn: async () => {
      if (!selectedBrand?.id) return [];
      const { data, error } = await supabase
        .from('content_element_performance')
        .select('*')
        .eq('brand_id', selectedBrand.id)
        .gte('avg_performance_score', 40)
        .order('avg_performance_score', { ascending: false })
        .limit(20);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!selectedBrand?.id,
  });

  // Relationships not available in current schema
  const contentRelationships = [];
  const relationshipsLoading = false;

  const topSubjectLines =
    contentElements?.filter((e) => e.element_type === 'subject_line').slice(0, 10) ?? [];
  const topCTAs = contentElements?.filter((e) => e.element_type === 'cta').slice(0, 10) ?? [];
  const topThemes =
    contentElements?.filter((e) => e.element_type === 'message_theme').slice(0, 8) ?? [];
  const topTones = contentElements?.filter((e) => e.element_type === 'tone').slice(0, 5) ?? [];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Content Intelligence</h1>
            <p className="text-muted-foreground">
              Deep dive into content performance, elements, and attribution
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              💡 This page has been consolidated into the new{" "}
              <button
                onClick={() => navigate("/intelligence")}
                className="text-primary hover:underline font-medium"
              >
                Intelligence Hub
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Content Elements Tracked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contentElements?.length ?? 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Subject lines, CTAs, themes, tones
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Attribution Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attributionData?.length ?? 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Multi-touch content journeys
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Success Patterns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{successPatterns?.length ?? 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              High-performing elements
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Content Tracked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contentElements?.length ?? 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Elements analyzed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="elements" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Content Elements
          </TabsTrigger>
          <TabsTrigger value="attribution" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Attribution
          </TabsTrigger>
          <TabsTrigger value="patterns" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Top Performers
          </TabsTrigger>
        </TabsList>

        {/* Content Elements Tab */}
        <TabsContent value="elements" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Top Subject Lines */}
            <Card>
              <CardHeader>
                <CardTitle>Top-Performing Subject Lines</CardTitle>
                <CardDescription>Highest engagement rates</CardDescription>
              </CardHeader>
              <CardContent>
                {elementsLoading ? (
                  <div className="text-sm text-muted-foreground">Loading...</div>
                ) : topSubjectLines.length === 0 ? (
                  <div className="text-sm text-muted-foreground">No data available</div>
                ) : (
                  <div className="space-y-3">
                    {topSubjectLines.map((sl, idx) => (
                      <div key={idx} className="border-l-2 border-primary pl-3 py-2">
                        <div className="text-sm font-medium line-clamp-2">{sl.element_value}</div>
                        <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                          <span>Engagement: {sl.avg_engagement_rate?.toFixed(1)}%</span>
                          <span>Used {sl.usage_count}x</span>
                          <span
                            className={`px-2 py-0.5 rounded ${
                              sl.confidence_level === 'high'
                                ? 'bg-green-100 text-green-700'
                                : sl.confidence_level === 'medium'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {sl.confidence_level}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Top CTAs */}
            <Card>
              <CardHeader>
                <CardTitle>Top-Performing CTAs</CardTitle>
                <CardDescription>Highest conversion rates</CardDescription>
              </CardHeader>
              <CardContent>
                {elementsLoading ? (
                  <div className="text-sm text-muted-foreground">Loading...</div>
                ) : topCTAs.length === 0 ? (
                  <div className="text-sm text-muted-foreground">No data available</div>
                ) : (
                  <div className="space-y-3">
                    {topCTAs.map((cta, idx) => (
                      <div key={idx} className="border-l-2 border-accent pl-3 py-2">
                        <div className="text-sm font-medium">{cta.element_value}</div>
                        <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                          <span>Conversion: {cta.avg_conversion_rate?.toFixed(1)}%</span>
                          <span>Used {cta.usage_count}x</span>
                          {cta.element_context && (
                            <span>Position: {cta.element_context?.position}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Top Themes */}
            <Card>
              <CardHeader>
                <CardTitle>Top Message Themes</CardTitle>
                <CardDescription>Best-performing content themes</CardDescription>
              </CardHeader>
              <CardContent>
                {elementsLoading ? (
                  <div className="text-sm text-muted-foreground">Loading...</div>
                ) : topThemes.length === 0 ? (
                  <div className="text-sm text-muted-foreground">No data available</div>
                ) : (
                  <div className="space-y-2">
                    {topThemes.map((theme, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm font-medium">{theme.element_value}</span>
                        <span className="text-sm text-muted-foreground">
                          {theme.avg_performance_score?.toFixed(0)} score
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Top Tones */}
            <Card>
              <CardHeader>
                <CardTitle>Top Content Tones</CardTitle>
                <CardDescription>Most engaging tone styles</CardDescription>
              </CardHeader>
              <CardContent>
                {elementsLoading ? (
                  <div className="text-sm text-muted-foreground">Loading...</div>
                ) : topTones.length === 0 ? (
                  <div className="text-sm text-muted-foreground">No data available</div>
                ) : (
                  <div className="space-y-2">
                    {topTones.map((tone, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm font-medium capitalize">{tone.element_value}</span>
                        <span className="text-sm text-muted-foreground">
                          {tone.avg_engagement_rate?.toFixed(1)}% engagement
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Attribution Tab */}
        <TabsContent value="attribution">
          <Card>
            <CardHeader>
              <CardTitle>Content Attribution Analysis</CardTitle>
              <CardDescription>Multi-touch content journey performance</CardDescription>
            </CardHeader>
            <CardContent>
              {attributionLoading ? (
                <div className="text-sm text-muted-foreground">Loading attribution data...</div>
              ) : attributionData && attributionData.length > 0 ? (
                <div className="space-y-2">
                  {attributionData.slice(0, 20).map((attr, idx) => (
                    <div key={idx} className="p-3 border rounded space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {attr.channel} → {attr.audience_segment}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {attr.conversion_rate?.toFixed(1)}% conversion
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Engagement: {attr.engagement_rate?.toFixed(1)}%{' '}
                        {attr.conversions} conversions
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Source: {attr.source_system}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">No attribution data available</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Success Patterns Tab */}
        <TabsContent value="patterns">
          <Card>
            <CardHeader>
              <CardTitle>Content Success Patterns</CardTitle>
              <CardDescription>Proven strategies and combinations</CardDescription>
            </CardHeader>
            <CardContent>
              {patternsLoading ? (
                <div className="text-sm text-muted-foreground">Loading patterns...</div>
              ) : successPatterns && successPatterns.length > 0 ? (
                <div className="space-y-4">
                  {successPatterns.map((pattern, idx) => (
                    <div key={idx} className="p-4 border rounded space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-medium capitalize">
                            {pattern.element_type}: {pattern.element_value}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Top performing in {pattern.top_performing_audience}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {pattern.avg_performance_score?.toFixed(0)} score
                          </div>
                          <div className="text-xs text-muted-foreground">{pattern.usage_count} uses</div>
                        </div>
                      </div>
                      <div className="text-xs space-y-1 mt-2 bg-muted p-2 rounded">
                        <div>Engagement: {pattern.avg_engagement_rate?.toFixed(1)}%</div>
                        <div>Conversion: {pattern.avg_conversion_rate?.toFixed(1)}%</div>
                        <div>Confidence: {pattern.confidence_level}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">No success patterns identified yet</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Relationships Tab */}
        <TabsContent value="relationships">
          <Card>
            <CardHeader>
              <CardTitle>Content Relationships</CardTitle>
              <CardDescription>Content pieces frequently viewed together</CardDescription>
            </CardHeader>
            <CardContent>
              {relationshipsLoading ? (
                <div className="text-sm text-muted-foreground">Loading relationships...</div>
              ) : contentRelationships && contentRelationships.length > 0 ? (
                <div className="space-y-2">
                  {contentRelationships.map((rel, idx) => (
                    <div key={idx} className="p-3 border rounded">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium capitalize">
                          {rel.relationship_type?.replace('_', ' ')}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          Strength: {(rel.relationship_strength * 100).toFixed(0)}%
                        </span>
                      </div>
                      {rel.relationship_data && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {JSON.stringify(rel.relationship_data?.co_view_count ?? rel.relationship_data?.context)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">No content relationships found</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
