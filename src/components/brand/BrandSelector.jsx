import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, Building2, Star, Briefcase } from 'lucide-react';
import { BrandService } from '@/services/brandService';
import { useBrand } from '@/contexts/BrandContext';

const BrandSelector = ({ open, onOpenChange }) => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectingBrandId, setSelectingBrandId] = useState(null);
  const { selectBrand } = useBrand();

  // Group brands by company for organized display
  const groupedBrands = brands.reduce((acc, brand) => {
    if (!acc[brand.company]) {
      acc[brand.company] = [];
    }
    acc[brand.company].push(brand);
    return acc;
  }, {});

  // Get company logo/icon based on company name
  const getCompanyIcon = (company) => {
    switch (company) {
      case 'AstraZeneca':
      case 'Bayer':
      case 'Novartis':
      case 'Merck KGaA':
        return <Star className="h-4 w-4" />;
      default:
        return <Briefcase className="h-4 w-4" />;
    }
  };

  useEffect(() => {
    if (open) {
      loadBrands();
    }
  }, [open]);

  const loadBrands = async () => {
    setLoading(true);
    try {
      const brandList = await BrandService.getAllBrands();
      setBrands(brandList);
    } catch (error) {
      console.error('Error loading brands:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBrandSelect = async (brandId) => {
    setSelectingBrandId(brandId);
    try {
      await selectBrand(brandId);
      onOpenChange(false);
    } finally {
      setSelectingBrandId(null);
    }
  };

  const getThemePreview = (brand) => ({
    primary: `hsl(${brand.primary_color})`,
    secondary: `hsl(${brand.secondary_color})`,
    accent: `hsl(${brand.accent_color})`
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Select Brand Configuration
          </DialogTitle>
          <DialogDescription>
            Choose a brand to load its guidelines, regulatory requirements, and visual theme
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedBrands).map(([company, companyBrands]) => (
              <div key={company} className="space-y-4">
                {/* Company Header */}
                <div className="flex items-center gap-3">
                  {getCompanyIcon(company)}
                  <h3 className="text-lg font-semibold text-foreground">{company}</h3>
                  <div className="flex-1">
                    <Separator />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {companyBrands.length} brand{companyBrands.length !== 1 ? 's' : ''}
                  </Badge>
                </div>

                {/* Company Brands Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {companyBrands.map((brand) => {
                    const theme = getThemePreview(brand);
                    return (
                      <Card 
                        key={brand.id} 
                        className="cursor-pointer transition-all hover:shadow-lg hover:scale-105 border-2 hover:border-primary/20"
                        onClick={() => handleBrandSelect(brand.id)}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <CardTitle className="text-lg font-semibold">{brand.brand_name}</CardTitle>
                              <CardDescription className="text-sm font-medium" style={{ color: theme.primary }}>
                                {brand.company}
                              </CardDescription>
                            </div>
                            <Badge 
                              variant="outline" 
                              className="text-xs"
                              style={{ 
                                borderColor: theme.primary, 
                                color: theme.primary,
                                backgroundColor: `${theme.primary}10`
                              }}
                            >
                              {brand.therapeutic_area}
                            </Badge>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="pt-0">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full font-medium"
                            onClick={() => handleBrandSelect(brand.id)}
                            disabled={selectingBrandId === brand.id}
                          >
                            {selectingBrandId === brand.id ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                Loading...
                              </>
                            ) : (
                              'Select Brand'
                            )}
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {brands.length === 0 && !loading && (
          <div className="text-center py-8 text-muted-foreground">
            No brands configured yet
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BrandSelector;