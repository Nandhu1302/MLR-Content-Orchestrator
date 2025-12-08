import { serve } from "https://deno.land/std@0.168.0/http/server.js";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Removed ValidationRequest interface

// Removed ValidationResult interface

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");

    if (!supabaseUrl || !supabaseKey || !lovableApiKey) {
      throw new Error("Missing required environment variables");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { content, linkedPIIds, assetId, brandId } = await req.json(); // Type annotation removed here

    console.log("Validating content against PI documents:", { assetId, piCount: linkedPIIds?.length });

    if (!linkedPIIds || linkedPIIds.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          result: {
            overallCompliance: "warning",
            issues: [{
              type: "missing_context",
              severity: "medium",
              location: "general",
              claim: "No PI documents linked",
              issue: "Cannot validate claims without linked Prescribing Information",
              suggestion: "Link relevant PI documents to enable automated validation"
            }],
            validatedClaims: [],
            complianceScore: 50,
            summary: "No PI documents linked for validation"
          }
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch PI documents and their parsed data
    const { data: piDocuments, error: piError } = await supabase
      .from("prescribing_information")
      .select("id, drug_name, version, parsed_data")
      .in("id", linkedPIIds)
      .eq("parsing_status", "completed");

    if (piError) throw piError;

    if (!piDocuments || piDocuments.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          result: {
            overallCompliance: "warning",
            issues: [{
              type: "missing_context",
              severity: "high",
              location: "general",
              claim: "Linked PI documents not available",
              issue: "PI documents are still being parsed or failed to parse",
              suggestion: "Wait for PI parsing to complete or re-upload documents"
            }],
            validatedClaims: [],
            complianceScore: 30,
            summary: "PI documents are not ready for validation"
          }
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Loaded ${piDocuments.length} PI documents for validation`);

    // Prepare PI context for AI validation
    const piContext = piDocuments.map(doc => ({
      drug_name: doc.drug_name,
      version: doc.version,
      data: doc.parsed_data
    }));

    // Use Lovable AI to perform intelligent validation
    const validationPrompt = `You are a pharmaceutical regulatory compliance expert. Your task is to validate marketing content against Prescribing Information (PI) documents.
 
CONTENT TO VALIDATE:
${content}
 
PRESCRIBING INFORMATION DATA:
${JSON.stringify(piContext, null, 2)}
 
VALIDATION REQUIREMENTS:
1. Check all clinical claims against PI data
2. Verify efficacy data matches PI exactly
3. Ensure safety information is complete and accurate
4. Validate that indications are correctly stated
5. Check for any contraindications or warnings mentioned
6. Verify dosage information if present
7. Ensure no off-label claims or unapproved uses
 
For each issue found, provide:
- type: claim_unsupported | data_mismatch | missing_context | inaccurate_claim | contraindication
- severity: critical | high | medium | low
- location: where in content the issue appears
- claim: the specific claim being made
- issue: what's wrong with it
- piReference: relevant section from PI (if applicable)
- suggestion: how to fix it
 
Also identify claims that ARE properly supported by the PI.
 
Return your analysis in this JSON format (no markdown, just raw JSON):
{
  "overallCompliance": "compliant" | "warning" | "violation",
  "issues": [...],
  "validatedClaims": [...],
  "complianceScore": 0-100,
  "summary": "brief overall assessment"
}`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are a pharmaceutical compliance validation expert. Always respond with valid JSON only." },
          { role: "user", content: validationPrompt }
        ],
        temperature: 0.3,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI validation failed:", aiResponse.status, errorText);
      throw new Error(`AI validation failed: ${errorText}`);
    }

    const aiResult = await aiResponse.json();
    const aiContent = aiResult.choices[0]?.message?.content;

    if (!aiContent) {
      throw new Error("No content in AI response");
    }

    // Parse AI response
    let validationResult; // Type annotation removed here
    try {
      // Remove markdown code blocks if present
      const cleanedContent = aiContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      validationResult = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error("Failed to parse AI response:", aiContent);
      throw new Error("Failed to parse validation results");
    }

    // Store validation results in database
    const { error: insertError } = await supabase
      .from("content_validation_results")
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
      // Continue anyway - don't fail the request
    }

    console.log("Validation complete:", {
      compliance: validationResult.overallCompliance,
      score: validationResult.complianceScore,
      issuesCount: validationResult.issues.length
    });

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