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
    const supabase = createClient(
      // Use '??' for nullish coalescing to safely handle environment variables
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Parse the request body
    const { documentId, parsedData } = await req.json();

    if (!documentId || !parsedData) {
      throw new Error('Missing documentId or parsedData');
    }

    console.log(`Storing parsed data for document: ${documentId}`);

    // Update the brand_documents table with the results
    const { data, error } = await supabase
      .from('brand_documents')
      .update({
        // The parsed JSON data from the AI parser
        parsed_data: parsedData, 
        // Set final status
        parsing_status: 'completed',
        parsing_progress: 100,
        error_message: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', documentId)
      .select() // Select the updated row
      .single(); // Expect a single row

    if (error) {
      console.error('Database update error:', error);
      throw error;
    }

    console.log(`Successfully stored parsed data for document: ${documentId}`);

    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in store-parsed-document:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    // Attempt to update the status to 'failed' if documentId is known
    // This is optional but good practice for error handling in the context of the user's other files
    if (documentId) {
      try {
        const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
        
        // Ensure keys are available before creating the client again
        if (supabaseUrl && supabaseKey) {
            const supabase = createClient(supabaseUrl, supabaseKey);
            await supabase
              .from('brand_documents')
              .update({
                parsing_status: 'failed',
                error_message: errorMessage
              })
              .eq('id', documentId);
        }
      } catch (updateError) {
        console.error('Failed to update error status during final failure:', updateError);
      }
    }

    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});