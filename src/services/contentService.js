import { supabase } from '@/integrations/supabase/client';
import { sanitizeForDatabase } from '@/lib/utils';

export class ContentService {
  // Content Projects
  static async createProject(projectData) {
    // Sanitize all data to remove corrupted Unicode characters before database insertion
    const sanitizedData = sanitizeForDatabase(projectData);

    console.log('ContentService.createProject called with data:', {
      brand_id: sanitizedData.brand_id,
      project_name: sanitizedData.project_name,
      created_by: sanitizedData.created_by
    });

    // Verify authentication session before database operation
    const { data: authUser, error: authError } = await supabase.auth.getUser();
    if (authError || !authUser.user) {
      console.error('Authentication verification failed:', authError);
      throw new Error('Authentication session expired. Please refresh the page and try again.');
    }

    console.log('Authentication verified for user:', authUser.user.id);

    // Verify brand access if brand_id is provided
    if (sanitizedData.brand_id) {
      const { data: brandAccess, error: brandError } = await supabase
        .rpc('user_has_brand_access', {
          user_id_param: authUser.user.id,
          brand_id_param: sanitizedData.brand_id
        });

      if (brandError) {
        console.error('Brand access check failed:', brandError);
        throw new Error('Unable to verify brand access. Please try again.');
      }

      if (!brandAccess) {
        console.error('User does not have access to brand:', sanitizedData.brand_id);
        throw new Error('You do not have permission to create projects for this brand.');
      }

      console.log('Brand access verified for brand:', sanitizedData.brand_id);
    }

    // Attempt database insertion with retry logic
    let lastError;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        console.log(`Creating project attempt ${attempt + 1}`);

        const { data, error } = await supabase
          .from('content_projects')
          .insert(sanitizedData)
          .select()
          .single();

        if (error) {
          console.error(`Project creation attempt ${attempt + 1} failed:`, error);
          lastError = error;

          // If it's an auth error, refresh session and retry
          if (error.message?.includes('auth') || error.message?.includes('policy') || error.code === 'PGRST301') {
            if (attempt < 2) {
              console.log('Authentication error detected, refreshing session...');
              await supabase.auth.refreshSession();
              await new Promise(resolve => setTimeout(resolve, 1000));
              continue;
            }
          }

          // For other errors, don't retry
          break;
        }

        console.log('Project created successfully:', data.id);
        return data;
      } catch (err) {
        console.error(`Project creation attempt ${attempt + 1} exception:`, err);
        lastError = err;
        if (attempt < 2) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }

    // All attempts failed, provide specific error message
    const errorMessage = lastError?.message || 'Unknown error occurred';
    console.error('All project creation attempts failed. Last error:', lastError);

    if (errorMessage.includes('policy') || errorMessage.includes('auth')) {
      throw new Error('Permission denied. Please refresh the page and try again.');
    } else if (errorMessage.includes('duplicate') || errorMessage.includes('unique')) {
      throw new Error('A project with this name already exists. Please choose a different name.');
    } else if (errorMessage.includes('network') || errorMessage.includes('connection')) {
      throw new Error('Network error. Please check your connection and try again.');
    } else {
      throw new Error(`Failed to create project: ${errorMessage}`);
    }
  }

  static async getProjects(brandId) {
    const { data, error } = await supabase
      .from('content_projects')
      .select('*')
      .eq('brand_id', brandId)
      .order('updated_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch projects: ${error.message}`);
    return (data || []);
  }

  static async getProject(projectId) {
    const { data, error } = await supabase
      .from('content_projects')
      .select('*')
      .eq('id', projectId)
      .maybeSingle();

    if (error) throw new Error(`Failed to fetch project: ${error.message}`);
    return data || null;
  }

  static async updateProject(projectId, updates) {
    const { data, error } = await supabase
      .from('content_projects')
      .update(updates)
      .eq('id', projectId)
      .select()
      .single();

    if (error) throw new Error(`Failed to update project: ${error.message}`);
    return data;
  }

  static async deleteProject(projectId) {
    console.log('[ContentService] Deleting project:', projectId);

    // CASCADE constraints will automatically delete related records (assets, etc.)
    const { error } = await supabase
      .from('content_projects')
      .delete()
      .eq('id', projectId);

    if (error) {
      console.error('[ContentService] Delete error:', error);
      // Specific error handling for RLS permission issues
      if (error.code === 'PGRST301') {
        throw new Error('You do not have permission to delete this project. Please check your brand access.');
      }
      throw new Error(`Failed to delete project: ${error.message}`);
    }

    console.log('[ContentService] Project deleted successfully');
  }

  // Content Assets
  static async createAsset(assetData) {
    const { data, error } = await supabase
      .from('content_assets')
      .insert(assetData)
      .select()
      .single();

    if (error) throw new Error(`Failed to create asset: ${error.message}`);
    return data;
  }

  static async getAssets(projectId) {
    const { data, error } = await supabase
      .from('content_assets')
      .select('*')
      .eq('project_id', projectId)
      .order('updated_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch assets: ${error.message}`);
    return (data || []);
  }

  static async getAllAssetsForBrand(brandId) {
    const { data, error } = await supabase
      .from('content_assets')
      .select('*')
      .eq('brand_id', brandId)
      .order('updated_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch assets: ${error.message}`);
    return (data || []);
  }

  static async getAsset(assetId) {
    const { data, error } = await supabase
      .from('content_assets')
      .select('*')
      .eq('id', assetId)
      .maybeSingle();

    if (error) throw new Error(`Failed to fetch asset: ${error.message}`);
    return data || null;
  }

  static async updateAsset(assetId, updates) {
    const { data, error } = await supabase
      .from('content_assets')
      .update(updates)
      .eq('id', assetId)
      .select()
      .single();

    if (error) throw new Error(`Failed to update asset: ${error.message}`);
    return data;
  }

  static async updateAssetStatus(assetId, status, userId) {
    const updates = { status };
    if (userId) {
      updates.updated_by = userId;
    }

    // Set completed_at when status changes to completed
    if (status === 'completed') {
      updates.completed_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('content_assets')
      .update(updates)
      .eq('id', assetId)
      .select()
      .single();

    if (error) throw new Error(`Failed to update asset status: ${error.message}`);
    return data;
  }

  static async deleteAsset(assetId) {
    console.log('[ContentService] Deleting asset:', assetId);

    // CASCADE constraints will automatically delete related records (variations, versions, handoffs)
    const { error } = await supabase
      .from('content_assets')
      .delete()
      .eq('id', assetId);

    if (error) {
      console.error('[ContentService] Delete error:', error);
      // Specific error handling for RLS permission issues
      if (error.code === 'PGRST301') {
        throw new Error('You do not have permission to delete this asset. Please check your brand access.');
      }
      throw new Error(`Failed to delete asset: ${error.message}`);
    }

    console.log('[ContentService] Asset deleted successfully');
  }

  // Content Variations
  static async createVariation(variationData) {
    const { data, error } = await supabase
      .from('content_variations')
      .insert(variationData)
      .select()
      .single();

    if (error) throw new Error(`Failed to create variation: ${error.message}`);
    return data;
  }

  static async getVariations(assetId) {
    const { data, error } = await supabase
      .from('content_variations')
      .select('*')
      .eq('asset_id', assetId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch variations: ${error.message}`);
    return (data || []);
  }

  // Alias for getVariations (for compatibility)
  static async getContentVariations(assetId) {
    return this.getVariations(assetId);
  }

  // Save content variation (combines create and update)
  static async saveContentVariation(
    assetId,
    variationData
  ) {
    return this.createVariation({
      asset_id: assetId,
      ...variationData
    });
  }

  static async updateVariation(
    variationId,
    updates
  ) {
    const { data, error } = await supabase
      .from('content_variations')
      .update(updates)
      .eq('id', variationId)
      .select()
      .single();

    if (error) throw new Error(`Failed to update variation: ${error.message}`);
    return data;
  }

  static async deleteVariation(variationId) {
    const { error } = await supabase
      .from('content_variations')
      .delete()
      .eq('id', variationId);

    if (error) throw new Error(`Failed to delete variation: ${error.message}`);
  }

  // Content Versions
  static async createVersion(versionData) {
    // First, set all other versions for this asset to not current
    await supabase
      .from('content_versions')
      .update({ is_current: false })
      .eq('asset_id', versionData.asset_id);

    const { data, error } = await supabase
      .from('content_versions')
      .insert({ ...versionData, is_current: true })
      .select()
      .single();

    if (error) throw new Error(`Failed to create version: ${error.message}`);
    return data;
  }

  static async getVersions(assetId) {
    const { data, error } = await supabase
      .from('content_versions')
      .select('*')
      .eq('asset_id', assetId)
      .order('version_number', { ascending: false });

    if (error) throw new Error(`Failed to fetch versions: ${error.message}`);
    return (data || []);
  }

  static async getCurrentVersion(assetId) {
    const { data, error } = await supabase
      .from('content_versions')
      .select('*')
      .eq('asset_id', assetId)
      .eq('is_current', true)
      .maybeSingle();

    if (error) throw new Error(`Failed to fetch current version: ${error.message}`);
    return data || null;
  }

  // Design Handoffs
  static async createHandoff(handoffData) {
    const { data, error } = await supabase
      .from('design_handoffs')
      .insert(handoffData)
      .select()
      .single();

    if (error) throw new Error(`Failed to create handoff: ${error.message}`);
    return data;
  }

  static async getHandoffs(projectId) {
    const { data, error } = await supabase
      .from('design_handoffs')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch handoffs: ${error.message}`);
    return (data || []);
  }

  static async updateHandoff(handoffId, updates) {
    const { data, error } = await supabase
      .from('design_handoffs')
      .update(updates)
      .eq('id', handoffId)
      .select()
      .single();

    if (error) throw new Error(`Failed to update handoff: ${error.message}`);
    return data;
  }

  // Content Sessions (for resume functionality)
  static async saveSession(sessionData) {
    const { data, error } = await supabase
      .from('content_sessions')
      .upsert(sessionData, { onConflict: 'user_id,asset_id,session_type' })
      .select()
      .single();

    if (error) throw new Error(`Failed to save session: ${error.message}`);
    return data;
  }

  static async getActiveSession(userId, projectId, assetId) {
    let query = supabase
      .from('content_sessions')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true);

    if (projectId) query = query.eq('project_id', projectId);
    if (assetId) query = query.eq('asset_id', assetId);

    const { data, error } = await query
      .order('last_activity', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw new Error(`Failed to fetch session: ${error.message}`);
    return data || null;
  }

  static async updateSession(sessionId, updates) {
    const { data, error } = await supabase
      .from('content_sessions')
      .update({ ...updates, last_activity: new Date().toISOString() })
      .eq('id', sessionId)
      .select()
      .single();

    if (error) throw new Error(`Failed to update session: ${error.message}`);
    return data;
  }

  // Auto-save functionality
  static async autoSave(assetId, content, userId) {
    // Update asset content
    await this.updateAsset(assetId, {
      primary_content: content,
      updated_by: userId
    });

    // Update or create session for resume functionality
    await this.saveSession({
      user_id: userId,
      asset_id: assetId,
      session_type: 'asset',
      session_state: content,
      auto_save_data: content,
      last_activity: new Date().toISOString(),
      is_active: true
    });
  }

  // Migration from localStorage
  static async migrateFromLocalStorage(userId, brandId) {
    // Check if migration has already been done for this user/brand
    const existingProjects = await this.getProjects(brandId);
    const hasMigratedProjects = existingProjects.some(p => p.project_metadata?.migrated);

    if (hasMigratedProjects) {
      console.log('Migration already completed for this brand');
      return;
    }

    // Call the corrected internal method
    const drafts = this._getLocalStorageDrafts();

    if (drafts.length === 0) {
      console.log('No drafts found to migrate');
      return;
    }

    console.log(`Migrating ${drafts.length} drafts to database...`);

    for (const draft of drafts) {
      try {
        // Determine project type and create better naming - fixed logic for single asset detection
        const assetTypes = draft.data.selectedAssetTypes || [];
        const isSingleAsset = assetTypes.length === 1 || draft.data.assetType === 'single-asset';

        const projectType = isSingleAsset ? 'single-asset' : 'campaign';
        const assetTypeDisplay = assetTypes[0] || draft.data.assetType || 'content';

        // Create descriptive project name and description
        const baseProjectName = draft.data.projectName || 'Untitled Project';
        const projectName = isSingleAsset
          ? `${baseProjectName} (${assetTypeDisplay})`
          : baseProjectName;

        const description = isSingleAsset
          ? `Single ${assetTypeDisplay} asset for ${draft.data.indication || 'therapeutic area'}`
          : `Campaign with multiple assets for ${draft.data.indication || 'therapeutic area'}`;

        // Create project from draft
        const project = await this.createProject({
          brand_id: brandId,
          project_name: projectName,
          project_type: projectType,
          description: description,
          status: 'draft',
          target_audience: draft.data.targetAudience || {},
          therapeutic_area: draft.data.therapeuticArea || draft.data.indication,
          market: draft.data.targetMarkets ? (Array.isArray(draft.data.targetMarkets) ? draft.data.targetMarkets : [draft.data.targetMarkets]) : [],
          channels: draft.data.channels || [],
          compliance_level: 'standard',
          project_metadata: {
            migrated: true,
            original_key: draft.key,
            migration_date: new Date().toISOString(),
            project_type: projectType
          },
          created_by: userId
        });

        // Create asset from draft content
        const assetName = isSingleAsset
          ? baseProjectName
          : `${baseProjectName} - ${assetTypeDisplay}`;

        await this.createAsset({
          project_id: project.id,
          brand_id: brandId,
          asset_name: assetName,
          asset_type: this.mapIntakeAssetTypeToDbType(draft.data.selectedAssetTypes?.[0] || draft.data.assetType || 'web'),
          status: 'draft',
          primary_content: draft.data,
          metadata: {
            migrated: true,
            original_draft_key: draft.key,
            migration_date: new Date().toISOString()
          },
          ai_analysis: {},
          channel_specifications: {},
          performance_prediction: {},
          created_by: userId
        });

        console.log(`Successfully migrated draft: ${draft.key} -> ${project.id}`);

        // Remove from localStorage after successful migration
        localStorage.removeItem(draft.key);
      } catch (error) {
        console.error(`Failed to migrate draft ${draft.key}:`, error);
        // Don't remove failed drafts from localStorage so they can be retried
      }
    }

    console.log('Migration completed successfully');
  }

  // Clean up existing migrated projects with generic descriptions
  static async cleanupMigratedProjects(brandId) {
    const projects = await this.getProjects(brandId);
    const migratedProjects = projects.filter(p =>
      p.description === 'Migrated from localStorage' && p.project_metadata?.migrated
    );

    console.log(`Cleaning up ${migratedProjects.length} migrated projects with generic descriptions`);

    for (const project of migratedProjects) {
      try {
        // Get assets for this project to determine better description
        const assets = await this.getAssets(project.id);
        const isSingleAsset = project.project_type === 'single-asset' || assets.length === 1;
        const assetTypes = assets.map(a => a.asset_type).filter(Boolean);
        const primaryAssetType = assetTypes[0] || 'content';

        const description = isSingleAsset
          ? `Single ${primaryAssetType} asset for ${project.therapeutic_area || 'therapeutic area'}`
          : `Campaign with ${assets.length} assets for ${project.therapeutic_area || 'therapeutic area'}`;

        await this.updateProject(project.id, {
          description,
          project_metadata: {
            ...project.project_metadata,
            cleaned_up: true,
            cleanup_date: new Date().toISOString()
          }
        });

        console.log(`Cleaned up project: ${project.id}`);
      } catch (error) {
        console.error(`Failed to cleanup project ${project.id}:`, error);
      }
    }
  }

  // Renamed from 'private static' to comply with standard JS class syntax.
  // The underscore indicates it is intended for internal use only.
  static _getLocalStorageDrafts() {
    const drafts = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('draft_')) {
        try {
          const data = JSON.parse(localStorage.getItem(key) || '{}');
          drafts.push({ key, data: data.data || data });
        } catch (error) {
          console.error(`Failed to parse draft ${key}:`, error);
        }
      }
    }
    return drafts;
  }

  // Asset type mapping utilities
  static mapIntakeAssetTypeToDbType(intakeAssetType) {
    // Map intake asset types to database asset types
    const typeMapping = {
      // Email types
      'mass-email': 'mass-email',
      'hcp-email': 'hcp-email',
      'rep-triggered-email': 'rep-triggered-email',
      'patient-email': 'patient-email',
      'caregiver-email': 'caregiver-email',

      // Social types
      'social-media-post': 'social-media-post',
      'paid-social-ad': 'paid-social-ad',

      // Web types
      'website-landing-page': 'website-landing-page',
      'web-content': 'web-content',
      'blog': 'blog',

      // Sales types
      'digital-sales-aid': 'digital-sales-aid',

      // Legacy mappings
      'email': 'email',
      'web': 'web',
      'social': 'social',
      'print': 'print',
      'dsa': 'dsa',
      'video': 'video',
      'infographic': 'infographic'
    };

    // Fallback logic with warning
    if (!typeMapping[intakeAssetType]) {
      console.warn(`⚠️ Unknown asset type: ${intakeAssetType}, falling back to 'web'. Add to typeMapping.`);
      // Fallback to 'mass-email' for unknown email types
      if (intakeAssetType.toLowerCase().includes('email')) {
        return 'mass-email';
      }
    }

    return (typeMapping[intakeAssetType] || 'web');
  }

  static async createAssetWithCorrectType(assetData) {
    // Extract correct asset type from intake context or selectedAssetTypes
    let correctAssetType = assetData.asset_type;

    if (assetData.intake_asset_type) {
      correctAssetType = this.mapIntakeAssetTypeToDbType(assetData.intake_asset_type);
    } else if (assetData.primary_content && typeof assetData.primary_content === 'object') {
      const content = assetData.primary_content;
      if (content.selectedAssetTypes && Array.isArray(content.selectedAssetTypes) && content.selectedAssetTypes.length > 0) {
        correctAssetType = this.mapIntakeAssetTypeToDbType(content.selectedAssetTypes[0]);
      }
    }

    const { intake_asset_type, ...cleanAssetData } = assetData;
    return this.createAsset({ ...cleanAssetData, asset_type: correctAssetType });
  }
}