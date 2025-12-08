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
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export const ContentSegmentDetailsModal = ({
  segment,
  isOpen,
  onClose,
}) => {
  const { toast } = useToast();

  if (!segment) return null;

  const handleCopyText = () => {
    navigator.clipboard.writeText(segment.segment_text);
    toast({
      title: "Copied to clipboard",
      description: "Segment text has been copied.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Content Segment Details
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[75vh]">
          <div className="space-y-6 pr-4">
            {/* Segment Overview */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{segment.segment_type}</Badge>
                        {segment.mlr_approved && (
                          <Badge variant="default" className="bg-green-600">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            MLR Approved
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {segment.segment_text}
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

                  {/* Metadata Grid */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {segment.word_count && (
                      <div>
                        <span className="text-muted-foreground">Word Count:</span>
                        <p className="font-medium">{segment.word_count}</p>
                      </div>
                    )}
                    {segment.segment_category && (
                      <div>
                        <span className="text-muted-foreground">Category:</span>
                        <p className="font-medium">{segment.segment_category}</p>
                      </div>
                    )}
                    {segment.source_section && (
                      <div>
                        <span className="text-muted-foreground">Source Section:</span>
                        <p className="font-medium">{segment.source_section}</p>
                      </div>
                    )}
                    {segment.source_page && (
                      <div>
                        <span className="text-muted-foreground">Source Page:</span>
                        <p className="font-medium">Page {segment.source_page}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Applicable Asset Types */}
            {segment.applicable_asset_types && segment.applicable_asset_types.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Applicable Asset Types
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {segment.applicable_asset_types.map((type, i) => (
                      <Badge key={i} variant="secondary">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Linked Claims */}
            {segment.linked_claims && segment.linked_claims.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Link2 className="h-4 w-4" />
                    Linked Claims
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {segment.linked_claims.map((claimId, i) => (
                      <Badge key={i} variant="outline" className="font-mono text-xs">
                        {claimId.substring(0, 8)}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Linked References */}
            {segment.linked_references && segment.linked_references.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Linked References
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {segment.linked_references.map((refId, i) => (
                      <Badge key={i} variant="outline" className="font-mono text-xs">
                        {refId.substring(0, 8)}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* MLR Approval Information */}
            {segment.mlr_approved && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    MLR Approval Status
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    This content segment has been approved for use.
                  </p>
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
                  <span className="text-muted-foreground">Created:</span>
                  <p className="font-medium">
                    {format(new Date(segment.created_at), 'MMM d, yyyy h:mm a')}
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