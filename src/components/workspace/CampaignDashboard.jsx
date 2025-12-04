
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Edit3,
  Plus,
  Calendar,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Mail,
  Globe,
  Palette,
  Share2,
  Shield
} from 'lucide-react';
import { assetConfigurations } from '@/data/assetConfigurations';
import { MultiLevelGuardrailsPanel } from '@/components/guardrails/MultiLevelGuardrailsPanel';

const statusConfig = {
  draft: { label: 'Draft', color: 'bg-gray-100 text-gray-700', icon: FileText },
  'in-progress': { label: 'In Progress', color: 'bg-blue-100 text-blue-700', icon: Clock },
  'content-review': { label: 'Content Review', color: 'bg-yellow-100 text-yellow-700', icon: FileText },
  'design-review': { label: 'Design Review', color: 'bg-orange-100 text-orange-700', icon: Palette },
  'mlr-review': { label: 'MLR Review', color: 'bg-purple-100 text-purple-700', icon: CheckCircle },
  approved: { label: 'Approved', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  published: { label: 'Published', color: 'bg-emerald-100 text-emerald-700', icon: Globe }
};

const assetTypeIcons = {
  'mass-email': Mail,
  'rep-triggered-email': Mail,
  'social-media-post': Share2,
  'website-landing-page': Globe,
  'digital-sales-aid': FileText
};

const CampaignDashboard = ({ campaignData, onBack, onEditAsset, onAddAsset, onEditCampaign }) => {
  const navigate = useNavigate();
  const [selectedAssets, setSelectedAssets] = useState([]);

  const totalAssets = campaignData.assets.length;
  const completedAssets = campaignData.assets.filter(
    asset => asset.status === 'approved' || asset.status === 'published'
  ).length;
  const campaignProgress = totalAssets > 0 ? (completedAssets / totalAssets) * 100 : 0;

  const assetsByStatus = campaignData.assets.reduce((acc, asset) => {
    acc[asset.status] = (acc[asset.status] || 0) + 1;
    return acc;
  }, {});

  const overallEstimatedHours = campaignData.assets.reduce((total, asset) => {
    const config = assetConfigurations.find(c => c.type === asset.assetType);
    return total + (config?.estimatedHours || 0);
  }, 0);

  const toggleAssetSelection = assetId => {
    setSelectedAssets(prev =>
      prev.includes(assetId) ? prev.filter(id => id !== assetId) : [...prev, assetId]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={onBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-semibold">{campaignData.projectName}</h1>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="outline">{campaignData.indication}</Badge>
                  <Badge variant="secondary">{campaignData.status}</Badge>
                  <span className="text-sm text-muted-foreground">
                    {totalAssets} assets • {campaignData.targetMarkets.join(', ')}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={() => navigate('/content-studio')}>
                <FileText className="h-4 w-4 mr-2" />
                View in Content Studio
              </Button>
              <Button variant="outline" onClick={onEditCampaign}>
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Campaign
              </Button>
              <Button onClick={onAddAsset}>
                <Plus className="h-4 w-4 mr-2" />
                Add Asset
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container px-6 py-6">
        {/* Campaign Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Progress */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Progress</p>
                  <p className="text-2xl font-bold">{Math.round(campaignProgress)}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <Progress value={campaignProgress} className="mt-4" />
              <p className="text-xs text-muted-foreground mt-2">
                {completedAssets} of {totalAssets} assets complete
              </p>
            </CardContent>
          </Card>

          {/* Launch Date */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Launch Date</p>
                  <p className="text-lg font-semibold">
                    {new Date(campaignData.plannedLaunch).toLocaleDateString()}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                {Math.ceil((new Date(campaignData.plannedLaunch).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days remaining
              </p>
            </CardContent>
          </Card>

          {/* Team Members */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Team Members</p>
                  <p className="text-2xl font-bold">{campaignData.teamMembers.length}</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
              <div className="flex -space-x-2 mt-4">
                {campaignData.teamMembers.slice(0, 3).map((member, index) => (
                  <div
                    key={index}
                    className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs border-2 border-background"
                  >
                    {member.charAt(0).toUpperCase()}
                  </div>
                ))}
                {campaignData.teamMembers.length > 3 && (
                  <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs border-2 border-background">
                    +{campaignData.teamMembers.length - 3}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Estimated Hours */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Est. Hours</p>
                  <p className="text-2xl font-bold">{overallEstimatedHours}h</p>
                </div>
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground mt-4">Across all assets</p>
            </CardContent>
          </Card>
        </div>

        {/* Campaign Strategy & Guardrails */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Campaign Strategy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Primary Objective</h4>
                  <p className="text-sm text-muted-foreground">{campaignData.primaryObjective}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Key Message</h4>
                  <p className="text-sm text-muted-foreground">{campaignData.keyMessage}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Target Audience</h4>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="secondary">{campaignData.primaryAudience}</Badge>
                    {campaignData.audienceSegment.map(segment => (
                      <Badge key={segment} variant="outline" className="text-xs">
                        {segment}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Campaign Guardrails
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <MultiLevelGuardrailsPanel
                campaignId={campaignData.campaignId}
                showComplianceCheck={false}
                showCustomization={true}
              />
            </CardContent>
          </Card>
        </div>

        {/* Assets Grid */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Campaign Assets</CardTitle>
              <div className="flex items-center space-x-2">
                {selectedAssets.length > 0 && (
                  <>
                    <Button variant="outline" size="sm">
                      Bulk Review ({selectedAssets.length})
                    </Button>
                    <Button variant="outline" size="sm">
                      Export Selected
                    </Button>
                  </>
                )}
                <Badge variant="outline">{totalAssets} Total</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {campaignData.assets.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No assets yet</h3>
                <p className="text-muted-foreground mb-4">
                  Get started by creating your first campaign asset
                </p>
                <Button onClick={onAddAsset}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Asset
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {campaignData.assets.map(asset => {
                  const assetConfig = assetConfigurations.find(c => c.type === asset.assetType);
                  const status = statusConfig[asset.status];
                  const AssetIcon = assetTypeIcons[asset.assetType] || FileText;
                  const StatusIcon = status.icon;
                  const isSelected = selectedAssets.includes(asset.assetId);

                  return (
                    <div
                      key={asset.assetId}
                      className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                        isSelected ? 'border-primary bg-primary/5' : 'border-border'
                      }`}
                      onClick={() => toggleAssetSelection(asset.assetId)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 flex-1">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleAssetSelection(asset.assetId)}
                            className="rounded"
                          />
                          <div className="flex items-center space-x-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                              <AssetIcon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-medium">{asset.projectName}</h4>
                              <p className="text-sm text-muted-foreground">
                                {assetConfig?.name}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="flex items-center space-x-2">
                              <StatusIcon className="h-4 w-4" />
                              <Badge className={status.color}>{status.label}</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              Last updated {new Date(asset.updatedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={e => {
                              e.stopPropagation();
                              onEditAsset(asset.assetId);
                            }}
                          >
                            Edit
                          </Button>
                        </div>
                      </div>
                      {asset.content?.subject && (
                        <div className="mt-3 pl-12">
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium">Subject:</span> {asset.content.subject}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CampaignDashboard;
