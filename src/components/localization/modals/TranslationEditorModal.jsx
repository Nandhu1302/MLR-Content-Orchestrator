import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Removed all interface declarations

export const TranslationEditorModal = ({ // Removed : React.FC<TranslationEditorModalProps>
  isOpen,
  onClose,
  segmentName,
  originalText,
  translationText,
  onSave,
  aiSummary,
  quickSuggestions = [],
}) => {
  const [editedText, setEditedText] = useState(translationText);
  const [charCount, setCharCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    setEditedText(translationText);
    setCharCount(translationText.length);
  }, [translationText]);

  // Removed (e: React.ChangeEvent<HTMLTextAreaElement>) type annotation
  const handleTextChange = (e) => {
    const newText = e.target.value;
    setEditedText(newText);
    setCharCount(newText.length);
  };

  const handleSave = () => {
    if (!editedText.trim()) {
      toast({
        title: "Translation cannot be empty",
        variant: "destructive",
      });
      return;
    }
    onSave(editedText);
    toast({
      title: "Translation saved",
      description: "Your changes have been saved successfully.",
    });
    onClose();
  };

  // Removed (original: string, suggested: string) type annotation
  const applySuggestion = (original, suggested) => {
    const newText = editedText.replace(original, suggested);
    setEditedText(newText);
    setCharCount(newText.length);
    toast({
      title: "Suggestion applied",
      description: `Changed "${original}" to "${suggested}"`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            ✏️ Edit Translation - {segmentName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 overflow-y-auto max-h-[calc(85vh-120px)]">
          {/* AI Analysis Summary */}
          {aiSummary && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-4">
                <p className="text-sm font-medium text-blue-900 mb-2">📌 AI Analysis Summary</p>
                <div className="flex flex-wrap gap-3 text-sm">
                  {aiSummary.highPriority > 0 && (
                    <div className="flex items-center gap-1">
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      <span>{aiSummary.highPriority} high priority issue{aiSummary.highPriority > 1 ? 's' : ''}</span>
                    </div>
                  )}
                  {aiSummary.mediumPriority > 0 && (
                    <div className="flex items-center gap-1">
                      <Info className="h-4 w-4 text-yellow-500" />
                      <span>{aiSummary.mediumPriority} medium priority issue{aiSummary.mediumPriority > 1 ? 's' : ''}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Terminology: {aiSummary.terminologyStatus}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Original Text */}
          <div>
            <label className="text-sm font-medium mb-2 block">Original (EN):</label>
            <Card>
              <CardContent className="pt-4">
                <p className="text-sm">{originalText}</p>
              </CardContent>
            </Card>
          </div>

          {/* Translation Editor */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Your Translation:</label>
              <span className="text-xs text-muted-foreground">
                Character count: {charCount}/500
              </span>
            </div>
            <Textarea
              value={editedText}
              onChange={handleTextChange}
              className="min-h-[150px] font-medium"
              placeholder="Enter your translation here..."
              maxLength={500}
            />
          </div>

          {/* Quick Suggestions */}
          {quickSuggestions.length > 0 && (
            <Card>
              <CardContent className="pt-4">
                <p className="text-sm font-medium mb-3">💡 Quick Suggestions:</p>
                <div className="space-y-2">
                  {quickSuggestions.map((suggestion, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                      <div className="flex-1 text-sm">
                        <span className="text-muted-foreground">"{suggestion.original}"</span>
                        <span className="mx-2">→</span>
                        <span className="font-medium">"{suggestion.suggested}"</span>
                      </div>
                      {suggestion.applied ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          ✓ Applied
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => applySuggestion(suggestion.original, suggestion.suggested)}
                        >
                          Apply
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex gap-2 justify-between pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save & Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}; // FIX: Added closing curly brace