import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { v4 as uuidv4 } from 'https://deno.land/std@0.168.0/uuid/v4.ts'; // Assuming this import was implicitly used for UUID generation

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper function to check if a string is a valid UUID (since Deno.serve doesn't have a direct helper)
function isValidUUID(str) {
    // Regex for UUID v4
    const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidV4Regex.test(str);
}

// Helper function to filter arrays for valid UUIDs (removed original TS type)
function filterValidUUIDs(arr) {
    if (!Array.isArray(arr)) return [];
    return arr.filter(isValidUUID);
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { documentId } = await req.json();
    
    if (!documentId) {
      throw new Error('documentId is required');
    }

    // Removed the non-null assertion operator (!)
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    
    if (!supabaseUrl || !supabaseKey || !lovableApiKey) {
        throw new Error('Required environment variables (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, LOVABLE_API_KEY) are not configured.');
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('🔬 Starting insight extraction for document:', documentId);

    // Fetch the document
    const { data: doc, error: docError } = await supabase
      .from('brand_documents')
      .select('*')
      .eq('id', documentId)
      .single();

    if (docError || !doc) {
      throw new Error(`Document not found: ${docError?.message}`);
    }

    console.log('📄 Processing:', doc.document_title || doc.drug_name, '| Category:', doc.document_category);

    // Removed 'as any' type assertion
    const parsedData = doc.parsed_data;
    if (!parsedData) {
      throw new Error('No parsed data available');
    }

    // Prepare context
    const documentContext = {
      title: doc.document_title || doc.drug_name,
      category: doc.document_category,
      version: doc.version,
      sections: Object.keys(parsedData)
    };

    // Full document text for AI analysis
    const fullText = Object.entries(parsedData)
      .map(([section, content]) => `## ${section}\n${JSON.stringify(content)}`)
      .join('\n\n');

    console.log('🤖 Invoking AI extraction engine...');

    // Call Lovable AI to extract structured insights
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
            content: `You are a pharmaceutical content expert extracting insights from ${documentContext.category} documents.

CRITICAL INSTRUCTIONS:
- Extract ALL unique references, not just one or two. Look for all study names, trial IDs, and citations throughout the document.
- Extract comprehensive content segments from every major section.
- Be thorough - extract 10+ references and 10+ content segments minimum.

Extract the following structured data:

1. CLINICAL CLAIMS - Factual statements supported by data
   - claim_text: The exact claim statement (be specific and complete)
   - claim_type: MUST be one of: efficacy, safety, dosing, indication, comparative, mechanism (NO OTHER VALUES ALLOWED)
   - source_section: Where in the document this appears
   - statistical_data: Any numbers, percentages, p-values, confidence intervals
   - requires_fair_balance: true if efficacy claim needing ISI
   - requires_isi: true if safety concern requiring ISI mention
   - confidence_score: 0.0-1.0 based on data strength

2. CLINICAL REFERENCES - Extract EVERY unique study, trial, and citation
   - reference_text: Full reference as stated in document
   - study_name: Name/ID of study (e.g., "LIBERTY AD SOLO 1", "Study 301", "NCT123456")
   - authors: Lead authors if mentioned
   - journal: Publication venue if mentioned
   - publication_year: Year if available
   - reference_type: MUST be one of: clinical_trial, real_world_evidence, meta_analysis, regulatory, data_on_file, other (NO OTHER VALUES ALLOWED)
   - formatted_citation: Standardized citation string (if available)

3. CONTENT SEGMENTS - Extract usable paragraphs from EVERY major section
   - segment_text: Complete, standalone paragraph (2-4 sentences minimum)
   - segment_type: MUST be one of: moa, efficacy_summary, safety_summary, dosing_instructions, indication_statement, patient_counseling (NO OTHER VALUES ALLOWED)
   - applicable_asset_types: ["email", "detail_aid", "landing_page", "sales_aid", "presentation"]
   - linked_claims: Array of claim indices (starting from 0) this segment supports
   - linked_references: Array of reference indices (starting from 0) this segment uses

4. SAFETY STATEMENTS
   - statement_text: The complete safety statement
   - statement_type: MUST be one of: contraindication, warning, precaution, adverse_reaction, boxed_warning, drug_interaction (NO OTHER VALUES ALLOWED)
   - severity: MUST be one of: low, moderate, high, critical
   - fda_required: true/false
   - source_section: Where this appears in document

5. VISUAL ASSETS - Extract references to tables, figures, charts
   - visual_type: MUST be one of: table, figure, chart, diagram (NO OTHER VALUES ALLOWED)
   - title: Title of the visual element
   - caption: Caption text
   - source_section: Where this appears in document
   - linked_claims: Array of claim indices this visual supports

EXTRACTION STRATEGY:
- Be comprehensive: Aim for 15-20 claims, 10-30 references, 15-30 segments, and all safety information.

Return as a single JSON object with five arrays: claims, references, segments, safety_statements, visual_assets.`
          },
          {
            role: 'user',
            content: `Document for extraction:
${fullText}`
          }
        ],
        temperature: 0.1
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI gateway error:', aiResponse.status, errorText);
      throw new Error(`AI gateway error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    let extractedContent = aiData.choices[0]?.message?.content;

    if (!extractedContent) {
      throw new Error('No content in AI response');
    }

    console.log('📦 Raw AI response (first 200 chars):', extractedContent.slice(0, 200));

    // Clean markdown code blocks
    extractedContent = extractedContent.trim();
    if (extractedContent.startsWith('```')) {
      const startIndex = extractedContent.indexOf('\n') + 1;
      const endIndex = extractedContent.lastIndexOf('```');
      if (startIndex > 0 && endIndex > startIndex) {
        extractedContent = extractedContent.slice(startIndex, endIndex);
      }
    }
    extractedContent = extractedContent.trim();
    console.log('🧹 Cleaned content (first 200 chars):', extractedContent.slice(0, 200));

    let extracted;
    try {
      extracted = JSON.parse(extractedContent);
    } catch (parseError) {
      console.error('❌ JSON Parse Error:', parseError);
      throw new Error(`Failed to parse AI response: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
    }

    console.log('✅ Extraction complete:', { 
      claims: extracted.claims?.length || 0, 
      references: extracted.references?.length || 0,
      segments: extracted.segments?.length || 0,
      safety: extracted.safety_statements?.length || 0,
      visuals: extracted.visual_assets?.length || 0
    });

    // --- Database Insertion Logic ---

    let insertedClaims = 0;
    let insertedReferences = 0;
    let insertedSegments = 0;
    let insertedSafety = 0;
    let insertedVisualAssets = 0;
    let insertedModules = 0;
    let insertedVariants = 0;

    // Map to store claims/references inserted in this run for linking segments/visuals later
    const claimMap = new Map();
    const referenceMap = new Map();

    // 1. Insert clinical claims and generate content modules
    if (extracted.claims?.length > 0) {
      console.log(`💡 Processing ${extracted.claims.length} claims...`);
      for (const claim of extracted.claims) {
        const claimText = claim.claim_text.trim();
        if (claimText.length === 0) continue;

        const claimToInsert = {
          source_document_id: documentId,
          brand_id: doc.brand_id,
          claim_text: claimText,
          claim_type: claim.claim_type,
          source_section: claim.source_section,
          statistical_data: claim.statistical_data || {},
          requires_fair_balance: claim.requires_fair_balance || false,
          requires_isi: claim.requires_isi || false,
          confidence_score: claim.confidence_score || 0.75
        };

        const { data: insertedClaimData, error: claimError } = await supabase
          .from('clinical_claims')
          .insert(claimToInsert)
          .select('id')
          .single();

        if (claimError) {
          if (claimError.code === '23505') {
            console.log(`Skipped duplicate claim: ${claimText.substring(0, 50)}...`);
            // Attempt to retrieve existing ID for the map
            const { data: existing } = await supabase.from('clinical_claims').select('id').eq('claim_text', claimText).single();
            if (existing) claimMap.set(insertedClaims, existing.id);
          } else {
            console.error('Error inserting claim:', claimError);
          }
        } else if (insertedClaimData) {
          const claimId = insertedClaimData.id;
          claimMap.set(insertedClaims, claimId);
          insertedClaims++;

          // Generate content module variants for the claim
          const variants = [
            { text: claimText.slice(0, 50), length: 'short', type: claim.claim_type === 'efficacy' ? 'efficacy_headline' : 'headline_short', maxLength: 50 },
            { text: claimText.slice(0, 150), length: 'medium', type: claim.claim_type === 'efficacy' ? 'efficacy_summary' : 'mechanism_brief', maxLength: 150 },
            { text: claimText, length: 'long', type: claim.claim_type === 'efficacy' ? 'efficacy_statistical' : 'hcp_technical', maxLength: claimText.length }
          ];

          for (const variant of variants) {
            const moduleToInsert = {
              brand_id: doc.brand_id,
              pi_document_id: documentId,
              module_text: variant.text,
              module_type: variant.type,
              max_length: variant.maxLength,
              linked_claims: [claimId],
            };
            
            const { error: moduleError } = await supabase
              .from('content_modules')
              .insert(moduleToInsert);
            
            if (!moduleError) {
              insertedModules++;
              insertedVariants++;
            } else if (moduleError.code !== '23505') {
               console.error('Error inserting module variant:', moduleError);
            }
          }
        }
        insertedClaims = claimMap.size;
      }
      console.log(`✅ Inserted ${insertedClaims} clinical claims and ${insertedModules} modules`);
    }

    // 2. Insert clinical references
    if (extracted.references?.length > 0) {
      console.log(`📚 Processing ${extracted.references.length} references...`);
      for (const ref of extracted.references) {
        const refText = ref.reference_text.trim();
        if (refText.length === 0) continue;

        // Check if a similar reference already exists
        const { data: existingRef } = await supabase
            .from('clinical_references')
            .select('id')
            .eq('brand_id', doc.brand_id)
            .eq('reference_text', refText)
            .maybeSingle();

        if (existingRef) {
            referenceMap.set(insertedReferences, existingRef.id);
            // Optionally update the existing reference's source_document_id if needed
        } else {
            const refToInsert = {
              brand_id: doc.brand_id,
              source_document_id: documentId,
              reference_text: refText,
              study_name: ref.study_name,
              authors: ref.authors,
              journal: ref.journal,
              publication_year: ref.publication_year,
              reference_type: ref.reference_type || 'clinical_trial',
              formatted_citation: ref.formatted_citation
            };

            const { data: insertedRefData, error: refError } = await supabase
              .from('clinical_references')
              .insert(refToInsert)
              .select('id')
              .single();

            if (!refError && insertedRefData) {
              referenceMap.set(insertedReferences, insertedRefData.id);
              insertedReferences++;
            } else if (refError?.code !== '23505') {
              console.error('Error inserting reference:', refError);
            }
        }
      }
      console.log(`✅ Inserted ${insertedReferences} clinical references`);
    }

    // 3. Insert content segments
    if (extracted.segments?.length > 0) {
      console.log(`📖 Processing ${extracted.segments.length} segments...`);
      for (const segment of extracted.segments) {
        const segmentText = segment.segment_text.trim();
        if (segmentText.length === 0) continue;

        // Map claim/reference indices to actual UUIDs
        const mappedClaims = (segment.linked_claims || [])
          .map(index => claimMap.get(index))
          .filter(id => id);
          
        const mappedReferences = (segment.linked_references || [])
          .map(index => referenceMap.get(index))
          .filter(id => id);

        const segmentToInsert = {
          source_document_id: documentId,
          brand_id: doc.brand_id,
          segment_text: segmentText,
          segment_type: segment.segment_type,
          applicable_asset_types: segment.applicable_asset_types || [],
          word_count: segment.segment_text.split(' ').length,
          linked_claims: mappedClaims,
          linked_references: mappedReferences,
        };

        const { error: segError } = await supabase
          .from('content_segments')
          .insert(segmentToInsert);

        if (!segError) {
          insertedSegments++;
        } else if (segError.code !== '23505') {
          console.error('Error inserting segment:', segError);
        }
      }
      console.log(`✅ Inserted ${insertedSegments} content segments`);
    }

    // 4. Insert safety statements
    if (extracted.safety_statements?.length > 0) {
      console.log(`⚠️ Processing ${extracted.safety_statements.length} safety statements...`);
      const safetyStatementsToInsert = extracted.safety_statements
        .filter(s => s.statement_text.trim().length > 0)
        .map(statement => ({
          source_document_id: documentId,
          brand_id: doc.brand_id,
          statement_text: statement.statement_text.trim(),
          statement_type: statement.statement_type,
          severity: statement.severity,
          fda_required: statement.fda_required || false,
          source_section: statement.source_section
        }));

      const { data: insertedSafetyData, error: safeError } = await supabase
        .from('safety_statements')
        .insert(safetyStatementsToInsert)
        .select('id');

      if (safeError) {
        console.error('Error inserting safety statements:', safeError);
      } else {
        insertedSafety = insertedSafetyData.length;
        console.log(`✅ Successfully inserted ${insertedSafety} safety statements`);
      }
    }

    // 5. Insert visual assets
    if (extracted.visual_assets?.length > 0) {
      console.log(`🖼️ Processing ${extracted.visual_assets.length} visual assets...`);
      const visualAssetsToInsert = extracted.visual_assets
        .filter(v => v.title.trim().length > 0)
        .map(visual => {
            // Map claim indices to actual UUIDs
            const mappedClaims = (visual.linked_claims || [])
                .map(index => claimMap.get(index))
                .filter(id => id);
                
            return {
                source_document_id: documentId,
                brand_id: doc.brand_id,
                visual_type: visual.visual_type,
                title: visual.title,
                caption: visual.caption,
                source_section: visual.source_section,
                linked_claims: mappedClaims
            };
        });

      const { data: insertedVisualData, error: visualError } = await supabase
        .from('visual_assets')
        .insert(visualAssetsToInsert)
        .select('id');

      if (visualError) {
        console.error('Error inserting visual assets:', visualError);
      } else {
        insertedVisualAssets = insertedVisualData.length;
        console.log(`✅ Successfully inserted ${insertedVisualAssets} visual assets`);
      }
    }


    return new Response(
      JSON.stringify({
        success: true,
        message: 'Document insights extracted successfully',
        data: {
          documentId,
          claims: insertedClaims,
          references: insertedReferences,
          segments: insertedSegments,
          safety_statements: insertedSafety,
          content_modules: insertedModules,
          claim_variants: insertedVariants,
          visual_assets: insertedVisualAssets
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const errorStack = error instanceof Error ? error.stack : 'No stack trace';
    
    console.error('❌ CRITICAL ERROR in extract-document-insights');
    console.error('📋 Error message:', errorMessage);
    console.error('📋 Error stack:', errorStack);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
        details: errorStack
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});