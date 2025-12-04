// ============================================
// Mode Detection Logic for Multi-Mode AI
// Classifies user input into interaction modes
// ============================================

// --- Simulated Type Definitions for Context Preservation ---

// 1. InteractionMode (Replaced TypeScript Enum)
const InteractionMode = {
  DISCOVERY: 'discovery',
  SPECIFICATION: 'specification',
  EXPLORATION: 'exploration',
  DATA_FIRST: 'data_first',
  COLLABORATIVE: 'collaborative',
  REACTIVE: 'reactive'
};

// 2. MODE_DETECTION_PATTERNS (Replaced external import)
// These patterns are used to score the likelihood of each interaction mode.
const MODE_DETECTION_PATTERNS = {
  [InteractionMode.DISCOVERY]: [
    /i need a campaign/i,
    /for the congress/i,
    /i have an event/i,
    /launch event/i,
  ],
  [InteractionMode.SPECIFICATION]: [
    /theme:\s*.+/i,
    /campaign:\s*.+/i,
    /generate theme/i,
    /create content for theme/i,
  ],
  [InteractionMode.EXPLORATION]: [
    /opportunity/i,
    /what should i do/i,
    /new idea/i,
    /what are my options/i,
  ],
  [InteractionMode.DATA_FIRST]: [
    /show data/i,
    /what are the metrics/i,
    /brand status/i,
    /performance/i,
  ],
  [InteractionMode.COLLABORATIVE]: [
    /what do you think/i,
    /help me brainstorm/i,
    /let's refine/i,
    /co-create/i,
  ],
  [InteractionMode.REACTIVE]: [
    /urgent/i,
    /asap/i,
    /competitor launch/i,
    /regulatory change/i,
  ]
};

// --- Core Functions ---

export function detectInteractionMode(userInput, context) {
  const lowerInput = userInput.toLowerCase().trim();
  const detectionScores = {};
  const indicators = [];

  // Score each mode based on pattern matches
  Object.entries(MODE_DETECTION_PATTERNS).forEach(([mode, patterns]) => {
    // Note: The original TypeScript code cast `mode` to InteractionMode.
    // In JavaScript, we just use the string key.
    const matches = patterns.filter(pattern => pattern.test(userInput));
    if (matches.length > 0) {
      detectionScores[mode] = (detectionScores[mode] || 0) + matches.length;
      indicators.push(`${mode}: ${matches.length} pattern match(es)`);
    }
  });

  // Context-based adjustments
  if (context.conversationHistory?.length === 0 || context.conversationHistory?.length === 1) {
    // First message - check for theme specification
    const themeMatch = userInput.match(/(?:theme|campaign)\s*:\s*["']?(.+?)["']?(?:\s|$)/i);
    if (themeMatch) {
      // Boost score significantly for explicit, first-message specification
      detectionScores[InteractionMode.SPECIFICATION] = (detectionScores[InteractionMode.SPECIFICATION] || 0) + 5;
      indicators.push('Theme specification detected in format "theme: [name]"');
    }
  }

  // If no patterns matched, default to Discovery
  if (Object.keys(detectionScores).length === 0) {
    return {
      mode: InteractionMode.DISCOVERY,
      confidence: 0.5,
      indicators: ['No specific patterns detected - defaulting to Discovery mode'],
      suggestedApproach: getApproachForMode(InteractionMode.DISCOVERY)
    };
  }

  // Find mode with highest score
  const topModeEntry = Object.entries(detectionScores)
    .sort(([, a], [, b]) => b - a)[0];
  
  const topMode = topModeEntry[0];
  const topScore = topModeEntry[1];

  // Normalize confidence (Max score 3 is arbitrary in the original, using 5 for a smoother normalization)
  const confidence = Math.min(topScore / 5, 1.0); 

  return {
    mode: topMode,
    confidence,
    indicators,
    suggestedApproach: getApproachForMode(topMode)
  };
}

function getApproachForMode(mode) {
  // Replaced TypeScript Record<InteractionMode, string> with a standard JavaScript object
  const approaches = {
    [InteractionMode.DISCOVERY]: 'Guide user through storytelling to understand occasion, audience, and goals',
    [InteractionMode.SPECIFICATION]: 'Accept theme name and enrich with supporting content',
    [InteractionMode.EXPLORATION]: 'Surface proactive opportunities and let user select',
    [InteractionMode.DATA_FIRST]: 'Lead with brand metrics and insights, then offer content paths',
    [InteractionMode.COLLABORATIVE]: 'Present options, iterate on ideas, and co-create solutions',
    [InteractionMode.REACTIVE]: 'Provide rapid counter-messaging and tactical recommendations'
  };
  return approaches[mode];
}

export function extractThemeSpecification(userInput) {
  // Pattern 1: "theme: [name]" or "campaign: [name]"
  const explicitMatch = userInput.match(/(?:theme|campaign)\s*:\s*["']?(.+?)["']?(?:\s*(?:for|targeting|with))?/i);
  if (explicitMatch) {
    const themeName = explicitMatch[1].trim();
    
    // Try to extract additional context
    const audienceMatch = userInput.match(/(?:for|targeting|audience)\s*:?\s*([^,\n]+)/i);
    const channelMatch = userInput.match(/(?:channels?|via|on)\s*:?\s*([^,\n]+)/i);
    
    return {
      themeName,
      targetAudience: audienceMatch ? audienceMatch[1].trim() : undefined,
      channels: channelMatch ? [channelMatch[1].trim()] : undefined
    };
  }

  // Pattern 2: "Generate/Create a theme: [name]"
  const generateMatch = userInput.match(/(?:generate|create|make)\s+(?:a\s+)?theme\s*:?\s*["']?(.+?)["']?(?:\s|$)/i);
  if (generateMatch) {
    return {
      themeName: generateMatch[1].trim()
    };
  }

  return null;
}