
/**
 * Validates brand configuration consistency across systems
 */
export class BrandConfigValidator {
  
  // Expected mappings for validation
  static EXPECTED_BRAND_MAPPINGS = [
    {
      brandName: 'Ofev', 
      therapeuticArea: 'Respiratory',
      indications: ['IPF', 'SSc-ILD', 'Progressive-Fibrosing-ILD']
    },
    {
      brandName: 'Jardiance',
      therapeuticArea: 'Cardiovascular',
      indications: ['Type-2-Diabetes', 'Cardiovascular-Death-Reduction', 'Heart-Failure']
    },
    {
      brandName: 'Pradaxa',
      therapeuticArea: 'Cardiovascular', 
      indications: ['A-Fib', 'VTE-Prevention', 'Stroke-Prevention']
    },
    {
      brandName: 'Xarelto',
      therapeuticArea: 'Cardiovascular',
      indications: ['A-Fib', 'VTE-Prevention', 'Stroke-Prevention']
    },
    {
      brandName: 'Entresto',
      therapeuticArea: 'Cardiovascular',
      indications: ['Heart-Failure', 'Cardiovascular-Death-Reduction']
    },
    {
      brandName: 'Tagrisso',
      therapeuticArea: 'Oncology',
      indications: ['NSCLC', 'EGFR-Mutated-NSCLC']
    },
    {
      brandName: 'Erbitux',
      therapeuticArea: 'Oncology',
      indications: ['Colorectal-Cancer', 'Head-Neck-Cancer']
    },
    {
      brandName: 'Dupixent',
      therapeuticArea: 'Immunology',
      indications: ['Atopic-Dermatitis', 'Asthma', 'Chronic-Rhinosinusitis']
    },
    {
      brandName: 'Biktarvy',
      therapeuticArea: 'HIV/AIDS',
      indications: ['HIV-Treatment']
    }
  ];

  /**
   * Validates if brand indications match therapeutic area
   */
  static validateBrandIndications(
    brand, 
    indications
  ) {
    const warnings = [];
    
    const expectedMapping = this.EXPECTED_BRAND_MAPPINGS.find(
      m => m.brandName === brand.brand_name
    );
    
    if (!expectedMapping) {
      warnings.push(`No expected mapping found for brand: ${brand.brand_name}`);
      return { isValid: false, warnings };
    }
    
    // Check therapeutic area alignment
    if (brand.therapeutic_area !== expectedMapping.therapeuticArea) {
      warnings.push(
        `Therapeutic area mismatch for ${brand.brand_name}: ` +
        `expected "${expectedMapping.therapeuticArea}", got "${brand.therapeutic_area}"`
      );
    }
    
    // Check indication alignment
    const unexpectedIndications = indications.filter(
      indication => !expectedMapping.indications.includes(indication)
    );
    
    if (unexpectedIndications.length > 0) {
      warnings.push(
        `Unexpected indications for ${brand.brand_name}: ${unexpectedIndications.join(', ')}. ` +
        `Expected: ${expectedMapping.indications.join(', ')}`
      );
    }
    
    const isValid = warnings.length === 0;
    
    if (!isValid) {
      console.warn('Brand configuration validation failed:', warnings);
    } else {
      console.log(`✅ Brand configuration valid for ${brand.brand_name}`);
    }
    
    return { isValid, warnings };
  }
  
  /**
   * Gets expected indications for a brand
   */
  static getExpectedIndications(brandName) {
    const mapping = this.EXPECTED_BRAND_MAPPINGS.find(
      m => m.brandName === brandName
    );
    
    if (!mapping) {
      console.warn(`No expected indications found for brand: ${brandName}`);
      return [];
    }
    
    return mapping.indications;
  }
  
  /**
   * Checks if therapeutic area matches indications
   */
  static isTherapeuticAreaAligned(
    therapeuticArea, 
    indications
  ) {
    
    const respiratoryIndications = ['IPF', 'SSc-ILD', 'Progressive-Fibrosing-ILD'];
    const cardiovascularIndications = ['A-Fib', 'VTE-Prevention', 'Stroke-Prevention', 'Type-2-Diabetes', 'Cardiovascular-Death-Reduction', 'Heart-Failure'];
    const oncologyIndications = ['NSCLC', 'EGFR-Mutated-NSCLC', 'Colorectal-Cancer', 'Head-Neck-Cancer'];
    const immunologyIndications = ['Atopic-Dermatitis', 'Asthma', 'Chronic-Rhinosinusitis'];
    
    if (therapeuticArea === 'Respiratory') {
      return indications.every(indication => respiratoryIndications.includes(indication));
    }
    
    if (therapeuticArea === 'Cardiovascular') {
      return indications.every(indication => cardiovascularIndications.includes(indication));
    }
    
    if (therapeuticArea === 'Oncology') {
      return indications.every(indication => oncologyIndications.includes(indication));
    }
    
    if (therapeuticArea === 'Immunology') {
      return indications.every(indication => immunologyIndications.includes(indication));
    }
    
    const hivIndications = ['HIV-Treatment', 'HIV-Prevention', 'HIV-PrEP'];
    if (therapeuticArea === 'HIV/AIDS') {
      return indications.every(indication => hivIndications.includes(indication));
    }
    
    console.warn(`Unknown therapeutic area: ${therapeuticArea}`);
    return false;
  }
}