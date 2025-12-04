import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useDataVisualization = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [configuration, setConfiguration] = useState(null);
  const { toast } = useToast();

  const generateVisualization = async (request) => {
    setIsGenerating(true);
    setConfiguration(null);

    try {
      const { data, error } = await supabase.functions.invoke('generate-data-visualization', {
        body: request
      });

      if (error) {
        throw error;
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate visualization');
      }

      setConfiguration(data.configuration);
      
      toast({
        title: 'Visualization Generated',
        description: 'Your chart has been created successfully.',
      });

      return data.configuration;
    } catch (error) {
      console.error('Error generating visualization:', error);
      
      let errorMessage = 'Failed to generate visualization. Please try again.';
      
      if (error?.message?.includes('Rate limit')) {
        errorMessage = 'Rate limit exceeded. Please try again in a moment.';
      } else if (error?.message?.includes('Payment required')) {
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

export default useDataVisualization;
