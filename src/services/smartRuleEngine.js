// ============================================
// Smart Rule Engine Service (JavaScript)
// ============================================

// Assumed import (replace with actual JS import if necessary)
// import { supabase } from "@/integrations/supabase/client";
// Assuming supabase is imported or defined globally
const { supabase } = require("@/integrations/supabase/client");

/**
 * @typedef {Object} SmartRule
 * @property {string} id
 * @property {string} brand_id
 * @property {string} rule_name
 * @property {'conditional' | 'validation' | 'formatting' | 'regulatory'} rule_type
 * @property {'messaging' | 'tone' | 'regulatory' | 'visual' | 'competitive'} rule_category
 * @property {Object} [context_filters]
 * @property {string[]} [context_filters.audience]
 * @property {string[]} [context_filters.market]
 * @property {string[]} [context_filters.channel]
 * @property {string[]} [context_filters.content_type]
 * @property {ConditionGroup} conditions
 * @property {Action[]} conditions.then
 * @property {Action[]} [conditions.else]
 * @property {Action[]} actions - Legacy or alternative actions container
 * @property {number} priority
 * @property {boolean} is_active
 * @property {('brand' | 'campaign' | 'asset')[]} applies_to
 */

/**
 * @typedef {Object} ConditionGroup
 * @property {'AND' | 'OR'} operator
 * @property {(Condition | ConditionGroup)[]} conditions
 */

/**
 * @typedef {Object} Condition
 * @property {string} field
 * @property {'equals' | 'contains' | 'starts_with' | 'ends_with' | 'greater_than' | 'less_than' | 'in' | 'regex'} operator
 * @property {any} value
 * @property {number} [weight]
 */

/**
 * @typedef {Object} Action
 * @property {'block' | 'warn' | 'suggest' | 'modify' | 'flag'} type
 * @property {string} message
 * @property {'low' | 'medium' | 'high' | 'critical'} severity
 * @property {boolean} [auto_resolve]
 * @property {string} [suggested_fix]
 */

/**
 * @typedef {Object} RuleConflict
 * @property {string} id
 * @property {string} content_id
 * @property {'campaign' | 'asset'} content_type
 * @property {string[]} conflicting_rules
 * @property {'priority' | 'contradiction' | 'overlap'} conflict_type
 * @property {'highest_priority' | 'manual' | 'merge'} [resolution_strategy]
 * @property {boolean} resolved
 */

/**
 * @typedef {Object} RuleExecutionResult
 * @property {string} rule_id
 * @property {string} rule_name
 * @property {'pass' | 'fail' | 'warning'} result
 * @property {Action[]} actions_triggered
 * @property {number} execution_time
 * @property {any} details
 */

/**
 * @typedef {Object} ContentValidationResult
 * @property {number} overall_score
 * @property {RuleExecutionResult[]} rule_results
 * @property {RuleConflict[]} conflicts
 * @property {string[]} suggestions
 * @property {string[]} warnings
 * @property {string[]} critical_issues
 * @property {string[]} auto_fixes
 */

export class SmartRuleEngine {
    /**
     * Get all active rules for a brand with optional filtering
     * @param {string} brandId
     * @param {{rule_type?: string, rule_category?: string, applies_to?: string}} [filters]
     * @returns {Promise<SmartRule[]>}
     */
    static async getRules(brandId, filters) {
        let query = supabase
            .from('smart_rules')
            .select('*')
            .eq('brand_id', brandId)
            .eq('is_active', true)
            .order('priority', { ascending: false });

        if (filters?.rule_type) {
            query = query.eq('rule_type', filters.rule_type);
        }
        if (filters?.rule_category) {
            query = query.eq('rule_category', filters.rule_category);
        }
        if (filters?.applies_to) {
            query = query.contains('applies_to', [filters.applies_to]);
        }

        const { data, error } = await query;
        if (error) throw error;
        return (data || []);
    }

    /**
     * Create a new smart rule
     * @param {Omit<SmartRule, 'id'>} rule
     * @returns {Promise<SmartRule>}
     */
    static async createRule(rule) {
        const { data, error } = await supabase
            .from('smart_rules')
            .insert([rule])
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    /**
     * Update an existing rule
     * @param {string} id
     * @param {Partial<SmartRule>} updates
     * @returns {Promise<SmartRule>}
     */
    static async updateRule(id, updates) {
        const { data, error } = await supabase
            .from('smart_rules')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    /**
     * Validate content against all applicable rules
     * @param {string} content
     * @param {string} brandId
     * @param {{content_type: 'campaign' | 'asset', content_id: string, audience?: string, market?: string, channel?: string, asset_type?: string}} context
     * @returns {Promise<ContentValidationResult>}
     */
    static async validateContent(
        content,
        brandId,
        context
    ) {
        const startTime = Date.now();

        // Get applicable rules
        const rules = await this.getRules(brandId, {
            applies_to: context.content_type
        });

        // Filter rules by context
        const applicableRules = rules.filter(rule =>
            this.isRuleApplicable(rule, context)
        );

        // Execute rules
        /** @type {RuleExecutionResult[]} */
        const ruleResults = [];
        /** @type {RuleConflict[]} */
        const conflicts = [];

        for (const rule of applicableRules) {
            const result = await this.executeRule(rule, content, context);
            ruleResults.push(result);

            // Log execution
            await this.logRuleExecution(context.content_id, context.content_type, result);
        }

        // Detect conflicts
        const detectedConflicts = await this.detectConflicts(
            context.content_id,
            context.content_type,
            ruleResults
        );
        conflicts.push(...detectedConflicts);

        // Calculate overall score
        const overallScore = this.calculateOverallScore(ruleResults);

        // Generate suggestions and warnings
        const suggestions = this.generateSuggestions(ruleResults);
        const warnings = this.generateWarnings(ruleResults);
        const criticalIssues = this.generateCriticalIssues(ruleResults);
        const autoFixes = this.generateAutoFixes(ruleResults);

        /** @type {ContentValidationResult} */
        return {
            overall_score: overallScore,
            rule_results: ruleResults,
            conflicts,
            suggestions,
            warnings,
            critical_issues: criticalIssues,
            auto_fixes: autoFixes
        };
    }

    /**
     * Check if a rule is applicable based on context filters
     * @private
     * @param {SmartRule} rule
     * @param {any} context
     * @returns {boolean}
     */
    static isRuleApplicable(rule, context) {
        if (!rule.context_filters) return true;

        const filters = rule.context_filters;

        if (filters.audience && context.audience && !filters.audience.includes(context.audience)) {
            return false;
        }
        if (filters.market && context.market && !filters.market.includes(context.market)) {
            return false;
        }
        if (filters.channel && context.channel && !filters.channel.includes(context.channel)) {
            return false;
        }
        if (filters.content_type && context.asset_type && !filters.content_type.includes(context.asset_type)) {
            return false;
        }

        return true;
    }

    /**
     * Execute a single rule against content
     * @private
     * @param {SmartRule} rule
     * @param {string} content
     * @param {any} context
     * @returns {Promise<RuleExecutionResult>}
     */
    static async executeRule(
        rule,
        content,
        context
    ) {
        const startTime = Date.now();

        try {
            // Evaluate conditions
            const conditionResult = this.evaluateConditionGroup(rule.conditions.if, content, context);

            /** @type {Action[]} */
            let actionsTriggered = [];
            /** @type {'pass' | 'fail' | 'warning'} */
            let result = 'pass';

            if (conditionResult) {
                // Conditions met, execute 'then' actions
                actionsTriggered = rule.conditions.then || [];
                result = this.determineResultFromActions(actionsTriggered);
            } else if (rule.conditions.else) {
                // Conditions not met, execute 'else' actions
                actionsTriggered = rule.conditions.else;
                result = this.determineResultFromActions(actionsTriggered);
            }

            /** @type {RuleExecutionResult} */
            return {
                rule_id: rule.id,
                rule_name: rule.rule_name,
                result,
                actions_triggered: actionsTriggered,
                execution_time: Date.now() - startTime,
                details: {
                    condition_result: conditionResult,
                    context
                }
            };
        } catch (error) {
            /** @type {RuleExecutionResult} */
            return {
                rule_id: rule.id,
                rule_name: rule.rule_name,
                result: 'fail',
                actions_triggered: [{
                    type: 'warn',
                    message: `Rule execution failed: ${error.message || error}`,
                    severity: 'medium'
                }],
                execution_time: Date.now() - startTime,
                details: { error: error.message }
            };
        }
    }

    /**
     * Evaluate a condition group (AND/OR logic)
     * @private
     * @param {ConditionGroup} group
     * @param {string} content
     * @param {any} context
     * @returns {boolean}
     */
    static evaluateConditionGroup(group, content, context) {
        if (group.operator === 'AND') {
            return group.conditions.every(condition => {
                if (condition.operator && (condition.operator === 'AND' || condition.operator === 'OR')) {
                    return this.evaluateConditionGroup(condition, content, context);
                }
                return this.evaluateCondition(condition, content, context);
            });
        } else {
            return group.conditions.some(condition => {
                if (condition.operator && (condition.operator === 'AND' || condition.operator === 'OR')) {
                    return this.evaluateConditionGroup(condition, content, context);
                }
                return this.evaluateCondition(condition, content, context);
            });
        }
    }

    /**
     * Evaluate a single condition
     * @private
     * @param {Condition} condition
     * @param {string} content
     * @param {any} context
     * @returns {boolean}
     */
    static evaluateCondition(condition, content, context) {
        const fieldValue = this.getFieldValue(condition.field, content, context);

        switch (condition.operator) {
            case 'equals':
                return fieldValue === condition.value;
            case 'contains':
                return String(fieldValue).toLowerCase().includes(String(condition.value).toLowerCase());
            case 'starts_with':
                return String(fieldValue).toLowerCase().startsWith(String(condition.value).toLowerCase());
            case 'ends_with':
                return String(fieldValue).toLowerCase().endsWith(String(condition.value).toLowerCase());
            case 'greater_than':
                return Number(fieldValue) > Number(condition.value);
            case 'less_than':
                return Number(fieldValue) < Number(condition.value);
            case 'in':
                return Array.isArray(condition.value) && condition.value.includes(fieldValue);
            case 'regex':
                const regex = new RegExp(condition.value, 'i');
                return regex.test(String(fieldValue));
            default:
                return false;
        }
    }

    /**
     * Get field value from content or context
     * @private
     * @param {string} field
     * @param {string} content
     * @param {any} context
     * @returns {any}
     */
    static getFieldValue(field, content, context) {
        switch (field) {
            case 'content':
                return content;
            case 'content_length':
                return content.length;
            case 'word_count':
                // Simple word count by splitting on whitespace
                return content.split(/\s+/).filter(word => word.length > 0).length;
            case 'sentence_count':
                // Simple sentence count by splitting on common sentence terminators, subtracting 1 for trailing empty string
                return content.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
            default:
                return context[field];
        }
    }

    /**
     * Determine result type from actions
     * @private
     * @param {Action[]} actions
     * @returns {'pass' | 'fail' | 'warning'}
     */
    static determineResultFromActions(actions) {
        if (actions.some(action => action.type === 'block')) return 'fail';
        if (actions.some(action => action.type === 'warn' || action.type === 'flag')) return 'warning';
        return 'pass';
    }

    /**
     * Detect conflicts between rule results
     * @private
     * @param {string} contentId
     * @param {'campaign' | 'asset'} contentType
     * @param {RuleExecutionResult[]} results
     * @returns {Promise<RuleConflict[]>}
     */
    static async detectConflicts(
        contentId,
        contentType,
        results
    ) {
        /** @type {RuleConflict[]} */
        const conflicts = [];

        // Look for contradictory actions (e.g., one rule blocks, another suggests)
        const blockingRules = results.filter(r => r.actions_triggered.some(a => a.type === 'block'));
        const suggestingRules = results.filter(r => r.actions_triggered.some(a => a.type === 'suggest'));

        if (blockingRules.length > 0 && suggestingRules.length > 0) {
            /** @type {RuleConflict} */
            const conflict = {
                id: `conflict_${Date.now()}`,
                content_id: contentId,
                content_type: contentType,
                conflicting_rules: [...blockingRules.map(r => r.rule_id), ...suggestingRules.map(r => r.rule_id)],
                conflict_type: 'contradiction',
                resolved: false
            };

            // Save conflict to database
            await supabase.from('rule_conflicts').insert([{
                content_id: contentId,
                content_type: contentType,
                conflicting_rules: conflict.conflicting_rules,
                conflict_type: conflict.conflict_type
            }]);

            conflicts.push(conflict);
        }

        return conflicts;
    }

    /**
     * @private
     * @param {RuleExecutionResult[]} results
     * @returns {number}
     */
    static calculateOverallScore(results) {
        if (results.length === 0) return 100;

        const passCount = results.filter(r => r.result === 'pass').length;
        const warningCount = results.filter(r => r.result === 'warning').length;
        const failCount = results.filter(r => r.result === 'fail').length;

        // Weighted scoring: pass=100%, warning=50%, fail=0%
        const totalScore = (passCount * 100) + (warningCount * 50) + (failCount * 0);
        return Math.round(totalScore / results.length);
    }

    /**
     * @private
     * @param {RuleExecutionResult[]} results
     * @returns {string[]}
     */
    static generateSuggestions(results) {
        return results
            .flatMap(r => r.actions_triggered.filter(a => a.type === 'suggest'))
            .map(a => a.suggested_fix || a.message)
            .filter(s => s);
    }

    /**
     * @private
     * @param {RuleExecutionResult[]} results
     * @returns {string[]}
     */
    static generateWarnings(results) {
        return results
            .flatMap(r => r.actions_triggered.filter(a => a.type === 'warn'))
            .map(a => a.message);
    }

    /**
     * @private
     * @param {RuleExecutionResult[]} results
     * @returns {string[]}
     */
    static generateCriticalIssues(results) {
        return results
            .flatMap(r => r.actions_triggered.filter(a => a.severity === 'critical'))
            .map(a => a.message);
    }

    /**
     * @private
     * @param {RuleExecutionResult[]} results
     * @returns {string[]}
     */
    static generateAutoFixes(results) {
        return results
            .flatMap(r => r.actions_triggered.filter(a => a.auto_resolve && a.suggested_fix))
            .map(a => a.suggested_fix);
    }

    /**
     * Log rule execution for audit trail
     * @private
     * @param {string} contentId
     * @param {'campaign' | 'asset'} contentType
     * @param {RuleExecutionResult} result
     * @returns {Promise<void>}
     */
    static async logRuleExecution(
        contentId,
        contentType,
        result
    ) {
        await supabase.from('rule_execution_log').insert([{
            content_id: contentId,
            content_type: contentType,
            rule_id: result.rule_id,
            rule_name: result.rule_name,
            execution_result: result.result,
            execution_details: result.details,
            execution_time_ms: result.execution_time
        }]);
    }
}