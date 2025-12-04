
import { toast } from "sonner";
import { 
  X, 
  AlertTriangle, 
  CheckCircle, 
  MessageCircle,
  TrendingDown,
  TrendingUp,
  Info
} from "lucide-react";
import { createElement } from "react";

// Unified severity icon getter
export const getSeverityIcon = (severity, size = 'md') => {
  const sizeClass = size === 'sm' ? 'h-3 w-3' : 'h-4 w-4';
  
  switch (severity) {
    case 'critical':
    case 'high':
      return createElement(X, { className: `${sizeClass} text-destructive` });
    case 'medium':
      return createElement(AlertTriangle, { className: `${sizeClass} text-yellow-500` });
    case 'low':
      return createElement(CheckCircle, { className: `${sizeClass} text-green-500` });
    default:
      return createElement(MessageCircle, { className: `${sizeClass} text-muted-foreground` });
  }
};

// Severity icon with approval rate consideration (for patterns)
export const getSeverityIconWithRate = (severity, approvalRate, size = 'md') => {
  const sizeClass = size === 'sm' ? 'h-3 w-3' : 'h-4 w-4';
  
  if (approvalRate === 0) return createElement(AlertTriangle, { className: `${sizeClass} text-destructive` });
  if (approvalRate < 30) return createElement(TrendingDown, { className: `${sizeClass} text-orange-500` });
  if (approvalRate < 60) return createElement(Info, { className: `${sizeClass} text-yellow-500` });
  return createElement(TrendingUp, { className: `${sizeClass} text-green-500` });
};

// Unified severity color getter for badges
export const getSeverityColor = (severity) => {
  switch (severity) {
    case 'critical':
    case 'high':
      return 'destructive';
    case 'medium':
      return 'secondary';
    case 'low':
      return 'default';
    default:
      return 'outline';
  }
};

// Unified status color getter for badges
export const getStatusColor = (status) => {
  switch (status) {
    case 'applied':
      return 'default';
    case 'acknowledged':
      return 'secondary';
    case 'dismissed':
      return 'outline';
    case 'pending':
    default:
      return 'destructive';
  }
};

// Shared copy to clipboard handler
export const handleCopyToClipboard = async (text, label = 'Content') => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  } catch (error) {
    console.error('Failed to copy:', error);
    toast.error('Failed to copy to clipboard');
  }
};

// Shared smart insert handler - emits event for content editor
export const emitSmartInsert = (insertionType, insertionText) => {
  document.dispatchEvent(new CustomEvent('smartInsertTemplate', {
    detail: { insertionType, insertionText }
  }));
  toast.success(`${insertionType.replace('_', ' ')} inserted into content`);
};

// Map feedback category to insertion type
export const mapCategoryToInsertionType = (category) => {
  switch (category) {
    case 'indication': return 'indication';
    case 'safety': return 'safety';
    case 'reference': return 'reference';
    case 'claim': return 'claim';
    default: return 'fair_balance';
  }
};

// Format date for display
export const formatMLRDate = (dateString) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  } catch {
    return dateString;
  }
};

// Calculate similarity score between two strings (basic implementation)
export const calculateSimilarity = (str1, str2) => {
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();
  
  const words1 = new Set(s1.split(/\s+/));
  const words2 = new Set(s2.split(/\s+/));
  
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  
  return Math.round((intersection.size / union.size) * 100);
};
