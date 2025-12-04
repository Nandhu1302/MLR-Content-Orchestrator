import React from 'react';
import { ChevronRight, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const LocalizationBreadcrumb = ({
  currentPhase,
  assetName,
  onBack
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between py-2 px-1 bg-muted/30 rounded-lg mb-4">
      <nav className="flex items-center gap-2 text-sm">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/')}
          className="text-muted-foreground hover:text-foreground h-8 px-2"
        >
          <Home className="h-3 w-3 mr-1" />
          Dashboard
        </Button>
        <ChevronRight className="h-3 w-3 text-muted-foreground" />
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/localization')}
          className="text-muted-foreground hover:text-foreground h-8 px-2"
        >
          Localization Hub
        </Button>
        {currentPhase && (
          <>
            <ChevronRight className="h-3 w-3 text-muted-foreground" />
            <span className="text-primary font-medium text-sm">{currentPhase}</span>
          </>
        )}
        {assetName && (
          <>
            <span className="text-muted-foreground mx-1">•</span>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
              {assetName}
            </span>
          </>
        )}
      </nav>
      
      <div className="flex items-center gap-1">
        {onBack && (
          <Button variant="ghost" size="sm" onClick={onBack} className="h-8 px-2">
            <ArrowLeft className="h-3 w-3 mr-1" />
            Back
          </Button>
        )}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate('/localization')}
          className="h-8 px-2"
        >
          <Home className="h-3 w-3 mr-1" />
          Hub
        </Button>
      </div>
    </div>
  );
};
