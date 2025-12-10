
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// JS version of useDataVisualization (types removed, same context/logic)
export const useDataVisualization = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [configuration, setConfiguration] = useState(null);
  const { toast } = useToast();

  const generateVisualization = async (request) => {
    setIsGenerating(true);
    setConfiguration(null);

    try {
      const { data, error } = await supabase.functions.invoke('generate-data-visualization', {
        body: request,
      });

      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || 'Failed to generate visualization');

      // Transform the response into the expected configuration format
      const config = {
        chartConfig: {
          type: request.visualizationType,
          data: request.data,
          colors: [],
          xAxis: { dataKey: '', label: '' },
          yAxis: { label: '' },
          series: [],
        },
        insights: data.insights || { summary: '', keyFindings: [], recommendations: [], disclaimers: [] },
        accessibility: data.accessibility || { altText: '', colorBlindSafe: false, contrastRatio: '' },
      };

      // Store the SVG markup directly in chartConfig for easy rendering
      config.chartConfig.svgMarkup = data.svgMarkup;

      setConfiguration(config);

      toast({
        title: 'Visualization Generated',
        description: 'Your chart has been created successfully.',
      });

      return config;
    } catch (error) {
      console.error('Error generating visualization:', error);

      let errorMessage = 'Failed to generate visualization. Please try again.';
      const msg = typeof error?.message === 'string' ? error.message : '';
      if (msg.includes('Rate limit')) {
        errorMessage = 'Rate limit exceeded. Please try again in a moment.';
      } else if (msg.includes('Payment required')) {
        errorMessage = 'Payment required. Please add credits to your workspace.';
      }

      toast({
        title: 'Generation Failed',
        description: errorMessage,
        variant: 'destructive',
      });

      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateVisualization,
    isGenerating,
    configuration,
  };
};
