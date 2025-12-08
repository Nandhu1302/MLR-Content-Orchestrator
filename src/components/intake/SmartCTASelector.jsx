import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Target, Edit3, Check } from 'lucide-react';
// Type imports removed
import { BrandMessageService } from '@/services/brandMessageService';

// Interface and type annotations removed
export const SmartCTASelector = ({ 
  value, 
  onChange, 
  context,
  placeholder 
}) => {
  // Type assertion removed
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [isCustom, setIsCustom] = useState(false);

  useEffect(() => {
    if (context) {
      const fetchSuggestions = async () => {
        const newSuggestions = await BrandMessageService.generateCTASuggestions(context);
        // Type assertion removed
        setSuggestions(newSuggestions);
        
        // If current value matches a suggestion, mark it as selected
        const matchingSuggestion = newSuggestions.find(s => s.text === value);
        if (matchingSuggestion) {
          setSelectedSuggestion(matchingSuggestion.id);
          setIsCustom(false);
        } else if (value) {
          setIsCustom(true);
          setSelectedSuggestion(null);
        }
      };
      
      fetchSuggestions();
    }
  }, [context, value]);

  // Type annotation removed
  const handleSuggestionSelect = (suggestion) => {
    onChange(suggestion.text);
    setSelectedSuggestion(suggestion.id);
    setIsCustom(false);
  };

  const handleCustomEdit = () => {
    setIsCustom(true);
    setSelectedSuggestion(null);
  };

  // Type annotation removed
  const handleCustomChange = (newValue) => {
    onChange(newValue);
    setIsCustom(true);
    setSelectedSuggestion(null);
  };

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">Call-to-Action</Label>
      
      <Tabs value={isCustom ? "custom" : "suggestions"} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="suggestions" onClick={() => setIsCustom(false)}>
            <Target className="w-4 h-4 mr-2" />
            Suggestions
          </TabsTrigger>
          <TabsTrigger value="custom" onClick={() => setIsCustom(true)}>
            <Edit3 className="w-4 h-4 mr-2" />
            Custom
          </TabsTrigger>
        </TabsList>

        <TabsContent value="suggestions" className="space-y-3">
          {suggestions.length > 0 ? (
            <div className="grid gap-2">
              {suggestions.map((suggestion) => (
                <Card 
                  key={suggestion.id}
                  className={`cursor-pointer transition-all hover:shadow-sm ${
                    selectedSuggestion === suggestion.id 
                      ? 'ring-2 ring-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => handleSuggestionSelect(suggestion)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {suggestion.text}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {suggestion.rationale}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge variant="secondary" className="text-xs">
                          {Math.round(suggestion.confidence * 100)}%
                        </Badge>
                        {selectedSuggestion === suggestion.id && (
                          <Check className="w-4 h-4 text-primary" />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-4 text-center text-muted-foreground">
                <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Select brand and objective to see targeted CTAs</p>
              </CardContent>
            </Card>
          )}
          
          {suggestions.length > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCustomEdit}
              className="w-full"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Write Custom CTA
            </Button>
          )}
        </TabsContent>

        <TabsContent value="custom" className="space-y-3">
          <Input
            value={value}
            onChange={(e) => handleCustomChange(e.target.value)}
            placeholder={placeholder}
          />
          {suggestions.length > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsCustom(false)}
              className="w-full"
            >
              <Target className="w-4 h-4 mr-2" />
              Back to Suggestions
            </Button>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};