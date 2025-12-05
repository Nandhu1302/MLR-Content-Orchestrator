import { unifiedDataService } from './unifiedDataService';
import { taxonomyService } from './taxonomyService';
import { metadataGenerationService } from './metadataGenerationService';

/**
 * @typedef {Object} ModuleTransitionData
 * @property {string} sourceModule
 * @property {string} targetModule
 * @property {any} contextPayload - Data from the source module's current state.
 * @property {any} userSelections - User-specific input during transition.
 * @property {string} brandId
 * @property {string} timestamp
 */

/**
 * @typedef {Object} ModuleBridgeEvent
 * @property {'data_update' | 'module_transition' | 'context_sync' | 'error'} type
 * @property {string} source
 * @property {any} data
 * @property {string} timestamp
 */

/**
 * @callback ModuleBridgeEventHandler
 * @param {ModuleBridgeEvent} event
 */

class ModuleBridge {
  constructor() {
    /** @private @type {Map<string, ModuleBridgeEventHandler[]>} */
    this.eventHandlers = new Map();
    /** @private @type {Map<string, any>} */
    this.moduleContexts = new Map();
  }

  /**
   * Register event handler for module communication.
   * @param {string} eventType
   * @param {ModuleBridgeEventHandler} handler
   * @returns {() => void} Cleanup function to unregister the handler.
   */
  on(eventType, handler) {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, []);
    }
    
    this.eventHandlers.get(eventType).push(handler);

    // Return cleanup function
    return () => {
      const handlers = this.eventHandlers.get(eventType);
      if (handlers) {
        const index = handlers.indexOf(handler);
        if (index > -1) {
          handlers.splice(index, 1);
        }
      }
    };
  }

  /**
   * Emit event to all registered handlers.
   * @private
   * @param {ModuleBridgeEvent} event
   * @returns {void}
   */
  emit(event) {
    const handlers = this.eventHandlers.get(event.type) || [];
    handlers.forEach(handler => {
      try {
        handler(event);
      } catch (error) {
        console.error('Error in module bridge event handler:', error);
      }
    });
  }

  /**
   * Handle transition between modules with context preservation and enrichment.
   * @param {ModuleTransitionData} transitionData
   * @returns {Promise<void>}
   */
  async handleModuleTransition(transitionData) {
    try {
      // Store context from source module
      this.moduleContexts.set(transitionData.sourceModule, {
        contextPayload: transitionData.contextPayload,
        userSelections: transitionData.userSelections,
        timestamp: transitionData.timestamp
      });

      // Prepare context for target module
      const targetContext = await this.prepareTargetModuleContext(
        transitionData.sourceModule,
        transitionData.targetModule,
        transitionData.contextPayload,
        transitionData.brandId
      );

      // Emit transition event
      this.emit({
        type: 'module_transition',
        source: transitionData.sourceModule,
        data: {
          targetModule: transitionData.targetModule,
          context: targetContext,
          userSelections: transitionData.userSelections
        },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error handling module transition:', error);
      this.emit({
        type: 'error',
        source: 'ModuleBridge',
        data: { error: error.message, transitionData },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Prepare context data for target module, including data transformation and enrichment.
   * @private
   * @param {string} sourceModule
   * @param {string} targetModule
   * @param {any} contextPayload
   * @param {string} brandId
   * @returns {Promise<any>}
   */
  async prepareTargetModuleContext(
    sourceModule,
    targetModule,
    contextPayload,
    brandId
  ) {
    const preparedContext = {
      sourceModule,
      brandId,
      inheritedData: {}
    };

    try {
      switch (`${sourceModule}->${targetModule}`) {
        case 'initiative->strategy':
          preparedContext.inheritedData = await this.prepareInitiativeToStrategy(contextPayload, brandId);
          break;

        case 'strategy->content':
          preparedContext.inheritedData = await this.prepareStrategyToContent(contextPayload, brandId);
          break;

        case 'content->design':
          preparedContext.inheritedData = await this.prepareContentToDesign(contextPayload, brandId);
          break;

        case 'strategy->initiative':
        case 'content->strategy':
        case 'design->content':
          // Backward navigation - preserve all context
          preparedContext.inheritedData = contextPayload;
          break;

        default:
          // Generic context preservation
          preparedContext.inheritedData = contextPayload;
      }

      return preparedContext;
    } catch (error) {
      console.error(`Error preparing context for ${sourceModule}->${targetModule}:`, error);
      return preparedContext;
    }
  }

  /**
   * Prepare context from Initiative Hub to Strategy & Insights.
   * Adds taxonomy suggestions and related projects.
   * @private
   * @param {any} contextPayload
   * @param {string} brandId
   * @returns {Promise<any>}
   */
  async prepareInitiativeToStrategy(contextPayload, brandId) {
    const strategyContext = {
      projectContext: contextPayload.projectData || {},
      intakeSelections: contextPayload.intakeData || {},
      audienceInsights: contextPayload.audienceData || {},
      objectives: contextPayload.objectives || []
    };

    // If we have therapeutic area or indication, get related taxonomy
    if (contextPayload.intakeData?.therapeuticArea) {
      try {
        const therapeuticTaxonomy = await taxonomyService.getTaxonomyByCategory('therapeutic_area');
        const matchingTaxonomy = therapeuticTaxonomy.find(t => 
          t.term.toLowerCase().includes(contextPayload.intakeData.therapeuticArea.toLowerCase())
        );
        
        if (matchingTaxonomy) {
          strategyContext.suggestedTaxonomy = [matchingTaxonomy];
        }
      } catch (error) {
        console.error('Error loading therapeutic taxonomy:', error);
      }
    }

    // Get related content for inspiration
    if (contextPayload.projectData?.project_name) {
      try {
        const recommendations = await unifiedDataService.search({
          searchTerm: contextPayload.projectData.project_name,
          brandId,
          contentType: 'project'
        });
        strategyContext.relatedProjects = recommendations.slice(0, 3);
      } catch (error) {
        console.error('Error loading related projects:', error);
      }
    }

    return strategyContext;
  }

  /**
   * Prepare context from Strategy & Insights to Content Studio.
   * Adds inspirational content and taxonomy suggestions.
   * @private
   * @param {any} contextPayload
   * @param {string} brandId
   * @returns {Promise<any>}
   */
  async prepareStrategyToContent(contextPayload, brandId) {
    const contentContext = {
      selectedThemes: contextPayload.selectedThemes || [],
      audienceSegments: contextPayload.audienceSegments || [],
      strategicFramework: contextPayload.strategicFramework || {},
      performanceTargets: contextPayload.performanceTargets || {}
    };

    // Get theme-specific content templates and examples
    if (contextPayload.selectedThemes?.length > 0) {
      try {
        // const themeIds = contextPayload.selectedThemes.map(t => t.id); // Assuming themes have IDs
        
        // Find content assets that use similar themes (simplified search)
        const themeAssets = await unifiedDataService.search({
          brandId,
          contentType: 'asset'
        });

        contentContext.inspirationalContent = themeAssets.slice(0, 5);
      } catch (error) {
        console.error('Error loading theme-related content:', error);
      }
    }

    // Prepare taxonomy suggestions based on strategy selections
    if (contextPayload.strategicFramework?.categories) {
      try {
        const taxonomySuggestions = await Promise.all(
          contextPayload.strategicFramework.categories.map(async (category) => {
            return taxonomyService.getTaxonomyByCategory(category);
          })
        );
        
        contentContext.suggestedTaxonomy = taxonomySuggestions.flat();
      } catch (error) {
        console.error('Error loading taxonomy suggestions:', error);
      }
    }

    return contentContext;
  }

  /**
   * Prepare context from Content Studio to Design Studio.
   * Generates design-specific metadata and insights.
   * @private
   * @param {any} contextPayload
   * @param {string} brandId
   * @returns {Promise<any>}
   */
  async prepareContentToDesign(contextPayload, brandId) {
    const designContext = {
      contentAssets: contextPayload.assets || [],
      brandGuidelines: contextPayload.brandGuidelines || {},
      channelRequirements: contextPayload.channelRequirements || {},
      complianceRequirements: contextPayload.complianceRequirements || {}
    };

    // Generate design-specific metadata
    if (contextPayload.assets?.length > 0) {
      try {
        for (const asset of contextPayload.assets) {
          if (asset.primary_content) {
            const metadata = await metadataGenerationService.generateMetadata(
              asset.primary_content,
              'asset',
              asset.id,
              {
                includeAIAnalysis: true,
                brandId
              }
            );
            
            // Extract design-relevant insights
            designContext[`asset_${asset.id}_insights`] = {
              keyThemes: metadata.aiAnalysis?.keyThemes || [],
              complexity: metadata.aiAnalysis?.complexityScore || 0.5,
              recommendations: metadata.aiAnalysis?.recommendations || []
            };
          }
        }
      } catch (error) {
        console.error('Error generating design insights:', error);
      }
    }

    return designContext;
  }

  /**
   * Sync data across modules (e.g., when a shared setting is updated).
   * @param {string} moduleId
   * @param {any} data
   * @returns {Promise<void>}
   */
  async syncModuleData(moduleId, data) {
    try {
      // Update module context
      this.moduleContexts.set(moduleId, {
        ...this.moduleContexts.get(moduleId),
        ...data,
        lastSync: new Date().toISOString()
      });

      // Emit sync event
      this.emit({
        type: 'context_sync',
        source: moduleId,
        data: data,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error syncing module data:', error);
    }
  }

  /**
   * Get context for a specific module.
   * @param {string} moduleId
   * @returns {any}
   */
  getModuleContext(moduleId) {
    return this.moduleContexts.get(moduleId) || {};
  }

  /**
   * Clear all module contexts.
   * @returns {void}
   */
  clearAllContexts() {
    this.moduleContexts.clear();
    this.emit({
      type: 'context_sync',
      source: 'ModuleBridge',
      data: { action: 'clear_all' },
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Get cross-module recommendations based on the current state.
   * @param {string} currentModule
   * @param {any} currentData
   * @param {string} brandId
   * @returns {Promise<any[]>}
   */
  async getCrossModuleRecommendations(
    currentModule,
    currentData,
    brandId
  ) {
    try {
      const recommendations = [];

      // Get recommendations based on current module
      switch (currentModule) {
        case 'content':
          // Recommend related themes from strategy module
          const strategyContext = this.getModuleContext('strategy');
          if (strategyContext.selectedThemes) {
            recommendations.push({
              type: 'theme_suggestion',
              source: 'strategy',
              data: strategyContext.selectedThemes,
              relevance: 0.8
            });
          }
          break;

        case 'design':
          // Recommend content variations
          const contentContext = this.getModuleContext('content');
          if (contentContext.assets) {
            recommendations.push({
              type: 'content_variation',
              source: 'content',
              data: contentContext.assets,
              relevance: 0.9
            });
          }
          break;
      }

      return recommendations;
    } catch (error) {
      console.error('Error getting cross-module recommendations:', error);
      return [];
    }
  }
}

export const moduleBridge = new ModuleBridge();