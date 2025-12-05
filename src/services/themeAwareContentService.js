// ============================================
// Theme Aware Content Service (JavaScript)
// ============================================

// Assumed imports (Note: Only client imports are kept; service imports are assumed available in the scope)
// import { ThemeService } from './themeService';
// import { unifiedDataService } from './unifiedDataService';
// import { metadataGenerationService } from './metadataGenerationService';
import { supabase } from '@/integrations/supabase/client';
// import type { ThemeLibraryEntry } from '@/types/strategy';

/**
 * @typedef {Object} IntelligenceData
 * @property {any} [brand]
 * @property {any} [competitive]
 * @property {any} [market]
 * @property {any} [regulatory]
 * @property {any} [public]
 */

/**
 * @typedef {Object} IntakeContext
 * @property {string} [original_key_message]
 * @property {string} [original_cta]
 * @property {string} [intake_objective]
 * @property {string} [intake_audience]
 * @property {string} [indication]
 * @property {string} [current_body]
 * @property {string} [enhancement_type]
 */

/**
 * @typedef {Object} ThemeContentOptions
 * @property {string} brandId
 * @property {string} assetType
 * @property {string} [targetAudience]
 * @property {string} [channel]
 * @property {string[]} [selectedThemes]
 * @property {any} [globalContext]
 * @property {IntakeContext} [intakeContext]
 */

/**
 * @typedef {Object} ThemeLibraryEntry
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {string} key_message
 * @property {string} [call_to_action]
 * @property {Object} [content_suggestions]
 * @property {string[]} [content_suggestions.headlines]
 * @property {string[]} [content_suggestions.key_points]
 * @property {Object} [rationale]
 * @property {string} [rationale.primary_insight]
 * @property {string[]} [rationale.supporting_data]
 * @property {Object[]} [regulatory_considerations]
 * @property {string} [regulatory_considerations.description]
 */

/**
 * @typedef {Object} ThemeAlignedContent
 * @property {string} subject
 * @property {string} headline
 * @property {string} body
 * @property {string} cta
 * @property {string} disclaimer
 * @property {Object} themeAlignment
 * @property {ThemeLibraryEntry[]} themeAlignment.selectedThemes
 * @property {number} themeAlignment.alignmentScore
 * @property {string[]} themeAlignment.recommendations
 */

export class ThemeAwareContentService {
    /**
     * Generate content aligned with selected strategic themes
     * @param {string} field - The content field to generate ('subject', 'headline', 'body', 'cta')
     * @param {ThemeContentOptions} options
     * @returns {Promise<string[]>}
     */
    static async generateThemeAlignedContent(
        field,
        options
    ) {
        try {
            // Get active themes from global context or fetch them
            const activeThemes = await this.getActiveThemes(options);

            if (activeThemes.length === 0) {
                return this.getFallbackContent(field, options);
            }

            // Generate content suggestions based on themes and intake context
            if (field === 'body' && options.intakeContext?.current_body && options.intakeContext?.original_key_message) {
                // Expand existing content based on key message
                const expansionPrompts = [
                    `Expand this content while maintaining focus on "${options.intakeContext.original_key_message}": ${options.intakeContext.current_body}`,
                    `Add clinical evidence and professional details to support: ${options.intakeContext.original_key_message}`,
                    `Enhance with medical terminology and HCP-relevant information: ${options.intakeContext.current_body}`
                ];

                return expansionPrompts;
            }

            if (field === 'cta' && options.intakeContext?.original_cta) {
                // Enhance CTA based on original
                const activeThemes = await this.getActiveThemes(options);
                return [
                    `Learn more about ${activeThemes[0]?.name || 'clinical evidence'}`,
                    `Access comprehensive information on ${options.intakeContext.original_cta.toLowerCase()}`,
                    `Discover the latest research on ${activeThemes[0]?.description || 'patient care'}`
                ];
            }

            // Get active themes for standard generation
            // const themes = await this.getActiveThemes(options); // activeThemes is already fetched above
            const themeBasedSuggestions = await this.generateThemeBasedSuggestions(
                field,
                activeThemes,
                options
            );

            return themeBasedSuggestions;
        } catch (error) {
            console.error('Error generating theme-aligned content:', error);
            return this.getFallbackContent(field, options);
        }
    }

    /**
     * Validate content alignment with themes
     * @param {Record<string, any>} content
     * @param {ThemeContentOptions} options
     * @returns {Promise<{ alignmentScore: number, recommendations: string[], misalignedElements: string[] }>}
     */
    static async validateThemeAlignment(
        content,
        options
    ) {
        try {
            const activeThemes = await this.getActiveThemes(options);

            if (activeThemes.length === 0) {
                return {
                    alignmentScore: 0.5,
                    recommendations: ['No active themes selected for validation'],
                    misalignedElements: []
                };
            }

            const alignmentResults = await this.analyzeContentThemeAlignment(
                content,
                activeThemes,
                options
            );

            return alignmentResults;
        } catch (error) {
            console.error('Error validating theme alignment:', error);
            return {
                alignmentScore: 0.5,
                recommendations: ['Unable to validate theme alignment'],
                misalignedElements: []
            };
        }
    }

    /**
     * Get content recommendations based on theme context
     * @param {string} currentContent
     * @param {ThemeContentOptions} options
     * @returns {Promise<{ suggestions: string[], themeGaps: string[], optimizations: string[] }>}
     */
    static async getThemeRecommendations(
        currentContent,
        options
    ) {
        try {
            const activeThemes = await this.getActiveThemes(options);

            // Analyze current content against themes
            // Assuming metadataGenerationService is available globally or imported
            const analysis = await metadataGenerationService.generateMetadata(
                { content: currentContent },
                'content',
                'temp-id',
                { includeAIAnalysis: true, brandId: options.brandId }
            );

            const recommendations = [];
            const themeGaps = [];
            const optimizations = [];

            for (const theme of activeThemes) {
                // Check if content aligns with theme messaging
                if (theme.key_message && !currentContent.toLowerCase().includes(theme.key_message.toLowerCase())) {
                    themeGaps.push(`Consider incorporating "${theme.key_message}" from **${theme.name}** theme`);
                }

                // Check call-to-action alignment
                if (theme.call_to_action && theme.call_to_action !== 'N/A') {
                    recommendations.push(`Consider using CTA: "**${theme.call_to_action}**" (from ${theme.name})`);
                }

                // Check content suggestions alignment
                if (theme.content_suggestions?.headlines?.length) {
                    optimizations.push(`Headline suggestion from ${theme.name}: "**${theme.content_suggestions.headlines[0]}**"`);
                }

                if (theme.content_suggestions?.key_points?.length) {
                    optimizations.push(`Key point from ${theme.name}: ${theme.content_suggestions.key_points[0]}`);
                }
            }

            return {
                suggestions: recommendations,
                themeGaps,
                optimizations
            };
        } catch (error) {
            console.error('Error getting theme recommendations:', error);
            return {
                suggestions: [],
                themeGaps: [],
                optimizations: []
            };
        }
    }

    /**
     * Create theme-specific content templates
     * @param {string} themeId
     * @param {string} assetType
     * @param {string} brandId
     * @returns {Promise<Record<string, string[]>>}
     */
    static async createThemeTemplate(
        themeId,
        assetType,
        brandId
    ) {
        try {
            // Assuming ThemeService is available globally or imported
            const theme = await ThemeService.getThemeById(themeId);
            if (!theme) {
                throw new Error('Theme not found');
            }

            const template = {
                subject: this.generateSubjectTemplates(theme, assetType),
                headline: this.generateHeadlineTemplates(theme, assetType),
                body: this.generateBodyTemplates(theme, assetType),
                cta: this.generateCTATemplates(theme, assetType),
                disclaimer: this.generateDisclaimerTemplates(theme, assetType)
            };

            return template;
        } catch (error) {
            console.error('Error creating theme template:', error);
            return this.getDefaultTemplate(assetType);
        }
    }

    // Private helper methods

    /**
     * @private
     * @param {ThemeContentOptions} options
     * @returns {Promise<ThemeLibraryEntry[]>}
     */
    static async getActiveThemes(options) {
        try {
            // Priority 1: Use explicitly selected themes from options
            if (options.selectedThemes?.length) {
                // Assuming ThemeService is available
                const themes = await Promise.all(
                    options.selectedThemes.map(themeId => ThemeService.getThemeById(themeId))
                );
                return themes.filter(t => t !== null);
            }

            // Priority 2: Get theme from global context (selected in Strategy Hub)
            if (options.globalContext?.selectedTheme) {
                return [options.globalContext.selectedTheme];
            }

            // Priority 3: Get theme from intake context (if project created with theme)
            if (options.intakeContext?.selectedThemeId) {
                const theme = await ThemeService.getThemeById(options.intakeContext.selectedThemeId);
                return theme ? [theme] : [];
            }

            // Priority 4: Check cross-module context
            if (options.globalContext?.crossModuleData?.strategy?.selectedThemes) {
                const themeIds = options.globalContext.crossModuleData.strategy.selectedThemes;
                const themes = await Promise.all(
                    themeIds.map(themeId => ThemeService.getThemeById(themeId))
                );
                return themes.filter(theme => theme !== null);
            }

            // Priority 5: Recommend themes based on intake context
            if (options.globalContext?.intakeData || options.intakeContext) {
                try {
                    const recommendations = await ThemeService.getThemeRecommendations({
                        brand_id: options.brandId,
                        project_context: {
                            name: options.globalContext?.projectName || 'Content Project',
                            type: 'single-asset',
                            audience: options.targetAudience || options.intakeContext?.intake_audience || '',
                            markets: [],
                            objectives: [options.intakeContext?.intake_objective || '']
                        },
                        max_results: 3
                    });

                    return recommendations.slice(0, 2).map(r => r.theme);
                } catch (error) {
                    console.error('Error getting theme recommendations:', error);
                }
            }

            return [];
        } catch (error) {
            console.error('Error getting active themes:', error);
            return [];
        }
    }

    /**
     * Fetches intelligence layers for a theme from the database
     * @private
     * @param {string} themeId
     * @param {string} brandId
     * @returns {Promise<IntelligenceData>}
     */
    static async fetchIntelligenceLayers(
        themeId,
        brandId
    ) {
        const { data: intelligenceRecords, error } = await supabase
            .from('theme_intelligence')
            .select('*')
            .eq('theme_id', themeId)
            .eq('brand_id', brandId);

        if (error) {
            console.error('Error fetching intelligence layers:', error);
            return {
                brand: null,
                competitive: null,
                market: null,
                regulatory: null,
                public: null
            };
        }

        // Transform array of records into structured object
        /** @type {IntelligenceData} */
        const intelligence = {
            brand: null,
            competitive: null,
            market: null,
            regulatory: null,
            public: null
        };

        intelligenceRecords?.forEach((record) => {
            const type = record.intelligence_type;
            if (intelligence.hasOwnProperty(type)) {
                intelligence[type] = {
                    ...record.intelligence_data,
                    incorporated: record.incorporated,
                    user_notes: record.user_notes
                };
            }
        });

        return intelligence;
    }

    /**
     * Gets intelligence context summary for UI display
     * @param {string} themeId
     * @param {string} brandId
     * @returns {Promise<{ intelligenceLayers: Record<string, any>, incorporatedCount: number, totalLayers: number }>}
     */
    static async getIntelligenceContextSummary(
        themeId,
        brandId
    ) {
        const intelligence = await this.fetchIntelligenceLayers(themeId, brandId);

        const layers = {};
        let incorporatedCount = 0;

        Object.entries(intelligence).forEach(([key, value]) => {
            if (value) {
                layers[key] = value;
                if (value.incorporated) {
                    incorporatedCount++;
                }
            }
        });

        return {
            intelligenceLayers: layers,
            incorporatedCount,
            totalLayers: Object.keys(layers).length
        };
    }

    /**
     * @private
     * @param {string} field
     * @param {ThemeLibraryEntry[]} themes
     * @param {ThemeContentOptions} options
     * @returns {Promise<string[]>}
     */
    static async generateThemeBasedSuggestions(
        field,
        themes,
        options
    ) {
        const suggestions = [];

        for (const theme of themes) {
            // Fetch intelligence layers for this theme
            const intelligence = await this.fetchIntelligenceLayers(theme.id, options.brandId);
            const hasIntelligence = this.hasIncorporatedIntelligence(intelligence);

            // If intelligence is available and incorporated, use AI synthesis
            if (hasIntelligence && ['subject', 'headline', 'body', 'cta'].includes(field)) {
                try {
                    const aiSuggestion = await this.generateWithIntelligence(field, theme, intelligence, options);
                    if (aiSuggestion) {
                        suggestions.push(aiSuggestion);
                        continue; // Skip template generation for this theme
                    }
                } catch (error) {
                    console.error('AI synthesis failed, falling back to templates:', error);
                }
            }

            // Fallback to template-based generation
            switch (field) {
                case 'subject':
                    suggestions.push(...this.generateSubjectFromTheme(theme, options));
                    break;
                case 'headline':
                    suggestions.push(...this.generateHeadlineFromTheme(theme, options));
                    break;
                case 'body':
                    suggestions.push(...this.generateBodyFromTheme(theme, options));
                    break;
                case 'cta':
                    suggestions.push(...this.generateCTAFromTheme(theme, options));
                    break;
            }
        }

        // Deduplicate and return top 3 suggestions
        const uniqueSuggestions = Array.from(new Set(suggestions));
        return uniqueSuggestions.slice(0, 3);
    }

    /**
     * @private
     * @param {IntelligenceData} intelligence
     * @returns {boolean}
     */
    static hasIncorporatedIntelligence(intelligence) {
        return Object.values(intelligence).some(layer => layer && layer.incorporated === true);
    }

    /**
     * @private
     * @param {string} field
     * @param {ThemeLibraryEntry} theme
     * @param {IntelligenceData} intelligence
     * @param {ThemeContentOptions} options
     * @returns {Promise<string | null>}
     */
    static async generateWithIntelligence(
        field,
        theme,
        intelligence,
        options
    ) {
        // This function relies on a Supabase Edge Function or similar external AI service
        const { data, error } = await supabase.functions.invoke('synthesize-enriched-content', {
            body: {
                field,
                theme: {
                    name: theme.name,
                    key_message: theme.key_message,
                    description: theme.description
                },
                intelligence,
                context: {
                    assetType: options.assetType,
                    targetAudience: options.targetAudience,
                    indication: options.intakeContext?.indication || 'treatment',
                    objective: 'Inform and engage healthcare professionals with strategic intelligence'
                }
            }
        });

        if (error || !data?.content) {
            console.error('Intelligence synthesis error:', error);
            return null;
        }

        return data.content;
    }

    /**
     * @private
     * @param {ThemeLibraryEntry} theme
     * @param {ThemeContentOptions} options
     * @returns {string[]}
     */
    static generateSubjectFromTheme(theme, options) {
        const subjects = [];

        if (theme.key_message) {
            subjects.push(`${theme.key_message} - New Evidence`);
            subjects.push(`Important Update: ${theme.key_message}`);
        }

        if (theme.content_suggestions?.headlines?.length) {
            subjects.push(theme.content_suggestions.headlines[0]);
        }

        // Asset type specific adaptations
        if (options.assetType === 'email') {
            subjects.push(`${theme.name}: Clinical Insights for Your Practice`);
        } else if (options.assetType === 'dsa') {
            subjects.push(`${theme.name} - Prescribing Information Update`);
        }

        return subjects.filter(Boolean);
    }

    /**
     * @private
     * @param {ThemeLibraryEntry} theme
     * @param {ThemeContentOptions} options
     * @returns {string[]}
     */
    static generateHeadlineFromTheme(theme, options) {
        const headlines = [];

        if (theme.key_message) {
            headlines.push(theme.key_message);
        }

        if (theme.content_suggestions?.headlines?.length) {
            headlines.push(...theme.content_suggestions.headlines);
        }

        // Generate headlines based on theme rationale
        if (theme.rationale?.primary_insight) {
            headlines.push(`${theme.rationale.primary_insight}: ${theme.name}`);
        }

        return headlines.filter(Boolean).slice(0, 3);
    }

    /**
     * @private
     * @param {ThemeLibraryEntry} theme
     * @param {ThemeContentOptions} options
     * @returns {string[]}
     */
    static generateBodyFromTheme(theme, options) {
        const bodies = [];

        // Start with intake key message if available and expand it
        if (options.intakeContext?.original_key_message) {
            const keyMessage = options.intakeContext.original_key_message;

            // Create enhanced versions of the original key message
            bodies.push(`${keyMessage}. Recent clinical evidence supports this approach through enhanced patient outcomes and improved therapeutic interventions.`);

            if (theme.rationale?.primary_insight) {
                bodies.push(`${keyMessage}. ${theme.rationale.primary_insight}. This strategic approach aligns with current evidence-based practices.`);
            }

            if (theme.rationale?.supporting_data?.length) {
                bodies.push(`${keyMessage}. ${theme.rationale.supporting_data[0]}. These findings represent significant advancement in patient care.`);
            }

            // Asset-specific expansions of intake key message
            if (options.assetType === 'email') {
                bodies.push(`Dear Healthcare Professional,

${keyMessage}

This evidence-based insight represents a significant opportunity to enhance patient outcomes in your clinical practice. The latest research demonstrates meaningful improvements in therapeutic effectiveness when this approach is properly implemented.

We invite you to explore how this advancement can benefit your patients.`);
            } else if (options.assetType === 'web') {
                bodies.push(`${keyMessage}

This breakthrough understanding opens new possibilities for improved patient care. Clinical data supports enhanced therapeutic outcomes through targeted intervention strategies that align with current medical best practices.`);
            }
        } else {
            // Fallback to theme-based generation
            let themeBody = '';

            if (theme.rationale?.primary_insight) {
                themeBody += `${theme.rationale.primary_insight}. `;
            }

            if (theme.rationale?.supporting_data?.length) {
                themeBody += `${theme.rationale.supporting_data[0]}. `;
            }

            if (theme.key_message) {
                themeBody += `${theme.key_message}. `;
            }

            if (theme.content_suggestions?.key_points?.length) {
                themeBody += `Key considerations include: ${theme.content_suggestions.key_points.join(', ')}.`;
            }

            if (themeBody) {
                bodies.push(themeBody.trim());
            }

            // Asset-specific body variations
            if (options.assetType === 'web') {
                bodies.push(`Discover how ${theme.name} can transform patient outcomes in your practice. ${theme.key_message || ''}`);
            } else if (options.assetType === 'email') {
                bodies.push(`Dear Healthcare Professional, ${theme.key_message || theme.description}. This evidence-based approach offers new opportunities for improved patient care.`);
            }
        }

        return bodies.filter(Boolean);
    }

    /**
     * @private
     * @param {ThemeLibraryEntry} theme
     * @param {ThemeContentOptions} options
     * @returns {string[]}
     */
    static generateCTAFromTheme(theme, options) {
        const ctas = [];

        // Prioritize intake CTA as inspiration
        if (options.intakeContext?.original_cta) {
            const originalCTA = options.intakeContext.original_cta;
            ctas.push(originalCTA); // Use original as first option

            // Create variations inspired by original CTA
            ctas.push(`${originalCTA} - Clinical Evidence`);
            ctas.push(`${originalCTA} Today`);
        }

        if (theme.call_to_action && theme.call_to_action !== 'N/A') {
            ctas.push(theme.call_to_action);
        }

        // Generate CTAs based on theme focus
        if (!options.intakeContext?.original_cta) {
            ctas.push(`Learn More About ${theme.name}`);
            ctas.push(`Explore ${theme.name} Evidence`);
        }

        if (options.assetType === 'dsa') {
            ctas.push('Request Prescribing Information');
            ctas.push('Access Safety Data');
        } else if (options.assetType === 'email') {
            ctas.push('Download Clinical Data');
            ctas.push('Schedule a Discussion');
        }

        return Array.from(new Set(ctas)).slice(0, 3);
    }

    /**
     * @private
     * @param {Record<string, any>} content
     * @param {ThemeLibraryEntry[]} themes
     * @param {ThemeContentOptions} options
     * @returns {Promise<{ alignmentScore: number, recommendations: string[], misalignedElements: string[] }>}
     */
    static async analyzeContentThemeAlignment(
        content,
        themes,
        options
    ) {
        let totalAlignment = 0;
        const recommendations = [];
        const misalignedElements = [];

        const contentText = Object.values(content).join(' ').toLowerCase();

        for (const theme of themes) {
            let themeAlignment = 0;

            // Check key message alignment (0.3 weight)
            if (theme.key_message && contentText.includes(theme.key_message.toLowerCase())) {
                themeAlignment += 0.3;
            } else if (theme.key_message) {
                misalignedElements.push(`Missing key message: "**${theme.key_message}**"`);
            }

            // Check theme name/concept presence (0.2 weight)
            if (contentText.includes(theme.name.toLowerCase())) {
                themeAlignment += 0.2;
            }

            // Check content suggestions alignment (0.3 weight)
            if (theme.content_suggestions?.key_points?.length) {
                const alignedPoints = theme.content_suggestions.key_points.filter(point =>
                    contentText.includes(point.toLowerCase())
                );
                themeAlignment += (alignedPoints.length / theme.content_suggestions.key_points.length) * 0.3;
            }

            // Check CTA alignment (0.2 weight)
            if (theme.call_to_action && content.cta &&
                content.cta.toLowerCase().includes(theme.call_to_action.toLowerCase())) {
                themeAlignment += 0.2;
            }

            totalAlignment += themeAlignment;

            // Generate recommendations
            if (themeAlignment < 0.5) {
                recommendations.push(`Strengthen alignment with **${theme.name}** theme`);
            }
        }

        const finalScore = themes.length > 0 ? totalAlignment / themes.length : 0;

        return {
            alignmentScore: Math.min(finalScore, 1),
            recommendations,
            misalignedElements
        };
    }

    /**
     * @private
     * @param {string} field
     * @param {ThemeContentOptions} options
     * @returns {string[]}
     */
    static getFallbackContent(field, options) {
        /** @type {Record<string, string[]>} */
        const fallbacks = {
            subject: [
                'Clinical Excellence in Patient Care',
                'Evidence-Based Treatment Insights',
                'Advancing Healthcare Outcomes'
            ],
            headline: [
                'Transforming Patient Care Through Innovation',
                'Evidence-Based Solutions for Better Outcomes',
                'Clinical Excellence Meets Patient-Centered Care'
            ],
            body: [
                'Discover evidence-based approaches that can enhance patient outcomes in your clinical practice.',
                'Recent clinical evidence demonstrates the potential for improved patient care through targeted therapeutic interventions.',
                'As healthcare continues to evolve, evidence-based treatment decisions remain at the forefront of optimal patient care.'
            ],
            cta: [
                'Learn More',
                'Explore Clinical Data',
                'Request Information'
            ]
        };

        return fallbacks[field] || ['Generated content'];
    }

    /**
     * @private
     * @param {ThemeLibraryEntry} theme
     * @param {string} assetType
     * @returns {string[]}
     */
    static generateSubjectTemplates(theme, assetType) {
        // Template generation based on theme
        return this.generateSubjectFromTheme(theme, { assetType, brandId: '' });
    }

    /**
     * @private
     * @param {ThemeLibraryEntry} theme
     * @param {string} assetType
     * @returns {string[]}
     */
    static generateHeadlineTemplates(theme, assetType) {
        return this.generateHeadlineFromTheme(theme, { assetType, brandId: '' });
    }

    /**
     * @private
     * @param {ThemeLibraryEntry} theme
     * @param {string} assetType
     * @returns {string[]}
     */
    static generateBodyTemplates(theme, assetType) {
        return this.generateBodyFromTheme(theme, { assetType, brandId: '' });
    }

    /**
     * @private
     * @param {ThemeLibraryEntry} theme
     * @param {string} assetType
     * @returns {string[]}
     */
    static generateCTATemplates(theme, assetType) {
        return this.generateCTAFromTheme(theme, { assetType, brandId: '' });
    }

    /**
     * @private
     * @param {ThemeLibraryEntry} theme
     * @param {string} assetType
     * @returns {string[]}
     */
    static generateDisclaimerTemplates(theme, assetType) {
        const disclaimers = [];

        // Add regulatory considerations if available
        if (theme.regulatory_considerations?.length) {
            disclaimers.push(...theme.regulatory_considerations.map(reg => reg.description));
        }

        // Default disclaimers by asset type
        if (assetType === 'dsa') {
            disclaimers.push('Please see full Prescribing Information and Medication Guide.');
        } else if (assetType === 'email') {
            disclaimers.push('This information is intended for healthcare professionals only.');
        }

        return disclaimers;
    }

    /**
     * @private
     * @param {string} assetType
     * @returns {Record<string, string[]>}
     */
    static getDefaultTemplate(assetType) {
        return {
            subject: this.getFallbackContent('subject', { assetType, brandId: '' }),
            headline: this.getFallbackContent('headline', { assetType, brandId: '' }),
            body: this.getFallbackContent('body', { assetType, brandId: '' }),
            cta: this.getFallbackContent('cta', { assetType, brandId: '' }),
            disclaimer: []
        };
    }
}