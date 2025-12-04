import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ROICalculatorService } from '@/services/roiCalculator';

export const AssetSavingsChart = ({ data }) => {
  const chartData = [
    {
      asset: 'Email',
      'Domestic Savings': data.byAssetType.email.domestic,
      'Global Savings': data.byAssetType.email.global,
    },
    {
      asset: 'DSA',
      'Domestic Savings': data.byAssetType.dsa.domestic,
      'Global Savings': data.byAssetType.dsa.global,
    },
    {
      asset: 'Website',
      'Domestic Savings': data.byAssetType.website.domestic,
      'Global Savings': data.byAssetType.website.global,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Asset-Specific Savings</CardTitle>
        <CardDescription>
          Annual savings per asset by type and category
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="asset" 
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
            <Legend wrapperStyle={{ color: 'hsl(var(--foreground))' }} />
            <Bar dataKey="Domestic Savings" fill="hsl(221.2 83.2% 53.3%)" />
            <Bar dataKey="Global Savings" fill="hsl(271 91% 65%)" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};