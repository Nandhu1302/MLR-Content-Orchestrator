
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Sparkles, Wand2, Lightbulb, Database, Users, Loader2 } from 'lucide-react';
import { VoiceInputButton } from './VoiceInputButton';
import { StoryScenarioGrid } from './StoryScenarioGrid';

/*
interface StoryInputPanelProps {
  onStorySubmit: (story: string, mode?: string) => void;
  onScenarioSelect: (scenarioId: string) => void;
  onThemeSpecification?: (themeName: string) => void;
  disabled?: boolean;
  isProcessing?: boolean;
}
*/

export const StoryInputPanel = ({ 
  onStorySubmit, 
  onScenarioSelect, 
  onThemeSpecification, 
  disabled,
  isProcessing 
}) => {
  const [story, setStory] = useState('');
  const [selectedMode, setSelectedMode] = useState/*<string | null>*/(null);

  const handleSubmit = () => {
    if (story.trim()) {
      // Check if theme specification mode
      if (selectedMode === 'specification') {
        // Extract theme name
        const themeMatch = story.match(/(?:theme|campaign)\s*:\s*["']?(.+?)["']?(?:\s|$)/i);
        if (themeMatch && onThemeSpecification) {
          onThemeSpecification(themeMatch[1].trim());
          return;
        }
      }
      onStorySubmit(story, selectedMode || undefined);
    }
  };

  const handleVoiceTranscript = (transcript) => {
    setStory(transcript);
  };

  return (
    <div className="space-y-4">
      {/* Mode Selection - Horizontal Tabs */}
      <Card className="border-dashed">
        <CardContent className="pt-4">
          <p className="text-xs text-muted-foreground mb-2">How would you like to start?</p>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedMode === 'discovery' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedMode('discovery')}
              disabled={disabled}
            >
              <Wand2 className="h-3 w-3 mr-1.5" />
              Describe Campaign
            </Button>
            <Button
              variant={selectedMode === 'specification' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedMode('specification')}
              disabled={disabled}
            >
              <Sparkles className="h-3 w-3 mr-1.5" />
              I Have a Theme
            </Button>
            <Button
              variant={selectedMode === 'exploration' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedMode('exploration')}
              disabled={disabled}
            >
              <Lightbulb className="h-3 w-3 mr-1.5" />
              Explore Opportunities
            </Button>
            <Button
              variant={selectedMode === 'data_first' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedMode('data_first')}
              disabled={disabled}
            >
              <Database className="h-3 w-3 mr-1.5" />
              Brand Brief
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Story Input Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-primary" />
            <CardTitle>Describe Your Story</CardTitle>
          </div>
          <CardDescription>
            {selectedMode === 'specification' 
              ? 'Specify your theme name (e.g., "Theme: Winter Immunity & HIV Awareness")'
              : selectedMode === 'exploration'
              ? 'Ask me to show you current opportunities'
              : selectedMode === 'data_first'
              ? "Ask me what's going on with your brand"
              : 'Tell me about your content needs in natural language'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Textarea
              value={story}
              onChange={(e) => setStory(e.target.value)}
              placeholder={
                selectedMode === 'specification' 
                  ? 'Theme: Winter Immunity & HIV Awareness'
                  : selectedMode === 'exploration'
                  ? 'What opportunities exist right now?'
                  : selectedMode === 'data_first'
                  ? "What's going on with my brand?"
                  : "Example: 'I'm preparing for CROI 2025 conference next month. I need booth materials, social media posts during the event, and follow-up emails for HIV specialists focusing on our resistance data...'"
              }
              className="min-h-[200px] resize-none"
              disabled={disabled}
            />
            <div className="absolute bottom-3 right-3">
              <VoiceInputButton onTranscript={handleVoiceTranscript} disabled={disabled} />
            </div>
          </div>

          {isProcessing ? (
            <div className="space-y-3 py-4">
              <div className="flex items-center justify-center gap-2 text-primary">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-sm font-medium">Analyzing your story with AI...</span>
              </div>
              <Progress value={undefined} className="h-2" />
              <p className="text-xs text-muted-foreground text-center">
                Extracting key insights and matching intelligence data
              </p>
            </div>
          ) : (
            <Button 
              className="w-full" 
              onClick={handleSubmit}
              disabled={!story.trim() || disabled}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Start AI Conversation
            </Button>
          )}

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="h-px flex-1 bg-border" />
            <span>OR</span>
            <div className="h-px flex-1 bg-border" />
          </div>
        </CardContent>
      </Card>

      {/* Quick Start Scenarios - Compact */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Quick Start Scenarios</CardTitle>
        </CardHeader>
        <CardContent>
          <StoryScenarioGrid onScenarioSelect={onScenarioSelect} disabled={disabled} />
        </CardContent>
      </Card>
    </div>
  );
};
