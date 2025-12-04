// Analysis utilities for initial story parsing

/**
 * Builds the initial prompt for the AI to analyze a user's story based on brand context.
 * @param {string} userStory - The text input representing the marketing request or story.
 * @param {object} brandContext - Contextual data about the brand, claims, and success patterns.
 * @returns {string} - The complete prompt string for the AI.
 */
export function buildInitialAnalysisPrompt(userStory, brandContext) {
  const brand = brandContext.brand || {};
  const claims = brandContext.claims || [];
  const patterns = brandContext.patterns || [];

  return `You are an expert pharmaceutical marketing consultant analyzing a user's content creation story.

USER'S STORY:
${userStory}

BRAND CONTEXT:
• Brand: ${brand.brand_name || 'Biktarvy'}
• Therapeutic Area: ${brand.therapeutic_area || 'HIV'}
• Available Claims: ${claims.length} MLR-approved clinical claims
• Success Patterns: ${patterns.length} proven campaign patterns

YOUR TASK:
1. Carefully analyze the story to extract ALL details mentioned
2. Identify: occasion type, event details (name, type, region, activities), audience (type, specialties, seniority level), therapeutic area, brand mentions, timeline/urgency
3. Use the analyze_story tool to return structured data
4. Be thorough - capture region names, specific activities (booth, podium), audience characteristics (KOL, specialist), event names

FOCUS ON:
- Event details: Name, type (conference/congress), region (Midwest/Northeast), duration, specific activities
- Audience: Are they KOLs? Specialists? What's their role?
- Brand mentions: Did they mention Gilead, Biktarvy, or competitors?
- Timeline: When is the event? How urgent is the need?
- Therapeutic area: Is HIV explicitly or implicitly mentioned?

Return compliant JSON using the analyze_story tool. Do not generate text outside of the tool call.`;
}

/**
 * Generates a list of suggested next actions for the user based on the analysis of their intent.
 * This is a workflow utility to guide the user to the next logical step.
 * @param {object} intent - The structured intent object returned by the analyze_story tool.
 * @returns {Array<{label: string, value: string}>} - A list of recommended next action buttons.
 */
export function generateNextActions(intent) {
  // Check for completeness and clarity
  if (!intent || !intent.audience || !intent.activities || !intent.goals) {
    // If core elements are missing, prompt for refinement
    return [
      { label: '✏️ Refine Intent / Add Details', value: 'refine' },
      { label: '🧑‍🤝‍🧑 Specify Audience', value: 'specify-audience' },
      { label: '🎯 Define Primary Goal', value: 'define-goal' }
    ];
  }
  
  // High-level decision points
  
  // If the goal is highly focused on a specific claim or data point
  if (intent.goals.primary.includes('Communicate Safety Profile') || intent.goals.primary.includes('Communicate Efficacy')) {
    return [
      { label: '✅ Proceed to Content Generation', value: 'generate-content' },
      { label: '➕ Review Available Claims', value: 'review-claims' }
    ];
  }

  // If Audience and Activity are vague
  if (intent.audience.segments.length === 0 && intent.activities.identified.length === 0) {
    // Prompt to define channels/tactics
    if (intent.timeline.urgency === 'immediate') {
      return [
        { label: '📢 Digital Campaign', value: 'digital-campaign' },
        { label: '✉️ Email Campaign', value: 'email-campaign' },
        { label: '📱 Multi-Channel', value: 'multi-channel' },
        { label: '✅ Proceed with recommendations', value: 'proceed' }
      ];
    }
    
    // Audience and channels confirmed
    return [
      { label: '✅ Generate Themes', value: 'generate' },
      { label: '📝 Refine Strategy', value: 'refine' },
      { label: '📊 Show Intelligence', value: 'show-intelligence' }
    ];
  }
  
  // For events with activities - confirm asset preparation
  if (intent.activities.identified.length > 0) {
    return [
      { label: '✅ Prepare these materials', value: 'confirm-assets' },
      { label: '➕ Add more asset types', value: 'add-assets' },
      { label: '✏️ Adjust recommendations', value: 'adjust' }
    ];
  }
  
  // For education/competitive occasions (where audience is usually the first required step)
  if (intent.occasion.type === 'education' || intent.occasion.type === 'competitive') {
    if (intent.audience.primaryType === 'HCP' && intent.audience.seniority === 'specialist') {
      // Default path: Specialists, proceed to content
      return [
        { label: '✅ Proceed to Content Generation', value: 'generate-content' },
        { label: '👨‍⚕️ Switch to KOLs', value: 'switch-to-kols' }
      ];
    } else if (intent.audience.primaryType === 'HCP' && intent.audience.seniority === 'kol') {
      // KOL path
      return [
        { label: '📈 Generate Deep-Dive Content', value: 'deep-dive-content' },
        { label: '🗣️ Prepare Presentation Slides', value: 'slides' }
      ];
    } else if (intent.audience.primaryType === 'Patient') {
      // Patient path
      return [
        { label: '🧡 Generate Patient-Friendly Content', value: 'patient-content' },
        { label: '📚 Review Educational Resources', value: 'review-resources' }
      ];
    }
  }
  
  // Fallback if all logic branches were missed
  return [
    { label: '✅ Start Content Generation', value: 'generate-content' },
    { label: '📝 Refine Strategy', value: 'refine' },
    { label: '❓ Get Help / Contact Support', value: 'support' }
  ];
}