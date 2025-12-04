
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

/*
interface MultiSelectQuestionProps {
  question: string;
  options: Array<{
    label: string;
    value: string;
    icon?: string;
  }>;
  onSubmit: (selectedValues: string[]) => void;
  disabled?: boolean;
}
*/

export const MultiSelectQuestion = ({ 
  question, 
  options, 
  onSubmit, 
  disabled 
} /*: MultiSelectQuestionProps*/ ) => {
  const [selected, setSelected] = useState/*<string[]>*/([]);

  const handleToggle = (value /*: string*/) => {
    setSelected(prev => 
      prev.includes(value) 
        ? prev.filter(v => v !== value)
        : [...prev, value]
    );
  };

  const handleSubmit = () => {
    if (selected.length > 0 && !disabled) {
      onSubmit(selected);
    }
  };

  return (
    <Card className="p-4 bg-primary/5 border-primary/20 ml-11">
      <p className="font-medium mb-3 text-foreground">{question}</p>
      <div className="flex flex-wrap gap-2 mb-3">
        {options.map(opt => {
          const isSelected = selected.includes(opt.value);
          return (
            <Button
              key={opt.value}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => handleToggle(opt.value)}
              disabled={disabled}
              className={cn(
                'rounded-full text-xs transition-all',
                isSelected && 'ring-2 ring-primary ring-offset-2'
              )}
            >
              {isSelected && <Check className="h-3 w-3 mr-1" />}
              {opt.icon} {opt.label}
            </Button>
          );
        })}
      </div>
      <Button 
        onClick={handleSubmit}
        disabled={selected.length === 0 || disabled}
        className="w-full"
        size="sm"
      >
        Submit Selection ({selected.length})
      </Button>
    </Card>
  );
};
