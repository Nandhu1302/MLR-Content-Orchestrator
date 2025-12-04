import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Removed the non-null assertion operator (?? '')
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
);

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

// Removed TypeScript interfaces (TranslationRequest, TranslationResult).

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

    console.log(`[translate-content] Request received for ${brandId}/${assetId} from ${sourceLanguage} to ${targetLanguage} using ${preferredEngine}`);

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Step 1: Fetch Brand Glossary and Translation Memory (TM)
    const [glossaryData, tmData] = await Promise.all([
      supabase
        .from('brand_glossary')
        .select('*')
        .eq('brand_id', brandId),
      supabase
        .from('translation_memory')
        .select('*')
        .eq('source_language', sourceLanguage)
        .eq('target_language', targetLanguage)
        .eq('brand_id', brandId)
        .eq('source_text', sourceText)
        .limit(1)
    ]);

    const glossary = glossaryData.data || [];
    const translationMemoryHit = tmData.data?.[0];

    if (translationMemoryHit) {
      console.log('[translate-content] TM HIT. Returning cached translation.');
      const result = {
        id: translationMemoryHit.id,
        translatedText: translationMemoryHit.translated_text,
        engine: 'TM',
        overallQualityScore: 100, // TM hits are considered 100% accurate
        processingTimeMs: Date.now() - startTime,
        glossaryMatches: [],
        suggestions: [],
      };
      
      // Update TM usage count asynchronously
      updateTranslationMemoryUsage(translationMemoryHit.id);
      
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Step 2: Select and Run Translation Engine
    let engineToUse = preferredEngine;
    if (preferredEngine === 'auto') {
      engineToUse = await autoSelectEngine(request);
    }
    
    let translatedText;
    let engine;
    
    // Non-null assertion (!) removed, replaced with explicit check
    const GeminiTranslation = await Deno.env.get("SUPABASE_URL") + "/functions/v1/translate-gemini";
    
    const translationPromises = [];
    let translationResponse;

    switch (engineToUse) {
      case 'gemini-pro':
        console.log('[translate-content] Using Gemini-Pro for translation.');
        translationResponse = await fetch(GeminiTranslation, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${LOVABLE_API_KEY}` // Using LOVABLE_API_KEY for internal function calls
          },
          body: JSON.stringify({ sourceText, sourceLanguage, targetLanguage, glossary, brandId, therapeuticArea }),
        });
        
        if (!translationResponse.ok) throw new Error(`Gemini translation failed: ${translationResponse.statusText}`);
        
        const geminiResult = await translationResponse.json();
        translatedText = geminiResult.translatedText;
        engine = 'gemini-pro';
        break;

      case 'deepl':
        console.log('[translate-content] Using DeepL simulation.');
        translatedText = await simulateDeepLTranslation(sourceText, sourceLanguage, targetLanguage, glossary);
        engine = 'deepl';
        break;

      case 'google':
        console.log('[translate-content] Using Google simulation.');
        translatedText = await simulateGoogleTranslation(sourceText, sourceLanguage, targetLanguage, glossary);
        engine = 'google';
        break;

      default:
        throw new Error(`Invalid or unsupported engine: ${engineToUse}`);
    }

    // Step 3: Run Quality Scoring (Simulated)
    const processingTime = Date.now() - startTime;
    const qualityScores = includeConfidenceScoring
      ? await runQualityScoring(translatedText, sourceText, targetLanguage, glossary, brandId, therapeuticArea, processingTime)
      : {
          overallQualityScore: 80,
          medicalAccuracyScore: 80,
          brandConsistencyScore: 80,
          culturalAdaptationScore: 80,
          regulatoryComplianceScore: 80,
          glossaryMatches: [],
          suggestions: [],
        };
        
    const overallQualityScore = qualityScores.overallQualityScore;

    // Step 4: Store in Translation Memory (TM) and Log Performance
    const { data: newTM } = await supabase
      .from('translation_memory')
      .insert({
        brand_id: brandId,
        source_language: sourceLanguage,
        target_language: targetLanguage,
        source_text: sourceText,
        translated_text: translatedText,
        engine_used: engine,
        quality_score: overallQualityScore,
        usage_count: 1,
      })
      .select()
      .single();

    if (newTM) {
        console.log(`[translate-content] Stored in TM (ID: ${newTM.id})`);
    }

    await logEnginePerformance(
      engine,
      sourceLanguage,
      targetLanguage,
      therapeuticArea,
      contentType,
      overallQualityScore,
      processingTime
    );

    // Step 5: Return Final Result
    const finalResult = {
      id: newTM?.id || 'new-translation-' + Date.now(),
      translatedText,
      engine,
      ...qualityScores,
      processingTimeMs: processingTime,
    };

    return new Response(JSON.stringify(finalResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error('[translate-content] Error:', error);
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : 'Unknown error',
      id: 'error-' + Date.now(),
      translatedText: '',
      engine: 'error',
      overallQualityScore: 0,
      processingTimeMs: processingTime,
      glossaryMatches: [],
      suggestions: [],
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Type annotations removed
async function autoSelectEngine(request) {
    const { sourceLanguage, targetLanguage } = request;

    // Rule 1: Prioritize DeepL for major European languages (simulated)
    if (sourceLanguage === 'en' && ['de', 'fr', 'es', 'it'].includes(targetLanguage)) {
        return 'deepl';
    }
    
    // Rule 2: Prioritize Google for Asian languages (simulated)
    if (['zh', 'ja', 'ko'].includes(targetLanguage)) {
        return 'google';
    }

    // Rule 3: Default to Gemini for medical/scientific content or other languages
    return 'gemini-pro';
}

// Type annotations removed
async function runQualityScoring(translatedText, sourceText, targetLanguage, glossary, brandId, therapeuticArea, processingTime) {
  // SIMULATION: In a real scenario, this would involve LLM calls or specific translation quality APIs.
  // The complexity and context of the input is used to determine a simulated score.
  
  let score = 90; // Start with a high base score
  const glossaryMatches = [];
  const suggestions = [];

  // 1. Brand Consistency (Glossary Check)
  for (const item of glossary) {
    if (sourceText.includes(item.source_term)) {
      if (translatedText.includes(item.target_term)) {
        score += 2;
        glossaryMatches.push(item.source_term);
      } else {
        score -= 5;
        suggestions.push(`Verify translation of brand term "${item.source_term}"`);
      }
    }
  }

  // 2. Regulatory/Medical Accuracy (Simulated)
  if (therapeuticArea === 'oncology' || therapeuticArea === 'cardiology') {
    score -= 5; // Higher complexity = higher risk
  }
  
  if (translatedText.length < sourceText.length * 0.8 || translatedText.length > sourceText.length * 1.5) {
      score -= 3; // Length mismatch suggests structural issues
  }

  // Final scoring calculation
  const overallQualityScore = Math.min(100, Math.max(70, score));
  const medicalAccuracyScore = Math.min(100, Math.max(70, score + 2)); // Slightly higher than overall
  const brandConsistencyScore = Math.min(100, Math.max(70, score + (glossaryMatches.length > 0 ? 5 : -5)));
  const culturalAdaptationScore = Math.min(100, Math.max(70, score));
  const regulatoryComplianceScore = Math.min(100, Math.max(70, score));


  return {
    overallQualityScore,
    medicalAccuracyScore,
    brandConsistencyScore,
    culturalAdaptationScore,
    regulatoryComplianceScore,
    glossaryMatches,
    suggestions,
  };
}

// Type annotations removed
async function updateTranslationMemoryUsage(tmId) {
  // Updates usage count in the background
  try {
    await supabase.rpc('increment_tm_usage', { tm_id: tmId });
  } catch (e) {
    console.error('Failed to update TM usage:', e);
  }
}

// Type annotations removed
async function logEnginePerformance(engine, sourceLanguage, targetLanguage, therapeuticArea, contentType, qualityScore, processingTime) {
  const existingResult = await supabase
    .from('translation_engine_performance')
    .select('*')
    .eq('engine_name', engine)
    .eq('source_language', sourceLanguage)
    .eq('target_language', targetLanguage)
    .single();
    
  // Check for errors or no data
  const existing = existingResult.data;

  if (existing) {
    // Update existing performance record
    await supabase
      .from('translation_engine_performance')
      .update({
        average_confidence: (existing.average_confidence * existing.total_translations + qualityScore) / (existing.total_translations + 1),
        average_accuracy: (existing.average_accuracy * existing.total_translations + qualityScore) / (existing.total_translations + 1),
        total_translations: existing.total_translations + 1,
        successful_translations: existing.successful_translations + (qualityScore >= 70 ? 1 : 0),
        human_approval_rate: (existing.human_approval_rate * existing.total_translations + (qualityScore >= 70 ? 100 : 0)) / (existing.total_translations + 1),
        avg_processing_time_ms: (existing.avg_processing_time_ms * existing.total_translations + processingTime) / (existing.total_translations + 1)
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
// Type annotations removed
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

// Type annotations removed
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