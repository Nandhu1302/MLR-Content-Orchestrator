import { useMemo } from 'react';
import { useBrand } from '@/contexts/BrandContext';
import { allTemplates } from '@/data/templates';
import { TemplatePersonalization } from '@/utils/templatePersonalization';

export const useBrandTemplates = () => {
  const { selectedBrand } = useBrand();

  const personalizedTemplates = useMemo(() => {
    return TemplatePersonalization.personalizeTemplateList(allTemplates, selectedBrand || undefined);
  }, [selectedBrand]);

  const campaignTemplates = useMemo(() => {
    return personalizedTemplates.filter(template => template.category === 'campaign');
  }, [personalizedTemplates]);

  const singleAssetTemplates = useMemo(() => {
    return personalizedTemplates.filter(template => template.category === 'single-asset');
  }, [personalizedTemplates]);

  return {
    allTemplates: personalizedTemplates,
    campaignTemplates,
    singleAssetTemplates,
    selectedBrand
  };
};

export default useBrandTemplates;
