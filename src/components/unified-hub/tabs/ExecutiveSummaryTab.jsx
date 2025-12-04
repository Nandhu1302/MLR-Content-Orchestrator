import ExecutiveSummary from '@/pages/ExecutiveSummary';

export const ExecutiveSummaryTab = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Executive Summary</h2>
        <p className="text-muted-foreground">
          2-page printable ROI summary for stakeholder presentations
        </p>
      </div>

      <ExecutiveSummary embedded />
    </div>
  );
};