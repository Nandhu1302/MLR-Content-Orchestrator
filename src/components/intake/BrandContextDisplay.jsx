import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, Activity, Target, MapPin } from 'lucide-react';

// Interface and type annotations removed
export const BrandContextDisplay = ({
  brand,
  availableIndications = [],
  className = ""
}) => {
  // Type annotation removed
  const getTherapeuticAreaColor = (area) => {
    switch (area.toLowerCase()) {
      case 'oncology':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'cardiovascular':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'respiratory':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className={`border-l-4 border-l-primary ${className}`}>
      <CardContent className="p-4">
        <div className="flex flex-col space-y-3">
          {/* Brand Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Building2 className="h-5 w-5 text-primary" />
              <div>
                <h3 className="font-semibold text-lg">{brand.brand_name}</h3>
                <p className="text-sm text-muted-foreground">{brand.company}</p>
              </div>
            </div>
            <Badge 
              variant="outline" 
              className={getTherapeuticAreaColor(brand.therapeutic_area)}
            >
              <Activity className="h-3 w-3 mr-1" />
              {brand.therapeutic_area}
            </Badge>
          </div>

          {/* Available Indications */}
          {availableIndications.length > 0 && (
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Available Indications</span>
                <Badge variant="secondary" className="text-xs">
                  {availableIndications.length}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-1">
                {availableIndications.slice(0, 4).map((indication, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="text-xs bg-accent/50"
                  >
                    {indication}
                  </Badge>
                ))}
                {availableIndications.length > 4 && (
                  <Badge variant="outline" className="text-xs">
                    +{availableIndications.length - 4} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Context Note */}
          <div className="text-xs text-muted-foreground bg-accent/20 p-2 rounded">
            <MapPin className="h-3 w-3 inline mr-1" />
            Content and messaging will be automatically aligned with {brand.brand_name}'s {brand.therapeutic_area.toLowerCase()} focus
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BrandContextDisplay;