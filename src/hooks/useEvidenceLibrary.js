
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useVisualAssets } from './useVisualAssets';

// JS version of useEvidenceLibrary (types removed, same context/logic)
export const useEvidenceLibrary = (brandId) => {
  const claims = useQuery({
    queryKey: ['clinical-claims', brandId],
    queryFn: async () => {
      if (!brandId) return [];
      const { data, error } = await supabase
        .from('clinical_claims')
        .select('*')
        .eq('brand_id', brandId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!brandId,
  });

  const references = useQuery({
    queryKey: ['clinical-references', brandId],
    queryFn: async () => {
      if (!brandId) return [];
      const { data, error } = await supabase
        .from('clinical_references')
        .select('*')
        .eq('brand_id', brandId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!brandId,
  });

  const segments = useQuery({
    queryKey: ['content-segments', brandId],
    queryFn: async () => {
      if (!brandId) return [];
      const { data, error } = await supabase
        .from('content_segments')
        .select('*')
        .eq('brand_id', brandId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!brandId,
  });

  const safetyStatements = useQuery({
    queryKey: ['safety-statements', brandId],
    queryFn: async () => {
      if (!brandId) return [];
      const { data, error } = await supabase
        .from('safety_statements')
        .select('*')
        .eq('brand_id', brandId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!brandId,
  });

  const visualAssets = useVisualAssets(brandId);

  return {
    claims: claims.data || [],
    references: references.data || [],
    segments: segments.data || [],
    safetyStatements: safetyStatements.data || [],
    visualAssets: visualAssets.data || [],
    isLoading:
      claims.isLoading ||
      references.isLoading ||
      segments.isLoading ||
      safetyStatements.isLoading ||
      visualAssets.isLoading,
    error:
      claims.error ||
      references.error ||
      segments.error ||
      safetyStatements.error ||
      visualAssets.error,
  };
};
