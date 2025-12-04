import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  let piId;

  try {
    // Removed '!' non-null assertions
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    const body = await req.json();
    piId = body.piId;

    if (!piId) {
      throw new Error('piId is required');
    }

   
    console.log(`Starting to parse PI document: ${piId}`);

    // Create realtime channel for progress updates
    const progressChannel = supabase.channel(`parsing:${piId}`);
    await progressChannel.subscribe();

    /**
     * Sends a progress update to the realtime channel and database.
     * @param {string} stage 
     * @param {number} percentage 
     * @param {number} estimatedSecondsRemaining 
     */
    const sendProgress = async (stage, percentage, estimatedSecondsRemaining) => {
      await progressChannel.send({
        type: 'broadcast',
        event: 'parsing_progress',
        payload: {
          piId,
          stage,
   
          percentage,
          estimatedSecondsRemaining,
          timestamp: new Date().toISOString()
        }
      });
      console.log(`Progress: ${stage} - ${percentage}%`);
    };

    // Update status to processing and clear any previous error messages
    await supabase
      .from('prescribing_information')
      .update({ 
        parsing_status: 'processing',
        error_message: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', piId);
    await sendProgress('Initializing', 5, 50);

    // Get PI document details
    const { data: piDoc, error: piError } = await supabase
      .from('prescribing_information')
      .select('*')
      .eq('id', piId)
      .single();
    if (piError || !piDoc) {
      throw new Error('PI document not found');
    }

    console.log(`Retrieved PI document: ${piDoc.drug_name}`);

    await sendProgress('Downloading document', 10, 45);

    let fileData;
    // Check if we have a file_path for storage download
    if (piDoc.file_path) {
      // Always use storage client for Supabase storage (handles authentication)
      console.log('📄 Fetching PDF from storage:', piDoc.file_path);
      const { data: storageData, error: downloadError } = await supabase
        .storage
        .from('prescribing-information')
        .download(piDoc.file_path);
      if (downloadError || !storageData) {
        const errorMsg = downloadError?.message ||
          'File not found in storage';
        console.error('Failed to download PDF from storage:', downloadError);
        throw new Error(`Failed to download PDF from storage: ${errorMsg}`);
      }

      fileData = storageData;
      console.log('📥 PDF downloaded from storage, size:', fileData.size, 'bytes');
    } else if (piDoc.document_url && piDoc.document_url.startsWith('http') && !piDoc.document_url.includes('supabase.co/storage')) {
      // Only use fetch for truly external URLs (not Supabase storage)
      console.log('📄 Fetching PDF from external URL:', piDoc.document_url);
      try {
        const response = await fetch(piDoc.document_url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        fileData = await response.blob();
        console.log('📥 PDF downloaded from URL, size:', fileData.size, 'bytes');
      } catch (urlError) {
        const errorMsg = urlError instanceof Error ?
          urlError.message : 'Unknown error';
        console.error('Failed to download PDF from URL:', errorMsg);
        throw new Error(`Failed to download PDF from external URL: ${errorMsg}`);
      }
    } else {
      throw new Error('No valid file path or external document URL provided');
    }

    await sendProgress('Document downloaded', 20, 40);

    // NEW APPROACH: Process entire PDF in ONE request using vision model
    console.log('🤖 Using AI vision model to extract ALL text from PDF...');
    await sendProgress('Processing complete document', 50, 30);
    
    const startTime = Date.now();
    // Convert PDF to base64 for AI processing
    const arrayBuffer = await fileData.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Convert to base64 in manageable chunks
    const chunkSize = 10000;
    let binaryString = '';
    for (let i = 0; i < uint8Array.length; i += chunkSize) {
      const chunk = uint8Array.subarray(i, Math.min(i + chunkSize, uint8Array.length));
      binaryString += String.fromCharCode.apply(null, Array.from(chunk));
    }
    const pdfBase64 = btoa(binaryString);
    console.log(`📄 PDF converted to base64: ${Math.round(pdfBase64.length / 1024)}KB`);
    await sendProgress('Extracting with AI', 60, 20);

    // Single AI call to process entire document
    try {
      const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${lovableApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-pro',
          messages: [
            {
              role: 'system',
              content: `You are a pharmaceutical document parser. Extract ALL text content from this complete prescribing information document.

Extract these sections with COMPLETE content and use THESE EXACT JSON keys:
- "indications": Indications and Usage section
- "mechanism_of_action": Mechanism of Action 
- "clinical_pharmacology": Clinical Pharmacology
- "clinical_trials": Clinical Studies/Trials 
(Include ALL study names, endpoints, sample sizes, results, p-values)
- "efficacy_data": Efficacy outcomes and endpoints from trials
- "safety_profile": Overall safety summary
- "adverse_events": Adverse Reactions/Events
- "dosing": Dosage and Administration
- "administration": Route and method of administration
- "contraindications": Contraindications
- "warnings": Warnings and Precautions  
- "drug_interactions": Drug Interactions
- "patient_selection": Use in Specific Populations
- "references": References (Extract EVERY citation with authors, journals, years)

CRITICAL: Use these EXACT key names in your JSON response.
Map the PI document sections to these standardized keys.
Return as valid JSON.
Extract EVERYTHING - this is the complete document.`
            },
            {
              role: 'user',
              content: [
                {
                  type: 'text',
    
                  text: `Extract all content from this complete ${piDoc.document_type.toUpperCase()} for ${piDoc.drug_name}.
Return as JSON.`
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:application/pdf;base64,${pdfBase64}`,
       
                    detail: 'high'
                  }
                }
              ]
            }
          ],
          response_format: { type: "json_object" },
  
          max_tokens: 16000
        }),
      });
      
      if (!aiResponse.ok) {
        const errorText = await aiResponse.text();
        console.error(`AI extraction error:`, aiResponse.status, errorText);
        if (aiResponse.status === 429) {
          throw new Error('Rate limit exceeded. Please try again in a few moments.');
        }
        if (aiResponse.status === 402) {
          throw new Error('AI credits exhausted. Please add credits to continue.');
        }
        throw new Error(`AI extraction failed: ${errorText}`);
      }

      const aiData = await aiResponse.json();
      const extractedContent = aiData.choices?.[0]?.message?.content;
      if (!extractedContent) {
        throw new Error('No content extracted from AI response');
      }

      // Parse extracted content with robust error handling
      let parsedContent;
      if (typeof extractedContent === 'string') {
        // Remove markdown code blocks if present
        let cleanedContent = extractedContent.trim();
        if (cleanedContent.startsWith('```')) {
          const startIndex = cleanedContent.indexOf('\n') + 1;
          const endIndex = cleanedContent.lastIndexOf('```');
          if (startIndex > 0 && endIndex > startIndex) {
            cleanedContent = cleanedContent.slice(startIndex, endIndex);
          }
        }
        
        // Clean up control characters that break JSON parsing
        cleanedContent = cleanedContent
          .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Remove control chars except \n, \r, \t
          .trim();
        try {
          parsedContent = JSON.parse(cleanedContent);
        } catch (parseError) {
          console.error('JSON parse error:', parseError.message);
          console.error('First 500 chars of content:', cleanedContent.substring(0, 500));
          throw new Error(`Failed to parse AI response as JSON: ${parseError.message}`);
        }
      } else {
        parsedContent = extractedContent;
      }

      const mergedSections = parsedContent;
      console.log(`✅ Extraction complete. Sections found:`, Object.keys(mergedSections).filter(k => mergedSections[k]?.length > 0));
      const totalContentLength = Object.values(mergedSections).join('').length;
      const processingTime = Date.now() - startTime;
      console.log(`⏱️ Total processing time: ${Math.floor(processingTime/1000)}s`);
      console.log(`📊 Total content extracted: ${totalContentLength} characters`);

      if (totalContentLength < 1000) {
        throw new Error('Insufficient content extracted. Document may be too large or complex.');
      }

      await sendProgress('Saving results', 90, 3);
      // Update PI document with parsed data
      const { error: updateError } = await supabase
        .from('prescribing_information')
        .update({
          parsed_data: mergedSections,
          parsing_status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('id', piId);
      if (updateError) {
        console.error('Update error:', updateError);
        throw updateError;
      }

      console.log(`Successfully parsed PI document ${piId}`);

      await sendProgress('Complete', 100, 0);
      // Clean up channel
      await progressChannel.unsubscribe();
      return new Response(
        JSON.stringify({
          success: true,
          message: 'PI document parsed successfully',
          data: {
            piId,
            sections_extracted: Object.keys(mergedSections).filter(k => mergedSections[k]?.length > 0).length,
            total_content_length: totalContentLength,
            
            processing_time_seconds: Math.floor((Date.now() - startTime) / 1000)
          }
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    } catch (extractionError) {
      const errorMsg = extractionError instanceof Error ?
        extractionError.message : 'Extraction failed';
      console.error('Extraction error:', errorMsg);
      throw new Error(`Document extraction failed: ${errorMsg}`);
    }
  } catch (error) {
    console.error('Parse error:', error);
    
    // piId was already extracted at the start, use it from closure
    // Don't try to read request body again as it's already consumed
    const errorMessage = error instanceof Error ?
      error.message : 'Unknown error occurred';

    // Update status if we have piId
    if (piId) {
      try {
        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        await supabase
          .from('prescribing_information')
          .update({
            parsing_status: 'failed',
            error_message: errorMessage
          })
          .eq('id', piId);
      } catch (updateError) {
        console.error('Failed to update error status:', updateError);
      }
    }

    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});