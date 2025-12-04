
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';

import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Zap,
  Brain,
  FileText,
  RefreshCw,
} from 'lucide-react';

import { SmartTMIntelligenceService } from '@/services/SmartTMIntelligenceService';
import { toast } from 'sonner';

export const RealTimeTerminologyValidator = ({
  brandId,
  targetLanguage,
  assetContext,
  onValidationComplete,
}) => {
  const [inputText, setInputText] = useState('');
  const [validationResults, setValidationResults] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [validationHistory, setValidationHistory] = useState([]);

  const performValidation = async (text) => {
    if (!text.trim() || text.length < 3) {
      setValidationResults(null);
      return;
    }
    setIsValidating(true);
    try {
      const results = await SmartTMIntelligenceService.validateTerminologyRealTime(
        text,
        brandId,
        targetLanguage,
        assetContext
      );
      setValidationResults(results);
      onValidationComplete?.(results);

      // Add to validation history (keep max 5 records)
      setValidationHistory((prev) => [
        {
          text: text.substring(0, 50) + (text.length > 50 ? '...' : ''),
          score: results.brandConsistencyScore,
          timestamp: new Date().toLocaleTimeString(),
          isValid: results.isValid,
        },
        ...prev.slice(0, 4),
      ]);
    } catch (error) {
      console.error('Validation error:', error);
      toast.error('Validation failed');
    } finally {
      setIsValidating(false);
    }
  };

  // Debounced validation
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputText.trim()) {
        performValidation(inputText);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [inputText, brandId, targetLanguage]);

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeVariant = (score) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  const applySuggestion = (suggestion) => {
    setInputText(suggestion);
    toast.success('Suggestion applied');
  };

  const generateSmartContent = async () => {
    setIsValidating(true);
    try {
      // Simulate smart content generation
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const smartContent = `Experience our clinically proven ${assetContext?.assetType || 'solution'} that has helped thousands of patients achieve better health outcomes. Consult with your healthcare provider to see if this treatment is right for you.`;
      setInputText(smartContent);
      toast.success('Smart content generated');
    } catch (error) {
      toast.error('Content generation failed');
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Real-Time Terminology Validator
          </h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={generateSmartContent}
              disabled={isValidating}
            >
              <Zap className="h-4 w-4 mr-2" />
              Generate Smart Content
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => performValidation(inputText)}
              disabled={isValidating || !inputText.trim()}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isValidating ? 'animate-spin' : ''}`} />
              Re-validate
            </Button>
          </div>
        </div>

        {/* Input Area */}
        <div className="space-y-3">
          <label className="text-sm font-medium">
            Type or paste your content to validate against brand guidelines:
          </label>
          <Textarea
            placeholder="Enter your content here for real-time brand consistency validation..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="min-h-[120px]"
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{inputText.length} characters</span>
            {isValidating && (
              <span className="flex items-center gap-1">
                <RefreshCw className="h-3 w-3 animate-spin" />
                Validating...
              </span>
            )}
          </div>
        </div>

        {/* Validation Results */}
        {validationResults && (
          <div className="space-y-4">
            {/* Overall Score */}
            <Card className="p-4 bg-muted/50">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">Brand Consistency Score</h4>
                <Badge variant={getScoreBadgeVariant(validationResults.brandConsistencyScore)}>
                  {validationResults.brandConsistencyScore}%
                </Badge>
              </div>
              <Progress value={validationResults.brandConsistencyScore} className="mb-2" />
              <div className="flex items-center gap-2">
                {validationResults.isValid ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                <span className={`text-sm ${getScoreColor(validationResults.brandConsistencyScore)}`}>
                  {validationResults.isValid ? 'Content passes validation' : 'Content needs improvement'}
                </span>
              </div>
            </Card>

            {/* Suggestions */}
            {Array.isArray(validationResults.suggestions) && validationResults.suggestions.length > 0 && (
              <Card className="p-4">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Smart Suggestions
                </h4>
                <div className="space-y-2">
                  {validationResults.suggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                      <span className="text-sm flex-1">{suggestion}</span>
                      <Button variant="outline" size="sm" onClick={() => applySuggestion(suggestion)}>
                        Apply
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Regulatory Issues */}
            {Array.isArray(validationResults.regulatoryIssues) && validationResults.regulatoryIssues.length > 0 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Regulatory Concerns:</strong>
                  <ul className="mt-1 ml-4">
                    {validationResults.regulatoryIssues.map((issue, index) => (
                      <li key={index} className="text-sm">• {issue.description || issue}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Cultural Concerns */}
            {Array.isArray(validationResults.culturalConcerns) && validationResults.culturalConcerns.length > 0 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Cultural Sensitivity:</strong>
                  <ul className="mt-1 ml-4">
                    {validationResults.culturalConcerns.map((concern, index) => (
                      <li key={index} className="text-sm">• {concern.description || concern}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {/* Validation History */}
        {validationHistory.length > 0 && (
          <Card className="p-4">
            <h4 className="font-medium mb-3">Recent Validations</h4>
            <div className="space-y-2">
              {validationHistory.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="flex-1 truncate">{item.text}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant={getScoreBadgeVariant(item.score)} className="text-xs">
                      {item.score}%
                    </Badge>
                    <span className="text-xs text-muted-foreground">{item.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </Card>
  );
};

RealTimeTerminologyValidator.propTypes = {
  brandId: PropTypes.string.isRequired,
  targetLanguage: PropTypes.string.isRequired,
  assetContext: PropTypes.object.isRequired,
  onValidationComplete: PropTypes.func,
};
