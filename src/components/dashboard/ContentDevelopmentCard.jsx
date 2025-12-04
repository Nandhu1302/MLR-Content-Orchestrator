import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bot, ArrowRight, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBrandTemplates } from '@/hooks/useBrandTemplates';

export const ContentDevelopmentCard = ({
  activeProjects,
  inReview,
  completed,
  onOpenTemplates
}) => {
  const navigate = useNavigate();
  const { allTemplates } = useBrandTemplates();

  return (
    <Card 
      className="hover:shadow-lg transition-all cursor-pointer border-2 border-primary/20 hover:border-primary/40"
      onClick={() => navigate('/content-workshop')}
    >
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <Bot className="h-10 w-10 text-primary" />
          <Badge variant="secondary" className="gap-1">
            <FileText className="h-3 w-3" />
            {allTemplates.length}+ Templates
          </Badge>
        </div>
        <CardTitle className="text-2xl">Content Workshop</CardTitle>
        <CardDescription className="text-base">
          Create content with intelligence-driven recommendations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Badge variant="default" className="text-sm">
              {activeProjects}
            </Badge>
            <span className="text-sm text-muted-foreground">Active</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-sm">
              {inReview}
            </Badge>
            <span className="text-sm text-muted-foreground">In Review</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-sm">
              {completed}
            </Badge>
            <span className="text-sm text-muted-foreground">Completed</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <Button 
            className="w-full group" 
            size="lg"
            onClick={(e) => {
              e.stopPropagation();
              navigate('/content-workshop');
            }}
          >
            <Bot className="h-4 w-4 mr-2" />
            Start Creating Content
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          <Button 
            variant="outline"
            className="w-full" 
            onClick={(e) => {
              e.stopPropagation();
              onOpenTemplates();
            }}
          >
            <FileText className="h-4 w-4 mr-2" />
            Browse Templates
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};