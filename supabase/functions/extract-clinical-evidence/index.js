import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { piDocumentId } = await req.json();
    
    if (!piDocumentId) {
      throw new Error('piDocumentId is required');
    }

    // Removed the non-null assertion operator (!)
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    
    if (!supabaseUrl || !supabaseKey || !lovableApiKey) {
        throw new Error('Required environment variables (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, LOVABLE_API_KEY) are not configured.');
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('🔬 Starting evidence extraction for PI document:', piDocumentId);

    // Fetch the PI document
    const { data: piDoc, error: piError } = await supabase
      .from('prescribing_information')
      .select('*')
      .eq('id', piDocumentId)
      .single();

    if (piError || !piDoc) {
      throw new Error(`PI document not found: ${piError?.message}`);
    }

    console.log('📄 Processing:', piDoc.drug_name, '| Type:', piDoc.document_type);

    // Removed the 'as any' type assertion
    const parsedData = piDoc.parsed_data;
    if (!parsedData) {
      throw new Error('No parsed data available');
    }

    // Prepare context for AI
    const documentContext = {
      drugName: piDoc.drug_name,
      documentType: piDoc.document_type,
      version: piDoc.version,
      sections: Object.keys(parsedData)
    };

    // Full document text for AI analysis
    const fullText = Object.entries(parsedData)
      .map(([section, content]) => `## ${section}\n${JSON.stringify(content)}`)
      .join('\n\n');

    console.log('🤖 Invoking AI extraction engine...');

    // Call Lovable AI to extract structured evidence
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
            content: `You are a pharmaceutical content expert extracting clinical evidence from ${documentContext.documentType.toUpperCase()} documents.

CRITICAL INSTRUCTIONS:
- Extract ALL unique clinical references, not just one or two. Look for all study names, trial IDs, and citations throughout the document.
- Extract comprehensive content segments from every major section (mechanism, efficacy, safety, dosing, indications, etc.)
- Be thorough - a typical PI document should yield 10+ references and 10+ content segments minimum.

Extract the following structured data:

1. CLINICAL CLAIMS - Factual statements supported by data
   - claim_text: The exact claim statement (be specific and complete)
   - claim_type: efficacy | safety | dosing | indication | comparative | mechanism
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
   - reference_type: clinical_trial | real_world_evidence | meta_analysis | regulatory | other
   IMPORTANT: Extract ALL unique studies mentioned throughout the document, not just 1-2. Look in efficacy sections, safety sections, clinical trials sections, references section.

3. CONTENT SEGMENTS - Extract usable paragraphs from EVERY major section
   - segment_text: Complete, standalone paragraph (2-4 sentences minimum)
   - segment_type: moa | efficacy_summary | safety_summary | dosing_instructions | patient_counseling | indication_statement | clinical_trial_summary | pharmacokinetics | administration
   - applicable_asset_types: ["email", "detail_aid", "landing_page", "sales_aid", "presentation"]
   - word_count: Number of words
   - linked_claims: Array of claim indices this segment supports
   IMPORTANT: Extract segments from mechanism of action, efficacy data, safety data, dosing, administration, patient information, clinical trial results, pharmacokinetics, etc. Aim for 10+ segments minimum.

4. SAFETY STATEMENTS
   - statement_text: The complete safety statement
   - statement_type: contraindication | warning | precaution | adverse_reaction | boxed_warning | drug_interaction
   - severity: low | moderate | high | critical
   - fda_required: true/false
   - source_section: Where this appears in document

EXTRACTION STRATEGY:
- For references: Scan clinical trials sections, study results, efficacy data, safety data, references section
- For segments: Extract from every major section - don't skip mechanism, dosing, or administration sections
- For claims: Look beyond just efficacy - include mechanism claims, dosing claims, safety claims
- Be comprehensive: A typical PI should yield 15-20 claims, 10-30 references, 15-30 segments

Return as JSON with these four arrays: claims, references, segments, safety_statements.`
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

    console.log('Raw AI response (first 200 chars):', extractedContent.slice(0, 200));

    // More robust markdown stripping - handle all variations
    extractedContent = extractedContent.trim();
    // Remove markdown code blocks (multiple patterns)
    if (extractedContent.startsWith('```')) {
      // Find the first newline after opening backticks
      const startIndex = extractedContent.indexOf('\n') + 1;
      // Find the last occurrence of closing backticks
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
      console.error('📄 Content that failed to parse:', extractedContent.slice(0, 500));
      throw new Error(`Failed to parse AI response: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
    }

    console.log('✅ Extraction complete:', { 
      claims: extracted.claims?.length || 0, 
      references: extracted.references?.length || 0,
      segments: extracted.segments?.length || 0,
      safety_statements: extracted.safety_statements?.length || 0
    });

    // --- Database Insertion Logic ---

    let insertedClaims = 0;
    let insertedReferences = 0;
    let insertedSegments = 0;
    let insertedSafety = 0;
    let insertedModules = 0;
    let insertedVariants = 0;
    let skippedDuplicates = 0;

    // Insert clinical claims with duplicate checking
    if (extracted.claims?.length > 0) {
      let claimSkipped = 0;
      for (const claim of extracted.claims) {
        const claimText = claim.claim_text.trim();
        if (claimText.length === 0) continue;

        // Check for existing claim
        const { data: existingClaim } = await supabase
          .from('clinical_claims')
          .select('id')
          .eq('source_document_id', piDocumentId)
          .eq('claim_text', claimText)
          .single();

        if (existingClaim) {
          claimSkipped++;
          continue;
        }

        const claimToInsert = {
          source_document_id: piDocumentId,
          brand_id: piDoc.brand_id,
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
          console.error('Error inserting claim:', claimError);
          // Don't throw, just skip this claim
        } else if (insertedClaimData) {
          insertedClaims++;
          const claimId = insertedClaimData.id;

          // Generate content module variants for the claim
          const variants = [
            { text: claimText.slice(0, 30) + (claimText.length > 30 ? '...' : ''), length: 'short', type: 'headline_short', maxLength: 30 },
            { text: claimText.slice(0, 100) + (claimText.length > 100 ? '...' : ''), length: 'medium', type: claim.claim_type === 'efficacy' ? 'efficacy_summary' : claim.claim_type === 'mechanism' ? 'mechanism_brief' : 'headline_long', maxLength: 100 },
            { text: claimText, length: 'medium', type: claim.claim_type === 'efficacy' ? 'efficacy_statistical' : claim.claim_type === 'mechanism' ? 'mechanism_detailed' : claim.claim_type === 'safety' ? 'safety_summary' : 'hcp_technical', maxLength: claimText.length }
          ];

          for (const variant of variants) {
            const moduleToInsert = {
              brand_id: piDoc.brand_id,
              pi_document_id: piDocumentId,
              module_text: variant.text,
              module_type: variant.type,
              max_length: variant.maxLength,
              linked_claims: [claimId],
              usage_score: 0.1,
              mlr_approved: false,
              reading_level: 'college',
              tone_variant: 'professional',
            };
            
            const { error: moduleError } = await supabase
              .from('content_modules')
              .insert(moduleToInsert);
            
            if (!moduleError) {
              insertedModules++;
              insertedVariants++;
            }
          }
        }
      }
      skippedDuplicates += claimSkipped;
      console.log(`✅ Inserted ${insertedClaims} clinical claims (${claimSkipped} duplicates skipped)`);
      console.log(`✅ Generated ${insertedModules} content modules (variants)`);
    }

    // Insert clinical references with duplicate checking
    if (extracted.references?.length > 0) {
      let refSkipped = 0;
      for (const ref of extracted.references) {
        const refText = ref.reference_text.trim();
        if (refText.length === 0) continue;

        // Check for existing reference based on text
        const { data: existing } = await supabase
          .from('clinical_references')
          .select('id')
          .eq('brand_id', piDoc.brand_id)
          .eq('reference_text', refText)
          .single();

        if (existing) {
          refSkipped++;
          // Optional: link PI document to existing reference
          // await supabase.from('clinical_references').update({ source_pi_document_ids: (existing.source_pi_document_ids || []).concat([piDocumentId]) }).eq('id', existing.id);
          continue;
        }

        const refToInsert = {
          brand_id: piDoc.brand_id,
          source_document_id: piDocumentId,
          reference_text: refText,
          study_name: ref.study_name,
          authors: ref.authors,
          journal: ref.journal,
          publication_year: ref.publication_year,
          reference_type: ref.reference_type || 'clinical_trial'
        };

        const { error: refError } = await supabase
          .from('clinical_references')
          .insert(refToInsert);

        if (refError) {
          if (refError.code === '23505') {
            refSkipped++;
          } else {
            console.error('Error inserting reference:', refError);
          }
        } else {
          insertedReferences++;
        }
      }
      skippedDuplicates += refSkipped;
      console.log(`✅ Inserted ${insertedReferences} clinical references (${refSkipped} duplicates skipped)`);
    }

    // Insert content segments with duplicate checking
    if (extracted.segments?.length > 0) {
      let segSkipped = 0;
      for (const segment of extracted.segments) {
        const segmentText = segment.segment_text.trim();
        if (segmentText.length === 0) continue;

        // Check for existing segment based on text
        const { data: existing } = await supabase
          .from('content_segments')
          .select('id')
          .eq('brand_id', piDoc.brand_id)
          .eq('segment_text', segmentText)
          .single();

        if (existing) {
          segSkipped++;
          continue;
        }

        const segmentToInsert = {
          source_document_id: piDocumentId,
          brand_id: piDoc.brand_id,
          segment_text: segmentText,
          segment_type: segment.segment_type,
          applicable_asset_types: segment.applicable_asset_types || [],
          tone: segment.tone || 'professional',
          reading_level: segment.reading_level || 'college',
          word_count: segment.segment_text.split(' ').length,
          linked_claims: segment.linked_claims || [],
          linked_references: segment.linked_references || [],
          mlr_approved: false
        };

        const { error: segError } = await supabase
          .from('content_segments')
          .insert(segmentToInsert);

        if (!segError) {
          insertedSegments++;
        } else {
          console.error('Error inserting segment:', segError);
        }
      }
      skippedDuplicates += segSkipped;
      console.log(`✅ Inserted ${insertedSegments} content segments (${segSkipped} duplicates skipped)`);
    }

    // Insert safety statements with duplicate checking
    if (extracted.safety_statements?.length > 0) {
      let safeSkipped = 0;
      for (const statement of extracted.safety_statements) {
        const statementText = statement.statement_text.trim();
        if (statementText.length === 0) continue;

        // Check for existing statement based on text
        const { data: existing } = await supabase
          .from('safety_statements')
          .select('id')
          .eq('brand_id', piDoc.brand_id)
          .eq('statement_text', statementText)
          .single();

        if (existing) {
          safeSkipped++;
          continue;
        }

        const statementToInsert = {
          source_document_id: piDocumentId,
          brand_id: piDoc.brand_id,
          statement_text: statementText,
          statement_type: statement.statement_type,
          severity: statement.severity,
          fda_required: statement.fda_required || false,
          source_section: statement.source_section
        };

        const { error: safeError } = await supabase
          .from('safety_statements')
          .insert(statementToInsert);

        if (!safeError) {
          insertedSafety++;
        } else {
          console.error('Error inserting safety statement:', safeError);
        }
      }
      skippedDuplicates += safeSkipped;
      console.log(`✅ Inserted ${insertedSafety} safety statements (${safeSkipped} duplicates skipped)`);
    }

    // --- Quality Check and Final Update (Simplified) ---

    const qualityChecks = [
      { check: 'Minimum claims extracted', passed: insertedClaims >= 15 },
      { check: 'Minimum references extracted', passed: insertedReferences >= 10 },
      { check: 'Minimum segments extracted', passed: insertedSegments >= 15 },
    ];

    const passedChecks = qualityChecks.filter(c => c.passed).length;
    const extractionQuality = Math.round((passedChecks / qualityChecks.length) * 100);

    await supabase
      .from('prescribing_information')
      .update({
        extraction_status: 'completed',
        extraction_summary: {
          claims_count: insertedClaims,
          references_count: insertedReferences,
          segments_count: insertedSegments,
          safety_statements_count: insertedSafety,
          modules_count: insertedModules,
          variants_count: insertedVariants,
          quality_score: extractionQuality,
          ai_model: 'google/gemini-2.5-flash',
          duplicates_prevented: skippedDuplicates
        }
      })
      .eq('id', piDocumentId);

    return new Response(
      JSON.stringify({
        success: true,
        documentId: piDocumentId,
        drugName: piDoc.drug_name,
        documentType: piDoc.document_type,
        extraction: {
          claims: insertedClaims,
          references: insertedReferences,
          segments: insertedSegments,
          safety_statements: insertedSafety,
          modules: insertedModules,
          variants: insertedVariants,
          duplicates_prevented: skippedDuplicates
        },
        quality: {
          score: extractionQuality,
          checks: qualityChecks
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('❌ Extraction error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});