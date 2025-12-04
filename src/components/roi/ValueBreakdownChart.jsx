import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ROICalculatorService } from '@/services/roiCalculator';

export const ValueBreakdownChart = ({ data }) => {
  const chartData = [
    {
      category: 'Domestic Operations',
      'Labor Efficiency': data.domestic.components.laborEfficiency,
      'MLR Cycle Reduction': data.domestic.components.mlrCycleReduction,
      'Administrative': data.domestic.components.administrative,
      'Baseline Savings': data.domestic.components.baselineSavings,
      'Rework Elimination': data.domestic.components.reworkElimination,
    },
    {
      category: 'Global Amplification',
      'Translation Savings': data.global.components.translationSavings,
      'Quality Improvements': data.global.components.qualityImprovements,
      'Regulatory Efficiency': data.global.components.regulatoryEfficiency,
    },
  ];

  const domesticColors = {
    'Labor Efficiency': 'hsl(221.2 83.2% 53.3%)',
    'MLR Cycle Reduction': 'hsl(221.2 83.2% 48%)',
    'Administrative': 'hsl(221.2 83.2% 43%)',
    'Baseline Savings': 'hsl(221.2 83.2% 38%)',
    'Rework Elimination': 'hsl(221.2 83.2% 33%)',
  };

  const globalColors = {
    'Translation Savings': 'hsl(271 91% 60%)',
    'Quality Improvements': 'hsl(271 91% 55%)',
    'Regulatory Efficiency': 'hsl(271 91% 50%)',
  };

  const allColors = { ...domesticColors, ...globalColors };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Total Value Breakdown</CardTitle>
        <CardDescription>
          {ROICalculatorService.formatCurrency(data.totalValue)} total annual value per brand
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="category" 
              stroke="hsl(var(--foreground))"
              tick={{ fill: 'hsl(var(--foreground))' }}
            />
            <YAxis 
              stroke="hsl(var(--foreground))"
              tick={{ fill: 'hsl(var(--foreground))' }}
              tickFormatter={(value) => ROICalculatorService.formatCurrency(value)}
            />
            <Tooltip 
              formatter={(value) => ROICalculatorService.formatCurrency(value)}
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--foreground))',
              }}
            />
            <Legend 
              wrapperStyle={{ color: 'hsl(var(--foreground))' }}
            />
            {Object.keys(allColors).map((key) => (
              <Bar 
                key={key}
                dataKey={key} 
                stackId="a" 
                fill={allColors[key]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};