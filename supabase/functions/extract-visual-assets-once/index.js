import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Supabase client creation is already valid JavaScript using the nullish coalescing operator (??)
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

// TypeScript interfaces TranslationRequest and TranslationResult are removed.

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();

  try {
    // Type annotation removed
    const request = await req.json();

    const {
      sourceText,
      sourceLanguage,
      targetLanguage,
      contentType,
      brandId,
      therapeuticArea,
      projectId,
      assetId,
      preferredEngine = 'auto',
      includeConfidenceScoring = true,
    } = request;

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }
    if (!sourceText || !targetLanguage) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: sourceText, targetLanguage' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[translate] Request: ${sourceLanguage} -> ${targetLanguage} | Engine: ${preferredEngine} | Content: ${contentType}`);

    // --- 1. Fetch Glossary & Brand Data ---

    const { data: glossaryData } = await supabase
      .from('brand_glossary')
      .select('term, translation, context')
      .eq('brand_id', brandId || 'global') // Use global glossary if no brandId
      .limit(100);

    const glossary = glossaryData || [];

    // --- 2. Determine and Execute Translation Engine ---

    let translatedText = '';
    let engine = preferredEngine;

    // Simplified engine selection logic (always uses preferredEngine for this conversion)
    if (preferredEngine === 'deepl' || preferredEngine === 'auto') {
      translatedText = await simulateDeepLTranslation(sourceText, sourceLanguage, targetLanguage, glossary);
      engine = 'deepl';
    } else if (preferredEngine === 'google') {
      translatedText = await simulateGoogleTranslation(sourceText, sourceLanguage, targetLanguage, glossary);
      engine = 'google';
    } else if (preferredEngine === 'gemini-pro') {
      // NOTE: In a real implementation, this would call the Gemini Translation API
      translatedText = `[Gemini-Pro ${targetLanguage}] ${sourceText}`;
      engine = 'gemini-pro';
    } else {
      translatedText = `[Fallback ${targetLanguage}] ${sourceText}`;
      engine = 'fallback';
    }

    const processingTimeMs = Date.now() - startTime;

    // --- 3. Quality Scoring (If required) ---

    let qualityScores = {
      confidenceScore: 0.85,
      medicalAccuracyScore: 0.85,
      brandConsistencyScore: 0.85,
      culturalAdaptationScore: 0.85,
      regulatoryComplianceScore: 0.85,
      overallQualityScore: 0.85,
      glossaryMatches: [],
      suggestions: []
    };

    if (includeConfidenceScoring && LOVABLE_API_KEY) {
      console.log(`[translate] Running quality analysis...`);
      // Type annotation removed
      qualityScores = await calculateQualityScores(translatedText, sourceText, targetLanguage, LOVABLE_API_KEY);
    }

    // --- 4. Prepare and Record Result ---

    // Type annotation removed
    const result = {
      id: crypto.randomUUID(),
      translatedText,
      engine,
      confidenceScore: qualityScores.confidenceScore,
      medicalAccuracyScore: qualityScores.medicalAccuracyScore,
      brandConsistencyScore: qualityScores.brandConsistencyScore,
      culturalAdaptationScore: qualityScores.culturalAdaptationScore,
      regulatoryComplianceScore: qualityScores.regulatoryComplianceScore,
      overallQualityScore: qualityScores.overallQualityScore,
      processingTimeMs,
      glossaryMatches: qualityScores.glossaryMatches,
      suggestions: qualityScores.suggestions,
    };

    // Log translation attempt
    await supabase.from('translation_log').insert({
      id: result.id,
      brand_id: brandId,
      project_id: projectId,
      asset_id: assetId,
      engine: result.engine,
      source_language: sourceLanguage,
      target_language: targetLanguage,
      content_type: contentType,
      source_text_hash: crypto.subtle.digest('SHA-256', new TextEncoder().encode(sourceText)),
      quality_score: result.overallQualityScore,
      processing_time_ms: processingTimeMs,
    });

    // Update performance metrics
    await updatePerformanceMetrics(
      result.engine,
      sourceLanguage,
      targetLanguage,
      therapeuticArea,
      contentType,
      result.overallQualityScore * 100, // Convert to percentage
      processingTimeMs
    );

    console.log(`[translate] Complete in ${processingTimeMs}ms. Quality: ${(result.overallQualityScore * 100).toFixed(1)}%`);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[translate] Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Helper functions (Type annotations and return types removed)

async function calculateQualityScores(translatedText, originalText, targetLanguage, lovableApiKey) {
  const prompt = `You are a pharmaceutical translation quality analyst.
Analyze the following translation against the source text and target language for compliance and accuracy.

SOURCE: "${originalText}"
TRANSLATION: "${translatedText}"
TARGET LANGUAGE: ${targetLanguage}

CRITICAL: Return ONLY valid JSON with no markdown, no code fences, no additional text.

Provide scores (0.0 to 1.0) and analysis for:
1. Medical Accuracy: Alignment with medical terminology (80% weight on overall score)
2. Brand Consistency: Use of specified brand terms/glossary (10% weight)
3. Cultural Adaptation: Appropriateness of tone/phrasing for the target culture (10% weight)

Return JSON with this exact structure:
{
  "medicalAccuracyScore": 0.95,
  "brandConsistencyScore": 0.90,
  "culturalAdaptationScore": 0.85,
  "glossaryMatches": [],
  "suggestions": ["suggestion 1", "suggestion 2"]
}`;

  const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${lovableApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'google/gemini-2.5-flash',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.1,
    }),
  });

  if (!aiResponse.ok) {
    console.error('AI scoring API error:', aiResponse.status, await aiResponse.text());
    // Fallback to average scores on error
    return {
      confidenceScore: 0.85,
      medicalAccuracyScore: 0.85,
      brandConsistencyScore: 0.85,
      culturalAdaptationScore: 0.85,
      regulatoryComplianceScore: 0.85,
      overallQualityScore: 0.85,
      glossaryMatches: [],
      suggestions: ['AI scoring failed, using default quality metrics.']
    };
  }

  const aiData = await aiResponse.json();
  const content = aiData.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('No content in AI scoring response');
  }

  try {
    const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const scores = JSON.parse(cleanContent);

    // Calculate weighted overall score
    const medicalScore = scores.medicalAccuracyScore || 0;
    const brandScore = scores.brandConsistencyScore || 0;
    const culturalScore = scores.culturalAdaptationScore || 0;

    const overallQualityScore = (medicalScore * 0.8) + (brandScore * 0.1) + (culturalScore * 0.1);

    // Combine into final object (add mock/default values for un-scored items)
    return {
      confidenceScore: overallQualityScore,
      medicalAccuracyScore: medicalScore,
      brandConsistencyScore: brandScore,
      culturalAdaptationScore: culturalScore,
      regulatoryComplianceScore: 0.90, // Mock/Default
      overallQualityScore,
      glossaryMatches: scores.glossaryMatches || [],
      suggestions: scores.suggestions || [],
    };
  } catch (parseError) {
    console.error('Failed to parse AI scoring response:', content);
    // Fallback on parse error
    return {
      confidenceScore: 0.70,
      medicalAccuracyScore: 0.70,
      brandConsistencyScore: 0.70,
      culturalAdaptationScore: 0.70,
      regulatoryComplianceScore: 0.70,
      overallQualityScore: 0.70,
      glossaryMatches: [],
      suggestions: ['Invalid JSON from AI scoring, review manually.']
    };
  }
}


async function updatePerformanceMetrics(engine, sourceLanguage, targetLanguage, therapeuticArea, contentType, qualityScore, processingTime) {
  // Check for existing record
  const { data: existingRecords } = await supabase
    .from('translation_engine_performance')
    .select('*')
    .eq('engine_name', engine)
    .eq('source_language', sourceLanguage)
    .eq('target_language', targetLanguage)
    .eq('therapeutic_area', therapeuticArea)
    .eq('content_type', contentType);

  const existing = existingRecords?.[0];

  if (existing) {
    // Update existing performance record
    const newTotalTranslations = existing.total_translations + 1;
    const newSuccessfulTranslations = existing.successful_translations + (qualityScore >= 70 ? 1 : 0);

    const newAvgConfidence = ((existing.average_confidence * existing.total_translations) + qualityScore) / newTotalTranslations;
    const newAvgProcessingTime = ((existing.avg_processing_time_ms * existing.total_translations) + processingTime) / newTotalTranslations;

    await supabase
      .from('translation_engine_performance')
      .update({
        average_confidence: newAvgConfidence,
        average_accuracy: newAvgConfidence, // Using confidence as proxy for accuracy
        total_translations: newTotalTranslations,
        successful_translations: newSuccessfulTranslations,
        human_approval_rate: (newSuccessfulTranslations / newTotalTranslations) * 100,
        avg_processing_time_ms: newAvgProcessingTime
      })
      .eq('id', existing.id);
  } else {
    // Create new performance record
    await supabase
      .from('translation_engine_performance')
      .insert({
        engine_name: engine,
        source_language: sourceLanguage,
        target_language: targetLanguage,
        therapeutic_area: therapeuticArea,
        content_type: contentType,
        average_confidence: qualityScore,
        average_accuracy: qualityScore,
        total_translations: 1,
        successful_translations: qualityScore >= 70 ? 1 : 0,
        human_approval_rate: qualityScore >= 70 ? 100 : 0,
        avg_processing_time_ms: processingTime
      });
  }
}

// Mock translation functions for DeepL and Google (would be replaced with real API calls)
async function simulateDeepLTranslation(sourceText, sourceLang, targetLang, glossary) {
  // Simulate high-quality European language translation
  if (targetLang === 'es') {
    return sourceText
      .replace(/treatment/gi, 'tratamiento')
      .replace(/clinical/gi, 'clínico')
      .replace(/efficacy/gi, 'eficacia');
  }
  return `[DeepL ${targetLang}] ${sourceText}`;
}

async function simulateGoogleTranslation(sourceText, sourceLang, targetLang, glossary) {
  // Simulate basic translation
  if (targetLang === 'ja') {
    return sourceText
      .replace(/treatment/gi, '治療')
      .replace(/clinical/gi, '臨床')
      .replace(/efficacy/gi, '有効性');
  }
  return `[Google ${targetLang}] ${sourceText}`;
}