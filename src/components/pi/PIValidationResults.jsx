import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Shield,
  FileCheck
} from 'lucide-react';

export const PIValidationResults = ({ result, piDocuments }) => {
  const getComplianceIcon = () => {
    switch (result.overallCompliance) {
      case 'compliant':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'violation':
        return <XCircle className="w-5 h-5 text-red-600" />;
    }
  };

  const getComplianceColor = () => {
    switch (result.overallCompliance) {
      case 'compliant':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'violation':
        return 'text-red-600 bg-red-50 border-red-200';
    }
  };

  const getSeverityBadge = (severity) => {
    const variants = {
      critical: 'bg-red-100 text-red-800 border-red-300',
      high: 'bg-orange-100 text-orange-800 border-orange-300',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      low: 'bg-blue-100 text-blue-800 border-blue-300'
    };
    return (
      <Badge variant="outline" className={variants[severity]}>
        {severity.toUpperCase()}
      </Badge>
    );
  };

  const getStatusBadge = (status) => {
    const variants = {
      verified: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      unverified: 'bg-gray-100 text-gray-800'
    };
    return <Badge className={variants[status]}>{status}</Badge>;
  };

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            PI Compliance Validation
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm font-normal text-muted-foreground">
              Score: <span className="font-bold text-lg">{result.complianceScore}/100</span>
            </div>
            {getComplianceIcon()}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Status */}
        <Alert className={getComplianceColor()}>
          <AlertDescription className="flex items-center justify-between">
            <span className="font-semibold">
              {result.overallCompliance === 'compliant' && 'Content is compliant with PI documentation'}
              {result.overallCompliance === 'warning' && 'Content has compliance warnings'}
              {result.overallCompliance === 'violation' && 'Content has compliance violations'}
            </span>
          </AlertDescription>
        </Alert>

        {/* Summary */}
        <div className="bg-muted/50 p-4 rounded-lg">
          <p className="text-sm">{result.summary}</p>
        </div>

        {/* PI Documents Referenced */}
        {piDocuments && piDocuments.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <FileCheck className="w-4 h-4" />
              PI Documents Validated Against
            </h4>
            <div className="space-y-1">
              {piDocuments.map((doc, idx) => (
                <div key={idx} className="text-sm text-muted-foreground">
                  • {doc.drug_name} ({doc.version})
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Issues */}
        {result.issues.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Issues Found ({result.issues.length})
            </h4>
            <ScrollArea className="h-[300px]">
              <div className="space-y-3 pr-4">
                {result.issues.map((issue, idx) => (
                  <Card key={idx} className="border-l-4 border-l-orange-500">
                    <CardContent className="p-4 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {getSeverityBadge(issue.severity)}
                            <span className="text-xs text-muted-foreground">
                              {issue.type.replace(/_/g, ' ')}
                            </span>
                          </div>
                          <p className="font-semibold text-sm">{issue.claim}</p>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <span className="font-medium">Issue:</span> {issue.issue}
                      </div>
                      {issue.piReference && (
                        <div className="text-xs bg-muted p-2 rounded">
                          <span className="font-medium">PI Reference:</span> {issue.piReference}
                        </div>
                      )}
                      <div className="text-sm bg-green-50 text-green-800 p-2 rounded">
                        <span className="font-medium">Suggestion:</span> {issue.suggestion}
                      </div>
                      {issue.location !== 'general' && (
                        <div className="text-xs text-muted-foreground">
                          Location: {issue.location}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Validated Claims */}
        {result.validatedClaims.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              Verified Claims ({result.validatedClaims.length})
            </h4>
            <ScrollArea className="h-[200px]">
              <div className="space-y-2 pr-4">
                {result.validatedClaims.map((claim, idx) => (
                  <div key={idx} className="flex items-start justify-between gap-2 p-3 bg-muted/50 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm">{claim.claim}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Source: {claim.piSource}
                      </p>
                    </div>
                    {getStatusBadge(claim.status)}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* No Issues */}
        {result.issues.length === 0 && result.validatedClaims.length === 0 && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <AlertDescription className="text-green-800">
              No issues detected. Content appears to be compliant with linked PI documents.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};