// ============================================
// Strategic Context Extractor (JavaScript)
// ============================================

// import type { SourceAsset } from './localizationSourceService';
/**
 * @typedef {Object} SourceAsset
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {string} type
 * @property {any} content // Could be string or an object with a content property
 * @property {Object} [metadata]
 * @property {string} [project_name]
 * @property {string} [project_id]
 * @property {Object} [metadata.intake_context]
 * @property {string} [metadata.intake_context.indication]
 * @property {string} [metadata.intake_context.keyMessage]
 * @property {string} [metadata.intake_context.callToAction]
 * @property {string} [metadata.intake_context.targetAudience]
 * @property {string} [metadata.intake_context.primaryObjective]
 * @property {string[]} [metadata.intake_context.secondaryObjectives]
 * @property {string[]} [metadata.intake_context.selectedAssetTypes]
 * @property {Object} [metadata.theme]
 * @property {string} [metadata.theme.name]
 * @property {string} [metadata.theme.description]
 * @property {string} [metadata.theme.rationale]
 * @property {any} [metadata.theme.performance_prediction]
 * @property {any} [metadata.theme.performancePrediction]
 * @property {any} [metadata.theme.messaging_framework]
 * @property {any} [metadata.theme.messagingFramework]
 * @property {string} [metadata.therapeutic_area]
 * @property {string} [metadata.compliance_level]
 * @property {string} [metadata.sourceMarket]
 */

/**
 * @typedef {Object} ExtractedStrategicContext
 * @property {string} [indication]
 * @property {string} [keyMessage]
 * @property {string} [callToAction]
 * @property {string} [targetAudience]
 * @property {string} [primaryObjective]
 * @property {string[]} [secondaryObjectives]
 * @property {string} [themeName]
 * @property {string} [themeDescription]
 * @property {string} [themeRationale]
 * @property {any} [performancePrediction]
 * @property {any} [messagingFramework]
 * @property {string} [projectName]
 * @property {string} [projectDescription]
 * @property {string} [therapeuticArea]
 * @property {string} [complianceLevel]
 * @property {string} [assetType]
 * @property {string} [channelType]
 * @property {string} [contentSummary]
 * @property {string} [sourceMarket]
 */

export class StrategicContextExtractor {
    /**
     * Extracts relevant strategic context data from a SourceAsset object.
     * @param {SourceAsset} asset
     * @returns {ExtractedStrategicContext}
     */
    static extractFromAsset(asset) {
        /** @type {ExtractedStrategicContext} */
        const context = {};

        // Extract from intake_context in metadata
        const intakeContext = asset.metadata?.intake_context;
        if (intakeContext) {
            context.indication = intakeContext.indication;
            context.keyMessage = intakeContext.keyMessage;
            context.callToAction = intakeContext.callToAction;
            context.targetAudience = intakeContext.targetAudience;
            context.primaryObjective = intakeContext.primaryObjective;
            context.secondaryObjectives = intakeContext.secondaryObjectives;
        }

        // Extract from metadata.theme
        if (asset.metadata?.theme) {
            const theme = asset.metadata.theme;
            context.themeName = theme.name;
            context.themeDescription = theme.description;
            context.themeRationale = theme.rationale;
            // Handle snake_case or camelCase property names
            context.performancePrediction = theme.performance_prediction || theme.performancePrediction;
            context.messagingFramework = theme.messaging_framework || theme.messagingFramework;
        }

        // Extract project context
        context.projectName = asset.project_name;
        context.projectDescription = asset.description;
        context.therapeuticArea = asset.metadata?.therapeutic_area;
        context.complianceLevel = asset.metadata?.compliance_level;

        // Extract asset context
        context.assetType = asset.type;
        // Assuming the first selected asset type in intake context is the primary channel
        context.channelType = intakeContext?.selectedAssetTypes?.[0];
        
        // Summarize content, handling both string content and object content
        let contentToSummarize = '';
        if (typeof asset.content === 'string') {
            contentToSummarize = asset.content;
        } else if (asset.content && typeof asset.content.content === 'string') {
            contentToSummarize = asset.content.content;
        }
        
        context.contentSummary = contentToSummarize.substring(0, 500);
        
        context.sourceMarket = asset.metadata?.sourceMarket;

        return context;
    }

    /**
     * Formats the extracted context into a human-readable string (Markdown format).
     * @param {ExtractedStrategicContext} context
     * @returns {string}
     */
    static formatContextForDisplay(context) {
        const sections = [];

        if (context.indication) {
            sections.push(`**Indication:** ${context.indication}`);
        }

        if (context.keyMessage) {
            sections.push(`**Key Message:** ${context.keyMessage}`);
        }

        if (context.callToAction) {
            sections.push(`**Call to Action:** ${context.callToAction}`);
        }

        if (context.targetAudience) {
            sections.push(`**Target Audience:** ${context.targetAudience}`);
        }

        if (context.themeName) {
            sections.push(`\n**Theme:** ${context.themeName}`);
            if (context.themeDescription) {
                sections.push(`${context.themeDescription}`);
            }
        }

        return sections.join('\n\n');
    }

    /**
     * Generates a project name based on the source asset and target markets.
     * @param {SourceAsset} asset
     * @param {string[]} markets
     * @returns {string}
     */
    static generateProjectName(asset, markets) {
        return `${asset.name} - ${markets.join(', ')} Adaptation`;
    }

    /**
     * Generates a project description incorporating key context elements.
     * @param {SourceAsset} asset
     * @param {string[]} markets
     * @param {string[]} languages
     * @returns {string}
     */
    static generateProjectDescription(asset, markets, languages) {
        const context = this.extractFromAsset(asset);

        return `Global-to-local adaptation of "${asset.name}" for ${markets.join(', ')} markets in ${languages.join(', ')}. Original indication: ${context.indication || 'N/A'}. Asset type: ${asset.type}.`;
    }
}