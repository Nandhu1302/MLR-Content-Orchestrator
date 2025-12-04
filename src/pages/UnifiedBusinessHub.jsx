import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutDashboard, Presentation, Calculator, FileText, Users, Folder } from 'lucide-react';
import { OverviewTab } from '@/components/unified-hub/tabs/OverviewTab';
import { MarketingMaterialsTab } from '@/components/unified-hub/tabs/MarketingMaterialsTab';
import { ROIAnalysisTab } from '@/components/unified-hub/tabs/ROIAnalysisTab';
import { ExecutiveSummaryTab } from '@/components/unified-hub/tabs/ExecutiveSummaryTab';
import { ClientProposalsTab } from '@/components/unified-hub/tabs/ClientProposalsTab';
import { TechnicalDocumentationTab } from '@/components/unified-hub/tabs/TechnicalDocumentationTab';

const UnifiedBusinessHub = () => {
	const [activeTab, setActiveTab] = useState('overview');

	// Handle URL hash navigation
	useEffect(() => {
		const hash = window.location.hash.replace('#', '');
		if (hash && ['overview', 'marketing', 'roi', 'summary', 'clients', 'technical'].includes(hash)) {
			setActiveTab(hash);
		}
	}, []);

	useEffect(() => {
		window.location.hash = activeTab;
	}, [activeTab]);

	return (
		<div className="min-h-screen bg-background w-full">
			<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
				{/* Sticky Tab Navigation */}
				<div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
					<div className="max-w-7xl mx-auto px-8 py-4">
						<TabsList className="grid w-full grid-cols-6 h-auto">
							<TabsTrigger value="overview" className="flex flex-col items-center gap-1 py-3">
								<LayoutDashboard className="h-4 w-4" />
								<span className="text-xs">Overview</span>
							</TabsTrigger>
							<TabsTrigger value="marketing" className="flex flex-col items-center gap-1 py-3">
								<Presentation className="h-4 w-4" />
								<span className="text-xs">Marketing</span>
							</TabsTrigger>
							<TabsTrigger value="roi" className="flex flex-col items-center gap-1 py-3">
								<Calculator className="h-4 w-4" />
								<span className="text-xs">ROI Analysis</span>
							</TabsTrigger>
							<TabsTrigger value="summary" className="flex flex-col items-center gap-1 py-3">
								<FileText className="h-4 w-4" />
								<span className="text-xs">Executive Summary</span>
							</TabsTrigger>
							<TabsTrigger value="clients" className="flex flex-col items-center gap-1 py-3">
								<Users className="h-4 w-4" />
								<span className="text-xs">Client Proposals</span>
							</TabsTrigger>
							<TabsTrigger value="technical" className="flex flex-col items-center gap-1 py-3">
								<Folder className="h-4 w-4" />
								<span className="text-xs">Technical Docs</span>
							</TabsTrigger>
						</TabsList>
					</div>
				</div>

				{/* Tab Content */}
				<div className="max-w-7xl mx-auto px-8 py-8">
					<TabsContent value="overview" className="mt-0">
						<OverviewTab />
					</TabsContent>

					<TabsContent value="marketing" className="mt-0">
						<MarketingMaterialsTab />
					</TabsContent>

					<TabsContent value="roi" className="mt-0">
						<ROIAnalysisTab />
					</TabsContent>

					<TabsContent value="summary" className="mt-0">
						<ExecutiveSummaryTab />
					</TabsContent>

					<TabsContent value="clients" className="mt-0">
						<ClientProposalsTab />
					</TabsContent>

					<TabsContent value="technical" className="mt-0">
						<TechnicalDocumentationTab />
					</TabsContent>
				</div>
			</Tabs>
		</div>
	);
};

export default UnifiedBusinessHub;