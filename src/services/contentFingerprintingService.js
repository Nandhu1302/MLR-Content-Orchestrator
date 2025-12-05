// Note: The 'supabase' client must be globally available or imported in the
// consuming environment for the database operations to work.
// import { supabase } from '@/integrations/supabase/client';

/**
 * @typedef {object} ContentFingerprint
 * @property {string} [theme_id] - ID of the primary message theme.
 * @property {string} [theme_name] - Name of the primary message theme.
 * @property {string} [primary_message] - The main message of the content.
 * @property {string[]} [secondary_messages] - Supporting messages.
 * @property {'professional'|'conversational'|'authoritative'|'empathetic'} [tone] - Detected tone of the content.
 * @property {'basic'|'intermediate'|'advanced'} [complexity_level] - Detected complexity.
 * @property {string[]} [emotional_appeal] - Keywords related to emotional drivers.
 * @property {string[]} [claims_used] - Specific claims or data points mentioned.
 * @property {string[]} [references_cited] - Sources or clinical trials referenced.
 * @property {boolean} [efficacy_focus] - Whether efficacy is a primary focus.
 * @property {boolean} [safety_focus] - Whether safety is a primary focus.
 * @property {number} [content_length] - Length of the content (e.g., word count, character count, slide count).
 * @property {string[]} [sections] - Key sections/headings in the content.
 * @property {boolean} [visuals_included] - Whether the content contains visual elements.
 * @property {boolean} [data_visualizations] - Whether charts or graphs are present.
 * @property {string} [cta_type] - Type of Call to Action (e.g., 'download', 'register').
 * @property {string} [cta_text] - The text used for the CTA.
 * @property {string} [cta_placement] - Location of the CTA (e.g., 'top', 'footer').
 * @property {string} [subject_line] - Email subject line.
 * @property {string} [headline] - Primary headline (Web/Presentation).
 * @property {string[]} [hashtags] - Social media hashtags.
 * @property {string} [target_audience] - Target audience segment.
 * @property {string} [specialty_focus] - Medical specialty focus.
 * @property {string[]} [extracted_keywords] - Automatically extracted keywords.
 * @property {string[]} [semantic_themes] - AI-detected underlying semantic themes.
 */

/**
 * Service for analyzing and extracting content characteristics into a structured
 * ContentFingerprint object for storage and comparison.
 */
export class ContentFingerprintingService {
    /**
     * Helper: Detect tone from text content based on simple heuristics.
     * @param {string} [text] - The content text.
     * @returns {ContentFingerprint['tone']}
     * @private
     */
    static detectTone(text) {
        if (!text) return 'professional';

        const lowerText = text.toLowerCase();

        // Simple heuristics for tone detection
        if (lowerText.includes('we understand') || lowerText.includes('support')) {
            return 'empathetic';
        } else if (lowerText.includes('clinical trial') || lowerText.includes('statistically significant')) {
            return 'authoritative';
        } else if (lowerText.includes('you') || lowerText.includes('your patients')) {
            return 'conversational';
        }

        return 'professional';
    }

    /**
     * Helper: Detect complexity level based on word count and average word length.
     * @param {string} [text] - The content text.
     * @returns {ContentFingerprint['complexity_level']}
     * @private
     */
    static detectComplexity(text) {
        if (!text) return 'basic';

        const wordCount = text.split(/\s+/).length;
        const avgWordLength = text.length / wordCount;

        // Simple heuristics
        if (avgWordLength > 6 && wordCount > 500) {
            return 'advanced';
        } else if (avgWordLength > 5 || wordCount > 300) {
            return 'intermediate';
        }

        return 'basic';
    }

    /**
     * Helper: Extract CTA type based on simple keyword matching.
     * @param {string} [text] - The content text.
     * @returns {string} - The detected CTA type string.
     * @private
     */
    static extractCTA(text) {
        if (!text) return 'none';

        const lowerText = text.toLowerCase();

        if (lowerText.includes('learn more')) return 'learn_more';
        if (lowerText.includes('download')) return 'download';
        if (lowerText.includes('register')) return 'register';
        if (lowerText.includes('contact')) return 'contact';
        if (lowerText.includes('view') || lowerText.includes('see')) return 'view_details';

        return 'generic';
    }

    /**
     * Helper: Extract claims from text using simple regex patterns.
     * @param {string} [text] - The content text.
     * @returns {string[]} - List of matched claims (case-insensitive).
     * @private
     */
    static extractClaims(text) {
        if (!text) return [];

        // Simple pattern matching for claims
        const claimPatterns = [
            /proven efficacy/gi,
            /demonstrated/gi,
            /clinical trial/gi,
            /statistically significant/gi,
            /reduces/gi,
            /improves/gi,
        ];

        const claims = [];
        claimPatterns.forEach(pattern => {
            const matches = text.match(pattern);
            if (matches) {
                // Add all matches and ensure they are converted to strings if necessary
                claims.push(...matches.map(m => String(m)));
            }
        });

        // Use a Set to remove duplicates before returning
        return [...new Set(claims)];
    }

    /**
     * Helper: Extract top 10 keywords by frequency, excluding common stop words.
     * @param {string} [text] - The content text.
     * @returns {string[]} - List of top keywords.
     * @private
     */
    static extractKeywords(text) {
        if (!text) return [];

        // Simple keyword extraction (in production, use NLP library)
        const words = text.toLowerCase().split(/\s+/);
        const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 'for', 'to', 'of', 'in', 'it', 'with'];

        const keywordFrequencies = words
            .filter(word => word.length > 4 && !stopWords.includes(word))
            .reduce((acc, word) => {
                // Remove trailing punctuation (commas, periods)
                const cleanWord = word.replace(/[.,!?]$/, '');
                acc[cleanWord] = (acc[cleanWord] || 0) + 1;
                return acc;
            }, {});

        return Object.entries(keywordFrequencies)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10)
            .map(([word]) => word);
    }

    /**
     * Extract content fingerprint from email content data.
     * @param {object} emailData - Raw data structure containing email fields.
     * @returns {ContentFingerprint}
     */
    static extractEmailFingerprint(emailData) {
        // Concatenate relevant text fields for detection helpers
        const allText = `${emailData.subject || emailData.subject_line || ''} ${emailData.body || ''}`;

        return {
            subject_line: emailData.subject || emailData.subject_line,
            content_length: emailData.body?.length || 0,
            tone: this.detectTone(allText),
            complexity_level: this.detectComplexity(allText),
            cta_type: this.extractCTA(allText),
            cta_text: emailData.cta_text,
            claims_used: this.extractClaims(allText),
            extracted_keywords: this.extractKeywords(allText),
            theme_id: emailData.theme_id,
            target_audience: emailData.audience_segment,
        };
    }

    /**
     * Extract content fingerprint from presentation/vault content data.
     * @param {object} presentationData - Raw data structure containing presentation fields.
     * @returns {ContentFingerprint}
     */
    static extractPresentationFingerprint(presentationData) {
        const allText = presentationData.content || '';

        return {
            headline: presentationData.title,
            content_length: presentationData.slide_count || 0,
            tone: this.detectTone(allText),
            complexity_level: this.detectComplexity(allText),
            visuals_included: presentationData.has_visuals !== false,
            data_visualizations: presentationData.has_charts || presentationData.has_graphs,
            claims_used: this.extractClaims(allText),
            references_cited: presentationData.references || [],
            theme_id: presentationData.theme_id,
            specialty_focus: presentationData.specialty,
        };
    }

    /**
     * Extract content fingerprint from web page data.
     * @param {object} webData - Raw data structure containing web page fields.
     * @returns {ContentFingerprint}
     */
    static extractWebFingerprint(webData) {
        const allText = webData.content || '';

        return {
            headline: webData.page_title,
            content_length: webData.word_count || 0,
            tone: this.detectTone(allText),
            complexity_level: this.detectComplexity(allText),
            sections: webData.sections || [],
            cta_type: this.extractCTA(allText),
            extracted_keywords: webData.meta_keywords || [],
            target_audience: webData.target_audience,
        };
    }

    /**
     * Extract content fingerprint from social post data.
     * @param {object} socialData - Raw data structure containing social post fields.
     * @returns {ContentFingerprint}
     */
    static extractSocialFingerprint(socialData) {
        const allText = socialData.post_text || '';

        return {
            content_length: allText.length || 0,
            tone: this.detectTone(allText),
            complexity_level: 'basic', // Social typically simple
            hashtags: socialData.hashtags || [],
            emotional_appeal: socialData.emotion_tags || [],
            extracted_keywords: this.extractKeywords(allText),
            cta_type: this.extractCTA(allText),
        };
    }

    /**
     * Register new content in the content registry database table.
     * @param {string} brandId - The ID of the brand.
     * @param {string} contentType - Type of content (e.g., 'email', 'web', 'presentation').
     * @param {string} contentName - User-friendly name of the content.
     * @param {string} sourceSystem - System of origin (e.g., 'CRM', 'Vault').
     * @param {string} externalContentId - ID from the external system.
     * @param {ContentFingerprint} fingerprint - The extracted content characteristics.
     * @param {any} [additionalMetadata] - Optional extra metadata.
     * @returns {Promise<any>} The inserted data record.
     */
    static async registerContent(
        brandId,
        contentType,
        contentName,
        sourceSystem,
        externalContentId,
        fingerprint,
        additionalMetadata
    ) {
        try {
            const { data, error } = await supabase
                .from('content_registry')
                .insert([{
                    brand_id: brandId,
                    content_type: contentType,
                    content_name: contentName,
                    source_system: sourceSystem,
                    external_content_id: externalContentId,
                    // Supabase automatically handles JSON serialization for the content_fingerprint column
                    content_fingerprint: fingerprint,
                    theme_id: fingerprint.theme_id || additionalMetadata?.theme_id,
                    asset_id: additionalMetadata?.asset_id,
                    status: 'active',
                }])
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error registering content:', error);
            throw error;
        }
    }

    /**
     * Update the fingerprint for an existing content registry record.
     * @param {string} contentRegistryId - The ID of the record in the content_registry table.
     * @param {ContentFingerprint} fingerprint - The new or updated fingerprint data.
     * @returns {Promise<void>}
     */
    static async updateContentFingerprint(
        contentRegistryId,
        fingerprint
    ) {
        try {
            const { error } = await supabase
                .from('content_registry')
                .update({
                    content_fingerprint: fingerprint,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', contentRegistryId);

            if (error) throw error;
        } catch (error) {
            console.error('Error updating content fingerprint:', error);
            throw error;
        }
    }

    /**
     * Get content by fingerprint similarity (currently a simple fetch, needs vector search in production).
     * @param {string} brandId - The ID of the brand to search within.
     * @param {ContentFingerprint} fingerprint - The fingerprint to compare against.
     * @param {number} [limit=10] - Maximum number of results to return.
     * @returns {Promise<any[]>} List of content registry records.
     */
    static async findSimilarContent(
        brandId,
        fingerprint,
        limit = 10
    ) {
        try {
            // For production, this would involve a vector similarity search (e.g., pgvector extension)
            // comparing the vector embedding of the input fingerprint with stored embeddings.
            // For now, it performs a simple filtered query.
            const { data, error } = await supabase
                .from('content_registry')
                .select('*, campaign_performance_analytics(*)')
                .eq('brand_id', brandId)
                .eq('status', 'active')
                .limit(limit);

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error finding similar content:', error);
            return [];
        }
    }
}