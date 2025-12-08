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
  AlertTriangle,
  AlertCircle,
  Info,
  ShieldAlert,
  FileText,
  Clock,
  Link2,
  Tag,
} from "lucide-react";
// Type import removed
// import { SafetyStatement } from "@/hooks/useEvidenceLibrary";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

// Interface and type annotations removed
export const SafetyStatementDetailsModal = ({
  statement,
  isOpen,
  onClose,
}) => {
  const { toast } = useToast();

  if (!statement) return null;

  // Type annotation removed
  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical':
        return <ShieldAlert className="h-5 w-5 text-red-600" />;
      case 'high':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 'moderate':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case 'low':
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  // Type annotation removed
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500/10 text-red-700 border-red-500/20';
      case 'high':
        return 'bg-orange-500/10 text-orange-700 border-orange-500/20';
      case 'moderate':
        return 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20';
      case 'low':
        return 'bg-blue-500/10 text-blue-700 border-blue-500/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(statement.statement_text);
    toast({
      title: "Copied to clipboard",
      description: "Safety statement text has been copied.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5" />
            Safety Statement Details
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[75vh]">
          <div className="space-y-6 pr-4">
            {/* Statement Overview */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        {getSeverityIcon(statement.severity)}
                        <Badge
                          variant="outline"
                          className={getSeverityColor(statement.severity)}
                        >
                          {statement.severity.toUpperCase()}
                        </Badge>
                        <Badge variant="outline">{statement.statement_type}</Badge>
                        {statement.fda_required && (
                          <Badge variant="secondary">FDA Required</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {statement.statement_text}
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

                  {/* Additional Context */}
                  {statement.required_context && (
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-xs font-medium text-muted-foreground mb-1">
                        Required Context
                      </p>
                      <p className="text-sm">{statement.required_context}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Placement & Usage Rules */}
            <Card>
              <CardContent className="p-4">
                <h3 className="text-sm font-semibold mb-3">
                  Placement & Usage Rules
                </h3>
                <div className="grid gap-4">
                  {statement.placement_rule && (
                    <div>
                      <span className="text-xs text-muted-foreground">
                        Placement Rule:
                      </span>
                      <p className="text-sm font-medium">{statement.placement_rule}</p>
                    </div>
                  )}
                  {statement.applicable_channels &&
                    statement.applicable_channels.length > 0 && (
                      <div>
                        <span className="text-xs text-muted-foreground mb-2 block">
                          Applicable Channels:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {statement.applicable_channels.map((channel, i) => (
                            <Badge key={i} variant="secondary">
                              {channel}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              </CardContent>
            </Card>

            {/* Source Information */}
            <Card>
              <CardContent className="p-4">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Source Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {statement.source_section && (
                    <div>
                      <span className="text-muted-foreground">Source Section:</span>
                      <p className="font-medium">{statement.source_section}</p>
                    </div>
                  )}
                  {statement.source_page && (
                    <div>
                      <span className="text-muted-foreground">Source Page:</span>
                      <p className="font-medium">Page {statement.source_page}</p>
                    </div>
                  )}
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Document ID:</span>
                    <p className="font-medium font-mono text-xs">
                      {statement.source_document_id}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Linked Claims */}
            {statement.linked_claims && statement.linked_claims.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Link2 className="h-4 w-4" />
                    Related Claims
                  </h3>
                  <p className="text-xs text-muted-foreground mb-2">
                    Claims that require this safety statement
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {statement.linked_claims.map((claimId, i) => (
                      <Badge key={i} variant="outline" className="font-mono text-xs">
                        {claimId.substring(0, 8)}
                      </Badge>
                    ))}
                  </div>
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
                <div className="text-sm">
                  <span className="text-muted-foreground">Extracted:</span>
                  <p className="font-medium">
                    {format(new Date(statement.created_at), 'MMM d, yyyy h:mm a')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};