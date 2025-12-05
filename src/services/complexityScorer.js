// Note: The original TypeScript file imported the 'supabase' client.
// In a standalone JS environment, you must ensure the 'supabase' client
// is accessible if you uncomment the database interaction logic.
// import { supabase } from '@/integrations/supabase/client';

/**
 * @typedef {object} ComplexityFactors
 * @property {string[]} textFactors
 * @property {string[]} culturalFactors
 * @property {string[]} technicalFactors
 * @property {string[]} visualFactors
 */

/**
 * @typedef {object} ComplexityBreakdown
 * @property {string[]} primaryDrivers
 * @property {string[]} secondaryFactors
 * @property {string[]} mitigationStrategies
 */

/**
 * @typedef {object} ComplexityMetrics
 * @property {number} textComplexityScore
 * @property {number} culturalComplexityScore
 * @property {number} technicalComplexityScore
 * @property {number} visualComplexityScore
 * @property {number} overallComplexityScore
 * @property {ComplexityFactors} complexityFactors
 * @property {number} effortMultiplier
 * @property {number} timelineImpactDays
 * @property {number} costImpactPercentage
 * @property {ComplexityBreakdown} complexityBreakdown
 */

export class ComplexityScorer {
    /**
     * Calculates the complexity metrics for a given content asset and target markets.
     * @param {string} projectId
     * @param {string} brandId
     * @param {string | null} contentAssetId
     * @param {any} sourceContent - The content object to analyze.
     * @param {string[]} targetLanguages
     * @param {string[]} targetMarkets
     * @returns {Promise<ComplexityMetrics>}
     */
    static async scoreContent(
        projectId,
        brandId,
        contentAssetId,
        sourceContent,
        targetLanguages,
        targetMarkets
    ) {
        try {
            // Analyze different complexity dimensions
            const textComplexity = await this.analyzeTextComplexity(sourceContent);
            const culturalComplexity = await this.analyzeCulturalComplexity(sourceContent, targetMarkets);
            const technicalComplexity = await this.analyzeTechnicalComplexity(sourceContent);
            const visualComplexity = await this.analyzeVisualComplexity(sourceContent);

            // Calculate individual scores (0-100 scale)
            const textComplexityScore = this.calculateTextComplexityScore(textComplexity);
            const culturalComplexityScore = this.calculateCulturalComplexityScore(culturalComplexity);
            const technicalComplexityScore = this.calculateTechnicalComplexityScore(technicalComplexity);
            const visualComplexityScore = this.calculateVisualComplexityScore(visualComplexity);

            // Calculate overall complexity using weighted average
            const overallComplexityScore = Math.round(
                (textComplexityScore * 0.3 +
                    culturalComplexityScore * 0.25 +
                    technicalComplexityScore * 0.25 +
                    visualComplexityScore * 0.2)
            );

            // Calculate impact metrics
            const effortMultiplier = this.calculateEffortMultiplier(overallComplexityScore);
            const timelineImpactDays = this.calculateTimelineImpact(overallComplexityScore, targetLanguages.length);
            const costImpactPercentage = this.calculateCostImpact(overallComplexityScore);

            // Generate complexity breakdown
            const complexityBreakdown = this.generateComplexityBreakdown(
                textComplexity,
                culturalComplexity,
                technicalComplexity,
                visualComplexity
            );

            /** @type {ComplexityMetrics} */
            const metrics = {
                textComplexityScore,
                culturalComplexityScore,
                technicalComplexityScore,
                visualComplexityScore,
                overallComplexityScore,
                complexityFactors: {
                    textFactors: textComplexity.factors,
                    culturalFactors: culturalComplexity.factors,
                    technicalFactors: technicalComplexity.factors,
                    visualFactors: visualComplexity.factors
                },
                effortMultiplier,
                timelineImpactDays,
                costImpactPercentage,
                complexityBreakdown
            };

            // Store metrics in database (Currently stubbed)
            await this.storeComplexityMetrics(projectId, brandId, contentAssetId, metrics);

            return metrics;
        } catch (error) {
            console.error('Complexity scoring failed:', error);
            throw new Error('Failed to calculate complexity metrics');
        }
    }

    /**
     * Analyzes linguistic and vocabulary complexity of the content.
     * @param {any} sourceContent
     * @returns {Promise<any>}
     */
    static async analyzeTextComplexity(sourceContent) {
        const text = this.extractTextContent(sourceContent);
        const factors = [];

        // Sentence complexity
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const words = text.split(/\s+/).filter(w => w.length > 0);
        const avgSentenceLength = words.length / sentences.length || 0;

        if (avgSentenceLength > 25) {
            factors.push('Very long sentences (>25 words average)');
        } else if (avgSentenceLength > 18) {
            factors.push('Long sentences (>18 words average)');
        }

        // Technical terminology
        const technicalTerms = this.countTechnicalTerms(text);
        if (technicalTerms > 15) {
            factors.push('High density of technical terms');
        } else if (technicalTerms > 8) {
            factors.push('Moderate technical terminology');
        }

        // Medical/pharmaceutical language
        const medicalTerms = this.countMedicalTerms(text);
        if (medicalTerms > 10) {
            factors.push('Heavy medical/pharmaceutical terminology');
        } else if (medicalTerms > 5) {
            factors.push('Medical terminology present');
        }

        // Legal language
        const legalTerms = this.countLegalTerms(text);
        if (legalTerms > 5) {
            factors.push('Legal language complexity');
        }

        // Readability metrics
        const readabilityScore = this.calculateReadabilityScore(text);
        if (readabilityScore < 30) {
            factors.push('Very difficult readability level');
        } else if (readabilityScore < 50) {
            factors.push('Difficult readability level');
        }

        return {
            factors,
            avgSentenceLength,
            technicalTerms,
            medicalTerms,
            legalTerms,
            readabilityScore,
            wordCount: words.length
        };
    }

    /**
     * Analyzes cultural sensitivity and market adaptation needs.
     * @param {any} sourceContent
     * @param {string[]} targetMarkets
     * @returns {Promise<any>}
     */
    static async analyzeCulturalComplexity(sourceContent, targetMarkets) {
        const text = this.extractTextContent(sourceContent);
        const factors = [];

        // Cultural references
        const culturalReferences = this.detectCulturalReferences(text);
        if (culturalReferences.length > 0) {
            factors.push(`Cultural references requiring adaptation: ${culturalReferences.join(', ')}`);
        }

        // Market-specific considerations
        const marketComplexity = this.assessMarketComplexity(targetMarkets);
        factors.push(...marketComplexity);

        // Color and imagery considerations (Requires mock logic as content structure is unknown)
        if (sourceContent.visualElements) {
            const colorComplexity = this.assessColorComplexity(sourceContent.visualElements);
            factors.push(...colorComplexity);
        }

        // Religious/cultural sensitivity
        const sensitiveContent = this.detectSensitiveContent(text);
        if (sensitiveContent.length > 0) {
            factors.push(`Culturally sensitive content: ${sensitiveContent.join(', ')}`);
        }

        return {
            factors,
            culturalReferences,
            marketComplexity,
            sensitiveContent
        };
    }

    /**
     * Analyzes the technical format and channel complexity.
     * @param {any} sourceContent
     * @returns {Promise<any>}
     */
    static async analyzeTechnicalComplexity(sourceContent) {
        const factors = [];

        // Asset type complexity
        const assetType = sourceContent.assetType || 'standard';
        if (assetType.includes('interactive')) {
            factors.push('Interactive content requires specialized handling');
        }
        if (assetType.includes('video')) {
            factors.push('Video content requires dubbing/subtitling');
        }
        if (assetType.includes('animation')) {
            factors.push('Animated content requires frame-by-frame adaptation');
        }

        // Format complexity
        const formatRequirements = this.analyzeFormatRequirements(sourceContent);
        factors.push(...formatRequirements);

        // Channel specifications
        const channelComplexity = this.analyzeChannelComplexity(sourceContent.channelSpecifications);
        factors.push(...channelComplexity);

        return {
            factors,
            assetType,
            formatRequirements,
            channelComplexity
        };
    }

    /**
     * Analyzes visual elements, including layout and embedded text in images.
     * @param {any} sourceContent
     * @returns {Promise<any>}
     */
    static async analyzeVisualComplexity(sourceContent) {
        const factors = [];

        // Image text complexity
        if (sourceContent.visualElements?.images) {
            const imageCount = sourceContent.visualElements.images.length;
            if (imageCount > 10) {
                factors.push('High number of images requiring text extraction');
            } else if (imageCount > 5) {
                factors.push('Multiple images with embedded text');
            }
        }

        // Infographic complexity
        if (sourceContent.primaryContent?.infographics ||
            sourceContent.assetType?.includes('infographic')) {
            factors.push('Complex infographic requiring redesign');
        }

        // Layout complexity
        const layoutComplexity = this.assessLayoutComplexity(sourceContent);
        factors.push(...layoutComplexity);

        return {
            factors,
            layoutComplexity
        };
    }

    /**
     * Calculates the Text Complexity score (0-100).
     * @param {any} textAnalysis
     * @returns {number}
     */
    static calculateTextComplexityScore(textAnalysis) {
        let score = 0;

        // Base score from sentence length
        if (textAnalysis.avgSentenceLength > 25) score += 30;
        else if (textAnalysis.avgSentenceLength > 18) score += 20;
        else if (textAnalysis.avgSentenceLength > 12) score += 10;

        // Technical terms impact
        if (textAnalysis.technicalTerms > 15) score += 25;
        else if (textAnalysis.technicalTerms > 8) score += 15;
        else if (textAnalysis.technicalTerms > 3) score += 8;

        // Medical terms impact
        if (textAnalysis.medicalTerms > 10) score += 20;
        else if (textAnalysis.medicalTerms > 5) score += 12;
        else if (textAnalysis.medicalTerms > 2) score += 6;

        // Readability impact
        if (textAnalysis.readabilityScore < 30) score += 20;
        else if (textAnalysis.readabilityScore < 50) score += 12;
        else if (textAnalysis.readabilityScore < 70) score += 5;

        return Math.min(100, score);
    }

    /**
     * Calculates the Cultural Complexity score (0-100).
     * @param {any} culturalAnalysis
     * @returns {number}
     */
    static calculateCulturalComplexityScore(culturalAnalysis) {
        let score = 0;

        score += culturalAnalysis.culturalReferences.length * 10;
        score += culturalAnalysis.sensitiveContent.length * 15;
        score += culturalAnalysis.marketComplexity.length * 5;

        return Math.min(100, score);
    }

    /**
     * Calculates the Technical Complexity score (0-100).
     * @param {any} technicalAnalysis
     * @returns {number}
     */
    static calculateTechnicalComplexityScore(technicalAnalysis) {
        let score = 0;

        if (technicalAnalysis.assetType.includes('interactive')) score += 30;
        if (technicalAnalysis.assetType.includes('video')) score += 25;
        if (technicalAnalysis.assetType.includes('animation')) score += 35;

        score += technicalAnalysis.formatRequirements.length * 8;
        score += technicalAnalysis.channelComplexity.length * 6;

        return Math.min(100, score);
    }

    /**
     * Calculates the Visual Complexity score (0-100).
     * @param {any} visualAnalysis
     * @returns {number}
     */
    static calculateVisualComplexityScore(visualAnalysis) {
        let score = 0;

        score += visualAnalysis.layoutComplexity.length * 12;

        return Math.min(100, score);
    }

    /**
     * Calculates the effort multiplier based on overall complexity.
     * @param {number} overallScore
     * @returns {number}
     */
    static calculateEffortMultiplier(overallScore) {
        if (overallScore > 80) return 2.5;
        if (overallScore > 60) return 2.0;
        if (overallScore > 40) return 1.5;
        if (overallScore > 20) return 1.2;
        return 1.0;
    }

    /**
     * Calculates the estimated timeline impact in days.
     * @param {number} overallScore
     * @param {number} languageCount
     * @returns {number}
     */
    static calculateTimelineImpact(overallScore, languageCount) {
        const baseImpact = Math.round(overallScore / 10);
        const languageMultiplier = Math.max(1, languageCount / 3);
        return Math.round(baseImpact * languageMultiplier);
    }

    /**
     * Calculates the estimated cost increase percentage.
     * @param {number} overallScore
     * @returns {number}
     */
    static calculateCostImpact(overallScore) {
        return Math.round(overallScore * 0.8); // Up to 80% cost increase for highest complexity
    }

    // --- Helper methods ---

    /**
     * Extracts text content from a potentially complex source object.
     * @param {any} sourceContent
     * @returns {string}
     */
    static extractTextContent(sourceContent) {
        if (typeof sourceContent === 'string') return sourceContent;

        let text = '';
        if (sourceContent.primaryContent) {
            Object.values(sourceContent.primaryContent).forEach((content) => {
                if (typeof content === 'string') {
                    text += content + ' ';
                } else if (content?.text || content?.content) {
                    text += (content.text || content.content) + ' ';
                }
            });
        }

        return text.trim();
    }

    /**
     * Counts occurrences of technical terms.
     * @param {string} text
     * @returns {number}
     */
    static countTechnicalTerms(text) {
        // Simple regex for acronyms, terms ending in -ology, -metric, -analysis, API, SDK
        const technicalRegex = /\b[A-Z]{2,}|\b\w*ology\b|\b\w*metric\b|\b\w*analysis\b|\bAPI\b|\bSDK\b/gi;
        return (text.match(technicalRegex) || []).length;
    }

    /**
     * Counts occurrences of medical/pharmaceutical terms.
     * @param {string} text
     * @returns {number}
     */
    static countMedicalTerms(text) {
        const medicalRegex = /\b(treatment|therapy|clinical|trial|study|efficacy|safety|dose|dosage|indication|contraindication|adverse|side.effect|pharmaceutical|drug|medication|prescription|FDA|approval|regulatory)\b/gi;
        return (text.match(medicalRegex) || []).length;
    }

    /**
     * Counts occurrences of legal/compliance terms.
     * @param {string} text
     * @returns {number}
     */
    static countLegalTerms(text) {
        const legalRegex = /\b(compliance|regulation|regulatory|disclaimer|warning|contraindication|liability|terms|conditions|agreement|consent|authorization)\b/gi;
        return (text.match(legalRegex) || []).length;
    }

    /**
     * Calculates a simplified readability score.
     * @param {string} text
     * @returns {number}
     */
    static calculateReadabilityScore(text) {
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const words = text.split(/\s+/).filter(w => w.length > 0);
        const avgWordsPerSentence = words.length / sentences.length || 0;

        // Simplified readability calculation (less is harder)
        return Math.max(0, 100 - (avgWordsPerSentence * 2));
    }

    /**
     * Detects simple cultural references.
     * @param {string} text
     * @returns {string[]}
     */
    static detectCulturalReferences(text) {
        const references = [];

        // Simple cultural reference detection
        if (text.match(/holiday|christmas|easter|thanksgiving/gi)) {
            references.push('Holiday references');
        }
        if (text.match(/baseball|football|soccer|cricket/gi)) {
            references.push('Sport references');
        }
        if (text.match(/dollar|cent|pound|euro|yen/gi)) {
            references.push('Currency references');
        }

        return references;
    }

    /**
     * Assesses complexity based on target market regulations and culture.
     * @param {string[]} targetMarkets
     * @returns {string[]}
     */
    static assessMarketComplexity(targetMarkets) {
        const complexity = [];

        targetMarkets.forEach(market => {
            switch (market.toLowerCase()) {
                case 'china':
                    complexity.push('China: Complex regulatory environment, cultural sensitivities');
                    break;
                case 'japan':
                    complexity.push('Japan: High cultural adaptation requirements');
                    break;
                case 'middle east':
                    complexity.push('Middle East: Religious and cultural considerations');
                    break;
                case 'india':
                    complexity.push('India: Multiple languages and cultural diversity');
                    break;
                default:
                    if (targetMarkets.length > 5 && !complexity.includes('Multiple market complexity')) {
                        complexity.push('Multiple market complexity');
                    }
            }
        });

        return complexity;
    }

    /**
     * Assesses complexity related to color symbolism in visuals.
     * @param {any} visualElements
     * @returns {string[]}
     */
    static assessColorComplexity(visualElements) {
        const complexity = [];

        // This is a basic mock based on common cultural issues
        if (visualElements.colors?.includes('red')) {
            complexity.push('Red color may have negative connotations in some cultures');
        }
        if (visualElements.colors?.includes('white')) {
            complexity.push('White color symbolism varies across cultures');
        }

        return complexity;
    }

    /**
     * Detects content that might be sensitive (religious, political, substance abuse).
     * @param {string} text
     * @returns {string[]}
     */
    static detectSensitiveContent(text) {
        const sensitive = [];

        if (text.match(/alcohol|drinking|tobacco|smoking/gi)) {
            sensitive.push('Substance references');
        }
        if (text.match(/religion|religious|god|allah|buddha/gi)) {
            sensitive.push('Religious content');
        }
        if (text.match(/political|politics|government/gi)) {
            sensitive.push('Political content');
        }

        return sensitive;
    }

    /**
     * Analyzes format requirements (digital, print, mobile).
     * @param {any} sourceContent
     * @returns {string[]}
     */
    static analyzeFormatRequirements(sourceContent) {
        const requirements = [];

        if (sourceContent.channelSpecifications?.digital) {
            requirements.push('Digital format optimization required');
        }
        if (sourceContent.channelSpecifications?.print) {
            requirements.push('Print format adaptation needed');
        }
        if (sourceContent.channelSpecifications?.mobile) {
            requirements.push('Mobile-specific formatting required');
        }

        return requirements;
    }

    /**
     * Analyzes complexity based on the number of output channels.
     * @param {any} channelSpecs
     * @returns {string[]}
     */
    static analyzeChannelComplexity(channelSpecs) {
        if (!channelSpecs) return [];

        const complexity = [];
        const channelCount = Object.keys(channelSpecs).length;

        if (channelCount > 5) {
            complexity.push('Multiple channel optimization required');
        }

        if (channelSpecs.social?.length > 3) {
            complexity.push('Multiple social media platform variants');
        }

        return complexity;
    }

    /**
     * Assesses visual/page layout complexity.
     * @param {any} sourceContent
     * @returns {string[]}
     */
    static assessLayoutComplexity(sourceContent) {
        const complexity = [];

        if (sourceContent.primaryContent && Object.keys(sourceContent.primaryContent).length > 10) {
            complexity.push('Complex multi-element layout');
        }

        if (sourceContent.assetType?.includes('brochure') || sourceContent.assetType?.includes('flyer')) {
            complexity.push('Print layout requires text expansion consideration');
        }

        return complexity;
    }

    /**
     * Generates a summary breakdown of complexity drivers and mitigation strategies.
     * @param {any} textAnalysis
     * @param {any} culturalAnalysis
     * @param {any} technicalAnalysis
     * @param {any} visualAnalysis
     * @returns {ComplexityBreakdown}
     */
    static generateComplexityBreakdown(textAnalysis, culturalAnalysis, technicalAnalysis, visualAnalysis) {
        const primaryDrivers = [];
        const secondaryFactors = [];
        const mitigationStrategies = [];

        // Identify primary complexity drivers
        if (textAnalysis.factors.length > 0) {
            primaryDrivers.push('Text complexity');
            mitigationStrategies.push('Create glossary and style guide');
        }

        if (culturalAnalysis.factors.length > 2) {
            primaryDrivers.push('Cultural adaptation needs');
            mitigationStrategies.push('Engage local cultural consultants');
        }

        if (technicalAnalysis.factors.length > 0) {
            primaryDrivers.push('Technical format complexity');
            mitigationStrategies.push('Develop technical specification templates');
        }
        
        if (visualAnalysis.factors.length > 0) {
            primaryDrivers.push('Visual and Layout complexity');
            mitigationStrategies.push('Modularize visual templates');
        }


        // Secondary factors
        if (textAnalysis.technicalTerms > 5) {
            secondaryFactors.push('Technical terminology density');
        }
        if (culturalAnalysis.culturalReferences.length > 0) {
            secondaryFactors.push('Cultural reference adaptation');
        }

        return {
            primaryDrivers,
            secondaryFactors,
            mitigationStrategies
        };
    }

    /**
     * Stores the calculated complexity metrics in the database.
     * @param {string} projectId
     * @param {string} brandId
     * @param {string | null} contentAssetId
     * @param {ComplexityMetrics} metrics
     * @returns {Promise<void>}
     */
    static async storeComplexityMetrics(
        projectId,
        brandId,
        contentAssetId,
        metrics
    ) {
        try {
            console.log('Storing complexity metrics for project:', projectId);
            // This is a placeholder for actual Supabase/DB interaction logic
            console.log('Complexity metrics:', metrics);
        } catch (error) {
            console.error('Failed to store complexity metrics:', error);
        }
    }

    /**
     * Fetches stored complexity metrics from the database.
     * @param {string} projectId
     * @param {string} [contentAssetId]
     * @returns {Promise<ComplexityMetrics[]>}
     */
    static async getComplexityMetrics(projectId, contentAssetId) {
        try {
            console.log('Getting complexity metrics for project:', projectId);
            // This is a placeholder for actual Supabase/DB interaction logic
            return [];
        } catch (error) {
            console.error('Failed to fetch complexity metrics:', error);
            return [];
        }
    }
}