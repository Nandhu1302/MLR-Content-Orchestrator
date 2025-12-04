import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Globe, Languages, Radio, ArrowRight, Edit2, CheckCircle, Info, Clock } from 'lucide-react';
import { StrategicContextExtractor } from '@/services/StrategicContextExtractor';
import { 
  getSupportedMarkets, 
  getComingSoonMarkets,
  MARKET_TO_LANGUAGE_MAP,
} from '@/config/localizationConfig';

const ASSET_TYPE_TO_CHANNEL = {
  'email': 'Email',
  'mass-email': 'Email',
  'rep-triggered-email': 'Email',
  'patient-email': 'Email',
  'caregiver-email': 'Email',
  'website-landing-page': 'Web',
  'social-media-post': 'Social Media',
  'digital-sales-aid': 'Sales Enablement',
};

const MARKET_FLAGS = {
  'JP': '🇯🇵',
  'CN': '🇨🇳',
  'DE': '🇩🇪',
  'FR': '🇫🇷',
  'ES': '🇪🇸',
  'IT': '🇮🇹',
  'BR': '🇧🇷',
  'MX': '🇲🇽',
  'CA': '🇨🇦',
  'AU': '🇦🇺',
  'US': '🇺🇸',
};

const LANGUAGE_FLAGS = {
  'ja': '🇯🇵',
  'zh': '🇨🇳',
  'de': '🇩🇪',
};

export const MarketChannelConfigurator = ({
  selectedAsset,
  onComplete,
  onBack,
}) => {
  const strategicContext = StrategicContextExtractor.extractFromAsset(selectedAsset);
  const sourceMarket = strategicContext.sourceMarket;
  
  const availableMarkets = getSupportedMarkets().filter(m => m.code !== sourceMarket);
  const comingSoonMarkets = getComingSoonMarkets();
  
  const [selectedMarkets, setSelectedMarkets] = useState([]);
  const [projectName, setProjectName] = useState(StrategicContextExtractor.generateProjectName(selectedAsset, []));
  const [isEditingName, setIsEditingName] = useState(false);
  
  const derivedLanguages = selectedMarkets.map(code => MARKET_TO_LANGUAGE_MAP[code]);
  const derivedChannel = ASSET_TYPE_TO_CHANNEL[selectedAsset.type] || 'Email';
  
  useEffect(() => {
    if (selectedMarkets.length > 0) {
      setProjectName(StrategicContextExtractor.generateProjectName(selectedAsset, selectedMarkets));
    }
  }, [selectedMarkets, selectedAsset]);
  
  const toggleMarket = (marketCode) => {
    setSelectedMarkets(prev => 
      prev.includes(marketCode) ? prev.filter(m => m !== marketCode) : [...prev, marketCode]
    );
  };
  
  const handleComplete = () => {
    const projectDescription = StrategicContextExtractor.generateProjectDescription(
      selectedAsset,
      selectedMarkets,
      derivedLanguages
    );
    
    onComplete({
      projectName,
      projectDescription,
      targetMarkets: selectedMarkets,
      targetLanguages: derivedLanguages,
      primaryChannel: derivedChannel,
      platformChannels: [],
      strategicContext: {
        ...strategicContext,
        sourceMarket,
      },
    });
  };
  
  const isValid = selectedMarkets.length > 0 && projectName.trim() !== '';
  
  const getComplexityBadgeVariant = (complexity) => {
    switch (complexity) {
      case 'Low': return 'default';
      case 'Medium': return 'secondary';
      case 'High': return 'destructive';
      default: return 'outline';
    }
  };
  
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <Label className="text-sm font-medium min-w-[100px]">Project Name:</Label>
            {isEditingName ? (
              <div className="flex-1 flex gap-2">
                <Input
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Enter project name..."
                  className="flex-1"
                />
                <Button size="sm" onClick={() => setIsEditingName(false)}>
                  <CheckCircle className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-between">
                <p className="font-semibold">{projectName}</p>
                <Button variant="ghost" size="sm" onClick={() => setIsEditingName(true)}>
                  <Edit2 className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {sourceMarket && (
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Source Market:</span>
              <Badge variant="outline" className="ml-2">
                {MARKET_FLAGS[sourceMarket]} {sourceMarket} - Excluded from targets
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Accordion type="single" collapsible>
        <AccordionItem value="context" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Strategic Context</span>
              <Badge variant="secondary" className="text-xs">From Source Asset</Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4 pb-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              {strategicContext.indication && (
                <div>
                  <p className="text-muted-foreground">Indication</p>
                  <p className="font-medium">{strategicContext.indication}</p>
                </div>
              )}
              {strategicContext.targetAudience && (
                <div>
                  <p className="text-muted-foreground">Target Audience</p>
                  <p className="font-medium">{strategicContext.targetAudience}</p>
                </div>
              )}
              {strategicContext.keyMessage && (
                <div className="col-span-2">
                  <p className="text-muted-foreground">Key Message</p>
                  <p className="font-medium">{strategicContext.keyMessage}</p>
                </div>
              )}
              {strategicContext.callToAction && (
                <div className="col-span-2">
                  <p className="text-muted-foreground">Call to Action</p>
                  <p className="font-medium">{strategicContext.callToAction}</p>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Globe className="h-5 w-5" />
            Target Markets
          </CardTitle>
          <CardDescription>
            Select markets for glocalization ({availableMarkets.length} supported)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            {availableMarkets.map(market => (
              <div 
                key={market.code} 
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id={`market-${market.code}`}
                    checked={selectedMarkets.includes(market.code)}
                    onCheckedChange={() => toggleMarket(market.code)}
                  />
                  <Label htmlFor={`market-${market.code}`} className="cursor-pointer flex items-center gap-2">
                    <span className="text-xl">{MARKET_FLAGS[market.code]}</span>
                    <span className="font-medium">{market.name}</span>
                    <span className="text-sm text-muted-foreground">({market.language})</span>
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getComplexityBadgeVariant(market.complexity)}>
                    {market.complexity}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    {market.complexity === 'High' ? '8-12w' : market.complexity === 'Medium' ? '6-8w' : '4-6w'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          
          {comingSoonMarkets.length > 0 && (
            <div className="pt-3 border-t">
              <p className="text-xs text-muted-foreground mb-2">Coming Soon:</p>
              <div className="flex flex-wrap gap-2">
                {comingSoonMarkets.map(market => (
                  <Badge key={market.code} variant="outline" className="opacity-50">
                    {MARKET_FLAGS[market.code]} {market.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {selectedMarkets.length > 0 && (
            <div className="pt-3 border-t bg-accent/30 p-3 rounded-lg">
              <p className="text-sm font-medium mb-2">Selected: {selectedMarkets.length} market{selectedMarkets.length > 1 ? 's' : ''}</p>
              <div className="flex flex-wrap gap-2">
                {selectedMarkets.map(code => {
                  const market = availableMarkets.find(m => m.code === code);
                  return (
                    <Badge key={code} variant="secondary">
                      {MARKET_FLAGS[code]} {market?.name}
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {derivedLanguages.length > 0 && (
        <Card className="bg-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Languages className="h-5 w-5" />
              Auto-Selected Languages
            </CardTitle>
            <CardDescription>
              Automatically configured based on selected markets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {derivedLanguages.map((langCode, idx) => {
                const marketCode = selectedMarkets[idx];
                const market = availableMarkets.find(m => m.code === marketCode);
                return (
                  <Badge key={`${langCode}-${idx}`} variant="secondary" className="px-3 py-2 text-sm">
                    {LANGUAGE_FLAGS[langCode]} {market?.language}
                  </Badge>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
      
      <Card className="bg-accent/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Radio className="h-5 w-5" />
            Auto-Configured Channel
          </CardTitle>
          <CardDescription>
            Based on source asset type: {selectedAsset.type}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Badge variant="secondary" className="px-4 py-2 text-base">
            📧 {derivedChannel}
          </Badge>
        </CardContent>
      </Card>
      
      {selectedMarkets.length > 0 && (
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">Project Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Target Markets:</span>
              <span className="font-semibold">{selectedMarkets.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Languages:</span>
              <span className="font-semibold">{derivedLanguages.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Channel:</span>
              <span className="font-semibold">{derivedChannel}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-base">
              <span className="font-medium">Est. Timeline:</span>
              <span className="font-bold">
                {Math.max(...selectedMarkets.map(code => {
                  const market = availableMarkets.find(m => m.code === code);
                  return market?.complexity === 'High' ? 12 : market?.complexity === 'Medium' ? 8 : 6;
                }))} weeks
              </span>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          Back to Assets
        </Button>
        <Button onClick={handleComplete} disabled={!isValid} size="lg">
          Create Project & Continue
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};