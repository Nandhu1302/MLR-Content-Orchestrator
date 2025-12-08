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

		// FIX: Removed 'as EventListener' type assertion
		document.addEventListener('contentChanged', handleContentChange);
		return () => {
			// FIX: Removed 'as EventListener' type assertion
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
				// Assuming 'ascending' was intended as a variable/constant; using 'true' as default for a boolean argument
				.order('review_date', { ascending: true }) 
				.limit(50);

			if (error) throw error;

			// Transform database records to MLRFeedback format
			// Fixed column mapping errors (id.id, feedback.rationale, etc.)
			const relevantFeedback = (data || [])
				.map((record) => {
					// Calculate similarity using original_text (the actual problematic text from past reviews)
					const similarityScore = currentContent && record.original_text
						? calculateSimilarity(record.original_text, currentContent)
						: 0; // Added fallback value

					return {
						id: record.id,
						reviewerId: record.id, // Assuming reviewerId should fall back to record.id if missing
						reviewerName: record.reviewer_name || 'MLR Reviewer',
						// Note: You may need to import 'ReviewerType' if you convert to TSX
						reviewerType: record.reviewer_type || 'medical',
						feedback: record.rationale || 'No feedback provided',
						// Fixed variable/property assignment syntax here:
						category: record.decision_category,
						severity: record.severity,
						status: record.decision,
						date: record.review_date || record.created_at || new Date().toISOString(),
						assetType: record.asset_type || 'Email',
						similarityScore,
						suggestedText: record.suggested_text,
						historicalContext: record.original_text,
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
	const mapDecisionCategoryToFeedbackCategory = (category) => {
		// Fixed multiple string concatenation within case statements. They must be separated by 'case'
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
	const mapSeverityToMLRSeverity = (severity) => {
		// Fixed multiple string concatenation within case statements
		switch (severity?.toLowerCase()) {
			case 'critical': 
				return 'critical';
			case 'high': 
				return 'high';
			case 'medium': 
				return 'medium';
			case 'low': 
				return 'low';
			default: 
				return 'medium';
		}
	};

	// Map decision to status
	const mapDecisionToStatus = (decision) => {
		// Fixed multiple string concatenation within case statements
		switch (decision?.toLowerCase()) {
			case 'approved': 
				return 'applied';
			case 'rejected': 
			case 'revision_required': 
			case 'approved_with_changes': 
				return 'pending';
			default: 
				return 'pending';
		}
	};

	const handleFeedbackAction = (feedbackId, action, reason) => {
		const feedbackItem = feedback.find(f => f.id === feedbackId);
		
		if (action === 'apply' && feedbackItem?.suggestedText) {
			const insertionType = mapCategoryToInsertionType(feedbackItem.category);
			emitSmartInsert(insertionType, feedbackItem.suggestedText);
		}
		
		// Fixed syntax error in map function:
		setFeedback(prev => prev.map(f => 
			f.id === feedbackId 
				? { ...f, status: action === 'apply' ? 'applied' : 'dismissed' } // Added ':' and 'status:'
				: f
		));
		
		// Update summary
		setTimeout(() => {
			const updatedFeedback = feedback.map(f => 
				f.id === feedbackId 
					? { ...f, status: action === 'apply' ? 'applied' : 'dismissed' } // Added ':' and 'status:'
					: f
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
		<Card className="h-full">
			<CardHeader className="p-4 border-b">
				<div className="flex justify-between items-center">
					<div className="flex items-center space-x-2">
						<History className="w-5 h-5 text-gray-500" />
						<h3 className="text-lg font-semibold">
							MLR Memory
						</h3>
					</div>
					{isLoading && (
						<Badge variant="secondary" className="text-xs">
							Loading...
						</Badge>
					)}
				</div>
				<p className="text-sm text-gray-500 mt-1">
					Historical review decisions & patterns
				</p>
			</CardHeader>

			<CardContent className="p-4 space-y-4">
				<div className="flex space-x-2">
					{/* Fixed syntax error in map function: added (type) => ( */}
					{(['all', 'medical', 'legal', 'regulatory']).map((type) => (
						<Button
							key={type}
							variant={filterType === type ? 'default' : 'outline'}
							onClick={() => setFilterType(type)}
							className="text-xs px-2 py-1 h-8"
						>
							{/* Fixed syntax error in string formatting */}
							{type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
						</Button>
					))}
				</div>

				<div className="flex space-x-4 text-sm font-medium">
					<p className="flex items-center space-x-1">
						<CheckCircle className="w-4 h-4 text-orange-500" />
						<span>{feedback.filter(f => f.status === 'pending').length} Pending</span>
					</p>
					<p className="flex items-center space-x-1">
						<CheckCircle className="w-4 h-4 text-green-500" />
						<span>{feedback.filter(f => f.status === 'applied').length} Resolved</span>
					</p>
				</div>
				

				<ScrollArea className="h-[calc(100vh-280px)] pr-2">
					{isLoading ? (
						<div className="text-center py-8 text-gray-500">
							<p>Loading MLR feedback...</p>
						</div>
					) : !hasContent ? (
						<div className="text-center py-8 text-gray-500">
							<p className="font-semibold">
								Add content to see relevant MLR history
							</p>
							<p className="text-sm">
								Historical reviews will appear when content is analyzed
							</p>
						</div>
					) : (getFilteredFeedback()).length === 0 ? ( // Fixed missing parenthesis for function call
						<div className="text-center py-8 text-gray-500">
							<p className="font-semibold">
								No relevant feedback found
							</p>
							<p className="text-sm">
								Your content appears to follow established patterns
							</p>
						</div>
					) : (
						getFilteredFeedback().map((item) => (
							<Card 
								key={item.id} 
								className="mb-3 hover:bg-gray-50 cursor-pointer"
								// onClick={() => handleShowDetails(item)} // Removed onClick to favor the explicit button
							>
								<CardContent className="p-3">
									<div className="flex justify-between items-start mb-1">
										<div className="flex items-center space-x-2">
											<div className={`p-1 rounded-full ${getStatusColor(item.severity)}`}>
												{getSeverityIcon(item.severity)}
											</div>
											<div className="text-sm font-medium">
												<p className="flex items-center space-x-1">
													<User className="w-3 h-3 text-gray-500" />
													<span>{item.reviewerName}</span>
													<Badge variant="outline" className="text-[10px] h-4">
														{item.reviewerType}
													</Badge>
												</p>
												<div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
													<Calendar className="w-3 h-3" />
													<span>{formatMLRDate(item.date)}</span>
													{item.similarityScore !== undefined && item.similarityScore > 0 && (
														<>
															<TrendingUp className="w-3 h-3 ml-2" />
															<Badge variant="secondary" className="text-[10px] h-4">
																{item.similarityScore}% match
															</Badge>
														</>
													)}
												</div>
											</div>
										</div>
										
										<Badge variant={item.status === 'pending' ? 'destructive' : 'default'} className="text-xs ml-auto">
											{item.status}
										</Badge>
									</div>
									
									<div className="mt-2 text-sm text-gray-700">
										<Badge variant="outline" className="text-xs mb-1">
											{item.category}
										</Badge>
										<p className="line-clamp-2">
											{item.feedback}
										</p>
										
										<div className="flex justify-end mt-2 space-x-2">
											{item.status === 'pending' && (
												<Button
													variant="outline"
													onClick={(e) => {
														e.stopPropagation();
														handleShowDetails(item);
													}}
													className="text-xs h-7 px-2"
												>
													<Eye className="w-3 h-3 mr-1" />
													Details
												</Button>
											)}
										
											{item.status !== 'pending' && (
												<div className="text-xs text-gray-500 flex items-center">
													<CheckCircle className="w-3 h-3 mr-1" />
													<span>Status: {item.status === 'applied' ? 'Applied to content' : 'Dismissed'}</span>
												</div>
											)}
										</div>
									</div>
								</CardContent>
							</Card>
						))
					)}
				</ScrollArea>
			</CardContent>

			<MLRMemoryDetailsModal
				isOpen={isDetailsModalOpen}
				feedbackItem={selectedFeedback}
				onClose={() => {
					setIsDetailsModalOpen(false);
					setSelectedFeedback(null);
				}}
				onApply={handleFeedbackAction}
				currentContent={currentContent}
			/>
		</Card>
	);
};


export { MLRMemoryPanel };