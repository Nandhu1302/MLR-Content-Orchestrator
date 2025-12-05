import { Badge } from '@/components/ui/badge';
import { Brain, Zap, Shield, Users, Database, TrendingUp, Target } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';





const CATEGORY_ICONS, { icon; color; label }> = {
  evidence: { icon, color: 'text-blue-600', label: 'Claims' },
  audience: { icon, color: 'text-orange-600', label: 'Audience' },
  brand: { icon, color: 'text-pink-600', label: 'Brand' },
  performance: { icon, color: 'text-green-600', label: 'Performance' },
  competitive: { icon, color: 'text-purple-600', label: 'Competitive' },
};

export const IntelligenceSummaryBadge = ({ 
  totalReferences, 
  activeLayersCount,
  qualityScore,
  categoryBreakdown
}) => {
  if (totalReferences === 0) return null;

  // Build breakdown text for tooltip
  const breakdownItems = categoryBreakdown 
    ? Object.entries(categoryBreakdown)
        .filter(([_, count]) => count && count > 0)
        .map(([type, count]) => ({
          type,
          count,
          ...CATEGORY_ICONS[type]
        }))
    ;

  return (
    
      
        
          
            
            {totalReferences}
            data points
            {qualityScore && (
              <>
                •
                
                {qualityScore}%
              
            )}
          
        
        
          
            Intelligence-Backed Content
            
              Your content is backed by {totalReferences} verified data points
            
            
            {breakdownItems.length > 0 && (
              
                {breakdownItems.map(item => {
                  const Icon = item.icon;
                  return (
                    
                      
                      {item.count} {item.label}
                    
                  );
                })}
              
            )}
            
            {qualityScore && (
              Quality Score: {qualityScore}%
            )}
          
        
      
    
  );
};

export default IntelligenceSummaryBadge;
