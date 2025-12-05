/**
 * @typedef {object} Citation
 * @property {string} id
 * @property {'journal' | 'clinical_trial' | 'guidelines' | 'regulatory' | 'other'} type
 * @property {string} title
 * @property {string[]} authors
 * @property {string} [journal]
 * @property {number} year
 * @property {string} [doi]
 * @property {string} [pmid]
 * @property {string} [url]
 * @property {number} relevanceScore
 * @property {'A' | 'B' | 'C' | 'D'} evidenceLevel
 * @property {string} [abstract]
 * @property {string[]} keyFindings
 * @property {boolean} isApproved
 * @property {string} [veevaId]
 */

/**
 * @typedef {object} CitationNeed
 * @property {string} id
 * @property {string} claimText
 * @property {string} claimType
 * @property {number} start
 * @property {number} end
 * @property {string[]} requiredEvidenceLevel
 * @property {Citation[]} suggestedCitations
 * @property {'high' | 'medium' | 'low'} priority
 * @property {string} context
 */

/**
 * @typedef {object} ReferenceValidation
 * @property {number} citationCoverage
 * @property {CitationNeed[]} missingReferences
 * @property {Citation[]} existingReferences
 * @property {number} complianceScore
 */

class CitationEngineService {
    /**
     * @private
     * @type {Map<string, Citation[]>}
     */
    approvedCitations = new Map();

    /**
     * @private
     * @readonly
     * @type {Citation[]}
     */
    mockCitations = [
        {
            id: 'cit_001',
            type: 'clinical_trial',
            title: 'Efficacy and Safety of Nintedanib in Idiopathic Pulmonary Fibrosis',
            authors: ['Richeldi L', 'du Bois RM', 'Raghu G', 'Azuma A'],
            journal: 'New England Journal of Medicine',
            year: 2014,
            doi: '10.1056/NEJMoa1402584',
            pmid: '24836312',
            relevanceScore: 0.95,
            evidenceLevel: 'A',
            keyFindings: [
                'Reduced annual rate of decline in FVC by 68%',
                'Demonstrated in two identical phase 3 trials (INPULSIS-1 and -2)',
                'Significant reduction in acute exacerbations'
            ],
            isApproved: true,
            veevaId: 'VEEVA_001'
        },
        {
            id: 'cit_002',
            type: 'journal',
            title: 'Global Initiative for Chronic Obstructive Lung Disease Strategy',
            authors: ['Vestbo J', 'Hurd SS', 'Agustí AG'],
            journal: 'American Journal of Respiratory and Critical Care Medicine',
            year: 2023,
            doi: '10.1164/rccm.202204-0685PP',
            relevanceScore: 0.88,
            evidenceLevel: 'A',
            keyFindings: [
                'Updated GOLD guidelines for COPD management',
                'Evidence-based treatment recommendations',
                'Risk stratification and personalized therapy'
            ],
            isApproved: true,
            veevaId: 'VEEVA_002'
        },
        {
            id: 'cit_003',
            type: 'regulatory',
            title: 'FDA Prescribing Information - OFEV (nintedanib)',
            authors: ['FDA'],
            year: 2024,
            relevanceScore: 1.0,
            evidenceLevel: 'A',
            keyFindings: [
                'FDA-approved indication for IPF',
                'Complete safety and efficacy profile',
                'Dosing and administration guidelines'
            ],
            isApproved: true,
            veevaId: 'VEEVA_003'
        }
    ];

    constructor() {
        this.initializeApprovedCitations();
    }

    /**
     * @private
     */
    initializeApprovedCitations() {
        // Group citations by therapeutic area/brand
        const groupedCitations = this.mockCitations.reduce((acc, citation) => {
            const key = this.inferTherapeuticArea(citation);
            if (!acc.has(key)) {
                acc.set(key, []);
            }
            acc.get(key).push(citation);
            return acc;
        }, new Map());

        this.approvedCitations = groupedCitations;
    }

    /**
     * @private
     * @param {Citation} citation
     * @returns {string}
     */
    inferTherapeuticArea(citation) {
        const title = citation.title.toLowerCase();
        if (title.includes('pulmonary fibrosis') || title.includes('ipf')) return 'respiratory';
        if (title.includes('copd') || title.includes('asthma')) return 'respiratory';
        if (title.includes('oncology') || title.includes('cancer')) return 'oncology';
        return 'general';
    }

    /**
     * Analyzes content for claims that require citation and suggests approved references.
     * @param {string} content - The text content to analyze.
     * @param {string} [brandId='ofev'] - The brand ID to scope citation search.
     * @returns {Promise<CitationNeed[]>}
     */
    async analyzeReferenceNeeds(content, brandId = 'ofev') {
        /** @type {CitationNeed[]} */
        const citationNeeds = [];

        // Patterns that indicate citation needs
        const citationPatterns = [
            {
                pattern: /clinically proven|proven efficacy|studies show|clinical studies demonstrate/gi,
                requiredEvidence: ['A', 'B'],
                priority: 'high',
                claimType: 'clinical_efficacy'
            },
            {
                pattern: /(superior|better|outperforms|more effective than)/gi,
                requiredEvidence: ['A'],
                priority: 'high',
                claimType: 'comparative'
            },
            {
                pattern: /(\d+%\s*(improvement|reduction|increase|decrease))/gi,
                requiredEvidence: ['A', 'B'],
                priority: 'high',
                claimType: 'statistical'
            },
            {
                pattern: /well-tolerated|minimal side effects|safety profile/gi,
                requiredEvidence: ['A', 'B', 'C'],
                priority: 'medium',
                claimType: 'safety'
            },
            {
                pattern: /(indicated for|approved for|first-line|second-line)/gi,
                requiredEvidence: ['A'],
                priority: 'high',
                claimType: 'indication'
            }
        ];

        for (const patternConfig of citationPatterns) {
            let match;
            while ((match = patternConfig.pattern.exec(content)) !== null) {
                const claimText = match[0];
                const start = match.index;
                const end = start + claimText.length;

                // Get context around the claim
                const contextStart = Math.max(0, start - 100);
                const contextEnd = Math.min(content.length, end + 100);
                const context = content.substring(contextStart, contextEnd);

                // Find relevant citations
                const suggestedCitations = await this.findRelevantCitations(
                    claimText,
                    patternConfig.claimType,
                    patternConfig.requiredEvidence,
                    brandId
                );

                citationNeeds.push({
                    id: `need_${citationNeeds.length + 1}`,
                    claimText,
                    claimType: patternConfig.claimType,
                    start,
                    end,
                    requiredEvidenceLevel: patternConfig.requiredEvidence,
                    suggestedCitations,
                    priority: patternConfig.priority,
                    context
                });
            }
        }

        return citationNeeds.sort((a, b) => {
            const priorityScore = { high: 3, medium: 2, low: 1 };
            return priorityScore[b.priority] - priorityScore[a.priority];
        });
    }

    /**
     * @private
     * @param {string} claimText
     * @param {string} claimType
     * @param {string[]} evidenceLevel
     * @param {string} brandId
     * @returns {Promise<Citation[]>}
     */
    async findRelevantCitations(
        claimText,
        claimType,
        evidenceLevel,
        brandId
    ) {
        const therapeuticArea = this.mapBrandToTherapeuticArea(brandId);
        const availableCitations = this.approvedCitations.get(therapeuticArea) || [];

        return availableCitations
            .filter(citation => {
                // Filter by evidence level
                if (!evidenceLevel.includes(citation.evidenceLevel)) return false;

                // Simple relevance scoring based on claim type
                const relevanceKeywords = this.getRelevanceKeywords(claimType);
                const titleWords = citation.title.toLowerCase();
                const hasRelevantKeywords = relevanceKeywords.some(keyword =>
                    titleWords.includes(keyword.toLowerCase())
                );

                return hasRelevantKeywords || citation.relevanceScore > 0.8;
            })
            .sort((a, b) => b.relevanceScore - a.relevanceScore)
            .slice(0, 3); // Top 3 most relevant
    }

    /**
     * @private
     * @param {string} claimType
     * @returns {string[]}
     */
    getRelevanceKeywords(claimType) {
        /** @type {Record<string, string[]>} */
        const keywordMap = {
            clinical_efficacy: ['efficacy', 'clinical', 'trial', 'outcome', 'treatment'],
            comparative: ['comparison', 'versus', 'superior', 'head-to-head'],
            statistical: ['statistical', 'significant', 'analysis', 'endpoint'],
            safety: ['safety', 'adverse', 'tolerability', 'side effects'],
            indication: ['indication', 'approved', 'FDA', 'regulatory']
        };

        return keywordMap[claimType] || [];
    }

    /**
     * @private
     * @param {string} brandId
     * @returns {string}
     */
    mapBrandToTherapeuticArea(brandId) {
        /** @type {Record<string, string>} */
        const mapping = {
            'ofev': 'respiratory',
            'pradaxa': 'cardiology',
            'jardiance': 'diabetes'
        };

        return mapping[brandId] || 'general';
    }

    /**
     * Validates the presence and format of existing references in the content.
     * @param {string} content - The text content to check.
     * @returns {Promise<{detected: Citation[], formatted: Citation[], issues: string[]}>}
     */
    async validateExistingReferences(content) {
        /** @type {string[]} */
        const issues = [];
        /** @type {Citation[]} */
        const detected = [];

        // Simple reference detection patterns
        const referencePatterns = [
            /\[\d+\]/g, // [1], [2], etc.
            /\(\d+\)/g, // (1), (2), etc.
            /(?:Reference|Ref\.?)\s*\d+/gi,
            /\d+\.\s+[A-Z][^.]+\.\s+[A-Z][^.]+\.\s+\d{4}/g // Basic citation format
        ];

        let foundReferences = 0;
        referencePatterns.forEach(pattern => {
            const matches = content.match(pattern);
            if (matches) {
                foundReferences += matches.length;
            }
        });

        if (foundReferences === 0) {
            issues.push('No reference citations found in content');
        }

        // Check for incomplete references
        const incompletePatterns = [
            /\[Reference\]/gi,
            /\[Ref\]/gi,
            /\[Citation needed\]/gi,
            /TBD/gi
        ];

        incompletePatterns.forEach(pattern => {
            const matches = content.match(pattern);
            if (matches) {
                issues.push(`Found ${matches.length} incomplete reference(s): ${pattern.source}`);
            }
        });

        return {
            detected,
            formatted: [],
            issues
        };
    }

    /**
     * Generates a formatted citation string.
     * @param {Citation} citation
     * @param {'ama' | 'vancouver' | 'nature'} [format='ama']
     * @returns {Promise<string>}
     */
    async generateCitationText(citation, format = 'ama') {
        switch (format) {
            case 'ama':
                return this.formatAMA(citation);
            case 'vancouver':
                return this.formatVancouver(citation);
            case 'nature':
                return this.formatNature(citation);
            default:
                return this.formatAMA(citation);
        }
    }

    /**
     * @private
     * @param {Citation} citation
     * @returns {string}
     */
    formatAMA(citation) {
        const authors = citation.authors.length > 3
            ? `${citation.authors.slice(0, 3).join(', ')}, et al`
            : citation.authors.join(', ');

        let formatted = `${authors}. ${citation.title}.`;

        if (citation.journal) {
            formatted += ` ${citation.journal}.`;
        }

        formatted += ` ${citation.year}`;

        if (citation.doi) {
            formatted += `. doi:${citation.doi}`;
        }

        return formatted;
    }

    /**
     * @private
     * @param {Citation} citation
     * @returns {string}
     */
    formatVancouver(citation) {
        const authors = citation.authors.join(', ');
        let formatted = `${authors}. ${citation.title}.`;

        if (citation.journal) {
            formatted += ` ${citation.journal}`;
        }

        formatted += ` ${citation.year}`;

        if (citation.doi) {
            formatted += `. Available from: https://doi.org/${citation.doi}`;
        }

        return formatted;
    }

    /**
     * @private
     * @param {Citation} citation
     * @returns {string}
     */
    formatNature(citation) {
        const authors = citation.authors.join(', ');
        return `${authors} ${citation.title}. ${citation.journal || ''} ${citation.year}${citation.doi ? ` https://doi.org/${citation.doi}` : ''}`;
    }

    /**
     * Calculates reference coverage and overall compliance score.
     * @param {string} content - The text content to analyze.
     * @param {string} brandId - The brand ID.
     * @returns {Promise<ReferenceValidation>}
     */
    async calculateCitationCoverage(content, brandId) {
        const citationNeeds = await this.analyzeReferenceNeeds(content, brandId);
        const existingRefs = await this.validateExistingReferences(content);

        const totalNeeds = citationNeeds.length;
        const coveredNeeds = citationNeeds.filter(need =>
            need.suggestedCitations.length > 0
        ).length;

        const citationCoverage = totalNeeds > 0 ? (coveredNeeds / totalNeeds) * 100 : 100;

        const complianceScore = Math.max(0,
            (citationCoverage * 0.7) +
            (existingRefs.issues.length === 0 ? 30 : 0)
        );

        return {
            citationCoverage,
            missingReferences: citationNeeds.filter(need => need.suggestedCitations.length === 0),
            existingReferences: existingRefs.detected,
            complianceScore
        };
    }

    /**
     * Public method to get all approved citations for a therapeutic area.
     * @param {string} [therapeuticArea='respiratory']
     * @returns {Citation[]}
     */
    getApprovedCitations(therapeuticArea = 'respiratory') {
        return this.approvedCitations.get(therapeuticArea) || [];
    }

    /**
     * Method to simulate fetching citations from external APIs (PubMed, etc.)
     * @param {string} query
     * @param {number} [maxResults=10]
     * @returns {Promise<Citation[]>}
     */
    async searchExternalCitations(query, maxResults = 10) {
        // This would integrate with PubMed API, Crossref, etc.
        // For now, return filtered mock data
        return this.mockCitations
            .filter(citation =>
                citation.title.toLowerCase().includes(query.toLowerCase()) ||
                citation.keyFindings.some(finding =>
                    finding.toLowerCase().includes(query.toLowerCase())
                )
            )
            .slice(0, maxResults);
    }
}

export const citationEngine = new CitationEngineService();