import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Database, 
  Settings, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw,
  Download,
  Upload,
  FileText,
  Shield,
  Clock
} from 'lucide-react';
import { VeevaVaultService } from '@/services/veevaVaultService';

export const VeevaVaultConnector = () => {
  const [connection, setConnection] = useState({
    status: 'connected',
    lastSync: '2 minutes ago',
    apiVersion: 'v24.1',
    endpoint: 'https://company.veevavault.com'
  });
  
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [syncInProgress, setSyncInProgress] = useState(false);
  const [citations, setCitations] = useState([]);
  const [complianceData, setComplianceData] = useState(null);

  useEffect(() => {
    loadVaultData();
  }, []);

  const loadVaultData = async () => {
    try {
      // Load recent citations
      const recentCitations = await VeevaVaultService.searchCitations('latest', 'efficacy');
      setCitations(recentCitations.slice(0, 5));

      // Get sample compliance data
      const compliance = await VeevaVaultService.checkCompliance(
        'Sample content for compliance check',
        'email'
      );
      setComplianceData(compliance);
    } catch (error) {
      console.error('Failed to load Vault data:', error);
    }
  };

  const testConnection = async () => {
    setIsTestingConnection(true);
    try {
      const isConnected = await VeevaVaultService.initialize();
      setConnection(prev => ({
        ...prev,
        status: isConnected ? 'connected' : 'error',
        lastSync: 'Just now'
      }));
    } catch (error) {
      setConnection(prev => ({
        ...prev,
        status: 'error'
      }));
    } finally {
      setIsTestingConnection(false);
    }
  };

  const syncData = async () => {
    setSyncInProgress(true);
    try {
      await loadVaultData();
      setConnection(prev => ({
        ...prev,
        lastSync: 'Just now'
      }));
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setSyncInProgress(false);
    }
  };

  const getStatusIcon = () => {
    switch (connection.status) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-destructive" />;
      case 'disconnected':
        return <AlertCircle className="w-4 h-4 text-warning" />;
    }
  };

  const getStatusBadge = () => {
    const variants = {
      connected: 'default',
      error: 'destructive',
      disconnected: 'secondary'
    };

    return (
      <Badge variant={variants[connection.status]}>
        {connection.status.charAt(0).toUpperCase() + connection.status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center space-x-2">
            <Database className="w-5 h-5" />
            <span>Veeva Vault Integration</span>
          </h3>
          <p className="text-sm text-muted-foreground">
            Manage connection and sync data with Veeva Vault
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={syncData} disabled={syncInProgress} variant="outline">
            <RefreshCw className={`w-4 h-4 mr-2 ${syncInProgress ? 'animate-spin' : ''}`} />
            Sync
          </Button>
          <Button onClick={testConnection} disabled={isTestingConnection}>
            <Settings className="w-4 h-4 mr-2" />
            Test Connection
          </Button>
        </div>
      </div>

      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center space-x-2">
              {getStatusIcon()}
              <span>Connection Status</span>
            </span>
            {getStatusBadge()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Endpoint</p>
              <p className="font-medium">{connection.endpoint}</p>
            </div>
            <div>
              <p className="text-muted-foreground">API Version</p>
              <p className="font-medium">{connection.apiVersion}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Last Sync</p>
              <p className="font-medium">{connection.lastSync}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Data Sources</p>
              <p className="font-medium">4 Active</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="data" className="space-y-4">
        <TabsList>
          <TabsTrigger value="data">Data Sources</TabsTrigger>
          <TabsTrigger value="citations">Citations</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="config">Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="data" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Clinical Data</CardTitle>
                <CardDescription>Patient outcomes and trial results</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm">Synchronized</span>
                  </div>
                  <Button size="sm" variant="outline">
                    <Download className="w-3 h-3 mr-1" />
                    Export
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Last updated: 5 minutes ago
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Regulatory Documents</CardTitle>
                <CardDescription>FDA guidelines and approvals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm">Synchronized</span>
                  </div>
                  <Button size="sm" variant="outline">
                    <Download className="w-3 h-3 mr-1" />
                    Export
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Last updated: 12 minutes ago
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Brand Guidelines</CardTitle>
                <CardDescription>Messaging and visual standards</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-warning" />
                    <span className="text-sm">Syncing...</span>
                  </div>
                  <Button size="sm" variant="outline" disabled>
                    <Upload className="w-3 h-3 mr-1" />
                    Upload
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  In progress...
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Competitive Intelligence</CardTitle>
                <CardDescription>Market analysis and competitor data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm">Synchronized</span>
                  </div>
                  <Button size="sm" variant="outline">
                    <Download className="w-3 h-3 mr-1" />
                    Export
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Last updated: 1 hour ago
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="citations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Recent Citations</span>
              </CardTitle>
              <CardDescription>
                Latest research citations from Veeva Vault
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {citations && citations.length > 0 ? (
                  citations.map((citation, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-sm font-medium">{citation.title}</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            {citation.authors} • {citation.journal}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {citation.category} • {citation.year}
                          </p>
                        </div>
                        <Badge variant="outline" className="ml-2">
                          {citation.evidence_level}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">No citations available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          {complianceData && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>Compliance Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Overall Compliance Score</span>
                  <Badge variant={complianceData.overall_score >= 85 ? 'default' : 'secondary'}>
                    {complianceData.overall_score}%
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Compliance Flags</h4>
                  {complianceData.flags && complianceData.flags.length > 0 ? (
                    complianceData.flags.map((flag, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span>{flag.type}</span>
                        <Badge variant={flag.severity === 'high' ? 'destructive' : 'secondary'}>
                          {flag.severity}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground">No compliance flags</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Recommendations</h4>
                  {complianceData.recommendations && complianceData.recommendations.length > 0 ? (
                    complianceData.recommendations.slice(0, 3).map((rec, index) => (
                      <p key={index} className="text-xs text-muted-foreground">
                        • {rec}
                      </p>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground">No recommendations available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="config" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Connection Configuration</CardTitle>
              <CardDescription>
                Configure your Veeva Vault connection settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vault-url">Vault URL</Label>
                  <Input 
                    id="vault-url" 
                    placeholder="https://company.veevavault.com"
                    value={connection.endpoint}
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="api-version">API Version</Label>
                  <Input 
                    id="api-version" 
                    value={connection.apiVersion}
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sync-interval">Sync Interval (minutes)</Label>
                  <Input 
                    id="sync-interval" 
                    type="number"
                    placeholder="15"
                    defaultValue="15"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeout">Request Timeout (seconds)</Label>
                  <Input 
                    id="timeout" 
                    type="number"
                    placeholder="30"
                    defaultValue="30"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline">Reset</Button>
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};