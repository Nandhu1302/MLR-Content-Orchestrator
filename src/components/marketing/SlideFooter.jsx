
import { useEffect, useState } from 'react';
import { BrandService } from '@/services/brandService';

const SlideFooter = ({ primaryBrandId, secondaryBrandId }) => {
  const [primaryBrand, setPrimaryBrand] = useState(null);
  const [secondaryBrand, setSecondaryBrand] = useState(null);
  const [cognizantBrand, setCognizantBrand] = useState(null);

  useEffect(() => {
    loadBrands();
  }, [primaryBrandId, secondaryBrandId]);

  const loadBrands = async () => {
    try {
      const allBrands = await BrandService.getAllBrands();

      const cognizant = allBrands.find(b => b.company.toLowerCase().includes('cognizant'));
      setCognizantBrand(cognizant || null);

      if (primaryBrandId) {
        const primary = allBrands.find(b => b.id === primaryBrandId);
        setPrimaryBrand(primary || null);
      }

      if (secondaryBrandId && secondaryBrandId !== 'none') {
        const secondary = allBrands.find(b => b.id === secondaryBrandId);
        setSecondaryBrand(secondary || null);
      } else {
        setSecondaryBrand(null);
      }
    } catch (error) {
      console.error('Failed to load brands for footer:', error);
    }
  };

  if (!primaryBrand && !cognizantBrand) {
    return null;
  }

  const isCognizantPrimary = primaryBrand?.company.toLowerCase().includes('cognizant');
  const showCognizant = cognizantBrand && !isCognizantPrimary;
  const showPrimaryCompany = primaryBrand;
  const showSecondaryCompany = secondaryBrand;

  return (
    <div className="absolute bottom-6 left-6 right-6 flex items-center justify-start gap-8 print:flex">
      <div className="flex items-center gap-8">
        {showCognizant && (
          <div className="flex items-center gap-2">
            {cognizantBrand.logo_url ? (
              <img
                src={cognizantBrand.logo_url}
                alt={cognizantBrand.company}
                className="h-12 print:h-16 object-contain animate-fade-in"
              />
            ) : (
              <div className="text-sm font-semibold text-foreground animate-fade-in">
                {cognizantBrand.company}
              </div>
            )}
          </div>
        )}

        {showPrimaryCompany && (
          <>
            {showCognizant && <div className="h-6 w-px bg-border"></div>}
            <div className="flex items-center gap-2">
              {primaryBrand.logo_url ? (
                <img
                  src={primaryBrand.logo_url}
                  alt={primaryBrand.company}
                  className="h-12 print:h-16 object-contain animate-fade-in"
                />
              ) : (
                <div className="text-sm font-semibold text-foreground animate-fade-in">
                  {primaryBrand.company}
                </div>
              )}
            </div>
          </>
        )}

        {showSecondaryCompany && (
          <>
            <div className="h-6 w-px bg-border"></div>
            <div className="flex items-center gap-2">
              {secondaryBrand.logo_url ? (
                <img
                  src={secondaryBrand.logo_url}
                  alt={secondaryBrand.company}
                  className="h-12 print:h-16 object-contain animate-fade-in"
                />
              ) : (
                <div className="text-sm font-semibold text-foreground animate-fade-in">
                  {secondaryBrand.company}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <div className="ml-auto text-xs print:text-sm text-muted-foreground/60">
        Confidential & Proprietary
      </div>
    </div>
  );
};

export default SlideFooter;
