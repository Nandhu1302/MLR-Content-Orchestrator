import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

/**
 * Interface definition for VisualAsset removed.
 * It serves as documentation for the expected data structure.
 *
 * @typedef {object} VisualAsset
 * @property {string} id
 * @property {string} brand_id
 * @property {string} source_document_id
 * @property {'table' | 'chart' | 'graph' | 'image' | 'infographic' | 'diagram'} visual_type
 * @property {string | null} title
 * @property {string | null} caption
 * @property {string | null} source_section
 * @property {number | null} source_page
 * @property {any} visual_data - JSON data for charts/tables
 * @property {any} visual_metadata - Additional metadata
 * @property {string | null} storage_path - Path to the image file in storage
 * @property {any[]} applicable_contexts
 * @property {string[]} applicable_asset_types
 * @property {string[]} applicable_audiences
 * @property {string[]} linked_claims
 * @property {string[]} linked_references
 * @property {number} usage_count
 * @property {string | null} last_used_at
 * @property {boolean} mlr_approved
 * @property {string | null} mlr_approved_by
 * @property {string | null} mlr_approved_at
 * @property {string | null} approval_notes
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * Hook to fetch all visual assets for a given brand.
 *
 * @param {string | undefined} brandId - The ID of the brand to filter assets by.
 * @returns {object} Query result object from useQuery.
 */
export const useVisualAssets = (brandId) => {
  return useQuery({
    queryKey: ['visual-assets', brandId],
    queryFn: async () => {
      if (!brandId) return [];
      
      // Select all fields from the visual_assets table for the specified brand
      const { data, error } = await supabase
        .from('visual_assets')
        .select(`
          id,
          brand_id,
          source_document_id,
          visual_type,
          title,
          caption,
          source_section,
          source_page,
          visual_data,
          visual_metadata,
          storage_path,
          applicable_contexts,
          applicable_asset_types,
          applicable_audiences,
          linked_claims,
          linked_references,
          usage_count,
          last_used_at,
          mlr_approved,
          mlr_approved_by,
          mlr_approved_at,
          approval_notes,
          created_at,
          updated_at
        `)
        .eq('brand_id', brandId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data; // Data type casting removed in JS
    },
    // The query is only enabled if brandId is truthy
    enabled: !!brandId,
  });
};

/**
 * Hook to fetch a signed URL for a visual asset stored in Supabase Storage.
 * This is necessary for displaying secure assets.
 *
 * @param {string | null} storagePath - The path to the file in the 'visual-assets' bucket.
 * @returns {object} Query result object from useQuery.
 */
export const useVisualAssetUrl = (storagePath) => {
  return useQuery({
    queryKey: ['visual-asset-url', storagePath],
    queryFn: async () => {
      if (!storagePath) return null;
      
      // Create a signed URL that expires in 1 hour (3600 seconds)
      const { data } = await supabase.storage
        .from('visual-assets')
        .createSignedUrl(storagePath, 3600);
      
      return data?.signedUrl || null;
    },
    // The query is only enabled if storagePath is truthy
    enabled: !!storagePath,
    // Set stale time so the URL isn't refetched too often
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};