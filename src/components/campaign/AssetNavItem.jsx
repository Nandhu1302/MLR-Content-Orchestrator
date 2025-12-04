import { cn } from '@/lib/utils';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';

const STATUS_CONFIG = {
  'queued': { 
    icon: Circle, 
    color: 'text-muted-foreground',
    borderColor: 'border-l-muted-foreground/30',
    spinning: false
  },
  'in-progress': { 
    icon: Loader2, 
    color: 'text-primary',
    borderColor: 'border-l-primary',
    spinning: true
  },
  'draft': { 
    icon: Loader2, 
    color: 'text-primary',
    borderColor: 'border-l-primary',
    spinning: false
  },
  'review': { 
    icon: Loader2, 
    color: 'text-warning',
    borderColor: 'border-l-warning',
    spinning: false
  },
  'complete': { 
    icon: CheckCircle2, 
    color: 'text-success',
    borderColor: 'border-l-success',
    spinning: false
  },
};

export const AssetNavItem = ({ 
  asset, 
  isActive, 
  onClick, 
  order,
}) => {
  const statusConfig = STATUS_CONFIG[asset.status];
  const Icon = statusConfig.icon;

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left rounded-md border-l-3 transition-all',
        'hover:bg-accent/50 py-2.5 px-3',
        isActive && [
          'bg-primary/5 border-l-primary',
          'shadow-sm'
        ],
        !isActive && [
          statusConfig.borderColor,
          'border-l-2'
        ],
        asset.status === 'complete' && !isActive && 'opacity-75'
      )}
    >
      <div className="flex items-center gap-2.5">
        {/* Order Number */}
        <div className={cn(
          'flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold',
          isActive 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-muted text-muted-foreground'
        )}>
          {order}
        </div>

        {/* Asset Info */}
        <div className="flex-1 min-w-0">
          <div className={cn(
            'text-sm truncate',
            isActive ? 'font-medium text-foreground' : 'text-foreground/80'
          )}>
            {asset.assetName}
          </div>
          <div className="text-[11px] text-muted-foreground capitalize">
            {asset.assetType.replace(/-/g, ' ')}
          </div>
        </div>

        {/* Status Icon */}
        <Icon className={cn(
          'h-4 w-4 flex-shrink-0',
          statusConfig.color,
          statusConfig.spinning && 'animate-spin'
        )} />
      </div>
    </button>
  );
};