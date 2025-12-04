
/**
 * Personalizes template data based on selected brand
 */
export class TemplatePersonalization {
  static personalizeBrandReferences(text, brand) {
    if (!text || !brand) return text;
    
    // Replace hardcoded brand references with actual brand name
    return text
      .replace(/\bOfev\b/g, brand.brand_name)
      .replace(/\bBoehringer Ingelheim\b/g, brand.company)
      .replace(/{{brand_name}}/g, brand.brand_name)
      .replace(/{{company}}/g, brand.company);
  }

  static personalizeTemplate(template, brand) {
    if (!brand) return template;

    const personalizedTemplate = { ...template };

    // Personalize template description and names
    personalizedTemplate.name = this.personalizeBrandReferences(template.name, brand);
    personalizedTemplate.description = this.personalizeBrandReferences(template.description, brand);

    // Personalize pre-filled data
    if (personalizedTemplate.preFilledData) {
      personalizedTemplate.preFilledData = {
        ...personalizedTemplate.preFilledData,
        brand: brand.brand_name,
        primaryObjective: this.personalizeBrandReferences(
          personalizedTemplate.preFilledData.primaryObjective || '', 
          brand
        ),
        keyMessage: this.personalizeBrandReferences(
          personalizedTemplate.preFilledData.keyMessage || '', 
          brand
        ),
        callToAction: this.personalizeBrandReferences(
          personalizedTemplate.preFilledData.callToAction || '', 
          brand
        )
      };
    }

    // Personalize asset breakdown names
    if (personalizedTemplate.assetBreakdown) {
      personalizedTemplate.assetBreakdown = personalizedTemplate.assetBreakdown.map(asset => ({
        ...asset,
        name: this.personalizeBrandReferences(asset.name, brand)
      }));
    }

    return personalizedTemplate;
  }

  static personalizeTemplateList(templates, brand) {
    if (!brand) return templates;
    
    return templates.map(template => this.personalizeTemplate(template, brand));
  }

  /**
   * Get brand-specific regulatory flags based on brand configuration
   */
  static getBrandRegulatoryFlags(brand, indication, market) {
    // This would be expanded to filter regulatory flags based on brand's approved indications and markets
    // For now, return default set
    return [];
  }

  /**
   * Get brand-specific competitive messaging based on brand configuration
   */
  static getBrandCompetitiveMessaging(brand, indication) {
    // This would be expanded to return brand-specific competitive advantages
    // For now, return generic messaging
    return [
      `${brand.brand_name} proven efficacy`,
      'Established safety profile',
      'Comprehensive clinical evidence'
    ];
  }

  /**
   * Generate brand-specific key messages based on brand guidelines
   */
  static generateBrandMessages(brand, indication) {
    return [
      `${brand.brand_name}: Leading innovation in ${brand.therapeutic_area}`,
      'Evidence-based treatment solutions',
      'Improving patient outcomes through science'
    ];
  }
}
