import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  TrendingUp, 
  Target, 
  Users,
  Database,
  HelpCircle,
  CheckCircle2,
  Circle
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { IntelligenceDonutChart } from './IntelligenceDonutChart';





const CATEGORY_CONFIG, { 
  icon; 
  color; 
  chartColor;
  description;
}> = {
  evidence: {
    icon,
    color: 'text-blue-600',
    chartColor: '#2563eb',
    description: 'Clinical claims & references from approved sources'
  },
  audience: {
    icon,
    color: 'text-orange-600',
    chartColor: '#ea580c',
    description: 'Audience insights and preferences'
  },
  brand: {
    icon,
    color: 'text-pink-600',
    chartColor: '#db2777',
    description: 'Brand guidelines and messaging framework'
  },
  performance: {
    icon,
    color: 'text-green-600',
    chartColor: '#16a34a',
    description: 'Historical success patterns'
  },
  competitive: {
    icon,
    color: 'text-purple-600',
    chartColor: '#9333ea',
    description: 'Market positioning data'
  }
};

export const IntelligenceSummaryCard = ({ 
  categories, 
  qualityScore,
  showDonutChart = true,
  compact = false
}) => {
  const totalCount = categories.reduce((sum, cat) => sum + cat.count, 0);
  
  // Prepare chart data
  const chartData = categories
    .filter(cat => cat.count > 0)
    .map(cat => ({
      name.label,
      value.count,
      color.type]?.chartColor || '#9ca3af'
    }));

  // Separate categories with data from those without
  const categoriesWithData = categories.filter(cat => cat.count > 0);
  const categoriesWithoutData = categories.filter(cat => cat.count === 0);

  if (totalCount === 0) {
    return (
      
        
          No intelligence data used
        
      
    );
  }

  return (
    
      
        
          
            
            Intelligence Backing
          
          
            
              
                
                  
                
              
              
                
                  What does this mean?
                  Your content is backed by {totalCount} verified data points from your intelligence library. This ensures accuracy and compliance.
                  
                    {categoriesWithData.map(cat => (
                      
                        
                        {cat.label}: {cat.count}
                      
                    ))}
                  
                
              
            
          
        
      
      
      
        
          {/* Donut Chart */}
          {showDonutChart && (
            
              
            
          )}
          
          {/* Category List */}
          
            {/* Categories with data */}
            {categoriesWithData.map(cat => {
              const config = CATEGORY_CONFIG[cat.type];
              const Icon = config?.icon || Shield;
              
              return (
                
                  
                  
                  {cat.count}
                  {cat.label}
                
              );
            })}
            
            {/* Categories without data - show as muted */}
            {categoriesWithoutData.map(cat => {
              const config = CATEGORY_CONFIG[cat.type];
              const Icon = config?.icon || Shield;
              
              return (
                
                  
                  
                  No {cat.label.toLowerCase()}
                
              );
            })}
            
            {/* Quality Score */}
            {qualityScore !== undefined && (
              
                
                  Quality Score
                  = 80 ? "default"  >= 60 ? "secondary" : "outline"}
                    className="text-xs"
                  >
                    {qualityScore}%
                  
                
                
                  
                
              
            )}
          
        
      
    
  );
};

export default IntelligenceSummaryCard;
