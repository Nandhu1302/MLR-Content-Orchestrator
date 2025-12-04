
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Presentation, 
  Rocket, 
  Flower2, 
  Swords, 
  GraduationCap, 
  Route,
  Zap,
  Loader2
} from 'lucide-react';

/*
// interface StoryScenarioGridProps {
//   onScenarioSelect: (scenarioId: string) => void;
//   disabled?: boolean;
// }
*/

const scenarios = [
  {
    id: 'congress-conference-campaign',
    icon: Presentation,
    title: 'Event Materials',
    description: 'Congress booth, social highlights, follow-ups',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10 hover:bg-blue-500/20'
  },
  {
    id: 'product-launch-campaign',
    icon: Rocket,
    title: 'Product Launch',
    description: 'Multi-channel launch with comprehensive assets',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10 hover:bg-purple-500/20'
  },
  {
    id: 'disease-awareness-campaign',
    icon: Flower2,
    title: 'Seasonal Awareness',
    description: 'Educational campaign for disease understanding',
    color: 'text-pink-500',
    bgColor: 'bg-pink-500/10 hover:bg-pink-500/20'
  },
  {
    id: 'competitive-response-campaign',
    icon: Swords,
    title: 'Competitive Response',
    description: 'Rapid response to competitive challenges',
    color: 'text-red-500',
    bgColor: 'bg-red-500/10 hover:bg-red-500/20'
  },
  {
    id: 'hcp-educational-series',
    icon: GraduationCap,
    title: 'HCP Education',
    description: 'Ongoing education with rep-triggered emails',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10 hover:bg-green-500/20'
  },
  {
    id: 'patient-journey-infographic',
    icon: Route,
    title: 'Patient Journey',
    description: 'Visual patient journey for education',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10 hover:bg-orange-500/20'
  },
  {
    id: 'clinical-data-update',
    icon: Zap,
    title: 'Quick Update',
    description: 'Safety or clinical data communication',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10 hover:bg-yellow-500/20'
  }
];

export const StoryScenarioGrid = ({ onScenarioSelect, disabled }) => {
  const [loadingId, setLoadingId] = React.useState/*<string | null>*/(null);

  const handleClick = async (scenarioId) => {
    if (disabled) return;
    setLoadingId(scenarioId);
    await onScenarioSelect(scenarioId);
    // Keep loading state briefly for visual feedback
    setTimeout(() => setLoadingId(null), 500);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
      {scenarios.map((scenario) => {
        const Icon = scenario.icon;
        const isLoading = loadingId === scenario.id;
        return (
          <Card
            key={scenario.id}
            className={`cursor-pointer transition-all border-border/50 ${
              disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md hover:border-primary/50'
            } ${isLoading ? 'ring-2 ring-primary' : ''}`}
            onClick={() => handleClick(scenario.id)}
          >
            <CardContent className="p-2 flex items-center gap-2">
              <div className={`${scenario.color} shrink-0 ${isLoading ? 'animate-pulse' : ''}`}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Icon className="h-4 w-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-xs truncate">{scenario.title}</div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
