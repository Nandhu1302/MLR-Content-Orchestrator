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
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle className="flex items-center space-x-2">
						<BookOpen className="w-5 h-5 text-indigo-600" />
						<span>Reference Details</span>
					</DialogTitle>
				</DialogHeader>

				<div className="space-y-4 py-2 max-h-[70vh] overflow-y-auto pr-4">
					{/* Reference Information */}
					<Card>
						<CardContent className="pt-4 space-y-3">
							<div className="flex justify-between items-start">
								<h4 className="text-lg font-semibold text-gray-900 leading-tight">
									{reference.title || 'Reference Citation'}
								</h4>
								<div className="flex space-x-2 flex-shrink-0 ml-4">
									{reference.isVerified && (
										<Badge variant="success" className="bg-green-100 text-green-700">
											<CheckCircle className="w-3 h-3 mr-1" />
											Verified
										</Badge>
									)}
									{reference.isComplete && (
										<Badge variant="secondary">
											Complete
										</Badge>
									)}
								</div>
							</div>
							
							<p className="text-sm text-gray-700 italic">
								{reference.citation}
							</p>
							
							{reference.authors && (
								<p className="text-sm text-gray-600">
									<strong>Authors:</strong> {reference.authors}
								</p>
							)}
							
							{reference.journal && reference.year && (
								<p className="text-sm text-gray-600">
									<strong>Journal:</strong> {reference.journal} ({reference.year})
								</p>
							)}
							
							{(reference.pmid || reference.doi) && (
								<div className="text-sm text-gray-600 flex space-x-4">
									{reference.pmid && <p><strong>PMID:</strong> {reference.pmid}</p>}
									{reference.doi && <p><strong>DOI:</strong> {reference.doi}</p>}
								</div>
							)}
							
							<div className="flex space-x-2 pt-2">
								{reference.pmid && (
									<Button 
										variant="outline" 
										size="sm"
										onClick={() => handleExternalLink(`https://pubmed.ncbi.nlm.nih.gov/${reference.pmid}/`, 'PubMed')}
									>
										<ExternalLink className="w-4 h-4 mr-1" />
										View in PubMed
									</Button>
								)}
								{reference.doi && (
									<Button 
										variant="outline" 
										size="sm"
										onClick={() => handleExternalLink(`https://doi.org/${reference.doi}`, 'DOI Publisher')}
									>
										<ExternalLink className="w-4 h-4 mr-1" />
										View DOI
									</Button>
								)}
								{!reference.isVerified && (
									<Button 
										variant="outline" 
										size="sm"
										onClick={() => {
											const searchQuery = encodeURIComponent(`${reference.authors || ''} ${reference.title || reference.citation}`.trim());
											handleExternalLink(`https://pubmed.ncbi.nlm.nih.gov/?term=${searchQuery}`, 'PubMed Search');
										}}
									>
										<Search className="w-4 h-4 mr-1" />
										Verify Citation
									</Button>
								)}
							</div>
						</CardContent>
					</Card>
					
					{/* Insertion Preview */}
					{insertionPreview && (
						<Card className="bg-blue-50 border-blue-200">
							<CardContent className="pt-4 space-y-2">
								<h5 className="text-md font-semibold text-blue-800">
									Insertion Preview
								</h5>
								<div className="flex space-x-4 text-sm text-blue-700">
									<p>
										<strong>Insertion Point:</strong> {insertionPreview.insertionPoint.reason}
									</p>
									<p>
										<strong>Confidence:</strong> {Math.round(insertionPreview.insertionPoint.confidence * 100)}%
									</p>
								</div>
								
								<div className="bg-white p-3 rounded-md border text-sm font-mono whitespace-pre-wrap">
									{insertionPreview.beforeText && (
										<span>...{insertionPreview.beforeText}...</span>
									)}
									
									<span className="text-green-600 font-bold bg-green-50 p-1 rounded inline-block">
										+ Inserted Reference: [{reference.id.split('_').pop()}] {reference.citation}
									</span>
									
									{insertionPreview.afterText && (
										<span>...{insertionPreview.afterText}...</span>
									)}
								</div>
							</CardContent>
						</Card>
					)}

					{/* Decline Form */}
					{showDeclineForm && (
						<div className="space-y-2 pt-4">
							<Label htmlFor="decline-reason" className="text-sm font-medium">
								Reason for declining this reference
							</Label>
							<Textarea
								id="decline-reason"
								value={declineReason}
								onChange={(e) => setDeclineReason(e.target.value)}
								placeholder="Please provide a reason for declining this reference..."
								className="mt-2"
								rows={3}
							/>
						</div>
					)}
				</div>
				

				<DialogFooter>
					<Button variant="outline" onClick={onClose}>
						Cancel
					</Button>
					
					{!showDeclineForm ? (
						<>
							<Button
								variant="ghost"
								onClick={() => setShowDeclineForm(true)}
								className="text-destructive hover:text-destructive-foreground hover:bg-destructive/10"
							>
								<X className="w-4 h-4 mr-1" />
								Decline
							</Button>
							
							<Button 
								onClick={handleApply} 
								disabled={isApplying} 
								className="bg-indigo-600 hover:bg-indigo-700"
							>
								<Plus className="w-4 h-4 mr-1" />
								{isApplying ? 'Applying...' : 'Apply Reference'}
							</Button>
						</>
					) : (
						<Button 
							onClick={handleDecline} 
							disabled={!declineReason.trim()}
							variant="destructive"
						>
							Confirm Decline
						</Button>
					)}
				</DialogFooter>

				<ExternalLinkDisclaimer
					isOpen={externalLinkModalOpen}
					onClose={() => {
						setExternalLinkModalOpen(false);
						setPendingUrl('');
						setPendingLinkText('');
					}}
					onConfirm={confirmExternalLink}
					url={pendingUrl}
					linkText={pendingLinkText}
				/>
			</DialogContent>
		</Dialog>
	);
};

export default ReferenceDetailsModal;