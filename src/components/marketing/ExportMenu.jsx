
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileText, Image, Package, Link2, Presentation } from "lucide-react";

const ExportMenu = ({
  currentSlide,
  onExportPDF,
  onExportPNG,
  onExportAllPNG,
  onExportPPT,
  onCopyLink,
  isExporting,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={isExporting}>
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Export Options</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={onExportPDF}>
          <FileText className="w-4 h-4 mr-2" />
          Export as PDF (Print)
        </DropdownMenuItem>

        <DropdownMenuItem onClick={onExportPNG}>
          <Image className="w-4 h-4 mr-2" />
          Download Current Slide (PNG)
        </DropdownMenuItem>

        <DropdownMenuItem onClick={onExportAllPNG}>
          <Package className="w-4 h-4 mr-2" />
          Download All Slides (ZIP)
        </DropdownMenuItem>

        <DropdownMenuItem onClick={onExportPPT}>
          <Presentation className="w-4 h-4 mr-2" />
          Download PowerPoint (Editable)
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={onCopyLink}>
          <Link2 className="w-4 h-4 mr-2" />
          Copy Slide Link
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportMenu;
