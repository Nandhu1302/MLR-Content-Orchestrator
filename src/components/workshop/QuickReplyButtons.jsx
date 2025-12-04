
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/*
// interface QuickReply {
//   label: string;
//   value: string;
// }
//
// interface QuickReplyButtonsProps {
//   options: QuickReply[];
//   onSelect: (value: string, label: string) => void;
//   disabled?: boolean;
// }
*/

export const QuickReplyButtons = ({ options, onSelect, disabled }) => {
  return (
    <div className="flex flex-wrap gap-2 pl-11">
      {options.map((option) => (
        <Button
          key={option.value}
          variant="outline"
          size="sm"
          onClick={() => onSelect(option.value, option.label)}
          disabled={disabled}
          className={cn(
            'rounded-full text-xs',
            'hover:bg-primary hover:text-primary-foreground',
            'transition-all'
          )}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
};
