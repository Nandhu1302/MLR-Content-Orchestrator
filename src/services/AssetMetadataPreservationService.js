import { supabase } from '@/integrations/supabase/client';

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
    additionalContext // Removed type annotation
  ) { // Removed return type Promise
    try {
      // Fetch asset data separately for better error handling
      const { data: asset, error: assetError } = await supabase
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
        const { data: projectData, error: projectError } = await supabase // Added destructured variables
          .from('content_projects')
          .select('*')
          .eq('id', asset.project_id)
          .maybeSingle();
        if (projectError) console.error("Error fetching content project:", projectError);
        contentProject = projectData;
      }

      // Fetch complete brand context including guidelines and competitive landscape
      const [
        { data: brandProfile, error: profileError }, // Added destructured variables
        { data: brandGuidelines, error: guidelinesError }, // Added destructured variables
        { data: competitiveLandscape, error: competitiveError } // Added destructured variables
      ] = await Promise.all([
        supabase.from('brand_profiles').select('*').eq('id', brandId).maybeSingle(),
        supabase.from('brand_guidelines').select('*').eq('brand_id', brandId).maybeSingle(),
        supabase.from('competitive_landscape').select('*').eq('brand_id', brandId)
      ]);

      if (profileError) console.error("Error fetching brand profile:", profileError);
      if (guidelinesError) console.error("Error fetching brand guidelines:", guidelinesError);
      if (competitiveError) console.error("Error fetching competitive landscape:", competitiveError);

      // Extract strategic context from primary_content with proper type handling
      // Corrected property access and default values
      const primaryContent = asset.primary_content || {};
      const strategicContext = {
        keyMessage: primaryContent.keyMessage || 'Not specified',
        indication: primaryContent.indication || brandProfile?.therapeutic_area || 'General',
        primaryAudience: primaryContent.primaryAudience || 'General',
        callToAction: primaryContent.callToAction || 'Not specified',
        primaryObjective: primaryContent.primaryObjective || 'General awareness'
      };

      // Handle brand guidelines with proper type casting
      const brandGuidelinesData = brandGuidelines || {};
      const messagingFramework = brandGuidelinesData.messaging_framework || {};
      const toneOfVoice = brandGuidelinesData.tone_of_voice || {};
      const visualGuidelines = brandGuidelinesData.visual_guidelines || {};

      // Create enhanced metadata structure with real brand data
      const metadata = {
        assetId: assetId,
        globalContext: {
          sourceAssetId: assetId,
          brandName: brandProfile?.brand_name || 'Unknown Brand',
          therapeuticArea: brandProfile?.therapeutic_area || 'General',
          assetType: asset.asset_type,
          complianceStatus: asset.status,
          approvalDate: asset.completed_at,
        },
        brandContext: {
          brandGuidelines: {
            primaryColor: brandProfile?.primary_color,
            secondaryColor: brandProfile?.secondary_color,
            accentColor: brandProfile?.accent_color,
            fontFamily: brandGuidelinesData.font_family || 'Inter',
            therapeuticArea: brandProfile?.therapeutic_area,
            company: brandProfile?.company,
            // Real brand guidelines from database
            messagingFramework,
            toneOfVoice,
            visualGuidelines,
            keyMessages: brandGuidelinesData.key_pillars || []
          },
          messagingFramework: {
            ...strategicContext,
            ...(asset.intake_context || {})
          },
          visualIdentity: contentProject?.channel_specifications || {},
          complianceRequirements: {
            regulatoryNotes: asset.compliance_notes || [],
            fairBalanceRequired: asset.fairBalanceRequired || false,
            regulatoryFlags: asset.regulatoryFlags || [],
            targetMarkets: contentProject?.targetMarkets || []
          }
        },
        provenance: {
          sourceSystem: 'content_studio',
          createdBy: asset.created_by,
          createdAt: asset.created_at,
          lastModified: asset.updated_at,
          version: '1.0',
          author: asset.created_by // Duplicated field, kept for consistency with original
        },
        relationships: {
          parentAssets: [],
          childAssets: [],
          relatedCampaigns: asset.project_id ? [asset.project_id] : [],
          assetFamily: asset.asset_type
        }
      };

      // Store metadata with competitive intelligence
      const metadataWithCompetitive = {
        ...metadata,
        brandContext: {
          ...metadata.brandContext,
          competitiveLandscape: (competitiveLandscape || []).map((comp) => ({
            competitor: comp.competitor_name,
            differentiators: comp.key_differentiators || [],
            threatLevel: comp.threat_level,
            messagingOpportunities: comp.messaging_opportunities || []
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
  ) { // Removed return type Promise
    try {
      // Get existing metadata
      const existingMetadata = await this.getPreservedMetadata(assetId, stage);
      
      // Update with transformation data
      const updatedMetadata = {
        ...existingMetadata,
        localizationContext: {
          ...(existingMetadata?.localizationContext || {}),
          [`${stage}_transformations`]: transformationData,
          lastUpdated: new Date().toISOString() // Corrected assignment
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
  ) { // Removed return type Promise
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
  ) { // Removed return type Promise
    try {
      // Get preserved metadata
      const originalMetadata = await this.getPreservedMetadata(assetId, 'comprehensive_analysis');
      
      // Corrected object property access and default initialization
      const defaultMetadata = originalMetadata || {
          assetId,
          globalContext: {
            sourceAssetId: assetId,
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
            createdAt: new Date().toISOString(), // Corrected assignment
            lastModified: new Date().toISOString(), // Corrected assignment
            version: '1.0'
          },
          relationships: {
            parentAssets: [],
            childAssets: [],
            relatedCampaigns: [],
            assetFamily: 'unknown'
          }
        };

      // Generate DAM-ready package
      const damPackage = {
        ...defaultMetadata,
        localizationIntelligence: {
          culturalAdaptations: intelligenceData?.cultural || {}, // Corrected property access
          regulatoryCompliance: intelligenceData?.regulatory || {}, // Corrected property access
          qualityPredictions: intelligenceData?.quality || {}, // Corrected property access
          terminologyMatches: intelligenceData?.terminology || {} // Corrected property access
        },
        marketSpecificMetadata: localizationContext.targetMarkets.reduce((acc, market) => {
          acc[market] = {
            culturalContext: {},
            regulatoryStatus: 'pending',
            qualityMetrics: {},
            localizationNotes: []
          };
          return acc;
        }, {}),
        damTaxonomy: {
          primaryCategory: defaultMetadata.globalContext.assetType || 'marketing_material',
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
  ) { // Removed return type Promise
    try {
      // Ensure user ID is available or default to 'system'
      const user = await supabase.auth.getUser();
      const userId = user.data.user?.id || 'system';

      const { error } = await supabase
        .from('content_sessions')
        // Corrected object assignment and property names
        .upsert({
          user_id: userId,
          asset_id: assetId,
          session_type: `metadata_preservation_${stage}`,
          session_state: metadata, // Used 'metadata' instead of 'session_state'
          last_activity: new Date().toISOString() // Corrected assignment
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
  ) { // Removed return type Promise
    try {
      const { data, error } = await supabase
        .from('content_sessions')
        .select('session_state')
        .eq('asset_id', assetId)
        .eq('session_type', `metadata_preservation_${stage}`)
        .order('last_activity', { ascending: false }) // Corrected boolean shorthand
        .limit(1)
        .single();

      if (error || !data) return null;

      // Removed type cast
      return data.session_state;
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
  ) { // Removed return type Promise
    try {
      const { data, error } = await supabase
        .from('content_sessions')
        .select('*')
        .eq('asset_id', assetId)
        .like('session_type', 'metadata_preservation_%')
        .order('last_activity', { ascending: true }); // Corrected boolean shorthand

      if (error) throw error;

      // Corrected object assignment
      return (data || []).map(session => ({
        stage: session.session_type.replace('metadata_preservation_', ''),
        timestamp: session.last_activity,
        changes: session.session_state
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
  ) { // Removed return type Promise
    try {
      // Fetch brand context
      const [
        { data: brandProfile, error: profileError }, // Added destructured variables
        { data: brandGuidelines, error: guidelinesError } // Added destructured variables
      ] = await Promise.all([
        supabase.from('brand_profiles').select('*').eq('id', brandId).maybeSingle(),
        supabase.from('brand_guidelines').select('*').eq('brand_id', brandId).maybeSingle()
      ]);
      
      if (profileError) console.error("Error fetching brand profile:", profileError);
      if (guidelinesError) console.error("Error fetching brand guidelines:", guidelinesError);

      const brandGuidelinesData = brandGuidelines || {};
      const projectMetadata = project.project_metadata || {}; // projectMetadata was unused, but kept definition.

      // Corrected property access and default values
      const metadata = {
        assetId: project.source_content_id || project.id,
        globalContext: {
          sourceAssetId: project.source_content_id,
          brandName: brandProfile?.brand_name || 'Unknown Brand',
          therapeuticArea: project.therapeutic_area || brandProfile?.therapeutic_area || 'General',
          assetType: project.asset_type || 'Marketing Material',
          complianceStatus: project.project_status || 'draft',
          approvalDate: project.created_at,
        },
        brandContext: {
          brandGuidelines: {
            primaryColor: brandProfile?.primary_color,
            secondaryColor: brandProfile?.secondary_color,
            accentColor: brandProfile?.accent_color,
            fontFamily: brandGuidelinesData.font_family || 'Inter',
            therapeuticArea: brandProfile?.therapeutic_area,
            company: brandProfile?.company,
            messagingFramework: brandGuidelinesData.messaging_framework || {},
            toneOfVoice: brandGuidelinesData.tone_of_voice || {},
            visualGuidelines: brandGuidelinesData.visual_guidelines || {},
            keyMessages: brandGuidelinesData.messaging_framework?.key_pillars || []
          },
          messagingFramework: project.messaging_context || {},
          visualIdentity: {},
          complianceRequirements: {
            regulatoryNotes: project.regulatory_notes || [],
            fairBalanceRequired: project.fairBalanceRequired || false,
            regulatoryFlags: [],
            targetMarkets: project.target_markets || []
          }
        },
        provenance: {
          sourceSystem: 'localization_project',
          createdAt: project.created_at,
          lastModified: project.updated_at,
          version: '1.0',
        },
        relationships: {
          parentAssets: [],
          childAssets: [],
          relatedCampaigns: [],
          assetFamily: project.asset_type || 'marketing_material'
        }
      };

      return metadata;
    } catch (error) {
      console.error('Error creating metadata from project:', error);
      throw error;
    }
  }
}