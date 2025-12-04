import ROICalculator from '@/pages/ROICalculator';

export const ROIAnalysisTab = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">ROI Analysis</h2>
        <p className="text-muted-foreground">
          Interactive ROI calculator with scenario analysis and comprehensive charts
        </p>
      </div>

      <ROICalculator embedded />
    </div>
  );
};