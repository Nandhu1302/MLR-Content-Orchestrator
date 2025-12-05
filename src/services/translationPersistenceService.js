import { supabase } from '@/integrations/supabase/client';

/**
 * @typedef {object} TMSegmentData
 * @property {string} sourceText
 * @property {string} targetText
 * @property {string} sourceLanguage
 * @property {string} targetLanguage
 * @property {string} brandId
 * @property {string} [assetId]
 * @property {string} [projectId]
 * @property {string} [market]
 * @property {any} [contextMetadata]
 * @property {string} [domainCategory]
 * @property {string} [matchType]
 * @property {number} [qualityScore]
 * @property {number} [confidenceScore]
 */

/**
 * @typedef {object} ProjectData
 * @property {string} [projectId]
 * @property {string} projectName
 * @property {string} assetId
 * @property {string} assetName
 * @property {string} brandId
 * @property {string[]} targetMarkets
 * @property {string} [targetLanguage]
 * @property {string} [sourceLanguage]
 * @property {string} [status]
 * @property {string} [workflowStatus]
 * @property {any} [workflowState]
 * @property {object} [translationProgress]
 * @property {number} translationProgress.totalSegments
 * @property {number} translationProgress.translatedSegments
 * @property {number} translationProgress.approvedSegments
 * @property {TMSegmentData[]} [segments]
 * @property {any} [intelligenceData]
 * @property {any} [workflowProgress]
 */

/**
 * @typedef {object} WorkflowStateData
 * @property {string} projectId
 * @property {string} assetId
 * @property {string} brandId
 * @property {string} market
 * @property {string} language
 * @property {any[]} [segmentTranslations]
 * @property {string} workflowStatus
 * @property {string[]} [completedSteps]
 * @property {any} [workflowProgress]
 */

/**
 * @typedef {object} IntelligenceDataSave
 * @property {string} projectId
 * @property {string} assetId
 * @property {string} brandId
 * @property {string} market
 * @property {any} intelligenceData
 * @property {any} [workflowProgress]
 */

export class TranslationPersistenceService {
  /**
   * Save a translation segment to the translation memory
   * @param {TMSegmentData} data
   * @returns {Promise<string | null>} The inserted TM ID or null
   */
  static async saveTMSegment(data) {
    try {
      const { data: result, error } = await supabase
        .from('translation_memory')
        .insert({
          brand_id: data.brandId,
          asset_id: data.assetId,
          project_id: data.projectId,
          source_text: data.sourceText,
          target_text: data.targetText,
          source_language: data.sourceLanguage,
          target_language: data.targetLanguage,
          market: data.market,
          context_metadata: data.contextMetadata || {},
          domain_category: data.domainCategory,
          match_type: data.matchType || 'exact',
          quality_score: data.qualityScore || 0,
          confidence_score: data.confidenceScore || 0,
          usage_count: 1,
          last_used_at: new Date().toISOString(),
        })
        .select('id')
        .single();

      if (error) {
        console.error('Error saving TM segment:', error);
        return null;
      }

      return result?.id || null;
    } catch (error) {
      console.error('Exception saving TM segment:', error);
      return null;
    }
  }

  /**
   * Save an AI translation result
   * @param {string} sourceText
   * @param {string} translatedText
   * @param {any} metadata
   * @param {string} brandId
   * @param {string} [assetId]
   * @param {string} [projectId]
   * @returns {Promise<string | null>} The inserted ID or null
   */
  static async saveAITranslation(
    sourceText,
    translatedText,
    metadata,
    brandId,
    assetId,
    projectId
  ) {
    try {
      const { data: result, error } = await supabase
        .from('ai_translation_results')
        .insert({
          brand_id: brandId,
          asset_id: assetId,
          project_id: projectId,
          source_text: sourceText,
          translated_text: translatedText,
          source_language: metadata.sourceLanguage,
          target_language: metadata.targetLanguage,
          translation_engine: metadata.engine || 'gemini',
          confidence_score: metadata.confidence || 0,
          medical_accuracy_score: metadata.medicalAccuracy || 0,
          brand_consistency_score: metadata.brandConsistency || 0,
          cultural_adaptation_score: metadata.culturalAdaptation || 0,
          regulatory_compliance_score: metadata.regulatoryCompliance || 0,
          overall_quality_score: metadata.overallQuality || 0,
          segment_type: metadata.segmentType || 'general',
          human_reviewed: false,
        })
        .select('id')
        .single();

      if (error) {
        console.error('Error saving AI translation:', error);
        return null;
      }

      return result?.id || null;
    } catch (error) {
      console.error('Exception saving AI translation:', error);
      return null;
    }
  }

  /**
   * Create or update a localization project
   * @param {ProjectData} data
   * @returns {Promise<string | null>} The project ID or null
   */
  static async upsertLocalizationProject(data) {
    try {
      console.log('💾 Upserting localization project:', data);

      const projectData = {
        project_name: data.projectName || data.assetName,
        brand_id: data.brandId,
        source_content_id: data.assetId,
        source_content_type: 'content_asset',
        target_markets: data.targetMarkets || [],
        status: data.status || 'draft',
        workflow_state: data.workflowState || {},
        last_auto_save: new Date().toISOString(),
      };

      let projectId;

      if (data.projectId) {
        // Update existing project
        const { error: updateError } = await supabase
          .from('localization_projects')
          .update(projectData)
          .eq('id', data.projectId);

        if (updateError) throw updateError;
        projectId = data.projectId;
        console.log('✅ Updated existing project:', projectId);
      } else {
        // Create new project
        const { data: newProject, error: insertError } = await supabase
          .from('localization_projects')
          .insert([projectData])
          .select()
          .single();

        if (insertError) throw insertError;
        projectId = newProject.id;
        console.log('✅ Created new project:', projectId);
      }

      // Create or update single workflow for the project
      const primaryMarket = data.targetMarkets?.[0];
      const marketName = typeof primaryMarket === 'string'
        ? primaryMarket
        : primaryMarket?.market || primaryMarket?.name || 'Global';
      
      const workflowData = {
        localization_project_id: projectId,
        workflow_name: `${data.projectName || data.assetName} - ${marketName}`,
        market: marketName,
        language: data.targetLanguage || marketName,
        workflow_type: 'translation',
        workflow_status: data.workflowStatus || 'pending',
        segment_translations: (data.segments || []),
        intelligence_data: (data.intelligenceData || {}),
        workflow_progress: (data.workflowProgress || {}),
        last_auto_save: new Date().toISOString(),
      };

      // Check if workflow exists for this project
      const { data: existingWorkflow } = await supabase
        .from('localization_workflows')
        .select('id')
        .eq('localization_project_id', projectId)
        .maybeSingle();

      if (existingWorkflow) {
        // Update existing workflow
        await supabase
          .from('localization_workflows')
          .update(workflowData)
          .eq('id', existingWorkflow.id);
        console.log('✅ Updated workflow:', existingWorkflow.id);
      } else {
        // Create new workflow (only one per project now)
        await supabase
          .from('localization_workflows')
          .insert([workflowData]);
        console.log('✅ Created workflow for project:', projectId);
      }

      return projectId;
    } catch (error) {
      console.error('Exception upserting localization project:', error);
      return null;
    }
  }

  /**
   * Save workflow state for a specific market (with auto-save support)
   * @param {WorkflowStateData} data
   * @returns {Promise<boolean>} Success status
   */
  static async saveWorkflowState(data) {
    try {
      // Check if workflow exists
      const { data: existing } = await supabase
        .from('localization_workflows')
        .select('id')
        .eq('localization_project_id', data.projectId)
        .eq('market', data.market)
        .maybeSingle();

      const updateData = {
        workflow_status: data.workflowStatus,
        segment_translations: data.segmentTranslations || [],
        updated_at: new Date().toISOString(),
        last_auto_save: new Date().toISOString(),
      };

      if (data.workflowProgress) {
        updateData.workflow_progress = data.workflowProgress;
      }

      if (existing) {
        // Update existing workflow
        const { error } = await supabase
          .from('localization_workflows')
          .update(updateData)
          .eq('id', existing.id);

        if (error) {
          console.error('Error updating workflow state:', error);
          return false;
        }
      } else {
        // Create new workflow with all required fields
        const insertData = {
          localization_project_id: data.projectId,
          workflow_name: `${data.market} Translation`,
          workflow_type: 'translation',
          market: data.market,
          language: data.language,
          workflow_status: data.workflowStatus,
          segment_translations: data.segmentTranslations || [],
          workflow_progress: data.workflowProgress || {},
          last_auto_save: new Date().toISOString(),
        };

        const { error } = await supabase
          .from('localization_workflows')
          .insert(insertData);

        if (error) {
          console.error('❌ Error creating workflow state:', error);
          console.error('Failed data:', insertData);
          return false;
        }
        
        console.log('✅ Created new workflow for market:', data.market);
      }

      return true;
    } catch (error) {
      console.error('Exception saving workflow state:', error);
      return false;
    }
  }

  /**
   * Save intelligence data for a specific market (with auto-save support)
   * @param {IntelligenceDataSave} data
   * @returns {Promise<boolean>} Success status
   */
  static async saveIntelligenceData(data) {
    try {
      // Check if workflow exists
      const { data: existing } = await supabase
        .from('localization_workflows')
        .select('id')
        .eq('localization_project_id', data.projectId)
        .eq('market', data.market)
        .maybeSingle();

      const updateData = {
        intelligence_data: data.intelligenceData,
        updated_at: new Date().toISOString(),
        last_auto_save: new Date().toISOString(),
      };

      if (data.workflowProgress) {
        updateData.workflow_progress = data.workflowProgress;
      }

      if (existing) {
        // Update existing workflow
        const { error } = await supabase
          .from('localization_workflows')
          .update(updateData)
          .eq('id', existing.id);

        if (error) {
          console.error('Error updating intelligence data:', error);
          return false;
        }
      } else {
        // Create new workflow with intelligence data
        const insertData = {
          ...updateData,
          localization_project_id: data.projectId,
          workflow_name: `${data.market} Intelligence`,
          workflow_type: 'intelligence',
          market: data.market,
          language: '',
          workflow_status: 'in_progress',
        };

        const { error } = await supabase
          .from('localization_workflows')
          .insert(insertData);

        if (error) {
          console.error('Error creating workflow with intelligence:', error);
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Exception saving intelligence data:', error);
      return false;
    }
  }

  /**
   * Private method to migrate segments from old workflow_state storage
   * @param {any} project
   * @param {string} workflowId
   * @returns {Promise<any[]>} Migrated segments
   */
  static async _migrateSegmentsFromOldStorage(
    project,
    workflowId
  ) {
    let segments = [];
    
    if (project.workflow_state && typeof project.workflow_state === 'object' && !Array.isArray(project.workflow_state)) {
      console.log('🔄 Migrating translations from old workflow_state storage...');
      try {
        const workflowState = project.workflow_state;
        const oldSegments = workflowState?.stepData?.intelligence?.localizationBrief?.segments;
        
        if (Array.isArray(oldSegments) && oldSegments.length > 0) {
          console.log(`📦 Found ${oldSegments.length} segments in old storage, migrating...`);
          segments = oldSegments;
          
          // Save migrated data to new location
          await supabase
            .from('localization_workflows')
            .update({
              segment_translations: segments,
              updated_at: new Date().toISOString()
            })
            .eq('id', workflowId);
          
          console.log('✅ Migration complete - segments now in localization_workflows');
        }
      } catch (migrationError) {
        console.error('Error during migration:', migrationError);
      }
    }
    
    return segments;
  }

  /**
   * Load existing project by ID directly (preferred method for restoration)
   * @param {string} projectId
   * @returns {Promise<object | null>} Project and workflow data
   */
  static async loadProjectById(
    projectId
  ) {
    try {
      console.log('📂 Loading project by ID:', projectId);
      
      const { data: project, error: projectError } = await supabase
        .from('localization_projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (projectError) throw projectError;
      if (!project) return null;

      console.log('✅ Project loaded:', project.project_name);

      const { data: workflow, error: workflowError } = await supabase
        .from('localization_workflows')
        .select('*')
        .eq('localization_project_id', projectId)
        .single();

      if (workflowError) {
        console.error('Error loading workflow:', workflowError);
        return null;
      }

      let segments = [];
      
      if (Array.isArray(workflow?.segment_translations) && workflow.segment_translations.length > 0) {
        console.log('📦 Loading segments from workflow.segment_translations:', workflow.segment_translations.length);
        segments = workflow.segment_translations.map((seg) => ({
          id: seg.segmentId || seg.id || `segment-${Math.random()}`,
          title: seg.title || 'Section',
          content: seg.sourceText || seg.content || '',
          wordCount: seg.wordCount || (seg.sourceText || seg.content || '').split(/\s+/).length,
          translationStatus: seg.status || seg.translationStatus || 'pending',
          translatedText: seg.targetText || seg.translatedText || '',
          confidence: seg.confidence || 0,
          tmMatchPercentage: seg.tmMatchPercentage || 0,
          translationMethod: seg.method || seg.translationMethod || 'pending',
          isLocked: seg.isLocked || false
        }));
        console.log('✅ Restored segments with translations:', {
          total: segments.length,
          withTranslations: segments.filter((s) => s.translatedText).length
        });
      }
      
      // Migration from old workflow_state if needed
      if (segments.length === 0) {
        segments = await this._migrateSegmentsFromOldStorage(project, workflow.id);
      }

      console.log('📊 Loaded segments:', segments.length);

      return {
        project,
        workflow,
        segments,
        intelligenceData: workflow?.intelligence_data || {},
        workflowProgress: workflow?.workflow_progress || {},
        status: workflow?.workflow_status || project.status || 'draft',
      };
    } catch (error) {
      console.error('Exception loading project by ID:', error);
      return null;
    }
  }

  /**
   * Load existing project for asset + brand + market
   * NOTE: This is the legacy method - prefer loadProjectById when project ID is known
   * @param {string} assetId
   * @param {string} brandId
   * @param {string} targetMarket
   * @returns {Promise<any | null>} Project and workflow data
   */
  static async loadExistingProject(
    assetId,
    brandId,
    targetMarket
  ) {
    try {
      const { data: project, error: projectError } = await supabase
        .from('localization_projects')
        .select('*, localization_workflows(*)')
        .eq('brand_id', brandId)
        .eq('source_content_id', assetId)
        .contains('target_markets', [targetMarket])
        .maybeSingle();

      if (projectError || !project) {
        return null;
      }

      const workflow = project.localization_workflows?.find(
        (w) => w.market === targetMarket
      );

      let segments = Array.isArray(workflow?.segment_translations) ? workflow.segment_translations : [];
      
      // Migration from old workflow_state if needed
      if (segments.length === 0 && workflow) {
        segments = await this._migrateSegmentsFromOldStorage(project, workflow.id);
      }

      return {
        project,
        workflow,
        segments,
        intelligenceData: workflow?.intelligence_data || {},
        workflowProgress: workflow?.workflow_progress || {},
        status: workflow?.workflow_status || project.localization_status || 'draft',
      };
    } catch (error) {
      console.error('Exception loading existing project:', error);
      return null;
    }
  }

  /**
   * Batch save multiple segments to TM
   * @param {TMSegmentData[]} segments
   * @returns {Promise<number>} Number of saved segments
   */
  static async batchSaveSegments(segments) {
    try {
      const records = segments.map((seg) => ({
        brand_id: seg.brandId,
        asset_id: seg.assetId,
        project_id: seg.projectId,
        source_text: seg.sourceText,
        target_text: seg.targetText,
        source_language: seg.sourceLanguage,
        target_language: seg.targetLanguage,
        market: seg.market,
        context_metadata: seg.contextMetadata || {},
        domain_category: seg.domainCategory,
        match_type: seg.matchType || 'exact',
        quality_score: seg.qualityScore || 0,
        confidence_score: seg.confidenceScore || 0,
        usage_count: 1,
        last_used_at: new Date().toISOString(),
      }));

      const { data, error } = await supabase
        .from('translation_memory')
        .insert(records)
        .select('id');

      if (error) {
        console.error('Error batch saving segments:', error);
        return 0;
      }

      return data?.length || 0;
    } catch (error) {
      console.error('Exception batch saving segments:', error);
      return 0;
    }
  }

  /**
   * Search TM for matches
   * @param {string} sourceText
   * @param {string} sourceLanguage
   * @param {string} targetLanguage
   * @param {string} brandId
   * @param {number} [minMatchPercentage=70]
   * @returns {Promise<any[]>} Search results
   */
  static async searchTM(
    sourceText,
    sourceLanguage,
    targetLanguage,
    brandId,
    minMatchPercentage = 70
  ) {
    try {
      // NOTE: The TS code uses .ilike, which is a simple substring search. 
      // A proper TM search would involve a Postgres extension like pg_trgm for fuzzy matching,
      // but we adhere to the original Supabase query structure.
      const { data, error } = await supabase
        .from('translation_memory')
        .select('*')
        .eq('brand_id', brandId)
        .eq('source_language', sourceLanguage)
        .eq('target_language', targetLanguage)
        .ilike('source_text', `%${sourceText}%`)
        .order('quality_score', { ascending: false })
        .order('usage_count', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error searching TM:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Exception searching TM:', error);
      return [];
    }
  }

  /**
   * Update TM usage count
   * @param {string} tmId
   * @returns {Promise<void>}
   */
  static async updateTMUsage(tmId) {
    try {
      const { data: current } = await supabase
        .from('translation_memory')
        .select('usage_count')
        .eq('id', tmId)
        .single();

      if (current) {
        await supabase
          .from('translation_memory')
          .update({
            usage_count: (current.usage_count || 0) + 1,
            last_used_at: new Date().toISOString(),
          })
          .eq('id', tmId);
      }
    } catch (error) {
      console.error('Error updating TM usage:', error);
    }
  }
}