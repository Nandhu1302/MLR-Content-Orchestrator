import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Upload, X } from "lucide-react";

const CompanyLogoUploader = () => {
  const [brands, setBrands] = useState([]);
  const [uploading, setUploading] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    try {
      const { data, error } = await supabase
        .from("brand_profiles")
        .select("*")
        .order("company");

      if (error) throw error;
      setBrands(data || []);
    } catch (error) {
      console.error("Failed to load brands:", error);
      toast({
        title: "Error",
        description: "Failed to load brands",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = async (brandId, company, file) => {
    try {
      setUploading(brandId);

      // Create a clean filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${company
        .toLowerCase()
        .replace(/\s+/g, "-")}-logo.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload file to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("brand-logos")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true, // Overwrite if exists
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("brand-logos").getPublicUrl(filePath);

      // Update brand profile with logo URL
      const { error: updateError } = await supabase
        .from("brand_profiles")
        .update({ logo_url: publicUrl })
        .eq("id", brandId);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: `Logo uploaded for ${company}`,
      });

      // Reload brands to show updated logo
      loadBrands();
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload Failed",
        description:
          error instanceof Error ? error.message : "Failed to upload logo",
        variant: "destructive",
      });
    } finally {
      setUploading(null);
    }
  };

  const handleFileChange = (brandId, company, event) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid File",
          description: "Please upload an image file",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please upload an image smaller than 2MB",
          variant: "destructive",
        });
        return;
      }

      handleFileUpload(brandId, company, file);
    }
  };

  const removeLogo = async (brandId, company, logoUrl) => {
    try {
      setUploading(brandId);

      // Extract file path from URL
      const filePath = logoUrl.split("/brand-logos/")[1];

      // Delete from storage
      const { error: deleteError } = await supabase.storage
        .from("brand-logos")
        .remove([filePath]);

      if (deleteError) throw deleteError;

      // Update brand profile
      const { error: updateError } = await supabase
        .from("brand_profiles")
        .update({ logo_url: null })
        .eq("id", brandId);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: `Logo removed for ${company}`,
      });

      loadBrands();
    } catch (error) {
      console.error("Remove error:", error);
      toast({
        title: "Remove Failed",
        description:
          error instanceof Error ? error.message : "Failed to remove logo",
        variant: "destructive",
      });
    } finally {
      setUploading(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Logo Management</CardTitle>
        <CardDescription>
          Upload company logos for brands. Logos will appear in slide footers
          when brands are selected.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="flex items-center gap-4 p-4 border rounded-lg"
            >
              <div className="flex-1">
                <Label className="text-base font-semibold">
                  {brand.company}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {brand.brand_name}
                </p>
              </div>

              {brand.logo_url ? (
                <div className="flex items-center gap-3">
                  <div className="relative w-24 h-12 border rounded flex items-center justify-center bg-muted">
                    <img
                      src={brand.logo_url}
                      alt={`${brand.company} logo`}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      removeLogo(brand.id, brand.company, brand.logo_url)
                    }
                    disabled={uploading === brand.id}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Label
                    htmlFor={`logo-${brand.id}`}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-muted transition-colors">
                      <Upload className="w-4 h-4" />
                      <span className="text-sm">
                        {uploading === brand.id
                          ? "Uploading..."
                          : "Upload Logo"}
                      </span>
                    </div>
                  </Label>
                  <Input
                    id={`logo-${brand.id}`}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      handleFileChange(brand.id, brand.company, e)
                    }
                    disabled={uploading === brand.id}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyLogoUploader;
