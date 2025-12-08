import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAllBrandDocuments } from "@/hooks/useAllBrandDocuments";

// Interface and type annotations removed
export const BrandDocumentsCard = ({ brandId }) => {
  const navigate = useNavigate();
  const { data } = useAllBrandDocuments(brandId);

  const documentCount = data?.stats.total || 0;
  const parsedCount = data?.stats.parsed || 0;

  return (
    <Card 
      className="border-l-4 border-l-blue-500 bg-blue-500/5 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => navigate('/documents')}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <FileText className="h-4 w-4 text-blue-600" />
          Brand Documents
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-center py-2 bg-card rounded-lg border border-blue-500/20">
          <div className="text-xs text-muted-foreground uppercase tracking-wide">Documents</div>
          <div className="text-3xl font-bold text-blue-600">{documentCount}</div>
          <div className="text-xs text-muted-foreground mt-1">{parsedCount} parsed</div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-card border border-border rounded p-2 text-center">
            <div className="text-muted-foreground">Total</div>
            <div className="font-semibold">{documentCount}</div>
          </div>
          
          <div className="bg-card border border-border rounded p-2 text-center">
            <div className="text-muted-foreground">Parsed</div>
            <div className="font-semibold">{parsedCount}</div>
          </div>
        </div>

        <Button 
          size="sm" 
          variant="outline" 
          className="w-full"
          onClick={(e) => { e.stopPropagation(); navigate('/documents'); }}
        >
          <FileText className="h-3 w-3 mr-2" />
          Manage Library
        </Button>
      </CardContent>
    </Card>
  );
};