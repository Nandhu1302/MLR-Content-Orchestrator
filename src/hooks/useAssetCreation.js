import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
// Note: IntakeData, GeneratedTheme, ContentService, ThemeContentInitializer,
// PIEvidenceSelector, and toast are imported but their type definitions are removed.
import { ContentService } from '@/services/contentService';
import { ThemeContentInitializer } from '@/services/themeContentInitializer';
import { PIEvidenceSelector } from '@/services/PIEvidenceSelector';
import { toast } from '@/hooks/use-toast';

// The AssetCreationContext interface is removed in JavaScript.

// ========================================
// PHASE 6: UNIQUE ASSET NAMING SYSTEM
// ========================================
const generateUniqueAssetName = async (
  brandName,
  assetType,
  themeCategory,
  audience,
  supabaseClient, // Renamed 'supabase' parameter to avoid shadowing the import
  brandId,
  projectId
) => {
  // Get count of existing assets with this combination
  const { count } = await supabaseClient
    .from('content_assets')
    .select('*', { count: 'exact', head: true })
    .eq('brand_id', brandId)
    .eq('project_id', projectId)
    .eq('asset_type', ContentService.mapIntakeAssetTypeToDbType(assetType))
    .ilike('asset_name', `${brandName}_${assetType}_${themeCategory}_${audience}_%`);

  const sequence = (count || 0) + 1;

  // Format: {Brand}_{AssetType}_{Theme}_{Audience}_{Sequence}
  // Example: Biktarvy_Email_ClinicalExcellence_PhySpec_001
  const audienceShort = audience === 'Physician-Specialist' ? 'PhySpec' :
                        audience === 'Physician-PrimaryCare' ? 'PrimCare' :
                        audience === 'Nurse-NP-PA' ? 'NPPA' :
                        audience === 'Nurse-RN' ? 'RN' :
                        audience === 'Pharmacist' ? 'Pharm' :
                        audience === 'Patient' ? 'Patient' :
                        audience === 'Caregiver-Professional' ? 'CaregiverPro' :
                        audience === 'Caregiver-Family' ? 'CaregiverFam' :
                        audience.substring(0, 8);

  return `${brandName}_${assetType}_${themeCategory}_${audienceShort}_${sequence.toString().padStart(3, '0')}`;
};

export const useAssetCreation = () => {
  const [isCreating, setIsCreating] = useState(false);

  const createAsset = async (context, assetType, index = 0) => {
    const { projectId, brandId, userId, intakeData, theme, themeId } = context;

    try {
      setIsCreating(true);

      // Fetch brand name for unique naming
      const { data: brand } = await supabase
        .from('brand_profiles')
        .select('brand_name')
        .eq('id', brandId)
        .single();

      if (!brand) {
        throw new Error('Brand not found');
      }

      // Build strategic context
      const strategicContext = {
        campaignObjective: intakeData.primaryObjective || 'clinical-education',
        keyMessage: theme.keyMessage || '',
        targetAudience: intakeData.primaryAudience || 'HCP',
        indication: intakeData.indication || '',
        assetType: ContentService.mapIntakeAssetTypeToDbType(assetType)
      };

      // Fetch and filter PI data
      const { data: piRecords } = await supabase
        .from('brand_documents')
        .select('*')
        .eq('brand_id', brandId)
        .eq('parsing_status', 'completed')
        .order('created_at', { ascending: false })
        .limit(1);

      // Removed 'as any' type cast
      const fullPIData = piRecords?.[0]?.parsed_data || null;
      const filteredPIResult = PIEvidenceSelector.filterPIForContext(fullPIData, strategicContext);

      // Build enriched context with specialist info
      const enrichedContext = {
        ...intakeData,
        original_key_message: theme.keyMessage,
        original_cta: theme.callToAction,
        specialistType: intakeData.specialistType,
        specialistDisplayName: intakeData.specialistDisplayName,
        therapeuticArea: intakeData.therapeuticArea,
        strategicContext,
        piFilteringResult: filteredPIResult
      };

      console.log('💾 Creating asset with specialist context:', {
        hasSpecialistType: !!enrichedContext.specialistType,
        specialistType: enrichedContext.specialistType,
        indication: enrichedContext.indication,
        audience: intakeData.primaryAudience
      });

      // Generate unique asset name using new system
      // Use theme.category instead of full theme name to avoid confusion
      const themeCategory = theme.category || theme.name?.split(' ').pop() || 'Content';
      const uniqueAssetName = await generateUniqueAssetName(
        brand.brand_name,
        assetType,
        themeCategory,
        intakeData.primaryAudience || 'HCP',
        supabase,
        brandId,
        projectId
      );

      console.log('📝 Generated unique asset name:', uniqueAssetName);

      // Create asset in database - only use fields that exist in ContentAsset type
      const asset = await ContentService.createAsset({
        project_id: projectId,
        brand_id: brandId,
        theme_id: themeId,
        asset_name: uniqueAssetName,
        asset_type: ContentService.mapIntakeAssetTypeToDbType(assetType),
        target_audience: intakeData.primaryAudience || '',
        status: 'draft',
        primary_content: {},
        metadata: {
          theme: theme,
          intake_data: enrichedContext,
          created_via_intake: true,
          indication: intakeData.indication,
          therapeutic_area: intakeData.indication,
          compliance_level: 'standard'
        },
        channel_specifications: {},
        performance_prediction: {},
        ai_analysis: {},
        created_by: userId
      });

      return asset;
    } catch (error) {
      console.error('Asset creation failed:', error);
      toast({
        title: 'Error Creating Asset',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  return { createAsset, isCreating };
};