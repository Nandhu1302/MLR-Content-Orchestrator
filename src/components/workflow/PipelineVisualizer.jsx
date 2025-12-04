import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  FileText, 
  Lightbulb, 
  Pencil, 
  Palette, 
  Shield, 
  Globe, 
  CheckCircle 
} from 'lucide-react';

const STAGE_CONFIG = [
  { stage: 'discover', label: 'Discover', icon: Brain, color: 'text-blue-500' },
  { stage: 'brief', label: 'Brief', icon: FileText, color: 'text-purple-500' },
  { stage: 'theme', label: 'Theme', icon: Lightbulb, color: 'text-yellow-500' },
  { stage: 'assets', label: 'Assets', icon: Pencil, color: 'text-green-500' },
  { stage: 'design', label: 'Design', icon: Palette, color: 'text-pink-500' },
  { stage: 'review', label: 'Review', icon: Shield, color: 'text-orange-500' },
  { stage: 'localize', label: 'Localize', icon: Globe, color: 'text-cyan-500' },
  { stage: 'complete', label: 'Complete', icon: CheckCircle, color: 'text-emerald-500' }
];

export const PipelineVisualizer = ({ 
  itemsByStage,
  onStageClick 
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between gap-2 overflow-x-auto">
          {STAGE_CONFIG.map((config, index) => {
            const count = itemsByStage[config.stage]?.length || 0;
            const Icon = config.icon;
            const isLast = index === STAGE_CONFIG.length - 1;

            return (
              <React.Fragment key={config.stage}>
                <button
                  onClick={() => onStageClick?.(config.stage)}
                  className="flex flex-col items-center gap-2 group hover:scale-105 transition-transform min-w-[80px] p-2"
                >
                  <div className={`relative ${count > 0 ? config.color : 'text-muted-foreground'}`}>
                    <Icon className="h-8 w-8" />
                    {count > 0 && (
                      <Badge 
                        variant="default" 
                        className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                      >
                        {count}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs font-medium text-center">{config.label}</p>
                </button>
                
                {!isLast && (
                  <div className="flex-1 h-px bg-border min-w-[20px] max-w-[60px]" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};