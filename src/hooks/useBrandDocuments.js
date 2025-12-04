import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useBrandDocuments = (brandId) => {
  return useQuery({
    queryKey: ['brand-documents', brandId],
    queryFn: async () => {
      if (!brandId) {
        return {
          pi: { exists: false, status: 'missing' },
          isi: { exists: false, status: 'missing' }
        };
      }

      // Fetch PI document
      const { data: piDocs } = await supabase
        .from('prescribing_information')
        .select('*')
        .eq('brand_id', brandId)
        .eq('document_type', 'pi')
        .order('created_at', { ascending: false })
        .limit(1);

      // Fetch ISI document
      const { data: isiDocs } = await supabase
        .from('prescribing_information')
        .select('*')
        .eq('brand_id', brandId)
        .eq('document_type', 'isi')
        .order('created_at', { ascending: false })
        .limit(1);

      const piDoc = piDocs?.[0];
      const isiDoc = isiDocs?.[0];

      // Check evidence extraction status for PI
      let piEvidenceStatus = { extracted: false, claims: 0, references: 0, segments: 0 };
      if (piDoc?.id) {
        const [claimsResult, referencesResult, segmentsResult] = await Promise.all([
          supabase.from('clinical_claims').select('id', { count: 'exact', head: true }).eq('pi_document_id', piDoc.id),
          supabase.from('clinical_references').select('id', { count: 'exact', head: true }).eq('pi_document_id', piDoc.id),
          supabase.from('content_segments').select('id', { count: 'exact', head: true }).eq('pi_document_id', piDoc.id)
        ]);

        piEvidenceStatus = {
          extracted: (claimsResult.count || 0) > 0,
          claims: claimsResult.count || 0,
          references: referencesResult.count || 0,
          segments: segmentsResult.count || 0
        };
      }

      // Check evidence extraction status for ISI
      let isiEvidenceStatus = { extracted: false, safety: 0 };
      if (isiDoc?.id) {
        const { count: safetyCount } = await supabase
          .from('safety_statements')
          .select('id', { count: 'exact', head: true })
          .eq('isi_document_id', isiDoc.id);

        isiEvidenceStatus = {
          extracted: (safetyCount || 0) > 0,
          safety: safetyCount || 0
        };
      }

      return {
        pi: piDoc ? {
          exists: true,
          status: piDoc.parsing_status,
          drugName: piDoc.drug_name,
          version: piDoc.version || undefined,
          uploadedAt: new Date(piDoc.created_at),
          documentId: piDoc.id,
          errorMessage: piDoc.error_message || undefined,
          evidenceExtracted: piEvidenceStatus.extracted,
          claimsCount: piEvidenceStatus.claims,
          referencesCount: piEvidenceStatus.references,
          segmentsCount: piEvidenceStatus.segments
        } : {
          exists: false,
          status: 'missing'
        },
        isi: isiDoc ? {
          exists: true,
          status: isiDoc.parsing_status,
          drugName: isiDoc.drug_name,
          version: isiDoc.version || undefined,
          uploadedAt: new Date(isiDoc.created_at),
          documentId: isiDoc.id,
          errorMessage: isiDoc.error_message || undefined,
          evidenceExtracted: isiEvidenceStatus.extracted,
          claimsCount: isiEvidenceStatus.safety
        } : {
          exists: false,
          status: 'missing'
        }
      };
    },
    enabled: !!brandId,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (data?.pi?.status === 'processing' || data?.isi?.status === 'processing' ||
          data?.pi?.status === 'pending' || data?.isi?.status === 'pending') {
        return 5000;
      }
      return false;
    }
  });
};

export default useBrandDocuments;
