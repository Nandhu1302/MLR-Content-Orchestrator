import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// The BrandDocument, DocumentStats, and AllBrandDocumentsResult types are removed
// in JavaScript, as it doesn't use explicit type interfaces.

export const useAllBrandDocuments = (brandId) => {
  return useQuery({
    queryKey: ['all-brand-documents', brandId],
    queryFn: async () => {
      if (!brandId) {
        return {
          documents: [],
          stats: {
            total: 0,
            parsed: 0,
            pending: 0,
            processing: 0,
            failed: 0,
            byCategory: {}
          },
          byCategory: {}
        };
      }

      const { data, error } = await supabase
        .from('brand_documents') // Removed 'as any' type cast
        .select('*')
        .eq('brand_id', brandId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching documents:', error);
        throw error;
      }

      // Treat the fetched data as the array of documents
      const documents = data || [];

      // Calculate stats
      const stats = {
        total: documents.length,
        parsed: documents.filter(d => d.parsing_status === 'completed').length,
        pending: documents.filter(d => d.parsing_status === 'pending').length,
        processing: documents.filter(d => d.parsing_status === 'processing').length,
        failed: documents.filter(d => d.parsing_status === 'failed').length,
        byCategory: {}
      };

      // Group by category
      const byCategory = {};
      documents.forEach(doc => {
        const category = doc.document_category || 'other';
        if (!byCategory[category]) {
          byCategory[category] = [];
        }
        byCategory[category].push(doc);
        
        // Count by category
        stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;
      });

      return {
        documents,
        stats,
        byCategory
      };
    },
    enabled: !!brandId,
    refetchInterval: (query) => {
      const data = query.state.data;
      // Refetch every 5 seconds if any document is processing or pending
      if (data?.stats.processing > 0 || data?.stats.pending > 0) {
        return 5000;
      }
      return false;
    }
  });
};