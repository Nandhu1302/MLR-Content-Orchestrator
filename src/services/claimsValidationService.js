// Assuming VeevaVaultService is imported from a separate module.
// In a modular JS environment, you must ensure this file exists and exports the service.
import { VeevaVaultService } from './veevaVaultService.js';

/**
 * @typedef {object} ClaimPattern
 * @property {RegExp} pattern
 * @property {'clinical' | 'comparative' | 'safety' | 'efficacy' | 'statistical' | 'indication'} type
 * @property {'info' | 'warning' | 'error'} severity
 * @property {string} reason
 * @property {string[]} requiredEvidence
 * @property {string} category
 */

/**
 * @typedef {object} DetectedClaim
 * @property {string} id
 * @property {string} text
 * @property {ClaimPattern['type']} type
 * @property {ClaimPattern['severity']} severity
 * @property {string} reason
 * @property {string} suggestion
 * @property {number} start
 * @property {number} end
 * @property {string} context
 * @property {string[]} requiredEvidence
 * @property {boolean} isOverridden
 * @property {string} [overrideReason]
 * @property {number} confidence
 * @property {'compliant' | 'warning' | 'violation'} brandCompliance
 */

/**
 * @typedef {object} ValidationContext
 * @property {string} brandId
 * @property {string} therapeuticArea
 * @property {string} assetType
 * @property {string} targetAudience
 * @property {string} region
 * @property {any} [brandGuidelines]
 */

class ClaimsValidationService {
    constructor() {
        // VeevaVaultService is treated as a static service class
        /** @type {VeevaVaultService} */
        this.veevaService = VeevaVaultService;

        // Advanced claim patterns with context-aware rules
        /** @type {ClaimPattern[]} */
        this.claimPatterns = [
            // Clinical Efficacy Claims
            {
                pattern: /clinically proven|proven efficacy|demonstrated efficacy|studies show|clinical studies demonstrate|clinical evidence shows/gi,
                type: 'clinical',
                severity: 'warning',
                reason: 'Clinical efficacy claims require Level 1 evidence with peer-reviewed citations',
                requiredEvidence: ['RCT', 'Meta-analysis', 'Systematic review'],
                category: 'Efficacy'
            },
            // Comparative Claims (High Risk)
            {
                pattern: /(superior|better|outperforms|more effective than|significantly better|greater efficacy than)/gi,
                type: 'comparative',
                severity: 'error',
                reason: 'Comparative claims require head-to-head clinical data and regulatory approval for comparative language',
                requiredEvidence: ['Head-to-head trials', 'Network meta-analysis', 'Regulatory approval'],
                category: 'Comparative'
            },
            // Safety Claims
            {
                pattern: /well-tolerated|minimal side effects|safe and effective|no significant adverse|excellent safety profile|favorable tolerability/gi,
                type: 'safety',
                severity: 'warning',
                reason: 'Safety claims must be balanced with complete safety information and fair balance',
                requiredEvidence: ['Safety data', 'Adverse event profile', 'Fair balance statement'],
                category: 'Safety'
            },
            // Statistical Claims
            {
                pattern: /(\d+%\s*(improvement|reduction|increase|decrease|response rate))|statistically significant|significant improvement|substantial benefit/gi,
                type: 'statistical',
                severity: 'warning',
                reason: 'Statistical claims require specific study references, confidence intervals, and p-values',
                requiredEvidence: ['Primary endpoint data', 'Statistical analysis', 'Study reference'],
                category: 'Statistics'
            },
            // Indication Claims
            {
                pattern: /(first-line|second-line|indicated for|approved for|treatment of choice)/gi,
                type: 'indication',
                severity: 'error',
                reason: 'Indication claims must match FDA-approved labeling exactly',
                requiredEvidence: ['FDA-approved labeling', 'Prescribing information'],
                category: 'Indication'
            },
            // Superlative Claims (High Risk)
            {
                pattern: /(best|only|most effective|leading|#1|first and only|unique|revolutionary)/gi,
                type: 'comparative',
                severity: 'error',
                reason: 'Superlative claims require substantiation or should be avoided in promotional materials',
                requiredEvidence: ['Market data', 'Regulatory approval', 'Comparative studies'],
                category: 'Superlative'
            }
        ];
    }

    /**
     * Executes the claims validation process against the content.
     * @param {string} content
     * @param {ValidationContext} context
     * @returns {Promise<DetectedClaim[]>}
     */
    async validateClaims(content, context) {
        if (!content.trim()) return [];

        /** @type {DetectedClaim[]} */
        const detectedClaims = [];
        const brandRules = await this.getBrandSpecificRules(context.brandId);

        for (const pattern of this.claimPatterns) {
            let match;
            // Create a new RegExp instance to ensure fresh state for exec()
            const regex = new RegExp(pattern.pattern.source, pattern.pattern.flags);

            while ((match = regex.exec(content)) !== null) {
                const claimText = match[0];
                const start = match.index;
                const end = start + claimText.length;

                // Get surrounding context (50 chars before and after)
                const contextStart = Math.max(0, start - 50);
                const contextEnd = Math.min(content.length, end + 50);
                const claimContext = content.substring(contextStart, contextEnd);

                /** @type {DetectedClaim} */
                const claim = {
                    id: `claim_${detectedClaims.length + 1}_${start}`,
                    text: claimText,
                    type: pattern.type,
                    severity: pattern.severity,
                    reason: pattern.reason,
                    suggestion: await this.generateAdvancedSuggestion(pattern, claimText, context),
                    start,
                    end,
                    context: claimContext,
                    requiredEvidence: pattern.requiredEvidence,
                    isOverridden: false,
                    confidence: this.calculateConfidence(claimText, pattern),
                    brandCompliance: await this.checkBrandCompliance(claimText, pattern, brandRules)
                };

                detectedClaims.push(claim);
            }
        }

        return this.rankClaimsByRisk(detectedClaims);
    }

    /**
     * Simulates fetching brand-specific compliance rules from an external service.
     * @param {string} brandId
     * @returns {Promise<any>}
     */
    async getBrandSpecificRules(brandId) {
        try {
            // Simulate fetching brand-specific compliance rules
            const brandRules = await this.veevaService.fetchBrandGuidelines(brandId);
            return brandRules || {};
        } catch (error) {
            console.error('Error fetching brand rules:', error);
            return {};
        }
    }

    /**
     * Generates a context-aware suggestion for fixing the detected claim.
     * @param {ClaimPattern} pattern
     * @param {string} claimText
     * @param {ValidationContext} context
     * @returns {Promise<string>}
     */
    async generateAdvancedSuggestion(
        pattern,
        claimText,
        context
    ) {
        const suggestions = {
            clinical: `Replace with: "In clinical studies, [product] demonstrated [specific outcome] [reference required]"`,
            comparative: `Consider: "In Study X, [product] showed [specific results vs comparator] (p=X.XX) [reference]"`,
            safety: `Add fair balance: "The most common adverse reactions (≥X%) include... [see full prescribing information]"`,
            statistical: `Specify: "In a study of N patients, [product] achieved X% [endpoint] vs Y% placebo (95% CI: X-Y, p<0.05) [ref]"`,
            indication: `Use FDA-approved language: "${await this.getFDAApprovedIndication(context.brandId)}"`,
            efficacy: `Provide context: "Based on [study type] in [population], [product] showed [specific outcome] [reference]"`
        };

        const baseSuggestion = suggestions[pattern.type] || 'Review claim for substantiation and compliance';

        // Add context-specific guidance
        if (context.assetType === 'Email' && pattern.severity === 'error') {
            return `${baseSuggestion}\n\nNOTE: Email communications have strict claim requirements. Consider removing or significantly modifying this claim.`;
        }

        if (context.region !== 'US' && pattern.type === 'indication') {
            return `${baseSuggestion}\n\nIMPORTANT: Verify indication wording matches local regulatory approval for ${context.region}`;
        }

        return baseSuggestion;
    }

    /**
     * Calculates a confidence score for the pattern match.
     * @param {string} claimText
     * @param {ClaimPattern} pattern
     * @returns {number}
     */
    calculateConfidence(claimText, pattern) {
        // Simple confidence scoring based on text characteristics
        let confidence = 0.7; // Base confidence

        // Higher confidence for exact matches of high-risk terms
        if (pattern.severity === 'error') confidence += 0.2;
        if (claimText.toLowerCase().includes('superior') || claimText.toLowerCase().includes('better')) {
            confidence += 0.1;
        }

        // Lower confidence for partial matches
        if (claimText.length < 5) confidence -= 0.2;

        return Math.min(1.0, Math.max(0.3, confidence));
    }

    /**
     * Checks if the detected claim violates any brand-specific rules.
     * @param {string} claimText
     * @param {ClaimPattern} pattern
     * @param {any} brandRules
     * @returns {Promise<'compliant' | 'warning' | 'violation'>}
     */
    async checkBrandCompliance(
        claimText,
        pattern,
        brandRules
    ) {
        // Simulate brand compliance checking
        const forbiddenTerms = brandRules.forbiddenTerms || [];
        const cautionTerms = brandRules.cautionTerms || [];

        const lowerText = claimText.toLowerCase();

        if (forbiddenTerms.some((term) => lowerText.includes(term.toLowerCase()))) {
            return 'violation';
        }

        if (cautionTerms.some((term) => lowerText.includes(term.toLowerCase()))) {
            return 'warning';
        }

        if (pattern.severity === 'error') {
            return 'warning';
        }

        return 'compliant';
    }

    /**
     * Ranks claims based on severity and confidence.
     * @param {DetectedClaim[]} claims
     * @returns {DetectedClaim[]}
     */
    rankClaimsByRisk(claims) {
        return claims.sort((a, b) => {
            // Sort by severity first (error > warning > info)
            const severityScore = { error: 3, warning: 2, info: 1 };
            if (severityScore[a.severity] !== severityScore[b.severity]) {
                return severityScore[b.severity] - severityScore[a.severity];
            }

            // Then by brand compliance risk
            const complianceScore = { violation: 3, warning: 2, compliant: 1 };
            if (complianceScore[a.brandCompliance] !== complianceScore[b.brandCompliance]) {
                return complianceScore[b.brandCompliance] - complianceScore[a.brandCompliance];
            }

            // Finally by confidence
            return b.confidence - a.confidence;
        });
    }

    /**
     * Fetches the FDA-approved indication for a brand.
     * @param {string} brandId
     * @returns {Promise<string>}
     */
    async getFDAApprovedIndication(brandId) {
        try {
            const indication = await this.veevaService.getFDAIndication(brandId);
            return indication || '[Insert FDA-approved indication from prescribing information]';
        } catch (error) {
            console.error("Error fetching FDA indication:", error);
            return '[Insert FDA-approved indication from prescribing information]';
        }
    }

    /**
     * Real-time validation method for content editor
     * @param {string} content
     * @param {ValidationContext} context
     * @returns {Promise<{claims: DetectedClaim[], summary: { valid: number; warnings: number; failures: number; }, highlights: Array<{ id: string; start: number; end: number; type: string; severity: string; message: string; }>}>}
     */
    async validateContentRealTime(content, context) {
        const claims = await this.validateClaims(content, context);

        const summary = {
            valid: claims.filter(c => c.isOverridden || c.severity === 'info').length,
            warnings: claims.filter(c => !c.isOverridden && c.severity === 'warning').length,
            failures: claims.filter(c => !c.isOverridden && c.severity === 'error').length
        };

        const highlights = claims.map(claim => ({
            id: claim.id,
            start: claim.start,
            end: claim.end,
            type: 'claim',
            severity: claim.severity,
            message: claim.reason
        }));

        return { claims, summary, highlights };
    }
}

export const claimsValidationService = new ClaimsValidationService();