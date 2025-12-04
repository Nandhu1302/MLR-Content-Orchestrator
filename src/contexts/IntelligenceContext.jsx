import React, { createContext, useContext, useEffect, useState } from 'react';
import { IntelligenceAggregationService } from '@/services/intelligenceAggregationService';
import { useToast } from '@/hooks/use-toast';

export const IntelligenceContext = createContext(undefined);

export const IntelligenceProvider = ({
  children,
  brandId,
  autoLoad = true,
}) => {
  const { toast } = useToast();
  const [intelligence, setIntelligence] = useState(null);
  const [intelligenceSummary, setIntelligenceSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadIntelligence = async () => {
    if (!brandId) return;

    setIsLoading(true);
    setError(null);

    try {
      const [data, summary] = await Promise.all([
        IntelligenceAggregationService.aggregateIntelligence(brandId),
        IntelligenceAggregationService.getIntelligenceSummary(brandId),
      ]);

      setIntelligence(data);
      setIntelligenceSummary(summary);

      // Show data readiness notification
      if (data.dataReadiness.overall < 50) {
        toast({
          title: 'Limited Intelligence Available',
          description: `Data readiness: ${data.dataReadiness.overall}%. Consider adding more intelligence data for better AI generation.`,
          variant: 'destructive',
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load intelligence';
      setError(errorMessage);
      toast({
        title: 'Intelligence Loading Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (autoLoad && brandId) {
      loadIntelligence();
    }
  }, [brandId, autoLoad]);

  const refresh = async () => {
    await loadIntelligence();
  };

  return (
    <IntelligenceContext.Provider
      value={{
        intelligence,
        isLoading,
        error,
        refresh,
        intelligenceSummary,
      }}
    >
      {children}
    </IntelligenceContext.Provider>
  );
};

export const useIntelligence = () => {
  const context = useContext(IntelligenceContext);
  if (context === undefined) {
    throw new Error('useIntelligence must be used within an IntelligenceProvider');
  }
  return context;
};