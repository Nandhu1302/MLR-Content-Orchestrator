import React, { useState } from 'react';
import { FileText, FileSpreadsheet, Presentation, Image, Layers, Eye, Download, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArchitectureDiagramGallery } from '@/components/diagrams/ArchitectureDiagramGallery';
import { GanttChartModal } from './GanttChartModal';
import { DocumentPreviewModal } from './DocumentPreviewModal';
import { generateSolutionArchitecture, generateGlocalizationArchitecture } from '@/utils/architectureExport';
import { generateGanttChartExcel } from '@/utils/ganttChartExport';
import { generateProjectPlanDocument } from '@/utils/projectPlanExport';
import { generateBusinessModelPresentation } from '@/utils/businessModelPresentationExport';
import { generateGlocalizationArchitectureDocument } from '@/utils/glocalizationArchitectureDocExport';
import { generateFocused3ModelPresentation } from '@/utils/focused3ModelPresentation';
import { generateGlocalizationProjectPlan } from '@/utils/glocalizationProjectPlan';
import {
  getProjectPlanPreview,
  getBusinessModelsPreview,
  getFocused3ModelsPreview,
  getGlocalizationPlanPreview,
  getSolutionArchitecturePreview,
  getGlocalizationArchitecturePreview,
  getUCBRFPResponsePreview
} from '@/utils/documentPreviews';
import { toast } from 'sonner';
import { UCBRFPDownload } from '@/components/UCBRFPDownload';

export const TechnicalDocumentationSection = () => {
  const navigate = useNavigate();
  const [showGanttModal, setShowGanttModal] = useState(false);
  const [previewModal, setPreviewModal] = useState({
    isOpen: false,
    title: '',
    description: '',
    type: 'ppt',
    sections: [],
    onDownload: () => {},
  });

  const handleDownload = async (generator, name) => {
    try {
      await generator();
      toast.success(`${name} downloaded successfully!`, {
        description: 'Check your downloads folder.',
      });
    } catch (error) {
      toast.error(`Failed to download ${name}`, {
        description: 'Please try again or contact support.',
      });
    }
  };

  const diagramsDoc = {
    id: 'diagrams',
    title: 'Architecture Diagrams Gallery',
    description: 'Visual gallery of 8 professional diagrams with inline viewing and individual export options (PNG/SVG/PDF)',
    badge: 'Interactive',
    size: 'View Online',
    icon: Image,
    component: <ArchitectureDiagramGallery />,
  };

  const architectureDocuments = [
    {
      id: 'solution-arch',
      title: 'Solution Architecture Presentation',
      description: 'Comprehensive PowerPoint with architecture overview, design patterns, deployment strategy',
      badge: 'PPT',
      size: '~5-8 MB',
      icon: Presentation,
      onDownload: () => handleDownload(generateSolutionArchitecture, 'Solution Architecture'),
      onView: () => setPreviewModal({
        isOpen: true,
        title: 'Solution Architecture Presentation',
        description: 'Comprehensive PowerPoint with architecture overview, design patterns, deployment strategy',
        type: 'ppt',
        sections: getSolutionArchitecturePreview(),
        onDownload: () => handleDownload(generateSolutionArchitecture, 'Solution Architecture'),
      }),
    },
    {
      id: 'glocalization-arch',
      title: 'Glocalization Architecture Deep Dive',
      description: 'Detailed PowerPoint with C4 diagrams, ERD, API specs, NFRs, AI engine details',
      badge: 'PPT',
      size: '~2-3 MB',
      icon: Layers,
      onDownload: () => handleDownload(generateGlocalizationArchitecture, 'Glocalization Deep Dive'),
      onView: () => setPreviewModal({
        isOpen: true,
        title: 'Glocalization Architecture Deep Dive',
        description: 'Detailed PowerPoint with C4 diagrams, ERD, API specs, NFRs, AI engine details',
        type: 'ppt',
        sections: getGlocalizationArchitecturePreview(),
        onDownload: () => handleDownload(generateGlocalizationArchitecture, 'Glocalization Deep Dive'),
      }),
    },
    {
      id: 'arch-doc',
      title: 'Architecture Documentation',
      description: 'Technical specifications and implementation guide in Word format',
      badge: 'DOCX',
      size: '~1-2 MB',
      icon: FileText,
      onDownload: () => handleDownload(generateGlocalizationArchitectureDocument, 'Architecture Documentation'),
      onView: () => setPreviewModal({
        isOpen: true,
        title: 'Architecture Documentation',
        description: 'Technical specifications and implementation guide in Word format',
        type: 'docx',
        sections: getGlocalizationArchitecturePreview(),
        onDownload: () => handleDownload(generateGlocalizationArchitectureDocument, 'Architecture Documentation'),
      }),
    },
  ];

  const planningDocs = [
    {
      id: "brand-excellence",
      title: "Brand Excellence Platform - Interactive Document",
      description: "Comprehensive framework document with AI models, prompts, data flows, and competitive analysis for UCB RFI",
      badge: "Interactive",
      size: "View Online",
      icon: FileText,
      isInteractive: true,
      onNavigate: () => navigate('/brand-excellence-document'),
    },
    {
      id: "ucb-rfp",
      title: "UCB RFP Response",
      description: "Strategic response available in Word (35-40 pages detailed narrative) and PowerPoint (70+ slides presentation format)",
      badge: "Word + PPT",
      size: "~5 MB total",
      icon: FileText,
      component: <UCBRFPDownload />,
      onView: () => setPreviewModal({
        isOpen: true,
        title: "UCB RFP Response - Content Operations Platform",
        description: "Strategic response to UCB Content Operations RFI - Available in Word and PowerPoint formats",
        type: "ppt",
        sections: getUCBRFPResponsePreview(),
        onDownload: () => handleDownload(() => import("@/utils/ucbRFPResponsePresentation").then(m => m.generateUCBRFPResponsePresentation()), "UCB RFP response presentation")
      })
    },
    {
      id: 'project-plan',
      title: 'Project Plan Document',
      description: 'Complete project plan with phases, milestones, resources, risks',
      badge: 'DOCX',
      size: '~1-2 MB',
      icon: FileText,
      onDownload: () => handleDownload(generateProjectPlanDocument, 'Project Plan'),
      onView: () => setPreviewModal({
        isOpen: true,
        title: 'Project Plan Document',
        description: 'Complete project plan with phases, milestones, resources, risks',
        type: 'docx',
        sections: getProjectPlanPreview(),
        onDownload: () => handleDownload(generateProjectPlanDocument, 'Project Plan'),
      }),
    },
    {
      id: 'business-models',
      title: 'Business Models Presentation',
      description: 'Comprehensive analysis of 9 business models with detailed frameworks and market positioning',
      badge: 'PPT',
      size: '~3-5 MB',
      icon: Presentation,
      onDownload: () => handleDownload(generateBusinessModelPresentation, 'Business Models'),
      onView: () => setPreviewModal({
        isOpen: true,
        title: 'Business Models Presentation',
        description: 'Comprehensive analysis of 9 business models with detailed frameworks and market positioning',
        type: 'ppt',
        sections: getBusinessModelsPreview(),
        onDownload: () => handleDownload(generateBusinessModelPresentation, 'Business Models'),
      }),
    },
    {
      id: 'focused-3-models',
      title: 'Top 3 Business Models (Focused)',
      description: 'Concise analysis of 3 recommended models with detailed decision criteria and ROI projections',
      badge: 'PPT',
      size: '~2-3 MB',
      icon: Presentation,
      onDownload: () => handleDownload(generateFocused3ModelPresentation, 'Top 3 Business Models'),
      onView: () => setPreviewModal({
        isOpen: true,
        title: 'Top 3 Business Models (Focused)',
        description: 'Concise analysis of 3 recommended models with detailed decision criteria and ROI projections',
        type: 'ppt',
        sections: getFocused3ModelsPreview(),
        onDownload: () => handleDownload(generateFocused3ModelPresentation, 'Top 3 Business Models'),
      }),
    },
    {
      id: 'glocalization-plan',
      title: 'Glocalization Module Project Plan',
      description: 'High-level implementation plan for standalone glocalization module using existing prototype framework',
      badge: 'PPT',
      size: '~2-3 MB',
      icon: FileText,
      onDownload: () => handleDownload(generateGlocalizationProjectPlan, 'Glocalization Project Plan'),
      onView: () => setPreviewModal({
        isOpen: true,
        title: 'Glocalization Module Project Plan',
        description: 'High-level implementation plan for standalone glocalization module using existing prototype framework',
        type: 'ppt',
        sections: getGlocalizationPlanPreview(),
        onDownload: () => handleDownload(generateGlocalizationProjectPlan, 'Glocalization Project Plan'),
      }),
    },
  ];

  const renderDocCard = (doc) => {
    const Icon = doc.icon;

    if ('component' in doc) {
      return (
        <div key={doc.id} className="bg-card border border-border rounded-lg p-5 hover:shadow-md transition-shadow flex flex-col h-full">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg shrink-0">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <h3 className="text-sm font-semibold text-foreground">{doc.title}</h3>
                <span className="text-xs px-2 py-0.5 bg-accent rounded font-medium shrink-0">
                  {doc.badge}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">{doc.description}</p>
              <p className="text-xs text-muted-foreground font-medium">{doc.size}</p>
            </div>
          </div>
          <div className="mt-auto">
            {doc.component}
          </div>
        </div>
      );
    }

    if ('isInteractive' in doc && doc.isInteractive) {
      return (
        <div key={doc.id} className="bg-card border border-border rounded-lg p-5 hover:shadow-md transition-shadow flex flex-col h-full">
          <div className="flex items-start gap-3 flex-1">
            <div className="p-2 bg-primary/10 rounded-lg shrink-0">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0 flex flex-col">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <h3 className="text-sm font-semibold text-foreground">{doc.title}</h3>
                <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded font-medium shrink-0">
                  {doc.badge}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">{doc.description}</p>
              <p className="text-xs text-muted-foreground font-medium mb-4">{doc.size}</p>
            </div>
          </div>
          <div className="mt-auto">
            <Button
              variant="default"
              size="sm"
              className="w-full"
              onClick={doc.onNavigate}
            >
              <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
              Open Document
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div key={doc.id} className="bg-card border border-border rounded-lg p-5 hover:shadow-md transition-shadow flex flex-col h-full">
        <div className="flex items-start gap-3 flex-1">
          <div className="p-2 bg-primary/10 rounded-lg shrink-0">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0 flex flex-col">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <h3 className="text-sm font-semibold text-foreground">{doc.title}</h3>
              <span className="text-xs px-2 py-0.5 bg-accent rounded font-medium shrink-0">
                {doc.badge}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mb-2">{doc.description}</p>
            <p className="text-xs text-muted-foreground font-medium mb-4">{doc.size}</p>
          </div>
        </div>
        <div className="flex gap-2 mt-auto">
          {'onView' in doc && doc.onView && (
            <Button
              variant="default"
              size="sm"
              className="flex-1"
              onClick={doc.onView}
            >
              <Eye className="h-3.5 w-3.5 mr-1.5" />
              View
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className={`${'onView' in doc && doc.onView ? 'flex-1' : 'w-full'}`}
            onClick={doc.onDownload}
          >
            <Download className="h-3.5 w-3.5 mr-1.5" />
            Download
          </Button>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="space-y-10">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Technical Documentation</h2>
          <p className="text-muted-foreground">
            Comprehensive architecture, design, and planning documentation
          </p>
        </div>

        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-5">
              <Layers className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-semibold text-foreground">Architecture & Design</h3>
            </div>
            
            <div className="mb-6">
              {renderDocCard(diagramsDoc)}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {architectureDocuments.map(renderDocCard)}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-5">
              <FileText className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-semibold text-foreground">Project Planning & Execution</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {planningDocs.map(renderDocCard)}
            </div>
          </div>
        </div>
      </div>
      
      <GanttChartModal open={showGanttModal} onOpenChange={setShowGanttModal} />
      <DocumentPreviewModal
        isOpen={previewModal.isOpen}
        onClose={() => setPreviewModal({ ...previewModal, isOpen: false })}
        title={previewModal.title}
        description={previewModal.description}
        type={previewModal.type}
        sections={previewModal.sections}
        onDownload={previewModal.onDownload}
      />
    </>
  );
};