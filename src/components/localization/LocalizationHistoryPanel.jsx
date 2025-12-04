import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Eye, 
  Edit, 
  Download, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Copy,
  FileText
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const LocalizationHistoryPanel = ({
  assetId,
  onViewProject,
  onEditProject,
  className
}) => {
  const { toast } = useToast();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLocalizationHistory();
  }, [assetId]);

  const loadLocalizationHistory = async () => {
    if (!assetId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('localization_projects')
        .select(`
          *,
          workflows:localization_workflows(*)
        `)
        .eq('source_content_id', assetId)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Failed to load localization history:', error);
      toast({
        title: 'Error loading history',
        description: 'Failed to load localization project history',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-500">Completed</Badge>;
      case 'in_progress':
        return <Badge variant="default" className="bg-yellow-500">In Progress</Badge>;
      default:
        return <Badge variant="secondary">Draft</Badge>;
    }
  };

  const calculateProgress = (workflows) => {
    if (!workflows || workflows.length === 0) return { completed: 0, total: 0 };
    
    let completed = 0;
    let total = 0;
    
    workflows.forEach(workflow => {
      const segments = workflow.segment_translations || [];
      if (Array.isArray(segments)) {
        total += segments.length;
        completed += segments.filter((s) => s.targetText).length;
      }
    });
    
    return { completed, total };
  };

  const handleCloneProject = async (project) => {
    toast({
      title: 'Clone Project',
      description: 'Feature coming soon: Clone to new market',
      variant: 'default'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="py-12 text-center">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No Localization History</h3>
          <p className="text-sm text-muted-foreground">
            This asset has not been localized yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Localization History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Market</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => {
              const progress = calculateProgress(project.workflows);
              const mainWorkflow = project.workflows?.[0];
              
              return (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(project.localization_status)}
                      {project.target_markets.join(', ')}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(project.localization_status)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">
                        {progress.completed}/{progress.total} segments
                      </span>
                      {progress.total > 0 && (
                        <span className="text-xs text-muted-foreground">
                          ({Math.round((progress.completed / progress.total) * 100)}%)
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {project.completed_at
                      ? new Date(project.completed_at).toLocaleDateString()
                      : new Date(project.updated_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {onViewProject && mainWorkflow && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onViewProject(project.id, mainWorkflow.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      {onEditProject && mainWorkflow && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onEditProject(project.id, mainWorkflow.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCloneProject(project)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};