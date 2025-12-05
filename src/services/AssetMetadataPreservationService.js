import { supabase } from '@/integrations/supabase/client';

// Interfaces for enhanced asset metadata with global context preservation


/**
 * Service for preserving complete global asset context and metadata throughout localization
 */
export class AssetMetadataPreservationService {
  
  /**
   * Capture and preserve complete global asset context at workflow initiation
   */
  static async captureGlobalAssetContext(
    assetId, 
    brandId,
    additionalContext: any
  ): Promise {
    try {
      // Fetch asset data separately for better error handling
      const { data, error } = await supabase
        .from('content_assets')
        .select('*')
        .eq('id', assetId)
        .maybeSingle();

      if (assetError) throw assetError;
      
      // If asset doesn't exist, try to create from localization project data
      if (!asset && additionalContext.localizationProject) {
        return this.createMetadataFromProject(additionalContext.localizationProject, brandId);
      }
      
      if (!asset) throw new Error(`Asset with ID ${assetId} not found`);

      // Fetch content project if exists
      let contentProject = null;
      if (asset.project_id) {
        const { data } = await supabase
          .from('content_projects')
          .select('*')
          .eq('id', asset.project_id)
          .maybeSingle();
        contentProject = projectData;
      }

      // Fetch complete brand context including guidelines and competitive landscape
      const [
        { data },
        { data },
        { data }
      ] = await Promise.all([
        supabase.from('brand_profiles').select('*').eq('id', brandId).maybeSingle(),
        supabase.from('brand_guidelines').select('*').eq('brand_id', brandId).maybeSingle(),
        supabase.from('competitive_landscape').select('*').eq('brand_id', brandId)
      ]);

      // Extract strategic context from primary_content with proper type handling
      const primaryContent = (asset.primary_content ) || {};
      const strategicContext = {
        keyMessage.keyMessage || 'Not specified',
        indication.indication || brandProfile.therapeutic_area || 'General',
        primaryAudience.primaryAudience || 'General',
        callToAction.callToAction || 'Not specified',
        primaryObjective.primaryObjective || 'General awareness'
      };

      // Handle brand guidelines with proper type casting
      const brandGuidelinesData = (brandGuidelines ) || {};
      const messagingFramework = (brandGuidelinesData.messaging_framework ) || {};
      const toneOfVoice = (brandGuidelinesData.tone_of_voice ) || {};
      const visualGuidelines = (brandGuidelinesData.visual_guidelines ) || {};

      // Create enhanced metadata structure with real brand data
      const metadata = {
        assetId,
        globalContext: {
          sourceAssetId,
          brandName.brand_name || 'Unknown Brand',
          therapeuticArea.therapeutic_area || 'General',
          assetType.asset_type,
          complianceStatus.status,
          approvalDate.completed_at,
        },
        brandContext: {
          brandGuidelines: {
            primaryColor.primary_color,
            secondaryColor.secondary_color,
            accentColor.accent_color,
            fontFamily.font_family || 'Inter',
            therapeuticArea.therapeutic_area,
            company.company,
            // Real brand guidelines from database
            messagingFramework,
            toneOfVoice,
            visualGuidelines,
            keyMessages.key_pillars || []
          },
          messagingFramework: {
            ...strategicContext,
            ...(asset.intake_context  || {})
          },
          visualIdentity.channel_specifications || {},
          complianceRequirements: {
            regulatoryNotes.compliance_notes,
            fairBalanceRequired.fairBalanceRequired || false,
            regulatoryFlags.regulatoryFlags || [],
            targetMarkets.targetMarkets || []
          }
        },
        provenance: {
          sourceSystem: 'content_studio',
          createdBy.created_by,
          createdAt.created_at,
          lastModified.updated_at,
          version: '1.0',
          author.created_by
        },
        relationships: {
          parentAssets: [],
          childAssets: [],
          relatedCampaigns.project_id  [asset.project_id] : [],
          assetFamily.asset_type
        }
      };

      // Store metadata with competitive intelligence
      const metadataWithCompetitive = {
        ...metadata,
        brandContext: {
          ...metadata.brandContext,
          competitiveLandscape.map((comp) => ({
            competitor.competitor_name,
            differentiators.key_differentiators || [],
            threatLevel.threat_level,
            messagingOpportunities.messaging_opportunities || []
          })) || []
        }
      };

      // Store metadata in database for persistence
      await this.storeMetadata(assetId, metadataWithCompetitive);
      
      return metadataWithCompetitive;
    } catch (error) {
      console.error('Error capturing global asset context:', error);
      throw error;
    }
  }

  /**
   * Track metadata transformations through localization stages
   */
  static async trackMetadataTransformations(
    assetId,
    stage,
    transformationData
  ): Promise {
    try {
      // Get existing metadata
      const existingMetadata = await this.getPreservedMetadata(assetId, stage);
      
      // Update with transformation data
      const updatedMetadata = {
        ...existingMetadata,
        localizationContext: {
          ...existingMetadata.localizationContext,
          [`${stage}_transformations`]: transformationData,
          lastUpdated Date().toISOString()
        }
      };

      // Store updated metadata
      await this.storeMetadata(assetId, updatedMetadata, stage);
    } catch (error) {
      console.error('Error tracking metadata transformations:', error);
      throw error;
    }
  }

  /**
   * Update localization context as workflow progresses
   */
  static async updateLocalizationContext(
    assetId,
    targetMarkets,
    culturalAdaptations,
    regulatoryModifications
  ): Promise {
    try {
      const metadata = await this.getPreservedMetadata(assetId, 'localization_update');
      
      if (metadata) {
        metadata.localizationContext = {
          targetMarkets,
          culturalAdaptations,
          regulatoryModifications,
          translationMemoryMatches: {}
        };
      }

      // Update stored metadata
      await this.storeMetadata(assetId, metadata);
    } catch (error) {
      console.error('Error updating localization context:', error);
      throw error;
    }
  }

  /**
   * Generate comprehensive metadata for handoff packages
   */
  static async generateComprehensiveMetadata(
    assetId,
    localizationContext,
    intelligenceData
  ): Promise {
    try {
      // Get preserved metadata
      const originalMetadata = await this.getPreservedMetadata(assetId, 'comprehensive_analysis');
      
      // Generate DAM-ready package
      const damPackage = {
        originalMetadata || {
          assetId,
          globalContext: {
            sourceAssetId,
            brandName: 'Unknown',
            therapeuticArea: 'General',
            assetType: 'Unknown',
            complianceStatus: 'Draft'
          },
          brandContext: {
            brandGuidelines: {},
            messagingFramework: {},
            visualIdentity: {},
            complianceRequirements: {}
          },
          provenance: {
            sourceSystem: 'content_studio',
            createdAt Date().toISOString(),
            lastModified Date().toISOString(),
            version: '1.0'
          },
          relationships: {
            parentAssets: [],
            childAssets: [],
            relatedCampaigns: [],
            assetFamily: 'unknown'
          }
        },
        localizationIntelligence: {
          culturalAdaptations.cultural || {},
          regulatoryCompliance.regulatory || {},
          qualityPredictions.quality || {},
          terminologyMatches.terminology || {}
        },
        marketSpecificMetadata.targetMarkets.reduce((acc, market) => {
          acc[market] = {
            culturalContext: {},
            regulatoryStatus: 'pending',
            qualityMetrics: {},
            localizationNotes: []
          };
          return acc;
        }, {}),
        damTaxonomy: {
          primaryCategory.globalContext.assetType || 'marketing_material',
          secondaryCategories: [],
          tags: [],
          searchKeywords: []
        },
        workflowMetadata: {
          localizationStage: 'intelligence_complete',
          qualityGates: [],
          approvalStatus: 'pending',
          reviewNotes: []
        }
      };
      
      return damPackage;
    } catch (error) {
      console.error('Failed to generate comprehensive metadata:', error);
      throw error;
    }
  }

  /**
   * Store metadata in database
   */
  static async storeMetadata(
    assetId, 
    metadata, 
    stage = 'general'
  ): Promise {
    try {
      const { error } = await supabase
        .from('content_sessions')
        .upsert({
          user_id: (await supabase.auth.getUser()).data.user.id || 'system',
          asset_id,
          session_type: `metadata_preservation_${stage}`,
          session_state,
          last_activity Date().toISOString()
        }, {
          onConflict: 'user_id,asset_id,session_type'
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error storing metadata:', error);
      throw error;
    }
  }

  /**
   * Retrieve preserved metadata
   */
  static async getPreservedMetadata(
    assetId, 
    stage = 'general'
  ): Promise {
    try {
      const { data, error } = await supabase
        .from('content_sessions')
        .select('session_state')
        .eq('asset_id', assetId)
        .eq('session_type', `metadata_preservation_${stage}`)
        .order('last_activity', { ascending })
        .limit(1)
        .single();

      if (error || !data) return null;

      return (data.session_state ) as EnhancedAssetMetadata;
    } catch (error) {
      console.error('Error retrieving preserved metadata:', error);
      return null;
    }
  }

  /**
   * Generate audit trail for metadata changes
   */
  static async generateAuditTrail(
    assetId
  ): Promise {
    try {
      const { data, error } = await supabase
        .from('content_sessions')
        .select('*')
        .eq('asset_id', assetId)
        .like('session_type', 'metadata_preservation_%')
        .order('last_activity', { ascending });

      if (error) throw error;

      return data.map(session => ({
        stage.session_type.replace('metadata_preservation_', ''),
        timestamp.last_activity,
        changes.session_state
      })) || [];
    } catch (error) {
      console.error('Error generating audit trail:', error);
      return [];
    }
  }

  /**
   * Create metadata from localization project when source asset is missing
   */
  static async createMetadataFromProject(
    project,
    brandId
  ): Promise {
    try {
      // Fetch brand context
      const [
        { data },
        { data }
      ] = await Promise.all([
        supabase.from('brand_profiles').select('*').eq('id', brandId).maybeSingle(),
        supabase.from('brand_guidelines').select('*').eq('brand_id', brandId).maybeSingle()
      ]);

      const brandGuidelinesData = (brandGuidelines ) || {};
      const projectMetadata = project.project_metadata || {};

      const metadata = {
        assetId.source_content_id || project.id,
        globalContext: {
          sourceAssetId.source_content_id,
          brandName.brand_name || 'Unknown Brand',
          therapeuticArea.therapeutic_area || brandProfile.therapeutic_area || 'General',
          assetType.asset_type || 'Marketing Material',
          complianceStatus.project_status || 'draft',
          approvalDate.created_at,
        },
        brandContext: {
          brandGuidelines: {
            primaryColor.primary_color,
            secondaryColor.secondary_color,
            accentColor.accent_color,
            fontFamily.font_family || 'Inter',
            therapeuticArea.therapeutic_area,
            company.company,
            messagingFramework.messaging_framework || {},
            toneOfVoice.tone_of_voice || {},
            visualGuidelines.visual_guidelines || {},
            keyMessages.messaging_framework.key_pillars || []
          },
          messagingFramework.messaging_context || {},
          visualIdentity: {},
          complianceRequirements: {
            regulatoryNotes.regulatory_notes || [],
            fairBalanceRequired,
            regulatoryFlags: [],
            targetMarkets.target_markets || []
          }
        },
        provenance: {
          sourceSystem: 'localization_project',
          createdAt.created_at,
          lastModified.updated_at,
          version: '1.0',
        },
        relationships: {
          parentAssets: [],
          childAssets: [],
          relatedCampaigns: [],
          assetFamily.asset_type || 'marketing_material'
        }
      };

      return metadata;
    } catch (error) {
      console.error('Error creating metadata from project:', error);
      throw error;
    }
  }
}