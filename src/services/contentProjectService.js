// Note: The 'supabase' client must be globally available
// or imported in the consuming environment for the database operations to work.
// import { supabase } from '@/integrations/supabase/client';

/**
 * @typedef {object} EvidenceUsed
 * @property {string[]} claimIds - IDs of the core claims used.
 * @property {string[]} visualAssetIds - IDs of visual assets/media used.
 * @property {string[]} moduleIds - IDs of content modules/snippets used.
 */

/**
 * @typedef {object} IntelligenceAttribution
 * @property {string} channel - The channel where the intelligence originated (e.g., 'Social', 'Email').
 * @property {string} source - The specific source of the data (e.g., 'competitive_trigger', 'sentiment_shift').
 * @property {number} dataPoints - Number of data points analyzed.
 */

/**
 * @typedef {object} CreateProjectParams
 * @property {string} brandId
 * @property {string} projectName
 * @property {string} objective
 * @property {string} audience
 * @property {string} assetType
 * @property {any} generatedContent - The actual text, HTML, or structured data for the asset.
 * @property {EvidenceUsed} evidenceUsed
 * @property {IntelligenceAttribution} intelligenceAttribution
 */

/**
 * Service for managing the creation of new content projects and associated assets.
 */
export class ContentProjectService {

    /**
     * Creates a new content project and immediately registers a primary content asset
     * within that project, linking all underlying evidence and intelligence sources.
     *
     * @param {CreateProjectParams} params - Parameters defining the project and initial asset.
     * @returns {Promise<{ projectId: string, assetId: string }>} - The IDs of the newly created project and asset.
     */
    static async createProjectWithAsset(params) {
        const {
            brandId,
            projectName,
            objective,
            audience,
            assetType,
            generatedContent,
            evidenceUsed,
            intelligenceAttribution
        } = params;

        let project;
        let asset;

        // 1. Create project
        try {
            const { data, error } = await supabase
                .from('content_projects')
                .insert({
                    brand_id: brandId,
                    project_name: projectName,
                    project_type: 'single-asset',
                    status: 'in-progress',
                    project_metadata: {
                        objective,
                        audience,
                        intelligence_attribution: intelligenceAttribution
                    }
                })
                .select()
                .single();

            if (error || !data) {
                console.error('❌ Project creation failed:', error);
                throw new Error(`Failed to create project: ${error?.message || 'Unknown error'}`);
            }
            project = data;
            console.log(`✅ Project created with ID: ${project.id}`);

        } catch (projectError) {
            console.error('Project creation failed with exception:', projectError);
            throw projectError;
        }

        // 2. Create asset with generated content
        try {
            const { data, error } = await supabase
                .from('content_assets')
                .insert({
                    project_id: project.id,
                    brand_id: brandId,
                    asset_name: `${projectName} - ${assetType}`,
                    asset_type: assetType,
                    target_audience: audience,
                    primary_content: generatedContent,
                    status: 'draft',
                    claims_used: evidenceUsed.claimIds,
                    references_used: [], // References linked via claims, as per original logic
                    intake_context: {
                        objective,
                        intelligence_source: intelligenceAttribution.source,
                        channel: intelligenceAttribution.channel
                    },
                    metadata: {
                        intelligence_driven: true,
                        citation_data: {
                            modulesUsed: evidenceUsed.moduleIds.map(id => ({ moduleId: id })),
                            visualsUsed: evidenceUsed.visualAssetIds.map(id => ({ visualId: id }))
                        },
                        visualsUsed: evidenceUsed.visualAssetIds // For backward compatibility
                    }
                })
                .select()
                .single();

            if (error || !data) {
                console.error('❌ Asset creation failed:', error);
                throw new Error(`Failed to create asset: ${error?.message || 'Unknown error'}`);
            }
            asset = data;
            console.log(`✅ Asset created with ID: ${asset.id}`);

        } catch (assetError) {
            console.error('Asset creation failed with exception:', assetError);
            throw assetError;
        }

        // 3. Return results
        return {
            projectId: project.id,
            assetId: asset.id
        };
    }
}