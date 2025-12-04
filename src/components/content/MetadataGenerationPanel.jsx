import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Tag, 
  Shield, 
  Clock,
  RefreshCw
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const MetadataGenerationPanel = ({
  content,
  assetType,
  brandId,
  onMetadataUpdate
}) => {
  // Removed unused state and complex tab logic - simplified interface
  const [metadata, setMetadata] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGenerated, setLastGenerated] = useState(null);

  // Auto-generate metadata when content changes
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (hasSignificantContent(content)) {
        generateMetadata();
      }
    }, 2000); // 2 second debounce

    return () => clearTimeout(debounceTimer);
  }, [content]);

  const hasSignificantContent = (content) => {
    const textContent = Object.values(content)
      .filter(value => typeof value === 'string' && value.trim().length > 0)
      .join(' ');
    return textContent.length > 50;
  };

  const generateMetadata = async () => {
    setIsGenerating(true);
    
    try {
      const textContent = Object.values(content)
        .filter(value => typeof value === 'string')
        .join(' ');

      // Generate only essential metadata - removed fake performance predictions
      const [taxonomyData, contentMetrics] = await Promise.all([
        generateTaxonomyMapping(textContent, assetType, brandId),
        generateContentMetrics(textContent)
      ]);

      const generatedMetadata = {
        taxonomyMapping: taxonomyData,
        contentMetrics
      };

      setMetadata(generatedMetadata);
      setLastGenerated(new Date());
      onMetadataUpdate?.(generatedMetadata);

      toast({
        title: 'Content Analyzed',
        description: 'Tags and metrics updated.'
      });

    } catch (error) {
      console.error('Metadata generation failed:', error);
      toast({
        title: 'Generation Failed',
        description: 'Unable to generate metadata. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateTaxonomyMapping = async (textContent, assetType, brandId) => {
    // Mock taxonomy generation - replace with actual service
    const suggestedTags = extractKeywords(textContent).slice(0, 8);
    const therapeuticAreas = ['Pulmonology', 'Respiratory Medicine'];
    const contentCategories = [assetType.replace(/-/g, ' '), 'Clinical Information'];
    const complianceTags = ['MLR Review Required', 'Fair Balance Needed'];

    return {
      suggested_tags: suggestedTags,
      compliance_tags: complianceTags,
      content_categories: contentCategories,
      therapeutic_areas: therapeuticAreas
    };
  };

  const generateContentMetrics = (textContent) => {
    const words = textContent.split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;
    const readingTime = Math.ceil(wordCount / 200); // ~200 WPM average
    
    // Calculate keyword density
    const keywordDensity = {};
    words.forEach(word => {
      const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');
      if (cleanWord.length > 3) {
        keywordDensity[cleanWord] = (keywordDensity[cleanWord] || 0) + 1;
      }
    });

    // Get top keywords
    const topKeywords = Object.entries(keywordDensity)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

    // Extract entity mentions (mock - replace with NLP service)
    const entityMentions = extractEntities(textContent);

    return {
      word_count: wordCount,
      reading_time: readingTime,
      keyword_density: topKeywords,
      entity_mentions: entityMentions
    };
  };

  const extractKeywords = (text) => {
    const commonMedicalTerms = [
      'treatment', 'therapy', 'patient', 'clinical', 'efficacy', 'safety',
      'dosing', 'indication', 'adverse', 'monitoring', 'management', 'outcomes'
    ];
    
    const words = text.toLowerCase().split(/\s+/);
    const keywords = [];
    
    commonMedicalTerms.forEach(term => {
      if (words.some(word => word.includes(term))) {
        keywords.push(term);
      }
    });

    // Add specific terms found in content
    const specificTerms = words
      .filter(word => word.length > 4 && /^[a-z]+$/.test(word))
      .slice(0, 5);
    
    return [...new Set([...keywords, ...specificTerms])];
  };

  const extractEntities = (text) => {
    // Mock entity extraction - replace with actual NLP
    const entities = [];
    
    // Look for drug names (capitalized words)
    const drugPattern = /\b[A-Z][a-z]+(?:®|™)?\b/g;
    const matches = text.match(drugPattern) || [];
    entities.push(...matches.slice(0, 5));
    
    return [...new Set(entities)];
  };

  const getTaxonomyTagColor = (tag) => {
    if (tag.toLowerCase().includes('review') || tag.toLowerCase().includes('compliance')) {
      return 'destructive';
    }
    if (tag.toLowerCase().includes('clinical') || tag.toLowerCase().includes('medical')) {
      return 'default';
    }
    return 'secondary';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Content Tags
          </CardTitle>
          <div className="flex items-center gap-2">
            {lastGenerated && (
              <span className="text-xs text-muted-foreground">
                Updated {lastGenerated.toLocaleTimeString()}
              </span>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={generateMetadata}
              disabled={isGenerating}
              className="h-7 px-2"
            >
              {isGenerating ? (
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary mr-1" />
              ) : (
                <RefreshCw className="h-3 w-3 mr-1" />
              )}
              {isGenerating ? 'Analyzing...' : 'Refresh'}
            </Button>
          </div>
        </div>
      </CardHeader>
        <CardContent className="space-y-4">
          {/* Essential Tags Only */}
          {metadata.taxonomyMapping?.compliance_tags && metadata.taxonomyMapping.compliance_tags.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Compliance Tags
              </h4>
              <div className="flex flex-wrap gap-2">
                {metadata.taxonomyMapping.compliance_tags.map((tag, index) => (
                  <Badge 
                    key={index} 
                    variant={getTaxonomyTagColor(tag)}
                    className="text-xs"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Content Metrics */}
          {metadata.contentMetrics && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-1">Words</h4>
                <div className="text-lg font-bold text-primary">
                  {metadata.contentMetrics.word_count}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Read Time
                </h4>
                <div className="text-lg font-bold text-primary">
                  {metadata.contentMetrics.reading_time}m
                </div>
              </div>
            </div>
          )}

          {/* Actionable Tags */}
          {metadata.taxonomyMapping?.suggested_tags && metadata.taxonomyMapping.suggested_tags.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Suggested Tags</h4>
              <div className="flex flex-wrap gap-1">
                {metadata.taxonomyMapping.suggested_tags.slice(0, 6).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
    </Card>
  );
};