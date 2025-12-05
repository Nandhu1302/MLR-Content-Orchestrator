import { useMemo } from 'react';
import { useBrand } from '@/contexts/BrandContext';
// IntakeTemplate type removed

/**
 * Hook to provide intelligent template recommendations
 * based on brand context and recent patterns.
 *
 * @typedef {object} TemplateRecommendation
 * @property {object} template - The IntakeTemplate object.
 * @property {number} score - The calculated relevance score.
 * @property {string[]} reasons - The reasons for the score.
 *
 * @param {Array<object>} templates - The list of available IntakeTemplate objects.
 * @returns {TemplateRecommendation[]} The sorted list of template recommendations (top 5).
 */
export const useTemplateRecommendations = (templates) => {
  const { selectedBrand } = useBrand();

  return useMemo(() => {
    if (!selectedBrand || templates.length === 0) return [];

    const recommendations = templates.map(template => {
      let score = 0;
      const reasons = [];

      // Ensure therapeutic_area is available and normalized
      const brandArea = selectedBrand.therapeutic_area ? selectedBrand.therapeutic_area.toLowerCase() : '';

      // Score 1: Therapeutic Area Match
      if (template.tags.some(tag => 
        tag.toLowerCase().includes(brandArea)
      )) {
        score += 30;
        reasons.push(`Matches ${selectedBrand.therapeutic_area} therapeutic area`);
      }

      // Score 2: Success Rate (using default 0 if undefined)
      const successRate = template.successRate || 0;
      if (successRate >= 85) {
        score += 25;
        reasons.push(`${successRate}% success rate`);
      } else if (successRate >= 70) {
        score += 15;
      }

      // Score 3: Customization Level (prefer minimal)
      if (template.customizationLevel === 'minimal') {
        score += 20;
        reasons.push('Quick setup - minimal customization needed');
      } else if (template.customizationLevel === 'moderate') {
        score += 10;
      }

      // Score 4: Estimated Time (prefer faster)
      const timeInMinutes = parseInt(template.estimatedTime);
      if (!isNaN(timeInMinutes)) {
        if (timeInMinutes <= 10) {
          score += 15;
          reasons.push(`Fast completion - ${template.estimatedTime}`);
        } else if (timeInMinutes <= 20) {
          score += 8;
        }
      }

      // Score 5: Bonus for campaign templates
      if (template.category === 'campaign') {
        score += 10;
        reasons.push('Multi-asset campaign template');
      }

      // Score 6: Bonus for popular templates
      if (template.tags.includes('Popular')) {
        score += 5;
        reasons.push('Frequently used by teams');
      }

      return {
        template,
        score,
        reasons
      };
    });

    // Sort by score descending and return top 5
    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }, [templates, selectedBrand]);
};