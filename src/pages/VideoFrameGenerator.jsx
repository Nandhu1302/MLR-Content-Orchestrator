import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Loader2, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const frameScripts = [
	{
		title: "Hook - The Problem",
		prompt: "Professional McKinsey-style marketing visual showing chaotic pharmaceutical marketing workflow with papers, meetings, and compliance warning flags scattered around. Deep blue and teal corporate color scheme. Clean minimal design. High contrast. Cinematic lighting. No text overlay. 16:9 aspect ratio. Ultra high resolution.",
		duration: "0-4s",
		voiceover: "Pharmaceutical marketers face a $2B problem"
	},
	{
		title: "Solution Intro",
		prompt: "Professional dashboard interface for Content Orchestrator platform, clean organized pharmaceutical marketing software. Deep blue (#003366) and teal (#0891b2) color scheme. McKinsey-style minimalist design. Modern UI elements. High contrast. No text overlay. 16:9 aspect ratio. Ultra high resolution.",
		duration: "4-8s",
		voiceover: "One platform that transforms how pharma creates content"
	},
	{
		title: "Intelligence Engine",
		prompt: "Five concentric circles expanding outward representing intelligence layers, starting from center: brand intelligence, competitive intelligence, market intelligence, regulatory intelligence, public sentiment. Deep blue to teal gradient. Professional McKinsey-style data visualization. Clean minimal design. No text overlay. 16:9 aspect ratio. Ultra high resolution.",
		duration: "8-12s",
		voiceover: "Every piece of content is strategically informed in real-time"
	},
	{
		title: "6 Modules",
		prompt: "Six connected hexagonal module icons flowing left to right in a clean workflow diagram. Deep blue and teal corporate colors. McKinsey-style process visualization. Professional pharmaceutical technology aesthetic. Minimalist design. High contrast. No text overlay. 16:9 aspect ratio. Ultra high resolution.",
		duration: "12-16s",
		voiceover: "From campaign strategy to global execution"
	},
	{
		title: "AI Generation",
		prompt: "AI-powered content being generated on a screen with glowing intelligence badges lighting up around it. Pharmaceutical marketing content. Deep blue and teal color scheme. Futuristic but professional. McKinsey-style clean design. High-tech visualization. No text overlay. 16:9 aspect ratio. Ultra high resolution.",
		duration: "16-20s",
		voiceover: "Generate compliant content in minutes, not weeks"
	},
	{
		title: "Compliance",
		prompt: "Professional Pre-MLR compliance dashboard with green checkmarks and approval indicators. Clean pharmaceutical regulatory interface. Deep blue and teal colors. McKinsey-style data dashboard. Organized grid layout. High contrast. No text overlay. 16:9 aspect ratio. Ultra high resolution.",
		duration: "20-24s",
		voiceover: "90% compliance accuracy before MLR review"
	},
	{
		title: "Global Reach",
		prompt: "World map with markets lighting up in sequence, pharmaceutical global expansion visualization. Translation and localization in progress. Deep blue background with teal glowing markers. Professional McKinsey-style geographic data visualization. Clean minimal design. No text overlay. 16:9 aspect ratio. Ultra high resolution.",
		duration: "24-28s",
		voiceover: "Localize content with cultural and regulatory precision"
	},
	{
		title: "Results",
		prompt: "Professional ROI metrics dashboard showing three key performance indicators with upward trending arrows. Clean pharmaceutical business analytics. Deep blue and teal color scheme. McKinsey-style data visualization with bar charts and percentage improvements. Minimalist design. High contrast. No text overlay. 16:9 aspect ratio. Ultra high resolution.",
		duration: "28-32s",
		voiceover: "60% faster, 50% lower costs, 90% compliance"
	},
	{
		title: "Competitive Edge",
		prompt: "Bar chart showing Content Orchestrator rising significantly above competitors. Professional business comparison visualization. Deep blue and teal corporate colors. McKinsey-style clean chart design. One tall bar standing out among shorter bars. Minimalist aesthetic. High contrast. No text overlay. 16:9 aspect ratio. Ultra high resolution.",
		duration: "32-36s",
		voiceover: "What DAMs, CMSs, and translation services can't deliver"
	},
	{
		title: "CTA",
		prompt: "Professional platform logo for Content Orchestrator with a prominent call-to-action button on deep blue background. Clean corporate branding. Teal accent color. McKinsey-style minimalist design. High-end pharmaceutical marketing aesthetic. Ultra professional. No additional text. 16:9 aspect ratio. Ultra high resolution.",
		duration: "36-40s",
		voiceover: "See Content Orchestrator in action. Request your demo today"
	}
];

const VideoFrameGenerator = ({ embedded = false }) => {
	const [generatedFrames, setGeneratedFrames] = useState([]);
	const [isGenerating, setIsGenerating] = useState(false);
	const [currentFrame, setCurrentFrame] = useState(0);
	const navigate = useNavigate();
	const { toast } = useToast();

	const generateAllFrames = async () => {
		setIsGenerating(true);
		setGeneratedFrames([]);

		for (let i = 0; i < frameScripts.length; i++) {
			try {
				const { data, error } = await supabase.functions.invoke("generate-marketing-visual", {
					body: { prompt: frameScripts[i].prompt, frameNumber: i + 1 }
				});

				if (error) throw error;

				if (data?.imageUrl) {
					setGeneratedFrames(prev => [...prev, { 
						id: i, 
						url: data.imageUrl, 
						title: frameScripts[i].title 
					}]);
				}
			} catch (err) {
				console.error(`Error generating frame ${i + 1}:`, err);
				toast({
					title: "Generation Error",
					description: `Failed to generate frame ${i + 1}. Please try again.`,
					variant: "destructive"
				});
			}
		}

		setIsGenerating(false);
		toast({
			title: "Generation Complete",
			description: `Successfully generated ${generatedFrames.length} video frames.`
		});
	};

	const downloadFrame = (url, frameNumber) => {
		const link = document.createElement("a");
		link.href = url;
		link.download = `content-orchestrator-frame-${frameNumber + 1}.png`;
		link.click();
	};

	const downloadAllFrames = () => {
		generatedFrames.forEach((frame) => {
			downloadFrame(frame.url, frame.id);
		});
	};

	return (
		<div className={embedded ? "space-y-6" : "min-h-screen bg-gradient-to-br from-background via-background to-muted p-8"}>
			{/* Header */}
			<div className={embedded ? "space-y-4" : "max-w-7xl mx-auto mb-8"}>
				{!embedded && (
					<Button
						variant="ghost"
						onClick={() => navigate("/marketing-deck")}
						className="mb-4"
					>
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back to Deck
					</Button>
				)}
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold text-foreground mb-2">40-Second Video Frame Generator</h1>
						<p className="text-muted-foreground">
							Generate 10 high-quality frames for your marketing video (4 seconds per frame)
						</p>
					</div>
					<div className="flex gap-2">
						<Button
							onClick={generateAllFrames}
							disabled={isGenerating}
							size="lg"
						>
							{isGenerating ? (
								<>
									<Loader2 className="w-5 h-5 mr-2 animate-spin" />
									Generating {generatedFrames.length}/{frameScripts.length}...
								</>
							) : (
								<>
									<Play className="w-5 h-5 mr-2" />
									Generate All Frames
								</>
							)}
						</Button>
						{generatedFrames.length === frameScripts.length && (
							<Button
								variant="outline"
								onClick={downloadAllFrames}
								size="lg"
							>
								<Download className="w-5 h-5 mr-2" />
								Download All
							</Button>
						)}
					</div>
				</div>
			</div>

			{/* Frame Grid */}
			<div className={embedded ? "grid grid-cols-2 gap-6" : "max-w-7xl mx-auto grid grid-cols-2 gap-6"}>
				{frameScripts.map((frame, index) => {
					const frameData = generatedFrames.find(f => f.id === index);
					return (
						<div key={index} className="bg-card rounded-lg border border-border p-4">
							<div className="flex items-center justify-between mb-3">
								<div>
									<h3 className="font-semibold text-foreground">Frame {index + 1}: {frame.title}</h3>
									<p className="text-sm text-muted-foreground">{frame.duration}</p>
								</div>
								{frameData && (
									<Button
										variant="outline"
										size="sm"
										onClick={() => downloadFrame(frameData.url, index)}
									>
										<Download className="w-4 h-4" />
									</Button>
								)}
							</div>
							
							<div className="aspect-video bg-muted rounded-lg mb-3 flex items-center justify-center overflow-hidden">
								{frameData ? (
									<img
										src={frameData.url}
										alt={frame.title}
										className="w-full h-full object-cover"
									/>
								) : isGenerating && generatedFrames.length === index ? (
									<Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
								) : (
									<span className="text-muted-foreground text-sm">Awaiting generation...</span>
								)}
							</div>

							<p className="text-sm text-muted-foreground italic">
								"{frame.voiceover}"
							</p>
						</div>
					);
				})}
			</div>

			{/* Instructions */}
			<div className={embedded ? "mt-8 bg-card border border-border rounded-lg p-6" : "max-w-7xl mx-auto mt-8 bg-card border border-border rounded-lg p-6"}>
				<h2 className="text-xl font-semibold text-foreground mb-4">Video Compilation Instructions</h2>
				<ol className="space-y-2 text-muted-foreground">
					<li>1. Click "Generate All Frames" to create all 10 frames using AI</li>
					<li>2. Download individual frames or click "Download All" when complete</li>
					<li>3. Import frames into video editing software (Premiere Pro, Final Cut, Clipchamp, Canva)</li>
					<li>4. Set each frame duration to 4 seconds</li>
					<li>5. Add fade transitions (0.5 seconds) between frames</li>
					<li>6. Record voiceover using the script provided with each frame</li>
					<li>7. Add subtle background music (corporate/tech style)</li>
					<li>8. Export as MP4 (1080p, 30fps) for a professional 40-second marketing video</li>
				</ol>
			</div>
		</div>
	);
};

export default VideoFrameGenerator;