import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Target } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { EnhancedThemeIntelligenceService } from "@/services/EnhancedThemeIntelligenceService";
import { DataFilters } from "@/services/EnhancedThemeIntelligenceService";



export const PerformanceBenchmarksPanel = ({ brandId, filters, themeId }) => {
  const { data, isLoading, error } = useQuery({
    queryKey'performance-benchmarks', brandId, filters, themeId],
    queryFn: () => EnhancedThemeIntelligenceService.getPerformanceBenchmarks(brandId, filters, themeId),
    enabled(brandId),
    staleTime,
    refetchOnMount: 'always',
  });

  if (isLoading) {
    return (
      
        
        
          
          
          
        
      
    );
  }

  if (error) {
    return (
      
        
          Error loading benchmarks: {error instanceof Error ? error.message : 'Unknown error'}
        
      
    );
  }

  if (!benchmarks) {
    return (
      
        
          No performance data found for this combination of filters
        
      
    );
  }

  return (
    
      
        
        What Success Looks Like
        
          Based on {benchmarks.sampleSize} campaigns
        
      

      
        
          Open Rate
          {benchmarks.baseline.openRate.toFixed(1)}%
          Historical baseline
          {benchmarks.expected && (
            
              
              {benchmarks.expected.openRate.toFixed(1)}%
              with recommended theme
            
          )}
        

        
          Click Rate
          {benchmarks.baseline.clickRate.toFixed(1)}%
          Historical baseline
          {benchmarks.expected && (
            
              
              {benchmarks.expected.clickRate.toFixed(1)}%
              with recommended theme
            
          )}
        

        
          Conversion Rate
          {benchmarks.baseline.conversionRate.toFixed(1)}%
          Historical baseline
          {benchmarks.expected && (
            
              
              {benchmarks.expected.conversionRate.toFixed(1)}%
              with recommended theme
            
          )}
        
      

      {benchmarks.successCriteria && (
        
          
            
            Success Criteria for This Campaign
          
          
            {benchmarks.successCriteria}
          
        
      )}
    
  );
};

export default PerformanceBenchmarksPanel;
