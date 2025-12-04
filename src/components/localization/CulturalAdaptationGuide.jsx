import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Globe, 
  AlertTriangle, 
  Info, 
  BookOpen,
  Users,
  Gavel,
  Calendar,
  MapPin,
  Languages,
  Lightbulb,
  Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const CulturalAdaptationGuide = ({
  sourceLanguage,
  targetLanguage,
  segment,
  project
}) => {
  const [culturalGuidance, setCulturalGuidance] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  // Get cultural guidance based on language pair and content
  useEffect(() => {
    generateCulturalGuidance();
  }, [sourceLanguage, targetLanguage, segment?.sourceText]);

  const generateCulturalGuidance = async () => {
    setIsLoading(true);
    
    // Simulate API call for cultural guidance
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const guidance = [];
    
    // Language-specific guidance
    if (targetLanguage.toLowerCase() === 'zh') {
      guidance.push({
        id: 'zh-formality',
        type: 'cultural',
        priority: 'high',
        title: 'Chinese Politeness Levels',
        description: 'Chinese medical communications require respectful language and appropriate honorifics, especially when addressing patients and healthcare professionals.',
        examples: [
          'Use "您" (nín) instead of "你" (nǐ) for formal address',
          'Include proper titles like "医生" (yīshēng) when addressing doctors'
        ],
        references: ['Chinese Medical Writing Standards']
      });

      guidance.push({
        id: 'zh-medical-terms',
        type: 'linguistic',
        priority: 'high',
        title: 'Traditional vs Simplified Characters',
        description: 'Medical terminology may use different character sets depending on the target region.',
        examples: [
          'Mainland China: Simplified characters',
          'Taiwan/Hong Kong: Traditional characters may be preferred'
        ]
      });

      guidance.push({
        id: 'zh-regulatory',
        type: 'regulatory',
        priority: 'high',
        title: 'NMPA Compliance Requirements',
        description: 'China has strict regulatory requirements for pharmaceutical labeling and marketing materials.',
        examples: [
          'NMPA approval numbers must be displayed prominently',
          'Specific warning formats required by Chinese regulations'
        ]
      });
    }

    if (targetLanguage.toLowerCase() === 'ja') {
      guidance.push({
        id: 'ja-keigo',
        type: 'cultural',
        priority: 'high',
        title: 'Japanese Honorific Language (Keigo)',
        description: 'Medical communications in Japanese require appropriate levels of politeness and respect.',
        examples: [
          'Use "いらっしゃる" instead of "いる" for patients',
          'Medical professionals should be addressed with proper honorifics'
        ]
      });

      guidance.push({
        id: 'ja-medical-kanji',
        type: 'linguistic',
        priority: 'medium',
        title: 'Medical Kanji Complexity',
        description: 'Medical terms often use complex kanji that may need furigana for patient-facing materials.',
        examples: [
          'Consider furigana for complex medical terms',
          'Balance between medical accuracy and readability'
        ]
      });

      guidance.push({
        id: 'ja-regulatory',
        type: 'regulatory',
        priority: 'high',
        title: 'PMDA Regulatory Requirements',
        description: 'Japan has specific requirements for pharmaceutical labeling and safety information.',
        examples: [
          'PMDA approval information must be included',
          'Specific safety warning formats required'
        ]
      });
    }

    // Content-specific guidance
    if (segment?.sourceText.toLowerCase().includes('side effect')) {
      guidance.push({
        id: 'safety-warnings',
        type: 'regulatory',
        priority: 'high',
        title: 'Safety Information Standards',
        description: 'Side effects and warnings must follow local regulatory standards.',
        examples: [
          'Order of severity may differ by region',
          'Some countries require specific phrasing'
        ]
      });
    }

    if (segment?.sourceText.toLowerCase().includes('dosage') || 
        segment?.sourceText.toLowerCase().includes('dose')) {
      guidance.push({
        id: 'dosage-units',
        type: 'cultural',
        priority: 'high',
        title: 'Measurement Units',
        description: 'Dosage units and measurement systems vary by country.',
        examples: [
          'US uses mg/lb, Europe uses mg/kg',
          'Temperature: Fahrenheit vs Celsius'
        ]
      });
    }

    // Visual and layout considerations
    guidance.push({
      id: 'text-expansion',
      type: 'visual',
      priority: 'medium',
      title: 'Text Expansion Considerations',
      description: `${getLanguageName(targetLanguage)} typically expands ${getExpansionRate(targetLanguage)}% compared to English.`,
      examples: [
        'Check button and label sizing',
        'Ensure responsive design accommodates longer text'
      ]
    });

    // Regional cultural considerations
    guidance.push({
      id: 'cultural-symbols',
      type: 'cultural',
      priority: 'low',
      title: 'Cultural Symbols and Colors',
      description: 'Colors and symbols may have different cultural meanings.',
      examples: [
        'Red may signify luck in some cultures, danger in others',
        'Religious symbols should be used carefully'
      ]
    });

    setCulturalGuidance(guidance);
    setIsLoading(false);
  };

  const getLanguageName = (code) => {
    const languages = {
      'ja': 'Japanese',
      'zh': 'Chinese'
    };
    return languages[code.toLowerCase()] || code.toUpperCase();
  };

  const getExpansionRate = (code) => {
    const rates = {
      'ja': -10,
      'zh': -20
    };
    return rates[code.toLowerCase()] || 0;
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'cultural': return <Users className="h-4 w-4" />;
      case 'regulatory': return <Gavel className="h-4 w-4" />;
      case 'linguistic': return <Languages className="h-4 w-4" />;
      case 'visual': return <Globe className="h-4 w-4" />;
      case 'behavioral': return <BookOpen className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'outline';
      case 'low': return 'secondary';
    }
  };

  const filteredGuidance = selectedCategory === 'all' 
    ? culturalGuidance 
    : culturalGuidance.filter(g => g.type === selectedCategory);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Cultural Guide
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {getLanguageName(sourceLanguage)} → {getLanguageName(targetLanguage)}
        </p>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col space-y-4">
        {/* Category Filter */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
            <TabsTrigger value="cultural" className="text-xs">Cultural</TabsTrigger>
            <TabsTrigger value="regulatory" className="text-xs">Regulatory</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Guidance List */}
        <div className="flex-1 overflow-y-auto space-y-3">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-full mb-2" />
                  <div className="h-3 bg-muted/60 rounded w-3/4 mb-1" />
                  <div className="h-3 bg-muted/60 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredGuidance.length > 0 ? (
            filteredGuidance.map((guidance) => (
              <div key={guidance.id} className="border rounded-lg p-3 space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(guidance.type)}
                    <h4 className="text-sm font-medium">{guidance.title}</h4>
                  </div>
                  <Badge variant={getPriorityColor(guidance.priority)} className="text-xs">
                    {guidance.priority}
                  </Badge>
                </div>
                
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {guidance.description}
                </p>
                
                {guidance.examples && guidance.examples.length > 0 && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <Lightbulb className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs font-medium text-muted-foreground">Examples:</span>
                    </div>
                    <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                      {guidance.examples.map((example, index) => (
                        <li key={index} className="list-disc">{example}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {guidance.references && guidance.references.length > 0 && (
                  <div className="flex items-center gap-1 text-xs text-blue-600">
                    <BookOpen className="h-3 w-3" />
                    <span>References: {guidance.references.join(', ')}</span>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Globe className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No cultural guidance available</p>
              <p className="text-xs">Guidance will appear based on content and language pair</p>
            </div>
          )}
        </div>

        {/* Quick Reference */}
        <Separator />
        <div className="text-xs text-muted-foreground">
          <div className="flex items-center gap-1 mb-1">
            <Shield className="h-3 w-3" />
            <span className="font-medium">Quick Reference:</span>
          </div>
          <div className="space-y-1 ml-4">
            <div>• Text expansion: ~{getExpansionRate(targetLanguage)}%</div>
            <div>• Reading direction: Left-to-right</div>
            <div>• Date format: Region-specific</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};