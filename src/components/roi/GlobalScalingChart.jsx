import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ROICalculatorService } from '@/services/roiCalculator';

export const GlobalScalingChart = ({ data }) => {
  // Generate data points for 1-10 markets
  const markets = Array.from({ length: 10 }, (_, i) => i + 1);
  
  const chartData = markets.map(marketCount => ({
    markets: marketCount,
    Email: data.byAssetType.email.global * marketCount / data.assumptions.avgMarketsPerAsset,
    DSA: data.byAssetType.dsa.global * marketCount / data.assumptions.avgMarketsPerAsset,
    Website: data.byAssetType.website.global * marketCount / data.assumptions.avgMarketsPerAsset,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Global Amplification Economics</CardTitle>
        <CardDescription>
          Value scaling with multi-market deployment per asset
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="markets" 
              stroke="hsl(var(--foreground))"
              tick={{ fill: 'hsl(var(--foreground))' }}
              label={{ value: 'Number of Markets', position: 'insideBottom', offset: -5, fill: 'hsl(var(--foreground))' }}
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
            <Area 
              type="monotone" 
              dataKey="Email" 
              stackId="1"
              stroke="hsl(221.2 83.2% 53.3%)" 
              fill="hsl(221.2 83.2% 53.3% / 0.6)" 
            />
            <Area 
              type="monotone" 
              dataKey="DSA" 
              stackId="1"
              stroke="hsl(271 91% 65%)" 
              fill="hsl(271 91% 65% / 0.6)" 
            />
            <Area 
              type="monotone" 
              dataKey="Website" 
              stackId="1"
              stroke="hsl(142 76% 36%)" 
              fill="hsl(142 76% 36% / 0.6)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};