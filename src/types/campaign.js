//campaign
 
// campaign.js
 
/**
* @typedef {import('./workshop').ThemeOption} ThemeOption
* @typedef {import('./workshop').MatchedIntelligence} MatchedIntelligence
*/
 
/**
* A single asset within a campaign.
* @typedef {Object} CampaignAsset
* @property {string} assetId - content_assets.id (after creation)
* @property {string} assetType - e.g., 'mass-email', 'rep-triggered-email', etc.
* @property {string} assetName
* @property {'queued'|'in-progress'|'draft'|'review'|'complete'} status
* @property {any} [generatedContent] - AI-generated content payload
* @property {number} order - Sequencing within campaign
* @property {string[]} [dependencies] - Asset IDs this depends on
*/
 
/**
* A full campaign package, including strategic context, shared evidence, and assets.
* @typedef {Object} CampaignPackage
* @property {string} campaignId - UUID for the campaign
* @property {string} projectId - content_projects.id
* @property {string} campaignName
* @property {string} brandId
* @property {Object} strategicContext - Strategic context shared across all assets
* @property {ThemeOption} strategicContext.theme
* @property {string} strategicContext.keyMessage
* @property {string} strategicContext.targetAudience
* @property {string} strategicContext.occasion
* @property {MatchedIntelligence} strategicContext.intelligence
* @property {Object} sharedEvidence - Evidence shared across campaign
* @property {string[]} sharedEvidence.claims
* @property {string[]} sharedEvidence.visuals
* @property {string[]} sharedEvidence.modules
* @property {CampaignAsset[]} assets - Asset manifest
* @property {string} estimatedCompletion - e.g., ISO date string or human-readable ETA
* @property {number} overallProgress - 0–100
*/
 
// Optional: provide factory functions to create validated objects at runtime.
// These do not change logic but help avoid shape mistakes in plain JS.
 
/**
* @param {Partial<CampaignAsset>} init
* @returns {CampaignAsset}
*/
export function createCampaignAsset(init = {}) {
  return {
    assetId: init.assetId ?? '',
    assetType: init.assetType ?? '',
    assetName: init.assetName ?? '',
    status: init.status ?? 'queued',
    generatedContent: init.generatedContent,
    order: init.order ?? 0,
    dependencies: init.dependencies ?? []
  };
}
 
/**
* @param {Partial<CampaignPackage>} init
* @returns {CampaignPackage}
*/
export function createCampaignPackage(init = {}) {
  return {
    campaignId: init.campaignId ?? '',
    projectId: init.projectId ?? '',
    campaignName: init.campaignName ?? '',
    brandId: init.brandId ?? '',
    strategicContext: {
      theme: init?.strategicContext?.theme,
      keyMessage: init?.strategicContext?.keyMessage ?? '',
      targetAudience: init?.strategicContext?.targetAudience ?? '',
      occasion: init?.strategicContext?.occasion ?? '',
      intelligence: init?.strategicContext?.intelligence
    },
    sharedEvidence: {
      claims: init?.sharedEvidence?.claims ?? [],
      visuals: init?.sharedEvidence?.visuals ?? [],
      modules: init?.sharedEvidence?.modules ?? []
    },
    assets: (init.assets ?? []).map(createCampaignAsset),
    estimatedCompletion: init.estimatedCompletion ?? '',
    overallProgress: init.overallProgress ?? 0
  };
}
 