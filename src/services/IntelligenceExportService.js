// Intelligence Export Service
// Handles generation, export, and sharing of intelligence reports.

import { supabase } from "../integrations/supabase/client.js";

export class IntelligenceExportService {

  /**
   * Generate comprehensive intelligence report in multiple formats
   * @param {string} assetId
   * @param {string} brandId
   * @param {object} intelligenceData
   * @param {'comprehensive' | 'executive' | 'technical' | 'handoff'} [reportType='comprehensive']
   * @returns {Promise<object>} IntelligenceReport object.
   */
  static async generateIntelligenceReport(
    assetId,
    brandId,
    intelligenceData,
    reportType = 'comprehensive'
  ) {
    try {
      const reportId = `report_${assetId}_${Date.now()}`;

      // Generate sections based on report type
      const sections = await this.generateReportSections(
        assetId,
        intelligenceData,
        reportType
      );

      // Get export metadata
      const exportMetadata = await this.generateExportMetadata(assetId, brandId);

      const report = {
        assetId,
        reportId,
        generatedAt: new Date().toISOString(),
        reportType,
        sections,
        exportMetadata
      };

      // Store report for future access
      await this.storeGeneratedReport(report);

      return report;
    } catch (error) {
      console.error('Error generating intelligence report:', error);
      throw error;
    }
  }

  /**
   * Export report in specified format with custom configuration
   * @param {object} report
   * @param {object} config - ExportConfiguration object.
   * @returns {Promise<{ downloadUrl: string, exportId: string }>}
   */
  static async exportReport(
    report,
    config
  ) {
    try {
      const exportId = `export_${report.reportId}_${config.format}`;

      // Generate format-specific content
      let exportContent;
      switch (config.format) {
        case 'pdf':
          exportContent = await this.generatePDFContent(report, config);
          break;
        case 'excel':
          exportContent = await this.generateExcelContent(report, config);
          break;
        case 'word':
          exportContent = await this.generateWordContent(report, config);
          break;
        case 'json':
        default:
          exportContent = await this.generateJSONContent(report, config);
          break;
      }

      // Store export for download
      const downloadUrl = await this.storeExportForDownload(exportId, exportContent, config.format);

      return {
        downloadUrl,
        exportId
      };
    } catch (error) {
      console.error('Error exporting report:', error);
      throw error;
    }
  }

  /**
   * Create shareable progress links for stakeholder access
   * @param {string} assetId
   * @param {'view' | 'comment' | 'edit'} accessLevel
   * @param {number} [expirationDays=7]
   * @param {string} [recipientEmail]
   * @param {string[]} [includedSections=['all']]
   * @returns {Promise<object>} ShareableProgressLink object.
   */
  static async createShareableProgressLink(
    assetId,
    accessLevel,
    expirationDays = 7,
    recipientEmail,
    includedSections = ['all']
  ) {
    try {
      const linkId = `share_${assetId}_${Date.now()}`;
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expirationDays);

      const shareableLink = {
        linkId,
        assetId,
        accessLevel,
        expiresAt: expiresAt.toISOString(),
        recipientEmail,
        includesSections: includedSections
      };

      // Store shareable link
      await this.storeShareableLink(shareableLink);

      return shareableLink;
    } catch (error) {
      console.error('Error creating shareable progress link:', error);
      throw error;
    }
  }

  /**
   * Generate API-ready data packages for system integration
   * @param {string} assetId
   * @param {object} intelligenceData
   * @param {string[]} [targetSystems=['TMS', 'DAM', 'CMS']]
   * @returns {Promise<object>} API packages keyed by system type.
   */
  static async generateAPIPackage(
    assetId,
    intelligenceData,
    targetSystems = ['TMS', 'DAM', 'CMS']
  ) {
    try {
      const apiPackages = {};

      for (const system of targetSystems) {
        apiPackages[system] = await this.generateSystemSpecificPackage(
          assetId,
          intelligenceData,
          system
        );
      }

      return apiPackages;
    } catch (error) {
      console.error('Error generating API packages:', error);
      throw error;
    }
  }

  /**
   * Batch export multiple assets with consolidated intelligence
   * @param {string[]} assetIds
   * @param {object} config - ExportConfiguration with consolidationLevel.
   * @returns {Promise<object>} Batch export results.
   */
  static async batchExportAssets(
    assetIds,
    config
  ) {
    try {
      const batchId = `batch_${Date.now()}`;
      const downloads = [];

      // Process each asset
      for (const assetId of assetIds) {
        // Get intelligence data for asset
        const intelligenceData = await this.getAssetIntelligenceData(assetId);

        // Generate individual report
        const report = await this.generateIntelligenceReport(
          assetId,
          intelligenceData.brandId,
          intelligenceData,
          'comprehensive'
        );

        // Export individual report
        const exportResult = await this.exportReport(report, config);
        downloads.push({
          assetId,
          downloadUrl: exportResult.downloadUrl
        });
      }

      // Generate consolidated report if requested
      let consolidatedReport;
      if (config.consolidationLevel !== 'individual') {
        consolidatedReport = await this.generateConsolidatedReport(assetIds, config);
      }

      return {
        batchId,
        downloads,
        consolidatedReport
      };
    } catch (error) {
      console.error('Error in batch export:', error);
      throw error;
    }
  }

  // Private helper methods

  /**
   * @private
   */
  static async generateReportSections(
    assetId,
    intelligenceData,
    reportType
  ) {
    const sections = {};

    // Executive Summary (included in all report types)
    sections.executive_summary = {
      overallScore: this.calculateOverallIntelligenceScore(intelligenceData),
      keyFindings: this.extractKeyFindings(intelligenceData),
      criticalRecommendations: this.extractCriticalRecommendations(intelligenceData),
      readinessStatus: this.determineReadinessStatus(intelligenceData)
    };

    // Detailed sections based on report type
    if (reportType === 'comprehensive' || reportType === 'technical') {
      sections.terminology_intelligence = intelligenceData.terminology || {};
      sections.cultural_intelligence = intelligenceData.cultural || {};
      sections.regulatory_intelligence = intelligenceData.regulatory || {};
      sections.quality_intelligence = intelligenceData.quality || {};
      sections.performance_predictions = intelligenceData.performance || {};
    }

    if (reportType === 'handoff') {
      sections.handoff_instructions = await this.generateHandoffInstructions(intelligenceData);
      sections.quality_requirements = await this.generateQualityRequirements(intelligenceData);
      sections.deliverable_specifications = await this.generateDeliverableSpecs(intelligenceData);
    }

    // Recommendations (included in all types)
    sections.recommendations = {
      immediate_actions: this.generateImmediateActions(intelligenceData),
      optimization_opportunities: this.generateOptimizationOpportunities(intelligenceData),
      risk_mitigation: this.generateRiskMitigation(intelligenceData)
    };

    return sections;
  }

  /**
   * @private
   */
  static async generateExportMetadata(assetId, brandId) {
    // Get asset data
    const { data: assetData } = await supabase
      .from('content_assets')
      .select('*')
      .eq('id', assetId)
      .single();

    return {
      generatedBy: 'Intelligence Export Service',
      brandId,
      targetMarkets: ['US'], // In production, get from localization context
      localizationStatus: assetData?.status || 'unknown'
    };
  }

  /**
   * @private
   */
  static async generatePDFContent(report, config) {
    // In production, this would generate actual PDF content
    return {
      format: 'pdf',
      content: {
        title: `Intelligence Report - ${report.assetId}`,
        sections: config.includeIntelligence ? report.sections : { executive_summary: report.sections.executive_summary },
        metadata: config.includeMetadata ? report.exportMetadata : null,
        generatedAt: report.generatedAt
      }
    };
  }

  /**
   * @private
   */
  static async generateExcelContent(report, config) {
    // Generate Excel-structured data
    return {
      format: 'excel',
      worksheets: {
        'Executive Summary': this.formatForExcel(report.sections.executive_summary),
        'Terminology Data': config.includeIntelligence ? this.formatForExcel(report.sections.terminology_intelligence) : null,
        'Cultural Intelligence': config.includeIntelligence ? this.formatForExcel(report.sections.cultural_intelligence) : null,
        'Regulatory Data': config.includeIntelligence ? this.formatForExcel(report.sections.regulatory_intelligence) : null
      }
    };
  }

  /**
   * @private
   */
  static async generateWordContent(report, config) {
    return {
      format: 'docx',
      content: {
        title: `Intelligence Report - ${report.assetId}`,
        sections: report.sections,
        template: config.templateId || 'default_intelligence_template'
      }
    };
  }

  /**
   * @private
   */
  static async generateJSONContent(report, config) {
    return {
      format: 'json',
      data: {
        report,
        exportConfiguration: config,
        apiVersion: '2.0'
      }
    };
  }

  /**
   * @private
   */
  static async storeGeneratedReport(report) {
    const { error } = await supabase
      .from('content_sessions')
      .insert({
        user_id: 'system',
        asset_id: report.assetId,
        session_type: `intelligence_report_${report.reportType}`,
        session_state: report,
        last_activity: new Date().toISOString()
      });

    if (error) {
      console.error('Error storing generated report:', error);
    }
  }

  /**
   * @private
   */
  static async storeExportForDownload(exportId, content, format) {
    // In production, this would upload to file storage and return actual download URL
    const { error } = await supabase
      .from('content_sessions')
      .insert({
        user_id: 'system',
        session_type: `export_${format}`,
        session_state: { exportId, content },
        last_activity: new Date().toISOString()
      });

    if (error) {
      console.error('Error storing export:', error);
    }

    return `/api/downloads/${exportId}.${format}`;
  }

  /**
   * @private
   */
  static async storeShareableLink(link) {
    const { error } = await supabase
      .from('content_sessions')
      .insert({
        user_id: 'system',
        asset_id: link.assetId,
        session_type: 'shareable_link',
        session_state: link,
        last_activity: new Date().toISOString()
      });

    if (error) {
      console.error('Error storing shareable link:', error);
    }
  }

  /**
   * @private
   */
  static async generateSystemSpecificPackage(
    assetId,
    intelligenceData,
    systemType
  ) {
    const packages = {
      'TMS': {
        endpoint: '/api/tms/import',
        payload: {
          assetId,
          translationMemory: intelligenceData.terminology,
          qualityGates: intelligenceData.quality,
          culturalGuidelines: intelligenceData.cultural
        },
        authentication: 'Bearer token required',
        documentation: 'TMS Import API v2.0'
      },
      'DAM': {
        endpoint: '/api/dam/upload',
        payload: {
          assetId,
          metadata: intelligenceData,
          taxonomy: 'auto-generated',
          searchKeywords: 'extracted from intelligence'
        },
        authentication: 'API Key required',
        documentation: 'DAM Integration API v1.5'
      },
      'CMS': {
        endpoint: '/api/cms/content',
        payload: {
          assetId,
          contentData: intelligenceData,
          publishingWorkflow: 'enabled',
          approvalStatus: 'pending'
        },
        authentication: 'OAuth 2.0',
        documentation: 'CMS Content API v3.0'
      }
    };

    return packages[systemType] || packages['TMS'];
  }

  // Helper methods for report generation
  /**
   * @private
   */
  static calculateOverallIntelligenceScore(intelligenceData) {
    const scores = [
      intelligenceData.terminology?.overallComplianceScore || 0,
      intelligenceData.cultural?.overallScore || 0,
      intelligenceData.regulatory?.complianceScore || 0,
      intelligenceData.quality?.overallScore || 0
    ];

    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  }

  /**
   * @private
   */
  static extractKeyFindings(intelligenceData) {
    const findings = [];

    if (intelligenceData.terminology?.criticalIssues?.length > 0) {
      findings.push(`${intelligenceData.terminology.criticalIssues.length} terminology issues require attention`);
    }

    if (intelligenceData.cultural?.riskLevel === 'high') {
      findings.push('High cultural adaptation requirements identified');
    }

    if (intelligenceData.regulatory?.complianceScore < 70) {
      findings.push('Regulatory compliance review recommended');
    }

    return findings;
  }

  /**
   * @private
   */
  static extractCriticalRecommendations(intelligenceData) {
    const recommendations = [];

    if (intelligenceData.terminology?.recommendations) {
      recommendations.push(...intelligenceData.terminology.recommendations.slice(0, 2));
    }

    if (intelligenceData.cultural?.recommendations) {
      recommendations.push(...intelligenceData.cultural.recommendations.slice(0, 2));
    }

    return recommendations;
  }

  /**
   * @private
   */
  static determineReadinessStatus(intelligenceData) {
    const overallScore = this.calculateOverallIntelligenceScore(intelligenceData);

    if (overallScore >= 85) return 'ready';
    if (overallScore >= 70) return 'needs_review';
    return 'blocked';
  }

  /**
   * @private
   */
  static async generateHandoffInstructions(intelligenceData) {
    return [
      'Asset has completed intelligence analysis',
      'Cultural adaptations have been identified and documented',
      'Regulatory compliance requirements are specified',
      'Quality predictions indicate optimal performance potential'
    ];
  }

  /**
   * @private
   */
  static async generateQualityRequirements(intelligenceData) {
    return [
      'Maintain terminology consistency across all deliverables',
      'Follow cultural adaptation guidelines for target markets',
      'Ensure regulatory compliance is preserved in final output',
      'Meet or exceed quality prediction benchmarks'
    ];
  }

  /**
   * @private
   */
  static async generateDeliverableSpecs(intelligenceData) {
    return {
      formats: ['PDF', 'JSON', 'Excel'],
      includesIntelligence: true,
      includesMetadata: true,
      targetMarkets: Object.keys(intelligenceData.cultural?.marketReadiness || {}),
      qualityGates: intelligenceData.quality?.gates || []
    };
  }

  /**
   * @private
   */
  static generateImmediateActions(intelligenceData) {
    const actions = [];

    if (intelligenceData.terminology?.criticalIssues?.length > 0) {
      actions.push('Resolve critical terminology issues');
    }

    if (intelligenceData.cultural?.riskLevel === 'high') {
      actions.push('Review cultural adaptation requirements');
    }

    return actions;
  }

  /**
   * @private
   */
  static generateOptimizationOpportunities(intelligenceData) {
    return [
      'Leverage pre-approved terminology for faster processing',
      'Apply cultural best practices for enhanced market resonance',
      'Utilize regulatory templates for compliance efficiency'
    ];
  }

  /**
   * @private
   */
  static generateRiskMitigation(intelligenceData) {
    return [
      'Implement terminology validation workflow',
      'Conduct cultural sensitivity review',
      'Perform regulatory compliance verification'
    ];
  }

  /**
   * @private
   */
  static formatForExcel(data) {
    // Convert object data to Excel-friendly format
    if (!data || typeof data !== 'object') return [['No data available']];

    const rows = [['Key', 'Value']];

    Object.entries(data).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        rows.push([key, JSON.stringify(value)]);
      } else {
        rows.push([key, String(value)]);
      }
    });

    return rows;
  }

  /**
   * @private
   */
  static async getAssetIntelligenceData(assetId) {
    // In production, this would fetch comprehensive intelligence data
    return {
      brandId: 'mock-brand-id',
      terminology: {},
      cultural: {},
      regulatory: {},
      quality: {}
    };
  }

  /**
   * @private
   */
  static async generateConsolidatedReport(assetIds, config) {
    // Generate consolidated report across multiple assets
    return {
      downloadUrl: `/api/downloads/consolidated_${Date.now()}.${config.format}`
    };
  }
}