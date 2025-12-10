
import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Shield } from "lucide-react";

const RegulatoryCompliancePanel = ({
  content,
  assetType = "Email",
  region = "US",
  brandProfile,
  therapeuticArea,
  onValidationUpdate,
}) => {
  const [complianceChecks, setComplianceChecks] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    analyzeCompliance();
  }, [content]);

  const analyzeCompliance = async () => {
    if (!content.trim()) return;

    setIsAnalyzing(true);
    try {
      const { data } = await supabase.functions.invoke("analyze-regulatory", {
        body: {
          content,
          brandId: brandProfile?.brand_name,
          therapeuticArea,
          assetType,
          region,
          brandProfile,
        },
      });

      const checks = (data?.checks || []).map((c, i) => ({
        id: `comp_${i}`,
        category: c.category,
        title: c.requirement,
        status: c.status,
        required: c.severity === "critical",
        suggestion: c.recommendation,
      }));

      setComplianceChecks(checks);
      onValidationUpdate({
        passed: checks.filter((c) => c.status === "passed").length,
        failed: checks.filter((c) => c.status === "failed").length,
      });
    } catch (error) {
      console.error("Regulatory analysis error:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "passed":
        return "default";
      case "warning":
        return "secondary";
      case "failed":
        return "destructive";
      default:
        return "outline";
    }
  };

  const groupedChecks = complianceChecks.reduce((acc, check) => {
    if (!acc[check.category]) acc[check.category] = [];
    acc[check.category].push(check);
    return acc;
  }, {});

  const passedCount = complianceChecks.filter((c) => c.status === "passed").length;
  const warningCount = complianceChecks.filter((c) => c.status === "warning").length;
  const failedCount = complianceChecks.filter((c) => c.status === "failed").length;
  const complianceScore =
    complianceChecks.length > 0
      ? Math.round((passedCount / complianceChecks.length) * 100)
      : 0;

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Regulatory Compliance
          </h3>
          {isAnalyzing && <Badge variant="outline" className="text-xs">Analyzing...</Badge>}
        </div>

        {complianceChecks.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="default" className="text-xs">{passedCount} Passed</Badge>
            {warningCount > 0 && <Badge variant="secondary" className="text-xs">{warningCount} Warnings</Badge>}
            {failedCount > 0 && <Badge variant="destructive" className="text-xs">{failedCount} Failed</Badge>}
            <span className="ml-auto font-medium">Score: {complianceScore}%</span>
          </div>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {complianceChecks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Shield className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No content to analyze yet</p>
            </div>
          ) : (
            Object.entries(groupedChecks).map(([category, checks]) => (
              <div key={category} className="space-y-2">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {category}
                </h4>
                {checks.map((check) => (
                  <div key={check.id} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{check.title}</p>
                        {check.required && (
                          <Badge variant="outline" className="text-xs mt-1">Required</Badge>
                        )}
                      </div>
                      <Badge variant={getStatusColor(check.status)} className="text-xs">
                        {check.status}
                      </Badge>
                    </div>

                    {check.suggestion && check.status !== "passed" && (
                      <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                        <span className="font-medium">Recommendation:</span> {check.suggestion}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export {RegulatoryCompliancePanel};
