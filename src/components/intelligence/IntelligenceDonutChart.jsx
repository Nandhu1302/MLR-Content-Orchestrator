import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';





const SIZE_CONFIG = {
  sm: { width, height, innerRadius, outerRadius },
  md: { width, height, innerRadius, outerRadius },
  lg: { width, height, innerRadius, outerRadius },
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      
        
          {data.name}
        
        
          {data.value} item{data.value !== 1 ? 's' : ''}
        
      
    );
  }
  return null;
};

export const IntelligenceDonutChart = ({ 
  data, 
  totalCount, 
  qualityScore,
  size = 'md' 
}) => {
  const config = SIZE_CONFIG[size];
  
  // Filter out zero values for cleaner chart
  const filteredData = data.filter(d => d.value > 0);
  
  // If no data, show empty state
  if (filteredData.length === 0) {
    return (
      
        
          0
          No data
        
      
    );
  }

  return (
    
      
        
          
            {filteredData.map((entry, index) => (
              
            ))}
          
          } />
        
      
      
      {/* Center label */}
      
        {totalCount}
        {qualityScore !== undefined && (
          {qualityScore}%
        )}
      
    
  );
};

export default IntelligenceDonutChart;
