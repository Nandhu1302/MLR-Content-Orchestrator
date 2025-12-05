import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  TrendingUp, 
  Target, 
  Users,
  Database,
  FileText,
  CheckCircle2,
  XCircle
} from 'lucide-react';





const LAYER_CONFIG, { icon; color; description }> = {
  evidence: {
    icon,
    color: 'text-blue-600',
    description: 'Clinical claims and references from PI documents'
  },
  performance: {
    icon,
    color: 'text-green-600',
    description: 'Historical performance data and success patterns'
  },
  competitive: {
    icon,
    color: 'text-purple-600',
    description: 'Competitive intelligence and market positioning'
  },
  audience: {
    icon,
    color: 'text-orange-600',
    description: 'Audience insights and preferences'
  },
  brand: {
    icon,
    color: 'text-pink-600',
    description: 'Brand guidelines and messaging framework'
  }
};

export const IntelligenceLayerBreakdown = ({ layers }) => {
  return (
    
      
        
          
          Intelligence Layer Breakdown
        
      
      
        {layers.map((layer) => {
          const config = LAYER_CONFIG[layer.type];
          const Icon = config.icon;
          const utilizationRate = layer.totalAvailable > 0 
            ? (layer.itemsUsed / layer.totalAvailable) * 100 
            ;
          const isUsed = layer.itemsUsed > 0;

          return (
            
              
                
                  
                  
                    {layer.label}
                    {config.description}
                  
                
                {isUsed ? (
                  
                ) : (
                  
                )}
              

              
                
                  
                    {layer.itemsUsed} of {layer.totalAvailable} used
                  
                  {utilizationRate > 0 && (
                    
                      {Math.round(utilizationRate)}% utilized
                    
                  )}
                

                {/* Show specific claims used */}
                {layer.specificClaims && layer.specificClaims.length > 0 && (
                  
                    {layer.specificClaims.map((claim, idx) => (
                      
                        Claim {idx + 1}/span>{' '}
                        {claim}
                      
                    ))}
                  
                )}
              
            
          );
        })}
      
    
  );
};

export default IntelligenceLayerBreakdown;
