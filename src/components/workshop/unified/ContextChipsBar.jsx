import { useState } from 'react';
import { X, Edit2, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export const ContextChipsBar = ({ context, onContextUpdate }) => {
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState('');

  const chips = [
    { 
      key: 'occasion', 
      label: 'Occasion', 
      value: context.detectedIntent?.occasion,
      icon: '📍'
    },
    { 
      key: 'audience', 
      label: 'Audience', 
      value: context.detectedIntent?.audience,
      icon: '👥'
    },
    { 
      key: 'goals', 
      label: 'Goal', 
      value: context.detectedIntent?.goals?.[0],
      icon: '🎯'
    },
    { 
      key: 'region', 
      label: 'Region', 
      value: context.detectedIntent?.region,
      icon: '🌍'
    },
  ].filter(chip => chip.value);

  const handleStartEdit = (key, currentValue) => {
    setEditingField(key);
    setEditValue(currentValue);
  };

  const handleSaveEdit = (key) => {
    if (editValue.trim()) {
      onContextUpdate({
        detectedIntent: {
          ...context.detectedIntent,
          [key]: editValue.trim()
        }
      });
    }
    setEditingField(null);
  };

  const handleRemove = (key) => {
    onContextUpdate({
      detectedIntent: {
        ...context.detectedIntent,
        [key]: undefined
      }
    });
  };

  return (
    <div className="flex flex-wrap gap-2">
      {chips.map(chip => (
        <Badge 
          key={chip.key}
          variant="secondary"
          className="px-3 py-1.5 flex items-center gap-2 group hover:bg-secondary/80 transition-colors"
        >
          <span>{chip.icon}</span>
          
          {editingField === chip.key ? (
            <div className="flex items-center gap-1">
              <Input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="h-6 w-24 text-xs"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveEdit(chip.key);
                  if (e.key === 'Escape') setEditingField(null);
                }}
              />
              <button
                onClick={() => handleSaveEdit(chip.key)}
                className="p-0.5 hover:bg-background/50 rounded"
              >
                <Check className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <>
              <span className="text-xs font-medium">{chip.value}</span>
              <button
                onClick={() => handleStartEdit(chip.key, chip.value)}
                className="p-0.5 opacity-0 group-hover:opacity-100 hover:bg-background/50 rounded transition-opacity"
              >
                <Edit2 className="h-3 w-3" />
              </button>
              <button
                onClick={() => handleRemove(chip.key)}
                className="p-0.5 opacity-0 group-hover:opacity-100 hover:bg-destructive/20 rounded transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
            </>
          )}
        </Badge>
      ))}
    </div>
  );
};