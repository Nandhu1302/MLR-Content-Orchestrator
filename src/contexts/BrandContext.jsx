import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { BrandService } from '@/services/brandService';
import { useAuth } from '@/contexts/AuthContext';
import { useUserBrandAccess } from '@/hooks/useUserBrandAccess';
import { ThemeValidator } from '@/utils/themeValidator';
import { blendBrandThemes, applyBlendedTheme } from '@/utils/brandThemeBlender';

const BrandContext = createContext(undefined);

export const useBrand = () => {
  const context = useContext(BrandContext);
  if (context === undefined) {
    throw new Error('useBrand must be used within a BrandProvider');
  }
  return context;
};

export const BrandProvider = ({ children }) => {
  const { user } = useAuth();
  const { data: availableBrands } = useUserBrandAccess();
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [brandConfiguration, setBrandConfiguration] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [needsUpdate, setNeedsUpdate] = useState(false);
  const [coBranding, setCoBranding] = useState({
    primaryBrand: null,
    secondaryBrand: null,
    blendIntensity: 30,
  });

  // Auto-select first brand for demo users or load persisted brand
  // Use ref to prevent re-initialization on every user/availableBrands change
  const hasInitialized = useRef(false);
  
  useEffect(() => {
    if (hasInitialized.current || !user || isLoading || !availableBrands?.length) return;
    
    hasInitialized.current = true;
    const savedBrandId = localStorage.getItem('selectedBrandId');
    
    if (savedBrandId && availableBrands.some(brand => brand.id === savedBrandId)) {
      console.log('Loading saved brand:', savedBrandId);
      loadBrandConfiguration(savedBrandId);
    } else if (availableBrands.length > 0) {
      // Prioritize Pradaxa (has demo content) for reliable startup
      const pradaxaBrand = availableBrands.find(brand => brand.brand_name === 'Pradaxa');
      const firstBrand = pradaxaBrand || availableBrands[0];
      console.log('Auto-selecting prioritized brand:', firstBrand.brand_name);
      selectBrand(firstBrand.id);
    }
  }, [user, availableBrands, isLoading]);

  const loadBrandConfiguration = async (brandId) => {
    setIsLoading(true);
    try {
      console.log('Loading brand configuration for:', brandId);
      const configuration = await BrandService.getBrandConfiguration(brandId);
      
      if (!configuration) {
        console.error('No brand configuration found for:', brandId);
        throw new Error(`Brand configuration not found for ID: ${brandId}`);
      }
      
      setSelectedBrand(configuration.profile);
      setBrandConfiguration(configuration);
      setLastUpdated(new Date());
      setNeedsUpdate(false);
      
      console.log('Brand configuration loaded successfully:', configuration.profile.brand_name);
      applyBrandTheme(configuration.profile);
      
    } catch (error) {
      console.error('Failed to load brand configuration:', error);
      setBrandConfiguration(null);
      setNeedsUpdate(true);
      
      // Apply fallback theme to prevent broken styling
      applyFallbackTheme();
    } finally {
      setIsLoading(false);
    }
  };

  // Apply brand theme to CSS variables with validation
  const applyBrandTheme = (profile) => {
    ThemeValidator.applyValidatedTheme({
      primary: profile.primary_color,
      secondary: profile.secondary_color,
      accent: profile.accent_color,
      fontFamily: profile.font_family,
    });
    
    // Apply brand-specific body class for company branding
    document.body.className = document.body.className.replace(/brand-\w+/g, '');
    const companyClass = `brand-${profile.company.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`;
    document.body.classList.add(companyClass);
    
    // Add therapeutic area class for context-specific styling
    const therapeuticClass = `therapeutic-${profile.therapeutic_area.toLowerCase().replace(/\s+/g, '-')}`;
    document.body.classList.add(therapeuticClass);
    
    console.log(`Applied comprehensive brand theme for ${profile.brand_name} (${profile.company}):`, {
      primary: profile.primary_color,
      secondary: profile.secondary_color,
      accent: profile.accent_color,
      fontFamily: profile.font_family,
      companyClass,
      therapeuticClass
    });
  };

  const applyFallbackTheme = () => {
    // Use ThemeValidator for consistent fallback theme
    ThemeValidator.applyValidatedTheme({
      primary: '221.2 83.2% 53.3%',
      secondary: '210 40% 98%',
      accent: '142 76% 36%',
      background: '0 0% 100%',
      foreground: '222.2 84% 4.9%',
      fontFamily: 'Inter'
    });

    // Remove brand-specific classes
    document.body.className = document.body.className.replace(/brand-\w+|therapeutic-\w+/g, '');
    
    console.log('Applied comprehensive fallback theme with full branding reset');
  };

  const selectBrand = async (brandId) => {
    setIsLoading(true);
    try {
      const configuration = await BrandService.getBrandConfiguration(brandId);
      if (configuration) {
        setSelectedBrand(configuration.profile);
        setBrandConfiguration(configuration);
        
        // Apply theme
        applyBrandTheme(configuration.profile);
        
        // Update last accessed time
        await BrandService.updateGuidelinesLastAccessed(brandId);
        const now = new Date();
        setLastUpdated(now);
        setNeedsUpdate(false);
        
        // Persist to localStorage
        localStorage.setItem('selectedBrandId', brandId);
        localStorage.setItem('brandLastUpdated', now.toISOString());
      }
    } catch (error) {
      console.error('Error selecting brand:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshBrand = async () => {
    if (selectedBrand) {
      await selectBrand(selectedBrand.id);
    }
  };

  const clearBrand = () => {
    console.log('Clearing brand data');
    setSelectedBrand(null);
    setBrandConfiguration(null);
    setLastUpdated(null);
    setNeedsUpdate(false);
    localStorage.removeItem('selectedBrandId');
    localStorage.removeItem('brandLastUpdated');
    
    // Apply fallback theme instead of removing properties
    applyFallbackTheme();
  };

  const applyCoBranding = async (primaryId, secondaryId, intensity) => {
    try {
      const primary = await BrandService.getBrandById(primaryId);
      const secondary = secondaryId ? await BrandService.getBrandById(secondaryId) : null;

      if (primary) {
        const blendedTheme = blendBrandThemes(primary, secondary, intensity);
        applyBlendedTheme(blendedTheme);
        
        setCoBranding({
          primaryBrand: primaryId,
          secondaryBrand: secondaryId,
          blendIntensity: intensity,
        });
      }
    } catch (error) {
      console.error('Error applying co-branding:', error);
    }
  };

  const value = {
    selectedBrand,
    brandConfiguration,
    isLoading,
    lastUpdated,
    needsUpdate,
    selectBrand,
    refreshBrand,
    clearBrand,
    coBranding,
    applyCoBranding,
  };

  return (
    <BrandContext.Provider value={value}>
      {children}
    </BrandContext.Provider>
  );
};