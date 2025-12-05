import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Lightbulb, Target, TrendingUp, Shield, Users, Sparkles } from 'lucide-react';





>;
  selectedLayers;
  onSelectionChange: (selected) => void;
}

const LAYER_CONFIG, Omit> = {
  brand: {
    label: 'Brand Intelligence',
    description: 'Brand guidelines, voice, positioning, and identity',
    icon className="h-4 w-4" />,
    color: 'bg-blue-500'
  },
  competitive: {
    label: 'Competitive Intelligence',
    description: 'Competitor analysis, differentiators, market positioning',
    icon className="h-4 w-4" />,
    color: 'bg-orange-500'
  },
  market: {
    label: 'Market Intelligence',
    description: 'Market trends, opportunities, audience insights',
    icon className="h-4 w-4" />,
    color: 'bg-green-500'
  },
  regulatory: {
    label: 'Regulatory Intelligence',
    description: 'Compliance requirements, disclaimers, fair balance',
    icon className="h-4 w-4" />,
    color: 'bg-red-500'
  },
  public: {
    label: 'Public Intelligence',
    description: 'Patient sentiment, trends, recent developments',
    icon className="h-4 w-4" />,
    color: 'bg-purple-500'
  }
};

export const IntelligenceLayerSelector = ({
  availableLayers,
  selectedLayers,
  onSelectionChange
}) => {
  const [layers, setLayers] = useState([]);

  useEffect(() => {
    const enrichedLayers = availableLayers
      .filter(l => l.incorporated)
      .map(l => ({
        type.intelligence_type,
        incorporated.incorporated,
        ...LAYER_CONFIG[l.intelligence_type]
      }));
    setLayers(enrichedLayers);
  }, [availableLayers]);

  const handleToggle = (type) => {
    const newSelection = selectedLayers.includes(type)
      ? selectedLayers.filter(t => t !== type)
      ...selectedLayers, type];
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
      
        
          
            
            Intelligence Layers
          
          
            No intelligence layers have been incorporated yet. Complete the enrichment process first.
          
        
      
    );
  }

  return (
    
      
        
          
            
              
              Select Intelligence Layers
            
            
              Choose which intelligence layers to use for content generation
            
          
          
            
              Select All
            
            
              Clear
            
          
        
      
      
        
          {layers.map((layer) => (
            
               handleToggle(layer.type)}
                className="mt-1"
              />
              
                
                  
                    {layer.icon}
                  
                  {layer.label}
                  
                    Incorporated
                  
                
                
                  {layer.description}
                
              
            
          ))}
        
        
        
          
            Selected layers/span>
            
              {selectedLayers.length} of {layers.length}
            
          
        
      
    
  );
};

export default IntelligenceLayerSelector;
