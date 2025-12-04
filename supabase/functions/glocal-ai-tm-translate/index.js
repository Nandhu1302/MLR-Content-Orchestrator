
// glocal-ai-tm-translate.js (Node.js / ESM)
// Env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, LOVABLE_API_KEY
// Deps: npm i express node-fetch @supabase/supabase-js
// Run: node glocal-ai-tm-translate.js

import express from 'express';
import fetch from 'node-fetch';
import { createClient } from '@supabase/supabase-js';

const app = express();
app.use(express.json());

// ---- CORS (same as original) ----
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Preflight (OPTIONS)
app.options('/', (req, res) => {
  res.set(corsHeaders).status(204).end();
});

// ---- Main handler (POST) ----
app.post('/', async (req, res) => {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const lovableApiKey = process.env.LOVABLE_API_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase environment variables not configured');
    }
    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Request payload (same shape as the TypeScript interface)
    const {
      sourceText,
      sourceLanguage,
      targetLanguage,
      therapeuticArea,
      useTMLeverage,
      projectId,
      segmentId,
    } = req.body || {};

    console.log('Translation request:', {
      sourceText,
      sourceLanguage,
      targetLanguage,
      useTMLeverage,
    });

    let translatedText = '';
    let wordLevelBreakdown = [];
    let tmMatches = [];
    let reviewFlags = [];

    // ---- Step 1: Query TM matches if leverage is enabled ----
    if (useTMLeverage && projectId) {
      const { data: tmData, error: tmError } = await supabase
        .from('glocal_tm_intelligence')
        .select('*')
        .eq('project_id', projectId)
        .eq('source_language', sourceLanguage)
        .eq('target_language', targetLanguage)
        .gte('match_score', 70)
        .order('match_score', { ascending: false })
        .limit(10);

      if (!tmError && tmData) {
        tmMatches = tmData.map((tm) => ({
          id: tm.id,
          source_text: tm.tm_source_text,
          target_text: tm.tm_target_text,
          match_score: tm.match_score,
          match_type: tm.match_type,
          therapeutic_area: tm.therapeutic_area ?? '',
          last_used_at: tm.last_used_at ?? '',
        }));
        console.log(`Found ${tmMatches.length} TM matches`);
      }
    }

    // ---- Step 2: Build AI prompt with TM context (critical format) ----
    let systemPrompt =
      'You are a medical translation expert specializing in pharmaceutical and healthcare content.';
    if (therapeuticArea) {
      systemPrompt += ` Focus on ${therapeuticArea} terminology.`;
    }
    systemPrompt += `

CRITICAL FORMAT - You MUST follow this exact structure in your response:
**1. Translated Text:**
[ONLY the clean translated text here - no explanations, no notes, no analysis, no asterisks]
---
**2. Word-level Breakdown:**
[Your detailed word-by-word analysis here]
**3. Quality Scores:**
[Your quality scores here]
**4. Regulatory Risks:**
[Your regulatory risk assessment here]`;

    if (useTMLeverage && tmMatches.length > 0) {
      systemPrompt += `
Translation Memory Context:
You have access to previous translations. Use these guidelines:
- For EXACT matches (≥95%): Use the TM translation exactly as is
- For FUZZY matches (70-94%): Adapt carefully and flag for human review
- For NEW content: Translate maintaining medical accuracy and brand consistency

Available TM matches:`;
      tmMatches.forEach((tm, idx) => {
        systemPrompt += `\n${idx + 1}. Source: "${tm.source_text}" → Target: "${tm.target_text}" (${tm.match_score}% match, ${tm.match_type})`;
      });
      systemPrompt += `

In section 2, explain which parts came from TM (exact/fuzzy/new).`;
    }

    // ---- Step 3: Call Lovable AI for translation ----
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          {
            role: 'user',
            content: `Translate this text from ${sourceLanguage} to ${targetLanguage}:

"${sourceText}"

Provide:
1. The translated text
2. Word-level breakdown indicating which words are exact TM matches, fuzzy matches, or newly translated
3. Quality scores (medical accuracy, brand consistency, cultural fit)
4. Any regulatory risks identified`,
          },
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI Gateway error:', aiResponse.status, errorText);

      if (aiResponse.status === 429) {
        return res
          .set({ ...corsHeaders, 'Content-Type': 'application/json' })
          .status(429)
          .json({ error: 'Rate limit exceeded. Please try again later.' });
      }
      if (aiResponse.status === 402) {
        return res
          .set({ ...corsHeaders, 'Content-Type': 'application/json' })
          .status(402)
          .json({ error: 'Payment required. Please add credits to your Lovable AI workspace.' });
      }
      throw new Error(`AI Gateway error: ${errorText}`);
    }

    const aiData = await aiResponse.json();
    const aiMessage = aiData.choices?.[0]?.message?.content || '';
    console.log('AI Response:', aiMessage);

    // ---- Step 4: Extract clean translation from structured AI response ----
    // Pattern A: "**1. Translated Text:**" section, up to "**2." or separator or next numbered section
    let match;
    match = aiMessage.match(/\*\*1\.\s*Translated Text:\*\*\s*([\s\S]+?)(?=\n\s*\*\*2\.|\n\s*---|\n\s*\*\*\d+)/);
    if (match?.[1]) translatedText = match[1].trim();

    // Pattern B: "Translated Text:" then up to horizontal rule
    if (!translatedText) {
      match = aiMessage.match(/Translated Text:\*\*\s*([\s\S]+?)(?=\n\s*---)/);
      if (match?.[1]) translatedText = match[1].trim();
    }

    // Pattern C: "**XX:** language code line
    if (!translatedText) {
      match = aiMessage.match(/\*\*[A-Z]{2,}:\*\*\s*([\s\S]+?)(?=\n\n|$)/);
      if (match?.[1]) translatedText = match[1].trim();
    }

    // Pattern D: "## <Lang> Translation" header
    if (!translatedText) {
      match = aiMessage.match(/##\s*[A-Za-z][A-Za-z ]*\s+Translation[:\s]*\n\n?([\s\S]+?)(?=\n\n|$)/);
      if (match?.[1]) translatedText = match[1].trim();
    }

    // Pattern E: "Translation:" then first substantive line
    if (!translatedText) {
      const lines = aiMessage.split('\n');
      const translationIndex = lines.findIndex(
        (l) => l.toLowerCase().includes('translation') && !l.startsWith('#')
      );
      if (translationIndex >= 0) {
        for (let i = translationIndex + 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (line && !line.startsWith('#') && !line.includes('##') && !line.startsWith('**')) {
            translatedText = line;
            break;
          }
        }
      }
    }

    // Pattern F: Fallback - first substantial line
    if (!translatedText) {
      const lines = aiMessage.split('\n').filter((l) => l.trim().length > 20);
      translatedText = lines[0]?.trim() || aiMessage;
    }

    console.log('Extracted translation:', translatedText);

    // Store full AI response for drawer analysis
    const fullAnalysis = aiMessage;

    // ---- Step 5: Word-level breakdown (same approach) ----
    function countWords(text, language) {
      const lowerLang = String(language || '').toLowerCase();
      // For CJK languages, count characters (exclude spaces and punctuation)
      if (['cn', 'zh', 'ja', 'ko'].includes(lowerLang)) {
        return (text || '').replace(/[\s\p{P}]/gu, '').length;
      }
      // Others: space-separated
      return (text || '')
        .split(/\s+/)
        .filter((w) => w.length > 0).length;
    }

    const sourceWords = String(sourceText || '')
      .split(/\s+/)
      .filter((w) => w.length > 0);
    const targetWords = String(translatedText || '')
      .split(/\s+/)
      .filter((w) => w.length > 0);

    wordLevelBreakdown = targetWords.map((word, idx) => {
      // Find best TM match for the source-side token
      const srcToken = sourceWords[idx]?.toLowerCase();
      const bestMatch = tmMatches.find((tm) =>
        String(tm.source_text || '').toLowerCase().includes(srcToken || '')
      );

      if (bestMatch && bestMatch.match_score >= 95) {
        return {
          word,
          type: 'exact',
          tmMatchId: bestMatch.id,
          matchScore: bestMatch.match_score,
          tmSourceText: bestMatch.source_text,
          therapeuticArea: bestMatch.therapeutic_area,
          lastUsed: bestMatch.last_used_at,
        };
      } else if (bestMatch && bestMatch.match_score >= 70) {
        reviewFlags.push(`Fuzzy match for "${word}" requires review`);
        return {
          word,
          type: 'fuzzy',
          tmMatchId: bestMatch.id,
          matchScore: bestMatch.match_score,
          tmSourceText: bestMatch.source_text,
          therapeuticArea: bestMatch.therapeutic_area,
          lastUsed: bestMatch.last_used_at,
        };
      }
      return { word, type: 'new' };
    });

    // ---- Step 6: AI quality scores (same MVP mock) ----
    const aiScores = {
      medical: 0.92,
      brand: 0.88,
      cultural: 0.90,
      reasoning: [
        'Medical terminology is accurate and consistent',
        'Brand voice maintained across translation',
        'Culturally appropriate for target market',
      ],
    };

    // ---- Step 7: Word counts & leverage ----
    const exactWords = wordLevelBreakdown.filter((w) => w.type === 'exact').length;
    const fuzzyWords = wordLevelBreakdown.filter((w) => w.type === 'fuzzy').length;
    const newWords = wordLevelBreakdown.filter((w) => w.type === 'new').length;

    const totalWords = countWords(translatedText, targetLanguage);
    const leveragePercentage =
      totalWords > 0 ? ((exactWords + fuzzyWords * 0.5) / totalWords) * 100 : 0;

    // ---- Step 8: Save translation to TM database ----
    if (segmentId && projectId && translatedText) {
      console.log('Saving translation to TM:', { segmentId, projectId });
      const { error: tmError } = await supabase
        .from('glocal_tm_intelligence')
        .insert({
          project_id: projectId,
          segment_id: segmentId,
          tm_source_text: sourceText,
          tm_target_text: translatedText,
          source_language: sourceLanguage,
          target_language: targetLanguage,
          match_type: 'exact',
          match_score: 100,
          quality_score: aiScores.medical * 100,
          confidence_level: aiScores.brand * 100,
          therapeutic_area: therapeuticArea,
          exact_match_words: exactWords,
          fuzzy_match_words: fuzzyWords,
          new_words: newWords,
          leverage_percentage: leveragePercentage,
          ai_medical_accuracy_score: aiScores.medical * 100,
          ai_brand_consistency_score: aiScores.brand * 100,
          ai_cultural_fit_score: aiScores.cultural * 100,
          ai_reasoning: aiScores.reasoning,
          usage_count: 0,
          human_approval_status: 'pending',
        });

      if (tmError) {
        console.error('Failed to save to TM:', tmError);
        // Do not fail the translation if TM save fails
      } else {
        console.log('✅ Translation saved to TM successfully');
      }
    }

    // ---- Response (same fields) ----
    return res
      .set({ ...corsHeaders, 'Content-Type': 'application/json' })
      .status(200)
      .json({
        translatedText,
        fullAnalysis,
        wordLevelBreakdown,
        aiScores,
        reviewFlags,
        tmStats: {
          exactWords,
          fuzzyWords,
          newWords,
          totalWords,
          leveragePercentage,
        },
      });
  } catch (error) {
    console.error('Error in glocal-ai-tm-translate:', error);
    return res
      .set({ ...corsHeaders, 'Content-Type': 'application/json' })
      .status(500)
      .json({
        error: error instanceof Error ? error.message : 'Unknown error',
        translatedText: '',
        fullAnalysis: '',
        wordLevelBreakdown: [],
        aiScores: { medical: 0, brand: 0, cultural: 0, reasoning: [] },
        reviewFlags: ['Translation failed'],
        tmStats: {
          exactWords: 0,
          fuzzyWords: 0,
          newWords: 0,
          totalWords: 0,
          leveragePercentage: 0,
        },
      });
  }
});

