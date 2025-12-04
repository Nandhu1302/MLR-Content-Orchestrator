import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const TimelineComparisonChart = ({ data }) => {
  const chartData = data.timelineReductions.map(item => ({
    asset: item.assetType,
    'Before Platform': item.baseline,
    'After Platform': item.platform,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Timeline Comparison</CardTitle>
        <CardDescription>
          Time-to-market reduction by asset type (weeks)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              type="number" 
              stroke="hsl(var(--foreground))"
              tick={{ fill: 'hsl(var(--foreground))' }}
              label={{ value: 'Weeks', position: 'insideBottom', offset: -5, fill: 'hsl(var(--foreground))' }}
            />
            <YAxis 
              dataKey="asset" 
              type="category" 
              stroke="hsl(var(--foreground))"
              tick={{ fill: 'hsl(var(--foreground))' }}
            />
            <Tooltip 
              formatter={(value) => `${value} weeks`}
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--foreground))',
              }}
            />
            <Legend wrapperStyle={{ color: 'hsl(var(--foreground))' }} />
            <Bar dataKey="Before Platform" fill="hsl(0 84.2% 60.2%)" />
            <Bar dataKey="After Platform" fill="hsl(142 76% 36%)" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};