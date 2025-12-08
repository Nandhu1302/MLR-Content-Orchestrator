import { Card } from "@/components/ui/card";
import { useDataIntelligence } from "@/hooks/useDataIntelligence";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp } from "lucide-react";

// The function declaration does not change
function CampaignPerformanceTrends({ brandId, filters }) {
  const { contentTrends, isLoading } = useDataIntelligence(brandId, 90, filters);

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-muted rounded w-1/3"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="h-5 w-5" />
        <h3 className="font-semibold">Performance Trends</h3>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={contentTrends}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(date) =>
              new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            }
          />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip
            labelFormatter={(date) => new Date(date).toLocaleDateString()}
            formatter={(value) => `${Number(value).toFixed(2)}%`}
          />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="engagement_rate"
            stroke="hsl(var(--primary))"
            name="Engagement Rate"
            strokeWidth={2}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="conversion_rate"
            stroke="hsl(var(--secondary))"
            name="Conversion Rate"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}

// 🎯 FIX: Changed 'export default' to 'export const' or in this case 'export' on the function itself
export { CampaignPerformanceTrends }; // Exporting the component as a Named Export