
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
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { documentId } = await req.json();
    if (!documentId) {
      throw new Error('documentId is required');
    }

    console.log(`🎨 Starting visual asset extraction for document: ${documentId}`);

    // Fetch document
    const { data: doc, error: docError } = await supabase
      .from('brand_documents')
      .select('*')
      .eq('id', documentId)
      .single();
    if (docError || !doc) {
      throw new Error(`Document not found: ${docError?.message}`);
    }

    console.log(`📄 Processing: ${doc.document_title}`);
    if (!doc.parsed_data) {
      throw new Error('Document has not been parsed yet. Please parse it first.');
    }

    // Extract text from parsed data
    const parsedData = doc.parsed_data;
    const sections = parsedData.sections ?? [];

    // Build text chunks with page references
    const chunkSize = 8000;
    const chunks = [];
    for (const section of sections) {
      if (section.content && section.content.length > 0) {
        const sectionText = section.content.join('\n');
        const startPage = section.page_range?.start ?? 1;
        // Split large sections into chunks
        for (let i = 0; i < sectionText.length; i += chunkSize) {
          const chunk = sectionText.slice(i, Math.min(i + chunkSize, sectionText.length));
          chunks.push({ text: chunk, startPage });
        }
      }
    }
    console.log(`📚 Split into ${chunks.length} chunks for analysis`);

    // Analyze text with AI to identify visual elements
    const visualElements = [];
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      console.log(`🤖 Analyzing chunk ${i + 1}/${chunks.length} (page ~${chunk.startPage})`);
      const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${lovableApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            {
              role: 'system',
              content: `You are analyzing pharmaceutical document text to identify visual elements. Extract information about:
- Figures, diagrams, illustrations
- Tables, charts, graphs
- Infographics
- Any referenced visual content
For each visual element found, extract:
1. Type (table/chart/graph/image/infographic/diagram)
2. Title or figure number
3. Caption or description
4. Page reference if mentioned
Return ONLY valid JSON array format: [{"type": "...", "title": "...", "caption": "...", "page": number}]
If no visual elements found, return empty array: []`
            },
            {
              role: 'user',
              content: `Analyze this pharmaceutical document text and identify all visual elements:\n\n${chunk.text}`,
            }
          ],
          temperature: 0.3,
        }),
      });

      if (!aiResponse.ok) {
        console.error(`AI analysis failed for chunk ${i + 1}: ${aiResponse.status}`);
        if (aiResponse.status === 429) {
          console.log('Rate limited, waiting 2 seconds...');
          await new Promise(resolve => setTimeout(resolve, 2000));
          i--; // Retry this chunk
          continue;
        }
        continue;
      }

      const aiData = await aiResponse.json();
      const content = aiData.choices?.[0]?.message?.content;
      if (content) {
        try {
          // Extract JSON from response (handle markdown code blocks)
          let jsonStr = content.trim();
          if (jsonStr.startsWith('```json')) {
            jsonStr = jsonStr.replace(/```json\n?/g, '').replace(/```\n?$/g, '');
          } else if (jsonStr.startsWith('```')) {
            jsonStr = jsonStr.replace(/```\n?/g, '').replace(/```\n?$/g, '');
          }
          const elements = JSON.parse(jsonStr);
          if (Array.isArray(elements)) {
            for (const elem of elements) {
              visualElements.push({
                ...elem,
                source_page: elem.page ?? chunk.startPage,
                chunk_index: i,
              });
            }
            console.log(` ✅ Found ${elements.length} visual elements in chunk ${i + 1}`);
          }
        } catch (parseError) {
          console.error(`Failed to parse AI response for chunk ${i + 1}:`, parseError);
          console.log('Raw response:', content);
        }
      }

      // Small delay to avoid rate limiting
      if (i < chunks.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    console.log(`🎨 Total visual elements identified: ${visualElements.length}`);

    // Create visual asset records in database
    const createdAssets = [];
    for (const element of visualElements) {
      const visualType = (element.type ?? 'image').toLowerCase();
      const mappedType =
        visualType.includes('table') ? 'table' :
        visualType.includes('chart') ? 'chart' :
        visualType.includes('graph') ? 'graph' :
        visualType.includes('infographic') ? 'infographic' :
        visualType.includes('diagram') ? 'diagram' : 'image';

      const assetData = {
        brand_id: doc.brand_id,
        source_document_id: documentId,
        visual_type: mappedType,
        title: element.title ?? `${mappedType.charAt(0).toUpperCase() + mappedType.slice(1)} from ${doc.document_title}`,
        caption: element.caption ?? null,
        source_page: element.source_page ?? null,
        visual_data: element,
        visual_metadata: {
          extraction_method: 'text_analysis',
          ai_model: 'google/gemini-2.5-flash',
          extracted_at: new Date().toISOString(),
          chunk_index: element.chunk_index,
        },
        applicable_contexts: [],
        applicable_asset_types: ['patient-brochure', 'educational-material'],
        applicable_audiences: ['patient', 'caregiver'],
        linked_claims: [],
        linked_references: [],
        mlr_approved: false,
      };

      const { data: created, error: insertError } = await supabase
        .from('visual_assets')
        .insert(assetData)
        .select()
        .single();
      if (insertError) {
        console.error('Failed to insert visual asset:', insertError);
      } else {
        createdAssets.push(created);
        console.log(` ✅ Created visual asset: ${created.title}`);
      }
    }

    console.log(`✨ Successfully created ${createdAssets.length} visual asset records`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Extracted ${createdAssets.length} visual assets from ${doc.document_title}`,
        documentId,
        documentTitle: doc.document_title,
        totalElements: visualElements.length,
        createdAssets: createdAssets.length,
        assets: createdAssets.map(a => ({
          id: a.id,
          type: a.visual_type,
          title: a.title,
          page: a.source_page,
        })),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in visual asset extraction:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
        details: error instanceof Error ? error.stack : undefined,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
