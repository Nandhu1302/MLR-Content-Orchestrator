/**
 * @typedef {object} ClaimUsage
 * @property {string} claimId
 * @property {string} claimDisplayId
 * @property {string} claimText
 * @property {number} citationNumber
 * @property {string[]} linkedReferences - Array of reference display IDs
 */

/**
 * @typedef {object} ReferenceUsage
 * @property {string} referenceId
 * @property {string} referenceDisplayId
 * @property {string} formattedCitation
 * @property {number} citationNumber
 */

/**
 * @typedef {object} ProcessedContent
 * @property {string} content - The processed content with HTML superscript markers
 * @property {ClaimUsage[]} claimsUsed
 * @property {ReferenceUsage[]} referencesUsed
 */

// NOTE: The 'supabase' import is assumed to be defined in the runtime environment.
// For demonstration, we use a placeholder comment. You must ensure `supabase` is
// correctly initialized and available where this class is used.
// import { supabase } from '@/integrations/supabase/client';

/**
 * A utility class for processing content containing clinical claim markers.
 * It links claims to references using a Supabase backend and formats citations.
 */
export class CitationProcessor {
    /**
     * Process AI-generated content by replacing [CLAIM:XXX] markers with superscript citations
     * and building a comprehensive reference list.
     * @param {string} rawContent
     * @param {string} brandId
     * @returns {Promise<ProcessedContent>}
     */
    static async processContent(
        rawContent,
        brandId
    ) {
        // Mocking the required global import for local running context
        // In a real environment, `supabase` should be imported or available globally.
        if (typeof supabase === 'undefined') {
            console.error("Supabase client is not available.");
            return {
                content: rawContent,
                claimsUsed: [],
                referencesUsed: []
            };
        }


        console.log('🔍 CitationProcessor.processContent called:', {
            contentLength: rawContent?.length || 0,
            brandId,
            contentPreview: rawContent?.substring(0, 100)
        });

        // Extract all claim markers from content - support both numeric and alphanumeric IDs
        const claimPattern = /\[CLAIM:(CML-[A-Za-z0-9]+)\]/g;
        const matches = [...rawContent.matchAll(claimPattern)];

        console.log('🔍 Claim markers found:', {
            matchCount: matches.length,
            markers: matches.map(m => m[1])
        });

        if (matches.length === 0) {
            return {
                content: rawContent,
                claimsUsed: [],
                referencesUsed: []
            };
        }

        // Fetch all referenced claims with their linked references
        const claimDisplayIds = [...new Set(matches.map(m => m[1]))];

        console.log('🔍 Querying clinical_claims for:', {
            brandId,
            claimDisplayIds
        });

        const { data: claims, error } = await supabase
            .from('clinical_claims')
            .select(`
                id,
                claim_id_display,
                claim_text,
                linked_references,
                brand_id
            `)
            .eq('brand_id', brandId)
            .in('claim_id_display', claimDisplayIds);

        console.log('🔍 Database query result:', {
            success: !error,
            claimsFound: claims?.length || 0,
            error: error?.message,
            firstClaim: claims?.[0]
        });

        if (error || !claims || claims.length === 0) {
            console.error('❌ Error fetching claims:', error);
            console.warn('⚠️ This may be due to RLS policies blocking access');
            return { content: rawContent, claimsUsed: [], referencesUsed: [] };
        }

        // Fetch all linked references
        const allReferenceIds = claims.reduce((acc, c) => {
            /** @type {string[] | null | undefined} */
            const refs = c.linked_references;
            if (refs && Array.isArray(refs)) {
                return [...acc, ...refs];
            }
            return acc;
        }, []);
        const uniqueReferenceIds = [...new Set(allReferenceIds)];

        let references = [];
        if (uniqueReferenceIds.length > 0) {
            const { data: refsData, error: refsError } = await supabase
                .from('clinical_references')
                .select(`
                    id,
                    reference_id_display,
                    formatted_citation,
                    reference_text
                `)
                .in('id', uniqueReferenceIds);

            if (!refsError && refsData) {
                references = refsData;
            }
        }

        // Build citation mappings
        const claimMap = new Map(claims.map(c => [c.claim_id_display, c]));
        const referenceMap = new Map(references.map(r => [r.id, r]));

        let citationCounter = 1;
        /** @type {ClaimUsage[]} */
        const claimsUsed = [];
        /** @type {ReferenceUsage[]} */
        const referencesUsed = [];
        const citationNumberMap = new Map(); // Maps claimDisplayId to citationNumber

        // Process content and replace markers
        let processedContent = rawContent;

        // Note: We iterate over the matches array, as directly replacing inside 
        // a loop using .replace() can miss subsequent matches due to index shifts
        // in the string. Using map/reduce or iterating over matches and replacing
        // on the original string's static matches is more robust, but since the 
        // regex replacement is complex (using match[0]), we'll rely on the global 
        // replacement below after mapping.

        // We first collect all unique claims and assign their citation numbers.
        const claimsToProcess = [...new Set(matches.map(m => m[1]))];

        for (const claimDisplayId of claimsToProcess) {
            const claim = claimMap.get(claimDisplayId);

            if (!claim) continue;

            // Get or assign citation number
            let citationNumber = citationNumberMap.get(claimDisplayId);
            if (!citationNumber) {
                citationNumber = citationCounter++;
                citationNumberMap.set(claimDisplayId, citationNumber);

                // Add to claims used
                const linkedRefs = (claim.linked_references || [])
                    .map((refId) => {
                        const ref = referenceMap.get(refId);
                        if (!ref) return null;

                        // Add reference if not already added
                        const existingRef = referencesUsed.find(r => r.referenceId === refId);
                        if (!existingRef) {
                            referencesUsed.push({
                                referenceId: refId,
                                referenceDisplayId: ref.reference_id_display || `REF-${referencesUsed.length + 1}`,
                                formattedCitation: ref.formatted_citation || ref.reference_text || 'Citation Text Missing',
                                // Note: Citation number here refers to its position in the referencesUsed list, 
                                // which matches the numbering in the references section.
                                citationNumber: referencesUsed.length + 1
                            });
                        }

                        return ref.reference_id_display || refId;
                    })
                    .filter(Boolean);

                claimsUsed.push({
                    claimId: claim.id,
                    claimDisplayId: claim.claim_id_display,
                    claimText: claim.claim_text,
                    citationNumber: citationNumber, // This is the superscript number
                    linkedReferences: linkedRefs
                });
            }
        }
        
        // Sort the referencesUsed list by the assigned citationNumber
        referencesUsed.sort((a, b) => a.citationNumber - b.citationNumber);

        // Now, perform the actual content replacement using the collected map
        processedContent = rawContent.replace(claimPattern, (match, claimDisplayId) => {
            const citationNumber = citationNumberMap.get(claimDisplayId);
            const claim = claimMap.get(claimDisplayId);

            if (citationNumber && claim) {
                return `<sup class="citation-marker" data-claim-id="${claim.id}" data-citation-num="${citationNumber}">${citationNumber}</sup>`;
            }
            // If claim or citation number is not found, return the original marker or a fallback
            return match;
        });


        return {
            content: processedContent,
            claimsUsed,
            referencesUsed
        };
    }

    /**
     * Validate claims used in content against expiration and approval scope
     * @param {ClaimUsage[]} claimsUsed
     * @param {string} assetType
     * @param {string} targetAudience
     * @returns {Promise<{valid: boolean, expiredClaims: string[], scopeMismatches: string[], missingReferences: string[]}>}
     */
    static async validateCitations(
        claimsUsed,
        assetType,
        targetAudience
    ) {
        if (typeof supabase === 'undefined') {
            console.error("Supabase client is not available.");
            return {
                valid: false,
                expiredClaims: [],
                scopeMismatches: [],
                missingReferences: []
            };
        }
        
        const claimIds = claimsUsed.map(c => c.claimId);

        const { data: claims } = await supabase
            .from('clinical_claims')
            .select('id, claim_id_display, expiration_date, approval_scope, linked_references')
            .in('id', claimIds);

        if (!claims) {
            return {
                valid: false,
                expiredClaims: [],
                scopeMismatches: [],
                missingReferences: []
            };
        }

        const now = new Date();
        const expiredClaims = [];
        const scopeMismatches = [];
        const missingReferences = [];

        for (const claim of claims) {
            // Check expiration
            if (claim.expiration_date && new Date(claim.expiration_date) < now) {
                expiredClaims.push(claim.claim_id_display);
            }

            // Check approval scope
            if (claim.approval_scope && claim.approval_scope.length > 0) {
                const scopeMatch =
                    claim.approval_scope.includes(assetType) ||
                    claim.approval_scope.includes(targetAudience) ||
                    claim.approval_scope.includes('all');

                if (!scopeMatch) {
                    scopeMismatches.push(claim.claim_id_display);
                }
            }

            // Check for missing references
            if (!claim.linked_references || claim.linked_references.length === 0) {
                missingReferences.push(claim.claim_id_display);
            }
        }

        return {
            valid: expiredClaims.length === 0 && scopeMismatches.length === 0 && missingReferences.length === 0,
            expiredClaims,
            scopeMismatches,
            missingReferences
        };
    }

    /**
     * Format references section for display
     * @param {ReferenceUsage[]} references
     * @returns {string}
     */
    static formatReferencesSection(references) {
        if (references.length === 0) return '';

        const sortedRefs = [...references].sort((a, b) => a.citationNumber - b.citationNumber);

        return sortedRefs
            .map(ref => `${ref.citationNumber}. ${ref.formattedCitation}`)
            .join('\n');
    }
}