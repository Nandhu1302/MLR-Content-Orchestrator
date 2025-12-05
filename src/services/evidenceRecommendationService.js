import { supabase } from '@/integrations/supabase/client';
// Assuming AudienceType is defined elsewhere, but for pure JS conversion,
// we rely on JSDoc for type hinting.

/**
 * @typedef {('Physician-Specialist' | 'Physician-PrimaryCare' | 'Pharmacist' | 'Nurse-RN' | 'Nurse-NP-PA' | 'Patient' | 'Caregiver-Family' | 'Caregiver-Professional')} AudienceType
 */

/**
 * @typedef {object} RecommendedClaim
 * @property {string} id
 * @property {string} claim_id_display
 * @property {string} claim_text
 * @property {string} claim_type
 * @property {string} review_status
 * @property {number} relevanceScore
 * @property {string[]} linkedReferences
 * @property {object} matchingCriteria
 * @property {boolean} matchingCriteria.audienceMatch
 * @property {boolean} matchingCriteria.claimTypeRelevance
 * @property {boolean} matchingCriteria.hasStatisticalData
 * @property {number} matchingCriteria.confidenceScore
 */

/**
 * @typedef {object} RecommendedVisualAsset
 * @property {string} id
 * @property {string} title
 * @property {string} visual_type
 * @property {number} relevanceScore
 * @property {string[]} linkedClaims
 * @property {boolean} hasPreview
 * @property {boolean} mlrApproved
 * @property {object} matchingCriteria
 * @property {boolean} matchingCriteria.audienceMatch
 * @property {boolean} matchingCriteria.assetTypeMatch
 * @property {boolean} matchingCriteria.hasLinkedClaims
 */

/**
 * @typedef {object} RecommendedContentModule
 * @property {string} id
 * @property {string} module_text
 * @property {string} module_type
 * @property {boolean} mlr_approved
 * @property {number} relevanceScore
 * @property {string[]} linkedClaims
 * @property {object} matchingCriteria
 * @property {boolean} matchingCriteria.audienceMatch
 * @property {boolean} matchingCriteria.mlrApproved
 */

/**
 * @typedef {object} RecommendedEvidence
 * @property {RecommendedClaim[]} claims
 * @property {RecommendedVisualAsset[]} visualAssets
 * @property {RecommendedContentModule[]} contentModules
 * @property {object} matchingCriteria
 * @property {string} matchingCriteria.audienceUsed
 * @property {string[]} matchingCriteria.audienceMappedTo
 * @property {string} matchingCriteria.assetTypeUsed
 * @property {string[]} matchingCriteria.assetTypeMappedTo
 * @property {number} matchingCriteria.totalMatched
 */

export class EvidenceRecommendationService {
  /**
   * Map intake audience types to visual_assets.applicable_audiences values
   * Visual assets use generic lowercase values like 'hcp', 'patient', 'caregiver'
   * @param {AudienceType} audience
   * @returns {string[]}
   */
  static mapAudienceToVisualAssetFilter(audience) {
    const mapping = {
      'Physician-Specialist': ['hcp'],
      'Physician-PrimaryCare': ['hcp'],
      'Pharmacist': ['hcp'],
      'Nurse-RN': ['hcp'],
      'Nurse-NP-PA': ['hcp'],
      'Patient': ['patient'],
      'Caregiver-Family': ['caregiver'],
      'Caregiver-Professional': ['caregiver']
    };
    return mapping[audience] || ['hcp'];
  }

  /**
   * Map intake asset types to visual_assets.applicable_asset_types values
   * @param {string} assetType
   * @returns {string[]}
   */
  static mapAssetTypeToVisualAssetFilter(assetType) {
    const mapping = {
      'website-landing-page': ['landing_page', 'web', 'educational-material'],
      'mass-email': ['email', 'educational-material'],
      'patient-email': ['email', 'patient-brochure', 'educational-material'],
      'rep-triggered-email': ['email', 'detail_aid'],
      'digital-sales-aid': ['detail_aid', 'sales_aid', 'presentation'],
      'social-media-post': ['social', 'educational-material']
    };
    return mapping[assetType] || [];
  }

  /**
   * Map intake asset types to content_modules use cases
   * @param {string} assetType
   * @returns {string[]}
   */
  static mapAssetTypeToModuleType(assetType) {
    const mapping = {
      'website-landing-page': ['efficacy', 'safety', 'moa', 'general'],
      'mass-email': ['efficacy', 'safety', 'general'],
      'patient-email': ['safety', 'general'],
      'rep-triggered-email': ['efficacy', 'safety', 'moa'],
      'digital-sales-aid': ['efficacy', 'safety', 'moa', 'general'],
      'social-media-post': ['general']
    };
    return mapping[assetType] || ['general'];
  }

  /**
   * Calculate relevance score for a clinical claim
   * @param {object} claim
   * @param {AudienceType} audienceType
   * @param {string} assetType
   * @returns {number}
   */
  static calculateClaimRelevanceScore(
    claim,
    audienceType,
    assetType
  ) {
    let score = 0;

    // Exact audience match
    const targetAudiences = claim.target_audiences || [];
    if (targetAudiences.includes(audienceType)) {
      score += 40;
    }

    // Claim type relevance (efficacy/safety more relevant for clinical education)
    if (claim.claim_type === 'efficacy' || claim.claim_type === 'safety') {
      score += 30;
    } else if (claim.claim_type === 'moa' || claim.claim_type === 'indication') {
      score += 20;
    }

    // Has statistical data
    if (claim.statistical_data && Object.keys(claim.statistical_data).length > 0) {
      score += 15;
    }

    // High confidence score
    const confidenceScore = claim.confidence_score || 0;
    if (confidenceScore >= 0.8) {
      score += 15;
    } else if (confidenceScore >= 0.6) {
      score += 10;
    }

    return Math.min(score, 100);
  }

  /**
   * Calculate relevance score for a visual asset
   * @param {object} asset
   * @param {AudienceType} audienceType
   * @param {string} assetType
   * @returns {number}
   */
  static calculateVisualAssetRelevanceScore(
    asset,
    audienceType,
    assetType
  ) {
    let score = 0;

    // MLR approved
    if (asset.mlr_approved === true) {
      score += 30;
    }

    // Has linked claims
    const linkedClaims = asset.linked_claims || [];
    if (linkedClaims.length > 0) {
      score += 25;
    }

    // Exact audience match
    const applicableAudiences = asset.applicable_audiences || [];
    const mappedAudience = this.mapAudienceToVisualAssetFilter(audienceType);
    const hasAudienceMatch = mappedAudience.some(aud => applicableAudiences.includes(aud));
    if (hasAudienceMatch) {
      score += 25;
    }

    // Exact asset type match
    const applicableAssetTypes = asset.applicable_asset_types || [];
    const mappedAssetTypes = this.mapAssetTypeToVisualAssetFilter(assetType);
    const hasAssetTypeMatch = mappedAssetTypes.some(type => applicableAssetTypes.includes(type));
    if (hasAssetTypeMatch) {
      score += 20;
    }

    return Math.min(score, 100);
  }

  /**
   * Calculate relevance score for a content module
   * @param {object} module
   * @param {AudienceType} audienceType
   * @returns {number}
   */
  static calculateModuleRelevanceScore(
    module,
    audienceType
  ) {
    let score = 0;

    // MLR approved
    if (module.mlr_approved === true) {
      score += 40;
    }

    // Has linked claims
    const linkedClaims = module.linked_claims || [];
    if (linkedClaims.length > 0) {
      score += 30;
    }

    // Audience match
    const applicableAudiences = module.applicable_audiences || [];
    if (applicableAudiences.includes(audienceType)) {
      score += 30;
    }

    return Math.min(score, 100);
  }

  /**
   * Get recommended evidence (claims, visual assets, modules) based on context
   * @param {string} brandId
   * @param {string[]} assetTypes
   * @param {AudienceType} audienceType
   * @param {object} [options]
   * @param {number} [options.claimLimit=5]
   * @param {number} [options.visualLimit=5]
   * @param {number} [options.moduleLimit=5]
   * @param {boolean} [options.includeNonMLRApproved=true]
   * @returns {Promise<RecommendedEvidence>}
   */
  static async getRecommendedEvidence(
    brandId,
    assetTypes,
    audienceType,
    options
  ) {
    const {
      claimLimit = 5,
      visualLimit = 5,
      moduleLimit = 5,
      includeNonMLRApproved = true // Changed to show all assets by default, prioritizing MLR-approved in sorting
    } = options || {};

    console.log('[EvidenceRecommendation] Starting evidence recommendation', {
      brandId,
      assetTypes,
      audienceType,
      options
    });

    const primaryAssetType = assetTypes[0] || 'website-landing-page';

    // Map audience and asset types for querying
    const mappedAudienceForVisuals = this.mapAudienceToVisualAssetFilter(audienceType);
    const mappedAssetTypesForVisuals = this.mapAssetTypeToVisualAssetFilter(primaryAssetType);
    const mappedModuleTypes = this.mapAssetTypeToModuleType(primaryAssetType);

    console.log('[EvidenceRecommendation] Mapped filters:', {
      audienceType,
      mappedAudienceForVisuals,
      primaryAssetType,
      mappedAssetTypesForVisuals,
      mappedModuleTypes
    });

    // Query Clinical Claims
    console.log('[EvidenceRecommendation] Querying clinical claims...');
    const claimsQuery = supabase
      .from('clinical_claims')
      .select('*')
      .eq('brand_id', brandId)
      .contains('target_audiences', [audienceType])
      .order('usage_count', { ascending: false })
      .limit(claimLimit * 2); // Fetch extra to allow scoring/filtering

    const { data: claimsData, error: claimsError } = await claimsQuery;

    if (claimsError) {
      console.error('[EvidenceRecommendation] Claims query error:', claimsError);
    }

    console.log('[EvidenceRecommendation] Claims fetched:', claimsData?.length || 0);

    // Query Visual Assets
    console.log('[EvidenceRecommendation] Querying visual assets...');
    let visualQuery = supabase
      .from('visual_assets')
      .select('*')
      .eq('brand_id', brandId);

    // Filter by audience if mapped values exist
    if (mappedAudienceForVisuals.length > 0) {
      visualQuery = visualQuery.overlaps('applicable_audiences', mappedAudienceForVisuals);
    }

    // Filter by asset type if mapped values exist
    if (mappedAssetTypesForVisuals.length > 0) {
      visualQuery = visualQuery.overlaps('applicable_asset_types', mappedAssetTypesForVisuals);
    }

    // Optional: Filter by MLR approval
    if (!includeNonMLRApproved) {
      visualQuery = visualQuery.eq('mlr_approved', true);
    }

    visualQuery = visualQuery.limit(visualLimit * 2);

    const { data: visualsData, error: visualsError } = await visualQuery;

    if (visualsError) {
      console.error('[EvidenceRecommendation] Visuals query error:', visualsError);
    }

    console.log('[EvidenceRecommendation] Visual assets fetched:', visualsData?.length || 0);

    // Query Content Modules
    console.log('[EvidenceRecommendation] Querying content modules...');
    let moduleQuery = supabase
      .from('content_modules')
      .select('*')
      .eq('brand_id', brandId);

    // Filter by MLR approval
    if (!includeNonMLRApproved) {
      moduleQuery = moduleQuery.eq('mlr_approved', true);
    }

    moduleQuery = moduleQuery.order('usage_score', { ascending: false }).limit(moduleLimit * 2);

    const { data: modulesData, error: modulesError } = await moduleQuery;

    if (modulesError) {
      console.error('[EvidenceRecommendation] Modules query error:', modulesError);
    }

    console.log('[EvidenceRecommendation] Content modules fetched:', modulesData?.length || 0);

    // Process and score claims
    const recommendedClaims = (claimsData || [])
      .map(claim => {
        const relevanceScore = this.calculateClaimRelevanceScore(claim, audienceType, primaryAssetType);
        return {
          id: claim.id,
          claim_id_display: claim.claim_id_display || claim.id.substring(0, 8),
          claim_text: claim.claim_text,
          claim_type: claim.claim_type,
          review_status: claim.review_status || 'pending',
          relevanceScore,
          linkedReferences: [], // TODO: Fetch linked references
          matchingCriteria: {
            audienceMatch: (claim.target_audiences || []).includes(audienceType),
            claimTypeRelevance: ['efficacy', 'safety', 'moa'].includes(claim.claim_type),
            hasStatisticalData: !!(claim.statistical_data && Object.keys(claim.statistical_data).length > 0),
            confidenceScore: claim.confidence_score || 0
          }
        };
      })
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, claimLimit);

    // Process and score visual assets
    const recommendedVisuals = (visualsData || [])
      .map(asset => {
        const relevanceScore = this.calculateVisualAssetRelevanceScore(asset, audienceType, primaryAssetType);
        return {
          id: asset.id,
          title: asset.title,
          visual_type: asset.visual_type,
          relevanceScore,
          linkedClaims: asset.linked_claims || [],
          hasPreview: !!(asset.storage_path || asset.visual_data),
          mlrApproved: asset.mlr_approved || false,
          matchingCriteria: {
            audienceMatch: (asset.applicable_audiences || []).some((aud) =>
              mappedAudienceForVisuals.includes(aud)
            ),
            assetTypeMatch: (asset.applicable_asset_types || []).some((type) =>
              mappedAssetTypesForVisuals.includes(type)
            ),
            hasLinkedClaims: (asset.linked_claims || []).length > 0
          }
        };
      })
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, visualLimit);

    // Process and score content modules
    const recommendedModules = (modulesData || [])
      .map(module => {
        const relevanceScore = this.calculateModuleRelevanceScore(module, audienceType);
        return {
          id: module.id,
          module_text: module.module_text,
          module_type: module.module_type,
          mlr_approved: module.mlr_approved || false,
          relevanceScore,
          linkedClaims: module.linked_claims || [],
          matchingCriteria: {
            audienceMatch: (module.applicable_audiences || []).includes(audienceType),
            mlrApproved: module.mlr_approved || false
          }
        };
      })
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, moduleLimit);

    /** @type {RecommendedEvidence} */
    const result = {
      claims: recommendedClaims,
      visualAssets: recommendedVisuals,
      contentModules: recommendedModules,
      matchingCriteria: {
        audienceUsed: audienceType,
        audienceMappedTo: mappedAudienceForVisuals,
        assetTypeUsed: primaryAssetType,
        assetTypeMappedTo: mappedAssetTypesForVisuals,
        totalMatched: recommendedClaims.length + recommendedVisuals.length + recommendedModules.length
      }
    };

    console.log('[EvidenceRecommendation] Final results:', {
      claimsCount: result.claims.length,
      visualsCount: result.visualAssets.length,
      modulesCount: result.contentModules.length,
      totalMatched: result.matchingCriteria.totalMatched
    });

    return result;
  }
}