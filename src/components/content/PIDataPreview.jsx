import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BarChart3, Table2, AlertTriangle, TrendingUp } from 'lucide-react';

export const PIDataPreview = ({ structuredData }) => {
  const hasData = Object.values(structuredData).some(
    v => Array.isArray(v) && v.length > 0
  );

  if (!hasData) {
    return null;
  }

  const renderDataCount = (data) => {
    if (!data || data.length === 0) return null;
    return (
      <Badge variant="secondary" className="ml-2">
        {data.length} {data.length === 1 ? 'item' : 'items'}
      </Badge>
    );
  };

  const renderClinicalTrials = (trials) => {
    return (
      <div className="space-y-3">
        {trials.map((trial, idx) => (
          <div key={idx} className="p-3 bg-muted/50 rounded-lg space-y-1">
            <div className="font-medium text-sm">
              {trial.name || trial.study_name || trial.trial_name || `Trial ${idx + 1}`}
            </div>
            {trial.phase && (
              <div className="text-xs text-muted-foreground">Phase: {trial.phase}</div>
            )}
            {trial.n && (
              <div className="text-xs text-muted-foreground">Sample Size: {trial.n} patients</div>
            )}
            {trial.primary_endpoint && (
              <div className="text-xs">
                <span className="text-muted-foreground">Primary Endpoint: </span>
                {trial.primary_endpoint}
              </div>
            )}
            {trial.results && (
              <div className="text-xs">
                <span className="text-muted-foreground">Results: </span>
                {typeof trial.results === 'string' ? trial.results : JSON.stringify(trial.results)}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderEfficacyData = (efficacy) => {
    return (
      <div className="space-y-3">
        {efficacy.map((item, idx) => (
          <div key={idx} className="p-3 bg-muted/50 rounded-lg space-y-1">
            <div className="font-medium text-sm">
              {item.measure || item.endpoint || item.metric || `Efficacy Metric ${idx + 1}`}
            </div>
            {item.value && (
              <div className="text-xs">
                <span className="text-muted-foreground">Value: </span>
                <span className="font-semibold">{item.value}</span>
                {item.unit && <span className="text-muted-foreground"> {item.unit}</span>}
              </div>
            )}
            {item.p_value && (
              <div className="text-xs text-muted-foreground">p-value: {item.p_value}</div>
            )}
            {item.confidence_interval && (
              <div className="text-xs text-muted-foreground">
                CI: {item.confidence_interval}
              </div>
            )}
            {item.comparison && (
              <div className="text-xs text-muted-foreground">
                vs. {item.comparison}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderSafetyData = (safety) => {
    return (
      <div className="space-y-3">
        {safety.map((item, idx) => (
          <div key={idx} className="p-3 bg-muted/50 rounded-lg space-y-1">
            <div className="font-medium text-sm">
              {item.event || item.adverse_event || item.ae || `Safety Event ${idx + 1}`}
            </div>
            {item.incidence && (
              <div className="text-xs">
                <span className="text-muted-foreground">Incidence: </span>
                <span className="font-semibold">{item.incidence}</span>
              </div>
            )}
            {item.severity && (
              <div className="text-xs">
                <Badge 
                  variant={item.severity.toLowerCase().includes('serious') ? 'destructive' : 'outline'}
                  className="text-xs"
                >
                  {item.severity}
                </Badge>
              </div>
            )}
            {item.description && (
              <div className="text-xs text-muted-foreground">
                {item.description}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderCompetitorData = (competitors) => {
    return (
      <div className="space-y-3">
        {competitors.map((item, idx) => (
          <div key={idx} className="p-3 bg-muted/50 rounded-lg space-y-1">
            <div className="font-medium text-sm">
              {item.competitor || item.product || `Competitor ${idx + 1}`}
            </div>
            {item.comparison_metric && (
              <div className="text-xs text-muted-foreground">
                Metric: {item.comparison_metric}
              </div>
            )}
            {item.our_value && item.their_value && (
              <div className="text-xs">
                <span className="text-muted-foreground">Our Product: </span>
                <span className="font-semibold">{item.our_value}</span>
                <span className="text-muted-foreground"> vs </span>
                <span className="font-semibold">{item.their_value}</span>
              </div>
            )}
            {item.advantage && (
              <div className="text-xs">
                <Badge variant="secondary" className="text-xs">
                  {item.advantage}
                </Badge>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <BarChart3 className="w-4 h-4" />
          Available Clinical Data from PI Documents
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          This data will be used to generate charts and tables in your email
        </p>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" className="w-full">
          {structuredData.clinicalTrialResults && structuredData.clinicalTrialResults.length > 0 && (
            <AccordionItem value="trials">
              <AccordionTrigger className="text-sm">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Clinical Trial Results
                  {renderDataCount(structuredData.clinicalTrialResults)}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {renderClinicalTrials(structuredData.clinicalTrialResults)}
              </AccordionContent>
            </AccordionItem>
          )}

          {structuredData.efficacyData && structuredData.efficacyData.length > 0 && (
            <AccordionItem value="efficacy">
              <AccordionTrigger className="text-sm">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Efficacy Data
                  {renderDataCount(structuredData.efficacyData)}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {renderEfficacyData(structuredData.efficacyData)}
              </AccordionContent>
            </AccordionItem>
          )}

          {structuredData.safetyData && structuredData.safetyData.length > 0 && (
            <AccordionItem value="safety">
              <AccordionTrigger className="text-sm">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Safety Data
                  {renderDataCount(structuredData.safetyData)}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {renderSafetyData(structuredData.safetyData)}
              </AccordionContent>
            </AccordionItem>
          )}

          {structuredData.competitorComparison && structuredData.competitorComparison.length > 0 && (
            <AccordionItem value="competitors">
              <AccordionTrigger className="text-sm">
                <div className="flex items-center gap-2">
                  <Table2 className="w-4 h-4" />
                  Competitor Comparisons
                  {renderDataCount(structuredData.competitorComparison)}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {renderCompetitorData(structuredData.competitorComparison)}
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </CardContent>
    </Card>
  );
};