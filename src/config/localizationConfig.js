
// ============================================
// Localization Configuration (converted from TypeScript)
// Defines supported markets and languages for translation services
// ============================================

/**
 * @typedef {Object} SupportedMarket
 * @property {string} code
 * @property {string} name
 * @property {string} language
 * @property {string} region
 * @property {'Low'|'Medium'|'High'} complexity
 * @property {boolean} isSupported
 * @property {boolean} [comingSoon]
 */

// Supported markets (Japanese, Chinese fully active; others coming soon)
export const SUPPORTED_MARKETS = [
  // Fully Supported
  { code: 'JP', name: 'Japan', language: 'Japanese', region: 'Asia-Pacific', complexity: 'High', isSupported: true },
  { code: 'CN', name: 'China', language: 'Chinese', region: 'Asia-Pacific', complexity: 'High', isSupported: true },
  { code: 'DE', name: 'Germany', language: 'German', region: 'Europe', complexity: 'Medium', isSupported: true },

  // Coming Soon
  { code: 'FR', name: 'France', language: 'French', region: 'Europe', complexity: 'Medium', isSupported: false, comingSoon: true },
  { code: 'ES', name: 'Spain', language: 'Spanish', region: 'Europe', complexity: 'Low', isSupported: false, comingSoon: true },
  { code: 'IT', name: 'Italy', language: 'Italian', region: 'Europe', complexity: 'Medium', isSupported: false, comingSoon: true },
  { code: 'BR', name: 'Brazil', language: 'Portuguese', region: 'Latin America', complexity: 'Medium', isSupported: false, comingSoon: true },
  { code: 'MX', name: 'Mexico', language: 'Spanish', region: 'Latin America', complexity: 'Low', isSupported: false, comingSoon: true },
  { code: 'CA', name: 'Canada', language: 'French', region: 'North America', complexity: 'Low', isSupported: false, comingSoon: true },
  { code: 'AU', name: 'Australia', language: 'English', region: 'Asia-Pacific', complexity: 'Low', isSupported: false, comingSoon: true }
];

// Helper functions
export const getSupportedMarkets = () => SUPPORTED_MARKETS.filter(market => market.isSupported);

export const getComingSoonMarkets = () => SUPPORTED_MARKETS.filter(market => market.comingSoon);

export const getAllMarkets = () => SUPPORTED_MARKETS;

export const isMarketSupported = (marketCode) => {
  const market = SUPPORTED_MARKETS.find(m => m.code === marketCode);
  return (market && market.isSupported) || false;
};

export const getSupportedLanguages = () => getSupportedMarkets().map(market => market.language);

export const SUPPORTED_LANGUAGES = ['Japanese', 'Chinese', 'German'];
export const SUPPORTED_MARKET_CODES = ['JP', 'CN', 'DE'];

// Market-to-language code mapping
export const MARKET_TO_LANGUAGE_MAP = {
  JP: 'ja',
  CN: 'zh',
  DE: 'de',
  FR: 'fr',
  ES: 'es',
  IT: 'it',
  BR: 'pt',
  MX: 'es',
  CA: 'fr',
  AU: 'en'
};

// Get language code from market code
export const getLanguageFromMarket = (marketCode) => MARKET_TO_LANGUAGE_MAP[marketCode] || 'en';

// Get language codes from multiple markets
export const getLanguagesFromMarkets = (marketCodes) => marketCodes.map(code => getLanguageFromMarket(code));

// Default export for convenience
export default {
  SUPPORTED_MARKETS,
  getSupportedMarkets,
  getComingSoonMarkets,
  getAllMarkets,
  isMarketSupported,
  getSupportedLanguages,
  SUPPORTED_LANGUAGES,
  SUPPORTED_MARKET_CODES,
  MARKET_TO_LANGUAGE_MAP,
  getLanguageFromMarket,
  getLanguagesFromMarkets
};
