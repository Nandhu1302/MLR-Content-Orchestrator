import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useBrandContentValidator = () => {
  const [isValidating, setIsValidating] = useState(false);

  const validateContentBrandAlignment = useCallback(async (
    content,
    brandId
  ) => {
    setIsValidating(true);

    try {
      // Get brand therapeutic area
      const { data: brandData } = await supabase
        .from('brand_profiles')
        .select('therapeutic_area, brand_name')
        .eq('id', brandId)
        .single();

      if (!brandData) {
        throw new Error('Brand not found');
      }

      const brandTherapeuticArea = (brandData.therapeutic_area || '').toLowerCase();
      const brandName = brandData.brand_name;

      // Analyze content for therapeutic indicators
      const contentText = [
        content.subject || '',
        content.headline || '',
        content.body || '',
        content.keyMessage || ''
      ].join(' ').toLowerCase();

      // Detect therapeutic area from content
      let contentTherapeuticArea = 'unknown';
      let compatibilityScore = 0;
      const recommendations = [];

      // Oncology indicators
      if (contentText.includes('cancer') ||
          contentText.includes('tumor') ||
          contentText.includes('oncology') ||
          contentText.includes('nsclc') ||
          contentText.includes('colorectal') ||
          contentText.includes('erbitux') ||
          contentText.includes('tagrisso')) {
        contentTherapeuticArea = 'oncology';
      }

      // Cardiovascular indicators
      if (contentText.includes('cardio') ||
          contentText.includes('heart') ||
          contentText.includes('afib') ||
          contentText.includes('a-fib') ||
          contentText.includes('atrial') ||
          contentText.includes('stroke') ||
          contentText.includes('xarelto') ||
          contentText.includes('entresto')) {
        contentTherapeuticArea = 'cardiovascular';
      }

      // Respiratory indicators
      if (contentText.includes('respiratory') ||
          contentText.includes('lung') ||
          contentText.includes('copd') ||
          contentText.includes('ipf') ||
          contentText.includes('asthma') ||
          contentText.includes('ofev')) {
        contentTherapeuticArea = 'respiratory';
      }

      // Calculate compatibility score
      if (brandTherapeuticArea === contentTherapeuticArea) {
        compatibilityScore = 100;
      } else if (contentTherapeuticArea === 'unknown') {
        compatibilityScore = 50; // Neutral content
        recommendations.push(`Consider adding ${brandTherapeuticArea}-specific messaging for ${brandName}`);
      } else {
        compatibilityScore = 0; // Mismatch
        recommendations.push(`Content appears to be for ${contentTherapeuticArea} but ${brandName} is in ${brandTherapeuticArea}`);
        recommendations.push(`Update content to align with ${brandName}'s therapeutic focus`);
      }

      // Additional recommendations
      if (compatibilityScore < 100) {
        switch (brandTherapeuticArea) {
          case 'oncology':
            recommendations.push('Include oncology-specific benefits and clinical evidence');
            recommendations.push('Focus on cancer treatment outcomes and patient care');
            break;
          case 'cardiovascular':
            recommendations.push('Emphasize cardiovascular risk reduction and heart health');
            recommendations.push('Include stroke prevention and cardiac protection messaging');
            break;
          case 'respiratory':
            recommendations.push('Highlight respiratory function improvement and breathing benefits');
            recommendations.push('Focus on disease progression management');
            break;
        }
      }

      return {
        isValid: compatibilityScore >= 70,
        brandTherapeuticArea,
        contentTherapeuticArea,
        compatibilityScore,
        recommendations: recommendations.slice(0, 3)
      };

    } catch (error) {
      console.error('Error validating content-brand alignment:', error);
      return {
        isValid: false,
        brandTherapeuticArea: 'unknown',
        contentTherapeuticArea: 'unknown',
        compatibilityScore: 0,
        recommendations: ['Unable to validate content alignment. Please check manually.']
      };
    } finally {
      setIsValidating(false);
    }
  }, []);

  const getBrandAppropriateContent = useCallback(async (
    brandId,
    assetType = 'email',
    indication
  ) => {
    try {
      // Get brand guidelines for appropriate content generation
      const { data: brandData } = await supabase
        .from('brand_profiles')
        .select('*')
        .eq('id', brandId)
        .single();

      const { data: guidelines } = await supabase
        .from('brand_guidelines')
        .select('*')
        .eq('brand_id', brandId)
        .maybeSingle();

      if (!brandData) return null;

      const therapeuticArea = (brandData.therapeutic_area || '').toLowerCase();
      const brandName = brandData.brand_name;

      // Generate appropriate content based on therapeutic area
      let suggestedContent = {
        subject: '',
        headline: '',
        keyMessage: '',
        body: '',
        cta: 'Learn More'
      };

      switch (therapeuticArea) {
        case 'oncology':
          suggestedContent = {
            subject: `Advancing ${indication || 'Cancer'} Treatment with ${brandName}`,
            headline: `${brandName}: Proven Results in Oncology`,
            keyMessage: `${brandName} delivers meaningful outcomes for ${indication || 'cancer'} patients`,
            body: `Discover how ${brandName} is advancing ${indication || 'cancer'} care through targeted therapy and proven clinical results.`,
            cta: 'Discuss with your patients'
          };
          break;

        case 'cardiovascular':
          suggestedContent = {
            subject: `Comprehensive Cardiovascular Protection with ${brandName}`,
            headline: `${brandName}: Evidence-Based Cardiovascular Care`,
            keyMessage: `${brandName} provides comprehensive protection for ${indication || 'cardiovascular'} patients`,
            body: `Learn how ${brandName} helps reduce cardiovascular risk and prevent stroke through proven clinical evidence.`,
            cta: 'Evaluate your patients'
          };
          break;

        case 'respiratory':
          suggestedContent = {
            subject: `Effective Respiratory Care with ${brandName}`,
            headline: `${brandName}: Breathing Made Better`,
            keyMessage: `${brandName} supports improved respiratory function for ${indication || 'respiratory'} patients`,
            body: `Explore how ${brandName} helps manage ${indication || 'respiratory'} conditions and improve quality of life.`,
            cta: 'Learn about treatment'
          };
          break;
      }

      return suggestedContent;

    } catch (error) {
      console.error('Error generating brand-appropriate content:', error);
      return null;
    }
  }, []);

  return {
    validateContentBrandAlignment,
    getBrandAppropriateContent,
    isValidating
  };
};
