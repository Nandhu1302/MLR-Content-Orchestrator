
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useBrand } from "@/contexts/BrandContext";
import {
  Library,
  Search,
  Copy,
  CheckCircle,
  Clock,
  TrendingUp
} from "lucide-react";
import { toast } from "sonner";

const ApprovedContentLibraryPanel = ({ onInsert }) => {
  const { selectedBrand } = useBrand();
  const [approvedContent, setApprovedContent] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    loadApprovedContent();
  }, [selectedBrand?.id]);

  const loadApprovedContent = async () => {
    if (!selectedBrand?.id) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("pre_approved_content_library")
        .select("*")
        .eq("brand_id", selectedBrand.id)
        .order("usage_count", { ascending: false });
      if (error) throw error;
      setApprovedContent(data || []);
    } catch (error) {
      console.error("Error loading approved content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInsertContent = async (content) => {
    document.dispatchEvent(
      new CustomEvent("smartInsertTemplate", {
        detail: {
          insertionType: content.module_type || "module",
          insertionText: content.content_text
        }
      })
    );

    await supabase
      .from("pre_approved_content_library")
      .update({
        usage_count: content.usage_count + 1,
        last_used_at: new Date().toISOString()
      })
      .eq("id", content.id);

    toast.success(`Inserted ${content.mlr_code}`);
    onInsert?.(content.content_text);
  };

  const handleCopyContent = (text, code) => {
    navigator.clipboard.writeText(text);
    toast.success(`Copied ${code}`);
  };

  const getFilteredContent = () => {
    let filtered = approvedContent;
    if (filterType !== "all") {
      filtered = filtered.filter((c) => c.module_type === filterType);
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.content_text.toLowerCase().includes(query) ||
          c.mlr_code.toLowerCase().includes(query) ||
          c.module_type?.toLowerCase().includes(query)
      );
    }
    return filtered;
  };

  const moduleTypes = [
    ...new Set(approvedContent.map((c) => c.module_type).filter(Boolean))
  ];

  const getTypeColor = (type) => {
    switch (type) {
      case "indication":
        return "default";
      case "efficacy":
        return "secondary";
      case "safety":
        return "destructive";
      case "mechanism":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <Library className="h-4 w-4" />
            Approved Content Library
          </h3>
          <Badge variant="secondary" className="text-xs">
            {approvedContent.length} Items
          </Badge>
        </div>
        <div className="relative mb-3">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
          <Input
            placeholder="Search by text or MLR code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-7 h-8 text-xs"
          />
        </div>
        <div className="flex flex-wrap gap-1">
          <Button
            size="sm"
            variant={filterType === "all" ? "default" : "ghost"}
            onClick={() => setFilterType("all")}
            className="text-xs px-2 py-1 h-6"
          >
            All
          </Button>
          {moduleTypes.map((type) => (
            <Button
              key={type}
              size="sm"
              variant={filterType === type ? "default" : "ghost"}
              onClick={() => setFilterType(type)}
              className="text-xs px-2 py-1 h-6 capitalize"
            >
              {type}
            </Button>
          ))}
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {isLoading ? (
            <div className="text-center py-8">
              <Library className="h-8 w-8 text-muted-foreground mx-auto mb-2 animate-pulse" />
              <p className="text-sm text-muted-foreground">
                Loading approved content...
              </p>
            </div>
          ) : getFilteredContent().length === 0 ? (
            <div className="text-center py-8">
              <Library className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
              <p className="text-sm text-muted-foreground">No content found</p>
              {searchQuery && (
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => setSearchQuery("")}
                  className="text-xs"
                >
                  Clear search
                </Button>
              )}
            </div>
          ) : (
            getFilteredContent().map((content) => (
              <Card key={content.id} className="hover:shadow-sm transition-shadow">
                <CardHeader className="pb-2 pt-3 px-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className="text-xs font-mono">
                        {content.mlr_code}
                      </Badge>
                      {content.module_type && (
                        <Badge
                          variant={getTypeColor(content.module_type)}
                          className="text-xs capitalize"
                        >
                          {content.module_type}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <TrendingUp className="h-3 w-3" />
                      {content.usage_count}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 px-3 pb-3">
                  <p className="text-xs leading-relaxed line-clamp-3 mb-2">
                    {content.content_text}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {new Date(content.approval_date).toLocaleDateString()}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-xs h-7 px-2"
                        onClick={() =>
                          handleCopyContent(content.content_text, content.mlr_code)
                        }
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        className="text-xs h-7"
                        onClick={() => handleInsertContent(content)}
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Insert
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

// ✅ Export the component
export default ApprovedContentLibraryPanel;
