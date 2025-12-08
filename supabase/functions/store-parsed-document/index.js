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

      Deno.env.get('SUPABASE_URL') ?? '',

      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

    );
 
    const { documentId, parsedData } = await req.json();
 
    if (!documentId || !parsedData) {

      throw new Error('Missing documentId or parsedData');

    }
 
    console.log(`Storing parsed data for document: ${documentId}`);
 
    // Update the document with parsed data

    const { data, error } = await supabase

      .from('brand_documents')

      .update({

        parsed_data: parsedData,

        parsing_status: 'completed',

        parsing_progress: 100,

        error_message: null,

        updated_at: new Date().toISOString()

      })

      .eq('id', documentId)

      .select()

      .single();
 
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

    return new Response(

      JSON.stringify({ success: false, error: errorMessage }),

      {

        status: 500,

        headers: { ...corsHeaders, 'Content-Type': 'application/json' }

      }

    );

  }

});
 