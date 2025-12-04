import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Palette, Target, MessageSquare, RotateCcw } from 'lucide-react';

export const ThemeContextPanel = ({
  themeData,
  intakeContext,
  onResetToTheme,
  isResetting = false
}) => {
  if (!themeData && !intakeContext) {
    return null;
  }

  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Palette className="h-4 w-4" />
          Theme Context
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {themeData && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Selected Theme</h4>
              {onResetToTheme && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={onResetToTheme}
                  disabled={isResetting}
                >
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Reset to Theme
                </Button>
              )}
            </div>
            
            <div className="p-3 bg-muted/50 rounded-md space-y-2">
              {themeData.asset_name && (
                <h5 className="text-sm font-medium">
                  Asset: {themeData.asset_name}
                </h5>
              )}
              {(themeData.theme_name || themeData.name) && (
                <p className="text-xs text-muted-foreground">
                  <strong>Based on Theme:</strong> {themeData.theme_name || themeData.name}
                </p>
              )}
              {(themeData.core_message || themeData.keyMessage) && (
                <p className="text-xs text-muted-foreground">
                  <strong>Core Message:</strong> {themeData.core_message || themeData.keyMessage}
                </p>
              )}
              {(themeData.primary_benefit || themeData.description) && (
                <p className="text-xs text-muted-foreground">
                  <strong>Focus:</strong> {themeData.primary_benefit || themeData.description}
                </p>
              )}
              {(themeData.target_audience || themeData.targetAudience) && (
                <p className="text-xs text-muted-foreground">
                  <strong>Target Audience:</strong> {themeData.target_audience || themeData.targetAudience}
                </p>
              )}
              {(themeData.callToAction) && (
                <p className="text-xs text-muted-foreground">
                  <strong>Call to Action:</strong> {themeData.callToAction}
                </p>
              )}
            </div>

            {/* Show key messages from either format */}
            {((themeData.messaging_framework?.key_messages?.length > 0) || 
              (themeData.contentSuggestions?.keyPoints?.length > 0) ||
              (themeData.contentSuggestions?.headlines?.length > 0)) && (
              <div>
                <h5 className="text-xs font-medium mb-2 flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  Key Points
                </h5>
                <div className="space-y-1">
                  {/* Show messaging framework key messages */}
                  {themeData.messaging_framework?.key_messages?.slice(0, 3).map((message, index) => (
                    <p key={`msg-${index}`} className="text-xs text-muted-foreground px-2 py-1 bg-background rounded border">
                      {message}
                    </p>
                  ))}
                  
                  {/* Show content suggestions key points */}
                  {themeData.contentSuggestions?.keyPoints?.slice(0, 3).map((point, index) => (
                    <p key={`point-${index}`} className="text-xs text-muted-foreground px-2 py-1 bg-background rounded border">
                      {point}
                    </p>
                  ))}
                  
                  {/* Show content suggestions headlines if no key points */}
                  {!themeData.contentSuggestions?.keyPoints?.length && 
                   themeData.contentSuggestions?.headlines?.slice(0, 2).map((headline, index) => (
                    <p key={`headline-${index}`} className="text-xs text-muted-foreground px-2 py-1 bg-background rounded border italic">
                      {headline}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {intakeContext && themeData && <Separator />}

        {intakeContext && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium flex items-center gap-1">
              <Target className="h-3 w-3" />
              Original Intake
            </h4>
            
            <div className="space-y-2">
              {intakeContext.original_key_message && (
                <div className="text-xs">
                  <span className="font-medium">Key Message:</span>
                  <p className="text-muted-foreground mt-1">{intakeContext.original_key_message}</p>
                </div>
              )}
              
              {intakeContext.original_cta && (
                <div className="text-xs">
                  <span className="font-medium">Call to Action:</span>
                  <p className="text-muted-foreground mt-1">{intakeContext.original_cta}</p>
                </div>
              )}
              
              {intakeContext.intake_objective && (
                <div className="text-xs">
                  <span className="font-medium">Objective:</span>
                  <p className="text-muted-foreground mt-1">{intakeContext.intake_objective}</p>
                </div>
              )}

              {intakeContext.target_audience && (
                <div className="text-xs">
                  <span className="font-medium">Audience:</span>
                  <Badge variant="secondary" className="text-xs">
                    {intakeContext.target_audience}
                  </Badge>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};