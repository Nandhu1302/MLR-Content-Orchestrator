import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBrand } from '@/contexts/BrandContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const availableLanguages = [
  'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese',
  'Japanese', 'Chinese', 'Korean', 'Arabic', 'Russian', 'Dutch'
];

const availableMarkets = [
  'United States', 'Canada', 'United Kingdom', 'Germany', 'France',
  'Spain', 'Italy', 'Japan', 'China', 'Australia', 'Brazil', 'Mexico'
];

export default function GlocalProjectCreation() {
  const navigate = useNavigate();
  const { selectedBrand } = useBrand();
  const { toast } = useToast();

  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [therapeuticArea, setTherapeuticArea] = useState('');
  const [indication, setIndication] = useState('');
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [selectedMarkets, setSelectedMarkets] = useState([]);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateProject = async () => {
    if (!selectedBrand) {
      toast({
        title: 'Error',
        description: 'Please select a brand first',
        variant: 'destructive'
      });
      return;
    }

    if (!projectName || selectedLanguages.length === 0 || selectedMarkets.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    setIsCreating(true);

    try {
      // Create project
      const { data: project, error } = await supabase
        .from('glocal_adaptation_projects')
        .insert({
          brand_id: selectedBrand.id,
          project_name: projectName,
          project_description: description,
          source_content_type: 'email',
          source_content: {
            emailType: 'Disease Education',
            brandName: selectedBrand.brand_name,
            therapeuticArea,
            indication,
            contentSegments: [],
            metadata: {
              totalSegments: 0,
              highComplexityCount: 0,
              mediumComplexityCount: 0,
              lowComplexityCount: 0
            }
          },
          target_languages: selectedLanguages,
          target_markets: selectedMarkets,
          therapeutic_area: therapeuticArea,
          indication: indication,
          project_status: 'draft',
          cultural_intelligence_score: 0,
          regulatory_compliance_score: 0,
          tm_leverage_score: 0,
          overall_quality_score: 0,
          market_readiness_score: 0,
          project_metadata: {},
          workflow_state: {
            currentPhase: 'phase_1',
            phasesCompleted: [],
            totalPhases: 7,
            phaseData: {}
          }
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Project created successfully'
      });

      // Navigate to workspace
      navigate(`/glocalization/workspace/${project.id}`);
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: 'Error',
        description: 'Failed to create project',
        variant: 'destructive'
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/glocalization')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
          <h1 className="text-3xl font-bold">Create New Adaptation Project</h1>
          <p className="text-muted-foreground mt-2">
            Set up a new global-to-local content adaptation workflow
          </p>
        </div>

        <Card className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Basic Information</h2>
            
            <div className="space-y-2">
              <Label htmlFor="projectName">Project Name *</Label>
              <Input
                id="projectName"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="e.g., Q1 2025 Global Email Campaign"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the adaptation project..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="therapeuticArea">Therapeutic Area</Label>
                <Input
                  id="therapeuticArea"
                  value={therapeuticArea}
                  onChange={(e) => setTherapeuticArea(e.target.value)}
                  placeholder="e.g., Oncology"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="indication">Indication</Label>
                <Input
                  id="indication"
                  value={indication}
                  onChange={(e) => setIndication(e.target.value)}
                  placeholder="e.g., Non-Small Cell Lung Cancer"
                />
              </div>
            </div>
          </div>

          {/* Target Languages */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Target Languages *</h2>
            <div className="flex flex-wrap gap-2">
              {availableLanguages.map((lang) => {
                const isSelected = selectedLanguages.includes(lang);
                return (
                  <Badge
                    key={lang}
                    variant={isSelected ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => {
                      if (isSelected) {
                        setSelectedLanguages(selectedLanguages.filter(l => l !== lang));
                      } else {
                        setSelectedLanguages([...selectedLanguages, lang]);
                      }
                    }}
                  >
                    {lang}
                    {isSelected && <X className="ml-1 h-3 w-3" />}
                  </Badge>
                );
              })}
            </div>
            {selectedLanguages.length > 0 && (
              <p className="text-sm text-muted-foreground">
                Selected: {selectedLanguages.length} language{selectedLanguages.length > 1 ? 's' : ''}
              </p>
            )}
          </div>

          {/* Target Markets */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Target Markets *</h2>
            <div className="flex flex-wrap gap-2">
              {availableMarkets.map((market) => {
                const isSelected = selectedMarkets.includes(market);
                return (
                  <Badge
                    key={market}
                    variant={isSelected ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => {
                      if (isSelected) {
                        setSelectedMarkets(selectedMarkets.filter(m => m !== market));
                      } else {
                        setSelectedMarkets([...selectedMarkets, market]);
                      }
                    }}
                  >
                    {market}
                    {isSelected && <X className="ml-1 h-3 w-3" />}
                  </Badge>
                );
              })}
            </div>
            {selectedMarkets.length > 0 && (
              <p className="text-sm text-muted-foreground">
                Selected: {selectedMarkets.length} market{selectedMarkets.length > 1 ? 's' : ''}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => navigate('/glocalization')}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateProject}
              disabled={isCreating || !projectName || selectedLanguages.length === 0 || selectedMarkets.length === 0}
            >
              {isCreating ? (
                <>Creating...</>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Project
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}