// ============================================
// Regulatory Intelligence Matrix Service
// Service for generating regulatory compliance matrices and validating content
// ============================================

// Note: The original file imported `supabase` and several local data files.
// For a direct conversion to JavaScript, the imports remain, assuming the
// module system (like in a Next.js/React environment with aliased paths)
// will handle them.

// import { supabase } from '@/integrations/supabase/client';
import {
    getOfevRules,
    convertOfevRulesToMatrixEntries
} from '@/data/regulatory/OfevRegulatoryRules';
import {
    getOfevContentByMarket
} from '@/data/regulatory/OfevPreApprovedContent';
import {
    getOfevTemplatesByMarket
} from '@/data/regulatory/OfevRegulatoryTemplates';
import {
    getDupixentRules,
    convertDupixentRulesToMatrixEntries
} from '@/data/regulatory/DupixentRegulatoryRules';
import {
    getDupixentContentByMarket
} from '@/data/regulatory/DupixentPreApprovedContent';
import {
    getDupixentTemplatesByMarket
} from '@/data/regulatory/DupixentRegulatoryTemplates';
import {
    getErbituxRules,
    convertErbituxRulesToMatrixEntries
} from '@/data/regulatory/ErbituxRegulatoryRules';
import {
    getErbituxContentByMarket
} from '@/data/regulatory/ErbituxPreApprovedContent';
import {
    getErbituxTemplatesByMarket
} from '@/data/regulatory/ErbituxRegulatoryTemplates';
import {
    getEntrestoRules,
    convertEntrestoRulesToMatrixEntries
} from '@/data/regulatory/EntrestoRegulatoryRules';
import {
    getEntrestoContentByMarket
} from '@/data/regulatory/EntrestoPreApprovedContent';
import {
    getEntrestoTemplatesByMarket
} from '@/data/regulatory/EntrestoRegulatoryTemplates';
import {
    getXareltoRules,
    convertXareltoRulesToMatrixEntries
} from '@/data/regulatory/XareltoRegulatoryRules';
import {
    getXareltoContentByMarket
} from '@/data/regulatory/XareltoPreApprovedContent';
import {
    getXareltoTemplatesByMarket
} from '@/data/regulatory/XareltoRegulatoryTemplates';
import {
    getTagrissoRules,
    convertTagrissoRulesToMatrixEntries
}
from '@/data/regulatory/TagrissoRegulatoryRules';
import {
    getTagrissoContentByMarket
} from '@/data/regulatory/TagrissoPreApprovedContent';
import {
    getTagrissoTemplatesByMarket
} from '@/data/regulatory/TagrissoRegulatoryTemplates';

/**
 * @typedef {Object} RegulatoryMatrixEntry
 * @property {string} market
 * @property {string} therapeuticArea
 * @property {string} ruleCategory
 * @property {string} ruleId
 * @property {string} ruleName
 * @property {'MUST_CHANGE' | 'CANNOT_CHANGE' | 'SHOULD_CHANGE' | 'FLEXIBLE'} changeRequirement
 * @property {string} description
 * @property {string} rationale
 * @property {'low' | 'medium' | 'high' | 'critical'} riskLevel
 * @property {'automated' | 'manual' | 'expert_review'} validationMethod
 * @property {string[]} [preApprovedContent]
 * @property {string[]} [restrictedTerms]
 * @property {string} [templateContent]
 * @property {string} [compliancePattern]
 * @property {Object} [exampleTransformation]
 * @property {string} exampleTransformation.before
 * @property {string} exampleTransformation.after
 * @property {string} exampleTransformation.rationale
 */
// This comment block defining the typedef is correct for JSDoc.

/**
 * @typedef {Object} MarketComplianceStatus
 * @property {number} score
 * @property {string} riskLevel
 * @property {number} mustChangeCount
 * @property {number} cannotChangeCount
 * @property {number} shouldChangeCount
 * @property {number} flexibleCount
 */

/**
 * @typedef {Object} AutomatedValidationResult
 * @property {string} rule
 * @property {'pass' | 'fail' | 'warning'} status
 * @property {string} details
 */

/**
 * @typedef {Object} RegulatoryIntelligenceReport
 * @property {string} assetId
 * @property {string} brandId
 * @property {string[]} targetMarkets
 * @property {number} overallComplianceScore
 * @property {Record<string, MarketComplianceStatus>} marketCompliance
 * @property {RegulatoryMatrixEntry[]} mustChangeRules
 * @property {RegulatoryMatrixEntry[]} cannotChangeRules
 * @property {RegulatoryMatrixEntry[]} shouldChangeRules
 * @property {RegulatoryMatrixEntry[]} flexibleRules
 * @property {Record<string, string[]>} preApprovedContent
 * @property {AutomatedValidationResult[]} automatedValidations
 * @property {RegulatoryMatrixEntry[]} expertReviewRequired
 * @property {string[]} recommendations
 */

/**
 * @typedef {Object} PreApprovedContentLibrary
 * @property {string} category
 * @property {string} therapeuticArea
 * @property {string} market
 * @property {'claim' | 'disclaimer' | 'safety_info' | 'efficacy_data' | 'dosing_info'} contentType
 * @property {string} approvedContent
 * @property {string} usageGuidelines
 * @property {string[]} restrictions
 * @property {string} approvalDate
 * @property {string} [expiryDate]
 * @property {string} [mlrNumber]
 * @property {string} lastUpdated
 */

export class RegulatoryIntelligenceMatrixService {

    /**
     * Generate comprehensive regulatory intelligence matrix for asset and markets
     * @param {string} assetId
     * @param {string} brandId
     * @param {string[]} targetMarkets
     * @param {string} therapeuticArea
     * @returns {Promise<RegulatoryIntelligenceReport>}
     */
    static async generateRegulatoryMatrix(
        assetId,
        brandId,
        targetMarkets,
        therapeuticArea
    ) {
        try {
            // Dynamically import supabase since it's an integration
            const { supabase } = await import('@/integrations/supabase/client');
            
            // Get asset content for analysis (optional - may not exist for glocal projects)
            const { data: asset } = await supabase
                .from('content_assets')
                .select('*')
                .eq('id', assetId)
                .maybeSingle();

            // Asset is optional - glocal projects may not have content_assets entry

            // Get regulatory compliance rules for each market
            const allRules = [];
            const marketCompliance = {};

            for (const market of targetMarkets) {
                const marketRules = await this.getMarketRegulatoryRules(
                    market,
                    therapeuticArea,
                    brandId
                );
                allRules.push(...marketRules);

                // Analyze asset against market rules
                const compliance = await this.analyzeAssetCompliance(
                    asset,
                    marketRules,
                    market
                );
                marketCompliance[market] = compliance;
            }

            // Categorize rules by change requirement
            const mustChangeRules = allRules.filter(r => r.changeRequirement === 'MUST_CHANGE');
            const cannotChangeRules = allRules.filter(r => r.changeRequirement === 'CANNOT_CHANGE');
            const shouldChangeRules = allRules.filter(r => r.changeRequirement === 'SHOULD_CHANGE');
            const flexibleRules = allRules.filter(r => r.changeRequirement === 'FLEXIBLE');

            // Get pre-approved content library
            const preApprovedContent = await this.getPreApprovedContentLibrary(
                targetMarkets,
                therapeuticArea,
                brandId
            );

            // Run automated validations
            const automatedValidations = await this.runAutomatedValidations(
                asset,
                allRules
            );

            // Identify rules requiring expert review
            const expertReviewRequired = allRules.filter(
                rule => rule.validationMethod === 'expert_review' || rule.riskLevel === 'critical'
            );

            // Calculate overall compliance score
            const overallComplianceScore = this.calculateOverallComplianceScore(
                Object.values(marketCompliance)
            );

            // Generate recommendations
            const recommendations = this.generateRegulatoryRecommendations(
                mustChangeRules,
                cannotChangeRules,
                automatedValidations,
                marketCompliance
            );

            return {
                assetId,
                brandId,
                targetMarkets,
                overallComplianceScore,
                marketCompliance,
                mustChangeRules,
                cannotChangeRules,
                shouldChangeRules,
                flexibleRules,
                preApprovedContent,
                automatedValidations,
                expertReviewRequired,
                recommendations
            };
        } catch (error) {
            console.error('Error generating regulatory matrix:', error);
            throw error;
        }
    }

    /**
     * Get pre-approved content library for rapid compliance
     * @param {string[]} markets
     * @param {string} therapeuticArea
     * @param {string} brandId
     * @returns {Promise<Record<string, string[]>>}
     */
    static async getPreApprovedContentLibrary(
        markets,
        therapeuticArea,
        brandId
    ) {
        try {
            const library = {};

            for (const market of markets) {
                const content = await this.getMarketPreApprovedContent(
                    market,
                    therapeuticArea,
                    brandId
                );
                library[market] = content;
            }

            return library;
        } catch (error) {
            console.error('Error getting pre-approved content:', error);
            return {};
        }
    }

    /**
     * Real-time regulatory compliance validation during content editing
     * @param {string} text
     * @param {string} brandId
     * @param {string} therapeuticArea
     * @param {string} targetMarket
     * @returns {Promise<{isCompliant: boolean, violations: Array<any>, suggestions: string[], preApprovedAlternatives: string[]}>}
     */
    static async validateContentInRealTime(
        text,
        brandId,
        therapeuticArea,
        targetMarket
    ) {
        try {
            const marketRules = await this.getMarketRegulatoryRules(
                targetMarket,
                therapeuticArea,
                brandId
            );

            const violations = [];
            const suggestions = [];
            const preApprovedAlternatives = [];

            // Check text against regulatory rules
            for (const rule of marketRules) {
                const violation = await this.checkTextAgainstRule(text, rule);
                if (violation) {
                    violations.push(violation);
                }
            }

            // Get pre-approved alternatives
            const preApproved = await this.getMarketPreApprovedContent(
                targetMarket,
                therapeuticArea,
                brandId
            );
            preApprovedAlternatives.push(...preApproved.slice(0, 3));

            return {
                isCompliant: violations.length === 0,
                violations,
                suggestions,
                preApprovedAlternatives
            };
        } catch (error) {
            console.error('Error validating content in real-time:', error);
            return {
                isCompliant: false,
                violations: [],
                suggestions: [],
                preApprovedAlternatives: []
            };
        }
    }

    /**
     * Generate market-specific regulatory templates
     * @param {string} market
     * @param {string} therapeuticArea
     * @param {string} assetType
     * @param {string} brandId
     * @returns {Promise<any>}
     */
    static async generateRegulatoryTemplates(
        market,
        therapeuticArea,
        assetType,
        brandId
    ) {
        try {
            const rules = await this.getMarketRegulatoryRules(market, therapeuticArea, brandId);

            const templates = {
                disclaimers: this.extractTemplatesByType(rules, 'disclaimer'),
                safetyInformation: this.extractTemplatesByType(rules, 'safety_info'),
                efficacyStatements: this.extractTemplatesByType(rules, 'efficacy_data'),
                prescribingInformation: this.extractTemplatesByType(rules, 'prescribing_info'),
                contactInformation: this.extractTemplatesByType(rules, 'contact_info')
            };

            // Add brand-specific regulatory templates
            const BRAND_IDS = {
                OFEV: '6fcf0fec-116f-46ff-ab6a-5ee70af9d36f',
                DUPIXENT: 'ab395825-f460-40d8-8faa-04926934ed62',
                ERBITUX: '1f0c5da1-f567-4c20-8830-e0d3565be0d7',
                ENTRESTO: '9b0377be-cfd6-41a3-8aad-24fdf51302cc',
                XARELTO: '6e3716b1-5930-4858-8346-b42501ea9f6b',
                TAGRISSO: '5eabc763-b6c3-4214-b875-3d7cdea8f005'
            };
            const normalizedMarket = this.normalizeMarket(market);

            if (brandId === BRAND_IDS.OFEV) {
                const temps = getOfevTemplatesByMarket(normalizedMarket);
                temps.forEach(t => {
                    if (t.templateType === 'fair_balance') templates.safetyInformation.push(t.templateContent);
                });
            } else if (brandId === BRAND_IDS.DUPIXENT) {
                const temps = getDupixentTemplatesByMarket(normalizedMarket);
                temps.forEach(t => {
                    if (t.templateType === 'fair_balance') templates.safetyInformation.push(t.templateContent);
                    else if (t.templateType === 'contact_info') templates.contactInformation.push(t.templateContent);
                });
            } else if (brandId === BRAND_IDS.ERBITUX) {
                const temps = getErbituxTemplatesByMarket(normalizedMarket);
                temps.forEach(t => {
                    if (t.templateType === 'fair_balance') templates.safetyInformation.push(t.templateContent);
                    else if (t.templateType === 'contact_info') templates.contactInformation.push(t.templateContent);
                });
            } else if (brandId === BRAND_IDS.ENTRESTO) {
                const temps = getEntrestoTemplatesByMarket(normalizedMarket);
                temps.forEach(t => {
                    if (t.templateType === 'fair_balance') templates.safetyInformation.push(t.templateContent);
                    else if (t.templateType === 'contact_block') templates.contactInformation.push(t.templateContent);
                });
            } else if (brandId === BRAND_IDS.XARELTO) {
                const temps = getXareltoTemplatesByMarket(normalizedMarket);
                temps.forEach(t => {
                    if (t.templateType === 'fair_balance') templates.safetyInformation.push(t.templateContent);
                    else if (t.templateType === 'contact_info') templates.contactInformation.push(t.templateContent);
                });
            } else if (brandId === BRAND_IDS.TAGRISSO) {
                const temps = getTagrissoTemplatesByMarket(normalizedMarket);
                temps.forEach(t => {
                    if (t.templateType === 'fair_balance') templates.safetyInformation.push(t.templateContent);
                    else if (t.templateType === 'contact_info') templates.contactInformation.push(t.templateContent);
                });
            }

            return templates;
        } catch (error) {
            console.error('Error generating regulatory templates:', error);
            return {
                disclaimers: [],
                safetyInformation: [],
                efficacyStatements: [],
                prescribingInformation: [],
                contactInformation: []
            };
        }
    }

    // Private helper methods

    /**
     * @private
     * Normalize ISO market codes to full market names for Ofev data compatibility
     * @param {string} marketCode
     * @returns {string}
     */
    static normalizeMarket(marketCode) {
        const marketMapping = {
            'DE': 'Germany',
            'US': 'US',
            'FR': 'France',
            'ES': 'Spain',
            'IT': 'Italy',
            'UK': 'United Kingdom',
            'JP': 'Japan',
            'CN': 'China',
            'CA': 'Canada',
            'AU': 'Australia'
        };
        return marketMapping[marketCode] || marketCode;
    }

    /**
     * @private
     * @param {string} market
     * @param {string} therapeuticArea
     * @param {string} brandId
     * @returns {Promise<RegulatoryMatrixEntry[]>}
     */
    static async getMarketRegulatoryRules(
        market,
        therapeuticArea,
        brandId
    ) {
        // Dynamically import supabase
        const { supabase } = await import('@/integrations/supabase/client');

        // Get rules from database
        const { data: dbRules, error } = await supabase
            .from('regulatory_compliance_matrix')
            .select('*')
            .eq('market', market)
            .eq('therapeutic_area', therapeuticArea);

        if (error) {
            console.error('Database query error:', error);
        }

        // Combine with predefined rules
        const predefinedRules = this.getPredefinedRegulatoryRules(market, therapeuticArea);
        const dbMappedRules = (dbRules || []).map(rule => this.mapDbRuleToMatrixEntry(rule));

        // Add brand-specific rules
        const BRAND_IDS = {
            OFEV: '6fcf0fec-116f-46ff-ab6a-5ee70af9d36f',
            DUPIXENT: 'ab395825-f460-40d8-8faa-04926934ed62',
            ERBITUX: '1f0c5da1-f567-4c20-8830-e0d3565be0d7',
            ENTRESTO: '9b0377be-cfd6-41a3-8aad-24fdf51302cc',
            TAGRISSO: '5eabc763-b6c3-4214-b875-3d7cdea8f005',
            XARELTO: '6e3716b1-5930-4858-8346-b42501ea9f6b',
            JARDIANCE: 'b9807b11-3d8c-483c-b025-11bb33b7da6e'
        };

        let brandRules = [];
        const sourceMarket = 'US';
        const normalizedTargetMarket = this.normalizeMarket(market);

        if (brandId === BRAND_IDS.OFEV) {
            const rules = getOfevRules(sourceMarket, normalizedTargetMarket);
            brandRules = convertOfevRulesToMatrixEntries(rules);
            console.log(`[Ofev] Loaded ${brandRules.length} rules`);
        } else if (brandId === BRAND_IDS.DUPIXENT) {
            const rules = getDupixentRules(sourceMarket, normalizedTargetMarket);
            brandRules = convertDupixentRulesToMatrixEntries(rules);
            console.log(`[Dupixent] Loaded ${brandRules.length} rules`);
        } else if (brandId === BRAND_IDS.ERBITUX) {
            const rules = getErbituxRules(sourceMarket, normalizedTargetMarket);
            brandRules = convertErbituxRulesToMatrixEntries(rules);
            console.log(`[Erbitux] Loaded ${brandRules.length} rules`);
        } else if (brandId === BRAND_IDS.ENTRESTO) {
            const rules = getEntrestoRules(sourceMarket, normalizedTargetMarket);
            brandRules = convertEntrestoRulesToMatrixEntries(rules);
            console.log(`[Entresto] Loaded ${brandRules.length} rules`);
        } else if (brandId === BRAND_IDS.XARELTO) {
            const rules = getXareltoRules(sourceMarket, normalizedTargetMarket);
            brandRules = convertXareltoRulesToMatrixEntries(rules);
            console.log(`[Xarelto] Loaded ${brandRules.length} rules`);
        } else if (brandId === BRAND_IDS.TAGRISSO) {
            const rules = getTagrissoRules(sourceMarket, normalizedTargetMarket);
            brandRules = convertTagrissoRulesToMatrixEntries(rules);
            console.log(`[Tagrisso] Loaded ${brandRules.length} rules`);
        }

        return [...predefinedRules, ...dbMappedRules, ...brandRules];
    }

    /**
     * @private
     * @param {string} market
     * @param {string} therapeuticArea
     * @returns {RegulatoryMatrixEntry[]}
     */
    static getPredefinedRegulatoryRules(
        market,
        therapeuticArea
    ) {
        // Comprehensive regulatory rules by market and therapeutic area
        const rules = {
            'US': {
                'oncology': [
                    {
                        market: 'US',
                        therapeuticArea: 'oncology',
                        ruleCategory: 'safety_information',
                        ruleId: 'US_FDA_ONCOLOGY_001',
                        ruleName: 'Black Box Warning Requirement',
                        changeRequirement: 'MUST_CHANGE',
                        description: 'All oncology products must include FDA-mandated black box warnings',
                        rationale: 'FDA regulatory requirement for serious risks',
                        riskLevel: 'critical',
                        validationMethod: 'expert_review',
                        templateContent: '[BLACK BOX WARNING: Serious and sometimes fatal reactions have been reported...]',
                        exampleTransformation: {
                            before: 'Our cancer treatment is effective',
                            after: 'Our cancer treatment is effective [BLACK BOX WARNING: Serious risks may occur...]',
                            rationale: 'FDA mandates prominent safety warnings for oncology products'
                        }
                    },
                    {
                        market: 'US',
                        therapeuticArea: 'oncology',
                        ruleCategory: 'efficacy_claims',
                        ruleId: 'US_FDA_ONCOLOGY_002',
                        ruleName: 'Clinical Trial Data Requirement',
                        changeRequirement: 'CANNOT_CHANGE',
                        description: 'Efficacy claims must match exactly approved clinical trial endpoints',
                        rationale: 'FDA approval based on specific clinical outcomes',
                        riskLevel: 'high',
                        validationMethod: 'automated',
                        preApprovedContent: ['Response rate: 35% (95% CI: 28-42%)', 'Median progression-free survival: 12.3 months'],
                        restrictedTerms: ['cure', 'eliminate cancer', 'completely safe']
                    }
                ],
                'cardiovascular': [
                    {
                        market: 'US',
                        therapeuticArea: 'cardiovascular',
                        ruleCategory: 'dosing_information',
                        ruleId: 'US_FDA_CARDIO_001',
                        ruleName: 'Dosing and Administration',
                        changeRequirement: 'CANNOT_CHANGE',
                        description: 'Dosing information must match approved prescribing information exactly',
                        rationale: 'Patient safety - incorrect dosing can be fatal',
                        riskLevel: 'critical',
                        validationMethod: 'automated',
                        preApprovedContent: ['Take 10mg once daily', 'Adjust dose in renal impairment'],
                        compliancePattern: 'exact_match_required'
                    }
                ]
            },
            'EU': {
                'oncology': [
                    {
                        market: 'EU',
                        therapeuticArea: 'oncology',
                        ruleCategory: 'patient_information',
                        ruleId: 'EMA_ONCOLOGY_001',
                        ruleName: 'Patient Information Leaflet',
                        changeRequirement: 'MUST_CHANGE',
                        description: 'Must include EMA-approved patient information leaflet content',
                        rationale: 'European regulatory requirement for patient safety',
                        riskLevel: 'high',
                        validationMethod: 'manual',
                        templateContent: 'This medicine contains [active substance]. Read all of this leaflet carefully...'
                    }
                ]
            },
            'Japan': {
                'general': [
                    {
                        market: 'Japan',
                        therapeuticArea: 'general',
                        ruleCategory: 'cultural_adaptation',
                        ruleId: 'PMDA_GENERAL_001',
                        ruleName: 'Cultural Sensitivity Requirement',
                        changeRequirement: 'SHOULD_CHANGE',
                        description: 'Adapt messaging to Japanese cultural preferences and communication style',
                        rationale: 'Cultural appropriateness and regulatory acceptance',
                        riskLevel: 'medium',
                        validationMethod: 'manual',
                        exampleTransformation: {
                            before: 'You should ask your doctor',
                            after: 'Please consider discussing with your healthcare provider',
                            rationale: 'Japanese culture prefers indirect, respectful communication'
                        }
                    }
                ]
            }
        };

        return rules[market]?.[therapeuticArea] || rules[market]?.['general'] || [];
    }

    /**
     * @private
     * @param {any} dbRule
     * @returns {RegulatoryMatrixEntry}
     */
    static mapDbRuleToMatrixEntry(dbRule) {
        return {
            market: dbRule.market,
            therapeuticArea: dbRule.therapeutic_area,
            ruleCategory: dbRule.regulation_category,
            ruleId: dbRule.id,
            ruleName: dbRule.regulation_rule,
            changeRequirement: this.mapRiskLevelToChangeRequirement(dbRule.risk_level),
            description: dbRule.rule_description || 'Regulatory compliance rule',
            rationale: dbRule.implementation_notes || 'Regulatory requirement',
            riskLevel: dbRule.risk_level,
            validationMethod: dbRule.validation_method,
            compliancePattern: dbRule.compliance_pattern
        };
    }

    /**
     * @private
     * @param {string} riskLevel
     * @returns {'MUST_CHANGE' | 'CANNOT_CHANGE' | 'SHOULD_CHANGE' | 'FLEXIBLE'}
     */
    static mapRiskLevelToChangeRequirement(riskLevel) {
        switch (riskLevel) {
            case 'critical':
                return 'CANNOT_CHANGE';
            case 'high':
                return 'MUST_CHANGE';
            case 'medium':
                return 'SHOULD_CHANGE';
            case 'low':
                return 'FLEXIBLE';
            default:
                return 'SHOULD_CHANGE';
        }
    }

    /**
     * @private
     * @param {any} asset
     * @param {RegulatoryMatrixEntry[]} rules
     * @param {string} market
     * @returns {Promise<any>}
     */
    static async analyzeAssetCompliance(
        asset,
        rules,
        market
    ) {
        let score = 100;
        const mustChangeCount = rules.filter(r => r.changeRequirement === 'MUST_CHANGE').length;
        const cannotChangeCount = rules.filter(r => r.changeRequirement === 'CANNOT_CHANGE').length;
        const shouldChangeCount = rules.filter(r => r.changeRequirement === 'SHOULD_CHANGE').length;
        const flexibleCount = rules.filter(r => r.changeRequirement === 'FLEXIBLE').length;

        // Analyze asset content against critical rules (skip if no asset)
        const criticalRules = rules.filter(r => r.riskLevel === 'critical');
        const content = asset ? `${asset.primary_content?.headline || ''} ${asset.primary_content?.body || ''}` : '';

        for (const rule of criticalRules) {
            if (rule.restrictedTerms && content) {
                const hasRestrictedTerm = rule.restrictedTerms.some(term =>
                    content.toLowerCase().includes(term.toLowerCase())
                );
                if (hasRestrictedTerm) {
                    score -= 30;
                }
            }
        }

        // Determine risk level
        let riskLevel = 'low';
        if (score < 50) riskLevel = 'critical';
        else if (score < 70) riskLevel = 'high';
        else if (score < 85) riskLevel = 'medium';

        return {
            score: Math.max(0, score),
            riskLevel,
            mustChangeCount,
            cannotChangeCount,
            shouldChangeCount,
            flexibleCount
        };
    }

    /**
     * @private
     * @param {string} market
     * @param {string} therapeuticArea
     * @param {string} brandId
     * @returns {Promise<string[]>}
     */
    static async getMarketPreApprovedContent(
        market,
        therapeuticArea,
        brandId
    ) {
        // Mock pre-approved content - in production, this would come from a comprehensive database
        const preApproved = {
            'US_oncology': [
                'Consult your healthcare provider about treatment options',
                'Individual results may vary',
                'Important Safety Information: [specific safety details]',
                'This treatment is FDA-approved for [specific indication]'
            ],
            'EU_oncology': [
                'This medicinal product is subject to additional monitoring',
                'Please refer to the Summary of Product Characteristics',
                'For more information, consult your healthcare professional'
            ],
            'Japan_general': [
                'Please consider discussing with your healthcare provider',
                'Individual consultation is recommended',
                'This information is for educational purposes'
            ]
        };

        const key = `${market}_${therapeuticArea}`;
        const baseContent = preApproved[key] || preApproved[`${market}_general`] || [];

        // Add brand-specific pre-approved content
        const BRAND_IDS = {
            OFEV: '6fcf0fec-116f-46ff-ab6a-5ee70af9d36f',
            DUPIXENT: 'ab395825-f460-40d8-8faa-04926934ed62',
            ERBITUX: '1f0c5da1-f567-4c20-8830-e0d3565be0d7'
        };
        const normalizedMarket = this.normalizeMarket(market);

        if (brandId === BRAND_IDS.OFEV) {
            const content = getOfevContentByMarket(normalizedMarket);
            return [...baseContent, ...content.map(item => item.approvedContent)];
        } else if (brandId === BRAND_IDS.DUPIXENT) {
            const content = getDupixentContentByMarket(normalizedMarket);
            return [...baseContent, ...content.map(item => item.approvedContent)];
        } else if (brandId === BRAND_IDS.ERBITUX) {
            const content = getErbituxContentByMarket(normalizedMarket);
            return [...baseContent, ...content.map(item => item.approvedContent)];
        }

        return baseContent;
    }

    /**
     * @private
     * @param {any} asset
     * @param {RegulatoryMatrixEntry[]} rules
     * @returns {Promise<AutomatedValidationResult[]>}
     */
    static async runAutomatedValidations(
        asset,
        rules
    ) {
        const validations = [];
        const content = asset ? `${asset.primary_content?.headline || ''} ${asset.primary_content?.body || ''}` : '';

        for (const rule of rules) {
            if (rule.validationMethod === 'automated') {
                let status = 'pass';
                let details = 'Content complies with regulatory requirement';

                // Check for restricted terms
                if (rule.restrictedTerms && content) {
                    const foundRestrictedTerm = rule.restrictedTerms.find(term =>
                        content.toLowerCase().includes(term.toLowerCase())
                    );
                    if (foundRestrictedTerm) {
                        status = rule.riskLevel === 'critical' ? 'fail' : 'warning';
                        details = `Contains restricted term: "${foundRestrictedTerm}"`;
                    }
                }

                // Check for required content
                if (rule.preApprovedContent && rule.changeRequirement === 'MUST_CHANGE' && content) {
                    const hasRequiredContent = rule.preApprovedContent.some(required =>
                        content.includes(required)
                    );
                    if (!hasRequiredContent) {
                        status = 'warning';
                        details = 'Missing required regulatory content';
                    }
                }

                validations.push({
                    rule: rule.ruleName,
                    status,
                    details
                });
            }
        }

        return validations;
    }

    /**
     * @private
     * @param {string} text
     * @param {RegulatoryMatrixEntry} rule
     * @returns {Promise<any | null>}
     */
    static async checkTextAgainstRule(
        text,
        rule
    ) {
        // Check for restricted terms
        if (rule.restrictedTerms) {
            const foundRestrictedTerm = rule.restrictedTerms.find(term =>
                text.toLowerCase().includes(term.toLowerCase())
            );
            if (foundRestrictedTerm) {
                return {
                    rule: rule.ruleName,
                    severity: rule.riskLevel,
                    description: `Contains restricted term: "${foundRestrictedTerm}"`,
                    suggestion: rule.preApprovedContent?.[0] || 'Use approved alternative'
                };
            }
        }

        // Check compliance pattern
        if (rule.compliancePattern === 'exact_match_required' && rule.preApprovedContent) {
            const hasExactMatch = rule.preApprovedContent.some(approved =>
                text.includes(approved)
            );
            if (!hasExactMatch) {
                return {
                    rule: rule.ruleName,
                    severity: rule.riskLevel,
                    description: 'Content must match approved text exactly',
                    suggestion: `Use: ${rule.preApprovedContent[0]}`
                };
            }
        }

        return null;
    }

    /**
     * @private
     * @param {any[]} marketScores
     * @returns {number}
     */
    static calculateOverallComplianceScore(marketScores) {
        if (marketScores.length === 0) return 100;

        const avgScore = marketScores.reduce((sum, market) => sum + market.score, 0) / marketScores.length;
        return Math.round(avgScore);
    }

    /**
     * @private
     * @param {RegulatoryMatrixEntry[]} mustChangeRules
     * @param {RegulatoryMatrixEntry[]} cannotChangeRules
     * @param {AutomatedValidationResult[]} automatedValidations
     * @param {Record<string, MarketComplianceStatus>} marketCompliance
     * @returns {string[]}
     */
    static generateRegulatoryRecommendations(
        mustChangeRules,
        cannotChangeRules,
        automatedValidations,
        marketCompliance
    ) {
        const recommendations = [];

        // Critical compliance issues
        const failedValidations = automatedValidations.filter(v => v.status === 'fail');
        if (failedValidations.length > 0) {
            recommendations.push(`URGENT: Address ${failedValidations.length} critical compliance failures`);
        }

        // Must-change requirements
        if (mustChangeRules.length > 0) {
            recommendations.push(`Implement ${mustChangeRules.length} mandatory regulatory changes`);
        }

        // Cannot-change protections
        if (cannotChangeRules.length > 0) {
            recommendations.push(`Protect ${cannotChangeRules.length} regulatory-locked elements from modification`);
        }

        // Market-specific issues
        const lowComplianceMarkets = Object.entries(marketCompliance)
            .filter(([, compliance]) => compliance.score < 70)
            .map(([market]) => market);

        if (lowComplianceMarkets.length > 0) {
            recommendations.push(`Focus compliance efforts on: ${lowComplianceMarkets.join(', ')}`);
        }

        // Expert review requirements
        const expertReviewRules = [...mustChangeRules, ...cannotChangeRules].filter(
            rule => rule.validationMethod === 'expert_review'
        );
        if (expertReviewRules.length > 0) {
            recommendations.push(`Schedule expert regulatory review for ${expertReviewRules.length} complex rules`);
        }

        return recommendations;
    }

    /**
     * @private
     * @param {RegulatoryMatrixEntry[]} rules
     * @param {string} type
     * @returns {string[]}
     */
    static extractTemplatesByType(
        rules,
        type
    ) {
        return rules
            .filter(rule => rule.ruleCategory === type && rule.templateContent)
            .map(rule => rule.templateContent)
            .filter(Boolean);
    }
}