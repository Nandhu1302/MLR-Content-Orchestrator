// Placeholder imports for external dependencies
import { supabase } from '@/integrations/supabase/client';

/**
 * @typedef {object} BrandProfile
 * @property {string} id
 * @property {string} brand_name
 * // ... other profile fields
 */

/**
 * @typedef {object} BrandGuidelines
 * @property {string} brand_id
 * @property {object} tone_of_voice
 * @property {object} messaging_framework
 * @property {object} visual_guidelines
 * @property {object} typography
 * @property {string} last_updated
 * // ... other guidelines fields
 */

/**
 * @typedef {object} RegulatoryProfile
 * @property {string} brand_id
 * @property {string} market
 * // ... other regulatory fields
 */

/**
 * @typedef {object} CompetitiveLandscape
 * @property {string} brand_id
 * @property {string} competitor_name
 * // ... other competitive fields
 */

/**
 * @typedef {object} RegionalSettings
 * @property {string} brand_id
 * @property {string} region_code
 * // ... other regional fields
 */

/**
 * @typedef {object} BrandConfiguration
 * @property {BrandProfile} profile
 * @property {BrandGuidelines} [guidelines]
 * @property {RegulatoryProfile[]} regulatory
 * @property {CompetitiveLandscape[]} competitive
 * @property {RegionalSettings[]} regional
 */

export class BrandService {
  /**
   * Fetches all brand profiles from the database.
   * @returns {Promise<BrandProfile[]>}
   */
  static async getAllBrands() {
    const { data, error } = await supabase
      .from('brand_profiles')
      .select('*')
      .order('brand_name');

    if (error) {
      console.error('Error fetching brands:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Fetches a single brand profile by ID.
   * @param {string} brandId
   * @returns {Promise<BrandProfile | null>}
   */
  static async getBrandById(brandId) {
    const { data, error } = await supabase
      .from('brand_profiles')
      .select('*')
      .eq('id', brandId)
      .single();

    if (error) {
      console.error('Error fetching brand:', error);
      return null;
    }

    /** @type {BrandProfile} */
    return data;
  }

  /**
   * Fetches the complete configuration for a brand (profile, guidelines, regulatory, etc.).
   * @param {string} brandId
   * @returns {Promise<BrandConfiguration | null>}
   */
  static async getBrandConfiguration(brandId) {
    try {
      // Fetch brand profile
      const profile = await this.getBrandById(brandId);
      if (!profile) return null;

      // Fetch brand guidelines
      const { data: guidelinesData, error: guidelinesError } = await supabase
        .from('brand_guidelines')
        .select('*')
        .eq('brand_id', brandId)
        .maybeSingle();

      if (guidelinesError) {
        console.error('Error fetching brand guidelines:', guidelinesError);
      }

      // Fetch regulatory profiles
      const { data: regulatoryData, error: regulatoryError } = await supabase
        .from('regulatory_profiles')
        .select('*')
        .eq('brand_id', brandId);

      if (regulatoryError) {
        console.error('Error fetching regulatory profiles:', regulatoryError);
      }

      // Fetch competitive landscape
      const { data: competitiveData, error: competitiveError } = await supabase
        .from('competitive_landscape')
        .select('*')
        .eq('brand_id', brandId);

      if (competitiveError) {
        console.error('Error fetching competitive landscape:', competitiveError);
      }

      // Fetch regional settings
      const { data: regionalData, error: regionalError } = await supabase
        .from('regional_settings')
        .select('*')
        .eq('brand_id', brandId);

      if (regionalError) {
        console.error('Error fetching regional settings:', regionalError);
      }
      
      /** @type {BrandGuidelines | undefined} */
      let guidelines = guidelinesData ? {
        ...guidelinesData,
        // Asserting the types for complex JSON objects retrieved from DB
        tone_of_voice: guidelinesData.tone_of_voice,
        messaging_framework: guidelinesData.messaging_framework,
        visual_guidelines: guidelinesData.visual_guidelines,
        typography: guidelinesData.typography
      } : undefined;


      return {
        profile,
        guidelines: guidelines,
        regulatory: (regulatoryData) || [],
        competitive: (competitiveData) || [],
        regional: (regionalData) || []
      };
    } catch (error) {
      console.error('Error fetching brand configuration:', error);
      return null;
    }
  }

  /**
   * Updates the last_updated timestamp for brand guidelines.
   * @param {string} brandId
   * @returns {Promise<void>}
   */
  static async updateGuidelinesLastAccessed(brandId) {
    const { error } = await supabase
      .from('brand_guidelines')
      .update({ last_updated: new Date().toISOString() })
      .eq('brand_id', brandId);

    if (error) {
      console.error('Error updating guidelines access time:', error);
    }
  }

  /**
   * Checks if the guidelines are older than 3 months.
   * @param {string} lastUpdated ISO string date
   * @returns {boolean}
   */
  static isGuidelinesStale(lastUpdated) {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    return new Date(lastUpdated) < threeMonthsAgo;
  }
}