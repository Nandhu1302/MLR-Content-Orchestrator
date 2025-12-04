
/**
 * Blends two brand profiles into a cohesive theme
 * @param primary - Primary brand (dominant)
 * @param secondary - Secondary brand (accent)
 * @param intensity - How much secondary brand shows (0-100)
 */
export const blendBrandThemes = (
  primary,
  secondary,
  intensity = 30
) => {
  if (!secondary || intensity === 0) {
    return {
      primary: primary.primary_color,
      secondary: primary.secondary_color,
      accent: primary.accent_color,
      gradientFrom: primary.primary_color,
      gradientTo: primary.accent_color,
      fontFamily: primary.font_family,
    };
  }
  // Normalize intensity to 0-1
  const blend = intensity / 100;
  // Parse HSL colors
  const parsePrimary = parseHSL(primary.primary_color);
  const parseSecondary = parseHSL(secondary.accent_color);
  // Blend the accent color with secondary brand
  const blendedAccent = blendHSL(
    parseHSL(primary.accent_color),
    parseHSL(secondary.accent_color),
    blend
  );
  // Create gradient blend
  const gradientFrom = primary.primary_color;
  const gradientTo = blendHSL(
    parseHSL(primary.accent_color),
    parseHSL(secondary.primary_color),
    blend * 0.5
  );
  return {
    primary: primary.primary_color, // Keep primary brand dominant
    secondary: primary.secondary_color,
    accent: blendedAccent,
    gradientFrom,
    gradientTo,
    fontFamily: primary.font_family,
  };
};

/**
 * Parse HSL string to components
 * Handles formats: "221 83% 53%" or "221.2 83.2% 53.3%"
 */
const parseHSL = (hslString) => {
  if (!hslString) {
    console.warn('Empty HSL string provided');
    return { h: 0, s: 0, l: 0 };
  }
  // Remove any hsl() wrapper if present
  const cleaned = hslString.replace(/hsl\(|\)/g, '').trim();
  // Split by space and parse, removing % signs
  const parts = cleaned.split(/\s+/).map((p) => parseFloat(p.replace('%', '')));
  if (parts.length < 3) {
    console.warn('Invalid HSL format:', hslString);
    return { h: 0, s: 0, l: 0 };
  }
  const [h, s, l] = parts;
  return {
    h: isNaN(h) ? 0 : h,
    s: isNaN(s) ? 0 : s,
    l: isNaN(l) ? 0 : l,
  };
};

/**
 * Blend two HSL colors
 */
const blendHSL = (
  color1,
  color2,
  ratio
) => {
  // Handle hue wrapping for smooth color transitions
  let h1 = color1.h;
  let h2 = color2.h;
  // If hues are more than 180° apart, wrap around
  if (Math.abs(h2 - h1) > 180) {
    if (h1 > h2) {
      h2 += 360;
    } else {
      h1 += 360;
    }
  }
  const h = (h1 + (h2 - h1) * ratio) % 360;
  const s = color1.s + (color2.s - color1.s) * ratio;
  const l = color1.l + (color2.l - color1.l) * ratio;
  // Ensure values are within valid ranges
  const finalH = Math.max(0, Math.min(360, Math.round(h * 10) / 10));
  const finalS = Math.max(0, Math.min(100, Math.round(s * 10) / 10));
  const finalL = Math.max(0, Math.min(100, Math.round(l * 10) / 10));
  return `${finalH} ${finalS}% ${finalL}%`;
};

/**
 * Generate a palette of theme-consistent colors from primary and accent
 * @param count - Number of colors to generate
 * @returns Array of HSL color strings
 */
export const generateColorPalette = (count) => {
  const root = document.documentElement;
  const primaryStr = getComputedStyle(root).getPropertyValue('--primary').trim();
  const primary = parseHSL(primaryStr);
  const colors = [];
  // Generate variations of the primary color only (different lightness/saturation)
  for (let i = 0; i < count; i++) {
    const ratio = i / Math.max(count - 1, 1);
    // Create variations by adjusting lightness and slightly adjusting saturation
    // Keep hue constant to maintain brand color
    const lightnessVariation = primary.l + (ratio * 15 - 7.5); // Range: -7.5% to +7.5%
    const saturationVariation = primary.s + (ratio * 10 - 5); // Range: -5% to +5%
    const h = primary.h;
    const s = Math.max(20, Math.min(100, saturationVariation));
    const l = Math.max(30, Math.min(70, lightnessVariation));
    colors.push(`${h} ${s}% ${l}%`);
  }
  return colors;
};

/**
 * Get a theme color variation
 * @param baseColor - Base HSL color string
 * @param variation - Type of variation ('light', 'lighter', 'dark', 'darker', 'opacity')
 * @returns HSL color string
 */
export const getThemeColorVariation = (baseColor, variation = 'light') => {
  const parsed = parseHSL(baseColor);
  switch (variation) {
    case 'lighter':
      return `${parsed.h} ${Math.max(0, parsed.s - 10)}% ${Math.min(100, parsed.l + 20)}%`;
    case 'light':
      return `${parsed.h} ${Math.max(0, parsed.s - 5)}% ${Math.min(100, parsed.l + 10)}%`;
    case 'dark':
      return `${parsed.h} ${Math.min(100, parsed.s + 5)}% ${Math.max(0, parsed.l - 10)}%`;
    case 'darker':
      return `${parsed.h} ${Math.min(100, parsed.s + 10)}% ${Math.max(0, parsed.l - 20)}%`;
    case 'opacity':
      return `${parsed.h} ${parsed.s}% ${parsed.l}%`;
    default:
      return baseColor;
  }
};

/**
 * Apply blended theme to CSS variables
 */
export const applyBlendedTheme = (theme) => {
  const root = document.documentElement;
  console.log('Applying blended theme:', theme);
  // Apply brand-specific variables
  root.style.setProperty('--brand-primary', theme.primary);
  root.style.setProperty('--brand-secondary', theme.secondary);
  root.style.setProperty('--brand-accent', theme.accent);
  root.style.setProperty('--brand-gradient-from', theme.gradientFrom);
  root.style.setProperty('--brand-gradient-to', theme.gradientTo);
  // Apply to standard design system variables for immediate effect
  root.style.setProperty('--primary', theme.primary);
  root.style.setProperty('--accent', theme.accent);
  // Generate and apply color palette variations
  const palette = generateColorPalette(6);
  palette.forEach((color, index) => {
    root.style.setProperty(`--theme-color-${index + 1}`, color);
  });
  // Force style recalculation for slides to pick up changes
  document.body.style.display = 'none';
  document.body.offsetHeight; // Trigger reflow
  document.body.style.display = '';
  console.log('Theme applied successfully. CSS variables set:', {
    primary: getComputedStyle(root).getPropertyValue('--primary'),
    accent: getComputedStyle(root).getPropertyValue('--accent'),
    palette: palette,
  });
};