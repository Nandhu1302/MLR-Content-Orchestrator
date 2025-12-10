// ============================================
// Template Recommendation Service (JavaScript)
// ============================================

// Assumed imports (Note: The original code uses type-only imports which are removed, but the supabase import is kept)
import { supabase } from '@/integrations/supabase/client';
// import type { ContentAsset, ContentVariation, PersonalizationFactors } from '@/types/content';
// import type { DesignTemplate, TemplateRecommendation } from '@/types/designStudio';

/**
 * @typedef {Object} ContentAsset
 * @property {string} brand_id
 * @property {string} asset_type
 * @property {Object} [primary_content]
 * @property {Object} [metadata]
 */

/**
 * @typedef {Object} ContentVariation
 * // Placeholder for content variation details
 */

/**
 * @typedef {Object} PersonalizationFactors
 * @property {string} [hcp_experience_level] - e.g., 'expert', 'entry'
 * @property {string} [patient_disease_stage] - e.g., 'newly_diagnosed', 'treatment_experienced'
 * @property {string} [patient_health_literacy] - e.g., 'low', 'high'
 */

/**
 * @typedef {Object} DesignTemplate
 * @property {string} id
 * @property {string} brand_id
 * @property {string} asset_type
 * @property {boolean} is_active
 * @property {Object} base_layout
 * @property {Array<{ type: string }>} base_layout.zones
 * @property {Object} [variation_capabilities]
 * @property {Array<{ sub_segment: string }>} [variation_capabilities.audienceAdaptations]
 * @property {Object} [performance_history]
 * @property {number} [performance_history.avgEngagement]
 * @property {Object} [brand_requirements]
 * @property {Array<{ type: string }>} [brand_requirements.regulatoryZones]
 */

/**
 * @typedef {Object} TemplateRecommendation
 * @property {DesignTemplate} template
 * @property {number} score
 * @property {string[]} reasoning
 * @property {PersonalizationFactors} [matchedFactors]
 */


export class TemplateRecommendationService {
    /**
     * Recommend templates based on content asset and personalization factors
     * @param {ContentAsset} asset
     * @param {ContentVariation} [variation]
     * @param {PersonalizationFactors} [personalizationFactors]
     * @returns {Promise<TemplateRecommendation[]>}
     */
    static async recommendTemplates(
        asset,
        variation,
        personalizationFactors
    ) {
        // Fetch all templates for this brand and asset type
        const { data: templates } = await supabase
            .from('design_templates')
            .select('*')
            .eq('brand_id', asset.brand_id)
            .eq('asset_type', asset.asset_type)
            .eq('is_active', true);

        if (!templates || templates.length === 0) {
            return [];
        }

        // Score each template
        const scoredTemplates = templates.map(template => ({
            /** @type {DesignTemplate} */
            template: template,
            score: this.calculateTemplateScore(
                template,
                asset,
                personalizationFactors
            ),
            reasoning: this.generateReasoning(
                template,
                asset,
                personalizationFactors
            ),
            matchedFactors: personalizationFactors
        }));

        // Sort by score and return top 5
        return scoredTemplates
            .sort((a, b) => b.score - a.score)
            .slice(0, 5);
    }

    /**
     * Calculate template match score (0-100)
     * @private
     * @param {DesignTemplate} template
     * @param {ContentAsset} asset
     * @param {PersonalizationFactors} [factors]
     * @returns {number}
     */
    static calculateTemplateScore(
        template,
        asset,
        factors
    ) {
        let score = 0;

        // 1. Content Fit Score (30 points)
        score += this.scoreContentFit(template, asset);

        // 2. Audience Alignment Score (30 points)
        score += this.scoreAudienceAlignment(template, factors);

        // 3. Brand Compliance Score (20 points)
        score += 20; // Assume all templates are brand-compliant (full score)

        // 4. Performance History Score (15 points)
        score += this.scorePerformanceHistory(template);

        // 5. Regulatory Coverage Score (5 points)
        score += this.scoreRegulatoryCoverage(template);

        return Math.min(100, score);
    }

    /**
     * Scores how well the template's zones match the asset's required content fields.
     * @private
     * @param {DesignTemplate} template
     * @param {ContentAsset} asset
     * @returns {number}
     */
    static scoreContentFit(template, asset) {
        let score = 0;

        // Check if template has zones for all content fields
        const contentFields = Object.keys(asset.primary_content || {});
        // Ensure template.base_layout and template.base_layout.zones exist
        const templateZones = template.base_layout?.zones?.map(z => z.type) || [];

        const matchedFields = contentFields.filter(field =>
            templateZones.includes(field)
        );

        // Calculate score based on the ratio of matched fields to total required fields
        if (contentFields.length > 0) {
            score = (matchedFields.length / contentFields.length) * 30;
        } else {
            // If the asset has no primary content fields, give a moderate score
            score = 15; 
        }

        return score;
    }

    /**
     * Scores how well the template's adaptations align with personalization factors.
     * @private
     * @param {DesignTemplate} template
     * @param {PersonalizationFactors} [factors]
     * @returns {number}
     */
    static scoreAudienceAlignment(
        template,
        factors
    ) {
        if (!factors) return 15; // Default score if no personalization factors are provided

        let score = 0;
        const audienceAdaptations = template.variation_capabilities?.audienceAdaptations || [];

        // Check for HCP sub-segment match (15 points potential)
        if (factors.hcp_experience_level) {
            const hasMatch = audienceAdaptations.some(
                a => a.sub_segment === factors.hcp_experience_level
            );
            if (hasMatch) score += 15;
        }

        // Check for Patient sub-segment match (15 points potential)
        if (factors.patient_disease_stage) {
            const hasMatch = audienceAdaptations.some(
                a => a.sub_segment === factors.patient_disease_stage
            );
            if (hasMatch) score += 15;
        }
        
        // Use default score if no specific match
        if (score === 0) score = 10;

        return Math.min(30, score);
    }

    /**
     * Scores template based on historical average engagement rate.
     * @private
     * @param {DesignTemplate} template
     * @returns {number}
     */
    static scorePerformanceHistory(template) {
        const avgEngagement = template.performance_history?.avgEngagement || 0;
        // Assume avgEngagement is a percentage (0-100). Scale to 15 points.
        return (avgEngagement / 100) * 15; 
    }

    /**
     * Scores template based on inclusion of required regulatory zones (e.g., ISI).
     * @private
     * @param {DesignTemplate} template
     * @returns {number}
     */
    static scoreRegulatoryCoverage(template) {
        const hasISI = template.brand_requirements?.regulatoryZones?.some(
            z => z.type === 'isi'
        );
        return hasISI ? 5 : 0;
    }

    /**
     * Generates human-readable reasoning for the recommendation.
     * @private
     * @param {DesignTemplate} template
     * @param {ContentAsset} asset
     * @param {PersonalizationFactors} [factors]
     * @returns {string[]}
     */
    static generateReasoning(
        template,
        asset,
        factors
    ) {
        /** @type {string[]} */
        const reasons = [];

        // Add personalization fit reasons
        if (factors?.hcp_experience_level === 'expert') {
            reasons.push('Optimized for expert HCP with data-heavy layout');
        }

        if (factors?.hcp_experience_level === 'entry') {
            reasons.push('Simplified layout for entry-level HCP education');
        }

        if (factors?.patient_health_literacy === 'low') {
            reasons.push('Uses visual explanations and simple language zones');
        }

        if (factors?.patient_disease_stage === 'newly_diagnosed') {
            reasons.push('Warm, supportive design for newly diagnosed patients');
        }

        // Add performance reason
        if (template.performance_history?.avgEngagement && template.performance_history.avgEngagement > 70) {
            reasons.push(`High historical engagement rate (${template.performance_history.avgEngagement}%)`);
        }

        // Add content fit reason
        reasons.push(`Perfect fit for ${asset.asset_type} channel`);

        // Add regulatory reason
        if (template.brand_requirements?.regulatoryZones?.length > 0) {
            reasons.push('Includes required regulatory zones');
        }

        return reasons;
    }
}