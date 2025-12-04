import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { documentId } = await req.json();

    if (!documentId) {
      throw new Error('documentId is required');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Fetching document:', documentId);

    // Get document details
    const { data: document, error: docError } = await supabase
      .from('brand_documents')
      .select('id, brand_id, file_path, document_title, document_url')
      .eq('id', documentId)
      .single();

    if (docError || !document) {
      throw new Error(`Document not found: ${docError?.message}`);
    }

    if (!document.file_path && !document.document_url) {
      throw new Error('Document has no valid file path or external URL');
    }

    let fileData;
    let fileName;

    // 1. Download the file from storage or external URL
    if (document.file_path) {
      console.log('Downloading file from storage:', document.file_path);
      const { data: storageData, error: downloadError } = await supabase
        .storage
        .from('brand-documents')
        .download(document.file_path);
      
      if (downloadError || !storageData) {
        throw new Error(`Failed to download file from storage: ${downloadError?.message}`);
      }
      fileData = storageData;
      fileName = document.file_path.split('/').pop() || 'document.pdf';
    } else if (document.document_url && document.document_url.startsWith('http')) {
      console.log('Fetching file from external URL:', document.document_url);
      const response = await fetch(document.document_url);
      if (!response.ok) {
        throw new Error(`Failed to fetch file from external URL. Status: ${response.status}`);
      }
      fileData = await response.blob();
      fileName = document.document_title || 'external_document.pdf';
    } else {
      throw new Error('Invalid file source for reprocessing');
    }
    
    console.log(`File downloaded: ${fileName} (${fileData.size} bytes)`);

    // 2. Prepare FormData for the parse-brand-document function
    const formData = new FormData();
    // Use the Blob's arrayBuffer to create a File object suitable for the handler
    const file = new File([await fileData.arrayBuffer()], document.document_title || fileName);

    // The parse-brand-document handler expects the file under the key 'file'
    formData.append('file', file, document.document_title || fileName);
    formData.append('documentId', documentId);
    formData.append('brandId', document.brand_id);

    // 3. Call parse-brand-document function
    console.log('Calling parse-brand-document function for re-extraction...');
    const parseResponse = await fetch(
      `${Deno.env.get('SUPABASE_URL')}/functions/v1/parse-brand-document`,
      {
        method: 'POST',
        headers: {
          // Note: When using FormData, Deno/Node environments usually handle 
          // the 'Content-Type': 'multipart/form-data' header automatically.
          // We include the Authorization header for function access.
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
        },
        body: formData,
      }
    );

    if (!parseResponse.ok) {
      const errorText = await parseResponse.text();
      console.error('Parse function error:', errorText);
      throw new Error(`Parse function failed: ${errorText}`);
    }

    const result = await parseResponse.json();
    console.log('Document reprocessed successfully:', result);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Document reprocessed successfully',
        visualAssets: result.visualAssetsExtracted || 0
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in reprocess-document:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

    // Optional: Update status in database if ID is known
    // (Skipping for brevity, as the calling function handles global error logging)

    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});