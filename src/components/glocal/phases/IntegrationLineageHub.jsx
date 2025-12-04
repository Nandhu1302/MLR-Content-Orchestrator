import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Download, FileCheck, History, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export const IntegrationLineageHub = ({ 
  onPhaseComplete,
  projectData,
  phaseData 
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleComplete = () => {
    const finalData = {
      completedAt: new Date().toISOString(),
      finalStatus: 'completed',
      summary: {
        totalPhases: 7,
        completedPhases: 7,
        qualityScore: phaseData.phase5?.qualityMetrics?.qualityScore || 88,
        complianceScore: phaseData.phase4?.complianceCheck?.complianceScore || 92,
        tmLeverage: phaseData.phase2?.leverageScore || 72
      }
    };

    onPhaseComplete(finalData);
    
    toast({
      title: 'Workflow Complete! 🎉',
      description: 'All adaptation phases finished successfully'
    });

    // Navigate back to hub after a delay
    setTimeout(() => {
      navigate('/glocalization');
    }, 2000);
  };

  const phaseStatuses = [
    { phase: 'Phase 1', name: 'Content Capture', status: 'complete', icon: FileCheck },
    { phase: 'Phase 2', name: 'TM Intelligence', status: 'complete', icon: Package },
    { phase: 'Phase 3', name: 'Cultural Analysis', status: 'complete', icon: FileCheck },
    { phase: 'Phase 4', name: 'Regulatory Check', status: 'complete', icon: FileCheck },
    { phase: 'Phase 5', name: 'Quality Assessment', status: 'complete', icon: FileCheck },
    { phase: 'Phase 6', name: 'DAM Preparation', status: 'complete', icon: Package },
    { phase: 'Phase 7', name: 'Integration', status: 'in-progress', icon: History },
  ];

  return (
    <div className="space-y-6">
      <Card className="border-primary">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Workflow Complete</CardTitle>
              <CardDescription>
                All adaptation phases completed successfully
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">
                    {phaseData.phase5?.qualityMetrics?.qualityScore || 88}%
                  </div>
                  <p className="text-sm text-muted-foreground">Quality Score</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-500 mb-1">
                    {phaseData.phase4?.complianceCheck?.complianceScore || 92}%
                  </div>
                  <p className="text-sm text-muted-foreground">Compliance</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-500 mb-1">
                    {phaseData.phase2?.leverageScore?.toFixed(0) || 72}%
                  </div>
                  <p className="text-sm text-muted-foreground">TM Leverage</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Workflow Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {phaseStatuses.map((item) => {
              const Icon = item.icon;
              return (
                <div 
                  key={item.phase}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{item.phase}</p>
                      <p className="text-sm text-muted-foreground">{item.name}</p>
                    </div>
                  </div>
                  <Badge variant={item.status === 'complete' ? 'default' : 'secondary'}>
                    {item.status === 'complete' ? 'Complete' : 'In Progress'}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Export Options</CardTitle>
          <CardDescription>
            Download final deliverables and reports
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            <Download className="mr-2 h-4 w-4" />
            Download Complete Package
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <FileCheck className="mr-2 h-4 w-4" />
            Export Quality Report
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <History className="mr-2 h-4 w-4" />
            View Lineage Trail
          </Button>
        </CardContent>
      </Card>

      <Button onClick={handleComplete} size="lg" className="w-full">
        <CheckCircle className="mr-2 h-4 w-4" /> Complete Workflow
      </Button>
    </div>
  );
};