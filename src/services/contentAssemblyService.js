// Note: The original TypeScript file imported the 'supabase' client.
// In a standalone JS environment, you must ensure the 'supabase' client
// is accessible if you uncomment the database interaction logic.
// import { supabase } from '@/integrations/supabase/client';

/**
 * @typedef {object} ContentAssemblyRequest
 * @property {string} assetType
 * @property {string} targetAudience
 * @property {string} primaryMessage
 * @property {number} [maxLength]
 * @property {string} brandId
 * @property {object} [preferences]
 * @property {'clinical' | 'conversational' | 'patient_friendly'} [preferences.tone]
 * @property {boolean} [preferences.includeStatistics]
 * @property {boolean} [preferences.emphasizeSafety]
 * @property {'brief' | 'short' | 'medium' | 'long'} [preferences.preferredLength]
 */

/**
 * @typedef {object} ContentModule
 * @property {string} id
 * @property {string} text
 * @property {string} type
 * @property {string} [lengthVariant]
 * @property {string} [toneVariant]
 * @property {number} characterCount
 */

/**
 * @typedef {object} ClaimVariant
 * @property {string} id
 * @property {string} text
 * @property {string} type
 * @property {number} characterCount
 * @property {string} [parentClaimText]
 */

/**
 * @typedef {object} PairedModule
 * @property {string} id
 * @property {string} text
 * @property {string} type
 */

/**
 * @typedef {object} ContentSuggestion
 * @property {ContentModule} module
 * @property {string[]} linkedClaims
 * @property {string[]} requiredReferences
 * @property {string[]} requiredSafety
 * @property {number} usageScore
 * @property {number} complianceScore
 * @property {PairedModule[]} [pairedModules]
 * @property {string} reasoning
 */

/**
 * @typedef {object} ClaimVariantSuggestion
 * @property {ClaimVariant} variant
 * @property {string[]} suitableForChannels
 * @property {number} conversionRate
 * @property {number} usageCount
 * @property {boolean} requiresFootnote
 * @property {string} [footnoteText]
 * @property {string} reasoning
 */

/**
 * @typedef {object} RequiredDisclosure
 * @property {string} id
 * @property {string} text
 * @property {string} type
 */

/**
 * @typedef {object} AssetConfig
 * @property {string} displayName
 * @property {Record<string, number>} characterLimits
 * @property {number} maxClaims
 * @property {boolean} requiresFairBalance
 * @property {string} isiPlacement
 */

/**
 * @typedef {object} ContentAssemblyResponse
 * @property {string} assetType
 * @property {AssetConfig} assetConfig
 * @property {ContentSuggestion[]} suggestions
 * @property {ClaimVariantSuggestion[]} claimVariants
 * @property {RequiredDisclosure[]} requiredDisclosures
 * @property {number} estimatedComplianceScore
 * @property {number} totalModulesAvailable
 * @property {number} totalClaimVariantsAvailable
 */

export class ContentAssemblyService {
    /**
     * Assemble intelligent content package for specific asset type by calling a Supabase function.
     * @param {ContentAssemblyRequest} request
     * @returns {Promise<ContentAssemblyResponse>}
     */
    static async assembleContent(request) {
        // NOTE: 'supabase' must be globally available or imported for this to work.
        const { data, error } = await supabase.functions.invoke('assemble-content', {
            body: request
        });

        if (error) {
            console.error('Error assembling content:', error);
            throw new Error('Failed to assemble content package');
        }

        return data;
    }

    /**
     * Get available asset type configurations from the database.
     * @returns {Promise<any[]>}
     */
    static async getAssetTypeConfigurations() {
        const { data, error } = await supabase
            .from('asset_type_configurations')
            .select('*')
            .order('display_name');

        if (error) {
            console.error('Error fetching asset configurations:', error);
            throw error;
        }

        return data;
    }

    /**
     * Get content modules for a brand, with optional filters.
     * @param {string} brandId
     * @param {object} [filters]
     * @param {string} [filters.moduleType]
     * @param {string} [filters.lengthVariant]
     * @param {string} [filters.toneVariant]
     * @param {boolean} [filters.mlrApproved]
     * @returns {Promise<any[]>}
     */
    static async getContentModules(brandId, filters) {
        let query = supabase
            .from('content_modules')
            .select('*')
            .eq('brand_id', brandId)
            .order('usage_score', { ascending: false });

        if (filters?.moduleType) {
            query = query.eq('module_type', filters.moduleType);
        }
        if (filters?.lengthVariant) {
            query = query.eq('length_variant', filters.lengthVariant);
        }
        if (filters?.toneVariant) {
            query = query.eq('tone_variant', filters.toneVariant);
        }
        if (filters?.mlrApproved !== undefined) {
            query = query.eq('mlr_approved', filters.mlrApproved);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching content modules:', error);
            throw error;
        }

        return data;
    }

    /**
     * Get claim variants for a specific claim, including parent claim text.
     * @param {string} claimId
     * @returns {Promise<any[]>}
     */
    static async getClaimVariants(claimId) {
        const { data, error } = await supabase
            .from('claim_variants')
            .select(`
                *,
                parent_claim:parent_claim_id(
                    claim_text,
                    claim_type
                )
            `)
            .eq('parent_claim_id', claimId)
            .order('conversion_rate', { ascending: false });

        if (error) {
            console.error('Error fetching claim variants:', error);
            throw error;
        }

        return data;
    }

    /**
     * Track module usage when content is used in an asset by calling a stored procedure.
     * @param {string} moduleId
     * @returns {Promise<void>}
     */
    static async trackModuleUsage(moduleId) {
        const { error } = await supabase.rpc('increment_module_usage', {
            module_id: moduleId
        });

        if (error) {
            console.error('Error tracking module usage:', error);
        }
    }

    /**
     * Record successful module combination for relationship learning.
     * @param {string} sourceModuleId
     * @param {string} targetModuleId
     * @returns {Promise<void>}
     */
    static async recordModulePairing(sourceModuleId, targetModuleId) {
        // Check if relationship exists
        const { data: existing } = await supabase
            .from('content_relationships')
            .select('id, usage_frequency')
            .eq('source_module_id', sourceModuleId)
            .eq('target_module_id', targetModuleId)
            .eq('relationship_type', 'frequently_paired_with')
            .single();

        if (existing) {
            // Increment usage frequency
            await supabase
                .from('content_relationships')
                .update({
                    usage_frequency: existing.usage_frequency + 1,
                    confidence_score: Math.min(0.95, existing.usage_frequency / 10) // Max 0.95
                })
                .eq('id', existing.id);
        } else {
            // Create new relationship
            await supabase
                .from('content_relationships')
                .insert({
                    source_module_id: sourceModuleId,
                    target_module_id: targetModuleId,
                    relationship_type: 'frequently_paired_with',
                    created_from_usage_pattern: true,
                    usage_frequency: 1,
                    confidence_score: 0.1
                });
        }
    }

    /**
     * Get content relationships for a module, including target module details.
     * @param {string} moduleId
     * @returns {Promise<any[]>}
     */
    static async getModuleRelationships(moduleId) {
        const { data, error } = await supabase
            .from('content_relationships')
            .select(`
                *,
                target_module:target_module_id(
                    module_text,
                    module_type,
                    length_variant,
                    tone_variant
                )
            `)
            .eq('source_module_id', moduleId)
            .order('confidence_score', { ascending: false });

        if (error) {
            console.error('Error fetching module relationships:', error);
            throw error;
        }

        return data;
    }
}