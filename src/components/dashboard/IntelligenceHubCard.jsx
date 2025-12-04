import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, TrendingUp, ArrowRight, Users, Target, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const IntelligenceHubCard = () => {
  const navigate = useNavigate();

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/intelligence')}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Brain className="h-8 w-8 text-primary" />
          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); navigate('/intelligence'); }}>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        <CardTitle>Intelligence Hub</CardTitle>
        <CardDescription>
          Unified view of all your brand intelligence insights
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Audience Insights</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Target className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Content Performance</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Competitive Analysis</span>
          </div>
          <Button 
            className="w-full mt-2" 
            onClick={(e) => { e.stopPropagation(); navigate('/intelligence'); }}
          >
            View Intelligence
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};