
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
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
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

    console.log('📄 Processing:', piDoc.drug_name, '\n Type:', piDoc.document_type);
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
            content: `Extract clinical evidence from this ${documentContext.documentType.toUpperCase()} document for ${documentContext.drugName}.
CRITICAL: Process the ENTIRE document. Extract ALL clinical trials, ALL references from all sections, ALL content segments from every major section.
Document content:
${fullText}`
          }
        ],
        temperature: 0.3,
        response_format: { type: "json_object" }
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API Error:', aiResponse.status, errorText);
      throw new Error(`AI extraction failed: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    let extractedContent = aiData.choices[0].message.content;
    console.log('📦 Raw AI response (first 200 chars):', extractedContent.slice(0, 200));

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
      claims: extracted.claims?.length ?? 0,
      references: extracted.references?.length ?? 0,
      segments: extracted.segments?.length ?? 0,
      safety_statements: extracted.safety_statements?.length ?? 0
    });

    // Insert extracted data into database using UPSERT to prevent duplicates
    let insertedClaims = 0;
    let insertedReferences = 0;
    let insertedSegments = 0;
    let insertedSafety = 0;
    let skippedDuplicates = 0;

    // Insert clinical claims with duplicate checking
    if (extracted.claims?.length > 0) {
      const claimsToInsert = extracted.claims.map((claim) => ({
        source_document_id: piDocumentId,
        brand_id: piDoc.brand_id,
        claim_text: claim.claim_text,
        claim_type: claim.claim_type,
        therapeutic_context: claim.therapeutic_context ?? null,
        source_section: claim.source_section,
        source_page: claim.source_page ?? null,
        statistical_data: claim.statistical_data ?? {},
        target_audience: claim.target_audience ?? [],
        requires_fair_balance: claim.requires_fair_balance ?? false,
        requires_isi: claim.requires_isi ?? false,
        confidence_score: claim.confidence_score ?? 0.80,
        regulatory_status: 'approved',
        review_status: 'pending'
      }));

      // Insert claims one by one to handle duplicates gracefully
      for (const claim of claimsToInsert) {
        const { error: claimError } = await supabase
          .from('clinical_claims')
          .insert(claim);
        if (claimError) {
          if (claimError.code === '23505') { // Unique constraint violation
            skippedDuplicates++;
            console.log('⏭️ Skipped duplicate claim:', claim.claim_text.substring(0, 50));
          } else {
            console.error('Error inserting claim:', claimError);
          }
        } else {
          insertedClaims++;
        }
      }
      console.log(`✅ Inserted ${insertedClaims} clinical claims (${skippedDuplicates} duplicates skipped)`);

      // Insert references with duplicate checking
      if (extracted.references?.length > 0) {
        let refSkipped = 0;
        for (const ref of extracted.references) {
          const refToInsert = {
            claim_id: null,
            source_document_id: piDocumentId,
            brand_id: piDoc.brand_id,
            reference_text: ref.reference_text,
            study_name: ref.study_name ?? null,
            authors: ref.authors ?? null,
            journal: ref.journal ?? null,
            publication_year: ref.publication_year ?? null,
            doi: ref.doi ?? null,
            pubmed_id: ref.pubmed_id ?? null,
            formatted_citation: ref.formatted_citation ?? ref.reference_text,
            reference_type: ref.reference_type ?? 'clinical_trial'
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
        console.log(`✅ Inserted ${insertedReferences} clinical references (${refSkipped} duplicates skipped)`);
      }
    }

    // Insert content segments with duplicate checking
    if (extracted.segments?.length > 0) {
      let segSkipped = 0;
      for (const segment of extracted.segments) {
        const segmentToInsert = {
          source_document_id: piDocumentId,
          brand_id: piDoc.brand_id,
          segment_text: segment.segment_text,
          segment_type: segment.segment_type,
          applicable_asset_types: segment.applicable_asset_types ?? [],
          tone: segment.tone ?? 'professional',
          reading_level: segment.reading_level ?? 'college',
          word_count: segment.segment_text.split(' ').length,
          linked_claims: segment.linked_claims ?? [],
          linked_references: segment.linked_references ?? [],
          mlr_approved: false
        };
        const { error: segError } = await supabase
          .from('content_segments')
          .insert(segmentToInsert);
        if (segError) {
          if (segError.code === '23505') {
            segSkipped++;
          } else {
            console.error('Error inserting segment:', segError);
          }
        } else {
          insertedSegments++;
        }
      }
      console.log(`✅ Inserted ${insertedSegments} content segments (${segSkipped} duplicates skipped)`);
    }

    // Insert safety statements with duplicate checking (only for ISI docs)
    if (piDoc.document_type === 'isi' && extracted.safety_statements?.length > 0) {
      let safetySkipped = 0;
      for (const safety of extracted.safety_statements) {
        const safetyToInsert = {
          source_document_id: piDocumentId,
          brand_id: piDoc.brand_id,
          statement_text: safety.statement_text,
          statement_type: safety.statement_type,
          severity: safety.severity ?? 'moderate',
          fda_required: safety.fda_required !== false,
          placement_rule: safety.placement_rule ?? null,
          applicable_channels: safety.applicable_channels ?? [],
          linked_claims: safety.linked_claims ?? []
        };
        const { error: safetyError } = await supabase
          .from('safety_statements')
          .insert(safetyToInsert);
        if (safetyError) {
          if (safetyError.code === '23505') {
            safetySkipped++;
          } else {
            console.error('Error inserting safety statement:', safetyError);
          }
        } else {
          insertedSafety++;
        }
      }
      console.log(`✅ Inserted ${insertedSafety} safety statements (${safetySkipped} duplicates skipped)`);
    }

    // Phase 1-2: Generate Content Modules and Claim Variants
    console.log('🔄 Generating content modules and claim variants...');
    let insertedModules = 0;
    let insertedVariants = 0;

    // Generate content modules from extracted claims
    if (insertedClaims > 0 && extracted.claims?.length > 0) {
      let moduleSkipped = 0;
      for (const claim of extracted.claims) {
        const claimText = claim.claim_text;
        // Generate different length variants
        const variants = [
          {
            text: claimText.substring(0, 50).trim() + (claimText.length > 50 ? '...' : ''),
            length: 'brief',
            type: claim.claim_type === 'efficacy' ? 'efficacy_summary' :
                  claim.claim_type === 'mechanism' ? 'mechanism_brief' :
                  claim.claim_type === 'indication' ? 'indication_brief' : 'headline_short',
            maxLength: 50
          },
          {
            text: claimText.substring(0, 100).trim() + (claimText.length > 100 ? '...' : ''),
            length: 'short',
            type: claim.claim_type === 'efficacy' ? 'efficacy_summary' :
                  claim.claim_type === 'mechanism' ? 'mechanism_brief' : 'headline_long',
            maxLength: 100
          },
          {
            text: claimText,
            length: 'medium',
            type: claim.claim_type === 'efficacy' ? 'efficacy_statistical' :
                  claim.claim_type === 'mechanism' ? 'mechanism_detailed' :
                  claim.claim_type === 'safety' ? 'safety_summary' : 'hcp_technical',
            maxLength: claimText.length
          }
        ];
        for (const variant of variants) {
          const moduleToInsert = {
            brand_id: piDoc.brand_id,
            pi_document_id: piDocumentId,
            module_text: variant.text,
            module_type: variant.type,
            length_variant: variant.length,
            tone_variant: 'clinical',
            character_limit_max: variant.maxLength,
            linked_claims: [],
            linked_references: [],
            mlr_approved: false,
            usage_score: 0.0
          };
          const { error: moduleError } = await supabase
            .from('content_modules')
            .insert(moduleToInsert);
          if (moduleError) {
            if (moduleError.code === '23505') {
              moduleSkipped++;
            } else {
              console.error('Error inserting content module:', moduleError);
            }
          } else {
            insertedModules++;
          }
        }
      }
      console.log(`✅ Generated ${insertedModules} content modules (${moduleSkipped} duplicates skipped)`);

      // Generate claim variants for each inserted claim
      const { data: insertedClaimsWithIds } = await supabase
        .from('clinical_claims')
        .select('id, claim_text, claim_type')
        .eq('source_document_id', piDocumentId);
      if (insertedClaimsWithIds && insertedClaimsWithIds.length > 0) {
        let variantSkipped = 0;
        for (const claim of insertedClaimsWithIds) {
          const baseText = claim.claim_text;
          // Generate 3 variants per claim
          const variantsToCreate = [
            {
              parent_claim_id: claim.id,
              variant_text: baseText,
              variant_type: 'clinical',
              max_character_length: baseText.length,
              suitable_for_channels: ['detail_aid', 'website', 'patient_brochure'],
              mlr_approved: false
            },
            {
              parent_claim_id: claim.id,
              variant_text: baseText.substring(0, 80).trim() + (baseText.length > 80 ? '...' : ''),
              variant_type: 'headline',
              max_character_length: 80,
              suitable_for_channels: ['email', 'social_post', 'banner_ad'],
              mlr_approved: false
            },
            {
              parent_claim_id: claim.id,
              variant_text: baseText.replace(/\s*\([^\)]*\)/g, ''),
              variant_type: 'patient_friendly',
              max_character_length: baseText.length,
              suitable_for_channels: ['patient_brochure', 'website'],
              mlr_approved: false
            }
          ];
          for (const variant of variantsToCreate) {
            const { error: variantError } = await supabase
              .from('claim_variants')
              .insert(variant);
            if (variantError) {
              if (variantError.code === '23505') {
                variantSkipped++;
              } else {
                console.error('Error inserting claim variant:', variantError);
              }
            } else {
              insertedVariants++;
            }
          }
        }
        console.log(`✅ Generated ${insertedVariants} claim variants (${variantSkipped} duplicates skipped)`);
      }
    }

    // Validate extraction quality
    const qualityChecks = {
      minClaims: 10,
      minReferences: 5,
      minSegments: 10,
      passedClaims: insertedClaims >= 10,
      passedReferences: insertedReferences >= 5,
      passedSegments: insertedSegments >= 10
    };
    const extractionQuality = [
      qualityChecks.passedClaims,
      qualityChecks.passedReferences,
      qualityChecks.passedSegments
    ].filter(Boolean).length / 3;
    console.log('📊 Extraction Quality:', Math.round(extractionQuality * 100) + '%', qualityChecks);

    // Update PI document with extraction metadata
    await supabase
      .from('prescribing_information')
      .update({
        extraction_metadata: {
          extracted_at: new Date().toISOString(),
          claims_count: insertedClaims,
          references_count: insertedReferences,
          segments_count: insertedSegments,
          safety_statements_count: insertedSafety,
          modules_count: insertedModules,
          variants_count: insertedVariants,
          quality_score: extractionQuality,
          ai_model: 'gemini-2.5-flash',
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
