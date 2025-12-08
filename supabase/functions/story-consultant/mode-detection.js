
// ============================================
// Mode Detection Logic for Multi-Mode AI
// Classifies user input into interaction modes
// ============================================

import { InteractionMode, ModeDetectionResult, MODE_DETECTION_PATTERNS, ThemeSpecification } from '../../../src/types/interactionModes.js';

export function detectInteractionMode(userInput, context) {
  const lowerInput = userInput.toLowerCase().trim();
  const detectionScores = {};
  const indicators = [];

  // Score each mode based on pattern matches
  Object.entries(MODE_DETECTION_PATTERNS).forEach(([mode, patterns]) => {
    const matches = patterns.filter(pattern => pattern.test(userInput));
    if (matches.length > 0) {
      detectionScores[mode] = matches.length;
      indicators.push(`${mode}: ${matches.length} pattern match(es)`);
    }
  });

  // Context-based adjustments
  if (context.conversationHistory?.length === 0 || context.conversationHistory?.length === 1) {
    // First message - check for theme specification
    const themeMatch = userInput.match(/(?:theme|campaign)\s*:\s*["']?(.+?)["']?(?:\s|$)/i);
    if (themeMatch) {
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
      suggestedApproach: 'Guide user through storytelling to understand their needs'
    };
  }

  // Find mode with highest score
  const topMode = Object.entries(detectionScores)
    .sort(([, a], [, b]) => b - a)[0];

  const confidence = Math.min(topMode[1] / 3, 1.0); // Normalize confidence

  return {
    mode: topMode[0],
    confidence,
    indicators,
    suggestedApproach: getApproachForMode(topMode[0])
  };
}

function getApproachForMode(mode) {
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
