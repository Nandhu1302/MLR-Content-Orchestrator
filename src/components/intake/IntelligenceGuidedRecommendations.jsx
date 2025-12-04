
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, FileText, AlertCircle, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export const PIEvidencePreviewModal = ({ open, onOpenChange, alignment, piData, strengthScore }) => {
  if (!alignment || !piData) return null;

  const selectedSections = Array.isArray(alignment.selectedSections) ? alignment.selectedSections : [];

  const getStrengthColor = (score) => {
    if (score >= 80) return 'text-emerald-600 dark:text-emerald-400';
    if (score >= 60) return 'text-blue-600 dark:text-blue-400';
    if (score >= 40) return 'text-amber-600 dark:text-amber-400';
    return 'text-orange-600 dark:text-orange-400';
  };

  const getSectionContent = (sectionKey) => {
    const sectionMap = {
      indications: piData.indications_and_usage || '',
      dosage: piData.dosage_and_administration || '',
      contraindications: piData.contraindications || '',
      warnings: piData.warnings_and_precautions || '',
      adverse_reactions: piData.adverse_reactions || '',
      drug_interactions: piData.drug_interactions || '',
      use_in_specific_populations: piData.use_in_specific_populations || '',
      clinical_pharmacology: piData.clinical_pharmacology || '',
      clinical_studies: piData.clinical_studies || '',
      mechanism_of_action: piData.mechanism_of_action || '',
    };
    return sectionMap[sectionKey] || 'Content not available';
  };

  const getSectionTitle = (sectionKey) => {
    const titleMap = {
      indications: 'Indications and Usage',
      dosage: 'Dosage and Administration',
      contraindications: 'Contraindications',
      warnings: 'Warnings and Precautions',
      adverse_reactions: 'Adverse Reactions',
      drug_interactions: 'Drug Interactions',
      use_in_specific_populations: 'Use in Specific Populations',
      clinical_pharmacology: 'Clinical Pharmacology',
      clinical_studies: 'Clinical Studies',
      mechanism_of_action: 'Mechanism of Action',
    };
    return titleMap[sectionKey] || sectionKey;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            PI Evidence Preview
          </DialogTitle>
          <DialogDescription>
            Review the specific PI sections that will be used for content generation
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[calc(85vh-120px)] pr-4">
          <div className="space-y-6">
            {/* Alignment Overview */}
            <Card className="border-2 border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Clinical Alignment Overview
                  </span>
                  <Badge className={cn('font-semibold', getStrengthColor(strengthScore))}>
                    Score: {strengthScore}/100
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium mb-2">Usage Guidance:</p>
                  <p className="text-sm text-muted-foreground">{alignment.usageGuidance}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm font-medium mb-2">Selected Sections:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedSections.map((section, idx) => (
                      <Badge key={idx} variant="secondary">
                        <FileText className="h-3 w-3 mr-1" />
                        {getSectionTitle(section)}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Selection Reasoning */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Why These Sections Were Selected
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {alignment.reasoning.map((reason, idx) => (
                    <li key={idx} className="text-sm flex gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span className="text-muted-foreground">{reason}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Detailed Section Content */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Detailed PI Section Content
              </h3>
              {selectedSections.map((section, idx) => {
                const content = getSectionContent(section);
                return (
                  <Card key={idx} className="border-muted">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm text-primary">{getSectionTitle(section)}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xs text-muted-foreground whitespace-pre-wrap bg-muted/30 p-3 rounded-md max-h-60 overflow-y-auto">
                        {content || 'No content available for this section'}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Footer Note */}
            <div className="bg-muted/30 p-4 rounded-md">
              <p className="text-xs text-muted-foreground">
                <strong>Note:</strong> This preview shows the PI sections that will inform your content generation.
                The actual content will be strategically crafted based on your theme, objective, and audience while
                maintaining clinical accuracy from these sections.
              </p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
