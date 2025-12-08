
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
    const { documentId } = await req.json();
    if (!documentId) {
      throw new Error('documentId is required');
    }
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
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
    console.log('📄 Processing:', doc.document_title ?? doc.drug_name, '\n Category:', doc.document_category);

    const parsedData = doc.parsed_data;
    if (!parsedData) {
      throw new Error('No parsed data available');
    }

    // Prepare context
    const documentContext = {
      title: doc.document_title ?? doc.drug_name,
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
 IMPORTANT: These documents often contain INTERNAL CLINICAL STUDY REFERENCES (not published articles)
 For INTERNAL STUDY REFERENCES (like "Study 1844", "CSR-104934"):
 - Set reference_type to "data_on_file"
 - Extract study identifier as data_on_file_id (e.g., "Study-1844")
 - Create formatted_citation like: "Data on File. Study 1844. [Company]."
 - Leave doi, pubmed_id, authors, journal as null
 - ALWAYS extract source_page, source_section, relevant_location
 For PUBLISHED ARTICLES:
 - Extract authors, journal, DOI, PubMed ID when available
 - Follow format: Authors. Title. Journal. Year;Volume(Issue):Pages. DOI
 - Example: "Smith J, Johnson K. Efficacy of Treatment X. N Engl J Med. 2023;389(12):1105-1116."
 CRITICAL: Extract ALL these fields for EVERY reference:
 - study_name: Name/ID of study (e.g., "Study 1844", "Trial 1489a", "NCT02607930") - REQUIRED
 - reference_text: The EXACT raw reference text as it appears (verbatim)
 - formatted_citation: A PROPERLY FORMATTED citation (academic or Data on File format)
 - data_on_file_id: Internal study ID if unpublished (e.g., "Study-1844", "CSR-104934")
 * Look for phrases like "Data on File", "Study XXXX", "CSR", "Clinical Study Report"
 * Set to null ONLY if this is a published external reference with journal/DOI
 - relevant_location: WHERE the supporting data appears - CRITICAL for MLR
 * Examples: "Page 805, Table 2", "Section 14.2, Figure 3", "Appendix B"
 * ALWAYS include page numbers, table/figure numbers, section identifiers
 - reference_type: clinical_trial | real_world_evidence | meta_analysis | data_on_file
 - source_section: Section where reference appears (e.g., "clinical_studies", "efficacy")
 - source_page: Page number where reference found
 - authors: Lead authors (e.g., "Smith J, Johnson K, et al") - OPTIONAL for published only
 - journal: Full journal name - OPTIONAL for published only
 - publication_year: Year as integer - extract from any date mention
 - doi: DOI identifier without "doi:" prefix - OPTIONAL if present
 - pubmed_id: PubMed ID if mentioned - OPTIONAL if present
 - source_page: Page number in the source document where this reference appears - EXTRACT IF VISIBLE
3. CONTENT SEGMENTS - Extract usable paragraphs from EVERY major section
 - segment_text: Complete, standalone paragraph (2-4 sentences minimum)
 - segment_type: MUST be ONLY ONE of these exact values (NO OTHER VALUES ALLOWED):
 * moa (mechanism of action)
 * efficacy_summary
 * safety_summary
 * dosing_instructions
 * patient_counseling
 * indication_statement
 - applicable_asset_types: ["email", "detail_aid", "landing_page", "sales_aid", "presentation"]
 - word_count: Number of words
 - linked_claims: Array of claim indices this segment supports
 CRITICAL VALIDATION: segment_type must be one of the 6 values above. Do NOT use "administration", "monitoring", "pharmacokinetics", "clinical_trial_summary" or any other values.
4. SAFETY STATEMENTS - Extract ALL safety-related information
 CRITICAL: Extract from Warnings, Precautions, Contraindications, Adverse Reactions, Drug Interactions, Special Populations sections
 - statement_text: The complete safety statement or warning (be specific and complete)
 - statement_type: MUST be EXACTLY one of these values (NO OTHER VALUES ALLOWED):
 * "contraindication" - absolute or relative contraindications
 * "warning" - important warnings and serious risks
 * "precaution" - precautions requiring monitoring or consideration
 * "adverse_reaction" - adverse events and side effects
 * "boxed_warning" - FDA black box warnings
 MAPPING RULES:
 * Drug interactions → use "precaution" (or "warning" if severe/life-threatening)
 * Special populations (pregnancy, pediatric, renal, hepatic) → use "precaution"
 * Do NOT use "drug_interaction" or "special_population" - these are invalid
 - severity: MUST be EXACTLY one of: "critical", "high", "moderate", "low"
 * critical: Life-threatening, boxed warnings, absolute contraindications
 * high: Serious adverse reactions, significant drug interactions requiring dose changes
 * moderate: Important warnings requiring monitoring or caution
 * low: Minor precautions or considerations
 - required_context: Any additional context needed (e.g., "in patients with renal impairment")
 - source_section: Section where found (e.g., "WARNINGS AND PRECAUTIONS", "CONTRAINDICATIONS")
 - source_page: Page number where statement appears (if visible)
 - fda_required: true if FDA-mandated language (e.g., boxed warnings), false otherwise
 - placement_rule: Where must appear - "header", "footer", "inline", "prominent", or "any"
 - applicable_channels: Array of channels requiring this - ["email", "detail_aid", "sales_aid", "website", "social_media"] or ["all"]
 - linked_claims: Array of claim indices this safety statement relates to
 Extract safety statements for:
 - Boxed warnings (BLACK BOX) → severity: "critical", fda_required: true
 - Contraindications (absolute and relative) → severity: "critical" or "high"
 - Serious adverse reactions → severity: "high"
 - Common adverse reactions → severity: "moderate" or "low"
 - Drug-drug interactions → severity varies by impact
 - Special population warnings (pregnancy, pediatric, renal/hepatic impairment) → severity varies
 - Precautions and monitoring requirements → severity: "moderate"
 Be thorough - extract ALL distinct safety statements from the document.
5. VISUAL ASSETS - Extract references to tables, charts, graphs, and figures
 CRITICAL: Look for references to visual elements throughout the document:
 - Tables (e.g., "Table 1", "Table 2: Efficacy Results")
 - Figures (e.g., "Figure 1", "Figure 3: Kaplan-Meier Survival Curves")
 - Charts and graphs mentioned in text
 - Infographics or diagrams described
 For each visual asset:
 - visual_type: MUST be ONE of: "table", "chart", "graph", "image", "infographic", "diagram"
 - title: The title or caption of the visual (e.g., "Table 2: Efficacy Results")
 - caption: Full caption text if available
 - source_section: Section where visual appears
 - source_page: Page number (CRITICAL - extract if visible)
 - visual_metadata: Object containing:
 * description: Brief description of what the visual shows
 FOR TABLES - Extract structured data:
 * headers: Array of column headers (e.g., ["Parameter", "Treatment A", "Treatment B", "P-value"])
 * rows: Array of arrays representing table rows (e.g., [["Response Rate", "45%", "32%", "0.003"], ["Median Duration", "8.2 months", "5.4 months", "0.012"]])
 * Extract at least 3-5 representative rows if table is large
 * footnotes: Any footnotes or asterisks mentioned
 FOR CHARTS/GRAPHS - Extract descriptive data:
 * data_points: Key data points or findings shown
 * footnotes: Any footnotes or asterisks mentioned
 - applicable_contexts: Array of contexts ["efficacy_data", "safety_data", "dosing_info", etc.]
 - applicable_asset_types: Array of asset types where this would be useful
 - applicable_audiences: Array of target audiences ["hcp", "patient", "payer"]
 - linked_claims: Array of claim indices this visual supports
 - linked_references: Array of reference indices this visual is from
 Extract information about tables showing:
 - Efficacy data and clinical trial results
 - Safety and adverse event frequencies
 - Dosing schedules and titration tables
 - Pharmacokinetic/pharmacodynamic parameters
 - Patient demographics from studies
 Extract information about charts/graphs showing:
 - Survival curves (Kaplan-Meier)
 - Response rates over time
 - Dose-response relationships
 - Comparative efficacy visualizations
Return as JSON with these five arrays: claims, references, segments, safety_statements, visual_assets.`
          },
          {
            role: 'user',
            content: `Extract insights from this ${documentContext.category} document: ${documentContext.title}.
CRITICAL: Process the ENTIRE document. Extract ALL references from all sections, ALL content segments from every major section.
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
      console.error('📄 Content that failed to parse:', extractedContent.slice(0, 500));
      throw new Error(`Failed to parse AI response: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
    }

    console.log('✅ Extraction complete:', {
      claims: extracted.claims?.length ?? 0,
      references: extracted.references?.length ?? 0,
      segments: extracted.segments?.length ?? 0,
      safety_statements: extracted.safety_statements?.length ?? 0,
      visual_assets: extracted.visual_assets?.length ?? 0
    });

    // Insert extracted data
    let insertedClaims = 0;
    let insertedReferences = 0;
    let insertedSegments = 0;
    let insertedSafety = 0;
    let insertedVisualAssets = 0;

    // Helper function to validate UUID
    const isValidUUID = (uuid) => {
      const uuidRegex = /^\[0-9a-f\]{8}-\[0-9a-f\]{4}-\[0-9a-f\]{4}-\[0-9a-f\]{4}-\[0-9a-f\]{12}$/i;
      return typeof uuid === 'string' && uuidRegex.test(uuid);
    };

    // Helper function to filter valid UUIDs from array
    const filterValidUUIDs = (arr) => {
      if (!Array.isArray(arr)) return [];
      return arr.filter(item => typeof item === 'string' && isValidUUID(item));
    };

    // Valid claim types from database constraint
    const VALID_CLAIM_TYPES = ['efficacy', 'safety', 'dosing', 'indication', 'comparative', 'mechanism'];

    // Insert clinical claims
    if (extracted.claims?.length > 0) {
      const claimsToInsert = extracted.claims
        .filter((claim) => {
          // Validate claim_type
          if (!VALID_CLAIM_TYPES.includes(claim.claim_type)) {
            console.warn(`⚠️ Skipping claim with invalid type: "${claim.claim_type}". Valid types:`, VALID_CLAIM_TYPES);
            return false;
          }
          return true;
        })
        .map((claim) => ({
          source_document_id: documentId,
          brand_id: doc.brand_id,
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

      console.log(`📝 Attempting to upsert ${claimsToInsert.length} claims...`);
      const { data: insertedClaimsData, error: claimsError } = await supabase
        .from('clinical_claims')
        .upsert(claimsToInsert, {
          onConflict: 'brand_id,claim_text',
          ignoreDuplicates: false
        })
        .select('id, claim_text');

      if (claimsError) {
        console.error('❌ Error upserting claims:', claimsError);
        console.error('Failed claims data:', JSON.stringify(claimsToInsert, null, 2));
      } else {
        insertedClaims = insertedClaimsData.length;
        console.log('✅ Upserted', insertedClaims, 'clinical claims');

        // Upsert references (update existing or insert new)
        if (extracted.references?.length > 0) {
          console.log(`📚 Processing ${extracted.references.length} references...`);
          const referencesToUpsert = extracted.references.map((ref) => {
            // For internal references without formatted_citation, create Data on File format
            let formattedCitation = ref.formatted_citation;
            if (!formattedCitation && ref.data_on_file_id) {
              formattedCitation = `Data on File. ${ref.study_name ?? ref.data_on_file_id}.`;
            }
            return {
              claim_id: null,
              source_document_id: documentId,
              brand_id: doc.brand_id,
              reference_text: ref.reference_text,
              study_name: ref.study_name ?? null,
              authors: ref.authors ?? null,
              journal: ref.journal ?? null,
              publication_year: ref.publication_year ?? null,
              doi: ref.doi ?? null,
              pubmed_id: ref.pubmed_id ?? null,
              data_on_file_id: ref.data_on_file_id ?? null,
              relevant_location: ref.relevant_location ?? null,
              formatted_citation: formattedCitation ?? ref.reference_text,
              reference_type: ref.reference_type ?? (ref.data_on_file_id ? 'data_on_file' : 'clinical_trial'),
              source_section: ref.source_section ?? null,
              source_page: ref.source_page ?? null
            };
          });

          console.log('📋 Sample reference data:', JSON.stringify(referencesToUpsert[0], null, 2));
          const { data: upsertedRefsData, error: refsError } = await supabase
            .from('clinical_references')
            .upsert(referencesToUpsert, {
              onConflict: 'brand_id,source_document_id,reference_text',
              ignoreDuplicates: false
            })
            .select('id');

          if (refsError) {
            console.error('❌ Error upserting references:', refsError);
            console.error('Failed references sample:', JSON.stringify(referencesToUpsert.slice(0, 2), null, 2));
          } else {
            insertedReferences = upsertedRefsData.length;
            console.log(`✅ Upserted ${insertedReferences} references`);
            console.log('📋 Sample upserted reference:', JSON.stringify(referencesToUpsert[0], null, 2));
          }
        }
      }
    }

    // Insert content segments
    if (extracted.segments?.length > 0) {
      const segmentsToInsert = extracted.segments.map((segment) => {
        // Filter out invalid UUIDs from linked arrays
        const validLinkedClaims = filterValidUUIDs(segment.linked_claims ?? []);
        const validLinkedReferences = filterValidUUIDs(segment.linked_references ?? []);
        if (validLinkedClaims.length !== (segment.linked_claims ?? []).length) {
          console.warn(`⚠️ Filtered invalid claim UUIDs for segment. Original: ${segment.linked_claims?.length ?? 0}, Valid: ${validLinkedClaims.length}`);
        }
        if (validLinkedReferences.length !== (segment.linked_references ?? []).length) {
          console.warn(`⚠️ Filtered invalid reference UUIDs for segment. Original: ${segment.linked_references?.length ?? 0}, Valid: ${validLinkedReferences.length}`);
        }
        return {
          source_document_id: documentId,
          brand_id: doc.brand_id,
          segment_text: segment.segment_text,
          segment_type: segment.segment_type,
          applicable_asset_types: segment.applicable_asset_types ?? [],
          tone: segment.tone ?? 'professional',
          reading_level: segment.reading_level ?? 'college',
          word_count: segment.segment_text.split(' ').length,
          linked_claims: validLinkedClaims,
          linked_references: validLinkedReferences,
          mlr_approved: false
        };
      });

      console.log(`📝 Attempting to insert ${segmentsToInsert.length} content segments...`);
      const { data: insertedSegmentsData, error: segmentsError } = await supabase
        .from('content_segments')
        .insert(segmentsToInsert)
        .select('id');

      if (segmentsError) {
        console.error('❌ Error inserting segments:', segmentsError);
        console.error('Failed segments data:', JSON.stringify(segmentsToInsert.slice(0, 2), null, 2));
      } else {
        insertedSegments = insertedSegmentsData.length;
        console.log('✅ Inserted', insertedSegments, 'content segments');
      }
    }

    // Insert safety statements from all documents (not just safety-information category)
    console.log('🔍 DEBUG: Extracted object keys:', Object.keys(extracted));
    console.log('🔍 DEBUG: Safety statements array:', JSON.stringify(extracted.safety_statements?.slice(0, 2), null, 2));
    console.log('🔍 DEBUG: Safety statements count:', extracted.safety_statements?.length ?? 0);

    if (extracted.safety_statements?.length > 0) {
      console.log(`📝 Attempting to insert ${extracted.safety_statements.length} safety statements...`);
      // Valid types according to database schema
      const validStatementTypes = ['contraindication', 'warning', 'precaution', 'adverse_reaction', 'boxed_warning'];
      const validSeverities = ['critical', 'high', 'moderate', 'low'];

      const safetyToInsert = extracted.safety_statements.map((safety) => {
        // Filter out invalid UUIDs from linked_claims
        const validLinkedClaims = filterValidUUIDs(safety.linked_claims ?? []);
        if (validLinkedClaims.length !== (safety.linked_claims ?? []).length) {
          console.warn(`⚠️ Filtered invalid claim UUIDs for safety statement. Original: ${safety.linked_claims?.length ?? 0}, Valid: ${validLinkedClaims.length}`);
        }

        // Validate and correct statement_type
        let statementType = safety.statement_type;
        if (!validStatementTypes.includes(statementType)) {
          const original = statementType;
          // Map invalid types to valid ones
          if (statementType === 'drug_interaction') {
            statementType = (safety.severity === 'critical' || safety.severity === 'high') ? 'warning' : 'precaution';
          } else if (statementType === 'special_population') {
            statementType = 'precaution';
          } else {
            statementType = 'precaution'; // Default fallback
          }
          console.log(`🔧 Corrected invalid statement_type: "${original}" → "${statementType}"`);
        }

        // Validate and correct severity
        let severity = safety.severity ?? 'moderate';
        if (!validSeverities.includes(severity)) {
          const original = severity;
          severity = (severity === 'info') ? 'low' : 'moderate'; // Map 'info' to 'low'
          console.log(`🔧 Corrected invalid severity: "${original}" → "${severity}"`);
        }

        return {
          source_document_id: documentId,
          brand_id: doc.brand_id,
          statement_text: safety.statement_text,
          statement_type: statementType,
          severity: severity,
          fda_required: safety.fda_required !== false,
          placement_rule: safety.placement_rule ?? null,
          applicable_channels: safety.applicable_channels ?? [],
          linked_claims: validLinkedClaims
        };
      });

      console.log(`📝 Attempting to insert ${safetyToInsert.length} safety statements...`);
      const { data: insertedSafetyData, error: safetyError } = await supabase
        .from('safety_statements')
        .insert(safetyToInsert)
        .select('id');

      if (safetyError) {
        console.error('❌ Error inserting safety statements:', safetyError);
        console.error('Failed safety data:', JSON.stringify(safetyToInsert, null, 2));
      } else {
        insertedSafety = insertedSafetyData.length;
        console.log(`✅ Successfully inserted ${insertedSafety} safety statements`);
        console.log('📊 Safety statement types:', insertedSafetyData.map((s) => s.statement_type).join(', '));
      }
    }

    // Generate content modules and claim variants
    console.log('🔄 Generating content modules and claim variants...');
    let insertedModules = 0;
    let insertedVariants = 0;

    if (insertedClaims > 0 && extracted.claims?.length > 0) {
      const modulesToInsert = [];
      for (const claim of extracted.claims) {
        const claimText = claim.claim_text;
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
          modulesToInsert.push({
            brand_id: doc.brand_id,
            pi_document_id: documentId,
            module_text: variant.text,
            module_type: variant.type,
            length_variant: variant.length,
            tone_variant: 'clinical',
            character_limit_max: variant.maxLength,
            linked_claims: [],
            linked_references: [],
            mlr_approved: false,
            usage_score: 0.0
          });
        }
      }

      if (modulesToInsert.length > 0) {
        const { data: insertedModulesData, error: modulesError } = await supabase
          .from('content_modules')
          .insert(modulesToInsert)
          .select('id');
        if (modulesError) {
          console.error('Error inserting content modules:', modulesError);
        } else {
          insertedModules = insertedModulesData.length;
          console.log('✅ Generated', insertedModules, 'content modules');
        }
      }

      // Generate claim variants
      const { data: insertedClaimsWithIds } = await supabase
        .from('clinical_claims')
        .select('id, claim_text, claim_type, brand_id')
        .eq('source_document_id', documentId);

      if (insertedClaimsWithIds && insertedClaimsWithIds.length > 0) {
        const variantsToInsert = [];
        for (const claim of insertedClaimsWithIds) {
          const baseText = claim.claim_text;
          variantsToInsert.push(
            {
              parent_claim_id: claim.id,
              brand_id: claim.brand_id,
              variant_text: baseText,
              variant_type: 'clinical',
              max_character_length: baseText.length,
              suitable_for_channels: ['detail_aid', 'website', 'patient_brochure'],
              mlr_approved: false
            },
            {
              parent_claim_id: claim.id,
              brand_id: claim.brand_id,
              variant_text: baseText.substring(0, 80).trim() + (baseText.length > 80 ? '...' : ''),
              variant_type: 'headline',
              max_character_length: 80,
              suitable_for_channels: ['email', 'social_post', 'banner_ad'],
              mlr_approved: false
            },
            {
              parent_claim_id: claim.id,
              brand_id: claim.brand_id,
              variant_text: baseText.replace(/\s*\([^\)]*\)/g, ''),
              variant_type: 'patient_friendly',
              max_character_length: baseText.length,
              suitable_for_channels: ['patient_brochure', 'website'],
              mlr_approved: false
            }
          );
        }

        if (variantsToInsert.length > 0) {
          const { data: insertedVariantsData, error: variantsError } = await supabase
            .from('claim_variants')
            .insert(variantsToInsert)
            .select('id');
          if (variantsError) {
            console.error('Error inserting claim variants:', variantsError);
          } else {
            insertedVariants = insertedVariantsData.length;
            console.log('✅ Generated', insertedVariants, 'claim variants');
          }
        }
      }
    }

    // Insert visual assets
    if (extracted.visual_assets?.length > 0) {
      console.log(`🖼️ Processing ${extracted.visual_assets.length} visual assets...`);
      const validVisualTypes = ['table', 'chart', 'graph', 'image', 'infographic', 'diagram'];
      const visualAssetsToInsert = extracted.visual_assets
        .filter((visual) => {
          if (!validVisualTypes.includes(visual.visual_type)) {
            console.warn(`⚠️ Skipping visual with invalid type: "${visual.visual_type}"`);
            return false;
          }
          return true;
        })
        .map((visual) => {
          // Filter valid UUIDs for linked claims and references
          const validLinkedClaims = filterValidUUIDs(visual.linked_claims ?? []);
          const validLinkedReferences = filterValidUUIDs(visual.linked_references ?? []);
          return {
            brand_id: doc.brand_id,
            source_document_id: documentId,
            visual_type: visual.visual_type,
            title: visual.title ?? null,
            caption: visual.caption ?? null,
            source_section: visual.source_section ?? null,
            source_page: visual.source_page ?? null,
            visual_data: visual.visual_metadata ?? {},
            visual_metadata: {
              description: visual.visual_metadata?.description ?? null,
              data_points: visual.visual_metadata?.data_points ?? null,
              columns: visual.visual_metadata?.columns ?? null,
              footnotes: visual.visual_metadata?.footnotes ?? null
            },
            applicable_contexts: visual.applicable_contexts ?? [],
            applicable_asset_types: visual.applicable_asset_types ?? [],
            applicable_audiences: visual.applicable_audiences ?? [],
            linked_claims: validLinkedClaims,
            linked_references: validLinkedReferences,
            storage_path: null,
            mlr_approved: false
          };
        });

      if (visualAssetsToInsert.length > 0) {
        const { data: insertedVisualData, error: visualError } = await supabase
          .from('visual_assets')
          .insert(visualAssetsToInsert)
          .select('id');
        if (visualError) {
          console.error('❌ Error inserting visual assets:', visualError);
          console.error('Failed visual data:', JSON.stringify(visualAssetsToInsert.slice(0, 2), null, 2));
        } else {
          insertedVisualAssets = insertedVisualData.length;
          console.log(`✅ Successfully inserted ${insertedVisualAssets} visual assets`);
        }
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
    console.error('📋 Full error:', JSON.stringify(error, null, 2));
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
