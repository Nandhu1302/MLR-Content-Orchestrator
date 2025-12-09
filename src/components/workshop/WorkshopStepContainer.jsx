import React from 'react'; // Explicit React import is good practice in JSX files
import { cn } from '@/lib/utils';

// Removed the interface WorkshopStepContainerProps and ReactNode type import

export const WorkshopStepContainer = ({ 
  children, 
  className 
}) => {
  return (
    <div className={cn(
      "container mx-auto px-4 py-8 max-w-5xl animate-fade-in",
      className
    )}>
      {children}
    </div>
  );
};