import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

/**
 * Interface definition for ContentModule removed.
 * It serves as documentation for the expected data structure.
 *
 * @typedef {object} ContentModule
 * @property {string} id
 * @property {string} module_text
 * @property {string} module_type
 * @property {string | null} length_variant
 * @property {string | null} tone_variant
 * @property {number | null} character_limit_max
 * @property {number} usage_score
 * @property {boolean} mlr_approved
 * @property {string[]} linked_claims
 * @property {string[]} linked_references
 * @property {string[]} required_safety_statements
 * @property {string} created_at
 */

/**
 * Custom hook to fetch reusable content modules associated with a specific brand.
 *
 * @param {string | undefined} brandId - The ID of the brand to filter content modules by.
 * @returns {object} Query result object from useQuery.
 */
export function useContentModules(brandId) {
  return useQuery({
    queryKey: ['content-modules', brandId],
    queryFn: async () => {
      if (!brandId) return [];

      const { data, error } = await supabase
        .from('content_modules')
        .select('*')
        .eq('brand_id', brandId)
        .order('usage_score', { ascending: false });

      if (error) {
        console.error('Error fetching content modules:', error);
        throw error;
      }

      return data; // Data type casting removed in JS
    },
    // The query is only enabled if brandId is truthy
    enabled: !!brandId
  });
}