import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertTriangle, RefreshCw, Target } from 'lucide-react';
import { ThemeAwareContentService } from '@/services/themeAwareContentService';

export const ThemeValidationWidget = ({
  content,
  brandId,
  assetType,
  globalContext,
  onApplyRecommendation
}) => {
  const [validationResult, setValidationResult] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [themeRecommendations, setThemeRecommendations] = useState(null);

  useEffect(() => {
    validateContent();
  }, [content, brandId, globalContext]);

  const validateContent = async () => {
    if (!content || Object.values(content).every(val => !val)) return;
    
    setIsValidating(true);
    try {
      const contentText = Object.values(content).join(' ');
      
      // Validate theme alignment
      const alignment = await ThemeAwareContentService.validateThemeAlignment(content, {
        brandId,
        assetType,
        globalContext
      });
      
      // Get theme recommendations
      const recommendations = await ThemeAwareContentService.getThemeRecommendations(
        contentText,
        {
          brandId,
          assetType,
          globalContext
        }
      );
      
      setValidationResult(alignment);
      setThemeRecommendations(recommendations);
    } catch (error) {
      console.error('Error validating content:', error);
    } finally {
      setIsValidating(false);
    }
  };

  const getAlignmentStatus = () => {
    if (!validationResult) return { icon: RefreshCw, color: 'text-muted-foreground', text: 'Validating...' };
    
    const score = validationResult.alignmentScore;
    if (score >= 0.8) {
      return { icon: CheckCircle, color: 'text-green-600', text: 'Excellent alignment' };
    } else if (score >= 0.6) {
      return { icon: Target, color: 'text-yellow-600', text: 'Good alignment' };
    } else {
      return { icon: AlertTriangle, color: 'text-red-600', text: 'Needs improvement' };
    }
  };

  const status = getAlignmentStatus();
  const StatusIcon = status.icon;

  if (!validationResult && !isValidating) {
    return null;
  }

  return (
    <Card className="mt-4">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <StatusIcon className={`h-4 w-4 ${status.color}`} />
          Theme Alignment Validation
          <Badge variant="outline" className="ml-auto">
            {validationResult ? `${Math.round(validationResult.alignmentScore * 100)}%` : 'Checking...'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {validationResult && (
          <>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Strategic Alignment</span>
                <span className={status.color}>{status.text}</span>
              </div>
              <Progress value={validationResult.alignmentScore * 100} className="h-2" />
            </div>

            {validationResult.misalignedElements.length > 0 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-1">
                    <p className="font-medium">Theme gaps identified:</p>
                    {validationResult.misalignedElements.slice(0, 2).map((element, index) => (
                      <p key={index} className="text-sm">{element}</p>
                    ))}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {themeRecommendations && (
              <div className="space-y-3">
                {themeRecommendations.suggestions.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Quick Improvements</h4>
                    <div className="space-y-2">
                      {themeRecommendations.suggestions.slice(0, 3).map((suggestion, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span className="flex-1">{suggestion}</span>
                          {onApplyRecommendation && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onApplyRecommendation(suggestion)}
                              className="ml-2"
                            >
                              Apply
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {themeRecommendations.optimizations.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Strategic Enhancements</h4>
                    <div className="space-y-1">
                      {themeRecommendations.optimizations.slice(0, 2).map((optimization, index) => (
                        <p key={index} className="text-xs text-muted-foreground">
                          • {optimization}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <Button
              size="sm"
              variant="ghost"
              onClick={validateContent}
              disabled={isValidating}
              className="w-full"
            >
              <RefreshCw className={`h-3 w-3 mr-2 ${isValidating ? 'animate-spin' : ''}`} />
              {isValidating ? 'Validating...' : 'Re-validate'}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};