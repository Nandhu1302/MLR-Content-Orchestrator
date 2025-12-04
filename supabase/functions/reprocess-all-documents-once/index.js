import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// NOTE: The original file contained TypeScript interfaces 'DocumentToReprocess' and 'ReprocessResult'
// These interfaces have been removed in the JavaScript conversion.

// NOTE: The function 'processDocumentForVisualAssets' is not defined in this file.
// It is assumed to be either imported from another file (like 'parse-brand.js' in the previous conversion) 
// or available in the global scope of the execution environment (Deno/Cloud function).
// The context of the code is preserved by keeping the function call.
// For successful execution, ensure this function is available when deployed.

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Starting one-time reprocessing of all documents for visual assets...');

    // Fetch all completed documents across all brands
    const { data: documents, error: fetchError } = await supabase
      .from('brand_documents')
      .select('id, brand_id, document_title, parsing_status')
      .eq('parsing_status', 'completed')
      .not('parsed_data', 'is', null);

    if (fetchError) {
      console.error('Error fetching documents:', fetchError);
      throw fetchError;
    }

    console.log(`Found ${documents?.length || 0} completed documents to reprocess`);

    if (!documents || documents.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true,
          message: 'No completed documents found for reprocessing',
          totalVisualAssets: 0,
          results: []
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const results = [];

    // Process each document sequentially
    for (const doc of documents) {
      try {
        console.log(`-> Reprocessing document: ${doc.document_title} (${doc.id})`);
        
        // This function call simulates the reprocessing logic, assuming it's defined elsewhere
        const extractResult = await processDocumentForVisualAssets(doc.id, doc.brand_id);
        
        if (!extractResult || !extractResult.visualAssets) {
          console.warn(`Reprocessing failed to return visual assets for: ${doc.document_title}`);
          results.push({
            documentId: doc.id,
            title: doc.document_title,
            success: false,
            error: 'Reprocessing function did not return expected data structure'
          });
        } else {
          console.log(`-> Successfully reprocessed: ${extractResult.visualAssets.length} visual assets found.`);
          results.push({
            documentId: doc.id,
            title: doc.document_title,
            success: true,
            visualAssets: extractResult.visualAssets.length || 0
          });
        }
      } catch (error) {
        console.error(`Exception reprocessing ${doc.document_title}:`, error);
        results.push({
          documentId: doc.id,
          title: doc.document_title,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const totalVisualAssets = results.reduce((sum, r) => sum + (r.visualAssets || 0), 0);

    console.log(`Reprocessing complete: ${successCount}/${documents.length} successful, ${totalVisualAssets} visual assets extracted`);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: `Reprocessed ${successCount}/${documents.length} documents`,
        totalVisualAssets,
        results
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in reprocess-all-documents-once:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});