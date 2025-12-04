import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSourceAssetSelection } from '@/hooks/useSourceAssetSelection';
import { AssetDiscoveryDashboard } from '@/components/glocal/AssetDiscoveryDashboard';
import { MarketChannelConfigurator } from '@/components/glocal/MarketChannelConfigurator';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useBrand } from '@/contexts/BrandContext';

export const ImportContentInterface = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { selectedBrand } = useBrand();
  const [currentStep, setCurrentStep] = useState('discovery');
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  
  const {
    contentStudioAssets,
    preMLRAssets,
    designStudioAssets,
    loading,
  } = useSourceAssetSelection();
  
  const handleAssetSelect = (asset) => {
    setSelectedAsset(asset);
    setCurrentStep('configuration');
  };
  
  const handleBack = () => {
    if (currentStep === 'configuration') {
      setCurrentStep('discovery');
      setSelectedAsset(null);
    } else {
      navigate('/glocalization');
    }
  };
  
  const handleProjectCreate = async (config) => {
    if (!selectedAsset || !selectedBrand) return;
    
    setIsCreating(true);
    
    try {
      // Extract therapeutic area and indication from strategic context
      const therapeuticArea = config.strategicContext?.intakeContext?.therapeuticArea || 
                              config.strategicContext?.themeContext?.therapeuticFocus ||
                              selectedBrand.therapeutic_area;
      const indication = config.strategicContext?.assetContext?.indication || '';

      // Fetch structured content if this is a content_project
      let structuredContent = null;
      if (selectedAsset.type === 'content_project') {
        const { data: assets } = await supabase
          .from('content_assets')
          .select('id, asset_name, asset_type, primary_content')
          .eq('project_id', selectedAsset.id)
          .limit(10);
        
        if (assets && assets.length > 0) {
          structuredContent = assets.map(asset => ({
            id: asset.id,
            name: asset.asset_name,
            type: asset.asset_type,
            content: asset.primary_content
          }));
        }
      }

      // Create the GLOCAL adaptation project with correct schema
      const { data: project, error } = await supabase
        .from('glocal_adaptation_projects')
        .insert({
          brand_id: selectedBrand.id,
          project_name: config.projectName,
          project_description: config.projectDescription,
          target_markets: config.targetMarkets,
          target_languages: config.targetLanguages,
          project_status: 'draft',
          source_content_type: selectedAsset.type,
          therapeutic_area: therapeuticArea,
          indication: indication,
          // Store strategic context and channel specs in project_metadata
          project_metadata: {
            strategic_context: config.strategicContext,
            channel_specifications: {
              primary_channel: config.primaryChannel,
              platform_channels: config.platformChannels,
            },
            source_asset_info: {
              asset_id: selectedAsset.id,
              source_module: selectedAsset.source_module,
            },
          },
          // Store source content with all asset details including structured content
          source_content: {
            asset_name: selectedAsset.name,
            asset_type: selectedAsset.type,
            content: selectedAsset.content,
            intake_context: selectedAsset.metadata?.intake_context,
            metadata: selectedAsset.metadata,
            theme_data: selectedAsset.metadata?.theme,
            structured_content: structuredContent,
          },
          // Initialize workflow state
          workflow_state: {
            current_phase: 'asset_context',
            completed_phases: [],
            phase_data: {},
          },
        })
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: 'Project Created',
        description: `${config.projectName} has been created successfully.`,
      });
      
      // Navigate to the workspace with correct path
      navigate(`/glocalization/workspace/${project.id}`);
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: 'Error',
        description: 'Failed to create project. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  };
  
  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Upload className="h-8 w-8" />
              Import Content for Adaptation
            </h1>
            <p className="text-muted-foreground mt-1">
              {currentStep === 'discovery' 
                ? 'Select an approved asset from your content modules'
                : 'Configure target markets, languages, and channels'
              }
            </p>
          </div>
        </div>
      </div>
      
      {/* Step Content */}
      {currentStep === 'discovery' && (
        <AssetDiscoveryDashboard
          contentStudioAssets={contentStudioAssets}
          preMLRAssets={preMLRAssets}
          designStudioAssets={designStudioAssets}
          loading={loading}
          onAssetSelect={handleAssetSelect}
        />
      )}
      
      {currentStep === 'configuration' && selectedAsset && (
        <MarketChannelConfigurator
          selectedAsset={selectedAsset}
          onComplete={handleProjectCreate}
          onBack={handleBack}
        />
      )}
    </div>
  );
};