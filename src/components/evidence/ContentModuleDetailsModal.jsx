import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import {
  Copy,
  FileText,
  CheckCircle2,
  Clock,
  Tag,
  Link2,
  TrendingUp,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export const ContentModuleDetailsModal = ({
  module,
  isOpen,
  onClose,
}) => {
  const { toast } = useToast();

  if (!module) return null;

  const handleCopyText = () => {
    navigator.clipboard.writeText(module.module_text);
    toast({
      title: "Copied to clipboard",
      description: "Module text has been copied.",
    });
  };

  const getModuleTypeColor = (type) => {
    const typeMap = {
      headline: 'bg-purple-500/10 text-purple-700 border-purple-500/20',
      efficacy: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
      safety: 'bg-red-500/10 text-red-700 border-red-500/20',
      mechanism: 'bg-green-500/10 text-green-700 border-green-500/20',
      dosing: 'bg-orange-500/10 text-orange-700 border-orange-500/20',
    };
    return typeMap[type] || 'bg-muted';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Content Module Details
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[75vh]">
          <div className="space-y-6 pr-4">
            {/* Module Overview */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <Badge
                          variant="outline"
                          className={getModuleTypeColor(module.module_type)}
                        >
                          {module.module_type}
                        </Badge>
                        {module.length_variant && (
                          <Badge variant="secondary">{module.length_variant}</Badge>
                        )}
                        {module.tone_variant && (
                          <Badge variant="outline">{module.tone_variant}</Badge>
                        )}
                        {module.mlr_approved && (
                          <Badge variant="default" className="bg-green-600">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            MLR Approved
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {module.module_text}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCopyText}
                      className="shrink-0"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </div>

                  <Separator />

                  {/* Module Metrics */}
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Character Count:</span>
                      <p className="font-medium">{module.module_text.length}</p>
                    </div>
                    {module.character_limit_max && (
                      <div>
                        <span className="text-muted-foreground">Max Character Limit:</span>
                        <p className="font-medium">{module.character_limit_max}</p>
                      </div>
                    )}
                    {module.usage_score !== null && (
                      <div>
                        <span className="text-muted-foreground">Usage Score:</span>
                        <p className="font-medium flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          {module.usage_score.toFixed(1)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* MLR Approval Information */}
            {module.mlr_approved && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    MLR Approval Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {module.approval_date && (
                      <div>
                        <span className="text-muted-foreground">Approval Date:</span>
                        <p className="font-medium">
                          {format(new Date(module.approval_date), 'MMM d, yyyy')}
                        </p>
                      </div>
                    )}
                    {module.expiration_date && (
                      <div>
                        <span className="text-muted-foreground">Expiration Date:</span>
                        <p className="font-medium text-orange-600">
                          {format(new Date(module.expiration_date), 'MMM d, yyyy')}
                        </p>
                      </div>
                    )}
                    {module.mlr_approved_at && (
                      <div>
                        <span className="text-muted-foreground">Approved On:</span>
                        <p className="font-medium">
                          {format(new Date(module.mlr_approved_at), 'MMM d, yyyy')}
                        </p>
                      </div>
                    )}
                    {module.mlr_approved_by && (
                      <div>
                        <span className="text-muted-foreground">Approved By:</span>
                        <p className="font-medium font-mono text-xs">
                          {module.mlr_approved_by.substring(0, 8)}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Linked Claims */}
            {module.linked_claims && module.linked_claims.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Link2 className="h-4 w-4" />
                    Linked Claims ({module.linked_claims.length})
                  </h3>
                  <p className="text-xs text-muted-foreground mb-2">
                    Supporting clinical claims for this module
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {module.linked_claims.map((claimId, i) => (
                      <Badge key={i} variant="outline" className="font-mono text-xs">
                        {claimId.substring(0, 8)}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Linked References */}
            {module.linked_references && module.linked_references.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Linked References ({module.linked_references.length})
                  </h3>
                  <p className="text-xs text-muted-foreground mb-2">
                    Citations supporting this module
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {module.linked_references.map((refId, i) => (
                      <Badge key={i} variant="outline" className="font-mono text-xs">
                        {refId.substring(0, 8)}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Required Safety Statements */}
            {module.required_safety_statements &&
              module.required_safety_statements.length > 0 && (
                <Card>
                  <CardContent className="p-4">
                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <Tag className="h-4 w-4 text-orange-600" />
                      Required Safety Statements ({module.required_safety_statements.length})
                    </h3>
                    <p className="text-xs text-muted-foreground mb-2">
                      Safety statements that must accompany this module
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {module.required_safety_statements.map((statementId, i) => (
                        <Badge key={i} variant="outline" className="font-mono text-xs">
                          {statementId.substring(0, 8)}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

            {/* Module Relationships */}
            {((module.approved_combinations && module.approved_combinations.length > 0) ||
              (module.contraindicated_modules &&
                module.contraindicated_modules.length > 0)) && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-sm font-semibold mb-3">Module Relationships</h3>
                  <div className="space-y-4">
                    {module.approved_combinations &&
                      module.approved_combinations.length > 0 && (
                        <div>
                          <span className="text-xs text-muted-foreground mb-2 block">
                            Approved Combinations:
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {module.approved_combinations.map((moduleId, i) => (
                              <Badge key={i} variant="secondary" className="font-mono text-xs">
                                {moduleId.substring(0, 8)}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    {module.contraindicated_modules &&
                      module.contraindicated_modules.length > 0 && (
                        <div>
                          <span className="text-xs text-muted-foreground mb-2 block">
                            Contraindicated Modules:
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {module.contraindicated_modules.map((moduleId, i) => (
                              <Badge
                                key={i}
                                variant="destructive"
                                className="font-mono text-xs"
                              >
                                {moduleId.substring(0, 8)}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Channel Adaptations */}
            {module.channel_adaptations && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Channel Adaptations
                  </h3>
                  <pre className="text-xs bg-muted p-3 rounded-lg overflow-x-auto">
                    {JSON.stringify(module.channel_adaptations, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            )}

            {/* Timestamps */}
            <Card>
              <CardContent className="p-4">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Tracking Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {module.created_at && (
                    <div>
                      <span className="text-muted-foreground">Created:</span>
                      <p className="font-medium">
                        {format(new Date(module.created_at), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                  )}
                  {module.updated_at && (
                    <div>
                      <span className="text-muted-foreground">Last Updated:</span>
                      <p className="font-medium">
                        {format(new Date(module.updated_at), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};