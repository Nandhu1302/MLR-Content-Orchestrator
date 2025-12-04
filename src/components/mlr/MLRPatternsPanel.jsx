import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { 
  TrendingDown, 
  CheckCircle,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { getSeverityIconWithRate, getSeverityColor } from "./utils/mlrHelpers";



const MLRPatternsPanel = ({ 
  content,
  onPatternDetected
}) => {
  const [patterns, setPatterns] = useState([]);
  const [contentMatches, setContentMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedPattern, setExpandedPattern] = useState(null);

  useEffect(() => {
    loadPatterns();
  }, []);

  useEffect(() => {
    if (patterns.length > 0 && content) {
      detectPatterns();
    }
  }, [content, patterns]);

  const loadPatterns = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('mlr_decision_patterns')
        .select('*')
        .order('approval_rate', { ascending });

      if (error) throw error;
      setPatterns(data || []);

    } catch (error) {
      console.error('Error loading MLR patterns:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const detectPatterns = () => {
    const contentLower = content.toLowerCase();
    const matches = [];

    patterns.forEach(pattern => {
      const matchedKeywords = [];
      const locations = [];

      pattern.detection_keywords?.forEach(keyword => {
        const keywordLower = keyword.toLowerCase();
        let index = contentLower.indexOf(keywordLower);
        while (index !== -1) {
          matchedKeywords.push(keyword);
          locations.push(index);
          index = contentLower.indexOf(keywordLower, index + 1);
        }
      });

      if (matchedKeywords.length > 0) {
        matches.push({
          pattern,
          matchedKeywords...new Set(matchedKeywords)],
          locations
        });
      }
    });

    // Sort by severity and approval rate
    matches.sort((a, b) => {
      const severityOrder = { critical, high, medium, low };
      const sevA = severityOrder[a.pattern.severity as keyof typeof severityOrder] ?? 4;
      const sevB = severityOrder[b.pattern.severity as keyof typeof severityOrder] ?? 4;
      if (sevA !== sevB) return sevA - sevB;
      return a.pattern.approval_rate - b.pattern.approval_rate;
    });

    setContentMatches(matches);
    onPatternDetected?.(matches);
  };

  // Using shared utilities from mlrHelpers

  const criticalMatches = contentMatches.filter(m => m.pattern.approval_rate  m.pattern.approval_rate >= 10 && m.pattern.approval_rate 
      
        
          
            
            MLR Pattern Detection
          
          {isLoading && Loading...}
        
        
        {contentMatches.length > 0 && (
          
            {criticalMatches.length > 0 && (
              
                {criticalMatches.length} High Risk
              
            )}
            {warningMatches.length > 0 && (
              
                {warningMatches.length} Warnings
              
            )}
            {contentMatches.length === 0 && (
              
                No patterns detected
              
            )}
          
        )}
      

      
        
          {isLoading ? (
            
              
              Analyzing patterns...
            
          ) .length === 0 ? (
            
              
              No risky patterns detected
              
                Content appears to follow MLR guidelines
              
            
          ) : (
            contentMatches.map((match) => (
               setExpandedPattern(
                  expandedPattern === match.pattern.id ? null .pattern.id
                )}
              >
                
                  
                    
                      {getSeverityIconWithRate(match.pattern.severity, match.pattern.approval_rate)}
                      
                        {match.pattern.pattern_name}
                        
                          
                            {match.pattern.pattern_type}
                          
                          
                            {match.pattern.approval_rate}% approval rate
                          
                        
                      
                    
                    {expandedPattern === match.pattern.id ? (
                      
                    ) : (
                      
                    )}
                  
                
                
                
                  
                    {/* Approval rate visualization */}
                    
                      
                        Historical Approval
                        
                          {match.pattern.approval_rate}%
                        
                      
                      div]-destructive' : ''}`}
                      />
                    

                    {/* Matched keywords */}
                    
                      {match.matchedKeywords.slice(0, 4).map((kw, idx) => (
                        
                          "{kw}"
                        
                      ))}
                      {match.matchedKeywords.length > 4 && (
                        
                          +{match.matchedKeywords.length - 4} more
                        
                      )}
                    

                    {/* Expanded details */}
                    {expandedPattern === match.pattern.id && (
                      
                        {match.pattern.common_feedback && (
                          
                            Common Feedback/p>
                            {match.pattern.common_feedback}
                          
                        )}
                        
                        {match.pattern.suggested_alternative && (
                          
                            Suggested Fix/p>
                            
                              {match.pattern.suggested_alternative}
                            
                          
                        )}

                        
                          ✓ {match.pattern.approval_count} approved
                          ✗ {match.pattern.rejection_count} rejected
                        
                      
                    )}
                  
                
              
            ))
          )}
        
      
    
  );
};

export default MLRPatternsPanel;
