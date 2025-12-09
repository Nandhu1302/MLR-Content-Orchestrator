//interaction
 
// Enum replacement: frozen object to mimic TypeScript enum
export const InteractionMode = Object.freeze({
  DISCOVERY: 'discovery',            // "I need content for a conference"
  SPECIFICATION: 'specification',    // "Create a theme: Winter Immunity & HIV Awareness"
  EXPLORATION: 'exploration',        // "What opportunities exist right now?"
  DATA_FIRST: 'data_first',          // "What's going on with my brand?"
  COLLABORATIVE: 'collaborative',    // "Help me brainstorm ideas"
  REACTIVE: 'reactive'               // "Competitor X just launched Y"
});
 
// Mode detection patterns
export const MODE_DETECTION_PATTERNS = {
  [InteractionMode.SPECIFICATION]: [
    /(?:create|generate|make)\s+(?:a\s+)?theme/i,
    /(?:theme|campaign)\s*:\s*["']?.+["']?/i,
    /^i\s+have\s+a\s+theme/i,
    /^my\s+theme\s+is/i
  ],
  [InteractionMode.EXPLORATION]: [
    /what\s+(?:opportunities|suggestions|ideas|options)/i,
    /what\s+should\s+i\s+(?:do|create|focus\s+on)/i,
    /explore\s+(?:options|possibilities)/i,
    /show\s+me\s+(?:opportunities|what's\s+available)/i
  ],
  [InteractionMode.DATA_FIRST]: [
    /what'?s?\s+(?:going\s+on|happening)\s+with/i,
    /show\s+me\s+(?:the\s+)?(?:data|metrics|performance)/i,
    /how\s+is\s+my\s+(?:brand|campaign)/i,
    /give\s+me\s+a\s+(?:brief|update|summary)/i
  ],
  [InteractionMode.COLLABORATIVE]: [
    /help\s+me\s+(?:brainstorm|think|develop)/i,
    /let'?s?\s+(?:work|collaborate|explore)/i,
    /i\s+need\s+(?:help|guidance|advice)\s+(?:with|on)/i,
    /work\s+with\s+me\s+on/i
  ],
  [InteractionMode.REACTIVE]: [
    /competitor\s+.+\s+(?:launched|released|announced)/i,
    /respond\s+to\s+(?:competitor|competitive)/i,
    /counter\s+(?:messaging|campaign)/i,
    /urgent.+(?:competitive|threat)/i
  ],
  [InteractionMode.DISCOVERY]: [
    /i\s+need\s+content\s+for/i,
    /preparing\s+for/i,
    /upcoming\s+(?:event|conference|campaign)/i,
    /planning\s+(?:a|an)/i
  ]
};
 
// Mode-specific prompts (no types; just plain JS objects)
export const MODE_SPECIFIC_PROMPTS = {
  [InteractionMode.DISCOVERY]: {
    mode: InteractionMode.DISCOVERY,
    systemPromptAddition: `User is discovering content needs through storytelling. Guide them to articulate occasion, audience, goals, and activities. Ask ONE clarifying question at a time.`,
    expectedBehavior: [
      'Extract occasion, audience, activities, and goals',
      'Ask clarifying questions one at a time',
      'Reference relevant success patterns',
      'Build comprehensive understanding before suggesting'
    ],
    quickReplyTemplates: [
      { label: '🎪 Event', value: 'event' },
      { label: '🚀 Launch', value: 'launch' },
      { label: '📚 Education', value: 'education' }
    ]
  },
  [InteractionMode.SPECIFICATION]: {
    mode: InteractionMode.SPECIFICATION,
    systemPromptAddition: `User has specified a theme name. Your job is to ENRICH it with supporting content (key message, tone, CTA, claims, visuals, performance predictions) without questioning the theme itself.`,
    expectedBehavior: [
      'Accept theme name as given',
      'Ask minimal clarifying questions (audience, channel only)',
      'Immediately fetch relevant evidence',
      'Generate enriched theme with AI synthesis',
      'Return single enriched ThemeOption'
    ],
    quickReplyTemplates: [
      { label: '👨‍⚕️ HCP Focus', value: 'hcp' },
      { label: '🤝 Patient Focus', value: 'patient' },
      { label: '📧 Email First', value: 'email' },
      { label: '🌐 Website First', value: 'website' }
    ]
  },
  [InteractionMode.EXPLORATION]: {
    mode: InteractionMode.EXPLORATION,
    systemPromptAddition: `User wants to explore opportunities. Proactively surface current opportunities (seasonal timing, performance gaps, competitive signals, underserved audiences). Present 3-5 prioritized recommendations.`,
    expectedBehavior: [
      'Query ProactiveIntelligenceService for opportunities',
      'Present top 3-5 opportunities with urgency indicators',
      'Include data backing (why this opportunity exists)',
      'Suggest specific actions for each opportunity',
      'Allow user to select opportunity to develop'
    ],
    quickReplyTemplates: [
      { label: '📊 Show Top Opportunities', value: 'show-opportunities' },
      { label: '🎯 Performance Gaps', value: 'gaps' },
      { label: '⚔️ Competitive Signals', value: 'competitive' },
      { label: '🌱 Seasonal Timing', value: 'seasonal' }
    ]
  },
  [InteractionMode.DATA_FIRST]: {
    mode: InteractionMode.DATA_FIRST,
    systemPromptAddition: `User wants data and insights first. Lead with brand status, market trends, campaign performance, and HCP engagement. Then offer to create content based on findings.`,
    expectedBehavior: [
      'Call query_brand_status tool immediately',
      'Present metrics with context and trends',
      'Highlight actionable insights',
      'Offer content creation paths based on data',
      'Reference specific performance numbers'
    ],
    quickReplyTemplates: [
      { label: '📊 Brand Status', value: 'brand-status' },
      { label: '📈 Campaign Performance', value: 'campaign-performance' },
      { label: '🎯 Audience Insights', value: 'audience-insights' },
      { label: '💡 Content Suggestions', value: 'suggest-content' }
    ]
  },
  [InteractionMode.COLLABORATIVE]: {
    mode: InteractionMode.COLLABORATIVE,
    systemPromptAddition: `User wants collaborative brainstorming. Act as a thought partner. Present options, validate ideas, build on their input, and co-create solutions. Encourage iteration.`,
    expectedBehavior: [
      'Present multiple options for every decision point',
      'Validate user ideas with data where possible',
      'Build incrementally on user input',
      'Encourage refinement and iteration',
      'Show trade-offs between options'
    ],
    quickReplyTemplates: [
      { label: '💭 Brainstorm Options', value: 'brainstorm' },
      { label: '🔄 Iterate on Idea', value: 'iterate' },
      { label: '⚖️ Compare Approaches', value: 'compare' },
      { label: '✨ Refine Theme', value: 'refine' }
    ]
  },
  [InteractionMode.REACTIVE]: {
    mode: InteractionMode.REACTIVE,
    systemPromptAddition: `User is reacting to external trigger (competitive launch, market event, urgent need). Prioritize speed, relevance, and tactical recommendations. Reference competitive intelligence.`,
    expectedBehavior: [
      'Query competitive intelligence immediately',
      'Present counter-messaging options',
      'Suggest rapid-deployment channels',
      'Reference similar reactive campaign success patterns',
      'Emphasize timeline and urgency'
    ],
    quickReplyTemplates: [
      { label: '⚔️ Counter-Messaging', value: 'counter-message' },
      { label: '⚡ Rapid Deploy', value: 'rapid-deploy' },
      { label: '🎯 Competitive Intel', value: 'competitive-intel' },
      { label: '📢 Response Strategy', value: 'response-strategy' }
    ]
  }
};
 