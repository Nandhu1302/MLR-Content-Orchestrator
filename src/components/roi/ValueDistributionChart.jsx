import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ROICalculatorService } from '@/services/roiCalculator';

export const ValueDistributionChart = ({ data }) => {
  const chartData = [
    { name: 'Labor Efficiency', value: data.domestic.components.laborEfficiency },
    { name: 'Translation Savings', value: data.global.components.translationSavings },
    { name: 'Regulatory Efficiency', value: data.global.components.regulatoryEfficiency },
    { name: 'Quality Improvements', value: data.global.components.qualityImprovements },
    { name: 'Administrative', value: data.domestic.components.administrative },
    { name: 'MLR Cycle Reduction', value: data.domestic.components.mlrCycleReduction },
    { name: 'Baseline Savings', value: data.domestic.components.baselineSavings },
    { name: 'Rework Elimination', value: data.domestic.components.reworkElimination },
  ];

  const COLORS = [
    'hsl(142 76% 36%)', // Labor Efficiency - Green
    'hsl(200 100% 60%)', // Translation Savings - Blue
    'hsl(220 70% 50%)', // Regulatory Efficiency - Blue darker
    'hsl(30 100% 50%)', // Quality Improvements - Orange
    'hsl(280 100% 50%)', // Administrative - Purple
    'hsl(160 60% 45%)', // MLR Cycle Reduction - Teal
    'hsl(120 60% 50%)', // Baseline Savings - Green light
    'hsl(0 70% 50%)', // Rework Elimination - Red
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Value Distribution</CardTitle>
        <CardDescription>
          Percentage breakdown of {ROICalculatorService.formatCurrency(data.totalValue)} total value
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry) => `${((entry.value / data.totalValue) * 100).toFixed(1)}%`}
              outerRadius={120}
              fill="hsl(var(--primary))"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
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
              iconType="circle"
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};