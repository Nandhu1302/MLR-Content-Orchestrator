import { supabase } from './supabase/client'; // Adjust the import path as necessary
// The mlrContextService import is retained as it suggests a necessary dependency, 
// but is not directly used or defined in the provided code block.

/**
 * @typedef {Object} SourceAsset
 * @property {string} id
 * @property {string} name
 * @property {string} [description]
 * @property {string} type
 * @property {string} status
 * @property {Object} [metadata]
 * @property {any} [content]
 * @property {string} [project_name]
 * @property {string} brand_id
 * @property {'content_studio' | 'pre_mlr' | 'design_studio'} source_module
 */

/**
 * @typedef {Object} AssetSelectionData
 * @property {SourceAsset} asset
 * @property {string} suggestedProjectName
 * @property {string} suggestedDescription
 * @property {Object} contextualInfo
 */

class LocalizationSourceService {
  // Fetch Content Studio assets
  /**
   * @param {string} brandId
   * @returns {Promise<SourceAsset[]>}
   */
  async getContentStudioAssets(brandId) {
    try {
      // Fetch content projects and their assets
      const { data: projects, error: projectsError } = await supabase
        .from('content_projects')
        .select(`
          id,
          project_name,
          description,
          status,
          target_audience,
          channels,
          market
        `)
        .eq('brand_id', brandId)
        .in('status', ['active', 'in_review', 'approved']);

      if (projectsError) throw projectsError;

      const { data: assets, error: assetsError } = await supabase
        .from('content_assets')
        .select(`
          id,
          asset_name,
          asset_type,
          status,
          primary_content,
          metadata,
          project_id,
          target_audience,
          content_category,
          theme_id,
          intake_context
        `)
        .eq('brand_id', brandId)
        .in('status', ['completed', 'in_review', 'approved']);

      if (assetsError) throw assetsError;

      // Combine projects and assets
      /** @type {SourceAsset[]} */
      const sourceAssets = [];

      // Add projects as selectable sources
      if (projects) {
        projects.forEach(project => {
          sourceAssets.push({
            id: project.id,
            name: project.project_name,
            description: project.description,
            type: 'content_project',
            status: project.status,
            metadata: {
              target_audience: project.target_audience,
              channels: project.channels,
              market: project.market
            },
            project_name: project.project_name,
            brand_id: brandId,
            source_module: 'content_studio'
          });
        });
      }

      // Fetch themes for assets that have theme_id
      const themeIds = assets?.filter(a => a.theme_id).map(a => a.theme_id) || [];
      let themes = [];
      if (themeIds.length > 0) {
        const { data: themeData } = await supabase
          .from('theme_library')
          .select('id, name, description, key_message, call_to_action, category, rationale')
          .in('id', themeIds);
        themes = themeData || [];
      }

      // Add individual assets
      if (assets && assets.length > 0) {
        assets.forEach(asset => {
          const project = projects?.find(p => p.id === asset.project_id);
          const theme = themes.find(t => t.id === asset.theme_id);
          
          // Merge intake_context, theme data, and source market into metadata
          const baseMetadata = (asset.metadata && typeof asset.metadata === 'object') ? asset.metadata : {};
          const enrichedMetadata = {
            ...baseMetadata,
            intake_context: asset.intake_context || {},
            sourceMarket: project?.market || baseMetadata.market,
            theme: theme ? {
              name: theme.name,
              description: theme.description,
              rationale: theme.rationale,
              keyMessage: theme.key_message,
              callToAction: theme.call_to_action,
              category: theme.category
            } : undefined
          };
          
          sourceAssets.push({
            id: asset.id,
            name: asset.asset_name,
            description: project?.description,
            type: asset.asset_type,
            status: asset.status,
            metadata: enrichedMetadata,
            content: asset.primary_content,
            project_name: project?.project_name,
            brand_id: brandId,
            source_module: 'content_studio'
          });
        });
      }

      return sourceAssets;
    } catch (error) {
      console.error('Error fetching Content Studio assets:', error);
      return [];
    }
  }

  // Fetch Pre-MLR assets (MLR reviewed content)
  /**
   * @param {string} brandId
   * @returns {Promise<SourceAsset[]>}
   */
  async getPreMLRAssets(brandId) {
    try {
      // Fetch content assets that have been through MLR review
      const { data: assets, error } = await supabase
        .from('content_assets')
        .select(`
          id,
          asset_name,
          asset_type,
          status,
          primary_content,
          metadata,
          compliance_notes,
          project_id,
          content_projects!inner(project_name, description, therapeutic_area, indication, market)
        `)
        .eq('brand_id', brandId)
        .in('status', ['mlr_approved', 'approved']);

      if (error) throw error;

      return assets?.map(asset => ({
        id: asset.id,
        name: asset.asset_name,
        description: `MLR Approved: ${asset.content_projects.description || asset.asset_name}`,
        type: asset.asset_type,
        status: asset.status,
        metadata: Object.assign(
          {},
          asset.metadata || {},
          {
            therapeutic_area: asset.content_projects.therapeutic_area,
            indication: asset.content_projects.indication,
            compliance_notes: asset.compliance_notes,
            sourceMarket: asset.content_projects.market
          }
        ),
        content: asset.primary_content,
        project_name: asset.content_projects.project_name,
        brand_id: brandId,
        source_module: 'pre_mlr'
      })) || [];
    } catch (error) {
      console.error('Error fetching Pre-MLR assets:', error);
      return [];
    }
  }

  // Fetch Design Studio assets (completed designs)
  /**
   * @param {string} brandId
   * @returns {Promise<SourceAsset[]>}
   */
  async getDesignStudioAssets(brandId) {
    try {
      // Fetch design handoffs that are completed
      const { data: handoffs, error } = await supabase
        .from('design_handoffs')
        .select(`
          id,
          asset_id,
          content_context,
          design_requirements,
          design_assets,
          handoff_status,
          content_assets!inner(asset_name, asset_type, primary_content),
          content_projects!inner(project_name, description, market)
        `)
        .eq('brand_id', brandId)
        .in('handoff_status', ['design_complete', 'approved']);

      if (error) throw error;

      return handoffs?.map(handoff => ({
        id: handoff.asset_id,
        name: `${handoff.content_assets.asset_name} (Design Complete)`,
        description: `Design Ready: ${handoff.content_projects.description || handoff.content_assets.asset_name}`,
        type: handoff.content_assets.asset_type,
        status: handoff.handoff_status,
        metadata: {
          design_requirements: handoff.design_requirements,
          design_assets: handoff.design_assets,
          content_context: handoff.content_context,
          sourceMarket: handoff.content_projects.market
        },
        content: handoff.content_assets.primary_content,
        project_name: handoff.content_projects.project_name,
        brand_id: brandId,
        source_module: 'design_studio'
      })) || [];
    } catch (error) {
      console.error('Error fetching Design Studio assets:', error);
      return [];
    }
  }

  // Generate smart project name and description based on selected asset
  /**
   * @param {SourceAsset} asset
   * @param {string[]} targetLanguages
   * @param {string[]} targetMarkets
   * @returns {Promise<AssetSelectionData>}
   */
  async generateAssetBasedProjectData(asset, targetLanguages, targetMarkets) {
    try {
      // Generate unique timestamp for project identification
      const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      
      const languageStr = targetLanguages.length > 3 
        ? `${targetLanguages.slice(0, 3).join(', ')} + ${targetLanguages.length - 3} more`
        : targetLanguages.join(', ');
        
      const marketStr = targetMarkets.length > 2
        ? `${targetMarkets.slice(0, 2).join(', ')} + ${targetMarkets.length - 2} more`
        : targetMarkets.join(', ');

      let suggestedProjectName = '';
      let suggestedDescription = '';
      let contextualInfo = {};

      switch (asset.source_module) {
        case 'content_studio':
          // Create unique project name with asset/project name and context
          suggestedProjectName = `${asset.project_name || asset.name} - ${marketStr || 'Global'}`;
          if (targetLanguages.length > 0) {
            suggestedProjectName += ` (${languageStr})`;
          }
          suggestedProjectName += ` - ${timestamp}`;   // Add timestamp for uniqueness
          
          suggestedDescription = `Localization project for **${asset.name}**${asset.description ? `: ${asset.description}` : ''}`;
          if (targetMarkets.length > 0) {
            suggestedDescription += `\n\nTarget Markets: ${marketStr}`;
          }
          if (asset.metadata?.target_audience) {
            suggestedDescription += `\nAudience: ${JSON.stringify(asset.metadata.target_audience).replace(/[[\]"]/g, '')}`;
          }
          if (asset.metadata?.channels) {
            suggestedDescription += `\nChannels: ${JSON.stringify(asset.metadata.channels).replace(/[[\]"]/g, '')}`;
          }

          contextualInfo = {
            original_content: asset.content,
            content_structure: asset.metadata,
            source_project_name: asset.project_name
          };
          break;

        case 'pre_mlr':
          // Create unique project name with MLR status and context
          suggestedProjectName = `${asset.name} (MLR) - ${marketStr || 'Global'}`;
          if (targetLanguages.length > 0) {
            suggestedProjectName += ` (${languageStr})`;
          }
          suggestedProjectName += ` - ${timestamp}`;   // Add timestamp for uniqueness

          suggestedDescription = `Localization of **MLR-approved content**: ${asset.name}`;
          if (asset.metadata?.therapeutic_area) {
            suggestedDescription += `\nTherapeutic Area: ${asset.metadata.therapeutic_area}`;
          }
          if (asset.metadata?.indication) {
            suggestedDescription += `\nIndication: ${asset.metadata.indication}`;
          }
          if (asset.metadata?.compliance_notes) {
            suggestedDescription += `\nCompliance Notes: ${asset.metadata.compliance_notes}`;
          }
          if (targetMarkets.length > 0) {
            suggestedDescription += `\n\nTarget Markets: ${marketStr}`;
          }

          contextualInfo = {
            mlr_approved_content: asset.content,
            compliance_context: asset.metadata,
            regulatory_requirements: await this.extractRegulatoryRequirements(asset)
          };
          break;

        case 'design_studio':
          // Create unique project name with creative context and timestamp
          suggestedProjectName = `${asset.name} - Creative - ${marketStr || 'Global'}`;
          if (targetLanguages.length > 0) {
            suggestedProjectName += ` (${languageStr})`;
          }
          suggestedProjectName += ` - ${timestamp}`;   // Add timestamp for uniqueness

          suggestedDescription = `Localization and **cultural adaptation** of design-ready content: ${asset.name}`;
          if (asset.metadata?.design_requirements) {
            suggestedDescription += `\nDesign Requirements: Creative adaptation with cultural sensitivity`;
          }
          if (targetMarkets.length > 0) {
            suggestedDescription += `\n\nTarget Markets: ${marketStr}`;
            suggestedDescription += `\n**Note: Design elements may require cultural adaptation for local markets**`;
          }

          contextualInfo = {
            design_assets: asset.metadata?.design_assets,
            design_requirements: asset.metadata?.design_requirements,
            content_context: asset.metadata?.content_context,
            creative_brief: await this.extractCreativeBrief(asset)
          };
          break;
      }

      return {
        asset,
        // Limit length to prevent database errors (assuming 100 char limit)
        suggestedProjectName: suggestedProjectName.substring(0, 100), 
        suggestedDescription,
        contextualInfo
      };
    } catch (error) {
      console.error('Error generating asset-based project data:', error);
      return {
        asset,
        suggestedProjectName: `Localization: ${asset.name} - ${new Date().toISOString().split('T')[0]}`,
        suggestedDescription: asset.description || `Localization project for ${asset.name}`,
        contextualInfo: {}
      };
    }
  }

  // Extract regulatory requirements for MLR assets
  /**
   * @private
   * @param {SourceAsset} asset
   * @returns {Promise<any>}
   */
  async extractRegulatoryRequirements(asset) {
    try {
      // In a real implementation, this would analyze the MLR-approved content
      // and extract specific regulatory requirements and constraints
      return {
        approved_claims: asset.metadata?.approved_claims || [],
        required_disclaimers: asset.metadata?.required_disclaimers || [],
        regulatory_constraints: asset.metadata?.regulatory_constraints || []
      };
    } catch (error) {
      return {};
    }
  }

  // Extract creative brief for design assets
  /**
   * @private
   * @param {SourceAsset} asset
   * @returns {Promise<any>}
   */
  async extractCreativeBrief(asset) {
    try {
      // Extract creative elements that need to be preserved in localization
      return {
        visual_elements: asset.metadata?.design_assets?.visual_elements || [],
        brand_guidelines: asset.metadata?.content_context?.brand_guidelines || {},
        creative_strategy: asset.metadata?.design_requirements?.creative_strategy || ''
      };
    } catch (error) {
      return {};
    }
  }

  // Get all available source assets for a brand
  /**
   * @param {string} brandId
   * @returns {Promise<SourceAsset[]>}
   */
  async getAllSourceAssets(brandId) {
    const [contentAssets, mlrAssets, designAssets] = await Promise.all([
      this.getContentStudioAssets(brandId),
      this.getPreMLRAssets(brandId),
      this.getDesignStudioAssets(brandId)
    ]);

    return [...contentAssets, ...mlrAssets, ...designAssets];
  }
}

export const localizationSourceService = new LocalizationSourceService();