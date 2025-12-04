import { Sparkles } from 'lucide-react';

export const BISlideLayout = ({ children, slideNumber, title, subtitle, section }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex flex-col print:min-h-0 print:h-screen print:break-after-page">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-16 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Glocalization Module</h1>
              <p className="text-sm text-muted-foreground">For Boehringer Ingelheim</p>
            </div>
          </div>
          {section && (
            <div className="text-right">
              <p className="text-sm font-medium text-primary">{section}</p>
              <p className="text-xs text-muted-foreground">Slide {slideNumber} of 16</p>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-16 py-12">
        {title && (
          <div className="mb-12">
            <h2 className="text-5xl font-bold text-foreground mb-4">{title}</h2>
            {subtitle && <p className="text-2xl text-muted-foreground">{subtitle}</p>}
          </div>
        )}
        {children}
      </div>

      {/* Footer */}
      <div className="border-t border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-16 py-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Content Orchestrator Platform</p>
          <p className="text-sm text-muted-foreground">Confidential & Proprietary</p>
        </div>
      </div>
    </div>
  );
};