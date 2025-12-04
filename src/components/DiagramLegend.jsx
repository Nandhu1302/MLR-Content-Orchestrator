export const DiagramLegend = ({ type }) => {
  const getLegendItems = () => {
    switch (type) {
      case 'c4-context':
      case 'c4-container':
      case 'c4-component':
        return [
          { color: 'bg-[#3b82f6]', label: 'User/Actor', border: 'border-[#2563eb]' },
          { color: 'bg-[#8b5cf6]', label: 'System/Service', border: 'border-[#7c3aed]' },
          { color: 'bg-[#10b981]', label: 'External System', border: 'border-[#059669]' },
          { color: 'bg-[#f59e0b]', label: 'Data Store', border: 'border-[#d97706]' },
        ];
      
      case 'deployment':
        return [
          { color: 'bg-[#3b82f6]', label: 'Global/CDN', border: 'border-[#2563eb]' },
          { color: 'bg-[#8b5cf6]', label: 'Compute/Services', border: 'border-[#7c3aed]' },
          { color: 'bg-[#10b981]', label: 'Data Layer', border: 'border-[#059669]' },
          { color: 'bg-[#ef4444]', label: 'Security', border: 'border-[#dc2626]' },
        ];
      
      case 'erd':
        return [
          { color: 'bg-background', label: 'Entity (Table)', border: 'border-border' },
          { label: 'PK = Primary Key' },
          { label: 'FK = Foreign Key' },
          { label: 'UK = Unique Key' },
          { label: '||--o{ = One to Many' },
          { label: '||--|| = One to One' },
        ];
      
      case 'sequence-translation':
      case 'sequence-cultural':
        return [
          { label: 'Actor = User/System' },
          { label: 'Solid arrow = Sync call' },
          { label: 'Dashed arrow = Response' },
          { label: 'alt/loop = Control flow' },
          { label: 'par = Parallel execution' },
        ];
      
      case 'data-flow':
        return [
          { color: 'bg-[#3b82f6]', label: 'Input Source', border: 'border-[#2563eb]' },
          { color: 'bg-[#8b5cf6]', label: 'Processing', border: 'border-[#7c3aed]' },
          { color: 'bg-[#10b981]', label: 'Quality/Validation', border: 'border-[#059669]' },
          { color: 'bg-[#f59e0b]', label: 'Storage', border: 'border-[#d97706]' },
          { color: 'bg-[#ef4444]', label: 'Output/Analytics', border: 'border-[#dc2626]' },
        ];
      
      default:
        return [];
    }
  };

  const items = getLegendItems();

  if (items.length === 0) return null;

  return (
    <div className="mt-4 p-3 bg-muted/30 rounded-lg border border-border">
      <h4 className="text-xs font-semibold text-foreground mb-2">Legend</h4>
      <div className="grid grid-cols-2 gap-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            {item.color && (
              <div
                className={`w-3 h-3 rounded border-2 ${item.color} ${item.border}`}
              />
            )}
            <span className="text-xs text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};