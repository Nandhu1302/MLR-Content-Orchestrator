import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, Users, Activity } from 'lucide-react';
import { DataFilters } from '@/components/data/DataFilters';
import { useQuery } from '@tanstack/react-query';
import { EnhancedThemeIntelligenceService } from '@/services/EnhancedThemeIntelligenceService';
import { Skeleton } from '@/components/ui/skeleton';



export const MarketPositionPanel = ({ brandId, filters }) => {
  const { data, isLoading } = useQuery({
    queryKey'market-position', brandId, filters],
    queryFn: () => EnhancedThemeIntelligenceService.getMarketPosition(brandId, filters),
    enabled: !!brandId,
  });

  if (isLoading) {
    return (
      
        
          
          
        
        
          
        
      
    );
  }

  if (!marketPosition) {
    return (
      
        
          Market Position
          No market data available
        
      
    );
  }

  const getTrendIcon = (trend) => {
    if (trend === 'growing') return ;
    if (trend === 'declining') return ;
    return ;
  };

  return (
    
      
        
          
          Market Position Intelligence
        
        
          IQVIA Rx, Market Share & Social Listening • {marketPosition.dataSources.length} sources
        
      
      
        {/* Market Share */}
        
          
            Market Share
            
              {marketPosition.currentMarketShare}%
              {getTrendIcon(marketPosition.marketShareTrend)}
            
          
          
            {marketPosition.dataSources.map((source) => (
              
                {source}
              
            ))}
          
        

        {/* Rx Growth */}
        
          
            Prescription Growth
            
              {marketPosition.rxGrowth}%
              {getTrendIcon(marketPosition.rxTrend)}
            
          
          
            
              Total Rx
              {marketPosition.totalRx.toLocaleString()}
            
            
              New Rx
              {marketPosition.newRx.toLocaleString()}
            
          
        

        {/* Regional Breakdown */}
        {marketPosition.regionalBreakdown.length > 0 && (
          
            Regional Performance
            
              {marketPosition.regionalBreakdown.map((region) => (
                
                  {region.region}
                  
                    
                      Total: {region.totalRx.toLocaleString()}
                    
                    
                      New: {region.newRx.toLocaleString()}
                    
                  
                
              ))}
            
          
        )}

        {/* Share of Voice */}
        
          
            Share of Voice (Social)
            {marketPosition.shareOfVoice}%
          
        

        {/* Data Quality */}
        
          
            Data Quality Score
             70 ? 'default' : 'secondary'}>
              {marketPosition.dataQuality}%
            
          
        
      
    
  );
};

export default MarketPositionPanel;
