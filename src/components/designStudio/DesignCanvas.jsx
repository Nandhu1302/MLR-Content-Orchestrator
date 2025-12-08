import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, AlertCircle, Palette, Type, Layout, Download,
  Save, Undo, Redo, Image as ImageIcon 
} from 'lucide-react';
// TypeScript type imports removed
// import type { DesignTemplate, ComplianceValidation } from '@/types/designStudio';
// import type { ContentAsset, ContentVariation } from '@/types/content';
// import type { BrandProfile } from '@/types/brand';

// Interface and type annotations removed
export const DesignCanvas = ({
  template,
  asset,
  variation,
  brand,
  onSave
}) => {
  const [compliance, setCompliance] = useState({
    colorCompliance: true,
    typographyCompliance: true,
    spacingCompliance: true,
    regulatoryCompliance: true,
    issues: []
  });

  const content = variation?.content_data || asset.primary_content;
  const canvasData = {
    template_id: template.id,
    content_mapping: content,
    timestamp: new Date().toISOString()
  };

  const handleSave = () => {
    onSave(canvasData, compliance);
  };

  return (
    <div className="grid grid-cols-[1fr_320px] gap-6">
      {/* Canvas Area */}
      <div className="space-y-4">
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">{template.template_name}</h3>
              <p className="text-sm text-muted-foreground">
                {template.base_layout.dimensions.width} × {template.base_layout.dimensions.height}px
              </p>
            </div>
            <Badge variant="outline">
              {template.template_category}
            </Badge>
          </div>

          {/* Canvas Preview */}
          <div 
            className="border rounded-lg bg-background overflow-hidden"
            style={{
              width: '100%',
              maxWidth: template.base_layout.dimensions.width,
              aspectRatio: `${template.base_layout.dimensions.width} / ${template.base_layout.dimensions.height}`
            }}
          >
            <div className="relative w-full h-full bg-white">
              {/* Render zones */}
              {template.base_layout.zones.map(zone => (
                <div
                  key={zone.id}
                  className="absolute border-2 border-dashed border-primary/30 bg-primary/5 p-2 overflow-hidden"
                  style={{
                    left: `${(zone.position.x / template.base_layout.dimensions.width) * 100}%`,
                    top: `${(zone.position.y / template.base_layout.dimensions.height) * 100}%`,
                    width: `${(zone.position.width / template.base_layout.dimensions.width) * 100}%`,
                    height: `${(zone.position.height / template.base_layout.dimensions.height) * 100}%`
                  }}
                >
                  <div className="text-xs font-medium text-primary mb-1">
                    {zone.name}
                  </div>
                  
                  {zone.type === 'image' ? (
                    <div className="flex items-center justify-center h-full bg-gray-100 rounded">
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                    </div>
                  ) : (
                    <div 
                      className="text-sm"
                      style={{
                        fontFamily: brand.font_family || 'Arial',
                        color: brand.primary_color || '#000000',
                        fontSize: zone.type === 'headline' ? '18px' : '12px'
                      }}
                    >
                      {content[zone.type] || `[${zone.type}]`}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Toolbar */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                <Undo className="w-4 h-4 mr-2" />
                Undo
              </Button>
              <Button variant="outline" size="sm" disabled>
                <Redo className="w-4 h-4 mr-2" />
                Redo
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button onClick={handleSave} size="sm">
                <Save className="w-4 h-4 mr-2" />
                Save Design
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Side Panel */}
      <div className="space-y-4">
        <Tabs defaultValue="compliance">
          <TabsList className="w-full">
            <TabsTrigger value="compliance" className="flex-1">
              <CheckCircle className="w-4 h-4 mr-1" />
              Compliance
            </TabsTrigger>
            <TabsTrigger value="brand" className="flex-1">
              <Palette className="w-4 h-4 mr-1" />
              Brand
            </TabsTrigger>
          </TabsList>

          <TabsContent value="compliance">
            <Card className="p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Compliance Check
              </h3>

              <div className="space-y-3">
                <ComplianceItem
                  label="Brand Colors"
                  passed={compliance.colorCompliance}
                />
                <ComplianceItem
                  label="Typography"
                  passed={compliance.typographyCompliance}
                />
                <ComplianceItem
                  label="Spacing Rules"
                  passed={compliance.spacingCompliance}
                />
                <ComplianceItem
                  label="Regulatory Zones"
                  passed={compliance.regulatoryCompliance}
                />
              </div>

              {compliance.issues.length > 0 && (
                <div className="mt-4 p-3 bg-destructive/10 rounded-md">
                  <p className="text-sm font-medium text-destructive mb-2">Issues:</p>
                  <ul className="text-xs text-destructive/80 space-y-1">
                    {compliance.issues.map((issue, i) => (
                      <li key={i}>• {issue}</li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="brand">
            <Card className="p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Brand Colors
              </h3>

              <div className="space-y-2">
                <ColorSwatch 
                  label="Primary" 
                  color={brand.primary_color || '#000000'} 
                />
                <ColorSwatch 
                  label="Secondary" 
                  color={brand.secondary_color || '#666666'} 
                />
                <ColorSwatch 
                  label="Accent" 
                  color={brand.accent_color || '#0066cc'} 
                />
              </div>

              <div className="mt-6">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Type className="w-4 h-4" />
                  Typography
                </h3>
                <p className="text-sm">
                  <span className="font-medium">Font:</span> {brand.font_family || 'Arial'}
                </p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Content Mapping Info */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Layout className="w-4 h-4" />
            Content Zones
          </h3>
          <div className="space-y-2">
            {template.base_layout.zones.map(zone => (
              <div key={zone.id} className="text-sm">
                <span className="font-medium">{zone.name}:</span>
                <span className="text-muted-foreground ml-2">
                  {zone.constraints.required ? 'Required' : 'Optional'}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

// Type annotations removed
const ComplianceItem = ({ label, passed }) => (
  <div className="flex items-center justify-between">
    <span className="text-sm">{label}</span>
    {passed ? (
      <CheckCircle className="w-4 h-4 text-green-600" />
    ) : (
      <AlertCircle className="w-4 h-4 text-destructive" />
    )}
  </div>
);

// Type annotations removed
const ColorSwatch = ({ label, color }) => (
  <div className="flex items-center gap-3">
    <div 
      className="w-10 h-10 rounded border-2 border-border"
      style={{ backgroundColor: color }}
    />
    <div>
      <p className="text-sm font-medium">{label}</p>
      <p className="text-xs text-muted-foreground">{color}</p>
    </div>
  </div>
);