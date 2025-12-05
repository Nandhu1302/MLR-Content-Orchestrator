import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useBrand } from "@/contexts/BrandContext";
import { useAllBrandDocuments } from "@/hooks/useAllBrandDocuments";
import { getCategoryConfig, DOCUMENT_CATEGORIES } from "@/config/documentCategories";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentUploadModal } from "@/components/documents/DocumentUploadModal";
import { DocumentEvidenceViewer } from "@/components/documents/DocumentEvidenceViewer";
import { useEvidenceLibrary } from "@/hooks/useEvidenceLibrary";
import { useContentModules } from "@/hooks/useContentModules";
import { ClinicalClaimsTab } from "@/components/evidence/ClinicalClaimsTab";
import { ClinicalReferencesTab } from "@/components/evidence/ClinicalReferencesTab";
import { ContentSegmentsTab } from "@/components/evidence/ContentSegmentsTab";
import { SafetyStatementsTab } from "@/components/evidence/SafetyStatementsTab";
import { ContentModulesTab } from "@/components/evidence/ContentModulesTab";
import { 
  Library, 
  Upload, 
  Search, 
  Grid3x3, 
  List, 
  Download,
  Trash2,
  RefreshCw,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  FileText,
  ChevronDown,
  ChevronUp,
  Eye,
  Database,
  BookOpen,
  FileType,
  Boxes
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ManualParseButton } from "@/components/documents/ManualParseButton";

const BrandDocumentLibrary = () => {
  const navigate = useNavigate();
  const { selectedBrand } = useBrand();
  const { data, isLoading, refetch } = useAllBrandDocuments(selectedBrand?.id);
  const { toast } = useToast();
  
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [collapsedCategories, setCollapsedCategories] = useState(new Set());
  const [viewingDocument, setViewingDocument] = useState(null);
  const [mainView, setMainView] = useState('documents');
  
  const { claims, references, segments, safetyStatements, isLoading: evidenceLoading } = useEvidenceLibrary(selectedBrand?.id);
  const { data: modules } = useContentModules(selectedBrand?.id);
  
  // Real-time progress tracking with live progress updates
  const [liveProgress, setLiveProgress] = useState({});
  
  useEffect(() => {
    if (!data?.documents) return;
    
    const processingDocs = data.documents.filter(
      doc => doc.parsing_status === 'processing' || doc.parsing_status === 'pending'
    );
    
    if (processingDocs.length === 0) return;
    
    const channel = supabase
      .channel('brand-documents-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'brand_documents'
        },
        (payload) => {
          console.log('Document update received:', payload);
          refetch();
        }
      );
    
    // Subscribe to parsing progress broadcasts for each processing document
    processingDocs.forEach(doc => {
      channel.on(
        'broadcast',
        { event: 'parsing_progress' },
        (payload) => {
          if (payload.payload?.documentId === doc.id) {
            setLiveProgress(prev => ({
              ...prev,
              [doc.id]: payload.payload
            }));
          }
        }
      );
    });
    
    channel.subscribe();
    
    return () => {
      supabase.removeChannel(channel);
      setLiveProgress({});
    };
  }, [data?.documents, refetch]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-emerald-500"><CheckCircle className="h-3 w-3 mr-1" />Parsed</Badge>;
      case 'processing':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1 animate-spin" />Processing</Badge>;
      case 'pending':
        return <Badge className="bg-amber-500"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Failed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleDeleteDocument = async (documentId, documentTitle) => {
    if (!confirm(`Are you sure you want to delete "${documentTitle}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('brand_documents')
        .delete()
        .eq('id', documentId);

      if (error) throw error;

      toast({
        title: "Document Deleted",
        description: `"${documentTitle}" has been removed from your library.`,
      });

      refetch();
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete the document. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleReparse = async (documentId, documentTitle) => {
    toast({
      title: "Re-parsing Document",
      description: `Starting re-parse of "${documentTitle}"...`,
    });

    try {
      const { error } = await supabase.functions.invoke('parse-brand-document', {
        body: { documentId }
      });

      if (error) throw error;

      toast({
        title: "Re-parse Started",
        description: "Document is being re-parsed. This may take a few minutes.",
      });

      setTimeout(() => refetch(), 2000);
    } catch (error) {
      console.error('Error re-parsing document:', error);
      toast({
        title: "Re-parse Failed",
        description: "Failed to re-parse the document. Please try again.",
        variant: "destructive"
      });
    }
  };

  const toggleCategory = (category) => {
    setCollapsedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  // Filter documents
  const filteredDocuments = data?.documents.filter(doc => {
    const matchesSearch = searchQuery === '' || 
      doc.document_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.document_tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = categoryFilter === 'all' || doc.document_category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || doc.parsing_status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  }) || [];

  // Group filtered documents by category
  const documentsByCategory = {};
  filteredDocuments.forEach(doc => {
    const category = doc.document_category || 'other';
    if (!documentsByCategory[category]) {
      documentsByCategory[category] = [];
    }
    documentsByCategory[category].push(doc);
  });

  if (!selectedBrand) {
    return (
      <div className="h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Card className="max-w-md">
            <CardContent className="pt-6">
              <div className="text-center">
                <Library className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Brand Selected</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Please select a brand to view its document library
                </p>
                <Button onClick={() => navigate('/')}>
                  Go to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex flex-col">
      <Header />
      
      <div className="flex-1 overflow-y-auto">
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-[2560px]">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Library className="h-8 w-8" />
                Document & Evidence Library
              </h1>
              <p className="text-muted-foreground mt-2">
                {selectedBrand.brand_name} • Manage documents and view extracted evidence
              </p>
            </div>
            <div className="flex gap-3">
              <div className="flex gap-2">
                <Button
                  variant={mainView === 'documents' ? 'default' : 'outline'}
                  onClick={() => setMainView('documents')}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Documents
                </Button>
                <Button
                  variant={mainView === 'evidence' ? 'default' : 'outline'}
                  onClick={() => setMainView('evidence')}
                >
                  <Database className="h-4 w-4 mr-2" />
                  All Evidence
                </Button>
              </div>
              <Button onClick={() => setUploadModalOpen(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Upload Documents
              </Button>
            </div>
          </div>

          {/* Documents View */}
          {mainView === 'documents' && (
            <>
              {/* Filters and Controls */}
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search documents, tags..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="w-full md:w-[200px]">
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {Object.entries(DOCUMENT_CATEGORIES).map(([key, config]) => (
                          <SelectItem key={key} value={key}>{config.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full md:w-[200px]">
                        <SelectValue placeholder="All Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="completed">Parsed</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex gap-2">
                      <Button
                        variant={viewMode === 'grid' ? 'default' : 'outline'}
                        size="icon"
                        onClick={() => setViewMode('grid')}
                      >
                        <Grid3x3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={viewMode === 'list' ? 'default' : 'outline'}
                        size="icon"
                        onClick={() => setViewMode('list')}
                      >
                        <List className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Loading State */}
              {isLoading && (
                <div className="space-y-4">
                  <Skeleton className="h-[200px] w-full" />
                  <Skeleton className="h-[200px] w-full" />
                </div>
              )}

              {/* Empty State */}
              {!isLoading && filteredDocuments.length === 0 && (
                <Card>
                  <CardContent className="pt-12 pb-12 text-center">
                    <Library className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">
                      {data?.documents.length === 0 ? 'No Documents Yet' : 'No Documents Found'}
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {data?.documents.length === 0 
                        ? 'Upload your first document to get started'
                        : 'Try adjusting your filters or search query'}
                    </p>
                    {data?.documents.length === 0 && (
                      <Button onClick={() => setUploadModalOpen(true)}>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Your First Document
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Documents by Category */}
              {!isLoading && filteredDocuments.length > 0 && (
            <div className="space-y-6">
              {Object.entries(documentsByCategory).map(([category, docs]) => {
                const config = getCategoryConfig(category);
                const Icon = config.icon;
                const isCollapsed = collapsedCategories.has(category);

                return (
                  <Card key={category}>
                    <CardHeader 
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => toggleCategory(category)}
                    >
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Icon className={`h-5 w-5 ${config.color}`} />
                          <span>{config.label}</span>
                          <Badge variant="secondary">{docs.length}</Badge>
                        </div>
                        {isCollapsed ? <ChevronDown className="h-5 w-5" /> : <ChevronUp className="h-5 w-5" />}
                      </CardTitle>
                    </CardHeader>
                    {!isCollapsed && (
                      <CardContent>
                        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'}>
                          {docs.map(doc => (
                            <Card key={doc.id} className={`${viewMode === 'list' ? 'flex items-center' : ''}`}>
                              <CardContent className={viewMode === 'list' ? 'flex items-center justify-between w-full py-4' : 'pt-6'}>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2 mb-3">
                                    <div className="flex items-center gap-2 min-w-0">
                                      <FileText className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                                      <h4 className="font-semibold text-sm truncate">{doc.document_title}</h4>
                                    </div>
                                    {getStatusBadge(doc.parsing_status)}
                                  </div>
                                  
                                  {/* Progress Bar for Processing Documents */}
                                  {(doc.parsing_status === 'processing' || doc.parsing_status === 'pending') && (() => {
                                    const live = liveProgress[doc.id];
                                    const progress = live?.percentage || doc.parsing_progress || 0;
                                    const stage = live?.stage || (doc.parsing_status === 'pending' ? 'Starting...' : 'Parsing in progress');
                                    const timeRemaining = live?.estimatedSecondsRemaining;
                                    
                                    return (
                                      <div className="mb-3 space-y-1">
                                        <div className="flex items-center justify-between text-xs">
                                          <span className="text-muted-foreground truncate flex-1 mr-2">
                                            {stage}
                                          </span>
                                          <span className="font-medium text-blue-600 flex-shrink-0">
                                            {Math.round(progress)}%
                                          </span>
                                        </div>
                                        <Progress 
                                          value={progress} 
                                          className="h-2"
                                        />
                                        {timeRemaining && timeRemaining > 0 && (
                                          <p className="text-xs text-muted-foreground">
                                            ~{timeRemaining}s remaining
                                          </p>
                                        )}
                                      </div>
                                    );
                                  })()}
                                  
                                  <div className="space-y-2 text-xs text-muted-foreground">
                                    <div>
                                      {doc.file_size_bytes && `${(doc.file_size_bytes / 1024 / 1024).toFixed(2)} MB`}
                                      {doc.page_count && ` • ${doc.page_count} pages`}
                                    </div>
                                    <div>
                                      Uploaded {formatDistanceToNow(new Date(doc.created_at), { addSuffix: true })}
                                    </div>
                                    {doc.error_message && doc.parsing_status === 'failed' && (
                                      <div className="text-red-600 text-xs mt-2 p-2 bg-red-50 rounded">
                                        {doc.error_message}
                                      </div>
                                    )}
                                    {doc.document_tags && doc.document_tags.length > 0 && (
                                      <div className="flex flex-wrap gap-1">
                                        {doc.document_tags.map(tag => (
                                          <Badge key={tag} variant="outline" className="text-xs">
                                            {tag}
                                          </Badge>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div className={`flex ${viewMode === 'list' ? 'gap-2' : 'gap-2 mt-4'}`}>
                                  {doc.parsing_status === 'completed' && (
                                    <Button
                                      size="sm"
                                      variant="default"
                                      onClick={() => setViewingDocument(doc)}
                                    >
                                      <Eye className="h-3 w-3 mr-1" />
                                      View
                                    </Button>
                                  )}
                                  {(doc.parsing_status === 'failed' || doc.parsing_status === 'pending') && (
                                    <>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleReparse(doc.id, doc.document_title)}
                                      >
                                        <RefreshCw className="h-3 w-3 mr-1" />
                                        {doc.parsing_status === 'failed' ? 'Retry' : 'Parse'}
                                      </Button>
                                      <ManualParseButton
                                        documentId={doc.id}
                                        onParseComplete={() => refetch()}
                                      />
                                    </>
                                  )}
                                  {doc.parsing_status === 'completed' && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleReparse(doc.id, doc.document_title)}
                                    >
                                      <RefreshCw className="h-3 w-3 mr-1" />
                                      Re-parse
                                    </Button>
                                  )}
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleDeleteDocument(doc.id, doc.document_title)}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                );
              })}
                </div>
              )}
            </>
          )}

          {/* Evidence Summary View */}
          {mainView === 'evidence' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-6 w-6" />
                  All Extracted Evidence
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Browse all claims, references, segments, and safety statements extracted from your documents
                </p>
              </CardHeader>
              <CardContent>
                {evidenceLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-32" />
                    <Skeleton className="h-32" />
                  </div>
                ) : (
                  <Tabs defaultValue="claims" className="w-full">
                    <TabsList className="grid w-full grid-cols-5">
                      <TabsTrigger value="claims">
                        <Database className="h-4 w-4 mr-2" />
                        Claims ({claims.length})
                      </TabsTrigger>
                      <TabsTrigger value="references">
                        <BookOpen className="h-4 w-4 mr-2" />
                        References ({references.length})
                      </TabsTrigger>
                      <TabsTrigger value="segments">
                        <FileType className="h-4 w-4 mr-2" />
                        Segments ({segments.length})
                      </TabsTrigger>
                      <TabsTrigger value="safety">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Safety ({safetyStatements.length})
                      </TabsTrigger>
                      <TabsTrigger value="modules">
                        <Boxes className="h-4 w-4 mr-2" />
                        Modules ({modules?.length || 0})
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="claims" className="mt-6">
                      {claims.length > 0 ? (
                        <ClinicalClaimsTab claims={claims} />
                      ) : (
                        <div className="text-center py-12">
                          <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">No claims extracted yet</p>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="references" className="mt-6">
                      {references.length > 0 ? (
                        <ClinicalReferencesTab references={references} brandId={selectedBrand?.id} />
                      ) : (
                        <div className="text-center py-12">
                          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">No references extracted yet</p>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="segments" className="mt-6">
                      {segments.length > 0 ? (
                        <ContentSegmentsTab segments={segments} />
                      ) : (
                        <div className="text-center py-12">
                          <FileType className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">No content segments extracted yet</p>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="safety" className="mt-6">
                      {safetyStatements.length > 0 ? (
                        <SafetyStatementsTab safetyStatements={safetyStatements} />
                      ) : (
                        <div className="text-center py-12">
                          <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">No safety statements extracted yet</p>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="modules" className="mt-6">
                      {modules && modules.length > 0 ? (
                        <ContentModulesTab modules={modules} />
                      ) : (
                        <div className="text-center py-12">
                          <Boxes className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">No content modules extracted yet</p>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                )}
              </CardContent>
            </Card>
          )}
        </main>
      </div>

      {/* Upload Modal */}
      <Dialog open={uploadModalOpen} onOpenChange={setUploadModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DocumentUploadModal
            brandId={selectedBrand?.id || ''}
            onUploadComplete={() => {
              setUploadModalOpen(false);
              refetch();
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Document Evidence Viewer Modal */}
      <Dialog open={!!viewingDocument} onOpenChange={(open) => !open && setViewingDocument(null)}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Document Evidence</DialogTitle>
          </DialogHeader>
          {viewingDocument && (
            <DocumentEvidenceViewer document={viewingDocument} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BrandDocumentLibrary;