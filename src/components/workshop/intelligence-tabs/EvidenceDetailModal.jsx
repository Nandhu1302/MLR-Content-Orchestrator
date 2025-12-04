import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Check, TrendingUp, Users, BarChart3 } from "lucide-react";

export const EvidenceDetailModal = ({ open, onOpenChange, evidenceItem, type }) => {
  if (!evidenceItem) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {type === 'claim' && evidenceItem.claim_id_display && (
              <Badge variant="secondary">{evidenceItem.claim_id_display}</Badge>
            )}
            {type === 'visual' && evidenceItem.asset_id && (
              <Badge variant="secondary">{evidenceItem.asset_id}</Badge>
            )}
            {type === 'module' && (
              <Badge variant="secondary">Module</Badge>
            )}
            <span className="text-lg">Evidence Details</span>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="audience">Audience</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-2">Full Text</h4>
              <p className="text-sm text-muted-foreground">
                {type === 'claim' && evidenceItem.claim_text}
                {type === 'module' && evidenceItem.module_text}
                {type === 'visual' && evidenceItem.visual_description}
              </p>
            </Card>

            {type === 'claim' && evidenceItem.linked_references && evidenceItem.linked_references.length > 0 && (
              <Card className="p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  Supporting References ({evidenceItem.linked_references.length})
                </h4>
                <div className="space-y-2">
                  {evidenceItem.linked_references.map((ref, idx) => (
                    <div key={idx} className="text-xs p-2 bg-muted/30 rounded">
                      {ref.formatted_citation || ref.reference_text}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {evidenceItem.mlr_approved && (
              <Badge className="bg-green-600">
                <Check className="h-3 w-3 mr-1" />
                MLR Approved
              </Badge>
            )}
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                Performance Metrics
              </h4>
              
              {evidenceItem.usage_count !== undefined && (
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Times Used</span>
                  <Badge variant="secondary">{evidenceItem.usage_count}</Badge>
                </div>
              )}
              
              {evidenceItem.conversion_rate && (
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Conversion Rate</span>
                  <Badge variant="secondary">{evidenceItem.conversion_rate}%</Badge>
                </div>
              )}

              {evidenceItem.avg_performance_lift && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Avg. Performance Lift</span>
                  <Badge className="bg-green-600">+{evidenceItem.avg_performance_lift}%</Badge>
                </div>
              )}

              {!evidenceItem.usage_count && !evidenceItem.conversion_rate && !evidenceItem.avg_performance_lift && (
                <p className="text-sm text-muted-foreground">No performance data available yet</p>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="audience" className="space-y-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                Audience Relevance
              </h4>
              
              {evidenceItem.target_audiences && evidenceItem.target_audiences.length > 0 && (
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">Target Audiences:</span>
                  <div className="flex flex-wrap gap-2">
                    {evidenceItem.target_audiences.map((aud, idx) => (
                      <Badge key={idx} variant="outline">{aud}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {evidenceItem.applicable_audiences && evidenceItem.applicable_audiences.length > 0 && (
                <div className="space-y-2 mt-3">
                  <span className="text-sm text-muted-foreground">Applicable Audiences:</span>
                  <div className="flex flex-wrap gap-2">
                    {evidenceItem.applicable_audiences.map((aud, idx) => (
                      <Badge key={idx} variant="outline">{aud}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {evidenceItem.suitable_for_channels && evidenceItem.suitable_for_channels.length > 0 && (
                <div className="space-y-2 mt-3">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <BarChart3 className="h-3 w-3" />
                    Suitable Channels:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {evidenceItem.suitable_for_channels.map((ch, idx) => (
                      <Badge key={idx} variant="secondary">{ch}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {!evidenceItem.target_audiences && !evidenceItem.applicable_audiences && (
                <p className="text-sm text-muted-foreground">No audience data available</p>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};