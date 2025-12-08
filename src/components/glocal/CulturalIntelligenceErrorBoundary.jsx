import React, { Component } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

class CulturalIntelligenceErrorBoundary extends Component {
  state = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('CulturalIntelligenceHub Error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    this.props.onReset?.();
  };

  handleGoHome = () => {
    window.location.href = '/glocalization';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-[60vh] p-6">
          <div className="max-w-2xl w-full space-y-6">
            <Alert variant="destructive">
              <AlertTriangle className="h-5 w-5" />
              <AlertTitle className="text-lg font-semibold">
                Cultural Intelligence Analysis Error
              </AlertTitle>
              <AlertDescription className="mt-2 space-y-2">
                <p className="text-sm">
                  The Cultural Intelligence Hub encountered an unexpected error and couldn't render properly.
                </p>
                {this.state.error && (
                  <details className="mt-3 text-xs">
                    <summary className="cursor-pointer font-medium hover:underline">
                      Technical Details
                    </summary>
                    <pre className="mt-2 p-3 bg-destructive/10 rounded border border-destructive/20 overflow-x-auto">
                      {this.state.error.message}
                      {this.state.error.stack && `\n\n${this.state.error.stack}`}
                    </pre>
                  </details>
                )}
              </AlertDescription>
            </Alert>

            <div className="flex gap-3 justify-center">
              <Button 
                onClick={this.handleRetry}
                variant="outline"
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
              <Button 
                onClick={this.handleGoHome}
                variant="default"
                className="gap-2"
              >
                <Home className="h-4 w-4" />
                Go to Glocalization Hub
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              If this error persists, try refreshing the page or contact support.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export {CulturalIntelligenceErrorBoundary};