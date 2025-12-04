import React, { Component } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCcw, ArrowLeft } from 'lucide-react';

export class ContentEditorErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ContentEditor Error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    // Component will re-render automatically with reset state
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-96 text-center p-8">
          <AlertCircle className="h-16 w-16 text-destructive mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Something went wrong</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            {this.state.error?.message || 'An unexpected error occurred while loading the content editor.'}
          </p>
          <div className="flex gap-3">
            <Button onClick={this.handleReset} variant="default">
              <RefreshCcw className="h-4 w-4 mr-2" />
              Reload Editor
            </Button>
            {this.props.onBack && (
              <Button onClick={this.props.onBack} variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}