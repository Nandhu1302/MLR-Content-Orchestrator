import { supabase } from '@/integrations/supabase/client';






export class AITranslationEngine {
  
  /**
   * Translate a single segment with AI-powered multi-engine translation
   */
  static async translateSegment(request) {
    try {
      console.log('AI Translation Engine translation', {
        sourceLanguage.sourceLanguage,
        targetLanguage.targetLanguage,
        contentType.contentType,
        textLength.sourceText.length
      });

      const { data, error } = await supabase.functions.invoke('ai-translation-engine', {
        body
      });

      if (error) {
        console.error('AI Translation Engine Error:', error);
        throw new Error(`Translation failed: ${error.message}`);
      }

      const result = data as AITranslationResult;
      
      // Determine status based on overall quality score
      result.status = this.determineTranslationStatus(result.overallQualityScore);

      console.log('AI Translation completed:', {
        engine.engine,
        overallScore.overallQualityScore,
        status.status,
        processingTime.processingTimeMs
      });

      return result;

    } catch (error) {
      console.error('AI Translation Engine service error:', error);
      throw new Error('Failed to translate content with AI engine');
    }
  }

  /**
   * Translate multiple segments in batch for efficiency
   */
  static async translateBatch(request) {
    const batchId = `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const results{ segmentId; translation }> = [];
    
    let totalProcessingTime = 0;
    let successfulTranslations = 0;
    let totalQualityScore = 0;
    const reviewSegments = [];

    console.log(`Starting batch translation for ${request.segments.length} segments`);

    // Process segments in parallel batches of 3 to avoid rate limits
    const batchSize = 3;
    for (let i = 0; i < request.segments.length; i += batchSize) {
      const batch = request.segments.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (segment) => {
        try {
          const translationRequest = {
            sourceText.text,
            sourceLanguage.sourceLanguage,
            targetLanguage.targetLanguage,
            contentType.type || 'general',
            brandId.brandId,
            therapeuticArea.therapeuticArea,
            projectId.projectId,
            assetId.assetId,
            preferredEngine: 'auto',
            includeConfidenceScoring
          };

          const translation = await this.translateSegment(translationRequest);
          
          totalProcessingTime += translation.processingTimeMs;
          totalQualityScore += translation.overallQualityScore;
          
          if (translation.overallQualityScore >= 70) {
            successfulTranslations++;
          }
          
          if (translation.status === 'needs_review' || translation.status === 'poor') {
            reviewSegments.push(segment.id);
          }

          return {
            segmentId.id,
            translation
          };

        } catch (error) {
          console.error(`Failed to translate segment ${segment.id}:`, error);
          reviewSegments.push(segment.id);
          
          // Return a failed translation result
          return {
            segmentId.id,
            translation: {
              id: '',
              translatedText.text, // Fallback to original text
              engine: 'failed',
              confidenceScore,
              medicalAccuracyScore,
              brandConsistencyScore,
              culturalAdaptationScore,
              regulatoryComplianceScore,
              overallQualityScore,
              processingTimeMs,
              glossaryMatches,
              suggestions'Manual translation required'],
              status: 'poor' as const
            }
          };
        }
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);

      // Small delay between batches to respect rate limits
      if (i + batchSize < request.segments.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    const summary = {
      totalSegments.segments.length,
      successfulTranslations,
      averageQualityScore > 0 ? Math.round(totalQualityScore / request.segments.length) ,
      totalProcessingTime,
      recommendedReviewSegments
    };

    console.log('Batch translation completed:', summary);

    return {
      batchId,
      results,
      summary
    };
  }

  /**
   * Get translation performance analytics for a brand
   */
  static async getTranslationAnalytics(brandId, days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data } = await supabase
      .from('ai_translation_results')
      .select('*')
      .eq('brand_id', brandId)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending });

    if (!results || results.length === 0) {
      return {
        totalTranslations,
        averageQualityScore,
        enginePerformance: {},
        languagePairPerformance: {},
        contentTypePerformance: {},
        timeToMarketSavings,
        costSavings
      };
    }

    // Calculate analytics
    const totalTranslations = results.length;
    const averageQualityScore = results.reduce((sum, r) => sum + r.overall_quality_score, 0) / totalTranslations;
    
    // Engine performance breakdown
    const enginePerformance = results.reduce((acc, r) => {
      if (!acc[r.translation_engine]) {
        acc[r.translation_engine] = { count, avgScore, totalScore };
      }
      acc[r.translation_engine].count++;
      acc[r.translation_engine].totalScore += r.overall_quality_score;
      acc[r.translation_engine].avgScore = acc[r.translation_engine].totalScore / acc[r.translation_engine].count;
      return acc;
    }, {});

    // Language pair performance
    const languagePairPerformance = results.reduce((acc, r) => {
      const pair = `${r.source_language}-${r.target_language}`;
      if (!acc[pair]) {
        acc[pair] = { count, avgScore, totalScore };
      }
      acc[pair].count++;
      acc[pair].totalScore += r.overall_quality_score;
      acc[pair].avgScore = acc[pair].totalScore / acc[pair].count;
      return acc;
    }, {});

    // Content type performance
    const contentTypePerformance = results.reduce((acc, r) => {
      if (!acc[r.segment_type]) {
        acc[r.segment_type] = { count, avgScore, totalScore };
      }
      acc[r.segment_type].count++;
      acc[r.segment_type].totalScore += r.overall_quality_score;
      acc[r.segment_type].avgScore = acc[r.segment_type].totalScore / acc[r.segment_type].count;
      return acc;
    }, {});

    // Estimated time and cost savings (based on industry benchmarks)
    const avgWordsPerTranslation = 50; // Estimated
    const totalWords = totalTranslations * avgWordsPerTranslation;
    const humanTranslationTimePerWord = 0.5; // 30 seconds per word
    const aiTranslationTimePerWord = 0.05; // 3 seconds per word
    const timeToMarketSavings = (humanTranslationTimePerWord - aiTranslationTimePerWord) * totalWords; // in minutes

    const humanCostPerWord = 0.25; // $0.25 per word
    const aiCostPerWord = 0.05; // $0.05 per word
    const costSavings = (humanCostPerWord - aiCostPerWord) * totalWords;

    return {
      totalTranslations,
      averageQualityScore.round(averageQualityScore * 100) / 100,
      enginePerformance,
      languagePairPerformance,
      contentTypePerformance,
      timeToMarketSavings.round(timeToMarketSavings), // minutes saved
      costSavings.round(costSavings * 100) / 100 // dollars saved
    };
  }

  /**
   * Get pharmaceutical glossary terms for enhancement
   */
  static async getPharmaceuticalGlossary(
    brandId,
    sourceLanguage,
    targetLanguage,
    therapeuticArea
  ) {
    const { data } = await supabase
      .from('pharmaceutical_glossary')
      .select('*')
      .eq('brand_id', brandId)
      .eq('source_language', sourceLanguage)
      .eq('target_language', targetLanguage)
      .eq('therapeutic_area', therapeuticArea)
      .eq('validation_status', 'validated')
      .order('confidence_score', { ascending });

    return glossary || [];
  }

  /**
   * Add new glossary term for learning
   */
  static async addGlossaryTerm(
    brandId,
    sourceTerm,
    targetTerm,
    sourceLanguage,
    targetLanguage,
    therapeuticArea,
    medicalCategory = 'general',
    confidenceScore = 100
  ) {
    const { data, error } = await supabase
      .from('pharmaceutical_glossary')
      .insert({
        brand_id,
        term_source,
        term_target,
        source_language,
        target_language,
        therapeutic_area,
        medical_category,
        confidence_score,
        validation_status: 'validated'
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to add glossary term:', error);
      throw new Error('Failed to add glossary term');
    }

    return data;
  }

  /**
   * Create agency collaboration workflow
   */
  static async createAgencyWorkflow(
    localizationProjectId,
    aiTranslationData,
    agencyName?
  ) {
    const { data, error } = await supabase
      .from('agency_collaboration_workflows')
      .insert({
        localization_project_id,
        agency_name,
        workflow_status: 'ai_translation_complete',
        ai_pre_translation_data,
        handoff_format: 'xliff',
        ai_completion_date Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to create agency workflow:', error);
      throw new Error('Failed to create agency workflow');
    }

    return data;
  }

  /**
   * Determine translation status based on quality score
   */
  private static determineTranslationStatus(qualityScore): 'excellent' | 'good' | 'needs_review' | 'poor' {
    if (qualityScore >= 90) return 'excellent';
    if (qualityScore >= 75) return 'good';
    if (qualityScore >= 50) return 'needs_review';
    return 'poor';
  }

  /**
   * Export translations in agency-friendly formats
   */
  static async exportForAgency(
    workflowId,
    format: 'xliff' | 'tmx' | 'json' = 'xliff'
  ) {
    const { data } = await supabase
      .from('agency_collaboration_workflows')
      .select('*')
      .eq('id', workflowId)
      .single();

    if (!workflow) {
      throw new Error('Workflow not found');
    }

    const translationData = workflow.ai_pre_translation_data;
    
    if (format === 'xliff') {
      return this.generateXLIFF(translationData);
    } else if (format === 'tmx') {
      return this.generateTMX(translationData);
    } else {
      return JSON.stringify(translationData, null, 2);
    }
  }

  private static generateXLIFF(translationData) {
    // Simplified XLIFF 2.1 format for agency handoff
    const xliff = `<?xml version="1.0" encoding="UTF-8"?>
<xliff version="2.1" xmlns="urn.1">
  <file id="ai-translation-${Date.now()}" source-language="${translationData.sourceLanguage}" target-language="${translationData.targetLanguage}">
    <unit id="content">
      <segment>
        <source>${this.escapeXML(translationData.sourceText)}</source>
        <target state="new">${this.escapeXML(translationData.translatedText)}</target>
      </segment>
    </unit>
  </file>
</xliff>`;
    
    return xliff;
  }

  private static generateTMX(translationData) {
    // Simplified TMX format
    const tmx = `<?xml version="1.0" encoding="UTF-8"?>
<tmx version="1.4">
  <header>
    <prop type="x-filename">ai-translation.tmx</prop>
  </header>
  <body>
    <tu tuid="1">
      <tuv xml="${translationData.sourceLanguage}">
        <seg>${this.escapeXML(translationData.sourceText)}</seg>
      </tuv>
      <tuv xml="${translationData.targetLanguage}">
        <seg>${this.escapeXML(translationData.translatedText)}</seg>
      </tuv>
    </tu>
  </body>
</tmx>`;
    
    return tmx;
  }

  private static escapeXML(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}
export default {};
