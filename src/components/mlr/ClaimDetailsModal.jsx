import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
	AlertTriangle,
	CheckCircle,
	X,
	Copy,
	ThumbsUp,
	Brain,
	FileText,
	Shield,
	BookOpen,
	Target,
} from "lucide-react";
import { DetectedClaim } from "@/services/claimsValidationService";
import { useToast } from "@/hooks/use-toast";


const ClaimDetailsModal = ({
	claim,
	isOpen,
	onClose,
	onOverride,
}) => {
	const [overrideReason, setOverrideReason] = useState("");
	const [isOverriding, setIsOverriding] = useState(false);
	const { toast } = useToast();

	if (!claim) return null;

	const handleCopyText = () => {
		navigator.clipboard.writeText(claim.text);
		toast({
			title: "Copied to clipboard",
			description: "Claim text has been copied to your clipboard.",
		});
	};

	const handleOverride = () => {
		if (!overrideReason.trim()) {
			toast({
				title: "Override reason required",
				description: "Please provide a reason for overriding this claim.",
				variant: "destructive",
			});
			return;
		}

		onOverride(claim.id, overrideReason);
		setOverrideReason("");
		setIsOverriding(false);
		onClose();
		
		toast({
			title: "Claim overridden",
			description: "The claim has been marked as approved.",
		});
	};

	// FIX: Corrected missing colons (:) and added return statements in switch
	const getSeverityIcon = (severity) => {
		switch (severity) {
			case 'error':
				return <AlertTriangle className="w-5 h-5 text-destructive" />;
			case 'warning':
				return <AlertTriangle className="w-5 h-5 text-amber-500" />;
			default:
				return <CheckCircle className="w-5 h-5 text-primary" />;
		}
	};

	// FIX: Corrected missing colons (:) and added return statements in switch
	const getSeverityColor = (severity) => {
		switch (severity) {
			case 'error': return 'destructive';
			case 'warning': return 'secondary';
			default: return 'default';
		}
	};

	// FIX: Corrected missing colons (:) and added return statements in switch
	const getBrandComplianceColor = (compliance) => {
		switch (compliance) {
			case 'violation': return 'destructive';
			case 'warning': return 'secondary';
			default: return 'default';
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[600px] h-[90vh] flex flex-col">
				<DialogHeader>
					<DialogTitle className="flex items-center space-x-2">
						<Brain className="w-6 h-6 text-indigo-600" />
						<span>Claim Analysis Details</span>
					</DialogTitle>
					<DialogDescription>
						Comprehensive analysis and recommendations for the detected claim
					</DialogDescription>
				</DialogHeader>

				{/* Changed outer div to ScrollArea for better UX */}
				<ScrollArea className="flex-1 p-4 -mx-4">
					<div className="space-y-6 pr-4"> 
						{/* Claim Overview */}
						<div className="space-y-3">
							<h4 className="text-lg font-semibold flex items-center space-x-2 text-gray-800">
								<FileText className="w-4 h-4" />
								<span>Detected Claim</span>
							</h4>
							<div className={`p-4 rounded-lg border flex flex-col space-y-3 
								${claim.severity === 'error' ? 'border-destructive/50 bg-destructive/5' : 'border-amber-500/50 bg-amber-50/50'}
							`}>
								<div className="flex justify-between items-start">
									<div className="flex items-center space-x-2">
										{getSeverityIcon(claim.severity)}
										<Badge variant={getSeverityColor(claim.severity)} className="text-sm">
											{claim.type}
										</Badge>
									</div>
									<Badge variant="secondary" className="text-xs">
										{Math.round(claim.confidence * 100)}% confidence
									</Badge>
								</div>
								
								<p className="text-base font-medium italic text-gray-800">
									"{claim.text}"
								</p>
								
								<Button 
									variant="ghost" 
									size="sm" 
									onClick={handleCopyText} 
									className="w-fit text-xs self-end"
								>
									<Copy className="w-3 h-3 mr-1" />
									Copy Text
								</Button>
							</div>
						</div>

						<Separator />
						
						{/* Analysis Details */}
						<div className="space-y-4">
							<h4 className="text-lg font-semibold flex items-center space-x-2 text-gray-800">
								<Target className="w-4 h-4" />
								<span>Analysis</span>
							</h4>
							
							<div className="space-y-2">
								<p className="text-sm">
									<strong>Issue Identified:</strong> {claim.reason}
								</p>
							</div>

							{claim.context && (
								<div className="pt-2">
									<Label className="text-sm font-medium">
										Context
									</Label>
									<Alert className="mt-2 text-sm bg-gray-50 border-gray-200">
										<AlertDescription className="font-mono text-gray-600">
											"...{claim.context}..."
										</AlertDescription>
									</Alert>
								</div>
							)}
						</div>

						<Separator />

						{/* Brand Compliance */}
						{claim.brandCompliance && claim.brandCompliance !== 'compliant' && (
							<div className="space-y-4">
								<h4 className="text-lg font-semibold flex items-center space-x-2 text-gray-800">
									<Shield className="w-4 h-4" />
									<span>Brand Compliance</span>
								</h4>
								
								<Alert variant={getBrandComplianceColor(claim.brandCompliance)}>
									<AlertTriangle className="h-4 w-4" />
									<AlertDescription>
										<div className="font-semibold mb-1">
											<Badge variant={getBrandComplianceColor(claim.brandCompliance)}>
												{claim.brandCompliance.toUpperCase()}
											</Badge>
										</div>
										This claim may not align with brand guidelines and requires review.
									</AlertDescription>
								</Alert>
							</div>
						)}

						{/* Recommendations */}
						<div className="space-y-4">
							<h4 className="text-lg font-semibold flex items-center space-x-2 text-gray-800">
								<ThumbsUp className="w-4 h-4" />
								<span>Recommendations</span>
							</h4>
							
							<div className="space-y-2">
								<Label className="text-sm font-medium">Suggested Improvement</Label>
								<p className="p-3 bg-gray-50 border rounded-md text-sm italic text-gray-700">
									{claim.suggestion}
								</p>
							</div>

							{claim.requiredEvidence && claim.requiredEvidence.length > 0 && (
								<div className="space-y-2 pt-2">
									<Label className="text-sm font-medium">Required Evidence</Label>
									<div className="flex flex-wrap gap-2">
										{claim.requiredEvidence.map((evidence, idx) => (
											<Badge key={idx} variant="outline" className="text-sm">
												<BookOpen className="w-3 h-3 mr-1" />
												{evidence}
											</Badge>
										))}
									</div>
								</div>
							)}
						</div>
						
						<Separator />

						{/* Actions */}
						<div className="space-y-4">
							<h4 className="text-lg font-semibold text-gray-800">
								Actions
							</h4>
							{claim.isOverridden ? (
								<Alert variant="success">
									<CheckCircle className="h-4 w-4" />
									<AlertDescription>
										This claim has been overridden.
										{claim.overrideReason && (
											<p className="mt-1 text-sm italic">
												Reason: {claim.overrideReason}
											</p>
										)}
									</AlertDescription>
								</Alert>
							) : (
								<div className="space-y-3">
									{!isOverriding ? (
										<Button
											onClick={() => setIsOverriding(true)}
											variant="outline"
											className="w-full text-indigo-600 border-indigo-200 hover:bg-indigo-50"
										>
											<ThumbsUp className="w-4 h-4 mr-2" />
											Override This Claim
										</Button>
									) : (
										<div className="space-y-2">
											<Label htmlFor="override-reason" className="text-sm">
												Override Reason (Required)
											</Label>
											<Textarea
												id="override-reason"
												value={overrideReason}
												onChange={(e) => setOverrideReason(e.target.value)}
												rows={3}
												placeholder="Enter your justification here..."
											/>
											
											<div className="flex space-x-2 pt-2">
												<Button
													onClick={handleOverride}
													disabled={!overrideReason.trim()}
													className="flex-1 bg-indigo-600 hover:bg-indigo-700"
												>
													<CheckCircle className="w-4 h-4 mr-2" />
													Confirm Override
												</Button>
												<Button
													variant="outline"
													onClick={() => {
														setIsOverriding(false);
														setOverrideReason("");
													}}
													className="flex-1"
												>
													Cancel
												</Button>
											</div>
										</div>
									)}
								</div>
							)}
						</div>
					</div>
				</ScrollArea>
			</DialogContent>
		</Dialog>
	);
};

export default ClaimDetailsModal;