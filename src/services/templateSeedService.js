// ============================================
// Template Seed Service (JavaScript)
// ============================================

// Assumed imports (Note: The original code uses type-only imports which are removed, but the supabase client import is kept)
import { supabase } from '@/integrations/supabase/client';
// import type { DesignTemplate, LayoutConfiguration } from '@/types/designStudio';

/**
 * @typedef {Object} Position
 * @property {number} x
 * @property {number} y
 * @property {number} width
 * @property {number} height
 */

/**
 * @typedef {Object} Constraints
 * @property {boolean} required
 * @property {boolean} editable
 * @property {number} [maxCharacters]
 */

/**
 * @typedef {Object} Zone
 * @property {string} id
 * @property {string} name
 * @property {string} type - e.g., 'logo', 'image', 'headline', 'body', 'cta', 'isi'
 * @property {Position} position
 * @property {Constraints} constraints
 */

/**
 * @typedef {Object} LayoutConfiguration
 * @property {Zone[]} zones
 * @property {{ width: number, height: number }} dimensions
 * @property {string} structure - e.g., 'single-column'
 * @property {string} orientation - e.g., 'portrait'
 */

/**
 * @typedef {Object} AudienceAdaptation
 * @property {string} audience_type - e.g., 'hcp', 'patient'
 * @property {string} sub_segment - e.g., 'expert', 'entry', 'newly_diagnosed'
 * @property {Object} visual_style
 * @property {string} visual_style.imagery
 * @property {string} visual_style.complexity
 * @property {string} visual_style.tone
 * @property {string} layout_preference
 */

/**
 * @typedef {Object} LayoutOptimization
 * @property {string} variation_id
 * @property {string} name
 * @property {string} layout_type
 * @property {('primary'|'secondary'|'neutral')} color_emphasis
 * @property {('top'|'middle'|'bottom')} cta_placement
 * @property {('footer'|'sidebar')} fair_balance_layout
 */

/**
 * @typedef {Object} DesignTemplate
 * @property {string} brand_id
 * @property {string} template_name
 * @property {string} template_category
 * @property {string} asset_type
 * @property {string} description
 * @property {string[]} tags
 * @property {LayoutConfiguration} base_layout
 * @property {Object} [variation_capabilities]
 * @property {AudienceAdaptation[]} [variation_capabilities.audienceAdaptations]
 * @property {LayoutOptimization[]} [variation_capabilities.layoutOptimizations]
 * @property {Object[]} [variation_capabilities.channelAdaptations]
 * @property {Object} [brand_requirements]
 * @property {Object} [performance_history]
 * @property {number} [performance_history.avgEngagement]
 */


export class TemplateSeedService {
    /**
     * Seeds initial email templates and their variations into the database.
     * @param {string} brandId
     * @returns {Promise<any[]>}
     */
    static async seedEmailTemplates(brandId) {
        console.log('Seeding email templates for brand:', brandId);

        const templates = this.getEmailTemplates(brandId);
        /** @type {any[]} */
        const createdTemplates = [];

        for (const template of templates) {
            const { data, error } = await supabase
                .from('design_templates')
                .insert(template)
                .select()
                .single();

            if (error) {
                console.error('Template seed error:', error);
                continue;
            }

            console.log('Created template:', data.template_name);
            createdTemplates.push(data);

            // Generate 12 variations per template
            await this.generateTemplateVariations(data.id);
        }

        return createdTemplates;
    }

    /**
     * Defines the mock data for email templates.
     * @private
     * @param {string} brandId
     * @returns {Partial<DesignTemplate>[]}
     */
    static getEmailTemplates(brandId) {
        return [
            {
                brand_id: brandId,
                template_name: 'Clinical Evidence Hero',
                template_category: 'email',
                asset_type: 'email',
                description: 'Data-driven layout for expert HCP audiences with prominent data visualization',
                tags: ['hcp', 'expert', 'clinical', 'data'],
                base_layout: {
                    zones: [
                        {
                            id: 'header',
                            name: 'Header Logo',
                            type: 'logo',
                            position: { x: 20, y: 20, width: 150, height: 50 },
                            constraints: { required: true, editable: false }
                        },
                        {
                            id: 'hero-data',
                            name: 'Data Visualization',
                            type: 'image',
                            position: { x: 0, y: 80, width: 600, height: 300 },
                            constraints: { required: true, editable: true }
                        },
                        {
                            id: 'headline',
                            name: 'Key Finding Headline',
                            type: 'headline',
                            position: { x: 40, y: 400, width: 520, height: 60 },
                            constraints: { maxCharacters: 80, required: true, editable: true }
                        },
                        {
                            id: 'body',
                            name: 'Clinical Summary',
                            type: 'body',
                            position: { x: 40, y: 480, width: 520, height: 200 },
                            constraints: { maxCharacters: 500, required: true, editable: true }
                        },
                        {
                            id: 'cta',
                            name: 'Call to Action',
                            type: 'cta',
                            position: { x: 40, y: 700, width: 200, height: 50 },
                            constraints: { maxCharacters: 30, required: true, editable: true }
                        },
                        {
                            id: 'isi',
                            name: 'Important Safety Information',
                            type: 'isi',
                            position: { x: 40, y: 780, width: 520, height: 150 },
                            constraints: { required: true, editable: false }
                        }
                    ],
                    dimensions: { width: 600, height: 950 },
                    structure: 'single-column',
                    orientation: 'portrait'
                },
                variation_capabilities: {
                    audienceAdaptations: [
                        {
                            audience_type: 'hcp',
                            sub_segment: 'expert',
                            visual_style: {
                                imagery: 'clinical',
                                complexity: 'detailed',
                                tone: 'scientific'
                            },
                            layout_preference: 'image-first'
                        }
                    ],
                    layoutOptimizations: [
                        { variation_id: 'hero-top', name: 'Hero Top', layout_type: 'hero-top', color_emphasis: 'primary', cta_placement: 'bottom', fair_balance_layout: 'footer' },
                        { variation_id: 'hero-side', name: 'Hero Side', layout_type: 'hero-side', color_emphasis: 'primary', cta_placement: 'middle', fair_balance_layout: 'sidebar' },
                        { variation_id: 'grid', name: 'Grid Layout', layout_type: 'grid', color_emphasis: 'secondary', cta_placement: 'bottom', fair_balance_layout: 'footer' }
                    ],
                    channelAdaptations: [
                        { channel: 'email', format: 'html', dimensions: { width: 600, height: 950 }, responsive: true }
                    ]
                },
                brand_requirements: {
                    colorPalette: [],
                    typography: {
                        headingFont: 'Arial',
                        bodyFont: 'Arial',
                        weights: ['400', '600', '700']
                    },
                    spacing: { min: 20, preferred: 40 },
                    regulatoryZones: [
                        {
                            type: 'isi',
                            placement: 'fixed',
                            minSize: { width: 520, height: 120 },
                            required: true
                        }
                    ]
                },
                performance_history: {
                    avgEngagement: 78,
                    topPerformingVariations: ['hero-top_primary_cta-bottom'],
                    audienceResonance: { 'hcp_expert': 85 }
                }
            },
            {
                brand_id: brandId,
                template_name: 'Educational Journey',
                template_category: 'email',
                asset_type: 'email',
                description: 'Step-by-step visual flow for entry-level HCP and patient education',
                tags: ['hcp', 'patient', 'educational', 'simple'],
                base_layout: {
                    zones: [
                        {
                            id: 'header',
                            name: 'Header Logo',
                            type: 'logo',
                            position: { x: 20, y: 20, width: 150, height: 50 },
                            constraints: { required: true, editable: false }
                        },
                        {
                            id: 'headline',
                            name: 'Educational Headline',
                            type: 'headline',
                            position: { x: 40, y: 90, width: 520, height: 60 },
                            constraints: { maxCharacters: 70, required: true, editable: true }
                        },
                        {
                            id: 'step1',
                            name: 'Step 1 Visual',
                            type: 'image',
                            position: { x: 40, y: 170, width: 520, height: 180 },
                            constraints: { required: true, editable: true }
                        },
                        {
                            id: 'step1-text',
                            name: 'Step 1 Description',
                            type: 'body',
                            position: { x: 40, y: 360, width: 520, height: 80 },
                            constraints: { maxCharacters: 200, required: true, editable: true }
                        },
                        {
                            id: 'cta',
                            name: 'Call to Action',
                            type: 'cta',
                            position: { x: 40, y: 460, width: 200, height: 50 },
                            constraints: { maxCharacters: 30, required: true, editable: true }
                        },
                        {
                            id: 'isi',
                            name: 'Important Safety Information',
                            type: 'isi',
                            position: { x: 40, y: 540, width: 520, height: 150 },
                            constraints: { required: true, editable: false }
                        }
                    ],
                    dimensions: { width: 600, height: 710 },
                    structure: 'single-column',
                    orientation: 'portrait'
                },
                variation_capabilities: {
                    audienceAdaptations: [
                        {
                            audience_type: 'hcp',
                            sub_segment: 'entry',
                            visual_style: {
                                imagery: 'educational',
                                complexity: 'simple',
                                tone: 'professional'
                            },
                            layout_preference: 'balanced'
                        },
                        {
                            audience_type: 'patient',
                            sub_segment: 'newly_diagnosed',
                            visual_style: {
                                imagery: 'lifestyle',
                                complexity: 'simple',
                                tone: 'warm'
                            },
                            layout_preference: 'image-first'
                        }
                    ],
                    layoutOptimizations: [
                        { variation_id: 'hero-top', name: 'Hero Top', layout_type: 'hero-top', color_emphasis: 'primary', cta_placement: 'middle', fair_balance_layout: 'footer' },
                        { variation_id: 'minimal', name: 'Minimal', layout_type: 'minimal', color_emphasis: 'neutral', cta_placement: 'bottom', fair_balance_layout: 'footer' },
                        { variation_id: 'grid', name: 'Grid Layout', layout_type: 'grid', color_emphasis: 'secondary', cta_placement: 'middle', fair_balance_layout: 'footer' }
                    ],
                    channelAdaptations: [
                        { channel: 'email', format: 'html', dimensions: { width: 600, height: 710 }, responsive: true }
                    ]
                },
                brand_requirements: {
                    colorPalette: [],
                    typography: {
                        headingFont: 'Arial',
                        bodyFont: 'Arial',
                        weights: ['400', '600']
                    },
                    spacing: { min: 20, preferred: 30 },
                    regulatoryZones: [
                        {
                            type: 'isi',
                            placement: 'fixed',
                            minSize: { width: 520, height: 120 },
                            required: true
                        }
                    ]
                },
                performance_history: {
                    avgEngagement: 72,
                    topPerformingVariations: ['hero-top_primary_cta-middle'],
                    audienceResonance: { 'hcp_entry': 75, 'patient_newly_diagnosed': 80 }
                }
            },
            {
                brand_id: brandId,
                template_name: 'Patient Support Warm',
                template_category: 'email',
                asset_type: 'email',
                description: 'Warm, supportive design for newly diagnosed patients',
                tags: ['patient', 'supportive', 'warm', 'lifestyle'],
                base_layout: {
                    zones: [
                        {
                            id: 'header',
                            name: 'Header Logo',
                            type: 'logo',
                            position: { x: 20, y: 20, width: 150, height: 50 },
                            constraints: { required: true, editable: false }
                        },
                        {
                            id: 'hero',
                            name: 'Hero Image',
                            type: 'image',
                            position: { x: 0, y: 80, width: 600, height: 350 },
                            constraints: { required: true, editable: true }
                        },
                        {
                            id: 'headline',
                            name: 'Supportive Headline',
                            type: 'headline',
                            position: { x: 40, y: 450, width: 520, height: 60 },
                            constraints: { maxCharacters: 60, required: true, editable: true }
                        },
                        {
                            id: 'body',
                            name: 'Supportive Message',
                            type: 'body',
                            position: { x: 40, y: 530, width: 520, height: 150 },
                            constraints: { maxCharacters: 400, required: true, editable: true }
                        },
                        {
                            id: 'cta',
                            name: 'Call to Action',
                            type: 'cta',
                            position: { x: 40, y: 700, width: 200, height: 50 },
                            constraints: { maxCharacters: 30, required: true, editable: true }
                        },
                        {
                            id: 'isi',
                            name: 'Important Safety Information',
                            type: 'isi',
                            position: { x: 40, y: 780, width: 520, height: 150 },
                            constraints: { required: true, editable: false }
                        }
                    ],
                    dimensions: { width: 600, height: 950 },
                    structure: 'single-column',
                    orientation: 'portrait'
                },
                variation_capabilities: {
                    audienceAdaptations: [
                        {
                            audience_type: 'patient',
                            sub_segment: 'newly_diagnosed',
                            visual_style: {
                                imagery: 'lifestyle',
                                complexity: 'simple',
                                tone: 'warm'
                            },
                            layout_preference: 'image-first'
                        }
                    ],
                    layoutOptimizations: [
                        { variation_id: 'hero-top', name: 'Hero Top', layout_type: 'hero-top', color_emphasis: 'primary', cta_placement: 'bottom', fair_balance_layout: 'footer' },
                        { variation_id: 'hero-side', name: 'Hero Side', layout_type: 'hero-side', color_emphasis: 'secondary', cta_placement: 'middle', fair_balance_layout: 'footer' },
                        { variation_id: 'minimal', name: 'Minimal', layout_type: 'minimal', color_emphasis: 'neutral', cta_placement: 'bottom', fair_balance_layout: 'footer' }
                    ],
                    channelAdaptations: [
                        { channel: 'email', format: 'html', dimensions: { width: 600, height: 950 }, responsive: true }
                    ]
                },
                brand_requirements: {
                    colorPalette: [],
                    typography: {
                        headingFont: 'Arial',
                        bodyFont: 'Arial',
                        weights: ['400', '600']
                    },
                    spacing: { min: 20, preferred: 30 },
                    regulatoryZones: [
                        {
                            type: 'isi',
                            placement: 'fixed',
                            minSize: { width: 520, height: 120 },
                            required: true
                        }
                    ]
                },
                performance_history: {
                    avgEngagement: 82,
                    topPerformingVariations: ['hero-top_primary_cta-bottom'],
                    audienceResonance: { 'patient_newly_diagnosed': 88 }
                }
            }
        ];
    }

    /**
     * Generates and seeds a set of standard variations for a given template.
     * @private
     * @param {string} templateId
     * @returns {Promise<void>}
     */
    static async generateTemplateVariations(templateId) {
        const layouts = ['hero-top', 'hero-side', 'grid'];
        const colorSchemes = ['primary', 'secondary'];
        const ctaPlacements = ['top', 'bottom'];

        /** @type {any[]} */
        const variations = [];
        for (const layout of layouts) {
            for (const color of colorSchemes) {
                for (const cta of ctaPlacements) {
                    variations.push({
                        template_id: templateId,
                        variation_name: `${layout}_${color}_cta-${cta}`,
                        variation_type: 'layout',
                        layout_config: {},
                        visual_adaptations: {
                            colorScheme: color,
                            layoutPriority: layout === 'hero-top' ? 'image-first' : 'text-first',
                            ctaStyle: 'button',
                            fairBalancePlacement: 'footer'
                        }
                    });
                }
            }
        }

        const { error } = await supabase.from('template_variations').insert(variations);
        if (error) {
            console.error('Variation seed error:', error);
        } else {
            console.log(`Created ${variations.length} variations for template ${templateId}`);
        }
    }
}