
import { UnifiedIntelligence } from '@/services/intelligenceAggregationService';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle } from 'lucide-react';

export const BrandIntelligenceDetail = ({ intelligence }) => {
  const { brand } = intelligence;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Brand Profile */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm">Brand Profile</h3>
          {brand.profile ? (
            <CheckCircle2 className="w-4 h-4 text-green-600" />
          ) : (
            <XCircle className="w-4 h-4 text-red-600" />
          )}
        </div>
        {brand.profile ? (
          <div className="space-y-2 text-xs">
            <div>
              <span className="text-muted-foreground">Brand Name:</span>
              <p className="font-medium">{brand.profile.brand_name}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Therapeutic Area:</span>
              <p className="font-medium">{brand.profile.therapeutic_area}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Company:</span>
              <p className="font-medium">{brand.profile.company}</p>
            </div>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">No brand profile configured</p>
        )}
      </Card>

      {/* Brand Guidelines */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm">Brand Guidelines</h3>
          {brand.guidelines ? (
            <CheckCircle2 className="w-4 h-4 text-green-600" />
          ) : (
            <XCircle className="w-4 h-4 text-red-600" />
          )}
        </div>
        {brand.guidelines ? (
          <div className="space-y-2 text-xs">
            <div>
              <span className="text-muted-foreground">Tone of Voice:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {brand.guidelines.tone_of_voice && typeof brand.guidelines.tone_of_voice === 'object' ? (
                  Object.entries(brand.guidelines.tone_of_voice).map(([key, value]) => (
                    <Badge key={key} variant="secondary" className="text-[10px]">
                      {String(value)}
                    </Badge>
                  ))
                ) : (
                  <span className="text-muted-foreground">Not specified</span>
                )}
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">Visual Style:</span>
              <p className="font-medium mt-1">{brand.guidelines.imagery_style || 'Not specified'}</p>
            </div>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">No brand guidelines configured</p>
        )}
      </Card>

      {/* Brand Vision */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm">Brand Vision</h3>
          {brand.vision ? (
            <CheckCircle2 className="w-4 h-4 text-green-600" />
          ) : (
            <XCircle className="w-4 h-4 text-red-600" />
          )}
        </div>
        {brand.vision ? (
          <div className="space-y-2 text-xs">
            {brand.vision.mission_statement && (
              <div>
                <span className="text-muted-foreground">Mission:</span>
                <p className="font-medium mt-1">{brand.vision.mission_statement}</p>
              </div>
            )}
            {brand.vision.brand_promise && (
              <div>
                <span className="text-muted-foreground">Promise:</span>
                <p className="font-medium mt-1">{brand.vision.brand_promise}</p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">No brand vision configured</p>
        )}
      </Card>
    </div>
  );
};