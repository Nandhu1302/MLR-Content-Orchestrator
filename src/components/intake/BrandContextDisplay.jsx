
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, Activity, Target, MapPin } from 'lucide-react';

export const BrandContextDisplay = ({ brand, availableIndications = [], className = "" }) => {
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
    <Card className={className}>
      <CardContent className="space-y-4">
        {/* Brand Header */}
        <div className="space-y-2">
          <h4 className="text-xl font-semibold">{brand.brand_name}</h4>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Building2 className="h-4 w-4" />
            <span>{brand.company}</span>
          </div>
          <div className={`inline-flex items-center px-2 py-1 rounded border ${getTherapeuticAreaColor(brand.therapeutic_area)}`}>
            <Activity className="h-4 w-4 mr-1" />
            {brand.therapeutic_area}
          </div>
        </div>

        {/* Available Indications */}
        {availableIndications.length > 0 && (
          <div className="space-y-2">
            <h5 className="text-sm font-medium">Available Indications ({availableIndications.length})</h5>
            <div className="flex flex-wrap gap-2">
              {availableIndications.slice(0, 4).map((indication, index) => (
                <Badge key={index} variant="secondary">{indication}</Badge>
              ))}
              {availableIndications.length > 4 && (
                <span className="text-xs text-muted-foreground">
                  +{availableIndications.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Context Note */}
        <div className="text-sm text-muted-foreground">
          Content and messaging will be automatically aligned with <strong>{brand.brand_name}</strong>'s {brand.therapeutic_area.toLowerCase()} focus
        </div>
      </CardContent>
    </Card>
  );
};

export default BrandContextDisplay;
