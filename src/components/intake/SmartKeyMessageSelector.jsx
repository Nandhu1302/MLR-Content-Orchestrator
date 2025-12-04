
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Lightbulb, Edit3, Check } from 'lucide-react';
import { BrandMessageService } from '@/services/brandMessageService';

export const SmartKeyMessageSelector = ({ value, onChange, context, placeholder }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [isCustom, setIsCustom] = useState(false);

  useEffect(() => {
    if (context) {
      const newSuggestions = BrandMessageService.generateKeyMessageSuggestions(context);
      setSuggestions(newSuggestions);

      const matchingSuggestion = newSuggestions.find((s) => s.text === value);
      if (matchingSuggestion) {
        setSelectedSuggestion(matchingSuggestion.id);
        setIsCustom(false);
      } else if (value) {
        setIsCustom(true);
        setSelectedSuggestion(null);
      }
    }
  }, [context, value]);

  const handleSuggestionSelect = (suggestion) => {
    onChange(suggestion.text);
    setSelectedSuggestion(suggestion.id);
    setIsCustom(false);
  };

  const handleCustomEdit = () => {
    setIsCustom(true);
    setSelectedSuggestion(null);
  };

  const handleCustomChange = (newValue) => {
    onChange(newValue);
    setIsCustom(true);
    setSelectedSuggestion(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Primary Message/Theme *</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue={isCustom ? 'custom' : 'suggestions'}>
          <TabsList>
            <TabsTrigger value="suggestions" onClick={() => setIsCustom(false)}>
              Suggestions
            </TabsTrigger>
            <TabsTrigger value="custom" onClick={() => setIsCustom(true)}>
              Custom
            </TabsTrigger>
          </TabsList>

          <TabsContent value="suggestions" className="space-y-3">
            {suggestions.length > 0 ? (
              suggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  className={`p-3 border rounded-lg cursor-pointer hover:bg-muted ${
                    selectedSuggestion === suggestion.id ? 'bg-primary/10' : ''
                  }`}
                  onClick={() => handleSuggestionSelect(suggestion)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{suggestion.text}</span>
                    {selectedSuggestion === suggestion.id && <Check className="h-4 w-4 text-primary" />}
                  </div>
                  <p className="text-xs text-muted-foreground">{suggestion.rationale}</p>
                  <Badge variant="secondary" className="text-xs">
                    Confidence: {Math.round(suggestion.confidence * 100)}%
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                Select brand and indication to see personalized suggestions
              </p>
            )}
            {suggestions.length > 0 && (
              <Button variant="outline" size="sm" onClick={handleCustomEdit} className="w-full mt-2">
                Write Custom Message
              </Button>
            )}
          </TabsContent>

          <TabsContent value="custom" className="space-y-3">
            <Textarea
              value={value}
              onChange={(e) => handleCustomChange(e.target.value)}
              placeholder={placeholder}
              rows={3}
              className="min-h-[80px]"
            />
            {suggestions.length > 0 && (
              <Button variant="outline" size="sm" onClick={() => setIsCustom(false)} className="w-full">
                Back to Suggestions
              </Button>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
