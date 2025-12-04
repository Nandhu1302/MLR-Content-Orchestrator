import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";
import { resolvePDFJS } from "https://esm.sh/pdfjs-serverless@0.5.0"; // [cite: 1]

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type', // [cite: 2]
};

/**
 * Generate parsing prompt based on document category
 * @param {string} documentCategory 
 * @param {string} documentType 
 * @returns {string} The complete prompt for the AI model
 */
const getParsingPrompt = (documentCategory, documentType) => { // [cite: 3]
  const basePrompt = `You are a pharmaceutical document parser.
Extract ALL text content from this complete document.`; // [cite: 3, 4]
  
  switch (documentCategory) {
    case 'clinical':
    case 'safety-information':
      return basePrompt + `\n\nExtract these sections with COMPLETE content and use THESE EXACT JSON keys:
- "indications": Indications and Usage section
- "mechanism_of_action": Mechanism of Action 
- "clinical_pharmacology": Clinical Pharmacology
- "clinical_trials": Clinical Studies/Trials (Include ALL study names, endpoints, sample sizes, results, p-values)
- "efficacy_data": Efficacy outcomes and endpoints from trials
- "safety_profile": Overall safety summary
- "adverse_events": Adverse Reactions/Events
- "dosing": Dosage and Administration
- "administration": Route and method of administration
- "contraindications": Contraindications
- "warnings": Warnings and Precautions  
- "drug_interactions": Drug 
Interactions
- "patient_selection": Use in Specific Populations
- "references": References (Extract EVERY citation with authors, journals, years)

CRITICAL: Use these EXACT key names in your JSON response.
Map the document sections to these standardized keys. Extract EVERYTHING - this is the complete document.`; // [cite: 4, 5, 6]
    
    case 'marketing': // [cite: 7]
      return basePrompt + `\n\nExtract these marketing elements:
- "key_messages": Main marketing messages and value propositions
- "value_propositions": Product benefits and differentiators
- "target_audiences": Intended audience segments
- "campaign_themes": Thematic elements and creative concepts
- "calls_to_action": CTAs and next steps
- "brand_positioning": How the product is positioned
- "competitive_advantages": Points of differentiation
- "messaging_framework": Core messaging strategy

Extract all content and structure as JSON.`;
    
    case 'competitive-intelligence': // [cite: 8]
      return basePrompt + `\n\nExtract competitive intelligence:
- "competitor_products": Competing products and brands
- "market_positioning": Market position analysis
- "pricing_information": Pricing data and strategies
- "strengths": Competitor strengths
- "weaknesses": Competitor weaknesses
- "differentiation_points": Key differentiators
- "market_share": Market share data
- "strategic_insights": Strategic analysis

Extract all information and return as JSON.`;
    
    case 'regulatory': // [cite: 9]
      return basePrompt + `\n\nExtract regulatory information:
- "regulatory_status": Approval status and classification
- "approval_dates": Key regulatory dates
- "indications": Approved indications
- "restrictions": Regulatory restrictions
- "required_disclaimers": Mandatory disclaimer text
- "submission_details": Submission information
- "compliance_requirements": Compliance obligations

Extract all regulatory data and return as JSON.`;
    
    case 'brand-guidelines': // [cite: 10]
      return basePrompt + `\n\nExtract brand guidelines:
- "brand_voice": Brand voice and tone guidelines
- "visual_identity": Visual design standards
- "messaging_guidelines": Messaging rules and frameworks
- "logo_usage": Logo usage rules
- "color_palette": Brand colors
- "typography": Font guidelines
- "imagery_style": Image style guidelines

Extract all brand standards and return as JSON.`;
    
    default: // [cite: 11]
      return basePrompt + `\n\nExtract all relevant content, key sections, and important statements.
Organize into logical sections and return as JSON.`; // [cite: 12]
  }
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  let documentId; // [cite: 122]

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'); // [cite: 123]
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    
    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);

   
    // Handle both JSON and FormData requests // [cite: 13]
    const contentType = req.headers.get('content-type') || '';
    let brandId;
    let uploadedFile;

    if (contentType.includes('multipart/form-data')) {
      // FormData from file upload or reprocess
      const formData = await req.formData();
      const docId = formData.get('documentId');
      const brand = formData.get('brandId');
      const file = formData.get('file'); // [cite: 14]
      
      if (!docId || typeof docId !== 'string') {
        throw new Error('documentId is required in FormData'); // [cite: 15]
      }
      
      documentId = docId; // [cite: 15]
      brandId = brand ?
        String(brand) : undefined; // [cite: 16]
      uploadedFile = file instanceof File ? file : undefined; // [cite: 16]
      console.log(`Received FormData request for document: ${documentId}, has file: ${!!uploadedFile}`); // [cite: 17]
    } else {
      // JSON request
      const body = await req.json();
      documentId = body.documentId; // [cite: 18]
      brandId = body.brandId;
      
      console.log(`Received JSON request for document: ${documentId}`); // [cite: 19]
    }

    if (!documentId) {
      throw new Error('documentId is required'); // [cite: 20]
    }

    console.log(`Starting to parse brand document: ${documentId}`); // [cite: 20]
    // Create realtime channel for progress updates
    const progressChannel = supabase.channel(`parsing:${documentId}`); // [cite: 21]
    await progressChannel.subscribe();
    
    /**
     * Sends a progress update to the realtime channel and database.
     * @param {string} stage 
     * @param {number} percentage 
     * @param {number} estimatedSecondsRemaining 
     */
    const sendProgress = async (stage, percentage, estimatedSecondsRemaining) => { // [cite: 22]
      // Broadcast to realtime channel
      await progressChannel.send({
        type: 'broadcast',
        event: 'parsing_progress',
        payload: {
          documentId,
          stage,
          percentage,
          estimatedSecondsRemaining,
     
          timestamp: new Date().toISOString() // [cite: 23]
        }
      });
      // Update database column for persistence
      await supabase // [cite: 24]
        .from('brand_documents')
        .update({ 
          parsing_progress: percentage,
          updated_at: new Date().toISOString()
        })
        .eq('id', documentId);
      console.log(`Progress: ${stage} - ${percentage}%`); // [cite: 25]
    };

    // Update status to processing
    await supabase
      .from('brand_documents')
      .update({ 
        parsing_status: 'processing',
        error_message: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', documentId);
    await sendProgress('Initializing', 5, 50); // [cite: 26]

    // Get document details
    const { data: doc, error: docError } = await supabase
      .from('brand_documents')
      .select('*')
      .eq('id', documentId)
      .single();
    
    if (docError || !doc) { // [cite: 27]
      throw new Error('Document not found'); // [cite: 28]
    }

    console.log(`Retrieved document: ${doc.document_title || doc.drug_name} | Category: ${doc.document_category}`);

    await sendProgress('Downloading document', 10, 45);

    let fileData;
    // Use uploaded file if provided (from FormData), otherwise download from storage // [cite: 29]
    if (uploadedFile) {
      console.log('📄 Using uploaded file from FormData:', uploadedFile.name, uploadedFile.size, 'bytes'); // [cite: 29]
      fileData = uploadedFile; // [cite: 30]
    } else if (doc.file_path) {
      console.log('📄 Fetching PDF from storage:', doc.file_path); // [cite: 30]
      const { data: storageData, error: downloadError } = await supabase // [cite: 31]
        .storage
        .from('brand-documents')
        .download(doc.file_path);
      
      if (downloadError || !storageData) { // [cite: 32]
        const errorMsg = downloadError?.message || // [cite: 33]
          'File not found in storage';
        console.error('Failed to download PDF from storage:', downloadError); // [cite: 33]
        throw new Error(`Failed to download PDF from storage: ${errorMsg}`); // [cite: 34]
      }

      fileData = storageData;
      console.log('📥 PDF downloaded from storage, size:', fileData.size, 'bytes'); // [cite: 35]
    } else if (doc.document_url && doc.document_url.startsWith('http') && !doc.document_url.includes('supabase.co/storage')) {
      console.log('📄 Fetching PDF from external URL:', doc.document_url); // [cite: 35]
      try { // [cite: 36]
        const response = await fetch(doc.document_url);
        if (!response.ok) { // [cite: 37]
          throw new Error(`HTTP error! status: ${response.status}`); // [cite: 38]
        }
        fileData = await response.blob();
        console.log('📥 PDF downloaded from URL, size:', fileData.size, 'bytes'); // [cite: 39]
      } catch (urlError) { // [cite: 39]
        const errorMsg = urlError instanceof Error ? // [cite: 40]
          urlError.message : 'Unknown error';
        console.error('Failed to download PDF from URL:', errorMsg); // [cite: 41]
        throw new Error(`Failed to download PDF from external URL: ${errorMsg}`); // [cite: 42]
      }
    } else {
      throw new Error('No valid file path or external document URL provided'); // [cite: 43]
    }

    // Store file size
    await supabase
      .from('brand_documents')
      .update({ file_size_bytes: fileData.size })
      .eq('id', documentId);
    await sendProgress('Document downloaded', 20, 40); // [cite: 44]

    console.log('📄 Extracting text from PDF...');
    await sendProgress('Extracting text', 40, 35);
    
    const startTime = Date.now();
    // Extract text using pdfjs-serverless (designed for Deno/serverless) // [cite: 45]
    const arrayBuffer = await fileData.arrayBuffer();
    console.log(`📦 PDF size: ${Math.round(arrayBuffer.byteLength / 1024)}KB`); // [cite: 46]
    
    const { getDocument } = await resolvePDFJS(); // [cite: 46]
    const pdf = await getDocument({ // [cite: 47]
      data: new Uint8Array(arrayBuffer),
      useSystemFonts: true
    }).promise;
    console.log(`📑 PDF loaded: ${pdf.numPages} pages`); // [cite: 48]
    
    // Extract all text
    let fullText = '';
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) { // [cite: 49]
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent(); // [cite: 50]
      const pageText = textContent.items.map((item) => item.str).join(' '); // [cite: 50]
      fullText += `\n\n--- Page ${pageNum} ---\n${pageText}`; // [cite: 50]
      if (pageNum % 5 === 0) { // [cite: 51]
        const progress = 40 + Math.floor((pageNum / pdf.numPages) * 20); // [cite: 51]
        await sendProgress(`Extracted ${pageNum}/${pdf.numPages} pages`, progress, 35); // [cite: 52]
      }
    }
    
    console.log(`✅ Extracted ${fullText.length} characters from ${pdf.numPages} pages`); // [cite: 52]
    if (fullText.length < 100) { // [cite: 53]
      throw new Error('Insufficient text extracted. Document may be image-based or corrupted.'); // [cite: 54]
    }

    // ============================================================
    // Vision-based extraction of charts, images, infographics
    // ============================================================
    console.log('🎨 Starting vision-based visual asset extraction...'); // [cite: 54]
    await sendProgress('Extracting visual assets', 60, 40); // [cite: 55]
    
    const visualAssets = [];
    const maxPagesToProcess = 50; // [cite: 55]
    // Limit to avoid excessive API calls // [cite: 56]
    const pagesToProcess = Math.min(pdf.numPages, maxPagesToProcess); // [cite: 56]
    
    for (let pageNum = 1; pageNum <= pagesToProcess; pageNum++) { // [cite: 57]
      try {
        console.log(`📸 Processing page ${pageNum}/${pagesToProcess} for visuals...`); // [cite: 57]
        // Render page as canvas/image data
        const page = await pdf.getPage(pageNum); // [cite: 58]
        const viewport = page.getViewport({ scale: 1.5 }); // 1.5x for good quality // [cite: 59]
        
        // Create a simple canvas-like object for PDF.js rendering
        const canvas = {
          width: Math.floor(viewport.width),
          height: Math.floor(viewport.height),
          getContext: () => ({
            canvas: { width: Math.floor(viewport.width), height: Math.floor(viewport.height) },
 
            fillStyle: '#FFFFFF', // [cite: 60]
            fillRect: () => {},
            save: () => {},
            restore: () => {},
            translate: () => {},
            scale: () => {},
            transform: 
              () => {}, // [cite: 61]
            setTransform: () => {},
            drawImage: () => {},
            putImageData: () => {},
            getImageData: () => ({ data: new Uint8ClampedArray(Math.floor(viewport.width * viewport.height * 4)) }),
            beginPath: () => {},
            closePath: () => // [cite: 62]
              {},
            moveTo: () => {},
            lineTo: () => {},
            bezierCurveTo: () => {},
            quadraticCurveTo: () => {},
            arc: () => {},
            fill: () => {},
          
            stroke: () => {}, // [cite: 63]
            clip: () => {},
            rect: () => {},
            clearRect: () => {},
            strokeRect: () => {},
            measureText: () => ({ width: 0 }),
            createLinearGradient: () => ({ addColorStop: // [cite: 64]
              () => {} }),
            createRadialGradient: () => ({ addColorStop: () => {} }),
            createPattern: () => null,
          })
        };
        // Render page (this populates the canvas data) // [cite: 65]
        const renderContext = {
          canvasContext: canvas.getContext(),
          viewport: viewport
        };
        await page.render(renderContext).promise; // [cite: 66]
        
        // For now, send page text content to vision AI as a workaround
        // In production, you'd use actual image rendering libraries
        const pageTextContent = await page.getTextContent(); // [cite: 66]
        const pageText = pageTextContent.items.map((item) => item.str).join(' '); // [cite: 67]
        
        // Create a simple text representation for vision analysis
        const textPrompt = `This is page ${pageNum} content:\n\n${pageText}\n\nBased on this text and layout patterns, identify any visual elements (tables, charts, graphs, images, infographics, diagrams) that are referenced or present.`; // [cite: 67]
        console.log(`🤖 Analyzing page ${pageNum} content...`); // [cite: 68]
        
        const visionPrompt = `You are analyzing pharmaceutical document content.
Identify ALL visual elements from the following page content. // [cite: 69]

For each visual element found or referenced, provide:
1. TYPE: table, chart, graph, image, infographic, or diagram
2. TITLE: Extract or infer a descriptive title
3. CAPTION: Extract any caption or description text
4. DESCRIPTION: Detailed description of the visual content
5. DATA: For charts/graphs/tables, extract key data points, values, and insights
6. PURPOSE: What this visual communicates

Return a JSON array:
{
  "visuals": [
    {
      "type": "table|chart|graph|image|infographic|diagram",
      "title": "descriptive title",
      "caption": "caption text if present",
     
      "description": "detailed description", // [cite: 70]
      "data_points": "key data and statistics",
      "purpose": "what this communicates"
    }
  ]
}

If no visual elements are found, return: {"visuals": []}

${textPrompt}`;
        
        const visionResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', { // [cite: 71]
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${lovableApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            
            messages: [ // [cite: 72]
              {
                role: 'user',
                content: visionPrompt
              }
            ],
          }),
        });
        
        if (!visionResponse.ok) { // [cite: 73]
          const errorText = await visionResponse.text();
          console.error(`❌ Vision AI request failed for page ${pageNum}:`, visionResponse.status, errorText); // [cite: 74]
          continue; // [cite: 75]
        }

        try {
          const visionResult = await visionResponse.json(); // [cite: 75]
          const content = visionResult.choices?.[0]?.message?.content; // [cite: 76]
          
          if (content) {
            try {
              const parsed = JSON.parse(content); // [cite: 76]
              if (parsed.visuals && Array.isArray(parsed.visuals) && parsed.visuals.length > 0) { // [cite: 77]
                console.log(`✅ Found ${parsed.visuals.length} visual(s) on page ${pageNum}`); // [cite: 77]
                // Add page number and prepare for database insertion
                parsed.visuals.forEach((visual) => { // [cite: 78]
                  visualAssets.push({
                    brand_id: doc.brand_id,
                    source_document_id: documentId,
             
                    visual_type: visual.type || 'image', // [cite: 79]
                    title: visual.title || `Visual from Page ${pageNum}`,
                    caption: visual.caption || null,
                    source_section: `Page ${pageNum}`,
                   
                    source_page: pageNum, // [cite: 80]
                    visual_data: {
                      description: visual.description,
                      data_points: visual.data_points,
                      purpose: visual.purpose
        
                    }, // [cite: 81]
                    visual_metadata: {
                      extraction_method: 'vision_ai',
                      model: 'google/gemini-2.5-flash',
                     
                      extracted_at: new Date().toISOString() // [cite: 82]
                    },
                    applicable_contexts: [],
                    applicable_asset_types: [],
                    applicable_audiences: [],
              
                    linked_claims: [], // [cite: 83]
                    linked_references: []
                  });
                }); // [cite: 84]
              }
            } catch (parseError) {
              console.error(`❌ Failed to parse vision AI response content for page ${pageNum}:`, parseError); // [cite: 84]
            } // [cite: 85]
          }
        } catch (jsonError) {
          console.error(`❌ Failed to parse vision API JSON response for page ${pageNum}:`, jsonError); // [cite: 86]
        }
        
        // Update progress
        if (pageNum % 5 === 0 || pageNum === pagesToProcess) { // [cite: 86]
          const progress = 60 + Math.floor((pageNum / pagesToProcess) * 20);
          await sendProgress(`Analyzed ${pageNum}/${pagesToProcess} pages for visuals`, progress, 40); // [cite: 87]
        }
        
      } catch (pageError) {
        console.error(`❌ Error processing page ${pageNum}:`, pageError); // [cite: 88]
        // Continue with next page
      }
    }
    
    console.log(`✅ Visual extraction complete: Found ${visualAssets.length} visual assets`); // [cite: 88]
    // Insert visual assets into database
    if (visualAssets.length > 0) { // [cite: 89]
      console.log('💾 Saving visual assets to database...'); // [cite: 90]
      const { data: insertedAssets, error: visualError } = await supabase // [cite: 90]
        .from('visual_assets')
        .insert(visualAssets)
        .select();
      
      if (visualError) { // [cite: 91]
        console.error('❌ Error inserting visual assets:', visualError); // [cite: 92]
      } else {
        console.log(`✅ Saved ${insertedAssets?.length || 0} visual assets`); // [cite: 93]
      }
    }
    
    // Get category-specific parsing prompt
    const prompt = getParsingPrompt(doc.document_category, doc.document_type); // [cite: 93]
    const model = "google/gemini-2.5-flash"; // [cite: 94]
    
    console.log(`🤖 Using ${model} to structure content...`); // [cite: 94]
    // ============================================================
    // Structure the extracted text with AI
    // ============================================================
    await sendProgress('AI is structuring content', 80, 45); // [cite: 95]
    let parsedData; // [cite: 96]
    
    try {
      // Send text to AI for structuring (truncate if too long)
      const maxChars = 80000; // [cite: 97]
      // Safe limit for API // [cite: 97]
      const textToSend = fullText.length > maxChars // [cite: 98]
        ?
          fullText.substring(0, maxChars) + '\n\n[Document truncated due to length]'
        : fullText; // [cite: 99]
      
      const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', { // [cite: 99]
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${lovableApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
   
              role: 'user', // [cite: 100]
              content: prompt + `\n\nExtract and structure the following pharmaceutical document text:\n\n${textToSend}`
            }
          ],
          response_format: { type: 'json_object' },
        }),
      });
      
      if (!aiResponse.ok) { // [cite: 101]
        const errorText = await aiResponse.text();
        console.error(`❌ AI API error:`, aiResponse.status, errorText); // [cite: 102]
        
        if (aiResponse.status === 429) {
          throw new Error('Rate limit exceeded. Please try again in a few moments.'); // [cite: 103]
        }
        if (aiResponse.status === 402) {
          throw new Error('AI credits exhausted. Please add credits to your Lovable workspace.'); // [cite: 104]
        }
        
        throw new Error(`AI structuring failed: ${errorText}`); // [cite: 105]
      }

      const aiData = await aiResponse.json();
      const rawContent = aiData.choices?.[0]?.message?.content; // [cite: 105, 106]
      
      if (!rawContent) {
        throw new Error('No content returned from AI'); // [cite: 107]
      }
      
      parsedData = typeof rawContent === 'string' ? // [cite: 107]
        JSON.parse(rawContent) : rawContent; // [cite: 108]
      
      console.log(`✅ AI structuring complete. Sections found:`, Object.keys(parsedData).length); // [cite: 108]
      
      await sendProgress('Finalizing', 90, 5); // [cite: 109]
    } catch (error) { // [cite: 109]
      console.error(`❌ Error during AI structuring:`, error);
      throw error; // [cite: 110]
    }

    console.log('✅ PDF parsing complete'); // [cite: 110]
    
    // Content is already parsed and structured by AI vision model
    if (!parsedData || typeof parsedData !== 'object') { // [cite: 111]
      throw new Error('No valid content extracted from PDF');
    }


    console.log(`✅ Extraction complete. Sections found:`, Object.keys(parsedData).length); // [cite: 111]
    console.log(`📋 Section keys:`, Object.keys(parsedData));
    const totalContentLength = Object.values(parsedData).filter(v => typeof v === 'string').join('').length; // [cite: 112]
    const processingTime = Date.now() - startTime;
    console.log(`⏱️ Total processing time: ${Math.floor(processingTime/1000)}s`); // [cite: 113]
    console.log(`📊 Structured content length: ${totalContentLength} characters`); // [cite: 113]

    // More lenient validation - pharmaceutical PDFs often have lots of images
    if (totalContentLength < 50 && Object.keys(parsedData).length === 0) { // [cite: 114]
      console.warn('⚠️ Warning: Very little structured content extracted. Document may be image-heavy.');
      throw new Error('Insufficient content extracted. Document may be mostly images or corrupted. Please ensure the document contains extractable text.'); // [cite: 115]
    }

    await sendProgress('Saving results', 90, 3); // [cite: 115]

    // Update document with parsed data
    const { error: updateError } = await supabase
      .from('brand_documents')
      .update({
        parsed_data: parsedData,
        parsing_status: 'completed',
        extraction_metadata: {
          sections_extracted: Object.keys(parsedData).length,
          total_content_length: totalContentLength,
          processing_time_seconds: Math.floor(processingTime / 1000),
 
          extraction_date: new Date().toISOString(), // [cite: 116]
          visual_assets_extracted: visualAssets.length,
          pages_processed_for_visuals: pagesToProcess
        },
        updated_at: new Date().toISOString()
      })
      .eq('id', documentId);
    
    if (updateError) { // [cite: 117]
      console.error('Update error:', updateError);
      throw updateError; // [cite: 118]
    }

    console.log(`Successfully parsed brand document ${documentId}`); // [cite: 118]

    await sendProgress('Complete', 100, 0);
    
    await progressChannel.unsubscribe(); // [cite: 119]
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Brand document parsed successfully',
        data: {
          documentId,
          sections_extracted: Object.keys(parsedData).filter(k => parsedData[k]?.length > 0).length,
          total_content_length: totalContentLength,
          processing_time_seconds: Math.floor((Date.now() - startTime) / 1000),
          visual_assets_extracted: // [cite: 120]
            visualAssets.length
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200, // [cite: 120]
      }
    );
  } catch (error) { // [cite: 121]
    console.error('Parse error:', error);
    
    const errorMessage = error instanceof Error ? // [cite: 122]
      error.message : 'Unknown error occurred';

    if (documentId) { // [cite: 122]
      try {
        const supabaseUrl = Deno.env.get('SUPABASE_URL'); // [cite: 122]
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'); // [cite: 123]
        const supabase = createClient(supabaseUrl, supabaseKey); // [cite: 123]
        
        await supabase
          .from('brand_documents')
          .update({
            parsing_status: 'failed',
            error_message: errorMessage
          })
          .eq('id', documentId); // [cite: 124]
      } catch (updateError) {
        console.error('Failed to update error status:', updateError); // [cite: 125]
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
    ); // [cite: 126]
  }
});