import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Brain, 
  Database, 
  TrendingUp, 
  Target, 
  Users,
  Shield,
  CheckCircle2,
  Loader2
} from 'lucide-react';





const INTELLIGENCE_ICONS, any> = {
  evidence,
  performance,
  competitive,
  audience,
  brand
};

const INTELLIGENCE_COLORS, string> = {
  evidence: 'text-blue-600',
  performance: 'text-green-600',
  competitive: 'text-purple-600',
  audience: 'text-orange-600',
  brand: 'text-pink-600'
};

const INTELLIGENCE_BG_COLORS, string> = {
  evidence: 'bg-blue-50',
  performance: 'bg-green-50',
  competitive: 'bg-purple-50',
  audience: 'bg-orange-50',
  brand: 'bg-pink-50'
};

const INTELLIGENCE_LABELS, string> = {
  evidence: 'Evidence',
  performance: 'Performance',
  competitive: 'Competitive',
  audience: 'Audience',
  brand: 'Brand'
};

export const RealTimeIntelligenceTracker = ({ 
  intelligenceUsed, 
  isGenerating,
  totalLayers = 5 
}) => {
  
  // Group intelligence by type
  const groupedIntelligence = intelligenceUsed.reduce((acc, item) => {
    if (!acc[item.type]) {
      acc[item.type] = [];
    }
    acc[item.type].push(item);
    return acc;
  }, {} as Record);

  // Further break down evidence by source type for clearer display
  const getEvidenceBreakdown = (items) => {
    const claims = items.filter(i => i.source?.toLowerCase().includes('claim'));
    const references = items.filter(i => i.source?.toLowerCase().includes('reference'));
    const visuals = items.filter(i => i.source?.toLowerCase().includes('visual'));
    const other = items.filter(i => 
      !i.source?.toLowerCase().includes('claim') && 
      !i.source?.toLowerCase().includes('reference') && 
      !i.source?.toLowerCase().includes('visual')
    );
    return { claims, references, visuals, other };
  };

  const activeLayers = Object.keys(groupedIntelligence).length;
  const layerProgress = (activeLayers / totalLayers) * 100;

  return (
    
      
        
          
            
            Intelligence Usage
            {isGenerating && (
              
            )}
          
          
            {activeLayers} / {totalLayers} Layers Active
          
        
        
        {/* Overall Progress */}
        
          
            Intelligence Coverage
            {Math.round(layerProgress)}%
          
          
        
      

      
        {/* Intelligence Layers */}
        {Object.entries(groupedIntelligence).map(([type, items]) => {
          const Icon = INTELLIGENCE_ICONS[type];
          const color = INTELLIGENCE_COLORS[type];
          const bgColor = INTELLIGENCE_BG_COLORS[type];
          const label = INTELLIGENCE_LABELS[type];
          
          // For evidence type, show breakdown
          const isEvidence = type === 'evidence';
          const breakdown = isEvidence ? getEvidenceBreakdown(items) ;
          
          return (
            
              
                
                  
                  {label}
                  {isEvidence && breakdown ? (
                    
                      {breakdown.claims.length > 0 && (
                        
                          {breakdown.claims.length} claims
                        
                      )}
                      {breakdown.references.length > 0 && (
                        
                          {breakdown.references.length} refs
                        
                      )}
                      {breakdown.visuals.length > 0 && (
                        
                          {breakdown.visuals.length} visuals
                        
                      )}
                      {breakdown.other.length > 0 && (
                        
                          {breakdown.other.length} other
                        
                      )}
                    
                  ) : (
                    
                      {items.length} {items.length === 1 ? 'item' : 'items'}
                    
                  )}
                
                
              
              
              {/* Items used from this layer - show max 5 to reduce clutter */}
              
                {items.slice(0, 5).map((item, idx) => (
                  
                    
                      
                        
                          {item.source}
                        
                        
                          {item.content}
                        
                      
                      
                        {Math.round(item.confidence * 100)}%
                      
                    
                  
                ))}
                {items.length > 5 && (
                  
                    +{items.length - 5} more items
                  
                )}
              
            
          );
        })}

        {/* Empty state when generating */}
        {intelligenceUsed.length === 0 && isGenerating && (
          
            
            Analyzing available intelligence...
          
        )}

        {/* Empty state when not generating */}
        {intelligenceUsed.length === 0 && !isGenerating && (
          
            
            No intelligence used yet
            Generate content to see intelligence usage
          
        )}

        {/* Summary */}
        {intelligenceUsed.length > 0 && (
          <>
            
            
              Total Intelligence References
              {intelligenceUsed.length}
            
          
        )}
      
    
  );
};


export default RealTimeIntelligenceTracker;
