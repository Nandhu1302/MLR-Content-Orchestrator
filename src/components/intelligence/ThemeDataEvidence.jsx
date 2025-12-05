import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, TrendingUp, Users, Database } from "lucide-react";

interface ThemeDataEvidenceProps {
  theme: any;
  supportingData?: {
    similarCampaigns?: number;
    expectedEngagement?: number;
    baselineEngagement?: number;
    provenPattern?: string;
    confidenceScore?: number;
    audienceSize?: number;
    marketShare?: number;
  };
}

export const ThemeDataEvidence = ({ theme, supportingData }: ThemeDataEvidenceProps) => {
  if (!supportingData) return null;

  const performanceLift = supportingData.expectedEngagement && supportingData.baselineEngagement
    ? ((supportingData.expectedEngagement - supportingData.baselineEngagement) / supportingData.baselineEngagement * 100).toFixed(1)
    : null;

  return (
    
      
        
        Data-Driven Evidence
      

      
        {supportingData.similarCampaigns && (
          
            
            
              Based on {supportingData.similarCampaigns} campaigns
            
          
        )}

        {performanceLift && (
          
            
            
              +{performanceLift}% vs baseline
            
          
        )}

        {supportingData.audienceSize && (
          
            
            
              {(supportingData.audienceSize / 1000).toFixed(0)}K HCPs in segment
            
          
        )}

        {supportingData.confidenceScore && (
          
            
              {supportingData.confidenceScore}% Confidence
            
          
        )}
      

      {supportingData.provenPattern && (
        
          Proven Pattern: {supportingData.provenPattern}
        
      )}
    
  );
};

export default ThemeDataEvidence;
