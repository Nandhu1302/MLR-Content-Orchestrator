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
// Removed: import type { MLRFeedback, ReviewerType, FeedbackCategory, MLRSeverity, MLRStatus } from "./types/mlrTypes";
import { 
  History, 
  User, 
  CheckCircle, 
  Calendar,
  TrendingUp,
  Eye
} from "lucide-react";

// Removed interface MLRMemoryPanelProps

// Minimum similarity threshold to show feedback (30%)
const SIMILARITY_THRESHOLD = 30;

export const MLRMemoryPanel = ({ 
  assetId, 
  brandId,
  brandProfile,
  assetContext,
  onValidationUpdate 
}) => { // Removed : MLRMemoryPanelProps
  const { selectedBrand } = useBrand();
  const activeBrand = brandProfile || selectedBrand;
  // Removed <MLRFeedback[]> type annotation
  const [feedback, setFeedback] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // Removed <MLRFeedback | null> type annotation
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  // Removed <'all' | ReviewerType> type annotation
  const [filterType, setFilterType] = useState('all');
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [currentContent, setCurrentContent] = useState('');

  useEffect(() => {
    // Removed (event: CustomEvent) => ... type annotation
    const handleContentChange = (event) => {
      setCurrentContent(event.detail.content);
    };

    // Removed as EventListener type assertion
    document.addEventListener('contentChanged', handleContentChange);
    return () => {
      document.removeEventListener('contentChanged', handleContentChange);
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
        .order('review_date', { ascending: false })
        .limit(50);

      if (error) throw error;

      // Transform database records to MLRFeedback format
      // Using CORRECT column names from database schema
      // Removed (data || []).map((record: any) => ...
      const relevantFeedback = (data || [])
        .map((record) => {
          // Calculate similarity using original_text (the actual problematic text from past reviews)
          // NO random fallback - if no content, similarity is 0
          const similarityScore = currentContent && record.original_text
            ? calculateSimilarity(record.original_text, currentContent)
            : 0;

          return {
            id: record.id,
            reviewerId: record.id, // No reviewer_id column, use record id
            // Removed (record.reviewer_type as ReviewerType)
            reviewerName: record.reviewer_name || 'MLR Reviewer',
            reviewerType: record.reviewer_type || 'medical',
            // Use rationale as feedback text (correct column name)
            feedback: record.rationale || 'No feedback provided',
            // Use decision_category (correct column name)
            category: mapDecisionCategoryToFeedbackCategory(record.decision_category),
            // Use severity column directly (exists in schema)
            severity: mapSeverityToMLRSeverity(record.severity),
            status: mapDecisionToStatus(record.decision),
            date: record.review_date || record.created_at || new Date().toISOString(),
            assetType: record.asset_type || 'Email',
            similarityScore,
            // Use suggested_text (correct column name)
            suggestedText: record.suggested_text,
            // Use original_text for historical context
            historicalContext: record.original_text
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
  // Removed (category: string | null): FeedbackCategory type annotation
  const mapDecisionCategoryToFeedbackCategory = (category) => {
    switch (category?.toLowerCase()) {
      case 'claim': 
      case 'claim_review': 
        return 'claim';
      case 'safety': 
      case 'safety_review': 
        return 'safety';
      case 'indication': 
      case 'indication_review': 
        return 'indication';
      case 'reference': 
      case 'reference_review': 
        return 'reference';
      default: 
        return 'general';
    }
  };

  // Map severity string to MLRSeverity
  // Removed (severity: string | null): MLRSeverity type annotation
  const mapSeverityToMLRSeverity = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'critical';
      case 'high': return 'high';
      case 'medium': return 'medium';
      case 'low': return 'low';
      default: return 'medium';
    }
  };

  // Map decision to status
  // Removed (decision: string | null): MLRStatus type annotation
  const mapDecisionToStatus = (decision) => {
    switch (decision?.toLowerCase()) {
      case 'approved': return 'applied';
      case 'rejected': return 'pending';
      case 'revision_required': return 'pending';
      case 'approved_with_changes': return 'pending';
      default: return 'pending';
    }
  };

  // Removed (feedbackId: string, action: 'apply' | 'decline', reason?: string) type annotation
  const handleFeedbackAction = (feedbackId, action, reason) => {
    const feedbackItem = feedback.find(f => f.id === feedbackId);
    
    if (action === 'apply' && feedbackItem?.suggestedText) {
      const insertionType = mapCategoryToInsertionType(feedbackItem.category);
      emitSmartInsert(insertionType, feedbackItem.suggestedText);
    }
    
    setFeedback(prev => prev.map(f => 
      f.id === feedbackId 
        ? { ...f, status: action === 'apply' ? 'applied' : 'dismissed' }
        : f
    ));
    
    // Update summary
    setTimeout(() => {
      const updatedFeedback = feedback.map(f => 
        f.id === feedbackId 
          ? { ...f, status: action === 'apply' ? 'applied' : 'dismissed' }
          : f
      );
      const suggestions = updatedFeedback.filter(f => f.status === 'pending').length;
      const acknowledged = updatedFeedback.filter(f => f.status === 'applied').length;
      onValidationUpdate({ suggestions, acknowledged });
    }, 100);
  };

  // Removed (feedbackItem: MLRFeedback) type annotation
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
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <History className="h-4 w-4" />
            MLR Memory
          </h3>
          {isLoading && (
            <Badge variant="outline" className="text-xs">
              Loading...
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1">Historical review decisions & patterns</p>
        
        <div className="flex gap-1 mt-3">
          {(['all', 'medical', 'legal', 'regulatory']).map((type) => (
            <Button
              key={type}
              size="sm"
              variant={filterType === type ? 'default' : 'ghost'}
              onClick={() => setFilterType(type)}
              className="text-xs px-2 py-1 h-6"
            >
              {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
            </Button>
          ))}
        </div>
        
        <div className="flex gap-2 mt-2">
          <Badge variant="destructive" className="text-xs">
            {feedback.filter(f => f.status === 'pending').length} Pending
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {feedback.filter(f => f.status === 'applied').length} Resolved
          </Badge>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {isLoading ? (
            <div className="text-center py-8">
              <History className="h-8 w-8 text-muted-foreground mx-auto mb-2 animate-pulse" />
              <p className="text-sm text-muted-foreground">Loading MLR feedback...</p>
            </div>
          ) : !hasContent ? (
            <div className="text-center py-8">
              <History className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Add content to see relevant MLR history</p>
              <p className="text-xs text-muted-foreground mt-1">
                Historical reviews will appear when content is analyzed
              </p>
            </div>
          ) : getFilteredFeedback().length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No relevant feedback found</p>
              <p className="text-xs text-muted-foreground">
                Your content appears to follow established patterns
              </p>
            </div>
          ) : (
            getFilteredFeedback().map((item) => (
              <Card 
                key={item.id}
                className={`cursor-pointer transition-all ${
                  selectedFeedback?.id === item.id ? 'ring-2 ring-primary' : ''
                } ${item.status !== 'pending' ? 'opacity-75' : ''}`}
                onClick={() => setSelectedFeedback(item)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-2">
                      {getSeverityIcon(item.severity)}
                      <div>
                        <div className="flex items-center gap-2">
                          <User className="h-3 w-3" />
                          <p className="text-sm font-medium">{item.reviewerName}</p>
                          <Badge variant="outline" className="text-xs">
                            {item.reviewerType}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {formatMLRDate(item.date)}
                          </span>
                          {item.similarityScore !== undefined && item.similarityScore > 0 && (
                            <>
                              <TrendingUp className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                {item.similarityScore}% match
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <Badge 
                      variant={getStatusColor(item.status)} 
                      className="text-xs"
                    >
                      {item.status}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div>
                      <Badge variant="secondary" className="text-xs mb-2">
                        {item.category}
                      </Badge>
                      <p className="text-sm leading-relaxed">{item.feedback}</p>
                    </div>
                    
                    {item.status === 'pending' && (
                      <div className="flex gap-2 pt-2 border-t">
                        <Button 
                          size="sm" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShowDetails(item);
                          }}
                          className="text-xs"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Details
                        </Button>
                      </div>
                    )}
                    
                    {item.status !== 'pending' && (
                      <div className="pt-2 border-t">
                        <p className="text-xs text-muted-foreground">
                          Status: {item.status === 'applied' ? 'Applied to content' : 'Dismissed'}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>

      <MLRMemoryDetailsModal 
        feedback={selectedFeedback}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedFeedback(null);
        }}
        onApply={handleFeedbackAction}
        currentContent={currentContent}
      />
    </div>
  );
};