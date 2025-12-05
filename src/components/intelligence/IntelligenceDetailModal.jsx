import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { UnifiedIntelligence } from '@/services/intelligenceAggregationService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BrandIntelligenceDetail } from './details/BrandIntelligenceDetail';
import { EvidenceLibraryDetail } from './details/EvidenceLibraryDetail';
import { PerformanceDataDetail } from './details/PerformanceDataDetail';
import { CompetitiveIntelligenceDetail } from './details/CompetitiveIntelligenceDetail';
import { AudienceInsightsDetail } from './details/AudienceInsightsDetail';
import { Building2, FileText, TrendingUp, Target, Users } from 'lucide-react';



export const IntelligenceDetailModal = ({
  open,
  onClose,
  intelligence,
  currentFormData,
  onApplyIntelligence,
}) => {
  const [selectedTab, setSelectedTab] = useState('brand');

  if (!intelligence) return null;

  const { dataReadiness, brand, evidence, performance, competitive, audience } = intelligence;

  // Calculate overall score
  const overallScore = Math.round(
    (dataReadiness.brand + dataReadiness.evidence + dataReadiness.performance + 
     dataReadiness.competitive + dataReadiness.audience) / 5
  );

  // Calculate counts
  const brandCount = [brand.profile, brand.guidelines, brand.vision].filter(Boolean).length;
  const evidenceCount = (evidence.claims?.length || 0) + (evidence.references?.length || 0);
  const performanceCount = (performance.successPatterns?.length || 0) + (performance.campaignAnalytics?.length || 0);
  const competitiveCount = (competitive.competitors?.length || 0) + (competitive.landscape?.length || 0);
  const audienceCount = audience.segments?.length || 0;

  const totalItems = brandCount + evidenceCount + performanceCount + competitiveCount + audienceCount;

  // Get brand display info from intelligence data (always correct)
  const brandName = brand.profile?.brand_name || 'Unknown Brand';
  const therapeuticArea = brand.profile?.therapeutic_area || 'Not specified';
  const displayTherapeuticArea = therapeuticArea.replace(/-/g, '/').toUpperCase();

  return (
    
      
        
          Intelligence Dashboard
        

        
          {/* Context Banner */}
          
            
              Brand/span>
              {brandName}
              {displayTherapeuticArea}
            
            {currentFormData && (currentFormData.selectedAssetTypes?.[0] || currentFormData.targetAudience) && (
              
                Campaign Context/span>
                {currentFormData.selectedAssetTypes?.[0] && (
                  {currentFormData.selectedAssetTypes[0]}
                )}
                {currentFormData.targetAudience && (
                  {currentFormData.targetAudience}
                )}
              
            )}
          

          {/* Overall Readiness */}
          
            
              
                Overall Intelligence Readiness
                {totalItems} total intelligence items available
              
              = 80 ? "default"  >= 50 ? "secondary" : "destructive"}
                className="text-sm px-3 py-1"
              >
                {overallScore}%
              
            
            
          

          {/* Category Tabs */}
          
            
              
                
                Brand
                {brandCount}/3
              
              
                
                Evidence
                {evidenceCount} items
              
              
                
                Performance
                {performanceCount} items
              
              
                
                Competitive
                {competitiveCount} items
              
              
                
                Audience
                {audienceCount} segments
              
            

            
              
                
              

              
                
              

              
                
              

              
                
              

              
                
              
            
          
        
      
    
  );
};


export default IntelligenceDetailModal;
