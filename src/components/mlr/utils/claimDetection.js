
/**
 * Claim Detection Utility
 * Analyzes content to detect claim types and map to required safety statements
 */

// Patterns for detecting different claim types in content
const CLAIM_PATTERNS = {
  efficacy: [
    /\b(efficacy|effective|efficacious)\b/i,
    /\b(viral suppression|suppressed|undetectable)\b/i,
    /\b(response rate|remission|improvement)\b/i,
    /\b(success rate|treatment success)\b/i,
    /\b(primary endpoint|met.*endpoint)\b/i,
    /\b(statistically significant|p\s*[<≤]\s*0\.0\d+)\b/i,
    /\b(demonstrated|shown to|proven)\b/i,
    /\b(\d+%\s*(response|improvement|reduction))\b/i,
  ],
  safety: [
    /\b(safe|safety profile)\b/i,
    /\b(adverse (event|reaction|effect)s?)\b/i,
    /\b(side effect|contraindicated)\b/i,
    /\b(warning|precaution|caution)\b/i,
    /\b(risk of|risk for)\b/i,
    /\b(serious.*event|fatal|death)\b/i,
    /\b(discontinue|discontinuation due to)\b/i,
    /\b(hepatotoxicity|nephrotoxicity|cardiotoxicity)\b/i,
  ],
  comparative: [
    /\b(better|superior|inferior|non-inferior)\b/i,
    /\b(compared to|versus|vs\.?)\b/i,
    /\b(more effective|less effective)\b/i,
    /\b(outperform|exceed|surpass)\b/i,
    /\b(head-to-head|comparative|comparison)\b/i,
    /\b(switch from|switching|switched)\b/i,
    /\b(first|only|best)\s+(in class|treatment|option)\b/i,
  ],
  dosing: [
    /\b(dose|dosing|dosage)\b/i,
    /\b(once daily|twice daily|qd|bid|tid)\b/i,
    /\b(mg|milligram|tablet|capsule)\b/i,
    /\b(with food|without food|meal)\b/i,
    /\b(renal|hepatic)\s*(impairment|adjustment)\b/i,
    /\b(titrat(e|ion)|adjustment)\b/i,
  ],
  indication: [
    /\b(indicated|indication|approved for)\b/i,
    /\b(treatment of|treatment for)\b/i,
    /\b(patients with|adults with|children with)\b/i,
    /\b(first-line|second-line|adjunct)\b/i,
    /\b(hiv-1|type 2 diabetes|oncology|immunology)\b/i,
    /\b(in combination with)\b/i,
  ],
  mechanism: [
    /\b(mechanism of action|moa)\b/i,
    /\b(inhibit|inhibitor|block|blocker)\b/i,
    /\b(bind|binding|receptor)\b/i,
    /\b(pathway|target|modulate)\b/i,
    /\b(integrase|protease|reverse transcriptase)\b/i,
  ],
  tolerability: [
    /\b(tolerat(ed|ability|e))\b/i,
    /\b(well-tolerated|generally tolerated)\b/i,
    /\b(discontinuation rate)\b/i,
    /\b(patient.*(accept|prefer|satisf))\b/i,
    /\b(quality of life|qol)\b/i,
  ],
};

// Map claim types to required safety statement types
const CLAIM_TO_SAFETY_MAP = {
  efficacy: ['boxed_warning', 'adverse_reaction', 'warning', 'precaution'],
  safety: ['contraindication', 'warning', 'precaution', 'adverse_reaction'],
  comparative: ['boxed_warning', 'adverse_reaction', 'warning', 'precaution', 'contraindication'],
  dosing: ['warning', 'precaution', 'contraindication'],
  indication: ['boxed_warning', 'contraindication', 'warning', 'precaution'],
  mechanism: ['warning', 'precaution'],
  tolerability: ['adverse_reaction', 'warning', 'precaution'],
};

/**
 * Analyze content for claim types
 */
export const analyzeContentForClaimTypes = (content) => {
  if (!content || content.trim().length === 0) {
    return { detectedTypes: [], confidence: 0, matches: [] };
  }

  const contentLower = content.toLowerCase();
  const matches = [];
  const detectedTypes = [];

  for (const [claimType, patterns] of Object.entries(CLAIM_PATTERNS)) {
    const matchedPhrases = [];

    for (const pattern of patterns) {
      const match = contentLower.match(pattern);
      if (match) {
        matchedPhrases.push(match[0]);
      }
    }

    if (matchedPhrases.length > 0) {
      detectedTypes.push(claimType);
      matches.push({ type: claimType, phrases: [...new Set(matchedPhrases)] });
    }
  }

  const totalMatches = matches.reduce((sum, m) => sum + m.phrases.length, 0);
  const confidence = Math.min(100, Math.round((totalMatches / 5) * 100));

  return { detectedTypes, confidence, matches };
};

/**
 * Get required safety types for claims
 */
export const getRequiredSafetyTypesForClaims = (claimTypes) => {
  if (claimTypes.length === 0) return [];

  const requiredTypes = new Set();
  for (const claimType of claimTypes) {
    const safetyTypes = CLAIM_TO_SAFETY_MAP[claimType] || [];
    safetyTypes.forEach((type) => requiredTypes.add(type));
  }

  return Array.from(requiredTypes);
};

/**
 * Check if specific safety statement is required
 */
export const isStatementRequiredForClaims = (statementType, claimTypes) => {
  const requiredTypes = getRequiredSafetyTypesForClaims(claimTypes);
  return requiredTypes.includes(statementType);
};

/**
 * Check statement presence with semantic matching
 */
export const checkStatementPresence = (statementText, content) => {
  if (!content || !statementText) {
    return { isPresent: false, matchedPhrases: [] };
  }

  const contentLower = content.toLowerCase();
  const matchedPhrases = [];

  const keyPhrases = statementText
    .toLowerCase()
    .split(/[.,;:\n]/)
    .map((p) => p.trim())
    .filter((p) => p.length > 15);

  for (const phrase of keyPhrases) {
    if (contentLower.includes(phrase)) {
      matchedPhrases.push(phrase);
      continue;
    }

    const words = phrase.split(/\s+/).filter((w) => w.length > 3);
    if (words.length >= 3) {
      const threeWordCombos = [];
      for (let i = 0; i <= words.length - 3; i++) {
        threeWordCombos.push(words.slice(i, i + 3).join(' '));
      }

      for (const combo of threeWordCombos) {
        if (contentLower.includes(combo)) {
          matchedPhrases.push(combo);
          break;
        }
      }
    }
  }

  return {
    isPresent: matchedPhrases.length > 0,
    matchedPhrases: [...new Set(matchedPhrases)],
  };
};
