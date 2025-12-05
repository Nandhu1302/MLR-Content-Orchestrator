import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { DataFiltersComponent } from "@/components/data/DataFilters";
import { AudienceContextPanel } from "@/components/intelligence/AudienceContextPanel";
import { ContentInspirationPanel } from "@/components/intelligence/ContentInspirationPanel";
import { ContentSuccessPatternsWidget } from "@/components/intelligence/ContentSuccessPatternsWidget";
import { CompetitiveIntelligencePanel } from "@/components/intelligence/CompetitiveIntelligencePanel";
import { PerformanceBenchmarksPanel } from "@/components/intelligence/PerformanceBenchmarksPanel";
import { CampaignPerformanceTrends } from "@/components/intelligence/CampaignPerformanceTrends";
import { ContentOpportunityWidget } from "@/components/opportunities/ContentOpportunityWidget";
import { useBrand } from "@/contexts/BrandContext";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";

export const DataIntelligenceDashboard = () => {
  const navigate = useNavigate();
  const { selectedBrand } = useBrand();
  const [filters, setFilters] = useState({});
  
  const brandId = selectedBrand?.id || '';

  // Debug logging
  useEffect(() => {
    console.log('🎯 [Dashboard] Brand Context:', {
      selectedBrandId: selectedBrand?.id,
      selectedBrandName: selectedBrand?.brand_name,
      brandId,
      filters,
      hasBrandId: Boolean(brandId),
    });
  }, [selectedBrand, brandId, filters]);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <div>
          <h1 className="text-3xl font-bold">Content Creation Assistant</h1>
          <p className="text-muted-foreground mt-1">
            Everything you need to create high-performing content in one place
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            💡 This page has been consolidated into the new{" "}
            <button 
              onClick={() => navigate("/intelligence")}
              className="text-primary hover:underline font-medium"
            >
              Intelligence Hub
            </button>
          </p>
        </div>

        <DataFiltersComponent filters={filters} onFilterChange={setFilters} />

        {brandId ? (
          <ErrorBoundary>
            <ErrorBoundary>
              <ContentOpportunityWidget brandId={brandId} />
            </ErrorBoundary>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ErrorBoundary>
                <AudienceContextPanel brandId={brandId} filters={filters} />
              </ErrorBoundary>
              <ErrorBoundary>
                <ContentInspirationPanel brandId={brandId} filters={filters} />
              </ErrorBoundary>
            </div>

            <ErrorBoundary>
              <ContentSuccessPatternsWidget brandId={brandId} filters={filters} />
            </ErrorBoundary>

            <ErrorBoundary>
              <CompetitiveIntelligencePanel brandId={brandId} filters={filters} />
            </ErrorBoundary>

            <ErrorBoundary>
              <PerformanceBenchmarksPanel brandId={brandId} filters={filters} />
            </ErrorBoundary>
            <ErrorBoundary>
              <CampaignPerformanceTrends brandId={brandId} filters={filters} />
            </ErrorBoundary>
          </ErrorBoundary>
        ) : (
          <div className="p-6 text-center text-muted-foreground">
            No brand selected. Please select a brand to view insights.
          </div>
        )}
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </div>
  );
};

export default DataIntelligenceDashboard;