import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Trash2, 
  Clock,
  MoreVertical,
  Layers
} from 'lucide-react';
import { formatDistance } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const ProjectStageCard = ({
  item,
  stageLabel,
  nextAction,
  onContinue,
  onDelete
}) => {
  const assetCount = item.assets?.length || 0;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold line-clamp-1">
              {item.name}
            </CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                {stageLabel}
              </Badge>
              {item.type === 'draft' && (
                <Badge variant="secondary" className="text-xs">
                  Draft
                </Badge>
              )}
              {assetCount > 0 && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Layers className="h-3 w-3" />
                  <span>{assetCount} asset{assetCount !== 1 ? 's' : ''}</span>
                </div>
              )}
            </div>
          </div>
          
          {onDelete && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onDelete} className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{item.progress}%</span>
          </div>
          <Progress value={item.progress} className="h-2" />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>
              Updated {formatDistance(item.lastModified, new Date(), { addSuffix: true })}
            </span>
          </div>
          
          <Button onClick={onContinue} size="sm">
            <Play className="h-4 w-4 mr-2" />
            {nextAction}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};