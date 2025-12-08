import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

// Removed interface ChartDataItem
// Removed interface IntelligenceDonutChartProps

// Removed : any type annotation
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-popover border border-border rounded-md shadow-lg px-3 py-2">
        <p className="text-sm font-medium" style={{ color: data.color }}>
          {data.name}
        </p>
        <p className="text-xs text-muted-foreground">
          {data.value} item{data.value !== 1 ? 's' : ''}
        </p>
      </div>
    );
  }
  return null;
};

export const IntelligenceDonutChart = ({ 
  data, 
  totalCount, 
  qualityScore,
  size = 'md' 
}) => { // Removed : IntelligenceDonutChartProps
  const SIZE_CONFIG = {
    sm: { width: 120, height: 120, innerRadius: 35, outerRadius: 50 },
    md: { width: 160, height: 160, innerRadius: 45, outerRadius: 65 },
    lg: { width: 200, height: 200, innerRadius: 55, outerRadius: 80 },
  };
  
  const config = SIZE_CONFIG[size];
  
  // Filter out zero values for cleaner chart
  const filteredData = data.filter(d => d.value > 0);
  
  // If no data, show empty state
  if (filteredData.length === 0) {
    return (
      <div 
        className="flex items-center justify-center bg-muted/30 rounded-full"
        style={{ width: config.width, height: config.height }}
      >
        <div className="text-center">
          <p className="text-lg font-bold text-muted-foreground">0</p>
          <p className="text-xs text-muted-foreground">No data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative" style={{ width: config.width, height: config.height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={filteredData}
            cx="50%"
            cy="50%"
            innerRadius={config.innerRadius}
            outerRadius={config.outerRadius}
            paddingAngle={2}
            dataKey="value"
            stroke="none"
          >
            {filteredData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      
      {/* Center label */}
      <div 
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
      >
        <span className="text-xl font-bold text-foreground">{totalCount}</span>
        {qualityScore !== undefined && (
          <span className="text-xs text-muted-foreground">{qualityScore}%</span>
        )}
      </div>
    </div>
  );
};