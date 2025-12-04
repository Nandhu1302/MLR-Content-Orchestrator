import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Upload, FileText, Palette, Stethoscope, Check, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useContentManagement } from '@/hooks/useContentManagement';
import { useBrand } from '@/contexts/BrandContext';
import { useLocalizationManagement } from '@/hooks/useLocalizationManagement';
import { useSourceAssetSelection } from '@/hooks/useSourceAssetSelection';

const languages = [
  { code: 'zh', name: 'Chinese', region: 'Asia' },
  { code: 'ja', name: 'Japanese', region: 'Asia' }
];

const markets = [
  { name: 'China', region: 'Asia', regulatory: ['NMPA'], priority: 'high' },
  { name: 'Japan', region: 'Asia', regulatory: ['PMDA'], priority: 'high' }
];

export const CreateProjectModal = ({
  children,
  onProjectCreated
}) => {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [projectData, setProjectData] = useState({
    project_name: '',
    description: '',
    source_content_type: 'content_studio',
    target_languages: [],
    target_markets: [],
    priority_level: 'medium',
    cultural_sensitivity_level: 'medium',
    regulatory_complexity: 'standard'
  });
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [selectedMarkets, setSelectedMarkets] = useState([]);
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();
  const { projects } = useContentManagement();
  const { selectedBrand } = useBrand();
  const { createLocalizationProject, loading: localizationLoading, refreshData } = useLocalizationManagement({ autoLoad: false });
  const {
    contentStudioAssets,
    preMLRAssets, 
    designStudioAssets,
    selectedAsset,
    assetBasedProjectData,
    loading: assetsLoading,
    selectAsset,
    updateProjectData,
    clearSelection,
    getAssetsBySource
  } = useSourceAssetSelection();

  const handleCreateProject = async () => {
    if (!selectedBrand) {
      toast({
        title: "Error",
        description: "Please select a brand first",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Format the project data properly
      const formattedData = {
        project_name: projectData.project_name,
        description: projectData.description,
        source_content_type: projectData.source_content_type,
        source_content_id: projectData.source_content_id,
        target_languages: selectedLanguages,
        target_markets: selectedMarkets.map(marketName => {
          const market = markets.find(m => m.name === marketName);
          return {
            market: marketName,
            market_name: marketName,
            regulatory_requirements: market?.regulatory || [],
            cultural_considerations: [`Cultural localization for ${market?.region || 'Unknown'} region`],
            priority: (market?.priority || 'medium'),
            timeline_adjustment: market?.priority === 'high' ? 0 : market?.priority === 'medium' ? 10 : 20
          };
        }),
        priority_level: projectData.priority_level,
        cultural_sensitivity_level: projectData.cultural_sensitivity_level,
        regulatory_complexity: projectData.regulatory_complexity,
        total_budget: projectData.total_budget,
        desired_timeline: projectData.desired_timeline
      };

      const project = await createLocalizationProject(formattedData);
      
      toast({
        title: "Project Created",
        description: `Localization project "${projectData.project_name}" has been created successfully.`,
      });

      // Refresh the dashboard data to show the new project
      await refreshData();
      
      onProjectCreated?.(project.id);
      setOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create localization project",
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  const resetForm = () => {
    setCurrentStep(1);
    setProjectData({
      project_name: '',
      description: '',
      source_content_type: 'content_studio',
      target_languages: [],
      target_markets: [],
      priority_level: 'medium',
      cultural_sensitivity_level: 'medium',
      regulatory_complexity: 'standard'
    });
    setSelectedLanguages([]);
    setSelectedMarkets([]);
  };

  const isStep1Valid = projectData.project_name && projectData.source_content_type;
  const isStep2Valid = selectedLanguages.length > 0 && selectedMarkets.length > 0;

  // Auto-populate project data when asset is selected or languages/markets change
  useEffect(() => {
    if (selectedAsset && assetBasedProjectData && !projectData.project_name.includes('Localization:')) {
      setProjectData(prev => ({
        ...prev,
        project_name: assetBasedProjectData.suggestedProjectName,
        description: assetBasedProjectData.suggestedDescription,
        source_content_id: selectedAsset.id
      }));
    }
  }, [selectedAsset, assetBasedProjectData]);

  // Update project data when languages/markets change
  useEffect(() => {
    console.log('CreateProjectModal - Assets loaded:', {
      contentStudioCount: contentStudioAssets.length,
      preMLRCount: preMLRAssets.length,
      designStudioCount: designStudioAssets.length,
      contentStudioEmptyIds: contentStudioAssets.filter(a => !a.id || a.id.trim() === '').length,
      preMLREmptyIds: preMLRAssets.filter(a => !a.id || a.id.trim() === '').length,
      designStudioEmptyIds: designStudioAssets.filter(a => !a.id || a.id.trim() === '').length
    });
  }, [contentStudioAssets, preMLRAssets, designStudioAssets]);

  useEffect(() => {
    if (selectedAsset && (selectedLanguages.length > 0 || selectedMarkets.length > 0)) {
      updateProjectData(selectedLanguages, selectedMarkets);
    }
  }, [selectedAsset, selectedLanguages, selectedMarkets, updateProjectData]);

  // Handle source content type change
  const handleSourceTypeChange = (sourceType) => {
    setProjectData({...projectData, source_content_type: sourceType});
    clearSelection();
    // Reset form data that was auto-populated
    if (projectData.project_name.includes('Localization:')) {
      setProjectData(prev => ({
        ...prev,
        project_name: '',
        description: '',
        source_content_id: undefined
      }));
    }
  };

  // Handle asset selection
  const handleAssetSelect = async (assetId) => {
    const sourceType = projectData.source_content_type;
    const sourceAssets = getAssetsBySource(sourceType);
    const asset = sourceAssets.find(a => a.id === assetId);
    
    if (asset) {
      await selectAsset(asset, selectedLanguages, selectedMarkets);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create Localization Project
          </DialogTitle>
        </DialogHeader>

        <Tabs value={`step-${currentStep}`} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="step-1" disabled={currentStep < 1}>
              1. Project Setup
            </TabsTrigger>
            <TabsTrigger value="step-2" disabled={currentStep < 2}>
              2. Markets & Languages
            </TabsTrigger>
            <TabsTrigger value="step-3" disabled={currentStep < 3}>
              3. Configuration
            </TabsTrigger>
          </TabsList>

          <TabsContent value="step-1" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="project-name">Project Name *</Label>
                  <Input
                    id="project-name"
                    value={projectData.project_name}
                    onChange={(e) => setProjectData({...projectData, project_name: e.target.value})}
                    placeholder="e.g., Global Launch Localization 2025"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={projectData.description}
                    onChange={(e) => setProjectData({...projectData, description: e.target.value})}
                    placeholder="Brief description of the localization project..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Content Source *</Label>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
                    <Card 
                      className={`cursor-pointer transition-colors ${
                        projectData.source_content_type === 'content_studio' 
                          ? 'border-primary bg-primary/5' 
                          : 'hover:border-primary/50'
                      }`}
                      onClick={() => handleSourceTypeChange('content_studio')}
                    >
                      <CardContent className="p-4 text-center relative">
                        <FileText className="h-8 w-8 mx-auto mb-2 text-primary" />
                        <h4 className="font-medium">Content Studio</h4>
                        <p className="text-xs text-muted-foreground">Existing content projects</p>
                        {contentStudioAssets.length > 0 && (
                          <Badge variant="secondary" className="absolute -top-2 -right-2 text-xs">
                            {contentStudioAssets.length}
                          </Badge>
                        )}
                      </CardContent>
                    </Card>

                    <Card 
                      className={`cursor-pointer transition-colors ${
                        projectData.source_content_type === 'pre_mlr' 
                          ? 'border-primary bg-primary/5' 
                          : 'hover:border-primary/50'
                      }`}
                      onClick={() => handleSourceTypeChange('pre_mlr')}
                    >
                      <CardContent className="p-4 text-center relative">
                        <Stethoscope className="h-8 w-8 mx-auto mb-2 text-primary" />
                        <h4 className="font-medium">Pre-MLR</h4>
                        <p className="text-xs text-muted-foreground">MLR reviewed content</p>
                        {preMLRAssets.length > 0 && (
                          <Badge variant="secondary" className="absolute -top-2 -right-2 text-xs">
                            {preMLRAssets.length}
                          </Badge>
                        )}
                      </CardContent>
                    </Card>

                    <Card 
                      className={`cursor-pointer transition-colors ${
                        projectData.source_content_type === 'design_studio' 
                          ? 'border-primary bg-primary/5' 
                          : 'hover:border-primary/50'
                      }`}
                      onClick={() => handleSourceTypeChange('design_studio')}
                    >
                      <CardContent className="p-4 text-center relative">
                        <Palette className="h-8 w-8 mx-auto mb-2 text-primary" />
                        <h4 className="font-medium">Design Studio</h4>
                        <p className="text-xs text-muted-foreground">Design assets</p>
                        {designStudioAssets.length > 0 && (
                          <Badge variant="secondary" className="absolute -top-2 -right-2 text-xs">
                            {designStudioAssets.length}
                          </Badge>
                        )}
                      </CardContent>
                    </Card>

                    <Card 
                      className={`cursor-pointer transition-colors ${
                        projectData.source_content_type === 'uploaded' 
                          ? 'border-primary bg-primary/5' 
                          : 'hover:border-primary/50'
                      }`}
                      onClick={() => handleSourceTypeChange('uploaded')}
                    >
                      <CardContent className="p-4 text-center">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-primary" />
                        <h4 className="font-medium">Upload Files</h4>
                        <p className="text-xs text-muted-foreground">Upload documents</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Asset Selection for different source types */}
                {(projectData.source_content_type === 'content_studio' && contentStudioAssets.length > 0) && (
                  <div>
                    <Label>Select Content Studio Asset</Label>
                    <Select onValueChange={handleAssetSelect}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a content asset..." />
                      </SelectTrigger>
                      <SelectContent>
                         <ScrollArea className="max-h-60">
                           {contentStudioAssets
                             .filter(asset => asset.id && asset.id.trim() !== '')
                             .map((asset) => (
                             <SelectItem key={asset.id} value={asset.id}>
                               <div className="flex flex-col">
                                 <span className="font-medium">{asset.name}</span>
                                 <span className="text-sm text-muted-foreground">
                                   {asset.project_name} • {asset.type} • {asset.status}
                                 </span>
                               </div>
                             </SelectItem>
                           ))}
                         </ScrollArea>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {(projectData.source_content_type === 'pre_mlr' && preMLRAssets.length > 0) && (
                  <div>
                    <Label>Select MLR Approved Asset</Label>
                    <Select onValueChange={handleAssetSelect}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose an MLR approved asset..." />
                      </SelectTrigger>
                      <SelectContent>
                         <ScrollArea className="max-h-60">
                           {preMLRAssets
                             .filter(asset => asset.id && asset.id.trim() !== '')
                             .map((asset) => (
                             <SelectItem key={asset.id} value={asset.id}>
                               <div className="flex flex-col">
                                 <span className="font-medium">{asset.name}</span>
                                 <span className="text-sm text-muted-foreground">
                                   {asset.project_name} • {asset.type} • MLR Approved
                                 </span>
                               </div>
                             </SelectItem>
                           ))}
                         </ScrollArea>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {(projectData.source_content_type === 'design_studio' && designStudioAssets.length > 0) && (
                  <div>
                    <Label>Select Design Studio Asset</Label>
                    <Select onValueChange={handleAssetSelect}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a design asset..." />
                      </SelectTrigger>
                      <SelectContent>
                         <ScrollArea className="max-h-60">
                           {designStudioAssets
                             .filter(asset => asset.id && asset.id.trim() !== '')
                             .map((asset) => (
                             <SelectItem key={asset.id} value={asset.id}>
                               <div className="flex flex-col">
                                 <span className="font-medium">{asset.name}</span>
                                 <span className="text-sm text-muted-foreground">
                                   {asset.project_name} • Design Complete
                                 </span>
                               </div>
                             </SelectItem>
                           ))}
                         </ScrollArea>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Show selected asset info */}
                {selectedAsset && assetBasedProjectData && (
                  <Card className="border-green-200 bg-green-50">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-green-800">
                            Asset Selected: {selectedAsset.name}
                          </h4>
                          <p className="text-sm text-green-700 mt-1">
                            Project name and description will be auto-populated based on this selection.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Loading state for assets */}
                {assetsLoading && (
                  <Card className="border-blue-200 bg-blue-50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full" />
                        <span className="text-sm text-blue-700">Loading available assets...</span>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button 
                onClick={() => setCurrentStep(2)} 
                disabled={!isStep1Valid}
              >
                Next: Markets & Languages
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="step-2" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Target Languages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {languages.map((lang) => (
                      <div key={lang.code} className="flex items-center space-x-2">
                        <Checkbox
                          id={`lang-${lang.code}`}
                          checked={selectedLanguages.includes(lang.code)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedLanguages([...selectedLanguages, lang.code]);
                            } else {
                              setSelectedLanguages(selectedLanguages.filter(l => l !== lang.code));
                            }
                          }}
                        />
                        <Label htmlFor={`lang-${lang.code}`} className="flex-1">
                          {lang.name}
                        </Label>
                        <Badge variant="secondary" className="text-xs">
                          {lang.region}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Target Markets</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {markets.map((market) => (
                      <div key={market.name} className="flex items-center space-x-2">
                        <Checkbox
                          id={`market-${market.name}`}
                          checked={selectedMarkets.includes(market.name)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedMarkets([...selectedMarkets, market.name]);
                            } else {
                              setSelectedMarkets(selectedMarkets.filter(m => m !== market.name));
                            }
                          }}
                        />
                        <div className="flex-1">
                          <Label htmlFor={`market-${market.name}`} className="font-medium">
                            {market.name}
                          </Label>
                          <div className="flex gap-1 mt-1">
                            {market.regulatory.slice(0, 2).map((reg) => (
                              <Badge key={reg} variant="outline" className="text-xs">
                                {reg}
                              </Badge>
                            ))}
                            {market.regulatory.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{market.regulatory.length - 2}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Badge 
                          variant={market.priority === 'high' ? 'default' : market.priority === 'medium' ? 'secondary' : 'outline'} 
                          className="text-xs"
                        >
                          {market.priority}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {(selectedLanguages.length > 0 || selectedMarkets.length > 0) && (
              <Card>
                <CardHeader>
                  <CardTitle>Selection Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedLanguages.length > 0 && (
                    <div className="mb-4">
                      <Label className="font-medium">Selected Languages:</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedLanguages.map((langCode) => {
                          const lang = languages.find(l => l.code === langCode);
                          return (
                            <Badge key={langCode} variant="secondary">
                              {lang?.name}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {selectedMarkets.length > 0 && (
                    <div>
                      <Label className="font-medium">Selected Markets:</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedMarkets.map((marketName) => (
                          <Badge key={marketName} variant="secondary">
                            {marketName}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(1)}>
                Back
              </Button>
              <Button 
                onClick={() => setCurrentStep(3)} 
                disabled={!isStep2Valid}
              >
                Next: Configuration
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="step-3" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Priority Level</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select 
                    value={projectData.priority_level} 
                    onValueChange={(value) => setProjectData({...projectData, priority_level: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Cultural Sensitivity</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select 
                    value={projectData.cultural_sensitivity_level} 
                    onValueChange={(value) => setProjectData({...projectData, cultural_sensitivity_level: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Regulatory Complexity</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select 
                    value={projectData.regulatory_complexity} 
                    onValueChange={(value) => setProjectData({...projectData, regulatory_complexity: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minimal">Minimal</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Smart Analysis Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="analysis-readiness" defaultChecked />
                    <Label htmlFor="analysis-readiness" className="text-sm">
                      Content Readiness Assessment
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="analysis-complexity" defaultChecked />
                    <Label htmlFor="analysis-complexity" className="text-sm">
                      Complexity Scoring
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="analysis-risk" defaultChecked />
                    <Label htmlFor="analysis-risk" className="text-sm">
                      Regulatory Risk Assessment
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="analysis-tm" defaultChecked />
                    <Label htmlFor="analysis-tm" className="text-sm">
                      Translation Memory Matching
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Separator />

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(2)}>
                Back
              </Button>
              <div className="space-x-2">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateProject} 
                  disabled={loading || localizationLoading}
                >
                  {(loading || localizationLoading) ? 'Creating...' : 'Create Project'}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};