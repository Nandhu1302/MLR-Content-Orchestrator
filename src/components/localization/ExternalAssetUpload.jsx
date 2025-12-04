import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  FileText, 
  File, 
  X, 
  CheckCircle, 
  AlertCircle,
  ArrowRight,
  Loader2 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export const ExternalAssetUpload = ({
  onAssetCreated,
  onCancel
}) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [assetName, setAssetName] = useState('');
  const [assetDescription, setAssetDescription] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  
  const { toast } = useToast();

  const handleFileSelect = useCallback((files) => {
    const newFiles = Array.from(files).map(file => ({
      file,
      id: `file-${Date.now()}-${Math.random()}`,
      status: 'pending'
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);
    
    // Auto-generate asset name from first file if empty
    if (!assetName && newFiles.length > 0) {
      const fileName = newFiles[0].file.name;
      const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
      setAssetName(nameWithoutExt);
    }
  }, [assetName]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const extractContentFromFile = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const content = e.target?.result;
        
        // Basic content extraction based on file type
        if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
          resolve(content);
        } else if (file.type === 'application/json') {
          try {
            const jsonData = JSON.parse(content);
            // Extract readable content from JSON
            const extractedText = extractTextFromJSON(jsonData);
            resolve(extractedText);
          } catch {
            resolve(content);
          }
        } else {
          // For other file types, return raw content for now
          // In production, you'd use proper document parsing libraries
          resolve(content);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  const extractTextFromJSON = (data) => {
    if (typeof data === 'string') return data;
    if (Array.isArray(data)) return data.map(extractTextFromJSON).join('\n');
    if (typeof data === 'object' && data !== null) {
      return Object.values(data).map(extractTextFromJSON).join('\n');
    }
    return String(data);
  };

  const processFiles = async () => {
    if (uploadedFiles.length === 0) {
      toast({
        title: "No Files",
        description: "Please upload at least one file to continue.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setProcessingProgress(0);

    try {
      const processedFiles = [];
      
      for (let i = 0; i < uploadedFiles.length; i++) {
        const file = uploadedFiles[i];
        setProcessingProgress(((i + 1) / uploadedFiles.length) * 100);
        
        try {
          const extractedContent = await extractContentFromFile(file.file);
          
          const processedFile = {
            ...file,
            status: 'completed',
            extractedContent,
            metadata: {
              fileName: file.file.name,
              fileSize: file.file.size,
              fileType: file.file.type,
              wordCount: extractedContent.split(' ').filter(w => w.trim()).length,
              characterCount: extractedContent.length
            }
          };
          
          processedFiles.push(processedFile);
        } catch (error) {
          processedFiles.push({
            ...file,
            status: 'error'
          });
        }
      }
      
      setUploadedFiles(processedFiles);
      
      toast({
        title: "Files Processed",
        description: `Successfully processed ${processedFiles.filter(f => f.status === 'completed').length} of ${processedFiles.length} files`,
      });
      
    } catch (error) {
      toast({
        title: "Processing Error",
        description: "Failed to process files. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const createAsset = () => {
    const processedFiles = uploadedFiles.filter(f => f.status === 'completed');
    
    if (processedFiles.length === 0) {
      toast({
        title: "No Processed Files",
        description: "Please process files before creating the asset.",
        variant: "destructive"
      });
      return;
    }

    // Combine content from all files
    const combinedContent = processedFiles
      .map(f => f.extractedContent)
      .filter(Boolean)
      .join('\n\n');

    // Create asset object
    const asset = {
      id: `external-${Date.now()}`,
      name: assetName || 'Uploaded Content',
      description: assetDescription,
      source_module: 'external_upload',
      asset_type: 'document',
      status: 'draft',
      primary_content: {
        title: assetName,
        body: combinedContent,
        sections: processedFiles.map((file, index) => ({
          title: file.metadata?.fileName || `Section ${index + 1}`,
          content: file.extractedContent,
          metadata: file.metadata
        }))
      },
      metadata: {
        uploadedFiles: processedFiles.length,
        totalWordCount: processedFiles.reduce((sum, f) => sum + (f.metadata?.wordCount || 0), 0),
        fileTypes: [...new Set(processedFiles.map(f => f.metadata?.fileType))],
        uploadedAt: new Date().toISOString()
      },
      project_name: assetName,
      reusabilityScore: 85 // Default score for external content
    };

    onAssetCreated(asset);
  };

  const getFileIcon = (fileName) => {
    const ext = fileName.toLowerCase().split('.').pop();
    switch (ext) {
      case 'txt':
      case 'md':
        return <FileText className="h-4 w-4" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  const canCreateAsset = uploadedFiles.length > 0 && 
                        uploadedFiles.some(f => f.status === 'completed') && 
                        assetName.trim().length > 0 &&
                        !isProcessing;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Upload External Content</h2>
          <p className="text-muted-foreground">
            Upload content files to create a new asset for localization
          </p>
        </div>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>

      {/* File Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Files</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
              isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"
            )}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">Drop files here or click to select</p>
            <p className="text-sm text-muted-foreground mb-4">
              Supported formats: TXT, JSON, and other text files
            </p>
            <input
              type="file"
              multiple
              accept=".txt,.json,.md,.csv"
              onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
              className="hidden"
              id="file-input"
            />
            <label htmlFor="file-input">
              <Button variant="outline" className="cursor-pointer">
                Select Files
              </Button>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Asset Information */}
      <Card>
        <CardHeader>
          <CardTitle>Asset Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Asset Name *</label>
            <Input
              value={assetName}
              onChange={(e) => setAssetName(e.target.value)}
              placeholder="Enter asset name..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={assetDescription}
              onChange={(e) => setAssetDescription(e.target.value)}
              placeholder="Optional description for this asset..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Uploaded Files ({uploadedFiles.length})
              {!isProcessing && (
                <Button 
                  onClick={processFiles}
                  disabled={uploadedFiles.every(f => f.status === 'completed')}
                  size="sm"
                >
                  Process Files
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {isProcessing && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Processing files...</span>
                </div>
                <Progress value={processingProgress} />
              </div>
            )}
            
            {uploadedFiles.map((file) => (
              <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getFileIcon(file.file.name)}
                  <div>
                    <p className="text-sm font-medium">{file.file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.file.size / 1024).toFixed(1)} KB
                      {file.metadata && ` • ${file.metadata.wordCount} words`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={
                    file.status === 'completed' ? 'default' :
                    file.status === 'error' ? 'destructive' :
                    file.status === 'processing' ? 'secondary' : 'outline'
                  }>
                    {file.status === 'completed' && <CheckCircle className="h-3 w-3 mr-1" />}
                    {file.status === 'error' && <AlertCircle className="h-3 w-3 mr-1" />}
                    {file.status}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(file.id)}
                    disabled={isProcessing}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          onClick={createAsset}
          disabled={!canCreateAsset}
        >
          Create Asset & Start Phase 1
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};