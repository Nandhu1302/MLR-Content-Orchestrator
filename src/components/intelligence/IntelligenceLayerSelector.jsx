import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Lightbulb, Target, TrendingUp, Shield, Users, Sparkles } from 'lucide-react';

// Removed export type IntelligenceType = 'brand' | 'competitive' | 'market' | 'regulatory' | 'public';

// IntelligenceLayer interface is removed, using plain object structure
// interface IntelligenceLayer { ... }

// IntelligenceLayerSelectorProps interface is removed

const LAYER_CONFIG = {
  brand: {
    label: 'Brand Intelligence',
    description: 'Brand guidelines, voice, positioning, and identity',
    icon: <Lightbulb className="h-4 w-4" />,
    color: 'bg-blue-500'
  },
  competitive: {
    label: 'Competitive Intelligence',
    description: 'Competitor analysis, differentiators, market positioning',
    icon: <Target className="h-4 w-4" />,
    color: 'bg-orange-500'
  },
  market: {
    label: 'Market Intelligence',
    description: 'Market trends, opportunities, audience insights',
    icon: <TrendingUp className="h-4 w-4" />,
    color: 'bg-green-500'
  },
  regulatory: {
    label: 'Regulatory Intelligence',
    description: 'Compliance requirements, disclaimers, fair balance',
    icon: <Shield className="h-4 w-4" />,
    color: 'bg-red-500'
  },
  public: {
    label: 'Public Intelligence',
    description: 'Patient sentiment, trends, recent developments',
    icon: <Users className="h-4 w-4" />,
    color: 'bg-purple-500'
  }
};

export const IntelligenceLayerSelector = ({
  availableLayers,
  selectedLayers,
  onSelectionChange
}) => { // Removed : IntelligenceLayerSelectorProps
  // Removed <IntelligenceLayer[]> type annotation
  const [layers, setLayers] = useState([]);

  useEffect(() => {
    const enrichedLayers = availableLayers
      .filter(l => l.incorporated)
      .map(l => ({
        type: l.intelligence_type,
        incorporated: l.incorporated,
        ...LAYER_CONFIG[l.intelligence_type]
      }));
    setLayers(enrichedLayers);
  }, [availableLayers]);

  // Removed : IntelligenceType type annotation
  const handleToggle = (type) => {
    const newSelection = selectedLayers.includes(type)
      ? selectedLayers.filter(t => t !== type)
      : [...selectedLayers, type];
    onSelectionChange(newSelection);
  };

  const handleSelectAll = () => {
    onSelectionChange(layers.map(l => l.type));
  };

  const handleSelectNone = () => {
    onSelectionChange([]);
  };

  if (layers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Intelligence Layers
          </CardTitle>
          <CardDescription>
            No intelligence layers have been incorporated yet. Complete the enrichment process first.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Select Intelligence Layers
            </CardTitle>
            <CardDescription>
              Choose which intelligence layers to use for content generation
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={handleSelectAll}>
              Select All
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSelectNone}>
              Clear
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {layers.map((layer) => (
            <div
              key={layer.type}
              className="flex items-start space-x-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <Checkbox
                id={layer.type}
                checked={selectedLayers.includes(layer.type)}
                onCheckedChange={() => handleToggle(layer.type)}
                className="mt-1"
              />
              <div className="flex-1">
                <Label
                  htmlFor={layer.type}
                  className="flex items-center gap-2 cursor-pointer font-medium"
                >
                  <div className={`p-1.5 rounded ${layer.color} text-white`}>
                    {layer.icon}
                  </div>
                  {layer.label}
                  <Badge variant="secondary" className="ml-auto text-xs">
                    Incorporated
                  </Badge>
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {layer.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Selected layers:</span>
            <span className="font-semibold">
              {selectedLayers.length} of {layers.length}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};