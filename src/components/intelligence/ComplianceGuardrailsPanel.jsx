
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { EnhancedGuardrailsService } from "@/services/EnhancedGuardrailsService";

function ComplianceGuardrailsPanel({ brandId, filters }) {
  const { data: requirements, isLoading } = useQuery({
    queryKey: ['compliance-requirements', brandId, filters],
    queryFn: () => EnhancedGuardrailsService.getComplianceRequirements(brandId, filters),
    enabled: Boolean(brandId),
  });

  if (isLoading) {
    return (
      <Card className="p-6 animate-pulse">
        <div className="h-6 bg-muted rounded mb-4"></div>
        <div className="space-y-3">
          <div className="h-16 bg-muted rounded"></div>
          <div className="h-16 bg-muted rounded"></div>
        </div>
      </Card>
    );
  }

  if (!requirements) return null;

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <ShieldCheck className="h-5 w-5 text-green-500" />
        <h3 className="font-semibold">Compliance Checklist</h3>
      </div>

      <div className="space-y-4">
        {requirements.mustInclude.length > 0 && (
          <div>
            <div className="text-sm font-medium mb-2 flex items-center gap-2 text-green-600">
              <CheckCircle2 className="h-4 w-4" />
              Must Include
            </div>
            <div className="space-y-2">
              {requirements.mustInclude.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 p-2 bg-green-50 dark:bg-green-950/20 rounded">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">{item}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {requirements.cannotSay.length > 0 && (
          <div>
            <div className="text-sm font-medium mb-2 flex items-center gap-2 text-red-600">
              <XCircle className="h-4 w-4" />
              Cannot Say
            </div>
            <div className="space-y-2">
              {requirements.cannotSay.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 p-2 bg-red-50 dark:bg-red-950/20 rounded">
                  <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">{item}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {requirements.regulatoryWarnings.length > 0 && (
          <div>
            <div className="text-sm font-medium mb-2 flex items-center gap-2 text-amber-600">
              <AlertTriangle className="h-4 w-4" />
              Regulatory Notes
            </div>
            <div className="space-y-2">
              {requirements.regulatoryWarnings.map((warning, idx) => (
                <div key={idx} className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg">
                  <div className="text-sm">{warning.warning}</div>
                  {warning.region && (
                    <Badge variant="outline" className="mt-2 text-xs">
                      {warning.region}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

// ✅ Explicit export
export {ComplianceGuardrailsPanel};
