import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useBrand } from "@/contexts/BrandContext";
import { 
  analyzeContentForClaimTypes, 
  getRequiredSafetyTypesForClaims,
  isStatementRequiredForClaims,
  checkStatementPresence,
  // Removed: type ClaimType
} from "./utils/claimDetection";
import { 
  ShieldAlert, 
  CheckCircle, 
  AlertTriangle,
  Copy,
  Info,
  FileText
} from "lucide-react";
import { toast } from "sonner";

// Removed interface SafetyStatement
// Removed interface SafetyRequirementsPanelProps

export const SafetyRequirementsPanel = ({ 
  content, 
  assetType,
  onValidationUpdate 
}) => { // Removed : SafetyRequirementsPanelProps
  const { selectedBrand } = useBrand();
  // Removed <SafetyStatement[]> type annotation
  const [safetyStatements, setSafetyStatements] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // Removed <'all' | 'missing' | 'present'> type annotation
  const [filter, setFilter] = useState('all');

  // Analyze content for claim types
  const claimAnalysis = useMemo(() => {
    return analyzeContentForClaimTypes(content);
  }, [content]);

  // Get required safety types based on detected claims
  const requiredSafetyTypes = useMemo(() => {
    return getRequiredSafetyTypesForClaims(claimAnalysis.detectedTypes);
  }, [claimAnalysis.detectedTypes]);

  useEffect(() => {
    loadSafetyStatements();
  }, [selectedBrand?.id, content, requiredSafetyTypes]);

  const loadSafetyStatements = async () => {
    if (!selectedBrand?.id) return;
    
    setIsLoading(true);
    try {
      // Build query - if we have detected claim types, filter to relevant safety statements
      let query = supabase
        .from('safety_statements')
        .select('*')
        .eq('brand_id', selectedBrand.id)
        .order('severity', { ascending: false });

      // If we detected claims, filter to relevant safety statement types
      if (requiredSafetyTypes.length > 0) {
        query = query.in('statement_type', requiredSafetyTypes);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Process statements with context-aware logic
      // Removed (data || []).map(stmt => ...
      const statementsWithContext = (data || []).map(stmt => {
        // Check presence using enhanced detection
        const presenceResult = checkStatementPresence(stmt.statement_text, content);
        
        // Determine if required based on:
        // 1. If statement_type maps to detected claim types (primary logic)
        // 2. If fda_required is true
        // 3. If severity is critical
        const isContextRequired = 
          stmt.fda_required ||
          stmt.severity === 'critical' ||
          isStatementRequiredForClaims(stmt.statement_type, claimAnalysis.detectedTypes);

        return {
          ...stmt,
          is_present: presenceResult.isPresent,
          matchedPhrases: presenceResult.matchedPhrases,
          is_required: isContextRequired
        };
      });

      setSafetyStatements(statementsWithContext);

      // Calculate summary
      const required = statementsWithContext.filter(s => s.is_required).length;
      const present = statementsWithContext.filter(s => s.is_present).length;
      const missing = statementsWithContext.filter(s => s.is_required && !s.is_present).length;
      
      onValidationUpdate({ required, present, missing });

    } catch (error) {
      console.error('Error loading safety statements:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Removed (statement: SafetyStatement) type annotation
  const handleInsertStatement = (statement) => {
    document.dispatchEvent(new CustomEvent('smartInsertTemplate', {
      detail: {
        insertionType: 'safety',
        insertionText: statement.statement_text
      }
    }));
    toast.success('Safety statement inserted');
  };

  // Removed (text: string) type annotation
  const handleCopyStatement = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const getFilteredStatements = () => {
    switch (filter) {
      case 'missing': return safetyStatements.filter(s => s.is_required && !s.is_present);
      case 'present': return safetyStatements.filter(s => s.is_present);
      default: return safetyStatements;
    }
  };

  // Removed (severity: string) type annotation
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      default: return 'outline';
    }
  };

  // Removed (type: string) type annotation
  const getTypeLabel = (type) => {
    switch (type) {
      case 'boxed_warning': return 'Boxed Warning';
      case 'contraindication': return 'Contraindication';
      case 'warning': return 'Warning';
      case 'precaution': return 'Precaution';
      case 'warning_precaution': return 'Warning/Precaution';
      case 'adverse_reaction': return 'Adverse Reaction';
      default: return type;
    }
  };

  const requiredCount = safetyStatements.filter(s => s.is_required).length;
  const presentCount = safetyStatements.filter(s => s.is_present).length;
  const missingRequired = safetyStatements.filter(s => s.is_required && !s.is_present).length;
  const hasContent = content && content.trim().length > 0;

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <ShieldAlert className="h-4 w-4" />
            Safety Requirements
          </h3>
          {isLoading && <Badge variant="outline" className="text-xs">Loading...</Badge>}
        </div>
        
        {/* Claim Detection Info */}
        {hasContent && claimAnalysis.detectedTypes.length > 0 && (
          <div className="flex items-center gap-1 mb-2 flex-wrap">
            <FileText className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Detected:</span>
            {claimAnalysis.detectedTypes.map(type => (
              <Badge key={type} variant="outline" className="text-xs">
                {type}
              </Badge>
            ))}
          </div>
        )}
        
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant={missingRequired > 0 ? "destructive" : "default"} className="text-xs">
            {missingRequired} Missing Required
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {presentCount}/{safetyStatements.length} Present
          </Badge>
        </div>

        <div className="flex gap-1 mt-3">
          {(['all', 'missing', 'present']).map((f) => (
            <Button
              key={f}
              size="sm"
              variant={filter === f ? 'default' : 'ghost'}
              onClick={() => setFilter(f)}
              className="text-xs px-2 py-1 h-6"
            >
              {f === 'all' ? 'All' : f === 'missing' ? 'Missing' : 'Present'}
            </Button>
          ))}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {isLoading ? (
            <div className="text-center py-8">
              <ShieldAlert className="h-8 w-8 text-muted-foreground mx-auto mb-2 animate-pulse" />
              <p className="text-sm text-muted-foreground">Loading safety requirements...</p>
            </div>
          ) : !hasContent ? (
            <div className="text-center py-8">
              <ShieldAlert className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Add content to analyze safety requirements</p>
              <p className="text-xs text-muted-foreground mt-1">
                Requirements will be shown based on detected claim types
              </p>
            </div>
          ) : getFilteredStatements().length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                {filter === 'missing' ? 'No missing required statements' : 
                 claimAnalysis.detectedTypes.length === 0 ? 'No claims detected in content' :
                 'No safety statements found'}
              </p>
            </div>
          ) : (
            getFilteredStatements().map((statement) => (
              <Card 
                key={statement.id}
                className={`${!statement.is_present && statement.is_required ? 'border-destructive/50 bg-destructive/5' : ''}`}
              >
                <CardHeader className="pb-2 pt-3 px-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {statement.is_present ? (
                        <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                      ) : statement.is_required ? (
                        <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
                      ) : (
                        <Info className="h-4 w-4 text-muted-foreground shrink-0" />
                      )}
                      <Badge variant={getSeverityColor(statement.severity)} className="text-xs">
                        {getTypeLabel(statement.statement_type)}
                      </Badge>
                      {statement.is_required && (
                        <Badge variant="outline" className="text-xs">Required</Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0 px-3 pb-3">
                  <p className="text-xs leading-relaxed line-clamp-3 mb-2">
                    {statement.statement_text}
                  </p>
                  
                  {/* Show matched phrases if present */}
                  {statement.is_present && statement.matchedPhrases && statement.matchedPhrases.length > 0 && (
                    <div className="text-xs text-green-600 mb-2">
                      ✓ Found: "{statement.matchedPhrases[0].substring(0, 40)}..."
                    </div>
                  )}
                  
                  {!statement.is_present && (
                    <div className="flex gap-2 pt-2 border-t">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-xs h-7"
                        onClick={() => handleInsertStatement(statement)}
                      >
                        Insert
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        className="text-xs h-7"
                        onClick={() => handleCopyStatement(statement.statement_text)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};