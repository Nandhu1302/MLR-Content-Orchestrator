import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft,
  Languages,
  Bot,
  CheckCircle,
  Copy,
  RefreshCw,
  Sparkles,
  Wand2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SmartTranslationEngine } from '@/services/SmartTranslationEngine';
import { useToast } from '@/hooks/use-toast';

export const TranslationHubWorkspace = ({
  project,
  onBack
}) => {
  // Filter to only support Chinese and Japanese languages
  const supportedLanguages = project.target_languages?.filter(lang => 
    lang === 'zh' || lang === 'ja'
  ) || ['zh', 'ja'];
  
  const [selectedLanguage, setSelectedLanguage] = useState(
    supportedLanguages[0] || 'zh' // Default to Chinese
  );
  const [segments, setSegments] = useState([]);
  const [selectedSegment, setSelectedSegment] = useState(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [autoTranslateMode, setAutoTranslateMode] = useState(false);
  const [selectedService, setSelectedService] = useState('transperfect');
  const { toast } = useToast();

  // Mock segments for demonstration
  useEffect(() => {
    const mockSegments = [
      {
        id: '1',
        sourceText: 'Welcome to our revolutionary pharmaceutical solution that transforms patient care.',
        targetText: '',
        status: 'pending',
        confidence: 0,
        context: 'Marketing headline'
      },
      {
        id: '2',
        sourceText: 'Our clinical trials have shown 95% efficacy in treating chronic conditions.',
        targetText: '',
        status: 'pending',
        confidence: 0,
        context: 'Clinical data claim'
      },
      {
        id: '3',
        sourceText: 'Please consult your healthcare provider before starting treatment.',
        targetText: '',
        status: 'pending',
        confidence: 0,
        context: 'Safety disclaimer'
      },
      {
        id: '4',
        sourceText: 'Side effects may include mild nausea and temporary dizziness.',
        targetText: '',
        status: 'pending',
        confidence: 0,
        context: 'Side effects'
      },
      {
        id: '5',
        sourceText: 'Available in 50mg and 100mg formulations.',
        targetText: '',
        status: 'pending',
        confidence: 0,
        context: 'Product specifications'
      }
    ];
    setSegments(mockSegments);
    setSelectedSegment(mockSegments[0]);
  }, []);

  const handleAITranslate = async (segment) => {
    setIsTranslating(true);
    console.log('🔄 Starting AI translation for segment:', segment.id, 'to language:', selectedLanguage);
    console.log('📝 Source text:', segment.sourceText);
    
    try {
      // Simulate AI translation with SmartTranslationEngine
      const translation = await SmartTranslationEngine.translateSegment(
        segment.sourceText,
        'en',
        selectedLanguage,
        {
          context: segment.context,
          domain: 'pharmaceutical',
          brandId: project.brand_id || '',
          useTranslationMemory: true,
          preferredService: selectedService
        }
      );

      console.log('✅ Translation result:', translation);

      const updatedSegment = {
        ...segment,
        targetText: translation.translatedText,
        confidence: translation.confidence,
        tmMatch: translation.tmMatch,
        aiGenerated: true,
        status: 'translated'
      };

      setSegments(prev => prev.map(s => s.id === segment.id ? updatedSegment : s));
      setSelectedSegment(updatedSegment);

      toast({
        title: "Translation Complete",
        description: `Translated with ${translation.confidence}% confidence`,
      });
    } catch (error) {
      console.error('❌ Translation error:', error);
      
      toast({
        title: "Translation Error",
        description: "Failed to translate segment. Please try again.",
        variant: "destructive"
      });
    }
    setIsTranslating(false);
  };

  const handleAutoTranslateAll = async () => {
    setAutoTranslateMode(true);
    const pendingSegments = segments.filter(s => s.status === 'pending');
    
    for (const segment of pendingSegments) {
      await handleAITranslate(segment);
      // Small delay to show progress
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    setAutoTranslateMode(false);
    toast({
      title: "Auto-Translation Complete",
      description: `Translated ${pendingSegments.length} segments`,
    });
  };

  const handleManualEdit = (segmentId, newText) => {
    setSegments(prev => prev.map(s => 
      s.id === segmentId 
        ? { ...s, targetText: newText, aiGenerated: false }
        : s
    ));
    
    if (selectedSegment?.id === segmentId) {
      setSelectedSegment(prev => prev ? { ...prev, targetText: newText, aiGenerated: false } : null);
    }
  };

  const handleApproveSegment = async (segmentId) => {
    setSegments(prev => {
      const updated = prev.map(s => 
        s.id === segmentId 
          ? { ...s, status: 'approved' }
          : s
      );
      
      // Check if all segments are now approved
      const allApproved = updated.every(s => s.status === 'approved');
      if (allApproved) {
        // Trigger project completion workflow
        handleProjectCompletion(updated);
      }
      
      return updated;
    });
  };

  const handleProjectCompletion = async (completedSegments) => {
    try {
      toast({
        title: "Project Completed!",
        description: "All segments approved. Generating handoff package...",
      });

      // Here you would typically:
      // 1. Update project status in backend
      // 2. Generate automated handoff package
      // 3. Notify stakeholders
      // 4. Create localization deliverables
      
      console.log('Project completion triggered:', {
        projectId: project.id,
        language: selectedLanguage,
        segmentCount: completedSegments.length,
        completedAt: new Date().toISOString()
      });
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete project workflow",
        variant: "destructive"
      });
    }
  };

  const getProgressStats = () => {
    const total = segments.length;
    const translated = segments.filter(s => s.status !== 'pending').length;
    const approved = segments.filter(s => s.status === 'approved').length;
    
    return {
      total,
      translated,
      approved,
      percentage: total > 0 ? Math.round((translated / total) * 100) : 0
    };
  };

  const stats = getProgressStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h2 className="text-xl font-semibold">{project.project_name}</h2>
            <p className="text-sm text-muted-foreground">
              EN → {selectedLanguage === 'zh' ? 'Chinese (中文)' : selectedLanguage === 'ja' ? 'Japanese (日本語)' : 'Unknown Language'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Service:</label>
            <select 
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="border rounded px-3 py-1 text-sm bg-background"
            >
              <option value="transperfect">TransPerfect API</option>
              <option value="deepl">DeepL</option>
              <option value="google">Google Translate</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Language:</label>
            <select 
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="border rounded px-3 py-1 text-sm bg-background"
            >
              <option value="zh">Chinese (中文)</option>
              <option value="ja">Japanese (日本語)</option>
            </select>
          </div>
          
          <Button 
            onClick={handleAutoTranslateAll}
            disabled={autoTranslateMode || segments.every(s => s.status !== 'pending')}
          >
            <Wand2 className="h-4 w-4 mr-2" />
            {autoTranslateMode ? 'Translating...' : 'Auto-Translate All'}
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Translation Progress</span>
            <span className="text-sm text-muted-foreground">
              {stats.translated}/{stats.total} segments ({stats.percentage}%)
            </span>
          </div>
          <Progress value={stats.percentage} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>{stats.approved} approved</span>
            <span>{stats.total - stats.translated} pending</span>
          </div>
        </CardContent>
      </Card>

      {/* Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Segment List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Segments</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-96 overflow-y-auto">
              {segments.map((segment, index) => (
                <div
                  key={segment.id}
                  onClick={() => setSelectedSegment(segment)}
                  className={cn(
                    "p-3 border-b cursor-pointer hover:bg-muted/50 transition-colors",
                    selectedSegment?.id === segment.id && "bg-muted"
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium">Segment {index + 1}</span>
                    <Badge variant={
                      segment.status === 'approved' ? 'default' :
                      segment.status === 'translated' ? 'secondary' :
                      segment.status === 'reviewed' ? 'secondary' :
                      'outline'
                    }>
                      {segment.status === 'pending' ? 'pending' : 
                       segment.status === 'translated' ? 'translated' :
                       segment.status === 'reviewed' ? 'reviewed' : 'approved'}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {segment.sourceText}
                  </p>
                  {segment.confidence > 0 && (
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-1">
                        <Bot className="h-3 w-3" />
                        <span className="text-xs">{segment.confidence}%</span>
                      </div>
                      {segment.tmMatch && (
                        <div className="flex items-center gap-1">
                          <Languages className="h-3 w-3" />
                          <span className="text-xs">{segment.tmMatch}% TM</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Translation Editor */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Translation Editor</CardTitle>
              {selectedSegment && (
                <div className="flex items-center gap-2">
                  {selectedSegment.aiGenerated && (
                    <Badge variant="outline">
                      <Sparkles className="h-3 w-3 mr-1" />
                      AI Generated
                    </Badge>
                  )}
                  {selectedSegment.context && (
                    <Badge variant="secondary">{selectedSegment.context}</Badge>
                  )}
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedSegment ? (
              <>
                {/* Source Text */}
                <div>
                  <label className="text-sm font-medium flex items-center gap-2 mb-2">
                    <Languages className="h-4 w-4" />
                    Source (EN)
                  </label>
                  <div className="p-3 bg-muted rounded-md">
                    <p className="text-sm">{selectedSegment.sourceText}</p>
                  </div>
                </div>

                <Separator />

                {/* Target Text */}
                <div>
                  <label className="text-sm font-medium flex items-center gap-2 mb-2">
                    <Languages className="h-4 w-4" />
                    Translation ({selectedLanguage === 'zh' ? 'Chinese' : selectedLanguage === 'ja' ? 'Japanese' : selectedLanguage.toUpperCase()})
                  </label>
                  <Textarea
                    value={selectedSegment.targetText}
                    onChange={(e) => handleManualEdit(selectedSegment.id, e.target.value)}
                    placeholder="Enter translation or use AI translate..."
                    className="min-h-24"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleAITranslate(selectedSegment)}
                    disabled={isTranslating}
                  >
                    {isTranslating ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Bot className="h-4 w-4 mr-2" />
                    )}
                    AI Translate
                  </Button>
                  
                  {selectedSegment.targetText && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          navigator.clipboard.writeText(selectedSegment.targetText);
                          toast({ title: "Copied to clipboard" });
                        }}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleApproveSegment(selectedSegment.id)}
                        disabled={selectedSegment.status === 'approved'}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        {selectedSegment.status === 'approved' ? 'Approved' : 'Approve'}
                      </Button>
                    </>
                  )}
                </div>

                {/* Translation Stats */}
                {selectedSegment.confidence > 0 && (
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">AI Confidence</p>
                      <p className="text-lg font-semibold">{selectedSegment.confidence}%</p>
                    </div>
                    {selectedSegment.tmMatch && (
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">TM Match</p>
                        <p className="text-lg font-semibold">{selectedSegment.tmMatch}%</p>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <Languages className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Select a segment to start translating</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};