import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Palette, Settings2 } from 'lucide-react';
import { BrandService } from '@/services/brandService';
import { blendBrandThemes, applyBlendedTheme } from '@/utils/brandThemeBlender';
import { useSlideTheme } from '@/contexts/SlideThemeContext';

const BrandThemeSelector = ({ compact = false, onThemeChange }) => {
  const [brands, setBrands] = useState([]);
  const [primaryBrandId, setPrimaryBrandId] = useState('');
  const [secondaryBrandId, setSecondaryBrandId] = useState('none');
  const [blendIntensity, setBlendIntensity] = useState(30);
  
  // Renamed context setters to avoid collision with useState setters and match usage in applyTheme
  const { setPrimaryBrandId: setContextPrimaryBrandId, setSecondaryBrandId: setContextSecondaryBrandId } = useSlideTheme();

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    try {
      const allBrands = await BrandService.getAllBrands();
      setBrands(allBrands);
      
      // Set Cognizant as default primary if available
      const cognizant = allBrands.find(b => b.company.toLowerCase().includes('cognizant'));
      if (cognizant) {
        setPrimaryBrandId(cognizant.id);
      }
    } catch (error) {
      console.error('Failed to load brands:', error);
    }
  };

  useEffect(() => {
    applyTheme();
  }, [primaryBrandId, secondaryBrandId, blendIntensity, brands]);

  const applyTheme = () => {
    const primary = brands.find(b => b.id === primaryBrandId);
    const secondary = secondaryBrandId !== 'none' ? brands.find(b => b.id === secondaryBrandId) : null;

    if (primary) {
      const blendedTheme = blendBrandThemes(primary, secondary || null, blendIntensity);
      applyBlendedTheme(blendedTheme);
      onThemeChange?.(primary, secondary || null, blendIntensity);
      
      // Update context for footer
      if (typeof setContextPrimaryBrandId === 'function') {
        setContextPrimaryBrandId(primaryBrandId);
      }
      if (typeof setContextSecondaryBrandId === 'function') {
        setContextSecondaryBrandId(secondaryBrandId !== 'none' ? secondaryBrandId : null);
      }
    }
  };

  const getPharmaClients = () => {
    return brands.filter(b => 
      !b.company.toLowerCase().includes('cognizant') &&
      ['Novartis', 'Gilead', 'Sanofi', 'UCB'].some(name => 
        b.company.includes(name) || b.brand_name.includes(name)
      )
    );
  };

  const getCognizantBrand = () => {
    return brands.find(b => b.company.toLowerCase().includes('cognizant'));
  };

  if (compact) {
    return (
      <div className="flex items-center gap-3 bg-card border border-border rounded-lg px-3 py-2">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium whitespace-nowrap">Theme</span>
        </div>
        
        <div className="flex items-center gap-2 flex-1">
          <Select value={primaryBrandId} onValueChange={setPrimaryBrandId}>
            <SelectTrigger className="h-9 w-[180px]">
              <SelectValue placeholder="Primary" />
            </SelectTrigger>
            <SelectContent>
              {getCognizantBrand() && (
                <SelectItem value={getCognizantBrand().id}>
                  {getCognizantBrand().brand_name}
                </SelectItem>
              )}
              {brands.filter(b => !b.company.toLowerCase().includes('cognizant')).map(brand => (
                <SelectItem key={brand.id} value={brand.id}>
                  {brand.brand_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <span className="text-xs text-muted-foreground">+</span>
          
          <Select value={secondaryBrandId} onValueChange={setSecondaryBrandId}>
            <SelectTrigger className="h-9 w-[180px]">
              <SelectValue placeholder="Co-Brand" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {getPharmaClients().map(brand => (
                <SelectItem key={brand.id} value={brand.id}>
                  {brand.brand_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {secondaryBrandId !== 'none' && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 w-9 p-0">
                <Settings2 className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72">
              <div className="space-y-2">
                <Label htmlFor="blend-intensity">Blend: {blendIntensity}%</Label>
                <Slider
                  id="blend-intensity"
                  min={10}
                  max={50}
                  step={5}
                  value={[blendIntensity]}
                  onValueChange={(values) => setBlendIntensity(values[0])}
                />
                <p className="text-xs text-muted-foreground">
                  Controls client brand influence
                </p>
              </div>
            </PopoverContent>
          </Popover>
        )}
        
        {primaryBrandId && (
          <div className="flex gap-1 ml-2">
            <div 
              className="w-6 h-6 rounded border border-border"
              style={{ backgroundColor: `hsl(${brands.find(b => b.id === primaryBrandId)?.primary_color})` }}
              title="Primary"
            />
            <div 
              className="w-6 h-6 rounded border border-border"
              style={{ backgroundColor: `hsl(${brands.find(b => b.id === primaryBrandId)?.accent_color})` }}
              title="Accent"
            />
            {secondaryBrandId !== 'none' && (
              <div 
                className="w-6 h-6 rounded border border-border"
                style={{ backgroundColor: `hsl(${brands.find(b => b.id === secondaryBrandId)?.accent_color})` }}
                title="Co-Brand"
              />
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4 bg-card border border-border rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        <Palette className="w-4 h-4 text-primary" />
        <h3 className="font-semibold">Co-Branding Theme</h3>
      </div>

      <div className="space-y-3">
        <div>
          <Label htmlFor="primary-brand">Primary Brand</Label>
          <Select value={primaryBrandId} onValueChange={setPrimaryBrandId}>
            <SelectTrigger id="primary-brand">
              <SelectValue placeholder="Select primary brand" />
            </SelectTrigger>
            <SelectContent>
              {getCognizantBrand() && (
                <SelectItem value={getCognizantBrand().id}>
                  {getCognizantBrand().brand_name} (Cognizant)
                </SelectItem>
              )}
              {brands.filter(b => !b.company.toLowerCase().includes('cognizant')).map(brand => (
                <SelectItem key={brand.id} value={brand.id}>
                  {brand.brand_name} ({brand.company})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="secondary-brand">Co-Brand With (Client)</Label>
          <Select value={secondaryBrandId} onValueChange={setSecondaryBrandId}>
            <SelectTrigger id="secondary-brand">
              <SelectValue placeholder="Select co-brand" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None (100% Primary)</SelectItem>
              {getPharmaClients().map(brand => (
                <SelectItem key={brand.id} value={brand.id}>
                  {brand.brand_name} ({brand.company})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {secondaryBrandId !== 'none' && (
          <div>
            <Label htmlFor="blend-intensity">
              Brand Blend Intensity: {blendIntensity}%
            </Label>
            <Slider
              id="blend-intensity"
              min={10}
              max={50}
              step={5}
              value={[blendIntensity]}
              onValueChange={(values) => setBlendIntensity(values[0])}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Controls how much client brand colors show through
            </p>
          </div>
        )}

        {primaryBrandId && (
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <p className="text-xs font-medium mb-2">Theme Preview</p>
            <div className="flex gap-2">
              <div 
                className="w-12 h-12 rounded border"
                style={{ backgroundColor: `hsl(${brands.find(b => b.id === primaryBrandId)?.primary_color})` }}
                title="Primary Color"
              />
              <div 
                className="w-12 h-12 rounded border"
                style={{ backgroundColor: `hsl(${brands.find(b => b.id === primaryBrandId)?.accent_color})` }}
                title="Accent Color"
              />
              {secondaryBrandId !== 'none' && (
                <div 
                  className="w-12 h-12 rounded border"
                  style={{ backgroundColor: `hsl(${brands.find(b => b.id === secondaryBrandId)?.accent_color})` }}
                  title="Secondary Brand Accent"
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandThemeSelector;