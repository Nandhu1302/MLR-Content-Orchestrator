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
  type ClaimType
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



) => void;
}

const SafetyRequirementsPanel = ({ 
  content, 
  assetType,
  onValidationUpdate 
}) => {
  const { selectedBrand } = useBrand();
  const [safetyStatements, setSafetyStatements] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
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
        .order('severity', { ascending });

      // If we detected claims, filter to relevant safety statement types
      if (requiredSafetyTypes.length > 0) {
        query = query.in('statement_type', requiredSafetyTypes);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Process statements with context-aware logic
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
          is_present.isPresent,
          matchedPhrases.matchedPhrases,
          is_required
        };
      });

      setSafetyStatements(statementsWithContext);

      // Calculate summary
      const required = statementsWithContext.filter(s => s.is_required).length;
      const present = statementsWithContext.filter(s => s.is_present).length;
      const missing = statementsWithContext.filter(s => s.is_required && !s.is_present).length;
      
      onValidationUpdate({ required, present, missing });

    } catch (error) {
      console.error('Error loading safety statements, error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInsertStatement = (statement) => {
    document.dispatchEvent(new CustomEvent('smartInsertTemplate', {
      detail: {
        insertionType,
        insertionText.statement_text
      }
    }));
    toast.success('Safety statement inserted');
  };

  const handleCopyStatement = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const getFilteredStatements = () => {
    switch (filter) {
      case 'missing' safetyStatements.filter(s => s.is_required && !s.is_present);
      case 'present' safetyStatements.filter(s => s.is_present);
      default safetyStatements;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical' 'destructive';
      case 'high' 'destructive';
      case 'medium' 'secondary';
      default 'outline';
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'boxed_warning' 'Boxed Warning';
      case 'contraindication' 'Contraindication';
      case 'warning' 'Warning';
      case 'precaution' 'Precaution';
      case 'warning_precaution' 'Warning/Precaution';
      case 'adverse_reaction' 'Adverse Reaction';
      default type;
    }
  };

  const requiredCount = safetyStatements.filter(s => s.is_required).length;
  const presentCount = safetyStatements.filter(s => s.is_present).length;
  const missingRequired = safetyStatements.filter(s => s.is_required && !s.is_present).length;
  const hasContent = content && content.trim().length > 0;

  return (
    
      
        
          
            
            Safety Requirements
          
          {isLoading && Loading...}
        
        
        {/* Claim Detection Info */}
        {hasContent && claimAnalysis.detectedTypes.length > 0 && (
          
            
            Detected/span>
            {claimAnalysis.detectedTypes.map(type => (
              
                {type}
              
            ))}
          
        )}
        
        
           0 ? "destructive" : "default"} className="text-xs">
            {missingRequired} Missing Required
          
          
            {presentCount}/{safetyStatements.length} Present
          
        

        
          {(['all', 'missing', 'present'] as const).map((f) => (
             setFilter(f)}
              className="text-xs px-2 py-1 h-6"
            >
              {f === 'all' ? 'All'  === 'missing' ? 'Missing' }
            
          ))}
        
      

      
        
          {isLoading ? (
            
              
              Loading safety requirements...
            
          ) : !hasContent ? (
            
              
              Add content to analyze safety requirements
              
                Requirements will be shown based on detected claim types
              
            
          ) ().length === 0 ? (
            
              
              
                {filter === 'missing' ? 'No missing required statements' .detectedTypes.length === 0 ? 'No claims detected in content'  safety statements found'}
              
            
          ) : (
            getFilteredStatements().map((statement) => (
              
                
                  
                    
                      {statement.is_present ? (
                        
                      ) .is_required ? (
                        
                      ) : (
                        
                      )}
                      
                        {getTypeLabel(statement.statement_type)}
                      
                      {statement.is_required && (
                        Required
                      )}
                    
                  
                
                
                
                  
                    {statement.statement_text}
                  
                  
                  {/* Show matched phrases if present */}
                  {statement.is_present && statement.matchedPhrases && statement.matchedPhrases.length > 0 && (
                    
                      ✓ Found: "{statement.matchedPhrases[0].substring(0, 40)}..."
                    
                  )}
                  
                  {!statement.is_present && (
                    
                       handleInsertStatement(statement)}
                      >
                        Insert
                      
                       handleCopyStatement(statement.statement_text)}
                      >
                        
                      
                    
                  )}
                
              
            ))
          )}
        
      
    
  );
};


export default SafetyRequirementsPanel;
