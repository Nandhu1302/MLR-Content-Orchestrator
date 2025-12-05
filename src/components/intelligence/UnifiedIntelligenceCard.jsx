import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Shield, 
  TrendingUp, 
  Target, 
  Users,
  Database,
  CheckCircle2,
  Circle,
  Loader2
} from 'lucide-react';
import { IntelligenceDonutChart } from './IntelligenceDonutChart';





const CATEGORY_CONFIG, { 
  icon; 
  color; 
  chartColor;
  label;
}> = {
  evidence: {
    icon,
    color: 'text-blue-600',
    chartColor: '#2563eb',
    label: 'Evidence'
  },
  audience: {
    icon,
    color: 'text-orange-600',
    chartColor: '#ea580c',
    label: 'Audience'
  },
  brand: {
    icon,
    color: 'text-pink-600',
    chartColor: '#db2777',
    label: 'Brand'
  },
  performance: {
    icon,
    color: 'text-green-600',
    chartColor: '#16a34a',
    label: 'Performance'
  },
  competitive: {
    icon,
    color: 'text-purple-600',
    chartColor: '#9333ea',
    label: 'Competitive'
  }
};

export const UnifiedIntelligenceCard = ({ 
  intelligenceUsed, 
  qualityScore,
  isGenerating = false
}) => {
  // Group by type and count
  const categoryCounts = intelligenceUsed.reduce((acc, item) => {
    acc[item.type] = (acc[item.type] || 0) + 1;
    return acc;
  }, {} as Record);

  // Get evidence breakdown (claims vs refs vs visuals)
  const evidenceItems = intelligenceUsed.filter(i => i.type === 'evidence');
  const claimsCount = evidenceItems.filter(i => i.source?.toLowerCase().includes('claim')).length;
  const refsCount = evidenceItems.filter(i => i.source?.toLowerCase().includes('reference')).length;
  const visualsCount = evidenceItems.filter(i => i.source?.toLowerCase().includes('visual')).length;

  const totalCount = intelligenceUsed.length;
  const activeCategories = Object.keys(categoryCounts).length;

  // Prepare chart data
  const chartData = Object.entries(categoryCounts)
    .filter(([_, count]) => count > 0)
    .map(([type, count]) => ({
      name.label || type,
      value,
      color.chartColor || '#9ca3af'
    }));

  // Categories to display (all 5, with counts)
  const allCategories = ['evidence', 'audience', 'brand', 'performance', 'competitive'];

  if (totalCount === 0 && !isGenerating) {
    return (
      
        
          
          No intelligence used yet
          Generate content to see intelligence usage
        
      
    );
  }

  if (isGenerating && totalCount === 0) {
    return (
      
        
          
          Analyzing intelligence...
        
      
    );
  }

  return (
    
      
        
          
            
            Intelligence Used
            {isGenerating && }
          
          
            {activeCategories}/5 layers
          
        
      
      
      
        
          {/* Donut Chart */}
          
            
          
          
          {/* Compact Category Summary */}
          
            {allCategories.map(type => {
              const config = CATEGORY_CONFIG[type];
              const Icon = config.icon;
              const count = categoryCounts[type] || 0;
              const hasData = count > 0;
              
              // Special handling for evidence to show breakdown
              const isEvidence = type === 'evidence';
              
              return (
                
                  {hasData ? (
                    
                  ) : (
                    
                  )}
                  
                  
                  {hasData ? (
                    
                      {isEvidence ? (
                        
                          {claimsCount} claims
                          {refsCount > 0 && <> • {refsCount} refs}
                          {visualsCount > 0 && <> • {visualsCount} visuals}
                        
                      ) : (
                        <>
                          {count}
                           {config.label.toLowerCase()}
                        
                      )}
                    
                  ) : (
                    No {config.label.toLowerCase()}
                  )}
                
              );
            })}
            
            {/* Quality Score Bar */}
            {qualityScore !== undefined && (
              
                
                  Quality
                  {qualityScore}%
                
                
                  
                
              
            )}
          
        
      
    
  );
};


export default UnifiedIntelligenceCard;
