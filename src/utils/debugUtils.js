
/**
 * Debug utilities for clearing stale data and troubleshooting
 */
export class DebugUtils {
  /**
   * Clear all draft data from localStorage
   */
  static clearAllDrafts() {
    const keysToRemove = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('draft_')) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach(key => localStorage.removeItem(key));
    console.log(`Cleared ${keysToRemove.length} draft items`);
  }

  /**
   * Clear all brand data from localStorage
   */
  static clearBrandData() {
    localStorage.removeItem('selectedBrandId');
    localStorage.removeItem('brandLastUpdated');
    console.log('Cleared brand data');
  }

  /**
   * Clear all localStorage data
   */
  static clearAllLocalStorage() {
    localStorage.clear();
    console.log('Cleared all localStorage data');
  }

  /**
   * Get localStorage debug info
   */
  static getLocalStorageInfo() {
    const info = {
      totalItems: localStorage.length,
      drafts: 0,
      brandData: {
        selectedBrandId: localStorage.getItem('selectedBrandId'),
        brandLastUpdated: localStorage.getItem('brandLastUpdated')
      },
      allKeys: []
    };

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        info.allKeys.push(key);
        if (key.startsWith('draft_')) {
          info.drafts++;
        }
      }
    }

    console.log('LocalStorage Debug Info:', info);
    return info;
  }

  /**
   * Validate brand system health
   */
  static async validateBrandSystem() {
    const info = {
      localStorage: this.getLocalStorageInfo(),
      cssVariables: {
        primary: getComputedStyle(document.documentElement).getPropertyValue('--primary'),
        secondary: getComputedStyle(document.documentElement).getPropertyValue('--secondary'),
        accent: getComputedStyle(document.documentElement).getPropertyValue('--accent'),
        fontFamily: getComputedStyle(document.documentElement).getPropertyValue('--font-family')
      },
      bodyClasses: document.body.className,
      timestamp: new Date().toISOString()
    };

    console.log('Brand System Health Check:', info);
    return info;
  }

  /**
   * Auto-recover from brand issues
   */
  static autoRecover() {
    console.log('Starting brand system auto-recovery...');

    // Clear potentially corrupted data
    this.clearBrandData();

    // Reset CSS variables to safe defaults
    const root = document.documentElement;
    root.style.setProperty('--primary', '210 84% 45%');
    root.style.setProperty('--secondary', '210 30% 96%');
    root.style.setProperty('--accent', '142 76% 36%');
    root.style.setProperty('--font-family', 'Inter');

    // Clean body classes
    document.body.className = document.body.className.replace(/brand-\w+/g, '');

    console.log('Auto-recovery completed');
  }
}