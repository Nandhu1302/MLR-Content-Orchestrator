import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { X, Clock, TrendingUp, Calendar, FileText } from 'lucide-react';
// Type import removed
// import { IntakeTemplate } from '@/types/intake';

// Interface and type annotations removed
const TemplatePreviewModal = ({ 
  template, 
  onClose, 
  onSelect 
}) => {
  // Type annotation removed
  const getCustomizationColor = (level) => {
    switch (level) {
      case 'minimal': return 'bg-green-100 text-green-800 border-green-200';
      case 'moderate': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'advanced': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Type annotation removed
  const formatAssetType = (assetType) => {
    return assetType.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Calculate total hours
  const totalHours = template.assetBreakdown?.reduce((sum, asset) => sum + asset.estimatedHours, 0) || 0;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-background border rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="border-b p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-semibold text-foreground">{template.name}</h2>
                <Badge className={getCustomizationColor(template.customizationLevel)}>
                  {template.customizationLevel} customization
                </Badge>
                <Badge variant="outline" className="capitalize">
                  {template.category}
                </Badge>
              </div>
              <p className="text-muted-foreground text-lg">{template.description}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Key Metrics */}
          <div className="flex items-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{template.estimatedTime}</span>
            </div>
            <div className="flex items-center gap-2 text-green-600">
              <TrendingUp className="h-4 w-4" />
              <span>{template.successRate}% Success Rate</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{template.timelineWeeks} week timeline</span>
            </div>
            {totalHours > 0 && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <FileText className="h-4 w-4" />
                <span>{totalHours} total hours</span>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Asset Breakdown */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-foreground">Asset Breakdown</h3>
              <div className="space-y-3">
                {template.assetBreakdown?.map((asset, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-foreground">{asset.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {formatAssetType(asset.assetType)}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-foreground">
                          {asset.estimatedHours}h
                        </div>
                        <div className="text-xs text-muted-foreground">
                          estimated
                        </div>
                      </div>
                    </div>
                  </Card>
                )) || (
                  <Card className="p-4">
                    <div className="text-center text-muted-foreground">
                      <FileText className="h-8 w-8 mx-auto mb-2" />
                      <p>Asset details will be configured during setup</p>
                    </div>
                  </Card>
                )}
              </div>
            </div>

            {/* Timeline Visualization */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-foreground">Timeline Visualization</h3>
              <Card className="p-4">
                <div className="space-y-4">
                  {/* Timeline phases */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-foreground">Content Creation</span>
                          <span className="text-xs text-muted-foreground">Weeks 1-2</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2 mt-1">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '40%' }}></div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-foreground">Design & Review</span>
                          <span className="text-xs text-muted-foreground">Weeks 2-3</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2 mt-1">
                          <div className="bg-orange-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-foreground">MLR & Approval</span>
                          <span className="text-xs text-muted-foreground">Weeks 3-4</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2 mt-1">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-foreground">Launch & Deploy</span>
                          <span className="text-xs text-muted-foreground">Week {template.timelineWeeks}</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2 mt-1">
                          <div className="bg-purple-500 h-2 rounded-full" style={{ width: '5%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">{template.timelineWeeks}</div>
                    <div className="text-sm text-muted-foreground">Total Weeks</div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Template Tags */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3 text-foreground">Template Features</h3>
            <div className="flex flex-wrap gap-2">
              {template.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Choose your customization level to get started
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={() => onSelect(template, 'advanced')}
              >
                Advanced Settings
              </Button>
              <Button 
                variant="outline" 
                onClick={() => onSelect(template, 'moderate')}
              >
                Quick Customize
              </Button>
              <Button 
                className="bg-green-600 hover:bg-green-700"
                onClick={() => onSelect(template, 'minimal')}
              >
                Start with this template
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplatePreviewModal;