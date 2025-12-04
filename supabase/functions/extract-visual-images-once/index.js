
// visual-image-generation.js (CommonJS)
const express = require('express');
const fetch = require('node-fetch'); // Remove if runtime provides global fetch
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(express.json());

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

app.options('/generate-visual-images', (req, res) => {
  res.set(corsHeaders).status(204).end();
});

app.post('/generate-visual-images', async (req, res) => {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const lovableApiKey = process.env.LOVABLE_API_KEY;

    if (!supabaseUrl || !supabaseKey || !lovableApiKey) {
      return res
        .set({ ...corsHeaders, 'Content-Type': 'application/json' })
        .status(500)
        .json({ success: false, error: 'Missing required environment variables.' });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { documentId } = req.body;

    if (!documentId) {
      throw new Error('documentId is required');
    }

    console.log(`🎨 Starting visual image generation for document: ${documentId}`);

    const { data: doc, error: docError } = await supabase
      .from('brand_documents')
      .select('*')
      .eq('id', documentId)
      .single();

    if (docError) throw docError;
    if (!doc) throw new Error('Document not found');

    console.log(`📄 Processing: ${doc.document_title}`);

    const { data: existingAssets, error: assetsError } = await supabase
      .from('visual_assets')
      .select('*')
      .eq('source_document_id', documentId)
      .order('source_page', { ascending: true });

    if (assetsError) throw assetsError;
    if (!existingAssets || existingAssets.length === 0) {
      throw new Error('No visual assets found for this document. Please run extract-visual-assets-once first.');
    }

    console.log(`📊 Found ${existingAssets.length} visual asset records to generate`);

    const updatedAssets = [];
    let successCount = 0;

    for (const asset of existingAssets) {
      try {
        console.log(`🎨 Generating: ${asset.title ?? 'Untitled'} (${asset.visual_type})`);

        const prompt = `Create a professional medical/pharmaceutical ${asset.visual_type} visualization.
Title: ${asset.title ?? 'Medical Visualization'}
${asset.caption ? `Description: ${asset.caption}` : ''}
Type: ${asset.visual_type}
Requirements:
- Clean, professional medical/healthcare design
- Clear and easy to read
- Appropriate for pharmaceutical documentation
- ${asset.visual_type === 'table' ? 'Structured tabular format with clear rows and columns' : ''}
- ${asset.visual_type === 'chart' || asset.visual_type === 'graph' ? 'Clear data visualization with labels and legend' : ''}
- ${asset.visual_type === 'diagram' ? 'Clear diagram with labeled components' : ''}
- ${asset.visual_type === 'infographic' ? 'Informative infographic layout' : ''}
- Use professional colors suitable for medical/pharmaceutical context
- High contrast for readability
- Include relevant labels and annotations`;

        console.log(` 📝 Prompt created (${prompt.length} chars)`);

        const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${lovableApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash-image-preview',
            messages: [{ role: 'user', content: prompt }],
            modalities: ['image', 'text'],
          }),
        });

        if (!aiResponse.ok) {
          const errorText = await aiResponse.text();
          console.error(`❌ AI image generation failed for asset ${asset.id}: ${aiResponse.status} - ${errorText}`);
          continue;
        }

        const aiResult = await aiResponse.json();
        const imageData = aiResult.choices?.[0]?.message?.images?.[0]?.image_url?.url;

        if (!imageData) {
          console.error(`❌ No image data returned for asset ${asset.id}`);
          continue;
        }

        console.log(` ✓ Image generated`);

        const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
        const binaryData = Buffer.from(base64Data, 'base64');

        const fileName = `${asset.visual_type}-page-${asset.source_page}-${asset.id.slice(0, 8)}.png`;
        const storagePath = `${doc.brand_id}/${documentId}/${fileName}`;

        console.log(` 📤 Uploading to: ${storagePath}`);

        const { error: uploadError } = await supabase.storage
          .from('visual-assets')
          .upload(storagePath, binaryData, {
            contentType: 'image/png',
            upsert: true,
          });

        if (uploadError) {
          console.error(`❌ Failed to upload ${storagePath}:`, uploadError);
          continue;
        }

        successCount++;
        console.log(` ✓ Uploaded successfully`);

        const { data: updated, error: updateError } = await supabase
          .from('visual_assets')
          .update({
            storage_path: storagePath,
            visual_metadata: {
              ...asset.visual_metadata,
              width: 1024,
              height: 768,
              format: 'png',
              extraction_method: 'ai_generated',
              generated_at: new Date().toISOString(),
              generation_model: 'google/gemini-2.5-flash-image-preview',
            },
            updated_at: new Date().toISOString(),
          })
          .eq('id', asset.id)
          .select()
          .single();

        if (updateError) {
          console.error(`❌ Failed to update visual asset ${asset.id}:`, updateError);
        } else {
          updatedAssets.push(updated);
          console.log(` ✅ Updated record for: ${asset.title ?? 'Untitled'}`);
        }

        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (assetError) {
        console.error(`❌ Error processing asset ${asset.id}:`, assetError);
      }
    }

    console.log(`✅ Generation complete: ${successCount} images created, ${updatedAssets.length} records updated`);

    return res
      .set({ ...corsHeaders, 'Content-Type': 'application/json' })
      .status(200)
      .json({
        success: true,
        message: `Generated ${successCount} visual images using AI`,
        stats: {
          totalAssets: existingAssets.length,
          imagesGenerated: successCount,
          recordsUpdated: updatedAssets.length,
          failed: existingAssets.length - successCount,
        },
        updatedAssets: updatedAssets.map((a) => ({
          id: a.id,
          title: a.title,
          type: a.visual_type,
          page: a.source_page,
          storagePath: a.storage_path,
        })),
      });
  } catch (error) {
    console.error('❌ Visual generation error:', error);
    return res
      .set({ ...corsHeaders, 'Content-Type': 'application/json' })
      .status(500)
      .json({
        success: false,
        error: error?.message ?? 'Unknown error',
      });
  }
});


