
import { Card } from '@/components/ui/card';
import { FileText, Layers } from 'lucide-react';

/*
interface InitiativeTypeSelectorProps {
  selected: 'single' | 'campaign' | null;
  onSelect: (type: 'single' | 'campaign') => void;
}
*/

export const InitiativeTypeSelector = ({ selected, onSelect }) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">What are you creating?</h3>
        <p className="text-sm text-muted-foreground">Choose your initiative type</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card
          className={`p-6 cursor-pointer transition-all hover:border-primary/50 ${
            selected === 'single' ? 'border-primary bg-primary/5' : ''
          }`}
          onClick={() => onSelect('single')}
        >
          <div className="flex flex-col items-center text-center space-y-3">
            <div className={`p-3 rounded-lg ${selected === 'single' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-semibold mb-1">Single Asset</h4>
              <p className="text-xs text-muted-foreground">
                Create one focused piece of content
              </p>
            </div>
          </div>
        </Card>

        <Card
          className={`p-6 cursor-pointer transition-all hover:border-primary/50 ${
            selected === 'campaign' ? 'border-primary bg-primary/5' : ''
          }`}
          onClick={() => onSelect('campaign')}
        >
          <div className="flex flex-col items-center text-center space-y-3">
            <div className={`p-3 rounded-lg ${selected === 'campaign' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
              <Layers className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-semibold mb-1">Multi-Asset Campaign</h4>
              <p className="text-xs text-muted-foreground">
                Coordinated content across channels
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
