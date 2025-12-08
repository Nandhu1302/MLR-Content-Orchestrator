import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  CheckCircle2, 
  FileText, 
  Image as ImageIcon,
  Table as TableIcon,
  BarChart3,
  Loader2
} from "lucide-react";
import { useVisualAssetUrl } from "@/hooks/useVisualAssets";
import { useDataVisualization } from "@/hooks/useDataVisualization";
import { format } from "date-fns";

export const VisualAssetDetailsModal = ({ visualAsset, onClose }) => {
  const { data: imageUrl } = useVisualAssetUrl(visualAsset.storage_path);
  const { generateVisualization, isGenerating, configuration } = useDataVisualization();
  
  const [visualizationMode, setVisualizationMode] = useState('table');
  const [chartType, setChartType] = useState('bar');

  const hasStructuredTableData = visualAsset.visual_type === 'table' && 
    visualAsset.visual_data?.rows && 
    visualAsset.visual_data?.headers;

  const transformTableToChartData = () => {
    if (!visualAsset.visual_data?.rows || !visualAsset.visual_data?.headers) return [];
    
    return visualAsset.visual_data.rows.map((row) => {
      const obj = {};
      visualAsset.visual_data.headers.forEach((header, idx) => {
        obj[header] = row[idx];
      });
      return obj;
    });
  };

  const handleGenerateChart = async () => {
    const chartData = transformTableToChartData();
    if (chartData.length === 0) return;

    try {
      await generateVisualization({
        visualizationType: chartType,
        data: chartData,
        context: {
          title: visualAsset.title || 'Visual Data',
          description: visualAsset.caption,
          therapeuticArea: 'Pharmaceutical',
          targetAudience: 'HCP'
        },
        stylePreferences: {
          colorScheme: 'professional',
          showLegend: true,
          showGrid: true,
          showTooltip: true
        }
      });
    } catch (error) {
      console.error('Failed to generate chart:', error);
    }
  };

  const getIcon = () => {
    switch (visualAsset.visual_type) {
      case 'table':
        return <TableIcon className="h-5 w-5" />;
      case 'chart':
      case 'graph':
        return <BarChart3 className="h-5 w-5" />;
      case 'image':
      case 'infographic':
      case 'diagram':
        return <ImageIcon className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getIcon()}
            {visualAsset.title || `${visualAsset.visual_type} Visual Asset`}
            {visualAsset.mlr_approved && (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            )}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-8rem)]">
          <div className="space-y-6 pr-4">
            {/* Visual Preview */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm">Preview</h3>
                {hasStructuredTableData && (
                  <div className="flex items-center gap-2">
                    <div className="flex border rounded-lg overflow-hidden">
                      <Button
                        variant={visualizationMode === 'table' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setVisualizationMode('table')}
                        className="rounded-none"
                      >
                        <TableIcon className="h-4 w-4 mr-1" />
                        Table
                      </Button>
                      <Button
                        variant={visualizationMode === 'chart' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setVisualizationMode('chart')}
                        className="rounded-none"
                      >
                        <BarChart3 className="h-4 w-4 mr-1" />
                        Chart
                      </Button>
                    </div>
                    
                    {visualizationMode === 'chart' && (
                      <>
                        <Select value={chartType} onValueChange={(val) => setChartType(val)}>
                          <SelectTrigger className="w-32 h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bar">Bar Chart</SelectItem>
                            <SelectItem value="line">Line Chart</SelectItem>
                            <SelectItem value="pie">Pie Chart</SelectItem>
                            <SelectItem value="area">Area Chart</SelectItem>
                            <SelectItem value="scatter">Scatter Plot</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          size="sm"
                          onClick={handleGenerateChart}
                          disabled={isGenerating}
                        >
                          {isGenerating ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            'Generate'
                          )}
                        </Button>
                      </>
                    )}
                  </div>
                )}
              </div>
              <div className="border rounded-lg p-4 bg-muted/30">
                {visualAsset.visual_type === 'table' && visualAsset.visual_data ? (
                  visualizationMode === 'chart' ? (
                    <div className="min-h-[400px] flex items-center justify-center">
                      {configuration?.chartConfig ? (
                        <div className="w-full space-y-4">
                          <div 
                            className="w-full"
                            dangerouslySetInnerHTML={{ __html: configuration.chartConfig.svgMarkup || '' }}
                          />
                          {configuration.insights && (
                            <div className="space-y-3 p-4 bg-background/50 rounded-lg">
                              <div>
                                <h4 className="font-semibold text-sm mb-2">Key Findings:</h4>
                                <ul className="text-xs space-y-1 list-disc list-inside text-muted-foreground">
                                  {configuration.insights.keyFindings.map((finding, idx) => (
                                    <li key={idx}>{finding}</li>
                                  ))}
                                </ul>
                              </div>
                              {configuration.insights.recommendations.length > 0 && (
                                <div>
                                  <h4 className="font-semibold text-sm mb-2">Recommendations:</h4>
                                  <ul className="text-xs space-y-1 list-disc list-inside text-muted-foreground">
                                    {configuration.insights.recommendations.map((rec, idx) => (
                                      <li key={idx}>{rec}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center space-y-3">
                          <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                          <p className="text-sm text-muted-foreground">
                            Select a chart type and click "Generate" to visualize this data
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="overflow-x-auto space-y-4">
                      {/* Structured table format (new) */}
                      {visualAsset.visual_data.rows && visualAsset.visual_data.headers ? (
                      <>
                        <table className="w-full text-sm border-collapse">
                          <thead>
                            <tr className="border-b">
                              {visualAsset.visual_data.headers.map((header, idx) => (
                                <th key={idx} className="text-left p-2 font-semibold">
                                  {header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {visualAsset.visual_data.rows.slice(0, 10).map((row, idx) => (
                              <tr key={idx} className="border-b">
                                {row.map((cell, cellIdx) => (
                                  <td key={cellIdx} className="p-2">
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {visualAsset.visual_data.rows.length > 10 && (
                          <p className="text-xs text-muted-foreground">
                            Showing 10 of {visualAsset.visual_data.rows.length} rows
                          </p>
                        )}
                      </>
                    ) : visualAsset.visual_data.columns || visualAsset.visual_data.data_points ? (
                      /* Descriptive format (current) */
                      <div className="space-y-3">
                        {visualAsset.visual_data.columns && (
                          <div>
                            <p className="text-xs font-semibold text-muted-foreground mb-2">COLUMNS:</p>
                            <div className="flex flex-wrap gap-2">
                              {visualAsset.visual_data.columns.map((col, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {col}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {visualAsset.visual_data.data_points && (
                          <div>
                            <p className="text-xs font-semibold text-muted-foreground mb-2">DATA:</p>
                            <p className="text-sm whitespace-pre-wrap">
                              {visualAsset.visual_data.data_points}
                            </p>
                          </div>
                        )}
                        {visualAsset.visual_data.footnotes && (
                          <div className="pt-2 border-t">
                            <p className="text-xs italic text-muted-foreground">
                              {visualAsset.visual_data.footnotes}
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        <TableIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Table data not available</p>
                      </div>
                    )}
                    </div>
                  )
                ) : imageUrl ? (
                  <img 
                    src={imageUrl} 
                    alt={visualAsset.title || 'Visual asset'}
                    className="max-w-full h-auto rounded"
                  />
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Visual preview not available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Caption */}
            {visualAsset.caption && (
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Caption</h3>
                <p className="text-sm text-muted-foreground">{visualAsset.caption}</p>
              </div>
            )}

            <Separator />

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-sm mb-2">Type & Classification</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <Badge variant="secondary" className="capitalize">
                      {visualAsset.visual_type}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">MLR Status:</span>
                    <Badge variant={visualAsset.mlr_approved ? "default" : "secondary"}>
                      {visualAsset.mlr_approved ? "Approved" : "Pending"}
                    </Badge>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-sm mb-2">Source Information</h3>
                <div className="space-y-1 text-sm">
                  {visualAsset.source_section && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Section:</span>
                      <span className="font-medium">{visualAsset.source_section}</span>
                    </div>
                  )}
                  {visualAsset.source_page && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Page:</span>
                      <span className="font-medium">{visualAsset.source_page}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Applicable Contexts */}
            {visualAsset.applicable_asset_types?.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Applicable Asset Types</h3>
                <div className="flex flex-wrap gap-2">
                  {visualAsset.applicable_asset_types.map((type, idx) => (
                    <Badge key={idx} variant="outline">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Applicable Audiences */}
            {visualAsset.applicable_audiences?.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Target Audiences</h3>
                <div className="flex flex-wrap gap-2">
                  {visualAsset.applicable_audiences.map((audience, idx) => (
                    <Badge key={idx} variant="outline">
                      {audience}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Linked Evidence */}
            <div className="grid grid-cols-2 gap-4">
              {visualAsset.linked_claims?.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm">Linked Claims</h3>
                  <Badge variant="secondary">
                    {visualAsset.linked_claims.length} claim(s)
                  </Badge>
                </div>
              )}
              {visualAsset.linked_references?.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm">Linked References</h3>
                  <Badge variant="secondary">
                    {visualAsset.linked_references.length} reference(s)
                  </Badge>
                </div>
              )}
            </div>

            {/* Usage Information */}
            <div className="space-y-2">
              <h3 className="font-semibold text-sm">Usage Statistics</h3>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Times Used:</span>
                  <span className="font-medium">{visualAsset.usage_count || 0}</span>
                </div>
                {visualAsset.last_used_at && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Used:</span>
                    <span className="font-medium">
                      {format(new Date(visualAsset.last_used_at), "MMM d, yyyy")}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created:</span>
                  <span className="font-medium">
                    {format(new Date(visualAsset.created_at), "MMM d, yyyy")}
                  </span>
                </div>
              </div>
            </div>

            {/* Approval Notes */}
            {visualAsset.approval_notes && (
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Approval Notes</h3>
                <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded">
                  {visualAsset.approval_notes}
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};