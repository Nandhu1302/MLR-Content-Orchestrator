/**
 * @typedef {Object} StrategicContext
 * @property {string} campaignObjective
 * @property {string} keyMessage
 * @property {string} targetAudience
 * @property {string} indication
 * @property {string} assetType
 */

/**
 * @typedef {Object} FilteredPIData
 * @property {Record<string, any>} selectedSections
 * @property {string[]} reasoning
 * @property {number} relevanceScore
 * @property {string} usageGuidance
 */

/**
 * @typedef {Object} PIData
 * @property {string[]} [indications]
 * @property {string} [mechanism_of_action]
 * @property {string} [clinical_pharmacology]
 * @property {any[]} [clinical_trials]
 * @property {any[]} [efficacy_data]
 * @property {any} [safety_profile]
 * @property {any[]} [adverse_events]
 * @property {any} [dosing]
 * @property {string} [administration]
 * @property {string[]} [contraindications]
 * @property {string[]} [warnings]
 * @property {any[]} [drug_interactions]
 * @property {string} [patient_selection]
 */

/**
 * PIEvidenceSelector - Intelligently filters PI data based on campaign context
 * * This service ensures that only relevant clinical evidence is used in content generation,
 * preventing overloading content with unnecessary data and ensuring strategic alignment.
 */
export class PIEvidenceSelector {
    /**
     * Main entry point - filters PI data based on strategic context
     * @param {PIData | null} piData
     * @param {StrategicContext} context
     * @returns {FilteredPIData | null}
     */
    static filterPIForContext(
        piData,
        context
    ) {
        if (!piData) {
            console.log('PIEvidenceSelector: No PI data available');
            return null;
        }

        console.log('PIEvidenceSelector: Filtering PI data for context:', context);

        // Determine which sections are needed based on objective
        const objectiveMap = this.mapObjectiveToSections(context.campaignObjective);

        // Analyze key message for evidence needs
        const messageNeeds = this.analyzeKeyMessage(context.keyMessage);

        // Check audience type for content appropriateness
        const audienceFilter = this.getAudienceFilter(context.targetAudience);

        // Combine all filters
        const neededSections = new Set([
            ...objectiveMap,
            ...messageNeeds,
            ...audienceFilter
        ]);

        // Extract only relevant sections
        const selectedSections = {};
        const reasoning = [];

        neededSections.forEach(section => {
            if (piData[section]) {
                selectedSections[section] = piData[section];
                reasoning.push(`Including ${section}: ${this.getSelectionReason(section, context)}`);
            }
        });

        // Calculate relevance score
        const relevanceScore = this.calculateRelevanceScore(
            selectedSections,
            context,
            piData
        );

        // Generate usage guidance
        const usageGuidance = this.generateUsageGuidance(
            selectedSections,
            context
        );

        console.log('PIEvidenceSelector: Filtered result:', {
            selectedSections: Object.keys(selectedSections),
            relevanceScore,
            reasoning
        });

        return {
            selectedSections,
            reasoning,
            relevanceScore,
            usageGuidance
        };
    }

    /**
     * Map campaign objectives to relevant PI sections
     * @private
     * @param {string} objective
     * @returns {string[]}
     */
    static mapObjectiveToSections(objective) {
        const lowercaseObjective = objective.toLowerCase();

        // Clinical education - focus on MOA and clinical pharmacology
        if (lowercaseObjective.includes('clinical') || lowercaseObjective.includes('education')) {
            return [
                'mechanism_of_action',
                'clinical_pharmacology',
                'indications',
                'clinical_trials'
            ];
        }

        // Evidence communication - focus on trials and efficacy
        if (lowercaseObjective.includes('evidence') || lowercaseObjective.includes('efficacy')) {
            return [
                'clinical_trials',
                'efficacy_data',
                'indications'
            ];
        }

        // Practice support - focus on practical usage
        if (lowercaseObjective.includes('practice') || lowercaseObjective.includes('support')) {
            return [
                'dosing',
                'administration',
                'patient_selection',
                'indications'
            ];
        }

        // Safety communication - focus on safety profile
        if (lowercaseObjective.includes('safety') || lowercaseObjective.includes('tolerability')) {
            return [
                'safety_profile',
                'adverse_events',
                'contraindications',
                'warnings'
            ];
        }

        // Disease awareness (especially for patients) - minimal PI use
        if (lowercaseObjective.includes('awareness') || lowercaseObjective.includes('disease')) {
            return ['indications']; // Only basic indication info
        }

        // Default for general objectives
        return ['indications', 'clinical_trials', 'efficacy_data'];
    }

    /**
     * Analyze key message to determine evidence needs
     * @private
     * @param {string} keyMessage
     * @returns {string[]}
     */
    static analyzeKeyMessage(keyMessage) {
        const lowercaseMessage = keyMessage.toLowerCase();
        const sections = [];

        // Efficacy claims
        if (lowercaseMessage.includes('proven') ||
            lowercaseMessage.includes('efficacy') ||
            lowercaseMessage.includes('effective')) {
            sections.push('clinical_trials', 'efficacy_data');
        }

        // Safety/tolerability claims
        if (lowercaseMessage.includes('safe') ||
            lowercaseMessage.includes('tolerat') ||
            lowercaseMessage.includes('well-tolerated')) {
            sections.push('safety_profile', 'adverse_events');
        }

        // Convenience/dosing claims
        if (lowercaseMessage.includes('once') ||
            lowercaseMessage.includes('convenient') ||
            lowercaseMessage.includes('dosing')) {
            sections.push('dosing', 'administration');
        }

        // Rapid onset claims
        if (lowercaseMessage.includes('rapid') ||
            lowercaseMessage.includes('fast') ||
            lowercaseMessage.includes('quick')) {
            sections.push('efficacy_data', 'clinical_pharmacology');
        }

        // Mechanism claims
        if (lowercaseMessage.includes('mechanism') ||
            lowercaseMessage.includes('how it works') ||
            lowercaseMessage.includes('targets')) {
            sections.push('mechanism_of_action', 'clinical_pharmacology');
        }

        return sections;
    }

    /**
     * Get audience-appropriate PI sections
     * @private
     * @param {string} audience
     * @returns {string[]}
     */
    static getAudienceFilter(audience) {
        const lowercaseAudience = audience.toLowerCase();

        // Patient/Caregiver - very limited PI use (educational only)
        if (lowercaseAudience.includes('patient') || lowercaseAudience.includes('caregiver')) {
            return ['indications']; // Only basic indication, no detailed clinical data
        }

        // HCP - can receive detailed clinical information
        if (lowercaseAudience.includes('hcp') ||
            lowercaseAudience.includes('physician') ||
            lowercaseAudience.includes('prescriber')) {
            return [
                'indications',
                'mechanism_of_action',
                'clinical_trials',
                'efficacy_data',
                'safety_profile',
                'dosing',
                'contraindications'
            ];
        }

        // Default - moderate detail
        return ['indications', 'efficacy_data'];
    }

    /**
     * Get human-readable reason for section selection
     * @private
     * @param {string} section
     * @param {StrategicContext} context
     * @returns {string}
     */
    static getSelectionReason(section, context) {
        const reasons = {
            'mechanism_of_action': `Supports clinical education objective and understanding of therapeutic approach`,
            'clinical_pharmacology': `Provides scientific foundation for ${context.indication} treatment`,
            'clinical_trials': `Substantiates efficacy claims with clinical evidence`,
            'efficacy_data': `Demonstrates therapeutic benefit relevant to key message`,
            'safety_profile': `Addresses safety and tolerability aspects of the message`,
            'adverse_events': `Provides balanced information on treatment risks`,
            'dosing': `Supports practical implementation and convenience messaging`,
            'administration': `Clarifies usage for healthcare providers`,
            'patient_selection': `Guides appropriate patient identification`,
            'indications': `Establishes approved therapeutic uses`,
            'contraindications': `Ensures safe and appropriate use`,
            'warnings': `Critical safety information for prescribers`
        };

        return reasons[section] || `Relevant to campaign objective`;
    }

    /**
     * Calculate how relevant the selected evidence is to the context
     * @private
     * @param {Record<string, any>} selectedSections
     * @param {StrategicContext} context
     * @param {PIData} fullPIData
     * @returns {number}
     */
    static calculateRelevanceScore(
        selectedSections,
        context,
        fullPIData
    ) {
        let score = 0;

        // Base score for having any sections
        if (Object.keys(selectedSections).length > 0) {
            score += 30;
        }

        // Bonus for objective alignment
        const objectiveSections = this.mapObjectiveToSections(context.campaignObjective);
        const matchedObjectiveSections = objectiveSections.filter(s => selectedSections[s]);
        score += (matchedObjectiveSections.length / objectiveSections.length) * 40;

        // Bonus for key message alignment
        const messageSections = this.analyzeKeyMessage(context.keyMessage);
        const matchedMessageSections = messageSections.filter(s => selectedSections[s]);
        if (messageSections.length > 0) {
            score += (matchedMessageSections.length / messageSections.length) * 30;
        } else {
            score += 15; // Partial credit if no specific message needs
        }

        return Math.min(Math.round(score), 100);
    }

    /**
     * Generate guidance on how to use the selected evidence
     * @private
     * @param {Record<string, any>} selectedSections
     * @param {StrategicContext} context
     * @returns {string}
     */
    static generateUsageGuidance(
        selectedSections,
        context
    ) {
        const sectionCount = Object.keys(selectedSections).length;

        if (sectionCount === 0) {
            return 'No PI data selected. Content will be strategic and educational without specific clinical claims.';
        }

        const guidance = [];

        // Audience-specific guidance
        if (context.targetAudience.toLowerCase().includes('patient')) {
            guidance.push('Use patient-friendly language and avoid medical jargon.');
            guidance.push('Focus on benefits and practical information rather than clinical details.');
        } else {
            guidance.push('Use professional medical terminology appropriate for healthcare providers.');
            guidance.push('Include specific data points and clinical evidence to support claims.');
        }

        // Objective-specific guidance
        if (context.campaignObjective.toLowerCase().includes('awareness')) {
            guidance.push('Focus on educational content rather than promotional claims.');
        } else if (context.campaignObjective.toLowerCase().includes('evidence')) {
            guidance.push('Lead with clinical data and trial results to establish credibility.');
        }

        // Section-specific guidance
        if (selectedSections.clinical_trials) {
            guidance.push('Reference specific trial names and endpoints where relevant.');
        }
        if (selectedSections.safety_profile) {
            guidance.push('Present safety information in a balanced manner alongside efficacy.');
        }
        if (selectedSections.dosing) {
            guidance.push('Highlight dosing convenience if it supports the key message.');
        }

        return guidance.join(' ');
    }

    /**
     * Check if PI data is needed for this context
     * @static
     * @param {StrategicContext} context
     * @returns {boolean}
     */
    static isPINeeded(context) {
        const objective = context.campaignObjective.toLowerCase();
        const audience = context.targetAudience.toLowerCase();

        // Patient awareness campaigns typically don't need PI
        if (audience.includes('patient') && objective.includes('awareness')) {
            return false;
        }

        // Disease awareness for caregivers
        if (audience.includes('caregiver') && objective.includes('awareness')) {
            return false;
        }

        // Most other scenarios benefit from PI data
        return true;
    }
}