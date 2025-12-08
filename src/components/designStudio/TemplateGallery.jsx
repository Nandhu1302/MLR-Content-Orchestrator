import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Layout, Star, TrendingUp, Check } from 'lucide-react';
// TypeScript type imports removed
// import type { DesignTemplate, TemplateRecommendation } from '@/types/designStudio';
// import type { ContentAsset, ContentVariation } from '@/types/content';
import { TemplateRecommendationService } from '@/services/templateRecommendationService';

// Interface and type annotations removed
export const TemplateGallery = ({
  brandId,
  asset,
  variation,
  onSelectTemplate,
  selectedTemplateId
}) => {
  const [allTemplates, setAllTemplates] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('recommended');

  useEffect(() => {
    loadTemplates();
  }, [brandId, asset]);

  const loadTemplates = async () => {
    setLoading(true);
    
    try {
      // Load all templates
      const { data: templates } = await supabase
        .from('design_templates') // Removed 'as any'
        .select('*')
        .eq('brand_id', brandId)
        .eq('is_active', true)
        .order('template_name');

      if (templates) {
        setAllTemplates(templates); // Removed 'as any[]'
      }

      // Get recommendations if asset is provided
      if (asset) {
        const factors = variation?.personalization_factors; // Removed 'as any'
        const recs = await TemplateRecommendationService.recommendTemplates(
          asset,
          variation,
          factors
        );
        setRecommendations(recs);
      }
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading templates...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v)}> // Removed 'as any'
        <TabsList>
          <TabsTrigger value="recommended">
            <Star className="w-4 h-4 mr-2" />
            Recommended ({recommendations.length})
          </TabsTrigger>
          <TabsTrigger value="all">
            <Layout className="w-4 h-4 mr-2" />
            All Templates ({allTemplates.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recommended" className="space-y-4">
          {recommendations.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">
                No recommended templates. Select content from Content Studio to see personalized recommendations.
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendations.map((rec) => (
                <TemplateCard
                  key={rec.template.id}
                  template={rec.template}
                  score={rec.score}
                  reasoning={rec.reasoning}
                  isSelected={rec.template.id === selectedTemplateId}
                  onSelect={() => onSelectTemplate(rec.template)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          {allTemplates.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground mb-4">
                No templates found. Initialize templates to get started.
              </p>
              <Button onClick={() => window.location.reload()}>
                Refresh Templates
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  isSelected={template.id === selectedTemplateId}
                  onSelect={() => onSelectTemplate(template)}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Interface and type annotations removed
const TemplateCard = ({
  template,
  score,
  reasoning,
  isSelected,
  onSelect
}) => {
  return (
    <Card 
      className={`p-4 cursor-pointer transition-all hover:shadow-lg ${
        isSelected ? 'ring-2 ring-primary' : ''
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-1">{template.template_name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {template.description}
          </p>
        </div>
        {isSelected && (
          <div className="ml-2 bg-primary text-primary-foreground rounded-full p-1">
            <Check className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="flex gap-2 mb-3 flex-wrap">
        <Badge variant="secondary">
          <Layout className="w-3 h-3 mr-1" />
          {template.template_category}
        </Badge>
        {score && (
          <Badge variant="outline" className="bg-green-50">
            <TrendingUp className="w-3 h-3 mr-1" />
            {score}% match
          </Badge>
        )}
        {template.performance_history?.avgEngagement > 70 && (
          <Badge variant="outline">
            {template.performance_history.avgEngagement}% engagement
          </Badge>
        )}
      </div>

      {template.tags && template.tags.length > 0 && (
        <div className="flex gap-1 mb-3 flex-wrap">
          {template.tags.slice(0, 3).map(tag => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {reasoning && reasoning.length > 0 && (
        <div className="mt-3 pt-3 border-t">
          <p className="text-xs font-medium text-muted-foreground mb-2">Why recommended:</p>
          <ul className="space-y-1">
            {reasoning.slice(0, 2).map((reason, i) => (
              <li key={i} className="text-xs text-muted-foreground flex items-start">
                <span className="text-primary mr-1">•</span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-3 text-xs text-muted-foreground">
        {template.base_layout.dimensions.width} × {template.base_layout.dimensions.height}px
        {' • '}
        {template.base_layout.zones.length} zones
      </div>
    </Card>
  );
};