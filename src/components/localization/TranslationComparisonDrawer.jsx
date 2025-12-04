import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Sparkles, Database, CheckCircle2, Clock, AlertTriangle } from "lucide-react";

const getMatchQualityInfo = (matchPercentage) => {
  if (matchPercentage >= 95) {
    return {
      color: "bg-green-600",
      icon: "✅",
      message: "Excellent Match",
      recommendation: "Recommended to Use",
      variant: "default"
    };
  } else if (matchPercentage >= 70) {
    return {
      color: "bg-yellow-600",
      icon: "⚠️",
      message: "Good Match",
      recommendation: "Review and Edit Recommended",
      variant: "secondary"
    };
  } else if (matchPercentage >= 50) {
    return {
      color: "bg-orange-600",
      icon: "⚡",
      message: "Fair Match",
      recommendation: "Consider AI Translation for Comparison",
      variant: "secondary"
    };
  } else {
    return {
      color: "bg-red-600",
      icon: "❌",
      message: "Low Match",
      recommendation: "AI Translation Strongly Recommended",
      variant: "destructive"
    };
  }
};

export const TranslationComparisonDrawer = ({
  open,
  onOpenChange,
  tmResult,
  aiResult,
  onUseTM,
  onUseAI,
  onRunAI,
  sourceText,
  isLoadingAI,
  sectionTitle,
  workflowStatus
}) => {
  const hasResults = tmResult || aiResult;
  const matchQuality = tmResult ? getMatchQualityInfo(tmResult.matchPercentage) : null;
  const shouldSuggestAI = tmResult && tmResult.matchPercentage < 70 && !aiResult;

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="left">
      <DrawerContent className="h-full w-[32%] ml-0 rounded-none">
        <DrawerHeader>
          <DrawerTitle className="flex items-center gap-2">
            🔍 Translation Comparison
            {sectionTitle && <span className="text-sm text-muted-foreground">- {sectionTitle}</span>}
          </DrawerTitle>
          <DrawerDescription>
            Compare translation memory matches with AI-generated translations
          </DrawerDescription>

          {/* Workflow Status Indicator */}
          {workflowStatus && (
            <div className="flex items-center gap-4 mt-4 text-sm">
              <div className="flex items-center gap-2">
                {workflowStatus.tmComplete ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <Clock className="h-4 w-4 text-muted-foreground" />
                )}
                <span className={workflowStatus.tmComplete ? "text-green-600 font-medium" : "text-muted-foreground"}>
                  Step 1: TM Search
                </span>
              </div>
              <div className="flex items-center gap-2">
                {workflowStatus.aiComplete ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : shouldSuggestAI ? (
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                ) : (
                  <Clock className="h-4 w-4 text-muted-foreground" />
                )}
                <span className={workflowStatus.aiComplete ? "text-green-600 font-medium" : shouldSuggestAI ? "text-orange-600 font-medium" : "text-muted-foreground"}>
                  Step 2: AI Translate
                </span>
              </div>
              <div className="flex items-center gap-2">
                {workflowStatus.selectionMade ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <Clock className="h-4 w-4 text-muted-foreground" />
                )}
                <span className={workflowStatus.selectionMade ? "text-green-600 font-medium" : "text-muted-foreground"}>
                  Step 3: Select Translation
                </span>
              </div>
            </div>
          )}
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {!hasResults && (
            <Card className="border-dashed">
              <CardContent className="pt-6 text-center text-muted-foreground">
                No translation results yet. Click "TM Search" or "AI Translate" to see results here.
              </CardContent>
            </Card>
          )}

          {/* Smart Workflow Helper - Suggest AI when TM match is low */}
          {shouldSuggestAI && onRunAI && sourceText && (
            <Alert className="border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="space-y-3">
                <div>
                  <p className="font-medium text-orange-900">Low TM match detected ({tmResult.matchPercentage}%)</p>
                  <p className="text-sm text-orange-700 mt-1">
                    Would you like to run AI Translation for comparison?
                  </p>
                </div>
                <Button 
                  onClick={onRunAI}
                  disabled={isLoadingAI}
                  className="w-full"
                  variant="default"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  {isLoadingAI ? "Generating..." : "🤖 Run AI Translate"}
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Translation Memory Result */}
          {tmResult && (
            <Card className="border-blue-200 bg-blue-50/50">
              <CardHeader>
                <CardTitle className="text-base flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    📚 Translation Memory Result
                  </span>
                  <Badge variant="secondary" className="bg-blue-600 text-white">
                    Match: {tmResult.matchPercentage}%
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Quality Recommendation Banner */}
                {matchQuality && (
                  <Alert className="border-l-4" style={{ borderLeftColor: matchQuality.color.replace('bg-', '') }}>
                    <AlertDescription>
                      <div className="flex items-start gap-2">
                        <span className="text-lg">{matchQuality.icon}</span>
                        <div>
                          <p className="font-semibold text-sm">{matchQuality.message}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {matchQuality.recommendation}
                          </p>
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
                
                <div className="bg-white p-3 rounded-md border">
                  <p className="text-sm whitespace-pre-wrap">{tmResult.translation}</p>
                </div>
                {tmResult.source && (
                  <p className="text-xs text-muted-foreground">Source: {tmResult.source}</p>
                )}
                {onUseTM && (
                  <Button 
                    onClick={onUseTM}
                    className="w-full"
                    variant="default"
                  >
                    ✅ Use This Translation
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* AI Translation Result */}
          {aiResult && (
            <Card className="border-purple-200 bg-purple-50/50">
              <CardHeader>
                <CardTitle className="text-base flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    🤖 AI Translation Result
                  </span>
                  <Badge variant="secondary" className="bg-purple-600 text-white">
                    AI Generated
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-white p-3 rounded-md border">
                  <p className="text-sm whitespace-pre-wrap">{aiResult.translation}</p>
                </div>
                {onUseAI && (
                  <Button 
                    onClick={onUseAI}
                    className="w-full"
                    variant="default"
                  >
                    ✅ Use This Translation
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};