import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { useContext } from 'react';
import { IntelligenceContext } from '@/contexts/IntelligenceContext';

export const IntelligenceReadinessCheck = () => {
  const context = useContext(IntelligenceContext);
  
  // If not wrapped in provider, don't render anything
  if (!context) {
    return null;
  }
  
  const { intelligence, isLoading } = context;

  if (isLoading) {
    return (
      
        
          Intelligence Readiness
          Checking available intelligence...
        
        
          
        
      
    );
  }

  if (!intelligence) {
    return null;
  }

  const { dataReadiness } = intelligence;
  const getReadinessColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getReadinessIcon = (score) => {
    if (score >= 80) return ;
    if (score >= 50) return ;
    return ;
  };

  const getReadinessLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 50) return 'Good';
    return 'Limited';
  };

  return (
    
      
        
          Intelligence Readiness
          {getReadinessIcon(dataReadiness.overall)}
        
        
          Your AI will use this intelligence to generate better content
        
      
      
        
          
            Overall Readiness
            = 80 ? 'default' .overall >= 50 ? 'secondary' : 'destructive'}>
              {getReadinessLabel(dataReadiness.overall)} - {dataReadiness.overall}%
            
          
          
        

        
          
          
          
          
          
        

        {dataReadiness.overall 
            
              Tip/strong> Add more intelligence data to improve AI generation quality.
              {dataReadiness.evidence 
          
        )}
      
    
  );
};



const ReadinessItem = ({ label, score, description }) => {
  const getColor = (score) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    
      
        
          
          {label}
        
        {score}%
      
      {description}
    
  );
};

export default IntelligenceReadinessCheck;
