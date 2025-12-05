import { AssetTypeLayoutManager } from './assetTypeLayoutManager';
import { SmartContentGenerator } from './smartContentGenerator';
import { AssetTypeContentFormatter } from './assetTypeContentFormatter';

/**
 * @typedef {object} ThemeData
 * @property {string} [id]
 * @property {string} theme_name
 * @property {string} [asset_name]
 * @property {string} core_message
 * @property {string} therapeutic_focus
 * @property {string} target_audience
 * @property {string[]} key_benefits
 * @property {string} clinical_positioning
 * @property {string} emotional_tone
 * @property {string[]} content_pillars
 * @property {string[]} proof_points
 * @property {string[]} differentiation_claims
 * @property {string[]} cta_frameworks
 * @property {string[]} visual_concepts
 * @property {object} messaging_hierarchy
 * @property {string} messaging_hierarchy.primary
 * @property {string[]} messaging_hierarchy.secondary
 * @property {string[]} messaging_hierarchy.supporting
 */

/**
 * @typedef {object} PiFilteringResult
 * @property {Record<string, any>} selectedSections
 * @property {string[]} reasoning
 * @property {number} relevanceScore
 * @property {string} usageGuidance
 */

/**
 * @typedef {object} StrategicContext
 * @property {string} campaignObjective
 * @property {string} keyMessage
 * @property {string} targetAudience
 * @property {string} indication
 * @property {string} assetType
 */

/**
 * @typedef {object} IntakeContext
 * @property {string} [original_key_message]
 * @property {string} [original_cta]
 * @property {string} [intake_objective]
 * @property {string} [intake_audience]
 * @property {string} [indication]
 * @property {any} [brand_guidelines]
 * @property {string} [theme_id]
 * @property {string} [campaign_id]
 * @property {string} [specialistType]
 * @property {string} [specialistDisplayName]
 * @property {string} [therapeuticArea]
 * @property {string} [requestId]
 * @property {StrategicContext} [strategicContext]
 * @property {PiFilteringResult} [piFilteringResult]
 */

/**
 * @typedef {object} ContentInitializationOptions
 * @property {boolean} useThemeContent
 * @property {boolean} useIntakeContext
 * @property {boolean} generateMissingContent
 * @property {boolean} assetTypeOptimization
 */

/**
 * @typedef {object} IntelligenceUsed
 * @property {'evidence' | 'performance' | 'competitive' | 'audience' | 'brand'} type
 * @property {string} source
 * @property {string} id
 * @property {string} content
 * @property {number} confidence
 */

/**
 * @typedef {object} CitationData
 * @property {any[]} claimsUsed
 * @property {any[]} referencesUsed
 * @property {any[]} modulesUsed
 * @property {any[]} visualsUsed
 */

/**
 * @typedef {object} InitializedContent
 * @property {Record<string, any>} content
 * @property {Record<string, string>} generationSources
 * @property {string[]} suggestions
 * @property {number} completeness
 * @property {CitationData} [citationData]
 * @property {IntelligenceUsed[]} [intelligenceUsed]
 */

/**
 * Manages the initialization of content for a specific asset type,
 * combining structured theme data, user intake context, and AI generation
 * integrated with an Evidence Library.
 * @class
 */
export class ThemeContentInitializer {
  /**
   * Initialize content based on selected theme and asset type
   *
   * @static
   * @param {string} assetType
   * @param {ThemeData} themeData
   * @param {IntakeContext} [intakeContext={}]
   * @param {string} brandId
   * @param {ContentInitializationOptions} [options]
   * @param {any} [piData]
   * @returns {Promise<InitializedContent>}
   */
  static async initializeFromTheme(
    assetType,
    themeData,
    intakeContext = {},
    brandId,
    options = {
      useThemeContent: true,
      useIntakeContext: true,
      generateMissingContent: true,
      assetTypeOptimization: true
    },
    piData
  ) {
    try {
      console.log('🚀 ThemeContentInitializer: Initializing content', {
        assetType,
        hasThemeData: !!themeData,
        hasIntakeContext: !!intakeContext,
        hasStrategicContext: !!intakeContext?.strategicContext,
        hasPiFilteringResult: !!intakeContext?.piFilteringResult,
        options
      });

      // Validate that we have the necessary strategic context for PI-aware generation
      if (!intakeContext?.strategicContext) {
        console.warn('⚠️ Missing strategic context - content may lack clinical targeting');
      }
      
      if (!intakeContext?.indication) {
        console.warn('⚠️ Missing indication - content may lack disease-specific messaging');
      }

      if (intakeContext?.piFilteringResult) {
        console.log('✅ PI filtering result available:', {
          relevanceScore: intakeContext.piFilteringResult.relevanceScore,
          sectionsCount: Object.keys(intakeContext.piFilteringResult.selectedSections).length,
          reasoning: intakeContext.piFilteringResult.reasoning
        });
      } else {
        console.log('ℹ️ No PI filtering result - generating theme-based content only');
      }

      const layout = AssetTypeLayoutManager.getLayout(assetType);
      if (!layout) {
        throw new Error(`Unsupported asset type: ${assetType}`);
      }

      /** @type {Record<string, any>} */
      const initializedContent = {};
      /** @type {Record<string, string>} */
      const generationSources = {};
      /** @type {string[]} */
      const suggestions = [];

      // Step 1: Initialize with theme-based content
      if (options.useThemeContent && themeData) {
        await this.populateFromTheme(
          initializedContent,
          generationSources,
          assetType,
          themeData,
          intakeContext
        );
      }

      // Step 2: Override with intake context if available
      if (options.useIntakeContext && intakeContext) {
        this.populateFromIntakeContext(
          initializedContent,
          generationSources,
          intakeContext
        );
      }

      // Step 3: Always generate rich initial content using AI with Evidence Library
      /** @type {CitationData | undefined} */
      let citationData;
      
      if (options.generateMissingContent) {
        console.log('Generating rich initial content with Evidence Library', piData ? 'with PI data' : 'without PI data');
        
        // Add unique request ID to prevent caching
        const requestId = `${brandId}-${Date.now()}-${Math.random().toString(36).substring(7)}`;
        console.log('🔄 ThemeContentInitializer: Generating content with requestId:', requestId);
        
        const richContent = await this.generateRichInitialContent(
          themeData,
          { ...intakeContext, requestId },
          assetType,
          brandId,
          piData || undefined
        );
        
        if (richContent) {
          // Extract citationData before merging into content
          if (richContent.citationData) {
            citationData = richContent.citationData;
            delete richContent.citationData; // Remove from content object
          }
          
          // Remove intelligenceUsed from content before merging
          const intelligenceUsed = richContent.intelligenceUsed;
          delete richContent.intelligenceUsed;
          
          Object.assign(initializedContent, richContent);
          Object.keys(richContent).forEach(key => {
            generationSources[key] = 'ai_evidence_library';
          });
          suggestions.push('Generated market-ready content using Evidence Library (clinical claims, references, and segments)');
          
          // Track intelligence usage from content generation
          if (themeData.id && intelligenceUsed) {
            await this.trackIntelligenceUsage(
              brandId,
              themeData.id,
              assetType,
              intakeContext,
              intelligenceUsed
            );
          }
        }
      }

      // Step 4: Asset-type specific optimizations
      if (options.assetTypeOptimization) {
        this.applyAssetTypeOptimizations(
          initializedContent,
          assetType,
          themeData,
          suggestions
        );
      }

      const completeness = this.calculateCompleteness(initializedContent, layout);

      console.log('ThemeContentInitializer: Content initialized', {
        content: initializedContent,
        completeness,
        sources: generationSources,
        hasCitationData: !!citationData
      });

      return {
        content: initializedContent,
        generationSources,
        suggestions,
        completeness,
        citationData
      };

    } catch (error) {
      console.error('ThemeContentInitializer: Error initializing content', error);
      console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
      console.error('Theme data:', themeData);
      console.error('Intake context:', intakeContext);
      
      // Return theme-based content as fallback using the formatter
      const layout = AssetTypeLayoutManager.getLayout(assetType);
      /** @type {Record<string, any>} */
      let fallbackContent = {};
      
      if (themeData) {
        // Use formatter for structured fallback content
        /** @type {import('./assetTypeContentFormatter').ContentContext} */
        const fallbackContext = {
          themeName: themeData.theme_name,
          coreMessage: themeData.core_message,
          therapeuticFocus: themeData.therapeutic_focus,
          targetAudience: themeData.target_audience || intakeContext?.intake_audience,
          keyBenefits: themeData.key_benefits || [],
          clinicalPositioning: themeData.clinical_positioning,
          proofPoints: themeData.proof_points || [],
          callToAction: themeData.cta_frameworks?.[0],
          indication: intakeContext?.indication,
        };
        
        const formattedFallback = AssetTypeContentFormatter.format(assetType, fallbackContext);
        fallbackContent = { ...formattedFallback };
        
        console.log('⚠️ Using formatted fallback content:', Object.keys(fallbackContent));
      } else if (layout) {
        // Last resort: use layout defaults with empty strings
        layout.sections.forEach(section => {
          section.fields.forEach(field => {
            fallbackContent[field.id] = '';
          });
        });
      }

      return {
        content: fallbackContent,
        generationSources: { fallback: 'error_recovery' },
        suggestions: [
          'Content initialization encountered an error. Basic theme content was used.',
          'Please review and enhance the content manually.',
          `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
        ],
        completeness: 30
      };
    }
  }

  /**
   * Populate content from theme data using asset-type-specific formatter
   *
   * @private
   * @static
   * @param {Record<string, any>} content
   * @param {Record<string, string>} sources
   * @param {string} assetType
   * @param {ThemeData} themeData
   * @param {IntakeContext} intakeContext
   * @returns {Promise<void>}
   */
  static async populateFromTheme(
    content,
    sources,
    assetType,
    themeData,
    intakeContext
  ) {
    // Build context for the formatter
    /** @type {import('./assetTypeContentFormatter').ContentContext} */
    const formatterContext = {
      themeName: themeData.theme_name,
      coreMessage: themeData.core_message,
      therapeuticFocus: themeData.therapeutic_focus,
      targetAudience: themeData.target_audience || intakeContext.intake_audience,
      keyBenefits: themeData.key_benefits || [],
      clinicalPositioning: themeData.clinical_positioning,
      proofPoints: themeData.proof_points || [],
      callToAction: themeData.cta_frameworks?.[0],
      indication: intakeContext.indication,
      objective: intakeContext.intake_objective,
    };

    // Get properly formatted content for the asset type
    const formattedContent = AssetTypeContentFormatter.format(assetType, formatterContext);

    // Apply all formatted fields
    Object.entries(formattedContent).forEach(([field, value]) => {
      if (value && typeof value === 'string' && value.trim()) {
        content[field] = value;
        sources[field] = 'theme_formatted';
      }
    });

    // Also set keyMessage from core message if not already set
    if (themeData.core_message && !content.keyMessage) {
      content.keyMessage = themeData.core_message;
      sources.keyMessage = 'theme';
    }

    console.log('📝 Content populated from theme with formatter:', {
      assetType,
      fieldsPopulated: Object.keys(formattedContent).filter(k => formattedContent[k]),
      targetAudience: formatterContext.targetAudience
    });
  }

  /**
   * Populate content from intake context
   *
   * @private
   * @static
   * @param {Record<string, any>} content
   * @param {Record<string, string>} sources
   * @param {IntakeContext} intakeContext
   * @returns {void}
   */
  static populateFromIntakeContext(
    content,
    sources,
    intakeContext
  ) {
    if (intakeContext.original_key_message) {
      content.keyMessage = intakeContext.original_key_message;
      sources.keyMessage = 'intake';
      
      // Also use as body fallback if not set
      if (!content.body) {
        content.body = `${intakeContext.original_key_message}\n\nThis innovative treatment approach offers new hope for patients seeking effective management of their condition.`;
        sources.body = 'intake+expansion';
      }
    }

    if (intakeContext.original_cta) {
      content.cta = intakeContext.original_cta;
      sources.cta = 'intake';
      
      // Set for all CTA fields
      content.heroCta = intakeContext.original_cta;
      sources.heroCta = 'intake';
    }
  }

  /**
   * Generate missing content using AI
   *
   * @private
   * @static
   * @param {Record<string, any>} content
   * @param {Record<string, string>} sources
   * @param {string[]} suggestions
   * @param {any} layout
   * @param {import('./smartContentGenerator').ContentGenerationContext} context
   * @param {string} assetType
   * @returns {Promise<void>}
   */
  static async generateMissingContent(
    content,
    sources,
    suggestions,
    layout,
    context,
    assetType
  ) {
    const aiEnabledFields = AssetTypeLayoutManager.getAIEnabledFields(assetType);
    
    for (const field of aiEnabledFields) {
      if (!content[field] || content[field].toString().trim().length < 10) {
        try {
          const result = await SmartContentGenerator.generateContent(field, context, 'create');
          if (result.content) {
            content[field] = result.content;
            sources[field] = 'ai_generated';
            suggestions.push(`Generated ${field}: ${result.rationale}`);
          }
        } catch (error) {
          console.warn(`Failed to generate AI content for field: ${field}`, error);
        }
      }
    }
  }

  /**
   * Apply asset-type specific optimizations
   *
   * @private
   * @static
   * @param {Record<string, any>} content
   * @param {string} assetType
   * @param {ThemeData} themeData
   * @param {string[]} suggestions
   * @returns {void}
   */
  static applyAssetTypeOptimizations(
    content,
    assetType,
    themeData,
    suggestions
  ) {
    switch (assetType) {
      case 'mass-email':
        this.optimizeForEmail(content, themeData, suggestions);
        break;
      case 'social-media-post':
        this.optimizeForSocial(content, themeData, suggestions);
        break;
      case 'website-landing-page':
        this.optimizeForWeb(content, themeData, suggestions);
        break;
      case 'digital-sales-aid':
        this.optimizeForSalesAid(content, themeData, suggestions);
        break;
    }
  }

  // Theme-based content generators (mostly unused in the main flow, but provided for completeness)

  /**
   * Generates a theme-based subject line.
   * @private
   * @static
   * @param {ThemeData} themeData
   * @param {string} assetType
   * @returns {string}
   */
  static generateThemeBasedSubject(themeData, assetType) {
    const templates = [
      `New insights: ${themeData.core_message}`,
      `${themeData.therapeutic_focus}: ${themeData.key_benefits?.[0] || 'Latest developments'}`,
      `Understanding ${themeData.therapeutic_focus} management`
    ];
    
    return templates[0]; // Use first template as default
  }

  /**
   * Generates a theme-based preheader.
   * @private
   * @static
   * @param {ThemeData} themeData
   * @returns {string}
   */
  static generateThemeBasedPreheader(themeData) {
    return `${themeData.clinical_positioning} - ${themeData.key_benefits?.[0] || 'Learn more'}`;
  }

  /**
   * Generates theme-based body content using the formatter.
   * @private
   * @static
   * @param {ThemeData} themeData
   * @param {string} assetType
   * @returns {string}
   */
  static generateThemeBasedBody(themeData, assetType) {
    /** @type {import('./assetTypeContentFormatter').ContentContext} */
    const context = {
      themeName: themeData.theme_name,
      coreMessage: themeData.core_message,
      therapeuticFocus: themeData.therapeutic_focus,
      targetAudience: themeData.target_audience,
      keyBenefits: themeData.key_benefits,
      clinicalPositioning: themeData.clinical_positioning,
      proofPoints: themeData.proof_points,
      callToAction: themeData.cta_frameworks?.[0],
    };

    const formatted = AssetTypeContentFormatter.format(assetType, context);
    return formatted.body || '';
  }

  /**
   * Generates social media content.
   * @private
   * @static
   * @param {ThemeData} themeData
   * @returns {string}
   */
  static generateSocialContent(themeData) {
    return `${themeData.core_message} 

${themeData.clinical_positioning} Learn more about ${themeData.therapeutic_focus} management options.`;
  }

  /**
   * Generates hashtags.
   * @private
   * @static
   * @param {ThemeData} themeData
   * @returns {string}
   */
  static generateHashtags(themeData) {
    const area = themeData.therapeutic_focus.replace(/\s+/g, '');
    return `#${area} #TreatmentOptions #HealthcareInnovation`;
  }

  /**
   * Generates a meeting agenda.
   * @private
   * @static
   * @param {ThemeData} themeData
   * @returns {string}
   */
  static generateAgenda(themeData) {
    return `• ${themeData.therapeutic_focus} Overview
• ${themeData.core_message}
• Clinical Evidence
• ${themeData.key_benefits?.slice(0, 2).join('\n• ') || 'Key Benefits'}
• Safety Profile
• Discussion & Next Steps`;
  }

  /**
   * Generates clinical content summary.
   * @private
   * @static
   * @param {ThemeData} themeData
   * @returns {string}
   */
  static generateClinicalContent(themeData) {
    return `${themeData.clinical_positioning}

${themeData.proof_points?.join('\n\n') || 'Clinical studies demonstrate significant efficacy in the target population.'}

Key differentiators:
${themeData.differentiation_claims?.map(claim => `• ${claim}`).join('\n') || '• Proven clinical efficacy\n• Favorable safety profile'}`;
  }

  // Asset-type optimizations

  /**
   * Optimize content for mass-email asset type.
   * @private
   * @static
   * @param {Record<string, any>} content
   * @param {ThemeData} themeData
   * @param {string[]} suggestions
   * @returns {void}
   */
  static optimizeForEmail(content, themeData, suggestions) {
    // Ensure subject line is compelling and under 50 chars
    if (content.subject && content.subject.length > 50) {
      content.subject = content.subject.substring(0, 47) + '...';
      suggestions.push('Subject line truncated to meet email best practices');
    }

    // Add professional disclaimer if missing
    if (!content.disclaimer) {
      content.disclaimer = 'This email contains promotional information about prescription medications. Please see full prescribing information.';
    }
  }

  /**
   * Optimize content for social-media-post asset type.
   * @private
   * @static
   * @param {Record<string, any>} content
   * @param {ThemeData} themeData
   * @param {string[]} suggestions
   * @returns {void}
   */
  static optimizeForSocial(content, themeData, suggestions) {
    // Ensure content meets character limits
    if (content.bodyText && content.bodyText.length > 280) {
      content.bodyText = content.bodyText.substring(0, 277) + '...';
      suggestions.push('Post content truncated for social media character limits');
    }

    // Add compliance disclaimer for social
    if (!content.disclaimer) {
      content.disclaimer = 'Educational content only. Consult your healthcare provider for medical advice.';
    }
  }

  /**
   * Optimize content for website-landing-page asset type.
   * @private
   * @static
   * @param {Record<string, any>} content
   * @param {ThemeData} themeData
   * @param {string[]} suggestions
   * @returns {void}
   */
  static optimizeForWeb(content, themeData, suggestions) {
    // Ensure SEO fields are optimized
    if (content.pageTitle && content.pageTitle.length > 60) {
      content.pageTitle = content.pageTitle.substring(0, 57) + '...';
      suggestions.push('Page title optimized for SEO');
    }

    if (content.metaDescription && content.metaDescription.length > 160) {
      content.metaDescription = content.metaDescription.substring(0, 157) + '...';
      suggestions.push('Meta description optimized for search engines');
    }
  }

  /**
   * Optimize content for digital-sales-aid asset type.
   * @private
   * @static
   * @param {Record<string, any>} content
   * @param {ThemeData} themeData
   * @param {string[]} suggestions
   * @returns {void}
   */
  static optimizeForSalesAid(content, themeData, suggestions) {
    // Ensure slide content is presentation-ready
    if (!content.discussionGuides) {
      content.discussionGuides = `• How do you currently manage ${themeData.therapeutic_focus} patients?
• What challenges do you face with current treatments?
• How important is ${themeData.key_benefits?.[0] || 'efficacy'} in your treatment decisions?`;
      suggestions.push('Added discussion guides to facilitate HCP conversations');
    }
  }
  
  /**
   * Track intelligence usage from content generation
   *
   * @private
   * @static
   * @param {string} brandId
   * @param {string} themeId
   * @param {string} assetType
   * @param {IntakeContext} intakeContext
   * @param {any} intelligenceUsed
   * @returns {Promise<void>}
   */
  static async trackIntelligenceUsage(
    brandId,
    themeId,
    assetType,
    intakeContext,
    intelligenceUsed
  ) {
    try {
      // Dynamic import for logging service
      const { IntelligenceLoggingService } = await import('./intelligenceLoggingService');
      
      // Track theme usage
      if (intelligenceUsed.theme) {
        await IntelligenceLoggingService.logUsage({
          brand_id: brandId,
          intelligence_type: 'performance',
          intelligence_source: 'theme_library',
          intelligence_id: themeId,
          usage_context: {
            asset_type: assetType,
            generation_type: 'initial_content',
            intake_objective: intakeContext.intake_objective,
            target_audience: intakeContext.intake_audience
          }
        });
      }
      
      // Track clinical claims usage
      if (intelligenceUsed.claims?.length > 0) {
        await IntelligenceLoggingService.logBatch(
          intelligenceUsed.claims.map(claimId => ({
            brand_id: brandId,
            intelligence_type: 'evidence',
            intelligence_source: 'clinical_claims',
            intelligence_id: claimId,
            usage_context: { generation_type: 'initial_content', asset_type: assetType }
          }))
        );
      }
      
      // Track audience segments usage
      if (intelligenceUsed.segments?.length > 0) {
        await IntelligenceLoggingService.logBatch(
          intelligenceUsed.segments.map(segmentId => ({
            brand_id: brandId,
            intelligence_type: 'audience',
            intelligence_source: 'audience_segments',
            source_id: segmentId,
            context: {
              asset_type: assetType,
              generation_type: 'initial_content',
              theme_id: themeId
            }
          }))
        );
      }
      
      console.log('✅ Intelligence usage tracked:', {
        theme: !!intelligenceUsed.theme,
        claimsCount: intelligenceUsed.claims?.length || 0,
        segmentsCount: intelligenceUsed.segments?.length || 0
      });
    } catch (error) {
      console.error('❌ Failed to track intelligence usage:', error);
      // Don't throw - tracking failure shouldn't block content generation
    }
  }

  /**
   * Generate rich initial content using AI with Evidence Library
   *
   * @private
   * @static
   * @param {ThemeData} themeData
   * @param {IntakeContext} intakeContext
   * @param {string} assetType
   * @param {string} brandId
   * @param {any} [piData]
   * @returns {Promise<Record<string, any> | null>}
   */
  static async generateRichInitialContent(
    themeData,
    intakeContext,
    assetType,
    brandId,
    piData
  ) {
    try {
      // Dynamic import for Supabase client
      const { supabase } = await import('@/integrations/supabase/client');
      
      console.log('🚀 Calling generate-initial-content with Evidence Library support', {
        brandId,
        assetType,
        hasStrategicContext: !!intakeContext.strategicContext
      });
      
      const { data, error } = await supabase.functions.invoke('generate-initial-content', {
        body: {
          brandId, // Pass brandId so edge function can query Evidence Library
          themeData,
          intakeContext,
          assetType,
          strategicContext: intakeContext.strategicContext
        }
      });

      if (error) {
        console.error('Error generating rich initial content:', error);
        return null;
      }

      // Handle both response formats for backward compatibility
      const isSuccess = data?.success === true || (data?.content && !data?.error);
      const content = data?.content;

      if (!isSuccess || !content) {
        console.error('Invalid response from generate-initial-content:', data);
        return null;
      }

      console.log('✅ Content generated successfully with Evidence Library:', {
        claimsUsed: data.metadata?.claimsUsed,
        segmentsUsed: data.metadata?.segmentsUsed,
        referencesAvailable: data.metadata?.referencesAvailable
      });

      // Process citations if content has claim markers - now includes modules and visuals
      const processedContent = await this.processCitationsInContent(content, brandId, data.usedEvidence);

      // Build intelligenceUsed array in proper format for UnifiedIntelligenceCard
      /** @type {IntelligenceUsed[]} */
      const intelligenceUsed = [];
      
      // Add evidence intelligence (claims, refs, modules, visuals)
      if (data.usedEvidence?.claims) {
        data.usedEvidence.claims.forEach(c => {
          intelligenceUsed.push({
            type: 'evidence',
            source: 'Clinical Claim',
            id: c.display_id || c.id,
            content: c.text,
            confidence: c.confidence || 0.95
          });
        });
      }
      
      if (data.usedEvidence?.references) {
        data.usedEvidence.references.forEach(r => {
          intelligenceUsed.push({
            type: 'evidence',
            source: 'Clinical Reference',
            id: r.display_id || r.id,
            content: r.text || r.formatted_citation,
            confidence: 0.93
          });
        });
      }
      
      if (data.usedEvidence?.modules) {
        data.usedEvidence.modules.forEach(m => {
          intelligenceUsed.push({
            type: 'evidence',
            source: 'Content Module',
            id: m.id,
            content: m.text?.substring(0, 100) || 'Approved content module',
            confidence: 0.90
          });
        });
      }
      
      if (data.usedEvidence?.visuals) {
        data.usedEvidence.visuals.forEach(v => {
          intelligenceUsed.push({
            type: 'evidence',
            source: 'Visual Asset',
            id: v.id,
            content: v.title || v.caption,
            confidence: 0.88
          });
        });
      }
      
      // Add audience intelligence
      if (data.usedEvidence?.segments) {
        data.usedEvidence.segments.forEach(s => {
          intelligenceUsed.push({
            type: 'audience',
            source: 'Audience Segment',
            id: s.id,
            content: s.text || s.type,
            confidence: 0.85
          });
        });
      }
      
      // Add performance intelligence
      if (data.usedEvidence?.performance) {
        data.usedEvidence.performance.forEach(p => {
          intelligenceUsed.push({
            type: 'performance',
            source: 'Campaign Performance',
            id: p.id,
            content: `${p.campaign_name}: ${p.engagement_score || 0}% engagement`,
            confidence: 0.87
          });
        });
      }
      
      // Add competitive intelligence
      if (data.usedEvidence?.competitive) {
        data.usedEvidence.competitive.forEach(c => {
          intelligenceUsed.push({
            type: 'competitive',
            source: 'Competitive Intelligence',
            id: c.id,
            content: `${c.competitor_name}: ${c.title}`,
            confidence: 0.82
          });
        });
      }
      
      // Add brand intelligence (always present via theme)
      intelligenceUsed.push({
        type: 'brand',
        source: 'Therapeutic Area',
        id: 'therapeutic-area',
        content: `${brandId} brand guidelines`,
        confidence: 0.90
      });

      return {
        ...processedContent.content,
        intelligenceUsed: intelligenceUsed, // Changed from object to array format
        citationData: {
          claimsUsed: processedContent.claimsUsed,
          referencesUsed: processedContent.referencesUsed,
          modulesUsed: processedContent.modulesUsed,
          visualsUsed: processedContent.visualsUsed
        }
      };
    } catch (error) {
      console.error('Failed to generate rich initial content:', error);
      return null;
    }
  }

  /**
   * Process citations in generated content - PRIORITIZES usedEvidence from edge function
   * to bypass RLS issues with browser-side database queries.
   * Now also processes modules and visuals.
   *
   * @private
   * @static
   * @param {Record<string, any>} content
   * @param {string} brandId
   * @param {any} usedEvidence
   * @returns {Promise<{ content: Record<string, any>; claimsUsed: any[]; referencesUsed: any[]; modulesUsed: any[]; visualsUsed: any[]; }>}
   */
  static async processCitationsInContent(
    content,
    brandId,
    usedEvidence
  ) {
    try {
      let processedBody = content.body || '';
      /** @type {any[]} */ let claimsUsed = [];
      /** @type {any[]} */ let referencesUsed = [];
      /** @type {any[]} */ let modulesUsed = [];
      /** @type {any[]} */ let visualsUsed = [];

      console.log('🔍 Processing citations and evidence:', {
        hasUsedEvidence: !!usedEvidence,
        usedEvidenceClaimsCount: usedEvidence?.claims?.length || 0,
        usedEvidenceRefsCount: usedEvidence?.references?.length || 0,
        usedEvidenceModulesCount: usedEvidence?.modules?.length || 0,
        usedEvidenceVisualsCount: usedEvidence?.visuals?.length || 0,
        bodyLength: processedBody.length
      });

      // PRIORITY 1: Use usedEvidence from edge function (most reliable - bypasses RLS)
      if (usedEvidence?.claims?.length > 0) {
        console.log('📋 PRIORITY 1: Using usedEvidence from edge function (bypasses RLS)');
        
        // Build citation data from usedEvidence - CLAIMS
        claimsUsed = usedEvidence.claims.map((c, idx) => ({
          claimId: c.id,
          claimDisplayId: c.display_id || `CML-${String(idx + 1).padStart(4, '0')}`,
          claimText: c.text || 'Clinical claim',
          claimType: c.type || 'efficacy',
          confidence: c.confidence,
          citationNumber: idx + 1,
          linkedReferences: []
        }));
        
        // Replace [CLAIM:XXX] markers with superscripts in content
        const markerPattern = /\[CLAIM:(CML-[A-Za-z0-9]+)\]/g;
        const claimMap = new Map(claimsUsed.map(c => [c.claimDisplayId, c]));
        
        processedBody = processedBody.replace(markerPattern, (match, displayId) => {
          const claim = claimMap.get(displayId);
          if (claim) {
            return `<sup class="citation-marker" data-claim-id="${claim.claimId}" data-citation-num="${claim.citationNumber}">${claim.citationNumber}</sup>`;
          }
          return match; // Keep marker if not found
        });
        
        console.log('✅ Claims processed from usedEvidence:', claimsUsed.length);
      }
      
      // Process REFERENCES from usedEvidence
      if (usedEvidence?.references?.length > 0) {
        referencesUsed = usedEvidence.references.map((r, idx) => ({
          referenceId: r.id,
          referenceDisplayId: r.display_id || `REF-${String(idx + 1).padStart(4, '0')}`,
          formattedCitation: r.formatted_citation || r.text || 'Clinical reference',
          publicationYear: r.publication_year,
          journal: r.journal,
          authors: r.authors,
          citationNumber: idx + 1
        }));
        console.log('✅ References processed from usedEvidence:', referencesUsed.length);
      }
      
      // Process MODULES from usedEvidence
      if (usedEvidence?.modules?.length > 0) {
        modulesUsed = usedEvidence.modules.map(m => ({
          moduleId: m.id,
          moduleType: m.type || 'content',
          moduleText: m.text || '',
          mlrApproved: m.mlr_approved ?? true,
          usageScore: m.usage_score
        }));
        console.log('✅ Modules processed from usedEvidence:', modulesUsed.length);
      }
      
      // Process VISUALS from usedEvidence
      if (usedEvidence?.visuals?.length > 0) {
        visualsUsed = usedEvidence.visuals.map(v => ({
          visualId: v.id,
          visualType: v.type || 'chart',
          title: v.title || 'Visual Asset',
          caption: v.caption,
          mlrApproved: v.mlr_approved ?? false
        }));
        console.log('✅ Visuals processed from usedEvidence:', visualsUsed.length);
      }
      
      // PRIORITY 2: Fallback to CitationProcessor if usedEvidence claims is empty
      if (claimsUsed.length === 0) {
        const hasMarkers = /\[CLAIM:CML-[A-Za-z0-9]+\]/.test(processedBody);
        
        if (hasMarkers && brandId) {
          console.log('📋 PRIORITY 2: Trying CitationProcessor (may fail due to RLS)');
          try {
            // Dynamic import for citation processor
            const { CitationProcessor } = await import('./citationProcessor');
            const processed = await CitationProcessor.processContent(processedBody, brandId);
            
            if (processed.claimsUsed.length > 0) {
              processedBody = processed.content;
              claimsUsed = processed.claimsUsed;
              referencesUsed = processed.referencesUsed;
              
              console.log('✅ Citations processed via CitationProcessor:', {
                claimsUsed: claimsUsed.length,
                referencesUsed: referencesUsed.length
              });
            } else {
              console.warn('⚠️ CitationProcessor returned 0 claims - likely RLS issue');
            }
          } catch (error) {
            console.warn('⚠️ CitationProcessor fallback failed:', error);
          }
        }
      }

      return {
        content: {
          ...content,
          body: processedBody
        },
        claimsUsed,
        referencesUsed,
        modulesUsed,
        visualsUsed
      };
    } catch (error) {
      console.error('❌ Error processing citations:', error);
      return { content, claimsUsed: [], referencesUsed: [], modulesUsed: [], visualsUsed: [] };
    }
  }

  /**
   * Calculate content completeness percentage
   *
   * @private
   * @static
   * @param {Record<string, any>} content
   * @param {any} layout
   * @returns {number}
   */
  static calculateCompleteness(content, layout) {
    if (!layout) return 0;

    const allFields = layout.sections.flatMap(section => section.fields);
    const requiredFields = allFields.filter(field => field.required);
    const optionalFields = allFields.filter(field => !field.required);

    const filledRequired = requiredFields.filter(field => 
      content[field.id] && content[field.id].toString().trim().length > 0
    ).length;

    const filledOptional = optionalFields.filter(field => 
      content[field.id] && content[field.id].toString().trim().length > 0
    ).length;

    const requiredWeight = 0.7; // Required fields worth 70%
    const optionalWeight = 0.3; // Optional fields worth 30%

    const requiredScore = requiredFields.length > 0 ? (filledRequired / requiredFields.length) * requiredWeight : requiredWeight;
    const optionalScore = optionalFields.length > 0 ? (filledOptional / optionalFields.length) * optionalWeight : optionalWeight;

    return Math.round((requiredScore + optionalScore) * 100);
  }

  /**
   * Reset content to theme defaults
   *
   * @static
   * @param {string} assetType
   * @param {ThemeData} themeData
   * @param {IntakeContext} [intakeContext={}]
   * @param {string} brandId
   * @returns {Promise<Record<string, any>>}
   */
  static async resetToTheme(
    assetType,
    themeData,
    intakeContext = {},
    brandId
  ) {
    const result = await this.initializeFromTheme(
      assetType,
      themeData,
      intakeContext,
      brandId,
      {
        useThemeContent: true,
        useIntakeContext: true,
        generateMissingContent: false, // Don't generate on reset
        assetTypeOptimization: true
      }
    );

    return result.content;
  }
}