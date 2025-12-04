import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, RefreshCw, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

export const ConnectionDiagnostics = () => {
  const [isInIframe, setIsInIframe] = useState(false);
  const [healthStatus, setHealthStatus] = useState('checking');
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  useEffect(() => {
    // Detect if running in iframe
    const inIframe = window.self !== window.top;
    setIsInIframe(inIframe);
    
    // Only show diagnostics if in iframe or after connection issues
    if (inIframe) {
      checkHealth();
    }
  }, []);

  const checkHealth = async () => {
    setHealthStatus('checking');
    try {
      const { data, error } = await supabase.functions.invoke('health-check');
      
      if (error) throw error;
      
      if (data?.status === 'healthy') {
        setHealthStatus('healthy');
        // Hide diagnostics after 3 seconds if healthy
        setTimeout(() => setShowDiagnostics(false), 3000);
      } else {
        setHealthStatus('unhealthy');
        setShowDiagnostics(true);
      }
    } catch (error) {
      console.error('Health check failed:', error);
      setHealthStatus('unhealthy');
      setShowDiagnostics(true);
    }
  };

  const openInNewTab = () => {
    window.open(window.location.href, '_blank');
  };

  if (!showDiagnostics && healthStatus === 'healthy') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      {healthStatus === 'checking' && isInIframe && (
        <Alert>
          <RefreshCw className="h-4 w-4 animate-spin" />
          <AlertTitle>Checking Connection...</AlertTitle>
          <AlertDescription>
            Verifying backend connectivity
          </AlertDescription>
        </Alert>
      )}

      {healthStatus === 'healthy' && isInIframe && (
        <Alert>
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle>Connection Healthy</AlertTitle>
          <AlertDescription>
            All systems operational
          </AlertDescription>
        </Alert>
      )}

      {healthStatus === 'unhealthy' && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Connection Issue Detected</AlertTitle>
          <AlertDescription className="space-y-3">
            <p>Unable to reach backend services. This may be due to:</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Browser extension blocking the connection</li>
              <li>Network firewall restrictions</li>
              <li>Corporate proxy settings</li>
            </ul>
            
            <div className="flex gap-2 mt-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={checkHealth}
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Retry
              </Button>
              {isInIframe && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={openInNewTab}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Open Directly
                </Button>
              )}
            </div>

            {isInIframe && (
              <p className="text-xs mt-2 opacity-75">
                If issue persists, try disabling browser extensions or opening in incognito mode.
              </p>
            )}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};