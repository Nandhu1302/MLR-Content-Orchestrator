import { supabase } from '@/integrations/supabase/client';

class UnifiedDataService {
  /**
   * Search across all content types with unified query interface
   */
  async search(query) {
    const results = [];

    try {
      // Search projects
      if (!query.contentType || query.contentType === 'project') {
        const projectResults = await this.searchProjects(query);
        results.push(...projectResults);
      }

      // Search assets
      if (!query.contentType || query.contentType === 'asset') {
        const assetResults = await this.searchAssets(query);
        results.push(...assetResults);
      }

      // Search themes (if available)
      if (!query.contentType || query.contentType === 'theme') {
        const themeResults = await this.searchThemes(query);
        results.push(...themeResults);
      }

      // Sort by relevance and recency
      return results.sort((a, b) => {
        if (a.relevanceScore && b.relevanceScore) {
          return b.relevanceScore - a.relevanceScore;
        }
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });

    } catch (error) {
      console.error('Error in unified search:', error);
      throw error;
    }
  }

  /**
   * Get content with full context and relationships
   */
  async getContentWithContext(contentId, contentType) {
    try {
      let content = null;

      // Get main content
      switch (contentType) {
        case 'project':
          const { data: project } = await supabase
            .from('content_projects')
            .select('*, content_assets(*)')
            .eq('id', contentId)
            .single();
          content = project;
          break;

        case 'asset':
          const { data: asset } = await supabase
            .from('content_assets')
            .select('*, content_variations(*), content_versions(*)')
            .eq('id', contentId)
            .single();
          content = asset;
          break;
      }

      // Mock data for taxonomy and relationships until database is updated
      const taxonomyMappings = this.getMockTaxonomyMappings(contentId);
      const relationships = this.getMockRelationships(contentId);

      return {
        content,
        taxonomyMappings,
        relationships,
        metadata: await this.generateContextMetadata(content, taxonomyMappings, relationships)
      };

    } catch (error) {
      console.error('Error getting content with context:', error);
      throw error;
    }
  }

  /**
   * Create relationships between content items (prepared for future implementation)
   */
  async createContentRelationship(
    sourceId,
    targetId,
    relationshipType,
    metadata = {}
  ) {
    try {
      // Mock implementation until database tables are available
      console.log('Creating content relationship:', {
        sourceId,
        targetId,
        relationshipType,
        metadata
      });

      return {
        id: 'mock-relationship-id',
        source_id: sourceId,
        target_id: targetId,
        relationship_type: relationshipType,
        metadata,
        created_at: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error creating content relationship:', error);
      throw error;
    }
  }

  /**
   * Get content recommendations based on context
   */
  async getRecommendations(
    currentContentId,
    contentType,
    brandId,
    limit = 5
  ) {
    try {
      // Simple recommendation based on brand and type similarity
      const query = {
        brandId,
        contentType: contentType === 'project' ? 'asset' : 'project'
      };

      const recommendations = await this.search(query);

      return recommendations
        .filter(item => item.id !== currentContentId)
        .slice(0, limit);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      return [];
    }
  }

  async searchProjects(query) {
    let queryBuilder = supabase
      .from('content_projects')
      .select('*');

    if (query.brandId) {
      queryBuilder = queryBuilder.eq('brand_id', query.brandId);
    }

    if (query.searchTerm) {
      queryBuilder = queryBuilder.or(`project_name.ilike.%${query.searchTerm}%,description.ilike.%${query.searchTerm}%`);
    }

    const { data, error } = await queryBuilder;
    if (error) throw error;

    return (data || []).map(project => ({
      id: project.id,
      type: 'project',
      title: project.project_name,
      content: project,
      metadata: project.project_metadata || {},
      taxonomyTags: this.getMockTaxonomyTags(project),
      contextLineage: {},
      createdAt: project.created_at,
      updatedAt: project.updated_at,
      brandId: project.brand_id,
      relevanceScore: this.calculateRelevanceScore(project, query.searchTerm)
    }));
  }

  async searchAssets(query) {
    let queryBuilder = supabase
      .from('content_assets')
      .select('*');

    if (query.brandId) {
      queryBuilder = queryBuilder.eq('brand_id', query.brandId);
    }

    if (query.searchTerm) {
      queryBuilder = queryBuilder.or(`asset_name.ilike.%${query.searchTerm}%`);
    }

    const { data, error } = await queryBuilder;
    if (error) throw error;

    return (data || []).map(asset => ({
      id: asset.id,
      type: 'asset',
      title: asset.asset_name,
      content: asset,
      metadata: asset.metadata || {},
      taxonomyTags: this.getMockTaxonomyTags(asset),
      contextLineage: {},
      createdAt: asset.created_at,
      updatedAt: asset.updated_at,
      brandId: asset.brand_id,
      relevanceScore: this.calculateRelevanceScore(asset, query.searchTerm)
    }));
  }

  async searchThemes(query) {
    // Search in campaign themes
    let queryBuilder = supabase
      .from('campaign_themes')
      .select('*');

    if (query.brandId) {
      queryBuilder = queryBuilder.eq('brand_id', query.brandId);
    }

    const { data, error } = await queryBuilder;
    if (error) throw error;

    return (data || []).map(theme => ({
      id: theme.theme_id,
      type: 'theme',
      title: `Theme ${theme.theme_id}`,
      content: theme,
      metadata: {},
      taxonomyTags: [],
      contextLineage: {},
      createdAt: theme.created_at,
      updatedAt: theme.updated_at,
      brandId: theme.brand_id,
      relevanceScore: 0.5
    }));
  }

  calculateRelevanceScore(content, searchTerm) {
    if (!searchTerm) return 0.5;

    let score = 0;
    const term = searchTerm.toLowerCase();

    // Check title/name matches
    const title = (content.project_name || content.asset_name || '').toLowerCase();
    if (title.includes(term)) {
      score += 0.6;
    }

    // Check description matches
    const description = (content.description || '').toLowerCase();
    if (description.includes(term)) {
      score += 0.3;
    }

    // Boost score for recent content
    const daysSinceUpdate = (Date.now() - new Date(content.updated_at).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceUpdate < 7) {
      score += 0.1;
    }

    return Math.min(score, 1.0);
  }

  getMockTaxonomyMappings(contentId) {
    // Mock taxonomy mappings until database is ready
    return [
      {
        id: 'mock-1',
        content_id: contentId,
        taxonomy_id: 'oncology-1',
        confidence_score: 0.9,
        global_taxonomy: {
          id: 'oncology-1',
          category: 'therapeutic_area',
          term: 'Oncology'
        }
      }
    ];
  }

  getMockRelationships(contentId) {
    // Mock relationships until database is ready
    return [
      {
        id: 'mock-rel-1',
        source_id: contentId,
        target_id: 'mock-target',
        relationship_type: 'derives_from',
        metadata: {}
      }
    ];
  }

  getMockTaxonomyTags(content) {
    // Generate mock taxonomy tags based on content
    const tags = [];

    if (content.therapeutic_area) {
      tags.push(content.therapeutic_area.toLowerCase());
    }

    if (content.asset_type) {
      tags.push(content.asset_type.toLowerCase());
    }

    if (content.content_category) {
      tags.push(content.content_category.toLowerCase());
    }

    return tags;
  }

  async generateContextMetadata(content, taxonomyMappings, relationships) {
    return {
      taxonomyCount: taxonomyMappings.length,
      relationshipCount: relationships.length,
      categories: taxonomyMappings.map(t => t.global_taxonomy?.category).filter(Boolean),
      lastAnalyzed: new Date().toISOString(),
      hasAIAnalysis: !!(content?.ai_analysis && Object.keys(content.ai_analysis).length > 0)
    };
  }
}

export const unifiedDataService = new UnifiedDataService();