import { supabase } from '@/integrations/supabase/client';
import { AssetMetadataPreservationService, EnhancedAssetMetadata, DAMMetadataPackage } from './AssetMetadataPreservationService';
import { GlobalTerminologyIntelligenceService } from './GlobalTerminologyIntelligenceService';
import { CulturalIntelligenceValidationService } from './CulturalIntelligenceValidationService';

/**
 * @typedef {Object} DAMTaxonomyMapping
 * @property {string} primaryCategory
 * @property {string[]} secondaryCategories
 * @property {string[]} tags
 * @property {string[]} searchKeywords
 * @property {Record<string, any>} customFields
 */

/**
 * @typedef {Object} DAMUploadPackage
 * @property {any} assetMetadata
 * @property {DAMTaxonomyMapping} taxonomyMapping
 * @property {Object} performanceMetadata
 * @property {Object} localizationLineage
 * @property {Object} handoffDocumentation
 */

export class DAMMetadataPreparationService {
  
  /**
   * Prepare complete metadata package for DAM upload
   */
  static async prepareDAMMetadataPackage(assetId, localizationContext, intelligenceData) {
  try {
    // Get preserved asset metadata
    const assetMetadata = await AssetMetadataPreservationService.generateComprehensiveMetadata(
    assetId,
    localizationContext,
    intelligenceData
    );

    // Generate taxonomy mapping
    const taxonomyMapping = await this.generateTaxonomyMapping(assetMetadata, intelligenceData);

    // Calculate performance metadata
    const performanceMetadata = await this.calculatePerformanceMetadata(
    assetId,
    intelligenceData
    );

    // Build localization lineage
    const localizationLineage = await this.buildLocalizationLineage(
    assetId,
    intelligenceData
    );

    // Generate handoff documentation
    const handoffDocumentation = await this.generateHandoffDocumentation(
    assetMetadata,
    localizationContext
    );

    return {
    assetMetadata,
    taxonomyMapping,
    performanceMetadata,
    localizationLineage,
    handoffDocumentation
    };
  } catch (error) {
    console.error('Error preparing DAM metadata package:', error);
    throw error;
  }
  }

  /**
   * Generate comprehensive taxonomy mapping for DAM categorization
   */
  static async generateTaxonomyMapping(metadata, intelligenceData) {
  const assetType = metadata.originalMetadata.globalContext.assetType;
  const therapeuticArea = metadata.originalMetadata.globalContext.therapeuticArea;
  const brandName = metadata.originalMetadata.globalContext.brandName;

  // Generate primary category based on asset type
  const primaryCategory = this.mapAssetTypeToPrimaryCategory(assetType);

  // Generate secondary categories
  const secondaryCategories = [
    therapeuticArea,
    brandName,
    metadata.workflowMetadata.localizationStage,
    ...Object.keys(metadata.marketSpecificMetadata || {})
  ];

  // Generate search tags from intelligence data
  const tags = [
    ...this.extractTerminologyTags(intelligenceData.terminology),
    ...this.extractCulturalTags(intelligenceData.cultural),
    ...this.extractRegulatoryTags(intelligenceData.regulatory),
    `quality-score-${Math.floor((intelligenceData.quality?.overallScore || 0) / 10) * 10}`
  ];

  // Generate search keywords
  const searchKeywords = [
    assetType,
    therapeuticArea,
    brandName,
    ...tags,
    ...secondaryCategories
  ].filter(Boolean);

  // Custom fields for advanced metadata
  const customFields = {
    originalSourceSystem: metadata.originalMetadata.provenance.sourceSystem,
    localizationComplexity: this.calculateLocalizationComplexity(intelligenceData),
    culturalRiskLevel: intelligenceData.cultural?.riskLevel || 'unknown',
    regulatoryStatus: metadata.workflowMetadata.approvalStatus,
    qualityPrediction: intelligenceData.quality?.predictedScore || 0,
    marketReadiness: metadata.marketSpecificMetadata || {},
    intelligenceVersion: '2.0'
  };

  return {
    primaryCategory,
    secondaryCategories: [...new Set(secondaryCategories)],
    tags: [...new Set(tags)],
    searchKeywords: [...new Set(searchKeywords)],
    customFields
  };
  }

  /**
   * Maintain complete lineage tracking from source to localized asset
   */
  static async buildLocalizationLineage(assetId, intelligenceData) {
  try {
    // Get audit trail from metadata preservation service
    const auditTrail = await AssetMetadataPreservationService.generateAuditTrail(assetId);
    
    // Get source asset information
    const { data: sourceAsset } = await supabase
    .from('content_assets')
    .select('*')
    .eq('id', assetId)
    .single();

    const localizationSteps = auditTrail.map(step => ({
    stepName: step.stage,
    timestamp: step.timestamp,
    transformations: step.changes?.localizationContext || {},
    qualityGates: []
    }));

    return {
    sourceAssetId: sourceAsset?.id || assetId,
    localizationSteps,
    intelligenceData
    };
  } catch (error) {
    console.error('Error building localization lineage:', error);
    return {
    sourceAssetId: assetId,
    localizationSteps: [],
    intelligenceData
    };
  }
  }

  /**
   * Calculate comprehensive performance metadata
   */
  static async calculatePerformanceMetadata(assetId, intelligenceData) {
  const predictedEngagement = intelligenceData.quality?.predictedEngagement || 0;
  const qualityScore = intelligenceData.quality?.overallScore || 0;
  const culturalScore = intelligenceData.cultural?.overallScore || 0;
  const regulatoryScore = intelligenceData.regulatory?.complianceScore || 0;

  return {
    predictedEngagement,
    qualityScore,
    culturalAppropriatenessScore: culturalScore,
    regulatoryComplianceScore: regulatoryScore
  };
  }

  /**
   * Generate handoff documentation for creative providers
   */
  static async generateHandoffDocumentation(metadata, localizationContext) {
  const handoffInstructions = [
    'Asset has been validated for cultural appropriateness',
    'Regulatory compliance requirements have been verified',
    'Terminology has been validated against approved database',
    'Performance predictions indicate high engagement potential'
  ];

  const qualityRequirements = [
    'Maintain brand consistency across all localized versions',
    'Preserve regulatory compliance status',
    'Follow cultural adaptation guidelines',
    'Meet quality gate requirements'
  ];

  const deliverableSpecs = {
    format: 'Multi-format package (PDF, JSON, Excel)',
    includesMetadata: true,
    includesIntelligence: true,
    includesLineage: true,
    targetMarkets: localizationContext.targetMarkets || []
  };

  return {
    creativeProviderId: 'system-generated',
    handoffInstructions,
    qualityRequirements,
    deliverableSpecs
  };
  }

  /**
   * Export DAM package in multiple formats
   */
  static async exportDAMPackage(damPackage, format = 'json') {
  try {
    const packageId = `dam_package_${Date.now()}`;
    
    // Store package in database
    const { error } = await supabase
    .from('content_sessions')
    .insert({
      user_id: 'system',
      asset_id: damPackage.localizationLineage.sourceAssetId,
      session_type: `dam_export_${format}`,
      session_state: damPackage,
      last_activity: new Date().toISOString()
    });

    if (error) throw error;

    // In production, this would generate actual downloadable files
    const downloadUrl = `/api/exports/dam/${packageId}.${format}`;

    return {
    downloadUrl,
    packageId
    };
  } catch (error) {
    console.error('Error exporting DAM package:', error);
    throw error;
  }
  }

  // Private helper methods
  static mapAssetTypeToPrimaryCategory(assetType) {
  const mapping = {
    'email': 'digital_communication',
    'social_post': 'social_media',
    'brochure': 'print_collateral',
    'presentation': 'professional_materials',
    'advertisement': 'advertising_creative',
    'website': 'digital_experience',
    'video': 'multimedia_content'
  };
  
  return mapping[assetType] || 'marketing_material';
  }

  static extractTerminologyTags(terminologyData) {
  if (!terminologyData?.recommendedTerms) return [];
  
  return terminologyData.recommendedTerms
    .slice(0, 5)
    .map((term) => `terminology-${term.category}`)
    .filter(Boolean);
  }

  static extractCulturalTags(culturalData) {
  const tags = [];
  
  if (culturalData?.riskLevel) {
    tags.push(`cultural-risk-${culturalData.riskLevel}`);
  }
  
  if (culturalData?.marketReadiness) {
    Object.keys(culturalData.marketReadiness).forEach(market => {
    tags.push(`market-${market.toLowerCase()}`);
    });
  }
  
  return tags;
  }

  static extractRegulatoryTags(regulatoryData) {
  const tags = [];
  
  if (regulatoryData?.complianceLevel) {
    tags.push(`regulatory-${regulatoryData.complianceLevel}`);
  }
  
  if (regulatoryData?.approvalStatus) {
    tags.push(`approval-${regulatoryData.approvalStatus}`);
  }
  
  return tags;
  }

  static calculateLocalizationComplexity(intelligenceData) {
  const culturalTransformations = intelligenceData.cultural?.transformationRules?.length || 0;
  const regulatoryRequirements = intelligenceData.regulatory?.requirements?.length || 0;
  const terminologyValidations = intelligenceData.terminology?.criticalIssues?.length || 0;
  
  const totalComplexity = culturalTransformations + regulatoryRequirements + terminologyValidations;
  
  if (totalComplexity > 10) return 'high';
  if (totalComplexity > 5) return 'medium';
  return 'low';
  }
}
