
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  FileText,
  Target,
  Globe,
  Calendar,
  Building,
  Users,
  Stethoscope,
  ClipboardList,
  Plus
} from "lucide-react";

const AssetMetadataPanel = ({ asset, context, brandId }) => {
  const handleInsertTemplate = (templateType) => {
    // Emit custom event for template insertion
    document.dispatchEvent(
      new CustomEvent("insertTemplate", {
        detail: { type: templateType }
      })
    );
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4">
        {/* Asset Overview */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Asset Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-xs text-muted-foreground">Asset Type</p>
              <Badge variant="secondary">{asset?.type || "Email"}</Badge>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Status</p>
              <Badge variant="outline">{asset?.status || "Pre-MLR Review"}</Badge>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Last Modified</p>
              <p className="text-sm">
                {new Date(asset?.updated_at || Date.now()).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Campaign Context */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4" />
              Campaign Context
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-xs text-muted-foreground">Campaign</p>
              <p className="text-sm font-medium">
                {context?.campaignName || "Brand Campaign 2024"}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Target Audience</p>
              <div className="flex items-center gap-1 mt-1">
                <Users className="h-3 w-3 text-muted-foreground" />
                <p className="text-sm">
                  {context?.targetAudience || "Healthcare Professionals"}
                </p>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Therapeutic Area</p>
              <div className="flex items-center gap-1 mt-1">
                <Stethoscope className="h-3 w-3 text-muted-foreground" />
                <p className="text-sm">
                  {context?.therapeuticArea || "General Medicine"}
                </p>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Market Region</p>
              <div className="flex items-center gap-1 mt-1">
                <Globe className="h-3 w-3 text-muted-foreground" />
                <p className="text-sm">{context?.marketRegion || "US"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Brand Guidelines Summary */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Building className="h-4 w-4" />
              Brand Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-xs text-muted-foreground">Key Messages</p>
              <div className="space-y-1 mt-1">
                {context?.brandGuidelines?.keyMessages?.length > 0 ? (
                  context.brandGuidelines.keyMessages.map((message, index) => (
                    <p key={index} className="text-xs bg-muted p-2 rounded">
                      {message}
                    </p>
                  ))
                ) : (
                  <p className="text-xs bg-muted p-2 rounded">
                    Evidence-based therapeutic benefits
                  </p>
                )}
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Tone Guidelines</p>
              <p className="text-sm">
                {context?.brandGuidelines?.toneGuidelines ||
                  "Professional, evidence-based"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              Quick Templates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              size="sm"
              variant="outline"
              className="w-full justify-start text-xs"
              onClick={() => handleInsertTemplate("disclaimer")}
            >
              <Plus className="h-3 w-3 mr-2" />
              Insert Disclaimer
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="w-full justify-start text-xs"
              onClick={() => handleInsertTemplate("fairBalance")}
            >
              <Plus className="h-3 w-3 mr-2" />
              Fair Balance
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="w-full justify-start text-xs"
              onClick={() => handleInsertTemplate("prescribingInfo")}
            >
              <Plus className="h-3 w-3 mr-2" />
              Prescribing Info
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="w-full justify-start text-xs"
              onClick={() => handleInsertTemplate("references")}
            >
              <Plus className="h-3 w-3 mr-2" />
              Reference Section
            </Button>
          </CardContent>
        </Card>

        {/* Context Inheritance */}
        {context?.strategyThemes && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Strategy Context</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-2">Active Themes</p>
              <div className="space-y-1">
                {context.strategyThemes.slice(0, 2).map((theme, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {theme.name || `Theme ${index + 1}`}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ScrollArea>
  );
};

// ✅ Export the component
export default AssetMetadataPanel;
