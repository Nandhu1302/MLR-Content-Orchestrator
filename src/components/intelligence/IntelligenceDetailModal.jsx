import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
// NOTE: Since the imported types/interfaces were removed, 
// UnifiedIntelligence is only used as a variable, not a type.
// If your actual application requires it for type-checking elsewhere, 
// you would keep the import but remove the interface. For this conversion, 
// we assume it is still necessary for the component logic.
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

// The interface definition is removed entirely
// interface IntelligenceDetailModalProps { ... }

export const IntelligenceDetailModal = ({
  open,
  onClose,
  intelligence,
  currentFormData,
  onApplyIntelligence,
}) => { // Removed : IntelligenceDetailModalProps type annotation
  const [selectedTab, setSelectedTab] = useState('brand');

  // Removed | null check. The check in the return is enough for JS.
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
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl">Intelligence Dashboard</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6 flex-1 overflow-hidden">
          {/* Context Banner */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold text-foreground">Brand:</span>
              <span className="text-foreground">{brandName}</span>
              <Badge variant="secondary" className="ml-1">{displayTherapeuticArea}</Badge>
            </div>
            {currentFormData && (currentFormData.selectedAssetTypes?.[0] || currentFormData.targetAudience) && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-medium">Campaign Context:</span>
                {currentFormData.selectedAssetTypes?.[0] && (
                  <Badge variant="outline">{currentFormData.selectedAssetTypes[0]}</Badge>
                )}
                {currentFormData.targetAudience && (
                  <Badge variant="outline">{currentFormData.targetAudience}</Badge>
                )}
              </div>
            )}
          </div>

          {/* Overall Readiness */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold">Overall Intelligence Readiness</h3>
                <p className="text-sm text-muted-foreground">{totalItems} total intelligence items available</p>
              </div>
              <Badge 
                variant={overallScore >= 80 ? "default" : overallScore >= 50 ? "secondary" : "destructive"}
                className="text-sm px-3 py-1"
              >
                {overallScore}%
              </Badge>
            </div>
            <Progress value={overallScore} className="h-3" />
          </div>

          {/* Category Tabs */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full flex-1 flex flex-col overflow-hidden">
            <TabsList className="flex w-full">
              <TabsTrigger value="brand" className="flex flex-col gap-1.5 h-auto py-3 px-4 flex-1 hover:bg-muted/50">
                <Building2 className="w-5 h-5" />
                <span className="text-sm font-medium">Brand</span>
                <span className="text-xs text-muted-foreground">{brandCount}/3</span>
              </TabsTrigger>
              <TabsTrigger value="evidence" className="flex flex-col gap-1.5 h-auto py-3 px-4 flex-1 hover:bg-muted/50">
                <FileText className="w-5 h-5" />
                <span className="text-sm font-medium">Evidence</span>
                <span className="text-xs text-muted-foreground">{evidenceCount} items</span>
              </TabsTrigger>
              <TabsTrigger value="performance" className="flex flex-col gap-1.5 h-auto py-3 px-4 flex-1 hover:bg-muted/50">
                <TrendingUp className="w-5 h-5" />
                <span className="text-sm font-medium">Performance</span>
                <span className="text-xs text-muted-foreground">{performanceCount} items</span>
              </TabsTrigger>
              <TabsTrigger value="competitive" className="flex flex-col gap-1.5 h-auto py-3 px-4 flex-1 hover:bg-muted/50">
                <Target className="w-5 h-5" />
                <span className="text-sm font-medium">Competitive</span>
                <span className="text-xs text-muted-foreground">{competitiveCount} items</span>
              </TabsTrigger>
              <TabsTrigger value="audience" className="flex flex-col gap-1.5 h-auto py-3 px-4 flex-1 hover:bg-muted/50">
                <Users className="w-5 h-5" />
                <span className="text-sm font-medium">Audience</span>
                <span className="text-xs text-muted-foreground">{audienceCount} segments</span>
              </TabsTrigger>
            </TabsList>

            <div className="mt-6 flex-1 overflow-y-auto px-1">
              <TabsContent value="brand" className="mt-0">
                <BrandIntelligenceDetail intelligence={intelligence} />
              </TabsContent>

              <TabsContent value="evidence" className="mt-0">
                <EvidenceLibraryDetail
                  intelligence={intelligence}
                  currentAssetType={currentFormData?.selectedAssetTypes?.[0]}
                  onApplyIntelligence={onApplyIntelligence}
                />
              </TabsContent>

              <TabsContent value="performance" className="mt-0">
                <PerformanceDataDetail
                  intelligence={intelligence}
                  onApplyIntelligence={onApplyIntelligence}
                />
              </TabsContent>

              <TabsContent value="competitive" className="mt-0">
                <CompetitiveIntelligenceDetail
                  intelligence={intelligence}
                  onApplyIntelligence={onApplyIntelligence}
                />
              </TabsContent>

              <TabsContent value="audience" className="mt-0">
                <AudienceInsightsDetail
                  intelligence={intelligence}
                  currentAudience={currentFormData?.targetAudience}
                  onApplyIntelligence={onApplyIntelligence}
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};