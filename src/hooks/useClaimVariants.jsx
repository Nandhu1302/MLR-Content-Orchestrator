import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

/**
 * Interface definition for ClaimVariant removed.
 * It serves as documentation for the expected data structure.
 *
 * @typedef {object} ClaimVariant
 * @property {string} id
 * @property {string} parent_claim_id
 * @property {string} variant_text
 * @property {string} variant_type
 * @property {number | null} max_character_length
 * @property {string[]} suitable_for_channels
 * @property {boolean} requires_footnote
 * @property {string | null} footnote_text
 * @property {boolean} mlr_approved
 * @property {number} conversion_rate
 * @property {number} usage_count
 * @property {string} created_at
 * @property {object} parent_claim - Nested data from the parent claim
 */

/**
 * Custom hook to fetch claim variants associated with a specific brand.
 * It fetches the variants and joins them with their parent claim data.
 *
 * @param {string | undefined} brandId - The ID of the brand to filter claims by.
 * @returns {object} Query result object from useQuery.
 */
export function useClaimVariants(brandId) {
  return useQuery({
    queryKey: ['claim-variants', brandId],
    queryFn: async () => {
      if (!brandId) return [];

      const { data, error } = await supabase
        .from('claim_variants')
        .select(`
          *,
          parent_claim:parent_claim_id(
            claim_text,
            claim_type,
            brand_id
          )
        `)
        // No brandId filter here; filtering occurs client-side after join
        .order('conversion_rate', { ascending: false });

      if (error) {
        console.error('Error fetching claim variants:', error);
        throw error;
      }

      // Filter the results client-side to ensure only variants belonging
      // to claims associated with the current brandId are returned.
      const brandVariants = data.filter(
        (v) => v.parent_claim?.brand_id === brandId
      );

      return brandVariants;
    },
    enabled: !!brandId
  });
}