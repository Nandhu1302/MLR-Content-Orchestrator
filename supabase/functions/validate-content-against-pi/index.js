import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Removed all TypeScript interface definitions (ValidationRequest, ValidationResult, etc.)
// The data structures are now defined implicitly by their usage.

/**
 * Builds the AI prompt for content validation.
 * @param {string} content The content to validate.
 * @param {Array<object>} piDocuments The array of Prescribing Information documents.
 * @returns {string} The complete user prompt.
 */
function buildValidationPrompt(content, piDocuments) {
  const piContext = piDocuments.map(doc => 
    `--- PI Document: ${doc.drug_name} v${doc.version} ---\n${doc.parsed_data?.full_text || doc.parsed_data?.indications || 'No text found'}\n`
  ).join('\n\n');

  // Strict JSON Schema instruction (implicitly defining the expected output structure)
  const jsonSchema = {
    overallCompliance: "string", // "compliant", "warning", or "violation"
    complianceScore: "number", // 0-100
    summary: "string",
    issues: [
      {
        type: "string", // "claim_unsupported", "data_mismatch", "contraindication"
        severity: "string", // "critical", "high", "medium", "low"
        location: "string", // Specific part of the content (e.g., "Headline", "Paragraph 2")
        claim: "string",
        issue: "string",
        piReference: "string", // Reference text from the PI document
        suggestion: "string" // Actionable suggestion for correction
      }
    ],
    validatedClaims: [
      {
        claim: "string",
        status: "string", // "verified", "warning", "unverified"
        piSource: "string" // Document ID or name
      }
    ]
  };

  const schemaInstruction = JSON.stringify(jsonSchema, null, 2);

  return `
You are an expert Regulatory and Medical Legal Review (MLR) AI.
Your task is to validate the marketing content below against the provided Prescribing Information (PI) documents.

RULES:
1. All claims MUST be supported by the PI text.
2. Contraindications, warnings, and adverse events must NOT be misrepresented or omitted where contextually relevant.
3. Compare data points strictly (e.g., "5 years" vs. "5-year data").

MARKETING CONTENT TO VALIDATE:
---
${content}
---

PRESCRIPTION INFORMATION CONTEXT:
---
${piContext}
---

INSTRUCTIONS:
1.  Analyze the content against the PI.
2.  Generate a list of 'issues' with appropriate severity and type.
3.  Provide a 'complianceScore' (0-100) and 'overallCompliance' status.
4.  Return ONLY a single JSON object conforming to this schema. DO NOT include any text outside the JSON:

${schemaInstruction}
`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Implicitly treating the request body as the expected ValidationRequest structure
    const { content, linkedPIIds, assetId, brandId } = await req.json();
    
    if (!content || !linkedPIIds || !assetId || !brandId) {
      throw new Error("Missing required fields: content, linkedPIIds, assetId, or brandId");
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // ===============================================
    // 1. Fetch PI Documents
    // ===============================================

    console.log(`Fetching PI documents for IDs: ${linkedPIIds.join(', ')}`);
    const { data: piDocuments, error: fetchError } = await supabase
      .from('prescribing_information')
      .select('id, drug_name, version, parsed_data')
      .in('id', linkedPIIds);

    if (fetchError) {
      throw fetchError;
    }
    if (!piDocuments || piDocuments.length === 0) {
      throw new Error(`Could not find Prescribing Information for IDs: ${linkedPIIds.join(', ')}`);
    }

    // ===============================================
    // 2. Build Prompt and Call AI
    // ===============================================

    const userPrompt = buildValidationPrompt(content, piDocuments);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are an expert MLR validation engine. Return only valid JSON." },
          { role: "user", content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`AI API error (${response.status}):`, errorText);
      throw new Error(`AI validation error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const rawContent = aiResponse.choices?.[0]?.message?.content;
    
    if (!rawContent) {
      throw new Error('AI response content was empty.');
    }

    let validationResult;
    try {
      // The AI is instructed to return only JSON, attempt to parse the content directly.
      validationResult = JSON.parse(rawContent);
    } catch (e) {
      console.error('Failed to parse AI response as JSON:', e);
      throw new Error(`Failed to parse AI validation response: ${e.message}. Raw response: ${rawContent.substring(0, 500)}`);
    }

    // ===============================================
    // 3. Store Validation Results
    // ===============================================

    // Insert the full validation result into the validation history table
    const { error: insertError } = await supabase
      .from('content_validation_history')
      .insert({
        asset_id: assetId,
        validation_type: "pi_compliance",
        validation_data: {
          pi_documents: piDocuments.map(d => ({ id: d.id, drug_name: d.drug_name, version: d.version })),
          result: validationResult,
          content_snapshot: content.substring(0, 500),
          validated_at: new Date().toISOString()
        },
        overall_status: validationResult.overallCompliance,
        compliance_score: validationResult.complianceScore,
        issues_count: validationResult.issues.length
      });

    if (insertError) {
      console.error("Failed to store validation results:", insertError);
      // Continue anyway - don't fail the request just because storage failed
    }

    console.log("Validation complete:", {
      compliance: validationResult.overallCompliance,
      score: validationResult.complianceScore,
      issuesCount: validationResult.issues.length
    });

    // ===============================================
    // 4. Return Final Response
    // ===============================================
    
    return new Response(
      JSON.stringify({
        success: true,
        result: validationResult
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Validation error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred"
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});