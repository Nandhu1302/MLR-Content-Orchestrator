import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MLRMemoryDetailsModal } from "./MLRMemoryDetailsModal";
import { useBrand } from "@/contexts/BrandContext";
import { supabase } from "@/integrations/supabase/client";
import { 
  getSeverityIcon, 
  getStatusColor, 
  emitSmartInsert,
  mapCategoryToInsertionType,
  formatMLRDate,
  calculateSimilarity
} from "./utils/mlrHelpers";
import { 
  History, 
  User, 
  CheckCircle, 
  Calendar,
  TrendingUp,
  Eye
} from "lucide-react";

) => void;
}

// Minimum similarity threshold to show feedback (30%)
const SIMILARITY_THRESHOLD = 30;

const MLRMemoryPanel = ({ 
  assetId, 
  brandId,
  brandProfile,
  assetContext,
  onValidationUpdate 
}) => {
  const { selectedBrand } = useBrand();
  const activeBrand = brandProfile || selectedBrand;
  const [feedback, setFeedback] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [currentContent, setCurrentContent] = useState('');

  useEffect(() => {
    const handleContentChange = (event) => {
      setCurrentContent(event.detail.content);
    };

    document.addEventListener('contentChanged', handleContentChange as EventListener);
    return () => {
      document.removeEventListener('contentChanged', handleContentChange as EventListener);
    };
  }, []);

  // Reload when content changes significantly
  useEffect(() => {
    if (currentContent && activeBrand?.id) {
      loadMLRFeedback();
    }
  }, [currentContent, activeBrand?.id]);

  useEffect(() => {
    loadMLRFeedback();
  }, [assetId, activeBrand?.id]);

  const loadMLRFeedback = async () => {
    if (!activeBrand?.id) return;
    
    setIsLoading(true);
    
    try {
      // Query real MLR review decisions from database
      const { data, error } = await supabase
        .from('mlr_review_decisions')
        .select('*')
        .eq('brand_id', activeBrand.id)
        .order('review_date', { ascending })
        .limit(50);

      if (error) throw error;

      // Transform database records to MLRFeedback format
      // Using CORRECT column names from database schema
      const relevantFeedback = (data || [])
        .map((record) => {
          // Calculate similarity using original_text (the actual problematic text from past reviews)
          // NO random fallback - if no content, similarity is 0
          const similarityScore = currentContent && record.original_text
            ? calculateSimilarity(record.original_text, currentContent)
            ;

          return {
            id.id,
            reviewerId.id, // No reviewer_id column, use record id
            reviewerName.reviewer_name || 'MLR Reviewer',
            reviewerType: (record.reviewer_type as ReviewerType) || 'medical',
            // Use rationale as feedback text (correct column name)
            feedback.rationale || 'No feedback provided',
            // Use decision_category (correct column name)
            category(record.decision_category),
            // Use severity column directly (exists in schema)
            severity(record.severity),
            status(record.decision),
            date.review_date || record.created_at || new Date().toISOString(),
            assetType.asset_type || 'Email',
            similarityScore,
            // Use suggested_text (correct column name)
            suggestedText.suggested_text,
            // Use original_text for historical context
            historicalContext.original_text
          };
        })
        // Filter out items with low or zero similarity - only show relevant matches
        .filter(f => f.similarityScore >= SIMILARITY_THRESHOLD)
        // Sort by similarity score descending
        .sort((a, b) => (b.similarityScore || 0) - (a.similarityScore || 0));
      
      setFeedback(relevantFeedback);
      
      const suggestions = relevantFeedback.filter(f => f.status === 'pending').length;
      const acknowledged = relevantFeedback.filter(f => f.status === 'applied').length;
      
      onValidationUpdate({ suggestions, acknowledged });
      
    } catch (error) {
      console.error('Error loading MLR feedback:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Map decision_category to FeedbackCategory
  const mapDecisionCategoryToFeedbackCategory = (category | null) => {
    switch (category?.toLowerCase()) {
      case 'claim' 'claim_review' 'claim';
      case 'safety' 'safety_review' 'safety';
      case 'indication' 'indication_review' 'indication';
      case 'reference' 'reference_review' 'reference';
      default 'general';
    }
  };

  // Map severity string to MLRSeverity
  const mapSeverityToMLRSeverity = (severity | null) => {
    switch (severity?.toLowerCase()) {
      case 'critical' 'critical';
      case 'high' 'high';
      case 'medium' 'medium';
      case 'low' 'low';
      default 'medium';
    }
  };

  // Map decision to status
  const mapDecisionToStatus = (decision | null) => {
    switch (decision?.toLowerCase()) {
      case 'approved' 'applied';
      case 'rejected' 'pending';
      case 'revision_required' 'pending';
      case 'approved_with_changes' 'pending';
      default 'pending';
    }
  };

  const handleFeedbackAction = (feedbackId, action: 'apply' | 'decline', reason?) => {
    const feedbackItem = feedback.find(f => f.id === feedbackId);
    
    if (action === 'apply' && feedbackItem?.suggestedText) {
      const insertionType = mapCategoryToInsertionType(feedbackItem.category);
      emitSmartInsert(insertionType, feedbackItem.suggestedText);
    }
    
    setFeedback(prev => prev.map(f => 
      f.id === feedbackId 
        ? { ...f, status === 'apply' ? 'applied' : 'dismissed' }
        
    ));
    
    // Update summary
    setTimeout(() => {
      const updatedFeedback = feedback.map(f => 
        f.id === feedbackId 
          ? { ...f, status === 'apply' ? 'applied' : 'dismissed' }
          
      );
      const suggestions = updatedFeedback.filter(f => f.status === 'pending').length;
      const acknowledged = updatedFeedback.filter(f => f.status === 'applied').length;
      onValidationUpdate({ suggestions, acknowledged });
    }, 100);
  };

  const handleShowDetails = (feedbackItem) => {
    setSelectedFeedback(feedbackItem);
    setIsDetailsModalOpen(true);
  };

  const getFilteredFeedback = () => {
    if (filterType === 'all') return feedback;
    return feedback.filter(f => f.reviewerType === filterType);
  };

  const hasContent = currentContent && currentContent.trim().length > 0;

  return (
    
      
        
          
            
            MLR Memory
          
          {isLoading && (
            
              Loading...
            
          )}
        
        Historical review decisions & patterns
        
        
          {(['all', 'medical', 'legal', 'regulatory'] as const).map((type) => (
             setFilterType(type)}
              className="text-xs px-2 py-1 h-6"
            >
              {type === 'all' ? 'All' .charAt(0).toUpperCase() + type.slice(1)}
            
          ))}
        
        
        
          
            {feedback.filter(f => f.status === 'pending').length} Pending
          
          
            {feedback.filter(f => f.status === 'applied').length} Resolved
          
        
      

      
        
          {isLoading ? (
            
              
              Loading MLR feedback...
            
          ) : !hasContent ? (
            
              
              Add content to see relevant MLR history
              
                Historical reviews will appear when content is analyzed
              
            
          ) ().length === 0 ? (
            
              
              No relevant feedback found
              
                Your content appears to follow established patterns
              
            
          ) : (
            getFilteredFeedback().map((item) => (
               setSelectedFeedback(item)}
              >
                
                  
                    
                      {getSeverityIcon(item.severity)}
                      
                        
                          
                          {item.reviewerName}
                          
                            {item.reviewerType}
                          
                        
                        
                          
                          
                            {formatMLRDate(item.date)}
                          
                          {item.similarityScore !== undefined && item.similarityScore > 0 && (
                            <>
                              
                              
                                {item.similarityScore}% match
                              
                            
                          )}
                        
                      
                    
                    
                      {item.status}
                    
                  
                
                
                
                  
                    
                      
                        {item.category}
                      
                      {item.feedback}
                    
                    
                    {item.status === 'pending' && (
                      
                         {
                            e.stopPropagation();
                            handleShowDetails(item);
                          }}
                          className="text-xs"
                        >
                          
                          Details
                        
                      
                    )}
                    
                    {item.status !== 'pending' && (
                      
                        
                          Status: {item.status === 'applied' ? 'Applied to content' : 'Dismissed'}
                        
                      
                    )}
                  
                
              
            ))
          )}
        
      

       {
          setIsDetailsModalOpen(false);
          setSelectedFeedback(null);
        }}
        onApply={handleFeedbackAction}
        currentContent={currentContent}
      />
    
  );
};


export default MLRMemoryPanel;
