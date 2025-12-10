import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { useContext } from 'react';
import { IntelligenceContext } from '@/contexts/IntelligenceContext';

export const IntelligenceReadinessCheck = () => {
  // Type annotation removed
  const context = useContext(IntelligenceContext);
  
  // If not wrapped in provider, don't render anything
  if (!context) {
    return null;
  }
  
  const { intelligence, isLoading } = context;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Intelligence Readiness</CardTitle>
          <CardDescription>Checking available intelligence...</CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={0} className="w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!intelligence) {
    return null;
  }

  const { dataReadiness } = intelligence;
  // Type annotations removed from function arguments
  const getReadinessColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getReadinessIcon = (score) => {
    if (score >= 80) return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    if (score >= 50) return <Info className="h-4 w-4 text-yellow-600" />;
    return <AlertCircle className="h-4 w-4 text-red-600" />;
  };

  const getReadinessLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 50) return 'Good';
    return 'Limited';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Intelligence Readiness
          {getReadinessIcon(dataReadiness.overall)}
        </CardTitle>
        <CardDescription>
          Your AI will use this intelligence to generate better content
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Overall Readiness</span>
            <Badge variant={dataReadiness.overall >= 80 ? 'default' : dataReadiness.overall >= 50 ? 'secondary' : 'destructive'}>
              {getReadinessLabel(dataReadiness.overall)} - {dataReadiness.overall}%
            </Badge>
          </div>
          <Progress value={dataReadiness.overall} className="w-full" />
        </div>

        <div className="space-y-3 pt-2">
          <ReadinessItem
            label="Brand Intelligence"
            score={dataReadiness.brand}
            description="Brand profile, guidelines, vision"
          />
          <ReadinessItem
            label="Evidence Library"
            score={dataReadiness.evidence}
            description="Clinical claims, references, content modules"
          />
          <ReadinessItem
            label="Performance Data"
            score={dataReadiness.performance}
            description="Success patterns, analytics, top elements"
          />
          <ReadinessItem
            label="Competitive Intelligence"
            score={dataReadiness.competitive}
            description="Competitor insights, landscape analysis"
          />
          <ReadinessItem
            label="Audience Insights"
            score={dataReadiness.audience}
            description="Segment preferences, engagement patterns"
          />
        </div>

        {dataReadiness.overall < 80 && (
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Tip:</strong> Add more intelligence data to improve AI generation quality.
              {dataReadiness.evidence < 50 && ' Start with clinical claims and references.'}
              {dataReadiness.performance < 50 && ' Import past campaign performance data.'}
              {dataReadiness.audience < 50 && ' Define audience segments and preferences.'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// interface ReadinessItemProps removed

const ReadinessItem = ({ label, score, description }) => { // Type annotations removed
  const getColor = (score) => { // Type annotation removed
    if (score >= 80) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${getColor(score)}`} />
          <span className="text-sm font-medium">{label}</span>
        </div>
        <span className="text-sm text-muted-foreground">{score}%</span>
      </div>
      <p className="text-xs text-muted-foreground pl-4">{description}</p>
    </div>
  );
};