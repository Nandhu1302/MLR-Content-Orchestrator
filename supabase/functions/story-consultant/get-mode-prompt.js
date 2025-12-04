// Helper to get mode-specific prompt addition
export function getModeSpecificPrompt(mode) {
  if (!mode) return '';

  // Converted TypeScript Record<string, string> to a standard JavaScript object
  const modePrompts = {
    discovery: `**DISCOVERY MODE**: User is discovering their content needs through storytelling. Guide them to articulate occasion, audience, goals, and activities. Ask ONE clarifying question at a time. Reference relevant success patterns.`,
    
    specification: `**SPECIFICATION MODE**: User has specified a theme name. Your job is to ENRICH it with supporting content (key message, tone, CTA, performance predictions) without questioning the theme itself. Ask minimal clarifying questions (audience, channel only if not provided). Accept the theme as given.`,
    
    exploration: `**EXPLORATION MODE**: User wants to explore opportunities. Proactively surface current opportunities using tools (seasonal timing, performance gaps, competitive signals, underserved audiences). Present 3-5 prioritized recommendations with data backing.`,
    
    data_first: `**DATA-FIRST MODE**: User wants insights before content creation. Lead with query_brand_status tool, present metrics with trends, highlight actionable insights, then offer content creation paths based on findings.`,
    
    collaborative: `**COLLABORATIVE MODE**: User wants brainstorming partnership. Present multiple options for decisions, validate ideas with data, build incrementally on user input, encourage refinement, show trade-offs.`,
    
    reactive: `**REACTIVE MODE**: User is reacting to external trigger (competitive launch, urgent need). Prioritize speed and tactical recommendations. Query competitive intelligence immediately. Suggest rapid-deployment channels. Emphasize timeline.`
  };
  
  // Uses the bracket notation to access the property, returning undefined (and thus '') if the mode is not found
  return modePrompts[mode] || '';
}