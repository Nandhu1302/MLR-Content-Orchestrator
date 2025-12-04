import React from 'react';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
import { CulturalIntelligenceHandoffService } from '@/services/CulturalIntelligenceHandoffService';
import { useToast } from '@/hooks/use-toast';

export const CulturalIntelligenceHandoffButton = ({
  projectData,
  segmentAdaptations,
  overallCulturalScore,
  disabled = false
}) => {
  const { toast } = useToast();

  const handleGeneratePDF = () => {
    try {
      const pdf = CulturalIntelligenceHandoffService.generateAgencyPDF(
        projectData,
        segmentAdaptations,
        overallCulturalScore
      );
      
      const fileName = `Cultural-Intelligence-Playbook-${projectData.target_markets?.[0] || 'Market'}-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
      toast({
        title: 'PDF Generated',
        description: 'Cultural Intelligence Playbook downloaded successfully'
      });
    } catch (error) {
      console.error('PDF generation failed:', error);
      toast({
        title: 'Generation Failed',
        description: 'Failed to generate PDF. Please try again.',
        variant: 'destructive'
      });
    }
  };

  return (
    <Button 
      onClick={handleGeneratePDF}
      variant="outline"
      size="lg"
      className="w-full"
      disabled={disabled}
    >
      <FileDown className="mr-2 h-4 w-4" />
      Generate Agency Handoff PDF
    </Button>
  );
};