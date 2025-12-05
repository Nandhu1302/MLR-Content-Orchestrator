// Note: The 'supabase' client must be globally available
// or imported in the consuming environment.
// import { supabase } from '@/integrations/supabase/client';
// import { BrowserAIService } from './browserAIService';


// --- JSDoc Type Definitions (Mirroring TypeScript Interfaces) ---

/**
 * @typedef {object} TextComplexityAnalysis
 * @property {number} averageSentenceLength
 * @property {number} technicalTermsCount
 * @property {number} readabilityScore
 * @property {('Simple'|'Moderate'|'Complex')} linguisticComplexity
 */

/**
 * @typedef {object} CulturalFactorsAnalysis
 * @property {string[]} culturalReferences
 * @property {string[]} sensitiveConcepts
 * @property {string[]} adaptationRequirements
 */

/**
 * @typedef {object} RegulatoryFactorsAnalysis
 * @property {string[]} medicalClaims
 * @property {string[]} legalRequirements
 * @property {string[]} complianceRisks
 */

/**
 * @typedef {object} TechnicalFactorsAnalysis
 * @property {string} formatComplexity
 * @property {string[]} visualElements
 * @property {string[]} interactiveComponents
 */

/**
 * @typedef {object} Recommendation
 * @property {('content'|'process'|'timeline'|'resources')} type
 * @property {('high'|'medium'|'low')} priority
 * @property {string} title
 * @property {string} description
 * @property {string} estimatedImpact
 */

/**
 * @typedef {object} RiskFactor
 * @property {string} category
 * @property {string} risk
 * @property {('low'|'medium'|'high'|'critical')} severity
 * @property {string} mitigation
 */

/**
 * @typedef {object} ContentReadinessAnalysis
 * @property {number} contentComplexityScore - Score for text complexity.
 * @property {number} culturalSensitivityScore - Score for cultural appropriateness.
 * @property {number} regulatoryComplexityScore - Score for legal/medical compliance risk.
 * @property {number} technicalReadinessScore - Score for technical implementation difficulty.
 * @property {number} overallReadinessScore - Average of the four main scores.
 * @property {('low'|'medium'|'high'|'excellent')} readinessLevel - Categorized readiness based on overall score.
 * @property {{ textComplexity: TextComplexityAnalysis, culturalFactors: CulturalFactorsAnalysis, regulatoryFactors: RegulatoryFactorsAnalysis, technicalFactors: TechnicalFactorsAnalysis }} analysisDetails - Detailed breakdown of analysis per factor.
 * @property {Recommendation[]} recommendations - Actionable steps for improvement.
 * @property {RiskFactor[]} riskFactors - Identified risks and suggested mitigations.
 * @property {number} estimatedEffortHours - Estimated time required for localization/adaptation.
 * @property {number} estimatedCost - Estimated financial cost.
 */


/**
 * Core service for analyzing content readiness for localization and deployment across target markets.
 */
export class ContentReadinessAnalyzer {
    
    /**
     * Executes a comprehensive, parallel analysis of content across multiple readiness dimensions.
     *
     * @param {string} projectId - ID of the content project.
     * @param {string} brandId - ID of the brand.
     * @param {any} sourceContent - The raw content structure or object (e.g., HTML, JSON).
     * @param {string[]} targetMarkets - List of target geographical markets (e.g., ['US', 'EU', 'Japan']).
     * @param {string[]} targetLanguages - List of target languages.
     * @returns {Promise<ContentReadinessAnalysis>} - The full content readiness analysis report.
     */
    static async analyzeContent(
        projectId,
        brandId,
        sourceContent,
        targetMarkets,
        targetLanguages
    ) {
        try {
            // Extract text content for analysis
            const textContent = this.extractTextContent(sourceContent);

            // Perform parallel analysis
            const [
                textComplexityAnalysis,
                culturalAnalysis,
                regulatoryAnalysis,
                technicalAnalysis
            ] = await Promise.all([
                this.analyzeTextComplexity(textContent),
                this.analyzeCulturalFactors(textContent, targetMarkets),
                this.analyzeRegulatoryRequirements(textContent, targetMarkets, brandId),
                this.analyzeTechnicalFactors(sourceContent)
            ]);

            // Calculate scores
            const contentComplexityScore = this.calculateContentComplexityScore(textComplexityAnalysis);
            const culturalSensitivityScore = this.calculateCulturalScore(culturalAnalysis);
            const regulatoryComplexityScore = this.calculateRegulatoryScore(regulatoryAnalysis);
            const technicalReadinessScore = this.calculateTechnicalScore(technicalAnalysis);

            const overallReadinessScore = Math.round(
                (contentComplexityScore + culturalSensitivityScore + regulatoryComplexityScore + technicalReadinessScore) / 4
            );

            const readinessLevel = this.determineReadinessLevel(overallReadinessScore);

            // Generate recommendations and risk factors
            const recommendations = this.generateRecommendations(
                textComplexityAnalysis,
                culturalAnalysis,
                regulatoryAnalysis,
                technicalAnalysis
            );

            const riskFactors = this.identifyRiskFactors(
                textComplexityAnalysis,
                culturalAnalysis,
                regulatoryAnalysis,
                technicalAnalysis
            );

            // Calculate effort and cost estimates
            const estimatedEffortHours = this.calculateEffortEstimate(
                overallReadinessScore,
                targetLanguages.length,
                targetMarkets.length,
                textContent.length
            );

            const estimatedCost = this.calculateCostEstimate(estimatedEffortHours, regulatoryComplexityScore);

            /** @type {ContentReadinessAnalysis} */
            const analysis = {
                contentComplexityScore,
                culturalSensitivityScore,
                regulatoryComplexityScore,
                technicalReadinessScore,
                overallReadinessScore,
                readinessLevel,
                analysisDetails: {
                    textComplexity: textComplexityAnalysis,
                    culturalFactors: culturalAnalysis,
                    regulatoryFactors: regulatoryAnalysis,
                    technicalFactors: technicalAnalysis
                },
                recommendations,
                riskFactors,
                estimatedEffortHours,
                estimatedCost
            };

            // Store analysis in database (Placeholder implementation)
            await this.storeAnalysis(projectId, brandId, analysis);

            return analysis;
        } catch (error) {
            console.error('Content readiness analysis failed:', error);
            throw new Error('Failed to analyze content readiness');
        }
    }

    /**
     * Extracts plain text content from various source content structures.
     * @private
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

        // Check top-level properties if primaryContent wasn't a standard structure
        if (!text.trim() && (sourceContent.text || sourceContent.content)) {
            text = (sourceContent.text || sourceContent.content) + ' ';
        }

        return text.trim();
    }

    /**
     * Analyzes linguistic complexity metrics.
     * @private
     * @param {string} text
     * @returns {Promise<TextComplexityAnalysis>}
     */
    static async analyzeTextComplexity(text) {
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const words = text.split(/\s+/).filter(w => w.length > 0);
        const averageSentenceLength = words.length / sentences.length || 0;

        // Detect technical terms (simplified detection for typical life-sciences/tech terms)
        const technicalTermsRegex = /\b[A-Z]{2,}|\b\w*ology\b|\b\w*itis\b|\bmg\b|\bml\b|\bdose\b|\btreatment\b|\balgorithm\b|\bprotocol\b/gi;
        const technicalTermsCount = (text.match(technicalTermsRegex) || []).length;

        // Calculate readability score (simplified Flesch Reading Ease)
        const avgWordsPerSentence = averageSentenceLength;
        const totalWords = words.length;
        const totalSyllables = totalWords > 0 ? this.estimateSyllables(text) : 0;
        const avgSyllablesPerWord = totalWords > 0 ? totalSyllables / totalWords : 0;

        // Flesch Reading Ease Formula: 206.835 - (1.015 * AvgWordsPerSentence) - (84.6 * AvgSyllablesPerWord)
        const readabilityScore = Math.max(0, 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord));

        const linguisticComplexity = readabilityScore > 60 ? 'Simple' :
            readabilityScore > 30 ? 'Moderate' : 'Complex';

        return {
            averageSentenceLength: parseFloat(averageSentenceLength.toFixed(1)),
            technicalTermsCount,
            readabilityScore: Math.round(readabilityScore),
            linguisticComplexity
        };
    }

    /**
     * Analyzes cultural sensitivity factors (placeholder for AI call).
     * @private
     * @param {string} text
     * @param {string[]} targetMarkets
     * @returns {Promise<CulturalFactorsAnalysis>}
     */
    static async analyzeCulturalFactors(text, targetMarkets) {
        // In a real application, this would call an AI service (like BrowserAIService)
        // to perform sophisticated analysis against a knowledge base of cultural norms.
        try {
            // Simulate AI call result
            // const aiAnalysis = await BrowserAIService.analyzeContent(text, { context: 'global_marketing' });
            // Placeholder: Check for generic sensitive words
            const sensitiveWords = ['death', 'war', 'religion', 'politics', 'sexuality'];
            const sensitiveConcepts = sensitiveWords.filter(word => text.toLowerCase().includes(word));

            return {
                culturalReferences: [],
                sensitiveConcepts: sensitiveConcepts,
                adaptationRequirements: targetMarkets.map(market => `Review content for ${market} market appropriateness`)
            };
        } catch (error) {
            console.warn('AI cultural analysis failed, using fallback:', error);
            return {
                culturalReferences: [],
                sensitiveConcepts: [],
                adaptationRequirements: targetMarkets.map(market => `Review content for ${market} market appropriateness`)
            };
        }
    }

    /**
     * Analyzes regulatory compliance requirements (simplified for common markets).
     * @private
     * @param {string} text
     * @param {string[]} targetMarkets
     * @param {string} brandId
     * @returns {Promise<RegulatoryFactorsAnalysis>}
     */
    static async analyzeRegulatoryRequirements(text, targetMarkets, brandId) {
        // Detect medical claims and regulatory language
        const medicalClaimsRegex = /\b(treat|cure|prevent|diagnose|efficacy|clinical|study|trial|approved|indication|safe|effective)\b/gi;
        const medicalClaims = Array.from(new Set((text.match(medicalClaimsRegex) || []).map(claim => claim.toLowerCase())));

        const legalRequirements = targetMarkets.map(market => {
            const marketUpper = market.toUpperCase();
            if (marketUpper.includes('US') || marketUpper.includes('UNITED STATES')) {
                return 'FDA / FTC compliance required';
            } else if (marketUpper.includes('EU') || marketUpper.includes('EUROPE')) {
                return 'EMA / GDPR compliance required';
            } else if (marketUpper.includes('JAPAN')) {
                return 'PMDA compliance required';
            } else {
                return `${market} regulatory review required`;
            }
        });

        const complianceRisks = [];
        if (medicalClaims.length > 0) {
            complianceRisks.push('Medical claims require regulatory review and substantiation');
        }
        if (text.includes('prescription') || text.includes('Rx')) {
            complianceRisks.push('Prescription drug content requires special handling');
        }

        return {
            medicalClaims,
            legalRequirements,
            complianceRisks
        };
    }

    /**
     * Analyzes technical factors like format and interactive elements.
     * @private
     * @param {any} sourceContent
     * @returns {Promise<TechnicalFactorsAnalysis>}
     */
    static async analyzeTechnicalFactors(sourceContent) {
        // Assume assetType is available on sourceContent or set to 'Standard'
        const formatComplexity = sourceContent.assetType || 'Standard Web Content';
        const visualElements = [];
        const interactiveComponents = [];

        // Simple detection based on keywords or structure
        if (formatComplexity.toLowerCase().includes('video')) visualElements.push('Video content');
        if (formatComplexity.toLowerCase().includes('interactive')) interactiveComponents.push('Interactive elements (e.g., forms, quizzes)');
        if (formatComplexity.toLowerCase().includes('animation') || formatComplexity.toLowerCase().includes('gif')) visualElements.push('Animated content');
        
        // If content is HTML, we might check for <video>, <canvas>, or complex JS structures
        // (Simplified for this example)

        return {
            formatComplexity,
            visualElements,
            interactiveComponents
        };
    }

    /**
     * Calculates the Content Complexity Score (0-100). Lower is more complex.
     * @private
     * @param {TextComplexityAnalysis} textAnalysis
     * @returns {number}
     */
    static calculateContentComplexityScore(textAnalysis) {
        let score = 100;

        // Penalize based on sentence length (target < 15)
        if (textAnalysis.averageSentenceLength > 22) score -= 30;
        else if (textAnalysis.averageSentenceLength > 18) score -= 20;
        else if (textAnalysis.averageSentenceLength > 15) score -= 10;

        // Penalize based on technical terms (target < 5)
        if (textAnalysis.technicalTermsCount > 15) score -= 25;
        else if (textAnalysis.technicalTermsCount > 8) score -= 15;
        else if (textAnalysis.technicalTermsCount > 4) score -= 5;

        // Adjust based on readability (Flesch target > 60)
        if (textAnalysis.readabilityScore < 30) score -= 35; // Critical complexity
        else if (textAnalysis.readabilityScore < 60) score -= 20; // Moderate complexity

        return Math.max(0, Math.min(100, score));
    }

    /**
     * Calculates the Cultural Sensitivity Score (0-100). Lower is more sensitive/risky.
     * @private
     * @param {CulturalFactorsAnalysis} culturalAnalysis
     * @returns {number}
     */
    static calculateCulturalScore(culturalAnalysis) {
        let score = 100;

        score -= culturalAnalysis.culturalReferences.length * 5;
        score -= culturalAnalysis.sensitiveConcepts.length * 15; // High penalty for sensitive topics
        score -= culturalAnalysis.adaptationRequirements.length * 3; // Penalty for each market requiring review

        return Math.max(0, Math.min(100, score));
    }

    /**
     * Calculates the Regulatory Complexity Score (0-100). Lower is higher risk/complexity.
     * @private
     * @param {RegulatoryFactorsAnalysis} regulatoryAnalysis
     * @returns {number}
     */
    static calculateRegulatoryScore(regulatoryAnalysis) {
        let score = 100;

        score -= regulatoryAnalysis.medicalClaims.length * 10;
        score -= regulatoryAnalysis.legalRequirements.length * 5;
        score -= regulatoryAnalysis.complianceRisks.length * 20; // High penalty for identified risks

        return Math.max(0, Math.min(100, score));
    }

    /**
     * Calculates the Technical Readiness Score (0-100). Lower is more difficult to deploy.
     * @private
     * @param {TechnicalFactorsAnalysis} technicalAnalysis
     * @returns {number}
     */
    static calculateTechnicalScore(technicalAnalysis) {
        let score = 100;

        // Penalty for complex formats
        if (technicalAnalysis.formatComplexity.toLowerCase().includes('video') || technicalAnalysis.formatComplexity.toLowerCase().includes('interactive')) score -= 20;
        
        score -= technicalAnalysis.visualElements.length * 8;
        score -= technicalAnalysis.interactiveComponents.length * 15; // Interactive elements add significant technical debt

        return Math.max(0, Math.min(100, score));
    }

    /**
     * Determines the qualitative readiness level.
     * @private
     * @param {number} score
     * @returns {('low'|'medium'|'high'|'excellent')}
     */
    static determineReadinessLevel(score) {
        if (score >= 90) return 'excellent';
        if (score >= 75) return 'high';
        if (score >= 50) return 'medium';
        return 'low';
    }

    /**
     * Generates actionable recommendations based on analysis findings.
     * @private
     * @param {TextComplexityAnalysis} textAnalysis
     * @param {CulturalFactorsAnalysis} culturalAnalysis
     * @param {RegulatoryFactorsAnalysis} regulatoryAnalysis
     * @param {TechnicalFactorsAnalysis} technicalAnalysis
     * @returns {Recommendation[]}
     */
    static generateRecommendations(textAnalysis, culturalAnalysis, regulatoryAnalysis, technicalAnalysis) {
        /** @type {Recommendation[]} */
        const recommendations = [];

        // Content recommendations
        if (textAnalysis.averageSentenceLength > 18 || textAnalysis.readabilityScore < 60) {
            recommendations.push({
                type: 'content',
                priority: 'medium',
                title: 'Simplify sentence structure',
                description: 'Break down long, complex sentences and reduce jargon to improve translatability and comprehension.',
                estimatedImpact: '10-15% reduction in translation time, higher post-editing quality'
            });
        }

        if (textAnalysis.technicalTermsCount > 8) {
            recommendations.push({
                type: 'resources',
                priority: 'high',
                title: 'Create/Update Terminology Glossary',
                description: 'Develop a dedicated, approved glossary for technical and specialized terms to ensure consistency across all target languages.',
                estimatedImpact: 'Improved consistency and quality, reduced review cycles'
            });
        }

        // Cultural recommendations
        if (culturalAnalysis.sensitiveConcepts.length > 0) {
            recommendations.push({
                type: 'process',
                priority: 'high',
                title: 'Mandatory Cultural/Linguistic Review',
                description: `Review sensitive concepts (${culturalAnalysis.sensitiveConcepts.join(', ')}) with in-market experts before deployment to prevent cultural offense.`,
                estimatedImpact: 'Prevent brand damage and increase local acceptance'
            });
        }

        // Regulatory recommendations
        if (regulatoryAnalysis.medicalClaims.length > 0) {
            recommendations.push({
                type: 'timeline',
                priority: 'high',
                title: 'Allow extra time for Regulatory Review',
                description: 'Medical/health claims require additional approval cycles by Legal and Regulatory teams in each target market.',
                estimatedImpact: 'Minimum 2-4 weeks additional timeline; essential for compliance'
            });
        }

        // Technical recommendations
        if (technicalAnalysis.interactiveComponents.length > 0) {
            recommendations.push({
                type: 'process',
                priority: 'medium',
                title: 'Establish Technical Adaptation Plan',
                description: 'Ensure interactive components are tested for right-to-left (RTL) language support and text expansion effects.',
                estimatedImpact: 'Prevent technical bugs during deployment'
            });
        }

        return recommendations;
    }

    /**
     * Identifies potential risks associated with content deployment.
     * @private
     * @param {TextComplexityAnalysis} textAnalysis
     * @param {CulturalFactorsAnalysis} culturalAnalysis
     * @param {RegulatoryFactorsAnalysis} regulatoryAnalysis
     * @param {TechnicalFactorsAnalysis} technicalAnalysis
     * @returns {RiskFactor[]}
     */
    static identifyRiskFactors(textAnalysis, culturalAnalysis, regulatoryAnalysis, technicalAnalysis) {
        /** @type {RiskFactor[]} */
        const riskFactors = [];

        if (textAnalysis.readabilityScore < 30) {
            riskFactors.push({
                category: 'Content Quality',
                risk: 'Very complex source text significantly increases the risk of translation errors and meaning drift.',
                severity: 'high',
                mitigation: 'Simplify content or mandate specialized translator resources and back-translation.'
            });
        }

        if (culturalAnalysis.sensitiveConcepts.length > 0) {
            riskFactors.push({
                category: 'Cultural Sensitivity',
                risk: 'Use of sensitive concepts could lead to immediate public backlash or regulatory fines in certain markets.',
                severity: 'medium',
                mitigation: 'Conduct cultural review with local experts and be prepared for potential content replacement.'
            });
        }

        if (regulatoryAnalysis.complianceRisks.length > 0) {
            riskFactors.push({
                category: 'Regulatory Compliance',
                risk: 'Unsubstantiated claims or non-compliant content could result in legal action, product recalls, or market bans.',
                severity: 'critical',
                mitigation: 'Mandatory regulatory review and sign-off (Legal/Medical) before final deployment.'
            });
        }

        if (technicalAnalysis.interactiveComponents.length > 0) {
            riskFactors.push({
                category: 'Technical Deployment',
                risk: 'Complex formats (e.g., interactive content, video overlays) often lead to broken layouts or functionality post-localization.',
                severity: 'low',
                mitigation: 'Thorough QA testing in target languages and early technical integration planning.'
            });
        }

        return riskFactors;
    }

    /**
     * Calculates estimated effort hours based on complexity and scope.
     * @private
     * @param {number} readinessScore
     * @param {number} languageCount
     * @param {number} marketCount
     * @param {number} contentLength
     * @returns {number}
     */
    static calculateEffortEstimate(readinessScore, languageCount, marketCount, contentLength) {
        const wordCount = Math.ceil(contentLength / 6); // Estimate words from characters
        
        // Base hours (1 hour per 250 words, typical translation rate)
        const baseTranslationHours = wordCount / 250; 
        
        // Complexity multiplier: Penalizes low readiness scores
        const complexityMultiplier = readinessScore < 50 ? 1.8 : readinessScore < 75 ? 1.4 : 1.0;
        
        // Market/Language scope: Multiplies base effort by the number of languages, plus a review factor for market count
        const totalLanguageEffort = baseTranslationHours * languageCount;
        
        // Adaptation/Review effort (adds time for non-translation tasks like cultural review, formatting, etc.)
        const adaptationHours = (marketCount * 5) * complexityMultiplier; 

        return Math.round(totalLanguageEffort * complexityMultiplier + adaptationHours);
    }

    /**
     * Calculates estimated cost based on effort and regulatory risk.
     * @private
     * @param {number} effortHours
     * @param {number} regulatoryScore
     * @returns {number}
     */
    static calculateCostEstimate(effortHours, regulatoryScore) {
        // Base rate includes translation, project management, and basic QA
        const baseRate = 75; // $75 per hour base rate

        // Regulatory Multiplier: Penalizes low regulatory score (i.e., higher risk means more expensive legal review/SME time)
        const regulatoryMultiplier = regulatoryScore < 50 ? 1.5 : regulatoryScore < 75 ? 1.2 : 1.0;

        // Final cost: (Effort * Base Rate) * Regulatory Risk Factor
        return Math.round(effortHours * baseRate * regulatoryMultiplier);
    }

    /**
     * Placeholder method for storing the analysis result.
     * @private
     * @param {string} projectId
     * @param {string} brandId
     * @param {ContentReadinessAnalysis} analysis
     * @returns {Promise<void>}
     */
    static async storeAnalysis(projectId, brandId, analysis) {
        try {
            console.log('Storing content readiness analysis for project:', projectId);
            // Example of how to structure a Supabase insert (actual implementation would need table setup)
            /*
            const { data, error } = await supabase.from('content_readiness_analysis').insert({
                project_id: projectId,
                brand_id: brandId,
                analysis_data: analysis,
                overall_score: analysis.overallReadinessScore,
                calculated_at: new Date().toISOString()
            });

            if (error) throw error;
            */
            console.log('Content readiness analysis storage simulation successful.');
        } catch (error) {
            console.error('Failed to store content readiness analysis:', error);
        }
    }
    
    /**
     * Placeholder method for retrieving the analysis result.
     * @private
     * @param {string} projectId
     * @returns {Promise<ContentReadinessAnalysis | null>}
     */
    static async getAnalysis(projectId) {
        try {
            console.log('Getting content readiness analysis for project:', projectId);
            // Example of a Supabase fetch
            /*
            const { data, error } = await supabase
                .from('content_readiness_analysis')
                .select('analysis_data')
                .eq('project_id', projectId)
                .single();

            if (error || !data) return null;
            return data.analysis_data;
            */
            return null;
        } catch (error) {
            console.error('Failed to get content readiness analysis:', error);
            return null;
        }
    }
    
    /**
     * Estimates the number of syllables in a given text (simplified method).
     * @private
     * @param {string} text
     * @returns {number}
     */
    static estimateSyllables(text) {
        const words = text.toLowerCase().split(/\s+/);
        let syllableCount = 0;

        words.forEach(word => {
            // Remove non-alphabetic characters
            const cleanWord = word.replace(/[^a-z]/g, '');
            if (cleanWord.length === 0) return;

            // Simple syllable counting: count vowel groups
            const vowels = cleanWord.match(/[aeiouy]+/g);
            let count = vowels ? vowels.length : 1;

            // Subtract one if word ends in 'e' (like 'make', 'fire'), but not 'le' (like 'table')
            if (cleanWord.endsWith('e') && !cleanWord.endsWith('le')) count--;
            if (count === 0) count = 1;

            syllableCount += count;
        });

        return syllableCount;
    }
}