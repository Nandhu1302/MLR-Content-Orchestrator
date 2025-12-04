import { useState, useEffect } from "react";
import { useBrand } from "@/contexts/BrandContext";
import { useAllBrandDocuments } from "@/hooks/useAllBrandDocuments";
import { getCategoryConfig, DOCUMENT_CATEGORIES } from "@/config/documentCategories";
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
import { VisualAssetsTab } from "@/components/evidence/VisualAssetsTab";
import { useVisualAssets } from "@/hooks/useVisualAssets";
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
  Boxes,
  Image
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ManualParseButton } from "@/components/documents/ManualParseButton";
import { ReprocessButton } from "@/components/documents/ReprocessButton";

export const BrandDocumentLibraryModal = ({ open, onOpenChange, brandId }) => {
  const { selectedBrand } = useBrand();
  const effectiveBrandId = brandId || selectedBrand?.id;
  const { data, isLoading, refetch } = useAllBrandDocuments(effectiveBrandId);
  const { toast } = useToast();
  
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [collapsedCategories, setCollapsedCategories] = useState(new Set());
  const [viewingDocument, setViewingDocument] = useState(null);
  const [mainView, setMainView] = useState('documents');
  
  const { claims, references, segments, safetyStatements, isLoading: evidenceLoading } = useEvidenceLibrary(effectiveBrandId);
  const { data: modules } = useContentModules(effectiveBrandId);
  const { data: visualAssets } = useVisualAssets(effectiveBrandId);
  
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
        { event: `parsing-progress-${doc.id}` },
        (payload) => {
          console.log('Progress update:', payload);
          setLiveProgress(prev => ({
            ...prev,
            [doc.id]: payload.payload
          }));
        }
      );
    });
    
    channel.subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [data?.documents, refetch]);

  const handleUploadComplete = () => {
    setUploadModalOpen(false);
    refetch();
  };

  const handleDownload = async (document) => {
    if (!document.document_url) {
      toast({
        title: "Download failed",
        description: "Document URL not found",
        variant: "destructive",
      });
      return;
    }

    try {
      // Extract the file path from the document_url
      const urlParts = document.document_url.split('/');
      const filePath = urlParts.slice(urlParts.indexOf('brand-documents') + 1).join('/');
      
      const { data, error } = await supabase.storage
        .from('brand-documents')
        .download(filePath);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = document.document_title || 'document.pdf';
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Download started",
        description: `Downloading ${document.document_title}`,
      });
    } catch (error) {
      console.error('Error downloading document:', error);
      toast({
        title: "Download failed",
        description: error instanceof Error ? error.message : "Failed to download document",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (document) => {
    if (!confirm(`Are you sure you want to delete "${document.document_title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const { error: dbError } = await supabase
        .from('brand_documents')
        .delete()
        .eq('id', document.id);

      if (dbError) throw dbError;

      if (document.document_url) {
        // Extract the file path from the document_url
        const urlParts = document.document_url.split('/');
        const filePath = urlParts.slice(urlParts.indexOf('brand-documents') + 1).join('/');
        
        const { error: storageError } = await supabase.storage
          .from('brand-documents')
          .remove([filePath]);

        if (storageError) console.error('Error deleting file from storage:', storageError);
      }

      toast({
        title: "Document deleted",
        description: `${document.document_title} has been deleted`,
      });

      refetch();
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: "Delete failed",
        description: error instanceof Error ? error.message : "Failed to delete document",
        variant: "destructive",
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

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"><CheckCircle className="h-3 w-3 mr-1" />Parsed</Badge>;
      case 'processing':
        return <Badge className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20"><Clock className="h-3 w-3 mr-1 animate-spin" />Processing</Badge>;
      case 'pending':
        return <Badge className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Failed</Badge>;
      default:
        return <Badge variant="outline"><AlertTriangle className="h-3 w-3 mr-1" />Unknown</Badge>;
    }
  };

  // Filter documents
  const filteredDocuments = data?.documents.filter(doc => {
    const matchesSearch = doc.document_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.document_category?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || doc.document_category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || doc.parsing_status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  }) || [];

  // Group documents by category
  const documentsByCategory = filteredDocuments.reduce((acc, doc) => {
    const category = doc.document_category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(doc);
    return acc;
  }, {});

  const renderDocumentCard = (document) => {
    const categoryConfig = getCategoryConfig(document.document_category);
    const Icon = categoryConfig?.icon || FileText;
    const progress = liveProgress[document.id];

    return (
      <Card key={document.id} className="group hover:shadow-lg transition-all duration-200">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className={`p-2 rounded-lg ${categoryConfig?.color || 'bg-gray-100'}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-base line-clamp-2 mb-1">{document.document_title}</CardTitle>
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="outline" className="text-xs">{categoryConfig?.label || document.document_category}</Badge>
                  {getStatusBadge(document.parsing_status)}
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {(document.parsing_status === 'processing' || document.parsing_status === 'pending') && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  {progress?.stage || 'Initializing...'}
                </span>
                <span className="font-medium">
                  {progress?.progress || document.parsing_progress || 0}%
                </span>
              </div>
              <Progress value={progress?.progress || document.parsing_progress || 0} className="h-1.5" />
              {progress?.message && (
                <p className="text-xs text-muted-foreground">{progress.message}</p>
              )}
            </div>
          )}
          
          {document.parsing_status === 'failed' && document.error_message && (
            <div className="p-2 bg-destructive/10 border border-destructive/20 rounded text-xs text-destructive">
              {document.error_message}
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <div>Pages: {document.page_count || 'N/A'}</div>
            <div>Size: {document.file_size_bytes ? `${(document.file_size_bytes / 1024 / 1024).toFixed(2)} MB` : 'N/A'}</div>
            <div className="col-span-2">Uploaded: {formatDistanceToNow(new Date(document.created_at))} ago</div>
          </div>

          {document.document_tags && document.document_tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {document.document_tags.map((tag, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">{tag}</Badge>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 pt-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1"
              onClick={() => setViewingDocument(document)}
              disabled={document.parsing_status !== 'completed'}
            >
              <Eye className="h-3.5 w-3.5 mr-1" />
              View
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleDownload(document)}
            >
              <Download className="h-3.5 w-3.5" />
            </Button>
            {(document.parsing_status === 'failed' || document.parsing_status === 'pending') && (
              <ManualParseButton 
                documentId={document.id}
                onParseComplete={refetch}
              />
            )}
            {document.parsing_status === 'completed' && (
              <ReprocessButton
                documentId={document.id}
                documentTitle={document.document_title || undefined}
                onReprocessComplete={refetch}
              />
            )}
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleDelete(document)}
              className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderDocumentRow = (document) => {
    const categoryConfig = getCategoryConfig(document.document_category);
    const Icon = categoryConfig?.icon || FileText;
    const progress = liveProgress[document.id];

    return (
      <Card key={document.id} className="group hover:shadow-md transition-all duration-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className={`p-2 rounded-lg ${categoryConfig?.color || 'bg-gray-100'} shrink-0`}>
              <Icon className="h-5 w-5" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm line-clamp-1 mb-1">{document.document_title}</h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline" className="text-xs">{categoryConfig?.label || document.document_category}</Badge>
                    {getStatusBadge(document.parsing_status)}
                    <span>•</span>
                    <span>{document.page_count || 'N/A'} pages</span>
                    <span>•</span>
                    <span>{document.file_size_bytes ? `${(document.file_size_bytes / 1024 / 1024).toFixed(2)} MB` : 'N/A'}</span>
                    <span>•</span>
                    <span>Uploaded {formatDistanceToNow(new Date(document.created_at))} ago</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setViewingDocument(document)}
                    disabled={document.parsing_status !== 'completed'}
                  >
                    <Eye className="h-3.5 w-3.5 mr-1" />
                    View
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleDownload(document)}
                  >
                    <Download className="h-3.5 w-3.5" />
                  </Button>
                  {(document.parsing_status === 'failed' || document.parsing_status === 'pending') && (
                    <ManualParseButton 
                      documentId={document.id}
                      onParseComplete={refetch}
                    />
                  )}
                  {document.parsing_status === 'completed' && (
                    <ReprocessButton
                      documentId={document.id}
                      documentTitle={document.document_title || undefined}
                      onReprocessComplete={refetch}
                    />
                  )}
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleDelete(document)}
                    className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {(document.parsing_status === 'processing' || document.parsing_status === 'pending') && (
                <div className="space-y-1 mb-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{progress?.stage || 'Initializing...'}</span>
                    <span className="font-medium">{progress?.progress || document.parsing_progress || 0}%</span>
                  </div>
                  <Progress value={progress?.progress || document.parsing_progress || 0} className="h-1.5" />
                  {progress?.message && (
                    <p className="text-xs text-muted-foreground">{progress.message}</p>
                  )}
                </div>
              )}

              {document.parsing_status === 'failed' && document.error_message && (
                <div className="p-2 bg-destructive/10 border border-destructive/20 rounded text-xs text-destructive mb-2">
                  {document.error_message}
                </div>
              )}

              {document.document_tags && document.document_tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {document.document_tags.map((tag, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">{tag}</Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[95vw] max-w-7xl max-h-[90vh] overflow-hidden p-0">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle className="flex items-center gap-2">
              <Library className="h-5 w-5" />
              Brand Document Library
            </DialogTitle>
          </DialogHeader>

          <div className="px-6 pb-6 overflow-y-auto max-h-[calc(90vh-80px)]">
            <Tabs value={mainView} onValueChange={(v) => setMainView(v)} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="documents" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Documents ({data?.stats.total || 0})
                </TabsTrigger>
                <TabsTrigger value="evidence" className="flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  Evidence Library
                </TabsTrigger>
              </TabsList>

              <TabsContent value="documents" className="space-y-6">
                {/* Controls */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search documents..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {Object.entries(DOCUMENT_CATEGORIES).map(([key, cat]) => (
                        <SelectItem key={key} value={key}>{cat.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="completed">Parsed</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
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
                    <Button variant="outline" size="icon" onClick={() => refetch()}>
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button onClick={() => setUploadModalOpen(true)}>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                  </div>
                </div>

                {/* Documents Display */}
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                      <Skeleton key={i} className="h-64 w-full" />
                    ))}
                  </div>
                ) : filteredDocuments.length === 0 ? (
                  <div className="text-center py-12 px-4 border-2 border-dashed rounded-lg">
                    <Library className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Documents Found</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {searchQuery || categoryFilter !== 'all' || statusFilter !== 'all'
                        ? 'Try adjusting your filters'
                        : 'Upload documents to get started'}
                    </p>
                    {!searchQuery && categoryFilter === 'all' && statusFilter === 'all' && (
                      <Button onClick={() => setUploadModalOpen(true)}>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Documents
                      </Button>
                    )}
                  </div>
                ) : viewMode === 'grid' ? (
                  <div className="space-y-8">
                    {Object.entries(documentsByCategory).map(([category, docs]) => {
                      const categoryConfig = getCategoryConfig(category);
                      const Icon = categoryConfig?.icon || FileText;
                      const isCollapsed = collapsedCategories.has(category);

                      return (
                        <div key={category}>
                          <button
                            onClick={() => toggleCategory(category)}
                            className="flex items-center gap-2 mb-4 group hover:opacity-80 transition-opacity"
                          >
                            <div className={`p-2 rounded-lg ${categoryConfig?.color || 'bg-gray-100'}`}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <h3 className="text-lg font-semibold">{categoryConfig?.label || category}</h3>
                            <Badge variant="secondary">{docs.length}</Badge>
                            {isCollapsed ? (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronUp className="h-4 w-4 text-muted-foreground" />
                            )}
                          </button>

                          {!isCollapsed && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {docs.map(renderDocumentCard)}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="space-y-8">
                    {Object.entries(documentsByCategory).map(([category, docs]) => {
                      const categoryConfig = getCategoryConfig(category);
                      const Icon = categoryConfig?.icon || FileText;
                      const isCollapsed = collapsedCategories.has(category);

                      return (
                        <div key={category}>
                          <button
                            onClick={() => toggleCategory(category)}
                            className="flex items-center gap-2 mb-4 group hover:opacity-80 transition-opacity"
                          >
                            <div className={`p-2 rounded-lg ${categoryConfig?.color || 'bg-gray-100'}`}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <h3 className="text-lg font-semibold">{categoryConfig?.label || category}</h3>
                            <Badge variant="secondary">{docs.length}</Badge>
                            {isCollapsed ? (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronUp className="h-4 w-4 text-muted-foreground" />
                            )}
                          </button>

                          {!isCollapsed && (
                            <div className="space-y-2">
                              {docs.map(renderDocumentRow)}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="evidence" className="space-y-6">
                <Tabs defaultValue="claims" className="w-full">
                  <TabsList className="grid w-full grid-cols-6">
                    <TabsTrigger value="claims" className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Claims ({claims?.length || 0})
                    </TabsTrigger>
                    <TabsTrigger value="references" className="flex items-center gap-2">
                      <FileType className="h-4 w-4" />
                      References ({references?.length || 0})
                    </TabsTrigger>
                    <TabsTrigger value="segments" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Segments ({segments?.length || 0})
                    </TabsTrigger>
                    <TabsTrigger value="safety" className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Safety ({safetyStatements?.length || 0})
                    </TabsTrigger>
                    <TabsTrigger value="modules" className="flex items-center gap-2">
                      <Boxes className="h-4 w-4" />
                      Modules ({modules?.length || 0})
                    </TabsTrigger>
                    <TabsTrigger value="visuals" className="flex items-center gap-2">
                      <Image className="h-4 w-4" />
                      Visuals ({visualAssets?.length || 0})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="claims" className="mt-6">
                    <ClinicalClaimsTab claims={claims || []} />
                  </TabsContent>

                  <TabsContent value="references" className="mt-6">
                    <ClinicalReferencesTab references={references || []} brandId={effectiveBrandId} />
                  </TabsContent>

                  <TabsContent value="segments" className="mt-6">
                    <ContentSegmentsTab segments={segments || []} />
                  </TabsContent>

                  <TabsContent value="safety" className="mt-6">
                    <SafetyStatementsTab safetyStatements={safetyStatements || []} />
                  </TabsContent>

                  <TabsContent value="modules" className="mt-6">
                    <ContentModulesTab modules={modules || []} />
                  </TabsContent>

                  <TabsContent value="visuals" className="mt-6">
                    <VisualAssetsTab visualAssets={visualAssets || []} />
                  </TabsContent>
                </Tabs>
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>

      {/* Document Upload Modal */}
      <Dialog open={uploadModalOpen} onOpenChange={setUploadModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DocumentUploadModal
            brandId={effectiveBrandId}
            onUploadComplete={handleUploadComplete}
          />
        </DialogContent>
      </Dialog>

      {/* Document Evidence Viewer */}
      {viewingDocument && (
        <Dialog open={!!viewingDocument} onOpenChange={() => setViewingDocument(null)}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden p-0">
            <div className="overflow-y-auto max-h-[90vh]">
              <DocumentEvidenceViewer document={viewingDocument} />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};