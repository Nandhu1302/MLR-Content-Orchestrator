
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Layout, Star, TrendingUp, Check } from 'lucide-react';
import { TemplateRecommendationService } from '@/services/templateRecommendationService';

export const TemplateGallery = ({ brandId, asset, variation, onSelectTemplate, selectedTemplateId }) => {
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
        .from('design_templates')
        .select('*')
        .eq('brand_id', brandId)
        .eq('is_active', true)
        .order('template_name');

      if (templates) {
        setAllTemplates(templates);
      }

      // Get recommendations if asset is provided
      if (asset) {
        const factors = variation?.personalization_factors;
        const recs = await TemplateRecommendationService.recommendTemplates(asset, variation, factors);
        setRecommendations(recs);
      }
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading templates...</div>;
  }

  return (
    <div>
      <Tabs defaultValue="recommended" onValueChange={(v) => setActiveTab(v)}>
        <TabsList>
          <TabsTrigger value="recommended">Recommended ({recommendations.length})</TabsTrigger>
          <TabsTrigger value="all">All Templates ({allTemplates.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="recommended" className="mt-4">
          {recommendations.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              No recommended templates. Select content from Content Studio to see personalized recommendations.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendations.map((rec, idx) => (
                <TemplateCard
                  key={idx}
                  template={rec.template}
                  score={rec.score}
                  reasoning={rec.reasoning}
                  isSelected={selectedTemplateId === rec.template.id}
                  onSelect={() => onSelectTemplate(rec.template)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="all" className="mt-4">
          {allTemplates.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              No templates found. Initialize templates to get started.
              <Button variant="outline" size="sm" onClick={() => window.location.reload()} className="ml-2">
                Refresh Templates
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  isSelected={selectedTemplateId === template.id}
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

const TemplateCard = ({ template, score, reasoning, isSelected, onSelect }) => {
  return (
    <Card
      className={`p-4 border rounded-lg cursor-pointer ${isSelected ? 'border-primary' : 'border-muted'}`}
      onClick={onSelect}
    >
      <h4 className="text-lg font-semibold mb-2">{template.template_name}</h4>
      <p className="text-sm text-muted-foreground mb-2">{template.description}</p>
      {isSelected && <Badge variant="success">Selected</Badge>}
      <div className="text-xs text-muted-foreground mb-2">{template.template_category}</div>
      {score && <div className="text-xs text-primary">{score}% match</div>}
      {template.performance_history?.avgEngagement > 70 && (
        <div className="text-xs text-green-600">{template.performance_history.avgEngagement}% engagement</div>
      )}
      {template.tags && template.tags.length > 0 && (
        <div className="flex gap-1 mt-2">
          {template.tags.slice(0, 3).map((tag, i) => (
            <Badge key={i} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      )}
      {reasoning && reasoning.length > 0 && (
        <div className="mt-2 text-xs">
          <p className="font-semibold">Why recommended:</p>
          <ul className="list-disc pl-4">
            {reasoning.slice(0, 2).map((reason, i) => (
              <li key={i}>{reason}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="text-xs text-muted-foreground mt-2">
        {template.base_layout.dimensions.width} × {template.base_layout.dimensions.height}px •{' '}
        {template.base_layout.zones.length} zones
      </div>
    </Card>
  );
};
