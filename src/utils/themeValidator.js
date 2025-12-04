
/**
 * Theme Validation and Enhancement Utilities
 * Ensures proper color application and fallback handling
 */

export class ThemeValidator {
  
  /**
   * Validates HSL color format
   */
  static isValidHSL(color) {
    return /^\d+(\.\d+)?\s+\d+(\.\d+)?%\s+\d+(\.\d+)?%$/.test(color.trim());
  }

  /**
   * Ensures color has proper contrast
   */
  static ensureContrast(color, fallback) {
    if (!this.isValidHSL(color)) {
      return fallback;
    }
    
    // Extract lightness value
    const lightnessMatch = color.match(/(\d+(?:\.\d+)?)%(?:\s*$)/);
    const lightness = lightnessMatch ? parseFloat(lightnessMatch[1]) : 50;
    
    // Ensure minimum contrast (avoid too light or too dark)
    if (lightness < 10 || lightness > 90) {
      return fallback;
    }
    
    return color;
  }

  /**
   * Get enhanced color with variants
   */
  static getColorWithVariants(baseColor) {
    if (!this.isValidHSL(baseColor)) {
      return {
        base: '221.2 83.2% 53.3%',
        hover: '221.2 83.2% 48%',
        light: '221.2 83.2% 58%',
        dark: '221.2 83.2% 43%'
      };
    }

    const parts = baseColor.match(/(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%/);
    if (!parts) {
      return {
        base: baseColor,
        hover: baseColor,
        light: baseColor,
        dark: baseColor
      };
    }

    const hue = parseFloat(parts[1]);
    const saturation = parseFloat(parts[2]);
    const lightness = parseFloat(parts[3]);

    return {
      base: baseColor,
      hover: `${hue} ${saturation}% ${Math.max(5, lightness - 5)}%`,
      light: `${hue} ${saturation}% ${Math.min(95, lightness + 10)}%`,
      dark: `${hue} ${saturation}% ${Math.max(5, lightness - 15)}%`
    };
  }

  /**
   * Apply comprehensive brand theme with company-specific styling
   */
  static applyValidatedTheme(colors) {
    const root = document.documentElement;
    
    // Primary color with variants
    const primary = this.getColorWithVariants(
      this.ensureContrast(colors.primary || '', '221.2 83.2% 53.3%')
    );
    
    root.style.setProperty('--primary', primary.base);
    root.style.setProperty('--primary-hover', primary.hover);
    root.style.setProperty('--primary-light', primary.light);
    root.style.setProperty('--primary-dark', primary.dark);

    // Secondary color with variants
    const secondary = this.getColorWithVariants(
      this.ensureContrast(colors.secondary || '', '210 40% 98%')
    );
    root.style.setProperty('--secondary', secondary.base);
    root.style.setProperty('--secondary-hover', secondary.hover);

    // Accent color with variants
    const accent = this.getColorWithVariants(
      this.ensureContrast(colors.accent || '', '142 76% 36%')
    );
    root.style.setProperty('--accent', accent.base);
    root.style.setProperty('--accent-hover', accent.hover);

    // Background and foreground
    const background = this.ensureContrast(colors.background || '', '0 0% 100%');
    const foreground = this.ensureContrast(colors.foreground || '', '222.2 84% 4.9%');
    
    root.style.setProperty('--background', background);
    root.style.setProperty('--foreground', foreground);
    root.style.setProperty('--card', background);
    root.style.setProperty('--card-foreground', foreground);

    // Apply brand-specific font family
    if (colors.fontFamily) {
      root.style.setProperty('--font-brand', colors.fontFamily);
      // Apply to body for immediate effect
      document.body.style.fontFamily = `${colors.fontFamily}, system-ui, -apple-system, sans-serif`;
    }

    // Add brand-specific CSS classes
    this.applyBrandClasses(colors.fontFamily || '');

    console.log('Applied comprehensive brand theme:', {
      primary: primary.base,
      secondary: secondary.base,
      accent: accent.base,
      fontFamily: colors.fontFamily
    });
  }

  /**
   * Apply brand-specific CSS classes for enhanced theming
   */
  static applyBrandClasses(fontFamily) {
    // Remove existing brand classes
    document.body.classList.remove('brand-astrazeneca', 'brand-bayer', 'brand-novartis', 'brand-merck', 'brand-boehringer');
    
    // Add brand-specific class based on font family
    const brandClass = this.getBrandClass(fontFamily);
    if (brandClass) {
      document.body.classList.add(brandClass);
    }
  }

  /**
   * Get brand-specific CSS class based on font family
   */
  static getBrandClass(fontFamily) {
    switch (fontFamily) {
      case 'Source Sans Pro':
        return 'brand-astrazeneca';
      case 'Helvetica Neue':
        return 'brand-bayer';
      case 'Arial':
        return 'brand-novartis';
      case 'Verdana':
        return 'brand-merck';
      default:
        return 'brand-boehringer';
    }
  }

  /**
   * Force CSS variable refresh
   */
  static forceStyleRefresh() {
    // Trigger a reflow to ensure CSS variables are applied
    const dummy = document.createElement('div');
    dummy.style.display = 'none';
    document.body.appendChild(dummy);
    dummy.offsetHeight; // Force reflow
    document.body.removeChild(dummy);
  }
}