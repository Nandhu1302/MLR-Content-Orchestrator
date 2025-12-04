import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ExternalLinkDisclaimer } from "@/components/ui/external-link-disclaimer";
import { SmartContentInsertion } from "@/utils/smartContentInsertion";
import { 
  BookOpen, 
  CheckCircle, 
  ExternalLink, 
  Plus,
  X,
  Search
} from "lucide-react";





const ReferenceDetailsModal = ({ 
  reference, 
  isOpen, 
  onClose, 
  onApply, 
  currentContent 
}) => {
  const [declineReason, setDeclineReason] = useState('');
  const [showDeclineForm, setShowDeclineForm] = useState(false);
  const [externalLinkModalOpen, setExternalLinkModalOpen] = useState(false);
  const [pendingUrl, setPendingUrl] = useState('');
  const [pendingLinkText, setPendingLinkText] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  if (!reference) return null;

  const getInsertionPreview = () => {
    if (!reference.citation) return null;
    
    return SmartContentInsertion.getInsertionPreview(
      currentContent,
      'reference',
      `[${reference.id.split('_').pop()}] ${reference.citation}`
    );
  };

  const insertionPreview = getInsertionPreview();

  const handleApply = async () => {
    setIsApplying(true);
    try {
      await onApply(reference.id, 'apply');
      onClose();
    } catch (error) {
      console.error('Error applying reference:', error);
    } finally {
      setIsApplying(false);
    }
  };

  const handleDecline = () => {
    onApply(reference.id, 'decline', declineReason);
    setDeclineReason('');
    setShowDeclineForm(false);
    onClose();
  };

  const handleExternalLink = (url, linkText) => {
    setPendingUrl(url);
    setPendingLinkText(linkText);
    setExternalLinkModalOpen(true);
  };

  const confirmExternalLink = () => {
    window.open(pendingUrl, '_blank');
    setExternalLinkModalOpen(false);
    setPendingUrl('');
    setPendingLinkText('');
  };

  return (
    
      
        
          
            
            Reference Details
          
        

        
          {/* Reference Information */}
          
            
              
                
                  {reference.title || 'Reference Citation'}
                  
                    {reference.isVerified && (
                      
                        
                        Verified
                      
                    )}
                    {reference.isComplete && (
                      
                        Complete
                      
                    )}
                  
                
                
                {reference.citation}
                
                {reference.authors && (
                  
                    Authors/strong> {reference.authors}
                  
                )}
                
                {reference.journal && reference.year && (
                  
                    Journal/strong> {reference.journal} ({reference.year})
                  
                )}
                
                {(reference.pmid || reference.doi) && (
                  
                    {reference.pmid && PMID/strong> {reference.pmid}}
                    {reference.doi && DOI/strong> {reference.doi}}
                  
                )}
                
                
                  {reference.pmid && (
                     handleExternalLink(`https://pubmed.ncbi.nlm.nih.gov/${reference.pmid}/`, 'PubMed')}
                    >
                      
                      View in PubMed
                    
                  )}
                  {reference.doi && (
                     handleExternalLink(`https://doi.org/${reference.doi}`, 'DOI Publisher')}
                    >
                      
                      View DOI
                    
                  )}
                  {!reference.isVerified && (
                     {
                        const searchQuery = encodeURIComponent(`${reference.authors || ''} ${reference.title || reference.citation}`.trim());
                        handleExternalLink(`https://pubmed.ncbi.nlm.nih.gov/?term=${searchQuery}`, 'PubMed Search');
                      }}
                    >
                      
                      Verify Citation
                    
                  )}
                
              
            
          

          {/* Insertion Preview */}
          {insertionPreview && (
            
              
                Insertion Preview
                
                  
                    Insertion Point/strong> {insertionPreview.insertionPoint.reason}
                  
                  
                    Confidence/strong> {Math.round(insertionPreview.insertionPoint.confidence * 100)}%
                  
                
                
                
                  
                    {insertionPreview.beforeText && (
                      
                        ...{insertionPreview.beforeText}...
                      
                    )}
                    
                      + Inserted Reference/strong>
                      [{reference.id.split('_').pop()}] {reference.citation}
                    
                    {insertionPreview.afterText && (
                      
                        ...{insertionPreview.afterText}...
                      
                    )}
                  
                
              
            
          )}

          {/* Decline Form */}
          {showDeclineForm && (
            
              
                
                  Reason for declining this reference
                
                 setDeclineReason(e.target.value)}
                  placeholder="Please provide a reason for declining this reference..."
                  className="mt-2"
                  rows={3}
                />
              
            
          )}
        

        
          
            Cancel
          
          
          {!showDeclineForm ? (
            <>
               setShowDeclineForm(true)}
                className="text-destructive hover-destructive"
              >
                
                Decline
              
              
                
                {isApplying ? 'Applying...' : 'Apply Reference'}
              
            
          ) : (
            
              
              Confirm Decline
            
          )}
        
      

      {/* External Link Disclaimer */}
       {
          setExternalLinkModalOpen(false);
          setPendingUrl('');
          setPendingLinkText('');
        }}
        onConfirm={confirmExternalLink}
        url={pendingUrl}
        linkText={pendingLinkText}
      />
    
  );
};

export default ReferenceDetailsModal;
